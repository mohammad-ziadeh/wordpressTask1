export default {
  methods: {
    getArrayCustomPricing (data) {
      let customPricing = null

      if (typeof data === 'undefined' || data === null || data === '') {
        customPricing = {enabled: false, durations: {}}
      } else if (typeof data === 'object') {
        if (Array.isArray(data.durations)) {
          return data
        } else {
          customPricing = JSON.parse(JSON.stringify(data))
        }
      } else {
        customPricing = JSON.parse(data)
      }

      let durations = []

      Object.keys(customPricing.durations).forEach((duration) => {
        durations.push({
          duration: parseInt(duration),
          price: customPricing.durations[duration].price,
          rules: customPricing.durations[duration].rules
        })
      })

      return {
        enabled: customPricing.enabled,
        durations: durations
      }
    },

    getJsonCustomPricing (data) {
      let durations = {}

      if (data && data.durations.filter(i => i.duration).length > 0) {
        data.durations.forEach((item) => {
          durations[item.duration] = {
            price: item.price,
            rules: item.rules
          }
        })

        return JSON.stringify({enabled: data.enabled, durations: durations})
      }

      return JSON.stringify({enabled: false, durations: {}})
    }
  }
}
