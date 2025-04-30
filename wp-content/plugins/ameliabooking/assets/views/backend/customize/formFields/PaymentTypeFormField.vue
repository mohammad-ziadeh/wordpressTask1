<template>
  <el-form-item
      v-show="customizationEdit.editable ? customizationEdit.editable : componentDisplay()"
      class="am-customize-field"
      :class="{'editable': customizationEdit.editable}"
      :style="cssVars"
  >
    <template slot="label">
      <span :style="{ 'color': customizationForm.formTextColor }">
        <template v-if="!languageShortCode">
          {{ labelPaymentType.value || $root.labels.payment_type_colon }}
        </template>
        <template v-else>
          {{ labelPaymentType.translations[languageShortCode] || $root.labels.payment_type_colon }}
        </template>
      </span>
    </template>
    <template>
      <el-radio-group v-model="paymentType" @change="changePaymentType">
        <el-radio
          v-for="option in paymentOptionsLabels"
          :key="option.value"
          :label="option.label"
          border
          :class="option.value === paymentType ? 'am-payment-type-checked':''"
          :style="{
            marginRight: '20px',
            marginLeft: 0,
            borderRadius: '8px',
            minWidth: '152px',
            border: option.value === paymentType ? `1px solid ${customization.globalColors.primaryColor}`:'1px solid #E2E6EC',
            backgroundColor: option.value === paymentType ? colorTransparency(customization.globalColors.primaryColor, 0.08) :''
        }"
        >
        <span
          class="el-radio__label"
          :style="{
            color: option.value !== paymentType ? customizationForm.formTextColor: customization.globalColors.primaryColor,
            marginLeft: 0
          }"
        >
          {{option.label}}
        </span>
        </el-radio>
      </el-radio-group>
    </template>

    <!-- Edit Dialog -->
    <customize-edit-dialog
        :form-field="formField"
        :language-short-code="languageShortCode"
        @saveEdit="saveFormFiledEdit"
    >
      <template v-slot:fieldEdit>
        <span v-show="customizationEdit.editable" class="am-customize-field__edit">
          <img :src="$root.getUrl + 'public/img/am-customize-icon-edit.svg'" />
        </span>
      </template>
    </customize-edit-dialog>
    <!-- /Edit Dialog -->

  </el-form-item>
</template>

<style lang="less" scoped>
@primaryColor: var(--radio-circle-checked);
.am-customize-page {
  .am-confirm-booking {
    .am-customize-field {
      /deep/ .am-payment-type-checked .el-radio__inner {
        border-color: @primaryColor;
        background-color: @primaryColor;
      }
    }
  }
}
</style>

<script>
import cssColorManipulationMixin from '../../../../js/common/mixins/cssColorManipulationMixin'
import customizeEditDialog from '../dialogs/CustomizeEditDialog'

export default {
  name: 'paymentTypeFormField',

  components: {
    customizeEditDialog
  },

  mixins: [cssColorManipulationMixin],

  props: {
    languageShortCode: {
      type: String,
      default: ''
    },
    customization: {
      type: Object
    },
    customizationForm: {
      type: Object,
      default: () => {
        return {}
      }
    },
    customizationEdit: {
      type: Object,
      default: () => {
        return {}
      }
    },
    formField: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },

  data () {
    return {
      paymentType: 'depositOnly',
      paymentTypeOptions: this.paymentOptionsLabels,
      labelPaymentType: this.formField.labels.payment_type_colon
    }
  },

  computed: {
    paymentOptionsLabels () {
      if (this.languageShortCode) {
        return [
          {value: 'depositOnly', label: this.formField.labels.payment_type_deposit_only.translations[this.languageShortCode] || this.$root.labels.payment_type_deposit_only},
          {value: 'fullAmount', label: this.formField.labels.payment_type_full_amount.translations[this.languageShortCode] || this.$root.labels.payment_type_full_amount}
        ]
      } else {
        return [
          {value: 'depositOnly', label: this.formField.labels.payment_type_deposit_only.value || this.$root.labels.payment_type_deposit_only},
          {value: 'fullAmount', label: this.formField.labels.payment_type_full_amount.value || this.$root.labels.payment_type_full_amount}
        ]
      }
    },

    cssVars () {
      return {
        '--radio-circle-checked': this.customization.globalColors.primaryColor,
        borderColor: this.customizationEdit.reverseBackgroundColorForm
      }
    }
  },

  methods: {
    changePaymentType (val) {
      let temp = this.paymentOptionsLabels.filter(type => type.label === val)
      this.paymentType = temp[0].value
    },
    saveFormFiledEdit (objData) {
      let fieldData = {}
      fieldData['itemsStatic'] = {}
      fieldData['itemsStatic'][this.$options.name] = JSON.parse(JSON.stringify(objData))
      this.$emit('saveEdit', fieldData)
    },

    componentDisplay () {
      if (this.formField.hasOwnProperty('visibility')) {
        return this.formField.visibility
      }

      return true
    }

  },

  watch: {
    'formField' () {
      this.labelPaymentType = this.formField.labels.payment_type_colon
    }
  }
}
</script>