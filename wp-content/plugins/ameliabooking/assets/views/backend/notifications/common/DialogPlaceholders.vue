<template>
  <div>
    <div class="am-dialog-scrollable">

      <!-- Dialog Header -->
      <div class="am-dialog-header">
        <el-row>
          <el-col :span="14">
            <h2>{{ $root.labels[type + '_placeholders'] }}</h2>
          </el-col>
          <el-col :span="10" class="align-right">
            <el-button @click="closeDialog" class="am-dialog-close" size="small" icon="el-icon-close"></el-button>
          </el-col>
        </el-row>
      </div>

      <!-- Placeholders -->
      <div class="am-email-codes">
        <div class="am-email-code">
          <el-tooltip
              v-for="code in sortedPlaceholders"
              :key="code.code"
              effect="dark"
              :content="code.label"
              placement="left">
            <p
              @click="copyCodeText(('parse' in code) && type === 'email' ? getParsedCodeLabel(code) : code.value)"
              :class="{'am-licence-container-disabled' : isPlaceholderInLicence(code.value)}"
            >
              <i class="el-icon-information"></i>
              <span>{{ code.value }}</span>
              <span class="am-copy-code">{{ $root.labels.copy }}</span>
              <span class="am-copied-code">{{ $root.labels.copied }}</span>
            </p>
          </el-tooltip>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
  import licenceMixin from '../../../../js/common/mixins/licenceMixin'
  import imageMixin from '../../../../js/common/mixins/imageMixin'
  import priceMixin from '../../../../js/common/mixins/priceMixin'
  import placeholdersMixin from '../../../../js/backend/mixins/placeholdersMixin'

  export default {
    mixins: [
      licenceMixin,
      placeholdersMixin,
      imageMixin,
      priceMixin
    ],

    props: {
      excludedPlaceholders: {
        default: () => []
      },
      entity: {
        default: 'appointment',
        type: String
      },
      customFields: {
        default: []
      },
      categories: {
        default: []
      },
      coupons: {
        default: []
      },
      type: {
        default: 'email',
        type: String
      },
      userTypeTab: null
    },

    data () {
      return {
      }
    },

    mounted () {
      this.inlineSVG()
      this.setPlaceholders(this.excludedPlaceholders)

      let entityPlaceholders = []

      switch (this.entity) {
        case 'event':
          entityPlaceholders = this.getEventPlaceholders()
          break

        case 'package':
          entityPlaceholders = this.getPackagePlaceholders()
          break

        case 'appointment':
          entityPlaceholders = this.getAppointmentPlaceholders().concat(this.getCartPlaceholders())
          break
      }

      this.placeholders = this.placeholders.concat(entityPlaceholders)
    },

    methods: {},

    computed: {
      sortedPlaceholders () {
        return this.placeholders.sort((a, b) => (a.value > b.value) ? 1 : ((b.value > a.value) ? -1 : 0))
      }
    }
  }
</script>
