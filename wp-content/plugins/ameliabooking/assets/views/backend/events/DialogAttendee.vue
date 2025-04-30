<template>
  <div class="am-dialog-attendees-inner">
    <!-- Dialog Loader -->
    <div class="am-dialog-loader" v-show="dialogLoading">
      <div class="am-dialog-loader-content">
        <img :src="$root.getUrl+'public/img/spinner.svg'" class=""/>
        <p>{{ $root.labels.loader_message }}</p>
      </div>
    </div>

    <!-- Dialog Content -->
    <div class="am-dialog-scrollable" :class="{'am-edit':eventBooking.id !== 0}" v-if="eventBooking && !dialogLoading" style="overflow-x: hidden;">

      <!-- Dialog Header -->
      <div v-if="showHeader" class="am-dialog-header">
        <el-row>
          <el-col :span="18">
            <h2 v-if="eventBooking.customer">{{ $root.labels.event_edit_attendee }}</h2>
            <h2 v-if="!eventBooking.customer">{{ $root.labels.event_add_attendee }}</h2>
          </el-col>
          <el-col :span="6" class="align-right">
            <el-button @click="closeDialog" class="am-dialog-close" size="small" icon="el-icon-close">
            </el-button>
          </el-col>
        </el-row>
      </div>

      <!-- Form -->
      <el-form v-if="mounted" :model="{bookings: [eventBooking]}" ref="appointment" :rules="rules" label-position="top">
        <!-- Customer -->
        <el-form-item :label="$root.labels.customer + ':'" prop="bookings">
          <el-select
            v-model="eventBooking.customerId"
            ref="customerSelect"
            remote
            filterable
            clearable
            :remote-method="searchExistingCustomers"
            :disabled="eventBooking.added !== false"
            :placeholder="$root.labels.customer"
            :popper-class="'am-dropdown-cabinet'"
            :loading="loadingCustomers"
            @clear="searchExistingCustomers"
            @visible-change="dropDownVisible"
          >
            <div class="am-drop">
              <div class="am-drop-create-item" @click="showDialogNewCustomer"
                   v-if="this.$root.settings.additionalCapabilities.canWriteCustomers">
                {{ $root.labels.create_new }}
              </div>
              <el-option
                v-for="item in customers"
                :key="item.id"
                :label="item.firstName + ' ' + item.lastName"
                :value="item.id"
                class="am-has-option-meta"
              >
                <span :class="getOptionClass(item, null, item.status)">{{ item.firstName }} {{ item.lastName }}</span>
                <span class="am-drop-item-meta" v-if="item.email">{{ item.email }}</span>
              </el-option>
              <el-option
                v-if="customers.length === 0"
                v-for="item in [{customer: {id: 0, firstName: '', lastName: '', email: '', info: JSON.stringify({firstName: '', lastName: '', email: '', phone: ''})}}]"
                :key="item.customer.id"
                :label="item.firstName + ' ' + item.lastName"
                :value="item"
                class="am-has-option-meta"
                :style="{'display': 'none'}"
              >
              </el-option>
            </div>
          </el-select>
        </el-form-item>

        <el-form-item :label="$root.labels.event_book_persons + ':'" v-if="eventBooking.id ? !(eventBooking.ticketsData && eventBooking.ticketsData.length) : !eventCustomPricing">
          <el-input-number v-model="eventBooking.persons" :min="1">
          </el-input-number>
        </el-form-item>

        <el-form-item :label="$root.labels.event_book_tickets + ':'" v-if="eventBooking.id ? (eventBooking.ticketsData && eventBooking.ticketsData.length) : eventCustomPricing">

          <!-- Custom Tickets -->
          <div
              :style="{flexWrap: 'wrap'}"
              class="am-ticket-box"
          >
            <div
                class="am-ticket"
                v-for="(booking, index) in ticketsData"
                :key="index"
            >
              <el-row>
                <el-col :sm="16" :lg="16"  class="am-ticket-info">
                  <span class="am-ticket-name" :style="{fontWeight: 500}">
                    {{ getTicketName(booking) }}
                  </span>
                </el-col>
                <el-col :sm="8" :lg="8" class="am-ticket-number-of-people">
                  <el-input-number
                      :style="{maxHeight: '32px', lineHeight: '32px', overflow: 'hidden'}"
                      size="mini"
                      v-model="booking.persons"
                      :min="0"
                      type="number"
                      @change="changeTicketsCount(index)"
                  >
                  </el-input-number>
                </el-col>
              </el-row>
            </div>
          </div>
          <!-- /Custom Tickets -->
        </el-form-item>

        <el-form-item :label="$root.labels.status + ':'" v-if="isWaitingList && eventBooking.id === 0">
          <el-select
              v-model="eventBooking.status"
              :popper-append-to-body="popperAppendToBody"
              :disabled="!writeEvents"
          >
            <el-option
                v-for="item in statuses"
                :key="item.value"
                :value="item.value"
                :label="item.label"
                class="am-appointment-dialog-status-option"
            >
              <span :class="'am-appointment-status-symbol-wl-status am-appointment-status-symbol am-appointment-status-symbol-'+(item.value === 'rejected' ? 'canceled' : item.value)">
                {{item.label}}
              </span>
            </el-option>
          </el-select>
        </el-form-item>

        <!-- Event Coupon -->
        <el-form-item :label="$root.labels.coupon"
                      v-if="couponsFilteredEvent.length > 0 && showCoupon && ($root.settings.role === 'admin' || $root.settings.role === 'manager')">
          <el-select
            v-model="eventBooking.coupon"
            filterable
            clearable
            :placeholder="$root.labels.select_coupon"
            :popper-class="'am-dropdown-cabinet'"
            :disabled="$root.settings.role === 'customer'"
          >
            <el-option
              v-for="item in couponsFilteredEvent"
              :disabled="item.disabled"
              :key="item.id"
              :label="item.code + (couponExpired(item.expirationDate) ? ` - ${$root.labels.expired}` : '')"
              :value="item.id"
            >
            </el-option>
          </el-select>
          <img :src="$root.getUrl+'public/img/oval-spinner.svg'" class="svg-amelia is-spinner"/>
        </el-form-item>

        <dialog-custom-fields
          entityType="event"
          :appointment="{bookings: [eventBooking]}"
          :entityId="eventId"
          :customFields="options.entities.customFields"
          :is-cabinet="isCabinet"
          :showCustomerInfo="false"
          @clearValidation="clearValidation"
        >
        </dialog-custom-fields>
      </el-form>
    </div>

    <!-- Dialog Actions -->
    <dialog-actions
        v-if="eventBooking && !dialogLoading"
        formName="appointment"
        :urlName="eventBooking.id !== 0 ? 'events/bookings' : 'bookings'"
        :isNew="eventBooking.id === 0"
        :entity="eventBooking"
        :getParsedEntity="getParsedEntity"
        @errorCallback="errorCallback"
        @validationTabFailCallback="validationTabFailCallback"
        :hasIcons="true"
        :haveSaveConfirmation="haveSaveConfirmation"

        :buttonText="{
          confirm: {
            save: {
              yes: $root.labels.yes,
              no: $root.labels.no
            }
          }
        }"

        :status="{
          on: 'visible',
          off: 'hidden'
        }"

        :action="{
          haveAdd: true,
          haveEdit: true,
          haveStatus: false,
          haveRemove: false,
          haveRemoveEffect: false,
          haveDuplicate: false
        }"

        :message="{
          success: {
            save: $root.labels.event_attendee_saved,
            remove: '',
            show: '',
            hide: ''
          },
          confirm: {
            remove: '',
            show: '',
            hide: '',
            duplicate: '',
            save: $root.labels.price_changed_message
          }
        }"
    >
    </dialog-actions>

    <div>
      <!-- Dialog Loader -->
      <div class="am-dialog-loader" v-show="dialogLoading">
        <div class="am-dialog-loader-content">
          <img :src="$root.getUrl+'public/img/spinner.svg'" class="">
          <p>{{ $root.labels.loader_message }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import DialogActions from '../parts/DialogActions.vue'
  import imageMixin from '../../../js/common/mixins/imageMixin'
  import dateMixin from '../../../js/common/mixins/dateMixin'
  import notifyMixin from '../../../js/backend/mixins/notifyMixin'
  import entitiesMixin from '../../../js/common/mixins/entitiesMixin'
  import appointmentPriceMixin from '../../../js/backend/mixins/appointmentPriceMixin'
  import priceMixin from '../../../js/common/mixins/priceMixin'
  import DialogCustomFields from '../parts/DialogCustomFields'
  import customFieldMixin from '../../../js/common/mixins/customFieldMixin'
  import customerMixin from '../../../js/backend/mixins/customerMixin'
  import eventMixin from '../../../js/common/mixins/eventMixin'

  export default {

    mixins: [entitiesMixin, imageMixin, dateMixin, notifyMixin, priceMixin, customFieldMixin, appointmentPriceMixin, customerMixin, eventMixin],

    props: {
      clonedEventBooking: null,
      paymentLinksEnabled: null,
      customTickets: null,
      eventBooking: null,
      eventCustomPricing: null,
      eventId: null,
      eventMaxCapacity: null,
      eventCustomerIds: null,
      eventBookMultipleTimes: {
        required: false,
        default: true,
        type: Boolean
      },
      options: null,
      customerCreatedCount: 0,
      showHeader: {
        required: false,
        default: true,
        type: Boolean
      },
      isCabinet: {
        type: Boolean,
        default: false,
        required: false
      },
      popperAppendToBody: {
        type: Boolean,
        default: true,
        required: false
      },
      writeEvents: {
        type: Boolean,
        default: true,
        required: false
      },
      isWaitingList: {
        type: Boolean,
        default: true,
        required: false
      }
    },

    data () {
      let validateCustomerSelection = (rule, bookings, callback) => {
        if (!this.eventBooking.customerId) {
          callback(new Error(this.$root.labels.select_single_customer_warning))
        } else {
          callback()
        }
      }

      return {
        ticketsData: null,
        showCoupon: false,
        customers: [],
        appointment: null,
        dialogLoading: true,
        executeUpdate: true,
        mounted: false,
        statusMessage: '',
        rules: {
          bookings: [
            {required: true, message: this.$root.labels.select_single_customer_warning, trigger: 'submit', type: 'array'},
            {validator: validateCustomerSelection, trigger: 'submit'}
          ]
        },
        statuses: [
          {
            value: 'approved',
            label: this.$root.labels.approved
          },
          {
            value: 'waiting',
            label: this.$root.labels.waiting_list
          }
        ]
      }
    },

    mounted () {
      this.appointment = {
        bookings: [this.eventBooking]
      }

      if ((this.eventCustomPricing && this.customTickets) ||
          (this.eventBooking.id && this.eventBooking.ticketsData && this.eventBooking.ticketsData.length)
      ) {
        this.createTicketsBooking(this.customTickets)

        if (this.eventBooking.id) {
          for (let i = 0; i < this.ticketsData.length; i++) {
            let bookingTicket = this.eventBooking.ticketsData.find(ticket => this.ticketsData[i].eventTicketId === ticket.eventTicketId)

            if (typeof bookingTicket !== 'undefined') {
              this.ticketsData[i].id = bookingTicket.id
              this.ticketsData[i].persons = bookingTicket.persons
              this.ticketsData[i].eventTicketId = bookingTicket.eventTicketId
              this.ticketsData[i].price = bookingTicket.price
              this.ticketsData[i].customerBookingId = bookingTicket.customerBookingId
            }
          }
        }
      }

      this.instantiateDialog()
      this.setBookingCustomFields()
      this.addCustomFieldsValidationRules()

      this.$nextTick(() => {
        this.$refs.customerSelect.$el.children[0].children[0].removeAttribute('readonly')
      })
    },

    updated () {
      this.instantiateDialog()
    },

    methods: {
      dropDownVisible (e) {
        if (!e) {
          setTimeout(() => {
            this.$refs.customerSelect && this.$refs.customerSelect.$el.children[0].children[0].removeAttribute('readonly')
          }, 200)
        }
      },
      haveSaveConfirmation () {
        if (this.eventBooking.id !== 0 && this.paymentLinksEnabled) {
          if (this.eventCustomPricing) {
            let oldPrice = this.clonedEventBooking.ticketsData.reduce((accumulator, currentValue) => accumulator + (currentValue.price * currentValue.persons), 0)
            let newPrice = this.ticketsData.reduce((accumulator, currentValue) => accumulator + (currentValue.price * currentValue.persons), 0)
            return oldPrice < newPrice
          } else {
            let newPrice = this.eventBooking.persons * this.eventBooking.price
            let oldPrice = this.clonedEventBooking.persons * this.clonedEventBooking.price
            return oldPrice < newPrice
          }
        }
        return false
      },

      changeTicketsCount (index) {
        if (this.selectedTicketsCount(this.ticketsData) === 0) {
          for (let i = 0; i < this.ticketsData.length; i++) {
            if (i !== index) {
              this.ticketsData[i].persons = 1

              break
            }
          }
        }
      },

      selectedTicketsCount (ticketsData) {
        let sum = 0

        ticketsData.forEach((item) => {
          sum += item.persons
        })

        return sum
      },

      createTicketsBooking (tickets) {
        let ticketsData = []
        tickets.forEach((ticket, index) => {
          ticketsData.push({
            id: 0,
            eventTicketId: ticket.id,
            persons: index === 0 && !this.eventBooking.id ? 1 : 0,
            customerBookingId: null,
            price: ticket.dateRangePrice ? ticket.dateRangePrice : ticket.price
          })
        })
        this.ticketsData = ticketsData
      },

      getTicketName (ticketBooking) {
        return this.customTickets.filter(ticket => ticket.id === ticketBooking.eventTicketId)[0].name
      },

      customersFetched () {
        this.customers = this.searchedCustomers
      },

      searchExistingCustomers (query) {
        if (query) {
          this.searchCustomers(query, this.customersFetched)
        } else {
          this.customers = this.options.entities.customers
        }
      },

      showDialogNewCustomer () {
        this.$emit('showDialogNewCustomer')
      },

      instantiateDialog () {
        if (this.eventBooking !== null && this.executeUpdate === true) {
          this.mounted = true
          this.executeUpdate = false
          this.dialogLoading = false

          if (parseInt(this.eventBooking.id) !== 0) {
            this.customers = this.options.entities.customers
          } else {
            this.showCoupon = true
            if (this.eventBookMultipleTimes) {
              this.customers = this.options.entities.customers
            } else {
              this.customers = this.options.entities.customers.filter(customer => this.eventCustomerIds.indexOf(customer.id) === -1)
            }
          }
        }
      },

      closeDialog () {
        this.$emit('closeDialog')
      },

      getParsedEntity (createPaymentLinks) {
        for (let key in this.eventBooking.customFields) {
          if (this.eventBooking.customFields[key].type === 'datepicker' && this.eventBooking.customFields[key].value) {
            this.eventBooking.customFields[key].value = this.getStringFromDate(this.eventBooking.customFields[key].value)
          }
        }

        let couponId = this.showCoupon ? this.eventBooking.coupon : (this.eventBooking.coupon ? this.eventBooking.coupon.id : null)

        let coupon = this.options.entities.coupons ? this.options.entities.coupons.find(c => c.id === couponId) : null

        let bookingStatus = this.isWaitingList ? this.eventBooking.status : 'approved'

        return {
          type: 'event',
          eventId: this.eventId,
          bookings: [
            {
              customFields: this.getAllowedCustomFields(this.eventBooking.customFields, 'events', this.eventId),
              persons: this.eventBooking.persons,
              customerId: this.eventBooking.customerId,
              customer: this.customers.find(customer => customer.id === this.eventBooking.customerId),
              coupon: coupon,
              deposit: 0,
              ticketsData: this.ticketsData,
              status: bookingStatus
            }
          ],
          couponCode: coupon ? coupon.code : null,
          validateCoupon: false,
          locale: '',
          timeZone: '',
          payment: {
            gateway: 'onSite'
          },
          isBackendOrCabinet: true,
          createPaymentLinks: createPaymentLinks
        }
      },

      clearValidation () {
        if (typeof this.$refs.eventBooking !== 'undefined') {
          this.$refs.eventBooking.clearValidate()
        }
      },

      errorCallback (responseData) {
        let $this = this

        setTimeout(function () {
          if ('message' in responseData) {
            $this.notify($this.$root.labels.error, responseData.message, 'error')

            return
          }

          if ('timeSlotUnavailable' in responseData && responseData.timeSlotUnavailable === true) {
            $this.notify($this.$root.labels.error, $this.$root.labels.maximum_capacity_reached, 'error')
          } else if (responseData.data && 'timeSlotUnavailable' in responseData.data && responseData.data.timeSlotUnavailable === true) {
            $this.notify($this.$root.labels.error, $this.$root.labels.maximum_capacity_reached, 'error')
          } else if ('customerAlreadyBooked' in responseData && responseData.customerAlreadyBooked === true) {
            $this.notify($this.$root.labels.error, $this.$root.labels.customer_already_booked_ev, 'error')
          } else if ('couponUnknown' in responseData && responseData.couponUnknown === true) {
            $this.notify($this.$root.labels.error, $this.$root.labels.coupon_unknown, 'error')
          }
        }, 200)
      },

      addCustomFieldsValidationRules () {
        // Go through all custom fields
        for (let j = 0; j < this.options.entities.customFields.length; j++) {
          // Check if custom fields is assigned to selected service
          if (this.isCustomFieldVisible(this.options.entities.customFields[j], 'event', this.eventId)) {
            if (typeof this.rules.bookings[0] === 'undefined') {
              this.$set(this.rules.bookings, 0, {type: 'array'})
            }

            if (typeof this.rules.bookings[0].customFields === 'undefined') {
              this.$set(this.rules.bookings[0], 'customFields', {})
            }

            this.rules.bookings[0].customFields[this.options.entities.customFields[j].id] = {
              value: [
                {required: true, message: this.$root.labels.required_field, trigger: 'submit'}
              ]
            }
          }
        }
      },

      showCustomFieldsTab () {
        let eventsIdsWithCustomField = Array.prototype.concat.apply(
          [], this.options.entities.customFields.map(customField => customField.events.map(event => event.id))
        )

        return this.options.entities.customFields.length > 0 &&
          this.booking !== null &&
          this.eventId &&
          eventsIdsWithCustomField.includes(this.eventId)
      },

      validationTabFailCallback () {
      }
    },

    watch: {
      'customerCreatedCount' () {
        this.customers = this.options.entities.customers

        this.eventBooking.customerId = this.customers[this.customers.length - 1].id

        this.customers.sort(function (a, b) {
          return (a.firstName + ' ' + a.lastName).localeCompare((b.firstName + ' ' + b.lastName))
        })
      }
    },

    components: {
      DialogCustomFields,
      DialogActions
    }

  }
</script>
