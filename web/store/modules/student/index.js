import actions from './actions'
import getters from './getters'
import mutations from './mutations'

const state = {
  student: {
    id: '',
    personInfo: {
      firstName: null,
      lastName: null,
      email: null,
      accountPicture: '',
      gender: '',
      phone: null,
      accountType: 'student'
    },
    otpPassword: {
      otp: null,
      password: null
    },
    categoryAndGrade: {
      selectedGrade: [],
      category: ''
    },
    favoriteSubjectData: {
      selectedSubjects: [],
      language: null,
      programmingLanguage: null,
      languageSelectionFinded: false,
      computerSelectionFinded: false
    },
    leastFavoriteSubjectData: {
      selectedSubjects: [],
      language: null,
      programmingLanguage: null,
      languageSelectionFinded: false,
      computerSelectionFinded: false
    },
    hobbySubjectData: {
      selectedSubjects: [],
      martialArts: null,
      dance: null,
      martialArtsFinded: false,
      danceFinded: false
    }
  },
  criteriaGrade: '',
  studentClassRequest: {
    lattestRequests: [],
    allRequests: [],
    allDbRequests: []
  },
  searchedTeacherByStudent: [],
  searchedTeachersCriteria: {}
}
export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters
}
