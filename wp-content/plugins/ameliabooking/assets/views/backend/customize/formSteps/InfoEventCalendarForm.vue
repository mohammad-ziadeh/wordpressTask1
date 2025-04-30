<template>
  <div
    class="am-event-modal__wrapper am-template-wrapper" :class="{'editable': editable}"
    :style="cssVars"
  >
    <customization-form-header
      v-if="!customization.useGlobalColors[formName]"
      :editable="editable"
      :customization-form="customizationForm"
      @resetForm="resetForm"
      @saveFormEdit="saveFormEdit"
    ></customization-form-header>
    <div
      class="am-event-modal"
      :class="{'editable': editable}"
    >
      <div class="am-event-modal__inner">
        <!-- Event Info header -->
        <div class="am-event-modal__header">
          <div class="am-event-modal__header-title">
          <span class="am-event-modal__header-title-text">
            {{ eventDialogInfo.name }}
          </span>
            <span class="am-event-modal__header-title-status open">
            <img :src="`${$root.getUrl}public/img/am-calendar-icon-open.svg`">
            {{ labelsDisplay(transferredStrings.open, languageShortCode) || $root.labels.open }}
          </span>
          </div>
          <el-button
            class="am-event-modal__header-booking-btn"
            type="primary"
            :style="{backgroundColor: eventDialogInfo.color, borderColor: eventDialogInfo.color}"
          >
            {{ labelsDisplay(labelBookNow, languageShortCode) || $root.labels.event_book_now }}
            <span v-if="priceBlockVisibility" class="am-event-modal__header-booking-btn-price">
              {{ eventDialogInfo.price ? getFormattedPrice(eventDialogInfo.price, !$root.settings.payments.hideCurrencySymbolFrontend) : $root.labels.event_free }}
            </span>
          </el-button>
        </div>
        <!-- /Event Info header -->

        <div class="am-event-modal__body">

          <!-- Event Info gallery -->
          <div
            v-if="eventDialogInfo.gallery && eventDialogInfo.gallery.length > 0"
            class="am-event-modal__gallery"
            :class="{'am-event-modal__gallery-full' : !showLessImages}"
          >
            <div
              class="am-event-modal__gallery-selected-image"
              :class="{'am-event-modal__gallery-item-full' : (!showLessImages || eventDialogInfo.gallery.length === 1)}"
              :style="{backgroundImage : 'url(' + (selectedImage ? selectedImage : eventDialogInfo.gallery[0].pictureFullPath) + ')'}"
            >
            </div>
            <div
              v-if="eventDialogInfo.gallery.length > 1"
              class="am-event-modal__gallery-images"
              :class="{'am-event-modal__gallery-item-full' : !showLessImages}"
            >
              <div
                v-for="image in (eventDialogInfo.gallery.length > 4 && showLessImages ? eventDialogInfo.gallery.slice(0, 3) : eventDialogInfo.gallery)"
                :key="image.id"
                :style="{backgroundImage : 'url(' + image.pictureThumbPath + ')'}"
                @click="selectedImage = image.pictureFullPath"
              >
              </div>
              <div
                v-if="showLessImages && eventDialogInfo.gallery.length > 4"
                class="am-event-modal__gallery-images-more"
                @click="showLessImages = false"
              >
                <span class="am-event-modal__gallery-images-number-background" :style="{backgroundColor: eventDialogInfo.color}"></span>
                <span class="am-event-modal__gallery-images-number" :style="{color: eventDialogInfo.color}">+{{ eventDialogInfo.gallery.length - 3 }}</span>
              </div>
            </div>

            <div
              v-if="!showLessImages"
              v-show="!hideOnSmallScreen"
              class="am-event-modal__gallery-images-less"
              :style="{color: eventDialogInfo.color}"
              @click="showLessImages = true"
            >
              {{ $root.labels.event_show_less }}
              <i class="el-icon-arrow-up"></i>
            </div>
          </div>
          <!-- /Event Info gallery -->

          <!-- Event Info Mini Info -->
          <div v-if="rangeBlockVisibility || capacityBlockVisibility || locationBlockVisibility" class="am-event-modal__mini-info">
            <div v-if="rangeBlockVisibility" class="am-event-modal__mini-info-inner">
              <svg width="24" height="24" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path :fill="customizationForm.formTextColor" d="M21 4.66667H19.8333V3.5C19.8333 3.19058 19.7104 2.89384 19.4916 2.67504C19.2728 2.45625 18.9761 2.33334 18.6667 2.33334C18.3572 2.33334 18.0605 2.45625 17.8417 2.67504C17.6229 2.89384 17.5 3.19058 17.5 3.5V4.66667H10.5V3.5C10.5 3.19058 10.3771 2.89384 10.1583 2.67504C9.9395 2.45625 9.64275 2.33334 9.33333 2.33334C9.02391 2.33334 8.72717 2.45625 8.50838 2.67504C8.28958 2.89384 8.16667 3.19058 8.16667 3.5V4.66667H7C6.07174 4.66667 5.1815 5.03542 4.52513 5.6918C3.86875 6.34817 3.5 7.23841 3.5 8.16667V22.1667C3.5 23.0949 3.86875 23.9852 4.52513 24.6415C5.1815 25.2979 6.07174 25.6667 7 25.6667H21C21.9283 25.6667 22.8185 25.2979 23.4749 24.6415C24.1313 23.9852 24.5 23.0949 24.5 22.1667V8.16667C24.5 7.23841 24.1313 6.34817 23.4749 5.6918C22.8185 5.03542 21.9283 4.66667 21 4.66667ZM7 7H8.16667V8.16667C8.16667 8.47609 8.28958 8.77283 8.50838 8.99163C8.72717 9.21042 9.02391 9.33334 9.33333 9.33334C9.64275 9.33334 9.9395 9.21042 10.1583 8.99163C10.3771 8.77283 10.5 8.47609 10.5 8.16667V7H17.5V8.16667C17.5 8.47609 17.6229 8.77283 17.8417 8.99163C18.0605 9.21042 18.3572 9.33334 18.6667 9.33334C18.9761 9.33334 19.2728 9.21042 19.4916 8.99163C19.7104 8.77283 19.8333 8.47609 19.8333 8.16667V7H21C21.3094 7 21.6062 7.12292 21.825 7.34171C22.0438 7.5605 22.1667 7.85725 22.1667 8.16667V12.8333H5.83333V8.16667C5.83333 7.85725 5.95625 7.5605 6.17504 7.34171C6.39383 7.12292 6.69058 7 7 7ZM21 23.3333H7C6.69058 23.3333 6.39383 23.2104 6.17504 22.9916C5.95625 22.7728 5.83333 22.4761 5.83333 22.1667V15.1667H22.1667V22.1667C22.1667 22.4761 22.0438 22.7728 21.825 22.9916C21.6062 23.2104 21.3094 23.3333 21 23.3333Z"/>
                <path :fill="customizationForm.formTextColor" d="M9.33333 19.8333C9.97766 19.8333 10.5 19.311 10.5 18.6667C10.5 18.0223 9.97766 17.5 9.33333 17.5C8.689 17.5 8.16666 18.0223 8.16666 18.6667C8.16666 19.311 8.689 19.8333 9.33333 19.8333Z"/>
                <path :fill="customizationForm.formTextColor" d="M18.6667 17.5H14C13.6906 17.5 13.3938 17.6229 13.175 17.8417C12.9563 18.0605 12.8333 18.3572 12.8333 18.6667C12.8333 18.9761 12.9563 19.2728 13.175 19.4916C13.3938 19.7104 13.6906 19.8333 14 19.8333H18.6667C18.9761 19.8333 19.2728 19.7104 19.4916 19.4916C19.7104 19.2728 19.8333 18.9761 19.8333 18.6667C19.8333 18.3572 19.7104 18.0605 19.4916 17.8417C19.2728 17.6229 18.9761 17.5 18.6667 17.5Z"/>
              </svg>
              <div class="am-event-modal__mini-info-text">
                {{ eventDialogInfoRange.start }} - {{ eventDialogInfoRange.end }}
              </div>
            </div>
            <div v-if="capacityBlockVisibility" class="am-event-modal__mini-info-inner">
              <svg width="24" height="24" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path :fill="customizationForm.formTextColor" d="M9.99999 9.16667C10.6593 9.16667 11.3037 8.97117 11.8519 8.6049C12.4001 8.23863 12.8273 7.71803 13.0796 7.10895C13.3319 6.49986 13.3979 5.82964 13.2693 5.18303C13.1407 4.53643 12.8232 3.94249 12.357 3.47631C11.8908 3.01014 11.2969 2.69267 10.6503 2.56405C10.0037 2.43543 9.33347 2.50144 8.72438 2.75374C8.11529 3.00603 7.5947 3.43327 7.22842 3.98143C6.86215 4.5296 6.66666 5.17406 6.66666 5.83333C6.66666 6.71739 7.01785 7.56524 7.64297 8.19036C8.26809 8.81548 9.11593 9.16667 9.99999 9.16667ZM9.99999 4.16667C10.3296 4.16667 10.6519 4.26442 10.9259 4.44755C11.2 4.63069 11.4136 4.89099 11.5398 5.19553C11.6659 5.50007 11.6989 5.83518 11.6346 6.15849C11.5703 6.48179 11.4116 6.77876 11.1785 7.01185C10.9454 7.24493 10.6484 7.40367 10.3251 7.46798C10.0018 7.53229 9.66673 7.49928 9.36218 7.37313C9.05764 7.24699 8.79734 7.03337 8.61421 6.75928C8.43107 6.4852 8.33332 6.16297 8.33332 5.83333C8.33332 5.39131 8.50892 4.96738 8.82148 4.65482C9.13404 4.34226 9.55796 4.16667 9.99999 4.16667Z"/>
                <path :fill="customizationForm.formTextColor" d="M9.99999 10.8333C8.45289 10.8333 6.96916 11.4479 5.8752 12.5419C4.78124 13.6358 4.16666 15.1196 4.16666 16.6667C4.16666 16.8877 4.25445 17.0996 4.41073 17.2559C4.56701 17.4122 4.77898 17.5 4.99999 17.5C5.221 17.5 5.43297 17.4122 5.58925 17.2559C5.74553 17.0996 5.83332 16.8877 5.83332 16.6667C5.83332 15.5616 6.27231 14.5018 7.05371 13.7204C7.83511 12.939 8.89492 12.5 9.99999 12.5C11.1051 12.5 12.1649 12.939 12.9463 13.7204C13.7277 14.5018 14.1667 15.5616 14.1667 16.6667C14.1667 16.8877 14.2545 17.0996 14.4107 17.2559C14.567 17.4122 14.779 17.5 15 17.5C15.221 17.5 15.433 17.4122 15.5892 17.2559C15.7455 17.0996 15.8333 16.8877 15.8333 16.6667C15.8333 15.1196 15.2187 13.6358 14.1248 12.5419C13.0308 11.4479 11.5471 10.8333 9.99999 10.8333Z"/>
              </svg>
              <div class="am-event-modal__mini-info-text">
                {{ eventDialogInfo.maxCapacity - eventDialogInfo.places }}/{{ eventDialogInfo.maxCapacity }}
              </div>
            </div>
            <div v-if="locationBlockVisibility" class="am-event-modal__mini-info-inner">
              <svg width="24" height="24" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path :fill="customizationForm.formTextColor" d="M9.99999 1.66666C8.24337 1.66658 6.55771 2.3598 5.30936 3.59566C4.06102 4.83152 3.35089 6.51013 3.33333 8.26666C3.33333 12.8333 9.20833 17.9167 9.45833 18.1333C9.60927 18.2624 9.80137 18.3334 9.99999 18.3334C10.1986 18.3334 10.3907 18.2624 10.5417 18.1333C10.8333 17.9167 16.6667 12.8333 16.6667 8.26666C16.6491 6.51013 15.939 4.83152 14.6906 3.59566C13.4423 2.3598 11.7566 1.66658 9.99999 1.66666ZM9.99999 16.375C8.60833 15.05 4.99999 11.375 4.99999 8.26666C4.99999 6.94058 5.52678 5.66881 6.46446 4.73113C7.40214 3.79345 8.67391 3.26666 9.99999 3.26666C11.3261 3.26666 12.5978 3.79345 13.5355 4.73113C14.4732 5.66881 15 6.94058 15 8.26666C15 11.35 11.3917 15.05 9.99999 16.375Z"/>
                <path :fill="customizationForm.formTextColor" d="M10 5C9.42313 5 8.85923 5.17106 8.37958 5.49155C7.89994 5.81203 7.5261 6.26756 7.30535 6.80051C7.08459 7.33346 7.02683 7.9199 7.13937 8.48568C7.25191 9.05146 7.5297 9.57116 7.9376 9.97906C8.34551 10.387 8.86521 10.6648 9.43098 10.7773C9.99676 10.8898 10.5832 10.8321 11.1162 10.6113C11.6491 10.3906 12.1046 10.0167 12.4251 9.53708C12.7456 9.05744 12.9167 8.49353 12.9167 7.91667C12.9167 7.14312 12.6094 6.40125 12.0624 5.85427C11.5154 5.30729 10.7735 5 10 5ZM10 9.16667C9.75277 9.16667 9.5111 9.09336 9.30553 8.956C9.09997 8.81865 8.93976 8.62343 8.84515 8.39502C8.75054 8.16661 8.72578 7.91528 8.77402 7.6728C8.82225 7.43033 8.9413 7.2076 9.11611 7.03278C9.29093 6.85797 9.51366 6.73892 9.75613 6.69068C9.99861 6.64245 10.2499 6.66721 10.4784 6.76182C10.7068 6.85643 10.902 7.01664 11.0393 7.2222C11.1767 7.42777 11.25 7.66944 11.25 7.91667C11.25 8.24819 11.1183 8.56613 10.8839 8.80055C10.6495 9.03497 10.3315 9.16667 10 9.16667Z"/>
              </svg>
              <div class="am-event-modal__mini-info-text">
                {{ eventDialogInfo.location }}
              </div>
            </div>
          </div>
          <!-- /Event Info Mini Info -->

          <!-- Event Info Tags and Description -->
          <div v-if="eventDialogInfo.tags.length || eventDialogInfo.description" class="am-event-modal__tags-description">
            <!-- Event Info Tags -->
            <div v-if="eventDialogInfo.tags.length" class="am-event-modal__tags">
              <div v-for="tag in eventDialogInfo.tags" :key="tag.id" class="am-event-modal__tags-inner">
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path :fill="customizationForm.formTextColor" d="M9.70501 4.21246L6.1394 0.652183C6.04857 0.560822 5.92881 0.503881 5.80061 0.491109L0.60771 0.00233443C0.526363 -0.00514773 0.444367 0.00540834 0.367567 0.0332501C0.290767 0.0610919 0.221054 0.105534 0.163398 0.163408C0.105527 0.221068 0.061088 0.290786 0.033248 0.367591C0.005408 0.444395 -0.00514741 0.526397 0.00233428 0.607749L0.491078 5.80098C0.503849 5.92918 0.560787 6.04895 0.652142 6.13979L4.2122 9.70562C4.40314 9.89397 4.66046 9.99969 4.92865 10C5.19516 9.99943 5.45065 9.89363 5.63955 9.70562L9.70501 5.63991C9.89392 5.45042 10 5.19376 10 4.92618C10 4.65861 9.89392 4.40195 9.70501 4.21246ZM4.20109 4.21246C4.08462 4.32908 3.93618 4.40853 3.77455 4.44076C3.61292 4.473 3.44536 4.45656 3.29307 4.39353C3.14079 4.3305 3.01061 4.22372 2.91903 4.08669C2.82744 3.94965 2.77856 3.78853 2.77856 3.62371C2.77856 3.45889 2.82744 3.29777 2.91903 3.16074C3.01061 3.0237 3.14079 2.91692 3.29307 2.85389C3.44536 2.79086 3.61292 2.77443 3.77455 2.80666C3.93618 2.83889 4.08462 2.91834 4.20109 3.03496C4.35507 3.19 4.44148 3.39964 4.44148 3.61816C4.44148 3.83667 4.35507 4.04632 4.20109 4.20135V4.21246Z"/>
                </svg>
                <div class="am-event-modal__tags-text">
                  {{ tag.name }}
                </div>
              </div>
            </div>
            <!-- /Event Info Tags -->

            <!-- Event Info Description -->
            <div
              v-if="eventDialogInfo.description"
              class="am-event-modal__description"
              v-html="eventDialogInfo.description"
            >
            </div>
            <!-- /Event Info Description -->
          </div>
          <!-- /Event Info Tags and Description -->

          <!-- Event Info Periods -->
          <div class="am-event-modal__periods">
            <p>
              {{ labelsDisplay(labelSchedule, languageShortCode) || $root.labels.event_schedule }}
            </p>
            <div class="am-event-modal__periods-wrapper">
              <div v-for="period in eventDialogInfoPeriods" class="am-event-modal__periods-inner">
                <span class="am-event-modal__periods-week">{{ period.dayOfWeek }}</span>
                <span class="am-event-modal__periods-month">{{ period.dateOfMonth }}</span>
                <span class="am-event-modal__periods-time">{{ period.timeStart }}</span>
                <span class="am-event-modal__periods-time">{{ period.timeEnd }}</span>
              </div>
            </div>
          </div>
          <!-- /Event Info Periods -->

          <!-- Event Info Employees -->
          <div v-if="eventDialogInfo.providers.length" class="am-event-modal__employees">
            <p>
              {{ labelsDisplay(labelHostedBy, languageShortCode) || $root.labels.event_hosted_by }}
            </p>
            <div class="am-event-modal__employees-wrapper">
              <div v-for="employee in eventDialogInfo.providers" class="am-event-modal__employees-inner">
                <img :src="pictureLoad(employee, true)" @error="imageLoadError(employee, true)"/>
                <span class="am-event-modal__employees-name">{{ employee.firstName }}  {{ employee.lastName }}</span>
              </div>
            </div>
          </div>
          <!-- /Event Info Employees -->
        </div>
      </div>

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
import moment from 'moment'
import customizationFormHeader from '../parts/CustomizationFormHeader'
import customizeEditDialog from '../dialogs/CustomizeEditDialog'
import priceMixin from '../../../../js/common/mixins/priceMixin'
import imageMixin from '../../../../js/common/mixins/imageMixin'
import dateMixin from '../../../../js/common/mixins/dateMixin'

export default {
  name: 'infoEventCalendarForm',

  components: {
    customizationFormHeader,
    customizeEditDialog
  },

  mixins: [priceMixin, imageMixin, dateMixin],

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
    transferredStrings: {
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
    resetData: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },

  data () {
    return {
      resetFormData: this.resetData ? this.resetData[this.$options.name] : {},
      eventDialogInfo: {
        id: 1,
        name: 'Amelia Event 1',
        description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.',
        color: '#1A84EE',
        price: 10,
        periods: [
          {
            id: 1,
            eventId: 1,
            periodStart: `${moment().add(1, 'day').format('YYYY-MM-DD')}`,
            periodEnd: `${moment().add(9, 'day').format('YYYY-MM-DD')}`
          }
        ],
        maxCapacity: 5,
        places: 5,
        tags: [
          {
            id: 1,
            eventId: 1,
            name: 'Tag 1'
          },
          {
            id: 2,
            eventId: 1,
            name: 'Tag 2'
          },
          {
            id: 3,
            eventId: 1,
            name: 'Tag 3'
          }
        ],
        providers: [
          {
            id: 1,
            type: 'provider',
            firstName: 'Isadore',
            lastName: 'Mathew'
          },
          {
            id: 2,
            type: 'provider',
            firstName: 'Monna',
            lastName: 'Fisher'
          },
          {
            id: 3,
            type: 'provider',
            firstName: 'Beverly',
            lastName: 'Carleton'
          },
          {
            id: 4,
            type: 'provider',
            firstName: 'Lincoln',
            lastName: 'Lynwood'
          },
          {
            id: 5,
            type: 'provider',
            firstName: 'Catherina',
            lastName: 'Amber'
          }
        ],
        location: 'Location 1'
      },
      eventDialogInfoRange: {},
      eventDialogInfoPeriods: [],
      labelBookNow: this.formStepData.labels.event_book_now,
      labelSchedule: this.formStepData.labels.event_schedule,
      labelHostedBy: this.formStepData.labels.event_hosted_by,
      rangeBlockVisibility: this.formStepData.parts.event_range_block.visibility,
      capacityBlockVisibility: this.formStepData.parts.event_capacity_block.visibility,
      locationBlockVisibility: this.formStepData.parts.event_location_block.visibility,
      priceBlockVisibility: this.formStepData.parts.event_price_block.visibility
    }
  },

  created () {
    this.eventDialogDataFormatter()
  },

  mounted () {
    this.eventDialogInfoPeriods = [
      {
        dayOfWeek: moment().add(1, 'day').format('ddd'),
        dateOfMonth: moment().add(1, 'day').format('MMM DD'),
        timeStart: this.getFrontedFormattedTime('18:00:00'),
        timeEnd: this.getFrontedFormattedTime('19:30:00')
      },
      {
        dayOfWeek: moment().add(2, 'day').format('ddd'),
        dateOfMonth: moment().add(2, 'day').format('MMM DD'),
        timeStart: this.getFrontedFormattedTime('18:00:00'),
        timeEnd: this.getFrontedFormattedTime('19:30:00')
      },
      {
        dayOfWeek: moment().add(3, 'day').format('ddd'),
        dateOfMonth: moment().add(3, 'day').format('MMM DD'),
        timeStart: this.getFrontedFormattedTime('18:00:00'),
        timeEnd: this.getFrontedFormattedTime('19:30:00')
      },
      {
        dayOfWeek: moment().add(4, 'day').format('ddd'),
        dateOfMonth: moment().add(4, 'day').format('MMM DD'),
        timeStart: this.getFrontedFormattedTime('18:00:00'),
        timeEnd: this.getFrontedFormattedTime('19:30:00')
      },
      {
        dayOfWeek: moment().add(5, 'day').format('ddd'),
        dateOfMonth: moment().add(5, 'day').format('MMM DD'),
        timeStart: this.getFrontedFormattedTime('18:00:00'),
        timeEnd: this.getFrontedFormattedTime('19:30:00')
      },
      {
        dayOfWeek: moment().add(6, 'day').format('ddd'),
        dateOfMonth: moment().add(6, 'day').format('MMM DD'),
        timeStart: this.getFrontedFormattedTime('18:00:00'),
        timeEnd: this.getFrontedFormattedTime('19:30:00')
      },
      {
        dayOfWeek: moment().add(7, 'day').format('ddd'),
        dateOfMonth: moment().add(7, 'day').format('MMM DD'),
        timeStart: this.getFrontedFormattedTime('18:00:00'),
        timeEnd: this.getFrontedFormattedTime('19:30:00')
      },
      {
        dayOfWeek: moment().add(8, 'day').format('ddd'),
        dateOfMonth: moment().add(8, 'day').format('MMM DD'),
        timeStart: this.getFrontedFormattedTime('18:00:00'),
        timeEnd: this.getFrontedFormattedTime('19:30:00')
      },
      {
        dayOfWeek: moment().add(9, 'day').format('ddd'),
        dateOfMonth: moment().add(9, 'day').format('MMM DD'),
        timeStart: this.getFrontedFormattedTime('18:00:00'),
        timeEnd: this.getFrontedFormattedTime('19:30:00')
      }
    ]
  },

  methods: {
    labelsDisplay (label, language = '') {
      if (!language) {
        return label.value
      }

      return label.translations[language]
    },

    resetForm () {
      let resetObj = {}
      resetObj.data = this.resetFormData
      resetObj.formStep = this.$options.name
      this.$emit('resetForm', resetObj)
    },

    saveFormEdit (dataObj) {
      let formObj = {}
      formObj[this.$options.name] = JSON.parse(JSON.stringify(dataObj))
      this.$emit('saveEdit', formObj)
    },

    eventDialogDataFormatter () {
      let dateRangeArray = []
      this.eventDialogInfoRange = {}
      this.eventDialogInfo.periods.forEach(item => {
        dateRangeArray.push(moment(item.periodStart).format('YYYY-MM-DD'), moment(item.periodEnd).format('YYYY-MM-DD'))
      })
      dateRangeArray = dateRangeArray.sort()
      this.eventDialogInfoRange.start = this.getFrontedFormattedDate(dateRangeArray[0])
      this.eventDialogInfoRange.end = this.getFrontedFormattedDate(dateRangeArray[dateRangeArray.length - 1])
    },

    colorTransparency (color, opacity = 1) {
      if (color.indexOf('rgba') > -1) {
        color = color.substr(5).split(')')[0].split(',')
        let colorObject = {
          r: color[0].replace(' ', ''),
          g: color[1].replace(' ', ''),
          b: color[2].replace(' ', ''),
          a: opacity !== 1 ? opacity : color[3].replace(' ', '')
        }

        return `rgba(${colorObject.r}, ${colorObject.g}, ${colorObject.b}, ${colorObject.a})`
      }

      if (color.indexOf('#') > -1) {
        color = color.substr(1)
        let colorArray = []
        for (let i = 0; i < (color.length / 2); i++) {
          let a = color.substring(i * 2, (i + 1) * 2)
          a = parseInt(a, 16)
          colorArray.push(a)
        }

        return `rgba(${colorArray[0]}, ${colorArray[1]}, ${colorArray[2]}, ${opacity})`
      }

      return color
    },

    lightenDarkenColor (color, amt) {
      if (color.indexOf('#') > -1) {
        color = color.slice(1)

        let num = parseInt(color, 16)

        let r = (num >> 16) + amt

        if (r > 255) r = 255
        else if (r < 0) r = 0

        let g = ((num >> 8) & 0x00FF) + amt

        if (g > 255) g = 255
        else if (g < 0) g = 0

        let b = (num & 0x0000FF) + amt

        if (b > 255) b = 255
        else if (b < 0) b = 0

        return `rgba(${r}, ${g}, ${b}, 1)`
      }

      if (color.indexOf('rgba') > -1) {
        color = color
          .substr(5)
          .split(')')[0]
          .split(',')
          .map((elm, index) => {
            if (index < 3) {
              let a = parseInt(elm) + amt
              if (a > 255) return 255
              else if (a < 0) return 0
              return a
            } else {
              return Number(elm)
            }
          })

        return `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${color[3]})`
      }
    }
  },

  computed: {
    cssVars () {
      return {
        // global colors - start
        '--am-primary-color': this.customization.globalColors.primaryColor,
        // global colors - end

        // background color - start
        '--amc-background-color': this.customizationForm.formBackgroundColor,
        // background color - end

        // text color - start
        '--amc-text-color': this.customizationForm.formTextColor,
        '--amc-text-color-opacity60': this.colorTransparency(this.customizationForm.formTextColor, 0.6)
        // text color - end
      }
    }
  },

  watch: {
    'formStepData' () {
      this.labelBookNow = this.formStepData.labels.event_book_now
      this.labelSchedule = this.formStepData.labels.event_schedule
      this.labelHostedBy = this.formStepData.labels.event_hosted_by
      this.rangeBlockVisibility = this.formStepData.parts.event_range_block.visibility
      this.capacityBlockVisibility = this.formStepData.parts.event_capacity_block.visibility
      this.locationBlockVisibility = this.formStepData.parts.event_location_block.visibility
      this.priceBlockVisibility = this.formStepData.parts.event_price_block.visibility
    }
  }
}
</script>

<style lang="less">
// Colors
@primaryColor: var(--am-primary-color);
@formBackgroundColor: var(--amc-background-color);
@formTextColor: var(--amc-text-color);
@formTextColorOpacity60: var(--amc-text-color-opacity60);

.am-customize-page {
  .am-event {
    &-modal {
      &__wrapper.am-template-wrapper {
        .am-event {
          &-modal {
            &__inner {
              background-color: @formBackgroundColor;
            }

            &__header {
              &-title {
                &-text {
                  color: @formTextColor;
                }
              }
            }

            &__mini-info {
              &-text {
                color: @formTextColor;
              }
            }

            &__tags {
              &-inner {
                background-color: rgba(103, 125, 154, 0.3);
              }

              &-text {
                color: @formTextColor;
              }
            }

            &__description {
              color: @formTextColor;
              * {
                color: @formTextColor;
              }
            }

            &__periods {
              p, &-week, &-month {
                color: @formTextColor;
              }

              &-time {
                color: @formTextColorOpacity60;
              }
            }

            &__employees {
              p, &-name {
                color: @formTextColor;
              }
            }
          }
        }
      }
    }
  }
}
</style>
