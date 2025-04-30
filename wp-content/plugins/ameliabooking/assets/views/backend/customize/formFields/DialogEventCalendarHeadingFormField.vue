<template>
  <el-row :gutter="customizationEdit.editable ? 48 : 24">
    <el-col :sm="24">
      <div
        v-show="customizationEdit.editable ? customizationEdit.editable : componentDisplay()"
        class="am-customize-field"
        :class="{'editable': customizationEdit.editable}"
        :style="{borderColor: customizationEdit.reverseBackgroundColorForm}"
      >
        <div class="am-event-modal__header">
          <div class="am-event-modal__header-title am-event-modal__header-title-standard">
            <span class="am-event-modal__header-title-subtext" :style="{color: customizationForm.formTextColor}">
              {{  labelsDisplay(labelBookEvent, languageShortCode) || $root.labels.event_book_event }}
            </span>
            <span class="am-event-modal__header-title-text" :style="{color: customizationForm.formTextColor}">
              {{ eventDialogInfo.name }}
            </span>
            <!-- Event Info Mini Info -->
            <div v-if="rangeBlockVisibility || capacityBlockVisibility || locationBlockVisibility" class="am-event-modal__mini-info">
              <div v-if="rangeBlockVisibility" class="am-event-modal__mini-info-inner">
                <svg class="am-event-modal__mini-info-svg" :style="{fill: customizationForm.formTextColor}">
                  <use :xlink:href="$root.getUrl + 'public/img/am-customize-calendar-calendar.svg#am-svg'"></use>
                </svg>
                <div class="am-event-modal__mini-info-text" :style="{color: customizationForm.formTextColor}">
                  {{ eventDialogInfoRange.start }} - {{ eventDialogInfoRange.end }}
                </div>
              </div>
              <div v-if="capacityBlockVisibility" class="am-event-modal__mini-info-inner">
                <svg class="am-event-modal__mini-info-svg" :style="{fill: customizationForm.formTextColor}">
                  <use :xlink:href="$root.getUrl + 'public/img/am-customize-calendar-spots.svg#am-svg'"></use>
                </svg>
                <div class="am-event-modal__mini-info-text" :style="{color: customizationForm.formTextColor}">
                  {{ eventDialogInfo.maxCapacity - eventDialogInfo.places }}/{{ eventDialogInfo.maxCapacity }}
                </div>
              </div>
              <div v-if="locationBlockVisibility" class="am-event-modal__mini-info-inner">
                <svg class="am-event-modal__mini-info-svg" :style="{fill: customizationForm.formTextColor}">
                  <use :xlink:href="$root.getUrl + 'public/img/am-customize-calendar-pin.svg#am-svg'"></use>
                </svg>
                <div class="am-event-modal__mini-info-text" :style="{color: customizationForm.formTextColor}">
                  {{ eventDialogInfo.location }}
                </div>
              </div>
            </div>
            <!-- /Event Info Mini Info -->
          </div>
        </div>

        <!-- Edit Dialog -->
        <customize-edit-dialog
          :form-field="formField"
          :language-short-code="languageShortCode"
          @saveEdit="saveFormFiledEdit"
        >
          <template v-slot:fieldEdit>
            <span v-show="customizationEdit.editable" class="am-customize-field__edit">
              <img :src="$root.getUrl + 'public/img/am-customize-icon-edit.svg'" />
            </span>
          </template>
        </customize-edit-dialog>
        <!-- /Edit Dialog -->
      </div>
    </el-col>
  </el-row>
</template>

<script>
import moment from 'moment'
import imageMixin from '../../../../js/common/mixins/imageMixin'
import dateMixin from '../../../../js/common/mixins/dateMixin'
import customizeEditDialog from '../dialogs/CustomizeEditDialog'

export default {
  name: 'dialogEventCalendarHeadingFormField',

  components: {
    customizeEditDialog
  },

  props: {
    languageShortCode: {
      type: String,
      default: ''
    },
    customizationEdit: {
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
    formField: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },

  data () {
    return {
      eventDialogInfo: {
        id: 1,
        name: 'Amelia Event 1',
        color: '#9527a8',
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
      labelBookEvent: this.formField.labels.event_book_event,
      rangeBlockVisibility: this.formField.parts.event_range_block.visibility,
      capacityBlockVisibility: this.formField.parts.event_capacity_block.visibility,
      locationBlockVisibility: this.formField.parts.event_location_block.visibility
    }
  },

  mixins: [imageMixin, dateMixin],

  created () {
    this.eventDialogDataFormatter()
  },

  mounted () {},

  methods: {
    componentDisplay () {
      if (this.formField.hasOwnProperty('visibility')) {
        return this.formField.visibility
      }

      return true
    },

    labelsDisplay (label, language = '') {
      if (!language) {
        return label.value
      }

      return label.translations[language]
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

    saveFormFiledEdit (objData) {
      let fieldData = {}
      fieldData['itemsStatic'] = {}
      fieldData['itemsStatic'][this.$options.name] = JSON.parse(JSON.stringify(objData))
      this.$emit('saveEdit', fieldData)
    }
  },

  watch: {
    'formField' () {
      this.labelBookEvent = this.formField.labels.event_book_event
      this.rangeBlockVisibility = this.formField.parts.event_range_block.visibility
      this.capacityBlockVisibility = this.formField.parts.event_capacity_block.visibility
      this.locationBlockVisibility = this.formField.parts.event_location_block.visibility
    }
  }
}
</script>
