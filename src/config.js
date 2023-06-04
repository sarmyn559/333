const IS_MAINNET = true // for mainnet set this to true
const NAME = 'thr33p3nny'

export default {
  crowdsale: 'KT1PqJRp9QCd29HEWSDVDD6LmoowGR7qoMoT', // mainnet updated crowdsale address
  mintery: 'KT1A4hNqioKzxfgtTMJSkGZFharDPkQtUjLw',
  pollInterval: 15000,
  get rpc () {
    return IS_MAINNET ? 'https://rpc.tzbeta.net' : 'https://rpc.ghostnet.teztnets.xyz'
  },
  get tzkt () {
    return IS_MAINNET ? 'https://api.tzkt.io/v1/' : 'https://api.ghostnet.tzkt.io/v1/'
  },
  get network () {
    return IS_MAINNET ? 'mainnet' : 'ghostnet'
  },
  get walletOptions () {
    return { name: NAME, preferredNetwork: IS_MAINNET ? 'mainnet' : 'ghostnet'}
  }
}
