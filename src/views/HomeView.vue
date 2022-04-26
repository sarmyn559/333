<template>
<div style="background-color:black" class="text-white">
    <nav class="flex justify-between items-center flex-row px-4 py-4 mb-20">
        <img src="/images/logo.png" class="w-16 h-16 rounded-xl">
        <button class="border-yellow-500 border-2 rounded-lg p-4 text-2xl text-yellow-500 transition-all hover:text-white hover:border-white">Connect Wallet</button>
    </nav>

    <div class="flex flex-col md:flex-row justify-center items-center max-w-4xl mx-auto gap-6 px-4 mb-16">
      <img src="images/3man1.png" alt="" class="md:w-44 md:h-44 md:mr-10 text-center ">
      <div class="border-yellow-500 border-2 rounded-lg p-6 md:text-3xl text-2xl text-yellow-500">
        <p>Initially thr33p3nny is available in rolls of 33.3</p>
        <p>100 Rolls. 33.3 XTZ each</p>
      </div>
    </div>

    <div class="max-w-4xl mx-auto gap-6 px-4 mb-8 md:text-3xl text-xl text-yellow-500">
        <div class="border-yellow-500 border-2 rounded-lg p-6">
          <p>thr33p3nny the Thr33som3s utility token 
            <br>ticker: 3P</p>
          <p>Contract Address: tzkt link</p>
        </div>
    </div>
   
    <div class="flex justify-center relative">
        <progress class="w-3/4 md:w-1/3 mb-20 h-8 text-yellow-500 border-yellow-500 border-2 rounded-lg" value="32" max="100" />
        <div class="inset-1 absolute text-center">33/100</div>
    </div>
   
    <div class="flex justify-center max-w-4xl mx-auto gap-6 px-4 mb-8">
        <button class="border-yellow-500 border-2 rounded-lg py-3 px-6 text-xl md:text-2xl text-yellow-500 transition-all hover:text-white hover:border-white">Buy 1 Roll</button>
        <button class="border-yellow-500 border-2 rounded-lg py-3 px-6 text-xl md:text-2xl text-yellow-500 transition-all hover:text-white hover:border-white">Buy 2 Rolls</button>
    </div>
   
    <div class="flex justify-center mt-20">
        <img src="" alt="spinning coin">
    </div>
   
    <div class="flex justify-center mt-16 space-x-9 ">
        <a href="https://discord.gg/FppsEtzUr4">
        <img src="images/discord.png" alt="" style="width: 95px;height:70px;">
      </a>
        <a href="https://twitter.com/houseoftez">
        <img src="images/twitter.png" alt="" style="width: 70px;height:70px;">
      </a>
    </div>

    <div class="flex flex-wrap flex-col md:flex-row justify-center px-4 py-8 text-center mt-6 text-green-500">
       <span>©️ 2022 Made by Boris Grit at TezHouse</span><span>&nbsp;In collaboration with Sebuh Squad</span><span>&nbsp;for the Grotto</span>
    </div>
</div>
</template>

<script>

export default {
  name: 'HomeView'
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
</style>