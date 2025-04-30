<template>
  <div class="am-cs-options">
    <template
      v-for="(option, index) in amCustomize[pageRenderKey][stepKey].options"
      :key="option.name"
    >
      <div
        v-if="optionsVisibility(index)"
        class="am-cs-options__item"
      >
        <div class="am-cs-options__item-header">
          {{ option.name }}
        </div>

        <!-- Required -->
        <div
          v-if="Object.keys(option).filter(item => item === 'required').length"
          class="am-cs-options__item-content"
        >
          <span class="am-cs-options__item-content__heading">
            {{amLabels.mandatory_field}}
          </span>
          <AmSwitch
            v-model="option.required"
            @change="requiredChange(option.name)"
          />
        </div>

        <!-- Visibility -->
        <div
          v-if="Object.keys(option).filter(item => item === 'visibility').length"
          class="am-cs-options__item-content"
        >
          <span class="am-cs-options__item-content__heading">
            {{ amLabels.display_field }}
          </span>
          <AmSwitch
            v-model="option.visibility"
            :disabled="option.required"
          />
        </div>

        <!-- Filterable -->
        <div
          v-if="Object.keys(option).filter(item => item === 'filterable').length"
          class="am-cs-options__item-content"
        >
          <span class="am-cs-options__item-content__heading">
            {{ amLabels.filterable_field }}
          </span>
          <AmSwitch
            v-model="option.filterable"
          />
        </div>

        <!-- Button Type -->
        <div
          v-if="Object.keys(option).filter(item => item === 'buttonType').length"
          class="am-cs-options__item-content"
        >
          <AmRadioGroup
            v-model="option.buttonType"
            class="am-cs-options__radio"
          >
            <AmRadio
              v-for="type in option.typeOptions"
              :key="type"
              :label="type"
              :value="type"
              class="am-cs-options__radio-item"
              :class="{'is-active': option.buttonType === type}"
              @click="option.buttonType = type"
            >
              <div class="am-cs-options__radio-item__inner">
                <AmButton :type="type" size="small">
                  {{ btnTypeStrings[type] }}
                </AmButton>
              </div>
            </AmRadio>
          </AmRadioGroup>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import AmSwitch from '../../../../_components/switch/AmSwitch.vue'
import AmRadioGroup from '../../../../_components/radio/AmRadioGroup.vue'
import AmRadio from '../../../../_components/radio/AmRadio.vue'
import AmButton from '../../../../_components/button/AmButton.vue'
import {
  basicOptionsTreatment,
  starterOptionsTreatment,
  liteOptionsTreatment
} from '../../../../../assets/js/admin/labelsAndOptionsTreatment.js'

// * Import from Vue
import {
  computed,
  inject,
  ref
} from 'vue'
import {settings} from "../../../../../plugins/settings";

// * Plugin Licence
let licence = inject('licence')

// * Labels
let amLabels = inject('labels')

let { goBackPath, parentPath } = inject('sidebarFunctionality', {
  goBackPath: ref('menu')
})

goBackPath.value = parentPath.value

let stepName = inject('stepName')
let subStepName = inject('subStepName')
let pageRenderKey = inject('pageRenderKey')
let amCustomize = inject('customize')

let stepKey = ref('')
if (subStepName.value) {
  stepKey.value = subStepName.value
} else if (parentPath.value === 'sidebar') {
  stepKey.value = 'sidebar'
} else {
  stepKey.value = stepName.value
}

let btnTypeStrings = ref({
  filled: amLabels.sb_radio_filled,
  plain: amLabels.sb_radio_plain,
  text: amLabels.sb_radio_text,
})

let obj = amCustomize.value[pageRenderKey.value][stepKey.value].options
let objKeys = Object.keys(obj)

function requiredChange (val) {
  objKeys.forEach((item) => {
    if(obj[item].name === val && obj[item].required && 'visibility' in obj[item]) {
      obj[item].visibility = true
    }
  })
}

// * License affection
let optionsTreatment = computed(() => {
  let obj = {}

  if (licence.isLite) {
    obj = liteOptionsTreatment
  } else if (licence.isStarter) {
    obj = starterOptionsTreatment
  } else if (licence.isBasic) {
    obj = basicOptionsTreatment
  }

  return obj
})

function optionsVisibility (blockKey) {
  return !(!!(blockKey
      && pageRenderKey.value in optionsTreatment.value
      && stepKey.value in optionsTreatment.value[pageRenderKey.value])
    && optionsTreatment.value[pageRenderKey.value][stepKey.value].indexOf(blockKey) !== -1)
  && (obj[blockKey].name !== 'Coupon Input Field' || settings.payments.coupons)
}
</script>

<script>
export default {
  name: "CustomizationOptions"
}
</script>

<style lang="scss">
#amelia-app-backend-new {
  .am-cs-options {
    &__item {
      padding: 16px;

      &-header {
        font-size: 14px;
        font-weight: 500;
        line-height: 1.42857;
        color: $shade-900;
        margin-bottom: 12px;
      }

      &-content {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 12px;

        &:last-child {
          margin-bottom: 0;
        }

        &__heading {
          font-size: 15px;
          font-weight: 400;
          line-height: 1.6;
          color: $shade-900;
        }
      }
    }

    &__radio {
      --am-c-csr-border: #{$shade-300};
      --am-c-csr-bgr: #{$am-white};
      width: 100%;

      &-item {
        position: relative;
        height: 90px;
        display: inline-flex;
        flex: 0 1 32%;
        align-items: center;
        justify-content: center;
        background-color: var(--am-c-csr-bgr);
        border: 1px solid var(--am-c-csr-border);
        border-radius: 9px;
        padding: 9px;
        cursor: pointer;

        &:last-child {
          margin-right: 0;
        }

        &:hover {
          --am-c-csr-bgr: #{$blue-300};
          --am-c-csr-border: #{$blue-900};
        }

        &.is-active {
          --am-c-csr-bgr: #{$blue-300};
          --am-c-csr-border: #{$blue-900};
        }
      }

      .am-radio-group {
        width: 100%;
        flex-direction: row;
        justify-content: space-between;

        .el-radio {
          position: static;

          &__label {
            padding: 0;
            margin: 0;

            .am-button {
              text-transform: capitalize;
            }
          }

          &__input {
            position: absolute;
            bottom: 4px;
            right: 4px;
            padding: 0;

            &.is-checked:not(.is-disabled) + .el-radio__label {
              margin: 0;
            }
          }
        }
      }
    }
  }
}
</style>
