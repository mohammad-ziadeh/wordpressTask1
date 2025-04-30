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
        <div class="am-event-modal__header">
          <div class="am-event-modal__header-title am-event-modal__header-title-standard">
            <span class="am-event-modal__header-title-subtext">
              {{  labelsDisplay(labelBookEvent, languageShortCode) || $root.labels.event_book_event }}
            </span>
            <span class="am-event-modal__header-title-text">
              {{ eventDialogInfo.name }}
            </span>
            <!-- Event Info Mini Info -->
            <div v-if="rangeBlockVisibility || capacityBlockVisibility || locationBlockVisibility" class="am-event-modal__mini-info">
              <div v-if="rangeBlockVisibility" class="am-event-modal__mini-info-inner">
                <svg class="am-event-modal__mini-info-svg">
                  <use :href="$root.getUrl + 'public/img/am-customize-calendar-calendar.svg#am-svg'"></use>
                </svg>
                <div class="am-event-modal__mini-info-text">
                  {{ eventDialogInfoRange.start }} - {{ eventDialogInfoRange.end }}
                </div>
              </div>
              <div v-if="capacityBlockVisibility" class="am-event-modal__mini-info-inner">
                <svg class="am-event-modal__mini-info-svg">
                  <use :href="$root.getUrl + 'public/img/am-customize-calendar-spots.svg#am-svg'"></use>
                </svg>
                <div class="am-event-modal__mini-info-text">
                  {{ eventDialogInfo.maxCapacity - eventDialogInfo.places }}/{{ eventDialogInfo.maxCapacity }}
                </div>
              </div>
              <div v-if="locationBlockVisibility" class="am-event-modal__mini-info-inner">
                <svg class="am-event-modal__mini-info-svg">
                  <use :href="$root.getUrl + 'public/img/am-customize-calendar-pin.svg#am-svg'"></use>
                </svg>
                <div class="am-event-modal__mini-info-text">
                  {{ eventDialogInfo.location }}
                </div>
              </div>
            </div>
            <!-- /Event Info Mini Info -->
          </div>
        </div>

        <div class="am-event-modal__body">
          <div class="am-event-modal__invite-wrapper">
            <svg class="am-event-modal__invite-svg" :style="{'fill': eventDialogInfo.color}">
              <use :href="$root.getUrl + 'public/img/am-calendar-invite-person.svg#persons'"></use>
            </svg>
            <el-form>
              <el-form-item :label="labelsDisplay(labelEventManyPeople, languageShortCode) || $root.labels.event_many_people">
                <el-input-number
                  v-model="places"
                  :min="1"
                  :max="eventDialogInfo.places"
                  size="small"
                  type="number"
                >
                </el-input-number>
              </el-form-item>

              <el-form-item>
                <el-button>
                  {{$root.labels.continue}}
                </el-button>
              </el-form-item>
            </el-form>
          </div>
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
  name: 'inviteEventCalendarForm',

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
      places: 1,
      resetFormData: this.resetData ? this.resetData[this.$options.name] : {},
      eventDialogInfo: {
        id: 1,
        name: 'Amelia Event 1',
        color: '#1A84EE',
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
        location: 'Location 1'
      },
      eventDialogInfoRange: {},
      labelBookEvent: this.formStepData.labels.event_book_event,
      labelEventManyPeople: this.formStepData.labels.event_many_people,
      rangeBlockVisibility: this.formStepData.parts.event_range_block.visibility,
      capacityBlockVisibility: this.formStepData.parts.event_capacity_block.visibility,
      locationBlockVisibility: this.formStepData.parts.event_location_block.visibility
    }
  },

  created () {
    this.eventDialogDataFormatter()
  },

  mounted () {},

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
        '--am-primary-color': this.customization.primaryColor,
        '--am-event-color': this.eventDialogInfo.color,
        '--amc-background-color': this.customizationForm.formBackgroundColor,
        '--amc-text-color': this.customizationForm.formTextColor,
        '--amc-input-color': this.customizationForm.formInputColor,
        '--amc-input-text-color': this.customizationForm.formInputTextColor
      }
    }
  },

  watch: {
    'formStepData' () {
      this.labelBookEvent = this.formStepData.labels.event_book_event
      this.labelEventManyPeople = this.formStepData.labels.event_many_people
      this.rangeBlockVisibility = this.formStepData.parts.event_range_block.visibility
      this.capacityBlockVisibility = this.formStepData.parts.event_capacity_block.visibility
      this.locationBlockVisibility = this.formStepData.parts.event_location_block.visibility
    }
  }
}
</script>

<style lang="less">
// Colors
@primaryColor: var(--am-primary-color);
@eventColor: var(--am-event-color);
@formBackgroundColor: var(--amc-background-color);
@formTextColor: var(--amc-text-color);
@formInputColor: var(--amc-input-color);
@formInputTextColor: var(--amc-input-text-color);

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
                &-text, &-subtext {
                  color: @formTextColor;
                }
              }
            }

            &__mini-info {
              &-text {
                color: @formTextColor;
              }

              &-svg {
                fill: @formTextColor;
                width: 24px;
                height: 24px;

                #bla {
                  fill: red;
                }
              }
            }

            &__invite {
              &-wrapper {
                .el-form-item {
                  &__label {
                    color: @formTextColor;
                  }
                }

                .el-input {
                  &__inner {
                    background-color: @formInputColor;
                    color: @formInputTextColor;
                    border-color: #e2e6ec !important;
                  }

                  &-number {
                    &__decrease, &__increase {
                      background-color: @formInputColor;
                      color: @formInputTextColor;
                    }
                  }
                }

                .el-button {
                  color: #FFFFFF;
                  border-color: @eventColor;
                  background-color: @eventColor;
                }
              }
            }
          }
        }
      }
    }
  }
}
</style>
