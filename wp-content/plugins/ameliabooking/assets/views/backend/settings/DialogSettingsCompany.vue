<template>
  <div>
    <div class="am-dialog-scrollable">

      <!-- Dialog Header -->
      <div class="am-dialog-header">
        <el-row>
          <el-col :span="20">
            <h2>{{ $root.labels.company_settings }}</h2>
          </el-col>
          <el-col :span="4" class="align-right">
            <el-button @click="closeDialog" class="am-dialog-close" size="small" icon="el-icon-close"></el-button>
          </el-col>
        </el-row>
      </div>

      <!-- Form -->
      <el-form :model="settings" ref="settings" :rules="rules" label-position="top" @submit.prevent="onSubmit">

        <!-- Profile Photo -->
        <div class="am-employee-profile">
          <picture-upload
              :edited-entity="this.settings"
              :entity-name="'company'"
              v-on:pictureSelected="pictureSelected"
          >
          </picture-upload>
          <h2>{{ settings.name }}</h2>
        </div>

        <!-- Name -->
        <div class="am-event-translate" @click="showDialogTranslate()" style="display: inline-block;float: right;cursor: pointer;">
          <img class="am-dialog-translate-svg" width="16px" :src="$root.getUrl+'public/img/translate.svg'">
          {{ $root.labels.translate }}
        </div>
        <el-form-item :label="$root.labels.name+':'">
          <el-input v-model="settings.name" placeholder=""></el-input>
        </el-form-item>

        <!-- Address -->
        <el-form-item :label="$root.labels.address+':'">
          <div class="el-input">
            <vue-google-autocomplete
                v-if="$root.settings.general.gMapApiKey !== ''"
                ref="settings.address"
                id="address-autocomplete"
                classname="el-input__inner"
                placeholder=""
                v-on:placechanged="getAddressData"
                :value="settings.address"
                types=""
            >
            </vue-google-autocomplete>
            <el-input
                v-else
                v-model="settings.address"
                :value="settings.address"
                placeholder=""
            >
            </el-input>
          </div>
        </el-form-item>

        <!-- Website -->
        <el-form-item :label="$root.labels.website + ':'">
          <el-input v-model="settings.website" placeholder=""></el-input>
        </el-form-item>

        <!-- Phone -->
        <el-form-item :label="$root.labels.phone+':'">
          <phone-input
              :countryPhoneIso="settings.countryPhoneIso"
              :savedPhone="settings.phone"
              v-on:phoneFormatted="phoneFormatted"
          >
          </phone-input>
        </el-form-item>

        <!-- Email -->
        <el-form-item :label="$root.labels.email + ':'" prop="email" :error="errors.email">
          <el-input
            v-model="settings.email"
            placeholder=""
            ref="settings.email"
            @input="clearValidation()"
          >
          </el-input>
        </el-form-item>

      </el-form>


    </div>

    <!-- Dialog Footer -->
    <div class="am-dialog-footer">
      <div class="am-dialog-footer-actions">
        <el-row>
          <el-col :sm="24" class="align-right">
            <el-button type="" @click="closeDialog" class="">{{ $root.labels.cancel }}</el-button>
            <el-button type="primary" @click="onSubmit" class="am-dialog-create">{{ $root.labels.save }}</el-button>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
  import PhoneInput from '../../parts/PhoneInput.vue'
  import PictureUpload from '../parts/PictureUpload.vue'
  import VueGoogleAutocomplete from 'vue-google-autocomplete'
  import imageMixin from '../../../js/common/mixins/imageMixin'

  export default {

    mixins: [imageMixin],

    props: ['company'],

    data () {
      return {
        settings: Object.assign({}, this.company),
        errors: {
          email: ''
        },
        rules: {
          email: [
            {type: 'email', message: this.$root.labels.enter_valid_email_warning, trigger: 'submit'}
          ]
        }
      }
    },

    created () {

    },

    updated () {
      this.inlineSVG()
    },

    mounted () {
      this.inlineSVG()
    },

    methods: {
      showDialogTranslate () {
        this.$emit('showDialogTranslate', this.settings.name)
      },

      changeTranslations (translations) {
        this.settings.translations = translations ? JSON.parse(translations) : []
      },

      closeDialog () {
        this.$emit('closeDialogSettingsCompany')
      },

      onSubmit () {
        this.$refs.settings.validate((valid, validOptions) => {
          if (valid) {
            this.$emit('closeDialogSettingsCompany')
            this.$emit('updateSettings', {'company': this.settings})
          }
        })
      },

      pictureSelected (pictureFullPath, pictureThumbPath) {
        this.settings.pictureFullPath = pictureFullPath
        this.settings.pictureThumbPath = pictureThumbPath
      },

      getAddressData: function () {
        this.settings.address = document.getElementById('address-autocomplete').value
      },

      phoneFormatted (phone, countryPhoneIso) {
        this.settings.phone = phone
        this.settings.countryPhoneIso = countryPhoneIso
      },

      clearValidation () {
        this.$refs.settings.clearValidate()
      },

    },

    components: {
      VueGoogleAutocomplete,
      PhoneInput,
      PictureUpload
    }
  }
</script>
