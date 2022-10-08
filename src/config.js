const IS_MAINNET = true // for mainnet set this to true
const NAME = 'thr33p3nny'

export default {
  crowdsale: 'KT1HQ4DmHLDAZtUkJoNX4MGBsnWhqtUCogL8', // put crowdsale address here
  mintery: 'KT1A4hNqioKzxfgtTMJSkGZFharDPkQtUjLw', // put mintery contract address here 
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
