export const initialState = {
  loading: false,
  alert: {
    message: '',
    varient: 'danger',
    dismissSecs: 5,
    dismissCountDown: 5
  },
  session: {
    userRole: '',
    loginUserIsTeacher: false,
    logged: false
  },
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
  },
  studentClassRequest: {
    lattestRequests: [],
    allRequests: [],
    allDbRequests: []
  },
  searchedTeacherByStudent: [],
  teacherSubjects: [],
  searchedTeachersCriteria: {}
}
