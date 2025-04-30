<template>
  <div ref="dateTimeRef" class="am-fs-dt__calendar">
    <AmAdvancedSlotCalendar
      :id="0"
      :slots="calendarEvents"
      :calendar-minimum-date="moment().format('YYYY-MM-DD hh:mm')"
      :calendar-maximum-date="moment().add(1,'year').format('YYYY-MM-DD hh:mm')"
      :time-zone="amCustomize[pageRenderKey].dateTimeStep.options.timeZoneVisibility.visibility"
      :show-busy-slots="amCustomize[pageRenderKey].dateTimeStep.options.busyTimeSlotsVisibility.visibility"
      :label-slots-selected="labelsDisplay('date_time_slots_selected', 'dateTimeStep')"
      @selected-date="setSelectedDate"
      @unselect-date="unselectDate"
      @selected-time="setSelectedTime"
    ></AmAdvancedSlotCalendar>

    <!-- Recurring Appointment -->
    <AmSlidePopup :visibility="recurringPopupVisibility" class="am-fs-dt__calendar__recurring">
      <div class="am-fs-dt__rec_popup">
        <p>
          {{ labelsDisplay('repeat_appointment', 'recurringPopup') }}
        </p>
        <p v-if="amCustomize[pageRenderKey].recurringPopup.options.content.visibility">
          {{ labelsDisplay('repeat_appointment_quest', 'recurringPopup') }}
        </p>
      </div>
      <template #footer>
        <AmButton
          category="secondary"
          :type="amCustomize[pageRenderKey].recurringPopup.options.secondaryButton.buttonType"
        >
          {{ labelsDisplay('no', 'recurringPopup') }}
        </AmButton>
        <AmButton
          :type="amCustomize[pageRenderKey].recurringPopup.options.primaryButton.buttonType"
        >
          {{ labelsDisplay('yes', 'recurringPopup') }}
        </AmButton>
      </template>
    </AmSlidePopup>
    <!--/ Recurring Appointment -->
  </div>
</template>

<script setup>
import AmSlidePopup from '../../../_components/slide-popup/AmSlidePopup.vue';
import AmButton from '../../../_components/button/AmButton.vue';
import AmAdvancedSlotCalendar from '../../../_components/advanced-slot-calendar/AmAdvancedSlotCalendar'
import moment from 'moment'

import { ref, provide, inject, computed, onMounted, watchEffect } from 'vue'

let langKey = inject('langKey')
let amLabels = inject('labels')

let subStepName = inject('subStepName')
let pageRenderKey = inject('pageRenderKey')
let amCustomize = inject('customize')

// * Container Width
// let cWidth = inject('containerWidth', 0)
// let checkScreen = computed(() => cWidth.value < 560 || (cWidth.value - 240 < 520))

/*****************
 * Calendar Data *
 ****************/

let dateTimeRef = ref(null)
provide('formWrapper', dateTimeRef)

let calendarEvents = ref([])

let calendarServiceDuration = ref('0')

let calendarEventSlots = ref([])

let calendarEventBusySlots = ref([])

watchEffect (() => {
  calendarEventBusySlots.value = amCustomize.value[pageRenderKey.value].dateTimeStep.options.busyTimeSlotsVisibility.visibility ?
      ['08:00', '08:30', '09:30', '12:30', '14:00'] : []
})

let today = moment().format('YYYY-MM-DD')

for (let i = 0; i <= 31; i++) {
  let block = {
    display: "background",
    extendedProps: {
      slots: {'09:00': [7, 3]},
      slotsAvailable: 1,
      slotsTotal: 100
    },
    start: moment(today).add(i, 'd').format('YYYY-MM-DD'),
    title: "e"
  }

  calendarEvents.value.push(block)
}

let calendarEventSlot = ref('')
let calendarStartDate = ref(moment().format('YYYY-MM-DD'))
let calendarChangeSideBar = ref(true)

provide('calendarEvents', calendarEvents)
provide('calendarEventSlots', calendarEventSlots)
provide('calendarEventBusySlots', calendarEventBusySlots)
provide('calendarEventSlot', calendarEventSlot)
provide('calendarStartDate', calendarStartDate)
provide('calendarChangeSideBar', calendarChangeSideBar)
provide('calendarServiceDuration', calendarServiceDuration)

let calendarSlotDuration = 1800
provide('calendarSlotDuration', calendarSlotDuration)

// * Recurring popup
let recurringPopupVisibility = computed(() => {
  return subStepName.value === 'recurringPopup'
})

// * Label computed function
function labelsDisplay (label, stepKey) {
  let computedLabel = computed(() => {
    return amCustomize.value[pageRenderKey.value][stepKey].translations
    && amCustomize.value[pageRenderKey.value][stepKey].translations[label]
    && amCustomize.value[pageRenderKey.value][stepKey].translations[label][langKey.value]
      ? amCustomize.value[pageRenderKey.value][stepKey].translations[label][langKey.value]
      : amLabels[label]
  })

  return computedLabel.value
}

onMounted(() => {
})

function setSelectedDate (value) {
  unselectDate()

  for (let i = 0; i < 18; i++) {
    if (i > 8 && i < 17) {
      calendarEventSlots.value.push(`${i < 10 ? '0'+i:i}:00`)
      calendarEventSlots.value.push(`${i < 10 ? '0'+i:i}:30`)
    }

  }

  if (calendarEventSlots.value.length) {
    setSelectedTime(calendarEventSlots.value[0])
  }
}

function unselectDate () {
  calendarEventBusySlots.value = amCustomize.value[pageRenderKey.value].dateTimeStep.options.busyTimeSlotsVisibility.visibility ?
      ['08:00', '08:30', '09:30', '12:30', '14:00'] : []

  calendarEventSlots.value = []

  calendarEventSlot.value = ''
}

function setSelectedTime (value) {

  calendarEventSlot.value = value
}

</script>

<script>
export default {
  name: 'DateTimeStep',
  key: 'dateTimeStep',
  sidebarData: {
    label: 'date_time',
    icon: 'date-time',
    stepSelectedData: [],
    finished: false,
    selected: false,
  }
}
</script>

<style lang="scss">
// am -- amelia
// fs -- form steps

#amelia-app-backend-new #amelia-container {
  // Amelia Form Steps
  .am-fs {

    // Container Wrapper
    &__main {
      &-heading {
        &-inner {
          display: flex;
          align-items: center;

          .am-heading-prev {
            margin-right: 12px;
          }
        }
      }

      &-inner {
        &#{&}-dt {
          padding: 0 20px;
        }
      }
    }

    &-dt__rec_popup {
      margin: 16px 0 48px 0;
      & > p {
        font-size: 15px;
        line-height: 1.6;
        color: var(--am-c-main-text);

        &:first-child {
          font-weight: 500;
          margin-bottom: 7px;
        }

        &:last-child {
          font-weight: 400;
        }
      }
    }
  }

  // Skeleton
  .am-skeleton-slots {

    &-mobile {
      padding: 16px;
    }

    &-filters {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      padding: 0 0 24px;

      .el-skeleton__item {
        height: 36px;
        width: 20%;
      }

      :first-child {
        width: 26%;
        margin-right: 16px;
      }

      :last-child {
        width: 16%;
        margin-left: 16px;
      }
    }

    &-weekdays {
      padding-bottom: 12px;
      display: flex;
      flex-direction: row;
      justify-content: space-around;

      .el-skeleton__item {
        max-width: 30px;
        height: 24px;
      }
    }

    &-days {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
      gap: 8px;

      .el-skeleton__item {
        margin: 0 1.5px;
        height: 40px;
        max-width: 56px;
      }
    }
  }
}
</style>
