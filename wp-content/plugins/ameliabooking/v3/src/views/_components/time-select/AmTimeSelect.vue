<template>
  <div
    class="am-time-select__wrapper"
    :class="parentClass"
    :style="cssVars"
  >
    <el-time-select
      :id="id"
      ref="amTimeSelect"
      v-model="model"
      class="am-time-select"
      :class="[
        `am-time-select--${size}`,
        { 'am-time-select--disabled': disabled },
        props.class,
      ]"
      :disabled="disabled"
      :placeholder="placeholder"
      :append-to-body="appendToBody"
      :clear-icon="clearIcon"
      :clearable="clearable"
      :editable="editable"
      :name="name"
      :popper-class="`am-time-select__popper${popperClass ? ' ' + popperClass : popperClass}`"
      :prefix-icon="prefixIcon"
      :suffix-icon="suffixIcon"
      :end="end"
      :max-time="maxTime"
      :min-time="minTime"
      :start="start"
      :step="step"
      :format="format"
    >
    </el-time-select>
  </div>
</template>

<script setup>
// * Import from Vue
import { ref, toRefs, computed, markRaw, inject, onMounted } from 'vue'

// * Dedicated components
import IconComponent from '../icons/IconComponent.vue'

// * Composables
import { useColorTransparency } from '../../../assets/js/common/colorManipulation'

/**
 * Component Props
 * */
const props = defineProps({
  modelValue: {
    type: String,
  },
  id: {
    type: String,
    default: ''
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  editable: {
    type: Boolean,
    default: true,
  },
  clearable: {
    type: Boolean,
    default: true,
  },
  size: {
    // default / medium / small / mini / micro
    type: String,
    default: 'default',
    validator(value) {
      return ['default', 'medium', 'small', 'mini', 'micro'].includes(value)
    },
  },
  placeholder: {
    type: String,
    default: '',
  },
  start: {
    type: String,
    default: '',
  },
  end: {
    type: String,
    default: '',
  },
  step: {
    type: String,
    default: '',
  },
  minTime: {
    type: String,
    default: '',
  },
  maxTime: {
    type: String,
    default: '',
  },
  name: {
    type: String,
    default: '',
  },
  prefixIcon: {
    type: [String, Object, Function],
    default: markRaw({
      components: { IconComponent },
      template: `<IconComponent icon="clock"/>`,
    }),
  },
  suffixIcon: {
    type: [String, Object, Function],
    default: markRaw({
      components: { IconComponent },
      template: `<IconComponent icon="arrow-up"/>`,
    }),
  },
  clearIcon: {
    type: [String, Object, Function],
    default: markRaw({
      components: { IconComponent },
      template: `<IconComponent icon="close"/>`,
    }),
  },
  appendToBody: {
    type: Boolean,
    default: true,
  },
  popperClass: {
    type: String,
    default: '',
  },
  class: {
    type: String,
    default: '',
  },
  parentClass: {
    type: String,
    default: ''
  },
  format: {
    type: String,
    default: 'HH:mm',
  },
})

/**
 * Component Emits
 * */
const emits = defineEmits(['update:modelValue'])

/**
 * Component Model
 * */
const { modelValue } = toRefs(props)

const model = computed({
  get: () => modelValue.value,
  set: (value) => {
    emits('update:modelValue', value)
  },
})

/**
 * Component Refs
 * */
const amTimeSelect = ref(null)

onMounted(() => {
  amTimeSelect.value.select.popperPaneRef.style.setProperty('--am-c-option-bgr', amColors.value.colorDropBgr)
  amTimeSelect.value.select.popperPaneRef.style.setProperty('--am-c-option-border', amColors.value.colorDropBorder)
  amTimeSelect.value.select.popperPaneRef.style.setProperty('--am-c-option-text', amColors.value.colorDropText)
  amTimeSelect.value.select.popperPaneRef.style.setProperty('--am-c-option-text-op65', useColorTransparency(amColors.value.colorDropText, 0.65))
  amTimeSelect.value.select.popperPaneRef.style.setProperty('--am-c-option-text-op50', useColorTransparency(amColors.value.colorDropText, 0.50))
  amTimeSelect.value.select.popperPaneRef.style.setProperty('--am-c-option-hover', useColorTransparency(amColors.value.colorDropText, 0.1))
  amTimeSelect.value.select.popperPaneRef.style.setProperty('--am-c-option-selected', amColors.value.colorPrimary)
  amTimeSelect.value.select.popperPaneRef.style.setProperty('--am-c-option-selected-op10', useColorTransparency(amColors.value.colorPrimary, 0.1))
  amTimeSelect.value.select.popperPaneRef.style.setProperty('--am-c-option-img-bgr', amColors.value.colorSuccess)
  amTimeSelect.value.select.popperPaneRef.style.setProperty('--am-c-option-img-text', amColors.value.colorMainBgr)
  amTimeSelect.value.select.popperPaneRef.style.setProperty('--am-font-family', amFonts.value.fontFamily)
})

// * Font Vars
let amFonts = inject(
  'amFonts',
  ref({
    fontFamily: 'Amelia Roboto, sans-serif',
    fontUrl: '',
    customFontFamily: '',
    fontFormat: '',
    customFontSelected: false,
  })
)

// * Color Vars
let amColors = inject(
  'amColors',
  ref({
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
  })
)

// * Css Variables
let cssVars = computed(() => {
  return {
    '--am-c-timeselect-bgr': amColors.value.colorInpBgr,
    '--am-c-timeselect-border': amColors.value.colorInpBorder,
    '--am-c-timeselect-text': amColors.value.colorInpText,
    '--am-c-timeselect-placeholder': amColors.value.colorInpPlaceHolder,
    '--am-c-timeselect-shadow': useColorTransparency(
      amColors.value.colorInpText,
      0.05
    ),
    '--am-c-timeselect-text-op60': useColorTransparency(
      amColors.value.colorInpText,
      0.6
    ),
    '--am-c-timeselect-text-op40': useColorTransparency(
      amColors.value.colorInpText,
      0.4
    ),
    '--am-c-timeselect-text-op10': useColorTransparency(
      amColors.value.colorInpText,
      0.03
    ),
    '--am-font-family': amFonts.value.fontFamily,
  }
})
</script>

<style lang="scss">
@mixin am-time-select-block {
  .am-time-select {
    // -c-    color
    // -rad-  border radius
    // -h-    height
    // -fs-   font size
    // -padd- padding
    // -bgr   background
    --am-c-timeselect-bgr: var(--am-c-inp-bgr);
    --am-c-timeselect-border: var(--am-c-inp-border);
    --am-c-timeselect-text: var(--am-c-inp-text);
    --am-c-timeselect-placeholder: var(--am-c-inp-placeholder);
    --am-rad-timeselect: var(--am-rad-input);
    --am-fs-timeselect: var(--am-fs-input);
    --am-h-timeselect: var(--am-h-input);
    --am-padd-timeselect: 8px 12px;
    width: 100%;

    // Select Wrapper
    &__wrapper {
      width: 100%;
    }

    // Size - default / medium / small / mini / micro
    &--default {
      --am-h-timeselect: 40px;
      --am-padd-timeselect: 8px 24px 8px 12px;
    }
    &--medium {
      --am-h-timeselect: 36px;
      --am-padd-timeselect: 6px 24px 6px 10px;
    }
    &--small {
      --am-h-timeselect: 32px;
      --am-padd-timeselect: 4px 24px 4px 10px;
    }
    &--mini {
      --am-h-timeselect: 28px;
      --am-padd-timeselect: 2px 24px 2px 8px;
    }
    &--micro {
      --am-h-timeselect: 24px;
      --am-padd-timeselect: 0 24px 0 8px;
    }

    // Disabled
    &--disabled {
      --am-c-timeselect-bgr: var(--am-c-timeselect-text-op10);
      --am-c-timeselect-text: var(--am-c-timeselect-text-op60);
    }

    // Input
    .el-input {
      .el-icon {
        font-size: 18px;
        color: var(--am-c-timeselect-placeholder);

        &.el-input__prefix-icon {
          font-size: 22px;
        }
      }

      &__inner {
        width: 100%;
        height: var(--am-h-timeselect) !important;
        min-height: auto;
        font-size: var(--am-fs-timeselect);
        font-weight: 400;
        line-height: 1.6;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
        color: var(--am-c-timeselect-text);
        border: 1px solid var(--am-c-timeselect-border);
        border-radius: var(--am-rad-timeselect);
        background-color: var(--am-c-timeselect-bgr) !important;
        padding: var(--am-padd-timeselect);
        box-shadow: 0 2px 2px var(--am-c-timeselect-shadow);

        &::-webkit-input-placeholder {
          /* Chrome/Opera/Safari */
          color: var(--am-c-timeselect-placeholder);
        }
        &::-moz-placeholder {
          /* Firefox 19+ */
          color: var(--am-c-timeselect-placeholder);
        }
        &:-ms-input-placeholder {
          /* IE 10+ */
          color: var(--am-c-timeselect-placeholder);
        }
        &:-moz-placeholder {
          /* Firefox 18- */
          color: var(--am-c-timeselect-placeholder);
        }

        &:hover:not(:focus):not(:active) {
          --am-c-timeselect-border: var(--am-c-timeselect-text-op40);
        }

        &:focus,
        &:active {
          --am-c-timeselect-border: var(--am-c-primary);
          border-color: var(--am-c-timeselect-border) !important;
        }
      }

      // validation icon
      &__suffix {
        .el-input__validateIcon {
          display: none;
        }
      }

      &__prefix {
        left: 8px;
      }
    }
  }
}

// Time Select Popper
.am-time-select__popper {
  --am-hmin-timeselect-option: 32px;
  --am-h-timeselect-option: auto;
  --am-flh-timeselect-option: 1.4;
  --am-c-timeselect-option-text: var(--am-c-option-text);
  --am-c-timeselect-option-bgr: transparent;
  --am-pad-timeselect-option: 8px;
  --am-mar-timeselect-option: 0px;
  --am-fs-timeselect-option: 14px;
  --am-fw-timeselect-option: 400;
  --am-ff-timeselect-option: var(--am-font-family);
  background-color: var(--am-c-option-bgr) !important;

  &.el-select__popper.el-popper[role=tooltip] {
    background-color: transparent;
    border-color: var(--am-c-option-border);
    overflow: hidden;
  }

  &.el-select-dropdown {
    margin: 0;
    position: static;
    border: none;
  }

  * {
    font-family: var(--am-font-family), sans-serif;
    border-radius: unset;
  }

  .el-select-dropdown {
    &__list {
      padding: 0;
    }

    &__item {
      min-height: var(--am-hmin-timeselect-option) !important;
      height: var(--am-h-timeselect-option) !important;
      font-family: var(--am-ff-timeselect-option), sans-serif !important;
      font-size: var(--am-fs-timeselect-option) !important;
      font-weight: var(--am-fw-timeselect-option) !important;
      line-height: var(--am-flh-timeselect-option) !important;
      color: var(--am-c-timeselect-option-text) !important;
      background-color: var(--am-c-timeselect-option-bgr) !important;
      padding: var(--am-pad-timeselect-option) !important;
      margin: var(--am-mar-timeselect-option) !important;
      white-space: normal;

      &:hover, &.hover {
        --am-c-timeselect-option-bgr: var(--am-c-option-hover);
      }

      &.selected {
        --am-c-timeselect-option-text: var(--am-c-option-selected);
      }

      &.is-disabled {
        --am-c-timeselect-option-text: var(--am-c-option-text-op50) !important;
      }

      &:last-child {
        border-bottom: none;
      }
    }

    &__empty {
      color: var(--am-c-option-text-op65);
    }
  }
}

// public
.amelia-v2-booking #amelia-container {
  @include am-time-select-block;
}

// admin
#amelia-app-backend-new {
  @include am-time-select-block;
}
</style>