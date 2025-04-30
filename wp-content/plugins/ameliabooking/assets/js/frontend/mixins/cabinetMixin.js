import moment from "moment";

export default {
  data () {
    return {
      payBtnLoader: null,
      timeZone: '',
      statusesCabinet: [
        {
          value: 'approved',
          label: this.$root.labels.approved
        }, {
          value: 'pending',
          label: this.$root.labels.pending
        },
        {
          value: 'canceled',
          label: this.$root.labels.canceled
        },
        {
          value: 'rejected',
          label: this.$root.labels.rejected
        },
        {
          value: 'no-show',
          label: this.$root.labels['no-show']
        },
        {
          value: 'waiting',
          label: this.$root.labels.waiting_list
        }
      ]
    }
  },

  methods: {
    isPanelActive (panel) {
      if (!this.$root.shortcodeData.cabinet || (!this.$root.shortcodeData.cabinet.appointments && !this.$root.shortcodeData.cabinet.events &&
        !this.$root.shortcodeData.cabinet.profile)) {
        return true
      }

      if (panel === 'appointments' && this.$root.shortcodeData.cabinet && this.$root.shortcodeData.cabinet.appointments) {
        return true
      }

      if (panel === 'events' && this.$root.shortcodeData.cabinet && this.$root.shortcodeData.cabinet.events) {
        return true
      }

      return panel === 'profile' && this.$root.shortcodeData.cabinet && this.$root.shortcodeData.cabinet.profile
    },

    changeRange (value) {
      this.$store.commit('cabinet/setParams', {dates: value})
      this.setDatePickerSelectedDaysCount(this.$store.state.cabinet.params.dates.start, this.$store.state.cabinet.params.dates.end)
      this.$emit('refreshReservations')
    },

    isBookingCancelable (reservation, booking_index = 0) {
      return reservation.cancelable && !(reservation.bookings[booking_index].status === 'canceled' || reservation.bookings[booking_index].status === 'rejected' || reservation.bookings[booking_index].status === 'no-show')
    },

    isBookingReschedulable (reservation, booking_index = 0) {
      return reservation.reschedulable && !(reservation.bookings[booking_index].status === 'canceled' || reservation.bookings[booking_index].status === 'rejected' || reservation.bookings[booking_index].status === 'no-show')
    },
    disableAuthorizationHeader () {
      return 'ameliaBooking' in window && 'cabinet' in window['ameliaBooking'] && 'disableAuthorizationHeader' in window['ameliaBooking']['cabinet'] && window['ameliaBooking']['cabinet']['disableAuthorizationHeader']
    },

    getAuthorizationHeaderObject () {
      return this.$store.state.cabinet.ameliaToken && !this.disableAuthorizationHeader() ? {headers: {Authorization: 'Bearer ' + this.$store.state.cabinet.ameliaToken}} : {}
    },

    getPaymentLink (method, reservation, packageCustomerId = null) {
      this.payBtnLoader = reservation.bookings ? reservation.bookings[0].id : reservation.id
      let appointmentData = JSON.parse(JSON.stringify(reservation))
      appointmentData[appointmentData['type']] = reservation

      let customer = JSON.parse(JSON.stringify(this.$store.state.cabinet.profile))
      customer.birthday = null
      appointmentData['customer'] = customer

      if (appointmentData['type'] === 'package') {
        let index = packageCustomerId ? packageCustomerId : Object.keys(appointmentData.payments)[0]
        let payments = appointmentData['payments'][index].payments.sort((a, b) => (a.id > b.id) ? 1 : -1)
        appointmentData['paymentId'] = payments[0].id

        appointmentData['packageCustomerId'] = index
        appointmentData['packageReservations'] = []
        appointmentData['bookable'].forEach(bookable => {
          appointmentData['packageReservations'] = appointmentData['packageReservations'].concat(
            bookable.service.bookedAppointments.filter(app => app.bookings[0].packageCustomerService.packageCustomer.id === parseInt(index))
          )
        })
        appointmentData['booking'] = appointmentData['packageReservations'] && appointmentData['packageReservations'].length > 0 ? appointmentData['packageReservations'][0]['bookings'][0] : null
      } else {
        appointmentData['booking'] = reservation.bookings[0]
        appointmentData['paymentId'] = reservation.bookings[0].payments[0].id
      }

      this.$http.post(`${this.$root.getAjaxUrl}/payments/link`, {
        data: appointmentData,
        paymentMethod: method
      }).then((response) => {
        this.payBtnLoader = null
        if (!response.data.data.error && response.data.data.paymentLink) {
          window.location.href = response.data.data.paymentLink
        } else {
          this.notify(this.$root.labels.error, this.$root.labels.payment_link_error, 'error')
        }
      }).catch(e => {
        this.payBtnLoader = null
        this.notify(this.$root.labels.error, e.message, 'error')
        console.log(e)
      })
    },

    paymentFromCustomerPanel (reservation, entitySettings) {
      if (reservation.type !== 'package' && (!reservation.bookings || reservation.bookings.length === 0)) {
        return false
      }
      let settings = this.$root.settings
      if (entitySettings && entitySettings.payments && entitySettings.payments.paymentLinks) {
        settings = JSON.parse(entitySettings)
      }
      let paymentLinksEnabled = settings.payments.paymentLinks
      let entityApproved = reservation.type === 'package' ? Object.values(reservation.purchases).filter(p => p.status === 'approved').length > 0 : (reservation.bookings[0].status === 'approved' || reservation.bookings[0].status === 'pending')
      let price = reservation.type === 'package' ? reservation.price : reservation.bookings[0].price

      let bookingNotPassed = false
      switch (reservation.type) {
        case ('package'):
          bookingNotPassed = !reservation.expireDateString || moment(reservation.expireDateString, 'YYYY-MM-DD HH:mm:ss').isAfter(moment())
          break
        case ('appointment'):
          bookingNotPassed = moment(reservation.bookingStart, 'YYYY-MM-DD HH:mm:ss').isAfter(moment()) && reservation.bookings[0].payments.length > 0
          break
        case ('event'):
          bookingNotPassed = moment(reservation.periods[reservation.periods.length - 1].periodEnd, 'YYYY-MM-DD HH:mm:ss').isAfter(moment()) && reservation.bookings[0].payments.length > 0
          break
      }

      return this.paymentMethods(settings).length && paymentLinksEnabled && paymentLinksEnabled.enabled &&
          entityApproved && price > 0 && bookingNotPassed
    },

    paymentMethods (entitySettings) {
      if (typeof entitySettings === 'string') {
        entitySettings = JSON.parse(entitySettings)
      }
      let paymentOptions = []
      entitySettings = entitySettings.payments

      if (this.$root.settings.payments.wc.enabled) {
        paymentOptions.push({
          value: 'wc',
          label: this.$root.labels.wc
        })
      } else if (this.$root.settings.payments.mollie.enabled && (!('mollie' in entitySettings) || entitySettings.mollie.enabled)) {
        paymentOptions.push({
          value: 'mollie',
          label: this.$root.labels.on_line
        })
      } else if (this.$root.settings.payments.square.enabled && (!('square' in entitySettings) || entitySettings.square.enabled)) {
        paymentOptions.push({
          value: 'square',
          label: this.$root.labels.on_line
        })
      } else {
        if (this.$root.settings.payments.payPal.enabled && (!('payPal' in entitySettings) || entitySettings.payPal.enabled)) {
          paymentOptions.push({
            value: 'payPal',
            label: this.$root.labels.pay_pal
          })
        }

        if (this.$root.settings.payments.stripe.enabled && (!('stripe' in entitySettings) || entitySettings.stripe.enabled)) {
          paymentOptions.push({
            value: 'stripe',
            label: this.$root.labels.credit_card
          })
        }

        if (this.$root.settings.payments.razorpay.enabled && (!('razorpay' in entitySettings) || entitySettings.razorpay.enabled)) {
          paymentOptions.push({
            value: 'razorpay',
            label: this.$root.labels.razorpay
          })
        }
      }

      return paymentOptions
    }
  }
}
