<template>
  <div class="am-wrap">
    <div id="am-calendar" class="am-body">

      <get-premium-banner></get-premium-banner>

      <!-- Page Header -->
      <page-header
          :categories="filterCategoriesByProviderServiceIDs(options.entities.categories)"
          :locations="options.entities.locations"
          :params="params"
          :fetched="appointmentsFetched && eventsFetched"
          @newAppointmentBtnClicked="showDialogNewAppointment()"
          @changeFilter="filterData"
          @selectAllInCategory="selectAllInCategory"
      >
      </page-header>

      <div class="am-section am-calendar">

        <!-- Employees Filter -->
        <div v-if="$root.settings.capabilities.canReadOthers === true" class="am-calendar-employees">
          <div
            class="am-calendar-employee"
            :class="{ active: params.providers.length === 0 && employeesPreselectedCount === 0 }"
            @click="filterAllEmployees"
            v-if="!$root.licence.isLite"
          >
            <div class="am-profile-photo">
              <div class="am-all">{{ $root.labels.all }}</div>
            </div>
            <p>{{ $root.labels.all_employees }}</p>
          </div>

          <div v-for="employee in options.entities.employees"
               :key="employee.id"
               class="am-calendar-employee"
               :class="{ active: params.providers.indexOf(employee.id) !== -1 }"
               @click="filterEmployees(employee)"
          >
            <div class="am-profile-photo">
              <img :src="pictureLoad(employee, true)" @error="imageLoadError(employee, true)">
            </div>
            <p class="am-calendar-employee-name">{{ employee.firstName + ' ' + employee.lastName }}</p>
          </div>
        </div>

        <!-- Calendar -->
        <div class="am-calendar-scroll">

          <v-date-picker
            :locale="$root.locale"
            @input="selectDay"
            v-model="selectedDate"
            mode="single"
            id="am-calendar-picker"
            class='am-calendar-picker'
            tint-color='#1A84EE'
            :show-day-popover=false
            :is-expanded=false
            :is-inline=true
            :is-required=true
            :formats="vCalendarFormats"
          >
          </v-date-picker>

          <full-calendar
            :class="{'am-licence-calendar': notInLicence('starter')}"
            ref="calendar"
            :events="events"
            :config="config"
            @event-selected="eventSelected"
            @event-render="eventRender"
            @event-drop="eventDrop"
            @event-drag-start="eventDragStart"
            @event-drag-stop="eventDragStop"
          >
          </full-calendar>

          <!-- Content Spinner -->
          <div class="am-spinner am-section" v-show="!appointmentsFetched || !eventsFetched || !appointmentsFetchedFiltered || !eventsFetchedFiltered">
            <img :src="$root.getUrl + 'public/img/spinner.svg'"/>
          </div>

        </div>

      </div>

      <!-- Button New -->
      <div v-if="$root.settings.role !== 'customer' && canWriteAppointments()" id="am-button-new" class="am-button-new">
        <el-button id="am-plus-symbol" type="primary" icon="el-icon-plus"
                   @click="showDialogNewAppointment()"></el-button>
      </div>

      <!-- Dialog Event -->
      <transition name="slide">
        <el-dialog
            :close-on-click-modal="false"
            class="am-side-dialog am-dialog-event"
            :show-close="false"
            :visible.sync="dialogEvent"
            v-if="dialogEvent"
        >
          <dialog-event
              :event="event"
              :employees="options.entities.employees"
              :locations="options.entities.locations"
              :tags="options.entities.tags"
              @closeDialog="closeDialogEvent"
              @saveCallback="saveCallback"
          >
          </dialog-event>
        </el-dialog>
      </transition>

      <!-- Dialog New Appointment -->
      <transition name="slide">
        <el-dialog
            :close-on-click-modal="false"
            class="am-side-dialog"
            :visible.sync="dialogAppointment"
            :show-close="false"
            v-if="dialogAppointment"
        >
          <dialog-appointment
              :appointment="appointment"
              :recurringAppointments="recurringAppointments"
              :savedAppointment="savedAppointment"
              :bookings="bookings"
              :options="options"
              :customerCreatedCount="customerCreatedCount"
              :packageCustomer="null"
              :current-user="currentUser"
              :customersNoShowCount="customersNoShowCount"
              @sortBookings="sortBookings"
              @saveCallback="saveCallback"
              @duplicateCallback="duplicateAppointmentCallback"
              @closeDialog="closeDialogAppointment"
              @showDialogNewCustomer="showDialogNewCustomer"
              @editPayment="editPayment"
              @openRecurringAppointment="openRecurringAppointment"
          >
          </dialog-appointment>
        </el-dialog>
      </transition>

      <!-- Dialog New Customer -->
      <transition name="slide">
        <el-dialog
            :close-on-click-modal="false"
            class="am-side-dialog"
            size="full"
            :visible.sync="dialogCustomer"
            :show-close="false"
            v-if="dialogCustomer">
          <dialog-customer
              :customer="customer"
              @saveCallback="saveCustomerCallback"
              @closeDialog="dialogCustomer = false"
          ></dialog-customer>
        </el-dialog>
      </transition>

      <!-- Dialog Payment -->
      <transition name="slide">
        <el-dialog
            :close-on-click-modal="false"
            class="am-side-dialog am-dialog-coupon"
            :visible.sync="dialogPayment"
            :show-close="false"
            v-if="dialogPayment"
        >
          <dialog-payment
              :modalData="selectedPaymentModalData"
              :appointmentFetched=true
              :bookingFetched=true
              @closeDialogPayment="dialogPayment = false"
              @updatePaymentCallback="updatePaymentCallback"
              @deletePaymentCallback="deletePaymentCallback"
          >
          </dialog-payment>
        </el-dialog>
      </transition>

      <!-- Help Button -->
      <el-col :md="6" class="">
        <a class="am-help-button" href="https://wpamelia.com/admin-calendar/" target="_blank" rel="nofollow">
          <i class="el-icon-question"></i> {{ $root.labels.need_help }}?
        </a>
      </el-col>

<!--      <dialog-new-customize></dialog-new-customize>-->

    </div>
  </div>
</template>

<script>
  import 'fullcalendar-scheduler'
  import licenceMixin from '../../../js/common/mixins/licenceMixin'
  import appointmentMixin from '../../../js/backend/mixins/appointmentMixin'
  import backendEventMixin from '../../../js/backend/mixins/eventMixin'
  import commonEventMixin from '../../../js/common/mixins/eventMixin'
  import customerMixin from '../../../js/backend/mixins/customerMixin'
  import dateMixin from '../../../js/common/mixins/dateMixin'
  import DialogAppointment from '../appointments/DialogAppointment.vue'
  import DialogCustomer from '../customers/DialogCustomer.vue'
  import DialogEvent from '../events/DialogEvent.vue'
  import DialogPayment from '../finance/DialogFinancePayment.vue'
  import durationMixin from '../../../js/common/mixins/durationMixin'
  import entitiesMixin from '../../../js/common/mixins/entitiesMixin'
  import Form from 'form-object'
  import imageMixin from '../../../js/common/mixins/imageMixin'
  import moment from 'moment'
  import notifyMixin from '../../../js/backend/mixins/notifyMixin'
  import PageHeader from '../parts/PageHeader.vue'
  import paymentMixin from '../../../js/backend/mixins/paymentMixin'
  import { FullCalendar } from 'vue-full-calendar'
  // import DialogNewCustomize from '../parts/DialogNewCustomize.vue'
  import GetPremiumBanner from '../parts/GetPremiumBanner.vue'

  export default {
    mixins: [
      licenceMixin,
      appointmentMixin,
      backendEventMixin,
      commonEventMixin,
      customerMixin,
      dateMixin,
      durationMixin,
      entitiesMixin,
      imageMixin,
      notifyMixin,
      paymentMixin
    ],

    data () {
      return {
        customersNoShowCount: [],
        currentUser: null,
        employeesPreselectedCount: 0,
        appointmentsFetchCounter: 0,
        eventsFetchCounter: 0,
        occupiedSlots: [],
        initCall: true,
        globalBusinessHours: [],
        employeesResources: [],
        customerServices: [],
        customerEmployees: [],
        parsedEmployees: null,
        previousViewName: null,
        customer: null,
        resources: [],
        dialogEvent: false,
        dialogAppointment: false,
        dialogPayment: false,
        events: [],
        appointmentsFetched: false,
        eventsFetched: false,
        appointmentsFetchedFiltered: false,
        eventsFetchedFiltered: false,
        form: new Form(),
        minTimeInSeconds: null,
        maxTimeInSeconds: null,
        params: {
          dates: [],
          locations: [],
          providers: [],
          services: [],
          source: 'calendar'
        },
        selectedDate: moment().toDate(),
        selectedPaymentModalData: null
      }
    },

    created () {
      Form.defaults.axios = this.$http

      this.config.slotLabelFormat = this.config.timeFormat = this.config.views.timelineDay.slotLabelFormat = this.momentTimeFormat
      this.config.listDayAltFormat = this.momentDateFormat
      this.config.views.week.columnFormat = 'ddd ' + this.momentDateFormat
        .replace(/Y/g, '').replace(/y/g, '').replace(/^([^a-zA-Z0-9])*/g, '').replace(/([^a-zA-Z0-9])*$/g, '')
    },

    mounted () {
      this.employeesPreselectedCount = this.$root.settings.general.calendarEmployeesPreselected

      this.setInitialCustomers()

      this.getCalendarOptions(true)
      let view = this.$refs.calendar.fireMethod('getView')
      this.params.dates = [view.start.format('YYYY-MM-DD'), view.end.clone().subtract(1, 'days').format('YYYY-MM-DD')]
      this.initVCalendar()
    },

    methods: {
      saveCallback () {
        this.getCalendarOptions(false)
      },

      showDialogNewCustomer () {
        this.customer = this.getInitCustomerObject()
        this.dialogCustomer = true
      },

      getCalendarOptions (initLoad) {
        this.options.fetched = false

        let $this = this

        this.fetchEntities(function (success) {
          if (success) {
            let tags = []

            $this.options.entities.tags.forEach(function (eventTag) {
              if ($this.options.entities.tags.indexOf(eventTag.name) === -1) {
                tags.push(eventTag.name)
              }
            })

            $this.options.entities.tags = tags

            $this.setBookings(0)

            if (initLoad) {
              $this.params.providers = $this.employeesPreselectedCount > 0 ? $this.options.entities.employees
                .map(employee => employee.id)
                .slice(0, $this.employeesPreselectedCount) : []
            }

            if (!initLoad || $this.employeesPreselectedCount > -1) {
              $this.getCalendar()
            } else {
              $this.appointmentsFetched = true
              $this.appointmentsFetchedFiltered = true
              $this.eventsFetched = true
              $this.eventsFetchedFiltered = true
            }
          }

          $this.fetched = true
          $this.options.fetched = true
        }, {
          types: ['locations', 'employees', 'categories', 'custom_fields', 'tags', 'packages', 'resources', 'coupons'],
          page: 'calendar',
          isFrontEnd: false,
          isPanel: false
        })
      },

      getEmployeeDaysOffDates (dayOffList) {
        let dayOffDates = []

        dayOffList.forEach(function (daysOff) {
          let dayOffStartDate = daysOff.repeat
            ? moment(moment().format('YYYY') + '-' + moment(daysOff.startDate, 'YYYY-MM-DD').format('MM-DD'), 'YYYY-MM-DD')
            : moment(daysOff.startDate, 'YYYY-MM-DD')

          let dayOffEndDate = daysOff.repeat
            ? moment(moment().format('YYYY') + '-' + moment(daysOff.endDate, 'YYYY-MM-DD').format('MM-DD'), 'YYYY-MM-DD')
            : moment(daysOff.endDate, 'YYYY-MM-DD')

          while (dayOffStartDate.isSameOrBefore(dayOffEndDate)) {
            dayOffDates.push(dayOffStartDate.format('YYYY-MM-DD'))
            dayOffStartDate.add(1, 'days')
          }
        })

        return dayOffDates
      },

      getParsedEmployees () {
        let minAvailableDate = moment(this.$root.settings.slotDateConstraints.minDate, 'YYYY-MM-DD')
        let maxAvailableDate = moment(this.$root.settings.slotDateConstraints.maxDate, 'YYYY-MM-DD')

        let employees = JSON.parse(JSON.stringify(this.options.entities.employees))

        let view = this.$refs.calendar.fireMethod('getView')

        let startDate = view.start.clone()
        let endDate = view.end.clone().subtract(1, 'days')

        let paramsDates = []
        let unavailableDayDates = []

        // get range dates
        while (startDate.isSameOrBefore(endDate)) {
          paramsDates.push(startDate.format('YYYY-MM-DD'))

          if ((startDate.isBefore(minAvailableDate) || startDate.isSameOrAfter(maxAvailableDate)) && this.$root.settings.role === 'customer') {
            unavailableDayDates.push(startDate.format('YYYY-MM-DD'))
          }

          startDate.add(1, 'days')
        }

        unavailableDayDates = _.intersection(unavailableDayDates, paramsDates)
        let unavailableDateIndexes = paramsDates.filter(value => unavailableDayDates.indexOf(value) !== -1).map(date => moment(date).day())

        let that = this

        // alter employee period list for date range
        employees.forEach(function (employee) {
          // remove days off if they are out or params range
          let dayOffDates = _.intersection(that.getEmployeeDaysOffDates(employee.dayOffList), paramsDates)

          let dayOffIndexes = paramsDates.filter(value => dayOffDates.indexOf(value) !== -1).map(date => moment(date).day())

          employee.specialDayList.forEach(function (specialDays) {
            let specialDaysDates = []

            let startDate = moment(specialDays.startDate, 'YYYY-MM-DD')

            while (startDate.isSameOrBefore(moment(specialDays.endDate, 'YYYY-MM-DD'))) {
              specialDaysDates.push(startDate.format('YYYY-MM-DD'))
              startDate.add(1, 'days')
            }

            // remove special days if they are out or params range
            specialDaysDates = _.intersection(specialDaysDates, paramsDates)

            // remove special days if they are in days off range
            specialDaysDates = specialDaysDates.filter(specialDay => dayOffDates.indexOf(specialDay) === -1)

            let specialDayIndexes = paramsDates.filter(value => specialDaysDates.indexOf(value) !== -1).map(date => moment(date).day())

            let weekDayIndexes = employee.weekDayList.map(day => day.dayIndex === 7 ? 0 : day.dayIndex)

            let parsedDayIndexes = []

            // set working hours based on special day if employee works on that day
            employee.weekDayList.forEach(function (day) {
              let dayIndex = day.dayIndex === 7 ? 0 : day.dayIndex

              if (specialDayIndexes.indexOf(dayIndex) !== -1) {
                day.regularEndTime = day.endTime
                day.regularStartTime = day.startTime
                day.endTime = specialDays.periodList[specialDays.periodList.length - 1].endTime
                day.startTime = specialDays.periodList[0].startTime
                day.periodList = specialDays.periodList
                day.timeOutList = []

                parsedDayIndexes.push(dayIndex)
              }
            })

            // set working hours based on special day if employee doesn't works on that day
            specialDayIndexes.forEach(function (specialDayIndex) {
              if (weekDayIndexes.indexOf(specialDayIndex) === -1 && parsedDayIndexes.indexOf(specialDayIndex) === -1) {
                employee.weekDayList.push({
                  id: null,
                  dayIndex: specialDayIndex === 0 ? 7 : specialDayIndex,
                  startTime: specialDays.periodList[0].startTime,
                  endTime: specialDays.periodList[specialDays.periodList.length - 1].endTime,
                  periodList: specialDays.periodList,
                  timeOutList: []
                })
              }
            })
          })

          // remove employee week days that are not in params dates range or are in days off range
          let dayIndexesToRemove = []

          employee.weekDayList.forEach(function (day, index) {
            if (paramsDates.map(date => moment(date).day()).indexOf(day.dayIndex === 7 ? 0 : day.dayIndex) === -1 ||
              dayOffIndexes.indexOf(day.dayIndex === 7 ? 0 : day.dayIndex) !== -1 ||
              unavailableDateIndexes.indexOf(day.dayIndex === 7 ? 0 : day.dayIndex) !== -1) {
              dayIndexesToRemove.push(index)
            }
          })

          for (let index = dayIndexesToRemove.length - 1; index >= 0; index--) {
            employee.weekDayList.splice(dayIndexesToRemove[index], 1)
          }
        })

        return employees
      },

      setMinMaxTime (that, start, end) {
        let startParts = start.substring(0, 16).split(' ')

        let endParts = end.substring(0, 16).split(' ')

        if (startParts[0] === endParts[0]) {
          let minTimeInSeconds = that.getStringTimeInSeconds(startParts[1])

          if (that.minTimeInSeconds === null || minTimeInSeconds < that.minTimeInSeconds) {
            that.minTimeInSeconds = minTimeInSeconds
          }

          let maxTimeInSeconds = that.getStringTimeInSeconds(endParts[1])

          if (that.maxTimeInSeconds === null || maxTimeInSeconds > that.maxTimeInSeconds) {
            that.maxTimeInSeconds = maxTimeInSeconds
          }
        } else {
          that.minTimeInSeconds = 0

          that.maxTimeInSeconds = 86400
        }
      },

      reFetchResources () {
        if (this.appointmentsFetchedFiltered && this.eventsFetchedFiltered) {
          this.$refs.calendar.fireMethod('refetchResources')
        }
      },

      getEvents (counter) {
        let providers = this.params.providers.length === 0 ? this.options.entities.employees.map(employee => employee.id) : this.params.providers

        if (this.$root.settings.role === 'provider' && this.$root.settings.roles.allowWriteEvents) {
          providers = this.options.entities.employees.map(employee => employee.id)
        }

        // fix for events that spans through 2 weeks (not shown in 2nd week, Week and List view)
        let view = this.$refs.calendar.fireMethod('getView')

        let params = JSON.parse(JSON.stringify(this.params))

        if (view.type === 'agendaWeek' || view.type === 'listWeek') {
          params.dates[0] = moment(params.dates[0]).subtract(14, 'days').format('YYYY-MM-DD')
        }

        let dates = params.dates[0] === params.dates[1] ? [params.dates[0]] : params.dates

        this.$http.get(`${this.$root.getAjaxUrl}/events`, {
          params: this.getAppropriateUrlParams(
            Object.assign(JSON.parse(JSON.stringify(params)), {providers: providers, status: 'approved', dates: dates})
          )
        })
          .then(response => {
            if (counter !== this.eventsFetchCounter) {
              return
            }

            let that = this

            let employeesStyle = that.$refs.calendar.fireMethod('getView').name === 'listWeek' ? 'style="display: inline; margin-left: 10px;"' : ''

            let paramsStart = moment(this.params.dates[0], 'YYYY-MM-DD')

            let paramsEnd = moment(this.params.dates[1] + ' 23:59:59', 'YYYY-MM-DD HH:mm:ss')

            response.data.data.events.forEach(function (event) {
              let employeesInfo = ''

              event.providers.forEach(function (employee) {
                employeesInfo += '<div ' + employeesStyle + '><img src="' + that.pictureLoad(employee, true) + '">' + employee.firstName.replace(/<\/?[^>]+(>|$)/g, '') + ' ' + employee.lastName.replace(/<\/?[^>]+(>|$)/g, '') + '</div>'
              })

              that.getExplodedPeriods(that.getImplodedPeriods(event.periods)).forEach(function (period) {
                event.providers.forEach(function (provider, index) {
                  if (that.$refs.calendar.fireMethod('getView').name === 'timelineDay' || that.$refs.calendar.fireMethod('getView').name === 'day' || index === 0) {
                    let locationString = ''
                    if (event.locationId) {
                      let location = that.getLocationById(event.locationId)
                      locationString = location.address ? location.address : location.name
                    }

                    let periodStart = moment(period.periodStart, 'YYYY-MM-DD HH:mm:ss')

                    let periodEnd = moment(period.periodEnd, 'YYYY-MM-DD HH:mm:ss')

                    if (dates.length !== 1 && !(periodStart.isBetween(paramsStart, paramsEnd) || periodEnd.isBetween(paramsStart, paramsEnd))) {
                      return
                    }

                    that.setMinMaxTime(that, period.periodStart, period.periodEnd)

                    that.events.push({
                      id: event.id,
                      title: event.name.replace(/<\/?[^>]+(>|$)/g, ''),
                      bookings: event.bookings,
                      start: periodStart.format(),
                      end: periodEnd.format(),
                      color: that.shadeColor(event.color, 0.7),
                      borderColor: event.color,
                      customer: that.$root.labels.event,
                      employeesInfo: '<div style="display: inline-block;">' + employeesInfo + '</div>',
                      location: locationString.replace(/<\/?[^>]+(>|$)/g, '') || (event.customLocation && event.customLocation.replace(/<\/?[^>]+(>|$)/g, '')),
                      status: event.status,
                      eventOverlap: false,
                      editable: that.canWriteEvents(),
                      resourceId: provider.id.toString(),
                      type: 'event',
                      icon: '<img style="float: right;" src="' + that.$root.getUrl + 'public/img/event.svg' + '">'
                    })

                    that.resources.push({
                      id: provider.id.toString(),
                      title: provider.firstName.replace(/<\/?[^>]+(>|$)/g, '') + ' ' + provider.lastName.replace(/<\/?[^>]+(>|$)/g, '')
                    })
                  }
                })
              })
            })

            if (this.appointmentsFetched) {
              this.setHours()
            }

            this.eventsFetched = true
            this.eventsFetchedFiltered = true

            this.reFetchResources()
          })
          .catch(e => {
            console.log(e.message)
            this.eventsFetched = true
            this.eventsFetchedFiltered = true
          })
      },

      getAppointments (counter) {
        if (this.$root.settings.role === 'provider' && this.options.entities.employees.length === 1 && this.options.entities.employees[0].timeZone) {
          this.params.timeZone = this.options.entities.employees[0].timeZone
        }

        this.$http.get(`${this.$root.getAjaxUrl}/appointments`, {
          params: this.getAppropriateUrlParams(this.params)
        })
          .then(response => {
            if (counter !== this.appointmentsFetchCounter) {
              return
            }
            this.currentUser = response.data.data.currentUser

            if (this.$root.settings.role !== 'admin') {
              this.setMissingServices(response.data.data.appointments)
            }

            let that = this
            let appointmentDays = {}

            if (this.$root.settings.role === 'customer') {
              this.useSortedDateStrings(Object.keys(response.data.data.appointments)).forEach(function (dateKey) {
                response.data.data.appointments[dateKey].appointments.forEach(function (appointment) {
                  appointment.bookings.forEach(function (booking) {
                    let parsedAppointment = JSON.parse(JSON.stringify(appointment))

                    parsedAppointment.bookings = [
                      booking
                    ]

                    if (!(dateKey in appointmentDays)) {
                      appointmentDays[dateKey] = response.data.data.appointments[dateKey]
                      appointmentDays[dateKey].appointments = []
                    }

                    appointmentDays[dateKey].appointments.push(parsedAppointment)
                  })
                })
              })
            } else {
              let customersIds = this.options.entities.customers.map(customer => parseInt(customer.id))

              let customers = this.options.entities.customers

              this.useSortedDateStrings(Object.keys(response.data.data.appointments)).forEach(function (dateKey) {
                response.data.data.appointments[dateKey].appointments.forEach(function (app) {
                  app.checked = false

                  app.bookings.forEach((booking) => {
                    if (customersIds.indexOf(parseInt(booking.customer.id)) === -1) {
                      customersIds.push(booking.customer.id)
                      customers.push(booking.customer)
                    }
                  })
                })
              })

              this.options.entities.customers = Object.values(customers.sort((a, b) => (a.firstName.toLowerCase() > b.firstName.toLowerCase()) ? 1 : -1))

              appointmentDays = response.data.data.appointments
            }

            this.useSortedDateStrings(Object.keys(appointmentDays)).forEach(function (appointmentDay) {
              for (let i = 0; i < appointmentDays[appointmentDay].appointments.length; i++) {
                // Do not render appointments with rejected and canceled status
                if (['rejected', 'canceled', 'no-show'].indexOf(appointmentDays[appointmentDay].appointments[i].status) === -1) {
                  // If customer is logged in don't render appointments where his customer booking has status rejected or canceled
                  if (that.$root.settings.role !== 'customer' || (that.$root.settings.role === 'customer' && ['rejected', 'canceled', 'no-show'].indexOf(appointmentDays[appointmentDay].appointments[i].bookings[0].status) === -1)) {
                    let appointment = appointmentDays[appointmentDay].appointments[i]
                    let service = that.options.entities.employees.find(employee => employee.id === appointment.providerId).serviceList.find(service => service.id === appointment.serviceId)
                    let customer = that.getCustomerInfo(appointment.bookings[0])
                    let employee = that.getProviderById(appointment.providerId)
                    let location = that.getLocationById(appointment.locationId ? appointment.locationId : employee.locationId)

                    if (typeof service === 'undefined') {
                      service = that.getServiceById(appointment.serviceId)
                    }

                    if (that.$root.settings.role === 'customer') {
                      if (that.customerServices.indexOf(appointment.serviceId) === -1) {
                        that.customerServices.push(appointment.serviceId)
                      }

                      if (that.customerEmployees.indexOf(appointment.providerId) === -1) {
                        that.customerEmployees.push(appointment.providerId)
                      }
                    }

                    that.setMinMaxTime(that, appointment.bookingStart, appointment.bookingEnd)

                    that.events.push({
                      id: appointment.id,
                      bookings: appointment.bookings,
                      serviceId: service.id,
                      timeBefore: service.timeBefore === null ? 0 : service.timeBefore,
                      timeAfter: service.timeAfter === null ? 0 : service.timeAfter,
                      title: service.name.replace(/<\/?[^>]+(>|$)/g, ''),
                      start: moment(appointment.bookingStart, 'YYYY-MM-DD HH:mm').format(),
                      end: moment(appointment.bookingEnd, 'YYYY-MM-DD HH:mm').format(),
                      color: that.shadeColor(service.color, 0.7),
                      borderColor: service.color,
                      customer: appointment.bookings.length > 1 ? that.$root.labels.group_booking : customer.firstName.replace(/<\/?[^>]+(>|$)/g, '') + ' ' + customer.lastName.replace(/<\/?[^>]+(>|$)/g, ''),
                      employeeId: employee.id,
                      employeesInfo: '<div style="display: inline-block;"><div><img src="' + that.pictureLoad(employee, true) + '">' + employee.firstName.replace(/<\/?[^>]+(>|$)/g, '') + ' ' + employee.lastName.replace(/<\/?[^>]+(>|$)/g, '') + '</div></div>',
                      location: location ? (location.address ? location.address.replace(/<\/?[^>]+(>|$)/g, '') : location.name.replace(/<\/?[^>]+(>|$)/g, '')) : '',
                      status: appointment.status,
                      eventOverlap: false,
                      resourceId: employee.id.toString(),
                      editable: that.canWriteAppointments() && (that.$root.settings.role === 'customer' ? !appointment.past && appointment.cancelable && appointment.cancelable : true),
                      past: appointment.past,
                      cancelable: appointment.cancelable,
                      type: 'appointment',
                      icon: ''
                    })
                  }
                }
              }
            })

            if (this.eventsFetched) {
              this.setHours()
            }

            if (this.$root.settings.role === 'customer') {
              that.occupiedSlots = response.data.data.occupied

              for (let date in that.occupiedSlots) {
                that.occupiedSlots[date].forEach(function (appointment) {
                  that.createBackgroundEvent(!(that.customerEmployees.length === 1), date, appointment.startTime, appointment.endTime, appointment.employeeId, [])
                })
              }

              this.createEmployeesBackgroundEvents(this.parsedEmployees)
            }

            this.appointmentsFetched = true
            this.appointmentsFetchedFiltered = true

            this.customersNoShowCount = response.data.data.customersNoShowCount

            this.reFetchResources()
          })
          .catch(e => {
            this.appointmentsFetched = true
            this.appointmentsFetchedFiltered = true
          })
      },

      setHours () {
        this.parsedEmployees = this.$root.settings.role !== 'customer' ? this.getParsedEmployees() : this.getParsedEmployees().filter(employee => this.customerEmployees.indexOf(employee.id) !== -1)

        this.createResourcesForScheduler(this.parsedEmployees)

        this.setGlobalBusinessHours(this.parsedEmployees)
      },

      getCalendar () {
        this.events = []

        this.minTimeInSeconds = null
        this.maxTimeInSeconds = null

        this.appointmentsFetched = false
        this.eventsFetched = false

        this.appointmentsFetchedFiltered = false
        this.eventsFetchedFiltered = false

        Object.keys(this.params).forEach((key) => (!this.params[key] && this.params[key] !== 0) && delete this.params[key])

        this.resources = []

        this.selectedDate = moment(this.params.dates[0], 'YYYY-MM-DD').toDate()

        this.appointmentsFetchCounter++

        this.eventsFetchCounter++

        this.getAppointments(this.appointmentsFetchCounter)
        this.getEvents(this.eventsFetchCounter)
      },

      callViewRender (view) {
        let that = this

        if (that.params.dates.length > 0) {
          let start = view.start.format('YYYY-MM-DD')
          let end = view.end.clone().subtract(1, 'days').format('YYYY-MM-DD')
          if (
            (!moment(start).isBetween(this.params.dates[0], this.params.dates[1], null, '[]') ||
              !moment(end).isBetween(this.params.dates[0], this.params.dates[1], null, '[]')) || this.previousViewName !== view.name
          ) {
            this.previousViewName = view.name
            this.params.dates = [start, end]
            if (!this.initCall) {
              this.filterData()
            }

            this.initCall = false
          }
        }
      },

      filterData () {
        this.getCalendar()
      },

      eventSelected (event) {
        if (event.type === 'appointment') {
          if (!this.canWriteAppointments(event.employeeId) || !event.editable) {
            return
          }

          this.showDialogEditAppointment(event.id)
        }

        if (event.type === 'event') {
          if (!this.canWriteEvents() || !event.editable) {
            return
          }

          this.showDialogEditEvent(event.id)
        }
      },

      eventRender (event, element, view) {
        if (view.name !== 'timelineDay' && event.type !== 'fake') {
          element.find('.fc-content').prepend('<span class="am-calendar-customer">' + event.customer + event.icon + '</span>')

          element.find('.fc-title').prepend(`<span class="am-calendar-status ${event.status}"></span>`)

          element.find('.fc-content').append('<div class="flexed-between"><span class="am-calendar-employee">' + event.employeesInfo +
            '</span></div>')
        }

        if (view.name !== 'listWeek' && event.type !== 'fake') {
          let tooltip = '<div class="am-tooltip el-tooltip__popper is-light">' +
            '<span class="am-tooltip-color" style="background-color:' + event.borderColor + ';"></span> ' +
            '<span class="am-calendar-status ' + event.status + '"></span>' +
            '<h4>' + event.customer + '</h4>' +
            '<p>' + event.start.format(this.momentTimeFormat) + ' - ' + event.end.format(this.momentTimeFormat) + '</p>' +
            '<p>' + event.title + '</p>'

          let button = !event.editable ? '' : '<button type="button" class="el-button el-button--default"><span>' + this.$root.labels.edit + '</span></button>'

          tooltip += (typeof event.location !== 'undefined' && event.location && event.location !== '') ? '<p icon="el-icon-location" class="am-tooltip-address">' + event.location + '</p>' : ''

          tooltip += '<div class="flexed-between"><h4>' + event.employeesInfo + '</h4>' + button + '</div>' + '</div>'

          element.append(tooltip)
        }

        if (view.name === 'listWeek') {
          let serviceTime = element.find('.fc-list-item-time').html()
          let serviceName = element.find('.fc-list-item-title').html()
          element.find('.fc-list-item-time').html(serviceTime + '<span class="am-calendar-list-customer-name">' + event.customer + '</span>')
          element.find('.fc-list-item-title').html(serviceName + '<span class="am-calendar-employee">' + event.employeesInfo + '</span><span class="am-calendar-status ' + event.status + '"></span>')
        }
      },

      eventDrop (event, delta, revertFunc) {
        if (event.type === 'event') {
          revertFunc()
          return
        }

        let draggedEvent = event

        let draggedDateString = draggedEvent.start.format('YYYY-MM-DD')

        let employee = JSON.parse(JSON.stringify(this.getProviderById(draggedEvent.employeeId)))

        let dayIndex = draggedEvent.start.isoWeekday()
        let workingHoursForDayIndex = employee.weekDayList.find(day => day.dayIndex === dayIndex)

        // set event start and event end taking into account service buffer time after and service buffer time before
        let realDraggedEventStart = draggedEvent.start.clone().subtract(draggedEvent.timeBefore, 'seconds')
        let realDraggedEventEnd = draggedEvent.end.clone().add(draggedEvent.timeAfter, 'seconds')

        let realStartTime = realDraggedEventStart.format('HH:mm:ss')
        let realEndTime = realDraggedEventEnd.format('HH:mm:ss') === '00:00:00' ? '24:00:00' : realDraggedEventEnd.format('HH:mm:ss')
        let realStartDate = realDraggedEventStart.format('YYYY-MM-DD HH:mm')
        let realEndDate = realDraggedEventEnd.format('YYYY-MM-DD HH:mm')

        // Check if event is dropped in past
        let droppedInPast = moment().diff(moment(realStartDate), 'seconds') >= 0

        // Check if event is dropped in the employee's special day
        employee.specialDayList.forEach(function (specialDays) {
          if (
            draggedEvent.start.isSameOrAfter(moment(specialDays.startDate + ' 00:00:00', 'YYYY-MM-DD HH:ii:ss')) &&
            draggedEvent.start.isSameOrBefore(moment(specialDays.endDate + ' 24:00:00', 'YYYY-MM-DD HH:ii:ss'))
          ) {
            let specialDaysDates = []

            let startDate = moment(specialDays.startDate, 'YYYY-MM-DD')

            while (startDate.isSameOrBefore(moment(specialDays.endDate, 'YYYY-MM-DD'))) {
              specialDaysDates.push(startDate.format('YYYY-MM-DD'))
              startDate.add(1, 'days')
            }

            if (specialDaysDates.indexOf(draggedDateString) !== -1 && specialDays.periodList.length) {
              workingHoursForDayIndex = {
                startTime: specialDays.periodList[0].startTime,
                endTime: specialDays.periodList[0].endTime,
                periodList: specialDays.periodList,
                timeOutList: [],
                dayIndex: dayIndex
              }
            }
          }
        })

        // Check if event is dropped in the employee's working hours
        let droppedInWorkingHours =
          typeof workingHoursForDayIndex !== 'undefined' &&
          (
            moment(realStartTime, 'HH:mm:ss').isBetween(moment(workingHoursForDayIndex.startTime, 'HH:mm:ss'), moment(workingHoursForDayIndex.endTime, 'HH:mm:ss'), null, '[)') &&
            moment(realEndTime, 'HH:mm:ss').isBetween(moment(workingHoursForDayIndex.startTime, 'HH:mm:ss'), moment(workingHoursForDayIndex.endTime, 'HH:mm:ss'), null, '(]')
          )

        // Check if event is dropped in the employee's days off
        if (this.getEmployeeDaysOffDates(employee.dayOffList).indexOf(draggedDateString) !== -1) {
          droppedInWorkingHours = false
        }

        // Check if event is dropped outside of the employee's break
        let droppedInBreak = false
        let droppedOutSchedule = true
        if (typeof workingHoursForDayIndex !== 'undefined') {
          let servicePeriods = []

          // get service periods
          workingHoursForDayIndex.periodList.forEach(function (period) {
            if (period.periodServiceList.length === 0 || period.periodServiceList.map(periodService => periodService.serviceId).indexOf(draggedEvent.serviceId) !== -1) {
              servicePeriods.push({
                startTime: period.startTime,
                endTime: period.endTime
              })
            }
          })

          // merge service periods if end of one and start of next period are the same
          for (let i = 0; i < servicePeriods.length; i++) {
            if (i < servicePeriods.length - 1 && servicePeriods[i].endTime === servicePeriods[i + 1].startTime) {
              servicePeriods[i + 1].startTime = servicePeriods[i].startTime
              servicePeriods.splice(i, 1)
            }
          }

          // check if event is dropped in service period
          if (workingHoursForDayIndex.periodList.length) {
            servicePeriods.forEach(function (period) {
              if (moment(realStartTime, 'HH:mm:ss').isSameOrAfter(moment(period.startTime, 'HH:mm:ss')) &&
                moment(realEndTime, 'HH:mm:ss').isSameOrBefore(moment(period.endTime, 'HH:mm:ss'))
              ) {
                droppedOutSchedule = false
              }
            })
          } else {
            droppedOutSchedule = false
          }

          // check if event is dropped in timeout
          for (let i = 0; i < workingHoursForDayIndex.timeOutList.length; i++) {
            if (
              (
                moment(realStartTime, 'HH:mm:ss').isBetween(moment(workingHoursForDayIndex.timeOutList[i].startTime, 'HH:mm:ss'), moment(workingHoursForDayIndex.timeOutList[i].endTime, 'HH:mm:ss'), null, '[)') ||
                moment(realEndTime, 'HH:mm:ss').isBetween(moment(workingHoursForDayIndex.timeOutList[i].startTime, 'HH:mm:ss'), moment(workingHoursForDayIndex.timeOutList[i].endTime, 'HH:mm:ss'), null, '(]')
              ) ||
              (
                moment(workingHoursForDayIndex.timeOutList[i].startTime, 'HH:mm:ss').isBetween(moment(realStartTime, 'HH:mm:ss'), moment(realEndTime, 'HH:mm:ss'), null, '[)') ||
                moment(workingHoursForDayIndex.timeOutList[i].endTime, 'HH:mm:ss').isBetween(moment(realStartTime, 'HH:mm:ss'), moment(realEndTime, 'HH:mm:ss'), null, '(]')
              )
            ) {
              droppedInBreak = true
            }
          }
        }

        // Check if there is already an appointment in the dropped time for this provider
        let eventInDroppedTime = this.$refs.calendar.fireMethod('clientEvents', function (event) {
          let eventStartDate = event.start.clone().subtract(event.timeBefore, 'seconds').format('YYYY-MM-DD HH:mm')
          let eventEndDate = event.end.clone().add(event.timeAfter, 'seconds').format('YYYY-MM-DD HH:mm')

          return event.employeeId === draggedEvent.employeeId &&
            draggedEvent.id !== event.id &&
            ((moment(realStartDate).isBetween(eventStartDate, eventEndDate, null, '[)') || moment(realEndDate).isBetween(eventStartDate, eventEndDate, null, '(]')) ||
              (moment(eventStartDate).isBetween(realStartDate, realEndDate, null, '[)') || moment(eventEndDate).isBetween(realStartDate, realEndDate, null, '(]'))
            )
        })

        let droppedInAppointment = false

        if (this.$root.settings.role === 'customer') {
          let that = this

          for (let date in that.occupiedSlots) {
            if (date === realStartDate) {
              that.occupiedSlots[date].forEach(function (appointment) {
                if (moment(realStartTime, 'HH:mm:ss').isBetween(moment(appointment.startTime, 'HH:mm:ss'), moment(appointment.endTime, 'HH:mm:ss'), null, '[)') ||
                  moment(realEndTime, 'HH:mm:ss').isBetween(moment(appointment.startTime, 'HH:mm:ss'), moment(appointment.endTime, 'HH:mm:ss'), null, '(]')
                ) {
                  droppedInAppointment = true
                }
              })
            }
          }
        }

        // If one of the conditions is not satisfied revert event on the past position
        if (!this.canWriteAppointments(draggedEvent.employeeId) || droppedInPast || !droppedInWorkingHours || droppedInBreak || eventInDroppedTime.length !== 0 || droppedOutSchedule || droppedInAppointment) {
          if (droppedInPast) {
            var message = this.$root.labels.appointment_drag_past
          } else if (!droppedInWorkingHours) {
            message = this.$root.labels.appointment_drag_working_hours
          } else if (droppedInBreak) {
            message = this.$root.labels.appointment_drag_breaks
          } else if (droppedOutSchedule) {
            message = this.$root.labels.appointment_drag_out_schedule
          } else {
            message = this.$root.labels.appointment_drag_exist
          }

          this.notify(this.$root.labels.error, message, 'error')
          revertFunc()
        } else {
          let eventStartBeforeDrag = draggedEvent.start.clone()
          eventStartBeforeDrag.subtract(delta)

          // Confirmation modal and ajax request
          this.$confirm(
            this.$root.labels.appointment_change_time + '<br>' +
            '<div class="am-old-time">' +
            '<div><i class="el-icon-date"></i> ' + this.getFrontedFormattedDate(eventStartBeforeDrag) + '</div>' +
            '<div><i class="el-icon-time"></i> ' + this.getFrontedFormattedTime(eventStartBeforeDrag) + '</div>' +
            '</div>' +
            '<div class="am-new-time">' +
            '<div><i class="el-icon-date"></i> ' + this.getFrontedFormattedDate(draggedEvent.start) + '</div>' +
            '<div><i class="el-icon-time"></i> ' + this.getFrontedFormattedTime(draggedEvent.start) + '</div>' +
            '</div>', 'Warning', {
              confirmButtonText: this.$root.labels.confirm,
              cancelButtonText: this.$root.labels.cancel,
              type: 'warning',
              center: true,
              dangerouslyUseHTMLString: true
            })
            .then(() => {
              this.appointmentsFetchedFiltered = false

              let rescheduleUrlPart = this.$root.settings.role === 'customer' ? '/bookings/reassign/' : '/appointments/time/'
              let rescheduleUrlId = this.$root.settings.role === 'customer' ? draggedEvent.bookings[0].id : draggedEvent.id

              let params = {
                'bookingStart': draggedEvent.start.format('YYYY-MM-DD HH:mm')
              }

              if (this.$root.settings.role === 'provider' &&
                  this.$root.settings.roles.allowWriteAppointments &&
                  this.options.entities.employees[0].timeZone
              ) {
                params.timeZone = this.options.entities.employees[0].timeZone
              }

              this.$http.post(`${this.$root.getAjaxUrl}${rescheduleUrlPart}${rescheduleUrlId}`, params)
                .then(response => {
                  this.appointmentsFetchedFiltered = true
                  this.notify(this.$root.labels.success, this.$root.labels.appointment_rescheduled, 'success')
                })
                .catch(e => {
                  this.appointmentsFetchedFiltered = true

                  let $this = this

                  setTimeout(function () {
                    if ('timeSlotUnavailable' in e.response.data.data && e.response.data.data.timeSlotUnavailable === true) {
                      $this.notify($this.$root.labels.error, $this.$root.labels.time_slot_unavailable, 'error')
                    }

                    if ('rescheduleBookingUnavailable' in e.response.data.data && e.response.data.data.rescheduleBookingUnavailable === true) {
                      $this.notify($this.$root.labels.error, $this.$root.labels.booking_reschedule_exception, 'error')
                    }
                  }, 200)

                  revertFunc()
                })
            })
            .catch(() => {
              revertFunc()
            })
        }
      },

      shadeColor (color, percent) {
        let f = parseInt(color.slice(1), 16)
        let t = percent < 0 ? 0 : 255
        let p = percent < 0 ? percent * -1 : percent
        let R = f >> 16
        let G = f >> 8 & 0x00FF
        let B = f & 0x0000FF
        return '#' + (0x1000000 + (Math.round((t - R) * p) + R) * 0x10000 + (Math.round((t - G) * p) + G) * 0x100 + (Math.round((t - B) * p) + B)).toString(16).slice(1)
      },

      selectAllInCategory (id) {
        let services = this.getCategoryServices(id)
        let servicesIds = services.map(service => service.id)

        // Deselect all services if they are already selected
        if (_.isEqual(_.intersection(servicesIds, this.params.services), servicesIds)) {
          this.params.services = _.difference(this.params.services, servicesIds)
        } else {
          this.params.services = _.uniq(this.params.services.concat(servicesIds))
        }

        this.filterData()
      },

      filterEmployees (employee) {
        let index = this.params.providers.indexOf(employee.id)
        if (index !== -1) {
          this.params.providers.splice(index, 1)
        } else {
          this.params.providers.push(employee.id)
        }

        this.filterData()
      },

      filterAllEmployees () {
        this.employeesPreselectedCount = 0

        if (this.params.providers.length !== 0) {
          this.params.providers = []
          this.filterData()
        }
      },

      createResourcesForScheduler (employees) {
        this.employeesResources = []

        // Go through all employees
        for (let i = 0; i < employees.length; i++) {
          let businessHours = []
          // Go through all employee's working hours to set business hours
          for (let j = 0; j < employees[i].weekDayList.length; j++) {
            let day = employees[i].weekDayList[j]
            let dayIndex = day.dayIndex === 7 ? [0] : [day.dayIndex]

            // set employee resources
            if (!(employees[i].id in this.employeesResources)) {
              this.employeesResources[employees[i].id] = {}
            }

            if (!(dayIndex in this.employeesResources[employees[i].id])) {
              this.employeesResources[employees[i].id][dayIndex] = {
                'scheduled': [],
                'unavailable': []
              }
            }

            let unavailableIntervals = []
            let reservedPeriods = []

            if (day.periodList.length > 0) {
              // Go through all employee's periods
              for (let k = 0; k < day.periodList.length; k++) {
                if (k !== 0) {
                  if (day.periodList[k - 1].endTime !== day.periodList[k].startTime) {
                    unavailableIntervals.push({
                      startTime: day.periodList[k - 1].endTime,
                      endTime: day.periodList[k].startTime
                    })
                  }
                }

                let services = day.periodList[k].periodServiceList.map(periodServices => periodServices.serviceId)

                if (services.length > 0) {
                  reservedPeriods.push({
                    start: day.periodList[k].startTime,
                    end: day.periodList[k].endTime,
                    services: services
                  })
                }
              }
            }

            if (day.timeOutList.length > 0) {
              // Go through all employee's breaks
              for (let k = 0; k < day.timeOutList.length; k++) {
                unavailableIntervals.push({
                  startTime: day.timeOutList[k].startTime,
                  endTime: day.timeOutList[k].endTime
                })
              }
            }

            let mergedUnavailableIntervals = []

            if (unavailableIntervals.length) {
              unavailableIntervals = unavailableIntervals.sort((a, b) =>
                moment(a.startTime, 'HH:mm:ss').diff(moment().startOf('day'), 'seconds') -
                moment(b.startTime, 'HH:mm:ss').diff(moment().startOf('day'), 'seconds')
              )

              mergedUnavailableIntervals.push(unavailableIntervals.shift())

              // add interval to the top OR replace top with merged intervals if they overlap
              for (let k = 0; k < unavailableIntervals.length; k++) {
                let lastInterval = mergedUnavailableIntervals[mergedUnavailableIntervals.length - 1]

                let lastIntervalEndTimeSeconds = moment(lastInterval.endTime, 'HH:mm:ss').diff(moment().startOf('day'), 'seconds')
                let intervalStartTimeSeconds = moment(unavailableIntervals[k].startTime, 'HH:mm:ss').diff(moment().startOf('day'), 'seconds')
                let intervalEndTimeSeconds = moment(unavailableIntervals[k].endTime, 'HH:mm:ss').diff(moment().startOf('day'), 'seconds')

                if (lastIntervalEndTimeSeconds < intervalStartTimeSeconds) {
                  mergedUnavailableIntervals.push(unavailableIntervals[k])
                } else if (lastIntervalEndTimeSeconds < intervalEndTimeSeconds) {
                  lastInterval.endTime = unavailableIntervals[k].endTime
                  mergedUnavailableIntervals.pop()
                  mergedUnavailableIntervals.push(lastInterval)
                }

                if (mergedUnavailableIntervals[mergedUnavailableIntervals.length - 1].startTime === mergedUnavailableIntervals[mergedUnavailableIntervals.length - 1].endTime) {
                  mergedUnavailableIntervals.pop()
                }
              }

              for (let intervalKey in mergedUnavailableIntervals) {
                this.employeesResources[employees[i].id][dayIndex].unavailable.push({
                  start: mergedUnavailableIntervals[intervalKey].startTime,
                  end: mergedUnavailableIntervals[intervalKey].endTime
                })
              }

              for (let k = 0; k < mergedUnavailableIntervals.length; k++) {
                let intervalStartTime = mergedUnavailableIntervals[k].startTime
                let intervalEndTime = mergedUnavailableIntervals[k].endTime

                // If this is first unavailable interval, start time will be working start time, and end time will be
                // beginning of the unavailable interval
                if (k === 0) {
                  businessHours.push({
                    dow: dayIndex,
                    start: day.startTime,
                    end: intervalStartTime
                  })
                }

                // Start time will be this unavailable interval end time, and end time will be:
                // If this is last unavailable interval, then end time will be working end time otherwise it will be
                // next unavailable interval start time
                businessHours.push({
                  dow: dayIndex,
                  start: intervalEndTime,
                  end: k + 1 === mergedUnavailableIntervals.length ? day.endTime : mergedUnavailableIntervals[k + 1].startTime
                })
              }
            } else {
              businessHours.push({
                dow: dayIndex,
                start: day.startTime,
                end: day.endTime
              })
            }

            let periodParts = []

            reservedPeriods.forEach(function (period) {
              let periodStart = period.start
              let periodEnd = period.end

              let periodBreaks = []

              // modify start and end of the period
              for (let intervalKey in mergedUnavailableIntervals) {
                let breakStart = mergedUnavailableIntervals[intervalKey].startTime
                let breakEnd = mergedUnavailableIntervals[intervalKey].endTime

                if (moment.duration(breakStart) < moment.duration(periodStart) &&
                  moment.duration(breakEnd) > moment.duration(periodStart) &&
                  moment.duration(breakEnd) < moment.duration(periodEnd)
                ) {
                  periodStart = breakEnd
                }

                if (moment.duration(breakStart) > moment.duration(periodStart) &&
                  moment.duration(breakEnd) < moment.duration(periodEnd)
                ) {
                  periodBreaks.push({
                    startTime: breakStart,
                    endTime: breakEnd
                  })
                }

                if (moment.duration(breakStart) > moment.duration(periodStart) &&
                  moment.duration(breakStart) < moment.duration(periodEnd) &&
                  moment.duration(breakEnd) > moment.duration(periodEnd)
                ) {
                  periodEnd = breakStart
                }
              }

              if (periodBreaks.length) {
                periodParts.push({
                  parts: [],
                  services: period.services
                })

                periodParts[periodParts.length - 1].parts.push({
                  start: periodStart,
                  end: periodBreaks[0].startTime
                })

                for (let k = 0; k < periodBreaks.length; k++) {
                  if (k !== 0) {
                    periodParts[periodParts.length - 1].parts.push({
                      start: periodBreaks[k - 1].endTime,
                      end: periodBreaks[k].startTime
                    })
                  }
                }

                periodParts[periodParts.length - 1].parts.push({
                  start: periodBreaks[periodBreaks.length - 1].endTime,
                  end: periodEnd
                })
              } else {
                periodParts.push({
                  parts: [
                    {
                      start: periodStart,
                      end: periodEnd
                    }
                  ],
                  services: period.services
                })
              }
            })

            this.employeesResources[employees[i].id][dayIndex].scheduled = periodParts
          }

          if (businessHours.length) {
            this.resources.push({
              id: employees[i].id.toString(),
              title: employees[i].firstName.replace(/<\/?[^>]+(>|$)/g, '') + ' ' + employees[i].lastName.replace(/<\/?[^>]+(>|$)/g, ''),
              businessHours: businessHours
            })
          }
        }
      },

      initVCalendar () {
        let dateTrigger = document.getElementsByClassName('fc-center')

        if (dateTrigger.length) {
          let datepicker = document.getElementById('am-calendar-picker')
          dateTrigger[0].addEventListener('click', function () {
            if (dateTrigger[0].className.indexOf('am-datepicker-active') < 0) {
              datepicker.style.opacity = '1'
              datepicker.style.zIndex = '11'
              dateTrigger[0].className += ' am-datepicker-active'
            } else {
              datepicker.style.opacity = '0'
              datepicker.style.zIndex = '0'
              dateTrigger[0].classList.remove('am-datepicker-active')
            }
          })
        }
      },

      selectDay () {
        if (this.selectedDate !== null) {
          this.$refs.calendar.fireMethod('gotoDate', this.selectedDate)
        }
        document.getElementsByClassName('fc-center')[0].click()
      },

      setGlobalBusinessHours (employees) {
        let businessHours = []
        let minTime = moment.duration('24:00:00')
        let maxTime = moment.duration('00:00:00')

        // If employee filter is selected take just filtered employees in count
        if (this.params.providers.length !== 0) {
          let employeesToRemove = []

          for (let i = 0; i < employees.length; i++) {
            if (_.indexOf(this.params.providers, employees[i].id) === -1) {
              employeesToRemove.push(employees[i])
            }
          }

          employees = _.difference(employees, employeesToRemove)
        }

        // Go through all employees
        for (let i = 0; i < employees.length; i++) {
          let breakCounter = 8
          // Go through all employee's working hours
          for (let j = 0; j < employees[i].weekDayList.length; j++) {
            let day = employees[i].weekDayList[j]

            if (typeof businessHours[day.dayIndex] === 'undefined') {
              businessHours[day.dayIndex] = {}
            }

            // Min time is earliest regular day or special day working start time
            if ('regularStartTime' in day && moment.duration(day.regularStartTime) < minTime) {
              minTime = moment.duration(day.regularStartTime)
            }

            if (moment.duration(day.startTime) < minTime) {
              minTime = moment.duration(day.startTime)
            }

            // Max time is latest regular day or special day working end time
            if ('regularEndTime' in day && moment.duration(day.regularEndTime) > maxTime) {
              maxTime = moment.duration(day.regularEndTime)
            }

            if (moment.duration(day.endTime) > maxTime) {
              maxTime = moment.duration(day.endTime)
            }

            // Set Global Business Hours
            if (typeof businessHours[day.dayIndex].start === 'undefined' || moment.duration(day.startTime) < businessHours[day.dayIndex].start) {
              businessHours[day.dayIndex].start = moment.duration(day.startTime)
            }

            if (typeof businessHours[day.dayIndex].end === 'undefined' || moment.duration(day.endTime) > businessHours[day.dayIndex].end) {
              businessHours[day.dayIndex].end = moment.duration(day.endTime)
            }

            if (day.timeOutList.length) {
              let sortedBreaks = day.timeOutList.sort((a, b) => {
                return moment.duration(a.startTime).asMilliseconds() - moment.duration(b.startTime).asMilliseconds()
              })

              businessHours[day.dayIndex] = {
                start: moment.duration(day.startTime),
                end: moment.duration(sortedBreaks[0].startTime),
                dow: [day.dayIndex === 7 ? 0 : day.dayIndex]
              }

              for (let breakIndex = 0; breakIndex < day.timeOutList.length; breakIndex++) {
                let breakEndTime = sortedBreaks[breakIndex].endTime
                let nextStartTime = breakIndex === day.timeOutList.length - 1
                  ? day.endTime : sortedBreaks[breakIndex + 1].startTime

                businessHours[breakCounter] = {
                  start: moment.duration(breakEndTime),
                  end: moment.duration(nextStartTime),
                  dow: [day.dayIndex === 7 ? 0 : day.dayIndex]
                }
                breakCounter++
              }
            }

            businessHours[day.dayIndex].dow = day.dayIndex === 7 ? [0] : [day.dayIndex]
          }
        }

        // In case there is no employee working hours, set that there is no working hours
        // if view is month, set all days as working days because dayRender method will disable non working dates
        if (this.$refs.calendar.fireMethod('getView').name === 'month' || businessHours.length === 0) {
          minTime = moment.duration('00:00:00')
          maxTime = moment.duration('24:00:00')
          businessHours = {
            dow: [0, 1, 2, 3, 4, 5, 6],
            start: moment.duration('00:00:00'),
            end: moment.duration('00:00:00')
          }
        } else if (this.minTimeInSeconds !== null && this.maxTimeInSeconds !== null) {
          if (this.minTimeInSeconds < minTime.asSeconds()) {
            minTime = moment.duration(
              this.secondsToTimeSelectStep(
                this.minTimeInSeconds >= 3600 ? this.minTimeInSeconds - 3600 : this.minTimeInSeconds
              ) + ':00'
            )
          }

          if (this.maxTimeInSeconds > maxTime.asSeconds()) {
            maxTime = moment.duration(
              this.secondsToTimeSelectStep(
                this.maxTimeInSeconds <= 86400 - 3600 ? this.maxTimeInSeconds + 3600 : 86400
              ) + ':00'
            )
          }
        }

        // Change fullcalendar options dynamically
        this.$refs.calendar.fireMethod('option', {
          businessHours: _.compact(businessHours),
          minTime: minTime,
          maxTime: maxTime
        })

        this.globalBusinessHours = businessHours

        // Init v-calendar again because fullcalendar is rerendered
        this.initVCalendar()
      },

      canWriteAppointments (providerId = null) {
        return (this.$root.settings.role === 'customer' && this.$root.settings.roles.allowCustomerReschedule) || this.$root.settings.role === 'admin' || this.$root.settings.role === 'manager' ||
            (this.$root.settings.role === 'provider' && this.$root.settings.roles.allowWriteAppointments &&
                (providerId ? providerId === this.currentUser.id : true))
      },

      canWriteEvents () {
        return this.$root.settings.role === 'admin' || this.$root.settings.role === 'manager' || (this.$root.settings.role === 'provider' && this.$root.settings.roles.allowWriteEvents)
      },

      dayRender (date, cell) {
        let isDayOff = false
        let isSpecialDay = false
        let isRegularDay = false
        let fixDay = true

        let minAvailableDate = moment(this.$root.settings.slotDateConstraints.minDate, 'YYYY-MM-DD')
        let maxAvailableDate = moment(this.$root.settings.slotDateConstraints.maxDate, 'YYYY-MM-DD')

        let dayIndex = date.isoWeekday()

        // don't use parsed employees for month view because days are set based on week day index
        let employees = this.$root.settings.role !== 'customer' ? this.options.entities.employees : this.options.entities.employees.filter(employee => this.customerEmployees.indexOf(employee.id) !== -1)

        let that = this

        // If employee filter is selected take just filtered employees in count
        if (this.params.providers.length !== 0) {
          let employeesToRemove = []

          for (let i = 0; i < employees.length; i++) {
            if (_.indexOf(this.params.providers, employees[i].id) === -1) {
              employeesToRemove.push(employees[i])
            }
          }

          employees = _.difference(employees, employeesToRemove)
        }

        employees.forEach(function (employee) {
          let employeeDayIndex = employee.weekDayList.find(day => day.dayIndex === dayIndex)

          if (typeof employeeDayIndex !== 'undefined' && employeeDayIndex.dayIndex === dayIndex) {
            isRegularDay = true
          }

          employee.specialDayList.forEach(function (specialDays) {
            if (date.isSameOrAfter(moment(specialDays.startDate + ' 00:00:00', 'YYYY-MM-DD HH:ii:ss')) && date.isSameOrBefore(moment(specialDays.endDate + ' 24:00:00', 'YYYY-MM-DD HH:ii:ss'))) {
              isSpecialDay = true
            }
          })

          if (that.getEmployeeDaysOffDates(employee.dayOffList).indexOf(date.format('YYYY-MM-DD')) !== -1) {
            isDayOff = true
          }

          if (!((!isRegularDay && !isSpecialDay) || isDayOff || ((date.isBefore(minAvailableDate) || date.isAfter(maxAvailableDate)) && that.$root.settings.role === 'customer'))) {
            fixDay = false
          }
        })

        if (fixDay) {
          cell.addClass('fc-nonbusiness')
          cell.addClass('fc-bgevent')
          cell.removeClass('fc-today')
        }
      },

      createEmployeesBackgroundEvents (employees) {
        let that = this
        let dayInfo = {}

        let view = this.$refs.calendar.fireMethod('getView')
        let startDate = view.start.clone()
        let endDate = view.end.clone().subtract(1, 'days')

        let dates = []

        // get range dates
        while (startDate.isSameOrBefore(endDate)) {
          dates[startDate.day()] = startDate.format('YYYY-MM-DD')
          startDate.add(1, 'days')
        }

        let dayIndex = null

        this.globalBusinessHours.forEach(function (day) {
          dayIndex = day.dow[0]

          if (!(dayIndex in dayInfo)) {
            dayInfo[dayIndex] = {}
          }

          dayInfo[dayIndex].dayStart = moment.utc(day.start.as('milliseconds')).format('HH:mm:ss')
          dayInfo[dayIndex].dayEnd = moment.utc(day.end.as('milliseconds')).format('HH:mm:ss')
        })

        let isSingleEmployee = this.customerEmployees.length === 1

        employees.forEach(function (employee) {
          let employeeDayInfo = JSON.parse(JSON.stringify(dayInfo))

          employee.weekDayList.forEach(function (day) {
            dayIndex = day.dayIndex === 7 ? 0 : day.dayIndex

            if (!(dayIndex in employeeDayInfo)) {
              employeeDayInfo[dayIndex] = {}
            }

            employeeDayInfo[dayIndex].employeeStart = day.startTime
            employeeDayInfo[dayIndex].employeeEnd = day.endTime
          })

          for (let key in employeeDayInfo) {
            let isWorkingOnDay = (employee.id in that.employeesResources) && (key in that.employeesResources[employee.id])

            if (isWorkingOnDay) {
              // create unavailable event because employee is not providing services in this time
              that.employeesResources[employee.id][key].scheduled.forEach(function (intervalParts) {
                intervalParts.parts.forEach(function (intervalPart) {
                  that.createBackgroundEvent(true, dates[key], intervalPart.start, intervalPart.end, employee.id, intervalParts.services)
                })
              })

              // create unavailable event because employee is not working in this time
              that.employeesResources[employee.id][key].unavailable.forEach(function (interval) {
                that.createBackgroundEvent(!isSingleEmployee, dates[key], interval.start, interval.end, employee.id, [])
              })
            }

            if (!('employeeStart' in employeeDayInfo[key]) || !('employeeEnd' in employeeDayInfo[key])) {
              // create unavailable event because employee is not working in this day
              that.createBackgroundEvent(!isSingleEmployee, dates[key], employeeDayInfo[key].dayStart, employeeDayInfo[key].dayEnd, employee.id, [])
            } else {
              if (moment.duration(employeeDayInfo[key].employeeStart) > moment.duration(employeeDayInfo[key].dayStart)) {
                // create unavailable event because employee is not working in this time
                that.createBackgroundEvent(!isSingleEmployee, dates[key], employeeDayInfo[key].dayStart, employeeDayInfo[key].employeeStart, employee.id, [])
              }

              if (moment.duration(employeeDayInfo[key].employeeEnd) < moment.duration(employeeDayInfo[key].dayEnd)) {
                // create unavailable event because employee is not working in this time
                that.createBackgroundEvent(!isSingleEmployee, dates[key], employeeDayInfo[key].employeeEnd, employeeDayInfo[key].dayEnd, employee.id, [])
              }
            }
          }
        })
      },

      createBackgroundEvent (hasClass, date, start, end, employeeId, serviceIds) {
        let classNames = []

        // set selectors for all but serviceIds
        if (serviceIds.length && hasClass) {
          serviceIds.forEach(function (serviceId) {
            classNames.push('am-ebe-' + employeeId + '-' + serviceId)
          })
        }

        this.events.push({
          start: moment(date + ' ' + start, 'YYYY-MM-DD HH:mm:ss'),
          end: moment(date + ' ' + end, 'YYYY-MM-DD HH:mm:ss'),
          color: '#d7d7d7',
          borderColor: '#d7d7d7',
          rendering: 'background',
          className: !hasClass ? '' : (serviceIds.length ? 'am-ebe ' + (classNames.join(' ')) : 'am-ebe am-ebe-' + employeeId),
          type: 'fake'
        })
      },

      eventDragStart (event) {
        jQuery('.am-ebe-' + event.employeeId).css('display', 'block')

        _.difference(this.customerServices, [event.serviceId]).forEach(function (serviceId) {
          jQuery('.am-ebe-' + event.employeeId + '-' + serviceId).css('display', 'block')
        })
      },

      eventDragStop (event) {
        jQuery('.am-ebe-' + event.employeeId).css('display', 'none')

        _.difference(this.customerServices, [event.serviceId]).forEach(function (serviceId) {
          jQuery('.am-ebe-' + event.employeeId + '-' + serviceId).css('display', 'none')
        })
      },

      openRecurringAppointment (id) {
        this.dialogAppointment = false

        setTimeout(() => {
          this.showDialogEditAppointment(id)
        }, 200)
      }
    },

    computed: {
      config () {
        return {
          eventDragStart: (event) => {
            this.eventDragStart(event)
          },
          eventDragStop: (event) => {
            this.eventDragStop(event)
          },
          dayRender: this.dayRender,
          locale: this.$root.locale,
          buttonText: {
            today: this.$root.labels.today,
            month: this.$root.labels.month,
            week: this.$root.labels.week,
            day: this.$root.labels.day,
            list: this.$root.labels.list,
            timelineDay: this.$root.labels.timeline
          },
          allDaySlot: false,
          businessHours: {},
          defaultView: 'agendaWeek',
          displayEventEnd: true,
          displayEventTime: true,
          editable: true,
          eventDurationEditable: false,
          eventLimit: 2,
          eventLimitClick: 'day',
          filterResourcesWithEvents: true,
          firstDay: this.$root.settings.wordpress.startOfWeek,
          header: {
            left: 'prev, today, next',
            center: 'title',
            right: 'month, agendaWeek, day, listWeek, timelineDay'
          },
          listDayAltFormat: '',
          noEventsMessage: this.$root.labels.no_appointments_to_display,
          nowIndicator: this.$root.settings.role !== 'customer',
          resources: (callback) => {
            callback(this.resources)
          },
          resourceLabelText: this.$root.labels.employees,
          schedulerLicenseKey: '0395133833-fcs-1528299690',
          selectable: false,
          slotEventOverlap: false,
          slotDuration: this.secondsToTimeSelectStep(this.$root.settings.general.timeSlotLength),
          slotLabelInterval: this.secondsToTimeSelectStep(this.$root.settings.general.timeSlotLength),
          slotLabelFormat: '',
          timeFormat: '',
          viewRender: this.callViewRender,
          views: {
            month: {},
            week: {
              columnFormat: ''
            },
            day: {
              titleFormat: '',
              type: 'agenda',
              duration: {days: 1},
              buttonText: 'day'
            },
            timelineDay: {
              type: 'timelineDay',
              buttonText: 'timeline',
              displayEventTime: false,
              slotLabelFormat: ''
            }
          }
        }
      }
    },

    components: {
      GetPremiumBanner,
      PageHeader,
      FullCalendar,
      DialogEvent,
      DialogAppointment,
      DialogCustomer,
      DialogPayment
      // DialogNewCustomize
    }

  }
</script>
