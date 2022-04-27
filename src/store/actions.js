import config from '../config'
import { TezosToolkit, MichelCodecPacker, OpKind } from '@taquito/taquito'
import { BeaconWallet } from '@taquito/beacon-wallet'

const tezos = new TezosToolkit(config.rpc)
tezos.setPackerProvider(new MichelCodecPacker())
const wallet = new BeaconWallet(config.walletOptions)
tezos.setWalletProvider(wallet)

const subscribeOperation = tezos.stream.subscribeOperation({
  and: [
    { destination: config.crowdsale }, // must be our action contract
    { kind: OpKind.TRANSACTION }
  ]
})

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
    const contract = await getContract(config.crowdsale)
    const poll = async () => {
      const storage = await contract.storage()
      commit('storage', storage)
      console.log(storage)
      setTimeout(poll, config.pollInterval)
    }
    poll()
    subscribeOperation.on('data', data => {
      console.log('buy:', data.parameters?.entrypoint === 'buy')
    })
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
  }
}
