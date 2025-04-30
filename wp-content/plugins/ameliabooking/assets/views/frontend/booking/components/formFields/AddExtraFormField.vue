<template>
  <div v-if="appointment.serviceId && (getServiceById(appointment.serviceId).mandatoryExtra ? true : formField.visibility)">
    <!-- Extra Block -->
    <transition-group name="fade" class="am-extras-add">
      <div
        class="am-extras"
        v-if="appointment.serviceId && getServiceById(appointment.serviceId).extras.length > 0 && (getServiceById(appointment.serviceId).mandatoryExtra ? true : formField.visibility)"
        v-for="(selectedExtra, key) in selectedExtras"
        :key="key + 1"
      >
        <el-row :gutter="16" class="am-flex-row-middle-align-mobile">

          <!-- Extra Type -->
          <el-col :span="(key >= appointment.bookings[0].minSelectedExtras || !appointment.bookings[0].haveMandatoryExtras) ? 14 : 17">
            <el-form-item
              :label="extraColonLabel ? extraColonLabel : $root.labels.extra_colon"
              :error="extrasError.includes(key) ? $root.labels.extra_error : ''"
              :class="[
                $root.settings.customization.forms ? `am-select-${classIdentifier}`: '',
                (key < appointment.bookings[0].minSelectedExtras && appointment.bookings[0].haveMandatoryExtras) ? 'is-required' : ''
              ]"
            >
              <el-select
                v-model="selectedExtra.id"
                :popper-class="$root.settings.customization.forms ? `am-dropdown-${classIdentifier}` : ''"
                placeholder=""
                @change="changeSelectedExtra(selectedExtra, key)"
              >
                <el-option
                  v-for="extra in getAvailableExtras(selectedExtra)"
                  :key="extra.id"
                  :label="extra.name"
                  :value="extra.id"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <!-- Extra Quantity -->
          <el-col :span="7">
            <el-form-item
              :label="qtyColonLabel ? qtyColonLabel : $root.labels.qty_colon"
              :class="$root.settings.customization.forms ? `am-select-${classIdentifier}`: ''"
            >
              <el-select
                v-model="selectedExtra.quantity"
                placeholder=""
                :disabled="selectedExtra.id === null"
                :popper-class="$root.settings.customization.forms ? `am-dropdown-${classIdentifier}` : ''"
                @change="changeSelectedExtra(selectedExtra)"
              >
                <el-option
                  v-for="i in getSelectedExtraMaxQuantity(selectedExtra)"
                  :key="i"
                  :label="i"
                  :value="i"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <!-- Remove Extra -->
          <el-col :span="3" class="am-align-right" v-show="key >= appointment.bookings[0].minSelectedExtras || !appointment.bookings[0].haveMandatoryExtras">
            <div class="am-delete-element" @click="deleteExtra(key)">
              <i class="el-icon-minus"></i>
            </div>
          </el-col>

        </el-row>

        <!-- Extra Duration & Price-->
        <el-row
          v-if="selectedExtra.duration || selectedExtra.price"
          :gutter="16" class="am-flex-row-middle-align-mobile"
        >

          <!-- Extra Duration -->
          <el-col :span="14">
            <el-form-item
              :label="durationColonLabel ? durationColonLabel : $root.labels.duration_colon"
              :class="$root.settings.customization.forms ? `am-block-${classIdentifier}`: ''"
            >
              <span>
                {{  selectedExtra.duration ? secondsToNiceDuration(selectedExtra.duration) : '/'  }}
              </span>
            </el-form-item>
          </el-col>

          <!-- Extra Price -->
          <el-col :span="10" v-if="selectedExtra.price">
            <el-form-item
              :label="priceColonLabel ? priceColonLabel : $root.labels.price_colon"
              :class="$root.settings.customization.forms ? `am-block-${classIdentifier}`: ''"
            >
              <span>
                {{ getFormattedPrice(selectedExtra.price, !$root.settings.payments.hideCurrencySymbolFrontend)  }}
              </span>
            </el-form-item>
          </el-col>

        </el-row>

      </div>
    </transition-group>

    <!-- Add extra -->
    <div
      class="am-add-element"
      v-show="appointment.serviceId && selectedExtras.length < getServiceById(appointment.serviceId).extras.length"
      @click="addExtra"
    >
      <i class="el-icon-plus"></i> <span>{{ addExtraColonLabel ? addExtraColonLabel : $root.labels.add_extra }}</span>
    </div>
  </div>
</template>

<script>
  import entitiesMixin from '../../../../../js/common/mixins/entitiesMixin'
  import durationMixin from '../../../../../js/common/mixins/durationMixin'
  import priceMixin from '../../../../../js/common/mixins/priceMixin'

  export default {
    name: 'addExtraFormField',

    mixins: [entitiesMixin, durationMixin, priceMixin],

    props: {
      extrasError: {
        type: Array,
        default: () => []
      },
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
        extraColonLabel: this.formField.labels.extra_colon.value,
        qtyColonLabel: this.formField.labels.qty_colon.value,
        durationColonLabel: this.formField.labels.duration_colon.value,
        priceColonLabel: this.formField.labels.price_colon.value,
        addExtraColonLabel: this.formField.labels.add_extra.value
      }
    },

    methods: {
      getAvailableExtras (selectedExtra) {
        let selectedExtras = []
        let availableExtras = []

        this.selectedExtras.forEach(function (extra) {
          if (extra.id) {
            selectedExtras.push(extra.id)
          }
        })

        this.getServiceById(this.appointment.serviceId).extras.forEach(function (extra) {
          if (selectedExtras.indexOf(extra.id) === -1 || selectedExtra.id === extra.id) {
            availableExtras.push(extra)
          }
        })

        return availableExtras
      },

      getSelectedExtraMaxQuantity (selectedExtra) {
        let extra = this.getServiceById(this.appointment.serviceId).extras.find(extra => extra.id === selectedExtra.id)

        return typeof extra !== 'undefined' ? extra.maxQuantity : ''
      },

      changeSelectedExtra (val, key) {
        const fieldObj = {
          identifier: 'changeSelectedExtra',
          value: val,
          key: key
        }
        this.$emit('change', fieldObj)
      },

      deleteExtra (val) {
        const fieldObj = {
          identifier: 'deleteExtra',
          value: val
        }
        this.$emit('change', fieldObj)
      },

      addExtra () {
        const fieldObj = {
          identifier: 'addExtra'
        }
        this.$emit('change', fieldObj)
      }
    }
  }
</script>
