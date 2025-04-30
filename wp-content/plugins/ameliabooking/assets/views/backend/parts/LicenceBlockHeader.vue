<template>
  <div :class="{'am-licence': notInLicence(licence), 'am-licence-hidden': !licenceVisible()}">
    <LicenceBlock v-if="notInLicence(licence)" :licence="licence" :wholeDialog="wholeDialog"/>
  </div>
</template>

<script>
import licenceMixin from '../../../js/common/mixins/licenceMixin'

export default {
  mixins: [
    licenceMixin
  ],

  props: {
    licence: {
      type: String,
      default: 'basic'
    },
    wholeDialog: {
      type: Boolean,
      default: true
    }
  },

  data () {
    return {
    }
  },

  methods: {
  }
}
</script>
