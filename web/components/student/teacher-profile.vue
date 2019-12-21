<template>
  <b-jumbotron class="box-s">
    <b-row style="margin:0">
      <b-col cols="3" style="text-align:center">
        <b-img
          class="profile-img"
          :src="teacher.personInfo.accountPicture"
          fluid-grow
        ></b-img>
        <br />
        <div class="star-rating-box">
          <b-img class="star-rating-img" :src="starFull" fluid-grow></b-img>
          <h1>
            <span v-text="teacher.qualification.rating" />
          </h1>
        </div>
        <b-button class="rating-box button-box">rating.</b-button>
        <h4>
          <span v-if="teacher.qualification.classType.length > 1">
            <span
              v-text="
                teacher.qualification.classType[0] +
                  '/' +
                  teacher.qualification.classType[1]
              "
            />
          </span>
          <span v-else>
            <span v-text="teacher.qualification.classType[0]" />
          </span>
        </h4>
        <b-button class="class-type-box button-box">class type.</b-button>
        <h4>
          <span v-text="teacher.qualification.experience" />
        </h4>
        <b-button class="experience-box button-box">experience.</b-button>
        <h4>{{ teacherDistance.toFixed(2) }}</h4>
        <b-button class="distance-box button-box">distance.</b-button>
        <h4 v-if="teacher.academicInfo.grades">
          <span
            v-for="(grade, index) of Object.keys(teacher.academicInfo.grades)"
            :key="index"
            v-text="grade.split('_')[1] + 'th '"
          />
        </h4>

        <b-button class="classes-box button-box">classes.</b-button>
      </b-col>
      <b-col cols="9">
        <h1 class="heading1">
          <span>
            <span v-text="teacher.personInfo.firstName" />
            <span v-text="teacher.personInfo.lastName" />
          </span>
        </h1>
        <h1 class="heading2">
          <span v-text="teacher.qualification.instituteNeme" />
        </h1>

        <div>
          <b-card
            title="teaching methodology"
            tag="article"
            class="mb-2 card-box1 box-border"
          >
            <b-card-text class="text-card">
              <span
                v-text="teacher.academicInfo.teachingMethod"
                class="txt-scroll"
              />
            </b-card-text>
          </b-card>
        </div>
        <div>
          <b-card title="subjects taught" class="mb-2 card-box box-border">
            <div>
              <label
                v-for="(subject, idx) of teacherSubjects"
                :key="idx"
                class="subject-button"
              >
                <span v-text="subject.name" />
              </label>
            </div>
          </b-card>
        </div>
        <div>
          <b-card title="tutor details" class="mb-2 card-box box-border">
            <b-table
              :items="tutorDetailsItems"
              :fields="fields"
              :tbody-td-class="tdClass"
              class="font-style"
            >
              <template v-slot:cell(value)="row" class="temptd">
                <span v-text="row.item.value" />
              </template>
            </b-table>
          </b-card>
        </div>
        <div>
          <b-card title="class details" class="mb-2 card-box box-border">
            <b-table
              class="font-style"
              :items="classDetailsItems"
              :fields="fields"
              :tbody-td-class="tdClass"
            >
              <template v-slot:cell(value)="row" class="temptd">
                <span v-text="row.item.value" />
              </template>
            </b-table>
          </b-card>
        </div>
        <div class="mb-2 map-box" id="tech-map">
          <GmapMap
            :center="mapcenter"
            ref="gmap"
            :options="{
              zoomControl: false,
              mapTypeControl: false,
              scaleControl: false,
              streetViewControl: false,
              rotateControl: false,
              fullscreenControl: false,
              disableDefaultUi: false
            }"
            map-type-id="roadmap"
            :zoom="10"
            :tilt="45"
          >
            <GmapMarker :position="mapcenter" :draggable="false" />
          </GmapMap>
        </div>
        <div>
          <b-card title="reserve a class" class="mb-2 box-border" id="tech-map">
            <h4>select subject(s)</h4>
            <div class="d-flex-19">
              <span v-for="(subject, idx) of teacherSubjects" :key="idx">
                <b-form-radio
                  name="subject"
                  @change="setSelectedSubject(subject)"
                >
                  <span v-text="subject.name" />
                </b-form-radio>
              </span>
            </div>
            <h4>select class type</h4>
            <div class="d-flex-19">
              <span
                v-for="(clsType, idx) of teacher.qualification.classType"
                :key="idx"
              >
                <b-form-radio name="clsType" @change="setClassType(clsType)">
                  <span v-text="clsType" />
                </b-form-radio>
              </span>
            </div>
            <h4 style="color: #0c1cf3 !important;">
              $
              <span v-text="teacher.packageInfo.price" />/
              <span v-text="teacher.packageInfo.frequency" />
              <span
                v-if="
                  teacher.packageInfo.rateOption &&
                    teacher.packageInfo.rateOption.toLowerCase() != 'daily'
                "
                v-text="
                  ' CLASSES PER ' +
                    teacher.packageInfo.rateOption
                      .toUpperCase()
                      .replace('LY', '')
                "
              />
              <span
                v-if="
                  teacher.packageInfo.rateOption &&
                    teacher.packageInfo.rateOption.toLowerCase() == 'daily'
                "
                v-text="'CLASSES PER DAY'"
              />
            </h4>
            <b-button
              variant="success"
              class="btn-request"
              :class="submittedClick ? 'disable-pointer' : ''"
              @click="requestForClass"
            >
              <span class="btn-text">REQUEST THIS CLASS</span>
            </b-button>
            <div style="font-size:13px">you wont be charged yet.</div>
          </b-card>
        </div>
      </b-col>
    </b-row>
  </b-jumbotron>
</template>

<script>
import {
  batchRequestRef,
  subjectsRef,
  teacherSubjectsRef,
  gradesRef,
  teacherGradesRef
} from '@/store/firestore'
import { uuid } from 'vue-uuid'
import _ from 'lodash'
import { studentRequestService } from '@/shared/services/student-request-service'
import { starFull } from '@/shared/components-data/images'
import { mapGetters, mapActions } from 'vuex'
import firebase from 'firebase'
import * as geofirex from 'geofirex'
const geo = geofirex.init(firebase)

export default {
  props: {
    teacher: Object,
    gradeKey: String
  },
  data() {
    return {
      starFull: starFull,
      submittedClick: false,
      teacherDistance: 0,
      teacherSubjects: [],
      selectedGrade: {
        name: '',
        id: ''
      },
      selectedSubject: {
        id: '',
        name: ''
      },
      selectedClassType: '',
      teacherLocation: '',
      currentStudent: '',

      mapcenter: {
        lat: 0,
        lng: 0
      },
      tdClass: {
        'text-align': 'center'
      },
      fields: ['category', 'value'],
      tutorDetailsItems: [],
      classDetailsItems: []
    }
  },
  mounted() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(this.getCurrentPosition)
    } else {
      this.displayMessage({
        message: 'Your browser do not support location',
        varient: 'warning'
      })
    }
  },
  watch: {
    teacher: {
      handler: function() {
        this.getTeacherData()
      },
      deep: true
    }
  },
  computed: {
    ...mapGetters({
      studentData: ['studentModule/GET_STUDENT_DATA'],
      allRequestsData: ['studentModule/GET_STUDENT_REQUESTS_DATA']
    })
  },
  methods: {
    ...mapActions({
      getStudentRequest: 'studentModule/GET_STUDENT_REQUEST',
      displayMessage: 'DISPLAY_MESSAGE',
      displayLoader: 'DISPLAY_LOADER'
    }),
    showPosition() {
      this.mapcenter = {
        lat: this.teacher.location.geopoint.latitude,
        lng: this.teacher.location.geopoint.longitude
      }
      this.fetchPosition(this.mapcenter)
    },
    getCurrentPosition(e) {
      let currentPosition = geo.point(e.coords.latitude, e.coords.longitude)
      if (this.mapcenter.lat && this.mapcenter.lng) {
        let mapcenter = geo.point(this.mapcenter.lat, this.mapcenter.lng)
        this.teacherDistance = geo.distance(currentPosition, mapcenter)
      }
    },
    goToHome() {
      this.$router.push({
        name: 'student-explore-teacher',
        params: { data: this.currentStudent }
      })
    },
    fetchPosition(mapcenter) {
      let geocoder = new google.maps.Geocoder()
      let self = this
      geocoder.geocode({ location: mapcenter }, (address, status) => {
        self.teacherLocation = address[0].formatted_address
      })
    },
    setMapPosition(geopoint) {
      this.mapcenter = {
        lat: geopoint.latitude,
        lng: geopoint.longitude
      }
      this.$refs.gmap.$mapPromise.then((res) => {
        this.showPosition()
      })
    },

    async getTeacherData() {
      let self = this
      if (self.teacher.personInfo.firstName) {
        self.currentStudent = self.studentData
        this.setMapPosition(this.teacher.location.geopoint)
        this.getTeacherSubjects(this.teacher.id)

        this.selectedGrade = await studentRequestService.getGrade(this.gradeKey)
        this.tutorDetailsItems = studentRequestService.setQualification(
          this.teacher.qualification
        )
        this.classDetailsItems = studentRequestService.setClassesDetails(
          this.teacher
        )
      }
    },
    async getTeacherSubjects(teacherId) {
      let self = this
      let teacherSubjects = await teacherSubjectsRef
        .where('teacherId', '==', teacherId)
        .get()
      teacherSubjects.forEach(async (teacherSubject) => {
        let subjects = await subjectsRef
          .where('id', '==', teacherSubject.data().subjectId)
          .get()
        subjects.forEach((res) => {
          let subject = res.data()
          if (subject) {
            self.teacherSubjects.push(subject)
          }
        })
      })
      this.selectedSubject = self.teacherSubjects[0]
    },
    setSelectedSubject(subject) {
      this.submittedClick = false
      this.selectedSubject = subject
    },
    setClassType(classType) {
      this.submittedClick = false
      this.selectedClassType = classType
    },
    getRequestViewModel(request) {
      return {
        id: request.id,
        img: request.teacher.accountPicture,
        teacherName: request.teacher.name,
        classToJoin: request.grade.name,
        subject: request.subject.name
      }
    },
    async requestForClass() {
      this.submittedClick = true
      this.displayLoader(true)
      let requestToAdd = this.getRequestDataToAdd()
      try {
        if (requestToAdd.subject.name && requestToAdd.type) {
          let requests = await batchRequestRef
            .where('subject.id', '==', requestToAdd.subject.id)
            .where('teacher.id', '==', requestToAdd.teacher.id)
            .where('student.id', '==', requestToAdd.student.id)
            .where('type', '==', requestToAdd.type)
            .get()
          if (requests.size) {
            this.displayMessage({
              message:
                'You have already submitted a subject request to the teacher!',
              varient: 'warning'
            })
            setTimeout(() => {
              this.goToHome()
            }, 5000)
            return
            this.displayLoader(false)
          }
          let res = await batchRequestRef.add(requestToAdd)
          let request = res
          if (request) {
            let requestViewModal = this.getRequestViewModel(requestToAdd)
            if (this.allRequestsData.allRequests.length < 1) {
              await this.getStudentRequest(requestToAdd.student)
            }
            this.displayMessage({
              message: 'Your request successfully sent to teacher',
              varient: 'success'
            })
            this.goToHome()
            this.displayLoader(false)
          }
        } else if (!requestToAdd.subject.name) {
          this.displayMessage({
            message: 'Please select a subject to enroll',
            varient: 'info'
          })
          this.displayLoader(false)
        } else {
          this.displayMessage({
            message: 'Please select a class type to enroll',
            varient: 'info'
          })
          this.displayLoader(false)
        }
      } catch (error) {
        this.displayMessage({
          message: 'Error occured during request'
        })
        this.displayLoader(false)
      }
    },
    getRequestDataToAdd() {
      return {
        id: this.$uuid.v4(),
        teacher: {
          id: this.teacher.id,
          name:
            this.teacher.personInfo.firstName +
            ' ' +
            this.teacher.personInfo.lastName,
          accountPicture: this.teacher.personInfo.accountPicture
        },
        student: {
          id: this.currentStudent.id,
          name:
            this.currentStudent.personInfo.firstName +
            ' ' +
            this.currentStudent.personInfo.lastName
        },
        grade: {
          name: this.selectedGrade.name,
          id: this.selectedGrade.id
        },
        status: 'created',
        subject: {
          name: this.selectedSubject ? this.selectedSubject.name : null,
          id: this.selectedSubject ? this.selectedSubject.id : null
        },
        type: this.selectedClassType ? this.selectedClassType : null
      }
    }
  }
}
</script>

<style scoped>
.tdClass {
  text-align: center !important;
}

.card-title {
  text-align: left !important;
  color: #0c1cf3 !important;
}
.btn-text {
  font-family: Montserrat;
  font-weight: bold;
  font-size: 1.3433059449009184vw;
  text-align: left;
  color: #fff;
  position: absolute;
  cursor: pointer;
  top: 15%;
  left: 10px;
}
.btn-request {
  color: white;
  font-size: medium;
  width: 18.3vw;
  height: 3.82vw;
  background: #1fc84c;
  box-shadow: 0px 10px 35px rgba(31, 200, 76, 0.65);
  position: relative;
}
.disable-pointer {
  pointer-events: none;
}
.pac-container.pac-logo {
  z-index: 999999;
}
.box-s {
  height: 125vw;
  background: #fff;
}
.profile-img {
  width: 10vw !important;
  text-align: center;
  height: 10vw;
  border: 1px solid black;
  border-radius: 50%;
}
.star-rating-box {
  display: flex;
  margin-top: 60px;
  justify-content: center;
}
.star-rating-img {
  width: 2vw !important;
  text-align: center;
  height: 1.858vw;
  margin-right: 20px;
}
.rating-box {
  border: 1px solid #51df4c;
}
.button-box {
  width: 235px;
  height: auto;
  border-radius: 33px;
  background: #fff;
  font-family: Montserrat Alternates;
  font-weight: normal;
  font-size: 29px;
  text-align: center;
  color: #000;
  pointer-events: none;
}
.class-type-box {
  border: 1px solid #032bf1;
}
.experience-box {
  border: 1px solid #fff45d;
}

.distance-box {
  border: 1px solid #f10333;
}
.classes-box {
  border: 1px solid #03e1f1;
}
.d-flex-19 {
  display: flex;
  font-size: 19px;
}
.box-border {
  width: 1026px;
  height: auto;
  border-radius: 5px;
  background: #fff;
  box-shadow: 0px 10px 10px rgba(0, 0, 0, 0.16);
  font-family: Montserrat;
  font-weight: bold;
  font-size: 35px;
  text-align: left;
}
.card-box {
  color: #0c1cf3;
}
.map-box {
  position: inherit;
  width: 49vw !important;
  height: 25vw;
}
.font-style {
  font-family: Montserrat;
  font-weight: 600;
  font-size: 35px;
  text-align: left;
  color: #000;
  line-height: 20px;
}
.subject-button {
  width: 304px;
  height: 67px;
  border-radius: 33.5px;
  background: #fff;
  border: 1px solid #707070;
  font-family: Montserrat;
  font-weight: 600;
  font-size: 25px;
  text-align: center;
  color: #000;
  line-height: 2.5;
}
.text-card {
  width: 996px;
  height: 318px;
  font-family: Montserrat;
  font-weight: 300;
  font-size: 35px;
  text-align: left;
  color: #000;
}
.card-box1 {
  height: 348px !important;
  color: #0c1cf3;
}
.heading1 {
  font-family: Montserrat;
  font-weight: bold;
  font-size: 71px;
  color: #000;
  display: flex;
}
.heading2 {
  font-family: Montserrat;
  font-weight: bold;
  font-size: 71px;
  text-align: left;
  color: #000;
}
h4 {
  margin-top: 20px;
}
.txt-scroll {
  overflow-y: scroll;
  height: 16vw;
  display: block;
}
</style>
