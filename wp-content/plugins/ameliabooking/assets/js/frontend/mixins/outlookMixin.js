import imageMixin from '../../common/mixins/imageMixin'

export default {

  mixins: [
    imageMixin
  ],

  methods: {
    redirectToOutlookAuthPage () {
      this.outlookLoading = true
      window.location.href = this.outlookAuthURL
    },

    inlineDialogEmployeeSVG () {
      let $this = this
      setTimeout(function () {
        $this.inlineSVG()
      }, 10)
    }

  }

}
