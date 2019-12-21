<template>
  <b-jumbotron style="background:white">
    <AlertMessage />
    <b-card class="login-popup">
      <b-row>
        <b-col class="close-dialog" @click="closeDialog">
          <b-img style="height: 33px;" :src="crossImage"></b-img>
        </b-col>
      </b-row>
      <b-row>
        <b-col>
          <b-row>
            <div class="col-login-div">
              <span style="padding-right:13vw">login</span>
              <b-img class="arrow-img" :src="rightArrow"></b-img>
            </div>
          </b-row>
          <b-row>
            <b-img class="login-img" :src="loginImage"></b-img>
          </b-row>
        </b-col>
        <b-col style="padding-top:6%">
          <b-row>
            <b-col cols="8">
              <b-input-group class="mb-2" style="position:relative">
                <b-input-group-prepend is-text class="eml-ico">
                  <font-awesome-icon
                    class="icon-size"
                    :icon="['fas', 'envelope']"
                  />
                </b-input-group-prepend>
                <b-form-input
                  class="box-shadE eml"
                  v-model="loginInfo.email"
                ></b-form-input>
              </b-input-group>
            </b-col>
          </b-row>
          <b-row>
            <b-col cols="8">
              <b-input-group class="mb-2" style="position: relative;">
                <b-form-input
                  placeholder="enter password"
                  :type="passInputType"
                  v-model="loginInfo.password"
                  class="box-shadE"
                ></b-form-input>
                <b-input-group-append
                  class="pass-btn"
                  is-text
                  @click="showPassword"
                >
                  <span v-if="passInputType == 'password'">SHOW</span>
                  <span v-else>HIDE</span>
                </b-input-group-append>
              </b-input-group>
            </b-col>
          </b-row>
          <b-row>
            <b-button variant="none" class="btn-Cancel" @click="login">
              LOGIN
              <font-awesome-icon :icon="['fas', 'arrow-right']" />
            </b-button>
          </b-row>
        </b-col>
      </b-row>
    </b-card>
  </b-jumbotron>
</template>

<script>
import { validateService } from '@/shared/services/validate-values'
import {
  emailRequiredError,
  emailValidateError,
  passwordRequireError,
  passwordValidateError
} from '@/shared/components-data/messages'
import {
  crossImage,
  rightArrow,
  loginImage
} from '@/shared/components-data/images'
import AlertMessage from '@/components/common/alert-message'
import { mapGetters, mapActions } from 'vuex'

export default {
  components: { AlertMessage },
  data() {
    return {
      rightArrow: rightArrow,
      crossImage: crossImage,
      loginImage: loginImage,
      loginInfo: {
        email: '',
        password: ''
      },
      passInputType: 'password'
    }
  },
  computed: {
    ...mapGetters({
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
    }
  },
  methods: {
    ...mapActions({
      loginUser: 'LOGIN',
      message: 'DISPLAY_MESSAGE'
    }),
    showPassword() {
      this.passInputType = this.passInputType != 'text' ? 'text' : 'password'
    },
    closeDialog() {
      this.$emit('onCloseModal', true)
    },
    async login() {
      if (this.loginValidation(this.loginInfo) === 'success') {
        let res = this.loginUser({
          email: this.loginInfo.email,
          password: this.loginInfo.password
        })
      }
      if (this.loginValidation(this.loginInfo) !== 'success') {
        this.message({
          message: this.loginValidation(this.loginInfo)
        })
      }
    },

    loginValidation(loginInfo) {
      if (!loginInfo.email) {
        return emailRequiredError
      } else if (!validateService.validateEmail(loginInfo.email)) {
        return emailValidateError
      } else if (!loginInfo.password) {
        return passwordRequireError
      } else if (!validateService.validatePassword(loginInfo.password)) {
        return passwordValidateError
      } else {
        return 'success'
      }
    }
  }
}
</script>

<style scoped>
.title {
  display: block;
  font-weight: 300;
  font-size: 100px;
  color: #35495e;
  letter-spacing: 1px;
}
.icon-size {
  width: 1.5625vw !important;
  height: 1.147vw;
  color: #000;
}
.eml-ico {
  position: absolute;
  left: 1px;
  top: 2px;
  z-index: 100;
}
.eml {
  padding-left: 3.5vw;
}
.input-group-text {
  background-color: transparent;
  border: none;
  padding: 0.8699855002416627vw;
}
.pass-btn {
  position: absolute;
  right: 0px;
  z-index: 100;
  top: 2px;
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

.col-login-div {
  border-bottom: 2px solid black;
  padding-bottom: 40px;
  margin-left: 10%;
  font-weight: 600;
  font-size: 3.630952380952381vw;
  color: #000;
}
.login-img {
  margin-left: 9vw;
  height: 14.87vw;
  width: 19vw;
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

.loc-nam-txt {
  margin-left: 1rem;
  margin-right: 1rem;
}
.login-popup {
  border: 1px solid;
  width: 93.75vw;
  height: 29.26875vw;
  background: #fff;
  border: 1px solid #707070;
}
.close-dialog {
  display: flex;
  justify-content: flex-end;
  padding-bottom: 1%;
}
.arrow-img {
  height: 4.18125vw;
  margin-left: 15px;
}
.btn-Cancel {
  margin-left: 1rem;
  width: 12rem;
}
</style>
