export default {
  data: () => ({
  }),

  methods: {
    notInLicence (licence) {
      licence = typeof licence === 'undefined' ? 'basic' : licence

      if (licence === 'developer' &&
        (this.$root.licence.isLite || this.$root.licence.isStarter || this.$root.licence.isBasic || this.$root.licence.isPro)
      ) {
        return true
      } else if (licence === 'pro' &&
        (this.$root.licence.isLite || this.$root.licence.isStarter || this.$root.licence.isBasic)
      ) {
        return true
      } else if (licence === 'basic' &&
        (this.$root.licence.isLite || this.$root.licence.isStarter)
      ) {
        return true
      } else if (licence === 'starter' && this.$root.licence.isLite) {
        return true
      } else {
        return false
      }
    },

    licenceVisible () {
      return !this.$root.settings.activation.hideUnavailableFeatures
    },

    licenceClass (licence) {
      let inLicence = this.notInLicence(typeof licence === 'undefined' ? 'basic' : licence)

      return {
        'am-licence': inLicence,
        'am-licence-hidden': inLicence && !this.licenceVisible()
      }
    },

    licenceClassDisabled (licence) {
      return {
        'am-licence-container-disabled': this.notInLicence(typeof licence === 'undefined' ? 'basic' : licence)
      }
    },

    getLicenceDescription (licence) {
      if (licence === 'starter' &&
        (this.$root.licence.isLite)
      ) {
        return this.$root.labels.licence_start_description
      }

      if (licence === 'basic' &&
        (this.$root.licence.isLite || this.$root.licence.isStarter)
      ) {
        return this.$root.labels.licence_basic_description
      }

      if (licence === 'pro' &&
        (this.$root.licence.isLite || this.$root.licence.isStarter || this.$root.licence.isBasic)
      ) {
        return this.$root.labels.licence_pro_description
      }

      if (licence === 'developer' &&
        (this.$root.licence.isLite || this.$root.licence.isStarter || this.$root.licence.isBasic || this.$root.licence.isPro)
      ) {
        return this.$root.labels.licence_dev_description
      }

      return ''
    },

    isPlaceholderInLicence (codeValue) {
      let unavailablePlaceholders = []

      if (this.$root.licence.isLite || this.$root.licence.isStarter || this.$root.licence.isBasic) {
        unavailablePlaceholders = unavailablePlaceholders.concat(
          [
            '%cart_appointments_details%'
          ]
        )
      }

      if (this.$root.licence.isLite || this.$root.licence.isStarter) {
        unavailablePlaceholders = unavailablePlaceholders.concat(
          [
            '%payment_type%',
            '%appointment_deposit_payment%',
            '%payment_due_amount%',
            '%payment_link_woocommerce%',
            '%payment_link_mollie%',
            '%payment_link_paypal%',
            '%payment_link_stripe%',
            '%payment_link_razorpay%',
            '%payment_link_square%',
            '%event_deposit_payment%',
            '%event_tickets%',
            '%customer_panel_url%',
            '%employee_panel_url%',
            '%google_meet_url%',
            '%google_meet_url_date%',
            '%google_meet_url_date_time%',
            '%microsoft_teams_url%',
            '%microsoft_teams_url_date%',
            '%microsoft_teams_url_date_time%',
            '%zoom_join_url%',
            '%zoom_host_url%',
            '%zoom_host_url_date%',
            '%zoom_host_url_date_time%',
            '%zoom_join_url_date%',
            '%zoom_join_url_date_time%',
            '%location_name%',
            '%location_description%',
            '%location_address%',
            '%location_phone%',
            '%recurring_appointments_details%'
          ]
        )
      }

      if (this.$root.licence.isLite) {
        unavailablePlaceholders = unavailablePlaceholders.concat(
          [
            '%coupon_used%',
            '%appointment_cancel_url%',
            '%appointment_approve_url%',
            '%appointment_reject_url%',
            '%group_appointment_details%',
            '%employee_password%',
            '%event_cancel_url%',
            '%lesson_space_url%',
            '%lesson_space_url_date%',
            '%lesson_space_url_date_time%',
            '%service_extras%',
            '%service_extras_details%',
          ]
        )
      }

      return unavailablePlaceholders.indexOf(codeValue) !== -1
    }
  }
}
