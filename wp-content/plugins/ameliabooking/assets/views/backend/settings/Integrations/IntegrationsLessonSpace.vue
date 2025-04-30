<template>
  <!-- Form -->
  <el-form :model="settings" ref="settings" label-position="top" @submit.prevent="onSubmit">

    <!-- Lesson space apikey -->
    <el-form-item :label="$root.labels.lesson_space_api_key + ':'">
      <el-row :gutter="24">
        <el-col>
          <el-input v-model="settings.apiKey" auto-complete="off"></el-input>
        </el-col>
      </el-row>
    </el-form-item>
    <!-- /Lesson space apikey  -->

    <!-- Appointment Space Name -->
    <el-form-item label="placeholder">
      <label slot="label">
        {{ $root.labels.appointment_space_name }}:
        <el-tooltip placement="top">
          <div slot="content" v-html="$root.labels.appointment_space_name_tt"></div>
          <i class="el-icon-question am-tooltip-icon"></i>
        </el-tooltip>
      </label>
      <el-input v-model="settings.spaceNameAppointments" auto-complete="off"></el-input>
    </el-form-item>
    <!-- /Appointment Space Name -->

    <!-- Inline Placeholders -->
    <el-form-item>
      <inline-placeholders
        :placeholdersNames="[
          'appointmentPlaceholders',
          'categoryPlaceholders',
          'locationPlaceholders',
          'employeePlaceholders',
          'customerPlaceholders',
        ]"
        :excludedPlaceholders="{
          appointmentPlaceholders: [
            '%zoom_host_url%',
            '%zoom_join_url%',
            '%lesson_space_url%',
            '%appointment_cancel_url%'
          ],
          eventPlaceholders: [
            '%event_cancel_url%',
            '%zoom_join_url_date%',
            '%zoom_join_url_date_time%',
            '%zoom_host_url_date%',
            '%zoom_host_url_date_time%',
            '%google_meet_url_date%',
            '%google_meet_url_date_time%',
            '%microsoft_teams_url_date%',
            '%microsoft_teams_url_date_time%',
            '%lesson_space_url_date%',
            '%lesson_space_url_date_time%'
          ]
        }"
        userTypeTab="provider"
      >
      </inline-placeholders>
    </el-form-item>
    <!-- /Inline Placeholders -->

    <!-- Event Space Name -->
    <el-form-item label="placeholder">
      <label slot="label">
        {{ $root.labels.event_space_name }}:
        <el-tooltip placement="top">
          <div slot="content" v-html="$root.labels.event_space_name_tt"></div>
          <i class="el-icon-question am-tooltip-icon"></i>
        </el-tooltip>
      </label>
      <el-input v-model="settings.spaceNameEvents" auto-complete="off"></el-input>
    </el-form-item>
    <!-- /Event Space Name -->

    <!-- Inline Placeholders -->
    <el-form-item>
      <inline-placeholders
          :placeholdersNames="[
          'eventPlaceholders',
          'locationPlaceholders',
          'employeePlaceholders',
        ]"
          :excludedPlaceholders="{
          appointmentPlaceholders: [
            '%zoom_host_url%',
            '%zoom_join_url%',
            '%lesson_space_url%',
            '%appointment_cancel_url%'
          ],
          eventPlaceholders: [
            '%event_cancel_url%',
            '%zoom_join_url_date%',
            '%zoom_join_url_date_time%',
            '%zoom_host_url_date%',
            '%zoom_host_url_date_time%',
            '%google_meet_url_date%',
            '%google_meet_url_date_time%',
            '%microsoft_teams_url_date%',
            '%microsoft_teams_url_date_time%',
            '%lesson_space_url_date%',
            '%lesson_space_url_date_time%'
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
          {{ $root.labels.lesson_space_pending }}
          <el-tooltip placement="top">
            <div slot="content" v-html="$root.labels.lesson_space_pending_tt"></div>
            <i class="el-icon-question am-tooltip-icon"></i>
          </el-tooltip>
        </el-col>
        <el-col :span="4" class="align-right">
          <el-switch
            v-model="settings.pendingAppointments"
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
      lessonSpace: {
        type: Object
      }
    },

    data () {
      return {
        settings: this.lessonSpace
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
