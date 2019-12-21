<template>
  <b-jumbotron>
    <b-modal
      ref="loadingModal"
      id="loader-modal"
      hide-header
      hide-footer
      no-close-on-esc
      no-close-on-backdrop
    >
      <Loader :isLoading="loaderStatus" />
    </b-modal>

    <b-row class="mt-4">
      <b-col class="justify-content-end d-flex" cols="10">
        <b-button class="btn-signup" @click="openSignupSelector"
          >SIGNUP</b-button
        >
        <b-button variant="none" @click="openLoginSelector" class="btn-login"
          >LOGIN</b-button
        >
      </b-col>
    </b-row>
    <b-row class="mtr-4">
      <b-col class="mtr-7" md="7">
        <p class="Font-s">Learn something new today.</p>
      </b-col>
      <b-col md="3">
        <b-img
          class="width-70"
          src="@/assets/image/mirage-searching.jpg"
          fluid-grow
          alt="img"
        ></b-img>
      </b-col>
      <b-col md="1"></b-col>
    </b-row>
    <b-row style="font-weight:900;padding: 0px 0px 0 55px;">
      <font-awesome-icon class="f-ico" :icon="['far', 'compass']" />
      <span
        class="loc-nam-txt"
        v-if="searchCriteria.currentLocation"
        v-text="searchCriteria.currentLocation.address"
      />
      <span class="change" @click="openMapModel">change</span>
    </b-row>

    <b-row style="padding: 0px 0px 0 40px;">
      <b-col md="10" class="b-Text-Button">
        <b-form-input
          class="subj-width"
          placeholder="choose your subject ( Eg: Science, Math, English, Guitar etc. )"
          v-model="searchCriteria.subject"
        ></b-form-input>
        <b-button
          class="btn-Find"
          pill
          variant="outline-secondary"
          @click="searchTeacher"
          >FIND</b-button
        >
      </b-col>
      <b-col md="2"></b-col>
    </b-row>
    <CurrentLocationPicker
      @onPickPostition="setCurrentLocation"
      :changeLocation="changeLocation"
    />
    <b-modal
      id="signupModal"
      ref="signupModal"
      hide-header
      hide-footer
      no-close-on-esc
      no-close-on-backdrop
    >
      <SignupSelector @onCloseModal="closeSignupSelector" />
    </b-modal>
    <b-modal
      id="loginModal"
      ref="loginModal"
      hide-header
      hide-footer
      no-close-on-esc
      no-close-on-backdrop
    >
      <Login @onCloseModal="closeLoginSelector" />
    </b-modal>
  </b-jumbotron>
</template>
<script>
import CurrentLocationPicker from '@/components/common/current-location-picker'
import { mapGetters, mapActions } from 'vuex'
import SignupSelector from '@/components/common/signup-selector'
import Login from '@/components/common/login'
import Loader from '@/components/common/loader'
export default {
  components: {
    CurrentLocationPicker,
    SignupSelector,
    Login,
    Loader
  },

  data() {
    return {
      searchCriteria: { subject: null, currentLocation: null },
      changeLocation: false
    }
  },
  mounted() {
    if (this.$route.query.openLoginModal) {
      this.$refs.loginModal.show()
    }
    this.initStore(true)
  },
  computed: {
    ...mapGetters({
      loaderStatus: 'GET_LOADER_STATE'
    })
  },
  watch: {
    loaderStatus(newVal, oldVal) {
      if (newVal) {
        this.$refs.loadingModal.show()
      } else {
        this.$refs.loadingModal.hide()
      }
    }
  },

  methods: {
    ...mapActions({
      initStore: 'INIT_STORE',
      displayMessage: 'DISPLAY_MESSAGE'
    }),
    setCurrentLocation(location) {
      this.searchCriteria.currentLocation = location
      this.changeLocation = false
    },
    searchTeacher() {
      if (!this.searchCriteria.subject) {
        this.displayMessage({
          message: 'Enter subject name to search',
          varient: 'warning'
        })
      } else {
        this.$router.push({
          name: 'common-explore-teacher',
          params: { searchCriteria: this.searchCriteria }
        })
      }
    },
    openMapModel() {
      this.changeLocation = true
    },
    openSignupSelector() {
      this.$refs.signupModal.show()
    },
    closeSignupSelector() {
      this.$refs.signupModal.hide()
    },
    openLoginSelector() {
      this.$refs.loginModal.show()
    },
    closeLoginSelector() {
      this.$refs.loginModal.hide()
    }
  }
}
</script>

<style>
#signupModal .modal-dialog {
  max-width: 99vw;
  margin: 0;
  height: 34vw;
}

#signupModal {
  padding-left: 0px !important;
  height: 34vw;
  overflow: hidden;
}

#loginModal .modal-dialog {
  max-width: 99vw;
  margin: 0;
  height: 34vw;
}
#loginModal___BV_modal_content_ {
  height: initial !important;
  height: 34vw;
}

#signupModal___BV_modal_content_ {
  height: initial !important;
  height: 34vw;
}

#loginModal {
  padding-left: 0px !important;
  height: 34vw;
  overflow: hidden;
}

.mtr-7 {
  margin-top: 7rem !important;
}
.mtr-4 {
  margin-top: 4rem;
  padding: 0px 0px 0 40px;
}
.Font-s {
  font-family: Montserrat;
  font-weight: 600;
  font-size: 4.736vw;
  text-align: left;
  color: #000;
}
.btn-Find {
  width: 16.8457vw;
  height: 5.61vw;
  border-radius: 51.5px;
  background: #fff;
  border: 6px solid rgba(112, 112, 112, 0.33);
  font-family: Montserrat;
  font-weight: 600;
  font-size: 1.7vw;
  text-align: center;
  color: #000;
  line-height: 2.2;
}
.b-Text-Button {
  display: flex;
  margin-top: 40px;
}
.width-70 {
  width: 100% !important;
  padding-top: 75px;
}

.btn-signup {
  line-height: 0.5;
  font-family: Montserrat;
  font-size: 1.43vw;
  text-align: center;
  color: #fff;
  width: 13.47vw;
  height: 2.927vw;
  border-radius: 8px;
  background: linear-gradient(to right, #001463, #011872, #0937eb);
}
.btn-login {
  background-color: white;
  color: black;
  line-height: 0.5;
  font-family: Montserrat;
  font-size: 1.36vw;
  text-align: center;
  width: 13.47vw;
  height: 2.927vw;
  border-radius: 8px;
  margin-left: 4px;
}
.subj-width {
  width: 50.97vw;
  height: 5.608vw;
  border-radius: 15px;
  background: #fff;
  border: 5px solid rgba(112, 112, 112, 0.26);
  box-shadow: 0px 8px 15px rgba(0, 0, 0, 0.16);
  margin-right: 20px;
  font-family: Montserrat;
  font-weight: 600;
  font-size: 1.025390625vw;
  text-align: left;
  color: #000;
  opacity: 0.69;
}
.loc-nam-txt {
  margin-left: 1rem;
  margin-right: 1rem;
}
</style>
