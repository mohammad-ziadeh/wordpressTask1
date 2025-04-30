<template>
  <el-form label-position="top" :style="cssVars">
    <div
      v-show="editable ? editable : componentDisplay()"
      class="am-customize-field"
      :class="{'editable': editable}"
      :style="{borderColor: oppositeBackgroundColor}"
    >
      <el-row :gutter="24">
        <el-col :sm="12">
          <el-form-item>
            <el-select
              v-model="param"
              clearable
              :popper-class="'am-dropdown'"
              :placeholder="(languageShortCode ? labelParamType.translations[languageShortCode] : labelParamType.value) || $root.labels.event_type"
              :style="{ backgroundColor: customizationForm.formInputColor, color: customizationForm.formInputTextColor, borderColor: selectInputFocus ? customization.globalColors.primaryColor : '#C0C4CC' }"
              @focus="inputFocus"
            >
              <template slot="prefix">
                <svg width="20" height="18" viewBox="0 0 20 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path :fill="customizationForm.formInputTextColor" d="M17.5 17.4999H2.5C1.84661 17.508 1.21666 17.2568 0.748098 16.8013C0.279533 16.3459 0.0105328 15.7233 0 15.0699V2.92994C0.0105328 2.27659 0.279533 1.65403 0.748098 1.19858C1.21666 0.743137 1.84661 0.491921 2.5 0.499942H7.1C7.24771 0.500919 7.39336 0.534605 7.5265 0.59858C7.65964 0.662555 7.77695 0.755229 7.87 0.869942L10.47 4.04994H17.47C17.796 4.04198 18.1204 4.09866 18.4244 4.21672C18.7285 4.33478 19.0061 4.51188 19.2413 4.7378C19.4765 4.96372 19.6647 5.23398 19.7949 5.53299C19.9251 5.83201 19.9948 6.15385 20 6.47994V15.0699C19.9895 15.7233 19.7205 16.3459 19.2519 16.8013C18.7833 17.2568 18.1534 17.508 17.5 17.4999Z"/>
                </svg>
              </template>
              <el-option
                v-for="item in paramOptions"
                :key="item.name"
                :label="item.name"
                :value="item.name"
                :style="{
                  backgroundColor: customizationForm.formDropdownColor,
                  color: item.name === param ? customization.globalColors.primaryColor : customizationForm.formDropdownTextColor,
                  fontFamily: customization.font
                }"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :sm="12" class="v-calendar-column">
          <el-form-item>
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
              <el-input
                v-model="selectedDateInput"
                readonly
              >
                <template slot="prefix">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="22" viewBox="0 0 22 24">
                    <path :fill="customizationForm.formInputTextColor" fill-rule="evenodd" d="M15.714 2.667H6.286V0H2.75v2.667H.78A.783.783 0 0 0 0 3.45v19.764A.78.78 0 0 0 .783 24h20.434a.785.785 0 0 0 .783-.785V3.451a.782.782 0 0 0-.78-.784h-1.97V0h-3.536v2.667zM2.75 21.429V8h16.5v13.429H2.75zM12 14v6h6v-6h-6z"/>
                  </svg>
                </template>
              </el-input>
            </v-date-picker>
          </el-form-item>
        </el-col>

        <el-col :sm="12">
          <el-form-item>
            <el-select
              v-model="locationParam"
              clearable
              :popper-class="'am-dropdown'"
              :placeholder="(languageShortCode ? labelParamLocation.translations[languageShortCode] : labelParamLocation.value) || $root.labels.event_location"
              :style="{ backgroundColor: customizationForm.formInputColor, color: customizationForm.formInputTextColor, borderColor: selectInputFocus ? customization.globalColors.primaryColor : '#C0C4CC' }"
              @focus="inputFocus"
            >
              <template slot="prefix">
                <svg width="20" height="24" viewBox="0 0 20 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path :fill="customizationForm.formInputTextColor" d="M10 0.16674C7.54075 0.166617 5.18082 1.13713 3.43314 2.86733C1.68546 4.59753 0.69128 6.9476 0.666687 9.40674C0.666687 15.8001 8.89169 22.9167 9.24169 23.2201C9.45301 23.4008 9.72194 23.5001 10 23.5001C10.2781 23.5001 10.547 23.4008 10.7584 23.2201C11.1667 22.9167 19.3334 15.8001 19.3334 9.40674C19.3088 6.9476 18.3146 4.59753 16.5669 2.86733C14.8192 1.13713 12.4593 0.166617 10 0.16674ZM10 20.7584C8.05169 18.9034 3.00002 13.7584 3.00002 9.40674C3.00002 7.55022 3.73752 5.76975 5.05027 4.45699C6.36303 3.14424 8.1435 2.40674 10 2.40674C11.8565 2.40674 13.637 3.14424 14.9498 4.45699C16.2625 5.76975 17 7.55022 17 9.40674C17 13.7234 11.9484 18.9034 10 20.7584Z"/>
                  <path :fill="customizationForm.formInputTextColor" d="M10 4.83337C9.19241 4.83337 8.40294 5.07286 7.73144 5.52154C7.05994 5.97022 6.53656 6.60795 6.22751 7.35408C5.91845 8.10022 5.83759 8.92124 5.99514 9.71333C6.1527 10.5054 6.5416 11.233 7.11266 11.8041C7.68373 12.3751 8.41131 12.764 9.2034 12.9216C9.99548 13.0791 10.8165 12.9983 11.5626 12.6892C12.3088 12.3802 12.9465 11.8568 13.3952 11.1853C13.8439 10.5138 14.0833 9.72431 14.0833 8.91671C14.0833 7.83374 13.6531 6.79513 12.8874 6.02935C12.1216 5.26358 11.083 4.83337 10 4.83337ZM10 10.6667C9.6539 10.6667 9.31555 10.5641 9.02777 10.3718C8.73998 10.1795 8.51568 9.90617 8.38323 9.5864C8.25077 9.26663 8.21612 8.91477 8.28364 8.5753C8.35116 8.23583 8.51784 7.92401 8.76258 7.67927C9.00732 7.43453 9.31914 7.26786 9.65861 7.20033C9.99807 7.13281 10.3499 7.16746 10.6697 7.29992C10.9895 7.43237 11.2628 7.65667 11.4551 7.94446C11.6474 8.23225 11.75 8.57059 11.75 8.91671C11.75 9.38084 11.5656 9.82596 11.2375 10.1541C10.9093 10.4823 10.4641 10.6667 10 10.6667Z"/>
                </svg>
              </template>
              <el-option
                v-for="item in locationParamOptions"
                :key="item.name"
                :label="item.name"
                :value="item.name"
                :style="{
                backgroundColor: customizationForm.formDropdownColor,
                color: item.name === locationParam ? customization.globalColors.primaryColor : customizationForm.formDropdownTextColor,
                fontFamily: customization.font
              }"
              >
              </el-option>
            </el-select>
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
          <span v-show="editable" class="am-customize-field__edit">
            <img :src="$root.getUrl + 'public/img/am-customize-icon-edit.svg'" />
          </span>
        </template>
      </customize-edit-dialog>
      <!-- /Edit Dialog -->
    </div>
  </el-form>
</template>

<script>
import dateMixin from '../../../../js/common/mixins/dateMixin'
import cssColorManipulationMixin from '../../../../js/common/mixins/cssColorManipulationMixin'
import customizeEditDialog from '../dialogs/CustomizeEditDialog'

export default {
  name: 'eventFilterFormField',

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
    editable: {
      type: Boolean,
      default: true
    },
    oppositeBackgroundColor: {
      type: String,
      default: '#000'
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

  mixins: [dateMixin, cssColorManipulationMixin],

  data () {
    return {
      selectInputFocus: false,
      selectedDate: this.$moment().toDate(),
      labelParamType: this.formField.labels.event_type,
      labelParamLocation: this.formField.labels.event_location,
      param: '',
      paramOptions: [
        {name: 'Param 1'},
        {name: 'Param 2'},
        {name: 'Param 3'}
      ],
      locationParam: '',
      locationParamOptions: [
        {name: `${this.$root.labels.location_option} 1`},
        {name: `${this.$root.labels.location_option} 2`},
        {name: `${this.$root.labels.location_option} 3`}
      ]
    }
  },

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
    }
  },

  computed: {
    selectedDateInput () {
      return this.$moment(this.selectedDate).format(this.momentDateFormat)
    },

    cssVars () {
      return {
        // input text color - start
        '--input-text-color-opacity60': this.colorTransparency(this.customizationForm.formInputTextColor, 0.6)
        // input text color - end
      }
    }
  },

  watch: {
    'formField' () {
      this.labelParamType = this.formField.labels.event_type
      this.labelParamLocation = this.formField.labels.event_location
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
