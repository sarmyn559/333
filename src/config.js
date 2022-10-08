const IS_MAINNET = true // for mainnet set this to true
const NAME = 'thr33p3nny'

export default {
  crowdsale: 'KT1PqJRp9QCd29HEWSDVDD6LmoowGR7qoMoT', // mainnet updated crowdsale address
  mintery: 'KT1A4hNqioKzxfgtTMJSkGZFharDPkQtUjLw',
  pollInterval: 15000,
  get rpc () {
    return IS_MAINNET ? 'https://sebuh.net:8732' : 'https://rpc.kathmandunet.teztnets.xyz'
  },
  get tzkt () {
    return IS_MAINNET ? 'https://api.tzkt.io/v1/' : 'https://api.kathmandunet.tzkt.io/v1/'
  },
  get network () {
    return IS_MAINNET ? 'mainnet' : 'kathmandunet'
  },
  get walletOptions () {
    return { name: NAME, preferredNetwork: IS_MAINNET ? 'mainnet' : 'kathmandunet'}
  }
}
