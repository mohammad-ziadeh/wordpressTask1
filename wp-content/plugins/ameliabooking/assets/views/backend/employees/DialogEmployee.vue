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
    <div class="am-dialog-scrollable" :class="{'am-edit':employee.id !== 0}" v-if="employee && !dialogLoading">

      <!-- Dialog Header -->
      <div class="am-dialog-header">
        <el-row>
          <el-col :span="14">
            <h2 v-if="employee.id !== 0">{{ !$root.licence.isLite ? $root.labels.edit_employee : $root.labels.settings_employee }} </h2>
            <h2 v-else>{{ !$root.licence.isLite ? $root.labels.new_employee : $root.labels.settings_employee }}</h2>
          </el-col>
          <el-col :span="10" class="align-right">
            <el-button @click="closeDialog" class="am-dialog-close" size="small" icon="el-icon-close"></el-button>
          </el-col>
        </el-row>
      </div>

      <!-- Form -->
      <el-form :model="employee" ref="employee" :rules="rules" label-position="top" @submit.prevent="onSubmit">
        <el-tabs v-model="employeeTabs">

          <!-- Details -->
          <el-tab-pane :label="$root.labels.details" name="details">

            <!-- Profile Photo -->
            <div class="am-employee-profile">
              <picture-upload
                  :delete-icon-visibility="employee.pictureThumbPath && employee.pictureFullPath"
                  :edited-entity="this.employee"
                  :entity-name="'employee'"
                  v-on:pictureSelected="pictureSelected"
                  v-on:deleteImage="() => deleteImage(employee)"
              >
              </picture-upload>
              <h2>{{ employee.firstName }} {{ employee.lastName }}</h2>
              <span
                  v-if="typeof employee.activity !== 'undefined'"
                  class="am-employee-status-label"
                  :class="employee.activity"
              >
                {{ getEmployeeActivityLabel(employee.activity) }}
              </span>
            </div>

            <el-row :gutter="16">

              <el-col :sm="12">
                <div class="am-event-translate" @click="showDialogTranslate('firstName')" style="display: inline-block;float: right;cursor: pointer;">
                  <img class="am-dialog-translate-svg" width="16px" :src="$root.getUrl+'public/img/translate.svg'">
                  {{ $root.labels.translate }}
                </div>

                <!-- First Name -->
                <el-form-item :label="$root.labels.first_name + ':'" prop="firstName">
                  <el-input v-model="employee.firstName" auto-complete="off" @input="clearValidation()" @change="trimNames()"></el-input>
                </el-form-item>
              </el-col>
              <el-col :sm="12">
                <div class="am-event-translate" @click="showDialogTranslate('lastName')" style="display: inline-block;float: right;cursor: pointer;">
                  <img class="am-dialog-translate-svg" width="16px" :src="$root.getUrl+'public/img/translate.svg'">
                  {{ $root.labels.translate }}
                </div>

                <!-- Last Name -->
                <el-form-item :label="$root.labels.last_name + ':'" prop="lastName">
                  <el-input v-model="employee.lastName" auto-complete="off" @input="clearValidation()" @change="trimNames()"></el-input>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row :gutter="16">
              <el-col :sm="12">

                <!-- Email -->
                <el-form-item :label="$root.labels.email + ':'" prop="email" :error="errors.email">
                  <el-input
                    v-model="employee.email"
                    auto-complete="off"
                    :placeholder="$root.labels.email_placeholder"
                    @input="clearValidation()"
                  >
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :sm="12">

                <!-- Location -->
                <el-form-item :label="$root.labels.location + ':'" prop="locationId" v-if="locations.length">
                  <el-select
                      v-model="employee.locationId"
                      placeholder=""
                      @change="clearValidation()"
                  >
                    <el-option
                        v-for="location in filteredLocations"
                        :key="location.id"
                        :label="location.name"
                        :value="location.id"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row :gutter="16">
              <el-col :sm="12">

                <!-- WP User -->
                <el-form-item label="placeholder" v-if="$root.settings.capabilities.canWriteOthers === true">
                  <label slot="label">
                    {{ $root.labels.wp_user }}:
                    <el-tooltip placement="top">
                      <div slot="content" v-html="$root.labels.wp_user_employee_tooltip"></div>
                      <i class="el-icon-question am-tooltip-icon"></i>
                    </el-tooltip>
                  </label>
                  <el-select
                    v-model="employee.externalId"
                    ref="wpUser"
                    filterable
                    :placeholder="$root.labels.select_wp_user"
                    clearable
                    @change="clearValidation()"
                  >
                    <div class="am-drop">
                      <div class="am-drop-create-item" @click="selectCreateNewWPUser">
                        {{ $root.labels.create_new }}
                      </div>
                      <el-option
                        :class="{'hidden' : item.value === 0}"
                        v-for="item in formOptions.wpUsers"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      >
                      </el-option>
                    </div>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :sm="12">

                <!-- Phone -->
                <el-form-item :label="$root.labels.phone + ':'">
                  <phone-input
                    :countryPhoneIso="employee.countryPhoneIso"
                    :savedPhone="employee.phone"
                    @phoneFormatted="phoneFormatted"
                  >
                  </phone-input>
                </el-form-item>
              </el-col>
            </el-row>

            <!-- Set Employee Panel Password -->
            <el-row :gutter="16">
              <el-col v-if="$root.settings.roles.providerCabinet.enabled" :span="12">

                <!-- Password -->
                <el-form-item
                    v-if="this.$root.settings.role === 'admin' || this.$root.settings.role === 'manager'"
                    :label="$root.labels.employee_panel_password + ':'" prop="password"
                >
                  <!-- Hidden input to intercept autofill attempts -->
                  <input
                      type="password"
                      name="fakePassword"
                      autocomplete="new-password"
                      style="display: none;"
                      aria-hidden="true"
                  />
                  <el-input
                      v-model="employee.password"
                      auto-complete="off"
                      :placeholder="$root.labels.enter_employee_panel_password"
                      show-password
                      @input="clearValidation()"
                  >
                  </el-input>
                </el-form-item>
                <!-- /Password -->

                <!-- Send Email With New Password -->
                <el-form-item
                    v-if="this.$root.settings.role === 'admin' || this.$root.settings.role === 'manager'"
                    v-show="employee.password && employee.password.length > 0"
                >
                  <el-checkbox
                      v-model="employee.sendEmployeePanelAccessEmail"
                      @change="clearValidation()"
                  >
                    {{ $root.labels.send_employee_panel_access_email }}
                  </el-checkbox>
                </el-form-item>
                <!-- /Send Email With New Password -->

              </el-col>

              <el-col :span="$root.settings.roles.providerCabinet.enabled && !notInLicence() ? 12 : 24">
                <div class="am-cabinet-timezone">
                  <el-form-item
                    :class="licenceClass()"
                    label="placeholder"
                    v-if="$root.settings.capabilities.canWriteOthers === true || (this.$root.settings.role == 'provider' && employee.externalId)"
                    :label="$root.labels.timezone + ':'"
                  >
                    <el-select
                      v-model="employee.timeZone"
                      :disabled="notInLicence()"
                      filterable
                      clearable
                      popper-class="am-cabinet-timezone-dropdown"
                      :placeholder="$root.timezone"
                    >
                      <template slot="prefix">
                        <img :src="$root.getUrl + 'public/img/am-globe.svg'">
                      </template>
                      <el-option
                        v-for="(timeZone, index) in $root.timezones"
                        :key="index"
                        :label="timeZone"
                        :value="timeZone"
                      >
                      </el-option>
                    </el-select>

                    <LicenceBlock/>
                  </el-form-item>
                </div>
              </el-col>
            </el-row>

            <!-- Google Calendar -->
            <el-row
              v-if="$root.settings.googleCalendar.enabled && employee.id !== 0 && !$root.licence.isLite && !$root.licence.isStarter"
              :gutter="16"
            >
              <!-- Google Calendar List -->
              <el-form-item label="placeholder">
                <label slot="label" style="padding: 0 8px;">
                  {{ $root.labels.google_calendar }}:
                  <el-tooltip placement="top">
                    <div slot="content" v-html="$root.labels.google_calendar_tooltip"></div>
                    <i class="el-icon-question am-tooltip-icon"></i>
                  </el-tooltip>
                </label>

                <el-col :sm="15" :xs="24" style="padding: 0 8px;">

                  <el-select
                    v-model="employee.googleCalendar.calendarId"
                    placeholder=""
                    :disabled="!employee.googleCalendar.token || googleLoading"
                    @change="clearValidation()"
                  >
                    <el-option
                      v-for="calendar in employee.googleCalendar.calendarList"
                      :key="calendar.id"
                      :label="calendar.summary"
                      :value="calendar.id"
                    >
                    </el-option>
                  </el-select>

                </el-col>

                <!-- Google Calendar Connect Button -->
                <el-col :sm="9" :xs="24" style="padding: 0 8px;">
                  <el-button
                    class="am-google-calendar-button"
                    :class="{ 'connected': employee.googleCalendar.token }"
                    type="primary"
                    @click="!employee.googleCalendar.token ? redirectToGoogleAuthPage() : disconnectFromGoogleAccount()"
                  >
                    <div class="am-google-calendar-button-image">
                      <img class="" :src="$root.getUrl + 'public/img/google-button.svg'"/>
                    </div>
                    <span
                      class="am-google-calendar-button-text"
                      :class="{ 'connected': employee.googleCalendar.token }"
                    >
                      {{ !employee.googleCalendar.token ? $root.labels.google_sign_in : $root.labels.google_sign_out }}
                    </span>
                  </el-button>
                </el-col>

              </el-form-item>

            </el-row>
            <!-- /Google Calendar -->

            <!-- Outlook Calendar -->
            <el-row
              v-if="$root.settings.outlookCalendar.enabled && employee.id !== 0 && !$root.licence.isLite && !$root.licence.isStarter"
              :gutter="16"
            >

              <!-- Outlook Calendar List -->
              <el-form-item
                v-if="employee.outlookCalendar && employee.outlookCalendar.calendarList"
                label="placeholder"
              >

                <!-- Outlook Calendar Label -->
                <label slot="label" style="padding: 0 8px;">
                  {{ $root.labels.outlook_calendar }}:
                  <el-tooltip placement="top">
                    <div slot="content" v-html="$root.labels.outlook_calendar_tooltip"></div>
                    <i class="el-icon-question am-tooltip-icon"></i>
                  </el-tooltip>
                </label>
                <!-- /Outlook Calendar Label -->

                <!-- Outlook Calendar List Selectbox -->
                <el-col :sm="15" :xs="24" style="padding: 0 8px;">
                  <el-select
                    v-model="employee.outlookCalendar.calendarId"
                    placeholder=""
                    :disabled="!employee.outlookCalendar.token || outlookLoading"
                    @change="clearValidation()"
                  >
                    <el-option
                      v-for="calendar in employee.outlookCalendar.calendarList"
                      :key="calendar.id"
                      :label="calendar.name"
                      :value="calendar.id"
                    >
                    </el-option>
                  </el-select>
                </el-col>
                <!-- /Outlook Calendar List Selectbox -->

                <!-- Outlook Calendar Connect Button -->
                <el-col :sm="9" :xs="24" style="padding: 0 8px;">
                  <el-button
                    class="am-outlook-calendar-button"
                    :class="{ 'connected': employee.outlookCalendar.token }"
                    type="primary"
                    @click="!employee.outlookCalendar.token ? redirectToOutlookAuthPage() : disconnectFromOutlookAccount()"
                  >
                    <div class="am-outlook-calendar-button-image">
                      <img class="" :src="$root.getUrl + 'public/img/outlook-calendar.png'"/>
                    </div>
                    <span class="am-outlook-calendar-button-text">
                      {{ !employee.outlookCalendar.token ? $root.labels.outlook_sign_in : $root.labels.outlook_sign_out }}
                    </span>
                  </el-button>
                </el-col>
                <!-- /Outlook Calendar Connect Button -->

              </el-form-item>
              <!-- /Outlook Calendar List -->

            </el-row>
            <!-- /Outlook Calendar -->

            <!-- Apple Calendar -->
            <el-row
                v-if="$root.settings.appleCalendar && employee.id !== 0 && !$root.licence.isLite && !$root.licence.isStarter"
                :gutter="16"
            >
              <!-- Apple Calendar List -->
              <el-form-item label="placeholder">
                <label slot="label" style="padding: 0 8px;">
                  {{ $root.labels.apple_calendar }}:
                  <el-tooltip placement="top">
                    <div slot="content" v-html="$root.labels.apple_calendar_tooltip"></div>
                    <i class="el-icon-question am-tooltip-icon"></i>
                  </el-tooltip>
                </label>

                <el-col :sm="15" :xs="24" style="padding: 0 8px;">
                  <el-select
                      ref="appleCalendarSelect"
                      v-if="!employee.employeeAppleCalendar.iCloudId"
                      v-model="employee.appleCalendarId"
                      placeholder=""
                      :disabled="!$root.settings.appleCalendar || appleLoading"
                      @change="clearValidation()"
                  >
                    <div class="am-drop">
                      <div class="am-drop-create-item" @click="connectPersonalAppleCalendar">
                        {{ $root.labels.apple_connect_employee_calendar }}
                      </div>
                      <el-option
                          v-for="calendar in appleCalendarList"
                          :key="calendar.id"
                          :label="calendar.name"
                          :value="calendar.id"
                      >
                      </el-option>
                    </div>
                  </el-select>
                  <el-alert
                      v-else
                      :title="$root.labels.apple_calendar_overridden_by_employee"
                      type="warning"
                      :closable="false"
                      show-icon
                      style="height: 40px"
                  >
                  </el-alert>
                </el-col>
                <!-- /Apple Calendar List -->

                <!-- Apple Calendar Disconnect Button -->
                <el-col v-if="employee.appleCalendarId && !isEmployeeConnectedToPersonalAppleCalendar" :sm="9" :xs="24" style="padding: 0 8px;">
                  <el-button
                      class="am-google-calendar-button"
                      type="primary"
                      @click="disconnectFromAppleAccount()"
                  >
                    <div class="am-google-calendar-button-image">
                      <img class="" :src="$root.getUrl + 'public/img/apple-button.svg'"/>
                    </div>
                    <span class="am-google-calendar-button-text">
                      {{ $root.labels.apple_disconnect }}
                    </span>
                  </el-button>
                </el-col>
                <el-col v-if="isEmployeeConnectedToPersonalAppleCalendar" :sm="9" :xs="24" style="padding: 0 8px;">
                  <el-button
                      class="am-google-calendar-button"
                      type="primary"
                      @click="disconnectEmployeeFromAppleAccount()"
                  >
                    <div class="am-google-calendar-button-image">
                      <img class="" :src="$root.getUrl + 'public/img/apple-button.svg'"/>
                    </div>
                    <span class="am-google-calendar-button-text">
                      {{ $root.labels.apple_calendar_disconnect_employee }}
                    </span>
                  </el-button>
                </el-col>

                <!-- /Apple Calendar Disconnect Button -->

              </el-form-item>
            </el-row>
            <!-- /Apple Calendar -->

            <el-row :gutter="16">
              <!-- Zoom-->
              <el-col :sm="12" v-if="$root.settings.zoom.enabled && !$root.licence.isLite && !$root.licence.isStarter">
                <el-form-item label="placeholder" :label="$root.labels.zoom_user + ':'">
                <label slot="label">
                  {{ $root.labels.zoom_user }}:
                  <el-tooltip placement="top">
                    <div slot="content" v-html="$root.labels.zoom_user_tooltip"></div>
                    <i class="el-icon-question am-tooltip-icon"></i>
                  </el-tooltip>
                </label>

                <!-- Zoom Users List -->
                <el-select
                  clearable
                  filterable
                  v-model="employee.zoomUserId"
                  :placeholder="$root.labels.zoom_user_placeholder"
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

              </el-form-item>
              </el-col>
              <!-- /Zoom-->

              <!-- Badge -->
              <el-col :span="!notInLicence() ? 12 : 24">
                <el-form-item
                  label="placeholder"
                  v-if="$root.settings.capabilities.canWriteOthers === true"
                  :class="licenceClass()"
                >
                  <label slot="label">
                    {{ $root.labels.employee_badge }}:
                  </label>

                  <!-- Employee Badges List -->
                  <el-select
                    filterable
                    clearable
                    v-model="employee.badgeId"
                    :disabled="notInLicence()"
                    :placeholder="$root.labels.select_badge"
                  >
                    <div class="am-drop">
                      <el-option
                        v-for="badge in badges"
                        :key="badge.id"
                        :label="badge.content"
                        :value="badge.id"
                        class="am-employee-badge-option"
                      >
                        <span
                          :style="{backgroundColor: badge.color}"
                        >
                          {{ badge.content }}
                        </span>
                      </el-option>
                      <div
                        class="el-select-dropdown__item am-manage-employee-badges am-manage-badges-option"
                        @click="showDialogEmployeeBadges"
                      >
                        <img
                          class="am-manage-employee-badges-icon"
                          height="24px"
                          width="24px"
                          :src="$root.getUrl+'public/img/am-manage-badges.svg'"
                        >
                        {{ $root.labels.manage_badges }}
                      </div>
                    </div>
                    <template slot="empty" v-if="badges.length === 0">
                      <div
                          class="el-select-dropdown__item am-manage-employee-badges am-manage-badges-option"
                          @click="showDialogEmployeeBadges"
                      >
                        <img
                            class="am-manage-employee-badges-icon el-select-dropdown__empty"
                            height="24px"
                            width="24px"
                            :src="$root.getUrl+'public/img/am-manage-badges.svg'"
                        >
                        {{ $root.labels.manage_badges }}
                      </div>
                    </template>
                  </el-select>

                  <LicenceBlock/>
                </el-form-item>

              </el-col>
              <!-- /Badge -->
            </el-row>

            <el-row
              v-if="$root.settings.payments.stripe.enabled && $root.settings.payments.stripe.connect.enabled && $root.settings.role !== 'admin' && $root.settings.role !== 'manager'"
              :gutter="16"
            >
              <el-col :sm="24">
                <el-col class="am-cabinet-profile__stripe">
                  <cabinet-dashboard-stripe
                    :stripeProvider="stripeProvider"
                    :authorizationObject="{}"
                    :profile="employee"
                    @stripeDisconnect="stripeProvider = null"
                  />
                </el-col>
              </el-col>
            </el-row>

            <el-row
              v-if="$root.settings.payments.stripe.enabled && $root.settings.payments.stripe.connect.enabled && ($root.settings.role === 'admin' || $root.settings.role === 'manager')"
              :gutter="16"
            >
              <el-col :sm="24">
                <el-form-item label="placeholder">
                  <label slot="label">
                    {{ $root.labels.stripe_account }}:
                  </label>
                  <el-select
                    v-model="employee.stripeConnect.id"
                    filterable
                    :placeholder="$root.labels.stripe_account"
                    clearable
                    @change="changeStripeAccount"
                  >
                    <div class="am-drop">
                      <el-option
                        v-if="item.type === 'standard' || item.type === 'express'"
                        v-for="item in stripeProviders"
                        :key="item.id"
                        :label="item.email + ' (' + (item.type === 'standard' ? $root.labels.stripe_account_standard : $root.labels.stripe_account_express) + ')'"
                        :value="item.id"
                      >
                      </el-option>
                    </div>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row
              v-if="$root.settings.payments.stripe.enabled && $root.settings.payments.stripe.connect.enabled && ($root.settings.role === 'admin' || $root.settings.role === 'manager') && employee.stripeConnect.id"
              :gutter="16"
            >
              <el-col :sm="12">
                <!-- Stripe percentage price -->
                <el-form-item
                  :label="($root.settings.payments.stripe.connect.method === 'transfer' ? $root.labels.use_transfer_amount : $root.labels.use_direct_amount) + ':'"
                >
                  <el-input-number
                    v-model="employee.stripeConnect.amount"
                    class="am-stripe-amount"
                    :min="0"
                    :precision="2"
                    :step="0.1"
                    :max="100"
                    @input="clearValidation()"
                    @change="changeStripeConnectAmount"
                    :placeholder="employee.stripeConnect.amount ? employee.stripeConnect.amount.toString() : $root.settings.payments.stripe.connect.amount.toString()"
                  >
                  </el-input-number>
                </el-form-item>
              </el-col>
            </el-row>

            <div class="am-divider"></div>

            <!-- Description -->
            <content-block
              v-show="!hideDescription"
              :label="$root.labels.description"
              :entity="employee"
              textProperty="description"
              htmlProperty="descriptionHtml"
              :hasTranslation="true"
              :hasQuill="true"
              :textModeProp="true"
              :allowImage="true"
              @showDialogTranslate="showDialogTranslate('description')"
            >
            </content-block>

            <!-- Notes -->
            <el-form-item :label="$root.labels.note_internal + ':'">
              <el-input
                type="textarea"
                :autosize="{minRows: 4, maxRows: 6}"
                placeholder=""
                v-model="employee.note"
                @input="clearValidation()"
              >
              </el-input>
            </el-form-item>

          </el-tab-pane>

          <!-- Assigned Services -->
          <el-tab-pane
            v-if="$root.settings.capabilities.canWriteOthers === true || $root.settings.roles.allowConfigureServices === true"
            :label="$root.labels.assigned_services" name="services"
          >
            <assigned-services
              :week-schedule="editWeekDayList"
              :special-days="employee.specialDayList"
              :categorized-service-list="editCategorizedServiceList"
              :future-appointments="futureAppointments"
              :employee-id="employee.id"
              :mandatory-services-ids="employee.mandatoryServicesIds"
            />
          </el-tab-pane>

          <!-- Work Hours -->
          <el-tab-pane
            :label="$root.labels.work_hours" name="hours"
            v-if="$root.settings.capabilities.canWriteOthers === true || $root.settings.roles.allowConfigureSchedule === true"
          >
            <working-hours
              :active-tab="employeeTabs"
              :week-schedule="editWeekDayList"
              :categorized-service-list="editCategorizedServiceList"
              :locations="locations"
            >
            </working-hours>
          </el-tab-pane>

          <!-- Days Off -->
          <el-tab-pane
            :label="$root.labels.days_off" name="off"
            v-if="$root.settings.capabilities.canWriteOthers === true || $root.settings.roles.allowConfigureDaysOff === true"
          >
            <div class="am-days-off">
              <div class="am-employee-days-off">
                <days-off
                  @changeDaysOff="changeDaysOff"
                  @showCompanyDaysOffSettingsDialog="showCompanyDaysOffSettingsDialog"
                  :daysOff="employee.dayOffList"
                  :listedDaysOff="companyDaysOff"
                >
                </days-off>
              </div>
            </div>
          </el-tab-pane>

          <!-- Special Days -->
          <el-tab-pane
              :label="$root.labels.special_days" name="special"
              v-if="$root.settings.capabilities.canWriteOthers === true || $root.settings.roles.allowConfigureSpecialDays === true"
          >
            <div class="am-special-days">
              <special-days
                  @changeSpecialDays="changeSpecialDays"
                  :active-tab="employeeTabs"
                  :specialDays="employee.specialDayList"
                  :locations="locations"
                  :categorizedServiceList="editCategorizedServiceList">
              </special-days>
            </div>
          </el-tab-pane>

          <!-- Employee Personal Apple Calendar -->
          <el-tab-pane
            v-if="$root.settings.appleCalendar && employee.id !== 0 && !$root.licence.isLite && !$root.licence.isStarter"
            :label="$root.labels.apple_calendar"
            name="apple"
          >

            <!-- Apple Calendar -->
            <el-row
              :gutter="16"
            >
              <!-- Apple Calendar List -->
              <el-form-item>
                <el-col :sm="15" :xs="24" style="padding: 0 8px;">
                  <el-form-item :label="$root.labels.apple_client_id + ':'">
                    <el-input
                      v-model="employee.employeeAppleCalendar.iCloudId"
                      :disabled="isEmployeeConnectedToPersonalAppleCalendar"
                      auto-complete="off"
                      :placeholder="$root.labels.enter_employee_icloud_id"
                      @input="clearValidation()"
                    >
                    </el-input>
                  </el-form-item>

                  <el-form-item :label="$root.labels.apple_app_specific_password + ':'">
                    <el-input
                      v-model="employee.employeeAppleCalendar.appSpecificPassword"
                      :disabled="isEmployeeConnectedToPersonalAppleCalendar"
                      auto-complete="off"
                      :placeholder="$root.labels.enter_employee_app_specific_pass"
                      @input="clearValidation()"
                    >
                    </el-input>
                  </el-form-item>

                  <el-button
                      class="am-apple-calendar-button"
                      :class="{ 'connected': isEmployeeConnectedToPersonalAppleCalendar }"
                      style="margin-bottom: 16px;"
                      type="primary"
                      @click="!isEmployeeConnectedToPersonalAppleCalendar ? connectEmployeeToAppleAccount() : disconnectEmployeeFromAppleAccount()"
                  >
                    <div class="am-apple-calendar-button-image">
                      <img class="" :src="$root.getUrl + 'public/img/apple-button.svg'"/>
                    </div>
                    <span
                        class="am-apple-calendar-button-text"
                        :class="{ 'connected': isEmployeeConnectedToPersonalAppleCalendar }"
                    >
                    {{ !isEmployeeConnectedToPersonalAppleCalendar ? $root.labels.apple_connect : $root.labels.apple_disconnect }}
                  </span>
                  </el-button>
                </el-col>

                <el-col :sm="15" :xs="24" style="padding: 0 8px;">
                  <el-form-item :label="$root.labels.apple_calendar_select + ':'">
                    <el-select
                        v-model="employee.appleCalendarId"
                        placeholder=""
                        :disabled="!isEmployeeConnectedToPersonalAppleCalendar || appleLoading"
                        @change="clearValidation()"
                    >
                      <div class="am-drop">
                        <el-option
                            v-for="calendar in appleCalendarList"
                            :key="calendar.id"
                            :label="calendar.name"
                            :value="calendar.id"
                        >
                        </el-option>
                      </div>
                    </el-select>
                  </el-form-item>
                </el-col>
                <!-- /Apple Calendar List -->

              </el-form-item>
            </el-row>
            <!-- /Apple Calendar -->

          </el-tab-pane>
          <!-- /Employee Personal Apple Calendar -->

        </el-tabs>

      </el-form>
    </div>

    <!-- Dialog Actions -->
    <dialog-actions
        v-if="employee && !dialogLoading"
        formName="employee"
        urlName="users/providers"
        :isNew="employee.id === 0"
        :entity="employee"
        :getParsedEntity="getParsedEntity"
        @errorCallback="errorCallback"
        @validationFailCallback="validationFailCallback"
        :hasIcons="true"
        :updateStash="true"

        :status="{
          on: 'visible',
          off: 'hidden'
        }"

        :buttonText="{
          confirm: {
            status: {
              yes: employee.status === 'visible' ? $root.labels.visibility_hide : $root.labels.visibility_show,
              no: $root.labels.visibility_show
            }
          }
        }"

        :action="{
          haveAdd: true,
          haveEdit: true,
          haveStatus: $root.settings.capabilities.canWriteOthers === true && !$root.licence.isLite,
          haveRemove: $root.settings.capabilities.canDelete === true && !$root.licence.isLite,
          haveRemoveEffect: true,
          haveDuplicate: $root.settings.capabilities.canWriteOthers === true && !$root.licence.isLite
        }"

        :message="{
          success: {
            save: $root.labels.employee_saved,
            remove: $root.labels.employee_deleted,
            show: $root.labels.employee_visible,
            hide: $root.labels.employee_hidden
          },
          confirm: {
            remove: $root.labels.confirm_delete_employee,
            show: $root.labels.confirm_show_employee,
            hide: $root.labels.confirm_hide_employee,
            duplicate: $root.labels.confirm_duplicate_employee
          }
        }"
    >
    </dialog-actions>

  </div>
</template>

<script>
  import AssignedServices from '../../parts/assignedServices/AssignedServices'
  import CabinetDashboardStripe from '../../frontend/cabinet/dashboard/stripe/CabinetDashboardStripe'
  import DaysOff from '../parts/DaysOff.vue'
  import WorkingHours from '../parts/WorkingHours.vue'
  import SpecialDays from '../parts/SpecialDays.vue'
  import DialogActions from '../parts/DialogActions.vue'
  import PhoneInput from '../../parts/PhoneInput.vue'
  import { Money } from 'v-money'
  import PictureUpload from '../parts/PictureUpload.vue'
  import licenceMixin from '../../../js/common/mixins/licenceMixin'
  import imageMixin from '../../../js/common/mixins/imageMixin'
  import dateMixin from '../../../js/common/mixins/dateMixin'
  import durationMixin from '../../../js/common/mixins/durationMixin'
  import notifyMixin from '../../../js/backend/mixins/notifyMixin'
  import priceMixin from '../../../js/common/mixins/priceMixin'
  import employeeMixin from '../../../js/common/mixins/employeeMixin'
  import googleMixin from '../../../js/frontend/mixins/googleMixin'
  import outlookMixin from '../../../js/frontend/mixins/outlookMixin'
  import ContentBlock from '../parts/ContentBlock'

  export default {
    mixins: [
      licenceMixin,
      imageMixin,
      dateMixin,
      durationMixin,
      notifyMixin,
      priceMixin,
      employeeMixin,
      outlookMixin,
      googleMixin
    ],

    props: {
      locations: null,
      employee: null,
      editCategorizedServiceList: null,
      editWeekDayList: null,
      companyDaysOff: null,
      futureAppointments: null
    },

    data () {
      return {
        badges: [],
        hideDescription: true,
        appointmentsServices: [],
        dialogLoading: true,
        employeeTabs: 'details',
        errors: {
          email: ''
        },
        executeUpdate: true,
        formOptions: {
          wpUsers: []
        },
        googleAuthURL: '',
        outlookAuthURL: '',
        googleLoading: false,
        outlookLoading: false,
        appleLoading: false,
        appleCalendarList: [],
        zoomUsers: [],
        stripeLoading: false,
        stripeProvider: null,
        stripeProviders: null,
        isStripeConnectAmountDefault: false,
        isEmployeeConnectedToPersonalAppleCalendar: false,
        rules: {
          firstName: [
            {required: true, message: this.$root.labels.enter_first_name_warning, trigger: 'submit'}
          ],
          lastName: [
            {required: true, message: this.$root.labels.enter_last_name_warning, trigger: 'submit'}
          ],
          email: [
            {required: true, message: this.$root.labels.enter_email_warning, trigger: 'submit'},
            {type: 'email', message: this.$root.labels.enter_valid_email_warning, trigger: 'submit'}
          ],
          locationId: [
            {
              required: this.visibleLocations().length > 0,
              message: this.$root.labels.enter_location_warning,
              trigger: 'blur'
            }
          ],
          password: [
            {min: 4, max: 128, message: this.$root.labels.new_password_length, trigger: 'submit'}
          ]
        },
      }
    },

    created () {
      this.instantiateDialog()
      setTimeout(() => {
        this.hideDescription = false
      }, 500)

      this.badges = this.$root.settings.roles.providerBadges.badges
    },

    updated () {
      this.instantiateDialog()
    },

    methods: {
      showDialogEmployeeBadges () {
        this.$emit('showDialogEmployeeBadges')
      },

      showDialogTranslate (type) {
        this.$emit('showDialogTranslate', type)
      },

      instantiateDialog () {
        if ((this.employee !== null || (this.employee !== null && this.employee.id === 0)) && this.executeUpdate === true) {
          if (this.$root.settings.capabilities.canWriteOthers) {
            if (this.employee.id !== 0) {
              this.getWPUsers(this.employee.externalId)
            } else {
              this.getWPUsers(0)
            }
          }

          // Send request for Google Authorization URL if token is not already set
          if (!this.$root.licence.isLite && !this.$root.licence.isStarter && !this.employee.googleCalendar.token) {
            this.getGoogleAuthURL(false)
          }

          if (!this.$root.licence.isLite && !this.$root.licence.isStarter && !this.employee.outlookCalendar.token) {
            this.getOutlookAuthURL(false)
          }

          let locations = this.visibleLocations()

          if (locations.length === 1) {
            this.employee.locationId = locations[0].id
          }

          if (this.$root.settings.zoom.enabled && !this.$root.licence.isLite && !this.$root.licence.isStarter) {
            this.getZoomUsers()
          }

          if (this.$root.settings.appleCalendar && !this.$root.licence.isLite && !this.$root.licence.isStarter) {
            this.getAppleCalendarList()
          }

          if (!this.employee.stripeConnect) {
            this.employee.stripeConnect = {
              id: null,
              amount: null
            }
          }

          this.isEmployeeConnectedToPersonalAppleCalendar = true

          if (!this.employee.employeeAppleCalendar || this.employee.employeeAppleCalendar.iCloudId === null || this.employee.employeeAppleCalendar.appSpecificPassword === null) {
            this.isEmployeeConnectedToPersonalAppleCalendar = false
            this.employee.employeeAppleCalendar = {
              iCloudId: null,
              appSpecificPassword: null
            }
          }

          if (this.$root.settings.payments.stripe.enabled && this.$root.settings.payments.stripe.connect.enabled) {
            if (this.$root.settings.role === 'admin' || this.$root.settings.role === 'manager') {
              if (this.employee.stripeConnect.amount === null) {
                this.isStripeConnectAmountDefault = true
              }

              this.getStripeProviders()
            }

            if (this.$root.settings.role !== 'admin' && this.$root.settings.role !== 'manager') {
              this.getStripeProvider()
            }
          }

          if (this.employee.id in this.futureAppointments) {
            this.appointmentsServices = this.futureAppointments[this.employee.id]
          }

          this.$set(this.employee, 'sendEmployeePanelAccessEmail', true)

          // Remove loading when employee is connected to google calendar
          if (!this.$root.settings.capabilities.canWriteOthers) {
            this.dialogLoading = false
            this.inlineDialogEmployeeSVG()
          }

          if (this.employee.description !== null && this.employee.description.startsWith('<!-- Content -->')) {
            this.employee.descriptionHtml = this.employee.description
          }

          this.executeUpdate = false
        }
      },

      checkCapacityLimits (item) {
        this.clearValidation()
        if (item.minCapacity > item.maxCapacity) {
          item.maxCapacity = item.minCapacity
        }
      },

      validationFailCallback () {
        this.employeeTabs = 'details'
      },

      errorCallback (responseData) {
        let $this = this

        $this.errors.email = ''

        setTimeout(function () {
          $this.errors.email = responseData
          $this.employeeTabs = 'details'
        }, 200)
      },

      closeDialog () {
        this.$emit('closeDialog')
      },

      trimNames () {
        this.employee.firstName = this.employee.firstName.trim()
        this.employee.lastName = this.employee.lastName.trim()
      },

      getParsedEntity () {
        this.employee.serviceList = this.getParsedServiceList(this.editCategorizedServiceList)
        this.employee.weekDayList = this.getParsedWeekDayList(this.editWeekDayList)

        this.trimNames()

        let employee = JSON.parse(JSON.stringify(this.employee))

        employee.serviceList.forEach((item) => {
          item.customPricing = this.getJsonCustomPricing(item.customPricing)
        })

        if (this.employee.employeeAppleCalendar.iCloudId === null && this.employee.employeeAppleCalendar.appSpecificPassword === null) {
          employee.employeeAppleCalendar = null
        }

        if (this.employee.stripeConnect.id === '' || this.employee.stripeConnect.id === null) {
          employee.stripeConnect = null
        } else if (employee.stripeConnect.amount === '' || this.isStripeConnectAmountDefault) {
          employee.stripeConnect.amount = null
        }

        return employee
      },

      changeStripeConnectAmount () {
        this.isStripeConnectAmountDefault =
            typeof this.employee.stripeConnect.amount === 'undefined' ||
            this.employee.stripeConnect.amount === '' ||
            this.employee.stripeConnect.amount === null
      },

      setStripeConnectAmount () {
        if (this.isStripeConnectAmountDefault || this.employee.stripeConnect.amount === null || this.employee.stripeConnect.amount === '') {
          let elements = document.getElementsByClassName('am-stripe-amount')

          for (let i = 0; i < elements.length; i++) {
            elements[i].getElementsByClassName('el-input__inner')[0].value = ''
          }

          this.employee.stripeConnect.amount = null
        } else {
          this.isStripeConnectAmountDefault = false
        }
      },

      changeStripeAccount () {
        setTimeout(
          () => {
            this.setStripeConnectAmount()
          },
          200
        )
      },

      getStripeProvider () {
        this.stripeLoading = true

        this.$http.get(`${this.$root.getAjaxUrl}/stripe/accounts/` + this.employee.id,
          {},
          {}
        ).then(response => {
          if (response.data.data.account) {
            this.stripeLoading = false
            this.stripeProvider = response.data.data.account
          }
        }).catch(e => {
        })
      },

      getStripeProviders () {
        this.stripeLoading = true

        this.$http.get(`${this.$root.getAjaxUrl}/stripe/accounts`,
          {},
          {}
        ).then(response => {
          if (response.data.data.accounts) {
            this.stripeLoading = false
            this.stripeProviders = response.data.data.accounts
          }

          this.setStripeConnectAmount()
        }).catch(e => {
        })
      },

      changeDaysOff (data) {
        this.clearValidation()
        this.employee.dayOffList = data
      },

      changeSpecialDays (specialDay, index) {
        if (index === null) {
          this.employee.specialDayList.push(specialDay)
        } else {
          this.employee.specialDayList[index] = specialDay
        }
      },

      phoneFormatted (phone, countryPhoneIso) {
        this.clearValidation()
        this.employee.phone = phone
        this.employee.countryPhoneIso = countryPhoneIso
      },

      pictureSelected (pictureFullPath, pictureThumbPath) {
        this.employee.pictureFullPath = pictureFullPath
        this.employee.pictureThumbPath = pictureThumbPath
      },

      getWPUsers (currentId) {
        this.$http.get(`${this.$root.getAjaxUrl}/users/wp-users`, {
          params: {
            id: currentId,
            role: 'provider'
          }
        }).then(response => {
          this.formOptions.wpUsers = response.data.data.users
          this.formOptions.wpUsers.unshift({'value': 0, 'label': this.$root.labels.create_new})

          if (this.formOptions.wpUsers.map(user => user.value).indexOf(this.employee.externalId) === -1) {
            this.employee.externalId = ''
          }

          this.dialogLoading = false
          this.inlineDialogEmployeeSVG()
        })
      },

      visibleLocations () {
        return this.locations.filter(location => location.status === 'visible' || (this.employee && location.status === 'hidden' && location.id === this.employee.locationId))
      },

      showCompanyDaysOffSettingsDialog () {
        this.$emit('showCompanyDaysOffSettingsDialog')
      },

      clearValidation () {
        if (typeof this.$refs.employee !== 'undefined') {
          this.$refs.employee.clearValidate()
        }
      },

      selectCreateNewWPUser () {
        this.employee.externalId = 0
        this.$refs.wpUser.blur()
      },

      getGoogleAuthURL (inlineSVG) {
        if (this.employee.id && this.$root.settings.googleCalendar.enabled) {
          this.$http.get(`${this.$root.getAjaxUrl}/google/authorization/url/` + this.employee.id)
            .then(response => {
              this.googleAuthURL = response.data.data.authUrl
              this.googleLoading = false
              this.dialogLoading = false

              if (inlineSVG) {
                this.inlineDialogEmployeeSVG()
              }
            })
            .catch(e => {
              this.notify(this.$root.labels.error, e.message, 'error')
            })
        }
      },

      getOutlookAuthURL (inlineSVG) {
        if (this.employee.id && this.$root.settings.outlookCalendar.enabled) {
          this.$http.get(`${this.$root.getAjaxUrl}/outlook/authorization/url/` + this.employee.id)
            .then(response => {
              this.outlookAuthURL = response.data.data.authUrl
              this.outlookLoading = false
              this.dialogLoading = false

              if (inlineSVG) {
                this.inlineDialogEmployeeSVG()
              }
            })
            .catch(e => {
              this.notify(this.$root.labels.error, e.message, 'error')
            })
        }
      },

      getZoomUsers () {
        this.$http.get(`${this.$root.getAjaxUrl}/zoom/users`)
          .then(response => {
            if ('data' in response.data && 'users' in response.data.data) {
              this.zoomUsers = response.data.data.users
            }
          })
          .catch(e => {
            this.notify(this.$root.labels.error, e.message, 'error')
          })
      },

      redirectToGoogleAuthPage () {
        this.googleLoading = true
        window.location.href = this.googleAuthURL
      },

      redirectToOutlookAuthPage () {
        this.outlookLoading = true
        window.location.href = this.outlookAuthURL
      },

      disconnectFromGoogleAccount () {
        this.googleLoading = true

        this.$http.post(
          `${this.$root.getAjaxUrl}/google/disconnect/` + this.employee.id
        ).then(() => {
          this.employee.googleCalendar = {
            calendarId: null,
            calendarList: []
          }

          this.getGoogleAuthURL(true)
        }).catch(e => {
          this.notify(this.$root.labels.error, e.message, 'error')
        })
      },

      disconnectFromOutlookAccount () {
        this.outlookLoading = true

        this.$http.post(
          `${this.$root.getAjaxUrl}/outlook/disconnect/` + this.employee.id
        ).then(() => {
          this.employee.outlookCalendar = {
            calendarId: null,
            calendarList: []
          }

          this.getOutlookAuthURL(true)
        }).catch(e => {
          this.notify(this.$root.labels.error, e.message, 'error')
        })
      },

      inlineDialogEmployeeSVG () {
        let $this = this
        setTimeout(function () {
          $this.inlineSVG()
        }, 10)
      },

      getAppleCalendarList () {
        this.appleLoading = true

        this.$http.get(
          `${this.$root.getAjaxUrl}/apple/calendar-list/` + this.employee.id
        ).then((response) => {
          this.appleCalendarList = response.data.data.calendarList
          const found = this.appleCalendarList.find(
              (calendar) => calendar.id === this.employee.appleCalendarId
          );
          if (!found) {
            this.$set(this.employee, 'appleCalendarId', null)
          }
          this.isEmployeeConnectedToPersonalAppleCalendar = response.data.data.isEmployeeConnectedToPersonalAppleCalendar

          this.employee.appleCalendarId = response.data.data.appleCalendarId
          this.appleLoading = false
        }).catch(e => {
          this.notify(this.$root.labels.error, e.message, 'error')
          this.appleLoading = false
        })
      },

      disconnectFromAppleAccount () {
        this.appleLoading = true
        this.$http.post(
            `${this.$root.getAjaxUrl}/apple/disconnect/` + this.employee.id
        ).then(() => {
          this.$set(this.employee, 'appleCalendarId', null)
          this.appleLoading = false
        }).catch(e => {
          this.notify(this.$root.labels.error, e.message, 'error')
          this.appleLoading = false
        })
      },

      connectPersonalAppleCalendar () {
        this.employeeTabs = 'apple'
        this.$refs.appleCalendarSelect.blur()
      },

      connectEmployeeToAppleAccount () {
        this.appleLoading = true
        this.$http.post(
            `${this.$root.getAjaxUrl}/apple/connect/` + this.employee.id, {
              employeeAppleCalendar: this.employee.employeeAppleCalendar
            }
        ).then((response) => {
          this.appleLoading = false
          this.isEmployeeConnectedToPersonalAppleCalendar = response.data.data.isEmployeeConnectedToPersonalAppleCalendar
          this.getAppleCalendarList()
          this.notify(this.$root.labels.success, response.data.message, 'success')
        }).catch(e => {
          if(e.response.data.message) {
            this.notify(this.$root.labels.error, e.response.data.message, 'error')
          } else {
            this.notify(this.$root.labels.error, e.message, 'error')
          }
        })
      },

      disconnectEmployeeFromAppleAccount () {
        this.appleLoading = true
        this.$http.post(
            `${this.$root.getAjaxUrl}/apple/disconnect-employee/` + this.employee.id
        ).then((response) => {
          this.$set(this.employee, 'appleCalendarId', null)
          this.$set(this.employee, 'employeeAppleCalendar', null)
          this.employee.employeeAppleCalendar = {
            iCloudId: null,
            appSpecificPassword: null
          }
          this.isEmployeeConnectedToPersonalAppleCalendar = response.data.data.isEmployeeConnectedToPersonalAppleCalendar
          this.getAppleCalendarList()
          this.notify(this.$root.labels.success, response.data.message, 'success')
          this.appleLoading = false
        }).catch(e => {
          this.notify(this.$root.labels.error, e.message, 'error')
          this.appleLoading = false
        })
      }
    },

    computed: {
      filteredLocations () {
        return this.visibleLocations()
      }
    },

    components: {
      AssignedServices,
      CabinetDashboardStripe,
      PhoneInput,
      PictureUpload,
      DaysOff,
      WorkingHours,
      SpecialDays,
      DialogActions,
      Money,
      ContentBlock
    }
  }
</script>
