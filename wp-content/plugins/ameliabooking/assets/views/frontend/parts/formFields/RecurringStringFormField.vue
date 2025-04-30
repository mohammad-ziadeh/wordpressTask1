<template>
  <div class="am-confirmation-booking-details recurring-string">
    <div>
      <p>{{ labelRecurringActive || $root.labels.recurring_active }}</p>
      <p class="am-semi-strong">{{ recurringString }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'recurringStringFormField',

  props: {
    recurringString: {
      type: String,
      default: ''
    },
    formField: {
      type: Object,
      default: () => {}
    }
  },

  data () {
    return {
      labelRecurringActive: this.formField[this.$options.name].labels.recurring_active.value
    }
  }
}
</script>
