<template>
  <Content
    wrapper-class="am-fcil"
    form-class="am-fcil__main"
    :content-class="`am-fcil__wrapper ${customizeOptions.pageScroll.visibility ? '' : 'no-scroll'}`"
    :style="cssVars"
  >
    <template #header>
      <Header
        :btn-string="labelsDisplay('back_btn')"
        :btn-type="btnType('backBtn')"
      ></Header>
      <div class="am-fcil__filter">
        <div
          v-if="amCustomize.cbf.categoryItemsList.options.searchInput.visibility"
          class="am-fcil__filter-item"
          :class="filterClassWidth.search"
        >
          <AmInput v-model="searchFilter" :placeholder="labelsDisplay('filter_input')" :icon-start="iconSearch"></AmInput>
        </div>
        <div
          v-if="amCustomize.cbf.categoryItemsList.options.filterEmployee.visibility && !licence.isLite"
          class="am-fcil__filter-item"
          :class="filterClassWidth.employee"
        >
          <AmSelect
            v-model="employeeFilter"
            clearable
            filterable
            :placeholder="labelsDisplay('filter_employee')"
            :fit-input-width="true"
          >
            <AmOption
              v-for="employee in employeesList"
              :key="employee.id"
              :value="employee.id"
              :label="`${employee.firstName} ${employee.lastName}`"
            >
            </AmOption>
          </AmSelect>
        </div>
        <div
          v-if="amCustomize.cbf.categoryItemsList.options.filterLocation.visibility && !licence.isLite && !licence.isStarter"
          class="am-fcil__filter-item"
          :class="filterClassWidth.location"
        >
          <AmSelect
            v-model="locationFilter"
            clearable
            filterable
            :placeholder="labelsDisplay('filter_location')"
            :fit-input-width="true"
          >
            <AmOption
              v-for="location in locationsList"
              :key="location.id"
              :value="location.id"
              :label="location.name"
            >
            </AmOption>
          </AmSelect>
        </div>
        <div
          v-if="amCustomize.cbf.categoryItemsList.options.filterButtons.visibility && !licence.isBasic && !licence.isStarter && !licence.isLite"
          class="am-fcil__filter-item am-w30"
        >
          <div class="am-fcil__filter-item__btn-wrapper">
            <div
              class="am-fcil__filter-item__btn"
              :class="{'am-active': displayCategoryPackages && displayCategoryServices}"
              @click="changeCategoryItemsVisibility('all')"
            >
              {{ labelsDisplay('filter_all') }}
            </div>
            <div
              class="am-fcil__filter-item__btn"
              :class="{'am-active': displayCategoryPackages && !displayCategoryServices}"
              @click="changeCategoryItemsVisibility('packages')"
            >
              {{ labelsDisplay('filter_packages') }}
            </div>
            <div
              class="am-fcil__filter-item__btn"
              :class="{'am-active': !displayCategoryPackages && displayCategoryServices}"
              @click="changeCategoryItemsVisibility('services')"
            >
              {{ labelsDisplay('filter_services') }}
            </div>
          </div>
        </div>
      </div>
    </template>
    <template v-if="customizeOptions.sidebar.visibility" #side>
      <SideMenu
        :menu-items="categoriesMenu"
        :init-selection="categorySelected"
        identifier="id"
        name-identifier="name"
        :footer-string="labelsDisplay('get_in_touch')"
        company-email="support@ameliatms.com"
        @click="selectCategory"
      ></SideMenu>
    </template>
    <template #heading>
      <div class="am-fcil__heading">
        {{ headingStringRender }}
      </div>
    </template>
    <template #content>
      <!-- Packages -->
      <template v-if="displayCategoryPackages">
        <div
          v-for="item in categoryPackages"
          :key="item.id"
          class="am-fcil__item"
        >
          <div class="am-fcil__item-inner">
            <div
              class="am-fcil__item-content"
              :style="amCustomize.cbf.categoryItemsList.options.cardColor.visibility ?
              {backgroundColor: useColorTransparency(item.color, 0.1)} : {}"
            >
              <!-- Card Badge -->
              <div
                v-if="customizeOptions.packageBadge.visibility"
                class="am-fcil__item-badge__wrapper"
              >
                <div class="am-fcil__item-badge am-package">
                  <span class="am-icon-shipment"></span>
                  <span>
                    {{ labelsDisplay('package') }}
                  </span>
                </div>
              </div>

              <!-- Card Hero Image -->
              <div v-if="item.pictureFullPath" class="am-fcil__item-hero" :style="{backgroundImage: `url(${item.pictureFullPath})`}"></div>

              <!-- Card Heading -->
              <div class="am-fcil__item-heading">
                <div class="am-fcil__item-name">
                  {{ item.name }}
                </div>
                <div
                  v-if="customizeOptions.packagePrice.visibility"
                  class="am-fcil__item-cost"
                >
                  <span v-if="item.discount" class="am-fcil__item-discount">
                    {{`${labelsDisplay('save')} ${item.discount}%`}}
                  </span>
                  <span class="am-fcil__item-price">
                    {{ item.price ? useFormattedPrice(item.discount ? item.price - item.price / 100 * item.discount : item.price ) : labelsDisplay('free') }}
                  </span>
                </div>
              </div>

              <!-- Card Info -->
              <div class="am-fcil__item-info">
                <div
                  v-if="customizeOptions.packageCategory.visibility && categorySelected"
                  class="am-fcil__item-info__inner"
                >
                  <span class="am-icon-folder"></span>
                  <span>{{ availableCategories.find(a => a.id === categorySelected).name }}</span>
                </div>
                <div
                  v-if="customizeOptions.packageDuration.visibility"
                  class="am-fcil__item-info__inner"
                >
                  <span class="am-icon-clock"></span>
                  <span v-if="item.endDate">
                    {{ `${labelsDisplay('expires_at')} ${item.endDate}` }}
                  </span>
                  <span v-else-if="item.durationCount">
                    {{ `${labelsDisplay('expires_after')} ${item.durationCount} ${packageDurationLabel(item.durationCount, item.durationType)}` }}
                  </span>
                  <span v-else>
                    {{ labelsDisplay('without_expiration') }}
                  </span>
                </div>
                <div
                  v-if="customizeOptions.packageCapacity.visibility"
                  class="am-fcil__item-info__inner"
                >
                  <span class="am-icon-user"></span>
                  <span>1/1</span>
                </div>
                <div
                  v-if="customizeOptions.packageLocation.visibility"
                  class="am-fcil__item-info__inner"
                >
                  <span class="am-icon-locations"></span>
                  <span>
                    {{ itemLocations(item.locations, locationsList).length === 1 ? itemLocations(item.locations, locationsList)[0].name : labelsDisplay('multiple_locations') }}
                  </span>
                </div>
              </div>

              <div
                v-if="customizeOptions.packageServices.visibility"
                class="am-fcil__item-services"
              >
                <span>
                  {{ `${labelsDisplay('in_package')}:` }}
                </span>
                <span v-for="obj in getPackServices(item)" :key="obj.id">
                  {{obj.name}}
                </span>
              </div>
            </div>

            <!-- Card Footer -->
            <div class="am-fcil__item-footer">
              <AmButton
                v-if="customizeOptions.cardEmployeeBtn.visibility"
                size="small"
                :type="btnType('cardEmployeeBtn')"
                @click="getDialogEmployees()"
              >
                {{ labelsDisplay('view_employees') }}
              </AmButton>
              <AmButton
                :class="{'am-w100': !customizeOptions.cardEmployeeBtn.visibility}"
                size="small"
                :type="btnType('cardContinueBtn')"
              >
                {{ labelsDisplay('continue') }}
              </AmButton>
            </div>
          </div>
        </div>
      </template>
      <!-- /Packages -->

      <!-- Services -->
      <template v-if="displayCategoryServices">
        <div
          v-for="item in categoryServices"
          :key="item.id"
          class="am-fcil__item"
        >
          <div class="am-fcil__item-inner">
            <div
              class="am-fcil__item-content"
              :style="amCustomize.cbf.categoryItemsList.options.cardColor.visibility ?
              {backgroundColor: useColorTransparency(item.color, 0.1)} : {}"
            >
              <!-- Card Badge -->
              <div
                v-if="customizeOptions.serviceBadge.visibility"
                class="am-fcil__item-badge__wrapper"
              >
                <div class="am-fcil__item-badge am-service">
                  <span class="am-icon-service"></span>
                  <span>
                  {{ labelsDisplay('heading_service') }}
                </span>
                </div>
              </div>
              <!-- /Card Badge -->

              <!-- Card Hero Image -->
              <div v-if="item.pictureFullPath" class="am-fcil__item-hero" :style="{backgroundImage: `url(${item.pictureFullPath})`}"></div>
              <!-- /Card Hero Image -->

              <!-- Card Heading -->
              <div class="am-fcil__item-heading">
                <div class="am-fcil__item-name">
                  {{ item.name }}
                </div>
                <div
                  v-if="customizeOptions.servicePrice.visibility"
                  class="am-fcil__item-cost"
                >
                  <span class="am-fcil__item-price">
                    {{ item.price ? useFormattedPrice(item.price) : labelsDisplay('free') }}
                  </span>
                </div>
              </div>
              <!-- /Card Heading -->

              <!-- Card Info -->
              <div class="am-fcil__item-info">
                <div
                  v-if="customizeOptions.serviceCategory.visibility && categorySelected"
                  class="am-fcil__item-info__inner"
                >
                  <span class="am-icon-folder"></span>
                  <span>{{ availableCategories.find(a => a.id === categorySelected).name }}</span>
                </div>
                <div
                  v-if="customizeOptions.serviceDuration.visibility"
                  class="am-fcil__item-info__inner"
                >
                  <span class="am-icon-clock"></span>
                  <span>{{ serviceDuration(item.duration) }}</span>
                </div>
                <div
                  v-if="customizeOptions.serviceCapacity.visibility && !licence.isLite"
                  class="am-fcil__item-info__inner"
                >
                  <span class="am-icon-user"></span>
                  <span>{{ `${item.minCapacity}/${item.maxCapacity}` }}</span>
                </div>
                <div
                  v-if="customizeOptions.serviceLocation.visibility && !licence.isLite && !licence.isStarter"
                  class="am-fcil__item-info__inner"
                >
                  <span class="am-icon-locations"></span>
                  <span>
                    {{ itemLocations(item.locations, locationsList).length === 1 ? itemLocations(item.locations, locationsList)[0].name : labelsDisplay('multiple_locations') }}
                  </span>
                </div>
              </div>
              <!-- /Card Info -->
            </div>

            <!-- Card Footer -->
            <div class="am-fcil__item-footer">
              <AmButton
                v-if="customizeOptions.cardEmployeeBtn.visibility && !licence.isLite"
                size="small"
                :type="btnType('cardEmployeeBtn')"
                @click="getDialogEmployees('service')"
              >
                {{ labelsDisplay('view_employees') }}
              </AmButton>
              <AmButton
                :class="{'am-w100': !customizeOptions.cardEmployeeBtn.visibility}"
                size="small"
                :type="btnType('cardContinueBtn')"
              >
                {{ labelsDisplay('continue') }}
              </AmButton>
            </div>
            <!-- /Card Footer -->
          </div>
        </div>
      </template>
      <!-- /Services -->

      <!-- Employees Dialog -->
      <AmDialog
        v-model="dialogEmployees"
        :append-to-body="true"
        :modal-class="'am-fcil-employee'"
        :destroy-on-close="true"
        :lock-scroll="true"
        :custom-styles="popupCssVars"
        width="648px"
        @close="closeEmployeeDialog"
      >
        <template #title>
          <div class="am-fcil-employee__header">
            {{ labelsDisplay('employee_info') }}
          </div>
        </template>
        <template #default>
          <div>
            <AmCollapse>
              <AmCollapseItem
                v-for="(employee, index) in dialogEmployeesArray"
                :key="index"
                side
              >
                <template #heading>
                  <div class="am-fcil-employee__heading">
                    <div class="am-fcil-employee__heading-left">
                      <AmImagePlaceholder
                        item-class="am-fcil-employee__img"
                        :item-data="employee"
                        :trim-string="2"
                      ></AmImagePlaceholder>
                      <div class="am-fcil-employee__name">
                        {{ `${employee.firstName} ${employee.lastName}` }}
                      </div>
                    </div>
                  </div>
                </template>
                <template #default>
                  <div v-if="employee.description" class="am-fcil-employee__text" v-html="employee.description"></div>
                </template>
              </AmCollapseItem>
            </AmCollapse>
          </div>
        </template>
        <template #footer>
          <AmButton
            v-if="customizeOptions.dialogEmployeeBtn.visibility"
            :type="btnType('dialogEmployeeBtn')"
            category="primary"
          >
            {{ dialogEmployeesType === 'service' ? labelsDisplay('book_service') : labelsDisplay('book_package') }}
          </AmButton>
        </template>
      </AmDialog>
      <!-- /Employees Dialog -->
    </template>
  </Content>
</template>

<script setup>
// * Components
import AmInput from '../../../_components/input/AmInput.vue'
import AmSelect from '../../../_components/select/AmSelect.vue'
import AmOption from '../../../_components/select/AmOption.vue'
import AmButton from '../../../_components/button/AmButton.vue'
import IconComponent from '../../../_components/icons/IconComponent.vue'
import Header from '../../../common/CatalogFormConstruction/Header/Header.vue'
import SideMenu from '../../../common/CatalogFormConstruction/SideMenu/SideMenu.vue'
import Content from '../../../common/CatalogFormConstruction/Content/Content.vue'
import AmDialog from '../../../_components/dialog/AmDialog.vue'
import AmCollapse from '../../../_components/collapse/AmCollapse.vue'
import AmCollapseItem from '../../../_components/collapse/AmCollapseItem.vue'
import AmImagePlaceholder from '../../../_components/image-placeholder/AmImagePlaceholder.vue'

// * Moment
import moment from 'moment'

// * Import from Vue
import {
  inject,
  ref,
  defineComponent,
  computed
} from "vue";

// * Composables
import { useFormattedPrice } from '../../../../assets/js/common/formatting.js'
import { useColorTransparency } from '../../../../assets/js/common/colorManipulation.js'
import { getFrontedFormattedDate } from '../../../../assets/js/common/date.js'

// * Plugin Licence
let licence = inject('licence')

// * Customize
let amCustomize = inject('customize')

// * Options
let customizeOptions = computed(() => {
  return amCustomize.value.cbf.categoryItemsList.options
})

// * Base Urls
const baseUrls = inject('baseUrls')

// * Filters
let searchFilter = ref('')

let employeesList = ref([
  { id: 1, firstName: 'Silas', lastName: 'Rudy' },
  { id: 2, firstName: 'Arlene', lastName: 'Linton' },
  { id: 3, firstName: 'Merrilyn', lastName: 'Temple' },
  { id: 4, firstName: 'Ardith', lastName: 'Stanley' },
  { id: 5, firstName: 'Dale', lastName: 'Jonathan' }
])
let employeeFilter = ref(null)

let locationsList = ref([
  { id: 1, name: 'Location 1' },
  { id: 2, name: 'Location 2' },
  { id: 3, name: 'Location 3' },
  { id: 4, name: 'Location 4' },
  { id: 5, name: 'Location 5' }
])
let locationFilter = ref(null)

// * Category items (packages, services) visibility
let displayCategoryPackages = ref(!licence.isBasic && !licence.isStarter && !licence.isLite)
let displayCategoryServices = ref(true)

function changeCategoryItemsVisibility(key) {
  if (key === 'all') {
    displayCategoryPackages.value = true
    displayCategoryServices.value = true
  }

  if (key === 'packages') {
    displayCategoryPackages.value = true
    displayCategoryServices.value = false
  }

  if (key === 'services') {
    displayCategoryPackages.value = false
    displayCategoryServices.value = true
  }
}

// * Categories menu
let availableCategories = ref([
  {
    id: 1,
    name: 'Category 1',
    packageList: [1, 2],
    serviceList: [1, 6, 7],
    status: 'visible',
    translations: null
  },
  {
    id: 2,
    name: 'Category 2',
    packageList: [2],
    serviceList: [2, 4, 5],
    status: 'visible',
    translations: null
  },
  {
    id: 3,
    name: 'Category 3',
    packageList: [2, 3],
    serviceList: [3],
    status: 'visible',
    translations: null
  },
  {
    id: 4,
    name: 'Category 4',
    packageList: [3, 4],
    serviceList: [4, 5],
    status: 'visible',
    translations: null
  },
  {
    id: 5,
    name: 'Category 5',
    packageList: [5],
    serviceList: [1, 7],
    status: 'visible',
    translations: null
  }
])

let categoriesMenu = ref([
  {
    id: null,
    name: computed(() => labelsDisplay('filter_all'))
  },
  {
    id: 1,
    name: 'Category 1',
  },
  {
    id: 2,
    name: 'Category 2',
  },
  {
    id: 3,
    name: 'Category 3',
  },
  {
    id: 4,
    name: 'Category 4',
  },
  {
    id: 5,
    name: 'Category 5',
  }
])

// * Selected category
let categorySelected = ref(null)

let packArray = [
  {
    id: 1,
    name: "Package 1",
    color: "#774DFB",
    price: 500,
    discount: 10,
    endDate: null,
    providers: [1, 2],
    services: [1, 2, 3],
    locations: [1],
    pictureFullPath: `${baseUrls.value.wpAmeliaPluginURL}v3/src/assets/img/admin/customize/img_holder1.svg`
  },
  {
    id: 2,
    name: "Package 2",
    color: "#230c86",
    price: 500,
    discount: 10,
    endDate: getFrontedFormattedDate(moment().add(5, 'days').format('YYYY-MM-DD')),
    providers: [1, 2],
    services: [1, 2, 3],
    locations: [2, 3],
    pictureFullPath: `${baseUrls.value.wpAmeliaPluginURL}v3/src/assets/img/admin/customize/img_holder1.svg`
  },
  {
    id: 3,
    name: "Package 3",
    color: "#ab0c48",
    price: 500,
    discount: 10,
    endDate: null,
    durationCount: 3,
    durationType: 'week',
    providers: [1, 2],
    services: [1, 2, 3],
    locations: [3],
    pictureFullPath: `${baseUrls.value.wpAmeliaPluginURL}v3/src/assets/img/admin/customize/img_holder1.svg`
  },
  {
    id: 4,
    name: "Package 4",
    color: "#2cc915",
    price: 500,
    discount: 10,
    endDate: null,
    providers: [1, 2],
    services: [1, 2, 3],
    locations: [4, 5],
    pictureFullPath: `${baseUrls.value.wpAmeliaPluginURL}v3/src/assets/img/admin/customize/img_holder1.svg`
  },
  {
    id: 5,
    name: "Package 5",
    color: "#bd971d",
    price: 500,
    discount: 10,
    endDate: getFrontedFormattedDate(moment().add(5, 'days').format('YYYY-MM-DD')),
    providers: [1, 2],
    services: [1, 2, 3],
    locations: [5],
    pictureFullPath: `${baseUrls.value.wpAmeliaPluginURL}v3/src/assets/img/admin/customize/img_holder1.svg`
  }
]
let serviceArray = [
  {
    id: 1,
    name: "Service 1",
    categoryId: 1,
    color: "#774DFB",
    duration: 5400,
    maxCapacity: 10,
    minCapacity: 1,
    locations: [1, 2],
    price: 125,
    pictureFullPath: `${baseUrls.value.wpAmeliaPluginURL}v3/src/assets/img/admin/customize/img_holder1.svg`
  },
  {
    id: 2,
    name: "Service 2",
    categoryId: 1,
    color: "#230c86",
    duration: 5400,
    maxCapacity: 10,
    minCapacity: 1,
    locations: [2],
    price: 125,
    pictureFullPath: `${baseUrls.value.wpAmeliaPluginURL}v3/src/assets/img/admin/customize/img_holder1.svg`
  },
  {
    id: 3,
    name: "Service 3",
    categoryId: 1,
    color: "#ab0c48",
    duration: 5400,
    maxCapacity: 10,
    minCapacity: 1,
    locations: [3, 4],
    price: 125,
    pictureFullPath: `${baseUrls.value.wpAmeliaPluginURL}v3/src/assets/img/admin/customize/img_holder1.svg`
  },
  {
    id: 4,
    name: "Service 4",
    categoryId: 1,
    color: "#2cc915",
    duration: 5400,
    maxCapacity: 10,
    minCapacity: 1,
    locations: [4],
    price: 125,
    pictureFullPath: `${baseUrls.value.wpAmeliaPluginURL}v3/src/assets/img/admin/customize/img_holder1.svg`
  },
  {
    id: 5,
    name: "Service 5",
    categoryId: 1,
    color: "#bd971d",
    duration: 5400,
    maxCapacity: 10,
    minCapacity: 1,
    locations: [4, 5],
    price: 125,
    pictureFullPath: `${baseUrls.value.wpAmeliaPluginURL}v3/src/assets/img/admin/customize/img_holder1.svg`
  },
  {
    id: 6,
    name: "Service 6",
    categoryId: 1,
    color: "#bd971d",
    duration: 5400,
    maxCapacity: 10,
    minCapacity: 1,
    locations: [5],
    price: 125,
    pictureFullPath: `${baseUrls.value.wpAmeliaPluginURL}v3/src/assets/img/admin/customize/img_holder1.svg`
  },
  {
    id: 7,
    name: "Service 7",
    categoryId: 1,
    color: "#bd971d",
    duration: 5400,
    maxCapacity: 10,
    minCapacity: 1,
    locations: [1, 2],
    price: 125,
    pictureFullPath: `${baseUrls.value.wpAmeliaPluginURL}v3/src/assets/img/admin/customize/img_holder1.svg`
  }
]

let categoryPackages = computed(() => {
  let arr = []
  if (categorySelected.value) {
    availableCategories.value.find(a => a.id === categorySelected.value).packageList.forEach(b => {
      packArray.forEach(c => {
        if (c.id === b) arr.push(c)
      })
    })
  } else {
    availableCategories.value.forEach(cat => {
      cat.packageList.forEach(b => {
        packArray.forEach(c => {
          if (c.id === b && !arr.find(p => p.id === c.id)) arr.push(c)
        })
      })
    })
  }
  return arr
})

function getPackServices (pack) {
  let arr = []
  pack.services.forEach(a => {
    serviceArray.forEach(b => {
      if (b.id === a) arr.push(b)
    })
  })
  return arr
}

let categoryServices = computed(() => {
  let arr = []
  if (categorySelected.value) {
    availableCategories.value.find(a => a.id === categorySelected.value).serviceList.forEach(b => {
      serviceArray.forEach(c => {
        if (c.id === b) arr.push(c)
      })
    })
  } else {
    availableCategories.value.forEach(cat => {
      cat.serviceList.forEach(b => {
        serviceArray.forEach(c => {
          if (c.id === b) arr.push(c)
        })
      })
    })
  }
  return arr
})

let headingStringRender = computed(() => {
  let serviceString = categoryServices.value.length > 1 ? labelsDisplay('heading_services') : labelsDisplay('heading_service')
  let packageString = categoryPackages.value.length ? categoryPackages.value.length > 1 ? labelsDisplay('packages') : labelsDisplay('package') : ''

  if (!categoryServices.value.length && !categoryPackages.value.length) {
    return labelsDisplay('no_search_data')
  }

  if (displayCategoryServices.value && (!displayCategoryPackages.value || !categoryPackages.value.length)) {
    return `${labelsDisplay('available')} - ${ categoryServices.value.length } ${serviceString}`
  }

  if ((!displayCategoryServices.value || !categoryServices.value.length) && displayCategoryPackages.value) {
    return `${labelsDisplay('available')} - ${categoryPackages.value.length } ${packageString}`
  }

  let connective = categoryPackages.value.length ? '/' : ''

  return `${labelsDisplay('available')} - ${categoryServices.value.length} ${serviceString} ${connective} ${categoryPackages.value.length} ${packageString}`
})

let dialogEmployees = ref(false)
let dialogEmployeesType = ref('')
let dialogEmployeesArray = ref([
  {
    id: 1,
    firstName: 'Silas',
    lastName: 'Rudy',
    description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.'
  },
  {
    id: 2,
    firstName: 'Arlene',
    lastName: 'Linton',
    description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.'
  },
  {
    id: 3,
    firstName: 'Merrilyn',
    lastName: 'Temple',
    description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.'
  },
  {
    id: 4,
    firstName: 'Ardith',
    lastName: 'Stanley',
    description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.'
  },
  {
    id: 5,
    firstName: 'Dale',
    lastName: 'Jonathan',
    description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.'
  }
])

function closeEmployeeDialog () {

}

function getDialogEmployees (item = '') {
  dialogEmployeesType.value = item
  dialogEmployees.value = true
}

// * Choose category from categories menu
function selectCategory (category) {
  categorySelected.value = category.id
}

// let itemType = inject('itemType')

let iconSearch = defineComponent({
  components: {IconComponent},
  template: `<IconComponent icon="search"/>`
})

let filterClassWidth = computed(() => {
  let options = amCustomize.value.cbf.categoryItemsList.options
  let searchVisibility = options.searchInput.visibility
  let employeeVisibility = options.filterEmployee.visibility && !licence.isLite
  let locationVisibility = options.filterLocation.visibility && !licence.isLite && !licence.isStarter
  let buttonsVisibility = options.filterButtons.visibility && !licence.isBasic && !licence.isStarter && !licence.isLite

  let classFilter = {
    search: 'am-w30',
    employee: 'am-w20',
    location: 'am-w20',
    buttons: 'am-w30'
  }

  if (!searchVisibility || !buttonsVisibility) {
    classFilter.employee = (!searchVisibility && !buttonsVisibility) ? 'am-w50' : 'am-w35'
    classFilter.location = (!searchVisibility && !buttonsVisibility) ? 'am-w50' : 'am-w35'
    classFilter.search = !buttonsVisibility && !locationVisibility && !employeeVisibility ? 'am-w100' : 'am-w30'

    if (!employeeVisibility) {
      classFilter.location = (!searchVisibility && !buttonsVisibility) ? 'am-w100' : 'am-w70'
    }

    if (!locationVisibility) {
      classFilter.employee = (!searchVisibility && !buttonsVisibility) ? 'am-w100' : 'am-w70'
    }
  } else {
    if (!employeeVisibility) {
      classFilter.location = 'am-w40'
    }

    if (!locationVisibility) {
      classFilter.employee = 'am-w40'
    }

    if (!employeeVisibility && !locationVisibility ) {
      classFilter.search = 'am-w70'
    }
  }

  return classFilter
})

// * Items location
function itemLocations (locations, locationsOption) {
  let arr = []
  locationsOption.forEach(a => {
    locations.forEach(b => {
      if (a.id === b) {
        arr.push(a)
      }
    })
  })

  return arr
}

// * Labels
let langKey = inject('langKey')
let amLabels = inject('labels')

function labelsDisplay (label) {
  let computedLabel = computed(() => {
    let translations = amCustomize.value.cbf.categoryItemsList.translations
    return translations && translations[label] && translations[label][langKey.value] ? translations[label][langKey.value] : amLabels[label]
  })

  return computedLabel.value
}

function btnType (btnKey) {
  let btnType = computed(() => {
    return amCustomize.value.cbf.categoryItemsList.options[btnKey].buttonType
  })

  return btnType.value
}

function packageDurationLabel(duration, type) {
  let string = ''
  if (duration > 1) {
    if (type === 'day') string = labelsDisplay('expires_days')
    if (type === 'week') string = labelsDisplay('expires_weeks')
    if (type === 'month') string = labelsDisplay('expires_months')
  } else {
    if (type === 'day') string = labelsDisplay('expires_day')
    if (type === 'week') string = labelsDisplay('expires_week')
    if (type === 'month') string = labelsDisplay('expires_month')
  }
  return string
}

let amFonts = inject('amFonts')

function serviceDuration(seconds) {
  let hours = Math.floor(seconds / 3600)
  let minutes = seconds / 60 % 60

  return (hours ? (hours + amLabels.h + ' ') : '') + ' ' + (minutes ? (minutes + amLabels.min) : '')
}

// * Colors
let amColors = inject('amColors')

let cssVars = computed(() => {
  return {
    '--am-c-fcil-text-op-10': useColorTransparency(amColors.value.colorSbText, 0.1),
    '--am-c-fcil-main-text-op15': useColorTransparency(amColors.value.colorMainText, 0.15),
    '--am-c-fcil-card-text-op15': useColorTransparency(amColors.value.colorCardText, 0.15),
    '--am-c-fcil-card-text-op80': useColorTransparency(amColors.value.colorCardText, 0.80),
    '--am-c-fcil-primary-op20': useColorTransparency(amColors.value.colorPrimary, 0.20),
    '--am-c-fcil-success-op20': useColorTransparency(amColors.value.colorSuccess, 0.20),
    '--am-c-fcil-filter-text-op10': useColorTransparency(amColors.value.colorInpText, 0.1),
    '--am-w-fcil-main': !customizeOptions.value.sidebar.visibility ? '100%' : 'calc(100% - 220px)'
  }
})

let popupCssVars = computed(() => {
  return {
    '--am-f-fcil-employee-f': amFonts.value.fontFamily,
    '--am-c-fcil-employee-bgr': amColors.value.colorMainBgr,
    '--am-c-fcil-employee-heading': amColors.value.colorMainHeadingText,
    '--am-c-fcil-employee-text': amColors.value.colorMainText,
    '--am-c-fcil-employee-text-op80': useColorTransparency(amColors.value.colorMainText, 0.80),
    '--am-c-fcil-employee-text-op15': useColorTransparency(amColors.value.colorMainText, 0.15),
    '--am-c-fcil-employee-primary': amColors.value.colorPrimary,
    '--am-c-fcil-employee-primary-op10': useColorTransparency(amColors.value.colorPrimary, 0.1),
    '--am-c-inp-border': amColors.value.colorInpBorder,
    '--am-c-main-text': amColors.value.colorMainText,
  }
})
</script>

<script>
export default {
  name: "CategoryItemsList",
  key: "categoryItemsList"
}
</script>

<style lang="scss">
#amelia-app-backend-new #amelia-container.am-fc__wrapper  {
  // am-    amelia
  // -c-    color
  // -fcil- form category items list
  // -sb-   sidebar
  // -bgr   background
  .am-fcil {
    --am-c-fcil-filter-text: var(--am-c-inp-text);
    --am-c-fcil-filter-placeholder: var(--am-c-inp-placeholder);
    --am-c-fcil-filter-inp-bgr: var(--am-c-inp-bgr);
    --am-c-fcil-main-bgr: var(--am-c-main-bgr);
    --am-c-fcil-main-heading: var(--am-c-main-heading-text);
    --am-c-fcil-main-text: var(--am-c-main-text);
    --am-c-fcil-card-bgr: var(--am-c-card-bgr);
    --am-c-fcil-card-text: var(--am-c-card-text);
    --am-c-fcil-card-border: var(--am-c-card-border);
    --am-c-fcil-primary: var(--am-c-primary);
    --am-c-fcil-success: var(--am-c-success);
    width: 100%;
    padding: 24px;
    border-radius: 10px;

    &__filter {
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      margin: 12px 0;

      &-item {
        width: 100%;
        padding: 0 8px;
        margin: 12px 0;

        &:first-child {
          padding-left: 0;
        }

        &:last-child {
          padding-right: 0;
        }

        &__btn {
          width: 100%;
          max-width: 30%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 15px;
          font-weight: 500;
          line-height: 1.6;
          padding: 2px 8px;
          border-radius: 6px;
          transition: all .2s ease-in-out;
          cursor: pointer;
          color: var(--am-c-fcil-filter-placeholder);

          &:hover, &.am-active {
            color: var(--am-c-fcil-filter-text);
            background-color: var(--am-c-fcil-filter-inp-bgr);
          }

          &-wrapper {
            width: 100%;
            display: flex;
            flex-direction: row;
            flex-wrap: nowrap;
            align-items: center;
            justify-content: space-between;
            background-color: var(--am-c-fcil-filter-text-op10);
            border-radius: 6px;
            padding: 6px;
          }
        }

        &.am- {
          &w20 {
            max-width: 20%;
          }

          &w30 {
            max-width: 30%;
          }

          &w35 {
            max-width: 35%;
          }

          &w40 {
            max-width: 40%;
          }

          &w50 {
            max-width: 50%;
          }

          &w60 {
            max-width: 60%;
          }

          &w70 {
            max-width: 70%;
          }

          &w100 {
            max-width: 100%;
          }
        }
      }
    }

    &__main {
      width: 100%;
      max-width: var(--am-w-fcil-main);
      border: 1px solid var(--am-c-fcil-main-text-op15);
      border-radius: 6px;
    }

    &__heading {
      font-size: 18px;
      font-weight: 500;
      line-height: 1.555555;
      color: var(--am-c-fcil-main-heading);
      padding: 16px 24px 16px;
    }

    &__wrapper{
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      justify-content: center;
      padding: 0 16px 16px;

      &.no-scroll {
        max-height: unset;
        overflow-x: unset;
      }
    }

    &__item {
      max-width: 50%;
      width: 100%;
      display: flex;
      padding: 8px;
      background-color: transparent;

      &-inner {
        display: flex;
        flex-direction: column;
        position: relative;
        width: 100%;
        padding: 0 0 56px;
        border-radius: 6px;
        background-color: var(--am-c-fcil-card-bgr);
        box-shadow: 0 0 6px 2px var(--am-c-fcil-main-text-op15);
      }

      &-content {
        height: 100%;
        padding: 12px 12px 0;
      }

      &-badge {
        display: inline-flex;
        align-items: center;
        padding: 0 8px 0 4px;
        border-radius: 12px;

        &.am-package {
          background: linear-gradient(95.75deg, var(--am-c-fcil-card-bgr) -110.8%,  var(--am-c-warning) 114.33%);
          span {
            color: var(--am-c-fcil-card-bgr);
          }
        }

        &.am-service {
          background-color: var(--am-c-fcil-success-op20);
          span {
            color:  var(--am-c-fcil-success);
          }
        }

        &__wrapper {
          height: 24px;
          margin: 0 0 12px;
        }

        span {
          display: block;
          font-size: 14px;
          font-weight: 400;
          line-height: 1;

          &[class*="am-icon"] {
            font-size: 24px;
          }
        }
      }

      &-hero {
        padding: 56.25% 0 0;
        background-size: cover;
        background-repeat: no-repeat;
        background-position: center;
        border: 1px solid var(--am-c-fcil-main-text-op15);
        border-radius: 4px;
      }

      &-heading {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        justify-content: space-between;
        margin: 12px 0;
      }

      &-name {
        flex: 1 1 30%;
        font-size: 18px;
        font-weight: 500;
        line-height: 1.55556;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
        color: var(--am-c-fcil-card-text);
      }

      &-cost {
        display: flex;
        align-items: center;
        justify-content: space-between;

        & > span {
          display: inline-flex;
          font-size: 14px;
          font-weight: 500;
          line-height: 20px;
          padding: 2px 8px;
          border-radius: 24px;
          margin-right: 8px;
          flex: 0 1 auto;

          &:last-child {
            margin-right: 0;
          }
        }
      }

      &-price {
        color: var(--am-c-fcil-primary);
        background-color: var(--am-c-fcil-primary-op20);
      }

      &-discount {
        color: var(--am-c-fcil-success);
        background-color: var(--am-c-fcil-success-op20);
      }

      &-info {
        display: flex;
        flex-wrap: wrap;
        align-items: center;

        &__inner {
          display: inline-flex;
          align-items: flex-end;
          max-width: 100%;
          padding: 0 8px 0 0;
          margin: 0 0 8px;

          &:last-child {
            padding: 0;
          }

          span {
            font-size: 13px;
            font-weight: 400;
            color: var(--am-c-fcil-card-text-op80);
            text-overflow: ellipsis;
            white-space: nowrap;
            overflow: hidden;

            &[class*="am-icon"] {
              flex: 0 0 auto;
              font-size: 24px;
              color: var(--am-c-fcil-primary);
            }
          }
        }
      }

      &-services {
        margin: 0 0 12px;

        span {
          position: relative;
          display: inline-flex;
          font-size: 13px;
          font-weight: 400;
          line-height: 1.384615;
          word-break: break-word;
          color: var(--am-c-fcil-card-text-op80);
          padding: 0 8px 0 0;

          &:after {
            content: '';
            position: absolute;
            top: 50%;
            right: 2px;
            transform: translateY(-50%);
            border: 2px solid var(--am-c-fcil-card-text-op80);
            border-radius: 50%;
          }

          &:first-child {
            padding-right: 2px;
          }

          &:first-child, &:last-child {
            &:after {
              display: none;
            }
          }
        }
      }

      &-footer {
        position: absolute;
        bottom: 12px;
        left: 12px;
        width: calc(100% - 24px);
        display: flex;
        align-items: center;
        justify-content: space-between;

        &__btn {
          align-self: end;
        }
      }
    }
  }
}

.am-dialog-popup {
  &.am-fcil-employee {
    * {
      font-family: var(--am-f-fcil-employee-f);
    }

    .el-dialog {
      background-color: var(--am-c-fcil-employee-bgr, $am-white);

      &__header {
        border: 1px solid transparent;
        border-bottom-color: var(--am-c-fcil-employee-text-op15);
        padding: 16px 24px;
      }

      &__headerbtn {
        text-decoration: none;

        * {
          color: var(--am-c-fcil-employee-text);
        }

        &:hover {
          * {
            color: var(--am-c-fcil-employee-primary);
            text-decoration: none;
          }
        }
      }
    }

    .am-collapse-item {

      $count: 100;
      @for $i from 0 through $count {
        &:nth-child(#{$i + 1}) {
          animation: 600ms cubic-bezier(.45,1,.4,1.2) #{$i*100}ms am-animation-slide-up;
          animation-fill-mode: both;
        }
      }

      &__heading {
        padding: 8px;
        transition-delay: .5s;

        &-side {
          transition-delay: 0s;
        }
      }
    }

    .am-fcil-employee {
      &__header {
        font-size: 18px;
        font-weight: 500;
        line-height: 1.55555;
        color: var(--am-c-fcil-employee-heading);
      }

      &__heading {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;

        &-left {
          display: flex;
          align-items: center;
          justify-content: flex-start;
        }
      }

      &__img {
        display: inline-flex;
        flex: 0 0 auto;
        align-items: center;
        justify-content: center;
        width: 54px;
        height: 54px;
        border-radius: 4px;
        border: 1px solid var(--am-c-inp-border);
        background-position: center;
        background-repeat: no-repeat;
        background-size: cover;
        font-size: 18px;
        font-weight: 500;
        color: var(--am-c-fcil-employee-bgr);
        margin-right: 12px;
      }

      &__name {
        font-size: 15px;
        font-weight: 500;
        line-height: 1.33333;
        color: var(--am-c-fcil-employee-text);
      }

      &__text {
        font-size: 15px;
        font-weight: 400;
        line-height: 1.6;
        color: var(--am-c-fcil-employee-text-op80);
      }

      &__price {
        display: inline-flex;
        flex: 0 0 auto;
        font-size: 14px;
        font-weight: 500;
        color: var(--am-c-fcil-employee-primary);
        background-color: var(--am-c-fcil-employee-primary-op10);
        border-radius: 20px;
        padding: 2px 8px;
      }
    }
  }
}
</style>
