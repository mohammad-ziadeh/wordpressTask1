<template>
  <div v-if="formField.visibility">
    <div class="am-package" v-for="pack in getAvailablePackages()" v-if="!passedService" @click="selectPackage(pack)">
      <el-row>
        <el-col :span="16" class="am-package-name" :class="$root.settings.customization.forms ? `am-block-${classIdentifier}`: ''">
          <p class="am-gray-text">{{ formField.labels.package_available.value || $root.labels.package_available }}</p>
          <p class="am-large-text">{{ pack.name }}</p>
        </el-col>

        <el-col :span="8" class="am-package-price">
          <p class="am-large-text">{{ getFormattedPrice(getPackagePrice(pack), !$root.settings.payments.hideCurrencySymbolFrontend) }}</p>
          <p class="am-discount-text">
            {{ pack.discount && !pack.calculatedPrice ? (formField.labels.package_discount_text.value || $root.labels.package_discount_text) + ' ' + pack.discount + '%' : ''}}
          </p>
        </el-col>
      </el-row>

      <el-row class="am-package-services">
        <el-col :span="19" :class="$root.settings.customization.forms ? `am-block-${classIdentifier}`: ''">
          <p v-for="bookable in pack.availableBookableInfo" :key="bookable.serviceId">{{ bookable.serviceName }}</p>
        </el-col>

        <el-col :span="3">
          <p class="am-package-appointment-number" v-for="bookable in pack.availableBookableInfo" :key="bookable.serviceId" v-if="!pack.sharedCapacity">x{{ bookable.serviceQuantity }}</p>
        </el-col>

        <el-col :span="2" class="am-package-book">
          <span class="am-package-appointment-number" v-if="pack.sharedCapacity">x{{ pack.quantity }}</span><i class="el-icon-right"></i>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
  import packageMixin from '../../../../../js/frontend/mixins/packageMixin'
  import priceMixin from '../../../../../js/common/mixins/priceMixin'

  export default {
    name: 'servicePackageFormField',

    mixins: [packageMixin, priceMixin],

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
      passedService: {
        type: Object,
        default: () => {}
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

    methods: {
      selectPackage (val) {
        const fieldObj = {
          identifier: 'selectPackage',
          value: val
        }
        this.$emit('change', fieldObj)
      }
    }
  }
</script>
