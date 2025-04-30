<template>
  <p v-if="requiredToBookLabel()" class="am-package-appointments-rules">
    {{ requiredToBookLabel() }}
  </p>
</template>

<script>
export default {
  name: 'packageRulesFormField',

  props: {
    selectedPackage: {
      type: Object,
      default: () => {}
    },
    activeBookableIndex: {
      type: Number,
      default: 0
    },
    formField: {
      type: Object,
      default: () => {}
    }
  },

  data () {
    return {
      labelRequiredSingular: this.formField.labels.package_min_book.value,
      labelRequiredPlural: this.formField.labels.package_min_book_plural.value
    }
  },

  methods: {
    requiredToBookLabel () {
      if (this.selectedPackage.bookable[this.activeBookableIndex].minimumScheduled === 0) {
        return ''
      } else if (this.selectedPackage.bookable[this.activeBookableIndex].minimumScheduled === 1) {
        return `${this.selectedPackage.bookable[this.activeBookableIndex].minimumScheduled} ${this.labelRequiredSingular || this.$root.labels.package_min_book}`
      } else {
        return `${this.selectedPackage.bookable[this.activeBookableIndex].minimumScheduled} ${this.labelRequiredPlural || this.$root.labels.package_min_book_plural}`
      }
    }
  }
}
</script>
