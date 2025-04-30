<template>
  <AmSlidePopup
    :visibility="props.visibility"
    position="center"
    custom-class="am-slide-popup-aec"
    :custom-css="{ ...customCss, ...cssVars }"
    @update:visibility="closeDialog"
  >
    <!-- Header -->
    <template #header>
      <div class="am-cap-aec__header">
        <template v-if="customerId">{{ amLabels.edit_customer }}</template>
        <template v-else>{{ amLabels.add_customer }}</template>
      </div>
    </template>
    <!-- /Header -->

    <AmAlert
      v-if="alertVisibility"
      ref="alertContainer"
      :type= "alertType"
      :show-border="true"
      :close-after="5000"
      custom-class="am-cap__alert"
      @close="closeAlert"
      @trigger-close="closeAlert"
    >
      <template #title>
        <span class="am-icon-checkmark-circle-full"></span> {{ alertMessage }}
      </template>
    </AmAlert>

    <!-- Content -->
    <el-form
      v-if="!loading"
      ref="customerFormRef"
      :model="customerFormData"
      :rules="customerFormRules"
      label-position="top"
      class="am-cap-aec__form"
    >
      <template v-for="(field, key) in customerFormConstruction" :key="key">
        <component
          :is="field.template"
          v-bind="field.props"
          v-model="customerFormData[key]"
          v-model:countryPhoneIso="field.countryPhoneIso"
        />
      </template>
    </el-form>
    <Skeleton v-else></Skeleton>
    <!-- /Content -->

    <!-- Footer -->
    <template #footer>
      <AmButton
        type="plain"
        category="secondary"
        @click="closeDialog"
      >
        {{ amLabels.cancel }}
      </AmButton>
      <AmButton @click="saveCustomer">
        {{ amLabels.save }}
      </AmButton>
    </template>
    <!-- /Footer -->
  </AmSlidePopup>
</template>

<script setup>
// * Import from Vuex
import { useStore } from 'vuex'

// * Import from Libraries
import moment from 'moment'

// * Import from Vue
import { ref, inject, computed, markRaw } from 'vue'

// * Import from Libraries
import httpClient from "../../../../../../../plugins/axios";

// * Form Fields Templates
import { formFieldsTemplates } from '../../../../../../../assets/js/common/formFieldsTemplates'

// * _components
import AmSlidePopup from '../../../../../../_components/slide-popup/AmSlidePopup.vue'
import AmButton from '../../../../../../_components/button/AmButton.vue'
import IconComponent from '../../../../../../_components/icons/IconComponent.vue'
import Skeleton from '../../../Authentication/parts/Skeleton.vue'

// * Composables
import { useBackendCustomer } from "../../../../../../../assets/js/common/customer";
import { useAuthorizationHeaderObject } from "../../../../../../../assets/js/public/panel";
import AmAlert from "../../../../../../_components/alert/AmAlert.vue";

// * Props
const props = defineProps({
  visibility: {
    type: Boolean,
    required: true,
  },
  customCss: {
    type: Object,
    default: () => {},
  },
  responsiveClass: {
    type: String,
    default: '',
  },
})

// * Emits
const emits = defineEmits(['update:visibility', 'addedCustomer'])

// * Settings
const amSettings = inject('settings')

// * Labels
let amLabels = inject('amLabels')

// * Store
const store = useStore()

// * Alert block
let alertContainer = ref(null)
let alertVisibility = ref(false)
let alertType = ref('success')

let alertMessage = ref('')

function closeAlert () {
  alertVisibility.value = false
  store.commit('cabinet/setPaymentLinkError', {value: false, type: 'event'})
}

let customerId = computed(() => store.getters['customerInfo/getCustomerId'])

// * Languages options
let languagesOptions = computed(() => {
  let languages = []

  if (amSettings.wordpress.locale in store.getters['entities/getSettings'].languages) {
    languages.push({
      value: store.getters['entities/getSettings'].languages[amSettings.wordpress.locale].wp_locale,
      label: store.getters['entities/getSettings'].languages[amSettings.wordpress.locale].name,
    })
  }

  amSettings.general.usedLanguages.forEach((languageCode) => {
    if (languageCode in store.getters['entities/getSettings'].languages) {
      languages.push({
        value: store.getters['entities/getSettings'].languages[languageCode].wp_locale,
        label: store.getters['entities/getSettings'].languages[languageCode].name,
      })
    }
  })

  return languages
})

/**
 * * Customer information form
 */

// * Form reference
let customerFormRef = ref(null)

let phoneError = ref(false)

// * Form data
let customerFormData = ref({
  firstName: computed({
    get: () => store.getters['customerInfo/getCustomerFirstName'],
    set: (val) => {
      store.commit('customerInfo/setCustomerFirstName', val ? val : '')
    },
  }),
  lastName: computed({
    get: () => store.getters['customerInfo/getCustomerLastName'],
    set: (val) => {
      store.commit('customerInfo/setCustomerLastName', val ? val : '')
    },
  }),
  email: computed({
    get: () => store.getters['customerInfo/getCustomerEmail'],
    set: (val) => {
      store.commit('customerInfo/setCustomerEmail', val ? val : '')
    },
  }),
  phone: computed({
    get: () => store.getters['customerInfo/getCustomerPhone'],
    set: (val) => {
      store.commit('customerInfo/setCustomerPhone', val ? val : '')
    },
  }),
  language: computed({
    get: () => store.getters['customerInfo/getCustomerLanguage'],
    set: (val) => {
      store.commit('customerInfo/setCustomerLanguage', val ? val : '')
    },
  }),
  gender: computed({
    get: () => store.getters['customerInfo/getCustomerGender'],
    set: (val) => {
      store.commit('customerInfo/setCustomerGender', val ? val : '')
    },
  }),
  birthday: computed({
    get: () => store.getters['customerInfo/getCustomerBirthday'] || '',
    set: (val) => {
      store.commit(
        'customerInfo/setCustomerBirthday',
        val ? moment(val).format('YYYY-MM-DD') : ''
      )
    },
  }),
  note: computed({
    get: () => store.getters['customerInfo/getCustomerNote'],
    set: (val) => {
      store.commit('customerInfo/setCustomerNote', val ? val : '')
    },
  }),
})

// * Form validation rules
let customerFormRules = ref({
  firstName: [
    {
      required: true,
      message: amLabels.value.enter_first_name_warning,
      trigger: ['submit', 'blur'],
    },
  ],
  lastName: [
    {
      required: true,
      message: amLabels.value.enter_last_name_warning,
      trigger: ['submit', 'blur'],
    },
  ],
})

// * Form construction
let customerFormConstruction = ref({
  firstName: {
    template: formFieldsTemplates.text,
    props: {
      itemName: 'firstName',
      label: amLabels.value.first_name_colon,
      placeholder: amLabels.value.enter_first_name,
      class: computed(() => `am-cap-aec__form-item ${props.responsiveClass}`),
      iconStart: markRaw({
        components: { IconComponent },
        template: `<IconComponent icon="user"/>`,
      }),
    },
  },
  lastName: {
    template: formFieldsTemplates.text,
    props: {
      itemName: 'lastName',
      label: amLabels.value.last_name_colon,
      placeholder: amLabels.value.enter_last_name,
      class: computed(() => `am-cap-aec__form-item ${props.responsiveClass}`),
      iconStart: markRaw({
        components: { IconComponent },
        template: `<IconComponent icon="user"/>`,
      }),
    },
  },
  email: {
    template: formFieldsTemplates.text,
    props: {
      itemName: 'email',
      label: amLabels.value.email_colon,
      placeholder: amLabels.value.enter_email,
      class: computed(() => `am-cap-aec__form-item ${props.responsiveClass}`),
      iconStart: markRaw({
        components: { IconComponent },
        template: `<IconComponent icon="email"/>`,
      }),
    },
  },
  phone: {
    countryPhoneIso: computed({
      get: () => store.getters['customerInfo/getCustomerCountryPhoneIso'] || '',
      set: (val) => {
        store.commit(
          'customerInfo/setCustomerCountryPhoneIso',
          val ? val.toLowerCase() : ''
        )
      },
    }),
    template: formFieldsTemplates.phone,
    props: {
      itemName: 'phone',
      label: amLabels.value.phone_colon,
      placeholder: amLabels.value.enter_phone,
      defaultCode: computed(
        () => store.getters['customerInfo/getCustomerCountryPhoneIso'] || ''
      ),
      phoneError: computed(() => phoneError.value),
      whatsAppLabel: amLabels.value.whatsapp_opt_in_text,
      isWhatsApp:
        amSettings.notifications.whatsAppEnabled &&
        amSettings.notifications.whatsAppAccessToken &&
        amSettings.notifications.whatsAppBusinessID &&
        amSettings.notifications.whatsAppPhoneID,
      class: computed(() => `am-cap-aec__form-item ${props.responsiveClass}`),
    },
  },
  language: {
    template: formFieldsTemplates.select,
    props: {
      itemName: 'language',
      label: amLabels.value.notification_language,
      placeholder: amLabels.value.language,
      class: computed(() => `am-cap-aec__form-item ${props.responsiveClass}`),
      prefixIcon: markRaw({
        components: {IconComponent},
        template: `
          <IconComponent icon="pennant"/>`,
      }),
      options: languagesOptions.value,
    },
  },
  gender: {
    template: formFieldsTemplates.select,
    props: {
      itemName: 'gender',
      label: amLabels.value.gender,
      class: computed(() => `am-cap-aec__form-item ${props.responsiveClass}`),
      prefixIcon: markRaw({
        components: {IconComponent},
        template: `
          <IconComponent icon="gender"/>`,
      }),
      options: [
        {
          label: amLabels.value.female,
          value: 'female',
        },
        {
          label: amLabels.value.male,
          value: 'male',
        },
      ],
    },
  },
  birthday: {
    template: formFieldsTemplates.datepicker,
    props: {
      itemName: 'birthday',
      label: amLabels.value.date_of_birth,
      placeholder: amLabels.value.enter_date_of_birth,
      clearable: true,
      readOnly: false,
      class: computed(() => `am-cap-aec__form-item ${props.responsiveClass}`),
    },
  },
  note: {
    template: formFieldsTemplates['text-area'],
    props: {
      itemName: 'note',
      label: amLabels.value.note_internal,
      itemType: 'textarea',
      class: computed(() => `am-cap-aec__form-item ${props.responsiveClass}`),
    },
  },
})

function closeDialog() {
  store.dispatch('customerInfo/resetCustomer')
  emits('update:visibility', false)
}

let loading = computed(() => store.getters['customerInfo/getLoading'])

function saveCustomer() {
  customerFormRef.value.validate((valid) => {
    if (!valid) {
      return
    }

    store.commit('customerInfo/setLoading', true)

    let customer = useBackendCustomer(store)

    httpClient.post(
      '/users/customers' + (customer.id ? '/' + customer.id : ''),
      customer,
      Object.assign(useAuthorizationHeaderObject(store), {params: {source: 'cabinet-provider'}})
    ).then((response) => {
      store.commit(
        'auth/setPreloadedCustomers',
        store.getters['auth/getPreloadedCustomers'].concat(
          [response.data.data.user]
        ).sort((a, b) => a.id - b.id)
      )

      emits('addedCustomer', response.data.data.user)

      closeDialog()
    }).catch((error) => {
      if ('response' in error && error.response) {
        alertMessage.value = error.response.data.message
        alertVisibility.value = true
      }
    }).finally(() => {
      store.commit('customerInfo/setLoading', false)
    })
  })
}

// * Colors
let amColors = inject('amColors')
// * CSS Variables
let cssVars = computed(() => {
  return {
    '--am-c-aec-text': amColors.value.colorMainText,
  }
})
</script>

<style lang="scss">
@mixin am-cabinet-add-new-customer-dialog {
  // am  - amelia
  // cap - cabinet panel
  // aec - add edit customer
  &.am-slide-popup-aec {
    width: 85%;
    padding: 0;
    display: flex;
    flex-direction: column;

    .el-skeleton {
      padding: 24px;
    }

    .am-slide-popup__block {
      // Header
      &-header {
        padding: 20px 24px 24px;
      }

      &-footer {
        padding: 24px;
        display: flex;
        justify-content: flex-end;
        gap: 16px;
      }
    }

    .am-cap-aec {
      // Header
      &__header {
        font-size: 18px;
        font-style: normal;
        font-weight: 500;
        line-height: 1.555556;
        color: var(--am-c-aec-text);
      }

      // Form - Content
      &__form {
        display: flex;
        flex-direction: column;
        flex-grow: 1;
        min-height: 0;
        overflow: auto;
        padding: 0 24px;
        gap: 24px;

        // Form Item
        &-item {
          display: flex;
          flex-direction: column;
          gap: 4px;
          margin-bottom: 0;
        }

        // Select
        .am-select {
          .el-input--prefix {
            .el-input {
              &__inner {
                padding: 8px 24px 8px 41px !important;
              }

              &__prefix {
                font-size: 24px;
                color: var(--am-c-select-text);
              }
            }
          }
        }


        .el-form-item {
          // Form Error
          &__error {
            padding-top: 2px;
          }
        }

        // Scroll styles
        &::-webkit-scrollbar {
          width: 6px;
        }

        &::-webkit-scrollbar-thumb {
          border-radius: 6px;
          background: var(--am-c-scroll-op30);
        }

        &::-webkit-scrollbar-track {
          border-radius: 6px;
          background: var(--am-c-scroll-op10);
        }
      }
    }
  }
}

.amelia-v2-booking #amelia-container .am-slide-popup__block-inner.am-position-center {
  @include am-cabinet-add-new-customer-dialog;
}
</style>