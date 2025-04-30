<template>
  <div class="am-fs__main-content am-fs__info">
    <el-form
      ref="infoFormRef"
      :model="infoFormData"
      :rules="rules"
      label-position="top"
      class="am-fs__info-form"
      :class="{'am-fs__info-form-mobile': checkScreen}"
    >
      <template v-for="item in amCustomize[pageRenderKey].infoStep.order" :key="item.id">
        <component :is="formFields[item.id]"></component>
      </template>
    </el-form>
  </div>
</template>

<script setup>
import FirstNameFormField from '../fields/FirstNameFormField.vue'
import LastNameFormField from '../fields/LastNameFormField.vue'
import EmailFormField from '../fields/EmailFormField.vue'
import PhoneFormField from '../fields/PhoneFormField.vue'

import {ref, inject, provide, computed, markRaw} from 'vue'

let langKey = inject('langKey')
let amLabels = inject('labels')

let pageRenderKey = inject('pageRenderKey')
let amCustomize = inject('customize')

// * Label computed function
function labelsDisplay (label) {
  let computedLabel = computed(() => {
    return amCustomize.value[pageRenderKey.value].infoStep.translations
    && amCustomize.value[pageRenderKey.value].infoStep.translations[label]
    && amCustomize.value[pageRenderKey.value].infoStep.translations[label][langKey.value]
      ? amCustomize.value[pageRenderKey.value].infoStep.translations[label][langKey.value]
      : amLabels[label]
  })

  return computedLabel.value
}

// Container Width
let cWidth = inject('containerWidth', 0)
let checkScreen = computed(() => cWidth.value < 560 || (cWidth.value - 240 < 520))


/**
 * Form Block start
 */
// * Form reference
let infoFormRef = ref(null)

let infoFormData = ref({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
})
provide('infoFormData', infoFormData)

// * Form validation rules
let rules = computed(() => {
  return {
    firstName: [
      {
        required: true,
        message: labelsDisplay('enter_first_name_warning'),
        trigger: ['blur', 'submit'],
      }
    ],
    lastName: [
      {
        required: amCustomize.value[pageRenderKey.value].infoStep.options.lastName.required,
        message: labelsDisplay('enter_last_name_warning'),
        trigger: ['blur', 'submit'],
      }
    ],
    email: [
      {
        required: amCustomize.value[pageRenderKey.value].infoStep.options.email.required,
        message: labelsDisplay('enter_valid_email_warning'),
        trigger: ['blur', 'submit'],
      }
    ],
    phone: [
      {
        required: amCustomize.value[pageRenderKey.value].infoStep.options.phone.required,
        message: labelsDisplay('enter_phone_warning'),
        trigger: ['blur', 'submit'],
      }
    ],
  }
})

// * Form Fields Object
let formFields = ref({
  firstName: markRaw(FirstNameFormField),
  lastName: markRaw(LastNameFormField),
  email: markRaw(EmailFormField),
  phone: markRaw(PhoneFormField)
})
</script>

<script>
export default {
  name: 'InfoStep',
  key: 'infoStep',
  sidebarData: {
    label: 'info_step',
    icon: 'user',
    stepSelectedData: [],
    finished: false,
    selected: false,
  }
}
</script>

<style lang="scss">
#amelia-app-backend-new #amelia-container {
  .am-fs {
    &__main {
      &-content.am-fs__info {
        padding-top: 40px;
      }

      &-inner {
        overflow: hidden;
      }
    }

    &__info {
      &-form {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;

        .el-form-item {
          width: calc(50% - 12px);
          $count: 4;
          @for $i from 0 through $count {
            &:nth-child(#{$i + 1}) {
              animation: 600ms cubic-bezier(.45,1,.4,1.2) #{$i*100}ms am-animation-slide-up;
              animation-fill-mode: both;
            }
          }
        }

        &-mobile {
          gap: 12px 6px;
          .el-form-item {
            width: 100%;
          }
        }

        &__label {
          display: inline-block;
          color: var(--am-c-main-text);
          font-family: var(--am-font-family);
          font-weight: 500;
          margin-bottom: 4px;
        }

        .el-form-item__label {
          line-height: unset;
          padding: 0;
        }
      }
    }
  }
}
</style>
