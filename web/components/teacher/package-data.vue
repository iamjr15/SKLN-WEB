<template>
  <div>
    <b-row>
      <b-col>
        <h5 class="lbl">Create your package</h5>
      </b-col>
    </b-row>
    <b-row>
      <b-col md="4">
        <h5 class="package-add-name">PACKAGE 1</h5>
        <div class="package-border"></div>
      </b-col>
    </b-row>

    <b-row>
      <b-col md="4">
        <b-form-select
          :value="packageToAdd.frequecy"
          :options="frequencies"
          class="dropdown"
          @change="selectFrequency"
        ></b-form-select>
        <b-img class="dropdown-arrow" :src="chevronDown"></b-img>
      </b-col>
    </b-row>

    <b-row>
      <b-col md="4">
        <b-form-select
          :value="packageToAdd.occurance"
          :options="numberOfClasses"
          class="dropdown"
          @change="selectOccurance"
        ></b-form-select>
        <b-img class="dropdown-arrow" :src="chevronDown"></b-img>
      </b-col>
    </b-row>

    <b-row>
      <b-col md="4">
        <b-form-input
          v-model="packageToAdd.studentCapacity"
          class="custom-select"
          @keypress="numericValidation"
          placeholder="maximum student capacity(i.e. - 20)"
        ></b-form-input>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <h5 class="lbl">set price</h5>
      </b-col>
    </b-row>
    <b-row class="subject-input">
      <b-col md="4">
        <span class="dollar-sign">$</span>
        <b-form-input
          class="box-shadE"
          style="padding-left:5%"
          @keypress="numericValidation"
          v-model="packageToAdd.price"
        ></b-form-input>
      </b-col>
      <b-col md="2">
        <b-form-select
          value="monthly"
          :options="rateOptions"
          @change="selectRateOption"
          style="color: blue;width: 16.53vw;"
        ></b-form-select>
        <b-img class="dropdown-arrow1" :src="chevronDown"></b-img>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <h5 class="lbl">payment option (select all that apply)</h5>
      </b-col>
    </b-row>
    <b-row>
      <b-col class="btn-margin">
        <b-button
          class="garade-class-btn btn-payment"
          pill
          :class="
            packageToAdd.paymentOptions.indexOf('bi anual') > -1 ? 'active' : ''
          "
          :variant="
            packageToAdd.paymentOptions.indexOf('bi anual') > -1
              ? 'secondary'
              : 'outline-secondary'
          "
          @click="setPaymentOption('bi anual')"
          >bi-annual installments</b-button
        >
        <b-button
          class="garade-class-btn btn-payment"
          pill
          :class="
            packageToAdd.paymentOptions.indexOf('monthly') > -1 ? 'active' : ''
          "
          :variant="
            packageToAdd.paymentOptions.indexOf('monthly') > -1
              ? 'secondary'
              : 'outline-secondary'
          "
          @click="setPaymentOption('monthly')"
          >monthly payment</b-button
        >
        <b-button
          class="garade-class-btn btn-payment"
          pill
          :class="
            packageToAdd.paymentOptions.indexOf('bank transfer') > -1
              ? 'active'
              : ''
          "
          :variant="
            packageToAdd.paymentOptions.indexOf('bank transfer') > -1
              ? 'secondary'
              : 'outline-secondary'
          "
          @click="setPaymentOption('bank transfer')"
          >bank transfer</b-button
        >
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <h5 class="lbl">Class location</h5>
      </b-col>
    </b-row>
    <b-row class="subject-input">
      <b-col md="6">
        <font-awesome-icon class="f-ico" :icon="['far', 'compass']" />

        <vue-google-autocomplete
          id="g-place"
          style="padding-left: 3vw; width:100%"
          class="box-shadE"
          placeholder="enter location"
          @placechanged="getAddressData"
          @blur="extractAddress"
        ></vue-google-autocomplete>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <b-button variant="success" class="btn-Next" @click="setPackage">
          <span class="next">NEXT</span>
          <b-img class="next-arrow" :src="whiteArrow"></b-img>
        </b-button>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import VueGoogleAutocomplete from 'vue-google-autocomplete'
import { validateService } from '@/shared/services/validate-values'
import { whiteArrowImage, chevronDown } from '@/shared/components-data/images'
import {
  frequencies,
  numberOfClasses,
  rateOptions
} from '@/shared/components-data/package-info-data'
import {
  frequencyRequiredError,
  numberOfClassesRequiredError,
  studentCapacityRequiredError,
  priceRequiredError,
  paymentOptionRequiredError,
  locationRequiredError
} from '@/shared/components-data/messages'
export default {
  components: {
    VueGoogleAutocomplete
  },
  props: {
    packageToEdit: {
      type: Object
    }
  },
  data() {
    return {
      whiteArrow: whiteArrowImage,
      chevronDown: chevronDown,
      packageToAdd: {
        name: 'PACKAGE 1',
        studentCapacity: null,
        frequecy: null,
        occurance: null,
        price: null,
        rateOption: 'monthly',
        paymentOptions: [],
        location: {
          longitude: 0,
          latitude: 0
        }
      },
      frequencies: frequencies,
      numberOfClasses: numberOfClasses,
      rateOptions: rateOptions
    }
  },
  mounted() {
    if (this.packageToEdit) {
      this.packageToAdd = this.packageToEdit
    }
  },
  methods: {
    numericValidation($event) {
      if (!validateService.validateNumeric($event.keyCode)) {
        $event.preventDefault()
      }
    },
    validateForm() {
      let message = null
      if (!this.packageToAdd.frequecy) {
        message = frequencyRequiredError
      } else if (!this.packageToAdd.occurance) {
        message = numberOfClassesRequiredError
      } else if (!this.packageToAdd.studentCapacity) {
        message = studentCapacityRequiredError
      } else if (!this.packageToAdd.price) {
        message = priceRequiredError
      } else if (this.packageToAdd.paymentOptions.length < 1) {
        message = paymentOptionRequiredError
      } else if (
        this.packageToAdd.location.longitude == 0 ||
        this.packageToAdd.location.latitude == 0
      ) {
        message = locationRequiredError
      }

      return message
    },
    setPackage() {
      let message = this.validateForm()
      if (this.validateForm()) {
        this.$emit('onSetAlertMessage', message)
      } else {
        this.$emit('onSetPackage', this.packageToAdd)
      }
    },
    selectFrequency(frequency) {
      this.packageToAdd.frequecy = frequency
    },
    selectOccurance(occurance) {
      this.packageToAdd.occurance = occurance
    },
    selectRateOption(option) {
      this.packageToAdd.rateOption = option
    },
    setPaymentOption(option) {
      if (this.packageToAdd.paymentOptions.length > 0) {
        let finded = this.packageToAdd.paymentOptions.findIndex(
          (res) => res == option
        )
        if (finded > -1) {
          this.packageToAdd.paymentOptions.splice(finded, 1)
        } else {
          this.packageToAdd.paymentOptions.push(option)
        }
      } else {
        this.packageToAdd.paymentOptions.push(option)
      }
    },
    getAddressData: function(addressData, placeResultData, id) {
      this.packageToAdd.location.longitude = addressData.longitude
      this.packageToAdd.location.latitude = addressData.latitude
    },
    extractAddress: function() {
      google.maps.places.Autocomplete(this.getAddressData, 'place_changed')
    }
  }
}
</script>
<style scoped>
#textarea-rows {
  margin-top: 10px;
  margin-left: 0rem;
  border: 1px solid gray;
}
.dropdown {
  margin-top: 1rem;
}

@media screen and (min-width: 400px) and (max-width: 1100px) {
  .garade-class-btn {
    width: auto !important;
    height: auto;
  }
}
.garade-class-btn {
  width: 20vw;
  height: 3.4vw;
  border-radius: 34.5px;
  background: #fff;
  border: 1px solid #707070;
  font-family: Montserrat;
  font-weight: bold;
  font-size: 1.4973262032085561vw;
  text-align: center;
  color: #000;
}
@media screen and (max-width: 767px) {
  .dollar-sign {
    margin-top: 0.8% !important;
  }
}
.dollar-sign {
  font-family: Montserrat;
  font-weight: bold;
  font-size: 1.4973262032085561vw;
  text-align: center;
  color: #000;
  position: absolute;
  margin-top: 2%;
  left: 4%;
}

.pac-container {
  z-index: 1051 !important;
}
.package-add-name {
  color: #0031f6;
  font-family: Montserrat;
  font-weight: 600;
  font-size: 38px;
  text-align: start;
}
.package-border {
  width: 319px;
  height: 0px;
  background: transparent;
  border: 1px solid #0031f6;
}
.f-ico {
  position: absolute;
  margin-left: 15px;
  z-index: 1;
  top: 25%;
}
</style>
