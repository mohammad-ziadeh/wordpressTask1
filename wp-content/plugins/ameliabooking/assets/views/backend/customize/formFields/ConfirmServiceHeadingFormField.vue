<template>
  <el-row :gutter="customizationEdit.editable ? 48 : 24">
    <el-col :sm="24">
      <div
        v-show="customizationEdit.editable ? customizationEdit.editable : componentDisplay()"
        class="am-customize-field"
        :class="{'editable': customizationEdit.editable}"
        :style="{borderColor: customizationEdit.reverseBackgroundColorForm}"
      >
        <div class="am-confirmation-booking-header">
          <img :src="pictureLoad(service, false)" @error="imageLoadError(service, false)" :alt="service.name"/>
          <h2 :style="{ 'color': customizationForm.formTextColor }">
            {{ service.name }}
          </h2>
        </div>
        <!-- Edit Dialog -->
        <customize-edit-dialog
          :form-field="formField"
          @saveEdit="saveFormFiledEdit"
        >
          <template v-slot:fieldEdit>
            <span v-show="customizationEdit.editable" class="am-customize-field__edit">
              <img :src="$root.getUrl + 'public/img/am-customize-icon-edit.svg'" />
            </span>
          </template>
        </customize-edit-dialog>
        <!-- /Edit Dialog -->
      </div>
    </el-col>
  </el-row>
</template>

<script>
import imageMixin from '../../../../js/common/mixins/imageMixin'
import dateMixin from '../../../../js/common/mixins/dateMixin'
import customizeEditDialog from '../dialogs/CustomizeEditDialog'

export default {
  name: 'confirmServiceHeadingFormField',

  components: {
    customizeEditDialog
  },

  props: {
    customizationEdit: {
      type: Object,
      default: () => {
        return {}
      }
    },
    customizationForm: {
      type: Object,
      default: () => {
        return {}
      }
    },
    formField: {
      type: Object,
      default: () => {
        return {}
      }
    },
    service: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },

  mixins: [imageMixin, dateMixin],

  mounted () {},

  methods: {
    componentDisplay () {
      if (this.formField.hasOwnProperty('visibility')) {
        return this.formField.visibility
      }

      return true
    },

    saveFormFiledEdit (objData) {
      let fieldData = {}
      fieldData['itemsStatic'] = {}
      fieldData['itemsStatic'][this.$options.name] = JSON.parse(JSON.stringify(objData))
      this.$emit('saveEdit', fieldData)
    }
  },

  watch: {
    'formField' () {

    }
  }
}
</script>
