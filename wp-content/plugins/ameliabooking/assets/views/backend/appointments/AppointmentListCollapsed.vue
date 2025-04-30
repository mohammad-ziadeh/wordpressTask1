<template>
  <div>

    <!-- Collapsed Data For One Booking -->
    <div class="am-appointment-details">
      <el-row>
        <el-col>
          <el-row class="has-divider am-appointment-id am-appointment-id-details">
            <!-- Appointment ID Label -->
            <el-col :sm="5">
              <p class="am-data">{{ $root.labels.id }}:</p>
            </el-col>

            <!-- Appointment ID Value -->
            <el-col :sm="7">
              <p class="am-value">
                {{ app.id }}
              </p>
            </el-col>
          </el-row>

          <!-- Zoom -->
          <el-row v-if="app.zoomMeeting" class="am-zoom" :class="{ 'has-divider': $root.settings.role !== 'customer' }">
            <el-col :sm="12">
              <el-row v-if="$root.settings.role !== 'customer'">
                <el-col :sm="10" class="am-zoom-col-icon">
                  <p class="am-data">{{ $root.labels.zoom_start_link }}:</p>
                </el-col>
                <el-col :sm="14">
                  <p class="am-value">
                    <a
                      class="am-link"
                      :href="app.zoomMeeting.startUrl">{{ $root.labels.zoom_click_to_start }}
                    </a>
                  </p>
                </el-col>
              </el-row>
            </el-col>
            <el-col :sm="12">
              <el-row>
                <el-col :sm="10" class="am-zoom-col-icon">
                  <p class="am-data">{{ $root.labels.zoom_join_link }}:</p>
                </el-col>
                <el-col :sm="14">
                  <p class="am-value"><a class="am-link" :href="app.zoomMeeting.joinUrl">{{ $root.labels.zoom_click_to_join }}</a>
                  </p>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
          <!-- /Zoom -->

          <!-- Google meet -->
          <el-row v-if="app.googleMeetUrl" class="am-zoom has-divider">
            <el-col :sm="5" class="am-zoom-col-icon">
              <p class="am-data">{{ $root.labels.ph_google_meet_url }}:</p>
            </el-col>
            <el-col :sm="7">
              <p class="am-value">
                <a class="am-link" :href="app.googleMeetUrl">{{ $root.labels.google_meet_join }}</a></p>
            </el-col>
          </el-row>
          <!-- /Google meet -->

          <!-- Microsoft Teams -->
          <el-row v-if="app.microsoftTeamsUrl" class="am-zoom has-divider">
            <el-col :sm="5" class="am-zoom-col-icon">
              <p class="am-data">{{ $root.labels.ph_microsoft_teams_url}}:</p>
            </el-col>
            <el-col :sm="7">
              <p class="am-value">
                <a class="am-link" :href="app.microsoftTeamsUrl">{{ $root.labels.microsoft_teams_join }}</a></p>
            </el-col>
          </el-row>
          <!-- /Microsoft Teams -->

          <!-- Lesson Space -->
          <el-row v-if="app.lessonSpace" class="am-zoom has-divider">
            <el-col :sm="5" class="am-zoom-col-icon">
              <p class="am-data">{{ $root.labels.lesson_space_link }}:</p>
            </el-col>
            <el-col :sm="7">
              <p class="am-value">
                <a class="am-link" :href="app.lessonSpace">{{ $root.labels.lesson_space_join }}</a></p>
            </el-col>
          </el-row>
          <!-- /Lesson Space -->

          <!-- Location -->
          <el-row v-if="app.locationId && getLocationName(app.locationId)" class="am-zoom has-divider">
            <el-col :sm="5" >
              <p class="am-data">{{ $root.labels.location }}:</p>
            </el-col>
            <el-col :sm="7">
              <div>
                  <span class="am-value" style="font-size: 16px">
                    {{ getLocationName(app.locationId) }}
                  </span>
              </div>
            </el-col>
          </el-row>
          <!-- /Location -->

          <!-- Customer Phone, Customer Email & Custom Fields -->
          <el-row
            v-for="(booking, key) in app.bookings"
            :key="key"
            :class="{ 'has-divider': app.bookings.length > 1 && (app.bookings.length !== key + 1 || app.internalNotes) }"
          >

            <!-- Customer Name -->
            <h3 v-if="app.bookings.length > 1" :class="getNoShowClass(booking.customerId, customersNoShowCount, null, booking.customer.status)">
              {{ ((user = getCustomerById(booking.customerId)) !== null ? user.firstName + ' ' +user.lastName : '') }}
            </h3>

            <!-- Customer Email -->
            <el-col
              v-if="$root.settings.role !== 'customer'"
              :sm="12"
              class="am-appointment-collapsed-field"
            >
              <el-row>
                <!-- Customer Email Label -->
                <el-col :sm="10">
                  <p class="am-data">{{ $root.labels.customer_email }}:</p>
                </el-col>

                <!-- Customer Email Value -->
                <el-col :sm="14">
                  <a class="am-value" :href="`mailto:${((user = getCustomerById(app.bookings[key].customerId)) !== null ? user.email : '')}`" style="font-size: 16px">
                    {{ ((user = getCustomerById(app.bookings[key].customerId)) !== null ? user.email : '') }}
                  </a>
                </el-col>
              </el-row>
            </el-col>

            <!-- Date Created -->
            <el-col :lg="12" :md="12" :sm="12" v-if="app.bookings[key].created || (app.bookings[key].payments.length && app.bookings[key].payments[0].created)">
              <el-col :lg="10" :md="10" :sm="10">
                <p class="am-data">{{ $root.labels.created_on }}:</p>
              </el-col>
              <el-col :lg="14" :md="14" :sm="14">
                <div>
                      <span class="am-value" style="font-size: 16px">
                        {{ app.bookings[key].created ?
                          getFrontedFormattedDate(app.bookings[key].created) : getFrontedFormattedDate(app.bookings[key].payments[0].created) }}
                      </span>
                </div>
              </el-col>
            </el-col>
            <!-- /Date Created -->

            <!-- Customer Phone -->
            <el-col
              v-if="getCustomerInfo(app.bookings[key]) && getCustomerInfo(app.bookings[key]).phone && $root.settings.role !== 'customer'"
              :sm="12"
              class="am-appointment-collapsed-field"
            >
              <el-row>
                <!-- Customer Phone Label -->
                <el-col :sm="10">
                  <p class="am-data">{{ $root.labels.customer_phone }}:</p>
                </el-col>

                <!-- Customer Phone Value -->
                <el-col :sm="14">
                  <a class="am-value" :href="`tel:${getCustomerInfo(app.bookings[key]).phone}`" style="font-size: 16px">
                    {{ getCustomerInfo(app.bookings[key]).phone }}
                  </a>
                </el-col>
              </el-row>
            </el-col>

            <!-- Custom Fields -->
            <el-col>
              <el-row>
                <el-col
                  v-for="(customField, customFieldId) in JSON.parse(app.bookings[key].customFields)"
                  :key="app.bookings[key].id + '_' + customFieldId"
                  v-if="customField && showCustomField(customField.value)"
                  class="am-appointment-collapsed-field"
                  :sm="12"
                >
                  <el-row>
                    <!-- Custom Field Label -->
                    <el-col :sm="10">
                      <p class="am-data" v-html="getCustomFieldLabel(customField, customFieldId) + ':'"></p>
                    </el-col>

                    <!-- Custom Field Value -->
                    <el-col :sm="14">
                      <p v-if="customField.type !== 'file' && customField.type !== 'address'" class="am-value">
                        {{ customField ? getCustomFieldValue(customField.value, customField.type) : '' }}
                      </p>
                      <p v-if="customField.type === 'address'" class="am-value">
                        <a
                          class="am-link"
                          :href="'https://maps.google.com/?q=' + customField.value"
                          target="_blank"
                        >
                          {{ customField.value }}
                        </a>
                      </p>
                      <div v-else>
                        <p v-for="(fileInfo, index) in customField.value" class="am-link">
                          <a
                            :key="index"
                            :href="$root.useUploadsAmeliaPath ? $root.getAjaxUrl + '/fields/' + customFieldId + '/' + app.bookings[key].id + '/' + index : $root.getUploadsAmeliaUrl + app.bookings[key].id + '_' + fileInfo.fileName"
                            target="_blank"
                          >
                            {{ fileInfo.name }}
                          </a>
                        </p>
                      </div>
                    </el-col>
                  </el-row>
                </el-col>
              </el-row>
            </el-col>

            <!-- Extras -->
            <el-col
              v-for="(customerExtra, index) in app.bookings[key].extras"
              :key="index"
              class="am-appointment-collapsed-field"
              :sm="12"
            >
              <el-row>
                <!-- Extra Name -->
                <el-col :sm="10">
                  <p class="am-data">
                    {{ getServiceById(app.serviceId).extras.find(extra => extra.id === customerExtra.extraId).name }}
                  </p>
                </el-col>
                <!-- /Extra Name -->

                <!-- Extra Quantity & Price -->
                <el-col :sm="14">
                  <p class="am-value">
                    {{ customerExtra.quantity }}
                  </p>
                </el-col>
                <!-- /Extra Quantity & Price -->
              </el-row>
            </el-col>
            <!-- /Extras -->

            <el-col>
              <!-- Payments -->
              <el-row class="am-appointment-collapsed-field" v-if="app.bookings[key].payments.length">

                <!-- type -->
                <el-col :lg="12" :md="12" :sm="12">
                  <el-col :lg="10" :md="10" :sm="10">
                    <p class="am-data">{{ $root.labels.payment_type }}:</p>
                  </el-col>
                  <el-col :lg="14" :md="14" :sm="14">
                    <div v-for="(payment, index) in app.bookings[key].payments">
                      <span class="am-value" style="font-size: 16px">
                        <span v-if="app.bookings[key].payments.length > 1">{{ index + 1 }}. </span>{{ getPaymentTypeLabel(payment) }}
                      </span>
                    </div>
                  </el-col>
                </el-col>

                <el-col :lg="12" :md="12" :sm="12">
                  <el-col :lg="10" :md="10" :sm="10">
                    <p class="am-data">{{ $root.labels.payment_method }}:</p>
                  </el-col>

                  <el-col :lg="14" :md="14" :sm="14" style="font-size: 16px">
                    <div v-for="(payment, index) in app.bookings[key].payments" :class="getPaymentClassName(payment)">
                      <span v-if="app.bookings[key].payments.length > 1" class="am-value">{{ index + 1 }}. </span>
                      <img
                          :src="$root.getUrl + 'public/img/payments/' + getPaymentIconName(payment)"
                      >
                      <span class="am-value" v-if="!longNamePayments(payment.gateway)" style="align-self: self-end; margin-left: 5px;">{{ getPaymentGatewayNiceName(payment) }}</span>
                    </div>
                  </el-col>
                </el-col>


                <el-col :lg="12" :md="12" :sm="12">
                  <el-col :lg="10" :md="10" :sm="10">
                    <p class="am-data">{{ $root.labels.paid }}:</p>
                  </el-col>
                  <el-col :lg="14" :md="14" :sm="14">
                    <div v-for="(payment, index) in app.bookings[key].payments">
                      <p class="am-value"><span v-if="app.bookings[key].payments.length > 1">{{ index + 1 }}. </span>
                        {{ getFormattedPrice((payment.status === 'paid' || payment.status === 'partiallyPaid') ? (payment.amount - (payment.wcItemTaxValue ? payment.wcItemTaxValue : 0)) : 0) }}
                        <span v-if="payment.wcItemTaxValue"> {{ $root.labels.plus_tax }}</span></p>
                    </div>
                  </el-col>
                </el-col>
                <el-col :lg="12" :md="12" :sm="12">
                  <el-col :lg="10" :md="10" :sm="10">
                    <p class="am-data">{{ $root.labels.total_price }}:</p>
                  </el-col>
                  <el-col :lg="14" :md="14" :sm="14">
                    <div>
                      <p class="am-value">
                        {{
                          getTotalPrice(app, key)
                        }}
                      </p>
                    </div>
                  </el-col>
                </el-col>

              </el-row>
              <!-- /Payments -->

            </el-col>

            <el-col>
              <!-- Duration -->
              <el-row class="am-appointment-collapsed-field"
                v-if="hasDifferentDurations(app)"
              >
                <el-col :lg="12" :md="12" :sm="12">
                  <el-col :lg="10" :md="10" :sm="10">
                    <p class="am-data">{{ $root.labels.duration }}:</p>
                  </el-col>
                  <el-col :lg="14" :md="14" :sm="14">
                    <div>
                      <span class="am-value" style="font-size: 16px">{{ secondsToNiceDuration(app.bookings[key].duration) }}</span>
                    </div>
                  </el-col>
                </el-col>

                <el-col :lg="12" :md="12" :sm="12">
                </el-col>

              </el-row>
              <!-- /Duration -->

            </el-col>

          </el-row>

          <!-- Note -->
          <el-row v-if="app.internalNotes && $root.settings.role !== 'customer'">
            <el-col :sm="12">
              <el-row>

                <!-- Note Label -->
                <el-col :sm="10">
                  <p class="am-data">{{ $root.labels.note }}:</p>
                </el-col>

                <!-- Note Value -->
                <el-col :sm="14">
                  <p class="am-value">{{ app.internalNotes }}</p>
                </el-col>

              </el-row>
            </el-col>
          </el-row>
        </el-col>


      </el-row>
    </div>

  </div>
</template>

<script>
import entitiesMixin from '../../../js/common/mixins/entitiesMixin'
import priceMixin from '../../../js/common/mixins/priceMixin'
import dateMixin from '../../../js/common/mixins/dateMixin'
import durationMixin from '../../../js/common/mixins/durationMixin'
import customFieldMixin from '../../../js/common/mixins/customFieldMixin'
import paymentMixin from '../../../js/backend/mixins/paymentMixin'
import appointmentPriceMixin from '../../../js/backend/mixins/appointmentPriceMixin'
import customerMixin from '../../../js/backend/mixins/customerMixin'

export default {
  mixins: [entitiesMixin, priceMixin, dateMixin, durationMixin, customFieldMixin, paymentMixin, appointmentPriceMixin, customerMixin],

  props: [
    'app',
    'options',
    'customersNoShowCount'
  ],

  data () {
    return {}
  },

  mounted () {
    this.app.bookings.forEach(booking => {
      booking.payments.sort(function (a, b) {
        return new Date(a.dateTime) - new Date(b.dateTime)
      })
    })
  },

  methods: {
    getTotalPrice (app, key) {
      let isPackage = app.bookings[key].packageCustomerService && app.bookings[key].packageCustomerService.packageCustomer
      let price = isPackage ? this.getPackagePrice(app, key) : this.getAppointmentPrice(app.serviceId, this.getAppointmentService(app), [app.bookings[key]], true, false)

      price -= app.bookings[key].payments.filter(p => p.wcOrderId && p.wcItemCouponValue).reduce((partialSum, a) => partialSum + a.wcItemCouponValue, 0)
      return this.getFormattedPrice(price)
    },

    getLocationName (locationId) {
      let location = this.options.entities.locations.find(l => l.id === locationId)
      return location ? location.name : ''
    },

    hasDifferentDurations (appointment) {
      let defaultDuration = this.getServiceById(appointment.serviceId).duration

      let durations = {}

      appointment.bookings.forEach((booking) => {
        durations[booking.duration ? booking.duration : defaultDuration] = true
      })

      return Object.keys(durations).length > 1
    },

    getPaymentTypeLabel (payment) {
      let type = this.getPaymentType(payment)
      if (type === 'onsite') {
        return this.$root.labels.on_site
      }
      return this.$root.labels[type]
    },

    getCustomFieldLabel (customField, customFieldId) {
      let savedCustomField = this.options.entities.customFields.find(customField => customField.id === parseInt(customFieldId))

      return typeof savedCustomField !== 'undefined' ? savedCustomField.label.trim() : customField.label.trim()
    },

    showCustomField (value) {
      if (Array.isArray(value)) {
        return value.length > 0
      }

      return !!value
    }
  }
}
</script>
