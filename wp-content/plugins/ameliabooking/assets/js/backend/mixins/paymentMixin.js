import taxesMixin from '../../common/mixins/taxesMixin'

export default {
  mixins: [taxesMixin],

  data: () => ({}),

  methods: {
    getPaymentType(payment) {
      if (!payment.gateway || payment.gateway === 'onSite') {
        return 'onsite'
      }
      if (payment.status === 'partiallyPaid') {
        return 'deposit'
      }
      return 'online'
    },

    longNamePayments(gateway) {
      return ['mollie', 'razorpay', 'square'].includes(gateway)
    },

    getPaymentData(payment, appointment, event, pack, recurring = []) {
      let selectedPaymentModalData = {}

      selectedPaymentModalData.paymentId = payment.id

      if (appointment) {
        selectedPaymentModalData.bookableType = 'appointment'

        let provider = this.getProviderById(appointment.providerId)
        provider.fullName = provider.firstName + ' ' + provider.lastName

        selectedPaymentModalData.appointment = [{
          bookable: this.getServiceById(appointment.serviceId),
          bookingStart: appointment.bookingStart,
          providers: [provider]
        }]

        appointment.bookings.forEach(function (bookItem) {
          bookItem.payments.forEach(function (payItem) {
            if (payItem.id === payment.id) {
              selectedPaymentModalData.appointment[0].booking = bookItem
            }
          })
        })

        recurring.forEach(app => {
          let provider = this.getProviderById(app.providerId)
          provider.fullName = provider.firstName + ' ' + provider.lastName
          selectedPaymentModalData.appointment.push({
            bookable: this.getServiceById(app.serviceId),
            bookingStart: app.bookingStart,
            providers: [provider],
            booking: app.bookings[0]
          })
        })
      }

      if (event) {
        selectedPaymentModalData.bookableType = 'event'

        selectedPaymentModalData.event = [{
          bookable: event,
          bookingStart: event.periods[0].periodStart,
          providers: event.providers
        }]

        event.bookings.forEach(function (bookItem) {
          bookItem.payments.forEach(function (payItem) {
            if (payItem.id === payment.id) {
              selectedPaymentModalData.event[0].booking = bookItem
            }
          })
        })
      }

      if (pack) {
        selectedPaymentModalData.bookableType = 'package'

        selectedPaymentModalData.package = [{
          bookable: pack.package,
          bookingStart: null,
          providers: [],
          booking: pack.booking
        }]
      }

      selectedPaymentModalData.customer = {
        email: payment.customerEmail,
        firstName: payment.customerFirstName,
        lastName: payment.customerLastName,
        id: payment.customerId
      }

      return selectedPaymentModalData
    },

    getPaymentStatusNiceName(status) {
      switch (status) {
        case ('paid'):
          return this.$root.labels.paid

        case ('pending'):
          return this.$root.labels.pending

        case ('partiallyPaid'):
          return this.$root.labels.partially_paid

        case ('refunded'):
          return this.$root.labels.refunded
      }
    },

    getPaymentClassName(payment) {
      let method = payment.gateway

      if (payment.gatewayTitle === 'oliver') {
        method = 'oliver'
      }

      return 'am-appointment-payment am-appointment-payment-' + method
    },

    getPaymentIconName(payment) {
      return (payment.gateway === 'onSite' || payment.gateway === 'stripe') && payment.gatewayTitle === 'oliver' ? 'oliver.png' : payment.gateway + '.svg'
    },

    getPaymentGatewayNiceName(payment) {
      if (payment.gateway === 'stripe' && payment.gatewayTitle === 'oliver') {
        return this.$root.labels.oliver_on_line
      }

      if (payment.gateway === 'onSite' && payment.gatewayTitle === 'oliver') {
        return this.$root.labels.oliver_on_site
      }

      if (payment.gateway === 'onSite') {
        return this.$root.labels.on_site
      }

      if (payment.gateway === 'wc') {
        return payment.gatewayTitle
      }

      if (payment.gateway) {
        return payment.gateway.charAt(0).toUpperCase() + payment.gateway.slice(1)
      }
    },

    getPaymentIconWidth(paymentGateway) {
      switch (paymentGateway) {
        case 'razorpay':
          return '76px'
        case 'square':
          return '70px'
        case 'mollie':
          return '38px'
        default:
          return '16px'
      }
    },

    getPaymentAmountData (bookings, type) {
      let result = {
        bookablePriceTotal: 0,
        extrasPriceTotal: 0,
        tax: 0,
        wcTax: 0,
        discountTotal: 0,
        paidDeposit: 0,
        paidRemaining: 0,
        paid: 0,
        refunded: 0,
        subtotal: 0,
        total: 0,
        due: 0
      }

      let $this = this

      bookings.forEach(function (app) {
        let bookItem = app.booking

        if (bookItem.tax && !Array.isArray(bookItem.tax)) {
          bookItem.tax = JSON.parse(bookItem.tax)
        }

        switch (type) {
          case ('appointment'):
            let amountData = $this.getAppointmentPriceAmount(
              {
                price: bookItem.price,
                aggregatedPrice: bookItem.aggregatedPrice,
                tax: bookItem.tax,
                id: null
              },
              bookItem.extras,
              bookItem.persons,
              bookItem.coupon,
              false
            )

            result.bookablePriceTotal += amountData.totalBookable
            result.extrasPriceTotal += amountData.total - amountData.totalBookable
            result.tax += amountData.tax
            result.discountTotal += amountData.discount

            break

          case ('event'):
            let eventAmountData = $this.getEventBookingPriceAmount(bookItem)

            result.bookablePriceTotal += eventAmountData.total
            result.extrasPriceTotal += 0
            result.tax += eventAmountData.tax
            result.discountTotal += eventAmountData.discount

            break
          case ('package'):
            let coupon = null

            bookItem.payments.forEach(function (payItem) {
              coupon = payItem.coupon ? payItem.coupon : coupon
            })

            let packagePrice = bookItem.price * (bookItem.aggregatedPrice ? bookItem.persons : 1)

            let packageAmountData = $this.getAmountData(
              bookItem.tax && bookItem.tax.length ? bookItem.tax[0] : null,
              packagePrice,
              coupon
            )

            result.bookablePriceTotal += packageAmountData.total
            result.extrasPriceTotal += 0
            result.tax += packageAmountData.tax
            result.discountTotal += packageAmountData.discount

            break
        }

        let paidDeposit = 0
        let paidRemaining = 0
        bookItem.payments.forEach(function (payItem) {
          result.discountTotal += (payItem.wcOrderId ? payItem.wcItemCouponValue : 0)
          if (payItem.status === 'paid') {
            paidRemaining += payItem.amount
          } else if (payItem.status === 'partiallyPaid') {
            paidDeposit += payItem.amount
          }

          if (payItem.wcOrderId && payItem.wcItemTaxValue) {
            result.wcTax += payItem.wcItemTaxValue
          }
        })
        result.paidDeposit += paidDeposit
        result.paidRemaining += paidRemaining

        result.refunded += bookItem.payments.filter(payItem => payItem.status === 'refunded').reduce((partialSum, a) => partialSum + a.amount, 0)
      })

      result.subTotal = result.bookablePriceTotal + result.extrasPriceTotal
      result.total = result.subTotal + result.tax + result.wcTax
      result.total -= result.discountTotal
      result.paid = result.paidDeposit + result.paidRemaining
      result.total = result.total >= 0 ? result.total : 0
      result.due = ((result.total - result.paid) > 0 ? (result.total - result.paid) : 0)

      return result
    }

  }
}
