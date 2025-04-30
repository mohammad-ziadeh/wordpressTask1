<template>
  <div id="amelia-booking-wrap" class="am-wrap" ref="catalogContainer">

    <div id="am-catalog" v-if="!empty">

      <!-- Categories -->
      <transition name="fade">
        <div v-show="fetchedCatalog && showCatalog && !loadingCacheCatalogData">

          <!-- Categories Label -->
          <div v-if="formLabels.categories.visibility" class="am-catalog-headline">
            <h3 :style="{color: formColors.formTextColor, fontWeight: 500}">
              {{ formLabels.categories.value || $root.labels.categories }}
            </h3>
          </div>

          <el-row :gutter="24">
            <el-col
              v-for="category in options.entities.categories"
              v-if="showCategoryInCatalog(category) && getServicesForCategory(category).length > 0"
              :key="category.id"
              :lg="columnsLg"
              :md="12"
              :sm="12"
            >
              <div
                class="am-category"
                :style="{backgroundColor: formColors.formBackgroundColor}"
                @click="selectCategory(category.id)"
              >
                <!-- Category Name -->
                <div class="am-category-title" :style="{color: formColors.formTextColor}">
                  {{ category.name }}
                </div>

                <!-- Number Of Services -->
                <span v-if="formLabels.services_lower.visibility" :style="{color: formColors.formTextColor}">
                  {{ `${formLabels.services_lower.value || capitalizeFirstLetter($root.labels.services_lower)}: ${getServicesForCategory(category).length}` }}
                </span>

                <!-- Services Images -->
                <div v-if="formParts.service_images_thumbs.visibility" class="am-category-services-thumbs">
                  <img
                    v-for="(service, index) in getServicesForCategory(category)"
                    v-if="index < 3"
                    :key="service.id"
                    :src="pictureLoad(service, false)"
                    @error="imageLoadError(service, false)"
                  >

                  <!-- Invisible Services Count -->
                  <span v-if="getServicesForCategory(category).length > 3" :style="{color: formColors.formTextColor}">
                    +{{ getInvisibleServicesCount(category) }}
                  </span>
                  <!-- /Invisible Services Count -->
                </div>
                <!-- /Services Images -->
              </div>
            </el-col>
          </el-row>
        </div>
      </transition>

      <!-- Category -->
      <category
        v-if="showCategory"
        :forms-data="forms.catalogForm"
        :passedCategory="passCategory()"
        :passedResponseEntities="responseEntities"
        :passedEntities="options.entities"
        :passedEntitiesRelations="options.entitiesRelations"
        @showAllCategories="showAllCategories"
      >
      </category>


      <!-- Spinner -->
      <div class="am-spinner am-section" v-show="!fetchedCatalog || loadingCacheCatalogData">
        <img class="svg-catalog am-spin" :src="$root.getUrl + 'public/img/oval-spinner.svg'"/>
        <img class="svg-catalog am-hourglass" :src="$root.getUrl + 'public/img/hourglass.svg'"/>
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

    <div v-if="showCatalog && $root.licence.isLite && $root.settings.general.backLink.enabled" class="am-lite-footer">
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
import formsCustomizationMixin from '../../../../assets/js/common/mixins/formsCustomizationMixin'
import imageMixin from '../../../js/common/mixins/imageMixin'
import Category from '../catalog/Category'
import entitiesMixin from '../../../js/common/mixins/entitiesMixin'
import cacheMixin from '../../../js/frontend/mixins/cacheMixin'
import helperMixin from '../../../js/backend/mixins/helperMixin'
import marketingMixin from '../../../js/frontend/mixins/marketingMixin'

export default {
  name: 'catalogForm',

  mixins: [cacheMixin, imageMixin, entitiesMixin, helperMixin, formsCustomizationMixin],

  data () {
    return {
      empty: false,
      categoryId: '',
      marketing: {
        service: null,
        employee: null,
        location: null,
        category: null,
        package: null,
        payment: null
      },
      fetchedCatalog: false,
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
          employees: [],
          locations: []
        }
      },
      showCatalog: true,
      showCategory: false,
      columnsLg: 6,
      forms: {},
      formColors: {},
      formLabels: {},
      formParts: {}
    }
  },

  created () {
    this.forms = this.getTranslatedForms('catalogForm')

    if (this.$root.settings.customization.forms) {
      this.formColors = this.$root.settings.customization.useGlobalColors[this.$options.name] ? this.$root.settings.customization.globalColors : this.forms.catalogForm.catalogListForm.globalSettings
    } else {
      this.formColors = this.defaultFormsData.catalogForm.catalogListForm.globalSettings
    }

    this.formLabels = this.$root.settings.customization.forms ? this.forms.catalogForm.catalogListForm.labels : this.defaultFormsData.catalogForm.catalogListForm.labels
    this.formParts = this.$root.settings.customization.forms ? this.forms.catalogForm.catalogListForm.parts : this.defaultFormsData.catalogForm.catalogListForm.parts

    window.addEventListener('resize', this.handleResize)
  },

  mounted () {
    this.setCacheData('amelia-app-booking' + this.$root.shortcodeData.counter, false)

    this.inlineCatalogSVG()

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

    // Customization hook
    if ('beforeCatalogLoaded' in window) {
      window.beforeCatalogLoaded()
    }
  },

  updated () {
    this.handleResize()
  },

  methods: {
    cacheDataProcessing () {
      if (this.loadingCacheBookingData) {
        this.categoryId = this.cacheData.request.passedCategoryId

        this.selectCategory(this.categoryId)

        this.loadingCacheCatalogData = false
      }
    },

    fetchedEntities () {
      if (this.options.entities.services.length === 0 || this.options.entities.employees.length === 0) this.empty = true

      this.fetchedCatalog = true

      this.cacheDataProcessing()
    },

    getInvisibleServicesCount (category) {
      let services = this.getServicesForCategory(category)

      return services.length > 3 ? services.length - 3 : ''
    },

    selectCategory (categoryId) {
      this.$nextTick(() => {
        if (this.$refs && this.$refs.catalogContainer) {
          this.$refs.catalogContainer.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' })
        }
      })

      this.categoryId = categoryId
      this.showCatalog = false
      this.showCategory = true

      // Customization hook
      if ('afterSelectCatalogCategory' in window) {
        window.afterSelectCatalogCategory(this.passCategory())
      }

      if (marketingMixin.hasAmeliaTracking(this.$root.marketing, this.categoryId)) {
        this.marketing.category = this.getCategoryById(this.categoryId)

        marketingMixin.trackAmeliaData(this, this.$root.marketing, 'appointment', 'SelectCategory')
      }
    },

    showAllCategories () {
      this.categoryId = ''
      this.showCatalog = true
      this.showCategory = false
    },

    // Show category if have at least one employee in one of the services
    showCategoryInCatalog (category) {
      let oneServiceHaveEmployee = false

      for (let i = 0; i < category.serviceList.length; i++) {
        if (oneServiceHaveEmployee === true) { break }

        oneServiceHaveEmployee = this.getServiceProviders(category.serviceList[i].id).length > 0
      }

      return category.serviceList.length > 0 && oneServiceHaveEmployee
    },

    getServicesForCategory (category) {
      return this.options.entities.services.filter(service => service.categoryId === category.id)
    },

    passCategory () {
      let category = Object.assign({}, this.options.entities.categories.find(category => category.id === this.categoryId))
      category.serviceList = this.getServicesForCategory(category)

      return category
    },

    handleResize () {
      let amContainer = document.getElementById('amelia-app-booking' + this.$root.shortcodeData.counter)
      let amContainerWidth = amContainer.offsetWidth
      if (amContainerWidth < 670) {
        this.columnsLg = 12
      }
    },

    inlineCatalogSVG () {
      let inlineSVG = require('inline-svg')
      inlineSVG.init({
        svgSelector: 'img.svg-catalog',
        initClass: 'js-inlinesvg'
      })
    }
  },

  components: {
    Category
  }

}
</script>
