<template>
  <div class="am-event-data">
    <el-row>
      <el-col :lg="11">
        <el-row :gutter="10" class="am-events-flex-row-middle-align">

          <!-- Checkbox -->
          <el-col :lg="6" :sm="6">
            <span class="am-event-checkbox">
              <!-- Time -->
              <span v-if="singleDatesViewActive" class="am-event-time">
                {{ handleDateTimeFormat(evt.periodStart)[1] }} - {{ handleDateTimeFormat(evt.periodEnd)[1] }}
              </span>
              <span v-if="groupDatesViewActive" class="am-event-time">
                <span>{{ handleDateTimeFormat(evt.periods[0].periodStart)[0] }}</span>
                <br>
                <span>{{ handleDateTimeFormat(evt.periods[0].periodStart)[1] }}</span>
              </span>
            </span>
          </el-col>

          <!-- Event Name -->
          <el-col :lg="7" :sm="9">
            <p class="am-col-title">{{ $root.labels.event_name }}</p>
            <h4>
              {{ evt.name }}
              <span class="am-event-data-id"> ({{ $root.labels.id }}: {{ evt.id }})</span>
            </h4>
          </el-col>

          <!-- Location -->
          <el-col :lg="4" :sm="4" :xs="12" class="am-event-location">
            <p class="am-col-title">{{ $root.labels.event_location }}</p>
            <p><span class="am-semi-strong">{{ evt.location }}</span></p>
          </el-col>

          <!-- Organizer -->
          <el-col :lg="3" :sm="4" :xs="12">
            <h4>{{ getEventOrganizerName(evt.organizerId) }}</h4>
          </el-col>

          <!-- Spots -->
          <el-col :lg="3" :sm="3" :xs="12">
            <p class="am-col-title am-event-spots">{{ $root.labels.booked + ':' }}</p>
            <div class="am-event-spots" :style="{display: 'flex', justifyContent: 'space-evenly'}">
              <span class="am-semi-strong">{{ evt.maxCapacity - evt.places }} / {{ evt.maxCapacity }}</span>
              <el-tooltip placement="top">
                <div style='text-align: left;' v-html="ticketsTooltipContent(evt.customTickets)" slot="content"></div>
                <img
                  v-if="ticketsTooltipContent(evt.customTickets) !== ''"
                  :src="$root.getUrl + 'public/img/am-package.svg'"
                />
              </el-tooltip>
            </div>
          </el-col>

          <!-- Recurring -->
          <el-col :lg="4" :sm="4" :xs="12">
            <p class="am-col-title">{{ $root.labels.event_recurring }}</p>
            <div class="am-event-recurring">
              <p v-if="evt.recurring" class="am-recurring-label">
                <img :src="$root.getUrl + 'public/img/loop.svg'"> {{ $root.labels.yes }}
              </p>
              <p v-else>{{ $root.labels.no }}</p>
            </div>
          </el-col>

        </el-row>
      </el-col>

      <el-col :lg="13">
        <el-row :gutter="10" class="am-events-flex-row-middle-align">

          <!-- Booking Opens -->
          <el-col :lg="6" :sm="10" :xs="12">
            <p class="am-col-title">{{ $root.labels.event_booking_opens }}</p>
            <el-tooltip
              class="item"
              effect="dark"
              content="Open"
              placement="top"
              :disabled="!evt.bookingOpens"
            >
              <p :class="{ 'am-event-open': evt.opened && evt.status === 'approved' }">
                <span class="am-semi-strong">{{ handleDateTimeFormat(evt.bookingOpens ? evt.bookingOpens : evt.created)[0] }}</span>
                @ <span class="am-semi-strong"> {{ handleDateTimeFormat(evt.bookingOpens ? evt.bookingOpens : evt.created)[1] }}</span>
              </p>
            </el-tooltip>
          </el-col>

          <!-- Booking Closes -->
          <el-col :lg="6" :sm="10" :xs="12">
            <p class="am-col-title">{{ $root.labels.event_booking_closes }}</p>
            <el-tooltip
              class="item"
              effect="dark"
              content="Closed"
              placement="top"
              :disabled="!evt.bookingCloses"
            >
              <p :class="{ 'am-event-closed': evt.closed && evt.status === 'approved' }">
                <span class="am-semi-strong">{{ handleDateTimeFormat(evt.bookingCloses ? evt.bookingCloses : (singleDatesViewActive ? evt.periodStart : evt.periods[0].periodStart))[0] }}</span>
                @ <span class="am-semi-strong"> {{ handleDateTimeFormat(evt.bookingCloses ? evt.bookingCloses : (singleDatesViewActive ? evt.periodStart : evt.periods[0].periodStart))[1] }}</span>
              </p>
            </el-tooltip>
          </el-col>

          <!-- Event Status -->
          <el-col :lg="3" :sm="4" :xs="24">
            <p class="am-col-title">{{ $root.labels.status_colon }}</p>
            <span :class="'am-customer-status ' + getEventStatus(evt).class">
              {{ getEventStatus(evt).label }}
            </span>
            <span v-if="evt.status === 'full' && waitingListEnabled && evt.waitingList.enabled" class="am-customer-status waiting-list">
              {{ $root.labels.waiting_list }}
            </span>
          </el-col>

          <!-- Event Actions -->
          <el-col v-if="canManage()" :lg="9" :sm="10" :xs="24" class="am-align-right">
            <div class="am-event-actions" @click.stop>

              <!-- View Attendees -->
              <el-button @click="showDialogAttendees(evt.id)" v-if="canManage()" :disabled="!canManage()">
                {{ $root.labels.event_attendees}}
              </el-button>

              <!-- Edit Button -->
              <el-button @click="showDialogEditEvent(evt.id)" v-if="canManage()" :disabled="!canManage()">
                {{ $root.labels.edit }}
              </el-button>
            </div>

          </el-col>

          <!-- Zoom Link (For Customer) -->
          <el-col
            v-if="$root.settings.role === 'customer' && $root.settings.zoom.enabled && evt.zoomMeeting"
            :lg="9" :sm="10" :xs="24"
            class="am-align-right"
          >
            <p class="am-col-title">{{ $root.labels.zoom_join_link }}</p>
            <a class="am-link" style="float: left" :href="evt.zoomMeeting.joinUrl">
              {{ evt.zoomMeeting.joinUrl }}
            </a>
          </el-col>
          <!-- /Zoom Link (For Customer) -->

        </el-row>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import backendEventMixin from '../../../js/backend/mixins/eventMixin'
import commonEventMixin from '../../../js/common/mixins/eventMixin'
import dateMixin from '../../../js/common/mixins/dateMixin'
import durationMixin from '../../../js/common/mixins/durationMixin'
import entitiesMixin from '../../../js/common/mixins/entitiesMixin'
import helperMixin from '../../../js/backend/mixins/helperMixin'
import imageMixin from '../../../js/common/mixins/imageMixin'
import notifyMixin from '../../../js/backend/mixins/notifyMixin'
import customerMixin from '../../../js/backend/mixins/customerMixin'

export default {
  mixins: [entitiesMixin, imageMixin, dateMixin, durationMixin, notifyMixin, helperMixin, backendEventMixin, commonEventMixin, customerMixin],

  props: {
    evt: null,
    singleDatesViewActive: true,
    groupDatesViewActive: false,
    employees: {
      type: Array,
      required: true
    }
  },

  data () {
    return {
      event: null,
      customer: null,
      waitingListEnabled: false
    }
  },

  mounted () {
    this.waitingListEnabled = this.$root.settings.appointments.waitingListEvents.enabled
  },

  methods: {
    showDialogEditEvent (id) {
      this.$emit('showDialogEditEvent', id)
    },

    showDialogAttendees (id) {
      this.$emit('showDialogAttendees', id)
    },

    getEventOrganizerName (organizerId) {
      let organizerName = ''
      if (organizerId) {
        let organizer = this.employees.filter(empl => empl.id === organizerId)
        organizerName = organizer.length ? (organizer[0].firstName + ' ' + organizer[0].lastName) : ''
      }

      return organizerName || '/'
    },

    ticketsTooltipContent (tickets) {
      let content = 'Tickets: '

      for (let i = 0; i < tickets.length; i++) {
        content += tickets[i].sold !== 0 ? (tickets[i].name + ' x ' + tickets[i].sold + (tickets.length - 1 !== i ? ', ' : '')) : ''
      }
      if (content.charAt(content.length - 2) === ',') content = content.slice(0, content.length - 2)

      return content !== 'Tickets: ' ? content : ''
    },

    canManage () {
      return this.$root.settings.role !== 'customer' && (this.$root.settings.role === 'admin' || this.$root.settings.role === 'manager' || (this.$root.settings.role === 'provider' && this.$root.settings.roles.allowWriteEvents))
    }
  }
}
</script>
