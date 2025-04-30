<template>
  <div class="am-wrap">
    <div id="am-finance" class="am-body">

      <!-- Page Header -->
      <page-header
          :financeTotal="options.fetched ? getTotal() : 0"
          :addNewTaxBtnDisplay="options.fetched ? addNewTaxBtnDisplay : false"
          @newTaxBtnClicked="showDialogNewTax()"
          :addNewCouponBtnDisplay="options.fetched ? addNewCouponBtnDisplay : false"
          @newCouponBtnClicked="showDialogNewCoupon()"
      >
      </page-header>

      <!-- Finance -->
      <div class="am-finances am-section">

        <el-tabs v-model="financeTabs" @tab-click="handleTabClick">
          <el-tab-pane :label="$root.labels.payments" name="payments">

            <!-- Filter Finance -->
            <div
                class="am-finance-filter"
                v-show="hasPayments && options.fetched"
            >
              <el-form class="" :action="exportPaymentsAction" method="POST">
                <el-row :gutter="16">

                  <!-- Date Filter -->
                  <el-col :md="24" :lg="5" class="v-calendar-column">
                    <el-form-item class="calc-width-mobile">
                      <v-date-picker
                          @input="changeRange"
                          v-model="paymentsParams.dates"
                          :is-double-paned="true"
                          mode='range'
                          popover-visibility="focus"
                          popover-direction="bottom"
                          tint-color='#1A84EE'
                          :show-day-popover=false
                          :input-props='{class: "el-input__inner"}'
                          :is-expanded=false
                          :is-required=true
                          input-class="el-input__inner"
                          :placeholder="$root.labels.pick_a_date"
                          :formats="vCalendarFormats"
                      >
                      </v-date-picker>
                      <span
                          v-if="paymentsParams.dates"
                          class="am-v-date-picker-suffix el-input__suffix-inner"
                          @click="clearDateFilter"
                      >
                        <i class="el-select__caret el-input__icon el-icon-circle-close"></i>
                      </span>
                    </el-form-item>
                  </el-col>

                  <transition name="fade">
                    <div class="am-filter-fields" v-show="filterPaymentsFields">

                      <!-- Customers Filter -->
                      <el-col :md="6" :lg="4">
                        <el-form-item>
                          <el-select
                              v-model="paymentsParams.customerId"
                              filterable
                              clearable
                              :placeholder="$root.labels.customer"
                              @change="filterPayments"
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

                      <!-- Employees Filter -->
                      <el-col :md="6" :lg="4">
                        <el-form-item>
                          <el-select
                              v-model="paymentsParams.providerId"
                              filterable
                              clearable
                              :placeholder="$root.labels.employee"
                              @change="filterPayments"
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

                      <!-- Services Filter -->
                      <el-col :md="6" :lg="4">
                        <el-form-item>
                          <el-select
                              v-model="paymentsParams.services"
                              multiple
                              filterable
                              :placeholder="$root.labels.services"
                              @change="filterPayments"
                              collapse-tags
                          >
                            <div v-for="category in options.entities.categories"
                                 :key="category.id">
                              <div class="am-drop-parent"
                                   @click="selectAllInCategoryFinance(category.id)"
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

                      <!-- Events Filter -->
                      <el-col :md="6" :lg="4">
                        <el-form-item>
                          <el-select
                              v-model="paymentsParams.events"
                              multiple
                              clearable
                              filterable
                              :remote-method="query => searchEvents(query, false, options.entities.events)"
                              :loading="loadingEvents"
                              :remote="options.entities.events.length === $root.settings.general.eventsFilterLimit"
                              :placeholder="$root.labels.events"
                              @change="filterPayments"
                          >
                            <el-option
                                v-for="item in searchedEvents"
                                :key="item.id"
                                :label="item.name + ( item.periods && item.periods.length ? ' (' + getFrontedFormattedDate(item.periods[0].periodStart.split(' ')[0]) + ')' : '')"
                                :value="item.id"
                            >
                            </el-option>
                          </el-select>
                        </el-form-item>
                      </el-col>

                      <!-- Status Filter -->
                      <el-col :md="6" :lg="3">
                        <el-form-item>
                          <el-select
                              v-model="paymentsParams.status"
                              clearable
                              :placeholder="$root.labels.status"
                              class="calc-width"
                              @change="filterPayments"
                          >
                            <el-option
                                v-for="item in statuses"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                            >
                              <span>{{ item.label }}</span>
                            </el-option>
                          </el-select>
                        </el-form-item>
                      </el-col>
                    </div>
                  </transition>

                  <div class="">

                    <!-- Toggle More Filters -->
                    <el-button
                        class="button-filter-toggle am-button-icon"
                        title="Toggle Filters"
                        @click="filterPaymentsFields = !filterPaymentsFields"
                    >
                      <img class="svg-amelia" alt="Toggle Filters" :src="$root.getUrl + 'public/img/filter.svg'"/>
                    </el-button>

                    <!-- Export Payments -->
                    <el-tooltip placement="top">
                      <div slot="content" v-html="$root.labels.export_tooltip_payments"></div>
                      <el-button
                          class="button-export am-button-icon"
                          @click="dialogPaymentsExport = true"
                      >
                        <img class="svg-amelia" alt="Export" :src="$root.getUrl+'public/img/export.svg'"/>
                      </el-button>
                    </el-tooltip>

                  </div>

                </el-row>

                <!-- Dialog Export Payments -->
                <transition name="slide">
                  <el-dialog
                      :close-on-click-modal="false"
                      class="am-side-dialog am-dialog-export"
                      :visible.sync="dialogPaymentsExport"
                      :show-close="false"
                      v-if="dialogPaymentsExport"
                  >
                    <dialog-export
                        :data="getExportData()"
                        :action="$root.getAjaxUrl + '/report/payments'"
                        @updateAction="(action) => {this.exportPaymentsAction = action}"
                        @closeDialogExport="dialogPaymentsExport = false"
                    >
                    </dialog-export>
                  </el-dialog>
                </transition>

              </el-form>
            </div>

            <!-- Spinner -->
            <div class="am-spinner am-section"
                 v-show="isPaymentsFiltering || !options.fetched"
            >
              <img :src="$root.getUrl + 'public/img/spinner.svg'"/>
            </div>

            <!-- Empty State -->
            <EmptyState
              :visible="!hasPayments && !isPaymentsFiltering && options.fetched"
              :title="$root.labels.no_payments_yet"
            >
            </EmptyState>

            <!-- Table Header -->
            <div
                class="am-finance-list-head"
                v-show="hasPayments && hasPaymentsFiltered && !isPaymentsFiltering && options.fetched"
            >
              <el-row>

                <!-- Payment Date, Customer, Employee -->
                <el-col :lg="14">
                  <el-row :gutter="10" class="am-finance-flex-row-middle-align">

                    <!-- Check All -->
                    <el-col :lg="2" v-if="$root.settings.capabilities.canDelete === true">
                      <p>
                        <el-checkbox
                            :style="{display: 'none'}"
                            v-model="checkPaymentData.allChecked"
                            @change="checkPaymentData = handleCheckAll(payments, checkPaymentData)">
                        </el-checkbox>
                      </p>
                    </el-col>

                    <!-- Payment Date -->
                    <el-col :lg="6">
                      <p>{{ $root.labels.payment_date }}:</p>
                    </el-col>

                    <!-- Customer -->
                    <el-col :lg="8">
                      <p>{{ $root.labels.customer }}:</p>
                    </el-col>

                    <!-- Employee -->
                    <el-col :lg="8">
                      <p>{{ $root.labels.employee }}:</p>
                    </el-col>
                  </el-row>

                </el-col>

                <!-- Service, Status -->
                <el-col :lg="10">
                  <el-row :gutter="10" class="am-finance-flex-row-middle-align">
                    <el-col :lg="0" class="hide-on-mobile"></el-col>

                    <!-- Service -->
                    <el-col :lg="12">
                      <p>{{ $root.labels.service }}/{{ $root.labels.event }}:</p>
                    </el-col>

                    <!-- Status -->
                    <el-col :lg="12">
                      <p>{{ $root.labels.status }}:</p>
                    </el-col>

                  </el-row>
                </el-col>

              </el-row>
            </div>

            <!-- Collapsible Data  -->
            <div
                class="am-finance-list"
                v-show="hasPayments && hasPaymentsFiltered && !isPaymentsFiltering && options.fetched"
            >

              <el-collapse>
                <el-collapse-item
                    v-for="(payment, index) in payments"
                    :key="payment.id"
                    :name="payment.id"
                    class="am-finance"
                >
                  <template slot="title">
                    <div class="am-finance-data">
                      <span class="am-entity-color am-event-color"
                            v-if="payment.appointmentId === 0">
                      </span>
                      <span class="am-entity-color am-appointment-color"
                            v-else>
                      </span>
                      <el-row>

                        <!-- Payment Date, Customer, Employee -->
                        <el-col :lg="14">
                          <el-row :gutter="10" class="am-finance-flex-row-middle-align">

                            <!-- Checkbox -->
                            <el-col :lg="2" :sm="1" v-if="$root.settings.capabilities.canDelete === true">
                              <span @click.stop>
                                  <el-checkbox
                                      :style="{display: 'none'}"
                                      v-model="payment.checked"
                                      @change="checkPaymentData = handleCheckSingle(payments, checkPaymentData)">
                                  </el-checkbox>
                              </span>
                            </el-col>

                            <!-- Payment Date -->
                            <el-col :lg="6" :sm="6">
                              <p class="am-col-title">{{ $root.labels.payment_date }}:</p>
                              <h4>{{ getFrontedFormattedDate(payment.dateTime) }}</h4>
                            </el-col>

                            <!-- Customer -->
                            <el-col :lg="8" :sm="8">
                              <p class="am-col-title">{{ $root.labels.customer }}:</p>
                              <h3 :class="getNoShowClass(payment.customerId, null, null, payment.customerStatus)">
                                {{ payment.customerFirstName + ' ' + payment.customerLastName }}
                              </h3>
                              <span>{{ payment.customerEmail }}</span>
                            </el-col>

                            <!-- Employee -->
                            <el-col :lg="8" :sm="8">
                              <p class="am-col-title">{{ $root.labels.employee }}:</p>
                              <div class="am-assigned" v-if="payment.providers.length === 1">
                                <img
                                    :src="pictureLoad(getProviderById(payment.providers[0].id), true)"
                                    @error="imageLoadError(getProviderById(payment.providers[0].id), true)"/>
                                <h4>{{ ((user = getProviderById(payment.providers[0].id)) !== null ? user.firstName + ' ' +
                                  user.lastName : '') }}</h4>
                              </div>

                              <!-- Multiple Employees -->
                              <el-tooltip placement="top-start" v-if="payment.providers.length > 1">
                                <div class="am-all-event-employees" slot="content">
                                  <div v-for="pp in payment.providers" :key="pp.id">
                                    {{ ((user = getProviderById(pp.id)) !== null ? user.firstName + ' ' + user.lastName : '') }}
                                  </div>
                                </div>
                                <div class="am-assigned am-multiple-employees">
                                  <img
                                      v-if="index <= 4"
                                      v-for="(pp, index) in payment.providers" :key="pp.id"
                                      :src="pictureLoad(getProviderById(pp.id), true)"
                                      @error="imageLoadError(getProviderById(pp.id), true)"/>
                                  <h4 v-if="index > 4 && (payment.providers.length - 5 > 0)"> + {{ payment.providers.length - 5 }}</h4>
                                </div>
                              </el-tooltip>
                            </el-col>

                          </el-row>
                        </el-col>

                        <el-col :lg="10">
                          <el-row :gutter="10" class="am-finance-flex-row-middle-align">
                            <el-col :lg="0" :sm="1" class="hide-on-mobile"></el-col>

                            <!-- Service -->
                            <el-col :lg="12" :sm="14" class="am-payment-service">
                              <p class="am-col-title">{{ $root.labels.service }}/{{ $root.labels.event }}:</p>
                              <img
                                v-if="payment.packageId"
                                :src="$root.getUrl + 'public/img/am-package-black.svg'"
                              >
                              <h4>{{ payment.name }}</h4>
                            </el-col>

                            <!-- Status -->
                            <el-col class="am-finance-payment-status" :lg="6" :sm="5">
                              <p class="am-col-title">{{ $root.labels.status }}:</p>
                              <div class="am-payment-status">
                                <span :class="'am-payment-status-symbol am-payment-status-symbol-' + payment.fullStatus"></span>
                                <h4>
                                  {{ getPaymentStatusNiceName(payment.fullStatus) }}
                                </h4>
                              </div>
                            </el-col>

                            <!-- Details Button -->
                            <el-col :lg="6" :sm="4" class="align-right">
                              <div @click.stop>
                                <el-button @click="showDialogEditPayment(payment)">
                                  {{ $root.labels.details }}
                                </el-button>
                              </div>
                            </el-col>

                          </el-row>
                        </el-col>
                      </el-row>
                    </div>
                  </template>
                  <div class="am-finance-details">
                    <el-row>

                      <!-- Appointment Date -->
                      <el-col :lg="14">
                        <el-row :gutter="10" class="am-finance-flex-row-top-align">
                          <el-col :lg="2" :sm="1" class="hide-on-mobile"></el-col>
                          <el-col :lg="22" :sm="23">
                            <p class="am-data">
                              {{
                                (payment.packageId ? $root.labels.package_purchased :
                                !payment.appointmentId ? $root.labels.event_date : $root.labels.appointment_date)
                              }}:
                            </p>
                            <p class="am-value">
                            {{ getFrontedFormattedDateTime(payment.packageId ? payment.dateTime : payment.bookingStart) }}
                            </p>
                          </el-col>
                        </el-row>
                      </el-col>

                      <!-- Type, Amount -->
                      <el-col :lg="10">
                        <el-row :gutter="10" class="am-finance-flex-row-top-align">
                          <el-col :lg="0" :sm="1" class="hide-on-mobile"></el-col>

                          <!-- Type -->
                          <el-col class="am-finance-payment-gateway" :lg="8" :sm="8">
                            <p class="am-data">{{ $root.labels.method }}:</p>
                            <div style="margin-bottom: 8px">
                              <img :src="$root.getUrl + 'public/img/payments/' + getPaymentIconName(payment)" :style="{width: getPaymentIconWidth(payment.gateway)}">
                              <p class="am-value" v-if="!longNamePayments(payment.gateway)">{{ getPaymentGatewayNiceName(payment) }}</p>
                            </div>
                            <div v-for="payment2 in payment.secondaryPayments.filter(p => p.status !== 'pending' && p.status !== 'refunded')" style="margin-bottom: 8px">
                              <img :src="$root.getUrl + 'public/img/payments/' + getPaymentIconName(payment2)" :style="{width: getPaymentIconWidth(payment2.gateway)}">
                              <p class="am-value" v-if="!longNamePayments(payment2.gateway)">{{ getPaymentGatewayNiceName(payment2) }}</p>
                            </div>
                          </el-col>

                          <!-- Amount -->
                          <el-col :lg="8" :sm="8">
                            <p class="am-data">{{ $root.labels.amount }}:</p>
                            <p class="am-value">{{ getFormattedPrice(payment.status === 'paid' || payment.status === 'partiallyPaid' ? payment.amount : 0) }}</p>
                            <div v-for="payment2 in payment.secondaryPayments.filter(p => p.status !== 'pending' && p.status !== 'refunded')">
                              <p class="am-value">{{ getFormattedPrice(payment.status === 'paid' || payment.status === 'partiallyPaid' ? payment2.amount : 0) }}</p>
                            </div>
                          </el-col>

                          <!-- ID -->
                          <el-col :lg="8" :sm="8">
                            <p class="am-data">{{ $root.labels.id }}:</p>
                            <p class="am-value">{{ payment.id }}</p>
                            <div v-for="payment2 in payment.secondaryPayments.filter(p => p.status !== 'pending' && p.status !== 'refunded')">
                              <p class="am-value">{{ payment2.id }}</p>
                            </div>
                          </el-col>
                        </el-row>
                      </el-col>

                    </el-row>
                  </div>
                </el-collapse-item>

              </el-collapse>
            </div>

            <!-- No Results -->
            <div class="am-empty-state am-section"
                 v-show="hasPayments && !hasPaymentsFiltered && !isPaymentsFiltering && options.fetched">
              <img :src="$root.getUrl + 'public/img/emptystate.svg'">
              <h2>{{ $root.labels.no_results }}</h2>
            </div>

            <!-- Pagination -->
            <pagination-block
                :params="paymentsParams"
                :count="paymentsFilteredCount"
                :show="paymentsParams.show"
                :label="$root.labels.payments_lower"
                :visible="hasPayments && hasPaymentsFiltered && !isPaymentsFiltering && options.fetched"
                @change="filterPayments"
            >
            </pagination-block>
          </el-tab-pane>

          <el-tab-pane
            :label="$root.labels.coupons"
            name="coupons"
            v-if="$root.settings.payments.coupons && (notInLicence('starter') ? licenceVisible() : true)"
          >
            <!-- Filter Coupons -->
            <div class="am-finance-filter"
                 v-show="hasCoupons && options.fetched">
              <el-form class="" :action="exportCouponsAction" method="POST">
                <el-row :gutter="16">
                  <el-col :md="24" :lg="8">
                    <div class="am-search">
                      <el-form-item>
                        <el-input
                            class="calc-width-mobile"
                            :placeholder="searchCouponsPlaceholder"
                            v-model="couponsParams.search"
                        >
                        </el-input>
                      </el-form-item>
                    </div>
                  </el-col>

                  <transition name="fade">
                    <div class="am-filter-fields" v-show="filterCouponsFields">

                      <!-- Services Filter -->
                      <el-col :md="24" :lg="8">
                        <el-form-item>
                          <el-select
                              v-model="couponsParams.services"
                              multiple
                              filterable
                              :placeholder="$root.labels.services"
                              @change="filterCoupons"
                              collapse-tags
                          >
                            <div v-for="category in options.entities.categories"
                                 :key="category.id">
                              <div
                                  class="am-drop-parent"
                                  @click="selectAllInCategoryCoupons(category.id)"
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

                      <!-- Events Filter -->
                      <el-col :md="24" :lg="7">
                        <el-form-item>
                          <el-select
                              v-model="couponsParams.events"
                              multiple
                              filterable
                              :placeholder="$root.labels.events"
                              @change="filterCoupons"
                              collapse-tags
                          >
                            <el-option
                                v-for="event in options.entities.events"
                                :key="event.id"
                                :label="event.name + ( event.periods && event.periods.length ? ' (' + getFrontedFormattedDate(event.periods[0].periodStart.split(' ')[0]) + ')' : '')"
                                :value="event.id"
                                class="am-drop-child"
                            >
                            </el-option>
                          </el-select>
                        </el-form-item>
                      </el-col>

                    </div>
                  </transition>

                  <!-- Toggle More Filters -->
                  <div class="">
                    <el-button class="button-filter-toggle am-button-icon" title="Toggle Filters"
                               @click="filterCouponsFields = !filterCouponsFields">
                      <img class="svg-amelia" alt="Toggle Filters"
                           :src="$root.getUrl+'public/img/filter.svg'"/>
                    </el-button>

                    <!-- Export Coupons -->
                    <el-tooltip placement="top">
                      <div slot="content" v-html="$root.labels.export_tooltip_coupons"></div>
                      <el-button
                          class="button-export am-button-icon"
                          @click="dialogCouponsExport = true"
                      >
                        <img class="svg-amelia" alt="Export" :src="$root.getUrl+'public/img/export.svg'"/>
                      </el-button>
                    </el-tooltip>
                  </div>
                </el-row>

                <!-- Dialog Export Coupons -->
                <transition name="slide">
                  <el-dialog
                      :close-on-click-modal="false"
                      class="am-side-dialog am-dialog-export"
                      :visible.sync="dialogCouponsExport"
                      :show-close="false"
                      v-if="dialogCouponsExport"
                  >
                    <dialog-export
                        :data="Object.assign(couponsParams, exportParamsCoupons)"
                        :action="$root.getAjaxUrl + '/report/coupons'"
                        @updateAction="(action) => {this.exportCouponsAction = action}"
                        @closeDialogExport="dialogCouponsExport = false"
                    >
                    </dialog-export>
                  </el-dialog>
                </transition>

              </el-form>
            </div>

            <!-- Spinner -->
            <div class="am-spinner am-section"
                 v-show="isCouponsFiltering || !options.fetched"
            >
              <img :src="$root.getUrl + 'public/img/spinner.svg'"/>
            </div>

            <!-- Empty State -->
            <EmptyState
              :visible="!hasCoupons && !isCouponsFiltering"
              :licence="'starter'"
              :title="$root.labels.no_coupons_yet"
            >
            </EmptyState>
            <!-- /Empty State -->

            <!-- Coupons Table Header -->
            <div
                class="am-finance-list-head"
                v-show="hasCoupons && hasCouponsFiltered && !isCouponsFiltering && options.fetched"
            >
              <el-row>

                <!-- Checkbox, Code, Discount, Deduction -->
                <el-col :lg="($root.licence.isPro || $root.licence.isDeveloper) ? 7:8">
                  <el-row :gutter="10" class="am-finance-flex-row-middle-align">

                    <!-- Checkbox -->
                    <el-col :lg="2" v-if="$root.settings.capabilities.canDelete === true">
                      <p>
                        <el-checkbox
                            v-model="checkCouponData.allChecked"
                            @change="checkCouponData = handleCheckAll(coupons, checkCouponData)">
                        </el-checkbox>
                      </p>
                    </el-col>

                    <!-- Code -->
                    <el-col :lg="6">
                      <p>{{ $root.labels.code }}:</p>
                    </el-col>

                    <!-- Discount -->
                    <el-col :lg="8">
                      <p>{{ $root.labels.discount }}:</p>
                    </el-col>

                    <!-- Deduction -->
                    <el-col :lg="8">
                      <p>{{ $root.labels.deduction }}:</p>
                    </el-col>

                  </el-row>
                </el-col>

                <!-- Service, Usage, Number of Times Used -->
                <el-col :lg="($root.licence.isPro || $root.licence.isDeveloper) ? 17:16">
                  <el-row :gutter="10" class="am-finance-flex-row-middle-align">

                    <el-col :lg="0" class="hide-on-mobile"></el-col>

                    <!-- Service -->
                    <el-col :lg="($root.licence.isPro || $root.licence.isDeveloper) ? 4:6">
                      <p>{{ $root.labels.service }}:</p>
                    </el-col>

                    <!-- Package -->
                    <el-col :lg="4" v-if="$root.licence.isPro || $root.licence.isDeveloper">
                      <p>{{ $root.labels.package }}:</p>
                    </el-col>

                    <!-- Event -->
                    <el-col :lg="($root.licence.isPro || $root.licence.isDeveloper) ? 4:6">
                      <p>{{ $root.labels.event }}:</p>
                    </el-col>

                    <!-- Usage Limit -->
                    <el-col :lg="3">
                      <p>{{ $root.labels.usage_limit }}:</p>
                    </el-col>

                    <!-- Number of Times Used -->
                    <el-col :lg="3">
                      <p>{{ $root.labels.times_used }}:</p>
                    </el-col>

                    <!-- Expiration Date -->
                    <el-col :lg="3">
                      <p>{{ $root.labels.expiration_date }}:</p>
                    </el-col>

                  </el-row>
                </el-col>

              </el-row>
            </div>

            <div
                class="am-finance-list"
                v-show="hasCoupons && hasCouponsFiltered && !isCouponsFiltering && options.fetched"
            >
              <div v-for="coupon in coupons"
                   :class="{'am-coupon-row am-hidden-entity' : coupon.status === 'hidden', 'am-coupon-row' : coupon.status === 'visible'}"
              >
                <el-row>

                  <!-- Checkbox, Code, Discount, Deduction -->
                  <el-col :lg="($root.licence.isPro || $root.licence.isDeveloper) ? 7:8">
                    <el-row :gutter="10" class="am-finance-flex-row-middle-align">

                      <!-- Checkbox -->
                      <el-col :lg="2" :sm="1" v-if="$root.settings.capabilities.canDelete === true">
                        <span @click.stop>
                          <el-checkbox
                              v-model="coupon.checked"
                              @change="checkCouponData = handleCheckSingle(coupons, checkCouponData)"
                          >
                          </el-checkbox>
                        </span>
                      </el-col>

                      <!-- Code -->
                      <el-col :lg="6" :sm="9">
                        <p class="am-col-title">{{ $root.labels.code }}:</p>
                        <h4>{{ coupon.code }}</h4>
                      </el-col>

                      <!-- Discount -->
                      <el-col :lg="8" :sm="5">
                        <p class="am-col-title">{{ $root.labels.discount }}:</p>
                        <h4>{{ coupon.discount }}</h4>
                      </el-col>

                      <!-- Deduction -->
                      <el-col :lg="8" :sm="5">
                        <p class="am-col-title">{{ $root.labels.deduction }}:</p>
                        <h4>{{ getFormattedPrice(coupon.deduction) }}</h4>
                      </el-col>

                    </el-row>
                  </el-col>

                  <!-- Service, Usage, Number of Times Used -->
                  <el-col :lg="($root.licence.isPro || $root.licence.isDeveloper) ? 17:16">
                    <el-row :gutter="10" class="am-finance-flex-row-middle-align">

                      <el-col :lg="0" :sm="1" class="hide-on-mobile"></el-col>

                      <!-- Service -->
                      <el-col :lg="($root.licence.isPro || $root.licence.isDeveloper) ? 4:6" :sm="9">
                        <p class="am-col-title">{{ $root.labels.service }}:</p>
                        <h4 v-if="coupon.allServices">{{$root.labels.all_services}}</h4>
                        <h4 v-else>
                          {{coupon.serviceList.length > 0 ? (coupon.serviceList[0].name) : ''}}
                          <br>
                          <span>
                            {{
                              (coupon.serviceList.length > 1
                                  ? (coupon.serviceList.length === 2 ?
                                    ('+' + (coupon.serviceList.length - 1) + ' ' + $root.labels.service)
                                    : ('+' + (coupon.serviceList.length - 1) + ' ' + $root.labels.services)
                                  )
                                  : '')
                            }}
                          </span>
                        </h4>
                      </el-col>

                      <!-- Package -->
                      <el-col :lg="4" :sm="9" v-if="$root.licence.isPro || $root.licence.isDeveloper">
                        <p class="am-col-title">{{ $root.labels.package }}:</p>
                        <h4 v-if="coupon.allPackages">{{$root.labels.all_packages}}</h4>
                        <h4 v-else>
                          {{coupon.packageList.length > 0 ? (coupon.packageList[0].name) : ''}}
                          <br>
                          <span>
                            {{
                              (coupon.packageList.length > 1
                                ? (coupon.packageList.length === 2 ?
                                  ('+' + (coupon.packageList.length - 1) + ' ' + $root.labels.package)
                                  : ('+' + (coupon.packageList.length - 1) + ' ' + $root.labels.packages)
                                )
                                : '')
                            }}
                          </span>
                        </h4>
                      </el-col>

                      <!-- Event -->
                      <el-col :lg="($root.licence.isPro || $root.licence.isDeveloper) ? 4:6" :sm="9">
                        <p class="am-col-title">{{ $root.labels.event }}:</p>
                        <h4 v-if="coupon.allEvents">{{$root.labels.all_events}}</h4>
                        <h4 v-else>
                          {{coupon.eventList.length > 0 ? (coupon.eventList[0].name) : ''}}
                          <br>
                          <span>
                            {{
                              (coupon.eventList.length > 1
                                ? (coupon.eventList.length === 2 ?
                                  ('+' + (coupon.eventList.length - 1) + ' ' + $root.labels.event)
                                  : ('+' + (coupon.eventList.length - 1) + ' ' + $root.labels.events)
                                )
                                : '')
                            }}
                          </span>
                        </h4>
                      </el-col>

                      <!-- Usage Limit -->
                      <el-col :lg="3" :sm="5">
                        <p class="am-col-title">{{ $root.labels.usage_limit }}:</p>
                        <h4>{{ coupon.limit }}</h4>
                      </el-col>

                      <!-- Number of Times Used -->
                      <el-col :lg="3" :sm="5">
                        <p class="am-col-title">{{ $root.labels.times_used }}:</p>
                        <h4>{{ coupon.used }}</h4>
                      </el-col>

                      <!-- Expiration Date -->
                      <el-col :lg="3" :sm="5">
                        <p class="am-col-title">{{ $root.labels.expiration_date }}:</p>
                        <h4>{{ coupon.expirationDate ? getFrontedFormattedDate(coupon.expirationDate) : '/'}}</h4>
                      </el-col>

                      <!-- Edit Button -->
                      <el-col :lg="3" :sm="4" class="align-right">
                        <div @click.stop>
                          <el-button @click="showDialogEditCoupon(coupon.id)">{{ $root.labels.edit }}</el-button>
                        </div>
                      </el-col>

                    </el-row>
                  </el-col>
                </el-row>
              </div>
            </div>

            <!-- No Results -->
            <div class="am-empty-state am-section"
                 v-show="hasCoupons && !hasCouponsFiltered && !isCouponsFiltering && options.fetched">
              <img :src="$root.getUrl + 'public/img/emptystate.svg'">
              <h2>{{ $root.labels.no_results }}</h2>
            </div>

            <!-- Pagination -->
            <pagination-block
                :params="couponsParams"
                :count="couponsFilteredCount"
                :label="$root.labels.coupons_lower"
                :visible="hasCoupons && hasCouponsFiltered && !isCouponsFiltering && options.fetched"
                @change="filterCoupons"
            >
            </pagination-block>
          </el-tab-pane>

          <el-tab-pane
            :label="$root.labels.taxes"
            name="taxes"
            v-if="$root.settings.payments.taxes.enabled && (notInLicence() ? licenceVisible() : true)"
          >
            <!-- Filter Taxes -->
            <div class="am-finance-filter"
                 v-show="hasTaxes && options.fetched">
              <el-form class="">
                <el-row :gutter="16">
                  <el-col :md="24" :lg="4">
                    <div class="am-search">
                      <el-form-item>
                        <el-input
                          class="calc-width-mobile-tax"
                          :placeholder="searchTaxesPlaceholder"
                          v-model="taxesParams.search"
                        >
                        </el-input>
                      </el-form-item>
                    </div>
                  </el-col>

                  <transition name="fade">
                    <div class="am-filter-fields" v-show="filterTaxesFields">

                      <!-- Services Filter -->
                      <el-col :md="24" :lg="5">
                        <el-form-item>
                          <el-select
                            v-model="taxesParams.services"
                            multiple
                            filterable
                            :placeholder="$root.labels.services"
                            @change="filterTaxes"
                            collapse-tags
                          >
                            <div v-for="category in options.entities.categories"
                                 :key="category.id">
                              <div
                                class="am-drop-parent"
                                @click="selectAllInCategoryTaxes(category.id)"
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

                      <!-- Extras Filter -->
                      <el-col :md="24" :lg="5">
                        <el-form-item>
                          <el-select
                            v-model="taxesParams.extras"
                            multiple
                            filterable
                            :placeholder="$root.labels.extras"
                            @change="filterTaxes"
                            collapse-tags
                          >
                            <div v-for="service in options.entities.services"
                                 :key="service.id"
                                 v-if="service.extras.length">
                              <div
                                class="am-drop-parent"
                                @click="selectAllInServiceTaxes(service.id)"
                              >
                                <span>{{ service.name }} ({{getCategoryById(service.categoryId).name}})</span>
                              </div>
                              <el-option
                                v-for="extra in service.extras"
                                :key="extra.id"
                                :label="extra.name"
                                :value="extra.id"
                                class="am-drop-child"
                              >
                              </el-option>
                            </div>
                          </el-select>
                        </el-form-item>
                      </el-col>

                      <!-- Packages Filter -->
                      <el-col :md="24" :lg="5">
                        <el-form-item>
                          <el-select
                            v-model="taxesParams.packages"
                            multiple
                            filterable
                            :placeholder="$root.labels.packages"
                            @change="filterTaxes"
                            collapse-tags
                          >
                            <el-option
                              v-for="pack in options.entities.packages"
                              :key="pack.id"
                              :label="pack.name"
                              :value="pack.id"
                              class="am-drop-child"
                            >
                            </el-option>
                          </el-select>
                        </el-form-item>
                      </el-col>

                      <!-- Events Filter -->
                      <el-col :md="24" :lg="5">
                        <el-form-item>
                          <el-select
                            v-model="taxesParams.events"
                            multiple
                            filterable
                            :placeholder="$root.labels.events"
                            @change="filterTaxes"
                            collapse-tags
                          >
                            <el-option
                              v-for="event in options.entities.events"
                              :key="event.id"
                              :label="event.name + ( event.periods && event.periods.length ? ' (' + getFrontedFormattedDate(event.periods[0].periodStart.split(' ')[0]) + ')' : '')"
                              :value="event.id"
                              class="am-drop-child"
                            >
                            </el-option>
                          </el-select>
                        </el-form-item>
                      </el-col>

                    </div>
                  </transition>

                  <!-- Toggle More Filters -->
                  <div class="">
                    <el-button class="button-filter-toggle am-button-icon" title="Toggle Filters" style="right: 8px;"
                               @click="filterTaxesFields = !filterTaxesFields">
                      <img class="svg-amelia" alt="Toggle Filters"
                           :src="$root.getUrl+'public/img/filter.svg'"/>
                    </el-button>
                  </div>
                </el-row>
              </el-form>
            </div>

            <!-- Spinner -->
            <div class="am-spinner am-section"
                 v-show="isTaxesFiltering || !options.fetched"
            >
              <img :src="$root.getUrl + 'public/img/spinner.svg'"/>
            </div>

            <!-- Empty State -->
            <EmptyState
              :visible="!hasTaxes && !isTaxesFiltering"
              :licence="'basic'"
              :title="$root.labels.no_taxes_yet"
            >
            </EmptyState>
            <!-- /Empty State -->

            <!-- Taxes Table Header -->
            <div
              class="am-finance-list-head"
              v-show="hasTaxes && hasTaxesFiltered && !isTaxesFiltering && options.fetched"
            >
              <el-row>

                <!-- Checkbox, Name, Amount -->
                <el-col :lg="7">
                  <el-row :gutter="10" class="am-finance-flex-row-middle-align">

                    <!-- Checkbox -->
                    <el-col :lg="2" v-if="$root.settings.capabilities.canDelete === true">
                      <p>
                        <el-checkbox
                          v-model="checkTaxData.allChecked"
                          @change="checkTaxData = handleCheckAll(coupons, checkTaxData)">
                        </el-checkbox>
                      </p>
                    </el-col>

                    <!-- Name -->
                    <el-col :lg="11">
                      <p>{{ $root.labels.name }}:</p>
                    </el-col>

                    <!-- Rate -->
                    <el-col :lg="11">
                      <p>{{ $root.labels.rate }}:</p>
                    </el-col>

                  </el-row>
                </el-col>

                <!-- Service, Extra, Event, Package -->
                <el-col :lg="17">
                  <el-row :gutter="10" class="am-finance-flex-row-middle-align">

                    <el-col :lg="0" class="hide-on-mobile"></el-col>

                    <!-- Service -->
                    <el-col :lg="5">
                      <p>{{ $root.labels.service }}:</p>
                    </el-col>

                    <!-- Extra -->
                    <el-col :lg="5">
                      <p>{{ $root.labels.extra }}:</p>
                    </el-col>

                    <!-- Package -->
                    <el-col :lg="5">
                      <p>{{ $root.labels.package }}:</p>
                    </el-col>

                    <!-- Event -->
                    <el-col :lg="5">
                      <p>{{ $root.labels.event }}:</p>
                    </el-col>

                  </el-row>
                </el-col>

              </el-row>
            </div>

            <div
              class="am-finance-list"
              v-show="hasTaxes && hasTaxesFiltered && !isTaxesFiltering && options.fetched"
            >
              <div v-for="tax in taxes"
                   :class="{'am-coupon-row am-hidden-entity' : tax.status === 'hidden', 'am-coupon-row' : tax.status === 'visible'}"
              >
                <el-row>

                  <!-- Checkbox, Name, Amount -->
                  <el-col :lg="7">
                    <el-row :gutter="10" class="am-finance-flex-row-middle-align">

                      <!-- Checkbox -->
                      <el-col :lg="2" :sm="1" v-if="$root.settings.capabilities.canDelete === true">
                        <span @click.stop>
                          <el-checkbox
                            v-model="tax.checked"
                            @change="checkTaxData = handleCheckSingle(taxes, checkTaxData)"
                          >
                          </el-checkbox>
                        </span>
                      </el-col>

                      <!-- Name -->
                      <el-col :lg="11" :sm="11">
                        <p class="am-col-title">{{ $root.labels.name }}:</p>
                        <h4>{{ tax.name }}</h4>
                      </el-col>

                      <!-- Rate -->
                      <el-col :lg="11" :sm="11">
                        <p class="am-col-title">{{ $root.labels.rate }}:</p>
                        <h4>{{ tax.type === 'percentage' ? tax.amount + '%' : getFormattedPrice(tax.amount) }}</h4>
                      </el-col>

                    </el-row>
                  </el-col>

                  <!-- Service, Extra, Event, Package -->
                  <el-col :lg="17">
                    <el-row :gutter="10" class="am-finance-flex-row-middle-align">

                      <el-col :lg="0" :sm="1" class="hide-on-mobile"></el-col>

                      <!-- Service -->
                      <el-col :lg="5" :sm="9">
                        <p class="am-col-title">{{ $root.labels.service }}:</p>
                        <h4>
                          {{tax.serviceList.length > 0 ? (tax.serviceList[0].name) : ''}}
                          <br>
                          <span>
                            {{
                              (tax.serviceList.length > 1
                                ? (tax.serviceList.length === 2 ?
                                    ('+' + (tax.serviceList.length - 1) + ' ' + $root.labels.service)
                                    : ('+' + (tax.serviceList.length - 1) + ' ' + $root.labels.services)
                                )
                                : '')
                            }}
                          </span>
                        </h4>
                      </el-col>

                      <!-- Extra -->
                      <el-col :lg="5" :sm="9">
                        <p class="am-col-title">{{ $root.labels.extra }}:</p>
                        <h4>
                          {{tax.extraList.length > 0 ? (tax.extraList[0].name) : ''}}
                          <br>
                          <span>
                            {{
                              (tax.extraList.length > 1
                                ? (tax.extraList.length === 2 ?
                                    ('+' + (tax.extraList.length - 1) + ' ' + $root.labels.extra)
                                    : ('+' + (tax.extraList.length - 1) + ' ' + $root.labels.extras)
                                )
                                : '')
                            }}
                          </span>
                        </h4>
                      </el-col>

                      <!-- Package -->
                      <el-col :lg="5" :sm="9">
                        <p class="am-col-title">{{ $root.labels.package }}:</p>
                        <h4>
                          {{tax.packageList.length > 0 ? (tax.packageList[0].name) : ''}}
                          <br>
                          <span>
                            {{
                              (tax.packageList.length > 1
                                ? (tax.packageList.length === 2 ?
                                    ('+' + (tax.packageList.length - 1) + ' ' + $root.labels.package)
                                    : ('+' + (tax.packageList.length - 1) + ' ' + $root.labels.packages)
                                )
                                : '')
                            }}
                          </span>
                        </h4>
                      </el-col>

                      <!-- Event -->
                      <el-col :lg="5" :sm="9">
                        <p class="am-col-title">{{ $root.labels.event }}:</p>
                        <h4>
                          {{tax.eventList.length > 0 ? (tax.eventList[0].name) : ''}}
                          <br>
                          <span>
                            {{
                              (tax.eventList.length > 1
                                ? (tax.eventList.length === 2 ?
                                    ('+' + (tax.eventList.length - 1) + ' ' + $root.labels.event)
                                    : ('+' + (tax.eventList.length - 1) + ' ' + $root.labels.events)
                                )
                                : '')
                            }}
                          </span>
                        </h4>
                      </el-col>

                      <!-- Edit Button -->
                      <el-col :lg="4" :sm="4" class="align-right">
                        <div @click.stop>
                          <el-button @click="showDialogEditTax(tax.id)">{{ $root.labels.edit }}</el-button>
                        </div>
                      </el-col>
                    </el-row>
                  </el-col>
                </el-row>
              </div>
            </div>

            <!-- No Results -->
            <div class="am-empty-state am-section"
                 v-show="hasTaxes && !hasTaxesFiltered && !isTaxesFiltering && options.fetched">
              <img :src="$root.getUrl + 'public/img/emptystate.svg'">
              <h2>{{ $root.labels.no_results }}</h2>
            </div>

            <!-- Pagination -->
            <pagination-block
              :params="taxesParams"
              :count="taxesFilteredCount"
              :label="$root.labels.taxes_lower"
              :visible="hasTaxes && hasTaxesFiltered && !isTaxesFiltering && options.fetched"
              @change="filterTaxes"
            >
            </pagination-block>
          </el-tab-pane>

          <el-tab-pane
            :label="$root.labels.invoices"
            name="invoices"
            v-if="notInLicence() ? licenceVisible() : true"
          >

            <!-- Filter Finance -->
            <div
                class="am-finance-filter"
                v-show="hasInvoices && options.fetched"
            >
              <el-form class="">
                <el-row :gutter="16">

                  <!-- Date Filter -->
                  <el-col :md="24" :lg="6" class="v-calendar-column">
                    <el-form-item class="calc-width-mobile-invoice">
                      <v-date-picker
                          @input="changeRangeInvoices"
                          v-model="invoiceParams.dates"
                          :is-double-paned="true"
                          mode='range'
                          popover-visibility="focus"
                          popover-direction="bottom"
                          tint-color='#1A84EE'
                          :show-day-popover=false
                          :input-props='{class: "el-input__inner"}'
                          :is-expanded=false
                          :is-required=true
                          input-class="el-input__inner"
                          :placeholder="$root.labels.pick_a_date"
                          :formats="vCalendarFormats"
                      >
                      </v-date-picker>
                      <span
                          v-if="invoiceParams.dates"
                          class="am-v-date-picker-suffix el-input__suffix-inner"
                          @click="clearInvoiceDateFilter()"
                      >
                        <i class="el-select__caret el-input__icon el-icon-circle-close"></i>
                      </span>
                    </el-form-item>
                  </el-col>

                  <transition name="fade">
                    <div class="am-filter-fields" v-show="filterInvoicesFields">

                      <!-- Customers Filter -->
                      <el-col :md="6" :lg="3">
                        <el-form-item>
                          <el-select
                              v-model="invoiceParams.customerId"
                              filterable
                              clearable
                              :placeholder="$root.labels.customer"
                              @change="filterInvoices"
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

                      <!-- Employees Filter -->
                      <el-col :md="6" :lg="3">
                        <el-form-item>
                          <el-select
                              v-model="invoiceParams.providerId"
                              filterable
                              clearable
                              :placeholder="$root.labels.employee"
                              @change="filterInvoices"
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

                      <!-- Services Filter -->
                      <el-col :md="6" :lg="4">
                        <el-form-item>
                          <el-select
                              v-model="invoiceParams.services"
                              multiple
                              filterable
                              :placeholder="$root.labels.services"
                              @change="filterInvoices"
                              collapse-tags
                          >
                            <div v-for="category in options.entities.categories"
                                 :key="category.id">
                              <div class="am-drop-parent"
                                   @click="selectAllInCategoryFinance(category.id)"
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

                      <!-- Events Filter -->
                      <el-col :md="6" :lg="4">
                        <el-form-item>
                          <el-select
                              v-model="invoiceParams.events"
                              multiple
                              clearable
                              :placeholder="$root.labels.events"
                              @change="filterInvoices"
                          >
                            <el-option
                                v-for="item in options.entities.events"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id"
                            >
                            </el-option>
                          </el-select>
                        </el-form-item>
                      </el-col>

                      <!-- Packages Filter -->
                      <el-col :md="6" :lg="4">
                        <el-form-item>
                          <el-select
                              v-model="invoiceParams.packages"
                              multiple
                              clearable
                              :placeholder="$root.labels.packages"
                              @change="filterInvoices"
                          >
                            <el-option
                                v-for="item in options.entities.packages"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id"
                            >
                            </el-option>
                          </el-select>
                        </el-form-item>
                      </el-col>


                    </div>
                  </transition>

                  <div class="">

                    <!-- Toggle More Filters -->
                    <el-button
                        class="button-filter-toggle button-filter-toggle-invoice am-button-icon"
                        title="Toggle Filters"
                        @click="filterInvoicesFields = !filterInvoicesFields"
                    >
                      <img class="svg-amelia" alt="Toggle Filters" :src="$root.getUrl + 'public/img/filter.svg'"/>
                    </el-button>

                  </div>

                </el-row>

              </el-form>
            </div>

            <!-- Spinner -->
            <div class="am-spinner am-section"
                 v-show="isInvoicesFiltering"
            >
              <img :src="$root.getUrl + 'public/img/spinner.svg'"/>
            </div>

            <!-- Empty State -->
            <EmptyState
                :visible="invoicesTotalCount === 0 && !isInvoicesFiltering"
                :licence="'basic'"
                :title="$root.labels.no_payments_yet"
            >
            </EmptyState>

            <!-- Table Header -->
            <div
                class="am-finance-list-head"
                v-show="invoicesTotalCount !== 0 && invoices.length !== 0 && !isInvoicesFiltering"
            >
              <el-row>

                <!-- Payment Date, Customer, Employee -->
                <el-col :lg="14">
                  <el-row :gutter="10" class="am-finance-flex-row-middle-align">

                    <el-col :lg="1">
                      <p></p>
                    </el-col>

                    <!-- Issue Date -->
                    <el-col :lg="8">
                      <p>{{ $root.labels.issue_date }}:</p>
                    </el-col>

                    <!-- Invoice Number -->
                    <el-col :lg="3">
                      <p>{{ $root.labels.invoice }}:</p>
                    </el-col>

                    <!-- Total -->
                    <el-col :lg="4">
                      <p>{{ $root.labels.total }}:</p>
                    </el-col>

                    <!-- Customer -->
                    <el-col :lg="8">
                      <p>{{ $root.labels.customer }}:</p>
                    </el-col>

                  </el-row>

                </el-col>

                <!-- Status -->
                <el-col :lg="10">
                  <el-row :gutter="10" class="am-finance-flex-row-middle-align">
                    <el-col :lg="0" class="hide-on-mobile"></el-col>

                    <!-- Service -->
                    <el-col :lg="12">
                      <p>{{ $root.labels.service }}/{{ $root.labels.event }}:</p>
                    </el-col>

                    <!-- Status -->
                    <el-col :lg="12">
                      <p>{{ $root.labels.status }}:</p>
                    </el-col>

                  </el-row>
                </el-col>

              </el-row>
            </div>

            <!-- Collapsible Data  -->
            <div
                class="am-finance-list"
                v-show="invoicesTotalCount !== 0 && invoices.length !== 0 && !isInvoicesFiltering"
            >

                <div
                    v-for="(payment, index) in invoices"
                    :key="payment.id"
                    :name="payment.id"
                    class="am-finance"
                >

                    <div class="am-finance-data am-finance-data-invoices">
                      <span class="am-entity-color am-event-color"
                            v-if="payment.appointmentId === 0">
                      </span>
                      <span class="am-entity-color am-appointment-color"
                            v-else>
                      </span>
                      <el-row>

                        <!-- Payment Date, Customer -->
                        <el-col :lg="14">
                          <el-row :gutter="10" class="am-finance-flex-row-middle-align">

                            <el-col :lg="1" :sm="1">
                              <span></span>
                            </el-col>

                            <!-- Issue Date -->
                            <el-col :lg="8" :sm="8">
                              <p class="am-col-title">{{ $root.labels.issue_date }}:</p>
                              <h4>{{ getFrontedFormattedDate(payment.created) }}</h4>
                            </el-col>

                            <!-- Invoice Number -->
                            <el-col :lg="3" :sm="3">
                              <p class="am-col-title">{{ $root.labels.invoice }}:</p>
                              <h4>{{ payment.invoiceNumber ? '#' + payment.invoiceNumber : '' }}</h4>
                            </el-col>

                            <!-- Total -->
                            <el-col :lg="4" :sm="4">
                              <p class="am-col-title">{{ $root.labels.total }}:</p>
                              <h4>{{ getFormattedPrice(payment.total) }}</h4>
                            </el-col>

                            <!-- Customer -->
                            <el-col :lg="8" :sm="8">
                              <p class="am-col-title">{{ $root.labels.customer }}:</p>
                              <h3 :class="getNoShowClass(payment.customerId)">
                                {{ payment.customerFirstName + ' ' + payment.customerLastName }}
                              </h3>
                              <span>{{ payment.customerEmail }}</span>
                            </el-col>


                          </el-row>
                        </el-col>

                        <el-col :lg="10">
                          <el-row :gutter="10" class="am-finance-flex-row-middle-align">
                            <el-col :lg="0" :sm="1" class="hide-on-mobile"></el-col>

                            <!-- Service -->
                            <el-col :lg="12" :sm="14" class="am-payment-service">
                              <p class="am-col-title">{{ $root.labels.service }}/{{ $root.labels.event }}:</p>
                              <img
                                  v-if="payment.packageId"
                                  :src="$root.getUrl + 'public/img/am-package-black.svg'"
                              >
                              <h4>{{ getBookableName(payment) }}</h4>
                            </el-col>

                            <!-- Status -->
                            <el-col class="am-finance-payment-status" :lg="6" :sm="5">
                              <p class="am-col-title">{{ $root.labels.status }}:</p>
                              <div class="am-payment-status">
                                <span :class="'am-payment-status-symbol am-payment-status-symbol-' + payment.fullStatus"></span>
                                <h4>
                                  {{ getPaymentStatusNiceName(payment.fullStatus) }}
                                </h4>
                              </div>
                            </el-col>

                            <!-- Details Button -->
                            <el-col :lg="6" :sm="4" class="align-right">
                              <div @click.stop>
                                <el-button @click="showDialogEditPayment(payment, true)">
                                  {{ $root.labels.details }}
                                </el-button>
                              </div>
                            </el-col>

                          </el-row>
                        </el-col>
                      </el-row>
                    </div>


                </div>

            </div>

            <!-- No Results -->
            <div class="am-empty-state am-section"
                 v-show="invoicesTotalCount !== 0 && invoices.length === 0 && !isInvoicesFiltering">
              <img :src="$root.getUrl + 'public/img/emptystate.svg'">
              <h2>{{ $root.labels.no_results }}</h2>
            </div>

            <!-- Pagination -->
            <pagination-block
                :params="invoiceParams"
                :count="invoicesFilteredCount"
                :show="invoiceParams.show"
                :label="$root.labels.payments_lower"
                :visible="invoicesTotalCount !== 0 && invoices.length !== 0 && !isInvoicesFiltering"
                @change="filterInvoices"
            >
            </pagination-block>

          </el-tab-pane>

        </el-tabs>

      </div>

      <!-- Selected Popover Delete -->
      <group-delete
          name="payments"
          :entities="payments"
          :checkGroupData="checkPaymentData"
          :confirmDeleteMessage="$root.labels.confirm_delete_payment"
          :successMessage="{single: $root.labels.payment_deleted, multiple: $root.labels.payments_deleted}"
          :errorMessage="{single: $root.labels.payment_not_deleted, multiple: $root.labels.payments_not_deleted}"
          @groupDeleteCallback="paymentGroupDeleteCallback"
      >
      </group-delete>

      <!-- Selected Popover Delete -->
      <group-delete
        name="taxes"
        :entities="taxes"
        :checkGroupData="checkTaxData"
        :confirmDeleteMessage="$root.labels.confirm_delete_tax"
        :successMessage="{single: $root.labels.tax_deleted, multiple: $root.labels.taxes_deleted}"
        :errorMessage="{single: $root.labels.tax_not_deleted, multiple: $root.labels.taxes_not_deleted}"
        @groupDeleteCallback="taxGroupDeleteCallback"
      >
      </group-delete>

      <!-- Selected Popover Delete -->
      <group-delete
          name="coupons"
          :entities="coupons"
          :checkGroupData="checkCouponData"
          :confirmDeleteMessage="$root.labels.confirm_delete_coupon"
          :successMessage="{single: $root.labels.coupon_deleted, multiple: $root.labels.coupons_deleted}"
          :errorMessage="{single: $root.labels.coupon_not_deleted, multiple: $root.labels.coupons_not_deleted}"
          @groupDeleteCallback="couponGroupDeleteCallback"
      >
      </group-delete>

      <!-- Dialog Tax -->
      <transition name="slide" v-if="$root.settings.payments.taxes.enabled">
        <el-dialog
          :close-on-click-modal="false"
          class="am-side-dialog am-dialog-coupon"
          :visible.sync="dialogTax"
          :show-close="false"
          v-if="dialogTax"
        >
          <dialog-tax
            :tax="tax"
            :taxes="taxes"
            :services="options.entities.services"
            :extras="options.entities.extras"
            :events="options.entities.events"
            :packages="options.entities.packages"
            :taxFetched="taxFetched"
            @closeDialog="closeDialogTax()"
            @saveCallback="savedTax"
            @duplicateCallback="duplicateTaxCallback"
          >
          </dialog-tax>
        </el-dialog>
      </transition>

      <!-- Dialog Coupon -->
      <transition name="slide" v-if="$root.settings.payments.coupons">
        <el-dialog
            :close-on-click-modal="false"
            class="am-side-dialog am-dialog-coupon"
            :visible.sync="dialogCoupon"
            :show-close="false"
            v-if="dialogCoupon"
        >
          <dialog-coupon
              :coupon="coupon"
              :services="options.entities.services"
              :events="options.entities.events"
              :packages="options.entities.packages"
              :couponFetched="couponFetched"
              @closeDialog="closeDialogCoupon()"
              @saveCallback="savedCoupon"
              @duplicateCallback="duplicateCouponCallback"
          >
          </dialog-coupon>
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
              :bookingFetched="bookingFetched"
              :customersNoShowCount="customersNoShowCount"
              :invoice-in-dialog="invoiceInDialog"
              @updatePaymentCallback="updatePaymentCallback"
              @deletePaymentCallback="updatePaymentCallback"
              @closeDialogPayment="closeDialogPayment()"
          >
          </dialog-payment>
        </el-dialog>
      </transition>

      <!-- Help Button -->
      <el-col :md="6" class="">
        <a class="am-help-button" href="https://wpamelia.com/admin-finances/" target="_blank" rel="nofollow">
          <i class="el-icon-question"></i> {{ $root.labels.need_help }}?
        </a>
      </el-col>

<!--      <dialog-new-customize></dialog-new-customize>-->

    </div>
  </div>
</template>

<script>
  import PageHeader from '../parts/PageHeader.vue'
  import Form from 'form-object'
  import stashMixin from '../../../js/backend/mixins/stashMixin'
  import licenceMixin from '../../../js/common/mixins/licenceMixin'
  import customerMixin from '../../../js/backend/mixins/customerMixin'
  import imageMixin from '../../../js/common/mixins/imageMixin'
  import dateMixin from '../../../js/common/mixins/dateMixin'
  import checkMixin from '../../../js/backend/mixins/checkMixin'
  import DialogTax from './DialogFinanceTax.vue'
  import DialogCoupon from './DialogFinanceCoupon.vue'
  import DialogPayment from './DialogFinancePayment.vue'
  import DialogExport from '../parts/DialogExport.vue'
  import notifyMixin from '../../../js/backend/mixins/notifyMixin'
  import entitiesMixin from '../../../js/common/mixins/entitiesMixin'
  import paymentMixin from '../../../js/backend/mixins/paymentMixin'
  import GroupDelete from '../parts/GroupDelete.vue'
  import priceMixin from '../../../js/common/mixins/priceMixin'
  import PaginationBlock from '../parts/PaginationBlock.vue'
  import helperMixin from '../../../js/backend/mixins/helperMixin'
  // import DialogNewCustomize from '../parts/DialogNewCustomize.vue'
  import appointmentPriceMixin from '../../../js/backend/mixins/appointmentPriceMixin'
  import moment from "moment/moment";
  import eventMixin from '../../../js/backend/mixins/eventMixin'

export default {

    mixins: [
      stashMixin,
      licenceMixin,
      customerMixin,
      paymentMixin,
      entitiesMixin,
      imageMixin,
      dateMixin,
      checkMixin,
      notifyMixin,
      priceMixin,
      helperMixin,
      appointmentPriceMixin,
      eventMixin
    ],

    data () {
      return {
        customersNoShowCount: [],
        bookingFetched: false,
        paymentsFilteredCount: 0,
        paymentsTotalCount: 0,

        taxFetched: false,
        taxesFilteredCount: 0,
        taxesTotalCount: 0,

        couponFetched: false,
        couponsFilteredCount: 0,
        couponsTotalCount: 0,
        invoicesFilteredCount: 0,
        invoicesTotalCount: 0,

        paymentsFiltering: false,
        taxesFiltering: false,
        couponsFiltering: false,
        invoicesFiltering: false,

        fetchedFilteredPayments: false,
        fetchedFilteredTaxes: false,
        fetchedFilteredCoupons: false,
        fetchedFilteredInvoices: false,

        addNewTaxBtnDisplay: false,
        addNewCouponBtnDisplay: false,

        dialogTax: false,
        dialogCoupon: false,
        dialogPayment: false,
        invoiceInDialog: false,

        tax: null,
        coupon: null,

        form: new Form(),

        checkPaymentData: {
          toaster: false,
          allChecked: false
        },

        checkTaxData: {
          toaster: false,
          allChecked: false
        },

        checkCouponData: {
          toaster: false,
          allChecked: false
        },

        options: {
          entities: {
            events: [],
            services: [],
            packages: [],
            extras: [],
            employees: [],
            customers: []
          },
          fetched: false
        },

        dialogPaymentsExport: false,
        dialogCouponsExport: false,

        paymentsParams: {
          page: 1,
          show: this.$root.settings.general.itemsPerPageBackEnd,
          dates: this.getDatePickerInitRange(),
          status: '',
          services: [],
          events: [],
          providerId: '',
          customerId: ''
        },
        exportParamsPayments: {
          fields: [
            {label: this.$root.labels.service + '/' + this.$root.labels.event, value: 'service', checked: true},
            {label: this.$root.labels.booking_start, value: 'bookingStart', checked: true},
            {label: this.$root.labels.customer, value: 'customer', checked: true},
            {label: this.$root.labels.customer_email, value: 'customerEmail', checked: true},
            {label: this.$root.labels.employee, value: 'employee', checked: true},
            {label: this.$root.labels.employee_email, value: 'employeeEmail', checked: true},
            {label: this.$root.labels.location, value: 'location', checked: true},
            {label: this.$root.labels.amount, value: 'amount', checked: true},
            {label: this.$root.labels.method, value: 'type', checked: true},
            {label: this.$root.labels.status, value: 'status', checked: true},
            {label: this.$root.labels.payment_date, value: 'paymentDate', checked: true},
            {label: this.$root.labels.coupon_code, value: 'couponCode', checked: true},
            {label: this.$root.labels.payment_created, value: 'paymentCreated', checked: true}
          ]
        },
        exportPaymentsAction: '',

        taxesParams: {
          page: 1,
          status: '',
          services: [],
          extras: [],
          events: [],
          packages: [],
          search: ''
        },
        couponsParams: {
          page: 1,
          status: '',
          services: [],
          events: [],
          search: ''
        },
        exportParamsCoupons: {
          fields: [
            {label: this.$root.labels.code, value: 'code', checked: true},
            {label: this.$root.labels.discount, value: 'discount', checked: true},
            {label: this.$root.labels.deduction, value: 'deduction', checked: true},
            {label: this.$root.labels.services, value: 'services', checked: true},
            {label: this.$root.labels.events, value: 'events', checked: true},
            {label: this.$root.labels.limit, value: 'limit', checked: true},
            {label: this.$root.labels.used, value: 'used', checked: true}
          ]
        },
        exportCouponsAction: '',

        invoiceParams: {
          page: 1,
          show: this.$root.settings.general.itemsPerPageBackEnd,
          dates: this.getDatePickerInitRange(),
          services: [],
          events: [],
          packages: [],
          providerId: '',
          customerId: '',
          invoices: true
        },

        statuses: [
          {
            value: 'paid',
            label: this.$root.labels.paid

          }, {
            value: 'pending',
            label: this.$root.labels.pending

          },
          {
            value: 'partiallyPaid',
            label: this.$root.labels.partially_paid

          }
        ],

        selectedPaymentModalData: {
          paymentId: null,
          bookingStart: null,
          bookings: null,
          service: null,
          providers: null,
          customer: null
        },

        // Filter
        filterPaymentsFields: true,
        filterTaxesFields: true,
        searchTaxesPlaceholder: this.$root.labels.finance_taxes_search_placeholder,

        filterCouponsFields: true,
        searchCouponsPlaceholder: this.$root.labels.finance_coupons_search_placeholder,
        filterInvoicesFields: true,

        // Finance
        financeTabs: 'payments',
        payments: [],
        taxes: [],
        coupons: [],
        invoices: [],

        timer: null,
        cancelSource: null
      }
    },

    created () {
      Form.defaults.axios = this.$http

      if (!this.$root.licence.isBasic && !this.$root.licence.isStarter && !this.$root.licence.isLite) {
        this.statuses.push(
          {
            value: 'refunded',
            label: this.$root.labels.refunded
          }
        )
      }

      // Set filter params based on URL GET fields
      let urlParams = this.getUrlQueryParams(window.location.href)

      if (!('dateFrom' in urlParams) || !('dateTo' in urlParams)) {
        this.paymentsParams.dates = this.getDatePickerInitRange()
      } else {
        this.paymentsParams.dates = {
          start: this.$moment(urlParams['dateFrom']).toDate(),
          end: this.$moment(urlParams['dateTo']).toDate()
        }
      }

      if (urlParams['status']) { this.paymentsParams.status = urlParams['status'] }

      this.getPayments()

      if (this.$root.settings.payments.taxes.enabled) {
        this.getTaxes()
      }

      if (this.$root.settings.payments.coupons) {
        this.getCoupons()
      }

      this.getInvoices()

      this.handleResize()
      this.getFinanceOptions()
    },

    mounted () {
      this.inlineSVG()
      if (this.$root.settings.payments.wc && this.$root.settings.payments.wc.enabled) {
        this.exportParamsPayments.fields.push({label: this.$root.labels.wc_order_id, value: 'wcOrderId', checked: true})
      }
    },

    methods: {
      getExportData () {
        if (!this.paymentsParams.dates) {
          this.paymentsParams.dates = {
            start: '',
            end: ''
          }
        }
        return Object.assign(this.paymentsParams, this.exportParamsPayments)
      },

      clearDateFilter () {
        this.paymentsParams.dates = null

        this.paymentsParams.page = 1

        this.filterPayments()
      },

      clearInvoiceDateFilter () {
        this.invoiceParams.dates = null

        this.invoiceParams.page = 1

        this.filterInvoices()
      },

      getBookableName (payment) {
        if (payment.secondaryPayments && Object.values(payment.secondaryPayments).length > 0) {
          if (payment.name === Object.values(payment.secondaryPayments)[0].name) {
            return payment.name
          }
          return payment.name + ' +' + Object.values(payment.secondaryPayments).length
        }

        return payment.name
      },

      getPaymentsStatusAndTotal (payment) {
        let allPayments = [payment].concat(payment.secondaryPayments ? Object.values(payment.secondaryPayments) : [])

        let bookings = {}
        allPayments.forEach((singlePayment) => {
          let index = payment.type + '_' + (singlePayment.packageCustomerId ? singlePayment.packageCustomerId : singlePayment.customerBookingId)
          if (index in bookings) {
            bookings[index].booking.payments.push(singlePayment)
          } else {
            bookings[index] = {
              booking: {
                price: singlePayment.bookedPrice,
                aggregatedPrice: singlePayment.aggregatedPrice,
                persons: singlePayment.persons,
                extras: singlePayment.extras,
                coupon: singlePayment.coupon,
                tax: singlePayment.bookedTax,
                payments: [singlePayment]
              }
            }
          }
        })

        let amountData = this.getPaymentAmountData(Object.values(bookings), payment.type)

        let bookingPrice = amountData.total
        if (allPayments.every(p => p.status === 'refunded')) {
          return {status: 'refunded', total: bookingPrice}
        }

        let paidAmount = amountData.paid
        if (paidAmount >= bookingPrice.toFixed(2)) {
          return {status: 'paid', total: bookingPrice}
        } else if (paidAmount > 0) {
          return {status: 'partiallyPaid', total: bookingPrice}
        }
        return {status: 'pending', total: bookingPrice}
      },

      savedTax () {
        this.updateStashEntities({})
        this.getTaxes()
      },

      savedCoupon () {
        this.updateStashEntities({})
        this.getCoupons()
      },

      formatForFetch (params) {
        let dates = []

        if (params.dates) {
          if (params.dates.start) {
            dates.push(this.$moment(params.dates.start).format('YYYY-MM-DD'))
          }

          if (params.dates.end) {
            dates.push(this.$moment(params.dates.end).format('YYYY-MM-DD'))
          }

          params.dates = dates
        }

        Object.keys(params).forEach((key) => (!params[key] && params[key] !== 0) && delete params[key])

        return params
      },

      getPayments () {
        this.paymentsFiltering = true
        this.fetchedFilteredPayments = false

        if (this.cancelSource) {
          this.cancelSource.cancel()
        }

        let params = JSON.parse(JSON.stringify(this.paymentsParams))
        params = this.formatForFetch(params)

        this.cancelSource = this.$http.CancelToken.source()

        this.$http.get(`${this.$root.getAjaxUrl}/payments`, {
          params: this.getAppropriateUrlParams(params), cancelToken: this.cancelSource.token
        })
          .then(response => {
            let customersIds = this.options.entities.customers.map(customer => customer.id)

            let customers = this.options.entities.customers

            let $this = this
            response.data.data.payments.forEach(function (payment) {
              payment.checked = false
              let statusTotal = $this.getPaymentsStatusAndTotal(payment)
              payment.fullStatus = statusTotal.status
              if (customersIds.indexOf(payment.customerId) === -1) {
                customers.push({
                  id: payment.customerId,
                  firstName: payment.customerFirstName,
                  lastName: payment.customerLastName,
                  email: payment.customerEmail
                })
              }
            })

            this.options.entities.customers = Object.values(customers)

            this.payments = response.data.data.payments
            this.paymentsFilteredCount = response.data.data.filteredCount
            this.paymentsTotalCount = response.data.data.totalCount

            this.cancelSource = null
            this.paymentsFiltering = false
            this.fetchedFilteredPayments = true
          })
          .catch(e => {
            console.log(e.message)

            if (!this.$http.isCancel(e)) {
              this.paymentsFiltering = false
              this.fetchedFilteredPayments = true
            }
          })
      },

      getInvoices () {
        if (this.$root.licence.isLite || this.$root.licence.isStarter) {
          this.invoicesFiltering = false

          this.fetchedFilteredInvoices = false

          return
        }

        this.invoicesFiltering = true
        this.fetchedFilteredInvoices = false

        let params = JSON.parse(JSON.stringify(this.invoiceParams))
        params = this.formatForFetch(params)

        this.$http.get(`${this.$root.getAjaxUrl}/payments`, {
          params: this.getAppropriateUrlParams(params)
        })
          .then(response => {
            let $this = this
            response.data.data.payments.forEach(function (payment) {
              let statusTotal = $this.getPaymentsStatusAndTotal(payment)
              payment.fullStatus = statusTotal.status
              payment.total = statusTotal.total
            })

            this.invoices = response.data.data.payments
            this.invoicesFilteredCount = response.data.data.filteredCount
            this.invoicesTotalCount = response.data.data.totalCount

            this.invoicesFiltering = false
            this.fetchedFilteredInvoices = true
          })
          .catch(e => {
            console.log(e.message)

            this.invoicesFiltering = false
            this.fetchedFilteredInvoices = true
          })
      },

      getTotal () {
        switch (this.financeTabs) {
          case ('payments'):
            return this.paymentsFilteredCount

          case ('coupons'):
            return this.couponsFilteredCount

          case ('taxes'):
            return this.taxesFilteredCount

          case ('invoices'):
            return this.invoicesFilteredCount
        }
      },

      getFinanceOptions () {
        this.options.fetched = false

        this.searchCustomers(
          '',
          () => {
            let customersIds = this.options.entities.customers.map(customer => parseInt(customer.id))

            let customers = this.options.entities.customers

            this.searchedCustomers.forEach((customer) => {
              if (customersIds.indexOf(parseInt(customer.id)) === -1) {
                customersIds.push(customer.id)
                customers.push(customer)
              }

              this.customersNoShowCount.push({customerId: customer.id, noShowCount: customer.noShowCount})
            })

            this.options.entities.customers = Object.values(customers)
          }
        )

        this.$http.get(`${this.$root.getAjaxUrl}/entities`, {
          params: this.getAppropriateUrlParams({
            types: ['categories', 'employees', 'events', 'packages']
          })
        })
          .then(response => {
            this.options.entities = response.data.data

            this.options.entities.services = this.getServicesFromCategories(this.options.entities.categories)

            let extras = []

            this.options.entities.services.forEach((service) => {
              extras = extras.concat(service.extras)
            })

            this.options.entities.extras = extras

            this.setEntitiesToTaxes()

            this.options.fetched = true

            this.searchedEvents = this.options.entities.events
          })
          .catch(e => {
            console.log(e.message)

            this.options.fetched = true
          })
      },

      setEntitiesToTaxes () {
        this.taxes.forEach((tax, taxIndex) => {
          ['service', 'extra', 'event', 'package'].forEach((type) => {
            tax[type + 'List'].forEach((item, itemIndex) => {
              let entity = this.options.entities[type + 's'].find(i => i.id === item.id)

              if (typeof entity !== undefined && entity) {
                this.taxes[taxIndex][type + 'List'][itemIndex] = entity
              }
            })
          })
        })
      },

      getTaxes () {
        if (this.$root.licence.isLite || this.$root.licence.isStarter) {
          this.taxesFiltering = false

          this.fetchedFilteredTaxes = false

          return
        }

        this.taxesFiltering = true
        this.fetchedFilteredTaxes = false

        let params = JSON.parse(JSON.stringify(this.taxesParams))

        Object.keys(params).forEach((key) => (!params[key] && params[key] !== 0) && delete params[key])

        this.$http.get(`${this.$root.getAjaxUrl}/taxes`, {
          params: params
        })
          .then(response => {
            response.data.data.taxes.forEach(function (taxItem) {
              taxItem.checked = false
            })

            this.taxes = response.data.data.taxes
            this.taxesFilteredCount = response.data.data.filteredCount
            this.taxesTotalCount = response.data.data.totalCount

            this.setEntitiesToTaxes()

            this.taxesFiltering = false
            this.fetchedFilteredTaxes = true
          })
          .catch(e => {
            console.log(e.message)

            this.taxesFiltering = false
            this.fetchedFilteredTaxes = true
          })
      },

      getCoupons () {
        if (this.$root.licence.isLite) {
          this.couponsFiltering = false

          this.fetchedFilteredCoupons = false

          return
        }

        this.couponsFiltering = true
        this.fetchedFilteredCoupons = false

        let params = JSON.parse(JSON.stringify(this.couponsParams))

        Object.keys(params).forEach((key) => (!params[key] && params[key] !== 0) && delete params[key])

        this.$http.get(`${this.$root.getAjaxUrl}/coupons`, {
          params: params
        })
          .then(response => {
            response.data.data.coupons.forEach(function (coupItem) {
              coupItem.checked = false
            })

            this.coupons = response.data.data.coupons
            this.couponsFilteredCount = response.data.data.filteredCount
            this.couponsTotalCount = response.data.data.totalCount

            this.couponsFiltering = false
            this.fetchedFilteredCoupons = true
          })
          .catch(e => {
            console.log(e.message)

            this.couponsFiltering = false
            this.fetchedFilteredCoupons = true
          })
      },

      getPaymentAppointment (payment, invoice) {
        this.$http.get(`${this.$root.getAjaxUrl}/appointments/` + payment.appointmentId, {params: {'customerId': payment.customerId}})
          .then(response => {
            this.selectedPaymentModalData = this.getPaymentData(payment, response.data.data.appointment, null, null, invoice ? response.data.data.recurring : [])

            this.selectedPaymentModalData.recurring = response.data.data.recurring

            this.bookingFetched = true
          })
          .catch(e => {
            console.log(e.message)
          })
      },

      getEvent (payment) {
        this.$http.get(`${this.$root.getAjaxUrl}/events/` + payment.eventId)
          .then(response => {
            this.selectedPaymentModalData = this.getPaymentData(payment, null, response.data.data.event, null)

            this.bookingFetched = true
          })
          .catch(e => {
            console.log(e.message)
          })
      },

      getPackage (payment) {
        let packObj = {
          package: {name: payment.name},
          booking: {
            price: payment.bookedPrice,
            payments: [payment].concat(payment.secondaryPayments ? Object.values(payment.secondaryPayments) : []),
            extras: [],
            tax: payment.bookedTax ? JSON.parse(payment.bookedTax) : null,
          }
        }

        this.selectedPaymentModalData = this.getPaymentData(payment, null, null, packObj)

        this.bookingFetched = true
      },

      getTax (taxId) {
        this.$http.get(`${this.$root.getAjaxUrl}/taxes/` + taxId)
          .then(response => {
            let tax = response.data.data.tax

            let servicesIds = this.options.entities.services.map(service => service.id)

            tax.serviceList = tax.serviceList.filter(service => servicesIds.indexOf(service.id) !== -1)

            let extrasIds = []

            this.options.entities.services.forEach((service) => {
              extrasIds = extrasIds.concat(service.extras.map(extra => extra.id))
            })

            tax.extraList = tax.extraList.filter(extra => extrasIds.indexOf(extra.id) !== -1)

            let packagesIds = this.options.entities.packages.map(pack => pack.id)

            tax.packageList = tax.packageList.filter(pack => packagesIds.indexOf(pack.id) !== -1)

            this.tax = tax
            this.taxFetched = true
          })
          .catch(e => {
            console.log(e.message)
          })
      },

      getCoupon (couponId) {
        this.$http.get(`${this.$root.getAjaxUrl}/coupons/` + couponId)
          .then(response => {
            let coupon = response.data.data.coupon

            coupon.expirationDate = coupon.expirationDate ? this.getDate(coupon.expirationDate) : null

            let packagesIds = this.options.entities.packages.map(pack => pack.id)

            coupon.packageList = coupon.packageList.filter(pack => packagesIds.indexOf(pack.id) !== -1)

            this.coupon = coupon
            this.couponFetched = true
          })
          .catch(e => {
            console.log(e.message)
          })
      },

      paymentGroupDeleteCallback () {
        this.checkPaymentData.allChecked = false
        this.checkPaymentData.toaster = false
        this.getPayments()
      },

      taxGroupDeleteCallback () {
        this.checkTaxData.allChecked = false
        this.checkTaxData.toaster = false
        this.updateStashEntities({})
        this.getTaxes()
      },

      couponGroupDeleteCallback () {
        this.checkCouponData.allChecked = false
        this.checkCouponData.toaster = false
        this.updateStashEntities({})
        this.getCoupons()
      },

      changeRange () {
        this.setDatePickerSelectedDaysCount(this.paymentsParams.dates.start, this.paymentsParams.dates.end)

        this.filterPayments()
      },

      changeRangeInvoices () {
        this.setDatePickerSelectedDaysCount(this.invoiceParams.dates.start, this.invoiceParams.dates.end)

        this.invoiceParams.page = 1

        this.filterInvoices()
      },

      filterPayments () {
        this.getPayments()
      },

      filterTaxes () {
        this.getTaxes()
      },

      filterCoupons () {
        this.getCoupons()
      },

      filterInvoices () {
        this.getInvoices()
      },

      updatePaymentCallback () {
        this.dialogPayment = false
        this.getPayments()
      },

      duplicateTaxCallback (tax) {
        setTimeout(() => {
          this.$set(this, 'tax', tax)
          this.$set(this.tax, 'id', 0)
          this.dialogTax = true
        }, 300)
      },

      duplicateCouponCallback (coupon) {
        setTimeout(() => {
          this.$set(this, 'coupon', coupon)
          this.$set(this.coupon, 'id', 0)
          this.dialogCoupon = true
        }, 300)
      },

      handleResize () {
        this.filterPaymentsFields = window.innerWidth >= 992
        this.filterTaxesFields = window.innerWidth >= 992
        this.filterCouponsFields = window.innerWidth >= 992
      },

      showDialogNewTax () {
        this.tax = this.getInitTaxObject()
        this.dialogTax = true
      },

      showDialogNewCoupon () {
        this.coupon = this.getInitCouponObject()
        this.dialogCoupon = true
      },

      showDialogEditTax (taxId) {
        this.dialogTax = true
        this.getTax(taxId)
      },

      showDialogEditCoupon (couponId) {
        this.dialogCoupon = true
        this.getCoupon(couponId)
      },

      showDialogEditPayment (payment, invoice = false) {
        this.dialogPayment = true
        this.invoiceInDialog = invoice
        if (payment.appointmentId) {
          this.getPaymentAppointment(payment, invoice)
        }

        if (payment.eventId) {
          this.getEvent(payment)
        }

        if (payment.packageId) {
          this.getPackage(payment)
        }
      },

      handleTabClick (tab) {
        if (tab.name === 'coupons') {
          this.addNewTaxBtnDisplay = false
          this.addNewCouponBtnDisplay = true
        } else if (tab.name === 'taxes') {
          this.addNewTaxBtnDisplay = true
          this.addNewCouponBtnDisplay = false
        } else if (tab.name === 'invoices') {
          this.addNewCouponBtnDisplay = false
          this.addNewTaxBtnDisplay = false
        } else {
          this.addNewTaxBtnDisplay = false
          this.addNewCouponBtnDisplay = false
        }
      },

      selectAllInCategoryFinance (id) {
        let services = this.getCategoryServices(id)
        let servicesIds = services.map(service => service.id)

        // Deselect all services if they are already selected
        if (_.isEqual(_.intersection(servicesIds, this.paymentsParams.services), servicesIds)) {
          this.paymentsParams.services = _.difference(this.paymentsParams.services, servicesIds)
        } else {
          this.paymentsParams.services = _.uniq(this.paymentsParams.services.concat(servicesIds))
        }

        this.filterPayments()
      },

      selectAllInCategoryTaxes (id) {
        let services = this.getCategoryServices(id)
        let servicesIds = services.map(service => service.id)

        // Deselect all services if they are already selected
        if (_.isEqual(_.intersection(servicesIds, this.taxesParams.services), servicesIds)) {
          this.taxesParams.services = _.difference(this.taxesParams.services, servicesIds)
        } else {
          this.taxesParams.services = _.uniq(this.taxesParams.services.concat(servicesIds))
        }

        this.filterTaxes()
      },

      selectAllInServiceTaxes (id) {
        let service = this.getServiceById(id)
        let extrasIds = service.extras.map(extra => extra.id)

        // Deselect all extras if they are already selected
        if (_.isEqual(_.intersection(extrasIds, this.taxesParams.extras), extrasIds)) {
          this.taxesParams.extras = _.difference(this.taxesParams.extras, extrasIds)
        } else {
          this.taxesParams.extras = _.uniq(this.taxesParams.extras.concat(extrasIds))
        }

        this.filterTaxes()
      },

      selectAllInCategoryCoupons (id) {
        let services = this.getCategoryServices(id)
        let servicesIds = services.map(service => service.id)

        // Deselect all services if they are already selected
        if (_.isEqual(_.intersection(servicesIds, this.couponsParams.services), servicesIds)) {
          this.couponsParams.services = _.difference(this.couponsParams.services, servicesIds)
        } else {
          this.couponsParams.services = _.uniq(this.couponsParams.services.concat(servicesIds))
        }

        this.filterCoupons()
      },

      getInitTaxObject () {
        return {
          id: 0,
          name: '',
          amount: 0,
          type: 'percentage',
          status: 'visible',
          serviceList: [],
          extraList: [],
          eventList: [],
          packageList: []
        }
      },

      getInitCouponObject () {
        return {
          id: 0,
          code: '',
          discount: 0,
          deduction: 0,
          limit: 0,
          customerLimit: 0,
          status: 'visible',
          notificationInterval: 0,
          notificationRecurring: false,
          serviceList: [],
          eventList: [],
          packageList: []
        }
      },

      closeDialogPayment () {
        this.dialogPayment = false
        this.bookingFetched = false
      },

      closeDialogTax () {
        this.tax = null
        this.dialogTax = false
        this.taxFetched = false
      },

      closeDialogCoupon () {
        this.coupon = null
        this.dialogCoupon = false
        this.couponFetched = false
      }
    },

    watch: {
      'taxesParams.search' () {
        clearTimeout(this.timer)
        this.timer = setTimeout(this.filterTaxes, 500)
      },

      'couponsParams.search' () {
        clearTimeout(this.timer)
        this.timer = setTimeout(this.filterCoupons, 500)
      },

      'dialogPayment' () {
        if (this.dialogPayment === false) {
          this.bookingFetched = false
        }
      },

      'dialogTax' () {
        if (this.dialogTax === false) {
          this.taxFetched = false
          this.tax = null
        }
      },

      'dialogCoupon' () {
        if (this.dialogCoupon === false) {
          this.couponFetched = false
          this.coupon = null
        }
      }
    },

    computed: {
      hasPayments () {
        return this.paymentsTotalCount !== 0
      },

      hasPaymentsFiltered () {
        return this.payments.length !== 0
      },

      hasInvoices () {
        return this.invoicesTotalCount !== 0
      },

      hasInvoicesFiltered () {
        return this.invoices.length !== 0
      },

      isPaymentsFiltering () {
        return this.paymentsFiltering && this.financeTabs === 'payments'
      },

      isInvoicesFiltering () {
        return this.invoicesFiltering && this.financeTabs === 'invoices'
      },

      hasTaxes () {
        return this.taxesTotalCount !== 0
      },

      hasTaxesFiltered () {
        return this.taxes.length !== 0
      },

      isTaxesFiltering () {
        return this.taxesFiltering && this.financeTabs === 'taxes'
      },

      hasCoupons () {
        return this.couponsTotalCount !== 0
      },

      hasCouponsFiltered () {
        return this.coupons.length !== 0
      },

      isCouponsFiltering () {
        return this.couponsFiltering && this.financeTabs === 'coupons'
      }
    },

    components: {
      PageHeader,
      DialogTax,
      DialogCoupon,
      DialogPayment,
      DialogExport,
      GroupDelete,
      PaginationBlock
      // DialogNewCustomize
    }

  }
</script>

