<template>
  <div>

    <div class="am-dialog-scrollable">

      <!-- Dialog Header -->
      <div class="am-dialog-header">
        <el-row>
          <el-col :span="14">
            <h2>{{ $root.labels.export }}</h2>
          </el-col>
          <el-col :span="10" class="align-right">
            <el-button @click="closeDialog" class="am-dialog-close" size="small" icon="el-icon-close"></el-button>
          </el-col>
        </el-row>
      </div>

      <LicenceBlockHeader :licence="'starter'"/>

      <!-- Form -->
      <el-form :class="licenceClassDisabled('starter')" label-position="top">

        <!-- CSV Delimiters -->
        <el-form-item :label="$root.labels.csv_delimiter + ':'">
          <el-select :placeholder="$root.labels.csv_delimiter" v-model="delimiter" @change="changeFields">
            <el-option
                v-for="item in delimiters"
                :key="item.value"
                :label="item.label"
                :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item v-if="hasSeparateBookingOption" :label="$root.labels['select_rows_settings' + (action === $root.getAjaxUrl + '/report/event/attendees' ? '_event' : '')] + ':'">
          <el-select :placeholder="$root.labels.exported_same_row" v-model="separateBookings" @change="changeFields">
            <el-option
                :label="this.$root.labels['exported_same_row' + (action === $root.getAjaxUrl + '/report/event/attendees' ? '_event' : '')]"
                :value="false">
            </el-option>
            <el-option
                :label="this.$root.labels['exported_separate_rows' + (action === $root.getAjaxUrl + '/report/event/attendees' ? '_event' : '')]"
                :value="true">
            </el-option>
          </el-select>
        </el-form-item>

        <!-- Export Columns -->
        <template v-for="field in data.fields">
          <el-checkbox v-model="field.checked" checked :label="field.label" border @change="changeFields"></el-checkbox>
        </template>
      </el-form>

    </div>

    <!-- Dialog Footer -->
    <div class="am-dialog-footer">
      <div class="am-dialog-footer-actions">
        <el-row>
          <el-col :sm="24" class="align-right">
            <el-button
                :disabled="notInLicence('starter')"
                type=""
                @click="closeDialog"
                class=""
            >
              {{ $root.labels.cancel }}
            </el-button>
            <el-button
                :disabled="notInLicence('starter')"
                type="primary"
                class="am-dialog-create"
                @click="closeDialog"
                native-type='submit'
            >
              {{ $root.labels.export }}
            </el-button>
          </el-col>
        </el-row>
      </div>
    </div>

  </div>
</template>

<script>
  import licenceMixin from '../../../js/common/mixins/licenceMixin'
  import imageMixin from '../../../js/common/mixins/imageMixin'
  import dateMixin from '../../../js/common/mixins/dateMixin'

  export default {

    mixins: [
      licenceMixin,
      imageMixin,
      dateMixin
    ],

    props: {
      data: null,
      action: null
    },

    data () {
      return {
        delimiter: ',',
        delimiters: [
          {
            label: this.$root.labels.csv_delimiter_comma,
            value: ','
          },
          {
            label: this.$root.labels.csv_delimiter_semicolon,
            value: ';'
          }
        ],
        separateBookings: false,
        hasSeparateBookingOption: false
      }
    },

    updated () {
      this.inlineSVG()
    },

    mounted () {
      this.hasSeparateBookingOption = this.action === this.$root.getAjaxUrl + '/report/appointments' || this.action === this.$root.getAjaxUrl + '/report/event/attendees'
      this.separateBookings = this.action === this.$root.getAjaxUrl + '/report/event/attendees'
      this.$emit('updateAction', this.getAction())
      this.inlineSVG()
    },

    methods: {
      changeFields () {
        this.$emit('updateAction', this.getAction())
      },

      closeDialog () {
        this.$emit('closeDialogExport')
      },

      getAction: function () {
        let params = !this.$root.settings.activation.disableUrlParams ? [] : {}

        for (let paramKey in this.data) {
          if (this.data.hasOwnProperty(paramKey)) {
            if (this.data[paramKey] instanceof Array || this.data[paramKey] instanceof Object) {
              let arrayParams = Object.keys(this.data[paramKey]).map(key => this.data[paramKey][key])

              for (let index in arrayParams) {
                if (arrayParams[index] !== '') {
                  let value = ''

                  if ((arrayParams[index] instanceof Date)) {
                    // Report dates
                    value = (arrayParams[index] instanceof Date) ? this.getDatabaseFormattedDate(arrayParams[index]) : arrayParams[index]
                  } else if ((arrayParams[index] instanceof Object) && arrayParams[index]['checked'] === true) {
                    value = arrayParams[index]['value']
                  } else {
                    value = arrayParams[index]
                  }

                  if (value !== '') {
                    if (!this.$root.settings.activation.disableUrlParams) {
                      params.push(paramKey + '[' + index + ']' + '=' + encodeURIComponent(value))
                    } else {
                      if (!(paramKey in params)) {
                        params[paramKey] = []
                      }

                      params[paramKey].push(encodeURIComponent(value))
                    }
                  }
                }
              }
            } else {
              if (this.data[paramKey] !== '') {
                if (!this.$root.settings.activation.disableUrlParams) {
                  params.push(paramKey + '=' + encodeURIComponent(this.data[paramKey]))
                } else {
                  if (!(paramKey in params)) {
                    params[paramKey] = []
                  }

                  params[paramKey].push(encodeURIComponent(this.data[paramKey]))
                }
              }
            }
          }
        }

        if (this.$root.settings.activation.disableUrlParams) {
          let joinedParams = []

          for (let paramKey in params) {
            joinedParams.push(paramKey + '=' + params[paramKey].join(','))
          }

          params = joinedParams
        }

        return this.action + '&' + params.join('&') + '&delimiter=' + this.delimiter + (this.hasSeparateBookingOption ? '&separate=' + this.separateBookings : '') + '&wpAmeliaNonce=' + window.wpAmeliaNonce
      }
    },

    components: {}
  }
</script>
