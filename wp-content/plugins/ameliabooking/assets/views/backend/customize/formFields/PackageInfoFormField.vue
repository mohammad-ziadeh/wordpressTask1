<template>
  <!-- Package info -->
  <div
    v-show="customizationEdit.editable ? customizationEdit.editable : componentDisplay()"
    class="am-customize-field"
    :class="{'editable': customizationEdit.editable}"
    :style="{borderColor: customizationEdit.reverseBackgroundColorForm}"
  >
    <!-- Package Header -->
    <div class="am-package-header">

      <!-- Package Header Image Data container -->
      <div class="am-package-header-image-data-wrapper">
        <!-- Package Image -->
        <div class="am-package-image">
          <img :src="pictureLoad(selectedPackage, false)" @error="imageLoadError(selectedPackage, false)"/>
          <span style="{background-color: #1A84EE}">
            <img :src="$root.getUrl + 'public/img/am-package-catalog.svg'">
          </span>
        </div>
        <!-- /Package Image -->

        <!-- Package Data -->
        <div class="am-package-data">
          <!-- Package Name -->
          <div class="am-package-title">
            <h2 :style="{color: customizationForm.formTextColor}">
              {{ selectedPackage.name }}
            </h2>
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

        <!-- Package Discount -->
        <div v-if="selectedPackage.discount && !selectedPackage.calculatedPrice" class="am-package-price__discount">
          <img class="am-package-price__discount-image" :src="$root.getUrl + 'public/img/am-package-catalog.svg'">
          <div class="am-package-price__discount-text">
            {{ $root.labels.package_discount_text + ' ' + selectedPackage.discount + '%' }}
          </div>
        </div>
        <!-- /Package Discount -->
      </div>
      <!-- /Package Price Container -->

    </div>
    <!-- /Package Header -->

    <div class="am-package-rule">
      <div>
        <span :style="{color: customizationForm.formTextColor}">
          <i class="el-icon-date" :style="{color: customizationForm.formTextColor}"></i> {{ $root.labels.package_book_service }}
        </span>
      </div>
    </div>

    <div class="am-package-description" :style="{color: customizationForm.formTextColor, opacity: 0.7}">
      Lorem Ipsum is simply dummy text of the printing and typesetting industry.
      Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,
      when an unknown printer took a galley of type and scrambled it to make a type specimen book.
      It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.
      It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages,
      and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
    </div>

    <el-row>
      <el-col :span="16" class="am-package-service">
        <div class="am-package-service__inner">
        <span class="am-package-service__name" :style="{color: customizationForm.formTextColor}">
          {{ $root.labels.service_name }}
        </span>
          <span class="am-package-service__quantity" :style="{color: customization.globalColors.primaryColor, backgroundColor: colorTransparency(customization.globalColors.primaryColor, 0.1)}">
          x5
        </span>
        </div>
        <div class="am-package-service__employee">
          <svg width="17" height="12" viewBox="0 0 17 12" :fill="customizationForm.formTextColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M14.3125 5.3125C15.4297 5.3125 16.3438 4.42383 16.3438 3.28125C16.3438 2.16406 15.4297 1.25 14.3125 1.25C13.1699 1.25 12.2812 2.16406 12.2812 3.28125C12.2812 4.42383 13.1699 5.3125 14.3125 5.3125ZM14.3125 2.46875C14.7441 2.46875 15.125 2.84961 15.125 3.28125C15.125 3.73828 14.7441 4.09375 14.3125 4.09375C13.8555 4.09375 13.5 3.73828 13.5 3.28125C13.5 2.84961 13.8555 2.46875 14.3125 2.46875ZM2.9375 5.3125C4.05469 5.3125 4.96875 4.42383 4.96875 3.28125C4.96875 2.16406 4.05469 1.25 2.9375 1.25C1.79492 1.25 0.90625 2.16406 0.90625 3.28125C0.90625 4.42383 1.79492 5.3125 2.9375 5.3125ZM2.9375 2.46875C3.36914 2.46875 3.75 2.84961 3.75 3.28125C3.75 3.73828 3.36914 4.09375 2.9375 4.09375C2.48047 4.09375 2.125 3.73828 2.125 3.28125C2.125 2.84961 2.48047 2.46875 2.9375 2.46875ZM12.9922 7.82617C12.2812 6.81055 10.9355 6.4043 9.74219 6.78516C9.38672 6.88672 9.00586 6.9375 8.59961 6.9375C8.21875 6.9375 7.83789 6.88672 7.48242 6.78516C6.28906 6.4043 4.91797 6.78516 4.23242 7.82617C3.92773 8.30859 3.72461 8.86719 3.72461 9.47656V10.5938C3.72461 11.2793 4.2832 11.8125 4.94336 11.8125H12.2559C12.9414 11.8125 13.4746 11.2793 13.4746 10.5938V9.47656C13.5 8.86719 13.2969 8.30859 12.9922 7.82617ZM12.2812 10.5938H4.96875V9.47656C4.96875 8.53711 5.70508 7.77539 6.61914 7.75C7.25391 8.0293 7.93945 8.15625 8.625 8.15625C9.28516 8.15625 9.9707 8.0293 10.6055 7.75C11.5195 7.77539 12.2812 8.53711 12.2812 9.47656V10.5938ZM14.6172 6.125H14.0078C13.5508 6.125 13.1445 6.27734 12.8145 6.50586C13.1445 6.75977 13.4492 7.06445 13.6777 7.41992C13.7793 7.39453 13.8809 7.34375 13.9824 7.34375H14.5918C15.0996 7.34375 15.5059 7.77539 15.5059 8.25781C15.5059 8.61328 15.7852 8.86719 16.1152 8.86719C16.4707 8.86719 16.7246 8.61328 16.7246 8.25781C16.75 7.08984 15.7852 6.125 14.6172 6.125ZM8.625 6.125C10.1738 6.125 11.4688 4.85547 11.4688 3.28125C11.4688 1.73242 10.1738 0.4375 8.625 0.4375C7.05078 0.4375 5.78125 1.73242 5.78125 3.28125C5.78125 4.85547 7.05078 6.125 8.625 6.125ZM8.625 1.65625C9.51367 1.65625 10.25 2.39258 10.25 3.28125C10.25 4.19531 9.51367 4.90625 8.625 4.90625C7.71094 4.90625 7 4.19531 7 3.28125C7 2.39258 7.71094 1.65625 8.625 1.65625ZM4.41016 6.50586C4.08008 6.27734 3.67383 6.125 3.24219 6.125H2.63281C1.43945 6.125 0.5 7.08984 0.5 8.25781C0.5 8.61328 0.753906 8.86719 1.10938 8.86719C1.43945 8.86719 1.71875 8.61328 1.71875 8.25781C1.71875 7.77539 2.125 7.34375 2.63281 7.34375H3.24219C3.34375 7.34375 3.44531 7.39453 3.54688 7.41992C3.77539 7.06445 4.08008 6.75977 4.41016 6.50586Z" fill=""/>
          </svg>

          <span :style="{color: customizationForm.formTextColor}">
          1
        </span>
          <span :style="{color: customizationForm.formTextColor}">
          <template v-if="!languageShortCode">
            {{ labelEmployee.value || $root.labels.employee }}
          </template>
          <template v-else>
            {{ labelEmployee.translations[languageShortCode] || $root.labels.employee }}
          </template>
        </span>
        </div>
      </el-col>
    </el-row>

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
  <!-- /Package info -->
</template>

<script>
import imageMixin from '../../../../js/common/mixins/imageMixin'
import priceMixin from '../../../../js/common/mixins/priceMixin'
import cssColorManipulationMixin from '../../../../js/common/mixins/cssColorManipulationMixin'
import customizeEditDialog from '../dialogs/CustomizeEditDialog'

export default {
  name: 'packageInfoFormField',

  components: {
    customizeEditDialog
  },

  mixins: [imageMixin, priceMixin, cssColorManipulationMixin],

  props: {
    languageShortCode: {
      type: String,
      default: ''
    },
    customization: {
      type: Object
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
      labelEmployee: this.formField.labels.employee,
      selectedPackage: {
        name: 'Package name',
        pictureThumbPath: `${this.$root.getUrl}public/img/default-service.svg`,
        price: 125,
        discount: 0,
        calculatedPrice: true
      }
    }
  },

  methods: {
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
      this.labelEmployee = this.formField.labels.employee
    }
  }
}
</script>
