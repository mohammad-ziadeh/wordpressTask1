<template>
  <div class="am-cs">
    <SidebarCardTemplate
      :back-btn-visibility="settingsComponents[componentKey].backBtnVisibility"
      :heading-icon="settingsComponents[componentKey].headingIcon"
      :heading-text="settingsComponents[componentKey].headingText"
      @click="handleClick"
    >
      <component :is="settingsComponents[componentKey].component" :sub-step="settingsComponents[componentKey].subStep"></component>
    </SidebarCardTemplate>

    <div
      v-if="settingsComponents[componentKey].globalColors"
      class="am-cs__global-colors"
      @click="handleClick('colors')"
    >
      {{amLabels.change_colors}} <span class="am-icon-settings"></span>
    </div>

    <AmButton
      v-if="componentKey === 'colors' && colorsExtension.visibility"
      custom-class="am-cs__colors-btn"
      @click="handleClick('colors', 0, colorsExtension.goTo)"
    >
      {{ colorsExtension.string }}
    </AmButton>
  </div>
</template>

<script setup>
// Templates
import SidebarCardTemplate from './template/SidebarCardTemplate.vue'
// Segments
import CustomizationOrder from './segments/CustomizationOrder.vue'
import CustomizationOptions from './segments/CustomizationOptions.vue'
import CustomizationLabels from './segments/CustomizationLabels.vue'
// * Parts
// Common
import CustomizationGlobal from './parts/CustomizationGlobal.vue'
import CustomizationSidebar from './parts/CustomizationSidebar.vue'
import CustomizationColors from './parts/CustomizationColors.vue'
import CustomizationFonts from './parts/CustomizationFonts.vue'
import CustomizationMenu from './menu/CustomizationMenu.vue'

// Step by step
import CustomizationServices from './parts/CustomizationServices.vue'
import CustomizationBringing from './parts/CustomizationBringing.vue'
import CustomizationPackages from './parts/CustomizationPackages.vue'
import CustomizationPackageInfo from './parts/CustomizationPackageInfo.vue'
import CustomizationPackageAppointments from './parts/CustomizationPackageAppointments.vue'
import CustomizationPackageAppointmentsList from './parts/CustomizationPackageAppointmentsList.vue'
import CustomizationExtras from './parts/CustomizationExtras.vue'
import CustomizationDateAndTime from './parts/CustomizationDateAndTime.vue'
import CustomizationCart from './parts/CustomizationCart.vue'
import CustomizationRecurringPopup from './parts/CustomizationRecurringPopup.vue'
import CustomizationRecurring from './parts/CustomizationRecurring.vue'
import CustomizationRecurringSummary from './parts/CustomizationRecurringSummary.vue'
import CustomizationInfo from './parts/CustomizationInfo.vue'
import CustomizationPayment from './parts/CustomizationPayment.vue'
import CustomizationCongrats from './parts/CustomizationCongrats.vue'

// Catalog
import CustomizeCategories from './parts/CustomizationCategories.vue'
import CustomizeCategoryItems from './parts/CustomizationCategoryItems.vue'
import CustomizeCategoryService from './parts/CustomizationCategoryService.vue'
import CustomizeCategoryPackage from './parts/CustomizationCategoryPackage.vue'

// Events
// Event list
import CustomizationEventsList from "./parts/CustomizationEventsList.vue";
// Event calendar
import CustomizationEventsCalendar from "./parts/CustomizationEventsCalendar.vue";
// Event common steps
import CustomizationEventInfo from "./parts/CustomizationEventInfo.vue";
import CustomizationEventTickets from "./parts/CustomizationEventTickets.vue";
import CustomizationEventCustomerInfo from "./parts/CustomizationEventCustomerInfo.vue";
import CustomizationEventPayment from "./parts/CustomizationEventPayment.vue";
import CustomizationEventCongratulations from "./parts/CustomizationEventCongratulations.vue";

// Customer panel
import CustomizationCabinetProfile from "./parts/CustomizationCabinetProfile.vue";
import CustomizationDeleteProfile from "./parts/CustomizationDeleteProfile.vue";
import CustomizationCabinetAppointments from "./parts/CustomizationCabinetAppointments.vue";
import CustomizationCabinetAppointmentReschedule from "./parts/CustomizationCabinetAppointmentReschedule.vue";
import CustomizationCabinetAppointmentCancel from "./parts/CustomizationCabinetAppointmentCancel.vue";
import CustomizationCabinetEvents from "./parts/CustomizationCabinetEvents.vue";
import CustomizationCabinetEventCancel from "./parts/CustomizationCabinetEventCancel.vue";
import CustomizationCabinetPackagesList from "./parts/CustomizationCabinetPackagesList.vue";
import CustomizationCabinetPackageAppointments from "./parts/CustomizationCabinetPackageAppointments.vue";
import CustomizationCabinetAppointmentBook from "./parts/CustomizationCabinetAppointmentBook.vue"
import CustomizationCabinetPackageCancel from "./parts/CustomizationCabinetPackageCancel.vue";
import CustomizationCabinetSignIn from "./parts/CustomizationCabinetSignIn.vue";
import CustomizationCabinetLink from "./parts/CustomizationCabinetLink.vue";
import CustomizationCabinetLinkSuccess from "./parts/CustomizationCabinetLinkSuccess.vue";
import CustomizationCabinetSetPass from "./parts/CustomizationCabinetSetPass.vue";

// * Components
import AmButton from '../../../_components/button/AmButton.vue'

// * Import from Vue
import {
  ref,
  markRaw,
  inject,
  computed
} from 'vue'

// * Plugin Licence
let licence = inject('licence')

// * Labels
let amLabels = inject('labels')

// * Url Params
let urlParams = new URLSearchParams(window.location.search)

let pageRenderKey = inject('pageRenderKey')
let bookableType = inject('bookableType')

let { componentKey, handleClick } = inject('sidebarFunctionality')

let colorsExtension = computed(() => {
  let options = {
    goTo: '',
    visibility: false,
    string: ''
  }

  if (pageRenderKey.value === 'cbf') {
    options.goTo = 'sbsNew'
    options.visibility = true
    options.string = 'Go to Booking Form Colors'
    return options
  }

  if (urlParams.get('current') !== pageRenderKey.value) {
    if (pageRenderKey.value === 'sbsNew') {
      options.goTo = urlParams.get('current')
      options.visibility = true
      options.string = 'Go to Catalog Form Colors'
      return options
    }
  }

  return options
})

let sbsNewSettingsObj = ref({
  menu: {
    component: markRaw(CustomizationMenu),
    backBtnVisibility: false
  },
  global: {
    headingText: amLabels.cb_global_settings_heading,
    component: markRaw(CustomizationGlobal),
    backBtnVisibility: true
  },
  sidebar: {
    headingText: amLabels.cb_sidebar,
    component: markRaw(CustomizationSidebar),
    backBtnVisibility: true
  },
  fonts: {
    headingText: amLabels.fonts,
    component: markRaw(CustomizationFonts),
    backBtnVisibility: true
  },
  colors: {
    headingText: amLabels.colors,
    component: markRaw(CustomizationColors),
    backBtnVisibility: true
  },
  order: {
    headingText: amLabels.cb_field_order_heading,
    component: markRaw(CustomizationOrder),
    backBtnVisibility: true
  },
  options: {
    headingText: amLabels.options,
    component: markRaw(CustomizationOptions),
    backBtnVisibility: true
  },
  labels: {
    headingText: amLabels.labels,
    component: markRaw(CustomizationLabels),
    backBtnVisibility: true
  },
  services: {
    headingText: amLabels.csb_services,
    component: markRaw(CustomizationServices),
    backBtnVisibility: true,
    globalColors: true,
  },
  bringing: {
    headingText: amLabels.bringing_anyone,
    component: markRaw(CustomizationBringing),
    backBtnVisibility: true,
    globalColors: true,
  },
  packages: {
    headingText: amLabels.cpb_package,
    component: markRaw(CustomizationPackages),
    backBtnVisibility: true,
    subStep: computed(() => bookableType.value !== 'package'),
    globalColors: true,
  },
  packageInfo: {
    headingText: amLabels.cpb_package_info,
    component: markRaw(CustomizationPackageInfo),
    backBtnVisibility: true,
    globalColors: true,
  },
  packageAppointments: {
    headingText: amLabels.cpb_appointments_preview,
    component: markRaw(CustomizationPackageAppointments),
    backBtnVisibility: true,
    globalColors: true,
  },
  packageAppointmentsList: {
    headingText: amLabels.cpb_booking_overview,
    component: markRaw(CustomizationPackageAppointmentsList),
    backBtnVisibility: true,
    globalColors: true,
  },
  extras: {
    headingText: amLabels.csb_extras,
    component: markRaw(CustomizationExtras),
    backBtnVisibility: true,
    globalColors: true,
  },
  dateAndTime: {
    headingText: amLabels.csb_date_time,
    component: markRaw(CustomizationDateAndTime),
    backBtnVisibility: true,
    globalColors: true,
  },
  cart: {
    headingText: amLabels.csb_cart,
    component: markRaw(CustomizationCart),
    backBtnVisibility: true,
    globalColors: true,
  },
  recurringPopup: {
    headingText: amLabels.recurring_popup,
    component: markRaw(CustomizationRecurringPopup),
    backBtnVisibility: true,
    subStep: true,
    globalColors: true,
  },
  recurring: {
    headingText: amLabels.csb_recurring,
    component: markRaw(CustomizationRecurring),
    backBtnVisibility: true,
    globalColors: true,
  },
  recurringSummary: {
    headingText: amLabels.scb_recurring_summary,
    component: markRaw(CustomizationRecurringSummary),
    backBtnVisibility: true,
    globalColors: true,
  },
  info: {
    headingText: amLabels.csb_info_step,
    component: markRaw(CustomizationInfo),
    backBtnVisibility: true,
    globalColors: true,
  },
  payment: {
    headingText: amLabels.csb_payment,
    component: markRaw(CustomizationPayment),
    backBtnVisibility: true,
    globalColors: true,
  },
  congrats: {
    headingText: amLabels.cb_congratulations_heading,
    component: markRaw(CustomizationCongrats),
    backBtnVisibility: true,
    globalColors: true,
  }
})

let cbfSettingsObj = ref({
  menu: {
    component: markRaw(CustomizationMenu),
    backBtnVisibility: false
  },
  global: {
    headingText: amLabels.cb_global_settings_heading,
    component: markRaw(CustomizationGlobal),
    backBtnVisibility: true
  },
  fonts: {
    headingText: amLabels.fonts,
    component: markRaw(CustomizationFonts),
    backBtnVisibility: true
  },
  colors: {
    headingText: amLabels.colors,
    component: markRaw(CustomizationColors),
    backBtnVisibility: true
  },
  order: {
    headingText: amLabels.cb_field_order_heading,
    component: markRaw(CustomizationOrder),
    backBtnVisibility: true
  },
  options: {
    headingText: amLabels.options,
    component: markRaw(CustomizationOptions),
    backBtnVisibility: true
  },
  labels: {
    headingText: amLabels.labels,
    component: markRaw(CustomizationLabels),
    backBtnVisibility: true
  },
  categories: {
    headingText: amLabels.csb_categories,
    component: markRaw(CustomizeCategories),
    backBtnVisibility: true,
    globalColors: true,
  },
  categoryItems: {
    headingText: !licence.isBasic && !licence.isStarter && !licence.isLite ? amLabels.csb_category_items : amLabels.csb_category_services,
    component: markRaw(CustomizeCategoryItems),
    backBtnVisibility: true,
    globalColors: true,
  },
  categoryService: {
    headingText: amLabels.csb_category_service,
    component: markRaw(CustomizeCategoryService),
    backBtnVisibility: true,
    globalColors: true,
  },
  categoryPackage: {
    headingText: amLabels.csb_category_package,
    component: markRaw(CustomizeCategoryPackage),
    backBtnVisibility: true,
    globalColors: true,
  }
})

let elfSettingsObj = ref({
  menu: {
    component: markRaw(CustomizationMenu),
    backBtnVisibility: false
  },
  global: {
    headingText: amLabels.cb_global_settings_heading,
    component: markRaw(CustomizationGlobal),
    backBtnVisibility: true
  },
  fonts: {
    headingText: amLabels.fonts,
    component: markRaw(CustomizationFonts),
    backBtnVisibility: true
  },
  colors: {
    headingText: amLabels.colors,
    component: markRaw(CustomizationColors),
    backBtnVisibility: true
  },
  order: {
    headingText: amLabels.cb_field_order_heading,
    component: markRaw(CustomizationOrder),
    backBtnVisibility: true
  },
  options: {
    headingText: amLabels.options,
    component: markRaw(CustomizationOptions),
    backBtnVisibility: true
  },
  labels: {
    headingText: amLabels.labels,
    component: markRaw(CustomizationLabels),
    backBtnVisibility: true
  },
  list: {
    headingText: amLabels.csb_events_list,
    component: markRaw(CustomizationEventsList),
    backBtnVisibility: true,
    globalColors: true,
  },
  info: {
    headingText: amLabels.csb_event_info,
    component: markRaw(CustomizationEventInfo),
    backBtnVisibility: true,
    globalColors: true,
  },
  bringing: {
    headingText: amLabels.bringing_anyone,
    component: markRaw(CustomizationBringing),
    backBtnVisibility: true,
    globalColors: true,
  },
  tickets: {
    headingText: amLabels.csb_event_tickets,
    component: markRaw(CustomizationEventTickets),
    backBtnVisibility: true,
    globalColors: true,
  },
  customerInfo: {
    headingText: amLabels.csb_event_customer,
    component: markRaw(CustomizationEventCustomerInfo),
    backBtnVisibility: true,
    globalColors: true,
  },
  payment: {
    headingText: amLabels.csb_event_payment,
    component: markRaw(CustomizationEventPayment),
    backBtnVisibility: true,
    globalColors: true,
  },
  congrats: {
    headingText: amLabels.csb_event_congratulations,
    component: markRaw(CustomizationEventCongratulations),
    backBtnVisibility: true,
    globalColors: true,
  }
})

let ecfSettingsObj = ref({
  menu: {
    component: markRaw(CustomizationMenu),
    backBtnVisibility: false
  },
  global: {
    headingText: amLabels.cb_global_settings_heading,
    component: markRaw(CustomizationGlobal),
    backBtnVisibility: true
  },
  fonts: {
    headingText: amLabels.fonts,
    component: markRaw(CustomizationFonts),
    backBtnVisibility: true
  },
  colors: {
    headingText: amLabels.colors,
    component: markRaw(CustomizationColors),
    backBtnVisibility: true
  },
  order: {
    headingText: amLabels.cb_field_order_heading,
    component: markRaw(CustomizationOrder),
    backBtnVisibility: true
  },
  options: {
    headingText: amLabels.options,
    component: markRaw(CustomizationOptions),
    backBtnVisibility: true
  },
  labels: {
    headingText: amLabels.labels,
    component: markRaw(CustomizationLabels),
    backBtnVisibility: true
  },
  calendar: {
    headingText: amLabels.csb_events_calendar,
    component: markRaw(CustomizationEventsCalendar),
    backBtnVisibility: true,
    globalColors: true,
  },
  info: {
    headingText: amLabels.csb_event_info,
    component: markRaw(CustomizationEventInfo),
    backBtnVisibility: true,
    globalColors: true,
  },
  bringing: {
    headingText: amLabels.bringing_anyone,
    component: markRaw(CustomizationBringing),
    backBtnVisibility: true,
    globalColors: true,
  },
  tickets: {
    headingText: amLabels.csb_event_tickets,
    component: markRaw(CustomizationEventTickets),
    backBtnVisibility: true,
    globalColors: true,
  },
  customerInfo: {
    headingText: amLabels.csb_event_customer,
    component: markRaw(CustomizationEventCustomerInfo),
    backBtnVisibility: true,
    globalColors: true,
  },
  payment: {
    headingText: amLabels.csb_event_payment,
    component: markRaw(CustomizationEventPayment),
    backBtnVisibility: true,
    globalColors: true,
  },
  congrats: {
    headingText: amLabels.csb_event_congratulations,
    component: markRaw(CustomizationEventCongratulations),
    backBtnVisibility: true,
    globalColors: true,
  }
})

let capcSettingsObj = ref({
  menu: {
    component: markRaw(CustomizationMenu),
    backBtnVisibility: false
  },
  global: {
    headingText: amLabels.cb_global_settings_heading,
    component: markRaw(CustomizationGlobal),
    backBtnVisibility: true
  },
  sidebar: {
    headingText: amLabels.cb_sidebar,
    component: markRaw(CustomizationSidebar),
    backBtnVisibility: true
  },
  fonts: {
    headingText: amLabels.fonts,
    component: markRaw(CustomizationFonts),
    backBtnVisibility: true
  },
  colors: {
    headingText: amLabels.colors,
    component: markRaw(CustomizationColors),
    backBtnVisibility: true
  },
  order: {
    headingText: amLabels.cb_field_order_heading,
    component: markRaw(CustomizationOrder),
    backBtnVisibility: true
  },
  options: {
    headingText: amLabels.options,
    component: markRaw(CustomizationOptions),
    backBtnVisibility: true
  },
  labels: {
    headingText: amLabels.labels,
    component: markRaw(CustomizationLabels),
    backBtnVisibility: true
  },
  profile: {
    headingText: amLabels.csb_cust_profile,
    component: markRaw(CustomizationCabinetProfile),
    backBtnVisibility: true,
    globalColors: true,
  },
  deleteProfile: {
    headingText: amLabels.delete_profile,
    component: markRaw(CustomizationDeleteProfile),
    backBtnVisibility: true,
    globalColors: true,
  },
  appointments: {
    headingText: amLabels.csb_cust_appointments,
    component: markRaw(CustomizationCabinetAppointments),
    backBtnVisibility: true,
    globalColors: true,
  },
  rescheduleAppointment: {
    headingText: amLabels.csb_appointment_reschedule,
    component: markRaw(CustomizationCabinetAppointmentReschedule),
    backBtnVisibility: true,
    globalColors: true,
  },
  cancelAppointment: {
    headingText: amLabels.csb_appointment_cancel,
    component: markRaw(CustomizationCabinetAppointmentCancel),
    backBtnVisibility: true,
    globalColors: true,
  },
  events: {
    headingText: amLabels.csb_cust_events,
    component: markRaw(CustomizationCabinetEvents),
    backBtnVisibility: true,
    globalColors: true,
  },
  cancelEvent: {
    headingText: amLabels.csb_event_cancel,
    component: markRaw(CustomizationCabinetEventCancel),
    backBtnVisibility: true,
    globalColors: true,
  },
  packagesList: {
    headingText: amLabels.csb_cust_packages_list,
    component: markRaw(CustomizationCabinetPackagesList),
    backBtnVisibility: true,
    globalColors: true,
  },
  packageAppointments: {
    headingText: amLabels.csb_cust_package_appointments,
    component: markRaw(CustomizationCabinetPackageAppointments),
    backBtnVisibility: true,
    globalColors: true,
  },
  bookAppointment: {
    headingText: amLabels.csb_appointment_book,
    component: markRaw(CustomizationCabinetAppointmentBook),
    backBtnVisibility: true,
    globalColors: true,
  },
  cancelPackage: {
    headingText: amLabels.csb_cust_package_cancel,
    component: markRaw(CustomizationCabinetPackageCancel),
    backBtnVisibility: true,
    globalColors: true,
  },
  signIn: {
    headingText: amLabels.csb_cust_sign_in,
    component: markRaw(CustomizationCabinetSignIn),
    backBtnVisibility: true,
    globalColors: true,
  },
  accessLink: {
    headingText: amLabels.csb_cust_access_link,
    component: markRaw(CustomizationCabinetLink),
    backBtnVisibility: true,
    globalColors: true,
  },
  accessLinkSuccess: {
    headingText: amLabels.csb_cust_access_link_success,
    component: markRaw(CustomizationCabinetLinkSuccess),
    backBtnVisibility: true,
    globalColors: true,
  },
  setPass: {
    headingText: amLabels.csb_cust_set_new_pass,
    component: markRaw(CustomizationCabinetSetPass),
    backBtnVisibility: true,
    globalColors: true,
  }
})

let capeSettingsObj = ref({
  menu: {
    component: markRaw(CustomizationMenu),
    backBtnVisibility: false
  },
  global: {
    headingText: amLabels.cb_global_settings_heading,
    component: markRaw(CustomizationGlobal),
    backBtnVisibility: true
  },
  sidebar: {
    headingText: amLabels.cb_sidebar,
    component: markRaw(CustomizationSidebar),
    backBtnVisibility: true
  },
  fonts: {
    headingText: amLabels.fonts,
    component: markRaw(CustomizationFonts),
    backBtnVisibility: true
  },
  colors: {
    headingText: amLabels.colors,
    component: markRaw(CustomizationColors),
    backBtnVisibility: true
  },
  options: {
    headingText: amLabels.options,
    component: markRaw(CustomizationOptions),
    backBtnVisibility: true
  },
  labels: {
    headingText: amLabels.labels,
    component: markRaw(CustomizationLabels),
    backBtnVisibility: true
  },
  appointments: {
    headingText: amLabels.csb_cust_appointments,
    component: markRaw(CustomizationCabinetAppointments),
    backBtnVisibility: true,
    globalColors: true,
  },
  events: {
    headingText: amLabels.csb_cust_events,
    component: markRaw(CustomizationCabinetEvents),
    backBtnVisibility: true,
    globalColors: true,
  },
  signIn: {
    headingText: amLabels.csb_cust_sign_in,
    component: markRaw(CustomizationCabinetSignIn),
    backBtnVisibility: true,
    globalColors: true,
  },
  accessLink: {
    headingText: amLabels.csb_cust_access_link,
    component: markRaw(CustomizationCabinetLink),
    backBtnVisibility: true,
    globalColors: true,
  },
  accessLinkSuccess: {
    headingText: amLabels.csb_cust_access_link_success,
    component: markRaw(CustomizationCabinetLinkSuccess),
    backBtnVisibility: true,
    globalColors: true,
  },
  setPass: {
    headingText: amLabels.csb_cust_set_new_pass,
    component: markRaw(CustomizationCabinetSetPass),
    backBtnVisibility: true,
    globalColors: true,
  }
})

let settingsComponents = computed(() => {
  if (pageRenderKey.value === 'cbf') return cbfSettingsObj.value
  if (pageRenderKey.value === 'elf') return elfSettingsObj.value
  if (pageRenderKey.value === 'ecf') return ecfSettingsObj.value
  if (pageRenderKey.value === 'capc') return capcSettingsObj.value
  if (pageRenderKey.value === 'cape') return capeSettingsObj.value

  return sbsNewSettingsObj.value
})
</script>

<script>
export default {
  name: "SettingsSidebar"
}
</script>

<style lang="scss">
@mixin am-cs-block {
  // am - amelia
  // cs - customize settings
  .am-cs {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    &__inner {
      padding: 16px;
      border-bottom: 1px solid $shade-250;

      &:last-child {
        border-bottom: none;
      }
    }

    &__card {
      margin-bottom: 8px;

      &:last-child {
        margin-bottom: 0;
      }
    }

    &-part {
      padding: 0 0 16px;

      &__heading {
        font-size: 14px;
        font-weight: 500;
        font-style: normal;
        line-height: 1.42857;
        color: $shade-900;
        padding: 0 16px 8px;
      }
    }

    &__global-colors {
      display: flex;
      width: 100%;
      align-items: center;
      justify-content: flex-end;
      cursor: pointer;
      font-size: 14px;
      font-weight: 500;
      color: $shade-900;
      padding: 6px 16px 24px;
      background-color: $am-white;

      span {
        font-size: 24px;
        margin-left: 8px;
      }
    }

    &__colors-btn {
      display: flex;
      align-self: center;
      justify-self: center;
      width: calc(100% - 24px);
      margin-bottom: 12px !important;
    }
  }

  .am-dialog-cs {
    --am-h-psb: 100%;
    .el-drawer {
      &__header {
        height: 100px;
        margin: 0;
        padding-top: 48px;
      }

      &__body {
        padding: 0;
      }
    }

    .am-wrapper-sidebar {
      @include media-breakpoint-down(400px) {
        width: 320px;
      }
    }
  }
}

#amelia-app-backend-new {
  @include am-cs-block;
}

</style>
