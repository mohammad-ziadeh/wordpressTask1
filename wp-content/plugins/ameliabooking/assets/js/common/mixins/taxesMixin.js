export default {
  methods: {
    getEntityTax (entityId, entityType) {
      let taxes = []

      if ('taxes' in this && this.taxes && this.taxes.length) {
        taxes = this.taxes
      } else if ('options' in this && 'entities' in this.options && 'taxes' in this.options.entities && this.options.entities.taxes && this.options.entities.taxes.length) {
        taxes = this.options.entities.taxes
      }

      let tax = taxes.find(
        t => t[entityType + 'List'].find(s => s.id === entityId)
      )

      return tax && typeof tax !== 'undefined' && ('status' in tax ? tax.status === 'visible' : true) ? tax : null
    },

    getEntityTaxAmount (tax, amount) {
      switch (tax.type) {
        case ('percentage'):
          return this.getPercentage(amount, tax.amount)
        case ('fixed'):
          return tax.amount
      }
    },

    getAmountData (entityTax, price, coupon) {
      if (entityTax && !entityTax.excluded) {
        price = this.getBaseAmount(price, entityTax)
      }

      let discount = coupon ? (price / 100 * coupon.discount) + coupon.deduction : 0

      let tax = 0

      if (entityTax) {
        tax = this.getEntityTaxAmount(entityTax, price - discount)
      }

      return {
        total: price,
        discount: discount,
        tax: tax
      }
    },

    getEventBookingPriceAmount (booking) {
      let price = 0

      if (booking.ticketsData && booking.ticketsData.length) {
        booking.ticketsData.forEach((ticketData) => {
          price += ticketData.price * (booking.aggregatedPrice ? ticketData.persons : 1)
        })
      } else {
        price = booking.price * (booking.aggregatedPrice ? booking.persons : 1)
      }

      return this.getAmountData(
        booking.tax && booking.tax.length ? booking.tax[0] : null,
        price,
        booking.coupon
      )
    },

    getAppointmentPriceAmount (service, extras, persons, coupon, includedTaxInTotal) {
      let serviceTax = null

      let excludedServiceTax = this.$root.settings.payments.taxes.excluded

      let enabledServiceTax = this.$root.settings.payments.taxes.enabled

      if ('tax' in service) {
        serviceTax = service.tax && service.tax.length ? service.tax[0] : null

        excludedServiceTax = serviceTax ? serviceTax.excluded : excludedServiceTax

        enabledServiceTax = serviceTax !== null
      } else if (enabledServiceTax) {
        serviceTax = this.getEntityTax(service.id, 'service')
      }

      let serviceAmount = (service.aggregatedPrice ? persons : 1) * service.price

      let appointmentTotalAmount = 0

      let serviceTotalAmount = 0

      let appointmentDiscountAmount = 0

      let appointmentTaxAmount = 0

      if (coupon) {
        appointmentTotalAmount = serviceAmount

        serviceTotalAmount = serviceAmount

        if (enabledServiceTax && serviceTax && !excludedServiceTax) {
          serviceAmount = this.getBaseAmount(serviceAmount, serviceTax)
        }

        let serviceDiscountAmount = coupon.discount ? this.getPercentage(serviceAmount, coupon.discount) : 0

        let serviceDiscountedAmount = serviceAmount - serviceDiscountAmount

        serviceAmount = serviceDiscountedAmount

        let deduction = coupon.deduction

        let serviceDeductionAmount = 0

        if (serviceDiscountedAmount > 0 && deduction > 0) {
          serviceDeductionAmount = serviceDiscountedAmount >= deduction ? deduction : serviceDiscountedAmount

          serviceAmount = serviceDiscountedAmount - serviceDeductionAmount

          deduction = serviceDiscountedAmount >= deduction ? 0 : deduction - serviceDiscountedAmount
        }

        if (enabledServiceTax && serviceTax && excludedServiceTax) {
          appointmentTaxAmount = this.getEntityTaxAmount(serviceTax, serviceAmount)
        } else if (enabledServiceTax && serviceTax && !excludedServiceTax) {
          serviceAmount = this.getBaseAmount(
            (service.aggregatedPrice ? persons : 1) * service.price,
            serviceTax
          )

          let serviceTaxAmount = this.getEntityTaxAmount(serviceTax, serviceAmount - serviceDiscountAmount - serviceDeductionAmount)

          if (includedTaxInTotal) {
            appointmentTotalAmount = serviceAmount + serviceTaxAmount
          } else {
            appointmentTotalAmount = serviceAmount

            serviceTotalAmount = serviceAmount

            appointmentTaxAmount = serviceTaxAmount
          }
        }

        appointmentDiscountAmount = serviceDiscountAmount + serviceDeductionAmount

        extras.forEach((selectedExtra) => {
          let extraTax = null

          let excludedExtraTax = this.$root.settings.payments.taxes.excluded

          let enabledExtraTax = this.$root.settings.payments.taxes.enabled

          if ('tax' in selectedExtra) {
            if (selectedExtra.tax && !Array.isArray(selectedExtra.tax)) {
              selectedExtra.tax = JSON.parse(selectedExtra.tax)
            }

            extraTax = selectedExtra.tax && selectedExtra.tax.length ? selectedExtra.tax[0] : null

            excludedExtraTax = extraTax ? extraTax.excluded : excludedExtraTax

            enabledExtraTax = extraTax !== null
          } else if (enabledExtraTax) {
            extraTax = this.getEntityTax(selectedExtra.extraId, 'extra')
          }

          let extraAggregatedPrice = selectedExtra.aggregatedPrice === null ? service.aggregatedPrice : selectedExtra.aggregatedPrice

          let extraAmount = selectedExtra.price * selectedExtra.quantity * (extraAggregatedPrice ? persons : 1)

          let extraTotalAmount = extraAmount

          if (enabledExtraTax && extraTax && !excludedExtraTax) {
            extraAmount = this.getBaseAmount(extraAmount, extraTax)
          }

          let extraDiscountAmount = coupon.discount ? this.getPercentage(extraAmount, coupon.discount) : 0

          let extraDiscountedAmount = extraAmount - extraDiscountAmount

          extraAmount = extraDiscountedAmount

          let extraDeductionAmount = 0

          if (extraDiscountedAmount > 0 && deduction > 0) {
            extraDeductionAmount = extraDiscountedAmount >= deduction ? deduction : extraDiscountedAmount

            extraAmount = extraDiscountedAmount - extraDeductionAmount

            deduction = extraDiscountedAmount >= deduction ? 0 : deduction - extraDiscountedAmount
          }

          if (enabledExtraTax && extraTax && excludedExtraTax) {
            appointmentTaxAmount += this.getEntityTaxAmount(extraTax, extraAmount)
          } else if (enabledExtraTax && extraTax && !excludedExtraTax) {
            extraAmount = this.getBaseAmount(
              selectedExtra.price * selectedExtra.quantity * (extraAggregatedPrice ? persons : 1),
              extraTax
            )

            let extraTaxAmount = this.getEntityTaxAmount(extraTax, extraAmount - extraDiscountAmount - extraDeductionAmount)

            if (includedTaxInTotal) {
              extraTotalAmount = extraAmount + extraTaxAmount
            } else {
              extraTotalAmount = extraAmount

              appointmentTaxAmount += extraTaxAmount
            }
          } else if (enabledExtraTax && !extraTax && !excludedExtraTax) {
            extraTotalAmount = selectedExtra.price * selectedExtra.quantity * (extraAggregatedPrice ? persons : 1)
          }

          appointmentTotalAmount += extraTotalAmount

          appointmentDiscountAmount += extraDiscountAmount + extraDeductionAmount
        })
      } else {
        if (enabledServiceTax && serviceTax && excludedServiceTax) {
          appointmentTaxAmount = this.getEntityTaxAmount(serviceTax, serviceAmount)
        } else if (enabledServiceTax && serviceTax && !excludedServiceTax && !includedTaxInTotal) {
          serviceAmount = this.getBaseAmount(
            (service.aggregatedPrice ? persons : 1) * service.price,
            serviceTax
          )

          appointmentTaxAmount = this.getEntityTaxAmount(serviceTax, serviceAmount)
        }

        appointmentTotalAmount = serviceAmount

        serviceTotalAmount = serviceAmount

        extras.forEach((selectedExtra) => {
          let extraAggregatedPrice = selectedExtra.aggregatedPrice === null ? service.aggregatedPrice : selectedExtra.aggregatedPrice

          let extraAmount = selectedExtra.price * selectedExtra.quantity * (extraAggregatedPrice ? persons : 1)

          let extraTax = null

          let excludedExtraTax = this.$root.settings.payments.taxes.excluded

          let enabledExtraTax = this.$root.settings.payments.taxes.enabled

          if ('tax' in selectedExtra) {
            if (selectedExtra.tax && !Array.isArray(selectedExtra.tax)) {
              selectedExtra.tax = JSON.parse(selectedExtra.tax)
            }

            extraTax = selectedExtra.tax && selectedExtra.tax.length ? selectedExtra.tax[0] : null

            excludedExtraTax = extraTax ? extraTax.excluded : excludedExtraTax

            enabledExtraTax = extraTax !== null
          } else if (enabledExtraTax) {
            extraTax = this.getEntityTax(selectedExtra.extraId, 'extra')
          }

          if (enabledExtraTax && extraTax && excludedExtraTax) {
            appointmentTaxAmount += this.getEntityTaxAmount(extraTax, extraAmount)
          } else if (enabledExtraTax && extraTax && !excludedExtraTax && !includedTaxInTotal) {
            extraAmount = this.getBaseAmount(
              selectedExtra.price * selectedExtra.quantity * (extraAggregatedPrice ? persons : 1),
              extraTax
            )

            appointmentTaxAmount += this.getEntityTaxAmount(extraTax, extraAmount)
          }

          appointmentTotalAmount += extraAmount
        })
      }

      return {
        total: appointmentTotalAmount,
        totalBookable: serviceTotalAmount,
        discount: appointmentDiscountAmount,
        tax: appointmentTaxAmount
      }
    },

    getBaseAmount (valueWithTax, tax) {
      switch (tax.type) {
        case ('percentage'):
          return valueWithTax / (1 + tax.amount / 100)
        case ('fixed'):
          return valueWithTax - tax.amount
      }
    },

    getPercentage (amount, percentage) {
      return amount * percentage / 100
    },

    getRound (amount) {
      return Math.round(amount * 100) / 100
    }
  }
}
