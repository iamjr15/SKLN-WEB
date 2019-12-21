<template>
  <b-jumbotron>
    <TeacherDashboard :teacherData="dataToShow" />
  </b-jumbotron>
</template>
<script>
import TeacherDashboard from '@/components/teacher/dashboard'
import { teacherGradesRef, teacherSubjectsRef } from '@/store/firestore'
import { mapGetters, mapActions } from 'vuex'

export default {
  layout: 'teacher',
  components: {
    TeacherDashboard
  },
  data() {
    return {
      dataToShow: {
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
    if (this.$route.params.data && this.$route.params.isLoginCase) {
      this.mapDataToViewModel(this.$route.params.data)
    } else if (this.$route.params.data && !this.$route.params.isLoginCase) {
      this.dataToShow = this.$route.params.data
    } else {
      this.dataToShow = this.teacherStoreData
    }
  },
  computed: {
    ...mapGetters({
      teacherStoreData: 'teacherModule/GET_TEACHER_DATA'
    })
  },
  methods: {
    ...mapActions({
      setTeacherData: 'teacherModule/SET_TEACHER_DATA',
      displayLoader: 'DISPLAY_LOADER'
    }),
    async mapDataToViewModel(logedInTeacher) {
      let classIdsOfTeacher = []
      let subjectIdsOfTeacher = []
      let classIds = await teacherGradesRef
        .where('id', '==', logedInTeacher.id)
        .get()
      classIds.forEach((res) => {
        let gradeId = res.data().id
        classIdsOfTeacher.push(gradeId)
      })
      let subjects = await teacherSubjectsRef
        .where('id', '==', logedInTeacher.id)
        .get()
      subjects.forEach((res) => {
        let subjectId = res.data().id
        subjectIdsOfTeacher.push(subjectId)
      })
      let teacher = {
        id: logedInTeacher.id,
        personInfo: {
          firstName: logedInTeacher.personInfo.firstName,
          lastName: logedInTeacher.personInfo.firstName,
          email: logedInTeacher.personInfo.email,
          gender: logedInTeacher.personInfo.gender,
          phone: logedInTeacher.personInfo.phone,
          accountType: 'teacher'
        },
        categoryAndGrades: {
          selectedCategory: logedInTeacher.academicInfo.selectedCategory,
          selectedGrades: classIdsOfTeacher
        },
        subjectData: {
          selectedSubjects: subjectIdsOfTeacher,
          methodology: logedInTeacher.academicInfo.teachingMethod
        },
        otpPassword: {
          otp: logedInTeacher.otpPassword.otp,
          password: logedInTeacher.otpPassword.password
        },
        accountPicture: logedInTeacher.personInfo.accountPicture,
        qualification: {
          occupation: logedInTeacher.qualification.currentOccupation,
          experience: logedInTeacher.qualification.experience,
          qualification: logedInTeacher.qualification.qualification,
          qualificationArea: logedInTeacher.qualification.qualificationArea,
          targetBoard: logedInTeacher.qualification.targetBoard,
          biodata: logedInTeacher.personInfo.biodata
        },
        packageInfo: {
          classType: logedInTeacher.academicInfo.classType,
          frequecy: logedInTeacher.packageInfo.frequency,
          occurance: logedInTeacher.packageInfo.numberOfClasses,
          price: logedInTeacher.packageInfo.price,
          rateOption: logedInTeacher.packageInfo.rateOption,
          paymentOptions: logedInTeacher.packageInfo.paymentOptions,
          location: logedInTeacher.personInfo.location
        },
        tutorCode: logedInTeacher.tutorCode
      }
      this.dataToShow = teacher
      if (teacher.personInfo.firstName) {
        this.setTeacherData(this.dataToShow)
      }
      this.displayLoader(false)
    }
  }
}
</script>
<style></style>
