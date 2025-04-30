<template>
  <transition name="fade">
    <el-form-item
      v-show="appointment.payment.gateway === 'stripe' && totalPrice"
      :class="$root.settings.customization.forms ? `am-block-${classIdentifier}`: ''"
      :error="errors.stripe"
    >
      <template slot="label">
        <span :style="{fontWeight: 700}">
          {{ labelCreditCard || $root.labels.credit_or_debit_card_colon }}
        </span>
      </template>
      <div :id="'card-element-' + this.$root.shortcodeData.counter" class="am-stripe"></div>
    </el-form-item>
  </transition>
</template>

<script>
export default {
  name: 'stripeCardFormField',

  props: {
    totalPrice: {
      type: Boolean
    },
    errors: {
      type: Object,
      default: function () {
        return {}
      }
    },
    appointment: {
      type: Object,
      default: function () {
        return {}
      }
    },
    stripePayment: {
      type: Object,
      default: function () {
        return {
          stripe: null,
          cardElement: null
        }
      }
    },
    classIdentifier: {
      type: String,
      default: ''
    },
    formField: {
      type: Object,
      default: function () {
        return {}
      }
    }
  },

  data () {
    return {
      labelCreditCard: this.formField[this.$options.name].labels.credit_or_debit_card_colon.value
    }
  },

  mounted () {
    if (this.$root.settings.payments.stripe.enabled) {
      this.stripeInit()
    }
  },

  methods: {
    stripeInit () {
      this.stripePayment.stripe = Stripe(this.getStripePublishableKey())

      let elements = this.stripePayment.stripe.elements({
        locale: window.localeLanguage[0].replace(/_/g, "-")
      })

      this.stripePayment.cardElement = elements.create('card')
      this.stripePayment.cardElement.mount('#card-element-' + this.$root.shortcodeData.counter)
    },

    getStripePublishableKey () {
      return this.$root.settings.payments.stripe.testMode === false
        ? this.$root.settings.payments.stripe.livePublishableKey : this.$root.settings.payments.stripe.testPublishableKey
    }
  }
}
</script>
