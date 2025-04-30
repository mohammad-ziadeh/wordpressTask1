<template>
  <div class="am-sms-purchase-log">

    <!-- Payment History Title -->
    <h2>{{ $root.labels.payment_history }}</h2>
    <!-- /Payment History Title -->

    <!-- Payment History Date Filter -->
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
    <!-- /Payment History Date Filter -->

    <!-- Spinner -->
    <div class="am-spinner am-section" v-if="!fetched">
      <img :src="$root.getUrl + 'public/img/spinner.svg'"/>
    </div>
    <!-- /Spinner -->

    <!-- Payment History Table -->
    <div class="am-sms-purchase-log-list" v-if="fetched && payments.length > 0">

      <!-- SMS History Table Header -->
      <div class="am-sms-purchase-log-list-head">
        <el-row :gutter="16">

          <!-- Date -->
          <el-col :lg="4"><p>{{ $root.labels.date_colon }}</p></el-col>
          <!-- /Date -->

          <!-- Time -->
          <el-col :lg="4"><p>{{ $root.labels.time_colon }}</p></el-col>
          <!-- /Time -->

          <!-- Type -->
          <el-col :lg="4"><p>{{ $root.labels.type_colon }}</p></el-col>
          <!-- /Type -->

          <!-- Payment ID -->
          <el-col :lg="6"><p>{{ $root.labels.payment_id_colon }}</p></el-col>
          <!-- /Payment ID -->

          <!-- Amount -->
          <el-col :lg="3"><p>{{ $root.labels.amount_colon }}</p></el-col>
          <!-- /Amount -->

          <!-- Status -->
          <el-col :lg="3"><p>{{ $root.labels.status_colon }}</p></el-col>
          <!-- /Status -->

        </el-row>
      </div>
      <!-- /SMS History Table Header -->

      <!-- SMS History Table Body -->
      <div class="am-sms-purchase-log-list-body">
        <div class="am-sms-purchase-log-item" v-for="payment in payments">

          <!-- Payment Row -->
          <el-row :gutter="16">

            <!-- Date -->
            <el-col :lg="4" :md="8" :sm="12" :xs="12">
              <p class="am-col-title">{{ $root.labels.date_colon }}</p>
              <span>{{ getFrontedFormattedDate(payment.created_at) }}</span>
            </el-col>
            <!-- /Date -->

            <!-- Time -->
            <el-col :lg="4" :md="8" :sm="12" :xs="12">
              <p class="am-col-title">{{ $root.labels.time_colon }}</p>
              <span>{{ getFrontedFormattedTimeFromDateTimeString(payment.created_at) }}</span>
            </el-col>
            <!-- /Time -->

            <!-- Type -->
            <el-col :lg="4" :md="8" :sm="12" :xs="12">
              <p class="am-col-title">{{ $root.labels.type_colon }}</p>
              <span v-if="!isOrderPaddle(payment.payment_id)">
                <img :src="$root.getUrl + 'public/img/payments/payPal.svg'"/>{{ $root.labels.payPal }}
              </span>
              <span v-if="isOrderPaddle(payment.payment_id)">
                <img :src="$root.getUrl + 'public/img/payments/paddle.png'"/>{{ $root.labels.paddle }}
              </span>
            </el-col>
            <!-- /Type -->

            <!-- Payment ID -->
            <el-col :lg="6" :md="8" :sm="12" :xs="12">
              <p class="am-col-title">{{ $root.labels.payment_id_colon }}</p>
              <el-tooltip class="item" :content="payment.payment_id" placement="top">
                <span>{{ payment.payment_id }}</span>
              </el-tooltip>
            </el-col>
            <!-- /Payment ID -->

            <!-- Amount -->
            <el-col :lg="3" :md="8" :sm="12" :xs="12">
              <p class="am-col-title">{{ $root.labels.amount_colon }}</p>
              <span>${{ getFormattedMessagePrice(payment.amount) }}</span>
            </el-col>
            <!-- /Amount -->

            <!-- Status -->
            <el-col :lg="3" :md="8" :sm="12" :xs="12">
              <p class="am-col-title">{{ $root.labels.status_colon }}</p>
              <span>{{ $root.labels[payment.status] }}</span>
            </el-col>
            <!-- /Status -->

          </el-row>
          <!-- /Payment Row -->

        </div>
      </div>
      <!-- /SMS History Table Body -->

      <!-- Pagination -->
      <pagination-block
          :params="params"
          :count="options.countFiltered"
          :label="$root.labels.payments_lower"
          :visible="fetched && payments.length !== 0"
          @change="getPayments"
      >
      </pagination-block>
      <!-- /Pagination -->

    </div>
    <!-- /Payment History Table -->

    <!-- Empty State For SMS -->
    <div class="am-empty-state am-section" v-show="fetched && payments.length === 0">
      <img :src="$root.getUrl + 'public/img/emptystate.svg'"/>
      <p>{{ $root.labels.no_results }}</p>
    </div>
    <!-- /Empty State For SMS -->

  </div>
</template>

<script>
  import moment from 'moment'
  import dateMixin from '../../../../../js/common/mixins/dateMixin'
  import notificationMixin from '../../../../../js/backend/mixins/notificationMixin'
  import PaginationBlock from '../../../parts/PaginationBlock.vue'
  import notifyMixin from '../../../../../js/backend/mixins/notifyMixin'

  export default {
    mixins: [dateMixin, notificationMixin, notifyMixin],

    data () {
      return {
        date: null,
        fetched: false,
        getPaymentHistory: {
          itemsPerPage: this.$root.settings.general.itemsPerPage,
          page: null,
          startDate: null,
          endDate: null
        },
        options: {
          countFiltered: 0
        },
        params: {
          dates: {
            start: null,
            end: null
          },
          page: 1
        },
        payments: []
      }
    },

    mounted () {
      this.getPayments()
    },

    methods: {
      filterData () {
        this.params.page = 1
        this.getPayments()
      },

      getPayments () {
        this.fetched = false

        this.getPaymentHistory.page = this.params.page

        if (this.params.dates) {
          if (this.params.dates.start) {
            this.getPaymentHistory.startDate = moment(this.params.dates.start).format('YYYY-MM-DD')
          }

          if (this.params.dates.end) {
            this.getPaymentHistory.endDate = moment(this.params.dates.end).format('YYYY-MM-DD')
          }
        }

        this.sendAmeliaSmsApiRequest('getPaymentHistory', this.onGetPaymentHistorySuccess, this.onGetPaymentHistoryError)
      },

      onGetPaymentHistorySuccess (data) {
        this.payments = data.payments
        this.options.countFiltered = data.countFiltered
        this.fetched = true
      },

      onGetPaymentHistoryError () {
        this.notify(this.$root.labels.error, this.$root.labels.payment_history_error, 'error')
        this.fetched = true
      },

      isOrderPaddle (orderId) {
        return /^\d+$/.test(orderId)
      }
    },

    components: {
      PaginationBlock
    }
  }
</script>
