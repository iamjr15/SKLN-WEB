import firebase from 'firebase'
import * as geofirex from 'geofirex'
import _ from 'lodash'
import { tutorsRef } from '@/store/firestore'
const geo = geofirex.init(firebase)
export const teacherService = {
  getLocation(criteria) {
    return {
      latitude: criteria.currentLocation.lngLat
        ? criteria.currentLocation.lngLat.lat
        : 0,
      longitude: criteria.currentLocation.lngLat
        ? criteria.currentLocation.lngLat.lng
        : 0,
      withinRange: parseInt(criteria.locationRange)
    }
  },
  filterTeachersSelectedSubjectById(
    teachersHavingSelectedSubject,
    teacherSubjects
  ) {
    teacherSubjects.forEach((res) => {
      const teacherSubject = res.data()
      if (teacherSubject) {
        if (teachersHavingSelectedSubject.length > 0) {
          const findedSubj = teachersHavingSelectedSubject.findIndex(
            (a) => a === teacherSubject.teacherId
          )
          if (findedSubj < 0) {
            teachersHavingSelectedSubject.push(teacherSubject.teacherId)
          }
        } else {
          teachersHavingSelectedSubject.push(teacherSubject.teacherId)
        }
      }
    })

    return teachersHavingSelectedSubject
  },
  async getTeachersByLocation(criteria) {
    const location = this.getLocation(criteria)
    const center = geo.point(location.latitude, location.longitude)
    const radius = location.withinRange
    const field = 'location'
    const query = await geo.query(tutorsRef).within(center, radius, field)
    const teachersHavingSelectedLocation = []
    const teacherFinded = await geofirex.get(query)

    if (teacherFinded) {
      teacherFinded.forEach((ter) => {
        if (teachersHavingSelectedLocation.length > 0) {
          const findedTec = teachersHavingSelectedLocation.findIndex(
            (a) => a.id === ter.id
          )
          if (findedTec < 0) {
            teachersHavingSelectedLocation.push(ter)
          }
        } else {
          teachersHavingSelectedLocation.push(ter)
        }
      })
    }
    return teachersHavingSelectedLocation
  },
  checkCriteriasEquality(criteria, newCriteria) {
    if (criteria && newCriteria) {
      const classTypeEquality = _.isEqual(
        criteria.selectedClassTypes,
        newCriteria.selectedClassTypes
      )
      const locationRangeEquality =
        criteria.locationRange === newCriteria.locationRange
      const gradesEquality =
        criteria.selectedGrade === newCriteria.selectedGrade
      const subjectsEquality = criteria.subject === newCriteria.subject
      const locationEquality =
        criteria.currentLocation.lngLat &&
        newCriteria.currentLocation.lngLat &&
        criteria.currentLocation.lngLat.lng ===
          newCriteria.currentLocation.lngLat.lng &&
        criteria.currentLocation.lngLat.lat ===
          newCriteria.currentLocation.lngLat.lat
      if (
        classTypeEquality &&
        locationRangeEquality &&
        gradesEquality &&
        subjectsEquality &&
        locationEquality
      ) {
        return true
      } else {
        return false
      }
    } else {
      return false
    }
  }
}
