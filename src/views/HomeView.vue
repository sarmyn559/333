<template>
<div style="background-color:black" class="text-white">
    <nav class="flex justify-between items-center flex-row px-4 py-4 mb-8">
        <img src="/images/logo.png" class="w-16 h-16 rounded-xl">
        <router-link v-if="isOwner" to="/mint" class="border-yellow-500 border-2 rounded-lg p-4 text-2xl  transition-all hover:text-yellow-500 hover:border-white">Mint</router-link>
        <button v-if="userAddress" @click="onUnsync" class="border-yellow-500 border-2 rounded-lg p-4 text-2xl  transition-all hover:text-yellow-500 hover:border-white">{{ shortAddress }}</button>
        <button v-else @click="onSync" class="border-yellow-500 border-2 rounded-lg p-4 text-2xl  transition-all hover:text-yellow-500 hover:border-white">Connect Wallet</button>
    </nav>
    <div class="flex flex-col md:flex-row justify-center items-center max-w-4xl mx-auto gap-6 px-4 mb-16">
      <img src="images/3man1.png" alt="" class="md:w-44 md:h-44 md:mr-10 text-center ">
      <div class="speech-bubble">
        <div class="speech-bubble-in rounded-lg p-6 md:text-3xl text-2xl">
          <p class="md:tracking-tighter md:leading-relaxed">Initially thr33p3nny is available in rolls of {{ lotSize }}<br>
          {{ supply }} Rolls. {{ price }} XTZ each</p>
        </div>
      </div>
    </div>

    <div class="max-w-4xl mx-auto gap-6 px-4 mb-16 md:text-3xl text-xl">
        <div class="border-yellow-500 border-2 rounded-lg p-6">
          <p>thr33p3nny the thr33som3s utility token 
            <br>ticker: 3P</p>
          <p>Contract Address: <a :href="ktLink" class="text-lg break-all md:text-xl hover:text-yellow-400 transition-colors" target="_blank" rel="noopener nofollow">{{ token }}</a></p>
        </div>
    </div>
   
    <div class="flex justify-center relative">
      <progress class="w-3/4 md:w-1/3 mb-16 h-8 border-yellow-500 border-2 rounded-lg" :value="sold" :max="supply" />
      <div class="inset-1 absolute text-center">{{ sold }}  of {{ supply }} sold</div>
    </div>
    <div v-if="sold >= supply" class="max-w-4xl mx-auto gap-6 px-4 mb-16 md:text-3xl text-xl">
      <div class="border-yellow-500 border-2 rounded-lg p-6">
        <p>  follow the Grotto for updates on new thr33p3nny drops</p>
      </div>
    </div>
    <div v-else class="flex justify-center max-w-4xl mx-auto gap-6 px-4 mb-8">
        <button @click="onBuy(1)" class="border-yellow-500 border-2 rounded-lg py-3 px-6 text-xl md:text-2xl transition-all hover:text-yellow-500 hover:border-white">Buy 1 Roll</button>
        <button @click="onBuy(2)" class="border-yellow-500 border-2 rounded-lg py-3 px-6 text-xl md:text-2xl transition-all hover:text-yellow-500 hover:border-white">Buy 2 Rolls</button>
    </div>
   
    <div class="flex justify-center mt-20">
        <img src="/images/spin.gif" alt="spinning coin" class="w-32 h-32">
    </div>
   
    <div class="flex justify-center mt-16 space-x-9 ">
        <a href="https://discord.com/invite/grotto" target="_blank" rel="nofollow noopener">
        <img src="images/discord.png" alt="" style="width: 95px;height:70px;">
      </a>
        <a href="https://twitter.com/thr33som3s" target="_blank" rel="nofollow noopener">
        <img src="images/twitter.png" alt="" style="width: 70px;height:70px;">
      </a>
    </div>

    <div class="flex flex-wrap flex-col md:flex-row justify-center px-4 py-8 text-center mt-6">
       <span>©️ 2022 Made by Boris Grit at TezHouse</span><span>&nbsp;In collaboration with Sebuh Squad</span><span>&nbsp;for the Grotto</span>
    </div>
</div>
</template>

<script>
import { mapState } from 'vuex'
import config from '../config'

export default {
  name: 'HomeView',
  data () {
    return { working: false }
  },
  computed: {
    ...mapState(['userAddress', 'lotSize', 'lotPrice', 'supply', 'sold', 'token', 'minters']),
    ktLink () {
      return `https://better-call.dev/${config.network}/${this.token}`
    },
    price () {
      return this.lotPrice / 1000000
    },
    shortAddress () {
      const address = this.userAddress
      return address ? `${address.substring(0, 5)}...${address.substring(31, 40)}` : ''
    },
    isOwner () {
      console.log('minters', this.minters)
      return this.minters.includes(this.userAddress)
    }
  },
  async created () {
    await this.$store.dispatch('init')
  },
  methods: {
    async onSync () {
      await this.$store.dispatch('connectWallet')
    },
    async onUnsync () {
      await this.$store.dispatch('disconnectWallet')
    },
    async onBuy (amount) {
      try {
        this.working = true
        if (await this.$store.dispatch('buyToken', { amount })) {
          this.$toast.success("Buy transaction sent")
        }
      } catch (e) {
        this.$toast.error(e?.data[1]?.with?.string || e.message)
        console.log(e)
      } finally {
        this.working = false
      }
    }
  }
}
</script>
<style>
progress[value]::-webkit-progress-value {
  background-color:orange;
}
progress[value]::-moz-progress-bar {
  background-color: orange;
}
progress[value]::-webkit-progress-bar {
  background-color: #000;
  border-radius: 4px;
}
.speech-bubble {
	position: relative;
	background: orange;
	border-radius: .4em;
  padding: 2px;
}

.speech-bubble:after {
	content: '';
	position: absolute;
	top: 0;
	left: 10%;
	width: 0;
	height: 0;
	border: 21px solid transparent;
	border-bottom-color: orange;
	border-top: 0;
	margin-left: -21px;
	margin-top: -21px;
}

.speech-bubble-in {
	position: relative;
	background: #000;
	border-radius: .4em;
}
.speech-bubble-in:after {
	content: '';
	position: absolute;
	top: 0;
	left: 10%;
	width: 0;
	height: 0;
	border: 21px solid transparent;
	border-bottom-color: #000;
	border-top: 0;
	margin-left: -23px;
	margin-top: -20px;
  z-index: 2;
}
@media (min-width: 768px) {
.speech-bubble-in:after {
	content: '';
	position: absolute;
	left: 0;
	top: 50%;
	width: 0;
	height: 0;
	border: 21px solid transparent;
	border-right-color: #000;
	border-left: 0;
	margin-top: -21px;
	margin-left: -21px;
  z-index: 2;
}
.speech-bubble:after {
	content: '';
	position: absolute;
	left: 0;
	top: 50%;
	width: 0;
	height: 0;
	border: 21px solid transparent;
	border-right-color: orange;
	border-left: 0;
	margin-top: -21px;
	margin-left: -21px;
}
}
</style>