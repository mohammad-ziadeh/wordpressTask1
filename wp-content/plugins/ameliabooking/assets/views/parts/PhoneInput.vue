<template id="phone-input">
  <el-input
      v-model="input"
      :placeholder="format"
      :disabled="disabled"
      type="tel"
      name="tel"
      autocomplete="tel"
      clearable
      @clear="onClear"
  >
    <el-select
        slot="prepend"
        v-model="value"
        placeholder=""
        @change="changeCountry"
        :class="'am-selected-flag am-selected-flag-'+value"
        :popper-class="$root.settings.customization.forms ? dropdownClass : ''"
        :disabled="disabled"
    >
      <el-option
          v-for="country in countries"
          :key="country.id"
          :value="country.iso"
          label=" "
      >
        <span :class="'am-flag am-flag-'+country.iso"></span>
        <span class="am-phone-input-nicename">{{ country.nicename }}</span>
        <span class="am-phone-input-phonecode">+{{ country.phonecode }}</span>
      </el-option>
    </el-select>
  </el-input>
</template>

<script>
  import phoneCountriesMixin from '../../js/common/mixins/phoneCountriesMixin'

  export default {
    mixins: [phoneCountriesMixin],

    template: '#phone-input',

    props: {
      savedPhone: {
        default: '',
        type: String
      },
      disabled: {
        default: false,
        type: Boolean
      },
      countryPhoneIso: null,
      dropdownClass: {
        type: String,
        default: ''
      }
    },

    data () {
      return {
        input: '',
        phone: '',
        value: this.$root.settings.general.phoneDefaultCountryCode,
        format: ''
      }
    },

    mounted () {
      if (this.value !== '') {
        if (this.savedPhone) {
          this.fillInputWithSavedPhone()
        } else {
          this.formatPhoneNumber()
        }
      } else if (this.savedPhone) {
        this.fillInputWithSavedPhone()
      }
    },

    methods: {
      onClear () {
        this.value = ''
        this.phone = ''
        this.$emit('phoneFormatted', this.phone, this.value)
      },

      changeCountry () {
        if (this.value !== '' && this.input !== '') {
          this.input = ''
        }

        this.formatPhoneNumber()
      },

      formatPhoneNumber () {
        if (this.value !== '') {
          var country = this.countries.find(x => x.iso === this.value)
          this.format = this.disabled === true ? '' : country.format
        }

        let input = this.input

        if (window.localeLanguage[0] === 'ar') {
          input = input.replace(/[٠-٩]/g, d => '٠١٢٣٤٥٦٧٨٩'.indexOf(d))
        }

        if (input !== '') {
          if (input.startsWith('+')) {
            let inputValue = parseInt(input.slice(1))
            let countries = this.countries.filter(x => x.phonecode === inputValue)
            if (countries.length) {
              let country = null

              if (inputValue === 1) {
                country = countries.find(item => item.id === 229)
              } else if (inputValue === 44) {
                country = countries.find(item => item.id === 228)
              } else if (inputValue === 7) {
                country = countries.find(item => item.id === 176)
              }

              if (typeof country === 'undefined' || country === null) {
                country = countries[0]
              }

              this.value = country.iso
            }
            this.phone = input
          } else {
            if (typeof country !== 'undefined') {
              this.phone = (input.startsWith('0') === true && this.countryPhoneIso !== 'it') ? // fix for Italian numbers that starts with '0'
                '+' + country.phonecode + input.slice(1).replace(/\D/g, '') :
                '+' + country.phonecode + input.replace(/\D/g, '') }
            else {
              this.phone = input
            }
          }

          this.$emit('phoneFormatted', this.phone, this.value)
        } else {
          this.phone = input
          this.$emit('phoneFormatted', this.phone, this.value)
        }
      },

      fillInputWithSavedPhone () {
        var country = null

        if (this.countryPhoneIso !== null) {
          country = this.countries.find(x => x.iso === this.countryPhoneIso)

          if (typeof country === 'undefined') {
            country = null
          }
        }

        let i = 1
        while (country === null && i < 5) {
          country = this.countries.find(x => x.phonecode === parseInt(this.savedPhone.substr(1, i)) && x.priority === 1)
          country = typeof country !== 'undefined' ? country : null
          i++
        }

        if (!country) {
          i = 1
          while (country === null && i < 5) {
            country = this.countries.find(x => x.phonecode === parseInt(this.savedPhone.substr(1, i)))
            country = typeof country !== 'undefined' ? country : null
            i++
          }
        }

        if (country !== null) {
          this.value = country.iso
          this.input = this.savedPhone.replace('+' + country.phonecode, '')
          this.input = country.format.startsWith('0') ? '0' + this.input : this.input
        }
      }
    },

    watch: {
      'input' () {
        this.formatPhoneNumber()
      }
    },

    components: {}
  }
</script>
