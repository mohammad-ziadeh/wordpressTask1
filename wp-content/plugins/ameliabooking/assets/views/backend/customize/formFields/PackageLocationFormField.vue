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
          {{ labelPackageLocation.value || `${$root.labels.location}:` }}
        </template>
        <template v-else>
          {{ labelPackageLocation.translations[languageShortCode] || `${$root.labels.location}:` }}
        </template>
      </span>
    </template>
    <el-select
      v-model="location"
      :popper-class="'am-dropdown'"
      :clearable="true"
      :style="{ backgroundColor: customizationForm.formInputColor, color: customizationForm.formInputTextColor, borderColor: selectInputFocus ? customization.globalColors.primaryColor : '#C0C4CC' }"
      @focus="inputFocus"
      placeholder=""
    >
      <el-option
        v-for="item in locationOptions"
        :key="item.name"
        :label="item.name"
        :value="item.name"
        :style="{
          backgroundColor: customizationForm.formDropdownColor,
          color: item.name === location ? customization.globalColors.primaryColor : customizationForm.formDropdownTextColor,
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
  name: 'packageLocationFormField',

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
      location: '',
      locationOptions: [
        {name: `${this.$root.labels.location_option} 1`},
        {name: `${this.$root.labels.location_option} 2`},
        {name: `${this.$root.labels.location_option} 3`}
      ],
      selectInputFocus: false,
      labelPackageLocation: this.formField.labels.location
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
      fieldData['itemsStatic'] = {}
      fieldData['itemsStatic'][this.$options.name] = JSON.parse(JSON.stringify(objData))
      this.$emit('saveEdit', fieldData)
    }
  },

  watch: {
    'formField' () {
      this.labelPackageLocation = this.formField.labels.location
    }
  }
}
</script>
