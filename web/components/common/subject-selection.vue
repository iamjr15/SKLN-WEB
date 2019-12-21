<template>
  <div>
    <div v-if="subjects && subjects.length > 0" class="img">
      <div v-for="(sub, index) in subjects" :item="sub" :key="index">
        <span>
          <img
            :src="getSubjectImage(sub.image)"
            alt="avatar"
            class="class-img"
            @click="selectSubjects(sub)"
          />
          <b-form-checkbox
            v-if="!isForShowOnly"
            :checked="selectedSubjects.findIndex((a) => a.id == sub.id) > -1"
            @change="selectSubjects(sub)"
            class="class-check"
          ></b-form-checkbox>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import { getSubjectImage } from '@/shared/components-data/images'

export default {
  props: {
    subjects: {
      type: Array
    },
    isForShowOnly: {
      type: Boolean,
      value: false
    }
  },
  data() {
    return {
      getSubjectImage: getSubjectImage,
      allSubjects: [],
      selectedSubjects: []
    }
  },
  methods: {
    selectSubjects(subject) {
      if (this.selectedSubjects.length > 0) {
        let finded = this.selectedSubjects.findIndex(
          (res) => res.id == subject.id
        )
        if (finded > -1) {
          this.selectedSubjects.splice(finded, 1)
        } else {
          this.selectedSubjects.push(subject)
        }
      } else {
        this.selectedSubjects.push(subject)
      }
      this.$emit(
        'onSelectSubjects',
        this.lodash.cloneDeep(this.selectedSubjects)
      )
    }
  }
}
</script>

<style scoped>
#checkbox-1 {
  position: absolute;
}
.img {
  display: flex;
}
.sub-img {
  height: 1.858vw;
  width: 1.8vw;
  margin-top: -2.323vw;
  margin-left: -0.6vw;
}
</style>
