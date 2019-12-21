<template>
  <b-jumbotron>
    <b-row align-center>
      <b-col md="8" class="input1">
        <h4 class="font-bold" @click="goToManageClasses">MANAGE CLASSES +</h4>
        <h5>EDIT SCHEDULE</h5>
        <div class="line"></div>
      </b-col>
    </b-row>

    <b-row class="input" style="margin-top:50px;">
      <b-col md="8">
        <p>BATCH NAME</p>
        <b-form-input v-model="schedule.name" class="box-shadE"></b-form-input>
      </b-col>
    </b-row>
    <b-row class="input">
      <b-col md="4">
        <p>START TIME</p>
        <b-form-input
          v-model="schedule.startTime"
          class="box-shadE"
        ></b-form-input>
      </b-col>
      <b-col md="4">
        <p>END TIME</p>
        <b-form-input
          v-model="schedule.endTime"
          class="box-shadE"
        ></b-form-input>
      </b-col>
    </b-row>
    <b-row class="input">
      <b-col md="8">
        <p>SELECT DATES</p>
        <b-button
          class="garade-class-btn"
          pill
          @click="addSelectedDay('monday')"
          variant="outline-secondary"
          >MON</b-button
        >
        <b-button
          class="garade-class-btn"
          pill
          @click="addSelectedDay('tuesday')"
          variant="outline-secondary"
          >TUE</b-button
        >
        <b-button
          class="garade-class-btn"
          pill
          @click="addSelectedDay('wednesday')"
          variant="outline-secondary"
          >WED</b-button
        >
        <b-button
          class="garade-class-btn"
          pill
          @click="addSelectedDay('thursday')"
          variant="outline-secondary"
          >THU</b-button
        >
        <b-button
          class="garade-class-btn"
          pill
          @click="addSelectedDay('friday')"
          variant="outline-secondary"
          >FRI</b-button
        >
        <b-button
          class="garade-class-btn"
          pill
          @click="addSelectedDay('saturday')"
          variant="outline-secondary"
          >SAT</b-button
        >
        <b-button
          class="garade-class-btn"
          pill
          @click="addSelectedDay('sunday')"
          variant="outline-secondary"
          >SUN</b-button
        >
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <b-button variant="success" @click="addSchedule" class="btn-Next"
          >DONE</b-button
        >
      </b-col>
    </b-row>
  </b-jumbotron>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  components: {},
  data() {
    return {
      teacher: null,
      schedule: {
        name: null,
        startTime: null,
        endTime: null,
        selectedDays: []
      }
    }
  },
  mounted() {
    this.teacher = this.$route.params.teacher
  },
  methods: {
    ...mapActions({
      displayMessage: 'DISPLAY_MESSAGE'
    }),
    goToManageClasses() {
      this.$router.push({
        name: 'manageClasses',
        params: { teacher: this.teacher }
      })
    },
    addSelectedDay(day) {
      if (this.schedule.selectedDays.length > 0) {
        let finded = this.schedule.selectedDays.findIndex(
          (selectedDay) => selectedDay == day
        )
        if (finded > -1) {
          this.displayMessage({
            message: day + ' already selected'
          })
        } else {
          this.schedule.selectedDays.push(day)
        }
      } else {
        this.schedule.selectedDays.push(day)
      }
    },
    addSchedule() {
      this.$emit('onAddSchedule', this.schedule)
    }
  }
}
</script>

<style scoped>
.btn-male-female:hover {
  color: white;
  background-color: black;
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
.signup-lbl {
  font-size: 40px;
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
</style>
