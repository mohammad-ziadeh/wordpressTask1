<template>
  <div>
    <div class="am-dialog-scrollable am-add-custom-fields">

      <!-- Dialog Header -->
      <div class="am-dialog-header">
        <el-row>
          <el-col :span="20">
            <h2>{{ $root.labels.add_custom_field }}</h2>
          </el-col>
          <el-col :span="4" class="align-right">
            <el-button @click="closeDialog" class="am-dialog-close" size="small" icon="el-icon-close"></el-button>
          </el-col>
        </el-row>
      </div>

      <LicenceBlockHeader/>

      <!-- Custom Fields Selection -->
      <div :class="licenceClassDisabled()" class="am-custom-field-selection">

        <!-- Text Field, Text Area, Text Content -->
        <el-row :gutter="12">

          <!-- Text Field -->
          <el-col :sm="8">
            <div @click="addCustomField('text')" class="am-custom-field-item">
              <img :src="$root.getUrl + 'public/img/cf-text-field.svg'" class="svg-amelia">
              <p>{{ $root.labels.text }}</p>
            </div>
          </el-col>

          <!-- Text Area -->
          <el-col :sm="8">
            <div @click="addCustomField('text-area')" class="am-custom-field-item">
              <img :src="$root.getUrl + 'public/img/cf-text-area.svg'" class="svg-amelia">
              <p>{{ $root.labels['text-area'] }}</p>
            </div>
          </el-col>

          <!-- Text Content -->
          <el-col :sm="8">
            <div @click="addCustomField('content')" class="am-custom-field-item">
              <img :src="$root.getUrl + 'public/img/cf-text-content.svg'" class="svg-amelia">
              <p>{{ $root.labels.text_content }}</p>
            </div>
          </el-col>

        </el-row>

        <!-- Selectbox, Checkbox, Radio Buttons -->
        <el-row :gutter="12">

          <!-- Selectbox -->
          <el-col :sm="8">
            <div @click="addCustomField('select')" class="am-custom-field-item">
              <img :src="$root.getUrl + 'public/img/cf-dropdown.svg'" class="svg-amelia">
              <p>{{ $root.labels.select }}</p>
            </div>
          </el-col>

          <!-- Checkbox -->
          <el-col :sm="8">
            <div @click="addCustomField('checkbox')" class="am-custom-field-item">
              <img :src="$root.getUrl + 'public/img/cf-checkbox.svg'" class="svg-amelia">
              <p>{{ $root.labels.checkbox }}</p>
            </div>
          </el-col>

          <!-- Radio Buttons -->
          <el-col :sm="8">
            <div @click="addCustomField('radio')" class="am-custom-field-item">
              <img :src="$root.getUrl + 'public/img/cf-radio-buttons.svg'" class="svg-amelia">
              <p>{{ $root.labels.radio }}</p>
            </div>
          </el-col>

        </el-row>

        <!-- Upload File, Date Picker -->
        <el-row :gutter="12">

          <!-- Upload File -->
          <el-col :sm="8">
            <div @click="addCustomField('file')" class="am-custom-field-item">
              <img :src="$root.getUrl + 'public/img/cf-upload-file.svg'" class="svg-amelia">
              <p>{{ $root.labels.file }}</p>
            </div>
          </el-col>


          <!-- Date Picker -->
          <el-col :sm="8">
            <div @click="addCustomField('datepicker')" class="am-custom-field-item">
              <img :src="$root.getUrl + 'public/img/cf-datepicker.svg'" class="svg-amelia">
              <p>{{ $root.labels.datepicker}}</p>
            </div>
          </el-col>

          <!-- Radio Buttons -->
          <el-col :sm="8">
            <div @click="addCustomField('address')" class="am-custom-field-item" :class="{'am-custom-field-item-disabled' : !$root.settings.general.gMapApiKey}">
              <img v-if="$root.settings.general.gMapApiKey" :src="$root.getUrl + 'public/img/cf-address.svg'" class="svg-amelia">
              <img v-else :src="$root.getUrl + 'public/img/cf-address-disabled.svg'" class="svg-amelia">
              <p>{{ $root.labels.address }}</p>
              <el-tooltip v-if="!$root.settings.general.gMapApiKey" placement="top" class="am-custom-field-item-tooltip">
                <div slot="content" v-html="$root.labels.address_disabled_tooltip"></div>
                <i class="el-icon-question am-tooltip-icon"></i>
              </el-tooltip>
            </div>
          </el-col>


        </el-row>

      </div>

    </div>

  </div>
</template>

<script>
  import licenceMixin from '../../../../js/common/mixins/licenceMixin'
  import imageMixin from '../../../../js/common/mixins/imageMixin'

  export default {
    mixins: [
      licenceMixin,
      imageMixin
    ],

    data () {
      return {}
    },

    updated () {
      this.inlineSVG()
    },

    methods: {
      closeDialog () {
        this.$emit('closeDialogCustomFields')
      },

      addCustomField (type) {
        this.$emit('addCustomField', type)
      }
    },

    components: {
    }
  }
</script>
