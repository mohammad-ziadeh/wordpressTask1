<template>
  <el-switch
    v-model="model"
    class="am-switch"
    :disabled="disabled"
    :loading="loading"
    :inline-prompt="inlinePrompt"
    :active-icon="activeIcon"
    :inactive-icon="inactiveIcon"
    :active-text="activeText"
    :inactive-text="inactiveText"
    :active-value="activeValue"
    :inactive-value="inactiveValue"
    :active-color="activeColor"
    :inactive-color="inactiveColor"
    :border-color="borderColor"
    :name="name"
    :validate-event="validateEvent"
    :before-change="beforeChange"
    @change="(evt) => emits('change', evt)"
  ></el-switch>
</template>

<script setup>
import { computed } from "vue";

let props = defineProps({
  modelValue: {
    type: Boolean
  },
  disabled: {
    type: Boolean,
    default: false
  },
  loading: {
    type: Boolean,
    default: false
  },
  size: {
    // default/ medium / small
    type: String,
    default: 'default',
    validator(value) {
      return ['default', 'medium', 'small'].includes(value)
    }
  },
  inlinePrompt: {
    type: Boolean,
    default: false
  },
  activeIcon: {
    type: [String, Object]
  },
  inactiveIcon: {
    type: [String, Object]
  },
  activeText: {
    type: String,
    default: ''
  },
  inactiveText: {
    type: String,
    default: ''
  },
  activeValue: {
    type: [Boolean, String, Number],
    default: true
  },
  inactiveValue: {
    type: [Boolean, String, Number],
    default: false
  },
  activeColor: {
    type: String,
    default: '#265CF2'
  },
  inactiveColor: {
    type: String,
    default: '#B3B9BD'
  },
  borderColor: {
    type: String,
    default: ''
  },
  name: {
    type: String,
    default: ''
  },
  validateEvent: {
    type: Boolean,
    default: true
  },
  beforeChange: {
    type: Function
  }
})

let emits = defineEmits(['change', 'update:modelValue'])

let model = computed({
  get: () => props.modelValue,
  set: (val) => {
    emits('update:modelValue', val)
    return val
  }
})
</script>

<script>
export default {
  name: "AmSwitch"
}
</script>

<style lang="scss">

</style>