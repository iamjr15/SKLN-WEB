<template>
  <b-jumbotron>
    <b-modal
      ref="loadingModal"
      id="loader-modal"
      hide-header
      hide-footer
      no-close-on-esc
      no-close-on-backdrop
    >
      <Loader :isLoading="loaderStatus" />
    </b-modal>
    <ClassRequests :student="studentData" />
  </b-jumbotron>
</template>

<script>
import ClassRequests from '@/components/student/class-requests'
import Loader from '@/components/common/loader'
import { mapGetters, mapActions } from 'vuex'

export default {
  layout: 'student',
  components: {
    ClassRequests,
    Loader
  },
  data() {
    return {
      studentData: {}
    }
  },
  computed: {
    ...mapGetters({
      loaderStatus: 'GET_LOADER_STATE',
      studentState: 'studentModule/GET_STUDENT_DATA'
    })
  },
  watch: {
    loaderStatus(newVal, oldVal) {
      if (newVal) {
        this.$refs.loadingModal.show()
      } else {
        this.$refs.loadingModal.hide()
      }
    }
  },
  mounted() {
    if (this.$route.params.student) {
      this.studentData = this.$route.params.student
    } else {
      this.studentData = this.studentState
      this.setStudentData(this.studentData)
    }
  },
  methods: {
    ...mapActions({
      setStudentData: 'studentModule/SET_STUDENT_DATA'
    })
  }
}
</script>

<style></style>
