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
          :items="grades"
          :fields="gradeFields"
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
            <b-button size="sm" @click="showGradeDetails(row.item)" class="mr-2"
              >Details</b-button
            >
          </template>
        </b-table>
        <b-modal
          ref="detailModal"
          hide-header
          hide-footer
          no-close-on-backdrop
          no-close-on-esc
          style="height:18.58vw"
        >
          <b-card>
            <b-card-text>
              <div
                v-text="
                  selectedGrade.className +
                    ' ' +
                    selectedGrade.subject +
                    ' ' +
                    selectedGrade.batch +
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
                  v-model="selectedGrade.isActive"
                />
                <font-awesome-icon @click="closeDialog" icon="times" />
              </div>
              <div>
                <font-awesome-icon :icon="['far', 'clock']" />
                <span
                  style="color:blue"
                  v-text="selectedGrade.startTime + ' ' + selectedGrade.endTime"
                />
              </div>
              <div>
                <font-awesome-icon :icon="['far', 'calendar-alt']" />
                <span
                  v-for="(day, idx) in selectedGrade.scheduledDays"
                  :key="idx"
                  style="color:blue"
                >
                  {{ day }}
                  <span v-if="selectedGrade.scheduledDays.length - 1 > idx"
                    >,</span
                  >
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
import { batchesRef } from '@/store/firestore'
import moment from 'moment'

export default {
  components: {
    ToggleButton
  },
  data() {
    return {
      selectedStudent: {},
      grades: [],
      selectedGrade: {},
      gradeFields: [
        'className',
        'subject',
        'batch',
        'startTime',
        'endTime',
        'scheduledDays',
        'isActive',
        'details'
      ]
    }
  },
  mounted() {
    if (this.$route.params.data && this.$route.params.data.id) {
      this.selectedStudent = this.$route.params.data
      this.getGradesData()
    }
  },
  methods: {
    showGradeDetails(selectedGrade) {
      this.selectedGrade = selectedGrade
      this.$refs.detailModal.show()
    },
    closeDialog() {
      this.$refs.detailModal.hide()
    },
    async getGradesData() {
      let self = this
      let batches = await batchesRef
        .where('studentsEnrolled', 'array-contains', {
          id: self.selectedStudent.id,
          name:
            self.selectedStudent.personInfo.firstName +
            ' ' +
            self.selectedStudent.personInfo.lastName
        })
        .get()
      batches.forEach((res) => {
        let batch = res.data()
        if (batch) {
          let batchToShow = {
            id: batch.id,
            className: batch.grade.name,
            subject: batch.subject.name,
            batch: moment(batch.timing.startTime.toDate())
              .format('HH:mm A')
              .toString()
              .includes('PM')
              ? 'Evening'
              : 'Morning',
            isActive: true,
            startTime: moment(batch.timing.startTime.toDate()).format(
              'HH:mm A'
            ),
            endTime: moment(batch.timing.endTime.toDate()).format('HH:mm A'),
            scheduledDays: ['TUE', 'THU', 'FRI']
          }
          self.grades.push(batchToShow)
        }
      })
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
