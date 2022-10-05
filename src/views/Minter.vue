<template>
  <div class="flex mx-auto max-w-6xl gap-8 px-4">
      <form class="flex-1" ref="form">
        <h1 class="text-yellow-500 my-8 text-2xl">Mint new artwork</h1>
        <div v-if="tokenValid" class="mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 text-yellow-400">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
            </svg>
        </div>
        <div v-else class="mb-6">
            <label for="api" class="block mb-2 text-sm font-medium text-yellow-400">Web3.storage API Token</label>
            <input v-model.trim="APIToken" @blur="validate" type="text" id="api" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" required>
            <div v-if=" errors.api" class="my-1 text-xs text-red-500">{{ errors.api }}</div>
        </div>
        <div class="mb-6">
            <label for="name" class="block mb-2 text-sm font-medium text-yellow-400">Artwork Name</label>
            <input v-model.trim="name" @blur="validate" type="text" id="name" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" required>
            <div v-if=" errors.name" class="my-1 text-xs text-red-500">{{ errors.name }}</div>
        </div>
        <div class="mb-6">
            <label class="block mb-2 text-sm font-medium text-yellow-400" for="file_input">Image file</label>
            <input @change="onImageSelect" accept=".png,.jpg,.jpeg,.gif" class="block w-full text-sm text-gray-900 bg-gray-50 rounded border border-gray-300 cursor-pointer" aria-describedby="file_input_help" id="file_input" type="file">
            <div v-if="errors.file" class="my-1 text-xs text-red-500">{{ errors.file }}</div>
            <p v-else class="mt-1 text-sm text-gray-500 dark:text-gray-300" id="file_input_help">PNG, JPG or GIF</p>
        </div>
        <div class="mb-6">
            <label class="block mb-2 text-sm font-medium text-yellow-400" for="desc">Description</label>
            <textarea @blur="validate" v-model.trim="description" id="desc" rows="4" class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded border border-gray-300 focus:ring-blue-500 focus:border-blue-500" placeholder="Description here..."></textarea>
        </div>
        <div class="mb-6">
            <label for="name" class="block mb-2 text-sm font-medium text-yellow-400">Tags</label>
            <input v-model.trim="tags" @blur="validate" type="text" id="name" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" required>
        </div>
        <div class="mb-6">
            <label class="block mb-2 text-sm font-medium text-yellow-400" for="editions">Number of editions</label>
            <input @blur="validate" v-model="editions" type="number" min="1" id="editions" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" required>
            <div v-if=" errors.editions" class="my-1 text-xs text-red-500">{{ errors.editions }}</div>
        </div>
        <div class="mb-6">
            <label class="block mb-2 text-sm font-medium text-yellow-400" for="royalties">Royalties: {{royalties}}%</label>
            <input v-model="royalties" id="royalties" type="range" min="0" max="50" step="0.1" value="10" class="w-full h-2 bg-gray-200 rounded appearance-none cursor-pointer">
            <div v-if=" errors.royalties" class="my-1 text-xs text-red-500">{{ errors.royalties }}</div>
        </div>
        <div class="mb-6">
            <button @click="onMint" type="button" class="focus:outline-none text-black bg-yellow-400 hover:bg-yellow-500 focus:ring-4 focus:ring-yellow-300 font-medium rounded text-sm px-5 py-2.5 mr-2 mb-2">Mint</button>
        </div>
    </form>
    <div class="flex-1 pt-32">
        <div>
            <img ref="preview" :src="src" alt="The artwork" class="w-full">
        </div>
        <div>
            {{ work }}
        </div>
    </div>
    <div v-if="work" class="flex inset-0 fixed bg-black bg-opacity-40 items-center justify-center">
        <div class="bg-gray-800 text-yellow-400 rounded-lg p-10 max-w-80">
            {{ work }}
        </div>
    </div>
  </div>
</template>

<script>
import resizeImgBlob from '../store/resizeimg'
import { mapState } from 'vuex'
import config from '../config'
const IMG_PLACEHOLDER = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mMsLMxVBAAEHAFyFiJkIgAAAABJRU5ErkJggg==';

export default {
  name: 'minter',
  data () {
    return {
      name: '',
      description: '',
      royalties: 10,
      editions: 1,
      artifact: null,
      display: null,
      thumbnail: null,
      minting: false,
      tags: '',
      src: IMG_PLACEHOLDER,
      errors: {},
      tokenValid: false,
    }
  },
  computed: {
    ...mapState(['userAddress', 'work']),
    APIToken: {
      set (value) {
        this.$store.commit('apiToken', value)
      },
      get () {
        return this.$store.state.APIToken
      }
    }
  },
  created () {
    if (this.userAddress !== config.owner) this.$router.replace('/')
  },
  methods: {
    validate () {
      const errors = []
      if (!this.APIToken) {
        errors.push(['api', 'Valid web3.storage API token is required!'])
      }
      if (!this.name) {
        errors.push(['name', 'Name is required'])
      }
      if (this.royalties < 0 || this.royalties > 50) {
        errors.push(['royalties', 'Royalties must be between 0 and 50 %'])
      }
      if (this.editions < 1) {
        errors.push(['editions', 'At least 1 edition is required'])
      }
      if (!this.artifact || !this.display || ! this.thumbnail) {
        errors.push(['file', 'Image Artifact is required'])
      }
      this.$set(this, 'errors', Object.fromEntries(errors))
      return errors.length === 0
    },
    async onImageSelect (event) {
      try  {
        this.validate()
        const [file] = event.target.files
        // const readStatus = 'Reading Image Artifact:'
        // this.work = readStatus + ' 0%'

        const buffer = await new Promise((resolve, reject) => {
          const filereader = new FileReader()
          filereader.onloadend = function (e) {
            resolve(e.target.result)
          }
        //   filereader.onprogress = (e) => {
        //     // this.work= `${readStatus} ${(e.total ? Math.ceil((e.loaded / e.total) * 100) : 100)}%`
        //   }
          filereader.onerror = reject
          filereader.readAsArrayBuffer(file)
        })
        console.log('MIME:', file.type)

        this.artifact = new Blob([buffer], { type: file.type })
        // this.work='Creating display image'
        this.display = await resizeImgBlob(this.artifact, 1024)
        // this.work='Creating thumbnail'
        this.thumbnail = await resizeImgBlob(this.artifact, 400)
        this.src = URL.createObjectURL(this.thumbnail)
        // console.log(this.thumbnail)
      } catch (e) {
        this.$toast.error(e.message)
      }
    },
    async onMint() {
      try {
        if (!this.validate()) {
          return
        }
        this.minting = true
        const tags = this.tags.split(',').map(tag => tag.trim()).filter(tag => !!tag)
        const ipfsUri = await this.$store.dispatch('uploadArtwork', {
          artifact: this.artifact,
          display: this.display,
          thumbnail: this.thumbnail,
          tags,
          name: this.name,
          description: this.description,
          royalties: this.royalties,
        })
        console.log(ipfsUri)
        await this.$store.dispatch('mintToken', { ipfsUri, editions: this.editions })
        this.onReset()
      } catch (e) {
        if (e.message.includes('API token')) {
          this.$store.commit('apiToken', null)
          this.$toast.error('Invalid Web3.storage API token supplied.')
        }
        this.$toast.error(e.message)
        console.log(e)
      } finally {
        this.minting = false
      }
    },
    onReset () {
      this.$refs.form.reset()
      if (this.src !== IMG_PLACEHOLDER) {
        URL.revokeObjectURL(this.src)
        this.src = IMG_PLACEHOLDER
      }
      this.name = ''
      this.tags = ''
      this.description = ''
      this.artifact = null
      this.thumbnail = null
      this.display = null
    }
  }
}
</script>

<style>
input[type=range] {
  width: 100%;
  margin: 5px 0;
  background-color: white;
  -webkit-appearance: none;
}
input[type=range]:focus {
  outline: none;
}
input[type=range]::-webkit-slider-runnable-track {
  background: rgba(255, 255, 255, 0);
  border: 0;
  border-radius: 4px;
  width: 100%;
  height: 10px;
  cursor: pointer;
}
input[type=range]::-webkit-slider-thumb {
  margin-top: -5px;
  width: 20px;
  height: 20px;
  background: #ff9600;
  border: 1px solid #ff9600;
  border-radius: 20px;
  cursor: pointer;
  -webkit-appearance: none;
}
input[type=range]:focus::-webkit-slider-runnable-track {
  background: #ffffff;
}
input[type=range]::-moz-range-track {
  background: rgba(255, 255, 255, 0);
  border: 0;
  border-radius: 4px;
  width: 100%;
  height: 10px;
  cursor: pointer;
}
input[type=range]::-moz-range-thumb {
  width: 20px;
  height: 20px;
  background: #ff9600;
  border: 1px solid #ff9600;
  border-radius: 20px;
  cursor: pointer;
}
input[type=range]::-ms-track {
  background: transparent;
  border-color: transparent;
  border-width: 6px 0;
  color: transparent;
  width: 100%;
  height: 10px;
  cursor: pointer;
}
input[type=range]::-ms-fill-lower {
  background: #f2f2f2;
  border: 0;
  border-radius: 4px;
}
input[type=range]::-ms-fill-upper {
  background: rgba(255, 255, 255, 0);
  border: 0;
  border-radius: 4px;
}
input[type=range]::-ms-thumb {
  width: 20px;
  height: 20px;
  background: #ff9600;
  border: 1px solid #ff9600;
  border-radius: 20px;
  cursor: pointer;
  margin-top: 0px;
  /*Needed to keep the Edge thumb centred*/
}
input[type=range]:focus::-ms-fill-lower {
  background: rgba(255, 255, 255, 0);
}
input[type=range]:focus::-ms-fill-upper {
  background: #ffffff;
}
/*TODO: Use one of the selectors from https://stackoverflow.com/a/20541859/7077589 and figure out
how to remove the virtical space around the range input in IE*/
@supports (-ms-ime-align:auto) {
  /* Pre-Chromium Edge only styles, selector taken from hhttps://stackoverflow.com/a/32202953/7077589 */
  input[type=range] {
    margin: 0;
    /*Edge starts the margin from the thumb, not the track as other browsers do*/
  }
}
</style>