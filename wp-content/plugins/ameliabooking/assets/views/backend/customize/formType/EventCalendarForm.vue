<template>
  <div class="am-customize-step" ref="customizeContainer">
    <el-tabs v-model="activeEventStep" :tab-position="stepNavigation">
      <!-- EVENT CALENDAR - STEP 1 -->
      <el-tab-pane name="1">
        <span slot="label" class="am-customize-step__item">
          <img :src="$root.getUrl+'public/img/am-customize-step-1.svg'">
          <p>Step 1</p>
        </span>
        <div
          class="am-event-calendar-page"
          :style="{fontFamily: customization.font}"
        >
          <select-event-calendar-form
            :form-name="$options.name"
            :editable="editable"
            :active-event-step="activeEventStep"
            :language-short-code="languageShortCode"
            :customization="customization"
            :customization-form="customization.useGlobalColors[$options.name] ? customization.globalColors : formTypeData.selectEventCalendarForm.globalSettings"
            :form-step-data="formTypeData.selectEventCalendarForm"
            :reset-data="resetData"
            @resetForm="resetForm"
            @saveEdit="saveFormEdit"
          ></select-event-calendar-form>
        </div>
      </el-tab-pane>
      <!-- /EVENT CALENDAR - STEP 1 -->

      <!-- EVENT CALENDAR - STEP 2 -->
      <el-tab-pane name="2">
        <span slot="label" class="am-customize-step__item">
          <img :src="$root.getUrl+'public/img/am-customize-step-1.svg'">
          <p>Step 2</p>
        </span>
        <div
          class="am-event-calendar-page"
          :style="{fontFamily: customization.font}"
        >
          <info-event-calendar-form
            :form-name="$options.name"
            :editable="editable"
            :language-short-code="languageShortCode"
            :customization="customization"
            :customization-form="customization.useGlobalColors[$options.name] ? customization.globalColors : formTypeData.infoEventCalendarForm.globalSettings"
            :transferred-strings="formTypeData.selectEventCalendarForm.labels"
            :form-step-data="formTypeData.infoEventCalendarForm"
            :reset-data="resetData"
            @resetForm="resetForm"
            @saveEdit="saveFormEdit"
          ></info-event-calendar-form>
        </div>
      </el-tab-pane>
      <!-- /EVENT CALENDAR - STEP 2 -->

      <!-- EVENT CALENDAR - STEP 3 -->
      <el-tab-pane name="3">
        <span slot="label" class="am-customize-step__item">
          <img :src="$root.getUrl+'public/img/am-customize-step-1.svg'">
          <p>Step 3</p>
        </span>
        <div
          class="am-event-calendar-page"
          :style="{fontFamily: customization.font}"
        >
          <invite-event-calendar-form
            :form-name="$options.name"
            :editable="editable"
            :language-short-code="languageShortCode"
            :customization="customization"
            :customization-form="customization.useGlobalColors[$options.name] ? customization.globalColors : formTypeData.inviteEventCalendarForm.globalSettings"
            :form-step-data="formTypeData.inviteEventCalendarForm"
            :reset-data="resetData"
            @resetForm="resetForm"
            @saveEdit="saveFormEdit"
          ></invite-event-calendar-form>
        </div>
      </el-tab-pane>
      <!-- /EVENT CALENDAR - STEP 3 -->

      <!-- EVENT CALENDAR - STEP 4 -->
      <el-tab-pane name="4">
        <span slot="label" class="am-customize-step__item">
          <img :src="$root.getUrl+'public/img/am-customize-step-1.svg'">
          <p>Step 4</p>
        </span>
        <div
          class="am-event-calendar-page"
          :style="{fontFamily: customization.font}"
        >
          <div class="am-event-modal__inner">
            <!-- Confirm Booking Form -->
            <confirm-booking-form
              :form-name="$options.name"
              :editable="editable"
              :language-short-code="languageShortCode"
              :customization="customization"
              :customize-display="'event'"
              :customization-form="customization.useGlobalColors[$options.name] ? customization.globalColors : formTypeData.confirmBookingForm.event.globalSettings"
              :form-step-data="formTypeData.confirmBookingForm.event"
              :reset-data="resetData"
              @resetForm="resetForm"
              @saveDraggableEdit="saveDraggableEdit"
              @saveEdit="saveFormEdit"
            ></confirm-booking-form>
            <!-- /Confirm Booking Form -->
          </div>
        </div>
      </el-tab-pane>
      <!-- /EVENT CALENDAR - STEP 4 -->

      <!-- EVENT CALENDAR - STEP 5 -->
      <el-tab-pane name="5">
        <span slot="label" class="am-customize-step__item">
          <img :src="$root.getUrl+'public/img/am-customize-step-1.svg'">
          <p>Step 5</p>
        </span>
        <div
          class="am-event-calendar-page"
          :style="{fontFamily: customization.font}"
        >
          <div class="am-event-modal__inner">
            <!-- Congratulations Form -->
            <congratulations-form
              :form-name="$options.name"
              :editable="editable"
              :language-short-code="languageShortCode"
              :customization="customization"
              :customize-display="'event'"
              :customization-form="customization.useGlobalColors[$options.name] ? customization.globalColors : formTypeData.congratulationsForm.event.globalSettings"
              :form-step-data="formTypeData.congratulationsForm.event"
              :reset-data="resetData"
              @resetForm="resetForm"
              @saveEdit="saveFormEdit"
            ></congratulations-form>
            <!-- /Congratulations Form -->
          </div>
        </div>
      </el-tab-pane>
      <!-- /EVENT CALENDAR - STEP 5 -->

    </el-tabs>
  </div>
</template>

<script>
import formsCustomizationMixin from '../../../../../assets/js/common/mixins/formsCustomizationMixin'
import selectEventCalendarForm from '../formSteps/SelectEventCalendarForm'
import infoEventCalendarForm from '../formSteps/InfoEventCalendarForm'
import inviteEventCalendarForm from '../formSteps/InviteEventCalendarForm'
import confirmBookingForm from '../formSteps/ConfirmBookingForm'
import congratulationsForm from '../formSteps/CongratulationsForm'

export default {
  name: 'eventCalendarForm',

  components: {
    selectEventCalendarForm,
    infoEventCalendarForm,
    inviteEventCalendarForm,
    confirmBookingForm,
    congratulationsForm
  },

  mixins: [formsCustomizationMixin],

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
    resetData: {
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

    resetForm (resetData) {
      let resetDataObj = resetData
      resetDataObj.formType = this.$options.name
      this.$emit('resetForm', resetDataObj)
    },

    saveFormEdit (dataObj) {
      let formObj = {}
      formObj[this.$options.name] = JSON.parse(JSON.stringify(dataObj))
      this.$emit('saveEdit', formObj)
    },

    saveDraggableEdit (dataObj) {
      let formObj = {}
      formObj[this.$options.name] = JSON.parse(JSON.stringify(dataObj))
      this.$emit('saveDraggableEdit', formObj)
    }
  }
}
</script>

<style lang="less" scoped>
.am-event {
  &-modal {
    &__inner {
      max-width: 860px;
      margin: 32px auto;
    }
  }
}
</style>
