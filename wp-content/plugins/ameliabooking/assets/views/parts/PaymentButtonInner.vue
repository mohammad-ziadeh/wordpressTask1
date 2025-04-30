<template>
    <div class="am-payment-button-inner">
      <img v-if="value !== 'onsite' && value !== 'mollie'" :width="value === 'razorpay' ? '70' : '32'" height="32" :src="$root.getUrl + 'public/img/payments/icons/' + getIconName(value)">
      <svg-icon
        v-else-if="value === 'onsite' || value === 'mollie'"
        :iconName="value"
        :iconColor="color"
      >
      </svg-icon>
      <p v-if="value !== 'razorpay'">{{ formatPaymentName(value) }}</p>
    </div>
</template>

<script>
import svgIcon from '../backend/customize/parts/svgIcon'

export default {
  name: 'paymentButtonInner',

  components: {
    svgIcon
  },

  props: {
    value: {
      type: String,
      default: ''
    },
    color: {
      type: String,
      default: ''
    },
    formField: {
      type: Object,
      default: () => {}
    },
    customizeOption: {
      type: String,
      default: ''
    }
  },

  data () {
    return {
      labelPaymentMethodBtnMollie: this.formField[this.customizeOption].labels.payment_btn_mollie
        ? this.formField[this.customizeOption].labels.payment_btn_mollie.value : this.$root.labels.payment_btn_mollie,
      labelPaymentMethodBtnStripe: this.formField[this.customizeOption].labels.payment_btn_stripe
        ? this.formField[this.customizeOption].labels.payment_btn_stripe.value : this.$root.labels.payment_btn_stripe,
      labelPaymentMethodBtnOnsite: this.formField[this.customizeOption].labels.payment_btn_on_site
        ? this.formField[this.customizeOption].labels.payment_btn_on_site.value : this.$root.labels.payment_btn_on_site,
      labelPaymentMethodBtnSquare: this.formField[this.customizeOption].labels.payment_btn_square
        ? this.formField[this.customizeOption].labels.payment_btn_square.value : this.$root.labels.payment_btn_square
    }
  },

  methods: {
    getIconName (value) {
      return value.toLowerCase() + '.svg'
    },

    formatPaymentName (name) {
      let paymentName = name.toLowerCase()

      switch (paymentName) {
        case 'paypal':
          return 'Paypal'
        case 'stripe':
          return this.labelPaymentMethodBtnStripe || this.$root.labels.payment_btn_stripe
        case 'onsite':
          return this.labelPaymentMethodBtnOnsite || this.$root.labels.payment_btn_on_site
        case 'mollie':
          return this.labelPaymentMethodBtnMollie || this.$root.labels.payment_btn_mollie
        case 'square':
          return this.labelPaymentMethodBtnSquare || this.$root.labels.payment_btn_square
        case 'razorpay':
          return 'Razorpay'
        default:
          return name
      }
    }
  }
}
</script>
