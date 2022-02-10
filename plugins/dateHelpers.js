import { addDays, format, formatDistanceToNow, formatRelative } from 'date-fns'
import Vue from 'vue'

Vue.prototype.$addDaysToDate = (date, days) => {
  return addDays(date, days)
}

Vue.prototype.$formatDate = (date, fnsFormat = 'yyyy-MM-dd') => {
  return format(date, fnsFormat)
}

Vue.prototype.$formatDateDistance = (date) => {
  return formatDistanceToNow(date)
}

Vue.prototype.$formatDateRelative = (date) => {
  return formatRelative(date, new Date())
}