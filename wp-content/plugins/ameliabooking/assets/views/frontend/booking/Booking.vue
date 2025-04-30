<template>
  <div id="amelia-booking-wrap" class="am-wrap">
    <!-- Spinner -->
    <div class="am-spinner am-section" v-show="!empty && (!fetched || loadingCacheBookingData)">
      <img class="svg-booking am-spin" :src="$root.getUrl + 'public/img/oval-spinner.svg'">
      <img class="svg-booking am-hourglass" :src="$root.getUrl + 'public/img/hourglass.svg'">
    </div>

    <div v-if="empty" class="am-no-services">
      <img :src="$root.getUrl+'public/img/am-empty-booking.svg'" style="margin-top: 10px;">
      <h1>{{$root.labels.oops}}</h1>
      <h3 v-if="$root.shortcodeData.booking.show !== 'packages'">{{$root.labels.no_services_employees}}</h3>
      <p v-if="$root.shortcodeData.booking.show !== 'packages'">{{$root.labels.add_services_employees}}</p>
      <p v-if="$root.shortcodeData.booking.show === 'packages'">{{$root.labels.no_package_services}}</p>
      <a href="https://wpamelia.com/services-and-categories/" rel="nofollow">
        {{$root.labels.add_services_url}}
      </a>
      <span v-if="$root.shortcodeData.booking.show !== 'packages'" style="font-size:14px">{{$root.labels.and}}</span>
      <a v-if="$root.shortcodeData.booking.show !== 'packages'" href="https://wpamelia.com/employees/" rel="nofollow">
        {{$root.labels.add_employees_url}}
      </a>
    </div>

    <div :id="id" class="am-step-booking-catalog" :class="$root.settings.customization.forms ? `am-form-${formType}` : ''" v-show="!empty && fetched">
      <!-- Select Service Form -->
      <select-service-form
        v-if="!bookingCompleted && !activePackage && !passedPackage && !showPackagesOnly && !packageCalendarActive"
        :show-services="showServices"
        :show-locations="showLocations"
        :show-employees="showEmployees"
        :passed-service="passedService"
        :appointment="appointment"
        :group="group"
        :selected-extras="selectedExtras"
        :options="options"
        :fetched="fetched"
        :extras-error="extrasError"
        :form-type="formType"
        :forms-data="forms[formType]"
        :loading-time-slots="loadingTimeSlots"
        @change="changeFormItem"
        @getSlots="getTimeSlots"
        @enableGrouping="enableGrouping"
      ></select-service-form>
      <!-- /Select Service Form -->

      <!-- Recurring Setup Form -->
      <recurring-setup
        v-if="activeRecurringSetup && !bookingCompleted"
        :containerId="id"
        :initialRecurringData="initialRecurringData"
        :recurringData="recurringData"
        :disabledWeekdays="disabledWeekdays"
        :availableDates="availableDates"
        :calendarTimeSlots="calendarTimeSlots"
        :occupiedTimeSlots="occupiedTimeSlots"
        :service="getServiceById(appointment.serviceId)"
        :isFrontend="true"
        :form-type="formType"
        :forms-data="forms[formType]"
        @cancelRecurringSetup="cancelRecurringSetup"
        @confirmRecurringSetup="confirmRecurringSetup"
      >
      </recurring-setup>
      <!-- /Recurring Setup Form -->

      <!-- Recurring Dates Form -->
      <recurring-dates
        v-if="activeRecurringDates && !bookingCompleted"
        dialogClass="am-recurring-dates"
        :recurringData="recurringData"
        :availableDates="availableDates"
        :calendarTimeSlots="calendarTimeSlots"
        :isFrontend="true"
        :service="getServiceById(appointment.serviceId)"
        :selectedExtras="selectedExtras"
        :form-type="formType"
        :forms-data="forms[formType]"
        @confirmRecurringDates="confirmRecurringDates"
        @cancelRecurringDates="cancelRecurringDates"
      >
      </recurring-dates>
      <!-- /Recurring Dates Form -->

      <!-- Calendar Date Time Form -->
      <calendar-date-time-form
        v-if="!bookingCompleted && !activeRecurringSetup && !activePackage && !passedPackage && !showPackagesOnly && !packageCalendarActive"
        :id="id"
        :selected-date="selectedDate"
        :available-dates="availableDates"
        :disabled-weekdays="disabledWeekdays"
        :disabled-attribute="disabledAttribute"
        :calendar-id="calendarId"
        :show-times="showTimes"
        :appointment="appointment"
        :available-time-slots="availableTimeSlots"
        :is-recurring-available="isRecurringAvailable"
        :active-recurring="activeRecurring"
        :show-calendar-back-button="showCalendarBackButton"
        :show-calendar-continue-button="showCalendarContinueButton"
        :loading="loading"
        :loading-time-slots="loadingTimeSlots"
        :durations="getDurations()"
        :form-type="formType"
        :forms-data="forms[formType]"
        @selectDuration="getTimeSlots"
        @selectDate="selectDate"
        @setTimeSlots="setTimeSlots"
        @selectTime="selectTime"
        @changeMonth="changeMonth"
        @togglePicker="togglePicker"
        @showNextScreen="showNextScreen"
        @changeRecurring="changeActiveRecurring"
      ></calendar-date-time-form>
      <!-- /Calendar Date Time Form -->

      <!-- Select Package Form -->
      <select-package-form
        v-if="!bookingCompleted && !activePackage && !passedPackage && !packageListShown && !activeConfirm && showPackagesOnly"
        :selected-package-id="selectedPackageId"
        :fetched="fetched"
        :options="options"
        :form-type="formType"
        :forms-data="forms[formType]"
        @continuePackage="continuePackage"
      ></select-package-form>
      <!-- /Select Package Form -->

      <!-- Package Info Form -->
      <package-info
        v-if="!bookingCompleted && activePackage && !passedPackage"
        class="am-package-selected"
        :id="id"
        :fetched-slots="fetchedSlots"
        :selected-package="selectedPackage"
        :package-slots-fetched="packageSlotsFetched"
        :has-back="packagesHaveBack"
        :has-header="true"
        :form-type="formType"
        :forms-data="forms[formType]"
        @showPackageCalendar="packageServiceSelected++"
        @closePackage="closePackage"
        @packageSlotsSelectedCallback="packageSlotsSelectedCallback"
      >
      </package-info>
      <!-- /Package Info Form -->

      <!-- Package Setup Form -->
      <package-setup
        v-if="!bookingCompleted && (selectedPackage ? selectedPackage.hasSlots : true) && packageCalendarActive"
        class="am-select-date am-select-service-date-transition am-package-setup"
        :id="id"
        :options="options"
        :selectedPackage="selectedPackage"
        :packageServiceSelected="packageServiceSelected"
        :packageCreated="packageCreated"
        :isPassedPackage="!!passedPackage"
        :disableFetchSlots="disableFetchPackageSlots"
        :form-type="formType"
        :forms-data="forms[formType]"
        @packageSlotsFetchedCallback="packageSlotsFetchedCallback"
        @packageSlotsSelectedCallback="packageSlotsSelectedCallback"
        @packageListShow="packageListShow"
      >
      </package-setup>
      <!-- /Package Setup Form -->

      <!-- Package List Form -->
      <package-list
        v-if="!bookingCompleted && packageListShown"
        :container-id="'amelia-app-booking' + $root.shortcodeData.counter"
        :bookable="getBookablePackageData()"
        :has-header="!passedPackage"
        :quantity="selectedPackage.sharedCapacity ? selectedPackage.quantity : 0"
        :form-type="formType"
        :forms-data="forms[formType]"
        @cancelBooking="cancelPackageList"
        @packageSlotsSelectedCallback="packageSlotsSelectedCallback"
      >
      </package-list>
      <!-- /Package List Form -->

      <!-- Confirm Booking -->
      <confirm-booking
        v-if="activeConfirm && !bookingCompleted"
        dialogClass="am-confirm-booking am-scroll"
        v-bind="cacheData && (cacheData.status === 'canceled' || cacheData.status === 'failed') ? getCacheDataRequestProps() : {
          bookableType: selectedPackage === null ? 'appointment' : 'package',
          containerId: getContainerId(),
          taxes: options.entities.taxes,
          bookable: getBookableData(),
          appointment: appointment,
          marketing: marketing,
          provider: selectedProvider,
          location: selectedLocation,
          service: selectedService,
          customFields: options.entities.customFields,
          recurringData: getRecurringAppointmentsData(),
          packageData: selectedPackage === null ? null : getPackageAppointmentsData(),
          recurringString: recurringData.recurringString + ' ' + recurringData.untilString,
          hasCancel: !passedPackage || passedPackage.hasSlots,
          hasHeader: !passedPackage,
          phonePopulated: phonePopulated,
          passedCategoryId: passedCategory ? passedCategory.id : null,
          queryParams: []
        }"
        :form-type="formType"
        :forms-data="forms[formType]"
        @confirmedBooking="confirmedBooking"
        @cancelBooking="cancelBooking"
      >
      </confirm-booking>
      <!-- /Confirm Booking -->

      <!-- Add To Calendar -->
      <transition name="fade">
        <add-to-calendar
          v-if="showAddToCalendar"
          ref="congratulations"
          :addToCalendarData="addToCalendarData"
          :form-type="formType"
          :forms-data="forms[formType]"
          @closeDialogAddToCalendar="closeDialogAddToCalendar"
        ></add-to-calendar>
      </transition>
      <!-- /Add To Calendar -->

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
  import marketingMixin from '../../../js/frontend/mixins/marketingMixin'
  import cacheMixin from '../../../js/frontend/mixins/cacheMixin'
  import formsCustomizationMixin from '../../../js/common/mixins/formsCustomizationMixin'
  import imageMixin from '../../../js/common/mixins/imageMixin'
  import dateMixin from '../../../js/common/mixins/dateMixin'
  import priceMixin from '../../../js/common/mixins/priceMixin'
  import helperMixin from '../../../js/backend/mixins/helperMixin'
  import settingsMixin from '../../../js/common/mixins/settingsMixin'
  import entitiesMixin from '../../../js/common/mixins/entitiesMixin'
  import recurringMixin from '../../../js/common/mixins/recurringMixin'
  import packageMixin from '../../../js/frontend/mixins/packageMixin'
  import durationMixin from '../../../js/common/mixins/durationMixin'
  import customFieldMixin from '../../../js/common/mixins/customFieldMixin'
  import bookingMixin from '../../../js/frontend/mixins/bookingMixin'
  import slotsMixin from '../../../js/common/mixins/slotsMixin'
  import selectServiceForm from './components/formSteps/SelectServiceForm'
  import calendarDateTimeForm from './components/formSteps/CalendarDateTimeForm'
  import recurringSetup from '../../parts/RecurringSetup.vue'
  import recurringDates from '../../parts/RecurringDates.vue'
  import selectPackageForm from './components/formSteps/SelectPackageForm'
  import packageInfo from '../package/Package.vue'
  import packageSetup from '../package/PackageSetup.vue'
  import packageList from '../package/PackageList.vue'
  import confirmBooking from '../parts/ConfirmBooking.vue'
  import addToCalendar from '../parts/AddToCalendar.vue'

  export default {

    mixins: [
      slotsMixin,
      cacheMixin,
      formsCustomizationMixin,
      packageMixin,
      recurringMixin,
      imageMixin,
      dateMixin,
      entitiesMixin,
      bookingMixin,
      helperMixin,
      durationMixin,
      priceMixin,
      customFieldMixin,
      settingsMixin
    ],

    props: {
      id: {
        default: 'am-step-booking'
      },
      showService: {
        type: Boolean,
        default: true
      },
      addToCalendarProperty: {
        type: Object,
        default: () => {
          return {
            visible: true
          }
        }
      },
      passedService: {
        default: () => {},
        type: Object
      },
      passedPackage: {
        default: () => {},
        type: Object
      },
      passedCategory: {
        default: () => {},
        type: Object
      },
      passedEntities: {
        default: () => {},
        type: Object
      },
      passedEntitiesRelations: {
        default: () => {},
        type: Object
      },
      formType: {
        type: String,
        default: 'stepByStepForm'
      }
    },

    data () {
      return {
        empty: false,
        packagesHaveBack: true,
        showPackagesOnly: false,
        selectedWeekIndex: 0,
        selectedProvider: null,
        selectedLocation: null,
        selectedService: null,
        loading: false,
        isRecurringAvailable: false,
        initialRecurringData: null,
        recurringData: {
          dates: [],
          startAppointment: null,
          startDate: null,
          startTime: null,
          pageRecurringDates: [],
          pagination: {
            show: this.$root.settings.general.itemsPerPage,
            page: 1,
            count: 0
          },
          recurringString: '',
          untilString: '',
          datesCallback: null,
          setupCallback: null
        },
        activeRecurring: false,
        activeRecurringSetup: false,
        activeRecurringDates: false,
        selectedMonth: moment().format('YYYY-MM'),
        isServiceChanged: true,
        calendarId: '',
        activeConfirm: false,
        bookingCompleted: false,
        activePicker: false,
        packageCalendarActive: false,
        addToCalendarData: null,
        appointment: {
          bookingStart: '',
          bookingStartTime: '',
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
            persons: 1,
            haveMandatoryExtras: false,
            minSelectedExtras: 0
          }],
          duration: 0,
          group: false,
          notifyParticipants: this.$root.settings.notifications.notifyCustomers,
          payment: {
            amount: 0,
            gateway: '',
            data: {}
          },
          categoryId: null,
          providerId: 0,
          serviceId: null,
          locationId: null
        },
        availableDates: [],
        availableTimeSlots: [],
        calendar: '',
        calendarTimeSlots: {},
        occupiedTimeSlots: {},
        calendarVisible: false,
        customer: {
          name: '',
          email: '',
          phone: '',
          paymentMethod: ''
        },
        customerRules: {
          name: [
            {required: true, message: 'Please input name', trigger: 'submit'},
            {min: 3, max: 50, message: 'Length should be 3 to 50', trigger: 'submit'}],
          email: [
            {required: true, message: 'Please input name', trigger: 'submit'},
            {min: 3, max: 5, message: 'Length should be 3 to 5', trigger: 'submit'}],
          phone: '',
          paymentMethod: ''
        },
        disabledAttribute: {
          contentStyle: {
            color: '#ccc',
            opacity: 0.4,
            textDecoration: 'line-through'
          }
        },
        disabledWeekdays: null,
        fetched: false,
        fetchedSlots: false,
        group: {
          allowed: false,
          enabled: false,
          count: 1,
          options: []
        },
        loadingTimeSlots: false,
        slotsIndexStarted: 0,
        responseEntities: {
          taxes: [],
          categories: [],
          employees: [],
          locations: [],
          services: []
        },
        options: {
          availableEntitiesIds: {
            categories: [],
            employees: [],
            locations: [],
            services: []
          },
          entitiesRelations: {},
          entities: {
            taxes: [],
            packages: [],
            services: [],
            employees: [],
            locations: [],
            customFields: []
          }
        },
        marketing: {
          service: null,
          employee: null,
          location: null,
          category: null,
          package: null,
          payment: null
        },
        selectedExtras: [],
        previouslySelectedExtras: [],
        selectedDate: null,
        showAddToCalendar: false,
        showExtras: false,
        showFilters: false,
        showTimes: false,
        showServices: false,
        showEmployees: false,
        showLocations: false,
        extrasMandatory: false,
        showCalendarBackButton: false,
        showCalendarContinueButton: false,
        times: '',
        extrasError: [],
        forms: {}
      }
    },

    created () {
      this.forms = this.getTranslatedForms('stepByStepForm')

      this.calendarId = 'am-appointment-times' + this.$root.shortcodeData.counter
      window.addEventListener('resize', this.handleResize)
    },

    mounted () {
      if (this.addToCalendarProperty.visible) {
        this.setCacheData(this.getContainerId(), true)
      } else {
        this.showAddToCalendar = false
      }

      if (!this.$root.shortcodeData.hasBookingShortcode || !this.$root.shortcodeData.hasCategoryShortcode) {
        this.inlineBookingSVG()
      }

      if (this.passedService) {
        this.checkMandatoryExtras(this.passedService)
      }

      // Customization hook
      if ('beforeBookingLoaded' in window) {
        window.beforeBookingLoaded(this)
      }

      if (this.passedEntities && !this.passedPackage) {
        this.options.isFrontEnd = true
        this.options.entitiesRelations = Object.assign({}, this.passedEntitiesRelations)

        let shortCodeEntitiesIds = this.getShortCodeEntityIds()

        this.filterEntities(this.passedEntities, {
          categoryId: this.passedService.categoryId,
          serviceId: this.passedService.id,
          employeeId: shortCodeEntitiesIds.employeeId,
          locationId: shortCodeEntitiesIds.locationId
        })

        this.fetchedEntities()

        this.times = document.getElementById(this.calendarId)
      } else if (!this.passedPackage) {
        let shortCodeEntitiesIds = this.getShortCodeEntityIds()

        if (shortCodeEntitiesIds.show === 'packages') {
          this.showPackagesOnly = true
          this.packageCalendarActive = true
        } else if (shortCodeEntitiesIds.show === 'services') {
          this.showPackagesOnly = false
        }

        let $this = this

        this.fetchEntities(function (success) {
          if (success) {
            $this.fetchedEntities()
          }
        }, {
          types: ['locations', 'employees', 'categories', 'custom_fields', 'packages', 'taxes'],
          isFrontEnd: true,
          isPanel: false
        })

        this.times = document.getElementById(this.calendarId)
      } else if (this.passedPackage) {
        this.options.isFrontEnd = true
        this.options.entitiesRelations = Object.assign({}, this.passedEntitiesRelations)
        this.options.entities = this.passedEntities
        this.setBookingCustomFields()
        this.selectPackage(this.passedPackage)

        if (!this.passedPackage.hasSlots || this.loadingCacheBookingData) {
          this.fetched = true
          this.packageSlotsSelectedCallback()

          this.runCacheAction()
        }
        if (this.options.entities.services.length === 0 || this.options.entities.employees.length === 0) this.empty = true
      }
    },

    updated () {
      this.handleResize()
    },

    methods: {
      changeFormItem (fieldObj) {
        if (fieldObj.identifier === 'changeService') {
          this.changeService()

          if (marketingMixin.hasAmeliaTracking(this.$root.marketing, this.appointment.serviceId)) {
            this.marketing.service = this.getServiceById(this.appointment.serviceId)

            this.marketing.category = this.marketing.service
              ? this.getCategoryById(this.marketing.service.categoryId) : null

            marketingMixin.trackAmeliaData(this, this.$root.marketing, 'appointment', 'SelectService')
          }
        }

        if (fieldObj.identifier === 'selectPackage') {
          this.selectPackage(fieldObj.value)

          if (marketingMixin.hasAmeliaTracking(this.$root.marketing, fieldObj.value.id)) {
            this.marketing.package = this.getPackageById(fieldObj.value.id)

            marketingMixin.trackAmeliaData(this, this.$root.marketing, 'package', 'SelectPackage')
          }
        }

        if (fieldObj.identifier === 'changeLocation') {
          this.changeLocation(fieldObj.required)

          if (marketingMixin.hasAmeliaTracking(this.$root.marketing, this.appointment.locationId)) {
            this.marketing.location = this.getLocationById(this.appointment.locationId)

            marketingMixin.trackAmeliaData(this, this.$root.marketing, 'appointment', 'SelectLocation')
          }
        }

        if (fieldObj.identifier === 'changeEmployee') {
          this.changeEmployee(fieldObj.required)

          if (marketingMixin.hasAmeliaTracking(this.$root.marketing, this.appointment.providerId)) {
            this.marketing.employee = this.getProviderById(this.appointment.providerId)

            marketingMixin.trackAmeliaData(this, this.$root.marketing, 'appointment', 'SelectEmployee')
          }
        }

        if (fieldObj.identifier === 'enableGrouping') {
          this.enableGrouping()
        }

        if (fieldObj.identifier === 'changeNumberOfPersons') {
          this.changeNumberOfPersons()
        }

        if (fieldObj.identifier === 'addExtra') {
          this.addExtra()
        }

        if (fieldObj.identifier === 'changeSelectedExtra') {
          this.changeSelectedExtra(fieldObj.value, fieldObj.key)
        }

        if (fieldObj.identifier === 'deleteExtra') {
          this.deleteExtra(fieldObj.value)
        }
      },

      changeActiveRecurring (recurring) {
        this.activeRecurring = recurring
      },

      runCacheAction () {
        if (this.loadingCacheBookingData) {
          if (this.cacheData.status === 'canceled' || this.cacheData.status === 'failed') {
            this.showConfirmBooking()
          } else if (this.cacheData.status === 'paid' || this.cacheData.status === null) {
            this.confirmedBooking(this.cacheData.response, true, this.cacheData.request)
          }

          this.loadingCacheBookingData = false
        }
      },

      getContainerId () {
        return 'amelia-app-booking' + this.$root.shortcodeData.counter
      },

      showConfirmBooking () {
        this.activeConfirm = true

        this.loading = true

        let amContainer = document.getElementById(this.id)

        setTimeout(() => {
          this.loading = false

          this.loadingCacheBookingData = false

          amContainer.classList.toggle('am-active-picker', false)
          amContainer.classList.toggle('am-active-confirm', this.activeConfirm)
        }, 500)
      },

      checkMandatoryExtras (service) {
        this.appointment.bookings[0].haveMandatoryExtras = service.mandatoryExtra
        this.appointment.bookings[0].minSelectedExtras = service.minSelectedExtras
        for (let i = 0; i < service.minSelectedExtras; i++) {
          if (service.mandatoryExtra) {
            this.extrasMandatory = true
            this.addExtra()
          }
        }
      },

      getBookableData () {
        if (this.selectedPackage === null) {
          this.selectedService = this.getProviderById(this.selectedProvider.id).serviceList.find(service => service.id === this.appointment.serviceId)

          if (marketingMixin.hasAmeliaTracking(this)) {
            this.marketing.service = this.selectedService
            this.marketing.employee = this.selectedProvider
            this.marketing.location = this.selectedLocation
            this.marketing.category = this.getCategoryById(this.selectedService.categoryId)
          }

          return {
            id: this.selectedService.id,
            name: this.selectedService.name,
            price: this.getServiceDurationPrice(this.selectedService, this.appointment.serviceDuration),
            depositData: this.selectedService.depositPayment !== 'disabled' ? {
              deposit: this.selectedService.deposit,
              depositPayment: this.selectedService.depositPayment,
              depositPerPerson: this.selectedService.depositPerPerson,
              depositFullPayment: this.selectedService.fullPayment
            } : null,
            maxCapacity: this.selectedService.maxCapacity,
            pictureThumbPath: this.selectedService.pictureThumbPath,
            aggregatedPrice: this.selectedService.aggregatedPrice,
            bookingStart: this.appointment.bookingStart
          }
        } else {
          return {
            id: this.selectedPackage.id,
            name: this.selectedPackage.name,
            price: this.getPackagePrice(this.selectedPackage),
            depositData: this.selectedPackage.depositPayment !== 'disabled' ? {
              deposit: this.selectedPackage.deposit,
              depositPayment: this.selectedPackage.depositPayment,
              depositPerPerson: this.selectedPackage.depositPerPerson,
              depositFullPayment: this.selectedPackage.fullPayment
            } : null,
            calculatedPrice: this.selectedPackage.calculatedPrice,
            discount: this.selectedPackage.discount,
            maxCapacity: 1,
            pictureThumbPath: this.selectedPackage.pictureThumbPath,
            aggregatedPrice: this.selectedPackage.aggregatedPrice
          }
        }
      },

      changeMonth (page) {
        this.selectedMonth = page ? moment().year(page.year).month(page.month - 1).date(1).format('YYYY-MM') : null
      },

      showCalendarOnly (initCall) {
        let providerService = null

        if (this.appointment.serviceId && this.appointment.providerId) {
          providerService = this.getProviderService(this.appointment.providerId, this.appointment.serviceId)
        }

        let service = null

        if (this.appointment.serviceId) {
          service = this.getServiceById(this.appointment.serviceId)
        }

        let serviceProviderVisibility = true
        let servicePackageVisibility = true
        let serviceLocationVisibility = true
        let addExtraVisibility = true

        for (const key in this.forms[this.formType].selectServiceForm.itemsDraggable) {
          if (this.forms[this.formType].selectServiceForm.itemsDraggable[key].hasOwnProperty('visibility') && !this.forms[this.formType].selectServiceForm.itemsDraggable[key].visibility) {
            if (key === 'employeeFormField') {
              serviceProviderVisibility = false
            }

            if (key === 'servicePackageFormField') {
              servicePackageVisibility = false
            }

            if (key === 'locationFormField') {
              serviceLocationVisibility = false
            }

            if (key === 'addExtraFormField') {
              addExtraVisibility = false
            }
          }
        }

        let anyEmployeeHasBringingAnyone = false

        if (providerService === null) {
          this.employeesFiltered.forEach((employeeItem) => {
            employeeItem.serviceList.forEach((serviceItem) => {
              if (service && serviceItem.id === service.id && serviceItem.maxCapacity > 1 && serviceItem.bringingAnyone) {
                anyEmployeeHasBringingAnyone = true
              }
            })
          })
        }

        return initCall &&
            !this.showServices &&
            (!serviceProviderVisibility || !this.showEmployees) &&
            (!serviceLocationVisibility || !this.showLocations) &&
            (service && service.extras.length ? !this.extrasMandatory : true) &&
            (service && service.extras.length ? !addExtraVisibility : true) &&
            (!serviceProviderVisibility || this.employeesFiltered.length === 1) &&
            (
              (providerService !== null && (providerService.maxCapacity === 1 || providerService.bringingAnyone === false)) ||
              (providerService === null && !anyEmployeeHasBringingAnyone)
            ) &&
            (!servicePackageVisibility || (typeof this.passedService === 'undefined' ? this.options.entities.packages.length === 0 : true))
      },

      changeService () {
        if ('ameliaBooking' in window && 'changedEntity' in window.ameliaBooking) {
          window.ameliaBooking.changedEntity('service', this.appointment)
        }

        if (this.appointment.serviceId) {
          let selectedService = this.getServiceById(this.appointment.serviceId)

          this.appointment.serviceDuration = selectedService.duration

          if (selectedService.mandatoryExtra) {
            this.closePicker()
          }

          this.updateSettings(selectedService.settings)
          this.isServiceChanged = true

          // this.clearValidation()
          this.extrasError = []

          this.appointment.bookings[0].extras = []
          this.selectedExtras = []

          this.checkMandatoryExtras(selectedService)

          this.handleCapacity(true, false, selectedService.maxExtraPeople)

          this.toggleRecurringActive()

          if (this.calendarVisible) {
            this.getTimeSlots()
          }
        } else {
          this.cancelRecurringSetup()

          setTimeout(() => {
            this.selectedDate = null
            this.closePicker()
            this.resetAppointment()
            this.unSelectTime()
            this.activeRecurringSetup = false
            this.showTimes = false
          }, 200)
        }
      },

      changeEmployee (required = false) {
        let selectedService = null
        if (this.appointment.serviceId) {
          selectedService = this.getServiceById(this.appointment.serviceId)
        }
        this.handleCapacity(true, false, selectedService ? selectedService.maxExtraPeople : null)

        if (this.calendarVisible && this.appointment.providerId) {
          this.getTimeSlots()
        }

        if (required && !this.appointment.providerId) {
          this.cancelRecurringSetup()

          setTimeout(() => {
            this.selectedDate = null
            this.closePicker()
            this.resetAppointment()
            this.unSelectTime()
            this.activeRecurringSetup = false
            this.showTimes = false
          }, 200)
        }
      },

      changeLocation (required = false) {
        if (this.calendarVisible && this.appointment.locationId) {
          this.getTimeSlots()
        }

        if (!this.appointment.locationId) {
          this.appointment.locationId = null
        }

        if (required && !this.appointment.locationId) {
          this.cancelRecurringSetup()

          setTimeout(() => {
            this.selectedDate = null
            this.closePicker()
            this.resetAppointment()
            this.unSelectTime()
            this.activeRecurringSetup = false
            this.showTimes = false
          }, 200)
        }
      },

      enableGrouping () {
        let selectedService = null
        if (this.appointment.serviceId) {
          selectedService = this.getServiceById(this.appointment.serviceId)
        }
        this.handleCapacity(true, true, selectedService ? selectedService.maxExtraPeople : null)

        this.group.enabled === true ? this.appointment.bookings[0].persons += 1 : this.appointment.bookings[0].persons = 1

        if (this.calendarVisible) {
          this.getTimeSlots()
        }
      },

      changeNumberOfPersons () {
        if (this.calendarVisible) { this.getTimeSlots() }
      },

      getSelectedExtraMaxQuantity (selectedExtra) {
        let extra = this.getServiceById(this.appointment.serviceId).extras.find(extra => extra.id === selectedExtra.id)

        return typeof extra !== 'undefined' ? extra.maxQuantity : ''
      },

      getAvailableExtras (selectedExtra) {
        let selectedExtras = []
        let availableExtras = []

        this.selectedExtras.forEach(function (extra) {
          if (extra.id) {
            selectedExtras.push(extra.id)
          }
        })

        this.getServiceById(this.appointment.serviceId).extras.forEach(function (extra) {
          if (selectedExtras.indexOf(extra.id) === -1 || selectedExtra.id === extra.id) {
            availableExtras.push(extra)
          }
        })

        return availableExtras
      },

      addExtra () {
        this.selectedExtras.push({
          id: null,
          extraId: null,
          quantity: '',
          duration: 0,
          name: ''
        })

        this.previouslySelectedExtras.push({
          id: null,
          extraId: null,
          quantity: '',
          duration: 0,
          name: ''
        })
      },

      deleteExtra (key) {
        if (this.calendarVisible && !!this.selectedExtras[key].duration) {
          this.selectedExtras.splice(key, 1)
          this.previouslySelectedExtras.splice(key, 1)
          this.getTimeSlots()
        } else {
          this.selectedExtras.splice(key, 1)
          this.previouslySelectedExtras.splice(key, 1)
        }
      },

      changeSelectedExtra (selectedExtra, key) {
        this.extrasError = []
        if (this.previouslySelectedExtras && (key in this.previouslySelectedExtras) && this.previouslySelectedExtras[key].extraId === null) {
          this.previouslySelectedExtras[key].extraId = selectedExtra.extraId
          this.previouslySelectedExtras[key].duration = selectedExtra.duration
        } else {
          this.previouslySelectedExtras[key] = {}
        }

        selectedExtra.quantity = (selectedExtra.quantity === '') ? 1 : selectedExtra.quantity

        let extra = this.getServiceById(this.appointment.serviceId).extras.find(extra => extra.id === selectedExtra.id)

        selectedExtra.extraId = extra.id
        selectedExtra.duration = extra.duration
        selectedExtra.name = extra.name
        selectedExtra.price = extra.price
        selectedExtra.selected = true
        selectedExtra.aggregatedPrice = extra.aggregatedPrice

        if (selectedExtra.quantity > extra.maxQuantity) {
          selectedExtra.quantity = extra.maxQuantity
        }

        if (this.calendarVisible && (!!extra.duration || (this.previouslySelectedExtras[key].duration !== null && selectedExtra.duration === null))) {
          this.getTimeSlots()
        }

        this.previouslySelectedExtras[key].extraId = selectedExtra.extraId
        this.previouslySelectedExtras[key].duration = selectedExtra.duration
      },

      fetchedEntities () {
        if (this.$root.shortcodeData.booking.service && this.$root.shortcodeData.booking.service.length) {
          this.checkMandatoryExtras(this.options.entities.services[0])
        }

        if (this.options.entities.services.length === 0 ||
            this.options.entities.employees.length === 0 ||
            (this.$root.shortcodeData.booking.show === 'packages' && this.options.entities.packages.length === 0)
        ) {
          this.empty = true
        }

        this.setBookingCustomFields()

        if (this.employeesFiltered.length === 1) {
          this.appointment.providerId = this.employeesFiltered[0].id

          this.$root.shortcodeData.booking.employee = this.appointment.providerId
        } else if (this.employeesFiltered.length > 1) {
          this.showEmployees = true
        } else {
          return
        }

        if (this.locationsFiltered.length === 1) {
          this.appointment.locationId = this.locationsFiltered[0].id

          this.$root.shortcodeData.booking.location = this.appointment.locationId
        } else if (this.locationsFiltered.length > 1) {
          this.showLocations = true
        }

        if (this.servicesFiltered.length === 1) {
          this.appointment.serviceId = this.servicesFiltered[0].id

          this.$root.shortcodeData.booking.service = this.appointment.serviceId
        } else if (this.servicesFiltered.length > 1) {
          this.showServices = true
        } else {
          return
        }

        this.toggleRecurringActive()

        let service = null;
        if (this.appointment.serviceId) {
          service = this.getServiceById(this.appointment.serviceId)

          this.appointment.serviceDuration = service.duration

          this.updateSettings(service.settings)
        }
        this.handleCapacity(true, false, service ? service.maxExtraPeople: null)

        if (('showAmeliaCalendarOnLoad' in window && window.showAmeliaCalendarOnLoad && this.appointment.serviceId) ||
          (this.showCalendarOnly(true) && this.$root.shortcodeData.booking.show !== 'packages')
        ) {
          document.getElementById(this.id + '-calendar').classList.remove('am-select-service-date-transition')
          this.getTimeSlots()
        } else {
          let shortCodeEntitiesIds = this.getShortCodeEntityIds()

          if (shortCodeEntitiesIds.show === 'packages') {
            this.options.entities.packages.sort((a, b) => a.position - b.position)
            if (this.options.entities.packages.length === 1) {
              this.selectedPackageId = this.options.entities.packages[0].id

              this.packagesHaveBack = false

              this.selectPackage(this.getPackageById(this.selectedPackageId))
            }
          }

          this.fetched = true

          this.runCacheAction()
        }
      },

      getPossibleProvidersIfNoneSelected () {
        let providers = []

        // If Employee is not selected, select ones that can provide the service
        if (!this.appointment.providerId) {
          // If grouping is enabled check employees capacity for selected service
          if (this.group.enabled) {
            this.employeesFiltered.forEach((employee) => {
              if (typeof (employee.serviceList.find(service => service.id === this.appointment.serviceId && service.maxCapacity >= this.appointment.bookings[0].persons)) !== 'undefined') {
                providers.push(employee)
              }
            })
          } else {
            this.employeesFiltered.forEach((employee) => {
              if (typeof (employee.serviceList.find(service => service.id === this.appointment.serviceId)) !== 'undefined') {
                providers.push(employee)
              }
            })
          }
        }

        return providers
      },

      getTimeSlots (formValidation = true) {
        this.getCurrentUser()

        let service = this.appointment.serviceId ? this.getServiceById(this.appointment.serviceId) : null

        this.selectedExtras.forEach((extra, index) => {
          if (service && service.mandatoryExtra && !extra.id && this.appointment.bookings[0].minSelectedExtras > index) {
            this.extrasError.push(index)
          }
        })

        if (this.extrasError.length) {
          return false
        }

        if (this.appointment.serviceId && formValidation) {
          this.loadingTimeSlots = true
          let extras = []

          this.selectedExtras.forEach(function (extra) {
            if (extra.id) {
              extras.push({
                id: extra.id,
                quantity: extra.quantity
              })
            }
          })

          // Customization hook
          if ('afterBookingSelectService' in window) {
            window.afterBookingSelectService(this.appointment, this.getServiceById(this.appointment.serviceId), this.getProviderById(this.appointment.providerId), this.getLocationById(this.appointment.locationId))
          }

          this.slotsIndexStarted++

          let currentIndex = this.slotsIndexStarted

          this.$http.get(`${this.$root.getAjaxUrl}/slots`, {
            params: this.getAppropriateUrlParams({
              locationId: this.appointment.locationId,
              serviceId: this.appointment.serviceId,
              serviceDuration: this.appointment.serviceDuration,
              providerIds: this.appointment.providerId ? [this.appointment.providerId] : this.getPossibleProvidersIfNoneSelected().map(i => i.id),
              extras: JSON.stringify(extras),
              group: 1,
              page: 'booking',
              persons: this.appointment.bookings[0].persons
            })
          }).then(response => {
            if (currentIndex < this.slotsIndexStarted) {
              this.fetchedSlots = true
              this.fetched = true
              this.loadingTimeSlots = false
              return
            }

            let dateSlots = this.$root.settings.general.showClientTimeZone ? this.getConvertedTimeSlots(response.data.data.slots) : response.data.data.slots

            let occupiedSlots = this.$root.settings.general.showClientTimeZone ? this.getConvertedTimeSlots(response.data.data.occupied) : response.data.data.occupied

            if (!this.calendarVisible) {
              this.activePicker = !this.activePicker
              document.getElementById(this.id).classList.toggle('am-active-picker', this.activePicker)
            }

            let availableDates = []

            let minDate = null

            this.useSortedDateStrings(Object.keys(dateSlots)).forEach(function (dateString) {
              if (minDate === null) {
                minDate = dateString
              }

              availableDates.push(moment(dateString).toDate())
            })

            this.showFirstEventMonth(minDate)

            this.calendarTimeSlots = dateSlots
            this.occupiedTimeSlots = occupiedSlots
            this.disabledWeekdays = {weekdays: []}
            this.disabledWeekdays = (availableDates.length === 0) ? {weekdays: [1, 2, 3, 4, 5, 6, 7]} : null
            this.availableDates = availableDates
            this.calendarVisible = true

            if (this.availableDates.length) {
              this.setTimeSlots()
            }

            if (!this.availableDates.length || !this.isSelectedDateAvailable()) {
              this.showTimes = false
              let amContainer = document.getElementById(this.id)
              amContainer.classList.remove('am-show-times')
            }

            let dateIsNotAvailable = !this.availableDates.length || !this.isSelectedDateAvailable()
            let timeIsNotAvailable = (this.appointment.bookingStartTime && this.availableTimeSlots.indexOf(this.appointment.bookingStartTime) === -1)

            if (dateIsNotAvailable || timeIsNotAvailable) {
              if (dateIsNotAvailable) {
                this.selectedDate = null
              }

              this.unSelectTime()
            }

            if (this.activeRecurringSetup) {
              let amContainer = document.getElementById(this.id)

              amContainer.classList.add('am-show-calendar')

              this.activeRecurringSetup = false

              if (!dateIsNotAvailable) {
                this.showTimeSlots()
              } else {
                this.times = document.getElementById(this.calendarId)
              }
            }

            this.fetchedSlots = true
            this.fetched = true
            this.loadingTimeSlots = false

            this.runCacheAction()
          }).catch(e => {
            console.log(e.message)
            this.fetchedSlots = true
            this.fetched = true
          })
        }
      },

      showFirstEventMonth (minDate) {
        if (this.isServiceChanged && (
          (this.selectedDate === null && moment(this.selectedMonth).format('YYYY-MM') !== moment(minDate, 'YYYY-MM-DD').format('YYYY-MM')) ||
          (this.selectedDate !== null && moment(this.selectedDate).format('YYYY-MM') !== moment(minDate, 'YYYY-MM-DD').format('YYYY-MM'))
        )) {
          this.selectedDate = moment(minDate).toDate()

          let $this = this

          setTimeout(function () {
            $this.selectedDate = null
          }, 100)
        }

        this.isServiceChanged = false
      },

      addSlotsElementToWeekRow (weekRow) {
        if (!this.times) {
          this.times = document.getElementById(this.calendarId)
        }
        weekRow.parentNode.insertBefore(this.times, weekRow.nextSibling)

        this.isRecurringAvailable = this.getServiceById(this.appointment.serviceId).recurringCycle !== 'disabled'

        setTimeout(() => {
          if (this.availableTimeSlots.length && this.selectedDate) {
            if (moment(this.selectedDate).format('YYYY-MM-DD') === moment(this.availableDates[this.availableDates.length - 1]).format('YYYY-MM-DD')) {
              this.activeRecurring = false
              this.isRecurringAvailable = false
            }
            this.showTimes = true
            let amContainer = document.getElementById(this.id)
            amContainer.classList.add('am-show-times')
            this.appointment.bookingStartTime = this.availableTimeSlots[0]
            this.selectedWeekIndex = [...weekRow.parentNode.children].indexOf(weekRow)

            this.selectTime()
          }
        }, 200)
      },

      selectDate (dayInfo, calendarDate) {
        this.selectedDate = calendarDate
        this.unSelectTime()
        let isDisabled = false

        dayInfo.attributes.forEach(function (attrItem) {
          if (attrItem.hasOwnProperty('key') && attrItem['key'] === 'disabled') {
            isDisabled = true
          }
        })

        if (isDisabled) {
          return
        }

        let amContainer = document.getElementById(this.id)
        amContainer.classList.remove('am-show-times')

        this.showTimes = false

        if (dayInfo.inMonth) {
          let weekRowInMonth = dayInfo.event.target.parentNode.parentNode.parentNode.parentNode.parentNode

          if (weekRowInMonth.classList.contains('c-day')) {
            weekRowInMonth = dayInfo.event.target.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode
          }

          if (!weekRowInMonth.classList.contains('c-week')) {
            weekRowInMonth = dayInfo.event.target.parentNode.parentNode.parentNode.parentNode
          }

          if (!weekRowInMonth.classList.contains('c-week')) {
            weekRowInMonth = dayInfo.event.target.parentNode.parentNode.parentNode
          }

          this.addSlotsElementToWeekRow(weekRowInMonth)
        } else {
          setTimeout(() => {
            let weekRowNotInMonth = document.getElementById(this.id + '-calendar')
              .getElementsByClassName('c-weeks-rows')[0].children[dayInfo.weekdayOrdinal - 1]
            this.addSlotsElementToWeekRow(weekRowNotInMonth)
          }, 1000)
        }
      },

      isSelectedDateAvailable () {
        let momentDate = moment(this.selectedDate)
        return this.calendarTimeSlots.hasOwnProperty(momentDate.format('YYYY-MM-DD'))
      },

      setTimeSlots (calendarDate) {
        if (typeof calendarDate !== 'undefined') {
          this.selectedDate = calendarDate
        }
        let momentDate = moment(this.selectedDate)
        let dateString = momentDate.format('YYYY-MM-DD')

        if (this.isSelectedDateAvailable()) {
          this.availableTimeSlots = Object.keys(this.calendarTimeSlots[dateString])
          this.appointment.duration = this.getAppointmentDuration(
            this.appointment.serviceDuration ? parseInt(this.appointment.serviceDuration) : this.getServiceById(this.appointment.serviceId).duration,
            this.selectedExtras
          )
        }
      },

      togglePicker () {
        this.calendarVisible = false
        this.activePicker = !this.activePicker
        let amContainer = document.getElementById(this.id)
        amContainer.classList.toggle('am-active-picker', this.activePicker)
      },

      closePicker () {
        this.calendarVisible = false
        this.activePicker = false
        let amContainer = document.getElementById(this.id)
        amContainer.classList.remove('am-active-picker')
        this.isRecurringAvailable = false
        this.activeRecurring = false
      },

      selectTime () {
        this.appointment.bookingStart = moment(this.selectedDate).format('YYYY-MM-DD') + ' ' + this.appointment.bookingStartTime
        this.showCalendarContinueButton = true

        if ('afterBookingTimeSelected' in window) {
          window.afterBookingTimeSelected(this.appointment)
        }

        if ('ameliaBooking' in window && 'disableScrollView' in window.ameliaBooking && window.ameliaBooking.disableScrollView === true) {
          return
        }

        this.scrollView('am-button-wrapper-' + this.$root.shortcodeData.counter, 'end')
      },

      unSelectTime () {
        this.appointment.bookingStartTime = null
        this.showCalendarContinueButton = false
      },

      refreshCalendar () {
        let calendarTimeSlots = []
        let availableDates = []

        for (let dateKey in this.calendarTimeSlots) {
          for (let timeKey in this.calendarTimeSlots[dateKey]) {
            for (let slotInfoKey in this.calendarTimeSlots[dateKey][timeKey]) {
              if (this.appointment.providerId && this.calendarTimeSlots[dateKey][timeKey][slotInfoKey][0] === this.appointment.providerId) {
                if (!(dateKey in calendarTimeSlots)) {
                  availableDates.push(moment(dateKey).toDate())
                  calendarTimeSlots[dateKey] = {}
                }

                if (!(timeKey in calendarTimeSlots[dateKey])) {
                  calendarTimeSlots[dateKey][timeKey] = []
                }

                calendarTimeSlots[dateKey][timeKey].push(this.calendarTimeSlots[dateKey][timeKey][slotInfoKey])
              }
            }
          }
        }

        this.calendarTimeSlots = calendarTimeSlots
        this.disabledWeekdays = {weekdays: []}
        this.disabledWeekdays = (availableDates.length === 0) ? {weekdays: [1, 2, 3, 4, 5, 6, 7]} : null
        this.availableDates = availableDates
        this.availableTimeSlots = Object.keys(calendarTimeSlots[moment(this.selectedDate).format('YYYY-MM-DD')])
      },

      showTimeSlots () {
        setTimeout(() => {
          let weeksWrapper = document.getElementsByClassName('c-weeks-rows-wrapper')[0]
          let weekRow = weeksWrapper.firstChild.children.item(this.selectedWeekIndex)

          this.times = document.getElementById(this.calendarId)
          weekRow.parentNode.insertBefore(this.times, weekRow.nextSibling)

          this.showTimes = true
        }, 200)
      },

      cancelRecurringSetup () {
        this.activeRecurringSetup = false

        let amContainer = document.getElementById(this.id)

        amContainer.classList.remove('am-recurring-active')

        this.showTimeSlots()
      },

      confirmRecurringSetup () {
        let amContainer = document.getElementById(this.id)

        this.activeRecurringDates = true
        this.activeRecurringSetup = true

        amContainer.classList.toggle('am-active-picker', false)
        amContainer.classList.toggle('am-active-recurring-dates', true)
      },

      cancelRecurringDates () {
        this.activeRecurringDates = false
        this.activeRecurringSetup = true

        let amContainer = document.getElementById(this.id)

        amContainer.classList.toggle('am-active-picker', true)
        amContainer.classList.toggle('am-active-confirm', this.activeRecurringDates)

        amContainer.classList.toggle('am-active-recurring-dates', false)

        if (this.showCalendarOnly(true)) {
          amContainer.classList.add('am-mobile-collapsed')
          amContainer.classList.remove('am-desktop')
        }
      },

      confirmRecurringDates () {
        let selectedAppointment = this.recurringData.startAppointment

        this.selectedProvider = this.getProviderById(selectedAppointment.providerId)
        this.selectedLocation = this.getLocationById(selectedAppointment.locationId)

        this.appointment.bookings[0].extras = this.selectedExtras

        // Customization hook
        if ('afterBookingSelectDateAndTime' in window) {
          window.afterBookingSelectDateAndTime(Object.assign(this.appointment, {
            providerId: selectedAppointment.providerId,
            locationId: selectedAppointment.locationId
          }), this.getServiceById(this.appointment.serviceId), this.selectedProvider, this.selectedLocation)
        }

        this.activeConfirm = true
        this.activeRecurringDates = false
        this.activeRecurringSetup = false
        let amContainer = document.getElementById(this.id)

        amContainer.classList.remove('am-active-recurring-dates')

        amContainer.classList.toggle('am-active-confirm', this.activeConfirm)
      },

      showNextScreen () {
        this.recurringData.dates = []

        if (this.activeRecurring && this.isRecurringAvailable && !this.activeRecurringSetup) {
          this.loading = true
          this.recurringData.startDate = this.appointment.bookingStart
          this.recurringData.startTime = this.appointment.bookingStart.split(' ')[1]

          let service = this.getServiceById(this.appointment.serviceId)

          this.initialRecurringData = this.getDefaultRecurringSettings(
            this.appointment.bookingStart,
            service.recurringCycle,
            this.calendarTimeSlots
          )

          setTimeout(() => {
            let amContainer = document.getElementById(this.id)

            amContainer.classList.remove('am-show-calendar')

            this.loading = false
            this.showTimes = false
            this.activeRecurringSetup = true
          }, 500)

          return
        }

        let dateString = moment(this.selectedDate).format('YYYY-MM-DD')

        if (!this.appointment.providerId) {
          let employeesIds = this.calendarTimeSlots[dateString][this.appointment.bookingStartTime].map(
            i => i[0]
          ).filter(
            (v, i, a) => a.indexOf(v) === i
          )

          this.appointment.providerId = employeesIds[Math.floor(Math.random() * (employeesIds.length) + 1) - 1]
        }

        if (!this.appointment.locationId) {
          let locationsIds = this.calendarTimeSlots[dateString][this.appointment.bookingStartTime].filter(
            i => i[0] === this.appointment.providerId
          ).map(i => i[1])

          this.appointment.locationId = locationsIds.length ? this.getPreferredEntityId(
            this.calendarTimeSlots[dateString],
            dateString in this.occupiedTimeSlots ? this.occupiedTimeSlots[dateString] : {},
            this.appointment.bookingStartTime,
            this.appointment.providerId,
            locationsIds,
            1
          ) : null
        }

        this.selectedProvider = this.getProviderById(this.appointment.providerId)
        this.selectedLocation = this.getLocationById(this.appointment.locationId)

        this.refreshCalendar()

        this.appointment.bookings[0].extras = this.selectedExtras

        // Customization hook
        if ('afterBookingSelectDateAndTime' in window) {
          window.afterBookingSelectDateAndTime(this.appointment, this.getServiceById(this.appointment.serviceId), this.getProviderById(this.appointment.providerId), this.getLocationById(this.appointment.locationId))
        }

        this.showConfirmBooking()
      },

      cancelPackageList () {
        let amContainer = document.getElementById(this.id)

        this.packageListShown = false
        this.activePackage = true

        amContainer.classList.toggle('am-active-picker', true)
        amContainer.classList.toggle('am-active-package-list', false)
      },

      cancelBooking () {
        if (this.cacheData) {
          this.unsetCacheData()

          let amContainer = document.getElementById(this.id)

          this.activeConfirm = false

          amContainer.classList.toggle('am-active-confirm', false)

          return
        }

        if (this.activeRecurring) {
          let amContainer = document.getElementById(this.id)

          this.activeRecurringSetup = true
          this.activeRecurringDates = true
          this.activeConfirm = false

          amContainer.classList.toggle('am-active-confirm', false)
          amContainer.classList.add('am-active-recurring-dates')

          return
        }

        if (this.selectedPackage) {
          let amContainer = document.getElementById(this.id)

          this.activeConfirm = false
          this.activePackage = true

          if (this.selectedPackage.hasSlots) {
            this.packageListShown = true
            this.disableFetchPackageSlots = true
            amContainer.classList.add('am-active-package-list')
          }

          amContainer.classList.toggle('am-active-confirm', false)

          return
        }

        this.activeConfirm = false
        let amContainer = document.getElementById(this.id)
        amContainer.classList.toggle('am-active-confirm', this.activeConfirm)

        if (this.appointment.serviceId && this.appointment.providerId) {
          amContainer.classList.toggle('am-active-picker', true)
        }

        if (this.showCalendarOnly(true)) {
          amContainer.classList.add('am-mobile-collapsed')
          amContainer.classList.remove('am-desktop')
        }
      },

      inlineBookingSVG () {
        let inlineSVG = require('inline-svg')
        inlineSVG.init({
          svgSelector: 'img.svg-booking',
          initClass: 'js-inlinesvg'
        })
      },

      handleResize () {
        let amContainer = document.getElementById(this.id)

        if (this.showCalendarOnly(true) || this.passedPackage) {
          if (amContainer) {
            amContainer.classList.add('am-mobile-collapsed')
            amContainer.classList.remove('am-desktop')
          }

          this.showCalendarBackButton = this.options.entities.packages.length > 0

          return
        }

        if (amContainer) {
          let amContainerWidth = amContainer.offsetWidth

          if (this.showCalendarOnly(false) || this.passedPackage) {
            amContainer.classList.add('am-mobile-collapsed')
            amContainer.classList.remove('am-desktop')
            this.showCalendarBackButton = this.options.entities.packages.length > 0
          } else {
            if (amContainerWidth < 670) {
              amContainer.classList.add('am-mobile-collapsed')
              amContainer.classList.remove('am-desktop')
              this.showCalendarBackButton = true
            } else {
              amContainer.classList.add('am-desktop')
              amContainer.classList.remove('am-mobile-collapsed')
              this.showCalendarBackButton = this.options.entities.packages.length > 0
            }
          }
        }
      },

      confirmedBooking (responseData, skipNotify, requestData) {
        this.activeConfirm = false
        this.bookingCompleted = true

        this.addToCalendarData = this.getAppointmentAddToCalendarData(
          responseData,
          skipNotify
        )

        if (marketingMixin.hasAmeliaTracking(this)) {
          if (responseData.packageId) {
            this.marketing.package = responseData.packageId ? this.getPackageById(responseData.packageId) : null
          } else {
            this.marketing.service = responseData.appointment.serviceId ? this.getServiceById(responseData.appointment.serviceId) : null
            this.marketing.employee = responseData.appointment.providerId ? this.getProviderById(responseData.appointment.providerId) : null
            this.marketing.location = responseData.appointment.locationId ? this.getLocationById(responseData.appointment.locationId) : null
            this.marketing.category = responseData.appointment.serviceId ? this.getCategoryById(this.marketing.service.categoryId) : null
          }

          if (typeof requestData !== 'undefined' && requestData !== null) {
            this.marketing.payment = requestData.appointment.payment
          } else {
            this.marketing.payment = this.appointment.payment
          }

          if (this.appointment.payment.gateway === 'onSite') {
            marketingMixin.trackAmeliaData(this, this.$root.marketing, responseData.type, 'Schedule')
          } else {
            marketingMixin.trackAmeliaData(this, this.$root.marketing, responseData.type, 'Purchase')
          }
        }

        // Customization hook
        if ('beforeConfirmedBooking' in window) {
          window.beforeConfirmedBooking(this.addToCalendarData)
        }

        this.showAddToCalendar = true

        if (this.showAddToCalendar) {
          setTimeout(() => {
            if (!!Object.keys(this.$refs).length && this.$refs.congratulations) {
              this.$refs.congratulations.$el.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' })
            }
          }, 500)
        }
      },

      clearValidation () {
        if (typeof this.$refs.booking !== 'undefined') {
          this.$refs.booking.clearValidate()
        }
      },

      closeDialogAddToCalendar () {
        this.showAddToCalendar = false
        document.getElementsByClassName('amelia-app-booking')[0].style.display = 'none'
        window.location.reload()
      },

      resetAppointment () {
        if (this.$root.shortcodeData.booking.employee) {
          this.appointment.providerId = this.$root.shortcodeData.booking.employee
        }

        if (this.$root.shortcodeData.booking.location) {
          this.appointment.locationId = this.$root.shortcodeData.booking.location
        }

        if (this.$root.shortcodeData.booking.service) {
          this.appointment.serviceId = this.$root.shortcodeData.booking.service
        }

        if (this.$root.shortcodeData.booking.category) {
          this.appointment.categoryId = this.$root.shortcodeData.booking.category
        }

        this.appointment = {
          bookingStart: '',
          bookingStartTime: '',
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
          duration: 0,
          serviceDuration: 0,
          group: false,
          notifyParticipants: this.$root.settings.notifications.notifyCustomers,
          payment: {
            amount: 0,
            gateway: '',
            currency: '',
            data: {}
          },
          categoryId: null,
          providerId: this.forms[this.formType].selectServiceForm.itemsDraggable.employeeFormField.anyEmployeeVisible ? 0 : null,
          serviceId: this.setServiceIdOnResetAppointment(),
          locationId: null
        }

        this.setBookingCustomFields()
      },

      setServiceIdOnResetAppointment () {
        if (this.$root.shortcodeData.booking.service) {
          return this.$root.shortcodeData.booking.service
        }

        if (this.passedService && this.passedService.id) {
          return this.passedService.id
        }

        return null
      },

      continuePackage (selectedId) {
        if (!selectedId) {
          return false
        }

        this.selectedPackageId = selectedId
        this.selectPackage(this.getPackageById(selectedId))
      }
    },

    components: {
      moment,
      selectServiceForm,
      calendarDateTimeForm,
      recurringSetup,
      recurringDates,
      selectPackageForm,
      packageInfo,
      packageSetup,
      packageList,
      confirmBooking,
      addToCalendar
    }
  }
</script>
