<template>
  <!-- Package info -->
  <div
    v-show="customizationEdit.editable ? customizationEdit.editable : componentDisplay()"
    class="am-customize-field"
    :class="{'editable': customizationEdit.editable}"
    :style="{borderColor: customizationEdit.reverseBackgroundColorForm}"
  >
    <div v-if="!catalogLayout" class="am-overview-booking">
      <h2 :style="{color: customizationForm.formTextColor}">
        <template v-if="!languageShortCode">
          {{ labelOverview.value || $root.labels.package_list_overview }}
        </template>
        <template v-else>
          {{ labelOverview.translations[languageShortCode] || $root.labels.package_list_overview }}
        </template>
      </h2>

      <div class="am-package-rule">
        <div>
          <span :style="{color: customizationForm.formTextColor}">
            <i class="el-icon-date" :style="{color: customizationForm.formTextColor}"></i> {{ $root.labels.package_book_service }}
          </span>
        </div>
      </div>
    </div>

    <div class="am-appointment-wrapper">
      <h2 :style="{color: customizationForm.formTextColor}">
        <template v-if="!languageShortCode">
          {{ labelAppointments.value || $root.labels.appointments }}
        </template>
        <template v-else>
          {{ labelAppointments.translations[languageShortCode] || $root.labels.appointments }}
        </template>
      </h2>
      <div>
        <el-row class="am-appointment-block">
          <el-col :sm="24">
            <el-collapse v-model="activeServiceAccordion">
              <el-collapse-item name="activeService" disabled>
                <template slot="title">
                  <div class="am-appointment-service-name">
                    <el-popover
                      placement="bottom"
                      :title="appointment.serviceName"
                      :disabled="appointment.serviceName.length < 7"
                      trigger="click"
                    >
                      <p @click.stop slot="reference" :style="{color: customizationForm.formTextColor}">{{ appointment.serviceName }}</p>
                    </el-popover>
                  </div>
                  <div class="am-blue-badge">
                    <p :style="{color: customization.globalColors.primaryColor, backgroundColor: colorTransparency(customization.globalColors.primaryColor, 0.1)}">
                      x5
                    </p>
                  </div>
                  <div class="am-package-service-duration" :style="{color: customizationForm.formTextColor}">
                    <i :style="{color: customizationForm.formTextColor}" class="el-icon-time"></i>
                    {{ serviceDuration(appointment.serviceDuration)}}
                  </div>
                </template>
                <el-row class="am-appointment-header">
                  <el-col
                    :sm="appointment.spanLengths.appointment"
                    :style="{color: colorTransparency(customizationForm.formTextColor, 0.5)}"
                    :class="responsiveDisplay"
                    class="am-appointment-header-cell"
                  >
                    #
                  </el-col>
                  <el-col
                    :sm="appointment.spanLengths.date"
                    :style="{color: colorTransparency(customizationForm.formTextColor, 0.5)}"
                    :class="responsiveDisplay"
                    class="am-appointment-header-cell"
                  >
                    <template v-if="!languageShortCode">
                      {{ labelDate.value || $root.labels.date }}
                    </template>
                    <template v-else>
                      {{ labelDate.translations[languageShortCode] || $root.labels.date }}
                    </template>
                  </el-col>
                  <el-col
                    :sm="appointment.spanLengths.time"
                    :style="{color: colorTransparency(customizationForm.formTextColor, 0.5)}"
                    :class="responsiveDisplay"
                    class="am-appointment-header-cell"
                  >
                    <template v-if="!languageShortCode">
                      {{ labelTime.value || $root.labels.time }}
                    </template>
                    <template v-else>
                      {{ labelTime.translations[languageShortCode] || $root.labels.time }}
                    </template>
                  </el-col>
                  <el-col
                    :sm="appointment.spanLengths.employee"
                    :style="{color: colorTransparency(customizationForm.formTextColor, 0.5)}"
                    :class="responsiveDisplay"
                    class="am-appointment-header-cell"
                  >
                    <template v-if="!languageShortCode">
                      {{ labelEmployee.value || $root.labels.employee }}
                    </template>
                    <template v-else>
                      {{ labelEmployee.translations[languageShortCode] || $root.labels.employee }}
                    </template>
                  </el-col>
                  <el-col
                    :sm="appointment.spanLengths.location"
                    :style="{color: colorTransparency(customizationForm.formTextColor, 0.5)}"
                    :class="responsiveDisplay"
                    class="am-appointment-header-cell"
                  >
                    <template v-if="!languageShortCode">
                      {{ labelLocation.value || $root.labels.location }}
                    </template>
                    <template v-else>
                      {{ labelLocation.translations[languageShortCode] || $root.labels.location }}
                    </template>
                  </el-col>
                </el-row>
                <el-row class="am-appointment-body">
                  <el-col
                    :sm="appointment.spanLengths.appointment"
                    class="am-appointment-body-cell"
                    :class="responsiveDisplay"
                  >
                    <div
                      class="am-appointment-body-heading"
                      :class="responsiveDisplay"
                      :style="{color: colorTransparency(customizationForm.formTextColor, 0.5)}"
                    >
                      <template v-if="!languageShortCode">
                        {{ labelAppointment.value || $root.labels.appointment }}
                      </template>
                      <template v-else>
                        {{ labelAppointment.translations[languageShortCode] || $root.labels.appointment }}
                      </template>
                    </div>
                    <div :style="{color: customizationForm.formTextColor}">
                      1
                    </div>
                  </el-col>
                  <el-col
                    :sm="appointment.spanLengths.date"
                    class="am-appointment-body-cell"
                    :class="responsiveDisplay"
                  >
                    <div
                      class="am-appointment-body-heading"
                      :class="responsiveDisplay"
                      :style="{color: colorTransparency(customizationForm.formTextColor, 0.5)}"
                    >
                      <template v-if="!languageShortCode">
                        {{ labelDate.value || $root.labels.date }}
                      </template>
                      <template v-else>
                        {{ labelDate.translations[languageShortCode] || $root.labels.date }}
                      </template>
                    </div>
                    <div :style="{color: customizationForm.formTextColor}">
                      {{ formatDate(appointment.serviceAppointment.date) }}
                    </div>
                  </el-col>
                  <el-col
                    :sm="appointment.spanLengths.time"
                    class="am-appointment-body-cell"
                    :class="responsiveDisplay"
                  >
                    <div
                      class="am-appointment-body-heading"
                      :class="responsiveDisplay"
                      :style="{color: colorTransparency(customizationForm.formTextColor, 0.5)}"
                    >
                      <template v-if="!languageShortCode">
                        {{ labelTime.value || $root.labels.time }}
                      </template>
                      <template v-else>
                        {{ labelTime.translations[languageShortCode] || $root.labels.time }}
                      </template>
                    </div>
                    <div :style="{color: customizationForm.formTextColor}">
                      {{ formatTime(appointment.serviceAppointment.time) }}
                    </div>
                  </el-col>
                  <el-col
                    :sm="appointment.spanLengths.employee"
                    class="am-appointment-body-cell"
                    :class="responsiveDisplay"
                  >
                    <div
                      class="am-appointment-body-heading"
                      :class="responsiveDisplay"
                      :style="{color: colorTransparency(customizationForm.formTextColor, 0.5)}"
                    >
                      <template v-if="!languageShortCode">
                        {{ labelEmployee.value || $root.labels.employee }}
                      </template>
                      <template v-else>
                        {{ labelEmployee.translations[languageShortCode] || $root.labels.employee }}
                      </template>
                    </div>
                    <div :style="{color: customizationForm.formTextColor}">
                      {{ appointment.serviceAppointment.provider }}
                    </div>
                  </el-col>
                  <el-col
                    :sm="appointment.spanLengths.location"
                    class="am-appointment-body-cell"
                    :class="responsiveDisplay"
                  >
                    <div
                      class="am-appointment-body-heading"
                      :class="responsiveDisplay"
                      :style="{color: colorTransparency(customizationForm.formTextColor, 0.5)}"
                    >
                      <template v-if="!languageShortCode">
                        {{ labelLocation.value || $root.labels.location }}
                      </template>
                      <template v-else>
                        {{ labelLocation.translations[languageShortCode] || $root.labels.location }}
                      </template>
                    </div>
                    <div :style="{color: customizationForm.formTextColor}">
                      {{ appointment.serviceAppointment.location }} 1
                    </div>
                  </el-col>
                </el-row>
              </el-collapse-item>
            </el-collapse>
          </el-col>
        </el-row>
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
  <!-- /Package info -->
</template>

<script>
import moment from 'moment'
import dateMixin from '../../../../js/common/mixins/dateMixin'
import cssColorManipulationMixin from '../../../../js/common/mixins/cssColorManipulationMixin'
import customizeEditDialog from '../dialogs/CustomizeEditDialog'

export default {
  name: 'packageListFormField',

  components: {
    customizeEditDialog
  },

  props: {
    languageShortCode: {
      type: String,
      default: ''
    },
    catalogLayout: {
      type: Boolean,
      default: false
    },
    responsiveDisplay: {
      type: String,
      default: 'am-desktop'
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

  mixins: [dateMixin, cssColorManipulationMixin],

  data () {
    return {
      labelOverview: this.catalogLayout ? null : this.formField.labels.package_list_overview,
      labelAppointments: this.formField.labels.appointments,
      labelAppointment: this.formField.labels.appointment,
      labelDate: this.formField.labels.date,
      labelTime: this.formField.labels.time,
      labelEmployee: this.formField.labels.employee,
      labelLocation: this.formField.labels.location,
      activeServiceAccordion: 'activeService',
      appointment: {
        serviceName: 'Service name',
        serviceDuration: 5400,
        spanLengths: {
          appointment: 1,
          date: 7,
          employee: 6,
          location: 6,
          time: 4
        },
        serviceAppointment: {
          date: new Date(),
          location: this.$root.labels.location,
          provider: 'John Doe',
          time: '09:00'
        }
      }
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

    serviceDuration (seconds) {
      let hours = moment.duration(seconds * 1000).hours() ? `${moment.duration(seconds * 1000).hours()}h` : ''
      let minutes = moment.duration(seconds * 1000).minutes() ? `${moment.duration(seconds * 1000).minutes()}min` : ''
      return `${hours}${minutes}`
    },

    formatDate (date) {
      return this.getFrontedFormattedDate(
        moment(date).format('YYYY-MM-DD')
      )
    },

    formatTime (time) {
      return this.getFrontedFormattedTime(time)
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
      this.labelOverview = this.catalogLayout ? null : this.formField.labels.package_list_overview
      this.labelAppointments = this.formField.labels.appointments
      this.labelAppointment = this.formField.labels.appointment
      this.labelDate = this.formField.labels.date
      this.labelTime = this.formField.labels.time
      this.labelEmployee = this.formField.labels.employee
      this.labelLocation = this.formField.labels.location
    }
  }
}
</script>
