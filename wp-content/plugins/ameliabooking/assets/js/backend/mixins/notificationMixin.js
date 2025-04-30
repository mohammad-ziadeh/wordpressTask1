export default {
  data () {
    return {}
  },

  methods: {
    sendAmeliaSmsApiRequest (action, onSuccessCallback, onErrorCallback) {
      this.$http.post(`${this.$root.getAjaxUrl}/notifications/sms`, {
        'process': action,
        'data': typeof this[action] !== 'undefined' ? this[action] : []
      }).then((response) => {
        if (response.data.data.status === 'OK') {
          onSuccessCallback(response.data.data)
        } else {
          onErrorCallback(response.data.data)
        }
      }).catch(e => {
        console.log(e)
      })
    },

    getFormattedMessagePrice (price) {
      return [1, 3].includes(this.$root.settings.payments.priceSeparator)
        ? Math.round(price * 100000) / 100000 : (Math.round(price * 100000) / 100000).toString().replace('.', ',')
    },

    createNew (entity, toCustomer) {
      this.createNewContent = true
      this.notificationName = null
      this.amountTime = 1
      this.intervalTime = 'hours'
      this.notificationType = 'triggered'
      this.notificationTrigger = 'approved'
      this.notificationTimed = 'before'
      this.onTime = '00:00'
      this.notificationEnabled = true
      this.selectedServices = []
      this.selectedEvents = []
      this.showActiveClass = false
      this.notificationEntity = entity
      this.sendOnlyMe = false
      this.entity = entity

      let content = ''
      if (this.type === 'email') {
        content = toCustomer ? this.$root.labels.default_content_customer : this.$root.labels.default_content_employee
      } else if (this.type === 'sms') {
        content = toCustomer ? this.$root.labels.default_content_customer_sms : this.$root.labels.default_content_employee_sms
      }
      let subject = this.type !== 'whatsapp' ? entity === 'event' ? '%event_name%' : '%service_name%' : ''
      this.notification = {
        id: -1,
        entity: this.entity,
        sendTo: toCustomer ? 'customer' : 'provider',
        type: this.type,
        content: content,
        subject: subject,
        whatsAppTemplate: '',
        minimumTimeBeforeBooking: false
      }

      if (this.type === 'whatsapp') {
        this.updatePlaceholders()
      }

      this.selectedLanguage = null
      this.focusOnName()
    },

    setCustomNotificationFields () {
      this.notificationName = this.notification.customName
      this.notificationEnabled = this.notification.status === 'enabled'
      this.notificationType = this.notification.name.includes('_scheduled') ? 'scheduled' : 'triggered'
      this.notificationTrigger = this.notificationType === 'triggered' ? this.notification.name.split('_')[2] : 'approved'
      this.notificationTimed = this.notification.timeBefore ? 'before' : this.notification.timeAfter ? 'after' : this.notification.time ? 'sameDay' : 'before'
      this.onTime = this.notification.time
      if (this.onTime === null) this.onTime = '00:00'
      this.intervalTime = this.notificationType === 'scheduled' ? this.notification.name.split('_')[3] : 'hours'
      this.amountTime = this.fromSeconds(this.notificationTimed === 'before' ? this.notification.timeBefore : (this.notificationTimed === 'after' ? this.notification.timeAfter : 0))
      if (this.amountTime === 0) this.amountTime = 1
      this.notificationEntity = this.notification.entity
      this.sendOnlyMe = this.notification.sendOnlyMe
      this.selectedServices = this.notificationEntity === 'appointment' ? this.notification.entityIds : []
      this.selectedEvents = this.notificationEntity === 'event' ? this.notification.entityIds : []

      if (this.selectedEvents) {
        this.selectedEvents.forEach((e, index) => {
          if (!this.events.find(ev => ev.id === e)) {
            let recEvent = this.events.find(ev => ev.parentId === e)
            if (recEvent) {
              this.selectedEvents[index] = recEvent.id
            } else {
              this.selectedEvents[index] = this.$root.labels.past_event
            }
          }
        })
      }

      if (this.selectedLanguage && this.notification.translations) {
        let translations = JSON.parse(this.notification.translations)

        if (translations['subject'] && translations['subject'][this.selectedLanguage]) {
          this.notificationSubject = translations['subject'][this.selectedLanguage]
        }

        if (translations['content'] && translations['content'][this.selectedLanguage]) {
          this.notificationContent = translations['content'][this.selectedLanguage]
        }
      } else {
        this.notificationSubject = this.notification.subject
        this.notificationContent = this.notification.content
      }
    },

    getSeconds () {
      switch (this.intervalTime) {
        case 'minutes':
          return this.amountTime * 60
        case 'hours':
          return this.amountTime * 3600
        case 'days':
          return this.amountTime * 86400
        case 'weeks':
          return this.amountTime * 604800
        case 'months':
          return this.amountTime * 2629746
      }
    },

    fromSeconds (seconds) {
      switch (this.intervalTime) {
        case 'minutes':
          return Math.round(seconds / 60)
        case 'hours':
          return Math.round(seconds / 3600)
        case 'days':
          return Math.round(seconds / 86400)
        case 'weeks':
          return Math.round(seconds / 604800)
        case 'months':
          return Math.round(seconds / 2629746)
      }
    },

    getNotificationEntity () {
      let notifName = this.notificationType === 'scheduled' ? 'scheduled' : this.notificationTrigger
      let seconds = this.getSeconds()
      let intervalName = this.notificationType === 'scheduled' && this.notificationTimed !== 'sameDay' ? ('_' + this.intervalTime) : ''

      if (this.type === 'whatsapp') {
        this.notification.subject = this.whatsAppPlaceholders.header.map(h => h.value).join(' ')
        this.notification.content = this.whatsAppPlaceholders.body.map(h => h.value).join(' ')
      }

      return {
        'name': this.notification.sendTo + '_' + this.notificationEntity + '_' + notifName + intervalName,
        'customName': this.notificationName,
        'sendOnlyMe': this.sendOnlyMe,
        'status': this.notificationEnabled ? 'enabled' : 'disabled',
        'type': this.notification.type,
        'time': this.notificationType === 'scheduled' && this.notificationTimed === 'sameDay' ? this.onTime : null,
        'timeBefore': this.notificationType === 'scheduled' && this.notificationTimed === 'before' ? seconds : null,
        'timeAfter': this.notificationType === 'scheduled' && this.notificationTimed === 'after' ? seconds : null,
        'entityIds': this.notificationEntity === 'appointment' ? this.selectedServices : this.selectedEvents.filter(e => !isNaN(e)),
        'sendTo': this.notification.sendTo,
        'entity': this.notificationEntity,
        'translations': this.notification.translations,
        'subject': this.notification.subject,
        'content': this.notification.content,
        'textMode': this.notification.textMode,
        'whatsAppTemplate': this.notification.whatsAppTemplate,
        'minimumTimeBeforeBooking': this.notification.minimumTimeBeforeBooking
      }
    },

    focusOnName () {
      this.$nextTick(() => {
        if (this.$refs.notificationName) {
          this.$refs.notificationName.focus()
        } else if (this.$refs.notificationContent) {
          if (this.$refs.notificationContent.quill) {
            let quill = this.$refs.notificationContent.quill
            quill.focus()
          } else {
            this.$refs.notificationContent.focus()
          }
        }
      })
    }
  }
}
