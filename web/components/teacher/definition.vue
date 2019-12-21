<template>
  <div>
    <b-row>
      <b-col class="head-arrow" md="10">
        <h4 class="signup-lbl">signup to teach</h4>
        <b-img src="@/assets/image/arrow.png" class="arrow-img1"></b-img>
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
          :categoryAndGrades="teacher.categoryAndGrades"
          :loginUserIsTeacher="loginUserIsTeacher"
          @onSetSubjects="setSubjects"
          @onSetAlertMessage="setAlertMessage"
        ></Subjects>
      </tab-content>
      <tab-content>
        <b-row>
          <b-col>
            <h4 class="lbl-subject">
              upload professional photograph, which clearly shows your face.
            </h4>
          </b-col>
        </b-row>
        <UploadPicture
          :picture="teacher.accountPicture"
          :loginUserIsTeacher="loginUserIsTeacher"
          @onSetAccontPicture="setAccontPicture"
          @onSetAlertMessage="setAlertMessage"
        ></UploadPicture>
      </tab-content>
      <tab-content>
        <Qualification
          @onSetQualification="setQualification"
          @onSetAlertMessage="setAlertMessage"
        ></Qualification>
      </tab-content>
      <tab-content>
        <Experience
          @onSetExperience="setExperience"
          @onSetAlertMessage="setAlertMessage"
        />
      </tab-content>
      <tab-content>
        <Package
          @onSetPackage="setPackage"
          @onSetAlertMessage="setAlertMessage"
        ></Package>
      </tab-content>
      <template slot="footer">
        <div></div>
      </template>
    </form-wizard>
  </div>
</template>

<script>
import PersonInfo from '@/components/common/person-info'
import Experience from '@/components/teacher/experience'
import OtpPassword from '@/components/common/otp-password'
import Category from '@/components/common/category-grades-container'
import UploadPicture from '@/components/common/upload-picture'
import Subjects from '@/components/common/subjects-selection-container'
import Qualification from '@/components/common/qualification'
import Package from '@/components/teacher/package-data'
import { mapActions } from 'vuex'
export default {
  components: {
    PersonInfo,
    OtpPassword,
    Category,
    UploadPicture,
    Subjects,
    Qualification,
    Experience,
    Package
  },
  data() {
    return {
      loginUserIsTeacher: true,
      progressbarValue: 10,
      phoneNumber: {
        nationalNumber: '',
        numberToVerify: ''
      },
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
          methodology: null,
          programmingLanguage: null,
          martialArts: null,
          dance: null,
          languageSelectionFinded: false,
          computerSelectionFinded: false,
          martialArtsFinded: false,
          danceFinded: false
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
        experience: {
          classType: null,
          instituteNeme: null,
          roleInInstitute: null,
          belongToInstitute: false,
          numberOfStudents: null
        },
        packageInfo: {
          frequecy: null,
          occurance: null,
          price: null,
          studentCapacity: null,
          rateOption: null,
          paymentOptions: [],
          location: {
            longitude: 0,
            latitude: 0
          }
        }
      }
    }
  },
  methods: {
    ...mapActions({
      displayMessage: 'DISPLAY_MESSAGE'
    }),
    completeSignup() {
      this.$emit('onCompleteSignup', this.teacher)
    },
    setPersonInfo(personInfoWithNationalNumber) {
      this.teacher.personInfo = personInfoWithNationalNumber.personInfo
      this.phoneNumber = {
        nationalNumber: personInfoWithNationalNumber.nationalNumber,
        numberToVerify: personInfoWithNationalNumber.personInfo.phone
      }

      this.setProgressbarValue(25)
      this.$refs.wizard.nextTab()
    },
    setOtpPassword(otpPassword) {
      this.teacher.otpPassword = otpPassword
      this.setProgressbarValue(35)
      this.$refs.wizard.nextTab()
    },
    setCategoryAndGrades(categoryAndGrades) {
      this.teacher.categoryAndGrades = categoryAndGrades
      this.$refs.wizard.nextTab()
    },
    setSubjects(subjectData) {
      this.teacher.subjectData = subjectData
      this.setProgressbarValue(55)
      this.$refs.wizard.nextTab()
    },
    setAccontPicture(picture) {
      this.teacher.accountPicture = picture
      this.setProgressbarValue(75)
      this.$refs.wizard.nextTab()
    },
    setQualification(qualification) {
      this.teacher.qualification = qualification
      this.setProgressbarValue(90)
      this.$refs.wizard.nextTab()
    },
    setExperience(experience) {
      this.teacher.experience = experience
      this.setProgressbarValue(100)
      this.$refs.wizard.nextTab()
    },
    setPackage(packageToAdd) {
      this.teacher.packageInfo = packageToAdd
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
    },
    setAlertMessage(message) {
      this.displayMessage({ message: message })
    }
  }
}
</script>

<style>
.head-arrow {
  display: flex;
}

.lbl-margin-left {
  margin-left: 10rem;
}

.tel {
  font-weight: 700;
}
.arrow-img1 {
  height: 2.369375vw;
  margin-top: 10px;
  margin-left: 15px;
}
</style>
