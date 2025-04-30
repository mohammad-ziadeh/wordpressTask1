<template>
  <!-- Employee -->
  <el-form-item
    v-show="customizationEdit.editable ? customizationEdit.editable : componentDisplay()"
    class="am-customize-field"
    :class="{'editable': customizationEdit.editable}"
    :style="{borderColor: customizationEdit.reverseBackgroundColorForm}"
  >
    <template slot="label">
      <span :style="{ 'color': customizationForm.formTextColor }">
        <template v-if="!languageShortCode">
          {{ labelEmployee.value || `${$root.labels.employee}:` }}
        </template>
        <template v-else>
          {{ labelEmployee.translations[languageShortCode] || `${$root.labels.employee}:` }}
        </template>
      </span>
    </template>
    <el-select
      v-model="employee"
      :popper-class="'am-dropdown'"
      :style="{ backgroundColor: customizationForm.formInputColor, color: customizationForm.formInputTextColor, borderColor: selectInputFocus ? customization.globalColors.primaryColor : '#C0C4CC' }"
      @focus="inputFocus"
      placeholder=""
    >
      <el-option
        v-if="anyEmployeeVisible"
        :label="(languageShortCode ? labelAnyEmployee.translations[languageShortCode] : labelAnyEmployee.value) || this.$root.labels.any_employee"
        :value="(languageShortCode ? labelAnyEmployee.translations[languageShortCode] : labelAnyEmployee.value) || this.$root.labels.any_employee"
        :style="{
          backgroundColor: customizationForm.formDropdownColor,
          color: labelAnyEmployee.value === employee ? customization.globalColors.primaryColor : customizationForm.formDropdownTextColor,
          fontFamily: customization.font
        }"
      >
      </el-option>
      <el-option
        v-for="item in employeeOptions"
        :key="item.id"
        :label="item.name"
        :value="item.name"
        :style="{
          backgroundColor: customizationForm.formDropdownColor,
          color: item.name === employee ? customization.globalColors.primaryColor : customizationForm.formDropdownTextColor,
          fontFamily: customization.font
        }"
      >
      </el-option>
    </el-select>
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
  <!-- /Employee -->
</template>

<script>
  import customizeEditDialog from '../dialogs/CustomizeEditDialog'

  export default {
    name: 'employeeFormField',

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
        default: () => {
          return {}
        },
        type: Object
      }
    },

    data () {
      return {
        employee: '',
        employeeOptions: [
          {name: `${this.$root.labels.employee_option} 1`},
          {name: `${this.$root.labels.employee_option} 2`},
          {name: `${this.$root.labels.employee_option} 3`}
        ],
        selectInputFocus: false,
        anyEmployeeVisible: this.formField.anyEmployeeVisible,
        labelAnyEmployee: this.formField.labels.any_employee,
        labelEmployee: this.formField.labels.employee
      }
    },

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

      saveFormFiledEdit (objData) {
        let fieldData = {}
        fieldData['itemsDraggable'] = {}
        fieldData['itemsDraggable'][this.$options.name] = JSON.parse(JSON.stringify(objData))
        this.$emit('saveEdit', fieldData)
      }
    },

    watch: {
      'formField' () {
        this.labelEmployee = this.formField.labels.employee
        this.labelAnyEmployee = this.formField.labels.any_employee || this.$root.labels.any_employee
        this.anyEmployeeVisible = this.formField.anyEmployeeVisible
      }
    }
  }
</script>