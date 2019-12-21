<template>
  <b-jumbotron>
    <b-row>
      <b-col></b-col>
      <b-col class="input1">
        <h4 class="font-bold">MANAGE CLASSES +</h4>
      </b-col>
      <b-col></b-col>
    </b-row>
    <b-row>
      <b-col>
        <b-table
          striped
          hover
          variant="success"
          :items="classesData"
          :fields="classFields"
        >
          <template v-slot:cell(isActive)="row">
            <toggle-button
              :width="90"
              :height="40"
              :color="{ checked: '#25EF02', unchecked: 'black' }"
              :labels="{ checked: 'Activate', unchecked: 'Cancled' }"
              v-model="row.item.isActive"
            />
          </template>
          <template v-slot:cell(details)="row">
            <b-button size="sm" @click="showDetails(row.item)" class="mr-2"
              >Details</b-button
            >
          </template>
        </b-table>
        <b-modal
          ref="detailModal"
          hide-header
          hide-footer
          no-close-on-esc
          no-close-on-backdrop
          style="height:18.6vw"
        >
          <b-card>
            <b-card-text>
              <div
                v-text="
                  classData.className +
                    ' ' +
                    classData.subject +
                    ' ' +
                    classData.batch +
                    ' batch'
                "
              />
              <div class="flex-content">
                <toggle-button
                  :width="90"
                  :height="40"
                  :disabled="true"
                  :color="{ checked: '#25EF02', unchecked: 'black' }"
                  :labels="{ checked: 'Activate', unchecked: 'Cancled' }"
                  v-model="classData.isActive"
                />
                <font-awesome-icon icon="arrow-right" />
              </div>
              <div>
                <font-awesome-icon :icon="['far', 'clock']" />
                <span
                  style="color:blue"
                  v-text="classData.startTime + ' ' + classData.endTime"
                />
              </div>
              <div>
                <font-awesome-icon :icon="['far', 'calendar-alt']" />
                <span
                  v-for="(day, idx) in classData.scheduledDays"
                  :key="idx"
                  style="color:blue"
                >
                  {{ day }}
                  <span v-if="classData.scheduledDays.length - 1 > idx">,</span>
                </span>
              </div>
            </b-card-text>
          </b-card>
        </b-modal>
      </b-col>
    </b-row>
  </b-jumbotron>
</template>

<script>
import { ToggleButton } from 'vue-js-toggle-button'

export default {
  components: {
    ToggleButton
  },
  data() {
    return {
      classesData: [],
      classData: {},
      classFields: [
        'isActive',
        'className',
        'subject',
        'batch',
        'startTime',
        'endTime',
        'scheduledDays',
        'details'
      ]
    }
  },
  mounted() {
    this.classesData = [
      {
        id: '1',
        className: '12th',
        subject: 'Physics',
        batch: 'Morning',
        isActive: true,
        startTime: '7:30 AM',
        endTime: '9:00 AM',
        scheduledDays: ['TUE', 'THU', 'FRI']
      },
      {
        id: '2',
        className: '12th',
        subject: 'Physics',
        batch: 'Evening',
        isActive: false,
        startTime: '7:30 PM',
        endTime: '9:00 PM',
        scheduledDays: ['MON', 'WED', 'SAT']
      }
    ]
  },
  methods: {
    showDetails(selectedGrad) {
      this.classData = selectedGrad
      this.$refs.detailModal.show()
    }
  }
}
</script>

<style scoped>
.card-group {
  display: contents;
}
.card {
  height: 16.26vw;
  border: 1px black solid;
  margin-bottom: 0.46458vw;
}
.flex-content {
  display: flex;
  justify-content: space-between;
}
</style>
