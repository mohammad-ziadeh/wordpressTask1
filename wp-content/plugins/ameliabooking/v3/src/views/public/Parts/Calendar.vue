<template>
  <div v-if="!calendarSlotsLoading" class="am-fs-dt__calendar">
    <AmAdvancedSlotCalendar
      :id="props.id"
      :slots="calendarEvents"
      :calendar-minimum-date="calendarMinimumDate"
      :calendar-maximum-date="calendarMaximumDate"
      :not-multiple="props.notMultiple"
      :end-time="props.endTime"
      :time-zone="props.timeZone"
      :show-busy-slots="props.showBusySlots"
      :nested-item="nested"
      :label-slots-selected="props.labelSlotsSelected"
      :busyness="busyness"
      :date="props.date"
      :service-id="props.serviceId"
      :tax-visibility="props.taxVisibility"
      :tax-label="props.taxLabel"
      :tax-label-incl="props.taxLabelIncl"
      @selected-date="setSelectedDate"
      @selected-time="setSelectedTime"
      @changed-month="changeMonth"
      @rendered-month="renderedMonth"
      @unselect-date="unselectDate"
      @selected-duration="setSelectedDuration"
    ></AmAdvancedSlotCalendar>
  </div>

  <!-- Skeleton -->
  <el-skeleton v-else animated class="am-skeleton-slots" :class="checkScreen ? 'am-skeleton-slots-mobile':''">
    <template #template>
      <div class="am-skeleton-slots-filters">
        <el-skeleton-item v-for="item in new Array(4)" :key="item" variant="text" />
      </div>
      <div class="am-skeleton-slots-weekdays">
        <el-skeleton-item v-for="item in new Array(7)" :key="item" variant="text" />
      </div>
      <div class="am-skeleton-slots-days">
        <el-skeleton-item v-for="item in new Array(42)" :key="item" variant="text" />
      </div>
    </template>
  </el-skeleton>
  <!-- /Skeleton -->
</template>

<script setup>
// * Import from Vue
import {
  ref,
  provide,
  inject,
  computed,
  watch,
  nextTick
} from "vue";

// * Import from vuex
import { useStore } from "vuex";

//  * Dedicated component
import AmAdvancedSlotCalendar from "../../_components/advanced-slot-calendar/AmAdvancedSlotCalendar";

// * Composables
import {
  useCartItem,
} from "../../../assets/js/public/cart.js";
import {
  useCalendarEvents,
  useDuration,
} from "../../../assets/js/common/appointments.js";
import { useAppointmentSlots } from "../../../assets/js/public/slots";

// * Component props
const props = defineProps({
  slotsParams: {
    type: Object,
    default: () => {}
  },
  id: {
    type: Number,
    default: 0
  },
  serviceId: {
    type: Number,
    default: 0
  },
  date: {
    type: String,
    default: ''
  },
  loadCounter: {
    type: Number,
    default: 0
  },
  preselectSlot: {
    type: Boolean,
    default: false
  },
  notMultiple: {
    type: Boolean,
    default: true
  },
  endTime: {
    type: Boolean,
    default: true
  },
  timeZone: {
    type: Boolean,
    default: true
  },
  labelSlotsSelected: {
    type: String,
    default: ''
  },
  fetchedSlots: {
    type: Object,
    default: () => {}
  },
  inCollapse: {
    type: Boolean,
    default: false
  },
  showBusySlots: {
    type: Boolean,
    default: false
  },
  taxVisibility: {
    type: Boolean,
    default: false
  },
  taxLabel: {
    type: String,
    default: ''
  },
  taxLabelIncl: {
    type: String,
    default: ''
  }
})

const emits = defineEmits([
  'loadingSlots'
])

let nested = computed(() => {
  return {
    inCollapse: props.inCollapse
  }
})

const store = useStore()

let searchStart = ref(null)

let searchEnd = ref(null)

let selectedYearMonth = ref('')

function loadSlots (customCallback) {
  let range = useRange(store)

  if (range) {
    searchStart.value = range.start

    searchEnd.value = range.end
  }

  getSlots(customCallback)
}

watch(() => props.loadCounter, () => {
  loadSlots(() => {})
})

let cWidth = inject('containerWidth', 0)

let checkScreen = computed(() => cWidth.value < 560 || (cWidth.value - 240 < 520))

let busyness = computed(() => store.getters['booking/getBusyness'])

/*****************
 * Calendar Data *
 ****************/

let calendarMinimumDate = ref(null)

let calendarMaximumDate = ref(null)

let calendarSlotsLoading = ref(true)

let calendarEvents = ref([])

let calendarEventSlots = ref([])

let calendarEventBusySlots = ref([])

let calendarEventSlot = ref('')

let calendarStartDate = ref(null)

let calendarChangeSideBar = inject('calendarChangeSideBar')

let calendarSlotDuration = inject('calendarSlotDuration')

let calendarServiceDuration = inject('calendarServiceDuration')

let useSlotsCallback = inject('useSlotsCallback')
let useSelectedDuration = inject('useSelectedDuration')
let useSelectedDate = inject('useSelectedDate')
let useBusySlots = inject('useBusySlots')
let useSelectedTime = inject('useSelectedTime')
let useDeselectedDate = inject('useDeselectedDate')
let useRange = inject('useRange')

provide('calendarEvents', calendarEvents)

provide('calendarEventSlots', calendarEventSlots)

provide('calendarEventBusySlots', calendarEventBusySlots)

provide('calendarEventSlot', calendarEventSlot)

provide('calendarStartDate', calendarStartDate)

provide('calendarChangeSideBar', calendarChangeSideBar)


/*********
 * Other *
 ********/

function setSelectedDuration (value) {
  store.commit('booking/setBookingDuration', value)

  let cartItem = useCartItem(store)

  let service = store.getters['entities/getService'](cartItem.serviceId)

  let extrasIds = store.getters['booking/getSelectedExtras'].map(i => i.extraId)

  calendarSlotDuration.value = useDuration(value, service.extras.filter(i => extrasIds.includes(i.id)))

  calendarServiceDuration.value = value

  nextTick(() => {
    getSlots(() => {})
  })
}

function setSelectedDate (value) {
  calendarEventSlots.value = useSelectedDate(
    store,
    value,
    {
      start: searchStart.value,
      end: searchEnd.value,
    }
  )

  calendarEventBusySlots.value = useBusySlots(store)

  if (props.preselectSlot && calendarEventSlots.value.length) {
    setSelectedTime(calendarEventSlots.value[0])
  }
}

function setSelectedTime (value) {
  useSelectedTime(store, value)

  calendarEventSlot.value = value
}

function unselectDate () {
  useDeselectedDate(store)

  calendarEventSlots.value = []

  calendarEventSlot.value = ''
}

function changeMonth (yearMonth) {
  selectedYearMonth.value = yearMonth

  getSlots(() => {})
}

function renderedMonth (data) {
  searchStart.value = data.start

  searchEnd.value = data.end
}

function getSlotsCallback (slots, occupied, minimumDateTime, maximumDateTime, busyness, appCount, lastBookedProviderId, customCallback) {
  calendarMinimumDate.value = minimumDateTime
  calendarMaximumDate.value = maximumDateTime

  calendarEvents.value = useCalendarEvents(slots)

  let result = useSlotsCallback(
    store,
    slots,
    occupied,
    minimumDateTime,
    maximumDateTime,
    busyness,
    appCount,
    lastBookedProviderId,
    searchStart,
    searchEnd
  )

  if ('calendarStartDate' in result) {
    calendarStartDate.value = selectedYearMonth.value ? selectedYearMonth.value + '-01' : result.calendarStartDate
  }

  if ('calendarEventSlot' in result) {
    calendarEventSlot.value = result.calendarEventSlot
  }

  if ('calendarEventSlots' in result) {
    calendarEventSlots.value = result.calendarEventSlots
  }

  nextTick(() => {
    customCallback()

    calendarSlotsLoading.value = false

    emits('loadingSlots', false)
  })
}

function getSlots (customCallback) {
  calendarSlotsLoading.value = true

  emits('loadingSlots', true)

  useAppointmentSlots(
    Object.assign(
      {
        startDateTime: searchStart.value,
        endDateTime: searchEnd.value,
      },
      props.slotsParams
    ),
    props.fetchedSlots,
    getSlotsCallback,
    customCallback
  )
}

function unsetData () {
  calendarEventSlots.value = []

  calendarEventSlot.value = ''
}

defineExpose({
  loadSlots,
  unsetData,
  calendarSlotsLoading
})
</script>

<script>
export default {
  name: 'CalendarBlock',
}
</script>

<style lang="scss">
// am -- amelia
// fs -- form steps

.amelia-v2-booking #amelia-container {
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
  }

  // Skeleton
  .am-skeleton-slots {

    &-mobile {
      padding: 0px;

      .am-skeleton-slots-days {
        gap: 6px;

        .el-skeleton__item {
          height: 28px;
          max-width: 56px;
        }
      }

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
