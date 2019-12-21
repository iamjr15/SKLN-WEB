<template>
  <div>
    <b-row style="margin-top:5em;">
      <b-col md="3">
        <b-img
          style="text-align: center;"
          src="@/assets/image/mirage-success.png"
          fluid-grow
        ></b-img>
      </b-col>
      <b-col md="7">
        <h1>Wohoooo! Registration Complete.</h1>
        <h2>Download the app, and get started.</h2>
        <h3>Here are your login credentials</h3>
        <b-row>
          <h3 v-text="'SKILLONE ID : ' + teacher.tutorCode" />
        </b-row>
        <b-row>
          <h3 v-text="'PASSWORD : ' + teacher.otpPassword.password" />
        </b-row>
        <b-row>
          <p style="font-size:33px">
            Note : Please use the above credentials to login into the app and
            start using skillone. Also please keep note of the credentials.
          </p>
        </b-row>
      </b-col>
    </b-row>
  </div>
</template>

<script>
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
          rating: '',
          experience: null,
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
  watch: {
    teacherData: {
      handler: function() {
        this.teacher = this.teacherData
      },
      deep: true
    }
  },
  methods: {
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
    }
  }
}
</script>

<style scoped></style>
