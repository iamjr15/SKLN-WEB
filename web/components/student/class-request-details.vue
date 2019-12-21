<template>
  <b-jumbotron>
    <b-row class="m-30">
      <b-col>
        <h1>my requests.</h1>
        <div class="request-box"></div>
      </b-col>
    </b-row>

    <b-row>
      <b-col md="4" style="text-align:center;">
        <b-img
          class="profile-img"
          :src="teacherData.personInfo.accountPicture"
          fluid-grow
        ></b-img>
        <b-row>
          <b-col>
            <h3
              v-text="
                teacherData.qualification.instituteNeme
                  ? teacherData.personInfo.firstName +
                    ' | ' +
                    teacherData.qualification.instituteNeme
                  : teacherData.personInfo.firstName
              "
            />
            <b-card
              class="subject-box"
              v-text="'SUBJECT : ' + requestData.subject.name"
            />
            <b-card class="class-box">
              <span v-text="teacherData.packageInfo.price" />/
              <span v-text="teacherData.packageInfo.frequency" />
              <span
                v-if="
                  teacherData.packageInfo.rateOption &&
                    teacherData.packageInfo.rateOption.toLowerCase() != 'daily'
                "
                v-text="
                  ' CLASSES PER ' +
                    teacherData.packageInfo.rateOption
                      .toUpperCase()
                      .replace('LY', '')
                "
              />
              <span
                v-if="
                  teacherData.packageInfo.rateOption &&
                    teacherData.packageInfo.rateOption.toLowerCase() == 'daily'
                "
                v-text="'CLASSES PER DAY'"
              />
            </b-card>
            <b-card class="payment-box">
              <span v-if="teacherData.packageInfo.paymentOptions.length > 1">
                PAYMENT METHOD :
                <span
                  v-for="(paymentOption, index) in teacherData.packageInfo
                    .paymentOptions"
                  :key="index"
                >
                  {{ paymentOption }}
                  <span
                    v-if="
                      teacherData.packageInfo.paymentOptions.length - 1 > index
                    "
                    >/</span
                  >
                </span>
              </span>
              <span
                v-else
                v-text="
                  'PAYMENT METHOD : ' +
                    teacherData.packageInfo.paymentOptions[0]
                "
              />
            </b-card>
            <b-card class="class-type-box">
              <span> CLASS TYPE : {{ requestData.type }} </span>
            </b-card>
            <b-button
              v-if="
                requestData.status &&
                  requestData.status.toUpperCase() == 'CREATED'
              "
              class="cancel-request-box"
              @click="cancelRequest"
              >CANCEL REQUEST</b-button
            >
          </b-col>
        </b-row>
      </b-col>
      <b-col md="5">
        <b-card
          class="mb-2"
          style="width: 36vw;margin-top: 35%;"
          id="tech2-map"
        >
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
          >
            <gmap-info-window
              :options="infoOptions"
              :position="mapcenter"
              :opened="infoOpened"
              :content="infoContent"
              @closeclick="infoOpened = false"
            ></gmap-info-window>
            <GmapMarker
              :position="mapcenter"
              @click="infoOpened = !infoOpened"
              :icon="mapMarker"
              :draggable="false"
            />
          </GmapMap>
        </b-card>
      </b-col>
      <b-col md="3">
        <div style="margin-top:60%;">
          <b-card
            id="contact-card"
            title="contact infomation"
            tag="article"
            class="mb-2 status-card"
          >
            <b-button class="status-btn">
              <span v-if="!requestData.status">NOT YET ACCEPTED !</span>
              <span v-else v-text="requestData.status.toUpperCase()" />
            </b-button>
          </b-card>
        </div>
      </b-col>
    </b-row>
  </b-jumbotron>
</template>

<script>
import { tutorsRef, db } from '@/store/firestore'
import { mapMarker } from '@/shared/components-data/images'
import { mapGetters, mapActions } from 'vuex'
import { studentRequestService } from '@/shared/services/student-request-service'
export default {
  data() {
    return {
      mapMarker: mapMarker,
      requestData: {
        id: '',
        img: '',
        teacherName: '',
        classToJoin: '',
        subject: ''
      },
      teacherData: {
        personInfo: {
          firstName: null,
          lastName: null,
          email: null,
          gender: 'male',
          phone: null,
          accountType: 'teacher',
          accountPicture: ''
        },
        location: {
          geohash: '',
          geopoint: { latitude: 0, longitude: 0 }
        },
        otpPassword: {
          otp: null,
          password: null
        },
        categoryAndGrades: {
          selectedCategory: null,
          selectedGrades: null
        },
        subjectData: {
          selectedSubjects: [],
          language: null,
          methodology: null,
          programmingLanguage: null,
          martialArts: null,
          dance: null,
          languageSelectionFinded: false,
          computerSelectionFinded: false,
          martialArtsFinded: false,
          danceFinded: false
        },
        qualification: {
          classType: [],
          rating: '',
          occupation: null,
          experiences: null,
          qualification: null,
          qualificationArea: null,
          targetBoard: null,
          biodata: null
        },
        experience: {
          instituteNeme: null,
          roleInInstitute: null,
          belongToInstitute: false,
          numberOfStudents: null
        },
        packageInfo: {
          frequecy: null,
          occurance: null,
          price: null,
          studentCapacity: null,
          rateOption: null,
          paymentOptions: []
        }
      },
      mapcenter: {
        lat: 0,
        lng: 0
      },
      infoPosition: null,
      infoContent: null,
      infoOpened: false,
      infoCurrentKey: null,
      infoOptions: {
        pixelOffset: {
          width: 0,
          height: -35
        },
        content: '<div></div>'
      }
    }
  },
  mounted() {
    if (this.$route.params.data) {
      this.requestData = this.$route.params.data
      this.getRequestDetails()
    }
  },
  computed: {
    ...mapGetters({
      studentData: 'studentModule/GET_STUDENT_DATA'
    })
  },
  methods: {
    ...mapActions({
      displayLoader: 'DISPLAY_LOADER',
      displayMessage: 'DISPLAY_MESSAGE',
      getStudentRequest: 'studentModule/GET_STUDENT_REQUEST'
    }),
    async getRequestDetails() {
      try {
        await this.getTeacherForRequest()
        this.mapcenter = {
          lat: this.teacherData.location.geopoint.latitude,
          lng: this.teacherData.location.geopoint.longitude
        }
        this.$refs.gmap.$mapPromise.then(() => {
          this.showPosition()
        })
      } catch (error) {
        console.error(error)
        this.displayMessage({
          message: error
        })
      }
    },
    async getTeacherForRequest() {
      let self = this
      let teachers = await tutorsRef
        .where('id', '==', this.requestData.teacher.id)
        .get()
      teachers.forEach((res) => {
        let teacher = res.data()
        if (teacher) {
          self.teacherData = teacher
        }
      })
    },
    async cancelRequest() {
      this.displayLoader(true)
      await studentRequestService.cancelRequest(this.requestData.id)
      await this.getStudentRequest(this.studentData)
      this.displayMessage({
        message: 'Your Request has been canceled successfully',
        varient: 'success'
      })
      this.displayLoader(false)
      this.$router.push({
        name: 'student-requests',
        params: { selectedRequest: this.requestData }
      })
    },
    showPosition() {
      this.fetchPosition(this.mapcenter)
    },
    fetchPosition(mapcenter) {
      let self = this
      let geocoder = new google.maps.Geocoder()
      geocoder.geocode({ location: mapcenter }, (address, status) => {
        let meetingAddress = address[0].formatted_address
        self.infoOptions.content = `<div style="font-size: large;font-weight: bold ">Where we\'ll meet</div></br><span>${meetingAddress}</span>`
      })
    }
  }
}
</script>

<style scoped>
.main-card {
  height: 512px;
  background: linear-gradient(#ad80cb 0%, #7451e9 100%);
}
.flex-content {
  display: flex;
  justify-content: space-between;
}
.dropdown-toggle {
  border-radius: 20px;
  background: black;
}

thead {
  display: none;
}
.m-30 {
  margin-top: 30px;
  margin-bottom: 30px;
}
.request-box {
  width: 17rem;
  border: 2px solid black;
}
.profile-img {
  width: 10vw !important;
  text-align: center;
  height: 10vw;
  border: 1px solid black;
  margin-right: 20px;
  border-radius: 50%;
}
.subject-box {
  width: 100%;
  min-height: 69px;
  border-radius: 5px;
  background: #fff;
  box-shadow: 0px 6px 9px rgba(0, 0, 0, 0.16);
  text-align: center;
  font-size: 25px;
  margin-top: 15px;
}
.class-box {
  width: 100%;
  min-height: 69px;
  border-radius: 5px;
  background: #33e876;
  box-shadow: 0px 6px 9px rgba(0, 0, 0, 0.16);
  font-size: 25px;
  font-family: Montserrat;
  margin-top: 15px;
  font-weight: 600;
  font-size: 25px;
  text-align: center;
  color: #fff;
}
.payment-box {
  width: 100%;
  min-height: 69px;
  border-radius: 5px;
  background: #fff;
  box-shadow: 0px 6px 9px rgba(0, 0, 0, 0.16);
  text-align: center;
  font-size: 25px;
  margin-top: 15px;
}
.class-type-box {
  width: 100%;
  min-height: 69px;
  border-radius: 5px;
  background: #fff;
  box-shadow: 0px 6px 9px rgba(0, 0, 0, 0.16);
  text-align: center;
  font-size: 25px;
  margin-top: 15px;
}
.cancel-request-box {
  width: 100%;
  height: 69px;
  border-radius: 34.5px;
  background: #df0e63;
  box-shadow: 0px 6px 9px rgba(0, 0, 0, 0.16);
  margin-top: 15px;
  font-size: 25px;
}
.status-card {
  width: 100%;
  height: 269px;
  border-radius: 5px;
  background: #fff;
  border: 0.25px solid #707070;
  box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
}
.status-btn {
  width: 100%;
  height: 72px;
  border-radius: 36px;
  background: #e10c76;
  pointer-events: none;
}
.card-title {
  text-align: center !important;
}
</style>
