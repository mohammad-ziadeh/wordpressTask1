<template>
  <div
    class="am-confirm-booking"
    :class="{'editable': editable}"
    :style="{backgroundColor: formStepData.hasOwnProperty('globalSettings') ? customizationForm.formBackgroundColor : ''}"
  >
    <customization-form-header
      v-if="formStepData.hasOwnProperty('globalSettings') && Object.keys(this.resetData).length && !customization.useGlobalColors[formName]"
      :editable="editable"
      :customization-form="customizationForm"
      @resetForm="resetForm"
      @saveFormEdit="saveFormEdit"
    ></customization-form-header>

    <!-- Confirm Dialog Header -->
    <confirm-service-heading-form-field
      v-if="customizeDisplay === 'appointment'"
      :service="service"
      :customization-edit="customizationEditDisplay"
      :customization-form="customizationForm"
      :form-field="formStepData.itemsStatic.confirmServiceHeadingFormField"
      @saveEdit="saveFormEdit"
    ></confirm-service-heading-form-field>
    <!-- /Confirm Dialog Header -->

    <!-- Confirm Dialog Package -->
    <div class="am-confirmation-booking-package-wrapper" v-if="customizeDisplay === 'package' && !catalogLayout">
      <!-- Package Header -->
      <div class="am-package-header">
        <!-- Package Header Image Data container -->
        <div class="am-package-header-image-data-wrapper">
          <!-- Package Image -->
          <div class="am-package-image">
            <img :src="pictureLoad(package, false)" @error="imageLoadError(package, false)"/>
            <span :style="{'background-color': customization.globalColors.primaryColor}">
              <img :src="$root.getUrl + 'public/img/am-package-catalog.svg'">
            </span>
          </div>
          <!-- /Package Image -->

          <!-- Package Data -->
          <div class="am-package-data">

            <!-- Package Name -->
            <div class="am-package-title">
              <h2 :style="{color: customizationForm.formTextColor}">{{ package.name }}</h2>
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
            {{ getFormattedPrice(package.price) }}
          </div>
          <!-- /Package Price -->
        </div>
        <!-- /Package Price Container -->

      </div>
      <!-- /Package Header -->
    </div>
    <!-- /Confirm Dialog Package -->

    <!-- Confirm Dialog Calendar Event -->
    <dialog-event-calendar-heading-form-field
      v-if="customizeDisplay === 'event' && formStepData.itemsStatic.hasOwnProperty('dialogEventCalendarHeadingFormField')"
      :language-short-code="languageShortCode"
      :customization-edit="customizationEditDisplay"
      :customization-form="customizationForm"
      :form-field="formStepData.itemsStatic.dialogEventCalendarHeadingFormField"
      @saveEdit="saveFormEdit"
    ></dialog-event-calendar-heading-form-field>
    <!-- /Confirm Dialog Calendar Event -->

    <!-- Confirm Dialog Body -->
    <el-form
      label-position="top"
      class="am-confirm-booking-form"
    >
      <el-row class="am-confirm-booking-data" :gutter="editable ? 48 : 24">

        <confirm-heading-data-form-field
          v-if="customizeDisplay === 'appointment'"
          :language-short-code="languageShortCode"
          :customization="customization"
          :customization-edit="customizationEditDisplay"
          :customization-form="customizationForm"
          :form-field="formStepData.itemsStatic.confirmHeadingDataFormField"
          @saveEdit="saveFormEdit"
        ></confirm-heading-data-form-field>

        <recurring-string-form-field
          v-if="customizeDisplay === 'appointment'"
          :language-short-code="languageShortCode"
          :customization="customization"
          :customization-edit="customizationEditDisplay"
          :customization-form="customizationForm"
          :form-field="formStepData.itemsStatic.recurringStringFormField"
          @saveEdit="saveFormEdit"
        ></recurring-string-form-field>

        <draggable
          v-model="firstStepDraggable"
          :animation="150"
          handle=".am-customize-drag-handle"
          @end="dropFormField"
        >
          <template v-for="formField in firstStepDraggable">
            <component
              :is="formField.name"
              :language-short-code="languageShortCode"
              :customization="customization"
              :customization-edit="customizationEditDisplay"
              :customization-form="customizationForm"
              :form-field="formField"
              @saveEdit="saveFormEdit"
            ></component>
          </template>
        </draggable>
      </el-row>

      <el-row :gutter="editable ? 48 : 24"> <!-- todo -->
        <el-col :sm="24">
          <payment-type-form-field
          :language-short-code="languageShortCode"
          :customization="customization"
          :customization-edit="customizationEditDisplay"
          :customization-form="customizationForm"
          :form-field="formStepData.itemsStatic.paymentTypeFormField"
          @saveEdit="saveFormEdit"
          >
          </payment-type-form-field>
        </el-col>
      </el-row>

      <el-row :gutter="editable ? 48 : 24">
        <el-col :sm="24">
          <payment-method-form-field
            :language-short-code="languageShortCode"
            :customization="customization"
            :customization-edit="customizationEditDisplay"
            :customization-form="customizationForm"
            :form-field="formStepData.itemsStatic.paymentMethodFormField"
            @saveEdit="saveFormEdit"
          ></payment-method-form-field>
        </el-col>
        <el-col :sm="24">
          <stripe-card-form-field
            :language-short-code="languageShortCode"
            :customization="customization"
            :customization-edit="customizationEditDisplay"
            :customization-form="customizationForm"
            :form-field="formStepData.itemsStatic.stripeCardFormField"
            @saveEdit="saveFormEdit"
          ></stripe-card-form-field>
        </el-col>
      </el-row>

      <!-- Appointment Data -->
      <el-row :gutter="editable ? 48 : 24">
        <el-col :sm="24">
          <!-- Payment Data -->
            <div
              v-show="customizationEdit.editable ? customizationEdit.editable : componentDisplay()"
              class="am-confirmation-booking-cost am-customize-field"
              :class="{'editable': customizationEdit.editable}"
              :style="{borderColor: customizationEdit.reverseBackgroundColorForm}"
            >

              <!-- Number Of Persons -->
              <el-row v-if="customizeDisplay === 'appointment' || customizeDisplay === 'event'" :gutter="24">
                <el-col :span="12">
                  <p :style="{color: customizationForm.formTextColor}">
                    <template v-if="!languageShortCode">
                      {{ priceLabels.total_number_of_persons.value || $root.labels.total_number_of_persons }}
                    </template>
                    <template v-else>
                      {{ priceLabels.total_number_of_persons.translations[languageShortCode] || $root.labels.total_number_of_persons }}
                    </template>
                  </p>
                </el-col>
                <el-col :span="12">
                  <p
                    class="am-semi-strong am-align-right"
                    :style="{color: customizationForm.formTextColor}"
                  >
                    2
                  </p>
                </el-col>
              </el-row>
              <!-- /Number Of Persons -->

              <!-- Appointment Price -->
              <el-row v-if="customizeDisplay === 'appointment' || customizeDisplay === 'event'" :gutter="24">
                <el-col :span="6">
                  <p :style="{color: customizationForm.formTextColor}">
                    <template v-if="!languageShortCode">
                      {{ priceLabels.base_price_colon.value || $root.labels.base_price_colon }}
                    </template>
                    <template v-else>
                      {{ priceLabels.base_price_colon.translations[languageShortCode] || $root.labels.base_price_colon }}
                    </template>
                  </p>
                </el-col>
                <el-col :span="18">
                  <p
                    class="am-semi-strong am-align-right"
                    :style="{color: customizationForm.formTextColor}"
                  >
                    $125.00
                  </p>
                </el-col>
              </el-row>
              <!-- /Appointment Price -->

              <!-- Discount Price -->
              <el-row v-if="customizeDisplay === 'appointment' || customizeDisplay === 'event'" :gutter="24">
                <el-col :span="8">
                  <p :style="{color: customizationForm.formTextColor}">
                    <template v-if="!languageShortCode">
                      {{ priceLabels.discount_amount_colon.value || $root.labels.discount_amount_colon }}
                    </template>
                    <template v-else>
                      {{ priceLabels.discount_amount_colon.translations[languageShortCode] || $root.labels.discount_amount_colon }}
                    </template>
                  </p>
                </el-col>
                <el-col :span="16">
                  <p
                    class="am-semi-strong am-align-right"
                    :style="{color: customizationForm.formTextColor}"
                  >
                    $0
                  </p>
                </el-col>
              </el-row>
              <!-- /Discount Price -->

              <div class="am-confirmation-total" :style="{backgroundColor: colorTransparency(customization.globalColors.primaryColor, 0.1)}">
                <!-- Total Price -->
                <el-row :gutter="24">
                  <el-col :span="12">
                    <p :style="{color: customizationForm.formTextColor}">
                      <template v-if="!languageShortCode">
                        {{ priceLabels.total_cost_colon.value || $root.labels.total_cost_colon }}
                      </template>
                      <template v-else>
                        {{ priceLabels.total_cost_colon.translations[languageShortCode] || $root.labels.total_cost_colon }}
                      </template>
                    </p>
                  </el-col>
                  <el-col :span="12">
                    <p
                      class="am-semi-strong am-align-right"
                      :style="{color: customizeDisplay === 'event' ? eventColor : customization.globalColors.primaryColor}"
                    >
                      $125.00
                    </p>
                  </el-col>
                </el-row>
                <!-- /Total Price -->
              </div>

              <customize-edit-dialog
                :language-short-code="languageShortCode"
                :form-field="formStepData.itemsStatic.priceFormFiled"
                @saveEdit="saveFormFiledEdit"
              >
                <template v-slot:fieldEdit>
                <span v-show="customizationEdit.editable" class="am-customize-field__edit">
                  <img :src="$root.getUrl + 'public/img/am-customize-icon-edit.svg'" />
                </span>
                </template>
              </customize-edit-dialog>
              <!-- /Payment Data -->
            </div>
        </el-col>
      </el-row>
      <!-- /Appointment Data -->

    </el-form>
    <!-- /Confirm Dialog Body -->

    <!-- Confirm Dialog Footer -->
    <div class="dialog-footer">
      <div
        v-if="customizeDisplay !== 'event'"
        class="el-button el-button--default"
        :style="{color: customization.textColor}"
        @mouseenter="mouseEnterDefault"
        @mouseleave="mouseLeaveDefault"
      >
        <span>{{ $root.labels.cancel }}</span>
      </div>

      <div
        v-if="customizeDisplay !== 'event'"
        class="el-button el-button--primary"
        :style="{backgroundColor: customization.globalColors.primaryColor, borderColor: customization.globalColors.primaryColor, color: customization.globalColors.textColorOnBackground}"
        @mouseenter="mouseEnterPrimary"
        @mouseleave="mouseLeavePrimary"
      >
        <span>{{ $root.labels.confirm }}</span>
      </div>

      <div
        v-if="customizeDisplay === 'event'"
        class="el-button el-button--primary"
        :style="{backgroundColor: eventColor, borderColor: '#ffffff', color: customization.globalColors.textColorOnBackground}"
        @mouseenter="mouseEnterEventPrimary"
        @mouseleave="mouseLeaveEventPrimary"
      >
        <span>{{ $root.labels.confirm }}</span>
      </div>
    </div>
    <!-- /Confirm Dialog Footer -->
  </div>
</template>

<script>
import priceMixin from '../../../../js/common/mixins/priceMixin'
import imageMixin from '../../../../js/common/mixins/imageMixin'
import dateMixin from '../../../../js/common/mixins/dateMixin'
import cssColorManipulationMixin from '../../../../js/common/mixins/cssColorManipulationMixin'
import Draggable from 'vuedraggable'
import confirmServiceHeadingFormField from '../formFields/ConfirmServiceHeadingFormField'
import confirmHeadingDataFormField from '../formFields/ConfirmHeadingDataFormField'
import recurringStringFormField from '../formFields/RecurringStringFormField'
import dialogEventCalendarHeadingFormField from '../formFields/DialogEventCalendarHeadingFormField'
import firstNameFormField from '../formFields/FirstNameFormField'
import lastNameFormField from '../formFields/LastNameFormField'
import emailFormField from '../formFields/EmailFormField'
import phoneFormField from '../formFields/PhoneFormField'
import paymentMethodFormField from '../formFields/PaymentMethodFormField'
import stripeCardFormField from '../formFields/StripeCardFormField'
import customizationFormHeader from '../parts/CustomizationFormHeader'
import PaymentTypeFormField from '../formFields/PaymentTypeFormField'
import customizeEditDialog from '../dialogs/CustomizeEditDialog.vue'

export default {
  name: 'confirmBookingForm',

  components: {
    Draggable,
    confirmServiceHeadingFormField,
    confirmHeadingDataFormField,
    dialogEventCalendarHeadingFormField,
    recurringStringFormField,
    firstNameFormField,
    lastNameFormField,
    emailFormField,
    phoneFormField,
    PaymentTypeFormField,
    paymentMethodFormField,
    stripeCardFormField,
    customizationFormHeader,
    customizeEditDialog
  },

  mixins: [imageMixin, dateMixin, priceMixin, cssColorManipulationMixin],

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
    eventColor: {
      type: String,
      default: '#1A84EE'
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
      resetFormData: Object.keys(this.resetData).length ? this.resetData[this.$options.name][this.customizeDisplay] : {},
      firstStepDraggable: [],
      customizationEdit: {
        editable: this.editable,
        reverseBackgroundColorForm: this.oppositeColor(this.customizationForm.formBackgroundColor),
        useGlobalColors: this.customization.useGlobalColors[this.formName]
      },
      service: {
        name: 'Service Name'
      },
      package: {
        name: 'Package Name',
        price: '125.00',
        pictureThumbPath: `${this.$root.getUrl}public/img/default-service.svg`
      }
    }
  },

  created () {
    for (const prop in this.formStepData.itemsDraggable) {
      let draggableObj = {}
      draggableObj = JSON.parse(JSON.stringify({...this.formStepData.itemsDraggable[prop]}))
      draggableObj.name = prop
      this.firstStepDraggable.push(draggableObj)
    }
  },

  computed: {
    customizationEditDisplay () {
      this.customizationEdit.editable = this.editable
      this.customizationEdit.reverseBackgroundColorForm = this.oppositeColor(this.customizationForm.formBackgroundColor)
      return this.customizationEdit
    },
    priceLabels () {
      return this.formStepData.itemsStatic.priceFormFiled.labels
    }
  },

  methods: {
    resetForm () {
      let resetObj = {}
      resetObj.data = this.resetFormData
      resetObj.formStep = this.$options.name
      resetObj.formPart = this.customizeDisplay
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

    mouseEnterEventPrimary (a) {
      a.target.style.backgroundColor = `${this.eventColor}bf`
      a.target.style.borderColor = `${this.eventColor}bf`
    },

    mouseLeaveEventPrimary (a) {
      a.target.style.backgroundColor = this.eventColor
      a.target.style.borderColor = this.eventColor
    },

    dropFormField (e) {
      if (e.newIndex !== e.oldIndex) {
        this.draggableArrayToObject()
      }
    },

    draggableArrayToObject () {
      let arrayToObj = {}
      let draggableObject = {}
      const draggableArrayClone = [...this.firstStepDraggable]
      draggableArrayClone.forEach(item => {
        arrayToObj[item.name] = JSON.parse(JSON.stringify({...item}))
        delete arrayToObj[item.name].name
      })

      draggableObject[this.$options.name] = {}
      draggableObject[this.$options.name][this.customizeDisplay] = {}
      // set draggable property to draggable object
      draggableObject[this.$options.name][this.customizeDisplay].itemsDraggable = Object.assign({}, arrayToObj)

      this.$emit('saveDraggableEdit', draggableObject)
    },

    componentDisplay () {
      if (this.formStepData.itemsStatic.priceFormFiled.hasOwnProperty('visibility')) {
        return this.formStepData.itemsStatic.priceFormFiled.visibility
      }

      return true
    },

    saveFormFiledEdit (objData) {
      let fieldData = {}
      fieldData['itemsStatic'] = {}
      fieldData['itemsStatic']['priceFormFiled'] = JSON.parse(JSON.stringify(objData))

      this.saveFormEdit(fieldData)
    },

    saveFormEdit (dataObj) {
      if (dataObj.hasOwnProperty('itemsDraggable')) {
        let draggableArrayKeys = Object.keys(dataObj['itemsDraggable'])
        draggableArrayKeys.forEach(prop => {
          let itemIndex = this.firstStepDraggable.findIndex(item => item.name === prop)
          this.firstStepDraggable[itemIndex] = JSON.parse(JSON.stringify(dataObj['itemsDraggable'][prop]))
          delete dataObj['itemsDraggable'][prop].name
        })
      }

      let formObj = {}
      formObj[this.$options.name] = {}
      formObj[this.$options.name][this.customizeDisplay] = JSON.parse(JSON.stringify(dataObj))

      this.$emit('saveEdit', formObj)
    }
  },

  watch: {
    'formStepData' () {
      this.firstStepDraggable = []
      for (const prop in this.formStepData.itemsDraggable) {
        let draggableObj = {}
        draggableObj = JSON.parse(JSON.stringify({...this.formStepData.itemsDraggable[prop]}))
        draggableObj.name = prop
        this.firstStepDraggable.push(draggableObj)
      }
    }
  }
}
</script>
