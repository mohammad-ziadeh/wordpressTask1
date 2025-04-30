<template>
  <!-- Event List -->
  <div class="am-event-list" style="opacity: 1; pointer-events: all;">
    <event-details-form-field
      :form-name="formName"
      :editable="editable"
      :language-short-code="languageShortCode"
      :active-form-tab="activeFormTab"
      :opposite-background-color="oppositeBackgroundColor"
      :customization="customization"
      :customization-form="customizationForm"
      :form-field="formData[$options.name].itemsStatic.eventDetailsFormField"
      :form-step-data="formData"
      @saveEdit="saveFormFieldEdit"
      @saveStepEdit="saveStepEdit"
      @saveDraggableEdit="saveDraggableEdit"
    ></event-details-form-field>
  </div>
  <!-- /Event List -->
</template>

<script>
import eventDetailsFormField from '../formFields/EventDetailsFormField'

export default {
  name: 'eventDetailsForm',

  components: {
    eventDetailsFormField
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
    activeFormTab: {
      type: String
    },
    oppositeBackgroundColor: {
      type: String,
      default: '#000'
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
    formData: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },

  methods: {
    saveFormFieldEdit (objData) {
      let formData = {}
      formData[this.$options.name] = {}
      formData[this.$options.name] = JSON.parse(JSON.stringify(objData))
      this.$emit('saveEdit', formData)
    },

    saveStepEdit (objData) {
      this.$emit('saveEdit', objData)
    },

    saveDraggableEdit (objData) {
      this.$emit('saveDraggableEdit', objData)
    }
  }
}
</script>
