<template>
  <div class="am-dialog-translate">

    <div class="am-dialog-scrollable" :style="dialogStyle">

      <!-- Dialog Header -->
      <div class="am-dialog-header">
        <el-row>
          <el-col :span="16">
            <img class="am-dialog-translate-svg-back" :src="$root.getUrl+'public/img/arrow-back.svg'" @click="goBack">
            <h2>{{ getHeaderTitle()}}</h2>
          </el-col>

          <el-col :span="8" class="align-right">
            <el-button class="am-dialog-close" @click="closeDialog" size="small" icon="el-icon-close"></el-button>
          </el-col>
        </el-row>
      </div>

      <LicenceBlockHeader/>

      <!-- Old Translations -->
      <div :class="licenceClassDisabled()" v-for="(translation, key) in oldTranslations" :key="key">
        <el-row :gutter="28" type="flex" v-if="usedLanguages && usedLanguages.indexOf(key) !== -1">
          <!-- Language -->
          <el-col :xs="languageWidth" :sm="languageWidth" style="padding-right: 0">
            <div class="used-language">
              <img class="am-dialog-translate-flag" :src="getLanguageFlag(key)">
              {{ getLanguageLabel(key, true) }}
            </div>
          </el-col>

          <!-- Translation -->
          <el-col :xs="8" :sm="14" v-if="(type === 'name' || type === 'firstName' || type === 'lastName') && tab !== 'cf' && tab !== 'tickets'" style="padding-right: 0">
            <el-input v-model="oldTranslations[key]" type="text" :placeholder="$root.labels.translation">
            </el-input>
          </el-col>
        </el-row>

        <!-- Description Translation -->
        <el-row class="am-dialog-translate-description" style="margin-bottom: 8px" :gutter="24" type="flex" v-if="type === 'description' && usedLanguages && usedLanguages.indexOf(key) !== -1">
          <el-col :sm="24" style="padding-right: 0">
            <content-block
              :label="$root.labels.description"
              :entity="oldTranslations"
              :property="key"
              :textProperty="key"
              :htmlProperty="key + 'Html'"
              :hasTranslation="false"
              :hasQuill="hasQuill"
              :textModeProp="true"
              :allowImage="false"
            >
            </content-block>
          </el-col>
        </el-row>

        <!-- Url -->
        <el-row class="am-dialog-translate-description" :gutter="24" type="flex" v-if="type === 'url' && usedLanguages && usedLanguages.indexOf(key) !== -1">
          <el-col :sm="24" style="padding-right: 0">
            <el-input v-model="oldTranslations[key]" :value="translation" placeholder="https://test.site.com/customer-panel/">
            </el-input>
          </el-col>
        </el-row>

        <!-- Custom Field -->
        <el-row class="am-dialog-translate-description" :gutter="26" type="flex" v-if="tab === 'cf' && usedLanguages && usedLanguages.indexOf(key) !== -1">
          <!-- Language -->
          <el-col :sm="5">
            <div class="am-dialog-translate-cf"> {{ $root.labels.label_name }} </div>
          </el-col>
          <!-- Label -->
          <el-col :sm="5">
            <div class="am-dialog-translate-cf-label">
              <i>{{name}}</i>
            </div>
          </el-col>
          <!-- Translation -->
          <el-col :sm="14" style="padding-right: 0">
            <el-input v-model="oldTranslations[key]" :value="translation" type="text" placeholder=" ">
            </el-input>
          </el-col>
        </el-row>

        <!-- Custom Field Options -->
        <div v-if="cfOptions.length && usedLanguages && usedLanguages.indexOf(key) !== -1" v-for="(option, i) in options">
          <el-row :gutter="20" type="flex" class="am-dialog-translate-description">
            <el-col :sm="5">
              <div class="am-dialog-translate-cf"> #{{i}}</div>
            </el-col>
            <el-col :sm="5">
              <div class="am-dialog-translate-cf-label">
                <i>{{option.label}}</i>
              </div>
            </el-col>
            <el-col :sm="14" style="padding-right: 0">
              <el-input type="text" v-model="option['translations'][key]" placeholder=" ">
              </el-input>
            </el-col>
          </el-row>
        </div>

        <!-- Collection -->
        <div v-if="eventTickets.length && usedLanguages && usedLanguages.indexOf(key) !== -1" v-for="item in tickets">
          <el-row :gutter="20" type="flex" class="am-dialog-translate-description">
            <el-col :sm="5">
              <div class="am-dialog-translate-cf-label">
                <i>{{item.name}}</i>
              </div>
            </el-col>
            <el-col :sm="19" style="padding-right: 0">
              <el-input type="text" v-model="item['translations'][key]" placeholder=" ">
              </el-input>
            </el-col>
          </el-row>
        </div>

        <!-- Collection -->
        <div v-if="badges.length && usedLanguages && usedLanguages.indexOf(key) !== -1" v-for="item in badges">
          <el-row :gutter="20" type="flex" class="am-dialog-translate-description">
            <el-col :sm="8">
              <div class="am-dialog-translate-cf-label">
                <i>{{item.content}}</i>
              </div>
            </el-col>
            <el-col :sm="16" style="padding-right: 0">
              <el-input type="text" v-model="item['translations'][key]" placeholder=" ">
              </el-input>
            </el-col>
          </el-row>
        </div>
      </div>


      <!-- New Translations -->
      <div :class="licenceClassDisabled()" v-for="(translation, index) in newTranslations" :key="index">
        <el-row :gutter="28" type="flex" style="margin-right: -15px">
          <el-col :sm="languageWidth" style="padding-right: 0">
            <el-select :placeholder=$root.labels.language v-model="newTranslations[index].lan" clearable filterable>
              <template slot="prefix">
                <img class="am-dialog-translate-flag-selected" :src="getLanguageFlag(newTranslations[index].lan)">
              </template>
              <el-option
                v-for="(lang, index) in allLanguagesKeys"
                :key="index"
                :label="getLanguageLabel(lang, false)"
                :value="lang"
                :disabled="lang in oldTranslations || lang === $root.locale"
              >
                <span>
                  <img class="am-dialog-translate-flag" :src="getLanguageFlag(lang)">
                  {{ getLanguageLabel(lang, false) }}
                </span>
              </el-option>
            </el-select>
          </el-col>

          <el-col :xs="14" :sm="18" v-if="(type === 'name' || type === 'firstName' || type === 'lastName') && tab !== 'cf' && tab !== 'tickets'" style="padding-right: 0">
            <el-input type="text" :name="translation.name" v-model="newTranslations[index].value" :placeholder="$root.labels.translation"/>
          </el-col>
        </el-row>

        <el-row class="am-dialog-translate-description" :gutter="24" type="flex" v-if="type === 'description'">
          <el-col :sm="24">
            <el-input v-model="newTranslations[index].value" :value="translation" type="textarea" :autosize="{minRows: 4, maxRows: 6}">
            </el-input>
          </el-col>
        </el-row>

        <el-row class="am-dialog-translate-description" :gutter="24" type="flex" v-if="type === 'url'">
          <el-col :sm="24">
            <el-input v-model="newTranslations[index].value" :value="translation" placeholder="https://test.site.com/customer-panel/">
            </el-input>
          </el-col>
        </el-row>

        <!-- Custom Field -->
        <el-row class="am-dialog-translate-description" :gutter="20" type="flex" v-if="tab === 'cf'">
          <el-col :sm="5">
            <div class="am-dialog-translate-cf"> {{ $root.labels.label_name }} </div>
          </el-col>
          <el-col :sm="5">
            <div class="am-dialog-translate-cf-label">
              <i>{{name}}</i>
            </div>
          </el-col>
          <el-col :sm="14" style="padding-right: 0">
            <el-input type="text" :name="translation.name" v-model="newTranslations[index].value"/>
          </el-col>
        </el-row>
        <!-- Custom Field Options-->
        <div v-if="cfOptions.length" v-for="(option, i) in options">
          <el-row class="am-dialog-translate-description" :gutter="24" type="flex">
            <el-col :sm="5">
              <div class="am-dialog-translate-cf"> #{{i}}</div>
            </el-col>
            <el-col :sm="5">
              <div class="am-dialog-translate-cf-label">
                <i>{{option.label}}</i>
              </div>
            </el-col>
            <el-col :sm="14" style="padding-right: 0">
              <el-input type="text" v-model="option['translations'][newTranslations[index].lan]" placeholder=" ">
              </el-input>
            </el-col>
          </el-row>
        </div>
        <!-- Collection -->
        <div v-if="eventTickets.length" v-for="item in tickets">
          <el-row class="am-dialog-translate-description" :gutter="24" type="flex">
            <el-col :sm="5">
              <div class="am-dialog-translate-cf-label">
                <i>{{item.name}}</i>
              </div>
            </el-col>
            <el-col :sm="19" style="padding-right: 0">
              <el-input type="text" v-model="item['translations'][newTranslations[index].lan]" placeholder=" ">
              </el-input>
            </el-col>
          </el-row>
        </div>

        <div v-if="badges.length" v-for="item in badges">
          <el-row class="am-dialog-translate-description" :gutter="24" type="flex">
            <el-col :sm="8">
              <div class="am-dialog-translate-cf-label">
                <i>{{item.content}}</i>
              </div>
            </el-col>
            <el-col :sm="16" style="padding-right: 0">
              <el-input type="text" v-model="item['translations'][newTranslations[index].lan]" placeholder=" ">
              </el-input>
            </el-col>
          </el-row>
        </div>
      </div>

      <div :class="licenceClassDisabled()" v-if="$root.settings.role !== 'provider'">
        <img  @click="addLanguage" class="am-dialog-translate-svg-plus" :src="$root.getUrl+'public/img/plus-circle.svg'"/>
        <div @click="addLanguage" class="add-language">{{ $root.labels.add_language }}</div>
      </div>

    </div>

    <!-- Dialog Footer -->
    <div class="am-dialog-footer" v-if="tab === 'category' || tab === 'cf' || tab === 'tickets' || tab === 'roles' || type === 'badges'">
      <div class="am-dialog-footer-actions">
        <el-row>
          <el-col :sm="24" class="align-right">
            <el-button type="" @click="closeDialog" class="">{{ $root.labels.cancel }}</el-button>
            <el-button type="primary" @click="saveDialog" class="am-dialog-create">{{ $root.labels.save }}</el-button>
          </el-col>
        </el-row>
      </div>
    </div>

  </div>
</template>

<script>
import licenceMixin from '../../../js/common/mixins/licenceMixin'
import imageMixin from '../../../js/common/mixins/imageMixin'
import ContentBlock from '../parts/ContentBlock'

export default {
  mixins: [
    licenceMixin,
    imageMixin
  ],

  name: 'DialogTranslate',

  props: {
    passedTranslations: null,
    name: '',
    allLanguagesData: null,
    usedLanguages: null,
    type: {
      required: false,
      default: 'name',
      type: String
    },
    tab: '',
    cfOptions: {
      required: false,
      default: function () {
        return []
      },
      type: Array
    },
    eventTickets: {
      required: false,
      default: function () {
        return []
      },
      type: Array
    },
    employeeBadges: {
      required: false,
      default: function () {
        return []
      },
      type: Array
    },
    hasQuill: true
  },

  data () {
    return {
      translations: null,
      oldTranslations: null,
      newTranslations: [],
      settings: null,
      newLanguages: [],
      languageWidth: 12,
      options: [],
      tickets: [],
      allLanguagesKeys: [],
      badges: []
    }
  },

  mounted () {
    this.translations = this.passedTranslations ? JSON.parse(this.passedTranslations) : {}
    this.oldTranslations = this.translations[this.type] ? this.translations[this.type] : {}

    let newUsedLanguages = this.oldTranslations
      ? this.usedLanguages.filter(e => !Object.keys(this.oldTranslations).includes(e))
      : this.usedLanguages

    newUsedLanguages.forEach((n) => { this.oldTranslations[n] = '' })

    if (_.isEmpty(this.oldTranslations)) {
      this.addLanguage()
    }

    this.oldTranslations = JSON.parse(JSON.stringify(this.oldTranslations))

    if (this.type === 'description' || this.tab === 'cf' || this.tab === 'tickets' || this.type === 'url' || this.type === 'badges') {
      this.languageWidth = 24
    }

    let options = JSON.parse(JSON.stringify(this.cfOptions))

    options.forEach(option => {
      if (option.translations) {
        option.translations = JSON.parse(option.translations)
      } else {
        option.translations = {}
      }
      this.usedLanguages.forEach(language => {
        if (!option.translations[language]) {
          option.translations[language] = ''
        }
      })
    })

    this.options = options

    let tickets = JSON.parse(JSON.stringify(this.eventTickets))

    tickets.forEach(ticket => {
      if (ticket.translations) {
        ticket.translations = JSON.parse(ticket.translations)
      } else {
        ticket.translations = {}
      }
      this.usedLanguages.forEach(language => {
        if (!ticket.translations[language]) {
          ticket.translations[language] = ''
        }
      })
    })

    this.tickets = tickets

    if (this.type === 'badges') {
      let badges = JSON.parse(JSON.stringify(this.employeeBadges))

      badges.forEach(badge => {
        if (badge.translations) {
          badge.translations = JSON.parse(badge.translations)
        } else {
          badge.translations = {}
        }
        this.usedLanguages.forEach(language => {
          if (!badge.translations[language]) {
            badge.translations[language] = ''
          }
        })
      })

      this.badges = badges
    }

    this.allLanguagesKeys = Object.keys(this.allLanguagesData)
  },

  computed: {
    dialogStyle () {
      if (this.tab !== 'cf' && this.tab !== 'tickets' && this.tab !== 'category' && this.tab !== 'roles' && this.tab !== 'badges') {
        return 'margin-bottom: 0'
      }
      return ''
    }
  },

  methods: {
    saveDialog () {
      this.newTranslations.forEach(tr => {
        if (tr.lan) {
          if (!this.usedLanguages.includes(tr.lan)) {
            this.newLanguages.push(tr.lan)
          }
          this.oldTranslations[tr.lan] = tr.value
        }
      })

      this.translations[this.type] = this.oldTranslations

      this.options.forEach(option => {
        option.edited = true
        option.translations = JSON.stringify(option.translations)
      })

      this.tickets.forEach(ticket => {
        ticket.edited = true
        ticket.translations = JSON.stringify(ticket.translations)
      })

      if (this.type === 'badges') {
        this.badges.forEach(badge => {
          badge.translations = JSON.stringify(badge.translations)
        })
      } else {
        this.badges = null
      }

      this.$emit('saveDialogTranslate', JSON.stringify(this.translations), this.newLanguages, this.tab, this.options, this.tickets, this.badges)
    },

    closeDialog () {
      this.$emit('closeDialogTranslate')
    },

    addLanguage () {
      this.newTranslations.push({'lan': '', 'value': ''})
    },

    getLanguageLabel (lang, cut) {
      if (cut && (this.type === 'name' || this.type === 'firstName' || this.type === 'lastName') && this.tab !== 'cf' && this.tab !== 'tickets' && this.tab !== 'badges') {
        return this.allLanguagesData[lang].name.substring(0, 21)
      }
      return this.allLanguagesData[lang].name
    },

    getLanguageFlag (lang) {
      if (lang && this.allLanguagesData[lang] && this.allLanguagesData[lang].country_code) {
        return this.$root.getUrl + 'public/img/flags/' + this.allLanguagesData[lang].country_code + '.png'
      }
      return this.$root.getUrl + 'public/img/grey.svg'
    },

    goBack () {
      if (this.tab === 'cf' || this.tab === 'tickets' || this.tab === 'category' || this.type === 'badges') {
        this.closeDialog()
      } else {
        this.saveDialog()
      }
    },

    getHeaderTitle () {
      if (this.tab === 'cf') {
        return this.$root.labels.translate + ' ' + this.$root.labels.custom_field
      }
      if (this.tab === 'tickets') {
        return this.$root.labels.translate + ' ' + this.$root.labels.event_tickets
      }
      if (this.type === 'description') {
        return this.$root.labels.translate + ' ' + this.$root.labels.description
      }
      if (this.type === 'url') {
        return this.$root.labels.url
      }
      if (this.type === 'badges') {
        return this.$root.labels.translate + ' ' + this.$root.labels.employee_badge
      }
      return this.$root.labels.translate + ' ' + this.name
    }
  },

  components: {
    ContentBlock
  }
}
</script>
