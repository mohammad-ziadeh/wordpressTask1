<template>
    <div>
        <el-row class="am-notifications-placeholders">
          <el-col :sm="24">
            <div class="am-placeholder-wrapper">
              <el-dropdown :key=columnKey v-for="(placeholdersType, columnKey) in placeholdersNames" class="am-placeholder-wrapper__dropdown" v-if="placeholdersType in groupedPlaceholders && groupedPlaceholders[placeholdersType].length">
                <el-button class="am-placeholder-wrapper__button" size="small">
                  {{ $root.labels[placeholdersType] }}<i class="el-icon-arrow-down el-icon--right"></i>
                </el-button>
                <el-dropdown-menu slot="dropdown" :class="{'amelia-dropdown': groupedPlaceholders[placeholdersType].length > 20}">
                  <el-dropdown-item
                    :key=placeholderKey
                    v-for="(code, placeholderKey) in groupedPlaceholders[placeholdersType]"
                    v-if="!((placeholdersType in excludedPlaceholders) && (excludedPlaceholders[placeholdersType].indexOf(code.value) !== -1))"
                    :disabled="isPlaceholderInLicence(code.value)"
                  >
                    <el-tooltip
                      :key="code.code"
                      effect="dark"
                      :content="code.label"
                      placement="left"
                    >
                      <p @click="copyCodeText(('parse' in code && !noHtml) ? getParsedCodeLabel(code) : code.value)">
                        {{ code.value }}
                      </p>
                    </el-tooltip>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>

          </el-col>
        </el-row>
    </div>
</template>

<script>
import licenceMixin from '../../../../js/common/mixins/licenceMixin'
import placeholdersMixin from '../../../../js/backend/mixins/placeholdersMixin'
import priceMixin from '../../../../js/common/mixins/priceMixin'

export default {
  mixins: [
    licenceMixin,
    placeholdersMixin,
    priceMixin
  ],

  props: {
    placeholdersNames: {
      default: () => []
    },
    excludedPlaceholders: {
      default: () => []
    },
    categories: {
      default: () => []
    },
    coupons: {
      default: () => []
    },
    customFields: {
      default: () => []
    },
    cart: {
      default: () => []
    },
    userTypeTab: null,
    noHtml: false
  },

  data () {
    return {
    }
  },

  mounted () {
    this.setPlaceholders(this.excludedPlaceholders)
  },

  methods: {
  },

  computed: {
  },

  watch: {
    excludedPlaceholders () {
      this.setPlaceholders(this.excludedPlaceholders)
    }
  }
}
</script>
