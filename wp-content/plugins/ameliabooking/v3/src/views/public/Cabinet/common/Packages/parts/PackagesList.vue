<template>
  <template v-if="props.packages.length">
    <div
      v-for="pack in props.packages"
      :key="pack[0]"
      :style="cssVars"
      class="am-sc"
      :class="{'am-sc__canceled': pack[1].packageData.status === 'canceled'}"
    >
      <div
        class="am-sc__top"
        :class="responsiveClass"
      >
        <div class="am-sc__top-left">
          <div class="am-sc__name">
            {{ pack[1].packageData.name }}
          </div>
          <div
            v-if="pack[1].packageData.end"
            class="am-sc__date"
          >
            {{ amLabels.package_book_expire}} {{ getFrontedFormattedDate(pack[1].packageData.end.split(' ')[0]) }}
          </div>
          <div v-else class="am-sc__date">
            {{ `${amLabels.package_book_expiration} ${amLabels.package_book_unlimited}` }}
          </div>
        </div>
        <div
          class="am-sc__top-right"
          :class="responsiveClass"
          @click="selectId(pack[0])"
        >
          <div class="am-sc__capacity">
            {{ packagesSlotsCalculation(pack[1]) }}
          </div>
          <div class="am-sc__btn">
            <span class="am-icon-arrow-right"></span>
          </div>
        </div>
      </div>
      <template v-if="pack[1].packageData.end && pack[1].packageData.status !== 'canceled'">
        <div v-if="expirationDate(pack[1].packageData.end.split(' ')[0]) > 0" class="am-sc__bottom">
        <span class="am-sc__expiration">
          <span class="am-icon-triangle-info"></span> {{ `${amLabels.package_deal_expire_in} ${expirationDate(pack[1].packageData.end.split(' ')[0])} ${amLabels.expires_days}, ${amLabels.appointments_deal_expire}` }}
        </span>
        </div>
      </template>
    </div>
  </template>
  <EmptyState
    v-else
    :heading="amLabels.no_pack_found"
    :text="amLabels.have_no_pack"
  ></EmptyState>
</template>

<script setup>
// * Import from libraries
import moment from 'moment'

// * Import from Vue
import {
  reactive,
  computed,
  inject
} from "vue";

// * Dedicated components
import EmptyState from "../../parts/EmptyState.vue"

// * Composables
import {
  getFrontedFormattedDate
} from "../../../../../../assets/js/common/date";
import {
  useColorTransparency
} from "../../../../../../assets/js/common/colorManipulation";

// * Component properties
let props = defineProps({
  packages: {
    type: [Object, Array],
    default: () => {}
  },
  responsiveClass: {
    type: String,
    default: ''
  }
})

// * Components emits
let emits = defineEmits(['click'])

function expirationDate(end) {
  return moment(end, 'YYYY-MM-DD').diff(moment(), 'days')
}

function selectId (id) {
  emits('click', id)
}

function purchasedCount (data, id, type) {
  let count = 0

  Object.keys(data).forEach((serviceId) => {
    if (id === null || parseInt(id) === parseInt(serviceId)) {
      count += data[serviceId].purchaseData[type]
    }
  })

  return count
}

function bookedNumberText (numb) {
  return numb === 1 ? amLabels.value.appointment_booked : amLabels.value.appointments_booked
}

function packagesSlotsCalculation(data) {
  let notBooked = data.packageData.sharedCapacity ? data.packageData.sharedCount : purchasedCount(data.services, null, 'count')
  let slotsCapacity = data.packageData.sharedCapacity ? data.packageData.sharedTotal : purchasedCount(data.services, null, 'total')

  return `${slotsCapacity - notBooked}/${slotsCapacity} ${bookedNumberText(slotsCapacity - notBooked)}`
}

/**
 * * Customize
 * */

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

  let customizedLabels = amCustomize.value.packagesList.translations
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

// * Colors
let amColors = inject('amColors')

let cssVars = computed(() => {
  return {
    '--am-c-sc-bgr': amColors.value.colorMainBgr,
    '--am-c-sc-bgr-op15': useColorTransparency(amColors.value.colorMainText, 0.15),
    '--am-c-sc-text': amColors.value.colorMainText,
    '--am-c-sc-text-op80': useColorTransparency(amColors.value.colorMainText, 0.8),
    '--am-c-sc-text-op60': useColorTransparency(amColors.value.colorMainText, 0.6),
    '--am-c-sc-warning-op50': useColorTransparency(amColors.value.colorWarning, 0.5),
  }
})
</script>

<script>
export default {
  name: 'CabinetPackagesList'
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

    &__canceled {
      .am-sc__top {
        --am-c-sc-text: var(--am-c-sc-text-op60);
      }
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
        margin-right: 4px;
      }
    }
  }
}

.amelia-v2-booking #amelia-container {
  @include select-card-block;
}
</style>