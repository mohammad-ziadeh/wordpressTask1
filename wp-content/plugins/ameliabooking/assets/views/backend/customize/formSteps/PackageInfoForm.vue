<template>
  <div
    class="am-package-info"
    :class="{'editable': editable}"
    :style="{backgroundColor: customizationForm.formBackgroundColor}"
  >
    <customization-form-header
      v-if="!customization.useGlobalColors[formName]"
      :editable="editable"
      :customization-form="customizationForm"
      @resetForm="resetForm"
      @saveFormEdit="saveFormEdit"
    ></customization-form-header>

    <div class="am-package-info__inner">

      <package-info-form-field
        :language-short-code="languageShortCode"
        :customization="customization"
        :customization-edit="customizationEditDisplay"
        :customization-form="customizationForm"
        :form-field="formStepData.itemsStatic.packageInfoFormField"
        @saveEdit="saveFormEdit"
      ></package-info-form-field>
    </div>
  </div>
</template>

<script>
import cssColorManipulationMixin from '../../../../js/common/mixins/cssColorManipulationMixin'
import packageInfoFormField from '../formFields/PackageInfoFormField'
import customizationFormHeader from '../parts/CustomizationFormHeader'

export default {
  name: 'packageInfoForm',

  components: {
    packageInfoFormField,
    customizationFormHeader
  },

  mixins: [cssColorManipulationMixin],

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

  data () {
    return {
      resetFormData: this.resetData ? this.resetData[this.$options.name] : {},
      customizationEdit: {
        editable: this.editable,
        reverseBackgroundColorForm: this.oppositeColor(this.customizationForm.formBackgroundColor)
      }
    }
  },

  created () {},

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
      this.$emit('resetForm', resetObj)
    },

    saveFormEdit (dataObj) {
      let formObj = {}
      formObj[this.$options.name] = JSON.parse(JSON.stringify(dataObj))

      this.$emit('saveEdit', formObj)
    }
  }
}
</script>
