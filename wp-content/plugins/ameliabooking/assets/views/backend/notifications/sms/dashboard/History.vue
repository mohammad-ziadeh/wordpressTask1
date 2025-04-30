<template>
  <div class="am-sms-history" v-show="fetchedDashboard">

    <!-- SMS History Title -->
    <h2>{{ $root.labels.sms_history }}</h2>
    <!-- /SMS History Title -->

    <!-- SMS History Date Filter -->
    <v-date-picker
        @input="filterData"
        v-model="params.dates"
        :is-double-paned="false"
        mode='range'
        popover-visibility="focus"
        popover-direction="bottom"
        tint-color='#1A84EE'
        :show-day-popover=false
        :input-props='{class: "el-input__inner"}'
        :is-expanded=false
        :is-required=true
        input-class="el-input__inner"
        :formats="vCalendarFormats"
    >
    </v-date-picker>
    <!-- /SMS History Date Filter -->

    <!-- Spinner -->
    <div class="am-spinner am-section" v-if="!fetched">
      <img :src="$root.getUrl + 'public/img/spinner.svg'"/>
    </div>
    <!-- /Spinner -->

    <!-- SMS History Table -->
    <div class="am-sms-history-list" v-if="fetched && notifications.length > 0">

      <!-- SMS History Table Header -->
      <div class="am-sms-history-list-head">
        <el-row>

          <!-- Date -->
          <el-col :lg="3"><p>{{ $root.labels.date_colon }}</p></el-col>
          <!-- /Date -->

          <!-- Time -->
          <el-col :lg="2"><p>{{ $root.labels.time_colon }}</p></el-col>
          <!-- /Time -->

          <!-- Phone -->
          <el-col :lg="4"><p>{{ $root.labels.phone_colon }}</p></el-col>
          <!-- /Phone -->

          <!-- User -->
          <el-col :lg="4"><p>{{ $root.labels.user_colon }}</p></el-col>
          <!-- /User -->

          <!-- Cost -->
          <el-col :lg="2"><p>{{ $root.labels.cost_colon }}</p></el-col>
          <!-- /Cost -->

          <!-- Segments -->
          <el-col :lg="3"><p>{{ $root.labels.segments_colon }}</p></el-col>
          <!-- /Segments -->

          <!-- Status -->
          <el-col :lg="3"><p>{{ $root.labels.status_colon }}</p></el-col>
          <!-- /Status -->

          <!-- Text -->
          <el-col :lg="3"><p>{{ $root.labels.text_colon }}</p></el-col>
          <!-- /Text -->

        </el-row>
      </div>
      <!-- /SMS History Table Header -->

      <!-- SMS History Table Body -->
      <div class="am-sms-history-list-body">
        <el-collapse>
          <el-collapse-item
              v-for="notification in notifications"
              :key="notification.id"
              :name="notification.id"
              class="am-sms-message"
              :class="{ 'am-sms-message-failed': notification.status === 'failed', 'am-sms-message-queued': ['queued', 'loading'].includes(notification.status) || (['delivered', 'undelivered', 'sent'].includes(notification.status) && !notification.price)}"
          >

            <!-- SMS Message Row -->
            <template slot="title">
              <el-row class="am-sms-history-data" :gutter="10">

                <!-- Date -->
                <el-col :lg="3" :md="8" :sm="12" :xs="12">
                  <p class="am-col-title">{{ $root.labels.date_colon }}</p>
                  <span>{{ getFrontedFormattedDate(notification.dateTime) }}</span>
                </el-col>
                <!-- /Date -->

                <!-- Time -->
                <el-col :lg="2" :md="8" :sm="12" :xs="12">
                  <p class="am-col-title">{{ $root.labels.time_colon }}</p>
                  <span>{{ getFrontedFormattedTimeFromDateTimeString(notification.dateTime) }}</span>
                </el-col>
                <!-- /Time -->

                <!-- Phone -->
                <el-col :lg="4" :md="8" :sm="12" :xs="12">
                  <p class="am-col-title">{{ $root.labels.phone_colon }}</p>
                  <span class="am-three-dots">{{ notification.phone }}</span>
                </el-col>
                <!-- /Phone -->

                <!-- User -->
                <el-col :lg="4" :md="8" :sm="12" :xs="12">
                  <p class="am-col-title">{{ $root.labels.user_colon }}</p>
                  <span class="am-three-dots">{{ notification.userFullName }}</span>
                </el-col>
                <!-- /User -->

                <!-- Cost -->
                <el-col :lg="2" :md="8" :sm="12" :xs="12">
                  <p class="am-col-title">{{ $root.labels.cost_colon }}</p>
                  <span>{{ notification.price ? '$' + getFormattedMessagePrice(notification.price, false) : '-' }}</span>
                  <el-tooltip
                      placement="top"
                      v-if="['delivered', 'undelivered', 'sent'].includes(notification.status) && !notification.price && refreshSMSHistory.logId === null"
                  >
                    <div slot="content" v-html="$root.labels.refresh"></div>
                    <i class="el-icon-refresh am-tooltip-icon"
                       @click.stop
                       @click="refreshHistoryRow(notification)"
                    ></i>
                  </el-tooltip>
                </el-col>
                <!-- /Cost -->

                <!-- Segments -->
                <el-col :lg="3" :md="8" :sm="12" :xs="12">
                  <p class="am-col-title">{{ $root.labels.segments_colon }}</p>
                  <span>{{ notification.segments ? notification.segments : '-' }}</span>
                </el-col>
                <!-- /Segments -->

                <!-- Status -->
                <el-col :lg="3" :md="8" :sm="12" :xs="12">
                  <p class="am-col-title">{{ $root.labels.status_colon }}</p>
                  <span>{{ $root.labels[notification.status] }}</span>
                  <el-tooltip
                      placement="top"
                      v-if="notification.status === 'queued' && refreshSMSHistory.logId === null"
                  >
                    <div slot="content" v-html="$root.labels.refresh"></div>
                    <i class="el-icon-refresh am-tooltip-icon"
                       @click.stop
                       @click="refreshHistoryRow(notification)"
                    ></i>
                  </el-tooltip>
                </el-col>
                <!-- /Status -->

                <!-- View Message -->
                <el-col :lg="3" :md="8">
                  <p class="am-col-title">&nbsp;</p>
                  <span class="am-link">
                    <img :src="$root.getUrl + 'public/img/sms-message.svg'"/> {{ documentWidth > xLargeMax || documentWidth < largeMin  ? $root.labels.view_message : $root.labels.view }}
                  </span>
                </el-col>
                <!-- /View Message -->

              </el-row>

            </template>
            <!-- /SMS Message Row -->

            <!-- SMS Message Text -->
            <div class="am-sms-message-text">
              <el-input v-model="notification.text" type="textarea" :rows="7" placeholder=""></el-input>
            </div>
            <!-- /SMS Message Text -->

          </el-collapse-item>
        </el-collapse>
      </div>
      <!-- /SMS History Table Body -->

      <!-- Pagination -->
      <pagination-block
          :params="params"
          :count="options.countFiltered"
          :label="$root.labels.messages_lower"
          :visible="fetched && notifications.length !== 0"
          @change="getHistory"
      >
      </pagination-block>
      <!-- /Pagination -->

    </div>
    <!-- /SMS History Table -->

    <!-- Empty State For SMS -->
    <div class="am-empty-state am-section" v-show="fetched && notifications.length === 0">
      <img :src="$root.getUrl + 'public/img/emptystate.svg'"/>
      <p>{{ $root.labels.no_results }}</p>
    </div>
    <!-- /Empty State For SMS -->

  </div>
</template>
<script>
  import moment from 'moment'
  import Form from 'form-object'
  import dateMixin from '../../../../../js/common/mixins/dateMixin'
  import PaginationBlock from '../../../parts/PaginationBlock.vue'
  import notificationMixin from '../../../../../js/backend/mixins/notificationMixin'
  import responsiveMixin from '../../../../../js/common/mixins/responsiveMixin'
  import imageMixin from '../../../../../js/common/mixins/imageMixin'

  export default {
    mixins: [dateMixin, notificationMixin, responsiveMixin, imageMixin],

    props: {
      fetchedDashboard: {
        type: Boolean,
        default: false
      }
    },

    data () {
      return {
        fetched: false,
        form: new Form(),
        notifications: [],
        options: {
          countFiltered: 0
        },
        params: {
          dates: this.getDatePickerNegativeInitRange(),
          page: 1
        },
        refreshSMSHistory: {
          logId: null,
          historyId: null
        }
      }
    },

    created () {
      Form.defaults.axios = this.$http
    },

    mounted () {
      this.getHistory()
    },

    methods: {
      filterData () {
        this.params.page = 1
        this.getHistory()
      },

      getHistory () {
        this.fetched = false

        let params = JSON.parse(JSON.stringify(this.params))
        let dates = []

        if (params.dates) {
          if (params.dates.start) {
            dates.push(moment(params.dates.start).format('YYYY-MM-DD'))
          }

          if (params.dates.end) {
            dates.push(moment(params.dates.end).format('YYYY-MM-DD'))
          }

          params.dates = dates
        }

        Object.keys(params).forEach((key) => (!params[key] && params[key] !== 0) && delete params[key])

        this.$http.get(`${this.$root.getAjaxUrl}/notifications/sms/history`, {
          params: this.getAppropriateUrlParams(params)
        }).then(response => {
          this.notifications = response.data.data.notifications
          this.options.countFiltered = response.data.data.countFiltered
          this.fetched = true
          this.$emit('fetchedHistory')
        }).catch(e => {
          console.log(e.message)
          this.fetched = true
        })
      },

      refreshHistoryRow (notification) {
        this.refreshSMSHistory.logId = notification.logId
        this.refreshSMSHistory.historyId = notification.id
        notification.status = 'loading'
        this.sendAmeliaSmsApiRequest('refreshSMSHistory', this.onRefreshHistoryRowSuccess, this.onRefreshHistoryRowError)
      },

      onRefreshHistoryRowSuccess (data) {
        this.form.post(
          `${this.$root.getAjaxUrl}/notifications/sms/history/${this.refreshSMSHistory.historyId}`, data.message
        ).then(() => {
          let notification = this.notifications.find(notification => notification.id === this.refreshSMSHistory.historyId)
          notification.status = data.message.status
          notification.price = data.message.price
          this.refreshSMSHistory = {
            logId: null,
            historyId: null
          }
        }).catch(() => {
          this.refreshSMSHistory = {
            logId: null,
            historyId: null
          }
        })
      },

      onRefreshHistoryRowError (data) {
        console.log('error')
        console.log(data)
      }
    },

    components: {
      PaginationBlock
    }
  }
</script>

