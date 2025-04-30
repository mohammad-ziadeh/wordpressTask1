<template>
  <!-- Customer Last Name -->
  <el-col :sm="columnsLg" ref="customer.lastName" v-if="formField.visibility">
    <el-form-item
      prop="customer.lastName"
      :label="lastNameLabel || $root.labels.last_name_colon"
      :class="$root.settings.customization.forms ? `am-input-${classIdentifier}`: ''"
    >
      <el-input
        v-model="appointment.bookings[0].customer.lastName"
        :disabled="!!appointment.bookings[0].customer.lastName && !!appointment.bookings[0].customer.id"
        name="family-name"
        autocomplete="family-name"
        @input="inputChanges"
      ></el-input>
    </el-form-item>
  </el-col>
  <!-- /Customer Last Name -->
</template>

<script>
export default {
  name: 'lastNameFormField',

  props: {
    appointment: {
      type: Object,
      default: () => {}
    },
    columnsLg: {
      type: Number,
      default: 12
    },
    formValidOptions: {
      type: Object,
      default: () => {}
    },
    errors: {
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

  data () {
    return {
      lastNameLabel: this.formField.labels.last_name_colon.value
    }
  },

  methods: {
    inputChanges () {
      this.$emit('inputChanges')
    }
  },

  watch: {
    'formValidOptions' () {
      if (this.formValidOptions['customer.lastName']) {
        this.$refs['customer.lastName'].$el.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' })
      }
    }
  }
}
</script>
