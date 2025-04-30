<template>
  <div class="am-capai-cuf" :style="cssVars">
    <!-- Warning -->
    <WarningBlock
      v-if="props.capacityWarning"
      :heading="props.capacityWarning"
    />
    <!-- /Warning -->

    <!-- Heading -->
    <div class="am-capai-cuf__heading" :class="props.responsiveClass">
      <!-- Select Customer -->
      <el-form
        ref="customersFormRef"
        :model="customersForm"
        :rules="customersFormRules"
        class="am-capai-cuf__heading-form"
        :class="props.responsiveClass"
      >
        <el-form-item
          :prop="'customersIds'"
          class="am-capai-cuf__heading-form__item"
        >
          <AmSelect
            v-model="customersForm.customersIds"
            filterable
            clearable
            multiple
            collapse-tags
            collapse-tags-tooltip
            remote
            popper-class="am-capai-cuf__popper-customer"
            :placeholder="`${amLabels.select_customers}`"
            :remote-method="
              (val) => {
                useSearchCustomers(store, val)
              }
            "
            :loading="searchingCustomers"
            @change="selectCustomer"
            @focus="useFocusCustomers(store)"
          >
            <AmOption
              v-for="item in customers"
              :key="item.id"
              :disabled="
                employeeService?.maxCapacity === appointmentCapacity &&
                customersForm.customersIds.indexOf(item.id) === -1
              "
              :value="item.id"
              :label="item.email && customerEmailVisibility ? item.email : item.firstName + ' ' + item.lastName"
            >
              <div class="am-cap__cust-option">
                <div class="am-cap__cust-option__heading">
                  {{ item.firstName + ' ' + item.lastName }}
                </div>
                <div
                  v-if="customerEmailVisibility && item.email"
                  class="am-cap__cust-option__inner"
                >
                  {{ item.email }}
                </div>
                <div
                  v-if="customerPhoneVisibility && item.phone"
                  class="am-cap__cust-option__inner"
                >
                  {{ item.phone }}
                </div>
              </div>
            </AmOption>
          </AmSelect>
        </el-form-item>
      </el-form>
      <!-- /Select Customer -->

      <!-- Add Customer -->
      <AmButton
        v-if="amSettings.roles.allowWriteCustomers"
        class="am-capai-cuf__heading-add"
        :class="props.responsiveClass"
        :size="'default'"
        prefix="plus"
        icon="plus"
        :icon-only="pageWidth <= 540"
        :disabled="employeeService?.maxCapacity === appointmentCapacity"
        @click="addCustomer"
      >
        {{ amLabels.new_customer }}
      </AmButton>
      <!-- /Add Customer -->
    </div>
    <!-- /Heading -->

    <!-- Content -->
    <div class="am-capai-cuf__content">
      <!-- Bulk Customer Status -->
      <div
        v-if="store.getters['appointment/getBookings'].length > 1"
        class="am-capai-cuf__bulk"
        :class="props.responsiveClass"
      >
        <div class="am-capai-cuf__bulk-label">
          {{ amLabels.change_group_status }}
        </div>
        <AmSelect
          v-model="bulkBookingStatus"
          clearable
          size="small"
          placeholder="Group Status"
          popper-class="am-capai-cuf__popper"
          :parent-class="`am-capai-cuf__bulk-status ${props.responsiveClass}`"
          :prefix-icon="
            bulkBookingStatus
              ? bookingStatuses.find((i) => i.value === bulkBookingStatus).icon
              : 'circle-empty'
          "
          :prefix-icon-color="
            bulkBookingStatus
              ? bookingStatuses.find((i) => i.value === bulkBookingStatus).color
              : 'var(--am-c-select-text-op40)'
          "
          @change="bulkChangeStatus"
        >
          <AmOption
            v-for="item in bookingStatuses"
            :key="item.value"
            :value="item.value"
            :label="item.label"
          >
            <span
              :class="`am-icon-${item.icon}`"
              :style="`color: ${item.color}`"
            ></span>
            {{ item.label }}
          </AmOption>
        </AmSelect>
      </div>
      <!-- /Bulk Customer Status -->

      <!-- Card -->
      <div
        v-for="(item, index) in customersForDisplay"
        :key="index"
        class="am-capai-cuf__card"
        :class="props.responsiveClass"
      >
        <!-- Card Info -->
        <div class="am-capai-cuf__card-info" :class="props.responsiveClass">
          <!-- Customer Name -->
          <div
            class="am-capai-customer__name"
            :class="noShowData(item.customer.noShowCount).class"
          >
            <span
              v-if="noShowData(item.customer.noShowCount).icon"
              :class="`am-icon-${noShowData(item.customer.noShowCount).icon}`"
            />
            {{ item.customer.firstName + ' ' + item.customer.lastName }}
          </div>
          <!-- /Customer Name -->

          <!-- Customer Phone -->
          <div
            v-if="item.customer.phone && customerPhoneVisibility"
            class="am-capai-customer__data"
          >
            <span class="am-icon-phone"></span>
            <a :href="`tel:${item.customer.phone}`">
              {{ item.customer.phone }}
            </a>
          </div>
          <!-- /Customer Phone -->

          <!-- Customer Email -->
          <div
            v-if="item.customer.email && customerEmailVisibility"
            class="am-capai-customer__data"
          >
            <span class="am-icon-email"></span>
            <a :href="`mailto:${item.customer.email}`">
              {{ item.customer.email }}
            </a>
          </div>
          <!-- /Customer Email -->
        </div>
        <!-- /Card Info -->

        <!-- Card Booking -->
        <div class="am-capai-cuf__card-booking" :class="props.responsiveClass">
          <!-- Status -->
          <AmSelect
            v-model="item.status"
            :prefix-icon="
              bookingStatuses.find((i) => i.value === item.status).icon
            "
            :prefix-icon-color="
              bookingStatuses.find((i) => i.value === item.status).color
            "
            popper-class="am-capai-cuf__popper"
            size="small"
            @change="(value) => changeBookingStatus(index, value)"
          >
            <AmOption
              v-for="status in bookingStatuses"
              :key="status.value"
              :value="status.value"
              :label="
                bookingStatuses.find((i) => i.value === item.status).label
              "
            >
              <span
                :class="`am-icon-${status.icon}`"
                :style="`color: ${status.color}`"
              />
              {{ status.label }}
            </AmOption>
          </AmSelect>
          <!-- /Status -->

          <!-- Capacity -->
          <AmSelect
            v-if="employeeService.maxCapacity > 1"
            v-model="item.persons"
            :parent-class="`${bookingClassDropdown(
              employeeService.maxCapacity > 1,
              Object.keys(employeeService.customPricing.durations).length > 1
            )} ${props.responsiveClass}`"
            :placeholder="amLabels.persons"
            prefix-icon="users"
            prefix-icon-color="var(--am-c-card-text)"
            size="small"
            @change="(value) => changeBookingPersons(index, value)"
          >
            <AmOption
              v-for="persons in employeeService?.maxCapacity"
              :key="persons"
              :disabled="
                appointmentCapacity - item.persons + persons >
                employeeService?.maxCapacity
              "
              :value="persons"
              :label="persons"
            />
          </AmSelect>
          <!-- /Capacity -->

          <!-- Duration -->
          <AmSelect
            v-if="
              Object.keys(employeeService.customPricing.durations).length > 1
            "
            v-model="item.duration"
            :parent-class="`${bookingClassDropdown(
              employeeService.maxCapacity > 1,
              Object.keys(employeeService.customPricing.durations).length > 1
            )} ${props.responsiveClass}`"
            :placeholder="amLabels.duration"
            prefix-icon="clock"
            prefix-icon-color="var(--am-c-card-text)"
            size="small"
            @change="(value) => changeBookingDuration(index, value)"
          >
            <AmOption
              v-for="duration in Object.keys(
                employeeService.customPricing.durations
              )"
              :key="duration"
              :value="duration"
              :label="useSecondsToDuration(duration, amLabels.h, amLabels.min)"
            />
          </AmSelect>
          <!-- /Duration -->
        </div>
        <!-- /Card Booking -->

        <DotsPopup
          :index="index"
          :reference-class="props.responsiveClass"
          :have-edit="amSettings.roles.allowWriteCustomers"
          @remove="removeBooking"
          @edit="editCustomer(item.customer.id)"
        />
      </div>
      <!-- /Card -->
    </div>
    <!-- /Content -->

    <!-- Add/Edit Customer -->
    <AddEditCustomerDialog
      v-if="addEditCustomerDialogVisibility"
      :visibility="addEditCustomerDialogVisibility"
      :responsive-class="props.responsiveClass"
      @update:visibility="(e) => (addEditCustomerDialogVisibility = e)"
      @added-customer="addedCustomer"
    />
    <!-- /Add/Edit Customer -->
  </div>
</template>

<script setup>
// * Import from Vue
import {
  computed,
  ref,
  inject,
  onMounted
} from 'vue'

// * Import Store
import { useStore } from 'vuex'
import httpClient from '../../../../../../plugins/axios'

// * Import Composable
import { useAuthorizationHeaderObject } from '../../../../../../assets/js/public/panel'
import { useFrontendCustomer } from '../../../../../../assets/js/common/customer'
import {
  useFocusCustomers,
  useSearchCustomers,
} from '../../../../../../assets/js/admin/customers'
import { useSecondsToDuration } from '../../../../../../assets/js/common/date'
import { useStatuses } from '../../../../../../assets/js/admin/status'

// * Import Parts
import DotsPopup from '../../../../Parts/DotsPopup.vue'
import WarningBlock from './common/WarningBlock.vue'

// * Import Components
import AmOption from '../../../../../_components/select/AmOption.vue'
import AmSelect from '../../../../../_components/select/AmSelect.vue'
import AmButton from '../../../../../_components/button/AmButton.vue'
import AddEditCustomerDialog from './common/AddEditCustomerDialog.vue'

// * Component Props
const props = defineProps({
  responsiveClass: {
    type: String,
    default: '',
  },
  capacityWarning: {
    type: String,
    default: '',
  },
  appointmentCapacity: {
    type: Number,
    default: 0,
  },
  savedAppointment: {
    type: Object,
    default: () => {},
  },
})

// * Emits
const emits = defineEmits(['changedSlotCondition'])

// * Store
let store = useStore()

// * Data in shortcode
const shortcodeData = inject('shortcodeData')

// * Settings
const amSettings = inject('settings')

// * Customize data
let amCustomize = inject('amCustomize')

// * Labels
let amLabels = inject('amLabels')

// * Page Width
let pageWidth = inject('pageWidth')

// * Employee Service
let employeeService = computed(
  () => store.getters['appointment/getEmployeeService']
)

// * Form Reference
let customersFormRef = ref(null)

// * Form Data
let customersForm = ref({
  customersIds: computed({
    get: () => store.getters['customerInfo/getCustomersIds'],
    set: (value) => store.commit('customerInfo/setCustomersIds', value),
  }),
})

// * Form Rules
let customersFormRules = ref({
  customersIds: [
    {
      required: true,
      message: amLabels.value.select_customers,
      trigger: ['submit', 'change'],
    },
  ],
})

// * Customer Searching
let searchingCustomers = computed(
  () => store.getters['customerInfo/getLoading']
)

// * Customers
let customers = computed(() => store.getters['customerInfo/getCustomers'])

// * Bulk Booking Status
let bulkBookingStatus = ref(amSettings.general.defaultAppointmentStatus)

// * Booking Statuses
let bookingStatuses = computed(() => {
  return useStatuses().filter((i) =>
    !store.getters['appointment/getId']
      ? (i.value === 'approved' || i.value === 'pending') &&
        i.value !== 'no-show'
      : i.value !== 'waiting'
  )
})

// * Customers For Display
let customersForDisplay = computed(() => {
  if (!store.getters['appointment/getBookings']) {
    return []
  }

  return store.getters['appointment/getBookings']
})

let addEditCustomerDialogVisibility = ref(false)

function addedCustomer(customer) {
  store.commit(
    'customerInfo/setCustomersIds',
    [customer.id].concat(store.getters['customerInfo/getCustomersIds'])
  )

  store.commit(
    'customerInfo/setCustomers',
    [customer].concat(store.getters['customerInfo/getCustomers'])
  )

  selectCustomer()
}

// * Select Customer
function selectCustomer() {
  let bookingsCustomersIds = store.getters['appointment/getBookings'].map((i) =>
    parseInt(i.customer.id)
  )

  let changedCapacity = false

  let settings = employeeService.value.settings
    ? JSON.parse(employeeService.value.settings)
    : null

  customersForm.value.customersIds
    .filter((id) => !bookingsCustomersIds.includes(id))
    .forEach((id) => {
      let booking = {}

      if (props.savedAppointment) {
        props.savedAppointment.bookings.forEach((savedBooking) => {
          if (parseInt(savedBooking.customer.id) === parseInt(id)) {
            booking = savedBooking
          }
        })
      }

      changedCapacity = store.getters['appointment/getBookings'].length > 1

      store.getters['appointment/getBookings'].push(
        Object.assign(
          {
            id: null,
            customer: customers.value.find((c) => c.id === parseInt(id)),
            persons: 1,
            status:
              settings &&
              'general' in settings &&
              'defaultAppointmentStatus' in settings.general
                ? settings.general.defaultAppointmentStatus
                : amSettings.general.defaultAppointmentStatus,
            duration: Object.keys(
              employeeService.value.customPricing.durations
            )[0],
            extras: employeeService.value.extras.map(
              (e) =>
                new Object({
                  extraId: e.id,
                  quantity: 0,
                })
            ),
            customFields: {},
          },
          booking
        )
      )

      store.dispatch(
        'appointment/resetBookingCustomFields',
        store.getters['appointment/getBookings'].length - 1
      )
      store.dispatch('appointment/addCustomFieldsFormRules', {
        key: store.getters['appointment/getBookings'].length - 1,
        label: amLabels.value.required_field,
      })

      store.commit('appointment/setBooking', {
        index: store.getters['appointment/getBookings'].length - 1,
        value:
          store.getters['appointment/getBookings'][
            store.getters['appointment/getBookings'].length - 1
          ],
      })
    })

  let removedCustomersIds = bookingsCustomersIds.filter(
    (x) => !customersForm.value.customersIds.includes(x)
  )

  let removedIndexes = []

  store.getters['appointment/getBookings'].forEach((booking, index) => {
    if (removedCustomersIds.indexOf(booking.customer.id) !== -1) {
      removedIndexes.push(index)
    }
  })

  let bookingsCount = store.getters['appointment/getBookings'].length

  for (let j = bookingsCount - 1; j >= 0; j--) {
    if (removedIndexes.indexOf(j) !== -1) {
      changedCapacity = true

      store.dispatch('appointment/removeBooking', j)
    }
  }

  if (changedCapacity) {
    emits('changedSlotCondition')
  }
}

function addCustomer() {
  store.dispatch('customerInfo/resetCustomer')

  addEditCustomerDialogVisibility.value = true
}

function editCustomer(id) {
  store.dispatch('customerInfo/resetCustomer')

  store.commit('customerInfo/setLoading', true)

  addEditCustomerDialogVisibility.value = true

  httpClient
    .get(
      '/users/customers/' + id,
      Object.assign(
        {
          params: {
            source: 'cabinet-provider',
          },
        },
        useAuthorizationHeaderObject(store)
      )
    )
    .then((response) => {
      store.commit(
        'customerInfo/setCustomer',
        useFrontendCustomer(store, response.data.data.user)
      )
    })
    .catch((error) => {
      console.log(error)
    })
    .finally(() => {
      store.commit('customerInfo/setLoading', false)
    })
}

// * Remove Booking
function removeBooking(index) {
  store.dispatch('appointment/removeBooking', index)
  store.dispatch('appointment/deleteAllCustomFieldsFormRules')
  store.dispatch('appointment/addAllCustomFieldsFormRules', {
    label: amLabels.value.required_field,
  })

  emits('changedSlotCondition')
}

const { noShowData } = inject('noShowData')

function bookingClassDropdown(one, two) {
  if (one && two) {
    return 'am-w-50'
  }

  return ''
}

// * Bulk Change Status
function bulkChangeStatus(status) {
  if (status) {
    store.commit('appointment/setAllBookingsStatus', status)
  }
}

// * Change Booking Status
function changeBookingStatus(index, value) {
  store.commit('appointment/setBookingStatus', { index, value })
}

// * ChangeBookingPersons
function changeBookingPersons(index, value) {
  store.commit('appointment/setBookingPersons', { index, value })

  emits('changedSlotCondition')
}

// * Change Booking Duration
function changeBookingDuration(index, value) {
  store.commit('appointment/setBookingDuration', { index, value })

  emits('changedSlotCondition')
}

// * Customized options
let customerPhoneVisibility = computed(() =>
  shortcodeData.value.cabinetType === 'employee'
    ? amCustomize.value.appointments.options.customerPhone.visibility
    : true
)
let customerEmailVisibility = computed(() =>
  shortcodeData.value.cabinetType === 'employee'
    ? amCustomize.value.appointments.options.customerEmail.visibility
    : true
)

// * Colors
let amColors = inject('amColors')
// * CSS Variables
let cssVars = computed(() => {
  return {
    '--am-c-card-text': amColors.value.colorMainText,
  }
})

onMounted(() => {
  if (store.getters['appointment/getId']) {
    let customersIds = store.getters['appointment/getBookings'].map(
      (i) => i.customer.id
    )

    store.commit('customerInfo/setCustomersIds', customersIds)

    useSearchCustomers(
      store,
      '',
      {
        limit: customersIds.length,
        customers: customersIds,
      },
      () => {
        store.commit(
          'customerInfo/setCustomers',
          store.getters['customerInfo/getCustomers']
            .concat(
              store.getters['auth/getPreloadedCustomers'].filter(
                (i) =>
                  store.getters['customerInfo/getCustomers']
                    .map((j) => j.id)
                    .indexOf(i.id) === -1
              )
            )
            .sort((a, b) => a.id - b.id)
        )
      }
    )
  } else {
    store.commit(
      'customerInfo/setCustomers',
      store.getters['auth/getPreloadedCustomers']
    )
  }
})

// * Expose
defineExpose({
  customersFormRef,
})
</script>

<style lang="scss">
@mixin am-cabinet-appointment-customers {
  // am    - amelia
  // capai - cabinet-panel-appointment-item
  // cuf   - customers form
  .am-capai-cuf {
    display: flex;
    flex-direction: column;
    gap: 24px;

    // Heading
    &__heading {
      display: flex;
      align-items: center;
      gap: 16px;

      &.am-rw {
        &-650 {
          flex-wrap: wrap;
        }

        &-420 {
          gap: 12px;
        }
      }

      &-form {
        width: calc(100% - 196px);

        &.am-rw {
          &-540 {
            width: calc(100% - 56px);
          }
        }

        .el-form-item {
          margin-bottom: 0;

          &__error {
            padding-top: 0;
            color: var(--am-c-error);
          }
        }

        .el-input {
          &__inner {
            height: var(--am-h-select) !important;
          }
        }
      }

      &-add {
        position: relative;
        width: 180px;

        .am-icon-plus {
          font-size: 24px;
        }
      }
    }

    // Content
    &__content {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    // Bulk
    &__bulk {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: 8px;
      margin-bottom: 8px;

      &.am-rw {
        &-360 {
          flex-wrap: wrap;
          justify-content: flex-start;
        }
      }

      &-label {
        font-size: 14px;
        font-weight: 400;
        line-height: 1.42857;
        color: var(--am-c-main-text);
      }

      &-status {
        max-width: 160px;
        width: 100%;

        &.am-rw {
          &-360 {
            max-width: unset;
          }
        }

        &.am-select-wrapper {
          width: 100%;

          .el-input__prefix {
            left: 4px;
            font-size: 24px;
          }
        }
      }
    }

    // Cards
    &__card {
      display: flex;
      align-items: flex-start;
      padding: 16px;
      border: 1px solid var(--am-c-inp-border);
      border-radius: 8px;

      &.am-rw- {
        &480 {
          flex-wrap: wrap;
        }
      }

      // Info
      &-info {
        display: flex;
        flex-direction: column;
        gap: 8px 4px;
        width: 50%;
        align-items: flex-start;

        &.am-rw- {
          &480 {
            width: calc(100% - 24px);
            margin-bottom: 8px;
          }
        }
      }

      // Booking
      &-booking {
        display: flex;
        flex-wrap: wrap;
        align-items: flex-start;
        gap: 8px;
        width: 50%;

        &.am-rw- {
          &480 {
            width: 100%;
            order: 2;
          }
        }

        .am-select-wrapper {
          width: 100%;

          &.am-w-50 {
            width: calc(50% - 4px);

            &.am-rw- {
              &600 {
                width: 100%;
              }

              &480 {
                width: calc(50% - 4px);
              }

              &360 {
                width: 100%;
              }
            }
          }

          .el-input__prefix {
            left: 4px;
            font-size: 24px;
          }
        }
      }

      // Dots Popup
      .am-cc__edit-btn {
        font-size: 24px;
        color: var(--am-c-card-text);
        margin-left: 8px;
        cursor: pointer;

        &.am-rw- {
          &480 {
            order: 1;
            margin: 0;
          }
        }
      }
    }
  }
}

.am-capai-cuf__popper {
  [class^='am-icon-'] {
    font-size: 24px;
    line-height: 0;
  }

  .el-select-dropdown__item {
    display: flex;
    align-items: center;
    gap: 0 8px;
  }

  &-customer {
    .el-select-dropdown__item {
      --am-pad-select-option: 8px 8px 0;
    }

    .am-cap__cust-option {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      padding-bottom: 8px;
      border-bottom: 1px solid var(--am-c-option-text-op15);

      &__heading {
        font-size: 15px;
        font-weight: 500;
        color: var(--am-c-option-text);
      }

      &__inner {
        font-size: 12px;
        font-weight: 400;
        color: var(--am-c-option-text-op65);
      }
    }
  }
}

.amelia-v2-booking #amelia-container {
  @include am-cabinet-appointment-customers;
}
</style>