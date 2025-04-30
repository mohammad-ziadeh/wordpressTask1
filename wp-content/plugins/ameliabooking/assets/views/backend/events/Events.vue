<template>
  <div class="am-wrap">
    <div id="am-events" class="am-body">

      <!-- Page Header -->
      <page-header
          @newEventBtnClicked="showDialogNewEvent"
      >
      </page-header>

      <!-- Spinner -->
      <div class="am-spinner am-section" style="display: none">
        <img :src="$root.getUrl+'public/img/spinner.svg'"/>
      </div>

      <!-- Empty State -->
      <EmptyState
        :visible="fetched && Object.keys(eventsDay).length === 0 && !filterApplied && fetchedFiltered && options.fetched"
        :title="$root.labels.no_events_yet"
        :description="$root.labels.click_add_events"
      >
      </EmptyState>

      <!-- Events -->
      <div
          v-show="(Object.keys(eventsDay).length !== 0 || (Object.keys(eventsDay).length === 0 && filterApplied) || !fetchedFiltered)">

        <!-- Search & Filter -->
        <div class="am-events-filter am-section">
          <el-form class="" method="POST">

            <!-- Global Search & Date Picker -->
            <el-row :gutter="16">
              <el-col :md="5" class="v-calendar-column">
                <el-form-item prop="dates">
                  <v-date-picker
                      @input="changeRange"
                      v-model="params.dates"
                      :is-double-paned="false"
                      mode='range'
                      popover-visibility="focus"
                      popover-direction="bottom"
                      popover-align="left"
                      tint-color='#1A84EE'
                      :show-day-popover=false
                      :input-props='{class: "el-input__inner"}'
                      :is-expanded=false
                      :is-required=true
                      input-class="el-input__inner"
                      :formats="vCalendarFormats"
                  >
                  </v-date-picker>
                  <span
                    v-if="!singleDatesViewActive && params.dates"
                    class="am-v-date-picker-suffix el-input__suffix-inner"
                    @click="clearDateFilter"
                  >
                    <i class="el-select__caret el-input__icon el-icon-circle-close"></i>
                  </span>
                </el-form-item>
              </el-col>

              <el-col :md="5">
                <div class="am-search">
                  <el-form-item>

                    <!-- Search -->
                    <el-input
                        class=""
                        :placeholder="$root.labels.event_search_placeholder"
                        v-model="params.search"
                    >
                    </el-input>

                  </el-form-item>
                </div>
              </el-col>

              <!-- Customer Filter -->
              <el-col :md="4 + (options.entities.locations.length > 0 ? 0 : 4) + (options.entities.tags.length > 0 ? 0 : 4)">
                <el-form-item>
                  <el-select
                      v-model="params.customerId"
                      filterable
                      clearable
                      :placeholder="$root.labels.attendee"
                      @change="changeFilter"
                      remote
                      :remote-method="searchCustomers"
                      :loading="loadingCustomers"
                  >
                    <el-option
                        v-for="(item, key) in searchedCustomers.length ? searchedCustomers : options.entities.customers"
                        :key="key"
                        :label="item.firstName + ' ' + item.lastName"
                        :value="item.id"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>

              <!-- Location Filter -->
              <el-col v-if="options.entities.locations.length > 0" :md="4">
                <el-form-item>
                  <el-select
                      v-model="params.locationId"
                      filterable
                      clearable
                      :placeholder="$root.labels.location"
                      @change="changeFilter"
                  >
                    <el-option
                        v-for="(item, key) in options.entities.locations"
                        :key="key"
                        :label="item.name"
                        :value="item.id"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>

              <!-- Tag Filter -->
              <el-col v-if="options.entities.tags.length > 0" :md="4" class="am-tag-filter">
                <el-form-item>
                  <el-select
                      v-model="params.tag"
                      filterable
                      clearable
                      :placeholder="$root.labels.tag"
                      @change="changeFilter"
                  >
                    <el-option
                        v-for="(item, key) in options.entities.tags"
                        :key="key"
                        :label="item"
                        :value="item"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>

              <el-col :md="2" class="am-grid-view-filter">
                <!-- Content View -->
                <div class="am-filter-buttons">
                  <el-tooltip class="item" effect="dark" :content="$root.labels.view_list" placement="top">
                    <el-button
                      :title="$root.labels.view_list"
                      @click="singleDates"
                      class="am-button-icon change-view"
                      :class="{active:singleDatesViewActive}"
                    >
                      <img class="svg-amelia" alt="Table View" :src="$root.getUrl+'public/img/list-view.svg'"/>
                    </el-button>
                  </el-tooltip>
                  <el-tooltip class="item" effect="dark" :content="$root.labels.view_group" placement="top">
                    <el-button
                      :title="$root.labels.view_group"
                      @click="groupDates"
                      class="am-button-icon change-view"
                      :class="{active:groupDatesViewActive}"
                    >
                      <i class="el-icon-date"></i>
                    </el-button>
                  </el-tooltip>
                </div>
              </el-col>

            </el-row>
          </el-form>
        </div>

        <!-- No Results -->
        <div class="am-empty-state am-section" style="display: none"
             v-show="fetched && Object.keys(eventsDay).length === 0 && filterApplied && fetchedFiltered && options.fetched">
          <img :src="$root.getUrl + 'public/img/emptystate.svg'">
          <h2>{{ $root.labels.no_results }}</h2>
        </div>

        <!-- Content Spinner -->
        <div class="am-spinner am-section" v-show="!fetched || !fetchedFiltered || !options.fetched">
          <img :src="$root.getUrl + 'public/img/spinner.svg'"/>
        </div>

        <!-- Event List -->
        <div class="am-events am-section"
             v-show="fetchedFiltered && options.fetched && Object.keys(eventsDay).length !== 0">

          <!-- Events List Header -->
          <div class="am-events-list-head">
            <el-row :style="{width: singleDatesViewActive ? '' : '98%'}">
              <el-col :lg="11">
                <el-row :gutter="10" class="am-events-flex-row-middle-align">

                  <!-- Events List Checkbox -->
                  <el-col :lg="6">
                    <p>
                    </p>
                  </el-col>

                  <!-- Event List Name -->
                  <el-col :lg="7">
                    <p>{{ $root.labels.event_name }}</p>
                  </el-col>

                  <!-- Event List Location -->
                  <el-col :lg="4" class="am-event-location">
                    <p>{{ $root.labels.event_location }}</p>
                  </el-col>

                  <!-- Event Organizer -->
                  <el-col :lg="3">
                    <p>{{ $root.labels.event_organizer + ':'}}</p>
                  </el-col>

                  <!-- Event List Spots -->
                  <el-col :lg="3">
                    <p class="am-event-spots">{{ $root.labels.booked + ':'}}</p>
                  </el-col>

                  <!-- Event List Recurring -->
                  <el-col :lg="4">
                    <p>{{ $root.labels.event_recurring }}</p>
                  </el-col>

                </el-row>
              </el-col>

              <el-col :lg="13">
                <el-row :gutter="10" class="am-events-flex-row-middle-align">
                  <el-col :lg="0" :md="3">
                  </el-col>

                  <!-- Event List Booking Opens -->
                  <el-col :lg="6">
                    <p>{{ $root.labels.event_booking_opens }}</p>
                  </el-col>

                  <!-- Event List Booking Closes -->
                  <el-col :lg="6">
                    <p>{{ $root.labels.event_booking_closes }}</p>
                  </el-col>

                  <!--Event List Status -->
                  <el-col :lg="3">
                    <p>{{ $root.labels.status_colon }}</p>
                  </el-col>

                  <!--Event List Actions -->
                  <el-col v-if="canManage()" :lg="9">
                  </el-col>

                  <!-- Zoom Link (For Customer) -->
                  <el-col v-if="$root.settings.zoom.enabled && $root.settings.role === 'customer'" :lg="9">
                    <p>{{ $root.labels.zoom_join_link }}</p>
                  </el-col>
                  <!-- /Zoom Link (For Customer) -->

                </el-row>
              </el-col>

            </el-row>
          </div>

          <!-- Events List Content -->
          <div v-for="(evtDay, evtDateKey) in singleDatesViewActive ? eventsDay : [eventsPeriod]">

            <!-- Events Day -->
            <div class="am-events-list-day-title" v-if="singleDatesViewActive">
              <el-row>
                <el-col :span="24">
                  <h2>

                    <!-- Events Checkbox For Day -->
                    {{ handleDateTimeFormat(evtDay.date + ' 00:00:00')[0] }}
                  </h2>
                </el-col>
              </el-row>
            </div>

            <!-- Events -->
            <div class="am-events-list">
              <div
                v-if="singleDatesViewActive"
                v-for="(evt, index) in evtDay.events"
                :key="index"
                class="am-event"
              >
                <event-list-item
                  :evt="evt"
                  :singleDatesViewActive="singleDatesViewActive"
                  :groupDatesViewActive="groupDatesViewActive"
                  :employees="options.entities.employees"
                  @showDialogEditEvent="(id) => {showDialogEditEvent(id)}"
                  @showDialogAttendees="(id) => {showDialogAttendees(id)}"
                >
                </event-list-item>
              </div>
              <el-collapse v-if="!singleDatesViewActive">
                <el-collapse-item
                  v-for="(evt, index) in eventsPeriod"
                  :name="index"
                  :key="index"
                  class="am-event"
                >
                  <template slot="title">
                    <event-list-item
                      style="width: 98%;"
                      :evt="evt"
                      :singleDatesViewActive="singleDatesViewActive"
                      :groupDatesViewActive="groupDatesViewActive"
                      :employees="options.entities.employees"
                      @showDialogEditEvent="(id) => {showDialogEditEvent(id)}"
                      @showDialogAttendees="(id) => {showDialogAttendees(id)}"
                    >
                    </event-list-item>
                  </template>

                  <div style="border-top: 1px solid #E2E6EC; margin: 16px 0;">
                    <div
                      v-for="(period, index) in getEventPeriods(evt.periods)"
                      :key="index"
                    >
                    <span>
                      {{ period.dateOfMonth }}
                    </span>
                      <span>
                      : {{ period.timeStart }} - {{ period.timeEnd }}
                    </span>
                    </div>
                  </div>
                </el-collapse-item>
              </el-collapse>
            </div>
          </div>

          <!-- Pagination -->
          <pagination-block
            v-if="groupDatesViewActive"
            :params="paginationParams"
            :show="paginationParams.show"
            :count="totalPeriodEvents"
            :label="$root.labels.events.toLowerCase()"
            :visible="totalPeriodEvents > paginationParams.show"
            @change="getEvents"
          >
          </pagination-block>
        </div>

      </div>

      <!-- Button New -->
      <div id="am-button-new" class="am-button-new" v-if="canManage()">
        <el-button
            id="am-plus-symbol"
            type="primary"
            icon="el-icon-plus"
            @click="showDialogNewEvent">
        </el-button>
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
              :settings="options.entities.settings"
              :selectedTimeZone="selectedTimeZone"
              @closeDialog="closeDialogEvent"
              @saveCallback="saveEventCallback"
              @showDialogTranslate="showDialogTranslate"
              @duplicateCallback="duplicateEventCallback"
          >
          </dialog-event>
        </el-dialog>
      </transition>


      <!-- Dialog Attendees -->
      <transition name="slide">
        <el-dialog
            :close-on-click-modal="false"
            class="am-side-dialog am-dialog-event"
            :show-close="false"
            :visible.sync="dialogAttendees"
            v-if="dialogAttendees && event && eventBookings"
        >
          <dialog-attendees
              :customTickets="event.customTickets"
              :eventBookings="eventBookings"
              :bookingCreatedCount="bookingCreatedCount"
              :options="options"
              :popperAppendToBody="true"
              :eventStatus="event.status"
              :customersNoShowCount="customersNoShowCount"
              :aggregated-price="event.aggregatedPrice"
              :event="event"
              @closeDialog="closeDialogAttendees"
              @updateAttendeesCallback="updateAttendeesCallback"
              @showDialogAttendee="showDialogAttendee"
              @openExportAttendeesDialog="dialogExport = true"
          >
          </dialog-attendees>
        </el-dialog>
      </transition>


      <!-- Dialog Attendee -->
      <transition name="slide">
        <el-dialog
            :close-on-click-modal="false"
            class="am-side-dialog am-dialog-event"
            :show-close="false"
            :visible.sync="dialogEventCustomFields"
            v-if="dialogEventCustomFields && event && eventBooking"
        >
          <dialog-attendee
              :cloned-event-booking="clonedEventBooking"
              :payment-links-enabled="paymentLinksEnabled"
              :customTickets="event.customTickets"
              :eventBooking="eventBooking"
              :eventCustomPricing="event.customPricing"
              :eventCustomerIds="eventCustomerIds"
              :eventBookMultipleTimes = "eventBookMultipleTimes"
              :eventMaxCapacity="event.maxCapacity"
              :eventId="event.id"
              :options="options"
              :customerCreatedCount="customerCreatedCount"
              :popperAppendToBody="true"
              :isWaitingList="event.settings.waitingList.enabled"
              @closeDialog="closeDialogAttendee"
              @showDialogNewCustomer="showDialogNewCustomer"
              @saveCallback="saveAttendeeCallback"
          >
          </dialog-attendee>
        </el-dialog>
      </transition>

      <!-- Dialog New Customer -->
      <transition name="slide">
        <el-dialog
            :close-on-click-modal="false"
            class="am-side-dialog"
            :visible.sync="dialogCustomer"
            :show-close="false"
            v-if="dialogCustomer">
          <dialog-customer
              :customer="customer"
              @closeDialog="dialogCustomer=false"
              @saveCallback="saveCustomerCallback"
          >
          </dialog-customer>
        </el-dialog>
      </transition>

      <el-form v-if="event && event.id" :action="exportAction" method="POST">
        <!-- Dialog Export -->
        <transition name="slide">
          <el-dialog
              :close-on-click-modal="false"
              class="am-side-dialog am-dialog-export"
              :visible.sync="dialogExport"
              :show-close="false"
              v-if="dialogExport"
          >
            <dialog-export
                :data="Object.assign(exportParams, {id: event.id})"
                :action="$root.getAjaxUrl + '/report/event/attendees'"
                @updateAction="(action) => {this.exportAction = action}"
                @closeDialogExport="dialogExport = false"
            >
            </dialog-export>
          </el-dialog>
        </transition>
      </el-form>

      <!-- Dialog Translate -->
      <transition name="slide">
        <el-dialog
          :close-on-click-modal="false"
          class="am-side-dialog am-dialog-translate am-edit"
          :show-close="true"
          :visible.sync="dialogTranslate"
          v-if="dialogTranslate"
        >
          <dialog-translate
            :passed-translations="event.translations"
            :name="event.name"
            :used-languages="options.entities.settings.general.usedLanguages"
            :all-languages-data="languagesData"
            :type="dialogTranslateType"
            :eventTickets="eventTickets"
            :tab="eventTickets && eventTickets.length ? 'tickets' : 'event'"
            @saveDialogTranslate="saveDialogTranslate"
            @closeDialogTranslate="dialogTranslate = false"
          >
          </dialog-translate>
        </el-dialog>
      </transition>

      <!-- Help Button -->
      <el-col :md="6" class="">
        <a class="am-help-button" href="https://wpamelia.com/events/" target="_blank" rel="nofollow">
          <i class="el-icon-question"></i> {{ $root.labels.need_help }}?
        </a>
      </el-col>

<!--      <dialog-new-customize></dialog-new-customize>-->

    </div>
  </div>
</template>

<script>
  import backendEventMixin from '../../../js/backend/mixins/eventMixin'
  import commonEventMixin from '../../../js/common/mixins/eventMixin'
  import dateMixin from '../../../js/common/mixins/dateMixin'
  import EventListItem from './EventListItem'
  import DialogEvent from './DialogEvent'
  import DialogAttendees from './DialogAttendees'
  import DialogAttendee from './DialogAttendee'
  import PaginationBlock from '../parts/PaginationBlock.vue'
  import durationMixin from '../../../js/common/mixins/durationMixin'
  import entitiesMixin from '../../../js/common/mixins/entitiesMixin'
  import Form from 'form-object'
  import helperMixin from '../../../js/backend/mixins/helperMixin'
  import imageMixin from '../../../js/common/mixins/imageMixin'
  import moment from 'moment'
  import notifyMixin from '../../../js/backend/mixins/notifyMixin'
  import PageHeader from '../parts/PageHeader.vue'
  import DialogCustomer from '../customers/DialogCustomer.vue'
  import customerMixin from '../../../js/backend/mixins/customerMixin'
  import DialogExport from '../parts/DialogExport.vue'
  import DialogTranslate from '../parts/DialogTranslate'
  import VueCookies from 'vue-cookies'
  // import DialogNewCustomize from '../parts/DialogNewCustomize.vue'

  export default {
    mixins: [entitiesMixin, imageMixin, dateMixin, durationMixin, notifyMixin, helperMixin, backendEventMixin, commonEventMixin, customerMixin],

    data () {
      return {
        paymentLinksEnabled: null,
        customersNoShowCount: [],
        singleDatesViewActive: true,
        groupDatesViewActive: false,
        paginationParams: {
          page: 1,
          show: this.$root.settings.general.itemsPerPageBackEnd
        },
        totalPeriodEvents: 0,
        exportAction: '',
        exportParams: {
          fields: [
            {label: this.$root.labels.first_name, value: 'firstName', checked: true},
            {label: this.$root.labels.last_name, value: 'lastName', checked: true},
            {label: this.$root.labels.email, value: 'email', checked: true},
            {label: this.$root.labels.phone, value: 'phone', checked: true},
            {label: this.$root.labels.gender, value: 'gender', checked: true},
            {label: this.$root.labels.date_of_birth, value: 'birthday', checked: true},
            {label: this.$root.labels.payment_amount, value: 'paymentAmount', checked: true},
            {label: this.$root.labels.payment_status, value: 'paymentStatus', checked: true},
            {label: this.$root.labels.payment_method, value: 'paymentMethod', checked: true},
            {label: this.$root.labels.customer_note, value: 'note', checked: true},
            {label: this.$root.labels.event_book_persons, value: 'persons', checked: true},
            {label: this.$root.labels.event_book_status, value: 'status', checked: true},
            {label: this.$root.labels.event_book_tickets, value: 'tickets', checked: true},
            {label: this.$root.labels.coupon_code, value: 'couponCode', checked: true},
            {label: this.$root.labels.custom_fields, value: 'customFields', checked: true}
          ]
        },
        dialogExport: false,
        event: null,
        eventBookings: null,
        eventBooking: null,
        clonedEventBooking: null,
        eventsDay: {},
        eventsPeriod: [],
        customer: null,
        customerCreatedCount: 0,

        dialogEvent: false,
        dialogCustomer: false,
        dialogAttendees: false,
        dialogEventCustomFields: false,

        fetched: false,
        fetchedFiltered: false,

        form: new Form(),
        params: {
          dates: this.getDatePickerInitRange(),
          search: '',
          customerId: null,
          locationId: null,
          tag: null
        },

        timer: null,
        count: {
          success: 0,
          error: 0
        },
        dialogTranslate: false,
        dialogTranslateType: 'name',
        eventTickets: null,
        selectedTimeZone: '',
        languagesData: []
      }
    },

    created () {
      Form.defaults.axios = this.$http

      // Set filter params based on URL GET fields
      let urlParams = this.getUrlQueryParams(window.location.href)

      if (!('dateFrom' in urlParams) || !('dateTo' in urlParams)) {
        this.params.dates = this.getDatePickerInitRange()
      } else {
        this.params.dates = {
          start: moment(urlParams['dateFrom']).toDate(),
          end: moment(urlParams['dateTo']).toDate()
        }
      }

      if (urlParams['customerId']) {
        this.params.dates = null
        this.params.customerId = urlParams['customerId']
      }

      this.getEventOptions(true)

      this.setInitialCustomers()
    },

    mounted () {
      let viewType = VueCookies.get('ameliaEventsView')

      if (viewType === 'groupDates' || this.$root.settings.activation.isNewInstallation) {
        this.singleDatesViewActive = false
        this.groupDatesViewActive = true
      } else {
        this.singleDatesViewActive = true
        this.groupDatesViewActive = false
      }

      if (this.$root.settings.payments.wc && this.$root.settings.payments.wc.enabled) {
        this.exportParams.fields.splice(8, 0, {label: this.$root.labels.wc_order_id, value: 'wcOrderId', checked: true})
      }
    },

    methods: {
      clearDateFilter () {
        this.params.dates = null

        this.paginationParams.page = 1

        this.changeFilter()
      },

      getEventMaxCapacity (tickets) {
        let capacity = 0
        tickets.forEach(ticket => {
          capacity += ticket.spots
        })
        return capacity
      },

      canManage () {
        return this.$root.settings.role !== 'customer' && (this.$root.settings.role === 'admin' || this.$root.settings.role === 'manager' || (this.$root.settings.role === 'provider' && this.$root.settings.roles.allowWriteEvents))
      },

      updateAttendeesCallback () {
        this.getEvents()
      },

      duplicateEventCallback (entity) {
        this.event = entity
        this.event.id = 0
        this.event.duplicated = true
        this.event.periods.forEach((period) => {
          period.googleCalendarEventId = null
          period.googleMeetUrl = null
          period.outlookCalendarEventId = null
          period.microsoftTeamsUrl = null
          period.appleCalendarEventId = null
        })

        setTimeout(() => {
          this.dialogEvent = true
        }, 300)
      },

      saveAttendeeCallback (response) {
        if (!('bookingStatusChanged' in response) || response.booking.persons !== this.clonedEventBooking.persons) {
          this.$http.post(`${this.$root.getAjaxUrl}/bookings/success/` + response.booking.id, {
            type: 'event',
            appointmentStatusChanged: response.appointmentStatusChanged,
            paymentId: 'paymentId' in response && response.paymentId ? response.paymentId : null,
            customer: response.booking.customer
          }).then(response => {
          }).catch(e => {
          })
        }

        this.getEvents()
        this.getEvent(response.event.id)
      },

      showDialogNewCustomer () {
        this.customer = this.getInitCustomerObject()
        this.dialogCustomer = true
      },

      saveCustomerCallback (response) {
        delete response.user['birthday']

        this.options.entities.customers.push(response.user)
        this.customerCreatedCount++
      },

      saveEventCallback () {
        if (this.$root.settings.role !== 'provider') {
          this.$http.post(`${this.$root.getAjaxUrl}/settings`, {usedLanguages: this.options.entities.settings.general.usedLanguages})
            .catch((e) => {
              console.log(e)
            })
        }

        this.getEvents()
      },

      changeRange () {
        this.setDatePickerSelectedDaysCount(this.params.dates.start, this.params.dates.end)

        this.changeFilter()
      },

      getEventPeriods (eventPeriods) {
        let periodsArr = []

        eventPeriods.forEach((period) => {
          let periodStartDate = moment(period.periodStart.split(' ')[0], 'YYYY-MM-DD')
          let periodEndDate = moment(period.periodEnd.split(' ')[0], 'YYYY-MM-DD')
          let periodStartTime = moment(period.periodStart.split(' ')[1], 'HH:mm:ss').format('HH:mm:ss')
          let periodEndTime = moment(period.periodEnd.split(' ')[1], 'HH:mm:ss').format('HH:mm:ss')

          if (periodEndTime === '00:00:00') {
            periodEndTime = '24:00:00'
            periodEndDate.subtract(1, 'days')
          }

          if (periodStartDate.diff(periodEndDate, 'days') < 0) {
            let periodDates = []

            while (periodStartDate.isSameOrBefore(periodEndDate)) {
              periodDates.push(periodStartDate.format('YYYY-MM-DD'))
              periodStartDate.add(1, 'days')
            }

            periodDates.forEach(dayPeriod => {
              periodsArr.push({
                id: period.id,
                start: dayPeriod + ' ' + periodStartTime,
                end: dayPeriod + ' ' + periodEndTime
              })
            })
          } else {
            periodsArr.push({
              id: period.id,
              start: periodStartDate.format('YYYY-MM-DD') + ' ' + periodStartTime,
              end: periodEndDate.format('YYYY-MM-DD') + ' ' + periodEndTime
            })
          }
        })

        let periods = []

        periodsArr.sort((a, b) => moment(a.start, 'YYYY-MM-DD HH:mm:ss') - moment(b.start, 'YYYY-MM-DD HH:mm:ss'))
          .forEach((item) => {
            periods.push({
              dateOfMonth: this.handleDateTimeFormat(item.start)[0],
              timeStart: this.handleDateTimeFormat(item.start)[1],
              timeEnd: this.handleDateTimeFormat(item.end)[1]
            })
          })

        return periods
      },

      singleDates () {
        VueCookies.set('ameliaEventsView', 'singleDates')

        if (!this.params.dates) {
          this.params.dates = this.getDatePickerInitRange()
        }

        this.singleDatesViewActive = true
        this.groupDatesViewActive = false

        this.getEvents()
      },

      groupDates () {
        VueCookies.set('ameliaEventsView', 'groupDates')

        this.singleDatesViewActive = false
        this.groupDatesViewActive = true

        this.getEvents()
      },

      changeFilter () {
        if (!this.params.customerId) {
          this.searchedCustomers = []
        }

        this.getEvents()
      },

      getEventOptions (fetchEvents) {
        this.options.fetched = false

        this.$http.get(`${this.$root.getAjaxUrl}/entities`, {
          params: this.getAppropriateUrlParams(
            {
              lite: true,
              types: ['locations', 'employees', 'tags', 'custom_fields', 'settings', 'coupons']
            }
          )
        })
          .then(response => {
            if (this.$root.settings.role !== 'customer') {
              this.options.entities.settings.general.usedLanguages = response.data.data.settings.general.usedLanguages
            }

            this.options.entities.locations = response.data.data.locations
            this.options.entities.employees = response.data.data.employees
            this.options.entities.customFields = response.data.data.customFields
            this.options.entities.customers = !('customers' in this.options.entities) || !this.options.entities.customers.length
              ? [] : this.options.entities.customers
            this.options.entities.coupons = response.data.data.coupons
            this.languagesData = response.data.data.settings.languages

            if (this.$root.settings.role === 'provider' && this.$root.settings.roles.allowWriteEvents) {
              this.selectedTimeZone = this.options.entities.employees[0].timeZone ? this.options.entities.employees[0].timeZone : ''
            }

            this.fetched = true
            this.options.fetched = true

            let $this = this

            response.data.data.tags.forEach(function (eventTag) {
              if ($this.options.entities.tags.indexOf(eventTag.name) === -1) {
                $this.options.entities.tags.push(eventTag.name)
              }
            })

            if (fetchEvents) {
              this.getEvents()
            }
          })
          .catch(e => {
            console.log(e.message)
            this.fetched = true
            this.options.fetched = true
          })
      },

      getEvents () {
        this.fetchedFiltered = false

        let params = JSON.parse(JSON.stringify(this.params))
        let dates = []

        if (params.dates) {
          if (params.dates.start) {
            dates.push(moment(params.dates.start).format('YYYY-MM-DD'))
          }

          if (params.dates.end) {
            dates.push(moment(params.dates.end).format('YYYY-MM-DD'))
          }

          params.dates = dates
        }

        if (this.groupDatesViewActive) {
          params.group = true

          params.page = this.paginationParams.page

          params.limit = this.paginationParams.show
        }

        Object.keys(params).forEach((key) => (!params[key] && params[key] !== 0) && delete params[key])

        if (this.$root.settings.role === 'provider' && this.$root.settings.roles.allowWriteEvents) {
          params.providers = this.options.entities.employees.map(employee => employee.id)
          params.timeZone = this.options.entities.employees[0].timeZone ? this.options.entities.employees[0].timeZone : null
        }

        let $this = this

        this.$http.get(`${this.$root.getAjaxUrl}/events`, {
          params: this.getAppropriateUrlParams(params)
        })
          .then(response => {
            let eventsDay = {}

            this.totalPeriodEvents = response.data.data.count

            response.data.data.events.forEach(function (event) {
              event.periods.forEach(function (eventPeriod) {
                let startDate = moment(eventPeriod.periodStart, 'YYYY-MM-DD HH:mm:ss')
                let endDate = moment(eventPeriod.periodEnd, 'YYYY-MM-DD HH:mm:ss')

                while (startDate.isBefore(endDate)) {
                  let dateString = startDate.format('YYYY-MM-DD')

                  let isInRange = $this.params.dates === null || startDate.isBetween($this.params.dates.start, $this.params.dates.end, 'days', '[]')
                  if (!(dateString in eventsDay) && isInRange) {
                    eventsDay[dateString] = {
                      date: dateString,
                      events: []
                    }
                  }

                  if (event.customTickets.length && event.customPricing) {
                    event.maxCapacity = event.maxCustomCapacity ? event.maxCustomCapacity : $this.getEventMaxCapacity(event.customTickets)
                    event.places = event.maxCapacity
                    event.customTickets.forEach(ticket => {
                      event.places -= ticket.sold
                    })
                  }

                  let eventSettings = JSON.parse(event.settings)

                  event.waitingList = eventSettings && eventSettings.waitingList ? eventSettings.waitingList
                    : {
                      ...$this.$root.settings.appointments.waitingListEvents,
                      enabled: false
                    }

                  if (event.full && event.status === 'approved') event.status = 'full'
                  else if (event.upcoming && event.status === 'approved') event.status = 'upcoming'
                  let location = event.customLocation ? event.customLocation : (event.locationId ? $this.options.entities.locations.find(l => l.id === event.locationId).name : null)

                  if (dateString in eventsDay) {
                    eventsDay[dateString].events.push({
                      id: event.id,
                      name: event.name,
                      periodStart: eventPeriod.periodStart,
                      periodEnd: eventPeriod.periodEnd,
                      bookingOpens: event.bookingOpens,
                      bookingCloses: event.bookingCloses,
                      location: location,
                      recurring: event.recurring,
                      maxCapacity: event.maxCapacity,
                      status: event.status,
                      places: event.places,
                      created: event.created,
                      opened: event.opened,
                      closed: event.closed,
                      checked: false,
                      zoomMeeting: eventPeriod.zoomMeeting,
                      translations: event.translations,
                      customTickets: event.customTickets,
                      organizerId: event.organizerId,
                      waitingList: event.waitingList
                    })
                  }

                  startDate.add(1, 'days')
                }
              })
            })

            let dateKeys = Object.keys(eventsDay)

            dateKeys.sort((date1, date2) => {
              if (date1 < date2) {
                return -1
              } else if (date1 > date2) {
                return 1
              } else {
                return 0
              }
            })

            let sortedEvents = {}

            dateKeys.forEach((dateString) => {
              sortedEvents[dateString] = eventsDay[dateString]
            })

            this.customersNoShowCount = response.data.data.customersNoShowCount

            this.eventsPeriod = response.data.data.events

            this.eventsDay = sortedEvents
            this.fetched = true
            this.fetchedFiltered = true
          })
          .catch(e => {
            console.log(e.message)
            this.fetched = true
            this.fetchedFiltered = true
          })
      },

      closeDialogAttendees () {
        this.dialogAttendees = false
      },

      showDialogAttendee (eventBooking) {
        this.eventBooking = eventBooking
        this.clonedEventBooking = JSON.parse(JSON.stringify(eventBooking))
        this.paymentLinksEnabled = this.$root.settings.payments && this.$root.settings.payments.paymentLinks ? this.$root.settings.payments.paymentLinks.enabled : false
        let eventSettings = this.event ? this.event.settings : null
        if (eventSettings && eventSettings.payments && eventSettings.payments.paymentLinks) {
          this.paymentLinksEnabled = eventSettings.payments.paymentLinks.enabled
        }
        this.dialogEventCustomFields = true
      },

      closeDialogAttendee () {
        this.dialogEventCustomFields = false
      },

      showDialogTranslate (type, tickets) {
        this.dialogTranslateType = type
        this.eventTickets = tickets
        this.dialogTranslate = true
      },

      saveDialogTranslate (translations, newLanguages, tab, options, tickets) {
        this.options.entities.settings.general.usedLanguages = this.options.entities.settings.general.usedLanguages.concat(newLanguages)

        if (tab === 'tickets') {
          this.eventTickets.forEach((item, index) => {
            item.translations = tickets[index].translations
          })
        } else {
          this.event.translations = translations
        }

        this.dialogTranslate = false
      }
    },

    computed: {
      filterApplied () {
        return !!this.params.search || !!this.params.locationId || !!this.params.dates || !!this.params.customerId || (this.params.dates && (!!this.params.dates.start || !!this.params.dates.end))
      },
      eventCustomerIds () {
        return this.eventBookings.map(event => event.customerId)
      },
      eventBookMultipleTimes () {
        return this.event.bookMultipleTimes
      }
    },

    watch: {
      'params.search' () {
        if (typeof this.params.search !== 'undefined') {
          this.fetchedFiltered = false
          clearTimeout(this.timer)
          this.timer = setTimeout(this.changeFilter, 500)
        }
      }
    },

    components: {
      EventListItem,
      DialogCustomer,
      PageHeader,
      DialogExport,
      DialogEvent,
      DialogAttendees,
      DialogAttendee,
      PaginationBlock,
      DialogTranslate
      // DialogNewCustomize
    }
  }
</script>
