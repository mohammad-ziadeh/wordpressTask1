<template>
  <div>

    <h3 :style="{color: formColors.formTextColor}">
      {{ formLabels.extras.value || $root.labels.extras }}
    </h3>

    <el-collapse>
      <!-- Extra Item -->
      <el-collapse-item
          v-for="(extra, index) in extras"
          :key="index"
          class="am-extra"
          :name="index"
          :style="{color: formColors.formTextColor}"
      >
        <template slot="title">
          <span :style="{color: formColors.formTextColor}">
            {{ extra.name }}
          </span>
        </template>

        <!-- Extra Duration -->
        <div class="am-extra-duration" v-if="extra.duration !== null">
          <el-col
            :span="12"
            :style="{color: formColors.formTextColor}"
          >
            {{ formLabels.duration_colon.value || $root.labels.duration_colon }}
          </el-col>
          <el-col
            :span="12"
            class="am-align-right"
            :style="{color: formColors.formTextColor}"
          >
            {{ secondsToNiceDuration(extra.duration) }}
          </el-col>
        </div>

        <!-- Extra Price -->
        <div class="am-extra-price">
          <el-col
            :span="12"
            :style="{color: formColors.formTextColor}"
          >
            {{ formLabels.price_colon.value || $root.labels.price_colon }}
          </el-col>
          <el-col
            :span="12"
            class="am-align-right"
            :style="{color: formColors.formTextColor}"
          >
            {{ getFormattedPrice(extra.price, !$root.settings.payments.hideCurrencySymbolFrontend)  }}
          </el-col>
        </div>

        <!-- Extra Max Capacity -->
        <div class="am-extra-capacity">
          <el-col
            :span="12"
            :style="{color: formColors.formTextColor}"
          >
            {{ formLabels.maximum_quantity_colon.value || $root.labels.maximum_quantity_colon }}
          </el-col>
          <el-col
            :span="12"
            class="am-align-right"
            :style="{color: formColors.formTextColor}"
          >
            {{ extra.maxQuantity }}
          </el-col>
        </div>

        <!-- Extra Description -->
        <div v-if="extra.description" class="am-extra-description ql-description">
          <el-col
            :lg="24"
            class="am-align-justify"
            :style="{color: formColors.formTextColor}"
            v-html="(formLabels.description_colon.value || $root.labels.description_colon) + ' ' + extra.description"
          >
          </el-col>
        </div>

      </el-collapse-item>

    </el-collapse>

  </div>
</template>

<script>
  import durationMixin from '../../../../js/common/mixins/durationMixin'
  import priceMixin from '../../../../js/common/mixins/priceMixin'
  import entitiesMixin from '../../../../js/common/mixins/entitiesMixin'

  export default {

    mixins: [durationMixin, priceMixin, entitiesMixin],

    props: {
      formColors: {
        type: Object
      },
      formLabels: {
        type: Object
      },
      extras: {
        type: Array
      }
    }

  }
</script>
