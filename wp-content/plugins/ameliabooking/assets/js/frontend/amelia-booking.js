/* eslint-disable no-undef */
import axios from 'axios'
import ElementUI from 'element-ui'
import locale from 'element-ui/lib/locale/lang/en'
import VCalendar from 'v-calendar'
import 'idempotent-babel-polyfill'
import moment from 'moment'
import VueMomentJS from 'vue-momentjs'
import Lightbox from 'vue-pure-lightbox'
import dateMixin from '../../js/common/mixins/dateMixin'
import VueFacebookPixel from 'vue-facebook-pixel'
import marketingMixin from '../../js/frontend/mixins/marketingMixin'
import store from './store'
import VueGtag from 'vue-gtag'
import LicenceBlock from '../../views/backend/parts/LicenceBlock'
import LicenceBlockHeader from '../../views/backend/parts/LicenceBlockHeader'

const Vue = require('vue')

// eslint-disable-next-line no-undef, camelcase
__webpack_public_path__ = wpAmeliaUrls.wpAmeliaPluginURL + 'public/'

const Booking = () => import(/* webpackChunkName: "booking" */ '../../views/frontend/booking/Booking.vue')
const Search = () => import(/* webpackChunkName: "search" */ '../../views/frontend/search/Search.vue')
const Catalog = () => import(/* webpackChunkName: "catalog" */ '../../views/frontend/catalog/Catalog.vue')
const Category = () => import(/* webpackChunkName: "category" */ '../../views/frontend/catalog/Category.vue')
const Service = () => import(/* webpackChunkName: "service" */ '../../views/frontend/catalog/Service.vue')
const Package = () => import(/* webpackChunkName: "package" */ '../../views/frontend/catalog/Package.vue')
const EventsList = () => import(/* webpackChunkName: "events-list" */ '../../views/frontend/events/EventsList.vue')
const EventsCalendar = () => import(/* webpackChunkName: "events-calendar" */ '../../views/frontend/events/EventsCalendar.vue')
const Cabinet = () => import(/* webpackChunkName: "cabinet" */ '../../views/frontend/cabinet/Cabinet.vue')

Vue.prototype.$http = axios
Vue.prototype.$http.defaults.headers.common = {
  'X-Requested-With': 'XMLHttpRequest'
}
if (window.wpAmeliaNonce) {
  Vue.prototype.$http.defaults.params = {
    'wpAmeliaNonce': window.wpAmeliaNonce
  }
}

Vue.component('LicenceBlock', LicenceBlock)
Vue.component('LicenceBlockHeader', LicenceBlockHeader)
Vue.use(VueMomentJS, moment)
Vue.use(ElementUI, {locale})
Vue.use(VCalendar, {
  firstDayOfWeek: window.wpAmeliaSettings.wordpress.startOfWeek + 1,
  locale: 'ameliaCalendarLocale' in window && window.ameliaCalendarLocale[0] ? window.ameliaCalendarLocale[0].replace('_', '-') : window.localeLanguage[0].replace(/_/g, "-")
})
Vue.use(Lightbox)

if (window.wpAmeliaSettings.facebookPixel.id) {
  marketingMixin.installFacebookPixelTracking()

  Vue.use(VueFacebookPixel)

  Vue.analytics.fbq.init(window.wpAmeliaSettings.facebookPixel.id, {})
}

if (window.wpAmeliaSettings.googleTag.id) {
  Vue.use(VueGtag,
    {
      config: {
        id: window.wpAmeliaSettings.googleTag.id,
        params: {
          send_page_view: false
        }
      }
    }
  )
}

if (window.wpAmeliaSettings.googleAnalytics.id) {
  Vue.use(VueGtag,
    {
      config: {
        id: window.wpAmeliaSettings.googleAnalytics.id,
        params: {
          send_page_view: false
        }
      }
    }
  )
}

var ameliaFbqViewContentLoaded = false
var ameliaGtmViewContentLoaded = false
var ameliaGaViewContentLoaded = false

function ameliaLazyLoading () {
  if (!('ameliaBooking' in window)) {
    window['ameliaBooking'] = {}
  }

  if (!('counter' in window['ameliaBooking'])) {
    window['ameliaBooking']['counter'] =
      (window.bookingEntitiesIds !== undefined ? window.bookingEntitiesIds.length : 0) +
      (window.lazyBookingEntitiesIds !== undefined ? window.lazyBookingEntitiesIds.length : 0)
  }

  if (window.lazyBookingEntitiesIds !== undefined) {
    window.lazyBookingEntitiesIds.forEach((shortCodeData) => {
      var ameliaPopUpLoaded = false

      var ameliaBookingButtonLoadInterval = setInterval(
        function () {
          var ameliaPopUpButton = document.getElementById(shortCodeData.trigger)

          if (!ameliaPopUpLoaded && ameliaPopUpButton !== null && typeof ameliaPopUpButton !== 'undefined') {
            ameliaPopUpLoaded = true

            clearInterval(ameliaBookingButtonLoadInterval)

            ameliaPopUpButton.onclick = function () {
              var ameliaBookingFormLoadInterval = setInterval(
                function () {
                  var ameliaPopUpForms = document.getElementsByClassName('amelia-skip-load-' + shortCodeData.counter)

                  if (ameliaPopUpForms.length) {
                    clearInterval(ameliaBookingFormLoadInterval)

                    for (var i = 0; i < ameliaPopUpForms.length; i++) {
                      ameliaLoading(ameliaPopUpForms[i].parentElement, null, JSON.parse(JSON.stringify(shortCodeData)), false)
                    }
                  }
                },
                1000
              )
            }

            if ('ameliaCache' in window && window.ameliaCache.length && window.ameliaCache[0]) {
              let cacheData = JSON.parse(window.ameliaCache[0])

              if (cacheData &&
                'request' in cacheData &&
                'trigger' in cacheData.request &&
                cacheData.request.trigger
              ) {
                let el = document.getElementById(cacheData.request.trigger)

                if (typeof el !== 'undefined' && el) {
                  el.click()
                }
              }
            }
          }
        },
        1000
      )
    })
  }
}

function ameliaLoading (element, selector, ids, isAutoLoading) {
  if ('ameliaBooking' in window && 'containerIds' in window['ameliaBooking'] && selector !== null) {
    if (window['ameliaBooking']['containerIds'].indexOf(selector) !== -1) {
      return
    }

    window['ameliaBooking']['containerIds'].push(selector)
  }

  let manuallyLoadedData = null

  if (element !== null) {
    manuallyLoadedData = ids
    manuallyLoadedData.counter = window['ameliaBooking']['counter']
    window['ameliaBooking']['counter']++
  }

  // eslint-disable-next-line no-new
  var ameliaContainers = element === null ? document.getElementsByClassName('amelia-frontend') : element.getElementsByClassName('amelia-frontend')

  var ameliaVueInstances = []

  if ('facebookPixel' in window.wpAmeliaSettings && window.wpAmeliaSettings.facebookPixel.id) {
    ['appointment', 'package', 'event'].forEach((type) => {
      if (
        (
          (type === 'appointment' && 'hasAmeliaAppointment' in window) ||
          (type === 'package' && 'hasAmeliaPackage' in window) ||
          (type === 'event' && 'hasAmeliaEvent' in window)
        ) && !ameliaFbqViewContentLoaded && 'analytics' in Vue && 'fbq' in Vue.analytics && Vue.analytics.fbq &&
        !('ameliaCache' in window && window.ameliaCache.length && window.ameliaCache[0])
      ) {
        ameliaFbqViewContentLoaded = true

        marketingMixin.trackAmeliaData(null, {googleTag: null, googleAnalytics: null, facebookPixel: Vue.analytics.fbq}, type, 'ViewContent')
      }
    })
  }

  if ('googleTag' in window.wpAmeliaSettings && window.wpAmeliaSettings.googleTag.id) {
    ['appointment', 'package', 'event'].forEach((type) => {
      if (
        (
          (type === 'appointment' && 'hasAmeliaAppointment' in window) ||
          (type === 'package' && 'hasAmeliaPackage' in window) ||
          (type === 'event' && 'hasAmeliaEvent' in window)
        ) && !ameliaGtmViewContentLoaded && '$gtag' in Vue && Vue.$gtag &&
        !('ameliaCache' in window && window.ameliaCache.length && window.ameliaCache[0])
      ) {
        ameliaGtmViewContentLoaded = true

        marketingMixin.trackAmeliaData(null, {googleTag: Vue.$gtag, googleAnalytics: null, facebookPixel: null}, type, 'ViewContent')
      }
    })
  }

  if ('googleAnalytics' in window.wpAmeliaSettings && window.wpAmeliaSettings.googleAnalytics.id) {
    ['appointment', 'package', 'event'].forEach((type) => {
      if (
        (
          (type === 'appointment' && 'hasAmeliaAppointment' in window) ||
          (type === 'package' && 'hasAmeliaPackage' in window) ||
          (type === 'event' && 'hasAmeliaEvent' in window)
        ) && !ameliaGaViewContentLoaded && '$gtag' in Vue && Vue.$gtag &&
        !('ameliaCache' in window && window.ameliaCache.length && window.ameliaCache[0])
      ) {
        ameliaGaViewContentLoaded = true

        marketingMixin.trackAmeliaData(null, {googleTag: null, googleAnalytics: Vue.$gtag, facebookPixel: null}, type, 'ViewContent')
      }
    })
  }

  for (var i = 0; i < ameliaContainers.length; i++) {
    if (ameliaContainers[i].classList.contains('amelia-skip-load') && (typeof isAutoLoading !== 'undefined' && isAutoLoading)) {
      continue
    }

    let availableTranslationsShort = window.wpAmeliaSettings.general.usedLanguages.map(key => key.length > 2 ? key.slice(0, 2) : key)

    let localeLanguageShort = window.localeLanguage[0].length > 2 ? window.localeLanguage[0].slice(0, 2) : window.localeLanguage[0]

    let useTranslations =
      window.wpAmeliaSettings.general.usedLanguages.indexOf(window.localeLanguage[0]) !== -1 ||
      availableTranslationsShort.indexOf(localeLanguageShort) !== -1

    ameliaVueInstances.push(
      new Vue({
        el: ameliaContainers[i],

        store,

        mixins: [dateMixin],

        components: {Booking, Search, Catalog, Category, Service, Package, EventsList, EventsCalendar, Cabinet},

        data: {
          getAjaxUrl: location.protocol === 'https:' ? wpAmeliaUrls.wpAmeliaPluginAjaxURL.replace('http:', 'https:') : wpAmeliaUrls.wpAmeliaPluginAjaxURL,
          getUrl: location.protocol === 'https:' ? wpAmeliaUrls.wpAmeliaPluginURL.replace('http:', 'https:') : wpAmeliaUrls.wpAmeliaPluginURL,
          useUploadsAmeliaPath: wpAmeliaUrls.wpAmeliaUseUploadsAmeliaPath,
          labels: window.wpAmeliaLabels,
          wcProducts: 'wpAmeliaWcProducts' in window ? window.wpAmeliaWcProducts : [],
          licence: {
            isLite: true,
            isStarter: false,
            isBasic: false,
            isPro: false,
            isDeveloper: false
          },
          timezones: 'wpAmeliaTimeZones' in window ? window.wpAmeliaTimeZones : [],
          timezone: 'wpAmeliaTimeZone' in window ? window.wpAmeliaTimeZone[0] : '',
          settings: JSON.parse(JSON.stringify(window.wpAmeliaSettings)),
          clonedSettings: JSON.parse(JSON.stringify(window.wpAmeliaSettings)),
          marketing: {
            facebookPixel: 'facebookPixel' in window.wpAmeliaSettings && window.wpAmeliaSettings.facebookPixel.id && window.wpAmeliaSettings.facebookPixel.id && 'analytics' in Vue && 'fbq' in Vue.analytics ? Vue.analytics.fbq : null,
            googleAnalytics: 'googleAnalytics' in window.wpAmeliaSettings && window.wpAmeliaSettings.googleAnalytics.id && '$gtag' in Vue ? Vue.$gtag : null,
            googleTag: 'googleTag' in window.wpAmeliaSettings && window.wpAmeliaSettings.googleTag.id && '$gtag' in Vue ? Vue.$gtag : null
          },
          shortcodeData: {
            enabled: false,
            booking: {
              trigger: manuallyLoadedData !== null && 'trigger' in manuallyLoadedData ? manuallyLoadedData.trigger : '',
              show: manuallyLoadedData !== null && 'show' in manuallyLoadedData ? manuallyLoadedData.show : '',
              package: manuallyLoadedData !== null && 'package' in manuallyLoadedData ? manuallyLoadedData.package : '',
              category: manuallyLoadedData !== null && 'category' in manuallyLoadedData ? manuallyLoadedData.category : '',
              service: manuallyLoadedData !== null && 'service' in manuallyLoadedData ? manuallyLoadedData.service : '',
              employee: manuallyLoadedData !== null && 'employee' in manuallyLoadedData ? manuallyLoadedData.employee : '',
              location: manuallyLoadedData !== null && 'location' in manuallyLoadedData ? manuallyLoadedData.location : '',
              eventId: manuallyLoadedData !== null && 'eventId' in manuallyLoadedData ? manuallyLoadedData.eventId : null,
              eventTag: manuallyLoadedData !== null && 'eventTag' in manuallyLoadedData ? manuallyLoadedData.eventTag : null,
              eventRecurring: manuallyLoadedData !== null && 'eventRecurring' in manuallyLoadedData ? manuallyLoadedData.eventRecurring : null
            },
            search: {
              today: ''
            },
            cabinet: {
              appointments: false,
              events: false,
              profile: false
            },
            hasCategoryShortcode: '',
            hasBookingShortcode: '',
            hasEventShortcode: '',
            counter: manuallyLoadedData !== null ? manuallyLoadedData.counter : ''
          },
          hasApiCall: null,
          useTranslations: useTranslations,
          fileUploadExtensions: fileUploadExtensions
        },

        mounted () {
          moment.locale(window.localeLanguage[0])
          if (window.localeLanguage[0] === 'ar') {
            this.reformatArabicNumbers()
          }

          if (window.localeLanguage[0] === 'fa_IR') {
            this.reformatFarsiNumbers()
          }

          let bookingData = null

          if (manuallyLoadedData === null) {
            bookingData = typeof window.bookingEntitiesIds !== 'undefined' ? window.bookingEntitiesIds.shift() : null
          } else {
            bookingData = manuallyLoadedData
          }

          this.shortcodeData.booking = bookingData ? {
            trigger: 'trigger' in bookingData && bookingData.trigger ? bookingData.trigger : null,
            show: 'show' in bookingData && bookingData.show ? bookingData.show : null,
            package: 'package' in bookingData && bookingData.package ? parseInt(bookingData.package) : null,
            category: 'category' in bookingData && bookingData.category ? parseInt(bookingData.category) : null,
            service: 'service' in bookingData && bookingData.service ? parseInt(bookingData.service) : null,
            employee: 'employee' in bookingData && bookingData.employee ? parseInt(bookingData.employee) : null,
            location: 'location' in bookingData && bookingData.location ? parseInt(bookingData.location) : null,
            eventId: 'eventId' in bookingData && bookingData.eventId ? parseInt(bookingData.eventId) : null,
            eventTag: 'eventTag' in bookingData ? bookingData.eventTag : null,
            eventRecurring: 'eventRecurring' in bookingData ? bookingData.eventRecurring : null
          } : {
            show: null,
            package: null,
            category: null,
            service: null,
            employee: null,
            location: null,
            eventId: null,
            eventTag: null,
            eventRecurring: null
          }

          this.hasApiCall = bookingData && 'hasApiCall' in bookingData && manuallyLoadedData === null ? bookingData.hasApiCall : 1

          this.shortcodeData.cabinet = bookingData ? {
            appointments: !!('appointments' in bookingData && bookingData.appointments),
            events: !!('events' in bookingData && bookingData.events),
            profile: !('profile' in bookingData && bookingData.profile)
          } : null

          if (bookingData &&
            ('appointments' in bookingData && bookingData.appointments === '') &&
            ('events' in bookingData && bookingData.events === '') &&
            ('profile' in bookingData && bookingData.profile === '')
          ) {
            this.shortcodeData.cabinet.appointments = true
            this.shortcodeData.cabinet.events = true
            this.shortcodeData.cabinet.profile = true
          }

          if (bookingData &&
            ('appointments' in bookingData && bookingData.appointments === '') &&
            ('events' in bookingData && bookingData.events === '') &&
            ('profile' in bookingData && bookingData.profile === '1')
          ) {
            this.shortcodeData.cabinet.appointments = true
            this.shortcodeData.cabinet.events = true
            this.shortcodeData.cabinet.profile = false
          }

          if (bookingData &&
            'cabinetType' in bookingData &&
            bookingData.cabinetType === 'customer' &&
            ('appointments' in bookingData && bookingData.appointments === '') &&
            ('events' in bookingData && bookingData.events === '')
          ) {
            this.shortcodeData.cabinet.appointments = true
            this.shortcodeData.cabinet.events = true
            this.shortcodeData.cabinet.profile = false
          }

          this.shortcodeData.searchToday = typeof window.searchToday !== 'undefined' ? window.searchToday : null

          this.shortcodeData.counter = (bookingData ? bookingData.counter : '')
          this.shortcodeData.hasCategoryShortcode = typeof window.hasCategoryShortcode !== 'undefined' ? window.hasCategoryShortcode : ''
          this.shortcodeData.hasBookingShortcode = typeof window.hasBookingShortcode !== 'undefined' ? window.hasBookingShortcode : ''
          this.shortcodeData.hasEventShortcode = typeof window.hasEventShortcode !== 'undefined' ? window.hasEventShortcode : ''
          this.shortcodeData.enabled = this.shortcodeData.booking !== null && !Object.values(this.shortcodeData.booking).every(x => (x === null || x === '' || isNaN(x)))
        }
      })
    )
  }
}

var disableAutomaticLoading = false

if ('ameliaBooking' in window && 'disableAutomaticLoading' in window['ameliaBooking'] && window['ameliaBooking']['disableAutomaticLoading'] === true) {
  window['ameliaBooking']['containerIds'] = []
  window['ameliaBooking']['load'] = ameliaLoading
  window['ameliaBooking']['counter'] =
    (window.bookingEntitiesIds !== 'undefined' ? window.bookingEntitiesIds.length : 0) +
    (window.lazyBookingEntitiesIds !== 'undefined' ? window.lazyBookingEntitiesIds.length : 0)
  disableAutomaticLoading = true
}

if (document.getElementsByClassName('amelia-frontend').length === 0) {
  document.addEventListener('DOMContentLoaded', function () {
    if (!disableAutomaticLoading) {
      ameliaLoading(null, null, null, true)
    }

    setTimeout(ameliaLazyLoading, 1000)
  })
} else {
  if (!disableAutomaticLoading) {
    ameliaLoading(null, null, null, true)

    setTimeout(ameliaLazyLoading, 1000)
  }
}
