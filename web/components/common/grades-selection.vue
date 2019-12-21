<template>
  <div>
    <div :v-if="grades && grades.length > 0" class="img">
      <div v-for="(cls, index) in grades" :item="cls" :key="index">
        <span>
          <img
            :src="getGradeImage(cls.image)"
            alt="avatar"
            @click="selectGrades(cls)"
            class="class-img"
          />
          <b-form-checkbox
            class="class-check"
            @change="selectGrades(cls)"
            v-if="loginUserIsTeacher"
            :checked="selectedGrades.findIndex((a) => a.id == cls.id) > -1"
          ></b-form-checkbox>
          <b-form-radio
            name="cls"
            v-else
            :value="cls.id"
            v-model="selectedStudentGrades"
            @change="selectGrades(cls)"
            class="class-check"
          ></b-form-radio>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import { gradesRef } from '@/store/firestore'
import { getGradeImage } from '@/shared/components-data/images'

export default {
  props: {
    allGrades: {
      type: Array
    },
    loginUserIsTeacher: {
      type: Boolean
    }
  },
  data() {
    return {
      getGradeImage: getGradeImage,
      findGreaterThan10: false,
      findLessThan10: false,
      grades: [],
      selectedGrades: [],
      selectedStudentGrades: null
    }
  },
  watch: {
    allGrades: function() {
      this.grades = [...this.allGrades]
    }
  },
  methods: {
    async selectGrades(grade) {
      if (this.loginUserIsTeacher) {
        this.selectGradesForTeacher(grade)
      } else {
        this.selectGradesForStudent(grade)
      }
      if (this.selectedGrades.length > 0) {
        await this.checkGradesToShowSubjects()
      } else {
        this.findGreaterThan10 = false
        this.findLessThan10 = false
      }
    },
    selectGradesForStudent(grade) {
      this.selectedStudentGrades = grade.id
      this.$emit('onSelectGrades', this.selectedStudentGrades)
    },
    selectGradesForTeacher(grade) {
      if (this.selectedGrades.length > 0) {
        let findedClass = this.selectedGrades.findIndex(
          (res) => res.id == grade.id
        )
        if (findedClass > -1) {
          this.selectedGrades.splice(findedClass, 1)
        } else {
          this.selectedGrades.push(grade)
        }
      } else {
        this.selectedGrades.push(grade)
      }
      this.$emit('onSelectGrades', this.selectedGrades)
    },
    async checkGradesToShowSubjects() {
      let grade11to12Ids = []
      let classes = await gradesRef.get()
      classes.forEach((clss) => {
        let classToFind = clss.data()
        if (classToFind.key == 'grade_11' || classToFind.key == 'grade_12') {
          grade11to12Ids.push(classToFind)
        }
      })

      this.selectedGrades.forEach((res) => {
        if (res == grade11to12Ids[0] || res == grade11to12Ids[1]) {
          this.findGreaterThan10 = true
        } else {
          this.findLessThan10 = true
        }
      })
    }
  }
}
</script>

<style scoped>
.img {
  display: flex;
  flex-wrap: wrap;
}
</style>
