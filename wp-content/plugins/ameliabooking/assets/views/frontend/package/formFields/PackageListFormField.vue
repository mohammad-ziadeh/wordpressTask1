<template>
  <div>
    <div class="am-overview-booking" v-if="hasHeader">
      <h2 :style="{fontWeight: 500, fontFamily: $root.settings.customization.font}">
        {{ this.formField.labels.package_list_overview.value || $root.labels.package_list_overview }}
      </h2>

      <div class="am-package-rule">
        <div>
          <span>
            <i class="el-icon-date"></i> {{ $root.labels.package_book_service }} {{ quantity ? $root.labels.package_book_service_2 + ' ' + quantity + ' ' + (quantity === 1 ? $root.labels.appointment.toLowerCase() : $root.labels.appointments.toLowerCase()) + '.' : '' }}
          </span>
        </div>

        <div v-if="bookable.durationType !== null || bookable.endDate !== null">
          <span v-if="bookable.durationType === 'day' || bookable.durationType === 'week' || bookable.durationType === 'month'">
            <i class="el-icon-time"></i> {{ $root.labels.package_book_duration }} {{ bookable.durationCount }}  {{ bookable.durationCount > 1 ? $root.labels[bookable.durationType + 's'].toLowerCase() : $root.labels[bookable.durationType].toLowerCase() + '.' }}
          </span>
          <span v-if="bookable.endDate !== null">
            <i class="el-icon-time"></i> {{ $root.labels.package_book_expire }} {{ formatDate(bookable.endDate) }}
          </span>
        </div>
      </div>
    </div>
    <div class="am-appointments-wrapper">
      <h2 :style="{fontWeight: 500, fontFamily: $root.settings.customization.font}">
        {{ labelAppointments || $root.labels.appointments }}
      </h2>
      <div>
        <el-row class="am-appointment-block" v-for="(appointment, key) in bookable.bookings" :key="key">
          <el-col :sm="24">
            <el-collapse v-model="activeServiceAccordion">
              <el-collapse-item :name="key">
                <template slot="title">
                  <div class="am-appointment-service-name">
                    <el-popover
                      popper-class="bla"
                      placement="bottom"
                      :title="appointment.serviceName"
                      :disabled="appointment.serviceName.length < 7"
                      trigger="click"
                    >
                      <p @click.stop slot="reference">{{ appointment.serviceName }}</p>
                    </el-popover>
                  </div>
                  <div :class="{'am-blue-badge': !quantity}">
                    <p>
                      {{ !quantity ? 'x' + appointment.serviceQuantity : '' }}
                      {{ appointment.singleEmployee !== null ? ', ' + appointment.singleEmployee.firstName + ' ' + appointment.singleEmployee.lastName : '' }}
                      {{ appointment.singleLocation !== null ? ', ' + appointment.singleLocation.name : '' }}
                    </p>
                  </div>
                  <div class="am-package-service-duration">
                    <i class="el-icon-time"></i>
                    {{ serviceDuration(appointment.serviceDuration)}}
                  </div>
                </template>
                <el-row class="am-appointment-header">
                  <el-col :sm="appointment.spanLengths.appointment" class="am-appointment-header-cell am-text-upper am-text-gray">
                    #
                  </el-col>
                  <el-col :sm="appointment.spanLengths.date" class="am-appointment-header-cell am-text-upper am-text-gray">
                    {{ labelDate || $root.labels.date }}
                  </el-col>
                  <el-col :sm="appointment.spanLengths.time" class="am-appointment-header-cell am-text-upper am-text-gray">
                    {{ labelTime || $root.labels.time }}
                  </el-col>
                  <el-col
                    v-if="appointment.singleEmployee === null"
                    :sm="appointment.spanLengths.employee"
                    class="am-appointment-header-cell am-text-upper am-text-gray"
                  >
                    {{ labelEmployee || $root.labels.employee }}
                  </el-col>
                  <el-col
                    v-if="appointment.singleLocation === null && appointment.hasLocations"
                    :sm="appointment.spanLengths.location"
                    class="am-appointment-header-cell am-text-upper am-text-gray"
                  >
                    {{ labelLocation || $root.labels.location }}
                  </el-col>
                </el-row>
                <el-row class="am-appointment-body"  v-for="(booking, key) in appointment.serviceAppointment" :key="key">
                  <el-col
                    :sm="appointment.spanLengths.appointment"
                    class="am-appointment-body-cell"
                  >
                    <div class="am-appointment-body-heading am-text-upper am-text-gray">
                      {{ labelAppointment || $root.labels.appointment }}
                    </div>
                    <div>
                      {{ key + 1 }}
                    </div>
                  </el-col>
                  <el-col :sm="appointment.spanLengths.date" class="am-appointment-body-cell">
                    <div class="am-appointment-body-heading am-text-upper am-text-gray">
                      {{ labelDate || $root.labels.date }}
                    </div>
                    <div>
                      {{ formatDate(booking.date) }}
                    </div>
                  </el-col>
                  <el-col :sm="appointment.spanLengths.time" class="am-appointment-body-cell">
                    <div class="am-appointment-body-heading am-text-upper am-text-gray">
                      {{ labelTime || $root.labels.time }}
                    </div>
                    <div>
                      {{ formatTime(booking.time) }}
                    </div>
                  </el-col>
                  <el-col
                    v-if="appointment.singleEmployee === null"
                    :sm="appointment.spanLengths.employee"
                    class="am-appointment-body-cell"
                  >
                    <div class="am-appointment-body-heading am-text-upper am-text-gray">
                      {{ labelEmployee || $root.labels.employee }}
                    </div>
                    <div>
                      {{ booking.provider.firstName }}
                      {{ booking.provider.lastName }}
                    </div>
                  </el-col>
                  <el-col
                    v-if="appointment.singleLocation === null && appointment.hasLocations"
                    :sm="appointment.spanLengths.location"
                    class="am-appointment-body-cell"
                  >
                    <div class="am-appointment-body-heading am-text-upper am-text-gray">
                      {{ labelLocation || $root.labels.location }}
                    </div>
                    <div>
                      {{ booking.location ? booking.location.name : '' }}
                    </div>
                  </el-col>
                </el-row>
              </el-collapse-item>
            </el-collapse>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import dateMixin from '../../../../js/common/mixins/dateMixin'

export default {
  name: 'packageListFormField',

  mixins: [dateMixin],

  props: {
    hasHeader: {
      type: Boolean,
      default: true
    },
    quantity: {
      type: Number,
      default: 0
    },
    bookable: {
      type: Object,
      default: () => {}
    },
    formField: {
      type: Object,
      default: () => {}
    }
  },

  data () {
    return {
      activeServiceAccordion: [0],
      labelAppointments: this.formField.labels.appointments.value,
      labelAppointment: this.formField.labels.appointment.value,
      labelDate: this.formField.labels.date.value,
      labelTime: this.formField.labels.time.value,
      labelEmployee: this.formField.labels.employee.value,
      labelLocation: this.formField.labels.location.value
    }
  },

  methods: {
    formatDate (date) {
      return this.getFrontedFormattedDate(
        moment(date).format('YYYY-MM-DD')
      )
    },

    formatTime (time) {
      return this.getFrontedFormattedTime(time)
    },

    serviceDuration (seconds) {
      let hours = moment.duration(seconds * 1000).hours() ? `${moment.duration(seconds * 1000).hours()}h` : ''
      let minutes = moment.duration(seconds * 1000).minutes() ? `${moment.duration(seconds * 1000).minutes()}min` : ''
      return `${hours}${minutes}`
    }
  }
}
</script>
