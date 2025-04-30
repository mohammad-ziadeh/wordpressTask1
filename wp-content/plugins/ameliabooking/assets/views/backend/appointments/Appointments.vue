<template>
  <div class="am-wrap">
    <div id="am-appointments" class="am-body">

      <!-- Page Header -->
      <page-header
          :appointmentsApproved="appointmentStatusCount.approved"
          :appointmentsPending="appointmentStatusCount.pending"
          @newAppointmentBtnClicked="showDialogNewAppointment()"
      >
      </page-header>

      <!-- Spinner -->
      <div class="am-spinner am-section" v-show="!fetched || !options.fetched">
        <img :src="$root.getUrl+'public/img/spinner.svg'"/>
      </div>

      <!-- Empty State -->
      <EmptyState
        :visible="fetched && appointmentsDay.length === 0 && !filterApplied && fetchedFiltered && options.fetched"
        :title="$root.labels.no_appointments_yet"
        :description="$root.labels.click_add_appointments"
      >
      </EmptyState>

      <!-- Appointments -->
      <div
          v-show="fetched && options.fetched && (appointmentsDay.length !== 0 || (appointmentsDay.length === 0 && filterApplied) || !fetchedFiltered)"
      >

        <!-- Global Search & Filters -->
        <div class="am-appointments-filter am-section">
          <el-form :model="params" class="demo-form-inline" :action="exportAction" method="POST">

            <!-- Global Search & Export Button -->
            <el-row :gutter="16">
              <el-col :md="24">
                <div class="am-search">
                  <el-form-item>

                    <!-- Global Search -->
                    <el-input
                        class="calc-width"
                        :placeholder="$root.labels.appointments_search_placeholder"
                        v-model="params.search"
                    >
                    </el-input>

                    <!-- Toggle Filters Button -->
                    <el-button
                        class="button-filter-toggle am-button-icon"
                        title="Toggle Filters"
                        @click="filterFields = !filterFields">
                      <img
                          class="svg-amelia" alt="Toggle Filters"
                          :src="$root.getUrl+'public/img/filter.svg'"
                      />
                    </el-button>

                    <!-- Export -->
                    <el-tooltip placement="top">
                      <div slot="content" v-html="$root.labels.export_tooltip_appointments"></div>
                      <el-button
                          class="button-export am-button-icon"
                          @click="dialogExport = true"
                      >
                        <img class="svg-amelia" :alt="$root.labels.export" :src="$root.getUrl+'public/img/export.svg'"/>
                      </el-button>
                    </el-tooltip>

                  </el-form-item>
                </div>
              </el-col>
            </el-row>

            <!-- Filters -->
            <transition name="fade">
              <div class="am-filter-fields" v-show="filterFields">
                <el-row :gutter="16">

                  <!-- Dates Filter -->
                  <el-col :sm="24" :md="24" :lg="5" class="v-calendar-column">
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

                  <!-- Employees Filter -->
                  <el-col v-if="!notInLicence('starter')" :sm="6" :md="6" :lg="5">
                    <el-form-item>
                      <el-select
                          v-model="params.providers"
                          filterable
                          clearable
                          :placeholder="$root.labels.employees"
                          @change="changeFilter"
                          multiple
                          collapse-tags
                      >
                        <el-option
                            v-for="item in visibleEmployees"
                            :key="item.id"
                            :label="item.firstName + ' ' + item.lastName"
                            :value="item.id"
                        >
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>

                  <!-- Customer Filter -->
                  <el-col v-if="$root.settings.role === 'customer' ? !notInLicence('starter') : true" :sm="6" :md="6" :lg="!notInLicence('starter') ? 5 : 7">
                    <el-form-item>
                      <el-select
                          v-model="params.customerId"
                          filterable
                          clearable
                          :placeholder="$root.labels.customer"
                          @change="changeFilter"
                          remote
                          :remote-method="searchCustomers"
                          :loading="loadingCustomers"
                      >
                        <el-option
                            v-for="(item, key) in searchedCustomers.length ? searchedCustomers : options.entities.customers"
                            :key="key"
                            :label="item.firstName + ' ' + item.lastName"
                            :value="item.id"
                        >
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>

                  <!-- Services Filter -->
                  <el-col :sm="6" :md="6" :lg="!notInLicence('starter') ? 5 : 7">
                    <el-form-item>
                      <el-select
                          v-model="params.services"
                          multiple
                          filterable
                          :placeholder="$root.labels.services"
                          @change="changeFilter"
                          collapse-tags
                      >
                        <div
                            v-for="category in filterCategoriesByProviderServiceIDs(options.entities.categories)"
                            :key="category.id">
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
                  </el-col>

                  <!-- Status Filter -->
                  <el-col :sm="6" :md="6" :lg="4">
                    <el-form-item>
                      <el-select
                          v-model="params.status"
                          filterable
                          clearable
                          :placeholder="$root.labels.status"
                          @change="changeFilter"
                      >
                        <el-option
                            v-for="item in statuses.concat(!$root.licence.isLite ? noShowStatus : [])"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                            class="am-appointment-status-option"
                        >
                          <span :class="'am-appointment-status-symbol am-appointment-status-symbol-' + item.value">
                          </span>
                          <span>{{ item.label }}</span>
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
                  class="am-side-dialog am-dialog-export"
                  :visible.sync="dialogExport"
                  :show-close="false"
                  v-if="dialogExport"
                  :close-on-click-modal="false"
              >
                <dialog-export
                    :data="getExportData()"
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
             v-show="fetched && appointmentsDay.length === 0 && filterApplied && fetchedFiltered && options.fetched">
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
            v-show="fetchedFiltered && options.fetched && appointmentsDay.length !== 0"
        >

          <!-- Appointment List Header -->
          <div class="am-appointments-list-head">
            <el-row>
              <el-col :lg="14">
                <el-row :gutter="10" class="am-appointments-flex-row-middle-align">

                  <!-- Appointment List Checkbox -->
                  <el-col :lg="4" :md="4">
                    <p>
                      <el-checkbox
                          v-if="$root.settings.capabilities.canDelete === true"
                          v-model="allAppointmentsChecked"
                          @change="handleCheckAllAppointments"></el-checkbox>
                    </p>
                  </el-col>

                  <!-- Appointment List ID Label -->
                  <el-col :lg="2" :md="2" class="am-appointment-id">
                    <p>{{ $root.labels.id }}:</p>
                  </el-col>

                  <!-- Appointment List Customer Label -->
                  <el-col :lg="6" :md="6">
                    <p>{{ $root.labels.customer }}:</p>
                  </el-col>

                  <!-- Appointment List Assigned To Label -->
                  <el-col :lg="6" :md="6">
                    <p>{{ $root.labels.assigned_to }}:</p>
                  </el-col>

                  <!-- Appointment List Service Label -->
                  <el-col :lg="7" :md="7">
                    <p>{{ $root.labels.service }}:</p>
                  </el-col>

                </el-row>
              </el-col>

              <el-col :lg="10">
                <el-row :gutter="10" class="am-appointments-flex-row-middle-align">
                  <el-col :lg="0" :md="4" :sm="5"></el-col>

                  <!-- Appointment Capacity Label -->
                  <el-col :lg="3" :md="4">
                    <p>{{ $root.labels.capacity }}:</p>
                  </el-col>

                  <!-- Appointment Duration Label -->
                  <el-col :lg="4" :md="6">
                    <p>{{ $root.labels.duration }}:</p>
                  </el-col>

                  <!-- Appointment Payment Label -->
                  <el-col :lg="7" :sm="5">
                    <p>{{ $root.labels.price }}:</p>
                  </el-col>

                  <!-- Appointment Status Label -->
                  <el-col :lg="10" :md="7">
                    <p>{{ $root.labels.status }}:</p>
                  </el-col>

                </el-row>
              </el-col>

            </el-row>
          </div>

          <!-- Appointment List Content -->
          <div v-for="(appDay, appDateKey) in appointmentsDay">

            <!-- Appointment Day -->
            <div class="am-appointments-list-day-title">
              <el-row>
                <el-col :span="24">
                  <h2>

                    <!-- Appointment Checkbox For Day -->
                    <el-checkbox
                        v-if="$root.settings.capabilities.canDelete === true"
                        @change="handleCheckedDateAppointments(appDateKey)"
                        v-model="allDateAppointmentsChecked[appDateKey]"
                        :label="appDay.date">
                    </el-checkbox>
                    {{ handleDateFormat(appDay.date) }}
                  </h2>
                </el-col>
              </el-row>
            </div>

            <!-- Appointments -->
            <div class="am-appointments-list">
              <el-collapse>
                <el-collapse-item
                  v-for="app in appDay.appointments"
                  :key="appDay.date + app.id"
                  :name="app.id"
                  class="am-appointment"
                  :class="appointmentCameFrom(app)"
                >
                  <template slot="title">
                    <div class="am-appointment-data">
                      <el-row>

                        <el-col :lg="14">
                          <el-row :gutter="10" class="am-appointments-flex-row-middle-align">

                            <!-- Checkbox -->
                            <el-col :lg="4" :sm="4">
                              <span class="am-appointment-checkbox" @click.stop>
                                <el-checkbox
                                    v-if="$root.settings.capabilities.canDelete === true"
                                    @change="handleCheckedAppointment(app)"
                                    v-model="app.checked"
                                    :value="app.id"
                                    :label="app.id"
                                >
                                </el-checkbox>
                              </span>
                              <span class="am-appointment-time"
                                    :class="getBookingStatus(app.status, app.bookings[0].status)">
                                {{ getFrontedFormattedTime(getTime(app.bookingStart)) }}
                              </span>
                            </el-col>

                            <!-- ID -->
                            <el-col :lg="2" :sm="2" class="am-appointment-id">
                              <p class="am-col-title">{{ $root.labels.id }}:</p>
                              <h4>{{ app.id }}</h4>
                            </el-col>

                            <!-- Customer -->
                            <el-col :lg="6" :sm="6">
                              <p class="am-col-title">{{ $root.labels.customer }}:</p>
                              <template>
                                <el-tooltip
                                    class="item"
                                    placement="top"
                                    :disabled="app.bookings.length === 1"
                                    popper-class="am-align-left"
                                >
                                  <div v-if="app.bookings.length > 1"
                                       slot="content"
                                       v-html="getCustomersFromGroup(app)">

                                  </div>
                                  <h3 :class="{ grouped: app.bookings.length > 1 }">
                                    <img
                                        v-show="app.bookings.length > 1"
                                        width="16px"
                                        :src="$root.getUrl+'public/img/group.svg'"
                                        class=""
                                    />
                                    <span v-for="(booking, index) in app.bookings"
                                      :class="(app.bookings.length === 1 ? (getNoShowClass(booking.customerId, customersNoShowCount, null, booking.customer.status)) : '')">
                                      {{ ((user = getCustomerInfo(booking)) !== null ? user.firstName + ' ' + user.lastName : '') }}
                                      <span v-if="app.bookings.length > 1 && index + 1  !== app.bookings.length">,</span>
                                    </span>
                                  </h3>
                                </el-tooltip>
                                <span v-if="app.bookings.length === 1" v-for="booking in app.bookings">{{ booking.customer.email}}</span>
                                <span v-if="app.bookings.length === 1" v-for="booking in app.bookings" class="am-appointment-data-phone">{{ ((user = getCustomerById(booking.customerId)) !== null ? user.phone : booking.customer.phone) }}</span>
                                <span v-if="app.bookings.length > 1">{{ $root.labels.multiple_emails }}</span>
                              </template>
                            </el-col>

                            <!-- Employee -->
                            <el-col :lg="6" :sm="6">
                              <p class="am-col-title">{{ $root.labels.assigned }}:</p>
                              <div class="am-assigned">
                                <img :src="pictureLoad(getProviderById(app.providerId), true)"
                                     @error="imageLoadError(getProviderById(app.providerId), true)"
                                     v-if="options.fetched && fetchedFiltered"/>
                                <h4>
                                  {{ ((user = getProviderById(app.providerId)) !== null ? user.firstName + ' ' +
                                  user.lastName : '') }}
                                  <span
                                      v-if="getProviderBadge(getProviderById(app.providerId), '')"
                                      class="am-employee-card-badge"
                                      :style="{background: getProviderBadge(getProviderById(app.providerId), 'color')}"
                                  >
                                    {{getProviderBadge(getProviderById(app.providerId), 'content')}}
                                  </span>
                                </h4>
                              </div>
                            </el-col>

                            <!-- Service -->
                            <el-col class="am-appointment-package" :lg="7" :sm="8">
                              <p class="am-col-title">{{ $root.labels.service }}:</p>
                              <div class="am-appointment-package-wrap">
                                <h4>
                                  {{ ((service = getServiceById(app.serviceId)) !== null ? service.name : '') }}
                                </h4>
                                <el-tooltip placement="top">
                                  <div style='text-align: left;' v-html="packageTooltipContent(app.bookings)" slot="content"></div>
                                  <img
                                      v-if="Object.keys(bookingTypeCountInPackage(app.bookings).package).length"
                                      :src="$root.getUrl + 'public/img/am-package.svg'"
                                  >
                                </el-tooltip>
                              </div>
                            </el-col>

                          </el-row>
                        </el-col>

                        <el-col :lg="10">
                          <el-row :gutter="10" class="am-appointments-flex-row-middle-align">
                            <el-col :lg="0" :sm="5"></el-col>

                            <!-- Capacity -->
                            <el-col :lg="3" :sm="4" :xs="12">
                              <p class="am-col-title">{{ $root.labels.capacity }}:</p>
                              <h4>{{ getCapacity(app) }}</h4>
                            </el-col>

                            <!-- Duration -->
                            <el-col :lg="4" :sm="5" :xs="12">
                              <p class="am-col-title">{{ $root.labels.duration }}:</p>
                              <h4>{{
                                momentDurationToNiceDurationWithUnit(convertDateTimeRangeDifferenceToMomentDuration(app.bookingStart,
                                app.bookingEnd)) }}</h4>
                            </el-col>

                            <!-- Payment -->
                            <el-col class="am-appointment-payment" :lg="7" :sm="6" :xs="13">
                              <p class="am-col-title">{{ $root.labels.price }}:</p>
                              <div class="am-appointment-package-wrap" v-if="getAppointmentPaymentMethods(app.bookings).length">
                                <h4>
                                  <el-tooltip placement="top" effect="light">
                                    <div slot="content" class="am-appointment-payment-tooltip">
                                      <span style="margin-bottom: 0; vertical-align: middle">{{ $root.labels.payment_method }}:</span>
                                      <img
                                          v-for="method in getAppointmentPaymentMethods(app.bookings)"
                                          v-if="getAppointmentPaymentMethods(app.bookings).length && method"
                                          :src="$root.getUrl + 'public/img/payments/' + method + '.svg'"
                                          height="16px"
                                          style="margin-left: 5px; vertical-align: middle"
                                      >
                                    </div>
                                    <div class="am-appointment-payment-wrap">
                                      <img
                                          v-for="method in getAppointmentPayment(app.bookings)"
                                          v-if="getAppointmentPayment(app.bookings).length"
                                          :src="$root.getUrl + 'public/img/payments/icons/' + getPaymentType(method) + '.svg'"
                                          class="am-appointment-payment-icons"
                                      >
                                      <span v-if="bookingTypeCountInPackage(app.bookings).regular" class="am-appointment-payment-wrap-price">
                                        <span style="vertical-align: middle">
                                          {{ getAppointmentPrice(app.serviceId, getAppointmentService(app), app.bookings, true) }}
                                        </span>
                                        <span v-if="Object.keys(bookingTypeCountInPackage(app.bookings).package).length">+</span>
                                      </span>
                                    </div>
                                  </el-tooltip>
                                </h4>
                                <el-tooltip
                                  v-if="Object.keys(bookingTypeCountInPackage(app.bookings).package).length"
                                  placement="top"
                                  :content="$root.labels.bookings_payment_package_tooltip"
                                >
                                  <img
                                          v-if="Object.keys(bookingTypeCountInPackage(app.bookings).package).length"
                                          :src="$root.getUrl + 'public/img/am-package.svg'"
                                  >
                                </el-tooltip>
                              </div>
                            </el-col>

                            <!-- Status -->
                            <el-col :lg="7" :sm="7" :xs="16" v-if="$root.settings.role !== 'customer'">
                              <div class="am-appointment-status" @click.stop>
                                <span :class="'am-appointment-status-symbol am-appointment-status-symbol-'+app.status"></span>
                                <el-select
                                    v-model="app.status"
                                    :placeholder="$root.labels.status"
                                    @change="updateAppointmentStatus(app, app.status, true)"
                                    :disabled="updateStatusDisabled || !canWriteAppointments(app)"
                                >
                                  <el-option
                                      v-for="opt in statuses.concat(getDateTime(app.bookingEnd) < getNowDate() ? noShowStatus : [])"
                                      :key="opt.value"
                                      :label="opt.label"
                                      :value="opt.value"
                                      class="am-appointment-status-option"
                                  >
                                    <span :class="'am-appointment-status-symbol am-appointment-status-symbol-'+opt.value">{{ opt.label }}</span>
                                  </el-option>
                                </el-select>
                              </div>
                            </el-col>

                            <!-- Edit Button -->
                            <el-col :lg="4" :sm="3" :xs="8"
                                    v-if="canWriteAppointments(app)">
                              <div class="am-edit-btn" @click.stop>
                                <el-button
                                    class="am-button-icon"
                                    @click="showDialogEditAppointment(app.id)">
                                  <img class="svg-amelia" :alt="$root.labels.edit" :src="$root.getUrl + 'public/img/edit.svg'"/>
                                </el-button>
                              </div>
                            </el-col>

                            <!-- Cancel Button For Customers -->
                            <el-col :lg="12" :sm="6" v-if="$root.settings.role === 'customer'">
                              <span
                                  :class="'am-customer-status ' + app.bookings[0].status">{{ statuses.find(status => status.value === app.bookings[0].status).label }}</span>
                              <span class="am-cancel-btn" @click.stop>
                                <el-tooltip :content="$root.labels.cancel_appointment" placement="top">
                                  <el-button
                                      type="danger"
                                      size="mini"
                                      @click="updateBookingStatus(app, 'canceled')"
                                      :loading="updateBookingStatusLoading && app.bookings[0].id === updateBookingStatusId"
                                      v-if="!(app.past || app.bookings[0].status === 'canceled' || app.bookings[0].status === 'rejected') && app.cancelable"
                                  >
                                    {{ $root.labels.cancel }}
                                  </el-button>
                                </el-tooltip>
                              </span>
                              <span v-if="$root.settings.roles.allowCustomerReschedule" @click.stop>
                                <el-tooltip :content="$root.labels.edit_appointment" placement="top">
                                  <el-button
                                      v-if="!(app.past || app.bookings[0].status === 'canceled' || app.bookings[0].status === 'rejected') && app.reschedulable"
                                      size="mini"
                                      @click="showDialogEditAppointment(app.id)">
                                {{ $root.labels.edit }}
                              </el-button>
                                </el-tooltip>
                              </span>
                            </el-col>
                          </el-row>
                        </el-col>

                      </el-row>
                    </div>
                  </template>

                  <appointment-list-collapsed
                      :app="app"
                      :options="options"
                      :customersNoShowCount="customersNoShowCount"
                  >
                  </appointment-list-collapsed>
                </el-collapse-item>
              </el-collapse>
            </div>

          </div>

          <!-- Pagination -->
          <pagination-block
              :params="paginationParams"
              :show="paginationParams.show"
              :count="totalPeriodAppointments"
              :label="$root.labels.appointments.toLowerCase()"
              :visible="totalPeriodAppointments > paginationParams.show"
              @change="getAppointments"
          >
          </pagination-block>
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
                        size="small" @click="deleteAppointmentGroup"
                        type="primary"
                        :loading="deleteAppointmentGroupLoading"
                    >
                      {{ $root.labels.delete }}
                    </el-button>
                  </div>
                </el-row>

              </div>
            </transition>

          </div>
        </transition>
      </div>

      <!-- Button New -->
      <div v-if="canWriteAppointments()" id="am-button-new" class="am-button-new">
        <el-button id="am-plus-symbol" type="primary" icon="el-icon-plus"
                   @click="showDialogNewAppointment()"></el-button>
      </div>

      <!-- Dialog New Appointment -->
      <transition name="slide">
        <el-dialog
            class="am-side-dialog"
            :visible.sync="dialogAppointment"
            :show-close="false"
            v-if="dialogAppointment"
            :close-on-click-modal="false"
        >
          <dialog-appointment
              :appointment="appointment"
              :recurringAppointments="recurringAppointments"
              :savedAppointment="savedAppointment"
              :bookings="bookings"
              :options="options"
              :customerCreatedCount="customerCreatedCount"
              :packageCustomer="null"
              :current-user="currentUser"
              :customersNoShowCount="customersNoShowCount"
              :selectedTimeZone="selectedTimeZone"
              @sortBookings="sortBookings"
              @saveCallback="saveAppointmentCallback"
              @duplicateCallback="duplicateAppointmentCallback"
              @closeDialog="closeDialogAppointment"
              @showDialogNewCustomer="showDialogNewCustomer()"
              @editPayment="editPayment"
              @openRecurringAppointment="openRecurringAppointment"
          >
          </dialog-appointment>
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

      <!-- Help Button -->
      <el-col :md="6" class="">
        <a class="am-help-button" href="https://wpamelia.com/appointments/" target="_blank" rel="nofollow">
          <i class="el-icon-question"></i> {{ $root.labels.need_help }}?
        </a>
      </el-col>

<!--       <dialog-new-customize></dialog-new-customize>-->

    </div>
  </div>
</template>

<script>
  import licenceMixin from '../../../js/common/mixins/licenceMixin'
  import AppointmentListCollapsed from './AppointmentListCollapsed.vue'
  import appointmentMixin from '../../../js/backend/mixins/appointmentMixin'
  import appointmentPriceMixin from '../../../js/backend/mixins/appointmentPriceMixin'
  import customerMixin from '../../../js/backend/mixins/customerMixin'
  import dateMixin from '../../../js/common/mixins/dateMixin'
  import DialogAppointment from './DialogAppointment.vue'
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
  // import DialogNewCustomize from '../parts/DialogNewCustomize.vue'
  import AmSurvey from '../parts/AmSurvey.vue'

  export default {
    mixins: [
      licenceMixin,
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
      appointmentPriceMixin
    ],

    data () {
      return {
        customersNoShowCount: [],
        currentUser: null,
        showDeleteButton: true,
        totalPeriodAppointments: 0,
        paginationParams: {
          page: 1,
          show: this.$root.settings.general.itemsPerPageBackEnd
        },
        updateStatusDisabled: false,
        allAppointmentsChecked: false,
        allDateAppointmentsChecked: {},
        appointment: null,
        appointmentsDay: [],
        appointmentStatusCount: {
          'total': 0,
          'approved': 0,
          'pending': 0
        },
        customer: null,
        deleteAppointmentGroupLoading: false,
        dialogAppointment: false,
        dialogPayment: false,
        dialogExport: false,
        fetched: false,
        fetchedFiltered: false,
        filterFields: true,
        form: new Form(),
        params: {
          dates: this.getDatePickerInitRange(),
          providers: [],
          search: '',
          status: '',
          services: [],
          customerId: ''
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
        selectedTimeZone: '',
        count: {
          success: 0,
          error: 0
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

      if (urlParams['customerId']) {
        this.params.dates = { start: '', end: '' }
        this.params.customerId = urlParams['customerId']
      }

      this.getAppointmentOptions(true)
    },

    mounted () {
      if (this.$root.settings.payments.wc && this.$root.settings.payments.wc.enabled) {
        this.exportParams.fields.splice(7, 0, {label: this.$root.labels.wc_order_id, value: 'wcOrderId', checked: true})
      }
    },

    updated () {
      if (this.fetched) this.inlineSVG()
    },

    methods: {
      getExportData () {
        if (!this.params.dates) {
          this.params.dates = {
            start: '',
            end: ''
          }
        }

        return Object.assign(this.params, this.exportParams)
      },

      clearDateFilter () {
        this.params.dates = null

        this.paginationParams.page = 1

        this.getAppointments()
      },

      switchShowDeleteConfirmation (bool) {
        this.showDeleteConfirmation = bool
        this.showDeleteButton = !bool
      },

      getCapacity (appointment) {
        let service = this.getAppointmentService(appointment)
        let numOfBookings = 0
        appointment.bookings.forEach((book) => {
          if (book.status !== 'canceled' && book.status !== 'rejected') {
            numOfBookings += book.persons
          }
        })
        return service ? numOfBookings + '/' + service.maxCapacity : ''
      },

      confirmationText () {
        let cnt = this.checkedAppointmentsCount()
        return cnt < 2 ? this.$root.labels.confirm_delete_appointment : this.$root.labels.confirm_delete_appointment_plural
      },

      checkedAppointmentsCount () {
        let cnt = 0
        this.useSortedDateStrings(Object.keys(this.appointmentsDay)).forEach((dateKey) => {
          cnt += this.appointmentsDay[dateKey].appointments.filter(app => app.checked).length
        })
        return cnt
      },

      deleteAppointmentGroup () {
        this.deleteAppointmentGroupLoading = true
        let $this = this
        let selectedAppointments = []

        this.useSortedDateStrings(Object.keys(this.appointmentsDay)).forEach(function (dateKey) {
          $this.appointmentsDay[dateKey].appointments.forEach(function (app) {
            if (app.checked) {
              selectedAppointments.push(app.id)
            }
          })
        })

        this.useSortedDateStrings(Object.keys(this.appointmentsDay)).forEach(function (dateKey) {
          $this.appointmentsDay[dateKey].appointments.forEach(function (app) {
            if (app.checked) {
              $this.form.post(`${$this.$root.getAjaxUrl}/appointments/delete/` + app.id)
                .then(() => {
                  $this.deleteAppointmentGroupCallback(selectedAppointments, true)
                })
                .catch(() => {
                  $this.deleteAppointmentGroupCallback(selectedAppointments, false)
                })
            }
          })
        })
      },

      deleteAppointmentGroupCallback (selectedAppointments, result) {
        selectedAppointments.pop()

        if (result) {
          this.count.success++
        } else {
          this.count.error++
        }

        if (selectedAppointments.length === 0) {
          if (this.count.success) {
            this.notify(
              this.$root.labels.success,
              this.count.success + ' ' + (this.count.success > 1 ? this.$root.labels.appointments_deleted : this.$root.labels.appointment_deleted),
              'success')
          }

          if (this.count.error) {
            this.notify(
              this.$root.labels.error,
              this.count.error + ' ' + (this.count.error > 1 ? this.$root.labels.appointments_not_deleted : this.$root.labels.appointment_not_deleted),
              'error')
          }

          this.count.success = 0
          this.count.error = 0

          let $this = this
          this.getAppointmentOptions(true)

          this.useSortedDateStrings(Object.keys(this.appointmentsDay)).forEach(function (dateKey) {
            $this.allDateAppointmentsChecked[dateKey] = false
          })

          this.allAppointmentsChecked = false
          this.toaster = false
          this.deleteAppointmentGroupLoading = false
          this.showDeleteConfirmation = false
          this.showDeleteButton = true
        }
      },

      updateBookingStatus (app, status) {
        this.updateBookingStatusLoading = true
        this.updateBookingStatusId = app.bookings[0].id
        this.form.post(`${this.$root.getAjaxUrl}/bookings/cancel/${app.bookings[0].id}`)
          .then(response => {
            this.updateBookingStatusLoading = false
            this.updateBookingStatusId = 0
            this.setTotalStatusCounts(app, status, response.data.status, [app.bookings[0].id])

            this.notify(
              this.$root.labels.success,
              this.$root.labels.appointment_status_changed + (this.$root.labels[response.data.status]).toLowerCase(),
              'success'
            )

            app.status = response.data.status
          })
          .catch(e => {
            if ('cancelBookingUnavailable' in e.response.data.data && e.response.data.data.cancelBookingUnavailable === true) {
              this.notify(this.$root.labels.error, this.$root.labels.booking_cancel_exception, 'error')
            }

            this.updateBookingStatusLoading = true
            this.updateBookingStatusId = 0
            this.errorMessage = e.message
          })
      },

      setTotalStatusCounts (app, requestStatus, responseStatus, changedBookingsIds) {
        let appointmentsCount = 0

        let $this = this

        this.useSortedDateStrings(Object.keys(this.appointmentsDay)).forEach(function (dateKey) {
          $this.appointmentsDay[dateKey].appointments.forEach(function (appItem) {
            appointmentsCount++
          })
        })

        app.bookings.forEach(function (bookItem) {
          if (changedBookingsIds.indexOf(bookItem.id) !== -1) {
            bookItem.status = responseStatus
          }
        })

        if (requestStatus === responseStatus) {
          switch (requestStatus) {
            case 'approved':
              if (this.appointmentStatusCount.approved < appointmentsCount) {
                this.appointmentStatusCount.approved++
              }

              if (this.appointmentStatusCount.pending > 0) {
                this.appointmentStatusCount.pending--
              }

              break

            case 'pending':
              if (this.appointmentStatusCount.pending < appointmentsCount) {
                this.appointmentStatusCount.pending++
              }

              if (this.appointmentStatusCount.approved > 0) {
                this.appointmentStatusCount.approved--
              }

              break
          }
        }
      },

      getAppointmentOptions (fetchAppointments) {
        this.options.fetched = false

        this.setInitialCustomers()

        this.fetchEntities((success) => {
          if (success && fetchAppointments) {
            this.getAppointments()
          }

          if (this.$root.settings.role === 'provider' && this.$root.settings.roles.allowWriteAppointments) {
            this.selectedTimeZone = this.options.entities.employees[0].timeZone ? this.options.entities.employees[0].timeZone : ''
          }

          this.fetched = true
          this.options.fetched = true
        }, {
          types: ['locations', 'employees', 'categories', 'custom_fields', 'packages', 'coupons', 'lessonSpace_spaces', 'resources', 'taxes'],
          page: 'appointments',
          isFrontEnd: false,
          isPanel: false
        })
      },

      getAppointments () {
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

        if (this.$root.settings.role === 'admin') {
          params.skipServices = 1
          params.skipProviders = 1
        }

        if (this.$root.settings.role === 'provider' && this.options.entities.employees.length === 1) {
          params.timeZone = this.options.entities.employees[0].timeZone ? this.options.entities.employees[0].timeZone : null
        }

        Object.keys(params).forEach((key) => (!params[key] && params[key] !== 0) && delete params[key])

        this.$http.get(`${this.$root.getAjaxUrl}/appointments`, {
          params: this.getAppropriateUrlParams(params)
        })
          .then(response => {
            this.appointmentStatusCount.approved = response.data.data.totalApproved
            this.appointmentStatusCount.pending = response.data.data.totalPending
            this.totalPeriodAppointments = response.data.data.total
            this.currentUser = response.data.data.currentUser
            this.customersNoShowCount = response.data.data.customersNoShowCount

            let $this = this

            this.toaster = false

            let appointmentDays = {}

            if (this.$root.settings.role !== 'admin') {
              this.setMissingServices(response.data.data.appointments)
            }

            if (this.$root.settings.role === 'customer') {
              this.useSortedDateStrings(Object.keys(response.data.data.appointments)).forEach(function (dateKey) {
                response.data.data.appointments[dateKey].appointments.forEach(function (appointment) {
                  appointment.bookings.forEach(function (booking) {
                    let parsedAppointment = JSON.parse(JSON.stringify(appointment))

                    parsedAppointment.bookings = [
                      booking
                    ]

                    if (!(dateKey in appointmentDays)) {
                      appointmentDays[dateKey] = response.data.data.appointments[dateKey]
                      appointmentDays[dateKey].appointments = []
                    }

                    appointmentDays[dateKey].appointments.push(parsedAppointment)
                  })
                })
              })

              /* this.useSortedDateStrings(Object.keys(appointmentDays)).forEach(function (dateKey) {
                appointmentDays[dateKey].appointments.forEach(function (app) {
                  if (app.bookings[0].status === 'approved') {
                    $this.appointmentStatusCount.approved++
                  }

                  if (app.bookings[0].status === 'pending') {
                    $this.appointmentStatusCount.pending++
                  }
                })
              }) */
            } else {
              appointmentDays = response.data.data.appointments

              let customersIds = this.options.entities.customers.map(customer => parseInt(customer.id))

              let customers = this.options.entities.customers

              this.useSortedDateStrings(Object.keys(response.data.data.appointments)).forEach(function (dateKey) {
                response.data.data.appointments[dateKey].appointments.forEach(function (app) {
                  app.checked = false

                  app.bookings.forEach((booking) => {
                    if (customersIds.indexOf(parseInt(booking.customer.id)) === -1) {
                      customersIds.push(booking.customer.id)
                      customers.push(booking.customer)
                    }
                  })
                })

                $this.allDateAppointmentsChecked[dateKey] = false
              })

              this.options.entities.customers = Object.values(customers.sort((a, b) => (a.firstName.toLowerCase() > b.firstName.toLowerCase()) ? 1 : -1))
            }

            this.appointmentsDay = Object.keys(appointmentDays).length === 0 ? [] : appointmentDays

            if ($this.$root.settings.role === 'customer') {
              setTimeout(function () {
                let elements = document.getElementsByClassName('el-collapse-item__arrow')

                for (let i = 0; i < elements.length; i++) {
                  elements[i].style.display = 'none'
                }
              }, 200)
            }

            this.fetched = true
            this.fetchedFiltered = true
          })
          .catch(e => {
            console.log(e.message)
            this.fetched = true
            this.fetchedFiltered = true
          })
      },

      appointmentCameFrom (app) {
        let arr = []
        app.bookings.forEach(booking => {
          if (booking.info) {
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

        this.paginationParams.page = 1

        this.changeFilter()
      },

      changeFilter () {
        if (!this.params.customerId) {
          this.searchedCustomers = []
        }

        this.getAppointments()
      },

      handleResize () {
        this.filterFields = window.innerWidth >= 992
      },

      handleDateFormat (date) {
        if (date === moment().format('YYYY-MM-DD')) {
          return this.$root.labels.today
        } else if (date === moment().add(1, 'days').format('YYYY-MM-DD')) {
          return this.$root.labels.tomorrow
        }
        return this.getFrontedFormattedDate(date)
      },

      handleCheckAllAppointments () {
        let $this = this

        this.useSortedDateStrings(Object.keys(this.appointmentsDay)).forEach(function (dateKey) {
          $this.appointmentsDay[dateKey].appointments.forEach(function (app) {
            app.checked = $this.allAppointmentsChecked
            $this.allDateAppointmentsChecked[dateKey] = $this.allAppointmentsChecked
          })
        })

        this.toaster = $this.allAppointmentsChecked
      },

      handleCheckedDateAppointments (appDateKey) {
        let $this = this
        let checkedAllAppointmentsCount = 0
        let totalAppointmentsCount = 0
        let showToaster = false

        this.useSortedDateStrings(Object.keys(this.appointmentsDay)).forEach(function (dateKey) {
          $this.appointmentsDay[dateKey].appointments.forEach(function (app) {
            if (dateKey === appDateKey) {
              app.checked = $this.allDateAppointmentsChecked[appDateKey]
              checkedAllAppointmentsCount++
            }
            if (app.checked) showToaster = true
            totalAppointmentsCount++
          })
        })

        this.allAppointmentsChecked = (checkedAllAppointmentsCount === totalAppointmentsCount)
        this.toaster = showToaster
      },

      handleCheckedAppointment () {
        let $this = this
        let checkedAllAppointmentsCount = 0
        let totalAppointmentsCount = 0

        this.useSortedDateStrings(Object.keys(this.appointmentsDay)).forEach(function (dateKey) {
          let checkedDateAppointmentsCount = 0

          $this.appointmentsDay[dateKey].appointments.forEach(function (app) {
            if (app.checked) {
              checkedDateAppointmentsCount++
              checkedAllAppointmentsCount++
            }

            totalAppointmentsCount++
          })

          $this.allDateAppointmentsChecked[dateKey] = (checkedDateAppointmentsCount === $this.appointmentsDay[dateKey].appointments.length)
        })

        this.toaster = checkedAllAppointmentsCount > 0
        this.allAppointmentsChecked = (checkedAllAppointmentsCount === totalAppointmentsCount)
      },

      selectAllInCategory (id) {
        let services = this.getCategoryServices(id)
        let servicesIds = services.map(service => service.id)

        // Deselect all services if they are already selected
        if (_.isEqual(_.intersection(servicesIds, this.params.services), servicesIds)) {
          this.params.services = _.difference(this.params.services, servicesIds)
        } else {
          this.params.services = _.uniq(this.params.services.concat(servicesIds))
        }

        this.getAppointments()
      },

      getBookingStatus (appointmentStatus, bookingStatus) {
        if (this.$root.settings.role === 'customer' && appointmentStatus !== 'pending') {
          return bookingStatus
        }

        return appointmentStatus
      },

      showDialogNewCustomer () {
        this.customer = this.getInitCustomerObject()
        this.dialogCustomer = true
      },

      canWriteAppointments (appointment = null) {
        return this.$root.settings.capabilities.canWriteOthers === true ||
            (this.$root.settings.role === 'provider' && this.$root.settings.roles.allowWriteAppointments &&
            (appointment ? appointment.providerId === this.currentUser.id : true))
      },

      openRecurringAppointment (id) {
        this.dialogAppointment = false

        setTimeout(() => {
          this.showDialogEditAppointment(id)
        }, 200)
      }
    },

    computed: {
      visibleEmployees () {
        return this.options.entities.employees.filter(employee => employee.status === 'hidden' || employee.status === 'visible')
      },

      filterApplied () {
        return !!this.params.search || !!this.params.services.length || !!this.params.providers.length || !!this.params.customerId || (this.params.dates && (!!this.params.dates.start || !!this.params.dates.end)) || !!this.params.status
      }
    },

    watch: {
      'params.search' () {
        if (typeof this.params.search !== 'undefined') {
          this.fetchedFiltered = false
          clearTimeout(this.timer)
          this.timer = setTimeout(this.changeFilter, 500)
        }
      }
    },

    components: {
      PaginationBlock,
      PageHeader,
      DialogAppointment,
      DialogCustomer,
      DialogPayment,
      DialogExport,
      AppointmentListCollapsed
      /* DialogNewCustomize */
    }
  }
</script>
