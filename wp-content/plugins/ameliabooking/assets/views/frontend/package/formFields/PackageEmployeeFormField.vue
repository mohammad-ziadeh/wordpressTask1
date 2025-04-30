<template>
  <el-form-item
    :label="labelEmployee || `${capitalizeFirstLetter($root.labels.employee)}:`"
    :class="$root.settings.customization.forms ? `am-select-${classIdentifier}`: ''"
  >
    <el-select
      v-model="selectedPackage.bookable[activeBookableIndex].providerId"
      :clearable="true"
      :placeholder="anyEmployeeVisible ? (labelAnyEmployee || $root.labels.any_employee) : ''"
      :popper-class="$root.settings.customization.forms ? `am-dropdown-${classIdentifier}` : ''"
      @change="changeFormItem"
    >
      <el-option
        v-for="employee in filteredEmployees"
        :key="employee.id"
        :label="employee.firstName + ' ' + employee.lastName"
        :value="employee.id"
      >
      </el-option>
    </el-select>
  </el-form-item>
</template>

<script>
import helperMixin from '../../../../js/backend/mixins/helperMixin'

export default {
  name: 'packageEmployeeFormField',

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
    filteredEmployees: {
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
      labelEmployee: this.formField.labels.employee.value,
      labelAnyEmployee: this.formField.labels.any_employee.value,
      anyEmployeeVisible: this.formField.anyEmployeeVisible
    }
  },

  methods: {
    changeFormItem () {
      this.$emit('changeFormItem')
    }
  }
}
</script>
