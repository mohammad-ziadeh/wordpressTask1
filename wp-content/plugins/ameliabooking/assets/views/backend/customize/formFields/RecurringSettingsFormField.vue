<template>
  <el-form label-position="top">
    <div
      v-show="customizationEdit.editable ? customizationEdit.editable : componentDisplay()"
      class="am-customize-field"
      :class="{'editable': customizationEdit.editable}"
      :style="{borderColor: customizationEdit.reverseBackgroundColorForm}"
    >
      <el-row :gutter="24">
        <el-col :sm="12">
          <el-form-item>
            <template slot="label">
              <span :style="{ 'color': customizationEdit.useGlobalColors ? customizationForm.textColorOnBackground : customizationForm.formTextColor }">
                <template v-if="!languageShortCode">
                  {{ labelRecurringRepeat.value || $root.labels.recurring_repeat }}
                </template>
                <template v-else>
                  {{ labelRecurringRepeat.translations[languageShortCode] || $root.labels.recurring_repeat }}
                </template>
              </span>
            </template>
            <el-select
              v-model="recurringRepeat"
              :popper-class="'am-dropdown'"
              :style="{ backgroundColor: customizationForm.formInputColor, color: customizationForm.formInputTextColor, borderColor: selectInputFocus ? customization.globalColors.primaryColor : '#C0C4CC' }"
              @focus="inputFocus"
              @change="changeRepetitionType"
              placeholder=""
            >
              <el-option
                v-for="item in recurringRepeatOptions"
                :key="item.name"
                :label="item.name"
                :value="item.name"
                :style="{
                  backgroundColor: customizationForm.formDropdownColor,
                  color: item.name === recurringRepeat ? customization.globalColors.primaryColor : customizationForm.formDropdownTextColor,
                  fontFamily: customization.font
                }"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :sm="12">
          <el-form-item>
            <template slot="label">
              <span :style="{ 'color': customizationEdit.useGlobalColors ? customizationForm.textColorOnBackground : customizationForm.formTextColor }">
                <template v-if="!languageShortCode">
                {{ labelRecurringInterval.value || $root.labels.recurring_every }}
                </template>
                <template v-else>
                  {{ labelRecurringInterval.translations[languageShortCode] || $root.labels.recurring_every }}
                </template>
              </span>
            </template>
            <el-select
              v-model="recurringInterval"
              :popper-class="'am-dropdown'"
              :style="{ backgroundColor: customizationForm.formInputColor, color: customizationForm.formInputTextColor, borderColor: selectInputFocus ? customization.globalColors.primaryColor : '#C0C4CC' }"
              @focus="inputFocus"
              placeholder=""
            >
              <el-option
                v-for="item in recurringIntervalOptions[recurringRepeat]"
                :key="item.name"
                :label="item.name"
                :value="item.name"
                :style="{
                  backgroundColor: customizationForm.formDropdownColor,
                  color: item.name === recurringInterval ? customization.globalColors.primaryColor : customizationForm.formDropdownTextColor,
                  fontFamily: customization.font
                }"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="24" v-if="recurringRepeat === $root.labels.repeat_weekly">
        <el-col :sm="24">
          <el-form-item>
            <template slot="label">
              <span :style="{ 'color': customizationEdit.useGlobalColors ? customizationForm.textColorOnBackground : customizationForm.formTextColor }">
                <template v-if="!languageShortCode">
                  {{ labelRecurringOn.value || $root.labels.recurring_on }}
                </template>
                <template v-else>
                  {{ labelRecurringOn.translations[languageShortCode] || $root.labels.recurring_on }}
                </template>
              </span>
            </template>
            <el-checkbox-group
              v-model="weekDaysSelected"
              :border="true"
              size="small"
            >
              <el-checkbox-button
                v-for="(weekDay, index) in weekDays"
                :label="index"
                :key="index"
                :disabled="!weekDay.enabled"
                :style="{backgroundColor: weekDaysSelected.indexOf(index) > -1 ? customization.globalColors.primaryColor : customizationForm.formInputColor, color: customizationForm.formInputTextColor}"
              >
                {{weekDay.label}}
              </el-checkbox-button>
            </el-checkbox-group>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="24" v-if="recurringRepeat === $root.labels.repeat_monthly">
        <el-col :sm="24">
          <el-form-item>
            <template slot="label">
              <span :style="{ 'color': customizationEdit.useGlobalColors ? customizationForm.textColorOnBackground : customizationForm.formTextColor }">
                <template v-if="!languageShortCode">
                  {{ labelRecurringInterval.value || $root.labels.recurring_every }}
                </template>
                <template v-else>
                  {{ labelRecurringInterval.translations[languageShortCode] || $root.labels.recurring_every }}
                </template>
              </span>
            </template>
            <el-select
              v-model="monthSelected"
              :popper-class="'am-dropdown'"
              :style="{ backgroundColor: customizationForm.formInputColor, color: customizationForm.formInputTextColor, borderColor: selectInputFocus ? customization.globalColors.primaryColor : '#C0C4CC' }"
              @focus="inputFocus"
              placeholder=""
            >
              <el-option
                v-for="item in monthSelectedOptions"
                :key="item.name"
                :label="item.name"
                :value="item.name"
                :style="{
                  backgroundColor: customizationForm.formDropdownColor,
                  color: item.name === monthSelected ? customization.globalColors.primaryColor : customizationForm.formDropdownTextColor,
                  fontFamily: customization.font
                }"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="24">
        <el-col :sm="12" class="v-calendar-column">
          <el-form-item>
            <template slot="label">
              <span :style="{ 'color': customizationEdit.useGlobalColors ? customizationForm.textColorOnBackground : customizationForm.formTextColor }">
                <template v-if="!languageShortCode">
                  {{ labelRecurringUntil.value || $root.labels.recurring_until }}
                </template>
                <template v-else>
                  {{ labelRecurringUntil.translations[languageShortCode] || $root.labels.recurring_until }}
                </template>
              </span>
            </template>
            <v-date-picker
              v-model="selectedDate"
              mode='single'
              popover-align="center"
              popover-direction="bottom"
              popover-visibility="focus"
              input-class='el-input__inner'
              :is-required=true
              :is-expanded=false
              :is-double-paned=false
              :show-day-popover=false
              :input-props='{class: "el-input__inner"}'
              :tint-color='customization.globalColors.primaryColor'
              :formats="vCalendarFormats"
              :style="{ backgroundColor: customizationForm.formInputColor, color: customizationForm.formInputTextColor, borderColor: selectInputFocus ? customization.globalColors.primaryColor : '#C0C4CC' }"
            >
            </v-date-picker>
          </el-form-item>
        </el-col>

        <el-col :sm="12">
          <el-form-item>
            <template slot="label">
              <span :style="{ 'color': customizationEdit.useGlobalColors ? customizationForm.textColorOnBackground : customizationForm.formTextColor }">
                <template v-if="!languageShortCode">
                  {{ labelRecurringTimes.value || $root.labels.recurring_times }}
                </template>
                <template v-else>
                  {{ labelRecurringTimes.translations[languageShortCode] || $root.labels.recurring_times }}
                </template>
              </span>
            </template>
            <el-input-number
              v-model="recurringTimes"
              :min="1"
              :style="{ backgroundColor: customizationForm.formInputColor, color: customizationForm.formInputTextColor, borderColor: selectInputFocus ? customization.globalColors.primaryColor : '#C0C4CC' }"
              @focus="inputFocus"
            >
            </el-input-number>
          </el-form-item>
        </el-col>
      </el-row>
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
  </el-form>
</template>

<script>
import moment from 'moment'
import dateMixin from '../../../../js/common/mixins/dateMixin'
import customizeEditDialog from '../dialogs/CustomizeEditDialog'

export default {
  name: 'recurringSettingsFormField',

  components: {
    customizeEditDialog
  },

  props: {
    languageShortCode: {
      type: String,
      default: ''
    },
    customization: {
      type: Object
    },
    customizationForm: {
      type: Object,
      default: () => {
        return {}
      }
    },
    customizationEdit: {
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

  mixins: [dateMixin],

  data () {
    return {
      recurringRepeat: this.$root.labels.repeat_daily,
      recurringRepeatOptions: [
        {name: this.$root.labels.repeat_daily},
        {name: this.$root.labels.repeat_weekly},
        {name: this.$root.labels.repeat_monthly}
      ],
      recurringInterval: this.$root.labels.recurring_day,
      recurringIntervalOptions: {
        Daily: [
          {name: this.$root.labels.recurring_day},
          {name: `2 ${this.$root.labels.recurring_days}`},
          {name: `3 ${this.$root.labels.recurring_days}`},
          {name: `4 ${this.$root.labels.recurring_days}`},
          {name: `5 ${this.$root.labels.recurring_days}`},
          {name: `6 ${this.$root.labels.recurring_days}`}
        ],
        Weekly: [
          {name: this.$root.labels.recurring_week},
          {name: `2 ${this.$root.labels.recurring_weeks}`},
          {name: `3 ${this.$root.labels.recurring_weeks}`},
          {name: `4 ${this.$root.labels.recurring_weeks}`},
          {name: `5 ${this.$root.labels.recurring_weeks}`},
          {name: `6 ${this.$root.labels.recurring_weeks}`}
        ],
        Monthly: [
          {name: this.$root.labels.recurring_month},
          {name: `2 ${this.$root.labels.recurring_months}`},
          {name: `3 ${this.$root.labels.recurring_months}`},
          {name: `4 ${this.$root.labels.recurring_months}`},
          {name: `5 ${this.$root.labels.recurring_months}`},
          {name: `6 ${this.$root.labels.recurring_months}`}
        ]
      },
      weekDays: [],
      weekDaysSelected: [],
      monthSelected: '',
      monthSelectedOptions: [
        {name: 'undefined'},
        {name: 'First Wednesday'},
        {name: 'Second Wednesday'},
        {name: 'Third Wednesday'},
        {name: 'Fourth Wednesday'},
        {name: 'Last Wednesday'}
      ],
      selectedDate: this.$moment().toDate(),
      recurringTimes: 1,
      selectInputFocus: false,
      labelRecurringRepeat: this.formField.labels.recurring_repeat,
      labelRecurringInterval: this.formField.labels.recurring_every,
      labelRecurringOn: this.formField.labels.recurring_on,
      labelRecurringUntil: this.formField.labels.recurring_until,
      labelRecurringTimes: this.formField.labels.recurring_times
    }
  },

  created () {
    this.weekDays = []

    for (let i = 0; i < 7; i++) {
      this.weekDays.push({
        label: moment().isoWeekday(i + 1).format('dd'),
        enabled: !(i > 4)
      })
    }
  },

  mounted () {},

  methods: {
    inputFocus () {
      this.selectInputFocus = true
    },

    componentDisplay () {
      if (this.formField.hasOwnProperty('visibility')) {
        return this.formField.visibility
      }

      return true
    },

    saveFormFiledEdit (objData) {
      let fieldData = {}
      fieldData['itemsStatic'] = {}
      fieldData['itemsStatic'][this.$options.name] = JSON.parse(JSON.stringify(objData))
      this.$emit('saveEdit', fieldData)
    },

    changeRepetitionType (type) {
      this.recurringInterval = this.recurringIntervalOptions[type][0].name
    }
  },

  watch: {
    'formField' () {
      this.labelRecurringRepeat = this.formField.labels.recurring_repeat
      this.labelRecurringInterval = this.formField.labels.recurring_every
      this.labelRecurringOn = this.formField.labels.recurring_on
      this.labelRecurringUntil = this.formField.labels.recurring_until
      this.labelRecurringTimes = this.formField.labels.recurring_times
    }
  }
}
</script>
