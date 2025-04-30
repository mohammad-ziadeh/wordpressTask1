export default {

  data: () => ({}),

  methods: {
    replaceExistingObjectProperties (targetSettings, sourceSetting) {
      let $this = this

      Object.keys(targetSettings).forEach(function (key) {
        if (targetSettings[key] !== null && typeof targetSettings[key] === 'object' && key in sourceSetting) {
          $this.replaceExistingObjectProperties(targetSettings[key], sourceSetting[key])
          return
        }

        if (key in sourceSetting) {
          targetSettings[key] = sourceSetting[key]
        }
      })
    },

    addMissingObjectProperties (targetSettings, sourceSetting) {
      let $this = this

      Object.keys(sourceSetting).forEach(function (key) {
        let addSettings = false

        if (!(key in targetSettings)) {
          if (typeof sourceSetting[key] === 'object') {
            targetSettings[key] = {}
            addSettings = true
          } else {
            targetSettings[key] = null
            addSettings = true
          }
        }

        if (sourceSetting[key] !== null && typeof sourceSetting[key] === 'object') {
          $this.addMissingObjectProperties(targetSettings[key], sourceSetting[key])
          return
        }

        if (addSettings) {
          targetSettings[key] = sourceSetting[key]
        }
      })
    },

    scrollView (selector, position, force) {
      if (typeof jQuery !== 'undefined' && ((typeof force === 'undefined' ? false : force) || jQuery(window).width() <= 600)) {
        setTimeout(() => {
          let element = document.getElementById(selector)

          if (typeof element !== 'undefined' && element !== null) {
            element.scrollIntoView({behavior: 'smooth', block: position, inline: 'end'})
          }
        }, 200)
      }
    },

    scrollViewInModal (selector) {
      this.$nextTick(() => {
        let element = document.getElementById(selector)

        let scrollable = document.querySelectorAll('.am-dialog-scrollable')

        if (element && scrollable && scrollable.length) {
          let parent = element
          let distance = element.offsetTop

          do {
            parent = parent.offsetParent
            distance += parent.offsetTop
          } while (parent === scrollable[0])

          scrollable[0].scrollTop = distance
        }
      })
    },

    getUrlQueryParams (url) {
      let queryString = url.indexOf('#') > 0 ? url.substring(0, url.indexOf('#')).split('?')[1] : url.split('?')[1]
      if (queryString) {
        let keyValuePairs = queryString.split('&')
        let keyValue = []
        let queryParams = {}
        keyValuePairs.forEach(function (pair) {
          keyValue = pair.split('=')
          queryParams[keyValue[0]] = decodeURIComponent(keyValue[1]).replace(/\+/g, ' ')
        })
        return queryParams
      }
    },

    getUrlParams (url) {
      let queryParams = {}

      if (url.indexOf('?') !== -1) {
        let keyValuePairs = url.split('?')[1].split('&')
        let keyValue = []

        keyValuePairs.forEach(function (pair) {
          keyValue = pair.split('=')
          queryParams[keyValue[0]] = decodeURIComponent(keyValue[1]).replace(/\+/g, ' ')
        })
      }

      return queryParams
    },

    removeURLParameter (url, parameter) {
      let urlParts = url.split('?')
      if (urlParts.length >= 2) {
        let prefix = encodeURIComponent(parameter) + '='
        let pars = urlParts[1].split(/[&;]/g)

        for (let i = pars.length; i-- > 0;) {
          if (pars[i].lastIndexOf(prefix, 0) !== -1) {
            pars.splice(i, 1)
          }
        }

        url = urlParts[0] + (pars.length > 0 ? '?' + pars.join('&') : '')
        return url
      } else {
        return url
      }
    },

    capitalizeFirstLetter (string) {
      return string.charAt(0).toUpperCase() + string.slice(1)
    },

    trimProperty (entity, property) {
      entity[property] = entity[property].trim()
    }
  }
}
