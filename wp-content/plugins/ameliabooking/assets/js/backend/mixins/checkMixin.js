export default {

  data: () => ({}),

  methods: {

    handleCheckAll (entities, checkData, checkAll) {
      let checkedAll = (typeof checkAll !== 'undefined') ? checkAll : checkData.allChecked

      entities.forEach(function (item) {
        item.checked = checkedAll
      })

      checkData.allChecked = checkedAll
      checkData.toaster = checkedAll

      return checkData
    },

    handleCheckSingle (entities, checkData) {
      let checkedCount = 0

      entities.forEach(function (item) {
        if (item.checked) {
          checkedCount++
        }
      })

      checkData.allChecked = (checkedCount === entities.length)
      checkData.toaster = (checkedCount !== 0)

      return checkData
    }

  }

}
