<template>
  <div class="am-wrap">
    <div id="am-appointments" class="am-body">

      <!-- Spinner -->
      <div class="am-spinner am-section" v-show="!fetched || !options.fetched">
        <img :src="$root.getUrl+'public/img/spinner.svg'"/>
      </div>

      <!-- Empty State -->
      <div class="am-empty-state am-section"
           v-if="fetched && packageCustomers.length === 0 && !filterApplied && fetchedFiltered && options.fetched">
        <img :src="$root.getUrl+'public/img/emptystate.svg'">
        <h2>{{ $root.labels.no_appointments_yet }}</h2>
        <p>{{ $root.labels.click_add_appointments }}</p>
      </div>


      <!-- Appointments -->
      <div
        v-show="fetched && options.fetched && (packageCustomers.length !== 0 || (packageCustomers.length === 0 && filterApplied) || !fetchedFiltered)"
      >

        <!-- Global Search & Filters -->
        <div class="am-appointments-filter am-section">

          <div style="margin-bottom: 16px">
            <h1 @click="goBack" style="cursor: pointer;display: inline-block"><img :src="$root.getUrl+'public/img/arrow-back.svg'"> {{ purchasedPackage.name }}</h1>
          </div>

          <el-form :model="params" class="demo-form-inline" :action="exportAction" method="POST">

            <!-- Filters -->
            <transition name="fade">
              <div class="am-filter-fields" v-show="filterFields">
                <el-row :gutter="16" class="am-package-appointment-filters">

                  <!-- Dates Filter -->
                  <el-col :sm="24" :md="12" :lg="8" class="v-calendar-column">
                    <el-form-item prop="dates">
                      <v-date-picker
                          @input="changeRange"
                          v-model="params.dates"
                          :is-double-paned="false"
                          mode='range'
                          popover-visibility="focus"
                          popover-direction="bottom"
                          tint-color='#1A84EE'
                          :show-day-popover=false
                          :input-props='{class: "el-input__inner"}'
                          :is-expanded=false
                          :is-required=true
                          input-class="el-input__inner"
                          :formats="vCalendarFormats"
                      >
                      </v-date-picker>
                      <span
                          v-if="params.dates"
                          class="am-v-date-picker-suffix el-input__suffix-inner"
                          @click="clearDateFilter"
                      >
                        <i class="el-select__caret el-input__icon el-icon-circle-close"></i>
                      </span>
                    </el-form-item>
                  </el-col>

                  <!-- Customer Filter -->
                  <el-col :sm="24" :md="12" :lg="8">
                    <el-form-item>
                      <el-select
                          v-model="params.customerId"
                          filterable
                          clearable
                          :placeholder="$root.labels.customer"
                          @change="changeFilter"
                          remote
                          :remote-method="searchCustomers"
                          :loading="customersLoading"
                      >
                        <el-option
                            v-for="(item, key) in searchedCustomers.length ? searchedCustomers : options.entities.customers"
                            :key="key"
                            :label="(!item.firstName.trim() && !item.lastName.trim()) ? $root.labels.customer + ' ' + item.id : item.firstName + ' ' + item.lastName"
                            :value="item.id"
                        >
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>

                  <!-- Status Filter -->
                  <el-col :sm="24" :md="12" :lg="8">
                    <el-form-item>
                      <el-select
                          v-model="params.packageStatus"
                          clearable
                          :placeholder="$root.labels.package_status"
                          @change="changeFilter"
                      >
                        <el-option
                            v-for="(item, key) in packageStatuses"
                            :key="key"
                            :label="item.label"
                            :value="item.value"
                        >
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>

                </el-row>
              </div>
            </transition>

            <!-- Dialog Export -->
            <transition name="slide">
              <el-dialog
                  :close-on-click-modal="false"
                  class="am-side-dialog am-dialog-export"
                  :visible.sync="dialogExport"
                  :show-close="false"
                  v-if="dialogExport"
              >
                <dialog-export
                    :data="Object.assign(params, exportParams)"
                    :action="$root.getAjaxUrl + '/report/appointments'"
                    @updateAction="(action) => {this.exportAction = action}"
                    @closeDialogExport="dialogExport = false"
                >
                </dialog-export>
              </el-dialog>
            </transition>

          </el-form>
        </div>

        <!-- No Results -->
        <div class="am-empty-state am-section"
             v-show="fetched && Object.keys(packageCustomers).length === 0 && filterApplied && fetchedFiltered && options.fetched">
          <img :src="$root.getUrl + 'public/img/emptystate.svg'">
          <h2>{{ $root.labels.no_results }}</h2>
        </div>

        <!-- Content Spinner -->
        <div class="am-spinner am-section" v-show="!fetchedFiltered">
          <img :src="$root.getUrl+'public/img/spinner.svg'"/>
        </div>

        <!-- Appointment List -->
        <div
          class="am-appointments am-section"
          v-show="fetchedFiltered && options.fetched && Object.keys(packageCustomers).length !== 0"
        >

          <!-- Appointment List Header -->
          <div class="am-appointments-list-head">
            <el-row>
              <el-col :lg="12">
                <el-row :gutter="10" type="flex" justify="space-around" align="middle">

                  <!-- Checkbox -->
                  <el-col :lg="2" :sm="2">
                  </el-col>

                  <!-- Appointment List Customer Label -->
                  <el-col :lg="8" :md="8" :sm="12">
                    <p>{{ $root.labels.customer }}:</p>
                  </el-col>

                  <!-- Appointment List Spots Label -->
                  <el-col :lg="7" :md="7" :sm="12">
                    <p>{{ $root.labels.appointments }}:</p>
                  </el-col>

                  <!-- Appointment Date Booked Label -->
                  <el-col :lg="7" :md="7" :sm="12">
                    <p>{{ $root.labels.package_date_purchased }}:</p>
                  </el-col>


                </el-row>
              </el-col>

              <el-col :lg="12">
                <el-row :gutter="10" type="flex" justify="space-around" align="middle">

                  <!-- Package Employees Label -->
                  <el-col :lg="6" :md="6">
                    <p>{{ $root.labels.employees }}:</p>
                  </el-col>

                  <!-- Package Price Label -->
                  <el-col :lg="5" :sm="5">
                    <p>{{ $root.labels.price }}:</p>
                  </el-col>

                  <!-- Package Payment Status Label -->
                  <el-col :lg="6" :md="7">
                    <p>{{ $root.labels.package_payment_status }}:</p>
                  </el-col>

                  <!-- Package Status Label -->
                  <el-col :lg="7" :sm="3" :xs="8">

                  </el-col>

                </el-row>
              </el-col>

            </el-row>
          </div>

          <!-- Appointment List Content -->
          <div>

            <!-- Appointments -->
            <div class="am-appointments-list">
              <el-collapse>
                <el-collapse-item
                  v-for="(packageCustomer, packageCustomerId) in packageCustomers"
                  :key="packageCustomerId"
                  :name="packageCustomerId"
                  class="am-appointment"
                  :class="appointmentCameFrom(packageCustomer)"
                >
                  <template slot="title">
                    <div class="am-appointment-data">
                      <el-row>

                        <el-col :lg="12">
                          <el-row :gutter="15" class="am-appointments-flex-row-middle-align">

                            <!-- Checkbox -->
                            <el-col :lg="2" :sm="2">
                              <span class="am-appointment-checkbox" @click.stop>
                                <el-checkbox
                                  v-if="$root.settings.capabilities.canDelete === true"
                                  @change="handleCheckPackageAppointments(packageCustomerId)"
                                  v-model="packageCustomer.checked"
                                  :value="packageCustomer.checked"
                                  :label="packageCustomer.checked"
                                >
                                </el-checkbox>
                              </span>
                            </el-col>


                            <!-- Customer -->
                            <el-col :lg="8" :sm="8" :xs="24">
                              <p class="am-col-title">{{ $root.labels.customer }}:</p>
                              <template>
                                <h3>
                                  <span :class="getNoShowClass(packageCustomer.appointments[0].booking.customer.id, customersNoShowCount, null, packageCustomer.appointments[0].booking.customer.status)">
                                    {{ (user = getCustomerInfo(packageCustomer.appointments[0].booking)) !== null ? (!user.firstName.trim() && !user.lastName.trim() ? $root.labels.customer + ' ' + user.id : user.firstName + ' ' + user.lastName) : '' }}
                                  </span>
                                </h3>
                                <span>{{ packageCustomer.appointments[0].booking.customer.email }}</span>

                              </template>
                            </el-col>

                            <!-- Appointments Count -->
                            <el-col :lg="7" :sm="7">
                              <p class="am-col-title">{{ $root.labels.appointments }}:</p>
                              <h3>{{ packageCustomer.total }} {{ $root.labels.package_total }}</h3>
                              <span> {{ packageCustomer.count }} {{ $root.labels.package_to_be_booked }}</span>
                            </el-col>

                            <!-- Date purchased -->
                            <el-col :lg="7" :sm="7" :xs="12">
                              <p class="am-col-title">{{ $root.labels.package_date_purchased }}:</p>
                              <h3>{{ getFrontedFormattedDateFromDateTimeString(packageCustomer.appointments[0].booking.packageCustomerService.packageCustomer.purchased) }}</h3>
                              <span>{{ getFrontedFormattedTimeFromDateTimeString(packageCustomer.appointments[0].booking.packageCustomerService.packageCustomer.purchased) }}</span>
                              <span :class="'am-appointment-package-purchased-status am-appointment-package-purchased-status-' + getPackagePurchasedExpiration(packageCustomer.appointments[0].booking.packageCustomerService.packageCustomer.end).class">
                                {{ getPackagePurchasedExpiration(packageCustomer.appointments[0].booking.packageCustomerService.packageCustomer.end).label }}
                              </span>
                            </el-col>

                          </el-row>
                        </el-col>

                        <el-col :lg="12">
                          <el-row :gutter="15" class="am-appointments-flex-row-middle-align">
                            <el-col :lg="0" :md="2" :sm="2"></el-col>

                            <!-- Employees -->
                            <el-col :lg="6" :sm="6">
                              <p class="am-col-title">{{ $root.labels.employees }}:</p>
                              <div class="am-category-services-thumbs">
                                <img
                                  v-for="(providerId, index) in getPurchasedPackageProviders(packageCustomer.appointments)"
                                  v-if="index < 3"
                                  :key="providerId"
                                  :src="pictureLoad(getProviderById(providerId), true)"
                                  @error="imageLoadError(getProviderById(providerId), true)"
                                >
                              </div>
                            </el-col>

                            <!-- Price -->
                            <el-col class="am-appointment-payment" :lg="5" :sm="5" :xs="13">
                              <p class="am-col-title">{{ $root.labels.price }}:</p>
                              <h3>{{ getFormattedPrice(getPackageDiscountedPrice(packageCustomer.appointments[0].booking.packageCustomerService.packageCustomer)) }}</h3>
                            </el-col>

                            <!-- Payment Status -->
                            <el-col :lg="6" :sm="6" :xs="16" class="am-finance-payment-status">
                              <p class="am-col-title">{{ $root.labels.package_payment_status }}:</p>
                              <div class="am-payment-status">
                                <span :class="'am-payment-status-symbol am-payment-status-symbol-' + getPackagePaymentStatus(packageCustomer.appointments)"></span>
                                <h3>
                                  {{ getPaymentStatusNiceName(getPackagePaymentStatus(packageCustomer.appointments)) }}
                                </h3>
                              </div>
                            </el-col>

                            <el-col :lg="7" :sm="3" :xs="8">
                              <div @click.stop>
                                <el-button
                                  v-if="packageCustomer.status !== 'canceled'"
                                  @click="updatePackageCustomerStatus(packageCustomerId, 'canceled')"
                                  type="danger"
                                  plain
                                  :loading="packageCustomer.updating"
                                >
                                  {{ $root.labels.cancel }}
                                </el-button>
                                <el-button
                                  v-else
                                  @click="updatePackageCustomerStatus(packageCustomerId, 'approved')"
                                  type="primary"
                                  plain
                                  :loading="packageCustomer.updating"
                                >
                                  {{ $root.labels.open }}
                                </el-button>
                              </div>
                            </el-col>

                          </el-row>
                        </el-col>

                      </el-row>
                    </div>
                  </template>

                  <packages-list-collapsed
                    :packageCustomer="packageCustomer"
                    :packageCustomerId="packageCustomerId"
                    :options="options"
                    :purchasedPackage="purchasedPackage"
                    @showDialogEditPackageAppointment="showDialogEditPackageAppointment"
                    @updatePackageAppointmentBookingStatus="updatePackageAppointmentBookingStatusCallback"
                    @showDialogNewPackageAppointment="showDialogNewPackageAppointment"
                    @handleCheckPackageAppointment="handleToaster"
                  >
                  </packages-list-collapsed>
                </el-collapse-item>
              </el-collapse>
            </div>

          </div>

        </div>

        <!-- Selected Popover -->
        <transition name="slide-vertical">
          <div class="am-bottom-popover" v-if="toaster">
            <transition name="fade">
              <el-button
                class="am-button-icon"
                @click="switchShowDeleteConfirmation(true)"
                v-show="showDeleteButton"
              >
                <img class="svg-amelia" :alt="$root.labels.delete" :src="$root.getUrl+'public/img/delete.svg'"/>
              </el-button>
            </transition>
            <transition name="slide-vertical">
              <div class="am-bottom-popover-confirmation" v-show="showDeleteConfirmation">
                <el-row type="flex" justify="start" align="middle">
                  <h3>{{ confirmationText() }}</h3>
                  <div class="align-left">
                    <el-button size="small" @click="switchShowDeleteConfirmation(false)">
                      {{ $root.labels.cancel }}
                    </el-button>
                    <el-button
                      size="small" @click="deleteSelected"
                      type="primary"
                      :loading="deleteLoading"
                    >
                      {{ $root.labels.delete }}
                    </el-button>
                  </div>
                </el-row>

              </div>
            </transition>

          </div>
        </transition>

        <!-- Pagination -->
        <pagination-block
          :params="paginationParams"
          :show="paginationParams.show"
          :count="paginationParams.total"
          :label="$root.labels.purchased_packages_pagination"
          :visible="paginationParams.total > paginationParams.show"
          @change="getAppointments"
        >
        </pagination-block>
      </div>

      <!-- Dialog New Appointment -->
      <transition name="slide">
        <el-dialog
          :close-on-click-modal="false"
          class="am-side-dialog"
          :visible.sync="dialogAppointment"
          :show-close="false"
          v-if="dialogAppointment"
        >
          <dialog-appointment
            :appointment="appointment"
            :recurringAppointments="recurringAppointments"
            :savedAppointment="savedAppointment"
            :totalBookings="totalBookings"
            :bookings="bookings"
            :options="options"
            :customerCreatedCount="customerCreatedCount"
            :customersNoShowCount="customersNoShowCount"
            :packageServices="packageServices"
            :packageCustomer="packageCustomer"
            @sortBookings="sortBookings"
            @saveCallback="(response) => {appointment.id ? saveAppointmentCallback(response, true) : saveAppointmentCallback(response)}"
            @duplicateCallback="duplicateAppointmentCallback"
            @closeDialog="closeDialogAppointment"
            @showDialogNewCustomer="showDialogNewCustomer()"
            @editPayment="editPayment"
            @openRecurringAppointment="openRecurringAppointment"
          >
          </dialog-appointment>
        </el-dialog>
      </transition>

      <!-- Dialog New Package Booking -->
      <transition name="slide">
        <el-dialog
          :close-on-click-modal="false"
          class="am-side-dialog"
          :visible.sync="dialogPackageBooking"
          :show-close="false"
          v-if="dialogPackageBooking"
        >
          <dialog-package-booking
            :options="options"
            :passed-package="purchasedPackage"
            :customerCreatedCount="customerCreatedCount"
            :new-user="newUser"
            @saveCallback="packageBookingCallback"
            @closeDialog="closePackageBooking"
            @showDialogNewCustomer="showDialogNewCustomer()"
            @editPayment="editPayment"
          >
          </dialog-package-booking>
        </el-dialog>
      </transition>

      <!-- Dialog New Customer -->
      <transition name="slide">
        <el-dialog
            :close-on-click-modal="false"
            class="am-side-dialog"
            :visible.sync="dialogCustomer"
            :show-close="false"
            v-if="dialogCustomer">
          <dialog-customer
              :customer="customer"
              @closeDialog="dialogCustomer=false"
              @saveCallback="saveCustomerCallback"
          >
          </dialog-customer>
        </el-dialog>
      </transition>

      <!-- Dialog Payment -->
      <transition name="slide">
        <el-dialog
            :close-on-click-modal="false"
            class="am-side-dialog am-dialog-coupon"
            :visible.sync="dialogPayment"
            :show-close="false"
            v-if="dialogPayment"
        >
          <dialog-payment
              :modalData="selectedPaymentModalData"
              :bookingFetched=true
              @closeDialogPayment="dialogPayment = false"
              @updatePaymentCallback="updatePaymentCallback"
              @deletePaymentCallback="deletePaymentCallback"
          >
          </dialog-payment>
        </el-dialog>
      </transition>

    </div>
  </div>
</template>

<script>
  import PackagesListCollapsed from './../services/PackagesListCollapsed.vue'
  import appointmentMixin from '../../../js/backend/mixins/appointmentMixin'
  import appointmentPriceMixin from '../../../js/backend/mixins/appointmentPriceMixin'
  import customerMixin from '../../../js/backend/mixins/customerMixin'
  import dateMixin from '../../../js/common/mixins/dateMixin'
  import DialogAppointment from './../appointments/DialogAppointment.vue'
  import DialogPackageBooking from './../services/DialogPackageBooking.vue'
  import DialogCustomer from '../customers/DialogCustomer.vue'
  import DialogExport from '../parts/DialogExport.vue'
  import DialogPayment from '../finance/DialogFinancePayment.vue'
  import durationMixin from '../../../js/common/mixins/durationMixin'
  import entitiesMixin from '../../../js/common/mixins/entitiesMixin'
  import Form from 'form-object'
  import helperMixin from '../../../js/backend/mixins/helperMixin'
  import imageMixin from '../../../js/common/mixins/imageMixin'
  import moment from 'moment'
  import notifyMixin from '../../../js/backend/mixins/notifyMixin'
  import PageHeader from '../parts/PageHeader.vue'
  import paymentMixin from '../../../js/backend/mixins/paymentMixin'
  import priceMixin from '../../../js/common/mixins/priceMixin'
  import customFieldMixin from '../../../js/common/mixins/customFieldMixin'
  import PaginationBlock from '../parts/PaginationBlock.vue'
  import packageMixin from '../../../js/frontend/mixins/packageMixin'
  import taxMixin from '../../../js/common/mixins/taxesMixin'

export default {
    mixins: [
      customFieldMixin,
      paymentMixin,
      entitiesMixin,
      appointmentMixin,
      imageMixin,
      dateMixin,
      durationMixin,
      notifyMixin,
      customerMixin,
      priceMixin,
      helperMixin,
      appointmentPriceMixin,
      packageMixin,
      taxMixin
    ],

    props: [
      'purchasedPackage',
      'dialogPackageBooking'
    ],

    data () {
      return {
        customersNoShowCount: [],
        customersLoading: false,
        changedRange: false,
        packageServices: [],
        packageCustomer: null,
        showDeleteButton: true,
        appointment: null,
        customer: null,
        deleteLoading: false,
        dialogAppointment: false,
        dialogPayment: false,
        dialogExport: false,
        fetched: false,
        fetchedFiltered: false,
        filterFields: true,
        form: new Form(),
        params: {
          page: 1,
          dates: this.getDatePickerInitRange(),
          providers: [],
          search: '',
          status: '',
          services: [],
          customerId: '',
          packageStatus: ''
        },
        selectedPaymentModalData: {
          paymentId: null,
          bookingStart: null,
          bookings: null,
          service: null,
          providers: null,
          customer: null
        },
        showDeleteConfirmation: false,
        timer: null,
        toaster: false,
        updateBookingStatusId: 0,
        updateBookingStatusLoading: false,
        appointmentsDeleteCount: {
          success: 0,
          error: 0
        },
        packageCustomersDeleteCount: {
          success: 0,
          error: 0
        },
        packageCustomers: [],
        newUser: null,
        packageStatuses: [
          { value: 'approved', label: this.$root.labels.active },
          { value: 'expired', label: this.$root.labels.expired },
          { value: 'canceled', label: this.$root.labels.canceled }
        ],
        bookingCount: [
          { value: 1, label: this.$root.labels.available },
          { value: 0, label: this.$root.labels.fully_booked }
        ],
        paginationParams: {
          page: 1,
          show: this.$root.settings.general.itemsPerPageBackEnd,
          total: 0
        }
      }
    },

    created () {
      Form.defaults.axios = this.$http

      // Set filter params based on URL GET fields
      let urlParams = this.getUrlQueryParams(window.location.href)

      if (!('dateFrom' in urlParams) || !('dateTo' in urlParams)) {
        this.params.dates = this.getDatePickerInitRange()
      } else {
        this.params.dates = {
          start: moment(urlParams['dateFrom']).toDate(),
          end: moment(urlParams['dateTo']).toDate()
        }
      }

      if (urlParams['status']) { this.params.status = urlParams['status'] }

      if (urlParams['bookingId']) { this.params.bookingId = urlParams['bookingId'] }

      this.getAppointmentOptions(true, true)
    },

    mounted () {
      if (this.$root.settings.payments.wc && this.$root.settings.payments.wc.enabled) {
        this.exportParams.fields.push({label: this.$root.labels.wc_order_id, value: 'wcOrderId', checked: true})
      }
    },

    updated () {
      if (this.fetched) this.inlineSVG()
    },

    methods: {
      getPackagePurchasedExpiration (end) {
        if (end === null) {
          return { label: this.$root.labels.unlimited, class: 'unlimited' }
        } else if (this.getDateTime(end) < this.getNowDate()) {
          return { label: this.$root.labels.expired, class: 'expired' }
        } else {
          return { label: (this.$root.labels.expires_on + ' ' + this.getFrontedFormattedDateFromDateTimeString(end)), class: 'active' }
        }
      },

      clearDateFilter () {
        this.params.dates = null

        this.paginationParams.page = 1

        this.getAppointments()
      },

      getPackageDiscountedPrice (packCustomer) {
        let amountData = this.getAmountData(
          packCustomer.tax && packCustomer.tax.length ? packCustomer.tax[0] : null,
          packCustomer.price,
          this.options.entities.coupons.length && packCustomer.couponId
            ? this.options.entities.coupons.find(c => c.id === packCustomer.couponId)
            : null
        )

        return amountData.total - amountData.discount + amountData.tax
      },

      saveCustomerCallback (response) {
        this.options.entities.customers.push(response.user)
        this.newUser = response.user
        this.customerCreatedCount++
      },

      getAvailableServicesForPurchase (packageCustomer) {
        let packageCustomerId = packageCustomer.appointments[0].packageCustomerId

        let availableServicesIds = []

        packageCustomer.data.forEach((purchases) => {
          if (purchases.bookings.filter(item => item.count > 0 && item.packageCustomerId === packageCustomerId).length) {
            availableServicesIds.push(purchases.serviceId)
          }
        })

        return this.options.entities.services.filter(item => availableServicesIds.indexOf(item.id) !== -1)
      },

      showDialogNewPackageAppointment (packageCustomer) {
        this.packageServices = this.getAvailableServicesForPurchase(packageCustomer)

        this.packageCustomer = packageCustomer

        this.showDialogNewAppointment(
          {
            customerId: packageCustomer.appointments[0].booking.packageCustomerService.packageCustomer.customerId,
            id: packageCustomer.appointments[0].packageCustomerId
          }
        )
      },

      showDialogEditPackageAppointment (id, packageCustomer) {
        this.packageServices = this.getAvailableServicesForPurchase(packageCustomer)

        this.packageCustomer = packageCustomer

        this.showDialogEditAppointment(id, packageCustomer.appointments[0].booking.customerId)
      },

      getPurchasedPackageProviders (app) {
        return _.uniq(app.map(a => a.provider ? a.provider.id : 0)).filter(a => a !== 0)
      },

      goBack () {
        this.$emit('closePurchasedPackages')
      },

      switchShowDeleteConfirmation (bool) {
        this.showDeleteConfirmation = bool
        this.showDeleteButton = !bool
      },

      confirmationText () {
        let message = this.checkedAppointmentsCount() < 2 ? this.$root.labels.confirm_delete_appointment : this.$root.labels.confirm_delete_appointment_plural

        Object.keys(this.packageCustomers).forEach((packageCustomerId) => {
          if (this.packageCustomers[packageCustomerId].checked) {
            message = this.$root.labels.confirm_delete_package_purchase
          }
        })

        return message
      },

      checkedAppointmentsCount () {
        let cnt = 0

        Object.keys(this.packageCustomers).forEach((packageCustomerId) => {
          cnt += this.packageCustomers[packageCustomerId].appointments.filter(app => app.checked).length
        })

        return cnt
      },

      deleteSelected () {
        this.deleteLoading = true

        let selectedAppointments = []

        let selectedPackageCustomers = []

        Object.keys(this.packageCustomers).forEach((packageCustomerId) => {
          this.packageCustomers[packageCustomerId].appointments.forEach((appointment) => {
            if (appointment.checked && !this.packageCustomers[packageCustomerId].checked) {
              selectedAppointments.push(appointment.id)
            }
          })

          if (this.packageCustomers[packageCustomerId].checked) {
            selectedPackageCustomers.push(packageCustomerId)
          }
        })

        Object.keys(this.packageCustomers).forEach((packageCustomerId) => {
          this.packageCustomers[packageCustomerId].appointments.forEach((appointment) => {
            if (appointment.checked && !this.packageCustomers[packageCustomerId].checked) {
              this.form.post(`${this.$root.getAjaxUrl}/bookings/delete/` + appointment.booking.id)
                .then(() => {
                  this.deleteSelectedCallback(selectedAppointments, selectedPackageCustomers, 'appointment', true)
                })
                .catch(() => {
                  this.deleteSelectedCallback(selectedAppointments, selectedPackageCustomers, 'appointment', false)
                })
            }
          })
        })

        Object.keys(this.packageCustomers).forEach((packageCustomerId) => {
          if (this.packageCustomers[packageCustomerId].checked) {
            this.form.post(`${this.$root.getAjaxUrl}/packages/customers/delete/` + packageCustomerId)
              .then(() => {
                this.deleteSelectedCallback(selectedAppointments, selectedPackageCustomers, 'packageCustomer', true)
              })
              .catch(() => {
                this.deleteSelectedCallback(selectedAppointments, selectedPackageCustomers, 'packageCustomer', false)
              })
          }
        })
      },

      deleteSelectedCallback (selectedAppointments, selectedPackageCustomers, type, result) {
        if (type === 'appointment') {
          selectedAppointments.pop()

          if (result) {
            this.appointmentsDeleteCount.success++
          } else {
            this.appointmentsDeleteCount.error++
          }
        }

        if (type === 'packageCustomer') {
          selectedPackageCustomers.pop()

          if (result) {
            this.packageCustomersDeleteCount.success++
          } else {
            this.packageCustomersDeleteCount.error++
          }
        }

        if (selectedAppointments.length === 0 && selectedPackageCustomers.length === 0) {
          if (this.appointmentsDeleteCount.success) {
            this.notify(
              this.$root.labels.success,
              this.appointmentsDeleteCount.success + ' ' + (this.appointmentsDeleteCount.success > 1 ? this.$root.labels.appointments_deleted : this.$root.labels.appointment_deleted),
              'success')
          }

          if (this.appointmentsDeleteCount.error) {
            this.notify(
              this.$root.labels.error,
              this.appointmentsDeleteCount.error + ' ' + (this.appointmentsDeleteCount.error > 1 ? this.$root.labels.appointments_not_deleted : this.$root.labels.appointment_not_deleted),
              'error')
          }

          if (this.packageCustomersDeleteCount.success) {
            this.notify(
              this.$root.labels.success,
              this.packageCustomersDeleteCount.success + ' ' + (this.packageCustomersDeleteCount.success > 1 ? this.$root.labels.package_customers_deleted : this.$root.labels.package_customer_deleted),
              'success')
          }

          if (this.packageCustomersDeleteCount.error) {
            this.notify(
              this.$root.labels.error,
              this.packageCustomersDeleteCount.error + ' ' + (this.packageCustomersDeleteCount.error > 1 ? this.$root.labels.package_customers_not_deleted : this.$root.labels.package_customer_not_deleted),
              'error')
          }

          this.appointmentsDeleteCount.success = 0
          this.appointmentsDeleteCount.error = 0

          this.packageCustomersDeleteCount.success = 0
          this.packageCustomersDeleteCount.error = 0

          this.getAppointmentOptions(true)

          this.toaster = false
          this.deleteLoading = false
          this.showDeleteConfirmation = false
          this.showDeleteButton = true
        }
      },

      packageBookingCallback () {
        this.$emit('savePackageBookingCallback')
        this.getAppointments()
      },

      getAppointmentOptions (fetchAppointments, first = false) {
        this.options.fetched = false
        this.customersLoading = true

        this.fetchEntities((success) => {
          if (success && fetchAppointments) {
            this.customersLoading = false

            this.getAppointments(first)
          }

          this.fetched = true
          this.options.fetched = true
        }, {
          types: ['locations', 'employees', 'categories', 'custom_fields', 'packages', 'coupons', 'resources'],
          lite: true,
          page: 'appointments',
          isFrontEnd: false,
          isPanel: false
        })
      },

      getAppointments (first = false) {
        this.fetchedFiltered = false

        let params = JSON.parse(JSON.stringify(this.params))
        let dates = []

        if (params.dates) {
          if (params.dates.start) {
            dates.push(moment(params.dates.start).format('YYYY-MM-DD'))
          }

          if (params.dates.end) {
            dates.push(moment(params.dates.end).format('YYYY-MM-DD'))
          }

          params.dates = dates
        }

        params.page = this.paginationParams.page

        params.packageId = this.purchasedPackage.id

        Object.keys(params).forEach((key) => (!params[key] && params[key] !== 0) && delete params[key])

        this.$http.get(`${this.$root.getAjaxUrl}/package/appointments`, {
          params: this.getAppropriateUrlParams(params)
        })
          .then(response => {
            this.toaster = false

            let customersIds = this.options.entities.customers.map(customer => parseInt(customer.id))

            let customers = this.options.entities.customers

            let packageCustomers = {}

            this.useSortedDateStrings(Object.keys(response.data.data.appointments)).forEach((dateKey) => {
              response.data.data.appointments[dateKey].appointments.forEach((app) => {
                app.checked = false

                app.bookings.forEach((booking) => {
                  if (customersIds.indexOf(parseInt(booking.customer.id)) === -1) {
                    customersIds.push(booking.customer.id)
                    customers.push(booking.customer)
                  }

                  let packageCustomerId = parseInt(booking.packageCustomerService.packageCustomer.id)

                  if (!(packageCustomerId in packageCustomers)) {
                    packageCustomers[packageCustomerId] = {
                      status: booking.packageCustomerService.packageCustomer.status,
                      checked: false,
                      updating: false,
                      appointments: [],
                      count: 0,
                      total: 0,
                      data: []
                    }
                  }

                  let newPackageBooking =
                    {
                      status: booking.status === 'canceled' || booking.status === 'rejected' ? booking.status : app.status,
                      packageCustomerId: packageCustomerId,
                      canceled: false,
                      checked: false,
                      bookingStarts: app.bookingStart,
                      bookingEnd: app.bookingEnd,
                      provider: app.provider,
                      service: app.service,
                      id: app.id,
                      booking: booking
                    }

                  packageCustomers[packageCustomerId].appointments.push(newPackageBooking)
                })
              })
            })

            let emptyPackages = this.groupBy(response.data.data.emptyPackageBookings, 'packageCustomer')

            if (emptyPackages) {
              for (let pack in emptyPackages) {
                if (customersIds.indexOf(parseInt(emptyPackages[pack][0].packageCustomer.customer.id)) === -1) {
                  customersIds.push(parseInt(emptyPackages[pack][0].packageCustomer.customer.id))
                  customers.push(emptyPackages[pack][0].packageCustomer.customer)
                }

                let packageCustomerId = parseInt(pack)

                if (emptyPackages.hasOwnProperty(packageCustomerId)) {
                  if (!(pack in packageCustomers)) {
                    packageCustomers[packageCustomerId] = {
                      status: emptyPackages[pack][0].packageCustomer.status,
                      checked: false,
                      updating: false,
                      appointments: [],
                      count: 0,
                      total: 0,
                      data: []
                    }
                  }

                  let newPackageBooking =
                      {
                        status: null,
                        packageCustomerId: packageCustomerId,
                        canceled: false,
                        checked: false,
                        bookingStarts: null,
                        provider: null,
                        service: null,
                        id: null,
                        booking: {
                          customer: emptyPackages[pack][0].packageCustomer.customer,
                          packageCustomerService: emptyPackages[pack][0],
                          id: packageCustomerId,
                          payments: emptyPackages[pack][0].packageCustomer.payments
                        }
                      }

                  packageCustomers[packageCustomerId].appointments.push(newPackageBooking)
                }
              }
            }

            response.data.data.availablePackageBookings.forEach((customerData) => {
              customerData.packages.forEach((packageData) => {
                packageData.services.forEach((purchasePackageData) => {
                  purchasePackageData.bookings.forEach((purchaseData) => {
                    if (purchaseData.packageCustomerId in packageCustomers) {
                      if (purchaseData.sharedCapacity) {
                        if (packageCustomers[purchaseData.packageCustomerId].total === 0) {
                          packageCustomers[purchaseData.packageCustomerId].count = purchaseData.total - packageCustomers[purchaseData.packageCustomerId].appointments.filter(a => a.id && a.status !== 'canceled').length
                          packageCustomers[purchaseData.packageCustomerId].total = purchaseData.total
                        }
                      } else {
                        packageCustomers[purchaseData.packageCustomerId].count += purchaseData.count
                        packageCustomers[purchaseData.packageCustomerId].total += purchaseData.total
                      }

                      packageCustomers[purchaseData.packageCustomerId].data.push(purchasePackageData)
                    }
                  })
                })
              })
            })

            this.options.entities.customers = Object.values(customers.sort((a, b) => (a.firstName.toLowerCase() > b.firstName.toLowerCase()) ? 1 : -1))

            this.packageCustomers = Object.keys(packageCustomers).length === 0 ? [] : packageCustomers

            this.paginationParams.total = response.data.data.totalPackagePurchases

            this.changedRange = false

            this.fetched = true
            this.fetchedFiltered = true
          })
          .catch(e => {
            console.log(e.message)
            this.fetched = true
            this.fetchedFiltered = true
          })
      },

      appointmentCameFrom (cust) {
        let arr = []
        cust.appointments.forEach(app => {
          if (app.booking.info) {
            arr.push('front')
          } else {
            arr.push('back')
          }
        })

        if (arr.indexOf('front') !== -1 && arr.indexOf('back') !== -1) {
          return 'am-mixed-appointment'
        }

        if (arr.indexOf('front') !== -1 && arr.indexOf('back') < 0) {
          return 'am-front-appointment'
        }

        if (arr.indexOf('front') < 0 && arr.indexOf('back') !== -1) {
          return 'am-back-appointment'
        }

        return ''
      },

      changeRange () {
        this.setDatePickerSelectedDaysCount(this.params.dates.start, this.params.dates.end)
        this.changedRange = true
        this.changeFilter()
      },

      changeFilter () {
        if (!this.params.customerId) {
          this.searchedCustomers = []
        }

        this.paginationParams.page = 1

        this.getAppointments()
      },

      handleResize () {
        this.filterFields = window.innerWidth >= 992
      },

      handleCheckPackageAppointments (packageCustomerId) {
        if (this.packageCustomers[packageCustomerId].checked) {
          this.packageCustomers[packageCustomerId].appointments.filter(appointment => appointment.id !== null).forEach((appointment) => {
            appointment.checked = this.packageCustomers[packageCustomerId].checked
          })
        }

        Object.keys(this.packageCustomers).forEach((key) => {
          if (key !== packageCustomerId) {
            this.packageCustomers[key].checked = false

            this.packageCustomers[key].appointments.filter(appointment => appointment.id !== null).forEach((appointment) => {
              appointment.checked = false
            })
          }
        })

        this.handleToaster(packageCustomerId)
      },

      handleToaster (packageCustomerId) {
        let hasAnyAppointmentChecked = false

        let hasAnyPackageCustomerChecked = false

        Object.keys(this.packageCustomers).forEach((key) => {
          if (packageCustomerId !== key) {
            this.packageCustomers[key].appointments.filter(appointment => appointment.id !== null).forEach((appointment) => {
              appointment.checked = false
            })
          }

          this.packageCustomers[key].appointments.filter(appointment => appointment.id !== null).forEach((appointment) => {
            if (appointment.checked) {
              hasAnyAppointmentChecked = true
            }
          })

          if (this.packageCustomers[key].appointments.filter(appointment => appointment.id !== null).length !== 0 &&
              (
                this.packageCustomers[key].appointments.filter(appointment => appointment.checked && appointment.id !== null).length <
                this.packageCustomers[key].appointments.filter(appointment => appointment.id !== null).length
              )
          ) {
            this.packageCustomers[key].checked = false
          }

          if (this.packageCustomers[key].checked) {
            hasAnyPackageCustomerChecked = true
          }
        })

        this.toaster = hasAnyAppointmentChecked || hasAnyPackageCustomerChecked
      },

      showDialogNewCustomer () {
        this.customer = this.getInitCustomerObject()
        this.dialogCustomer = true
      },

      closePackageBooking () {
        this.$emit('closePackageBooking')
      },

      openRecurringAppointment (id) {
        this.dialogAppointment = false

        setTimeout(() => {
          this.showDialogEditAppointment(id)
        }, 200)
      },

      getPackagePaymentStatus (app) {
        let allPayments = app[0].booking.payments
        if (allPayments.every(p => p.status === 'refunded')) {
          return 'refunded'
        }

        let bookingPrice = this.getPackageDiscountedPrice(app[0].booking.packageCustomerService.packageCustomer)
        bookingPrice -= allPayments.filter(p => p.wcOrderId && p.wcItemCouponValue).reduce((partialSum, a) => partialSum + a.wcItemCouponValue, 0)
        bookingPrice += allPayments.filter(p => p.wcOrderId && p.wcItemTaxValue).reduce((partialSum, a) => partialSum + a.wcItemTaxValue, 0)

        let paidAmount = allPayments.filter(p => p.status !== 'pending' && p.status !== 'refunded').reduce((partialSum, a) => partialSum + a.amount, 0)
        if (paidAmount >= bookingPrice.toFixed(2)) {
          return 'paid'
        } else if (paidAmount > 0) {
          return 'partiallyPaid'
        }
        return 'pending'
      },

      updatePackageAppointmentBookingStatusCallback (booking, packageCustomer, originalStatus) {
        this.updateAppointmentBookingStatus(booking, booking.status, packageCustomer, (success) => {
          if ((originalStatus === 'approved' || originalStatus === 'pending') && (booking.status === 'canceled' || booking.status === 'rejected')) {
            packageCustomer.count++
          } else if ((originalStatus === 'canceled' || originalStatus === 'rejected') && (booking.status === 'approved' || booking.status === 'pending')) {
            packageCustomer.count--
          }
        })
      },

      updatePackageCustomerStatus (packageCustomerId, status) {
        this.packageCustomers[packageCustomerId].updating = true

        this.form.post(this.$root.getAjaxUrl + '/packages/customers/' + packageCustomerId, {
          'status': status
        })
          .then(response => {
            this.packageCustomers[packageCustomerId].updating = false

            this.packageCustomers[packageCustomerId].status = status

            this.notify(this.$root.labels.success, response.message, 'success')
          })
          .catch(error => {
            this.packageCustomers[packageCustomerId].updating = false

            if (error.response) {
              this.notify(this.$root.labels.error, error.response.data.message, 'error')
            }
          })
      },

      groupBy (xs, key) {
        return xs.reduce(function (rv, x) {
          (rv[x[key].id] = rv[x[key].id] || []).push(x)
          return rv
        }, {})
      }
    },

    computed: {
      filterApplied () {
        return !!this.params.services.length || !!this.params.providers.length || !!this.params.customerId ||
            (this.params.dates && (!!this.params.dates.start || !!this.params.dates.end)) || !!this.params.status ||
            !!this.params.packageStatus
      }
    },

    watch: {
    },

    components: {
      PaginationBlock,
      PageHeader,
      DialogExport,
      DialogAppointment,
      DialogPackageBooking,
      DialogCustomer,
      DialogPayment,
      PackagesListCollapsed
    }
  }
</script>
