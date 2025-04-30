<template>

  <!-- Integration Outlook Calendar -->
  <el-form :model="settings" ref="settings" label-position="top" @submit.prevent="onSubmit">

    <!-- SSL Alert -->
    <el-alert
        v-if="showSSLAlert"
        type="warning"
        show-icon
        title=""
        :description="$root.labels.outlook_ssl_warning"
        :closable="false"
    />
    <!-- /SSL Alert -->

    <!-- Client ID -->
    <el-form-item :label="$root.labels.outlook_client_id + ':'">
      <el-row :gutter="24">
        <el-col :span="21">
          <el-input v-model.trim="settings.clientID" auto-complete="off"></el-input>
        </el-col>
        <el-col :span="3">
          <el-tooltip class="am-google-calendar-tooltip" effect="dark" placement="top">
            <div slot="content" v-html="$root.labels.outlook_credentials_obtain"></div>
            <el-button
                class="am-google-calendar-button am-button-icon"
                type="primary"
                @click="redirectToDocumentation()"
            >
              <img class="svg-amelia" :src="$root.getUrl + 'public/img/question.svg'"/>
            </el-button>
          </el-tooltip>
        </el-col>
      </el-row>
    </el-form-item>
    <!-- /Client ID -->

    <!-- Client Secret -->
    <el-form-item :label="$root.labels.outlook_client_secret + ':'">
      <el-row :gutter="24">
        <el-col :span="21">
          <el-input v-model.trim="settings.clientSecret" auto-complete="off"></el-input>
        </el-col>
        <el-col :span="3">
          <el-tooltip class="am-google-calendar-tooltip" effect="dark" placement="top">
            <div slot="content" v-html="$root.labels.outlook_credentials_obtain"></div>
            <el-button
                class="am-google-calendar-button am-button-icon"
                type="primary"
                @click="redirectToDocumentation()"
            >
              <img class="svg-amelia" :src="$root.getUrl + 'public/img/question.svg'"/>
            </el-button>
          </el-tooltip>
        </el-col>
      </el-row>
    </el-form-item>
    <!-- /Client Secret -->

    <!-- Redirect URI -->
    <el-form-item label="placeholder">
      <label slot="label">
        {{ $root.labels.outlook_redirect_uri }}:
        <el-tooltip placement="top">
          <div slot="content" v-html="$root.labels.outlook_redirect_uri_tooltip"></div>
          <i class="el-icon-question am-tooltip-icon"></i>
        </el-tooltip>
      </label>
      <el-input v-model="settings.redirectURI" auto-complete="off"></el-input>
    </el-form-item>
    <!-- /Redirect URI -->

    <!-- Title & Description -->
    <el-collapse>
      <el-collapse-item class="am-setting-box">
        <template slot="title">
          <p>{{ $root.labels.event_title_and_description }}:</p>
        </template>
        <template>
          <el-tabs v-model="activeTab">
            <el-tab-pane :label="$root.labels.appointments" name="appointments">
              <!-- Event Title -->
              <el-form-item label="placeholder">
                <label slot="label">
                  {{ $root.labels.event_title }}:
                  <el-tooltip placement="top">
                    <div slot="content" v-html="$root.labels.event_title_tooltip"></div>
                    <i class="el-icon-question am-tooltip-icon"></i>
                  </el-tooltip>
                </label>
                <el-input v-model="settings.title.appointment" auto-complete="off"></el-input>
              </el-form-item>
              <!-- /Event Title -->

              <!-- Event Description -->
              <el-form-item label="placeholder">
                <label slot="label">
                  {{ $root.labels.event_description }}:
                  <el-tooltip placement="top">
                    <div slot="content" v-html="$root.labels.event_description_tooltip"></div>
                    <i class="el-icon-question am-tooltip-icon"></i>
                  </el-tooltip>
                </label>
                <el-input v-model="settings.description.appointment" type="textarea" auto-complete="off"></el-input>
              </el-form-item>
              <!-- /Event Description -->

              <!-- Inline Placeholders -->
              <el-form-item>
                <inline-placeholders
                    :placeholdersNames="[
                      'appointmentPlaceholders',
                      'categoryPlaceholders',
                      'companyPlaceholders',
                      'customerPlaceholders',
                      'employeePlaceholders',
                      'locationPlaceholders'
                    ]"
                  :excludedPlaceholders="{
                    appointmentPlaceholders: [
                      '%zoom_host_url%',
                      '%appointment_cancel_url%',
                      '%reservation_name%',
                      '%reservation_description%'
                    ]
                  }"
                  userTypeTab="provider"
                  >
                </inline-placeholders>
              </el-form-item>
              <!-- /Inline Placeholders -->

              <el-row class="am-customize-notifications-combined">
                <el-col :span="16">
                  <div class="am-customize-notifications-combined-tooltip">
                    <strong>{{ $root.labels.ph_group_appointment_details }}</strong>
                    %group_appointment_details%
                    <el-tooltip placement="top">
                      <div slot="content" v-html="$root.labels.ph_group_appointments_tooltip"></div>
                      <i class="el-icon-question am-tooltip-icon"></i>
                    </el-tooltip>
                  </div>
                </el-col>

                <el-col :span="8" class="am-align-right">
                  <p class="am-blue-link" @click="openDialog('groupAppointmentPlaceholder')">
                    {{ $root.labels.configure }}
                  </p>
                </el-col>
              </el-row>

            </el-tab-pane>

            <el-tab-pane :label="$root.labels.events" name="events">
              <!-- Event Title -->
              <el-form-item label="placeholder">
                <label slot="label">
                  {{ $root.labels.event_title }}:
                  <el-tooltip placement="top">
                    <div slot="content" v-html="$root.labels.event_title_tooltip"></div>
                    <i class="el-icon-question am-tooltip-icon"></i>
                  </el-tooltip>
                </label>
                <el-input v-model="settings.title.event" auto-complete="off"></el-input>
              </el-form-item>
              <!-- /Event Title -->

              <!-- Event Description -->
              <el-form-item label="placeholder">
                <label slot="label">
                  {{ $root.labels.event_description }}:
                  <el-tooltip placement="top">
                    <div slot="content" v-html="$root.labels.event_description_tooltip"></div>
                    <i class="el-icon-question am-tooltip-icon"></i>
                  </el-tooltip>
                </label>
                <el-input v-model="settings.description.event" type="textarea" auto-complete="off"></el-input>
              </el-form-item>
              <!-- /Event Description -->

              <!-- Inline Placeholders -->
              <el-form-item>
                <inline-placeholders
                    :placeholdersNames="[
                      'eventPlaceholders',
                      'companyPlaceholders',
                      'customerPlaceholders',
                      'employeePlaceholders',
                      'locationPlaceholders'
                    ]"

                    :excludedPlaceholders="{
                        eventPlaceholders: [
                          '%zoom_host_url%',
                          '%event_cancel_url%',
                          '%reservation_name%',
                          '%reservation_description%',
                          '%event_deposit_payment%',
                          '%event_tickets%'
                        ],
                        employeePlaceholders: [
                          '%employee_panel_url%'
                        ]
                    }"
                    userTypeTab="provider"
                >
                </inline-placeholders>
              </el-form-item>
              <!-- /Inline Placeholders -->

              <el-row class="am-customize-notifications-combined">
                <el-col :span="16">
                  <div class="am-customize-notifications-combined-tooltip">
                    <strong>{{ $root.labels.ph_group_event_details }}</strong>
                    %group_event_details%
                    <el-tooltip placement="top">
                      <div slot="content" v-html="$root.labels.ph_group_appointments_tooltip"></div>
                      <i class="el-icon-question am-tooltip-icon"></i>
                    </el-tooltip>
                  </div>
                </el-col>

                <el-col :span="8" class="am-align-right">
                  <p class="am-blue-link" @click="openDialog('groupEventPlaceholder')">
                    {{ $root.labels.configure }}
                  </p>
                </el-col>
              </el-row>

            </el-tab-pane>
          </el-tabs>
        </template>
      </el-collapse-item>
    </el-collapse>
    <!-- /Event Title & Description -->

    <!-- Enable Microsoft Teams -->
    <div class="am-setting-box am-switch-box">
      <el-row type="flex" align="middle" :gutter="24">
        <el-col :span="20">
          {{ $root.labels.enable_microsoft_teams }}
          <el-tooltip placement="top">
            <div slot="content" v-html="$root.labels.enable_microsoft_teams_tooltip"></div>
            <i class="el-icon-question am-tooltip-icon"></i>
          </el-tooltip>
        </el-col>
        <el-col :span="4" class="align-right">
          <el-switch
              v-model="settings.enableMicrosoftTeams"
              active-text=""
              inactive-text=""
          >
          </el-switch>
        </el-col>
      </el-row>
    </div>
    <!-- /Enable Microsoft Teams -->

    <!-- Insert Pending Appointments -->
    <div class="am-setting-box am-switch-box">
      <el-row type="flex" align="middle" :gutter="24">
        <el-col :span="20">
          {{ $root.labels.insert_pending_appointments }}
          <el-tooltip placement="top">
            <div slot="content" v-html="$root.labels.insert_pending_appointments_tooltip"></div>
            <i class="el-icon-question am-tooltip-icon"></i>
          </el-tooltip>
        </el-col>
        <el-col :span="4" class="align-right">
          <el-switch
              v-model="settings.insertPendingAppointments"
              active-text=""
              inactive-text=""
          >
          </el-switch>
        </el-col>
      </el-row>
    </div>
    <!-- /Insert Pending Appointments -->

    <!-- Add Event's Attendees -->
    <div class="am-setting-box am-switch-box">
      <el-row type="flex" align="middle" :gutter="24">
        <el-col :span="20">
          {{ $root.labels.customers_as_attendees }}
          <el-tooltip placement="top">
            <div slot="content" v-html="$root.labels.customers_as_attendees_tooltip"></div>
            <i class="el-icon-question am-tooltip-icon"></i>
          </el-tooltip>
        </el-col>
        <el-col :span="4" class="align-right">
          <el-switch
              v-model="settings.addAttendees"
              active-text=""
              inactive-text=""
              @change="onChangeAddAttendees()"
          >
          </el-switch>
        </el-col>
      </el-row>
    </div>
    <!-- /Add Event's Attendees -->

    <!-- Remove Outlook Calendar Busy Slots -->
    <div class="am-setting-box am-switch-box">
      <el-row type="flex" align="middle" :gutter="24">
        <el-col :span="20">
          {{ $root.labels.remove_outlook_busy_slots }}
          <el-tooltip placement="top">
            <div slot="content" v-html="$root.labels.remove_outlook_busy_slots_tooltip"></div>
            <i class="el-icon-question am-tooltip-icon"></i>
          </el-tooltip>
        </el-col>
        <el-col :span="4" class="align-right">
          <el-switch
              v-model="settings.removeOutlookCalendarBusySlots"
              active-text=""
              inactive-text=""
          >
          </el-switch>
        </el-col>
      </el-row>
    </div>
    <!-- /Remove Outlook Calendar Busy Slots -->

    <!-- Include Buffer time in Outlook events -->
    <div class="am-setting-box am-switch-box">
      <el-row type="flex" align="middle" :gutter="24">
        <el-col :span="20">
          {{ $root.labels.include_buffer_time_outlook }}
          <el-tooltip placement="top">
            <div slot="content" v-html="$root.labels.include_buffer_time_outlook_tooltip"></div>
            <i class="el-icon-question am-tooltip-icon"></i>
          </el-tooltip>
        </el-col>
        <el-col :span="4" class="align-right">
          <el-switch
              v-model="settings.includeBufferTimeOutlookCalendar"
              active-text=""
              inactive-text=""
          >
          </el-switch>
        </el-col>
      </el-row>
    </div>
    <!-- /Include Buffer time in Outlook events -->

    <!-- Maximum Number Of Events Returned -->
    <el-form-item label="placeholder">
      <label slot="label">
        {{ $root.labels.number_of_events_returned }}:
        <el-tooltip placement="top">
          <div slot="content" v-html="$root.labels.number_of_events_returned_tooltip"></div>
          <i class="el-icon-question am-tooltip-icon"></i>
        </el-tooltip>
      </label>
      <el-select
          v-model="settings.maximumNumberOfEventsReturned"
          :disabled="!settings.removeOutlookCalendarBusySlots"
      >
        <el-option
            v-for="item in options.maximumNumberOfEventsReturned"
            :key="item"
            :label="item"
            :value="item">
        </el-option>
      </el-select>
    </el-form-item>
    <!-- /Maximum Number Of Events Returned -->

  </el-form>
  <!-- /Integration Outlook Calendar -->

</template>

<script>
  import imageMixin from '../../../../js/common/mixins/imageMixin'
  import InlinePlaceholders from '../../notifications/common/InlinePlaceholders'

  export default {
    props: {
      outlookCalendar: {
        type: Object
      }
    },

    mixins: [
      imageMixin
    ],

    data () {
      return {
        options: {
          maximumNumberOfEventsReturned: [50, 100, 200, 500, 999]
        },
        settings: this.outlookCalendar,
        activeTab: 'appointments'
      }
    },

    computed: {
      showSSLAlert () {
        return location.protocol !== 'https:'
      }
    },

    methods: {
      onChangeAddAttendees () {
        if (this.settings.addAttendees === false) {
          this.settings.sendEventInvitationEmail = false
        }
      },

      openDialog(name) {
        this.$emit('openDialog', name)
      },

      redirectToDocumentation () {
        window.open('https://wpamelia.com/configuring-outlook-calendar/', '_blank')
      }
    },
    components: {InlinePlaceholders}
  }
</script>
