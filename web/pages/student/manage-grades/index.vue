<template>
  <b-jumbotron>
    <ManageGrades />
  </b-jumbotron>
</template>

<script>
import ManageGrades from '@/components/student/manage-grades'
export default {
  layout: 'student',
  components: {
    ManageGrades
  },
  data() {
    return {}
  },
  methods: {}
}
</script>

<style></style>
