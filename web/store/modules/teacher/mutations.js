export default {
  SET_TEACHER_SUBJECTS(state, payload) {
    state.teacherSubjects = payload
  },
  SET_TEACHER_DATA(state, payload) {
    state.teacher = { ...payload }
  }
}
