<template>
  <div
    v-show="customizationEdit.editable ? customizationEdit.editable : componentDisplay()"
    class="am-customize-field"
    :class="{'editable': customizationEdit.editable}"
    :style="{borderColor: customizationEdit.reverseBackgroundColorForm}"
  >
    <!-- Bringing anyone with you -->
    <el-form-item class="am-customize-field-bringing">
      <template slot="label">
        <span :style="{ 'color': customizationForm.formTextColor }">
          <template v-if="!languageShortCode">
            {{ labelBringing.value || `${$root.labels.bringing_anyone_with_you}:` }}
          </template>
          <template v-else>
            {{ labelBringing.translations[languageShortCode] || `${$root.labels.bringing_anyone_with_you}:` }}
          </template>
        </span>
      </template>
      <el-switch
        v-model="enabled"
        :active-color="customizationForm.primaryColor"
      ></el-switch>
    </el-form-item>
    <!-- /Bringing anyone with you -->

    <!-- Number of persons -->
    <transition name="fade">
      <el-form-item v-if="enabled">
        <template slot="label">
          <span :style="{ 'color': customizationForm.formTextColor }">
            <template v-if="!languageShortCode">
              {{ labelPersons.value || `${$root.labels.number_of_additional_persons}:` }}
            </template>
            <template v-else>
              {{ labelPersons.translations[languageShortCode] || `${$root.labels.number_of_additional_persons}:` }}
            </template>
          </span>
        </template>
        <el-select
          v-model="bringing"
          :popper-class="'am-dropdown'"
          :style="{ backgroundColor: customizationForm.formInputColor, color: customizationForm.formInputTextColor, borderColor: selectInputFocus ? customizationForm.primaryColor : '#C0C4CC' }"
          @focus="inputFocus"
          placeholder=""
        >
          <el-option
            v-for="item in bringingOptions"
            :key="item.name"
            :label="item.name"
            :value="item.name"
            :style="{
              backgroundColor: customizationForm.formDropdownColor,
              color: item.name === bringing ? customizationForm.primaryColor : customizationForm.formDropdownTextColor,
              fontFamily: customization.font
            }"
          ></el-option>
        </el-select>
      </el-form-item>
    </transition>
    <!-- Number of persons -->

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
  </div>
</template>

<script>
  import customizeEditDialog from '../dialogs/CustomizeEditDialog'

  export default {
    name: 'bringingFormField',

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
        enabled: false,
        bringing: `1 ${this.$root.labels.one_person}`,
        bringingOptions: [
          {name: `1 ${this.$root.labels.one_person}`},
          {name: `2 ${this.$root.labels.one_persons}`},
          {name: `3 ${this.$root.labels.one_persons}`}
        ],
        selectInputFocus: false,
        labelBringing: this.formField.labels.bringing_anyone_with_you,
        labelPersons: this.formField.labels.number_of_additional_persons
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
        this.enabled = true
        let fieldData = {}
        fieldData['itemsDraggable'] = {}
        fieldData['itemsDraggable'][this.$options.name] = JSON.parse(JSON.stringify(objData))
        this.$emit('saveEdit', fieldData)
      }
    },

    watch: {
      'formField' () {
        this.labelBringing = this.formField.labels.bringing_anyone_with_you
        this.labelPersons = this.formField.labels.number_of_additional_persons
      }
    }
  }
</script>