<template>
  <div>
    <b-modal
      class="map-model"
      ref="mapModal"
      hide-header
      hide-footer
      no-close-on-backdrop
      @hidden="fetchPosition(mapcenter)"
    >
      <b-row>
        <b-col class="d-flex-end" @click="fetchPosition(mapcenter)">
          <b-img style="height: 33px;" :src="crossImage"></b-img>
        </b-col>
      </b-row>
      <b-row>
        <GmapMap
          :center="mapcenter"
          ref="map"
          :zoom="15"
          :tilt="45"
          map-type-id="roadmap"
        >
          <GmapMarker
            :position="mapcenter"
            :draggable="true"
            @dragend="changeMarkerPosition"
          />
        </GmapMap>
      </b-row>
    </b-modal>
    <GmapMap ref="gmap" :center="mapcenter" style="display:none"></GmapMap>
  </div>
</template>

<script>
import { crossImage } from '@/shared/components-data/images'
import { mapActions } from 'vuex'

export default {
  props: {
    changeLocation: { type: Boolean }
  },

  data() {
    return {
      currentLocation: null,
      renderMap: false,
      crossImage: crossImage,
      mapcenter: {
        lat: 0,
        lng: 0
      }
    }
  },
  watch: {
    changeLocation: function() {
      if (this.changeLocation) {
        this.openMapModel()
      } else {
        this.closeMapModel()
      }
    }
  },
  mounted() {
    this.$refs.gmap.$mapPromise.then(() => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(this.showPosition)
      } else {
        this.displayMessage({
          message: 'Your browser do not support location',
          varient: 'warning'
        })
      }
    })
  },
  methods: {
    ...mapActions({
      displayLoader: 'DISPLAY_LOADER',
      displayMessage: 'DISPLAY_MESSAGE'
    }),
    showPosition(e) {
      this.mapcenter = {
        lat: e.coords.latitude,
        lng: e.coords.longitude
      }
      this.fetchPosition(this.mapcenter)
    },
    openMapModel() {
      this.$refs.mapModal.show()
    },
    closeMapModel() {
      this.$refs.mapModal.hide()
    },
    changeMarkerPosition(location) {
      this.mapcenter = {
        lat: location.latLng.lat(),
        lng: location.latLng.lng()
      }
      this.fetchPosition(this.mapcenter)
    },
    fetchPosition(mapcenter) {
      let geocoder = new google.maps.Geocoder()
      let self = this
      geocoder.geocode({ location: mapcenter }, (address, status) => {
        self.currentLocation = address[0].formatted_address
        let location = {
          address: self.currentLocation,
          lngLat: mapcenter
        }
        self.$emit('onPickPostition', location)
      })
    }
  }
}
</script>

<style scoped>
.vue-map-jumbotron {
  height: 23.229vw;
}
.map-model {
  width: 52vw;
  height: 23.229vw;
}
.d-flex-end {
  display: flex;
  justify-content: flex-end;
}
</style>
