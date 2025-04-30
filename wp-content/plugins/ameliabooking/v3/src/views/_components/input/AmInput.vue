<template>
  <div
    class="am-input-wrapper"
    :style="cssVars"
  >
    <el-input
      :id="id"
      ref="amInput"
      v-model="model"
      :type="type"
      :clearable="clearable"
      :suffix-icon="iconEnd"
      :prefix-icon="iconStart"
      :class="[
        type === 'text' || type === 'email' ? 'am-input' : 'am-textarea textarea',
        size ? (type === 'text-area' ? 'am-textarea__size' : 'am-input') + '__' + size : '',
        {'is-icon-start': iconStart},
        {'is-icon-end': iconEnd}
        ]"
      :disabled="disabled"
      :controls="controls"
      :controls-position="controlsPosition"
      :name="name"
      :label="label"
      :rows="rows"
      :placeholder="placeholder"
      :readonly="readOnly"
      :show-password="showPassword"
      :validate-event="validateEvent"
      :formatter="formatter"
      :parser="parser"
      @blur="(e) => $emit('blur', e)"
      @focus="(e) => $emit('focus', e)"
      @change="(currentValue, oldValue) => $emit('change', currentValue, oldValue)"
      @input="(currentValue, oldValue) => $emit('input', currentValue, oldValue)"
      @keyup.enter="(e) => $emit('enter', e)"
      @clear="() => emits('clear')"
    >
    </el-input>
  </div>
</template>

<script setup>
import { computed, ref, toRefs, inject } from 'vue';
import { format, unformat } from 'v-money3';
import { useColorTransparency } from "../../../assets/js/common/colorManipulation";
import { useCurrencyOptions } from "../../../assets/js/common/formatting";

/**
 * Component Props
 */
const props = defineProps({
  id: {
    type: String
  },
  modelValue: {
    type: [String, Number, null, undefined]
  },
  type: {
    type: String,
    default: 'text'
  },
  size: {
    type: String,
    default: 'default',
    validator(value) {
      return ['default', 'medium', 'small'].includes(value)
    }
  },
  disabled: {
    type: Boolean,
    default: false
  },
  controls: {
    type: Boolean,
    default: true
  },
  controlsPosition: {
    // right
    type: String,
    default: ''
  },
  name: {
    type: String,
    default: ''
  },
  label: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: ''
  },
  rows: {
    type: Number,
    default: 3
  },
  iconStart: {
    type: [String, Object],
    default: ''
  },
  iconEnd: {
    type: [String, Object],
    default: ''
  },
  clearable: {
    type: Boolean,
    default: false
  },
  readOnly: {
    type: Boolean,
    default: false
  },
  showPassword: {
    type: Boolean,
    default: false
  },
  validateEvent: {
    type: Boolean,
    default: true
  },
  formatter: {
    type: Function
  },
  parser: {
    type: Function
  },
  isMoney: {
    type: Boolean,
    default: false
  }
})

/**
 * Component Emits
 * */
const emits = defineEmits(['change', 'input', 'visible-change', 'clear', 'blur', 'focus', 'update:modelValue', 'enter'])

/**
 * Component model
 */
let { modelValue } = toRefs(props)

let model = computed({
  get: () => {
    return props.isMoney ? format(modelValue.value, useCurrencyOptions()) : modelValue.value
  },
  set: (val) => {
    emits(
      'update:modelValue',
      props.isMoney ? unformat(val, { ...useCurrencyOptions(), modelModifiers: { number: true } }) : val
    )
  }
})

// * Color Vars
let amColors = inject('amColors', ref({
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
  colorInpPlaceHolder: '#808A90',
  colorDropBgr: '#FFFFFF',
  colorDropBorder: '#D1D5D7',
  colorDropText: '#0E1920',
  colorBtnPrim: '#265CF2',
  colorBtnPrimText: '#FFFFFF',
  colorBtnSec: '#1A2C37',
  colorBtnSecText: '#FFFFFF',
}))

// * Css Variables
let cssVars = computed(() => {
  return {
    '--am-c-inp-text-op03': useColorTransparency(amColors.value.colorInpText, 0.03),
    '--am-c-inp-text-op60': useColorTransparency(amColors.value.colorInpText, 0.6),
  }
})

/**
 * Component reference
 */
const amInput = ref(null)
</script>

<style lang="scss">
@mixin am-input-block {
  // Input Wrapper
  .am-input-wrapper {
    --am-input-c-bgr: var(--am-c-inp-bgr);
    --am-input-c-border: var(--am-c-inp-border);
    --am-input-c-text: var(--am-c-inp-text);
    --am-input-c-placeholder: var(--am-c-inp-placeholder);
    --am-input-border-radius: var(--am-input-border-radius);
    --am-input-font-size: var(--am-fs-input);
    --am-input-color-border: var(--am-c-inp-border);
    --am-input-padding: 8px 12px;
    width: 100%;
    position: relative;

    // Input & Textarea
    .am-input, .am-textarea {
      width: 100%;
      box-sizing: border-box;
      min-width: 100%;
      max-width: 100%;

      .el-input {
        &__inner {
          min-height: unset;

          &:not([type='text-area']) {
            width: 100%;
            height: var(--am-input-height);
            font-size: var(--am-input-font-size);
            border: 1px solid var(--am-input-c-border);
            color: var(--am-input-c-text);
            background-color: var(--am-input-c-bgr);
            border-radius: 6px;
            padding: var(--am-input-padding);
          }

          &:focus {
            --am-input-c-border: var(--am-c-btn-prim);
          }

          // Placeholder
          &::-webkit-input-placeholder {
            color: var(--am-c-inp-placeholder);
          }
          &:-ms-input-placeholder {
            color: var(--am-c-inp-placeholder);
          }
          &::placeholder {
            color: var(--am-c-inp-placeholder);
          }
        }

        &__prefix {
          &-inner {
            align-items: center;
          }
        }

        &__suffix {
          &-inner {
            align-items: center;
          }
        }
      }

      .el-textarea__inner {
        color: var(--am-c-inp-text);

        &:focus {
          background-color: var(--am-input-c-bgr);
        }

      }

      &__default{
        --am-input-height: 40px;
        --am-input-padding: 8px 12px;

        input {
          line-height: 40px;
        }

        // Icon
        &.is-icon-start {
          --am-input-padding: 8px 12px 8px 41px;
        }

        &.is-icon-end {
          --am-input-padding: 8px 41px 8px 12px;
        }

        &.is-icon-start.is-icon-end {
          --am-input-padding: 8px 41px;
        }

        &.is-icon-start, &.is-icon-end {
          i {
            font-size: 24px;
            color: var(--am-c-inp-text);
          }
        }
      }

      &__medium {
        --am-input-height: 36px;
        --am-input-padding: 6px 10px;

        input {
          height: 36px;
          line-height: 36px;
        }

        // Icon
        &.is-icon-start {
          --am-input-padding: 6px 10px 6px 34px;
        }

        &.is-icon-end {
          --am-input-padding: 6px 34px 6px 10px;
        }

        &.is-icon-start.is-icon-end {
          --am-input-padding: 8px 34px;
        }

        &.is-icon-start, &.is-icon-end {
          i {
            font-size: 24px;
            color: var(--am-c-inp-text);
          }
        }
      }

      &__small {
        --am-input-height: 32px;
        --am-input-padding: 4px 8px;

        input {
          height: 32px;
          line-height: 32px;
          font-size: 15px;
        }

        // Icon
        &.is-icon-start {
          --am-input-padding: 4px 8px 4px 34px;
        }

        &.is-icon-end {
          --am-input-padding: 4px 34px 4px 8px;
        }

        &.is-icon-start.is-icon-end {
          --am-input-padding: 4px 34px;
        }

        &.is-icon-start, &.is-icon-end {
          i {
            font-size: 24px;
            color: var(--am-c-inp-text);
          }
        }
      }

      // Native Input & Native Textarea
      input, textarea {
        border: 1px solid var(--am-input-color-border);
        background: var(--am-input-c-bgr);
        border-radius: 6px;
        padding: 8px 12px;
        margin: 0;
        font-size: 15px;
        -webkit-transition: box-shadow 0.15s;
        transition: box-shadow 0.15s;

        // Active & Focus
        &:active, &:focus {
          --am-input-color-border: var(--am-c-btn-prim);
          outline: none;
          box-shadow: 0 2px 2px var(--am-c-inp-text-op03);
          padding: 8px 12px;
        }

        // Placeholder
        &::-webkit-input-placeholder, &:-ms-input-placeholder, &::placeholder {
          color: var(--am-input-c-placeholder);
        }
      }

      // Disabled
      &.is-disabled {
        input {
          --am-input-c-bgr: var(--am-c-inp-text-op03);
          --am-input-c-text: var(--am-c-inp-text-op60);
          box-shadow: none;
          cursor: not-allowed;

          // Placeholder
          &::-webkit-input-placeholder, &:-ms-input-placeholder, &::placeholder {
            // TODO
            color: var(--am-input-c-placeholder);
          }

          // Hover
          &:hover {
            box-shadow: unset;
          }

          // Active & Focus
          &:active, &:focus {
            --am-input-c-border: var(--am-c-inp-border);
            box-shadow: unset;
          }
        }
      }
    }
  }
}

// public
.amelia-v2-booking #amelia-container {
  @include am-input-block;
}

// admin
#amelia-app-backend-new {
  @include am-input-block;
}
</style>
