<template>

  <!-- Dialog Settings Integrations -->
  <div>

    <!-- Dialog -->
    <div class="am-dialog-scrollable">

      <!-- Dialog Header -->
      <div class="am-dialog-header">
        <el-row>
          <el-col :span="20">
            <h2>
              {{ $root.labels.integrations_settings }}
            </h2>
          </el-col>
          <el-col :span="4" class="align-right">
            <el-button @click="closeDialog" class="am-dialog-close" size="small" icon="el-icon-close"></el-button>
          </el-col>
        </el-row>
      </div>
      <!-- /Dialog Header -->

      <!-- Form -->
      <el-form label-position="top" @submit.prevent="onSubmit">

        <!-- Tabs -->
        <el-tabs v-model="activeTab">

          <!-- Google Calendar -->
          <el-tab-pane
            v-if="notInLicence() ? licenceVisible() : true"
            :label="$root.labels.google_calendar"
            name="googleCalendar"
          >
            <LicenceBlockHeader/>

            <google-calendar
              :class="licenceClassDisabled()"
              :googleCalendar="googleCalendarSettings"
              @openDialog="openDialog"
            />
          </el-tab-pane>
          <!-- /Google Calendar -->

          <!-- Outlook Calendar -->
          <el-tab-pane
            v-if="notInLicence() ? licenceVisible() : true"
            :label="$root.labels.outlook_calendar"
            name="outlookCalendar"
          >
            <LicenceBlockHeader/>

            <outlook-calendar
              :class="licenceClassDisabled()"
              :outlookCalendar="outlookCalendarSettings"
              @openDialog="openDialog"
            />
          </el-tab-pane>
          <!-- /Outlook Calendar -->

          <!-- Apple Calendar -->
          <el-tab-pane
            v-if="notInLicence() ? licenceVisible() : true"
            :label="$root.labels.apple_calendar"
            name="appleCalendar"
            >
            <LicenceBlockHeader/>

            <apple-calendar
              :class="licenceClassDisabled()"
              :appleCalendar="appleCalendarSettings"
              @openDialog="openDialog"
            />
          </el-tab-pane>
          <!-- /Apple Calendar -->

          <!-- Zoom -->
          <el-tab-pane
            v-if="notInLicence() ? licenceVisible() : true"
            :label="$root.labels.zoom"
            name="zoom"
          >
            <LicenceBlockHeader/>

            <zoom
              :class="licenceClassDisabled()"
              :zoom="zoomSettings"
            />
          </el-tab-pane>
          <!-- /Zoom -->

          <!-- Web Hooks -->
          <el-tab-pane
            v-if="notInLicence() ? licenceVisible() : true"
            :label="$root.labels.web_hooks"
            name="webHooks"
          >
            <LicenceBlockHeader/>

            <web-hooks
              :class="licenceClassDisabled()"
              :webHooks="webHooksSettings"
            />
          </el-tab-pane>
          <!-- /Web Hooks -->

          <!-- Marketing -->
          <el-tab-pane
            v-if="notInLicence('starter') ? licenceVisible() : true"
            :label="$root.labels.marketing_tools"
            name="marketing"
          >
            <LicenceBlockHeader :licence="'starter'"/>

            <marketing
              :class="licenceClassDisabled('starter')"
              :facebookPixel="facebookPixelSettings"
              :googleAnalytics="googleAnalyticsSettings"
              :googleTag="googleTagSettings"
            />
          </el-tab-pane>
          <!-- /Marketing -->

          <!-- Lesson Space -->
          <el-tab-pane
            v-if="notInLicence('starter') ? licenceVisible() : true"
            :label="$root.labels.lesson_space"
            name="lessonSpace"
          >
            <LicenceBlockHeader :licence="'starter'"/>

            <lesson-space
              :class="licenceClassDisabled('starter')"
              :lessonSpace="lessonSpaceSettings"
            />
          </el-tab-pane>
          <!-- /Lesson Space -->

        </el-tabs>
        <!-- /Tabs -->

      </el-form>
      <!-- /Form -->

    </div>
    <!-- /Dialog -->

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
    <!-- /Dialog Footer -->

  </div>
  <!-- /Dialog Settings Integrations -->

</template>

<script>
  import GoogleCalendar from './Integrations/IntegrationsGoogleCalendar.vue'
  import licenceMixin from '../../../js/common/mixins/licenceMixin'
  import imageMixin from '../../../js/common/mixins/imageMixin'
  import OutlookCalendar from './Integrations/IntegrationsOutlookCalendar.vue'
  import WebHooks from './Integrations/IntegrationsWebHooks.vue'
  import Zoom from './Integrations/IntegrationsZoom.vue'
  import Marketing from './Integrations/IntegrationsMarketing.vue'
  import LessonSpace from './Integrations/IntegrationsLessonSpace.vue'
  import AppleCalendar from "./Integrations/IntegrationsAppleCalendar.vue";

  export default {
    components: {
      AppleCalendar,
      GoogleCalendar,
      OutlookCalendar,
      Zoom,
      WebHooks,
      Marketing,
      LessonSpace
    },

    props: {
      googleCalendar: {
        type: Object
      },
      outlookCalendar: {
        type: Object
      },
      appleCalendar: {
        type: Object
      },
      zoom: {
        type: Object
      },
      webHooks: {
        type: Array
      },
      facebookPixel: {
        type: Object
      },
      googleAnalytics: {
        type: Object
      },
      googleTag: {
        type: Object
      },
      lessonSpace: {
        type: Object
      }
    },

    mixins: [
      licenceMixin,
      imageMixin
    ],

    data () {
      return {
        googleCalendarSettings: Object.assign({}, this.googleCalendar),
        outlookCalendarSettings: Object.assign({}, this.outlookCalendar),
        appleCalendarSettings: Object.assign({}, this.appleCalendar),
        zoomSettings: Object.assign({}, this.zoom),
        lessonSpaceSettings: Object.assign({}, this.lessonSpace),
        googleAnalyticsSettings: Object.assign({}, this.googleAnalytics),
        facebookPixelSettings: Object.assign({}, this.facebookPixel),
        googleTagSettings: Object.assign({}, this.googleTag),
        webHooksSettings: this.webHooks.map((webHook) => webHook),
        activeTab: this.notInLicence() ? 'marketing' : 'googleCalendar'
      }
    },

    methods: {
      openDialog (name) {
        this.$emit('openDialog', name)
      },

      closeDialog () {
        this.$emit('closeDialogSettingsIntegrations')
      },

      onSubmit () {
        ['facebookPixelSettings', 'googleAnalyticsSettings', 'googleTagSettings'].forEach((vendor) => {
          ['appointment', 'package', 'event'].forEach((type) => {
            switch (vendor) {
              case ('facebookPixelSettings'):
                this[vendor].tracking[type] = this[vendor].tracking[type].filter(item => item.type.trim() && item.event.trim())

                break
              case ('googleAnalyticsSettings'):
                this[vendor].tracking[type] = this[vendor].tracking[type].filter(item => item.type.trim() && item.event.trim())

                break
              case ('googleTagSettings'):
                this[vendor].tracking[type] = this[vendor].tracking[type].filter(item => item.type.trim() && item.category.trim() && item.action.trim())

                break
            }
          })
        })

        this.$emit('closeDialogSettingsIntegrations')
        this.$emit('updateSettings', {
          'googleCalendar': this.googleCalendarSettings,
          'outlookCalendar': this.outlookCalendarSettings,
          'appleCalendar': this.appleCalendarSettings,
          'zoom': this.zoomSettings,
          'webHooks': this.webHooksSettings,
          'facebookPixel': this.facebookPixelSettings,
          'googleAnalytics': this.googleAnalyticsSettings,
          'googleTag': this.googleTagSettings,
          'lessonSpace': this.lessonSpaceSettings
        })
      }
    }
  }
</script>
