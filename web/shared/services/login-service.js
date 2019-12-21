import { auth, tutorsRef, studentsRef } from '@/store/firestore'

export const loginService = {
  async getTutorData(id) {
    const tutorFound = await tutorsRef.where('id', '==', id).get()
    if (tutorFound && tutorFound.size) {
      const tutorData = tutorFound.docs.pop()
      const tutor = await tutorData.data()
      if (tutor) {
        return tutor
      }
    }
  },
  async getStudentData(id) {
    const studentFound = await studentsRef.where('id', '==', id).get()
    if (studentFound && studentFound.size) {
      const studentData = studentFound.docs.pop()
      const student = await studentData.data()
      if (student) {
        return student
      }
    }
  },
  async authenticateUser(credentials) {
    try {
      const validationResult = await auth.signInWithEmailAndPassword(
        credentials.email,
        credentials.password
      )
      if (validationResult) {
        const token = await validationResult.user.getIdTokenResult()
        console.log(token)
        return token
      }
    } catch (error) {
      return { error: error.message }
    }
  },
  logout() {
    return auth.signOut()
  }
}
