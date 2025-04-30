<template>
  <div class="am-entity-settings">

    <el-collapse :class="licenceClass()" v-model="generalSettingsCollapse" v-if="generalSettings !== null">
      <el-collapse-item :disabled="notInLicence()" class="am-setting-box" name="generalSettings">
        <template slot="title">
          <img :src="$root.getUrl + 'public/img/setting.svg'" class="svg-amelia" style="margin-right: 10px;"/> {{ $root.labels.general }}
        </template>

        <el-form-item label="placeholder" v-if="generalSettings !== null && 'defaultAppointmentStatus' in generalSettings">
          <label slot="label">
            {{ $root.labels.default_appointment_status }}:
            <el-tooltip placement="top">
              <div slot="content" v-html="$root.labels.default_appointment_status"></div>
              <i class="el-icon-question am-tooltip-icon"></i>
            </el-tooltip>
          </label>
          <el-select
            v-model="generalSettings.defaultAppointmentStatus"
            clearable
            :placeholder="options.defaultAppointmentStatus.find(item => item.value === $root.settings.general.defaultAppointmentStatus).label"
            :popper-class="'am-dropdown-cabinet'"
          >
            <el-option
              v-for="item in options.defaultAppointmentStatus"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>

        <!-- Minimum Time Prior to Booking -->
        <el-form-item label="placeholder" v-if="generalSettings !== null && 'minimumTimeRequirementPriorToBooking' in generalSettings">
          <label slot="label">
            {{ $root.labels.minimum_time_before_booking }}:
            <el-tooltip placement="top">
              <div slot="content" v-html="$root.labels.minimum_time_before_booking_tooltip"></div>
              <i class="el-icon-question am-tooltip-icon"></i>
            </el-tooltip>
          </label>
          <el-select
            v-model="generalSettings.minimumTimeRequirementPriorToBooking"
            clearable
            collapse-tags placeholder="Select"
            :placeholder="options.minimumTime.find(item => item.value === $root.settings.general.minimumTimeRequirementPriorToBooking).label"
            :popper-class="'am-dropdown-cabinet'"
          >
            <el-option
              v-for="item in options.minimumTime"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>

        <!-- Minimum Time Prior to Canceling -->
        <el-form-item label="placeholder" v-if="generalSettings !== null && 'minimumTimeRequirementPriorToCanceling' in generalSettings">
          <label slot="label">
            {{ $root.labels.minimum_time_before_canceling }}:
            <el-tooltip placement="top">
              <div slot="content" v-html="$root.labels.minimum_time_before_canceling_tooltip"></div>
              <i class="el-icon-question am-tooltip-icon"></i>
            </el-tooltip>
          </label>
          <el-select
            v-model="generalSettings.minimumTimeRequirementPriorToCanceling"
            clearable
            :placeholder="options.minimumTime.find(item => item.value === $root.settings.general.minimumTimeRequirementPriorToCanceling).label"
            :popper-class="'am-dropdown-cabinet'"
          >
            <el-option
              v-for="item in options.minimumTime"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>

        <!-- Minimum Time Prior to Rescheduling -->
        <el-form-item label="placeholder" v-if="generalSettings !== null && 'minimumTimeRequirementPriorToRescheduling' in generalSettings">
          <label slot="label">
            {{ $root.labels.minimum_time_before_rescheduling }}:
            <el-tooltip placement="top">
              <div slot="content" v-html="$root.labels.minimum_time_before_rescheduling_tooltip"></div>
              <i class="el-icon-question am-tooltip-icon"></i>
            </el-tooltip>
          </label>
          <el-select
            v-model="generalSettings.minimumTimeRequirementPriorToRescheduling"
            clearable
            :placeholder="options.minimumTime.find(item => item.value === $root.settings.general.minimumTimeRequirementPriorToRescheduling).label"
            :popper-class="'am-dropdown-cabinet'"
          >
            <el-option
              v-for="item in options.minimumTime"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>

        <!-- Number of days available for booking -->
        <el-form-item label="placeholder" v-if="generalSettings !== null && 'numberOfDaysAvailableForBooking' in generalSettings">
          <label slot="label">
            {{ $root.labels.period_available_for_booking }}:
            <el-tooltip placement="top">
              <div slot="content" v-html="$root.labels.period_available_for_booking_tooltip"></div>
              <i class="el-icon-question am-tooltip-icon"></i>
            </el-tooltip>
          </label>
          <el-input-number
            class="am-number-of-days"
            v-model="generalSettings.numberOfDaysAvailableForBooking"
            :min="0"
            :placeholder="$root.settings.general.numberOfDaysAvailableForBooking.toString()"
          >
          </el-input-number>
        </el-form-item>

        <!-- Redirect URL after appointment -->
        <el-form-item label="placeholder" prop="redirectURLAfter" :error="errors.redirectURLAfter" v-if="generalSettings !== null && 'redirectUrlAfterAppointment' in generalSettings">
          <label slot="label">
            {{ $root.labels.redirect_url_after_appointment }}:
            <el-tooltip placement="top">
              <div
                slot="content"
                v-html="($root.licence.isPro || $root.licence.isDeveloper) ? $root.labels.redirect_url_after_app_or_package_tt :
              $root.labels.redirect_url_after_appointment_tooltip"
              >
              </div>
              <i class="el-icon-question am-tooltip-icon"></i>
            </el-tooltip>
          </label>
          <el-input
            v-model="generalSettings.redirectUrlAfterAppointment"
            @input="clearValidation()"
            auto-complete="off"
            :placeholder="$root.settings.general.redirectUrlAfterAppointment.toString()"
          >
          </el-input>
        </el-form-item>

      </el-collapse-item>

      <LicenceBlock/>
    </el-collapse>


    <el-collapse :class="licenceClass('starter')" v-model="paymentsSettingsCollapse" v-if="paymentsSettings !== null" class="am-entity-settings-payments">
      <el-collapse-item :disabled="notInLicence('starter')" class="am-setting-box" name="paymentsSettings">
        <!-- Title -->
        <template slot="title">
          <img :src="$root.getUrl+'public/img/credit-card.svg'" class="svg-amelia" style="margin-right: 10px;"/> {{ $root.labels.payments }}
        </template>

        <!-- Payment Links -->
        <div class="am-setting-box am-switch-box"
             v-if="notInLicence('basic') ? licenceVisible() : true"
             :class="licenceClass('basic')">

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
                v-model="paymentsSettings.paymentLinks.enabled"
                :disabled="notInLicence()"
              ></el-switch>
            </el-col>
          </el-row>

          <el-row style="margin-top: 16px" v-if="paymentsSettings.paymentLinks.enabled">
            <el-col>
              <!-- Redirect URL after payment -->
              <el-form-item label="placeholder">
                <label slot="label" style="font-size: 13px;">
                  {{ $root.labels.payment_links_redirect }}:
                  <el-tooltip placement="top">
                    <div slot="content" v-html="$root.labels.payment_links_redirect_tooltip"></div>
                    <i class="el-icon-question am-tooltip-icon"></i>
                  </el-tooltip>
                </label>
                <el-input
                  v-model="paymentsSettings.paymentLinks.redirectUrl"
                  :placeholder="$root.settings.payments.paymentLinks.redirectUrl ? $root.settings.payments.paymentLinks.redirectUrl : $root.getSiteUrl"
                  auto-complete="off"
                >
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row type="flex" align="middle" :gutter="24" v-if="isDefaultStatusPending()" style="font-size: 14px; margin-bottom: 16px !important;">
            <el-col :span="16">
              <span>{{ $root.labels.payment_links_change_status }}</span>
              <el-tooltip placement="top">
                <div slot="content" v-html="$root.labels.payment_links_change_status_tooltip"></div>
                <i class="el-icon-question am-tooltip-icon"></i>
              </el-tooltip>
            </el-col>
            <el-col :span="8" class="align-right">
              <el-switch
                v-model="paymentsSettings.paymentLinks.changeBookingStatus"
              ></el-switch>
            </el-col>
          </el-row>

          <el-alert
            style="margin-bottom: 5px"
            v-if="paymentsSettings.paymentLinks.enabled && $root.settings.role !== 'provider'"
            type="warning"
            show-icon
            title=""
            :description="$root.labels.payment_links_warning"
            :closable="false"
          >
          </el-alert>

          <LicenceBlock/>
        </div>

        <!-- Service Paid On-site -->
        <div class="am-setting-box am-switch-box" v-if="$root.settings.payments.onSite">
          <el-row type="flex" align="middle" :gutter="24">
            <el-col :span="16">
              {{ $root.labels.on_site }}
            </el-col>
            <el-col :span="8" class="align-right">
              <el-switch
                v-model="paymentsSettings.onSite"
                active-text=""
                inactive-text=""
              >
              </el-switch>
            </el-col>
          </el-row>
        </div>

        <el-col :span="24" v-if="$root.settings.payments.wc.enabled">
          <div class="am-setting-box am-switch-box" v-if="$root.settings.payments.onSite">
            <el-row type="flex" align="middle" :gutter="24">
              <el-col :span="16">
                {{ $root.labels.wc_service }}
              </el-col>
              <el-col :span="8" class="align-right">
                <el-switch
                    v-model="paymentsSettings.wc.enabled"
                    active-text=""
                    inactive-text=""
                >
                </el-switch>
              </el-col>
            </el-row>
          </div>
          <el-form-item label="placeholder" v-if="paymentsSettings.wc.enabled">
            <label slot="label">
              {{ $root.labels.wc_product }}:
              <el-tooltip placement="top">
                <div slot="content" v-html="$root.labels.wc_product_tooltip"></div>
                <i class="el-icon-question am-tooltip-icon"></i>
              </el-tooltip>
            </label>
            <el-select
              v-model="paymentsSettings.wc.productId"
              filterable
              remote
              placeholder=""
              :popper-class="'am-dropdown-cabinet'"
              :loading="loadingProducts"
              :remote-method="searchProducts"
              @change="selectedProduct"
            >
              <el-option
                v-for="item in products"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <!-- Service Paid PayPal -->
        <div class="am-setting-box am-switch-box" v-if="$root.settings.payments.payPal.enabled">
          <el-row type="flex" align="middle" :gutter="24">
            <el-col :span="16">
              <img class="svg-amelia" width="60px" :src="$root.getUrl + 'public/img/payments/paypal-light.svg'">
            </el-col>
            <el-col :span="8" class="align-right">
              <el-switch
                v-model="paymentsSettings.payPal.enabled"
                active-text=""
                inactive-text=""
              >
              </el-switch>
            </el-col>
          </el-row>
        </div>

        <!-- Service Paid Stripe -->
        <div class="am-setting-box am-switch-box" v-if="$root.settings.payments.stripe.enabled">
          <el-row type="flex" align="middle" :gutter="24">
            <el-col :span="16">
              <img class="svg-amelia" width="40px" :src="$root.getUrl + 'public/img/payments/stripe.svg'">
            </el-col>
            <el-col :span="8" class="align-right">
              <el-switch
                v-model="paymentsSettings.stripe.enabled"
                active-text=""
                inactive-text=""
              >
              </el-switch>
            </el-col>
          </el-row>
        </div>

        <!-- Service Paid Mollie -->
        <div class="am-setting-box am-switch-box" v-if="$root.settings.payments.mollie.enabled">
          <el-row type="flex" align="middle" :gutter="24">
            <el-col :span="16">
              <img class="svg-amelia" width="60px" :src="$root.getUrl + 'public/img/payments/mollie.svg'">
            </el-col>
            <el-col :span="8" class="align-right">
              <el-switch
                v-model="paymentsSettings.mollie.enabled"
                active-text=""
                inactive-text=""
              >
              </el-switch>
            </el-col>
          </el-row>
        </div>

        <!-- Service Paid Square -->
        <div class="am-setting-box am-switch-box" v-if="$root.settings.payments.square.enabled">
          <el-row type="flex" align="middle" :gutter="24">
            <el-col :span="16">
              <img class="svg-amelia" width="60px" :src="$root.getUrl + 'public/img/payments/square.svg'">
            </el-col>
            <el-col :span="8" class="align-right">
              <el-switch
                  v-model="paymentsSettings.square.enabled"
                  active-text=""
                  inactive-text=""
              >
              </el-switch>
            </el-col>
          </el-row>
        </div>

        <!-- Service Paid Razorpay -->
        <div class="am-setting-box am-switch-box" v-if="$root.settings.payments.razorpay.enabled">
          <el-row type="flex" align="middle" :gutter="24">
            <el-col :span="16">
              <img class="svg-amelia" width="60px" :src="$root.getUrl + 'public/img/payments/razorpay.svg'">
            </el-col>
            <el-col :span="8" class="align-right">
              <el-switch
                  v-model="paymentsSettings.razorpay.enabled"
                  active-text=""
                  inactive-text=""
              >
              </el-switch>
            </el-col>
          </el-row>
        </div>

        <el-alert
          v-if="(!paymentsSettings.wc.enabled || (!$root.settings.payments.wc.enabled && paymentsSettings.wc.enabled)) &&
          (!paymentsSettings.onSite || (!$root.settings.payments.onSite && paymentsSettings.onSite)) &&
          (!paymentsSettings.payPal.enabled || (!$root.settings.payments.payPal.enabled && paymentsSettings.payPal.enabled)) &&
          (!paymentsSettings.stripe.enabled || (!$root.settings.payments.stripe.enabled && paymentsSettings.stripe.enabled)) &&
          (!paymentsSettings.mollie.enabled || (!$root.settings.payments.mollie.enabled && paymentsSettings.mollie.enabled)) &&
          (!paymentsSettings.square.enabled || (!$root.settings.payments.square.enabled && paymentsSettings.square.enabled)) &&
          (!paymentsSettings.razorpay.enabled || (!$root.settings.payments.razorpay.enabled && paymentsSettings.razorpay.enabled))"
          type="warning"
          show-icon
          title=""
          :description="$root.labels.payment_warning"
          :closable="false"
        >
        </el-alert>

      </el-collapse-item>

      <LicenceBlock :licence="'starter'"/>
    </el-collapse>


    <el-collapse :class="licenceClass()" v-model="integrationsSettingsCollapse" v-if="zoomSettings || lessonSpaceSettings || googleMeetSettings || microsoftTeamsSettings">
      <el-collapse-item :disabled="notInLicence()" class="am-setting-box" name="integrationsSettings">
        <!-- Title -->
        <template slot="title">
          <img :src="$root.getUrl+'public/img/web-hook.svg'" class="svg-amelia" style="margin-right: 10px;"/> {{ $root.labels.integrations_settings }}
        </template>

        <!-- Zoom -->
        <div class="am-setting-box am-switch-box" v-if="zoomSettings">
          <el-row type="flex" align="middle" :gutter="24">
            <el-col :span="16">
              {{ $root.labels.zoom }}
            </el-col>
            <el-col :span="8" class="align-right">
              <el-switch
                v-model="zoomSettings.enabled"
                active-text=""
                inactive-text=""
              >
              </el-switch>
            </el-col>
          </el-row>
        </div>

        <el-alert
          v-if="zoomSettings && zoomSettings.enabled && !isZoomProvidersConnected"
          type="warning"
          show-icon
          title=""
          :description="$root.labels.zoom_warning"
          :closable="false"
        >
        </el-alert>

        <!-- Google meet -->
        <div class="am-setting-box am-switch-box" v-if="googleMeetSettings">
          <el-row type="flex" align="middle" :gutter="24">
            <el-col :span="16">
              {{ $root.labels.enable_google_meet }}
            </el-col>
            <el-col :span="8" class="align-right">
              <el-switch
                  v-model="googleMeetSettings.enabled"
                  active-text=""
                  inactive-text=""
              >
              </el-switch>
            </el-col>
          </el-row>
        </div>

        <!-- Microsoft Teams -->
        <div class="am-setting-box am-switch-box" v-if="microsoftTeamsSettings">
          <el-row type="flex" align="middle" :gutter="24">
            <el-col :span="16">
              {{ $root.labels.enable_microsoft_teams }}
            </el-col>
            <el-col :span="8" class="align-right">
              <el-switch
                  v-model="microsoftTeamsSettings.enabled"
                  active-text=""
                  inactive-text=""
              >
              </el-switch>
            </el-col>
          </el-row>
        </div>

        <!-- Lesson Space -->
        <div class="am-setting-box am-switch-box" v-if="lessonSpaceSettings">
          <el-row type="flex" align="middle" :gutter="24">
            <el-col :span="16">
              {{ $root.labels.lesson_space }}
            </el-col>
            <el-col :span="8" class="align-right">
              <el-switch
                v-model="lessonSpaceSettings.enabled"
                active-text=""
                inactive-text=""
              >
              </el-switch>
            </el-col>
          </el-row>
        </div>

      </el-collapse-item>

      <LicenceBlock/>
    </el-collapse>

  </div>
</template>

<script>
  import licenceMixin from '../../../js/common/mixins/licenceMixin'
  export default {

    props: {
      zoomSettings: null,
      lessonSpaceSettings: null,
      googleMeetSettings: null,
      microsoftTeamsSettings: null,
      paymentsSettings: null,
      generalSettings: null,
      settings: null,
      providers: null
    },

    mixins: [licenceMixin],

    data () {
      let validateRedirectURL = (rule, input, callback) => {
        this.clearValidation()
        let currentURL = this.$refs.settings.model.redirectUrlAfterAppointment
        let regex = /^((http|https):\/\/)/
        if (currentURL !== '' && !regex.test(currentURL)) {
          callback(new Error(this.$root.labels.enter_valid_url_warning))
        } else {
          callback()
        }
      }
      return {
        products: [],
        searchCounter: 0,
        loadingProducts: false,
        integrationsSettingsCollapse: null,
        paymentsSettingsCollapse: null,
        generalSettingsCollapse: null,
        rules: {
          'redirectURLAfter': [
            {validator: validateRedirectURL, trigger: 'submit'}
          ]
        },
        errors: {
          redirectURLAfter: ''
        },
        options: {
          defaultAppointmentStatus: [
            {
              label: this.$root.labels.pending,
              value: 'pending'
            },
            {
              label: this.$root.labels.approved,
              value: 'approved'
            }
          ],
          minimumTime: [
            {
              label: this.$root.labels.disabled,
              value: 0
            },
            {
              label: this.$root.labels.min10,
              value: 600
            },
            {
              label: this.$root.labels.min12,
              value: 720
            },
            {
              label: this.$root.labels.min15,
              value: 900
            },
            {
              label: this.$root.labels.min30,
              value: 1800
            },
            {
              label: this.$root.labels.min45,
              value: 2700
            },
            {
              label: this.$root.labels.h1,
              value: 3600
            },
            {
              label: this.$root.labels.h1min30,
              value: 5400
            },
            {
              label: this.$root.labels.h2,
              value: 7200
            },
            {
              label: this.$root.labels.h3,
              value: 10800
            },
            {
              label: this.$root.labels.h4,
              value: 14400
            },
            {
              label: this.$root.labels.h6,
              value: 21600
            },
            {
              label: this.$root.labels.h8,
              value: 28800
            },
            {
              label: this.$root.labels.h9,
              value: 32400
            },
            {
              label: this.$root.labels.h10,
              value: 36000
            },
            {
              label: this.$root.labels.h11,
              value: 39600
            },
            {
              label: this.$root.labels.h12,
              value: 43200
            },
            {
              label: this.$root.labels.day1,
              value: 86400
            },
            {
              label: this.$root.labels.days2,
              value: 172800
            },
            {
              label: this.$root.labels.days3,
              value: 259200
            },
            {
              label: this.$root.labels.days4,
              value: 345600
            },
            {
              label: this.$root.labels.days5,
              value: 432000
            },
            {
              label: this.$root.labels.days6,
              value: 518400
            },
            {
              label: this.$root.labels.week1,
              value: 604800
            },
            {
              label: this.$root.labels.weeks2,
              value: 1209600
            },
            {
              label: this.$root.labels.weeks3,
              value: 1814400
            },
            {
              label: this.$root.labels.weeks4,
              value: 2419200
            },
            {
              label: this.$root.labels.months3,
              value: 7884000
            },
            {
              label: this.$root.labels.months6,
              value: 15768000
            }
          ]
        }
      }
    },

    mounted () {
      this.setProducts()

      if (this.generalSettings !== null && 'numberOfDaysAvailableForBooking' in this.generalSettings && !this.generalSettings.numberOfDaysAvailableForBooking) {
        let elements = document.getElementsByClassName('am-number-of-days')

        for (let i = 0; i < elements.length; i++) {
          elements[i].getElementsByClassName('el-input__inner')[0].value = ''
        }
      }
    },

    computed: {
      isZoomProvidersConnected () {
        if (this.providers !== null) {
          return !this.providers.map(provider => provider.zoomUserId).includes(null) && this.providers.length !== 0
        }
        return false
      }
    },

    methods: {
      isDefaultStatusPending () {
        return this.paymentsSettings.paymentLinks.enabled && this.generalSettings &&
          (this.generalSettings.defaultAppointmentStatus === 'pending' || this.generalSettings.defaultAppointmentStatus === null && this.$root.settings.general.defaultAppointmentStatus === 'pending')
      },

      setProducts () {
        if (this.$root.settings.payments.wc.enabled) {
          if (this.$root.settings.payments.wc.enabled &&
              this.paymentsSettings.wc.productId &&
              this.$root.wcProducts.filter(product => product.id === this.paymentsSettings.wc.productId).length === 0
          ) {
            this.fetchProducts(
              {id: this.paymentsSettings.wc.productId},
              (products) => {
                if (products.length) {
                  this.products.push(products[0])
                }
              }
            )
          }

          this.products = this.$root.wcProducts
        }
      },

      selectedProduct (productId) {
        if (this.$root.wcProducts.filter(product => product.id === productId).length === 0) {
          let product = this.products.find(product => product.id === productId)

          if (product) {
            this.$root.wcProducts.push(product)
          }
        }
      },

      fetchProducts (params, callbackMethod) {
        clearTimeout(this.searchProductsTimer)

        this.loadingProducts = true
        this.searchCounter++

        this.searchProductsTimer = setTimeout(() => {
          let lastSearchCounter = this.searchCounter

          this.$http.get(`${this.$root.getAjaxUrl}/payment/wc/products`, {
            params: params
          })
            .then(response => {
              if (lastSearchCounter >= this.searchCounter) {
                callbackMethod(response.data.data.products.sort((a, b) => (a.name.toLowerCase() > b.name.toLowerCase()) ? 1 : -1))
              }

              this.loadingProducts = false
            })
            .catch(e => {
              this.loadingProducts = false
            })
        },
        500
        )
      },

      searchProducts (query) {
        if (query) {
          this.fetchProducts(
            {name: query},
            (products) => {
              this.products = products
            }
          )
        } else {
          this.products = this.$root.wcProducts
        }
      },

      clearValidation () {
      }
    }

  }
</script>
