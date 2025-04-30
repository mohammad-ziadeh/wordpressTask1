<template>
  <div class="am-customize__form-header">
    <el-button v-if="editable" class="am-reset-button" type="default" size="mini" @click="resetForm">
      <img :src="$root.getUrl + 'public/img/am-customize-reset.svg'">
      {{ $root.labels.reset }}
    </el-button>

    <form-colors-edit-dialog
      :global-settings="customizationForm"
      @saveSettings="saveFormEdit"
    >
      <template slot="settingsEdit">
        <el-button v-show="editable" class="am-customize__color-settings" size="mini">
          <img :src="$root.getUrl + 'public/img/am-customize-color.svg'">
          {{ $root.labels.form_colors }}
        </el-button>
      </template>
    </form-colors-edit-dialog>
  </div>
</template>

<script>
import formColorsEditDialog from '../dialogs/FormColorsEditDialog'

export default {
  name: 'customizationFormHeader',

  components: {formColorsEditDialog},

  props: {
    editable: {
      type: Boolean,
      default: true
    },
    customizationForm: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },

  methods: {
    resetForm () {
      this.$emit('resetForm')
    },

    saveFormEdit (dataObj) {
      this.$emit('saveFormEdit', dataObj)
    }
  }
}
</script>
