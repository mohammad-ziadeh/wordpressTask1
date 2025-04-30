<template>
  <!-- Employee -->
  <el-form-item
    v-if="showEmployees && formField.visibility"
    :label="labelEmployee || capitalizeFirstLetter($root.labels.employee) + ':'"
    prop="providerId"
    class="am-select-employee-option"
    :class="$root.settings.customization.forms ? `am-select-${classIdentifier}`: ''"
  >
    <el-select
      v-model="appointment.providerId"
      :loading=!fetched
      :clearable="anyEmployeeVisibility ? appointment.providerId !== 0 : true"
      :popper-class="$root.settings.customization.forms ? `am-dropdown-${classIdentifier}` : ''"
      placeholder=""
      @clear="anyEmployeeVisibility ? appointment.providerId = 0 : appointment.providerId = null"
      @change="changeEmployee"
    >
      <el-option
        v-if="anyEmployeeVisibility"
        :key="0"
        :label="labelAnyEmployeeCustom"
        :value="0"
        class="am-select-any-employee-option"
      >
      </el-option>
      <el-option
        v-for="employee in employeesFiltered"
        :key="employee.id"
        :label="employee.firstName + ' ' + employee.lastName"
        :value="employee.id"
      >
      </el-option>
    </el-select>
  </el-form-item>
  <!-- /Employee -->
</template>

<script>
  import helperMixin from '../../../../../js/backend/mixins/helperMixin'
  import entitiesMixin from '../../../../../js/common/mixins/entitiesMixin'

  export default {
    name: 'employeeFormField',

    mixins: [helperMixin, entitiesMixin],

    props: {
      fetched: {
        type: Boolean,
        default: false
      },
      showServices: {
        type: Boolean,
        default: false
      },
      showLocations: {
        type: Boolean,
        default: false
      },
      showEmployees: {
        type: Boolean,
        default: false
      },
      selectedExtras: {
        type: Array,
        default: () => []
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
      classIdentifier: {
        type: String,
        default: ''
      },
      formField: {
        type: Object,
        default: () => {}
      }
    },

    created () {
      if (!this.formField.anyEmployeeVisible) {
        this.appointment.providerId = null
      }
    },

    data () {
      return {
        anyEmployeeVisibility: this.formField.anyEmployeeVisible,
        labelEmployee: this.formField.labels.employee.value,
        labelAnyEmployee: this.$root.settings.labels.enabled ? this.$root.labels.any + ' ' + this.$root.labels.employee : this.$root.labels.any_employee,
        labelAnyEmployeeCustom: this.formField.labels.any_employee.value || (this.$root.settings.labels.enabled ? this.$root.labels.any + ' ' + this.$root.labels.employee : this.$root.labels.any_employee)
      }
    },

    methods: {
      changeEmployee () {
        const fieldObj = {
          identifier: 'changeEmployee',
          required: this.formField.required
        }
        this.$emit('change', fieldObj)
      }
    }
  }
</script>

<style scoped>

</style>