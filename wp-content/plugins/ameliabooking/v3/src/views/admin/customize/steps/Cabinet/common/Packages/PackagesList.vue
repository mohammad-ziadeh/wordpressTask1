<template>
  <div
    ref="pageContainer"
    class="am-cap"
  >
    <CabinetFilters
      :param-list="paramList"
      :responsive-class="responsiveClass"
    />
    <div
      v-for="customerId in Object.keys(packages)"
      :key="customerId"
      :style="cssVars"
      class="am-sc"
    >
      <div
        class="am-sc__top"
        :class="responsiveClass"
      >
        <div class="am-sc__top-left">
          <div class="am-sc__name">
            {{ packages[customerId].packageData.name }}
          </div>
          <div
            v-if="packages[customerId].packageData.end"
            class="am-sc__date"
          >
            {{ `${labelsDisplay('package_book_expire')} ${getFrontedFormattedDate(packages[customerId].packageData.end.split(' ')[0])}` }}
          </div>
          <div v-else class="am-sc__date">
            {{ `${labelsDisplay('package_book_expiration')} ${labelsDisplay('package_book_unlimited')}` }}
          </div>
        </div>
        <div
          class="am-sc__top-right"
          :class="responsiveClass"
        >
          <div class="am-sc__capacity">
            {{ `${purchasedCount(packages[customerId].services, null, 'count')}/${purchasedCount(packages[customerId].services, null, 'total')} ${bookedNumberText(purchasedCount(packages[customerId].services, null, 'count'))}` }}
          </div>
          <div class="am-sc__btn">
            <span class="am-icon-arrow-right"></span>
          </div>
        </div>
      </div>
      <template v-if="packages[customerId].packageData.end">
        <div v-if="expirationDate(packages[customerId].packageData.end.split(' ')[0]) > 0" class="am-sc__bottom">
          <span class="am-sc__expiration">
            <span class="am-icon-triangle-info"></span> {{ `${labelsDisplay('package_deal_expire_in')} ${expirationDate(packages[customerId].packageData.end.split(' ')[0])} ${labelsDisplay('expires_days')}, ${labelsDisplay('appointments_deal_expire')}` }}
          </span>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
// * Import from libraries
import moment from 'moment'

// * Import from Vue
import {
  computed,
  inject,
  ref
} from "vue";

// * Dedicated components
import CabinetFilters from '../parts/Filters.vue'

// * Composables
import {getFrontedFormattedDate} from "../../../../../../../assets/js/common/date";
import {useColorTransparency} from "../../../../../../../assets/js/common/colorManipulation";

// * Component properties
let props = defineProps({
  responsiveClass: {
    type: String,
    default: ''
  }
})

let paramList = ref({
  packages: {
    name: 'packages', icon: 'shipment', ids: []
  },
  services: {
    name: 'services', icon: 'service', ids: []
  },
  providers: {
    name: 'providers', icon: 'employee', ids: []
  },
  locations: {
    name: 'locations', icon: 'locations', ids: []
  }
})

let arrApp = [
  {
    end: 7,
    name: 'Package 1',
    status: 'approved'
  },
  {
    end: null,
    name: 'Package 2',
    status: 'approved'
  },
  {
    end: 10,
    name: 'Package 3',
    status: 'approved'
  }
]

let packages = ref({})

arrApp.forEach((item, index) => {
  packages.value[index] = {
    packageData: {
      name: item.name,
      price: 130,
      status: item.status,
      start: null,
      end: item.end ? `${moment().add(item.end, 'days').format('YYYY-MM-DD')} 10:00` : item.end,
      type: "package"
    },
    services: [
      {
        count: 3,
        total: 4
      },
      {
        count: 1,
        total: 5
      },
      {
        count: 0,
        total: 3
      },
      {
        count: 1,
        total: 3
      }
    ]
  }
})

function expirationDate(end) {
  return moment(end, 'YYYY-MM-DD').diff(moment(), 'days')
}

function purchasedCount (data, id, type) {
  let count = 0

  data.forEach((item) => {
    count += item[type]
  })

  return count
}

/**
 * * Customize
 * */
// * Customize
let amCustomize = inject('customize')

// * Labels
let langKey = inject('langKey')
let amLabels = inject('labels')

let pageRenderKey = inject('pageRenderKey')
let stepName = inject('stepName')

// * Label computed function
function labelsDisplay (label) {
  let computedLabel = computed(() => {
    return amCustomize.value[pageRenderKey.value][stepName.value].translations
    && amCustomize.value[pageRenderKey.value][stepName.value].translations[label]
    && amCustomize.value[pageRenderKey.value][stepName.value].translations[label][langKey.value]
      ? amCustomize.value[pageRenderKey.value][stepName.value].translations[label][langKey.value]
      : amLabels[label]
  })

  return computedLabel.value
}

function bookedNumberText (numb) {
  return numb === 1 ? labelsDisplay('appointment_booked') : labelsDisplay('appointments_booked')
}

// * Colors
let amColors = inject('amColors')

let cssVars = computed(() => {
  return {
    '--am-c-sc-bgr': amColors.value.colorMainBgr,
    '--am-c-sc-bgr-op15': useColorTransparency(amColors.value.colorMainText, 0.15),
    '--am-c-sc-text': amColors.value.colorMainText,
    '--am-c-sc-text-op80': useColorTransparency(amColors.value.colorMainText, 0.8),
    '--am-c-sc-warning-op50': useColorTransparency(amColors.value.colorWarning, 0.5),
  }
})
</script>

<script>
export default {
  name: 'CabinetPackagesList',
  key: 'packagesList'
}
</script>

<style lang="scss">
@mixin select-card-block {
  // am - amelia
  // sc - select block
  .am-sc {
    display: flex;
    flex-direction: column;
    background-color: var(--am-c-sc-bgr);
    border-radius: 8px;
    border: 1px solid var(--am-c-sc-bgr-op15);
    padding: 16px;
    margin: 0 0 8px;
    box-shadow: 0 4px 13px -11px var(--am-c-sc-text);

    * {
      font-family: var(--am-font-family);
      box-sizing: border-box;
    }

    &__top {
      display: flex;
      align-items: center;
      justify-content: space-between;

      &.am-rw-500 {
        flex-wrap: wrap;
      }

      &-right {
        display: flex;
        flex-direction: row;
        align-items: center;
        flex: 0 0 auto;
        cursor: pointer;

        * {
          color: var(--am-c-sc-text);
          font-size: 15px;
        }

        &.am-rw-500 {
          width: 100%;
          margin-top: 12px;
          justify-content: center;
        }
      }
    }

    &__name {
      color: var(--am-c-sc-text);
      font-size: 15px;
      line-height: 1.6;
      font-weight: 500;
      margin-bottom: 2px;
    }

    &__date {
      color: var(--am-c-sc-text-op80);
      font-size: 14px;
      font-weight: 400;
      line-height: 1.42857;
    }

    &__capacity {
      font-weight: 400;
    }

    &__btn {
      display: flex;
      align-items: center;
      justify-content: center;
    }

    &__expiration {
      display: flex;
      align-items: center;
      font-size: 14px;
      font-weight: 500;
      line-height: 1.42857;
      color: var(--am-c-sc-text);
      background-color: var(--am-c-sc-warning-op50);
      border-radius: 10px;
      padding: 0 8px;
      margin: 16px 0 0;

      [class^='am-icon'] {
        display: block;
        font-size: 20px;
      }
    }
  }
}

#amelia-app-backend-new #amelia-container {
  @include select-card-block;
}
</style>