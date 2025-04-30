<template>
  <div
    v-show="customizationEdit.editable ? customizationEdit.editable : componentDisplay()"
    class="am-customize-field"
    :class="{'editable': customizationEdit.editable}"
    :style="{borderColor: customizationEdit.reverseBackgroundColorForm}"
  >
    <!-- Datepicker -->
    <v-date-picker
      v-model="selectedDate"
      mode="single"
      id="am-calendar-picker"
      class='am-calendar-picker'
      :show-day-popover=false
      :is-expanded=true
      :is-inline=true
      :style="{
        color: customizationEdit.useGlobalColors ? customizationForm.textColorOnBackground : customizationForm.formTextColor,
        fontFamily: customization.font
      }"
      :formats="vCalendarFormats"
    >
    </v-date-picker>

    <!-- Edit Dialog -->
    <customize-edit-dialog
      :form-field="formField"
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
  name: 'calendarAppointmentFormField',

  components: {
    customizeEditDialog
  },

  mixins: [dateMixin],

  props: {
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
      selectedDate: this.$moment().toDate()
    }
  },

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
  }
}
</script>
