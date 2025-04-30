<template>
  <div class="am-customize-step" ref="customizeContainer">
    <el-tabs v-model="activeEventStep" :tab-position="stepNavigation">
      <!-- EVENT LIST - SERVICE MODE - STEP 1 -->
      <el-tab-pane name="1">
        <span slot="label" class="am-customize-step__item">
          <img :src="$root.getUrl+'public/img/am-customize-step-1.svg'">
          <p>Step 1</p>
        </span>
        <div
          class="am-events-booking"
          :class="{'editable': editable}"
          :style="{fontFamily: customization.font}"
        >
          <customization-form-header
            v-if="!customization.useGlobalColors[$options.name]"
            :editable="editable"
            :customization-form="formTypeData.globalSettings"
            @resetForm="resetForm"
            @saveFormEdit="saveFormEdit"
          ></customization-form-header>

          <!-- Event filter form -->
          <event-filter-form
            :editable="editable"
            :language-short-code="languageShortCode"
            :opposite-background-color="oppositeBackgroundColor"
            :customization="customization"
            :customization-form="customization.useGlobalColors[$options.name] ? customization.globalColors : formTypeData.globalSettings"
            :form-data="formTypeData.eventFilterForm"
            @saveEdit="saveFormEdit"
          ></event-filter-form>
          <!-- /Event filter form -->

          <!-- Event List, Details, Confirm Booking -->
          <event-details-form
            :form-name="$options.name"
            :editable="editable"
            :language-short-code="languageShortCode"
            :active-form-tab="activeEventStep"
            :opposite-background-color="oppositeBackgroundColor"
            :customization="customization"
            :customization-form="customization.useGlobalColors[$options.name] ? customization.globalColors : formTypeData.globalSettings"
            :form-data="formTypeData"
            @saveEdit="saveFormEdit"
          ></event-details-form>
          <!-- /Event List, Details, Confirm Booking -->
        </div>
      </el-tab-pane>
      <!-- /EVENT LIST - SERVICE MODE - STEP 1 -->

      <!-- EVENT LIST - SERVICE MODE - STEP 2 -->
      <el-tab-pane name="2">
        <span slot="label" class="am-customize-step__item">
          <img :src="$root.getUrl+'public/img/am-customize-step-1.svg'">
          <p>Step 2</p>
        </span>
        <div
          class="am-events-booking"
          :class="{'editable': editable}"
          :style="{fontFamily: customization.font}"
        >
          <customization-form-header
            v-if="!customization.useGlobalColors[$options.name]"
            :editable="editable"
            :customization-form="formTypeData.globalSettings"
            @resetForm="resetForm"
            @saveFormEdit="saveFormEdit"
          ></customization-form-header>

          <!-- Event filter form -->
          <event-filter-form
            :editable="editable"
            :language-short-code="languageShortCode"
            :customization="customization"
            :customization-form="customization.useGlobalColors[$options.name] ? customization.globalColors : formTypeData.globalSettings"
            :form-data="formTypeData.eventFilterForm"
            @saveEdit="saveFormEdit"
          ></event-filter-form>
          <!-- /Event filter form -->

          <!-- Event List, Details, Confirm Booking -->
          <event-details-form
            :form-name="$options.name"
            :editable="editable"
            :language-short-code="languageShortCode"
            :active-form-tab="activeEventStep"
            :opposite-background-color="oppositeBackgroundColor"
            :customization="customization"
            :customization-form="customization.useGlobalColors[$options.name] ? customization.globalColors : formTypeData.globalSettings"
            :form-data="formTypeData"
            @saveEdit="saveFormEdit"
            @saveDraggableEdit="saveDraggableEdit"
          ></event-details-form>
          <!-- /Event List, Details, Confirm Booking -->
        </div>
      </el-tab-pane>
      <!-- /EVENT LIST - SERVICE MODE - STEP 2 -->

      <!-- EVENT LIST - SERVICE MODE - STEP 3 -->
      <el-tab-pane name="3">
        <span slot="label" class="am-customize-step__item">
          <img :src="$root.getUrl+'public/img/am-customize-step-1.svg'">
          <p>Step 3</p>
        </span>
        <div
          class="am-events-booking"
          :class="{'editable': editable}"
          :style="{fontFamily: customization.font}"
        >
          <customization-form-header
            v-if="!customization.useGlobalColors[$options.name]"
            :editable="editable"
            :customization-form="formTypeData.globalSettings"
            @resetForm="resetForm"
            @saveFormEdit="saveFormEdit"
          ></customization-form-header>

          <!-- Event filter form -->
          <event-filter-form
            :editable="editable"
            :language-short-code="languageShortCode"
            :customization="customization"
            :customization-form="customization.useGlobalColors[$options.name] ? customization.globalColors : formTypeData.globalSettings"
            :form-data="formTypeData.eventFilterForm"
            @saveEdit="saveFormEdit"
          ></event-filter-form>
          <!-- /Event filter form -->

          <!-- Event List, Details, Confirm Booking -->
          <event-details-form
            :form-name="$options.name"
            :editable="editable"
            :language-short-code="languageShortCode"
            :active-form-tab="activeEventStep"
            :opposite-background-color="oppositeBackgroundColor"
            :customization="customization"
            :customization-form="customization.useGlobalColors[$options.name] ? customization.globalColors : formTypeData.globalSettings"
            :form-data="formTypeData"
            @saveEdit="saveFormEdit"
          ></event-details-form>
          <!-- /Event List, Details, Confirm Booking -->
        </div>
      </el-tab-pane>
      <!-- /EVENT LIST - SERVICE MODE - STEP 3 -->
    </el-tabs>
  </div>
</template>

<script>
import cssColorManipulationMixin from '../../../../js/common/mixins/cssColorManipulationMixin'
import formColorsEditDialog from '../dialogs/FormColorsEditDialog'
import eventFilterForm from '../formSteps/EventFilterForm'
import eventDetailsForm from '../formSteps/EventDetailsForm'
import customizationFormHeader from '../parts/CustomizationFormHeader'

export default {
  name: 'eventListForm',

  components: {
    eventFilterForm,
    formColorsEditDialog,
    eventDetailsForm,
    customizationFormHeader
  },

  mixins: [cssColorManipulationMixin],

  props: {
    languageShortCode: {
      type: String,
      default: ''
    },
    customizeDisplay: {
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
      responsiveDisplay: 'am-desktop',
      activeEventStep: '1',
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

  computed: {
    oppositeBackgroundColor () {
      return this.oppositeColor(this.formTypeData.globalSettings.formBackgroundColor)
    }
  },

  methods: {
    resetForm () {
      let resetObj = {}
      resetObj.data = this.resetData
      resetObj.formType = this.$options.name
      this.$emit('resetForm', resetObj)
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

    saveFormEdit (dataObj) {
      let formObj = {}
      formObj[this.$options.name] = JSON.parse(JSON.stringify(dataObj))
      this.$emit('saveEdit', formObj)
    }
  }
}
</script>
