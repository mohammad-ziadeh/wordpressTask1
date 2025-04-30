<template>
  <div
    class="am-recurring am-recurring-dates"
    :class="{'editable': editable}"
    :style="{'background-color': customizationForm.formBackgroundColor}"
  >
    <customization-form-header
      v-if="!customization.useGlobalColors[formName]"
      :editable="editable"
      :customization-form="customizationForm"
      @resetForm="resetForm"
      @saveFormEdit="saveFormEdit"
    ></customization-form-header>

    <recurring-dates-heading-form-field
      :language-short-code="languageShortCode"
      :customization="customization"
      :customization-edit="customizationEditDisplay"
      :customization-form="customizationForm"
      :form-field="formStepData.itemsStatic.recurringDatesHeadingFormField"
      @saveEdit="saveFormEdit"
    ></recurring-dates-heading-form-field>

    <recurring-info-form-field
      :language-short-code="languageShortCode"
      :customization="customization"
      :customization-edit="customizationEditDisplay"
      :customization-form="customizationForm"
      :form-field="formStepData.itemsStatic.recurringInfoFormField"
      @saveEdit="saveFormEdit"
    ></recurring-info-form-field>
  </div>
</template>

<script>
import cssColorManipulationMixin from '../../../../js/common/mixins/cssColorManipulationMixin'
import formColorsEditDialog from '../dialogs/FormColorsEditDialog'
import recurringDatesHeadingFormField from '../formFields/RecurringDatesHeadingFormField'
import recurringInfoFormField from '../formFields/RecurringInfoFormField'
import customizationFormHeader from '../parts/CustomizationFormHeader'

export default {
  name: 'recurringDatesForm',

  components: {
    formColorsEditDialog,
    recurringDatesHeadingFormField,
    recurringInfoFormField,
    customizationFormHeader
  },

  props: {
    formName: {
      type: String,
      required: true
    },
    languageShortCode: {
      type: String,
      default: ''
    },
    editable: {
      type: Boolean,
      default: true
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
      resetFormData: this.resetData ? this.resetData[this.$options.name] : {},
      customizationEdit: {
        editable: this.editable,
        reverseBackgroundColorForm: '#ffffff'
      }
    }
  },

  created () {
    this.customizationEdit.reverseBackgroundColorForm = this.oppositeColor(this.formStepData.globalSettings.formBackgroundColor)
  },

  mounted () {},

  computed: {
    customizationEditDisplay () {
      this.customizationEdit.editable = this.editable
      return this.customizationEdit
    }
  },

  methods: {
    resetForm () {
      let resetObj = {}
      resetObj.data = this.resetFormData
      resetObj.formStep = this.$options.name
      this.$emit('resetForm', resetObj)
    },

    saveFormEdit (dataObj) {
      let formObj = {}
      formObj[this.$options.name] = JSON.parse(JSON.stringify(dataObj))

      this.$emit('saveEdit', formObj)
    }
  },

  watch: {
    'formStepData' () {
      this.customizationEdit.reverseBackgroundColorForm = this.oppositeColor(this.formStepData.globalSettings.formBackgroundColor)
    }
  }
}
</script>
