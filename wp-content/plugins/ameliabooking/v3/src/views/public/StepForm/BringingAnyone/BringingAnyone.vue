<template>
  <div
    class="am-fs__bringing"
    :class="[
      (!props.inPopup && checkScreen) ? 'am-fs__bringing-full-mobile': !props.inPopup ? 'am-fs__bringing-full':'',
      {'am-fs__bringing-full-mobile-s':mobileS}
    ]"
    :style="cssVars"
  >
    <div class="am-fs__bringing-main">
      <div v-if="props.inPopup && headingVisibility" class="am-fs__bringing-heading">
        {{amLabels.bringing_anyone_title}}
      </div>
      <div class="am-fs__bringing-content">
          <span class="am-fs__bringing-content-left">
            <span class="am-icon-users"></span>
            <span class="am-fs__bringing-content-text">{{amSettings.appointments.bringingAnyoneLogic === 'additional' ? amLabels.bringing_people : amLabels.bringing_people_total}}</span>
          </span>
        <AmInputNumber v-model="persons" :min="options.min" :max="options.max" size="small"></AmInputNumber>
      </div>
      <div v-if="infoVisibility" class="am-fs__bringing-message">
        {{amSettings.appointments.bringingAnyoneLogic === 'additional' ? amLabels.add_people : amLabels.add_people_total}}
      </div>
    </div>

    <!-- Packages Popup -->
    <PackagesPopup @continue-with-service="packagesVisibility = false"></PackagesPopup>
    <!--/ Packages Popup -->

  </div>
</template>

<script setup>
import {
  ref,
  reactive,
  computed,
  inject,
  watchEffect,
  provide,
  onMounted
} from "vue";
import { useStore } from "vuex";

import AmInputNumber from "../../../_components/input-number/AmInputNumber.vue";
import PackagesPopup from "../PakagesStep/parts/PackagesPopup";

import { useColorTransparency } from "../../../../assets/js/common/colorManipulation";
import { useCapacity } from "../../../../assets/js/common/appointments";

let props = defineProps({
  globalClass: {
    type: String,
    default: ''
  },
  inPopup: {
    type: Boolean,
    default: false
  }
})

// Container Width
let cWidth = inject('containerWidth', 0)
let checkScreen = computed(() => cWidth.value < 560 || (cWidth.value > 560 && cWidth.value < 640))
let mobileS = computed(() => cWidth.value < 340)

// * Store
const store = useStore();

// * Short code
const shortcodeData = inject('shortcodeData')

// * Settings
const amSettings = inject('settings')

// * local language short code
const localLanguage = inject('localLanguage')

// * if local lang is in settings lang
let langDetection = computed(() => amSettings.general.usedLanguages.includes(localLanguage.value))

// * Labels
const globalLabels = inject('labels')

// * Customize
const amCustomize = inject('amCustomize')

// * Package
let packagesOptions = computed(() => store.getters['entities/filteredPackages'](
    store.getters['booking/getSelection']
))

let packagesVisibility = ref(false)
provide('packagesVisibility', packagesVisibility)


// * Computed labels
let amLabels = computed(() => {
  let computedLabels = reactive({...globalLabels})

  if (amSettings.customizedData && amSettings.customizedData.sbsNew && amSettings.customizedData.sbsNew.bringingAnyone.translations) {
    let customizedLabels = amSettings.customizedData.sbsNew.bringingAnyone.translations
    Object.keys(customizedLabels).forEach(labelKey => {
      if (customizedLabels[labelKey][localLanguage.value] && langDetection.value) {
        computedLabels[labelKey] = customizedLabels[labelKey][localLanguage.value]
      } else if (customizedLabels[labelKey].default) {
        computedLabels[labelKey] = customizedLabels[labelKey].default
      }
    })
  }
  return computedLabels
})

let headingVisibility = amCustomize ? amCustomize.bringingAnyone.options.heading.visibility : true
let infoVisibility = amCustomize ? amCustomize.bringingAnyone.options.info.visibility : true

// * Step functionality
let { nextStep, footerButtonReset, footerButtonClicked } = inject('changingStepsFunctions', {
  nextStep: () => {},
  footerButtonReset: () => {},
  footerButtonClicked: {
    value: false
  }
})

let options = computed(() => {
  if (props.inPopup) {
    let { bringingAnyoneOptions } = inject('bringingOptions')
    return bringingAnyoneOptions.value
  }

  return useCapacity(
    store.getters['entities/getEmployeeServices'](
      store.getters['booking/getServiceProviderSelection']
    )
  )
})

let persons = computed({
  get: () => {
    return store.getters['booking/getBookingPersons'] - (amSettings.appointments.bringingAnyoneLogic === 'additional' ? 1 : 0)
  },
  set: (val) => {
    store.commit('booking/setBookingPersons', val)
  }
})


if (!props.inPopup) {
  onMounted(() => {
    if (!props.inPopup && packagesOptions.value.length && shortcodeData.value.show !== 'services') {
      packagesVisibility.value = true
    }
  })

  // * Watching when footer button was clicked
  watchEffect(() => {
    if(footerButtonClicked.value) {
      footerButtonReset()
      nextStep()
    }
  })
}

// * Global colors
let amColors = inject('amColors');
let cssVars = computed(() => {
  return {
    '--am-bringing-color-border': useColorTransparency(amColors.value.colorMainText, 0.25),
    '--am-bringing-color-text-opacity60': useColorTransparency(amColors.value.colorMainText, 0.6),
  }
})

</script>

<script>
export default {
  name: 'BringingAnyone',
  key: 'bringingAnyone',
  sidebarData: {
    label: 'bringing_anyone',
    icon: 'users-plus',
    stepSelectedData: [],
    finished: false,
    selected: false,
  }
}
</script>

<style lang="scss">
@mixin bringing-anyone-block {
  .am-fs {

    &__bringing {

      &-full {
        padding: 16px 32px;

        &-mobile {
          padding: 16px;
        }
      }

      &-main {
        margin: 0 0 32px 0;
      }

      &-heading {
        display: block;
        width: 100%;
        font-size: 16px;
        font-weight: 500;
        line-height: 1.5;
        color: var(--am-c-main-text);
        margin: 0 0 4px 0;
      }

      &-content {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 12px 16px;
        margin: 0 0 4px 0;
        border: 1px solid var(--am-bringing-color-border);
        border-radius: 8px;

        &-left {
          display: flex;
          align-items: center;

          .am-icon-users {
            font-size: 24px;
            line-height: 1;
            color: var(--am-c-main-text);
          }
        }

        &-text {
          font-size: 14px;
          font-weight: 400;
          line-height: 1.43;
          color: var(--am-c-main-text);
          margin: 0 0 0 8px;
        }

        .am-input-number {
          max-width: 100px;
        }
      }

      &-message {
        font-size: 14px;
        font-weight: 400;
        line-height: 1.43;
        color: var(--am-bringing-color-text-opacity60);
      }

      &-full-mobile-s {
        .am-fs__bringing-content {
          display: flex;
          flex-direction: column;
          //gap: 16px;
          & > * + * {
            margin: 0 1em;
          }
        }
      }
    }

    &__ps {
      &-popup {
        position: relative;

        &__heading {
          font-size: 14px;
          font-weight: 400;
          line-height: 1.42857;
          text-align: center;
          color: var(--am-c-main-text);
          margin: 20px 0 16px;
        }

        &__or {
          display: flex;
          flex-direction: row;
          font-weight: 400;
          font-size: 14px;
          line-height: 20px;
          margin: 20px 0;
          color: var(--am-c-ps-text-op60);

          &:before, &:after{
            content: "";
            flex: 1 1;
            border-bottom: 1px solid var(--am-c-ps-text-op20);
            margin: auto;
          }

          &:before {
            margin-right: 10px
          }

          &:after {
            margin-left: 10px
          }
        }

        &__btn {
          &.am-button.am-button--medium {
            --am-h-btn: 56px;
            --am-fs-btn: 14px;
            width: 100%;
            justify-content: space-between;
          }

          &-mobile {
            &.am-button.am-button--medium {
              --am-fs-btn: 12px
            }
          }
        }
      }

      &-pill {
        display: inline-block;
        font-size: 14px;
        font-weight: 500;
        line-height: 1;
        color: var(--am-c-btn-prim);
        background-color: var(--am-c-btn-prim-text);
        border-radius: 12px;
        padding: 5px 8px;
      }
    }
  }
}

// Public
.amelia-v2-booking #amelia-container {
  @include bringing-anyone-block;
}

// Admin
#amelia-app-backend-new {
  @include bringing-anyone-block;
}
</style>
