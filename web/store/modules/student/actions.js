import _ from 'lodash'
import { teacherService } from '~/shared/services/teacher-service'
import { batchRequestRef, tutorsRef } from '@/store/firestore'

export default {
  async GET_STUDENT_REQUEST({ commit, getters }) {
    if (
      getters.GET_STUDENT_REQUESTS_DATA.lattestRequests.length === 0 &&
      getters.GET_STUDENT_REQUESTS_DATA.allRequests.length === 0
    ) {
      batchRequestRef
        .where('student.id', '==', getters.GET_STUDENT_DATA.id)
        .onSnapshot(function (snapshot) {
          snapshot.docChanges().forEach(function (change) {
            if (change.type === 'added') {
              commit('ADD_STUDENT_CLASS_REQUEST_DATA', change.doc.data())
            }
            if (change.type === 'modified') {
              commit('UPDATE_STUDENT_REQUEST_DATA', change.doc.data())
            }
            if (change.type === 'removed') {
              commit('REMOVE_STUDENT_REQUEST', change.doc.data())
            }
          })
        })
    }
  },
  GET_SEARCHED_TEACHERS({ commit, state, dispatch }, payload) {
    dispatch('DISPLAY_LOADER', true, { root: true })
    const criteria = { ...payload }
    if (
      criteria.currentLocation &&
      (!state.searchedTeachersCriteria.location ||
        (state.searchedTeachersCriteria.locationRange &&
          !teacherService.checkCriteriasEquality(
            state.searchedTeachersCriteria,
            criteria
          )))
    ) {
      const gradeToSearch = 'grade_' + criteria.selectedGrade
      let teachers = []
      if (criteria.subject) {
        teachers = tutorsRef
          .where(
            'qualification.classType',
            'array-contains-any',
            criteria.selectedClassTypes
          )
          .where(`academicInfo.subjects.${criteria.subject}`, '==', true)
          .where(`academicInfo.grades.${gradeToSearch}`, '==', true)
      } else {
        teachers = tutorsRef
          .where(
            'qualification.classType',
            'array-contains-any',
            criteria.selectedClassTypes
          )
          .where(`academicInfo.grades.${gradeToSearch}`, '==', true)
      }
      const teachersWithoutLocation = []
      commit('SET_SEARCH_TEACHERS_BY_STUDENT', [])
      teachers.onSnapshot((snapshot) => {
        snapshot.docChanges().forEach(async (change) => {
          if (change.type === 'added') {
            const teacher = change.doc.data()
            if (teacher) {
              teachersWithoutLocation.push(teacher)
            }
          }
          let teachersByLocation = []
          let commonTeachers = []
          if (teachersWithoutLocation.length) {
            teachersByLocation = await teacherService.getTeachersByLocation(
              criteria
            )
            if (teachersByLocation.length) {
              commonTeachers = _.intersectionBy(
                teachersWithoutLocation,
                teachersByLocation,
                'id'
              )
              commit('SET_SEARCH_TEACHERS_BY_STUDENT', commonTeachers)
              commit('SET_SEARCH_TEACHERS_CRITERIA', payload)
            }
          } else {
            commit('SET_SEARCH_TEACHERS_BY_STUDENT', [])
            dispatch('DISPLAY_LOADER', false, { root: true })
          }
        })
        dispatch('DISPLAY_LOADER', false, { root: true })
      })
    } else {
      dispatch('DISPLAY_LOADER', false, { root: true })
    }
  },
  UPDATE_STUDENT_REQUEST({ commit, getters }, payload) {
    console.log('state ', getters.GET_STUDENT_REQUESTS_DATA)
  },
  SET_STUDENT_DATA({ commit }, payload) {
    if (payload && payload.personInfo && payload.personInfo.firstName) {
      commit('SET_STUDENT_DATA', payload)
    }
  },
  SET_GRADE_TO_SEARCH({ commit }, payload) {
    commit('SET_GRADE_TO_SEARCH', payload)
  }
}
