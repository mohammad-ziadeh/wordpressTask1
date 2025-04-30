<template>
  <div>
    <!-- Bringing anyone with you -->
    <el-form-item
      label=""
      :class="$root.settings.customization.forms ? `am-block-${classIdentifier}`: ''"
      v-show="group.allowed && (appointment.serviceId ? checkBringingAnyone() : false)"
    >
      <el-row>
        <el-col :span="18">
          <span style="font-weight: 700; font-size: 16px">
            {{ bringingLabel ? bringingLabel : $root.labels.bringing_anyone_with_you }}
          </span>
        </el-col>
        <el-col :span="6" class="am-align-right">
          <el-switch v-model="group.enabled" @change="enableGrouping"></el-switch>
        </el-col>
      </el-row>
    </el-form-item>

    <!-- Number of persons -->
    <transition name="fade">
      <div class="am-grouped" v-show="group.enabled && (appointment.serviceId ? checkBringingAnyone() : false)">
        <el-form-item
          :label="numberOfPersons ? numberOfPersons : $root.labels.number_of_additional_persons"
          :class="$root.settings.customization.forms ? `am-select-${classIdentifier}`: ''"
        >
          <el-select
            v-model="appointment.bookings[0].persons"
            :popper-class="$root.settings.customization.forms ? `am-dropdown-${classIdentifier}` : ''"
            placeholder=""
            @change="changeNumberOfPersons"
          >
            <el-option
              v-for="item in group.options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </div>
    </transition>
  </div>
</template>

<script>
  import entitiesMixin from '../../../../../js/common/mixins/entitiesMixin'

  export default {
    name: 'bringingFormField',

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
        bringingLabel: this.formField.labels.bringing_anyone_with_you.value,
        numberOfPersons: this.formField.labels.number_of_additional_persons.value
      }
    },

    methods: {
      checkBringingAnyone () {
        let service = this.getServiceById(this.appointment.serviceId)
        return service.bringingAnyone && (service.maxExtraPeople === null || service.maxExtraPeople > 0)
      },

      enableGrouping () {
        this.$emit('enableGrouping')
      },

      changeNumberOfPersons () {
        const fieldObj = {
          identifier: 'changeNumberOfPersons'
        }
        this.$emit('change', fieldObj)
      }
    }
  }
</script>
