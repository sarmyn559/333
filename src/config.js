const IS_MAINNET = true
const NAME = 'thr33p3nny'

// 'https://mainnet.visualtez.com',
// 'https://sebuh.net:8732'

export default {
  crowdsale: 'KT1Nrer4iUMRQm1Aan5TnkTz9EzFzwuLbvww',
  pollInterval: 15000,
  get rpc () {
    return IS_MAINNET ? 'https://sebuh.net:8732' : 'https://rpc.ithacanet.teztnets.xyz'
  },
  get tzkt () {
    return IS_MAINNET ? 'https://api.tzkt.io/v1/' : 'https://api.ithacanet.tzkt.io/v1/'
  },
  get network () {
    return IS_MAINNET ? 'mainnet' : 'ithacanet'
  },
  get walletOptions () {
    return { name: NAME, preferredNetwork: IS_MAINNET ? 'mainnet' : 'ithacanet'}
  }
}
