export default {

  data: () => ({
    count: {
      success: 0,
      error: 0
    }
  }),

  methods: {
    deleteEntities (selectedEntities, deleteFinishedCallback, deleteSingleSuccessCallback, deleteSingleErrorCallback) {
      let $this = this

      selectedEntities.forEach(function (id) {
        $this.$http.post(`${$this.$root.getAjaxUrl}/` + $this.name + '/delete/' + id)
          .then(() => {
            $this.deleteEntityResult(selectedEntities, true, deleteFinishedCallback)
            deleteSingleSuccessCallback(id)
          })
          .catch(() => {
            $this.deleteEntityResult(selectedEntities, false, deleteFinishedCallback)
            deleteSingleErrorCallback(id)
          })
      })
    },

    deleteEntityResult (selectedEntities, result, callback) {
      selectedEntities.pop()

      if (result) {
        this.count.success++
      } else {
        this.count.error++
      }

      if (selectedEntities.length === 0) {
        if (this.count.success) {
          this.notify(
            this.$root.labels.success,
            this.count.success + ' ' + (this.count.success > 1 ? this.successMessage.multiple : this.successMessage.single),
            'success')
        }

        if (this.count.error) {
          this.notify(
            this.$root.labels.error,
            this.count.error + ' ' + (this.count.error > 1 ? this.errorMessage.multiple : this.errorMessage.single),
            'error')
        }

        this.count.success = 0
        this.count.error = 0

        callback()
      }
    }

  }

}
