import { loginService } from '@/shared/services/login-service'

export default {
  INIT_STORE(context, payload) {
    context.commit('SET_INIT_STATE', payload)
  },
  DISPLAY_MESSAGE(context, payload) {
    context.commit('SET_MESSAGE_STATE', payload)
  },
  DISPLAY_LOADER(context, payload) {
    context.commit('SET_LOADER_STATE', payload)
  },
  async LOGIN(context, payload) {
    context.commit('SET_LOADER_STATE', true)
    try {
      const userTokken = await loginService.authenticateUser(payload)
      if (userTokken && userTokken.claims && userTokken.claims.student) {
        context.commit('SET_IS_LOGGED_IN', true)
        context.commit('SET_USER_ROLE', 'student')
        const user = await loginService.getStudentData(
          userTokken.claims.user_id
        )
        if (user) {
          context.commit('studentModule/SET_STUDENT_DATA', user)
        }
        context.commit('SET_LOADER_STATE', false)
      } else if (userTokken && userTokken.claims && userTokken.claims.teacher) {
        context.commit('SET_IS_LOGGED_IN', true)
        context.commit('SET_USER_ROLE', 'teacher')

        const user = await loginService.getTutorData(userTokken.claims.user_id)
        if (user) {
          context.commit('teacherModule/SET_TEACHER_DATA', user)
        }
        context.commit('SET_LOADER_STATE', false)
      } else {
        context.commit('SET_MESSAGE_STATE', { message: userTokken.error })
        context.commit('SET_LOADER_STATE', false)
      }
      context.commit('SET_LOADER_STATE', false)
      return
    } catch (error) {
      context.commit('SET_MESSAGE_STATE', { message: error })
      context.commit('SET_LOADER_STATE', false)
    }
  },
  LOGOUT(context) {
    context.commit('SET_INIT_STATE', true)
    location.reload()
  }
}
