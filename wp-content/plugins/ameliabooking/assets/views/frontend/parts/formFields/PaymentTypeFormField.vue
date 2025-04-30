<template>
  <el-form-item
      class="am-payment-type"
      v-if="show"
      :class="$root.settings.customization.forms ? `am-radio-btn-${classIdentifier}`: ''"
  >
    <template slot="label">
      <span :style="{fontWeight: 700}">
        {{ labelPaymentType || $root.labels.payment_type_colon }}
      </span>
    </template>
    <el-radio-group
        v-model="paymentType"
        @change="changePaymentType"
    >
      <el-radio
          class="am-payment-type-radio"
          border
          v-for="option in paymentTypeOptions"
          :label="option.label"
          :key="option.value"
          :class="option.value === paymentType ? 'am-payment-type-radio-checked':''"
      >
      </el-radio>
    </el-radio-group>
  </el-form-item>
</template>

<script>
export default {
  name: 'paymentTypeFormField',

  props: {
    show: {
      type: Boolean,
      default: false
    },
    bookableColor: {
      type: String,
      default: ''
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
      paymentType: 'depositOnly',
      paymentTypeOptions: [
        {value: 'depositOnly',
          label: (this.formField.hasOwnProperty(this.$options.name) && this.formField[this.$options.name].labels.payment_type_deposit_only.value)
            ? this.formField[this.$options.name].labels.payment_type_deposit_only.value : this.$root.labels.payment_type_deposit_only},
        {value: 'fullAmount',
          label: (this.formField.hasOwnProperty(this.$options.name) && this.formField[this.$options.name].labels.payment_type_full_amount.value)
            ? this.formField[this.$options.name].labels.payment_type_full_amount.value : this.$root.labels.payment_type_full_amount}
      ],
      labelPaymentType: this.formField.hasOwnProperty(this.$options.name) ? this.formField[this.$options.name].labels.payment_type_colon.value : ''
    }
  },

  methods: {
    changePaymentType (val) {
      this.paymentType = val === this.paymentTypeOptions[0].label ? this.paymentTypeOptions[0].value : this.paymentTypeOptions[1].value
      let param = this.paymentType === this.paymentTypeOptions[0].value ? this.paymentTypeOptions[0].value : this.paymentTypeOptions[1].value
      this.$emit('changeItem', {value: param})
    }

  }
}
</script>