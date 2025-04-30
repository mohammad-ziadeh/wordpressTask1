<template>
  <div
    v-show="customizationEdit.editable ? customizationEdit.editable : componentDisplay()"
    class="am-customize-field"
    :class="{'editable': customizationEdit.editable}"
    :style="{borderColor: customizationEdit.reverseBackgroundColorForm}"
  >
    <p class="am-recurring-form-heading" :style="{ 'color': customizationForm.formTextColor }">
      <template v-if="!languageShortCode">
        {{ recurringHeadingLabel.value || `${$root.labels.recurring_appointments}:` }}
      </template>
      <template v-else>
        {{ recurringHeadingLabel.translations[languageShortCode] || `${$root.labels.recurring_appointments}:` }}
      </template>
    </p>

    <p class="am-recurring-form-subheading" :style="{ 'color': customizationForm.formTextColor }">
      <template v-if="!languageShortCode">
        {{ recurringSubheadingLabel.value || `${$root.labels.recurring_edit}:` }}
      </template>
      <template v-else>
        {{ recurringSubheadingLabel.translations[languageShortCode] || `${$root.labels.recurring_edit}:` }}
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
  name: 'recurringDatesHeadingFormField',

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
      recurringHeadingLabel: this.formField.labels.recurring_appointments,
      recurringSubheadingLabel: this.formField.labels.recurring_edit
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
      this.recurringHeadingLabel = this.formField.labels.recurring_appointments
      this.recurringSubheadingLabel = this.formField.labels.recurring_edit
    }
  }
}
</script>