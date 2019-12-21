import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import mutations from './mutations'
import actions from './actions'
import teacherModule from './modules/teacher'
import studentModule from './modules/student'
Vue.use(Vuex)
const state = {
  loading: false,
  alert: {
    message: '',
    varient: 'danger',
    dismissSecs: 5,
    dismissCountDown: 5
  },
  session: {
    userRole: '',
    loginUserIsTeacher: false,
    logged: false
  }
}

const createStore = () => {
  return new Vuex.Store({
    modules: {
      teacherModule,
      studentModule
    },
    state,
    actions,
    mutations,
    getters
  })
}

export default createStore

export const strict = false
