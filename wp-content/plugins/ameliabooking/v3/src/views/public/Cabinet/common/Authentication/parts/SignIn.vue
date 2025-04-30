<template>
  <div
    v-if="!loading"
    class="am-asi"
    :style="cssVars"
  >
    <div class="am-asi__top">
      <AmAlert
        v-if="profileDeleted"
        class="am-asi__top-message am-asi__top-message-success"
        type="success"
        :title="amLabels.profile_deleted"
        :description="''"
        :show-icon="true"
        :closable="true"
        @close="store.commit('auth/setProfileDeleted', false)"
      ></AmAlert>

      <AmAlert
        v-if="authError"
        class="am-asi__top-message am-asi__top-message-error"
        type="error"
        :title="authErrorMessage"
        :description="''"
        :show-icon="true"
        :closable="true"
        @close="store.commit('auth/setProfileDeleted', false)"
      ></AmAlert>

      <div class="am-asi__header">
        {{ amLabels.welcome_back }}
      </div>
      <div class="am-asi__text">
        {{ amLabels.enter_credentials }}
      </div>
    </div>

    <el-form
      ref="authFormRef"
      :model="infoFormData"
      :rules="infoFormRules"
      label-position="top"
      class="am-asi__form"
      :class="responsiveClass"
    >
      <template v-for="(item, index) in signInFormConstruction" :key="index">
        <component
          :is="item.template"
          ref="customerCollectorRef"
          v-model="infoFormData[index]"
          v-bind="item.props"
          @enter="submitForm"
        ></component>
      </template>
    </el-form>

    <AmButton
      class="am-asi__btn"
      :type="amCustomize.signIn.options.signInBtn.buttonType"
      @click="submitForm"
    >
      {{ amLabels.sign_in }}
    </AmButton>

    <div class="am-asi__footer">
      <span class="am-asi__footer-text">
        {{ amLabels.forgot_your_password }}
      </span>
      <span class="am-asi__footer-link" @click="pageKey = 'sendAccessLink'">
        {{ amLabels.reset_password }}
      </span>
    </div>
  </div>
  <Skeleton
    v-else
    :count="4"
    :center-first="true"
    :main-class="'am-asi-sign-in am-asi'"
  ></Skeleton>
</template>

<script setup>
// * import from Vue
import {
  ref,
  reactive,
  computed,
  inject,
  onMounted,
  markRaw,
  onBeforeMount,
} from 'vue'

// * Import from Vuex
import { useStore } from 'vuex'

// * Import from Libraries
import httpClient from '../../../../../../plugins/axios'
import { useCookies } from 'vue3-cookies'

// * Composables
import { useResponsiveClass } from '../../../../../../assets/js/common/responsive.js'
import { useColorTransparency } from '../../../../../../assets/js/common/colorManipulation'
import { useRemoveUrlParameter, useUrlQueryParams, useUrlQueryParam } from '../../../../../../assets/js/common/helper'
import { useDisableAuthorizationHeader } from '../../../../../../assets/js/public/panel'
import {
  useParsedCustomPricing,
  useFrontendEmployee,
  useFrontendEmployeeServiceList,
} from '../../../../../../assets/js/common/employee'

// * Components
import { formFieldsTemplates } from '../../../../../../assets/js/common/formFieldsTemplates'
import AmButton from '../../../../../_components/button/AmButton.vue'
import Skeleton from './Skeleton'
import AmAlert from '../../../../../_components/alert/AmAlert.vue'
import IconComponent from "../../../../../_components/icons/IconComponent.vue";
import { useGoogleSync } from "../../../../../../assets/js/common/integrationGoogle";
import { useOutlookSync } from "../../../../../../assets/js/common/integrationOutlook";
import { useZoomUsers } from "../../../../../../assets/js/common/integrationZoom";
import { useStripeSync } from "../../../../../../assets/js/common/integrationStripe";
import { useAppleSync } from "../../../../../../assets/js/common/integrationApple";

// * Plugin Licence
let licence = inject('licence')

// * Vars
let store = useStore()

const vueCookies = useCookies()['cookies']

// * Root Settings
const amSettings = inject('settings')

// * Customized form data
let amCustomize = inject('amCustomize')

// * labels
const labels = inject('labels')

// * local language short code
const localLanguage = inject('localLanguage')

// * if local lang is in settings lang
let langDetection = computed(() => amSettings.general.usedLanguages.includes(localLanguage.value))

// * Computed labels
let amLabels = computed(() => {
  let computedLabels = reactive({...labels})

  let customizedLabels = amCustomize.value.signIn.translations
  if (customizedLabels) {
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

// * Icon components
let emailIcon = {
  components: {IconComponent},
  template: `<IconComponent icon="email"></IconComponent>`
}

let passwordIcon = {
  components: {IconComponent},
  template: `<IconComponent icon="password"></IconComponent>`
}

/********
 * Form *
 ********/
// * Form reference
let authFormRef = ref(null)

// * Form data
let infoFormData = ref({
  email: computed({
    get: () => store.getters['auth/getEmail'],
    set: (val) => {
      store.commit('auth/setEmail', val ? val : '')
    }
  }),
  password: computed({
    get: () => store.getters['auth/getPassword'],
    set: (val) => {
      store.commit('auth/setPassword', val ? val : '')
    }
  }),
})

// * Form validation rules
let infoFormRules = ref({
  email: [
    {
      required: true,
      message: amLabels.value.enter_email_or_username_warning,
      trigger: 'submit',
    }
  ],
  password: [
    {
      required: true,
      message: amLabels.value.enter_password_warning,
      trigger: 'submit',
    }
  ],
})

// * Form construction
let signInFormConstruction = ref({
  email: {
    template: formFieldsTemplates.text,
    props: {
      itemName: 'email',
      label: amLabels.value.email_or_username,
      iconStart: markRaw(emailIcon),
      placeholder: '',
      class: 'am-asi__item'
    }
  },
  password: {
    template: formFieldsTemplates.text,
    props: {
      itemName: 'password',
      itemType: 'password',
      showPassword: true,
      label: amLabels.value.password,
      iconStart: markRaw(passwordIcon),
      placeholder: '',
      class: 'am-asi__item'
    }
  },
})

// * Page key
let pageKey = inject('pageKey')

// * Cabinet type
let cabinetType = inject('cabinetType')

// * Loading
let loading = computed(() => {
  return store.getters['getLoading']
})

let profileDeleted = computed(() => store.getters['auth/getProfileDeleted'])

// * Sign in error alert
let authError = ref(false)
let authErrorMessage = ref('')

function useAuthenticateUser (cookieToken, changePass) {
  let urlToken = useUrlQueryParam('token')

  if (cookieToken) {
    useAuthenticate(cookieToken, false, false, false)
  } else if (urlToken) {
    useAuthenticate(urlToken, true, false, changePass)
  } else {
    useAuthenticate('', false, true, false)
  }
}

function useAuthenticate (tokenValue, isUrlToken, checkIfWpUser, changePass) {
  let params = {cabinetType: cabinetType.value, changePass: changePass}

  if (checkIfWpUser) {
    params.checkIfWpUser = true
  }

  let password = store.getters['auth/getPassword']

  let email = store.getters['auth/getEmail']

  if (!tokenValue && password && email) {
    params.password = password
    params.email = email
  }

  if (isUrlToken) {
    params.token = tokenValue
  }

  httpClient.post(
    '/users/authenticate',
    params,
    tokenValue !== null && !useDisableAuthorizationHeader() ? {headers: {Authorization: 'Bearer ' + tokenValue}} : {}
  ).then((response) => {
    if ('authentication_required' in response.data.data) {
      if (!amSettings.roles[cabinetType.value + 'Cabinet']['loginEnabled']) {
        pageKey.value = 'sendAccessLink'
      }

      return
    }

    if ('token' in response.data.data) {
      vueCookies.set('ameliaToken', response.data.data.token, amSettings.roles[cabinetType.value + 'Cabinet']['tokenValidTime'], null, null, true)
      vueCookies.set('ameliaUserEmail', response.data.data.user.email, amSettings.roles[cabinetType.value + 'Cabinet']['tokenValidTime'], null, null, true)

      store.commit('auth/setToken', response.data.data.token)
    }

    if ('user' in response.data.data && response.data.data.user.type === 'provider') {
      let employee = {
        id: response.data.data.user.id,
        firstName: response.data.data.user.firstName,
        lastName: response.data.data.user.lastName,
        email: response.data.data.user.email,
        phone: response.data.data.user.phone,
        countryPhoneIso: response.data.data.user.countryPhoneIso,
        googleCalendar: {
          id: 'id' in response.data.data.user.googleCalendar ? response.data.data.user.googleCalendar.id : null,
          calendarId: response.data.data.user.googleCalendar.calendarId ? response.data.data.user.googleCalendar.calendarId : '',
          token: 'token' in response.data.data.user.googleCalendar ? response.data.data.user.googleCalendar.token : null,
        },
        outlookCalendar: {
          id: 'id' in response.data.data.user.outlookCalendar ? response.data.data.user.outlookCalendar.id : null,
          calendarId: response.data.data.user.outlookCalendar.calendarId ? response.data.data.user.outlookCalendar.calendarId : '',
          token: 'token' in response.data.data.user.outlookCalendar ? response.data.data.user.outlookCalendar.token : null,
        },
        appleCalendarId: response.data.data.user.appleCalendarId ? response.data.data.user.appleCalendarId : '',
        employeeAppleCalendar: response.data.data.user.employeeAppleCalendar ? response.data.data.user.employeeAppleCalendar : null,
        stripeConnect: response.data.data.user.stripeConnect,
        zoomUserId: response.data.data.user.zoomUserId ? response.data.data.user.zoomUserId : '',
        locationId: response.data.data.user.locationId,
        pictureFullPath: response.data.data.user.pictureFullPath,
        pictureThumbPath: response.data.data.user.pictureThumbPath,
        description: response.data.data.user.description,
        weekDayList: response.data.data.user.weekDayList,
        specialDayList: response.data.data.user.specialDayList,
        dayOffList: response.data.data.user.dayOffList,
        serviceList: response.data.data.user.serviceList,
      }

      employee.serviceList.forEach(employeeService => {
        useParsedCustomPricing(employeeService)
      })

      if (store.getters['entities/getReady']) {
        store.commit('entities/setEmployees', [JSON.parse(JSON.stringify(employee))])

        employee.serviceList = useFrontendEmployeeServiceList(store, employee.serviceList)
      }

      store.commit('employee/setEmployee', useFrontendEmployee(store, employee))

      store.commit(
        'auth/setOutlookCalendars',
        response.data.data.user.outlookCalendar?.calendarList ? response.data.data.user.outlookCalendar.calendarList : []
      )

      store.commit(
        'auth/setGoogleCalendars',
        response.data.data.user.googleCalendar?.calendarList ? response.data.data.user.googleCalendar.calendarList : []
      )

      if (amSettings.appleCalendar &&
        !licence.isLite &&
        !licence.isStarter
      ) {
        useAppleSync(store)
      }

      if (amSettings.payments.stripe.enabled &&
        amSettings.payments.stripe.connect.enabled &&
        !licence.isLite &&
        !licence.isStarter &&
        !licence.isBasic
      ) {
        useStripeSync(store)
      }

      if (amSettings.zoom.enabled &&
        !licence.isLite &&
        !licence.isStarter
      ) {
        useZoomUsers(store)
      }
    }

    if (useUrlQueryParam('token')) {
      window.history.replaceState(null, null, useRemoveUrlParameter(window.location.href, 'token'))
    }

    store.commit('auth/setProfile', response.data.data.user)

    if (response.data.data.user.timeZone) {
      store.commit('cabinet/setTimeZone', response.data.data.user.timeZone)
    }

    if ('set_password' in response.data.data && response.data.data.set_password) {
      pageKey.value = 'setPassword'
    } else if ('change_password' in response.data.data && response.data.data.change_password) {
      pageKey.value = 'setPassword'
    } else {
      store.commit('auth/setAuthenticated', true)
    }

    let tokenValidTime = cabinetType.value === 'customer'
      ? amSettings.roles.customerCabinet.tokenValidTime * 1000
      : amSettings.roles.providerCabinet.tokenValidTime * 1000

    if (tokenValidTime > 0 && tokenValidTime < 1814400000) {
      setTimeout(
        () => {
          store.dispatch('auth/logout')
        },
        tokenValidTime
      )
    }
  }).catch((error) => {
    if (!('data' in error.response.data) && 'message' in error.response.data) {
      authError.value = true
      authErrorMessage.value = error.response.data.message
      return
    }

    if ('invalid_credentials' in error.response.data.data) {
      authError.value = true
      authErrorMessage.value = amLabels.value.invalid_credentials
    }
  }).finally(() => {
    store.commit('setLoading', false)
  })
}

// * Submit Form
function submitForm() {
  authFormRef.value.validate((valid) => {
    if (valid) {
      store.commit('setLoading', true)

      useAuthenticate(null, false, false, false)
    } else {
      return false
    }
  })
}

function authenticate () {
  useAuthenticateUser(
    vueCookies.get('ameliaToken'),
    'changePass' in useUrlQueryParams(window.location.href)
  )
}

onBeforeMount(() => {
  store.commit('setLoading', true)
})

onMounted(() => {
  if (!store.getters['auth/getLoggedOut']) {
    let queryParams = useUrlQueryParams(window.location.href)

    if (amSettings.googleCalendar.enabled && cabinetType.value === 'provider' && queryParams && queryParams['code'] && queryParams['scope']) {
      useGoogleSync(queryParams['code'], authenticate)
    } else if (amSettings.outlookCalendar.enabled && cabinetType.value === 'provider' && queryParams && queryParams['code'] && queryParams['state']) {
      useOutlookSync(queryParams['code'], authenticate)
    } else {
      authenticate()
    }
  } else {
    if (!amSettings.roles[cabinetType.value + 'Cabinet']['loginEnabled']) {
      pageKey.value = 'sendAccessLink'
    }
    store.commit('setLoading', false)
  }
})

/*************
 * Customize *
 *************/

// * Responsive - Container Width
let cWidth = inject('containerWidth')

let responsiveClass = computed(() => useResponsiveClass(cWidth.value))

// * Fonts
let amFonts = inject('amFonts')

// * Colors block
let amColors = inject('amColors')

let cssVars = computed(() => {
  return {
    '--am-c-primary': amColors.value.colorPrimary,
    '--am-c-success': amColors.value.colorSuccess,
    '--am-c-error': amColors.value.colorError,
    '--am-c-warning': amColors.value.colorWarning,
    '--am-c-main-bgr': amColors.value.colorMainBgr,
    '--am-c-main-heading-text': amColors.value.colorMainHeadingText,
    '--am-c-main-text': amColors.value.colorMainText,
    '--am-c-main-text-op70': useColorTransparency(amColors.value.colorMainText, 0.7),
    '--am-c-main-text-op60': useColorTransparency(amColors.value.colorMainText, 0.6),
    '--am-c-main-text-op40': useColorTransparency(amColors.value.colorMainText, 0.4),
    '--am-c-main-text-op25': useColorTransparency(amColors.value.colorMainText, 0.25),
    '--am-c-inp-bgr': amColors.value.colorInpBgr,
    '--am-c-inp-border': amColors.value.colorInpBorder,
    '--am-c-inp-text': amColors.value.colorInpText,
    '--am-c-inp-placeholder': amColors.value.colorInpPlaceHolder,
    '--am-c-btn-prim': amColors.value.colorBtnPrim,
    '--am-c-btn-prim-text': amColors.value.colorBtnPrimText,
    '--am-c-skeleton-op20': useColorTransparency(amColors.value.colorMainText, 0.2),
    '--am-c-skeleton-op60': useColorTransparency(amColors.value.colorMainText, 0.6),
    '--am-font-family': amFonts.value.fontFamily,

    '--am-c-scroll-op30': useColorTransparency(amColors.value.colorPrimary, 0.3),
    '--am-c-scroll-op10': useColorTransparency(amColors.value.colorPrimary, 0.1),
  }
})
</script>

<script>
export default {
  name: 'AuthSignIn',
}
</script>

<style lang="scss">
// am - amelia
// asi - authentication sign in
@mixin auth {
  .am-asi {
    max-width: 400px;
    width: 100%;
    background-color: var(--am-c-main-bgr);
    box-shadow: 0 0 9px -4px var(--am-c-main-text-op40), 0px 17px 35px -12px var(--am-c-main-text-op25);
    border-radius: 12px;
    padding: 32px 24px 24px;
    margin: 0 auto;
    font-family: var(--am-font-family), sans-serif;

    * {
      font-family: var(--am-font-family), sans-serif;
      box-sizing: border-box;
    }

    &__top {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin: 0 0 32px;

      &-message {
        width: 100%;
        margin-bottom: 22px;
        font-weight: 500;
        font-size: 16px;
        line-height: 1.5;
        border-width: 1px;
        border-bottom-width: 4px;
        border-style: solid;
        box-shadow: 0 2px 3px rgba(26, 44, 55, 0.1);
        border-radius: 5px;

        &-success {
          border-color: var(--am-c-success);
        }

        &-error {
          border-color: var(--am-c-error);
        }

        .el-alert {
          &--success, &--error {
            border: none;
          }

          &--success {
            .el-icon {
              color: var(--am-c-success);
            }
          }

          &__closebtn {
            font-size: 16px;
            color: var(--am-c-main-text);
          }
        }
      }
    }

    &__header {
      font-size: 24px;
      font-weight: 500;
      line-height: 1.33333;
      color: var(--am-c-main-heading-text);
      margin: 0 0 4px;
    }

    &__text {
      font-size: 15px;
      font-weight: 400;
      line-height: 1.6;
      text-align: center;
      color: var(--am-c-main-text-op70);
    }

    &__form {
      .am-ff {
        &__item {
          &-label {
            font-size: 15px;
            font-weight: 500;
            color: var(--am-c-main-text);
          }
        }
      }

      .el-form {
        &-item {
          margin-bottom: 30px;

          &__label {
            margin: 0 0 4px;
          }
        }
      }
    }

    &__btn {
      width: 100%;
      margin: 16px 0;
    }

    &__footer {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-wrap: wrap;

      &-text {
        font-size: 15px;
        font-weight: 400;
        line-height: 1.6;
        color: var(--am-c-main-text-op70);
      }

      &-link {
        font-size: 15px;
        font-weight: 400;
        line-height: 1.6;
        color: var(--am-c-primary);
        cursor: pointer;
      }
    }

    .am-input-wrapper .am-input__default.is-icon-start {
      .el-input {
        &__prefix {
          left: 8px;

          i {
            font-size: 30px;
          }
        }

        &__suffix {
          i {
            font-size: 18px;
          }
        }
      }
    }
  }
}

// Public
.amelia-v2-booking #amelia-container {
  @include auth;
}
</style>
