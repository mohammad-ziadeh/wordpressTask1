<template>
  <!-- Location -->
  <el-form-item
    v-if="showLocations && formField.visibility"
    :label="locationLabel ? locationLabel : $root.labels.location_colon"
    prop="locationId"
    class="am-select-location-option"
    :class="$root.settings.customization.forms ? `am-select-${classIdentifier}`: ''"
  >
    <el-select
      v-model="appointment.locationId"
      :loading=!fetched
      :popper-class="$root.settings.customization.forms ? `am-dropdown-${classIdentifier}` : ''"
      clearable
      placeholder=""
      @change="changeLocation"
    >
      <el-option
        v-for="location in locationsFiltered"
        :disabled="location.disabled"
        :key="location.id"
        :label="location.name"
        :value="location.id"
      >
      </el-option>
    </el-select>
  </el-form-item>
  <!-- /Location -->

</template>

<script>
  import entitiesMixin from '../../../../../js/common/mixins/entitiesMixin'

  export default {
    name: 'locationFormField',

    mixins: [entitiesMixin],

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

    data () {
      return {
        locationLabel: this.formField.labels.locations.value
      }
    },

    methods: {
      changeLocation () {
        const fieldObj = {
          identifier: 'changeLocation',
          required: this.formField.required
        }
        this.$emit('change', fieldObj)
      }
    }
  }
</script>
