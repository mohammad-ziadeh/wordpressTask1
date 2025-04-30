<template>
  <div
    :class="$root.settings.customization.forms ? `am-form-${formType}-${formName}` : ''"
    class="am-form-full-wrapper"
  >
    <div class="am-select-service">
      <package-heading-form-field
        :class-identifier="`${formType}-${formName}`"
        :form-field="formsData[formName].itemsStatic.packageHeadingFormField"
      ></package-heading-form-field>

      <!-- Booking Form -->
      <el-form :model="packageForm" ref="booking" :rules="rules" label-position="top">
        <!-- Package Form Field -->
        <package-form-field
          :package-form="packageForm"
          :options="options"
          :fetched="fetched"
          :class-identifier="`${formType}-${formName}`"
          :form-field="formsData[formName].itemsStatic.packageFormField"
          @change="changeFormItem"
        ></package-form-field>
        <!-- /Package Form Field -->

        <!-- Continue -->
        <div class="am-button-wrapper">
          <el-button
            type="primary"
            @click="continuePackage"
          >
            {{ $root.labels.continue }}
          </el-button>
        </div>

      </el-form>
    </div>
  </div>
</template>

<script>
import helperMixin from '../../../../../js/backend/mixins/helperMixin'
import packageHeadingFormField from '../formFields/PackageHeadingFormField'
import packageFormField from '../formFields/PackageFormField'

export default {
  name: 'selectPackageForm',

  components: {
    packageHeadingFormField,
    packageFormField
  },

  props: {
    selectedPackageId: {
      type: Number,
      default: null
    },
    options: {
      type: Object,
      default: function () {
        return {}
      }
    },
    fetched: {
      type: Boolean,
      default: false
    },
    formType: {
      type: String
    },
    formsData: {
      type: Object,
      default: function () {
        return {}
      }
    }
  },

  mixins: [helperMixin],

  data () {
    return {
      formName: this.$options.name,
      packageForm: {
        packageId: null
      },
      rules: {
        packageId: [
          {
            required: true,
            message: this.formErrorMessage(this.formsData[this.$options.name].itemsStatic.packageFormField.labels.package_colon.value, this.$root.labels.package),
            trigger: 'blur',
            type: 'number'
          }
        ]
      }
    }
  },

  created () {
    this.packageForm.packageId = this.selectedPackageId
  },

  methods: {
    continuePackage () {
      this.$refs.booking.validate((valid) => {
        if (!valid) {
          this.$refs.booking.$el.scrollIntoView()
          return false
        }
      })

      this.$emit('continuePackage', this.packageForm.packageId)
    },

    changeFormItem () {
      if (typeof this.$refs.booking !== 'undefined') {
        this.$refs.booking.clearValidate()
      }
    },

    formErrorMessage (customLabel, label) {
      let serviceLabel = customLabel || label
      if (serviceLabel.charAt(serviceLabel.length - 1).match(/:/g)) {
        serviceLabel = serviceLabel.slice(0, -1).toLowerCase()
      } else {
        serviceLabel = serviceLabel.toLowerCase()
      }
      return `${this.$root.labels.please_select} ${serviceLabel}`
    }
  }
}
</script>
