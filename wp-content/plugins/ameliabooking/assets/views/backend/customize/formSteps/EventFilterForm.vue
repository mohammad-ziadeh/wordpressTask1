<template>
  <div class="am-events-filter">
    <event-filter-form-field
      :editable="editable"
      :language-short-code="languageShortCode"
      :customization="customization"
      :customization-form="customizationForm"
      :form-field="formData.itemsStatic.eventFilterFormField"
      @saveEdit="saveFormFieldEdit"
    ></event-filter-form-field>
  </div>
</template>

<script>
import eventFilterFormField from '../formFields/EventFilterFormField'

export default {
  name: 'eventFilterForm',

  components: {
    eventFilterFormField
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
    editable: {
      type: Boolean,
      default: true
    },
    oppositeBackgroundColor: {
      type: String,
      default: '#000'
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
    }
  }
}
</script>
