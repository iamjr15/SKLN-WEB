<template>
  <div>
    <AlertMessage />
    <nuxt />
  </div>
</template>
<script>
import AlertMessage from '@/components/common/alert-message'
export default {
  components: {
    AlertMessage
  }
}
</script>
