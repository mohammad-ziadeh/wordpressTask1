<template>
  <div class="am-cs-menu">
    <div class="am-cs-menu__inner">
      <div class="am-cs-menu__inner-header">
        <span class="am-icon-settings"></span>
        {{amLabels.settings}}
      </div>
      <AmSettingsCard
        :header="amLabels.cb_global_settings_heading"
        :content="amLabels.csb_global_settings_content"
        @click="handleClick('global')"
      ></AmSettingsCard>
    </div>
    <div v-if="pageRenderKey === 'sbsNew' || ((pageRenderKey === 'capc' || pageRenderKey === 'cape') && pagesType === 'panel')" class="am-cs-menu__inner">
      <div class="am-cs-menu__inner-header">
        <span class="am-icon-box"></span>
        {{amLabels.cb_section}}
      </div>
      <AmSettingsCard
        :header="amLabels.cb_sidebar"
        :content="amLabels.csb_sidebar_content"
        @click="handleClick('sidebar')"
      ></AmSettingsCard>
    </div>
    <div class="am-cs-menu__inner">
      <div class="am-cs-menu__inner-header">
        <span class="am-icon-steps"></span>
        {{amLabels.steps}}
      </div>
      <AmSettingsCard
        v-for="card in settingsCardArray"
        :key="card.heading"
        :class="useLicenceMenuClass(card.trigger, licence)"
        class="am-cs-menu__card"
        :header="card.heading"
        :content="card.content"
        @click="handleClick(card.trigger, card.index, card.goToPage)"
      ></AmSettingsCard>
    </div>
  </div>
</template>

<script setup>
import AmSettingsCard from "../../../../_components/settings-card/AmSettingsCard";
// * import from Vue
import {
  ref,
  inject,
  computed
} from 'vue';
// * Import composables
import { useLicenceMenuClass } from '../../../../../assets/js/admin/labelsAndOptionsTreatment.js'

// * Labels
let amLabels = inject('labels')

// * Plugin Licence
let licence = inject('licence')

// * Bookable type
let bookableType = inject('bookableType')

// * Pages Type
let pagesType = inject('pagesType')
let pageRenderKey = inject('pageRenderKey')

function getServiceAppointmentArray () {
  let values = []

  values.push({
    heading: amLabels.csb_services,
    content: amLabels.csb_services_content,
    trigger: 'services',
  })

  if (licence.isStarter || licence.isBasic || licence.isPro || licence.isDeveloper) {
    values.push({
      heading: amLabels.csb_extras,
      content: amLabels.csb_extras_content,
      trigger: 'extras',
    })
  }

  values.push({
    heading: amLabels.csb_date_time,
    content: amLabels.csb_date_time_content,
    trigger: 'dateAndTime',
  })

  if (licence.isPro || licence.isDeveloper) {
    values.push({
      heading: amLabels.csb_cart,
      content: amLabels.csb_cart_content,
      trigger: 'cart',
    })
  }

  if (licence.isBasic || licence.isPro || licence.isDeveloper) {
    values.push({
      heading: amLabels.csb_recurring,
      content: amLabels.csb_recurring_content,
      trigger: 'recurring',
    })

    values.push({
      heading: amLabels.scb_recurring_summary,
      content: amLabels.scb_recurring_summary_content,
      trigger: 'recurringSummary',
    })
  }

  values.push({
    heading: amLabels.csb_info_step,
    content: amLabels.csb_info_step_content,
    trigger: 'info',
  })

  values.push({
    heading: amLabels.csb_payment,
    content: amLabels.csb_payment_content,
    trigger: 'payment',
  })

  values.push({
    heading: amLabels.cb_congratulations_heading,
    content: amLabels.cpb_congratulations_content,
    trigger: 'congrats',
  })

  values.forEach((item, index) => {
    item.index = index
  })

  return values
}

let { handleClick, parentPath } = inject('sidebarFunctionality')
parentPath.value = 'menu'

let serviceAppointmentArray = ref(getServiceAppointmentArray())

let packagesAppointmentArray = ref([
  {
    heading: amLabels.cpb_package,
    content: amLabels.cpb_package_content,
    trigger: 'packages',
    index: 0
  },
  {
    heading: amLabels.cpb_package_info,
    content: amLabels.cpb_package_info_content,
    trigger: 'packageInfo',
    index: 1
  },
  {
    heading: amLabels.cpb_appointments_preview,
    content: amLabels.cpb_appointments_preview_content,
    trigger: 'packageAppointments',
    index: 2
  },
  {
    heading: amLabels.cpb_booking_overview,
    content: amLabels.cpb_booking_overview_content,
    trigger: 'packageAppointmentsList',
    index: 3
  },
  {
    heading: amLabels.csb_info_step,
    content: amLabels.csb_info_step_content,
    trigger: 'info',
    index: 4
  },
  {
    heading: amLabels.csb_payment,
    content: amLabels.csb_payment_content,
    trigger: 'payment',
    index: 5
  },
  {
    heading: amLabels.cb_congratulations_heading,
    content: amLabels.cpb_congratulations_content,
    trigger: 'congrats',
    index: 6
  }
])

// * sbs - Step By Step
let sbsMenuCards = computed(() => {
  if (bookableType.value === 'package') {
    return packagesAppointmentArray.value
  }

  return serviceAppointmentArray.value
})

// * cbf - Catalog Booking Form , csb - customize sidebar
let cbfMenuArr = ref([
  {
    heading: amLabels.csb_categories,
    content: amLabels.csb_categories_content,
    trigger: 'categories',
    index: 0,
  },
  {
    heading: !licence.isBasic && !licence.isStarter && !licence.isLite ? amLabels.csb_category_items : amLabels.csb_category_services,
    content: !licence.isBasic && !licence.isStarter && !licence.isLite ? amLabels.csb_category_items_content : amLabels.csb_category_services_content,
    trigger: 'categoryItems',
    index: 1,
  },
  {
    heading: amLabels.csb_category_service,
    content: amLabels.csb_category_service_content,
    trigger: 'categoryService',
    index: 2,
  },
  {
    heading: amLabels.csb_category_package,
    content: amLabels.csb_category_package_content,
    trigger: 'categoryPackage',
    index: 3,
  },
  {
    heading: amLabels.booking_form,
    content: amLabels.booking_form_content,
    goToPage: 'sbsNew',
  }
])

if (pageRenderKey.value === 'cbf' && (licence.isStarter || licence.isLite)) {
  cbfMenuArr.value.splice(3, 1)
}

let cbfMenuCards = computed(() => {
  return cbfMenuArr.value
})

// * elf - Event List Form , csb - customize sidebar
let elfMenuArr = ref([
  {
    heading: amLabels.csb_events_list,
    content: amLabels.csb_events_list_content,
    trigger: 'list',
    index: 0,
  },
  {
    heading: amLabels.csb_event_info,
    content: amLabels.csb_event_info_content,
    trigger: 'info',
    index: 1
  },
  {
    heading: amLabels.csb_event_tickets,
    content: amLabels.csb_event_tickets_content,
    trigger: 'tickets',
    index: 2
  },
  {
    heading: amLabels.csb_event_customer,
    content: amLabels.csb_event_customer_content,
    trigger: 'customerInfo',
    index: 3
  },
  {
    heading: amLabels.csb_event_payment,
    content: amLabels.csb_event_payment_content,
    trigger: 'payment',
    index: 4
  },
  {
    heading: amLabels.csb_event_congratulations,
    content: amLabels.csb_event_congratulations_content,
    trigger: 'congrats',
    index: 5
  }
])

if (licence.isLite) {
  elfMenuArr.value.splice(2, 1)
}

let elfMenuCards = computed(() => {
  return elfMenuArr.value
})

// * capc - Cabinet Panel Customer, csb - customize sidebar
let capcPanelMenuArr = ref([
  {
    heading: amLabels.csb_cust_profile,
    content: amLabels.csb_cust_profile_content,
    trigger: 'profile',
    index: 0,
  },
  {
    heading: amLabels.csb_cust_appointments,
    content: amLabels.csb_cust_appointments_content,
    trigger: 'appointments',
    index: 1
  },
  {
    heading: amLabels.csb_cust_events,
    content: amLabels.csb_cust_events_content,
    trigger: 'events',
    index: 2
  },
  {
    heading: amLabels.csb_cust_packages_list,
    content: amLabels.csb_cust_packages_list_content,
    trigger: 'packagesList',
    index: 3
  },
  {
    heading: amLabels.csb_cust_package_appointments,
    content: amLabels.csb_cust_package_appointments_content,
    trigger: 'packageAppointments',
    index: 4
  }
])

if (licence.isStarter || licence.isBasic) {
  capcPanelMenuArr.value.splice(3, 2)
}

let capcAuthMenuArr = ref([
  {
    heading: amLabels.csb_cust_sign_in,
    content: amLabels.csb_cust_sign_in_content,
    trigger: 'signIn',
    index: 0,
  },
  {
    heading: amLabels.csb_cust_access_link,
    content: amLabels.csb_cust_access_link_content,
    trigger: 'accessLink',
    index: 1,
  },
  {
    heading: amLabels.csb_cust_access_link_success,
    content: amLabels.csb_cust_access_link_success_content,
    trigger: 'accessLinkSuccess',
    index: 2,
  },
  {
    heading: amLabels.csb_cust_set_new_pass,
    content: amLabels.csb_cust_set_new_pass_content,
    trigger: 'setPass',
    index: 3,
  }
])

let capcMenuCards = computed(() => {
  if (pagesType.value === 'auth') return capcAuthMenuArr.value
  return capcPanelMenuArr.value
})

// * ecf - Event Calendar Form , csb - customize sidebar
let ecfMenuArr = ref([
  {
    heading: amLabels.csb_events_calendar,
    content: amLabels.csb_events_calendar_content,
    trigger: 'calendar',
    index: 0,
  },
  {
    heading: amLabels.csb_event_info,
    content: amLabels.csb_event_info_content,
    trigger: 'info',
    index: 1
  },
  {
    heading: amLabels.csb_event_tickets,
    content: amLabels.csb_event_tickets_content,
    trigger: 'tickets',
    index: 2
  },
  {
    heading: amLabels.csb_event_customer,
    content: amLabels.csb_event_customer_content,
    trigger: 'customerInfo',
    index: 3
  },
  {
    heading: amLabels.csb_event_payment,
    content: amLabels.csb_event_payment_content,
    trigger: 'payment',
    index: 4
  },
  {
    heading: amLabels.csb_event_congratulations,
    content: amLabels.csb_event_congratulations_content,
    trigger: 'congrats',
    index: 5
  }
])
let ecfMenuCards = computed(() => {
  return ecfMenuArr.value
})

// * cape - Cabinet Panel Employee, csb - customize sidebar
let capePanelMenuArr = ref([
  {
    heading: amLabels.csb_cust_appointments,
    content: amLabels.csb_cust_appointments_content,
    trigger: 'appointments',
    index: 0
  },
  {
    heading: amLabels.csb_cust_events,
    content: amLabels.csb_cust_events_content,
    trigger: 'events',
    index: 1
  }
])

if (licence.isStarter || licence.isBasic) {
  capePanelMenuArr.value.splice(3, 2)
}

let capeAuthMenuArr = ref([
  {
    heading: amLabels.csb_cust_sign_in,
    content: amLabels.csb_cust_sign_in_content,
    trigger: 'signIn',
    index: 0,
  },
  {
    heading: amLabels.csb_cust_access_link,
    content: amLabels.csb_cust_access_link_content,
    trigger: 'accessLink',
    index: 1,
  },
  {
    heading: amLabels.csb_cust_access_link_success,
    content: amLabels.csb_cust_access_link_success_content,
    trigger: 'accessLinkSuccess',
    index: 2,
  },
  {
    heading: amLabels.csb_cust_set_new_pass,
    content: amLabels.csb_cust_set_new_pass_content,
    trigger: 'setPass',
    index: 3,
  }
])

let capeMenuCards = computed(() => {
  if (pagesType.value === 'auth') return capeAuthMenuArr.value
  return capePanelMenuArr.value
})

// * Cards in customize sidebar
let settingsCardArray = computed(() => {
  if (pageRenderKey.value === 'cbf') return cbfMenuCards.value
  if (pageRenderKey.value === 'elf') return elfMenuCards.value
  if (pageRenderKey.value === 'capc') return capcMenuCards.value
  if (pageRenderKey.value === 'ecf') return ecfMenuCards.value
  if (pageRenderKey.value === 'cape') return capeMenuCards.value

  return sbsMenuCards.value
})
</script>

<script>
export default {
  name: "CustomizationMenu"
}
</script>

<style lang="scss">
@mixin am-cs-menu-block {
  // am - amelia
  // cs - customize settings
  .am-cs-menu {
    &__inner {
      position: relative;
      padding: 16px;
      border-bottom: 1px solid $shade-250;

      &:last-child {
        border-bottom: none;
      }

      &-header {
        display: flex;
        align-items: center;
        font-size: 18px;
        font-style: normal;
        font-weight: 500;
        line-height: 1.55555;
        color: $shade-800;
        margin-bottom: 16px;

        span {
          font-size: 24px;
          margin-right: 8px;
        }
      }
    }

    &__card {
      margin-bottom: 8px;

      $count: 30;
      @for $i from 0 through $count {
        &:nth-child(#{$i + 1}) {
          animation: 400ms cubic-bezier(.45,1,.4,1.2) #{$i*70}ms am-animation-slide-up;
          animation-fill-mode: both;
        }
      }

      &:last-child {
        margin-bottom: 0;
      }
    }
  }
}

// admin
#amelia-app-backend-new {
  @include am-cs-menu-block;
}
</style>
