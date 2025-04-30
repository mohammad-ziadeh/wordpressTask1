<template>
  <div :class="$root.settings.customization.forms ? `am-block-${classIdentifier}`: ''">
    <p
      v-if="formField.visibility"
      class="am-recurring-setup-title"
    >
      {{ formHeading ? formHeading : $root.labels.recurring_active }}
    </p>
  </div>
</template>

<script>
export default {
  name: 'recurringSetupHeadingFormField',

  props: {
    classIdentifier: {
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
      formHeading: this.formField.labels.recurring_active.value
    }
  }
}
</script>
