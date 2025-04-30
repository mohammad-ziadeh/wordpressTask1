<template>
  <!-- Service -->
  <el-form-item
    v-if="showServices"
    :label="serviceLabel || capitalizeFirstLetter($root.labels.service) + ':'"
    prop="serviceId"
    class="am-select-service-option"
    :class="$root.settings.customization.forms ? `am-select-${classIdentifier}`: ''"
  >
    <el-select
      v-model="appointment.serviceId"
      :clearable="true"
      :loading=!fetched
      :popper-class="$root.settings.customization.forms ? `am-dropdown-${classIdentifier}` : ''"
      id="serviceId"
      placeholder=""
      @change="changeService"
    >
      <el-option
        v-for="service in servicesFiltered"
        :key="service.id"
        :label="service.name"
        :value="service.id"
      >
      </el-option>
    </el-select>
  </el-form-item>
  <!-- /Service -->
</template>

<script>
import entitiesMixin from '../../../../../js/common/mixins/entitiesMixin'
import helperMixin from '../../../../../js/backend/mixins/helperMixin'

export default {
  name: 'serviceFormField',

  mixins: [entitiesMixin, helperMixin],

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

  mounted () {},

  data () {
    return {
      serviceLabel: this.formField.labels.service.value
    }
  },

  methods: {
    changeService () {
      const fieldObj = {
        identifier: 'changeService'
      }
      this.$emit('change', fieldObj)
    }
  }
}
</script>