<template>
  <div v-if="licence && notInLicence(licence)" class="am-empty-state am-section am-licence-page">
    <img :src="$root.getUrl+'public/img/upgrade-licence.svg'" alt="Upgrade licence">

    <h2 style="display: block; margin-top: 20px;">{{ $root.labels.licence_description }}</h2>
    <p>{{ getLicenceDescription(licence) }}</p>

    <a
      style="display: block; width: 150px; margin: 20px auto auto;"
      class="el-button"
      :href="!$root.licence.isLite ? 'https://wpamelia.com/pricing/?utm_source=amelia-lite&utm_medium=lite-upgrade&utm_content=amelia&utm_campaign=amelia-lite' : '?page=wpamelia-lite-vs-premium'"
      target="_blank"
      rel="nofollow"
    >
      {{ $root.labels.licence_button_text }}
    </a>
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
      default: null
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
