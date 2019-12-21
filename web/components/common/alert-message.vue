<template>
  <div v-if="alertState">
    <b-alert
      v-if="alertState.message"
      :show="alertState.dismissCountDown"
      dismissible
      :variant="alertState.varient"
      @dismissed="alertDismissed({ message: '' })"
      @dismiss-count-down="countDownChanged"
    >
      <span v-text="alertState.message" />
      <b-progress
        :variant="alertState.varient"
        :max="alertState.dismissSecs"
        :value="dismissCountDown"
        height="4px"
      ></b-progress>
    </b-alert>
  </div>
</template>

<script>
import Loader from 'vue-spinner/src/ClipLoader.vue'
import { mapGetters, mapActions } from 'vuex'

export default {
  components: {
    Loader
  },
  data() {
    return {
      dismissCountDown: 0
    }
  },
  computed: {
    ...mapGetters({
      alertState: 'GET_ALERT_STATE'
    })
  },
  methods: {
    ...mapActions({
      alertDismissed: 'DISPLAY_MESSAGE'
    }),
    countDownChanged(dismissCountDown) {
      this.dismissCountDown = dismissCountDown
    }
  }
}
</script>

<style scoped></style>
