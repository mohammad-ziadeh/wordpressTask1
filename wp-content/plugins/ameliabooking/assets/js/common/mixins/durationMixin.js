import moment from 'moment'

export default {

  data () {
    return {
      timeSelectOptions: {
        start: '00:00',
        end: '23:59',
        step: this.secondsToTimeSelectStep(this.getTimeSlotLength())
      }
    }
  },

  methods: {
    convertDateTimeRangeDifferenceToMomentDuration (startDate, endDate) {
      return moment.duration(moment(endDate).diff(moment(startDate)))
    },

    convertSecondsToMomentDuration (seconds) {
      return moment.duration(seconds, 'seconds')
    },

    momentDurationToNiceDurationWithUnit (duration) {
      let hours = Math.floor(duration.asMinutes() / 60)
      let minutes = duration.asMinutes() % 60

      return (hours ? (hours + this.$root.labels.h + ' ') : '') + ' ' + (minutes ? (minutes + this.$root.labels.min) : '')
    },

    secondsToNiceDuration (seconds) {
      let hours = Math.floor(seconds / 3600)
      let minutes = seconds / 60 % 60

      return (hours ? (hours + this.$root.labels.h + ' ') : '') + ' ' + (minutes ? (minutes + this.$root.labels.min) : '')
    },

    secondsToTimeSelectStep (seconds) {
      let hours = Math.floor(seconds / 3600)
      let minutes = Math.floor(seconds / 60) - hours * 60

      if (seconds < 0) {
        return (hours || '00') + ':' + ((minutes < 9 ? '0' + minutes : minutes) || '00')
      }
      return ((hours <= 9 ? '0' + hours : hours) || '00') + ':' + ((minutes <= 9 ? '0' + minutes : minutes) || '00')
    },

    getTimeSlotLength () {
      return this.$root.settings.general.timeSlotLength
    },

    getPossibleDurationsInSeconds: function (selected, maxDurationInSeconds = 86400) {
      let slotLength = this.getTimeSlotLength()

      let durations = []

      for (let i = slotLength; i <= maxDurationInSeconds; i += slotLength) {
        durations.push(i)
      }

      // If there is no selected value in possible durations, add it to array
      if (selected && durations.indexOf(selected) === -1) {
        durations.push(selected)
        durations.sort(function (a, b) { return a - b })
      }

      return durations
    },

    getTimeSelectOptionsWithLimits: function (minTime, maxTime) {
      return {
        start: '00:00',
        end: '24:00',
        step: this.secondsToTimeSelectStep(this.getTimeSlotLength()),
        minTime: minTime,
        maxTime: maxTime
      }
    },

    getStringTimeInSeconds (time) {
      return moment(time, 'HH:mm').diff(moment().startOf('day'), 'seconds')
    }
  }
}
