<template>
  <!-- Form -->
  <el-form :model="settings" ref="settings" label-position="top" @submit.prevent="onSubmit">

    <!-- Account ID -->
    <el-form-item :label="$root.labels.zoom_account_id + ':'">
      <el-row :gutter="24">

        <el-col :span="21">
          <el-input v-model.trim="settings.accountId" auto-complete="off"></el-input>
        </el-col>

        <el-col :span="3">
          <el-tooltip class="am-google-calendar-tooltip" placement="top">
            <div slot="content" v-html="$root.labels.zoom_credentials_tooltip"></div>
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
    <!-- /Account ID -->

    <!-- Client ID -->
    <el-form-item :label="$root.labels.zoom_client_id + ':'">
      <el-row :gutter="24">

        <el-col :span="21">
          <el-input v-model.trim="settings.clientId" auto-complete="off"></el-input>
        </el-col>

        <el-col :span="3">
          <el-tooltip class="am-google-calendar-tooltip" placement="top">
            <div slot="content" v-html="$root.labels.zoom_credentials_tooltip"></div>
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
    <el-form-item :label="$root.labels.zoom_client_secret + ':'">
      <el-row :gutter="24">

        <el-col :span="21">
          <el-input v-model.trim="settings.clientSecret" auto-complete="off"></el-input>
        </el-col>

        <el-col :span="3">
          <el-tooltip class="am-google-calendar-tooltip" placement="top">
            <div slot="content" v-html="$root.labels.zoom_credentials_tooltip"></div>
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

    <!-- Meeting Title -->
    <el-form-item label="placeholder">
      <label slot="label">
        {{ $root.labels.meeting_title }}:
        <el-tooltip placement="top">
          <div slot="content" v-html="$root.labels.meeting_title_tooltip"></div>
          <i class="el-icon-question am-tooltip-icon"></i>
        </el-tooltip>
      </label>
      <el-input v-model="settings.meetingTitle" auto-complete="off"></el-input>
    </el-form-item>
    <!-- /Event Title -->

    <!-- Meeting Agenda -->
    <el-form-item label="placeholder">
      <label slot="label">
        {{ $root.labels.meeting_agenda }}:
        <el-tooltip placement="top">
          <div slot="content" v-html="$root.labels.meeting_agenda_tooltip"></div>
          <i class="el-icon-question am-tooltip-icon"></i>
        </el-tooltip>
      </label>
      <el-input v-model="settings.meetingAgenda" type="textarea" auto-complete="off"></el-input>
    </el-form-item>
    <!-- /Meeting Agenda -->

    <!-- Inline Placeholders -->
    <el-form-item>
      <inline-placeholders
        :placeholdersNames="[
          'appointmentPlaceholders',
          'eventPlaceholders',
          'categoryPlaceholders',
          'locationPlaceholders',
          'employeePlaceholders',
          'customerPlaceholders',
        ]"
        :excludedPlaceholders="{
          appointmentPlaceholders: [
            '%zoom_host_url%',
            '%zoom_join_url%',
            '%appointment_cancel_url%'
          ],
          eventPlaceholders: [
            '%event_cancel_url%',
            '%zoom_join_url_date%',
            '%zoom_join_url_date_time%',
            '%zoom_host_url_date%',
            '%zoom_host_url_date_time%'
          ]
        }"
        userTypeTab="provider"
      >
      </inline-placeholders>
    </el-form-item>
    <!-- /Inline Placeholders -->

    <!-- Pending Appointments Meetings -->
    <div class="am-setting-box am-switch-box">
      <el-row type="flex" align="middle" :gutter="24">
        <el-col :span="20">
          {{ $root.labels.pending_appointments_meetings }}
          <el-tooltip placement="top">
            <div slot="content" v-html="$root.labels.pending_appointments_meetings_tooltip"></div>
            <i class="el-icon-question am-tooltip-icon"></i>
          </el-tooltip>
        </el-col>
        <el-col :span="4" class="align-right">
          <el-switch
            v-model="settings.pendingAppointmentsMeetings"
            active-text=""
            inactive-text=""
          >
          </el-switch>
        </el-col>
      </el-row>
    </div>
    <!-- /Pending Appointments Meetings -->

  </el-form>
  <!-- /Form -->
</template>

<script>
  import imageMixin from '../../../../js/common/mixins/imageMixin'
  import InlinePlaceholders from '../../notifications/common/InlinePlaceholders'

  export default {

    mixins: [imageMixin],

    props: {
      zoom: {
        type: Object
      }
    },

    data () {
      return {
        settings: this.zoom
      }
    },

    methods: {
      redirectToDocumentation () {
        window.open('https://wpamelia.com/configuring-zoom/', '_blank')
      }
    },
    components: {InlinePlaceholders}
  }
</script>
