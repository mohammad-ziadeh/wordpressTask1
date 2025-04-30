<template>
  <div
    class="am-cc"
    :style="cssVars"
  >
    <AmCollapse>
      <AmCollapseItem
        heading-class="am-cc__heading-wrapper"
        :side="props.parentWidth > 500"
      >
        <template #heading>
          <div
            class="am-cc__heading"
            :class="props.responsiveClass"
          >
            <div
              class="am-cc__heading-info"
              :class="props.responsiveClass"
            >
              <div
                class="am-cc__heading-info__part"
                :class="props.responsiveClass"
              >
                <div class="am-cc__time">
                  {{ props.start }}
                </div>

                <div
                  v-if="props.parentWidth > 650"
                  class="am-cc__name"
                >
                  {{ props.name }}
                </div>

                <div
                  v-if="props.reservation.type === 'event' && shortcodeData.cabinetType === 'employee' && props.parentWidth <= 650"
                  class="am-cc__places"
                  :class="props.responsiveClass"
                >
                  {{ places }}
                </div>

                <div
                  v-if="props.reservation.type === 'appointment' && shortcodeData.cabinetType === 'employee' && props.customers.length === 1 && props.customizedOptions.customer.visibility && props.parentWidth <= 650"
                  class="am-cc__customer"
                  :class="props.responsiveClass"
                >
                  {{ `${props.customers[0].firstName} ${props.customers[0].lastName}` }}
                </div>

                <div
                  v-if="(props.booking || shortcodeData.cabinetType === 'employee') && props.parentWidth <= 650"
                  class="am-cc__status"
                  :class="`am-cc__status-${status.class}`"
                >
                  {{ status.label }}
                </div>
              </div>
              <div
                class="am-cc__heading-info__part"
                :class="props.responsiveClass"
              >
                <div
                  v-if="props.parentWidth <= 650"
                  class="am-cc__name"
                >
                  {{ props.name }}
                </div>

                <div
                  v-if="props.reservation.type === 'event' && shortcodeData.cabinetType === 'employee' && props.parentWidth > 650"
                  class="am-cc__places"
                >
                  {{ places }}
                </div>

                <div
                  v-if="props.reservation.type === 'appointment' && shortcodeData.cabinetType === 'employee' && props.customers.length === 1 && props.customizedOptions.customer.visibility && props.parentWidth > 650"
                  class="am-cc__customer"
                >
                  {{ `${props.customers[0].firstName} ${props.customers[0].lastName}` }}
                </div>

                <div
                  v-if="(props.booking || shortcodeData.cabinetType === 'employee') && props.parentWidth > 650"
                  class="am-cc__status"
                  :class="`am-cc__status-${status.class}`"
                >
                  {{ status.label }}
                </div>
              </div>
            </div>
            <div
              v-if="shortcodeData.cabinetType === 'employee'"
              class="am-cc__heading-actions"
              :class="props.responsiveClass"
            >
              <el-popover
                v-if="props.reservation.type === 'appointment' ? amSettings.roles.allowWriteAppointments : true"
                ref="editRef"
                v-model:visible="editPopVisible"
                :persistent="false"
                :show-arrow="false"
                :width="'auto'"
                :popper-class="'am-cc__popper'"
                :popper-style="cssVars"
                trigger="click"
              >
                <template #reference>
                  <span
                    v-if="props.reservation"
                    class="am-cc__edit-btn am-icon-dots-vertical"
                    @click="editItem"
                  ></span>
                </template>
                <div
                  v-if="(props.reservation.type === 'appointment' && amSettings.roles.allowWriteAppointments) || (props.reservation.type === 'event' && amSettings.roles.allowWriteEvents)"
                  v-click-outside="closeEditItemPopup"
                  class="am-cc__edit"
                >
                  <!-- Edit Appointment -->
                  <div
                    class="am-cc__edit-item am-edit"
                    @click="editReservation(props.reservation.type)"
                  >
                    <span class="am-icon-edit"/>
                    <span class="am-cc__edit-text">
                      {{ amLabels.edit }}
                    </span>
                  </div>
                  <!-- /Edit Appointment -->
                </div>

                <template v-if="props.reservation.type === 'event'">
                  <div
                    v-if="amSettings.roles.allowWriteEvents"
                    v-click-outside="closeEditItemPopup"
                    class="am-cc__edit"
                  >
                    <!-- Edit Attendee -->
                    <div
                      class="am-cc__edit-item am-edit"
                      @click="addEventAttendee(props.reservation)"
                    >
                      <span class="am-icon-users-plus"></span>
                      <span class="am-cc__edit-text">
                        {{ amLabels.event_add_attendee }}
                      </span>
                    </div>
                    <!-- /Edit Attendee -->
                  </div>
                  <div
                    v-click-outside="closeEditItemPopup"
                    class="am-cc__edit"
                  >
                    <!-- List Event Attendees -->
                    <div
                      class="am-cc__edit-item am-edit"
                      @click="listEventAttendees(props.reservation)"
                    >
                      <span class="am-icon-user"></span>
                      <span class="am-cc__edit-text">
                        {{ amLabels.attendees }}
                      </span>
                    </div>
                    <!-- /List Event Attendees -->
                  </div>
                </template>
              </el-popover>
            </div>
            <div
              v-else-if="(props.booking && props.booking.status === 'approved' || props.booking.status === 'pending' || props.booking.status === 'waiting')
              && ((!props.isPackageBooking && props.booking.price > 0
              && usePaymentFromCustomerPanel(props.reservation, props.bookable.settings))
              || !!(props.reservation.cancelable
              || (amSettings.roles.allowCustomerReschedule && props.reservation.reschedulable)))"
              class="am-cc__heading-actions"
              :class="props.responsiveClass"
            >
              <PaymentButton
                v-if="props.booking.status !== 'waiting' && !props.isPackageBooking && props.booking.price > 0 && usePaymentFromCustomerPanel(props.reservation, props.bookable.settings)"
                :reservation="props.reservation"
                :bookable="props.bookable"
              >
              </PaymentButton>
              <el-popover
                v-if="props.reservation.cancelable || (amSettings.roles.allowCustomerReschedule && props.reservation.reschedulable)"
                ref="editRef"
                v-model:visible="editPopVisible"
                :persistent="false"
                :show-arrow="false"
                :width="'auto'"
                :popper-class="'am-cc__popper'"
                :popper-style="cssVars"
                trigger="click"
              >
                <template #reference>
                  <span
                    v-if="props.booking"
                    class="am-cc__edit-btn am-icon-dots-vertical"
                    @click="editItem"
                  ></span>
                </template>
                <div
                  v-click-outside="closeEditItemPopup"
                  class="am-cc__edit"
                >
                  <!-- Reschedule -->
                  <div
                    v-if="props.reservation.type === 'appointment' && amSettings.roles.allowCustomerReschedule && props.reservation.reschedulable"
                    class="am-cc__edit-item"
                    @click="rescheduleItem"
                  >
                    <span class="am-icon-date-time"></span>
                    <span class="am-cc__edit-text">
                      {{ amLabels.reschedule }}
                    </span>
                  </div>
                  <!-- /Reschedule -->

                  <!-- Cancel item -->
                  <div
                    v-if="props.reservation.cancelable"
                    class="am-cc__edit-item am-delete"
                    @click="cancelItem"
                  >
                    <span class="am-icon-clearable"></span>
                    <span class="am-cc__edit-text">
                      {{ amLabels.cancel }}
                    </span>
                  </div>
                  <!-- /Cancel item -->
                </div>
              </el-popover>
            </div>
          </div>
        </template>
        <template #default>
          <div
            class="am-cc__content"
            :class="props.responsiveClass"
          >
            <div class="am-cc__content-inner">
              <!-- Employee -->
              <template v-if="originKey === 'capc' && customizedOptions.employee.visibility">
                <CollapseCardPopover
                  v-if="Array.isArray(props.employee) ? props.employee.length : Object.keys(props.employee).length"
                  :header-text="Array.isArray(props.employee) ? amLabels.view_employees : amLabels.provider_profile"
                  type="employee"
                  :content-data="props.employee"
                >
                  <template #default>
                    <div class="am-cc__data">
                      <span class="am-icon-user"></span>
                      <span class="am-cc__data-text">
                      {{ employeesString(props.employee) }}
                    </span>
                    </div>
                  </template>
                </CollapseCardPopover>
              </template>
              <!-- /Employee -->

              <!-- Customers -->
              <template v-if="originKey === 'cape' && props.reservation.type === 'appointment' && props.customers.length > 1 && props.customizedOptions.customer.visibility">
                <CollapseCardPopover
                  v-if="props.customers.length"
                  :header-text="amLabels.customers"
                  type="customers"
                  :content-data="props.customers"
                >
                  <template #default>
                    <div class="am-cc__data">
                      <span class="am-icon-user"></span>
                      <span class="am-cc__data-text">
                      {{ amLabels.customers }}
                    </span>
                    </div>
                  </template>
                </CollapseCardPopover>
              </template>
              <!-- /Customers -->

              <!-- Price -->
              <div
                v-if="props.price && props.customizedOptions.price.visibility"
                class="am-cc__data"
              >
                <span class="am-icon-payments"></span>
                <span class="am-cc__data-text">{{ useFormattedPrice(props.price) }}</span>
              </div>
              <!-- /Price -->

              <!-- Slot -->
              <div v-if="props.duration" class="am-cc__data">
                <span class="am-icon-clock"></span>
                <span class="am-cc__data-text">{{ useSecondsToDuration(props.duration, amLabels.h, amLabels.min) }}</span>
              </div>
              <!-- /Slot -->

              <!-- Periods -->
              <CollapseCardPopover
                v-if="periods.length"
                :header-text="amLabels.event_timetable"
                type="period"
                :content-data="props.periods"
              >
                <template #default>
                  <div class="am-cc__data">
                    <span class="am-icon-clock"></span>
                    <span class="am-cc__data-text">
                      {{ amLabels.event_timetable }}
                    </span>
                  </div>
                </template>
              </CollapseCardPopover>
              <!-- /Periods -->

              <!-- GoogleMeet Link -->
              <div v-if="props.googleMeetLink" class="am-cc__data link">
                <span class="am-icon-link"></span>
                <a class="am-cc__data-text link" :href="props.googleMeetLink" target="_blank">
                  {{ amLabels.google_meet_link }}
                </a>
              </div>
              <!-- /GoogleMeet link -->

              <!-- Microsoft Teams Link -->
              <div v-if="props.microsoftTeamsLink" class="am-cc__data link">
                <span class="am-icon-link"></span>
                <a class="am-cc__data-text link" :href="props.microsoftTeamsLink" target="_blank">
                  {{ amLabels.microsoft_teams_link }}
                </a>
              </div>
              <!-- /Microsoft Teams link -->

              <!-- Zoom Link -->
              <div v-if="props.zoomLink" class="am-cc__data link">
                <span class="am-icon-link"></span>
                <a class="am-cc__data-text link" :href="props.zoomLink" target="_blank">
                  {{ amLabels.zoom_link }}
                </a>
              </div>
              <!-- /Zoom link -->

              <!-- Lesson Space Link -->
              <div v-if="props.lessonSpaceLink" class="am-cc__data link">
                <span class="am-icon-link"></span>
                <a class="am-cc__data-text link" :href="props.lessonSpaceLink" target="_blank">
                  {{ amLabels.lesson_space_link }}
                </a>
              </div>
              <!-- /Lesson Space Link -->

              <!-- Extras -->
              <CollapseCardPopover
                v-if="Object.keys(props.extras).length"
                :header-text="`${Object.keys(props.extras).length} ${amLabels.extras}`"
                type="extras"
                :content-data="props.extras"
              >
                <template #default>
                  <div class="am-cc__data">
                    <span class="am-icon-border-plus"></span>
                    <span class="am-cc__data-text">
                      {{ `${Object.keys(props.extras).length} ${amLabels.extras}` }}
                    </span>
                  </div>
                </template>
              </CollapseCardPopover>
              <!-- /Extras -->

              <!-- Custom Fields -->
              <CollapseCardPopover
                v-if="props.customFields.length"
                :header-text="amLabels.custom_fields"
                type="customField"
                :content-data="props.customFields"
              >
                <template #default>
                  <div class="am-cc__data">
                    <span class="am-icon-file-text"></span>
                    <span class="am-cc__data-text">
                      {{ amLabels.custom_fields }}
                    </span>
                  </div>
                </template>
              </CollapseCardPopover>
              <!-- /Custom Fields -->

              <!-- Tickets -->
              <CollapseCardPopover
                v-if="Object.keys(props.tickets).length"
                :header-text="amLabels.event_tickets"
                type="ticket"
                :content-data="props.tickets"
              >
                <template #default>
                  <div class="am-cc__data">
                    <span class="am-icon-tickets"></span>
                    <span class="am-cc__data-text">
                      {{ amLabels.event_tickets }}
                    </span>
                  </div>
                </template>
              </CollapseCardPopover>
              <!-- /Tickets -->

              <!-- Location -->
              <div
                v-if="props.location"
                class="am-cc__data"
                :class="{'link': props.location.address}"
              >
                <span class="am-icon-locations"></span>
                <a
                  v-if="props.location.address"
                  class="am-cc__data-text"
                  :href="`https://maps.google.com/?q=${props.location.address}`"
                  target="_blank">
                    {{ props.location.name }}
                </a>
                <span v-else class="am-cc__data-text">
                  {{ props.location.name }}
                </span>
              </div>
              <!-- /Location -->
            </div>
          </div>
        </template>
      </AmCollapseItem>
    </AmCollapse>
  </div>
</template>

<script setup>
// * Import from Vue
import {
  ref,
  computed,
  inject,
} from "vue";

// * Import from Libraries
import { ClickOutside as vClickOutside } from "element-plus";

// * Components
import AmCollapse from "../../../../../_components/collapse/AmCollapse.vue";
import AmCollapseItem from "../../../../../_components/collapse/AmCollapseItem.vue";
import CollapseCardPopover from "./popover/CollapseCardPopover.vue";
import PaymentButton from "../PaymentButton.vue";

// * Composables
import { useColorTransparency } from "../../../../../../assets/js/common/colorManipulation";
import { useFormattedPrice } from "../../../../../../assets/js/common/formatting";
import { useSecondsToDuration } from "../../../../../../assets/js/common/date";
import { usePaymentFromCustomerPanel } from "../../../../../../assets/js/public/cabinet";

// * Component porps
let props = defineProps({
  start: {
    type: [String, Object, Array, Function],
    required: true
  },
  name: {
    type: String,
    default: ''
  },
  employee: {
    type: [Object, Array],
    default: () => {}
  },
  customers: {
    type: [Array],
    default: () => {}
  },
  location: {
    type: [String, Object],
    default: ''
  },
  price: {
    type: Number,
    default: 0
  },
  duration: {
    type: Number,
    default: 0
  },
  periods: {
    type: Array,
    default: () => {}
  },
  extras: {
    type: Object,
    default: () => {}
  },
  tickets: {
    type: Object,
    default: () => {}
  },
  customFields: {
    type: Array,
    default: () => []
  },
  googleMeetLink: {
    type: String,
    default: ''
  },
  microsoftTeamsLink: {
    type: String,
    default: ''
  },
  zoomLink: {
    type: String,
    default: ''
  },
  lessonSpaceLink: {
    type: String,
    default: ''
  },
  reservation: {
    type: Object,
    default: () => {}
  },
  bookable: {
    type: Object,
    default: () => {}
  },
  booking: {
    type: Object,
    default: () => {}
  },
  isPackageBooking: {
    type: Boolean,
    default: false
  },
  responsiveClass: {
    type: String,
    default: ''
  },
  parentWidth: {
    type: Number,
    default: 1200
  },
  customizedOptions: {
    type: Object,
    required: true
  }
})

// * Component emits
let emits = defineEmits(['cancelBooking', 'rescheduling', 'editAppointment', 'editEvent', 'addEventAttendee', 'listEventAttendees'])

// * Data in shortcode
const shortcodeData = inject('shortcodeData')

// * Root Settings
const amSettings = inject('settings')

let originKey = inject('originKey')

// * Labels
const amLabels = inject('amLabels')

let editPopVisible = ref(false)

function editItem (e) {
  e.stopPropagation()
  editPopVisible.value = !editPopVisible.value
}

function closeEditItemPopup () {
  editPopVisible.value = false
}

function cancelItem () {
  emits('cancelBooking', props.booking)

  editPopVisible.value = false
}

function editReservation (type) {
  emits('edit' + type.charAt(0).toUpperCase() + type.slice(1), props.reservation)

  editPopVisible.value = false
}

function addEventAttendee (event) {
  emits('addEventAttendee', event)

  editPopVisible.value = false
}


function listEventAttendees (event) {
  emits('listEventAttendees', event)

  editPopVisible.value = false
}

function rescheduleItem () {
  emits('rescheduling', props.reservation, props.booking)

  editPopVisible.value = false
}

function employeesString (emp) {
  if (Array.isArray(emp)) {
    return amLabels.value.event_staff
  }

  if (!Array.isArray(emp) && emp.rank && emp.rank === 'organizer') {
    return amLabels.value.event_organizer
  }

  return `${props.employee.firstName} ${props.employee.lastName}`
}

let places = computed(() => {
  if (props.reservation.type === 'event') {
    return props.reservation.maxCapacity - props.reservation.places + '/' + props.reservation.maxCapacity
  }

  return ''
})

let status = computed(() => {
  if (props.reservation.type === 'appointment') {
    return {
      label: amLabels.value[
        shortcodeData.value.cabinetType === 'employee'
          ? props.reservation.status
          : (props.booking.status === 'approved' ? props.reservation.status : props.booking.status)
        ],
      class: shortcodeData.value.cabinetType === 'employee'
        ? props.reservation.status
        : (props.booking.status === 'approved' ? props.reservation.status : props.booking.status)
    }
  } else if (props.reservation.type === 'event') {
    if (shortcodeData.value.cabinetType === 'customer') {
      return {
        label: amLabels.value[props.booking.status],
        class: props.booking.status,
      }
    }

    switch (props.reservation.status) {
      case ('rejected'):
      case ('canceled'):
        return {
          label: amLabels.value.canceled,
          class: 'canceled',
        }
      case ('full'):
        return {
          label: amLabels.value.full,
          class: 'full',
        }
      case ('waiting'):
        return {
          label: amLabels.value.waiting_list,
          class: 'waiting',
        }
      case ('upcoming'):
        return {
          label: amLabels.value.upcoming,
          class: 'upcoming',
        }
      case ('approved'):
        if (props.reservation.closed) {
          return {
            label: amLabels.value.closed,
            class: 'closed',
          }
        }

        if (props.reservation.opened && props.reservation.places > 0) {
          return {
            label: amLabels.value.opened,
            class: 'opened',
          }
        }
    }
  }

  return {
    label: '',
    class: '',
  }
})

/*************
 * Customize *
 *************/
// * Fonts
let amFonts = inject('amFonts')

// * Colors block
let amColors = inject('amColors')

let cssVars = computed(() => {
  return {
    '--am-c-cc-primary': amColors.value.colorPrimary,
    '--am-c-cc-primary-op15': useColorTransparency(amColors.value.colorPrimary, 0.15),
    '--am-c-cc-primary-op70': useColorTransparency(amColors.value.colorPrimary, 0.7),
    '--am-c-cc-error': amColors.value.colorError,
    '--am-c-cc-error-op15': useColorTransparency(amColors.value.colorError, 0.15),
    '--am-c-cc-warning': amColors.value.colorWarning,
    '--am-c-cc-warning-op15': useColorTransparency(amColors.value.colorWarning, 0.15),
    '--am-c-cc-success': amColors.value.colorSuccess,
    '--am-c-cc-success-op15': useColorTransparency(amColors.value.colorSuccess, 0.15),
    '--am-c-cc-bgr': amColors.value.colorMainBgr,
    '--am-c-cc-text': amColors.value.colorMainText,
    '--am-c-cc-text-op03': useColorTransparency(amColors.value.colorMainText, 0.03),
    '--am-c-cc-text-op10': useColorTransparency(amColors.value.colorMainText, 0.1),
    '--am-c-cc-text-op15': useColorTransparency(amColors.value.colorMainText, 0.15),
    '--am-c-cc-text-op70': useColorTransparency(amColors.value.colorMainText, 0.7),
    '--am-c-cc-text-op90': useColorTransparency(amColors.value.colorMainText, 0.9),
    '--am-font-family': amFonts.value.fontFamily,

    // css properties
    '--am-rad-input': '6px',
    '--am-fs-input': '15px',
  }
})
</script>

<script>
export default {
  name: 'CollapseCard'
}
</script>

<style lang="scss">
@mixin collapse-card {
  // cc - collapse card
  .am-cc {
    * {
      font-family: var(--am-font-family), sans-serif;
      box-sizing: border-box;
    }

    &__heading {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;

      &.am-rw-500 {
        flex-wrap: wrap;
      }

      &-wrapper {
        padding: 12px 16px;
      }

      &-info {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        gap: 8px 0;

        &.am-rw-650 {
          flex-wrap: wrap;
        }

        &__part {
          display: flex;
          align-items: center;
          gap: 8px;

          &.am-rw-650 {
            width: 100%;
            justify-content: space-between;
          }

          &.am-rw-420 {
            flex-wrap: wrap;
          }
        }
      }

      &-actions {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin: 0 0 0 8px;

        &.am-rw-500 {
          width: 100%;

          .am-cc__edit-btn {
            margin-left: auto;
          }
        }

        .am-button {
          --am-padd-btn: 4px 6px 4px 12px;
        }

        .am-button-single {
          --am-padd-btn: 4px 12px 4px 12px;
        }
      }
    }

    &__time {
      display: flex;
      flex: 0 0 auto;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      font-weight: 400;
      line-height: 1.428571429;
      color: var(--am-c-cc-text);
      background-color: var(--am-c-cc-text-op10);
      border-radius: 12px;
      padding: 2px 12px;
    }

    &__name {
      display: flex;
      font-size: 15px;
      font-weight: 500;
      line-height: 1.6;
      color: var(--am-c-cc-text);
      width: 100%;
    }

    &__employee {
      display: flex;
      font-size: 15px;
      font-weight: 400;
      line-height: 1.6;
      color: var(--am-c-cc-text);
    }

    &__places {
      display: flex;
      font-size: 14px;
      font-weight: 400;
      line-height: 1.428571429;
      color: var(--am-c-cc-text);

      &.am-rw- {
        &320 {
          order: 1;
          width: 100%;
        }
      }
    }

    &__customer {
      display: flex;
      font-size: 15px;
      font-weight: 400;
      line-height: 1.6;
      color: var(--am-c-cc-text);

      &.am-rw- {
        &320 {
          order: 1;
          width: 100%;
        }
      }
    }

    &__status {
      display: flex;
      flex: 0 0 auto;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      font-weight: 400;
      line-height: 1.428571429;
      border-radius: 12px;
      padding: 2px 12px;

      &:before {
        content: '';
        width: 8px;
        height: 8px;
        border-radius: 50%;
        margin: 0 4px 0 0;
      }

      &-canceled {
        color: var(--am-c-cc-error);
        background-color: var(--am-c-cc-error-op15);

        &:before {
          background-color: var(--am-c-cc-error);
        }
      }

      &-rejected {
        color: var(--am-c-cc-text);
        background-color: var(--am-c-cc-text-op15);

        &:before {
          background-color: var(--am-c-cc-text);
        }
      }

      &-closed {
        color: var(--am-c-cc-text);
        background-color: var(--am-c-cc-text-op15);

        &:before {
          background-color: var(--am-c-cc-text);
        }
      }

      &-pending, &-waiting, &-upcoming {
        color: var(--am-c-cc-warning);
        background-color: var(--am-c-cc-warning-op15);

        &:before {
          background-color: var(--am-c-cc-warning);
        }
      }

      &-approved, &-opened {
        color: var(--am-c-cc-success);
        background-color: var(--am-c-cc-success-op15);

        &:before {
          background-color: var(--am-c-cc-success);
        }
      }

      &-full {
        color: var(--am-c-cc-primary);
        background-color: var(--am-c-cc-primary-op15);

        &:before {
          background-color: var(--am-c-cc-primary);
        }
      }
    }

    &__edit {
      &-btn {
        margin: 0;
        font-size: 24px;
        color: var(--am-c-cc-text);
      }

      &-item {
        display: flex;
        align-items: center;
        color: var(--am-c-cc-text);

        span[class^="am-icon"] {
          font-size: 24px;
        }
      }
    }

    &__content {
      display: flex;
      width: 100%;
      align-items: center;
      justify-content: center;
      padding: 0 16px 16px;

      &.am-rw-500 {
        padding: 16px 16px 0;
      }

      &-inner {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 0 8px;
        flex-wrap: wrap;
        width: 100%;
        border-radius: 8px;
        background-color: var(--am-c-cc-text-op03);
        padding: 12px;
      }
    }

    &__data {
      display: flex;
      align-items: center;
      color: var(--am-c-cc-text);

      &.el-tooltip__trigger, &.link {
        color: var(--am-c-cc-primary);
        cursor: pointer;

        &:hover {
          color: var(--am-c-cc-primary-op70)
        }
      }

      &-text {
        font-size: 14px;
        font-weight: 400;
        line-height: 2;
        color: inherit;

        &.link {
          text-decoration: none;
        }
      }

      [class^="am-icon"] {
        font-size: 28px;
        color: inherit;
      }
    }

    .am-collapse-item {
      &__content {
        border-top: 0;
      }
    }
  }
}

@mixin collapse-card-popper {
  // cc - collapse card
  .am-cc {
    &__edit {
      &-item {
        display: flex;
        align-items: center;
        color: var(--am-c-cc-text);
        border-radius: 4px;
        padding: 4px;
        cursor: pointer;
        transition: background-color .3s ease-in-out;

        &:hover {
          background-color: var(--am-c-cc-text-op15);
        }

        &.am-delete {
          --am-c-cc-text: var(--am-c-cc-error);

          &:hover {
            background-color: var(--am-c-cc-error-op15);
          }
        }

        span[class^="am-icon"] {
          font-size: 24px;
          color: inherit;
          margin: 0 4px 0 0;
        }
      }

      &-text {
        font-size: 14px;
        line-height: 1.7142857;
        color: inherit;
      }
    }
  }

  &.am-cc__popper {
    padding: 6px 4px;
    background-color: var(--am-c-cc-bgr);
    border-color: var(--am-c-cc-bgr);
    box-shadow: 0 2px 12px 0 var(--am-c-cc-text-op10);

    * {
      font-family: var(--am-font-family), sans-serif;
      box-sizing: border-box;
    }
  }
}

.amelia-v2-booking #amelia-container {
  @include collapse-card
}

.el-popper.el-popover {
  @include collapse-card-popper
}
</style>
