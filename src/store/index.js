import Vue from 'vue'
import Vuex from 'vuex'
import actions from './actions'

Vue.use(Vuex)
const TOKEN_PRECISION = 1000000

export default new Vuex.Store({
  state: {
    userAddress: '',
    token: '',
    supply: 100,
    lotSize: 0,
    lotPrice: 0,
    sold: 0,
    paused: false,
    APIToken: localStorage.getItem('APIToken')
  },
  getters: {
  },
  mutations: {
    storage (state, payload) {
      state.token = payload.token
      state.supply = payload.supply.toNumber(),
      state.lotSize = payload.lot_size.dividedBy(TOKEN_PRECISION).toNumber(),
      state.lotPrice = payload.lot_price.toNumber(),
      state.sold = payload.sold.toNumber(),
      state.paused = payload.paused
    },
    userAddress (state, payload) {
      state.userAddress = payload
    },
    apiToken: (state, payload) => {
      state.APIToken = payload;
      if (payload) localStorage.setItem('APIToken', payload)
      else localStorage.removeItem('APIToken')
    }
  },
  actions
})
