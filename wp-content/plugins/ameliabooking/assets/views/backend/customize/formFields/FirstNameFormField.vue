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
          {{ labelFirstName.value || `${$root.labels.first_name_colon}:` }}
        </template>
        <template v-else>
          {{ labelFirstName.translations[languageShortCode] || `${$root.labels.first_name_colon}:` }}
        </template>
      </span>
    </template>

    <el-input
      v-model="firstName"
      :style="{ backgroundColor: customizationForm.formInputColor, color: customizationForm.formInputTextColor, borderColor: selectInputFocus ? customization.primaryColor : '#C0C4CC' }"
      @focus="inputFocus"
    >
    </el-input>

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

  export default {
    name: 'firstNameFormField',

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
        firstName: '',
        selectInputFocus: false,
        labelFirstName: this.formField.labels.first_name_colon
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
        this.labelFirstName = this.formField.labels.first_name_colon
      }
    }
  }
</script>
