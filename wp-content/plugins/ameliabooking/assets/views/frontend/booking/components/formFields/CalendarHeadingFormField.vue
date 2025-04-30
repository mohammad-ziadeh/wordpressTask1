<template>
  <div :class="$root.settings.customization.forms ? `am-block-${classIdentifier}`: ''">
    <p
      v-if="formField.visibility"
      class="am-select-date-title"
    >
      {{ formHeading ? formHeading : $root.labels.pick_date_and_time_colon }}
    </p>
  </div>
</template>

<script>
export default {
  name: 'calendarHeadingFormField',

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
      formHeading: this.formField.labels.pick_date_and_time.value
    }
  }
}
</script>
