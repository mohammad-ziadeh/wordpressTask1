import priceMixin from '../../common/mixins/priceMixin'

export default {

  mixins: [priceMixin],

  data () {
    return {}
  },

  methods: {
    getServicePrice (service) {
      let serviceId = service.id

      let providers = this.getServiceProviders(service.id)

      if (typeof providers !== 'undefined' && providers.length > 0) {
        let minPrice = providers.reduce(function (min, provider) {
          let providerServicePrice = provider.serviceList.find(service => service.id === serviceId).price

          return providerServicePrice < min ? providerServicePrice : min
        }, providers[0].serviceList.find(service => service.id === serviceId).price)

        let maxPrice = providers.reduce(function (max, provider) {
          let providerServicePrice = provider.serviceList.find(service => service.id === serviceId).price

          return providerServicePrice > max ? providerServicePrice : max
        }, providers[0].serviceList.find(service => service.id === serviceId).price)

        if (minPrice !== maxPrice) {
          return {
            'price': this.getFormattedPrice(minPrice, !this.$root.settings.payments.hideCurrencySymbolFrontend) + ' - ' + this.getFormattedPrice(maxPrice, !this.$root.settings.payments.hideCurrencySymbolFrontend),
            'min': minPrice,
            'max': maxPrice
          }
        }

        return {
          'price': this.getFormattedPrice(minPrice, !this.$root.settings.payments.hideCurrencySymbolFrontend),
          'min': minPrice,
          'max': maxPrice
        }
      }

      return {
        'price': 0,
        'min': 0,
        'max': 0
      }
    },

    getServiceCapacity (service) {
      let serviceId = service.id

      let providers = this.getServiceProviders(serviceId)

      if (typeof providers !== 'undefined' && providers.length > 0) {
        let minCapacity = providers.reduce(function (min, provider) {
          let providerServicePrice = provider.serviceList.find(service => service.id === serviceId).minCapacity

          return providerServicePrice < min ? providerServicePrice : min
        }, providers[0].serviceList.find(service => service.id === serviceId).minCapacity)

        let maxCapacity = providers.reduce(function (max, provider) {
          let providerServicePrice = provider.serviceList.find(service => service.id === serviceId).maxCapacity

          return providerServicePrice > max ? providerServicePrice : max
        }, providers[0].serviceList.find(service => service.id === serviceId).maxCapacity)

        if (minCapacity !== maxCapacity) {
          return minCapacity + ' - ' + maxCapacity
        }

        return minCapacity
      }
    }

  }

}
