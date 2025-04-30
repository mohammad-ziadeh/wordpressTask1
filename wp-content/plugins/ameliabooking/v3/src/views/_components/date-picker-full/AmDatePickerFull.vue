<template>
  <!-- Date Picker -->
  <el-popover
    ref="popoverRef"
    v-model:visible="visible"
    popper-class="am-popover-calendar"
    placement="bottom"
    :width="checkScreen ? 320 : 320"
    :popper-style="cssPopVars"
    :disabled="props.disabled"
    :persistent="props.persistent"
    @after-enter="reRenderCalendar"
  >
    <template #reference>
      <AmInput
        v-model="selectedDate"
        class="am-dp__input"
        :disabled="props.disabled"
        :icon-start="IconCalendar"
        :read-only="props.readOnly"
        :clearable="props.clearable"
        :placeholder="inputPlaceholder"
        @click="selectCalendar"
        @clear="clearCalendar"
        @keypress.prevent
      ></AmInput>
    </template>
    <div class="am-dp__wrapper" :style="cssVars">
      <FullCalendar
        ref="popCalendarRef"
        v-click-outside="onClickOutside"
        class="am-dp"
        :am-mobile="checkScreen"
        :options="options"
      ></FullCalendar>
    </div>
  </el-popover>
  <!-- /Date Picker -->
</template>

<script setup>
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import allLocales from "@fullcalendar/core/locales-all";
import { shortLocale } from "../../../plugins/settings";
import { onBeforeMount, onMounted, computed, inject, ref, nextTick } from "vue";
import { useColorTransparency } from "../../../assets/js/common/colorManipulation";
import AmInput from "../input/AmInput";
import IconCalendar from '../icons/IconCalendar.vue'
import { getFrontedFormattedDate } from "../../../assets/js/common/date";
import moment from "moment";
import { ClickOutside as vClickOutside } from "element-plus";

/**
 * Component Props
 * @type {Readonly<ExtractPropTypes<{}>>}
 */
const props = defineProps({
  initialView: {
    type: String,
    default: 'dayGridMonth'
  },
  weekDaysVisibility: {
    type: Boolean,
    default: true
  },
  calendarMinimumDate: {
    type: String,
    default: ''
  },
  calendarMaximumDate: {
    type: String,
    default: ''
  },
  id: {
    type: Number,
    default: 0
  },
  disabled: {
    type: Boolean,
    default: true
  },
  inputPlaceholder: {
    type: String,
    default: ''
  },
  existingDate: {
    type: [String, Object],
    default: ''
  },
  persistent: {
    type: Boolean,
    default: true
  },
  weekStartsFromDay: {
    type: [String, Number],
    default: 1
  },
  clearable: {
    type: Boolean,
    default: false
  },
  readOnly: {
    type: Boolean,
    default: true
  }
})

let popoverRef = ref(null)
let popCalendarRef = ref(null)

// Container Width
let cWidth = inject('containerWidth', 0)
let checkScreen = computed(() => cWidth.value < 560 || (cWidth.value - 240 < 520))

const emits = defineEmits([
  'selectedDate',
  'clearDate'
])

const visible = ref(false)

let nonFormattedSelectedDate = ref(props.existingDate)

let selectedDate = ref('')

let minimumDate = ref(null)
let maximumDate = ref(null)

function selectCalendar () {
  if (!props.disabled) {
    visible.value = !visible.value
  }
}

const options = ref({
  initialDate: props.calendarMinimumDate ? moment(props.calendarMinimumDate, 'YYYY-MM-DD HH:mm').toDate() : null,
  locales: allLocales,
  locale: shortLocale,
  plugins: [dayGridPlugin, interactionPlugin],
  initialView: props.initialView,
  headerToolbar: {
    start: 'title',
    center: '',
    end: 'prevYear,prev,next,nextYear'
  },
  weekends: props.weekDaysVisibility,
  views: {
    dayGridMonth: {},
  },
  slotLabelFormat: {
    hour: 'numeric',
    minute: '2-digit',
    hour12: false
  },
  eventTimeFormat: {
    hour: 'numeric',
    minute: '2-digit',
    hour12: false
  },
  aspectRatio: 1.45,
  firstDay: props.weekStartsFromDay,
  dayMaxEvents: true,
  selectLongPressDelay: 0,
  dayHeaderClassNames: calendarDayHeaderClassBuilder,
  dayCellClassNames: calendarDayClassBuilder,
  dateClick: calendarDateClick
})

function calendarDayHeaderClassBuilder (data) {
  let classCollector = [`am-dp__${data.view.type}-header-cell`];

  // * Week days class
  if (data.date.getDay() === 0 || data.date.getDay() === 6) {
    classCollector.push(`am-dp__${data.view.type}-header-weekend`);
  }

  return classCollector;
}

function calendarDayClassBuilder (data) {
  let classCollector = [`am-dp__${data.view.type}-cell`]

  if (moment(data.date).isSameOrBefore(minimumDate.value) || moment(data.date).isSameOrAfter(maximumDate.value)) {
    classCollector.push(`am-dp__${data.view.type}-disabled`)
  }

  if (moment(data.date).format('YYYY-MM-DD') === moment(nonFormattedSelectedDate.value).format('YYYY-MM-DD')) {
    classCollector.push(`am-dp__${data.view.type}-selected`)
  }

  return classCollector;
}

function calendarDateClick (data) {
  const popCalendar = popCalendarRef.value.getApi()
  const popCalendarType = popCalendar.currentData.currentViewType
  let disabledDayClass = `am-dp__${popCalendarType}-disabled`
  let selectedDayClass = `am-dp__${popCalendarType}-selected`

  if (popCalendar.el.querySelectorAll(`.${selectedDayClass}`).length) {
    for (let i = 0; i < popCalendar.el.querySelectorAll(`.${selectedDayClass}`).length; i++) {
      popCalendar.el.querySelectorAll(`.${selectedDayClass}`)[i].classList.remove(selectedDayClass)
    }
  }

  if (!data.dayEl.classList.contains(disabledDayClass)) {
    emits('selectedDate', data.dateStr)
    nonFormattedSelectedDate.value = data.date
    selectedDate.value = getFrontedFormattedDate(data.dateStr)
    data.dayEl.classList.add(selectedDayClass)
    visible.value = false
  }
}

function onClickOutside () {
  visible.value = false
}

function reRenderCalendar () {
  nextTick(() => {
    popCalendarRef.value.getApi().render()
  })
}

function selectDate (date) {
  if (date) {
    selectedDate.value = getFrontedFormattedDate(moment(date).format('YYYY-MM-DD'))
  }
}

function clearCalendar () {
  emits('clearDate')
  setTimeout(() => {
    const popCalendar = popCalendarRef.value.getApi()
    const popCalendarType = popCalendar.currentData.currentViewType
    let selectedDayClass = `am-dp__${popCalendarType}-selected`

    if (popCalendar.el.querySelectorAll(`.${selectedDayClass}`).length) {
      for (let i = 0; i < popCalendar.el.querySelectorAll(`.${selectedDayClass}`).length; i++) {
        popCalendar.el.querySelectorAll(`.${selectedDayClass}`)[i].classList.remove(selectedDayClass)
      }
    }

    popCalendar.unselect()
  }, 200)
}

// * Color Vars
let amColors = inject('amColors',  {
  amColors: {
    value: {
      colorPrimary: '#1246D6',
      colorSuccess: '#019719',
      colorError: '#B4190F',
      colorWarning: '#CCA20C',
      colorMainBgr: '#FFFFFF',
      colorMainHeadingText: '#33434C',
      colorMainText: '#1A2C37',
      colorSbBgr: '#17295A',
      colorSbText: '#FFFFFF',
      colorInpBgr: '#FFFFFF',
      colorInpBorder: '#D1D5D7',
      colorInpText: '#1A2C37',
      colorInpPlaceHolder: '#1A2C37',
      colorDropBgr: '#FFFFFF',
      colorDropBorder: '#D1D5D7',
      colorDropText: '#0E1920',
      colorCalCell: '#1246D6',
      colorCalCellText: '#1246D6',
      colorCalCellSelected: '#1246D6',
      colorCalCellSelectedText: '#FFFFFF',
      colorCalCellDisabled: '#B4190F',
      colorCalCellDisabledText: '#1A2C37',
      colorBtnPrim: '#265CF2',
      colorBtnPrimText: '#FFFFFF',
      colorBtnSec: '#1A2C37',
      colorBtnSecText: '#FFFFFF',
    }
  }
})

let cssPopVars = computed(() => {
  return {
    '--am-c-date-picker-bgr': amColors.value.colorMainBgr,
    '--am-c-date-picker-border': amColors.value.colorMainBgr,
  }
})

let cssVars = computed(() => {
  return {
    '--am-c-advsc-text': amColors.value.colorMainText,
    '--am-c-advsc-text-op60': useColorTransparency(amColors.value.colorMainText, 0.6),
    '--am-c-advsc-btn-border': amColors.value.colorBtnSec,
    '--am-c-advsc-btn-border-op60': useColorTransparency(amColors.value.colorBtnSec, 0.6),
    '--am-c-cal-init': amColors.value.colorCalCell,
    '--am-c-cal-init-text': amColors.value.colorCalCellText,
    '--am-c-cal-init-op10': useColorTransparency(amColors.value.colorCalCell, 0.1),
    '--am-c-cal-init-op20': useColorTransparency(amColors.value.colorCalCell, 0.2),
    '--am-c-cal-init-op60': useColorTransparency(amColors.value.colorCalCell, 0.6),
    '--am-c-cal-selected': amColors.value.colorCalCellSelected,
    '--am-c-cal-selected-text': amColors.value.colorCalCellSelectedText,
    '--am-c-cal-selected-op80': useColorTransparency(amColors.value.colorCalCellSelected, 0.8),
    '--am-c-cal-disabled': amColors.value.colorCalCellDisabled,
    '--am-c-cal-disabled-text': amColors.value.colorCalCellDisabledText,
    '--am-c-cal-disabled-op10': useColorTransparency(amColors.value.colorCalCellDisabled, 0.1),
    '--am-c-cal-disabled-op60': useColorTransparency(amColors.value.colorCalCellDisabled, 0.4),
  }
})

onBeforeMount(() => {
  if (props.calendarMinimumDate) {
    minimumDate.value = moment(props.calendarMinimumDate, 'YYYY-MM-DD HH:mm')
  }
  if (props.calendarMaximumDate) {
    maximumDate.value = moment(props.calendarMaximumDate, 'YYYY-MM-DD HH:mm')
  }
})

onMounted(() => {
  nextTick(() => {
    selectDate(props.existingDate)
  })
})
</script>

<script>

</script>
<style lang="scss">
//Amelia Calendar
$amCalClass: am-dp;
@mixin am-dp-block {
  .am-dp {
    margin-bottom: 4px;

    &__wrapper {
      --am-fs-advsc: 15px;
      --am-ln-advsc: 1.6;
      --am-c-advsc-text: var(--am-c-main-text);
      // Calendar cell
      --am-c-advsc-cell-bgr: transparent;
      --am-c-advsc-cell-border: transparent;
      --am-c-advsc-cell-text: var(--am-c-cal-init-text);
      // Slot
      --am-fs-asdvsc-slot: 15px;
      --am-c-advsc-slot-text: var(--am-c-cal-init-text);
      --am-rad-advsc-slot: 4px;
      * {
        font-family: var(--am-font-family);
        box-sizing: border-box;
      }
      & > div {
        $count: 5;
        @for $i from 0 through $count {
          &:nth-child(#{$i + 1}) {
            animation: 600ms cubic-bezier(.45,1,.4,1.2) #{$i*100}ms am-animation-slide-up;
            animation-fill-mode: both;
          }
        }
      }
    }

    table, tr, th {
      background-color: transparent;
      margin: 0;
    }

    &.fc {
      &-theme-standard {
        .fc {
          &-scrollgrid {
            border: none;

            &-section {
              &-header {
                table {
                  border: none;
                }
              }
            }
          }

          &-toolbar {
            margin-bottom: 8px;

            &-title {
              font-size: 20px;
              color: var(--am-c-advsc-text);
            }

            &-chunk {
              .fc-button {
                background-color: transparent;
                border: none;
                //border-color: var(--am-c-advsc-btn-border-op60);
                color: var(--am-c-advsc-btn-border);
                padding: 2px 4px;
                margin: 0 4px;

                &:hover {
                  color: var(--am-c-advsc-btn-border-op60);
                }

                &:focus {
                  border: none;
                  box-shadow: none;
                }
              }
            }
          }
        }

        th, td {
          border: none;
        }

        // Calendar header cell
        th.#{$amCalClass} {
          // Month View
          &__dayGridMonth {
            &-header {
              &-cell {
                font-size: 16px;
                line-height: 1.5;
                color: var(--am-c-advsc-text);
                padding: 4px 6px;

                .fc-col-header-cell-cushion {
                  font-size: var(--am-fs-advsc);
                  text-transform: initial;
                  text-decoration: none;
                  line-height: 1;
                  letter-spacing: 0;
                  color: var(--am-c-advsc-text);
                  padding: 6px 0;
                  white-space: nowrap;
                }
              }
              &-weekend {
                color: #D1D5D7;
              }
            }
          }
        }

        // Calendar cell
        td.#{$amCalClass} {
          // Month view
          &__dayGridMonth {
            // Calendar cell
            &-cell {
              position: relative;
              border: none;
              padding: 4px 6px;
              // Calendar today day
              &.fc-day-today {
                position: relative;
                background: none;
                // Calendar cell state
                &.#{$amCalClass} {
                  // Selected cell
                  &__dayGridMonth-selected {
                    .fc-daygrid-day-frame {
                      background-color: var(--am-c-advsc-cell-bgr);
                      border-color: var(--am-c-advsc-cell-border);
                      &:after {
                        background-color: var(--am-c-advsc-cell-text);
                      }
                    }
                  }
                  // Disabled cell
                  &__dayGridMonth-disabled {
                    .fc-daygrid-day {
                      &-frame {
                        --am-c-advsc-cell-bgr: var(--am-c-cal-disabled-op10);
                        --am-c-advsc-cell-border: transparent;
                        &:hover {
                          --am-c-advsc-cell-bgr: var(--am-c-cal-disabled-op10);
                          --am-c-advsc-cell-border: transparent;
                          cursor: not-allowed;
                        }
                      }
                      &-number {
                        --am-c-advsc-cell-text: var(--am-c-cal-disabled-text);
                      }
                    }
                  }
                }
                .fc-daygrid-day-frame {
                  // Today marker - dot
                  &:after {
                    content: '';
                    display: block;
                    position: absolute;
                    top: 4px;
                    right: 4px;
                    width: 4px;
                    height: 4px;
                    border-radius: 50%;
                    background-color: var(--am-c-advsc-cell-text);
                  }
                }
              }
              // Calendar cell state
              &.#{$amCalClass} {
                // Disabled cell
                &__dayGridMonth-disabled {
                  .fc-daygrid-day {
                    &-frame {
                      --am-c-advsc-cell-bgr: var(--am-c-cal-disabled-op10);
                      --am-c-advsc-cell-border: transparent;
                      &:hover {
                        --am-c-advsc-cell-bgr: var(--am-c-cal-disabled-op10);
                        --am-c-advsc-cell-border: transparent;
                        cursor: not-allowed;
                      }
                    }
                    &-number {
                      --am-c-advsc-cell-text: var(--am-c-cal-disabled-text);
                    }
                  }
                }
                // Selected cell
                &__dayGridMonth-selected {
                  .fc-daygrid-day-frame {
                    --am-c-advsc-cell-text: var(--am-c-cal-selected-text);
                    --am-c-advsc-cell-bgr: var(--am-c-cal-selected);
                    --am-c-advsc-cell-border: var(--am-c-cal-selected);
                    &:hover {
                      --am-c-advsc-cell-bgr: var(--am-c-cal-selected-op80);
                      --am-c-advsc-cell-border: var(--am-c-cal-selected-op80);
                    }
                  }
                }
                // Weekend days cell
                &__dayGridMonth-weekend {
                  .fc-daygrid-day {
                    &-frame {
                      background-color: transparent;
                      border-color: transparent;
                      &:hover {
                        border-color: transparent;
                        cursor: not-allowed;
                      }
                    }
                    &-number {
                      color: #D1D5D7;
                    }
                  }
                }
              }
              // Calendar inner cell items
              .fc-daygrid-day {
                // Calendar inner cell wrapper
                &-frame {
                  position: absolute;
                  width: calc(100% - 9px);
                  height: calc(100% - 5px);
                  min-height: auto;
                  top: 2px;
                  left: 4px;
                  background-color: var(--am-c-advsc-cell-bgr);
                  border: 1px solid var(--am-c-advsc-cell-border);
                  border-radius: 4px;
                  cursor: pointer;
                  &:hover {
                    --am-c-advsc-cell-bgr: var(--am-c-cal-init-op20);
                    --am-c-advsc-cell-border: var(--am-c-cal-init);
                    transition: all 0.3s ease-in-out;
                  }
                }
                // Calendar date slot availability wrapper
                &-bg {
                  .fc-bg-event {
                    background: none;
                    opacity: 1;
                    // Calendar date slot availability
                    /*.#{$amCalClass}__slot-wrapper {
                      position: absolute;
                      width: 100%;
                      bottom: 0;
                      left: 0;
                      background-color: rgba($primary-color, 0.3);
                    }*/
                  }
                }
                // Inner cell date wrapper
                &-top {
                  position: absolute;
                  top: 50%;
                  left: 50%;
                  transform: translate(-50%, -50%);
                }
                // Inner cell date holder
                &-number {
                  color: var(--am-c-advsc-cell-text);
                  line-height: 1;
                  padding: 0;
                  white-space: nowrap;
                  text-decoration: none;
                }
              }
            }
          }
        }
      }
    }

    // Mobile Calendar cell
    &[am-mobile=true] {
      //&.fc {
      //  &-theme-standard {
      //    td.#{$amCalClass} {
      //      // Month view
      //      &__dayGridMonth {
      //        // Calendar cell TODO
      //        &-cell {
      //          padding: 3px;
      //          .fc-daygrid-day {
      //            &-frame {
      //              width: calc(100% - 6px);
      //              height: calc(100% - 4px);
      //            }
      //          }
      //        }
      //      }
      //    }
      //
      //    .fc-toolbar-title {
      //      font-size: 18px;
      //    }
      //
      //    .fc-toolbar-chunk .fc-button {
      //      padding: 0.2em 0.3em;
      //
      //      .fc-icon {
      //        font-size: 1.25em;
      //      }
      //    }
      //  }
      //}
    }
  }
}

.am-popover-calendar {
  z-index: 999999999 !important;
  &.el-popover.el-popper {
    min-width: auto;
    background-color: var(--am-c-date-picker-bgr);
    border-color: var(--am-c-date-picker-border);
    //box-shadow: 0 2px 12px 0 var(--am-c-rsm-text-op10);
    padding: 5px;

    &.is-light {
      & .el-popper__arrow {
        &::before {
          background-color: var(--am-c-date-picker-bgr);
          border-color: var(--am-c-date-picker-bgr);
        }
      }
    }
  }

  @include am-dp-block;
}

@mixin am-dp-input-block {
  .am-dp__input {
    .am-input__default {
      i.el-input {
        &__clear {
          font-size: 14px;
        }
      }
    }
  }
}
// Public
.amelia-v2-booking #amelia-container {
  @include am-dp-input-block;
}

// Admin
#amelia-app-backend-new {
  @include am-dp-input-block;
}
</style>
