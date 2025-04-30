<template>
  <div
    id="am-confirm-booking"
    class="am-confirmation-booking"
    :class="[dialogClass, ($root.settings.customization.hasOwnProperty('forms') && $root.settings.customization.forms.hasOwnProperty(formType)) ? `am-form-${formType}-${formName}-${bookableType}` : '']"
  >

    <!-- Confirm Booking Form -->
    <div v-show="fetched">

      <!-- Header Error-->
      <div class="am-payment-error">
        <el-alert
          :id="'am-payment-error-' + $root.shortcodeData.counter"
          :title="headerErrorMessage !== '' ? headerErrorMessage : $root.labels.payment_error"
          type="warning"
          v-show="headerErrorShow"
          show-icon
        >
        </el-alert>
      </div>
      <!-- /Header Error-->

      <!-- Confirm Dialog Header -->
      <div class="am-confirmation-booking-header" v-show="fetched" v-if="bookableType === 'appointment' && serviceHeadingVisibility">
        <img :src="pictureLoad(bookable, false)" @error="imageLoadError(bookable, false)" :alt="bookable.name"/>
        <h2 :style="{fontWeight: 500, fontFamily: $root.settings.customization.font}" :class="`am-block-${formType}-${formName}-${bookableType}`">
          {{ bookable.name }}
        </h2>
      </div>
      <!-- /Confirm Dialog Header -->

      <!-- Confirm Dialog Package -->
      <div class="am-confirmation-booking-package-wrapper" v-if="bookableType === 'package' && hasHeader">

        <!-- Package Header -->
        <div class="am-package-header">
          <!-- Package Header Image Data container -->
          <div class="am-package-header-image-data-wrapper">
            <!-- Package Image -->
            <div class="am-package-image">
              <img :src="pictureLoad(bookable, false)" @error="imageLoadError(bookable, false)"/>
              <span :style="{'background-color': bookable.color}">
                <img :src="$root.getUrl + 'public/img/am-package-catalog.svg'">
              </span>
            </div>
            <!-- /Package Image -->

            <!-- Package Data -->
            <div class="am-package-data">

              <!-- Package Name -->
              <div class="am-package-title">
                <h2 :style="{fontWeight: 500, fontFamily: $root.settings.customization.font}">
                  {{ bookable.name }}
                </h2>
              </div>
              <!-- /Package Name -->
            </div>
            <!-- /Package Data -->
          </div>
          <!-- /Package Header Image Data container -->

          <!-- Package Price Container -->
          <div class="am-package-price" v-if="bookable.price">
            <!-- Package Price -->
            <div class="am-package-price__wrapper" :class="{'am-service-price__wrapper-discount': bookable.discount && !bookable.calculatedPrice}">
              {{ getFormattedPrice(bookable.price, !$root.settings.payments.hideCurrencySymbolFrontend) }}
            </div>
            <!-- /Package Price -->

            <!-- Package Discount -->
            <div v-if="bookable.discount && !bookable.calculatedPrice" class="am-package-price__discount">
              <img class="am-package-price__discount-image" :src="$root.getUrl + 'public/img/am-package-catalog.svg'">
              <div class="am-package-price__discount-text">
                {{ $root.labels.package_discount_text + ' ' + bookable.discount + '%' }}
              </div>
            </div>
            <!-- /Package Discount -->
          </div>
          <!-- /Package Price Container -->

        </div>
        <!-- /Package Header -->
      </div>
      <!-- /Confirm Dialog Package -->

      <!-- Confirm Dialog Body -->
      <el-form
        :model="appointment.bookings[0]"
        ref="booking"
        :rules="rules"
        label-position="top"
        @submit.prevent="onSubmit"
        class="am-confirm-booking-form"
      >
        <el-row class="am-confirm-booking-data" :gutter="24">
          <!-- Booking Data -->
          <el-col :sm="24" v-if="bookableType === 'appointment'">
            <confirm-heading-data-form-field
              :bookable-start="bookable.bookingStart"
              :provider="provider"
              :location="location"
              :form-field="formsData[formName][bookableType].itemsStatic"
            ></confirm-heading-data-form-field>
          </el-col>
          <!-- /Booking Data -->

          <el-col :sm="24" v-if="recurringData.length && recurringStringVisibility">
            <recurring-string-form-field
              :recurring-string="recurringString"
              :form-field="formsData[formName][bookableType].itemsStatic"
            ></recurring-string-form-field>
          </el-col>

          <template v-for="(formField, key) in formsData[formName][bookableType].itemsDraggable">
            <component
              :is="key"
              :appointment="appointment"
              :columns-lg="columnsLg"
              :form-valid-options="formValidOptions"
              :errors="errors"
              :phone-populated="!!phonePopulated"
              :class-identifier="($root.settings.customization.hasOwnProperty('forms') && $root.settings.customization.forms.hasOwnProperty(formType)) ? `${formType}-${formName}-${bookableType}` : ''"
              :formField="formField"
              @inputChanges="validateFieldsForPayPal"
            >
            </component>
          </template>

          <!-- Custom Fields -->
          <div class="am-custom-fields">
            <el-row :gutter="24">
              <el-col
                v-for="(customField, key) in customFields"
                v-if="isBookableCustomFieldVisible(customField)"
                :key="customField.id"
                :sm="columnsLg"
                :ref="'customFields.' + customField.id + '.value'"
              >
                <el-form-item
                  :label="(customField.type !== 'content' && customField.type !== 'checkbox' && customField.type !== 'radio') && customField.label ? customField.label : ''"
                  :prop="customField.required === true && customField.type !== 'content' && customField.type !== 'file' ? 'customFields.' + customField.id + '.value' : (customField.required === true && customField.type !== 'file' ? 'inputFile' : null)"
                  :error="errors.files && customField.type === 'file' && customField.required ? errors.files['files' + customField.id] : null"
                  :class="[
                    getCustomFieldClass(customField),
                    ($root.settings.customization.hasOwnProperty('forms') && $root.settings.customization.forms.hasOwnProperty(formType)) ? `am-custom-${formType}-${formName}-${bookableType}` : ''
                  ]"
                >
                  <span
                    v-if="(customField.type === 'checkbox' || customField.type === 'radio') && customField.label" v-html="customField.label ? '<label class=' + '\'el-form-item__label\'>' + customField.label + '</label>' : ''"
                    :class="(customField.type === 'checkbox' || customField.type === 'radio') && customField.required ? 'am-custom-required-as-html' : ''">
                  </span>

                  <!-- Text Field -->
                  <el-input
                    v-if="customField.type === 'text'"
                    placeholder=""
                    v-model="appointment.bookings[0].customFields[customField.id].value"
                    @input="validateFieldsForPayPal()"
                  >
                  </el-input>
                  <!-- /Text Field -->

                  <!-- Address Field -->
                  <div class="el-input" v-if="customField.type === 'address'" :style="{marginBottom: $root.settings.general.gMapApiKey ? '':0}">
                    <vue-google-autocomplete
                      v-if="googleMapsLoaded()"
                      :ref="'amelia-cf-address-'+customField.id"
                      :id="'address-autocomplete-'+customField.id"
                      classname="el-input__inner"
                      @change="setAddressCF($event, customField.id)"
                      placeholder=""
                      types=""
                    >
                    </vue-google-autocomplete>
                    <el-input
                      v-else
                      placeholder=""
                      v-model="appointment.bookings[0].customFields[customField.id].value"
                      @input="validateFieldsForPayPal()"
                    >
                    </el-input>
                  </div>
                  <!-- /Address Field -->

                  <!-- Text Area -->
                  <el-input
                    v-else-if="customField.type === 'text-area'"
                    class="am-front-texarea"
                    placeholder=""
                    v-model="appointment.bookings[0].customFields[customField.id].value"
                    type="textarea"
                    :rows="3"
                    @input="validateFieldsForPayPal()"
                  >
                  </el-input>
                  <!-- /Text Area -->

                  <!-- Text Content -->
                  <div v-else-if="customField.type === 'content'" class="am-text-content">
                    <i class="el-icon-info"></i>
                    <p style='display: inline;' v-html="customField.label"></p>
                  </div>
                  <!-- /Text Content -->

                  <!-- Selectbox -->
                  <el-select
                    v-else-if="customField.type === 'select'"
                    v-model="appointment.bookings[0].customFields[customField.id].value"
                    :popper-class="($root.settings.customization.hasOwnProperty('forms') && $root.settings.customization.forms.hasOwnProperty(formType)) ? `am-dropdown-${formType}-${formName}-${bookableType}` : ''"
                    placeholder=""
                    clearable
                    @change="validateFieldsForPayPal()"
                  >
                    <el-option
                      v-for="(option, index) in getCustomFieldOptions(customField.options)"
                      :key="index"
                      :value="option"
                      :label="option"
                      :style="{'color': appointment.bookings[0].customFields[customField.id].value === option ? bookable.color : ''}"
                    >
                    </el-option>
                  </el-select>
                  <!-- /Selectbox -->

                  <!-- Checkbox -->
                  <el-checkbox-group
                    v-else-if="customField.type === 'checkbox'"
                    v-model="appointment.bookings[0].customFields[customField.id].value"
                    @change="selectedCustomFieldValue"
                  >
                    <el-checkbox
                      v-for="(option, index) in getCustomFieldOptions(customField.options)"
                      :key="index"
                      :label="option"
                    >
                    </el-checkbox>
                  </el-checkbox-group>
                  <!-- /Checkbox -->

                  <!-- Radio Buttons -->
                  <el-radio-group
                    v-else-if="customField.type === 'radio'"
                    v-model="appointment.bookings[0].customFields[customField.id].value"
                    @change="selectedCustomFieldValue"
                  >
                    <el-radio
                      v-for="(option, index) in getCustomFieldOptions(customField.options)"
                      :key="index"
                      :label="option"
                      ref="customFieldsRadioButtons"
                    >
                    </el-radio>
                  </el-radio-group>
                  <!-- /Radio Buttons -->

                  <!-- Upload Files -->
                  <div v-if="customField.type === 'file'">
                    <el-upload
                      :auto-upload="false"
                      action=""
                      drag
                      ref="customFieldsFiles"
                      :accept="$root.fileUploadExtensions.join(',')"
                      :on-change="onSelectFiles"
                      multiple
                    >
                      <i class="el-icon-upload"></i><span>{{$root.labels.file_upload}}</span>
                    </el-upload>
                  </div>
                  <!-- /Upload Files -->

                  <!-- Date picker -->
                  <div v-if="customField.type === 'datepicker'">
                    <v-date-picker
                      v-model="appointment.bookings[0].customFields[customField.id].value"
                      class='am-calendar-picker'
                      @input="validateFieldsForPayPal()"
                      mode='single'
                      popover-visibility="focus"
                      popover-direction="top"
                      :popover-align="screenWidth < 768 ? 'center' : 'left'"
                      :tint-color='"#1A84EE"'
                      :show-day-popover=false
                      :input-props='{class: "el-input__inner"}'
                      input-class="el-input__inner"
                      :is-expanded=false
                      :is-required=true
                      :disabled=false
                      :formats="vCalendarFormats"
                    ></v-date-picker>
                  </div>
                  <!-- /Date picker -->

                </el-form-item>
              </el-col>

              <!-- Recaptcha -->
              <el-col
                :sm="columnsLg"
                :class="$root.settings.general.googleRecaptcha.invisible ? '' : 'am-confirm-booking-recaptcha'"
                v-if="$root.settings.general.googleRecaptcha.enabled"
              >
                <el-form-item :error="errors.recaptcha">
                  <div id="recaptcha">
                    <vue-recaptcha
                      ref="recaptcha"
                      :size="$root.settings.general.googleRecaptcha.invisible ? 'invisible' : null"
                      @verify="onRecaptchaVerify"
                      @expired="onRecaptchaExpired"
                      :loadRecaptchaScript="true"
                      class="am-confirm-booking-recaptcha-block"
                      :sitekey="$root.settings.general.googleRecaptcha.siteKey">
                    </vue-recaptcha>
                  </div>
                </el-form-item>
              </el-col>
              <!-- /Recaptcha -->
            </el-row>
          </div>
          <!-- /Custom Fields -->

        </el-row>

        <!-- Payment Method & Stripe Card -->
        <el-row :gutter="24" class="am-confirm-booking-payment">

          <!-- Payment Method -->
          <el-col
          :span="formsData[formName][bookableType].itemsStatic.paymentMethodFormField.switchPaymentMethodView &&
           formsData[formName][bookableType].itemsStatic.paymentMethodFormField.switchPaymentMethodView === 'Selectbox' ? 12 : 24">
            <payment-method-form-field
              :total-price="getTotalPrice() > 0"
              :bookable-color="bookable.color"
              :payment-options="paymentOptions"
              :appointment="appointment"
              :classIdentifier="($root.settings.customization.hasOwnProperty('forms') && $root.settings.customization.forms.hasOwnProperty(formType)) ? `${formType}-${formName}-${bookableType}` : ''"
              :form-field="formsData[formName][bookableType].itemsStatic"
              @changeItem="validateFieldsForPayPal()"
            ></payment-method-form-field>
          </el-col>
          <!-- /Payment Method -->

          <!-- Stripe Card -->
          <el-col :sm="columnsLg">
            <stripe-card-form-field
              :appointment="appointment"
              :errors="errors"
              :total-price="getTotalPrice() > 0"
              :stripe-payment="stripePayment"
              :class-identifier="($root.settings.customization.hasOwnProperty('forms') && $root.settings.customization.forms.hasOwnProperty(formType)) ? `${formType}-${formName}-${bookableType}` : ''"
              :form-field="formsData[formName][bookableType].itemsStatic"
            ></stripe-card-form-field>
          </el-col>
          <!-- /Stripe Card -->

        </el-row>
        <!-- /Payment Method & Stripe Card -->

        <el-row class="am-confirm-booking-data" :gutter="24">

          <!-- Payment Type -->
          <el-col  :sm="24" :lg="24">
            <payment-type-form-field
              :show="bookable.depositData && bookable.depositData.depositFullPayment && getPaymentGateway() !== 'onSite'"
              :bookable-color="bookable.color"
              :classIdentifier="($root.settings.customization.hasOwnProperty('forms') && $root.settings.customization.forms.hasOwnProperty(formType)) ? `${formType}-${formName}-${bookableType}` : ''"
              :form-field="formsData[formName][bookableType].itemsStatic"
              @changeItem="paymentTypeChanged"
            >
            </payment-type-form-field>
          </el-col>
          <!-- Payment Type -->

        </el-row>

        <!-- Appointment Data -->
        <el-row>
          <el-col :sm="24">

            <!-- Payment Data -->
            <div class="am-confirmation-booking-cost" v-if="!packageData" :style="{paddingTop: '16px'}">

              <!-- Number Of Persons -->
              <el-row :gutter="24" v-if="bookable.maxCapacity > 1">
                <el-col :span="12">
                  <p>{{ priceLabels.total_number_of_persons.value || $root.labels.total_number_of_persons }}</p>
                </el-col>
                <el-col :span="12">
                  <p class="am-semi-strong am-align-right">
                    {{ bookable.ticketsData ? bookable.ticketsData.totalTickets : appointment.bookings[0].persons }}
                  </p>
                </el-col>
              </el-row>
              <!-- /Number Of Persons -->

              <!-- Appointment Price -->
              <el-row :gutter="24" v-for="(item, index) in instantPaymentBasePriceData" :key="index">
                <el-col :span="6">
                  <p :style="{'visibility': index === 0 ? 'visible' : 'hidden'}">
                    {{ priceLabels.base_price_colon.value || $root.labels.base_price_colon }}
                  </p>
                </el-col>
                <el-col :span="18">
                  <p class="am-semi-strong am-align-right">
                    {{ bookable.ticketsData ? getBookingTicketsBasePriceCalculationString(bookable.ticketsData) :
                      getBookingBasePriceCalculationString(item.count, item.price) }}
                  </p>
                </el-col>
              </el-row>
              <!-- /Appointment Price -->

              <!-- Extras Price -->
              <el-row
                class="am-confirmation-extras-cost" :gutter="24"
                v-if="appointment.bookings[0].extras.length > 0 && amountData.instant.total > 0"
              >
                <el-collapse
                  accordion v-if="selectedExtras.length > 0"
                  :class="($root.settings.customization.hasOwnProperty('forms') && $root.settings.customization.forms.hasOwnProperty(formType)) ? `am-block-${formType}-${formName}-${bookableType}`: ''"
                >
                  <el-collapse-item name="1">
                    <template slot="title">
                      <div class="am-extras-title">
                        {{ priceLabels.extras_costs_colon.value || $root.labels.extras_costs_colon }}
                      </div>
                      <div
                        class="am-extras-total-cost am-semi-strong"
                        :style="bookableType === 'event' && !useGlobalCustomization ? getBookableColor(false) : {}"
                      >
                        {{ getFormattedPrice(getExtrasPrice(instantPaymentBookingsCount), !$root.settings.payments.hideCurrencySymbolFrontend) }}
                      </div>
                    </template>
                    <div v-for="extra in selectedExtras">
                      <div class="am-extras-details">{{ extra.name }}</div>
                      <div class="am-extras-cost">{{ getSelectedExtraDetails(extra) }}</div>
                    </div>
                  </el-collapse-item>
                </el-collapse>
                <div v-else>
                  <el-col :span="12">
                    <p>{{ priceLabels.extras_costs_colon.value || $root.labels.extras_costs_colon }}</p>
                  </el-col>
                  <el-col :span="12">
                    <p class="am-semi-strong am-align-right">
                      {{ getFormattedPrice(getExtrasPrice(instantPaymentBookingsCount), !$root.settings.payments.hideCurrencySymbolFrontend) }}
                    </p>
                  </el-col>
                </div>
              </el-row>
              <!-- /Extras Price -->

              <!-- Coupon -->
              <el-row
                :gutter="0" class="am-add-coupon am-flex-row-middle-align"
                v-if="$root.settings.payments.coupons && amountData.instant.total > 0"
              >

                <!-- Coupon Label -->
                <el-col v-if="bookableType === 'appointment'" :sm="10" :xs="10">
                  <img :src="$root.getUrl+'public/img/coupon.svg'" class="svg-amelia" alt="add-coupon">
                  <span>{{ $root.labels.add_coupon }}</span>
                </el-col>
                <el-col v-else :sm="10" :xs="10">
                  <svg width="16px" height="16px" viewBox="0 0 16 16" version="1.1" xmlns="http://www.w3.org/2000/svg">
                    <desc>Created with Sketch.</desc>
                    <defs></defs>
                    <g id="Icons" stroke="none" stroke-width="1" :style="{'fill':bookable.color}" fill-rule="evenodd">
                      <g id="Group" :fill="bookable.color">
                        <path
                          :style="{'fill':bookable.color}"
                          d="M7.152,12.7704615 C6.29353846,11.5809231 6.26092308,10.8652308 6.23446154,10.2904615 C6.22953846,10.1852308 6.22584615,10.0978462 6.21661538,10.0055385 C6.17415385,9.54953846 5.84676923,8.64738462 5.22769231,7.74461538 C4.37538462,6.49907692 3.79384615,4.63569231 4.95876923,3.48307692 C5.232,3.21230769 5.58523077,3.06953846 5.97907692,3.06953846 C6.952,3.06953846 7.98892308,4.02892308 8.61538462,4.85846154 L8.61538462,3.55261538 L8.61538462,1.23261538 C8.61538462,0.552615385 8.06276923,0 7.38461538,0 L5.53661538,0 C5.36861538,0 5.232,0.134769231 5.22892308,0.302769231 C5.22092308,0.804923077 4.80738462,1.21353846 4.30769231,1.21353846 C3.80738462,1.21353846 3.39446154,0.804923077 3.38646154,0.302769231 C3.38338462,0.134769231 3.24676923,0 3.07876923,0 L1.23076923,0 C0.552,0 0,0.552615385 0,1.23261538 L0,12.3058462 C0,12.9858462 0.552,13.5384615 1.23076923,13.5384615 L3.07692308,13.5384615 C3.24676923,13.5384615 3.38461538,13.4006154 3.38461538,13.2307692 C3.38461538,12.7206154 3.79876923,12.3058462 4.30769231,12.3058462 C4.81661538,12.3058462 5.23076923,12.7206154 5.23076923,13.2307692 C5.23076923,13.4006154 5.36861538,13.5384615 5.53846154,13.5384615 L7.38461538,13.5384615 C7.52430769,13.5384615 7.65907692,13.5101538 7.78707692,13.4646154 C7.56738462,13.2683077 7.352,13.048 7.152,12.7704615"
                          id="Fill-1450"
                        ></path>
                        <path
                          :style="{'fill':bookable.color}"
                          d="M15.9536615,11.8383385 C15.9487385,11.8303385 15.4373538,10.9934154 15.0724308,9.83095385 C14.9881231,9.55956923 14.8816615,9.17741538 14.7604308,8.73987692 C14.1825846,6.66295385 13.6588923,4.89741538 13.0865846,4.32141538 C12.9450462,4.17987692 12.5161231,3.74787692 9.58812308,3.26295385 C9.50135385,3.2488 9.40843077,3.27341538 9.33950769,3.33187692 C9.27058462,3.39033846 9.23058462,3.47587692 9.23058462,3.56633846 L9.23058462,6.03956923 C9.23058462,6.16449231 9.30627692,6.27710769 9.42258462,6.32449231 L10.3192,6.68941538 C10.3782769,6.90172308 10.4908923,7.28572308 10.6016615,7.56572308 C10.5487385,7.65310769 10.5050462,7.75341538 10.4570462,7.86233846 C10.3764308,8.04695385 10.2878154,8.25064615 10.1518154,8.40018462 C9.55489231,8.01741538 8.95181538,6.91895385 8.56781538,5.96264615 C8.26504615,5.20756923 6.93273846,3.69926154 5.97889231,3.69926154 C5.74996923,3.69926154 5.54750769,3.78110769 5.3912,3.93495385 C4.49643077,4.81926154 5.01766154,6.35649231 5.73581538,7.40449231 C6.3272,8.26849231 6.7672,9.29187692 6.82996923,9.95218462 C6.83981538,10.0611077 6.84473846,10.1644923 6.84966154,10.2666462 C6.87489231,10.8100308 6.90073846,11.3724923 7.65089231,12.4112615 C8.04289231,12.9534154 8.50135385,13.2721846 8.98627692,13.6100308 C9.67858462,14.0912615 10.3942769,14.5897231 11.1179692,15.8457231 C11.1727385,15.9411077 11.2742769,16.0001846 11.3844308,16.0001846 C15.0004308,16.0001846 15.9819692,12.1115692 15.9912,12.0721846 C16.0108923,11.9921846 15.9967385,11.9084923 15.9536615,11.8383385"
                          id="Fill-1452"
                        ></path>
                      </g>
                    </g>
                  </svg>
                  <span :style="{'color': bookable.color}">{{ $root.labels.add_coupon }}</span>
                </el-col>
                <!-- /Coupon Label -->

                <!-- Coupon Input -->
                <el-col :sm="14" :xs="14">
                  <el-form
                    :model="appointment.bookings[0].customer"
                    ref="coupon"
                    :rules="rules"
                    label-position="top"
                    @keyup.enter.native="onSubmitCoupon"
                    status-icon
                  >
                    <el-form-item
                      :style="bookableType === 'event' && !useGlobalCustomization ? getBookableColor(false) : {}"
                      :class="($root.settings.customization.hasOwnProperty('forms') && $root.settings.customization.forms.hasOwnProperty(formType)) ? `am-input-${formType}-${formName}-${bookableType}`: ''"
                      :error="errors.coupon"
                      prop="couponCode"
                    >
                      <el-input
                        v-model="coupon.code"
                        @input="validateFieldsForPayPal()"
                        type="text"
                        size="small"
                        class="am-add-coupon-field"
                        :style="bookableType === 'event' && !useGlobalCustomization ? getBookableColor(false) : {}"
                        native-type="submit"
                        @keydown.enter.native="onSubmitCoupon"
                      >
                        <!-- Coupon Button -->
                        <el-button
                          class="am-add-coupon-button"
                          slot="append"
                          size="mini"
                          icon="el-icon-check"
                          @click="checkCoupon"
                          :disabled="coupon.code ? coupon.code.trim() === '' : true"
                          :style="bookableType === 'event' && !useGlobalCustomization ? getBookableColor(true) : {}"
                          native-type="submit"
                        >
                        </el-button>
                        <!-- /Coupon Button -->

                      </el-input>
                    </el-form-item>
                  </el-form>
                </el-col>
                <!-- /Coupon Input -->

              </el-row>
              <!-- /Coupon -->

              <!-- Coupons Used Message -->
              <el-row class="am-coupon-limit" v-show="$root.settings.payments.coupons && recurringData.length && couponLimit < recurringData.length + 1 && (coupon.discount || coupon.deduction)">
                <el-col :sm="2" :xs="4">
                  <div style="display: inline-block;">
                    <img :src="$root.getUrl+'public/img/coupon-limit.svg'" class="svg-amelia" alt="coupon-limit">
                  </div>
                </el-col>

                <el-col :sm="22" :xs="20">
                  <div class="am-coupon-limit-text">
                    <strong>{{ $root.labels.coupons_used }}</strong>
                    <p>{{ $root.labels.coupons_used_description }} {{ couponLimit }}</p>
                  </div>
                </el-col>
              </el-row>
              <!-- /Coupons Used Message -->

              <div
                v-if="amountData.instant.total > 0"
                class="am-confirmation-total"
              >
              <!-- :style="{'color': bookable.color, 'background-color': bookableType === 'event' && !useGlobalCustomization ? '#E8E8E8' : ''}" -->
                <!-- SubTotal Price -->
                <el-row :gutter="24" v-if="amountData.instant.discount > 0 || amountData.instant.tax > 0">
                  <el-col :span="12">
                    <p>
                      {{ priceLabels.subtotal_colon.value || $root.labels.subtotal_colon }}
                    </p>
                  </el-col>
                  <el-col :span="12">
                    <p class="am-semi-strong am-align-right" :style="{'color': bookable.color}">
                      {{ getFormattedPrice(amountData.instant.total, !$root.settings.payments.hideCurrencySymbolFrontend) }}
                    </p>
                  </el-col>
                </el-row>
                <!-- /SubTotal Price -->

                <!-- Discount Amount -->
                <el-row :gutter="24" v-if="amountData.instant.discount > 0">
                  <el-col :span="12">
                    <p>{{ priceLabels.discount_amount_colon.value || $root.labels.discount_amount_colon }}</p>
                  </el-col>
                  <el-col :span="12">
                    <p class="am-semi-strong am-align-right" :style="{'color': bookable.color}">
                      {{ getFormattedPrice(amountData.instant.discount, !$root.settings.payments.hideCurrencySymbolFrontend) }}
                    </p>
                  </el-col>
                </el-row>
                <!-- /Discount Amount -->

                <!-- Tax Amount -->
                <el-row :gutter="24" v-if="amountData.instant.tax > 0">
                  <el-col :span="12">
                    <p>
                      {{ getTaxLabel() }}
                    </p>
                  </el-col>
                  <el-col :span="12">
                    <p class="am-semi-strong am-align-right" :style="{'color': bookable.color}">
                      {{ getFormattedPrice(amountData.instant.tax, !$root.settings.payments.hideCurrencySymbolFrontend) }}
                    </p>
                  </el-col>
                </el-row>
                <!-- /Tax Amount -->

                <!-- Total Price -->
                <el-row :gutter="24" :class="{'am-confirmation-total-bordered': !onlyTotal}">
                  <el-col :span="12">
                    <p>
                      {{ priceLabels.total_cost_colon.value || $root.labels.total_cost_colon }}
                    </p>
                  </el-col>
                  <el-col :span="12">
                    <p class="am-semi-strong am-align-right" :style="{'color': bookable.color}">
                      {{ getFormattedPrice(getTotalPrice(), !$root.settings.payments.hideCurrencySymbolFrontend) }}
                    </p>
                  </el-col>
                </el-row>
                <!-- /Total Price -->

                <!-- Deposit -->
                <el-row
                  class="am-confirmation-deposit" :gutter="24" v-if="withDeposit"
                  :style="{'color': bookable.color}"
                >
                  <el-col :span="12">
                    <p>{{ priceLabels.deposit.value || $root.labels.deposit }} <label class="am-confirmation-deposit-info">{{ priceLabels.pay_now.value || $root.labels.pay_now }}</label></p>
                  </el-col>
                  <el-col :span="12">
                    <p class="am-semi-strong am-align-right" :style="{'color': bookable.color}">
                      {{ getFormattedPrice(amountData.instant.deposit, !$root.settings.payments.hideCurrencySymbolFrontend) }}
                    </p>
                  </el-col>
                </el-row>

                <el-row
                  class="am-confirmation-deposit-price"
                  :gutter="24" v-if="withDeposit"
                  :style="{'color': bookable.color}"
                >
                  <el-col :span="12">
                    <p>{{ priceLabels.pay_later.value || $root.labels.pay_later }}</p>
                  </el-col>
                  <el-col :span="12">
                    <p class="am-semi-strong am-align-right" :style="{'color': bookable.color}">
                      {{ getFormattedPrice(getTotalPrice() - amountData.instant.deposit, !$root.settings.payments.hideCurrencySymbolFrontend) }}
                    </p>
                  </el-col>
                </el-row>
                <!-- /Deposit -->

              </div>

              <!-- Recurring Price -->
              <el-row
                class="am-confirmation-extras-cost" :gutter="24"
                v-if="recurringData.length && amountData.postponed.total > 0"
              >
                <el-collapse
                  accordion
                  :class="($root.settings.customization.hasOwnProperty('forms') && $root.settings.customization.forms.hasOwnProperty(formType)) ? `am-block-${formType}-${formName}-${bookableType}`: ''"
                >
                  <el-collapse-item name="1">
                    <template slot="title">
                      <div class="am-extras-title">{{ priceLabels.recurring_costs_colon.value || $root.labels.recurring_costs_colon }}</div>
                      <div class="am-extras-total-cost am-semi-strong">
                        {{ getFormattedPrice(amountData.postponed.total - amountData.postponed.discount + amountData.postponed.tax, !$root.settings.payments.hideCurrencySymbolFrontend) }}
                      </div>
                    </template>
                    <div v-for="(item, key) in amountData.postponed.totals" :key="key">
                      <div class="am-extras-details" :style="{'visibility': key === 0 ? 'visible' : 'hidden'}">
                        {{ priceLabels.base_price_colon.value || $root.labels.base_price_colon }}
                      </div>
                      <div class="am-extras-cost">
                        {{ item.count + ' ' + (item.count ? $root.labels.appointments.toLowerCase() : $root.labels.appointment.toLowerCase()) + ' x ' + getFormattedPrice(item.total, !$root.settings.payments.hideCurrencySymbolFrontend) + ' = ' + getFormattedPrice(item.count * item.total, !$root.settings.payments.hideCurrencySymbolFrontend) }}
                      </div>
                    </div>
                    <div v-if="amountData.postponed.discount">
                      <div class="am-extras-details"> {{ priceLabels.discount_amount_colon.value || $root.labels.discount_amount_colon }}</div>
                      <div class="am-extras-cost">
                        {{ getFormattedPrice(amountData.postponed.discount, !$root.settings.payments.hideCurrencySymbolFrontend) }}
                      </div>
                    </div>
                    <div v-if="amountData.postponed.tax">
                      <div class="am-extras-details">
                        {{ getTaxLabel() }}
                      </div>
                      <div class="am-extras-cost">{{ getFormattedPrice(amountData.postponed.tax, !$root.settings.payments.hideCurrencySymbolFrontend) }}
                      </div>
                    </div>
                  </el-collapse-item>
                </el-collapse>
              </el-row>
              <!-- /Recurring Price -->

            </div>
            <div
              class="am-confirmation-total am-confirmation-booking-cost"
              v-else-if="bookable.price > 0"
            >
              <!-- SubTotal Price -->
              <el-row :gutter="24" v-if="amountData.instant.tax > 0">
                <el-col :span="12">
                  <p>
                    {{ priceLabels.subtotal_colon.value || $root.labels.subtotal_colon }}
                  </p>
                </el-col>
                <el-col :span="12">
                  <p class="am-semi-strong am-align-right" :style="{'color': bookable.color}">
                    {{ getFormattedPrice(amountData.instant.total, !$root.settings.payments.hideCurrencySymbolFrontend) }}
                  </p>
                </el-col>
              </el-row>
              <!-- /SubTotal Price -->

              <!-- Tax Amount -->
              <el-row :gutter="24" v-if="amountData.instant.tax > 0">
                <el-col :span="12">
                  <p>
                    {{ getTaxLabel() }}
                  </p>
                </el-col>
                <el-col :span="12">
                  <p class="am-semi-strong am-align-right">
                    {{ getFormattedPrice(amountData.instant.tax, !$root.settings.payments.hideCurrencySymbolFrontend) }}
                  </p>
                </el-col>
              </el-row>
              <!-- /Tax Amount -->

              <!-- Total Price -->
              <el-row :gutter="24" v-if="bookable.price > 0" :class="{'am-confirmation-total-bordered': !onlyTotal}">
                <el-col :span="12">
                  <p>
                    {{ priceLabels.total_cost_colon.value || $root.labels.total_cost_colon }}
                  </p>
                </el-col>
                <el-col :span="12">
                  <p class="am-semi-strong am-align-right" :style="{'color': bookable.color}">
                    {{ getFormattedPrice(amountData.instant.total + amountData.instant.tax, !$root.settings.payments.hideCurrencySymbolFrontend) }}
                  </p>
                </el-col>
              </el-row>
              <!-- /Total Price -->

              <!-- Deposit -->
              <el-row class="am-confirmation-deposit" :gutter="24" v-if="withDeposit">
                <el-col :span="12">
                  <p>{{ priceLabels.deposit.value || $root.labels.deposit }} <label class="am-confirmation-deposit-info">{{ priceLabels.pay_now.value || $root.labels.pay_now }}</label></p>
                </el-col>
                <el-col :span="12">
                  <p class="am-semi-strong am-align-right" :style="{'color': bookable.color}">
                    {{ getFormattedPrice(amountData.instant.deposit, !$root.settings.payments.hideCurrencySymbolFrontend) }}
                  </p>
                </el-col>
              </el-row>

              <el-row
                class="am-confirmation-deposit-price"
                :gutter="24"
                v-if="withDeposit">
                <el-col :span="12">
                  <p>{{ priceLabels.pay_later.value || $root.labels.pay_later }}</p>
                </el-col>
                <el-col :span="12">
                  <p class="am-semi-strong am-align-right" :style="{'color': bookable.color}">
                    {{ getFormattedPrice(getTotalPrice() - amountData.instant.deposit, !$root.settings.payments.hideCurrencySymbolFrontend) }}
                  </p>
                </el-col>
              </el-row>
              <!-- /Deposit -->
            </div>
            <!-- /Payment Data -->

          </el-col>
        </el-row>
        <!-- /Appointment Data -->

      </el-form>
      <!-- /Confirm Dialog Body -->

      <!-- Confirm Dialog Footer -->
      <div class="dialog-footer payment-dialog-footer" slot="footer">
        <div
          v-if="hasCancel"
          class="el-button el-button--default"
          :style="bookableType === 'event' ? bookableCancelStyle : ''"
          @mouseleave="setBookableCancelStyle(false)"
          @mouseover="setBookableCancelStyle(true)"
          @click="cancelBooking()"
        >
          <span :style="bookableType === 'event' ? bookableCancelSpanStyle : ''">{{ $root.labels.cancel }}</span>
        </div>

        <div
          v-show="$root.settings.payments.payPal.enabled && appointment.payment.gateway === 'payPal' && getTotalPrice() !== 0"
          class="paypal-button el-button el-button--primary"
          :style="bookableType === 'event' ? bookableConfirmStyle : ''"
          @mouseleave="setBookableConfirmStyle(false)"
          @mouseover="setBookableConfirmStyle(true)"
        >
          <div id="am-paypal-button-container"></div>
          <span>{{ $root.labels.confirm }}</span>
        </div>

        <div
          v-show="showConfirmBookingButton"
          class="el-button el-button--primary"
          :style="bookableType === 'event' ? bookableConfirmStyle : ''"
          @mouseleave="setBookableConfirmStyle(false)"
          @mouseover="setBookableConfirmStyle(true)"
          @click="confirmBooking()"
        >
          <span>{{ $root.labels.confirm }}</span>
        </div>
      </div>
      <!-- /Confirm Dialog Footer -->

    </div>
    <!-- /Confirm Booking Form -->

    <!-- Spinner & Waiting For Payment -->
    <div id="am-spinner" class="am-booking-fetched" v-show="!fetched && !paid">
      <h4
        v-if="appointment.payment.gateway === 'payPal'"
        :style="{color: (bookableType === 'event' && formType === 'eventListForm') ? formsData.globalSettings.formTextColor : formsData[$options.name][bookableType].globalSettings.formTextColor}"
      >
        {{ $root.labels.waiting_for_payment }}
      </h4>
      <h4
        v-else
        :style="{color: (bookableType === 'event' && formType === 'eventListForm') ? formsData.globalSettings.formTextColor : formsData[$options.name][bookableType].globalSettings.formTextColor}"
      >
        {{ $root.labels.please_wait }}
      </h4>
      <div class="am-svg-wrapper">

        <!-- Oval Spinner -->
        <span v-if="bookableType === 'event' && !useGlobalCustomization">
          <svg width="160" height="160" class="am-spin" viewBox="0 0 38 38" xmlns="http://www.w3.org/2000/svg" stroke="#7F8FA4">
            <g fill="none" fill-rule="evenodd">
              <g transform="translate(1 1)" stroke-width="2">
                <path d="M36 18c0-9.94-8.06-18-18-18" :style="{'stroke':bookable.color}" :stroke="bookable.color">
                  <animateTransform
                    attributeName="transform"
                    type="rotate"
                    from="0 18 18"
                    to="360 18 18"
                    dur="1s"
                    repeatCount="indefinite"
                  />
                </path>
              </g>
            </g>
          </svg>

          <!-- HourGlass -->
          <svg width="12px" height="16px" class="am-hourglass" viewBox="0 0 12 16" version="1.1" xmlns="http://www.w3.org/2000/svg">
            <g id="Icons" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" transform="translate(-2.000000, 0.000000)">
              <g id="sat" transform="translate(2.000000, 0.000000)" :style="{'fill': bookable.color}">
                <path
                  :style="{'fill': bookable.color, 'stroke': 'none'}"
                  d="M8.37968,4.8 L3.32848,4.8 C3.22074667,4.8 3.12368,4.86506667 3.08208,4.9648 C3.04101333,5.06453333 3.06394667,5.1792 3.14021333,5.25546667 L5.67834667,7.79093333 C5.72794667,7.84106667 5.79621333,7.86933333 5.86661333,7.86933333 C5.95941333,7.8672 6.00634667,7.84106667 6.05594667,7.7904 L8.56901333,5.2544 C8.64474667,5.1776 8.66714667,5.06346667 8.62554667,4.96426667 C8.58448,4.86453333 8.48741333,4.8 8.37968,4.8"
                  id="Fill-694"
                ></path>
                <path
                  :style="{'fill': bookable.color, 'stroke': 'none'}"
                  d="M6.82293333,7.62293333 C6.6144,7.83146667 6.6144,8.16853333 6.82293333,8.37706667 L9.04,10.5941333 C9.74506667,11.2992 10.1333333,12.2368 10.1333333,13.2341333 L10.1333333,14.4 L9.2,14.4 L6.08,10.24 C5.9792,10.1056 5.75413333,10.1056 5.65333333,10.24 L2.53333333,14.4 L1.6,14.4 L1.6,13.2341333 C1.6,12.2368 1.98826667,11.2992 2.69333333,10.5941333 L4.9104,8.37706667 C5.11893333,8.16853333 5.11893333,7.83146667 4.9104,7.62293333 L2.69333333,5.40586667 C1.98826667,4.7008 1.6,3.7632 1.6,2.7664 L1.6,1.6 L10.1333333,1.6 L10.1333333,2.7664 C10.1333333,3.7632 9.74506667,4.7008 9.04,5.40586667 L6.82293333,7.62293333 Z M11.2,2.7664 L11.2,1.45173333 C11.5173333,1.26666667 11.7333333,0.9264 11.7333333,0.533333333 L11.7333333,0.266666667 C11.7333333,0.119466667 11.6138667,0 11.4666667,0 L0.266666667,0 C0.119466667,0 0,0.119466667 0,0.266666667 L0,0.533333333 C0,0.9264 0.216,1.26666667 0.533333333,1.45173333 L0.533333333,2.7664 C0.533333333,4.048 1.03253333,5.25386667 1.9392,6.16 L3.7792,8 L1.9392,9.84 C1.03253333,10.7461333 0.533333333,11.952 0.533333333,13.2341333 L0.533333333,14.5482667 C0.216,14.7333333 0,15.0736 0,15.4666667 L0,15.7333333 C0,15.8805333 0.119466667,16 0.266666667,16 L11.4666667,16 C11.6138667,16 11.7333333,15.8805333 11.7333333,15.7333333 L11.7333333,15.4666667 C11.7333333,15.0736 11.5173333,14.7333333 11.2,14.5482667 L11.2,13.2341333 C11.2,11.952 10.7008,10.7461333 9.79413333,9.84 L7.95413333,8 L9.79413333,6.16 C10.7008,5.25386667 11.2,4.048 11.2,2.7664 L11.2,2.7664 Z"
                    id="Fill-696"
                ></path>
              </g>
            </g>
          </svg>
        </span>

        <span v-else>
          <img class="svg-amelia am-spin" :src="$root.getUrl+'public/img/oval-spinner.svg'"/>
          <img class="svg-amelia am-hourglass" :src="$root.getUrl+'public/img/hourglass.svg'"/>
        </span>
      </div>
    </div>
    <!-- /Spinner & Waiting For Payment -->

  </div>
</template>

<script>
import moment from 'moment'
import taxesMixin from '../../../js/common/mixins/taxesMixin'
import marketingMixin from '../../../js/frontend/mixins/marketingMixin'
import imageMixin from '../../../js/common/mixins/imageMixin'
import dateMixin from '../../../js/common/mixins/dateMixin'
import priceMixin from '../../../js/common/mixins/priceMixin'
import helperMixin from '../../../js/backend/mixins/helperMixin'
import windowMixin from '../../../js/backend/mixins/windowMixin'
import customFieldMixin from '../../../js/common/mixins/customFieldMixin'
import VueRecaptcha from 'vue-recaptcha'
import confirmHeadingDataFormField from './formFields/ConfirmHeadingDataFormField'
import recurringStringFormField from './formFields/RecurringStringFormField'
import firstNameFormField from './formFields/FirstNameFormField'
import lastNameFormField from './formFields/LastNameFormField'
import emailFormField from './formFields/EmailFormField'
import phoneFormField from './formFields/PhoneFormField'
import paymentMethodFormField from './formFields/PaymentMethodFormField'
import paymentTypeFormField from './formFields/PaymentTypeFormField'
import stripeCardFormField from './formFields/StripeCardFormField'
import VueGoogleAutocomplete from 'vue-google-autocomplete'
import formsCustomizationMixin from '../../../js/common/mixins/formsCustomizationMixin'

export default {
  name: 'confirmBookingForm',

  mixins: [
    taxesMixin,
    imageMixin,
    dateMixin,
    priceMixin,
    helperMixin,
    customFieldMixin,
    windowMixin,
    formsCustomizationMixin
  ],

  props: {
    trigger: null,
    passedCategoryId: null,
    couponCode: '',
    paymentGateway: '',
    queryParams: {},
    status: null,
    phonePopulated: null,
    containerId: null,
    recurringString: '',
    useGlobalCustomization: false,
    bookableType: null,
    taxes: {
      default: () => [],
      type: Array
    },
    bookable: {
      default: () => {},
      type: Object
    },
    recurringData: {
      default: () => []
    },
    packageData: null,
    hasCancel: true,
    hasHeader: true,
    appointment: {
      default: () => {},
      type: Object
    },
    marketing: null,
    provider: {
      default: () => {},
      type: Object
    },
    location: {
      default: () => {},
      type: Object
    },
    service: {
      type: Object,
      default: () => {}
    },
    dialogClass: {
      default: '',
      type: String
    },
    customFields: {
      default: () => []
    },
    formType: {
      type: String
    },
    formsData: {
      type: Object,
      default: function () {
        return {}
      }
    }
  },

  data () {
    let validateCoupon = (rule, bookings, callback) => {
      let field = document.getElementsByClassName('am-add-coupon-field')[0].getElementsByClassName('el-input__suffix')[0]

      if (this.coupon.code) {
        this.coupon.code = this.coupon.code.trim()
        this.$http.post(`${this.$root.getAjaxUrl}/coupons/validate`, {
          'code': this.coupon.code,
          'id': this.bookable.id,
          'type': this.bookableType,
          'user': this.appointment.bookings[0]['customer']
        }).then(response => {
          // Customization hook
          if ('afterSuccessCouponValidated' in window) {
            window.afterSuccessCouponValidated(this.appointment, this.bookable, this.provider, this.location)
          }
          this.coupon = response.data.data.coupon
          this.couponLimit = response.data.data.limit
          if (typeof field !== 'undefined') {
            field.style.visibility = 'visible'
          }
          callback()
        }).catch(e => {
          this.coupon.discount = 0
          this.coupon.deduction = 0

          if (e.response.data.data.couponUnknown === true) {
            callback(new Error(this.$root.labels.coupon_unknown))
          } else if (e.response.data.data.couponInvalid === true) {
            callback(new Error(this.$root.labels.coupon_invalid))
          } else if (e.response.data.data.couponExpired === true) {
            callback(new Error(this.$root.labels.coupon_expired))
          } else {
            callback()
          }

          if (typeof field !== 'undefined') {
            field.style.visibility = 'hidden'
          }
        })
      } else {
        if (typeof field !== 'undefined') {
          field.style.visibility = 'hidden'
        }
        callback()
      }
    }

    let validatePhone = (rule, input, callback) => {
      if (input && input !== '' && !input.startsWith('+')) {
        callback(new Error(this.$root.labels.enter_valid_phone_warning))
      } else {
        callback()
      }
    }

    return {
      paymentType: 'depositOnly',
      validRecaptcha: false,
      recaptchaResponse: false,
      customFieldsFiles: [],
      stripePayment: {
        stripe: null,
        cardElement: null
      },
      hoverConfirm: false,
      hoverCancel: false,
      columnsLg: 12,
      couponLimit: 0,
      coupon: {
        code: '',
        discount: 0,
        deduction: 0
      },
      clearValidate: true,
      errors: {
        email: '',
        phone: '',
        coupon: '',
        stripe: '',
        recaptcha: '',
        files: {}
      },
      fetched: true,
      paid: false,
      headerErrorMessage: '',
      headerErrorShow: false,
      payPalActions: null,
      rules: {
        'customer.firstName': [
          {required: true, message: this.$root.labels.enter_first_name_warning, trigger: 'submit'}
        ],
        'customer.lastName': [
          {
            required: this.formsData[this.$options.name][this.bookableType].itemsDraggable.lastNameFormField.required,
            message: this.$root.labels.enter_last_name_warning,
            trigger: 'submit'
          }
        ],
        'customer.email': [
          {
            required: this.formsData[this.$options.name][this.bookableType].itemsDraggable.emailFormField.required,
            message: this.$root.labels.enter_email_warning,
            trigger: 'submit'
          },
          {type: 'email', message: this.$root.labels.enter_valid_email_warning, trigger: 'submit'}
        ],
        'customer.phone': [
          {
            required: this.formsData[this.$options.name][this.bookableType].itemsDraggable.phoneFormField.required,
            message: this.$root.labels.enter_phone_warning,
            trigger: 'submit'
          },
          {validator: validatePhone, trigger: 'submit'}
        ],
        couponCode: [
          {validator: validateCoupon, trigger: 'submit'}
        ]
      },
      formValidOptions: {},
      formName: this.$options.name,
      serviceHeadingVisibility: this.formsData[this.$options.name][this.bookableType].itemsStatic.confirmServiceHeadingFormField ? this.formsData[this.$options.name][this.bookableType].itemsStatic.confirmServiceHeadingFormField.visibility : true,
      recurringStringVisibility: this.formsData[this.$options.name][this.bookableType].itemsStatic.recurringStringFormField ? this.formsData[this.$options.name][this.bookableType].itemsStatic.recurringStringFormField.visibility : true
    }
  },

  created () {
    this.inlineSVG()
    window.addEventListener('resize', this.handleResize)
  },

  mounted () {
    if (this.appointment.bookings[0].customFields) {
      for (const [key, cf] of Object.entries(this.appointment.bookings[0].customFields)) {
        if (cf.type === 'address') {
          if (this.$refs['amelia-cf-address-' + key] !== undefined && this.$refs['amelia-cf-address-' + key].length > 0) {
            this.$refs['amelia-cf-address-' + key][0].update(cf.value)
          }
        }
      }
    }

    this.paymentType = this.bookable.depositData !== null ? 'depositOnly' : 'fullAmount'

    if (marketingMixin.hasAmeliaTracking(this)) {
      marketingMixin.trackAmeliaData(this, this.$root.marketing, this.bookableType, 'InitiateCheckout')
    }

    if (this.status === 'failed') {
      this.headerErrorMessage = this.$root.labels.payment_error

      this.headerErrorShow = true
    }

    this.coupon.code = this.couponCode

    if (this.bookableType === 'event' && !this.useGlobalCustomization) {
      // this.changeElementsColor('.el-upload-dragger', false, true, false)
      // this.changeElementsColor('.el-upload-dragger span', true, true, false)
      // this.changeElementsColor('.el-icon-upload', true, true, false)
      // this.changeElementsColor('.el-input-group__append', false, false, true)
      // this.changeElementsColor('.am-add-coupon-button', false, true, false)
      // this.changeSelectedColor('.el-radio', 'is-checked', '.el-radio__label', true, false)
      // this.changeSelectedColor('.el-radio', 'is-checked', '.el-radio__inner', false, true)
      // this.changeSelectedColor('.el-checkbox', 'is-checked', '.el-checkbox__label', true, false)
      // this.changeSelectedColor('.el-checkbox', 'is-checked', '.el-checkbox__inner', false, true)
    }

    this.setBookableConfirmStyle(false)
    this.setBookableCancelStyle(false)

    this.inlineSVG()

    // Get Default Payment Option
    let paymentOption = this.paymentOptions.find(option => option.value === this.$root.settings.payments.defaultPaymentMethod)

    if (!this.appointment.payment.gateway) {
      this.appointment.payment.gateway = paymentOption
        ? paymentOption.value : this.paymentOptions.length
          ? this.paymentOptions[0].value : this.$root.settings.payments.defaultPaymentMethod
    }

    if (this.bookableType === 'appointment') {
      this.saveStats()
    }

    this.addCustomFieldsValidationRules()
    if (this.$root.settings.payments.payPal.enabled) {
      this.payPalInit()
    }

    // myCred fix for total amount for recurring
    this.appointment.payment.amount = this.getTotalPrice()

    // Customization hook
    if ('beforeConfirmBookingLoaded' in window) {
      window.beforeConfirmBookingLoaded(this.appointment, this.bookable, this.provider, this.location)
    }

    let $this = this

    if (this.bookableType === 'event' && !('ameliaBooking' in window && 'disableScrollView' in window.ameliaBooking && window.ameliaBooking.disableScrollView === true)) {
      setTimeout(() => {
        $this.scrollView('am-confirm-booking', 'start')
      }, 1200)
    }
  },

  updated () {
    if (this.clearValidate === true) {
      this.validateFieldsForPayPal()
      this.clearValidate = false
    }
    this.handleResize()
  },

  methods: {
    setAddressCF (input, cfId) {
      this.appointment.bookings[0].customFields[cfId].value = input
      this.validateFieldsForPayPal()
    },

    googleMapsLoaded () {
      return window.google && this.$root.settings.general.gMapApiKey
    },

    paymentTypeChanged (paymentType) {
      this.paymentType = paymentType.value
    },

    getComponentProps () {
      return {
        phonePopulated: this.phonePopulated ? 1 : 0,
        containerId: this.containerId,
        trigger: 'booking' in this.$root.shortcodeData && 'trigger' in this.$root.shortcodeData.booking ? this.$root.shortcodeData.booking.trigger : '',
        recurringString: this.recurringString,
        useGlobalCustomization: this.useGlobalCustomization ? 1 : 0,
        bookableType: this.bookableType,
        bookable: Object.assign(
          this.bookable,
          {aggregatedPrice: this.bookable.aggregatedPrice ? 1 : 0}
        ),
        recurringData: this.recurringData,
        packageData: this.packageData,
        hasCancel: this.hasCancel ? 1 : 0,
        hasHeader: this.hasHeader ? 1 : 0,
        appointment: Object.assign(
          this.appointment,
          {group: this.appointment.group ? 1 : 0}
        ),
        dialogClass: this.dialogClass,
        couponCode: this.coupon.code,
        passedCategoryId: this.passedCategoryId,
        queryParams: this.queryParams
      }
    },

    onSubmitCoupon (ev) {
      ev.preventDefault()
      return false
    },

    getPackagePrice (pack) {
      return pack.calculatedPrice ? pack.price : pack.price - pack.price / 100 * pack.discount
    },

    isBookableCustomFieldVisible (customField) {
      switch (this.bookableType) {
        case ('appointment'):
          return this.isCustomFieldVisible(customField, 'appointment', this.bookable.id)
        case ('package'):
          let customFieldVisible = false

          for (let i = 0; i < this.packageData.data.length; i++) {
            if (this.isCustomFieldVisible(customField, 'appointment', this.packageData.data[i].serviceId)) {
              customFieldVisible = true

              break
            }
          }

          return customFieldVisible
        case ('event'):
          return this.isCustomFieldVisible(customField, 'event', this.bookable.id)
      }
    },

    getCustomFieldClass (customField) {
      let classData = {
        'is-required': customField.type === 'file' && customField.required,
        'text-content-custom-field': customField.type === 'content'
      }

      classData['am-cf-' + customField.id] = true

      return classData
    },

    onRecaptchaExpired () {
      this.validRecaptcha = false
      this.errors.recaptcha = this.$root.labels.recaptcha_error
      this.validateFieldsForPayPal()
    },

    onRecaptchaVerify (response) {
      this.validRecaptcha = true
      this.errors.recaptcha = ''
      this.recaptchaResponse = response

      if (this.$root.settings.general.googleRecaptcha.invisible) {
        switch (this.appointment.payment.gateway) {
          case ('onSite'):
            this.saveBooking(this.getRequestData(false))

            break
          case ('stripe'):
            this.stripeBooking()

            break
        }

        return false
      }

      this.validateFieldsForPayPal()
    },

    selectedCustomFieldValue () {
      if (this.bookableType === 'event' && !this.useGlobalCustomization) {
        // this.changeSelectedColor('.el-radio', 'is-checked', '.el-radio__label', true, false)
        // this.changeSelectedColor('.el-radio', 'is-checked', '.el-radio__inner', false, true)
        //
        // this.changeSelectedColor('.el-checkbox', 'is-checked', '.el-checkbox__label', true, false)
        // this.changeSelectedColor('.el-checkbox', 'is-checked', '.el-checkbox__inner', false, true)
      }

      this.validateFieldsForPayPal()
    },

    getBookableColor (colorBackground) {
      return colorBackground ? {
        'color': '#ffffff',
        'background-color': this.bookable.color,
        'border-color': '#ffffff'
      } : {
        'color': this.bookable.color,
        'background-color': '',
        'border-color': ''
      }
    },

    changeElementsColor (selector, isColor, isBorderColor, isBackgroundColor) {
      // let elements = document.querySelectorAll(selector)
      //
      // for (let i = 0; i < elements.length; i++) {
      //   if (isColor) {
      //     elements[i].style.color = this.bookable.color
      //   }
      //
      //   if (isBorderColor) {
      //     elements[i].style.borderColor = this.bookable.color
      //   }
      //
      //   if (isBackgroundColor) {
      //     elements[i].style.backgroundColor = this.bookable.color
      //   }
      // }
    },

    changeSelectedColor (selector, filterClass, childSelector, isColor, isBackgroundColor) {
      // let elements = document.querySelectorAll(selector)
      //
      // for (let i = 0; i < elements.length; i++) {
      //   let color = elements[i].classList.contains(filterClass) ? this.bookable.color : 'inherit'
      //
      //   let elementChildren = elements[i].querySelectorAll(childSelector)
      //
      //   if (elementChildren.length) {
      //     if (isColor) {
      //       elementChildren[0].style.color = color
      //     }
      //
      //     if (isBackgroundColor) {
      //       elementChildren[0].style.backgroundColor = color
      //     }
      //   }
      // }
    },

    setBookableConfirmStyle (isHover) {
      if (!this.useGlobalCustomization && this.bookableType === 'event') {
        this.hoverConfirm = isHover
      }
    },

    setBookableCancelStyle (isHover) {
      if (!this.useGlobalCustomization && this.bookableType === 'event') {
        this.hoverCancel = isHover
      }
    },

    saveStats () {
      this.$http.post(`${this.$root.getAjaxUrl}/stats`, {
        'locationId': this.location !== null ? this.location.id : null,
        'providerId': this.provider.id,
        'serviceId': this.bookable.id
      })
    },

    handleServerResponse (response) {
      let $this = this

      if (response.requiresAction) {
        $this.stripePayment.stripe.handleCardAction(
          response.paymentIntentClientSecret
        ).then(function (result) {
          if (result.error) {
            $this.headerErrorShow = true
            $this.headerErrorMessage = $this.$root.labels.payment_error
            $this.fetched = true
          } else {
            let requestData = $this.getRequestData(false, {
              'paymentIntentId': result.paymentIntent.id
            })

            $this.saveBooking(requestData)
          }
        })
      } else {
        if (response) {
          $this.$emit('confirmedBooking', Object.assign(response, {
            color: $this.bookable.color,
            type: $this.bookableType,
            packageId: this.bookableType === 'package' ? this.bookable.id : null
          }, this.$root.settings.general.runInstantPostBookingActions, null))

          this.paid = true
        } else {
          $this.fetched = true
        }
      }
    },

    cancelBooking () {
      this.$emit('cancelBooking')
    },

    onSelectFiles () {
      this.validateFieldsForPayPal()
    },

    validateUploadedFiles () {
      let isValid = true

      let bookings = this.appointment.bookings

      let customFieldFilesIndexes = {}

      let filesIndex = 0

      for (let i = 0; i < this.customFields.length; i++) {
        if (this.customFields[i].type === 'file' && this.isBookableCustomFieldVisible(this.customFields[i])) {
          customFieldFilesIndexes[this.customFields[i].id] = filesIndex
          filesIndex++
        }
      }

      for (let key in bookings[0].customFields) {
        if (!bookings[0].customFields.hasOwnProperty(key)) {
          continue
        }

        let customField = this.customFields.find(field => parseInt(field.id) === parseInt(key))

        if (this.isBookableCustomFieldVisible(customField) && customField.type === 'file' && customField.required) {
          let uploadedFilesIndex = key in customFieldFilesIndexes && customFieldFilesIndexes[key] in this.$refs.customFieldsFiles ? customFieldFilesIndexes[key] : null

          if (uploadedFilesIndex !== null && this.$refs.customFieldsFiles[uploadedFilesIndex].uploadFiles.length === 0) {
            this.errors.files['files' + customField.id] = this.$root.labels.file_upload_error
            isValid = false
          }
        }
      }

      return isValid
    },

    isDefaultOnSitePayment () {
      return this.getTotalPrice() === 0 &&
        (
          this.appointment.payment.gateway === 'payPal' ||
          this.appointment.payment.gateway === 'stripe' ||
          this.appointment.payment.gateway === 'mollie' ||
          this.appointment.payment.gateway === 'square' ||
          this.appointment.payment.gateway === 'razorpay' ||
          (this.appointment.payment.gateway === 'wc' && 'ameliaBooking' in window && 'wc' in window.ameliaBooking && 'bookIfPriceIsZero' in window.ameliaBooking.wc && window.ameliaBooking.wc.bookIfPriceIsZero === true) ||
          (this.appointment.payment.gateway === 'wc' && this.$root.settings.payments.wc.onSiteIfFree)
        )
    },

    getPaymentGateway () {
      return this.isDefaultOnSitePayment() ? 'onSite' : this.appointment.payment.gateway
    },

    confirmBooking () {
      if (!this.fetched) {
        return
      }

      let $this = this

      this.headerErrorShow = false
      this.errors.email = ''
      this.errors.phone = ''
      this.errors.coupon = ''
      this.validateFieldsForPayPal()

      let paymentGateway = this.getPaymentGateway()

      // Validate Form
      this.$refs.booking.validate((valid, validOptions) => {
        this.formValidOptions = {}
        if (this.validateUploadedFiles() && valid && this.errors.stripe === '' && this.errors.coupon === '' && (paymentGateway !== 'onSite' || this.isRequiredAndValidRecaptcha())) {
          // Customization hook
          if ('afterConfirmBooking' in window) {
            window.afterConfirmBooking(this.appointment, this.bookable, this.provider, this.location)
          }

          this.fetched = false
          this.inlineSVG()

          this.appointment.payment.gateway = paymentGateway

          switch (this.appointment.payment.gateway) {
            case 'stripe':
              if (this.$root.settings.general.googleRecaptcha.enabled &&
                this.$root.settings.general.googleRecaptcha.invisible
              ) {
                this.$refs.recaptcha.execute()
              } else {
                this.stripeBooking()
              }
              break
            case 'onSite':
              if (this.$root.settings.general.googleRecaptcha.enabled &&
                  this.$root.settings.general.googleRecaptcha.invisible
              ) {
                this.$refs.recaptcha.execute()
              } else {
                this.saveBooking(this.getRequestData(false))
              }
              break
            case 'wc':
              this.addToWooCommerceCart()
              break
            case 'mollie':
              this.goToMolliePaymentPage()
              break
            case 'square':
              this.goToSquarePaymentPage()
              break
            case 'razorpay':
              this.razorPayCreateOrder()

              break
          }
          this.scrollView('am-spinner', 'start')
        } else {
          this.fetched = true

          if (!valid && (validOptions.hasOwnProperty('customer.firstName') || validOptions.hasOwnProperty('customer.lastName') || validOptions.hasOwnProperty('customer.email') || validOptions.hasOwnProperty('customer.phone'))) {
            this.formValidOptions = JSON.parse(JSON.stringify(validOptions))
            return false
          }

          let initialErrorArray = []
          let fileErrorArray = []
          this.customFields.forEach((item) => {
            if (item.type === 'file' && item.required === true && this.isBookableCustomFieldVisible(item) && this.$refs['customFields.' + item.id + '.value'][0].$el.getElementsByTagName('input')[0].files.length === 0) {
              let fileErrorItem = {}
              fileErrorItem.position = item.position - 1
              fileErrorItem.name = 'customFields.' + item.id + '.value'
              fileErrorArray.push(fileErrorItem)
            }
            initialErrorArray.push('customFields.' + item.id + '.value')
          })

          let initialErrorExtendedArray = []
          Object.keys(validOptions).forEach(item => {
            let index = initialErrorArray.indexOf(item)
            let errorItem = {}
            errorItem.position = index
            errorItem.name = item

            initialErrorExtendedArray.push(errorItem)
          })

          let errorArray = initialErrorExtendedArray.concat(fileErrorArray).sort((a, b) => {
            const positionA = a.position
            const positionB = b.position

            let comparison = 0
            if (positionA > positionB) {
              comparison = 1
            } else if (positionA < positionB) {
              comparison = -1
            }

            return comparison
          })

          if (errorArray.length !== 0) {
            this.$refs[errorArray[0].name][0].$el.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' })
          }

          return false
        }
      })
    },

    buildFormData (formData, data, parentKey) {
      let $this = this

      if (data && typeof data === 'object' && !(data instanceof Date) && !(data instanceof File)) {
        Object.keys(data).forEach(key => {
          $this.buildFormData(formData, data[key], parentKey ? `${parentKey}[${key}]` : key)
        })
      } else {
        formData.append(parentKey, data !== null ? data : '')
      }
    },

    book (requestData) {
      this.$http.post(`${this.$root.getAjaxUrl}/bookings`, requestData.data, requestData.options).then(response => {
        if (response.data.data) {
          this.$emit('confirmedBooking', Object.assign(response.data.data, {
            color: this.bookable.color,
            type: this.bookableType,
            packageId: this.bookableType === 'package' ? this.bookable.id : null
          }, this.$root.settings.general.runInstantPostBookingActions, null))

          this.paid = true
        } else {
          this.fetched = true
        }
      }).catch(e => {
        if (this.getPaymentGateway() === 'onSite' && this.$root.settings.general.googleRecaptcha.enabled && this.$root.settings.general.googleRecaptcha.invisible) {
          this.$refs.recaptcha.reset()
        }
        this.handleSaveBookingErrors(e.response.data)
      })
    },

    saveBooking (requestData) {
      if ('ameliaActions' in window && 'beforeBooking' in window.ameliaActions) {
        window.ameliaActions.beforeBooking(
          () => {
            this.book(requestData)
          },
          (message) => {
            this.headerErrorMessage = message
            this.headerErrorShow = true
            this.fetched = true
          },
          this.getRequestData(true).data
        )
      } else {
        this.book(requestData)
      }
    },

    addToWooCommerceCart () {
      let requestData = this.getRequestData(false)

      this.$http.post(`${this.$root.getAjaxUrl}/payment/wc`, requestData.data, requestData.options).then(response => {
        window.location = response.data.data.cartUrl
      }).catch(e => {
        this.handleSaveBookingErrors(e.response.data)
      })
    },

    stripeBooking () {
      this.stripePayment.stripe.createPaymentMethod('card', this.stripePayment.cardElement, {}).then((result) => {
        if (result.error) {
          this.headerErrorShow = true
          this.headerErrorMessage = this.$root.labels.payment_error
          this.fetched = true
        } else {
          let requestData = this.getRequestData(false, {
            'paymentMethodId': result.paymentMethod.id
          })

          this.$http.post(`${this.$root.getAjaxUrl}/bookings`, requestData.data, requestData.options
          ).then(response => {
            if (response.data.data) {
              this.handleServerResponse(response.data.data)
            }
          }).catch(e => {
            this.handleSaveBookingErrors(e.response.data)
          })
        }
      })
    },

    goToMolliePaymentPage () {
      let requestData = this.getRequestData(false)

      this.$http.post(`${this.$root.getAjaxUrl}/payment/mollie`, requestData.data, requestData.options).then(response => {
        window.location = response.data.data.redirectUrl
      }).catch(e => {
        this.handleSaveBookingErrors(e.response.data)
      })
    },

    goToSquarePaymentPage () {
      let requestData = this.getRequestData(false)

      this.$http.post(`${this.$root.getAjaxUrl}/payment/square`, requestData.data, requestData.options).then(response => {
        window.location = response.data.data.redirectUrl
      }).catch(e => {
        this.handleSaveBookingErrors(e.response.data)
      })
    },

    getAppointmentDate () {
      return this.getFrontedFormattedDate(
        moment(this.bookable.bookingStart, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD')
      )
    },

    getAppointmentTime () {
      return this.getFrontedFormattedTime(this.bookable.bookingStart.split(' ')[1])
    },

    getExtrasPrice (bookingsCount) {
      let totalPrice = 0

      for (let i = 0; i < this.selectedExtras.length; i++) {
        totalPrice += bookingsCount * this.selectedExtras[i].price * this.selectedExtras[i].quantity * this.getExtraPriceMultipleValue(this.selectedExtras[i])
      }

      return totalPrice
    },

    getTotalPrice () {
      let totalPrice = this.amountData.instant.total - this.amountData.instant.discount + this.amountData.instant.tax

      return totalPrice > 0 ? totalPrice : 0
    },

    getSelectedExtraDetails (extra) {
      let result = ''

      if (extra.price) {
        if (this.instantPaymentBookingsCount > 1 || (this.recurringData !== null && this.recurringData.length)) {
          result += this.instantPaymentBookingsCount + ' ' + (this.instantPaymentBookingsCount > 1 ? this.$root.labels.appointments.toLowerCase() : this.$root.labels.appointment.toLowerCase()) + ' x '
        }

        if (this.getExtraPriceMultipleValue(extra) > 1) {
          result += this.getExtraPriceMultipleValue(extra) + ' ' + this.$root.labels.persons + ' x '
        }

        result += extra.quantity + ' ' + ' x '

        result += this.getFormattedPrice(extra.price, !this.$root.settings.payments.hideCurrencySymbolFrontend) + ' = '
      }

      result += this.getFormattedPrice(
        this.instantPaymentBookingsCount * extra.price * this.getExtraPriceMultipleValue(extra) * extra.quantity,
        !this.$root.settings.payments.hideCurrencySymbolFrontend
      )

      return result
    },

    getExtraPriceMultipleValue (extra) {
      let aggregatedPrice = extra.aggregatedPrice === null ? this.bookable.aggregatedPrice : extra.aggregatedPrice

      return aggregatedPrice ? this.appointment.bookings[0].persons : 1
    },

    getBasePrice (bookingsCount, bookingBasePrice) {
      return bookingsCount * this.basePriceMultipleValue * bookingBasePrice
    },

    getBookingTicketsBasePriceCalculationString (ticketsData) {
      let ticketsArray = ticketsData.bookingToEventTickets
      let result = ''

      ticketsArray.forEach(ticket => {
        if (ticket.persons !== 0) {
          result += result !== '' ? ' + ' : ''

          result += ticket.name + '(' + this.getFormattedPrice(ticket.price, !this.$root.settings.payments.hideCurrencySymbolFrontend) + ')' +
              (this.bookable.aggregatedPrice ? (' x ' + ticket.persons) : '')
        }
      })
      result += ' = ' + this.getFormattedPrice(ticketsData.totalPrice, !this.$root.settings.payments.hideCurrencySymbolFrontend)
      return result
    },

    getBookingBasePriceCalculationString (bookingsCount, bookingBasePrice) {
      let result = ''

      if (bookingsCount > 1 || (this.recurringData !== null && this.recurringData.length)) {
        result += bookingsCount + ' ' + (bookingsCount > 1 ? this.$root.labels.appointments.toLowerCase() : this.$root.labels.appointment.toLowerCase()) + ' x '
      }

      if (this.basePriceMultipleValue > 1) {
        result += this.basePriceMultipleValue + ' ' + this.$root.labels.persons + ' x '
      }

      let totalPriceFormatted = this.getFormattedPrice(
        this.getBasePrice(bookingsCount, bookingBasePrice),
        !this.$root.settings.payments.hideCurrencySymbolFrontend
      )

      if (result) {
        let bookingBasePriceFormatted = this.getFormattedPrice(
          bookingBasePrice,
          !this.$root.settings.payments.hideCurrencySymbolFrontend
        )

        result += bookingBasePriceFormatted + ' = ' + totalPriceFormatted
      }

      return result !== '' ? result : totalPriceFormatted
    },

    getBookingBasePriceData (type) {
      let result = []

      let paymentData = this.paymentPeriodData[type]

      for (let entityId in paymentData) {
        if (paymentData[entityId].price) {
          result.push({
            count: paymentData[entityId].count,
            price: paymentData[entityId].price
          })
        }
      }

      return result
    },

    checkCoupon (ev) {
      ev.preventDefault()

      this.$refs.coupon.clearValidate()
      this.$refs.coupon.validate()
    },

    getExtras () {
      let extras = JSON.parse(JSON.stringify(this.selectedExtras))

      extras.forEach(function (extItem) {
        extItem.extraId = extItem.id
        extItem.id = null
      })

      return extras
    },

    trimValue (value) {
      return typeof value === 'string' ? value.replace(/^\s+|\s+$/g, '') : value
    },

    getRequestData (mandatoryJson, paymentData) {
      let componentProps = JSON.parse(JSON.stringify(this.getComponentProps()))

      let customFieldFilesIndexes = {}

      let filesIndex = 0

      for (let i = 0; i < this.customFields.length; i++) {
        if (this.customFields[i].type === 'file') {
          let customField = this.customFields.find(field => parseInt(field.id) === parseInt(this.customFields[i].id))

          if (this.isBookableCustomFieldVisible(customField)) {
            customFieldFilesIndexes[this.customFields[i].id] = filesIndex
            filesIndex++
          }
        }
      }

      this.appointment.payment.amount = (this.paymentType !== 'fullAmount') ? this.amountData.instant.deposit.toFixed(2).toString() : this.getTotalPrice().toFixed(2).toString()

      this.appointment.payment.currency = this.$root.settings.payments.currencyCode

      let bookings = JSON.parse(JSON.stringify(this.appointment.bookings))

      let tickets = null

      if (this.bookable.ticketsData) {
        tickets = this.bookable.ticketsData.bookingToEventTickets
      }

      bookings[0].extras = this.getExtras()

      bookings[0].ticketsData = tickets

      let customFields = {}

      for (let key in bookings[0].customFields) {
        if (!bookings[0].customFields.hasOwnProperty(key)) {
          continue
        }

        let customField = this.customFields.find(field => parseInt(field.id) === parseInt(key))

        if (this.isBookableCustomFieldVisible(customField)) {
          let uploadedFilesIndex = key in customFieldFilesIndexes && customFieldFilesIndexes[key] in this.$refs.customFieldsFiles ? customFieldFilesIndexes[key] : null

          if (uploadedFilesIndex !== null) {
            let uploadCustomField = {
              label: bookings[0].customFields[key].label,
              value: []
            }

            for (let i = 0; i < this.$refs.customFieldsFiles[uploadedFilesIndex].uploadFiles.length; i++) {
              uploadCustomField.value.push({
                name: this.$refs.customFieldsFiles[uploadedFilesIndex].uploadFiles[i].name
              })
            }

            customFields[key] = (uploadCustomField)
          } else {
            customFields[key] = (bookings[0].customFields[key])
          }

          customFields[key].type = customField.type

          if (customFields[key].type === 'datepicker') {
            customFields[key].value = customFields[key].value ? this.getStringFromDate(new Date(customFields[key].value)) : null
          }
        }
      }

      bookings[0].customer.email = bookings[0].customer.email ? this.trimValue(bookings[0].customer.email) : bookings[0].customer.email
      bookings[0].customer.phone = bookings[0].customer.phone ? this.trimValue(bookings[0].customer.phone) : bookings[0].customer.phone

      bookings[0].customFields = customFields

      let bookingDateTime = this.bookable.bookingStart
      let recurringData = typeof this.recurringData !== 'undefined' && this.recurringData !== null ? JSON.parse(JSON.stringify(this.recurringData)) : []
      let packageData = typeof this.packageData !== 'undefined' && this.packageData !== null ? JSON.parse(JSON.stringify(this.packageData)) : {id: null, data: []}

      bookings[0].utcOffset = null

      bookings[0].deposit = this.paymentType === 'fullAmount' ? false : this.bookable.depositData !== null

      componentProps.appointment.bookings[0].customFields = customFields

      componentProps.appointment.payment = Object.assign(this.appointment.payment, {data: paymentData})

      componentProps.appointment.payment.amount = this.appointment.payment.amount

      if (this.$root.settings.general.showClientTimeZone) {
        bookingDateTime = moment(bookingDateTime, 'YYYY-MM-DD HH:mm').utc().format('YYYY-MM-DD HH:mm')

        recurringData.forEach((item) => {
          item.bookingStart = moment(item.bookingStart, 'YYYY-MM-DD HH:mm').utc().format('YYYY-MM-DD HH:mm')
          item.utcOffset = this.getClientUtcOffset(item.bookingStart)
        })

        packageData.data.forEach((item) => {
          item.bookingStart = moment(item.bookingStart, 'YYYY-MM-DD HH:mm').utc().format('YYYY-MM-DD HH:mm')
          item.utcOffset = this.getClientUtcOffset(item.bookingStart)
        })

        bookings[0].utcOffset = this.getClientUtcOffset(bookingDateTime)
      }

      packageData.data.forEach((item) => {
        item.notifyParticipants = this.appointment.notifyParticipants ? 1 : 0
      })

      if (componentProps && 'bookable' in componentProps && 'name' in componentProps.bookable) {
        componentProps.bookable.name = componentProps.bookable.name.replace(/"/g, "'")
      }

      let jsonData = {
        'type': this.bookableType,
        'bookings': bookings,
        'payment': Object.assign(this.appointment.payment, {data: paymentData}),
        'recaptcha': this.recaptchaResponse,
        'locale': window.localeLanguage[0],
        'timeZone': Intl.DateTimeFormat().resolvedOptions().timeZone,
        'urlParams': this.getUrlQueryParams(window.location.href),
        'couponCode': this.coupon && this.coupon.code ? this.coupon.code : '',
        'componentProps': componentProps,
        'returnUrl': this.removeURLParameter(location.href, 'ameliaCache')
      }

      switch (this.bookableType) {
        case ('appointment'):
          bookings[0].duration = this.appointment.serviceDuration

          jsonData = Object.assign(jsonData, {
            'bookingStart': bookingDateTime,
            'notifyParticipants': this.appointment.notifyParticipants ? 1 : 0,
            'locationId': this.location !== null ? this.location.id : null,
            'providerId': this.provider ? this.provider.id : null,
            'serviceId': this.bookable.id,
            'recurring': recurringData,
            'package': []
          })

          break

        case ('package'):
          jsonData = Object.assign(jsonData, {
            'package': packageData.data,
            'packageId': packageData.id,
            'packageRules': packageData.rules,
            'utcOffset': this.getClientUtcOffset(null),
            'deposit': this.paymentType === 'fullAmount' ? false : this.bookable.depositData !== null
          })

          break

        case ('event'):
          jsonData = Object.assign(jsonData, {
            'eventId': this.bookable.id
          })
      }

      let bookingData = null
      let requestOptions = null

      let hasUploadedFiles = false

      if (this.$refs.customFieldsFiles) {
        for (let i = 0; i < this.$refs.customFieldsFiles.length; i++) {
          if (this.$refs.customFieldsFiles[i].uploadFiles.length > 0) {
            hasUploadedFiles = true
            break
          }
        }
      }

      if (hasUploadedFiles && !mandatoryJson) {
        bookingData = new FormData()

        this.buildFormData(bookingData, jsonData)

        for (let key in customFieldFilesIndexes) {
          let index = customFieldFilesIndexes[key]

          if (!customFieldFilesIndexes.hasOwnProperty(key) || !(index in this.$refs.customFieldsFiles)) {
            continue
          }

          for (let i = 0; i < this.$refs.customFieldsFiles[index].uploadFiles.length; i++) {
            bookingData.append('files[' + key + '][' + i + ']', this.$refs.customFieldsFiles[index].uploadFiles[i].raw)
          }
        }

        requestOptions = {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      } else {
        bookingData = jsonData

        requestOptions = {}
      }

      return {
        data: bookingData,
        options: requestOptions
      }
    },

    handleSaveBookingErrors (response) {
      if ('data' in response) {
        if ('onSitePayment' in response.data && response.data.onSitePayment) {
          this.appointment.payment.gateway = 'onSite'
          this.saveBooking(this.getRequestData(false))
        } else {
          if ('afterFailedBooking' in window) {
            window.afterFailedBooking(response.data)
          }
        }

        if ('customerAlreadyBooked' in response.data && response.data.customerAlreadyBooked === true) {
          this.headerErrorShow = true
          switch (this.bookableType) {
            case 'appointment':
            case 'package':
              this.headerErrorMessage = this.$root.labels.customer_already_booked_app

              break
            case 'event':
              this.headerErrorMessage = this.$root.labels.customer_already_booked_ev
              break
          }
        }
        if ('timeSlotUnavailable' in response.data && response.data.timeSlotUnavailable === true) {
          this.headerErrorShow = true

          switch (this.bookableType) {
            case 'appointment':
            case 'package':
              this.headerErrorMessage = this.$root.labels.time_slot_unavailable
              break
            case 'event':
              this.headerErrorMessage = this.$root.labels.maximum_capacity_reached
              break
          }
        } else if ('bookingsLimitReached' in response.data && response.data.bookingsLimitReached === true) {
          this.headerErrorShow = true
          this.headerErrorMessage = this.$root.labels.bookings_limit_reached
        } else if ('emailError' in response.data && response.data.emailError === true) {
          this.errors.email = this.$root.labels.email_exist_error
        } else if ('phoneError' in response.data && response.data.phoneError === true) {
          this.errors.phone = this.$root.labels.phone_exist_error
        } else if ('couponUnknown' in response.data && response.data.couponUnknown === true) {
          this.errors.coupon = this.$root.labels.coupon_unknown
        } else if ('couponInvalid' in response.data && response.data.couponInvalid === true) {
          this.errors.coupon = this.$root.labels.coupon_invalid
        } else if ('couponExpired' in response.data && response.data.couponExpired === true) {
          this.errors.coupon = this.$root.labels.coupon_expired
        } else if ('couponMissing' in response.data && response.data.couponMissing === true) {
          this.errors.coupon = this.$root.labels.coupon_missing
        } else if ('paymentSuccessful' in response.data && response.data.paymentSuccessful === false) {
          this.headerErrorShow = true
          this.headerErrorMessage = this.$root.labels.payment_error
        } else if ('bookingAlreadyInWcCart' in response.data && response.data.bookingAlreadyInWcCart === true) {
          this.headerErrorShow = true
          this.headerErrorMessage = this.$root.labels.booking_already_in_wc_cart
        } else if ('wcError' in response.data && response.data.wcError === true) {
          this.headerErrorShow = true
          this.headerErrorMessage = this.$root.labels.wc_error
        } else if ('recaptchaError' in response.data && response.data.recaptchaError === true) {
          this.errors.recaptcha = this.$root.labels.recaptcha_invalid_error
        } else if ('message' in response.data) {
          this.headerErrorShow = true
          this.headerErrorMessage = response.data.message
        }
      }

      this.fetched = true
    },

    isRequiredAndValidRecaptcha () {
      this.errors.recaptcha = ''

      if (this.$root.settings.general.googleRecaptcha.enabled &&
        !this.$root.settings.general.googleRecaptcha.invisible &&
        !this.validRecaptcha
      ) {
        this.errors.recaptcha = this.$root.labels.recaptcha_error
        return false
      }

      return true
    },

    validateFieldsForPayPal () {
      this.clearValidation()

      if (/^\s/.test(this.appointment.bookings[0].customer.firstName)) {
        this.appointment.bookings[0].customer.firstName = this.appointment.bookings[0].customer.firstName.substring(1)
      }

      if (/^\s/.test(this.appointment.bookings[0].customer.lastName)) {
        this.appointment.bookings[0].customer.lastName = this.appointment.bookings[0].customer.lastName.substring(1)
      }

      this.appointment.bookings[0].customer.email = this.trimValue(this.appointment.bookings[0].customer.email)

      if (this.payPalActions === null || this.appointment.payment.gateway !== 'payPal') {
        return
      }

      let validCustomFields = true

      for (let key in this.appointment.bookings[0].customFields) {
        if (!this.appointment.bookings[0].customFields.hasOwnProperty(key)) {
          continue
        }

        let customField = this.customFields.find(field => parseInt(field.id) === parseInt(key))

        if (this.isBookableCustomFieldVisible(customField) && customField.required && customField.type !== 'file' &&
          (
            (Array.isArray(this.appointment.bookings[0].customFields[key].value) && this.appointment.bookings[0].customFields[key].value.length === 0) ||
            (!Array.isArray(this.appointment.bookings[0].customFields[key].value) && (!this.appointment.bookings[0].customFields[key].value || this.trimValue(this.appointment.bookings[0].customFields[key].value) === ''))
          )
        ) {
          validCustomFields = false
        }
      }

      if (this.appointment.bookings[0].customer.firstName === '' ||
        (this.formsData[this.$options.name][this.bookableType].itemsDraggable.lastNameFormField.required && this.appointment.bookings[0].customer.lastName === '') ||
        (this.formsData[this.$options.name][this.bookableType].itemsDraggable.emailFormField.required && this.appointment.bookings[0].customer.email === '') ||
        (this.formsData[this.$options.name][this.bookableType].itemsDraggable.phoneFormField.required && this.appointment.bookings[0].customer.phone === '') ||
        !validCustomFields ||
        !this.validateUploadedFiles()) {
        this.payPalActions.disable()
      } else {
        this.payPalActions.enable()
      }
    },

    razorPayVerify (paymentId, signature, orderId) {
      this.$emit('changeConfirmBookingRazorpay', true)
      this.saveBooking(this.getRequestData(false, {'paymentId': paymentId, 'signature': signature, 'orderId': orderId}))
    },

    razorPayCreateOrder () {
      let $this = this
      let requestData = this.getRequestData(true)
      this.$http.post(`${this.$root.getAjaxUrl}/payment/razorpay`, requestData.data, requestData.options).then(response => {
        let options = response.data.data.data
        options.handler = function (res) {
          $this.razorPayVerify(res.razorpay_payment_id, res.razorpay_signature, options.order_id)
        }

        options.modal = {
          ondismiss: function () {
            $this.fetched = true
            $this.$emit('changeConfirmBookingRazorpay', true)
          }
        }

        var rzp = new Razorpay(options)
        this.$emit('changeConfirmBookingRazorpay', false)
        rzp.open()
      }).catch(e => {
        this.handleSaveBookingErrors(e.response.data)
      })
    },

    payPalInit () {
      let $this = this

      let transactionReference = ''

      window.paypal.Button.render({
        style: {
          size: 'responsive',
          color: 'gold',
          shape: 'rect',
          tagLine: false
        },

        env: $this.$root.settings.payments.payPal.sandboxMode ? 'sandbox' : 'production',

        client: {
          sandbox: $this.$root.settings.payments.payPal.testApiClientId,
          production: $this.$root.settings.payments.payPal.liveApiClientId
        },

        commit: true,

        onClick: function () {
          $this.confirmBooking()
        },

        validate: function (actions) {
          $this.payPalActions = actions
          $this.validateFieldsForPayPal()
        },

        payment: function () {
          let bookings = JSON.parse(JSON.stringify($this.appointment.bookings))

          bookings[0].extras = $this.getExtras()

          return window.paypal.request(
            {
              method: 'post',
              url: $this.$root.getAjaxUrl + '/payment/payPal',
              json: $this.getRequestData(true)['data']
            }
          ).then(
            function (response) {
              transactionReference = response.data.transactionReference
              return response.data.paymentID
            }
          ).catch(
            function (error) {
              $this.parseError(error)
            }
          )
        },

        onAuthorize: function (data, actions) {
          return actions.payment.get().then(function () {
            let requestData = $this.getRequestData(false, {
              'transactionReference': transactionReference,
              'PaymentId': data.paymentID,
              'PayerId': data.payerID
            })

            $this.saveBooking(requestData)
          })
        },

        onCancel: function () {
          $this.fetched = true
          $this.inlineSVG()
        },

        onError: function (error) {
          $this.parseError(error)
        }

      }, '#am-paypal-button-container')
    },

    parseError: function (error) {
      let errorString = error.toString()
      let response = JSON.parse(JSON.stringify(JSON.parse(errorString.substring(errorString.indexOf('{'), errorString.lastIndexOf('}') + 1))))

      if (typeof response === 'object' && response.hasOwnProperty('data')) {
        this.handleSaveBookingErrors(response)
      } else {
        this.headerErrorShow = true
        this.headerErrorMessage = this.$root.labels.payment_error
      }

      this.fetched = true
      this.inlineSVG()
    },

    clearValidation () {
      if (typeof this.$refs.booking !== 'undefined') {
        this.$refs.booking.clearValidate()
      }

      if (typeof this.$refs.coupon !== 'undefined') {
        this.$refs.coupon.clearValidate()
      }

      let $this = this

      Object.keys(this.errors.files).forEach(function (key) {
        $this.errors.files[key] = ''
      })

      this.errors.recaptcha = ''

      if (this.errors.files) {
        let firstName = this.appointment.bookings[0].customer.firstName
        this.appointment.bookings[0].customer.firstName = firstName + '_'
        this.appointment.bookings[0].customer.firstName = firstName
      }
    },

    handleResize () {
      let amContainer = document.getElementById(this.containerId)

      if (!amContainer) {
        return
      }

      let amContainerWidth = amContainer.offsetWidth

      if (amContainerWidth < 670) {
        this.columnsLg = 24
      } else {
        this.columnsLg = 12
      }
    },

    addCustomFieldsValidationRules () {
      for (let i = 0; i < this.customFields.length; i++) {
        if (this.isBookableCustomFieldVisible(this.customFields[i]) && this.customFields[i].required === true) {
          let rules = [
            {required: true, message: this.$root.labels.required_field, trigger: 'submit'}
          ]

          if (this.customFields[i].type === 'text' || this.customFields[i].type === 'text-area' || this.customFields[i].type === 'address') {
            rules = [
              {required: true, message: this.$root.labels.required_field, trigger: 'submit'},
              {validator: this.validateCustomFieldInput, trigger: 'submit'}
            ]
          }

          this.$set(this.rules, 'customFields.' + this.customFields[i].id + '.value', rules)
        }
      }
    },

    validateCustomFieldInput (rule, input, callback) {
      if (!input || this.trimValue(input) === '') {
        callback(new Error(this.$root.labels.required_field))
      } else {
        callback()
      }
    },

    getAppointmentsAmountData () {
      let data = {
        instant: {
          total: 0,
          tax: 0,
          discount: 0,
          base: 0,
          deposit: 0
        },
        postponed: {
          total: 0,
          tax: 0,
          discount: 0,
          base: 0,
          deposit: 0,
          totals: {}
        }
      }

      let coupon = this.coupon && (this.coupon.discount || this.coupon.deduction) ? this.coupon : null

      let couponLimit = this.couponLimit

      let instantPaymentCount = 1

      if (this.service.recurringPayment) {
        instantPaymentCount = this.service.recurringPayment > this.recurringData.length + 1
          ? this.recurringData.length + 1
          : this.service.recurringPayment
      }

      let periodType = 'instant'

      let amounts = [this.bookable.price]

      this.recurringData.forEach((item) => {
        amounts.push(item.price)
      })

      let postponedAppointmentsIndex = 0

      amounts.forEach((serviceAmount, index) => {
        if (coupon && couponLimit > 0) {
          couponLimit--
        } else {
          coupon = null
        }

        let appointmentData = this.getAppointmentPriceAmount(
          Object.assign({}, this.bookable, {price: serviceAmount}),
          this.selectedExtras,
          this.appointment.bookings[0].persons,
          coupon,
          true
        )

        if (index < instantPaymentCount) {
          data[periodType].deposit += this.getDepositAmount(appointmentData.total - appointmentData.discount + appointmentData.tax)
        } else {
          periodType = 'postponed'
        }

        data[periodType].total += appointmentData.total
        data[periodType].discount += appointmentData.discount
        data[periodType].tax += appointmentData.tax

        if (periodType === 'postponed') {
          if (!(appointmentData.total in data[periodType].totals)) {
            data[periodType].totals[appointmentData.total] = {
              index: postponedAppointmentsIndex,
              count: 1,
              total: appointmentData.total
            }

            postponedAppointmentsIndex++
          } else {
            data[periodType].totals[appointmentData.total].count++
          }
        }
      })

      let totals = []

      Object.keys(data.postponed.totals).forEach((total) => {
        totals[data.postponed.totals[total].index] = {
          total: total,
          count: data.postponed.totals[total].count,
        }
      })

      data.postponed.totals = totals

      return data
    },

    getEventAmountData () {
      let price = this.bookable.ticketsData
        ? this.bookable.ticketsData.totalPrice
        : this.basePriceMultipleValue * this.bookable.price

      let eventTax = this.getEntityTax(this.bookable.id, 'event')

      if (this.$root.settings.payments.taxes.enabled && eventTax && !this.$root.settings.payments.taxes.excluded && this.coupon && this.couponLimit) {
        price = this.getBaseAmount(price, eventTax)
      }

      let discount = this.coupon && this.couponLimit ? (price / 100 * this.coupon.discount) + this.coupon.deduction : 0

      let tax = 0

      if (this.$root.settings.payments.taxes.enabled && eventTax && this.$root.settings.payments.taxes.excluded) {
        tax = this.getEntityTaxAmount(eventTax, price - discount)
      } else if (this.$root.settings.payments.taxes.enabled && eventTax && !this.$root.settings.payments.taxes.excluded && discount) {
        price += this.getEntityTaxAmount(eventTax, price - discount)
      }

      return {
        instant: {
          total: price,
          discount: discount,
          tax: tax,
          deposit: this.getDepositAmount(price - discount + tax)
        },
        postponed: {
          total: 0,
          discount: 0,
          tax: 0,
          deposit: 0
        }
      }
    },

    getPackageAmountData () {
      let price = this.basePriceMultipleValue * this.bookable.price

      let packageTax = this.getEntityTax(this.bookable.id, 'package')

      if (this.$root.settings.payments.taxes.enabled && packageTax && !this.$root.settings.payments.taxes.excluded && this.coupon && this.couponLimit) {
        price = this.getBaseAmount(price, packageTax)
      }

      let discount = this.coupon && this.couponLimit ? (price / 100 * this.coupon.discount) + this.coupon.deduction : 0

      let tax = 0

      if (this.$root.settings.payments.taxes.enabled && packageTax && this.$root.settings.payments.taxes.excluded) {
        tax = this.getEntityTaxAmount(packageTax, price - discount)
      } else if (this.$root.settings.payments.taxes.enabled && packageTax && !this.$root.settings.payments.taxes.excluded && discount) {
        price += this.getEntityTaxAmount(packageTax, price - discount)
      }

      return {
        instant: {
          total: price,
          discount: discount,
          tax: tax,
          deposit: this.getDepositAmount(price - discount + tax)
        },
        postponed: {
          total: 0,
          discount: 0,
          tax: 0,
          deposit: 0
        }
      }
    },

    getDepositAmount (totalAmount) {
      let depositAmount = 0

      if (this.bookable.depositData) {
        switch (this.bookable.depositData.depositPayment) {
          case ('fixed'):
            depositAmount = this.bookable.depositData.depositPerPerson
              ? this.appointment.bookings[0].persons * this.bookable.depositData.deposit
              : this.bookable.depositData.deposit

            break

          case ('percentage'):
            depositAmount = this.getPercentage(totalAmount, this.bookable.depositData.deposit)

            break
        }
      }

      return this.getRound(totalAmount > depositAmount ? depositAmount : 0)
    },

    getTaxLabel () {
      let entityTax = this.getEntityTax(this.bookable.id, this.bookableType === 'appointment' ? 'service' : this.bookableType)

      let taxes = {}

      taxes[entityTax.id] = entityTax.name

      this.selectedExtras.forEach((extItem) => {
        let extraTax = this.getEntityTax(extItem.extraId, 'extra')

        if (extraTax) {
          taxes[extraTax.id] = extraTax.name
        }
      })

      let label = 'total_tax_colon' in this.priceLabels
        ? this.priceLabels.total_tax_colon.value || this.$root.labels.total_tax_colon
        : this.$root.labels.total_tax_colon

      return Object.keys(taxes).length === 1 ? Object.values(taxes)[0] : label
    }
  },

  computed: {
    amountData () {
      switch (this.bookableType) {
        case ('appointment'):
          return this.getAppointmentsAmountData()
        case ('event'):
          return this.getEventAmountData()
        case ('package'):
          return this.getPackageAmountData()
      }
    },

    withDeposit () {
      return this.amountData.instant.deposit > 0 && this.getPaymentGateway() !== 'onSite' && this.paymentType === 'depositOnly'
    },

    onlyTotal () {
      return !(this.amountData.instant.tax > 0 || this.amountData.instant.discount > 0)
    },

    instantPaymentBasePriceData () {
      return this.getBookingBasePriceData('instant')
    },

    basePriceMultipleValue () {
      return this.bookable.aggregatedPrice ? this.appointment.bookings[0].persons : 1
    },

    instantPaymentBookingsCount () {
      if (this.recurringData.length === 0) {
        return 1
      }

      return (this.recurringData.length < this.service.recurringPayment ? this.recurringData.length : this.service.recurringPayment) + 1
    },

    // amountData.instant.deposit () {
    //   return this.amountData.instant.deposit
    //
    //   let amountData.instant.deposit = 0
    //
    //   let totalPrice = this.getTotalPrice()
    //
    //   if (this.bookable.depositData) {
    //     switch (this.bookable.depositData.depositPayment) {
    //       case ('fixed'):
    //         if (this.bookable.depositData.depositPerPerson && this.bookable.aggregatedPrice) {
    //           let persons = 'ticketsData' in this.bookable && this.bookable.ticketsData && 'totalTickets' in this.bookable.ticketsData
    //             ? this.bookable.ticketsData.totalTickets : this.appointment.bookings[0].persons
    //
    //           amountData.instant.deposit = persons * this.bookable.depositData.deposit
    //         } else {
    //           amountData.instant.deposit = this.bookable.depositData.deposit
    //         }
    //
    //         if (this.bookableType === 'appointment') {
    //           this.recurringData.forEach((value, index) => {
    //             if (this.instantPaymentBookingsCount - 1 > index) {
    //               amountData.instant.deposit +=
    //                 this.bookable.depositData.depositPerPerson
    //                   ? this.appointment.bookings[0].persons * value.depositData.deposit : value.depositData.deposit
    //             } else if (value.depositData) {
    //               value.depositData = null
    //             }
    //           })
    //         }
    //
    //         break
    //
    //       case 'percentage':
    //         amountData.instant.deposit = totalPrice / 100 * this.bookable.depositData.deposit
    //         console.log(amountData.instant.deposit)
    //
    //         break
    //     }
    //   }
    //
    //   return totalPrice > amountData.instant.deposit ? amountData.instant.deposit : 0
    // },

    paymentPeriodData () {
      let instantPaymentData = {}
      let postponedPaymentData = {}

      switch (this.bookableType) {
        case ('appointment'):
          instantPaymentData[this.bookable.price] = {
            count: 1,
            price: this.bookable.price
          }

          this.recurringData.forEach((value, index) => {
            if (this.instantPaymentBookingsCount - 1 > index) {
              if (!(value.price in instantPaymentData)) {
                instantPaymentData[value.price] = {
                  count: 1,
                  price: value.price
                }
              } else {
                instantPaymentData[value.price].count++
              }
            } else {
              if (!(value.price in postponedPaymentData)) {
                postponedPaymentData[value.price] = {
                  count: 1,
                  price: value.price
                }
              } else {
                postponedPaymentData[value.price].count++
              }
            }
          })

          break

        case ('package'):
          instantPaymentData[this.bookable.price] = {
            count: 1,
            price: this.bookable.price
          }

          break

        case ('event'):
          instantPaymentData[this.bookable.price] = {
            count: 1,
            price: this.bookable.price
          }

          break
      }

      return {
        instant: instantPaymentData,
        postponed: postponedPaymentData
      }
    },

    bookableConfirmStyle () {
      return this.hoverConfirm ? {
        color: this.bookable.color,
        borderColor: this.bookable.color,
        backgroundColor: this.bookable.color,
        opacity: 0.8
      } : {
        color: '#ffffff',
        backgroundColor: this.bookable.color,
        borderColor: this.bookable.color,
        opacity: 1
      }
    },

    bookableCancelStyle () {
      return this.hoverCancel ? {
        color: this.bookable.color,
        borderColor: this.bookable.color,
        backgroundColor: '',
        opacity: 0.7
      } : {
        color: '',
        backgroundColor: '#ffffff',
        borderColor: '',
        opacity: 1
      }
    },

    bookableCancelSpanStyle () {
      return this.hoverCancel ? {
        color: this.bookable.color,
        borderColor: '',
        backgroundColor: '',
        opacity: 0.9
      } : {
        color: '',
        backgroundColor: '',
        borderColor: '',
        opacity: 1
      }
    },

    selectedExtras () {
      return this.appointment.bookings[0].extras.filter(extra => extra.selected === true)
    },

    paymentOptions () {
      let paymentOptions = []

      if (this.$root.settings.payments.onSite === true) {
        paymentOptions.push({
          value: 'onSite',
          label: this.$root.labels.on_site
        })
      }

      if (this.$root.settings.payments.payPal.enabled) {
        paymentOptions.push({
          value: 'payPal',
          label: this.$root.labels.pay_pal
        })
      }

      if (this.$root.settings.payments.stripe.enabled) {
        paymentOptions.push({
          value: 'stripe',
          label: this.$root.labels.credit_card
        })
      }

      if (this.$root.settings.payments.wc.enabled) {
        paymentOptions.push({
          value: 'wc',
          label: this.$root.labels.wc
        })
      }

      if (this.$root.settings.payments.mollie.enabled) {
        paymentOptions.push({
          value: 'mollie',
          label: this.$root.labels.on_line
        })
      }

      if (this.$root.settings.payments.square.enabled) {
        paymentOptions.push({
          value: 'square',
          label: this.$root.labels.square
        })
      }

      if (this.$root.settings.payments.razorpay.enabled) {
        paymentOptions.push({
          value: 'razorpay',
          label: this.$root.labels.razorpay
        })
      }

      return paymentOptions
    },

    showConfirmBookingButton () {
      return this.appointment.payment.gateway === 'onSite' ||
        this.appointment.payment.gateway === 'wc' ||
        this.appointment.payment.gateway === 'mollie' ||
        this.appointment.payment.gateway === 'square' ||
        this.appointment.payment.gateway === 'stripe' ||
        this.appointment.payment.gateway === 'razorpay' ||
        (this.appointment.payment.gateway === 'payPal' && this.getTotalPrice() === 0)
    },

    priceLabels () {
      if (this.formType === 'searchForm') {
        return this.defaultFormsData['stepByStepForm'][this.formName][this.bookableType].itemsStatic.priceFormFiled.labels
      }

      return this.formsData.confirmBookingForm[this.bookableType].itemsStatic.priceFormFiled
        ? this.formsData.confirmBookingForm[this.bookableType].itemsStatic.priceFormFiled.labels
        : this.defaultFormsData[this.formType][this.formName][this.bookableType].itemsStatic.priceFormFiled.labels
    }
  },

  components: {
    moment,
    VueRecaptcha,
    confirmHeadingDataFormField,
    recurringStringFormField,
    firstNameFormField,
    lastNameFormField,
    emailFormField,
    phoneFormField,
    paymentMethodFormField,
    paymentTypeFormField,
    stripeCardFormField,
    VueGoogleAutocomplete
  }
}
</script>
