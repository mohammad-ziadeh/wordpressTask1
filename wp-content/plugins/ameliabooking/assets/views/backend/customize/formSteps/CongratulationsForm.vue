<template>
  <div
    class="am-congratulations"
    :class="{'editable': editable}"
    :style="{backgroundColor: formStepData.hasOwnProperty('globalSettings') ? customizationForm.formBackgroundColor : ''}"
  >
    <customization-form-header
      v-if="formStepData.hasOwnProperty('globalSettings') && Object.keys(this.resetData).length && !customization.useGlobalColors[formName]"
      :editable="editable"
      :customization-form="customizationForm"
      @resetForm="resetForm"
      @saveFormEdit="saveFormEdit"
    ></customization-form-header>

    <dialog-event-calendar-heading-form-field
      v-if="customizeDisplay === 'event' && formStepData.itemsStatic.hasOwnProperty('dialogEventCalendarHeadingFormField')"
      :language-short-code="languageShortCode"
      :customization-edit="customizationEditDisplay"
      :customization-form="customizationForm"
      :form-field="formStepData.itemsStatic.dialogEventCalendarHeadingFormField"
      @saveEdit="saveFormEdit"
    ></dialog-event-calendar-heading-form-field>

    <congratulations-heading-form-field
      :language-short-code="languageShortCode"
      :customization="customization"
      :customization-edit="customizationEditDisplay"
      :customization-form="customizationForm"
      :form-field="formStepData.itemsStatic.congratulationsHeadingFormField"
      @saveEdit="saveFormEdit"
    ></congratulations-heading-form-field>

    <congratulations-image-form-field
      :language-short-code="languageShortCode"
      :event-color="eventColor"
      :customize-display="customizeDisplay"
      :customization="customization"
      :customization-edit="customizationEditDisplay"
      :customization-form="customizationForm"
      :form-field="formStepData.itemsStatic.congratulationsImageFormField"
      @saveEdit="saveFormEdit"
    ></congratulations-image-form-field>

    <congratulations-messages-form-field
      :language-short-code="languageShortCode"
      :customization="customization"
      :customization-edit="customizationEditDisplay"
      :customization-form="customizationForm"
      :form-field="formStepData.itemsStatic.congratulationsMessagesFormField"
      @saveEdit="saveFormEdit"
    ></congratulations-messages-form-field>

    <br>

    <add-to-calendar-form-field
      :language-short-code="languageShortCode"
      :event-color="eventColor"
      :customization="customization"
      :customize-display="customizeDisplay"
      :customization-edit="customizationEditDisplay"
      :customization-form="customizationForm"
      :form-field="formStepData.itemsStatic.addToCalendarFormField"
      @saveEdit="saveFormEdit"
    ></add-to-calendar-form-field>

  </div>
</template>

<script>
import cssColorManipulationMixin from '../../../../js/common/mixins/cssColorManipulationMixin'
import customizationFormHeader from '../parts/CustomizationFormHeader'
import dialogEventCalendarHeadingFormField from '../formFields/DialogEventCalendarHeadingFormField'
import congratulationsHeadingFormField from '../formFields/CongratulationsHeadingFormField'
import congratulationsImageFormField from '../formFields/CongratulationsImageFormField'
import congratulationsMessagesFormField from '../formFields/CongratulationsMessagesFormField'
import addToCalendarFormField from '../formFields/AddToCalendarFormField'

export default {
  name: 'congratulationsForm',

  components: {
    customizationFormHeader,
    dialogEventCalendarHeadingFormField,
    congratulationsHeadingFormField,
    congratulationsImageFormField,
    congratulationsMessagesFormField,
    addToCalendarFormField
  },

  props: {
    formName: {
      type: String,
      required: true
    },
    editable: {
      type: Boolean,
      default: true
    },
    languageShortCode: {
      type: String,
      default: ''
    },
    eventColor: {
      type: String,
      default: '#1A84EE'
    },
    customization: {
      type: Object,
      default: () => {
        return {}
      }
    },
    customizeDisplay: {
      type: String,
      default: ''
    },
    customizationForm: {
      type: Object,
      default: () => {
        return {}
      }
    },
    formStepData: {
      type: Object,
      default: () => {
        return {}
      }
    },
    resetData: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },

  mixins: [cssColorManipulationMixin],

  data () {
    return {
      calendarIndex: '',
      calendars: [
        {
          type: 'google',
          label: 'Google Calendar'
        },
        {
          type: 'yahoo',
          label: 'Yahoo! Calendar'
        },
        {
          type: 'ios',
          label: 'iCal Calendar'
        },
        {
          'type': 'outlook',
          'label': 'Outlook Calendar'
        }
      ],
      resetFormData: Object.keys(this.resetData).length ? this.resetData[this.$options.name][this.customizeDisplay] : {},
      customizationEdit: {
        editable: this.editable,
        reverseBackgroundColorForm: this.oppositeColor(this.customizationForm.formBackgroundColor)
      }
    }
  },

  created () {},

  mounted () {},

  computed: {
    customizationEditDisplay () {
      this.customizationEdit.editable = this.editable
      this.customizationEdit.reverseBackgroundColorForm = this.oppositeColor(this.customizationForm.formBackgroundColor)
      return this.customizationEdit
    }
  },

  methods: {
    resetForm () {
      let resetObj = {}
      resetObj.data = this.resetFormData
      resetObj.formStep = this.$options.name
      resetObj.formPart = this.customizeDisplay
      this.$emit('resetForm', resetObj)
    },

    saveFormEdit (dataObj) {
      let formObj = {}
      formObj[this.$options.name] = {}
      formObj[this.$options.name][this.customizeDisplay] = JSON.parse(JSON.stringify(dataObj))

      this.$emit('saveEdit', formObj)
    }
  }
}
</script>
