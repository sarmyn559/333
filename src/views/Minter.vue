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
          <label class="block mb-2 text-sm font-medium text-yellow-400" for="file_input">Image (or mp4) file</label>
          <input @change="onImageSelect" accept=".png,.jpg,.jpeg,.gif,.mp4" class="block w-full text-sm text-gray-900 bg-gray-50 rounded border border-gray-300 cursor-pointer" aria-describedby="file_input_help" id="file_input" type="file">
          <div v-if="errors.file" class="my-1 text-xs text-red-500">{{ errors.file }}</div>
          <p v-else class="mt-1 text-sm text-gray-500 dark:text-gray-300" id="file_input_help">PNG, JPG, GIF or MP4</p>
        </div>
        <div v-if="previewRequired" class="mb-6">
            <label class="block mb-2 text-sm font-medium text-yellow-400" for="file_input2">Smaller Image preview file</label>
            <input @change="onPreviewImageSelect" accept=".png,.jpg,.jpeg,.gif" class="block w-full text-sm text-gray-900 bg-gray-50 rounded border border-gray-300 cursor-pointer" aria-describedby="file_input_help" id="file_input2" type="file">
            <div v-if="errors.preview" class="my-1 text-xs text-red-500">{{ errors.preview }}</div>
            <p v-else class="mt-1 text-sm text-gray-500 dark:text-gray-300" id="file_input_help">PNG, JPG or GIF</p>
        </div>
        <div class="mb-6">
            <label class="block mb-2 text-sm font-medium text-yellow-400" for="desc">Description</label>
            <textarea @blur="validate" v-model.trim="description" id="desc" rows="4" class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded border border-gray-300 focus:ring-blue-500 focus:border-blue-500" placeholder="Description here..."></textarea>
        </div>
        <div class="mt-6 mb-8">
          <h3 class="mb-3 text-sm font-medium text-yellow-400">Optional attributes:</h3>
          <div class="mb-2 grid grid-cols-2 gap-3">
            <label class="text-sm font-medium">Trait</label>
            <label class="text-sm font-medium">Value</label>
          </div>
          <div v-for="(t, i) in traits" :key="i" class="mb-4 flex gap-3">
            <input v-model.trim="t.name" @blur="validate" type="text" class="flex-grow bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
            <input v-model.trim="t.value" @blur="validate" type="text" class="flex-grow grow bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
            <button @click.prevent="onRemoveTrait(i)" tabindex="-1" class="p-2 opacity-50 hover:opacity-100 flex-shrink">&times;</button>
          </div>
          <div class="mb-6 flex gap-3">
            <button @click.prevent="onAddTrait" class="px-2 py-1 opacity-50 hover:opacity-100 flex-shrink text-xl">&plus;</button>
          </div>
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
            <input v-model="royalties" id="royalties" type="number" min="0" max="50" step="0.1" value="25" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
            <div v-if=" errors.royalties" class="my-1 text-xs text-red-500">{{ errors.royalties }}</div>
        </div>
        <div class="mb-6">
            <button @click="onBeforeMint" type="button" class="focus:outline-none text-black bg-yellow-400 hover:bg-yellow-500 focus:ring-4 focus:ring-yellow-300 font-medium rounded text-sm px-5 py-2.5 mr-2 mb-2">Mint</button>
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
    <div v-if="metaPreview" class="flex inset-0 fixed bg-black bg-opacity-40 items-center justify-center">
        <div class="bg-gray-50 text-black rounded-lg p-4 max-w-lg">
            <h3 class="text-xl mb-2">You are about to mint new token:</h3>
            <p class="text-sm mb-3 p-2 text-yellow-900 bg-yellow-100 rounded-sm">Check if everything is correct before continuing.</p>
            <p class="text-lg text-gray-500 mb-2">Name: <span class="text-black">{{ name }}</span></p>
            
            <p class="text-lg text-gray-500 mb-2">Description: <span class="text-black">{{ description }}</span></p>

            <div v-if="validAttributes.length" class="text-lg text-gray-500 mb-3">
              <p class="text-lg text-gray-500 mb-1">Attributes:</p>
              <ul class="pl-4 text-base text-black">
                <li v-for="(a, i) in validAttributes" class="mb-1" :key="i + a.name">{{ a.name }}: {{ a.value }}</li>
              </ul>
            </div>

            
            <p class="text-gray-500 mb-2">Tags: <span class="text-black">{{ tags }}</span></p>
            
            <h4 class="text-gray-500 mb-2">Number of editions: <span class="text-black">{{ editions }}</span></h4>
            <h4 class="text-gray-500 mb-2">Royalties: <span class="text-black">{{ royalties }}</span>%</h4>
            <div class="flex justify-between gap-4 mt-8">
                <button @click="metaPreview = false" type="button" class="border focus:outline-none focus:ring-4 font-medium rounded text-sm px-5 py-2.5 mb-2 bg-gray-800 text-white border-gray-600 hover:bg-gray-700 hover:border-gray-600 focus:ring-gray-700">Cancel</button>
                <button @click="onMint" type="button" class="focus:outline-none text-black bg-yellow-400 hover:bg-yellow-500 focus:ring-4 focus:ring-yellow-300 font-medium rounded text-sm px-5 py-2.5 mb-2">Continue</button>
            </div>
        </div>
    </div>
  </div>
</template>

<script>
import resizeImgBlob from '../store/resizeimg'
import { mapState } from 'vuex'

const IMG_PLACEHOLDER = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mMsLMxVBAAEHAFyFiJkIgAAAABJRU5ErkJggg==';

export default {
  name: 'minter',
  data () {
    return {
      name: '',
      description: '',
      royalties: 25,
      editions: 1,
      artifact: null,
      preview: null,
      display: null,
      thumbnail: null,
      minting: false,
      tags: '',
      src: IMG_PLACEHOLDER,
      errors: {},
      tokenValid: false,
      metaPreview: false,
      previewRequired: false,
      traits: [
        {name: 'Resolution', value: ''}
      ]
    }
  },
  computed: {
    ...mapState(['userAddress', 'work', 'minters']),
    APIToken: {
      set (value) {
        this.$store.commit('apiToken', value)
      },
      get () {
        return this.$store.state.APIToken
      }
    },
    validAttributes () {
      return this.traits.filter(({ name, value}) => name && value)
    }
  },
  created () {
    // if (!this.minters.includes(this.userAddress)) this.$router.replace('/')
  },
  methods: {
    onAddTrait () {
      this.traits.push({ name: '', value: '' })
    },
    onRemoveTrait (index) {
      this.traits.splice(index, 1)
      if (this.traits.length === 0) {
        this.onAddTrait()
      }
    },
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
      if (!this.artifact) {
        errors.push(['file', 'Image Artifact is required'])
      }
      if (this.previewRequired && !this.preview) {
        errors.push(['preview', 'Image preview is required'])
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

        this.preview = null

        this.previewRequired = !file.type.startsWith('image/')

        if (file.type.startsWith('image/')) {
        
          await this.createPreviewBlobs(this.artifact, 1024)
        }
        // console.log(this.thumbnail)
      } catch (e) {
        this.$toast.error(e.message)
      }
    },

    async createPreviewBlobs (fromBlob, size = 0) {

      this.display = size > 0 ? await resizeImgBlob(fromBlob, size) : fromBlob

      this.thumbnail = size > 400 ? await resizeImgBlob(fromBlob, 400) : fromBlob

      this.src = URL.createObjectURL(this.thumbnail)
    },

    async onPreviewImageSelect (event) {
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

        if(!file.type.startsWith('image/')) {
          throw new Error('Preview should be PNG, JPG or GIF image.')
        }

        this.preview = new Blob([buffer], { type: file.type })

        await this.createPreviewBlobs(this.preview)

        // console.log(this.thumbnail)
      } catch (e) {
        this.$toast.error(e.message)
      }
    },
    onBeforeMint () {
        if (!this.validate()) {
          return
        }
        this.metaPreview = true
    },
    async onMint() {
      try {
        this.metaPreview = false
        this.minting = true
        const tags = this.tags.split(',').map(tag => tag.trim()).filter(tag => !!tag)
        const ipfsUri = await this.$store.dispatch('uploadArtwork', {
          artifact: this.artifact,
          display: this.display,
          thumbnail: this.thumbnail,
          tags,
          attributes: this.validAttributes,
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
      this.previe = null
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