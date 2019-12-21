<template>
  <div>
    <b-row>
      <b-col>
        <p class="lbl-started">let's get started.</p>
      </b-col>
    </b-row>
    <b-row class="input">
      <b-col md="4">
        <b-form-input
          placeholder="first name"
          v-model="personInfo.firstName"
          class="box-shadE"
        ></b-form-input>
      </b-col>
      <b-col md="4">
        <b-form-input
          placeholder="last name"
          v-model="personInfo.lastName"
          class="box-shadE"
        ></b-form-input>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <h4 class="lbl-email-gender">enter e-mail</h4>
      </b-col>
    </b-row>
    <b-row class="input">
      <b-col md="4">
        <b-input-group class="mb-2" style="position:relative">
          <b-input-group-prepend is-text class="eml-ico">
            <font-awesome-icon class="icon-size" :icon="['fas', 'envelope']" />
          </b-input-group-prepend>
          <b-form-input
            class="box-shadE eml"
            v-model="personInfo.email"
          ></b-form-input>
        </b-input-group>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <h4 class="lbl-email-gender">gender</h4>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <b-button
          squared
          :variant="
            personInfo.gender == 'Male' ? 'dark active' : 'outline-secondary'
          "
          class="btn-male-female"
          @click="setGender('Male')"
          >MALE</b-button
        >
        <b-button
          squared
          :variant="
            personInfo.gender == 'Female' ? 'dark active' : 'outline-secondary'
          "
          class="btn-male-female"
          @click="setGender('Female')"
          >FEMALE</b-button
        >
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <h4 class="lbl-email-gender">enter contact number</h4>
      </b-col>
    </b-row>
    <b-row class="input">
      <b-col md="4">
        <vue-tel-input
          class="box-shadE1 tel"
          :enabledCountryCode="true"
          :validCharactersOnly="true"
          @input="setPhoneNumber"
        ></vue-tel-input>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <b-button class="btn-Next" variant="none" @click="goToNext">
          <span class="next">NEXT</span>
          <b-img class="next-arrow" :src="whiteArrow"></b-img>
        </b-button>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import { VueTelInput } from 'vue-tel-input'
import { validateService } from '@/shared/services/validate-values'
import { whiteArrowImage } from '@/shared/components-data/images'
import {
  firstNameError,
  lastNameError,
  emailRequiredError,
  emailValidateError,
  phoneRequiredError,
  phoneValidateError
} from '@/shared/components-data/messages'

export default {
  components: { VueTelInput },
  data() {
    return {
      whiteArrow: whiteArrowImage,
      isMobileNumberValid: false,
      personInfo: {
        firstName: null,
        lastName: null,
        email: null,
        gender: 'Male',
        phone: null
      },
      nationalNumber: ''
    }
  },
  methods: {
    setGender(gender) {
      this.personInfo.gender = gender
    },
    setPhoneNumber(num, data) {
      this.personInfo.phone =
        data.number && data.number.e164 ? data.number.e164 : ''
      this.nationalNumber =
        data.number && data.number.significant ? data.number.significant : ''

      this.isMobileNumberValid =
        data.isValid && data.type == 'mobile' ? true : false
    },
    validateForm() {
      let message = null
      if (!this.personInfo.firstName) {
        message = firstNameError
      } else if (!this.personInfo.lastName) {
        message = lastNameError
      } else if (!this.personInfo.email) {
        message = emailRequiredError
      } else if (!validateService.validateEmail(this.personInfo.email)) {
        message = emailValidateError
      } else if (!this.personInfo.phone) {
        message = phoneRequiredError
      } else if (!this.isMobileNumberValid) {
        message = phoneValidateError
      }
      return message
    },
    goToNext() {
      let message = this.validateForm()
      if (message) {
        this.$emit('onSetAlertMessage', message)
      } else {
        let personInfoWithNationalNumber = {
          personInfo: this.personInfo,
          nationalNumber: this.nationalNumber
        }
        this.$emit('onSetPersonInfo', personInfoWithNationalNumber)
      }
    }
  }
}
</script>
<style scoped>
.btn-male-female {
  margin-top: 1rem;
  font-weight: bold;
  border: 0 !important;
  width: 13.08vw;
  height: 3.205625vw;
  font-family: Montserrat;
  font-size: 1.2566457225712904vw;
  text-align: center;
  color: #000;
}

.btn-male-female:active {
  margin-top: 1rem;
  font-weight: bold;
  border: 0 !important;
  width: 13.08vw;
  height: 3.205625vw;
  background: #000;
  font-family: Montserrat;
  font-size: 1.2566457225712904vw;
  text-align: center;
  color: #fff;
}

.input-group-text {
  padding-top: 10px;
}
.lbl-email-gender {
  margin-top: 1.5rem;
  font-family: Montserrat;
  font-weight: bold;
  font-size: 1.5466408893185113vw;
  text-align: left;
  color: #000;
}

.input {
  margin-top: 0.5rem;
}
.lbl-started {
  font-family: Montserrat;
  font-weight: bold;
  font-size: 3.27vw;
  text-align: left;
  color: #000;
}
.lbl-margin-left {
  margin-left: 10rem;
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
.btn-dark {
  margin-left: -4px;
}
.btn-outline-secondary {
  margin-left: -4px;
}
</style>
