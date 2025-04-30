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
      <!-- Package Gallery -->
      <div class="am-service-gallery" :style="{backgroundColor: customization.globalColors.primaryColor}">
        <el-carousel
          v-if="package.gallery.length > 0"
          :arrow="package.gallery.length === 1 ? 'never' : 'always'"
          :autoplay=true
          indicator-position="none"
        >
          <el-carousel-item v-for="(image, index) in package.gallery" :key="index">
            <div
              class="am-image-slide"
              :style="{'background-image': 'url(' + image.pictureFullPath + ')'}">
            </div>
          </el-carousel-item>
        </el-carousel>
      </div>
      <!-- Package Gallery -->


      <!-- Package Details -->
      <div class="am-service" :style="{backgroundColor: customizationForm.formBackgroundColor}">

        <!-- Package Header -->
        <div class="am-service-header">

          <!-- Package Profile Photo -->
          <div class="am-service-image">
            <img :src="pictureLoad(package, false)" @error="imageLoadError(package, false)" :alt="package.name">
          </div>
          <!-- /Package Profile Photo -->

          <!-- Package Data -->
          <div class="am-service-data">
            <!-- Package Back -->
            <div class="am-category-url" :style="{color: customizationForm.formTextColor}">
              <i class="el-icon-back"></i> {{ category.name }}
            </div>
            <!-- /Package Back -->

            <!-- Package Name -->
            <div class="am-service-title">
              <h2 :style="{color: customizationForm.formTextColor}">
                {{ package.name }}
              </h2>
            </div>
            <!-- /Package Name -->
          </div>
          <!-- /Package Data -->

          <!-- Package Price -->
          <div
            class="am-service-price"
            :style="{backgroundColor: customization.globalColors.primaryColor, color: customization.globalColors.textColorOnBackground}"
          >
            {{ getFormattedPrice(package.price, !$root.settings.payments.hideCurrencySymbolFrontend) }}
          </div>
          <!-- /Package Price -->
        </div>
        <!-- /Package Header -->

        <el-row
          v-if="formStepData.parts.package_rules_description.visibility || formStepData.parts.selected_services.visibility"
          class="am-package-selected"
        >
          <el-col
            v-if="formStepData.parts.package_rules_description.visibility"
            :span="12"
            class="am-package-selected-col"
          >
            <div class="am-package-rule">
              <div>
                <span :style="{color: customizationForm.formTextColor}">
                  <i class="el-icon-date"></i> {{ $root.labels.package_book_service }}
                </span>
              </div>

              <div>
                <span :style="{color: customizationForm.formTextColor}">
                  <i class="el-icon-time"></i> {{ `${$root.labels.package_book_duration} ${package.durationCount} ${$root.labels.weeks.toLowerCase()}` }}
                </span>
              </div>
            </div>

            <div class="am-package-description"><p v-html="package.description" :style="{color: customizationForm.formTextColor}"></p></div>
          </el-col>

          <el-col
            v-if="formStepData.parts.selected_services.visibility"
            :span="12"
            class="am-package-selected-col"
          >
            <el-row v-for="service in package.services" :key="service.id">
              <el-col :span="16" class="am-package-service" :style="{color: customizationForm.formTextColor}">
                {{ service.name }} <span>x{{ service.quantity }}</span>
              </el-col>
            </el-row>
          </el-col>
        </el-row>

        <slot name="bookingTemplates"></slot>
      </div>
      <!-- Package Details -->

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
import packageSetupForm from './PackageSetupForm'
import customizeEditDialog from '../dialogs/CustomizeEditDialog'
import customizationFormHeader from '../parts/CustomizationFormHeader'

export default {
  name: 'categoryPackageForm',

  components: {
    customizeEditDialog,
    packageSetupForm,
    customizationFormHeader
  },

  mixins: [imageMixin, priceMixin],

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
      package: {
        name: 'Package Name',
        gallery: [],
        durationCount: 3,
        durationType: 'week',
        services: [
          {
            id: 1,
            name: 'Service Name',
            quantity: 5
          },
          {
            id: 2,
            name: 'Service Name 2',
            quantity: 3
          },
          {
            id: 3,
            name: 'Service Name 3',
            quantity: 2
          }
        ],
        price: 100,
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
