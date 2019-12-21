<template>
  <div>
    <b-row v-if="loginUserIsTeacher">
      <b-col>
        <h3 class="lbl-subject">select category of teaching</h3>
      </b-col>
    </b-row>
    <b-row v-if="loginUserIsTeacher">
      <b-col class="subject-img">
        <SubjectCategorySelection
          :allCategories="subjectCategories"
          @onSelectCategory="selectCategory"
        />
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <h3 class="lbl-subject" v-if="loginUserIsTeacher">
          Select class to teach
        </h3>
        <h3 class="lbl-subject" v-else>Select the class you are in</h3>
      </b-col>
    </b-row>
    <b-row>
      <b-col class="subject-img">
        <GradesSelection
          :allGrades="grades"
          :loginUserIsTeacher="loginUserIsTeacher"
          @onSelectGrades="selectGrades"
        />
      </b-col>
    </b-row>
    <b-row>
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
import SubjectCategorySelection from '@/components/common/subject-category-selection'
import GradesSelection from '@/components/common/grades-selection'
import { gradeService } from '@/shared/services/grades'
import { whiteArrowImage } from '@/shared/components-data/images'
import {
  selectMultipleClassesError,
  selectSingleClassError
} from '@/shared/components-data/messages'

export default {
  components: {
    SubjectCategorySelection,
    GradesSelection
  },
  props: {
    loginUserIsTeacher: {
      type: Boolean
    }
  },
  data() {
    return {
      subjectCategories: [],
      whiteArrow: whiteArrowImage,
      grades: [],
      selectedCategoryAndGrades: {
        selectedCategory: 'academics',
        selectedGrades: []
      }
    }
  },
  async mounted() {
    this.subjectCategories = [
      { name: 'academics', avatar: 'academics.png' },
      { name: 'hobby', avatar: 'hobby.png' }
    ]
    let sortedGrades = await gradeService.getGradesOrderedById()
    sortedGrades.forEach((grade) => {
      this.grades.push(grade)
    })
  },

  methods: {
    selectCategory(name) {
      this.selectedCategoryAndGrades.selectedCategory = name
    },
    selectGrades(grades) {
      this.selectedCategoryAndGrades.selectedGrades = grades
    },
    goToNext() {
      if (
        !this.selectedCategoryAndGrades.selectedGrades ||
        this.selectedCategoryAndGrades.selectedGrades.length < 1
      ) {
        let message = this.loginUserIsTeacher
          ? selectMultipleClassesError
          : selectSingleClassError
        this.$emit('onSetAlertMessage', message)
      } else {
        this.$emit('onSetCategoryAndGrades', this.selectedCategoryAndGrades)
      }
    }
  }
}
</script>

<style scoped>
.btn-icon {
  margin-left: 2rem;
}
.lbl-margin-left {
  margin-left: 10rem;
}
.signup-lbl {
  font-size: 40px;
}
.login-lbl {
  margin-top: 3.5rem;
}
.head-arrow {
  display: flex;
}
</style>
