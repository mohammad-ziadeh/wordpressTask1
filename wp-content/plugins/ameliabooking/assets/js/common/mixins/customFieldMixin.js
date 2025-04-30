export default {
  data: () => ({}),

  methods: {
    isCustomFieldVisible (customField, type, bookableId) {
      switch (type) {
        case 'appointment':
          return customField.services.map(service => service.id).indexOf(bookableId) !== -1 || customField.allServices
        case 'event':
          return customField.events.map(event => event.id).indexOf(bookableId) !== -1 || customField.allEvents
      }

      return false
    },

    getAllowedCustomFields (bookingCustomFields, type, entityId) {
      let allowedCustomFieldsIds = []

      this.options.entities.customFields.forEach((customField) => {
        if (type === 'services' && customField.allServices || type === 'events' && customField.allEvents) {
          allowedCustomFieldsIds.push(parseInt(customField.id))
        } else {
          customField[type].forEach((entity) => {
            if (entity.id === entityId) {
              allowedCustomFieldsIds.push(parseInt(customField.id))
            }
          })
        }
      })

      let customFields = {}

      for (let key in bookingCustomFields) {
        if (allowedCustomFieldsIds.indexOf(parseInt(key)) !== -1) {
          customFields[key] = bookingCustomFields[key]
        }
      }

      return customFields
    },

    setBookingCustomFields () {
      if (this.appointment && this.appointment.bookings && this.appointment.bookings.length) {
        // Go through all bookings
        for (let i = 0; i < this.appointment.bookings.length; i++) {
          // Go through all custom fields
          for (let j = 0; j < this.options.entities.customFields.length; j++) {
            // Add custom fields as empty object for backward compatibility
            if (this.appointment.bookings[i].customFields === null) {
              this.appointment.bookings[i].customFields = {}
            }

            if (typeof this.appointment.bookings[i].customFields[this.options.entities.customFields[j].id] !== 'undefined') {
              this.appointment.bookings[i].customFields[this.options.entities.customFields[j].id].type = this.options.entities.customFields[j].type
            }

            if (this.appointment.bookings[i].customFields[this.options.entities.customFields[j].id] !== undefined &&
              this.appointment.bookings[i].customFields[this.options.entities.customFields[j].id].type === 'datepicker' &&
              this.appointment.bookings[i].customFields[this.options.entities.customFields[j].id].value
            ) {
              this.appointment.bookings[i].customFields[this.options.entities.customFields[j].id].value = this.$moment(this.appointment.bookings[i].customFields[this.options.entities.customFields[j].id].value).toDate()
            }

            // If custom field is not content and if custom field is not already set, add it in booking
            if (this.options.entities.customFields[j].type !== 'content' &&
              typeof this.appointment.bookings[i].customFields[this.options.entities.customFields[j].id] === 'undefined'
            ) {
              let value = ''
              if (this.options.entities.customFields[j].type === 'checkbox') {
                value = []
              }

              if (this.options.entities.customFields[j].type === 'datepicker') {
                value = null
              }

              this.$set(
                this.appointment.bookings[i].customFields,
                this.options.entities.customFields[j].id,
                {
                  label: this.options.entities.customFields[j].label,
                  value: value,
                  type: this.options.entities.customFields[j].type
                }
              )
            }
          }
        }
      }
    },

    getCustomFieldOptions (customFieldOptions) {
      return customFieldOptions.map(option => option.label)
    },

    getCustomFieldValue (value, type) {
      if (Array.isArray(value)) {
        return value.join('; ')
      } else {
        return type !== 'datepicker' ? value : (value ? this.getFrontedFormattedDate(value) : null)
      }
    },

    getCustomFieldFileURL (customFieldId, bookingId, fileIndex) {
      return this.$root.getAjaxUrl + '/fields/' + customFieldId + '/' + bookingId + '/' + fileIndex + '&source=cabinet-provider'
    }
  }
}
