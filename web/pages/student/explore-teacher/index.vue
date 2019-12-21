<template>
  <SearchTeacherContainer :isHomePage="false" />
</template>
<script>
import SearchTeacherContainer from '@/components/common/search-teacher-container'

export default {
  layout: 'student',
  components: {
    SearchTeacherContainer
  }
}
</script>

<style scoped></style>
