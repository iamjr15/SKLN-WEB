<template>
  <b-jumbotron>
    <b-row class="mt-2">
      <b-col>
        <h1 class="m-5-c">learn something new.</h1>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <b-card @click="gotoAddClass" class="class-card">
          <b-card-text>
            <h1>already go to a class?</h1>
            <span>click to add it your classes.</span>
          </b-card-text>
        </b-card>
      </b-col>
    </b-row>
    <b-row>
      <b-col class="mt-4" style="overflow:scroll">
        <h3>Academics</h3>
        <Subjects
          :isForShowOnly="true"
          :categoryAndGrades="academicSubjects"
          :alreadySelectedSubjects="allSelectedSubjects"
          :loginUserIsTeacher="loginUserIsTeacher"
        />
      </b-col>
    </b-row>
    <b-row>
      <b-col class="mt-4" style="overflow:scroll">
        <h3>Hobbies</h3>
        <Subjects
          :isForShowOnly="true"
          :categoryAndGrades="hobbySubjects"
          :loginUserIsTeacher="loginUserIsTeacher"
          :alreadySelectedSubjects="allHobbiesSubject"
        />
      </b-col>
    </b-row>
  </b-jumbotron>
</template>

<script>
import Subjects from '@/components/common/subjects-selection-container'
import { mapActions } from 'vuex'
export default {
  components: {
    Subjects
  },
  props: {
    studentData: {}
  },
  data() {
    return {
      loginUserIsTeacher: false,
      academicSubjects: {
        selectedCategory: 'academics',
        selectedGrades: null
      },
      hobbySubjects: {
        selectedCategory: 'hobby',
        selectedGrades: null
      },
      allSelectedSubjects: [],
      allHobbiesSubject: [],
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
          selectedSubjects: []
        },
        leastFavoriteSubjectData: {
          selectedSubjects: []
        },
        hobbySubjectData: {
          selectedSubjects: []
        },
        accountPicture: null
      }
    }
  },
  mounted() {
    this.getStudentData()
  },
  watch: {
    studentData: {
      handler: function() {
        this.getStudentData()
      },
      deep: true
    }
  },
  methods: {
    ...mapActions({
      setStudentData: 'studentModule/SET_STUDENT_DATA'
    }),
    getStudentData() {
      this.student = this.studentData
      if (this.student && this.student.personInfo.firstName) {
        this.setStudentData(this.student)
        this.allSelectedSubjects = this.student.favoriteSubjectData
          ? this.student.favoriteSubjectData.selectedSubjects.concat(
              this.student.leastFavoriteSubjectData.selectedSubjects
            )
          : []
        this.allHobbiesSubject = this.student.hobbySubjectData
          ? this.student.hobbySubjectData.selectedSubjects
          : []
      }
    }
  }
}
</script>

<style scoped>
.class-card {
  background-color: #4949e1;
  color: white;
}
.m-5-c {
  text-align: center;
  margin-top: 2%;
  margin-bottom: 5%;
}
</style>
