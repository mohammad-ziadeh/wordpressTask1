<template>
    <el-form-item
      v-if="totalPrice && !this.$root.settings.payments.wc.enabled && paymentOptions.length > 1"
      class="am-payment-buttons-wrapper"
      :style="{minHeight: (formField.paymentMethodFormField.switchPaymentMethodView && formField.paymentMethodFormField.switchPaymentMethodView === 'Selectbox')
       ? 'unset' : ''}"
      :class="$root.settings.customization.forms ? `am-select-${classIdentifier}`: ''"
    >
      <template slot="label">
        <span :style="{fontWeight: 700}">
          {{ labelPaymentMethod || $root.labels.payment_method_colon }}
        </span>
      </template>

      <!-- if switched to old select-view -->
      <el-select
          v-if="formField.paymentMethodFormField.switchPaymentMethodView && formField.paymentMethodFormField.switchPaymentMethodView === 'Selectbox'"
          v-model="appointment.payment.gateway"
          :popper-class="$root.settings.customization.forms ? `am-dropdown-${classIdentifier}` : ''"
          placeholder=""
          @change="changeItem"
      >
        <el-option
            v-for="item in paymentOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
            :style="{'color': appointment.payment.gateway === item.value ? bookableColor : ''}"
        >
        </el-option>
      </el-select>

      <el-button
          v-else
          v-for="item in paymentOptions"
          :key="item.value"
          :value="item.value"
          @click="changeItem(item.value)"
          class="am-payment-button"
          :class="appointment.payment.gateway === item.value ? 'am-payment-button-selected':''"
      >
        <payment-button-inner
          :customize-option="'paymentMethodFormField'"
          :form-field="formField"
          :value="item.value.toLowerCase()"
          :color="appointment.payment.gateway === item.value ? $root.settings.customization.primaryColor : ''"
        >
        </payment-button-inner>
      </el-button>
    </el-form-item>
</template>

<script>
import paymentButtonInner from '../../../parts/PaymentButtonInner'

export default {
  name: 'paymentMethodFormField',

  components: {
    paymentButtonInner
  },

  props: {
    totalPrice: {
      type: Boolean
    },
    bookableColor: {
      type: String
    },
    paymentOptions: {
      type: Array,
      default: () => []
    },
    appointment: {
      type: Object,
      default: () => {}
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
      labelPaymentMethod: this.formField[this.$options.name].labels.payment_method_colon.value
    }
  },

  methods: {
    changeItem (value) {
      this.appointment.payment.gateway = value
      this.$emit('changeItem')
    }
  }
}
</script>
