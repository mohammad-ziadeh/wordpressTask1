<template>
  <div class="am-page-header am-section">
    <el-row :type="($router.currentRoute.name === 'wpamelia-calendar') ? '' : 'flex'" align="middle">

      <el-col :span="($router.currentRoute.name === 'wpamelia-calendar') ? 6 : 18">
        <!-- Logo -->
        <div class="am-logo">
          <img width="92" class="logo-big" :src="$root.getUrl + 'public/img/amelia-logo-horizontal.svg'">
          <img width="28" class="logo-small" :src="$root.getUrl + 'public/img/amelia-logo-symbol.svg'">
        </div>
        <!-- /Logo -->

        <!-- Title -->
        <h1 class="am-page-title">
          {{ bookableType ? $root.labels[bookableType] : $router.currentRoute.meta.title }}

          <!-- Appointments -->
          <span class="am-appointments-number approved" v-if="appointmentsApproved >= 0">
            {{ appointmentsApproved }}
          </span>
          <!-- /Appointments -->

          <span class="am-appointments-number pending" v-if="appointmentsPending >= 0">
            {{ appointmentsPending }}
          </span>

          <!-- Employees -->
          <span v-if="employeesTotal >= 0 && $root.settings.capabilities.canReadOthers === true">
            <span class="total-number">{{ employeesTotal }}</span> {{ $root.labels.total }}
          </span>
          <!-- /Employees -->

          <!-- Customers -->
          <span v-if="customersTotal >= 0">
            <span class="total-number">{{ customersTotal }}</span> {{ $root.labels.total }}
          </span>
          <!-- /Customers -->

          <!-- Locations -->
          <span v-if="locationsTotal >= 0">
            <span class="total-number">{{ locationsTotal }}</span> {{ $root.labels.total }}
          </span>

          <!-- Services -->
          <span v-if="servicesTotal >= 0 && bookableType === 'services'">
            <span class="total-number">{{ servicesTotal }}</span> {{ $root.labels.total }}
          </span>

          <!-- Packages -->
          <span v-if="packagesTotal >= 0 && bookableType === 'packages'">
            <span class="total-number">{{ packagesTotal }}</span> {{ $root.labels.total }}
          </span>

          <!-- Resources -->
          <span v-if="resourcesTotal >= 0 && bookableType === 'resources'">
            <span class="total-number">{{ resourcesTotal }}</span> {{ $root.labels.total }}
          </span>

          <!-- Finance -->
          <span v-if="financeTotal >= 0">
            <span class="total-number">{{ financeTotal }}</span> {{ $root.labels.total }}
          </span>

        </h1>
        <!-- /Title -->
      </el-col>

      <!-- Buttons and Filters -->
      <el-col
        :span="($router.currentRoute.name === 'wpamelia-calendar') ? 18 : 6"
        class="align-right v-calendar-column"
      >

        <!-- New Appointment -->
        <el-button
          v-if="$router.currentRoute.name === 'wpamelia-appointments' && ($root.settings.capabilities.canWriteOthers === true || (this.$root.settings.role === 'provider' && this.$root.settings.roles.allowWriteAppointments))"
          type="primary"
          @click="showDialogAppointment" class="am-dialog-create"
        >
          <i class="el-icon-plus"></i> <span class="button-text">{{ $root.labels.new_appointment }}</span>
        </el-button>

        <!-- New Event -->
        <el-button
          v-if="$router.currentRoute.name === 'wpamelia-events' && ($root.settings.capabilities.canWriteOthers === true || (this.$root.settings.role === 'provider' && this.$root.settings.roles.allowWriteEvents))"
          type="primary"
          @click="showDialogEvent" class="am-dialog-create"
        >
          <i class="el-icon-plus"></i> <span class="button-text">{{ $root.labels.new_event }}</span>
        </el-button>

        <!-- Add Employee -->
        <el-button
          v-if="$router.currentRoute.name === 'wpamelia-employees' && $root.settings.capabilities.canWrite === true && $root.settings.capabilities.canWriteOthers === true"
          type="primary" @click="showDialogEmployee"
          class="am-dialog-create"
        >
          <i class="el-icon-plus"></i> <span class="button-text">{{ $root.labels.add_employee }}</span>
        </el-button>

        <!-- Add Customer -->
        <el-button
          v-if="$router.currentRoute.name === 'wpamelia-customers' && $root.settings.capabilities.canWrite === true"
          type="primary" @click="showDialogCustomer"
          class="am-dialog-create"
        >
          <i class="el-icon-plus"></i> <span class="button-text">{{ $root.labels.add_customer }}</span>
        </el-button>

        <!-- Add Location -->
        <el-button
          v-if="$router.currentRoute.name === 'wpamelia-locations' && $root.settings.capabilities.canWrite === true"
          type="primary" @click="showDialogLocation"
          class="am-dialog-create"
          :class="licenceClassDisabled()"
          :disabled="notInLicence()"
        >
          <i class="el-icon-plus"></i> <span class="button-text">{{ $root.labels.add_location }}</span>
        </el-button>

        <!-- Add Service -->
        <el-button
          v-if="$router.currentRoute.name === 'wpamelia-services' && categoriesTotal > 0 && $root.settings.capabilities.canWrite === true && bookableType === 'services'"
          type="primary"
          @click="showDialogService"
          class="am-dialog-create"
        >
          <i class="el-icon-plus"></i> <span class="button-text">{{ $root.labels.add_service }}</span>
        </el-button>

        <!-- Add Package -->
        <el-button
          v-if="$router.currentRoute.name === 'wpamelia-services' && $root.settings.capabilities.canWrite === true && bookableType === 'packages'"
          type="primary"
          @click="packagesTotal >= 0 ? showDialogPackage() : showDialogPackageBooking()"
          class="am-dialog-create"
          :class="licenceClassDisabled('pro')"
          :disabled="notInLicence('pro')"
        >
          <i class="el-icon-plus"></i> <span class="button-text">{{ packagesTotal >= 0 ? $root.labels.add_package : $root.labels.book_package }}</span>
        </el-button>

        <!-- Add Resource -->
        <el-button
          v-if="$router.currentRoute.name === 'wpamelia-services' && $root.settings.capabilities.canWrite === true && bookableType === 'resources'"
          type="primary"
          @click="showDialogResource()"
          class="am-dialog-create"
          :class="licenceClassDisabled('pro')"
          :disabled="notInLicence('pro')"
        >
          <i class="el-icon-plus"></i> <span class="button-text">{{ $root.labels.add_resource }}</span>
        </el-button>

        <!-- New Tax -->
        <el-button
          v-if="$router.currentRoute.name === 'wpamelia-finance' && addNewTaxBtnDisplay && $root.settings.capabilities.canWrite === true"
          type="primary"
          @click="showDialogTax"
          class="am-dialog-create"
          :class="licenceClassDisabled()"
          :disabled="notInLicence()"
        >
          <i class="el-icon-plus"></i> <span class="button-text">{{ $root.labels.new_tax }}</span>
        </el-button>

        <!-- New Coupon -->
        <el-button
          v-if="$router.currentRoute.name === 'wpamelia-finance' && addNewCouponBtnDisplay && $root.settings.capabilities.canWrite === true"
          type="primary"
          @click="showDialogCoupon"
          class="am-dialog-create"
          :class="licenceClassDisabled('starter')"
          :disabled="notInLicence('starter')"
        >
          <i class="el-icon-plus"></i> <span class="button-text">{{ $root.labels.new_coupon }}</span>
        </el-button>

        <!-- New Custom Field -->
        <transition name="fade">
          <el-button
            v-if="$router.currentRoute.name === 'wpamelia-cf' && addNewCustomFieldBtnDisplay"
            type="primary"
            @click="showDialogCustomFields" class="am-dialog-create"
          >
            <i class="el-icon-plus"></i> <span class="button-text">{{ $root.labels.add_custom_field }}</span>
          </el-button>
        </transition>

        <!-- Dashboard Datepicker -->
        <div class="v-calendar-column" v-if="$router.currentRoute.name === 'wpamelia-dashboard'">
          <div class="el-form-item__content">
            <v-date-picker
              v-model="params.dates"
              @input="changeFilter"
              mode='range'
              popover-visibility="focus"
              popover-direction="bottom"
              popover-align="right"
              tint-color='#1A84EE'
              :show-day-popover=false
              :input-props='{class: "el-input__inner"}'
              :is-expanded=false
              :is-required=true
              input-class="el-input__inner"
              :formats="vCalendarFormats"
              :is-double-paned="true"
            >
            </v-date-picker>
          </div>
        </div>

        <div v-if="$router.currentRoute.name === 'wpamelia-calendar'" class="am-calendar-header-filters">
          <el-form :inline="true" class="demo-form-inline">
            <!-- Service Filter -->
            <el-form-item :label="$root.labels.services + ':'">
              <el-select
                v-model="params.services"
                multiple
                filterable
                collapse-tags
                :loading=!fetched
                :placeholder="$root.labels.all_services"
                @change="changeFilter"
              >
                <div
                  v-for="category in categories"
                  :key="category.id"
                >
                  <div
                    class="am-drop-parent"
                    @click="selectAllInCategory(category.id)"
                  >
                    <span>{{ category.name }}</span>
                  </div>
                  <el-option
                    v-for="service in category.serviceList"
                    :key="service.id"
                    :label="service.name"
                    :value="service.id"
                    class="am-drop-child"
                  >
                  </el-option>
                </div>
              </el-select>
            </el-form-item>

            <!-- Location Filter -->
            <el-form-item :label="$root.labels.locations + ':'" v-show="locations.length">
              <el-select
                v-model="params.locations"
                multiple
                clearable
                collapse-tags
                :placeholder="$root.labels.all_locations"
                :loading=!fetched
                @change="changeFilter"
              >
                <el-option
                  v-for="location in locations"
                  :key="location.id"
                  :label="location.name"
                  :value="location.id"
                >
                </el-option>
              </el-select>
            </el-form-item>

          </el-form>

          <!-- New Appointment -->
          <el-button
            v-if="$router.currentRoute.name === 'wpamelia-calendar' && ($root.settings.role === 'admin' || $root.settings.role === 'manager' || ($root.settings.role === 'provider' && $root.settings.roles.allowWriteAppointments))"
            type="primary"
            @click="showDialogAppointment" class="am-dialog-create"
          >
            <i class="el-icon-plus"></i> <span class="button-text">{{ $root.labels.new_appointment }}</span>
          </el-button>

        </div>

        <div v-if="oldCustomize && $router.currentRoute.name === 'wpamelia-customize'" class="am-calendar-header-filters">

          <!-- Go Back -->
          <el-button
              type="primary"
              @click="showMainCustomize" class="am-dialog-create"
          >
            <span class="button-text">{{ $root.labels.go_back }}</span>
          </el-button>

        </div>
      </el-col>

    </el-row>
  </div>
</template>

<script>
  import licenceMixin from '../../../js/common/mixins/licenceMixin'
  import dateMixin from '../../../js/common/mixins/dateMixin'
  import imageMixin from '../../../js/common/mixins/imageMixin'

  export default {

    mixins: [
      licenceMixin,
      dateMixin,
      imageMixin
    ],

    props: [
      'oldCustomize',
      'appointmentsApproved',
      'appointmentsPending',
      'employeesTotal',
      'customersTotal',
      'locationsTotal',
      'packagesTotal',
      'resourcesTotal',
      'servicesTotal',
      'categoriesTotal',
      'financeTotal',
      'addNewTaxBtnDisplay',
      'addNewCouponBtnDisplay',
      'addNewCustomFieldBtnDisplay',
      'locations',
      'categories',
      'bookableType',
      'params',
      'fetched'
    ],

    methods: {
      showMainCustomize () {
        this.$emit('showMainCustomize', null)
      },

      showDialogCustomer () {
        this.$emit('newCustomerBtnClicked', null)
      },

      showDialogAppointment () {
        this.$emit('newAppointmentBtnClicked', null)
      },

      showDialogEvent () {
        this.$emit('newEventBtnClicked', null)
      },

      showDialogEmployee () {
        this.$emit('newEmployeeBtnClicked')
      },

      showDialogLocation () {
        this.$emit('newLocationBtnClicked')
      },

      showDialogService () {
        this.$emit('newServiceBtnClicked')
      },

      showDialogPackage () {
        this.$emit('newPackageBtnClicked')
      },

      showDialogPackageBooking () {
        this.$emit('newPackageBookingBtnClicked')
      },

      showDialogResource () {
        this.$emit('newResourceBtnClicked')
      },

      showDialogTax () {
        this.$emit('newTaxBtnClicked')
      },

      showDialogCoupon () {
        this.$emit('newCouponBtnClicked')
      },

      showDialogCustomFields () {
        this.$emit('newCustomFieldBtnClicked')
      },

      selectAllInCategory (id) {
        this.$emit('selectAllInCategory', id)
      },

      changeFilter () {
        this.$emit('changeFilter')
      }
    }
  }
</script>
