<template>
  <div :class="$root.settings.customization.forms ? `am-block-${classIdentifier}`: ''">
    <p
      v-show="formField.visibility"
      class="am-select-service-title"
    >
      {{ labelHeading || `${$root.labels.please_select} ${$root.labels.package}:` }}
    </p>
  </div>
</template>

<script>
export default {
  name: 'packageHeadingFormField',

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
      labelHeading: this.formField.labels.please_select_package.value
    }
  }
}
</script>
