import imageMixin from '../../common/mixins/imageMixin'

export default {

  mixins: [
    imageMixin
  ],

  methods: {
    redirectToGoogleAuthPage () {
      this.googleLoading = true

      window.location.href = this.googleAuthURL
    },

    inlineDialogEmployeeSVG () {
      let $this = this

      setTimeout(function () {
        $this.inlineSVG()
      }, 10)
    }

  }

}
