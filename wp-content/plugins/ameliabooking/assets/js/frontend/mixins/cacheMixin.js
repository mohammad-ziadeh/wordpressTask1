import helperMixin from '../../../js/backend/mixins/helperMixin'
import eventMixin from '../../../js/common/mixins/eventMixin'
import bookingMixin from '../../../js/frontend/mixins/bookingMixin'

export default {
  mixins: [helperMixin, eventMixin, bookingMixin],

  data () {
    return {
      cacheData: null,
      loadingCacheCatalogData: false,
      loadingCacheCategoryData: false,
      loadingCacheServiceData: false,
      loadingCacheBookingData: false
    }
  },

  methods: {
    setCacheData (containerId, notify) {
      this.cacheData = 'ameliaCache' in window && window.ameliaCache.length && window.ameliaCache[0] ? JSON.parse(window.ameliaCache[0]) : null

      if (this.cacheData) {
        this.cacheData.request.bookable.id = parseInt(this.cacheData.request.bookable.id)
        this.cacheData.request.passedCategoryId = parseInt(this.cacheData.request.passedCategoryId)

        if (this.cacheData.request && this.cacheData.request.queryParams && 'dates' in this.cacheData.request.queryParams) {
          this.cacheData.request.queryParams.id = this.cacheData.request.queryParams.id
            ? parseInt(this.cacheData.request.queryParams.id) : this.cacheData.request.queryParams.id

          this.cacheData.request.queryParams.page = parseInt(this.cacheData.request.queryParams.page)
          this.cacheData.request.queryParams.recurring = parseInt(this.cacheData.request.queryParams.recurring)

          this.cacheData.request.queryParams.tag = this.cacheData.request.queryParams.tag ? this.cacheData.request.queryParams.tag : null
          this.cacheData.request.queryParams.locationId = this.cacheData.request.queryParams.locationId ? this.cacheData.request.queryParams.locationId : null
        }
      }

      if (this.cacheData && containerId === this.cacheData.request.containerId) {
        if (this.cacheData.status === 'canceled' || this.cacheData.status === 'failed') {
          this.cacheData.request.appointment.serviceId = parseInt(this.cacheData.request.appointment.serviceId)
          this.cacheData.request.appointment.locationId = parseInt(this.cacheData.request.appointment.locationId)
          this.cacheData.request.appointment.providerId = parseInt(this.cacheData.request.appointment.providerId)
          this.cacheData.request.appointment.group = !!parseInt(this.cacheData.request.appointment.group)

          this.cacheData.request.appointment.bookings[0].customerId = parseInt(this.cacheData.request.appointment.bookings[0].customerId)
          this.cacheData.request.appointment.bookings[0].persons = parseInt(this.cacheData.request.appointment.bookings[0].persons)

          this.cacheData.request.hasCancel = !!parseInt(this.cacheData.request.hasCancel)
          this.cacheData.request.hasHeader = !!parseInt(this.cacheData.request.hasHeader)
          this.cacheData.request.useGlobalCustomization = !!parseInt(this.cacheData.request.useGlobalCustomization)

          this.cacheData.request.bookable.maxCapacity = parseInt(this.cacheData.request.bookable.maxCapacity)

          if (!this.cacheData.request.packageData) {
            this.cacheData.request.packageData = null
          } else {
            this.cacheData.request.packageData.id = parseInt(this.cacheData.request.packageData.id)

            this.cacheData.request.packageData.rules.forEach((item) => {
              item.providerId = parseInt(item.providerId)
              item.serviceId = parseInt(item.serviceId)
              item.locationId = item.serviceId ? parseInt(item.locationId) : null
            })

            this.cacheData.request.packageData.data.forEach((item) => {
              item.providerId = parseInt(item.providerId)
              item.serviceId = parseInt(item.serviceId)
              item.locationId = item.serviceId ? parseInt(item.locationId) : null
            })
          }

          if (!this.cacheData.request.recurringData) {
            this.cacheData.request.recurringData = []
          }

          if (!('extras' in this.cacheData.request.appointment.bookings[0])) {
            this.cacheData.request.appointment.bookings[0].extras = []
          }

          for (let key in this.cacheData.request.appointment.bookings[0].customFields) {
            if (this.cacheData.request.appointment.bookings[0].customFields.hasOwnProperty(key) &&
              this.cacheData.request.appointment.bookings[0].customFields[key].type === 'datepicker'
            ) {
              this.cacheData.request.appointment.bookings[0].customFields[key].value = new Date(
                this.cacheData.request.appointment.bookings[0].customFields[key].value
              )
            }

            if (this.cacheData.request.appointment.bookings[0].customFields.hasOwnProperty(key) &&
              this.cacheData.request.appointment.bookings[0].customFields[key].type === 'checkbox' &&
              !('value' in this.cacheData.request.appointment.bookings[0].customFields[key])
            ) {
              this.cacheData.request.appointment.bookings[0].customFields[key].value = []
            }
          }

          this.scrollView(containerId, 'end', true)
        } else if (this.cacheData.status === 'paid' && notify) {
          this.cacheData.response.color = this.cacheData.request.bookable.color

          let skipNotify = this.$root.settings.general.runInstantPostBookingActions

          if ('request' in this.cacheData &&
            'trigger' in this.cacheData.request &&
            this.cacheData.request.trigger
          ) {
            skipNotify = true
          }

          switch (this.cacheData.response.type) {
            case ('appointment'):
              this.getAppointmentAddToCalendarData(
                this.cacheData.response,
                skipNotify
              )

              break

            case ('package'):
              if (this.cacheData.response.package && this.cacheData.response.package.length > 0) {
                this.getAppointmentAddToCalendarData(
                  this.cacheData.response,
                  skipNotify
                )
              }

              break

            case ('event'):
              this.getEventAddToCalendarData(
                this.cacheData.response,
                skipNotify
              )

              break
          }

          this.scrollView(containerId, 'end', true)
        }
      } else {
        this.unsetCacheData()
      }

      this.loadingCacheBookingData = !!this.cacheData
      this.loadingCacheCatalogData = !!this.cacheData
      this.loadingCacheCategoryData = !!this.cacheData
      this.loadingCacheServiceData = !!this.cacheData

      try {
        window.history.replaceState(null, null, this.removeURLParameter(window.location.href, 'ameliaWcCache'))
        window.history.replaceState(null, null, this.removeURLParameter(window.location.href, 'ameliaCache'))
      } catch (e) {
      }
    },

    unsetCacheData () {
      this.cacheData = null
    },

    getCacheDataRequestProps () {
      let provider = null

      let service = null

      let location = null

      switch (this.cacheData.request.bookableType) {
        case ('appointment'):
          provider = this.getProviderById(parseInt(this.cacheData.request.appointment.providerId))

          service = provider.serviceList.find(service => service.id === parseInt(this.cacheData.request.appointment.serviceId))

          location = this.getLocationById(parseInt(this.cacheData.request.appointment.locationId))

          break
      }

      let props = JSON.parse(JSON.stringify(
        Object.assign(
          this.cacheData.request,
          {
            provider: provider,
            location: location,
            service: service,
            customFields: this.options.entities.customFields,
            status: this.cacheData.status
          }
        )
      ))

      return props
    }
  }

}
