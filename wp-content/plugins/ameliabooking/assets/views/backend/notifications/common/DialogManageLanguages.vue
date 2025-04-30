<template>
  <div>
    <div class="am-dialog-scrollable">

      <!-- Dialog Header -->
      <div class="am-dialog-header">
        <el-row>
          <el-col :span="14">
            <h2>{{ $root.labels.manage_languages }}</h2>
          </el-col>
          <el-col :span="10" class="align-right">
            <el-button @click="closeDialog" class="am-dialog-close" size="small" icon="el-icon-close"></el-button>
          </el-col>
        </el-row>
      </div>


      <!-- Languages -->
      <div class="languages-list">
        <el-row :gutter="28" v-for="(lang, index) in usedLanguages" :key="index">
          <el-col :xs="18" :sm="20" style="padding-right: 0;">
            <el-select class="select-languages" :placeholder="$root.labels.language" v-model="usedLanguages[index]" clearable filterable>
              <template slot="prefix">
                <img class="select-languages-flag" :src="getLanguageFlag(lang)">
              </template>

              <el-option
                v-for="(lang, index) in Object.keys(languagesData)"
                :key="index"
                :label="getLanguageLabel(lang)"
                :value="lang"
                :disabled="usedLanguages.indexOf(lang) !== -1 || lang === $root.locale"
              >
                <span>
                  <img class="option-languages-flag" :src="getLanguageFlag(lang)">
                  {{ getLanguageLabel(lang) }}
                </span>
              </el-option>
            </el-select>

          </el-col>
          <el-col :xs="6" :sm="4" style="padding-left: 35px;">
              <span class="am-languages-delete" @click="deleteLanguage(index)">
                <img class="svg-amelia" width="16px" :src="$root.getUrl+'public/img/delete.svg'">
              </span>
          </el-col>
        </el-row>

        <!-- Add Language -->
        <el-row style="margin-bottom: 40px;">
          <div @click="addLanguage">
            <img class="am-add-language-svg" :src="$root.getUrl+'public/img/plus-circle.svg'"/>
            <div class="am-add-language">{{ $root.labels.add_language }}</div>
          </div>
        </el-row>
      </div>

    </div>

    <!-- Dialog Footer -->
    <div class="am-dialog-footer">
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
  export default {
    props: {
      passedUsedLanguages: {
        default: () => [],
        type: Array
      },
      languagesData: {
        default: () => {},
        type: Object
      }
    },

    data () {
      return {
        usedLanguages: []
      }
    },

    mounted () {
      this.usedLanguages = Array.from(this.passedUsedLanguages)
    },

    methods: {
      closeDialog () {
        this.$emit('closeDialogManageLanguages')
      },

      saveDialog () {
        this.$emit('saveDialogManageLanguages', this.usedLanguages)
      },

      getLanguageLabel (lang) {
        return this.languagesData[lang] ? this.languagesData[lang].name : ''
      },

      getLanguageFlag (lang) {
        if (lang && this.languagesData[lang] && this.languagesData[lang].country_code) {
          return this.$root.getUrl + 'public/img/flags/' + this.languagesData[lang].country_code + '.png'
        }
        return this.$root.getUrl + 'public/img/grey.svg'
      },

      addLanguage () {
        this.usedLanguages.push('')
      },

      deleteLanguage (index) {
        this.usedLanguages.splice(index, 1)
      }
    }
  }
</script>
