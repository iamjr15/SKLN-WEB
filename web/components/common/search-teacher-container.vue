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
    <b-row v-if="isHomePage">
      <b-col>
        <h4 class="login-lbl" @click="goToLogin">LOGIN</h4>
      </b-col>
    </b-row>
    <TeacherSearchCriteriaBuilder
      @onFindTeacher="findTeacher"
      :selectedSubject="searchCriteria.subject"
    />
    <SearchedTeachers :searchCriteria="searchCriteria" />
  </b-jumbotron>
</template>

<script>
import SearchedTeachers from '@/components/common/searched-teachers'
import TeacherSearchCriteriaBuilder from '@/components/common/teacher-search-criteria-builder'
import Loader from '@/components/common/loader'
import { mapGetters, mapActions } from 'vuex'
export default {
  components: {
    TeacherSearchCriteriaBuilder,
    SearchedTeachers,
    Loader
  },
  props: {
    isHomePage: {
      type: Boolean
    }
  },

  data() {
    return {
      searchCriteria: {
        selectedClassTypes: [],
        locationRange: 0,
        selectedGrade: 0,
        subject: '',
        currentLocation: ''
      }
    }
  },
  mounted() {
    if (this.$route.params.searchCriteria) {
      this.searchCriteria = this.setCriteria()
    } else if (this.$route.params.selectedGradeCriteria) {
      this.setGradeToSearch(this.$route.params.selectedGradeCriteria)
    } else if (this.$route.params.data) {
      let student = this.$route.params.data
      if (student && student.personInfo.firstName) {
        this.setStudentData(student)
      }
    } else if (!this.$route.params.fromTeacher && this.isHomePage) {
      this.goToHome()
    }
  },
  computed: {
    ...mapGetters({
      loaderStatus: 'GET_LOADER_STATE'
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
  methods: {
    ...mapActions({
      setGradeToSearch: 'studentModule/SET_GRADE_TO_SEARCH',
      setStudentData: 'studentModule/SET_STUDENT_DATA'
    }),
    setCriteria() {
      let criteria = {
        selectedClassTypes: ['individual'],
        locationRange: 5,
        selectedGrade: 8,
        subject: this.$route.params.searchCriteria.subject,
        currentLocation: this.$route.params.searchCriteria.currentLocation
      }
      return criteria
    },
    findTeacher(criteria) {
      this.searchCriteria = criteria
    },
    goToLogin() {
      this.$router.push({
        path: '/',
        query: { openLoginModal: true }
      })
    },
    goToHome() {
      this.$router.push({
        path: '/'
      })
    }
  }
}
</script>

<style scoped></style>
