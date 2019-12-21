<template>
  <div>
    <b-row>
      <b-card class="acc-pic-card">
        <b-row class="row-center">
          <h4>PROFILE</h4>
        </b-row>
        <b-card-text class="flex-center">
          <img :src="teacher.accountPicture" class="img-border" />
          <h2 style="margin-left:3vw" v-text="teacher.personInfo.firstName" />
        </b-card-text>
      </b-card>
    </b-row>
    <b-row>
      <b-button
        style="width: 100vw;"
        variant="outline-secondary"
        @click="edit('teacherProfile')"
        >Edit Profile</b-button
      >
    </b-row>
    <b-row>
      <b-button
        style="width: 100vw;"
        variant="outline-secondary"
        @click="edit('teacherPersonalDetails')"
        >Personal Details</b-button
      >
    </b-row>
    <b-row>
      <b-button
        style="width: 100vw;"
        variant="outline-secondary"
        @click="edit('managePackage')"
        >Manage Package</b-button
      >
    </b-row>
  </div>
</template>

<script>
import Multiselect from 'vue-multiselect'
import { mapGetters } from 'vuex'
export default {
  components: {
    Multiselect
  },
  data() {
    return {
      loginUserIsTeacher: true,
      progressbarValue: 10,
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
          selectedGrades: []
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
        }
      },
      grades: [],
      occupations: ['Teacher', 'Doctor', 'Lawyer', 'Pilot', 'Engineer'],
      experiences: [
        '1 year',
        '2 years',
        '3 years',
        '4 years',
        '5 years',
        '6 years',
        '7 years',
        '8 years',
        '9 years',
        '10 years'
      ],
      qualifications: [
        'Intermediate',
        'Bacholers',
        'Masters',
        'MS/M-Phill',
        'PhD'
      ],
      qualificationAreas: [
        'Science',
        'Engineering',
        'Information Technology',
        'Medical',
        'Commerce'
      ],
      targetBoards: ['cbse', 'icse', 'state board'],
      subjects: []
    }
  },
  async mounted() {
    this.teacher = this.teacherData
    let subjectsFromDb = await this.getSubjects()
    this.grades = await this.getGrades()

    let finded = -1
    let subjects1To10 = []
    let subjectsGreaterThan10 = []

    let classesGreaterThan10 = ['grade 11', 'grade 12']
    let selectedGrades = [...this.teacher.categoryAndGrades.selectedGrades]
    if (selectedGrades.length > 0) {
      classesGreaterThan10.forEach((res) => {
        finded = this.teacher.categoryAndGrades.selectedGrades.findIndex(
          (cls) => cls == res
        )
      })
    }

    this.subjectsFromDb.forEach((sub) => {
      if (sub.grades.grade1to5 && sub.grades.grade6to10) {
        subjects1To10.push(sub.name)
      } else if (sub.grades.grade11to12) {
        subjectsGreaterThan10.push(sub.name)
      }
    })
    if (finded > -1) {
      this.subjects = subjectsGreaterThan10
    } else {
      this.subjects = subjects1To10
    }
  },
  computed: {
    ...mapGetters({
      teacherData: ['teacherModule/GET_TEACHER_DATA']
    })
  },
  methods: {
    edit(selection) {
      this.$emit('edit', selection)
    },
    async getGrades() {
      let self = this
      let grades = []
      let gradesQry = await gradesRef.get()

      gradesQry.forEach((doc) => {
        let grade = doc.data()
        if (grade) {
          grades.push(grade.name)
        }
      })
      return grades
    },
    async getSubjects() {
      let self = this
      let subjects = []
      let subjectsQry = await subjectsRef.get()

      subjectsQry.forEach((doc) => {
        let subject = doc.data()
        if (subject) {
          subjects.push(subject)
        }
      })
      return subjects
    }
  }
}
</script>

<style scoped>
.img-border {
  width: 13rem;
  height: 13rem;
  border: black 0.2rem solid;
  border-radius: 50%;
}
.row-center {
  text-align: center !important;
  display: block;
}
.acc-pic-card {
  width: 100vw;
  background-image: linear-gradient(
    to right,
    rgb(255, 175, 189),
    rgb(255, 195, 160)
  );
  color: white;
}
.flex-center {
  display: flex;
  align-items: center;
}
</style>
