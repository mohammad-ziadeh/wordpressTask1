<template>
  <div>
    <div class="am-dialog-scrollable">

      <!-- Dialog Header -->
      <div class="am-dialog-header">
        <el-row>
          <el-col :span="20">
            <h2>{{ $root.labels.notifications_settings }}</h2>
          </el-col>
          <el-col :span="4" class="align-right">
            <el-button @click="closeDialog" class="am-dialog-close" size="small" icon="el-icon-close"></el-button>
          </el-col>
        </el-row>
      </div>

      <!-- Form -->
      <el-form :model="settings" ref="settings" :rules="rules" label-position="top" @submit.prevent="onSubmit">

        <!-- Mail Service -->
        <el-form-item :label="$root.labels.mail_service + ':'">
          <el-select v-model="settings.mailService" @change="changeMailService()">
            <el-option
                v-for="item in options.mailServices"
                :key="item.value"
                :label="item.label"
                :value="item.value"
                :disabled="$root.licence.isLite ? item.value === 'mailgun' || item.value === 'smtp' : false"
            >
            </el-option>
          </el-select>
        </el-form-item>

        <!-- SMTP Host -->
        <el-form-item
            v-show="settings.mailService === 'smtp'"
            :label="$root.labels.smtp_host + ':'"
            prop="smtpHost"
        >
          <el-input
              v-model="settings.smtpHost"
              @input="clearValidation()"
              @change = "trimProperty(settings,'smtpHost')"
          >
          </el-input>
        </el-form-item>

        <!-- SMTP Port -->
        <el-form-item
            v-show="settings.mailService === 'smtp'"
            :label="$root.labels.smtp_port + ':'"
            prop="smtpPort"
        >
          <el-input
              v-model="settings.smtpPort"
              @input="clearValidation()"
              @change = "trimProperty(settings,'smtpPort')"
          >
          </el-input>
        </el-form-item>

        <!-- SMTP Secure -->
        <el-form-item
            v-show="settings.mailService === 'smtp'"
            :label="$root.labels.smtp_secure + ':'"
        >
          <el-select v-model="settings.smtpSecure">
            <el-option
                v-for="item in options.smtpSecureOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>

        <!-- SMTP Username -->
        <el-form-item
            v-show="settings.mailService === 'smtp'"
            :label="$root.labels.smtp_username + ':'"
            prop="smtpUsername"
        >
          <el-input
              v-model="settings.smtpUsername"
              @input="clearValidation()"
              @change = "trimProperty(settings,'smtpUsername')"
          >
          </el-input>
        </el-form-item>

        <!-- SMTP Password -->
        <el-form-item
            v-show="settings.mailService === 'smtp'"
            :label="$root.labels.smtp_password + ':'"
            prop="smtpPassword"
        >
          <el-input
              type="password"
              v-model="settings.smtpPassword"
              @input="clearValidation()"
              @change = "trimProperty(settings,'smtpPassword')"
          >
          </el-input>
        </el-form-item>

        <!-- Mailgun Key -->
        <el-form-item
            v-show="settings.mailService === 'mailgun'"
            :label="$root.labels.mailgun_api_key + ':'"
            prop="mailgunApiKey"
        >
          <el-input
              v-model="settings.mailgunApiKey"
              @input="clearValidation()"
              @change = "trimProperty(settings,'mailgunApiKey')"
          >
          </el-input>
        </el-form-item>

        <!-- Mailgun Domain -->
        <el-form-item
            v-show="settings.mailService === 'mailgun'"
            :label="$root.labels.mailgun_domain + ':'"
            prop="mailgunDomain"
        >
          <el-input
              v-model="settings.mailgunDomain"
              @input="clearValidation()"
              @change = "trimProperty(settings,'mailgunDomain')"
          >
          </el-input>
        </el-form-item>

        <!-- Sender Name -->
        <el-form-item :label="$root.labels.sender_name + ':'" prop="senderName">
          <el-input
              v-model="settings.senderName"
              @input="clearValidation()"
              @change = "trimProperty(settings,'senderName')"
          >
          </el-input>
        </el-form-item>

        <!-- Sender Email -->
        <el-form-item :label="$root.labels.sender_email +':'" prop="senderEmail">
          <el-input
              v-model="settings.senderEmail"
              :placeholder="$root.labels.email_placeholder"
              @input="clearValidation()"
              @change = "trimProperty(settings,'senderEmail')"
          >
          </el-input>
        </el-form-item>

        <!-- Reply to -->
        <el-form-item :label="$root.labels.reply_to + ':'" prop="replyTo">
          <el-input
              v-model="settings.replyTo"
              :placeholder="$root.labels.email_placeholder"
              @input="clearValidation()"
              @change = "trimProperty(settings,'replyTo')"
          >
          </el-input>
        </el-form-item>

        <!-- Mailgun Endpoint -->
        <el-form-item
            v-show="settings.mailService === 'mailgun'"
        >
          <label slot="label">
            {{ $root.labels.endpoint }}:
            <el-tooltip placement="top">
              <div slot="content" v-html="$root.labels.endpoint_tooltip"></div>
              <i class="el-icon-question am-tooltip-icon"></i>
            </el-tooltip>
          </label>
          <el-input
              v-model="settings.mailgunEndpoint"
              @input="clearValidation()"
          >
          </el-input>
        </el-form-item>

        <!-- Notify Customers By Default -->
        <div class="am-setting-box am-switch-box">
          <el-row type="flex" align="middle" :gutter="24">
            <el-col :span="16">
              <p>{{ $root.labels.notify_customers_default }}</p>
            </el-col>
            <el-col :span="8" class="align-right">
              <el-switch v-model="settings.notifyCustomers" active-text="" inactive-text=""></el-switch>
            </el-col>
          </el-row>
        </div>

        <!-- Redirect URLs -->
        <el-collapse>
          <el-collapse-item class="am-setting-box">
            <template slot="title">
              <p>{{ $root.labels.redirect_urls }}:</p>
            </template>
            <template>
              <el-tabs v-model="activeTabRedirectUrls">
                <el-tab-pane :label="$root.labels.customer" name="customer">

                  <!-- Cancel Booking Success URL -->
                  <el-form-item :label="$root.labels.cancel_success_url +':'">
                    <el-input
                        v-model="settings.cancelSuccessUrl"
                        :placeholder="$root.labels.cancel_url_placeholder"
                        @input="clearValidation()"
                    >
                    </el-input>
                  </el-form-item>

                  <!-- Cancel Booking Error URL -->
                  <el-form-item label="placeholder">
                    <label slot="label">
                      {{ $root.labels.cancel_error_url }}:
                      <el-tooltip placement="top">
                        <div slot="content" v-html="$root.labels.cancel_error_url_tooltip"></div>
                        <i class="el-icon-question am-tooltip-icon"></i>
                      </el-tooltip>
                    </label>
                    <el-input
                        v-model="settings.cancelErrorUrl"
                        :placeholder="$root.labels.cancel_url_placeholder"
                        @input="clearValidation()"
                    >
                    </el-input>
                  </el-form-item>

                </el-tab-pane>
                <el-tab-pane :label="$root.labels.employee" name="employee">

                  <!-- Approve Booking Success URL -->
                  <el-form-item :label="$root.labels.approve_appointment_success_url +':'">
                    <el-input
                        v-model="settings.approveSuccessUrl"
                        :placeholder="$root.labels.cancel_url_placeholder"
                        @input="clearValidation()"
                    >
                    </el-input>
                  </el-form-item>

                  <!-- Approve Booking Error URL -->
                  <el-form-item  :label="$root.labels.approve_appointment_error_url +':'">
                    <el-input
                        v-model="settings.approveErrorUrl"
                        :placeholder="$root.labels.cancel_url_placeholder"
                        @input="clearValidation()"
                    >
                    </el-input>
                  </el-form-item>

                  <!-- Approve Booking Error URL -->
                  <el-form-item  :label="$root.labels.reject_appointment_success_url +':'">
                    <el-input
                        v-model="settings.rejectSuccessUrl"
                        :placeholder="$root.labels.cancel_url_placeholder"
                        @input="clearValidation()"
                    >
                    </el-input>
                  </el-form-item>

                  <!-- Approve Booking Error URL -->
                  <el-form-item  :label="$root.labels.reject_appointment_error_url +':'">
                    <el-input
                        v-model="settings.rejectErrorUrl"
                        :placeholder="$root.labels.cancel_url_placeholder"
                        @input="clearValidation()"
                    >
                    </el-input>

                  </el-form-item>

                </el-tab-pane>
              </el-tabs>
            </template>
          </el-collapse-item>
        </el-collapse>
        <!-- /Redirect URLs -->

        <!-- Send all notifications to the additional address (bcc) -->
        <el-form-item label="placeholder" prop="bccEmail">
          <label slot="label">
            {{ $root.labels.bcc_email }}:
            <el-tooltip placement="top">
              <div slot="content" v-html="$root.labels.bcc_email_tooltip"></div>
              <i class="el-icon-question am-tooltip-icon"></i>
            </el-tooltip>
          </label>
          <el-select
              class="am-setting-notifications-select"
              v-model="bccEmails"
              multiple
              filterable
              allow-create
              default-first-option
              :no-data-text="$root.labels.create"
              @change="emailsChanged"
          >
            <el-option
                v-for="(email, index) in bccEmails"
                :key="index"
                :label="email"
                :value="email"
            >
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="placeholder" prop="emptyPackageEmployees" v-if="$root.licence.isPro || $root.licence.isDeveloper">
          <label slot="label">
            {{ $root.labels.empty_package_email }}:
            <el-tooltip placement="top">
              <div slot="content" v-html="$root.labels.empty_package_email_tooltip"></div>
              <i class="el-icon-question am-tooltip-icon"></i>
            </el-tooltip>
          </label>
          <el-select
              class="am-setting-notifications-select"
              v-model="emptyPackageEmployees"
              multiple
              filterable
          >
            <el-option
                v-for="employee in employees"
                :key="employee.id"
                :label="employee.firstName + ' ' + employee.lastName"
                :value="employee.id"
            >
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="placeholder" prop="bccSms">
          <label slot="label">
            {{ $root.labels.bcc_sms }}:
            <el-tooltip placement="top">
              <div slot="content" v-html="$root.labels.bcc_sms_tooltip"></div>
              <i class="el-icon-question am-tooltip-icon"></i>
            </el-tooltip>
          </label>
          <el-select
              class="am-setting-notifications-select"
              v-model="bccNumbers"
              multiple
              filterable
              allow-create
              default-first-option
              :no-data-text="$root.labels.create"
              @change="numbersChanged"
          >
            <el-option
                v-for="(number, index) in bccNumbers"
                :key="index"
                :label="number"
                :value="number"
            >
            </el-option>
          </el-select>
        </el-form-item>


        <!-- Send sms balance low email -->
        <div class="am-setting-box am-switch-box">
          <el-row type="flex" align="middle" :gutter="24">
            <el-col :span="16">
              {{ $root.labels.send_sms_balance_low_email }}
              <el-tooltip placement="top">
                <div slot="content" v-html="$root.labels.send_sms_balance_low_email_tooltip"></div>
                <i class="el-icon-question am-tooltip-icon"></i>
              </el-tooltip>
            </el-col>
            <el-col :span="8" class="align-right">
              <el-switch
                  v-model="settings.smsBalanceEmail.enabled"
                  active-text=""
                  inactive-text=""
              ></el-switch>
            </el-col>
          </el-row>

          <el-row type="flex" align="middle" :gutter="24" v-if="settings.smsBalanceEmail.enabled" style="margin-top: 16px">
            <el-col>
              <el-form-item label="placeholder">
                <label slot="label">
                  {{ $root.labels.send_sms_balance_low_minimum }}:
                </label>
                <el-input-number
                    v-model="settings.smsBalanceEmail.minimum"
                    :min="1"
                >
                </el-input-number>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row type="flex" align="middle" :gutter="24" v-if="settings.smsBalanceEmail.enabled">
            <el-col>
              <el-form-item label="placeholder">
                <label slot="label">
                  {{ $root.labels.send_sms_balance_low_to_email }}:
                </label>
                <el-input
                    v-model="settings.smsBalanceEmail.email"
                >
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>

        </div>


        <!-- Send invoice -->
        <div :class="licenceClass('basic')" class="am-setting-box am-switch-box">
          <el-row type="flex" align="middle" :gutter="24">
            <el-col :span="16">
              {{ $root.labels.send_invoice_by_default }}
              <el-tooltip placement="top">
                <div slot="content" v-html="$root.labels.send_invoice_by_default_description"></div>
                <i class="el-icon-question am-tooltip-icon"></i>
              </el-tooltip>
            </el-col>
            <el-col :span="8" class="align-right">
              <el-switch
                  v-model="settings.sendInvoice"
                  active-text=""
                  inactive-text=""
                  :disabled="notInLicence('basic')"
              ></el-switch>
            </el-col>
          </el-row>

          <LicenceBlock :licence="'basic'"/>
        </div>

        <!-- Send ics files -->
        <div class="am-setting-box am-switch-box">
          <el-row type="flex" align="middle" :gutter="24">
            <el-col :span="16">
              {{ $root.labels.send_ics_attachment_approved }}
              <el-tooltip placement="top">
                <div slot="content" v-html="$root.labels.send_ics_attachment_approved_tooltip"></div>
                <i class="el-icon-question am-tooltip-icon"></i>
              </el-tooltip>
            </el-col>
            <el-col :span="8" class="align-right">
              <el-switch
                  v-model="icsSettings.sendIcsAttachment"
                  active-text=""
                  inactive-text=""
              ></el-switch>
            </el-col>
          </el-row>
        </div>

        <!-- Send ics files for pending bookings -->
        <div class="am-setting-box am-switch-box">
          <el-row type="flex" align="middle" :gutter="24">
            <el-col :span="16">
              {{ $root.labels.send_ics_attachment_pending }}
              <el-tooltip placement="top">
                <div slot="content" v-html="$root.labels.send_ics_attachment_pending_tooltip"></div>
                <i class="el-icon-question am-tooltip-icon"></i>
              </el-tooltip>
            </el-col>
            <el-col :span="8" class="align-right">
              <el-switch
                  v-model="icsSettings.sendIcsAttachmentPending"
                  active-text=""
                  inactive-text=""
              ></el-switch>
            </el-col>
          </el-row>
        </div>

        <!-- Set ICS description -->
        <el-collapse v-if="icsSettings.sendIcsAttachment || icsSettings.sendIcsAttachmentPending">
          <el-collapse-item class="am-setting-box">
            <template slot="title">
              <p>{{ $root.labels.set_ics_description }}:</p>
            </template>
            <template>
              <select-translate
                  v-if="$root.settings.general.usedLanguages.length"
                  @languageChanged="languageChanged"
              >
              </select-translate>
              <el-tabs v-model="activeTab">
                <el-tab-pane :label="$root.labels.appointments" name="appointment">
                  <el-form-item :label="$root.labels.description + ':'">
                    <el-input
                        type="textarea"
                        :autosize="{ minRows: 4, maxRows: 6}"
                        v-model="ics_description"
                    >
                    </el-input>
                  </el-form-item>
                  <el-form-item>
                    <inline-placeholders
                        :placeholdersNames="getInlinePlaceholdersNames()"
                        :excludedPlaceholders="{
                            appointmentPlaceholders: [
                              '%zoom_host_url%',
                              '%zoom_join_url%',
                              '%lesson_space_url%',
                              '%appointment_cancel_url%',
                              '%reservation_name%',
                              '%reservation_description%'
                            ]
                          }"
                        userTypeTab="provider"
                    >
                    </inline-placeholders>
                  </el-form-item>
                </el-tab-pane>
                <el-tab-pane :label="$root.labels.events" name="event">
                  <el-form-item :label="$root.labels.description + ':'">
                    <el-input
                        type="textarea"
                        :autosize="{ minRows: 4, maxRows: 6}"
                        v-model="ics_description"
                    >
                    </el-input>
                  </el-form-item>
                  <el-form-item>
                    <inline-placeholders
                        :placeholdersNames="getInlinePlaceholdersNames()"
                        :excludedPlaceholders="{
                            eventPlaceholders: [
                              '%event_cancel_url%',
                              '%lesson_space_url_date%',
                              '%lesson_space_url_date_time%',
                              '%google_meet_url_date%',
                              '%google_meet_url_date_time%',
                              '%microsoft_teams_url_date%',
                              '%microsoft_teams_url_date_time%',
                              '%zoom_join_url_date%',
                              '%zoom_join_url_date_time%',
                              '%zoom_host_url_date%',
                              '%zoom_host_url_date_time%',
                              '%reservation_name%',
                              '%reservation_description%'
                            ]
                          }"
                        userTypeTab="provider"
                    >
                    </inline-placeholders>
                  </el-form-item>
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
  import imageMixin from '../../../js/common/mixins/imageMixin'
  import helperMixin from '../../../js/backend/mixins/helperMixin'
  import SelectTranslate from '../parts/SelectTranslate'
  import InlinePlaceholders from '../notifications/common/InlinePlaceholders'
  import licenceMixin from '../../../js/common/mixins/licenceMixin'

  export default {

    mixins: [licenceMixin, imageMixin, helperMixin],

    props: {
      notifications: {
        type: Object
      },
      ics: {
        type: Object
      },
      employees: {
        type: Array,
        default: () => []
      }
    },

    data () {
      return {
        activeTabRedirectUrls: 'customer',
        activeTab: 'appointment',
        bccEmails: [],
        bccNumbers: [],
        emptyPackageEmployees: [],
        selectedLanguage: '',
        settings: Object.assign({}, this.notifications),
        icsSettings: Object.assign({}, this.ics),
        options: {
          mailServices: [
            {
              label: this.$root.labels.php_mail,
              value: 'php'
            },
            {
              label: this.$root.labels.wp_mail,
              value: 'wp_mail'
            },
            {
              label: this.$root.labels.smtp,
              value: 'smtp'
            },
            {
              label: this.$root.labels.mailgun,
              value: 'mailgun'
            }
          ],
          smtpSecureOptions: [
            {
              label: this.$root.labels.smtp_secure_ssl,
              value: 'ssl'
            },
            {
              label: this.$root.labels.smtp_secure_tls,
              value: 'tls'
            },
            {
              label: this.$root.labels.smtp_secure_disabled,
              value: false
            }
          ]
        },
        rules: {
          senderName: [
            {required: true, message: this.$root.labels.sender_name_warning, trigger: 'submit'}
          ],
          senderEmail: [
            {required: true, message: this.$root.labels.sender_email_warning, trigger: 'submit'},
            {type: 'email', message: this.$root.labels.enter_valid_email_warning, trigger: 'submit'}
          ],
          replyTo: [
            {type: 'email', message: this.$root.labels.enter_valid_email_warning, trigger: 'submit'}
          ],
          smtpHost: [],
          smtpPort: [],
          smtpUsername: [],
          smtpPassword: [],
          mailgunApiKey: [],
          mailgunDomain: []
        }
      }
    },

    updated () {
      this.inlineSVG()
    },

    mounted () {
      if (this.settings.bccEmail) {
        this.bccEmails = this.settings.bccEmail.split(',')
      }
      if (this.settings.bccSms) {
        this.bccNumbers = this.settings.bccSms.split(',')
      }
      if (this.settings.emptyPackageEmployees) {
        this.emptyPackageEmployees = this.settings.emptyPackageEmployees.split(',').map(e => parseInt(e))
      }

      this.inlineSVG()
      this.changeMailService()
    },

    methods: {
      getInlinePlaceholdersNames () {
        let common = [
          'customerPlaceholders',
          'companyPlaceholders'
        ]

        switch (this.activeTab) {
          case ('event'):
            return common.concat(
              [
                'eventPlaceholders',
                'customFieldsPlaceholders',
                'employeePlaceholders',
                'locationPlaceholders',
                'couponsPlaceholders'
              ]
            )

          case ('appointment'):
            return common.concat(
              [
                'appointmentPlaceholders',
                'customFieldsPlaceholders',
                'employeePlaceholders',
                'categoryPlaceholders',
                'locationPlaceholders',
                'couponsPlaceholders',
                'extrasPlaceholders'
              ]
            )
        }

        return common
      },

      languageChanged (selectedLanguage) {
        this.selectedLanguage = selectedLanguage
      },

      closeDialog () {
        this.$emit('closeDialogSettingsNotifications')
      },

      changeMailService () {
        this.clearValidation()

        this.rules.smtpHost = []
        this.rules.smtpPort = []
        this.rules.smtpUsername = []
        this.rules.smtpPassword = []
        this.rules.mailgunApiKey = []
        this.rules.mailgunDomain = []

        if (this.settings.mailService === 'smtp') {
          this.rules.smtpHost = [{
            required: true,
            message: this.$root.labels.smtp_host_warning,
            trigger: 'submit'
          }]
          this.rules.smtpPort = [{
            required: true,
            message: this.$root.labels.smtp_port_warning,
            trigger: 'submit'
          }]
          this.rules.smtpUsername = [{
            required: true,
            message: this.$root.labels.smtp_username_warning,
            trigger: 'submit'
          }]
          this.rules.smtpPassword = [{
            required: true,
            message: this.$root.labels.smtp_password_warning,
            trigger: 'submit'
          }]
        }

        if (this.settings.mailService === 'mailgun') {
          this.rules.mailgunApiKey = [{
            required: true,
            message: this.$root.labels.mailgun_api_key_warning,
            trigger: 'submit'
          }]
          this.rules.mailgunDomain = [{
            required: true,
            message: this.$root.labels.mailgun_domain_warning,
            trigger: 'submit'
          }]
        }
      },

      emailsChanged (emails) {
        if (emails.length && (emails[emails.length - 1].trim() === '' || !(/(.+)@(.+){2,}\.(.+){2,}/.test(emails[emails.length - 1])))) {
          emails.pop()
        }
      },

      numbersChanged (phoneNumbers) {
        if (phoneNumbers.length && (phoneNumbers[phoneNumbers.length - 1].trim() === '' || !(/^\+/.test(phoneNumbers[phoneNumbers.length - 1])))) {
          phoneNumbers.pop()
        }
      },

      onSubmit () {
        this.$refs.settings.validate((valid) => {
          if (valid) {
            this.$emit('closeDialogSettingsNotifications')
            this.$emit('updateSettings', {
              'notifications': Object.assign(this.settings, {bccEmail: this.bccEmails.join(','), bccSms: this.bccNumbers.join(','), emptyPackageEmployees: this.emptyPackageEmployees.join(',')}),
              'ics': this.icsSettings})
          }
        })
      },

      clearValidation () {
        this.$refs.settings.clearValidate()
      }
    },

    computed: {
      ics_description: {
        get () {
          if (this.selectedLanguage && this.icsSettings.description.translations) {
            let translations = this.icsSettings.description.translations
            if (translations[this.activeTab] && translations[this.activeTab][this.selectedLanguage]) {
              return translations[this.activeTab][this.selectedLanguage]
            }
          }
          return this.icsSettings.description[this.activeTab]
        },
        set (content) {
          if (this.selectedLanguage) {
            this.icsSettings.description.translations = this.icsSettings.description.translations ? this.icsSettings.description.translations : '{}'
            let translations = this.icsSettings.description.translations

            if (!translations[this.activeTab]) {
              translations[this.activeTab] = {}
            }

            translations[this.activeTab][this.selectedLanguage] = content
            this.icsSettings.description.translations = Object.assign({}, translations)
          } else {
            this.icsSettings.description[this.activeTab] = content
          }
        }
      }
    },

    components: {
      SelectTranslate,
      InlinePlaceholders
    }
  }
</script>
