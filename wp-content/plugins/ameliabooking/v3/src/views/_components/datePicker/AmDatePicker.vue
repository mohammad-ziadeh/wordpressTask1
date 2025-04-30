<template>

  <!-- Date Picker -->
  <div
    class="am-date-picker-wrapper"
    :class="`am-date-picker--${size}`"
  >
    <div
      v-if="props.customInputDisplay && props.type === 'daterange' && model.length"
      class="am-date-picker__input"
      :class="`am-date-picker--${size}`"
      @click="triggerCalendar"
    >
      <span class="am-icon-calendar"></span>
      <div class="am-date-picker__input-inner">
        <span class="am-date-picker__input-start">
          {{ getFrontedFormattedDate(moment(model[0]).format('YYYY-MM-DD')) }}
        </span>
        <span class="am-date-picker__input-separator">
          -
        </span>
        <span class="am-date-picker__input-end">
          {{ getFrontedFormattedDate(moment(model[1]).format('YYYY-MM-DD')) }}
        </span>
      </div>
    </div>
    <el-config-provider :locale="elementPlusTranslations(props.lang)">
      <el-date-picker
        v-bind="filteredProps"
        :id="id"
        ref="amDatePicker"
        v-model="model"
        :type="type"
        :value="value"
        :prefix-icon="prefixIcon"
        :popper-class="popperClass"
        :placeholder="placeholder"
        :clear-icon="clearIcon"
        :default-value="defaultValue"
        :clearable="clearable"
        :disabled-date="disabledDate"
        :disabled="disabled"
        :value-format="valueFormat"
        :format="format"
        :editable="editable"
        class="am-date-picker"
        :popper-style="cssVars"
        :style="cssVars"
        :class="[`am-date-picker--${size}`, {'am-date-picker--disabled': disabled}, {'am-date-picker--custom': props.type === 'daterange' && props.customInputDisplay}]"
        @input="(eventValue) => $emit('input', eventValue)"
        @change="(eventValue) => $emit('change', eventValue)"
        @blur="(e) => $emit('blur', e)"
        @focus="(e) => $emit('focus', e)"
        @calendar-change="(e) => $emit('calendar-change', e)"
        @panel-change="(e) => $emit('panel-change', e)"
      ></el-date-picker>
    </el-config-provider>
  </div>
  <!-- /Date Picker -->

</template>

<script setup>
// * Import from Vue
import {
  computed,
  ref,
  toRefs,
  inject,
} from "vue";

// * Libraries
import moment from "moment";

// * components
import AmeliaIconClose from "../icons/IconClose";
import AmeliaIconCalendar from "../icons/IconCalendar";

// * Composables
import { useColorTransparency } from "../../../assets/js/common/colorManipulation";
import { elementPlusTranslations } from "../../../assets/js/common/translationsElementPlus";
import { getFrontedFormattedDate } from "../../../assets/js/common/date";

/**
 * Component Props
 */
const props = defineProps({
  id: {
    type: String
  },
  modelValue: {
    type: [String, Array, Object, Number],
  },
  type: {
    type: String,
    default: 'date'
  },
  defaultValue: {
    type: [String, Array, Object, Number],
  },
  valueFormat: {
    type: String
  },
  value: {
    type: [String, Array, Object, Number],
  },
  format: {
    type: String
  },
  editable: {
    type: Boolean,
    default: true
  },
  disabled: {
    type: Boolean,
    default: false
  },
  size: {
    // default / medium / small / mini / micro
    type: String,
    default: 'default',
    validator(value) {
      return ['default', 'medium', 'small', 'mini', 'micro'].includes(value)
    }
  },
  clearable: {
    type: Boolean,
    default: false
  },
  name: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: 'Select Date'
  },
  popperClass: {
    type: String,
    default: ''
  },
  teleported: {
    type: Boolean,
    default: true
  },
  clearIcon: {
    type: [String, Object],
    default: AmeliaIconClose
  },
  prefixIcon: {
    type: [String, Object],
    default: AmeliaIconCalendar
  },
  disabledDate: {
    type: Function,
    default: () => {}
  },
  lang: {
    type: String,
    default: ''
  },
  customInputDisplay: {
    type: Boolean,
    default: false
  }
})

const unrefProps = (props) => {
  const unref = {};
  for (const key in props) {
    unref[key] = props[key].value; // Get the value of each ref
  }
  return unref;
};

const { size, ...filteredProps } = unrefProps(toRefs(props));

/**
 * Component Emits
 * */
const emits = defineEmits(['change', 'input', 'visible-change', 'remove-tag', 'clear', 'blur', 'focus', 'calendar-change', 'panel-change', 'update:modelValue'])

/**
 * Component model
 */
let { modelValue } = toRefs(props)
let model = computed({
  get: () => modelValue.value,
  set: (val) => {
    emits('update:modelValue', val)
  }
})

/**
 * Component reference
 */
const amDatePicker = ref(null)

function triggerCalendar () {
  if (amDatePicker.value) {
    amDatePicker.value.focus()
  }
}

// * Colors block
let amColors = inject('amColors');

let cssVars = computed(() => {
  return {
    '--am-c-primary': amColors.value.colorPrimary,
    '--am-c-success': amColors.value.colorSuccess,
    '--am-c-error': amColors.value.colorError,
    '--am-c-warning': amColors.value.colorWarning,
    '--am-c-main-bgr': amColors.value.colorMainBgr,
    '--am-c-main-heading-text': amColors.value.colorMainHeadingText,
    '--am-c-main-text': amColors.value.colorMainText,
    '--am-c-sb-bgr': amColors.value.colorSbBgr,
    '--am-c-sb-text': amColors.value.colorSbText,
    '--am-c-inp-bgr': amColors.value.colorInpBgr,
    '--am-c-inp-border': amColors.value.colorInpBorder,
    '--am-c-inp-text': amColors.value.colorInpText,
    '--am-c-inp-text-op03': useColorTransparency(amColors.value.colorInpText, 0.03),
    '--am-c-inp-text-op60': useColorTransparency(amColors.value.colorInpText, 0.6),
    '--am-c-inp-placeholder': amColors.value.colorInpPlaceHolder,
    '--am-c-drop-bgr': amColors.value.colorDropBgr,
    '--am-c-drop-text': amColors.value.colorDropText,
    '--am-c-drop-text-op03': useColorTransparency(amColors.value.colorDropText, 0.03),
    '--am-c-drop-text-op10': useColorTransparency(amColors.value.colorDropText, 0.1),
    '--am-c-drop-text-op30': useColorTransparency(amColors.value.colorDropText, 0.3),
    '--am-c-drop-text-op50': useColorTransparency(amColors.value.colorDropText, 0.5),
    '--am-c-drop-text-op70': useColorTransparency(amColors.value.colorDropText, 0.7),
    '--am-c-drop-text-op80': useColorTransparency(amColors.value.colorDropText, 0.8),
    '--am-c-drop-border': amColors.value.colorDropBorder,
    '--am-c-btn-prim': amColors.value.colorBtnPrim,
    '--am-c-btn-prim-text': amColors.value.colorBtnPrimText,
    '--am-c-btn-sec': amColors.value.colorBtnSec,
    '--am-c-btn-sec-text': amColors.value.colorBtnSecText,
    '--am-c-btn-danger': amColors.value.colorBtnDanger,
    '--am-c-btn-danger-text': amColors.value.colorBtnDangerText,
    '--am-c-skeleton-op20': useColorTransparency(amColors.value.colorMainText, 0.2),
    '--am-c-skeleton-op60': useColorTransparency(amColors.value.colorMainText, 0.6),
    '--am-c-skeleton-sb-op20': useColorTransparency(amColors.value.colorSbText, 0.2),
    '--am-c-skeleton-sb-op60': useColorTransparency(amColors.value.colorSbText, 0.6),
  }
})
</script>

<style lang="scss">
@mixin am-datepicker-block {

  // Date Picker Wrapper
  .am-date-picker-wrapper {
    text-align: center;
    flex: 1;

    &.am-date-picker {
      &--default {
        height: 40px;
      }

      &--small {
        height: 32px;
      }
    }

    &:last-child {
      border-right: none;
    }

    .el-input {
      width: 100%;
      * {
        color: var(--am-c-inp-text);
      }

      .el-input__inner {
        outline: none;
        border-radius: 6px;
        background: var(--am-c-inp-bgr);
        border-color: var(--am-c-inp-border);
        color: var(--am-c-inp-text);
        padding-left: 31px !important;

        &:focus {
          border-color: var(--am-c-btn-prim);
        }

        &::-webkit-input-placeholder {
          color: var(--am-c-inp-placeholder);
        }
      }

      &__inner {
        background: var(--am-c-inp-bgr);
        border: 1px solid var(--am-c-inp-border);
      }

      &.is-disabled {
        .el-input__inner {
          background: var(--am-c-inp-text-op03);
          color: var(--am-c-inp-text-op60);
        }
      }

      // Size - default / medium / small / mini / micro
      &--default .el-input__inner {
        height: 40px;
      }
      &--medium .el-input__inner {
        height: 36px;
      }
      &--small .el-input__inner {
        height: 32px;
      }

      &__prefix {
        left: 10px;
        line-height: 32px;

        &-inner {
          display: flex;
          align-items: center;

          .am-icon-calendar {
            font-size: 20px;
          }
        }

        .el-icon {
          ::before {
            color: var(--am-c-inp-placeholder);
          }
        }
      }

      &__suffix {
        &-inner {
          display: flex;
          align-items: center;
        }
      }
    }

    .am-date-picker {
      &--default {
        height: 40px;
      }

      &__input {
        display: flex;
        align-items: center;
        width: 100%;
        outline: none;
        border: 1px solid var(--am-c-inp-border);
        border-radius: 6px;
        background: var(--am-c-inp-bgr);
        color: var(--am-c-inp-text);
        padding-left: 10px;
        cursor: pointer;

        &-inner {
          display: flex;
          align-items: center;
          justify-content: space-evenly;
          width: 100%;
        }

        &-start, &-end, &-separator {
          font-size: 14px;
          font-weight: 500;
          background-color: transparent;
        }

        .am-icon-calendar {
          font-size: 20px;
          color: var(--am-c-capf-text);
        }

        &.am-date-picker {
          &--small {
            min-height: 32px;
          }
        }
      }

      &--custom {
        height: 0 !important;
        overflow: hidden;
        border: none;
        position: relative;
        top: -16px;
      }
    }

    .el-range {
      &-input {
        background-color: transparent;
        color: var(--am-c-inp-text);
        font-size: var(--am-fs-input);
      }

      &__icon {
        font-size: 24px;
        color: var(--am-c-inp-text);
      }
    }
  }
}

.el-picker-panel {
  background-color: var(--am-c-drop-bgr);
  color: var(--am-c-drop-text);
  border: 1px solid var(--am-c-drop-border);

  &__icon-btn {
    color: var(--am-c-drop-text);

    &:hover {
      color: var(--am-c-btn-prim)
    }
  }

  &__content {
    &.is-left {
      border-right: 1px solid var(--am-c-drop-text-op10);
    }
    table, table td, table tr, table tr:is(.el-date-table__row) {
      border: none !important;
    }
    table tr:not(.el-date-table__row) th {
      color: var(--am-c-drop-text-op70);
      border: none !important;
      border-bottom: 1px solid var(--am-c-drop-text-op10) !important;
    }
    table {
      td.today .el-date-table-cell__text {
        color: var(--am-c-drop-text);
      }
      td.current:not(.disabled) .el-date-table-cell__text {
        background: var(--am-c-btn-prim);
      }
      td.available:hover > div > span {
        background: var(--am-c-drop-text);
        border-radius: 50%;
        color: var(--am-c-drop-bgr);
      }
      td.in-range > .el-date-table-cell {
        background-color: var(--am-c-drop-text-op10);
      }
      td.in-range:hover > .el-date-table-cell {
        background-color: var(--am-c-drop-text-op50);
      }
      td.end-date .el-date-table-cell__text, td.start-date .el-date-table-cell__text {
        color: var(--am-c-drop-bgr);
        background-color: var(--am-c-drop-text-op80);
      }
      td.today.start-date .el-date-table-cell__text {
        color: var(--am-c-drop-bgr);
      }
      td.prev-month, td.next-month {
        color: var(--am-c-drop-text-op30);
      }

      td.disabled .el-date-table-cell {
        color: var(--am-c-drop-text-op30);
        background-color: var(--am-c-drop-text-op03);
      }
    }
  }

  .d-arrow-left, .d-arrow-right {
    display: none;
  }
}

.el-date-picker__header {
  text-align: center;
  margin: 12px;

  .el-picker-panel__icon-btn {
    padding: 0;
  }

  .el-date-picker {
    padding: 0;
    font-size: 12px;
    color: #303133;
    cursor: pointer;
    margin-top: 8px;
    border-width: 0;
    border-style: initial;
    border-color: initial;
    border-image: initial;
    //background: transparent;
    outline: none;

    &__prev-btn {
      float: left;
    }

    &__next-btn {
      float: right;
    }
    &__prev-btn:focus, &__next-btn:focus {
      //background: transparent;
      outline: none;
    }
  }
  &-label:hover {
    color: var(--am-c-btn-prim);
  }
}

.el-popper {
  &.el-picker__popper {
    &[data-popper-placement^="top"],
    &[data-popper-placement^="bottom"],
    &[data-popper-placement^="left"],
    &[data-popper-placement^="right"] {
      .el-popper__arrow {
        display: none;
      }
    }
  }
}

// public
.amelia-v2-booking #amelia-container {
  @include am-datepicker-block;
}

// admin
#amelia-app-backend-new #amelia-container {
  @include am-datepicker-block;
}
</style>