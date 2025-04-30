<template>
  <div class="am-dialog-event-inner">

    <!-- Dialog Loader -->
    <div class="am-dialog-loader" v-show="dialogLoading">
      <div class="am-dialog-loader-content">
        <img :src="$root.getUrl + 'public/img/spinner.svg'" class=""/>
        <p>{{$root.labels.loader_message}}</p>
      </div>
    </div>

    <!-- Dialog Content -->
    <div class="am-dialog-scrollable" :class="{'am-edit': event.id !== 0}" v-if="event && !dialogLoading">

      <!-- Dialog Header -->
      <div v-if="showHeader" class="am-dialog-header">
        <el-row>
          <el-col :span="18">
            <h2 v-if="event && event.id !== 0">{{$root.labels.edit_event}}</h2>
            <h2 v-else>{{$root.labels.new_event}}</h2>
          </el-col>
          <el-col :span="6" class="align-right">
            <el-button @click="closeDialog" class="am-dialog-close" size="small" icon="el-icon-close">
            </el-button>
          </el-col>
        </el-row>
      </div>


      <el-form v-if="mounted" :model="event" ref="event" label-position="top">
        <el-tabs v-model="defaultEventTab">

          <!-- Event Details -->
          <el-tab-pane :label="$root.labels.event_details" name="details">

            <!-- Event Name -->
            <el-form-item prop="name" :rules="rules.name" @input="clearValidation()">
              {{ $root.labels.event_name }}
              <div class="am-event-translate" @click="showDialogTranslate('name')" v-if="!isCabinet">
                <img class="am-dialog-translate-svg" width="16px" :src="$root.getUrl+'public/img/translate.svg'">
                {{ $root.labels.translate }}
              </div>
              <el-input v-model="event.name" :placeholder="$root.labels.enter_event_name" style="margin-top: 5px !important" @change="trimProperty(event, 'name')">
              </el-input>
            </el-form-item>

            <!-- Event Dates -->
            <div class="am-event-dates am-section-grey">
              <!-- Event Start -->
              <div
                v-for="(period, index) in event.periods"
                :key="index"
                class="am-event-date"
              >
                <!-- Date -->
                <el-row :gutter="10">
                  <el-col :sm="6">
                    <p>{{$root.labels.event_period_dates}}</p>
                  </el-col>
                  <el-col :sm="16" class="v-calendar-column">
                    <el-form-item :prop="'periods.' + index + '.range'" :rules="rules.range">
                      <v-date-picker
                        v-model="period.range"
                        mode='range'
                        style="margin-bottom: 16px;"
                        input-class="el-input__inner"
                        popover-visibility="focus"
                        popover-direction="bottom"
                        :popover-align="screenWidth < 768 ? 'center' : 'right'"
                        :show-day-popover=false
                        :attributes="[{
                          dates: {
                            start: getNowDate()
                          },
                          eventDateIndex: index
                        }]"
                        :is-expanded=false
                        :is-required=false
                        :is-read-only=true
                        :is-double-paned="false"
                        :tint-color='isCabinet ? $root.settings.customization.primaryColor : "#1A84EE"'
                        :input-props='{class: "el-input__inner", readOnly: "readonly"}'
                        :formats="vCalendarFormats"
                        :available-dates="{start: getNowDate()}"
                        @input="setDisabledTicketRangeDates(null, false)"
                      >
                      </v-date-picker>
                    </el-form-item>

                  </el-col>
                </el-row>

                <!-- Time -->
                <el-row :gutter="10">
                  <el-col :sm="6">
                    <p>{{$root.labels.event_period_time}}</p>
                  </el-col>
                  <el-col :sm="8" class="am-event-period-start">
                    <el-form-item :prop="'periods.' + index + '.startTime'" :rules="rules.startTime">
                      <el-time-select
                        v-model="period.startTime"
                        :picker-options="getTimeSelectOptionsWithLimits(null, period.endTime)"
                        :popper-class="'am-dropdown-cabinet'"
                        size="large"
                      >
                      </el-time-select>
                    </el-form-item>
                  </el-col>
                  <el-col :sm="8">
                    <el-form-item :prop="'periods.' + index + '.endTime'" :rules="rules.endTime">
                      <el-time-select
                        v-model="period.endTime"
                        :picker-options="getTimeSelectOptionsWithLimits(period.startTime, null)"
                        :popper-class="'am-dropdown-cabinet'"
                        size="large"
                      >
                      </el-time-select>
                    </el-form-item>
                  </el-col>
                </el-row>

                <!-- Zoom -->
                <el-row v-if="$root.settings.zoom.enabled && period.zoomMeeting && !$root.licence.isLite && !$root.licence.isStarter" :gutter="10">
                  <el-col v-if="$root.settings.role !== 'customer'" :sm="12">
                    <p>{{ $root.labels.zoom_start_link }}</p>
                  </el-col>
                  <el-col v-if="$root.settings.role !== 'customer'" :sm="12">
                    <p><a class="am-link" :href="period.zoomMeeting.startUrl">{{ $root.labels.zoom_click_to_start }}</a>
                    </p>
                  </el-col>
                  <el-col :sm="12">
                    <p>{{ $root.labels.zoom_join_link }}</p>
                  </el-col>
                  <el-col :sm="12">
                    <p><a class="am-link" :href="period.zoomMeeting.joinUrl">{{ $root.labels.zoom_click_to_join }}</a></p>
                  </el-col>
                </el-row>

                <!-- Google Meet -->
                <el-row v-if="$root.settings.googleCalendar.googleMeetEnabled && period.googleMeetUrl && !$root.licence.isLite && !$root.licence.isStarter" :gutter="10">
                  <el-col :sm="12">
                    <p>{{ $root.labels.google_meet_link }}</p>
                  </el-col>
                  <el-col :sm="12">
                    <p><a class="am-link" :href="period.googleMeetUrl">{{ $root.labels.google_meet_join }}</a></p>
                  </el-col>
                </el-row>

                <!-- Microsoft Teams -->
                <el-row v-if="$root.settings.outlookCalendar.microsoftTeamsEnabled && period.microsoftTeamsUrl && !$root.licence.isLite && !$root.licence.isStarter" :gutter="10">
                  <el-col :sm="12">
                    <p>{{ $root.labels.microsoft_teams_link }}</p>
                  </el-col>
                  <el-col :sm="12">
                    <p><a class="am-link" :href="period.microsoftTeamsUrl">{{ $root.labels.microsoft_teams_join }}</a></p>
                  </el-col>
                </el-row>

                <!-- Lesson Space -->
                <el-row v-if="$root.settings.lessonSpace.enabled && period.lessonSpace" :gutter="10">
                  <el-col :sm="12">
                    <p>{{ $root.labels.lesson_space_link }}</p>
                  </el-col>
                  <el-col :sm="12">
                    <p><a class="am-link" :href="period.lessonSpace">{{ $root.labels.lesson_space_join }}</a>
                    </p>
                  </el-col>
                </el-row>

                <!-- Delete Event Date -->
                <div
                  v-show="event.periods.length > 1 && period.bookings.length === 0"
                  class="am-delete-element disabled"
                  @click="deleteEventDate(index)"
                >
                  <i class="el-icon-minus"></i>
                </div>

              </div>

              <div class="am-add-event-date">
                <el-button size="small" type="primary" @click="addEventDate()">{{$root.labels.add_date}}</el-button>
              </div>
            </div>

            <!-- Recurring -->
            <div class="am-section-grey" v-if="isCabinet ? !notInLicence() : true" :class="licenceClass()">
              <el-checkbox
                v-model="event.isRecurring"
                :disabled="notInLicence()"
                @change="changeRecurringCycle"
              >
                {{$root.labels.event_recurring_enabled}}
              </el-checkbox>

              <div class="am-recurring-event" v-if="event.isRecurring">
                <el-row :gutter="10">
                  <el-col :lg="10" :md="10" :sm="24">
                    <p>{{$root.labels.event_recurring_period}}</p>
                  </el-col>
                  <el-col :lg="14" :md="14" :sm="24">
                    <el-form-item prop="recurringCycle" :rules="rules.recurringCycle">
                      <el-select
                        v-model="event.recurring.cycle"
                        clearable
                        filterable
                        :placeholder="$root.labels.select_repeat_period"
                        :popper-class="'am-dropdown-cabinet'"
                        :disabled="!(event.id === 0 || (event.id !== 0 && originRecurring.cycle === null))"
                      >
                        <el-option
                          v-for="period in recurringPeriods"
                          :key="period.value"
                          :label="period.label"
                          :value="period.value"
                        >
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-row :gutter="10">
                  <el-col :lg="10" :md="10" :sm="24">
                    <p>{{$root.labels.recurring_every}}</p>
                  </el-col>
                  <el-col :lg="14" :md="14" :sm="24">
                    <el-form-item prop="recurringInterval" :rules="rules.recurringInterval">
                      <div class="am-recurring-event-interval">
                        <el-input-number
                            v-model="event.recurring.cycleInterval"
                            :min="1"
                            style="width: 150px"
                            :disabled="event.id !== 0 && originRecurring.cycle !== null"
                        />
                        <span style="margin-left: 16px">{{ getCycleLabels() }}</span>
                      </div>
                    </el-form-item>
                  </el-col>
                </el-row>


                <el-row :gutter="10" v-if="(event.id === 0 && event.recurring.cycle === 'monthly') || (event.id !== 0 && originRecurring.monthlyRepeat === 'each' && originRecurring.cycle === 'monthly')">
                  <el-col :lg="10" :md="10" :sm="24" class="text-center">
                    <el-radio v-model="monthlyRepeat" label="each" v-if="event.id === 0 || (event.id !== 0 && originRecurring.cycle === null)">
                      {{ $root.labels.recurring_each }}
                    </el-radio>
                    <p v-else>
                      {{ $root.labels.recurring_each }}
                    </p>
                  </el-col>
                  <el-col :lg="14" :md="14" :sm="24" class="v-calendar-column">
                    <el-form-item>
                      <v-date-picker
                        v-if="monthlyRepeat === 'each' && (event.id === 0 || (event.id !== 0 && originRecurring.cycle === null))"
                        v-model="monthDateComp"
                        mode='single'
                        input-class="el-input__inner"
                        popover-visibility="focus"
                        :popover-direction="screenWidth < 768 ? 'bottom' : 'top'"
                        :popover-align="screenWidth < 768 ? 'center' : 'center'"
                        :tint-color='isCabinet ? $root.settings.customization.primaryColor : "#1A84EE"'
                        :is-expanded=false
                        :is-required=false
                        :is-double-paned="false"
                        :show-day-popover=false
                        :input-props='{class: "el-input__inner", readOnly: "readonly"}'
                        :formats="vCalendarFormats"
                        :min-date="calculateMinDate()"
                        :max-date="calculateMaxDate()"
                      >
                      </v-date-picker>
                      <el-input
                        v-else
                        :disabled="true"
                        :value="event.recurring && event.recurring.monthDate ? getFrontedFormattedDate(getDatabaseFormattedDate(event.recurring.monthDate)) : ''"
                      />
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-row :gutter="10" v-if="(event.id === 0 && event.recurring.cycle === 'monthly') || (event.id !== 0 && originRecurring.monthlyRepeat === 'on' && originRecurring.cycle === 'monthly')">
                  <el-col :lg="10" :md="10" :sm="24">
                    <el-radio v-model="monthlyRepeat" label="on" v-if="event.id === 0 || (event.id !== 0 && originRecurring.cycle === null)">
                      {{ $root.labels.recurring_on }}
                    </el-radio>
                    <p v-else>{{ $root.labels.recurring_on }}</p>
                  </el-col>
                  <el-col :lg="14" :md="14" :sm="24" class="text-center">
                    <el-row :gutter="10">
                      <el-col :lg="12" :md="12" :sm="24">
                        <el-form-item>
                          <el-select
                            v-model="monthlyOnRepeat"
                            clearable
                            filterable
                            :placeholder="monthlyWeekDayRepeat[0].label"
                            :popper-class="'am-dropdown-cabinet'"
                            :disabled="monthlyRepeat === 'each' || !(event.id === 0 || (event.id !== 0 && originRecurring.cycle === null))"
                          >
                            <el-option
                              v-for="weekDayRepeat in monthlyWeekDayRepeat"
                              :key="weekDayRepeat.value"
                              :label="weekDayRepeat.label"
                              :value="weekDayRepeat.value"
                            >
                            </el-option>
                          </el-select>
                        </el-form-item>
                      </el-col>
                      <el-col :lg="12" :md="12" :sm="24">
                        <el-form-item>
                          <el-select
                            v-model="monthlyOnDay"
                            clearable
                            filterable
                            :placeholder="weekDays[0].label"
                            :popper-class="'am-dropdown-cabinet'"
                            :disabled="monthlyRepeat === 'each' || !(event.id === 0 || (event.id !== 0 && originRecurring.cycle === null))"
                          >
                            <el-option
                              v-for="weekDay in weekDays"
                              :key="weekDay.value"
                              :label="weekDay.label"
                              :value="weekDay.value"
                            >
                            </el-option>
                          </el-select>
                        </el-form-item>
                      </el-col>
                    </el-row>
                  </el-col>
                </el-row>

                <el-row :gutter="10">
                  <el-col :lg="10" :md="10" :sm="24">
                    <p>{{$root.labels.event_recurring_until}}</p>
                  </el-col>
                  <el-col :lg="14" :md="14" :sm="24" class="v-calendar-column">
                    <el-form-item prop="recurringUntilDate" :rules="rules.recurringUntilDate">
                      <v-date-picker
                        v-model="event.recurring.until"
                        mode='single'
                        input-class="el-input__inner"
                        popover-visibility="focus"
                        :is-expanded=false
                        :is-required=false
                        :is-double-paned=false
                        :show-day-popover=false
                        :popover-direction="screenWidth < 768 ? 'bottom' : 'top'"
                        :popover-align="screenWidth < 768 ? 'center' : 'center'"
                        :tint-color='isCabinet ? $root.settings.customization.primaryColor : "#1A84EE"'
                        :input-props='{class: "el-input__inner", readOnly: "readonly"}'
                        :formats="vCalendarFormats"
                        :available-dates="{start: event.id === 0 ? getNowDate() : originRecurring.until}"
                        @dayclick="changeBookingEndsDate"
                      >
                      </v-date-picker>
                    </el-form-item>
                  </el-col>
                </el-row>
              </div>

              <LicenceBlock/>
            </div>

            <!-- Booking Dates -->
            <div class="am-section-grey">
              <el-checkbox v-model="event.bookingStartsNow">{{$root.labels.event_booking_opens_now}}</el-checkbox>

              <div class="am-booking-starts" v-show="!event.bookingStartsNow">
                <el-row :gutter="10">

                  <el-col :sm="24">
                    <label class="el-form-item__label">{{$root.labels.event_booking_opens_on}}</label>
                  </el-col>

                  <el-col :sm="15" class="v-calendar-column">
                    <el-form-item prop="bookingStartsDate" :rules="rules.bookingStartsDate">
                      <v-date-picker
                        v-model="event.bookingStartsDate"
                        :is-double-paned="false"
                        mode='single'
                        input-class="el-input__inner"
                        popover-visibility="focus"
                        popover-direction="bottom"
                        :popover-align="screenWidth < 768 ? 'center' : 'left'"
                        :is-expanded=false
                        :is-required=false
                        :show-day-popover=false
                        :tint-color='isCabinet ? $root.settings.customization.primaryColor : "#1A84EE"'
                        :input-props='{class: "el-input__inner", readOnly: "readonly"}'
                        :formats="vCalendarFormats"
                        :available-dates="{start: getNowDate()}"
                        @dayclick="changeBookingStartsDate"
                      >
                      </v-date-picker>
                    </el-form-item>

                  </el-col>
                  <el-col :sm="9">
                    <el-form-item prop="bookingStartsTime" :rules="rules.bookingStartsTime">
                      <el-time-select
                        v-model="event.bookingStartsTime"
                        size="large"
                        :popper-class="'am-dropdown-cabinet'"
                        :picker-options="getTimeSelectOptionsWithLimits(null, null)"
                      >
                      </el-time-select>
                    </el-form-item>
                  </el-col>
                </el-row>
              </div>
              <div v-if="event.isRecurring">
                <el-checkbox
                  v-model="event.bookingOpensRec"
                  true-label="same"
                  false-label="calculate"
                >
                  {{$root.labels.apply_to_all}}
                </el-checkbox>
                <el-tooltip placement="top">
                  <div slot="content" v-html="$root.labels.event_booking_opens_apply"></div>
                  <i class="el-icon-question am-tooltip-icon"></i>
                </el-tooltip>
              </div>
            </div>

            <div class="am-section-grey">
              <el-checkbox v-model="event.bookingEndsAfter">{{$root.labels.event_booking_closes_after}}</el-checkbox>

              <div class="am-booking-ends" v-show="!event.bookingEndsAfter">
                <el-row :gutter="10">

                  <el-col :sm="24">
                    <label class="el-form-item__label">{{$root.labels.event_booking_closes_on}}</label>
                  </el-col>

                  <el-col :sm="15" class="v-calendar-column">
                    <el-form-item prop="bookingEndsDate" :rules="rules.bookingEndsDate">
                      <v-date-picker
                        v-model="event.bookingEndsDate"
                        mode='single'
                        input-class="el-input__inner"
                        popover-visibility="focus"
                        popover-direction="bottom"
                        :popover-align="screenWidth < 768 ? 'center' : 'left'"
                        :is-double-paned="false"
                        :is-required=false
                        :is-expanded=false
                        :show-day-popover=false
                        :tint-color='isCabinet ? $root.settings.customization.primaryColor : "#1A84EE"'
                        :input-props='{class: "el-input__inner", readOnly: "readonly"}'
                        :formats="vCalendarFormats"
                        :available-dates="{start: getNowDate()}"
                        @dayclick="changeBookingEndsDate"
                      >
                      </v-date-picker>
                    </el-form-item>
                  </el-col>

                  <el-col :sm="9">
                    <el-form-item prop="bookingEndsTime" :rules="rules.bookingEndsTime">
                      <el-time-select
                        v-model="event.bookingEndsTime"
                        :popper-class="'am-dropdown-cabinet'"
                        :picker-options="getTimeSelectOptionsWithLimits(null, null)"
                        size="large"
                      >
                      </el-time-select>
                    </el-form-item>
                  </el-col>
                </el-row>
              </div>
              <div v-if="event.isRecurring">
                <el-checkbox
                  v-model="event.bookingClosesRec"
                  true-label="same"
                  false-label="calculate"
                >
                  {{$root.labels.apply_to_all}}
                </el-checkbox>
                <el-tooltip placement="top">
                  <div slot="content" v-html="$root.labels.event_booking_closes_apply"></div>
                  <i class="el-icon-question am-tooltip-icon"></i>
                </el-tooltip>
              </div>
            </div>

            <!-- Address -->
            <div class="am-border-bottom">

              <el-row v-if="locations.length" :gutter="10">
                <el-col :lg="12" :md="12" :sm="24">
                  <p>{{$root.labels.event_select_address}}</p>
                </el-col>
                <el-col :lg="12" :md="12" :sm="24">
                  <el-select
                    v-model="event.locationId"
                    :placeholder="$root.labels.select"
                    :popper-class="'am-dropdown-cabinet'"
                    :clearable="true"
                    :filterable="true"
                    :value="null"
                  >
                    <el-option
                      :key="null"
                      :label="this.$root.labels.event_custom_address"
                      :value="null"
                    >
                    </el-option>
                    <el-option
                      v-for="location in locations"
                      :key="location.id"
                      :label="location.name"
                      :value="location.id"
                    >
                    </el-option>
                  </el-select>
                </el-col>
              </el-row>
              <el-row :gutter="10" v-show="!event.locationId">
                <el-col :lg="12" :md="12" :sm="24">
                  <p>{{$root.labels.event_custom_address}}</p>
                </el-col>
                <el-col :lg="12" :md="12" :sm="24">
                  <el-input v-model="event.customLocation" :placeholder="$root.labels.enter_address">
                  </el-input>
                </el-col>
              </el-row>

            </div>

            <!-- Employee & Tags -->
            <div class="am-border-bottom">

              <el-row :gutter="10" v-if="$root.settings.zoom.enabled && !$root.licence.isLite && !$root.licence.isStarter">
                <el-col :lg="12" :md="12" :sm="24">
                  <p>{{ $root.labels.zoom_user }}</p>
                </el-col>
                <el-col :lg="12" :md="12" :sm="24">
                  <!-- Zoom Users List -->
                  <el-select
                    v-model="event.zoomUserId"
                    clearable
                    filterable
                    :placeholder="$root.labels.zoom_user_placeholder"
                    :popper-class="'am-dropdown-cabinet'"
                    @change="clearValidation()"
                  >
                    <el-option
                      v-for="(zoomUser, index) in zoomUsers"
                      :key="index"
                      :label="zoomUser.first_name + ' ' + zoomUser.last_name + ' (' + zoomUser.email + ')'"
                      :value="zoomUser.id"
                    >
                    </el-option>
                  </el-select>
                </el-col>
              </el-row>

              <!-- Organizer for google/outlook event -->
              <el-row :gutter="10" v-if="canManage() && !$root.licence.isLite && !$root.licence.isStarter">
                <el-col :lg="12" :md="12" :sm="24">
                  <span style="line-height: 40px">
                      {{ $root.labels.event_organizer }}
                  </span>
                  <el-tooltip placement="top">
                    <div slot="content" v-html="$root.labels.event_organizer_tooltip"></div>
                    <i class="el-icon-question am-tooltip-icon"></i>
                  </el-tooltip>
                </el-col>
                <el-col :lg="12" :md="12" :sm="24">
                  <el-select
                      v-model="event.organizerId"
                      value-key="id"
                      clearable
                      :placeholder="$root.labels.select"
                      :popper-class="'am-dropdown-cabinet'"
                  >
                    <el-option
                        v-for="emp in employees"
                        :key="emp.id"
                        :label="emp.firstName + ' ' + emp.lastName"
                        :value="emp.id"
                    >
                    </el-option>
                  </el-select>
                </el-col>
              </el-row>

              <!-- Organizer for google/outlook event -->
              <el-row :gutter="10" v-if="currentUser && currentUser.type === 'provider' && !$root.licence.isLite && !$root.licence.isStarter">
                <el-col :lg="12" :md="12" :sm="24">
                  <span style="line-height: 40px">
                    {{ $root.labels.event_organizer }}
                  </span>
                  <el-tooltip placement="top">
                    <div slot="content" v-html="$root.labels.event_organizer_tooltip"></div>
                    <i class="el-icon-question am-tooltip-icon"></i>
                  </el-tooltip>
                </el-col>
                <el-col :lg="12" :md="12" :sm="24">
                  <el-checkbox
                      @change="assignOrganizer($event)"
                      :value="event.organizerId === currentUser.id"
                      :disabled="event.id !== 0 && event.organizerId && event.organizerId !== currentUser.id"
                      style="line-height: 40px"
                  >
                  </el-checkbox>
                </el-col>
              </el-row>

              <el-row :gutter="10" v-if="canManage()">
                <el-col :lg="12" :md="12" :sm="24">
                  <p>{{$root.labels.event_staff}}</p>
                </el-col>
                <el-col :lg="12" :md="12" :sm="24">
                  <el-select
                    v-model="event.providers"
                    multiple
                    value-key="id"
                    :placeholder="$root.labels.select"
                    :popper-class="'am-dropdown-cabinet'"
                  >
                    <el-option
                      v-for="emp in employees"
                      :key="emp.id"
                      :label="emp.firstName + ' ' + emp.lastName"
                      :value="emp"
                    >
                    </el-option>
                  </el-select>
                </el-col>
              </el-row>

              <div
                v-if="isCabinet ? !notInLicence('starter') : true"
                :class="licenceClass('starter')"
                :style="{
                  'marginLeft': !notInLicence('starter') ? '0px;' : '',
                  'marginRight': !notInLicence('starter') ? '0px;' : ''
                }"
              >
              <el-row :gutter="10">
                <el-col :lg="12" :md="12" :sm="24">
                  <p>{{$root.labels.event_tags}}</p>
                </el-col>
                <el-col :lg="12" :md="12" :sm="24">
                  <el-select
                    v-model="event.tags"
                    :disabled="notInLicence('starter')"
                    multiple
                    filterable
                    allow-create
                    default-first-option
                    :placeholder="$root.labels.event_tags_select_or_create"
                    :popper-class="'am-dropdown-cabinet'"
                    :no-data-text="$root.labels.event_tags_create"
                    collapse-tags
                    @change="tagsChanged"
                  >
                    <el-option
                      v-for="(tag, index) in tags"
                      v-if="tag"
                      :key="index"
                      :label="tag"
                      :value="tag"
                    >
                    </el-option>
                  </el-select>
                </el-col>
              </el-row>
              <LicenceBlock :licence="'starter'"/>
              </div>
            </div>


            <!-- Notify Participants -->
            <el-form-item v-if="this.$root.settings.role !== 'customer' && event.id !== 0" style="margin-top: 20px">
              <el-checkbox
                v-model="event.notifyParticipants"
                @change="clearValidation()"
              >
                {{ $root.labels.notify_attendees }}
                <el-tooltip placement="top">
                  <div slot="content" v-html="$root.labels.notify_attendees_tooltip"></div>
                  <i class="el-icon-question am-tooltip-icon"></i>
                </el-tooltip>
              </el-checkbox>
            </el-form-item>

            <!-- Description -->
            <content-block
              style="margin-top: 20px;"
              :label="$root.labels.description"
              :entity="event"
              textProperty="description"
              htmlProperty="descriptionHtml"
              :hasTranslation="!isCabinet"
              :hasQuill="true"
              :textModeProp="true"
              :allowImage="false"
              @showDialogTranslate="showDialogTranslate('description')"
            >
            </content-block>

          </el-tab-pane>


          <!-- Pricing -->
          <el-tab-pane :label="$root.labels.pricing" name="pricing">

            <!-- Custom Pricing Warning -->
            <el-row :style="{wordBreak: 'break-word'}" v-if="(event.id !== 0 && event.bookings.length && !$root.licence.isLite)">
              <div class="am-setting">
                <el-alert
                  type="warning"
                  show-icon
                  title=""
                  :description="$root.labels.custom_pricing_adjustment"
                  :closable="false"
                />
              </div>
            </el-row>

            <!-- Slots & Price -->
            <div class="am-pricing">
              <el-row :gutter="10" :style="{padding: 0}">
                <el-col :span="12">
                  <el-form-item>
                    <label :slot="'label'">
                      {{ $root.labels.price }}:
                    </label>
                    <div class="el-input" :class="{'is-disabled': customPricingEnabled}" :style="{marginBottom: '0px'}">
                      <money
                        v-if="!customPricingEnabled"
                        v-model="event.price"
                        v-bind="moneyComponentData"
                        @input="priceChanged"
                        class="el-input el-input__inner"
                      >
                      </money>
                      <money
                          v-else
                          v-model="customPrice"
                          v-bind="moneyComponentData"
                          @input="priceChanged"
                          class="el-input el-input__inner"
                      >
                      </money>
                    </div>
                  </el-form-item>
                </el-col>

                <el-col :span="12">
                  <el-form-item>
                    <label :slot="'label'">
                      {{$root.labels.event_max_capacity}}:
                    </label>
                    <el-input-number
                      v-model="event.maxCapacity"
                      :min="1"
                      :disabled="customPricingEnabled"
                    >
                    </el-input-number>
                  </el-form-item>
                </el-col>
              </el-row>

              <div v-if="event.maxCapacity > 1 || getTicketsSpots() > 1 || maxCustomCapacityNum > 1">
                <el-row :gutter="10">
                  <el-col :lg="24" :md="24" :sm="24">
                    <el-checkbox v-model="event.bringingAnyone">{{$root.labels.event_bringing_anyone}}</el-checkbox>
                  </el-col>
                </el-row>
                <el-row :gutter="10" v-if="event.bringingAnyone">
                  <el-col :lg="24" :md="24" :sm="24">
                    <el-checkbox v-model="event.aggregatedPrice">{{$root.labels.event_aggregated_price}}</el-checkbox>
                  </el-col>
                </el-row>
                <el-row :gutter="10">
                  <el-col :lg="24" :md="24" :sm="24">
                    <el-checkbox v-model="event.bookMultipleTimes">{{$root.labels.event_book_more_than_once}}</el-checkbox>
                  </el-col>
                </el-row>
              </div>

              <div>
                <div class="am-setting-box am-switch-box" v-if="isCabinet ? !notInLicence() : true" :class="licenceClass()" style="margin-top: 20px;">
                  <!-- Deposit Enabled -->
                  <el-row type="flex" align="middle" :gutter="24">
                    <el-col :span="19">
                      {{ $root.labels.deposit_enabled }}
                    </el-col>
                    <el-col :span="5" class="align-right">
                      <el-switch
                          v-model="depositEnabled"
                          :disabled="notInLicence()"
                          active-text=""
                          inactive-text=""
                          @change="depositEnabledChanged"
                      >
                      </el-switch>
                    </el-col>
                  </el-row>

                  <el-row :gutter="24" v-if="depositEnabled" class="am-service-deposit">
                    <el-col :span="12">
                      <el-form-item>
                        <label :slot="'label'">
                          {{ $root.labels.deposit_payment }}:
                          <el-tooltip placement="top">
                            <div slot="content" v-html="$root.labels.deposit_payment_tooltip"></div>
                            <i class="el-icon-question am-tooltip-icon"></i>
                          </el-tooltip>
                        </label>
                        <el-select
                            v-model="depositPayment"
                            placeholder=""
                            :popper-class="'am-dropdown-cabinet'"
                            @change="depositChanged()"
                        >
                          <el-option
                              v-for="(item, index) in depositOptions"
                              :key="index"
                              :label="item.label"
                              :value="item.value"
                          >
                          </el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>

                    <el-col :span="12">
                      <el-form-item prop="deposit" :rules="rules.deposit">
                        <label :slot="'label'">
                          {{ $root.labels.deposit_amount + (depositPayment === 'fixed' ? ' (' + getCurrencySymbol() + ')' : '') + (depositPayment === 'percentage' ? ' (%)' : '') +  ':' }}
                        </label>
                        <div v-if="depositPayment === 'fixed'" class="el-input">
                          <money v-model="event.deposit" v-bind="moneyComponentData" @input="depositChanged" class="el-input__inner"></money>
                        </div>

                        <el-input-number
                            v-if="depositPayment === 'percentage'"
                            v-model="event.deposit"
                            :min="0"
                            :max="100"
                            @input="depositChanged()"
                        >
                        </el-input-number>
                      </el-form-item>
                    </el-col>
                  </el-row>

                  <el-row v-if="(event.maxCapacity > 1 || getTicketsSpots() > 1 || maxCustomCapacityNum > 1) && depositPayment === 'fixed' && depositEnabled && event.aggregatedPrice">
                    <el-col>
                      <el-checkbox v-model="event.depositPerPerson">
                        {{$root.labels.deposit_per_person}}
                        <el-tooltip placement="top">
                          <div slot="content" v-html="$root.labels.deposit_by_the_number_of_people"></div>
                          <i class="el-icon-question am-tooltip-icon"></i>
                        </el-tooltip>
                      </el-checkbox>
                    </el-col>
                  </el-row>

                  <el-row :gutter="24" v-if="depositEnabled" class="am-service-deposit">
                    <el-col :span="24">
                      <el-checkbox v-model="event.fullPayment">
                        {{$root.labels.allow_total_event_amount}}
                        <el-tooltip placement="top">
                          <div slot="content" v-html="$root.labels.allow_customers_to_pay_total"></div>
                          <i class="el-icon-question am-tooltip-icon"></i>
                        </el-tooltip>
                      </el-checkbox>
                    </el-col>
                  </el-row>

                  <LicenceBlock/>
                </div>
              </div>

              <!-- Custom Pricing -->
              <div
                  v-if="isCabinet ? !notInLicence() : true"
                  class="am-setting-box am-switch-box"
                  :class="licenceClass()"
                  :style="{
                    marginTop: '24px',
                    overflow: 'visible',
                    cursor: ((event.id !== 0 && event.bookings.length) ? 'not-allowed' : 'auto')
                  }"
              >
                <!-- Custom Pricing Enabled -->
                <el-row type="flex" align="middle" :gutter="24">
                  <el-col :span="19">
                    {{ $root.labels.custom_pricing_enabled }}
                  </el-col>
                  <el-col :span="5" class="align-right">
                    <el-switch
                        v-model="customPricingEnabled"
                        :disabled="notInLicence()"
                        active-text=""
                        inactive-text=""
                        @change="switchTicketing"
                        :style="(event.id !== 0 && event.bookings.length) && ({cursor: 'not-allowed', pointerEvents: 'none'})"
                    >
                    </el-switch>
                  </el-col>
                </el-row>

                <el-form-item v-if="customPricingEnabled">
                  <el-row :style="{flexWrap: 'wrap'}">
                    <el-col :style="{marginBottom: '12px'}" class="am-event-ticket-row">
                      <!-- Ticket Categories Header-->
                      <el-row type="flex" :gutter="24" :style="{borderBottom: '1px solid #E2E6EC', padding: '12px', marginBottom: '8px', wordBreak: 'break-word'}">
                        <el-col :span="2"></el-col>
                        <el-col :span="7">
                          <div>
                            {{ $root.labels.name }}
                            <el-tooltip
                              class="item"
                              effect="dark"
                              :content="$root.labels.translate"
                              placement="top"
                            >
                              <span class="am-event-translate-ticket" @click="showDialogTranslate('name', customTickets)" v-if="!isCabinet">
                                <img class="am-dialog-translate-svg" width="16px" :src="$root.getUrl+'public/img/translate.svg'">
                              </span>
                            </el-tooltip>
                          </div>
                        </el-col>
                        <el-col :span="6">{{ $root.labels.price }}</el-col>
                        <el-col :span="7">{{ $root.labels.event_spots }}</el-col>
                      </el-row>
                      <!-- /Ticket Categories Header-->

                      <!-- Ticket Categories List-->
                      <el-row
                          type="flex"
                          align="middle"
                          :gutter="24"
                          :style="{padding: '12px', background: '#F9FAFB', marginBottom: '12px'}"
                          v-for="(ticket, index) in customTickets"
                          :key="index"
                          v-model="customTickets[index]"
                          class="am-section-grey"
                      >
                        <el-col :span="2">
                          <el-checkbox
                            :style="{marginBottom: '0px'}"
                            v-model="ticket.enabled"
                            :disabled="isTicketDisabled(index)"
                          >
                          </el-checkbox>
                        </el-col>
                        <el-col :span="7">
                          <el-input
                              :style="{marginBottom: '0px'}"
                              v-model="ticket.name"
                              @input="customTicketNameChanged($event, index)"
                              size="small">
                          </el-input>
                        </el-col>
                        <el-col :span="6">
                          <money
                              v-model="ticket.price"
                              v-bind="moneyComponentData"
                              @input="priceChanged"
                              class="el-input el-input__inner"
                              :style="{marginBottom: '0px', padding: '0 6px', textAlign: 'center', height: 'auto'}">
                          </money>
                        </el-col>
                        <el-col :span="7">
                          <el-input-number :style="{marginBottom: '0px', textAlign: 'center'}" v-model="ticket.spots" @change="ticket.spots = ticket.spots <= 0 ? 1 : ticket.spots" size="small" :min="1" :disabled="maxCustomCapacity"></el-input-number>
                        </el-col>
                        <el-col :span="2" :style="{display: 'flex', justifyContent: 'center'}" v-if="customTickets.length > 1">
                          <div class="am-delete-element" @click="deleteCustomTicket(index)" v-show="ticketIsBooked(ticket.id)">
                            <i class="el-icon-minus"></i>
                          </div>
                        </el-col>
                      </el-row>
                      <!-- /Ticket Categories List-->

                      <!-- Add Pricing Category button -->
                      <el-row :style="{padding: '12px 0'}">
                        <el-col>
                          <div class="am-add-element" @click="addCustomTicket">
                            <i class="el-icon-plus"></i>
                            <span>
                              {{ $root.labels.add_ticket_category }}
                            </span>
                          </div>
                        </el-col>
                      </el-row>
                      <!-- /Add Pricing Category button -->

                      <el-row type="flex" align="middle" :gutter="24" v-if="customTickets.length"  style="padding:12px 0">
                        <el-col :span="13">
                          <el-checkbox
                              v-model="maxCustomCapacity"
                          >
                            {{$root.labels.event_max_capacity}}:
                          </el-checkbox>
                        </el-col>
                        <el-col :span="11">
                          <el-input-number
                              :min="1"
                              :disabled="!maxCustomCapacity"
                              v-model="maxCustomCapacityNum"
                              size="small"
                              style="text-align: center"
                          >
                          </el-input-number>
                        </el-col>
                      </el-row>

                      <!-- Custom Pricing Warning -->
                      <el-row v-if="!maxCustomCapacity" :style="{borderBottom: customTickets.length ? '1px solid #E2E6EC' : '', marginBottom: '12px', wordBreak: 'break-word'}">
                        <div class="am-setting">
                          <el-alert
                              type="warning"
                              show-icon
                              title=""
                              :description="$root.labels.custom_pricing_warning"
                              :closable="false"
                          />
                        </div>
                      </el-row>
                      <!-- /Custom Pricing Warning -->
                    </el-col>
                  </el-row>

                  <!-- Enable Pricing By Date range -->
                  <el-row type="flex" align="middle" :gutter="24" v-if="customTickets.length">
                    <el-col :span="19">
                      {{ $root.labels.pricing_by_date_enabled }}
                    </el-col>
                    <el-col :span="5" class="align-right">
                      <el-switch
                          v-model="customPricingByDateRangeEnabled"
                          active-text=""
                          inactive-text=""
                          :disabled="!event.periods[0].range"
                      >
                      </el-switch>
                    </el-col>
                  </el-row>
                  <!-- /Enable Pricing By Date range -->

                  <!-- Custom Pricing Warning -->
                  <el-row :style="{borderBottom: customTickets.length ? '1px solid #E2E6EC' : '', marginBottom: '12px', marginTop: '12px', wordBreak: 'break-word'}" v-if="!event.periods[0].range">
                    <div class="am-setting">
                      <el-alert
                          type="warning"
                          show-icon
                          title=""
                          :description="$root.labels.custom_pricing_date_warning"
                          :closable="false"
                      />
                    </div>
                  </el-row>
                  <!-- /Custom Pricing Warning -->

                  <el-row v-if="customPricingByDateRangeEnabled" style="margin-bottom: 50px;">
                    <el-col
                        v-for="(ticket, i) in customTicketsDateRange"
                        :key="i"
                        :style="{background: '#F9FAFB', padding: '8px 12px', marginTop: i === 0 ? '10px':'12px', overflow: 'visible'}"
                        class="am-section-grey"
                    >
                      <el-row :style="{minHeight: '50px', borderBottom: '1px solid #E2E6EC', display: 'flex', alignItems: 'baseline', padding: '8px 0'}">
                        <el-col :span="5" :style="{marginBottom: 0, fontWeight: 500}">{{ $root.labels.event_date_range }}</el-col>
                        <el-col :span="17" style="overflow: visible" class="v-calendar-column">
                          <v-date-picker
                              v-model="customTicketsDateRange[i].range"
                              :is-double-paned="false"
                              mode='range'
                              popover-visibility="focus"
                              popover-direction="bottom"
                              :popover-align="screenWidth < 768 ? 'center' : 'right'"
                              :tint-color='isCabinet ? $root.settings.customization.primaryColor : "#1A84EE"'
                              :show-day-popover=false
                              :input-props='{class: "el-input__inner", readOnly: "readonly"}'
                              :is-expanded=false
                              :is-required=false
                              :is-read-only=true
                              input-class="el-input__inner"
                              :formats="vCalendarFormats"
                              style="margin-bottom: 0;"
                              :min-date="getStartTicketRangeDate('date', false)"
                              :max-date="getEndTicketRangeDate('date', false)"
                              :disabled-dates="customTicketsDateRangesSelected"
                              @input="setDisabledTicketRangeDates(null, false)"
                              @popover-did-appear="setDisabledTicketRangeDates(i, true)"
                          >
                          </v-date-picker>
                        </el-col>
                        <el-col :span="2">
                          <div class="am-delete-element" @click="deleteCustomTicketDateRange(i)" v-show="ticketIsBooked(ticket.id)" style="margin-left: 10px;">
                            <i class="el-icon-minus"></i>
                          </div>
                        </el-col>
                      </el-row>
                      <el-row
                          v-for="(ticket, index) in customTicketsDateRange[i].tickets"
                          :key="i + '' + index"
                          :style="{minHeight: '50px', borderBottom: index < customTicketsDateRange[i].tickets.length -1 ? '1px solid #E2E6EC':'', display: 'flex', alignItems: 'center',  padding: '8px 0'}"
                      >
                        <el-col :span="5">{{ticket.name}}</el-col>
                        <el-col :span="12">
                        </el-col>
                        <el-col :span="5">
                          <money
                              v-model="customTicketsDateRange[i].tickets[index].price"
                              v-bind="moneyComponentData"
                              class="el-input el-input__inner"
                              :style="{marginBottom: '0px', padding: '0 6px'}">
                          >
                          </money>
                        </el-col>
                        <el-col :span="2"></el-col>
                      </el-row>

                    </el-col>

                    <!-- Add Pricing Category button -->
                    <el-col :span="24" :style="{marginTop: '18px'}">
                      <div class="am-add-element" @click="addCustomTicketDateRange">
                        <i class="el-icon-plus"></i>
                        <span>
                         {{ $root.labels.event_add_date_range }}
                        </span>
                      </div>
                    </el-col>
                    <!-- /Add Pricing Category button -->

                    <!-- Event date range warning -->
                    <el-col :span="24" :style="{marginTop: '14px', wordBreak: 'break-word'}">
                      <div class="am-tickets-warning">
                        <el-alert
                            type="warning"
                            show-icon
                            title=""
                            :description="$root.labels.event_date_range_warning"
                            :closable="false"
                        />
                      </div>
                    </el-col>
                    <!-- /Event date range warning -->

                  </el-row>

                </el-form-item>
                <!-- /Pricing by date range -->

                <LicenceBlock/>
              </div>

              <!-- Close After Minimum -->
              <div v-if="event.maxCapacity > 1 || getTicketsSpots() > 1 || maxCustomCapacityNum > 1">
                <div class="am-setting-box am-switch-box am-event-close-after" style="margin-top: 20px;">
                  <el-row type="flex" align="middle" :gutter="24">
                    <el-col :span="19">
                      {{ $root.labels.event_close_after_min }}
                    </el-col>
                    <el-col :span="5" class="align-right">
                      <el-switch
                        v-model="closeAfterMin"
                      >
                      </el-switch>
                    </el-col>
                  </el-row>

                  <el-row v-if="closeAfterMin" type="flex" align="middle" :gutter="24" style="margin-top: 16px;">
                    <el-col>
                      <el-radio
                        :label="false"
                        @change="clearValidation()"
                        v-model="event.closeAfterMinBookings"
                      >
                        {{ $root.labels.event_close_min_total }}
                        <el-tooltip placement="top">
                          <div slot="content" v-html="$root.labels.event_close_min_total_tt"></div>
                          <i class="el-icon-question am-tooltip-icon"></i>
                        </el-tooltip>
                      </el-radio>

                    </el-col>
                  </el-row>

                  <el-row v-if="closeAfterMin" type="flex" align="middle" :gutter="24">
                    <el-col>
                      <el-radio
                        :label="true"
                        @change="clearValidation()"
                        v-model="event.closeAfterMinBookings"
                      >
                        {{ $root.labels.event_close_min_bookings }}
                        <el-tooltip placement="top">
                          <div slot="content" v-html="$root.labels.event_close_min_bookings_tt"></div>
                          <i class="el-icon-question am-tooltip-icon"></i>
                        </el-tooltip>
                      </el-radio>
                    </el-col>
                  </el-row>

                  <el-row :gutter="24" v-if="closeAfterMin" class="am-service-deposit">
                    <el-col :span="24">
                      <el-form-item :label="$root.labels.event_close_minimum + ':'">
                        <el-input-number
                          v-model="event.closeAfterMin"
                          :min="1"
                          :max="getMaxCapacity(event)"
                          @input="clearValidation()"
                        >
                        </el-input-number>
                      </el-form-item>
                    </el-col>
                  </el-row>
                </div>
              </div>


              <!-- Limit additional people -->
              <div v-if="event.maxCapacity > 1 || getTicketsSpots() > 1 || maxCustomCapacityNum > 1">
                <div class="am-setting-box am-switch-box am-event-close-after" style="margin-top: 20px;">
                    <el-row type="flex" align="middle" :gutter="24">
                      <el-col :span="19">
                        {{ $root.labels.limit_extra_people }}
                        <el-tooltip placement="top">
                          <div slot="content" v-html="$root.labels.limit_extra_people_tooltip"></div>
                          <i class="el-icon-question am-tooltip-icon"></i>
                        </el-tooltip>
                      </el-col>
                      <el-col :span="5" class="align-right">
                        <el-switch
                          v-model="maxExtraPeopleEnabled"
                          active-text=""
                          inactive-text=""
                          @change="changeMaxExtraPeople"
                        >
                        </el-switch>
                      </el-col>
                    </el-row>

                    <el-row v-if="maxExtraPeopleEnabled" type="flex">
                      <el-col>
                        <el-form-item label="placeholder">
                          <label slot="label">
                            {{ $root.labels.limit_extra_people_set }}:
                          </label>
                          <el-input-number
                            v-model="event.maxExtraPeople"
                            :min="0"
                            :max="getMaxCapacity() - 1"
                            @input="clearValidation()"
                          >
                          </el-input-number>
                        </el-form-item>
                      </el-col>
                    </el-row>
                  </div>
                </div>


            </div>

          </el-tab-pane>

          <!-- Customize -->
          <el-tab-pane v-if="notInLicence('starter') ? licenceVisible() : true" :label="$root.labels.customize" name="customize">
            <LicenceBlockHeader :licence="'starter'"/>
            <!-- Gallery -->
            <gallery
              v-if="showGallery"
              :gallery="event.gallery"
              :label="$root.labels.event_gallery"
              @galleryUpdated="galleryUpdated"
              :class="licenceClassDisabled('starter')"
            />

            <!-- Colors -->
            <div :class="licenceClassDisabled('starter')" class="am-event-colors">
              <div class="am-event-section-title">
                {{$root.labels.event_colors}}
              </div>
              <div class="am-event-color-selection">
                <div>
                  <el-radio v-model="event.colorType" :label="1" value=1>{{$root.labels.event_colors_preset}}</el-radio>
                  <div class="am-event-swatches am-event-swatches-first">
                    <span
                      v-for="color in colors"
                      :key="color"
                      :class="{'color-active' : color === event.selectedColor}"
                      @click="changeEventColor"
                      :data-color="color"
                      :style="'background-color: ' + color"
                    >
                    </span>
                  </div>
                </div>
                <div>
                  <el-radio v-model="event.colorType" :label="2" value=2>{{$root.labels.event_colors_custom}}</el-radio>
                  <el-input
                    :disabled="event.colorType === 1 || notInLicence('starter')"
                    v-model="event.customColor"
                    class="am-event-custom-color"
                    placeholder="000000"
                  >
                  </el-input>
                  <div class="am-event-swatches">
                    <span
                      :data-color="event.customColor"
                      :style="'background-color: ' + event.customColor"
                    >
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Show/Hide Event -->
            <div :class="licenceClassDisabled('starter')">
              <el-checkbox
                v-model="event.show"
                :disabled="notInLicence('starter')"
              >
                {{$root.labels.event_show_on_site}}
              </el-checkbox>
            </div>

          </el-tab-pane>

          <!-- Waiting List -->
          <el-tab-pane
              :label="$root.labels.waiting_list"
              name="waitingList"
              v-if="notInLicence('pro') ? licenceVisible() : $root.settings.appointments.waitingListEvents.enabled"
          >
            <LicenceBlockHeader :licence="'pro'"/>
            <div class="am-setting-box am-switch-box" :class="licenceClassDisabled('pro')">
              <el-row type="flex" align="middle" :gutter="24" style="display: flex;">
                <el-col :span="20">
                  <span style="line-height: 1;">{{ $root.labels.events_show_waiting_list_booking_full }}</span>
                </el-col>
                <el-col :span="4" class="align-right">
                  <el-switch
                    v-model="event.settings.waitingList.enabled"
                    active-text=""
                    inactive-text=""
                  >
                  </el-switch>
                </el-col>
              </el-row>
              <el-row align="middle" :gutter="24" style="margin-top: 24px" v-if="event.settings.waitingList.enabled">

                <!-- Waiting List adding method -->
                <!--<el-col :span="24">
                  {{ $root.labels.waiting_list_adding_method }}:
                </el-col>
                <el-col :span="24">
                  <el-radio
                      label="Manually"
                      v-model="event.settings.waitingList.addingMethod"
                      style="margin-top: 4px;"
                  >
                    {{ $root.labels.waiting_list_adding_method_manual }}
                    <el-tooltip placement="top" :popper-class="'am-tooltip-waiting-list'">
                      <div slot="content" v-html="$root.labels.waiting_list_adding_method_manual_tt"></div>
                      <i class="el-icon-question am-tooltip-icon"></i>
                    </el-tooltip>
                  </el-radio>
                </el-col>
                <el-col :span="24">
                  <el-radio
                      label="Automatically"
                      v-model="event.settings.waitingList.addingMethod"
                      style="margin-top: 8px;"
                      :disabled="true"
                  >
                    {{ $root.labels.waiting_list_adding_method_auto }}
                    <el-tooltip placement="top" :popper-class="'am-tooltip-waiting-list'">
                      <div slot="content" v-html="$root.labels.waiting_list_adding_method_auto_tt"></div>
                      <i class="el-icon-question am-tooltip-icon"></i>
                    </el-tooltip>
                  </el-radio>
                </el-col>-->

                <!-- Max capacity -->
                <el-col :span="24" style="margin-top: 24px;">
                  {{ $root.labels.maximum_capacity }}:
                </el-col>
                <el-col :span="24" style="margin-top: 8px;">
                  <el-input-number
                    v-model="event.settings.waitingList.maxCapacity"
                    :min="1"
                    auto-complete="off"
                    :disabled="customPricingEnabled && !maxCustomCapacity"
                  >
                  </el-input-number>
                </el-col>

                <!-- waiting list tickets -->
                <div
                  v-if="isCabinet ? !notInLicence() : customPricingEnabled"
                  :class="licenceClass()"
                  :style="{padding: '12px', display: 'flex', flexDirection: 'column'}"
                >

                  <el-form-item v-if="customPricingEnabled">
                    <el-row :style="{flexWrap: 'wrap'}">
                      <el-col :style="{marginBottom: '12px'}" class="am-event-ticket-row">
                        <!-- Ticket Categories Header-->
                        <el-row
                          type="flex"
                          :gutter="24"
                          :style="{borderBottom: '1px solid #E2E6EC', padding: '12px', marginBottom: '8px', wordBreak: 'break-word'}"
                        >
                          <el-col :span="7">
                            <div>
                              {{ $root.labels.name }}
                            </div>
                          </el-col>
                          <el-col :span="10"></el-col>
                          <el-col :span="7">{{ $root.labels.event_spots }}</el-col>
                        </el-row>
                        <!-- /Ticket Categories Header-->

                        <!-- Ticket Categories List-->
                        <el-row
                          type="flex"
                          align="middle"
                          :gutter="24"
                          :style="{padding: '12px', background: '#F9FAFB', marginBottom: '12px'}"
                          v-for="(ticket, index) in customTickets"
                          :key="index"
                          v-model="customTickets[index]"
                          class="am-section-grey"
                        >
                          <el-col :span="7">
                            <el-input
                              :style="{marginBottom: '0px'}"
                              v-model="ticket.name"
                              :disabled="true"
                              size="small">
                            </el-input>
                          </el-col>
                          <el-col :span="10"></el-col>
                          <el-col :span="7">
                            <el-input-number
                              v-model="ticket.waitingListSpots"
                              :style="{marginBottom: '0px', textAlign: 'center'}"
                              size="small"
                              :min="0"
                              :disabled="!ticket.enabled || maxCustomCapacity"
                            >
                            </el-input-number>
                          </el-col>
                        </el-row>
                        <!-- /Ticket Categories List-->
                      </el-col>
                    </el-row>
                  </el-form-item>
                </div>
                <!-- /waiting list tickets -->

                <!-- Max ticket per person -->
                  <div class="am-waiting-list-limit-per-ticket-box">
                    <el-col :span="15">
                      <el-checkbox
                        v-model="event.settings.waitingList.maxExtraPeopleEnabled"
                      >
                        {{ $root.labels.limit_extra_people }}
                      </el-checkbox>
                    </el-col>
                    <el-col :span="9">
                      <el-input-number
                        :disabled="!event.settings.waitingList.maxExtraPeopleEnabled"
                        v-model="event.settings.waitingList.maxExtraPeople"
                        :min="0"
                        size="small"
                        auto-complete="off"
                      ></el-input-number>
                    </el-col>
                  </div>
              </el-row>
            </div>
          </el-tab-pane>
          <!-- /Waiting List -->

          <el-tab-pane :label="$root.labels.settings" name="settings">
            <entity-settings
              :settings="settings"
              :paymentsSettings="event.settings.payments"
              :generalSettings="event.settings.general"
              :lessonSpaceSettings="event.settings.lessonSpace"
              :google-meet-settings="event.settings.googleMeet"
              :microsoft-teams-settings="event.settings.microsoftTeams"
            >
            </entity-settings>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </div>

    <!-- Dialog Actions -->
    <dialog-actions
        v-if="event && !dialogLoading && this.$root.settings.role !== 'customer'"
        formName="event"
        urlName="events"
        :isNew="event.id === 0"
        :entity="event"
        :getParsedEntity="getParsedEntity"
        :haveSaveConfirmation="haveSaveConfirmation"
        :getCalendarEvents="getCalendarEvents"
        :loadSaveButton="checkCalendarEvents"
        :calendarConflict="calendarConflict"
        @validationFailCallback="validationFailCallback"
        @errorCallback="errorCallback"
        @confirmCalendarConflict = "confirmCalendarConflict"
        :hasIcons="false"
        :updateStash="true"
        :hasApplyGloballyVisibility="originRecurring.until"
        :hasApplyGloballyDeletion="originRecurring.until && (event.status === 'rejected' || hasPassed())"

        :status="{
          on: 'approved',
          off: 'rejected'
        }"

        :buttonType="{
          status: event.status === 'approved' ? 'danger' : 'primary',
          remove: 'danger',
          duplicate: 'primary'
        }"

        :buttonText="{
          action: {
            remove: $root.labels.event_delete,
            status: event.status === 'approved' ? $root.labels.event_cancel : $root.labels.event_open,
            duplicate: $root.labels.event_duplicate
          },
          confirm: {
            save: calendarConflict.enabled ? {
              yes: $root.labels.confirm,
              no: $root.labels.cancel
            } : (originRecurring.until ? {
              yes: $root.labels.update_following,
              no: $root.labels.save_single
            } : null),
            status: originRecurring.until ? {
              yes: event.status === 'rejected' ? $root.labels.open_following : $root.labels.cancel_following,
              no: $root.labels.save_single
            } : event.status === 'rejected' ? {
              yes: $root.labels.open,
              no: $root.labels.open
            } : null,
            remove: originRecurring.until ? {
              yes: $root.labels.delete_following,
              no: $root.labels.save_single
            } : null
          }
        }"

        :action="{
          haveAdd: true,
          haveEdit: true,
          haveStatus: canManage() && !hasPassed(),
          haveRemove: $root.settings.capabilities.canDelete === true && (event.status === 'rejected' || hasPassed()),
          haveRemoveEffect: event.status !== 'rejected' && !hasPassed(),
          haveDuplicate: event.status === 'approved'
        }"

        :message="{
          success: {
            save: $root.labels.event_saved,
            remove: $root.labels.event_deleted,
            show: $root.labels.event_opened,
            hide: $root.labels.event_canceled
          },
          confirm: {
            save: calendarConflict.enabled ? $root.labels.confirm_save_conflict : (originRecurring.until ? $root.labels.confirm_save_following : null),
            saveDetails: !calendarConflict.enabled && customPricingEnabled ? $root.labels.confirm_save_following_2 : null,
            remove: originRecurring.until ? $root.labels.confirm_delete_following : $root.labels.confirm_delete,
            show: originRecurring.until ? $root.labels.confirm_open_following : $root.labels.confirm_open,
            hide: originRecurring.until ? $root.labels.confirm_cancel_following : $root.labels.confirm_cancel,
            duplicate: $root.labels.confirm_duplicate_event
          }
        }"
    >
    </dialog-actions>

  </div>

</template>

<script>
  import licenceMixin from '../../../js/common/mixins/licenceMixin'
  import cabinetMixin from '../../../js/frontend/mixins/cabinetMixin'
  import dateMixin from '../../../js/common/mixins/dateMixin'
  import LicenceBlock from '../parts/LicenceBlock'
  import LicenceBlockHeader from '../parts/LicenceBlockHeader'
  import DialogActions from '../parts/DialogActions.vue'
  import durationMixin from '../../../js/common/mixins/durationMixin'
  import EntitySettings from '../parts/EntitySettings.vue'
  import Gallery from '../parts/Gallery.vue'
  import imageMixin from '../../../js/common/mixins/imageMixin'
  import notifyMixin from '../../../js/backend/mixins/notifyMixin'
  import priceMixin from '../../../js/common/mixins/priceMixin'
  import windowMixin from '../../../js/backend/mixins/windowMixin'
  import helperMixin from '../../../js/backend/mixins/helperMixin'
  import settingsMixin from '../../../js/common/mixins/settingsMixin'
  import recurringMixin from '../../../js/common/mixins/recurringMixin'
  import currentUserMixin from '../../../js/common/mixins/currentUserMixin'
  import { Money } from 'v-money'
  import moment from 'moment'
  import ContentBlock from '../parts/ContentBlock'

  export default {

    mixins: [
      licenceMixin,
      cabinetMixin,
      dateMixin,
      durationMixin,
      imageMixin,
      notifyMixin,
      priceMixin,
      windowMixin,
      helperMixin,
      settingsMixin,
      recurringMixin,
      currentUserMixin
    ],

    props: {
      selectedTimeZone: '',
      event: null,
      employees: null,
      locations: null,
      tags: null,
      settings: null,
      isCabinet: {
        required: false,
        default: false,
        type: Boolean
      },
      showHeader: {
        required: false,
        default: true,
        type: Boolean
      },
      showGallery: {
        required: false,
        default: true,
        type: Boolean
      }
    },

    data () {
      let validateNonNegativePrice = (rule, price, callback) => {
        if (price < 0) {
          callback(new Error(this.$root.labels.enter_non_negative_price_warning))
        } else {
          callback()
        }
      }

      let validatePositiveValue = (rule, price, callback) => {
        if (price <= 0) {
          this.defaultEventTab = 'pricing'

          callback(new Error(this.$root.labels.enter_positive_price_warning))
        } else {
          callback()
        }
      }

      let isRecurringUntilDateDateRequired = (rule, input, callback) => {
        if (!this.event.recurring.until && !input) {
          callback(new Error(this.$root.labels.select_date_warning))
        } else {
          callback()
        }
      }

      let isRecurringCycleDateRequired = (rule, input, callback) => {
        if (!this.event.recurring.cycle && !input) {
          callback(new Error(this.$root.labels.select_cycle_warning))
        } else {
          callback()
        }
      }

      let isRecurringIntervalRequired = (rule, input, callback) => {
        if (!this.event.recurring.cycleInterval && !input) {
          callback(new Error(this.$root.labels.select_interval_warning))
        } else {
          callback()
        }
      }

      let isBookingStartsDateRequired = (rule, input, callback) => {
        if (!this.event.bookingStartsNow && !input) {
          callback(new Error(this.$root.labels.select_date_warning))
        } else {
          callback()
        }
      }

      let isBookingStartsTimeRequired = (rule, input, callback) => {
        if (!this.event.bookingStartsNow && !input) {
          callback(new Error(this.$root.labels.select_time_warning))
        } else {
          callback()
        }
      }

      let isBookingEndsDateRequired = (rule, input, callback) => {
        if (!this.event.bookingEndsAfter && !input) {
          callback(new Error(this.$root.labels.select_date_warning))
        } else {
          callback()
        }
      }

      let isBookingEndsTimeRequired = (rule, input, callback) => {
        if (!this.event.bookingEndsAfter && !input) {
          callback(new Error(this.$root.labels.select_time_warning))
        } else {
          callback()
        }
      }

      return {
        maxExtraPeopleEnabled: false,
        closeAfterMin: false,
        currentUser: null,
        customPrice: 0,
        calendarConflict: {enabled: false},
        checkCalendarEvents: false,
        customPricingEnabled: false,
        customPricingByDateRangeEnabled: false,
        customTickets: [],
        maxCustomCapacity: false,
        maxCustomCapacityNum: 1,
        soldTicketsIds: [],
        customTicketsDateRange: [],
        customTicketsDateRangesDisabledDates: [],
        customTicketsDateRangesSelected: [],
        monthDate: null,
        monthlyOnRepeat: 'first',
        monthlyOnDay: 'monday',
        monthlyRepeat: 'each',
        weekDays: [
          {
            label: this.$root.labels.weekday_monday,
            value: 'monday'
          },
          {
            label: this.$root.labels.weekday_tuesday,
            value: 'tuesday'
          },
          {
            label: this.$root.labels.weekday_wednesday,
            value: 'wednesday'
          },
          {
            label: this.$root.labels.weekday_thursday,
            value: 'thursday'
          },
          {
            label: this.$root.labels.weekday_friday,
            value: 'friday'
          },
          {
            label: this.$root.labels.weekday_saturday,
            value: 'saturday'
          },
          {
            label: this.$root.labels.weekday_sunday,
            value: 'sunday'
          }
        ],
        activeColor: 'white',
        depositEnabled: false,
        depositPayment: 'fixed',
        depositOptions: [
          {
            value: 'fixed',
            label: this.$root.labels.amount_fixed
          },
          {
            value: 'percentage',
            label: this.$root.labels.amount_percentage
          }
        ],
        originRecurring: null,
        originPeriods: null,
        colors: [
          '#1788FB',
          '#4BBEC6',
          '#FBC22D',
          '#FA3C52',
          '#D696B8',
          '#689BCA',
          '#26CC2B',
          '#FD7E35',
          '#E38587',
          '#774DFB'
        ],
        monthlyWeekDayRepeat: [
          {
            label: this.$root.labels.recurring_date_first,
            value: 'first'
          },
          {
            label: this.$root.labels.recurring_date_second,
            value: 'second'
          },
          {
            label: this.$root.labels.recurring_date_third,
            value: 'third'
          },
          {
            label: this.$root.labels.recurring_date_fourth,
            value: 'fourth'
          },
          {
            label: this.$root.labels.recurring_date_fifth,
            value: 'fifth'
          },
          {
            label: this.$root.labels.recurring_date_last,
            value: 'last'
          }
        ],
        recurringPeriods: [
          {
            label: this.$root.labels.recurring_type_daily,
            value: 'daily'
          },
          {
            label: this.$root.labels.recurring_type_weekly,
            value: 'weekly'
          },
          {
            label: this.$root.labels.recurring_type_monthly,
            value: 'monthly'
          },
          {
            label: this.$root.labels.recurring_type_yearly,
            value: 'yearly'
          }
        ],
        zoomUsers: [],
        dialogLoading: true,
        executeUpdate: true,
        mounted: false,
        rules: {
          name: [
            {required: true, message: this.$root.labels.enter_name_warning, trigger: 'submit'}
          ],
          price: [
            {validator: validateNonNegativePrice, trigger: 'submit'},
            {required: true, message: this.$root.labels.enter_service_price_warning, trigger: 'submit', type: 'number'}
          ],
          deposit: [
            {validator: validatePositiveValue, trigger: 'submit'}
          ],
          range: [
            {
              required: true, message: this.$root.labels.select_date_warning, trigger: 'submit'
            }
          ],
          startTime: [
            {
              required: true, message: this.$root.labels.select_time_warning, trigger: 'submit'
            }
          ],
          endTime: [
            {
              required: true, message: this.$root.labels.select_time_warning, trigger: 'submit'
            }
          ],
          bookingStartsDate: [
            {
              validator: isBookingStartsDateRequired, trigger: 'submit'
            }
          ],
          bookingStartsTime: [
            {
              validator: isBookingStartsTimeRequired, trigger: 'submit'
            }
          ],
          bookingEndsDate: [
            {
              validator: isBookingEndsDateRequired, trigger: 'submit'
            }
          ],
          bookingEndsTime: [
            {
              validator: isBookingEndsTimeRequired, trigger: 'submit'
            }
          ],
          recurringUntilDate: [
            {
              validator: isRecurringUntilDateDateRequired, trigger: 'submit'
            }
          ],
          recurringCycle: [
            {
              validator: isRecurringCycleDateRequired, trigger: 'submit'
            }
          ],
          recurringInterval: [
            {
              validator: isRecurringIntervalRequired, trigger: 'submit'
            }
          ]
        },
        defaultEventTab: 'details'
      }
    },

    methods: {
      hasPassed () {
        return this.event && this.event.id !== 0 && moment(this.event.periods[this.event.periods.length - 1].range.end, 'YYYY-MM-DD HH:mm:ss').isBefore(moment())
      },

      changeRecurringCycle (value) {
        if (this.event.recurring.cycleInterval === null || this.event.recurring.cycleInterval === undefined) {
          this.event.recurring.cycleInterval = 1
        }
      },

      changeMaxExtraPeople () {
        if (this.maxExtraPeopleEnabled && this.event.maxExtraPeople === null) {
          this.event.maxExtraPeople = this.event.minCapacity - 1
        }
      },

      createEventPeriods () {
        let $this = this
        let eventPeriods = []

        this.event.periods.forEach(function (period, index) {
          let periodStart = $this.getDateString(period.range.start) + ' ' + period.startTime + ':00'
          let periodEnd = $this.getDateString(period.range.end) + ' ' + period.endTime + ':00'

          if ($this.selectedTimeZone === 'UTC') {
            periodStart = moment(periodStart, 'YYYY-MM-DD HH:mm').utc().format('YYYY-MM-DD HH:mm')
            periodEnd = moment(periodEnd, 'YYYY-MM-DD HH:mm').utc().format('YYYY-MM-DD HH:mm')
          }

          if (typeof $this.originPeriods[index] !== 'undefined') {
            period.id = $this.originPeriods[index].id
            period.eventId = $this.originPeriods[index].eventId
          }

          eventPeriods.push({
            id: period.id,
            eventId: $this.event.id ? $this.event.id : null,
            periodStart: periodStart,
            periodEnd: periodEnd,
            googleCalendarEventId: period.googleCalendarEventId,
            googleMeetUrl: period.googleMeetUrl,
            outlookCalendarEventId: period.outlookCalendarEventId,
            microsoftTeamsUrl: period.microsoftTeamsUrl,
            appleCalendarEventId: period.appleCalendarEventId
          })
        })

        return eventPeriods
      },

      assignOrganizer (event) {
        if (event) {
          this.event.organizerId = this.currentUser.id
        } else {
          this.event.organizerId = null
        }
        this.$forceUpdate()
      },

      confirmCalendarConflict () {
        this.$set(this.calendarConflict, 'enabled', false)
      },

      getTicketsSpots () {
        let ticketsSum = 0
        if (this.customTickets) {
          this.customTickets.forEach(ticket => {
            ticketsSum += ticket.spots
          })
        }
        return ticketsSum
      },

      getMaxCapacity () {
        if (this.maxCustomCapacity) {
          return this.maxCustomCapacityNum
        } else if (this.customPricingEnabled) {
          return this.getTicketsSpots()
        } else {
          return this.event.maxCapacity
        }
      },

      isTicketDisabled (index) {
        let isDisabled = false

        if (this.customTickets.filter(ticket => ticket.enabled).length <= 1) {
          this.customTickets.forEach((ticket, i) => {
            if (index === i && ticket.enabled) {
              isDisabled = true
            }
          })
        }

        return isDisabled
      },

      customTicketNameChanged (value, index) {
        if (this.customTicketsDateRange.length) {
          for (let i = 0; i < this.customTicketsDateRange.length; i++) {
            this.customTicketsDateRange[i].tickets.map((ticket, i) => {
              ticket.name = i !== index ? ticket.name : value
            })
          }
        }
      },

      switchTicketing (val) {
        this.customPricingEnabled = val
        if (val) {
          this.setDisabledTicketRangeDates(null, false)

          if (this.event.customTickets.length === 0 && this.customTickets.length === 0) {
            this.addCustomTicket()
          }
        }
      },

      ticketIsBooked (id) {
        return !this.soldTicketsIds.includes(id)
      },

      deleteCustomTicket (index) {
        this.customTickets = this.customTickets.filter((ticket, ticketIndex) => ticketIndex !== index)

        if (this.customTicketsDateRange.length) {
          // remove ticket from date ranges
          for (let i = 0; i < this.customTicketsDateRange.length; i++) {
            this.customTicketsDateRange[i].tickets = this.customTicketsDateRange[i].tickets.filter((ticket, ticketIndex) => ticketIndex !== index)

            // remove date range if there is no tickets in it
            if (!this.customTicketsDateRange[i].tickets.length) {
              this.customTicketsDateRange = this.customTicketsDateRange.splice(i - 1, 1)
            }
          }

          if (!this.customTickets.length) this.customTicketsDateRange = []

          let hasEnabled = false

          if (this.customTickets.filter(ticket => ticket.enabled).length <= 1) {
            this.customTickets.forEach((ticket, i) => {
              if (ticket.enabled) {
                hasEnabled = true
              }
            })
          }

          if (!hasEnabled) {
            this.customTickets[this.customTickets.length - 1].enabled = true
          }
        }
      },

      getStartTicketRangeDate (type, split) {
        let startDate = this.event.bookingStartsDate
          ? moment(this.event.bookingStartsDate)
          : moment()

        if (!split) {
          switch (type) {
            case ('date'):
              return moment(startDate).toDate()

            case ('moment'):
              return moment(startDate)

            case ('string'):
              return moment(startDate).format('YYYY-MM-DD')
          }
        } else {
          return moment(startDate).format('YYYY-MM-DD').split('-')
        }
      },

      getEndTicketRangeDate (type, split) {
        let endDate = this.event.bookingEndsDate
          ? moment(this.event.bookingEndsDate)
          : moment(this.event.periods[0].range.start, 'YYYY-MM-DD')

        if (!split) {
          switch (type) {
            case ('date'):
              return moment(endDate).toDate()

            case ('moment'):
              return moment(endDate)

            case ('string'):
              return moment(endDate).format('YYYY-MM-DD')
          }
        } else {
          return moment(endDate).format('YYYY-MM-DD').split('-')
        }
      },

      getPeriodDates (startDate, endDate, type) {
        let periodDates = []

        while (startDate.isSameOrBefore(endDate)) {
          switch (type) {
            case ('date'):
              periodDates.push(moment(startDate).toDate())
              break

            case ('moment'):
              periodDates.push(moment(startDate))
              break

            case ('string'):
              periodDates.push(moment(startDate).format('YYYY-MM-DD'))
              break
          }

          startDate.add(1, 'days')
        }

        return periodDates
      },

      setDisabledTicketRangeDates (i, force) {
        let selectedRangeDates = []

        this.customTicketsDateRange.forEach((item, index) => {
          if (item.range && (i !== null ? i !== index : true)) {
            let rangeStartDate = moment(item.range.start)

            let rangeEndDate = moment(item.range.end)

            selectedRangeDates = selectedRangeDates.concat(this.getPeriodDates(rangeStartDate, rangeEndDate, 'date'))
          }
        })

        if (!force) {
          this.customTicketsDateRangesSelected = selectedRangeDates
        } else if (selectedRangeDates.length && this.customTicketsDateRange.length >= i && this.customTicketsDateRange[i].range) {
          setTimeout(() => {
            this.customTicketsDateRangesSelected = selectedRangeDates
          }, 200)
        }
      },

      deleteCustomTicketDateRange (index) {
        this.customTicketsDateRange.splice(index, 1)

        this.setDisabledTicketRangeDates(null, false)
      },

      addCustomTicketDateRange () {
        let tickets = []

        for (let i = 0; i < this.customTickets.length; i++) {
          tickets.push({
            id: this.customTickets[i].id,
            name: this.customTickets[i].name,
            price: this.customTickets[i].price,
            enabled: this.customTickets[i].enabled
          })
        }

        this.customTicketsDateRange.push({
          range: null,
          tickets
        })

        this.setDisabledTicketRangeDates(null, false)
      },

      addCustomTicket () {
        let newTicket = {
          id: 0,
          enabled: true,
          name: '',
          spots: 1,
          waitingListSpots: 0,
          price: 0
        }

        this.customTickets.push(newTicket)

        this.customTicketsDateRange.forEach(item => {
          item.tickets.push(
            JSON.parse(JSON.stringify(newTicket))
          )
        })
      },

      getCalendarEvents () {
        return new Promise((resolve, reject) => {
          if (this.event.organizerId && this.event.periods && this.event.name) {
            let organizer = this.employees.find(e => e.id === this.event.organizerId)
            if (organizer && (organizer.googleCalendar || organizer.outlookCalendar)) {
              let providersForTest = this.event.providers.concat(organizer)
              this.checkCalendarEvents = true
              let config = null
              if (this.isCabinet) {
                config = Object.assign(this.getAuthorizationHeaderObject(), {params: {source: 'cabinet-' + this.$store.state.cabinet.cabinetType}})
              }
              this.$http.post(`${this.$root.getAjaxUrl}/events/calendar`,
                {providers: providersForTest, 'periods': this.createEventPeriods(), 'eventIds': [this.event.id, this.event.parentId], 'recurring': this.event.recurring}, config)
                .then(response => {
                  this.$set(this.calendarConflict, 'enabled', false)
                  resolve(response)
                }).catch((e) => {
                  this.$set(this.calendarConflict, 'enabled', true)
                  resolve(e)
                }).finally(() => { this.checkCalendarEvents = false })
            } else {
              resolve(true)
            }
          } else {
            resolve(true)
          }
        })
      },

      calculateMinDate () {
        if (this.event && this.event.periods && this.event.periods[0] && this.event.periods[0].range) {
          let date = this.event.periods[0].range.start
          return new Date(date.getFullYear(), date.getMonth(), 1)
        }
      },

      calculateMaxDate () {
        if (this.event && this.event.periods && this.event.periods[0] && this.event.periods[0].range) {
          let date = this.event.periods[0].range.start
          return new Date(date.getFullYear(), date.getMonth() + 1, 0)
        }
      },

      depositEnabledChanged () {
        if (this.depositEnabled) {
          this.event.depositPayment = this.depositPayment
        } else {
          this.event.depositPayment = 'disabled'
        }
      },

      getTicketsMaxPrice (tickets) {
        return tickets.length ? Math.max(...tickets.map(ticket => ticket.price)) : 0
      },

      depositChanged () {
        if (this.customPricingEnabled &&
            this.event.deposit > this.getTicketsMaxPrice(this.customTickets) &&
            this.depositPayment === 'fixed'
        ) {
          this.event.deposit = this.getTicketsMaxPrice(this.customTickets)
        }

        if (!this.customPricingEnabled && this.event.deposit > this.event.price && this.depositPayment === 'fixed') {
          this.event.deposit = this.event.price
        }
      },

      priceChanged () {
        if (this.customPricingEnabled &&
            this.event.deposit > this.getTicketsMaxPrice(this.customTickets) &&
            this.depositPayment === 'fixed'
        ) {
          this.event.deposit = this.getTicketsMaxPrice(this.customTickets)
        }

        if (!this.customPricingEnabled && this.event.deposit > this.event.price && this.depositPayment === 'fixed') {
          this.event.deposit = this.event.price
        }
      },

      canManage () {
        return this.$root.settings.role === 'admin' || this.$root.settings.role === 'manager'
      },

      galleryUpdated (gallery) {
        this.event.gallery = gallery
      },

      validationFailCallback () {
        if (this.event.depositPayment !== 'disabled' && this.event.deposit <= 0) {
          this.defaultEventTab = 'pricing'
        } else {
          this.defaultEventTab = 'details'
        }
      },

      tagsChanged (tags) {
        let lastTag = tags[tags.length - 1]

        if (this.tags.indexOf(lastTag) === -1) {
          this.tags.push(lastTag)
        }
      },

      haveSaveConfirmation () {
        return (this.event.id !== 0 && this.originRecurring.until) || this.calendarConflict.enabled
      },

      changeBookingStartsDate () {
        if (this.event.bookingStartsTime === null) {
          this.event.bookingStartsTime = '00:00'
        }
      },

      changeBookingEndsDate () {
        if (this.event.bookingEndsTime === null) {
          this.event.bookingEndsTime = '00:00'
        }
      },

      mergeTicketsWithSameDateRange (dateRange) {
        let dateRangesArray = dateRange

        for (let i = 0; i < dateRangesArray.length; i++) {
          for (let j = i + 1; j < dateRangesArray.length; j++) {
            if (JSON.stringify(dateRangesArray[i].range) === JSON.stringify(dateRangesArray[j].range)) {
              dateRangesArray[i].tickets.push(dateRangesArray[j].tickets[0])
              dateRangesArray.splice(j, 1)
              j--
            }
          }
        }
        return dateRangesArray
      },

      instantiateDialog () {
        if ((this.event !== null) && this.executeUpdate === true) {
          this.maxCustomCapacity = this.event.maxCustomCapacity !== null
          this.maxCustomCapacityNum = this.maxCustomCapacity ? this.event.maxCustomCapacity : 1
          this.maxExtraPeopleEnabled = this.event.maxExtraPeople !== null

          this.event.notifyParticipants = !!this.event.notifyParticipants

          this.event.customTickets && this.event.customTickets.forEach(ticket => {
            let dateRanges = JSON.parse(ticket.dateRanges)
            this.customTickets.push({
              id: ticket.id,
              enabled: ticket.enabled,
              name: ticket.name,
              spots: ticket.spots,
              waitingListSpots: ticket.waitingListSpots,
              price: ticket.price,
              translations: ticket.translations ? ticket.translations : ''
            })

            if (dateRanges.length) {
              dateRanges.forEach(dtrange => {
                this.customTicketsDateRange.push({
                  tickets: [{
                    id: ticket.id,
                    name: ticket.name,
                    price: dtrange.price,
                    enabled: ticket.enabled
                  }],
                  range: {
                    start: moment(dtrange.startDate).toDate(),
                    end: moment(dtrange.endDate).toDate()
                  }
                })
              })
            }
            this.setDisabledTicketRangeDates(null, false)
          })
          if (this.event.customPricing) {
            this.customPricingEnabled = true
          }
          if (this.customTickets.length) {
            this.event.bookings.forEach(booking => {
              booking.ticketsData.forEach(ticketBooking => {
                if (this.soldTicketsIds.indexOf(ticketBooking.eventTicketId) === -1) {
                  this.soldTicketsIds.push(ticketBooking.eventTicketId)
                }
              })
            })
          }
          if (this.customTicketsDateRange.length) {
            this.customTicketsDateRange = this.mergeTicketsWithSameDateRange(this.customTicketsDateRange)
            this.customPricingByDateRangeEnabled = true
          }
          this.originPeriods = JSON.parse(JSON.stringify(this.event.periods))
          this.originRecurring = JSON.parse(JSON.stringify(this.event.recurring))

          if (this.event.recurring && this.event.recurring.cycle === 'monthly' && this.event.recurring.monthlyRepeat) this.monthlyRepeat = this.event.recurring.monthlyRepeat
          if (this.event.recurring && this.event.recurring.cycle === 'monthly' && this.event.recurring.monthlyOnRepeat) this.monthlyOnRepeat = this.event.recurring.monthlyOnRepeat
          if (this.event.recurring && this.event.recurring.cycle === 'monthly' && this.event.recurring.monthlyOnDay) this.monthlyOnDay = this.event.recurring.monthlyOnDay

          if (this.event.recurring && this.event.recurring.cycle === 'monthly' && this.event.recurring.monthlyRepeat === 'each') {
            if (!this.event.recurring.monthDate) {
              this.event.recurring.monthDate = moment(this.event.periods[0].range.start).toDate()
            } else {
              this.event.recurring.monthDate = moment(this.event.recurring.monthDate).toDate()
            }
          }

          if (this.event.periods[0].range && moment(this.event.periods[0].range.start).format('YYYY-MM-DD HH:mm:ss') === this.event.bookingCloses) this.event.bookingEndsAfter = true

          this.closeAfterMin = this.event.closeAfterMin !== null

          if (this.event.depositPayment === 'disabled') {
            this.depositEnabled = false
          } else {
            this.depositEnabled = true

            this.depositPayment = this.event.depositPayment
          }

          if (this.event.description !== null && this.event.description.startsWith('<!-- Content -->')) {
            this.event.descriptionHtml = this.event.description
          }

          this.mounted = true
          this.executeUpdate = false
          this.dialogLoading = false

          if (this.isCabinet) {
            this.activeColor = 'transparent'
          }
        }
      },

      getZoomUsers () {
        let config = null

        if (this.isCabinet) {
          config = Object.assign(this.getAuthorizationHeaderObject(), {params: {source: 'cabinet-' + this.$store.state.cabinet.cabinetType}})
        }

        this.$http.get(`${this.$root.getAjaxUrl}/zoom/users`, config)
          .then(response => {
            if ('data' in response.data && 'users' in response.data.data) {
              this.zoomUsers = response.data.data.users
            }
          })
          .catch(e => {
            this.notify(this.$root.labels.error, e.message, 'error')
          })
      },

      clearValidation () {
        if (typeof this.$refs.event !== 'undefined') {
          this.$refs.event.clearValidate()
        }
      },

      getParsedEntity (applyGlobally) {
        let eventPeriods = this.createEventPeriods()
        if (!this.originRecurring.until && this.event.isRecurring) applyGlobally = true

        let tags = []

        this.event.tags.forEach(function (tag) {
          tags.push({
            name: tag
          })
        })

        let eventSettings = this.prepareBookableEntityPaymentsForSave(JSON.parse(JSON.stringify(this.event.settings)))

        if (!this.depositEnabled) {
          this.event.depositPayment = 'disabled'
        } else {
          this.event.depositPayment = this.depositPayment
        }

        let monthDate = this.monthDate ? this.monthDate : (this.event.recurring.monthDate ? this.event.recurring.monthDate : null)

        let custTickets = this.customTickets.map(ticket => {
          return {
            id: ticket.id % 1 !== 0 ? null : ticket.id,
            name: ticket.name,
            price: ticket.price,
            spots: ticket.spots,
            waitingListSpots: ticket.waitingListSpots,
            enabled: ticket.enabled,
            dateRanges: [],
            translations: ticket.translations
          }
        })

        for (let i = 0; i < custTickets.length; i++) {
          for (let j = 0; j < this.customTicketsDateRange.length; j++) {
            if (this.customTicketsDateRange[j].tickets.map(ticket => ticket.name).includes(custTickets[i].name)) {
              let ticketToAdd = this.customTicketsDateRange[j].tickets.filter(tick => tick.name === custTickets[i].name)

              if (this.customTicketsDateRange[j].range && this.customTicketsDateRange[j].range.end && this.customTicketsDateRange[j].range.start) {
                custTickets[i].dateRanges.push({
                  enabled: ticketToAdd[0].enabled,
                  endDate: moment(this.customTicketsDateRange[j].range.end).format('YYYY-MM-DD'),
                  startDate: moment(this.customTicketsDateRange[j].range.start).format('YYYY-MM-DD'),
                  price: ticketToAdd[0].price
                })
              }
            }
          }
        }

        custTickets.forEach((ticket) => {
          ticket.dateRanges = JSON.stringify(ticket.dateRanges)
        })

        let providers = JSON.parse(JSON.stringify(this.event.providers))

        if (this.currentUser && this.currentUser.type === 'provider') {
          if (this.event.organizerId === this.currentUser.id) {
            const index = providers.map(p => p.id).indexOf(this.event.organizerId)
            if (index > -1) {
              providers.splice(index, 1)
            }
          } else {
            if (!providers.find(p => p.id === this.currentUser.id)) {
              let employee = this.employees.find(e => e.id === this.currentUser.id)
              providers.push(employee)
            }
          }
        }

        return {
          id: this.event.id,
          parentId: this.event.parentId,
          name: this.event.name,
          periods: eventPeriods,
          utc: this.selectedTimeZone === 'UTC',
          timeZone: this.selectedTimeZone === 'UTC' ? null : this.selectedTimeZone,
          bookingOpens: !this.event.bookingStartsNow ? this.getDateString(this.event.bookingStartsDate) + ' ' + this.event.bookingStartsTime + ':00' : null,
          bookingCloses: !this.event.bookingEndsAfter ? this.getDateString(this.event.bookingEndsDate) + ' ' + this.event.bookingEndsTime + ':00' : null,
          bookingOpensRec: this.event.bookingOpensRec,
          bookingClosesRec: this.event.bookingClosesRec,
          recurring: this.event.isRecurring && this.event.recurring ? {
            monthlyRepeat: this.monthlyRepeat,
            monthDate: this.monthlyRepeat === 'each' && monthDate ? this.getDateString(monthDate) + ' ' + this.getTimeString(eventPeriods[0].periodStart) + ':00' : null,
            monthlyOnRepeat: this.monthlyRepeat === 'on' ? this.monthlyOnRepeat : null,
            monthlyOnDay: this.monthlyRepeat === 'on' ? this.monthlyOnDay : null,
            cycleInterval: this.event.recurring.cycleInterval,
            cycle: this.event.recurring.cycle,
            order: this.event.recurring.order,
            until: this.event.recurring.until ? this.getDateString(this.event.recurring.until) + ' ' + this.getTimeString(this.event.recurring.until) + ':00' : null
          } : null,
          bringingAnyone: this.event.bringingAnyone,
          bookMultipleTimes: this.event.bookMultipleTimes,
          maxCapacity: this.event.maxCapacity,
          maxCustomCapacity: this.maxCustomCapacity ? this.maxCustomCapacityNum : null,
          maxExtraPeople: this.maxExtraPeopleEnabled ? this.event.maxExtraPeople : null,
          price: this.event.price,
          tags: tags,
          providers: providers,
          description: this.event.description,
          gallery: this.event.gallery,
          color: this.event.colorType === 1 ? this.event.selectedColor : this.event.customColor,
          show: this.event.show,
          locationId: this.event.locationId !== null ? this.event.locationId : null,
          customLocation: this.event.locationId === null ? this.event.customLocation : null,
          applyGlobally: applyGlobally,
          settings: JSON.stringify(eventSettings),
          zoomUserId: this.event.zoomUserId,
          translations: this.event.translations,
          deposit: this.event.deposit,
          depositPayment: this.event.depositPayment,
          depositPerPerson: this.event.depositPerPerson,
          fullPayment: this.event.fullPayment,
          customPricing: this.customPricingEnabled,
          organizerId: this.event.organizerId,
          closeAfterMin: this.closeAfterMin ? this.event.closeAfterMin : null,
          closeAfterMinBookings: this.event.closeAfterMinBookings,
          customTickets: custTickets,
          notifyParticipants: this.event.notifyParticipants,
          aggregatedPrice: this.event.aggregatedPrice
        }
      },

      errorCallback (responseData) {
        let $this = this

        setTimeout(function () {
          if ('message' in responseData) {
            $this.notify($this.$root.labels.error, responseData.message, 'error')
          }
        }, 200)
      },

      closeDialog () {
        this.$emit('closeDialog')
      },

      addEventDate () {
        this.event.periods.push({
          id: null,
          eventId: null,
          range: {
            start: new Date(),
            end: new Date()
          },
          startTime: null,
          endTime: null,
          bookings: []
        })
      },

      deleteEventDate (dateKey) {
        this.event.periods.splice(dateKey, 1)
      },

      changeEventColor (e) {
        this.event.colorType = 1

        Array.from(e.target.parentNode.children).forEach(function (sib) {
          if (sib.className.includes('color-active')) {
            sib.classList.remove('color-active')
          }
        })

        e.target.className = e.target.className + ' color-active'
        this.event.selectedColor = e.target.getAttribute('data-color')
      },

      showDialogTranslate (type, customTickets) {
        this.$emit('showDialogTranslate', type, typeof customTickets !== 'undefined' ? customTickets : [])
      },

      getCycleLabels () {
        let cycleLabel = ''
        switch (this.event.recurring.cycle) {
          case ('daily'):
            cycleLabel = 'day'
            break

          case ('weekly'):
            cycleLabel = 'week'
            break

          case ('monthly'):
            cycleLabel = 'month'
            break

          case ('yearly'):
            cycleLabel = 'year'
            break
        }
        if (this.event.recurring.cycleInterval && cycleLabel) {
          return this.event.recurring.cycleInterval > 1 ? this.$root.labels[cycleLabel + 's'].toLowerCase() : this.$root.labels[cycleLabel].toLowerCase()
        }
        return ''
      }
    },

    mounted () {
      if (this.isCabinet) {
        this.currentUser = this.$store.state.cabinet.clonedProfile
      } else {
        this.getCurrentUser()
      }
      this.instantiateDialog()

      if (this.$root.settings.zoom.enabled && !this.$root.licence.isLite && !this.$root.licence.isStarter) {
        this.getZoomUsers()
      }
    },

    updated () {
      this.instantiateDialog()
    },

    components: {
      LicenceBlock,
      LicenceBlockHeader,
      EntitySettings,
      DialogActions,
      ContentBlock,
      Money,
      Gallery
    },

    computed: {
      monthDateComp: {
        get: function () {
          if (this.event.recurring.monthDate) {
            return this.event.recurring.monthDate
          }
          if (!this.monthDate) {
            if (this.event && this.event.periods && this.event.periods[0] && this.event.periods[0].range) {
              this.monthDate = this.event.periods[0].range.start
            }
          }
          return this.monthDate
        },
        set: function (value) {
          this.monthDate = value
        }
      }
    }
  }
</script>
