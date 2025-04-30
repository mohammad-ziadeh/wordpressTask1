<template>
  <div class="am-category-list" :class="{'editable': editable}">
    <customization-form-header
      v-if="!customization.useGlobalColors[formName]"
      :editable="editable"
      :customization-form="customizationForm"
      @resetForm="resetForm"
      @saveFormEdit="saveFormEdit"
    ></customization-form-header>

    <div class="am-category-list-wrapper" :class="{'editable': editable}">
      <!-- Categories Label -->
      <div v-if="formStepData.labels.categories.visibility" class="am-catalog-headline">
        <h3 :style="{color: customizationForm.formTextColor}">
          <template v-if="!languageShortCode">
            {{ formStepData.labels.categories.value || $root.labels.categories }}
          </template>
          <template v-else>
            {{ formStepData.labels.categories.translations[languageShortCode] || $root.labels.categories }}
          </template>
        </h3>
      </div>

      <el-row :gutter="24">
        <el-col
          v-for="category in categories"
          :key="category.id"
          :lg="columnsLg"
          :md="12"
          :sm="12"
        >
          <div class="am-category" :style="{backgroundColor: customizationForm.formBackgroundColor}">
            <!-- Category Name -->
            <div class="am-category-title" :style="{color: customizationForm.formTextColor}">
              {{ category.name }}
            </div>

            <!-- Number Of Services -->
            <span v-if="formStepData.labels.services_lower.visibility" :style="{color: customizationForm.formTextColor}">
              <template v-if="!languageShortCode">
                {{ formStepData.labels.services_lower.value || $root.labels.services_lower }}: {{ category.services.length }}
              </template>
              <template v-else>
                {{ formStepData.labels.services_lower.translations[languageShortCode] || $root.labels.services_lower }}: {{ category.services.length }}
              </template>
            </span>

            <!-- Services Images -->
            <div v-if="formStepData.parts.service_images_thumbs.visibility" class="am-category-services-thumbs">
              <img
                v-if="index < 3"
                v-for="(service, index) in category.services"
                :key="service.id"
                :src="pictureLoad(service, false)"
                @error="imageLoadError(service, false)"
              >
              <!-- Invisible Services Count -->
              <span v-if="category.services.length > 3" :style="{color: customizationForm.formTextColor}">
                +{{ category.services.length - 3 }}
              </span>
              <!-- /Invisible Services Count -->
            </div>
            <!-- /Services Images -->
          </div>
        </el-col>
      </el-row>

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
</template>

<script>
import imageMixin from '../../../../js/common/mixins/imageMixin'
import customizeEditDialog from '../dialogs/CustomizeEditDialog'
import customizationFormHeader from '../parts/CustomizationFormHeader'

export default {
  name: 'catalogListForm',

  components: {
    customizeEditDialog,
    customizationFormHeader
  },

  mixins: [imageMixin],

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
    resetStepData: {
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
    }
  },

  data () {
    return {
      categories: [
        {
          id: 0,
          name: 'Category Name 1',
          services: [
            {
              id: 1,
              name: 'Service Name 1'
            }
          ]
        },
        {
          id: 1,
          name: 'Category Name 2',
          services: [
            {
              id: 1,
              name: 'Service Name 1'
            },
            {
              id: 2,
              name: 'Service Name 2'
            },
            {
              id: 3,
              name: 'Service Name 3'
            },
            {
              id: 4,
              name: 'Service Name 4'
            }
          ]
        },
        {
          id: 2,
          name: 'Category Name 3',
          services: [
            {
              id: 1,
              name: 'Service Name 1'
            },
            {
              id: 2,
              name: 'Service Name 2'
            },
            {
              id: 3,
              name: 'Service Name 3'
            }
          ]
        }
      ],
      columnsLg: 12
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
    }
  }
}
</script>
