<template>
  <div class="am-select-translate">

    <el-select class="select-languages" :placeholder="$root.labels.language" v-model="selectedLanguage" clearable filterable @change="languageChanged">
      <li class="el-select-dropdown__item" v-if="callbackDialog">
        <span>
          <img class="option-languages-flag" :src="$root.getUrl+'public/img/translate.svg'">
          {{ $root.labels.manage_languages }}
        </span>
      </li>
      <hr v-if="callbackDialog && $root.settings.general.usedLanguages.length > 0">

      <template slot="prefix">
        <img class="select-languages-flag" :src="getLanguageFlag(selectedLanguage)">
      </template>

      <el-option
        v-for="(lang, index) in $root.settings.general.usedLanguages"
        :key="index"
        :label="getLanguageLabel(lang)"
        :value="lang"
      >
        <span>
          <img class="option-languages-flag" :src="getLanguageFlag(lang)">
          {{ getLanguageLabel(lang) }}
        </span>
      </el-option>

    </el-select>

  </div>
</template>

<script>
export default {
  props: {
    callbackDialog: ''
  },

  data () {
    return {
      selectedLanguage: null
    }
  },

  methods: {
    languageChanged () {
      this.$emit('languageChanged', this.selectedLanguage)
    },

    getLanguageLabel (lang) {
      return this.$root.languages[lang] ? this.$root.languages[lang].name : ''
    },

    getLanguageFlag (lang) {
      if (lang && this.$root.languages[lang] && this.$root.languages[lang].country_code) {
        return this.$root.getUrl + 'public/img/flags/' + this.$root.languages[lang].country_code + '.png'
      }

      return this.$root.getUrl + 'public/img/grey.svg'
    }
  }
}
</script>
