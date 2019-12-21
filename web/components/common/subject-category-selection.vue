<template>
  <div>
    <div :v-if="subjectCategories && subjectCategories.length > 0" class="img">
      <div
        v-for="(subjectCategory, index) in subjectCategories"
        :item="subjectCategory"
        :key="index"
        style="margin-right: 3vw;"
        @click="setListItemStyle(index)"
      >
        <img
          class="subject-category-img"
          :style="listItemStyle(index)"
          @click="selectCategory(subjectCategory.name)"
          :src="getSubjectCategoryImages(subjectCategory.avatar)"
          alt="avatar"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.img {
  display: flex;
}
</style>

<script>
import { getSubjectCategoryImages } from '@/shared/components-data/images'

export default {
  props: {
    allCategories: {
      type: Array
    }
  },
  data() {
    return {
      getSubjectCategoryImages: getSubjectCategoryImages,
      selectedItem: 0,
      subjectCategories: []
    }
  },
  watch: {
    allCategories: function() {
      this.subjectCategories = [...this.allCategories]
    }
  },
  methods: {
    selectCategory(name) {
      this.$emit('onSelectCategory', name)
    },
    listItemStyle(index) {
      let style = {
        border: '6px solid rgb(24, 210, 159)',
        width: '23.97vw',
        height: '6.8758vw',
        'border-radius': '9px'
      }
      if (index == this.selectedItem) {
        return style
      }
    },
    setListItemStyle(index) {
      this.selectedItem = index
    }
  }
}
</script>

<style scoped>
.subject-category-img {
  width: 23.97vw;
  height: 6.8758vw;
  border-radius: 9px;
}
</style>
