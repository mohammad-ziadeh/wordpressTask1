<template>
  <div id="amelia-booking-wrap" class="am-wrap">

    <!-- Package -->
    <div id="am-service-booking" ref="bookingContainer" v-if="!empty && package && package.status === 'visible'">
      <transition name="fade">
        <div v-show="fetchedPackage">

          <!-- Package Gallery -->
          <div class="am-service-gallery">
            <el-carousel
              v-if="package.gallery.length > 0"
              indicator-position="none"
              :arrow="package.gallery.length === 1 ? 'never' : 'always'"
              :autoplay=true
            >
              <el-carousel-item v-for="(image, index) in package.gallery" :key="index">
                <div
                  class="am-image-slide"
                  :style="{'background-image': 'url(' + image.pictureFullPath + ')'}">
                </div>
              </el-carousel-item>
            </el-carousel>
          </div>

          <!-- Package Details -->
          <div class="am-service" :style="{backgroundColor: formColors.formBackgroundColor}">

            <!-- Package Header -->
            <div class="am-service-header">

              <!-- Package Profile Photo -->
              <div class="am-service-image">
                <img
                  :src="pictureLoad(package, false)" @error="imageLoadError(package, false)"
                  :alt="package.name"
                >
              </div>

              <!-- Package Data -->
              <div class="am-service-data">

                <!-- Package Back -->
                <div
                  v-if="passedCategory"
                  :style="{color: formColors.formTextColor}"
                  class="am-category-url" @click="backToCategory"
                >
                  <i class="el-icon-back"></i> {{ passedCategory.name }}
                </div>

                <!-- Package Name -->
                <div class="am-service-title">
                  <h2 :style="{color: formColors.formTextColor, fontFamily: $root.settings.customization.font}">
                    {{ package.name }}
                  </h2>
                </div>
              </div>

              <!-- Package Price -->
              <div class="am-service-price" v-if="package.price">
                {{ getFormattedPrice(package.calculatedPrice ? package.price : package.price - package.price / 100 * package.discount, !$root.settings.payments.hideCurrencySymbolFrontend) }}
              </div>

            </div>

            <el-row
              v-if="formParts.package_rules_description.visibility || formParts.selected_services.visibility"
              class="am-package-selected"
            >
              <el-col
                v-if="formParts.package_rules_description.visibility"
                :span="12"
                class="am-package-selected-col"
              >
                <div class="am-package-rule">
                  <div>
                    <span :style="{color: formColors.formTextColor}">
                      <i class="el-icon-date"></i> {{ $root.labels.package_book_service }} {{ package.sharedCapacity && package.quantity ? $root.labels.package_book_service_2 + ' ' + package.quantity + ' ' + (package.quantity === 1 ? $root.labels.appointment.toLowerCase() : $root.labels.appointments.toLowerCase()) + '.' : '' }}
                    </span>
                  </div>

                  <div v-if="package.durationType !== null || package.endDate !== null">
                    <span
                      v-if="package.durationType === 'day' || package.durationType === 'week' || package.durationType === 'month'"
                      :style="{color: formColors.formTextColor}"
                    >
                      <i class="el-icon-time"></i> {{ $root.labels.package_book_duration }} {{ package.durationCount }}  {{ package.durationCount > 1 ? $root.labels[package.durationType + 's'].toLowerCase() : $root.labels[package.durationType].toLowerCase() + '.' }}
                    </span>
                    <span
                      v-if="package.endDate !== null"
                      :style="{color: formColors.formTextColor}"
                    >
                      <i class="el-icon-time"></i> {{ $root.labels.package_book_expire }} {{ formatDate(package.endDate) }}
                    </span>
                  </div>
                </div>

                <div class="am-package-description ql-description"><p v-html="package.description" :style="{color: formColors.formTextColor}"></p></div>
              </el-col>

              <el-col
                v-if="formParts.selected_services.visibility"
                :span="12"
                class="am-package-selected-col"
              >
                <el-row v-for="bookable in package.availableBookableInfo" :key="bookable.serviceId">
                  <el-col :span="16" class="am-package-service" :style="{color: formColors.formTextColor}">
                    {{ bookable.serviceName }} <span :style="{color: formColors.formTextColor}" v-if="!package.sharedCapacity">x{{ bookable.serviceQuantity }}</span>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>

            <!-- Package Booking -->
            <booking
              v-if="fetchedPackage"
              :id="id"
              :form-type="'catalogForm'"
              :passedPackage="package"
              :passedCategory="passedCategory"
              :passedEntities="options.entities"
              :passedEntitiesRelations="options.entitiesRelations"
              :showPackage="false"
              :addToCalendarProperty="addToCalendarProperty"
              @entitiesFetched="getEntities"
            >
            </booking>

          </div>

        </div>
      </transition>
    </div>

    <div v-if="empty" class="am-no-services">
      <img :src="$root.getUrl+'public/img/am-empty-booking.svg'" style="margin-top: 10px;">
      <h1>{{$root.labels.oops}}</h1>
      <h3>{{$root.labels.no_services_employees}}</h3>
      <p>{{$root.labels.add_services_employees}}</p>
      <a href="https://wpamelia.com/services-and-categories/" rel="nofollow">
        {{$root.labels.add_services_url}}
      </a>
      <span style="font-size:14px">{{$root.labels.and}}</span>
      <a href="https://wpamelia.com/employees/" rel="nofollow">
        {{$root.labels.add_employees_url}}
      </a>
    </div>

  </div>
</template>

<script>
  import imageMixin from '../../../js/common/mixins/imageMixin'
  import PhoneInput from '../../parts/PhoneInput.vue'
  import catalogMixin from '../../../js/frontend/mixins/catalogMixin'
  import durationMixin from '../../../js/common/mixins/durationMixin'
  import entitiesMixin from '../../../js/common/mixins/entitiesMixin'
  import cacheMixin from '../../../js/frontend/mixins/cacheMixin'
  import Booking from '../booking/Booking'
  import Extras from './parts/Extras'
  import EmployeesBlock from './parts/EmployeesBlock'
  import helperMixin from '../../../js/backend/mixins/helperMixin'
  import dateMixin from '../../../js/common/mixins/dateMixin'
  import moment from 'moment'
  import formsCustomizationMixin from '../../../../assets/js/common/mixins/formsCustomizationMixin'

  export default {

    mixins: [cacheMixin, dateMixin, imageMixin, catalogMixin, durationMixin, entitiesMixin, helperMixin, formsCustomizationMixin],

    props: {
      addToCalendarProperty: {
        type: Object,
        default: () => {
          return {
            visible: true
          }
        }
      },
      formsData: {
        type: Object,
        default: () => {
          return {}
        }
      },
      customize: {
        type: Object,
        default: () => {
          return {}
        }
      },
      passedCategory: {
        default: () => {},
        type: Object
      },
      passedPackage: {
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
      }
    },

    data () {
      return {
        empty: false,
        id: 'am-step-booking-catalog',
        package: {},
        fetchedPackage: false,
        responseEntities: {
          taxes: [],
          categories: [],
          employees: [],
          locations: [],
          customFields: []
        },
        options: {
          availableEntitiesIds: {
            packages: [],
            categories: [],
            employees: [],
            locations: [],
            services: []
          },
          entitiesRelations: {},
          entities: {
            packages: [],
            services: [],
            employees: [],
            locations: []
          }
        },
        packageId: '',
        columnsLg: 12,
        formColors: Object.keys(this.formsData).length ? (this.$root.settings.customization.useGlobalColors.catalogForm ? this.$root.settings.customization.globalColors : this.formsData.categoryPackageForm.globalSettings) : {},
        formParts: Object.keys(this.formsData).length ? this.formsData.categoryPackageForm.parts : {}
      }
    },

    created () {
      if (!Object.keys(this.formsData).length) {
        let customizedData = this.getTranslatedForms('catalogForm').catalogForm
        this.formColors = this.$root.settings.customization.useGlobalColors.catalogForm ? this.$root.settings.customization.globalColors : customizedData.categoryPackageForm.globalSettings
        this.formParts = customizedData.categoryPackageForm.parts
      }
      this.id = this.id + this.$root.shortcodeData.counter
      this.packageId = 'package' in this.$root.shortcodeData.booking ? this.$root.shortcodeData.booking.package : null
      window.addEventListener('resize', this.handleResize)
    },

    mounted () {
      this.$nextTick(() => {
        if (this.$refs && this.$refs.bookingContainer) {
          this.$refs.bookingContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' })
        }
      })

      if (this.passedPackage) {
        this.options.isFrontEnd = true

        this.package = JSON.parse(JSON.stringify(this.passedPackage))
        this.fetchedPackage = true

        this.options.entities = this.passedEntities
        this.options.entitiesRelations = this.passedEntitiesRelations

        // Customization hook
        if ('beforeCatalogPackageLoaded' in window) {
          window.beforeCatalogPackageLoaded(this.package)
        }
      } else {
        this.fetchEntities((success) => {
          if (success) {
            this.fetchedEntities()
          }
        }, {
          types: ['locations', 'employees', 'categories', 'custom_fields', 'packages', 'taxes'],
          isFrontEnd: true,
          isPanel: false
        })
      }
    },

    updated () {
      this.handleResize()
    },

    methods: {
      fetchedEntities () {
        this.package = this.getPackageById(this.packageId)
        if (this.options.entities.packages.length === 0 || this.options.entities.employees.length === 0 || !this.package) this.empty = true
        this.fetchedPackage = true
      },

      backToCategory () {
        this.$emit('showAllServices')
      },

      getEntities (entities) {
        this.options.entities = entities
      },

      handleResize () {
        let amContainer = document.getElementById('amelia-app-booking' + this.$root.shortcodeData.counter)
        let amContainerWidth = amContainer.offsetWidth
        if (amContainerWidth < 670) {
          this.columnsLg = 24
          amContainer.classList.add('am-mobile-collapsed')
          amContainer.classList.remove('am-desktop')
        } else {
          this.columnsLg = 12
          amContainer.classList.add('am-desktop')
          amContainer.classList.remove('am-mobile-collapsed')
        }
      },

      formatDate (date) {
        return this.getFrontedFormattedDate(
          moment(date).format('YYYY-MM-DD')
        )
      }
    },

    components: {
      PhoneInput,
      Booking,
      Extras,
      EmployeesBlock
    }

  }
</script>
