<template>
  <div>

    <!-- Dialog Loader -->
    <div class="am-dialog-loader" v-show="dialogLoading">
      <div class="am-dialog-loader-content">
        <img :src="$root.getUrl+'public/img/spinner.svg'" class="">
        <p>{{ $root.labels.loader_message }}</p>
      </div>
    </div>

    <!-- Dialog Content -->
    <div class="am-dialog-scrollable" v-if="!dialogLoading">

      <!-- Dialog Header -->
      <div class="am-dialog-header">
        <el-row>
          <el-col :span="18">
            <h2>{{ invoiceInDialog ? $root.labels.invoice_details : $root.labels.payment_details }}</h2>
          </el-col>
          <el-col :span="6" class="align-right">
            <el-button @click="closeDialog" class="am-dialog-close" size="small" icon="el-icon-close"></el-button>
          </el-col>
        </el-row>
      </div>

      <div class="am-payment-details">
        <el-row v-if="payments[0].invoiceNumber" class="am-payment-details-row">
          <h4>{{ $root.labels.invoice_number + ': #' + payments[0].invoiceNumber }}</h4>
        </el-row>


        <el-row class="am-payment-details-row">
          <h4>{{ $root.labels.customer }}</h4>
          <el-col :span="24">
            <h3 :class="getNoShowClass(modalData.customer.id, customersNoShowCount)">{{ modalData.customer.id ? modalData.customer.firstName + ' ' + modalData.customer.lastName : '' }}</h3>
            <p>{{ modalData.customer ? modalData.customer.email : '' }}</p>
          </el-col>
        </el-row>

        <el-row class="am-payment-details-row" v-for="(singlePayment, index) in payments" :key="singlePayment.id">
          <div class="am-payment-details-row-header">
            <h4>{{ $root.labels.payment }} {{ payments.length > 1 ? ('#' + (index+1)) : ''}} </h4>
            <div class="am-payment-details-row-options" v-if="!invoiceInDialog && payments.length > 1">
              <div v-if="paymentRefundable(singlePayment)">
                <el-button @click="showRefundModal(singlePayment)" size="small" :loading="refundMainBtnLoading">
                  {{ $root.labels.refund }}
                </el-button>
              </div>
              <!-- Edit Single Payment-->
              <el-button
                  style="padding: 7px 10px"
                  class="am-button-icon"
                  size="small"
                  @click="showUpdateModal(singlePayment)">
                <img class="svg-amelia" :alt="$root.labels.edit" :src="$root.getUrl + 'public/img/edit.svg'"/>
              </el-button>
              <el-button
                  style="padding: 7px 10px; margin-left: 0px"
                  v-if="$root.settings.capabilities.canDelete === true"
                  class="am-button-icon"
                  size="small"
                  @click="showDeleteModal(singlePayment)">
                <img class="svg-amelia" :alt="$root.labels.delete" :src="$root.getUrl + 'public/img/delete.svg'"/>
              </el-button>
            </div>
          </div>

          <el-col :span="12">
            <p>{{ invoiceInDialog ?  $root.labels.issue_date : $root.labels.date }}</p>
            <p>{{ $root.labels.payment_method }}</p>
            <p v-if="singlePayment.wcOrderId">{{ $root.labels.wc_order }}:</p>
            <p>{{ $root.labels.status }}</p>
            <p>{{ $root.labels.id }}</p>
          </el-col>
          <el-col :span="12">
            <p class="am-semi-strong">{{ invoiceInDialog ? getFrontedFormattedDate(singlePayment.created) : getFrontedFormattedDate(singlePayment.dateTime) }}</p>
            <p class="am-semi-strong">
              <img class="svg-amelia" :style="{width: getPaymentIconWidth(singlePayment.gateway), verticalAlign: 'middle'}" :src="$root.getUrl + 'public/img/payments/' + getPaymentIconName(singlePayment)">
              <span v-if="!longNamePayments(singlePayment.gateway)">{{ getPaymentGatewayNiceName(singlePayment) }}</span>
            </p>
            <p v-if="singlePayment.wcOrderId">
              <a :href="singlePayment.wcOrderUrl" target="_blank">
                #{{ singlePayment.wcOrderId }}
              </a>
            </p>
            <div class="am-payment-status">
              <span :class="'am-payment-status-symbol am-payment-status-symbol-' + singlePayment.status"></span>
              <p class="am-semi-strong">
                <span>{{ getPaymentStatusNiceName(singlePayment.status) }}</span>
              </p>
            </div>
            <p class="am-semi-strong">{{ singlePayment.id }}</p>
          </el-col>
        </el-row>

        <el-row class="am-payment-details-row" v-for="(bookItem, index) in modalData[modalData.bookableType]" :key="index">
          <h4>{{ $root.labels[modalData.bookableType + '_info'] }}</h4>
          <el-col :span="12">
            <p>{{ $root.labels[modalData.bookableType] }}</p>
            <p v-if="modalData.bookableType !== 'package'">{{ $root.labels.date }}</p>
            <p v-if="bookItem.providers.length && modalData.bookableType === 'appointment'">{{ $root.labels.employee }}</p>
            <p v-if="modalData.bookableType === 'event' && getTicketsData().length">{{ $root.labels.event_tickets }}</p>
          </el-col>
          <el-col :span="12">
            <p class="am-semi-strong">{{ bookItem.bookable.name }}</p>
            <p class="am-semi-strong" v-if="modalData.bookableType !== 'package'">{{ getFrontedFormattedDateTime(bookItem.bookingStart) }}</p>
            <p class="am-semi-strong" v-if="bookItem.providers.length > 0 && modalData.bookableType === 'appointment'">
              <img
                class="am-employee-photo"
                :src="pictureLoad(bookItem.providers[0], true)"
                @error="imageLoadError(bookItem.providers[0].id, true)"
              />
              {{ bookItem.providers[0].fullName }}
            </p>
            <p class="am-semi-strong" style="white-space: unset"
               v-if="modalData.bookableType === 'event' && getTicketsData().length"
            >
              <span class="am-attendees-plus" v-for="item in getTicketsData()">
                {{ item.persons }} x {{ item.name }}
              </span>
            </p>
          </el-col>
        </el-row>

        <el-row class="am-payment-details-row am-payment-summary">
          <el-col :span="12">
            <p>{{ $root.labels[(finance.multipleBookings ? 'bookings' : (modalData.bookableType === 'appointment' ? 'service' : modalData.bookableType)) + '_price'] }}</p>
            <p v-if="modalData.bookableType !== 'package' && modalData.bookableType !== 'event'">{{ $root.labels.extras }}</p>
            <p v-if="modalData.bookableType !== 'package' && modalData.bookableType !== 'event'">{{ $root.labels.subtotal }}</p>
            <p>{{ $root.labels.discount_amount }}</p>
            <p v-if="finance.tax">{{ $root.labels.tax }}</p>
            <p v-if="payments.filter(p => (p.wcOrderId && p.wcItemTaxValue)).length > 0">{{ $root.labels.tax }} (Woo)</p>
            <p v-if="!showPaidSeparate()">{{ $root.labels.paid }}</p>
            <p v-if="showPaidSeparate()">{{ $root.labels.paid_deposit }}</p>
            <p v-if="showPaidSeparate()">{{ $root.labels.paid_remaining_amount }}</p>
            <p v-if="finance.refunded > 0">{{ $root.labels.refunded }}</p>
            <p>{{ $root.labels.due }}</p>
            <p class="am-payment-total">{{ $root.labels.total }}</p>

          </el-col>
          <el-col :span="12">
            <p class="am-semi-strong">{{ getFormattedPrice(finance.bookablePriceTotal) }}</p>
            <p v-if="modalData.bookableType !== 'package' && modalData.bookableType !== 'event'" class="am-semi-strong">{{ getFormattedPrice(finance.extrasPriceTotal) }}</p>
            <p v-if="modalData.bookableType !== 'package' && modalData.bookableType !== 'event'" class="am-semi-strong">{{ getFormattedPrice(finance.subTotal) }}</p>
            <p class="am-semi-strong">{{ getFormattedPrice(finance.discountTotal > finance.subTotal ? finance.subTotal : finance.discountTotal ) }}</p>
            <p v-if="finance.tax" class="am-semi-strong">{{ getFormattedPrice(finance.tax) }}</p>
            <p v-if="payments.filter(p => (p.wcOrderId && p.wcItemTaxValue)).length > 0" class="am-semi-strong">{{ getFormattedPrice(finance.wcTax) }}</p>
            <p class="am-semi-strong" v-if="!showPaidSeparate()">{{ getFormattedPrice(finance.paidRemaining + finance.paidDeposit) }}</p>
            <p class="am-semi-strong" v-if="showPaidSeparate()">{{ getFormattedPrice(finance.paidDeposit) }}</p>
            <p class="am-semi-strong" v-if="showPaidSeparate()">{{ getFormattedPrice(finance.paidRemaining) }}</p>
            <p class="am-semi-strong" v-if="finance.refunded > 0">{{getFormattedPrice(finance.refunded) }}</p>
            <p class="am-semi-strong">{{getFormattedPrice(finance.due) + (payments[0].wcItemTaxValue && finance.due > 0 ? $root.labels.plus_tax : '') }}</p>
            <p class="am-semi-strong am-payment-total">{{ getFormattedPrice(finance.total) + (payments[0].wcItemTaxValue && finance.due > 0 ? $root.labels.plus_tax : '') }}</p>
          </el-col>
        </el-row>

      </div>

    </div>

    <!-- Dialog Footer -->
    <div class="am-dialog-footer" v-if="$root.settings.capabilities.canWriteOthers === true && !dialogLoading">
      <div class="am-dialog-footer-actions">

        <!-- Dialog Delete Confirmation -->
        <transition name="slide-vertical">
          <div class="am-dialog-confirmation" v-if="showDeleteConfirmation">
            <h3>{{ $root.labels.confirm_delete_payment }}</h3>
            <div class="align-left">
              <el-button
                  size="small"
                  @click="showDeleteConfirmation = !showDeleteConfirmation">
                {{ $root.labels.cancel }}
              </el-button>
              <el-button size="small" @click="deletePayment()" type="primary">
                {{ $root.labels.delete }}
              </el-button>
            </div>
          </div>
        </transition>

        <!-- Dialog Update Confirmation -->
        <transition name="slide-vertical">
          <div class="am-dialog-confirmation" v-if="showUpdatePaymentAmount">
            <el-form label-position="top">

              <h3>{{ $root.labels.enter_new_payment_amount }}</h3>
              <el-row class="am-no-padding" :gutter="24">
                <el-col :span="12">
                  <el-form-item :label="$root.labels.payment + ':'">
                    <money v-model="payment.amount" v-bind="moneyComponentData" class="el-input__inner"></money>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item :label="$root.labels.status + ':'">
                    <el-select v-model="payment.status">
                      <el-option
                          v-for="item in paymentStatuses"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"
                          class="am-appointment-status-option"
                      >
                        <span :class="'am-appointment-status-symbol am-appointment-status-symbol-' + item.value"></span>
                        <span>{{ item.label }}</span>
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>


              <div class="align-left">
                <el-button size="small"
                           @click="showUpdatePaymentAmount = !showUpdatePaymentAmount;"
                >
                  {{ $root.labels.close }}
                </el-button>
              </div>
            </el-form>
          </div>
        </transition>


        <!-- Dialog Refund Confirmation -->
        <transition name="slide-vertical">
          <div class="am-dialog-confirmation" v-if="showRefundConfirmation && !$root.licence.isBasic && !$root.licence.isStarter && !$root.licence.isLite">
            <h3>{{ $root.labels.confirm_refund_payment }}</h3>
            <h3><b>{{ $root.labels.refund_payment_amount }} {{getFormattedPrice(refundAmount)}}</b></h3>
            <div class="align-left">
              <el-button
                size="small"
                @click="showRefundConfirmation = false">
                {{ $root.labels.cancel }}
              </el-button>
              <el-button size="small" @click="refundPayment()" type="primary" :loading="refundBtnLoading">
                {{ $root.labels.confirm }}
              </el-button>
            </div>
          </div>
        </transition>

        <el-row v-if="!invoiceInDialog">
          <!-- Delete & Edit -->
          <el-col :sm="12" v-if="payments.length === 1" class="align-left">

            <!-- Delete -->
            <el-button
                :style="{display: 'none'}"
                v-if="$root.settings.capabilities.canDelete === true"
                class="am-button-icon"
                @click="showDeleteModal(payments[0])">
              <img class="svg-amelia" :alt="$root.labels.delete" :src="$root.getUrl + 'public/img/delete.svg'"/>
            </el-button>

            <!-- Edit -->
            <el-button
                class="am-button-icon"
                @click="showUpdateModal(payments[0])">
              <img class="svg-amelia" :alt="$root.labels.edit" :src="$root.getUrl + 'public/img/edit.svg'"/>
            </el-button>

            <el-button v-if="paymentRefundable(payments[0])" @click="showRefundModal(payments[0])" :loading="refundMainBtnLoading">
              {{ $root.labels.refund }}
            </el-button>

          </el-col>

          <!-- Cancel & Save -->
          <el-col :sm="payments.length > 1 ? 24 : 12" class="align-right">
            <!-- Cancel -->
            <el-button type="" @click="closeDialog" class="">
              {{ $root.labels.cancel }}
            </el-button>

            <!-- Save -->
            <el-button
                type="primary"
                @click="updatePayment()"
                class="am-dialog-create"
            >
              {{ $root.labels.save }}
            </el-button>

          </el-col>
        </el-row>
        <el-row v-else>
          <el-col :sm="8" :span="8" class="align-left invoice-download">
            <el-button @click="downloadInvoice()" :loading="invoiceLoading.download">
              {{ $root.labels.download }}
            </el-button>
          </el-col>
          <el-col :sm="4" :span="4" class="align-left invoice-download-mobile">
            <el-button @click="downloadInvoice()" class="button-export am-button-icon">
              <img class="svg-amelia" alt="Import" :src="$root.getUrl+'public/img/import.svg'"/>
            </el-button>
          </el-col>
          <el-col :sm="16" :span="16" class="align-right">
            <el-button
                @click="previewInvoice()"
                class="am-dialog-create"
                :loading="invoiceLoading.preview"
            >
              {{ $root.labels.preview }}
            </el-button>
            <el-button
                type="primary"
                @click="sendInvoice()"
                class="am-dialog-create"
                :loading="invoiceLoading.send"
            >
              {{ $root.labels.send_invoice }}
            </el-button>

          </el-col>
        </el-row>

      </div>
    </div>

  </div>
</template>

<script>
  import Form from 'form-object'
  import { Money } from 'v-money'
  import dateMixin from '../../../js/common/mixins/dateMixin'
  import imageMixin from '../../../js/common/mixins/imageMixin'
  import notifyMixin from '../../../js/backend/mixins/notifyMixin'
  import priceMixin from '../../../js/common/mixins/priceMixin'
  import paymentMixin from '../../../js/backend/mixins/paymentMixin'
  import customerMixin from '../../../js/backend/mixins/customerMixin'
  import taxMixin from '../../../js/common/mixins/taxesMixin'

export default {

    mixins: [
      imageMixin,
      dateMixin,
      notifyMixin,
      priceMixin,
      paymentMixin,
      customerMixin,
      taxMixin
    ],

    props: {
      modalData: null,
      bookingFetched: false,
      customersNoShowCount: null,
      invoiceInDialog: false
    },

    data () {
      return {
        dialogLoading: true,
        refundBtnLoading: false,
        refundMainBtnLoading: false,
        finance: {
          bookablePriceTotal: 0,
          extrasPriceTotal: 0,
          discountTotal: 0,
          subTotal: 0,
          due: 0,
          refunded: 0,
          total: 0,
          paidDeposit: 0,
          paidRemaining: 0,
          tax: 0,
          wcTax: 0,
          multipleBookings: false
        },
        form: new Form(),
        payment: null,
        paymentStatuses: [
          {
            value: 'pending',
            label: this.$root.labels.pending
          },
          {
            value: 'paid',
            label: this.$root.labels.paid
          },
          {
            value: 'partiallyPaid',
            label: this.$root.labels.partially_paid
          }
        ],
        showDeleteConfirmation: false,
        showUpdatePaymentAmount: false,
        payments: [],
        showRefundConfirmation: false,
        refundAmount: 0,
        invoiceLoading: {preview: false, download: false, send: false}
      }
    },

    created () {
      Form.defaults.axios = this.$http

      if (!this.$root.licence.isBasic && !this.$root.licence.isStarter && !this.$root.licence.isLite) {
        this.paymentStatuses.push(
          {
            value: 'refunded',
            label: this.$root.labels.refunded
          }
        )
      }

      if (this.bookingFetched) {
        this.setFinance()
        this.dialogLoading = false
      }
    },

    updated () {
      this.$nextTick(function () {
        let $this = this
        setTimeout(function () {
          $this.inlineSVG()
        }, 5)
      })
    },

    methods: {
      showPaidSeparate () {
        return this.payments.filter(p => p.status === 'partiallyPaid').length > 0 && !this.invoiceInDialog
      },

      createFileUrlFromResponse (response) {
        var byteCharacters = atob(response.data)
        var byteNumbers = new Array(byteCharacters.length)
        for (var i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i)
        }
        var byteArray = new Uint8Array(byteNumbers)
        var file = new Blob([byteArray], { type: 'application/pdf;base64' })
        return URL.createObjectURL(file)
      },

      sendInvoice () {
        this.invoiceLoading.send = true
        if (this.modalData.customer.email) {
          this.$http.post(`${this.$root.getAjaxUrl}/invoices/${this.payments[0].id}`, {sendEmail: true})
            .then(response => {
              this.notify(this.$root.labels.success, this.$root.labels.invoice_sent, 'success')
              this.invoiceLoading.send = false
            })
            .catch(e => {
              console.log(e.response.data.message)
              this.notify(this.$root.labels.error, this.$root.labels.invoice_sending_failed, 'error')
              this.invoiceLoading.send = false
            })
        } else {
          this.notify(this.$root.labels.error, this.$root.labels.send_invoice_no_email, 'error')
          this.invoiceLoading.send = false
        }
      },

      previewInvoice () {
        this.invoiceLoading.preview = true
        this.$http.post(`${this.$root.getAjaxUrl}/invoices/${this.payments[0].id}`)
          .then(response => {
            window.open(this.createFileUrlFromResponse(response))
            this.invoiceLoading.preview = false
          })
          .catch(e => {
            console.log(e.message)
            this.invoiceLoading.preview = false
          })
      },

      downloadInvoice () {
        this.invoiceLoading.download = true
        this.$http.post(`${this.$root.getAjaxUrl}/invoices/${this.payments[0].id}`)
          .then(response => {
            let url = this.createFileUrlFromResponse(response)
            const a = document.createElement('a')
            a.href = url
            a.download = 'Invoice'
            document.body.appendChild(a)
            a.click()
            document.body.removeChild(a)
            this.invoiceLoading.download = false
          })
          .catch(e => {
            console.log(e.message)
            this.invoiceLoading.download = false
          })
      },

      showRefundModal (singlePayment) {
        this.showDeleteConfirmation = false
        this.showUpdatePaymentAmount = false
        this.payment = singlePayment
        this.refundMainBtnLoading = true

        this.$http.get(`${this.$root.getAjaxUrl}/payments/transaction/` + singlePayment.id)
          .then(response => {
            this.refundAmount = response.data.data.refundAmount
            this.showRefundConfirmation = true
            this.refundMainBtnLoading = false
          })
          .catch(e => {
            console.log(e.message)
            this.refundMainBtnLoading = false
          })
      },

      showUpdateModal (singlePayment) {
        this.showUpdatePaymentAmount = true
        this.showDeleteConfirmation = false
        this.payment = singlePayment
      },

      showDeleteModal (singlePayment) {
        this.showDeleteConfirmation = true
        this.showRefundConfirmation = false
        this.showUpdatePaymentAmount = false
        this.payment = singlePayment
      },

      paymentRefundable (payment) {
        return (!this.$root.licence.isBasic && !this.$root.licence.isStarter && !this.$root.licence.isLite) && (payment.status === 'partiallyPaid' || payment.status === 'paid') && (payment.transactionId || payment.wcOrderId) && (payment.gateway !== 'mollie' || (payment.transactionId && !payment.transactionId.includes('pl_'))) && payment.gateway !== 'onSite'
      },

      refundPayment () {
        this.refundBtnLoading = true

        this.$http.post(`${this.$root.getAjaxUrl}/payments/refund/${this.payment.id}`)
          .then((response) => {
            this.notify(this.$root.labels.success, this.$root.labels.payment_refunded, 'success')
            this.refundBtnLoading = false
            this.payment.status = 'refunded'
            this.showRefundConfirmation = false
            this.$emit('updatePaymentCallback', this.payment)
          })
          .catch(e => {
            console.log(e)
            this.refundBtnLoading = false
            this.notify(this.$root.labels.error, e.response.data.message ? e.response.data.message : this.$root.labels.payment_refund_failed, 'error')
          })
      },

      getTicketsData () {
        let ticketsData = []

        if (this.modalData.bookableType === 'event' && this.modalData[this.modalData.bookableType][0]) {
          this.modalData.event.forEach((ev) => {
            let bookItem = ev.booking
            bookItem.ticketsData.forEach((item) => {
              let ticket = ev.bookable.customTickets.find(ticket => ticket.id === item.eventTicketId)
              if (ticket) {
                ticketsData.push(
                  {
                    name: ticket.name,
                    persons: item.persons
                  }
                )
              }
            })
          })
        }

        return ticketsData
      },

      instantiateDialog () {
        if (this.modalData.bookings !== null) {
          this.setFinance()
          this.dialogLoading = false
        }
      },

      setFinance () {
        let appointments = JSON.parse(JSON.stringify(this.modalData[this.modalData.bookableType]))

        appointments.forEach(a => {
          this.payments = this.payments.concat(a.booking.payments)
        })

        this.payments.sort(function (a, b) {
          return new Date(a.dateTime) - new Date(b.dateTime)
        })

        let type = this.modalData.bookableType
        let bookings = this.modalData[type]

        this.finance = this.getPaymentAmountData(bookings, type)
        this.finance.multipleBookings = bookings.length > 0
      },

      closeDialog () {
        this.$emit('closeDialogPayment')
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

      deletePayment () {
        this.dialogLoading = true

        this.$http.post(`${this.$root.getAjaxUrl}/payments/delete/` + this.payment.id)
          .then(response => {
            this.dialogLoading = false
            if (!response.data) {
              return
            }

            this.$emit('deletePaymentCallback', this.payment)
            this.showDeleteConfirmation = !this.showDeleteConfirmation
            this.notify(this.$root.labels.success, this.$root.labels.payment_deleted, 'success')
          })
          .catch(e => {
            this.dialogLoading = false
            this.errorMessage = e.message
          })
      },

      updatePayment () {
        if (!this.payment) {
          this.$emit('updatePaymentCallback')
          return
        }
        this.dialogLoading = true

        this.form.post(`${this.$root.getAjaxUrl}/payments/${this.payment.id}`, this.payment)
          .then(() => {
            this.showUpdatePaymentAmount = !this.showUpdatePaymentAmount

            this.setFinance()
            this.notify(this.$root.labels.success, this.$root.labels.payment_saved, 'success')
            this.$emit('updatePaymentCallback', this.payment)
            this.dialogLoading = false
          })
          .catch(e => {
            this.dialogLoading = false
            this.errorMessage = e.message
          })
      },

      getPaymentIconName (payment) {
        return (payment.gateway === 'onSite' || payment.gateway === 'stripe') && payment.gatewayTitle === 'oliver' ? 'oliver.png' : payment.gateway + '.svg'
      },

      getPaymentGatewayNiceName (payment) {
        if (payment.gateway === 'stripe' && payment.gatewayTitle === 'oliver') {
          return this.$root.labels.oliver_on_line
        }

        if (payment.gateway === 'onSite' && payment.gatewayTitle === 'oliver') {
          return this.$root.labels.oliver_on_site
        }

        if (payment.gateway === 'onSite') {
          return this.$root.labels.on_site
        }

        if (payment.gateway === 'wc') {
          return payment.gatewayTitle
        }

        if (payment.gateway) {
          return payment.gateway.charAt(0).toUpperCase() + payment.gateway.slice(1)
        }
      }
    },

    watch: {
      'bookingFetched' () {
        if (this.bookingFetched === true) {
          this.instantiateDialog()
        }
      }
    },

    components: {
      Money
    }
  }
</script>
