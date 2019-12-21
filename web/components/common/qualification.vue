<template>
  <div>
    <b-row>
      <b-col>
        <h5 class="lbl">what's your current occupation?</h5>
      </b-col>
    </b-row>
    <b-row>
      <b-col md="4">
        <b-form-select
          value="null"
          :options="occupations"
          class="dropdown"
          @change="setOccupation"
        ></b-form-select>
        <b-img class="dropdown-arrow" :src="chevronDown"></b-img>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <h5 class="lbl">what's your teaching experiance ?</h5>
      </b-col>
    </b-row>
    <b-row>
      <b-col md="4">
        <b-form-select
          value="null"
          :options="experiences"
          class="dropdown"
          @change="setExperience"
        ></b-form-select>
        <b-img class="dropdown-arrow" :src="chevronDown"></b-img>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <h5 class="lbl">select your qualification</h5>
      </b-col>
    </b-row>
    <b-row>
      <b-col md="4">
        <b-form-select
          value="null"
          :options="qualifications"
          class="dropdown"
          @change="setQualification"
        ></b-form-select>
        <b-img class="dropdown-arrow" :src="chevronDown"></b-img>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <h5 class="lbl">select area of qualification</h5>
      </b-col>
    </b-row>
    <b-row>
      <b-col md="4">
        <b-form-select
          value="null"
          :options="qualificationAreas"
          class="dropdown"
          @change="setQualificationArea"
        ></b-form-select>
        <b-img class="dropdown-arrow" :src="chevronDown"></b-img>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <h5 class="lbl">select your targeted board</h5>
      </b-col>
    </b-row>
    <b-row>
      <b-col cols="1" style="margin-right: 30px;">
        <b-card @click="setTargetBoard('cbse')" class="card">
          <b-form-radio
            name="board"
            v-model="qualification.targetBoard"
            value="cbse"
            style="text-align: end;"
            @change="setTargetBoard('cbse')"
            size="lg"
          ></b-form-radio>
          <span class="textarea-text">CBSE</span>
        </b-card>
      </b-col>
      <b-col cols="1" style="margin-right: 30px;">
        <b-card @click="setTargetBoard('icse')" class="card">
          <b-form-radio
            name="board"
            v-model="qualification.targetBoard"
            value="icse"
            style="text-align: end;"
            @change="setTargetBoard('icse')"
            size="lg"
          ></b-form-radio>
          <span class="textarea-text">ICSE</span>
        </b-card>
      </b-col>
      <b-col cols="1" style="margin-right: 30px;">
        <b-card @click="setTargetBoard('state board')" class="card">
          <b-form-radio
            name="board"
            v-model="qualification.targetBoard"
            value="state board"
            style="text-align: end;"
            @change="setTargetBoard('state board')"
            size="lg"
          ></b-form-radio>
          <span class="textarea-text">STATE BOARD</span>
        </b-card>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <h5 class="lbl">create your professional biodata (optional)</h5>
      </b-col>
    </b-row>
    <b-row>
      <b-col md="8">
        <b-form-textarea
          id="textarea-rows"
          rows="10"
          placeholder="adding a detailed description will help you get more relevent queries.Eg: I have done my grauation in B.Ed. from HR college, Mumbai University in 2012. I have 4 years of experience in teaching Maths and Science for std. 4-10 for CBSE and ICSE boards."
          v-model="qualification.biodata"
        ></b-form-textarea>
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
import { chevronDown, whiteArrowImage } from '@/shared/components-data/images'
import {
  occupations,
  experiences,
  qualifications,
  qualificationAreas
} from '@/shared/components-data/qualification-data'
export default {
  data() {
    return {
      chevronDown: chevronDown,
      whiteArrow: whiteArrowImage,
      qualification: {
        occupation: null,
        experience: null,
        rating: 0,
        qualification: null,
        qualificationArea: null,
        targetBoard: null,
        biodata: null
      },
      occupations: occupations,
      experiences: experiences,
      qualifications: qualifications,
      qualificationAreas: qualificationAreas
    }
  },
  methods: {
    setTargetBoard(board) {
      this.qualification.targetBoard = board
    },
    setOccupation(occupation) {
      this.qualification.occupation = occupation
    },
    setExperience(experience) {
      this.qualification.experience = experience
    },
    setQualification(qualification) {
      this.qualification.qualification = qualification
    },
    setQualificationArea(qualificationArea) {
      this.qualification.qualificationArea = qualificationArea
    },
    validateForm() {
      let message = null
      if (!this.qualification.occupation) {
        message = 'Please select occupation'
      } else if (!this.qualification.experience) {
        message = 'Please select your experience'
      } else if (!this.qualification.qualification) {
        message = 'Please select your qualification'
      } else if (!this.qualification.qualificationArea) {
        message = 'Please select area of qualification'
      } else if (!this.qualification.targetBoard) {
        message = 'Please choose targeted board'
      }
      return message
    },
    goToNext() {
      if (this.validateForm()) {
        this.$emit('onSetAlertMessage', this.validateForm())
      } else {
        this.$emit('onSetQualification', this.qualification)
      }
    }
  }
}
</script>
<style scoped>
#textarea-rows {
  width: 51.84vw;
  height: 21.65vw;
  background: #fff;
  border: 1px solid #707070;
  filter: drop-shadow(0px 3px 25px rgba(0, 0, 0, 0.16));
}
.dropdown {
  margin-top: 1rem;
}
.dropdown-arrow {
  width: 1.5vw;
  position: absolute;
  top: 55%;
  height: 0.78vw;
  right: 9%;
}
.card {
  position: relative;
}
.card span {
  position: absolute;
  bottom: 0;
  text-align: center;
}
.card-body {
  width: 8.2vw;
  height: 12.66vw;
  border-radius: 3px;
  background: #fff;
  border: 1px solid #707070;
}
.custom-radio .custom-control-input:checked ~ .custom-control-label::after {
  background-image: none !important;
}
</style>
