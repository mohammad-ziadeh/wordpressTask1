import cabinetMixin from '../../frontend/mixins/cabinetMixin'
import moment from 'moment'
import settingsMixin from '../../../js/common/mixins/settingsMixin'
import dateMixin from '../../../js/common/mixins/dateMixin'

export default {

  mixins: [
    settingsMixin, cabinetMixin, dateMixin
  ],

  data () {
    return {
      event: null,
      bookingCreatedCount: 0,
      attributes: [
        {
          highlight: {
            backgroundColor: '#ddd'
          },
          dates: []
        }
      ],
      selectedRecurringDate: null,
      recurringDates: null,
      updateStatusDisabled: false,
      recurringPeriods: [
        {
          label: this.$root.labels.recurring_type_weekly,
          value: 'weekly'
        },
        {
          label: this.$root.labels.recurring_type_monthly,
          value: 'monthly'
        },
        {
          label: this.$root.labels.recurring_type_yearly,
          value: 'yearly'
        }
      ],
      colors: [
        '#1788FB',
        '#4BBEC6',
        '#FBC22D',
        '#FA3C52',
        '#D696B8',
        '#689BCA',
        '#26CC2B',
        '#FD7E35',
        '#E38587',
        '#774DFB'
      ],
      options: {
        fetched: false,
        entities: {
          settings: {
            payments: {
              wc: null
            },
            general: {
              usedLanguages: []
            }
          },
          employees: [],
          locations: [],
          tags: []
        }
      },
      searchCounter: 0,
      loadingEvents: false,
      searchEventsTimer: null,
      searchedEvents: [],
      searchEventsQuery: ''
    }
  },

  methods: {
    showDialogEditEvent (id) {
      this.dialogEvent = true
      this.event = null
      this.getEvent(id)
    },

    closeDialogEvent () {
      this.dialogEvent = false
    },

    getInitEventObject () {
      return {
        id: 0,
        parentId: null,
        name: '',
        periods: [
          {
            id: null,
            eventId: null,
            range: null,
            startTime: null,
            endTime: null,
            bookings: []
          }
        ],
        bookingStartsNow: true,
        bookingStartsDate: null,
        bookingStartsTime: null,
        bookingEndsAfter: true,
        bookingEndsDate: null,
        bookingEndsTime: null,
        bookingOpensRec: 'same',
        bookingClosesRec: 'same',
        ticketRangeRec: 'calculate',
        isRecurring: false,
        recurring: {
          cycle: null,
          order: null,
          until: null,
          cycleInterval: null
        },
        bringingAnyone: true,
        bookMultipleTimes: true,
        maxCapacity: null,
        maxCustomCapacity: null,
        maxExtraPeople: null,
        price: 0,
        locationId: null,
        customLocation: null,
        providers: this.getInitEventProviders(),
        tags: [],
        description: null,
        gallery: [],
        colorType: 2,
        selectedColor: '#1788FB',
        customColor: '#1788FB',
        show: true,
        places: 0,
        addToCalendarData: null,
        showAddToCalendar: false,
        showEventDetails: false,
        showEventBooking: false,
        translations: null,
        canceling: false,
        deleting: false,
        bookable: true,
        deposit: 0,
        depositPayment: 'disabled',
        depositPerPerson: 1,
        customTickets: [],
        settings: this.getInitEntitySettings('event'),
        closeAfterMin: null,
        closeAfterMinBookings: false,
        aggregatedPrice: true
      }
    },

    showDialogNewEvent () {
      this.event = this.getInitEventObject()

      this.dialogEvent = true
    },

    getEvent (id) {
      let config = null

      let timeZone = ''

      if (this.$store !== undefined && this.$store.state.cabinet !== undefined && this.$store.state.cabinet.cabinetType === 'provider') {
        timeZone = this.$store.state.cabinet.timeZone === '' ? 'UTC' : this.$store.state.cabinet.timeZone

        config = Object.assign(this.getAuthorizationHeaderObject(), {params: {source: 'cabinet-' + this.$store.state.cabinet.cabinetType, timeZone: timeZone}})
      }

      if (this.$store === undefined && this.$root.settings.role === 'provider' && this.options.entities.employees.length === 1 &&
          this.options.entities.employees[0].timeZone) {
        config = Object.assign({params: {timeZone: this.options.entities.employees[0].timeZone}})
      }

      this.$http.get(`${this.$root.getAjaxUrl}/events/` + id, config)
        .then(response => {
          let event = Object.assign(this.getInitEventObject(), response.data.data.event)

          let eventPeriods = []

          let $this = this

          response.data.data.event.periods.forEach(function (period) {
            if (timeZone === 'UTC') {
              period.periodStart = $this.getConvertedUtcToLocalDateTime(period.periodStart)
              period.periodEnd = $this.getConvertedUtcToLocalDateTime(period.periodEnd)
            }

            let startDate = moment(period.periodStart, 'YYYY-MM-DD HH:mm:ss')
            let endDate = moment(period.periodEnd, 'YYYY-MM-DD HH:mm:ss')

            let startTime = period.periodStart.split(' ')[1].substring(0, 5)
            let endTime = period.periodEnd.split(' ')[1].substring(0, 5)

            if (endTime === '00:00') {
              endDate.subtract(1, 'days')
              endTime = '24:00'
            }

            eventPeriods.push(
              {
                id: period.id ? period.id : null,
                eventId: period.eventId ? period.eventId : null,
                range: {
                  start: startDate.toDate(),
                  end: endDate.toDate()
                },
                startTime: startTime,
                endTime: endTime,
                bookings: period.bookings,
                zoomMeeting: period.zoomMeeting,
                lessonSpace: period.lessonSpace,
                googleCalendarEventId: period.googleCalendarEventId,
                googleMeetUrl: period.googleMeetUrl,
                outlookCalendarEventId: period.outlookCalendarEventId,
                microsoftTeamsUrl: period.microsoftTeamsUrl,
                appleCalendarEventId: period.appleCalendarEventId
              }
            )
          })

          event.periods = eventPeriods

          let eventTags = []

          event.tags.forEach(function (eventTag) {
            eventTags.push(eventTag.name)
          })

          event.tags = eventTags

          if (event.recurring === null) {
            event.recurring = {
              cycle: null,
              until: null,
              order: null
            }
          } else {
            event.isRecurring = true

            event.recurring.cycleInterval = response.data.data.event.recurring.cycleInterval === null ? 1 : response.data.data.event.recurring.cycleInterval

            event.recurring.until = response.data.data.event.recurring.until ? moment(response.data.data.event.recurring.until).toDate() : null
          }

          event.bookingStartsNow = response.data.data.event.bookingOpens === null
          event.bookingStartsDate = response.data.data.event.bookingOpens ? moment(response.data.data.event.bookingOpens).toDate() : null
          event.bookingStartsTime = response.data.data.event.bookingOpens ? response.data.data.event.bookingOpens.split(' ')[1].substring(0, 5) : null

          event.bookingEndsAfter = response.data.data.event.bookingCloses === null
          event.bookingEndsDate = response.data.data.event.bookingCloses ? moment(response.data.data.event.bookingCloses).toDate() : null
          event.bookingEndsTime = response.data.data.event.bookingCloses ? response.data.data.event.bookingCloses.split(' ')[1].substring(0, 5) : null

          event.zoomUserId = response.data.data.event.zoomUserId
          event.organizerId = response.data.data.event.organizerId

          event.closeAfterMin = response.data.data.event.closeAfterMin
          event.closeAfterMinBookings = response.data.data.event.closeAfterMinBookings
          event.aggregatedPrice = response.data.data.event.aggregatedPrice

          let eventBookings = event.bookings

          eventBookings.forEach(function (booking) {
            if (booking.info) {
              let bookingInfo = JSON.parse(booking.info)

              booking.customer.firstName = bookingInfo.firstName
              booking.customer.lastName = bookingInfo.lastName
              booking.customer.phone = bookingInfo.phone
            } else {
              let customer = $this.getCustomerById(booking.customerId)

              booking.customer.firstName = customer ? customer.firstName : $this.$root.labels.customer + ' ' + booking.customerId
              booking.customer.lastName = customer ? customer.lastName : ''
              booking.customer.phone = customer ? customer.phone : ''
            }

            booking.show = true
            booking.removing = false
            booking.checked = false

            if (booking.customFields === '[]' || booking.customFields === null) {
              booking.customFields = '{}'
            }

            booking.payments = booking.payments.sort(function (a, b) { return new Date(a.dateTime) - new Date(b.dateTime) })

            booking.customFields = JSON.parse(booking.customFields)
          })

          let isCustomColor = false

          this.colors.forEach(function (color) {
            if (color === event.color) {
              event.colorType = 1
              event.selectedColor = color
              event.customColor = color
              isCustomColor = true
            }
          })

          if (!isCustomColor) {
            event.colorType = 2
            event.selectedColor = null
            event.customColor = event.color
          }

          event.gallery = event.gallery.sort((a, b) => (a.position > b.position) ? 1 : -1)

          this.eventBookings = eventBookings

          this.setEntitySettings(event, 'event')

          if (event.deposit === null) {
            event.deposit = 0
          }

          this.event = event

          this.bookingCreatedCount++
        })
        .catch(e => {
          console.log(e.message)
        })
    },

    getInitEventProviders () {
      if (this.$root.settings.role === 'provider' && this.$root.settings.roles.allowWriteEvents) {
        return this.options.entities.employees
      }

      return []
    },

    handleDateTimeFormat (dateTime) {
      return [
        this.getFrontedFormattedDate(dateTime.split(' ')[0]),
        this.getFrontedFormattedTime(dateTime.split(' ')[1])
      ]
    },

    showDialogAttendees (id) {
      this.eventBookings = null
      this.dialogAttendees = true
      this.getEvent(id)
    },

    searchEvents (query, groupEvents = false, events = []) {
      if (!query || events.length < this.$root.settings.general.eventsFilterLimit) {
        this.loadingEvents = true

        this.searchedEvents = events

        setTimeout(() => {
          this.loadingEvents = false
        }, 500)

        return
      }

      this.searchEventsQuery = query
      clearTimeout(this.searchEventsTimer)

      this.loadingEvents = true
      this.searchCounter++

      this.searchEventsTimer = setTimeout(() => {
        let lastSearchCounter = this.searchCounter

        this.$http.get(`${this.$root.getAjaxUrl}/events`, {
          params: {search: query, page: 1, limit: this.$root.settings.general.eventsFilterLimit, skipCount: 1, dates: [moment().format('YYYY-MM-DD')]}
        })
        .then(response => {
          if (lastSearchCounter >= this.searchCounter) {
            this.searchedEvents = groupEvents ? this.groupRecurringEvents(response.data.data.events) : response.data.data.events
          }

          this.loadingEvents = false
        })
        .catch(e => {
          this.loadingEvents = false
        })
      }, 500)
    },

    getNotRetrievedEvents (events, entities, field) {
      let eventsIds = events.map(event => event.id)

      let resultEvents = []

      entities.forEach(entity => {
        resultEvents = resultEvents.concat(entity[field].filter(event => eventsIds.indexOf(event.id) === -1))
      })

      return resultEvents
    },

    groupRecurringEvents (originalEvents) {
      let events = []
      if (originalEvents) {
        for (let i = 0; i < originalEvents.length; i++) {
          let ev = originalEvents[i]
          if (ev.status !== 'approved') {
            continue
          }
          let sameEvent = events.find(e => (e.id === ev.parentId || e.parentId === ev.parentId) && ev.parentId !== null)
          if (sameEvent) {
            continue
          }
          let sameNameEvent = events.find(e => e.name === ev.name && e.id !== ev.id)
          if (sameNameEvent) {
            ev.displayName = ev.name + ' (' + this.getFrontedFormattedDateTime(ev.periods[0].periodStart) + ')'
            sameNameEvent.displayName = sameNameEvent.name + ' (' + this.getFrontedFormattedDateTime(sameNameEvent.periods[0].periodStart) + ')'
            events.push(ev)
          } else {
            events.push(ev)
          }
        }
      }
      return events
    }
  },

  watch: {}
}
