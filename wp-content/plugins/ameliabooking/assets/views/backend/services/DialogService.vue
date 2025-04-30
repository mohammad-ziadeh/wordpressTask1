<template>
  <div>
    <!-- Dialog Loader -->
    <div class="am-dialog-loader" v-show="passedService === null || dialogLoading">
      <div class="am-dialog-loader-content">
        <img :src="$root.getUrl+'public/img/spinner.svg'" class="">
        <p>{{ $root.labels.loader_message }}</p>
      </div>
    </div>

    <div class="am-dialog-scrollable" :class="{'am-edit':service.id !== 0}" v-if="passedService !== null && !dialogLoading">

      <!-- Dialog Header -->
      <div class="am-dialog-header">
        <el-row>
          <el-col :span="18">
            <h2 v-if="service.id !== 0">{{ $root.labels.edit_service }}</h2>
            <h2 v-else>{{ $root.labels.new_service }}</h2>
          </el-col>
          <el-col :span="6" class="align-right">
            <el-button @click="closeDialog" class="am-dialog-close" size="small" icon="el-icon-close"></el-button>
          </el-col>
        </el-row>
      </div>

      <!-- Form -->
      <el-form :model="service" ref="service" :rules="rulesService" label-position="top">
        <el-tabs v-model="serviceTabs">

          <!-- Service Details -->
          <el-tab-pane :label="$root.labels.details" name="service_details">

            <!-- Profile Photo -->
            <div class="am-service-profile">

              <picture-upload
                  :delete-icon-visibility="service.pictureThumbPath && service.pictureFullPath"
                  :edited-entity="this.service"
                  :entity-name="'service'"
                  @pictureSelected="servicePictureSelected"
                  v-on:deleteImage="() => deleteImage(service)"
              >
              </picture-upload>
              <el-popover
                  ref="color-popover"
                  v-model="colorPopover"
                  placement="bottom"
                  width="160"
                  trigger="click"
                  popper-class="am-color-popover"
              >
                <span
                    v-for="color in serviceColors" :key="color"
                    class="am-service-color"
                    :class="{ 'color-active' : '#' + color === service.color}"
                    @click="changeServiceColor"
                    :data-color="'#'+color"
                    :style="'background-color:#'+color"
                >
                </span>

                <el-form-item :label="$root.labels.hex + ':'">
                  <el-input v-model="service.color" auto-complete="off"></el-input>
                </el-form-item>
                <div class="align-right">
                  <el-button type="primary" size="mini" @click="colorPopover = false">{{ $root.labels.ok }}</el-button>
                </div>

              </el-popover>
              <span class="am-service-color" :style="bgColor(service.color)" v-popover:color-popover></span>
              <h2>{{ service.name }}</h2>
            </div>

            <!-- Name -->
            <el-form-item prop="name">
              <label slot="label">
                {{ $root.labels.name + ':' }}
                <div class="am-service-translate" @click="showDialogTranslate('serviceName')">
                  <img class="am-dialog-translate-svg" width="16px" :src="$root.getUrl+'public/img/translate.svg'">
                  {{ $root.labels.translate }}
                </div>
              </label>
              <el-input id="am-service-name" v-model="service.name" auto-complete="off" @input="clearValidation()" @change="trimProperty(service, 'name')"></el-input>
            </el-form-item>

            <!-- Category -->
            <el-form-item :label="$root.labels.category + ':'" prop="categoryId">
              <el-select
                  v-model="service.categoryId"
                  placeholder=""
                  @change="clearValidation()"
              >
                <el-option
                    v-for="item in visibleCategories"
                    :disabled="item.disabled"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                </el-option>
              </el-select>
              <img :src="$root.getUrl+'public/img/oval-spinner.svg'" class="svg-amelia is-spinner">
            </el-form-item>

            <!-- Show On Front -->
            <div :class="licenceClass('starter')" class="am-setting-box am-switch-box">
              <el-row type="flex" align="middle" :gutter="24">
                <el-col :span="19">
                  {{ $root.labels.service_show_on_site }}
                  <el-tooltip placement="top">
                    <div slot="content" v-html="$root.labels.service_show_on_site_tooltip"></div>
                    <i class="el-icon-question am-tooltip-icon"></i>
                  </el-tooltip>
                </el-col>
                <el-col :span="5" class="align-right">
                  <el-switch
                          v-model="service.show"
                          :disabled="notInLicence('starter')"
                          active-text=""
                          inactive-text=""
                  >
                  </el-switch>
                </el-col>
              </el-row>

              <LicenceBlock :licence="'starter'"/>
            </div>

            <el-row :class="licenceClass()">
              <el-form-item label="placeholder" :label="$root.labels.service_recurring_cycle + ':'">
                <label slot="label">
                  {{ $root.labels.service_recurring_cycle }}:
                  <el-tooltip placement="top">
                    <div slot="content" v-html="$root.labels.service_recurring_cycle_tooltip"></div>
                    <i class="el-icon-question am-tooltip-icon"></i>
                  </el-tooltip>
                </label>

                <el-select
                  v-model="service.recurringCycle"
                  :disabled="notInLicence()"
                  @change="clearValidation()"
                >
                  <el-option
                    v-for="cycle in recurringCycles"
                    :key="cycle.value"
                    :label="cycle.label"
                    :value="cycle.value"
                  >
                  </el-option>
                </el-select>

              </el-form-item>

              <LicenceBlock/>
            </el-row>

            <el-row v-if="service.recurringCycle !== 'disabled'">
              <el-form-item label="placeholder" :label="$root.labels.service_recurring_sub + ':'">
                <label slot="label">
                  {{ $root.labels.service_recurring_sub }}:
                  <el-tooltip placement="top">
                    <div slot="content" v-html="$root.labels.service_recurring_sub_tooltip"></div>
                    <i class="el-icon-question am-tooltip-icon"></i>
                  </el-tooltip>
                </label>

                <el-select
                  v-model="service.recurringSub"
                  @change="clearValidation()"
                >
                  <el-option
                    v-for="cycle in recurringSubs"
                    :key="cycle.value"
                    :label="cycle.label"
                    :value="cycle.value"
                  >
                  </el-option>
                </el-select>

              </el-form-item>
            </el-row>

            <el-row v-if="service.recurringCycle !== 'disabled'">
              <el-form-item label="placeholder" :label="$root.labels.service_recurring_payment + ':'">
                <label slot="label">
                  {{ $root.labels.service_recurring_payment }}:
                  <el-tooltip placement="top">
                    <div slot="content" v-html="$root.labels.service_recurring_payment_tooltip"></div>
                    <i class="el-icon-question am-tooltip-icon"></i>
                  </el-tooltip>
                </label>

                <el-select
                  v-model="service.recurringPayment"
                  @change="clearValidation()"
                >
                  <el-option
                    v-for="cycle in recurringPayments"
                    :key="cycle.value"
                    :label="cycle.label"
                    :value="cycle.value"
                  >
                  </el-option>
                </el-select>

              </el-form-item>
            </el-row>

            <!-- Limit Appointments per Customer -->
            <div :class="licenceClass()" class="am-setting-box am-switch-box">
              <el-row type="flex" align="middle" :gutter="24">
                <el-col :span="19">
                  {{ $root.labels.limit_app_per_customer }}
                  <el-tooltip placement="top">
                    <div slot="content" v-html="$root.labels.limit_app_per_customer_tt"></div>
                    <i class="el-icon-question am-tooltip-icon"></i>
                  </el-tooltip>
                </el-col>
                <el-col :span="5" class="align-right">
                  <el-switch
                    v-model="service.limitPerCustomer.enabled"
                    :disabled="notInLicence()"
                  >
                  </el-switch>
                </el-col>
              </el-row>

              <el-row :gutter="24" v-if="service.limitPerCustomer.enabled">
                <el-col>
                  <el-form-item>
                    <label slot="label">
                      {{ $root.labels.number_of_appointments }}:
                    </label>
                    <el-input-number
                      :min="0"
                      id="am-limit-service-number"
                      :placeholder="$root.settings.roles.limitPerCustomerService.numberOfApp.toString()"
                      v-model="service.limitPerCustomer.numberOfApp">
                    </el-input-number>
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row :gutter="24" v-if="service.limitPerCustomer.enabled">
                <el-col :span="12">
                  <el-form-item>
                    <label slot="label">
                      {{ $root.labels.time_frame }}:
                    </label>
                    <el-select
                      v-model="service.limitPerCustomer.timeFrame"
                      clearable
                      :placeholder="limitPerCustomerTimeFrames.find(t => t.value === $root.settings.roles.limitPerCustomerService.timeFrame).label"
                    >
                      <el-option
                        v-for="timeFrame in limitPerCustomerTimeFrames"
                        :key="timeFrame.value"
                        :label="timeFrame.label"
                        :value="timeFrame.value"
                      >
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item>
                    <label slot="label">
                      {{ $root.labels.period }}:
                    </label>
                    <el-input-number
                      :min="0"
                      id="am-limit-service-period"
                      v-model="service.limitPerCustomer.period"
                      :placeholder="$root.settings.roles.limitPerCustomerService.period.toString()"
                    ></el-input-number>
                  </el-form-item>
                </el-col>
              </el-row>


              <el-row v-if="service.limitPerCustomer.enabled" :gutter="24" style="margin-top: 10px; display: flex;align-items: baseline;">
                <el-col :span="12">
                    {{ $root.labels.limit_app_per_customer_from }}:
                  <el-tooltip placement="top">
                    <div slot="content" v-html="$root.labels.limit_app_per_customer_from_tt"></div>
                    <i class="el-icon-question am-tooltip-icon"></i>
                  </el-tooltip>
                </el-col>
                <el-col :span="12">
                  <el-select
                    v-model="service.limitPerCustomer.from"
                    :placeholder="limitPerCustomerFrom.find(t => t.value === $root.settings.roles.limitPerCustomerService.from).label"
                    clearable
                  >
                    <el-option
                      v-for="option in limitPerCustomerFrom"
                      :key="option.value"
                      :label="option.label"
                      :value="option.value"
                    >
                    </el-option>
                  </el-select>
                </el-col>
              </el-row>

              <LicenceBlock/>
            </div>

            <!-- Employees -->
            <el-form-item v-if="!notInLicence('starter')" :label="$root.labels.employees + ':'" prop="providers" id="providersElement">
              <el-select
                v-model="service.providers"
                value-key="id"
                placeholder=""
                multiple
                collapse-tags
                @change="changeEmployees"
              >
                <el-option
                  v-for="item in visibleEmployees"
                  :key="item.id"
                  :label="item.firstName + ' ' + item.lastName"
                  :value="item"
                >
                </el-option>
              </el-select>
            </el-form-item>

            <!-- Description -->
            <content-block
              :label="$root.labels.description"
              :entity="service"
              textProperty="description"
              htmlProperty="descriptionHtml"
              @showDialogTranslate="showDialogTranslate('serviceDescription')"
              :hasTranslation="true"
              :hasQuill="true"
              :textModeProp="true"
              :allowImage="false"
            >
            </content-block>
          </el-tab-pane>

          <!-- Duration & Pricing -->
          <el-tab-pane :label="$root.labels.duration_and_pricing" name="pricing">
            <el-row :gutter="24">

              <!-- Duration -->
              <el-col :span="12">
                <el-form-item :label="$root.labels.duration + ':'" prop="duration">
                  <el-select
                    v-model="service.duration"
                    placeholder=""
                    @change="clearValidation()"
                  >
                    <el-option
                      v-for="item in getPossibleDurationsInSeconds(service.duration)"
                      :key="item"
                      :label="secondsToNiceDuration(item)"
                      :disabled="isDurationSelected(item)"
                      :value="item"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>

              <!-- Price -->
              <el-col :span="12">
                <el-form-item :label="$root.labels.price + ':'" prop="price">
                  <div class="el-input">
                    <money v-model="service.price" v-bind="moneyComponentData" @input="priceChanged" class="el-input__inner"></money>
                  </div>
                </el-form-item>
              </el-col>

            </el-row>

            <!-- Pending Time -->
            <div :class="licenceClass('starter')">
            <el-row :gutter="24">

              <!-- Buffer Time Before -->
              <el-col :span="12">
                <el-form-item label="placeholder">
                  <label slot="label">
                    {{ $root.labels.service_buffer_time_before }}:
                    <el-tooltip placement="top">
                      <div slot="content" v-html="$root.labels.service_buffer_time_before_tooltip"></div>
                      <i class="el-icon-question am-tooltip-icon"></i>
                    </el-tooltip>
                  </label>
                  <el-select
                    v-model="service.timeBefore"
                    :disabled="notInLicence('starter')"
                    placeholder=""
                    clearable
                    @change="clearValidation()"
                  >
                    <el-option
                      v-for="item in getPossibleDurationsInSeconds(service.timeBefore)"
                      :key="item"
                      :label="secondsToNiceDuration(item)"
                      :value="item"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>

              <!-- Buffer Time After -->
              <el-col :span="12">
                <el-form-item label="placeholder">
                  <label slot="label">
                    {{ $root.labels.service_buffer_time_after }}:
                    <el-tooltip placement="top">
                      <div slot="content" v-html="$root.labels.service_buffer_time_after_tooltip"></div>
                      <i class="el-icon-question am-tooltip-icon"></i>
                    </el-tooltip>
                  </label>
                  <el-select
                    v-model="service.timeAfter"
                    :disabled="notInLicence('starter')"
                    placeholder=""
                    clearable
                    @change="clearValidation()"
                  >
                    <el-option
                      v-for="item in getPossibleDurationsInSeconds(service.timeAfter)"
                      :key="item"
                      :label="secondsToNiceDuration(item)"
                      :value="item"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>

            </el-row>
            <LicenceBlock :licence="'starter'"/>
            </div>
            <!-- Capacity -->
            <div :class="licenceClass('starter')">
            <el-row :gutter="24">

              <!-- Minimum Capacity -->
              <el-col :span="12">
                <el-form-item label="placeholder">
                  <label slot="label">
                    {{ $root.labels.minimum_capacity }}:
                    <el-tooltip placement="top">
                      <div slot="content" v-html="$root.labels.minimum_capacity_tooltip"></div>
                      <i class="el-icon-question am-tooltip-icon"></i>
                    </el-tooltip>
                  </label>
                  <el-input-number
                    v-model="service.minCapacity" :min="1"
                    :disabled="notInLicence('starter')"
                    @input="checkCapacityLimits()"
                  >
                  </el-input-number>
                </el-form-item>
              </el-col>

              <!-- Maximum Capacity -->
              <el-col :span="12">
                <el-form-item label="placeholder">
                  <label slot="label">
                    {{ $root.labels.maximum_capacity }}:
                    <el-tooltip placement="top">
                      <div slot="content" v-html="$root.labels.maximum_capacity_tooltip"></div>
                      <i class="el-icon-question am-tooltip-icon"></i>
                    </el-tooltip>
                  </label>
                  <el-input-number
                    v-model="service.maxCapacity"
                    :disabled="notInLicence('starter')"
                    :min="service.minCapacity"
                    @input="clearValidation()"
                  >
                  </el-input-number>
                </el-form-item>
              </el-col>

            </el-row>
            <LicenceBlock :licence="'starter'"/>
            </div>


            <!-- Bringing Anyone -->
            <div class="am-setting-box am-switch-box" v-if="service.maxCapacity > 1">
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

              <el-row v-if="maxExtraPeopleEnabled" style="margin-top: 10px">
                <el-col>
                  <el-form-item label="placeholder">
                    <label slot="label">
                      {{ $root.labels.limit_extra_people_set }}:
                    </label>
                    <el-input-number
                      v-model="service.maxExtraPeople"
                      :min="service.minCapacity - 1"
                      :max="service.maxCapacity - 1"
                      @input="clearValidation()"
                    >
                    </el-input-number>
                  </el-form-item>
                </el-col>
              </el-row>
            </div>

            <!-- Bringing Anyone -->
            <div class="am-setting-box am-switch-box" v-if="service.maxCapacity > 1">
              <el-row type="flex" align="middle" :gutter="24">
                <el-col :span="19">
                  {{ $root.labels.bringing_anyone }}
                  <el-tooltip placement="top">
                    <div slot="content" v-html="$root.labels.bringing_anyone_tooltip"></div>
                    <i class="el-icon-question am-tooltip-icon"></i>
                  </el-tooltip>
                </el-col>
                <el-col :span="5" class="align-right">
                  <el-switch
                    v-model="service.bringingAnyone"
                    active-text=""
                    inactive-text=""
                  >
                  </el-switch>
                </el-col>
              </el-row>
            </div>

            <!-- Aggregated Price -->
            <div class="am-setting-box am-switch-box" v-if="service.maxCapacity > 1 && service.bringingAnyone">
              <el-row type="flex" align="middle" :gutter="24">
                <el-col :span="19">
                  {{ $root.labels.aggregated_price }}
                  <el-tooltip placement="top">
                    <div slot="content" v-html="$root.labels.aggregated_price_tooltip"></div>
                    <i class="el-icon-question am-tooltip-icon"></i>
                  </el-tooltip>
                </el-col>
                <el-col :span="5" class="align-right">
                  <el-switch
                    v-model="service.aggregatedPrice"
                    active-text=""
                    inactive-text=""
                  >
                  </el-switch>
                </el-col>
              </el-row>
            </div>

            <div class="am-setting-box am-switch-box" :class="licenceClass()" v-if="service.duration">
              <!-- Custom Duration Enabled -->
              <el-row type="flex" align="middle" :gutter="24">
                <el-col :span="19">
                  {{ $root.labels.custom_duration_pricing_enabled }}
                </el-col>
                <el-col :span="5" class="align-right">
                  <el-switch
                    v-model="service.customPricing.enabled"
                    :disabled="notInLicence()"
                    active-text=""
                    inactive-text=""
                  >
                  </el-switch>
                </el-col>
              </el-row>

              <custom-duration
                v-if="service.customPricing.enabled"
                :service="service"
                :enabledDelete="true"
                :enabledAdd="true"
                :enabledDuration="true"
              >
              </custom-duration>

              <LicenceBlock/>
            </div>

            <div class="am-setting-box am-switch-box" :class="licenceClass()" v-if="depositAvailable()">
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
                    <label slot="label">
                      {{ $root.labels.deposit_payment }}:
                      <el-tooltip placement="top">
                        <div slot="content" v-html="$root.labels.deposit_payment_tooltip"></div>
                        <i class="el-icon-question am-tooltip-icon"></i>
                      </el-tooltip>
                    </label>
                    <el-select
                        v-model="depositPayment"
                        placeholder=""
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
                  <el-form-item :label="$root.labels.deposit_amount + (depositPayment === 'fixed' ? ' (' + getCurrencySymbol() + ')' : '') + (depositPayment === 'percentage' ? ' (%)' : '') +  ':'" prop="deposit">
                    <div v-if="depositPayment === 'fixed'" class="el-input">
                      <money v-model="service.deposit" v-bind="moneyComponentData" @input="depositChanged" class="el-input__inner"></money>
                    </div>

                    <el-input-number
                        v-if="depositPayment === 'percentage'"
                        v-model="service.deposit"
                        :min="0"
                        :max="100"
                        @input="depositChanged()"
                    >
                    </el-input-number>
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row :gutter="24" v-if="depositEnabled && service.aggregatedPrice && service.maxCapacity > 1 && depositPayment === 'fixed'">
                <el-col>
                  <el-checkbox v-model="service.depositPerPerson">
                    {{$root.labels.deposit_per_person}}
                    <el-tooltip placement="top">
                      <div slot="content" v-html="$root.labels.deposit_by_the_number_of_people"></div>
                      <i class="el-icon-question am-tooltip-icon"></i>
                    </el-tooltip>
                  </el-checkbox>
                </el-col>
              </el-row>

              <el-row class="am-service-deposit" :gutter="24" v-if="depositEnabled">
                <el-col>
                  <el-checkbox v-model="service.fullPayment">
                    {{$root.labels.allow_total_amount}}
                    <el-tooltip placement="top">
                      <div slot="content" v-html="$root.labels.allow_customers_to_pay_total"></div>
                      <i class="el-icon-question am-tooltip-icon"></i>
                    </el-tooltip>
                  </el-checkbox>
                  <hr>
                </el-col>
              </el-row>

              <el-row :gutter="24" v-if="depositEnabled" class="am-service-deposit">
                <el-col :span="24" :style="{display: 'flex'}">
                  <i class="el-icon-warning-outline" :style="{marginRight: '8px'}"></i>
                  <label>
                    {{service.extras.length === 0 ? $root.labels.deposit_info :
                      depositPayment === 'fixed' ? $root.labels.deposit_info_fixed :
                          $root.labels.deposit_info_percentage}}
                  </label>
                </el-col>
              </el-row>

              <LicenceBlock/>
            </div>
          </el-tab-pane>

          <!-- Gallery -->
          <el-tab-pane :label="$root.labels.gallery" name="gallery">
            <div class="am-gallery-images">
              <el-row :gutter="24">
                <draggable v-model="service.gallery" :options="draggableOptions" @end="dropGalleryImage">
                  <el-col :sm="12" v-for="(galleryImage, index) in service.gallery" :key="index">
                    <div class="am-gallery-image-wrapper">
                      <div class="am-gallery-image"
                           :style="{'background-image': 'url(' + galleryImage.pictureFullPath + ')'}">
                        <i class="el-icon-delete" @click="deleteGalleryImage(index)"></i>
                      </div>
                      <div class="am-gallery-image-title">
                      <span class="am-drag-handle">
                        <img class="svg-amelia" width="20px" :src="$root.getUrl+'public/img/burger-menu.svg'">
                      </span>
                        <span>{{ galleryImage.pictureFullPath.substring(galleryImage.pictureFullPath.lastIndexOf('/')+1) }}</span>
                      </div>
                    </div>
                  </el-col>
                </draggable>

                <!-- Add Gallery -->
                <el-col :sm="12">
                  <div class="am-gallery-image-add">

                    <div>
                      <picture-upload
                          :multiple="true"
                          :edited-entity="null"
                          :entity-name="'gallery'"
                          @pictureSelected="galleryPictureSelected"
                      >
                      </picture-upload>
                    </div>
                  </div>
                </el-col>

              </el-row>
            </div>

          </el-tab-pane>

          <!-- Extras -->
          <el-tab-pane v-if="notInLicence('starter') ? licenceVisible() : true" :label="$root.labels.extras" name="extras">
            <LicenceBlockHeader :licence="'starter'"/>

            <div :class="licenceClassDisabled('starter')" class="am-setting-box am-switch-box" v-if="service.extras.length > 0">
              <!-- mandatory extras -->
              <el-row type="flex" align="middle" :gutter="24">
                <el-col :span="19">
                  {{ $root.labels.mandatory_extra_enable }}
                </el-col>
                <el-col :span="5" class="align-right">
                  <el-switch
                      v-model="service.mandatoryExtra"
                      active-text=""
                      inactive-text=""
                  >
                  </el-switch>
                </el-col>
              </el-row>

              <el-row :gutter="24" v-if="service.mandatoryExtra" class="am-service-deposit">
                <el-col :span="24">
                  <el-form-item>
                    <label slot="label">
                      {{ $root.labels.min_required_extras }}:
                    </label>
                    <el-input-number
                        v-model="service.minSelectedExtras"
                        :min="1"
                        :max="service.extras.length"
                        @input="minSelectedExtrasChanged()"
                    >
                    </el-input-number>
                  </el-form-item>
                </el-col>
              </el-row>
            </div>

            <div
              class="am-extra-list"
              :class="licenceClassDisabled('starter')"
            >
              <el-button
                :disabled="notInLicence('starter')"
                @click="addExtra"
                size="large"
                type="primary"
                class="am-dialog-create"
              >
                <i class="el-icon-plus"></i> <span class="button-text">{{ $root.labels.add_extra }}</span>
              </el-button>

              <draggable v-model="service.extras" :options="draggableOptions" @end="dropExtra">
                <transition-group name="list-complete">
                  <div class="am-extra-item"
                       v-loading="extraToDeleteLoading && index === service.extras.indexOf(extraToDelete)"
                       v-for="(extra, index) in service.extras" :key="index + 1"
                       :id="'extra' + index">

                    <!-- Extra Preview -->
                    <el-row type="flex" align="top" class="">

                      <el-col :span="2">
                        <span class="am-drag-handle">
                          <img class="svg-amelia" width="20px" :src="$root.getUrl+'public/img/burger-menu.svg'">
                        </span>
                      </el-col>

                      <el-col :span="22">

                        <el-row type="flex" align="middle">
                          <el-col :span="18">
                            <h3>{{ extra.name }}</h3>
                          </el-col>
                          <el-col v-show="index !== service.extras.indexOf(editedExtra) || editedExtraOld !== null"
                                  :span="6" class="extra-item-actions align-right">
                            <span @click="showEditExtraDialog(extra)">
                              <img class="svg-amelia edit" width="16px" :src="$root.getUrl+'public/img/edit.svg'">
                            </span>
                            <span
                                v-if="$root.settings.capabilities.canDelete === true"
                                @click="showDeleteExtraDialog(extra)"
                            >
                              <img class="svg-amelia" width="16px" :src="$root.getUrl+'public/img/delete.svg'">
                            </span>
                          </el-col>
                        </el-row>

                        <div class="am-extra-item-data"
                             v-show="(editedExtra === null || index !== service.extras.indexOf(editedExtra)) && (extraToDelete === null || index !== service.extras.indexOf(extraToDelete))">
                          <el-row :gutter="24">
                            <el-col :sm="7">
                              <span class="data-title">{{ $root.labels.duration }}:</span>
                              <span class="data-value">
                                {{ extra.duration ? secondsToNiceDuration(extra.duration) : '/'}}
                              </span>
                            </el-col>
                            <el-col :sm="7">
                              <span class="data-title">{{ $root.labels.price }}:</span>
                              <span class="data-value">{{ getFormattedPrice(extra.price) }}</span>
                            </el-col>
                            <el-col :sm="10">
                              <span class="data-title">{{ $root.labels.maximum_quantity }}:</span>
                              <span class="data-value">{{ extra.maxQuantity }}</span>
                            </el-col>
                          </el-row>
                        </div>

                      </el-col>
                    </el-row>

                    <!-- Extra Delete -->
                    <el-collapse-transition>
                      <div class="am-confirmation"
                           v-show="extraToDelete !== null && index === service.extras.indexOf(extraToDelete)">
                        <p>{{ $root.labels.delete_extra_confirmation }}?</p>
                        <div class="align-right">
                          <el-button size="small" @click="hideDeleteExtraDialog()">{{ $root.labels.cancel }}</el-button>
                          <el-button size="small" @click="deleteExtra(extra)" type="primary">{{ $root.labels.delete }}
                          </el-button>
                        </div>
                      </div>
                    </el-collapse-transition>

                    <!-- Extra Edit -->
                    <el-collapse-transition>
                      <div
                          v-show="extraEditDialog === true && index === service.extras.indexOf(editedExtra)">
                        <el-form :model="extra" ref="extra" :rules="rulesExtra" label-position="top">

                          <!-- Extra Name -->
                          <el-form-item prop="name">
                            <label slot="label" class="am-service-name-label">
                              {{ $root.labels.name + ':' }}
                              <div class="am-service-translate" @click="showDialogTranslate('extraName', index)">
                                <img class="am-dialog-translate-svg" width="16px" :src="$root.getUrl+'public/img/translate.svg'">
                                {{ $root.labels.translate }}
                              </div>
                            </label>
                            <el-input v-model="extra.name" auto-complete="off"></el-input>
                          </el-form-item>

                          <!-- Duration & Price -->
                          <el-row :gutter="24">

                            <!-- Duration -->
                            <el-col :sm="8" :xs="12">
                              <el-form-item :label="$root.labels.duration + ':'">
                                <el-select
                                    v-model="extra.duration"
                                    clearable
                                    placeholder=""
                                >
                                  <el-option
                                      v-for="item in getPossibleDurationsInSeconds(extra.duration)"
                                      :key="item"
                                      :label="secondsToNiceDuration(item)"
                                      :value="item"
                                  >
                                  </el-option>
                                </el-select>
                              </el-form-item>
                            </el-col>

                            <!-- Price -->
                            <el-col :sm="8" :xs="12">
                              <el-form-item :label="$root.labels.price + ':'" prop="price">
                                <div class="el-input">
                                  <money v-model="extra.price" v-bind="moneyComponentData"
                                         class="el-input__inner"></money>
                                </div>
                              </el-form-item>
                            </el-col>

                            <!-- Maximum Capacity -->
                            <el-col :sm="8" :xs="24">
                              <el-form-item :label="$root.labels.maximum_quantity + ':'">
                                <el-input-number v-model="extra.maxQuantity" :min="1"></el-input-number>
                              </el-form-item>
                            </el-col>

                          </el-row>

                          <!-- Aggregated Price -->
                          <div class="am-setting-box am-switch-box" v-if="service.maxCapacity > 1 && extra.aggregatedPrice !== null && service.bringingAnyone">
                            <el-row type="flex" align="middle" :gutter="24">
                              <el-col :span="19">
                                {{ $root.labels.aggregated_price }}
                                <el-tooltip placement="top">
                                  <div slot="content" v-html="$root.labels.aggregated_price_tooltip"></div>
                                  <i class="el-icon-question am-tooltip-icon"></i>
                                </el-tooltip>
                              </el-col>
                              <el-col :span="5" class="align-right">
                                <el-switch
                                    v-model="extra.aggregatedPrice"
                                    active-text=""
                                    inactive-text=""
                                >
                                </el-switch>
                              </el-col>
                            </el-row>
                          </div>

                          <!-- Description -->
                          <content-block
                            :label="$root.labels.description"
                            :entity="service.extras[index]"
                            textProperty="description"
                            htmlProperty="descriptionHtml"
                            @showDialogTranslate="showDialogTranslate('extraDescription', index)"
                            :hasTranslation="true"
                            :hasQuill="true"
                            :textModeProp="true"
                            :allowImage="false"
                          >
                          </content-block>

                          <!-- Cancel & Save -->
                          <div class="align-right">
                            <el-button @click="cancelExtra(extra)" size="small">{{ $root.labels.cancel }}
                            </el-button>
                            <el-button size="small" @click="saveExtra(extra)" type="primary">{{ $root.labels.save }}
                            </el-button>
                          </div>

                        </el-form>
                      </div>
                    </el-collapse-transition>

                  </div>
                </transition-group>
              </draggable>

            </div>
          </el-tab-pane>

          <el-tab-pane :label="$root.labels.settings" name="settings">
            <entity-settings
                :settings="settings"
                :paymentsSettings="service.settings.payments"
                :generalSettings="service.settings.general"
                :zoomSettings="service.settings.zoom"
                :lessonSpaceSettings="service.settings.lessonSpace"
                :google-meet-settings="service.settings.googleMeet"
                :microsoft-teams-settings="service.settings.microsoftTeams"
                :providers="service.providers"
            >
            </entity-settings>
          </el-tab-pane>

        </el-tabs>
      </el-form>
    </div>

    <dialog-actions
        v-if="!dialogLoading"
        formName="service"
        urlName="services"
        :isNew="service.id === 0"
        :entity="service"
        :getParsedEntity="getParsedEntity"
        @validationTabFailCallback="validationTabFailCallback"
        :haveSaveConfirmation="haveSaveConfirmation"
        @validationFailCallback="validationFailCallback"
        :hasIcons="true"
        :updateStash="true"

        :status="{
          on: 'visible',
          off: 'hidden'
        }"

        :buttonText="{
          confirm: {
            save: {
              yes: $root.labels.update_for_all,
              no: $root.labels.no
            },
            status: {
              yes: service.status === 'visible' ? $root.labels.visibility_hide : $root.labels.visibility_show,
              no: $root.labels.visibility_show
            }
          }
        }"

        :action="{
          haveAdd: true,
          haveEdit: true,
          haveStatus: true,
          haveRemove: $root.settings.capabilities.canDelete === true,
          haveRemoveEffect: true,
          haveDuplicate: true
        }"

        :message="{
          success: {
            save: $root.labels.service_saved,
            remove: $root.labels.service_deleted,
            show: $root.labels.service_visible,
            hide: $root.labels.service_hidden
          },
          confirm: {
            save: $root.labels.confirm_global_change_service,
            remove: $root.labels.confirm_delete_service,
            show: $root.labels.confirm_show_service,
            hide: $root.labels.confirm_hide_service,
            duplicate: $root.labels.confirm_duplicate_service
          },
        }"
    >
    </dialog-actions>

  </div>
</template>

<script>
  import licenceMixin from '../../../js/common/mixins/licenceMixin'
  import imageMixin from '../../../js/common/mixins/imageMixin'
  import dateMixin from '../../../js/common/mixins/dateMixin'
  import durationMixin from '../../../js/common/mixins/durationMixin'
  import priceMixin from '../../../js/common/mixins/priceMixin'
  import helperMixin from '../../../js/backend/mixins/helperMixin'
  import settingsMixin from '../../../js/common/mixins/settingsMixin'
  import serviceMixin from '../../../js/common/mixins/serviceMixin'
  import PictureUpload from '../parts/PictureUpload.vue'
  import Form from 'form-object'
  import Draggable from 'vuedraggable'
  import { Money } from 'v-money'
  import notifyMixin from '../../../js/backend/mixins/notifyMixin'
  import DialogActions from '../parts/DialogActions.vue'
  import EntitySettings from '../parts/EntitySettings.vue'
  import DialogTranslate from '../parts/DialogTranslate'
  import ContentBlock from '../parts/ContentBlock'
  import CustomDuration from '../../parts/assignedServices/CustomDuration'

  export default {
    mixins: [
      licenceMixin,
      imageMixin,
      dateMixin,
      durationMixin,
      priceMixin,
      serviceMixin,
      notifyMixin,
      helperMixin,
      settingsMixin
    ],

    props: {
      categories: null,
      passedService: null,
      employees: null,
      settings: null,
      futureAppointments: null,
      newExtraTranslations: null
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
          this.serviceTabs = 'pricing'

          callback(new Error(this.$root.labels.enter_positive_price_warning))
        } else {
          callback()
        }
      }

      return {
        durations: [],
        depositEnabled: false,
        mandatoryExtraEnabled: false,
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
        executeUpdate: true,
        dialogLoading: true,
        appointmentsEmployees: [],
        colorPopover: false,
        draggableOptions: {
          animation: 150,
          group: 'people',
          handle: '.am-drag-handle'
        },
        editedExtra: null,
        editedExtraOld: null,
        extraEditDialog: false,
        extraToDelete: null,
        extraToDeleteLoading: false,
        form: new Form(),
        rulesExtra: {
          name: [
            {required: true, message: this.$root.labels.enter_extra_name_warning, trigger: 'submit'}
          ],
          price: [
            {validator: validateNonNegativePrice, trigger: 'submit'},
            {required: true, message: this.$root.labels.enter_extra_price_warning, trigger: 'submit', type: 'number'}
          ]
        },
        rulesService: {
          name: [
            {required: true, message: this.$root.labels.enter_name_warning, trigger: 'submit'}
          ],
          categoryId: [
            {
              required: true,
              message: this.$root.labels.select_service_category_warning,
              trigger: 'submit',
              type: 'number'
            }
          ],
          duration: [
            {
              required: true,
              message: this.$root.labels.select_service_duration_warning,
              trigger: 'submit',
              type: 'number'
            }
          ],
          price: [
            {validator: validateNonNegativePrice, trigger: 'submit'},
            {required: true, message: this.$root.labels.enter_service_price_warning, trigger: 'submit', type: 'number'}
          ],
          deposit: [
            {validator: validatePositiveValue, trigger: 'submit'}
          ],
          providers: [
            {required: true, message: this.$root.labels.select_service_employee_warning, trigger: 'submit'}
          ]
        },
        recurringCycles: [
          {
            label: this.$root.labels.disabled,
            value: 'disabled'
          },
          {
            label: this.$root.labels.all,
            value: 'all'
          },
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
          }
        ],
        recurringSubs: [
          {
            label: this.$root.labels.disabled,
            value: 'disabled'
          },
          {
            label: this.$root.labels.service_recurring_sub_future,
            value: 'future'
          },
          {
            label: this.$root.labels.service_recurring_sub_past,
            value: 'past'
          },
          {
            label: this.$root.labels.service_recurring_sub_both,
            value: 'both'
          }
        ],
        recurringPayments: [
          {
            label: this.$root.labels.service_recurring_payment_none,
            value: 0
          },
          {
            label: this.$root.labels.service_recurring_payment_all,
            value: 999
          }
        ],
        limitPerCustomerTimeFrames: [
          {
            label: this.$root.labels.hour,
            value: 'hour'
          },
          {
            label: this.$root.labels.day,
            value: 'day'
          },
          {
            label: this.$root.labels.week,
            value: 'week'
          },
          {
            label: this.$root.labels.month,
            value: 'month'
          },
          {
            label: this.$root.labels.year,
            value: 'year'
          }
        ],
        limitPerCustomerFrom: [
          {
            label: this.$root.labels.limit_app_date_booked,
            value: 'dateBooked'
          },
          {
            label: this.$root.labels.limit_app_booking_date,
            value: 'bookingDate'
          }
        ],
        service: null,
        serviceColors: [
          '1788FB',
          '4BBEC6',
          'FBC22D',
          'FA3C52',
          'D696B8',
          '689BCA',
          '26CC2B',
          'FD7E35',
          'E38587',
          '774DFB'
        ],
        serviceTabs: 'service_details',
        style: '',
        maxExtraPeopleEnabled: false
      }
    },

    created () {
      Form.defaults.axios = this.$http

      this.instantiateDialog()
    },

    updated () {
      this.instantiateDialog()
      if (this.service && (!this.service.limitPerCustomer || !this.service.limitPerCustomer.period)) {
        let element = document.getElementById('am-limit-service-period')
        if (element) {
          element.getElementsByClassName('el-input__inner')[0].value = ''
        }
      }
      if (this.service && (!this.service.limitPerCustomer || !this.service.limitPerCustomer.numberOfApp)) {
        let element = document.getElementById('am-limit-service-number')
        if (element) {
          element.getElementsByClassName('el-input__inner')[0].value = ''
        }
      }
    },

    methods: {
      changeMaxExtraPeople () {
        if (this.maxExtraPeopleEnabled && this.service.maxExtraPeople === null) {
          this.service.maxExtraPeople = this.service.minCapacity - 1
        }
      },

      minSelectedExtrasChanged () {
        if (this.service.minSelectedExtras > this.service.extras.length) {
          this.service.minSelectedExtras = this.service.extras.length
        }
      },

      depositAvailable () {
        return parseFloat(this.service.price) > 0 || (this.service.customPricing && this.service.customPricing.enabled ? this.service.customPricing.durations.filter(i => i.price) : false)
      },

      depositEnabledChanged () {
        if (this.depositEnabled) {
          this.service.depositPayment = this.depositPayment
        } else {
          this.service.depositPayment = 'disabled'
        }
      },

      getMaxPrice () {
        let maxPrice = this.service.price

        if (this.service.customPricing && this.service.customPricing.enabled) {
          this.service.customPricing.durations.forEach((item) => {
            if (item.price > maxPrice) {
              maxPrice = item.price
            }
          })
        }

        return maxPrice
      },

      depositChanged () {
        let maxPrice = this.getMaxPrice()

        if (this.service.deposit > maxPrice && this.depositPayment === 'fixed') {
          this.service.deposit = maxPrice
        }
      },

      priceChanged () {
        let maxPrice = this.getMaxPrice()

        if (this.service.deposit > maxPrice && this.depositPayment === 'fixed') {
          this.service.deposit = maxPrice
        }
      },

      isDurationSelected (duration) {
        return this.service.customPricing.durations.map(i => i.duration).includes(duration)
      },

      instantiateDialog () {
        if (this.passedService !== null && this.executeUpdate === true) {
          this.service = JSON.parse(JSON.stringify(this.passedService))

          this.maxExtraPeopleEnabled = this.service.maxExtraPeople !== null

          if (this.service.description.startsWith('<!-- Content -->')) {
            this.service.descriptionHtml = this.service.description
          }

          if (this.service.depositPayment === 'disabled') {
            this.depositEnabled = false
          } else {
            this.depositEnabled = true

            this.depositPayment = this.service.depositPayment
          }

          // If service is duplicated use duplicated service employees
          if (this.service.duplicated !== true) {
            this.$set(this.service, 'providers', this.selectedVisibleEmployees)
          }

          if (this.service.limitPerCustomer === null) {
            this.service.limitPerCustomer = {enabled: this.$root.settings.roles.limitPerCustomerService.enabled, numberOfApp: null, period: null, timeFrame: null, from: null}
          } else if (this.service.id !== 0) {
            this.service.limitPerCustomer = JSON.parse(this.service.limitPerCustomer)
          }

          // Set extra duration to empty string if duration is null, because of element-ui select clearable button
          for (let i = 0; i < this.service.extras.length; i++) {
            if (this.service.extras[i].duration === null) {
              this.service.extras[i].duration = ''
            }
          }

          if (this.service.id in this.futureAppointments) {
            this.appointmentsEmployees = this.futureAppointments[this.service.id]
          }
          this.service.extras.sort((a, b) => (a.position > b.position) ? 1 : -1)

          if (this.employees.length === 1) {
            this.service.providers = [this.employees[0]]
          }

          if (!this.service.recurringCycle) {
            this.service.recurringCycle = 'disabled'
          }

          this.dialogLoading = false
          this.executeUpdate = false
        }
      },

      validationFailCallback () {
        if (this.service.providers.length === 0) {
          this.serviceTabs = 'service_details'
          this.scrollViewInModal('providersElement')
        }
      },

      galleryUpdated (gallery) {
        this.service.gallery = gallery
      },

      closeDialog () {
        this.$emit('closeDialog')
      },

      getParsedEntity (applyGlobally) {
        if (typeof this.$refs.extra !== 'undefined') {
          for (let i = 0; i < this.$refs.extra.length; i++) {
            this.$refs.extra[i].validate((valid) => {
              if (valid) {
                this.$refs.extra[i].clearValidate()
                return true
              } else {
                this.serviceTabs = 'extras'
                return false
              }
            })
          }
        }

        let serviceSettings = this.prepareBookableEntityPaymentsForSave(this.prepareServiceSettingsForSave(this.service))

        this.service.providers = this.service.providers.map(employee => employee.id)
        this.service.applyGlobally = applyGlobally

        if (!this.depositEnabled) {
          this.service.depositPayment = 'disabled'
        } else {
          this.service.depositPayment = this.depositPayment
        }

        if (!this.service.aggregatedPrice) {
          this.service.depositPerPerson = 0
        }

        if (!this.maxExtraPeopleEnabled || this.service.maxCapacity <= 1) {
          this.service.maxExtraPeople = null
        }

        return Object.assign(
          JSON.parse(JSON.stringify(this.service)),
          {
            settings: serviceSettings ? JSON.stringify(serviceSettings) : null,
            customPricing: this.getJsonCustomPricing(this.service.customPricing),
            limitPerCustomer: JSON.stringify(this.service.limitPerCustomer)
          }
        )
      },

      haveSaveConfirmation () {
        let customDurationChanged = false

        this.service.customPricing.durations = this.service.customPricing.durations.filter(item => item.duration)

        this.service.customPricing.durations.forEach((serviceItem) => {
          this.passedService.customPricing.durations.forEach((passedServiceItem) => {
            if (serviceItem.duration === passedServiceItem.duration && serviceItem.price !== passedServiceItem.price) {
              customDurationChanged = true
            }
          })
        })

        return this.service.id && (
          this.passedService.price !== this.service.price ||
          this.passedService.minCapacity !== this.service.minCapacity ||
          this.passedService.maxCapacity !== this.service.maxCapacity ||
          customDurationChanged
        )
      },

      bgColor (color) {
        return {'background-color': color}
      },

      servicePictureSelected (pictureFullPath, pictureThumbPath) {
        this.service.pictureFullPath = pictureFullPath
        this.service.pictureThumbPath = pictureThumbPath
      },

      galleryPictureSelected (pictureFullPath, pictureThumbPath) {
        this.clearValidation()
        this.service.gallery.push({
          id: 0,
          pictureFullPath: pictureFullPath,
          pictureThumbPath: pictureThumbPath,
          position: this.service.gallery.length + 1
        })
      },

      deleteGalleryImage (index) {
        this.service.gallery.splice(index, 1)

        for (let i = 0; i < this.service.gallery.length; i++) {
          this.service.gallery[i].position = i + 1
        }
      },

      dropGalleryImage (e) {
        if (e.newIndex !== e.oldIndex) {
          let that = this
          this.service.gallery.forEach((image) => {
            image.position = that.service.gallery.indexOf(image) + 1
          })
        }
      },

      changeServiceColor (e) {
        let siblings = Array.from(e.target.parentNode.children)
        siblings.forEach(function (sib) {
          if (sib.className.includes('color-active')) {
            sib.classList.remove('color-active')
          }
        })
        e.target.className = e.target.className + ' color-active'
        this.service.color = e.target.getAttribute('data-color')
      },

      checkCapacityLimits () {
        this.clearValidation()
        if (this.service.minCapacity > this.service.maxCapacity) {
          this.service.maxCapacity = this.service.minCapacity
        }
        if (this.maxExtraPeopleEnabled && this.service.maxExtraPeople < this.service.minCapacity - 1) {
          this.service.maxExtraPeople = this.service.minCapacity - 1
        }
      },

      showEditExtraDialog (extra) {
        if (extra.aggregatedPrice === null) {
          extra.aggregatedPrice = this.service.aggregatedPrice
        }

        this.handleExtraForm()
        this.editedExtra = extra
        this.editedExtraOld = Object.assign({}, extra)
        this.extraToDelete = null
        this.extraEditDialog = true
      },

      cancelExtra (extra) {
        if (this.editedExtraOld !== null) {
          extra.name = this.editedExtraOld.name
          extra.duration = this.editedExtraOld.duration
          extra.price = this.editedExtraOld.price
          extra.maxQuantity = this.editedExtraOld.maxQuantity
          extra.description = this.editedExtraOld.description
        }
        this.editedExtra = null
        this.editedExtraOld = null
        this.extraEditDialog = false

        // Remove newly created extra if it is not saved
        if (typeof extra.id === 'undefined' && extra.isNew === true) {
          this.service.extras.splice(-1, 1)
        }
      },

      addExtra () {
        this.handleExtraForm()
        this.extraEditDialog = true
        this.editedExtra = {
          name: '',
          duration: '',
          price: '',
          maxQuantity: 1,
          description: '',
          serviceId: this.service.id,
          position: this.service.extras.length + 1,
          isNew: true
        }
        this.service.extras.push(this.editedExtra)
        this.scrollViewInModal('extra' + (this.service.extras.length - 1))
      },

      saveExtra (extra) {
        let index = this.service.extras.indexOf(extra)
        if (this.passedService.extras[index]) {
          this.service.extras[index].translations = this.passedService.extras[index].translations
        } else {
          this.service.extras[index].translations = this.newExtraTranslations
        }
        this.$refs.extra[index].validate((valid) => {
          if (valid) {
            this.editedExtra = null
            this.editedExtraOld = null
            this.extraEditDialog = false
            this.$refs.extra[index].clearValidate()
          } else {
            return false
          }
        })

        this.service.extras[index].isNew = false
        this.$emit('extraSaved', this.service.extras[index], index)
      },

      showDeleteExtraDialog (extra) {
        this.handleExtraForm()
        this.extraToDelete = extra
        this.editedExtra = null
        this.extraEditDialog = false
      },

      handleExtraForm () {
        // If new extra form is active, remove this extra
        if (this.editedExtra !== null && typeof this.editedExtra.id === 'undefined') {
          this.service.extras.splice(-1, 1)
        }
        // If edit extra form is active, revert extra to old state
        if (this.editedExtraOld !== null) {
          this.cancelExtra(this.editedExtra)
        }
      },

      hideDeleteExtraDialog () {
        this.extraToDelete = null
        this.extraEditDialog = true
      },

      deleteExtra (extra) {
        if (typeof extra.id === 'undefined') {
          let index = this.service.extras.indexOf(extra)
          this.service.extras.splice(index, 1)
        } else {
          this.extraToDeleteLoading = true
          this.$http.post(`${this.$root.getAjaxUrl}/extras/delete/` + extra.id)
            .then(() => {
              let index = this.service.extras.indexOf(extra)
              this.service.extras.splice(index, 1)
              this.passedService.extras.splice(index, 1)
              if (this.passedService.minSelectedExtras > this.passedService.extras.length) {
                this.passedService.minSelectedExtras = this.passedService.extras.length
              }
              if (this.service.minSelectedExtras > this.service.extras.length) {
                this.service.minSelectedExtras = this.service.extras.length
              }
              if (this.service.minSelectedExtras === 0 || this.passedService.minSelectedExtras === 0) {
                this.service.mandatoryExtra = false
                this.passedService.mandatoryExtra = false
              }
              this.extraToDeleteLoading = false
            })
            .catch(() => {
              this.extraToDeleteLoading = false
              this.notify(this.$root.labels.error, this.$root.labels.extra_delete_fail, 'error')
            })
        }

        for (let i = 0; i < this.service.extras.length; i++) {
          this.service.extras[i].position = i + 1
        }
      },

      dropExtra (e) {
        if (e.newIndex !== e.oldIndex) {
          let that = this
          this.service.extras.forEach((extra) => {
            extra.position = that.service.extras.indexOf(extra) + 1
          })
        }
      },

      clearValidation () {
        if (typeof this.$refs.service !== 'undefined') {
          this.$refs.service.clearValidate()
        }
      },

      changeEmployees () {
        let selectedEmployees = this.service.providers.map(employee => employee.id)

        let intersection = this.appointmentsEmployees.filter(x => !selectedEmployees.includes(x))

        if (intersection.length) {
          let $this = this
          let unselectedEmployees = []

          intersection.forEach(function (employeeId) {
            unselectedEmployees.push($this.visibleEmployees.filter(employee => employee.id === employeeId)[0])
            $this.notify($this.$root.labels.error, $this.$root.labels.service_provider_remove_fail, 'error')
          })

          this.service.providers = this.service.providers.concat(unselectedEmployees).sort(function (a, b) {
            return (a.firstName + ' ' + a.lastName).localeCompare((b.firstName + ' ' + b.lastName))
          })
        }
      },

      showDialogTranslate (dialogType, extraIndex = 0) {
        switch (dialogType) {
          case 'serviceName':
            this.$emit('showDialogTranslate', 'name', 'service')
            break
          case 'serviceDescription':
            this.$emit('showDialogTranslate', 'description', 'service')
            break
          case 'extraName':
            this.$emit('showDialogTranslate', 'name', 'extra', extraIndex)
            break
          case 'extraDescription':
            this.$emit('showDialogTranslate', 'description', 'extra', extraIndex)
            break
        }
      },

      validationTabFailCallback () {
        this.serviceTabs = 'pricing'
      }
    },

    computed: {
      visibleCategories () {
        return this.categories.filter(category => category.status === 'visible')
      },

      visibleEmployees () {
        return this.employees.filter(employee =>
          (employee.status === 'visible') ||
          (employee.status === 'hidden' && employee.serviceList.map(service => service.id).indexOf(this.service.id) !== -1)
        )
      },

      selectedVisibleEmployees () {
        return this.employees.filter(employee =>
          employee.serviceList.map(service => service.id).indexOf(this.service.id) !== -1
        )
      }
    },

    watch: {
      'service.price' () {
        this.clearValidation()
      },
      'passedService.translations' () {
        if (this.service) {
          this.service.translations = this.passedService.translations
        }
      }
    },

    components: {
      DialogTranslate,
      PictureUpload,
      Draggable,
      Money,
      EntitySettings,
      ContentBlock,
      DialogActions,
      CustomDuration
    }
  }
</script>
