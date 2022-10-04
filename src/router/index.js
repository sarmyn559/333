import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/HomeView.vue'
import Minter from '../views/Minter'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/mint',
    name: 'mint',
    component: Minter
  }
]

const router = new VueRouter({
  routes
})

export default router
