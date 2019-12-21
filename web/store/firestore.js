import firebase from 'firebase'
import 'firebase/firestore'
if (!firebase.apps.length) {
  firebase.initializeApp({
    apiKey: 'AIzaSyDCbKCPTNTh2fCqpAPvX08otqtQO1tpJmg',
    authDomain: 'algol-demo.firebaseapp.com',
    databaseURL: 'https://algol-demo.firebaseio.com',
    projectId: 'algol-demo',
    storageBucket: 'algol-demo.appspot.com',
    messagingSenderId: '144136097502',
    appId: '1:144136097502:web:a9f174aa2f06faacc07c4f',
    measurementId: 'G-CFST2ZW29C'
  })
}

export const auth = firebase.auth()
export const db = firebase.firestore()
export const fuctions = firebase.functions()
export const batchesRef = db.collection('batches')
export const batchRequestRef = db.collection('batchRequests')
export const tutorsRef = db.collection('tutors')
export const studentsRef = db.collection('students')
export const gradesRef = db.collection('grades')
export const subjectsRef = db.collection('subjects')
export const studentSubjectsRef = db.collection('studentSubjects')
export const teacherGradesRef = db.collection('tutorGrades')
export const teacherSubjectsRef = db.collection('tutorSubjects')
