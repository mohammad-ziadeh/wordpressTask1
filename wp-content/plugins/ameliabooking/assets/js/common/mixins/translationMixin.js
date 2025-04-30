export default {

  data: () => ({}),

  methods: {
    // check for similar languages
    checkTranslations (entity, type) {
      let nameTranslations = type !== '' ? JSON.parse(entity.translations)[type] : JSON.parse(entity.translations)
      if (window.localeLanguage[0] in nameTranslations) {
        return nameTranslations[window.localeLanguage[0]]
      }

      let availableTranslations = Object.keys(nameTranslations)
      let availableTranslationsShort = Object.keys(nameTranslations).map(key => key.length > 2 ? key.slice(0, 2) : key)
      let localeLanguageShort = window.localeLanguage[0].length > 2 ? window.localeLanguage[0].slice(0, 2) : window.localeLanguage[0]
      let name = ''

      for (let i = 0; i < availableTranslationsShort.length; i++) {
        if (availableTranslationsShort[i] === localeLanguageShort) {
          name = nameTranslations[availableTranslations[i]]
          break
        }
      }

      return name
    },

    getTranslated (entity, type) {
      if (entity.translations && JSON.parse(entity.translations)[type] && this.checkTranslations(entity, type)) {
        return this.checkTranslations(entity, type)
      }
      return entity[type]
    },

    getNameTranslated (entity) {
      if (entity.translations && JSON.parse(entity.translations)['name'] && this.checkTranslations(entity, 'name')) {
        return this.checkTranslations(entity, 'name')
      }
      return entity.name
    },

    getTicketTranslated (entity) {
      if (entity.translations && this.checkTranslations(entity, '')) {
        return this.checkTranslations(entity, '')
      }
      return entity.name
    },

    getCfLabelTranslated (entity) {
      if (entity.translations && this.checkTranslations(entity, 'name')) {
        return this.checkTranslations(entity, 'name')
      }
      return entity.label
    },

    getCfOptionTranslated (entity) {
      if (entity.translations && this.checkTranslations(entity, '')) {
        return this.checkTranslations(entity, '')
      }
      return entity.label
    },

    getDescriptionTranslated (entity) {
      if (entity.translations && JSON.parse(entity.translations)['description'] && this.checkTranslations(entity, 'description')) {
        return this.checkTranslations(entity, 'description')
      }
      return entity.description
    },

    translateEntities (entities) {
      if (entities.services && entities.services.length) {
        entities.services.forEach(service => {
          service.name = this.getNameTranslated(service)
          service.description = this.getDescriptionTranslated(service)
          service.extras.forEach(extra => {
            extra.name = this.getNameTranslated(extra)
            extra.description = this.getDescriptionTranslated(extra)
          })
        })
      }

      if (entities.locations && entities.locations.length) {
        entities.locations.forEach(location => {
          location.name = this.getNameTranslated(location)
          location.description = this.getDescriptionTranslated(location)
        })
      }

      if (entities.packages && entities.packages.length) {
        entities.packages.forEach(pack => {
          pack.name = this.getNameTranslated(pack)
          pack.description = this.getDescriptionTranslated(pack)
          pack.bookable.forEach(bookable => {
            bookable.service.name = this.getNameTranslated(bookable.service)
            bookable.service.description = this.getDescriptionTranslated(bookable.service)
            if ('extras' in bookable.service) {
              bookable.service.extras.forEach(extra => {
                extra.name = this.getNameTranslated(extra)
                extra.description = this.getDescriptionTranslated(extra)
              })
            }
          })
        })
      }

      if (entities.categories && entities.categories.length) {
        entities.categories.forEach(category => {
          category.name = this.getNameTranslated(category)

          category.serviceList.forEach(service => {
            service.name = this.getNameTranslated(service)
            service.description = this.getDescriptionTranslated(service)
            service.extras.forEach(extra => {
              extra.name = this.getNameTranslated(extra)
              extra.description = this.getDescriptionTranslated(extra)
            })
          })
        })
      }

      if (entities.events && entities.events.length) {
        entities.events.forEach(event => {
          event.name = this.getNameTranslated(event)
          event.description = this.getDescriptionTranslated(event)
          event.extras.forEach(extra => {
            extra.name = this.getNameTranslated(extra)
            extra.description = this.getDescriptionTranslated(extra)
          })
        })
      }

      if (entities.customFields && entities.customFields.length) {
        entities.customFields.forEach(customField => {
          customField.label = this.getCfLabelTranslated(customField)
          customField.options.forEach(option => {
            option.label = this.getCfOptionTranslated(option)
          })
        })
      }

      if (entities.employees && entities.employees.length) {
        entities.employees.forEach(employee => {
          employee.firstName = this.getTranslated(employee, 'firstName')
          employee.lastName = this.getTranslated(employee, 'lastName')
          employee.serviceList.forEach(service => {
            service.name = this.getNameTranslated(service)
            service.description = this.getDescriptionTranslated(service)
            service.extras.forEach(extra => {
              extra.name = this.getNameTranslated(extra)
              extra.description = this.getDescriptionTranslated(extra)
            })
          })
        })
      }
    }
  },

  computed: {
  }
}
