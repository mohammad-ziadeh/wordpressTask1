import VueRouter from 'vue-router'
import axios from 'axios'
import router from './routes'
import ElementUI from 'element-ui'
import locale from 'element-ui/lib/locale/lang/en'
import moment from 'moment'
import VueMomentJS from 'vue-momentjs'
import VCalendar from 'v-calendar'
import 'idempotent-babel-polyfill'
import dateMixin from '../../js/common/mixins/dateMixin'
import EmptyState from '../../views/backend/parts/EmptyState'
import LicenceBlock from '../../views/backend/parts/LicenceBlock'
import LicenceBlockHeader from '../../views/backend/parts/LicenceBlockHeader'

const Vue = require('vue')

Vue.prototype.$http = axios
Vue.prototype.$http.defaults.headers.common = {
  'X-Requested-With': 'XMLHttpRequest'
}
Vue.prototype.$http.defaults.params = {
  'wpAmeliaNonce': window.wpAmeliaNonce
}

// eslint-disable-next-line no-undef, camelcase
__webpack_public_path__ = window.wpAmeliaPluginURL + 'public/'

Vue.component('EmptyState', EmptyState)
Vue.component('LicenceBlock', LicenceBlock)
Vue.component('LicenceBlockHeader', LicenceBlockHeader)
Vue.use(VueRouter)
Vue.use(VueMomentJS, moment)
Vue.use(ElementUI, {locale})
Vue.use(VCalendar, {
  firstDayOfWeek: window.wpAmeliaSettings.wordpress.startOfWeek + 1,
  locale: window.localeLanguage[0].replace(/_/g, "-")
})

// eslint-disable-next-line no-new
new Vue({
  el: '#amelia-app-backend',

  mixins: [dateMixin],

  router,

  data: {
    getUploadsAmeliaUrl: window.wpAmeliaUploadsAmeliaURL,
    useUploadsAmeliaPath: window.wpAmeliaUseUploadsAmeliaPath,
    getAjaxUrl: window.wpAmeliaPluginAjaxURL,
    getUrl: window.wpAmeliaPluginURL,
    getStoreUrl: window.wpAmeliaPluginStoreURL,
    getSiteUrl: window.wpAmeliaSiteURL,
    labels: window.wpAmeliaLabels,
    wcProducts: window.wpAmeliaWcProducts,
    languages: window.wpAmeliaLanguages,
    licence: {
      isLite: true,
      isStarter: false,
      isBasic: false,
      isPro: false,
      isDeveloper: false
    },
    timezones: 'wpAmeliaTimeZones' in window ? window.wpAmeliaTimeZones : [],
    timezone: 'wpAmeliaTimeZone' in window ? window.wpAmeliaTimeZone[0] : '',
    settings: window.wpAmeliaSettings,
    locale: window.localeLanguage[0],
    hasApiCall: true,
    smsPaddleSettings: {
      vendorId: window.wpAmeliaSMSVendorId,
      product10: window.wpAmeliaSMSProductId10,
      product20: window.wpAmeliaSMSProductId20,
      product50: window.wpAmeliaSMSProductId50,
      product100: window.wpAmeliaSMSProductId100,
      product200: window.wpAmeliaSMSProductId200,
      product500: window.wpAmeliaSMSProductId500
    }
  },

  mounted () {
    moment.locale(window.localeLanguage[0])
    if (window.localeLanguage[0] === 'ar') {
      this.reformatArabicNumbers()
    }

    if (window.localeLanguage[0] === 'fa_IR') {
      this.reformatFarsiNumbers()
    }
  }
})

// eslint-disable-next-line no-undef
router.push({name: menuPage})

window.onpopstate = function () {
  history.back()
}
