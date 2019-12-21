export default {
  SET_TEACHER_DATA({ commit }, payload) {
    commit('SET_TEACHER_DATA', payload)
  },
  SET_TEACHER_SUBJECTS(state, payload) {
    state.teacherSubjects = payload
  }
}
