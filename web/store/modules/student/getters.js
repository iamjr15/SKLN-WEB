import _ from 'lodash'
export default {
  GET_STUDENT_DATA: (state) => {
    return state.student
  },
  GET_STUDENT_REQUESTS_DATA: (state) => {
    return _.cloneDeep(state.studentClassRequest)
  },
  GET_SEARCH_TEACHER_BY_STUDENT: (state) => {
    return _.cloneDeep(state.searchedTeacherByStudent)
  },
  GET_SEARCH_TEACHERS_CRITERIA: (state) => {
    return state.searchedTeachersCriteria
  },
  GET_GRADE_TO_SEARCH(state) {
    return state.criteriaGrade
  }
}
