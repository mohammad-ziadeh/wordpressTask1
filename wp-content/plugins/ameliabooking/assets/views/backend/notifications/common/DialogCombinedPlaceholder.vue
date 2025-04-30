<template>
  <div>
    <div class="am-dialog-scrollable">
      <!-- Dialog Header -->
      <div class="am-dialog-header">
        <el-row>
          <el-col :span="14">
            <h2>{{ $root.labels.configure_placeholder }}</h2>
          </el-col>
          <el-col :span="10" class="align-right">
            <el-button @click="closeDialog" class="am-dialog-close" size="small" icon="el-icon-close"></el-button>
          </el-col>
        </el-row>
      </div>

      <!-- Select Language -->
      <div class="align-right" v-if="userTypeTab === 'customer' && selectedLanguage">
        <img class="option-languages-flag" :src="getLanguageFlag(selectedLanguage)">
      </div>
      <!-- /Select Language -->

      <div v-if="entity === 'package'">
        <p><strong>{{ $root.labels.ph_package_details_setup }}</strong></p>
      </div>

      <div v-if="entity === 'appointment'">
        <p>
          <strong>
            {{ name === 'recurringPlaceholdersCustomer' || name === 'recurringPlaceholders' ? $root.labels.ph_recurring_details_setup : '' }}
            {{ name === 'cartPlaceholdersCustomer' || name === 'cartPlaceholders' ? $root.labels.ph_cart_details_setup : '' }}
          </strong>
        </p>
      </div>

      <div v-if="entity === 'group'">
        <p v-if="name === 'groupAppointmentPlaceholder'"><strong>{{ $root.labels.ph_group_appointment_setup }}</strong></p>
        <p v-if="name === 'groupEventPlaceholder'"><strong>{{ $root.labels.ph_group_event_setup }}</strong></p>
      </div>

      <div v-if="!selectedLanguage">
        <content-block
          v-if="type === 'email'"
          :label="$root.labels.message_colon.replace(':', '')"
          :entity="appointmentsSettings"
          :textProperty="name"
          :htmlProperty="nameHtml"
          :hasTranslation="false"
          :hasQuill="true"
          :textModeProp="true"
          :allowImage="false"
          @changeQuillContent="parseQuillEditorContent"
        >
        </content-block>

        <!-- Textarea -->
        <el-input
          v-if="type === 'sms' || type === 'whatsapp'"
          v-model="appointmentsSettings[name + 'Sms']"
          type="textarea"
          :rows="7"
          placeholder=""
        >
        </el-input>
        <!-- /Textarea -->
      </div>
      <div v-else>
        <content-block
            v-if="type === 'email'"
            :label="$root.labels.message_colon.replace(':', '')"
            :entity="appointmentsSettings['translations'][name]"
            :textProperty="selectedLanguage"
            :htmlProperty="selectedLanguage + 'Html'"
            :hasTranslation="false"
            :hasQuill="true"
            :textModeProp="true"
            :allowImage="false"
            @changeQuillContent="parseQuillEditorContent"
        >
        </content-block>

        <!-- Textarea -->
        <el-input
            v-if="type === 'sms' || type === 'whatsapp'"
            v-model="appointmentsSettings['translations'][name + 'Sms'][selectedLanguage]"
            type="textarea"
            :rows="7"
            placeholder=""
        >
        </el-input>
        <!-- /Textarea -->
      </div>

      <inline-placeholders
        :placeholdersNames="placeholdersNames"
        :excludedPlaceholders="excludedPlaceholders"
        :categories="categories"
        :customFields="customFields"
        :userTypeTab="userTypeTab"
        :no-html="type !== 'email'"
      >
      </inline-placeholders>

      <div v-if="entity === 'package'">
        <p>{{ $root.labels.use_placeholder }} %package_appointments_details%</p>
      </div>

      <div v-if="entity === 'appointment'">
        <p>
          {{ $root.labels.use_placeholder }}
          {{ name === 'recurringPlaceholdersCustomer' ? '%recurring_appointments_details%' : '' }}
          {{ name === 'cartPlaceholdersCustomer' || name === 'cartPlaceholders' ? '%cart_appointments_details%' : '' }}
        </p>

        <el-alert
            type="warning"
            show-icon
            title=""
            :description="$root.labels.group_ph_warning"
            :closable="false"
        >
        </el-alert>

      </div>

      <div v-if="entity === 'group'">
        <p v-if="name === 'groupAppointmentPlaceholder'">{{ $root.labels.use_placeholder }} %group_appointment_details%</p>
        <p v-if="name === 'groupEventPlaceholder'">{{ $root.labels.use_placeholder }} %group_event_details%</p>
      </div>


      <el-alert
        v-if="type === 'whatsapp'"
        type="info"
        show-icon
        title=""
        :description="$root.labels.whatsapp_notice_ph"
        :closable="false"
        style="margin-top:20px"
      />

    </div>

    <!-- Dialog Footer -->
    <div class="am-dialog-footer">
      <div class="am-dialog-footer-actions">
        <el-row>
          <el-col :sm="24" class="align-right">
            <el-button type="" @click="closeDialog" class="">{{ $root.labels.cancel }}</el-button>
            <el-button type="primary" @click="saveSettings" class="am-dialog-create" :loading="loadingButton">
              {{ $root.labels.save }}
            </el-button>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
  import placeholdersMixin from '../../../../js/backend/mixins/placeholdersMixin'
  import notifyMixin from '../../../../js/backend/mixins/notifyMixin'
  import quillMixin from '../../../../js/backend/mixins/quillMixin'
  import priceMixin from '../../../../js/common/mixins/priceMixin'
  import InlinePlaceholders from './InlinePlaceholders.vue'
  import { quillEditor } from 'vue-quill-editor'
  import ContentBlock from '../../parts/ContentBlock'

  export default {
    mixins: [placeholdersMixin, quillMixin, priceMixin, notifyMixin],

    props: {
      selectedLanguage: null,
      selectedLanguageHtml: null,
      languagesData: {
        default: () => {},
        type: Object
      },
      excludedPlaceholders: {
        default: () => []
      },
      placeholdersNames: {
        default: () => []
      },
      categories: {
        default: () => []
      },
      coupons: {
        default: () => []
      },
      entity: {
        default: 'appointment',
        type: String
      },
      type: {
        default: 'email',
        type: String
      },
      customFields: {
        default: []
      },
      appointmentsSettings: null,
      userTypeTab: null,
      name: null,
      nameHtml: null
    },

    data () {
      return {
        loadingButton: false
      }
    },

    mounted () {
      this.removePlaceholder('appointmentPlaceholders', '%recurring_appointments_details%')
      this.removePlaceholder('appointmentPlaceholders', '%package_appointments_details%')
      this.removePlaceholder('appointmentPlaceholders', '%group_appointment_details%')
      this.removePlaceholder('appointmentPlaceholders', '%group_event_details%')

      this.appointmentsSettings[this.name + 'Html'] = this.appointmentsSettings[this.name]

      if (this.selectedLanguage) {
        this.appointmentsSettings['translations'][this.name + 'Html'] = this.appointmentsSettings['translations'][this.name]
      }
    },

    methods: {
      getLanguageLabel (lang) {
        return this.languagesData[lang] ? this.languagesData[lang].name : ''
      },

      getLanguageFlag (lang) {
        if (lang && this.languagesData[lang] && this.languagesData[lang].country_code) {
          return this.$root.getUrl + 'public/img/flags/' + this.languagesData[lang].country_code + '.png'
        }
        return this.$root.getUrl + 'public/img/grey.svg'
      },

      saveSettings () {
        delete this.appointmentsSettings[this.name + 'Html']

        if (this.selectedLanguage) {
          delete this.appointmentsSettings['translations'][this.name + 'Html']
        }

        this.loadingButton = true

        let name = this.name + (this.type === 'sms' ? 'Sms' : '')

        if (this.selectedLanguage) {
          Object.keys(this.appointmentsSettings.translations[name]).forEach((key) => {
            if (!this.appointmentsSettings.translations[name][key].trim) {
              delete this.appointmentsSettings.translations[name][key]
            }
          })
        }

        this.$http.post(`${this.$root.getAjaxUrl}/settings`, {appointments: this.appointmentsSettings})
          .then(response => {
            this.loadingButton = false

            this.$root.settings.appointments = response.data.data.settings.appointments

            this.$emit('closeDialogCombinedPlaceholder', response.data.data.settings.appointments)

            this.notify(this.$root.labels.success, this.$root.labels.settings_saved, 'success')
          })
          .catch(e => {
            this.loadingButton = false

            this.notify(this.$root.labels.error, e.message, 'error')
          })
      },
      closeDialog () {
        this.$emit('closeDialogCombinedPlaceholder')
      }
    },

    computed: {
    },

    components: {
      quillEditor,
      ContentBlock,
      InlinePlaceholders
    }
  }
</script>
