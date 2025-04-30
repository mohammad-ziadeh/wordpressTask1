<template>
  <div>
    <div class="am-dialog-scrollable">

      <!-- Dialog Header -->
      <div class="am-dialog-header">
        <el-row>
          <el-col :span="20">
            <h2>{{ $root.labels.general_settings }}</h2>
          </el-col>
          <el-col :span="4" class="align-right">
            <el-button @click="closeDialog" class="am-dialog-close" size="small" icon="el-icon-close"></el-button>
          </el-col>
        </el-row>
      </div>

      <!-- Form -->
      <el-form :model="settings" ref="settings" :rules="rules" label-position="top" @submit.prevent="onSubmit">

        <el-row :gutter="24">

          <!-- Time Slot -->
          <el-col :span="12">
            <el-form-item label="placeholder">
              <label slot="label">
                {{ $root.labels.default_time_slot_step }}:
                <el-tooltip placement="top">
                  <div slot="content" v-html="$root.labels.default_time_slot_step_tooltip"></div>
                  <i class="el-icon-question am-tooltip-icon"></i>
                </el-tooltip>
              </label>
              <el-select v-model="settings.timeSlotLength">
                <el-option
                    v-for="item in options.timeSlotLength"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <!-- Appointment Status -->
          <el-col :span="12">
            <el-form-item label="placeholder">
              <label slot="label">
                {{ $root.labels.default_appointment_status }}:
                <el-tooltip placement="top">
                  <div slot="content" v-html="$root.labels.default_appointment_status_tooltip"></div>
                  <i class="el-icon-question am-tooltip-icon"></i>
                </el-tooltip>
              </label>
              <el-select v-model="settings.defaultAppointmentStatus">
                <el-option
                    v-for="item in options.defaultAppointmentStatus"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>

        </el-row>

        <!-- Use Service Duration As Booking Time Slot -->
        <div :class="licenceClass('starter')" class="am-setting-box am-switch-box">
          <el-row type="flex" align="middle" :gutter="24">
            <el-col :span="16">
              {{ $root.labels.service_duration_as_slot }}
              <el-tooltip placement="top">
                <div slot="content" v-html="$root.labels.service_duration_as_slot_tooltip"></div>
                <i class="el-icon-question am-tooltip-icon"></i>
              </el-tooltip>
            </el-col>
            <el-col :span="8" class="align-right">
              <el-switch
                  v-model="settings.serviceDurationAsSlot"
                  :disabled="notInLicence('starter')"
                  active-text=""
                  inactive-text=""
              ></el-switch>
            </el-col>
          </el-row>

          <LicenceBlock :licence="'starter'"/>
        </div>

        <!-- Include Buffer Time In Time Slot -->
        <div :class="licenceClass('starter')" class="am-setting-box am-switch-box">
          <el-row type="flex" align="middle" :gutter="24">
            <el-col :span="16">
              {{ $root.labels.buffer_time_in_slot }}
              <el-tooltip placement="top">
                <div slot="content" v-html="$root.labels.buffer_time_in_slot_tooltip"></div>
                <i class="el-icon-question am-tooltip-icon"></i>
              </el-tooltip>
            </el-col>
            <el-col :span="8" class="align-right">
              <el-switch
                v-model="settings.bufferTimeInSlot"
                :disabled="notInLicence('starter')"
                active-text=""
                inactive-text=""
              ></el-switch>
            </el-col>
          </el-row>

          <LicenceBlock :licence="'starter'"/>
        </div>

        <!-- Minimum Time Prior to Booking -->
        <el-form-item :class="licenceClass('starter')" label="placeholder">
          <label slot="label">
            {{ $root.labels.minimum_time_before_booking }}:
            <el-tooltip placement="top">
              <div slot="content" v-html="$root.labels.minimum_time_before_booking_tooltip"></div>
              <i class="el-icon-question am-tooltip-icon"></i>
            </el-tooltip>
          </label>
          <el-select
            v-model="settings.minimumTimeRequirementPriorToBooking"
            :disabled="notInLicence('starter')"
          >
            <el-option
                v-for="item in options.minimumTime"
                :key="item.value"
                :label="item.label"
                :value="item.value">
            </el-option>
          </el-select>

          <LicenceBlock :licence="'starter'"/>
        </el-form-item>

        <!-- Minimum Time Prior to Canceling -->
        <el-form-item :class="licenceClass('starter')" label="placeholder">
          <label slot="label">
            {{ $root.labels.minimum_time_before_canceling }}:
            <el-tooltip placement="top">
              <div slot="content" v-html="$root.labels.minimum_time_before_canceling_tooltip"></div>
              <i class="el-icon-question am-tooltip-icon"></i>
            </el-tooltip>
          </label>
          <el-select
            v-model="settings.minimumTimeRequirementPriorToCanceling"
            :disabled="notInLicence('starter')"
          >
            <el-option
                v-for="item in options.minimumTime"
                :key="item.value"
                :label="item.label"
                :value="item.value">
            </el-option>
          </el-select>

          <LicenceBlock :licence="'starter'"/>
        </el-form-item>

        <!-- Minimum Time Prior to Rescheduling -->
        <el-form-item :class="licenceClass('starter')" label="placeholder">
          <label slot="label">
            {{ $root.labels.minimum_time_before_rescheduling }}:
            <el-tooltip placement="top">
              <div slot="content" v-html="$root.labels.minimum_time_before_rescheduling_tooltip"></div>
              <i class="el-icon-question am-tooltip-icon"></i>
            </el-tooltip>
          </label>
          <el-select
            v-model="settings.minimumTimeRequirementPriorToRescheduling"
            :disabled="notInLicence('starter')"
          >
            <el-option
              v-for="item in options.minimumTime"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>

          <LicenceBlock :licence="'starter'"/>
        </el-form-item>

        <!-- Number of days available for booking -->
        <el-form-item label="placeholder">
          <label slot="label">
            {{ $root.labels.period_available_for_booking }}:
            <el-tooltip placement="top">
              <div slot="content" v-html="$root.labels.period_available_for_booking_tooltip"></div>
              <i class="el-icon-question am-tooltip-icon"></i>
            </el-tooltip>
          </label>
          <el-input-number
              :value="settings.numberOfDaysAvailableForBooking"
              :min="1"
              @change="changeNumberOfDaysAvailableForBooking"
          >
          </el-input-number>
        </el-form-item>

        <!-- Phone default country code -->
        <el-form-item :label="$root.labels.default_phone_country_code+':'">
          <el-select v-model="settings.phoneDefaultCountryCode" placeholder=""
                     :class="'am-selected-flag am-selected-flag-'+settings.phoneDefaultCountryCode">
            <el-option
                v-for="country in countries"
                :key="country.id"
                :value="country.iso"
                :label="country.nicename"
            >
              <span :class="'am-flag am-flag-'+country.iso"></span>
              <span style="float: left">{{ country.nicename }}</span>
              <span style="float: right; color: #7F8BA4; font-size: 13px">{{ country.phonecode ? '+' : ''}}{{ country.phonecode }}</span>
            </el-option>
          </el-select>
        </el-form-item>

        <!-- iplocate API Key -->
        <el-form-item v-show="settings.phoneDefaultCountryCode == 'auto'">
          <label slot="label">
            {{ $root.labels.iplocate_api_key }}:
            <el-tooltip placement="top">
              <div slot="content" v-html="$root.labels.iplocate_api_key_tooltip"></div>
              <i class="el-icon-question am-tooltip-icon"></i>
            </el-tooltip>
          </label>
          <el-input v-model.trim="settings.ipLocateApiKey" auto-complete="off"/>
        </el-form-item>
        <!-- iplocate API Key -->

        <!-- Default required phone number input -->
        <div class="am-setting-box am-switch-box">
          <el-row type="flex" align="middle" :gutter="24">
            <el-col :span="16">
              {{ $root.labels.required_phone_number_field }}
              <el-tooltip placement="top">
                <div slot="content" v-html="$root.labels.required_field_old_tooltip"></div>
                <i class="el-icon-question am-tooltip-icon"></i>
              </el-tooltip>
            </el-col>
            <el-col :span="8" class="align-right">
              <el-switch
                  v-model="settings.requiredPhoneNumberField"
                  active-text=""
                  inactive-text=""
              ></el-switch>
            </el-col>
          </el-row>
        </div>

        <el-form-item :class="licenceClass()">
          <label slot="label">
            {{ $root.labels.manage_languages }}:
            <el-tooltip placement="top">
              <div slot="content" v-html="$root.labels.manage_languages_tooltip"></div>
              <i class="el-icon-question am-tooltip-icon"></i>
            </el-tooltip>
          </label>
          <el-select class="select-languages"
                     :placeholder="$root.labels.language"
                     v-model="settings.usedLanguages"
                     :disabled="notInLicence()"
                     clearable
                     filterable
                     multiple
                     collapse-tags>
            <el-option
                v-for="(lang, index) in Object.keys(languagesData)"
                :key="index"
                :label="getLanguageLabel(lang)"
                :value="lang"
                :disabled="lang in settings.usedLanguages ? false : lang === $root.locale"
            >
            <span>
              <img class="option-languages-flag" :src="getLanguageFlag(lang)">
              {{ getLanguageLabel(lang)  }}
            </span>
            </el-option>
          </el-select>

          <LicenceBlock/>
        </el-form-item>

        <!-- Default required phone number input -->
        <div class="am-setting-box am-switch-box">
          <el-row type="flex" align="middle" :gutter="24">
            <el-col :span="16">
              {{ $root.labels.required_email_field }}
              <el-tooltip placement="top">
                <div slot="content" v-html="$root.labels.required_field_old_tooltip"></div>
                <i class="el-icon-question am-tooltip-icon"></i>
              </el-tooltip>
            </el-col>
            <el-col :span="8" class="align-right">
              <el-switch
                  v-model="settings.requiredEmailField"
                  active-text=""
                  inactive-text=""
              ></el-switch>
            </el-col>
          </el-row>
        </div>

        <!-- Default show client time zone -->
        <div class="am-setting-box am-switch-box">
          <el-row type="flex" align="middle" :gutter="24">
            <el-col :span="16">
              {{ $root.labels.show_client_time_zone }}
              <el-tooltip placement="top">
                <div slot="content" v-html="$root.labels.show_client_time_zone_tooltip"></div>
                <i class="el-icon-question am-tooltip-icon"></i>
              </el-tooltip>
            </el-col>
            <el-col :span="8" class="align-right">
              <el-switch
                  v-model="settings.showClientTimeZone"
                  active-text=""
                  inactive-text=""
              ></el-switch>
            </el-col>
          </el-row>
        </div>

        <!-- Default add to calendar -->
        <div class="am-setting-box am-switch-box">
          <el-row type="flex" align="middle" :gutter="24">
            <el-col :span="16">
              {{ $root.labels.add_to_calendar }}
              <el-tooltip placement="top">
                <div slot="content" v-html="$root.labels.add_to_calendar_tooltip"></div>
                <i class="el-icon-question am-tooltip-icon"></i>
              </el-tooltip>
            </el-col>
            <el-col :span="8" class="align-right">
              <el-switch
                  v-model="settings.addToCalendar"
                  active-text=""
                  inactive-text=""
              ></el-switch>
            </el-col>
          </el-row>
        </div>

        <!-- Default items per page -->
        <el-form-item :label="$root.labels.default_items_per_page+':'">
          <el-input-number
              v-model="settings.itemsPerPage"
              :min="1"
              :max="30"
              type="number"
          >
          </el-input-number>
        </el-form-item>

        <!-- Default items per page back-end -->
        <el-form-item :label="$root.labels.default_items_per_page_backend+':'">
          <el-input-number
              v-model="settings.itemsPerPageBackEnd"
              :min="1"
              :max="50"
              type="number"
          >
          </el-input-number>
        </el-form-item>

        <!-- Default page on the backend -->
        <el-form-item :label="$root.labels.default_page_on_backend+':'">
          <el-select v-model="settings.defaultPageOnBackend">
            <el-option
                v-for="item in options.defaultPageOnBackend"
                :key="item.value"
                :label="item.label"
                :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>


        <!-- Google Map Api Key -->
        <el-form-item :class="licenceClass()" label="placeholder">
          <label slot="label">
            {{ $root.labels.gMap_api_key }}:
            <el-tooltip placement="top">
              <div slot="content" v-html="$root.labels.gMap_api_key_tooltip"></div>
              <i class="el-icon-question am-tooltip-icon"></i>
            </el-tooltip>
          </label>
          <el-input
            v-model.trim="settings.gMapApiKey"
            :disabled="notInLicence()"
            auto-complete="off"
          >
          </el-input>

          <LicenceBlock/>
        </el-form-item>

        <!-- Redirect URL after appointment -->
        <el-form-item label="placeholder" prop="redirectURLAfter" :error="errors.redirectURLAfter">
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
              v-model="settings.redirectUrlAfterAppointment"
              @input="clearValidation()"
              auto-complete="off"
          >
          </el-input>
        </el-form-item>

        <!-- Uploads Path -->
        <el-form-item :class="licenceClass()" label="placeholder">
          <label slot="label">
            {{ $root.labels.custom_fields_upload_path }}:
            <el-tooltip placement="top">
              <div slot="content" v-html="$root.labels.custom_fields_upload_path_tooltip"></div>
              <i class="el-icon-question am-tooltip-icon"></i>
            </el-tooltip>
          </label>
          <el-input
              v-model="settings.customFieldsUploadsPath"
              :disabled="notInLicence()"
              @input="clearValidation()"
              auto-complete="off"
          >
          </el-input>

          <LicenceBlock/>
        </el-form-item>

        <!-- Recaptcha Enable -->
        <div :class="licenceClass('starter')" class="am-setting-box am-switch-box">
          <el-row type="flex" align="middle" :gutter="24">
            <el-col :span="20">
              {{ $root.labels.recaptcha_enabled }}
              <el-tooltip placement="top">
                <div slot="content" v-html="$root.labels.recaptcha_enabled_tooltip"></div>
                <i class="el-icon-question am-tooltip-icon"></i>
              </el-tooltip>
            </el-col>
            <el-col :span="4" class="align-right">
              <el-switch
                v-model="settings.googleRecaptcha.enabled"
                :disabled="notInLicence('starter')"
                active-text=""
                inactive-text=""
                @change="handleRecaptchaValidationRules"
              >
              </el-switch>
            </el-col>
          </el-row>

          <LicenceBlock :licence="'starter'"/>
        </div>
        <!-- Recaptcha Enable -->

        <!-- Recaptcha Invisible -->
        <div class="am-setting-box am-switch-box" v-show="settings.googleRecaptcha.enabled">
          <el-row type="flex" align="middle" :gutter="24">
            <el-col :span="20">
              {{ $root.labels.recaptcha_invisible }}
              <el-tooltip placement="top">
                <div slot="content" v-html="$root.labels.recaptcha_invisible_tooltip"></div>
                <i class="el-icon-question am-tooltip-icon"></i>
              </el-tooltip>
            </el-col>
            <el-col :span="4" class="align-right">
              <el-switch
                v-model="settings.googleRecaptcha.invisible"
                active-text=""
                inactive-text=""
              >
              </el-switch>
            </el-col>
          </el-row>
        </div>
        <!-- Recaptcha Invisible -->

        <!-- Recaptcha Site Key -->
        <el-form-item v-show="settings.googleRecaptcha.enabled" prop="googleRecaptcha.siteKey">
          <label slot="label">
            {{ $root.labels.recaptcha_site_key }}:
            <el-tooltip placement="top">
              <div slot="content" v-html="$root.labels.recaptcha_site_key_tooltip"></div>
              <i class="el-icon-question am-tooltip-icon"></i>
            </el-tooltip>
          </label>
          <el-input v-model.trim="settings.googleRecaptcha.siteKey" auto-complete="off"/>
        </el-form-item>
        <!-- Recaptcha Site Key -->

        <!-- Recaptcha Secret -->
        <el-form-item v-show="settings.googleRecaptcha.enabled" prop="googleRecaptcha.secret">
          <label slot="label">
            {{ $root.labels.recaptcha_secret }}:
            <el-tooltip placement="top">
              <div slot="content" v-html="$root.labels.recaptcha_secret_tooltip"></div>
              <i class="el-icon-question am-tooltip-icon"></i>
            </el-tooltip>
          </label>
          <el-input v-model.trim="settings.googleRecaptcha.secret" auto-complete="off"/>
        </el-form-item>
        <!-- Recaptcha Secret -->

        <!-- Instant ions -->
        <div class="am-setting-box am-switch-box" style="display: none">
          <el-row type="flex" align="middle" :gutter="24">
            <el-col :span="20">
              Run post booking actions immediately
            </el-col>
            <el-col :span="4" class="align-right">
              <el-switch
                  v-model="settings.runInstantPostBookingActions"
                  active-text=""
                  inactive-text=""
              >
              </el-switch>
            </el-col>
          </el-row>
        </div>
        <!-- Instant ions -->

        <!-- Preselected employees count on calendar page on load -->
        <el-form-item label="placeholder" style="display: none">
          <label slot="label">
            Preselected employees count on calendar page on load:
          </label>
          <el-input-number
            v-model="settings.calendarEmployeesPreselected"
            :min="-1"
          >
          </el-input-number>
        </el-form-item>
        <!-- Preselect all employees on calendar page on load -->

        <!-- Lite Back Links -->
        <div v-if="$root.licence.isLite" class="am-setting-box am-switch-box">
          <el-row type="flex" align="middle" :gutter="24">
            <el-col :span="16">
              {{ $root.labels.back_links }}
              <el-tooltip placement="top">
                <div slot="content" v-html="$root.labels.back_links_tooltip"></div>
                <i class="el-icon-question am-tooltip-icon"></i>
              </el-tooltip>
            </el-col>
            <el-col :span="8" class="align-right">
              <el-switch
                  v-model="settings.backLink.enabled"
                  active-text=""
                  inactive-text=""
              ></el-switch>
            </el-col>
          </el-row>
        </div>

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
  import phoneCountriesMixin from '../../../js/common/mixins/phoneCountriesMixin'
  import helperMixin from '../../../js/backend/mixins/helperMixin'

  export default {

    mixins: [
      licenceMixin,
      imageMixin,
      phoneCountriesMixin,
      helperMixin
    ],

    props: {
      general: {
        type: Object
      },
      languagesData: {
        default: () => {},
        type: Object
      }
    },

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
        settings: Object.assign({}, this.general),
        rules: {
          googleRecaptcha: {},
          redirectURLAfter: [
            {validator: validateRedirectURL, trigger: 'submit'}
          ]
        },
        errors: {
          redirectURLAfter: ''
        },
        options: {
          timeSlotLength: [
            {
              label: this.$root.labels.min1,
              value: 60
            },
            {
              label: this.$root.labels.min2,
              value: 120
            },
            {
              label: this.$root.labels.min5,
              value: 300
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
              label: this.$root.labels.min20,
              value: 1200
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
            }
          ],
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
          ],
          defaultPageOnBackend: [
            {
              label: this.$root.labels.dashboard,
              value: 'Dashboard'
            },
            {
              label: this.$root.labels.calendar,
              value: 'Calendar'
            },
            {
              label: this.$root.labels.appointments,
              value: 'Appointments'
            },
            {
              label: this.$root.labels.events,
              value: 'Events'
            }
          ]
        }
      }
    },

    updated () {
      this.inlineSVG()
    },

    mounted () {
      this.inlineSVG()
      this.handleRecaptchaValidationRules()
      this.countries.unshift({
        'id': 0,
        'iso': 'auto',
        'nicename': this.$root.labels.identify_country_code
      })
    },

    methods: {
      getLanguageLabel (lang) {
        return this.languagesData[lang] ? this.languagesData[lang].name : ''
      },

      getLanguageFlag (lang) {
        if (lang && this.languagesData[lang] && this.languagesData[lang].country_code) {
          return this.$root.getUrl + 'public/img/flags/' + this.languagesData[lang].country_code + '.png'
        }
        return this.$root.getUrl + 'public/img/grey.svg'
      },

      handleRecaptchaValidationRules () {
        this.clearValidation()
        if (this.settings.googleRecaptcha.enabled === true) {
          this.rules.googleRecaptcha = {
            siteKey: [
              {required: true, message: this.$root.labels.recaptcha_site_key_error, trigger: 'submit'}
            ],
            secret: [
              {required: true, message: this.$root.labels.recaptcha_secret_error, trigger: 'submit'}
            ]
          }
        } else {
          this.rules.googleRecaptcha = {
            siteKey: {},
            secret: {}
          }
        }
      },

      closeDialog () {
        this.$emit('closeDialogSettingsGeneral')
      },

      onSubmit () {
        this.$refs.settings.validate((valid) => {
          if (valid) {
            this.$emit('closeDialogSettingsGeneral')
            this.$emit('updateSettings', {'general': this.settings})
          } else {
            return false
          }
        })
      },

      clearValidation () {
        this.$refs.settings.clearValidate()
      },

      changeNumberOfDaysAvailableForBooking (value) {
        this.settings.numberOfDaysAvailableForBooking = typeof value === 'undefined' ? 365 : value
      }
    }
  }
</script>
