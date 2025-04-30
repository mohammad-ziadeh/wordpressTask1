export default {
  data () {
    return {
      bookingAppointmentStatuses: [
        {
          value: 'pending',
          label: this.$root.labels.pending

        },
        {
          value: 'approved',
          label: this.$root.labels.approved

        },
        {
          value: 'canceled',
          label: this.$root.labels.canceled

        },
        {
          value: 'rejected',
          label: this.$root.labels.rejected

        }
      ],

      bookingEventStatuses: [
        {
          value: 'approved',
          label: this.$root.labels.approved

        },
        {
          value: 'pending',
          label: this.$root.labels.pending

        },
        {
          value: 'canceled',
          label: this.$root.labels.canceled

        }
      ],

      bookingPackageStatuses: [
        {
          value: 'approved',
          label: this.$root.labels.customer_package_purchased

        },
        {
          value: 'canceled',
          label: this.$root.labels.canceled

        }
      ],

      paymentStatuses: [
        {
          value: 'pending',
          label: this.$root.labels.pending

        },
        {
          value: 'paid',
          label: this.$root.labels.paid

        }
      ],

      orderStatuses: [
        {
          value: 'checkout-draft',
          label: this.$root.labels.wc_status_draft
        },
        {
          value: 'pending',
          label: this.$root.labels.wc_status_pending
        },
        {
          value: 'on-hold',
          label: this.$root.labels.wc_status_on_hold
        },
        {
          value: 'processing',
          label: this.$root.labels.wc_status_processing
        },
        {
          value: 'completed',
          label: this.$root.labels.wc_status_completed
        },
        {
          value: 'refunded',
          label: this.$root.labels.wc_status_refunded
        },
        {
          value: 'cancelled',
          label: this.$root.labels.wc_status_cancelled
        },
        {
          value: 'failed',
          label: this.$root.labels.wc_status_failed
        }
      ],

      bookableTypes: [
        {
          value: 'appointment',
          label: this.$root.labels.appointment
        },
        {
          value: 'package',
          label: this.$root.labels.package
        },
        {
          value: 'event',
          label: this.$root.labels.event
        }
      ]
    }
  },

  methods: {
    getBookingStatusLabel (value, type) {
      let item = ''

      switch (type) {
        case ('appointment'):
          item = this.bookingAppointmentStatuses.find(i => i.value === value)
          break

        case ('event'):
          item = this.bookingEventStatuses.find(i => i.value === value)
          break

        case ('package'):
          item = this.bookingPackageStatuses.find(i => i.value === value)
          break
      }

      return item && typeof item !== 'undefined' ? item.label : ''
    },

    getPaymentStatusLabel (value) {
      let item = this.paymentStatuses.find(i => i.value === value)

      return typeof item !== 'undefined' ? item.label : ''
    },

    getOrderStatusLabel (value) {
      let item = this.orderStatuses.find(i => i.value === value)

      return typeof item !== 'undefined' ? item.label : ''
    }
  }
}
