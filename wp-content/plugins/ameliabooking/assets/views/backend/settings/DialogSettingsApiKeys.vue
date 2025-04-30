<template>
  <div>
    <div class="am-dialog-scrollable">

      <!-- Dialog Header -->
      <div class="am-dialog-header">
        <el-row>
          <el-col :span="20">
            <h2>{{ $root.labels.api_keys }}</h2>
          </el-col>
          <el-col :span="4" class="align-right">
            <el-button @click="closeDialog" class="am-dialog-close" size="small" icon="el-icon-close"></el-button>
          </el-col>
        </el-row>
      </div>

      <LicenceBlockHeader :licence="'developer'"/>

      <!-- Form -->
      <el-form :class="licenceClassDisabled('developer')" :model="settings" ref="settings" label-position="top" @submit.prevent="onSubmit">

        <!-- API KEY URL -->
        <el-alert
            type="info"
            show-icon
            title=""
            :description="$root.labels.api_url + $root.getAjaxUrl + '/api/v1'"
            :closable="false"
            style="margin-bottom: 16px"
        />
        <!-- /API KEY URL -->

        <el-row type="flex" align="middle" :gutter="24" class="am-api-key-generate">
          <el-col :span="18">
            {{ $root.labels.your_api_key }}
            <el-input :value="newApiKey" id="am-new-api-key" :placeholder="$root.labels.api_key_placeholder">
              <i
                  v-if="newApiKey"
                  class="el-icon-copy-document"
                  slot="suffix"
                  @click="copyApiKey"
              >
              </i>
            </el-input>
          </el-col>
          <el-col :span="6" class="align-right">
            <el-button @click="generateApiKey()" type="primary">
              {{ $root.labels.generate }}
            </el-button>
          </el-col>
        </el-row>
        <!-- API KEY -->

        <el-row type="flex" :gutter="24" v-if="copied">
          <el-col :span="24" class="am-api-key-warning" style="color: #019719">
            {{ $root.labels.api_key_copied }}
          </el-col>
        </el-row>

        <el-alert
            v-if="newApiKey"
            type="warning"
            show-icon
            title=""
            :description="$root.labels.generate_api_key_warning"
            :closable="false"
            style="margin-bottom: 16px; margin-top: 8px"
        />



        <el-row v-if="apiKeys.apiKeys.length > 0" type="flex" align="middle"
                class="am-api-key-heading">
          <el-col :span="2">
            <b>{{ $root.labels.id }}</b>
          </el-col>
          <el-col :span="4">
            <b>{{ $root.labels.api_key }}</b>
          </el-col>
          <el-col :span="10">
            <b>{{ $root.labels.api_key_expiration_date }}</b>
          </el-col>
          <el-col :span="8"></el-col>
        </el-row>
        <el-row type="flex" align="middle" v-for="(apiKey, index) in apiKeys.apiKeys" :key="apiKey.id"
                class="am-api-key-row"
                :class="{
                'expiration-close' : expirationDateClose(apiKey.expiration*1000),
                'expiration-passed' : expirationDatePassed(apiKey.expiration*1000),
                'am-api-key-row-first' : index === 0
              }"
        >
          <el-col :span="2">{{ apiKey.id }}</el-col>
          <el-col :span="4">...{{ apiKey.last4 }}</el-col>
          <el-col :span="10"
                  :class="{
                  'expiration-close-text' : expirationDateClose(apiKey.expiration*1000),
                  'expiration-passed-text' : expirationDatePassed(apiKey.expiration*1000)}"
          >{{ getFrontedFormattedDateTime(new Date(apiKey.expiration*1000)) }}</el-col>
          <el-col :span="8">
            <!--          <el-button-->
            <!--              class="am-button-icon"-->
            <!--              @click="$emit('openPermissionsDialog', apiKey)"-->
            <!--          >-->
            <!--            <img class="svg-amelia" :alt="$root.labels.delete" :src="$root.getUrl+'public/img/edit.svg'"/>-->
            <!--          </el-button>-->
            <el-button
                class="am-button-icon"
                @click="deleteKey(apiKey.id)"
            >
              <img class="svg-amelia" :alt="$root.labels.delete" :src="$root.getUrl+'public/img/delete.svg'"/>
            </el-button>
          </el-col>
        </el-row>
      </el-form>


    </div>

    <!-- Dialog Footer -->
    <div class="am-dialog-footer">
      <div class="am-dialog-footer-actions">
        <el-row>
          <el-col :span="12" style="display: flex">
            <el-tooltip placement="top">
              <div slot="content" v-html="$root.labels.api_documentation"></div>
              <el-button
                  class="am-google-calendar-button am-button-icon"
                  type="primary"
                  @click="goToDocumentation()"
              >
                <img class="svg-amelia" :src="$root.getUrl + 'public/img/question.svg'"/>
              </el-button>
            </el-tooltip>
          </el-col>
          <el-col :sm="12" class="align-right">
            <el-button type="" @click="closeDialog" class="">{{ $root.labels.cancel }}</el-button>
            <el-button type="primary" @click="onSubmit" class="am-dialog-create">{{ $root.labels.save }}</el-button>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
import crypto from 'crypto'
import moment from 'moment'
import licenceMixin from '../../../js/common/mixins/licenceMixin'
import dateMixin from '../../../js/common/mixins/dateMixin'
import imageMixin from '../../../js/common/mixins/imageMixin'

export default {

  props: {
    apiKeys: {
      type: Object
    }
  },

  data () {
    return {
      newApiKey: null,
      settings: Object.assign({}, this.apiKeys),
      copied: false
    }
  },

  mixins: [
    licenceMixin,
    dateMixin,
    imageMixin
  ],

  mounted () {
    this.settings.apiKeys.forEach(apiKey => {
      apiKey.isNew = false
    })
  },

  methods: {
    goToDocumentation () {
      window.open('https://wpamelia.com/api-endpoints/', '_blank')
    },

    async copyApiKey () {
      try {
        const input = document.getElementById('am-new-api-key')
        input.focus()
        input.select()
        await navigator.clipboard.writeText(this.newApiKey)
        this.copied = true
      } catch ($e) {
        console.log($e)
      }
    },

    expirationDateClose (date) {
      let days = this.dateDiffDays(date)
      return days <= 7 && days > 0
    },

    expirationDatePassed (date) {
      return this.dateDiffDays(date) <= 0
    },

    dateDiffDays (date) {
      let d1 = new Date(date)
      let today = new Date()
      let diffTime = d1 - today
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    },

    deleteKey (id) {
      let index = this.settings.apiKeys.map(el => el.id).indexOf(id)
      if (index !== -1) {
        this.settings.apiKeys.splice(index, 1)
      }
    },

    generateApiKey () {
      const key = crypto.randomBytes(33).toString('base64')
      let lastId = this.settings.apiKeys.reduce((max, a) => max.id > a.id ? max : a, 0)
      let apiKey = {id: (lastId ? lastId.id : 0) + 1, key: key, last4: key.slice(-4), expiration: moment().add(1, 'y').unix(), permissions: [], isNew: true}
      this.settings.apiKeys.push(apiKey)
      this.newApiKey = apiKey.key
      this.copied = false
    },

    closeDialog () {
      this.$emit('closeDialogSettingsApiKeys')
    },

    onSubmit () {
      this.$emit('closeDialogSettingsApiKeys')
      this.$emit('updateSettings', {'apiKeys': this.settings})
    }
  }
}
</script>
