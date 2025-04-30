<template>
  <div
    :class="$root.settings.customization.forms ? `am-form-${formType}-${formName}` : ''"
    class="am-form-full-wrapper"
  >
    <div class="am-select-service">
      <!-- Form Heading -->
      <service-heading-form-field
        :showServices="showServices"
        :class-identifier="`${formType}-${formName}`"
        :formField="formsData[formName].itemsStatic.serviceHeadingFormField"
      ></service-heading-form-field>
      <!-- /Form Heading -->

      <!-- Booking Form -->
      <el-form :model="appointment" ref="booking" :rules="rules" label-position="top">
        <!-- Draggable form fields (components) -->
        <template v-for="(formField, key) in formsData[formName].itemsDraggable">
          <component
            :is="key"
            :extras-error="extrasError"
            :showServices="showServices"
            :passedService="passedService"
            :showLocations="showLocations"
            :showEmployees="showEmployees"
            :group="group"
            :selectedExtras="selectedExtras"
            :appointment="appointment"
            :options="options"
            :fetched="fetched"
            :class-identifier="`${formType}-${$options.name}`"
            :form-field="formField"
            @change="changeFormItem"
            @enableGrouping="$emit('enableGrouping')"
          >
          </component>
        </template>
        <!-- /Draggable form fields (components) -->

        <!-- Continue btn -->
        <div class="am-button-wrapper">
          <el-button
            :loading="loadingTimeSlots"
            type="primary"
            @click="getTimeSlots"
          >
            {{ $root.labels.continue }}
          </el-button>
        </div>
        <!-- /Continue btn -->

      </el-form>
      <!-- /Booking Form -->
    </div>
  </div>
</template>

<script>
  import serviceHeadingFormField from '../formFields/ServiceHeadingFormField'
  import serviceFormField from '../formFields/ServiceFormField'
  import servicePackageFormField from '../formFields/ServicePackageFormField'
  import locationFormField from '../formFields/LocationFormField'
  import employeeFormField from '../formFields/EmployeeFormField'
  import bringingFormField from '../formFields/BringingFormField'
  import addExtraFormField from '../formFields/AddExtraFormField'

  export default {
    name: 'selectServiceForm',

    components: {
      serviceHeadingFormField,
      serviceFormField,
      servicePackageFormField,
      locationFormField,
      employeeFormField,
      bringingFormField,
      addExtraFormField
    },

    props: {
      extrasError: {
        type: Array,
        default: () => []
      },
      showServices: {
        type: Boolean,
        default: true
      },
      appointment: {
        type: Object,
        default: () => {
          return {
            bookingStart: '',
            bookingStartTime: '',
            bookings: [{
              customer: {
                email: '',
                externalId: null,
                firstName: '',
                id: null,
                lastName: '',
                phone: ''
              },
              customFields: {},
              customerId: 0,
              extras: [],
              persons: 1
            }],
            duration: 0,
            group: false,
            notifyParticipants: this.$root.settings.notifications.notifyCustomers,
            payment: {
              amount: 0,
              gateway: '',
              data: {}
            },
            categoryId: null,
            providerId: 0,
            serviceId: null,
            locationId: null
          }
        }
      },
      passedService: {
        default: () => {},
        type: Object
      },
      showLocations: {
        type: Boolean,
        default: false
      },
      showEmployees: {
        type: Boolean,
        default: false
      },
      group: {
        type: Object,
        default: () => {
          return {
            allowed: false,
            enabled: false,
            count: 1,
            options: []
          }
        }
      },
      selectedExtras: {
        type: Array,
        default: () => []
      },
      options: {
        type: Object,
        default: () => {
          return {
            availableEntitiesIds: {
              categories: [],
              employees: [],
              locations: [],
              services: []
            },
            entitiesRelations: {},
            entities: {
              packages: [],
              services: [],
              employees: [],
              locations: [],
              customFields: []
            }
          }
        }
      },
      fetched: {
        type: Boolean,
        default: false
      },
      loadingTimeSlots: {
        type: Boolean,
        default: false
      },
      formType: {
        type: String
      },
      formsData: {
        type: Object,
        default: () => {}
      }
    },

    data () {
      return {
        formName: this.$options.name,
        rules: {
          serviceId: [
            {
              required: true,
              message: this.formsData[this.$options.name].itemsDraggable.serviceFormField ? this.formErrorMessage(this.formsData[this.$options.name].itemsDraggable.serviceFormField.labels.service.value, this.$root.labels.service) : this.formErrorMessage(this.$root.labels.service),
              trigger: 'blur',
              type: 'number'
            }
          ],
          locationId: [
            {
              required: this.$root.settings.customization.forms ? this.$root.settings.customization.forms[this.formType].selectServiceForm.itemsDraggable.locationFormField.required : false,
              message: this.formErrorMessage(this.formsData[this.$options.name].itemsDraggable.locationFormField.labels.locations.value, this.$root.labels.location_colon),
              trigger: 'blur',
              type: 'number'
            }
          ],
          providerId: [
            {
              required: this.$root.settings.customization.forms ? this.$root.settings.customization.forms[this.formType].selectServiceForm.itemsDraggable.employeeFormField.required : false,
              message: this.formErrorMessage(this.formsData[this.$options.name].itemsDraggable.employeeFormField.labels.employee.value, this.$root.labels.employee),
              trigger: 'blur',
              type: 'number'
            }
          ]
        }
      }
    },

    mounted () {
    },

    methods: {
      changeFormItem (fieldObj) {
        this.$emit('change', fieldObj)

        if (typeof this.$refs.booking !== 'undefined') {
          this.$refs.booking.clearValidate()
        }
      },

      getTimeSlots () {
        let formValidation
        this.$refs.booking.validate((valid) => {
          formValidation = valid
          if (!valid) {
            this.$refs.booking.$el.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' })
            return false
          }
        })

        this.$emit('getSlots', formValidation)
      },

      formErrorMessage (customLabel = '', label) {
        let serviceLabel = customLabel || label
        if (serviceLabel && serviceLabel.charAt(serviceLabel.length - 1).match(/:/g)) {
          serviceLabel = serviceLabel.slice(0, -1).toLowerCase()
        }
        return `${this.$root.labels.please_select} ${serviceLabel}`
      }
    }
  }
</script>
