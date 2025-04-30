<template>
  <!-- Package form field -->
  <el-form-item
    :label="labelPackage || capitalizeFirstLetter($root.labels.package) + ':'"
    prop="packageId"
    class="am-select-service-option"
    :class="$root.settings.customization.forms ? `am-select-${classIdentifier}`: ''"
  >
    <el-select
      v-model="packageForm.packageId"
      :clearable="true"
      :loading=!fetched
      :popper-class="$root.settings.customization.forms ? `am-dropdown-${classIdentifier}` : ''"
      placeholder=""
      @change="changePackage"
    >
      <el-option
        v-for="pack in options.entities.packages"
        :key="pack.id"
        :label="pack.name"
        :value="pack.id"
      >
      </el-option>
    </el-select>
  </el-form-item>
  <!-- /Package form field -->
</template>

<script>
import helperMixin from '../../../../../js/backend/mixins/helperMixin'

export default {
  name: 'packageFormField',

  props: {
    packageForm: {
      type: Object,
      default: () => {}
    },
    fetched: {
      type: Boolean,
      default: false
    },
    options: {
      type: Object,
      default: () => {
        return {
          availableEntitiesIds: {
            categories: [],
            employees: [],
            locations: [],
            services: []
          },
          entitiesRelations: {},
          entities: {
            packages: [],
            services: [],
            employees: [],
            locations: [],
            customFields: []
          }
        }
      }
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

  mounted () {},

  data () {
    return {
      labelPackage: this.formField.labels.package_colon.value
    }
  },

  methods: {
    changePackage () {
      this.$emit('changeFormItem')
    }
  }
}
</script>