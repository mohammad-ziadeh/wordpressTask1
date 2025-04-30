<template>
  <el-form-item
    :label="labelLocation || `${capitalizeFirstLetter($root.labels.location)}:`"
    :class="$root.settings.customization.forms ? `am-select-${classIdentifier}`: ''"
  >
    <el-select
      v-model="selectedPackage.bookable[activeBookableIndex].locationId"
      :clearable="true"
      placeholder=""
      :popper-class="$root.settings.customization.forms ? `am-dropdown-${classIdentifier}` : ''"
      @change="changeFormItem"
    >
      <el-option
        v-for="location in filteredLocation"
        :key="location.id"
        :label="location.name"
        :value="location.id"
      >
      </el-option>
    </el-select>
  </el-form-item>
</template>

<script>
import helperMixin from '../../../../js/backend/mixins/helperMixin'

export default {
  name: 'packageLocationFormField',

  mixins: [helperMixin],

  props: {
    selectedPackage: {
      type: Object,
      default: () => {}
    },
    activeBookableIndex: {
      type: Number,
      default: 0
    },
    filteredLocation: {
      type: Array,
      default: () => []
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

  data () {
    return {
      labelLocation: this.formField.labels.location.value
    }
  },

  methods: {
    changeFormItem () {
      this.$emit('changeFormItem')
    }
  }
}
</script>
