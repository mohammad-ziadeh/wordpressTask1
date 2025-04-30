<template>
  <!-- Service -->
  <div
    class="am-customize-field"
    :class="{'editable': customizationEdit.editable}"
    :style="{borderColor: customizationEdit.reverseBackgroundColorForm}"
  >
    <el-row
      v-show="formField.addToCalendarVisibility"
      type="flex"
      justify="center"
      :style="cssVars"
    >
      <el-col :sm="12">
        <el-select
          v-model="calendarIndex"
          :popper-class="'am-dropdown'"
          :style="{ backgroundColor: customizationForm.formInputColor, color: customizationForm.formInputTextColor, borderColor: selectInputFocus ? customization.globalColors.primaryColor : '#C0C4CC' }"
          :placeholder="$root.labels.select_calendar"
          @focus="inputFocus"
        >
          <el-option
            v-for="item in calendars"
            :key="item.name"
            :label="item.name"
            :value="item.name"
            :style="{
              backgroundColor: customizationForm.formDropdownColor,
              color: item.name === calendarIndex ? (customizeDisplay === 'event' ? eventColor : customization.globalColors.primaryColor) : customizationForm.formDropdownTextColor,
              fontFamily: customization.font
            }"
          >
          </el-option>
        </el-select>
      </el-col>
    </el-row>

    <br>

    <!-- Button -->
    <div
      v-show="formField.addToCalendarVisibility"
      class="el-button el-button--primary calendar-link"
      :class="{'is-disabled' : calendarIndex === null}"
      :style="{
        backgroundColor: customizeDisplay === 'event' ? eventColor : customization.globalColors.primaryColor,
        borderColor: customizeDisplay === 'event' ? eventColor : customization.globalColors.primaryColor
      }"
      @mouseenter="mouseEnter"
      @mouseleave="mouseLeave"
    >
      <span :style="{color: customization.globalColors.textColorOnBackground}">
        {{ $root.labels.add_to_calendar }}
      </span>
    </div>

    <!-- Button Redirect URL After Appointment -->
    <div
      class="el-button el-button--primary redirect-link"
      :style="{
        backgroundColor: customizeDisplay === 'event' ? eventColor : customization.globalColors.primaryColor,
        borderColor: customizeDisplay === 'event' ? eventColor : customization.globalColors.primaryColor
      }"
      @mouseenter="mouseEnter"
      @mouseleave="mouseLeave"
    >
      <a :style="{color: customization.globalColors.textColorOnBackground}">
        {{ $root.labels.finish_appointment }}
      </a>
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
  <!-- /Service -->
</template>

<script>
import cssColorManipulationMixin from '../../../../js/common/mixins/cssColorManipulationMixin'
import customizeEditDialog from '../dialogs/CustomizeEditDialog'

export default {
  name: 'addToCalendarFormField',

  components: {
    customizeEditDialog
  },

  mixins: [cssColorManipulationMixin],

  props: {
    eventColor: {
      type: String,
      default: '#1A84EE'
    },
    languageShortCode: {
      type: String,
      default: ''
    },
    customization: {
      type: Object
    },
    customizeDisplay: {
      type: String,
      default: ''
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

  data () {
    return {
      calendarIndex: '',
      calendars: [
        {
          name: 'Google Calendar'
        },
        {
          name: 'Yahoo! Calendar'
        },
        {
          name: 'iCal Calendar'
        },
        {
          name: 'Outlook Calendar'
        }
      ],
      selectInputFocus: false
    }
  },

  methods: {
    mouseEnter (elem) {
      if (this.customizeDisplay === 'event') {
        let style = {
          borderColor: this.colorTransparency(this.eventColor, 0.6),
          backgroundColor: this.colorTransparency(this.eventColor, 0.6)
        }

        Object.assign(elem.target.style, style)

        return false
      }

      let style = {
        borderColor: this.colorTransparency(this.customization.globalColors.primaryColor, 0.6),
        backgroundColor: this.colorTransparency(this.customization.globalColors.primaryColor, 0.6)
      }

      Object.assign(elem.target.style, style)
    },

    mouseLeave (elem) {
      if (this.customizeDisplay === 'event') {
        let style = {
          borderColor: this.eventColor,
          backgroundColor: this.eventColor
        }

        Object.assign(elem.target.style, style)

        return false
      }

      let style = {
        borderColor: this.customization.globalColors.primaryColor,
        backgroundColor: this.customization.globalColors.primaryColor
      }

      Object.assign(elem.target.style, style)
    },

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
    }
  },

  computed: {
    cssVars () {
      return {
        // input text color - start
        '--input-text-color-opacity60': this.colorTransparency(this.customizationForm.formInputTextColor, 0.6)
        // input text color - end
      }
    }
  }
}
</script>

<style lang="less" scoped>
@inputTextColorOpacity60: var(--input-text-color-opacity60);

/deep/.el-select {
  .el-input {
    &__inner {
      &::placeholder {
        color: @inputTextColorOpacity60;
      }

      &::-webkit-input-placeholder {
        color: @inputTextColorOpacity60;
      }

      &::-moz-placeholder {
        color: @inputTextColorOpacity60;
      }

      &:-ms-input-placeholder {
        color: @inputTextColorOpacity60;
      }

      &:-moz-placeholder {
        color: @inputTextColorOpacity60;
      }
    }
  }
}
</style>
