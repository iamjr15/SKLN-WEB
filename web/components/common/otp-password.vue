<template>
  <div>
    <b-row>
      <b-col>
        <div ref="recaptchaContainer">
          <span id="recaptcha-container"></span>
        </div>
        <h3 class="lbl-subject">enter the OTP sent to this number.</h3>
      </b-col>
    </b-row>
    <b-row class="input">
      <b-col md="4">
        <vue-tel-input
          class="box-shadE1 tel"
          :enabledCountryCode="true"
          v-model="phoneNumber.nationalNumber"
          disabled
        ></vue-tel-input>
      </b-col>
    </b-row>
    <b-row class="input">
      <b-col md="4">
        <b-form-input
          placeholder="enter OTP"
          v-model="otpPassword.otp"
          @keydown="numericValidation"
          maxlength="8"
          class="box-shadE"
        ></b-form-input>
      </b-col>
      <b-col>
        <b-button
          class="btn-verify"
          variant="none"
          :disabled="otpVerificationId == null || otpPassword.verifiedOtp"
          @click="verifyOtp"
          >VERIFY</b-button
        >&nbsp;
        <b-button
          class="btn-resend"
          variant="none"
          :disabled="otpVerificationId == null || otpPassword.verifiedOtp"
          @click="resendCode"
          >RESEND CODE</b-button
        >
      </b-col>
    </b-row>
    <b-row v-if="otpPassword.verifiedOtp">
      <b-col>
        <h3 class="lbl-subject">set password</h3>
      </b-col>
    </b-row>
    <b-row class="input" v-if="otpPassword.verifiedOtp">
      <b-col md="4">
        <b-input-group class="mb-2" style="position: relative;">
          <b-form-input
            placeholder="set password"
            :type="passwordInputType"
            v-model="otpPassword.password"
            class="box-shadE"
          ></b-form-input>
          <b-input-group-append class="pass-btn" is-text @click="showPassword">
            <span v-if="passwordInputType == 'password'">SHOW</span>
            <span v-else>HIDE</span>
          </b-input-group-append>
        </b-input-group>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <b-button variant="success" class="btn-Next" @click="goToNext">
          <span class="next">NEXT</span>
          <b-img class="next-arrow" :src="whiteArrow"></b-img>
        </b-button>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import { VueTelInput } from 'vue-tel-input'
import firebase from 'firebase'
import { validateService } from '@/shared/services/validate-values'
import { whiteArrowImage } from '@/shared/components-data/images'
import {
  passwordRequireError,
  passwordValidateError,
  phoneAlredyRegisteredError,
  otpRequiredError
} from '@/shared/components-data/messages'
import { mapActions } from 'vuex'

export default {
  components: { VueTelInput },
  props: {
    phoneNumber: {
      type: Object
    }
  },
  data() {
    return {
      otpPassword: {
        otp: null,
        verifiedOtp: false,
        password: null
      },
      whiteArrow: whiteArrowImage,
      otpVerificationId: null,
      recaptchaVerifier: null,
      passwordInputType: 'password'
    }
  },
  watch: {
    phoneNumber: {
      handler: function() {
        this.sendVerificationMessage()
      },
      deep: true
    }
  },
  methods: {
    ...mapActions({
      displayMessage: 'DISPLAY_MESSAGE',
      displayLoader: 'DISPLAY_LOADER'
    }),
    async sendVerificationMessage() {
      let self = this
      if (self.recaptchaVerifier) {
        self.recaptchaVerifier.clear()
        self.recaptchaVerifier = null
        this.$refs.recaptchaContainer.innerHTML = `<span id="recaptcha-container"></span>`
      }
      self.recaptchaVerifier = new firebase.auth.RecaptchaVerifier(
        'recaptcha-container',
        {
          size: 'invisible',
          'expired-callback': () => {
            this.displayMessage({
              message: 'RecaptchaVerifier expired-callback, need to handle'
            })
            setTimeout(() => {
              self.sendVerificationMessage()
            }, 100)
          }
        }
      )
      var provider = new firebase.auth.PhoneAuthProvider()
      let verificationId = await provider.verifyPhoneNumber(
        this.phoneNumber.numberToVerify,
        self.recaptchaVerifier
      )
      this.otpVerificationId = verificationId
    },
    numericValidation($event) {
      if (!validateService.validateNumeric($event.keyCode)) {
        $event.preventDefault()
      }
    },
    passwordValidation() {
      let message = null
      if (!this.otpPassword.otp) {
        message = otpRequiredError
      } else if (!validateService.validatePassword(this.otpPassword.password)) {
        message = passwordRequireError
      } else if (!this.otpPassword.otp) {
        message = passwordValidateError
      }
      return message
    },
    goToNext() {
      if (this.passwordValidation()) {
        this.$emit('onSetAlertMessage', this.passwordValidation())
      } else {
        this.$emit('onSetOtpPassword', this.otpPassword)
      }
    },
    showPassword() {
      this.passwordInputType =
        this.passwordInputType != 'text' ? 'text' : 'password'
    },

    async verifyOtp() {
      let self = this
      let message = ''
      if (!this.otpPassword.otp) {
        message = otpRequiredError
      } else {
        try {
          self.displayLoader(true)
          let phoneCredential = firebase.auth.PhoneAuthProvider.credential(
            self.otpVerificationId,
            self.otpPassword.otp
          )
          let phoneUser = await firebase
            .auth()
            .signInWithCredential(phoneCredential)
          self.displayLoader(false)
          if (!phoneUser.additionalUserInfo.isNewUser) {
            message = phoneAlredyRegisteredError
            this.$emit('onSetAlertMessage', message)
            return
          }
          self.otpPassword.verifiedOtp = true
        } catch (error) {
          self.displayLoader(false)
          self.otpPassword.verifiedOtp = false
          if (error.message) {
            message = error.message
          } else message = error
        }
      }
      if (message) {
        this.$emit('onSetAlertMessage', message)
      }
    },
    async resendCode() {
      let self = this
      let mobileNumber = this.phoneNumber.numberToVerify
      if (mobileNumber) {
        try {
          self.otpPassword.verifiedOtp = false
          let res = await this.sendVerificationMessage()
        } catch (err) {
          let error = ''
          if (err && err.code) {
            message = err.message
          } else {
            message = `Error resending code : ${err}`
          }
          this.$emit('onSetAlertMessage', message)
        }
      }
    }
  }
}
</script>

<style scoped>
.btn-icon {
  margin-left: 2rem;
}

.btn-verify {
  color: white;
  font-family: Montserrat;
  font-weight: bold;
  font-size: 1.46vw;
  text-align: center;
  width: 10.18vw;
  height: 3.345vw;
  border-radius: 6px;
  background: #1fc84c;
  box-shadow: 0px 10px 35px rgba(31, 200, 76, 0.65);
}
.btn-verify:hover {
  background-color: #1fc84c;
}
.btn-resend {
  font-family: Montserrat;
  font-weight: bold;
  font-size: 1.38vw;
  text-align: center;
  color: #fff;
  height: 3.345vw;
  border-radius: 6px;
  background: #fec541;
  box-shadow: 0px 10px 35px rgba(254, 197, 65, 0.65);
}
.btn-resend:hover,
.btn-resend:active {
  background-color: #fec541;
}
.input {
  margin-top: 2rem;
}

.pass-btn {
  position: absolute;
  right: 0px;
  z-index: 100;
  top: 2px;
}

.input-group-text {
  background-color: transparent;
  border: none;
  padding: 1.07421875vw;
  font-family: Montserrat;
  font-weight: bold;
  font-size: 1.025390625vw;
  text-align: left;
  color: #000;
}
</style>
