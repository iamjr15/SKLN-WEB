import actions from './actions'
import getters from './getters'
import mutations from './mutations'

const state = {
  criteriaGrade: '',
  teacher: {
    id: '',
    personInfo: {
      firstName: '',
      lastName: '',
      email: '',
      gender: '',
      phone: '',
      accountType: 'teacher'
    },
    categoryAndGrades: {
      selectedCategory: '',
      selectedGrades: ''
    },
    subjectData: {
      selectedSubjects: '',
      methodology: ''
    },
    otpPassword: {
      otp: '',
      password: '',
      verifiedOtp: false
    },
    accountPicture: '',
    qualification: {
      occupation: '',
      experience: '',
      rating: '',
      qualification: '',
      qualificationArea: '',
      targetBoard: '',
      biodata: ''
    },
    packageInfo: {
      classType: '',
      frequecy: '',
      occurance: '',
      price: '',
      rateOption: '',
      paymentOptions: '',
      location: {}
    }
  }
}
export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters
}
