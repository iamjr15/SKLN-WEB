<template>
  <b-row style="display:flex;margin-top: 10px;align-items: center;">
    <b-col md="2">
      <b-button-group style="width:100%">
        <b-button
          style="background: white; color: black;border: 0;"
          @click="gotoStudentHome"
          >HOME</b-button
        >
        <b-button
          style="background: white; color: black;border: 0;"
          @click="gotoExplore(null)"
          >BOOK</b-button
        >
      </b-button-group>
    </b-col>
    <b-col md="4"></b-col>
    <b-col md="1">
      <div>
        <b-dropdown id="dropdown-1" text="Select" class="w-130-m">
          <b-dropdown-item
            v-for="(grade, idx) of allGrades"
            :key="idx"
            @click="gotoExplore(grade.key)"
            >{{ grade.name }}</b-dropdown-item
          >
        </b-dropdown>
      </div>
    </b-col>
    <b-col md="3">
      <b-button-group style="width:100%">
        <b-button class="btn-b" @click="goToMyRequests">MY REQUESTS</b-button>
        <b-button class="btn-b" @click="goToMyClasses">MY CLASSES</b-button>
      </b-button-group>
    </b-col>
    <b-col>
      <b-dropdown variant="outline-light">
        <template v-slot:button-content>
          <b-img
            class="login-user-img"
            :src="student.personInfo.accountPicture"
            variant="outline-light"
            v-if="student.personInfo.accountPicture"
            fluid-grow
          ></b-img>
          <font-awesome-icon
            v-if="!student.personInfo.accountPicture"
            style="color:black"
            class="profile-image"
            :icon="['far', 'user']"
          />
        </template>
        <!-- <b-dropdown-item @click="editStudent">PROFILE</b-dropdown-item> -->
        <b-dropdown-item @click="signout">SIGN OUT</b-dropdown-item>
      </b-dropdown>
    </b-col>
  </b-row>
</template>

<script>
import { auth, gradesRef } from '@/store/firestore'
import { mapActions } from 'vuex'
export default {
  props: {
    studentData: {}
  },
  data() {
    return {
      loginUserIsTeacher: false,
      student: {
        personInfo: {
          firstName: null,
          lastName: null,
          email: null,
          gender: 'male',
          phone: null,
          accountType: 'student'
        },
        otpPassword: {
          otp: null,
          password: null
        },
        categoryAndGrades: {
          selectedCategory: null,
          selectedGrades: null
        },
        favoriteSubjectData: {
          selectedSubjects: [],
          language: null
        },
        leastFavoriteSubjectData: {
          selectedSubjects: [],
          language: null
        },
        hobbySubjectData: {
          selectedSubjects: []
        },
        accountPicture: null
      },
      allGrades: []
    }
  },
  mounted() {
    this.menipulateData()
    this.getDbGrades()
  },
  watch: {
    studentData: {
      handler: function() {
        this.menipulateData()
      },
      deep: true
    }
  },
  methods: {
    ...mapActions({
      setGradeToSearch: 'studentModule/SET_GRADE_TO_SEARCH',
      logout: 'LOGOUT',
      initStore: 'INIT_STORE',
      displayMessage: 'DISPLAY_MESSAGE'
    }),
    goToMyClasses() {
      this.$router.push({
        name: 'student-manage-grades',
        params: { data: this.student }
      })
    },
    gotoExplore(selectedGrade) {
      this.$router.push({ path: '/student/explore-teacher' })

      if (selectedGrade) {
        if (this.$route.name == 'student-explore-teacher') {
          this.setGradeToSearch(selectedGrade)
        } else {
          this.$router.push({
            name: 'student-explore-teacher',
            params: { selectedGradeCriteria: selectedGrade }
          })
        }
      }
    },
    gotoStudentHome() {
      this.$router.push({
        name: 'student-explore-teacher',
        params: { data: this.student }
      })
    },
    goToMyRequests() {
      this.$router.push({
        name: 'student-requests',
        params: { student: this.student }
      })
    },

    editStudent() {
      this.$router.push({
        name: 'editStudent',
        params: { data: this.student }
      })
    },
    menipulateData() {
      if (this.studentData.personInfo) {
        this.student = this.studentData
      }
    },
    async signout() {
      try {
        let res = await auth.signOut()
        this.$router.push({ path: '/' })
        this.logout(true)
        this.initStore(true)
      } catch (error) {
        this.displayMessage({
          message: 'Cannot Signout'
        })
      }
    },
    async getDbGrades() {
      let grades = await gradesRef.get()
      grades.forEach((res) => {
        let grade = res.data()
        if (grade) {
          this.allGrades.push(grade)
          this.allGrades = this.allGrades.sort((a, b) => {
            return +a.key.replace('grade_', '') - +b.key.replace('grade_', '')
          })
        }
      })
    },
    gotoAddClass() {}
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
.login-user-img {
  width: 3vw !important;
  text-align: center;
  height: 3vw;
  border: 1px solid black;
  margin-right: 20px;
  border-radius: 50%;
}
.btn-b {
  background: white;
  color: black;
  border: 0;
}
.w-130-m {
  width: 130px;
  margin-top: 5%;
}
</style>
