<template>
  <!-- Payment Method -->
  <el-form-item
    v-show="customizationEdit.editable ? customizationEdit.editable : componentDisplay()"
    class="am-customize-field"
    :class="{'editable': customizationEdit.editable}"
    :style="{borderColor: customizationEdit.reverseBackgroundColorForm}"
  >
    <template slot="label">
      <span :style="{ 'color': customizationForm.formTextColor }">
        <template v-if="!languageShortCode">
          {{ labelPaymentMethod.value || $root.labels.payment_method_colon }}
        </template>
        <template v-else>
          {{ labelPaymentMethod.translations[languageShortCode] || $root.labels.payment_method_colon }}
        </template>
      </span>
    </template>

    <el-select
        v-if="formField.switchPaymentMethodView === 'Selectbox'"
        v-model="payment"
        :popper-class="'am-dropdown'"
        :style="{ backgroundColor: customizationForm.formInputColor, color: customizationForm.formInputTextColor, borderColor: selectInputFocus ? customization.primaryColor : '#C0C4CC' }"
        @focus="inputFocus"
        placeholder=""
    >
      <el-option
          v-for="item in paymentOptions"
          :key="item.name"
          :label="item.name"
          :value="item.name"
          :style="{
          backgroundColor: customizationForm.formDropdownColor,
          color: item.name === payment ? customization.primaryColor : customizationForm.formDropdownTextColor,
          fontFamily: customization.font
        }"
      >
      </el-option>
    </el-select>

    <div
      v-else
      v-for="item in [{value: 'onsite'}, {value: 'mollie'}, {value: 'stripe'}]"
      class="el-button am-payment-button"
      :key="item.value"
      :value="item.value"
      :style="item.value !== selectedBtn ? {
        border: '2px solid #DEE2E6',
        backgroundColor: 'transparent',
        padding: '16px 4px',
        height: 'auto'
      }:{
        border: `2px solid ${customization.globalColors.primaryColor}`,
        backgroundColor: colorTransparency(customization.globalColors.primaryColor, 0.08),
        padding: '16px 4px',
        height: 'auto'
      }"
      @click="selectBtn(item.value)"
    >
      <div class="am-payment-button-inner">
        <img v-if="item.value === 'stripe'" height="32" :src="$root.getUrl + 'public/img/payments/icons/' + item.value.toLowerCase() +'.svg'">
        <svg-icon
          v-else
          :iconName="item.value"
          :iconColor="item.value === selectedBtn ? customization.globalColors.primaryColor : customizationForm.formTextColor"
        >
        </svg-icon>
        <p :style="{color: item.value === selectedBtn ? customization.globalColors.primaryColor : customizationForm.formTextColor, whiteSpace: 'normal', wordBreak: 'break-all'}">
          {{ getButtonText(languageShortCode, item.value) }}
        </p>
      </div>
    </div>

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
  <!-- /Payment Method -->
</template>

<script>
  import cssColorManipulationMixin from '../../../../js/common/mixins/cssColorManipulationMixin'
  import customizeEditDialog from '../dialogs/CustomizeEditDialog'
  import svgIcon from '../parts/svgIcon'

  export default {
    name: 'paymentMethodFormField',

    components: {
      customizeEditDialog,
      svgIcon
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
        selectedBtn: 'onsite',
        payment: '',
        paymentOptions: [
          {name: this.$root.labels.payment_on_site},
          {name: this.$root.labels.payment_paypal},
          {name: this.$root.labels.payment_credit_card}
        ],
        selectInputFocus: false,
        labelPaymentMethod: this.formField.labels.payment_method_colon,
        labelPaymentMethodBtnMollie: this.formField.labels.payment_btn_mollie,
        labelPaymentMethodBtnStripe: this.formField.labels.payment_btn_stripe,
        labelPaymentMethodBtnOnsite: this.formField.labels.payment_btn_on_site
      }
    },

    methods: {
      getButtonText (languageShortCode, paymentBtn) {
        if (!languageShortCode) {
          switch (paymentBtn) {
            case 'mollie':
              return this.labelPaymentMethodBtnMollie.value || this.$root.labels.payment_btn_mollie
            case 'stripe':
              return this.labelPaymentMethodBtnStripe.value || this.$root.labels.payment_btn_stripe
            case 'onsite':
              return this.labelPaymentMethodBtnOnsite.value || this.$root.labels.payment_btn_on_site
            default:
              return ''
          }
        } else {
          switch (paymentBtn) {
            case 'mollie':
              return this.labelPaymentMethodBtnMollie.translations[languageShortCode] || this.$root.labels.payment_btn_mollie
            case 'stripe':
              return this.labelPaymentMethodBtnStripe.translations[languageShortCode] || this.$root.labels.payment_btn_stripe
            case 'onsite':
              return this.labelPaymentMethodBtnOnsite.translations[languageShortCode] || this.$root.labels.payment_btn_on_site
            default:
              return ''
          }
        }
      },

      selectBtn (value) {
        this.selectedBtn = value
      },

      inputFocus () {
        this.selectInputFocus = true
      },

      componentDisplay () {
        if (this.formField.hasOwnProperty('visibility')) {
          return this.formField.visibility
        }

        return true
      },

      capitalizeFirstLetter (string) {
        return string.charAt(0).toUpperCase() + string.slice(1)
      },

      saveFormFiledEdit (objData) {
        delete objData['switchPaymentMethodViewOptions']
        let fieldData = {}
        fieldData['itemsStatic'] = {}
        fieldData['itemsStatic'][this.$options.name] = JSON.parse(JSON.stringify(objData))
        this.$emit('saveEdit', fieldData)
      }
    },

    watch: {
      'formField' () {
        this.labelPaymentMethod = this.formField.labels.payment_method_colon
        this.labelPaymentMethodBtnMollie = this.formField.labels.payment_btn_mollie
        this.labelPaymentMethodBtnStripe = this.formField.labels.payment_btn_stripe
        this.labelPaymentMethodBtnOnsite = this.formField.labels.payment_btn_on_site
      }
    }
  }
</script>
