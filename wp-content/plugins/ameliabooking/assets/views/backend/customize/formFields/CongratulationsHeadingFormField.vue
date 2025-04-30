<template>
  <div
    v-show="customizationEdit.editable ? customizationEdit.editable : componentDisplay()"
    class="am-customize-field"
    :class="{'editable': customizationEdit.editable}"
    :style="{borderColor: customizationEdit.reverseBackgroundColorForm}"
  >
    <h4 :style="{ 'color': customizationForm.formTextColor }">
      <template v-if="!languageShortCode">
        {{ labelHeading.value || $root.labels.congratulations }}
      </template>
      <template v-else>
        {{ labelHeading.translations[languageShortCode] || $root.labels.congratulations }}
      </template>
    </h4>

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
  </div>
</template>

<script>
  import customizeEditDialog from '../dialogs/CustomizeEditDialog'

  export default {
    name: 'congratulationsHeadingFormField',

    components: {
      customizeEditDialog
    },

    props: {
      languageShortCode: {
        type: String,
        default: ''
      },
      customization: {
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
      customizationForm: {
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
        labelHeading: this.formField.labels.congratulations
      }
    },

    mounted () {},

    methods: {
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
        this.labelHeading = this.formField.labels.congratulations
      }
    }
  }
</script>
