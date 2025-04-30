<template>
  <div>
    <div v-show="data.stripe.enabled">
      <el-row :gutter="24" class="zero-margin-bottom">
        <el-col :span="11">
          <el-form-item :label="$root.labels.name + ':'">
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <label class="el-form-item__label">
          {{$root.labels.value + ': '}}
          <el-tooltip placement="top">
            <div slot="content">{{ $root.labels.metadata_value_tooltip }}</div>
            <i class="el-icon-question am-tooltip-icon"></i>
          </el-tooltip>
          </label>
        </el-col>
      </el-row>
      <el-row :gutter="24" type="flex" v-for="(pair, index) in stripeMetaData" :key="index" class="small-margin-bottom am-payments-meta-data">
        <el-col :span="10">
            <el-input type="text" :name="pair.name" v-model="stripeMetaData[index].key"/>
        </el-col>
        <el-col :span="10">
            <el-input type="text" v-model="stripeMetaData[index].value"/>
        </el-col>
        <el-col :span="4">
          <span @click="deleteMetaDataPair('stripe', index)">
            <img class="svg-amelia" width="16px" :src="$root.getUrl+'public/img/delete.svg'">
          </span>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col>
          <el-button type="primary" v-on:click="addMetaDataPair('stripe')">{{$root.labels.add_metaData}}</el-button>
        </el-col>
      </el-row>
    </div>
    <div v-show="data.mollie.enabled">
      <el-row :gutter="24" class="zero-margin-bottom">
        <el-col :span="11">
          <el-form-item :label="$root.labels.name + ':'">
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <label class="el-form-item__label">
            {{$root.labels.value + ': '}}
            <el-tooltip placement="top">
              <div slot="content">{{ $root.labels.metadata_value_tooltip }}</div>
              <i class="el-icon-question am-tooltip-icon"></i>
            </el-tooltip>
          </label>
        </el-col>
      </el-row>
      <el-row :gutter="24" type="flex" v-for="(pair, index) in mollieMetaData" :key="index" class="small-margin-bottom am-payments-meta-data">
        <el-col :span="10">
          <el-input type="text" :name="pair.name" v-model="mollieMetaData[index].key"/>
        </el-col>
        <el-col :span="10">
          <el-input type="text" v-model="mollieMetaData[index].value"/>
        </el-col>
        <el-col :span="4">
          <span @click="deleteMetaDataPair('mollie', index)">
            <img class="svg-amelia" width="16px" :src="$root.getUrl+'public/img/delete.svg'">
          </span>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col>
          <el-button type="primary" v-on:click="addMetaDataPair('mollie')">{{$root.labels.add_metaData}}</el-button>
        </el-col>
      </el-row>
    </div>

    <div v-show="data.razorpay.enabled">
      <el-row :gutter="24" class="zero-margin-bottom">
        <el-col :span="11">
          <el-form-item :label="$root.labels.name + ':'">
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <label class="el-form-item__label">
            {{$root.labels.value + ': '}}
            <el-tooltip placement="top">
              <div slot="content">{{ $root.labels.metadata_value_tooltip }}</div>
              <i class="el-icon-question am-tooltip-icon"></i>
            </el-tooltip>
          </label>
        </el-col>
      </el-row>
      <el-row :gutter="24" type="flex" v-for="(pair, index) in razorpayMetaData" :key="index" class="small-margin-bottom am-payments-meta-data">
        <el-col :span="10">
          <el-input type="text" :name="pair.name" v-model="razorpayMetaData[index].key"/>
        </el-col>
        <el-col :span="10">
          <el-input type="text" v-model="razorpayMetaData[index].value"/>
        </el-col>
        <el-col :span="4">
          <span @click="deleteMetaDataPair('razorpay', index)">
            <img class="svg-amelia" width="16px" :src="$root.getUrl+'public/img/delete.svg'">
          </span>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col>
          <el-button type="primary" v-on:click="addMetaDataPair('razorpay')">{{$root.labels.add_metaData}}</el-button>
        </el-col>
      </el-row>
    </div>



    <el-form-item :label="$root.labels.description_wc + ':'" v-show="data.wc.enabled">
      <el-row type="flex" align="middle" :gutter="24" style="margin-bottom: 10px;">

        <el-col :span="24" class="align-right">
          <el-button-group>
            <el-button
              style="width: unset;"
              size="mini"
              :type="textMode ? 'default' : 'primary'"
              @click="!language ? textModeChanged('description_wc', 'description_wc_text', language) : textModeChanged('description_translated_wc_text', 'description_translated_wc', language)"
            >
              {{ $root.labels.text_mode }}
            </el-button>
            <el-button
              style="width: unset;"
              size="mini"
              :type="textMode ? 'primary' : 'default'"
              @click="!language ? textModeChanged('description_wc', 'description_wc_text', language) : textModeChanged('description_translated_wc', 'description_translated_wc_text', language)"
            >
              {{ $root.labels.html_mode }}
            </el-button>
          </el-button-group>
        </el-col>
      </el-row>

      <!-- Quill Editor -->
      <quill-editor
          v-if="!language && !textMode"
          v-model="description_wc"
          :options="editorOptions"
      >
      </quill-editor>
      <!-- /Quill Editor -->

      <el-input
          v-if="!language && textMode"
          type="textarea"
          :autosize="{ minRows: 4, maxRows: 6}"
          v-model="description_wc_text"
          @input="changedContentText('description_wc', 'description_wc_text', language)"
      >
      </el-input>

      <!-- Quill Editor -->
      <quill-editor
          v-if="language && !textMode"
          v-model="description_translated_wc[language]"
          :options="editorOptions"
      >
      </quill-editor>
      <!-- /Quill Editor -->

      <el-input
          v-if="language && textMode"
          type="textarea"
          :autosize="{ minRows: 4, maxRows: 6}"
          v-model="description_translated_wc_text[language]"
          @input="changedContentText('description_translated_wc', 'description_translated_wc_text', language)"
      >
      </el-input>
    </el-form-item>
    <el-form-item :label="$root.labels.name_razorpay + ':'" v-show="data.razorpay.enabled">
      <el-input
          type="text"
          :autosize="{ minRows: 4, maxRows: 6}"
          v-model="name_razorpay"
      >
      </el-input>
    </el-form-item>
    <el-form-item :label="$root.labels.description_paypal + ':'" v-show="data.payPal.enabled">
      <el-input
          type="textarea"
          :autosize="{ minRows: 4, maxRows: 6}"
          v-model="description_paypal"
      >
      </el-input>
    </el-form-item>
    <el-form-item :label="$root.labels.description_stripe + ':'" v-show="data.stripe.enabled">
      <el-input
          type="textarea"
          :autosize="{ minRows: 4, maxRows: 6}"
          v-model="description_stripe"
      >
      </el-input>
    </el-form-item>
    <el-form-item :label="$root.labels.description_mollie + ':'" v-show="data.mollie.enabled">
      <el-input
          type="textarea"
          :autosize="{ minRows: 4, maxRows: 6}"
          v-model="description_mollie"
      >
      </el-input>
    </el-form-item>
    <el-form-item :label="$root.labels.description_razorpay + ':'" v-show="data.razorpay.enabled">
      <el-input
          type="textarea"
          :autosize="{ minRows: 4, maxRows: 6}"
          v-model="description_razorpay"
      >
      </el-input>
    </el-form-item>
    <el-form-item :label="$root.labels.description_square + ':'" v-show="data.square.enabled">
      <el-input
          type="textarea"
          :autosize="{ minRows: 4, maxRows: 6}"
          v-model="description_square"
      >
      </el-input>
    </el-form-item>
    <el-form-item>
      <inline-placeholders
        :placeholdersNames="getInlinePlaceholdersNames()"
        :excludedPlaceholders="{
          appointmentPlaceholders: getExcludedAppointmentPlaceholders(),
          eventPlaceholders: [
            '%event_cancel_url%',
            '%lesson_space_url_date%',
            '%lesson_space_url_date_time%',
            '%google_meet_url_date%',
            '%google_meet_url_date_time%',
            '%microsoft_teams_url_date%',
            '%microsoft_teams_url_date_time%',
            '%zoom_join_url_date%',
            '%zoom_join_url_date_time%',
            '%zoom_host_url_date%',
            '%zoom_host_url_date_time%',
            '%reservation_name%',
            '%reservation_description%',
            '%group_event_details%'
          ],
          paymentPlaceholders: getExcludedPaymentPlaceholders()
        }"
        :customFields="customFields"
        :categories="categories"
        :coupons="coupons"
        userTypeTab="provider"
      >
      </inline-placeholders>
    </el-form-item>
  </div>
</template>

<script>
import InlinePlaceholders from '../notifications/common/InlinePlaceholders'
import { quillEditor } from 'vue-quill-editor'
import quillMixin from '../../../js/backend/mixins/quillMixin'

export default {
  mixins: [quillMixin],

  name: 'PaymentsMetaData',
  props: {
    customFields: {
      default: () => []
    },
    categories: {
      default: () => []
    },
    coupons: {
      default: () => []
    },
    data: Object,
    language: '',
    tab: String
  },
  data () {
    return {
      description_wc_text: '',
      description_translated_wc_text: {},
      stripeMetaData: null,
      mollieMetaData: null,
      razorpayMetaData: null
    }
  },
  created () {
    this.textMode = true

    this.description_wc_text = this.description_wc
    this.description_translated_wc_text = JSON.parse(JSON.stringify(this.description_translated_wc))

    if (this.description_wc && this.description_wc.startsWith('<!-- Content -->')) {
      this.textMode = false
    } else if (typeof this.description_wc !== 'undefined' && this.description_wc !== null) {
      this.textMode = true

      this.description_wc = this.process(
        this.description_wc.replace('<!-- Content -->', '').replace(/(\r\n|\n|\r)/gm, '')
      )

      this.description_wc_text = this.description_wc
    }
  },
  mounted () {
    this.stripeMetaData = Object.entries(this.metaDataForStripe).map(([key, value]) => ({ key, value }))
    this.stripeMetaData.push({key: '', value: ''})

    this.mollieMetaData = Object.entries(this.metaDataForMollie).map(([key, value]) => ({ key, value }))
    this.mollieMetaData.push({key: '', value: ''})

    this.razorpayMetaData = Object.entries(this.metaDataForRazorpay).map(([key, value]) => ({ key, value }))
    this.razorpayMetaData.push({key: '', value: ''})

    if (typeof this.description_wc !== 'undefined' &&
        this.description_wc !== null &&
        !this.description_wc.startsWith('<!-- Content -->')
    ) {
      this.textMode = true

      this.description_wc = this.process(
        this.description_wc.replace('<!-- Content -->', '').replace(/(\r\n|\n|\r)/gm, '')
      )

      this.description_wc_text = this.description_wc
    } else {
      this.textMode = false
    }
  },
  computed: {
    description_wc: {
      get () {
        return this.data.wc.checkoutData[this.tab]
      },
      set (newDescription) {
        this.data.wc.checkoutData[this.tab] = newDescription
      }
    },
    description_translated_wc: {
      get () {
        return this.data.wc.checkoutData.translations[this.tab]
      },
      set (newDescription) {
        this.data.wc.checkoutData.translations[this.tab] = newDescription
      }
    },
    description_paypal: {
      get () {
        return this.data.payPal.description[this.tab]
      },
      set (newDescription) {
        this.data.payPal.description[this.tab] = newDescription
      }
    },
    description_stripe: {
      get () {
        return this.data.stripe.description[this.tab]
      },
      set (newDescription) {
        this.data.stripe.description[this.tab] = newDescription
      }
    },
    description_mollie: {
      get () {
        return this.data.mollie.description[this.tab]
      },
      set (newDescription) {
        this.data.mollie.description[this.tab] = newDescription
      }
    },
    description_square: {
      get () {
        return this.data.square.description[this.tab]
      },
      set (newDescription) {
        this.data.square.description[this.tab] = newDescription
      }
    },
    description_razorpay: {
      get () {
        return this.data.razorpay.description[this.tab]
      },
      set (newDescription) {
        this.data.razorpay.description[this.tab] = newDescription
      }
    },
    name_razorpay: {
      get () {
        return this.data.razorpay.name[this.tab]
      },
      set (newDescription) {
        this.data.razorpay.name[this.tab] = newDescription
      }
    },
    metaDataForStripe: {
      get () {
        return this.data.stripe.metaData[this.tab] != null ? this.data.stripe.metaData[this.tab] : {}
      }
    },
    metaDataForMollie: {
      get () {
        return this.data.mollie.metaData[this.tab] != null ? this.data.mollie.metaData[this.tab] : {}
      }
    },
    metaDataForRazorpay: {
      get () {
        return this.data.razorpay.metaData[this.tab] != null ? this.data.razorpay.metaData[this.tab] : {}
      }
    }
  },
  methods: {
    getExcludedPaymentPlaceholders () {
      let common = [
        '%payment_link_woocommerce%',
        '%payment_link_paypal%',
        '%payment_link_stripe%',
        '%payment_link_mollie%',
        '%payment_link_razorpay%',
        '%payment_link_square%'
      ]

      switch (this.tab) {
        case ('packages'):
          return common.concat(['%appointment_deposit_payment%', '%event_deposit_payment%'])
        case ('events'):
          return common.concat(['%appointment_deposit_payment%', '%package_deposit_payment%'])
        case ('appointments'):
          return common.concat(['%package_deposit_payment%', '%event_deposit_payment%'])
      }
      return common
    },

    getExcludedAppointmentPlaceholders () {
      let excludedPlaceholders = [
        '%zoom_host_url%',
        '%zoom_join_url%',
        '%lesson_space_url%',
        '%appointment_cancel_url%',
        '%reservation_name%',
        '%reservation_description%',
        '%group_appointment_details%'
      ]

      if (this.data.wc.enabled) {
        excludedPlaceholders.push('%appointment_id%')
        excludedPlaceholders.push('%recurring_appointments_details%')
      }

      return excludedPlaceholders
    },

    getInlinePlaceholdersNames () {
      let common = [
        'customerPlaceholders',
        'companyPlaceholders',
      ]

      switch (this.tab) {
        case ('package'):
          return common.concat(
            [
              'paymentPlaceholders',
              'packagePlaceholders'
            ]
          )

        case ('event'):
          return common.concat(
            [
              'paymentPlaceholders',
              'eventPlaceholders',
              'customFieldsPlaceholders',
              'employeePlaceholders',
              'locationPlaceholders',
              'couponsPlaceholders'
            ]
          )

        case ('appointment'):
          return common.concat(
            [
              'paymentPlaceholders',
              'appointmentPlaceholders',
              'customFieldsPlaceholders',
              'employeePlaceholders',
              'categoryPlaceholders',
              'locationPlaceholders',
              'couponsPlaceholders',
              'extrasPlaceholders'
            ]
          )

        case ('cart'):
          return common.concat(
            [
              'cartPlaceholders'
            ]
          )
      }

      return common
    },
    addMetaDataPair (method) {
      this[method + 'MetaData'].push({key: '', value: ''})
    },
    deleteMetaDataPair (method, index) {
      this[method + 'MetaData'].splice(index, 1)
    }
  },
  components: {InlinePlaceholders, quillEditor}
}
</script>
