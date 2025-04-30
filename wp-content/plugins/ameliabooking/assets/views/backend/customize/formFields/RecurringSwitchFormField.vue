<template>
  <div
    v-show="customizationEdit.editable ? customizationEdit.editable : componentDisplay()"
    class="am-customize-field"
    :class="{'editable': customizationEdit.editable}"
    :style="{borderColor: customizationEdit.reverseBackgroundColorForm}"
  >
    <el-form>
      <!-- Repeat this appointment -->
      <el-form-item class="am-customize-field-recurring">
        <template slot="label">
          <span :style="{ 'color': customizationEdit.useGlobalColors ? customizationForm.textColorOnBackground : customizationForm.formTextColor }">
            <template v-if="!languageShortCode">
              {{ labelRecurring.value || `${$root.labels.recurring_active}:` }}
            </template>
            <template v-else>
              {{ labelRecurring.translations[languageShortCode] || `${$root.labels.recurring_active}:` }}
            </template>
          </span>
        </template>
        <el-switch
          v-model="enabled"
          :active-color="customization.primaryColor"
        ></el-switch>
      </el-form-item>
      <!-- /Repeat this appointment -->
    </el-form>

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
import customizeEditDialog from '../dialogs/CustomizeEditDialog'

export default {
  name: 'recurringSwitchFormField',

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
      default: () => {
        return {}
      },
      type: Object
    }
  },

  data () {
    return {
      enabled: false,
      labelRecurring: this.formField.labels.recurring_active
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
  },

  watch: {
    'formField' () {
      this.labelRecurring = this.formField.labels.recurring_active
    }
  }
}
</script>