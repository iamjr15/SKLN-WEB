<template>
  <b-jumbotron>
    <b-row class="m-30">
      <b-col>
        <h1>my requests.</h1>
        <div class="request-box"></div>
      </b-col>
    </b-row>

    <b-row>
      <b-col>
        <b-tabs content-class="mt-3" style="width: 60%;">
          <b-tab title="LATEST" active>
            <b-table
              striped
              hover
              variant="success"
              :items="requestsData.lattestRequests"
              :fields="requestFields"
            >
              <template v-slot:cell(img)="row">
                <b-img
                  class="login-user-img"
                  :src="row.item.img"
                  fluid-grow
                ></b-img>
              </template>
              <template v-slot:cell(details)="row">
                <b-img
                  class="right-arrow"
                  @click="showRequestDetails(row.item)"
                  :src="rightArrow"
                ></b-img>
              </template>
            </b-table>
          </b-tab>
          <b-tab title="ALL">
            <b-table
              striped
              hover
              variant="success"
              :items="requestsData.allRequests"
              :fields="requestFields"
            >
              <template v-slot:cell(img)="row">
                <b-img
                  class="login-user-img"
                  :src="row.item.img"
                  fluid-grow
                ></b-img>
              </template>
              <template v-slot:cell(details)="row">
                <b-img
                  class="right-arrow"
                  @click="showRequestDetails(row.item)"
                  :src="rightArrow"
                ></b-img>
              </template>
            </b-table>
          </b-tab>
        </b-tabs>
      </b-col>
    </b-row>
  </b-jumbotron>
</template>

<script>
import { rightArrow } from '@/shared/components-data/images'
import { mapGetters, mapActions } from 'vuex'

export default {
  components: {},
  props: {
    student: Object
  },
  data() {
    return {
      rightArrow: rightArrow,
      requestToPassData: {},
      requestFields: ['img', 'teacherName', 'classToJoin', 'subject', 'details']
    }
  },
  computed: {
    ...mapGetters({
      requestsData: ['studentModule/GET_STUDENT_REQUESTS_DATA']
    })
  },
  watch: {
    student: {
      handler: function() {
        this.getRequestsData()
      },
      deep: true
    }
  },
  methods: {
    ...mapActions({
      getStudentRequest: 'studentModule/GET_STUDENT_REQUEST'
    }),
    showRequestDetails(selectedRequest) {
      this.requestToPassData = this.requestsData.allDbRequests.find(
        (res) => res.id == selectedRequest.id
      )
      this.$router.push({
        name: 'student-request-details',
        params: { data: this.requestToPassData }
      })
    },
    closeModel() {
      this.$refs.teacherProfileModal.hide()
    },

    async getRequestsData() {
      if (
        this.requestsData.latestRequestsData > 0 ||
        this.requestsData.allRequestsData > 0
      ) {
      } else if (this.student.id) {
        await this.getStudentRequest(this.student)
      }
    }
  }
}
</script>

<style scoped>
.card-group {
  display: contents;
}

.main-card {
  height: 512px;
  background: linear-gradient(#ad80cb 0%, #7451e9 100%);
}
.flex-content {
  display: flex;
  justify-content: space-between;
}
.dropdown-toggle {
  border-radius: 20px;
  background: black;
}
.nav-tabs {
  border: 0 !important;
}
.nav-tabs .nav-link.active,
.nav-tabs .nav-item.show .nav-link {
  border: 0;
  color: black;
}
thead {
  display: none;
}
.right-arrow {
  height: 2.3229vw;
  margin-left: 15px;
  cursor: pointer;
}
.login-user-img {
  width: 3vw !important;
  text-align: center;
  height: 3vw;
  border: 1px solid black;
  margin-right: 20px;
  border-radius: 50%;
}
.m-30 {
  margin-top: 30px;
  margin-bottom: 30px;
}
.request-box {
  width: 17rem;
  border: 2px solid black;
}
</style>
