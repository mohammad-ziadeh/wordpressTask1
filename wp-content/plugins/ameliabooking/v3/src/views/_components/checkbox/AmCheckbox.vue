<template>

  <div class="am-checkbox-wrapper" :style="cssVars">
    <el-checkbox
      ref="amCheckbox"
      v-model="model"
      :checked="checked"
      :class="[`am-checkbox__${size}`]"
      :false-label="falseLabel"
      :indeterminate="indeterminate"
      :disabled="disabled"
      :label="label"
      :name="name"
      :true-label="trueLabel"
      class="am-checkbox"
      @change="(e) => $emit('change', e)"
    >
      <template v-if="label && !$slots.default">{{ label }}</template>
      <slot></slot>
    </el-checkbox>
  </div>

</template>

<script setup>
import { computed, inject, ref, toRefs } from 'vue';
import { useColorTransparency } from "../../../assets/js/common/colorManipulation";

/**
 * Component Props
 */
const props = defineProps({
  modelValue: {
    type: [String, Number, Boolean]
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
  name: {
    type: String,
    default: ''
  },
  label: {
    type: [String, Number, Boolean, Object]
  },
  trueLabel: {
    type: [String, Number],
  },
  falseLabel: {
    type: [String, Number],
  },
  border: {
    type: Boolean,
    default: false
  },
  checked: {
    type: Boolean,
    default: false
  },
  indeterminate: {
    type: Boolean,
    default: false
  },
})

/**
 * Component Emits
 * */
const emits = defineEmits(['change', 'update:modelValue'])

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
const amCheckbox = ref()

// * Color Vars
let amColors = inject('amColors',{})

// * Css Variables
let cssVars = computed(() => {
  return {
    '--am-c-checkbox-text-op60': useColorTransparency(amColors.value.colorInpText, 0.6),
    '--am-c-checkbox-btn-op80': useColorTransparency(amColors.value.colorBtnPrim, 0.8),
    '--am-c-checkbox-btn-op60': useColorTransparency(amColors.value.colorBtnPrim, 0.6),
    '--am-c-checkbox-btn-dsb-op60': useColorTransparency(amColors.value.colorInpBgr, 0.6),
  }
})

</script>

<style lang="scss">
@mixin am-checkbox-block {
  .am-checkbox {
    // -c-    color
    // -rad-  border radius
    // -bgr   background
    --am-c-checkbox-bgr: var(--am-c-inp-bgr);
    --am-c-checkbox-bgr-checked: var(--am-c-btn-prim);
    --am-c-checkbox-border: var(--am-c-inp-border);
    --am-c-checkbox-text: var(--am-c-main-text);
    --am-c-checkbox-inp-text: var(--am-c-main-bgr);
    --am-rad-checkbox: 4px;
    --am-w-checkbox-inp: 16px;
    --am-h-checkbox-inp: 16px;

    display: flex;
    align-items: center;
    white-space: pre-line;
    min-height: 32px;
    height: auto;
    gap: 8px;

    &__default {
      --am-w-checkbox-inp: 16px;
      --am-h-checkbox-inp: 16px;
    }

    &__medium {
      --am-w-checkbox-inp: 14px;
      --am-h-checkbox-inp: 14px;
    }

    &__small {
      --am-w-checkbox-inp: 12px;
      --am-h-checkbox-inp: 12px;
    }

    &-wrapper {
      width: 100%;

      .el-checkbox {

        &__input {
          width: var(--am-w-checkbox-inp);
          height: var(--am-h-checkbox-inp);
          border-radius: var(--am-rad-checkbox);
          align-self: flex-start;
          padding: 2px 0;

          &.is-indeterminate.is-checked {
            .el-checkbox__inner {
              --am-c-checkbox-border: var(--am-c-btn-prim);
              --am-c-checkbox-bgr: var(--am-c-inp-bgr);

              &:before {
                background-color: var(--am-c-btn-prim);
                transform: scale(1) translate(-50%, -50%);
                top: 50%;
                left: 50%;
                width: 70%;
                height: 2px;
              }
            }
          }
        }

        &__label {
          //margin-left: 8px;
          font-weight: 500;
          color: var(--am-c-checkbox-text);
          align-self: flex-start;
          word-break: break-word;
          white-space: pre-line;
        }

        &__inner {
          flex: 0 0 auto;
          width: 16px;
          height: 16px;
          border: 1px solid var(--am-c-checkbox-border);
          background: var(--am-c-checkbox-bgr);
          border-radius: var(--am-rad-checkbox);

          &:after {
            left: 5px;
            border-color: var(--am-c-checkbox-inp-text);
            border-width: 2px;
          }

          &:hover {
            --am-c-checkbox-bgr: var(--am-c-checkbox-btn-op80);
          }

          &:focus {
            --am-c-checkbox-border: var(--am-c-checkbox-btn-op80);
          }
        }

        &.is-checked {
          --am-c-checkbox-bgr: var(--am-c-checkbox-bgr-checked);
          --am-c-checkbox-text-op60: var(--am-c-inp-text);

          &.is-disabled {
            --am-c-checkbox-bgr: var(--am-c-checkbox-btn-op60);

            .el-checkbox__inner {
              &:hover {
                --am-c-checkbox-bgr: var(--am-c-checkbox-btn-op60);
              }
            }
          }
        }

        &.is-disabled {
          --am-c-checkbox-bgr: var(--am-c-checkbox-btn-dsb-op60);

          .el-checkbox__inner {
            &:hover {
              --am-c-checkbox-bgr: var(--am-c-checkbox-btn-dsb-op60);
            }
          }
        }
      }
    }
  }
}

// public
.amelia-v2-booking #amelia-container {
  @include am-checkbox-block;
}

// admin
#amelia-app-backend-new {
  @include am-checkbox-block;
}
</style>
