import helperMixin from '../../../js/backend/mixins/helperMixin'

export default {
  mixins: [helperMixin],

  data: () => ({
  }),

  methods: {
    getInitEntitySettings (type) {
      let entitySettings = {
        payments: {
          paymentLinks: {
            enabled: this.$root.settings.payments.paymentLinks.enabled,
            changeBookingStatus: this.$root.settings.payments.paymentLinks.changeBookingStatus,
            redirectUrl: null
          },
          onSite: this.$root.settings.payments.onSite,
          wc: {
            enabled: this.$root.settings.payments.wc.enabled,
            productId: this.$root.settings.payments.wc.productId
          },
          payPal: {
            enabled: this.$root.settings.payments.payPal.enabled
          },
          stripe: {
            enabled: this.$root.settings.payments.stripe.enabled
          },
          mollie: {
            enabled: this.$root.settings.payments.mollie.enabled
          },
          square: {
            enabled: this.$root.settings.payments.square.enabled
          },
          razorpay: {
            enabled: this.$root.settings.payments.razorpay.enabled
          }
        }
      }

      switch (type) {
        case ('service'):
          entitySettings.general = {
            minimumTimeRequirementPriorToCanceling: null,
            minimumTimeRequirementPriorToRescheduling: null,
            redirectUrlAfterAppointment: null
          }

          entitySettings.general.defaultAppointmentStatus = null
          entitySettings.general.numberOfDaysAvailableForBooking = 0
          entitySettings.general.minimumTimeRequirementPriorToBooking = null

          entitySettings.zoom = {
            enabled: this.$root.settings.zoom.enabled
          }
          entitySettings.lessonSpace = {
            enabled: this.$root.settings.lessonSpace.enabled
          }

          entitySettings.googleMeet = {
            enabled: this.$root.settings.googleCalendar.enabled && this.$root.settings.googleCalendar.googleMeetEnabled
          }

          entitySettings.microsoftTeams = {
            enabled: this.$root.settings.outlookCalendar.enabled && this.$root.settings.outlookCalendar.microsoftTeamsEnabled
          }

          break
        case ('event'):
          entitySettings.general = {
            minimumTimeRequirementPriorToCanceling: null,
            redirectUrlAfterAppointment: null
          }

          entitySettings.zoom = {
            enabled: this.$root.settings.zoom.enabled
          }
          entitySettings.lessonSpace = {
            enabled: this.$root.settings.lessonSpace.enabled
          }

          entitySettings.googleMeet = {
            enabled: this.$root.settings.googleCalendar.enabled && this.$root.settings.googleCalendar.googleMeetEnabled
          }

          entitySettings.microsoftTeams = {
            enabled: this.$root.settings.outlookCalendar.enabled && this.$root.settings.outlookCalendar.microsoftTeamsEnabled
          }

          entitySettings.waitingList = {
            enabled: false,
            addingMethod: this.$root.settings.appointments.waitingListEvents.addingMethod,
            maxCapacity: 1,
            maxExtraPeopleEnabled: false,
            maxExtraPeople: 0
          }

          break
        case ('package'):
          entitySettings.general = {
            redirectUrlAfterAppointment: null
          }

          break
      }

      return entitySettings
    },

    setEntitySettings (entity, type) {
      entity.settings = entity.settings !== null ? JSON.parse(entity.settings) : this.getInitEntitySettings(type)

      this.addMissingObjectProperties(entity.settings, this.getInitEntitySettings(type))
    },

    updateSettings (entitySettingsJson) {
      //  on frontend
      if (this.$root.clonedSettings.payments.onSite &&
        !this.$root.clonedSettings.payments.stripe.enabled &&
        !this.$root.clonedSettings.payments.payPal.enabled &&
        !this.$root.clonedSettings.payments.wc.enabled &&
        !this.$root.clonedSettings.payments.mollie.enabled &&
        !this.$root.clonedSettings.payments.square.enabled &&
        !this.$root.clonedSettings.payments.razorpay.enabled
      ) {
        return
      }

      if (this.$root.clonedSettings.payments.wc.enabled === false && this.$root.clonedSettings.payments.mollie.enabled === false && entitySettingsJson !== null) {
        let entitySettings = JSON.parse(entitySettingsJson)

        if (!('payments' in entitySettings)) {
          entitySettings.payments = {}
        }

        ['onSite', 'stripe', 'payPal', 'wc', 'mollie', 'razorpay', 'square'].forEach((type) => {
          if ((!(type in entitySettings.payments))) {
            entitySettings.payments[type] = this.$root.clonedSettings.payments[type]
          }
        })

        entitySettings.payments.wc = this.$root.clonedSettings.payments.wc
        entitySettings.payments.mollie = this.$root.clonedSettings.payments.mollie

        if (!this.$root.clonedSettings.payments.onSite) {
          entitySettings.payments.onSite = this.$root.clonedSettings.payments.onSite
        }

        if (!this.$root.clonedSettings.payments.square) {
          entitySettings.payments.square = this.$root.clonedSettings.payments.square
        }

        if (!this.$root.clonedSettings.payments.payPal.enabled) {
          entitySettings.payments.payPal = this.$root.clonedSettings.payments.payPal
        }

        if (!this.$root.clonedSettings.payments.stripe.enabled) {
          entitySettings.payments.stripe = this.$root.clonedSettings.payments.stripe
        }

        if (!this.$root.clonedSettings.payments.razorpay.enabled || !entitySettings.payments.razorpay) {
          entitySettings.payments.razorpay = this.$root.clonedSettings.payments.razorpay
        }

        if (('onSite' in entitySettings.payments ? entitySettings.payments.onSite && this.$root.clonedSettings.payments.onSite : this.$root.clonedSettings.payments.onSite) &&
          ('payPal' in entitySettings.payments ? entitySettings.payments.payPal.enabled && this.$root.clonedSettings.payments.payPal.enabled : this.$root.clonedSettings.payments.payPal.enabled) &&
          ('stripe' in entitySettings.payments ? entitySettings.payments.stripe.enabled && this.$root.clonedSettings.payments.stripe.enabled : this.$root.clonedSettings.payments.stripe.enabled) &&
          ('mollie' in entitySettings.payments ? entitySettings.payments.mollie.enabled && this.$root.clonedSettings.payments.mollie.enabled : this.$root.clonedSettings.payments.mollie.enabled) &&
          ('razorpay' in entitySettings.payments ? entitySettings.payments.razorpay.enabled && this.$root.clonedSettings.payments.razorpay.enabled : this.$root.clonedSettings.payments.razorpay.enabled) &&
          ('square' in entitySettings.payments ? entitySettings.payments.square.enabled && this.$root.clonedSettings.payments.square.enabled : this.$root.clonedSettings.payments.square.enabled)
        ) {
          entitySettings.payments = this.$root.clonedSettings.payments
        }

        entitySettingsJson = JSON.stringify(entitySettings)
      }

      if (this.$root.clonedSettings.payments.wc.enabled === true && entitySettingsJson !== null) {
        let entitySettings = JSON.parse(entitySettingsJson)

        if (!('payments' in entitySettings)) {
          entitySettings.payments = {}
        }

        entitySettings.payments.onSite = this.$root.clonedSettings.payments.onSite
        entitySettings.payments.stripe = this.$root.clonedSettings.payments.stripe
        entitySettings.payments.payPal = this.$root.clonedSettings.payments.payPal
        entitySettings.payments.mollie = this.$root.clonedSettings.payments.mollie
        entitySettings.payments.square = this.$root.clonedSettings.payments.square
        entitySettings.payments.razorpay = this.$root.clonedSettings.payments.razorpay

        entitySettingsJson = JSON.stringify(entitySettings)
      }

      if (this.$root.clonedSettings.payments.mollie.enabled === true && entitySettingsJson !== null) {
        let entitySettings = JSON.parse(entitySettingsJson)

        if (!('payments' in entitySettings)) {
          entitySettings.payments = {}
        }

        if (!this.$root.clonedSettings.payments.onSite) {
          entitySettings.payments.onSite = this.$root.clonedSettings.payments.onSite
          entitySettings.payments.mollie = this.$root.clonedSettings.payments.mollie
        }

        entitySettings.payments.stripe = this.$root.clonedSettings.payments.stripe
        entitySettings.payments.payPal = this.$root.clonedSettings.payments.payPal
        entitySettings.payments.razorpay = this.$root.clonedSettings.payments.razorpay

        entitySettingsJson = JSON.stringify(entitySettings)
      }

      if (this.$root.clonedSettings.payments.square.enabled === true && entitySettingsJson !== null) {
        let entitySettings = JSON.parse(entitySettingsJson)

        if (!('payments' in entitySettings)) {
          entitySettings.payments = {}
        }

        if (!this.$root.clonedSettings.payments.onSite) {
          entitySettings.payments.onSite = this.$root.clonedSettings.payments.onSite
          entitySettings.payments.square = this.$root.clonedSettings.payments.square
        }

        entitySettings.payments.stripe = this.$root.clonedSettings.payments.stripe
        entitySettings.payments.payPal = this.$root.clonedSettings.payments.payPal
        entitySettings.payments.razorpay = this.$root.clonedSettings.payments.razorpay

        entitySettingsJson = JSON.stringify(entitySettings)
      }

      if ('oliverPos' in this.$root.shortcodeData && this.$root.shortcodeData.oliverPos) {
        entitySettingsJson = JSON.parse(entitySettingsJson)

        entitySettingsJson.payments.onSite = true
        entitySettingsJson.payments.stripe.enabled = false
        entitySettingsJson.payments.payPal.enabled = false
        entitySettingsJson.payments.razorpay.enabled = false

        entitySettingsJson = JSON.stringify(entitySettingsJson)
      }

      this.replaceExistingObjectProperties(this.$root.settings, entitySettingsJson !== null ? JSON.parse(entitySettingsJson) : this.$root.clonedSettings)
    },

    prepareBookableEntityPaymentsForSave (bookableEntitySettings) {
      let payments = {}

      if (bookableEntitySettings && 'payments' in bookableEntitySettings) {
        if ('onSite' in bookableEntitySettings.payments &&
          bookableEntitySettings.payments.onSite !== this.$root.settings.payments.onSite
        ) {
          payments.onSite = bookableEntitySettings.payments.onSite
        }

        ['stripe', 'payPal', 'razorpay', 'mollie', 'square'].forEach((paymentType) => {
          if (paymentType in bookableEntitySettings.payments &&
            bookableEntitySettings.payments[paymentType].enabled !== this.$root.settings.payments[paymentType].enabled
          ) {
            payments[paymentType] = bookableEntitySettings.payments[paymentType]
          }
        })

        if ('wc' in bookableEntitySettings.payments &&
            (bookableEntitySettings.payments.wc.enabled !== this.$root.settings.payments.wc.enabled ||
                ('productId' in bookableEntitySettings.payments.wc &&
                    bookableEntitySettings.payments.wc.productId !== this.$root.settings.payments.wc.productId)
            )
        ) {
          payments.wc = bookableEntitySettings.payments.wc
        }

        payments.paymentLinks = bookableEntitySettings.payments.paymentLinks
      }

      bookableEntitySettings.payments = payments

      return bookableEntitySettings
    },

    prepareServiceSettingsForSave (service) {
      let serviceSettings = JSON.parse(JSON.stringify(service.settings))

      if ('general' in serviceSettings) {
        if (!serviceSettings.general.redirectUrlAfterAppointment) {
          delete serviceSettings.general.redirectUrlAfterAppointment
        }

        if (!serviceSettings.general.defaultAppointmentStatus) {
          delete serviceSettings.general.defaultAppointmentStatus
        }

        if ((!serviceSettings.general.minimumTimeRequirementPriorToBooking && !this.$root.settings.general.minimumTimeRequirementPriorToBooking) ||
          serviceSettings.general.minimumTimeRequirementPriorToBooking === ''
        ) {
          delete serviceSettings.general.minimumTimeRequirementPriorToBooking
        }

        if ((!serviceSettings.general.minimumTimeRequirementPriorToCanceling && !this.$root.settings.general.minimumTimeRequirementPriorToCanceling) ||
          serviceSettings.general.minimumTimeRequirementPriorToCanceling === ''
        ) {
          delete serviceSettings.general.minimumTimeRequirementPriorToCanceling
        }

        if ((!serviceSettings.general.minimumTimeRequirementPriorToRescheduling && !this.$root.settings.general.minimumTimeRequirementPriorToRescheduling) ||
            serviceSettings.general.minimumTimeRequirementPriorToRescheduling === ''
        ) {
          delete serviceSettings.general.minimumTimeRequirementPriorToRescheduling
        }

        if (!serviceSettings.general.numberOfDaysAvailableForBooking) {
          delete serviceSettings.general.numberOfDaysAvailableForBooking
        }

        if (Object.keys(serviceSettings.general).length === 0) {
          delete serviceSettings.general
        }
      }

      if (Object.keys(serviceSettings).length === 0) {
        serviceSettings = null
      }

      return serviceSettings
    }
  },

  computed: {
  }

}
