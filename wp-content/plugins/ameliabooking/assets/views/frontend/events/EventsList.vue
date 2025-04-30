<template>
  <div id="amelia-booking-wrap" class="am-wrap">
    <!-- Spinner -->
    <div class="am-spinner am-section" v-show="!fetched">
      <img class="svg-booking am-spin" :src="$root.getUrl + 'public/img/oval-spinner.svg'">
      <img class="svg-booking am-hourglass" :src="$root.getUrl + 'public/img/hourglass.svg'">
    </div>

    <div id="am-events-booking" v-show="fetched">
      <!-- Event Filter -->
      <div class="am-events-filter">
        <el-row :gutter="24">
          <!-- Event Filter Tags -->
          <el-col
            v-show="showTags()"
            :sm="getColumnLength()[0]"
            :class="$root.settings.customization.forms ? `el-form-item am-select-${$options.name}`: ''"
          >
            <el-select
              v-model="params.tag"
              clearable
              :placeholder="eventFilterLabels.event_type.value || $root.labels.event_type"
              :popper-class="$root.settings.customization.forms ? `am-dropdown-${$options.name}` : ''"
              @change="getEvents(false)"
            >
              <template slot="prefix">
                <svg width="20" height="18" viewBox="0 0 20 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17.5 17.4999H2.5C1.84661 17.508 1.21666 17.2568 0.748098 16.8013C0.279533 16.3459 0.0105328 15.7233 0 15.0699V2.92994C0.0105328 2.27659 0.279533 1.65403 0.748098 1.19858C1.21666 0.743137 1.84661 0.491921 2.5 0.499942H7.1C7.24771 0.500919 7.39336 0.534605 7.5265 0.59858C7.65964 0.662555 7.77695 0.755229 7.87 0.869942L10.47 4.04994H17.47C17.796 4.04198 18.1204 4.09866 18.4244 4.21672C18.7285 4.33478 19.0061 4.51188 19.2413 4.7378C19.4765 4.96372 19.6647 5.23398 19.7949 5.53299C19.9251 5.83201 19.9948 6.15385 20 6.47994V15.0699C19.9895 15.7233 19.7205 16.3459 19.2519 16.8013C18.7833 17.2568 18.1534 17.508 17.5 17.4999Z"/>
                </svg>
              </template>
              <el-option
                v-for="(tag, index) in options.entities.tags.map(eventTag => eventTag.name)"
                :key="index"
                :label="tag"
                :value="tag"
              >
              </el-option>
            </el-select>
          </el-col>
          <!-- /Event Filter Tags -->

          <!-- Event Filter Date -->
          <el-col
            v-show="showDatePicker()"
            :sm="getColumnLength()[1]"
            :class="$root.settings.customization.forms ? `am-calendar-${$options.name}`: ''"
            class="v-calendar-column"
          >
            <v-date-picker
              v-model="params.date"
              id="am-calendar-picker"
              class="am-calendar-picker"
              tint-color='#1A84EE'
              mode="single"
              popover-visibility="focus"
              popover-direction="bottom"
              popover-align="center"
              :input-props="{class: 'el-input__inner', placeholder: this.$root.labels.event_pick_min_date, readonly: true}"
              :show-day-popover=false
              :is-expanded=false
              :is-inline=false
              :is-required=true
              :formats="vCalendarFormats"
              @input="getEvents(false)"
            >
              <el-input
                v-model="selectedDateInput"
                readonly
              >
                <template slot="prefix">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="22" viewBox="0 0 22 24">
                    <path fill-rule="evenodd" d="M15.714 2.667H6.286V0H2.75v2.667H.78A.783.783 0 0 0 0 3.45v19.764A.78.78 0 0 0 .783 24h20.434a.785.785 0 0 0 .783-.785V3.451a.782.782 0 0 0-.78-.784h-1.97V0h-3.536v2.667zM2.75 21.429V8h16.5v13.429H2.75zM12 14v6h6v-6h-6z"/>
                  </svg>
                </template>
              </el-input>
            </v-date-picker>
          </el-col>
          <!-- /Event Filter Date -->

          <!-- Event Filter Location -->
          <el-col
            v-show="showLocations()"
            :sm="getColumnLength()[2]"
            :class="$root.settings.customization.forms ? `el-form-item am-select-${$options.name}`: ''"
          >
            <el-select
              v-model="params.locationId"
              clearable
              :placeholder="(eventFilterLabels.hasOwnProperty('event_location') ? eventFilterLabels.event_location.value : '') || $root.labels.event_location"
              :popper-class="$root.settings.customization.forms ? `am-dropdown-${$options.name}` : ''"
              @change="getEvents(false)"
            >
              <template slot="prefix">
                <svg width="20" height="24" viewBox="0 0 20 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10 0.16674C7.54075 0.166617 5.18082 1.13713 3.43314 2.86733C1.68546 4.59753 0.69128 6.9476 0.666687 9.40674C0.666687 15.8001 8.89169 22.9167 9.24169 23.2201C9.45301 23.4008 9.72194 23.5001 10 23.5001C10.2781 23.5001 10.547 23.4008 10.7584 23.2201C11.1667 22.9167 19.3334 15.8001 19.3334 9.40674C19.3088 6.9476 18.3146 4.59753 16.5669 2.86733C14.8192 1.13713 12.4593 0.166617 10 0.16674ZM10 20.7584C8.05169 18.9034 3.00002 13.7584 3.00002 9.40674C3.00002 7.55022 3.73752 5.76975 5.05027 4.45699C6.36303 3.14424 8.1435 2.40674 10 2.40674C11.8565 2.40674 13.637 3.14424 14.9498 4.45699C16.2625 5.76975 17 7.55022 17 9.40674C17 13.7234 11.9484 18.9034 10 20.7584Z"/>
                  <path d="M10 4.83337C9.19241 4.83337 8.40294 5.07286 7.73144 5.52154C7.05994 5.97022 6.53656 6.60795 6.22751 7.35408C5.91845 8.10022 5.83759 8.92124 5.99514 9.71333C6.1527 10.5054 6.5416 11.233 7.11266 11.8041C7.68373 12.3751 8.41131 12.764 9.2034 12.9216C9.99548 13.0791 10.8165 12.9983 11.5626 12.6892C12.3088 12.3802 12.9465 11.8568 13.3952 11.1853C13.8439 10.5138 14.0833 9.72431 14.0833 8.91671C14.0833 7.83374 13.6531 6.79513 12.8874 6.02935C12.1216 5.26358 11.083 4.83337 10 4.83337ZM10 10.6667C9.6539 10.6667 9.31555 10.5641 9.02777 10.3718C8.73998 10.1795 8.51568 9.90617 8.38323 9.5864C8.25077 9.26663 8.21612 8.91477 8.28364 8.5753C8.35116 8.23583 8.51784 7.92401 8.76258 7.67927C9.00732 7.43453 9.31914 7.26786 9.65861 7.20033C9.99807 7.13281 10.3499 7.16746 10.6697 7.29992C10.9895 7.43237 11.2628 7.65667 11.4551 7.94446C11.6474 8.23225 11.75 8.57059 11.75 8.91671C11.75 9.38084 11.5656 9.82596 11.2375 10.1541C10.9093 10.4823 10.4641 10.6667 10 10.6667Z"/>
                </svg>
              </template>
              <el-option
                v-for="(location, index) in options.entities.locations"
                :key="index"
                :label="location.name"
                :value="location.id"
              >
              </el-option>
            </el-select>
          </el-col>
          <!-- /Event Filter Location -->
        </el-row>
      </div>
      <!-- /Event Filter -->

      <!-- Event List -->
      <div class="am-event-list" :style="{'opacity': !fetchedFiltered ? '0.3' : 1, 'pointer-events': fetchedFiltered ? 'all' : 'none'}">

        <!-- Event -->
        <div
          v-for="(evt, index) in events"
          v-if="evt.show"
          :id="'am-event-' + evt.id"
          :key="index"
          class="am-event"
          :class="[{
            'am-active': evt.showEventDetails,
            'inactive': events.filter(event => (event.showEventDetails || event.showEventBooking || event.showAddToCalendar) && event.id !== evt.id).length > 0,
            'canceled': getEventAvailability(evt).class === 'canceled',
            'closed': getEventAvailability(evt).class === 'closed' && !evt.showAddToCalendar,
            'full': getEventAvailability(evt).class === 'full',
            'upcoming': getEventAvailability(evt).class === 'upcoming'
          }, $root.settings.customization.forms ? `am-form-${$options.name}` : '']"
          :style="{'pointer-events': 'all'}"
        >
          <!-- Event Data -->
          <div class="am-event-data" @click="toggleEventDetails(evt)">

            <!-- Event Dates -->
            <div v-if="isEventInSameDay(evt)" class="am-event-date">
              <div class="am-event-date-month" :style="getBookableColor(evt, false)">
                {{ getEventFrontedFormattedDate(evt.periods[0].periodStart).split(' ')[0] }}
              </div>
              <div class="am-event-date-day">
                {{ getEventFrontedFormattedDate(evt.periods[0].periodStart).split(' ')[1] }}
              </div>
            </div>

            <div v-else class="am-event-dates">
              <div>
                <div class="am-event-date-month" :style="getBookableColor(evt, false)">
                  {{ getEventFrontedFormattedDate(evt.periods[0].periodStart).split(' ')[0] }}
                </div>
                <div class="am-event-date-day">
                  {{ getEventFrontedFormattedDate(evt.periods[0].periodStart).split(' ')[1] }}
                </div>
              </div>

              <div>
                <div class="am-event-date-month" :style="getBookableColor(evt, false)">
                  {{ getEventFrontedFormattedDate(evt.periods[evt.periods.length - 1].periodEnd).split(' ')[0] }}
                </div>
                <div class="am-event-date-day">
                  {{ getEventFrontedFormattedDate(evt.periods[evt.periods.length - 1].periodEnd).split(' ')[1] }}
                </div>
              </div>
            </div>

            <!-- Event Info -->
            <div class="am-event-info">
              <div class="am-event-title">
                {{ evt.name }}
                <span class="am-event-booking-status" :class="getEventAvailability(evt).class" >
                  {{ getEventAvailability(evt).label }}
                </span>
              </div>
              <div class="am-event-sub-info">
                <div v-if="eventInfoLabels.event_capacity.visibility" class="am-event-sub-info-capacity">
                  <img :src="$root.getUrl + 'public/img/capacity.svg'">
                  {{ eventInfoLabels.event_capacity.value || $root.labels.event_capacity}}
                  {{ evt.maxCapacity - evt.places }} / {{ evt.maxCapacity }}
                </div>
                <div v-if="getLocation(evt) && eventInfoLabels.location.visibility">
                  <img :src="$root.getUrl + 'public/img/pin.svg'"> {{ getLocation(evt) }}
                </div>
                <div v-if="eventInfoLabels.event_date.visibility">
                  <img :src="$root.getUrl + 'public/img/clock.svg'"> {{ getEventDatesAndTimes(evt.periods) }}
                </div>
                <div v-if="eventInfoLabels.time_zone.visibility">
                  {{ timeZoneString }}
                </div>
              </div>
            </div>

            <!-- Event Price -->
            <div v-if="(evt.price !== 0 && eventInfoLabels.event_price.visibility) || (evt.customTickets.length && evt.customPricing && eventInfoLabels.event_price.visibility)"
                 class="am-event-price" :style="getBookableColor(evt, true)">
              {{
                (evt.customTickets.length && evt.customPricing) ?
                    ($root.labels.from + ' ' + getFormattedPrice(getMinTicketPrice(evt), !$root.settings.payments.hideCurrencySymbolFrontend)):
                    getFormattedPrice(evt.price, !$root.settings.payments.hideCurrencySymbolFrontend)
              }}
            </div>
            <div v-else-if="eventInfoLabels.event_price.visibility" class="am-event-price am-event-free" :style="getBookableColor(evt, false)">
              {{eventInfoLabels.event_free.value || $root.labels.event_free}}
            </div>
            <!-- /Event Price -->
          </div>
          <!-- /Event Data -->

          <!-- Event Details -->
          <transition name="fade">
            <div v-show="evt.showEventDetails">
              <!-- Event Details -->
              <div
                v-if="(evt.gallery && evt.gallery.length) || (evt.description && evt.description.length)"
                class="am-event-details"
              >
                <div
                  v-if="evt.gallery && evt.gallery.length"
                  class="am-event-photos"
                >
                  <div
                    v-for="(photo, index) in evt.gallery"
                    :key="photo.id"
                  >
                    <lightbox
                      :thumbnail="photo.pictureThumbPath"
                      :images="getImages(evt.gallery.map(image => image.pictureFullPath), index)"
                    >
                      <lightbox-default-loader slot="loader"></lightbox-default-loader>
                      <!-- If you want to use built-in loader -->
                      <!-- <div slot="loader"></div> --> <!-- If you want to use your own loader -->
                    </lightbox>
                  </div>
                  <!-- <img v-for="photo in evt.photos" :src="photo.url">-->
                </div>
                <div v-if="evt.description && evt.description.length" class="am-event-about">
                  <div>{{ eventInfoLabels.event_about.value || $root.labels.event_about }}</div>
                  <div v-html="evt.description" class="ql-description"></div>
                </div>
              </div>

              <!-- Event Book -->
              <div
                v-if="getEventAvailability(evt).class === 'open'"
                class="am-event-book-cta"
                :class="getEventAvailability(evt).class"
              >
                <div v-if="eventInfoLabels.event_book.visibility" class="am-event-book-cta__inner">
                  <span>
                    {{eventInfoLabels.event_book.value || $root.labels.event_book}}
                  </span>
                </div>
                <div :style="{flexWrap: 'wrap', width: '100%'}">
                  <el-form>
                    <el-form-item
                      v-if="evt.bringingAnyone && !evt.customPricing"
                      :class="$root.settings.customization.forms ? `am-input-number-${$options.name}`: ''"
                    >
                      <template slot="label">
                        <span
                          :style="{
                            fontWeight: 700,
                            color: $root.settings.customization.useGlobalColors.eventListForm ? $root.settings.customization.globalColors.formTextColor : forms.eventListForm.globalSettings.formTextColor
                          }"
                        >
                          {{ eventInfoLabels.event_book_persons.value || $root.labels.event_book_persons }}
                        </span>
                      </template>
                      <el-input-number
                        :value="appointment.bookings[0].persons"
                        :min="1"
                        :max="(evt.maxExtraPeople !== null && evt.places > evt.maxExtraPeople ? (evt.maxExtraPeople + 1) : evt.places)"
                        type="number"
                        @change="setPlaces"
                      >
                      </el-input-number>
                    </el-form-item>
                    <!-- Custom Tickets -->
                    <div
                      :style="{flexWrap: 'wrap'}"
                      v-else-if="evt.customTickets.length && evt.customPricing"
                      class="am-ticket-box"
                    >
                      <div
                        class="am-ticket"
                        v-for="(ticket, index) in evt.customTickets"
                        :key="ticket.id"
                        v-if="ticket.enabled"
                      >
                        <el-row class="justify-content-center">
                          <el-col :sm="12" :lg="12"  class="am-ticket-info">
                            <span class="am-ticket-name" :style="{fontWeight: 500, color: forms.eventListForm.globalSettings.formTextColor}">
                              {{ ticket.name }}
                            </span>
                            <div class="am-event-price" :style="{fontWeight: 500}">
                              {{ getFormattedPrice(ticket.dateRangePrice ? ticket.dateRangePrice : ticket.price, !$root.settings.payments.hideCurrencySymbolFrontend) }}
                            </div>
                            <span v-if="!evt.maxCustomCapacity && eventSpotsVisibility">
                              {{ ticketSpotsNumber(ticketSpots(evt, index, ticket)) }}
                            </span>
                          </el-col>
                          <el-col :sm="12" :lg="12" class="am-ticket-number-of-people">
                            <p>
                              {{ eventInfoLabels.event_book_persons.value || $root.labels.event_book_persons }}
                            </p>
                            <el-input-number
                              v-model="evt.bookingToEventTickets[index].persons"
                              size="mini"
                              type="number"
                              :style="{maxHeight: '32px', lineHeight: '32px', overflow: 'hidden'}"
                              :max="getMaxTicketSelected(evt, ticket, evt.bookingToEventTickets)"
                              :min="0"
                              :disabled="disableTicketSelection(evt, ticket, evt.bookingToEventTickets, evt.bookingToEventTickets[index].persons)"
                              @blur="() => {
                                if (!evt.bookingToEventTickets[index].persons) {
                                  evt.bookingToEventTickets[index].persons = 0
                                }
                              }"
                            >
                            </el-input-number>
                          </el-col>
                        </el-row>
                      </div>
                    </div>
                    <!-- /Custom Tickets -->
                  </el-form>
                </div>
              </div>
              <div class="am-event-book-continue" v-if="getEventAvailability(evt).class === 'open'">
                <el-button
                  type="primary"
                  :style="getBookableColor(evt, true)"
                  :disabled="(!evt.customPricing && evt.places <= 0) || (evt.customPricing && evt.customTickets.length > 0 && selectedTicketsCount(evt.bookingToEventTickets) === 0)"
                  @click="toggleEventBooking(evt)"
                >
                  {{$root.labels.continue}}
                </el-button>
              </div>
            </div>
          </transition>
          <!-- /Event Details -->

          <!-- Confirm Booking -->
          <transition name="fade">
            <div
              v-show="evt.showEventBooking"
              class="am-event-booking"
            >
              <confirm-booking
                v-if="evt.showEventBooking"
                :visible.sync="evt.showEventBooking"
                dialogClass="am-confirm-booking-events-list"
                v-bind="cacheData && (cacheData.status === 'canceled' || cacheData.status === 'failed') ? getCacheDataRequestProps() : {
                  bookableType: 'event',
                  containerId: getContainerId(),
                  taxes: options.entities.taxes,
                  bookable: getBookableData(evt),
                  marketing: marketing,
                  appointment: appointment,
                  event: evt,
                  customFields: options.entities.customFields,
                  phonePopulated: phonePopulated,
                  useGlobalCustomization: useGlobalCustomization(),
                  queryParams: getSearchParams()
                }"
                :form-type= "'eventListForm'"
                :forms-data="forms['eventListForm']"
                @confirmedBooking="confirmedBooking"
                @cancelBooking="evt.showEventBooking = false"
              >
              </confirm-booking>
            </div>
          </transition>
          <!-- /Confirm Booking -->

          <!-- Add To Calendar -->
          <transition name="fade">
            <div
              v-show="evt.showAddToCalendar"
              class="am-event-booking"
            >
              <add-to-calendar
                v-if="evt.showAddToCalendar"
                :form-type="'eventListForm'"
                :forms-data="forms['eventListForm']"
                :addToCalendarData="evt.addToCalendarData"
                @closeDialogAddToCalendar="evt.showAddToCalendar = false"
              >
              </add-to-calendar>
            </div>
          </transition>
          <!-- /Add To Calendar -->
        </div>
      </div>
      <!-- /Event List -->

      <div class="am-event-pagination">
        <el-pagination
          v-show="pagination.count > pagination.show && events.length > 0"
          :page-size="pagination.show"
          :total="pagination.count"
          layout="prev, pager, next"
          :current-page.sync=pagination.page
        >
        </el-pagination>
      </div>

      <div class="am-empty-state am-section" v-show="events.length === 0">
        <img :src="$root.getUrl + 'public/img/emptystate.svg'">
        <p>{{ $root.labels.no_results }}</p>
      </div>
    </div>

    <div v-if="$root.licence.isLite && $root.settings.general.backLink.enabled" class="am-lite-footer">
      <a
        rel="nofollow"
        class="am-lite-footer-link"
        :href="$root.settings.general.backLink.url"
        target="_blank"
      >
        {{ $root.settings.general.backLink.label }}
      </a>
    </div>
  </div>
</template>

<script>
  import moment from 'moment'
  import formsCustomizationMixin from '../../../js/common/mixins/formsCustomizationMixin'
  import imageMixin from '../../../js/common/mixins/imageMixin'
  import settingsMixin from '../../../js/common/mixins/settingsMixin'
  import dateMixin from '../../../js/common/mixins/dateMixin'
  import priceMixin from '../../../js/common/mixins/priceMixin'
  import ConfirmBooking from '../parts/ConfirmBooking.vue'
  import bookingMixin from '../../../js/frontend/mixins/bookingMixin'
  import cacheMixin from '../../../js/frontend/mixins/cacheMixin'
  import commonEventMixin from '../../../js/common/mixins/eventMixin'
  import helperMixin from '../../../js/backend/mixins/helperMixin'
  import AddToCalendar from '../parts/AddToCalendar.vue'
  import customFieldMixin from '../../../js/common/mixins/customFieldMixin'
  import translationMixin from '../../../js/common/mixins/translationMixin'
  import marketingMixin from '../../../js/frontend/mixins/marketingMixin'

  export default {
    name: 'eventListForm',

    mixins: [formsCustomizationMixin, cacheMixin, translationMixin, imageMixin, dateMixin, priceMixin, bookingMixin, commonEventMixin, helperMixin, customFieldMixin, settingsMixin],

    data () {
      return {
        marketing: {
          event: null,
          payment: null
        },
        tags: [],
        pagination: {
          show: this.$root.settings.general.itemsPerPage,
          page: 1,
          count: 0
        },
        params: {
          tag: null,
          locationId: null,
          date: 'ameliaBooking' in window && 'pastEventsDays' in window['ameliaBooking'] ? moment().subtract(window['ameliaBooking']['pastEventsDays'], 'days').toDate() : new Date(),
          page: 1
        },
        options: {
          entities: {
            taxes: [],
            tags: [],
            locations: []
          }
        },
        fetched: false,
        fetchedFiltered: false,
        events: [],
        event: null,
        payment: null,
        appointment: {
          bookings: [{
            customer: {
              email: '',
              externalId: null,
              firstName: '',
              id: null,
              lastName: '',
              phone: ''
            },
            customFields: {},
            customerId: 0,
            extras: [],
            persons: 1
          }],
          payment: {
            amount: 0,
            gateway: '',
            data: {}
          }
        },
        forms: {},
        eventInfoLabels: {},
        eventFilterLabels: {},
        eventSpotLabel: '',
        eventSpotsLabel: '',
        eventNoSpotsLabel: '',
        eventSpotsVisibility: true,
        showSingleEventDetails: true,
        timeZoneString: this.$root.settings.general.showClientTimeZone ? Intl.DateTimeFormat().resolvedOptions().timeZone : this.$root.settings.wordpress.timezone
      }
    },

    created () {
      this.forms = this.getTranslatedForms('eventListForm')

      this.eventInfoLabels = this.$root.settings.customization.forms ? this.forms.eventListForm.eventDetailsForm.itemsStatic.eventDetailsFormField.labels : this.defaultFormsData.eventListForm.eventDetailsForm.itemsStatic.eventDetailsFormField.labels
      this.showSingleEventDetails = (this.$root.settings.customization.forms && this.forms.eventListForm.eventDetailsForm.itemsStatic.eventDetailsFormField.hasOwnProperty('showSingleEvent')) ? this.forms.eventListForm.eventDetailsForm.itemsStatic.eventDetailsFormField.showSingleEvent : this.defaultFormsData.eventListForm.eventDetailsForm.itemsStatic.eventDetailsFormField.showSingleEvent
      this.eventFilterLabels = this.$root.settings.customization.forms ? this.forms.eventListForm.eventFilterForm.itemsStatic.eventFilterFormField.labels : this.defaultFormsData.eventListForm.eventFilterForm.itemsStatic.eventFilterFormField.labels

      this.eventSpotLabel = 'ev_spot' in this.eventInfoLabels ? this.eventInfoLabels.ev_spot.value || this.$root.labels.ev_spot : this.defaultFormsData.eventListForm.eventDetailsForm.itemsStatic.eventDetailsFormField.labels.ev_spot.value || this.$root.labels.ev_spot
      this.eventSpotsLabel = 'ev_spots' in this.eventInfoLabels ? this.eventInfoLabels.ev_spots.value || this.$root.labels.ev_spots : this.defaultFormsData.eventListForm.eventDetailsForm.itemsStatic.eventDetailsFormField.labels.ev_spots.value || this.$root.labels.ev_spots
      this.eventNoSpotsLabel = 'ev_no_spots' in this.eventInfoLabels ? this.eventInfoLabels.ev_no_spots.value || this.$root.labels.ev_no_spots : this.defaultFormsData.eventListForm.eventDetailsForm.itemsStatic.eventDetailsFormField.labels.ev_no_spots.value || this.$root.labels.ev_no_spots

      this.eventSpotsVisibility =
        this.$root.settings.customization.forms &&
        'parts' in this.forms.eventListForm.eventDetailsForm.itemsStatic.eventDetailsFormField
          ? this.forms.eventListForm.eventDetailsForm.itemsStatic.eventDetailsFormField.parts.ev_spots_number.visibility
          : this.defaultFormsData.eventListForm.eventFilterForm.itemsStatic.eventFilterFormField.parts.ev_spots_number.visibility

      this.setCacheData(this.getContainerId(), true)

      if (this.cacheData && this.cacheData.request.queryParams) {
        this.pagination.page = this.cacheData.request.queryParams.page

        this.params.page = this.cacheData.request.queryParams.page
        this.params.date = new Date(this.cacheData.request.queryParams.dates[0])

        if (this.cacheData.request.queryParams.tag) {
          this.params.tag = this.cacheData.request.queryParams.tag
        }

        if (this.cacheData.request.queryParams.locationId) {
          this.params.locationId = this.cacheData.request.queryParams.locationId
        }
      }
    },

    mounted () {
      this.getEntities(this.processListEntities)

      if (!this.$root.shortcodeData.hasEventShortcode) {
        this.inlineBookingSVG()
      }
      // expand event if its selected on shortcode and recurring is set to off
      let expandEvent = this.$root.shortcodeData.booking.eventId && this.$root.shortcodeData.booking.eventRecurring === 0

      this.getEvents(expandEvent)
    },

    methods: {
      runCacheAction () {
        if (this.loadingCacheBookingData) {
          if (this.cacheData.status === 'canceled' || this.cacheData.status === 'failed') {
            let event = this.events.find(event => event.id === this.cacheData.request.bookable.id)

            event.showEventBooking = true

            setTimeout(() => {
              this.cacheData = null
            }, 500)
          } else if (this.cacheData.status === 'paid' || this.cacheData.status === null) {
            this.confirmedBooking(this.cacheData.response, true, this.cacheData.request)
          }

          this.loadingCacheBookingData = false
        }
      },

      getContainerId () {
        return 'amelia-app-booking' + this.$root.shortcodeData.counter
      },

      useGlobalCustomization () {
        return 'ameliaBooking' in window && 'useGlobalCustomization' in window.ameliaBooking && window.ameliaBooking.useGlobalCustomization === true
      },

      getImages (gallery, index) {
        for (let i = 0; i < index; i++) {
          gallery.push(gallery.shift())
        }

        return gallery
      },

      setPlaces (value) {
        this.appointment.bookings[0].persons = value
      },

      getBookableColor (bookable, colorBackground) {
        return colorBackground ? {
          'color': '#ffffff',
          'background-color': bookable.color,
          'border-color': '#ffffff'
        } : {
          'color': bookable.color,
          'background-color': '',
          'border-color': ''
        }
      },

      getEventDatesAndTimes (periods) {
        let $this = this

        let resultPeriods = []

        this.getImplodedPeriods(periods).forEach(function (period) {
          let periodStart = period.periodStart.split(' ')
          let periodEnd = period.periodEnd.split(' ')

          if (period.isConnected) {
            resultPeriods.push($this.getFrontedFormattedDateTime(periodStart) + ' - ' + $this.getFrontedFormattedDateTime(periodEnd))
          } else {
            if (periodStart[0] === periodEnd[0]) {
              resultPeriods.push($this.getFrontedFormattedDate(periodStart[0]) + ' ' + $this.getFrontedFormattedTime(periodStart[1]) + ' - ' + $this.getFrontedFormattedTime(periodEnd[1]))
            } else {
              resultPeriods.push($this.getFrontedFormattedDate(periodStart[0]) + ' - ' + $this.getFrontedFormattedDate(periodEnd[0]) + ' ' + $this.getFrontedFormattedTime(periodStart[1]) + ' - ' + $this.getFrontedFormattedTime(periodEnd[1]))
            }
          }
        })

        return resultPeriods.join(', ')
      },

      showTags () {
        return this.options.entities.tags.length > 1 && this.showDatePicker()
      },

      showDatePicker () {
        return this.getPreselectedEventId() === null || (this.getPreselectedEventId() !== null && this.getPreselectedEventRecurring())
      },

      showLocations () {
        return this.options.entities.locations.length > 1 && this.showDatePicker()
      },

      getColumnLength () {
        if (this.showTags() && this.showLocations()) {
          return [12, 12, 24]
        }

        if (!this.showTags() && this.showLocations()) {
          return [0, 12, 12]
        }

        if (this.showTags() && !this.showLocations()) {
          return [12, 12, 0]
        }

        if (!this.showTags() && !this.showLocations()) {
          return [0, 24, 0]
        }

        return [12, 12, 24]
      },

      getEventAvailability (evt) {
        if (evt.status === 'approved' || evt.status === 'pending') {
          if (evt.full) {
            return {
              label: this.eventInfoLabels.full.value || this.$root.labels.full,
              class: 'full'
            }
          }
          if (evt.upcoming) {
            return {
              label: this.eventInfoLabels.upcoming.value || this.$root.labels.upcoming,
              class: 'upcoming'
            }
          }
          return !evt.bookable ? {
            label: this.eventInfoLabels.closed.value || this.$root.labels.closed,
            class: 'closed'
          } : {
            label: this.eventInfoLabels.open.value || this.$root.labels.open,
            class: 'open'
          }
        } else {
          return {
            label: this.eventInfoLabels.canceled.value || this.$root.labels.canceled,
            class: 'canceled'
          }
        }
      },

      isEventInSameDay (evt) {
        let result = true

        if (evt.periods.length === 1) {
          result = evt.periods[0].periodStart.split(' ')[0] === evt.periods[0].periodEnd.split(' ')[0]
        } else {
          let periodStart = evt.periods[0].periodStart.split(' ')[0]
          let periodEnd = evt.periods[0].periodEnd.split(' ')[0]

          evt.periods.forEach(function (period) {
            if (period.periodStart.split(' ')[0] !== periodStart || period.periodEnd.split(' ')[0] !== periodEnd) {
              result = false
            }
          })
        }

        return result
      },

      confirmedBooking (responseData, skipNotify, requestData) {
        let event = this.events.find(event => event.id === responseData.event.id)

        if (event.customTickets.length && event.customPricing) {
          event.bookingToEventTickets.forEach(ticket => {
            event.customTickets.filter(tick => tick.id === ticket.eventTicketId)[0].sold += ticket.persons
            ticket.persons = 0
          })

          event.places = (typeof requestData === 'undefined') ? event.maxCapacity - this.getAllSoldTickets(event) : event.places
        } else {
          event.places = (typeof requestData === 'undefined') ? event.places - responseData.booking.persons : event.places
        }

        if (event.places <= 0) event.full = true

        event.addToCalendarData = this.getEventAddToCalendarData(
          responseData,
          skipNotify
        )

        if ((typeof requestData !== 'undefined')) {
          event.showEventDetails = false
          event.addToCalendarData.forceScroll = true
        }

        if (marketingMixin.hasAmeliaTracking(this)) {
          this.marketing.event = responseData.event

          if (typeof requestData !== 'undefined' && requestData !== null) {
            this.marketing.payment = requestData.appointment.payment
          } else {
            this.marketing.payment = this.appointment.payment
          }

          if (this.appointment.payment.gateway === 'onSite') {
            marketingMixin.trackAmeliaData(this, this.$root.marketing, 'event', 'Schedule')
          } else {
            marketingMixin.trackAmeliaData(this, this.$root.marketing, 'event', 'Purchase')
          }
        }

        // Customization hook
        if ('beforeConfirmedBooking' in window) {
          window.beforeConfirmedBooking(event.addToCalendarData)
        } else {
          event.showEventBooking = false
          event.showAddToCalendar = true
          event.bookingCompleted = true
        }
      },

      getSearchParams () {
        let params = JSON.parse(JSON.stringify(this.params))

        let eventId = this.getPreselectedEventId()

        let recurring = this.getPreselectedEventRecurring()

        let tagName = this.getPreselectedTag() ? this.getPreselectedTag() : params.tag

        let employee = this.getPreselectedEmployee()

        if (!tagName) {
          tagName = null
        }

        return {
          dates: params.date ? [
            this.getDateString(params.date)
          ] : [
            this.getDateString(this.getNowDate())
          ],
          tag: tagName,
          locationId: params.locationId,
          page: this.pagination.page,
          id: eventId,
          recurring: recurring,
          providers: employee ? [employee] : null
        }
      },

      getBookableData (evt) {
        let ticketsData = null
        if (evt.customTickets.length && evt.customPricing) {
          let totalPrice = 0
          let totalTickets = 0

          evt.customTickets.forEach(ticket => {
            let ticketPrice = evt.bookingToEventTickets.filter(tick => tick.eventTicketId === ticket.id)[0].price

            let ticketQuant = evt.bookingToEventTickets.filter(tick => tick.eventTicketId === ticket.id)[0].persons

            evt.bookingToEventTickets.filter(tick => tick.eventTicketId === ticket.id)[0].name = ticket.name

            totalTickets += ticketQuant
            totalPrice += (evt.aggregatedPrice || ticketQuant === 0 ? ticketQuant : 1) * ticketPrice
          })

          evt.price = totalPrice

          ticketsData = {
            totalTickets,
            totalPrice,
            bookingToEventTickets: evt.bookingToEventTickets
          }
        }

        return {
          id: evt.id,
          name: evt.name,
          price: evt.price,
          depositData: evt.depositPayment !== 'disabled' ? {
            deposit: evt.deposit,
            depositPayment: evt.depositPayment,
            depositPerPerson: evt.depositPerPerson,
            depositFullPayment: evt.fullPayment
          } : null,
          maxCapacity: evt.maxCapacity,
          color: evt.color,
          aggregatedPrice: evt.aggregatedPrice,
          bookingStart: evt.periods[0].periodStart,
          bookingStartTime: evt.periods[0].periodStart.split(' ')[1],
          ticketsData
        }
      },

      getEvents (expandEvent) {
        this.$http.get(`${this.$root.getAjaxUrl}/events`, {
          params: this.getAppropriateUrlParams(this.getSearchParams())
        })
          .then(response => {
            let $this = this

            this.events = []

            this.pagination.count = response.data.data.count

            response.data.data.events.forEach(function (event) {
              event.gallery = event.gallery.sort((a, b) => (a.position > b.position) ? 1 : -1)

              event.showEventDetails = (expandEvent || response.data.data.events.length === 1) && $this.showSingleEventDetails
              event.showEventBooking = false
              event.showAddToCalendar = false
              event.bookingCompleted = false

              if ($this.$root.useTranslations) {
                event.name = $this.getNameTranslated(event)
                event.description = $this.getDescriptionTranslated(event)

                event.customTickets.forEach((ticket) => {
                  ticket.name = $this.getTicketTranslated(ticket)
                })
              }

              if (event.customTickets.length && event.customPricing) {
                event.bookingToEventTickets = $this.setTicketsData(event)
              }

              $this.events.push(event)

              if ($this.$root.settings.general.showClientTimeZone) {
                event.periods.forEach(function (period) {
                  let utcOffsetStart = moment(period.periodStart, 'YYYY-MM-DD HH:mm:ss').toDate().getTimezoneOffset()
                  let utcOffsetEnd = moment(period.periodEnd, 'YYYY-MM-DD HH:mm:ss').toDate().getTimezoneOffset()

                  if (utcOffsetStart > 0) {
                    period.periodStart = moment.utc(period.periodStart, 'YYYY-MM-DD HH:mm:ss').subtract(utcOffsetStart, 'minutes').format('YYYY-MM-DD HH:mm:ss')
                  } else {
                    period.periodStart = moment.utc(period.periodStart, 'YYYY-MM-DD HH:mm:ss').add(-1 * utcOffsetStart, 'minutes').format('YYYY-MM-DD HH:mm:ss')
                  }

                  if (utcOffsetEnd > 0) {
                    period.periodEnd = moment.utc(period.periodEnd, 'YYYY-MM-DD HH:mm:ss').subtract(utcOffsetEnd, 'minutes').format('YYYY-MM-DD HH:mm:ss')
                  } else {
                    period.periodEnd = moment.utc(period.periodEnd, 'YYYY-MM-DD HH:mm:ss').add(-1 * utcOffsetEnd, 'minutes').format('YYYY-MM-DD HH:mm:ss')
                  }
                })
              }
            })

            this.runCacheAction()

            if ('ameliaEventsLoaded' in window) {
              window.ameliaEventsLoaded($this.events)
            }

            this.fetched = true
            this.fetchedFiltered = true
          })
          .catch(e => {
            console.log(e.message)
          })
      },

      toggleEventDetails (evt) {
        evt.showEventDetails = !evt.showEventDetails
        this.events.forEach(function (event) {
          if (event.id !== evt.id) {
            event.showEventDetails = false
            event.showEventBooking = false
            event.showAddToCalendar = false
            event.showConfirmBooking = false
          }
        })
        evt.showEventBooking = false

        this.appointment.bookings[0].persons = 1

        this.updateSettings(evt.settings)

        setTimeout(() => {
          this.scrollView('am-event-' + evt.id, 'start')
        }, 300)

        if ('ameliaEventSelected' in window) {
          window.ameliaEventSelected(evt)
        }

        if (marketingMixin.hasAmeliaTracking(this.$root.marketing, evt)) {
          this.marketing.event = evt

          marketingMixin.trackAmeliaData(this, this.$root.marketing, 'event', 'SelectEvent')
        }
      },

      toggleEventBooking (evt) {
        evt.showEventDetails = !evt.showEventDetails
        evt.showEventBooking = !evt.showEventBooking

        this.appointment.payment = {
          amount: 0,
          gateway: '',
          data: {}
        }

        setTimeout(() => {
          let element = document.getElementById(`am-event-${evt.id}`)

          if (typeof element !== 'undefined' && element !== null) {
            element.scrollIntoView({behavior: 'smooth', block: 'start', inline: 'start'})
          }
        }, 300)

        this.updateSettings(evt.settings)
      },

      getLocation (evt) {
        if (evt.locationId && this.options.entities.locations.length) {
          let location = this.options.entities.locations.find(location => location.id === evt.locationId)

          return typeof location !== 'undefined' ? location.name : ''
        } else if (evt.customLocation) {
          return evt.customLocation
        }
      },

      inlineBookingSVG () {
        let inlineSVG = require('inline-svg')
        inlineSVG.init({
          svgSelector: 'img.svg-booking',
          initClass: 'js-inlinesvg'
        })
      },

      ticketSpots (evt, index, ticket) {
        return ticket.spots - ticket.sold - evt.bookingToEventTickets[index].persons
      },

      ticketSpotsNumber (spots) {
        if (spots <= 0) {
          spots = ''
        }

        return `${spots} ${this.spotsLabels(spots)}`
      },

      spotsLabels (number) {
        if (number > 1) {
          return this.eventSpotsLabel
        }

        if (number === 1) {
          return this.eventSpotLabel
        }

        return this.eventNoSpotsLabel
      }
    },

    computed: {
      selectedDateInput () {
        return this.$moment(this.params.date).format(this.momentDateFormat)
      }
    },

    watch: {
      'pagination.page' () {
        if (this.cacheData && this.cacheData.request.queryParams) {
          this.cacheData.request.queryParams = null
        } else {
          this.getEvents(false)
        }
      }
    },

    components: {
      ConfirmBooking,
      AddToCalendar
    }
  }
</script>
