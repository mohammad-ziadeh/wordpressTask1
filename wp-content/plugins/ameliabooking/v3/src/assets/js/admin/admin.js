import {
  createApp,
  defineAsyncComponent
} from 'vue/dist/vue.esm-bundler'
import {
  provide,
  ref,
  reactive,
  readonly
} from "vue";
import { useLicence } from "../common/licence";
import store from '../../../store'

const CustomizeWrapper = defineAsyncComponent({
  loader: () => import('../../../views/admin/customize/Customize.vue')
})

const dynamicCdn = window.wpAmeliaUrls.wpAmeliaPluginURL + 'v3/public/';

window.__dynamic_handler__ = function(importer) {
  return dynamicCdn + 'assets/' + importer;
}
// @ts-ignore
window.__dynamic_preload__ = function(preloads) {
  return preloads.map(preload => dynamicCdn + preload);
}

createApp({
  setup() {
    const baseURLs = ref(window.wpAmeliaUrls)
    const languages = reactive(window.wpAmeliaLanguages)
    const settings = reactive(window.wpAmeliaSettings)
    const timeZone = ref('wpAmeliaTimeZone' in window ? window.wpAmeliaTimeZone[0] : '')
    const localLanguage = ref(window.localeLanguage[0])
    const labels = reactive(window.wpAmeliaLabels)
    const licence = reactive(useLicence())
    provide('settings', readonly(settings))
    provide('baseUrls', readonly(baseURLs))
    provide('timeZone', readonly(timeZone))
    provide('localLanguage', readonly(localLanguage))
    provide('languages', readonly(languages))
    provide('labels', readonly(labels))
    provide('licence', licence)
  }
}).component('Customize', CustomizeWrapper).use(store).mount('#amelia-app-backend-new')
