<template>
  <div>
    <b-row v-if="!isForShowOnly">
      <b-col>
        <h3 class="lbl-subject" v-if="loginUserIsTeacher">
          Select the subject(s) to teach
        </h3>
        <h3
          class="lbl-subject"
          v-else-if="this.categoryAndGrades.selectedCategory == 'academics'"
        >
          Select your
          <span v-if="openLeast" class="ru">least favorite</span>
          <span class="bu" v-else>favorite</span> subject
        </h3>
        <span v-else>
          <h3 class="lbl-subject">select some hobies to pursue.</h3>
          <span class="bst"
            >"All work and no play makes Jack/Jake a dull boy/girl"</span
          >
        </span>
      </b-col>
    </b-row>
    <b-row>
      <b-col class="subject-img">
        <SubjectSelector
          :isForShowOnly="isForShowOnly"
          :subjects="allSubjects"
          @onSelectSubjects="setSelectedSubjects"
        />
      </b-col>
    </b-row>
    <div v-for="(sub, index) in subjectData.selectedSubjects" :key="index">
      <div v-if="sub.question">
        <b-row>
          <b-col>
            <h3 class="lbl-subject" v-text="sub.question" />
          </b-col>
        </b-row>
        <b-row class="subject-input">
          <b-col md="4">
            <b-form-input class="box-shadE" v-model="sub.answer" />
          </b-col>
        </b-row>
      </div>
    </div>

    <b-row v-if="loginUserIsTeacher">
      <b-col>
        <h3 class="lbl-subject">
          describe your teaching methodology(min. 40 words)
        </h3>
      </b-col>
    </b-row>
    <b-row v-if="loginUserIsTeacher">
      <b-col>
        <b-form-textarea
          id="textarea-rows"
          v-model="subjectData.methodology"
          rows="6"
        ></b-form-textarea>
      </b-col>
    </b-row>
    <b-row v-if="!isForShowOnly">
      <b-col>
        <b-button variant="success" class="btn-Next" @click="goToNext">
          <span class="next">NEXT</span>
          <b-img class="next-arrow" :src="whiteArrow"></b-img>
        </b-button>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import SubjectSelector from '@/components/common/subject-selection'
import { subjectsRef, gradesRef } from '@/store/firestore'
import { whiteArrowImage } from '@/shared/components-data/images'
import { mapActions } from 'vuex'
import {
  subjectsRequiredError,
  methodologyRequiredError,
  methodologyMinimumLengthError
} from '@/shared/components-data/messages'
import _ from 'lodash'

export default {
  components: { SubjectSelector },
  props: {
    categoryAndGrades: {
      selectedGrades: { type: Array | String },
      selectedCategory: { type: String }
    },
    loginUserIsTeacher: {
      type: Boolean
    },
    openLeast: {
      type: Boolean
    },
    isForShowOnly: {
      type: Boolean,
      value: false
    },
    alreadySelectedSubjects: {
      type: Array
    }
  },
  data() {
    return {
      whiteArrow: whiteArrowImage,
      allSubjects: [],
      subjectsDataFromDb: [],
      subjectData: {
        selectedSubjects: [],
        methodology: null,
        greaterThan10Finded: -1
      }
    }
  },
  watch: {
    categoryAndGrades: {
      handler: function() {
        this.getSubjectsAccordingToCriteria()
      },
      deep: true
    },
    alreadySelectedSubjects: {
      handler: function() {
        this.getSubjectsAccordingToCriteria()
      },
      deep: true
    }
  },

  mounted() {
    this.getSubjectsFromDb()
  },
  methods: {
    ...mapActions({
      displayMessage: 'DISPLAY_MESSAGE'
    }),
    async getSubjectsFromDb() {
      let self = this
      try {
        let sortedSubjects = await subjectsRef.orderBy('order').get()
        sortedSubjects.forEach((clas) => {
          self.subjectsDataFromDb.push(clas.data())
        })
        self.getSubjectsAccordingToCriteria()
      } catch (err) {
        this.displayMessage({
          message: 'Error getting subjects'
        })
        console.error(err)
      }
    },
    setSelectedSubjects(subjects) {
      this.subjectData.selectedSubjects = subjects
    },
    goToNext() {
      let validateData = this.validateSubjectsAndMethodology()
      if (!validateData.errorFound)
        this.$emit('onSetSubjects', this.subjectData)
      else {
        let message = validateData.errorMessage
        this.$emit('onSetAlertMessage', message)
      }
    },
    validateSubjectsAndMethodology() {
      let errorFound = false
      let errorMessage = ''
      if (this.subjectData.selectedSubjects.length < 1) {
        errorMessage = subjectsRequiredError
        errorFound = true
      } else if (this.subjectData.selectedSubjects.length > 0) {
        this.subjectData.selectedSubjects.forEach((sub) => {
          if (sub.question && !sub.answer) {
            errorMessage = 'Please answer for  ' + sub.name
            errorFound = true
          }
        })
      }
      if (this.loginUserIsTeacher && !this.subjectData.methodology) {
        errorMessage = methodologyRequiredError
        errorFound = true
      } else if (
        this.loginUserIsTeacher &&
        this.subjectData.methodology &&
        this.subjectData.methodology.length < 40
      ) {
        errorMessage = methodologyMinimumLengthError
        errorFound = true
      }
      return {
        errorMessage: errorMessage,
        errorFound: errorFound
      }
    },
    async getSubjectsAccordingToCriteria() {
      let self = this
      if (
        this.alreadySelectedSubjects &&
        this.alreadySelectedSubjects.length > 0
      ) {
        if (this.categoryAndGrades.selectedCategory == 'academics') {
          this.getAlreadySelectedAcademicSubjects()
        } else {
          this.getAlreadySelectedHobbySubjects()
        }
      } else {
        if (this.categoryAndGrades.selectedCategory == 'academics') {
          let academicSubjects = await this.getAlreadyAcademicSubjectsForCriteria()
        } else {
          this.allSubjects = this.subjectsDataFromDb.filter(
            (subject) => subject.grades.hobbies
          )
        }
      }
    },
    getAlreadySelectedAcademicSubjects() {
      let sub1to10 = this.subjectsDataFromDb.filter(
        (subject) => subject.grades.grade1to5 || subject.grades.grade6to10
      )
      let sub11to12 = this.subjectsDataFromDb.filter(
        (subject) => subject.grades.grade11to12
      )
      let subForAll = this.subjectsDataFromDb.filter(
        (subject) =>
          subject.grades.grade1to5 &&
          subject.grades.grade6to10 &&
          subject.grades.grade11to12
      )
      let allSub = []
      this.alreadySelectedSubjects.forEach((res) => {
        let findLte10 = sub1to10.find((a) => a.id == res)
        if (findLte10) {
          if (allSub.findIndex((al) => al.id == res) < 0) {
            allSub.push(findLte10)
          }
        }
        let findGt10 = sub11to12.find((b) => b.id == res)
        if (findGt10) {
          if (allSub.findIndex((al) => al.id == res) < 0) {
            allSub.push(findGt10)
          }
        }
      })
      this.allSubjects = allSub.concat(subForAll)
    },
    getAlreadySelectedHobbySubjects() {
      let subhobbies = this.subjectsDataFromDb.filter(
        (subject) => subject.grades.hobbies
      )
      let subjectsForHobbies = []
      this.alreadySelectedSubjects.forEach((res) => {
        let findHobby = subhobbies.find((c) => c.id == res)
        if (findHobby) {
          subjectsForHobbies.push(findHobby)
        }
      })
      this.allSubjects = subjectsForHobbies
    },
    async getAlreadyAcademicSubjectsForCriteria() {
      let self = this
      this.subjectData.greaterThan10Finded = -1
      let gradesGreaterThan10 = []
      let grades = await gradesRef.get()
      grades.forEach((clss) => {
        let gradeToFind = clss.data()
        if (gradeToFind.key == 'grade_11' || gradeToFind.key == 'grade_12') {
          gradesGreaterThan10.push(gradeToFind.id)
        }
      })
      let selectedGrades = this.loginUserIsTeacher
        ? [...this.categoryAndGrades.selectedGrades]
        : this.categoryAndGrades.selectedGrades
      if (this.loginUserIsTeacher && selectedGrades.length > 0) {
        self.subjectData.greaterThan10Finded = self.categoryAndGrades.selectedGrades.findIndex(
          (e) => gradesGreaterThan10.includes(e.id)
        )
      } else {
        this.subjectData.greaterThan10Finded = gradesGreaterThan10.findIndex(
          (res) => res == this.categoryAndGrades.selectedGrades
        )
      }

      if (this.subjectData.greaterThan10Finded > -1) {
        this.allSubjects = this.subjectsDataFromDb.filter(
          (subject) =>
            (subject.grades.grade1to5 &&
              subject.grades.grade6to10 &&
              subject.grades.grade11to12) ||
            subject.grades.grade11to12
        )
      } else {
        this.allSubjects = this.subjectsDataFromDb.filter(
          (subject) =>
            (subject.grades.grade1to5 &&
              subject.grades.grade6to10 &&
              subject.grades.grade11to12) ||
            (subject.grades.grade1to5 && subject.grades.grade6to10)
        )
      }
    }
  }
}
</script>
<style scoped>
.btn-icon {
  margin-left: 2rem;
}

.subject-input {
  margin-top: 2rem;
}
.subject-img {
  margin-top: 2rem;
  width: 127px;
  height: 123px;
  border-radius: 12px;
}

.bu {
  text-decoration: underline;
  color: dodgerblue;
}
.ru {
  text-decoration: underline;
  color: red;
}
.bst {
  color: blue;
}
</style>
