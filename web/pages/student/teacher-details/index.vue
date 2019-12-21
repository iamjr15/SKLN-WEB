<template>
  <b-jumbotron>
    <TeacherProfile :teacher="teacher" :gradeKey="gradeKey" />
  </b-jumbotron>
</template>

<script>
import TeacherProfile from '@/components/student/teacher-profile'
import Loader from '@/components/common/loader'

export default {
  layout: 'student',
  components: {
    TeacherProfile,
    Loader
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
          accountType: 'teacher',
          accountPicture: ''
        },
        academicInfo: {
          selectedCategory: '',
          teachingMethod: ''
        },
        location: {
          geohash: '',
          geopoint: { latitude: '', longitude: '' }
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
        qualification: {
          classType: [],
          rating: '',
          occupation: null,
          experiences: null,
          qualification: null,
          qualificationArea: null,
          targetBoard: null,
          biodata: null
        },
        experience: {
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
          paymentOptions: []
        }
      },
      gradeKey: null
    }
  },
  mounted() {
    if (this.$route.params.teacher && this.$route.params.gradeKey) {
      this.teacher = this.$route.params.teacher
      this.gradeKey = this.$route.params.gradeKey
    }
  }
}
</script>

<style scoped></style>
