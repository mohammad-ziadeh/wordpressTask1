export default {

  data: () => ({
    searchCounter: 0,
    loadingCustomers: false,
    searchCustomersTimer: null,
    searchedCustomers: [],
    dialogCustomer: false
  }),

  methods: {
    setCustomerFromUrl (customerId) {
      let customer = null
      if (this.options.entities.customers.length) {
        customer = this.options.entities.customers.find(item => item.id == customerId)
      }

      if (customer) {
        this.params.customerId = customer.id
      }
    },

    getInitCustomerObject () {
      return {
        id: 0,
        firstName: '',
        lastName: '',
        externalId: '',
        phone: '',
        countryPhoneIso: null,
        email: '',
        gender: '',
        birthday: null,
        note: '',
        status: 'visible',
        type: 'customer',
        countPendingAppointments: 0
      }
    },

    setInitialCustomers () {
      if (this.$root.settings.role !== 'customer') {
        this.searchCustomers(
          '',
          () => {
            let entitiesCustomers = this.options && 'entities' in this.options && 'customers' in this.options.entities
              ? this.options.entities.customers : []

            let customersIds = entitiesCustomers.map(customer => parseInt(customer.id))

            let customers = entitiesCustomers

            this.searchedCustomers.forEach((customer) => {
              if (customersIds.indexOf(parseInt(customer.id)) === -1) {
                customersIds.push(customer.id)
                customers.push(customer)
              }
            })

            this.$nextTick(() => {
              this.options.entities.customers = Object.values(customers.sort((a, b) => (a.firstName.toLowerCase() > b.firstName.toLowerCase()) ? 1 : -1))

              if (this.params && this.params.customerId) {
                this.setCustomerFromUrl(this.params.customerId)
              }
            })
          }
        )
      }
    },

    searchCustomers (query, callback) {
      clearTimeout(this.searchCustomersTimer)

      this.loadingCustomers = true
      this.searchCounter++

      this.searchCustomersTimer = setTimeout(() => {
        let lastSearchCounter = this.searchCounter

        let searchParams = {search: query, page: 1, limit: this.$root.settings.general.customersFilterLimit, skipCount: 1}

        if (this.params && this.params.customerId) {
          searchParams['customers'] = [this.params.customerId]
        }

        this.$http.get(`${this.$root.getAjaxUrl}/users/customers`, {
          params: searchParams
        })
          .then(response => {
            if (lastSearchCounter >= this.searchCounter) {
              this.searchedCustomers = response.data.data.users.sort((a, b) => (a.firstName.toLowerCase() > b.firstName.toLowerCase()) ? 1 : -1)
            }

            this.loadingCustomers = false

            callback()
          })
          .catch(e => {
            this.loadingCustomers = false
          })
      },
      500
      )
    },

    getNoShowClass (customerId, customersNoShowCount = null, customer = null, status = null) {
      if (status && status === 'blocked') {
        return 'am-customer-name am-customer-blocked'
      }

      if (!this.$root.settings.roles.enableNoShowTag) {
        return ''
      }

      let customerNoShowCount = null

      let searchedCustomersIds = this.searchedCustomers.map(c => c.id)
      let entitiesCustomersIds = this.options && this.options.entities ? this.options.entities.customers.map(c => c.id) : []

      if (customer) {
        customerNoShowCount = customer.noShowCount
      } else if (customersNoShowCount !== null && customersNoShowCount.length !== 0 && customerId !== null) {
        let cust = customersNoShowCount.find(c => c.id === customerId)
        customerNoShowCount = cust ? cust.count : 0
      } else if (searchedCustomersIds.includes(customerId) && this.searchedCustomers.length && customerId !== 0) {
        customerNoShowCount = this.searchedCustomers.find(c => c.id === customerId).noShowCount
      } else if (entitiesCustomersIds.includes(customerId) && this.options.entities.customers && customerId !== 0) {
        customerNoShowCount = this.options.entities.customers.find(c => c.id === customerId).noShowCount
      }

      let noShowClass = ''

      if (customerNoShowCount) {
        noShowClass = 'am-customer-name'
        switch (true) {
          case customerNoShowCount === 1:
            noShowClass += ' am-no-show-gray'
            break
          case customerNoShowCount === 2:
            noShowClass += ' am-no-show-yellow'
            break
          case customerNoShowCount >= 3:
            noShowClass += ' am-no-show-red'
            break
        }
      }

      return noShowClass
    },

    getOptionClass (item, customersNoShowCount = null, status = null) {
      let customer = item.customer ? item.customer : item
      let noShowClass = this.getNoShowClass(
        (customer.id),
        (customersNoShowCount),
        (customer.noShowCount ? customer : null),
        status
      )
      let generatedClass = noShowClass || ''
      generatedClass += customer.email ? ' am-drop-item-name' : ''
      return generatedClass
    }
  }
}
