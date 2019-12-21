<template>
  <div>
    <b-row style="display:flex">
      <b-col md="3">
        <b-button-group style="width:100%">
          <b-button @click="signout" class="b-white-0">HOME</b-button>
          <!-- <b-button style="background: white; color: black;border: 0;">PROJECT O</b-button> -->
          <b-button @click="gotoSearch" class="b-white-0">BOOK</b-button>
        </b-button-group>
      </b-col>
      <b-col></b-col>
      <b-col md="7"></b-col>
    </b-row>
  </div>
</template>
<script>
import { auth } from '@/store/firestore'
import { mapGetters, mapActions } from 'vuex'
export default {
  props: {
    teacherData: {}
  },

  data() {
    return {
      teacher: {
        personInfo: {
          firstName: null,
          lastName: null,
          email: null,
          gender: 'male',
          phone: null,
          accountType: 'teacher'
        },
        otpPassword: {
          otp: null,
          password: null
        },
        categoryAndGrades: {
          selectedCategory: null,
          selectedGrades: null
        },
        subjectData: {
          selectedSubjects: [],
          language: null,
          methodology: null
        },
        accountPicture: null,
        qualification: {
          occupation: null,
          experience: null,
          rating: '',
          qualification: null,
          qualificationArea: null,
          targetBoard: null,
          biodata: null
        },
        packageInfo: {
          classType: null,
          frequecy: null,
          occurance: null,
          price: null,
          rateOption: null,
          paymentOptions: [],
          location: null
        },
        tutorCode: ''
      }
    }
  },
  mounted() {
    this.teacher = this.teacherData
  },
  computed: {
    ...mapGetters({
      teacherStoreData: ['teacherModule/GET_TEACHER_DATA']
    })
  },
  watch: {
    teacherData: {
      handler: function() {
        this.teacher = this.teacherData
      },
      deep: true
    }
  },
  methods: {
    ...mapActions({
      logout: 'LOGOUT',
      initStore: 'INIT_STORE'
    }),
    editTeacher() {
      this.$router.push({
        name: 'editTeacher',
        params: { data: this.teacherStoreData }
      })
    },
    goToTeacherDashboard() {
      this.$router.push({
        name: 'teacher-dashboard',
        params: { data: this.teacherStoreData }
      })
    },
    gotoSearch() {
      this.initStore(true)
      this.$router.push({
        name: 'common-explore-teacher',
        params: { fromTeacher: true }
      })
    },
    goToSchedule() {
      this.$router.push({
        name: 'schedule',
        params: { teacherData: this.teacher }
      })
    },
    gotoManageClasses() {
      this.$router.push({
        name: 'manageClasses',
        params: { teacher: this.teacher }
      })
    },
    gotoPendingRequests() {
      this.$router.push({
        name: 'requests',
        params: { teacher: this.teacher }
      })
    },
    signout() {
      this.logout(true)
      this.$router.push({ path: '/' })
    }
  }
}
</script>
<style scoped>
.profile-image {
  border: 2px solid black;
  height: 39px;
  width: 39px;
  border-radius: 50%;
}
.b-white-0 {
  background: white;
  color: black;
  border: 0;
}
</style>
