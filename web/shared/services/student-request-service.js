import { batchRequestRef, gradesRef } from '@/store/firestore'
export const studentRequestService = {
  async cancelRequest(requestIdToCancel) {
    const requests = await batchRequestRef
      .where('id', '==', requestIdToCancel)
      .get()
    if (requests.size) {
      const reqeust = requests.docs.pop()
      await batchRequestRef.doc(reqeust.id).update({ status: 'canceled' })
      return true
    } else return false
  },
  removeRequest(request, reuestsArray) {
    if (reuestsArray && reuestsArray.length > 0) {
      const ifLatest = reuestsArray.findIndex((x) => x.id === request.id)
      if (ifLatest > -1) {
        reuestsArray.splice(ifLatest, 1)
      }
      return reuestsArray
    } else {
      return reuestsArray
    }
  },
  getRequestViewModel(request) {
    const requestViewModal = {
      id: request.id,
      img: request.teacher.accountPicture,
      teacherName: request.teacher.name,
      classToJoin: request.grade.name,
      subject: request.subject.name,
      status: request.status
    }
    return requestViewModal
  },
  updateLattestRequestsData(request, lattestRequestsData) {
    const ifLatest = lattestRequestsData.findIndex((x) => x.id === request.id)
    if (ifLatest > -1) {
      if (request.status === 'created') {
        lattestRequestsData[ifLatest] = request
      } else {
        lattestRequestsData.splice(ifLatest, 1)
      }
    } else if (request.status === 'created') {
      lattestRequestsData.push(request)
    }
    return lattestRequestsData
  },
  updateAllRequestsData(request, allrequest) {
    const ifLatest = allrequest.findIndex((x) => x.id === request.id)
    if (ifLatest > -1) {
      allrequest[ifLatest] = request
    } else {
      allrequest.push(request)
    }
    return allrequest
  },
  setClassesDetails(teacher) {
    return [
      {
        category: 'NO. OF CLASSES',
        value:
          teacher.packageInfo.rateOption.toLowerCase() === 'daily'
            ? teacher.packageInfo.frequency + ' CLASSES/PER DAY'
            : teacher.packageInfo.frequency +
              'CLASSES/' +
              teacher.packageInfo.rateOption.toUpperCase().replace('LY', '')
      },
      {
        category: 'MAX. STUDENT CAPACITY',
        value: teacher.packageInfo.studentCapacity
      },
      {
        category: 'CLASS TYPE',
        value:
          teacher.qualification.classType.length > 2
            ? teacher.qualification.classType[0] +
              '/' +
              teacher.qualification.classType[1]
            : teacher.qualification.classType[0]
      }
    ]
  },
  setQualification(qualification) {
    return [
      {
        category: 'OCCUPATION',
        value: qualification.currentOccupation
      },
      {
        category: 'QUALIFICATION',
        value: qualification.qualification
      },
      {
        category: 'AREA OF QUALIFICATION',
        value: qualification.qualificationArea
      }
    ]
  },
  async getGrade(selectedGrad) {
    const grades = await gradesRef.where('key', '==', selectedGrad).get()
    const grade = grades.docs.pop()
    const gradeToReturn = await grade.data()
    if (gradeToReturn) {
      return gradeToReturn
    }
  }
}
