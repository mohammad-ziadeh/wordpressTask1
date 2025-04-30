export default {

  data: () => ({
    colors: [
      '1788FB',
      '4BBEC6',
      'FBC22D',
      'FA3C52',
      'D696B8',
      '689BCA',
      '26CC2B',
      'FD7E35',
      'E38587',
      '774DFB',
      '31CDF3',
      '6AB76C',
      'FD5FA1',
      'A697C5'
    ],
    usedColors: []
  }),

  methods: {
    deleteImage (entity) {
      entity.pictureThumbPath = ''
      entity.pictureFullPath = ''
    },

    getAppropriateUrlParams (params) {
      if ('disableUrlParams' in this.$root.settings.activation && !this.$root.settings.activation.disableUrlParams) {
        return params
      }

      let names = ['categories', 'services', 'packages', 'employees', 'providers', 'providerIds', 'extras', 'locations', 'events', 'types', 'dates']

      let convertedParams = JSON.parse(JSON.stringify(params))

      names.forEach((name) => {
        if (name === 'extras' && name in convertedParams) {
          convertedParams['extras'] = JSON.parse(convertedParams['extras'])

          let extras = []

          convertedParams['extras'].forEach((item) => {
            extras.push(item.id + '-' + item.quantity)
          })

          convertedParams['extras'] = extras.length ? extras : null
        }

        if (name in convertedParams && Array.isArray(convertedParams[name]) && convertedParams[name].length) {
          convertedParams[name] = convertedParams[name].join(',')
        }
      })

      return convertedParams
    },

    inlineSVG () {
      let inlineSVG = require('inline-svg')
      inlineSVG.init({
        svgSelector: 'img.svg-amelia',
        initClass: 'js-inlinesvg'
      })
    },

    inlineSVGCabinet () {
      setTimeout(() => {
        let inlineSVG = require('inline-svg')
        inlineSVG.init({
          svgSelector: 'img.svg-cabinet',
          initClass: 'js-inlinesvg'
        })
      }, 100)
    },

    imageFromText (name, entity = {}, error = false) {
      let initials = this.getNameInitials(name)
      let colorIndex = Math.floor(Math.random() * this.colors.length)
      let colorHex = this.colors[colorIndex]

      this.usedColors.push(this.colors[colorIndex])
      this.colors.splice(colorIndex, 1)
      if (this.colors.length === 0) {
        this.colors = this.usedColors
        this.usedColors = []
      }

      if (error) {
        if (entity.firstName) {
          return this.$root.getUrl + 'public/img/default-employee.svg'
        }

        if (entity.latitude) {
          return this.$root.getUrl + 'public/img/default-location.svg'
        }

        return this.$root.getUrl + 'public/img/default-service.svg'
      }

      // Make canvas
      const canvas = document.createElement('canvas')
      canvas.width = 100
      canvas.height = 100
      const ctx = canvas.getContext('2d')

      // Draw background color
      ctx.fillStyle = colorHex.startsWith('#') ? colorHex : `#${colorHex}` // Background color
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw initials text
      ctx.font = '40px Arial'
      ctx.fillStyle = '#ffffff' // Text color
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(initials, canvas.width / 2, canvas.height / 2)

      // Convert canvas to data URL (as image source)
      return canvas.toDataURL('image/png')
    },

    pictureLoad: function (entity, isPerson) {
      if (entity !== null) {
        let name = isPerson === true ? entity.firstName + ' ' + entity.lastName : entity.name
        if (typeof name !== 'undefined') {
          entity.pictureThumbPath = entity.pictureThumbPath || this.imageFromText(name)
          return entity.pictureThumbPath
        }
      }
    },

    imageLoadError: function (entity, isPerson) {
      let name = isPerson === true ? entity.firstName + ' ' + entity.lastName : entity.name
      if (typeof name !== 'undefined') {
        entity.pictureThumbPath = this.imageFromText(name, entity, true)
      }
    },

    getNameInitials (name) {
      return name.split(' ').map((s) => s.charAt(0)).join('').toUpperCase().substring(0, 3).replace(/[^\w\s]/g, '')
    }
  }
}
