<template>
  <div>
    <div class="am-dialog-scrollable">

      <!-- Dialog Header -->
      <div class="am-dialog-header">
        <el-row>
          <el-col :span="20">
            <h2>{{ $root.labels.payments_settings }}</h2>
          </el-col>
          <el-col :span="4" class="align-right">
            <el-button @click="closeDialog" class="am-dialog-close" size="small" icon="el-icon-close"></el-button>
          </el-col>
        </el-row>
      </div>

      <!-- Form -->
      <el-form :model="settings" ref="settings" :rules="rules" label-position="top" @submit.prevent="onSubmit">

        <el-row :gutter="24">

          <!-- Currency -->
          <el-col :span="12">
            <el-form-item :label="$root.labels.currency + ':'">
              <el-select v-model="settings.currency" filterable @change="clearValidation()">
                <el-option
                    v-for="item in currencies"
                    :key="item.code"
                    :label="item.name"
                    :value="item.code"
                >
                  <span :class="'am-flag am-flag-' + item.iso">
                  </span>
                  <span class="am-payment-settings-currency-name">{{ item.name }}</span>
                  <span class="am-payment-settings-currency-symbol">{{ item.symbol }}</span>
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <!-- Price Symbol Position -->
          <el-col :span="12">
            <el-form-item :label="$root.labels.price_symbol_position + ':'">
              <el-select v-model="settings.priceSymbolPosition" @change="clearValidation()">
                <el-option
                    v-for="item in options.priceSymbolPositions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  <span style="float: left">{{ item.label }}</span>
                  <span style="float: right; color: #7F8BA4; font-size: 13px">{{ item.example }}</span>
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>

        </el-row>

        <el-row :gutter="24">

          <!-- Price Separator -->
          <el-col :span="12">
            <el-form-item :label="$root.labels.price_separator + ':'">
              <el-select v-model="settings.priceSeparator" @change="clearValidation()">
                <el-option
                    v-for="item in options.priceSeparators"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  <span style="float: left">{{ item.label }}</span>
                  <span style="float: right; color: #7F8BA4; font-size: 13px">{{ item.example }}</span>
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <!-- Price Number Of Decimals -->
          <el-col :span="12">
            <el-form-item :label="$root.labels.price_number_of_decimals + ':'">
              <el-input-number
                  v-model="settings.priceNumberOfDecimals"
                  :min="0"
                  :max="5"
                  @input="clearValidation()"
              >
              </el-input-number>
            </el-form-item>
          </el-col>

        </el-row>

        <!-- Hide Currency Symbol On Frontend -->
        <div class="am-setting-box am-switch-box">
          <el-row type="flex" align="middle" :gutter="24">
            <el-col :span="16">
              <p>{{ $root.labels.hide_currency_symbol_frontend }}</p>
            </el-col>
            <el-col :span="8" class="align-right">
              <el-switch
                  v-model="settings.hideCurrencySymbolFrontend"
                  active-text=""
                  inactive-text=""
                  @change="clearValidation()"
              />
            </el-col>
          </el-row>
        </div>
        <!-- /Hide Currency Symbol On Frontend -->

        <!-- Custom Currency Symbol -->
        <div :style="{marginBottom: '24px'}">
          <el-row type="flex" align="middle" :gutter="24">
            <el-col :span="18">
              <label>{{$root.labels.custom_currency_symbol + ':'}}</label>
            </el-col>
            <el-col :span="6">
              <el-input
                  :style="{marginBottom: 0, textAlign: 'center'}"
                  v-model="settings.symbol"
                  :disabled="settings.hideCurrencySymbolFrontend"
              >
              </el-input>
            </el-col>
          </el-row>
        </div>
        <!-- /Custom Currency Symbol -->

        <!-- Cart -->
        <div
          v-if="notInLicence('pro') ? licenceVisible() : true"
          class="am-setting-box am-switch-box"
          :class="licenceClass('pro')"
        >
          <el-row type="flex" align="middle" :gutter="24">
            <el-col :span="16">
              <span>{{ $root.labels.cart_enable }}</span>
              <el-tooltip placement="top">
                <div slot="content" v-html="$root.labels.cart_enable_tooltip"></div>
                <i class="el-icon-question am-tooltip-icon"></i>
              </el-tooltip>
            </el-col>
            <el-col :span="8" class="align-right">
              <el-switch
                v-model="settings.cart"
                active-text=""
                inactive-text=""
                :disabled="notInLicence('pro')"
                @change="clearValidation()">
              </el-switch>
            </el-col>
          </el-row>

          <LicenceBlock :licence="'pro'"></LicenceBlock>
        </div>
        <!-- /Cart -->

        <!-- Coupons -->
        <div
          v-if="notInLicence('starter') ? licenceVisible() : true"
          class="am-setting-box am-switch-box"
          :class="licenceClass('starter')"
        >
          <el-row type="flex" align="middle" :gutter="24">
            <el-col :span="16">
              <p>{{ $root.labels.coupons }}</p>
            </el-col>
            <el-col :span="8" class="align-right">
              <el-switch
                  v-model="settings.coupons"
                  :disabled="notInLicence('starter')"
                  active-text=""
                  inactive-text=""
                  @change="clearValidation()"></el-switch>
            </el-col>
          </el-row>

          <!-- Coupons case sensitive-->
          <el-row style="margin-top: 24px" v-if="settings.coupons">
            <el-col :span="16">
              <p>{{ $root.labels.coupons_case_insensitive }}</p>
            </el-col>
            <el-col :span="8" class="align-right">
              <el-switch
                  v-model="settings.couponsCaseInsensitive"
                  :disabled="notInLicence('starter')"
                  active-text=""
                  inactive-text=""
                  @change="clearValidation()"></el-switch>
            </el-col>
          </el-row>

          <LicenceBlock :licence="'starter'"></LicenceBlock>
        </div>


        <!-- Payment Links -->
        <div :class="licenceClass()" class="am-setting-box am-switch-box">
          <el-row type="flex" align="middle" :gutter="24">
            <el-col :span="16">
              <span>{{ $root.labels.payment_links_enable }}</span>
              <el-tooltip placement="top">
                <div slot="content" v-html="$root.labels.payment_links_enable_tooltip"></div>
                <i class="el-icon-question am-tooltip-icon"></i>
              </el-tooltip>
            </el-col>
            <el-col :span="8" class="align-right">
              <el-switch
                v-model="settings.paymentLinks.enabled"
                :disabled="notInLicence()"
              ></el-switch>
            </el-col>
          </el-row>

          <el-row style="margin-top: 16px" v-if="settings.paymentLinks.enabled">
            <el-col>
              <!-- Redirect URL after payment -->
              <el-form-item label="placeholder">
                <label slot="label">
                  {{ $root.labels.payment_links_redirect }}:
                  <el-tooltip placement="top">
                    <div slot="content" v-html="$root.labels.payment_links_redirect_tooltip"></div>
                    <i class="el-icon-question am-tooltip-icon"></i>
                  </el-tooltip>
                </label>
                <el-input
                  v-model="settings.paymentLinks.redirectUrl"
                  auto-complete="off"
                  :placeholder="$root.getSiteUrl"
                >
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row type="flex" align="middle" style="margin-bottom: 16px !important;" :gutter="24" v-if="settings.paymentLinks.enabled && defaultAppointmentStatus === 'pending'">
            <el-col :span="16">
              <span>{{ $root.labels.payment_links_change_status }}</span>
              <el-tooltip placement="top">
                <div slot="content" v-html="$root.labels.payment_links_change_status_tooltip"></div>
                <i class="el-icon-question am-tooltip-icon"></i>
              </el-tooltip>
            </el-col>
            <el-col :span="8" class="align-right">
              <el-switch
                v-model="settings.paymentLinks.changeBookingStatus"
              ></el-switch>
            </el-col>
          </el-row>

          <el-alert
            style="margin-bottom: 5px"
            v-if="settings.paymentLinks.enabled"
            type="warning"
            show-icon
            title=""
            :description="$root.labels.payment_links_warning"
            :closable="false"
          >
          </el-alert>

          <LicenceBlock/>
        </div>

        <!-- Taxes -->
        <div
          v-if="notInLicence() ? licenceVisible() : true"
          class="am-setting-box am-switch-box"
          :class="licenceClass()"
        >
          <el-row type="flex" align="middle" :gutter="24">
            <el-col :span="16">
              <span>{{ $root.labels.tax_enable }}</span>
            </el-col>
            <el-col :span="8" class="align-right">
              <el-switch
                v-model="settings.taxes.enabled"
                :disabled="notInLicence()"
              ></el-switch>
            </el-col>
          </el-row>

          <el-row style="margin-top: 16px" v-if="settings.taxes.enabled" class="">
            <el-col class="am-settings-taxes">
              <div style="padding: 10px">
                <el-radio v-model="settings.taxes.excluded" :label="true" :value=true class="am-settings-taxes-radio">
                  {{$root.labels.tax_exclude}}
                  <el-tooltip placement="top">
                    <div slot="content" v-html="$root.labels.tax_exclude_tooltip"></div>
                    <i class="el-icon-question am-tooltip-icon"></i>
                  </el-tooltip>
                </el-radio>
              </div>
              <div style="padding: 10px">
                <el-radio v-model="settings.taxes.excluded" :label="false" class="am-settings-taxes-radio">
                  {{$root.labels.tax_include}}
                  <el-tooltip placement="top">
                    <div slot="content" v-html="$root.labels.tax_include_tooltip"></div>
                    <i class="el-icon-question am-tooltip-icon"></i>
                  </el-tooltip>
                </el-radio>
              </div>
            </el-col>
          </el-row>

          <LicenceBlock></LicenceBlock>
        </div>

        <!-- Invoices -->
        <div>
        </div>

        <!-- Default Payment Method -->
        <el-form-item>
          <label slot="label">
            {{ $root.labels.default_payment_method }}:
            <el-tooltip placement="top">
              <div slot="content" v-html="$root.labels.payment_tooltip"></div>
              <i class="el-icon-question am-tooltip-icon"></i>
            </el-tooltip>
          </label>
          <el-select v-model="settings.defaultPaymentMethod">
            <el-option
                v-for="item in defaultPaymentMethods"
                :key="item.value"
                :label="item.label"
                :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>

        <!-- Service Paid On-site -->
        <div class="am-setting-box am-switch-box">
          <el-row type="flex" align="middle" :gutter="24">
            <el-col :span="16">
              <p>{{ $root.labels.on_site }}</p>
            </el-col>
            <el-col :span="8" class="align-right">
              <el-switch
                  v-model="settings.onSite"
                  :disabled="!this.settings.payPal.enabled && !this.settings.stripe.enabled && !this.settings.mollie.enabled && !this.settings.wc.enabled && !this.settings.razorpay.enabled && !this.settings.square.enabled"
                  active-text=""
                  inactive-text=""
                  @change="toggleOnSite"
              >
              </el-switch>
            </el-col>
          </el-row>
        </div>


        <!-- Service Square -->
        <el-collapse v-model="squareCollapse" ref="square" >
          <el-collapse-item class="am-setting-box" name="square" :class="{'am-setting-box-square-error' : squareError !== ''}">
            <!-- Square Title -->
            <template slot="title">
              <el-col :span="16">
                <img id="am-square" class="svg-amelia" :src="this.$root.getUrl + 'public/img/payments/square.svg'">
              </el-col>
              <i v-show="settings.square.enabled" class="el-icon-circle-check"></i>
            </template>

            <!-- Square Toggle -->
            <el-row type="flex" align="middle" :gutter="24">
              <el-col :span="16">
                <p>{{ $root.labels.square_service }}:</p>
              </el-col>
              <el-col :span="8" class="align-right">
                <el-switch
                    v-model="settings.square.enabled"
                    @change="toggleSquare"
                    active-text=""
                    inactive-text=""
                    :disabled="this.settings.wc.enabled || this.settings.mollie.enabled || !squarePhpVersion"
                >
                </el-switch>
              </el-col>
            </el-row>

            <el-alert
                v-if="!squarePhpVersion"
                type="warning"
                show-icon
                title=""
                :description="$root.labels.square_php_version_error"
                :closable="false"
            >
            </el-alert>

            <el-form-item
                v-show="settings.square.enabled === true && settings.square.accessToken && settings.square.accessToken.access_token"
            >
              <el-row :gutter="16" style="margin-bottom: 8px; margin-left: 0px">
                {{ $root.labels.square_default_location }}:
                <el-tooltip placement="top">
                  <div slot="content" v-html="$root.labels.square_location_info"></div>
                  <i class="el-icon-question am-tooltip-icon"></i>
                </el-tooltip>
              </el-row>
              <el-row style="margin-bottom: 8px">
                <el-select v-model="settings.square.locationId" :disabled="squareLoading">
                  <el-option
                      v-for="location in squareLocations"
                      :key="location.id"
                      :label="location.name"
                      :value="location.id"
                  >
                  </el-option>
                </el-select>
              </el-row>
            </el-form-item>

            <el-row v-if="settings.square.enabled">
              <!-- Square Log In Button -->
              <el-button v-if="(!settings.square.accessToken || !settings.square.accessToken['access_token']) && !accessTokenSet"
                         type="primary"
                         :loading="squareLoading || squareBtnDisabled"
                         @click="getSquareAuthUrl">
                {{ $root.labels.log_in }}
              </el-button>
              <!-- Square Log Out Button -->
              <el-button v-else @click="logOutFromSquare" :loading="squareLoading || squareBtnDisabled" type="danger">
                {{ $root.labels.log_out }}
              </el-button>

              <span v-if="squareError !== ''" class="am-setting-box-square-error-text">{{ squareError }}</span>
            </el-row>


          </el-collapse-item>

        </el-collapse>

        <!-- Service WooCommerce -->
        <el-collapse :class="licenceClass()" v-model="wooCommerceCollapse">
          <el-collapse-item :disabled="notInLicence()" class="am-setting-box" name="wooCommerce">
            <!-- WooCommerce Title -->
            <template slot="title">
              <el-col :span="16">
                <img id="am-woocommerce" class="svg-amelia" :src="this.$root.getUrl + 'public/img/payments/woocommerce.svg'">
              </el-col>
              <i v-if="settings.wc.enabled" class="el-icon-circle-check"></i>
            </template>

            <!-- WooCommerce Toggle -->
            <el-row type="flex" align="middle" :gutter="24">
              <el-col :span="16">
                <p>{{ $root.labels.wc_service }}:</p>
              </el-col>
              <el-col :span="8" class="align-right">
                <el-switch
                    v-model="settings.wc.enabled"
                    @change="toggleWooCommerce"
                    active-text=""
                    inactive-text=""
                >
                </el-switch>
              </el-col>
            </el-row>

            <!-- WooCommerce On Site If Free -->
            <el-row type="flex" align="middle" :gutter="24" v-show="settings.wc.enabled === true">
              <el-col :span="16">
                <p>{{ $root.labels.wc_on_site_if_free }}:</p>
              </el-col>
              <el-col :span="8" class="align-right">
                <el-switch
                    v-model="settings.wc.onSiteIfFree"
                    active-text=""
                    inactive-text=""
                >
                </el-switch>
              </el-col>
            </el-row>

            <!-- WooCommerce Default Page -->
            <el-row type="flex" align="middle" :gutter="24" v-show="settings.wc.enabled === true" style="margin-bottom: 0;">
              <el-col :span="24">
                <el-form-item :label="$root.labels.wc_page + ':'">
                  <el-select v-model="settings.wc.page">
                    <el-option
                        v-for="item in [
                            {value: 'cart', label: $root.labels.wc_page_cart},
                            {value: 'checkout', label: $root.labels.wc_page_checkout}
                        ]"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>

            <!-- WooCommerce Default Redirect Page -->
            <el-row type="flex" align="middle" :gutter="24" v-show="settings.wc.enabled === true" style="margin-bottom: 0;">
              <el-col :span="24">
                <el-form-item :label="$root.labels.wc_redirect_page + ':'">
                  <el-select v-model="settings.wc.redirectPage">
                    <el-option
                        v-for="item in [
                          {value: 1, label: $root.labels.wc_redirect_page_1},
                          {value: 2, label: $root.labels.wc_redirect_page_2}
                        ]"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>

            <!-- WooCommerce Rules -->
            <el-tabs v-model="activeWooCommerceRuleTab" v-if="settings.wc.enabled === true">
              <el-tab-pane :label="$root.labels.appointments" name="appointments">
                <extensions
                  form="wooCommerceRule"
                  formHeader="wooCommerceRuleHeader"
                  formInfo="wooCommerceRuleInfo"
                  :addLabel="$root.labels.wc_rules_add"
                  :deleteMessage="$root.labels.wc_rules_delete_confirmation"
                  :extensions="settings.wc.rules.appointment"
                  :newExtension="{
                    order: '',
                    booking: '',
                    payment: ''
                  }"
                  type="appointment"
                  :oneRequired="true"
                >
                </extensions>
              </el-tab-pane>
              <el-tab-pane :label="$root.labels.packages" name="packages" v-if="$root.licence.isPro || $root.licence.isDeveloper">
                <extensions
                  form="wooCommerceRule"
                  formHeader="wooCommerceRuleHeader"
                  formInfo="wooCommerceRuleInfo"
                  :addLabel="$root.labels.wc_rules_add"
                  :deleteMessage="$root.labels.wc_rules_delete_confirmation"
                  :extensions="settings.wc.rules.package"
                  :newExtension="{
                    order: '',
                    booking: '',
                    payment: ''
                  }"
                  type="package"
                  :oneRequired="true"
                >
                </extensions>
              </el-tab-pane>
              <el-tab-pane :label="$root.labels.events" name="events">
                <extensions
                  form="wooCommerceRule"
                  formHeader="wooCommerceRuleHeader"
                  formInfo="wooCommerceRuleInfo"
                  :addLabel="$root.labels.wc_rules_add"
                  :deleteMessage="$root.labels.wc_rules_delete_confirmation"
                  :extensions="settings.wc.rules.event"
                  :newExtension="{
                    order: '',
                    booking: '',
                    payment: ''
                  }"
                  type="event"
                  :oneRequired="true"
                >
                </extensions>
              </el-tab-pane>
            </el-tabs>

            <!-- WooCommerce Fix -->
            <el-row type="flex" align="middle" :gutter="24" v-show="settings.wc.enabled === true" style="display: none;">
              <el-col :span="16">
                <p>Skip Checkout Get Value:</p>
              </el-col>
              <el-col :span="8" class="align-right">
                <el-switch
                    v-model="settings.wc.skipCheckoutGetValueProcessing"
                    active-text=""
                    inactive-text=""
                >
                </el-switch>
              </el-col>
            </el-row>

            <el-row type="flex" align="middle" :gutter="24" v-show="settings.wc.enabled === true" style="display: none;">
              <el-col :span="16">
                <p>Skip Get Item Data:</p>
              </el-col>
              <el-col :span="8" class="align-right">
                <el-switch
                  v-model="settings.wc.skipGetItemDataProcessing"
                  active-text=""
                  inactive-text=""
                >
                </el-switch>
              </el-col>
            </el-row>

            <!-- WooCommerce Booking multiple -->
            <el-row type="flex" align="middle" :gutter="24" v-show="settings.wc.enabled === true" style="display: none;">
              <el-col :span="16">
                <p>Allow multiple bookings in cart:</p>
              </el-col>
              <el-col :span="8" class="align-right">
                <el-switch
                  v-model="settings.wc.bookMultiple"
                  active-text=""
                  inactive-text=""
                >
                </el-switch>
              </el-col>
            </el-row>

            <!-- WooCommerce Booking Moment -->
            <el-row type="flex" align="middle" :gutter="24" v-show="settings.wc.enabled === true" style="display: none;">
              <el-col :span="16">
                <p>Create booking before payment process:</p>
              </el-col>
              <el-col :span="8" class="align-right">
                <el-switch
                  v-model="settings.wc.bookUnpaid"
                  active-text=""
                  inactive-text=""
                >
                </el-switch>
              </el-col>
            </el-row>

          </el-collapse-item>

          <LicenceBlock/>
        </el-collapse>

        <!-- Service Mollie -->
        <el-collapse :class="licenceClass()" v-model="mollieCollapse">
          <el-collapse-item :disabled="notInLicence()" class="am-setting-box" name="mollie">
            <!-- Mollie Title -->
            <template slot="title">
              <el-col :span="16">
                <img id="am-mollie" class="svg-amelia" :src="this.$root.getUrl + 'public/img/payments/mollie.svg'">
              </el-col>
              <i v-if="settings.mollie.enabled" class="el-icon-circle-check"></i>
            </template>

            <!-- Mollie Toggle -->
            <el-row type="flex" align="middle" :gutter="24">
              <el-col :span="16">
                <p>{{ $root.labels.mollie_service }}:</p>
              </el-col>
              <el-col :span="8" class="align-right">
                <el-switch
                    v-model="settings.mollie.enabled"
                    @change="toggleMollie"
                    active-text=""
                    inactive-text=""
                >
                </el-switch>
              </el-col>
            </el-row>

            <!-- Mollie Test Mode -->
            <el-row type="flex" align="middle" :gutter="24" v-show="settings.mollie.enabled === true">
              <el-col :span="16">
                <p>{{ $root.labels.sandbox_mode }}:</p>
              </el-col>
              <el-col :span="8" class="align-right">
                <el-switch
                    v-model="settings.mollie.testMode"
                    @change="handleMollieValidationRules"
                    active-text=""
                    inactive-text=""
                >
                </el-switch>
              </el-col>
            </el-row>

            <!-- Mollie Live API Key -->
            <el-form-item
                :label="$root.labels.live_api_key + ':'"
                prop="mollie.liveApiKey"
                v-show="settings.mollie.enabled === true && settings.mollie.testMode === false"
            >
              <el-input v-model.trim="settings.mollie.liveApiKey" auto-complete="off"></el-input>
            </el-form-item>

            <!-- Mollie Test API Key -->
            <el-form-item
                :label="$root.labels.test_api_key + ':'"
                prop="mollie.testApiKey"
                v-show="settings.mollie.enabled === true && settings.mollie.testMode === true"
            >
              <el-input v-model.trim="settings.mollie.testApiKey" auto-complete="off"></el-input>
            </el-form-item>


            <!-- Mollie cancel booking -->
            <el-row type="flex" align="middle" :gutter="24" v-show="settings.mollie.enabled === true" style="display: none;">
              <el-col :span="16">
                <p>Cancel booking when user goes back twice:</p>
              </el-col>
              <el-col :span="8" class="align-right">
                <el-switch
                    v-model="settings.mollie.cancelBooking"
                    active-text=""
                    inactive-text=""
                >
                </el-switch>
              </el-col>
            </el-row>
          </el-collapse-item>

          <LicenceBlock/>
        </el-collapse>

        <!-- PayPal -->
        <el-collapse :class="licenceClass()" v-model="payPalCollapse">
          <el-collapse-item :disabled="notInLicence()" class="am-setting-box" name="payPal">
            <!-- PayPal Title -->
            <template slot="title">
              <img class="svg-amelia" width="60px" :src="this.$root.getUrl + 'public/img/payments/paypal-light.svg'">
              <i v-if="settings.payPal.enabled" class="el-icon-circle-check"></i>
            </template>

            <!-- PayPal Toggle -->
            <el-row type="flex" align="middle" :gutter="24">
              <el-col :span="16">
                <p>{{ $root.labels.payPal_service }}:</p>
              </el-col>
              <el-col :span="8" class="align-right">
                <el-switch
                    v-model="settings.payPal.enabled"
                    @change="togglePayPal"
                    active-text=""
                    inactive-text=""
                    :disabled="this.settings.wc.enabled || this.settings.mollie.enabled"
                >
                </el-switch>
              </el-col>
            </el-row>

            <!-- PayPal Test Mode -->
            <el-row type="flex" align="middle" :gutter="24" v-show="settings.payPal.enabled === true">
              <el-col :span="16">
                <p>{{ $root.labels.sandbox_mode }}:</p>
              </el-col>
              <el-col :span="8" class="align-right">
                <el-switch
                    v-model="settings.payPal.sandboxMode"
                    @change="handlePayPalValidationRules"
                    active-text=""
                    inactive-text=""
                >
                </el-switch>
              </el-col>
            </el-row>

            <!-- PayPal Live Client ID -->
            <el-form-item
                :label="$root.labels.live_client_id + ':'"
                prop="payPal.liveApiClientId"
                v-show="settings.payPal.enabled === true && settings.payPal.sandboxMode === false"
            >
              <el-input v-model.trim="settings.payPal.liveApiClientId" auto-complete="off"></el-input>
            </el-form-item>

            <!-- PayPal Live Secret -->
            <el-form-item
                :label="$root.labels.live_secret + ':'"
                prop="payPal.liveApiSecret"
                v-show="settings.payPal.enabled === true && settings.payPal.sandboxMode === false"
            >
              <el-input v-model.trim="settings.payPal.liveApiSecret" auto-complete="off"></el-input>
            </el-form-item>

            <!-- PayPal Test Client ID -->
            <el-form-item
                :label="$root.labels.test_client_id + ':'"
                prop="payPal.testApiClientId"
                v-show="settings.payPal.enabled === true && settings.payPal.sandboxMode === true"
            >
              <el-input v-model.trim="settings.payPal.testApiClientId" auto-complete="off"></el-input>
            </el-form-item>

            <!-- PayPal Test Secret -->
            <el-form-item
                :label="$root.labels.test_secret + ':'"
                prop="payPal.testApiSecret"
                v-show="settings.payPal.enabled === true && settings.payPal.sandboxMode === true"
            >
              <el-input v-model.trim="settings.payPal.testApiSecret" auto-complete="off"></el-input>
            </el-form-item>

          </el-collapse-item>

          <LicenceBlock/>
        </el-collapse>

        <!-- Stripe -->
        <el-collapse :class="licenceClass()" v-model="stripeCollapse">
          <el-collapse-item :disabled="notInLicence()" class="am-setting-box" name="stripe">

            <el-alert
                v-if="showStripeAlert"
                type="warning"
                show-icon
                title=""
                :description="$root.labels.stripe_ssl_warning"
                :closable="false"
            >
            </el-alert>

            <!-- Stripe Title -->
            <template slot="title">
              <img class="svg-amelia" width="40px" :src="this.$root.getUrl + 'public/img/payments/stripe.svg'">
              <i v-if="settings.stripe.enabled" class="el-icon-circle-check"></i>
            </template>

            <!-- Stripe Toggle -->
            <el-row type="flex" align="middle" :gutter="24">
              <el-col :span="16">
                <p>{{ $root.labels.stripe_service }}:</p>
              </el-col>
              <el-col :span="8" class="align-right">
                <el-switch
                    v-model="settings.stripe.enabled"
                    @change="toggleStripe"
                    active-text=""
                    inactive-text=""
                    :disabled="isStripeDisabled()"
                >
                </el-switch>
              </el-col>
            </el-row>

            <!-- Stripe Test Mode -->
            <el-row type="flex" align="middle" :gutter="24" v-show="settings.stripe.enabled === true">
              <el-col :span="16">
                <p>{{ $root.labels.test_mode }}:</p>
              </el-col>
              <el-col :span="8" class="align-right">
                <el-switch
                    v-model="settings.stripe.testMode"
                    @change="handleStripeValidationRules"
                    active-text=""
                    inactive-text=""
                >
                </el-switch>
              </el-col>
            </el-row>

            <!-- Stripe Live Publishable Key -->
            <el-form-item
                :label="$root.labels.live_publishable_key + ':'"
                prop="stripe.livePublishableKey"
                v-show="settings.stripe.enabled === true && settings.stripe.testMode === false"
            >
              <el-input v-model.trim="settings.stripe.livePublishableKey" auto-complete="off"></el-input>
            </el-form-item>

            <!-- Stripe Live Secret Key -->
            <el-form-item
                :label="$root.labels.live_secret_key + ':'"
                prop="stripe.liveSecretKey"
                v-show="settings.stripe.enabled === true && settings.stripe.testMode === false"
            >
              <el-input v-model.trim="settings.stripe.liveSecretKey" auto-complete="off"></el-input>
            </el-form-item>

            <!-- Stripe Test Publishable Key -->
            <el-form-item
                :label="$root.labels.test_publishable_key + ':'"
                prop="stripe.testPublishableKey"
                v-show="settings.stripe.enabled === true && settings.stripe.testMode === true"
            >
              <el-input v-model.trim="settings.stripe.testPublishableKey" auto-complete="off"></el-input>
            </el-form-item>

            <!-- Stripe Test Secret Key -->
            <el-form-item
                :label="$root.labels.test_secret_key + ':'"
                prop="stripe.testSecretKey"
                v-show="settings.stripe.enabled === true && settings.stripe.testMode === true"
            >
              <el-input v-model.trim="settings.stripe.testSecretKey" auto-complete="off"></el-input>
            </el-form-item>

            <!-- Stripe Return URL -->
            <el-form-item
              label="Return URL"
              prop="stripe.returnUrl"
              style="display: none"
            >
              <el-input v-model.trim="settings.stripe.returnUrl" auto-complete="off"></el-input>
            </el-form-item>

            <!-- Stripe Address Field -->
            <el-row type="flex" align="middle" :gutter="24" v-show="settings.stripe.enabled === true">
              <el-col :span="16">
                <p>{{ $root.labels.stripe_address_fields }}:</p>
              </el-col>
              <el-col :span="8" class="align-right">
                <el-switch
                    v-model="settings.stripe.address"
                    active-text=""
                    inactive-text=""
                >
                </el-switch>
              </el-col>
            </el-row>

            <div
              v-if="settings.stripe.enabled === true && (notInLicence('pro') ? licenceVisible() : true)"
              :class="licenceClass('pro')"
            >

            <!-- Stripe Use Connect -->
            <el-row type="flex" align="middle" :gutter="24" style="margin-bottom: 10px">
              <el-col :span="16">
                <p>{{ $root.labels.use_stripe_connect }}:</p>
              </el-col>
              <el-col :span="8" class="align-right">
                <el-switch
                  v-model="settings.stripe.connect.enabled"
                  @change="handleStripeValidationRules"
                  active-text=""
                  inactive-text=""
                  :disabled="notInLicence('pro')"
                >
                </el-switch>
              </el-col>
            </el-row>

            <!-- Stripe direct vs destination vs transfer -->
            <el-form-item
              v-show="settings.stripe.enabled && settings.stripe.connect.enabled"
            >
              <label slot="label">
                {{ $root.labels.use_charge_type }}:
                <el-tooltip placement="top">
                  <div slot="content" v-html="$root.labels.use_charge_type_tooltip"></div>
                  <i class="el-icon-question am-tooltip-icon"></i>
                </el-tooltip>
              </label>
              <el-select v-model="settings.stripe.connect.method">
                <el-option
                  v-for="item in [{value: 'transfer', label: $root.labels.use_transfers_payment}, {value: 'direct', label: $root.labels.use_direct_payment}]"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>

            <el-alert
              v-if="settings.stripe.enabled && settings.stripe.connect.enabled && settings.stripe.connect.method === 'direct'"
              type="warning"
              show-icon
              title=""
              :description="$root.labels.use_charge_alert"
              :closable="false"
            >
            </el-alert>

            <!-- Stripe percentage price -->
            <el-form-item
              :label="(settings.stripe.connect.method === 'transfer' ? $root.labels.use_transfer_amount : $root.labels.use_direct_amount) + ':'"
              v-show="settings.stripe.enabled && settings.stripe.connect.enabled && settings.stripe.connect.type === 'percentage'"
            >
              <el-input-number
                v-model="settings.stripe.connect.amount"
                :min="0"
                :precision="2"
                :step="0.1"
                :max="100"
                @input="clearValidation()"
                :placeholder="settings.stripe.connect.amount ? settings.stripe.connect.amount.toString() : '0.00'"
              >
              </el-input-number>
            </el-form-item>

            <LicenceBlock :licence="'pro'"></LicenceBlock>
            </div>
          </el-collapse-item>

          <LicenceBlock/>
        </el-collapse>

        <!-- Razorpay -->
        <el-collapse :class="licenceClass()" v-model="razorpayCollapse">
          <el-collapse-item :disabled="notInLicence()" class="am-setting-box" name="razorpay">
            <!-- Razorpay Title -->
            <template slot="title">
              <img class="svg-amelia" width="60px" :src="this.$root.getUrl + 'public/img/payments/razorpay.svg'">
              <i v-if="settings.razorpay.enabled" class="el-icon-circle-check"></i>
            </template>

            <!-- Razorpay Toggle -->
            <el-row type="flex" align="middle" :gutter="24">
              <el-col :span="16">
                <p>{{ $root.labels.razorpay_service }}:</p>
              </el-col>
              <el-col :span="8" class="align-right">
                <el-switch
                    v-model="settings.razorpay.enabled"
                    @change="toggleRazorpay"
                    active-text=""
                    inactive-text=""
                    :disabled="this.settings.wc.enabled || this.settings.mollie.enabled || this.settings.square.enabled"
                >
                </el-switch>
              </el-col>
            </el-row>

            <!-- Razorpay Test Mode -->
            <el-row type="flex" align="middle" :gutter="24" v-show="settings.razorpay.enabled === true">
              <el-col :span="16">
                <p>{{ $root.labels.test_mode }}:</p>
              </el-col>
              <el-col :span="8" class="align-right">
                <el-switch
                    v-model="settings.razorpay.testMode"
                    @change="handleRazorpayValidationRules"
                    active-text=""
                    inactive-text=""
                >
                </el-switch>
              </el-col>
            </el-row>

            <!-- Razorpay Live Key ID -->
            <el-form-item
                :label="$root.labels.live_key_id + ':'"
                prop="razorpay.liveKeyId"
                v-show="settings.razorpay.enabled === true && settings.razorpay.testMode === false"
            >
              <el-input v-model.trim="settings.razorpay.liveKeyId" auto-complete="off"></el-input>
            </el-form-item>

            <!-- Razorpay Live Key Secret -->
            <el-form-item
                :label="$root.labels.live_key_secret + ':'"
                prop="razorpay.liveKeySecret"
                v-show="settings.razorpay.enabled === true && settings.razorpay.testMode === false"
            >
              <el-input v-model.trim="settings.razorpay.liveKeySecret" auto-complete="off"></el-input>
            </el-form-item>

            <!-- Razorpay Test Key ID -->
            <el-form-item
                :label="$root.labels.test_key_id + ':'"
                prop="razorpay.testKeyId"
                v-show="settings.razorpay.enabled === true && settings.razorpay.testMode === true"
            >
              <el-input v-model.trim="settings.razorpay.testKeyId" auto-complete="off"></el-input>
            </el-form-item>

            <!-- Razorpay Test Key Secret -->
            <el-form-item
                :label="$root.labels.test_key_secret + ':'"
                prop="razorpay.testKeySecret"
                v-show="settings.razorpay.enabled === true && settings.razorpay.testMode === true"
            >
              <el-input v-model.trim="settings.razorpay.testKeySecret" auto-complete="off"></el-input>
            </el-form-item>

          </el-collapse-item>

          <LicenceBlock/>
        </el-collapse>


        <!-- Set MetaData for Payment -->
        <el-collapse v-show="(settings.wc.enabled || settings.stripe.enabled || settings.payPal.enabled || settings.mollie.enabled || settings.razorpay.enabled || settings.square.enabled)">
          <el-collapse-item class="am-setting-box">
            <template slot="title">
              <p>{{ $root.labels.set_metaData_and_description }}:</p>
            </template>
            <template>
              <select-translate
                v-if="settings.wc.enabled && $root.settings.general.usedLanguages.length"
                @languageChanged="languageChanged"
              >
              </select-translate>
              <el-tabs v-model="activeTab">
                <el-tab-pane :label="$root.labels.appointments" name="appointments">
                  <payments-meta-data
                      ref="metaDataAppointments"
                      :data="payments"
                      :customFields="customFields"
                      :coupons="coupons"
                      :categories="categories"
                      :language="language"
                      tab="appointment"
                  >
                  </payments-meta-data>
                </el-tab-pane>
                <el-tab-pane :label="$root.labels.cart" name="cart" v-if="!settings.wc.enabled && ($root.licence.isPro || $root.licence.isDeveloper)">
                  <payments-meta-data
                    ref="metaDataCart"
                    :data="payments"
                    :customFields="customFields"
                    :coupons="coupons"
                    :categories="categories"
                    :language="language"
                    tab="cart"
                  >
                  </payments-meta-data>
                </el-tab-pane>
                <el-tab-pane :label="$root.labels.packages" name="packages" v-if="$root.licence.isPro || $root.licence.isDeveloper">
                  <payments-meta-data
                      ref="metaDataPackages"
                      :data="payments"
                      :language="language"
                      tab="package"
                  >
                  </payments-meta-data>
                </el-tab-pane>
                <el-tab-pane :label="$root.labels.events" name="events">
                  <payments-meta-data
                      ref="metaDataEvents"
                      :data="payments"
                      :customFields="customFields"
                      :coupons="coupons"
                      :language="language"
                      tab="event"
                  >
                  </payments-meta-data>
                </el-tab-pane>
              </el-tabs>
            </template>
          </el-collapse-item>
        </el-collapse>

      </el-form>

    </div>

    <!-- Dialog Footer -->
    <div class="am-dialog-footer">
      <div class="am-dialog-footer-actions">
        <el-row>
          <el-col :sm="24" class="align-right">
            <el-button type="" @click="closeDialog" class="">{{ $root.labels.cancel }}</el-button>
            <el-button type="primary" @click="onSubmit" class="am-dialog-create">{{ $root.labels.save }}</el-button>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
  import licenceMixin from '../../../js/common/mixins/licenceMixin'
  import imageMixin from '../../../js/common/mixins/imageMixin'
  import priceMixin from '../../../js/common/mixins/priceMixin'
  import PaymentsMetaData from './PaymentsMetaData'
  import SelectTranslate from '../parts/SelectTranslate'
  import propertiesMixin from '../../../js/common/mixins/propertiesMixin'
  import Extensions from '../parts/Extensions'
  import notifyMixin from '../../../js/backend/mixins/notifyMixin'

  export default {

    mixins: [
      licenceMixin,
      propertiesMixin,
      imageMixin,
      priceMixin,
      notifyMixin
    ],

    props: {
      customFields: {
        default: () => []
      },
      categories: {
        default: () => []
      },
      coupons: {
        default: () => []
      },
      payments: {
        type: Object
      },
      defaultAppointmentStatus: '',
      squareLocations: {
        type: Array,
        default: () => []
      },
      accessTokenSet: {
        type: Boolean,
        default: false
      },
      openSquareCollapse: {
        type: Boolean,
        default: false
      }
    },

    data () {
      return {
        activeWooCommerceRuleTab: 'appointments',
        language: '',
        settings: Object.assign({}, this.payments),
        options: {
          priceSeparators: [
            {
              label: this.$root.labels.comma_dot,
              value: 1,
              example: '15,000.00'
            },
            {
              label: this.$root.labels.dot_comma,
              value: 2,
              example: '15.000,00'
            },
            {
              label: this.$root.labels.space_dot,
              value: 3,
              example: '15 000.00'
            },
            {
              label: this.$root.labels.space_comma,
              value: 4,
              example: '15 000,00'
            }
          ],
          priceSymbolPositions: [
            {
              label: this.$root.labels.before,
              value: 'before',
              example: '$100'
            },
            {
              label: this.$root.labels.before_with_space,
              value: 'beforeWithSpace',
              example: '$ 100'
            },
            {
              label: this.$root.labels.after,
              value: 'after',
              example: '100$'
            },
            {
              label: this.$root.labels.after_with_space,
              value: 'afterWithSpace',
              example: '100 $'
            }
          ],
          sandboxMode: [
            {
              label: this.$root.labels.disabled,
              value: false
            },
            {
              label: this.$root.labels.enabled,
              value: true
            }
          ]
        },
        rules: {
          stripe: {},
          mollie: {},
          payPal: {},
          square: {}
        },
        stripeCollapse: '',
        payPalCollapse: '',
        wooCommerceCollapse: '',
        mollieCollapse: '',
        squareCollapse: '',
        razorpayCollapse: '',
        activeTab: 'appointments',
        squareLoading: false,
        squareGrantedAccess: false,
        squareError: '',
        squareBtnDisabled: false,
        squarePhpVersion: true
      }
    },

    mounted () {
      this.handleStripeValidationRules()
      this.handlePayPalValidationRules()
      this.handleMollieValidationRules()

      // Fallback for users that don't have enabled "On-site" option enabled. Remove in future versions.
      let paymentOption = this.defaultPaymentMethods.find(option => option.value === this.settings.defaultPaymentMethod)
      this.settings.defaultPaymentMethod = paymentOption ? paymentOption.value : this.defaultPaymentMethods[0].value

      // redirected from Square login page
      if (this.openSquareCollapse) {
        this.squareCollapse = 'square'
        this.settings.stripe.enabled = false
        this.settings.wc.enabled = false
        this.settings.razorpay.enabled = false
        this.settings.mollie.enabled = false
        if (this.$refs['square']) {
          this.$refs['square'].$el.scrollIntoView({ behavior: 'smooth' })
        }
      }
      let phpVersion = this.settings.square.phpVersion
      this.squarePhpVersion = phpVersion ? phpVersion.localeCompare('7.4', undefined, { numeric: true, sensitivity: 'base' }) > -1 : true
    },

    methods: {
      languageChanged (selectedLanguage) {
        this.language = selectedLanguage
      },

      closeDialog () {
        this.$emit('closeDialogSettingsPayments')
      },

      logOutFromSquare () {
        this.squareLoading = true
        this.$http.post(
          `${this.$root.getAjaxUrl}/square/disconnect`
        ).then(() => {
          this.settings.square.accessToken = null
          this.squareLoading = false
          this.notify(this.$root.labels.success, this.$root.labels.square_disconnected, 'success')
        }).catch(e => {
          this.notify(this.$root.labels.error, e.message, 'error')
          this.squareLoading = false
        })
      },

      getSquareAuthUrl () {
        this.squareLoading = true
        this.$http.get(`${this.$root.getAjaxUrl}/square/authorization/url`)
          .then(response => {
            window.location.href = response.data.data.authUrl
          })
          .catch(e => {
            this.squareLoading = false
            this.notify(this.$root.labels.error, e.message, 'error')
          })
      },

      changeSquareTestMode () {
        this.squareBtnDisabled = true
        this.$emit('updateSettings', {'payments': this.settings}, null, true, () => {
          this.squareBtnDisabled = false
        })
        if (this.settings.square.accessToken) {
          this.logOutFromSquare()
        }
      },

      onSubmit () {
        let appointmentsStripeMetaData = Object.fromEntries(this.$refs.metaDataAppointments.stripeMetaData.filter(({key, value}) => (key !== '' && value !== '')).map(({ key, value }) => [key, value]))
        let packagesStripeMetaData = this.$root.licence.isPro || this.$root.licence.isDeveloper
          ? Object.fromEntries(this.$refs.metaDataPackages.stripeMetaData.filter(({key, value}) => (key !== '' && value !== '')).map(({ key, value }) => [key, value])) : {}
        let eventsStripeMetaData = Object.fromEntries(this.$refs.metaDataEvents.stripeMetaData.filter(({key, value}) => (key !== '' && value !== '')).map(({ key, value }) => [key, value]))

        let appointmentsMollieMetaData = Object.fromEntries(this.$refs.metaDataAppointments.mollieMetaData.filter(({key, value}) => (key !== '' && value !== '')).map(({ key, value }) => [key, value]))
        let packagesMollieMetaData = this.$root.licence.isPro || this.$root.licence.isDeveloper
          ? Object.fromEntries(this.$refs.metaDataPackages.mollieMetaData.filter(({key, value}) => (key !== '' && value !== '')).map(({ key, value }) => [key, value])) : {}
        let eventsMollieMetaData = Object.fromEntries(this.$refs.metaDataEvents.mollieMetaData.filter(({key, value}) => (key !== '' && value !== '')).map(({ key, value }) => [key, value]))

        let appointmentsRazorpayMetaData = Object.fromEntries(this.$refs.metaDataAppointments.razorpayMetaData.filter(({key, value}) => (key !== '' && value !== '')).map(({ key, value }) => [key, value]))
        let packagesRazorpayMetaData = this.$root.licence.isPro || this.$root.licence.isDeveloper
          ? Object.fromEntries(this.$refs.metaDataPackages.razorpayMetaData.filter(({key, value}) => (key !== '' && value !== '')).map(({ key, value }) => [key, value])) : {}
        let eventsRazorpayMetaData = Object.fromEntries(this.$refs.metaDataEvents.razorpayMetaData.filter(({key, value}) => (key !== '' && value !== '')).map(({ key, value }) => [key, value]))

        this.settings.stripe.metaData.appointment = _.isEmpty(appointmentsStripeMetaData) ? null : appointmentsStripeMetaData
        this.settings.stripe.metaData.package = _.isEmpty(packagesStripeMetaData) ? null : packagesStripeMetaData
        this.settings.stripe.metaData.event = _.isEmpty(eventsStripeMetaData) ? null : eventsStripeMetaData

        this.settings.mollie.metaData.appointment = _.isEmpty(appointmentsMollieMetaData) ? null : appointmentsMollieMetaData
        this.settings.mollie.metaData.package = _.isEmpty(packagesMollieMetaData) ? null : packagesMollieMetaData
        this.settings.mollie.metaData.event = _.isEmpty(eventsMollieMetaData) ? null : eventsMollieMetaData

        this.settings.razorpay.metaData.appointment = _.isEmpty(appointmentsRazorpayMetaData) ? null : appointmentsRazorpayMetaData
        this.settings.razorpay.metaData.package = _.isEmpty(packagesRazorpayMetaData) ? null : packagesRazorpayMetaData
        this.settings.razorpay.metaData.event = _.isEmpty(eventsRazorpayMetaData) ? null : eventsRazorpayMetaData

        if (this.settings.symbol === '') {
          this.settings.symbol = this.currencies.filter(item => item.code === this.settings.currency)[0].symbol
        }

        this.settings.paymentLinks.redirectUrl = this.settings.paymentLinks.redirectUrl ? this.settings.paymentLinks.redirectUrl : this.$root.getSiteUrl

        this.$refs.settings.validate((valid) => {
          if (valid) {
            this.squareError = ''
            if (this.settings.square && this.settings.square.enabled && !this.settings.square.accessToken) {
              this.squareError = this.$root.labels.square_login_error
              this.squareCollapse = 'square'
              return
            }
            if (this.settings.square && this.settings.square.enabled && this.settings.square.accessToken && !this.settings.square.locationId) {
              this.squareError = this.$root.labels.square_location_error
              this.squareCollapse = 'square'
              return
            }
            if (this.settings.square && this.settings.square.enabled && this.settings.square.locationId) {
              let chosenLocation = this.squareLocations.find(s => s.id === this.settings.square.locationId)
              if (chosenLocation && chosenLocation.currency !== this.settings.currency) {
                this.$refs['square'].$el.scrollIntoView({ behavior: 'smooth' })
                this.squareError = this.$root.labels.square_currency_error
                this.squareCollapse = 'square'
                return
              }
            }
            if (!this.settings.stripe.connect.amount) {
              this.settings.stripe.connect.amount = 0
            }
            this.$emit('closeDialogSettingsPayments')
            this.$emit('updateSettings', {'payments': this.settings})
          } else {
            if (this.settings.stripe.enabled) {
              if (!this.settings.stripe.testMode && (this.settings.stripe.livePublishableKey === '' || this.settings.stripe.liveSecretKey === '')) {
                this.stripeCollapse = 'stripe'
              }

              if (this.settings.stripe.testMode && (this.settings.stripe.testPublishableKey === '' || this.settings.stripe.testSecretKey === '')) {
                this.stripeCollapse = 'stripe'
              }
            }

            if (this.settings.mollie.enabled) {
              if (!this.settings.mollie.testMode && this.settings.mollie.liveApiKey === '') {
                this.mollieCollapse = 'mollie'
              }

              if (this.settings.mollie.testMode && this.settings.mollie.testApiKey === '') {
                this.mollieCollapse = 'mollie'
              }
            }

            if (this.settings.payPal.enabled) {
              if (!this.settings.payPal.sandboxMode && (this.settings.payPal.liveApiClientId === '' || this.settings.payPal.liveApiSecret === '')) {
                this.payPalCollapse = 'payPal'
              }

              if (this.settings.payPal.sandboxMode && (this.settings.payPal.testApiClientId === '' || this.settings.payPal.testApiSecret === '')) {
                this.payPalCollapse = 'payPal'
              }
            }

            if (this.settings.razorpay.enabled) {
              if (!this.settings.razorpay.sandboxMode && (this.settings.razorpay.liveApiClientId === '' || this.settings.razorpay.liveApiSecret === '')) {
                this.razorpayCollapse = 'razorpay'
              }

              if (this.settings.razorpay.sandboxMode && (this.settings.razorpay.testApiClientId === '' || this.settings.razorpay.testApiSecret === '')) {
                this.razorpayCollapse = 'razorpay'
              }
            }

            return false
          }
        })
      },

      checkOnSitePayment () {
        if (this.settings.razorpay.enabled === false && this.settings.mollie.enabled === false && this.settings.square.enabled === false && this.settings.payPal.enabled === false && this.settings.stripe.enabled === false && this.settings.wc.enabled === false) {
          this.settings.onSite = true
        }
      },

      toggleOnSite () {
        this.clearValidation()
        if (this.settings.defaultPaymentMethod === 'onSite' && this.settings.onSite === false) {
          this.settings.defaultPaymentMethod = this.defaultPaymentMethods[0].value
        }
      },

      isStripeDisabled() {
        return this.settings.wc.enabled || this.settings.mollie.enabled || this.settings.square.enabled
      },

      toggleStripe () {
        this.checkOnSitePayment()
        this.handleStripeValidationRules()

        if (this.settings.stripe.enabled === false) {
          this.stripeCollapse = ''
        }

        if (this.settings.defaultPaymentMethod === 'stripe' && this.settings.stripe.enabled === false) {
          this.settings.defaultPaymentMethod = this.defaultPaymentMethods[0].value
        }
      },

      togglePayPal () {
        this.checkOnSitePayment()
        this.handlePayPalValidationRules()
        this.handleMollieValidationRules()

        if (this.settings.payPal.enabled === false) {
          this.payPalCollapse = ''
        }

        if (this.settings.defaultPaymentMethod === 'payPal' && this.settings.payPal.enabled === false) {
          this.settings.defaultPaymentMethod = this.defaultPaymentMethods[0].value
        }
      },

      toggleWooCommerce () {
        if (!this.settings.wc.enabled) {
          this.settings.onSite = true
        }
        this.settings.stripe.enabled = false
        this.settings.payPal.enabled = false
        this.settings.mollie.enabled = false
        this.settings.razorpay.enabled = false
        this.settings.square.enabled = false
        if (this.settings.defaultPaymentMethod === 'wc' && this.settings.wc.enabled === false) {
          this.settings.defaultPaymentMethod = this.defaultPaymentMethods[0].value
        }
      },

      toggleMollie () {
        this.settings.stripe.enabled = false
        this.settings.payPal.enabled = false
        this.settings.wc.enabled = false
        this.settings.razorpay.enabled = false
        this.settings.square.enabled = false

        if (!this.settings.mollie.enabled && !this.settings.square.enabled) {
          this.settings.onSite = true
        }

        if (this.settings.defaultPaymentMethod === 'mollie' && this.settings.mollie.enabled === false) {
          this.settings.defaultPaymentMethod = this.defaultPaymentMethods[0].value
        }
      },

      toggleSquare () {
        if (this.settings.square.enabled === false) {
          this.squareError = ''
        }

        this.settings.stripe.enabled = false
        this.settings.wc.enabled = false
        this.settings.razorpay.enabled = false
        this.settings.mollie.enabled = false

        this.checkOnSitePayment()

        if (this.settings.defaultPaymentMethod === 'square' && this.settings.square.enabled === false) {
          this.settings.defaultPaymentMethod = this.defaultPaymentMethods[0].value
        }
      },

      toggleRazorpay () {
        this.checkOnSitePayment()
        this.handleRazorpayValidationRules()
        this.handleMollieValidationRules()

        if (this.settings.razorpay.enabled === false) {
          this.razorpayCollapse = ''
        }

        if (this.settings.defaultPaymentMethod === 'razorpay' && this.settings.razorpay.enabled === false) {
          this.settings.defaultPaymentMethod = this.defaultPaymentMethods[0].value
        }
      },

      handleStripeValidationRules () {
        this.clearValidation()
        if (this.settings.stripe.enabled === true) {
          if (this.settings.stripe.testMode === true) {
            this.rules.stripe = {
              testPublishableKey: [
                {required: true, message: this.$root.labels.stripe_test_publishable_key_error, trigger: 'submit'}
              ],
              testSecretKey: [
                {required: true, message: this.$root.labels.stripe_test_secret_key_error, trigger: 'submit'}
              ]
            }
          } else {
            this.rules.stripe = {
              livePublishableKey: [
                {required: true, message: this.$root.labels.stripe_live_publishable_key_error, trigger: 'submit'}
              ],
              liveSecretKey: [
                {required: true, message: this.$root.labels.stripe_live_secret_key_error, trigger: 'submit'}
              ]
            }
          }
        } else {
          this.rules.stripe = {}
        }
      },

      handlePayPalValidationRules () {
        this.clearValidation()
        if (this.settings.payPal.enabled === true) {
          if (this.settings.payPal.sandboxMode === true) {
            this.rules.payPal = {
              testApiClientId: [
                {required: true, message: this.$root.labels.payPal_test_client_id_error, trigger: 'submit'}
              ],
              testApiSecret: [
                {required: true, message: this.$root.labels.payPal_test_secret_error, trigger: 'submit'}
              ]
            }
          } else {
            this.rules.payPal = {
              liveApiClientId: [
                {required: true, message: this.$root.labels.payPal_live_client_id_error, trigger: 'submit'}
              ],
              liveApiSecret: [
                {required: true, message: this.$root.labels.payPal_live_secret_error, trigger: 'submit'}
              ]
            }
          }
        } else {
          this.rules.payPal = {}
        }
      },

      handleMollieValidationRules () {
        this.clearValidation()
        if (this.settings.mollie.enabled === true) {
          if (this.settings.mollie.testMode === true) {
            this.rules.mollie = {
              testApiKey: [
                {required: true, message: this.$root.labels.mollie_test_api_key_error, trigger: 'submit'}
              ]
            }
          } else {
            this.rules.mollie = {
              liveApiKey: [
                {required: true, message: this.$root.labels.mollie_live_api_key_error, trigger: 'submit'}
              ]
            }
          }
        } else {
          this.rules.mollie = {}
        }
      },

      handleRazorpayValidationRules () {
        this.clearValidation()
        if (this.settings.razorpay.enabled === true) {
          if (this.settings.razorpay.testMode === true) {
            this.rules.razorpay = {
              testKeyId: [
                {required: true, message: this.$root.labels.razorpay_test_client_id_error, trigger: 'submit'}
              ],
              testKeySecret: [
                {required: true, message: this.$root.labels.razorpay_test_secret_error, trigger: 'submit'}
              ]
            }
          } else {
            this.rules.razorpay = {
              liveKeyId: [
                {required: true, message: this.$root.labels.razorpay_live_client_id_error, trigger: 'submit'}
              ],
              liveKeySecret: [
                {required: true, message: this.$root.labels.razorpay_live_secret_error, trigger: 'submit'}
              ]
            }
          }
        } else {
          this.rules.razorpay = {}
        }
      },

      clearValidation () {
        if (typeof this.$refs.settings !== 'undefined') {
          this.$refs.settings.clearValidate()
        }
      }
    },

    computed: {
      showStripeAlert () {
        return location.protocol !== 'https:'
      },

      defaultPaymentMethods () {
        let methods = []

        if (this.settings.onSite) {
          methods.push({
            label: this.$root.labels.on_site,
            value: 'onSite'
          })
        }

        if (this.settings.payPal.enabled) {
          methods.push({
            label: this.$root.labels.payPal,
            value: 'payPal'
          })
        }

        if (this.settings.stripe.enabled) {
          methods.push({
            label: this.$root.labels.stripe,
            value: 'stripe'
          })
        }

        if (this.settings.wc.enabled) {
          methods.push({
            label: this.$root.labels.wc_name,
            value: 'wc'
          })
        }

        if (this.settings.mollie.enabled) {
          methods.push({
            label: this.$root.labels.mollie,
            value: 'mollie'
          })
        }

        if (this.settings.razorpay.enabled) {
          methods.push({
            label: this.$root.labels.razorpay,
            value: 'razorpay'
          })
        }

        if (this.settings.square.enabled) {
          methods.push({
            label: this.$root.labels.square,
            value: 'square'
          })
        }

        return methods
      }
    },

    watch: {
      'settings.currency' () {
        this.settings.symbol = this.currencies.find(currency => currency.code === this.settings.currency).symbol
      }
    },

    components: {
      PaymentsMetaData,
      SelectTranslate,
      Extensions
    }

  }
</script>
