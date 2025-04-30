<template>
  <div
    class="am-select-service"
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

    <service-heading-form-field
      :language-short-code="languageShortCode"
      :catalog-layout="catalogLayout"
      :customization="customization"
      :customization-edit="customizationEditDisplay"
      :customization-form="customizationForm"
      :form-field="formStepData.itemsStatic.serviceHeadingFormField"
      @saveEdit="saveFormEdit"
    ></service-heading-form-field>

    <!-- Booking Form -->
    <el-form label-position="top">
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
    </el-form>
  </div>
</template>

<script>
import Draggable from 'vuedraggable'
import cssColorManipulationMixin from '../../../../js/common/mixins/cssColorManipulationMixin'
import serviceFormField from '../formFields/ServiceFormField'
import servicePackageFormField from '../formFields/ServicePackageFormField'
import employeeFormField from '../formFields/EmployeeFormField'
import locationFormField from '../formFields/LocationFormField'
import bringingFormField from '../formFields/BringingFormField'
import addExtraFormField from '../formFields/AddExtraFormField'
import serviceHeadingFormField from '../formFields/ServiceHeadingFormField'
import customizationFormHeader from '../parts/CustomizationFormHeader'

export default {
  name: 'selectServiceForm',

  components: {
    Draggable,
    serviceFormField,
    servicePackageFormField,
    employeeFormField,
    locationFormField,
    bringingFormField,
    addExtraFormField,
    serviceHeadingFormField,
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

  mixins: [cssColorManipulationMixin],

  data () {
    return {
      resetFormData: this.resetData ? this.resetData[this.$options.name] : {},
      firstStepDraggable: [],
      customizationEdit: {
        editable: this.editable,
        reverseBackgroundColorForm: this.oppositeColor(this.customizationForm.formBackgroundColor)
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
    }
  },

  methods: {
    resetForm () {
      let resetObj = {}
      resetObj.data = this.resetFormData
      resetObj.formStep = this.$options.name
      this.$emit('resetForm', resetObj)
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
      // set draggable property to draggable object
      draggableObject[this.$options.name].itemsDraggable = Object.assign({}, arrayToObj)

      this.$emit('saveDraggableEdit', draggableObject)
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
      formObj[this.$options.name] = JSON.parse(JSON.stringify(dataObj))

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
