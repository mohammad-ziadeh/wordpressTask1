<template>
  <el-form label-position="top">
    <div
      v-show="customizationEdit.editable ? customizationEdit.editable : componentDisplay()"
      class="am-customize-field"
      :class="{'editable': customizationEdit.editable}"
      :style="{borderColor: customizationEdit.reverseBackgroundColorForm}"
    >
      <div class="am-recurring-dates-row-header am-recurring-row-header-wrapper hide-on-mobile">
        <el-row>
          <!-- Order -->
          <el-col :lg="3" :sm="3">
            <span style="visibility: hidden;">#</span>
          </el-col>

          <!-- Date -->
          <el-col :lg="10" :sm="10" class="am-recurring-dates-row-header-date am-recurring-row-header">
            <span
              :style="{color: customizationForm.formTextColor, opacity: 0.65}"
            >
              <template v-if="!languageShortCode">
                {{ labelDate.value || $root.labels.date }}
              </template>
              <template v-else>
                {{ labelDate.translations[languageShortCode] || $root.labels.date }}
              </template>
            </span>
          </el-col>

          <!-- Time -->
          <el-col :lg="7" :sm="7" class="am-recurring-dates-row-header-time am-recurring-row-header">
            <span
              :style="{color: customizationForm.formTextColor, opacity: 0.65}"
            >
              <template v-if="!languageShortCode">
                {{ labelTime.value || $root.labels.time }}
              </template>
              <template v-else>
                {{ labelTime.translations[languageShortCode] || $root.labels.time }}
              </template>
            </span>
          </el-col>

          <!-- Action -->
          <el-col :lg="4" :sm="4">
            <span></span>
          </el-col>
        </el-row>
      </div>

      <div class="am-recurring-dates-rows">
        <el-row
          v-for="(item, index) in recurringDates"
          :key="index"
          class="am-recurring-flex-row-middle-align"
        >
          <span v-if="item.isEditing" class="bgr-row" :style="{backgroundColor: customizationForm.formBackgroundColor}"></span>
          <!-- Order -->
          <el-col
            :lg="3"
            :sm="3"
            class="am-recurring-row-item am-recurring-row-order"
            :class="{'is-editing': item.isEditing}"
          >
            <span
              class="hide-on-mobile"
              :style="{color: customizationForm.formTextColor}"
            >
              {{ index + 1 }}
            </span>
          </el-col>

          <!-- Date -->
          <el-col
            :lg="10"
            :sm="10"
            class="am-recurring-row-item am-recurring-row-item-date v-calendar-column"
            :class="{'is-editing': item.isEditing}"
          >
            <v-date-picker
              v-model="item.date"
              mode='single'
              popover-align="center"
              popover-visibility="focus"
              :popover-direction="'bottom'"
              input-class='el-input__inner'
              :disabled=false
              :is-expanded=false
              :is-required=false
              :show-day-popover=false
              :formats="vCalendarFormats"
              :input-props='{class: "el-input__inner"}'
              :tint-color="customization.globalColors.primaryColor"
              :style="item.isEditing ? { backgroundColor: customizationForm.formInputColor, color: customizationForm.formInputTextColor, borderColor: selectInputFocus ? customization.globalColors.primaryColor : '#a4b1c4' } : {color: customizationForm.formTextColor}"
            >
            </v-date-picker>
          </el-col>

          <!-- Time -->
          <el-col :lg="7" :sm="7"
            class="am-recurring-row-item am-recurring-row-item-time"
            :class="{'is-editing': item.isEditing}"
          >
            <el-select
              v-model="item.time"
              :popper-class="'am-dropdown'"
              filterable
              :style="item.isEditing ? { backgroundColor: customizationForm.formInputColor, color: customizationForm.formInputTextColor, borderColor: selectInputFocus ? customization.globalColors.primaryColor : '#a4b1c4' } : {color: customizationForm.formTextColor}"
            >
              <el-option
                v-for="slot in item.slots"
                :key="slot.name"
                :value="slot.name"
                :style="{
                  backgroundColor: customizationForm.formDropdownColor,
                  color: slot.name === item.time ? customization.globalColors.primaryColor : customizationForm.formDropdownTextColor,
                  fontFamily: customization.font
                }"
              >
              </el-option>
            </el-select>
          </el-col>

          <!-- Action -->
          <el-col :lg="4" :sm="4" class="am-recurring-row-action" :class="item.isEditing ? 'is-editing' : ''">
            <div v-if="item.editable" class="am-edit-element" @click="editDate(item)">
              <i
                :class="item.isEditing ? 'el-icon-check' : 'el-icon-edit'"
                style="font-size: 16px"
                :style="item.isEditing ? {color: customizationForm.formTextColor} : {color: customizationForm.formTextColor}"
              ></i>
            </div>

            <div v-if="item.editable" class="am-edit-element">
              <i
                ref="icon"
                :class="item.isEditing ? 'el-icon-close' : 'el-icon-delete'"
                style="font-size: 16px"
                :style="item.isEditing ? {color: customizationForm.formTextColor, backgroundColor: customization.globalColors.primaryColor} : {color: customizationForm.formTextColor}"
                @mouseenter="mouseEnterDefault(item.isEditing)"
                @mouseleave="mouseLeaveDefault(item.isEditing)"
              ></i>
            </div>
          </el-col>
        </el-row>
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
  </el-form>
</template>

<script>
  import dateMixin from '../../../../js/common/mixins/dateMixin'
  import customizeEditDialog from '../dialogs/CustomizeEditDialog'

  export default {
    name: 'recurringInfoFormField',

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
        selectInputFocus: false,
        recurringDates: [
          {
            editable: false,
            isEditing: false,
            date: this.$moment().toDate(),
            slot: '10:00 am',
            slots: [
              { name: '9:00 am' },
              { name: '9:30 am' },
              { name: '10:00 am' },
              { name: '10:30 am' },
              { name: '11:00 am' }
            ]
          },
          {
            editable: true,
            isEditing: false,
            date: this.$moment().toDate(),
            slot: '9:00 am',
            slots: [
              { name: '9:00 am' },
              { name: '9:30 am' },
              { name: '10:00 am' },
              { name: '10:30 am' },
              { name: '11:00 am' }
            ]
          }
        ],
        labelTime: this.formField.labels.time,
        labelDate: this.formField.labels.date
      }
    },

    methods: {
      mouseEnterDefault (isEditing) {
        if (isEditing) {
          let style = {
            color: this.customization.globalColors.primaryColor,
            backgroundColor: this.customizationForm.formTextColor
          }

          Object.assign(this.$refs.icon[0].style, style)
        }
      },

      mouseLeaveDefault (isEditing) {
        if (isEditing) {
          let style = {
            color: this.customizationForm.formTextColor,
            backgroundColor: this.customization.globalColors.primaryColor
          }

          Object.assign(this.$refs.icon[0].style, style)
        }
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

      capitalizeFirstLetter (string) {
        return string.charAt(0).toUpperCase() + string.slice(1)
      },

      saveFormFiledEdit (objData) {
        let fieldData = {}
        fieldData['itemsStatic'] = {}
        fieldData['itemsStatic'][this.$options.name] = JSON.parse(JSON.stringify(objData))
        this.$emit('saveEdit', fieldData)
      },

      editDate (item) {
        item.isEditing = !item.isEditing
      }
    },

    watch: {
      'formField' () {
        this.labelTime = this.formField.labels.time
        this.labelDate = this.formField.labels.date
      }
    }
  }
</script>
