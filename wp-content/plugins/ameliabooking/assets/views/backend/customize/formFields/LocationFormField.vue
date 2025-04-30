<template>
  <!-- Locations -->
  <el-form-item
    v-show="customizationEdit.editable ? customizationEdit.editable : componentDisplay()"
    class="am-customize-field"
    :class="{'editable': customizationEdit.editable}"
    :style="{borderColor: customizationEdit.reverseBackgroundColorForm}"
  >
    <template slot="label">
      <span :style="{ 'color': customizationForm.formTextColor }">
        <template v-if="!languageShortCode">
          {{ labelLocations.value || `${$root.labels.locations}:` }}
        </template>
        <template v-else>
          {{ labelLocations.translations[languageShortCode] || `${$root.labels.locations}:` }}
        </template>
      </span>
    </template>
    <el-select
      v-model="location"
      :popper-class="'am-dropdown'"
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
    <span v-if="customizationEdit.editable" class="am-customize-drag-handle">
      <img :src="$root.getUrl + 'public/img/am-customize-icon-drag-handle.svg'"/>
    </span>
  </el-form-item>
  <!-- /Locations -->
</template>

<script>
  import customizeEditDialog from '../dialogs/CustomizeEditDialog'

  export default {
    name: 'locationFormField',

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
        location: '',
        locationOptions: [
          {name: `${this.$root.labels.location_option} 1`},
          {name: `${this.$root.labels.location_option} 2`},
          {name: `${this.$root.labels.location_option} 3`}
        ],
        selectInputFocus: false,
        labelLocations: this.formField.labels.locations
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
        this.labelLocations = this.formField.labels.locations
      }
    }
  }
</script>