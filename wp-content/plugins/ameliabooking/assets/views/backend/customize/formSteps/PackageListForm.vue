<template>
  <div
    class="am-package-list"
    :class="[{'editable': editable}, responsiveDisplay]"
    :style="{backgroundColor: customizationForm.formBackgroundColor}"
  >
    <customization-form-header
      v-if="!customization.useGlobalColors[formName]"
      :editable="editable"
      :customization-form="customizationForm"
      @resetForm="resetForm"
      @saveFormEdit="saveFormEdit"
    ></customization-form-header>

    <!-- Confirm Dialog Package -->
    <div class="am-confirmation-booking-package-wrapper">

      <!-- Package Header -->
      <div v-if="!catalogLayout" class="am-package-header">

        <!-- Package Header Image Data container -->
        <div class="am-package-header-image-data-wrapper">
          <!-- Package Image -->
          <div class="am-package-image">
            <img :src="pictureLoad(selectedPackage, false)" @error="imageLoadError(selectedPackage, false)"/>
            <span style="background-color: #1A84EE">
              <img :src="$root.getUrl + 'public/img/am-package-catalog.svg'">
            </span>
          </div>
          <!-- /Package Image -->

          <!-- Package Data -->
          <div class="am-package-data">

            <!-- Package Name -->
            <div class="am-package-title">
              <h2 :style="{color: customizationForm.formTextColor}">{{ selectedPackage.name }}</h2>
            </div>
            <!-- /Package Name -->
          </div>
          <!-- /Package Data -->
        </div>
        <!-- /Package Header Image Data container -->

        <!-- Package Price Container -->
        <div class="am-package-price" :style="{backgroundColor: colorTransparency(customization.globalColors.primaryColor, 0.07)}">
          <!-- Package Price -->
          <div class="am-package-price__wrapper" :style="{color: customization.globalColors.primaryColor}">
            {{ getFormattedPrice(selectedPackage.price) }}
          </div>
          <!-- /Package Price -->
        </div>
        <!-- /Package Price Container -->

      </div>
      <!-- /Package Header -->

      <div v-if="!catalogLayout" class="am-package-description" :style="{color: customizationForm.formTextColor, opacity: 0.7}">
        Lorem Ipsum is simply dummy text of the printing and typesetting industry.
        Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,
        when an unknown printer took a galley of type and scrambled it to make a type specimen book.
        It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.
        It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages,
        and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
      </div>

      <package-list-form-field
        :language-short-code="languageShortCode"
        :catalog-layout="catalogLayout"
        :responsive-display="responsiveDisplay"
        :customization="customization"
        :customization-edit="customizationEditDisplay"
        :customization-form="customizationForm"
        :form-field="formStepData.itemsStatic.packageListFormField"
        @saveEdit="saveFormEdit"
      ></package-list-form-field>
    </div>
    <!-- /Confirm Dialog Package -->

    <!-- Confirm Dialog Footer -->
    <div class="am-package-buttons">
      <div
        class="el-button el-button--default"
        :style="{color: customization.textColor}"
        @mouseenter="mouseEnterDefault"
        @mouseleave="mouseLeaveDefault"
      >
        {{ $root.labels.back }}
      </div>

      <div
        class="el-button el-button--primary"
        :style="{backgroundColor: customization.globalColors.primaryColor, borderColor: customization.globalColors.primaryColor, color: customization.globalColors.textColorOnBackground}"
        @mouseenter="mouseEnterPrimary"
        @mouseleave="mouseLeavePrimary"
      >
        {{ $root.labels.continue }}
      </div>
    </div>
    <!-- /Confirm Dialog Footer -->
  </div>
</template>

<script>
import imageMixin from '../../../../js/common/mixins/imageMixin'
import priceMixin from '../../../../js/common/mixins/priceMixin'
import packageListFormField from '../formFields/PackageListFormField'
import cssColorManipulationMixin from '../../../../js/common/mixins/cssColorManipulationMixin'
import formColorsEditDialog from '../dialogs/FormColorsEditDialog'
import customizationFormHeader from '../parts/CustomizationFormHeader'

export default {
  name: 'packageListForm',

  components: {
    packageListFormField,
    formColorsEditDialog,
    customizationFormHeader
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
    catalogLayout: {
      type: Boolean,
      default: false
    },
    responsiveDisplay: {
      type: String,
      default: 'am-desktop'
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

  mixins: [cssColorManipulationMixin, imageMixin, priceMixin],

  data () {
    return {
      resetFormData: this.resetData ? this.resetData[this.$options.name] : {},
      customizationEdit: {
        editable: this.editable,
        reverseBackgroundColorForm: this.oppositeColor(this.customizationForm.formBackgroundColor)
      },
      selectedPackage: {
        name: 'Package name',
        pictureThumbPath: `${this.$root.getUrl}public/img/default-service.svg`,
        price: 125,
        discount: 0,
        calculatedPrice: true
      }
    }
  },

  created () {},

  mounted () {
    this.inlineSVG()
  },

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

    mouseEnterDefault (a) {
      let style = {
        color: this.customization.globalColors.primaryColor,
        borderColor: this.colorTransparency(this.customization.globalColors.primaryColor, 0.1),
        backgroundColor: this.colorTransparency(this.customization.globalColors.primaryColor, 0.1)
      }

      Object.assign(a.target.style, style)
    },

    mouseLeaveDefault (a) {
      let style = {
        color: this.customization.textColor,
        borderColor: '#DCDFE6',
        backgroundColor: '#FFFFFF'
      }

      Object.assign(a.target.style, style)
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
