import durationMixin from './durationMixin'
import serviceMixin from './serviceMixin'

export default {
  mixins: [
    serviceMixin,
    durationMixin
  ],

  methods: {
    getInitEmployeeObject () {
      return {
        id: 0,
        type: 'provider',
        status: 'visible',
        firstName: '',
        lastName: '',
        email: '',
        externalId: '',
        locationId: '',
        phone: '',
        countryPhoneIso: '',
        googleCalendar: [],
        outlookCalendar: [],
        note: '',
        description: '',
        pictureFullPath: '',
        pictureThumbPath: '',
        stripeConnect: null,
        serviceList: [],
        weekDayList: this.getSettingsSchedule(),
        specialDayList: [],
        dayOffList: []
      }
    },

    getSettingsSchedule () {
      let weekSchedule = this.$root.settings.weekSchedule
      let weekDayList = []

      // set week schedule from settings
      weekSchedule.forEach(function (weekDay, index) {
        let timeOutList = []

        // set breaks
        weekDay.breaks.forEach(function (breakItem) {
          timeOutList.push({
            id: null,
            startTime: breakItem.time[0] + ':00',
            endTime: breakItem.time[1] + ':00'
          })
        })

        // set periods
        let periodList = []

        if (weekDay.time[0] !== null && weekDay.time[1] !== null) {
          // check if periods exist in settings
          if (!('periods' in weekDay)) {
            periodList.push({
              id: null,
              startTime: weekDay.time[0] + ':00',
              endTime: weekDay.time[1] + ':00',
              locationIds: [],
              serviceIds: [],
              locationId: null,
              periodLocationList: [],
              periodServiceList: [],
              savedPeriodServiceList: []
            })
          } else {
            weekDay.periods.forEach(function (periodItem) {
              periodList.push({
                id: null,
                startTime: periodItem.time[0] + ':00',
                endTime: periodItem.time[1] + ':00',
                locationIds: [],
                serviceIds: [],
                locationId: null,
                periodLocationList: [],
                periodServiceList: [],
                savedPeriodServiceList: []
              })
            })
          }
        }

        if (weekDay.time[0] && weekDay.time[1]) {
          weekDayList.push(
            {
              dayIndex: index + 1,
              id: null,
              startTime: weekDay.time[0] + ':00',
              endTime: weekDay.time[1] + ':00',
              periodList: periodList,
              timeOutList: timeOutList
            }
          )
        }
      })

      return weekDayList
    },

    getEmployeeActivityLabel (activity) {
      switch (activity) {
        case 'available':
          return this.$root.labels.available
        case 'away':
          return this.$root.labels.away
        case 'break':
          return this.$root.labels.break
        case 'busy':
          return this.$root.labels.busy
        case 'dayoff':
          return this.$root.labels.dayoff
      }
    },

    getParsedEditCategorizedServiceList (employee, categories) {
      let $this = this

      let categorizedServiceList = []

      categories.forEach(function (catItem) {
        let serviceList = []

        catItem.serviceList.filter(service =>
          (service.status === 'visible') ||
          (service.status === 'hidden' && employee.serviceList.map(employeeService => employeeService.id).indexOf(service.id) !== -1)
        ).forEach(function (catSerItem) {
          let employeeService = null

          if (employee) {
            employee.serviceList.forEach(function (serItem) {
              if (serItem.id === catSerItem.id) {
                employeeService = Object.assign({}, serItem)

                employeeService.customPricing = $this.getArrayCustomPricing(serItem.customPricing)

                employeeService.state = true
              }
            })
          }

          if (employeeService) {
            serviceList.push(employeeService)
          } else {
            let service = Object.assign({}, catSerItem)

            service.customPricing = $this.getArrayCustomPricing(service.customPricing)

            service.state = false
            serviceList.push(service)
          }
        })

        categorizedServiceList.push(
          {
            id: catItem.id,
            name: catItem.name,
            serviceList: serviceList
          }
        )
      })

      return categorizedServiceList
    },

    getParsedServiceList (list) {
      let serviceList = []

      list.forEach(function (catItem) {
        catItem.serviceList.forEach(function (catSerItem) {
          if (catSerItem.state) {
            serviceList.push(Object.assign({}, catSerItem))
          }
        })
      })

      return serviceList
    },

    getParsedEditWeekDayList (employee) {
      let tempList = []
      let $this = this

      let days = [
        this.$root.labels.weekday_monday,
        this.$root.labels.weekday_tuesday,
        this.$root.labels.weekday_wednesday,
        this.$root.labels.weekday_thursday,
        this.$root.labels.weekday_friday,
        this.$root.labels.weekday_saturday,
        this.$root.labels.weekday_sunday
      ]

      for (let i = 0; i < 7; i++) {
        tempList.push(
          {
            id: null,
            form: {
              type: null,
              isNew: null,
              index: null,
              show: false,
              data: {}
            },
            day: days[i],
            time: [],
            breaks: [],
            periods: []
          }
        )
      }

      if (employee) {
        employee.weekDayList.forEach(function (weekDayItem) {
          let dayIndex = weekDayItem.dayIndex - 1

          weekDayItem.timeOutList.forEach(function (timeOutItem) {
            tempList[dayIndex].breaks.push(
              {
                id: timeOutItem.id,
                time: [
                  timeOutItem.startTime.substring(0, timeOutItem.startTime.length - 3),
                  timeOutItem.endTime.substring(0, timeOutItem.endTime.length - 3)
                ]
              })
          })

          tempList[dayIndex].periods = $this.getParsedWeekDayPeriods(weekDayItem)

          tempList[dayIndex].time = [
            weekDayItem.startTime.substring(0, weekDayItem.startTime.length - 3),
            weekDayItem.endTime.substring(0, weekDayItem.endTime.length - 3)
          ]

          tempList[dayIndex].day = days[weekDayItem.dayIndex - 1]
          tempList[dayIndex].id = weekDayItem.id
        })
      }

      return tempList
    },

    getParsedWeekDayPeriods (weekDayItem) {
      let periods = []

      weekDayItem.periodList.forEach(function (periodItem) {
        periods.push(
          {
            time: [
              periodItem.startTime.substring(0, periodItem.startTime.length - 3),
              periodItem.endTime.substring(0, periodItem.endTime.length - 3)
            ],
            id: periodItem.id,
            locationIds: periodItem.periodLocationList.length ? periodItem.periodLocationList.map(periodLocation => periodLocation.locationId) : (periodItem.locationId ? [periodItem.locationId] : []),
            serviceIds: periodItem.periodServiceList.map(periodService => periodService.serviceId),
            locationId: periodItem.locationId,
            periodLocationList: periodItem.periodLocationList,
            periodServiceList: periodItem.periodServiceList,
            savedPeriodServiceList: JSON.parse(JSON.stringify(periodItem.periodServiceList))
          }
        )
      })

      if (!periods.length && weekDayItem.startTime && weekDayItem.endTime) {
        periods.push(
          {
            time: [
              weekDayItem.startTime.substring(0, weekDayItem.startTime.length - 3),
              weekDayItem.endTime.substring(0, weekDayItem.endTime.length - 3)
            ],
            id: null,
            locationIds: [],
            serviceIds: [],
            locationId: null,
            periodLocationList: [],
            periodServiceList: [],
            savedPeriodServiceList: []
          }
        )
      }

      return periods
    },

    getParsedWeekDayList (list) {
      let weekDayList = []
      let $this = this

      list.forEach(function (weekDayItem, weekDayItemIndex) {
        let timeOutList = []

        weekDayItem.breaks.forEach(function (timeOutItem) {
          if (timeOutItem.time && timeOutItem.time.length && timeOutItem.time[0] && timeOutItem.time[1]) {
            timeOutList.push(
              {
                id: timeOutItem.id,
                startTime: timeOutItem.time[0] + ':00',
                endTime: timeOutItem.time[1] + ':00'
              }
            )
          }
        })

        let periodList = []

        let minStartTime = 86400
        let maxEndTime = 0

        weekDayItem.periods.forEach(function (periodItem) {
          if (periodItem.time && periodItem.time.length && periodItem.time[0] && periodItem.time[1]) {
            let periodStartTime = $this.getStringTimeInSeconds(periodItem.time[0])
            let periodEndTime = $this.getStringTimeInSeconds(periodItem.time[1])

            minStartTime = periodStartTime < minStartTime ? periodStartTime : minStartTime
            maxEndTime = periodEndTime > maxEndTime ? periodEndTime : maxEndTime

            let periodLocationList = []

            periodItem.locationIds.forEach(function (locationId) {
              let oldPeriodLocation = periodItem.periodLocationList.find(periodLocation => periodLocation.locationId === locationId)
              periodLocationList.push({
                id: oldPeriodLocation ? oldPeriodLocation.id : null,
                locationId: locationId
              })
            })

            let periodServiceList = []

            periodItem.serviceIds.forEach(function (serviceId) {
              let oldPeriodService = periodItem.periodServiceList.find(periodService => periodService.serviceId === serviceId)
              periodServiceList.push({
                id: oldPeriodService ? oldPeriodService.id : null,
                serviceId: serviceId
              })
            })

            periodList.push(
              {
                id: periodItem.id,
                startTime: periodItem.time[0] + ':00',
                endTime: periodItem.time[1] + ':00',
                locationId: periodItem.locationId,
                periodLocationList: periodLocationList,
                periodServiceList: periodServiceList
              }
            )
          }
        })

        if (periodList.length) {
          weekDayList.push(
            {
              id: weekDayItem.id,
              dayIndex: weekDayItemIndex + 1,
              startTime: $this.secondsToTimeSelectStep(minStartTime) + ':00',
              endTime: $this.secondsToTimeSelectStep(maxEndTime) + ':00',
              timeOutList: timeOutList,
              periodList: periodList
            }
          )
        }
      })

      return weekDayList
    },

    sortEmployeesForRoundRobin (slotData) {
      slotData = slotData.sort((a, b) => parseInt(a[0]) - parseInt(b[0]))
      for (let employeeId of slotData) {
        if (parseInt(slotData[0][0]) > parseInt(this.lastBookedProviderId)) {
          break
        }
        slotData.push(slotData.shift())
      }
      return slotData
    }
  }
}
