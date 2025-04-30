<template>
  <div id="amelia-booking-wrap" class="am-wrap">

    <!-- Service -->
    <div id="am-service-booking" ref="bookingContainer" v-if="!empty && service && service.status === 'visible'">
      <transition name="fade">
        <div v-show="fetchedService">
          <!-- Services Gallery -->
          <div class="am-service-gallery">
            <el-carousel
              v-if="service.gallery.length > 0"
              indicator-position="none"
              :arrow="service.gallery.length === 1 ? 'never' : 'always'"
              :autoplay=true
            >
              <el-carousel-item v-for="(image, index) in service.gallery" :key="index">
                <div
                  class="am-image-slide"
                  :style="{'background-image': 'url(' + image.pictureFullPath + ')'}"
                >
                </div>
              </el-carousel-item>
            </el-carousel>
          </div>
          <!-- /Services Gallery -->

          <!-- Service Details -->
          <div class="am-service" :style="{backgroundColor: formColors.formBackgroundColor}">
            <!-- Service Header -->
            <div class="am-service-header">
              <!-- Service Profile Photo -->
              <div class="am-service-image">
                <img
                  :src="pictureLoad(service, false)" @error="imageLoadError(service, false)"
                  :alt="service.name"
                >
              </div>
              <!-- /Service Profile Photo -->

              <!-- Service Data -->
              <div class="am-service-data">
                <!-- Service Back -->
                <div
                  v-if="passedService"
                  class="am-category-url"
                  :style="{color: formColors.formTextColor}"
                  @mouseenter="(a) => a.target.style.color = this.customize.primaryColor"
                  @mouseleave="(a) => a.target.style.color = this.formColors.formTextColor"
                  @click="backToCategory"
                >
                  <i class="el-icon-back"></i> {{ category.name }}
                </div>
                <!-- /Service Back -->

                <!-- Service Name -->
                <div class="am-service-title">
                  <h2 :style="{color: formColors.formTextColor, fontFamily: $root.settings.customization.font}">
                    {{ service.name }}
                  </h2>
                </div>
                <!-- /Service Name -->

                <!-- Service Capacity, Duration -->
                <div v-if="formParts.capacity_colon.visibility && formParts.capacity_colon.visibility" class="am-service-info">
                  <div v-if="formParts.capacity_colon.visibility" :style="{color: formColors.formTextColor}">
                    {{ `${formLabels.capacity_colon.value || $root.labels.capacity_colon} ${getServiceCapacity(service)}` }}
                  </div>
                  <div v-if="formParts.capacity_colon.visibility" :style="{color: formColors.formTextColor}">
                    {{ `${formLabels.duration_colon.value || $root.labels.duration_colon} ${secondsToNiceDuration(service.duration)}` }}
                  </div>
                </div>
                <!-- /Service Capacity, Duration -->
              </div>
              <!-- /Service Data -->

              <!-- Service Price -->
              <div
                v-if="getServicePrice(service)['min'] || getServicePrice(service)['max']"
                class="am-service-price"
              >
                {{ getServicePrice(service)['price'] }}
              </div>
              <!-- /Service Price -->

            </div>
            <!-- /Service Header -->

            <!-- Service Description -->
            <div v-if="service.description && formParts.description.visibility" class="am-service-description">
              <h3 :style="{color: formColors.formTextColor}">
                {{ formLabels.description.value || $root.labels.description }}
              </h3>
              <p :style="{color: formColors.formTextColor}" v-html="service.description" class="ql-description"></p>
            </div>
            <!-- /Service Description -->

            <!-- Service Details -->
            <div v-if="formParts.service_info.visibility" class="am-service-info">
              <el-row :gutter="32">

                <!-- Service Info -->
                <el-col :sm="columnsLg" class="am-service-info-column">
                  <h3 :style="{color: formColors.formTextColor}">
                    {{ formLabels.service_info.value || `${capitalizeFirstLetter($root.labels.service)} ${$root.labels.info}` }}
                  </h3>

                  <!-- Service Category -->
                  <el-row :gutter="12">
                    <el-col :span="12" :style="{color: formColors.formTextColor}">
                      {{ formLabels.category_colon.value || $root.labels.category_colon }}
                    </el-col>
                    <el-col
                      v-if="passedService"
                      class="am-align-right"
                      :style="{color: formColors.formTextColor}"
                      :span="12"
                    >
                      {{ category.name }}
                    </el-col>
                    <el-col
                      v-else
                      class="am-align-right"
                      :span="12"
                    >
                      <div
                        class="am-category-url"
                        :style="{color: formColors.formTextColor}"
                        @click="backToCategory"
                      >
                        {{ category.name }}
                      </div>
                    </el-col>
                  </el-row>

                  <!-- Service Duration -->
                  <el-row v-if="formParts.duration_colon.visibility" :gutter="12">
                    <el-col
                      :span="12"
                      :style="{color: formColors.formTextColor}"
                    >
                      {{ formLabels.duration_colon.value || $root.labels.duration_colon }}
                    </el-col>
                    <el-col
                      :span="12"
                      class="am-align-right"
                      :style="{color: formColors.formTextColor}"
                    >
                      {{ secondsToNiceDuration(service.duration) }}
                    </el-col>
                  </el-row>

                  <!-- Capacity -->
                  <el-row v-if="formParts.capacity_colon.visibility" :gutter="12">
                    <el-col
                      :span="12"
                      :style="{color: formColors.formTextColor}"
                    >
                      {{ formLabels.capacity_colon.value || $root.labels.capacity_colon }}
                    </el-col>
                    <el-col
                      :span="12"
                      class="am-align-right"
                      :style="{color: formColors.formTextColor}"
                    >
                      {{ getServiceCapacity(service) }}
                    </el-col>
                  </el-row>
                </el-col>

                <!-- Extras or Employees -->
                <el-col
                  :sm="columnsLg"
                  class="am-service-info-column"
                >
                  <extras
                    v-if="(service.extras.length > 0) && formParts.extras.visibility"
                    :form-colors="formColors"
                    :form-labels="formLabels"
                    :extras="service.extras"
                  ></extras>
                  <employees-block
                    v-if="!service.extras.length && formParts.employees.visibility"
                    :form-colors="formColors"
                    :form-labels="formLabels"
                    :employees="getServiceProviders(this.service.id)"
                  ></employees-block>
                </el-col>

              </el-row>
            </div>
            <!-- /Service Details -->

            <!-- Service Employees -->
            <employees-block
              v-if="(service.extras.length > 0) && formParts.employees.visibility"
              :form-colors="formColors"
              :form-labels="formLabels"
              :employees="getServiceProviders(this.service.id)"
            ></employees-block>
            <!-- /Service Employees -->

            <!-- Service Booking -->
            <booking
              v-if="fetchedService"
              :id="id"
              :form-type="'catalogForm'"
              :passedService="service"
              :passedCategory="category"
              :passedEntities="options.entities"
              :passedEntitiesRelations="options.entitiesRelations"
              :showService="false"
              :addToCalendarProperty="addToCalendarProperty"
              @entitiesFetched="getEntities"
            >
            </booking>
            <!-- /Service Booking -->

          </div>
          <!-- /Service Details -->

        </div>
      </transition>
    </div>
    <!-- /Service -->

    <!-- Spinner -->
    <div class="am-loader" v-show="!empty && !fetchedService">
      <svg class="am-loader-spin">
        <use :href="$root.getUrl + 'public/img/oval-spinner-new.svg#spinner'"></use>
      </svg>
      <svg class="am-loader-hourglass">
        <use :href="$root.getUrl + 'public/img/hourglass-new.svg#hourglass'"></use>
      </svg>
    </div>
    <!-- /Spinner -->


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
import formsCustomizationMixin from '../../../../assets/js/common/mixins/formsCustomizationMixin'

export default {

  mixins: [cacheMixin, imageMixin, catalogMixin, durationMixin, entitiesMixin, helperMixin, formsCustomizationMixin],

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
    passedService: {
      default: () => {},
      type: Object
    },
    passedResponseEntities: {
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
      category: {},
      fetchedService: false,
      originalShortcodeData: {},
      service: {
        extras: [],
        gallery: [],
        providers: []
      },
      responseEntities: {
        taxes: [],
        categories: [],
        employees: [],
        locations: [],
        customFields: []
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
          services: [],
          employees: [],
          locations: []
        }
      },
      serviceId: '',
      columnsLg: 12,
      formColors: Object.keys(this.formsData).length ? (this.$root.settings.customization.useGlobalColors.catalogForm ? this.$root.settings.customization.globalColors : this.formsData.categoryServiceForm.globalSettings) : {},
      formLabels: Object.keys(this.formsData).length ? this.formsData.categoryServiceForm.labels : {},
      formParts: Object.keys(this.formsData).length ? this.formsData.categoryServiceForm.parts : {}
    }
  },

  created () {
    if (!Object.keys(this.formsData).length) {
      let customizedData = this.getTranslatedForms('catalogForm').catalogForm
      this.formColors = this.$root.settings.customization.useGlobalColors.catalogForm ? this.$root.settings.customization.globalColors : customizedData.categoryServiceForm.globalSettings
      this.formLabels = customizedData.categoryServiceForm.labels
      this.formParts = customizedData.categoryServiceForm.parts
    }
    this.id = this.id + this.$root.shortcodeData.counter
    this.serviceId = 'service' in this.$root.shortcodeData.booking ? parseInt(this.$root.shortcodeData.booking.service) : null
    window.addEventListener('resize', this.handleResize)
  },

  mounted () {
    if ('booking' in this.$root.shortcodeData) {
      for (let key in this.$root.shortcodeData.booking) {
        this.originalShortcodeData[key] = this.$root.shortcodeData.booking[key]
      }
    }

    if (this.passedService) {
      this.options.isFrontEnd = true
      this.options.entitiesRelations = Object.assign({}, this.passedEntitiesRelations)
      this.responseEntities = this.passedResponseEntities

      let shortCodeEntitiesIds = this.getShortCodeEntityIds()

      this.filterEntities(this.passedEntities, {
        categoryId: this.passedService.categoryId,
        serviceId: this.passedService.id,
        employeeId: shortCodeEntitiesIds.employeeId,
        locationId: shortCodeEntitiesIds.locationId
      })

      this.service = JSON.parse(JSON.stringify(this.passedService))
      this.category = JSON.parse(JSON.stringify(this.passedCategory))
      this.fetchedService = true

      // Customization hook
      if ('beforeCatalogServiceLoaded' in window) {
        window.beforeCatalogServiceLoaded(this.category, this.service)
      }
    } else {
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
    }
  },

  updated () {
    this.handleResize()
  },

  methods: {
    fetchedEntities () {
      if (this.options.entities.services.length === 0 || this.options.entities.employees.length === 0) this.empty = true

      let category = this.options.entities.categories.find(category => category.id === this.categoryId)
      this.category = typeof category !== 'undefined' ? category : null

      this.service = this.getServiceById(this.serviceId)
      if (this.service) {
        this.category = this.options.entities.categories.find(category => category.id === this.service.categoryId)
      }
      this.fetchedService = true
    },

    backToCategory () {
      for (let key in this.originalShortcodeData) {
        this.$root.shortcodeData.booking[key] = this.originalShortcodeData[key]
      }

      this.$emit('showAllServices')
    },

    getEntities (entities) {
      this.options.entities = entities
      // Add employees into service object, to show the employee's service prices
      this.service.providers = this.getServiceProviders(this.service.id)
    },

    handleResize () {
      let amContainer = document.getElementById('amelia-app-booking' + this.$root.shortcodeData.counter)
      if (!amContainer) {
        return
      }
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
