<template>
  <div>

    <div class="am-dialog-scrollable">

      <!-- Dialog Header -->
      <div class="am-dialog-header">
        <el-row>
          <el-col :span="20">
            <h2>{{ $root.labels.activation_settings }}</h2>
          </el-col>
          <el-col :span="4" class="align-right">
            <el-button @click="closeDialog" class="am-dialog-close" size="small" icon="el-icon-close"></el-button>
          </el-col>
        </el-row>
      </div>
      <!-- /Dialog Header -->

      <LicenceLiteGuide v-if="$root.licence.isLite"></LicenceLiteGuide>

      <!-- Form -->
      <el-form
          v-if="notInLicence('starter') ? licenceVisible() : true"
          :class="licenceClass('starter')"
          :model="settings"
          ref="settings"
          :rules="rules"
          label-position="top"
          @submit.prevent="onSubmit"
      >

        <el-alert
            v-if="settings.active === false"
            class="am-activation-alert"
            type="info"
            show-icon
            title=""
            :description="$root.labels.activation_settings_explanation"
            :closable="false"
        >
        </el-alert>

        <!-- Purchase Code -->
        <el-form-item
            v-if="settings.active === false || (settings.active === true && settings.purchaseCodeStore === null)"
            class="am-purchase-code"
            :label="(settings.active === false) ? $root.labels.purchase_code + ':' : ''"
            prop="code"
        >
          <el-col :span="settings.active === true ? 24 : 18">
            <el-input
                v-if="settings.active === false"
                v-model.trim="settings.purchaseCodeStore"
                @input="clearValidation"
                :disabled="settings.active === true || notInLicence('starter')"
                auto-complete="off"
            >
              <i
                  v-if="settings.active === true && settings.purchaseCodeStore"
                  slot="suffix"
                  class="el-icon-circle-check"
              >
              </i>
            </el-input>
            <div class="am-purchase-code-hidden" v-else>
              <i class="el-icon-info"></i>
              <p>
                {{ $root.labels.activation_settings_hidden_code }}
                <a href="https://store.tms-plugins.com/login" target="_blank">store.tms-plugins.com</a>
              </p>
            </div>
          </el-col>

          <el-col :span="6" v-if="settings.active === false">
            <el-button
                type="primary"
                @click="activatePlugin"
                class="am-activate-plugin"
                :loading="loadingActivation"
                :disabled="notInLicence('starter')"
            >
              {{ $root.labels.activate }}
            </el-button>
          </el-col>

        </el-form-item>
        <!-- /Purchase Code -->

        <!-- Envato API -->
        <el-form-item
            v-if="settings.active === false || (settings.active === true && settings.envatoTokenEmail !== '')"
            class="am-envato-activation"
            :label="$root.labels.envato_api + ':'"
        >
          <el-button
              @click="authenticateEnvatoOAuth"
              class="am-envato-activation-button"
              :disabled="settings.active === true || notInLicence('starter')"
          >
            <img class="am-envato-activation-logo" :src="$root.getUrl+'public/img/envato.svg'"/>
            {{ settings.envatoTokenEmail !== '' ? $root.labels.envato_api_activated : $root.labels.envato_api_activate
            }}
          </el-button>
        </el-form-item>
        <!-- /Envato API -->

        <LicenceBlock :licence="'starter'"/>
      </el-form>
      <!-- /Form -->

      <!-- Delete Tables -->
      <div class="am-setting-box am-switch-box">
        <el-row type="flex" align="middle" :gutter="24">
          <el-col :span="20">
            {{ $root.labels.delete_amelia_short }}
            <el-tooltip placement="top">
              <div slot="content" v-html="$root.labels.delete_amelia_tooltip"></div>
              <i class="el-icon-question am-tooltip-icon"></i>
            </el-tooltip>
          </el-col>
          <el-col :span="4" class="align-right">
            <el-switch
                v-model="settings.deleteTables"
                active-text=""
                inactive-text=""
                @change="updateActivationSettings"
            >
            </el-switch>
          </el-col>
        </el-row>
      </div>
      <!-- Delete Tables -->

      <!-- Stash -->
      <div class="am-setting-box am-switch-box">
        <el-row type="flex" align="middle" :gutter="24">
          <el-col :span="20">
            {{ $root.labels.stash_entities }}
            <el-tooltip placement="top">
              <div slot="content" v-html="$root.labels.stash_entities_tooltip"></div>
              <i class="el-icon-question am-tooltip-icon"></i>
            </el-tooltip>
          </el-col>
          <el-col :span="4" class="align-right">
            <el-switch
                v-model="settings.stash"
                active-text=""
                inactive-text=""
                @change="updateActivationSettings"
            >
            </el-switch>
          </el-col>
        </el-row>
      </div>
      <!-- Stash -->

      <!-- Hide Unavailable -->
      <div v-if="!$root.licence.isDeveloper && !$root.licence.isLite" class="am-setting-box am-switch-box">
        <el-row type="flex" align="middle" :gutter="24">
          <el-col :span="20">
            {{ $root.labels.see_unavailable_features }}
          </el-col>
          <el-col :span="4" class="align-right">
            <el-switch
              v-model="settings.hideUnavailableFeatures"
              active-text=""
              inactive-text=""
              @change="updateActivationSettings"
            >
            </el-switch>
          </el-col>
        </el-row>
      </div>
      <!-- Hide Unavailable -->

      <!-- Async -->
      <div class="am-setting-box am-switch-box" style="display: none;">
        <el-row type="flex" align="middle" :gutter="24">
          <el-col :span="20">
            Use Async Loading for new forms
          </el-col>
          <el-col :span="4" class="align-right">
            <el-switch
              v-model="settings.v3AsyncLoading"
              active-text=""
              inactive-text=""
              @change="updateActivationSettings"
            >
            </el-switch>
          </el-col>
        </el-row>
      </div>
      <!-- Async -->

      <!-- Custom Path -->
      <div class="am-setting-box am-switch-box" style="display: none;">
        <el-row type="flex" align="middle" :gutter="24">
          <el-col :span="16">
            <p>Custom path enabled:</p>
          </el-col>
          <el-col :span="8" class="align-right">
            <el-switch
                v-model="settings.customUrl.enabled"
                active-text=""
                inactive-text=""
                @change="updateActivationSettings"
            >
            </el-switch>
          </el-col>
        </el-row>
      </div>

      <div style="display: none;">
        <el-input
          v-model.trim="settings.customUrl.pluginPath"
          @input="clearValidation"
          auto-complete="off"
        >
        </el-input>
      </div>

      <div style="display: none;">
        <el-input
          v-model.trim="settings.customUrl.ajaxPath"
          @input="clearValidation"
          auto-complete="off"
        >
        </el-input>
      </div>

      <div style="display: none;">
        <el-input
          v-model.trim="settings.customUrl.uploadsPath"
          @input="clearValidation"
          auto-complete="off"
          placeholder="custom uploads path"
        >
        </el-input>
      </div>

      <div class="am-setting-box am-switch-box" style="display: none;">
        <el-row type="flex" align="middle" :gutter="24">
          <el-col :span="16">
            <p>Use relative path for new booking forms:</p>
          </el-col>
          <el-col :span="8" class="align-right">
            <el-switch
              v-model="settings.v3RelativePath"
              active-text=""
              inactive-text=""
              @change="updateActivationSettings"
            >
            </el-switch>
          </el-col>
        </el-row>
      </div>
      <!-- Custom Path -->

      <!--  Disable Url Params    -->
      <div class="am-setting-box am-switch-box" style="display: none;">
        <el-row type="flex" align="middle" :gutter="24">
          <el-col :span="16">
            <p>Disable Url Params:</p>
          </el-col>
          <el-col :span="8" class="align-right">
            <el-switch
                v-model="settings.disableUrlParams"
                active-text=""
                inactive-text=""
                @change="updateActivationSettings"
            >
            </el-switch>
          </el-col>
        </el-row>
      </div>

      <!-- Thrive -->
      <div class="am-setting-box am-switch-box" style="display: none;">
        <el-row type="flex" align="middle" :gutter="24">
          <el-col :span="16">
            <p>Custom path enabled:</p>
          </el-col>
          <el-col :span="8" class="align-right">
            <el-switch
                v-model="settings.enableThriveItems"
                active-text=""
                inactive-text=""
                @change="updateActivationSettings"
            >
            </el-switch>
          </el-col>
        </el-row>
      </div>
      <!-- Thrive -->

      <!-- Http 500 as 409 -->
      <div class="am-setting-box am-switch-box" style="display: none;">
        <el-row type="flex" align="middle" :gutter="24">
          <el-col :span="16">
            <p>Http 500 as Http 409:</p>
          </el-col>
          <el-col :span="8" class="align-right">
            <el-switch
              v-model="settings.responseErrorAsConflict"
              active-text=""
              inactive-text=""
              @change="updateActivationSettings"
            >
            </el-switch>
          </el-col>
        </el-row>
      </div>
      <!-- Thrive -->

    </div>

    <!-- Dialog Footer -->
    <div class="am-dialog-footer">
      <div class="am-dialog-footer-actions">
        <el-row>
          <el-col :sm="24" class="align-right">
            <el-button type="" @click="closeDialog" class="">{{ $root.labels.close }}</el-button>
            <el-button
                v-if="settings.active === true"
                type="danger"
                @click="deactivatePlugin"
                class="am-dialog-create"
                :loading="loadingActivation"
            >
              {{ $root.labels.deactivate }}
            </el-button>
          </el-col>
        </el-row>
      </div>
    </div>
    <!-- /Dialog Footer -->

  </div>
</template>

<script>
  import licenceMixin from '../../../js/common/mixins/licenceMixin'
  import imageMixin from '../../../js/common/mixins/imageMixin'
  import helperMixin from '../../../js/backend/mixins/helperMixin'
  import notifyMixin from '../../../js/backend/mixins/notifyMixin'
  import LicenceLiteGuide from '../parts/LicenceLiteGuide.vue'

  export default {
    components: {LicenceLiteGuide},

    mixins: [
      licenceMixin,
      imageMixin,
      helperMixin,
      notifyMixin
    ],

    props: {
      activation: {
        type: Object
      }
    },

    data () {
      let validatePurchaseCode = (rule, value, callback) => {
        let domain = location.hostname
        let subdomain = location.hostname

        this.$http.get(`${this.$root.getAjaxUrl}/activation/code`, {
          params: {
            purchaseCodeStore: this.settings.purchaseCodeStore,
            domain: domain,
            subdomain: subdomain
          }
        }).then(response => {
          if (!response.data.data.valid || response.data.data.valid === false) {
            callback(new Error(this.$root.labels.activation_settings_invalid_code))
          } else if (response.data.data.domainRegistered === false) {
            callback(new Error(this.$root.labels.activation_settings_domains_limit))
          } else {
            this.settings.active = true
            callback()
          }
        }).catch(e => {
          console.log(e)
          this.loadingActivation = false
        })
      }

      return {
        loadingActivation: false,
        settings: Object.assign({}, this.activation),
        rules: {
          code: [
            {validator: validatePurchaseCode, trigger: 'submit'}
          ]
        }
      }
    },

    created () {
      this.authenticateEnvatoOAuthCallback()
    },

    mounted () {
      if (this.settings.active === true && this.settings.purchaseCodeStore) {
        this.settings.purchaseCodeStore = null
      }
    },

    methods: {
      closeDialog () {
        this.$emit('closeDialogSettingsActivation')
      },

      activatePlugin () {
        this.loadingActivation = true
        this.$refs.settings.validate((valid) => {
          if (valid) {
            this.loadingActivation = false
            this.$emit('closeDialogSettingsActivation')
            this.$emit('updateSettings', {'activation': this.settings}, this.$root.labels.activation_activated)
          } else {
            this.loadingActivation = false
            return false
          }
        })
      },

      updateActivationSettings () {
        this.$emit('updateSettings', {'activation': this.settings})
      },

      deactivatePlugin () {
        this.loadingActivation = true

        let route = ''
        let params = {}
        let domain = location.hostname
        let subdomain = location.hostname

        if (this.settings.purchaseCodeStore === null) {
          route = '/activation/code/deactivate'
          params = {
            domain: domain,
            subdomain: subdomain
          }
        } else if (this.settings.envatoTokenEmail) {
          route = '/activation/envato/deactivate'
          params = {
            envatoTokenEmail: this.settings.envatoTokenEmail,
            domain: domain,
            subdomain: subdomain
          }
        }

        this.$http.get(`${this.$root.getAjaxUrl + route}`, {
          params: params
        }).then(response => {
          if (response.data.data.deactivated === true) {
            this.loadingActivation = false
            this.settings.active = false
            this.settings.purchaseCodeStore = ''
            this.settings.envatoTokenEmail = ''
            this.$emit('closeDialogSettingsActivation')
            this.$emit('updateSettings', {'activation': this.settings}, this.$root.labels.activation_deactivated)
          } else {
            this.notify(this.$root.labels.error, this.$root.labels.unable_to_deactivate_plugin, 'error')
            this.loadingActivation = false
          }
        }).catch(() => {
          this.notify(this.$root.labels.error, this.$root.labels.unable_to_deactivate_plugin, 'error')
          this.loadingActivation = false
        })
      },

      authenticateEnvatoOAuth () {
        let domain = location.hostname
        let subdomain = location.hostname

        this.$http.post(`${this.$root.getAjaxUrl}/activation/parse-domain`, {
          domain: domain,
          subdomain: subdomain
        }).then(response => {
          window.location.replace(
            this.$root.getStoreUrl + 'activation/envato?slug=ameliabooking&domain=' + response.data.data.domain + '&subdomain=' + response.data.data.subdomain + '&redirectUrl=' + this.$root.getSiteUrl + '/wp-admin/admin.php?page=wpamelia-settings#/settings'
          )
        }).catch(() => {
          this.notify(this.$root.labels.error, this.$root.labels.activation_envato_failed, 'error')
          this.loadingActivation = false
        })
      },

      authenticateEnvatoOAuthCallback () {
        let queryParams = this.getUrlQueryParams(window.location.href)

        if (queryParams['valid'] && queryParams['domainRegistered']) {
          // Remove query parameters sent back from TMS Store
          let redirectURL = this.removeURLParameter(window.location.href, 'valid')
          redirectURL = this.removeURLParameter(redirectURL, 'domainRegistered')
          redirectURL = this.removeURLParameter(redirectURL, 'slug')

          if (queryParams['envatoTokenEmail']) {
            redirectURL = this.removeURLParameter(redirectURL, 'envatoTokenEmail')
            // Notify that plugin has been activated
            this.notify(this.$root.labels.success, this.$root.labels.activation_activated, 'success')
          } else if (queryParams['valid'] === 'false') {
            this.notify(this.$root.labels.error, this.$root.labels.activation_envato_failed, 'error')
          } else if (queryParams['domainRegistered'] === 'false') {
            this.notify(this.$root.labels.error, this.$root.labels.activation_settings_domains_limit, 'error')
          }

          history.pushState(null, null, redirectURL + '#/settings')
        }
      },

      clearValidation () {
        if (typeof this.$refs.settings !== 'undefined') {
          this.$refs.settings.clearValidate()
        }
      }
    }
  }
</script>
