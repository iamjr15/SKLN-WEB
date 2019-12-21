import { gradesRef } from '@/store/firestore.js'

export const gradeService = {
  async getGradesOrderedById() {
    try {
      const sortedGrades = await gradesRef.orderBy('id').get()
      const grades = []
      sortedGrades.forEach((clas) => {
        grades.push(clas.data())
      })
      return grades
    } catch (error) {
      console.error(error)
    }
  }
}
