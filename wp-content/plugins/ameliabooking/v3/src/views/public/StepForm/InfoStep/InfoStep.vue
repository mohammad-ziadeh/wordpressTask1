<template>
  <div
    ref="infoFormWrapperRef"
    class="am-fs__info"
    :class="props.globalClass"
  >
    <div v-show="!loading">
      <div v-if="paymentError && instantBooking" class="am-fs__info-error">
        <AmAlert
          type="error"
          :title="paymentError"
          :show-icon="true"
          :closable="false"
        >
        </AmAlert>
      </div>
    <el-form
      ref="infoFormRef"
      :model="infoFormData"
      :rules="rules"
      label-position="top"
      class="am-fs__info-form"
      :class="[
        {'am-fs__info-form-mobile': pageWidth < 330},
        {'am-fs__info-form-mobile-s': pageWidth < 300}
      ]"
    >
      <template v-for="item in amCustomize.infoStep.order" :key="item.id">
        <component
          :is="formFields[item.id].template"
          ref="primeCollectorRef"
          v-bind="formFields[item.id].props"
          v-on="'handlers' in formFields[item.id] ? formFields[item.id].handlers : {}"
        ></component>
      </template>

      <!-- Custom Fields TODO - validation for custom fields isn't set-->
      <template v-if="availableCustomFields && allCustomFields">
        <el-form-item
          v-for="(cf, index) in allCustomFields"
          v-show="cf.id in availableCustomFields"
          :id="'am-cf-' + cf.id"
          :ref="el => customFieldsRefs[index] = el"
          :key="index"
          class="am-fs__info-form__item"
          :class="[
            { 'is-required': cf.type === 'file' && cf.required },
            `am-cf-width-${cf.width}`,
            {'am-rtl': isRtl}
          ]"
          label-position="top"
          :prop="cf.required && cf.type !== 'content' ? 'cf' + cf.id : 'inputFile'"
        >
          <!-- ####### LABEL ####### -->
          <template v-if="cf.type !== 'content'" #label>
            <span
              v-if="
                (cf.type === 'checkbox' || cf.type === 'radio') && cf.label
              "
              :class="
                (cf.type === 'checkbox' || cf.type === 'radio') && cf.required
                  ? 'am-custom-required-as-html'
                  : ''
              "
              v-html="
                cf.label
                  ? '<label class=' +
                    '\'am-fs__info-form__label\'>' +
                    cf.label +
                    '</label>'
                  : ''
              "
            >
            </span>
            <span v-else class="am-fs__info-form__label">
              {{cf.label}}
            </span>
          </template>
          <!-- ####### /LABEL ####### -->

          <!-- ####### INPUT ####### -->
          <!-- types - [input, text-area] -->
          <component
            :is="customFieldsComponents[cf.type]"
            v-model="infoFormData['cf' + cf.id]"
            :type="cf.type === 'text-area' ? 'textarea' : (cf.type === 'text' ? 'text' : '')"
            :placeholder="refCFPlaceholders[cf.id] && refCFPlaceholders[cf.id].placeholder"
          ></component>
          <!-- /types - [input, text-area] -->

          <!-- Address Field -->
          <div v-if="cf.type === 'address'" :class="{'am-input-wrapper' : googleMapsLoaded}">
            <div v-if="googleMapsLoaded()">
              <div class="el-input el-input--default am-input am-input__default">
                  <vue-google-autocomplete
                    :id="'amelia-address-autocomplete-'+cf.id"
                    ref="addressCustomFields"
                    classname="el-input__inner"
                    types=""
                    placeholder=""
                    @change="setAddressCF($event, cf.id)"
                  >
                  </vue-google-autocomplete>
              </div>
            </div>
            <AmInput
              v-else
              v-model="infoFormData['cf' + cf.id]"
              placeholder=""
            >
            </AmInput>
          </div>
          <!-- /Address Field -->

          <!-- type - date-picker-full -->
          <AmDatePickerFull
            v-if="cf.type === 'datepicker'"
            :persistent="false"
            :existing-date="infoFormData['cf' + cf.id]"
            :disabled="false"
            @selected-date="(dateString) => {selectedDatePickerValue('cf' + cf.id, dateString)}"
          />
          <!-- /type - date-picker-full -->

          <!-- type - select -->
          <AmSelect
            v-if="cf.type === 'select'"
            v-model="infoFormData['cf' + cf.id]"
            :fit-input-width="true"
          >
            <AmOption
              v-for="(option, i) in cf.options"
              :key="i"
              :label="option.label"
              :value="option.label"
            />
          </AmSelect>
          <!-- /type - select -->

          <!-- type - radio -->
          <AmRadioGroup
            v-if="cf.type === 'radio'"
            v-model="infoFormData['cf' + cf.id]"
          >
            <AmRadio
              v-for="(option, i) in cf.options"
              :key="i"
              :label="option.label"
              :value="option.id"
            />
          </AmRadioGroup>
          <!-- /type - radio -->

          <!-- type - checkbox -->
          <AmCheckBoxGroup
            v-if="cf.type === 'checkbox'"
            v-model="infoFormData['cf' + cf.id]"
          >
            <AmCheckBox
              v-for="(option, i) in cf.options"
              :key="i"
              :label="option.label"
              :value="option.id"
            />
          </AmCheckBoxGroup>
          <!-- /type - checkbox -->

          <!-- type - attachment -->
          <AmAttachment
            v-if="cf.type === 'file'"
            :id="cf.id"
            v-model="infoFormData['cf' + cf.id]"
            :auto-upload="false"
            :accept="customFieldsAllowedExtensions"
            @change="onAddFile"
            @remove="onRemoveFile"
          >
            {{amLabels.upload_file_here}}
          </AmAttachment>
          <!-- /type - attachment -->

          <!-- type - content -->
          <div v-if="cf.type === 'content'" v-html="cf.label"></div>
          <!-- /type - content -->
          <!-- ####### INPUT ####### -->
        </el-form-item>
      </template>
      <div v-if="instantBooking && settings.payments.wc.enabled && !settings.payments.wc.onSiteIfFree && wcEntityEnabled" class="am-fs__payments-sentence">
        <p>
          {{amLabels.payment_wc_mollie_sentence}}
        </p>
      </div>
    </el-form>

    <PaymentOnSite
      v-if="instantBooking && (settings.payments.wc.enabled ? settings.payments.wc.onSiteIfFree || !wcEntityEnabled : true)"
      ref="refOnSiteBooking"
      :instant-booking="instantBooking"
      @payment-error="callPaymentError"
    />

    <PaymentWc
      v-if="instantBooking && settings.payments.wc.enabled && !settings.payments.wc.onSiteIfFree && wcEntityEnabled"
      ref="refWcBooking"
      :instant-booking="instantBooking"
      @payment-error="callPaymentError"
    />
    </div>

    <BookingSkeleton/>
  </div>
</template>

<script setup>
import FirstNameFormField from './parts/FirstNameFormField.vue'
import LastNameFormField from './parts/LastNameFormField.vue'
import EmailFormField from './parts/EmailFormField.vue'
import PhoneFormField from './parts/PhoneFormField.vue'

import AmAlert from "../../../_components/alert/AmAlert"
import AmInput from "../../../_components/input/AmInput.vue";
import AmAttachment from "../../../_components/attachment/AmAttachment.vue"
import AmCheckBoxGroup from "../../../_components/checkbox/AmCheckboxGroup.vue"
import AmCheckBox from "../../../_components/checkbox/AmCheckbox.vue";
import AmRadioGroup from "../../../_components/radio/AmRadioGroup.vue";
import AmRadio from "../../../_components/radio/AmRadio.vue";
import AmDatePickerFull from "../../../_components/date-picker-full/AmDatePickerFull.vue";
import AmSelect from "../../../_components/select/AmSelect.vue";
import AmOption from "../../../_components/select/AmOption.vue";

import PaymentOnSite from "../../Parts/Payment/PaymentOnSite.vue";
import PaymentWc from "../../Parts/Payment/PaymentWc.vue";
import BookingSkeleton from "../../Parts/BookingSkeleton.vue";
import moment from "moment";
import {
  ref,
  computed,
  inject,
  provide,
  reactive,
  markRaw,
  onMounted,
  watchEffect,
  watch,
  nextTick
} from "vue";
import { useStore } from "vuex";
import { settings } from "../../../../plugins/settings";
import { usePrepaidPrice, usePaymentError } from "../../../../assets/js/common/appointments";
import { useScrollTo } from "../../../../assets/js/common/scrollElements";
import { saveStats, useAppointmentBookingData } from "../../../../assets/js/public/booking";
import { useCustomFields } from "../../../../assets/js/public/customFields";
import VueGoogleAutocomplete from 'vue-google-autocomplete'
import useAction from "../../../../assets/js/public/actions";
import { useElementSize } from "@vueuse/core";
import { useCartHasItems } from "../../../../assets/js/public/cart";

let props = defineProps({
  globalClass: {
    type: String,
    default: ''
  }
})

// * Store
let store = useStore();

// * Labels
const amLabels = inject('amLabels')

// * Customize
let amCustomize = inject('amCustomize')

let infoFormWrapperRef = ref(null)
let {width: pageWidth} = useElementSize(infoFormWrapperRef)

let allFieldsRefs = ref([])
let primeCollectorRef = ref([])
let customFieldsRefs = ref([])

let customFieldsComponents = reactive({
  text: markRaw(AmInput),
  'text-area': markRaw(AmInput)
})

useCustomFields(store)

// * Get custom fields
let availableCustomFields = computed(() => store.getters['booking/getAvailableCustomFields'])
let allCustomFields = computed(() => store.getters['entities/getCustomFields'])

// * Step Functions
const {
  nextStep,
  footerButtonReset,
  footerButtonClicked,
  headerButtonPreviousClicked,
} = inject('changingStepsFunctions', {
  nextStep: () => {},
  headerButtonPreviousClick: () => {},
  footerButtonReset: () => {},
  footerButtonClicked: {
    value: false
  },
  headerButtonPreviousClicked: {
    value: false
  },
})

watch(headerButtonPreviousClicked, () => {
  if (instantBooking.value) {
    addPaymentsStep()
  }
})

let { addPaymentsStep } = inject('addPaymentsStep', {
  addPaymentsStep: () => {}
})

let { removePaymentsStep } = inject('removePaymentsStep', {
  removePaymentsStep: () => {}
})

function callPaymentError (msg) {
  usePaymentError(store, msg)
}

function googleMapsLoaded () {
  return window.google && settings.general.gMapApiKey
}

function setAddressCF (input, cfId) {
  if (typeof input === 'string') {
    infoFormData.value['cf' + cfId] = input
  }
}

let paymentError = computed(() => store.getters['booking/getError'])

/**
 * Form Block start
 */
// * Form reference
let infoFormRef = ref(null)

let isRtl = computed(() => store.getters['getIsRtl'])

let phoneError = ref(false)
let loggedInUser = computed(() => (store.getters['booking/getCustomerId'] && store.getters['booking/getCustomerEmail'])
  || (!!window.ameliaUser && window.ameliaUser.type == 'admin'))

// * Form data
let infoFormData = ref({
  firstName: computed({
    get: () => store.getters['booking/getCustomerFirstName'],
    set: (val) => {
      store.commit('booking/setCustomerFirstName', val ? val : "")
    }
  }),
  lastName: computed({
    get: () => store.getters['booking/getCustomerLastName'],
    set: (val) => {
      store.commit('booking/setCustomerLastName', val ? val : "")
    }
  }),
  email: computed({
    get: () => store.getters['booking/getCustomerEmail'],
    set: (val) => {
      store.commit('booking/setCustomerEmail', val ? val : "")
    }
  }),
  phone: computed({
    get: () => store.getters['booking/getCustomerPhone'],
    set: (val) => {
      store.commit('booking/setCustomerPhone', val ? val : "")
    }
  }),
})
provide('infoFormData', infoFormData)

// * Form Fields Object
let formFields = ref({
  firstName: {
    template: markRaw(FirstNameFormField),
    props: {
      class: computed(() => isRtl.value ? 'am-rtl' : ''),
      loggedInUser: computed(() => !!loggedInUser.value)
    }
  },
  lastName: {
    template: markRaw(LastNameFormField),
    props: {
      class: computed(() => isRtl.value ? 'am-rtl' : ''),
      loggedInUser: computed(() => !!loggedInUser.value)
    }
  },
  email: {
    template: markRaw(EmailFormField),
    props: {
      class: computed(() => isRtl.value ? 'am-rtl' : ''),
      loggedInUser: computed(() => !!loggedInUser.value)
    }
  },
  phone: {
    template: markRaw(PhoneFormField),
    props: {
      class: computed(() => isRtl.value ? 'am-rtl' : ''),
      phoneError: computed(() => phoneError.value),
      loggedInUser: computed(() => !!loggedInUser.value)
    },
    handlers: {
      countryPhoneIsoUpdated: (val) => {
        store.commit('booking/setCustomerCountryPhoneIso', val ? val.toLowerCase() : "")
      }
    }
  }
})

// * Form validation rules
let rules = ref({
  firstName: [
    {
      required: true,
      message: amLabels.value.enter_first_name_warning,
      trigger: 'submit',
    }
  ],
  lastName: [
    {
      required: amCustomize.infoStep.options.lastName.required,
      message: amLabels.value.enter_last_name_warning,
      trigger: 'submit',
    }
  ],
  email: [
    {
      required: amCustomize.infoStep.options.email.required,
      message: amLabels.value.enter_valid_email_warning,
      trigger: 'submit',
    },
    {
      type: 'email',
      message: amLabels.value.enter_valid_email_warning,
      trigger: 'submit'
    }
  ],
  phone: [
    {
      required: amCustomize.infoStep.options.phone.required,
      message: amLabels.value.enter_phone_warning,
      trigger: 'submit',
    }
  ],
})

let refOnSiteBooking = ref(null)

let refWcBooking = ref(null)

// * InitInfoStep hook - custom fields placeholder
let refCFPlaceholders = ref({})

// * InitInfoStep hook - adding coupon
let couponCode = ref('')

let loading = computed(() => store.getters['booking/getLoading'])

let instantBooking = ref(usePrepaidPrice(store) === 0)

allCustomFields.value.forEach((customField) => {
  if (customField.id in availableCustomFields.value) {
    rules.value['cf' + customField.id] = [{
      message: amLabels.value.required_field,
      required: customField.required,
      trigger: 'submit'
    }]
  }
})

function selectedDatePickerValue (id, dateString) {
  infoFormData.value[id] = moment(dateString, 'YYYY-MM-DD').toDate()
}

function onAddFile (a) {
  store.commit('booking/setAttachment', {
    id: a.id,
    raw: a.raw
  })

  infoFormData.value['cf' + a.id] = a.raw
}

function onRemoveFile (a) {
  store.commit('booking/setAttachment', {
    id: a.id,
    raw: a.raw
  })

  infoFormData.value['cf' + a.id] = a.raw
}

let customFieldsAllowedExtensions = ref('')

/**
 * Submit Form Function
 */
function submitForm() {
  footerButtonReset()

  // Trim inputs
  infoFormData.value.firstName = infoFormData.value.firstName.trim()
  infoFormData.value.lastName = infoFormData.value.lastName.trim()
  infoFormData.value.email = infoFormData.value.email.trim()

  useAction(
      store,
      {rules: rules.value},
      'customValidation',
      store.getters['booking/getBookableType'],
      null,
      null
  )

  infoFormRef.value.validate((valid) => {
    if (valid) {
      phoneError.value = false
      if (!instantBooking.value) {
        nextStep()
      } else {
        if (settings.payments.wc.enabled && !settings.payments.wc.onSiteIfFree && wcEntityEnabled.value) {
          store.commit('booking/setPaymentGateway', 'wc')

          refWcBooking.value.continueWithBooking()
        } else {
          store.commit('booking/setPaymentGateway', 'onSite')

          refOnSiteBooking.value.continueWithBooking()
        }
      }
    } else {
      let fieldElement
      allFieldsRefs.value.some(el => {
        if (el.shouldShowError === true) {
          fieldElement = el.formItemRef
          return el.shouldShowError === true
        }
      })

      let phoneField = allFieldsRefs.value.find(el => el.prop === 'phone')
      phoneError.value = !!(phoneField && phoneField.shouldShowError && phoneField.validateMessage)

      useScrollTo(infoFormWrapperRef.value, fieldElement, 20, 300)
      return false
    }
  })
}

// * Watching when footer button was clicked
watchEffect(() => {
  if (footerButtonClicked.value) {
    submitForm()
  }
})

let addressCustomFields = ref([])

let wcEntityEnabled = ref(false)

onMounted(() => {
  let entity = null

  switch (store.getters['booking/getBookableType']) {
    case ('appointment'):
      entity = useCartHasItems(store) === 1 ? store.getters['entities/getBookableFromBookableEntities'](
        store.getters['booking/getSelection']
      ) : null

      break

    case ('package'):
      entity = store.getters['entities/getPackage'](
        store.getters['booking/getPackageId']
      )

      break
  }

  let entityPayments = entity && entity.settings ? JSON.parse(entity.settings)['payments'] : null

  wcEntityEnabled.value = entityPayments && 'wc' in entityPayments
    ? !('enabled' in entityPayments.wc) || entityPayments.wc.enabled
    : settings.payments.wc.enabled

  if (settings.general.customFieldsAllowedExtensions) {
    customFieldsAllowedExtensions.value = Object.keys(settings.general.customFieldsAllowedExtensions).join(', ')
  }

  Object.keys(availableCustomFields.value).forEach((id) => {
    infoFormData.value['cf' + id] = computed({
      get: () => store.state.booking.appointment.bookings[0].customFields[id].value,
      set: (val) => {
        store.state.booking.appointment.bookings[0].customFields[id].value = val
      }
    })

    // * Placeholder implementation for custom input and textarea
    if (availableCustomFields.value[id].type === 'text' || availableCustomFields.value[id].type === 'text-area') {
      refCFPlaceholders.value[id] = {placeholder: ''}
    }
  })

  addressCustomFields.value.forEach(el => {
    let id = el.id.split('amelia-address-autocomplete-')
    if (id && id.length > 1 && id[1] in store.state.booking.appointment.bookings[0].customFields && store.state.booking.appointment.bookings[0].customFields[id[1]].value) {
      el.update(store.state.booking.appointment.bookings[0].customFields[id[1]].value)
    }
  })

  if (instantBooking.value) {
    removePaymentsStep()
  }

  nextTick(() => {
    primeCollectorRef.value.forEach(el => {
      if (el.primeFieldRef) {
        allFieldsRefs.value.push(el.primeFieldRef)
      }
    })
    allFieldsRefs.value.push.apply(allFieldsRefs.value, customFieldsRefs.value)
  })

  // add stats
  if (store.getters['booking/getBookableType'] === 'appointment') {
    let statsData = useAppointmentBookingData(store)[0]

    saveStats({
      locationId: statsData.locationId !== null ? statsData.locationId : null,
      providerId: statsData.providerId,
      serviceId: statsData.serviceId,
    })
  }

  useAction(
      store,
      { customFieldsPlaceholders: refCFPlaceholders, couponCode },
      'InitInfoStep',
      store.getters['booking/getBookableType'],
      null,
      null
  )

  if (couponCode.value) {
    store.commit('booking/setCouponCode', couponCode.value)
  }
})
</script>

<script>
export default {
  name: 'InfoStep',
  key: 'infoStep',
  inheritAttrs: false,
  sidebarData: {
    label: 'info_step',
    icon: 'user',
    stepSelectedData: [],
    finished: false,
    selected: false,
  },
}
</script>

<style lang="scss">
.amelia-v2-booking #amelia-container {
  .am-fs {
    &__main {
      &-content.am-fs__info {
        padding-top: 20px;
      }

      &-inner {
        overflow: hidden;
      }
    }

    &__info {
      &-error {
        animation: 600ms cubic-bezier(0.45, 1, 0.4, 1.2) #{100}ms
          am-animation-slide-up;
        animation-fill-mode: both;
        margin-bottom: 10px;
      }

      &-form {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;

        & > * {
          $count: 100;
          @for $i from 0 through $count {
            &:nth-child(#{$i + 1}) {
              animation: 600ms
                cubic-bezier(0.45, 1, 0.4, 1.2)
                #{$i *
                100}ms
                am-animation-slide-up;
              animation-fill-mode: both;
            }
          }
        }

        .am-fs__payments-sentence {
          width: 100%;
        }

        .el-form-item {
          width: calc(50% - 12px);

          &.am-cf-width-100 {
            width: 100%;
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

        .el-form-item__label {
          line-height: unset;
          padding: 0;
        }
      }
    }
  }
}
.pac-container {
  z-index: 9999999991 !important;
}
</style>
