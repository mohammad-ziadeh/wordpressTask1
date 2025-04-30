<template>
  <PageWrapper page-id="am-customize">
    <template #header>
      <PageHeader></PageHeader>
    </template>

    <template v-if="pageRenderKey !== 'main' && pageRenderKey !== 'cbf' && pageRenderKey !== 'elf' && pageRenderKey !== 'ecf'" #filter>
      <!-- Step by step select for page type -->
      <div
        class="am-customize__fs-flow"
        :class="[
          {'am-customize__capc-panel': pageRenderKey === 'capc' && pagesType === 'panel'},
          {'am-customize__capc-auth': pageRenderKey === 'capc' && pagesType === 'auth'}
        ]"
        style="justify-content: space-between"
      >
        <div
          v-if="!licence.isBasic && !licence.isStarter && !licence.isLite && pageRenderKey !== 'capc' && pageRenderKey !== 'cape'"
          style="display: flex; align-items: center"
        >
          <div class="am-customize__fs-flow__label">
            {{amLabels.steps}}:
          </div>
          <AmSelect
            v-model="bookableType"
            @change="handleClick('menu', 0)"
          >
            <AmOption value="appointment" :label="amLabels.service_option" />
            <AmOption value="package" :label="amLabels.package_option" />
          </AmSelect>
        </div>
        <!--/ Step by step select for page type -->

        <!-- Cabinet select for page type -->
        <div
          v-if="!licence.isLite && (pageRenderKey === 'capc' || pageRenderKey === 'cape')"
          style="display: flex; align-items: center"
        >
          <div class="am-customize__fs-flow__label">
            {{amLabels.steps}}:
          </div>
          <AmSelect
            v-model="pagesType"
            @change="handleClick('menu', 0)"
          >
            <AmOption value="panel" label="Panel" />
            <AmOption value="auth" label="Login" />
          </AmSelect>
        </div>
        <!-- /Cabinet select for page type -->

        <!-- Button that will redirect to Catalog form -->
        <AmButton
          v-if="urlParams.get('current') !== 'sbsNew' && pageRenderKey !== 'capc' && pageRenderKey !== 'cape'"
          :style="{margin: '0 0 0 auto'}"
          @click="handleClick('menu', 0, urlParams.get('current'))"
        >
          Go Back To Catalog Form
        </AmButton>
        <!-- /Button that will redirect to Catalog form -->
      </div>
    </template>

    <template #default>
      <component :is="pagesObject[pageRenderKey]"></component>
    </template>

    <template #sidebar>
      <SettingsSidebar v-if="pageRenderKey !== 'main'"></SettingsSidebar>
    </template>

    <template #menu>
      <SettingsSidebar v-if="pageRenderKey !== 'main'" ref="sidebarRef"></SettingsSidebar>
    </template>
  </PageWrapper>
</template>

<script setup>
// * Components
import AmSelect from '../../_components/select/AmSelect.vue'
import AmOption from '../../_components/select/AmOption.vue'

// * Page Shell
import PageWrapper from '../parts/PageWrapper';
import PageHeader from '../parts/PageHeader';
import SettingsSidebar from "./settings/SettingsSidebar.vue";

// * Pages
import CustomizeMainPage from './navigation/CustomizeMainPage.vue';
import CustomizeStepNew from "./pages/CustomizeStepNew.vue";
import CustomizeCatalog from "./pages/CustomizeCatalog.vue";
import CustomizeEventList from "./pages/CustomizeEventList.vue";
import CustomizeEventCalendar from "./pages/CustomizeEventCalendar.vue";
import CustomizeCustomerPanel from "./pages/CustomizeCustomerPanel.vue";
import CustomizeEmployeePanel from "./pages/CustomizeEmployeePanel.vue";

// * Import form Vue
import {
  markRaw,
  inject,
  provide,
  ref,
  reactive,
  computed,
  onMounted,
  watchEffect
} from 'vue';
import { ElNotification } from 'element-plus'
// * Deepmerge
import deepMerge from 'deepmerge'
// * Import for axios
import httpClient from '../../../plugins/axios'
// * Import Composables
import {
  usePopulateMultiDimensionalObject,
  useOverrideValuesOfOneObjectWithAnother
} from '../../../assets/js/common/objectAndArrayManipulation'
// * Default Customize Settings
import { defaultCustomizeSettings, defaultTranslations } from '../../../assets/js/common/defaultCustomize.js'
import AmButton from "../../_components/button/AmButton";

// * Plugin Licence
let licence = inject('licence')

function notify (title, message, type, customClass) {
  if (typeof customClass === 'undefined') {
    customClass = ''
  }
  ElNotification({
    title: title,
    message: message,
    type: type,
    offset: 125,
    position: 'top-left',
    appendTo: '#am-customize'
  })
}

let bookableType = ref('appointment')
provide('bookableType', bookableType)

let pagesType = ref('auth')
provide('pagesType', pagesType)

// * Settings data
let settings = inject('settings')

// * Labels
let amLabels = inject('labels')

// * key that depends on selected language in customize header
let langKey = ref('default')
provide('langKey', langKey)

// * Object of all languages
let amLanguages = inject('languages')

// * Languages that were selected in general settings
let selectedLanguages = ref([])
settings.general.usedLanguages.forEach(lang => {
  selectedLanguages.value.push(amLanguages[lang])
})

provide('languageFunctionality', {
  langKey,
  selectedLanguages
})

// * Loading state
let loading = ref(false)
provide('loading', loading)

// * Sidebar Reference
let sidebarRef = ref(null)

// * Page Header block
let pageName = ref('Customize')

let stepIndex = ref(0)
provide('stepIndex', stepIndex)

// * Change name of the page in page header
function pageNameHandler (name = '') {
  pageName.value = name ? name : 'Customize'
}

provide('headerFunctionality', {
  pageNameHandler,
  pageName
})

// * Step name
let stepName = ref('')
provide('stepName', stepName)
let subStepName = ref('')
provide('subStepName', subStepName)

// * Sidebar functionality
let componentKey = ref('menu')
let goBackPath = ref('menu')
let parentPath = ref('menu')

function handleClick (data = '', index, pageKey = '') {
  componentKey.value = data ? data : goBackPath.value
  goBackPath.value = 'menu'

  if (pageKey) {
    pageRenderKey.value = pageKey
  }
  if (componentKey.value === 'menu') {
    subStepName.value = ''
  }
  if (index !== undefined) {
    stepIndex.value = index
  }
}

provide('sidebarFunctionality', {
  componentKey,
  parentPath,
  goBackPath,
  handleClick
})

// * Pages that represents all form types
let pagesObject = {
  main: markRaw(CustomizeMainPage),
  sbsNew: markRaw(CustomizeStepNew),
  cbf: markRaw(CustomizeCatalog),
  elf: markRaw(CustomizeEventList),
  ecf: markRaw(CustomizeEventCalendar),
  capc: markRaw(CustomizeCustomerPanel),
  cape: markRaw(CustomizeEmployeePanel)
}

let urlParams = new URLSearchParams(window.location.search)

// * Key that reference to page from type
let pageRenderKey = ref(urlParams.get('current') ? urlParams.get('current') : 'sbsNew')
provide('pageRenderKey', pageRenderKey)

// * Function that changes the pages ( value of pageRenderKey )
function changePages(pageString) {
  pageRenderKey.value = pageString
}
provide('pageFunctions', {
  changePages
})

watchEffect(() => {
  if (pageRenderKey.value === 'elf' || pageRenderKey.value === 'ecf') {
    bookableType.value = 'event'
  }
})

// * Customize Object settings
let amCustomize = ref({})
const combineMerge = (target, source, options) => {
  const destination = target.slice()
  source.forEach((item, index) => {
    if (typeof destination[index] === 'undefined') {
      destination[index] = options.cloneUnlessOtherwiseSpecified(item, options)
    } else if (options.isMergeableObject(item)) {
      destination[index] = deepMerge(target[index], item, options)
    } else if (target.indexOf(item) === -1) {
      destination.push(item)
    }
  })
  return destination
}

if (settings.customizedData) {
  amCustomize.value = deepMerge.all([settings.customizedData, JSON.parse(JSON.stringify({...defaultCustomizeSettings})), settings.customizedData], {arrayMerge: combineMerge})
} else {
  amCustomize.value = JSON.parse(JSON.stringify({...defaultCustomizeSettings}))
}

// * Customize data
provide('customize', amCustomize)

// * Labels
// * amTranslations object is used in sidebar segments
let amTranslations = reactive(JSON.parse(JSON.stringify({...defaultTranslations})))

// * Set selected languages and data from server
function labelsKeysLanguages(labelObj) {
  Object.keys(labelObj).forEach((item) => {
    labelObj[item] = {
      default : ''
    }
    settings.general.usedLanguages.forEach(lang => {
      labelObj[item][lang] = ''
    })
  })
}
usePopulateMultiDimensionalObject('labels', amTranslations, labelsKeysLanguages)

provide('translations', amTranslations)

function changeNamesInObject (a, b) {
  b.name = a.name
}
onMounted(() => {
  useOverrideValuesOfOneObjectWithAnother('name', defaultCustomizeSettings, amCustomize.value, changeNamesInObject)
})

let stepKey = computed(() => {
  return subStepName.value ? subStepName.value : stepName.value
})

let filterByKey = (key) => {
  return computed(() =>
      amCustomize.value[key] ? { [key]: amCustomize.value[key], 'fonts': amCustomize.value['fonts'] } : amCustomize.value
  )
}

function updateCustomizeLabel (labelObj) {
  let parentObjKey = stepKey.value
  if (parentPath.value === 'sidebar') parentObjKey = parentPath.value

  if (
    amCustomize.value[pageRenderKey.value][parentObjKey].translations === null
    || (Array.isArray(amCustomize.value[pageRenderKey.value][parentObjKey].translations)
      && amCustomize.value[pageRenderKey.value][parentObjKey].translations.length === 0)
  ) {
    amCustomize.value[pageRenderKey.value][parentObjKey].translations = {}
  }

  let labelLangObj = {}
  Object.keys(labelObj).forEach((label) => {
    Object.keys(labelObj[label]).forEach((lang) => {
      if (labelObj[label][lang]) {
        labelLangObj[label] = {}
        labelLangObj[label][lang] = labelObj[label][lang]
        if (amCustomize.value[pageRenderKey.value][parentObjKey].translations[label]) {
          Object.assign(amCustomize.value[pageRenderKey.value][parentObjKey].translations[label], labelLangObj[label])
        } else {
          amCustomize.value[pageRenderKey.value][parentObjKey].translations[label] = labelLangObj[label]
        }
      } else if (
        !labelObj[label][lang] &&
        amCustomize.value[pageRenderKey.value][parentObjKey].translations &&
        Object.keys(amCustomize.value[pageRenderKey.value][parentObjKey].translations).includes(label) &&
        Object.keys(amCustomize.value[pageRenderKey.value][parentObjKey].translations[label]).includes(lang)
      ) {

        delete amCustomize.value[pageRenderKey.value][parentObjKey].translations[label][lang]

        if (!Object.keys(amCustomize.value[pageRenderKey.value][parentObjKey].translations[label]).length) {
          delete amCustomize.value[pageRenderKey.value][parentObjKey].translations[label]
        }
      }
    })
  })

  if (!Object.keys(amCustomize.value[pageRenderKey.value][parentObjKey].translations).length) {
    amCustomize.value[pageRenderKey.value][parentObjKey].translations = null
  }
}

function updateLabelObject () {
  let parentObjKey = stepKey.value
  if (parentPath.value === 'sidebar') parentObjKey = parentPath.value

  usePopulateMultiDimensionalObject('labels', amTranslations[pageRenderKey.value][parentObjKey], updateCustomizeLabel)
}

provide('updateLabelObject', updateLabelObject)

// * Save Changes function
function saveChanges () {
  let currentForm = filterByKey(pageRenderKey.value)

  httpClient.post(
    '/settings',
    {customizedData: currentForm.value}
  )
    .then(() => {
      notify(amLabels.success, amLabels.settings_saved, 'success')
    })
    .catch(e => {
      notify(amLabels.error, e.message, 'error')
    })
}

function resetChanges () {
  amCustomize.value[pageRenderKey.value] = JSON.parse(JSON.stringify({...defaultCustomizeSettings[pageRenderKey.value]}))
  amTranslations[pageRenderKey.value] = JSON.parse(JSON.stringify({...defaultTranslations[[pageRenderKey.value]]}))
  amCustomize.value.fonts = JSON.parse(JSON.stringify({...defaultCustomizeSettings.fonts}))
  usePopulateMultiDimensionalObject('labels', amTranslations[pageRenderKey.value], labelsKeysLanguages)

  saveChanges()
}

provide('customizeSaveFunctionality', {
  saveChanges,
  resetChanges
})
</script>

<script>
export default {
  name: 'AmeliaCustomize'
}
</script>

<style lang="scss">
@import '../../../../src/assets/scss/common/icon-fonts/style';

:root {
  // Colors
  // shortcuts
  // -c-    color
  // -bgr-  background
  // -prim- primary
  // -sec-  secondary
  // primitive colors
  --am-c-primary: #{$blue-1000};
  --am-c-success: #{$green-1000};
  --am-c-error: #{$red-900};
  --am-c-warning: #{$yellow-1000};
  // main container colors - right part of the form
  --am-c-main-bgr: #{$am-white};
  --am-c-main-heading-text: #{$shade-800};
  --am-c-main-text: #{$shade-900};
  // sidebar container colors - left part of the form
  --am-c-sb-bgr: #17295A;
  --am-c-sb-text: #{$am-white};
  // input global colors - usage input, textarea, checkbox, radio button, select input, adv select input
  --am-c-inp-bgr: #{$am-white};
  --am-c-inp-border: #{$shade-250};
  --am-c-inp-text: #{$shade-900};
  --am-c-inp-placeholder: #{$shade-500};
  --am-c-checkbox-border: #{$shade-300};
  --am-c-checkbox-border-disabled: #{$blue-600};
  --am-c-checkbox-border-focused: #{$blue-700};
  --am-c-checkbox-label-disabled: #{$shade-600};
  // dropdown global colors - usage select dropdown, adv select dropdown
  --am-c-drop-bgr: #{$am-white};
  --am-c-drop-text: #{$shade-1000};
  // card global colors
  --am-c-card-bgr: #{$am-white};
  --am-c-card-border: #{$shade-250};
  --am-c-card-text: #{$shade-900};
  // button global colors
  --am-c-btn-prim: #{$blue-900};
  --am-c-btn-prim-text: #{$am-white};
  --am-c-btn-sec: #{$am-white};
  --am-c-btn-sec-text: #{$shade-900};

  // Properties
  // shortcuts
  // -h- height
  // -fs- font size
  // -rad- border radius
  --am-h-input: 40px;
  --am-fs-input: 15px;
  --am-rad-input: 6px;
  --am-fs-label: 15px;
  --am-fs-btn: 15px;

  // Font
  --am-font-family: 'Amelia Roboto', sans-serif;
}

.am-customize {
  &__fs {
    &-flow {
      max-width: 760px;
      width: 100%;
      margin: 16px auto;
      display: flex;
      flex-direction: row;
      align-items: center;

      &.am-customize__capc-panel {
        max-width: 1024px;
      }

      &.am-customize__capc-auth {
        max-width: 400px;
      }

      .am-select-wrapper {
        max-width: 180px;
        margin-left: 10px;
      }
    }
  }
}

.el-notification {
  --el-notification-width: 330px;
  --el-notification-padding: 14px 26px 14px 13px;
  --el-notification-radius: 8px;
  --el-notification-shadow: var(--el-box-shadow-light);
  --el-notification-border-color: var(--el-border-color-lighter);
  --el-notification-icon-size: 24px;
  --el-notification-close-font-size: var(--el-message-close-size, 16px);
  --el-notification-group-margin-left: 13px;
  --el-notification-group-margin-right: 8px;
  --el-notification-content-font-size: var(--el-font-size-base);
  --el-notification-content-color: var(--el-text-color-regular);
  --el-notification-title-font-size: 16px;
  --el-notification-title-color: var(--el-text-color-primary);
  --el-notification-close-color: var(--el-text-color-secondary);
  --el-notification-close-hover-color: var(--el-text-color-regular)
}

.el-notification {
  display: flex;
  width: var(--el-notification-width);
  padding: var(--el-notification-padding);
  border-radius: var(--el-notification-radius);
  box-sizing: border-box;
  border: 1px solid var(--el-notification-border-color);
  position: fixed;
  background-color: #FFFFFF;
  box-shadow: var(--el-notification-shadow);
  transition: opacity var(--el-transition-duration),transform var(--el-transition-duration),left var(--el-transition-duration),right var(--el-transition-duration),top .4s,bottom var(--el-transition-duration);
  overflow-wrap: anywhere;
  overflow: hidden;
  z-index: 9999
}

.el-notification.right {
  right: 16px
}

.el-notification.left {
  left: 175px;
  @include media-breakpoint-down($am-small-max) {
    --el-notification-width: 300;
    left: 30px
  }
}

.el-notification__group {
  margin-left: var(--el-notification-group-margin-left);
  margin-right: var(--el-notification-group-margin-right)
}

.el-notification__title {
  font-weight: 700;
  font-size: var(--el-notification-title-font-size);
  line-height: var(--el-notification-icon-size);
  color: var(--el-notification-title-color);
  margin: 0
}

.el-notification__content {
  font-size: var(--el-notification-content-font-size);
  line-height: 24px;
  margin: 6px 0 0;
  color: var(--el-notification-content-color);
  text-align: justify
}

.el-notification__content p {
  margin: 0
}

.el-notification .el-notification__icon {
  height: var(--el-notification-icon-size);
  width: var(--el-notification-icon-size);
  font-size: var(--el-notification-icon-size)
}

.el-notification .el-notification__closeBtn {
  position: absolute;
  top: 18px;
  right: 15px;
  cursor: pointer;
  color: var(--el-notification-close-color);
  font-size: var(--el-notification-close-font-size)
}

.el-notification .el-notification__closeBtn:hover {
  color: var(--el-notification-close-hover-color)
}

.el-notification .el-notification--success {
  --el-notification-icon-color: var(--el-color-success);
  color: var(--el-notification-icon-color)
}

.el-notification .el-notification--info {
  --el-notification-icon-color: var(--el-color-info);
  color: var(--el-notification-icon-color)
}

.el-notification .el-notification--warning {
  --el-notification-icon-color: var(--el-color-warning);
  color: var(--el-notification-icon-color)
}

.el-notification .el-notification--error {
  --el-notification-icon-color: var(--el-color-error);
  color: var(--el-notification-icon-color)
}

.el-notification-fade-enter-from.right {
  right: 0;
  transform: translate(100%)
}

.el-notification-fade-enter-from.left {
  left: 0;
  transform: translate(-100%)
}

.el-notification-fade-leave-to {
  opacity: 0
}

#am-customize{
  .am-lite-version {
    display: none !important;
  }

  .am-basic-version {
    display: none !important;
  }

  .am-starter-version {
    display: none !important;
  }
}
</style>
