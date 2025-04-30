<template>
  <div
    class="am-select-package"
    :class="{'editable': editable}"
    :style="{backgroundColor: customizationForm.formBackgroundColor}"
  >
    <div class="am-select-package__inner">
      <customization-form-header
        v-if="!customization.useGlobalColors[formName]"
        :editable="editable"
        :customization-form="customizationForm"
        @resetForm="resetForm"
        @saveFormEdit="saveFormEdit"
      ></customization-form-header>

      <package-heading-form-field
        :language-short-code="languageShortCode"
        :customization="customization"
        :customization-edit="customizationEditDisplay"
        :customization-form="customizationForm"
        :form-field="formStepData.itemsStatic.packageHeadingFormField"
        @saveEdit="saveFormEdit"
      ></package-heading-form-field>

      <!-- Booking Form -->
      <el-form label-position="top">
        <package-form-field
          :language-short-code="languageShortCode"
          :customization="customization"
          :customization-edit="customizationEdit"
          :customization-form="customizationForm"
          :form-field="formStepData.itemsStatic.packageFormField"
          @saveEdit="saveFormEdit"
        ></package-form-field>
      </el-form>

      <!-- Confirm Dialog Footer -->
      <div class="dialog-footer">
        <div
          class="el-button el-button--primary"
          :style="{backgroundColor: customization.globalColors.primaryColor, borderColor: customization.globalColors.primaryColor, color: customization.globalColors.textColorOnBackground}"
          @mouseenter="mouseEnterPrimary"
          @mouseleave="mouseLeavePrimary"
        >
          <span>{{ $root.labels.confirm }}</span>
        </div>
      </div>
      <!-- /Confirm Dialog Footer -->
    </div>
  </div>
</template>

<script>
import cssColorManipulationMixin from '../../../../js/common/mixins/cssColorManipulationMixin'
import packageFormField from '../formFields/PackageFormField'
import packageHeadingFormField from '../formFields/PackageHeadingFormField'
import formColorsEditDialog from '../dialogs/FormColorsEditDialog'
import customizationFormHeader from '../parts/CustomizationFormHeader'

export default {
  name: 'selectPackageForm',

  components: {
    packageFormField,
    packageHeadingFormField,
    formColorsEditDialog,
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
      this.$emit('resetForm', resetObj)
    },

    mouseEnterPrimary (a) {
      a.target.style.backgroundColor = this.colorTransparency(this.customization.globalColors.primaryColor, 0.75)
      a.target.style.borderColor = this.colorTransparency(this.customization.globalColors.primaryColor, 0.75)
    },

    mouseLeavePrimary (a) {
      a.target.style.backgroundColor = this.customization.globalColors.primaryColor
      a.target.style.borderColor = this.customization.globalColors.primaryColor
    },

    saveFormEdit (dataObj) {
      let formObj = {}
      formObj[this.$options.name] = JSON.parse(JSON.stringify(dataObj))

      this.$emit('saveEdit', formObj)
    }
  }
}
</script>
