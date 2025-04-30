import moment from 'moment'

export default {

  data () {
    return {
      recurringDates: []
    }
  },

  methods: {
    getRecurringAppointmentsData () {
      let recurringAppointmentsData = []

      this.recurringData.dates.forEach((recurringData) => {
        let service = this.getProviderService(recurringData.providerId, this.appointment.serviceId)

        recurringAppointmentsData.push({
          providerId: recurringData.providerId,
          locationId: recurringData.locationId,
          bookingStart: moment(recurringData.date).format('YYYY-MM-DD') + ' ' + recurringData.time,
          price: this.getServiceDurationPrice(service, this.appointment.serviceDuration),
          depositData: service.depositPayment !== 'disabled' ? {
            deposit: service.deposit,
            depositPayment: service.depositPayment,
            depositPerPerson: service.depositPerPerson
          } : null
        })
      })

      recurringAppointmentsData.shift()

      return recurringAppointmentsData
    },

    toggleRecurringActive () {
      if (this.appointment.serviceId && this.getServiceById(this.appointment.serviceId).recurringCycle !== 'disabled') {
        this.isRecurringAvailable = true
      } else {
        this.isRecurringAvailable = false
        this.activeRecurring = false
      }
    },

    getDefaultRecurringSettings (startDate, recurringCycle, calendarTimeSlots) {
      let calendarDates = this.getAvailableRecurringDates(calendarTimeSlots)

      let cycle = recurringCycle === 'all' ? 'daily' : recurringCycle
      let cycleLabel = ''

      let selectedDate = moment(startDate, 'YYYY-MM-DD')
      let selectedDayNumber = selectedDate.format('D')

      switch (cycle) {
        case ('daily'):
          cycleLabel = 'day'
          break

        case ('weekly'):
          cycleLabel = 'week'
          break

        case ('monthly'):
          cycleLabel = 'month'
          break
      }

      return {
        selectedMonthlyWeekDayString: selectedDate.format('dddd'),
        monthDateRule: Math.ceil(selectedDayNumber / 7),
        cycle: cycle,
        maxDate: moment(startDate, 'YYYY-MM-DD HH:mm').add(1, 'days').toDate(),
        maxCount: 1,
        selectedWeekDayIndex: selectedDate.isoWeekday() - 1,
        calendarDates: calendarDates,
        cycleInterval: 1,
        weekDaysSelected: [selectedDate.isoWeekday() - 1],
        repeatIntervalLabels: this.getRepeatIntervalLabels(
          this.$root.labels[cycleLabel],
          this.$root.labels[cycleLabel + 's'],
          moment(calendarDates[calendarDates.length - 1]).diff(selectedDate, 'days')
        )
      }
    },

    getAvailableRecurringDates (calendarTimeSlots) {
      let availableRecurringDates = []

      this.useSortedDateStrings(Object.keys(calendarTimeSlots)).forEach(function (dateString) {
        availableRecurringDates.push(moment(dateString + ' 00:00:00'))
      })

      return availableRecurringDates
    },

    getRepeatIntervalLabels (singleText, pluralText, size) {
      let repeatIntervalLabels = []

      for (let i = 0; i < size; i++) {
        repeatIntervalLabels.push({
          label: i === 0 ? singleText : (i + 1) + ' ' + pluralText,
          value: i + 1
        })
      }

      return repeatIntervalLabels
    }
  }

}
