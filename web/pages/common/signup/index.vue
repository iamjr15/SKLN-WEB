<template>
  <div>
    <b-modal
      ref="loadingModal"
      id="loader-modal"
      hide-header
      hide-footer
      no-close-on-esc
      no-close-on-backdrop
    >
      <Loader :isLoading="loaderStatus" />
    </b-modal>
    <b-jumbotron>
      <TeacherDefinition
        v-if="signupAs == 'teacher'"
        @onCompleteSignup="completeSignup"
      />
      <StudentDefinition
        v-if="signupAs == 'student'"
        @onCompleteSignup="completeSignup"
      />
    </b-jumbotron>
  </div>
</template>

<script>
import Loader from '@/components/common/loader'
import TeacherDefinition from '@/components/teacher/definition'
import StudentDefinition from '@/components/student/definition'
import firebase from 'firebase'
import AlertMessage from '@/components/common/alert-message'
import * as geofirex from 'geofirex'
const geo = geofirex.init(firebase)
import {
  auth,
  db,
  fuctions,
  tutorsRef,
  subjectsRef,
  studentsRef,
  studentSubjectsRef,
  teacherGradesRef,
  teacherSubjectsRef
} from '@/store/firestore'
import { uuid } from 'vue-uuid'
import { async } from 'rxjs/internal/scheduler/async'
import { signupService } from '@/shared/services/signup-service'
import { mapGetters, mapActions } from 'vuex'

export default {
  components: {
    TeacherDefinition,
    StudentDefinition,
    AlertMessage,
    Loader
  },
  computed: {
    ...mapGetters({
      loaderStatus: 'GET_LOADER_STATE',
      watchIsTeacher: 'IS_USER_TEACHER',
      watchTeacherState: 'teacherModule/GET_TEACHER_DATA',
      watchStudentState: 'studentModule/GET_STUDENT_DATA',
      watchLoginState: 'GET_LOGIN_STATE',
      watchUserRole: 'GET_USER_ROLE'
    })
  },
  watch: {
    watchTeacherState: function() {
      if (this.watchLoginState && this.watchUserRole == 'teacher') {
        this.$router.push({
          name: 'teacher-dashboard',
          params: { data: this.watchTeacherState, isLoginCase: true }
        })
      }
    },
    watchStudentState: function() {
      if (this.watchLoginState && this.watchUserRole == 'student') {
        this.$router.push({
          name: 'student-explore-teacher',
          params: { data: this.watchStudentState, isLoginCase: true }
        })
      }
    },
    loaderStatus(newVal, oldVal) {
      if (newVal) {
        this.$refs.loadingModal.show()
      } else {
        this.$refs.loadingModal.hide()
      }
    }
  },
  data() {
    return {
      alertBar: {
        dismissSecs: 5,
        dismissCountDown: 0,
        message: ''
      },
      signupAs: null,
      dataToPass: null,
      teacherSubjectsToAdd: [],
      studentSubjectsToAdd: []
    }
  },
  mounted() {
    if (this.$route.params.signupAs) {
      this.signupAs = this.$route.params.signupAs
    } else {
      this.$router.push({ path: '/' })
      this.initStore(true)
    }
    auth.onAuthStateChanged(async (user) => {
      if (user) {
        let token = await user.getIdTokenResult()
        if (token.signInProvide === 'password') {
          user.isStudent = token.claims.isStudent || false
          user.loginUserIsTeacher = token.claims.loginUserIsTeacher || false
        }
      }
    })
  },
  methods: {
    ...mapActions({
      initStore: 'INIT_STORE',
      displayMessage: 'DISPLAY_MESSAGE',
      displayLoader: 'DISPLAY_LOADER',
      loginUser: 'LOGIN'
    }),
    async completeSignup(dataToPass) {
      this.displayLoader(true)
      this.dataToPass = dataToPass
      let self = this
      try {
        var credential = firebase.auth.EmailAuthProvider.credential(
          this.dataToPass.personInfo.email,
          this.dataToPass.otpPassword.password
        )
        let usercred = await firebase
          .auth()
          .currentUser.linkWithCredential(credential)

        let user = usercred.user
        self.displayLoader(true)
        if (this.signupAs == 'teacher') {
          self.registerTeacher(self.dataToPass, user.uid)
        } else {
          self.registerStudent(self.dataToPass, user.uid)
        }
      } catch (error) {
        this.displayLoader(false)
        if (error && error.code && error.message) {
          this.displayMessage({
            message: error.message
          })
        } else {
          this.displayMessage({
            message: 'Error registerating user ' + error
          })
        }
      }
    },
    async registerTeacher(teacherData, uid) {
      let subjectsFromDb = []
      let self = this
      try {
        const teacherLocation = geo.point(
          teacherData.packageInfo.location.latitude,
          teacherData.packageInfo.location.longitude
        )
        let subjects = await subjectsRef.get()
        subjects.forEach((subject) => {
          let subjectFromDb = subject.data()
          subjectsFromDb.push(subjectFromDb)
        })
        let newTutor = signupService.getTutorData(
          uid,
          teacherLocation,
          teacherData
        )
        let docRef = await signupService.addTutorData(newTutor)
        const statsRef = tutorsRef.doc('--stats--')
        const newTutorRef = tutorsRef.doc(docRef.id)
        await db.runTransaction(async function(transaction) {
          let statsDoc = await transaction.get(statsRef)
          let tutorsCount = statsDoc.data()
            ? statsDoc.data().tutorsCount + 1
            : 1
          var formattedNumber = ('00000' + tutorsCount).slice(-6)
          if (tutorsCount > 1)
            transaction.update(statsRef, { tutorsCount: tutorsCount })
          else transaction.set(statsRef, { tutorsCount: tutorsCount })
          transaction.update(newTutorRef, {
            tutorCode: `SKL${formattedNumber}`
          })
        })
        const addTeacherRole = firebase
          .functions()
          .httpsCallable('addTeacherRole')
        let result = await addTeacherRole({
          email: teacherData.personInfo.email
        })

        let res = await docRef.get()
        await signupService.addteacherGrades(teacherData, res)
        self.teacherSubjectsToAdd = signupService.getTeacherSubjects(
          teacherData.subjectData.selectedSubjects,
          res
        )
        if (self.teacherSubjectsToAdd.length > 0) {
          self.teacherSubjectsToAdd.forEach(async (teacherSubjectToAdd) => {
            await teacherSubjectsRef.add(teacherSubjectToAdd)
          })
          self.login(newTutor.personInfo.email, newTutor.otpPassword.password)
        }
      } catch (error) {
        console.log('error teacher signup', error)
        this.displayLoader(false)
        this.displayMessage({
          message: 'Some unexpected error occured'
        })
      }
    },
    async registerStudent(studentData, uid) {
      this.displayLoader(true)

      let subjectsFromDb = []
      let self = this
      try {
        let subjects = await subjectsRef.get()
        subjects.forEach((subject) => {
          let subjectFromDb = subject.data()
          subjectsFromDb.push(subjectFromDb)
        })

        let docRef = await studentsRef.add(
          signupService.getStudentData(uid, studentData)
        )

        const statsRef = studentsRef.doc('--stats--')
        const newStudentRef = studentsRef.doc(docRef.id)
        await db.runTransaction(async function(transaction) {
          let statsDoc = await transaction.get(statsRef)
          let studentsCount = statsDoc.data()
            ? statsDoc.data().studentsCount + 1
            : 1
          var formattedNumber = ('00000' + studentsCount).slice(-6)
          console.log('formattedNumber', formattedNumber)
          if (studentsCount > 1)
            transaction.update(statsRef, { studentsCount: studentsCount })
          else transaction.set(statsRef, { studentsCount: studentsCount })
          transaction.update(newStudentRef, { studentCode: formattedNumber })
        })
        let res = await docRef.get()
        const addStudentRole = firebase
          .functions()
          .httpsCallable('addStudentRole')
        let result = await addStudentRole({
          email: studentData.personInfo.email
        })
        this.dataToPass.id = res.data().id
        self.studentSubjectsToAdd = []
        self.studentSubjectsToAdd = signupService.getStudentSubjects(
          studentData.favoriteSubjectData.selectedSubjects,
          res,
          self.studentSubjectsToAdd
        )
        let leastFavoriteSubjects = signupService.getStudentSubjects(
          studentData.leastFavoriteSubjectData.selectedSubjects,
          res,
          self.studentSubjectsToAdd
        )
        let hobbySubjectData = signupService.getStudentSubjects(
          studentData.hobbySubjectData.selectedSubjects,
          res,
          self.studentSubjectsToAdd
        )
        if (self.studentSubjectsToAdd.length > 0) {
          self.studentSubjectsToAdd.forEach(async (studentSubjectToAdd) => {
            await studentSubjectsRef.add(studentSubjectToAdd)
          })
          self.login(
            studentData.personInfo.email,
            studentData.otpPassword.password
          )
        }
      } catch (err) {
        this.displayLoader(false)
        this.displayMessage({
          message: 'Some unexpected error occured'
        })
      }
    },
    login(email, password) {
      this.loginUser({
        email: email,
        password: password
      })
    }
  }
}
</script>
