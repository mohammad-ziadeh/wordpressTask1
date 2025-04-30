<template>
  <div
    class="am-customize-field"
    :class="{'editable': (editable && activeFormTab === '1')}"
    :style="{borderColor: '#000000'}"
  >
    <!-- Events -->
    <div
      v-for="(evt, index) in events"
      :key="index"
      class="am-event"
      :class="{
        'am-active': evt.showEventDetails,
        'inactive': events.filter(event => event.showEventDetails && event.id !== evt.id).length > 0,
        'canceled': getEventAvailability(evt).class === 'canceled',
        'closed': getEventAvailability(evt).class === 'closed' && !evt.showAddToCalendar,
        'full': getEventAvailability(evt).class === 'full',
        'upcoming': getEventAvailability(evt).class === 'upcoming'
      }"
      :style="{pointerEvents: evt.showAddToCalendar ? 'all' : (getEventAvailability(evt).class !== 'open' ? 'none' : 'all'), backgroundColor: customizationForm.formBackgroundColor}"
    >
      <div class="am-event-data" @click="getEventAvailability(evt).class !== 'open' ? function () {} : toggleEventDetails(evt)">

        <!-- Event Dates -->
        <div v-if="isEventInSameDay(evt)" class="am-event-date">
          <div class="am-event-date-month" :style="getBookableColor(evt, false)">
            {{ getEventFrontedFormattedDate(evt.periods[0].periodStart).split(' ')[0] }}
          </div>
          <div class="am-event-date-day" :style="{color: customizationForm.formTextColor}">
            {{ getEventFrontedFormattedDate(evt.periods[0].periodStart).split(' ')[1] }}
          </div>
        </div>

        <div v-else class="am-event-dates">
          <div>
            <div class="am-event-date-month" :style="getBookableColor(evt, false)">
              {{ getEventFrontedFormattedDate(evt.periods[0].periodStart).split(' ')[0] }}
            </div>
            <div class="am-event-date-day" :style="{color: customizationForm.formTextColor}">
              {{ getEventFrontedFormattedDate(evt.periods[0].periodStart).split(' ')[1] }}
            </div>
          </div>

          <div>
            <div class="am-event-date-month" :style="getBookableColor(evt, false)">
              {{ getEventFrontedFormattedDate(evt.periods[evt.periods.length - 1].periodEnd).split(' ')[0] }}
            </div>
            <div class="am-event-date-day" :style="{color: customizationForm.formTextColor}">
              {{ getEventFrontedFormattedDate(evt.periods[evt.periods.length - 1].periodEnd).split(' ')[1] }}
            </div>
          </div>
        </div>

        <!-- Event Info -->
        <div class="am-event-info">
          <div class="am-event-title" :style="{color: customizationForm.formTextColor}">
            {{ evt.name }}
            <span class="am-event-booking-status" :class="getEventAvailability(evt).class" >
              {{ getEventAvailability(evt).label }}
            </span>
          </div>
          <div class="am-event-sub-info">
            <div
              v-if="capacityVisibility"
              :style="{color: customizationForm.formTextColor}"
              class="am-event-sub-info-capacity"
            >
              <img class="svg-amelia" :style="{fill: customizationForm.formTextColor}" :src="$root.getUrl + 'public/img/capacity.svg'">
              <span>
                <template v-if="!languageShortCode">
                  {{`${labelCapacity.value || $root.labels.event_capacity} ${evt.maxCapacity - evt.places} / ${evt.maxCapacity}`}}
                </template>
                <template v-else>
                  {{`${labelCapacity.translations[languageShortCode] || $root.labels.event_capacity} ${evt.maxCapacity - evt.places} / ${evt.maxCapacity}`}}
                </template>
              </span>
            </div>
            <div v-if="locationVisibility" :style="{color: customizationForm.formTextColor}">
              <img :src="$root.getUrl + 'public/img/pin.svg'">
              <span>
                {{ evt.location }}
              </span>
            </div>
            <div v-if="dateTimeVisibility" :style="{color: customizationForm.formTextColor}">
              <img :src="$root.getUrl + 'public/img/clock.svg'">
              <span>
                {{ getEventDatesAndTimes(evt.periods) }}
              </span>
            </div>

            <div v-if="timeZoneVisibility" :style="{color: customizationForm.formTextColor}">
              <span>
                {{ timeZoneString }}
              </span>
            </div>
          </div>
        </div>

        <!-- Event Price -->
        <div v-if="evt.price !== 0 && eventPriceVisibility" class="am-event-price" :style="getBookableColor(evt, true)">
          {{ getFormattedPrice(evt.price, !$root.settings.payments.hideCurrencySymbolFrontend)  }}
        </div>
        <div v-if="evt.price === 0 && eventPriceVisibility" class="am-event-price am-event-free" :style="getBookableColor(evt, false)">
          <template v-if="!languageShortCode">
            {{labelEventFree.value || $root.labels.event_free}}
          </template>
          <template v-else>
            {{ labelEventFree.translations[languageShortCode] || $root.labels.event_free }}
          </template>
        </div>
      </div>

      <transition name="fade">
        <div v-show="evt.showEventDetails && activeFormTab === '1'">
          <!-- Event Details -->
          <div
            v-if="(evt.gallery && evt.gallery.length) || (evt.description && evt.description.length)"
            class="am-event-details"
          >
            <div
              v-if="evt.description && evt.description.length"
              class="am-event-about"
            >
              <div :style="{color: customizationForm.formTextColor}">
                <template v-if="!languageShortCode">
                  {{ labelAboutEvent.value || $root.labels.event_about }}
                </template>
                <template v-else>
                  {{ labelAboutEvent.translations[languageShortCode] || $root.labels.event_about }}
                </template>
              </div>
              <div v-html="evt.description" :style="{color: customizationForm.formTextColor}"></div>
            </div>
          </div>

          <!-- Event Book -->
          <div
            v-if="getEventAvailability(evt).class === 'open'"
            class="am-event-book-cta"
            :class="getEventAvailability(evt).class"
          >
            <div
              v-if="bookEventVisibility"
              :style="{color: customizationForm.formTextColor}"
              class="am-event-book-cta__inner"
            >
              <span>
                <template v-if="!languageShortCode">
                  {{ labelBookEvent.value || $root.labels.event_book }}
                </template>
                <template v-else>
                  {{ labelBookEvent.translations[languageShortCode] || $root.labels.event_book }}
                </template>
              </span>
            </div>
            <div>
              <el-form>
                <el-form-item v-if="evt.bringingAnyone">
                  <template slot="label">
                    <span :style="{color: customizationForm.formTextColor}">
                      <template v-if="!languageShortCode">
                        {{ labelPersons.value || $root.labels.event_book_persons }}
                      </template>
                      <template v-else>
                        {{ labelPersons.translations[languageShortCode] || $root.labels.event_book_persons }}
                      </template>
                    </span>
                  </template>
                  <el-input-number
                    :value="appointment.bookings[0].persons"
                    :min="1"
                    :max="evt.places"
                    @focus="inputFocus"
                    @change="setPlaces"
                    :style="{ backgroundColor: customizationForm.formInputColor, color: customizationForm.formInputTextColor, borderColor: selectInputFocus ? customization.globalColors.primaryColor : '#C0C4CC' }"
                  >
                  </el-input-number>
                </el-form-item>

                <el-form-item>
                  <el-button
                    type="primary"
                    :style="getBookableColor(evt, true)"
                    :disabled="evt.places <= 0"
                  >
                    {{$root.labels.continue}}
                  </el-button>
                </el-form-item>
              </el-form>
            </div>
          </div>
        </div>
      </transition>

      <transition name="fade">
        <div v-show="evt.showEventDetails && activeFormTab === '2'">
          <!-- Confirm Booking Form -->
          <confirm-booking-form
            :form-name="formName"
            :editable="editable"
            :language-short-code="languageShortCode"
            :event-color="evt.color"
            :customization="customization"
            :customize-display="'event'"
            :customization-form="customizationForm"
            :form-step-data="formStepData.confirmBookingForm['event']"
            @saveEdit="saveStepEdit"
            @saveDraggableEdit="saveDraggableEdit"
          ></confirm-booking-form>
          <!-- /Confirm Booking Form -->
        </div>
      </transition>

      <transition name="fade">
        <div v-show="evt.showEventDetails && activeFormTab === '3'">
          <!-- Congratulations Form -->
          <congratulations-form
            :form-name="formName"
            :editable="editable"
            :language-short-code="languageShortCode"
            :event-color="evt.color"
            :customization="customization"
            :customize-display="'event'"
            :customization-form="customizationForm"
            :form-step-data="formStepData.congratulationsForm['event']"
            @saveEdit="saveStepEdit"
          ></congratulations-form>
          <!-- /Congratulations Form -->
        </div>
      </transition>
    </div>
    <!-- /Events -->

    <!-- Edit Dialog -->
    <customize-edit-dialog
      :form-field="formField"
      :language-short-code="languageShortCode"
      @saveEdit="saveFormFiledEdit"
    >
      <template v-slot:fieldEdit>
        <span v-show="editable && activeFormTab === '1'" class="am-customize-field__edit">
          <img :src="$root.getUrl + 'public/img/am-customize-icon-edit.svg'" />
        </span>
      </template>
    </customize-edit-dialog>
    <!-- /Edit Dialog -->
  </div>
</template>

<script>
import moment from 'moment'
import dateMixin from '../../../../js/common/mixins/dateMixin'
import eventMixin from '../../../../js/common/mixins/eventMixin'
import priceMixin from '../../../../js/common/mixins/priceMixin'
import helperMixin from '../../../../js/backend/mixins/helperMixin'
import customizeEditDialog from '../dialogs/CustomizeEditDialog'
import confirmBookingForm from '../formSteps/ConfirmBookingForm'
import congratulationsForm from '../formSteps/CongratulationsForm'

export default {
  name: 'eventDetailsFormField',

  components: {
    customizeEditDialog,
    confirmBookingForm,
    congratulationsForm
  },

  mixins: [dateMixin, eventMixin, priceMixin, helperMixin],

  props: {
    formName: {
      type: String,
      required: true
    },
    editable: {
      type: Boolean,
      default: true
    },
    languageShortCode: {
      type: String,
      default: ''
    },
    activeFormTab: {
      type: String
    },
    oppositeBackgroundColor: {
      type: String,
      default: '#000'
    },
    customization: {
      type: Object
    },
    customizationForm: {
      type: Object,
      default: () => {
        return {}
      }
    },
    formStepData: {
      type: Object,
      default: () => {
        return {}
      }
    },
    formField: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },

  data () {
    return {
      events: [
        {
          id: 2,
          name: 'Event Name 2',
          status: 'approved',
          description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.',
          color: '#689BCA',
          periods: [{
            periodStart: `${moment(new Date()).add(1, 'M').format('YYYY-MM-DD')} 14:30:00`,
            periodEnd: `${moment(new Date()).add(1, 'M').add(3, 'days').format('YYYY-MM-DD')} 18:00:00`
          }],
          price: 0,
          places: 5,
          maxCapacity: 10,
          location: 'Location Name',
          bringingAnyone: true,
          bookable: true,
          opened: true,
          closed: false,
          upcoming: false,
          full: false,
          cancelable: true,
          showEventDetails: true
        },
        {
          id: 3,
          name: 'Event Name 3',
          status: 'approved',
          description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.',
          color: '#689BCA',
          periods: [{
            periodStart: `${moment(new Date()).add(1, 'M').add(7, 'days').format('YYYY-MM-DD')} 14:30:00`,
            periodEnd: `${moment(new Date()).add(1, 'M').add(7, 'days').format('YYYY-MM-DD')} 18:00:00`
          }],
          price: 10,
          places: 1,
          maxCapacity: 10,
          location: 'Location Name',
          bringingAnyone: true,
          bookable: true,
          opened: true,
          closed: false,
          upcoming: false,
          full: false,
          cancelable: true,
          showEventDetails: false
        },
        {
          id: 1,
          name: 'Event Name 1',
          status: 'approved',
          description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.',
          color: '#689BCA',
          periods: [{
            periodStart: `${moment(new Date()).add(1, 'M').format('YYYY-MM-DD')} 14:30:00`,
            periodEnd: `${moment(new Date()).add(1, 'M').add(3, 'days').format('YYYY-MM-DD')} 18:00:00`
          }],
          price: 0,
          places: 0,
          maxCapacity: 10,
          location: 'Location Name',
          bringingAnyone: true,
          bookable: false,
          opened: false,
          closed: true,
          upcoming: false,
          full: false,
          cancelable: true,
          showEventDetails: false
        },
        {
          id: 4,
          name: 'Event Name 4',
          status: 'rejected',
          description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.',
          color: '#689BCA',
          periods: [{
            periodStart: `${moment(new Date()).add(1, 'M').add(15, 'days').format('YYYY-MM-DD')} 14:30:00`,
            periodEnd: `${moment(new Date()).add(1, 'M').add(16, 'days').format('YYYY-MM-DD')} 18:00:00`
          }],
          price: 10,
          places: 0,
          maxCapacity: 10,
          location: 'Location Name',
          bringingAnyone: true,
          bookable: true,
          opened: true,
          closed: false,
          upcoming: false,
          full: false,
          cancelable: true,
          showEventDetails: false
        },
        {
          id: 5,
          name: 'Event Name 5',
          description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.',
          color: '#689BCA',
          price: 10,
          periods: [
            {
              periodStart: `${moment(new Date()).add(1, 'M').add(20, 'days').format('YYYY-MM-DD')} 14:30:00`,
              periodEnd: `${moment(new Date()).add(1, 'M').add(22, 'days').format('YYYY-MM-DD')} 18:00:00`
            }
          ],
          location: 'Location Name',
          maxCapacity: 10,
          bringingAnyone: true,
          status: 'approved',
          bookable: true,
          cancelable: true,
          opened: false,
          closed: false,
          places: 0,
          upcoming: false,
          full: true,
          showEventDetails: false
        },
        {
          id: 6,
          name: 'Event Name 6',
          description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.',
          color: '#689BCA',
          price: 10,
          periods: [
            {
              periodStart: `${moment(new Date()).add(1, 'M').format('YYYY-MM-DD')} 14:30:00`,
              periodEnd: `${moment(new Date()).add(1, 'M').add(3, 'days').format('YYYY-MM-DD')} 18:00:00`
            }
          ],
          status: 'approved',
          maxCapacity: 10,
          bringingAnyone: true,
          bookable: false,
          location: 'Location Name',
          cancelable: true,
          opened: false,
          closed: true,
          places: 0,
          upcoming: true,
          full: false,
          showEventDetails: false
        }
      ],
      appointment: {
        bookings: [{
          persons: 1
        }]
      },
      labelCapacity: this.formField.labels.event_capacity,
      capacityVisibility: this.formField.labels.event_capacity.visibility,
      locationVisibility: this.formField.labels.location.visibility,
      dateTimeVisibility: this.formField.labels.event_date.visibility,
      timeZoneVisibility: this.formField.labels.time_zone.visibility,
      eventPriceVisibility: this.formField.labels.event_price.visibility,
      labelEventFree: this.formField.labels.event_free,
      labelOpen: this.formField.labels.open,
      labelClosed: this.formField.labels.closed,
      labelCanceled: this.formField.labels.canceled,
      labelFull: this.formField.labels.full,
      labelUpcoming: this.formField.labels.upcoming,
      labelAboutEvent: this.formField.labels.event_about,
      labelBookEvent: this.formField.labels.event_book,
      bookEventVisibility: this.formField.labels.event_book.visibility,
      labelPersons: this.formField.labels.event_book_persons,
      selectInputFocus: false,
      timeZoneString: this.$root.settings.general.showClientTimeZone ? Intl.DateTimeFormat().resolvedOptions().timeZone : this.$root.settings.wordpress.timezone
    }
  },

  mounted () {},

  methods: {
    saveStepEdit (dataObj) {
      let formObj = {}
      formObj = JSON.parse(JSON.stringify(dataObj))
      this.$emit('saveStepEdit', formObj)
    },

    saveDraggableEdit (dataObj) {
      let formObj = {}
      formObj = JSON.parse(JSON.stringify(dataObj))
      this.$emit('saveDraggableEdit', formObj)
    },

    inputFocus () {
      this.selectInputFocus = true
    },

    saveFormFiledEdit (objData) {
      let fieldData = {}
      fieldData['itemsStatic'] = {}
      fieldData['itemsStatic'][this.$options.name] = JSON.parse(JSON.stringify(objData))
      this.$emit('saveEdit', fieldData)
    },

    getEventAvailability (evt) {
      if (evt.status === 'approved' || evt.status === 'pending') {
        if (evt.full) {
          return {
            label: (this.languageShortCode ? this.labelFull.translations[this.languageShortCode] : this.labelFull.value) || this.$root.labels.full,
            class: 'full'
          }
        }
        if (evt.upcoming) {
          return {
            label: (this.languageShortCode ? this.labelUpcoming.translations[this.languageShortCode] : this.labelUpcoming.value) || this.$root.labels.upcoming,
            class: 'upcoming'
          }
        }
        return !evt.bookable ? {
          label: (this.languageShortCode ? this.labelClosed.translations[this.languageShortCode] : this.labelClosed.value) || this.$root.labels.closed,
          class: 'closed'
        } : {
          label: (this.languageShortCode ? this.labelOpen.translations[this.languageShortCode] : this.labelOpen.value) || this.$root.labels.open,
          class: 'open'
        }
      } else {
        return {
          label: (this.languageShortCode ? this.labelCanceled.translations[this.languageShortCode] : this.labelCanceled.value) || this.$root.labels.canceled,
          class: 'canceled'
        }
      }
    },

    isEventInSameDay (evt) {
      let result = true

      if (evt.periods.length === 1) {
        result = evt.periods[0].periodStart.split(' ')[0] === evt.periods[0].periodEnd.split(' ')[0]
      } else {
        let periodStart = evt.periods[0].periodStart.split(' ')[0]
        let periodEnd = evt.periods[0].periodEnd.split(' ')[0]

        evt.periods.forEach(function (period) {
          if (period.periodStart.split(' ')[0] !== periodStart || period.periodEnd.split(' ')[0] !== periodEnd) {
            result = false
          }
        })
      }

      return result
    },

    getBookableColor (bookable, colorBackground) {
      return colorBackground ? {
        'color': this.customization.globalColors.textColorOnBackground,
        'background-color': bookable.color,
        'border-color': '#ffffff'
      } : {
        'color': bookable.color,
        'background-color': '',
        'border-color': ''
      }
    },

    setPlaces (value) {
      this.appointment.bookings[0].persons = value
    },

    getEventDatesAndTimes (periods) {
      let $this = this

      let resultPeriods = []

      this.getImplodedPeriods(periods).forEach(function (period) {
        let periodStart = period.periodStart.split(' ')
        let periodEnd = period.periodEnd.split(' ')

        if (period.isConnected) {
          resultPeriods.push($this.getFrontedFormattedDateTime(periodStart) + ' - ' + $this.getFrontedFormattedDateTime(periodEnd))
        } else {
          if (periodStart[0] === periodEnd[0]) {
            resultPeriods.push($this.getFrontedFormattedDate(periodStart[0]) + ' ' + $this.getFrontedFormattedTime(periodStart[1]) + ' - ' + $this.getFrontedFormattedTime(periodEnd[1]))
          } else {
            resultPeriods.push($this.getFrontedFormattedDate(periodStart[0]) + ' - ' + $this.getFrontedFormattedDate(periodEnd[0]) + ' ' + $this.getFrontedFormattedTime(periodStart[1]) + ' - ' + $this.getFrontedFormattedTime(periodEnd[1]))
          }
        }
      })

      return resultPeriods.join(', ')
    },

    toggleEventDetails (evt) {
      evt.showEventDetails = !evt.showEventDetails
      this.events.forEach(function (event) {
        if (event.id !== evt.id) {
          event.showEventDetails = false
        }
      })
    }
  },

  watch: {
    'formField' () {
      this.labelCapacity = this.formField.labels.event_capacity
      this.capacityVisibility = this.formField.labels.event_capacity.visibility
      this.locationVisibility = this.formField.labels.location.visibility
      this.dateTimeVisibility = this.formField.labels.event_date.visibility
      this.timeZoneVisibility = this.formField.labels.time_zone.visibility
      this.eventPriceVisibility = this.formField.labels.event_price.visibility
      this.labelEventFree = this.formField.labels.event_free
      this.labelOpen = this.formField.labels.open
      this.labelClosed = this.formField.labels.closed
      this.labelCanceled = this.formField.labels.canceled
      this.labelFull = this.formField.labels.full
      this.labelUpcoming = this.formField.labels.upcoming
      this.labelAboutEvent = this.formField.labels.event_about
      this.labelBookEvent = this.formField.labels.event_book
      this.bookEventVisibility = this.formField.labels.event_book.visibility
      this.labelPersons = this.formField.labels.event_book_persons
    }
  }
}
</script>
