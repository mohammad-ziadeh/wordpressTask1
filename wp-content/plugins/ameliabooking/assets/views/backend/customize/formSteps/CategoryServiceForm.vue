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

    <!-- Service -->
    <div class="am-service-booking" :class="{'editable': editable}">
      <!-- Services Gallery -->
      <div class="am-service-gallery" :style="{backgroundColor: customization.primaryColor}">
        <el-carousel
          v-if="service.gallery.length > 0"
          indicator-position="none"
          :arrow="service.gallery.length === 1 ? 'never' : 'always'"
          :autoplay=true
        >
          <el-carousel-item v-for="(image, index) in service.gallery" :key="index">
            <div
              class="am-image-slide"
              :style="{'background-image': 'url(' + image.pictureFullPath + ')'}">
            </div>
          </el-carousel-item>
        </el-carousel>
      </div>
      <!-- /Services Gallery -->

      <!-- Service Details -->
      <div class="am-service" :style="{backgroundColor: customizationForm.formBackgroundColor}">

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
            <div class="am-category-url" :style="{color: customizationForm.formTextColor}">
              <i class="el-icon-back"></i> {{ category.name }}
            </div>
            <!-- /Service Back -->

            <!-- Service Name -->
            <div class="am-service-title">
              <h2 :style="{color: customizationForm.formTextColor}">{{ service.name }}</h2>
            </div>
            <!-- /Service Name -->

            <!-- Service Capacity, Duration -->
            <div class="am-service-info">
              <div
                v-if="formStepData.parts.capacity_colon.visibility"
                :style="{color: customizationForm.formTextColor}"
              >
                <template v-if="!languageShortCode">
                  {{ formStepData.labels.capacity_colon.value || $root.labels.capacity_colon }} {{ service.capacity }}
                </template>
                <template v-else>
                  {{ formStepData.labels.capacity_colon.translations[languageShortCode] || $root.labels.capacity_colon }} {{ service.capacity }}
                </template>
              </div>
              <div
                v-if="formStepData.parts.duration_colon.visibility"
                :style="{color: customizationForm.formTextColor}"
              >
                <template v-if="!languageShortCode">
                  {{ formStepData.labels.duration_colon.value || $root.labels.duration_colon }} {{ `${service.duration.hours}${$root.labels.h} ${service.duration.minutes}${$root.labels.min}` }}
                </template>
                <template v-else>
                  {{ formStepData.labels.duration_colon.translations[languageShortCode] || $root.labels.duration_colon }} {{ `${service.duration.hours}${$root.labels.h} ${service.duration.minutes}${$root.labels.min}` }}
                </template>
              </div>
            </div>
            <!-- /Service Capacity, Duration -->
          </div>
          <!-- /Service Data -->

          <!-- Service Price -->
          <div class="am-service-price" :style="{color: customization.textColorOnBackground, backgroundColor: customization.primaryColor}">
            {{ getFormattedPrice(service.price, !$root.settings.payments.hideCurrencySymbolFrontend) }}
          </div>
          <!-- /Service Price -->
        </div>
        <!-- /Service Header -->

        <!-- Service Description -->
        <div
          v-if="formStepData.parts.description.visibility"
          class="am-service-description"
        >
          <h3 :style="{color: customizationForm.formTextColor}">
            <template v-if="!languageShortCode">
              {{ formStepData.labels.description.value || $root.labels.description }}
            </template>
            <template v-else>
              {{ formStepData.labels.description.translations[languageShortCode] || $root.labels.description }}
            </template>
          </h3>
          <p :style="{color: customizationForm.formTextColor}" v-html="service.description"></p>
        </div>
        <!-- /Service Description -->

        <!-- Service Details -->
        <div
          v-if="formStepData.parts.service_info.visibility"
          class="am-service-info"
        >
          <el-row :gutter="32">

            <!-- Service Info -->
            <el-col :sm="columnsLg" class="am-service-info-column">
              <h3 :style="{color: customizationForm.formTextColor}">
                <template v-if="!languageShortCode">
                  {{ formStepData.labels.service_info.value || $root.labels.service_info }}
                </template>
                <template v-else>
                  {{ formStepData.labels.service_info.translations[languageShortCode] || $root.labels.service_info }}
                </template>
              </h3>

              <!-- Service Category -->
              <el-row :gutter="12">
                <el-col :span="12" :style="{color: customizationForm.formTextColor}">
                  <template v-if="!languageShortCode">
                    {{ formStepData.labels.category_colon.value || $root.labels.category_colon }}
                  </template>
                  <template v-else>
                    {{ formStepData.labels.category_colon.translations[languageShortCode] || $root.labels.category_colon }}
                  </template>
                </el-col>
                <el-col :span="12" class="am-align-right">
                  <div class="am-category-url" :style="{color: customizationForm.formTextColor}">
                    {{ category.name }}
                  </div>
                </el-col>
              </el-row>
              <!-- /Service Category -->

              <!-- Service Duration -->
              <el-row
                v-if="formStepData.parts.duration_colon.visibility"
                :gutter="12"
              >
                <el-col :span="12" :style="{color: customizationForm.formTextColor}">
                  <template v-if="!languageShortCode">
                    {{ formStepData.labels.duration_colon.value || $root.labels.duration_colon }}
                  </template>
                  <template v-else>
                    {{ formStepData.labels.duration_colon.translations[languageShortCode] || $root.labels.duration_colon }}
                  </template>
                </el-col>
                <el-col :span="12" class="am-align-right" :style="{color: customizationForm.formTextColor}">
                  {{ `${service.duration.hours}${$root.labels.h} ${service.duration.minutes}${$root.labels.min}` }}
                </el-col>
              </el-row>
              <!-- /Service Duration -->

              <!-- Capacity -->
              <el-row
                v-if="formStepData.parts.capacity_colon.visibility"
                :gutter="12"
              >
                <el-col :span="12" :style="{color: customizationForm.formTextColor}">
                  <template v-if="!languageShortCode">
                    {{ formStepData.labels.capacity_colon.value || $root.labels.capacity_colon }}
                  </template>
                  <template v-else>
                    {{ formStepData.labels.capacity_colon.translations[languageShortCode] || $root.labels.capacity_colon }}
                  </template>
                </el-col>
                <el-col :span="12" class="am-align-right" :style="{color: customizationForm.formTextColor}">
                  {{ service.capacity }}
                </el-col>
              </el-row>
              <!-- /Capacity -->
            </el-col>

            <!-- Extras or Employees -->
            <el-col
              v-if="formStepData.parts.extras.visibility"
              :sm="columnsLg"
              class="am-service-info-column"
            >
              <div>
                <h3 :style="{color: customizationForm.formTextColor}">
                  <template v-if="!languageShortCode">
                    {{ formStepData.labels.extras.value || $root.labels.extras }}
                  </template>
                  <template v-else>
                    {{ formStepData.labels.extras.translations[languageShortCode] || $root.labels.extras }}
                  </template>
                </h3>
                <el-collapse>

                  <!-- Extra Item -->
                  <el-collapse-item
                    v-for="(extra, index) in service.extras"
                    :key="index"
                    :name="index"
                    :style="{color: customizationForm.formTextColor}"
                    class="am-extra"
                  >
                    <template slot="title">
                      <span :style="{color: customizationForm.formTextColor}">
                        {{ extra.name }}
                      </span>
                    </template>

                    <!-- Extra Duration -->
                    <div class="am-extra-duration">
                      <el-col :span="12" :style="{color: customizationForm.formTextColor}">
                        <template v-if="!languageShortCode">
                          {{ formStepData.labels.duration_colon.value || $root.labels.duration_colon }}
                        </template>
                        <template v-else>
                          {{ formStepData.labels.duration_colon.translations[languageShortCode] || $root.labels.duration_colon }}
                        </template>
                      </el-col>
                      <el-col :span="12" class="am-align-right" :style="{color: customizationForm.formTextColor}">
                        <template v-if="extra.duration.hours">
                          {{ `${extra.duration.hours}${$root.labels.h} ` }}
                        </template>
                        <template>
                          {{ `${extra.duration.minutes}${$root.labels.min}` }}
                        </template>
                      </el-col>
                    </div>

                    <!-- Extra Price -->
                    <div class="am-extra-price">
                      <el-col :span="12" :style="{color: customizationForm.formTextColor}">
                        <template v-if="!languageShortCode">
                          {{ formStepData.labels.price_colon.value || $root.labels.price_colon }}
                        </template>
                        <template v-else>
                          {{ formStepData.labels.price_colon.translations[languageShortCode] || $root.labels.price_colon }}
                        </template>
                      </el-col>
                      <el-col :span="12" class="am-align-right" :style="{color: customizationForm.formTextColor}">
                        {{ getFormattedPrice(extra.price, !$root.settings.payments.hideCurrencySymbolFrontend)  }}
                      </el-col>
                    </div>

                    <!-- Extra Max Capacity -->
                    <div class="am-extra-capacity">
                      <el-col :span="12" :style="{color: customizationForm.formTextColor}">
                        <template v-if="!languageShortCode">
                          {{ formStepData.labels.maximum_quantity_colon.value || $root.labels.maximum_quantity_colon }}
                        </template>
                        <template v-else>
                          {{ formStepData.labels.maximum_quantity_colon.translations[languageShortCode] || $root.labels.maximum_quantity_colon }}
                        </template>
                      </el-col>
                      <el-col :span="12" class="am-align-right" :style="{color: customizationForm.formTextColor}">
                        {{ extra.maxQuantity }}
                      </el-col>
                    </div>

                    <!-- Extra Description -->
                    <div class="am-extra-description">
                      <el-col :lg="24" class="am-align-justify" :style="{color: customizationForm.formTextColor}">
                        <template v-if="!languageShortCode">
                          {{ formStepData.labels.description_colon.value || $root.labels.description_colon }} {{ extra.description}}
                        </template>
                        <template v-else>
                          {{ formStepData.labels.description_colon.translations[languageShortCode] || $root.labels.description_colon }} {{ extra.description}}
                        </template>
                      </el-col>
                    </div>

                  </el-collapse-item>
                </el-collapse>
              </div>
            </el-col>
            <!-- /Extras or Employees -->
          </el-row>
        </div>
        <!-- /Service Details -->

        <!-- Service Employees -->
        <div
          v-if="formStepData.parts.employees.visibility"
          class="am-service-providers"
        >
          <h3 :style="{color: customizationForm.formTextColor}">
            <template v-if="!languageShortCode">
              {{ formStepData.labels.employees.value || $root.labels.employees }}
            </template>
            <template v-else>
              {{ formStepData.labels.employees.translations[languageShortCode] || $root.labels.employees }}
            </template>
          </h3>
          <div v-for="(employee, index) in service.employees" class="am-service-provider" :key="index">
            <img
              :src="pictureLoad(employee, true)"
              @error="imageLoadError(employee, true)"
              :alt="employee.firstName + ' ' + employee.lastName"
            >
            <span :style="{color: customizationForm.formTextColor}">
              {{ employee.firstName + ' ' + employee.lastName }}
            </span>
          </div>
        </div>
        <!-- /Service Employees -->

        <slot name="bookingTemplates"></slot>
      </div>
      <!-- /Service Details -->

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
import customizeEditDialog from '../dialogs/CustomizeEditDialog'
import customizationFormHeader from '../parts/CustomizationFormHeader'

export default {
  name: 'categoryServiceForm',

  components: {
    customizeEditDialog,
    customizationFormHeader
  },

  mixins: [imageMixin, priceMixin],

  props: {
    formName: {
      type: String,
      required: false
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
      service: {
        name: 'Service Name',
        gallery: [],
        capacity: '2 - 10',
        duration: {
          hours: '1',
          minutes: '30'
        },
        price: 100,
        extras: [
          {
            id: 1,
            name: 'Extra Name 1',
            duration: {
              hours: '1',
              minutes: '30'
            },
            price: 3,
            maxQuantity: 3,
            description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.'
          },
          {
            id: 2,
            name: 'Extra Name 2',
            duration: {
              hours: null,
              minutes: '30'
            },
            price: 5,
            maxQuantity: 5,
            description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.'
          },
          {
            id: 3,
            name: 'Extra Name 3',
            duration: {
              hours: null,
              minutes: '30'
            },
            price: 7,
            maxQuantity: 7,
            description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.'
          }
        ],
        employees: [
          {
            firstName: 'Tonia',
            lastName: 'Aston'
          },
          {
            firstName: 'Ford',
            lastName: 'Horatio'
          },
          {
            firstName: 'Lyssa',
            lastName: 'Jarred'
          },
          {
            firstName: 'Emmanuel',
            lastName: 'Wilburn'
          },
          {
            firstName: 'Fraser',
            lastName: 'Talia'
          }
        ],
        description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.'
      },
      category: {
        name: 'Category Name 1'
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
