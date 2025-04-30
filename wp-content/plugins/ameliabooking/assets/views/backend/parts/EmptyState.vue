<template>
  <div>
    <div v-if="licence && notInLicence(licence) ? false : visible" class="am-empty-state am-section">
      <img :src="$root.getUrl+'public/img/emptystate.svg'">
      <h2>{{ title }}</h2>
      <p>{{ description }} <a v-if="importing" @click="$emit('import')" class="am-empty-state-import">{{ importing }}</a></p>
    </div>

    <LicenceImage :licence="licence"/>
  </div>
</template>

<script>
import licenceMixin from '../../../js/common/mixins/licenceMixin'
import LicenceImage from './LicenceImage'

export default {
  mixins: [
    licenceMixin
  ],
  props: {
    licence: {
      type: String,
      default: null
    },
    visible: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ''
    },
    description: {
      type: String,
      default: ''
    },
    importing: {
      type: String,
      default: ''
    }
  },

  data () {
    return {
    }
  },

  methods: {
  },

  components: {
    LicenceImage
  }
}
</script>
