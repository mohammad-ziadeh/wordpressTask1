import moment from 'moment'

export default {

  mixins: [],

  data () {
    return {
      selectedPackageId: null,
      packageSlotsFetched: 0,
      packageServiceSelected: 0,
      selectedPackage: null,
      activePackage: false,
      packageListShown: false,
      packageCreated: false,
      disableFetchPackageSlots: false
    }
  },

  methods: {
    getPackagePrice (pack, packageCustomerId = null) {
      let coupon = null

      if (packageCustomerId) {
        for (let key in pack.purchases) {
          if (pack.purchases[key].packageCustomerId === parseInt(packageCustomerId)) {
            coupon = pack.purchases[key].coupon
            break
          }
        }
      }

      let packPrice = pack.calculatedPrice ? pack.price : pack.price - pack.price / 100 * pack.discount

      let couponDiscount = coupon ? (packPrice * coupon.discount / 100 - coupon.deduction) : 0

      return packPrice - Math.abs(couponDiscount)
    },

    packageSlotsFetchedCallback () {
      this.packageSlotsFetched++

      if (this.passedPackage) {
        this.fetched = true
      }
    },

    getAvailablePackages () {
      return this.options.entities.packages.filter(
        pack => pack.availableBookableInfo.filter(bookable => bookable.serviceId === this.appointment.serviceId).length > 0
      ).sort((a, b) => a.position - b.position)
    },

    initPackage (selectedPackage) {
      this.selectedPackage = selectedPackage

      this.selectedPackage.bookable.forEach(function (bookable) {
        bookable.bookings = []

        bookable.bookings.push({
          cleared: false,
          date: null,
          time: null,
          providerId: null,
          locationId: null,
          slots: []
        })

        bookable.calendarData = {
          slotsIndexStarted: 0,
          clonedSlotsData: null,
          slotsData: null,
          disabledWeekdays: null,
          availableDates: null,
          availableTimeSlots: [],
          selectedWeekIndex: 0
        }
      })
    },

    selectPackage (selectedPackage) {
      let amContainer = document.getElementById(this.id)

      this.activePicker = false
      amContainer.classList.remove('am-active-picker')

      this.activeRecurringDates = false
      this.activeRecurringSetup = false
      this.activeRecurring = false
      this.calendarVisible = false
      this.packageCalendarActive = true

      this.initPackage(selectedPackage)

      this.getCurrentUser()

      this.activePackage = true
    },

    closePackage () {
      this.selectedPackage = null
      this.activePackage = false
      this.packageCreated = false
      this.packageCalendarActive = false

      if (this.selectedPackageId === null) {
        this.updateSettings(this.getServiceById(this.appointment.serviceId).settings)
      }

      let amContainer = document.getElementById(this.id)

      if (!this.fetchedSlots) {
        amContainer.classList.remove('am-active-picker')
      }

      setTimeout(() => {
        this.times = document.getElementById(this.calendarId)
      }, 200)
    },

    getPackageAppointmentsData () {
      let bookings = []

      let rules = []

      if (this.selectedPackage) {
        this.selectedPackage.bookable.forEach((bookable) => {
          bookable.bookings.forEach((booking) => {
            if (booking.date && booking.time) {
              bookings.push({
                bookingStart: moment(booking.date).format('YYYY-MM-DD') + ' ' + booking.time,
                serviceId: bookable.service.id,
                providerId: booking.providerId,
                locationId: booking.locationId
              })
            }
          })

          rules.push({
            serviceId: bookable.service.id,
            providerId: bookable.providerId ? bookable.providerId : null,
            locationId: bookable.locationId ? bookable.locationId : null
          })
        })
      }

      return {
        id: this.selectedPackage ? this.selectedPackage.id : null,
        data: bookings,
        rules: rules
      }
    },

    packageListShow () {
      this.loading = false
      this.activePackage = false
      this.packageListShown = true

      let amContainer = document.getElementById(this.id)

      amContainer.classList.toggle('am-active-package-list', true)
      amContainer.classList.toggle('am-active-picker', false)

      amContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' })
    },

    packageSlotsSelectedCallback () {
      this.appointment.bookings[0].extras = []

      this.updateSettings(this.getPackageById(this.selectedPackage.id).settings)

      let amContainer = document.getElementById(this.id)

      this.loading = false
      this.packageCreated = false
      this.packageListShown = false
      this.activeConfirm = true
      this.packageCreated = true

      amContainer.classList.remove('am-active-package-list')

      amContainer.classList.toggle('am-active-confirm', this.activeConfirm)
    },

    bookingPackageDataCompiler (dataArray) {
      let bookingData = []
      dataArray.forEach((booking) => {
        if (booking.date && booking.time) {
          bookingData.push({
            date: booking.date,
            time: booking.time,
            provider: this.getProviderById(booking.providerId) || this.responseEntities.employees.filter(emp => emp.id === booking.providerId)[0],
            location: booking.locationId ? this.getLocationById(booking.locationId) : null
          })
        }
      })

      return bookingData
    },

    getBookablePackageData () {
      let bookings = []

      let hasLocation = this.options.entities.locations.length > 0

      this.selectedPackage.bookable.forEach((bookable) => {
        let serviceAppointment = this.bookingPackageDataCompiler(bookable.bookings)

        let spanLengths = hasLocation ? {
          appointment: 1,
          date: 7,
          time: 4,
          employee: 6,
          location: 6
        } : {
          appointment: 1,
          date: 9,
          time: 6,
          employee: 8,
          location: 0
        }

        bookings.push({
          serviceName: bookable.service.name,
          serviceQuantity: bookable.quantity,
          serviceAppointment: serviceAppointment,
          serviceDuration: bookable.service.duration,
          service: bookable.service,
          spanLengths: spanLengths,
          hasLocations: hasLocation,
          singleEmployee: null,
          singleLocation: null
        })
      })

      return {
        name: this.selectedPackage.name,
        color: this.selectedPackage.color,
        discount: this.selectedPackage.discount,
        description: this.selectedPackage.description,
        price: this.getPackagePrice(this.selectedPackage),
        pictureThumbPath: this.selectedPackage.pictureThumbPath,
        durationCount: this.selectedPackage.durationCount,
        durationType: this.selectedPackage.durationType,
        endDate: this.selectedPackage.endDate,
        bookings: bookings,
        translations: this.selectedPackage.translations
      }
    },

    parsePackageAppointments (availablePackageBookings, appointments, timeZone) {
      let availability = availablePackageBookings.find(customerData => customerData.customerId === this.state.profile.id)

      if (typeof availability === 'undefined' || !availability) {
        availability = {packages: []}
      }

      this.packagesAppointments = this.parseAppointments(appointments, timeZone)
      this.packagesAvailability = availability ? availability.packages : []

      let servicesOccupancy = this.calculateServicesOccupancy()

      const packageData = []

      availability.packages.forEach((packageItemAvailable) => {
        let packageItem = this.getPackageById(packageItemAvailable.packageId)

        let currentPackageServicesIds = packageItem.bookable.map(bookableData => bookableData.service.id)

        packageItemAvailable.services.forEach((availableServiceData) => {
          if (currentPackageServicesIds.indexOf(availableServiceData.serviceId) === -1) {
            let oldPackageBookable = {}

            oldPackageBookable.providers = []

            oldPackageBookable.locations = []

            availableServiceData.bookings.forEach((bookingData) => {
              if (bookingData.providerId) {
                oldPackageBookable.providers.push(bookingData.providerId)
              }

              if (bookingData.locationId) {
                oldPackageBookable.locations.push(bookingData.locationId)
              }
            })

            oldPackageBookable.service = this.getServiceById(availableServiceData.serviceId)

            packageItem.bookable.push(oldPackageBookable)
          }
        })
      })

      this.options.entities.packages.forEach((packageItem) => {
        availability.packages.forEach((packageItemAvailable) => {
          if (packageItem.id === packageItemAvailable.packageId) {
            let expireDateString = null

            packageItem.bookable.forEach((packageService) => {
              packageService.appointmentServiceIds = []

              packageItemAvailable.services.forEach((availableServices) => {
                let totalServicesCount = {}

                availableServices.bookings.forEach((bookingData) => {
                  if (!(availableServices.serviceId in totalServicesCount)) {
                    totalServicesCount[availableServices.serviceId] = 0
                  }

                  totalServicesCount[availableServices.serviceId] += bookingData.total

                  if (expireDateString === null || moment(bookingData.end).isBefore(moment(expireDateString))) {
                    expireDateString = bookingData.end
                  }

                  // if (bookingData.employeeId &&
                  //     packageService.providers.map(provider => provider.id).indexOf(bookingData.employeeId) === -1
                  // ) {
                  //   packageService.providers.push(this.getProviderById(bookingData.employeeId))
                  // }

                  if (bookingData.locationId &&
                      packageService.locations.map(location => location.id).indexOf(bookingData.locationId) === -1
                  ) {
                    packageService.locations.push(this.getLocationById(bookingData.locationId))
                  }

                  packageService.appointmentServiceIds.push(bookingData.id)
                })

                if (packageService.service.id === availableServices.serviceId) {
                  packageService.service.appointmentsAvailable = this.getAvailableServicePackageAppointmentsCount(servicesOccupancy, packageItem.id, packageService.service.id)

                  packageService.service.total = this.getTotalServicePackageAppointmentsCount(servicesOccupancy, packageItem.id, packageService.service.id)
                }
              })

              const packageServiceAppointment = []

              Object.values(this.packagesAppointments).forEach((appointmentsDateGroup) => {
                appointmentsDateGroup.appointments.forEach((packageAppointment) => {
                  packageAppointment.bookings.forEach((booking) => {
                    if (packageService.appointmentServiceIds.indexOf(booking.packageCustomerService.id) !== -1 &&
                        packageAppointment.serviceId === packageService.service.id
                    ) {
                      packageServiceAppointment.push(packageAppointment)
                    }
                  })
                })
              })

              packageServiceAppointment.sort((a, b) => b.id - a.id)
              packageService.service.bookedAppointments = packageServiceAppointment
            })

            let isSharable = false

            for (let packageCustomerId in servicesOccupancy[packageItem.id]) {
              if (servicesOccupancy[packageItem.id][packageCustomerId].quantity !== null) {
                isSharable = true

                break
              }
            }

            packageItem.totalAvailableAppointments = this.getTotalAvailablePackageAppointmentsCount(servicesOccupancy, packageItem.id)
            packageItem.appointmentsSharable = isSharable
            packageItem.expireDateString = expireDateString
            packageData.push(packageItem)
          }
        })
      })

      packageData.forEach((data) => {
        if (!('purchases' in data)) {
          data.purchases = {}
        }
        if (!('payments' in data)) {
          data.payments = {}
        }

        this.packagesAvailability.find(item => item.packageId === data.id).services.forEach((service) => {
          service.bookings.forEach((purchase) => {
            if (!(purchase.id in data.purchases)) {
              data.purchases[purchase.id] = purchase
            }

            if (!(purchase.packageCustomerId in data.payments)) {
              data.payments[purchase.packageCustomerId] = {payments: purchase.payments, 'packagePurchased': purchase.purchased}
            }

            if (purchase.status === 'canceled') {
              data.totalAvailableAppointments = data.totalAvailableAppointments - purchase.count

              let bookableData = data.bookable.find(bookable => bookable.service.id === service.serviceId)

              if (bookableData && typeof bookableData !== 'undefined') {
                bookableData.service.appointmentsAvailable = bookableData.service.appointmentsAvailable - purchase.count

                bookableData.service.total = bookableData.service.total - purchase.total
              }
            }
          })
        })
      })

      this.packagesData = packageData
    },

    calculateServicesOccupancy () {
      let purchasesData = {}

      this.packagesAvailability.forEach((data) => {
        if (!(data.packageId in purchasesData)) {
          purchasesData[data.packageId] = {}
        }

        data.services.forEach((packageServiceData) => {
          packageServiceData.bookings.forEach((purchaseItem) => {
            if (!(purchaseItem.packageCustomerId in purchasesData[data.packageId])) {
              purchasesData[data.packageId][purchaseItem.packageCustomerId] = {
                quantity: purchaseItem.sharedCapacity ? purchaseItem.total : null,
                total: purchaseItem.sharedCapacity ? purchaseItem.total : null,
                shared: purchaseItem.sharedCapacity,
                services: {},
                ids: {}
              }
            }

            if (!(purchaseItem.serviceId in purchasesData[data.packageId][purchaseItem.packageCustomerId].services)) {
              purchasesData[data.packageId][purchaseItem.packageCustomerId].services[purchaseItem.serviceId] = {}
            }

            if (!(purchaseItem.id in purchasesData[data.packageId][purchaseItem.packageCustomerId].services[purchaseItem.serviceId])) {
              purchasesData[data.packageId][purchaseItem.packageCustomerId].services[purchaseItem.serviceId][purchaseItem.id] = {
                quantity: !purchaseItem.sharedCapacity ? purchaseItem.total : null,
                total: !purchaseItem.sharedCapacity ? purchaseItem.total : null
              }
            }

            purchasesData[data.packageId][purchaseItem.packageCustomerId].ids[purchaseItem.id] = true
          })
        })
      })

      let bookedIds = {}

      for (let dateString in this.packagesAppointments) {
        this.packagesAppointments[dateString].appointments.filter(a => a.status !== 'canceled').forEach((appointment) => {
          appointment.bookings.forEach((booking) => {
            if (booking.status !== 'canceled') {
              if (!(booking.packageCustomerService.id in bookedIds)) {
                bookedIds[booking.packageCustomerService.id] = {
                  serviceId: appointment.serviceId,
                  quantity: 0
                }
              }

              bookedIds[booking.packageCustomerService.id].quantity++
            }
          })
        })
      }

      for (let packageId in purchasesData) {
        for (let packageCustomerId in purchasesData[packageId]) {
          for (let packageCustomerServiceId in purchasesData[packageId][packageCustomerId].ids) {
            if (packageCustomerServiceId in bookedIds) {
              if (purchasesData[packageId][packageCustomerId].quantity !== null) {
                purchasesData[packageId][packageCustomerId].quantity -= bookedIds[packageCustomerServiceId].quantity
              } else {
                purchasesData[packageId][packageCustomerId].services[bookedIds[packageCustomerServiceId].serviceId][packageCustomerServiceId].quantity -= bookedIds[packageCustomerServiceId].quantity
              }
            }
          }

          delete purchasesData[packageId][packageCustomerId].shared
          delete purchasesData[packageId][packageCustomerId].ids
        }
      }

      return purchasesData
    },

    getTotalAvailablePackageAppointmentsCount (servicesOccupancy, packageId) {
      let count = 0

      for (let packageCustomerId in servicesOccupancy[packageId]) {
        let data = servicesOccupancy[packageId][packageCustomerId]

        if (data.quantity !== null) {
          count += data.quantity
        } else {
          for (let serviceId in data.services) {
            for (let packageCustomerServiceId in data.services[serviceId]) {
              count += data.services[serviceId][packageCustomerServiceId].quantity
            }
          }
        }
      }

      return count
    },

    getTotalServicePackageAppointmentsCount (servicesOccupancy, packageId, serviceId) {
      let count = 0

      for (let packageCustomerId in servicesOccupancy[packageId]) {
        let data = servicesOccupancy[packageId][packageCustomerId]

        if (data.total !== null) {
          count += data.total
        } else {
          for (let packageCustomerServiceId in data.services[serviceId]) {
            count += data.services[serviceId][packageCustomerServiceId].total
          }
        }
      }

      return count
    },

    getAvailableServicePackageAppointmentsCount (servicesOccupancy, packageId, serviceId) {
      let count = 0

      for (let packageCustomerId in servicesOccupancy[packageId]) {
        let data = servicesOccupancy[packageId][packageCustomerId]

        if (data.quantity !== null) {
          count += data.quantity
        } else {
          for (let packageCustomerServiceId in data.services[serviceId]) {
            count += data.services[serviceId][packageCustomerServiceId].quantity
          }
        }
      }

      return count
    },

    packagePurchaseHasAppointments (packageCustomer) {
      return packageCustomer.appointments.filter(a => a.id !== null).length > 0
    },

    parseAppointments (appointments, timeZone) {
      if (Object.keys(appointments).length === 0) {
        return {}
      }

      for (let key in appointments) {
        if (appointments.hasOwnProperty(key)) {
          appointments[key].appointments.forEach(appointment => {
            let appointmentCustomerBookings = {}

            appointment.bookings.forEach((booking) => {
              if (!(booking.customerId in appointmentCustomerBookings)) {
                appointmentCustomerBookings[booking.customerId] = []
              }

              appointmentCustomerBookings[booking.customerId][booking.id] = booking.status
            })

            let customerBookings = {}

            for (let customerId in appointmentCustomerBookings) {
              for (let bookingId in appointmentCustomerBookings[customerId]) {
                if (!(customerId in customerBookings) ||
                  (appointmentCustomerBookings[customerId][bookingId] === 'approved' || appointmentCustomerBookings[customerId][bookingId] === 'pending')
                ) {
                  customerBookings[customerId] = bookingId
                }
              }
            }

            appointment.bookings.forEach(booking => {
              if (booking.customerId in customerBookings &&
                parseInt(booking.id) !== parseInt(customerBookings[booking.customerId])
              ) {
                return
              }

              if (timeZone === '') {
                appointment.bookingStart = this.getConvertedUtcToLocalDateTime(appointment.bookingStart)
                appointment.bookingEnd = this.getConvertedUtcToLocalDateTime(appointment.bookingEnd)
              }

              appointment.loadingTimeSlots = false
              if (this.state && this.state.cabinetType === 'customer') {
                appointment.bookings = [booking]
              }
            })
          })
        }
      }

      if (timeZone === '') {
        let parsedGroupedAppointments = {}

        for (let key in appointments) {
          if (appointments.hasOwnProperty(key)) {
            appointments[key].appointments.forEach(appointment => {
              let appointmentDateString = appointment.bookingStart.split(' ')[0]

              if (!(appointmentDateString in parsedGroupedAppointments)) {
                parsedGroupedAppointments[appointmentDateString] = {
                  appointments: [appointment],
                  date: appointmentDateString
                }
              } else {
                parsedGroupedAppointments[appointmentDateString].appointments.push(appointment)
              }
            })
          }
        }

        return parsedGroupedAppointments
      }

      return appointments
    }

  }

}
