<template>
  <b-jumbotron>
    <b-row align-center>
      <b-col md="8" class="input1">
        <h4 class="font-bold" @click="openScheduleDefinition">SCHEDULE</h4>
      </b-col>
    </b-row>
    <b-row>
      <vue-cal
        default-view="month"
        :disable-views="['years', 'year']"
        :time="false"
        style="height: 37.2vw"
        events-on-month-view="short"
        :events="scheduleData"
        @cell-click="openScheduleDefinition"
      ></vue-cal>
    </b-row>
    <b-modal ref="definitionModal" no-close-on-esc>
      <ScheduleDefinition
        :selectedDate="selectedDate"
        @onAddSchedule="insertEvent"
      />
    </b-modal>
  </b-jumbotron>
</template>

<script>
import VueCal from 'vue-cal'
import 'vue-cal/dist/vuecal.css'
import { mapGetters } from 'vuex'
import moment from 'moment'
import { batchesRef } from '@/store/firestore'
import ScheduleDefinition from '@/components/teacher/schedule-definition'
export default {
  components: {
    VueCal,
    ScheduleDefinition
  },
  data() {
    return {
      teacher: null,
      allBatches: [],
      selectedDate: null,
      scheduleData: []
    }
  },

  mounted() {
    if (this.$route.params.teacherData) {
      this.teacher = this.$route.params.teacherData
    } else {
      this.teacher = this.teacherData
    }
    this.manipulateDataFromDB()
  },
  computed: {
    ...mapGetters({
      teacherData: ['teacherModule/GET_TEACHER_DATA']
    })
  },
  methods: {
    openScheduleDefinition(calendarSelectedDate) {
      this.$refs.definitionModal.show()
      this.selectedDate = calendarSelectedDate ? calendarSelectedDate : null
    },
    insertEvent(calendarEvent) {
      calendarEvent.selectedDays.map((res) => {
        let batchForView = {
          start: startTime,
          end: endTime,
          title: batch.title
        }
      })
    },
    async manipulateDataFromDB() {
      let self = this
      let batches = await batchesRef
        .where('teacher.id', '==', this.teacher.id)
        .get()
      batches.forEach((res) => {
        let batch = res.data()
        let startTime = moment(batch.timing.startTime.toDate()).format(
          'YYYY-MM-DD'
        )
        let endTime = moment(batch.timing.endTime.toDate()).format('YYYY-MM-DD')
        let batchForView = {
          start: startTime,
          end: endTime,
          title: batch.title,
          content: batch.title,
          class: 'leisure'
        }
        this.scheduleData.push(batchForView)
      })
    }
  }
}
</script>

<style scoped>
.btn-male-female:hover {
  color: white;
  background-color: black;
  border: 0 !important;
  box-shadow: 0px 0.4px 13px -2px lightgrey !important;
}
.btn-male-female:active {
  color: white !important;
  background-color: black !important;
}
.btn-male-female {
  margin-top: 1rem;
  margin-left: 3rem;
  font-weight: bold;
  padding-right: 30px;
  padding-left: 30px;
}
.lbl-email-gender {
  margin-top: 2rem;
  margin-left: 3rem;
  font-weight: 800;
}
.box-shadE {
  border: 1px solid gray !important;
}
.input1 {
  margin-left: 2rem;
  margin-top: 0.5rem;
  text-align: center;
}
.input {
  margin-top: 0.5rem;
}
.lbl-started {
  font-size: 50px;
  font-weight: 800;
  margin-top: 2rem;
  margin-left: 2.7rem;
}
.lbl-margin-left {
  margin-left: 10rem;
}

.login-lbl {
  margin-top: 3.5rem;
}

.head-arrow {
  display: flex;
}
.font-bold {
  font-weight: bold;
}
.line {
  width: 40%;
  height: 2px;
  margin-left: 30%;
  background-color: blue;
}
.garade-class-btn {
  font-size: 13px !important;
}
p {
  color: blue;
}

.leisure {
  background-color: rgba(253, 156, 66, 0.9);
  border: 1px solid rgb(233, 136, 46);
  color: #fff;
}
.sport {
  background-color: rgba(255, 102, 102, 0.9);
  border: 1px solid rgb(235, 82, 82);
  color: #fff;
}
</style>
