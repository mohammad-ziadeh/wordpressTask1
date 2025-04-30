export default {
  methods: {
    notify (title, message, type, customClass, duration) {
      if (typeof customClass === 'undefined') {
        customClass = ''
      }

      setTimeout(() => {
        let data = {
          customClass: customClass,
          title: title,
          message: message,
          type: type,
          offset: 50
        }

        if (typeof duration !== 'undefined') {
          data['duration'] = duration
        }

        this.$notify(data)
      }, 700)
    }
  }
}
