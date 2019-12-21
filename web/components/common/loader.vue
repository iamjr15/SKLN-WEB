<template>
  <div>
    <Loader :loading="isLoading" :size="loaderSize" />
  </div>
</template>

<script>
import Loader from 'vue-spinner/src/ClipLoader.vue'
export default {
  components: {
    Loader
  },
  props: {
    isLoading: Boolean
  },
  data() {
    return {
      loaderSize: '250px',
      loadingStatus: false
    }
  }
}
</script>

<style scoped></style>
