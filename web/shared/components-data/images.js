export const whiteArrowImage = require(`@/assets/image/arrow_white.png`)
export const crossImage = require(`@/assets/image/cross.png`)
export const chevronDown = require(`@/assets/image/chevron-small-down.png`)
export const rightArrow = require(`@/assets/image/right-arrow.svg`)
export const loginImage = require(`@/assets/image/login.png`)
export const starFull = require(`@/assets/image/star-full.png`)
export const mapMarker = require(`@/assets/image/marker.png`)

export const getSubjectCategoryImages = (imageName) => {
  return require(`@/assets/image/academicsHobby/${imageName}`)
}

export const getGradeImage = (imageName) => {
  return require(`@/assets/image/grades/${imageName}.png`)
}

export const getSubjectImage = (imageName) => {
  return require(`@/assets/image/subjects-images/${imageName}`)
}
