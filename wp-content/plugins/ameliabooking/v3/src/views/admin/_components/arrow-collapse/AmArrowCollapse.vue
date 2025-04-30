<template>
  <div class="am-arrow-collapse">
    <slot></slot>
  </div>
</template>

<script setup>
import { provide } from 'vue';

const props = defineProps({
  multiple: {
    type: Boolean,
    default: false
  }
})
provide('multiple', props.multiple)
</script>

<script>
export default {
  name: "AmArrowCollapse"
}
</script>

<style lang="scss">

</style>