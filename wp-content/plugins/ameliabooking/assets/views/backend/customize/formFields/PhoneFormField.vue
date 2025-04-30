<template>
  <el-col :sm="12">
  <!-- First Name -->
  <el-form-item
    v-show="customizationEdit.editable ? customizationEdit.editable : componentDisplay()"
    class="am-customize-field"
    :class="{'editable': customizationEdit.editable}"
    :style="{borderColor: customizationEdit.reverseBackgroundColorForm}"
  >
    <template slot="label">
      <span :style="{ 'color': customizationForm.formTextColor }">
        <template v-if="!languageShortCode">
          {{ labelPhone.value || `${$root.labels.phone_colon}:` }}
        </template>
        <template v-else>
          {{ labelPhone.translations[languageShortCode] || `${$root.labels.phone_colon}:` }}
        </template>
      </span>
    </template>

    <phone-input
      :style="{
        backgroundColor: customizationForm.formInputColor,
        color: customizationForm.formInputTextColor,
        borderColor: selectInputFocus ? customization.primaryColor : '#C0C4CC'
      }"
      :disabled="true"
    ></phone-input>

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
    <span v-if="customizationEdit.editable" class="am-customize-drag-handle">
      <img :src="$root.getUrl + 'public/img/am-customize-icon-drag-handle.svg'"/>
    </span>
  </el-form-item>
  <!-- /First Name -->
  </el-col>
</template>

<script>
import customizeEditDialog from '../dialogs/CustomizeEditDialog'
import phoneInput from '../parts/PhoneInput'

export default {
  name: 'phoneFormField',

  components: {
    phoneInput,
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
      email: '',
      selectInputFocus: false,
      labelPhone: this.formField.labels.phone_colon
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
      fieldData['itemsDraggable'] = {}
      fieldData['itemsDraggable'][this.$options.name] = JSON.parse(JSON.stringify(objData))
      this.$emit('saveEdit', fieldData)
    }
  },

  watch: {
    'formField' () {
      this.labelPhone = this.formField.labels.phone_colon
    }
  }
}
</script>
