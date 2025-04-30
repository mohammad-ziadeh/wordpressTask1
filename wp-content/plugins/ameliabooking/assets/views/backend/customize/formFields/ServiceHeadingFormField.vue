<template>
  <div
    v-show="customizationEdit.editable ? customizationEdit.editable : componentDisplay()"
    class="am-customize-field"
    :class="{'editable': customizationEdit.editable}"
    :style="{borderColor: customizationEdit.reverseBackgroundColorForm}"
  >
    <p v-if="!catalogLayout" class="am-service-form-heading" :style="{ 'color': customizationForm.formTextColor }">
      <template v-if="!languageShortCode">
        {{ formServiceHeading.value || `${$root.labels.please_select_service}:` }}
      </template>
      <template v-else>
        {{ formServiceHeading.translations[languageShortCode] || `${$root.labels.please_select_service}:` }}
      </template>
    </p>

    <p v-if="catalogLayout" class="am-service-form-heading" :style="{ 'color': customizationForm.formTextColor }">
      <template v-if="!languageShortCode">
        {{ formServiceHeading.value || `${$root.labels.book_appointment}` }}
      </template>
      <template v-else>
        {{ formServiceHeading.translations[languageShortCode] || `${$root.labels.book_appointment}` }}
      </template>
    </p>

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
    name: 'serviceHeadingFormField',

    components: {
      customizeEditDialog
    },

    props: {
      languageShortCode: {
        type: String,
        default: ''
      },
      catalogLayout: {
        type: Boolean,
        default: false
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
        formServiceHeading: this.catalogLayout ? this.formField.labels.book_appointment : this.formField.labels.please_select_service
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
        this.formServiceHeading = this.catalogLayout ? this.formField.labels.book_appointment : this.formField.labels.please_select_service
      }
    }
  }
</script>
