import { studentRequestService } from '@/shared/services/student-request-service'

export default {
  SET_STUDENT_DATA(state, payload) {
    state.student = { ...payload }
  },
  SET_STUDENT_CLASS_REQUEST_DATA(state, payload) {
    state.studentClassRequest = { ...payload }
  },
  SET_SEARCH_TEACHERS_BY_STUDENT(state, payload) {
    state.searchedTeacherByStudent = payload
  },
  SET_SEARCH_TEACHERS_CRITERIA(state, payload) {
    state.searchedTeachersCriteria = { ...payload }
  },
  SET_GRADE_TO_SEARCH(state, payload) {
    state.criteriaGrade = payload.split('_')[1]
  },
  ADD_STUDENT_CLASS_REQUEST_DATA(state, payload) {
    const findedRequest = state.studentClassRequest.allRequests.findIndex(
      (a) => a.id === payload.id
    )
    if (findedRequest < 0) {
      const requestToAdd = studentRequestService.getRequestViewModel(payload)
      if (payload.status === 'created') {
        state.studentClassRequest.lattestRequests.push(requestToAdd)
      }
      state.studentClassRequest.allRequests.push(requestToAdd)
      state.studentClassRequest.allDbRequests.push(payload)
    }
  },
  UPDATE_STUDENT_REQUEST_DATA(state, payload) {
    const getRequestViewModel = studentRequestService.getRequestViewModel(
      payload
    )
    state.studentClassRequest.lattestRequests = studentRequestService.updateLattestRequestsData(
      getRequestViewModel,
      state.studentClassRequest.lattestRequests
    )
    state.studentClassRequest.allRequests = studentRequestService.updateAllRequestsData(
      getRequestViewModel,
      state.studentClassRequest.allRequests
    )
    state.studentClassRequest.allDbRequests = studentRequestService.updateAllRequestsData(
      payload,
      state.studentClassRequest.allDbRequests
    )
  },
  REMOVE_STUDENT_REQUEST(state, payload) {
    state.studentClassRequest.lattestRequests = studentRequestService.removeRequest(
      payload,
      state.studentClassRequest.lattestRequests
    )
    state.studentClassRequest.allRequests = studentRequestService.removeRequest(
      payload,
      state.studentClassRequest.allRequests
    )
    state.studentClassRequest.allDbRequests = studentRequestService.removeRequest(
      payload,
      state.studentClassRequest.allDbRequest
    )
  }
}
