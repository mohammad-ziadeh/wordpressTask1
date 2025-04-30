<template>
  <div class="am-dialog-attendees-inner">

    <!-- Dialog Loader -->
    <div class="am-dialog-loader" v-show="dialogLoading">
      <div class="am-dialog-loader-content">
        <img :src="$root.getUrl + 'public/img/spinner.svg'" class=""/>
        <p>{{ $root.labels.loader_message }}</p>
      </div>
    </div>

    <!-- Dialog Content -->
    <div class="am-dialog-scrollable" v-if="bookings && !dialogLoading">

      <!-- Dialog Header -->
      <div v-if="showHeader" class="am-dialog-header" style="border-bottom: none;">
        <el-row>
          <el-col :span="18">
            <h2>{{ $root.labels.event_attendees }}</h2>
          </el-col>
          <el-col :span="6" class="align-right">
            <el-button @click="closeDialog" class="am-dialog-close" size="small" icon="el-icon-close">
            </el-button>
          </el-col>
        </el-row>
      </div>

      <el-button
          v-if="writeEvents" @click="addAttendee" size="large" type="primary"
          class="am-dialog-create" style="width: 100%"
      >
        <i class="el-icon-plus"></i> <span class="button-text">{{ $root.labels.event_add_attendee }}</span>
      </el-button>

      <!-- Search -->
      <div class="am-search">
        <el-row :gutter="10">
          <el-col :lg="showExport ? 20 : 24">
            <el-input
                v-model="search"
                class=""
                :placeholder="$root.labels.event_attendees_search"
                @input="searchAttendees()"
            >
            </el-input>
          </el-col>

          <el-col v-if="showExport" :lg="4">
            <!-- Export -->
            <el-tooltip placement="top">
              <div slot="content" v-html="$root.labels.export_tooltip_attendees"></div>
              <el-button
                  class="button-export am-button-icon"
                  @click="openExportAttendeesDialog"
              >
                <img class="svg-amelia" :alt="$root.labels.export" :src="$root.getUrl+'public/img/export.svg'"/>
              </el-button>
            </el-tooltip>
          </el-col>
        </el-row>
      </div>

      <!-- Attendees -->
      <el-tabs v-model="activeTab">

      <el-tab-pane :label="$root.labels.event_attendees" name="Approved">
        <div class="am-attendees">
          <el-collapse>
          <el-collapse-item
              v-for="(booking, index) in bookings"
              v-show="booking.show && booking.status !== 'waiting'"
              :key="index"
              :name="booking.id"
              class="am-attendee">
            <template slot="title">
              <div class="am-attendee-data" style="width: 100%">
                <el-row :gutter="10">
                  <el-col v-if="$root.settings.capabilities.canDelete === true" :sm="2">
                    <span class="am-attendee-checkbox" @click.stop>
                      <el-checkbox
                          v-if="$root.settings.capabilities.canDelete === true"
                          v-model="booking.checked">
                      </el-checkbox>
                    </span>
                  </el-col>
                  <el-col :sm="$root.settings.capabilities.canDelete === true ? 17 : 19">
                    <div class="am-attendee-name">
                      <h3
                        :class="showExport ? (getNoShowClass((booking.customerId !== 0 ? booking.customerId : booking.customer.id), customersNoShowCount, null, booking.customer.status)): ''"
                      >
                        {{ ((user = getCustomer(booking)) !== null ? user.firstName + ' ' + user.lastName : '') +
                        (booking.token ? ' (' + booking.token.substring(0, 5) + ')' : '') }}
                        <span v-if="booking.persons > 1" class="am-attendees-plus">+{{ booking.persons - 1 }}</span>
                      </h3>
                      <a class="am-attendee-email" :href="`mailto:${booking.customer.email}`">{{ booking.customer.email }}</a>
                      <a class="am-attendee-phone" :href="`tel:${((user = getCustomer(booking)) !== null ? user.phone : '')}`">{{ ((user = getCustomer(booking)) !== null ? user.phone : '') }}</a>
                      <span
                        class="am-attendees-plus"
                        :style="{ marginLeft: 0}"
                        v-if="customTickets.length"
                        v-for="ticket in booking.ticketsData"
                      >
                        {{ getTicketsSoldString(ticket) }}
                      </span>
                    </div>
                  </el-col>
                  <el-col :sm="5">
                    <div class="am-appointment-status small">
                      <span :class="'am-appointment-status-symbol am-appointment-status-symbol-'+getBookingStatus(booking)"></span>
                      <el-select
                          :value="booking.status"
                          :popper-append-to-body="popperAppendToBody"
                          :disabled="!writeEvents"
                          @change="updateBookingStatus(booking, $event)"
                      >
                        <el-option
                            v-for="item in statuses"
                            :key="item.value"
                            :value="item.value"
                            class="am-appointment-dialog-status-option"
                        >
                          <span :class="'am-appointment-status-symbol am-appointment-status-symbol-'+(item.value === 'rejected' ? 'canceled' : item.value)">
                          </span>
                        </el-option>
                      </el-select>
                    </div>
                  </el-col>
                </el-row>
              </div>
            </template>
            <div class="am-attendee-collapse">
              <el-row :gutter="10" v-if="booking.payments.length" class="am-attendee-collapse-payments">
                <el-col :span="6">
                  <span>{{ $root.labels.payment }}</span>
                </el-col>
                <el-col :span="18">
                  <p v-for="payment in booking.payments">
                    <span style="display: flex; align-items: center">
                      <img class="svg-amelia" :style="{width: getPaymentIconWidth(payment.gateway)}"
                           :src="$root.getUrl + 'public/img/payments/' + payment.gateway + '.svg'"/>
                      {{ getPaymentGatewayNiceName(payment.gateway) }}
                      <span class="am-semi-strong am-payment-status" style="padding-left: 15px">
                        <span :class="'am-payment-status-symbol am-payment-status-symbol-' + payment.status"></span>
                        {{ getPaymentStatusNiceName(payment.status) }}
                      </span>
                    </span>
                  </p>
                </el-col>
              </el-row>
              <el-row :gutter="10" v-if="booking.payments.filter(p => p.wcOrderId).length > 0" class="am-attendee-collapse-payments">
                <el-col :span="6">
                  <span>{{ $root.labels.wc_order }}:</span>
                </el-col>
                <el-col :span="18">
                  <p v-for="payment in booking.payments" :key="payment.id">
                    <a :href="payment.wcOrderUrl" target="_blank">
                      #{{ payment.wcOrderId }}
                    </a>
                  </p>
                </el-col>
              </el-row>

              <el-row :gutter="10">
                <el-col :span="12">
                  <div class="">
                    <el-button
                        v-if="writeEvents"
                        :loading="booking.removing"
                        @click="removeAttendee(index)">
                      {{ $root.labels.event_attendee_remove }}
                    </el-button>
                  </div>
                </el-col>
                <el-col :span="12">
                  <div class="">
                    <el-button
                        v-if="writeEvents"
                        @click="editAttendee(index)">
                      {{ $root.labels.event_edit_attendee }}
                    </el-button>
                  </div>
                </el-col>
              </el-row>
            </div>
          </el-collapse-item>
        </el-collapse>
        </div>

        <div v-if="bookings.filter(b => b.status !== 'waiting').length === 0" class="am-empty-state am-section">
          <img :src="$root.getUrl + 'public/img/emptystate.svg'">
          <h2>{{ $root.labels.no_attendees_yet }}</h2>
        </div>
        <div v-show="!hasResult && bookings.filter(b => b.status !== 'waiting').length > 0" class="am-empty-state am-section">
          <img :src="$root.getUrl + 'public/img/emptystate.svg'">
          <h2>{{ $root.labels.no_results }}</h2>
        </div>
      </el-tab-pane>

      <el-tab-pane
        :label="$root.labels.waiting_list"
        name="WaitingList"
        v-if="event.settings.waitingList.enabled && $root.settings.appointments.waitingListEvents.enabled"
      >
        <div class="am-attendees">
          <el-collapse>
            <el-collapse-item
              v-for="(booking, index) in bookings"
              v-show="booking.show && booking.status === 'waiting'"
              :key="index"
              :name="booking.id"
              class="am-attendee"
            >
              <template slot="title">
                <div class="am-attendee-data" style="width: 100%">
                  <el-row :gutter="10">
                    <el-col v-if="$root.settings.capabilities.canDelete === true" :sm="2">
                  <span class="am-attendee-checkbox" @click.stop>
                    <el-checkbox
                        v-if="$root.settings.capabilities.canDelete === true"
                        v-model="booking.checked">
                    </el-checkbox>
                  </span>
                    </el-col>
                    <el-col :sm="$root.settings.capabilities.canDelete === true ? 17 : 19">
                      <div class="am-attendee-name">
                        <h3>
                          {{ ((user = getCustomer(booking)) !== null ? user.firstName + ' ' + user.lastName : '') +
                          (booking.token ? ' (' + booking.token.substring(0, 5) + ')' : '') }}
                          <span v-if="booking.persons > 1" class="am-attendees-plus">+{{ booking.persons - 1 }}</span>
                        </h3>
                        <a class="am-attendee-email" :href="`mailto:${booking.customer.email}`">{{ booking.customer.email }}</a>
                        <a class="am-attendee-phone" :href="`tel:${((user = getCustomer(booking)) !== null ? user.phone : '')}`">{{ ((user = getCustomer(booking)) !== null ? user.phone : '') }}</a>
                        <span
                            class="am-attendees-plus"
                            :style="{ marginLeft: 0}"
                            v-if="customTickets.length"
                            v-for="ticket in booking.ticketsData"
                        >
                      {{ getTicketsSoldString(ticket) }}
                    </span>
                      </div>
                    </el-col>
                    <el-col :sm="5">
                      <div class="am-appointment-status small">
                        <span :class="'am-appointment-status-symbol am-appointment-status-symbol-' + getBookingStatus(booking)"></span>
                        <el-select
                            :value="booking.status"
                            :popper-append-to-body="popperAppendToBody"
                            :disabled="!writeEvents"
                            @change="updateBookingStatus(booking, $event)"
                        >
                          <el-option
                              v-for="item in statuses"
                              v-show="item.value !== 'no-show'"
                              :key="item.value"
                              :value="item.value"
                              class="am-appointment-dialog-status-option"
                          >
                            <span :class="'am-appointment-status-symbol am-appointment-status-symbol-'+(item.value === 'rejected' ? 'canceled' : item.value)">
                            </span>
                          </el-option>
                        </el-select>
                      </div>
                    </el-col>
                  </el-row>
                </div>
              </template>
              <div class="am-attendee-collapse">
                <el-row :gutter="10" v-if="booking.payments.length" class="am-attendee-collapse-payments">
                  <el-col :span="6">
                    <span>{{ $root.labels.payment }}</span>
                  </el-col>
                  <el-col :span="18">
                    <p v-for="payment in booking.payments">
                      <img class="svg-amelia" :style="{width: getPaymentIconWidth(payment.gateway)}"
                           :src="$root.getUrl + 'public/img/payments/' + payment.gateway + '.svg'"/>
                      {{ getPaymentGatewayNiceName(payment.gateway) }}
                    </p>
                  </el-col>
                </el-row>
                <el-row :gutter="10" v-if="booking.payments.filter(p => p.wcOrderId).length > 0" class="am-attendee-collapse-payments">
                  <el-col :span="6">
                    <span>{{ $root.labels.wc_order }}:</span>
                  </el-col>
                  <el-col :span="18">
                    <p v-for="payment in booking.payments" :key="payment.id">
                      <a :href="payment.wcOrderUrl" target="_blank">
                        #{{ payment.wcOrderId }}
                      </a>
                    </p>
                  </el-col>
                </el-row>
                <el-row :gutter="10">
                  <el-col :span="12">
                    <div class="">
                      <el-button
                          v-if="writeEvents"
                          :loading="booking.removing"
                          @click="removeAttendee(index)">
                        {{ $root.labels.event_attendee_remove }}
                      </el-button>
                    </div>
                  </el-col>
                  <el-col :span="12">
                    <div class="">
                      <el-button
                          v-if="writeEvents"
                          @click="editAttendee(index)">
                        {{ $root.labels.event_edit_attendee }}
                      </el-button>
                    </div>
                  </el-col>
                </el-row>
              </div>
            </el-collapse-item>
          </el-collapse>
        </div>

        <div v-if="bookings.filter(b => b.status === 'waiting').length === 0" class="am-empty-state am-section">
          <img :src="$root.getUrl + 'public/img/emptystate.svg'">
          <h2>{{ $root.labels.waiting_list_empty }}</h2>
        </div>

        <div v-show="!hasResult && bookings.filter(b => b.status === 'waiting').length > 0" class="am-empty-state am-section">
          <img :src="$root.getUrl + 'public/img/emptystate.svg'">
          <h2>{{ $root.labels.no_results }}</h2>
        </div>

      </el-tab-pane>

      </el-tabs>

    </div>

    <!-- Dialog Actions -->
    <transition name="slide-vertical">
      <div v-show="!dialogLoading && bookings.length > 0 && bookings.filter(booking => booking.checked).length > 0">
        <div class="am-dialog-footer">
          <div class="am-dialog-footer-actions">
            <el-row>
              <el-col :sm="12" class="align-left">
                <el-button
                    class="am-button-icon"
                    @click="showDeleteConfirmation = !showDeleteConfirmation">
                  <img class="svg-amelia" :alt="$root.labels.delete" :src="$root.getUrl+'public/img/delete.svg'"/>
                </el-button>
              </el-col>
            </el-row>
          </div>
        </div>
      </div>
    </transition>

    <!-- Dialog Delete Confirmation -->
    <transition name="slide-vertical">
      <div class="am-dialog-confirmation" v-show="!dialogLoading && showDeleteConfirmation">
        <h3>{{ bookings.filter(booking => booking.checked).length > 1 ? $root.labels.confirm_delete_attendees :
          $root.labels.confirm_delete_attendee }}</h3>
        <div class="align-left">
          <el-button size="small" @click="showDeleteConfirmation = !showDeleteConfirmation">
            {{ $root.labels.cancel }}
          </el-button>
          <el-button v-if="writeEvents" size="small" @click="removeAttendees" type="primary">
            {{ $root.labels.delete }}
          </el-button>
        </div>
      </div>
    </transition>

  </div>

</template>

<script>
  import dateMixin from '../../../js/common/mixins/dateMixin'
  import deleteMixin from '../../../js/backend/mixins/deleteMixin'
  import entitiesMixin from '../../../js/common/mixins/entitiesMixin'
  import imageMixin from '../../../js/common/mixins/imageMixin'
  import notifyMixin from '../../../js/backend/mixins/notifyMixin'
  import paymentMixin from '../../../js/backend/mixins/paymentMixin'
  import customerMixin from '../../../js/backend/mixins/customerMixin'

  export default {

    mixins: [
      imageMixin,
      dateMixin,
      entitiesMixin,
      paymentMixin,
      notifyMixin,
      deleteMixin,
      customerMixin
    ],

    props: {
      event: null,
      eventStatus: null,
      customTickets: null,
      options: null,
      eventBookings: null,
      aggregatedPrice: true,
      bookingCreatedCount: 0,
      newBooking: null,
      showHeader: {
        required: false,
        default: true,
        type: Boolean
      },
      showExport: {
        required: false,
        default: true,
        type: Boolean
      },
      writeEvents: {
        type: Boolean,
        default: true,
        required: false
      },
      popperAppendToBody: {
        type: Boolean,
        default: true,
        required: false
      },
      customersNoShowCount: {
        type: Array,
        default: () => [],
        required: false
      }
    },

    data () {
      return {
        dialogExport: false,
        bookings: [],
        name: 'events/bookings',
        successMessage: {
          single: this.$root.labels.event_attendee_deleted,
          multiple: this.$root.labels.event_attendees_deleted
        },
        errorMessage: {
          single: this.$root.labels.event_attendee_not_deleted,
          multiple: this.$root.labels.event_attendees_not_deleted
        },
        search: '',
        hasResult: true,
        dialogLoading: true,
        showDeleteConfirmation: false,
        statuses: [
          {
            value: 'approved',
            label: this.$root.labels.approved
          },
          {
            value: 'rejected',
            label: this.$root.labels.rejected
          },
          {
            value: 'no-show',
            label: this.$root.labels['no-show']
          }
        ],
        activeTab: 'Approved'
      }
    },

    methods: {
      getBookingStatus (booking) {
        if (this.eventStatus === 'rejected' || this.eventStatus === 'canceled') {
          return 'canceled'
        }
        return (booking.status === 'rejected' ? 'canceled' : booking.status)
      },

      getInitAttendeeObject () {
        return {
          id: 0,
          customer: null,
          status: 'approved',
          persons: 1,
          added: false,
          info: null,
          aggregatedPrice: this.aggregatedPrice,
          customFields: {}
        }
      },

      addAttendee () {
        this.$emit('showDialogAttendee', this.getInitAttendeeObject())
      },

      hasCapacity (bookingToTransfer) {
        let takenSpots = 0
        if (this.event.customPricing && !this.event.maxCustomCapacity) {
          let canBeTransferred = true
          let freeTickets = {}
          this.event.customTickets.forEach(ticket => {
            freeTickets[ticket.id] = ticket.spots
          })
          this.event.bookings.forEach(booking => {
            if (booking.status === 'approved') {
              booking.ticketsData.forEach(item => {
                freeTickets[item.eventTicketId] -= item.persons
              })
            }
          })
          bookingToTransfer.ticketsData.forEach(bookedTicket => {
            if (freeTickets[bookedTicket.eventTicketId] < bookedTicket.persons) canBeTransferred = false
          })

          return canBeTransferred
        } else if (this.event.maxCustomCapacity) {
          this.event.bookings.forEach(booking => {
            if (booking.status === 'approved') {
              booking.ticketsData.forEach(item => {
                takenSpots += item.persons
              })
            }
          })
          return this.event.maxCustomCapacity > takenSpots
        } else {
          this.event.bookings.forEach(b => {
            if (b.status === 'approved') {
              takenSpots += b.persons
            }
          })
          return this.event.maxCapacity > takenSpots
        }
      },

      updateBookingStatus (booking, newStatus) {
        let exceededCapacityWarning = false
        let createPaymentLinks = false

        if (booking.status === 'waiting' && newStatus === 'approved') {
          exceededCapacityWarning = !this.hasCapacity(booking)
          createPaymentLinks = true
        }
        this.$http.post(`${this.$root.getAjaxUrl}/events/bookings/` + booking.id, {
          status: newStatus,
          bookings: [{status: newStatus}],
          createPaymentLinks
        }).then(() => {
          if (exceededCapacityWarning) {
            this.notify(
              this.$root.labels.warning,
              this.$root.labels.waiting_list_capacity_warning,
              'warning'
            )
          }

          this.notify(
            this.$root.labels.success,
            this.$root.labels.event_status_changed + (this.$root.labels[newStatus]).toLowerCase(),
            'success'
          )

          let oldStatus = booking.status
          booking.status = newStatus
          if (newStatus === 'no-show' || oldStatus === 'no-show') {
            let customersIds = this.options.entities.customers.map(c => c.id)
            if (customersIds.includes(booking.customer.id)) {
              let customerIndex = customersIds.indexOf(booking.customer.id)
              let customerNoShowCount = this.options.entities.customers[customerIndex].noShowCount
              this.options.entities.customers[customerIndex].noShowCount = customerNoShowCount +
                  (newStatus === 'no-show' ? 1 : -1)
            }
          }
          this.$emit('updateAttendeesCallback')
        }).catch(e => {
          this.notify(this.$root.labels.error, e.message, 'error')
        })
      },

      getCustomer (booking) {
        return booking.info ? JSON.parse(booking.info) : booking.customer
      },

      getTicketsSoldString (bookedTicket) {
        let ticketName = this.customTickets.filter(ticket => ticket.id === bookedTicket.eventTicketId)[0].name
        return bookedTicket.persons + ' x ' + ticketName
      },

      instantiateDialog () {
        if (this.eventBookings) {
          this.bookings = this.eventBookings
          this.bookings.tickets = []
          this.dialogLoading = false
        }

        if (this.$root.settings.appointments.waitingListEvents.enabled && this.event.settings.waitingList.enabled) {
          this.statuses.push({
            value: 'waiting',
            label: this.$root.labels.waiting_list
          })
        }
      },

      closeDialog () {
        this.$emit('closeDialog')
      },

      removeAttendee (index) {
        let $this = this
        let deletedSuccessIds = []

        this.bookings[index].removing = true

        this.deleteEntities(
          [this.bookings[index].id],
          function () {
            setTimeout(function () {
              for (let i = $this.bookings.length - 1; i >= 0; i--) {
                if (deletedSuccessIds.indexOf($this.bookings[i].id) !== -1) {
                  $this.bookings.splice(i, 1)
                }
              }

              $this.$emit('updateAttendeesCallback')

              if ($this.bookings.length === 0) {
                $this.$emit('closeDialog')
              }
            }, 500)
          },
          function (id) {
            deletedSuccessIds.push(id)
          },
          function (id) {
          }
        )
      },

      editAttendee (index) {
        this.$emit('showDialogAttendee', this.bookings[index])
      },

      removeAttendees () {
        let $this = this
        let deletedSuccessIds = []

        $this.dialogLoading = true
        $this.showDeleteConfirmation = false

        this.deleteEntities(
          $this.bookings.filter(booking => booking.checked).map(booking => booking.id),
          function () {
            setTimeout(function () {
              for (let i = $this.bookings.length - 1; i >= 0; i--) {
                if (deletedSuccessIds.indexOf($this.bookings[i].id) !== -1) {
                  $this.bookings.splice(i, 1)
                }
              }

              $this.dialogLoading = false

              $this.$emit('updateAttendeesCallback')

              if ($this.bookings.length === 0) {
                $this.$emit('closeDialog')
              }
            }, 500)
          },
          function (id) {
            deletedSuccessIds.push(id)
          },
          function (id) {
          }
        )
      },

      searchAttendees () {
        let $this = this

        this.bookings.forEach(function (booking) {
          booking.show = (booking.customer.firstName.toLowerCase().startsWith($this.search.toLowerCase()) ||
            booking.customer.lastName.toLowerCase().startsWith($this.search.toLowerCase()) ||
            (booking.customer.firstName + ' ' + booking.customer.lastName).toLowerCase().startsWith($this.search.toLowerCase()) ||
            (booking.customer.lastName + ' ' + booking.customer.firstName).toLowerCase().startsWith($this.search.toLowerCase()) ||
            (booking.customer.email !== null && booking.customer.email.toLowerCase().startsWith($this.search.toLowerCase())) ||
            (booking.customer.phone !== null && booking.customer.phone.toLowerCase().startsWith($this.search.toLowerCase())) ||
            (booking.token !== null ? booking.token.toLowerCase().substring(0, 5).startsWith($this.search.toLowerCase()) : false) ||
            (booking.customer.firstName.split(' ').map(part => part.toLowerCase().startsWith($this.search.toLowerCase())).includes(true)) ||
            (booking.customer.lastName.split(' ').map(part => part.toLowerCase().startsWith($this.search.toLowerCase())).includes(true))
          )
        })

        this.hasResult = this.bookings.filter(booking => booking.show === true).length > 0

        if (this.hasResult) {
          this.activeTab = this.bookings.filter(booking => booking.show === true)[0].status === 'waiting' ? 'WaitingList' : 'Approved'
        }
      },

      openExportAttendeesDialog () {
        this.$emit('openExportAttendeesDialog')
      }
    },

    mounted () {
      this.instantiateDialog()
    },

    watch: {
      'bookingCreatedCount' () {
        this.bookings = this.eventBookings

        this.bookings.sort(function (a, b) {
          return (a.customer.firstName + ' ' + a.customer.lastName).localeCompare((b.customer.firstName + ' ' + b.customer.lastName))
        })

        this.hasResult = true
        this.search = ''
      }
    }
  }
</script>

