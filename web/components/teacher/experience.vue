<template>
  <div>
    <b-row>
      <b-col>
        <h5 class="lbl">how do you want to give classes?</h5>
      </b-col>
    </b-row>
    <b-row>
      <b-col md="4">
        <b-form-select
          value="null"
          :options="classTypes"
          class="dropdown"
          @change="setClassType"
        ></b-form-select>
        <b-img class="dropdown-arrow" :src="chevron"></b-img>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <h5 class="lbl">do you run/belong to a coaching instite?</h5>
      </b-col>
    </b-row>
    <b-row>
      <b-col md="4">
        <b-form-select
          value="null"
          :options="institutionBelopngs"
          class="dropdown"
          @change="setInstituteBelonging"
        ></b-form-select>
        <b-img class="dropdown-arrow" :src="chevron"></b-img>
      </b-col>
    </b-row>
    <div v-if="experience.belongToInstitute">
      <b-row>
        <b-col>
          <h3 class="lbl">enter name of the institute</h3>
        </b-col>
      </b-row>
      <b-row>
        <b-col md="4">
          <b-form-input
            v-model="experience.instituteNeme"
            class="custom-select"
            placeholder="enter name"
          ></b-form-input>
        </b-col>
      </b-row>
      <b-row>
        <b-col>
          <h5 class="lbl">select your role in institute</h5>
        </b-col>
      </b-row>
      <b-row>
        <b-col md="4">
          <b-form-select
            value="null"
            :options="institutionRoles"
            class="dropdown"
            @change="setInstituteRole"
          ></b-form-select>
          <b-img class="dropdown-arrow" :src="chevron"></b-img>
        </b-col>
      </b-row>
      <b-row>
        <b-col>
          <h3 class="lbl">enter the number of students in the institute</h3>
        </b-col>
      </b-row>
      <b-row>
        <b-col md="4">
          <b-form-input
            v-model="experience.numberOfStudents"
            class="custom-select"
            @keydown="numericValidation"
            placeholder="enter number of students"
          ></b-form-input>
        </b-col>
      </b-row>
    </div>
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
import { validateService } from '@/shared/services/validate-values'
import { chevronDown, whiteArrowImage } from '@/shared/components-data/images'
import {
  institutionRoles,
  classTypes,
  institutionBelopngs
} from '@/shared/components-data/experience-data'
import {
  classTypeRequiredError,
  instituteBelongRequiredError,
  currentRoleRequiredError,
  studentNumberRequiredError
} from '@/shared/components-data/messages'

export default {
  data() {
    return {
      chevron: chevronDown,
      whiteArrow: whiteArrowImage,
      experience: {
        classType: [],
        instituteNeme: null,
        roleInInstitute: null,
        belongToInstitute: null,
        numberOfStudents: null
      },
      classTypes: classTypes,
      institutionBelopngs: institutionBelopngs,
      institutionRoles: institutionRoles
    }
  },
  methods: {
    numericValidation($event) {
      if (!validateService.validateNumeric($event.keyCode)) {
        $event.preventDefault()
      } else if (
        this.experience &&
        this.experience.numberOfStudents &&
        this.experience.numberOfStudents.toString().length > 8
      ) {
        $event.preventDefault()
      }
    },
    setClassType(classType) {
      if (classType == 'both') {
        this.experience.classType = ['group', 'individual']
      } else {
        this.experience.classType = [classType]
      }
    },
    setInstituteBelonging(belong) {
      this.experience.belongToInstitute = belong
    },
    setInstituteRole(role) {
      this.experience.roleInInstitute = role
    },
    goToNext() {
      let message = ''
      if (this.experience.classType.length < 1) {
        message = classTypeRequiredError
      } else if (this.experience.belongToInstitute === null) {
        message = instituteBelongRequiredError
      } else if (
        this.experience.belongToInstitute &&
        !this.experience.roleInInstitute
      ) {
        message = currentRoleRequiredError
      } else if (
        this.experience.belongToInstitute &&
        !this.experience.numberOfStudents
      ) {
        message = studentNumberRequiredError
      }
      if (message) {
        this.$emit('onSetAlertMessage', message)
      } else {
        this.$emit('onSetExperience', this.experience)
      }
    }
  }
}
</script>

<style scoped>
.btn-icon {
  margin-left: 2rem;
}
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
