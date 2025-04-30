<template>
  <template v-if="!amCustomize.fonts.customFontSelected">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link rel="stylesheet" :href="`${baseUrls.wpAmeliaPluginURL}v3/src/assets/scss/common/fonts/font.css`" type="text/css" media="all">
  </template>
  <div
    id="amelia-container"
    ref="ameliaContainer"
    class="am-fs__wrapper"
    :class="{'am-collapsed': sidebarCollapsed}"
    :style="cssVars"
  >
    <SideBar
      v-if="sidebarVisibility && containerWidth > 440"
      class="am-fs-sb"
      :class="{'am-collapsed': sidebarCollapsed}"
      :style="{width: !sidebarCollapsed ? '240px' : '72px', paddingBottom: `${sidebarFooterHeight + 16}px` }"
    >
      <template #step-list>
        <div class="am-fs-sb__step-wrapper">
          <template v-if="stepsArray[stepIndex] !== congratulationsStep">
            <div
              v-for="step in sidebarSteps"
              :key="step.label"
              class="am-fs-sb__step"
              :class="useLicenceMenuClass(step.key, licence)"
            >
              <div class="am-fs-sb__step-inner">
                <div class="am-fs-sb__step-icon">
                  <span :class="`am-icon-${step.icon}`"></span>
                  <span
                    v-if="step.key === 'cartStep'"
                    class="am-fs-sb__step-icon__number"
                    :class="sidebarCollapseItemsClass"
                  >
                    3
                  </span>
                </div>
                <transition name="fade">
                  <p
                    v-if="!sidebarCollapsed"
                    class="am-fs-sb__step-heading"
                    :class="sidebarCollapseItemsClass"
                  >
                    {{ step.label }}
                  </p>
                </transition>
                <div
                  class="am-fs-sb__step-checker"
                  :class="[{'am-fs-sb__step-checker-selected': step.selected}, sidebarCollapseItemsClass]"
                >
                  <transition name="fade">
                    <span v-if="step.finished" class="am-icon-check"></span>
                  </transition>
                </div>
              </div>
              <TransitionGroup
                tag="span"
                name="fade"
                appear
                class="am-fs-sb__step-selection__wrapper"
                :class="{'am-fs-sb__step-selection-packages': step.key === packageAppointmentsStep.key && step.stepSelectedData.length > 3 }"
              >
                <p
                  v-for="(itemSelected, index) in step.stepSelectedData"
                  :key="itemSelected.position"
                  class="am-fs-sb__step-selection"
                >
                  <span v-if="step.key !== packageAppointmentsStep.key || index < 3">
                    {{ itemSelected.value }}
                  </span>
                  <span v-else>
                    {{ labelsDisplay('plus_more', 'sidebar') }}
                  </span>
                </p>
              </TransitionGroup>
            </div>
          </template>
          <template v-else>
            <div>
              <transition name="fade">
                <AddToCalendar
                  v-if="!sidebarCollapsed"
                  :use-in-sb="true"
                  :calendar-string="labelsDisplay('add_to_calendar', 'congratulations')"
                ></AddToCalendar>
              </transition>
              <div v-if="sidebarCollapsed" class="am-fs-sb__step">
                <div class="am-fs-sb__step-inner">
                  <div class="am-fs-sb__step-icon">
                    <span class="am-icon-pennant"></span>
                  </div>
                  <div
                    class="am-fs-sb__step-checker am-fs-sb__step-checker-selected"
                    :class="sidebarCollapseItemsClass"
                  >
                    <transition name="fade">
                      <span class="am-icon-check"></span>
                    </transition>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </div>
      </template>
      <template #support-info>
        <div
          ref="sidebarFooterRef"
          class="am-fs-sb__footer"
        >
          <div
            v-if="amCustomize[pageRenderKey].sidebar.options.supportHeading.visibility || amCustomize[pageRenderKey].sidebar.options.companyPhone.visibility || amCustomize[pageRenderKey].sidebar.options.companyEmail.visibility"
            class="am-fs-sb__support"
          >
            <transition name="fade">
              <div
                v-if="!sidebarCollapsed && amCustomize[pageRenderKey].sidebar.options.supportHeading.visibility"
                class="am-fs-sb__support-heading"
                :class="sidebarCollapseItemsClass"
              >
                {{ labelsDisplay('get_in_touch', 'sidebar') }}
              </div>
            </transition>
            <div
              v-if="amCustomize[pageRenderKey].sidebar.options.companyPhone.visibility"
              class="am-fs-sb__support-email"
            >
              <template v-if="!sidebarCollapsed">
                +111222333
              </template>
              <template v-else>
                <span class="am-icon-phone"></span>
              </template>
            </div>
            <div
              v-if="amCustomize[pageRenderKey].sidebar.options.companyEmail.visibility"
              class="am-fs-sb__support-email"
            >
              <template v-if="!sidebarCollapsed">
                support@ameliatms.com
              </template>
              <template v-else>
                <span class="am-icon-email"></span>
              </template>
            </div>
          </div>
          <div
            class="am-fs-sb__menu"
            :class="sidebarCollapseItemsClass"
            @click="sidebarCollapsed = !sidebarCollapsed"
          >
            <Transition name="fade">
              <span
                v-if="!sidebarCollapsed"
                class="am-fs-sb__menu-text"
              >
                {{ labelsDisplay('collapse_menu', 'sidebar') }}
              </span>
            </Transition>
            <span :class="`am-icon-arrow-circle-${sidebarCollapsed ? 'left' : 'right'}`"></span>
          </div>
        </div>
      </template>
    </SideBar>
    <MainContent class="am-fs__main">
      <template  v-if="stepsArray[stepIndex] !== congratulationsStep" #header>
        <MainContentHeader
          :sidebar-visible="amCustomize.sbsNew.sidebar.options.self.visibility"
        ></MainContentHeader>
      </template>
      <template #step>
        <component :is="stepsArray[stepIndex]" class="am-fs__main-content"></component>
      </template>
      <template #footer>
        <MainContentFooter
          :customized-labels="globalStepLabels()"
          :primary-footer-button-type="amCustomize[pageRenderKey][stepName].options.primaryFooterButton.buttonType"
          :secondary-footer-button-type="footerButtonType"
          :second-button-show="!licence.isLite ? stepsArray[stepIndex] === congratulationsStep : false"
          :add-to-cart-button-show="stepsArray[stepIndex] === cartStep"
          :add-to-cart-button-type="amCustomize[pageRenderKey].cartStep.options.addToCart.buttonType"
          :back-to-cart-button-show="!licence.isLite && !licence.isStarter && !licence.isBasic ? stepsArray.indexOf(cartStep) > stepIndex : false"
          :back-to-cart-button-type="amCustomize[pageRenderKey].cartStep.options.backToCart.buttonType"
          :back-to-cart-label="dedicatedStepLabel('cancel', 'cartStep')"
        ></MainContentFooter>
      </template>
    </MainContent>
  </div>
</template>

<script setup>
// * Form construction
import SideBar from '../../../common/SbsFormConstruction/SideBar/SideBar.vue';
import MainContent from '../../../common/SbsFormConstruction/MainContent/MainContent.vue';
import MainContentHeader from '../../../common/SbsFormConstruction/MainContent/parts/MainContentHeader.vue'
import MainContentFooter from "../../../common/SbsFormConstruction/MainContent/parts/MainContentFooter.vue";

// * Parts
import AddToCalendar from '../steps/parts/AddToCalendar.vue'

// * Step components
import InitStep from '../steps/InitStep.vue'
import Extras from '../steps/Extras.vue'
import DateTimeStep from '../steps/DateTimeStep.vue'
import CartStep from '../steps/CartStep.vue'
import RecurringStep from '../steps/RecurringStep.vue'
import RecurringSummary from '../steps/RecurringSummary.vue'
import InfoStep from '../steps/InfoStep.vue'
import PaymentStep from '../steps/PaymentStep.vue'
import Congratulations from '../steps/Congratulations.vue'
import PackageStep from '../steps/PackageStep.vue'
import PackageInfoStep from '../steps/PackageInfoStep.vue'
import PackageAppointmentsStep from '../steps/PackageAppointmentsStep.vue'
import PackageAppointmentsListStep from '../steps/PackageAppointmentsListStep.vue'

// * Import from Vue
import {
  ref,
  provide,
  inject,
  markRaw,
  watch,
  watchEffect,
  nextTick,
  computed,
  onBeforeMount,
  onMounted
} from "vue";
// * Import composables
import { usePopulateMultiDimensionalObject } from '../../../../assets/js/common/objectAndArrayManipulation.js'
import { defaultCustomizeSettings } from '../../../../assets/js/common/defaultCustomize.js'
import { useLicenceMenuClass } from '../../../../assets/js/admin/labelsAndOptionsTreatment.js'

// * Plugin Licence
let licence = inject('licence')

// * Base Urls
const baseUrls = inject('baseUrls')

const amLabels = inject('labels')
let amTranslations = inject('translations')
let langKey = inject('langKey')
let stepName = inject('stepName')
let pageRenderKey = inject('pageRenderKey')
let amCustomize = inject('customize')

let amFonts = computed(() => {
  return amCustomize.value.fonts
})
provide('amFonts', amFonts)

// * Form Sidebar Collapse
let sidebarCollapsed = ref(false)

let sidebarCollapseItemsClass = ref('')

watch(sidebarCollapsed ,(current) => {
  if (current) {
    setTimeout(() => {
      sidebarCollapseItemsClass.value = 'am-collapsed'
    }, 1000)
  } else {
    sidebarCollapseItemsClass.value = ''
  }
})

let sidebarFooterRef = ref(null)
let sidebarFooterHeight = ref(0)

onMounted(() => {
  if(sidebarFooterRef.value) {
    setTimeout(() => {
      sidebarFooterHeight.value = sidebarFooterRef.value.offsetHeight
    }, 200)
  }
})

const initStep = markRaw(InitStep)
const extras = markRaw(Extras)
const dateTimeStep = markRaw(DateTimeStep)
const cartStep = markRaw(CartStep)
const recurringStep = markRaw(RecurringStep)
const recurringSummary = markRaw(RecurringSummary)
const infoStep = markRaw(InfoStep)
const paymentStep = markRaw(PaymentStep)
const congratulationsStep = markRaw(Congratulations)
const packageStep = markRaw(PackageStep)
const packageInfoStep = markRaw(PackageInfoStep)
const packageAppointmentsStep = markRaw(PackageAppointmentsStep)
const packageAppointmentsListStep = markRaw(PackageAppointmentsListStep)

let footerButtonType = computed(() => {
  return amCustomize.value[pageRenderKey.value][stepName.value].options.secondaryFooterButton
    ? amCustomize.value[pageRenderKey.value][stepName.value].options.secondaryFooterButton.buttonType
    : 'text'
})

function getServiceFlow () {
  let values = []

  values.push(initStep)

  if (licence.isStarter || licence.isBasic || licence.isPro || licence.isDeveloper) {
    values.push(extras)
  }

  values.push(dateTimeStep)

  if (licence.isPro || licence.isDeveloper) {
    values.push(cartStep)
  }

  if (licence.isBasic || licence.isPro || licence.isDeveloper) {
    values.push(recurringStep)

    values.push(recurringSummary)
  }

  values.push(infoStep)

  values.push(paymentStep)

  values.push(congratulationsStep)

  return values
}

let bookableType = inject('bookableType')
let serviceFlow = getServiceFlow()

let packageFlow = [
  packageStep,
  packageInfoStep,
  packageAppointmentsStep,
  packageAppointmentsListStep,
  infoStep,
  paymentStep,
  congratulationsStep
]

let stepsArray = computed(() => {
  if (bookableType.value === 'package') {
    return packageFlow
  }

  return serviceFlow
})

// * Step index
let stepIndex = inject('stepIndex')

// * Array of Sidebar steps
const sidebarSteps = ref([])
provide('sidebarSteps', sidebarSteps)

// * Monitoring step index for step selection
watch(stepIndex, (currStepIndex) => {
  if ('key' in stepsArray.value[stepIndex.value] &&
      currStepIndex in sidebarSteps.value &&
      'selected' in sidebarSteps.value[currStepIndex] &&
      'finished' in sidebarSteps.value[currStepIndex] &&
      stepsArray.value[stepIndex.value].key !== 'congratulations'
  ) {
    sidebarSteps.value[currStepIndex].selected = true
    sidebarSteps.value[currStepIndex].finished = true
  }
})

/**
 * Collecting and rearranging selected data in form sidebar based on item position in form
 * @param data
 */
function sidebarDataCollector (data) {
  // Determines are selected data already exists
  if (sidebarSteps.value[stepIndex.value].stepSelectedData.filter(item => item.reference === data.reference).length) {
    sidebarSteps.value[stepIndex.value].stepSelectedData.forEach((item, index, array) => {
      // Handles changing value of existing data
      if ((item.reference === data.reference) && data.value) {
        item.value = data.value
      }

      // Removes un-selected form data from sidebar array
      if ((item.reference === data.reference) && !data.value) {
        array.splice(index, 1)
      }
    })
  } else {
    // Handles the selection of new data
    sidebarSteps.value[stepIndex.value].stepSelectedData.push(data)
  }

  // Rearranges data in sidebar based on item position in the form
  sidebarSteps.value[stepIndex.value].stepSelectedData.sort((a, b) => {
    return a.position - b.position
  })
}

/**
 * Function that creates Data Array for SideBar
 */
function sidebarDataCreator () {
  stepsArray.value.forEach((item, index) => {
    if ('key' in item && item.key !== 'congratulations') {
      let stepLabels = amCustomize.value[pageRenderKey.value][item.key].translations
      let labelKey = item.sidebarData.label
      let heading = stepLabels && stepLabels[labelKey] ? stepLabels[labelKey][langKey.value] : amLabels[labelKey]

      if (item.name !== "CongratulationsStep") {
        let step = {
          key: item.key,
          label: heading,
          icon: item.sidebarData.icon,
          labelKey: labelKey,
          stepSelectedData: [],
          finished: false,
          selected: index === stepIndex.value,
        }
        sidebarSteps.value.splice(index, 0, step)
      }
    }
  })
}

watch(bookableType, () => {
  sidebarSteps.value = []
  sidebarDataCreator()
})

watchEffect( () => {
  stepName.value = stepsArray.value[stepIndex.value].key

  if (pageRenderKey.value === 'sbsNew') {
    sidebarSteps.value.forEach(item => {
      if (
        amCustomize.value[pageRenderKey.value][item.key].translations &&
        amCustomize.value[pageRenderKey.value][item.key].translations[item.labelKey] &&
        amCustomize.value[pageRenderKey.value][item.key].translations[item.labelKey][langKey.value]
      ) {
        item.label = amCustomize.value[pageRenderKey.value][item.key].translations[item.labelKey][langKey.value]
      } else {
        item.label = amLabels[item.labelKey]
      }
    })
  }
})

provide('sidebarStepsFunctions', {
  sidebarDataCollector
})

let { pageNameHandler } = inject('headerFunctionality', {
  pageNameHandler: () => 'Step-by-Step Booking Form'
})

pageNameHandler('Step-by-Step Booking Form')

// * implementation of saved labels into amTranslation object
let stepKey = ref('')
function savedLabelsImplementation (labelObj) {
  Object.keys(labelObj).forEach((labelKey) => {
    if (labelKey in amCustomize.value[pageRenderKey.value][stepKey.value].translations) {
      labelObj[labelKey] = {...labelObj[labelKey], ...amCustomize.value[pageRenderKey.value][stepKey.value].translations[labelKey]}
    }
  })
}

// * Component reference
let ameliaContainer = ref(null)

// * Plugin wrapper width
let containerWidth = ref()
provide('containerWidth', containerWidth)

// * window resize listener
window.addEventListener('resize', resize);

// * resize function
function resize() {
  if (ameliaContainer.value) {
    containerWidth.value = ameliaContainer.value.offsetWidth
  }
}

onMounted(() => {
  containerWidth.value = ameliaContainer.value.offsetWidth

  if (amCustomize.value.fonts.customFontSelected) {
    activateCustomFontStyles()
  }
})

function activateCustomFontStyles () {
  let head = document.head || document.getElementsByTagName('head')[0]
  if (head.querySelector('#amCustomFont')) {
    head.querySelector('#amCustomFont').remove()
  }

  let css = `@font-face {font-family: '${amCustomize.value.fonts.fontFamily}'; src: url(${amCustomize.value.fonts.fontUrl});}`
  let style = document.createElement('style')
  head.appendChild(style)
  style.setAttribute('type', 'text/css')
  style.setAttribute('id', 'amCustomFont')
  style.appendChild(document.createTextNode(css))
}

let sidebarVisibility = computed(() => {
  nextTick(() => {
    resize()
  })
  return amCustomize.value.sbsNew.sidebar.options.self.visibility
})

/**
 * Lifecycle Hooks
 */
onBeforeMount(() => {
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: 'smooth'
  })
  sidebarDataCreator()
  Object.keys(amCustomize.value[pageRenderKey.value]).forEach(step => {
    // ! Customize ce puci ako se korisnik vrati na predthodnu verziju plugin_a gde ne postoje odradjeni stepovi
    // ! a u bazi je sacuvan customize sa tim stepovima -- resenje je da se resetuje forma ili da se ubaci u uslov ispod
    // ! amTranslations[pageRenderKey.value][step]
    if (step !== 'colors' && amCustomize.value[pageRenderKey.value][step].translations) {
      stepKey.value = step
      usePopulateMultiDimensionalObject('labels', amTranslations[pageRenderKey.value][step], savedLabelsImplementation)
    }
  })
})

function globalStepLabels () {
  let stepLabels = {}
  let customizedLabels = amCustomize.value[pageRenderKey.value][stepName.value].translations
  if (customizedLabels && Object.keys(customizedLabels)) {
    Object.keys(amCustomize.value[pageRenderKey.value][stepName.value].translations).forEach(label => {
      stepLabels[label] = amCustomize.value[pageRenderKey.value][stepName.value].translations[label][langKey.value]
    })
  } else {
    stepLabels = {}
  }

  return stepLabels
}

function dedicatedStepLabel (label, stepKey) {
  let computedLabel = computed(() => {
    return amCustomize.value[pageRenderKey.value][stepKey].translations
    && amCustomize.value[pageRenderKey.value][stepKey].translations[label]
    && amCustomize.value[pageRenderKey.value][stepKey].translations[label][langKey.value]
      ? amCustomize.value[pageRenderKey.value][stepKey].translations[label][langKey.value]
      : amLabels[label]
  })

  return computedLabel.value
}

// * Label computed function
function labelsDisplay (label, stepKey) {
  let computedLabel = computed(() => {
    return amCustomize.value[pageRenderKey.value][stepKey].translations
    && amCustomize.value[pageRenderKey.value][stepKey].translations[label]
    && amCustomize.value[pageRenderKey.value][stepKey].translations[label][langKey.value]
      ? amCustomize.value[pageRenderKey.value][stepKey].translations[label][langKey.value]
      : amLabels[label]
  })

  return computedLabel.value
}

// * Colors
// * Customize colors
let amColors = computed(() => {
  return amCustomize.value[pageRenderKey.value] ? amCustomize.value[pageRenderKey.value].colors : defaultCustomizeSettings[pageRenderKey.value].colors
})

provide('amColors', amColors);
let cssVars = computed(() => {
  return {
    '--am-c-primary': amColors.value.colorPrimary,
    '--am-c-success': amColors.value.colorSuccess,
    '--am-c-error': amColors.value.colorError,
    '--am-c-warning': amColors.value.colorWarning,
    // input global colors - usage input, textarea, checkbox, radio button, select input, adv select input
    '--am-c-inp-bgr': amColors.value.colorInpBgr,
    '--am-c-inp-border': amColors.value.colorInpBorder,
    '--am-c-inp-text': amColors.value.colorInpText,
    '--am-c-inp-placeholder': amColors.value.colorInpPlaceHolder,
    // dropdown global colors - usage select dropdown, adv select dropdown
    '--am-c-drop-bgr': amColors.value.colorDropBgr,
    '--am-c-drop-text': amColors.value.colorDropText,
    // sidebar container colors - left part of the form
    '--am-c-sb-bgr': amColors.value.colorSbBgr,
    '--am-c-sb-text': amColors.value.colorSbText,
    // main container colors - right part of the form
    '--am-c-main-bgr': amColors.value.colorMainBgr,
    '--am-c-main-heading-text': amColors.value.colorMainHeadingText,
    '--am-c-main-text': amColors.value.colorMainText,
    // button global colors
    '--am-c-btn-prim': amColors.value.colorBtnPrim,
    '--am-c-btn-prim-text': amColors.value.colorBtnPrimText,
    '--am-c-btn-sec': amColors.value.colorBtnSec,
    '--am-c-btn-sec-text': amColors.value.colorBtnSecText,
    '--am-font-family': amCustomize.value.fonts.fontFamily,
    // css properties
    // -mw- max width
    // -brad- border-radius
    '--am-mw-main': amCustomize.value.sbsNew.sidebar.options.self.visibility ? sidebarCollapsed.value ? '592px' : '760px' : '520px',
    '--am-brad-main': amCustomize.value.sbsNew.sidebar.options.self.visibility ? '0 0.5rem 0.5rem 0' : '0.5rem'
  }
})
</script>

<script>
export default {
  name: "CustomizeStepNew"
}
</script>

<style lang="scss">
//@import './src/assets/scss/common/reset/reset';
@import '../../../../assets/scss/common/reset/reset';

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
  --am-c-main-bgr: #{$blue-900};
  --am-c-main-heading-text: #{$shade-800};
  --am-c-main-text: #{$shade-900};
  // sidebar container colors - left part of the form
  --am-c-sb-bgr: #17295A;
  --am-c-sb-text: #{$am-white};
  // input global colors - usage input, textarea, checkbox, radio button, select input, adv select input
  --am-c-inp-bgr: #{$blue-900};
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

//@import url('https://fonts.googleapis.com/css2?family=Rampart+One&display=swap');
// am -- amelia
// fs -- form steps
// sb -- sidebar
#amelia-app-backend-new {
  * {
    font-family: var(--am-font-family);
    font-style: initial;
    box-sizing: border-box;
  }

  #amelia-container {
    &.am-fs {
      // Container Wrapper
      &__wrapper {
        display: flex;
        justify-content: center;
        max-width: var(--am-mw-main);
        height: 560px;
        width: 100%;
        box-shadow: 0 30px 40px rgba(0, 0, 0, 0.12);
        margin: 16px auto 48px;
        border-radius: 8px;
        transition: max-width 0.3s ease-in-out;

        &.am-collapsed {
          transition-delay: 1s;
        }

        .el-form {
          &-item {
            display: block;
            font-family: var(--am-font-family);
            font-size: var(--am-fs-label);
            margin-bottom: 24px;

            &__label {
              flex: 0 0 auto;
              text-align: left;
              font-size: var(--am-fs-label);
              line-height: 1.3;
              color: var(--am-c-main-text);
              box-sizing: border-box;
              margin: 0;

              &:before {
                color: var(--am-c-error);
              }
            }

            &__content {
              display: flex;
              flex-wrap: wrap;
              align-items: center;
              flex: 1;
              position: relative;
              font-size: var(--am-fs-input);
              min-width: 0;
            }

            &__error {
              font-size: 12px;
              color: var(--am-c-error);
              padding-top: 4px;
            }
          }
        }

        .el-input {
          &__inner {
            margin: 0;
          }
        }
      }
    }
  }

  .am-dialog-cs {
    z-index: 10000 !important;
  }
}
</style>
