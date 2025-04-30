import customFieldMixin from '../../../js/common/mixins/customFieldMixin'
import dateMixin from '../../../js/common/mixins/dateMixin'
import cabinetMixin from '../../frontend/mixins/cabinetMixin'
import paymentMixin from '../../../js/backend/mixins/paymentMixin'

export default {
  mixins: [customFieldMixin, cabinetMixin, dateMixin, paymentMixin],

  data () {
    return {
      recurringAppointments: [],
      customerCreatedCount: 0,
      appointment: null,
      bookings: [],
      duplicateEvent: false,
      exportAction: '',
      exportParams: {
        fields: [
          {label: this.$root.labels.customers, value: 'customers', checked: true},
          {label: this.$root.labels.employee, value: 'employee', checked: true},
          {label: this.$root.labels.service, value: 'service', checked: true},
          {label: this.$root.labels.location, value: 'location', checked: true},
          {label: this.$root.labels.start_time, value: 'startTime', checked: true},
          {label: this.$root.labels.end_time, value: 'endTime', checked: true},
          {label: this.$root.labels.duration, value: 'duration', checked: true},
          {label: this.$root.labels.payment_amount, value: 'paymentAmount', checked: true},
          {label: this.$root.labels.payment_status, value: 'paymentStatus', checked: true},
          {label: this.$root.labels.payment_method, value: 'paymentMethod', checked: true},
          {label: this.$root.labels.price, value: 'price', checked: true},
          {label: this.$root.labels.note, value: 'note', checked: true},
          {label: this.$root.labels.status, value: 'status', checked: true},
          {label: this.$root.labels.custom_fields, value: 'customFields', checked: true},
          {label: this.$root.labels.ph_booking_number_of_persons, value: 'persons', checked: true},
          {label: this.$root.labels.coupon_code, value: 'couponCode', checked: true},
          {label: this.$root.labels.extras, value: 'extras', checked: true}
        ]
      },
      savedAppointment: null,
      totalBookings: 0,
      statuses: [
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

        }
      ],
      noShowStatus: [
        {
          value: 'no-show',
          label: this.$root.labels['no-show']
        }
      ],
      options: {
        fetched: false,
        availableEntitiesIds: {
          packages: [],
          categories: [],
          employees: [],
          locations: [],
          services: []
        },
        entities: {
          categories: [],
          customers: [],
          customFields: [],
          employees: [],
          locations: [],
          services: []
        }
      }
    }
  },

  methods: {
    getInitAppointmentObject (packageCustomer = null) {
      let bookings = []

      if (packageCustomer) {
        let customer = this.options.entities.customers.find(c => c.id === packageCustomer.customerId)

        bookings = [{
          id: 0,
          customer: customer,
          status: this.$root.settings.general.defaultAppointmentStatus,
          duration: null,
          persons: 1,
          total: 0,
          extras: [],
          payments: [],
          price: 0,
          coupon: null,
          added: false,
          visible: true,
          info: JSON.stringify({
            firstName: customer.firstName,
            lastName: customer.lastName,
            email: customer.email,
            phone: customer.phone
          }),
          aggregatedPrice: null,
          packageCustomerService: {
            packageCustomer: {
              id: packageCustomer.id
            }
          },
          customFields: {}
        }]
      }

      return {
        id: 0,
        bookings: bookings,
        categoryId: '',
        serviceId: '',
        providerId: '',
        locationId: '',
        selectedDate: null,
        selectedPeriod: '',
        status: this.$root.settings.general.defaultAppointmentStatus,
        internalNotes: '',
        notifyParticipants: this.$root.settings.notifications.notifyCustomers,
        dateTimeSlots: [],
        calendarTimeSlots: [],
        occupiedTimeSlots: [],
        loadedDates: {},
        extrasTotalPrice: 0,
        serviceTotalPrice: 0,
        discountTotalPrice: 0,
        providerServiceMinCapacity: 0,
        providerServiceMaxCapacity: 0,
        extrasCount: 0,
        extrasSelectedCount: 0,
        duration: 0,
        lessonSpace: 0
      }
    },

    showDialogNewAppointment (packageCustomer = null) {
      this.setBookings(0)

      this.savedAppointment = null

      this.dialogAppointment = true

      setTimeout(() => {
        this.appointment = this.getInitAppointmentObject(packageCustomer)

        if (packageCustomer) {
          this.setBookingCustomFields()
        }
      }, 500)
    },

    showDialogEditAppointment (id, customerId = null) {
      this.dialogAppointment = true

      setTimeout(() => {
        this.getAppointment(id, customerId)
      }, 500)
    },

    saveAppointmentCallback (response, isReassign = false) {
      this.appointment = this.getInitAppointmentObject(null)

      if (response && 'booking' in response && response.booking && !isReassign) {
        this.$http.post(`${this.$root.getAjaxUrl}/bookings/success/` + response.booking.id, {
          type: 'appointment',
          appointmentStatusChanged: response.appointmentStatusChanged,
          paymentId: 'paymentId' in response && response.paymentId ? response.paymentId : null,
          packageBookingFromBackend: 'packageBookingFromBackend' in response ? response.packageBookingFromBackend : null
        })
      }

      this.getAppointmentOptions(true)
    },

    closeDialogAppointment (duplicateEvent = false) {
      this.duplicateEvent = duplicateEvent
      this.dialogAppointment = false
    },

    setBookings (appointmentId) {
      let bookings = []
      let $this = this

      this.options.entities.customers.forEach(function (cusItem) {
        if (cusItem.status !== 'hidden') {
          let bookingId = 0
          let extras = []
          let payments = []
          let coupon = null
          let price = 0
          let duration = null
          let persons = 1
          let aggregatedPrice = null
          let packageCustomerService = null
          let info = JSON.stringify({
            firstName: cusItem.firstName,
            lastName: cusItem.lastName,
            email: cusItem.email,
            phone: cusItem.phone
          })

          if ($this.appointment && appointmentId) {
            $this.appointment.bookings.forEach(function (bookItem) {
              if (bookItem.customerId === cusItem.id) {
                bookingId = bookItem.id
                extras = bookItem.extras
                payments = bookItem.payments
                price = bookItem.price
                duration = bookItem.duration
                persons = bookItem.persons
                coupon = bookItem.coupon
                info = bookItem.info
                aggregatedPrice = bookItem.aggregatedPrice
                packageCustomerService = bookItem.packageCustomerService
              }
            })
          }

          bookings.push({
            id: bookingId,
            customer: cusItem,
            status: $this.$root.settings.general.defaultAppointmentStatus,
            duration: duration,
            persons: persons,
            total: 0,
            extras: extras,
            payments: payments,
            price: price,
            coupon: coupon,
            added: false,
            info: info,
            aggregatedPrice: aggregatedPrice,
            packageCustomerService: packageCustomerService,
            customFields: {}
          })
        }
      })

      this.bookings = bookings
    },

    getAppointment (id, customerId) {
      let config = null

      let timeZone = ''

      if (this.$store !== undefined && this.$store.state.cabinet !== undefined && this.$store.state.cabinet.cabinetType === 'provider') {
        timeZone = this.$store.state.cabinet.timeZone === '' ? 'UTC' : this.$store.state.cabinet.timeZone

        config = Object.assign(this.getAuthorizationHeaderObject(), {params: {source: 'cabinet-' + this.$store.state.cabinet.cabinetType, timeZone: timeZone}})
      }

      if (this.$store === undefined && this.$root.settings.role === 'provider' &&
          this.options.entities.employees.length === 1 && this.options.entities.employees[0].timeZone) {
        config = Object.assign({params: {timeZone: this.options.entities.employees[0].timeZone}})
      }

      this.$http.get(
        `${this.$root.getAjaxUrl}/appointments/` + id,
        config
      )
        .then(response => {
          this.totalBookings = response.data.data.appointment.bookings.length

          if (customerId) {
            response.data.data.appointment.bookings = response.data.data.appointment.bookings.filter(i => parseInt(i.customerId) === parseInt(customerId))
          }

          let $this = this
          this.savedAppointment = JSON.parse(JSON.stringify(response.data.data.appointment))
          this.savedAppointment.categoryId = this.getServiceById(this.savedAppointment.serviceId).categoryId

          this.appointment = Object.assign(this.getInitAppointmentObject(null), response.data.data.appointment)
          this.appointment.notifyParticipants = !!this.appointment.notifyParticipants

          if (timeZone === 'UTC' && this.$root.settings.general.showClientTimeZone) {
            this.appointment.bookingStart = this.getConvertedUtcToLocalDateTime(this.appointment.bookingStart)
            this.appointment.bookingEnd = this.getConvertedUtcToLocalDateTime(this.appointment.bookingEnd)

            this.savedAppointment.bookingStart = this.getConvertedUtcToLocalDateTime(this.savedAppointment.bookingStart)
            this.savedAppointment.bookingEnd = this.getConvertedUtcToLocalDateTime(this.savedAppointment.bookingEnd)
          }

          this.appointment.bookings.forEach(function (bookItem) {
            let serviceExtras = null

            $this.options.entities.services.forEach(function (serItem) {
              if (serItem.id === $this.appointment.serviceId) {
                serviceExtras = JSON.parse(JSON.stringify(serItem.extras))

                serviceExtras.forEach(function (serExtItem) {
                  serExtItem.quantity = 1
                  serExtItem.selected = false
                })
              }
            })

            bookItem.customer = null
            bookItem.added = false

            $this.options.entities.customers.forEach(function (cusItem) {
              if (cusItem.id === bookItem.customerId) {
                bookItem.customer = cusItem

                let customerBookingInfo = $this.getCustomerInfo(bookItem)

                if (bookItem.id !== 0 && customerBookingInfo) {
                  bookItem.info = JSON.stringify({
                    firstName: customerBookingInfo.firstName,
                    lastName: customerBookingInfo.lastName,
                    email: customerBookingInfo.email,
                    phone: customerBookingInfo.phone
                  })
                }

                bookItem.added = true
              }
            })

            bookItem.extras.forEach(function (bookExtItem) {
              serviceExtras.forEach(function (serExtItem) {
                if (serExtItem.extraId === bookExtItem.extraId) {
                  serExtItem.id = bookExtItem.id
                  serExtItem.selected = true
                  serExtItem.quantity = bookExtItem.quantity ? bookExtItem.quantity : 1
                  serExtItem.price = bookExtItem.price
                  serExtItem.aggregatedPrice = bookExtItem.aggregatedPrice
                  serExtItem.tax = bookExtItem.tax
                }
              })
            })

            serviceExtras.forEach(function (serExtItem) {
              if (!serExtItem.selected) {
                serExtItem.id = 0
              }
            })

            bookItem.extras = serviceExtras

            if (bookItem.customFields === '[]' || bookItem.customFields === null) {
              bookItem.customFields = '{}'
            }

            bookItem.customFields = JSON.parse(bookItem.customFields)
          })

          this.setBookings(id)

          this.recurringAppointments = response.data.data.recurring

          this.appointment.lessonSpace = this.appointment.lessonSpace !== null ? this.appointment.lessonSpace.split('https://www.thelessonspace.com/space/')[1] : 0
          if (response.data.data.appointment.lessonSpaceDetails && $this.options.entities.spaces &&
              !$this.options.entities.spaces.find(s => s.id === response.data.data.appointment.lessonSpaceDetails.id)) {
            $this.options.entities.spaces.push(response.data.data.appointment.lessonSpaceDetails)
          }
        })
        .catch(e => {
          console.log(e.message)
        })
    },

    sortBookings (bookings) {
      bookings.sort(function (a, b) {
        return (a.customer.firstName + ' ' + a.customer.lastName).localeCompare((b.customer.firstName + ' ' + b.customer.lastName))
      })
    },

    duplicateAppointmentCallback (appointment) {
      this.appointment = appointment
      this.appointment.id = 0
      this.appointment.selectedDate = null
      this.appointment.selectedPeriod = ''
      this.appointment.dateTimeSlots = []
      this.appointment.calendarTimeSlots = []
      if (this.appointment.bookings[0].packageCustomerService) {
        this.appointment.bookings[0].payments = []
      }
      setTimeout(() => {
        this.dialogAppointment = true
      }, 300)
    },

    getCustomersFromGroup (appointment) {
      let customers = ''

      appointment.bookings.forEach((book) => {
        if (this.options.entities.customers.length) {
          let cus = this.getCustomerInfo(book)

          if (cus) {
            customers += '<span class="am-appointment-status-symbol am-appointment-status-symbol-' + book.status + '"></span><span>' + cus.firstName + ' ' + cus.lastName + '</span><br>'
          }
        }
      })

      return customers
    },

    saveCustomerCallback (response) {
      delete response.user['birthday']

      this.options.entities.customers.push(response.user)

      let service = this.appointment && this.appointment.serviceId ? this.getServiceById(this.appointment.serviceId) : null

      let booking = {
        id: 0,
        customer: response.user,
        customerId: response.user.id,
        status: this.$root.settings.general.defaultAppointmentStatus,
        persons: 1,
        duration: service ? service.duration : null,
        total: 0,
        extras: service ? service.extras : [],
        payments: [],
        coupon: null,
        info: JSON.stringify({
          firstName: response.user.firstName,
          lastName: response.user.lastName,
          email: response.user.email,
          phone: response.user.phone
        }),
        customFields: [],
        added: true
      }

      this.bookings.push(booking)
      this.sortBookings(this.bookings)

      if (this.appointment !== null) {
        this.appointment.bookings.push(booking)
        this.sortBookings(this.appointment.bookings)
      }

      this.setBookingCustomFields()

      this.customerCreatedCount++
    },

    updateAppointmentStatus (app, status, updateCount, callback = null) {
      this.updateStatusDisabled = true

      this.form.post(`${this.$root.getAjaxUrl}/appointments/status/${app.id}`, {
        'status': status,
        'packageCustomerId': 'packageCustomerId' in app && app.packageCustomerId ? app.packageCustomerId : null
      })
        .then(response => {
          let changedBookingsIds = []

          if ('bookingsWithChangedStatus' in response.data) {
            changedBookingsIds = response.data.bookingsWithChangedStatus.map(item => item.id)
          }

          if (updateCount) {
            this.setTotalStatusCounts(app, status, response.data.status, changedBookingsIds)
          }

          this.notify(
            (status === response.data.status) ? this.$root.labels.success : this.$root.labels.error,
            this.$root.labels.appointment_status_changed + (this.$root.labels[response.data.status]).toLowerCase(),
            (status === response.data.status) ? 'success' : 'error'
          )

          app.status = response.data.status

          if ('packageCustomerId' in app && app.packageCustomerId && callback) {
            callback()
          }

          this.updateStatusDisabled = false
        })
        .catch(e => {
          if ('timeSlotUnavailable' in e.response.data.data && e.response.data.data.timeSlotUnavailable === true) {
            this.notify(this.$root.labels.error, this.$root.labels.time_slot_unavailable, 'error')

            app.status = e.response.data.data.status
          }

          this.updateStatusDisabled = false
        })
    },

    updateAppointmentBookingStatus (booking, status, packageCustomer, callback = null) {
      this.updateStatusDisabled = true

      this.form.post(`${this.$root.getAjaxUrl}/bookings/status/${booking.id}`, {
        'status': status
      })
        .then(response => {
          this.notify(
            (status === response.data.booking.status) ? this.$root.labels.success : this.$root.labels.error,
            this.$root.labels.booking_status_changed + (this.$root.labels[response.data.booking.status]).toLowerCase(),
            (status === response.data.booking.status) ? 'success' : 'error'
          )

          booking.status = response.data.booking.status

          if (packageCustomer && callback) {
            callback()
          }

          this.updateStatusDisabled = false
        })
        .catch(e => {
          if ('timeSlotUnavailable' in e.response.data.data && e.response.data.data.timeSlotUnavailable === true) {
            this.notify(this.$root.labels.error, this.$root.labels.time_slot_unavailable, 'error')

            booking.status = e.response.data.data.status
          }

          this.updateStatusDisabled = false
        })
    },

    packageTooltipContent (bookings) {
      let data = this.bookingTypeCountInPackage(bookings)

      let content = ''

      if (data.regular) {
        content += data.regular + '/' + bookings.length + ' ' + this.$root.labels.bookings_regular_tooltip + '<br/>'
      }

      for (let packageId in data.package) {
        let pack = this.getPackageById(parseInt(packageId))

        content += data.package[packageId].count + '/' + bookings.length + ' ' + this.$root.labels.bookings_package_tooltip + ' <strong>' + (pack ? pack.name : 'Package') + '</strong><br/>'
      }

      return content
    },

    deletePaymentCallback (payment) {
      this.updatePaymentCallback(payment, true)
    },

    bookingTypeCountInPackage (bookings) {
      let bookingCountData = {
        regular: 0,
        package: {}
      }

      for (let i = 0; i < bookings.length; i++) {
        if (bookings[i].packageCustomerService !== null) {
          let packageId = bookings[i].packageCustomerService.packageCustomer.packageId

          let payment = bookings[i].packageCustomerService.packageCustomer.payment

          if (packageId in bookingCountData.package) {
            bookingCountData.package[packageId].count++

            bookingCountData.package[packageId].payment += (payment ? payment.ampunt : 0)
          } else {
            bookingCountData.package[packageId] = {
              count: 1,
              price: payment ? payment.amount : 0
            }
          }
        } else {
          bookingCountData.regular++
        }
      }

      return bookingCountData
    },

    getAppointmentPaymentMethods (bookings) {
      let methods = []
      bookings.forEach(function (booking) {
        let method = booking.payments.length ? booking.payments[0].gateway : null
        if (method === '' || method === null) {
          method = 'onSite'
        }
        if (methods.indexOf(method) === -1) {
          methods.push(method)
        }
      })

      return methods
    },

    getAppointmentPayment (bookings) {
      let methods = []
      bookings.forEach((booking) => {
        let method = booking.payments.length ? booking.payments[0] : null
        if (method === null) {
          method = 'onSite'
        }
        let methodExists = methods.find(m => this.getPaymentType(m) === this.getPaymentType(method))
        if (!methodExists) {
          methods.push(method)
        }
      })

      return methods
    },

    editPayment (obj) {
      if (obj.package) {
        let payment = obj.payment
        payment['coupon'] = obj.booking.packageCustomerService.packageCustomer.couponId ? obj.booking.coupon : null

        obj.booking = {
          price: obj.booking.packageCustomerService.packageCustomer.price,
          payments: [payment],
          extras: []
        }
      }

      this.selectedPaymentModalData = this.getPaymentData(obj.payment, obj.package ? null : this.savedAppointment, null, obj.package ? obj : null)

      this.selectedPaymentModalData.customer = this.getCustomerById(obj.payment.customerId)

      this.selectedPaymentModalData.recurring = obj.recurring

      this.dialogPayment = true
    },

    updatePaymentCallback (payment, deleteCallback = false) {
      let $this = this
      this.appointment.bookings.forEach(function (bookingItem) {
        bookingItem.payments.forEach(function (paymentItem, paymentIndex) {
          if (paymentItem.id === payment.id) {
            if (deleteCallback) {
              bookingItem.payments.splice(paymentIndex, 1)
              let index = $this.savedAppointment.bookings.findIndex(b => b.id === bookingItem.id)
              if (index !== -1) {
                $this.savedAppointment.bookings[index].payments.splice(paymentIndex, 1)
              }
            } else {
              bookingItem.payments.splice(paymentIndex, 1, payment)
              let index = $this.savedAppointment.bookings.findIndex(b => b.id === bookingItem.id)
              if (index !== -1) {
                $this.savedAppointment.bookings[index].payments.splice(paymentIndex, 1, payment)
              }
            }
          }
        })
      })

      this.dialogPayment = false
    },

    filterCategoriesByProviderServiceIDs (categories) {
      if (this.currentUser && this.$root.settings.role === 'provider') {
        let providerServiceIDs = this.options.entities.employees.find(e => e.id === this.currentUser.id).serviceList.map(s => s.id)

        const filteredCategories = categories.map(category => {
          if (category.serviceList && category.serviceList.length > 0) {
            const filteredServices = category.serviceList.filter(service => providerServiceIDs.includes(service.id))
            return {
              ...category,
              serviceList: filteredServices
            }
          }
          return category
        }).filter(category => category.serviceList && category.serviceList.length > 0)

        return filteredCategories
      }

      return categories
    }
  },

  watch: {
    'dialogAppointment' () {
      if (this.dialogAppointment === false && this.duplicateEvent === false) {
        this.appointment = null
      }
    }
  }
}
