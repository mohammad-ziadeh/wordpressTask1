<template>
  <div class="am-dialog-table">
    <div v-if="appointment.bookings.length > 0">
      <div v-for="booking in appointment.bookings" class="am-customer-extras" v-if="booking.id">
        <el-row class="am-customer-extras-data">
          <el-col>
            <h3 :class="getNoShowClass(booking.customerId)">{{ booking.customer.firstName }} {{ booking.customer.lastName }}</h3>
            <span>{{ booking.customer.email }}</span>
          </el-col>
        </el-row>

        <div class="am-appointment-payments-dialog">
          <el-row class="am-customer-extras-payment" :gutter="10">
            <el-col :span="12">
              <span class="am-strong">{{ $root.labels.payment }}</span>
            </el-col>
            <el-col :span="12">
              <span class="am-link" @click="showDialogEditPayment(booking.payments[0], booking)">
                {{ $root.labels.edit_payment_details }}
              </span>
            </el-col>
            <el-col :span="12">
              <span>{{ $root.labels.date }}:</span>
            </el-col>
            <el-col :span="12">
              <el-row v-for="payment in booking.payments" :key="payment.id">
                <span class="am-semi-strong" >{{ getFrontedFormattedDate(payment.dateTime) }}</span>
              </el-row>
            </el-col>
            <el-col :span="12">
                <span>{{ $root.labels.payment_method }}:</span>
            </el-col>
            <el-col :span="12">
              <el-row v-for="(payment, index) in booking.payments" :key="payment.id" align="center">
                <span class="am-semi-strong" :key="payment.id">
                    <img class="svg-amelia"  :style="{width: getPaymentIconWidth(payment.gateway), verticalAlign: 'middle'}"
                         :src="$root.getUrl + 'public/img/payments/' + getPaymentIconName(payment)"/>
                    <span v-if="!longNamePayments(payment.gateway)">{{ getPaymentGatewayNiceName(payment) }}</span>
                  </span>
              </el-row>
            </el-col>
            <el-col :span="12" v-if="booking.payments.find(p => p.wcOrderId) && !isCabinet">
              <span>{{ $root.labels.wc_order }}:</span>
            </el-col>
            <el-col :span="12" v-if="booking.payments.find(p => p.wcOrderId) && !isCabinet">
              <el-row v-for="payment in booking.payments" :key="payment.id">
                <a :href="payment.wcOrderUrl" target="_blank">
                  #{{ payment.wcOrderId }}
                </a>
              </el-row>
            </el-col>

            <el-col :span="12">
              <span>{{ $root.labels.status }}:</span>
            </el-col>
            <el-col :span="12">
              <el-row v-for="payment in booking.payments" :key="payment.id">
                <span class="am-semi-strong am-payment-status">
                 <span :class="'am-payment-status-symbol am-payment-status-symbol-' + payment.status"></span>
                  {{ getPaymentStatusNiceName(payment.status) }}
                </span>
              </el-row>
            </el-col>

            <el-col :span="12" v-if="booking.packageCustomerService">
              <span>{{ $root.labels.package }}:</span>
            </el-col>
            <el-col :span="12" v-if="booking.packageCustomerService" class="am-payment-package-name">
              <img
                :src="$root.getUrl + 'public/img/am-package.svg'"
              >
                <span class="am-semi-strong">
                  {{(pack = getPackageById(booking.packageCustomerService.packageCustomer.packageId)) ? pack.name : 'Package' }}
                </span>
            </el-col>
          </el-row>

          <el-row :gutter="10" class="subtotal" v-if="!booking.packageCustomerService">
            <el-col :span="14" class="align-right">
              {{ $root.labels.price }}:
            </el-col>
            <el-col :span="10" class="align-right">
              {{ getFormattedPrice(booking.serviceTotalPrice) }}
            </el-col>

            <el-col :span="14" class="align-right">
              {{ $root.labels.extras }}:
            </el-col>
            <el-col :span="10" class="align-right">
              {{ getFormattedPrice(booking.extrasTotalPrice) }}
            </el-col>

            <el-col :span="14" class="align-right">
              <span>{{ $root.labels.subtotal }}:</span>
            </el-col>
            <el-col :span="10" class="align-right">
              <span>{{ getFormattedPrice(getBookingSubtotal(booking)) }}</span>
            </el-col>

            <el-col :span="14" class="align-right">
              {{ $root.labels.discount_amount }}:
            </el-col>
            <el-col :span="10" class="align-right">
              {{ getFormattedPrice((discount = getBookingDiscount(booking)) > (subtotal = getBookingSubtotal(booking)) ? subtotal : discount) }}
            </el-col>

            <el-col :span="14" class="align-right">
              {{ $root.labels.tax }}:
            </el-col>
            <el-col :span="10" class="align-right">
              {{ getFormattedPrice(booking.taxTotalPrice) }}
            </el-col>

            <el-col :span="14" class="align-right" v-if="getBookingTax(booking)">
              {{ $root.labels.tax }} (Woo):
            </el-col>
            <el-col :span="10" class="align-right" v-if="getBookingTax(booking)">
              {{ getFormattedPrice(getBookingTax(booking)) }}
            </el-col>

            <el-col :span="14" class="align-right">
              <span v-if="booking.payments.length === 1">{{ $root.labels.paid }}:</span>
              <span v-if="booking.payments.length > 1">{{ $root.labels.paid_deposit }}:</span>
            </el-col>
            <el-col :span="10" class="align-right">
              <span v-if="booking.payments.length === 1">{{ getFormattedPrice(booking.payments.filter(p => p.status !== 'pending' && p.status !== 'refunded').reduce((partialSum, a) => partialSum + a.amount, 0)) }}</span>
              <span v-if="booking.payments.length > 1">{{ getFormattedPrice(booking.payments.filter(p => p.status === 'partiallyPaid').reduce((partialSum, a) => partialSum + a.amount, 0)) }}</span>
            </el-col>


            <el-col :span="14" class="align-right" v-if="booking.payments.length > 1">
              <span>{{ $root.labels.paid_remaining_amount }}:</span>
            </el-col>
            <el-col :span="10" class="align-right" v-if="booking.payments.length > 1">
              <span>{{ getFormattedPrice(booking.payments.filter(p => p.status === 'paid').reduce((partialSum, a) => partialSum + a.amount, 0)) }}</span>
            </el-col>

            <el-col :span="14" class="align-right" v-if="getRefundedAmount(booking) > 0">
              <span>{{ $root.labels.refunded }}:</span>
            </el-col>
            <el-col :span="10" class="align-right" v-if="getRefundedAmount(booking) > 0">
              <span>{{ getFormattedPrice(getRefundedAmount(booking)) }}</span>
            </el-col>

            <el-col :span="14" class="align-right">
              <span>{{ $root.labels.due }}:</span>
            </el-col>
            <el-col :span="10" class="align-right">
              <span>{{ getFormattedPrice(getBookingDue(booking)) }}</span>
            </el-col>

            <el-col :span="14" class="align-right">
              <span class="am-strong">{{ $root.labels.total }}:</span>
            </el-col>
            <el-col :span="10" class="align-right">
              <span class="am-strong">{{ getFormattedPrice(getBookingTotal(booking)) }}</span>
            </el-col>
          </el-row>
          <el-row :gutter="10" class="subtotal" v-else>
            <div class="am-payment-package-deal">
              <img
                :src="$root.getUrl + 'public/img/am-package-black.svg'"
              >
              <span>{{ $root.labels.package_deal }}</span>
            </div>
            <el-col :span="14" class="align-right">
              {{ $root.labels.package_price }}:
            </el-col>
            <el-col :span="10" class="align-right">
              {{ getFormattedPrice(booking.packageCustomerService.packageCustomer.price) }}
            </el-col>

            <el-col :span="14" class="align-right">
              {{ $root.labels.discount_amount }}:
            </el-col>
            <el-col :span="10" class="align-right">
              {{ getFormattedPrice(getPackageDiscount(booking)) }}
            </el-col>

            <el-col :span="14" class="align-right">
              <span v-if="booking.payments.length === 1">{{ $root.labels.paid }}</span>
              <span v-if="booking.payments.length > 1">{{ $root.labels.paid_deposit }}</span>
            </el-col>
            <el-col :span="10" class="align-right">
              <el-row style="margin-bottom: 0">
                <span v-if="booking.payments.length === 1">
                  {{
                    getFormattedPrice(booking.payments.filter(p => p.status !== 'pending' && p.status !== 'refunded').reduce((partialSum, a) => partialSum + a.amount, 0))
                  }}
                </span>
                <span v-if="booking.payments.length > 1">
                  {{
                    getFormattedPrice(booking.payments.filter(p => p.status === 'partiallyPaid').reduce((partialSum, a) => partialSum + a.amount, 0))
                  }}
                </span>
              </el-row>
            </el-col>

            <el-col :span="14" class="align-right" v-if="booking.packageCustomerService.packageCustomer.payments.length > 1">
              <span>{{ $root.labels.paid_remaining_amount }}</span>
            </el-col>
            <el-col :span="10" class="align-right" v-if="booking.packageCustomerService.packageCustomer.payments.length > 1">
              <el-row style="margin-bottom: 0">
                <span>
                  {{
                    getFormattedPrice(booking.packageCustomerService.packageCustomer.payments.filter(p => p.status === 'paid').reduce((partialSum, a) => partialSum + a.amount, 0))
                  }}
                </span>
              </el-row>
            </el-col>

            <el-col :span="14" class="align-right" v-if="getRefundedAmount(booking) > 0">
              <span>{{ $root.labels.refunded }}</span>
            </el-col>
            <el-col :span="10" class="align-right" v-if="getRefundedAmount(booking) > 0">
              <span>{{getFormattedPrice(getRefundedAmount(booking)) }}</span>
            </el-col>

            <el-col :span="14" class="align-right">
              <span>{{ $root.labels.due }}:</span>
            </el-col>
            <el-col :span="10" class="align-right">
              <span>{{ getFormattedPrice(getPackageDue(booking)) }}</span>
            </el-col>

            <el-col :span="14" class="align-right">
              <span class="am-strong">{{ $root.labels.total }}:</span>
            </el-col>
            <el-col :span="10" class="align-right">
              <span class="am-strong">{{ getFormattedPrice(getPackageTotal(booking)) }}</span>
            </el-col>
          </el-row>
        </div>
      </div>
    </div>
    <div v-else>
      <p align="center">{{ $root.labels.no_selected_customers }}</p>
    </div>
  </div>
</template>

<script>
  import dateMixin from '../../../js/common/mixins/dateMixin'
  import priceMixin from '../../../js/common/mixins/priceMixin'
  import paymentMixin from '../../../js/backend/mixins/paymentMixin'
  import entitiesMixin from '../../../js/common/mixins/entitiesMixin'
  import customerMixin from '../../../js/backend/mixins/customerMixin'

  export default {
    mixins: [dateMixin, priceMixin, paymentMixin, entitiesMixin, customerMixin],

    props: {
      appointment: {
        default: () => {},
        type: Object
      },
      isCabinet: false,
      options: null,
      recurring: {
        default: () => [],
        type: Array
      }
    },

    data () {
      return {
        paymentStatuses: [
          {
            value: 'paid',
            label: this.$root.labels.paid

          }, {
            value: 'pending',
            label: this.$root.labels.pending

          },
          {
            value: 'partiallyPaid',
            label: this.$root.labels.partially_paid

          }
        ]
      }
    },

    methods: {
      showDialogEditPayment (payment, booking) {
        payment.customerId = booking.customerId

        let pack = booking.packageCustomerService ? this.getPackageById(booking.packageCustomerService.packageCustomer.packageId) : null

        this.$emit(
          'editPayment',
          {
            payment: payment,
            appointment: this.appointment,
            booking: booking,
            package: booking.packageCustomerService ? (pack ? pack : {name: 'Package'}) : null,
            recurring: this.recurring
          })
      },

      getPaymentStatus (status) {
        let statusLabel = ''

        this.paymentStatuses.forEach(function (statItem) {
          if (statItem.value === status) {
            statusLabel = statItem.label
          }
        })

        return statusLabel
      },

      getPackageDiscount (booking) {
        let total = booking.packageCustomerService.packageCustomer.price
        let coupon = booking.coupon

        return (total / 100 * (coupon ? coupon.discount : 0)) + (coupon ? coupon.deduction : 0)
      },

      getPackageDue (booking) {
        let due = this.getPackageTotal(booking) - (booking.payments.length > 0
          ? booking.payments.filter(p => p.status !== 'refunded').reduce((partialSum, a) => partialSum + a.amount, 0) : 0)

        return due >= 0 ? due : 0
      },

      getPackageTotal (booking) {
        let total = (booking.packageCustomerService.packageCustomer.price + this.getPackageTax(booking)) - this.getPackageDiscount(booking)

        return total >= 0 ? total : 0
      },

      getPackageTax (booking) {
        return booking.packageCustomerService.packageCustomer.payments.length > 0 &&
      booking.packageCustomerService.packageCustomer.payments.filter(p => p.wcItemTaxValue).length > 0
          ? booking.packageCustomerService.packageCustomer.payments.reduce((partialSum, a) => partialSum + a.wcItemTaxValue, 0) : 0
      },

      getBookingSubtotal (booking) {
        return booking.serviceTotalPrice + booking.extrasTotalPrice
      },

      getBookingDiscount (booking) {
        return booking.discountTotalPrice + (booking.payments.length > 0 && booking.payments.filter(p => p.wcItemCouponValue).length > 0 ?
          booking.payments.reduce((partialSum, a) => partialSum + a.wcItemCouponValue, 0) : 0)
      },

      getBookingDue (booking) {
        let due = this.getBookingTotal(booking) - (booking.payments.length > 0 ? booking.payments.filter(p => p.status !== 'refunded' && p.status !== 'pending').reduce((partialSum, a) => partialSum + a.amount, 0) : 0)

        return due >= 0 ? due : 0
      },

      getRefundedAmount (booking) {
        return booking.payments.filter(p => p.status === 'refunded').reduce((partialSum, a) => partialSum + a.amount, 0)
      },

      getBookingTotal (booking) {
        let total = (this.getBookingSubtotal(booking) + booking.taxTotalPrice + this.getBookingTax(booking)) - this.getBookingDiscount(booking)

        return total >= 0 ? total : 0
      },

      getBookingTax (booking) {
        return booking.payments.length > 0 && booking.payments.filter(p => p.wcItemTaxValue).length > 0 ?
          booking.payments.reduce((partialSum, a) => partialSum + a.wcItemTaxValue, 0) : 0
      }
    }
  }
</script>
