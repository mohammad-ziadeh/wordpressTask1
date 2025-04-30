export default {
  data: () => ({}),

  methods: {
    getCurrentUser () {
      if (!('ameliaUser' in window)) {
        this.$http.get(`${this.$root.getAjaxUrl}/users/current`)
          .then(response => {
            window.ameliaUser = response.data.data.user ? JSON.parse(JSON.stringify(response.data.data.user)) : null

            this.setCurrentUser(window.ameliaUser)
          })
          .catch(e => {
            console.log('getCurrentUser fail')
          })
      } else {
        let ameliaApiInterval = setInterval(
          () => {
            if ('ameliaUser' in window) {
              clearInterval(ameliaApiInterval)

              this.setCurrentUser(JSON.parse(JSON.stringify(window.ameliaUser)))
            }
          },
          1000
        )
      }
    },

    setCurrentUser (user) {
      this.currentUser = user

      if (this.currentUser && this.appointment) {
        this.appointment.bookings[0].customerId = this.currentUser.id
        this.appointment.bookings[0].customer.id = this.currentUser.id
        this.appointment.bookings[0].customer.externalId = this.currentUser.externalId
        this.appointment.bookings[0].customer.email = this.currentUser.email
        this.appointment.bookings[0].customer.firstName = this.currentUser.firstName
        this.appointment.bookings[0].customer.lastName = this.currentUser.lastName
        this.appointment.bookings[0].customer.phone = this.currentUser.phone || ''
        this.appointment.bookings[0].customer.countryPhoneIso = this.currentUser.countryPhoneIso
        this.appointment.bookings[0].customer.translations = this.currentUser.translations

        this.phonePopulated = this.currentUser.phone ? this.currentUser.phone.trim() !== '' : false
      }
    }
  }

}
