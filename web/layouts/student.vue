<template>
  <div>
    <Navbar :studentData="studentData" />
    <AlertMessage />
    <nuxt />
  </div>
</template>

<script>
import Navbar from '@/components/student/navbar'
import { mapGetters, mapActions } from 'vuex'
import AlertMessage from '@/components/common/alert-message'

export default {
  middleware: 'student',
  components: {
    Navbar,
    AlertMessage
  },
  data() {
    return {
      studentData: {}
    }
  },
  mounted() {
    this.studentData = this.$route.params.data
      ? this.$route.params.data
      : this.studentStoreData
  },
  computed: {
    ...mapGetters({
      studentStoreData: ['teacherModule/GET_TEACHER_DATA']
    })
  }
}
</script>
<style scoped></style>
