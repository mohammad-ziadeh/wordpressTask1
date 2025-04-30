<template>
  <div class="am-customize-step" ref="customizeContainer">
    <!-- Step By Step -->
    <el-tabs v-if="customizeDisplay === 'appointment'" v-model="activeServiceStep" :tab-position="stepNavigation">
      <!-- STEP BY STEP - SERVICE MODE - STEP 1 -->
      <el-tab-pane name="1">
        <span slot="label" class="am-customize-step__item">
          <img :src="$root.getUrl+'public/img/am-customize-step-1.svg'">
          <p>Step 1</p>
        </span>
        <div class="am-step-booking am-active-picker" :style="{ 'fontFamily': customization.font }">
          <!-- Select Service -->
          <select-service-form
            :form-name="$options.name"
            :editable="editable"
            :language-short-code="languageShortCode"
            :customization="customization"
            :customization-form="customization.useGlobalColors[$options.name] ? customization.globalColors : formTypeData.selectServiceForm.globalSettings"
            :form-step-data="formTypeData.selectServiceForm"
            :reset-data="resetData"
            @resetForm="resetForm"
            @saveDraggableEdit="saveDraggableEdit"
            @saveEdit="saveStepEdit"
          ></select-service-form>
          <!-- /Select Service -->

          <!-- Pick Date & Time -->
          <calendar-date-time-form
            :form-name="$options.name"
            :editable="editable"
            :language-short-code="languageShortCode"
            :customization="customization"
            :customization-form="customization.useGlobalColors[$options.name] ? customization.globalColors : formTypeData.calendarDateTimeForm.globalSettings"
            :form-step-data="formTypeData.calendarDateTimeForm"
            :reset-data="resetData"
            @resetForm="resetForm"
            @saveEdit="saveStepEdit"
          ></calendar-date-time-form>
          <!-- /Pick Date & Time -->
        </div>
      </el-tab-pane>
      <!-- /STEP BY STEP - SERVICE MODE - STEP 1 -->

      <!-- STEP BY STEP - SERVICE MODE - STEP 2 -->
      <el-tab-pane name="2">
        <span slot="label" class="am-customize-step__item">
          <img :src="$root.getUrl+'public/img/am-customize-step-2.svg'">
          <p>Step 2</p>
        </span>
        <div class="am-step-booking am-active-picker" :style="{ 'fontFamily': customization.font }">
          <!-- Select Service -->
          <select-service-form
            :form-name="$options.name"
            :editable="false"
            :language-short-code="languageShortCode"
            :customization="customization"
            :customization-form="customization.useGlobalColors[$options.name] ? customization.globalColors : formTypeData.selectServiceForm.globalSettings"
            :form-step-data="formTypeData.selectServiceForm"
            :reset-data="resetData"
            @resetForm="resetForm"
            @saveDraggableEdit="saveDraggableEdit"
            @saveEdit="saveStepEdit"
          ></select-service-form>
          <!-- /Select Service -->

          <!-- Recurring Setup Form -->
          <recurring-setup-form
            :form-name="$options.name"
            :editable="editable"
            :language-short-code="languageShortCode"
            :customization="customization"
            :customization-form="customization.useGlobalColors[$options.name] ? customization.globalColors : formTypeData.recurringSetupForm.globalSettings"
            :form-step-data="formTypeData.recurringSetupForm"
            :reset-data="resetData"
            @resetForm="resetForm"
            @saveEdit="saveStepEdit"
          ></recurring-setup-form>
          <!-- /Recurring Setup Form -->
        </div>

      </el-tab-pane>
      <!-- /STEP BY STEP - SERVICE MODE - STEP 2 -->

      <!-- STEP BY STEP - SERVICE MODE - STEP 3 -->
      <el-tab-pane name="3">
        <span slot="label" class="am-customize-step__item">
          <img :src="$root.getUrl+'public/img/am-customize-step-2.svg'">
          <p>Step 3</p>
        </span>
        <div class="am-step-booking" :style="{ 'fontFamily': customization.font }">
          <!-- Recurring Setup Form -->
          <recurring-setup-form
            :form-name="$options.name"
            class="next-step"
            :editable="false"
            :language-short-code="languageShortCode"
            :customization="customization"
            :customization-form="customization.useGlobalColors[$options.name] ? customization.globalColors : formTypeData.recurringSetupForm.globalSettings"
            :form-step-data="formTypeData.recurringSetupForm"
            :reset-data="resetData"
            @resetForm="resetForm"
            @saveEdit="saveStepEdit"
          ></recurring-setup-form>
          <!-- /Recurring Setup Form -->

          <!-- Recurring Dates Form -->
          <recurring-dates-form
            :form-name="$options.name"
            :editable="editable"
            :language-short-code="languageShortCode"
            :customization="customization"
            :customization-form="customization.useGlobalColors[$options.name] ? customization.globalColors : formTypeData.recurringDatesForm.globalSettings"
            :form-step-data="formTypeData.recurringDatesForm"
            :reset-data="resetData"
            @resetForm="resetForm"
            @saveEdit="saveStepEdit"
          ></recurring-dates-form>
          <!-- /Recurring Dates Form -->
        </div>

      </el-tab-pane>
      <!-- /STEP BY STEP - SERVICE MODE - STEP 3 -->

      <!-- STEP BY STEP - SERVICE MODE - STEP 4 -->
      <el-tab-pane name="4">
        <span slot="label" class="am-customize-step__item">
          <img :src="$root.getUrl+'public/img/am-customize-step-2.svg'">
          <p>Step 4</p>
        </span>
        <div class="am-step-booking" :style="{ 'fontFamily': customization.font }">
          <!-- Pick Date & Time -->
          <calendar-date-time-form
            :form-name="$options.name"
            class="next-step"
            :editable="false"
            :language-short-code="languageShortCode"
            :customization="customization"
            :customization-form="customization.useGlobalColors[$options.name] ? customization.globalColors : formTypeData.calendarDateTimeForm.globalSettings"
            :form-step-data="formTypeData.calendarDateTimeForm"
            :reset-data="resetData"
            @resetForm="resetForm"
            @saveEdit="saveStepEdit"
          ></calendar-date-time-form>
          <!-- /Pick Date & Time -->

          <!-- Confirm Booking Form -->
          <confirm-booking-form
            :form-name="$options.name"
            :editable="editable"
            :language-short-code="languageShortCode"
            :customization="customization"
            :customize-display="customizeDisplay"
            :customization-form="customization.useGlobalColors[$options.name] ? customization.globalColors : formTypeData.confirmBookingForm[customizeDisplay].globalSettings"
            :form-step-data="formTypeData.confirmBookingForm[customizeDisplay]"
            :reset-data="resetData"
            @resetForm="resetForm"
            @saveEdit="saveStepEdit"
            @saveDraggableEdit="saveDraggableEdit"
          ></confirm-booking-form>
          <!-- /Confirm Booking Form -->
        </div>

      </el-tab-pane>
      <!-- /STEP BY STEP - SERVICE MODE - STEP 4 -->

      <!-- STEP BY STEP - SERVICE MODE - STEP 5 -->
      <el-tab-pane name="5">
        <span slot="label" class="am-customize-step__item">
          <img :src="$root.getUrl+'public/img/am-customize-step-2.svg'">
          <p>Step 5</p>
        </span>
        <div class="am-step-booking" :style="{ 'fontFamily': customization.font }">
          <!-- Congratulations Form -->
          <congratulations-form
            :form-name="$options.name"
            :editable="editable"
            :language-short-code="languageShortCode"
            :customization="customization"
            :customize-display="customizeDisplay"
            :customization-form="customization.useGlobalColors[$options.name] ? customization.globalColors : formTypeData.congratulationsForm[customizeDisplay].globalSettings"
            :form-step-data="formTypeData.congratulationsForm[customizeDisplay]"
            :reset-data="resetData"
            @resetForm="resetForm"
            @saveEdit="saveStepEdit"
          ></congratulations-form>
          <!-- /Congratulations Form -->
        </div>

      </el-tab-pane>
      <!-- /STEP BY STEP - SERVICE MODE - STEP 5 -->
    </el-tabs>

    <el-tabs v-if="customizeDisplay === 'package'" v-model="activePackageStep" :tab-position="stepNavigation">
      <!-- STEP BY STEP - PACKAGE MODE - STEP 1 -->
      <el-tab-pane name="1">
        <span slot="label" class="am-customize-step__item">
          <img :src="$root.getUrl+'public/img/am-customize-step-2.svg'">
          <p>Step 1</p>
        </span>
        <div class="am-step-booking" :style="{ 'fontFamily': customization.font }">
          <!-- Select Package Form -->
          <select-package-form
            :form-name="$options.name"
            :editable="editable"
            :language-short-code="languageShortCode"
            :customization="customization"
            :customization-form="customization.useGlobalColors[$options.name] ? customization.globalColors : formTypeData.selectPackageForm.globalSettings"
            :form-step-data="formTypeData.selectPackageForm"
            :reset-data="resetData"
            @resetForm="resetForm"
            @saveEdit="saveStepEdit"
          ></select-package-form>
          <!-- /Select Package Form -->

          <!-- Pick Date & Time -->
          <package-setup-form
            :form-name="$options.name"
            :editable="false"
            :language-short-code="languageShortCode"
            :customization="customization"
            :customization-form="customization.useGlobalColors[$options.name] ? customization.globalColors : formTypeData.packageSetupForm.globalSettings"
            :form-step-data="formTypeData.packageSetupForm"
            :reset-data="resetData"
            @resetForm="resetForm"
            @saveEdit="saveStepEdit"
          ></package-setup-form>
          <!-- /Pick Date & Time -->
        </div>
      </el-tab-pane>
      <!-- /STEP BY STEP - PACKAGE MODE - STEP 1 -->

      <!-- STEP BY STEP - PACKAGE MODE - STEP 2 -->
      <el-tab-pane name="2">
        <span slot="label" class="am-customize-step__item">
          <img :src="$root.getUrl+'public/img/am-customize-step-2.svg'">
          <p>Step 2</p>
        </span>
        <div class="am-step-booking" :style="{ 'fontFamily': customization.font }">
          <!-- Select Package Form -->
          <package-info-form
            :form-name="$options.name"
            :editable="editable"
            :language-short-code="languageShortCode"
            :customization="customization"
            :customization-form="customization.useGlobalColors[$options.name] ? customization.globalColors : formTypeData.packageInfoForm.globalSettings"
            :form-step-data="formTypeData.packageInfoForm"
            :reset-data="resetData"
            @resetForm="resetForm"
            @saveEdit="saveStepEdit"
          ></package-info-form>
          <!-- /Select Package Form -->

          <!-- Pick Date & Time -->
          <package-setup-form
            :form-name="$options.name"
            :editable="false"
            :language-short-code="languageShortCode"
            :customization="customization"
            :customization-form="customization.useGlobalColors[$options.name] ? customization.globalColors : formTypeData.packageSetupForm.globalSettings"
            :form-step-data="formTypeData.packageSetupForm"
            :reset-data="resetData"
            @resetForm="resetForm"
            @saveEdit="saveStepEdit"
          ></package-setup-form>
          <!-- /Pick Date & Time -->
        </div>
      </el-tab-pane>
      <!-- /STEP BY STEP - PACKAGE MODE - STEP 2 -->

      <!-- STEP BY STEP - PACKAGE MODE - STEP 3 -->
      <el-tab-pane name="3">
        <span slot="label" class="am-customize-step__item">
          <img :src="$root.getUrl+'public/img/am-customize-step-1.svg'">
          <p>Step 3</p>
        </span>
        <div class="am-step-booking am-active-picker" :style="{ 'fontFamily': customization.font }">
          <!-- Select Package Form -->
          <package-info-form
            :form-name="$options.name"
            :editable="false"
            :language-short-code="languageShortCode"
            :customization="customization"
            :customization-form="customization.useGlobalColors[$options.name] ? customization.globalColors :  formTypeData.packageInfoForm.globalSettings"
            :form-step-data="formTypeData.packageInfoForm"
            :reset-data="resetData"
            @resetForm="resetForm"
            @saveEdit="saveStepEdit"
          ></package-info-form>
          <!-- /Select Package Form -->

          <!-- Pick Date & Time -->
          <package-setup-form
            :form-name="$options.name"
            :editable="editable"
            :language-short-code="languageShortCode"
            :customization="customization"
            :customization-form="customization.useGlobalColors[$options.name] ? customization.globalColors : formTypeData.packageSetupForm.globalSettings"
            :form-step-data="formTypeData.packageSetupForm"
            :reset-data="resetData"
            @resetForm="resetForm"
            @saveEdit="saveStepEdit"
          ></package-setup-form>
          <!-- /Pick Date & Time -->
        </div>
      </el-tab-pane>
      <!-- /STEP BY STEP - PACKAGE MODE - STEP 3 -->

      <!-- STEP BY STEP - PACKAGE MODE - STEP 4 -->
      <el-tab-pane name="4">
        <span slot="label" class="am-customize-step__item">
          <img :src="$root.getUrl+'public/img/am-customize-step-1.svg'">
          <p>Step 4</p>
        </span>
        <div class="am-step-booking" :style="{ 'fontFamily': customization.font }">
          <!-- Package Setup Form -->
          <package-setup-form
            class="next-step"
            :form-name="$options.name"
            :editable="false"
            :language-short-code="languageShortCode"
            :customization="customization"
            :customization-form="customization.useGlobalColors[$options.name] ? customization.globalColors : formTypeData.packageSetupForm.globalSettings"
            :form-step-data="formTypeData.packageSetupForm"
            :reset-data="resetData"
            @resetForm="resetForm"
            @saveEdit="saveStepEdit"
          ></package-setup-form>
          <!-- /Package Setup Form -->

          <!-- Package List Form -->
          <package-list-form
            :form-name="$options.name"
            :editable="editable"
            :language-short-code="languageShortCode"
            :responsive-display="responsiveDisplay"
            :customization="customization"
            :customization-form="customization.useGlobalColors[$options.name] ? customization.globalColors : formTypeData.packageListForm.globalSettings"
            :form-step-data="formTypeData.packageListForm"
            :reset-data="resetData"
            @resetForm="resetForm"
            @saveEdit="saveStepEdit"
          ></package-list-form>
          <!-- /Package List Form -->
        </div>
      </el-tab-pane>
      <!-- /STEP BY STEP - PACKAGE MODE - STEP 4 -->

      <!-- STEP BY STEP - PACKAGE MODE - STEP 5 -->
      <el-tab-pane name="5">
        <span slot="label" class="am-customize-step__item">
          <img :src="$root.getUrl+'public/img/am-customize-step-1.svg'">
          <p>Step 5</p>
        </span>
        <div class="am-step-booking" :style="{ 'fontFamily': customization.font }">
          <!-- Package Setup Form -->
          <package-setup-form
            class="next-step"
            :form-name="$options.name"
            :editable="false"
            :language-short-code="languageShortCode"
            :customization="customization"
            :customization-form="customization.useGlobalColors[$options.name] ? customization.globalColors : formTypeData.packageSetupForm.globalSettings"
            :form-step-data="formTypeData.packageSetupForm"
            :reset-data="resetData"
            @resetForm="resetForm"
            @saveEdit="saveStepEdit"
          ></package-setup-form>
          <!-- /Package Setup Form -->

          <!-- Confirm Booking Form -->
          <confirm-booking-form
            :form-name="$options.name"
            :editable="editable"
            :language-short-code="languageShortCode"
            :customization="customization"
            :customize-display="customizeDisplay"
            :customization-form="customization.useGlobalColors[$options.name] ? customization.globalColors : formTypeData.confirmBookingForm[customizeDisplay].globalSettings"
            :form-step-data="formTypeData.confirmBookingForm[customizeDisplay]"
            :reset-data="resetData"
            @resetForm="resetForm"
            @saveEdit="saveStepEdit"
            @saveDraggableEdit="saveDraggableEdit"
          ></confirm-booking-form>
          <!-- /Confirm Booking Form -->
        </div>
      </el-tab-pane>
      <!-- /STEP BY STEP - PACKAGE MODE - STEP 5 -->

      <!-- STEP BY STEP - PACKAGE MODE - STEP 6 -->
      <el-tab-pane name="6">
        <span slot="label" class="am-customize-step__item">
          <img :src="$root.getUrl+'public/img/am-customize-step-1.svg'">
          <p>Step 6</p>
        </span>
        <div class="am-step-booking" :style="{ 'fontFamily': customization.font }">
          <!-- Congratulations Form -->
          <congratulations-form
            :form-name="$options.name"
            :editable="editable"
            :language-short-code="languageShortCode"
            :customization="customization"
            :customize-display="customizeDisplay"
            :customization-form="customization.useGlobalColors[$options.name] ? customization.globalColors : formTypeData.congratulationsForm[customizeDisplay].globalSettings"
            :form-step-data="formTypeData.congratulationsForm[customizeDisplay]"
            :reset-data="resetData"
            @resetForm="resetForm"
            @saveEdit="saveStepEdit"
          ></congratulations-form>
          <!-- /Congratulations Form -->
        </div>
      </el-tab-pane>
      <!-- /STEP BY STEP - PACKAGE MODE - STEP 6 -->
    </el-tabs>
  </div>
</template>

<script>
import selectServiceForm from '../formSteps/SelectServiceForm'
import selectPackageForm from '../formSteps/SelectPackageForm'
import calendarDateTimeForm from '../formSteps/CalendarDateTimeForm'
import packageSetupForm from '../formSteps/PackageSetupForm'
import packageInfoForm from '../formSteps/PackageInfoForm'
import packageListForm from '../formSteps/PackageListForm'
import recurringSetupForm from '../formSteps/RecurringSetupForm'
import recurringDatesForm from '../formSteps/RecurringDatesForm'
import confirmBookingForm from '../formSteps/ConfirmBookingForm'
import congratulationsForm from '../formSteps/CongratulationsForm'

export default {
  name: 'stepByStepForm',

  components: {
    selectServiceForm,
    selectPackageForm,
    calendarDateTimeForm,
    packageSetupForm,
    packageInfoForm,
    packageListForm,
    recurringSetupForm,
    recurringDatesForm,
    confirmBookingForm,
    congratulationsForm
  },

  props: {
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
    customizeDisplay: {
      type: String,
      default: 'appointment'
    },
    formTypeData: {
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
      activeServiceStep: '1',
      activePackageStep: '1',
      responsiveDisplay: 'am-desktop',
      stepNavigation: 'right'
    }
  },

  updated () {
    this.handleResize()
  },

  created () {
    window.addEventListener('resize', this.handleResize)
  },

  mounted () {
    this.handleResize()
  },

  methods: {
    resetForm (resetData) {
      let resetDataObj = resetData
      resetDataObj.formType = this.$options.name
      this.$emit('resetForm', resetDataObj)
    },

    handleResize () {
      if (this.$refs.customizeContainer) {
        let amContainerWidth = this.$refs.customizeContainer.offsetWidth

        if (amContainerWidth < 873) {
          this.stepNavigation = 'top'
        } else {
          this.stepNavigation = 'right'
        }

        if (amContainerWidth < 768) {
          this.responsiveDisplay = 'am-mobile'
        } else {
          this.responsiveDisplay = 'am-desktop'
        }
      }
    },

    saveDraggableEdit (dataObj) {
      let formObj = {}
      formObj[this.$options.name] = JSON.parse(JSON.stringify(dataObj))
      this.$emit('saveDraggableEdit', formObj)
    },

    saveStepEdit (dataObj) {
      let formObj = {}
      formObj[this.$options.name] = JSON.parse(JSON.stringify(dataObj))
      this.$emit('saveEdit', formObj)
    }
  }
}
</script>
