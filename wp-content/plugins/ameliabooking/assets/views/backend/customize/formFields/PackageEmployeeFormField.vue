<template>
  <!-- Service -->
  <el-form-item
    v-show="customizationEdit.editable ? customizationEdit.editable : componentDisplay()"
    class="am-customize-field"
    :class="{'editable': customizationEdit.editable}"
    :style="{borderColor: customizationEdit.reverseBackgroundColorForm}"
  >
    <template slot="label">
      <span :style="{ 'color': customizationEdit.useGlobalColors ? customizationForm.textColorOnBackground : customizationForm.formTextColor }">
        <template v-if="!languageShortCode">
          {{ labelPackageEmployee.value || `${$root.labels.employee}:` }}
        </template>
        <template v-else>
          {{ labelPackageEmployee.translations[languageShortCode] || `${$root.labels.employee}:` }}
        </template>
      </span>
    </template>
    <el-select
      v-model="employee"
      :popper-class="'am-dropdown'"
      :clearable="true"
      :placeholder="anyEmployeeVisible ? (languageShortCode ? labelAnyEmployee.translations[languageShortCode] : labelAnyEmployee.value) || $root.labels.any_employee : ''"
      :style="{ backgroundColor: customizationForm.formInputColor, color: customizationForm.formInputTextColor, borderColor: selectInputFocus ? customization.globalColors.primaryColor : '#C0C4CC' }"
      @focus="inputFocus"
    >
      <el-option
        v-for="item in employeeOptions"
        :key="item.name"
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
  </el-form-item>
  <!-- /Service -->
</template>

<script>
import customizeEditDialog from '../dialogs/CustomizeEditDialog'

export default {
  name: 'packageEmployeeFormField',

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
      employee: '',
      employeeOptions: [
        {name: `${this.$root.labels.employee_option} 1`},
        {name: `${this.$root.labels.employee_option} 2`},
        {name: `${this.$root.labels.employee_option} 3`}
      ],
      selectInputFocus: false,
      labelPackageEmployee: this.formField.labels.employee,
      labelAnyEmployee: this.formField.labels.any_employee,
      anyEmployeeVisible: this.formField.anyEmployeeVisible
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

    saveFormFiledEdit (objData) {
      let fieldData = {}
      fieldData['itemsStatic'] = {}
      fieldData['itemsStatic'][this.$options.name] = JSON.parse(JSON.stringify(objData))
      this.$emit('saveEdit', fieldData)
    }
  },

  watch: {
    'formField' () {
      this.labelPackageEmployee = this.formField.labels.employee
      this.labelAnyEmployee = this.formField.labels.any_employee
      this.anyEmployeeVisible = this.formField.anyEmployeeVisible
    }
  }
}
</script>
