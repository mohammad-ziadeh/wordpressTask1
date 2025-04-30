<template>
  <!-- Customer First Name -->
  <el-col :sm="columnsLg" ref="customer.firstName">
    <el-form-item
      prop="customer.firstName"
      :label="firstNameLabel || $root.labels.first_name_colon"
      :class="$root.settings.customization.forms ? `am-input-${classIdentifier}`: ''"
    >
      <el-input
        v-model="appointment.bookings[0].customer.firstName"
        :disabled="!!appointment.bookings[0].customer.firstName && !!appointment.bookings[0].customer.id"
        name="given-name"
        autocomplete="given-name"
        @input="inputChanges"
      ></el-input>
    </el-form-item>
  </el-col>
  <!-- /Customer First Name -->
</template>

<script>
export default {
  name: 'firstNameFormField',

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
      firstNameLabel: this.formField.labels.first_name_colon.value
    }
  },

  methods: {
    inputChanges () {
      this.$emit('inputChanges')
    }
  },

  watch: {
    'formValidOptions' () {
      if (this.formValidOptions['customer.firstName']) {
        this.$refs['customer.firstName'].$el.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' })
      }
    }
  }
}
</script>
