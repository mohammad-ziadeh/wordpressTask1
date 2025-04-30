<template>
  <div class="am-customize-step" ref="customizeContainer">
    <!-- Catalog Customization Tabs -->
    <el-tabs v-if="customizeDisplay === 'catalog'" v-model="activeCatalogStep" :tab-position="stepNavigation">
      <!-- CATALOG - SERVICE MODE - STEP 1 -->
      <el-tab-pane name="1">
        <span slot="label" class="am-customize-step__item">
          <img :src="$root.getUrl+'public/img/am-customize-step-1.svg'">
          <p>Step 1</p>
        </span>
        <div class="am-catalog" :style="{ 'fontFamily': customization.font }">
          <catalog-list-form
            :form-name="$options.name"
            :editable="editable"
            :language-short-code="languageShortCode"
            :customization="customization"
            :customization-form="customization.useGlobalColors[$options.name] ? customization.globalColors : formTypeData.catalogListForm.globalSettings"
            :form-step-data="formTypeData.catalogListForm"
            :reset-step-data="resetData.catalogListForm"
            @resetForm="resetForm"
            @saveEdit="saveStepEdit"
          ></catalog-list-form>
        </div>
      </el-tab-pane>
      <!-- /CATALOG - SERVICE MODE - STEP 1 -->

      <!-- CATALOG - SERVICE MODE - STEP 1 -->
      <el-tab-pane name="2">
        <span slot="label" class="am-customize-step__item">
          <img :src="$root.getUrl+'public/img/am-customize-step-1.svg'">
          <p>Step 2</p>
        </span>
        <div class="am-catalog" :style="{ 'fontFamily': customization.font }">
          <category-list-form
            :form-name="$options.name"
            :editable="editable"
            :language-short-code="languageShortCode"
            :customization="customization"
            :customization-form="customization.useGlobalColors[$options.name] ? customization.globalColors : formTypeData.categoryListForm.globalSettings"
            :form-step-data="formTypeData.categoryListForm"
            :reset-step-data="resetData.categoryListForm"
            @resetForm="resetForm"
            @saveEdit="saveStepEdit"
          ></category-list-form>
        </div>
      </el-tab-pane>
      <!-- /CATALOG - SERVICE MODE - STEP 1 -->
    </el-tabs>

    <el-tabs v-if="customizeDisplay === 'appointment'" v-model="activeServiceStep" :tab-position="stepNavigation">
      <!-- CATALOG - SERVICE MODE - STEP 1 -->
      <el-tab-pane name="1">
        <span slot="label" class="am-customize-step__item">
          <img :src="$root.getUrl+'public/img/am-customize-step-1.svg'">
          <p>Step 1</p>
        </span>
        <div class="am-catalog" :style="{ 'fontFamily': customization.font }">
          <category-service-form
            :form-name="$options.name"
            :editable="editable"
            :language-short-code="languageShortCode"
            :customization="customization"
            :customization-form="customization.useGlobalColors[$options.name] ? customization.globalColors : formTypeData.categoryServiceForm.globalSettings"
            :form-step-data="formTypeData.categoryServiceForm"
            :reset-step-data="resetData.categoryServiceForm"
            @resetForm="resetForm"
            @saveEdit="saveStepEdit"
          >
            <template slot="bookingTemplates">
              <!-- Service Booking -->
              <div class="am-step-booking am-active-picker" :style="{ 'fontFamily': customization.font }">
                <!-- Select Service -->
                <select-service-form
                  :form-name="$options.name"
                  :editable="false"
                  :catalog-layout="true"
                  :language-short-code="languageShortCode"
                  :customization="customization"
                  :customization-form="customization.useGlobalColors[$options.name] ? customization.globalColors : formTypeData.selectServiceForm.globalSettings"
                  :form-step-data="formTypeData.selectServiceForm"
                  :reset-data="resetData"
                  @resetForm="resetForm"
                  @saveDraggableEdit="saveDraggableEdit"
                  @saveEdit="saveStepEdit"
                ></select-service-form>
                <!-- /Select Service -->

                <!-- Pick Date & Time -->
                <calendar-date-time-form
                  :form-name="$options.name"
                  :editable="false"
                  :language-short-code="languageShortCode"
                  :customization="customization"
                  :customization-form="customization.useGlobalColors[$options.name] ? customization.globalColors : formTypeData.calendarDateTimeForm.globalSettings"
                  :form-step-data="formTypeData.calendarDateTimeForm"
                  :reset-data="resetData"
                  @resetForm="resetForm"
                  @saveEdit="saveStepEdit"
                ></calendar-date-time-form>
                <!-- /Pick Date & Time -->
              </div>
              <!-- /Service Booking -->
            </template>
          </category-service-form>
        </div>
      </el-tab-pane>
      <!-- /CATALOG - SERVICE MODE - STEP 1 -->

      <!-- CATALOG - SERVICE MODE - STEP 2 -->
      <el-tab-pane name="2">
        <span slot="label" class="am-customize-step__item">
          <img :src="$root.getUrl+'public/img/am-customize-step-1.svg'">
          <p>Step 2</p>
        </span>
        <div class="am-catalog" :style="{ 'fontFamily': customization.font }">
          <category-service-form
            :form-name="$options.name"
            :editable="false"
            :language-short-code="languageShortCode"
            :customization="customization"
            :customization-form="customization.useGlobalColors[$options.name] ? customization.globalColors : formTypeData.categoryServiceForm.globalSettings"
            :form-step-data="formTypeData.categoryServiceForm"
            :reset-step-data="resetData.categoryServiceForm"
            @resetForm="resetForm"
            @saveEdit="saveStepEdit"
          >
            <template slot="bookingTemplates">
              <!-- Service Booking -->
              <div class="am-step-booking am-active-picker" :style="{ 'fontFamily': customization.font }">
                <!-- Select Service -->
                <select-service-form
                  :form-name="$options.name"
                  :editable="editable"
                  :language-short-code="languageShortCode"
                  :catalog-layout="true"
                  :customization="customization"
                  :customization-form="customization.useGlobalColors[$options.name] ? customization.globalColors : formTypeData.selectServiceForm.globalSettings"
                  :form-step-data="formTypeData.selectServiceForm"
                  :reset-data="resetData"
                  @resetForm="resetForm"
                  @saveDraggableEdit="saveDraggableEdit"
                  @saveEdit="saveStepEdit"
                ></select-service-form>
                <!-- /Select Service -->

                <!-- Pick Date & Time -->
                <calendar-date-time-form
                  :form-name="$options.name"
                  :editable="editable"
                  :language-short-code="languageShortCode"
                  :customization="customization"
                  :customization-form="customization.useGlobalColors[$options.name] ? customization.globalColors : formTypeData.calendarDateTimeForm.globalSettings"
                  :form-step-data="formTypeData.calendarDateTimeForm"
                  :reset-data="resetData"
                  @resetForm="resetForm"
                  @saveEdit="saveStepEdit"
                ></calendar-date-time-form>
                <!-- /Pick Date & Time -->
              </div>
              <!-- /Service Booking -->
            </template>
          </category-service-form>
        </div>
      </el-tab-pane>
      <!-- /CATALOG - SERVICE MODE - STEP 2 -->

      <!-- CATALOG - SERVICE MODE - STEP 3 -->
      <el-tab-pane name="3">
        <span slot="label" class="am-customize-step__item">
          <img :src="$root.getUrl+'public/img/am-customize-step-1.svg'">
          <p>Step 3</p>
        </span>
        <div class="am-catalog" :style="{ 'fontFamily': customization.font }">
          <category-service-form
            :form-name="$options.name"
            :editable="false"
            :language-short-code="languageShortCode"
            :customization="customization"
            :customization-form="customization.useGlobalColors[$options.name] ? customization.globalColors : formTypeData.categoryServiceForm.globalSettings"
            :form-step-data="formTypeData.categoryServiceForm"
            :reset-step-data="resetData.categoryServiceForm"
            @resetForm="resetForm"
            @saveEdit="saveStepEdit"
          >
            <template slot="bookingTemplates">
              <!-- Service Booking -->
              <div class="am-step-booking am-active-picker" :style="{ 'fontFamily': customization.font }">
                <!-- Select Service -->
                <select-service-form
                  :form-name="$options.name"
                  :catalog-layout="true"
                  :editable="false"
                  :language-short-code="languageShortCode"
                  :customization="customization"
                  :customization-form="customization.useGlobalColors[$options.name] ? customization.globalColors : formTypeData.selectServiceForm.globalSettings"
                  :form-step-data="formTypeData.selectServiceForm"
                  :reset-data="resetData"
                  @resetForm="resetForm"
                  @saveDraggableEdit="saveDraggableEdit"
                  @saveEdit="saveStepEdit"
                ></select-service-form>
                <!-- /Select Service -->

                <!-- Recurring Setup Form -->
                <recurring-setup-form
                  :form-name="$options.name"
                  :editable="editable"
                  :language-short-code="languageShortCode"
                  :customization="customization"
                  :customization-form="customization.useGlobalColors[$options.name] ? customization.globalColors : formTypeData.recurringSetupForm.globalSettings"
                  :form-step-data="formTypeData.recurringSetupForm"
                  :reset-data="resetData"
                  @resetForm="resetForm"
                  @saveEdit="saveStepEdit"
                ></recurring-setup-form>
                <!-- /Recurring Setup Form -->
              </div>
              <!-- /Service Booking -->
            </template>
          </category-service-form>
        </div>
      </el-tab-pane>
      <!-- /CATALOG - SERVICE MODE - STEP 3 -->

      <!-- CATALOG - SERVICE MODE - STEP 4 -->
      <el-tab-pane name="4">
        <span slot="label" class="am-customize-step__item">
          <img :src="$root.getUrl+'public/img/am-customize-step-1.svg'">
          <p>Step 4</p>
        </span>
        <div class="am-catalog" :style="{ 'fontFamily': customization.font }">
          <category-service-form
            :form-name="$options.name"
            :editable="false"
            :language-short-code="languageShortCode"
            :customization="customization"
            :customization-form="customization.useGlobalColors[$options.name] ? customization.globalColors : formTypeData.categoryServiceForm.globalSettings"
            :form-step-data="formTypeData.categoryServiceForm"
            :reset-step-data="resetData.categoryServiceForm"
            @resetForm="resetForm"
            @saveEdit="saveStepEdit"
          >
            <template slot="bookingTemplates">
              <!-- Service Booking -->
              <div class="am-step-booking" :style="{ 'fontFamily': customization.font }">
                <!-- Recurring Setup Form -->
                <recurring-setup-form
                  class="next-step"
                  :form-name="$options.name"
                  :editable="false"
                  :language-short-code="languageShortCode"
                  :customization="customization"
                  :customization-form="customization.useGlobalColors[$options.name] ? customization.globalColors : formTypeData.recurringSetupForm.globalSettings"
                  :form-step-data="formTypeData.recurringSetupForm"
                  :reset-data="resetData"
                  @resetForm="resetForm"
                  @saveEdit="saveStepEdit"
                ></recurring-setup-form>
                <!-- /Recurring Setup Form -->

                <!-- Recurring Dates Form -->
                <recurring-dates-form
                  :form-name="$options.name"
                  :editable="editable"
                  :language-short-code="languageShortCode"
                  :customization="customization"
                  :customization-form="customization.useGlobalColors[$options.name] ? customization.globalColors : formTypeData.recurringDatesForm.globalSettings"
                  :form-step-data="formTypeData.recurringDatesForm"
                  :reset-data="resetData"
                  @resetForm="resetForm"
                  @saveEdit="saveStepEdit"
                ></recurring-dates-form>
                <!-- /Recurring Dates Form -->
              </div>
              <!-- /Service Booking -->
            </template>
          </category-service-form>
        </div>
      </el-tab-pane>
      <!-- /CATALOG - SERVICE MODE - STEP 4 -->

      <!-- CATALOG - SERVICE MODE - STEP 5 -->
      <el-tab-pane name="5">
        <span slot="label" class="am-customize-step__item">
          <img :src="$root.getUrl+'public/img/am-customize-step-1.svg'">
          <p>Step 5</p>
        </span>
        <div class="am-catalog" :style="{ 'fontFamily': customization.font }">
          <category-service-form
            :form-name="$options.name"
            :editable="false"
            :language-short-code="languageShortCode"
            :customization="customization"
            :customization-form="customization.useGlobalColors[$options.name] ? customization.globalColors : formTypeData.categoryServiceForm.globalSettings"
            :form-step-data="formTypeData.categoryServiceForm"
            :reset-step-data="resetData.categoryServiceForm"
            @resetForm="resetForm"
            @saveEdit="saveStepEdit"
          >
            <template slot="bookingTemplates">
              <!-- Service Booking -->
              <div class="am-step-booking" :style="{ 'fontFamily': customization.font }">
                <!-- Pick Date & Time -->
                <calendar-date-time-form
                  class="next-step"
                  :form-name="$options.name"
                  :editable="false"
                  :language-short-code="languageShortCode"
                  :customization="customization"
                  :customization-form="customization.useGlobalColors[$options.name] ? customization.globalColors : formTypeData.calendarDateTimeForm.globalSettings"
                  :form-step-data="formTypeData.calendarDateTimeForm"
                  :reset-data="resetData"
                  @resetForm="resetForm"
                  @saveEdit="saveStepEdit"
                ></calendar-date-time-form>
                <!-- /Pick Date & Time -->

                <!-- Confirm Booking Form -->
                <confirm-booking-form
                  :form-name="$options.name"
                  :editable="editable"
                  :language-short-code="languageShortCode"
                  :customization="customization"
                  :customize-display="customizeDisplay"
                  :customization-form="customization.useGlobalColors[$options.name] ? customization.globalColors : formTypeData.confirmBookingForm[customizeDisplay].globalSettings"
                  :form-step-data="formTypeData.confirmBookingForm[customizeDisplay]"
                  :reset-data="resetData"
                  @resetForm="resetForm"
                  @saveDraggableEdit="saveDraggableEdit"
                  @saveEdit="saveStepEdit"
                ></confirm-booking-form>
                <!-- /Confirm Booking Form -->
              </div>
              <!-- /Service Booking -->
            </template>
          </category-service-form>
        </div>
      </el-tab-pane>
      <!-- /CATALOG - SERVICE MODE - STEP 5 -->

      <!-- CATALOG - SERVICE MODE - STEP 6 -->
      <el-tab-pane name="6">
        <span slot="label" class="am-customize-step__item">
          <img :src="$root.getUrl+'public/img/am-customize-step-1.svg'">
          <p>Step 6</p>
        </span>
        <div class="am-catalog" :style="{ 'fontFamily': customization.font }">
          <category-service-form
            :form-name="$options.name"
            :editable="false"
            :language-short-code="languageShortCode"
            :customization="customization"
            :customization-form="customization.useGlobalColors[$options.name] ? customization.globalColors : formTypeData.categoryServiceForm.globalSettings"
            :form-step-data="formTypeData.categoryServiceForm"
            :reset-step-data="resetData.categoryServiceForm"
            @resetForm="resetForm"
            @saveEdit="saveStepEdit"
          >
            <template slot="bookingTemplates">
              <!-- Service Booking -->
              <div class="am-step-booking" :style="{ 'fontFamily': customization.font }">
                <!-- Congratulations Form -->
                <congratulations-form
                  :form-name="$options.name"
                  :editable="editable"
                  :language-short-code="languageShortCode"
                  :customization="customization"
                  :customize-display="customizeDisplay"
                  :customization-form="customization.useGlobalColors[$options.name] ? customization.globalColors : formTypeData.congratulationsForm[customizeDisplay].globalSettings"
                  :form-step-data="formTypeData.congratulationsForm[customizeDisplay]"
                  :reset-data="resetData"
                  @resetForm="resetForm"
                  @saveEdit="saveStepEdit"
                ></congratulations-form>
                <!-- /Congratulations Form -->
              </div>
              <!-- /Service Booking -->
            </template>
          </category-service-form>
        </div>
      </el-tab-pane>
      <!-- /CATALOG - SERVICE MODE - STEP 6 -->
    </el-tabs>

    <el-tabs v-if="customizeDisplay === 'package'" v-model="activePackageStep" :tab-position="stepNavigation">
      <!-- CATALOG - PACKAGE MODE - STEP 1 -->
      <el-tab-pane name="1">
        <span slot="label" class="am-customize-step__item">
          <img :src="$root.getUrl+'public/img/am-customize-step-1.svg'">
          <p>Step 1</p>
        </span>
        <div class="am-catalog" :style="{ 'fontFamily': customization.font }">
          <category-package-form
            :form-name="$options.name"
            :editable="editable"
            :language-short-code="languageShortCode"
            :customization="customization"
            :customization-form="customization.useGlobalColors[$options.name] ? customization.globalColors : formTypeData.categoryPackageForm.globalSettings"
            :form-step-data="formTypeData.categoryPackageForm"
            :reset-step-data="resetData.categoryPackageForm"
            @resetForm="resetForm"
            @saveEdit="saveStepEdit"
          >
            <template slot="bookingTemplates">
              <div class="am-step-booking am-active-picker" :style="{ 'fontFamily': customization.font }">
                <!-- Pick Date & Time -->
                <package-setup-form
                  class="am-mobile-collapsed"
                  :form-name="$options.name"
                  :editable="false"
                  :language-short-code="languageShortCode"
                  :customization="customization"
                  :customization-form="customization.useGlobalColors[$options.name] ? customization.globalColors : formTypeData.packageSetupForm.globalSettings"
                  :form-step-data="formTypeData.packageSetupForm"
                  :reset-data="resetData"
                  @resetForm="resetForm"
                  @saveEdit="saveStepEdit"
                ></package-setup-form>
                <!-- /Pick Date & Time -->
              </div>
            </template>
          </category-package-form>
        </div>
      </el-tab-pane>
      <!-- /CATALOG - PACKAGE MODE - STEP 1 -->

      <!-- CATALOG - PACKAGE MODE - STEP 2 -->
      <el-tab-pane name="2">
        <span slot="label" class="am-customize-step__item">
          <img :src="$root.getUrl+'public/img/am-customize-step-1.svg'">
          <p>Step 2</p>
        </span>
        <div class="am-catalog" :style="{ 'fontFamily': customization.font }">
          <category-package-form
            :form-name="$options.name"
            :editable="false"
            :language-short-code="languageShortCode"
            :customization="customization"
            :customization-form="customization.useGlobalColors[$options.name] ? customization.globalColors : formTypeData.categoryPackageForm.globalSettings"
            :form-step-data="formTypeData.categoryPackageForm"
            :reset-step-data="resetData.categoryPackageForm"
            @resetForm="resetForm"
            @saveEdit="saveStepEdit"
          >
            <template slot="bookingTemplates">
              <div class="am-step-booking am-active-picker" :style="{ 'fontFamily': customization.font }">
                <!-- Pick Date & Time -->
                <package-setup-form
                  class="am-mobile-collapsed"
                  :form-name="$options.name"
                  :editable="editable"
                  :language-short-code="languageShortCode"
                  :customization="customization"
                  :customization-form="customization.useGlobalColors[$options.name] ? customization.globalColors : formTypeData.packageSetupForm.globalSettings"
                  :form-step-data="formTypeData.packageSetupForm"
                  :reset-data="resetData"
                  @resetForm="resetForm"
                  @saveEdit="saveStepEdit"
                ></package-setup-form>
                <!-- /Pick Date & Time -->
              </div>
            </template>
          </category-package-form>
        </div>
      </el-tab-pane>
      <!-- /CATALOG - PACKAGE MODE - STEP 2 -->

      <!-- CATALOG - PACKAGE MODE - STEP 3 -->
      <el-tab-pane name="3">
        <span slot="label" class="am-customize-step__item">
          <img :src="$root.getUrl+'public/img/am-customize-step-1.svg'">
          <p>Step 3</p>
        </span>
        <div class="am-catalog" :style="{ 'fontFamily': customization.font }">
          <category-package-form
            :form-name="$options.name"
            :editable="false"
            :language-short-code="languageShortCode"
            :customization="customization"
            :customization-form="customization.useGlobalColors[$options.name] ? customization.globalColors : formTypeData.categoryPackageForm.globalSettings"
            :form-step-data="formTypeData.categoryPackageForm"
            :reset-step-data="resetData.categoryPackageForm"
            @resetForm="resetForm"
            @saveEdit="saveStepEdit"
          >
            <template slot="bookingTemplates">
              <div class="am-step-booking" :style="{ 'fontFamily': customization.font }">
                <!-- Package Setup Form -->
                <package-setup-form
                  class="next-step"
                  :form-name="$options.name"
                  :editable="false"
                  :language-short-code="languageShortCode"
                  :customization="customization"
                  :customization-form="customization.useGlobalColors[$options.name] ? customization.globalColors : formTypeData.packageSetupForm.globalSettings"
                  :form-step-data="formTypeData.packageSetupForm"
                  :reset-data="resetData"
                  @resetForm="resetForm"
                  @saveEdit="saveStepEdit"
                ></package-setup-form>
                <!-- /Package Setup Form -->

                <!-- Package List Form -->
                <package-list-form
                  :form-name="$options.name"
                  :editable="editable"
                  :language-short-code="languageShortCode"
                  :catalog-layout="true"
                  :responsive-display="responsiveDisplay"
                  :customization="customization"
                  :customization-form="customization.useGlobalColors[$options.name] ? customization.globalColors : formTypeData.packageListForm.globalSettings"
                  :form-step-data="formTypeData.packageListForm"
                  :reset-data="resetData"
                  @resetForm="resetForm"
                  @saveEdit="saveStepEdit"
                ></package-list-form>
                <!-- /Package List Form -->
              </div>
            </template>
          </category-package-form>
        </div>
      </el-tab-pane>
      <!-- /CATALOG - PACKAGE MODE - STEP 3 -->

      <!-- CATALOG - PACKAGE MODE - STEP 4 -->
      <el-tab-pane name="4">
        <span slot="label" class="am-customize-step__item">
          <img :src="$root.getUrl+'public/img/am-customize-step-1.svg'">
          <p>Step 4</p>
        </span>
        <div class="am-catalog" :style="{ 'fontFamily': customization.font }">
          <category-package-form
            :form-name="$options.name"
            :editable="false"
            :language-short-code="languageShortCode"
            :customization="customization"
            :customization-form="customization.useGlobalColors[$options.name] ? customization.globalColors : formTypeData.categoryPackageForm.globalSettings"
            :form-step-data="formTypeData.categoryPackageForm"
            :reset-step-data="resetData.categoryPackageForm"
            @resetForm="resetForm"
            @saveEdit="saveStepEdit"
          >
            <template slot="bookingTemplates">
              <div class="am-step-booking" :style="{ 'fontFamily': customization.font }">
                <!-- Package Setup Form -->
                <package-setup-form
                  class="next-step"
                  :form-name="$options.name"
                  :editable="false"
                  :language-short-code="languageShortCode"
                  :customization="customization"
                  :customization-form="customization.useGlobalColors[$options.name] ? customization.globalColors : formTypeData.packageSetupForm.globalSettings"
                  :form-step-data="formTypeData.packageSetupForm"
                  :reset-data="resetData"
                  @resetForm="resetForm"
                  @saveEdit="saveStepEdit"
                ></package-setup-form>
                <!-- /Package Setup Form -->

                <!-- Confirm Booking Form -->
                <confirm-booking-form
                  :form-name="$options.name"
                  :editable="editable"
                  :language-short-code="languageShortCode"
                  :catalog-layout="true"
                  :customization="customization"
                  :customize-display="customizeDisplay"
                  :customization-form="customization.useGlobalColors[$options.name] ? customization.globalColors : formTypeData.confirmBookingForm[customizeDisplay].globalSettings"
                  :form-step-data="formTypeData.confirmBookingForm[customizeDisplay]"
                  :reset-data="resetData"
                  @resetForm="resetForm"
                  @saveDraggableEdit="saveDraggableEdit"
                  @saveEdit="saveStepEdit"
                ></confirm-booking-form>
                <!-- /Confirm Booking Form -->
              </div>
            </template>
          </category-package-form>
        </div>
      </el-tab-pane>
      <!-- /CATALOG - PACKAGE MODE - STEP 4 -->

      <!-- CATALOG - PACKAGE MODE - STEP 5 -->
      <el-tab-pane name="5">
        <span slot="label" class="am-customize-step__item">
          <img :src="$root.getUrl+'public/img/am-customize-step-1.svg'">
          <p>Step 5</p>
        </span>
        <div class="am-catalog" :style="{ 'fontFamily': customization.font }">
          <category-package-form
            :form-name="$options.name"
            :editable="false"
            :language-short-code="languageShortCode"
            :customization="customization"
            :customization-form="customization.useGlobalColors[$options.name] ? customization.globalColors : formTypeData.categoryPackageForm.globalSettings"
            :form-step-data="formTypeData.categoryPackageForm"
            :reset-step-data="resetData.categoryPackageForm"
            @resetForm="resetForm"
            @saveEdit="saveStepEdit"
          >
            <template slot="bookingTemplates">
              <div class="am-step-booking" :style="{ 'fontFamily': customization.font }">
                <!-- Congratulations Form -->
                <congratulations-form
                  :form-name="$options.name"
                  :editable="editable"
                  :language-short-code="languageShortCode"
                  :customization="customization"
                  :customize-display="customizeDisplay"
                  :customization-form="customization.useGlobalColors[$options.name] ? customization.globalColors : formTypeData.congratulationsForm[customizeDisplay].globalSettings"
                  :form-step-data="formTypeData.congratulationsForm[customizeDisplay]"
                  :reset-data="resetData"
                  @resetForm="resetForm"
                  @saveEdit="saveStepEdit"
                ></congratulations-form>
                <!-- /Congratulations Form -->
              </div>
            </template>
          </category-package-form>
        </div>
      </el-tab-pane>
      <!-- /CATALOG - PACKAGE MODE - STEP 5 -->
    </el-tabs>
  </div>
</template>

<script>
import catalogListForm from '../formSteps/CatalogListForm'
import categoryListForm from '../formSteps/CategoryListForm'
import categoryPackageForm from '../formSteps/CategoryPackageForm'
import categoryServiceForm from '../formSteps/CategoryServiceForm'
import selectServiceForm from '../formSteps/SelectServiceForm'
import calendarDateTimeForm from '../formSteps/CalendarDateTimeForm'
import recurringSetupForm from '../formSteps/RecurringSetupForm'
import recurringDatesForm from '../formSteps/RecurringDatesForm'
import confirmBookingForm from '../formSteps/ConfirmBookingForm'
import packageSetupForm from '../formSteps/PackageSetupForm'
import packageListForm from '../formSteps/PackageListForm'
import congratulationsForm from '../formSteps/CongratulationsForm'

export default {
  name: 'catalogForm',

  components: {
    catalogListForm,
    categoryListForm,
    categoryServiceForm,
    categoryPackageForm,
    selectServiceForm,
    calendarDateTimeForm,
    recurringSetupForm,
    recurringDatesForm,
    confirmBookingForm,
    packageSetupForm,
    packageListForm,
    congratulationsForm
  },

  props: {
    languageShortCode: {
      type: String,
      default: ''
    },
    customizeDisplay: {
      type: String,
      default: 'appointment'
    },
    editable: {
      type: Boolean,
      default: true
    },
    customization: {
      type: Object,
      default: () => {
        return {}
      }
    },
    resetData: {
      type: Object,
      default: () => {
        return {}
      }
    },
    formTypeData: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },

  data () {
    return {
      activeCatalogStep: '1',
      activeServiceStep: '1',
      activePackageStep: '1',
      responsiveDisplay: 'am-desktop',
      stepNavigation: 'right'
    }
  },

  updated () {
    this.handleResize()
  },

  created () {
    window.addEventListener('resize', this.handleResize)
  },

  mounted () {
    this.handleResize()
  },

  methods: {
    handleResize () {
      if (this.$refs.customizeContainer) {
        let amContainerWidth = this.$refs.customizeContainer.offsetWidth

        if (amContainerWidth < 873) {
          this.stepNavigation = 'top'
        } else {
          this.stepNavigation = 'right'
        }

        if (amContainerWidth < 768) {
          this.responsiveDisplay = 'am-mobile'
        } else {
          this.responsiveDisplay = 'am-desktop'
        }
      }
    },

    resetForm (resetData) {
      let resetDataObj = resetData
      resetDataObj.formType = this.$options.name
      this.$emit('resetForm', resetDataObj)
    },

    saveDraggableEdit (dataObj) {
      let formObj = {}
      formObj[this.$options.name] = JSON.parse(JSON.stringify(dataObj))
      this.$emit('saveDraggableEdit', formObj)
    },

    saveStepEdit (dataObj) {
      let formObj = {}
      formObj[this.$options.name] = JSON.parse(JSON.stringify(dataObj))
      this.$emit('saveEdit', formObj)
    }
  }
}
</script>
