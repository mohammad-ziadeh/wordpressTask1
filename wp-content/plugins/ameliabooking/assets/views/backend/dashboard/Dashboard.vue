<template>
  <div class="am-wrap">

    <get-premium-banner></get-premium-banner>

    <div id="am-dashboard" class="am-body">

      <!-- Page Header -->
      <page-header @changeFilter="changeFilter" :params="params"></page-header>

      <!-- Spinner -->
      <div class="am-spinner am-section" v-show="!fetched || !fetchedStats">
        <img :src="$root.getUrl + 'public/img/spinner.svg'"/>
      </div>

            <!-- Statistics -->
      <div v-if="fetched === true && fetchedStats === true">
        <div class="am-hello am-section">
          <div class="am-user-name">
            <h1 v-if="currentUser !== null">{{$root.labels.hello_message_part0}} {{currentUser.firstName}} {{currentUser.lastName}} <img :src="$root.getUrl + 'public/img/wave.png'"></h1>
            <div class="am-user-alert">
              <span>{{$root.labels.hello_message_part1}} <img :src="$root.getUrl + 'public/img/check.png'"> <span>{{todayAppointmentsCount.approved !== null ? todayAppointmentsCount.approved : 0}}</span> {{$root.labels.approved_appointments.toLowerCase()}} {{$root.labels.hello_message_part2}} <img :src="$root.getUrl + 'public/img/clock.png'"> {{todayAppointmentsCount.pending !== null ? todayAppointmentsCount.pending : 0}} {{$root.labels.pending_appointments.toLowerCase()}} {{$root.labels.hello_message_part3}}</span>
            </div>
          </div>
        </div>

        <div class="am-stats am-section">
          <div class="am-big-stats">
            <el-row :gutter="0">
              <el-col :sm="24" :md="12" :lg="8">
                <div class="am-grid-content">
                  <div class="am-title">
                    <h3>{{$root.labels.approved_appointments}}
                      <el-tooltip placement="top">
                        <div slot="content" v-html="$root.labels.approved_appointments_tooltip"></div>
                        <i class="el-icon-question am-tooltip-icon"></i>
                      </el-tooltip>
                      <span class="am-change" :class="countGrowthClass">{{ selectedPeriodStats.count - previousPeriodStats.count }}</span>
                    </h3>
                  </div>
                  <div class="am-big-num">
                    <span>{{calculateChartTotal('count')}}</span>
                  </div>

                  <!-- Small Chart -->
                  <bar-chart
                      ref="appointmentsCountChart"
                      :data="smallBarChartAppointmentsData"
                      :options="smallBarChartAppointmentsOptions"
                      :width=40
                      :height=15
                  >
                  </bar-chart>

                  <div>
                    <a class="am-goto" @click="navigateTo('appointments')">{{ $root.labels.view }} {{$root.labels.appointments}}</a>
                  </div>
                </div>
              </el-col>

              <el-col :sm="24" :md="12" :lg="8">
                <div class="am-grid-content">
                  <div class="am-title">
                    <h3>{{$root.labels.percentage_of_load}}
                      <el-tooltip placement="top">
                        <div slot="content" v-html="$root.labels.percentage_of_load_tooltip"></div>
                        <i class="el-icon-question am-tooltip-icon"></i>
                      </el-tooltip>
                      <span class="am-change" :class="loadGrowthClass">{{ loadGrowthPercentage }}{{ loadGrowthPercentageCharacter }}</span>
                    </h3>
                  </div>
                  <div class="am-big-num">
                    <span>{{calculateChartTotal('load')}}</span>
                  </div>

                  <line-chart
                      ref="appointmentsLoadChart"
                      :data="smallLineChartLoadData"
                      :options="smallLineChartLoadOptions"
                      :width=40
                      :height=15
                  >
                  </line-chart>

                  <div v-if="!$root.licence.isLite">
                    <a class="am-goto" @click="navigateTo('employees')">{{ $root.labels.view }} {{$root.labels.employees}}</a>
                  </div>
                </div>
              </el-col>

              <el-col :sm="24" :md="12" :lg="8">
                <div class="am-grid-content">
                  <div class="am-title">
                    <h3>{{$root.labels.revenue}}
                      <el-tooltip placement="top">
                        <div slot="content" v-html="$root.labels.revenue_tooltip"></div>
                        <i class="el-icon-question am-tooltip-icon"></i>
                      </el-tooltip>
                      <span class="am-change" :class="revenueGrowthClass">{{ revenueGrowthPercentage }}{{ revenueGrowthPercentageCharacter }}</span>
                    </h3>
                  </div>
                  <div class="am-big-num">
                    <span>{{calculateChartTotal('revenue')}}</span>
                  </div>

                  <line-chart
                      ref="appointmentsRevenueChart"
                      :data="smallLineChartRevenueData"
                      :options="smallLineChartRevenueOptions"
                      :width=40
                      :height=15
                  >
                  </line-chart>

                  <div>
                    <a class="am-goto" @click="navigateTo('finance')">{{ $root.labels.view }} {{$root.labels.finance}}</a>
                  </div>
                </div>
              </el-col>
            </el-row>
          </div>
        </div>

        <!-- Employee Stats-->
        <div class="am-employee-table-stats am-section">
          <el-tabs v-model="tableStats">
            <el-tab-pane :label="$root.labels.employees" name="employeeTableStats">
              <el-table
                  :data="visibleEmployeeTableData"
                  :default-sort = "{prop: 'employeeName', order: 'ascending'}"
                  style="width: 100%;"
                  :empty-text="$root.labels.no_employees_yet"
                  @sort-change="employeeTableSortChange">
                <el-table-column
                    fixed
                    prop="employeeName"
                    :label="$root.labels.employee"
                    sortable
                    min-width="180"
                >
                  <template slot-scope="scope">
                    <img :src="pictureLoad(scope.row.provider, true)" @error="imageLoadError(scope.row.provider, true)" />
                    {{ scope.row.employeeName }}
                  </template>
                </el-table-column>
                <el-table-column
                    prop="numAppointments"
                    :label="$root.labels.appointments_count"
                    sortable
                    min-width="220"
                >
                </el-table-column>
                <el-table-column
                    prop="sumPayments"
                    :label="$root.labels.appointments_revenue"
                    :formatter="revenueFormatter"
                    sortable
                    min-width="220"
                >
                </el-table-column>

                <el-table-column
                    prop="hoursAppointment"
                    :label="$root.labels.appointments_hours"
                    :formatter="hoursFormatter"
                    sortable
                    min-width="220"
                >
                </el-table-column>
                <el-table-column
                    prop="load"
                    :label="$root.labels.appointments_load"
                    sortable
                    min-width="220"
                >
                  <template slot-scope="scope">
                    <div style="width: 100%;">
                      <div style="width: 50px; display: inline-block;">{{ scope.row.load }}%</div>
                      <el-progress
                          :width="120"
                          :show-text=false
                          :percentage=scope.row.load
                          :color=getPercentageBarColor(scope.row.load)>

                      </el-progress>
                    </div>

                  </template>
                </el-table-column>
              </el-table>

              <!-- Pagination -->
              <pagination-block
                  :params="employeeTableParams"
                  :show="employeeTableParams.show"
                  :count="employeeTableParams.total"
                  :label="$root.labels.employees.toLowerCase()"
                  :visible="employeeTableParams.show < employeeTableParams.total"
                  @change="changeVisibleEmployeeTableData"
              >
              </pagination-block>

            </el-tab-pane>

            <el-tab-pane :label="$root.labels.services" name="serviceTableStats">
              <el-table
                  :data="visibleServiceTableData"
                  :default-sort = "{prop: 'serviceName', order: 'ascending'}"
                  style="width: 100%;"
                  :empty-text="$root.labels.no_services_yet"
                  @sort-change="serviceTableSortChange">
                <el-table-column
                    fixed
                    prop="serviceName"
                    :label="$root.labels.service"
                    sortable
                    min-width="180"
                >
                  <template slot-scope="scope">
                    <img :src="pictureLoad(scope.row.service, false)" @error="imageLoadError(scope.row.service, false)" />
                    {{ scope.row.serviceName }}
                  </template>
                </el-table-column>
                <el-table-column
                    prop="numAppointments"
                    :label="$root.labels.appointments_count"
                    sortable
                    min-width="220"
                >
                </el-table-column>
                <el-table-column
                    prop="sumPayments"
                    :label="$root.labels.appointments_revenue"
                    :formatter="revenueFormatter"
                    sortable
                    min-width="220"
                >
                </el-table-column>

                <el-table-column
                    prop="hoursAppointment"
                    :label="$root.labels.appointments_hours"
                    :formatter="hoursFormatter"
                    sortable
                    min-width="220"
                >
                </el-table-column>
                <el-table-column
                    prop="load"
                    :label="$root.labels.appointments_load"
                    sortable
                    min-width="220"
                >
                  <template slot-scope="scope">
                    <div style="width: 100%">
                      <span>{{ scope.row.load }}%</span>
                      <el-progress
                          :width="120"
                          :show-text=false
                          :percentage=scope.row.load
                          :color=getPercentageBarColor(scope.row.load)>
                      </el-progress>
                    </div>

                  </template>
                </el-table-column>
              </el-table>

              <!-- Pagination -->
              <pagination-block
                  :params="serviceTableParams"
                  :show="serviceTableParams.show"
                  :count="serviceTableParams.total"
                  :label="$root.labels.services.toLowerCase()"
                  :visible="serviceTableParams.show < serviceTableParams.total"
                  @change="changeVisibleServiceTableData"
              >
              </pagination-block>
            </el-tab-pane>

            <el-tab-pane :label="$root.labels.packages" name="packageTableStats" class="am-packages-feature" v-if="$root.licence.isPro || $root.licence.isDeveloper">
              <el-table
                  :data="visiblePackageTableData"
                  :default-sort = "{prop: 'packageName', order: 'ascending'}"
                  style="width: 100%;"
                  :empty-text="$root.labels.no_packages_yet"
                  @sort-change="packageTableSortChange">
                <el-table-column
                    fixed
                    prop="packageName"
                    :label="$root.labels.package"
                    sortable
                    min-width="180"
                >
                  <template slot-scope="scope">
                    <img :src="pictureLoad(scope.row.pack, false)" @error="imageLoadError(scope.row.pack, false)" />
                    {{ scope.row.packageName }}
                  </template>
                </el-table-column>
                <el-table-column
                    prop="numPurchased"
                    :label="$root.labels.packages_purchased_count"
                    sortable
                    min-width="220"
                >
                </el-table-column>
                <el-table-column
                    prop="sumPayments"
                    :label="$root.labels.appointments_revenue"
                    :formatter="revenueFormatter"
                    sortable
                    min-width="220"
                >
                </el-table-column>

                <el-table-column
                    prop="hoursAppointment"
                    :label="$root.labels.appointments_hours"
                    :formatter="hoursFormatter"
                    sortable
                    min-width="220"
                >
                </el-table-column>
              </el-table>

              <!-- Pagination -->
              <pagination-block
                  :params="packageTableParams"
                  :show="packageTableParams.show"
                  :count="packageTableParams.total"
                  :label="$root.labels.packages.toLowerCase()"
                  :visible="packageTableParams.show < packageTableParams.total"
                  @change="changeVisiblePackageTableData"
              >
              </pagination-block>
            </el-tab-pane>

          </el-tabs>

        </div>

        <!-- Upcoming Appointments -->
        <div id="am-appointments" class="am-upcoming-appointments am-section">

          <!-- Header -->
          <el-form :model="params" class="demo-form-inline" :action="exportAction" method="POST">
            <el-row>

              <!-- Header Title -->
              <el-col :span="20">
                <h2 class="am-section-title">{{ $root.labels.upcoming_appointments }}</h2>
              </el-col>

              <!-- Export Button -->
              <el-col :span="4">
                <div class="align-right">
                  <el-tooltip placement="top">
                    <div slot="content" v-html="$root.labels.export_tooltip_appointments"></div>
                    <el-button
                        class="button-export am-button-icon"
                        :disabled="appointments.length === 0"
                        @click="dialogExport = true"
                    >
                      <img class="svg-amelia" :alt="$root.labels.export" :src="$root.getUrl+'public/img/export.svg'"/>
                    </el-button>
                  </el-tooltip>
                </div>
              </el-col>
            </el-row>


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
                    :data="getExportParams()"
                    :action="$root.getAjaxUrl + '/report/appointments'"
                    @updateAction="(action) => {this.exportAction = action}"
                    @closeDialogExport="dialogExport = false"
                >
                </dialog-export>
              </el-dialog>
            </transition>
          </el-form>

          <!-- Appointments List Head -->
          <div class="am-appointments-list-head" v-if="appointments.length > 0">
            <el-row>

              <el-col :lg="15">
                <el-row :gutter="10" class="am-appointments-flex-row-middle-align">
                  <el-col :lg="5" :md="5">
                    <p>{{ $root.labels.date }} / {{ $root.labels.time }}:</p>
                  </el-col>
                  <el-col :lg="5" :md="5">
                    <p>{{ $root.labels.customer }}:</p>
                  </el-col>
                  <el-col :lg="5" :md="5">
                    <p>{{ $root.labels.assigned_to }}:</p>
                  </el-col>
                  <el-col :lg="9" :md="9">
                    <p>{{ $root.labels.service }}:</p>
                  </el-col>
                </el-row>
              </el-col>

              <el-col :lg="9">
                <el-row :gutter="10" class="am-appointments-flex-row-middle-align">
                  <el-col :lg="0" :md="3"></el-col>
                  <el-col :lg="5" :md="6">
                    <p>{{ $root.labels.duration }}:</p>
                  </el-col>
                  <el-col :lg="6" :md="6">
                    <p>{{ $root.labels.price }}:</p>
                  </el-col>
                  <el-col :lg="13" :md="6">
                    <p>{{ $root.labels.status }}:</p>
                  </el-col>
                </el-row>
              </el-col>

            </el-row>
          </div>

          <!-- Appointments List -->
          <div
            v-if="appointments.length > 0"
            class="am-appointments"
          >
            <div class="am-appointments-list">
              <el-collapse>
                <el-collapse-item
                  v-for="app in appointments"
                  :key="app.id"
                  :name="app.id"
                  class="am-appointment"
                  :class="appointmentCameFrom(app)"
                >

                  <template slot="title">
                    <div class="am-appointment-data">
                      <el-row>
                        <el-col :lg="15">
                          <el-row :gutter="10" class="am-appointments-flex-row-middle-align">

                            <!-- Appointment Time -->
                            <el-col :lg="5" :sm="5">
                              <span class="am-appointment-time" :class="app.status">{{ getFrontedFormattedDateTime(app.bookingStart) }}</span>
                            </el-col>

                            <!-- Appointment Customer(s) -->
                            <el-col :lg="5" :sm="6">
                              <p class="am-col-title">{{ $root.labels.customer }}:</p>
                              <template>
                                <el-tooltip
                                  class="item"
                                  effect="dark"
                                  placement="top"
                                  :disabled="app.bookings.length === 1"
                                  popper-class="am-align-left"
                                >
                                  <div
                                    v-if="app.bookings.length > 1"
                                    slot="content"
                                    v-html="getCustomersFromGroup(app)"
                                  ></div>
                                  <h3 :class="{ grouped: app.bookings.length > 1 }">
                                    <img
                                      v-show="app.bookings.length > 1"
                                      width="16px"
                                      :src="$root.getUrl+'public/img/group.svg'"
                                      class="svg-amelia"
                                    />
                                    <span v-for="(booking, index) in app.bookings" :class="(app.bookings.length === 1 ? getNoShowClass(booking.customerId, customersNoShowCount, null, booking.customer.status) : '')">
                                      {{ ((user = getCustomerInfo(booking)) !== null ? user.firstName + ' ' + user.lastName : '') }}<span
                                        v-if="app.bookings.length > 1 && index + 1  !== app.bookings.length">,</span>
                                    </span>
                                  </h3>
                                </el-tooltip>
                                <span v-if="app.bookings.length === 1" v-for="booking in app.bookings">{{ ((user = getCustomerById(booking.customerId)) !== null ? user.email : '') }}</span>
                                <span v-if="app.bookings.length > 1">{{$root.labels.multiple_emails}}</span>
                              </template>
                            </el-col>

                            <!-- Appointment Provider -->
                            <el-col :lg="5" :sm="6">
                              <p class="am-col-title">{{ $root.labels.assigned }}:</p>
                              <div class="am-assigned">
                                <img :src="pictureLoad(getProviderById(app.providerId), true)"
                                     @error="imageLoadError(getProviderById(app.providerId), true)"
                                     v-if="options.fetched"/>
                                <h4>
                                  {{ ((user = getProviderById(app.providerId)) !== null ? user.firstName + ' ' +
                                  user.lastName : '') }}
                                </h4>
                              </div>
                            </el-col>

                            <!-- Appointment Service -->
                            <el-col :lg="9" :sm="7">
                              <p class="am-col-title">{{ $root.labels.service }}:</p>
                              <h4>
                                {{ ((service = getServiceById(app.serviceId)) !== null ? service.name : '') }}
                              </h4>
                            </el-col>

                          </el-row>
                        </el-col>

                        <el-col :lg="9">
                          <el-row :gutter="10" class="am-appointments-flex-row-middle-align">

                            <!-- Appointment Duration -->
                            <el-col :lg="5" :sm="5" :xs="12">
                              <p class="am-col-title">{{ $root.labels.duration }}:</p>
                              <h4>{{
                                momentDurationToNiceDurationWithUnit(convertDateTimeRangeDifferenceToMomentDuration(app.bookingStart,
                                  app.bookingEnd)) }}</h4>
                            </el-col>

                            <!-- Appointment Payment -->
                            <el-col class="am-appointment-payment" :lg="6" :sm="6" :xs="12">
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
                                <el-tooltip v-if="Object.keys(bookingTypeCountInPackage(app.bookings).package).length"
                                            placement="top"
                                            :content="$root.labels.bookings_payment_package_tooltip"
                                            effect="light"
                                >
                                  <img
                                          v-if="Object.keys(bookingTypeCountInPackage(app.bookings).package).length"
                                          :src="$root.getUrl + 'public/img/am-package.svg'"
                                  >
                                </el-tooltip>
                              </div>
                            </el-col>

                            <!-- Appointment Status -->
                            <el-col :lg="8" :sm="8" :xs="17">
                              <div class="am-appointment-status" @click.stop>
                                <span :class="'am-appointment-status-symbol am-appointment-status-symbol-'+app.status"></span>
                                <el-select
                                    v-model="app.status"
                                    :placeholder="$root.labels.status"
                                    @change="updateAppointmentStatus(app, app.status, false)"
                                    :disabled="app.past"
                                >
                                  <el-option
                                      v-for="opt in statuses"
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

                            <!-- Appointment Edit -->
                            <el-col :lg="5" :sm="5" :xs="7">
                              <div class="am-edit-btn" @click.stop>
                                <el-button @click="showDialogEditAppointment(app.id)">
                                  {{ $root.labels.edit }}
                                </el-button>
                              </div>
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

          <!-- No Results -->
          <div class="am-empty-state am-section" v-if="appointments.length === 0">
            <img :src="$root.getUrl + 'public/img/emptystate.svg'">
            <p>{{ $root.labels.no_upcoming_appointments }}</p>
          </div>

        </div>

        <!-- Charts -->
        <div class="am-charts am-section">
          <el-row :gutter="32">

            <!-- Conversions Charts -->
            <el-col :md="16" class="am-border-right">
              <div class="am-chart bar-chart">
                <h2 class="am-section-title">
                  {{ $root.labels.conversions }}
                  <el-tooltip placement="top">
                    <div slot="content" v-html="$root.labels.conversions_tooltip"></div>
                    <i class="el-icon-question am-tooltip-icon"></i>
                  </el-tooltip>
                </h2>
                <el-tabs v-model="chartTabs">

                  <!-- Employees Conversions Chart Tab -->
                  <el-tab-pane :label="$root.labels.employees" name="employee">

                    <!-- Employees Conversions Chart Filter -->
                    <div class="am-chart-filter">
                      <el-row :gutter="10">
                        <el-col :sm="12">
                          <el-select
                              v-model="employees"
                              @change="filterEmployeesChart"
                              filterable
                              clearable
                              :placeholder="$root.labels.select_employee"
                              multiple
                              collapse-tags
                          >
                            <el-option
                                v-for="item in options.entities.employees"
                                :key="item.id"
                                :label="item.firstName + ' ' + item.lastName"
                                :value="item.id"
                            >
                            </el-option>
                          </el-select>
                        </el-col>
                      </el-row>
                    </div>

                    <!-- Employees Conversions Chart -->
                    <bar-chart
                        v-if="chartTabs === 'employee'"
                        ref="employeesChart"
                        :data="employeesChartData"
                        :options="defaultBarChartOptions"
                    >
                    </bar-chart>

                  </el-tab-pane>

                  <!-- Services Conversions Chart Tab -->
                  <el-tab-pane :label="$root.labels.services" name="service">

                    <!-- Services Conversions Chart Filter -->
                    <div class="am-chart-filter">
                      <el-row :gutter="10">
                        <el-col :sm="12">
                          <el-select
                              v-model="services"
                              @change="filterServicesChart"
                              filterable
                              clearable
                              :placeholder="$root.labels.select_service"
                              multiple
                              collapse-tags
                          >
                            <el-option
                                v-for="item in options.entities.services"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id"
                            >
                            </el-option>
                          </el-select>
                        </el-col>
                      </el-row>
                    </div>

                    <!-- Services Conversions Chart -->
                    <bar-chart
                        v-if="chartTabs === 'service'"
                        ref="servicesChart"
                        :data="servicesChartData"
                        :options="defaultBarChartOptions"
                    >
                    </bar-chart>

                  </el-tab-pane>

                  <!-- Locations Conversions Chart Tab -->
                  <el-tab-pane :label="$root.labels.locations" name="location" v-if="options.entities.locations.length">

                    <!-- Locations Conversions Chart Filter -->
                    <div class="am-chart-filter">
                      <el-row :gutter="10">
                        <el-col :sm="12">
                          <el-select
                              v-model="locations"
                              @change="filterLocationsChart"
                              filterable
                              clearable
                              :placeholder="$root.labels.select_location"
                              multiple
                              collapse-tags
                          >
                            <el-option
                                v-for="item in options.entities.locations"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id"
                            >
                            </el-option>
                          </el-select>
                        </el-col>
                      </el-row>
                    </div>

                    <!-- Locations Conversions Chart -->
                    <bar-chart
                        v-if="chartTabs === 'location'"
                        ref="locationsChart"
                        :data="locationsChartData"
                        :options="defaultBarChartOptions"
                    >
                    </bar-chart>

                  </el-tab-pane>

                </el-tabs>
              </div>
            </el-col>

            <!-- Customers Chart -->
            <el-col :md="8">
              <div class="am-chart doughnut-chart">

                <!-- Customers Label and Growth Stats -->
                <el-row>
                  <el-col :span="12">
                    <h2 class="am-section-title">
                      {{ $root.labels.customers }}
                      <el-tooltip placement="top">
                        <div slot="content" v-html="$root.labels.customers_tooltip"></div>
                        <i class="el-icon-question am-tooltip-icon"></i>
                      </el-tooltip>
                    </h2>
                  </el-col>
                  <el-col :span="12">
                    <h2 class="align-right" v-if="fetched">{{ totalCustomers }}
                      <span :class="customerGrowthClass">
                      {{ customersGrowthPercentage }}{{ customerGrowthPercentageCharacter }}
                    </span>
                    </h2>
                  </el-col>
                </el-row>

                <!-- Customers Chart -->
                <div class="" style="padding: 0 40px;">
                  <doughnut-chart
                      ref="customersChart"
                      :data="customersChartData"
                  >
                  </doughnut-chart>
                </div>

                <!-- Customers Progress Charts -->
                <el-row>
                  <el-col :span="12">
                    <p class="am-big-num" v-if="fetched">
                      {{ newCustomers }}
                    </p>
                    <p>{{ $root.labels.new }}</p>
                    <el-progress
                        v-if="fetched"
                        :percentage="newCustomersPercentage"
                        color="#1A84EE"
                    >
                    </el-progress>
                  </el-col>
                  <el-col :span="12">
                    <p class="am-big-num" v-if="fetched">
                      {{ returningCustomers }}
                    </p>
                    <p>{{ $root.labels.returning }}</p>
                    <el-progress
                        v-if="fetched"
                        :percentage="returnedCustomersPercentage"
                        color="#FFD400"
                    >
                    </el-progress>
                  </el-col>
                </el-row>

              </div>
            </el-col>

          </el-row>
        </div>

        <!-- Button New -->
        <div v-if="$root.settings.capabilities.canWrite === true" id="am-button-new" class="am-button-new">
          <el-popover
              ref="popover"
              placement="top"
              width="160"
              v-model="popover"
              visible-arrow="false"
              popper-class="am-button-popover">
            <div class="am-overlay" @click="popover = false; buttonNewItems = !buttonNewItems">
              <div class="am-button-new-items">
                <transition name="el-zoom-in-bottom">
                  <div v-show="buttonNewItems">
                    <el-button @click="showDialogNewAppointment()">{{ $root.labels.new_appointment }}</el-button>
                    <el-button @click="showDialogNewCustomer">{{ $root.labels.create_customer }}</el-button>
                  </div>
                </transition>
              </div>
            </div>
          </el-popover>
          <el-button
              id="am-plus-symbol"
              v-popover:popover
              type="primary"
              icon="el-icon-plus"
              @click="buttonNewItems = !buttonNewItems"
              ref="rotating"
          >
          </el-button>
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
                :close-on-click-modal="false"
                :appointment="appointment"
                :recurringAppointments="recurringAppointments"
                :savedAppointment="savedAppointment"
                :bookings="bookings"
                :options="options"
                :packageCustomer="null"
                :customersNoShowCount="customersNoShowCount"
                @sortBookings="sortBookings"
                @saveCallback="getDashboardOptions"
                @duplicateCallback="duplicateAppointmentCallback"
                @closeDialog="closeDialogAppointment"
                @showDialogNewCustomer="showDialogNewCustomer"
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
                @saveCallback="saveCustomerCallback"
                @closeDialog="dialogCustomer = false"
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
                :appointmentFetched=true
                :bookingFetched=true
                @closeDialogPayment="dialogPayment = false"
                @updatePaymentCallback="updatePaymentCallback"
                @deletePaymentCallback="deletePaymentCallback"
            >
            </dialog-payment>
          </el-dialog>
        </transition>
      </div>

<!--      <transition name="fade">
        <div class="am-amelia-banner">
          <div class="am-amelia-banner__content">
            <div class="am-amelia-banner__content-main">

              <div class="am-amelia-banner__content-main-left">
                <div class="am-amelia-banner__content-main-left-logo">
                  <img :src="$root.getUrl + 'public/img/promo/wpDataTables-logo-with-name.svg'"/>
                </div>
                <div class="am-amelia-banner__content-main-left-subtitle">
                  <p>wpDataTables {{ $root.licence.isLite ? 'Lite' : 'Premium' }}</p>
                </div>
                <div class="am-amelia-banner__content-main-left-text">
                  <p>The most powerful WordPress table plugin - wpDataTables is designed to make the
                  process of data representation and interaction quick, easy and effective.</p>
                </div>
                <div class="am-amelia-banner__content-main-left-rating">
                  <img :src="$root.getUrl + 'public/img/promo/Rating.svg'"/>
                  <p  class="am-amelia-banner__content-main-left-rating-text">
                    Rating: 4.8 - 263 reviews
                  </p>
                </div>
                <div class="am-amelia-banner__content-main-left-buttons">
                  <a
                      v-if="$root.licence.isLite"
                      class="am-promo-btn el-button el-button&#45;&#45;primary"
                      href="https://downloads.wordpress.org/plugin/wpdatatables.zip"
                  >
                    <span>Free Download</span>
                    <img :src="$root.getUrl + 'public/img/promo/download.svg'"/>
                  </a>
                  <a
                      class="am-promo-btn el-button el-button&#45;&#45;primary"
                      :href="$root.licence.isLite ? 'https://wordpress.org/plugins/wpdatatables/' : 'https://wpdatatables.com/'"
                      target="_blank"
                  >
                    <span>Learn More</span>
                    <img :src="$root.getUrl + 'public/img/promo/arrow-right.svg'"/>
                  </a>
                </div>
              </div>

              <div class="am-amelia-banner__content-main-right">
                <img :src="$root.getUrl + 'public/img/promo/wpdt-promo.webp'"/>
              </div>
            </div>
          </div>
        </div>
      </transition>-->

      <!-- Help Button -->
      <el-col :md="6" class="">
        <a class="am-help-button" href="https://wpamelia.com/admin-dashboard/" target="_blank" rel="nofollow">
          <i class="el-icon-question"></i> {{ $root.labels.need_help }}?
        </a>
      </el-col>

    </div>

    <dialog-new-customize v-if="false"></dialog-new-customize>

  </div>
</template>

<script>
  import AppointmentListCollapsed from '../appointments/AppointmentListCollapsed.vue'
  import appointmentMixin from '../../../js/backend/mixins/appointmentMixin'
  import appointmentPriceMixin from '../../../js/backend/mixins/appointmentPriceMixin'
  import BarChart from '../../../js/backend/components/barchart'
  import DoughnutChart from '../../../js/backend/components/doughnutchart'
  import LineChart from '../../../js/backend/components/linechart'
  import customerMixin from '../../../js/backend/mixins/customerMixin'
  import dateMixin from '../../../js/common/mixins/dateMixin'
  import DialogAppointment from '../appointments/DialogAppointment.vue'
  import DialogCustomer from '../customers/DialogCustomer.vue'
  import DialogExport from '../parts/DialogExport.vue'
  import DialogPayment from '../finance/DialogFinancePayment.vue'
  import durationMixin from '../../../js/common/mixins/durationMixin'
  import entitiesMixin from '../../../js/common/mixins/entitiesMixin'
  import Form from 'form-object'
  import imageMixin from '../../../js/common/mixins/imageMixin'
  import moment from 'moment'
  import notifyMixin from '../../../js/backend/mixins/notifyMixin'
  import PageHeader from '../parts/PageHeader.vue'
  import paymentMixin from '../../../js/backend/mixins/paymentMixin'
  import priceMixin from '../../../js/common/mixins/priceMixin'
  import PaginationBlock from '../parts/PaginationBlock.vue'
  import DialogNewCustomize from '../parts/DialogNewCustomize.vue'
  import GetPremiumBanner from '../parts/GetPremiumBanner.vue'

  export default {

    mixins: [paymentMixin, entitiesMixin, appointmentMixin, imageMixin, dateMixin, durationMixin, priceMixin, customerMixin, notifyMixin, appointmentPriceMixin],

    data () {
      return {
        customersNoShowCount: [],
        currentUser: null,
        todayAppointmentsCount: {
          approved: null,
          pending: null
        },
        periodChange: {
          count: 0,
          available: 0,
          occupied: 0,
          revenue: 0
        },
        previousPeriodStats: {
          count: 0,
          available: 0,
          occupied: 0,
          revenue: 0
        },
        selectedPeriodStats: {
          count: 0,
          available: 0,
          occupied: 0,
          revenue: 0
        },
        statsLabels: [],
        customer: null,
        appointments: [],
        appointmentsCount: [],
        buttonNewItems: false,
        chartTabs: 'employee',
        customersChartData: {
          labels: [this.$root.labels.new, this.$root.labels.returning, ''],
          datasets: [
            {
              backgroundColor: ['#1a84ee', '#ffd400', '#ebeef5'],
              borderColor: '#E2E6EC',
              data: [0, 0, 1],
              hoverBackgroundColor: ['#117ce6', '#eec600', '#ebeef5'],
              hoverBorderColor: '#D3DDEA'
            }
          ]
        },
        dialogAppointment: false,
        dialogPayment: false,
        dialogExport: false,
        employees: [],

        tableStats: 'employeeTableStats',

        smallBarChartAppointmentsData: {
          labels: [],
          datasets: [
            {
              backgroundColor: '#5FCE19',
              data: [],
              hoverBackgroundColor: '#5FCE19',
              label: '',
              borderWidth: 0
            }
          ]
        },

        smallBarChartAppointmentsOptions: {
          legend: {
            display: false
          },
          scales: {
            xAxes: [{
              barThickness: 6,
              beginAtZero: true,
              gridLines: {
                display: false
              },
              ticks: {
                stepSize: 1,
                min: 1,
                autoSkip: true

              }
            }],
            yAxes: [{
              display: false,
              beginAtZero: true,
              gridLines: {
                display: false
              },
              ticks: {
                stepSize: 10,
                min: 0
              }
            }]
          },
          tooltips: {
            custom: function (tooltip) {
              if (!tooltip) {
                return
              }

              tooltip.displayColors = false
            },
            callbacks: {
              label: (tooltipItems, data) => {
                return this.statsLabels[tooltipItems.xLabel] + ': ' + tooltipItems.yLabel
              },
              title: (tooltipItems, data) => {
              }
            }
          }
        },

        smallLineChartLoadData: {
          labels: [],
          datasets: [
            {
              backgroundColor: 'transparent',
              borderColor: '#9A47FF',
              data: [],
              label: '',
              borderWidth: 2,
              lineTension: 0,
              pointRadius: 3,
              pointBorderColor: '#fff'
            }
          ]
        },

        smallLineChartLoadOptions: {
          legend: {
            display: false
          },
          scales: {
            xAxes: [{
              gridLines: {
                display: false
              },
              ticks: {
                stepSize: 10,
                min: 0,
                autoSkip: true
              }
            }],
            yAxes: [{
              display: false,
              beginAtZero: true,
              gridLines: {
                display: false
              },
              ticks: {
                stepSize: 1,
                min: 0
              }
            }]
          },
          tooltips: {
            custom: function (tooltip) {
              if (!tooltip) {
                return
              }

              tooltip.displayColors = false
            },
            callbacks: {
              label: (tooltipItems, data) => {
                return this.statsLabels[tooltipItems.xLabel] + ': ' + tooltipItems.yLabel + '%'
              },
              title: (tooltipItems, data) => {
              }
            }
          }
        },

        smallLineChartRevenueData: {
          labels: [],
          datasets: [
            {
              backgroundColor: 'transparent',
              borderColor: '#FD8863',
              data: [],
              label: '',
              borderWidth: 2,
              lineTension: 0,
              pointBackgroundColor: '#FD8863',
              pointRadius: 3,
              pointBorderColor: '#fff'
            }
          ]
        },

        smallLineChartRevenueOptions: {
          legend: {
            display: false
          },
          scales: {
            xAxes: [{
              barPercentage: 0.2,
              categoryPercentage: 0.8,
              gridLines: {
                display: false
              },
              ticks: {
                stepSize: 1,
                min: 0,
                autoSkip: true
              }
            }],
            yAxes: [{
              display: false,
              beginAtZero: true,
              gridLines: {
                display: false
              },
              ticks: {
                stepSize: 100,
                min: 0
              }
            }]
          },
          tooltips: {
            custom: function (tooltip) {
              if (!tooltip) {
                return
              }

              tooltip.displayColors = false
            },
            callbacks: {
              label: (tooltipItems, data) => {
                return this.statsLabels[tooltipItems.xLabel] + ': ' + this.getFormattedPrice(tooltipItems.yLabel)
              },
              title: (tooltipItems, data) => {
              }
            }
          }
        },

        employeePeriodStats: [],
        employeeTableData: [],
        visibleEmployeeTableData: [],
        serviceTableData: [],
        visibleServiceTableData: [],
        packageTableData: [],
        visiblePackageTableData: [],
        visibleTableDataCount: [],
        employeeTableParams: {
          show: 5,
          total: 0,
          page: 1
        },
        serviceTableParams: {
          show: 5,
          total: 0,
          page: 1
        },
        packageTableParams: {
          show: 5,
          total: 0,
          page: 1
        },

        employeesChartData: {
          labels: [],
          datasets: [
            {
              backgroundColor: '#D3DDEA',
              data: [],
              hoverBackgroundColor: '#c8d4e5',
              label: this.$root.labels.views,
              borderWidth: 0
            },
            {
              backgroundColor: '#5FCE19',
              data: [],
              hoverBackgroundColor: '#58BF17',
              label: this.$root.labels.appointments,
              borderWidth: 0
            }
          ]
        },
        defaultBarChartOptions: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            xAxes: [{
              barPercentage: 0.5,
              categoryPercentage: 0.8,
              ticks: {
                stepSize: 1,
                min: 0,
                autoSkip: false
              }
            }],
            yAxes: [{
              gridLines: {
                display: true
              },
              ticks: {
                beginAtZero: true,
                userCallback: function (label) {
                  if (Math.floor(label) === label) {
                    return label
                  }
                }
              }
            }]
          }
        },

        employeesStats: [],
        fetched: false,
        fetchedStats: false,
        form: new Form(),
        locations: [],
        locationsChartData: {
          labels: [],
          datasets: [
            {
              backgroundColor: '#D3DDEA',
              data: [],
              hoverBackgroundColor: '#c8d4e5',
              label: this.$root.labels.views,
              borderWidth: 0
            },
            {
              backgroundColor: '#5FCE19',
              data: [],
              hoverBackgroundColor: '#58BF17',
              label: this.$root.labels.appointments,
              borderWidth: 0
            }
          ]
        },
        locationsStats: [],
        params: {
          dates: this.getDatePickerInitRange()
        },
        popover: false,
        selectedPaymentModalData: null,
        services: [],
        servicesChartData: {
          labels: [],
          datasets: [
            {
              backgroundColor: '#D3DDEA',
              data: [],
              hoverBackgroundColor: '#c8d4e5',
              label: this.$root.labels.views,
              borderWidth: 0
            },
            {
              backgroundColor: '#5FCE19',
              data: [],
              hoverBackgroundColor: '#58BF17',
              label: this.$root.labels.appointments,
              borderWidth: 0
            }
          ]
        },
        totalPastPeriodCustomers: 0
      }
    },

    created () {
      Form.defaults.axios = this.$http

      this.getDashboardOptions()
      this.getCurrentUser()
    },

    methods: {
      revenueFormatter (row, column) {
        return this.getFormattedPrice(row.sumPayments)
      },

      hoursFormatter (row, column) {
        let hours = this.getMinutesToDays(row.hoursAppointment)

        return hours === '' ? 0 : hours
      },

      employeeTableSortChange (sortProps) {
        switch (sortProps.order) {
          case (null):
            this.employeeTableData = this.employeeTableData.sort((a, b) => (a.employeeName > b.employeeName) ? 1 : -1)

            break
          case ('ascending'):
            this.employeeTableData = this.employeeTableData.sort((a, b) => (a[sortProps.prop] > b[sortProps.prop]) ? 1 : -1)

            break
          case ('descending'):
            this.employeeTableData = this.employeeTableData.sort((a, b) => (a[sortProps.prop] < b[sortProps.prop]) ? 1 : -1)

            break
        }

        this.showVisibleEmployeeTableData()
      },

      serviceTableSortChange (sortProps) {
        switch (sortProps.order) {
          case (null):
            this.serviceTableData = this.serviceTableData.sort((a, b) => (a.serviceName > b.serviceName) ? 1 : -1)

            break
          case ('ascending'):
            this.serviceTableData = this.serviceTableData.sort((a, b) => (a[sortProps.prop] > b[sortProps.prop]) ? 1 : -1)

            break
          case ('descending'):
            this.serviceTableData = this.serviceTableData.sort((a, b) => (a[sortProps.prop] < b[sortProps.prop]) ? 1 : -1)

            break
        }

        this.showVisibleServiceTableData()
      },

      packageTableSortChange (sortProps) {
        switch (sortProps.order) {
          case (null):
            this.packageTableData = this.packageTableData.sort((a, b) => (a.serviceName > b.serviceName) ? 1 : -1)

            break
          case ('ascending'):
            this.packageTableData = this.packageTableData.sort((a, b) => (a[sortProps.prop] > b[sortProps.prop]) ? 1 : -1)

            break
          case ('descending'):
            this.packageTableData = this.packageTableData.sort((a, b) => (a[sortProps.prop] < b[sortProps.prop]) ? 1 : -1)

            break
        }

        this.showVisiblePackageTableData()
      },

      changeVisibleEmployeeTableData () {
        this.showVisibleEmployeeTableData()
      },

      changeVisibleServiceTableData () {
        this.showVisibleServiceTableData()
      },

      changeVisiblePackageTableData () {
        this.showVisiblePackageTableData()
      },

      showVisibleEmployeeTableData () {
        this.visibleEmployeeTableData = this.employeeTableData.slice(
          (this.employeeTableParams.page - 1) * this.employeeTableParams.show,
          (this.employeeTableParams.page - 1) * this.employeeTableParams.show + this.employeeTableParams.show
        )
      },

      showVisibleServiceTableData () {
        this.visibleServiceTableData = this.serviceTableData.slice(
          (this.serviceTableParams.page - 1) * this.serviceTableParams.show,
          (this.serviceTableParams.page - 1) * this.serviceTableParams.show + this.serviceTableParams.show
        )
      },

      showVisiblePackageTableData () {
        this.visiblePackageTableData = this.packageTableData.slice(
          (this.packageTableParams.page - 1) * this.packageTableParams.show,
          (this.packageTableParams.page - 1) * this.packageTableParams.show + this.packageTableParams.show
        )
      },

      getExportParams () {
        return Object.assign({count: this.appointmentsCount, dates: {start: moment().format('YYYY-MM-DD'), end: ''}}, this.exportParams)
      },

      showDialogNewCustomer () {
        this.customer = this.getInitCustomerObject()
        this.dialogCustomer = true
      },

      getDashboardOptions () {
        this.fetchEntities((success) => {
          if (success) {
            this.setInitialCustomers()
            this.setBookings(0)
            this.getDashboard()
          }

          this.fetched = true
          this.options.fetched = true
        }, {
          types: ['locations', 'employees', 'categories', 'custom_fields', 'packages', 'resources', 'coupons'],
          page: 'appointments',
          isFrontEnd: false,
          isPanel: false
        })
      },

      changeFilter () {
        this.setDatePickerSelectedDaysCount(this.params.dates.start, this.params.dates.end)
        this.getDashboard()
      },

      getDashboard () {
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

        this.fetchedStats = false

        this.$http.get(`${this.$root.getAjaxUrl}/stats`, {
          params: this.getAppropriateUrlParams(params)
        })
          .then(response => {
            this.employeePeriodStats = response.data.data.selectedPeriodStats

            this.previousPeriodStats = this.getPeriodStats(response.data.data.previousPeriodStats, 'providers')
            this.selectedPeriodStats = this.getPeriodStats(this.employeePeriodStats, 'providers')

            this.fillAppointmentsChartStats(response.data.data.selectedPeriodStats)

            this.fillAppointmentsTablesStats(this.employeePeriodStats)

            this.todayAppointmentsCount.approved = response.data.data.count.approved
            this.todayAppointmentsCount.pending = response.data.data.count.pending

            let customersIds = this.options.entities.customers.map(customer => parseInt(customer.id))

            let customers = this.options.entities.customers

            response.data.data.appointments.forEach((app) => {
              app.bookings.forEach((booking) => {
                if (customersIds.indexOf(parseInt(booking.customer.id)) === -1) {
                  customersIds.push(booking.customer.id)
                  customers.push(booking.customer)
                }
              })
            })

            this.options.entities.customers = Object.values(customers)

            this.appointments = response.data.data.appointments
            this.appointmentsCount = response.data.data.appointmentsCount
            this.customersNoShowCount = response.data.data.customersNoShowCount

            this.fillCustomersChart(response.data.data.customersStats)
            this.employeesStats = response.data.data.employeesStats
            this.fillEmployeesChart(response.data.data.employeesStats)
            this.servicesStats = response.data.data.servicesStats
            this.fillServicesChart(response.data.data.servicesStats)
            this.locationsStats = response.data.data.locationsStats
            this.fillLocationsChart(response.data.data.locationsStats)

            this.updateCharts()
            this.filterEmployeesChart()
            this.filterServicesChart()
            this.filterLocationsChart()
            this.fetched = true
            this.fetchedStats = true
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

      navigateTo (pageName) {
        let startDate = moment(this.params.dates.start).format('YYYY-MM-DD')
        let endDate = moment(this.params.dates.end).format('YYYY-MM-DD')

        let url = 'admin.php?page=wpamelia-' + pageName

        switch (pageName) {
          case ('appointments'):
            url += '&dateFrom=' + startDate + '&dateTo=' + endDate + '&status=approved'
            break

          case ('finance'):
            url += '&dateFrom=' + startDate + '&dateTo=' + endDate + '&status=paid'
            break

          case ('employees'):
            break
        }

        window.location = url
      },

      updateCharts () {
        if (typeof this.$refs.customersChart !== 'undefined') { this.$refs.customersChart.update(false) }
        if (typeof this.$refs.employeesChart !== 'undefined') { this.$refs.employeesChart.update(false) }
        if (typeof this.$refs.servicesChart !== 'undefined') { this.$refs.servicesChart.update(false) }
        if (typeof this.$refs.locationsChart !== 'undefined') { this.$refs.locationsChart.update(false) }
        if (typeof this.$refs.appointmentsCountChart !== 'undefined') { this.$refs.appointmentsCountChart.update(true) }
        if (typeof this.$refs.appointmentsLoadChart !== 'undefined') { this.$refs.appointmentsLoadChart.update(true) }
        if (typeof this.$refs.appointmentsRevenueChart !== 'undefined') { this.$refs.appointmentsRevenueChart.update(true) }
      },

      getPeriodStats (data, type) {
        let appointmentsCount = 0
        let appointmentsAvailable = 0
        let appointmentsOccupied = 0
        let appointmentsRevenue = 0

        for (let dateKey in data) {
          if (!data.hasOwnProperty(dateKey) || data[dateKey] === null || !data[dateKey].hasOwnProperty(type)) { continue }

          for (let providerId in data[dateKey][type]) {
            if (!data[dateKey][type].hasOwnProperty(providerId)) { continue }

            let availableTime = 0

            for (let i = 0; i < data[dateKey][type][providerId].intervals.length; i++) {
              availableTime += (parseInt(data[dateKey][type][providerId].intervals[i].time[1]) - parseInt(data[dateKey][type][providerId].intervals[i].time[0])) / 60
            }

            appointmentsCount += parseInt(data[dateKey][type][providerId].count)
            appointmentsAvailable += availableTime
            appointmentsOccupied += parseInt(data[dateKey][type][providerId].occupied)
            appointmentsRevenue += parseFloat(data[dateKey][type][providerId].revenue)
          }
        }

        return {
          count: appointmentsCount,
          occupied: appointmentsOccupied,
          available: appointmentsAvailable,
          revenue: appointmentsRevenue
        }
      },

      fillAppointmentsChartStats (data) {
        this.statsLabels = []

        this.smallBarChartAppointmentsData.labels = []
        this.smallBarChartAppointmentsData.datasets[0].data = []

        this.smallLineChartLoadData.labels = []
        this.smallLineChartLoadData.datasets[0].data = []

        this.smallLineChartRevenueData.labels = []
        this.smallLineChartRevenueData.datasets[0].data = []

        let type = ''

        for (let dateKey in data) {
          if (!data.hasOwnProperty(dateKey) || data[dateKey] === null) { continue }

          let dateFormatted = moment(dateKey, 'YYYY-MM-DD').format('MMM D')

          this.statsLabels[dateFormatted] = moment(dateKey, 'YYYY-MM-DD').format('dddd')

          this.smallBarChartAppointmentsData.labels.push(dateFormatted)
          this.smallLineChartLoadData.labels.push(dateFormatted)
          this.smallLineChartRevenueData.labels.push(dateFormatted)

          let dateAppointmentsCount = 0
          let dateAppointmentsAvailable = 0
          let dateAppointmentsOccupied = 0
          let dateRevenue = 0
          let hasData = false

          type = 'providers'

          for (let providerId in data[dateKey][type]) {
            if (!data[dateKey][type].hasOwnProperty(providerId)) { continue }

            let availableTime = 0

            for (let i = 0; i < data[dateKey][type][providerId].intervals.length; i++) {
              availableTime += (data[dateKey][type][providerId].intervals[i].time[1] - data[dateKey][type][providerId].intervals[i].time[0]) / 60
            }

            dateAppointmentsCount += parseInt(data[dateKey][type][providerId].count)
            dateAppointmentsAvailable += availableTime
            dateAppointmentsOccupied += parseInt(data[dateKey][type][providerId].occupied)
            dateRevenue += parseFloat(data[dateKey][type][providerId].revenue)
          }

          if (dateAppointmentsAvailable > 0) {
            hasData = true
          }

          type = 'packages'

          for (let packageId in data[dateKey][type]) {
            if (!data[dateKey][type].hasOwnProperty(packageId)) { continue }

            dateRevenue += parseFloat(data[dateKey][type][packageId].revenue)
          }

          if (dateRevenue > 0) {
            hasData = true
          }

          if (!hasData) {
            this.smallBarChartAppointmentsData.datasets[0].data.push(null)
            this.smallLineChartLoadData.datasets[0].data.push(null)
            this.smallLineChartRevenueData.datasets[0].data.push(null)
          } else {
            this.smallBarChartAppointmentsData.datasets[0].data.push(dateAppointmentsCount)
            this.smallLineChartLoadData.datasets[0].data.push(dateAppointmentsAvailable > 0 ? parseFloat((dateAppointmentsOccupied / dateAppointmentsAvailable * 100).toFixed(1)) : 0)
            this.smallLineChartRevenueData.datasets[0].data.push(dateRevenue)
          }
        }
      },

      fillAppointmentsTablesStats (data) {
        let employeeData = []
        let serviceData = []
        let packageData = []
        let that = this

        this.options.entities.packages.forEach((pack) => {
          packageData[pack.id] = {
            count: 0,
            available: 0,
            occupied: 0,
            revenue: 0,
            purchased: 0
          }
        })

        for (let dateKey in data) {
          if (!data.hasOwnProperty(dateKey) || data[dateKey] === null) { continue }

          for (let serviceId in data[dateKey].services) {
            if (!data[dateKey].services.hasOwnProperty(serviceId)) { continue }

            let servicesStats = data[dateKey].services[serviceId]

            if (!(serviceId in serviceData)) {
              serviceData[serviceId] = {
                count: 0,
                available: 0,
                occupied: 0,
                revenue: 0
              }
            }

            serviceData[serviceId].occupied += parseInt(servicesStats.occupied)
            serviceData[serviceId].count += parseInt(servicesStats.count)
            serviceData[serviceId].revenue += parseFloat(servicesStats.revenue)
          }

          for (let providerId in data[dateKey].providers) {
            if (!data[dateKey].providers.hasOwnProperty(providerId)) { continue }

            if (!(providerId in employeeData)) {
              employeeData[providerId] = {
                count: 0,
                available: 0,
                occupied: 0,
                revenue: 0
              }
            }

            let providerAvailableTime = 0

            let providerStats = data[dateKey].providers[providerId]

            let providerServices = that.options.entities.employees.find(employee => parseInt(employee.id) === parseInt(providerId)).serviceList.map(service => service.id)

            providerStats['intervals'].forEach(function (interval) {
              let intervalTime = (parseInt(interval.time[1]) - parseInt(interval.time[0])) / 60

              providerAvailableTime += intervalTime

              let intervalServices = interval.services.length === 0 ? providerServices : interval.services

              intervalServices.forEach(function (serviceId) {
                if (!(serviceId in serviceData)) {
                  serviceData[serviceId] = {
                    count: 0,
                    available: 0,
                    occupied: 0,
                    revenue: 0
                  }
                }

                serviceData[serviceId].available += intervalTime
              })
            })

            employeeData[providerId].available += providerAvailableTime
            employeeData[providerId].occupied += parseInt(providerStats.occupied)
            employeeData[providerId].count += parseInt(providerStats.count)
            employeeData[providerId].revenue += parseFloat(providerStats.revenue)
          }

          for (let packageId in data[dateKey].packages) {
            if (!data[dateKey].packages.hasOwnProperty(packageId)) { continue }

            let packagesStats = data[dateKey].packages[packageId]

            packageData[packageId].occupied += parseInt(packagesStats.occupied)
            packageData[packageId].count += parseInt(packagesStats.count)
            packageData[packageId].revenue += parseFloat(packagesStats.revenue)
            packageData[packageId].purchased += parseInt(packagesStats.purchased)
          }
        }

        let employeeTableData = []

        for (let providerId in employeeData) {
          if (!employeeData.hasOwnProperty(providerId)) { continue }

          let provider = this.getProviderById(parseInt(providerId))

          employeeTableData.push({
            provider,
            employeeName: provider.firstName + ' ' + provider.lastName,
            employeePhoto: provider.pictureThumbPath,
            numAppointments: employeeData[providerId].count,
            sumPayments: employeeData[providerId].revenue,
            hoursAppointment: employeeData[providerId].occupied,
            load: employeeData[providerId].available !== 0 ? parseFloat((employeeData[providerId].occupied / employeeData[providerId].available * 100).toFixed(1)) : 0,
            available: employeeData[providerId].available,
            occupied: employeeData[providerId].occupied
          })
        }

        this.employeeTableParams.total = employeeTableData.length

        employeeTableData = employeeTableData.sort((a, b) => (a.employeeName > b.employeeName) ? 1 : -1)

        this.employeeTableData = employeeTableData

        this.showVisibleEmployeeTableData()

        let serviceTableData = []

        for (let serviceId in serviceData) {
          if (!serviceData.hasOwnProperty(serviceId)) { continue }

          let service = this.getServiceById(parseInt(serviceId))

          serviceTableData.push({
            service,
            serviceName: service.name,
            servicePhoto: service.pictureThumbPath,
            numAppointments: serviceData[serviceId].count,
            sumPayments: serviceData[serviceId].revenue,
            hoursAppointment: serviceData[serviceId].occupied,
            load: serviceData[serviceId].available !== 0 ? parseFloat((serviceData[serviceId].occupied / serviceData[serviceId].available * 100).toFixed(1)) : 0
          })
        }

        this.serviceTableParams.total = serviceTableData.length

        serviceTableData = serviceTableData.sort((a, b) => (a.serviceName > b.serviceName) ? 1 : -1)

        this.serviceTableData = serviceTableData

        this.showVisibleServiceTableData()

        let packageTableData = []

        for (let packageId in packageData) {
          if (!packageData.hasOwnProperty(packageId)) { continue }

          let pack = this.getPackageById(parseInt(packageId))

          packageTableData.push({
            pack,
            packageName: pack.name,
            packagePhoto: pack.pictureThumbPath,
            numPurchased: packageData[packageId].purchased,
            numAppointments: packageData[packageId].count,
            sumPayments: packageData[packageId].revenue,
            hoursAppointment: packageData[packageId].occupied
          })
        }

        this.packageTableParams.total = packageTableData.length

        packageTableData = packageTableData.sort((a, b) => (a.packageName > b.packageName) ? 1 : -1)

        this.packageTableData = packageTableData

        this.showVisiblePackageTableData()
      },

      fillCustomersChart (data) {
        this.customersChartData.datasets[0].data.splice(0, 1, data.newCustomersCount)
        this.customersChartData.datasets[0].data.splice(1, 1, data.returningCustomersCount)
        this.customersChartData.datasets[0].data.splice(2, 1, (this.newCustomers === 0 && this.returningCustomers === 0) ? 1 : 0)
        this.totalPastPeriodCustomers = data.totalPastPeriodCustomers
      },

      fillEmployeesChart (data) {
        this.employeesChartData.labels = []
        this.employeesChartData.datasets[0].data = []
        this.employeesChartData.datasets[1].data = []

        for (let i = 0; i < data.length; i++) {
          this.employeesChartData.labels.push(data[i].name)
          this.employeesChartData.datasets[0].data.push(data[i].views)
          this.employeesChartData.datasets[1].data.push(data[i].appointments)
        }
      },

      filterEmployeesChart () {
        let employeesStats = []
        let employeesToRemoveFromStats = []

        for (let i = 0; i < this.employeesStats.length; i++) {
          if (_.indexOf(this.employees, this.employeesStats[i].id) === -1) {
            employeesToRemoveFromStats.push(this.employeesStats[i])
          }
        }

        if (_.difference(this.employeesStats, employeesToRemoveFromStats).length === 0) {
          employeesStats = this.employees.length === 0 ? this.employeesStats : []
        } else {
          employeesStats = _.difference(this.employeesStats, employeesToRemoveFromStats)
        }

        this.fillEmployeesChart(employeesStats)

        if (typeof this.$refs.employeesChart !== 'undefined') {
          this.$refs.employeesChart.update()
        }
      },

      fillServicesChart (data) {
        this.servicesChartData.labels = []
        this.servicesChartData.datasets[0].data = []
        this.servicesChartData.datasets[1].data = []

        for (let i = 0; i < data.length; i++) {
          this.servicesChartData.labels.push(data[i].name)
          this.servicesChartData.datasets[0].data.push(data[i].views)
          this.servicesChartData.datasets[1].data.push(data[i].appointments)
        }
      },

      filterServicesChart () {
        let servicesStats = []
        let servicesToRemoveFromStats = []

        for (let i = 0; i < this.servicesStats.length; i++) {
          if (_.indexOf(this.services, this.servicesStats[i].id) === -1) {
            servicesToRemoveFromStats.push(this.servicesStats[i])
          }
        }

        if (_.difference(this.servicesStats, servicesToRemoveFromStats).length === 0) {
          servicesStats = this.services.length === 0 ? this.servicesStats : []
        } else {
          servicesStats = _.difference(this.servicesStats, servicesToRemoveFromStats)
        }

        this.fillServicesChart(servicesStats)

        if (typeof this.$refs.servicesChart !== 'undefined') {
          this.$refs.servicesChart.update()
        }
      },

      fillLocationsChart (data) {
        this.locationsChartData.labels = []
        this.locationsChartData.datasets[0].data = []
        this.locationsChartData.datasets[1].data = []

        for (let i = 0; i < data.length; i++) {
          this.locationsChartData.labels.push(data[i].name)
          this.locationsChartData.datasets[0].data.push(data[i].views)
          this.locationsChartData.datasets[1].data.push(data[i].appointments)
        }
      },

      filterLocationsChart () {
        let locationsStats = []
        let locationsToRemoveFromStats = []

        for (let i = 0; i < this.locationsStats.length; i++) {
          if (_.indexOf(this.locations, this.locationsStats[i].id) === -1) {
            locationsToRemoveFromStats.push(this.locationsStats[i])
          }
        }

        if (_.difference(this.locationsStats, locationsToRemoveFromStats).length === 0) {
          locationsStats = this.locations.length === 0 ? this.locationsStats : []
        } else {
          locationsStats = _.difference(this.locationsStats, locationsToRemoveFromStats)
        }

        this.fillLocationsChart(locationsStats)

        if (typeof this.$refs.locationsChart !== 'undefined') {
          this.$refs.locationsChart.update()
        }
      },

      calculateChartTotal (name) {
        switch (name) {
          case ('count'):
            let appointmentsCount = 0

            this.smallBarChartAppointmentsData.datasets[0].data.forEach(function (value) {
              appointmentsCount += (value !== null ? value : 0)
            })

            return appointmentsCount
          case ('load'):
            let availableSum = 0
            let occupiedSum = 0

            for (let key in this.employeeTableData) {
              availableSum += this.employeeTableData[key].available
              occupiedSum += this.employeeTableData[key].occupied
            }

            return (availableSum !== 0 ? parseFloat((occupiedSum / availableSum * 100).toFixed(1)) : 0) + '%'
          case ('revenue'):
            let appointmentsRevenue = 0

            this.smallLineChartRevenueData.datasets[0].data.forEach(function (value) {
              appointmentsRevenue += (value !== null ? value : 0)
            })

            return this.getFormattedPrice(appointmentsRevenue)
        }
      },

      getCurrentUser () {
        this.$http.get(`${this.$root.getAjaxUrl}/users/current`)
          .then(response => {
            this.currentUser = response.data.data.user
          })
          .catch(e => {
            console.log('getCurrentUser fail')
          })
      },

      getPercentageBarColor (percent) {
        switch (true) {
          case (percent < 25):
            return '#FF1563'
          case (percent > 25 && percent < 50):
            return '#FFA700'
          case (percent > 50 && percent < 75):
            return '#BDDE00'
          case (percent > 75):
            return '#5FCE19'
          default:
            return '#5FCE19'
        }
      },

      growthClass (value) {
        if (value > 0 || value === '+∞') {
          return 'am-growth-increase'
        }

        if (value < 0 || value === '-∞') {
          return 'am-growth-decrease'
        }

        return 'am-growth-equal'
      },

      growthPercentageCharacter (value) {
        if (value === '+∞' || value === '-∞') {
          return ''
        }

        return '%'
      },

      growthPercentage (totalValue, pastTotalValue) {
        if (totalValue === 0 && pastTotalValue === 0) {
          return 0
        }

        if (totalValue === 0 && pastTotalValue !== 0) {
          return '-∞'
        }

        if (totalValue !== 0 && pastTotalValue === 0) {
          return '+∞'
        }

        return totalValue - pastTotalValue === 0 ? 0 : ((totalValue - pastTotalValue) / pastTotalValue * 100).toFixed(1)
      },

      openRecurringAppointment (id) {
        this.dialogAppointment = false

        setTimeout(() => {
          this.showDialogEditAppointment(id)
        }, 200)
      }
    },

    computed: {
      newCustomers () {
        return this.customersChartData.datasets[0].data[0]
      },

      returningCustomers () {
        return this.customersChartData.datasets[0].data[1]
      },

      totalCustomers () {
        return this.newCustomers + this.returningCustomers
      },

      newCustomersPercentage () {
        return this.totalCustomers === 0 ? 0 : parseFloat((this.newCustomers / this.totalCustomers * 100).toFixed(1))
      },

      returnedCustomersPercentage () {
        return this.totalCustomers === 0 ? 0 : parseFloat((this.returningCustomers / this.totalCustomers * 100).toFixed(1))
      },

      countGrowthPercentage () {
        return this.growthPercentage(this.selectedPeriodStats.count, this.previousPeriodStats.count)
      },

      countGrowthClass () {
        return this.growthClass(this.countGrowthPercentage)
      },

      revenueGrowthPercentage () {
        return this.growthPercentage(this.selectedPeriodStats.revenue, this.previousPeriodStats.revenue)
      },

      revenueGrowthClass () {
        return this.growthClass(this.revenueGrowthPercentage)
      },

      revenueGrowthPercentageCharacter () {
        return this.growthPercentageCharacter(this.revenueGrowthPercentage)
      },

      loadGrowthPercentage () {
        return this.growthPercentage(this.selectedPeriodStats.occupied, this.previousPeriodStats.occupied)
      },

      loadGrowthClass () {
        return this.growthClass(this.loadGrowthPercentage)
      },

      loadGrowthPercentageCharacter () {
        return this.growthPercentageCharacter(this.loadGrowthPercentage)
      },

      customersGrowthPercentage () {
        return this.growthPercentage(this.totalCustomers, this.totalPastPeriodCustomers)
      },

      customerGrowthClass () {
        return this.growthClass(this.customersGrowthPercentage)
      },

      customerGrowthPercentageCharacter () {
        return this.growthPercentageCharacter(this.customersGrowthPercentage)
      }
    },

    components: {
      GetPremiumBanner,
      BarChart,
      DoughnutChart,
      LineChart,
      DialogCustomer,
      DialogAppointment,
      DialogPayment,
      PageHeader,
      DialogExport,
      AppointmentListCollapsed,
      PaginationBlock,
      DialogNewCustomize
    }
  }
</script>

<style lang="less">
.am-amelia-banner {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 272px;
  box-sizing: border-box;
  margin-top: 24px;
  background: #ffffff;
  border-radius: 4px;

  @media only screen and (max-width: 992px) {
    flex-wrap: wrap;
  }

  * {
    color: #FFFFFF;
  }

  &__content {
    display: flex;
    flex-direction: column;
    width: 100%;

    &-main {
      display: flex;
      justify-content: space-between;

      &-left {
        padding: 40px;

        p {
          font-size: 14px;
          line-height: 20px;
          color: #1A2C37;
        }

        &-logo {
          margin-bottom: 16px;
          img {
            height: 36px;
            width: auto;
          }
        }

        &-subtitle {
          p {
            font-weight: 600;
            margin: 4px 0;
          }
        }

        &-text {
          p {
            max-width: 600px;
            font-weight: 400;
            margin: 4px 0;
          }
        }

        &-rating {
          display: flex;
          flex-direction: row;
          align-items: center;
          margin-bottom: 16px;

          &-text {
            margin: 4px;
            font-weight: 400;
          }
        }

        &-buttons {
          display: flex;

          .am-promo-btn.el-button.el-button--primary {
            display: flex;
            width: fit-content;
            background: #1246D6;
            border-color: #1246D6;
            border-radius: 8px;
            padding: 8px 20px;

            span {
              display: flex;
              align-items: center;
              line-height: 20px;
              font-size: 14px;
            }

            img {
              margin-left: 8px;
            }
          }
        }

        @media only screen and (max-width: 1360px) {
          width: 30%;
        }

        @media only screen and (max-width: 1180px) {
          width: 65%;
          z-index: 99;
        }

        @media only screen and (max-width: 620px) {
          width: 100%;
        }

        @media only screen and (max-width: 380px) {
          padding: 20px;
        }

      }

      &-right {
        img {
          border-radius: 0 4px 4px 0;
          height: 100%;
          width: 100%;
        }

        @media only screen and (max-width: 1180px) {
          position: absolute;
          right: 0;
          height: 100%;
          width: 55%;
        }

        @media only screen and (max-width: 620px) {
          display: none;
        }
      }
    }
  }

  &__buttons {
    width: 0;

    @media only screen and (max-width: 992px) {
      max-width: 100%;
      display: flex;
      justify-content: center;
    }

    p {
      position: absolute;
      bottom: 8px;
      right: 12px;
      margin: 0;
      cursor: pointer;
    }

    a {
      display: inline-block;
      font-size: 16px;
      font-weight: 500;
      line-height: 1.5;
      text-decoration: none;
      background-color: #005AEE;
      color: #ffffff;
      padding: 8px 20px;
      border-radius: 9px;
      margin-left: 16px;

      &:hover {
        background-color: #0041af;
      }

      &:active, &:hover, &:focus {
        text-decoration: none;
        color: #ffffff;
      }

      @media only screen and (max-width: 992px) {
        margin: 16px 0 0 0;
      }
    }
  }
}
</style>
