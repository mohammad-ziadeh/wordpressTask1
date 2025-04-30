<template>
  <div
    ref="infoFormWrapperRef"
    class="am-elfci"
    :class="props.globalClass"
  >
    <el-form
      ref="infoFormRef"
      :model="infoFormData"
      :rules="infoFormRules"
      label-position="top"
      class="am-elfci__form"
      :class="responsiveClass"
    >
      <template v-for="item in customizeOrder" :key="item.id">
        <component
          :is="infoFormConstruction[item.id].template"
          v-if="infoFormConstruction[item.id].visibility"
          ref="customerCollectorRef"
          v-model="infoFormData[item.id]"
          v-model:countryPhoneIso="infoFormConstruction[item.id].countryPhoneIso"
          v-bind="infoFormConstruction[item.id].props"
        ></component>
      </template>
    </el-form>
  </div>
</template>

<script setup>
// * Import from Vue
import {
  ref,
  computed,
  inject,
} from 'vue'

// * Form Fields Templates
import { formFieldsTemplates } from "../../../../../../../assets/js/common/formFieldsTemplates";

// * Composables
import { useResponsiveClass } from "../../../../../../../assets/js/common/responsive";

// * Components
let props = defineProps({
  globalClass: {
    type: String,
    default: ''
  },
  inDialog: {
    type: Boolean,
    default: false
  }
})

// * Settings
// * Root Settings
const amSettings = inject('settings')

// * Form string recognition
let pageRenderKey = inject('pageRenderKey')

// * Customize
let amCustomize = inject('customize')

// * Order
let customizeOrder = computed(() => {
  return amCustomize.value[pageRenderKey.value].customerInfo.order
})

// * Options
let customizeOptions = computed(() => {
  return amCustomize.value[pageRenderKey.value].customerInfo.options
})

// * Labels
let langKey = inject('langKey')
let amLabels = inject('labels')

function labelsDisplay (label) {
  let computedLabel = computed(() => {
    let translations = amCustomize.value[pageRenderKey.value].customerInfo.translations
    return translations && translations[label] && translations[label][langKey.value] ? translations[label][langKey.value] : amLabels[label]
  })

  return computedLabel.value
}

// * Form data
let infoFormData = ref({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
})

// * Form construction
let infoFormConstruction = ref({
  firstName: {
    template: formFieldsTemplates.text,
    visibility: true,
    props: {
      itemName: 'firstName',
      label: computed(() => labelsDisplay('first_name_colon')),
      placeholder: computed(() => labelsDisplay('enter_first_name')),
      class: 'am-elfci__item'
    }
  },
  lastName: {
    template: formFieldsTemplates.text,
    visibility: computed(() => customizeOptions.value.lastName.visibility),
    props: {
      itemName: 'lastName',
      label: computed(() => labelsDisplay('last_name_colon')),
      placeholder: computed(() => labelsDisplay('enter_last_name')),
      class: 'am-elfci__item'
    }
  },
  email: {
    template: formFieldsTemplates.text,
    visibility: computed(() => customizeOptions.value.email.visibility),
    props: {
      itemName: 'email',
      label: computed(() => labelsDisplay('email_colon')),
      placeholder: computed(() => labelsDisplay('enter_email')),
      class: 'am-elfci__item'
    }
  },
  phone: {
    countryPhoneIso: '',
    template: formFieldsTemplates.phone,
    visibility: computed(() => customizeOptions.value.phone.visibility),
    props: {
      itemName: 'phone',
      label: computed(() => labelsDisplay('phone_colon')),
      placeholder: computed(() => labelsDisplay('enter_phone')),
      defaultCode: amSettings.general.phoneDefaultCountryCode === 'auto' ? '' : amSettings.general.phoneDefaultCountryCode.toLowerCase(),
      phoneError: false,
      whatsAppLabel: computed(() => labelsDisplay('whatsapp_opt_in_text')),
      isWhatsApp: amSettings.notifications.whatsAppEnabled
        && amSettings.notifications.whatsAppAccessToken
        && amSettings.notifications.whatsAppBusinessID
        && amSettings.notifications.whatsAppPhoneID,
      class: 'am-elfci__item'
    }
  },
})

// * Form validation rules
let infoFormRules = computed(() => {
  return {
    firstName: [
      {
        required: true,
        message:  labelsDisplay('enter_first_name_warning'),
        trigger: ['blur', 'submit'],
      }
    ],
    lastName: [
      {
        required: customizeOptions.value.lastName.required,
        message: labelsDisplay('enter_last_name_warning'),
        trigger: ['blur', 'submit'],
      }
    ],
    email: [
      {
        required: customizeOptions.value.email.required,
        type: 'email',
        message: labelsDisplay('enter_valid_email_warning'),
        trigger: ['blur', 'submit'],
      }
    ],
    phone: [
      {
        required: customizeOptions.value.phone.required,
        message: labelsDisplay('enter_phone_warning'),
        trigger: ['blur', 'submit'],
      }
    ],
  }
})

// * Responsive - Container Width
let cWidth = inject('containerWidth')

let componentWidth = computed(() => {
  return cWidth.value
})

let responsiveClass = computed(() => useResponsiveClass(componentWidth.value))
</script>

<script>
export default {
  name: "EventCustomerInfo",
  key: "customerInfo",
  label: "event_customer_info"
}
</script>

<style lang="scss">
#amelia-app-backend-new #amelia-container {
  // elfci - event list form customer info
  .am-elfci {
    &__main {
      &-content.am-elf__event-customer-info {
        padding-top: 20px;
      }

      &-inner {
        overflow: hidden;
      }
    }

    &__form {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;

      &.am-rw-500 {
        .am-elfci__item {
          width: 100%;
        }
      }

      & > * {
        $count: 100;
        @for $i from 0 through $count {
          &:nth-child(#{$i + 1}) {
            animation: 600ms cubic-bezier(.45,1,.4,1.2) #{$i*100}ms am-animation-slide-up;
            animation-fill-mode: both;
          }
        }
      }

      .am-elfci__item {
        width: calc(50% - 12px);

        .el-form-item {
          &__label {
            display: inline-block;
            color: var(--am-c-main-text);
            font-family: var(--am-font-family);
            font-weight: 500;
            line-height: unset;
            margin-bottom: 4px;
            padding: 0;

            &:before {
              color: var(--am-c-error);
            }
          }

          &__error {
            line-height: 1;
            color: var(--am-c-error);
          }
        }
      }

      &-mobile {
        gap: 12px 6px;
        .el-form-item {
          width: 100%;
        }
        &-s {
          gap: 0px;
        }
      }

      &__label {
        display: inline-block;
        color: var(--am-c-main-text);
        font-family: var(--am-font-family);
        font-weight: 500;
        margin-bottom: 4px;
      }
    }
  }
}
</style>