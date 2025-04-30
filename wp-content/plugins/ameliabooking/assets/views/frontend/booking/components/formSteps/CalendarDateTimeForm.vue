<template>
  <!-- Pick Date & Time -->
  <div
    :id="this.id + '-calendar'"
    class="am-select-date am-select-service-date-transition am-show-calendar"
    :class="$root.settings.customization.forms ? `am-form-${formType}-${formName}` : ''"
  >
   <!-- Calendar heading -->
    <calendar-heading-form-field
      :class-identifier="`${formType}-${formName}`"
      :formField="formsData[formName].itemsStatic.calendarHeadingFormField"
    >
    </calendar-heading-form-field>
    <!-- /Calendar heading -->

    <p v-if="timeZoneVisibility" class="am-timezone" :class="`am-block-${formType}-${formName}`" :style="{margin: 0}">
      <span class="am-timezone__text">{{ timeZoneString }}</span>
    </p>

    <div class="am-duration-container">
      <el-select
        class="am-duration"
        :class="`am-block-${formType}-${formName}`" :style="{margin: 0}"
        :popper-class="'am-select-complex'"
        v-if="durations.length > 1"
        v-model="appointment.serviceDuration"
        @change="selectDuration"
      >
        <el-option
          v-for="item in durations"
          :key="item.duration"
          :label="secondsToNiceDuration(item.duration) + ' (' + item.priceLabel + ')'"
          :value="item.duration"
        >
          <span><img :src="$root.getUrl + 'public/img/clock.svg'">{{ secondsToNiceDuration(item.duration) }}</span>
          <span>{{ item.priceLabel }}</span>
        </el-option>
      </el-select>
    </div>

    <!-- Calendar -->
    <v-date-picker
      v-model="selectedCalendarDate"
      mode="single"
      id="am-calendar-picker"
      class="am-calendar-picker"
      :class="$root.settings.customization.forms ? `am-calendar-${formType}-${formName}` : ''"
      @dayclick="selectDate"
      @input="setTimeSlots"
      :available-dates="availableDates"
      :disabled-dates='disabledWeekdays'
      :show-day-popover=false
      :is-expanded=true
      :is-inline=true
      :disabled-attribute="disabledAttribute"
      :formats="vCalendarFormats"
      @update:fromPage="changeMonth"
    >
    </v-date-picker>
    <!-- /Calendar -->

    <!-- Spinner -->
    <div v-if="loadingTimeSlots" id="am-spinner" class="am-booking-fetched">
      <div class="am-svg-wrapper">
        <img class="svg-amelia am-spin" :src="$root.getUrl+'public/img/oval-spinner.svg'"/>
        <img class="svg-amelia am-hourglass" :src="$root.getUrl+'public/img/hourglass.svg'"/>
      </div>
    </div>
    <!-- /Spinner -->

    <!-- Time Slots -->
    <transition name="fade">
      <div :id="calendarId" v-show="showTimes">
        <div class="am-appointment-times am-scroll">
          <el-radio-group
            v-model="appointment.bookingStartTime"
            size="medium"
            @change="selectTime"
          >
            <el-radio-button
              v-for="(slot, index) in availableTimeSlots"
              :label="slot"
              :key="index + 1"
            >
              {{ getFormattedTimeSlot(slot, appointment.duration, endTimeVisibility) }}
            </el-radio-button>
          </el-radio-group>
        </div>
      </div>
    </transition>

    <div
      v-if="isRecurringAvailable && recurringSwitchVisibility"
      :class="$root.settings.customization.forms ? `am-block-${formType}-${formName}` : ''"
      class="am-recurring-check"
    >
      <span>{{ recurringLabel ? recurringLabel : $root.labels.recurring_active }}</span>
      <el-switch v-model="clickedActiveRecurring" @change="changeActiveRecurring"></el-switch>
    </div>

    <!-- Back & Continue Buttons -->
    <div :id="'am-button-wrapper-' + $root.shortcodeData.counter" class="am-button-wrapper">
      <!-- Back Button -->
      <transition name="fade">
        <el-button
          id="am-back-button"
          @click="togglePicker()"
          v-if="showCalendarBackButton"
        >
          {{ $root.labels.back }}
        </el-button>
      </transition>
      <!-- /Back Button -->

      <!-- Continue Button -->
      <transition name="fade">
        <el-button
          id="am-continue-button"
          v-show="showCalendarContinueButton"
          @click="showNextScreen"
          :loading="loading || loadingTimeSlots"
        >
          {{ $root.labels.continue }}
        </el-button>
      </transition>
      <!-- /Continue Button -->
    </div>
    <!-- /Back & Continue Buttons -->
  </div>

</template>

<script>
  import dateMixin from '../../../../../js/common/mixins/dateMixin'
  import bookingMixin from '../../../../../js/frontend/mixins/bookingMixin'
  import calendarHeadingFormField from '../formFields/CalendarHeadingFormField'
  import durationMixin from '../../../../../js/common/mixins/durationMixin'

  export default {
    name: 'calendarDateTimeForm',

    components: {
      calendarHeadingFormField
    },

    mixins: [dateMixin, bookingMixin, durationMixin],

    props: {
      id: {
        type: String,
        default: 'am-step-booking'
      },
      durations: {
        type: Array,
        default: () => []
      },
      selectedDate: {
        type: Date,
        default: null
      },
      availableDates: {
        type: Array,
        default: () => []
      },
      disabledWeekdays: {
        type: Object,
        default: null
      },
      disabledAttribute: {
        type: Object,
        default: () => {}
      },
      calendarId: {
        type: String,
        default: ''
      },
      showTimes: {
        type: Boolean,
        default: false
      },
      appointment: {
        type: Object,
        default: () => {}
      },
      availableTimeSlots: {
        type: Array,
        default: () => []
      },
      isRecurringAvailable: {
        type: Boolean,
        default: false
      },
      activeRecurring: {
        type: Boolean,
        default: false
      },
      showCalendarBackButton: {
        type: Boolean,
        default: true
      },
      showCalendarContinueButton: {
        type: Boolean,
        default: false
      },
      loading: {
        type: Boolean,
        default: false
      },
      loadingTimeSlots: {
        type: Boolean,
        default: false
      },
      formType: {
        type: String
      },
      formsData: {
        type: Object,
        default: () => {}
      }
    },

    data () {
      return {
        formName: this.$options.name,
        selectedCalendarDate: this.selectedDate,
        clickedActiveRecurring: this.activeRecurring,
        recurringLabel: this.formsData[this.$options.name].itemsStatic.recurringSwitchFormField.labels.recurring_active.value,
        recurringSwitchVisibility: this.formsData[this.$options.name].itemsStatic.recurringSwitchFormField.visibility,
        endTimeVisibility: this.formsData[this.$options.name].itemsStatic.calendarAppointmentFormField.endDateVisibility,
        timeZoneString: this.$root.settings.general.showClientTimeZone ? Intl.DateTimeFormat().resolvedOptions().timeZone : this.$root.settings.wordpress.timezone,
        timeZoneVisibility: this.formsData[this.$options.name].itemsStatic.timeZoneFormField.visibility
      }
    },

    methods: {
      selectDuration (duration) {
        this.$emit('selectDuration', duration)
      },

      selectDate (dayInfo) {
        this.$emit('selectDate', dayInfo, this.selectedCalendarDate)
      },

      setTimeSlots () {
        this.$emit('setTimeSlots', this.selectedCalendarDate)
      },

      changeMonth (page) {
        this.$emit('changeMonth', page)
      },

      selectTime () {
        this.$emit('selectTime')
      },

      togglePicker () {
        this.$emit('togglePicker')
      },

      showNextScreen () {
        this.$emit('showNextScreen')
      },

      changeActiveRecurring () {
        this.$emit('changeRecurring', this.clickedActiveRecurring)
      }
    },

    watch: {
      'selectedDate' () {
        this.selectedCalendarDate = this.selectedDate
      },

      'activeRecurring' () {
        this.clickedActiveRecurring = this.activeRecurring
      }
    }
  }
</script>
