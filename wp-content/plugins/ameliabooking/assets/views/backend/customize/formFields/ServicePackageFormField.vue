<template>
  <!-- Service Package -->
  <div
    v-if="$root.licence.isPro || $root.licence.isDeveloper"
    v-show="customizationEdit.editable ? customizationEdit.editable : componentDisplay()"
    class="am-customize-field"
    :class="{'editable': customizationEdit.editable}"
    :style="{borderColor: customizationEdit.reverseBackgroundColorForm}"
  >
    <div
      class="am-package"
      :style="{
        backgroundColor: colorTransparency(customization.globalColors.primaryColor, 0.05),
        borderColor: customization.globalColors.primaryColor
      }"
    >
      <el-row>
        <el-col :span="16" class="am-package-name">
          <p class="am-gray-text" :style="{ 'color': customizationForm.formTextColor }">
            <template v-if="!languageShortCode">
              {{ labelAvailableInPackage.value || $root.labels.package_available }}
            </template>
            <template v-else>
              {{ labelAvailableInPackage.translations[languageShortCode] || $root.labels.package_available }}
            </template>
          </p>
          <p class="am-large-text" :style="{ 'color': customizationForm.formTextColor }">
            {{ $root.labels.package_name }}
          </p>
        </el-col>

        <el-col :span="8" class="am-package-price">
          <p class="am-large-text" :style="{color: customization.globalColors.primaryColor}">
            $125.00
          </p>
          <p class="am-discount-text" :style="{color: customization.globalColors.primaryColor}">
            <template v-if="!languageShortCode">
              {{ (labelDiscount.value || $root.labels.package_discount_text) + ' 10%'}}
            </template>
            <template v-else>
              {{ (labelDiscount.translations[languageShortCode] || $root.labels.package_discount_text) + ' 10%'}}
            </template>
          </p>
        </el-col>
      </el-row>

      <el-row class="am-package-services">
        <el-col :span="19">
          <p :style="{ 'color': customizationForm.formTextColor }">
            {{ $root.labels.service_name }}
          </p>
        </el-col>

        <el-col :span="3">
          <p class="am-package-appointment-number" :style="{color: customization.globalColors.primaryColor}">
            x9
          </p>
        </el-col>

        <el-col :span="2" class="am-package-book">
          <i class="el-icon-right" :style="{color: customization.globalColors.primaryColor}"></i>
        </el-col>
      </el-row>
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
    <span v-if="customizationEdit.editable" class="am-customize-drag-handle">
      <img :src="$root.getUrl + 'public/img/am-customize-icon-drag-handle.svg'"/>
    </span>
  </div>
  <!-- /Service Package -->
</template>

<script>
  import customizeEditDialog from '../dialogs/CustomizeEditDialog'
  import cssColorManipulationMixin from '../../../../js/common/mixins/cssColorManipulationMixin'

  export default {
    name: 'servicePackageFormField',

    components: {
      customizeEditDialog
    },

    mixins: [cssColorManipulationMixin],

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
        default: () => {
          return {}
        },
        type: Object
      }
    },

    data () {
      return {
        labelAvailableInPackage: this.formField.labels.package_available,
        labelDiscount: this.formField.labels.package_discount_text
      }
    },

    methods: {
      componentDisplay () {
        if (this.formField.hasOwnProperty('visibility')) {
          return this.formField.visibility
        }

        return true
      },

      saveFormFiledEdit (objData) {
        let fieldData = {}
        fieldData['itemsDraggable'] = {}
        fieldData['itemsDraggable'][this.$options.name] = JSON.parse(JSON.stringify(objData))
        this.$emit('saveEdit', fieldData)
      }
    },

    watch: {
      'formField' () {
        this.labelAvailableInPackage = this.formField.labels.package_available
        this.labelDiscount = this.formField.labels.package_discount_text
      }
    }
  }
</script>
