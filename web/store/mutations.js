import _ from 'lodash'
import { initialState } from './store'

export default {
  SET_LOADER_STATE(state, payload) {
    state.loading = payload
  },
  SET_MESSAGE_STATE(state, payload) {
    state.alert.message = payload.message
    if (payload.varient) {
      state.alert.varient = payload.varient
    }
  },
  SET_LOGIN_STATE(state) {
    if (!state.session.logged) {
      localStorage.clear()
      state.teacher = {}
      state.student = {}
      state.criteriaGrade = ''
      state.studentClassRequest.lattestRequests = []
      state.studentClassRequest.allRequests = []
      state.studentClassRequest.allDbRequests = []
      state.searchedTeacherByStudent = []
      state.searchedTeachersCriteria = {}
    }
  },
  SET_USER_ROLE(state, payload) {
    state.session.userRole = payload
  },
  SET_INIT_STATE(state) {
    state = _.cloneDeep(initialState)
    state.session.userRole = ''
    state.session.logged = false
    localStorage.clear()
  },
  SET_IS_LOGGED_IN(state, payload) {
    state.session.logged = payload
  }
}
