<template>
  <b-jumbotron>
    <b-row>
      <b-col class="head-arrow" md="10">
        <h4 class="signup-lbl">signup to learn</h4>
        <font-awesome-icon icon="arrow-right" class="fa-3x" />
      </b-col>
      <b-col>
        <h4 class="login-lbl" @click="goToLogin">LOGIN</h4>
      </b-col>
    </b-row>
    <b-row class="progressbar-and-label">
      <span class="progress-bar-text" v-text="progressbarValue + ' %'" />
      <b-col>
        <b-progress :value="progressbarValue" class="progbar"></b-progress>
      </b-col>
    </b-row>
    <form-wizard @on-complete="completeSignup" color="#28a745" ref="wizard">
      <div></div>
      <tab-content>
        <PersonInfo
          @onSetPersonInfo="setPersonInfo"
          @onSetAlertMessage="setAlertMessage"
        ></PersonInfo>
      </tab-content>
      <tab-content>
        <OtpPassword
          @onSetOtpPassword="setOtpPassword"
          @onSetAlertMessage="setAlertMessage"
          :phoneNumber="phoneNumber"
        ></OtpPassword>
      </tab-content>
      <tab-content>
        <Category
          @onSetCategoryAndGrades="setCategoryAndGrades"
          @onSetAlertMessage="setAlertMessage"
          :loginUserIsTeacher="loginUserIsTeacher"
        ></Category>
      </tab-content>
      <tab-content>
        <Subjects
          :categoryAndGrades="student.categoryAndGrades"
          :loginUserIsTeacher="loginUserIsTeacher"
          @onSetAlertMessage="setAlertMessage"
          :openLeast="openLeast"
          @onSetSubjects="setFavoriteSubjects"
        ></Subjects>
      </tab-content>
      <tab-content>
        <Subjects
          :categoryAndGrades="student.categoryAndGrades"
          :loginUserIsTeacher="loginUserIsTeacher"
          :openLeast="openLeast"
          @onSetSubjects="setLeastFavoriteSubjects"
          @onSetAlertMessage="setAlertMessage"
        ></Subjects>
      </tab-content>
      <tab-content>
        <Subjects
          v-if="showHobby"
          :categoryAndGrades="student.categoryAndGrades"
          :loginUserIsTeacher="loginUserIsTeacher"
          @onSetSubjects="setHobbySubjects"
          @onSetAlertMessage="setAlertMessage"
        ></Subjects>
      </tab-content>
      <tab-content>
        <UploadPicture
          @onSetAccontPicture="setAccontPicture"
          @onSetLocation="setLocation"
          :picture="student.personInfo.accountPicture"
          :loginUserIsTeacher="loginUserIsTeacher"
          @onSetAlertMessage="setAlertMessage"
        ></UploadPicture>
      </tab-content>
      <template slot="footer">
        <div></div>
      </template>
    </form-wizard>
  </b-jumbotron>
</template>

<script>
import PersonInfo from '@/components/common/person-info'
import OtpPassword from '@/components/common/otp-password'
import Category from '@/components/common/category-grades-container'
import UploadPicture from '@/components/common/upload-picture'
import Subjects from '@/components/common/subjects-selection-container'
import firebase from 'firebase'
import { mapActions } from 'vuex'
import * as geofirex from 'geofirex'
const geo = geofirex.init(firebase)
export default {
  components: {
    PersonInfo,
    OtpPassword,
    UploadPicture,
    Category,
    Subjects
  },
  data() {
    return {
      loginUserIsTeacher: false,
      phoneNumber: {
        nationalNumber: '',
        numberToVerify: ''
      },
      progressbarValue: 10,
      openLeast: false,
      showHobby: false,
      student: {
        personInfo: {
          firstName: null,
          lastName: null,
          email: null,
          gender: 'male',
          phone: null,
          accountPicture: null,
          accountType: 'student'
        },
        otpPassword: {
          otp: null,
          password: null
        },
        categoryAndGrades: {
          selectedCategory: null,
          selectedGrades: []
        },
        favoriteSubjectData: {
          selectedSubjects: [],
          language: null,
          programmingLanguage: null,
          languageSelectionFinded: false,
          computerSelectionFinded: false
        },
        leastFavoriteSubjectData: {
          selectedSubjects: [],
          language: null,
          programmingLanguage: null,
          languageSelectionFinded: false,
          computerSelectionFinded: false
        },
        hobbySubjectData: {
          selectedSubjects: [],
          martialArts: null,
          dance: null,
          martialArtsFinded: false,
          danceFinded: false
        },
        location: null
      }
    }
  },
  methods: {
    ...mapActions({
      displayMessage: 'DISPLAY_MESSAGE'
    }),
    completeSignup() {
      this.$emit('onCompleteSignup', this.student)
    },
    setLocation(location) {
      this.student.location = geo.point(location.latitude, location.longitude)
    },

    setPersonInfo(personInfoWithNationalNumber) {
      this.student.personInfo = personInfoWithNationalNumber.personInfo
      this.phoneNumber = {
        nationalNumber: personInfoWithNationalNumber.nationalNumber,
        numberToVerify: personInfoWithNationalNumber.personInfo.phone
      }
      this.$refs.wizard.nextTab()
      this.setProgressbarValue(25)
    },
    setOtpPassword(otpPassword) {
      this.student.otpPassword = otpPassword
      this.$refs.wizard.nextTab()
      this.setProgressbarValue(35)
    },
    setCategoryAndGrades(categoryAndGrades) {
      this.student.categoryAndGrades = categoryAndGrades
      this.$refs.wizard.nextTab()
      this.setProgressbarValue(55)
    },
    setFavoriteSubjects(favoriteSubjectData) {
      favoriteSubjectData.selectedSubjects.forEach((s) => {
        s.isFavourite = true
        s.isLeastFavorite = false
        s.isHobby = false
        s.isAcademic = false
      })
      this.student.favoriteSubjectData = favoriteSubjectData
      this.openLeast = true
      this.$refs.wizard.nextTab()
      this.setProgressbarValue(55)
    },
    setAlertMessage(message) {
      this.displayMessage({ message: message })
    },
    setLeastFavoriteSubjects(leastFavoriteSubjectData) {
      leastFavoriteSubjectData.selectedSubjects.forEach((s) => {
        s.isFavourite = false
        s.isLeastFavorite = true
        s.isHobby = false
        s.isAcademic = false
      })
      let self = this
      this.student.leastFavoriteSubjectData = leastFavoriteSubjectData
      this.showHobby = true
      setTimeout(() => {
        self.student.categoryAndGrades.selectedCategory = 'hobby'
        self.$refs.wizard.nextTab()
      }, 1)
      this.setProgressbarValue(75)
    },
    setHobbySubjects(hobbySubjectData) {
      hobbySubjectData.selectedSubjects.forEach((s) => {
        s.isFavourite = false
        s.isLeastFavorite = false
        s.isHobby = true
        s.isAcademic = false
      })
      this.student.hobbySubjectData = hobbySubjectData

      this.$refs.wizard.nextTab()
      this.setProgressbarValue(100)
    },
    setAccontPicture(picture) {
      this.student.personInfo.accountPicture = picture
      this.$refs.wizard.nextTab()
    },
    setProgressbarValue(newValue) {
      this.progressbarValue = newValue
    },
    goToLogin() {
      this.$router.push({
        path: '/',
        query: { openLoginModal: true }
      })
    }
  }
}
</script>

<style>
.btn-icon {
  margin-left: 2rem !important;
}
</style>
