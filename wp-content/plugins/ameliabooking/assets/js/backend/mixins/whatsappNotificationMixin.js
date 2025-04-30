export default {
  data () {
    return {}
  },

  methods: {
    findMatches (comp) {
      let matches = comp.text ? comp.text.match(/{{(.*?)}}/g) : null
      let result = []
      if (matches) {
        for (let i = 0; i < matches.length; i++) {
          result.push({type: '', value: '', whatsappType: 'text'})
        }
      }
      if (comp.format === 'IMAGE') {
        result.push({type: 'image', value: '', whatsappType: 'image', label: this.$root.labels.whatsapp_header_image})
      }
      if (comp.format === 'LOCATION') {
        result.push({type: 'locationPlaceholders', value: '%location_name%', whatsappType: 'location', label: this.$root.labels.whatsapp_header_location_name})
        result.push({type: 'locationPlaceholders', value: '%location_address%', whatsappType: 'location', label: this.$root.labels.whatsapp_header_location_address})
        result.push({type: 'locationPlaceholders', value: '%location_latitude%', whatsappType: 'location', label: this.$root.labels.whatsapp_header_location_latitude})
        result.push({type: 'locationPlaceholders', value: '%location_longitude%', whatsappType: 'location', label: this.$root.labels.whatsapp_header_location_longitude})
      }
      return result
    },

    findPlaceholderType (placeholder) {
      let found = ''
      for (const index in this.groupedPlaceholders) {
        let findValue = this.groupedPlaceholders[index].find(ph => ph.value === placeholder)
        if (findValue && (!('type' in findValue) || findValue.type === this.notification.entity || (findValue.type === 'package' && this.notification.name.includes('package')))) {
          found = index
          break
        }
      }

      return found
    },

    updatePlaceholders () {
      this.whatsAppPhRules = {header: {}, body: {}}
      let template = this.findTemplate()
      let types = [
        {name: 'header', field: 'subject'},
        {name: 'body', field: 'content'}
      ]
      types.forEach(
        component => {
          let comp = this.getWhatsAppComponent(component.name, template)
          this.whatsAppPlaceholders[component.name] = comp ? this.findMatches(comp) : []
          this.notification[component.field] = this.notification[component.field].replace('location:', '')
          let phs = this.notification[component.field].split(' ')
          if (this.notification[component.field]) {
            this.whatsAppPlaceholders[component.name].forEach(
              (p, index) => {
                p.type = p.type !== 'image' ? (index < phs.length ? this.findPlaceholderType(phs[index]) : '') : p.type
                p.value = index < phs.length ? phs[index] : ''
                this.whatsAppPhRules[component.name]['whatsappPlaceholders.' + index + '.type'] = [{required: true, message: this.$root.labels.whatsapp_select_ph, trigger: 'submit'}]
                this.whatsAppPhRules[component.name]['whatsappPlaceholders.' + index + '.value'] = [{required: true, message: this.$root.labels.whatsapp_select_ph, trigger: 'submit'}]
              }
            )
          }
        }
      )

      this.$nextTick(
        () => {
          if (this.$refs.whatsAppHeader && this.$refs.whatsAppHeader.$refs.whatsappPlaceholders) {
            this.$refs.whatsAppHeader.$refs.whatsappPlaceholders.clearValidate()
          }
          if (this.$refs.whatsAppBody && this.$refs.whatsAppBody.$refs.whatsappPlaceholders) {
            this.$refs.whatsAppBody.$refs.whatsappPlaceholders.clearValidate()
          }
        }
      )
    },

    validateForm () {
      let whatsappPh = true
      if (this.$refs.whatsAppHeader && this.$refs.whatsAppHeader.$refs.whatsappPlaceholders) {
        this.$refs.whatsAppHeader.$refs.whatsappPlaceholders.validate((valid) => whatsappPh = valid)
      }
      if (this.$refs.whatsAppBody && this.$refs.whatsAppBody.$refs.whatsappPlaceholders) {
        this.$refs.whatsAppBody.$refs.whatsappPlaceholders.validate((valid) => whatsappPh = whatsappPh ? valid : whatsappPh)
      }
      return whatsappPh
    },

    getWhatsAppComponent (type = 'body', template = null) {
      let notificationTemplate = template || this.findTemplate()
      if (notificationTemplate && notificationTemplate.components) {
        let component = notificationTemplate.components.find(
          c => c.type === type.toUpperCase() && (type === 'header'
            ? (c.format === 'TEXT' || c.format === 'IMAGE' || c.format === 'LOCATION') : true)
        )
        return component
      }
      return null
    },

    findTemplate () {
      return this.templates.find(t => t.name === this.notification.whatsAppTemplate)
    },

    getStatusColor (template) {
      switch (template.status) {
        case 'APPROVED':
          return '#5FCE19'
        case 'PENDING':
          return '#FFA700'
        case 'REJECTED':
          return '#ff1563'
      }
    }
  }
}
