<template>
  <b-jumbotron>
    <b-row>
      <b-col cols="8" class="d-flex-align">
        <b-form-input
          class="box-shadE2"
          placeholder="choose your subjects"
          v-model="subject"
        ></b-form-input>
        <font-awesome-icon
          class="fa-4x"
          style="cursor: pointer;"
          :icon="['fa', 'search']"
          @click="findTeacher"
        />
      </b-col>
      <b-col cols="2"></b-col>
    </b-row>
    <b-row>&nbsp;&nbsp;</b-row>
    <b-row>
      <b-col class="search-btns">
        <b-button
          id="popover-btn-one"
          class="garade-class-btn"
          pill
          variant="outline-secondary"
        >
          <span
            v-for="(classType, index) in searchCriteria.selectedClassTypes"
            :key="index"
            v-text="
              searchCriteria.selectedClassTypes.length - 1 > index
                ? classType + ', '
                : classType
            "
          >
          </span> </b-button
        >&nbsp;&nbsp;
        <b-button
          class="garade-class-btn"
          id="popover-button-two"
          pill
          variant="outline-secondary"
          v-text="'Within ' + searchCriteria.locationRange + ' km'"
        ></b-button
        >&nbsp;&nbsp;
        <b-button
          class="garade-class-btn"
          id="popover-button-three"
          pill
          variant="outline-secondary"
          v-text="searchCriteria.selectedGrade + getSuffixByNumber"
        ></b-button>
      </b-col>
      <b-col>
        <h5 class="map-address">
          <font-awesome-icon class="f-ico" :icon="['far', 'compass']" />
          <span v-text="searchCriteria.currentLocation.address" />
          <span class="change" @click="openMapModel">change</span>
        </h5>
      </b-col>
    </b-row>
    <b-popover
      hide
      triggers="hover"
      target="popover-btn-one"
      placement="bottom"
    >
      <b-button
        pill
        variant="outline-secondary"
        @click="updateSelectedClassTypes(['individual'])"
        >Individual Class</b-button
      >&nbsp;&nbsp;
      <b-button
        pill
        variant="outline-secondary"
        @click="updateSelectedClassTypes(['group'])"
        >Group Class</b-button
      >&nbsp;
      <b-button
        pill
        variant="outline-secondary"
        @click="updateSelectedClassTypes(['individual', 'group'])"
        >Both</b-button
      >
    </b-popover>
    <b-popover
      hide
      triggers="hover"
      target="popover-button-two"
      class="popovr"
      placement="bottom"
    >
      <label for="range" v-text="searchCriteria.locationRange + ' km'" />
      <span style="display:flex">
        1km
        <b-form-input
          id="range"
          v-model="searchCriteria.locationRange"
          @change="findTeacher"
          type="range"
          min="1"
          max="50"
          step="1"
        ></b-form-input
        >50km
      </span>
    </b-popover>
    <b-popover
      triggers="hover"
      hide
      target="popover-button-three"
      class="popovr"
      placement="bottom"
    >
      <label
        for="gradeRange"
        v-text="searchCriteria.selectedGrade + getSuffixByNumber"
      />
      <b-form-input
        id="gradeRange"
        v-model="searchCriteria.selectedGrade"
        type="range"
        @change="findTeacher"
        min="1"
        max="12"
        step="1"
      ></b-form-input>
    </b-popover>
    <CurrentLocationPicker
      @onPickPostition="setCurrentLocation"
      :changeLocation="changeLocation"
    />
  </b-jumbotron>
</template>

<script>
import CurrentLocationPicker from '@/components/common/current-location-picker'
import { mapGetters, mapActions } from 'vuex'
export default {
  components: {
    CurrentLocationPicker
  },
  props: {
    selectedSubject: {
      type: String
    }
  },
  data() {
    return {
      subject: this.selectedSubject,
      searchCriteria:
        this.criteriaToSearch && this.criteriaToSearch.selectedGrade
          ? this.criteriaToSearch
          : {
              selectedClassTypes: ['individual'],
              locationRange: 5,
              selectedGrade: this.gradeToSearch ? this.gradeToSearch : 8,
              subject: null,
              currentLocation: {}
            },
      changeLocation: false
    }
  },
  mounted() {
    this.findTeacher()
  },
  computed: {
    ...mapGetters({
      gradeToSearch: 'studentModule/GET_GRADE_TO_SEARCH',
      criteriaToSearch: 'studentModule/GET_SEARCH_TEACHERS_CRITERIA'
    }),
    getSuffixByNumber() {
      if (
        this.searchCriteria.selectedGrade.toString().endsWith('1') &&
        parseInt(this.searchCriteria.selectedGrade) !== 11
      ) {
        return 'st grade'
      } else if (
        this.searchCriteria.selectedGrade.toString().endsWith('2') &&
        parseInt(this.searchCriteria.selectedGrade) !== 12
      ) {
        return 'nd grade'
      } else if (
        this.searchCriteria.selectedGrade.toString().endsWith('3') &&
        parseInt(this.searchCriteria.selectedGrade) !== 13
      ) {
        return 'rd grade'
      } else {
        return 'th grade'
      }
    }
  },
  watch: {
    gradeToSearch(newVal, oldVal) {
      if (newVal) {
        this.searchCriteria.selectedGrade = newVal
        this.findTeacher()
      }
    },
    selectedSubject() {
      this.subject = this.selectedSubject
    }
  },
  methods: {
    openMapModel() {
      this.changeLocation = true
    },
    updateSelectedClassTypes(type) {
      this.searchCriteria.selectedClassTypes = type
      this.findTeacher()
    },
    setCurrentLocation(location) {
      this.searchCriteria.currentLocation = location
      this.changeLocation = false
      this.findTeacher()
    },
    findTeacher() {
      this.searchCriteria.subject = this.subject
      this.$emit('onFindTeacher', this.searchCriteria)
    }
  }
}
</script>

<style>
.garade-class-btn {
  width: 14vw;
  height: 62px;
  border-radius: 31px;
  background: #fff;
  border: 1px solid #707070;
  font-size: 1vw;
  font-family: Montserrat;
  text-align: center;
  color: #000;
}
.garade-class-btn:hover {
  background-color: blue;
  color: white;
}
#popover-button-open:hover {
  background-color: blue;
  color: white;
}

.active-test:focus {
  background-color: blue !important;
  color: white;
  -webkit-box-shadow: none;
  -moz-box-shadow: none;
  box-shadow: none;
}
.active-test:hover {
  background-color: white !important;
  color: #6c757d;
}
.active-test {
  -webkit-box-shadow: none;
  -moz-box-shadow: none;
  box-shadow: none;
}
.search-btns {
  width: 30px;
  display: flex;
}

.popover.b-popover {
  border: none;
}

.vue-map-jumbotron {
  height: 23.229vw;
}
.box-shadE2 {
  width: 60vw;
  height: auto;
  background: transparent;
  border-bottom: 6px solid #0469ff !important;
  border: 0;
  font-family: Montserrat;
  font-weight: 600;
  font-size: 4.635vw;
  text-align: left;
  color: #000;
}
.box-shadE2:focus {
  color: black;
  background-color: #fff;
  border-color: transparent;
  outline: 0;
  box-shadow: 0 0 0 0 white !important;
}
.svg-inline--fa.fa-w-16 {
  width: 2vw;
}
.d-flex-align {
  display: flex;
  align-items: center;
}
.popover-body {
  background: white;
  border: 1px solid lightgray;
  width: 20vw;
  text-align: center;
}
.map-address {
  line-height: 1.5;
  text-align: center;
}
</style>
