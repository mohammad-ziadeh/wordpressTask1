<template>
  <!-- Booking Data -->
  <el-col :sm="24">
    <div
      v-show="customizationEdit.editable ? customizationEdit.editable : componentDisplay()"
      class="am-customize-field"
      :class="{'editable': customizationEdit.editable}"
      :style="{borderColor: customizationEdit.reverseBackgroundColorForm}"
    >
      <div class="am-confirmation-booking-details">
        <!-- Employee -->
        <div>
          <p :style="{ 'color': customizationForm.formTextColor }">
            <template v-if="!languageShortCode">
              {{ labelEmployee.value || `${$root.labels.employee}:` }}
            </template>
            <template v-else>
              {{ labelEmployee.translations[languageShortCode] || `${$root.labels.employee}:` }}
            </template>
          </p>
          <p
            class="am-semi-strong"
            :style="{ 'color': customizationForm.formTextColor }"
          >
            <img
              class="am-employee-photo"
              :src="pictureLoad(provider, true)"
              @error="imageLoadError(provider, true)"
              :alt="provider.firstName + ' ' + provider.lastName"
            />
            {{ provider.firstName + ' ' + provider.lastName }}
          </p>
        </div>
        <!-- /Employee -->

        <!-- Date -->
        <div>
          <p :style="{ 'color': customizationForm.formTextColor }">
            <template v-if="!languageShortCode">
              {{ labelDate.value || $root.labels.date_colon }}
            </template>
            <template v-else>
              {{ labelDate.translations[languageShortCode] || $root.labels.date_colon }}
            </template>
          </p>
          <p
            class="am-semi-strong"
            :style="{ 'color': customizationForm.formTextColor }"
          >
            {{ getFrontedFormattedDate($moment().format('YYYY-MM-DD')) }}
          </p>
        </div>
        <!-- /Date -->

        <!-- Time -->
        <div>
          <p :style="{ 'color': customizationForm.formTextColor }">
            <template v-if="!languageShortCode">
              {{ labelTime.value || $root.labels.time_colon }}
            </template>
            <template v-else>
              {{ labelTime.translations[languageShortCode] || $root.labels.time_colon }}
            </template>
          </p>
          <p
            class="am-semi-strong"
            :style="{ 'color': customizationForm.formTextColor }"
          >
            {{ getFrontedFormattedTime('9:30') }}
          </p>
        </div>
        <!-- /Time -->

        <!-- Location -->
        <div>
          <p :style="{ 'color': customizationForm.formTextColor }">
            <template v-if="!languageShortCode">
              {{ labelLocation.value || $root.labels.location_colon }}
            </template>
            <template v-else>
              {{ labelLocation.translations[languageShortCode] || $root.labels.location_colon }}
            </template>
          </p>
          <p
            class="am-semi-strong"
            :style="{ 'color': customizationForm.formTextColor }"
          >
            {{ $root.labels.location_name }}
          </p>
        </div>
        <!-- /Location -->
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
import imageMixin from '../../../../js/common/mixins/imageMixin'
import dateMixin from '../../../../js/common/mixins/dateMixin'
import customizeEditDialog from '../dialogs/CustomizeEditDialog'

export default {
  name: 'confirmHeadingDataFormField',

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

  mixins: [imageMixin, dateMixin],

  data () {
    return {
      provider: {
        firstName: 'John',
        lastName: 'Doe'
      },
      labelEmployee: this.formField.labels.employee,
      labelDate: this.formField.labels.date_colon,
      labelTime: this.formField.labels.time_colon,
      labelLocation: this.formField.labels.location_colon
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
      this.labelEmployee = this.formField.labels.employee
      this.labelDate = this.formField.labels.date_colon
      this.labelTime = this.formField.labels.time_colon
      this.labelLocation = this.formField.labels.location_colon
    }
  }
}
</script>
