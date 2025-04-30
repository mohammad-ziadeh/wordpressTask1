<template>
  <div>
    <el-row v-for="bookable in selectedPackage.availableBookableInfo" :key="bookable.serviceId">
      <el-col :span="16" class="am-package-service">
        <div class="am-package-service__inner">
          <span
            class="am-package-service__name"
            :class="$root.settings.customization.forms ? `am-block-${classIdentifier}`: ''"
          >
            {{ bookable.serviceName }}
          </span>
          <span class="am-package-service__quantity" v-if="!selectedPackage.sharedCapacity">x{{ bookable.serviceQuantity }}</span>
        </div>
        <div
          v-if="bookable.providersCount > 0"
          class="am-package-service__employee"
        >
          <img
            :src="$root.getUrl + 'public/img/am-package-employees.svg'"
            :class="$root.settings.customization.forms ? `am-block-${classIdentifier}`: ''"
            style="width: 17px"
            class="svg-amelia"
          >
          <span :class="$root.settings.customization.forms ? `am-block-${classIdentifier}`: ''">
            {{ bookable.providersCount }}
          </span>
          <span :class="$root.settings.customization.forms ? `am-block-${classIdentifier}`: ''">
            {{ employeeLabelGenerator(bookable.providersCount) }}
          </span>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import helperMixin from '../../../../js/backend/mixins/helperMixin'

export default {
  name: 'packageInfoFormField',

  props: {
    selectedPackage: {
      type: Object,
      default: () => {}
    },
    classIdentifier: {
      type: String,
      default: ''
    },
    formField: {
      type: Object,
      default: () => {}
    }
  },

  mixins: [helperMixin],

  data () {
    return {
      labelEmployeeSingle: this.formField.labels.employee.value,
      labelEmployeePlural: this.formField.labels.employees.value
    }
  },

  methods: {
    employeeLabelGenerator (provider) {
      if (provider > 1) {
        return this.labelEmployeePlural || this.capitalizeFirstLetter(this.$root.labels.employees)
      }

      return this.labelEmployeeSingle || this.capitalizeFirstLetter(this.$root.labels.employee)
    }
  }
}
</script>
