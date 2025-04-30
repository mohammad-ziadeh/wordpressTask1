<template>
    <div>
        <div class="am-dialog-scrollable">

            <!-- Dialog Header -->
            <div class="am-dialog-header">
                <el-row>
                    <el-col :span="20">
                        <h2>{{ $root.labels.appointments_and_events_settings }}</h2>
                    </el-col>
                    <el-col :span="4" class="align-right">
                        <el-button @click="closeDialog" class="am-dialog-close" size="small" icon="el-icon-close"></el-button>
                    </el-col>
                </el-row>
            </div>

            <!-- Form -->
            <el-form :model="settings" ref="settings" label-position="top" @submit.prevent="onSubmit">

                <el-tabs v-model="appointmentsAndEventsTab">

                    <el-tab-pane :label="$root.labels.appointments" name="appointments">

                        <!-- Allow booking if status is pending -->
                        <div class="am-setting-box am-switch-box">
                            <el-row type="flex" align="middle" :gutter="24">
                                <el-col :span="16">
                                    {{ $root.labels.allow_booking_if_pending }}:
                                    <el-tooltip placement="top">
                                      <div slot="content" v-html="$root.labels.allow_booking_if_pending_tooltip"></div>
                                      <i class="el-icon-question am-tooltip-icon"></i>
                                    </el-tooltip>
                                </el-col>
                                <el-col :span="8" class="align-right">
                                    <el-switch
                                        v-model="settings.allowBookingIfPending"
                                        active-text=""
                                        inactive-text=""
                                    ></el-switch>
                                </el-col>
                            </el-row>
                        </div>

                        <!-- Allow customers to book if the minimum isn’t reached -->
                        <div class="am-setting-box am-switch-box">
                            <el-row type="flex" align="middle" :gutter="24">
                                <el-col :span="16">
                                    {{ $root.labels.allow_booking_if_not_min }}:
                                    <el-tooltip placement="top">
                                      <div slot="content" v-html="$root.labels.allow_booking_if_not_min_tooltip"></div>
                                      <i class="el-icon-question am-tooltip-icon"></i>
                                    </el-tooltip>
                                </el-col>
                                <el-col :span="8" class="align-right">
                                    <el-switch
                                        v-model="settings.allowBookingIfNotMin"
                                        active-text=""
                                        inactive-text=""
                                    ></el-switch>
                                </el-col>
                            </el-row>
                        </div>

              <!-- Employee selection logic -->
              <el-form-item :label="$root.labels.employee_selection_logic + ':'" :class="licenceClass()">
                <el-select
                  v-model="settings.employeeSelection"
                  :disabled="notInLicence()"
                >
                  <el-option
                      v-for="item in employeeSelectionOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                  >
                  </el-option>
                </el-select>

                <LicenceBlock/>
              </el-form-item>
                      <!-- Bringing anyone logic -->
                      <div
                          v-if="notInLicence('starter') ? licenceVisible() : true"
                          class="am-setting-box am-switch-box"
                          :class="licenceClass('starter')"
                      >
                        <el-row type="flex" align="middle" :gutter="24">
                          <el-col :span="16">
                            <span>{{ $root.labels.bringing_anyone_logic }}</span>
                          </el-col>
                        </el-row>

                        <el-row style="margin-top: 16px">
                          <el-col class="am-settings-taxes">
                            <div style="padding: 10px">
                              <el-radio v-model="settings.bringingAnyoneLogic" :disabled="notInLicence('starter')" :value="'additional'" :label="'additional'" class="am-settings-taxes-radio">
                                {{$root.labels.bringing_anyone_logic_additional}}
                                <el-tooltip placement="top">
                                  <div slot="content" v-html="$root.labels.bringing_anyone_logic_additional_tt"></div>
                                  <i class="el-icon-question am-tooltip-icon"></i>
                                </el-tooltip>
                              </el-radio>
                            </div>
                            <div style="padding: 10px">
                              <el-radio v-model="settings.bringingAnyoneLogic" :disabled="notInLicence('starter')" :value="'total'" :label="'total'" class="am-settings-taxes-radio">
                                {{$root.labels.bringing_anyone_logic_total}}
                                <el-tooltip placement="top">
                                  <div slot="content" v-html="$root.labels.bringing_anyone_logic_total_tt"></div>
                                  <i class="el-icon-question am-tooltip-icon"></i>
                                </el-tooltip>
                              </el-radio>
                            </div>
                          </el-col>
                        </el-row>

                        <LicenceBlock :licence="'starter'"></LicenceBlock>
                      </div>

                    </el-tab-pane>

                    <el-tab-pane :label="$root.labels.events" name="events" v-if="notInLicence('pro') ? licenceVisible() : true">

                      <!-- Show waiting list slots -->
                        <div
                            class="am-setting-box am-switch-box am-waiting-list-events"
                            v-if="notInLicence('pro') ? licenceVisible() : true"
                            :class="licenceClass('pro')"
                        >
                            <el-row type="flex" align="middle" :gutter="24">
                                <el-col :span="24">
                                    <span>{{ $root.labels.enable_waiting_list }}</span>
                                </el-col>
                                <el-col :span="4" class="align-right">
                                    <el-switch
                                        v-model="settings.waitingListEvents.enabled"
                                        active-text=""
                                        inactive-text=""
                                        :disabled="notInLicence('pro')"
                                    >
                                    </el-switch>
                                </el-col>
                            </el-row>

                            <el-row align="middle" :gutter="24" style="margin-top: 24px" v-if="settings.waitingListEvents.enabled">

                                <!-- Waiting List adding method -->
                                <!--<el-col :span="24">
                                  {{ $root.labels.waiting_list_adding_method }}:
                                </el-col>

                                <el-col :span="24">
                                    <el-radio
                                        label="Manually"
                                        v-model="settings.waitingListEvents.addingMethod"
                                        style="margin-top: 4px;"
                                    >
                                        {{ $root.labels.waiting_list_adding_method_manual }}
                                        <el-tooltip placement="top" :popper-class="'am-tooltip-waiting-list'">
                                          <div slot="content" v-html="$root.labels.waiting_list_adding_method_manual_tt"></div>
                                          <i class="el-icon-question am-tooltip-icon"></i>
                                        </el-tooltip>
                                    </el-radio>
                                </el-col>

                                <el-col :span="24">
                                    <el-radio
                                        label="Automatically"
                                        v-model="settings.waitingListEvents.addingMethod"
                                        style="margin-top: 8px;"
                                        :disabled="true"
                                    >
                                        {{ $root.labels.waiting_list_adding_method_auto }}
                                        <el-tooltip placement="top" :popper-class="'am-tooltip-waiting-list'">
                                          <div slot="content" v-html="$root.labels.waiting_list_adding_method_auto_tt"></div>
                                          <i class="el-icon-question am-tooltip-icon"></i>
                                        </el-tooltip>
                                    </el-radio>
                                </el-col>-->

                                <el-col>
                                    <!-- Waiting List notice -->
                                    <div class="am-waiting-list-notice-box">
                                        <div class="am-waiting-list-notice-box-left">
                                            <img :src="$root.getUrl + 'public/img/am-alert-triangle.svg'" class="am-waiting-list-notice-box-img"/>
                                            <div class="am-waiting-list-notice-box-text">
                                              <p class="am-waiting-list-notice-box-text-title">{{ $root.labels.events_waiting_list_notice_title }}</p>
                                              <p class="am-waiting-list-notice-box-text-subtitle">{{ $root.labels.events_waiting_list_notice_subtitle }}</p>
                                            </div>
                                        </div>
                                        <div class="am-waiting-list-notice-box-right">
                                            <el-button
                                                @click="setWaitingListNotification"
                                                class="am-waiting-list-notice-box-btn"
                                                :disabled="notInLicence('pro')"
                                            >
                                              {{ $root.labels.events_waiting_list_notice_btn_text }}
                                            </el-button>
                                        </div>
                                    </div>
                                </el-col>
                            </el-row>
                          <LicenceBlock :licence="'pro'"></LicenceBlock>
                        </div>
                      <!-- /Show waiting list slots -->
                    </el-tab-pane>

                </el-tabs>

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

  export default {

    mixins: [
      licenceMixin,
      imageMixin
    ],

    props: ['appointments'],

    data () {
      return {
        settings: Object.assign({}, this.appointments),
        appointmentsAndEventsTab: 'appointments',
        employeeSelectionOptions: [
          {
            label: this.$root.labels.employee_selection_logic_random,
            value: 'random'
          },
          {
            label: this.$root.labels.employee_selection_logic_round_robin,
            value: 'roundRobin'
          },
          {
            label: this.$root.labels.employee_selection_logic_highest_price,
            value: 'highestPrice'
          },
          {
            label: this.$root.labels.employee_selection_logic_lowest_price,
            value: 'lowestPrice'
          }
        ],
        bringingAnyoneLogicOptions: [
          {
            label: this.$root.labels.employee_selection_logic_random,
            value: 'additional'
          },
          {
            label: this.$root.labels.employee_selection_logic_round_robin,
            value: 'total'
          }
        ]
      }
    },

    updated () {
      this.inlineSVG()
    },

    mounted () {
      this.inlineSVG()
    },

    methods: {

      closeDialog () {
        this.$emit('closeDialogSettingsAppointments')
      },

      onSubmit () {
        this.$emit('closeDialogSettingsAppointments')
        this.$emit('updateSettings', {'appointments': this.settings})
      },

      setWaitingListNotification () {
        window.location.search = '?page=wpamelia-notifications'
      }

    }
  }
</script>
