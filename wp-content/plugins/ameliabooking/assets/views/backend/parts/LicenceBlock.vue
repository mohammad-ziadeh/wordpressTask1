<template>
  <el-row
    v-if="notInLicence(licence)"
    class="am-licence-block"
    :style="{
      borderTop: wholeDialog ? 'none' : '1px solid lightgray !important',
      paddingTop: wholeDialog ? '0' : '10px',
      marginTop: wholeDialog ? '0' : '5px'
    }"
  >
    <el-col :span="18" style="display: flex; align-items: center">
      <i class="el-icon-lock"></i>
      <span style="margin-left: 5px; display: inline-block;">{{ getLicenceDescription(licence) }}</span>
    </el-col>
    <el-col :span="6">
      <a
        class="am-licence-button am-licence-button__upgrade"
        :style="{padding: !wholeDialog ? '4px 20px' : '', width: !wholeDialog ? '100%' : '', float: wholeDialog ? 'right' : ''}"
        :href="!$root.licence.isLite ? 'https://wpamelia.com/pricing/?utm_source=amelia-lite&utm_medium=lite-upgrade&utm_content=amelia&utm_campaign=amelia-lite' : '?page=wpamelia-lite-vs-premium'"
        target="_blank"
        rel="nofollow"
        style="color: #ffffff;"
      >
        {{ $root.labels.licence_button_text }}
      </a>
    </el-col>
  </el-row>
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
      default: false
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
