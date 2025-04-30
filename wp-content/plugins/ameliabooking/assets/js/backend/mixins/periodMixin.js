export default {

  data: () => ({
    freePeriodsInSeconds: [0, 24 * 60 * 60]
  }),

  methods: {
    startTimeChanged (periodStart, periodEnd, periodsInSeconds, callback) {
      if (periodStart === null) {
        callback(null)

        let timeSelectItems = document.getElementsByClassName('time-select-item')

        for (let item of timeSelectItems) {
          let timeInSeconds = this.getStringTimeInSeconds(item.innerHTML)

          for (let i = 0; i < periodsInSeconds.length; i++) {
            if (timeInSeconds > periodsInSeconds[i][0] && timeInSeconds < periodsInSeconds[i][1]) {
              item.style.pointerEvents = 'none'
              item.style.color = '#DCDCDC'
              break
            }
          }
        }
      }
    },

    findFreePeriods (periodsInSeconds) {
      let resultPeriods = []

      let periodStart = 0

      for (let i = 0; i < periodsInSeconds.length; i++) {
        if (periodStart !== periodsInSeconds[i][0]) {
          resultPeriods.push([periodStart, periodsInSeconds[i][0]])
        }

        periodStart = periodsInSeconds[i][1]
      }

      if (periodStart !== 24 * 60 * 60) {
        resultPeriods.push([periodStart, 24 * 60 * 60])
      }

      this.freePeriodsInSeconds = resultPeriods
    },

    getBorderTime (minTime, maxTime) {
      return {
        start: '00:00',
        end: '24:00',
        step: this.secondsToTimeSelectStep(this.getTimeSlotLength()),
        minTime: minTime,
        maxTime: maxTime
      }
    },

    getPeriodBorderTime (periodStart, periodEnd, isStartTime) {
      let minTime = null
      let maxTime = null

      if (periodStart === null) {
        return this.getBorderTime(minTime, maxTime)
      }

      let selectedTimeInSeconds = this.getStringTimeInSeconds(periodStart)

      for (let i = 0; i < this.freePeriodsInSeconds.length; i++) {
        if (selectedTimeInSeconds >= this.freePeriodsInSeconds[i][0] && selectedTimeInSeconds < this.freePeriodsInSeconds[i][1]) {
          if (isStartTime) {
            minTime = this.secondsToTimeSelectStep(this.freePeriodsInSeconds[i][0] - this.getTimeSlotLength())
            maxTime = periodEnd !== null ? periodEnd : this.secondsToTimeSelectStep(this.freePeriodsInSeconds[i][1] + this.getTimeSlotLength())
          } else {
            minTime = periodStart
            maxTime = this.secondsToTimeSelectStep(this.freePeriodsInSeconds[i][1] + this.getTimeSlotLength())
          }

          break
        }
      }

      if (minTime === null && maxTime === null) {
        minTime = maxTime = periodStart
      }

      return this.getBorderTime(minTime, maxTime)
    }
  }

}
