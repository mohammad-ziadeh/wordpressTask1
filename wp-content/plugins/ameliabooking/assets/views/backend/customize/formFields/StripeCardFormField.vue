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
          {{ labelStripe.value || $root.labels.credit_or_debit_card_colon }}
        </template>
        <template v-else>
          {{ labelStripe.translations[languageShortCode] || $root.labels.credit_or_debit_card_colon }}
        </template>
      </span>
    </template>

    <div class="am-confirmation-booking-stripe">
      <div class="am-stripe-card-left am-stripe-card">
        <span class="am-stripe-card-icon">
          <svg focusable="false" viewBox="0 0 32 21">
            <g fill="#000" fill-rule="evenodd">
              <g class="Icon-fill">
                <g transform="translate(0 2)">
                  <path d="M26.58 19H2.42A2.4 2.4 0 0 1 0 16.62V2.38A2.4 2.4 0 0 1 2.42 0h24.16A2.4 2.4 0 0 1 29 2.38v14.25A2.4 2.4 0 0 1 26.58 19zM10 5.83c0-.46-.35-.83-.78-.83H3.78c-.43 0-.78.37-.78.83v3.34c0 .46.35.83.78.83h5.44c.43 0 .78-.37.78-.83V5.83z" opacity=".2"></path>
                  <path d="M25 15h-3c-.65 0-1-.3-1-1s.35-1 1-1h3c.65 0 1 .3 1 1s-.35 1-1 1zm-6 0h-3c-.65 0-1-.3-1-1s.35-1 1-1h3c.65 0 1 .3 1 1s-.35 1-1 1zm-6 0h-3c-.65 0-1-.3-1-1s.35-1 1-1h3c.65 0 1 .3 1 1s-.35 1-1 1zm-6 0H4c-.65 0-1-.3-1-1s.35-1 1-1h3c.65 0 1 .3 1 1s-.35 1-1 1z" opacity=".3"></path>
                </g>
              </g>
            </g>
          </svg>
        </span>
        <span class="am-stripe-card-text">
          {{ $root.labels.payment_card_number }}
        </span>
      </div>
      <div class="am-stripe-card-right am-stripe-card">
        <span class="am-stripe-card-text">
          MM / YY CVC
        </span>
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
import customizeEditDialog from '../dialogs/CustomizeEditDialog'

export default {
  name: 'stripeCardFormField',

  components: {
    customizeEditDialog
  },

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
      selectInputFocus: false,
      labelStripe: this.formField.labels.credit_or_debit_card_colon
    }
  },

  mounted () {},

  methods: {
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
      let fieldData = {}
      fieldData['itemsStatic'] = {}
      fieldData['itemsStatic'][this.$options.name] = JSON.parse(JSON.stringify(objData))
      this.$emit('saveEdit', fieldData)
    }
  },

  watch: {
    'formField' () {
      this.labelStripe = this.formField.labels.credit_or_debit_card_colon
    }
  }
}
</script>
