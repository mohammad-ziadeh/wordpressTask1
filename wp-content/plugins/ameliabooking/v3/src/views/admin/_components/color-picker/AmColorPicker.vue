<template>
  <el-color-picker
    v-model="model"
    :disabled="props.disabled"
    :size="props.size"
    :show-alpha="props.showAlpha"
    :popper-class="props.popperClass"
    :predefine="props.predefine"
  ></el-color-picker>
</template>

<script setup>
import { computed } from "vue";

let props = defineProps({
  modelValue: {
    type: String
  },
  disabled: {
    type: Boolean,
    default: false
  },
  size: {
    // default, small, large
    type: String,
    default: 'default'
  },
  showAlpha: {
    type: Boolean,
    default: true
  },
  popperClass: {
    type: [String, Object, Function]
  },
  predefine: {
    type: Array
  }
})

let emits = defineEmits(['change', 'active-change', 'update:modelValue'])

let model = computed({
  get: () => props.modelValue,
  set: (val) => {
    emits('update:modelValue', val === null ? 'rgba(255, 255, 255, 0)': val)
    return val
  }
})
</script>

<script>
export default {
  name: "AmColorPicker"
}
</script>

<style lang="scss">

</style>