export default {
  GET_USER_ROLE: (state) => {
    return state.session.userRole
  },
  GET_LOGIN_STATE: (state) => {
    return state.session.logged
  },
  IS_USER_TEACHER: (state) => {
    return state.session.userRole === 'teacher'
  },
  GET_ALERT_STATE: (state) => {
    return state.alert
  },
  GET_LOADER_STATE: (state) => {
    return state.loading
  }
}
