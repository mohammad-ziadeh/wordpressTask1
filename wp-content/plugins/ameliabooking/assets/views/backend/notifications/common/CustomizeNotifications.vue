<template>
  <div>

    <!-- Customize Notifications -->
    <el-row class="am-customize-notifications">

      <!-- User Type Tabs -->
      <el-col :md="8" class="">
        <div class="am-section am-gray-section">
          <el-tabs v-model="userTypeTab" @tab-click="onChangeUserTypeTab" :active-name="notification.sendTo">

            <!-- To Customer -->
            <el-tab-pane :label="$root.labels.to_customer" name="customer">
              <div v-for="entity in ['appointment', 'event', 'customer_other_notifications']"
                   class="am-email-notification-buttons">

                <div class="am-email-notification-labels">
                  {{$root.labels[entity]}} {{$root.labels.notifications}}
                </div>

                <!-- Create Notification Button -->
                <div
                  v-if="notInLicence() ? licenceVisible() : true"
                  class="am-button-checkbox"
                  :class="entity !== 'customer_other_notifications' && notInLicence() ? licenceClass() : {}"
                >

                  <el-button
                      size="large"
                      class='am-active-create'
                      style="position:relative;"
                      @click="createNew(entity, true)"
                      v-if="entity !== 'customer_other_notifications'"
                      :disabled="notInLicence()"
                  >
                    <img :src="$root.getUrl+'public/img/am-plus.svg'" style="position: absolute; left:16px"/>
                    {{ $root.labels.create_notification }}
                  </el-button>

                  <LicenceBlock
                    v-if="entity !== 'customer_other_notifications' && notInLicence()"
                  >
                  </LicenceBlock>
                </div>
                <!-- /Create Notification Button -->

                <!-- Customer's Notifications -->
                <div
                  v-for="(item, index) in customerNotifications(entity)"
                  v-if="visibleNotification(item.name)"
                  :class="getUnavailableNotificationLicence(item.name) ? licenceClass(getUnavailableNotificationLicence(item.name)) : {}"
                  :style="{marginTop: '24px'}"
                >
                  <div
                    class="am-button-checkbox"
                    :style="{marginTop: disabledNotification(item.name) ? '0px' : ''}"
                  >
                  <!-- Customer's Notification Button -->
                  <el-button
                      :disabled="disabledNotification(item.name)"
                      size="large"
                      :key="index"
                      @click="getNotification(item.id)"
                      :class="{ 'am-active': item.id === notification.id && showActiveClass, 'text-margin': item.customName && (item.time || item.timeBefore || item.timeAfter) }"
                  >
                    {{ item.customName ? item.customName : $root.labels[item.name] }}
                  </el-button>
                  <!-- /Customer's Notification Button -->

                  <!-- Customer's Notification Status Checkbox -->
                  <el-checkbox
                      v-model="item.status"
                      :disabled="disabledNotification(item.name)"
                      @change="changeNotificationStatus(item)"
                      true-label="enabled"
                      false-label="disabled"
                  >
                  </el-checkbox>
                  <!-- /Customer's Notification Status Checkbox -->

                  <!-- Customer's Notification Tooltip For Custom Notifications -->
                  <el-tooltip
                      v-if="item.customName"
                      class="item"
                      effect="dark"
                      :content="$root.labels.custom_notification"
                      placement="top"
                  >
                    <span class="am-cron-icon" :class="{ 'active': item.id === notification.id && showActiveClass , 'right': item.time || item.timeBefore || item.timeAfter }">
                      <img class="svg-amelia" :src="$root.getUrl+'public/img/am-edit-notification.svg'"/>
                    </span>
                  </el-tooltip>
                  <!-- /Customer's Notification Tooltip For Custom Notifications -->

                  <!-- Customer's Notification Tooltip For Scheduled Notifications -->
                  <el-tooltip
                      v-if="(item.time && item.time !== '00:00:00') || item.timeBefore || item.timeAfter"
                      class="item"
                      effect="dark"
                      :content="$root.labels.requires_scheduling_setup"
                      placement="top"
                  >
                    <span class="am-cron-icon" :class="{ 'active': item.id === notification.id && showActiveClass }">
                      <img class="svg-amelia" :src="$root.getUrl+'public/img/cron-job.svg'"/>
                    </span>
                  </el-tooltip>
                  <!-- /Customer's Notification Tooltip For Scheduled Notifications -->
                  </div>

                  <LicenceBlock
                    v-if="getUnavailableNotificationLicence(item.name)"
                    :licence="getUnavailableNotificationLicence(item.name)"
                  >
                  </LicenceBlock>

                </div>
                <!-- /Customer's Notification -->

              </div>
            </el-tab-pane>
            <!-- /To Customer -->

            <!-- To Employee -->
            <el-tab-pane :label="$root.labels.to_employee" name="provider">
              <div
                  v-for="entity in ['appointment', 'event', 'provider_other_notifications']"
                  class="am-email-notification-buttons"
              >

                <div class="am-email-notification-labels">
                  {{$root.labels[entity]}} {{$root.labels.notifications}}
                </div>

                <!-- Create Notification Button -->
                <div
                  v-if="notInLicence() ? licenceVisible() : true"
                  class="am-button-checkbox"
                  :class="entity !== 'provider_other_notifications' && notInLicence() ? licenceClass() : {}"
                >

                  <el-button
                      size="large"
                      class='am-active-create'
                      style="position:relative;"
                      @click="createNew(entity, false)"
                      v-if="entity !== 'provider_other_notifications'"
                      :disabled="notInLicence()"
                  >
                    <img :src="$root.getUrl+'public/img/am-plus.svg'" style="position: absolute; left:16px"/>
                    {{ $root.labels.create_notification }}
                  </el-button>

                  <LicenceBlock
                    v-if="entity !== 'provider_other_notifications' && notInLicence()"
                  >
                  </LicenceBlock>
                </div>
                <!-- /Create Notification Button -->

                <!-- Employee's Notifications -->
                <div
                  v-for="(item, index) in employeeNotifications(entity)"
                  v-if="visibleNotification(item.name)"
                  :class="getUnavailableNotificationLicence(item.name) ? licenceClass(getUnavailableNotificationLicence(item.name)) : {}"
                  :style="{marginTop: '24px'}"
                >
                  <div
                    class="am-button-checkbox"
                    :style="{marginTop: disabledNotification(item.name) ? '0px' : ''}"
                  >
                  <!-- Employee's Notification Button -->
                  <el-button
                      :disabled="disabledNotification(item.name)"
                      size="large"
                      :key="index"
                      @click="getNotification(item.id)"
                      :class="{ 'am-active': item.id === notification.id && showActiveClass, 'text-margin': item.customName && (item.time || item.timeBefore || item.timeAfter) }"
                  >
                    {{ item.customName ? item.customName : $root.labels[item.name] }}
                  </el-button>
                  <!-- /Employee's Notification Button -->

                  <!-- Employee's Notification Status Checkbox -->
                  <el-checkbox
                      v-model="item.status"
                      :disabled="disabledNotification(item.name)"
                      @change="changeNotificationStatus(item)"
                      true-label="enabled"
                      false-label="disabled"
                  >
                  </el-checkbox>
                  <!-- /Employee's Notification Status Checkbox -->

                  <!-- Employee's Notification Tooltip For Custom Notifications -->
                  <el-tooltip
                      v-if="item.customName"
                      class="item"
                      effect="dark"
                      :content="$root.labels.custom_notification"
                      placement="top"
                  >
                    <span class="am-cron-icon" :class="{ 'active': item.id === notification.id && showActiveClass , 'right': item.time || item.timeBefore || item.timeAfter }">
                      <img class="svg-amelia" :src="$root.getUrl+'public/img/am-edit-notification.svg'"/>
                    </span>
                  </el-tooltip>
                  <!-- /Employee's Notification Tooltip For Custom Notifications -->

                  <!-- Employee's Notification Tooltip For Scheduled Notifications -->
                  <el-tooltip
                      v-if="item.time || item.timeBefore || item.timeAfter"
                      class="item"
                      effect="dark"
                      :content="$root.labels.requires_scheduling_setup"
                      placement="top"
                  >
                    <span class="am-cron-icon" :class="{ 'active': item.id === notification.id }">
                      <img class="svg-amelia" :src="$root.getUrl+'public/img/cron-job.svg'"/>
                    </span>
                  </el-tooltip>
                  <!-- /Employee's Notification Tooltip For Scheduled Notifications -->
                  </div>

                  <LicenceBlock
                    v-if="getUnavailableNotificationLicence(item.name)"
                    :licence="getUnavailableNotificationLicence(item.name)"
                  >
                  </LicenceBlock>

                </div>
                <!-- /Employee's Notifications -->

              </div>
            </el-tab-pane>
            <!-- /To Employee -->

          </el-tabs>
        </div>
      </el-col>
      <!-- /User Type Tabs -->

      <!-- Right Side Content -->
      <el-col :md="16">

        <!-- Content -->
        <div class="am-section am-email-form-settings">
          <transition name="fadeIn">
            <el-form :model="notification" ref="notification" :rules="rules" @submit.prevent="createNotification">


              <div v-if="createNewContent">

                <el-row :gutter="16">
                  <!-- Create Notification -->
                  <el-col :lg="12" :md="12" :sm="12" :xs="24">
                    <div>
                      <h2 v-if="!showActiveClass">{{ $root.labels.create_notification }}</h2>
                      <h2 v-else>{{ this.notification.customName }}</h2>
                    </div>
                  </el-col>

                  <el-col :lg="12" :md="12" :sm="12" :xs="24" style="display: flex; justify-content: flex-end">
                    <el-button v-if="!showActiveClass" size="small" @click="getNotification(null)">
                      {{ $root.labels.discard }}
                    </el-button>
                    <el-select
                        v-if="showActiveClass"
                        class="duplicate"
                        :value="$root.labels.duplicate"
                        @change="duplicateNotification($event)"
                    >
                      <el-option
                          v-for="option in duplicateOptions"
                          :key="option.value"
                          :label="option.label"
                          :value="option.value">
                      </el-option>
                    </el-select>
                    <div v-if="showActiveClass">
                      <el-button size="small" @click="showDelete = !showDelete" :loading="!fetchedDelete" style="position: relative">
                        <img :src="$root.getUrl+'public/img/am-trashcan-red.svg'" style="vertical-align: text-bottom">
                        <span class="red">{{ $root.labels.delete }}</span>
                      </el-button>
                      <div v-if="showDelete" class="deleteModal">
                        <p v-html="$root.labels.delete_message">
                        </p>
                        <div style="display: flex; justify-content: flex-end">
                          <el-button size="small" @click="showDelete = false">{{ $root.labels.cancel }}</el-button>
                          <el-button size="small" type="danger" @click="deleteNotification">{{ $root.labels.delete }}</el-button>
                        </div>
                      </div>
                    </div>

                  </el-col>
                  <!-- /Create Notification -->
                </el-row>

                <el-row>
                  <el-col :md="12" :lg="12" :sm="24">
                    <p style="margin:0">{{ $root.labels.notification_name }}</p>
                    <el-form-item prop="notificationCustomName">
                      <el-input
                          v-model="notificationName"
                          ref="notificationName"
                          :placeholder="$root.labels.notification_name_enter"/>
                    </el-form-item>

                  </el-col>
                </el-row>

                <!-- Enable New Notification -->
                <el-row>
                  <el-col :md="10" :lg="12">
                    <el-switch v-model="notificationEnabled" />
                    <p style="display: inline-block; margin:0; margin-left: 10px">
                      {{ $root.labels.notification_enabled }}
                    </p>
                  </el-col>
                </el-row>
                <!-- /Enable New Notification -->
                <hr style="margin-top: 16px; margin-bottom: 16px"/>

                <el-row>
                  <el-col>
                    <p>{{ $root.labels.notification_type }}</p>
                    <el-radio v-model="notificationType" label="triggered">{{ $root.labels.notification_triggered }}</el-radio>
                    <el-radio v-model="notificationType" label="scheduled">{{ $root.labels.notification_scheduled }}</el-radio>
                  </el-col>
                </el-row>

                <el-row v-if="notificationType === 'triggered' && notificationEntity === 'appointment'">
                  <el-col>
                    <p>{{ $root.labels.notification_appointment_status }}</p>
                    <el-radio v-model="notificationTrigger" label="approved">{{ $root.labels.approved }}</el-radio>
                    <el-radio v-model="notificationTrigger" label="pending">{{ $root.labels.pending }}</el-radio>
                    <el-radio v-model="notificationTrigger" label="canceled">{{ $root.labels.canceled }}</el-radio>
                    <el-radio v-model="notificationTrigger" label="rejected">{{ $root.labels.rejected }}</el-radio>
                    <el-radio v-model="notificationTrigger" label="rescheduled">{{ $root.labels.rescheduled }}</el-radio>
                    <el-radio v-model="notificationTrigger" label="updated">{{ $root.labels.details_changed }}</el-radio>
                  </el-col>
                </el-row>

                <el-row v-if="notificationType === 'triggered' && notificationEntity === 'event'">
                  <el-col>
                    <p>{{ $root.labels.notification_event_action }}</p>
                    <el-radio v-model="notificationTrigger" label="approved">{{ $root.labels.booked }}</el-radio>
                    <el-radio v-model="notificationTrigger" label="rejected">{{ $root.labels.canceled_by_admin }}</el-radio>
                    <el-radio v-model="notificationTrigger" label="canceled">{{ $root.labels.canceled_by_attendee }}</el-radio>
                    <el-radio v-model="notificationTrigger" label="rescheduled">{{ $root.labels.rescheduled }}</el-radio>
                    <el-radio v-model="notificationTrigger" label="updated">{{ $root.labels.details_changed }}</el-radio>
                  </el-col>
                </el-row>

                <el-row v-if="notificationEntity === 'appointment'">
                  <el-col :lg="12" :md="12" :sm="24">
                    <p>{{ $root.labels.services }}</p>
                    <el-select
                        v-model="selectedServices"
                        :placeholder="$root.labels.all_services"
                        multiple
                        filterable
                        collapse-tags
                    >
                      <el-option
                          v-for="service in services"
                          :key="service.id"
                          :label="service.name"
                          :value="service.id">
                      </el-option>
                    </el-select>
                  </el-col>
                </el-row>

                <el-row v-if="notificationEntity === 'event'">
                  <el-col :lg="12" :md="12" :sm="24">
                    <p>{{ $root.labels.events }}</p>
                    <el-select
                        v-model="selectedEvents"
                        :placeholder="$root.labels.all_events"
                        :remote-method="query => searchEvents(query, true, events)"
                        :loading="loadingEvents"
                        :remote="events.length === $root.settings.general.eventsFilterLimit"
                        multiple
                        filterable
                        collapse-tags
                    >
                      <el-option
                          v-for="event in searchedEvents"
                          :key="event.id"
                          :label="event.displayName ? event.displayName : event.name"
                          :value="event.id">
                      </el-option>
                    </el-select>
                  </el-col>
                </el-row>

                <!-- Send Only New Notification -->
                <el-row v-if="notificationType !== 'scheduled' || notificationTimed !== 'sameDay'">
                  <el-col :md="10" :lg="12">
                    <el-switch v-model="sendOnlyMe" />
                    <p style="display: inline-block; margin:0; margin-left: 10px">
                      {{ $root.labels.send_only_this }}
                    </p>
                    <el-tooltip placement="top">
                      <div slot="content" v-if="entity === 'appointment'" v-html="$root.labels.send_only_this_tooltip"></div>
                      <div slot="content" v-if="entity === 'event'" v-html="$root.labels.send_only_this_tooltip_event"></div>
                      <i class="el-icon-question am-tooltip-icon"></i>
                    </el-tooltip>
                  </el-col>
                </el-row>
                <!-- /Send Only New Notification -->

                <hr style="margin-top: 16px; margin-bottom: 16px"/>

                <div v-if="notificationType === 'scheduled'">
                  <el-row>
                    <el-col>
                      <p>{{ $root.labels.schedule }}</p>
                      <el-radio v-model="notificationTimed" label="before">{{ $root.labels.before }}</el-radio>
                      <el-radio v-model="notificationTimed" label="after">{{ $root.labels.after }}</el-radio>
                      <el-radio v-model="notificationTimed" label="sameDay">{{ $root.labels.same_day }}</el-radio>
                    </el-col>
                  </el-row>

                  <el-row>
                    <el-col>
                      <p v-if="notificationTimed !== 'sameDay'">{{ $root.labels.choose_when }}</p>
                      <p v-else>{{ $root.labels.time }}</p>
                    </el-col>
                  </el-row>

                  <el-row v-if="notificationTimed !== 'sameDay'" :gutter="10">
                    <el-col :lg="6" :md="6" :sm="24">
                      <el-input-number
                          :min="1"
                          v-model="amountTime"
                          :placeholder="$root.labels.enter_number"
                      ></el-input-number>
                    </el-col>
                    <el-col :lg="6" :md="6" :sm="24">
                      <el-select
                          v-model="intervalTime"
                          value-key="id"
                      >
                        <el-option
                            v-for="interval in intervalTimes"
                            :key="interval.value"
                            :label="interval.label"
                            :value="interval.value">
                        </el-option>
                      </el-select>

                    </el-col>
                  </el-row>

                  <el-row v-else>
                    <el-col :lg="8" :md="8" :sm="24">
                      <el-form-item>
                        <el-time-select
                            :picker-options="getTimeSelectOptionsWithLimits(null, null)"
                            v-model="onTime"/>
                      </el-form-item>
                    </el-col>
                  </el-row>

                  <hr style="margin-top: 16px; margin-bottom: 16px"/>

                </div>

              </div>

              <!-- Name & Show Email Codes -->
              <el-row :gutter="16">

                <!-- Notification Name -->
                <el-col :span="12" v-if="!createNewContent">
                  <div>
                    <h2>{{ $root.labels[notification.name] }}</h2>
                    <h3 v-if="notificationTimeBased">
                      {{ $root.labels['notification_scheduled'] }}
                    </h3>
                    <h3 v-if="notification.customName">{{ $root.labels[notification.name] }}</h3>
                  </div>
                </el-col>
                <!-- /Notification Name -->

                <el-col :span="!createNewContent ? 12 : 24">
                  <!-- Show Email Codes Button -->
                  <div class="align-right">
                    <p class="am-blue-link" @click="showDialogPlaceholders">
                      {{ $root.labels['show_' + type + '_codes'] }}
                    </p>
                  </div>
                  <!-- /Show Email Codes Button -->

                  <!-- Select Language -->
                  <div class="align-right" v-if="notification.name !== 'customer_invoice' && notification.sendTo === 'customer' && type !== 'whatsapp' && usedLanguages.length > 0">
                    <el-select class="select-languages" :placeholder="$root.labels.language" v-model="selectedLanguage" clearable filterable @change="changeLanguage">
                      <li class="el-select-dropdown__item" @click="manageLanguages">
                        <span>
                          <img class="option-languages-flag" :src="$root.getUrl+'public/img/translate.svg'">
                          {{ $root.labels.manage_languages }}
                        </span>
                      </li>
                      <hr v-if="usedLanguages.length > 0">

                      <template slot="prefix">
                        <img class="select-languages-flag" :src="getLanguageFlag(selectedLanguage)">
                      </template>

                      <el-option
                        v-for="(lang, index) in usedLanguages"
                        :key="index"
                        :label="getLanguageLabel(lang)"
                        :value="lang"
                      >
                        <span>
                          <img class="option-languages-flag" :src="getLanguageFlag(lang)">
                          {{ getLanguageLabel(lang) }}
                        </span>
                      </el-option>

                    </el-select>
                  </div>
                  <!-- /Select Language -->

                  <div v-if="type === 'whatsapp'" class="am-whatsapp-settings-button">
                    <el-button size="small" @click="$emit('openSettings')">
                      <img :src="$root.getUrl+'public/img/am-settings-slider.svg'" style="vertical-align: text-bottom">
                      <span>{{ $root.labels.whatsapp_settings }}</span>
                    </el-button>
                  </div>

                </el-col>

              </el-row>
              <!-- /Name & Show Email Codes -->


              <!-- Inputs -->
              <el-row :gutter="16">

                <!-- Subject -->
                <el-col :span="notificationTimeBased && !createNewContent ? 18 : 24" v-if="type === 'email'">
                  <el-form-item :label="$root.labels.subject + ':'">
                    <el-input type="text" v-model="notificationSubject"></el-input>
                  </el-form-item>
                </el-col>
                <!-- /Subject -->

                <!-- Templates -->
                <el-col :span="notificationTimeBased && !createNewContent ? 18 : 24" v-if="type === 'whatsapp'">
                  <el-form-item>
                    <div style="line-height: 40px;">
                      {{ $root.labels.whatsapp_template_name + ':' }}
                    </div>
                    <el-select v-model="notification.whatsAppTemplate" :placeholder="$root.labels.whatsapp_choose_template" @change="updatePlaceholders()">
                      <el-option
                        v-for="template in templates"
                        :key="template.id"
                        :value="template.name"
                        :label="template.name"
                      >
                        <div style="display: flex;justify-content: space-between;">
                          <span>{{template.name}}</span>
                          <span v-if="template.status" :style="{'color': getStatusColor(template) }">{{ template.status ? template.status.charAt(0) + template.status.slice(1).toLowerCase() : '' }}</span>
                        </div>
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <!-- /Templates -->

                <!-- Time -->
                <el-col v-if="notificationTime && !createNewContent" :span="6">
                  <el-form-item :label="$root.labels.scheduled_for + ':'">
                    <el-time-select
                        v-model="notificationTime"
                        :picker-options="timeSelectOptions"
                        :clearable="false"
                    >
                    </el-time-select>
                  </el-form-item>
                </el-col>
                <!-- /Time -->

                <!-- Time Before -->
                <el-col v-if="notification.timeBefore && !createNewContent" :span="6">
                  <el-form-item :label="$root.labels.scheduled_before + ':'">
                    <el-select v-model="notification.timeBefore">
                      <el-option
                          v-for="item in getPossibleDurationsInSeconds(notification.timeBefore, 86400)"
                          :key="item"
                          :label="secondsToNiceDuration(item)"
                          :value="item"
                      >
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <!-- /Time Before -->

                <!-- Time After -->
                <el-col v-if="notification.timeAfter && !createNewContent" :span="6">
                  <el-form-item :label="(notification.entity === 'appointment' ? $root.labels.scheduled_after_appointment : $root.labels.scheduled_after_event) + ':'">
                    <el-select v-model="notification.timeAfter">
                      <el-option
                          v-for="item in getPossibleDurationsInSeconds(notification.timeAfter, 86400)"
                          :key="item"
                          :label="secondsToNiceDuration(item)"
                          :value="item"
                      >
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <!-- /Time After -->

              </el-row>
              <!-- /Inputs -->


              <!-- Whatsapp Header -->
              <div v-if="type === 'whatsapp' && getWhatsAppComponent('header')">
                <el-row>
                  <el-form-item :label="$root.labels.whatsapp_header + ':'">
                    <!-- Textarea -->
                    <el-input
                      v-if="getWhatsAppComponent('header').text"
                      :value="getWhatsAppComponent('header').text"
                      placeholder=""
                      :disabled="true"
                    >
                    </el-input>
                  </el-form-item>
                </el-row>

                <WhatsAppPlaceholders
                  ref="whatsAppHeader"
                  class="am-whatsapp-ph-header"
                  :whatsapp-placeholders="whatsAppPlaceholders.header"
                  :rules="whatsAppPhRules.header"
                  name="header"
                  :all-placeholders="getSortedInlinePlaceholders()"
                  :categories="categories"
                  :coupons="coupons"
                  :custom-fields="customFields"
                  :events="events"
                  :userTypeTab="userTypeTab"
                  :all-placeholder-types="groupedPlaceholders"
                  :notification="notification"
                >
                </WhatsAppPlaceholders>
              <!-- /Whatsapp Header -->
              </div>


              <!-- Message -->
              <el-form-item>
                <el-row type="flex" align="middle" :gutter="24" style="margin-bottom: 10px;">
                  <el-col :span="12" style="padding-bottom: 5px;">
                    {{ $root.labels.message_colon }}
                  </el-col>

                  <el-col :span="12" class="align-right" v-if="type === 'email'">
                    <el-button-group>
                      <el-button
                        size="mini"
                        :type="textMode ? 'default' : 'primary'"
                        @click="changeTextMode"
                      >
                        {{ $root.labels.text_mode }}
                      </el-button>
                      <el-button
                        size="mini"
                        :type="textMode ? 'primary' : 'default'"
                        @click="changeTextMode"
                      >
                        {{ $root.labels.html_mode }}
                      </el-button>
                    </el-button-group>
                  </el-col>
                </el-row>

                <el-row v-if="type === 'email'">
                  <el-col>
                    <el-alert
                        type="warning"
                        show-icon
                        title=""
                        :description="$root.labels.content_mode_tooltip"
                        :closable="false"
                        style="margin-bottom: 10px"
                    >
                    </el-alert>
                  </el-col>
                </el-row>

                <!-- Quill Editor -->
                <quill-editor
                    ref="notificationContent"
                    v-if="type === 'email' && !textMode"
                    v-model="notificationContent"
                    :options="editorOptions"
                    @change="parseQuillEditorContent"
                >
                </quill-editor>
                <!-- /Quill Editor -->
                <el-input
                  v-if="type === 'email' && textMode"
                  v-model="notificationContentText"
                  type="textarea"
                  :rows="7"
                  placeholder=""
                  @input="changedContentText('notificationContent', 'notificationContentText', null)"
                >
                </el-input>

                <!-- Textarea -->
                <el-input
                    ref="notificationContent"
                    v-if="type === 'sms'"
                    v-model="notificationContent"
                    type="textarea"
                    :rows="7"
                    placeholder=""
                >
                </el-input>
                <!-- /Textarea -->

                <!-- Textarea -->
                <el-input
                  ref="notificationContent"
                  v-if="type === 'whatsapp' && getWhatsAppComponent('body')"
                  type="textarea"
                  :rows="7"
                  :disabled="true"
                  :value="getWhatsAppComponent('body').text"
                >
                </el-input>
                <!-- /Textarea -->

                <WhatsAppPlaceholders
                  ref="whatsAppBody"
                  v-if="type === 'whatsapp'"
                  :whatsapp-placeholders="whatsAppPlaceholders.body"
                  :notification="notification"
                  :rules="whatsAppPhRules.body"
                  :all-placeholders="getSortedInlinePlaceholders()"
                  name="body"
                  :categories="categories"
                  :coupons="coupons"
                  :custom-fields="customFields"
                  :events="events"
                  :userTypeTab="userTypeTab"
                  :all-placeholder-types="groupedPlaceholders"
                >
                </WhatsAppPlaceholders>

              </el-form-item>
              <!-- /Message -->

              <!-- Insert email placeholders -->
              <el-form-item v-if="type !== 'whatsapp'">
                  {{ $root.labels.insert_email_placeholders }}:
                <el-tooltip placement="top">
                  <div slot="content" v-html="$root.labels.insert_email_placeholders_tooltip"></div>
                  <i class="el-icon-question am-tooltip-icon"></i>
                </el-tooltip>
                <inline-placeholders
                  :placeholdersNames="getInlinePlaceholdersNames(notification)"
                  :excludedPlaceholders="getExcludedPlaceholders(notification, false, false, true)"
                  :customFields="customFields"
                  :categories="categories"
                  :coupons="coupons"
                  :userTypeTab="userTypeTab"
                  :no-html="type !== 'email'"
                >
                </inline-placeholders>
              </el-form-item>
              <!-- /Insert email placeholders -->

              <el-row class="am-customize-notifications-combined"
                      v-if="notification.name === 'customer_package_purchased' || notification.name === 'provider_package_purchased' || notification.name === 'customer_package_canceled' || notification.name === 'provider_package_canceled'"
              >
                <el-col :span="16">
                  <div class="am-customize-notifications-combined-tooltip">
                    <strong>{{ $root.labels.package_placeholder_label }}</strong>
                    %package_appointments_details%
                    <el-tooltip placement="top">
                      <div slot="content" v-html="$root.labels.ph_package_tooltip"></div>
                      <i class="el-icon-question am-tooltip-icon"/>
                    </el-tooltip>
                  </div>
                </el-col>

                <el-col :span="8" class="am-align-right">
                  <p class="am-blue-link" @click="openDialogCombinedPlaceholders('packagePlaceholders' + (userTypeTab === 'customer' ? 'Customer' : ''))">
                    {{ $root.labels.configure_placeholder_here }}
                  </p>
                </el-col>
              </el-row>

              <el-row class="am-customize-notifications-combined"
                      v-if="!notInLicence() && entity === 'appointment' && (!notification.customName &&
                      (notification.name === 'customer_appointment_approved' ||
                      notification.name === 'provider_appointment_approved' ||
                      notification.name === 'customer_appointment_pending' ||
                      notification.name === 'provider_appointment_pending') ||
                       (notification.customName && notificationType === 'triggered' && (notificationTrigger === 'approved' || notificationTrigger === 'pending')))"
              >
                <el-col :span="16">
                  <div class="am-customize-notifications-combined-tooltip">
                    <strong>{{ $root.labels.ph_recurring_appointments_details }}</strong>
                    %recurring_appointments_details%
                    <el-tooltip placement="top">
                      <div slot="content" v-html="$root.labels.ph_recurring_tooltip"></div>
                      <i class="el-icon-question am-tooltip-icon"></i>
                    </el-tooltip>
                  </div>
                </el-col>

                <el-col :span="8" class="am-align-right">
                  <p class="am-blue-link" @click="openDialogCombinedPlaceholders('recurringPlaceholders' + (userTypeTab === 'customer' ? 'Customer' : ''))">
                    {{ $root.labels.configure_placeholder_here }}
                  </p>
                </el-col>
              </el-row>
              <el-row
                class="am-customize-notifications-combined"
                v-else-if="(!notInLicence('pro') && userTypeTab === 'customer' && notification.name === 'customer_cart') || (!notInLicence('pro') && userTypeTab === 'provider' && notification.name === 'provider_cart')"
              >
                <el-col :span="16">
                  <div class="am-customize-notifications-combined-tooltip">
                    <strong>{{ $root.labels.ph_cart_appointments_details }}</strong>
                    %cart_appointments_details%
                    <el-tooltip placement="top">
                      <div slot="content" v-html="$root.labels.ph_group_appointments_tooltip"></div>
                      <i class="el-icon-question am-tooltip-icon"></i>
                    </el-tooltip>
                  </div>
                </el-col>

                <el-col :span="8" class="am-align-right">
                  <p class="am-blue-link" @click="openDialogCombinedPlaceholders('cartPlaceholders' + (userTypeTab === 'customer' ? 'Customer' : ''))">
                    {{ $root.labels.configure_placeholder_here }}
                  </p>
                </el-col>
              </el-row>

              <el-row class="am-customize-notifications-combined" v-if="!notInLicence() && notification.sendTo === 'provider' && entity === 'appointment' && notification.name !== 'customer_cart' && notification.name !== 'provider_cart'">
                <el-col :span="16">
                  <div class="am-customize-notifications-combined-tooltip">
                    <strong>{{ $root.labels.ph_group_appointment_details }}</strong>
                    %group_appointment_details%
                    <el-tooltip placement="top">
                      <div slot="content" v-html="$root.labels.ph_group_appointments_tooltip"></div>
                      <i class="el-icon-question am-tooltip-icon"></i>
                    </el-tooltip>
                  </div>
                </el-col>

                <el-col :span="8" class="am-align-right">
                  <p class="am-blue-link" @click="openDialogCombinedPlaceholders('groupAppointmentPlaceholder')">
                    {{ $root.labels.configure_placeholder_here }}
                  </p>
                </el-col>
              </el-row>

              <el-row class="am-customize-notifications-combined" v-if="notification.sendTo === 'provider' && entity === 'event'">
                <el-col :span="16">
                  <div class="am-customize-notifications-combined-tooltip">
                    <strong>{{ $root.labels.ph_group_event_details }}</strong>
                    %group_event_details%
                    <el-tooltip placement="top">
                      <div slot="content" v-html="$root.labels.ph_group_event_tooltip"></div>
                      <i class="el-icon-question am-tooltip-icon"></i>
                    </el-tooltip>
                  </div>
                </el-col>

                <el-col :span="8" class="am-align-right">
                  <p class="am-blue-link" @click="openDialogCombinedPlaceholders('groupEventPlaceholder')">
                    {{ $root.labels.configure_placeholder_here }}
                  </p>
                </el-col>
              </el-row>


              <div v-if="notification.timeBefroe || notification.timeAfter || (notification.time && notification.customName === null) || (notification.customName !== null && notificationTimed === 'before' && notificationType === 'scheduled')">

                <div v-if="notification.name !== 'customer_birthday_greeting'">
                  <el-row style="display: flex; align-items: center">
                    <el-col :span="22">
                      <p>{{ $root.labels.dont_send_scheduled_email }}</p>
                    </el-col>
                    <el-col :span="2" style="display: flex; justify-content: center">
                      <el-switch v-model="minimumTimeEnabled" @change="changeMinimumTime"/>
                    </el-col>
                  </el-row>

                  <el-row :gutter="10" v-if="notification.minimumTimeBeforeBooking">
                    <el-col :lg="6" :md="6" :sm="24">
                      <el-input-number
                          :min="1"
                          v-model="notification.minimumTimeBeforeBooking.amount"
                          :placeholder="$root.labels.enter_number"
                      ></el-input-number>
                    </el-col>
                    <el-col :lg="6" :md="6" :sm="24">
                      <el-select
                          v-model="notification.minimumTimeBeforeBooking.period"
                      >
                        <el-option
                            v-for="interval in intervalTimes.filter(i => i.value !== 'weeks' && i.value !== 'months')"
                            :key="interval.value"
                            :label="interval.label"
                            :value="interval.value">
                        </el-option>
                      </el-select>

                    </el-col>
                  </el-row>
                </div>

                <!-- Cron Message -->
                <el-alert
                    v-if="showActiveClass && notificationTimeBased || !showActiveClass && notificationType === 'scheduled'"
                    class="am-alert"
                    :title="$root.labels.cron_instruction + ':'"
                    type="info"
                    :description="'*/15 * * * * ' + $root.getAjaxUrl + '/notifications/scheduled/send'"
                    show-icon
                    :closable="false">
                </el-alert>
                <!-- /Cron Message -->

              </div>

              <hr/>

              <!-- Cancel & Save Buttons -->
              <el-row :gutter="16" class="am-email-form-settings__cancel-save">

                <!-- Cancel Button -->
                <el-col :span="12">
                  <div>
                    <el-button size="small" @click="openTestNotificationModal">
                      {{ $root.labels['send_test_' + type] }}
                    </el-button>
                  </div>
                </el-col>
                <!-- /Cancel Button -->

                <!-- Save Button -->
                <el-col :span="12">
                  <div class="align-right">
                    <el-button v-if="showActiveClass" @click="updateNotification()" :loading="!fetchedUpdate" size="small" type="primary">
                      {{ $root.labels.save }}
                    </el-button>
                    <el-button v-else @click="createNotification()" :loading="!fetchedUpdate" size="small" type="primary">
                      {{ $root.labels.create }}
                    </el-button>
                  </div>
                </el-col>
                <!-- /Save Button -->

              </el-row>
              <!-- /Cancel & Save Buttons -->


              <el-alert
                  class="am-sms-warning"
                  v-if="type === 'sms'"
                  type="warning"
                  show-icon
                  title=""
                  v-html="$root.labels.sms_warning"
                  :closable="false"
                  style="margin-bottom: 10px; margin-top: 16px; display: block"
              >
              </el-alert>

            </el-form>
          </transition>
        </div>
        <!-- /Content -->

      </el-col>
      <!-- /Right Side Content -->

    </el-row>
    <!-- /Customize Notifications -->

    <!-- Dialog Placeholders -->
    <transition name="slide">
      <el-dialog
          class="am-side-dialog am-dialog-email-codes"
          :visible.sync="dialogPlaceholders"
          :show-close="false"
          v-if="dialogPlaceholders"
      >
        <dialog-placeholders
            :entity="entity"
            :type="type"
            :notification="notification"
            :excludedPlaceholders="getExcludedPlaceholders(notification, true, false, false)"
            :customFields="customFields"
            :categories="categories"
            :coupons="coupons"
            :userTypeTab="userTypeTab"
            @closeDialogPlaceholders="dialogPlaceholders=false"
        >
        </dialog-placeholders>
      </el-dialog>
    </transition>
    <!-- Dialog Placeholders -->

    <!-- Dialog Placeholders -->
    <transition name="slide">
      <el-dialog
        class="am-side-dialog am-dialog-email-codes"
        :visible.sync="dialogCombinedPlaceholder"
        :show-close="false"
        v-if="dialogCombinedPlaceholder"
      >
        <dialog-combined-placeholder
          @closeDialogCombinedPlaceholder="dialogCombinedPlaceholder=false"
          :appointmentsSettings="$root.settings.appointments"
          :name="combinedPlaceholderName"
          :nameHtml="combinedPlaceholderName + 'Html'"
          :customFields="customFields"
          :userTypeTab="userTypeTab"
          :entity="combinedPlaceholderEntity"
          :type="type"
          :categories="categories"
          :coupons="coupons"
          :notification="notification"
          :placeholdersNames="getDialogPlaceholderNames(notification)"
          :excludedPlaceholders="getExcludedPlaceholders(notification, false, true, false)"
          :selectedLanguage="selectedLanguage"
          :selectedLanguageHtml="selectedLanguage + 'Html'"
          :languagesData="languagesData"
        >
        </dialog-combined-placeholder>
      </el-dialog>
    </transition>
    <!-- Dialog Placeholders -->

    <!-- Test Notification Modal -->
    <el-dialog :title="$root.labels['send_test_' + type]" class="am-pop-modal" :visible.sync="testNotificationModal">

      <!-- Configure Sender Email Warning -->
      <el-alert
          v-if="$root.settings.notifications.senderEmail === '' && type === 'email'"
          type="warning"
          show-icon
          title=""
          :description="$root.labels.test_email_warning"
          :closable="false"
      >
      </el-alert>
      <!-- /Configure Sender Email Warning -->

      <!-- SMS Balance Warning -->
      <el-alert
          v-if="type === 'sms' && !user.balance"
          type="warning"
          show-icon
          title=""
          :description="$root.labels.test_sms_warning"
          :closable="false"
      >
      </el-alert>
      <!-- /SMS Balance Warning -->

      <!-- Form -->
      <el-form
          v-if="testNotificationModal"
          :model="testNotification"
          ref="testNotification"
          :rules="rules"
          label-position="top"
          @submit.prevent="sendTestNotification"
          v-loading="testNotificationLoading"
      >

        <!-- Recipient Email -->
        <el-form-item v-if="type === 'email'" :label="$root.labels.recipient_email" prop="recipientEmail">
          <el-input
              v-model="testNotification.recipientEmail"
              :placeholder="$root.labels.email_placeholder"
              @input="clearValidation()"
              auto-complete="off"
          >
          </el-input>
        </el-form-item>
        <!-- /Recipient Email -->

        <!-- Recipient Phone -->
        <el-form-item v-if="type === 'sms'" :label="$root.labels.recipient_phone" prop="recipientPhone">
          <phone-input
              :savedPhone="testNotification.recipientPhone"
              @phoneFormatted="phoneFormatted"
          >
          </phone-input>
        </el-form-item>
        <!-- /Recipient Phone -->

        <!-- Recipient WhatsApp -->
        <el-form-item v-if="type === 'whatsapp'" :label="$root.labels.recipient_phone" prop="recipientWhatsApp">
          <phone-input
            :savedPhone="testNotification.recipientWhatsApp"
            @phoneFormatted="phoneWhatsAppFormatted"
          >
          </phone-input>
        </el-form-item>
        <!-- /Recipient WhatsApp -->

        <!-- Notification Template -->
        <el-form-item :label="$root.labels.notification_template" prop="notificationTemplate">
          <el-select v-model="testNotification.notificationTemplate">
            <el-option
                v-for="notification in notifications.filter(n => n.type === type)"
                :key="notification.id"
                :label="notification.customName ? notification.customName : notification.sendTo === 'provider' ? $root.labels.employee + ' ' + $root.labels[notification.name] : $root.labels.customer + ' ' + $root.labels[notification.name]"
                :value="notification.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <!-- /Notification Template -->

      </el-form>
      <!-- /Form -->

      <!-- Cancel & Send Buttons -->
      <span slot="footer" class="dialog-footer">

        <!-- Cancel Button -->
        <el-button size="small" @click="testNotificationModal = false">
          {{ $root.labels.cancel }}
        </el-button>
        <!-- /Cancel Button -->

        <!-- Send Button -->
        <el-button
            size="small"
            type="primary"
            @click="sendTestNotification"
            :loading="testNotificationLoading"
            :disabled="disabledSendTestNotification"
        >
          {{ $root.labels.send }}
        </el-button>
        <!-- /Send Button -->

      </span>
      <!-- /Cancel & Send Buttons -->

    </el-dialog>
    <!-- /Test Notification Modal -->

  </div>
</template>

<script>
  import licenceMixin from '../../../../js/common/mixins/licenceMixin'
  import durationMixin from '../../../../js/common/mixins/durationMixin'
  import Form from 'form-object'
  import { quillEditor } from 'vue-quill-editor'
  import notifyMixin from '../../../../js/backend/mixins/notifyMixin'
  import quillMixin from '../../../../js/backend/mixins/quillMixin'
  import imageMixin from '../../../../js/common/mixins/imageMixin'
  import DialogPlaceholders from './DialogPlaceholders.vue'
  import DialogCombinedPlaceholder from './DialogCombinedPlaceholder.vue'
  import PhoneInput from '../../../parts/PhoneInput.vue'
  import notificationMixin from '../../../../js/backend/mixins/notificationMixin'
  import InlinePlaceholders from './InlinePlaceholders.vue'
  import entitiesMixin from '../../../../js/common/mixins/entitiesMixin'
  import WhatsAppPlaceholders from '../whatsapp/WhatsAppPlaceholders.vue'
  import placeholdersMixin from '../../../../js/backend/mixins/placeholdersMixin'
  import priceMixin from '../../../../js/common/mixins/priceMixin'
  import whatsappNotificationMixin from '../../../../js/backend/mixins/whatsappNotificationMixin'
  import eventMixin from '../../../../js/backend/mixins/eventMixin'

  export default {
    mixins: [
      licenceMixin,
      quillMixin,
      durationMixin,
      notifyMixin,
      imageMixin,
      notificationMixin,
      entitiesMixin,
      placeholdersMixin,
      priceMixin,
      whatsappNotificationMixin,
      eventMixin
    ],

    props: {
      categories: {
        default: () => [],
        type: Array
      },
      customFields: {
        default: () => [],
        type: Array
      },
      coupons: {
        default: () => [],
        type: Array
      },
      events: {
        default: () => [],
        type: Array
      },
      notifications: {
        default: () => [],
        type: Array
      },
      type: {
        default: 'email',
        type: String
      },
      user: {
        default: () => {},
        type: Object
      },
      passedUsedLanguages: {
        default: () => [],
        type: Array
      },
      languagesData: {
        default: () => {},
        type: Object
      },
      templates: {
        default: () => [],
        type: Array
      }
    },

    data () {
      let isCustomNameRequired = (rule, input, callback) => {
        if (this.createNewContent && !this.notificationName) {
          callback(new Error(this.$root.labels.enter_name_warning))
        } else {
          callback()
        }
      }

      let validatePhone = (rule, input, callback) => {
        if (input !== '' && !input.startsWith('+')) {
          callback(new Error(this.$root.labels.enter_valid_phone_warning))
        } else {
          callback()
        }
      }

      return {
        minimumTimeEnabled: false,
        whatsAppPlaceholders: {
          header: [],
          body: []
        },
        whatsAppPhRules: {
          header: {},
          body: {}
        },
        notificationContentText: '',
        showDelete: false,
        newNotification: {},
        notificationName: '',
        notificationEnabled: true,
        amountTime: 1,
        intervalTime: 'hours',
        createNewContent: false,
        notificationType: 'triggered',
        notificationTrigger: 'approved',
        notificationEntity: 'appointment',
        notificationTimed: 'before',
        onTime: '00:00',
        services: [],
        selectedServices: [],
        selectedEvents: [],
        sendOnlyMe: false,
        showActiveClass: true,
        duplicateOptions: [
          {
            label: this.$root.labels.to_employee,
            value: 'employee'
          },
          {
            label: this.$root.labels.to_customer,
            value: 'customer'
          }
        ],
        dialogPlaceholders: false,
        dialogCombinedPlaceholder: false,
        combinedPlaceholderName: '',
        combinedPlaceholderEntity: '',
        fetchedDelete: true,
        fetchedUpdate: true,
        form: new Form(),
        notification: {},
        entity: 'appointment',
        sendTo: 'customer',
        rules: {
          recipientEmail: [
            {required: true, message: this.$root.labels.enter_recipient_email_warning, trigger: 'submit'},
            {type: 'email', message: this.$root.labels.enter_valid_email_warning, trigger: 'submit'}
          ],
          recipientPhone: [
            {required: true, message: this.$root.labels.enter_recipient_phone_warning, trigger: 'submit'},
            {validator: validatePhone, trigger: 'submit'}
          ],
          recipientWhatsApp: [
            {required: true, message: this.$root.labels.enter_recipient_phone_warning, trigger: 'submit'},
            {validator: validatePhone, trigger: 'submit'}
          ],
          notificationTemplate: [
            {required: true, message: this.$root.labels.select_email_template_warning, trigger: 'submit'}
          ],
          notificationCustomName: [
            {validator: isCustomNameRequired, trigger: 'submit'}
          ]
        },
        testNotification: {
          recipientEmail: '',
          recipientPhone: '',
          recipientWhatsApp: '',
          notificationTemplate: 0,
          language: null,
          type: null
        },
        testNotificationLoading: false,
        testNotificationModal: false,
        userTypeTab: 'customer',
        selectedLanguage: null,
        usedLanguages: [],
        intervalTimes: [
          {
            label: this.$root.labels.minutes,
            value: 'minutes'
          },
          {
            label: this.$root.labels.hours,
            value: 'hours'
          },
          {
            label: this.$root.labels.days,
            value: 'days'
          },
          {
            label: this.$root.labels.weeks,
            value: 'weeks'
          },
          {
            label: this.$root.labels.months,
            value: 'months'
          }
        ]
      }
    },

    created () {
      Form.defaults.axios = this.$http
    },

    mounted () {
      this.notifications = this.notifications.sort(this.sortNotifications)
      this.entity = 'appointment'
      if (this.type === 'whatsapp') {
        this.setPlaceholders(this.getExcludedPlaceholders(this.notification, false, false, true))
      }
      this.getNotification(null)
      this.usedLanguages = this.passedUsedLanguages
      this.services = this.getServicesFromCategories(this.categories)
      this.searchedEvents = this.events
    },

    methods: {
      changeMinimumTime (val) {
        this.notification.minimumTimeBeforeBooking = val ? {amount: 1, period: 'days'} : null
      },

      changeTextMode () {
        this.textModeChanged('notificationContent', 'notificationContentText', null)

        this.notification.textMode = this.textMode
      },

      changeLanguage () {
        if (this.textMode && this.selectedLanguage && this.notification.translations) {
          let translations = JSON.parse(this.notification.translations)

          if (translations['content'] && translations['content'][this.selectedLanguage]) {
            this.notificationContentText = this.process(
              translations['content'][this.selectedLanguage].replace('<!-- Content -->', '').replace(/(\r\n|\n|\r)/gm, '')
            )
          }
        } else if (this.textMode && !this.selectedLanguage) {
          this.notificationContentText = this.process(
            this.notificationContent.replace('<!-- Content -->', '').replace(/(\r\n|\n|\r)/gm, '')
          )
        }

        this.testNotification.language = this.selectedLanguage
      },

      deleteNotification () {
        this.showDelete = false
        this.fetchedDelete = false
        this.form.post(
          `${this.$root.getAjaxUrl}/notifications/delete/` + this.notification.id
        ).then((response) => {
          this.fetchedDelete = true
          const index = this.notifications.map(n => n.id).indexOf(this.notification.id)
          if (index > -1) {
            this.notifications.splice(index, 1)
            let id = this.notifications.find(n => n.sendTo === this.notification.sendTo && n.entity === this.notification.entity &&
                n.type === this.notification.type).id
            this.getNotification(id)
          }
          this.notify(this.$root.labels.success, this.$root.labels.notification_deleted, 'success')
        }).catch(() => {
          this.fetchedDelete = true
          this.notify(this.$root.labels.error, this.$root.labels.notification_not_deleted, 'error')
        })
      },

      duplicateNotification (event) {
        if (this.notification.customName) {
          this.notification = this.getNotificationEntity()

          this.textMode = this.notification.textMode

          if (event === 'employee') {
            this.notification.name = this.notification.name.replace('customer', 'provider')
            this.notification.sendTo = 'provider'
          } else if (event === 'customer') {
            this.notification.name = this.notification.name.replace('provider', 'customer')
            this.notification.sendTo = 'customer'
          }
          this.notification.customName = this.$root.labels.duplicate_of + this.notification.customName
          this.callInsert(this.notification)
        }
      },

      manageLanguages () {
        this.$emit('manageLanguages')
      },

      openDialogCombinedPlaceholders (phName) {
        let name = phName
        this.combinedPlaceholderName = name
        this.combinedPlaceholderEntity = name.includes('group') ? 'group' : this.entity
        if (this.selectedLanguage) {
          if (!this.$root.settings.appointments.translations[name]) {
            this.$root.settings.appointments.translations[name] = {}
          }

          if (!(this.selectedLanguage in this.$root.settings.appointments.translations[name])) {
            this.$root.settings.appointments.translations[name][this.selectedLanguage] = this.$root.settings.appointments[name]
          }
        }

        this.dialogCombinedPlaceholder = true
      },

      getExcludedPlaceholders (notification, isDialog, isCombinedDialog, isInline) {
        let excludedPlaceholders = {}

        switch (this.userTypeTab) {
          case 'provider':
            excludedPlaceholders = {
              employeePlaceholders: [],
              customerPlaceholders: [
                '%customer_panel_url%'
              ],
              appointmentPlaceholders: [
                '%zoom_join_url%',
                '%appointment_cancel_url%',
                '%reservation_name%',
                '%reservation_description%',
                ...(this.combinedPlaceholderName === 'packagePlaceholders'
                  ? ['%appointment_reject_url%', '%appointment_approve_url%'] : [])
              ],
              eventPlaceholders: [
                '%zoom_join_url_date%',
                '%zoom_join_url_date_time%',
                '%event_cancel_url%'
              ],
              paymentPlaceholders: [
                '%payment_link_woocommerce%',
                '%payment_link_stripe%',
                '%payment_link_paypal%',
                '%payment_link_mollie%',
                '%payment_link_razorpay%',
                '%payment_link_square%'
              ]
            }

            break
          case 'customer':
            excludedPlaceholders = {
              customerPlaceholders: [],
              employeePlaceholders: [
                '%employee_panel_url%',
                '%employee_password%'
              ],
              appointmentPlaceholders: [
                '%zoom_host_url%',
                '%booked_customer%',
                '%reservation_name%',
                '%reservation_description%',
                '%group_appointment_details%',
                '%appointment_approve_url%',
                '%appointment_reject_url%'
              ],
              eventPlaceholders: [
                '%zoom_host_url_date%',
                '%zoom_host_url_date_time%',
                '%group_event_details%'
              ],
              paymentPlaceholders: []
            }

            break
        }

        excludedPlaceholders.appointmentPlaceholders.push('%reservation_name%')
        excludedPlaceholders.appointmentPlaceholders.push('%reservation_description%')
        excludedPlaceholders.eventPlaceholders.push('%reservation_name%')
        excludedPlaceholders.eventPlaceholders.push('%reservation_description%')

        if (notification && notification.name && !notification.name.includes('reschedule') && notification.type !== 'whatsapp') {
          excludedPlaceholders.appointmentPlaceholders.push('%initial_appointment_date%')
          excludedPlaceholders.appointmentPlaceholders.push('%initial_appointment_date_time%')
          excludedPlaceholders.appointmentPlaceholders.push('%initial_appointment_start_time%')
          excludedPlaceholders.appointmentPlaceholders.push('%initial_appointment_end_time%')
          excludedPlaceholders.eventPlaceholders.push('%initial_event_start_date%')
          excludedPlaceholders.eventPlaceholders.push('%initial_event_start_date_time%')
          excludedPlaceholders.eventPlaceholders.push('%initial_event_start_time%')
          excludedPlaceholders.eventPlaceholders.push('%initial_event_end_date%')
          excludedPlaceholders.eventPlaceholders.push('%initial_event_end_date_time%')
          excludedPlaceholders.eventPlaceholders.push('%initial_event_end_time%')
        }

        if (notification && notification.name && (notification.name.includes('canceled') || notification.name.includes('rejected')) && notification.type !== 'whatsapp') {
          excludedPlaceholders.paymentPlaceholders.push('%payment_link_woocommerce%')
          excludedPlaceholders.paymentPlaceholders.push('%payment_link_stripe%')
          excludedPlaceholders.paymentPlaceholders.push('%payment_link_mollie%')
          excludedPlaceholders.paymentPlaceholders.push('%payment_link_paypal%')
          excludedPlaceholders.paymentPlaceholders.push('%payment_link_razorpay%')
          excludedPlaceholders.paymentPlaceholders.push('%payment_link_square%')
        }


        if (notification && notification.name === 'customer_invoice') {
          excludedPlaceholders.customerPlaceholders.push('%customer_panel_url%')
        }

        if (notification && notification.type !== 'whatsapp') {
          switch (notification.entity) {
            case 'event':
              excludedPlaceholders.paymentPlaceholders.push('%appointment_deposit_payment%')
              excludedPlaceholders.paymentPlaceholders.push('%package_deposit_payment%')
              break
            case 'appointment':
              if (['customer_package_purchased', 'customer_package_canceled', 'provider_package_purchased', 'provider_package_canceled'].includes(notification.name)) {
                excludedPlaceholders.paymentPlaceholders.push('%appointment_deposit_payment%')
                excludedPlaceholders.paymentPlaceholders.push('%event_deposit_payment%')
              } else {
                excludedPlaceholders.paymentPlaceholders.push('%event_deposit_payment%')
                excludedPlaceholders.paymentPlaceholders.push('%package_deposit_payment%')
              }
              break
          }
        }

        if (isCombinedDialog) {
          excludedPlaceholders.employeePlaceholders.push('%employee_panel_url%')
          excludedPlaceholders.employeePlaceholders.push('%employee_password%')
          excludedPlaceholders.appointmentPlaceholders.push('%booked_customer%')
          excludedPlaceholders.appointmentPlaceholders.push('%coupon_used%')
          excludedPlaceholders.appointmentPlaceholders.push('%number_of_persons%')
          if (this.combinedPlaceholderEntity === 'package') {
            excludedPlaceholders.paymentPlaceholders = [
              '%payment_link_woocommerce%',
              '%payment_link_stripe%',
              '%payment_link_paypal%',
              '%payment_link_mollie%',
              '%payment_link_razorpay%',
              '%payment_link_square%'
            ]
          }
        }

        if (isCombinedDialog || (
          notification && !isInline &&
          [
            'customer_appointment_approved',
            'customer_appointment_pending',
            'provider_appointment_approved',
            'provider_appointment_pending'
          ].indexOf(notification.name) === -1
        )
        ) {
          excludedPlaceholders.appointmentPlaceholders.push('%recurring_appointments_details%')
          excludedPlaceholders.appointmentPlaceholders.push('%package_appointments_details%')
        }

        if (notification && [
          'provider_appointment_updated',
          'customer_appointment_updated'
        ].indexOf(notification.name) !== -1) {
          excludedPlaceholders.appointmentPlaceholders.push('%recurring_appointments_details%')
          excludedPlaceholders.appointmentPlaceholders.push('%package_appointments_details%')
        }

        if (isCombinedDialog && notification &&
            [
              'customer_package_purchased',
              'provider_package_purchased',
              'customer_package_canceled',
              'provider_package_canceled'
            ].indexOf(notification.name) !== -1
        ) {
          excludedPlaceholders.appointmentPlaceholders.push('%appointment_price%')
        }

        if (this.type === 'sms') {
          excludedPlaceholders.paymentPlaceholders = excludedPlaceholders.paymentPlaceholders.concat([
            '%payment_link_woocommerce%',
            '%payment_link_stripe%',
            '%payment_link_paypal%',
            '%payment_link_mollie%',
            '%payment_link_razorpay%',
            '%payment_link_square%'
          ])
        }

        if (notification.name === 'provider_cart' && isCombinedDialog) {
          excludedPlaceholders.employeePlaceholders = [
            '%employee_email%',
            '%employee_first_name%',
            '%employee_full_name%',
            '%employee_last_name%',
            '%employee_note%',
            '%employee_description%',
            '%employee_phone%',
            '%employee_panel_url%',
            '%employee_password%'
          ]
        }

        if (notification.name === 'provider_cart' || notification.name === 'customer_cart') {
          excludedPlaceholders.paymentPlaceholders = excludedPlaceholders.paymentPlaceholders.concat([
            '%payment_due_amount%'
          ])
        }

        return excludedPlaceholders
      },

      getDialogPlaceholderNames (notification) {
        if (this.combinedPlaceholderEntity === 'group') {
          if (this.entity === 'appointment') {
            return [
              'appointmentPlaceholders',
              'extrasPlaceholders',
              'customFieldsPlaceholders',
              'customerPlaceholders'
            ]
          }
          if (this.entity === 'event') {
            return [
              'eventPlaceholders',
              'customFieldsPlaceholders',
              'customerPlaceholders'
            ]
          }
        }
        let appointmentPh = [
          'employeePlaceholders',
          'categoryPlaceholders',
          'locationPlaceholders',
          'appointmentPlaceholders',
          'customFieldsPlaceholders',
          'extrasPlaceholders'
        ]
        let packagePh = [
          'employeePlaceholders',
          'categoryPlaceholders',
          'locationPlaceholders',
          'appointmentPlaceholders',
          'customFieldsPlaceholders'
        ]

        switch (notification.name) {
          case ('provider_appointment_approved'):
          case ('provider_appointment_pending'):
          case ('provider_cart'):
            return appointmentPh
          case ('customer_appointment_approved'):
          case ('customer_appointment_pending'):
          case ('customer_cart'):
            return appointmentPh.concat(['paymentPlaceholders'])
          case ('customer_package_purchased'):
          case ('customer_package_canceled'):
            return packagePh.concat(['paymentPlaceholders'])
          case ('provider_package_purchased'):
          case ('provider_package_canceled'):
            return packagePh
        }
      },

      getInlinePlaceholdersNames (notification) {
        let common = [
          'customerPlaceholders',
          'companyPlaceholders',
          'paymentPlaceholders'
        ]

        if (['provider_cart'].indexOf(notification.name) !== -1) {
          common.push('employeePlaceholders')
        }

        if (['provider_cart', 'customer_cart'].indexOf(notification.name) !== -1) {
          common = common.filter(ph => ph !== 'paymentPlaceholders')
        }

        if (['provider_cart', 'customer_cart'].indexOf(notification.name) !== -1 && notification.type === 'whatsapp') {
          common.push('cartPlaceholders')
        }

        if (['customer_birthday_greeting', 'customer_account_recovery', 'customer_invoice'].indexOf(notification.name) !== -1) {
          return [
            'customerPlaceholders',
            'companyPlaceholders'
          ]
        } else if (['provider_panel_access', 'provider_panel_recovery'].indexOf(notification.name) !== -1) {
          return [
            'employeePlaceholders',
            'companyPlaceholders'
          ]
        } else {
          switch (this.entity) {
            case ('package'):

              return common.concat(
                [
                  'packagePlaceholders',
                  'couponsPlaceholders'
                ]
              )

            case ('event'):
              if (this.userTypeTab === 'customer') {
                common = common.concat(['couponsPlaceholders'])
              }

              return common.concat(
                [
                  'eventPlaceholders',
                  'customFieldsPlaceholders',
                  'employeePlaceholders',
                  'locationPlaceholders'
                ]
              )

            case ('appointment'):
              if (this.userTypeTab === 'customer' && ['customer_cart', 'provider_cart'].indexOf(notification.name) === -1) {
                common = common.concat(['couponsPlaceholders'])
              }

              return common.concat(
                notification.name !== 'customer_cart' && notification.name !== 'provider_cart' ?
                [
                  'appointmentPlaceholders',
                  'customFieldsPlaceholders',
                  'employeePlaceholders',
                  'locationPlaceholders',
                  'extrasPlaceholders',
                  'categoryPlaceholders'
                ] : [
                ]
              )
          }
        }

        return common
      },

      getSortedInlinePlaceholders () {
        let placeholders = this.getInlinePlaceholdersNames(this.notification)
        return placeholders.sort((a, b) => (a.toLowerCase() > b.toLowerCase()) ? 1 : -1)
      },

      getUnavailableNotificationLicence (name) {
        if (this.notInLicence('pro') && (
          name === 'customer_cart' ||
          name === 'provider_cart' ||
          name === 'customer_package_purchased' ||
          name === 'customer_package_canceled' ||
          name === 'provider_package_purchased' ||
          name === 'provider_package_canceled' ||
          name === 'customer_event_waiting' ||
          name === 'provider_event_waiting'
        )) {
          return 'pro'
        }

        if (this.notInLicence('basic') && (
          name === 'customer_appointment_next_day_reminder' ||
          name === 'customer_appointment_follow_up' ||
          name === 'provider_appointment_next_day_reminder' ||
          name === 'provider_appointment_follow_up' ||
          name === 'customer_event_next_day_reminder' ||
          name === 'customer_event_follow_up' ||
          name === 'provider_event_next_day_reminder' ||
          name === 'customer_invoice'
        )) {
          return 'basic'
        }

        if (this.notInLicence('starter') && (
          name === 'customer_appointment_rescheduled' ||
          name === 'provider_appointment_rescheduled' ||
          name === 'customer_appointment_updated' ||
          name === 'provider_appointment_updated' ||
          name === 'customer_event_rescheduled' ||
          name === 'customer_event_updated' ||
          name === 'provider_event_rescheduled' ||
          name === 'provider_event_updated' ||
          name === 'customer_event_canceled' ||
          name === 'provider_event_canceled' ||
          name === 'customer_account_recovery' ||
          name === 'provider_panel_access' ||
          name === 'provider_panel_recovery' ||
          name === 'provider_panel_access' ||
          name === 'provider_panel_recovery' ||
          name === 'customer_birthday_greeting'
        )) {
          return 'starter'
        }

        return ''
      },

      visibleNotification (name) {
        return this.getUnavailableNotificationLicence(name) !== '' ? this.licenceVisible() : true
      },

      disabledNotification (name) {
        return this.getUnavailableNotificationLicence(name) !== ''
      },

      isNotificationInLicence (item) {
        return item.name === 'customer_cart' ||
          item.name === 'provider_cart' ||
          item.name === 'customer_package_purchased' ||
          item.name === 'customer_package_canceled' ||
          item.name === 'provider_package_purchased' ||
          item.name === 'provider_package_canceled'
      },

      onChangeUserTypeTab (tab) {
        this.inlineSVG()
        if (this.showActiveClass) {
          this.entity = 'appointment'
          if (this.notification.type !== tab.name) {
            this.notification = this.notifications.find(
              notification => notification.type === this.type && notification.sendTo === tab.name && notification.entity === this.entity
            )

            this.textMode = this.notification.textMode

            this.sendTo = this.notification.sendTo
            this.minimumTimeEnabled = this.notification.minimumTimeBeforeBooking !== null
            if (this.notification.customName) {
              this.setCustomNotificationFields()
              this.createNewContent = true
            } else {
              this.createNewContent = false
            }
            if (this.type === 'whatsapp') {
              this.setPlaceholders(this.getExcludedPlaceholders(this.notification, false, false, true))
              this.updatePlaceholders()
            }
            this.focusOnName()
          }
        }
      },

      getNotification (id) {
        this.$refs.notification.clearValidate()
        this.createNewContent = false
        this.showActiveClass = true
        if (id === null) {
          this.notification = this.notifications.find(notification => notification.type === this.type && notification.entity === this.entity &&
              notification.sendTo === this.sendTo)
        } else {
          this.notification = this.notifications.find(notification => notification.id === id)
        }

        if (this.notification.customName) {
          this.createNewContent = true
          this.setCustomNotificationFields()
        }

        this.entity = this.notification.entity
        this.testNotification.type = this.notification.entity
        this.testNotification.notificationTemplate = this.notification.id

        if (this.notification.minimumTimeBeforeBooking) {
          this.minimumTimeEnabled = true
          this.notification.minimumTimeBeforeBooking = typeof this.notification.minimumTimeBeforeBooking === 'string'
            ? JSON.parse(this.notification.minimumTimeBeforeBooking) : this.notification.minimumTimeBeforeBooking
        } else {
          this.minimumTimeEnabled = false
        }

        if (this.notification.name === 'customer_package_purchased' ||
            this.notification.name === 'provider_package_purchased' ||
            this.notification.name === 'customer_package_canceled' ||
            this.notification.name === 'provider_package_canceled'
        ) {
          this.entity = 'package'
          this.testNotification.type = 'package'
        }

        this.textMode = this.notification.textMode

        this.notificationContentText = this.process(
          this.notificationContent.replace('<!-- Content -->', '').replace(/(\r\n|\n|\r)/gm, '')
        )

        if (this.type === 'whatsapp') {
          this.updatePlaceholders()
        }

        this.focusOnName()
      },

      createNotification () {
        this.$refs.notification.clearValidate()
        this.$refs.notification.validate((valid) => {
          let whatsappPh = this.type === 'whatsapp' ? this.validateForm() : true
          if (valid && whatsappPh) {
            let notification = this.getNotificationEntity()
            this.callInsert(notification)
          } else {
            return false
          }
        })
      },

      callInsert (notification) {
        this.fetchedUpdate = false

        let content = notification.content

        if (notification.type === 'email') {
          content = notification.textMode ? '<!-- Content -->' + notification.content : notification.content.replace('<!-- Content -->', '')
        }

        this.form.post(`${this.$root.getAjaxUrl}/notifications`, Object.assign({}, notification, {content: content})
        ).then((response) => {
          if (response.data.update) {
            this.notification.content = response.data.notification.content

            if (this.notification.type === 'email') {
              this.notification.textMode = response.data.notification.content.startsWith('<!-- Content -->')

              this.notification.content = response.data.notification.content.replace('<!-- Content -->', '')
            }
          }
          this.fetchedUpdate = true
          notification.id = response.data.id
          this.notifications.unshift(notification)
          this.getNotification(notification.id)
          this.notify(this.$root.labels.success, this.$root.labels.notification_saved, 'success')
        }).catch((error) => {
          let message = this.$root.labels.notification_not_saved

          if ('data' in error.response &&
            'data' in error.response.data &&
            'entityMissing' in error.response.data.data &&
            error.response.data.data.entityMissing
          ) {
            message = error.response.data.message
          }

          this.fetchedUpdate = true
          this.notify(this.$root.labels.error, message, 'error')
        })
      },

      updateNotification () {
        this.$refs.notification.clearValidate()
        this.$refs.notification.validate((valid) => {
          let whatsappPh = this.type === 'whatsapp' ? this.validateForm() : true
          if (valid && whatsappPh) {
            this.fetchedUpdate = false
            if (this.notification.customName) {
              let id = this.notification.id
              this.notification = this.getNotificationEntity()
              this.notification.id = id
            }
            if (this.type === 'whatsapp') {
              this.notification.subject = (this.whatsAppPlaceholders.header.length > 0 && this.whatsAppPlaceholders.header[0].whatsappType === 'location' ? 'location:' : '') + this.whatsAppPlaceholders.header.map(h => h.value).join(' ')
              this.notification.content = this.whatsAppPlaceholders.body.map(h => h.value).join(' ')
            }
            if (!this.minimumTimeEnabled) {
              this.notification.minimumTimeBeforeBooking = null
            }
            let content = this.notification.content

            if (this.notification.type === 'email') {
              content = this.notification.textMode ? '<!-- Content -->' + this.notification.content : this.notification.content.replace('<!-- Content -->', '')
            }
            this.form.post(
              `${this.$root.getAjaxUrl}/notifications/${this.notification.id}`, Object.assign({}, this.notification, {content: content})
            ).then((response) => {
              if (response.data.update) {
                this.notification.content = response.data.notification.content
              }
              this.notification = response.data.notification

              if (this.notification.type === 'email') {
                this.notification.textMode = response.data.notification.content.startsWith('<!-- Content -->')

                this.notification.content = response.data.notification.content.replace('<!-- Content -->', '')
              }

              this.notification.minimumTimeBeforeBooking = this.notification.minimumTimeBeforeBooking ? JSON.parse(this.notification.minimumTimeBeforeBooking) : null
              this.setCustomNotificationFields()
              let index = this.notifications.map(n => n.id).indexOf(this.notification.id)
              if (index !== -1) this.notifications[index] = this.notification
              this.fetchedUpdate = true
              this.notify(this.$root.labels.success, this.$root.labels.notification_saved, 'success')
            }).catch((e) => {
              console.log(e)
              this.fetchedUpdate = true
              this.notify(this.$root.labels.error, this.$root.labels.notification_not_saved, 'error')
            })
          } else {
            return false
          }
        })
      },

      changeNotificationStatus (notification) {
        this.fetchedUpdate = false
        this.form.post(
          `${this.$root.getAjaxUrl}/notifications/status/${notification.id}`, notification
        ).then(() => {
          this.fetchedUpdate = true
          this.notify(this.$root.labels.success, this.$root.labels.notification_saved, 'success')
        }).catch(() => {
          this.fetchedUpdate = true
          this.notify(this.$root.labels.error, this.$root.labels.notification_not_saved, 'error')
        })
      },

      showDialogPlaceholders () {
        this.dialogPlaceholders = true
      },

      openTestNotificationModal () {
        this.testNotificationModal = true
      },

      sendTestNotification () {
        this.type === 'sms' ? this.sendTestSMS() : this.sendTest()
      },

      sendTest () {
        this.$refs.testNotification.validate((valid) => {
          if (valid) {
            this.testNotificationLoading = true
            this.form.post(
              `${this.$root.getAjaxUrl}/notifications/${this.type}/test`, this.testNotification
            ).then(() => {
              this.onSendTestNotificationSuccess()
            }).catch(() => {
              this.onSendTestNotificationError()
            })
          } else {
            return false
          }
        })
      },

      sendTestSMS () {
        this.$refs.testNotification.validate((valid) => {
          if (valid) {
            this.testNotificationLoading = true
            this.sendAmeliaSmsApiRequest('testNotification', this.onSendTestNotificationSuccess, this.onSendTestNotificationError)
          } else {
            return false
          }
        })
      },

      onSendTestNotificationSuccess () {
        this.clearValidation()
        this.testNotificationModal = false
        this.testNotificationLoading = false
        this.testNotification = this.resetTestNotificationOnInitialState()
        this.notify(this.$root.labels.success, this.$root.labels['test_' + this.type + '_success'], 'success')
      },

      onSendTestNotificationError () {
        this.testNotificationLoading = false
        this.notify(this.$root.labels.error, this.$root.labels['test_' + this.type + '_error'], 'error')
      },

      phoneFormatted (phone) {
        this.clearValidation()
        this.testNotification.recipientPhone = phone
      },

      phoneWhatsAppFormatted (phone) {
        this.clearValidation()
        this.testNotification.recipientWhatsApp = phone
      },

      clearValidation () {
        if (typeof this.$refs.testNotification !== 'undefined') {
          this.$refs.testNotification.clearValidate()
        }
      },

      resetTestNotificationOnInitialState () {
        return {
          recipientEmail: '',
          recipientPhone: '',
          recipientWhatsApp: '',
          notificationTemplate: this.notification.id,
          language: this.selectedLanguage,
          type: this.entity
        }
      },

      customerNotifications (entity) {
        if (entity === 'customer_other_notifications') {
          return this.notifications.filter(
            notification => notification.type === this.type && notification.sendTo === 'customer' && ['customer_invoice', 'customer_birthday_greeting', 'customer_account_recovery'].indexOf(notification.name) !== -1
          )
        } else {
          let filteredNotifications = this.notifications.filter(
            notification => notification.sendTo === 'customer' && notification.type === this.type && notification.entity === entity && ['customer_invoice', 'customer_birthday_greeting', 'customer_account_recovery'].indexOf(notification.name) === -1
          )
          // change position of app/event updated notifications
          let updatedNotification = filteredNotifications.find(n => n.name === 'customer_' + entity + '_updated' && !n.customName)
          let index = filteredNotifications.indexOf(updatedNotification)
          if (updatedNotification && index !== -1) {
            filteredNotifications.splice(index, 1)
            let rescheduledNotification = filteredNotifications.find(n => n.name.includes('rescheduled') && !n.customName)
            let insertTo = filteredNotifications.indexOf(rescheduledNotification)
            filteredNotifications.splice(insertTo, 0, updatedNotification)
          }
          return filteredNotifications
        }
      },

      employeeNotifications (entity) {
        if (entity === 'provider_other_notifications' && (this.type === 'email' || this.type === 'whatsapp')) {
          return this.notifications.filter(
            notification => notification.type === this.type && notification.sendTo === 'provider' && ['provider_panel_access', 'provider_panel_recovery'].indexOf(notification.name) !== -1
          )
        } else {
          let filteredNotifications = this.notifications.filter(
            notification => notification.sendTo === 'provider' && notification.type === this.type && notification.entity === entity && ['provider_panel_access', 'provider_panel_recovery'].indexOf(notification.name) === -1
          )
          // change position of app/event updated notifications
          let updatedNotification = filteredNotifications.find(n => n.name === 'provider_' + entity + '_updated' && !n.customName)
          let index = filteredNotifications.indexOf(updatedNotification)
          if (updatedNotification && index !== -1) {
            filteredNotifications.splice(index, 1)
            let rescheduledNotification = filteredNotifications.find(n => n.name.includes('rescheduled') && !n.customName)
            let insertTo = filteredNotifications.indexOf(rescheduledNotification)
            filteredNotifications.splice(insertTo, 0, updatedNotification)
          }
          return filteredNotifications
        }
      },

      getLanguageLabel (lang) {
        return this.languagesData[lang] ? this.languagesData[lang].name : ''
      },

      getLanguageFlag (lang) {
        if (lang && this.languagesData[lang] && this.languagesData[lang].country_code) {
          return this.$root.getUrl + 'public/img/flags/' + this.languagesData[lang].country_code + '.png'
        }
        return this.$root.getUrl + 'public/img/grey.svg'
      }
    },

    watch: {
      'passedUsedLanguages' () {
        this.usedLanguages = this.passedUsedLanguages
      }
    },

    computed: {
      notificationTime: {
        get () {
          if (this.notification.time !== null) {
            return this.$moment(this.notification.time, 'HH:mm:ss').format('HH:mm')
          }

          return null
        },
        set (selected) {
          this.notification.time = this.$moment(selected, 'HH:mm').format('HH:mm:ss')
        }
      },

      notificationSubject: {
        get () {
          if (this.selectedLanguage && this.notification.translations) {
            let translations = JSON.parse(this.notification.translations)
            if (translations['subject'] && translations['subject'][this.selectedLanguage]) {
              return translations['subject'][this.selectedLanguage]
            }
          }
          return this.notification.subject
        },
        set (subject) {
          if (this.selectedLanguage) {
            this.notification.translations = this.notification.translations ? this.notification.translations : '{}'
            let translations = JSON.parse(this.notification.translations)

            if (!translations['subject']) {
              translations['subject'] = {}
            }
            translations['subject'][this.selectedLanguage] = subject
            this.notification.translations = JSON.stringify(translations)
          } else {
            this.notification.subject = subject
          }
        }
      },

      notificationContent: {
        get () {
          if (this.selectedLanguage && this.notification.translations) {
            let translations = JSON.parse(this.notification.translations)
            if (translations['content'] && translations['content'][this.selectedLanguage]) {
              return translations['content'][this.selectedLanguage]
            }
          }
          return this.notification.content
        },
        set (content) {
          if (this.selectedLanguage) {
            this.notification.translations = this.notification.translations ? this.notification.translations : '{}'
            let translations = JSON.parse(this.notification.translations)

            if (!translations['content']) {
              translations['content'] = {}
            }
            translations['content'][this.selectedLanguage] = content
            this.notification.translations = JSON.stringify(translations)
          } else {
            this.notification.content = content
          }
        }
      },

      notificationTimeBased () {
        return this.notification.time !== null || this.notification.timeBefore !== null || this.notification.timeAfter !== null
      },

      disabledSendTestNotification () {
        if (this.type === 'email' && !this.$root.settings.notifications.senderEmail) {
          return true
        }

        return this.type === 'sms' && (typeof this.user !== 'undefined' && !this.user.balance)
      }

    },

    components: {
      WhatsAppPlaceholders,
      quillEditor,
      DialogPlaceholders,
      DialogCombinedPlaceholder,
      PhoneInput,
      InlinePlaceholders
    }
  }
</script>
