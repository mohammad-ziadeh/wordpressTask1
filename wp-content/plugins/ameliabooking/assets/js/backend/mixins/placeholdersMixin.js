import notifyMixin from '../../../js/backend/mixins/notifyMixin'
import dateMixin from '../../../js/common/mixins/dateMixin'

export default {
  mixins: [notifyMixin, dateMixin],

  data () {
    return {
      groupedPlaceholders: {},
      initialGroupedPlaceholders: {
        companyPlaceholders: [
          {
            value: '%company_address%',
            label: this.$root.labels.ph_company_address
          },
          {
            value: '%company_name%',
            label: this.$root.labels.ph_company_name
          },
          {
            value: '%company_phone%',
            label: this.$root.labels.ph_company_phone
          },
          {
            value: '%company_website%',
            label: this.$root.labels.ph_company_website
          },
          {
            value: '%company_email%',
            label: this.$root.labels.ph_company_email
          }
        ],

        customerPlaceholders: [
          {
            value: '%customer_email%',
            label: this.$root.labels.ph_customer_email
          },
          {
            value: '%customer_first_name%',
            label: this.$root.labels.ph_customer_first_name
          },
          {
            value: '%customer_full_name%',
            label: this.$root.labels.ph_customer_full_name
          },
          {
            value: '%customer_last_name%',
            label: this.$root.labels.ph_customer_last_name
          },
          {
            value: '%customer_note%',
            label: this.$root.labels.ph_customer_note
          },
          {
            value: '%customer_phone%',
            label: this.$root.labels.ph_customer_phone
          },
          {
            value: '%customer_panel_url%',
            label: this.$root.labels.ph_customer_cabinet_url,
            parse: 'link'
          }
        ],

        packagePlaceholders: [
          {
            value: '%package_appointments_details%',
            label: this.$root.labels.ph_package_appointments_details
          },
          {
            value: '%package_description%',
            label: this.$root.labels.ph_package_description
          },
          {
            value: '%package_duration%',
            label: this.$root.labels.ph_package_duration
          },
          {
            value: '%package_name%',
            label: this.$root.labels.ph_package_name
          },
          {
            value: '%package_price%',
            label: this.$root.labels.ph_package_price
          },
          {
            value: '%time_zone%',
            label: this.$root.labels.ph_time_zone,
            type: 'package'
          },
          {
            value: '%coupon_used%',
            label: this.$root.labels.ph_coupon_used,
            type: 'package'
          }
        ],

        employeePlaceholders: [
          {
            value: '%employee_id%',
            label: this.$root.labels.ph_employee_id
          },
          {
            value: '%employee_email%',
            label: this.$root.labels.ph_employee_email
          },
          {
            value: '%employee_first_name%',
            label: this.$root.labels.ph_employee_first_name
          },
          {
            value: '%employee_full_name%',
            label: this.$root.labels.ph_employee_full_name
          },
          {
            value: '%employee_last_name%',
            label: this.$root.labels.ph_employee_last_name
          },
          {
            value: '%employee_note%',
            label: this.$root.labels.ph_employee_note
          },
          {
            value: '%employee_description%',
            label: this.$root.labels.ph_employee_description
          },
          {
            value: '%employee_phone%',
            label: this.$root.labels.ph_employee_phone
          },
          {
            value: '%employee_panel_url%',
            label: this.$root.labels.ph_employee_cabinet_url,
            parse: 'link'
          },
          {
            value: '%employee_password%',
            label: this.$root.labels.ph_employee_password
          }
        ],

        paymentPlaceholders: [
          {
            value: '%payment_type%',
            label: this.$root.labels.ph_payment_type
          },
          {
            value: '%appointment_deposit_payment%',
            label: this.$root.labels.ph_appointment_deposit_payment
          },
          {
            value: '%event_deposit_payment%',
            label: this.$root.labels.ph_event_deposit_payment
          },
          {
            value: '%package_deposit_payment%',
            label: this.$root.labels.ph_package_deposit_payment
          },
          {
            value: '%payment_due_amount%',
            label: this.$root.labels.ph_payment_due_amount
          },
          {
            value: '%payment_link_woocommerce%',
            label: this.$root.labels.ph_payment_link_woocommerce
          },
          {
            value: '%payment_link_mollie%',
            label: this.$root.labels.ph_payment_link_mollie
          },
          {
            value: '%payment_link_paypal%',
            label: this.$root.labels.ph_payment_link_paypal
          },
          {
            value: '%payment_link_stripe%',
            label: this.$root.labels.ph_payment_link_stripe
          },
          {
            value: '%payment_link_razorpay%',
            label: this.$root.labels.ph_payment_link_razorpay
          },
          {
            value: '%payment_link_square%',
            label: this.$root.labels.ph_payment_link_square
          }
        ],

        categoryPlaceholders: [
          {
            value: '%category_id%',
            label: this.$root.labels.ph_category_id
          },
          {
            value: '%category_name%',
            label: this.$root.labels.ph_category_name
          },
          {
            value: '%service_description%',
            label: this.$root.labels.ph_service_description
          },
          {
            value: '%service_duration%',
            label: this.$root.labels.ph_service_duration
          },
          {
            value: '%service_id%',
            label: this.$root.labels.ph_service_id
          },
          {
            value: '%service_name%',
            label: this.$root.labels.ph_service_name
          },
          {
            value: '%service_price%',
            label: this.$root.labels.ph_service_price
          }
        ],

        locationPlaceholders: [
          {
            value: '%location_address%',
            label: this.$root.labels.ph_location_address
          },
          {
            value: '%location_description%',
            label: this.$root.labels.ph_location_description
          },
          {
            value: '%location_id%',
            label: this.$root.labels.ph_location_id
          },
          {
            value: '%location_name%',
            label: this.$root.labels.ph_location_name
          },
          {
            value: '%location_phone%',
            label: this.$root.labels.ph_location_phone
          },
          {
            value: '%location_latitude%',
            label: this.$root.labels.ph_location_latitude
          },
          {
            value: '%location_longitude%',
            label: this.$root.labels.ph_location_longitude
          },
        ],

        appointmentPlaceholders: [
          {
            value: '%appointment_id%',
            label: this.$root.labels.ph_appointment_id
          },
          {
            value: '%appointment_cancel_url%',
            label: this.$root.labels.ph_appointment_cancel_url,
            parse: 'link'
          },
          {
            value: '%appointment_approve_url%',
            label: this.$root.labels.ph_appointment_approve_url,
            parse: 'link'
          },
          {
            value: '%appointment_reject_url%',
            label: this.$root.labels.ph_appointment_reject_url,
            parse: 'link'
          },
          {
            value: '%appointment_date%',
            label: this.$root.labels.ph_appointment_date
          },
          {
            value: '%appointment_date_time%',
            label: this.$root.labels.ph_appointment_date_time
          },
          {
            value: '%appointment_start_time%',
            label: this.$root.labels.ph_appointment_start_time
          },
          {
            value: '%appointment_end_time%',
            label: this.$root.labels.ph_appointment_end_time
          },
          {
            value: '%initial_appointment_date%',
            label: this.$root.labels.ph_initial_appointment_date
          },
          {
            value: '%initial_appointment_date_time%',
            label: this.$root.labels.ph_initial_appointment_date_time
          },
          {
            value: '%initial_appointment_start_time%',
            label: this.$root.labels.ph_initial_appointment_start_time
          },
          {
            value: '%initial_appointment_end_time%',
            label: this.$root.labels.ph_initial_appointment_end_time
          },
          {
            value: '%appointment_duration%',
            label: this.$root.labels.ph_appointment_duration
          },
          {
            value: '%appointment_notes%',
            label: this.$root.labels.ph_appointment_notes
          },
          {
            value: '%appointment_price%',
            label: this.$root.labels.ph_appointment_price
          },
          {
            value: '%appointment_status%',
            label: this.$root.labels.ph_appointment_status
          },
          {
            value: '%booked_customer%',
            label: this.$root.labels.ph_booked_customer
          },
          {
            value: '%coupon_used%',
            label: this.$root.labels.ph_coupon_used,
            type: 'appointment'
          },
          {
            value: '%number_of_persons%',
            label: this.$root.labels.ph_booking_number_of_persons
          },
          {
            value: '%recurring_appointments_details%',
            label: this.$root.labels.ph_recurring_appointments_details
          },
          {
            value: '%group_appointment_details%',
            label: this.$root.labels.ph_group_appointment_details
          },
          {
            value: '%zoom_host_url%',
            label: this.$root.labels.ph_zoom_host_url
          },
          {
            value: '%zoom_join_url%',
            label: this.$root.labels.ph_zoom_join_url
          },
          {
            value: '%google_meet_url%',
            label: this.$root.labels.ph_google_meet_url
          },
          {
            value: '%microsoft_teams_url%',
            label: this.$root.labels.ph_microsoft_teams_url
          },
          {
            value: '%lesson_space_url%',
            label: this.$root.labels.ph_lesson_space_url
          },
          {
            value: '%reservation_name%',
            label: this.$root.labels.ph_reservation_name,
            type: 'appointment'
          },
          {
            value: '%reservation_description%',
            label: this.$root.labels.ph_reservation_description,
            type: 'appointment'
          },
          {
            value: '%time_zone%',
            label: this.$root.labels.ph_time_zone,
            type: 'appointment'
          }
        ],

        eventPlaceholders: [
          {
            value: '%attendee_code%',
            label: this.$root.labels.ph_attendee_code
          },
          {
            value: '%coupon_used%',
            label: this.$root.labels.ph_coupon_used,
            type: 'event'
          },
          {
            value: '%event_cancel_url%',
            label: this.$root.labels.ph_event_cancel_url,
            parse: 'link'
          },
          {
            value: '%event_description%',
            label: this.$root.labels.ph_event_description
          },
          {
            value: '%event_location%',
            label: this.$root.labels.ph_event_location,
          },
          {
            value: '%event_end_date%',
            label: this.$root.labels.ph_event_end_date
          },
          {
            value: '%event_end_date_time%',
            label: this.$root.labels.ph_event_end_date_time
          },
          {
            value: '%event_end_time%',
            label: this.$root.labels.ph_event_end_time
          },
          {
            value: '%group_event_details%',
            label: this.$root.labels.ph_group_event_details
          },
          {
            value: '%event_tickets%',
            label: this.$root.labels.ph_event_tickets
          },
          {
            value: '%event_id%',
            label: this.$root.labels.ph_event_id
          },
          {
            value: '%event_name%',
            label: this.$root.labels.ph_event_name
          },
          {
            value: '%event_period_date%',
            label: this.$root.labels.ph_event_period_date
          },
          {
            value: '%event_period_date_time%',
            label: this.$root.labels.ph_event_period_date_time
          },
          {
            value: '%event_price%',
            label: this.$root.labels.ph_event_price
          },
          {
            value: '%booking_price%',
            label: this.$root.labels.ph_booking_price
          },
          {
            value: '%event_start_date%',
            label: this.$root.labels.ph_event_start_date
          },
          {
            value: '%event_start_date_time%',
            label: this.$root.labels.ph_event_start_date_time
          },
          {
            value: '%event_start_time%',
            label: this.$root.labels.ph_event_start_time
          },
          {
            value: '%initial_event_start_date%',
            label: this.$root.labels.ph_initial_event_start_date
          },
          {
            value: '%initial_event_start_date_time%',
            label: this.$root.labels.ph_initial_event_start_date_time
          },
          {
            value: '%initial_event_start_time%',
            label: this.$root.labels.ph_initial_event_start_time
          },
          {
            value: '%initial_event_end_date%',
            label: this.$root.labels.ph_initial_event_end_date
          },
          {
            value: '%initial_event_end_date_time%',
            label: this.$root.labels.ph_initial_event_end_date_time
          },
          {
            value: '%initial_event_end_time%',
            label: this.$root.labels.ph_initial_event_end_time
          },
          {
            value: '%employee_name_email_phone%',
            label: this.$root.labels.ph_employee_name_email_phone
          },
          {
            value: '%number_of_persons%',
            label: this.$root.labels.ph_booking_number_of_persons
          },
          {
            value: '%lesson_space_url_date%',
            label: this.$root.labels.ph_lesson_space_url_date
          },
          {
            value: '%lesson_space_url_date_time%',
            label: this.$root.labels.ph_lesson_space_url_date_time
          },
          {
            value: '%google_meet_url_date%',
            label: this.$root.labels.ph_google_meet_url_date
          },
          {
            value: '%google_meet_url_date_time%',
            label: this.$root.labels.ph_google_meet_url_date_date
          },
          {
            value: '%microsoft_teams_url_date%',
            label: this.$root.labels.ph_microsoft_teams_url_date
          },
          {
            value: '%microsoft_teams_url_date_time%',
            label: this.$root.labels.ph_microsoft_teams_url_date_date
          },
          {
            value: '%zoom_host_url_date%',
            label: this.$root.labels.ph_zoom_host_url_date
          },
          {
            value: '%zoom_host_url_date_time%',
            label: this.$root.labels.ph_zoom_host_url_date_date
          },
          {
            value: '%zoom_join_url_date%',
            label: this.$root.labels.ph_zoom_join_url_date
          },
          {
            value: '%zoom_join_url_date_time%',
            label: this.$root.labels.ph_zoom_join_url_date_date
          },
          {
            value: '%reservation_name%',
            label: this.$root.labels.ph_reservation_name,
            type: 'event'
          },
          {
            value: '%reservation_description%',
            label: this.$root.labels.ph_reservation_description,
            type: 'event'
          },
          {
            value: '%time_zone%',
            label: this.$root.labels.ph_time_zone,
            type: 'event'
          }
        ],

        cartPlaceholders: [
          {
            value: '%cart_appointments_details%',
            label: this.$root.labels.ph_cart_appointments_details
          }
        ],

        customFieldsPlaceholders: [],

        extrasPlaceholders: [],

        couponsPlaceholders: []
      },

      placeholders: [],

      linksForParsing: {
        '%customer_panel_url%': '<a href="%customer_panel_url%">' + this.$root.labels.ph_customer_cabinet_url + '</a>',
        '%employee_panel_url%': '<a href="%employee_panel_url%">' + this.$root.labels.ph_employee_cabinet_url + '</a>',
        '%appointment_cancel_url%': '<a href="%appointment_cancel_url%">' + this.$root.labels.ph_appointment_cancel_url + '</a>',
        '%appointment_approve_url%': '<a href="%appointment_approve_url%">' + this.$root.labels.ph_appointment_approve_url + '</a>',
        '%appointment_reject_url%': '<a href="%appointment_reject_url%">' + this.$root.labels.ph_appointment_reject_url + '</a>',
        '%event_cancel_url%': '<a href="%event_cancel_url%">' + this.$root.labels.ph_event_cancel_url + '</a>'
      },

      plainTextLinksForParsing: {
        '%customer_panel_url%': '&lt;a href="%customer_panel_url%"&gt;' + this.$root.labels.ph_customer_cabinet_url + '&lt;/a&gt;',
        '%employee_panel_url%': '&lt;a href="%employee_panel_url%"&gt;' + this.$root.labels.ph_employee_cabinet_url + '&lt;/a&gt;',
        '%appointment_cancel_url%': '&lt;a href="%appointment_cancel_url%"&gt;' + this.$root.labels.ph_appointment_cancel_url + '&lt;/a&gt;',
        '%appointment_approve_url%': '&lt;a href="%appointment_approve_url%"&gt;' + this.$root.labels.ph_appointment_approve_url + '&lt;/a&gt;',
        '%appointment_reject_url%': '&lt;a href="%appointment_reject_url%"&gt;' + this.$root.labels.ph_appointment_reject_url + '&lt;/a&gt;',
        '%event_cancel_url%': '&lt;a href="%event_cancel_url%"&gt;' + this.$root.labels.ph_event_cancel_url + '&lt;/a&gt;'
      }
    }
  },

  methods: {
    getEventPlaceholders () {
      return this.groupedPlaceholders.companyPlaceholders.concat(
        this.groupedPlaceholders.customerPlaceholders.concat(
          this.groupedPlaceholders.employeePlaceholders.concat(
            this.groupedPlaceholders.locationPlaceholders.concat(
              this.groupedPlaceholders.customFieldsPlaceholders.concat(
                this.groupedPlaceholders.eventPlaceholders.concat(
                  this.groupedPlaceholders.couponsPlaceholders.concat(
                      this.groupedPlaceholders.paymentPlaceholders
                  )
                )
              )
            )
          )
        )
      )
    },

    getAppointmentPlaceholders () {
      return this.groupedPlaceholders.companyPlaceholders.concat(
        this.groupedPlaceholders.customerPlaceholders.concat(
          this.groupedPlaceholders.employeePlaceholders.concat(
            this.groupedPlaceholders.locationPlaceholders.concat(
              this.groupedPlaceholders.customFieldsPlaceholders.concat(
                this.groupedPlaceholders.couponsPlaceholders.concat(
                  this.groupedPlaceholders.appointmentPlaceholders.concat(
                    this.groupedPlaceholders.categoryPlaceholders.concat(
                      this.groupedPlaceholders.extrasPlaceholders.concat(
                          this.groupedPlaceholders.paymentPlaceholders
                      )
                    )
                  )
                )
              )
            )
          )
        )
      )
    },

    getPackagePlaceholders () {
      return this.groupedPlaceholders.companyPlaceholders.concat(
        this.groupedPlaceholders.customerPlaceholders.concat(
          this.groupedPlaceholders.packagePlaceholders.concat(
              this.groupedPlaceholders.paymentPlaceholders
          )
        )
      )
    },

    getCartPlaceholders () {
      return this.initialGroupedPlaceholders.cartPlaceholders
    },

    removePlaceholder (type, value) {
      if (type in this.groupedPlaceholders) {
        let valueIndex = null

        this.groupedPlaceholders[type].forEach((placeholder, index) => {
          if (placeholder.value === value) {
            valueIndex = index
          }
        })

        if (valueIndex !== null) {
          this.groupedPlaceholders[type].splice(valueIndex, 1)
        }
      }
    },

    getParsedCodeLabel (code) {
      if (code.parse === 'link') {
        for (let key in this.linksForParsing) {
          if (code.value === key) {
            return this.linksForParsing[key]
          }
        }
      }

      return ''
    },

    closeDialog () {
      this.$emit('closeDialogPlaceholders')
    },

    copyCodeText (code) {
      let textArea = document.createElement('textarea')
      textArea.value = code
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('Copy')
      document.body.removeChild(textArea)

      this.notify('', this.$root.labels.placeholder_copied, 'info', 'no-title')
    },

    addCustomFieldsPlaceholders (userTypeTab) {
      this.groupedPlaceholders.customFieldsPlaceholders = []

      for (let i = 0; i < this.customFields.length; i++) {
        if (this.customFields[i].type !== 'file' || userTypeTab === 'provider') {
          this.groupedPlaceholders.customFieldsPlaceholders.push({
            value: '%custom_field_' + this.customFields[i].id + '%',
            label: this.customFields[i].label
          })
        }
      }
    },

    addCouponsPlaceholders (userTypeTab) {
      this.groupedPlaceholders.couponsPlaceholders = []

      if (userTypeTab === 'customer') {
        for (let i = 0; i < this.coupons.length; i++) {
          this.groupedPlaceholders.couponsPlaceholders.push({
            value: '%coupon_' + this.coupons[i].id + '%',
            label: this.coupons[i].code + ' [' + this.$root.labels.discount + ': ' + this.coupons[i].discount + ', ' + this.$root.labels.deduction + ': ' + this.coupons[i].deduction + this.getCurrencySymbol() +
                ', ' + this.$root.labels.expiration_date + ': ' + (this.coupons[i].expirationDate ? this.getFrontedFormattedDate(this.coupons[i].expirationDate) : '/') + ']'
          })
        }
      }
    },

    addExtrasPlaceholders () {
      this.groupedPlaceholders.extrasPlaceholders = []

      for (let i = 0; i < this.categories.length; i++) {
        for (let j = 0; j < this.categories[i].serviceList.length; j++) {
          for (let k = 0; k < this.categories[i].serviceList[j].extras.length; k++) {
            this.groupedPlaceholders.extrasPlaceholders.push({
              value: '%service_extra_' + this.categories[i].serviceList[j].extras[k].id + '_name%',
              label: this.categories[i].serviceList[j].extras[k].name
            })

            this.groupedPlaceholders.extrasPlaceholders.push({
              value: '%service_extra_' + this.categories[i].serviceList[j].extras[k].id + '_quantity%',
              label: this.categories[i].serviceList[j].extras[k].name
            })

            this.groupedPlaceholders.extrasPlaceholders.push({
              value: '%service_extra_' + this.categories[i].serviceList[j].extras[k].id + '_price%',
              label: this.categories[i].serviceList[j].extras[k].name
            })
          }
        }
      }

      this.groupedPlaceholders.extrasPlaceholders.push({
        value: '%service_extras%',
        label: this.$root.labels.ph_extras
      })

      this.groupedPlaceholders.extrasPlaceholders.push({
        value: '%service_extras_details%',
        label: this.$root.labels.ph_extras_details
      })
    },

    setPlaceholders (excludedPlaceholders) {
      this.groupedPlaceholders = JSON.parse(JSON.stringify(this.initialGroupedPlaceholders))

      this.addExtrasPlaceholders()
      this.addCouponsPlaceholders(this.userTypeTab)
      this.addCustomFieldsPlaceholders(this.userTypeTab)

      for (let type in excludedPlaceholders) {
        excludedPlaceholders[type].forEach((excludedPlaceholder) => {
          this.removePlaceholder(type, excludedPlaceholder)
        })
      }
    }
  },

  computed: {
  }
}
