<template>
  <div>
    <Navbar :teacherData="teacherData" />
    <nuxt />
  </div>
</template>

<script>
import Navbar from '@/components/teacher/navbar'
import { mapGetters, mapActions } from 'vuex'
export default {
  middleware: 'teacher',
  components: {
    Navbar
  },
  data() {
    return {
      teacherData: {}
    }
  },
  mounted() {
    this.teacherData = this.$route.params.data
      ? this.$route.params.data
      : teacherStoreData
  },
  computed: {
    ...mapGetters({
      teacherStoreData: 'teacherModule/GET_TEACHER_DATA'
    })
  }
}
</script>
<style scoped></style>
