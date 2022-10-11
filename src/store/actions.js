import config from '../config'
import { Web3Storage } from 'web3.storage/dist/bundle.esm.min.js'
import { TezosToolkit, MichelCodecPacker, MichelsonMap } from '@taquito/taquito'
import { BeaconWallet } from '@taquito/beacon-wallet'
import { char2Bytes } from '@taquito/utils'

const tezos = new TezosToolkit(config.rpc)
tezos.setPackerProvider(new MichelCodecPacker())
const wallet = new BeaconWallet(config.walletOptions)
tezos.setWalletProvider(wallet)

// const subscribeOperation = tezos.stream.subscribeOperation({
//   and: [
//     { destination: config.crowdsale }, // must be our action contract
//     { kind: OpKind.TRANSACTION }
//   ]
// })

const pool = {}

async function getContract (kt) {
  if (!pool[kt]) {
    pool[kt] = tezos.wallet.at(kt)
  }
  return await pool[kt]
}

export default {

  async init ({ commit }) {
    if (await wallet.client.getActiveAccount()) {
      const address = await wallet.getPKH()
      commit('userAddress', address)
    }
    const mintery = await getContract(config.mintery)
    const { mint_authority } = await mintery.storage()
    commit('minters', mint_authority)
    const contract = await getContract(config.crowdsale)
    const poll = async () => {
      const storage = await contract.storage()
      commit('storage', storage)
      console.log(storage)
      setTimeout(poll, config.pollInterval)
    }
    poll()
  },

  // onTransactionStream (_, cb) {
  //   subscribeOperation.on('data', cb)
  // },

  // offTransactionStream (_, cb) {
  //   subscribeOperation.off('data', cb)
  // },

  async connectWallet ({ state, commit, dispatch }) {
    let activeAccount = await wallet.client.getActiveAccount()
    console.log(activeAccount)
    try {
      if (!activeAccount) {
        await dispatch('disconnectWallet')
        await wallet.requestPermissions({
          network: {
            type: config.network
          }
        })
        activeAccount = await wallet.client.getActiveAccount()
        if (!activeAccount) {
          throw new Error('Wallet not connected')
        }
      }
      const address = await wallet.getPKH()
      commit('userAddress', address)
    } catch (e) {
      console.log(e)
      await dispatch('disconnectWallet')
    }
    return !!state.userAddress
  },

  async disconnectWallet ({ commit }) {
    await wallet.clearActiveAccount()
    commit('userAddress', null)
  },

  async buyToken ({ state, dispatch }, { amount }) {
    try {
      await dispatch('connectWallet')
      const contract = await getContract(config.crowdsale)
      console.log(amount, state.lotPrice)
      const op = await contract.methods.buy(amount).send({ amount: amount * state.lotPrice, mutez: true })
      const result = await op.confirmation()
      if (result.completed) {
        return true
      }
      throw new Error('Buy transaction failed')
    } catch (e) {
      if (e.title === 'Aborted') return false
      else throw e
    }
  },

  async uploadArtifactWithMetadata ({ state, commit }, { artifact, display, thumbnail, meta }) {
    const client = new Web3Storage({ token: state.APIToken });
    let artifactUri
    let displayUri
    let thumbnailUri
    commit('work', 'Uploading artifact')
    let cid = await client.put([new File([artifact], 'artifact', { type: artifact.type })], { wrapWithDirectory: false })
    console.log(cid)
    // let info = await ipfs.add(artifact)
    artifactUri = `ipfs://${cid}`
    displayUri = artifactUri
    if (display) {
      commit('work', 'Uploading preview')
      cid = await client.put([new File([display], 'display', { type: display.type })], { wrapWithDirectory: false })
      displayUri = `ipfs://${cid}`
    }
    thumbnailUri = displayUri
    if (thumbnail) {
      commit('work', 'Uploading thumbnail')
      cid = await client.put([new File([thumbnail], 'thumb', { type: thumbnail.type })], { wrapWithDirectory: false })
      thumbnailUri = `ipfs://${cid}`
    }
    commit('work', 'Uploading metadata')
    const now = new Date()
    const metadata = {
      date: now.toISOString(),
      artifactUri,
      displayUri,
      thumbnailUri,
      formats: [
        { uri: artifactUri, mimeType: artifact.type, fileSize: artifact.size },
        { uri: displayUri, mimeType: display.type, fileSize: display.size },
        { uri: thumbnailUri, mimeType: thumbnail.type, fileSize: thumbnail.size },
      ],
      decimals: 0,
      shouldPreferSymbol: false,
      ...meta
    }
    cid = await client.put([new File([JSON.stringify(metadata)], 'json', { type: 'application/json' })], { wrapWithDirectory: false })
    return cid
  },

  async uploadArtwork ({ state, dispatch }, { artifact, display, thumbnail, name, description, royalties, tags }) {
    const meta = {
      name,
      description,
      symbol: 'MINT',
      tags: (tags || []).map(tag => tag.trim()),
      // rights: '',
      creators: [state.userAddress],
      royalties: {
        decimals: 3,
        shares: {
          [state.userAddress]: Math.round(royalties * 10)
        }
      }
    }
    const result = await dispatch('uploadArtifactWithMetadata', { artifact, display, thumbnail, meta })
    return `ipfs://${result}`
  },

  async mintToken ({ state, dispatch, commit }, { ipfsUri, editions }) {
    try {
        commit('work', 'Wallet connect')
        await dispatch('connectWallet')
        commit('work', 'Waiting for blockchain confirmation')
        const contract = await getContract(config.mintery)
        const op = await contract.methods.mint(editions, state.userAddress, MichelsonMap.fromLiteral({ "": char2Bytes(ipfsUri) })).send();
        const result = await op.confirmation(1)
        if (result.completed) {
          return true
        }
        throw new Error('Mint transaction failed')
      } catch (e) {
        if (e.title === 'Aborted') return false
        else throw e
      } finally {
        commit('work', '')
      }
  }
}
