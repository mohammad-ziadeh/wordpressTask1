<template>
  <div class="am-dialog-table am-custom-fields-container">

    <!-- Form -->
    <div v-for="(booking, key) in appointment.bookings" class="am-customer-extras">

      <!-- Customer Name & Email -->
      <el-row class="am-customer-extras-data">
        <el-col v-if="showCustomerInfo">
          <h3>{{ booking.customer.firstName }} {{ booking.customer.lastName }}</h3>
          <span>{{ booking.customer.email }}</span>
        </el-col>
      </el-row>

      <!-- Custom Fields -->
      <div class="am-custom-fields">
        <el-form-item
          v-if="isCustomFieldVisible(customField, entityType, entityId) && customField.type !== 'content' && (customField.type !== 'file' || (customField.type === 'file' && appointment.bookings[key].customFields[customField.id].value && appointment.bookings[key].customFields[customField.id].value.length > 0))"
          v-for="customField in customFields"
          :key="customField.id"
          :prop="customField.required === true && customField.type !== 'content' && customField.type !== 'file' ? 'bookings.' + key + '.customFields.' + customField.id + '.value' : null"
          :label="(customField.type !== 'content' && customField.type !== 'checkbox' && customField.type !== 'radio') && customField.label ? customField.label + ':' : ''"
        >
          <span
            v-if="(customField.type === 'checkbox' || customField.type === 'radio') && customField.label" v-html="customField.label ? '<label class=' + '\'el-form-item__label\'>' + customField.label + '</label>' + ':' : ''"
            :class="(customField.type === 'checkbox' || customField.type === 'radio') && customField.required ? 'am-custom-required-as-html' : ''">
          >
          </span>

          <!-- Text Field -->
          <el-input
            v-if="customField.type === 'text'"
            v-model="appointment.bookings[key].customFields[customField.id].value"
            placeholder=""
            @input="clearValidation()"
          >
          </el-input>

          <!-- Address Field -->
          <div class="el-input" v-if="customField.type === 'address'" :style="{marginBottom: $root.settings.general.gMapApiKey ? '':0}">
            <vue-google-autocomplete
              :ref="'amelia-cf-address-'+key+'-'+customField.id"
              v-if="googleMapsLoaded()"
              :id="'address-autocomplete-'+key+'-'+customField.id"
              classname="el-input__inner"
              @change="setAddressCF($event, customField.id, key)"
              placeholder=""
              types=""
            >
            </vue-google-autocomplete>
            <el-input
              v-else
              placeholder=""
              v-model="appointment.bookings[key].customFields[customField.id].value"
            >
            </el-input>
          </div>
          <!-- /Address Field -->


          <!-- Text Area -->
          <el-input
            v-else-if="customField.type === 'text-area'"
            v-model="appointment.bookings[key].customFields[customField.id].value"
            :rows="3"
            class="am-front-texarea"
            placeholder=""
            type="textarea"
            @input="clearValidation()"
          >
          </el-input>

          <!-- Selectbox -->
          <el-select
            v-else-if="customField.type === 'select'"
            v-model="appointment.bookings[key].customFields[customField.id].value"
            placeholder=""
            clearable
            :popper-class="'am-dropdown-cabinet'"
            @change="clearValidation()"
          >
            <el-option
              v-for="(option, index) in getCustomFieldOptions(customField.options)"
              :key="index"
              :value="option"
              :label="option"
            >
            </el-option>
          </el-select>

          <!-- Checkbox -->
          <el-checkbox-group
            v-else-if="customField.type === 'checkbox'"
            v-model="appointment.bookings[key].customFields[customField.id].value"
            @change="clearValidation()"
          >
            <el-checkbox
              v-for="(option, index) in getCustomFieldOptions(customField.options)"
              :key="index"
              :label="option"
            >
            </el-checkbox>
          </el-checkbox-group>

          <!-- Radio Buttons -->
          <el-radio-group
            v-else-if="customField.type === 'radio'"
            v-model="appointment.bookings[key].customFields[customField.id].value"
          >
            <el-radio
              v-for="(option, index) in getCustomFieldOptions(customField.options)"
              :key="index"
              :label="option"
              @change="clearValidation()"
            >
            </el-radio>
          </el-radio-group>

          <!-- Uploaded Files -->
          <div v-else-if="customField.type === 'file' && hideAttachmentCustomField === false" v-for="(fileInfo, index) in appointment.bookings[key].customFields[customField.id].value" style="margin: 15px; clear: left">
            <a
              :key="index"
              :href="$root.useUploadsAmeliaPath ? $root.getAjaxUrl + '/fields/' + customField.id + '/' + appointment.bookings[key].id + '/' + index + (isCabinet ? '&source=cabinet-provider' : '') : $root.getUploadsAmeliaUrl + appointment.bookings[key].id + '_' + fileInfo.fileName"
              target="_blank"
            >
              {{fileInfo.name}}
            </a>
          </div>

          <!-- Date picker -->
          <div v-else-if="customField.type === 'datepicker'">
            <v-date-picker
              v-model="appointment.bookings[key].customFields[customField.id].value"
              mode='single'
              popover-visibility="focus"
              popover-direction="bottom"
              :popover-align="screenWidth < 768 ? 'center' : 'left'"
              :tint-color='"#1A84EE"'
              :show-day-popover=false
              :input-props='{class: "el-input__inner", readOnly: "readonly"}'
              :is-expanded=false
              :is-required=true
              :disabled=false
              :formats="vCalendarFormats"
            />
          </div>

        </el-form-item>
      </div>

    </div>
  </div>
</template>

<script>
  import customFieldMixin from '../../../js/common/mixins/customFieldMixin'
  import dateMixin from '../../../js/common/mixins/dateMixin'
  import windowMixin from '../../../js/backend/mixins/windowMixin'
  import VueGoogleAutocomplete from 'vue-google-autocomplete'

  export default {
    mixins: [customFieldMixin, dateMixin, windowMixin],

    props: {
      showCustomerInfo: true,
      entityId: null,
      entityType: null,
      appointment: {
        default: () => {}
      },
      customFields: {
        default: () => []
      },
      hideAttachmentCustomField: {
        required: false,
        default: false,
        type: Boolean
      },
      isCabinet: {
        type: Boolean,
        default: false,
        required: false
      }
    },

    data () {
      return {
      }
    },

    mounted () {
     this.setAddressCustomFields()
    },

    methods: {
      setAddressCF (input, cfId, bookingKey) {
        this.appointment.bookings[bookingKey].customFields[cfId].value = input
      },

      googleMapsLoaded () {
        return window.google && this.$root.settings.general.gMapApiKey
      },

      clearValidation () {
        this.$emit('clearValidation')
      },


      setAddressCustomFields () {
        this.appointment.bookings.forEach((booking, bookingKey) => {
          for (const [key, cf] of Object.entries(booking.customFields)) {
            if (cf.type === 'address') {
              if (this.$refs['amelia-cf-address-' + bookingKey + '-' +key] !== undefined && this.$refs['amelia-cf-address-' + bookingKey + '-' + key].length > 0) {
                this.$refs['amelia-cf-address-' + bookingKey + '-' + key][0].update(cf.value)
              }
            }
          }
        })
      }
    },

    watch: {
      'appointment.bookings' () {
        this.$nextTick(() => {
          this.setAddressCustomFields()
        })
      }
    },

    components: {
      VueGoogleAutocomplete
    }
  }
</script>
