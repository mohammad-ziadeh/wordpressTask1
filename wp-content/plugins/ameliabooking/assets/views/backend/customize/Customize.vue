<template>
  <div class="am-wrap">
    <!-- Preview Fonts Import -->
    <link rel="preconnect" href="https://fonts.gstatic.com">
    <!-- /Preview Fonts Import -->

    <div class="am-customize-page am-body">

      <!-- Page Header -->
      <page-header @showMainCustomize="hiddenForm = true" :oldCustomize="!hiddenForm"></page-header>

      <!-- Tabs -->
      <div class="am-customize am-section" v-if="!hiddenForm">
        <!-- Customize Settings -->
        <div class="am-customize-settings-preview">
          <el-row class="am-flexed">
            <!-- Customize Settings Inputs -->
            <el-col :lg="6" class="">
              <div class="am-customize-settings">

                <!-- Global Customize options notice -->
                <!-- <div class="am-setting">
                  <el-alert
                    type="warning"
                    show-icon
                    title=""
                    :description="$root.labels.global_customize_settings_notice"
                    :closable="false"
                  />
                </div>-->
                <!-- /Global Customize options notice -->

                <el-collapse v-model="globalColorsTab"  class="am-customize-global-colors" accordion>
                  <el-collapse-item name="1">
                    <template slot="title">
                      <!-- Use Global Colors -->
                      <div class="am-setting" style="width: 100%; border-bottom: none;">
                        <p style="display: flex; flex-wrap: wrap">
                          {{ $root.labels.use_global_colors }}
                        </p>
                        <div @click.stop style="padding-right: 16px">
                          <el-switch
                            v-model="customization.useGlobalColors[formType]"
                            active-color="#1A84EE"
                            @change="handleGlobalSwitch"
                            :disabled="this.$root.licence.isLite"
                          >
                          </el-switch>
                        </div>
                      </div>
                      <!-- /Use Global Colors -->
                    </template>
                    <div>
                      <!-- Primary Color -->
                      <div class="am-setting am-setting-collapse">
                        <p>{{ $root.labels.primary_color }}</p>
                        <el-color-picker
                          v-model="customization.globalColors.primaryColor"
                          :show-alpha="true"
                          size="small"
                          @change="updateOldColors('primaryColor', customization.globalColors.primaryColor, 'primaryColor')"
                        ></el-color-picker>
                      </div>
                      <!-- /Primary Color -->

                      <!-- Text Color On Background -->
                      <div class="am-setting am-setting-collapse">
                        <p>{{ $root.labels.text_color_on_background }}</p>
                        <el-color-picker
                          v-model="customization.globalColors.textColorOnBackground"
                          :show-alpha="true"
                          size="small"
                          @change="updateOldColors('textColorOnBackground', customization.globalColors.textColorOnBackground, 'textColorOnBackground')"
                        ></el-color-picker>
                      </div>
                      <!-- /Text Color On Background -->

                      <!-- Text Color -->
                      <div class="am-setting am-setting-collapse" :class="{'am-setting__disabled': !customization.useGlobalColors[formType]}">
                        <p>{{ $root.labels.text_color }}</p>
                        <el-color-picker
                          v-model="customization.globalColors.formTextColor"
                          :show-alpha="true"
                          size="small"
                          @change="updateOldColors('formTextColor', customization.globalColors.formTextColor, 'textColor')"
                        ></el-color-picker>
                      </div>
                      <!-- /Text Color -->

                      <!-- Background Color -->
                      <div class="am-setting am-setting-collapse" :class="{'am-setting__disabled': !customization.useGlobalColors[formType]}">
                        <p>{{ $root.labels.bgr_color }}</p>
                        <el-color-picker
                          v-model="customization.globalColors.formBackgroundColor"
                          :show-alpha="true"
                          size="small"
                          @change="updateOldColors('formBackgroundColor', customization.globalColors.formBackgroundColor)"
                        ></el-color-picker>
                      </div>
                      <!-- /Background Color -->

                      <!-- Background Gradient Color 1 -->
                      <div class="am-setting am-setting-collapse" :class="{'am-setting__disabled': !customization.useGlobalColors[formType]}">
                        <p>{{ $root.labels.bgr_gradient_color1 }}</p>
                        <el-color-picker
                          v-model="customization.globalColors.formGradientColor1"
                          :show-alpha="true"
                          size="small"
                          @change="updateOldColors('formGradientColor1', customization.globalColors.formGradientColor1, 'primaryGradient1')"
                        ></el-color-picker>
                      </div>
                      <!-- /Background Gradient Color 1 -->

                      <!-- Background Gradient Color 2 -->
                      <div class="am-setting am-setting-collapse" :class="{'am-setting__disabled': !customization.useGlobalColors[formType]}">
                        <p>{{ $root.labels.bgr_gradient_color2 }}</p>
                        <el-color-picker
                          v-model="customization.globalColors.formGradientColor2"
                          :show-alpha="true"
                          size="small"
                          @change="updateOldColors('formGradientColor2', customization.globalColors.formGradientColor2, 'primaryGradient2')"
                        ></el-color-picker>
                      </div>
                      <!-- /Background Gradient Color 2 -->

                      <!-- Background Gradient Color 2 -->
                      <div class="am-setting am-setting-collapse" :class="{'am-setting__disabled': !customization.useGlobalColors[formType]}" style="flex-wrap: wrap">
                        <p>{{ $root.labels.bgr_gradient_angle }}</p>
                        <el-slider
                          v-model="customization.globalColors.formGradientAngle"
                          :max="360"
                          :step="1"
                          :style="{width: 'calc(100% - 28px)', margin: '0 auto'}"
                        ></el-slider>
                      </div>
                      <!-- /Background Gradient Color 2 -->

                      <!-- Input Color -->
                      <div class="am-setting am-setting-collapse" :class="{'am-setting__disabled': !customization.useGlobalColors[formType]}">
                        <p>{{ $root.labels.input_color }}</p>
                        <el-color-picker
                          v-model="customization.globalColors.formInputColor"
                          :show-alpha="true"
                          size="small"
                          @change="updateOldColors('formInputColor', customization.globalColors.formInputColor)"
                        ></el-color-picker>
                      </div>
                      <!-- /Input Color -->

                      <!-- Input Text Color -->
                      <div class="am-setting am-setting-collapse" :class="{'am-setting__disabled': !customization.useGlobalColors[formType]}">
                        <p>{{ $root.labels.input_text_color }}</p>
                        <el-color-picker
                          v-model="customization.globalColors.formInputTextColor"
                          :show-alpha="true"
                          size="small"
                          @change="updateOldColors('formInputTextColor', customization.globalColors.formInputTextColor)"
                        ></el-color-picker>
                      </div>
                      <!-- /Input Text Color -->

                      <!-- Dropdown Color -->
                      <div class="am-setting am-setting-collapse" :class="{'am-setting__disabled': !customization.useGlobalColors[formType]}">
                        <p>{{ $root.labels.dropdown_color }}</p>
                        <el-color-picker
                          v-model="customization.globalColors.formDropdownColor"
                          :show-alpha="true"
                          size="small"
                          @change="updateOldColors('formDropdownColor', customization.globalColors.formDropdownColor)"
                        ></el-color-picker>
                      </div>
                      <!-- /Dropdown Color -->

                      <!-- Dropdown Text Color -->
                      <div class="am-setting am-setting-collapse" :class="{'am-setting__disabled': !customization.useGlobalColors[formType]}">
                        <p>{{ $root.labels.dropdown_text_color }}</p>
                        <el-color-picker
                          v-model="customization.globalColors.formDropdownTextColor"
                          :show-alpha="true"
                          size="small"
                          @change="updateOldColors('formDropdownTextColor', customization.globalColors.formDropdownTextColor)"
                        ></el-color-picker>
                      </div>
                      <!-- /Dropdown Text Color -->

                      <!-- Image Color -->
                      <div class="am-setting am-setting-collapse" :class="{'am-setting__disabled': !customization.useGlobalColors[formType]}">
                        <p>{{ $root.labels.image_color }}</p>
                        <el-color-picker
                          v-model="customization.globalColors.formImageColor"
                          :show-alpha="true"
                          size="small"
                          @change="updateOldColors('formImageColor', customization.globalColors.formImageColor)"
                        ></el-color-picker>
                      </div>
                      <!-- /Image Color -->
                    </div>
                  </el-collapse-item>
                </el-collapse>

                <!-- Font -->
                <div class="am-setting am-setting-wrapper">
                  <div class="am-setting__inner">
                    <p>{{ $root.labels.font }}</p>
                    <el-select
                      v-model="customization.font"
                      value-key="customer.id"
                      placeholder=""
                      @change="fontSelect"
                    >
                      <el-option
                        :label="$root.labels.custom"
                        :value="customization.customFontFamily"
                      >
                      </el-option>
                      <el-option
                        v-for="font in fonts"
                        :key="font.id"
                        :label="font.name"
                        :value="font.value"
                      >
                      </el-option>
                    </el-select>
                  </div>
                  <transition name="fade">
                    <div v-if="customization.font === customization.customFontFamily" class="am-setting__inner">
                      <p>{{ $root.labels.font_url }}</p>
                      <el-input v-model="fontUrl" @change="activateCustomFontStyles()"></el-input>
                    </div>
                  </transition>
                  <transition name="fade">
                    <div v-if="customization.font === customization.customFontFamily" class="am-setting__inner">
                      <p>{{ $root.labels.font_family }}</p>
                      <el-input v-model="customization.customFontFamily" @input="fontFamily"></el-input>
                    </div>
                  </transition>
                </div>
                <!-- /Font -->

                <!-- Reset & Save Buttons -->
                <div class="am-actions">

                  <!-- Reset Button -->
                  <el-button @click="resetSettings()">
                    {{ $root.labels.reset }}
                  </el-button>

                  <!-- Save Button -->
                  <el-button
                    @click="saveSettings()"
                    :loading="loadingButton"
                    type="primary"
                  >
                    {{ $root.labels.save }}
                  </el-button>
                </div>
                <!-- /Reset & Save Buttons -->
              </div>
            </el-col>
            <!-- /Customize Settings Inputs -->

            <!-- Customize Preview -->
            <el-col :lg="18" class="">
              <LicenceBlockHeader :licence="'starter'"/>
              <div class="am-customize__header-wrapper"
                   :class="licenceClassDisabled('starter')"
              >
                <div class="am-customize__header">
                  <div class="am-customize__header-left-inner">
                    <span>{{ $root.labels.form }}</span>
                    <el-select
                      v-model="formType"
                      @change="changeFormType"
                    >
                      <el-option
                        v-for="item in formTypeOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      >
                      </el-option>
                    </el-select>
                  </div>
                  <div v-if="customizeDisplayOptions.length" class="am-customize__header-left-inner">
                    <span>{{ $root.labels.form_flow }}</span>
                    <el-select v-model="customizeDisplay" :disabled="$root.licence.isLite">
                      <el-option
                        v-for="item in customizeDisplayOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      >
                      </el-option>
                    </el-select>
                  </div>
                </div>
                <div class="am-customize__header">
                  <div class="am-customize__header-right-inner">
                    <select-translate @languageChanged="languageChanged"></select-translate>
                  </div>
                  <div class="am-customize__header-right-inner">
                    <el-button
                      class="am-customize__preview"
                      :type="editable ? '' : 'primary'"
                      @click="editable = !editable"
                    >
                      {{ $root.labels.preview }}
                    </el-button>
                  </div>
                </div>
              </div>
              <component
                :class="licenceClassDisabled('starter')"
                :is="formType"
                :language-short-code="languageShortCode"
                :customize-display="customizeDisplay"
                :editable="editable"
                :customization="customization"
                :form-type-data="forms[formType]"
                :reset-data="defaultFormsData[formType]"
                @resetForm="resetForm"
                @saveDraggableEdit="saveDraggableEdit"
                @saveEdit="saveEdit"
              ></component>
            </el-col>
            <!-- /Customize Preview -->

          </el-row>
        </div>
        <!-- /Customize Settings -->
      </div>
      <div v-else class="am-customize-main__content">
        <div class="am-customize-main__heading">
          <h1>
            {{ $root.labels.choose_form }}
          </h1>
          <p>
            {{ $root.labels.choose_form_for_customize }}
          </p>
        </div>
        <div class="am-customize-main__form-card__wrapper">
          <!-- Step by Step -->
          <div class="am-customize-main__form-card">
            <div class="am-customize-main__form-card__content">
              <img :src="`${$root.getUrl}v3/src/assets/img/admin/customize/amelia2-0.png`" alt="Step-by-Step Booking Form 2.0">
              <div class="am-customize-main__form-card__heading">
                <h3>
                  <span>{{$root.labels.sbs_booking_form}}</span>
                </h3>
                <p>
                  {{$root.labels.redesigned_sbs_booking_form}}
                </p>
              </div>
            </div>
            <el-button @click="goToNewCustomize('sbsNew')" type="primary">{{ $root.labels.continue }}</el-button>
          </div>
          <!-- /Step by Step -->

          <!-- Catalog -->
          <div class="am-customize-main__form-card">
            <div class="am-customize-main__form-card__content">
              <img
                :src="`${$root.getUrl}v3/src/assets/img/admin/customize/amelia-catalog-2-0.png`"
                alt="Catalog Booking Form 2.0"
                class="am-customize-main__form-card__content-img"
              >
              <div class="am-customize-main__form-card__heading">
                <h3>
                  <span>{{$root.labels.cat_booking_form}}</span>
                </h3>
                <p>
                  {{$root.labels.redesigned_cat_booking_form}}
                </p>
              </div>
            </div>
            <el-button @click="goToNewCustomize('cbf')" type="primary">{{ $root.labels.continue }}</el-button>
          </div>
          <!-- /Catalog -->

          <!-- Event Calendar -->
          <div class="am-customize-main__form-card" v-if="!$root.licence.isLite">
            <div class="am-customize-main__form-card__content">
              <img
                :src="`${$root.getUrl}v3/src/assets/img/admin/customize/amelia-ev-calendar-2-0.png`"
                :alt="$root.labels.ecf_booking_form"
                class="am-customize-main__form-card__content-img"
              >
              <div class="am-customize-main__form-card__heading">
                <h3>
                  <span>{{$root.labels.ecf_booking_form}}</span>
                </h3>
                <p>
                  {{$root.labels.redesigned_ecf_booking_form}}
                </p>
              </div>
            </div>
            <el-button @click="goToNewCustomize('ecf')" type="primary">{{ $root.labels.continue }}</el-button>
          </div>
          <!-- /Event Calendar -->

          <!-- Event List -->
          <div class="am-customize-main__form-card">
            <div class="am-customize-main__form-card__content">
              <img
                :src="`${$root.getUrl}v3/src/assets/img/admin/customize/amelia-ev-list-2-0.png`"
                :alt="$root.labels.elf_booking_form"
                class="am-customize-main__form-card__content-img"
              >
              <div class="am-customize-main__form-card__heading">
                <h3>
                  <span>{{$root.labels.elf_booking_form}}</span>
                </h3>
                <p>
                  {{$root.labels.redesigned_elf_booking_form}}
                </p>
              </div>
            </div>
            <el-button @click="goToNewCustomize('elf')" type="primary">{{ $root.labels.continue }}</el-button>
          </div>
          <!-- /Event List -->

          <!-- Customer Panel -->
          <div
            v-if="!$root.licence.isLite"
            class="am-customize-main__form-card"
          >
            <div class="am-customize-main__form-card__content">
              <img
                :src="`${$root.getUrl}v3/src/assets/img/admin/customize/amelia-capc-2-0.png`"
                :alt="$root.labels.capc_form"
                class="am-customize-main__form-card__content-img"
              >
              <div class="am-customize-main__form-card__heading">
                <h3>
                  <span>{{$root.labels.capc_form}}</span>
                  <span class="am-pill-new">{{$root.labels.new_caps}}</span>
                </h3>
                <p>
                  {{$root.labels.redesigned_capc_form}}
                </p>
              </div>
            </div>
            <el-button @click="goToNewCustomize('capc')" type="primary">{{ $root.labels.continue }}</el-button>
          </div>
          <!-- /Customer Panel -->

          <!-- Employee Panel -->
          <div
            v-if="!$root.licence.isLite"
            class="am-customize-main__form-card"
          >
            <div class="am-customize-main__form-card__content">
              <img
                :src="`${$root.getUrl}v3/src/assets/img/admin/customize/amelia-cape-2-0.png`"
                :alt="$root.labels.capa_form"
                class="am-customize-main__form-card__content-img"
              >
              <div class="am-customize-main__form-card__heading">
                <h3>
                  <span>{{$root.labels.cape_form}}</span>
                  <span class="am-pill-wrapper">
                    <span class="am-pill-beta">{{$root.labels.beta_caps}}</span>
                    <span class="am-pill-new">{{$root.labels.new_caps}}</span>
                  </span>
                </h3>
                <p>
                  {{$root.labels.redesigned_cape_form}}
                </p>
              </div>
            </div>
            <el-button @click="goToNewCustomize('cape')" type="primary">{{ $root.labels.continue }}</el-button>
          </div>
          <!-- /Employee Panel -->

          <!-- Old Customize -->
          <div class="am-customize-main__form-card">
            <div class="am-customize-main__form-card__content">
              <img :src="`${$root.getUrl}v3/src/assets/img/admin/customize/amelia1-0.png`" alt="Step-by-Step Booking Form 2.0">
              <div class="am-customize-main__form-card__heading">
                <h3>
                  <span>{{$root.labels.sbs_booking_form_old}}</span>
                </h3>
                <p>
                  {{$root.labels.old_forms_text}}
                </p>
              </div>
            </div>
            <el-button @click="hiddenForm = !hiddenForm" type="primary">{{ $root.labels.continue }}</el-button>
          </div>
          <!-- /Old Customize -->
        </div>

        <!-- Dialog Customize -->
<!--        <dialog-new-customize :customize-page="true"></dialog-new-customize>-->
      </div>

      <!-- Help Button -->
      <el-col :md="6" class="">
        <a class="am-help-button" :href="needHelpPage" target="_blank" rel="nofollow">
          <i class="el-icon-question"></i> {{ $root.labels.need_help }}?
        </a>
      </el-col>

    </div>

  </div>
</template>

<script>
import PageHeader from '../parts/PageHeader.vue'
import formsCustomizationMixin from '../../../js/common/mixins/formsCustomizationMixin'
import licenceMixin from '../../../js/common/mixins/licenceMixin'
import dateMixin from '../../../js/common/mixins/dateMixin'
import notifyMixin from '../../../js/backend/mixins/notifyMixin'
import imageMixin from '../../../js/common/mixins/imageMixin'
import ElButton from '../../../../node_modules/element-ui/packages/button/src/button.vue'
import stepByStepForm from './formType/StepByStepForm'
import catalogForm from './formType/CatalogForm'
import eventListForm from './formType/EventListForm'
import eventCalendarForm from './formType/EventCalendarForm'
import deepMerge from 'deepmerge'
import SelectTranslate from '../parts/SelectTranslate'
// import DialogNewCustomize from '../parts/DialogNewCustomize'

export default {
  components: {
    // DialogNewCustomize,
    ElButton,
    PageHeader,
    stepByStepForm,
    catalogForm,
    eventListForm,
    eventCalendarForm,
    SelectTranslate
  },

  mixins: [
    licenceMixin,
    formsCustomizationMixin,
    dateMixin,
    notifyMixin,
    imageMixin
  ],

  data () {
    return {
      hiddenForm: true,
      formType: 'stepByStepForm',
      formTypeOptions: [
        {
          label: this.$root.labels.form_type_step_by_step,
          value: 'stepByStepForm'
        },
        {
          label: this.$root.labels.form_type_catalog,
          value: 'catalogForm'
        },
        {
          label: this.$root.labels.form_type_event_list,
          value: 'eventListForm'
        },
        {
          label: this.$root.labels.form_type_event_calendar,
          value: 'eventCalendarForm'
        }
      ],
      customizeDisplay: 'appointment',
      customizeDisplayOptions: [
        {
          value: 'appointment',
          label: this.$root.labels.form_block_service
        },
        {
          value: 'package',
          label: this.$root.labels.form_block_package
        }
      ],
      editable: true,
      defaultCustomization: {
        primaryColor: '#1A84EE',
        primaryGradient1: '#1A84EE',
        primaryGradient2: '#0454A2',
        textColor: '#354052',
        textColorOnBackground: '#ffffff',
        useGlobalColors: {
          stepByStepForm: false,
          catalogForm: false,
          eventListForm: false,
          eventCalendarForm: false
        },
        globalColors: {
          primaryColor: '#1A84EE',
          formBackgroundColor: '#FFFFFF',
          formTextColor: '#354052',
          formInputColor: '#FFFFFF',
          formInputTextColor: '#354052',
          formDropdownColor: '#FFFFFF',
          formDropdownTextColor: '#354052',
          formGradientColor1: '#1A84EE',
          formGradientColor2: '#0454A2',
          formGradientAngle: 135,
          formImageColor: '#1A84EE',
          textColorOnBackground: '#FFFFFF'
        },
        font: 'Amelia Roboto, sans-serif'
      },
      activeFormType: '',
      customization: this.$root.settings.customization,
      employee: this.$root.labels.any_employee,
      fonts: [
        {
          id: 1,
          name: 'Roboto',
          value: 'Amelia Roboto, sans-serif'
        },
        {
          id: 2,
          name: 'Lato',
          value: 'Amelia Lato'
        },
        {
          id: 3,
          name: 'Merriweather',
          value: 'Amelia Merriweather, serif'
        },
        {
          id: 4,
          name: 'Montserrat',
          value: 'Amelia Montserrat, sans-serif'
        },
        {
          id: 5,
          name: 'Mulish',
          value: 'Amelia Mulish, sans-serif'
        },
        {
          id: 6,
          name: 'Nunito',
          value: 'Amelia Nunito, sans-serif'
        },
        {
          id: 7,
          name: 'Asap Condensed',
          value: 'Amelia Asap Condensed, sans-serif'
        },
        {
          id: 8,
          name: 'Open Sans',
          value: 'Amelia Open Sans, sans-serif'
        },
        {
          id: 9,
          name: 'Barlow',
          value: 'Amelia Barlow, sans-serif'
        },
        {
          id: 10,
          name: 'Oswald',
          value: 'Amelia Oswald, sans-serif'
        },
        {
          id: 11,
          name: 'Bitter',
          value: 'Amelia Bitter, serif'
        },
        {
          id: 12,
          name: 'Poppins',
          value: 'Amelia Poppins, sans-serif'
        },
        {
          id: 13,
          name: 'Carme',
          value: 'Amelia Carme, sans-serif'
        }
      ],
      loadingButton: false,
      switchValue: true,
      forms: {},
      languageShortCode: '',
      globalColorsTab: '1',
      fontUrl: ''
    }
  },

  created () {
    this.fonts.forEach(item => {
      if (this.customization.font && item.name === this.customization.font.split(',')[0]) {
        this.customization.font = item.value
      }
    })

    this.fontUrl = this.customization.fontUrl === '' ? '' : JSON.parse(this.customization.fontUrl)

    this.changeFormType('stepByStepForm')

    if (this.$root.settings.customization && this.$root.settings.customization.forms) {
      this.forms = deepMerge.all([this.$root.settings.customization.forms, this.getDefaultFormData(), this.$root.settings.customization.forms])
    } else {
      this.forms = this.getDefaultFormData()
    }

    this.removeObjectDiff(this.forms, this.getDefaultFormData())
  },

  mounted () {
    if (this.$root.licence.isLite) {
      this.customization.useGlobalColors.stepByStepForm = true
      this.customization.useGlobalColors.catalogForm = true
      this.customization.useGlobalColors.eventListForm = true
      this.customization.useGlobalColors.eventCalendarForm = true
    }

    if (this.customization.customFontSelected === 'selected') {
      this.activateCustomFontStyles()
    }

    if ('useGenerated' in this.customization) {
      delete this.customization.useGenerated
    }

    this.inlineSVG()
  },

  methods: {
    goToNewCustomize (pageKey) {
      window.location = pageKey ? `admin.php?page=wpamelia-customize-new&current=${pageKey}` : 'admin.php?page=wpamelia-customize-new'
    },

    activateCustomFontStyles () {
      let head = document.head || document.getElementsByTagName('head')[0]
      if (head.querySelector('#customFont')) {
        head.querySelector('#customFont').remove()
      }

      let css = `@font-face {font-family: ${this.customization.font}; src: url(${this.fontUrl});}`
      let style = document.createElement('style')
      head.appendChild(style)
      style.setAttribute('type', 'text/css')
      style.setAttribute('id', 'customFont')
      style.appendChild(document.createTextNode(css))
    },

    fontSelect (a) {
      if (this.customization.customFontFamily === a) {
        this.customization.customFontSelected = 'selected'
        this.activateCustomFontStyles()
      } else {
        this.customization.customFontSelected = 'unselected'
      }
    },

    fontFamily (a) {
      this.customization.font = a
      this.activateCustomFontStyles()
    },

    handleGlobalSwitch (val) {
      if (val) {
        this.globalColorsTab = '1'
      }
    },

    updateOldColors (newProperty, val, oldProperty = '') {
      if (!val) {
        this.customization.globalColors[newProperty] = 'rgba(255,255,255,0)'
        if (oldProperty) {
          this.customization[oldProperty] = 'rgba(255,255,255,0)'
        }
      } else {
        if (oldProperty) {
          this.customization[oldProperty] = val
        }
      }
    },

    removeObjectDiff (a, b) {
      Object.keys(a).forEach((item) => {
        if (typeof a[item] !== 'object') {
          return false
        }
        if (!b.hasOwnProperty(item)) {
          delete a[item]
        } else {
          Object.keys(a[item]).forEach((item1) => {
            if (typeof a[item][item1] !== 'object') {
              return false
            }
            if (!b[item].hasOwnProperty(item1)) {
              delete a[item][item1]
            } else {
              Object.keys(a[item][item1]).forEach((item2) => {
                if (typeof a[item][item1][item2] !== 'object') {
                  return false
                }
                if (!b[item][item1].hasOwnProperty(item2)) {
                  delete a[item][item1][item2]
                } else {
                  Object.keys(a[item][item1][item2]).forEach((item3) => {
                    if (typeof a[item][item1][item2][item3] !== 'object') {
                      return false
                    }
                    if (!b[item][item1][item2].hasOwnProperty(item3)) {
                      delete a[item][item1][item2][item3]
                    } else {
                      Object.keys(a[item][item1][item2][item3]).forEach((item4) => {
                        if (typeof a[item][item1][item2][item3][item4] !== 'object') {
                          return false
                        }
                        if (!b[item][item1][item2][item3].hasOwnProperty(item4)) {
                          delete a[item][item1][item2][item3][item4]
                        } else {
                          Object.keys(a[item][item1][item2][item3][item4]).forEach((item5) => {
                            if (typeof a[item][item1][item2][item3][item4][item5] !== 'object') {
                              return false
                            }
                            if (!b[item][item1][item2][item3][item4].hasOwnProperty(item5)) {
                              delete a[item][item1][item2][item3][item4][item5]
                            } else {
                              Object.keys(a[item][item1][item2][item3][item4][item5]).forEach((item6) => {
                                if (typeof a[item][item1][item2][item3][item4][item5][item6] !== 'object') {
                                  return false
                                }
                                if (!b[item][item1][item2][item3][item4][item5].hasOwnProperty(item6)) {
                                  delete a[item][item1][item2][item3][item4][item5][item6]
                                }
                              })
                            }
                          })
                        }
                      })
                    }
                  })
                }
              })
            }
          })
        }
      })
    },

    languageChanged (selectedLanguage) {
      this.languageShortCode = selectedLanguage
    },

    changeFormType (type) {
      this.editable = true
      if (type === 'stepByStepForm') {
        this.customizeDisplay = 'appointment'
        if (this.$root.licence.isBasic || this.$root.licence.isLite) {
          this.customizeDisplayOptions = [
            {
              value: 'appointment',
              label: this.$root.labels.form_block_service
            }
          ]
        } else {
          this.customizeDisplayOptions = [
            {
              value: 'appointment',
              label: this.$root.labels.form_block_service
            },
            {
              value: 'package',
              label: this.$root.labels.form_block_package
            }
          ]
        }
      }

      if ((type === 'eventListForm') || (type === 'eventCalendarForm')) {
        this.customizeDisplay = ''
        this.customizeDisplayOptions = []
      }

      if (type === 'catalogForm') {
        this.customizeDisplay = 'catalog'
        if (this.$root.licence.isBasic || this.$root.licence.isLight) {
          this.customizeDisplayOptions = [
            {
              value: 'catalog',
              label: this.$root.labels.form_block_catalog
            },
            {
              value: 'appointment',
              label: this.$root.labels.form_block_catalog_service
            }
          ]
        } else {
          this.customizeDisplayOptions = [
            {
              value: 'catalog',
              label: this.$root.labels.form_block_catalog
            },
            {
              value: 'appointment',
              label: this.$root.labels.form_block_catalog_service
            },
            {
              value: 'package',
              label: this.$root.labels.form_block_catalog_package
            }
          ]
        }
      }

      this.globalColorsTab = '1'
    },

    getDefaultFormData () {
      let forms = JSON.parse(JSON.stringify({...this.defaultFormsData}))

      if (this.customization) {
        // STEP BY STEP - SELECT SERVICE FORM
        forms.stepByStepForm.selectServiceForm.globalSettings.formTextColor = this.customization.textColor
        forms.stepByStepForm.selectServiceForm.globalSettings.formInputTextColor = this.customization.textColor
        forms.stepByStepForm.selectServiceForm.globalSettings.formDropdownTextColor = this.customization.textColor
        // STEP BY STEP - CALENDAR DATE TIME FORM
        forms.stepByStepForm.calendarDateTimeForm.globalSettings.formGradientColor1 = this.customization.primaryGradient1
        forms.stepByStepForm.calendarDateTimeForm.globalSettings.formGradientColor2 = this.customization.primaryGradient2
        forms.stepByStepForm.calendarDateTimeForm.globalSettings.formTextColor = this.customization.textColorOnBackground
        // STEP BY STEP - RECURRING SETUP FORM
        forms.stepByStepForm.recurringSetupForm.globalSettings.formTextColor = this.customization.textColorOnBackground
        forms.stepByStepForm.recurringSetupForm.globalSettings.formGradientColor1 = this.customization.primaryGradient1
        forms.stepByStepForm.recurringSetupForm.globalSettings.formGradientColor2 = this.customization.primaryGradient2
        forms.stepByStepForm.recurringSetupForm.globalSettings.formInputTextColor = this.customization.textColorOnBackground
        forms.stepByStepForm.recurringSetupForm.globalSettings.formDropdownTextColor = this.customization.textColor
        // STEP BY STEP - RECURRING DATES FORM
        forms.stepByStepForm.recurringDatesForm.globalSettings.formTextColor = this.customization.textColor
        forms.stepByStepForm.recurringDatesForm.globalSettings.formInputColor = this.customization.textColorOnBackground
        forms.stepByStepForm.recurringDatesForm.globalSettings.formInputTextColor = this.customization.textColor
        forms.stepByStepForm.recurringDatesForm.globalSettings.formDropdownTextColor = this.customization.textColor
        // STEP BY STEP - SELECT PACKAGE FORM
        forms.stepByStepForm.selectPackageForm.globalSettings.formTextColor = this.customization.textColor
        forms.stepByStepForm.selectPackageForm.globalSettings.formInputTextColor = this.customization.textColor
        forms.stepByStepForm.selectPackageForm.globalSettings.formDropdownTextColor = this.customization.textColor
        // STEP BY STEP - PACKAGE INFO FORM
        forms.stepByStepForm.packageInfoForm.globalSettings.formTextColor = this.customization.textColor
        // STEP BY STEP - PACKAGE SETUP FORM
        forms.stepByStepForm.packageSetupForm.globalSettings.formTextColor = this.customization.textColorOnBackground
        forms.stepByStepForm.packageSetupForm.globalSettings.formGradientColor1 = this.customization.primaryGradient1
        forms.stepByStepForm.packageSetupForm.globalSettings.formGradientColor2 = this.customization.primaryGradient2
        forms.stepByStepForm.packageSetupForm.globalSettings.formInputTextColor = this.customization.textColorOnBackground
        forms.stepByStepForm.packageSetupForm.globalSettings.formDropdownTextColor = this.customization.textColor
        // STEP BY STEP - PACKAGE LIST FORM
        forms.stepByStepForm.packageListForm.globalSettings.formTextColor = this.customization.textColor
        // STEP BY STEP - CONFIRM BOOKING FORM - APPOINTMENT
        forms.stepByStepForm.confirmBookingForm.appointment.globalSettings.formTextColor = this.customization.textColor
        forms.stepByStepForm.confirmBookingForm.appointment.globalSettings.formInputTextColor = this.customization.textColor
        forms.stepByStepForm.confirmBookingForm.appointment.globalSettings.formDropdownTextColor = this.customization.textColor
        // STEP BY STEP - CONFIRM BOOKING FORM - PACKAGE
        forms.stepByStepForm.confirmBookingForm.package.globalSettings.formTextColor = this.customization.textColor
        forms.stepByStepForm.confirmBookingForm.package.globalSettings.formInputTextColor = this.customization.textColor
        forms.stepByStepForm.confirmBookingForm.package.globalSettings.formDropdownTextColor = this.customization.textColor
        // STEP BY STEP - CONGRATULATIONS BOOKING FORM - APPOINTMENT
        forms.stepByStepForm.congratulationsForm.appointment.globalSettings.formTextColor = this.customization.textColor
        forms.stepByStepForm.congratulationsForm.appointment.globalSettings.formInputTextColor = this.customization.textColor
        forms.stepByStepForm.congratulationsForm.appointment.globalSettings.formDropdownTextColor = this.customization.textColor
        forms.stepByStepForm.congratulationsForm.appointment.globalSettings.formImageColor = this.customization.primaryColor
        // STEP BY STEP - CONGRATULATIONS BOOKING FORM - PACKAGE
        forms.stepByStepForm.congratulationsForm.package.globalSettings.formTextColor = this.customization.textColor
        forms.stepByStepForm.congratulationsForm.package.globalSettings.formInputTextColor = this.customization.textColor
        forms.stepByStepForm.congratulationsForm.package.globalSettings.formDropdownTextColor = this.customization.textColor
        forms.stepByStepForm.congratulationsForm.package.globalSettings.formImageColor = this.customization.primaryColor
        // CATALOG FORM - SELECT SERVICE FORM
        forms.catalogForm.selectServiceForm.globalSettings.formTextColor = this.customization.textColor
        forms.catalogForm.selectServiceForm.globalSettings.formInputTextColor = this.customization.textColor
        forms.catalogForm.selectServiceForm.globalSettings.formDropdownTextColor = this.customization.textColor
        // CATALOG FORM - CALENDAR DATE TIME FORM
        forms.catalogForm.calendarDateTimeForm.globalSettings.formGradientColor1 = this.customization.primaryGradient1
        forms.catalogForm.calendarDateTimeForm.globalSettings.formGradientColor2 = this.customization.primaryGradient2
        forms.catalogForm.calendarDateTimeForm.globalSettings.formTextColor = this.customization.textColorOnBackground
        // CATALOG FORM - RECURRING SETUP FORM
        forms.catalogForm.recurringSetupForm.globalSettings.formTextColor = this.customization.textColorOnBackground
        forms.catalogForm.recurringSetupForm.globalSettings.formGradientColor1 = this.customization.primaryGradient1
        forms.catalogForm.recurringSetupForm.globalSettings.formGradientColor2 = this.customization.primaryGradient2
        forms.catalogForm.recurringSetupForm.globalSettings.formInputTextColor = this.customization.textColorOnBackground
        forms.catalogForm.recurringSetupForm.globalSettings.formDropdownTextColor = this.customization.textColor
        // CATALOG FORM - RECURRING DATES FORM
        forms.catalogForm.recurringDatesForm.globalSettings.formTextColor = this.customization.textColor
        forms.catalogForm.recurringDatesForm.globalSettings.formInputColor = this.customization.textColorOnBackground
        forms.catalogForm.recurringDatesForm.globalSettings.formInputTextColor = this.customization.textColor
        forms.catalogForm.recurringDatesForm.globalSettings.formDropdownTextColor = this.customization.textColor
        // CATALOG FORM - PACKAGE SETUP FORM
        forms.catalogForm.packageSetupForm.globalSettings.formTextColor = this.customization.textColorOnBackground
        forms.catalogForm.packageSetupForm.globalSettings.formGradientColor1 = this.customization.primaryGradient1
        forms.catalogForm.packageSetupForm.globalSettings.formGradientColor2 = this.customization.primaryGradient2
        forms.catalogForm.packageSetupForm.globalSettings.formInputTextColor = this.customization.textColorOnBackground
        forms.catalogForm.packageSetupForm.globalSettings.formDropdownTextColor = this.customization.textColor
        // CATALOG FORM - PACKAGE LIST FORM
        forms.catalogForm.packageListForm.globalSettings.formTextColor = this.customization.textColor
        // CATALOG FORM - CONFIRM BOOKING FORM - APPOINTMENT
        forms.catalogForm.confirmBookingForm.appointment.globalSettings.formTextColor = this.customization.textColor
        forms.catalogForm.confirmBookingForm.appointment.globalSettings.formInputTextColor = this.customization.textColor
        forms.catalogForm.confirmBookingForm.appointment.globalSettings.formDropdownTextColor = this.customization.textColor
        // CATALOG FORM - CONFIRM BOOKING FORM - PACKAGE
        forms.catalogForm.confirmBookingForm.package.globalSettings.formTextColor = this.customization.textColor
        forms.catalogForm.confirmBookingForm.package.globalSettings.formInputTextColor = this.customization.textColor
        forms.catalogForm.confirmBookingForm.package.globalSettings.formDropdownTextColor = this.customization.textColor
        // CATALOG FORM - CONGRATULATIONS BOOKING FORM - APPOINTMENT
        forms.catalogForm.congratulationsForm.appointment.globalSettings.formTextColor = this.customization.textColor
        forms.catalogForm.congratulationsForm.appointment.globalSettings.formInputTextColor = this.customization.textColor
        forms.catalogForm.congratulationsForm.appointment.globalSettings.formDropdownTextColor = this.customization.textColor
        forms.catalogForm.congratulationsForm.appointment.globalSettings.formImageColor = this.customization.primaryColor
        // CATALOG FORM - CONGRATULATIONS BOOKING FORM - PACKAGE
        forms.catalogForm.congratulationsForm.package.globalSettings.formTextColor = this.customization.textColor
        forms.catalogForm.congratulationsForm.package.globalSettings.formInputTextColor = this.customization.textColor
        forms.catalogForm.congratulationsForm.package.globalSettings.formDropdownTextColor = this.customization.textColor
        forms.catalogForm.congratulationsForm.package.globalSettings.formImageColor = this.customization.primaryColor
        // EVENT LIST FORM
        forms.eventListForm.globalSettings.formTextColor = this.customization.textColor
        forms.eventListForm.globalSettings.formInputTextColor = this.customization.textColor
        forms.eventListForm.globalSettings.formDropdownTextColor = this.customization.textColor
        // EVENT CALENDAR FORM - SELECT EVENT CALENDAR FORM
        forms.eventCalendarForm.selectEventCalendarForm.globalSettings.formTextColor = this.customization.textColor
        forms.eventCalendarForm.selectEventCalendarForm.globalSettings.formInputTextColor = this.customization.textColor
        forms.eventCalendarForm.selectEventCalendarForm.globalSettings.formDropdownTextColor = this.customization.textColor
        // EVENT CALENDAR FORM - INFO EVENT CALENDAR FORM
        forms.eventCalendarForm.infoEventCalendarForm.globalSettings.formTextColor = this.customization.textColor
        // EVENT CALENDAR FORM - INVITE EVENT CALENDAR FORM
        forms.eventCalendarForm.inviteEventCalendarForm.globalSettings.formTextColor = this.customization.textColor
        forms.eventCalendarForm.inviteEventCalendarForm.globalSettings.formInputTextColor = this.customization.textColor
        // EVENT CALENDAR FORM - CONFIRM BOOKING FORM
        forms.eventCalendarForm.confirmBookingForm.event.globalSettings.formTextColor = this.customization.textColor
        forms.eventCalendarForm.confirmBookingForm.event.globalSettings.formInputTextColor = this.customization.textColor
        forms.eventCalendarForm.confirmBookingForm.event.globalSettings.formDropdownTextColor = this.customization.textColor
        // EVENT CALENDAR FORM - CONGRATULATIONS BOOKING FORM
        forms.eventCalendarForm.congratulationsForm.event.globalSettings.formTextColor = this.customization.textColor
        forms.eventCalendarForm.congratulationsForm.event.globalSettings.formInputTextColor = this.customization.textColor
        forms.eventCalendarForm.congratulationsForm.event.globalSettings.formDropdownTextColor = this.customization.textColor
      }

      return forms
    },

    resetForm (resetData) {
      if (resetData.formType && resetData.formStep && resetData.formPart) {
        this.forms[resetData.formType][resetData.formStep][resetData.formPart] = resetData.data
      } else if (resetData.formType && resetData.formStep) {
        this.forms[resetData.formType][resetData.formStep] = resetData.data
      } else if (resetData.formType) {
        this.forms[resetData.formType] = resetData.data
      }
    },

    saveDraggableEdit (dataObj) {
      this.forms = deepMerge.all([dataObj, this.forms])
    },

    saveEdit (dataObj) {
      this.forms = deepMerge.all([this.forms, dataObj])
    },

    saveSettings () {
      let defaultForm = this.getDefaultFormData()

      this.customization.useGenerated = JSON.stringify({...defaultForm}) !== JSON.stringify({...this.forms}) || JSON.stringify(this.defaultCustomization.font) !== JSON.stringify(this.customization.font)

      this.loadingButton = true
      this.customization.forms = JSON.parse(JSON.stringify({...this.forms}))

      this.customization.fontUrl = JSON.stringify(this.fontUrl)

      this.$http.post(`${this.$root.getAjaxUrl}/settings`, {customization: this.customization})
        .then(response => {
          this.loadingButton = false
          this.$root.settings.customization = response.data.data.customization
          this.notify(this.$root.labels.success, this.$root.labels.settings_saved, 'success')
        })
        .catch(e => {
          this.loadingButton = false
          this.notify(this.$root.labels.error, e.message, 'error')
        })
    },

    resetSettings () {
      this.customization = JSON.parse(JSON.stringify({...this.defaultCustomization}))

      this.forms = JSON.parse(JSON.stringify({...this.defaultFormsData}))

      this.fontUrl = ''
    }
  },

  computed: {
    needHelpPage () {
      return 'https://wpamelia.com/customize-design/'
    }
  }
}
</script>
