import { tutorsRef, teacherGradesRef } from '@/store/firestore'

export const signupService = {
  getTutorData(uid, teacherLocation, teacherData) {
    const newTutor = {
      id: uid,
      location: teacherLocation,
      personInfo: {
        firstName: teacherData.personInfo.firstName,
        lastName: teacherData.personInfo.lastName,
        gender: teacherData.personInfo.gender,
        accountPicture: teacherData.accountPicture,
        phone: teacherData.personInfo.phone,
        email: teacherData.personInfo.email,
        biodata: teacherData.qualification.biodata
      },
      academicInfo: {
        selectedCategory: teacherData.categoryAndGrades.selectedCategory,
        teachingMethod: teacherData.subjectData.methodology,
        grades: teacherData.categoryAndGrades.selectedGrades.length
          ? this.convertArrayIntoObjectByKey(
              'key',
              teacherData.categoryAndGrades.selectedGrades
            )
          : {},
        subjects: teacherData.subjectData.selectedSubjects.length
          ? this.convertArrayIntoObjectByKey(
              'name',
              teacherData.subjectData.selectedSubjects
            )
          : {}
      },
      otpPassword: {
        otp: teacherData.otpPassword.otp,
        password: teacherData.otpPassword.password
      },
      packageInfo: {
        frequency: teacherData.packageInfo.frequecy,
        numberOfClasses: teacherData.packageInfo.occurance,
        paymentOptions: teacherData.packageInfo.paymentOptions,
        price: teacherData.packageInfo.price,
        rateOption: teacherData.packageInfo.rateOption,
        studentCapacity: teacherData.packageInfo.studentCapacity
      },
      qualification: {
        currentOccupation: teacherData.qualification.occupation,
        experience: teacherData.qualification.experience,
        rating: teacherData.qualification.rating,
        qualification: teacherData.qualification.qualification,
        qualificationArea: teacherData.qualification.qualificationArea,
        targetBoard: teacherData.qualification.targetBoard,
        classType: teacherData.experience.classType,
        instituteNeme: teacherData.experience.instituteNeme,
        roleInInstitute: teacherData.experience.roleInInstitute,
        belongToInstitute: teacherData.experience.belongToInstitute,
        numberOfStudents: teacherData.experience.numberOfStudents
      }
    }
    return newTutor
  },

  async addTutorData(newTutor) {
    const tutorData = await tutorsRef.add(newTutor)
    return tutorData
  },
  convertArrayIntoObjectByKey(key, value) {
    const convertedObject = {}
    value.forEach((res) => {
      convertedObject[res[key]] = true
    })
    return convertedObject
  },
  async addteacherGrades(teacherData, docRef) {
    teacherData.categoryAndGrades.selectedGrades.map(async (gradeId) => {
      await teacherGradesRef.add({
        id: docRef.data().id + '_' + gradeId.id,
        teacherId: docRef.data().id,
        key: gradeId.key,
        name: gradeId.name,
        gradeId: gradeId.id
      })
    })
  },
  getTeacherSubjects(selectedSubjects, res) {
    const teacherSubjectsToReturn = []
    selectedSubjects.map((subjectId) => {
      let teacherSubjectToAdd = null
      if (subjectId.question) {
        teacherSubjectToAdd = {
          id: res.data().id + '_' + subjectId.id,
          teacherId: res.data().id,
          subjectId: subjectId.id,
          question: subjectId.question,
          answer: subjectId.answer,
          name: subjectId.name,
          isHobby: subjectId.grades.hobbies,
          isAcademic: !subjectId.grades.hobbies
        }
      } else {
        teacherSubjectToAdd = {
          id: res.data().id + '_' + subjectId.id,
          teacherId: res.data().id,
          subjectId: subjectId.id,
          name: subjectId.name,
          isHobby: subjectId.grades.hobbies,
          isAcademic: !subjectId.grades.hobbies
        }
      }
      if (teacherSubjectToAdd) {
        const findedSubject = teacherSubjectsToReturn.findIndex(
          (techSub) => techSub.subjectId === teacherSubjectToAdd.subjectId
        )
        if (findedSubject > -1) {
          teacherSubjectsToReturn[findedSubject] = teacherSubjectToAdd
        } else {
          teacherSubjectsToReturn.push(teacherSubjectToAdd)
        }
      }
    })
    return teacherSubjectsToReturn
  },

  getStudentData(uid, studentData) {
    const newStudent = {
      id: uid,
      personInfo: {
        accountPicture: studentData.personInfo.accountPicture,
        firstName: studentData.personInfo.firstName,
        lastName: studentData.personInfo.lastName,
        gender: studentData.personInfo.gender,
        phone: studentData.personInfo.phone,
        email: studentData.personInfo.email
      },
      location: studentData.location,
      academicInfo: {
        selectedCategory: studentData.categoryAndGrades.selectedCategory,
        selectedGrad: studentData.categoryAndGrades.selectedGrades
      }
    }
    return newStudent
  },
  getStudentSubjects(selectedSubjects, res, studentSubjectsToReturn) {
    selectedSubjects.map((subjectId) => {
      let studentSubjectToAdd = {}
      if (subjectId.question) {
        studentSubjectToAdd = {
          id: res.data().id + '_' + subjectId.id,
          studentId: res.data().id,
          subjectId: subjectId.id,
          question: subjectId.question,
          answer: subjectId.answer,
          name: subjectId.name,
          isFavourite: subjectId.isFavourite,
          isLeastFavorite: subjectId.isLeastFavorite,
          isHobby: subjectId.isHobby,
          isAcademic: subjectId.isAcademic
        }
      } else {
        studentSubjectToAdd = {
          id: res.data().id + '_' + subjectId.id,
          studentId: res.data().id,
          subjectId: subjectId.id,
          name: subjectId.name,
          isFavourite: subjectId.isFavourite,
          isLeastFavorite: subjectId.isLeastFavorite,
          isHobby: subjectId.isHobby,
          isAcademic: !subjectId.isHobby
        }
      }

      if (
        studentSubjectToAdd &&
        (studentSubjectsToReturn && studentSubjectsToReturn.length > 0)
      ) {
        const findedSubject = studentSubjectsToReturn.findIndex(
          (studSub) => studSub.subjectId === studentSubjectToAdd.subjectId
        )
        if (findedSubject > -1) {
          studentSubjectsToReturn[findedSubject] = studentSubjectToAdd
        } else {
          studentSubjectsToReturn.push(studentSubjectToAdd)
        }
      } else {
        studentSubjectsToReturn.push(studentSubjectToAdd)
      }
    })
    return studentSubjectsToReturn
  }
}
