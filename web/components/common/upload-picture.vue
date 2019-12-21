<template>
  <div>
    <b-row class="mt-5">
      <b-col class="uploadImg" md="2">
        <div :class="!picture ? 'img-border-right' : ''">
          <b-img
            src="@/assets/image/uploadImage.PNG"
            v-if="!accountPictureToShow"
            @click="openUploader"
          ></b-img>
          <b-img
            :src="accountPictureToShow"
            @change="changeSelectedPicture"
            class="img-border"
            v-else
            @click="openUploader"
          ></b-img>
        </div>
      </b-col>
      <b-col v-if="!picture" md="5">
        <h4 class="lbl-note">
          Please note logos, photos with sunglasses and the kind are not allowed
        </h4>
      </b-col>
    </b-row>
    <input
      ref="accountPicture"
      type="file"
      accept="image/*"
      @change="changeSelectedPicture"
      class="mb-2"
      style="display:none"
    />

    <b-row v-if="!loginUserIsTeacher">
      <b-col>
        <h5 class="lbl lbl-location">location</h5>
      </b-col>
    </b-row>
    <b-row v-if="!loginUserIsTeacher" class="subject-input">
      <b-col md="6">
        <font-awesome-icon class="f-ico" :icon="['far', 'compass']" />
        <vue-google-autocomplete
          id="g-place"
          style="padding-left: 3vw; width:100%"
          class="box-shadE"
          placeholder="enter location"
          @placechanged="getAddressData"
          @blur="extractAddress"
        ></vue-google-autocomplete>
      </b-col>
    </b-row>

    <b-row v-if="!picture">
      <b-col>
        <b-button variant="success" class="btn-Next" @click="goToNext">
          <span class="next">NEXT</span>
          <b-img class="next-arrow" :src="whiteArrow"></b-img>
        </b-button>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import firebase from 'firebase'
import VueGoogleAutocomplete from 'vue-google-autocomplete'
import { mapActions } from 'vuex'
import { whiteArrowImage } from '@/shared/components-data/images'

export default {
  components: {
    VueGoogleAutocomplete
  },
  props: {
    picture: {
      type: String
    },
    loginUserIsTeacher: {
      type: Boolean
    }
  },

  data() {
    return {
      accountPicture: null,
      accountPictureFile: null,
      accountPictureToShow: null,
      whiteArrow: whiteArrowImage
    }
  },
  methods: {
    ...mapActions({
      displayLoader: 'DISPLAY_LOADER'
    }),
    openUploader() {
      this.$refs.accountPicture.click()
    },
    async changeSelectedPicture(picture) {
      let self = this
      let file = picture.target.files[0]
      if (file) {
        self.accountPictureFile = file
        self.accountPictureToShow = await self.fileToBase64(file)
      }
    },
    fileToBase64(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => {
          resolve(reader.result)
        }
        reader.onerror = (error) => {
          reject(error)
        }
      })
    },
    getAddressData: function(addressData, placeResultData, id) {
      let location = {
        longitude: addressData.longitude,
        latitude: addressData.latitude
      }
      this.$emit('onSetLocation', location)
    },
    extractAddress: function() {
      google.maps.places.Autocomplete(this.getAddressData, 'place_changed')
    },

    async goToNext() {
      if (!this.accountPictureFile) {
        let message = 'Please upload your profile picture'
        this.$emit('onSetAlertMessage', message)
      } else {
        this.displayLoader(true)
        let metadata = {
          contentType: this.accountPictureFile.type
        }
        var storageRef = firebase.storage().ref()
        let uploadedImage = await storageRef
          .child(`images/${this.accountPictureFile.name}`)
          .put(this.accountPictureFile, metadata)
        let imageUrl = await uploadedImage.ref.getDownloadURL()
        this.accountPicture = imageUrl
        this.$emit('onSetAccontPicture', this.accountPicture)
        this.displayLoader(false)
      }
    }
  }
}
</script>

<style scoped>
.uploadImage-note {
  margin-top: 3rem;
  font-weight: 900;
}
.btn-icon {
  margin-left: 2rem;
}
.lbl.lbl-location {
  margin-top: 3rem;
}
.lbl-note {
  font-family: Montserrat;
  font-weight: bold;
  font-size: 1.46vw;
  line-height: 45px;
  text-align: left;
  color: #000;
}

.img-border {
  border-radius: 50%;
  width: 12.672363281249998vw;
  height: 12.34vw;
  background: #fff;
  border: 20px solid #000;
}

.img-border-right {
  height: 12.54375vw;
  background: transparent;
  padding-right: 100%;
  width: 0px;
  border-right: 4px solid #000;
}
.f-ico {
  position: absolute;
  margin-left: 15px;
  z-index: 1;
  top: 25%;
}
</style>
