<template>
  <div class="am-wrap" ref="categoryContainer">

    <div id="am-category" v-if="!empty">

      <!-- Services -->
      <transition name="fade" v-if="category">
        <div v-show="fetchedCategory && showCategory && !loadingCacheCategoryData">
          <!-- Back button & Category Name -->
          <div class="am-category-headline">
            <span
              v-if="$root.shortcodeData.enabled === false || $root.shortcodeData.hasCategoryShortcode.length === 0"
              :style="{color: globalCustomization.globalColors.primaryColor}"
              @click="backToCatalog" class="am-back"
            >
              <i class="el-icon-arrow-left"></i> {{ formLabels.back.value || $root.labels.back }}
            </span>
            <h3 :style="{color: globalCustomization.globalColors.primaryColor, fontWeight: 500}">
              {{ category.name }}
            </h3>
          </div>

          <!-- Service Item -->
          <el-row :gutter="24" v-if="options.entities.services" type="flex" class="am-category-service-wrapper">
            <el-col
              v-for="(service, index) in getListedItems()"
              v-if="('type' in service) || getServiceProviders(service.id).length > 0"
              :key="index"
              :lg="columnsLg"
              :md="12"
              :sm="12"
              class="am-category-service-inner"
            >
              <!-- Service -->
              <div class="am-category-service">
                <!-- View More -->
                <div
                  class="am-category-service-hover"
                  :style="{backgroundColor: colorTransparency(globalCustomization.globalColors.primaryColor, 0.7)}"
                  @click="showNext(service)"
                >
                  <span class="am-category-service-title">{{ service.name }}</span>
                  <el-button>{{ formLabels.view_more.value || $root.labels.view_more }}</el-button>
                </div>

                <!-- Service Background Image -->
                <div
                  class="am-category-service-image"
                  :style="(service.pictureFullPath) ? {'background-image': 'url(' + service.pictureFullPath + ')'} : null"
                >
                </div>

                <!-- Service Info -->
                <div class="am-category-service-info" :style="{backgroundColor: formColors.formBackgroundColor}">

                  <!-- Service Initials -->
                  <div v-if="!('type' in service) && formParts.service_badge.visibility" class="am-category-color-wrapper">
                    <div class="am-category-service-color" :style="{'background-color': service.color}">
                      {{ getNameInitials(service.name) }}
                    </div>
                  </div>

                  <div v-if="('type' in service) && formParts.package_badge.visibility" class="am-category-color-wrapper">
                    <div class="am-category-service-color am-category-package-color" :style="{'background-color': service.color}">
                      <img :src="$root.getUrl + 'public/img/am-package-catalog.svg'">
                    </div>
                    <div class="am-category-item-type" :style="{'background-color': service.color}">
                      {{ formLabels.package.value || $root.labels.package }}
                    </div>
                  </div>

                  <div
                    :class="'type' in service ? 'am-category-package-title-price' : 'am-category-service-title-price'"
                    :style="{color: formColors.formTextColor}"
                  >
                    <!-- Service Name -->
                    <div class="am-category-service-title" :style="{color: formColors.formTextColor}">
                      {{ service.name }}
                    </div>

                    <!-- Service Price -->
                    <span
                      v-if="!('type' in service) && formParts.service_price.visibility"
                      :style="{visibility: ((getServicePrice(service)['min'] || getServicePrice(service)['max']) ? '' : 'hidden'), color: formColors.formTextColor, opacity: 0.7}"
                    >
                      {{ formLabels.price_colon.value || $root.labels.price_colon }} {{ getServicePrice(service)['price'] }}
                    </span>
                    <span
                      v-if="('type' in service) && formParts.package_price.visibility"
                      :style="{visibility: service.price ? '' : 'hidden', color: formColors.formTextColor}"
                      class="am-category-package-price"
                    >
                      {{ getFormattedPrice(service.calculatedPrice ? service.price : service.price - service.price / 100 * service.discount, !$root.settings.payments.hideCurrencySymbolFrontend) }}
                      <span
                        v-if="service.discount && !service.calculatedPrice"
                        :style="{color: formColors.formTextColor, opacity: 0.7}"
                      >
                        {{ `${ formLabels.package_discount_text.value || $root.labels.package_discount_text} ${service.discount}%` }}
                      </span>
                    </span>
                  </div>

                  <div v-if="('type' in service) && formParts.package_services_list.visibility">
                    <div :style="{color: formColors.formTextColor}">
                      {{ formLabels.services.value || $root.labels.services }}
                    </div>
                    <span
                      v-for="item in service.bookable"
                      class="am-category-package-service-item"
                      :style="{color: formColors.formTextColor, opacity: 0.7}"
                    >
                      {{ item.service.name }}
                    </span>
                  </div>

                  <!-- Service Employees -->
                  <div class="am-category-services-thumbs" v-show="!('type' in service) && formParts.service_employees_list.visibility">
                    <img
                      v-for="(employee, index) in getServiceProviders(service.id)"
                      v-if="index < 6"
                      :key="employee.id"
                      :style="{borderColor: formColors.formBackgroundColor}"
                      :src="pictureLoad(employee, true)"
                      @error="imageLoadError(employee, true)"
                    >
                    <span v-if="getServiceProviders(service.id).length > 6">
                  +{{ getInvisibleEmployeesCount(service) }}
                </span>
                  </div>

                </div>

              </div>
            </el-col>
          </el-row>

        </div>
      </transition>

      <!-- Service -->
      <service
        v-if="showService"
        :forms-data="dataObj"
        :customize="globalCustomization.globalColors"
        :passed-category="category"
        :passed-service="category.serviceList.find(service => service.id === serviceId)"
        :passed-entities="options.entities"
        :passed-entities-relations="options.entitiesRelations"
        :addToCalendarProperty="addToCalendarProperty"
        @showAllServices="showAllServices"
      >
      </service>

      <!-- Package -->
      <package
        v-if="showPackage"
        :forms-data="dataObj"
        :customize="globalCustomization.globalColors"
        :passed-category="category"
        :passed-package="getPackageById(packageId)"
        :passed-entities="responseEntities"
        :passed-entities-relations="options.entitiesRelations"
        :addToCalendarProperty="addToCalendarProperty"
        @showAllServices="showAllServices"
      >
      </package>

      <!-- Spinner -->
      <div class="am-spinner am-section c2" v-show="(!fetchedCategory && $root.shortcodeData.enabled === true) || loadingCacheCategoryData">
        <img class="svg-category am-spin" :src="$root.getUrl + 'public/img/oval-spinner.svg'">
        <img class="svg-category am-hourglass" :src="$root.getUrl + 'public/img/hourglass.svg'">
      </div>

    </div>

    <div v-else class="am-no-services">
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

    <div v-if="showCategory && $root.licence.isLite && $root.settings.general.backLink.enabled" class="am-lite-footer">
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
  import imageMixin from '../../../js/common/mixins/imageMixin'
  import priceMixin from '../../../js/common/mixins/priceMixin'
  import catalogMixin from '../../../js/frontend/mixins/catalogMixin'
  import entitiesMixin from '../../../js/common/mixins/entitiesMixin'
  import cacheMixin from '../../../js/frontend/mixins/cacheMixin'
  import formsCustomizationMixin from '../../../js/common/mixins/formsCustomizationMixin'
  import cssColorManipulationMixin from '../../../js/common/mixins/cssColorManipulationMixin'
  import marketingMixin from '../../../js/frontend/mixins/marketingMixin'
  import Service from '../catalog/Service'
  import Package from '../catalog/Package'

  export default {

    mixins: [cacheMixin, imageMixin, priceMixin, catalogMixin, entitiesMixin, formsCustomizationMixin, cssColorManipulationMixin],

    props: {
      formsData: {
        type: Object,
        default: () => {
          return {}
        }
      },
      passedCategory: {
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
        addToCalendarProperty: {
          visible: true
        },
        category: {
          serviceList: []
        },
        marketing: {
          service: null,
          employee: null,
          location: null,
          category: null,
          package: null,
          payment: null
        },
        categoryId: '',
        fetchedCategory: false,
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
            packages: [],
            employees: [],
            locations: []
          }
        },
        packageId: '',
        serviceId: '',
        showCategory: true,
        showService: false,
        showPackage: false,
        columnsLg: 8,
        globalCustomization: this.$root.settings.customization,
        dataObj: Object.keys(this.formsData).length ? this.formsData : {},
        formColors: Object.keys(this.formsData).length ? (this.$root.settings.customization.useGlobalColors.catalogForm ? this.$root.settings.customization.globalColors : this.formsData.categoryListForm.globalSettings) : {},
        formLabels: Object.keys(this.formsData).length ? this.formsData.categoryListForm.labels : {},
        formParts: Object.keys(this.formsData).length ? this.formsData.categoryListForm.parts : {}
      }
    },

    created () {
      if (!Object.keys(this.formsData).length) {
        let customizedData = this.getTranslatedForms('catalogForm').catalogForm
        this.dataObj = customizedData
        this.formColors = this.$root.settings.customization.useGlobalColors.catalogForm ? this.$root.settings.customization.globalColors : customizedData.categoryListForm.globalSettings
        this.formLabels = customizedData.categoryListForm.labels
        this.formParts = customizedData.categoryListForm.parts
      }
      this.categoryId = 'category' in this.$root.shortcodeData.booking ? this.$root.shortcodeData.booking.category : null
      window.addEventListener('resize', this.handleResize)
    },

    mounted () {
      this.setCacheData('amelia-app-booking' + this.$root.shortcodeData.counter, false)

      if (!this.$root.shortcodeData.hasCategoryShortcode) {
        this.inlineCategorySVG()
      }

      if (this.passedCategory) {
        this.options.isFrontEnd = true
        this.options.entitiesRelations = Object.assign({}, this.passedEntitiesRelations)
        this.responseEntities = this.passedResponseEntities

        let shortCodeEntitiesIds = this.getShortCodeEntityIds()

        this.filterEntities(this.passedEntities, {
          categoryId: this.passedCategory.id,
          serviceId: shortCodeEntitiesIds.serviceId,
          employeeId: shortCodeEntitiesIds.employeeId,
          locationId: shortCodeEntitiesIds.locationId
        })

        this.category = JSON.parse(JSON.stringify(this.passedCategory))
        this.fetchedCategory = true

        this.cacheDataProcessing()

        this.options.entities.packages.sort((a, b) => a.position - b.position)
      } else {
        let $this = this

        this.fetchEntities(function (success) {
          if (success) {
            $this.fetchedEntities(success)
          }
        }, {
          types: ['locations', 'employees', 'categories', 'custom_fields', 'packages', 'taxes'],
          isFrontEnd: true,
          isPanel: false
        })
      }

      // Customization hook
      if ('beforeCatalogCategoryLoaded' in window) {
        window.beforeCatalogCategoryLoaded(this.category)
      }
    },

    updated () {
      this.handleResize()
    },

    methods: {
      cacheDataProcessing () {
        if (this.loadingCacheBookingData) {
          let entity = null

          switch (this.cacheData.request.bookableType) {
            case ('appointment'):
              entity = this.getServiceById(this.cacheData.request.bookable.id)

              break

            case ('package'):
              entity = this.getPackageById(this.cacheData.request.bookable.id)

              break
          }

          this.showNext(entity)

          this.loadingCacheCategoryData = false
        }
      },

      showNext (entity) {
        this.$nextTick(() => {
          if (this.$refs && this.$refs.categoryContainer) {
            this.$refs.categoryContainer.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' })
          }
        })

        !('type' in entity) ? this.selectService(entity.id) : this.selectPackage(entity.id)
      },

      getListedItems () {
        let shortCodeEntitiesIds = this.getShortCodeEntityIds()

        if (shortCodeEntitiesIds.show === 'packages') {
          return this.options.entities.packages
        } else if (shortCodeEntitiesIds.show === 'services') {
          return this.options.entities.services
        } else {
          return this.options.entities.packages.concat(this.options.entities.services)
        }
      },

      fetchedEntities () {
        if (this.options.entities.services.length === 0 || this.options.entities.employees.length === 0) this.empty = true
        let category = this.options.entities.categories.find(category => category.id === this.categoryId)

        this.category = typeof category !== 'undefined' ? category : null

        this.fetchedCategory = true

        this.cacheDataProcessing()
      },

      backToCatalog () {
        this.$emit('showAllCategories')
      },

      getInvisibleEmployeesCount (service) {
        let serviceProviders = this.getServiceProviders(service.id)

        return serviceProviders.length > 6 ? serviceProviders.length - 6 : ''
      },

      selectService (serviceId) {
        this.serviceId = serviceId

        // Customization hook
        if ('afterSelectCatalogService' in window) {
          window.afterSelectCatalogService(this.category, this.category.serviceList.find(service => service.id === serviceId))
        }

        if (marketingMixin.hasAmeliaTracking(this.$root.marketing, this.serviceId)) {
          this.marketing.service = this.getServiceById(this.serviceId)

          marketingMixin.trackAmeliaData(this, this.$root.marketing, 'appointment', 'SelectService')
        }

        this.showCategory = false
        this.showService = true
      },

      selectPackage (packageId) {
        this.packageId = packageId

        // Customization hook
        if ('afterSelectCatalogPackage' in window) {
          window.afterSelectCatalogService(this.options.entities.packages.find(pack => pack.id === packageId))
        }

        if (marketingMixin.hasAmeliaTracking(this.$root.marketing, this.packageId)) {
          this.marketing.package = this.getPackageById(this.packageId)

          marketingMixin.trackAmeliaData(this, this.$root.marketing, 'package', 'SelectPackage')
        }

        this.showCategory = false
        this.showPackage = true
      },

      showAllServices () {
        this.serviceId = ''
        this.showCategory = true
        this.showService = false
        this.showPackage = false
        this.addToCalendarProperty.visible = false
      },

      handleResize () {
        let amContainer = document.getElementById('amelia-app-booking' + this.$root.shortcodeData.counter)
        let amContainerWidth = amContainer.offsetWidth
        if (amContainerWidth < 670) {
          this.columnsLg = 12
        }

        if (amContainerWidth >= 670) {
          this.columnsLg = 8
        }
      },

      inlineCategorySVG () {
        let inlineSVG = require('inline-svg')
        inlineSVG.init({
          svgSelector: 'img.svg-category',
          initClass: 'js-inlinesvg'
        })
      }
    },

    components: {
      Service,
      Package
    }

  }
</script>
