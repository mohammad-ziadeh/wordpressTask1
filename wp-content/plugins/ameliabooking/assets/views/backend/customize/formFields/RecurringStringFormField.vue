<template>
  <!-- Booking Data -->
  <el-col :sm="24">
    <div
      v-show="customizationEdit.editable ? customizationEdit.editable : componentDisplay()"
      class="am-customize-field"
      :class="{'editable': customizationEdit.editable}"
      :style="{borderColor: customizationEdit.reverseBackgroundColorForm}"
    >
      <div class="am-confirmation-booking-details recurring-string">
        <div>
          <p :style="{ 'color': customizationForm.formTextColor }">
            <template v-if="!languageShortCode">
              {{ labelRecurring.value || $root.labels.recurring_active }}
            </template>
            <template v-else>
              {{ labelRecurring.translations[languageShortCode] || $root.labels.recurring_active }}
            </template>
          </p>
          <p
            class="am-semi-strong"
            :style="{ 'color': customizationForm.formTextColor }"
          >
            {{ `${$root.labels.recurring_string} ${getFrontedFormattedDate($moment().add(5, 'days').format('YYYY-MM-DD'))}` }}
          </p>
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
  <!-- /Booking Data -->
</template>

<script>
import customizeEditDialog from '../dialogs/CustomizeEditDialog'
import dateMixin from '../../../../js/common/mixins/dateMixin'

export default {
  name: 'recurringStringFormField',

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
      labelRecurring: this.formField.labels.recurring_active
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
      this.labelRecurring = this.formField.labels.recurring_active
    }
  }
}
</script>
