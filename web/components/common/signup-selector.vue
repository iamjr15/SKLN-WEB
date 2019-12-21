<template>
  <b-jumbotron style="background:white">
    <b-card class="signup-card-popup">
      <b-row>
        <b-col class="close-dialog" @click="closeDialog">
          <b-img style="height: 33px;" :src="crossImage"></b-img>
        </b-col>
      </b-row>
      <b-row>
        <b-col>
          <div class="col-div" @click="goToSignupTeacher()">
            signup to teach
            <b-img class="arrow-img" :src="rightArrow"></b-img>
          </div>
        </b-col>
        <b-col>
          <div class="col-div" @click="goToSignupStudent()">
            signup to learn
            <b-img class="arrow-img" :src="rightArrow"></b-img>
          </div>
        </b-col>
      </b-row>
    </b-card>
  </b-jumbotron>
</template>

<script>
import { rightArrow, crossImage } from '@/shared/components-data/images'
export default {
  data() {
    return {
      currentLocation: null,
      changeLocation: false,
      rightArrow: rightArrow,
      crossImage: crossImage
    }
  },
  methods: {
    openMapModel() {
      this.changeLocation = true
    },
    setCurrentLocation(location) {
      this.currentLocation = location.address
      this.changeLocation = false
    },
    goToSignupTeacher() {
      this.$router.push({
        name: 'common-signup',
        params: { signupAs: 'teacher' }
      })
    },
    goToSignupStudent() {
      this.$router.push({
        name: 'common-signup',
        params: { signupAs: 'student' }
      })
    },
    closeDialog() {
      this.$emit('onCloseModal', true)
    }
  }
}
</script>
<style>
.title {
  display: block;
  font-weight: 300;
  font-size: 100px;
  color: #35495e;
  letter-spacing: 1px;
}

.subtitle {
  font-weight: 300;
  font-size: 42px;
  color: #526488;
  word-spacing: 5px;
  padding-bottom: 15px;
  background: rgb(24, 210, 159);
}

.col-div {
  border-bottom: 2px solid black;
  display: initial;
  padding-bottom: 40px;
  margin-left: 10%;
  font-family: Montserrat;
  font-weight: 600;
  font-size: 3.630952380952381vw;
  line-height: 89px;
  text-align: left;
  color: #000;
}
.links {
  padding-top: 15px;
}
.card-title {
  text-align: right;
}

.vue-map-jumbotron {
  height: 23.229vw;
}

.signup-card-popup {
  border: 1px solid;
  width: 93.75vw;
  height: 29.26875vw;
  background: #fff;
  border: 1px solid #707070;
}
.close-dialog {
  display: flex;
  justify-content: flex-end;
  padding-bottom: 9%;
}
.arrow-img {
  height: 3.71vw;
  margin-left: 15px;
}
</style>
