<template>
  <!-- Service -->
  <el-form-item
    v-show="customizationEdit.editable ? customizationEdit.editable : componentDisplay()"
    class="am-customize-field"
    :class="{'editable': customizationEdit.editable}"
    :style="{borderColor: customizationEdit.reverseBackgroundColorForm}"
  >
    <template slot="label">
      <span :style="{ 'color': customizationForm.formTextColor }">
        <template v-if="!languageShortCode">
          {{ labelService.value || `${$root.labels.service}:` }}
        </template>
        <template v-else>
          {{ labelService.translations[languageShortCode] || `${$root.labels.service}:` }}
        </template>
      </span>
    </template>
    <el-select
      v-model="service"
      :popper-class="'am-dropdown'"
      :style="{ backgroundColor: customizationForm.formInputColor, color: customizationForm.formInputTextColor, borderColor: selectInputFocus ? customizationForm.primaryColor : '#C0C4CC' }"
      @focus="inputFocus"
      placeholder=""
    >
      <el-option
        v-for="item in serviceOptions"
        :key="item.name"
        :label="item.name"
        :value="item.name"
        :style="{
          backgroundColor: customizationForm.formDropdownColor,
          color: item.name === service ? customizationForm.primaryColor : customizationForm.formDropdownTextColor,
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
  <!-- /Service -->
</template>

<script>
  import customizeEditDialog from '../dialogs/CustomizeEditDialog'

  export default {
    name: 'serviceFormField',

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
        service: '',
        serviceOptions: [
          {name: `${this.$root.labels.service_option} 1`},
          {name: `${this.$root.labels.service_option} 2`},
          {name: `${this.$root.labels.service_option} 3`}
        ],
        selectInputFocus: false,
        labelService: this.formField.labels.service
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
        this.labelService = this.formField.labels.service
      }
    }
  }
</script>
