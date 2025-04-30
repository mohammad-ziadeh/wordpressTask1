<template>
  <div id="am-notifications" class="am-wrap">
    <div id="am-email-notifications" class="am-body">

      <!-- Page Header -->
      <page-header></page-header>
      <!-- /Page Header -->

      <!-- Spinner -->
      <div class="am-spinner am-section" v-if="!fetched">
        <img :src="$root.getUrl + 'public/img/spinner.svg'"/>
      </div>
      <!-- /Spinner -->

      <!-- Notifications Tab -->
      <div class="am-notifications am-section">
        <el-tabs v-model="notificationTab" @tab-click="inlineSVG()" v-if="fetched">

          <!-- Email Notifications -->
          <el-tab-pane :label="$root.labels.email_notifications" name="email">
            <customize-notifications
                :notifications="notifications"
                :customFields="options.entities.customFields"
                :categories="options.entities.categories"
                :coupons="options.entities.coupons"
                :events="options.entities.events"
                type="email"
                :pageUrl="getPageUrl()"
                :languagesData="languagesData"
                :passed-used-languages="options.settings.general.usedLanguages"
                @manageLanguages="manageLanguages = true"
            ></customize-notifications>
          </el-tab-pane>
          <!-- /Email Notifications -->

          <!-- SMS Notifications -->
          <el-tab-pane :label="$root.labels.sms_notifications" name="sms">
            <sms-notifications
                v-if="notificationTab === 'sms'"
                :notifications="notifications"
                :categories="options.entities.categories"
                :customFields="options.entities.customFields"
                :coupons="options.entities.coupons"
                :events="options.entities.events"
                :languagesData="languagesData"
                :passed-used-languages="options.settings.general.usedLanguages"
                @manageLanguages="manageLanguages = true"
            >
            </sms-notifications>
          </el-tab-pane>
          <!-- /SMS Notifications -->

          <!-- WhatsApp Notifications -->
          <el-tab-pane name="whatsapp" v-if="notInLicence('pro') ? licenceVisible() : true">
            <span v-if="$root.licence.isLite" slot="label" class="am-premium-tag">
              <img :src="`${$root.getUrl}public/img/am-star-gold.svg`"/>
              {{ $root.labels.whatsapp_notifications }}
            </span>
            <template v-else slot="label">
              {{ $root.labels.whatsapp_notifications }}
            </template>

            <LicenceImage :licence="'pro'"/>

            <whats-app-notifications
              :class="licenceClassDisabled('pro')"
              v-if="!notInLicence('pro') ? notificationTab === 'whatsapp' : false"
              :notifications="notifications"
              :categories="options.entities.categories"
              :customFields="options.entities.customFields"
              :coupons="options.entities.coupons"
              :events="options.entities.events"
              :languagesData="languagesData"
              :passed-used-languages="options.settings.general.usedLanguages.includes($root.settings.wordpress.locale) ? options.settings.general.usedLanguages : options.settings.general.usedLanguages.concat([$root.settings.wordpress.locale])"
              :templates="whatsAppTemplates"
              @manageLanguages="manageLanguages = true"
              @getNotifications="getNotifications"
            >
            </whats-app-notifications>
          </el-tab-pane>
          <!-- /WhatsApp Notifications -->

        </el-tabs>
      </div>

      <!-- /Notifications Tab -->

      <!-- Help Button -->
      <el-col :md="6" class="">
        <a class="am-help-button" :href="needHelpPage" target="_blank" rel="nofollow">
          <i class="el-icon-question"></i> {{ $root.labels.need_help }}?
        </a>
      </el-col>
      <!-- /Help Button -->

      <!-- Dialog Manage Notifications -->
      <transition name="slide">
        <el-dialog
          :close-on-click-modal="false"
          class="am-side-dialog am-dialog-email-codes"
          :visible.sync="manageLanguages"
          :show-close="false"
          v-if="manageLanguages"
        >
          <dialog-manage-languages
            :passed-used-languages="options.settings.general.usedLanguages"
            :languages-data="languagesData"
            @closeDialogManageLanguages="manageLanguages = false"
            @saveDialogManageLanguages="saveDialogManageLanguages"
          >
          </dialog-manage-languages>
        </el-dialog>
      </transition>
      <!-- /Dialog Manage Notifications -->

<!--      <dialog-new-customize></dialog-new-customize>-->

    </div>
  </div>
</template>

<script>
  import LicenceImage from '../parts/LicenceImage'
  import PageHeader from '../parts/PageHeader.vue'
  import CustomizeNotifications from './common/CustomizeNotifications.vue'
  import SmsNotifications from './sms/SmsNotifications.vue'
  import licenceMixin from '../../../js/common/mixins/licenceMixin'
  import imageMixin from '../../../js/common/mixins/imageMixin'
  import { quillEditor } from 'vue-quill-editor'
  import notifyMixin from '../../../js/backend/mixins/notifyMixin'
  import durationMixin from '../../../js/common/mixins/durationMixin'
  import helperMixin from '../../../js/backend/mixins/helperMixin'
  import DialogManageLanguages from './common/DialogManageLanguages.vue'
  import dateMixin from '../../../js/common/mixins/dateMixin'
  // import DialogNewCustomize from '../parts/DialogNewCustomize.vue'
  import WhatsAppNotifications from './whatsapp/WhatsAppNotifications.vue'
  import eventMixin from '../../../js/backend/mixins/eventMixin'

  export default {
    mixins: [
      licenceMixin,
      imageMixin,
      notifyMixin,
      durationMixin,
      helperMixin,
      dateMixin,
      eventMixin
    ],

    data () {
      return {
        fetched: false,
        notifications: [],
        whatsAppTemplates: [],
        notificationTab: 'email',
        options: {
          entities: {
            customFields: []
          },
          settings: {
            general: {
              usedLanguages: []
            }
          },
          fetched: false
        },
        languagesData: null,
        manageLanguages: false
      }
    },

    created () {
      this.setActiveTab()
      this.getEntities()
      this.inlineSVG()
    },

    mounted () {
      this.inlineSVG()
    },

    methods: {
      getPageUrl () {
        return location.href.substring(0, location.href.lastIndexOf('?')).substring(0, location.href.substring(0, location.href.lastIndexOf('?')).lastIndexOf('/')) + '/'
      },

      getEntities () {
        this.$http.get(`${this.$root.getAjaxUrl}/entities`, {
          params: this.getAppropriateUrlParams({
            lite: true,
            types: ['custom_fields', 'categories', 'coupons', 'settings', 'events']
          })
        }).then(response => {
          this.options.entities = response.data.data
          this.options.entities.events = this.groupRecurringEvents(this.options.entities.events)
          this.options.fetched = true
          this.options.settings.general.usedLanguages = response.data.data.settings.general.usedLanguages
          this.languagesData = response.data.data.settings.languages
          this.getNotifications()
        }).catch(e => {
          console.log(e.message)
          this.fetched = true
          this.options.fetched = true
        })
      },

      getNotifications () {
        this.fetched = false

        this.$http.get(
          `${this.$root.getAjaxUrl}/notifications`
        ).then(response => {
          let notifications = response.data.data.notifications

          notifications.forEach((notification) => {
            if (notification.type === 'email') {
              notification.textMode = notification.content.startsWith('<!-- Content -->')

              notification.content = notification.content.replace('<!-- Content -->', '')
            }
          })

          this.notifications = notifications

          if (response.data.data.whatsAppTemplates) {
            this.whatsAppTemplates = response.data.data.whatsAppTemplates
          }
          this.fetched = true
        }).catch(e => {
          console.log(e.message)
          this.fetched = true
        })
      },

      setActiveTab () {
        let urlParams = this.getUrlQueryParams(window.location.href)

        if ('notificationTab' in urlParams && urlParams.notificationTab === 'sms') {
          this.notificationTab = 'sms'
        }
      },

      saveDialogManageLanguages (usedLanguages) {
        this.manageLanguages = false
        this.options.settings.general.usedLanguages = usedLanguages
        this.usedLanguages = usedLanguages
        this.$http.post(`${this.$root.getAjaxUrl}/settings`, {
          usedLanguages: this.usedLanguages
        }).then(() => {
          this.notify(this.$root.labels.success, this.$root.labels.settings_saved, 'success')
        }).catch((e) => {
          console.log(e)
        })
      }
    },

    computed: {
      needHelpPage () {
        return this.notificationTab === 'email'
          ? 'https://wpamelia.com/notifications/' : 'https://wpamelia.com/sms-notifications/'
      }
    },

    components: {
      LicenceImage,
      WhatsAppNotifications,
      PageHeader,
      CustomizeNotifications,
      SmsNotifications,
      quillEditor,
      DialogManageLanguages
      // DialogNewCustomize
    }
  }
</script>
