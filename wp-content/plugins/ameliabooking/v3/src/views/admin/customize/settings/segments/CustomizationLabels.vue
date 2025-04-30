<template>
  <div class="am-cs-labels">
    <AmCollapse>
      <!-- Primary & state -->
      <AmCollapseItem
        v-for="(labelObj, index) in amTranslations[pageRenderKey][stepKey]"
        :key="index"
        :class="{'am-hidden': !blockVisibility(index)}"
        borderless
        :side="true"
      >
        <template #heading>
          <div class="am-cs-labels__heading">
            {{ labelObj.name }}
          </div>
        </template>
        <template #default>
          <div class="am-cs-labels__holder">
            <template
              v-for="label in Object.getOwnPropertyNames(labelObj.labels)"
              :key="label"
            >
              <div
                v-if="labelsVisibility(index, label)"
                class="am-cs-labels__item"
              >
                <div class="am-cs-labels__item-heading">
                  <span>{{amLabels[label]}}</span>
                  <span v-if="labelsDetailsString(index, label)">
                    {{ `(${labelsDetailsString(index, label)})` }}
                  </span>
                </div>
                <div class="am-cs-labels__item-content">
                  <div
                    v-for="lang in Object.getOwnPropertyNames(labelObj.labels[label])"
                    :key="lang"
                    class="am-cs-labels__item-content__inner"
                  >
                    <div class="am-cs-labels__item-lang">
                      <img
                        v-if="amLanguages[lang]"
                        :src="`${baseUrls.wpAmeliaPluginURL}v3/src/assets/img/flags/${amLanguages[lang].country_code}.png`"
                        :alt="languageFullName(lang)"
                      >
                      <span>
                      {{languageFullName(lang)}}
                    </span>
                    </div>
                    <div class="am-cs-labels__item-input">
                      <AmInput
                        v-model="labelObj.labels[label][lang]"
                        size="small"
                        @input="updateLabelObject"
                      ></AmInput>
                    </div>
                  </div>
                </div>
              </div>
            </template>
          </div>
        </template>
      </AmCollapseItem>
    </AmCollapse>
  </div>
</template>

<script setup>
import AmCollapse from '../../../../_components/collapse/AmCollapse.vue'
import AmCollapseItem from '../../../../_components/collapse/AmCollapseItem.vue'
import AmInput from '../../../../_components/input/AmInput.vue'
import {
  labelsDetails,
  basicLabelsTreatment,
  starterLabelsTreatment,
  liteLabelsTreatment
} from '../../../../../assets/js/admin/labelsAndOptionsTreatment.js'

// * Import from Vue
import {
  computed,
  inject,
  ref
} from "vue";

let { goBackPath, parentPath } = inject('sidebarFunctionality', {
  goBackPath: ref('menu')
})

goBackPath.value = parentPath.value

// * Plugin Licence
let licence = inject('licence')

const baseUrls = inject('baseUrls')
let stepName = inject('stepName')
let subStepName = inject('subStepName')
let pageRenderKey = inject('pageRenderKey')
let amLanguages = inject('languages')
let amLabels = inject('labels')
let amTranslations = inject('translations')

let stepKey = ref('')
if (subStepName.value) {
  stepKey.value = subStepName.value
} else if (parentPath.value === 'sidebar') {
  stepKey.value = 'sidebar'
} else {
  stepKey.value = stepName.value
}

function languageFullName (lang) {
  return lang !== 'default' ? amLanguages[lang].name : amLabels.default_label
}

let updateLabelObject = inject('updateLabelObject')

// * License affection
let labelsTreatment = computed(() => {
  let obj = {}

  if (licence.isLite) {
    obj = liteLabelsTreatment
  } else if (licence.isStarter) {
    obj = starterLabelsTreatment
  } else if (licence.isBasic) {
    obj = basicLabelsTreatment
  }

  return obj
})

function labelsWrapperRecognition (blockKey) {
  return !!(blockKey
    && pageRenderKey.value in labelsTreatment.value
    && stepKey.value in labelsTreatment.value[pageRenderKey.value]
    && blockKey in labelsTreatment.value[pageRenderKey.value][stepKey.value])
}

function blockVisibility (blockKey) {
  return !(labelsWrapperRecognition(blockKey) && labelsTreatment.value[pageRenderKey.value][stepKey.value][blockKey].indexOf('remove') !== -1)
}

function labelsVisibility (blockKey, labelKey) {
  return !(labelsWrapperRecognition(blockKey) && labelsTreatment.value[pageRenderKey.value][stepKey.value][blockKey].indexOf(labelKey) !== -1)
}

// * Labels Details
function labelsDetailsString (blockKey, labelKey) {
  return blockKey
    && pageRenderKey.value in labelsDetails
    && stepKey.value in labelsDetails[pageRenderKey.value]
    && blockKey in labelsDetails[pageRenderKey.value][stepKey.value]
    && labelKey in labelsDetails[pageRenderKey.value][stepKey.value][blockKey]
    ? labelsDetails[pageRenderKey.value][stepKey.value][blockKey][labelKey]
    : ''
}
</script>

<script>
export default {
  name: "CustomizationLabels"
}
</script>

<style lang="scss">
// am - amelia
// cs - customize sidebar
@mixin am-cs-labels-block {
  .am-cs-labels {
    &__heading {
      display: flex;
      align-items: center;
      justify-content: flex-start;

      img {
        margin-right: 8px;
      }
    }

    &__holder {
      width: 100%;
    }

    &__item {
      max-width: 100%;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      justify-content: space-between;
      margin-bottom: 16px;

      &:last-child {
        margin-bottom: 0;
      }

      &-heading {
        width: 100%;
        font-size: 14px;
        font-weight: 500;
        line-height: 1.42857;
        color: $shade-900;
        margin-bottom: 4px;

        span:nth-of-type(2) {
          color: $shade-400;
        }

        span:nth-of-type(1) {
          margin-right: 4px;
        }
      }

      &-content {
        width: 100%;
        display: flex;
        flex-direction: column;
        border: 1px solid $shade-200;
        border-radius: 4px;
        padding: 12px;

        &__inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 8px;

          &:last-child {
            margin-bottom: 0;
          }
        }
      }

      &-lang {
        display: flex;
        align-items: center;
        justify-content: flex-start;

        img {
          margin-right: 8px;
        }

        span {
          font-size: 14px;
          font-weight: 400;
          line-height: 1.714285;
          color: $shade-900;
        }
      }

      &-input {
        max-width: 170px;
        width: 100%;
      }
    }

    .am-collapse {
      &-item {
        margin: 0;

        $count: 30;
        @for $i from 0 through $count {
          &:nth-child(#{$i + 1}) {
            animation: 400ms cubic-bezier(.45,1,.4,1.2) #{$i*100}ms am-animation-slide-up;
            animation-fill-mode: both;
          }
        }

        &__heading {
          font-size: 15px;
          font-weight: 400;
          font-style: normal;
          line-height: 1.6;
          color: $shade-900;
          padding: 12px 16px;
          border-radius: 0;
          transition: all 300ms ease-in-out;

          &:hover:not(&-active) {
            background-color: $blue-400;
          }

          &-active {
            color: $blue-900;

            .am-icon-arrow-down {
              position: relative;
              color: $blue-900;

              &:after {
                content: '';
                display: block;
                width: 24px;
                height: 24px;
                border-radius: 50%;
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background-color: fade-out($blue-900, 0.9);
              }
            }
          }
        }

        &__trigger {
          padding: 0;
        }

        &__content {
          background-color: $shade-100;
          box-shadow: 0 1px 4px fade-out($am-black, 0.97), inset 0 -1px 4px fade-out($am-black, 0.97);
        }
      }
    }
  }
}

// public
.amelia-v2-booking #amelia-container {
  @include am-cs-labels-block;
}

// admin
#amelia-app-backend-new {
  @include am-cs-labels-block;

  .am-hidden {
    display: none !important;
  }
}
</style>
