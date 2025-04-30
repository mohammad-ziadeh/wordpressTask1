<template>
  <!-- Categories -->
  <div class="am-categories" :class="{'editable': editable}">
    <customization-form-header
      v-if="!customization.useGlobalColors[formName]"
      :editable="editable"
      :customization-form="customizationForm"
      @resetForm="resetForm"
      @saveFormEdit="saveFormEdit"
    ></customization-form-header>

    <div class="am-categories-wrapper" :class="{'editable': editable}">
      <!-- Back button & Category Name -->
      <div class="am-categories-headline">
        <span class="am-back" :style="{color: customization.globalColors.primaryColor}">
          <template v-if="!languageShortCode">
            <i class="el-icon-arrow-left"></i> {{ formStepData.labels.back.value || $root.labels.back }}
          </template>
          <template v-else>
            <i class="el-icon-arrow-left"></i> {{ formStepData.labels.back.translations[languageShortCode] || $root.labels.back }}
          </template>
        </span>
        <h3 :style="{color: customization.globalColors.primaryColor}">
          {{ category.name }}
        </h3>
      </div>
      <!-- /Back button & Category Name -->

      <!-- Categories Item -->
      <el-row :gutter="24" type="flex" class="am-categories-service-wrapper">
        <el-col
          v-for="(service, index) in category.list"
          :key="index"
          :lg="columnsLg"
          :md="12"
          :sm="12"
          class="am-categories-service-inner"
        >
          <!-- Service -->
          <div class="am-categories-service">
            <!-- View More -->
            <div
              class="am-categories-service-hover"
              :style="{backgroundColor: colorTransparency(customization.globalColors.primaryColor, 0.7)}"
            >
              <span class="am-categories-service-title" :style="{color: customization.globalColors.textColorOnBackground}">
                {{ service.name }}
              </span>
              <el-button :style="{color: customization.globalColors.textColorOnBackground, borderColor: customization.globalColors.textColorOnBackground}">
                <template v-if="!languageShortCode">
                  {{ formStepData.labels.view_more.value || $root.labels.view_more }}
                </template>
                <template v-else>
                  {{ formStepData.labels.view_more.translations[languageShortCode] || $root.labels.view_more }}
                </template>
              </el-button>
            </div>
            <!-- /View More -->

            <!-- Service Background Image -->
            <div
              class="am-categories-service-image"
              :style="service.pictureFullPath ? {backgroundImage: `url(${service.pictureFullPath})`} : {backgroundImage: `linear-gradient(90deg, ${colorTransparency(customization.globalColors.primaryColor, 0.65)} 0%, ${customization.globalColors.primaryColor} 100%)`}"
            >
            </div>
            <!-- /Service Background Image -->

            <!-- Service Info -->
            <div
              class="am-categories-service-info"
              :style="{backgroundColor: customizationForm.formBackgroundColor}"
            >

              <!-- Service Initials -->
              <div v-if="!('type' in service) && formStepData.parts.service_badge.visibility" class="am-categories-color-wrapper">
                <div class="am-categories-service-color" :style="{'background-color': service.color}">
                  {{ getNameInitials(service.name) }}
                </div>
              </div>
              <div v-if="('type' in service) && formStepData.parts.package_badge.visibility" class="am-categories-color-wrapper">
                <div class="am-categories-service-color am-categories-package-color" :style="{'background-color': service.color}">
                  <img :src="$root.getUrl + 'public/img/am-package-catalog.svg'">
                </div>
                <div class="am-categories-item-type" :style="{'background-color': service.color}">
                  <template v-if="!languageShortCode">
                    {{ formStepData.labels.package.value || $root.labels.package }}
                  </template>
                  <template v-else>
                    {{ formStepData.labels.package.translations[languageShortCode] || $root.labels.package }}
                  </template>
                </div>
              </div>
              <!-- /Service Initials -->

              <div :class="'type' in service ? 'am-categories-package-title-price' : 'am-categories-service-title-price'">
                <!-- Service Name -->
                <div
                  class="am-categories-service-title"
                  :style="{color: customizationForm.formTextColor}"
                >
                  {{ service.name }}
                </div>
                <!-- /Service Name -->

                <!-- Service Price -->
                <span
                  v-if="!('type' in service) && formStepData.parts.service_price.visibility"
                  :style="{color: customizationForm.formTextColor, opacity: 0.7}"
                >
                  <template v-if="!languageShortCode">
                    {{ formStepData.labels.price_colon.value || $root.labels.price_colon }} {{ getFormattedPrice(service.price) }}
                  </template>
                  <template v-else>
                    {{ formStepData.labels.price_colon.translations[languageShortCode] || $root.labels.price_colon }} {{ getFormattedPrice(service.price) }}
                  </template>
                </span>
                <span
                  v-if="('type' in service) && formStepData.parts.package_price.visibility"
                  :style="{visibility: service.price ? '' : 'hidden', color: customizationForm.formTextColor}"
                  class="am-categories-package-price"
                >
                  {{ getFormattedPrice(service.price, !$root.settings.payments.hideCurrencySymbolFrontend) }}
                  <span v-if="service.discount" :style="{color: customizationForm.formTextColor, opacity: 0.7}">
                    <template v-if="!languageShortCode">
                      {{ `${formStepData.labels.package_discount_text.value || $root.labels.package_discount_text} ${service.discount}%` }}
                    </template>
                    <template v-else>
                      {{ `${formStepData.labels.package_discount_text.translations[languageShortCode] || $root.labels.package_discount_text} ${service.discount}%` }}
                    </template>
                  </span>
                </span>
                <!-- /Service Price -->
              </div>

              <div v-if="'type' in service && formStepData.parts.package_services_list.visibility">
                <div :style="{color: customizationForm.formTextColor, fontSize: '16px'}">
                  <template v-if="!languageShortCode">
                    {{ formStepData.labels.services.value || $root.labels.services }}
                  </template>
                  <template v-else>
                    {{ formStepData.labels.services.translations[languageShortCode] || $root.labels.services }}
                  </template>
                </div>
                <span
                  v-for="item in service.bookable"
                  class="am-categories-package-service-item"
                  :style="{color: customizationForm.formTextColor, opacity: 0.7}"
                >
                  {{ item.name }}
                </span>
              </div>

              <!-- Service Employees -->
              <div class="am-categories-service-thumbs" v-if="!('type' in service) && formStepData.parts.service_employees_list.visibility">
                <img
                  v-for="(employee, index) in service.providers"
                  v-if="index < 6"
                  :key="employee.id"
                  :src="pictureLoad(employee, true)"
                  :style="{borderColor: customizationForm.formBackgroundColor}"
                  @error="imageLoadError(employee, true)"
                >
                <span v-if="service.providers.length > 6" :style="{color: customizationForm.formTextColor, opacity: 0.7}">
                  +{{ getInvisibleEmployeesCount(service) }}
                </span>
              </div>
              <!-- /Service Employees -->
            </div>
            <!-- /Service Info -->
          </div>
          <!-- /Service -->
        </el-col>
      </el-row>
      <!-- /Categories Item -->

      <!-- Edit Dialog -->
      <customize-edit-dialog
        :form-field="formStepData"
        :language-short-code="languageShortCode"
        @saveEdit="saveFormEdit"
      >
        <template v-slot:fieldEdit>
        <span v-show="editable" class="am-customize-field__edit">
          <img :src="$root.getUrl + 'public/img/am-customize-icon-edit.svg'" />
        </span>
        </template>
      </customize-edit-dialog>
      <!-- /Edit Dialog -->
    </div>
  </div>
  <!-- /Categories -->
</template>

<script>
import imageMixin from '../../../../js/common/mixins/imageMixin'
import priceMixin from '../../../../js/common/mixins/priceMixin'
import cssColorManipulationMixin from '../../../../js/common/mixins/cssColorManipulationMixin'
import customizeEditDialog from '../dialogs/CustomizeEditDialog'
import customizationFormHeader from '../parts/CustomizationFormHeader'

export default {
  name: 'categoryListForm',

  components: {
    customizeEditDialog,
    customizationFormHeader
  },

  mixins: [imageMixin, priceMixin, cssColorManipulationMixin],

  props: {
    formName: {
      type: String,
      required: true
    },
    editable: {
      type: Boolean,
      default: true
    },
    languageShortCode: {
      type: String,
      default: ''
    },
    customization: {
      type: Object,
      default: () => {
        return {}
      }
    },
    customizationForm: {
      type: Object,
      default: () => {
        return {}
      }
    },
    formStepData: {
      type: Object,
      default: () => {
        return {}
      }
    },
    resetStepData: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },

  data () {
    return {
      columnsLg: 12,
      category: {
        name: 'Category Name 1',
        list: [
          {
            name: 'Package Name 1',
            pictureFullPath: '',
            color: '#3DCDF3',
            price: 100,
            discount: 10,
            bookable: [
              {
                name: 'Service Name 1'
              }
            ],
            providers: [
              {
                id: 1,
                firstName: 'John',
                lastName: 'Doe'
              }
            ],
            type: 'package'
          },
          {
            name: 'Service Name 1',
            pictureFullPath: '',
            color: '#F67D34',
            price: 100,
            discount: 10,
            bookable: [
              {
                name: 'Service Name 1'
              }
            ],
            providers: [
              {
                id: 1,
                firstName: 'Kenya',
                lastName: 'Daniels'
              },
              {
                id: 2,
                firstName: 'Quinn',
                lastName: 'Hall'
              },
              {
                id: 3,
                firstName: 'Elise',
                lastName: 'Rice'
              },
              {
                id: 4,
                firstName: 'Tony',
                lastName: 'Porter'
              },
              {
                id: 5,
                firstName: 'Cedric',
                lastName: 'Henderson'
              },
              {
                id: 6,
                firstName: 'Frederick',
                lastName: 'Thomas'
              },
              {
                id: 7,
                firstName: 'Brittany',
                lastName: 'Clark'
              }
            ]
          }
        ]
      }
    }
  },

  methods: {
    resetForm () {
      let resetObj = {}
      resetObj.data = this.resetStepData
      resetObj.formStep = this.$options.name
      this.$emit('resetForm', resetObj)
    },

    saveFormEdit (dataObj) {
      let formObj = {}
      formObj[this.$options.name] = JSON.parse(JSON.stringify(dataObj))
      this.$emit('saveEdit', formObj)
    },

    getInvisibleEmployeesCount (service) {
      return service.providers.length > 6 ? service.providers.length - 6 : ''
    }
  }
}
</script>
