<template>
  <!-- Phone Number -->
  <el-form-item
    v-if="amCustomize.infoStep.options.phone.visibility"
    ref="primeFieldRef"
    class="am-fs__info-form__item"
    prop="phone"
    label-position="top"
    style="z-index: 10"
    :style="cssVars"
  >
    <template #label>
      <span class="am-fs__info-form__label">
        {{ amLabels.phone_colon }}
      </span>
    </template>
    <AmInputPhone
      v-model="infoFormData.phone"
      :placeholder="amLabels.enter_phone"
      :default-code="settings.general.phoneDefaultCountryCode === 'auto' ? '' : settings.general.phoneDefaultCountryCode.toLowerCase()"
      name="phone"
      style="position: relative"
      @country-phone-iso-updated="(val) => {emits('countryPhoneIsoUpdated', val)}"
    />
    <div v-if="whatsAppSetUp() && !props.phoneError" class="am-whatsapp-opt-in-text">
      {{ amLabels.whatsapp_opt_in_text }}
    </div>
  </el-form-item>
  <!-- /Phone Number -->
</template>

<script setup>
import AmInputPhone from '../../../../_components/input-phone/AmInputPhone.vue'
import { settings } from "../../../../../plugins/settings";

// * Vue
import {
  computed,
  inject,
  ref,
  onMounted,
} from "vue";

// * Composables
import {
  useColorTransparency
} from "../../../../../assets/js/common/colorManipulation";

// * Emits
const emits = defineEmits([
  'countryPhoneIsoUpdated',
])

// * Props
let props = defineProps({
  phoneError: {
    type: Boolean,
    default: false
  }
})

// * Colors
let amColors = inject('amColors')
let cssVars = computed(() => {
  return {
    // is - Info Step, wa - WhatsApp
    '--am-c-is-wa-text': useColorTransparency(amColors.value.colorMainText, 0.5),
    'margin-bottom': whatsAppSetUp() && !props.phoneError ? '10px' : '24px'
  }
})

let primeFieldRef = ref(null)

// * Labels
let amLabels = inject('amLabels')

// * Customize
let amCustomize = inject('amCustomize')

// * Form field data
let infoFormData = inject('infoFormData')

function whatsAppSetUp () {
  return settings.notifications.whatsAppEnabled && settings.notifications.whatsAppAccessToken && settings.notifications.whatsAppBusinessID && settings.notifications.whatsAppPhoneID
}

onMounted(() => {
  if (settings.general.phoneDefaultCountryCode && settings.general.phoneDefaultCountryCode !== 'auto') {
    emits('countryPhoneIsoUpdated', settings.general.phoneDefaultCountryCode.toLowerCase())
  }
})

defineExpose({
  primeFieldRef
})
</script>

<script>
export default {
  name: "PhoneFormField"
}
</script>

<style lang="scss">
.amelia-v2-booking {
  #amelia-container {
    .am-fs__info-form__item, .am-elfci__item {
      .am-whatsapp-opt-in-text {
        color: var(--am-c-is-wa-text);
        font-weight: 400;
        font-size: 10px;
        line-height: 16px;
        word-break: break-word;
      }
    }
  }
}

</style>
