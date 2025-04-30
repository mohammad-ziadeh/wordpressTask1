import taxesMixin from '../../../js/common/mixins/taxesMixin'

export default {
  mixins: [taxesMixin],

  data () {
    return {}
  },

  methods: {
    getAppointmentService (appointment) {
      let provider = this.getProviderById(appointment.providerId)

      let providerService = provider.serviceList.find(service => service.id === appointment.serviceId)

      return providerService || this.getServiceById(appointment.serviceId)
    },

    getBookingServicePrice (service, booking) {
      return service.customPricing && service.customPricing.enabled &&
        booking.duration &&
        service.customPricing.durations.filter(i => i.duration === booking.duration).length
        ? service.customPricing.durations.find(i => i.duration === booking.duration).price : service.price
    },

    getAppointmentPrice (savedServiceId, service, bookings, isList, formatPrice = true) {
      let totalBookings = 0
      let $this = this

      let isChangedService = parseInt(savedServiceId) !== parseInt(service.id)

      bookings.filter(i => i.packageCustomerService === null).forEach(function (booking) {
        let isChangedBookingDuration = (booking.duration === null ? service.duration : booking.duration) !== service.duration

        let servicePrice = $this.getBookingServicePrice(service, booking)

        // for old bookings use price from booking
        if (booking.payments.length > 0) {
          if (['approved', 'pending'].includes(booking.status)) {
            totalBookings += $this.getBookingPrice(booking, isChangedService, isChangedService || isChangedBookingDuration ? servicePrice : booking.price, booking.aggregatedPrice, service.id)
          }
        } else if (!isList) {
          totalBookings += $this.getBookingPrice(booking, true, servicePrice, service.aggregatedPrice, service.id)
        }
      })

      return formatPrice ? this.getFormattedPrice(
        totalBookings >= 0 ? totalBookings : 0,
        !this.$root.settings.payments.hideCurrencySymbolFrontend
      ) : (totalBookings >= 0 ? totalBookings : 0)
    },

    getBookingPrice (booking, isNewBooking, bookingPrice, aggregatedPrice, entityId = null) {
      let priceData = {
        price: !isNewBooking ? booking.price : bookingPrice,
        aggregatedPrice: aggregatedPrice,
        id: !isNewBooking ? entityId : null
      }

      if (!isNewBooking) {
        priceData.tax = booking.tax
      }

      let amountData = this.getAppointmentPriceAmount(
        priceData,
        booking.extras.filter(i => 'selected' in i ? i.selected : true),
        booking.persons,
        booking.coupon,
        false
      )

      return amountData.discount > amountData.total ? 0 : amountData.total - amountData.discount + amountData.tax
    },

    getPackagePrice (pack, key) {
      let coupon = pack.bookings[key].packageCustomerService.packageCustomer.coupon
      let total = pack.bookings[key].packageCustomerService.packageCustomer.price
      let discountTotal = (total / 100 * (coupon ? coupon.discount : 0)) + (coupon ? coupon.deduction : 0)

      return discountTotal > total ? 0 : total - discountTotal
    }
  }
}
