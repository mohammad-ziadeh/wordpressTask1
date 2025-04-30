<template>
  <div :class="$root.settings.customization.forms ? `am-block-${classIdentifier}`: ''">
    <p
      v-if="showServices && formField.visibility"
      class="am-select-service-title"
    >
      {{ formField.labels.please_select_service.value || `${$root.labels.please_select} ${$root.labels.service}:` }}
    </p>

    <p
      v-if="!showServices && formField.visibility && formField.labels.book_appointment"
      class="am-select-service-title"
    >
      {{ formField.labels.book_appointment.value || $root.labels.book_appointment }}
    </p>
  </div>
</template>

<script>
export default {
  name: 'serviceHeadingFormField',

  props: {
    showServices: {
      type: Boolean,
      default: true
    },
    classIdentifier: {
      type: String,
      default: ''
    },
    formField: {
      type: Object,
      default: () => {}
    }
  }
}
</script>
