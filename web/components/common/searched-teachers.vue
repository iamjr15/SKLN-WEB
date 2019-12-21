<template>
  <div>
    <b-row>
      <b-col md="4" v-for="(teacher, index) in teachersFromStore" :key="index">
        <div class="Teacher-Data">
          <b-row>
            <b-col>
              <b-img
                :src="teacher.personInfo.accountPicture"
                alt="img"
                class="img-fluid"
              ></b-img>
            </b-col>

            <b-col class="text-align-search">
              <div class="d-flex-search">
                <b-img
                  class="image-search"
                  :src="starFullImage"
                  fluid-grow
                  alt="img"
                ></b-img>
                <h1 v-text="teacher.qualification.rating" />
              </div>
              <b-button class="dropdown-btn-search">rating.</b-button>
              <h4 class="mt-3">
                <span
                  v-if="teacher.qualification.classType.length > 1"
                  v-text="
                    teacher.qualification.classType[0] +
                      '/' +
                      teacher.qualification.classType[1]
                  "
                />
                <span v-else v-text="teacher.qualification.classType[0]" />
              </h4>
              <b-button class="dropdown-btn-search">class type.</b-button>
            </b-col>
          </b-row>
          <h1 class="search-btn-heading">
            <span v-text="teacher.personInfo.firstName" />
            <span
              v-if="teacher.qualification.instituteNeme"
              v-text="'| ' + teacher.qualification.instituteNeme"
            />
          </h1>
          <h1 class="search-btn-heading">
            <span
              v-for="(subject, index) of Object.keys(
                teacher.academicInfo.subjects
              )"
              :key="index"
            >
              {{ subject }}
              <span
                v-if="
                  index < Object.keys(teacher.academicInfo.subjects).length - 1
                "
                >|</span
              >
            </span>
          </h1>

          <span
            class="teacher-text-detail"
            :class="teacherToShowBioData == teacher.id ? 'over' : ''"
          >
            {{ teachersBioDataToShow(teacher) }}
            <span
              style="color:blue"
              v-if="
                teachersBioDataToShow(teacher).length &&
                  teachersBioDataToShow(teacher).length <= 70 &&
                  teacherToShowBioData != teacher.id
              "
              @click="setTeacherToShowCompleteBiodata(teacher)"
              >...read more</span
            >
          </span>
          <b-button
            variant="success"
            class="btn-next1"
            @click="goToTeacherProfile(teacher)"
          >
            <span class="next1">
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
            </span>
            <b-img class="next-arrow1" :src="whiteArrow"></b-img>
          </b-button>
        </div>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import TeacherProfileComponent from '@/components/student/teacher-profile'
import { starFull, whiteArrowImage } from '@/shared/components-data/images'
import { mapGetters, mapActions } from 'vuex'
export default {
  components: {
    TeacherProfileComponent
  },
  props: {
    searchCriteria: {
      selectedClassTypes: [],
      locationRange: 0,
      selectedGrade: 0,
      subject: null,
      currentLocation: {}
    }
  },
  data() {
    return {
      starFullImage: starFull,
      whiteArrow: whiteArrowImage,
      teacherToShowBioData: null,
      oldCriteria: {
        selectedClassTypes: [],
        locationRange: 0,
        selectedGrade: 0,
        subject: null,
        currentLocation: {}
      },
      teachers: [],
      teachersSubject: [],
      teachersHavingSelectedGrade: [],
      teachersHavingSelectedSubject: [],
      teachersHavingSelectedClassType: [],
      teachersHavingSelectedLocation: [],
      selectedTeacherForRequest: {}
    }
  },
  watch: {
    searchCriteria: {
      handler: function(res) {
        this.searchTeachers()
      },
      deep: true
    }
  },
  computed: {
    ...mapGetters({
      teachersFromStore: 'studentModule/GET_SEARCH_TEACHER_BY_STUDENT',
      loginState: 'GET_LOGIN_STATE',
      userRole: 'GET_USER_ROLE'
    })
  },
  methods: {
    ...mapActions({
      getSearchedTeacher: 'studentModule/GET_SEARCHED_TEACHERS',
      displayMessage: 'DISPLAY_MESSAGE'
    }),
    getTeacherSubjectString(tutorId) {
      let subjects = ''
      let teacherSubjects = this.lodash.filter(
        this.teachersSubject,
        (t) => t.teacherId === tutorId
      )
      teacherSubjects.forEach((t) => {
        subjects.concat(t.name + ' | ')
      })
      subjects = subjects.slice(0, -2)
      return subjects
    },
    teachersBioDataToShow(teacher) {
      if (
        this.teacherToShowBioData &&
        this.teacherToShowBioData == teacher.id &&
        teacher.personInfo.biodata
      ) {
        return teacher.personInfo.biodata
      } else if (teacher.personInfo.biodata) {
        return teacher.personInfo.biodata.substring(1, 70)
      } else {
        return ''
      }
    },
    searchTeachers() {
      this.getSearchedTeacher(this.searchCriteria)
    },
    setTeacherToShowCompleteBiodata(teacher) {
      this.teacherToShowBioData = teacher.id
    },
    goToTeacherProfile(teacher) {
      if (this.loginState && this.userRole == 'student') {
        this.selectedTeacherForRequest = teacher
        let searchedGrade = 'grade_' + this.searchCriteria.selectedGrade
        this.$router.push({
          name: 'student-teacher-details',
          params: {
            teacher: this.selectedTeacherForRequest,
            gradeKey: searchedGrade
          }
        })
      } else {
        this.displayMessage({
          message: 'Please login as student first to view details',
          varient: 'warning'
        })
      }
    },
    closeModal(request) {
      this.$refs.teacherProfileModal.hide()
    }
  }
}
</script>

<style scoped>
.Teacher-Data {
  height: 100%;
  border-radius: 42px;
  background: #fff;
  border: 1px solid #707070;
  padding: 30px;
}
.text-align-search {
  text-align: center;
}
.d-flex-search {
  display: flex;
  justify-content: center;
}
.image-search {
  width: 2vw !important;
  text-align: center;
  height: 1.858vw;
  margin-right: 20px;
}
.dropdown-btn-search {
  width: 100%;
  height: 66px;
  border-radius: 33px;
  background: #fff;
  border: 1px solid #032bf1;
  font-family: Montserrat Alternates;
  font-weight: normal;
  font-size: 1.82vw;
  text-align: center;
  color: #000;
  pointer-events: none;
}
.search-btn-heading {
  font-family: Montserrat;
  font-weight: 600;
  font-size: 26px;
  text-align: left;
  color: #000;
}
.teacher-text-detail {
  height: 75.36px;
  font-family: Montserrat;
  font-weight: 300;
  font-size: 18px;
  text-align: left;
  color: #000;
  overflow: hidden;
  display: inline-block;
}

.over {
  overflow-y: scroll;
  overflow-x: hidden;
}
.btn-next1 {
  width: 100%;
  height: 71.71px;
  border-radius: 2.5px;
  background: #33e876;
  box-shadow: 0px 10px 10px rgba(51, 232, 118, 0.16);
  display: flex;
  align-items: center;
  justify-content: center;
  border: 0;
  bottom: 0;
  align-items: center;
}
.next1 {
  font-family: Montserrat;
  font-weight: bold;
  font-size: 20px;
  text-align: center;
  color: #fff;
}
.next-arrow1 {
  height: 2.18vw;
  margin-left: 5%;
  cursor: pointer;
}
</style>
