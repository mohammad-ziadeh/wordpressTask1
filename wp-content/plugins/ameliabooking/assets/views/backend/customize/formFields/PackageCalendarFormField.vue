<template>
  <div
    v-show="customizationEdit.editable ? customizationEdit.editable : componentDisplay()"
    class="am-customize-field"
    :class="{'editable': customizationEdit.editable}"
    :style="{borderColor: customizationEdit.reverseBackgroundColorForm}"
  >
    <el-collapse v-model="calendarCollapse" accordion>
      <el-collapse-item
        name="calendar"
        :style="{color: customizationEdit.useGlobalColors ? customizationForm.textColorOnBackground : customizationForm.formTextColor}"
      >
        <template slot="title">
          <span
            :style="{
              color: customizationEdit.useGlobalColors ? customizationForm.textColorOnBackground : customizationForm.formTextColor,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }"
          >
            <template v-if="!languageShortCode">
              {{ labelRequirements.value || $root.labels.no_selected_slot_requirements }}
            </template>
            <template v-else>
              {{ labelRequirements.translations[languageShortCode] || $root.labels.no_selected_slot_requirements }}
            </template>
          </span>
        </template>

        <p v-if="formField.timeZoneVisibility" class="am-timezone" :style="{ 'color': customizationEdit.useGlobalColors ? customizationForm.textColorOnBackground : customizationForm.formTextColor, margin: '0 0 16px'}">
          <span class="am-timezone__text">{{ timeZoneString }}</span>
        </p>

        <v-date-picker
          v-model="selectedDate"
          mode="single"
          id="am-calendar-picker"
          class='am-calendar-picker'
          :show-day-popover=false
          :is-expanded=true
          :is-inline=true
          :style="{ color: customizationEdit.useGlobalColors ? customizationForm.textColorOnBackground : customizationForm.formTextColor, fontFamily: customization.font }"
          :formats="vCalendarFormats"
        >
        </v-date-picker>
      </el-collapse-item>
    </el-collapse>

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
</template>

<script>
import dateMixin from '../../../../js/common/mixins/dateMixin'
import customizeEditDialog from '../dialogs/CustomizeEditDialog'

export default {
  name: 'packageCalendarFormField',

  components: {
    customizeEditDialog
  },

  props: {
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

  mixins: [dateMixin],

  data () {
    return {
      labelRequirements: this.formField.labels.no_selected_slot_requirements,
      calendarCollapse: 'calendar',
      selectedDate: this.$moment().toDate(),
      timeZoneString: this.$root.settings.general.showClientTimeZone ? Intl.DateTimeFormat().resolvedOptions().timeZone : this.$root.settings.wordpress.timezone
    }
  },

  mounted () {},

  methods: {
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

  watch: {
    'formField' () {
      this.labelRequirements = this.formField.labels.no_selected_slot_requirements
    }
  }
}
</script>
