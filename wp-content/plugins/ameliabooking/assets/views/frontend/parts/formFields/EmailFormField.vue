<template>
  <!-- Customer Email -->
  <el-col :sm="columnsLg" ref="customer.email"  v-if="formField.visibility">
    <el-form-item
      prop="customer.email" :error="errors.email"
      :label="emailLabel || $root.labels.email_colon"
      :class="$root.settings.customization.forms ? `am-input-${classIdentifier}`: ''"
    >
      <el-input
        v-model="appointment.bookings[0].customer.email"
        :disabled="!!appointment.bookings[0].customer.email && !!appointment.bookings[0].customer.id"
        :placeholder="$root.labels.email_placeholder"
        type="email"
        name="email"
        autocomplete="email"
        @input="inputChanges"
      >
      </el-input>
    </el-form-item>
  </el-col>
  <!-- /Customer Email -->
</template>

<script>
export default {
  name: 'emailFormField',

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
      emailLabel: this.formField.labels.email_colon.value
    }
  },

  methods: {
    inputChanges () {
      this.$emit('inputChanges')
    }
  },

  watch: {
    'formValidOptions' () {
      if (this.formValidOptions['customer.email']) {
        this.$refs['customer.email'].$el.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' })
      }
    }
  }
}
</script>
