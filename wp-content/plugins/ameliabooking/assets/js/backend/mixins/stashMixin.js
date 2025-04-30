export default {
  data () {
    return {}
  },

  methods: {
    updateStashEntities (config) {
      if (this.$root.settings.activation.stash) {
        this.$http.post(this.$root.getAjaxUrl + '/stash', config).then(response => {})
      }
    }
  }
}
