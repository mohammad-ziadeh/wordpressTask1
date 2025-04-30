<template>
  <!-- User Phone -->
  <el-col :sm="columnsLg" ref="customer.phone" v-if="formField.visibility">
    <el-form-item
      prop="customer.phone"
      :class="$root.settings.customization.forms ? `am-input-${classIdentifier}`: ''"
      :error="errors.phone"
      :label="firstNameLabel || $root.labels.phone_colon"
      :style="{height: whatsAppSetUp() ? '80px' : 'inherit'}"
    >
      <phone-input
        :dropdown-class="`am-dropdown-${classIdentifier}`"
        :savedPhone="appointment.bookings[0].customer.phone"
        :disabled="!!appointment.bookings[0].customer.id && phonePopulated === true"
        :countryPhoneIso="appointment.bookings[0].customer.countryPhoneIso"
        @keyup.native="inputChanges"
        v-on:phoneFormatted="phoneFormatted"
      >
      </phone-input>
      <span v-if="whatsAppSetUp() && !phoneError" class="am-whatsapp-opt-in-text">
          {{ $root.labels.whatsapp_opt_in_text }}
      </span>
    </el-form-item>
  </el-col>
  <!-- /User Phone -->
</template>

<script>
import phoneInput from '../../../parts/PhoneInput'

export default {
  name: 'phoneFormField',

  components: {
    phoneInput
  },

  props: {
    appointment: {
      type: Object,
      default: () => {}
    },
    columnsLg: {
      type: Number,
      default: 12
    },
    formValidOptions: {
      type: Object,
      default: () => {}
    },
    errors: {
      type: Object,
      default: () => {}
    },
    phonePopulated: {
      type: Boolean,
      default: null
    },
    classIdentifier: {
      type: String,
      default: ''
    },
    formField: {
      type: Object,
      default: () => {}
    }
  },

  data () {
    return {
      firstNameLabel: this.formField.labels.phone_colon.value,
      phoneError: false
    }
  },

  methods: {
    inputChanges () {
      this.phoneError = false
      this.$emit('inputChanges')
    },

    phoneFormatted (phone, countryPhoneIso) {
      this.appointment.bookings[0].customer.phone = phone
      this.appointment.bookings[0].customer.countryPhoneIso = countryPhoneIso
    },

    whatsAppSetUp() {
      return this.$root.settings.notifications.whatsAppEnabled && this.$root.settings.notifications.whatsAppAccessToken && this.$root.settings.notifications.whatsAppBusinessID && this.$root.settings.notifications.whatsAppPhoneID
    }
  },

  watch: {
    'formValidOptions' () {
      if (this.formValidOptions['customer.phone']) {
        this.phoneError = true
        this.$refs['customer.phone'].$el.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' })
      }
    }
  }
}
</script>
