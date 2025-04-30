<template>
  <!-- Form -->
  <el-form label-position="top">

    <!-- Extensions -->
    <div class="am-extra-list" style="padding: 0;">
      <el-button @click="addExtension" size="large" type="primary" class="am-dialog-create">
        <i class="el-icon-plus"></i>
        <span class="button-text">{{ addLabel }}</span>
      </el-button>

      <transition-group name="list-complete">
        <div class="am-extra-item"
             v-for="(extensionItem, index) in extensions" :key="index + 1">
          <!-- Preview -->
          <el-row align="top" style="margin-bottom: 0;">
            <el-col :span="24">
              <el-row type="flex" align="middle" style="margin-bottom: 0;">
                <el-col :span="18">
                  <component
                    v-if="editedExtension === null || index !== extensions.indexOf(editedExtension)"
                    :is="formHeader"
                    :extension="extensionItem"
                    :type="type"
                    :index="index"
                  >
                  </component>
                </el-col>
                <el-col
                    :span="6"
                    class="extra-item-actions align-right"
                    v-if="editedExtension === null || index !== extensions.indexOf(editedExtension)">
                  <span @click="showEditExtensionDialog(extensionItem)">
                    <img class="svg-amelia edit" width="16px" :src="$root.getUrl+'public/img/edit.svg'">
                  </span>
                  <span @click="showDeleteExtensionDialog(extensionItem)" v-if="!(oneRequired && extensions.length === 1)">
                    <img class="svg-amelia" width="16px" :src="$root.getUrl+'public/img/delete.svg'">
                  </span>
                </el-col>
              </el-row>

              <div class="am-extra-item-data"
                   v-show="(editedExtension === null || index !== extensions.indexOf(editedExtension)) && (extensionToDelete === null || index !== extensions.indexOf(extensionToDelete))">
                <component
                  :is="formInfo"
                  :extension="extensionItem"
                  :type="type"
                >
                </component>
              </div>

            </el-col>
          </el-row>

          <!-- Delete -->
          <el-collapse-transition>
            <div class="am-confirmation"
                 v-show="extensionToDelete !== null && index === extensions.indexOf(extensionToDelete)">
              <p>{{ deleteMessage }}?</p>
              <div class="align-right" style="display: inline-flex;">
                <el-button size="small" @click="hideDeleteExtensionDialog()">{{ $root.labels.cancel }}</el-button>
                <el-button size="small" @click="deleteExtension(extensionItem)" type="primary">{{ $root.labels.delete }}</el-button>
              </div>
            </div>
          </el-collapse-transition>

          <!-- Edit -->
          <el-collapse-transition>
            <div v-show="extensionEditDialog === true && index === extensions.indexOf(editedExtension)">
              <el-form :model="extensionItem" ref="extensionsRef" :rules="rules" label-position="top" style="padding: 0;" :id="'extension-' + type + '-' + index">
                <template>
                  <component
                    :is="form"
                    :extension="extensionItem"
                    :extensions="extensions"
                    :type="type"
                  >
                  </component>
                </template>

                <!-- Cancel & Save -->
                <div class="align-right" style="display: inline-flex;">
                  <el-button @click="cancelExtension(extensionItem)" size="small">
                    {{ $root.labels.cancel }}
                  </el-button>
                  <el-button size="small" @click="saveExtension(index)" type="primary">
                    {{ $root.labels.save }}
                  </el-button>
                </div>
              </el-form>
            </div>
          </el-collapse-transition>

        </div>
      </transition-group>

    </div>

  </el-form>
</template>

<script>
import notifyMixin from '../../../js/backend/mixins/notifyMixin'
import imageMixin from '../../../js/common/mixins/imageMixin'
import helperMixin from '../../../js/backend/mixins/helperMixin'
import wooCommerceRule from '../settings/payments/WooCommerceRule'
import wooCommerceRuleHeader from '../settings/payments/WooCommerceRuleHeader'
import wooCommerceRuleInfo from '../settings/payments/WooCommerceRuleInfo'

export default {

  components: {
    wooCommerceRule,
    wooCommerceRuleHeader,
    wooCommerceRuleInfo
  },

  mixins: [imageMixin, helperMixin, notifyMixin],

  props: {
    formHeader: {
      type: String,
      default: ''
    },

    formInfo: {
      type: String,
      default: ''
    },

    form: {
      type: String,
      default: ''
    },

    oneRequired: {
      type: Boolean,
      default: false
    },

    type: {
      type: String,
      default: ''
    },

    rules: {
      type: Object,
      default: () => {}
    },

    addLabel: {
      type: String,
      default: ''
    },

    deleteMessage: {
      type: String,
      default: ''
    },

    extensions: {
      type: Array,
      default: () => []
    },

    newExtension: {
      type: Object,
      default: () => {}
    }
  },

  data () {
    return {
      extensionToDelete: null,
      extensionEditDialog: null,
      editedExtension: null,
      editedExtensionOld: null,
      isNewExtension: false
    }
  },

  methods: {
    addExtension () {
      if (this.editedExtension === null) {
        this.extensionEditDialog = true

        this.editedExtension = JSON.parse(JSON.stringify(this.newExtension))

        this.isNewExtension = true

        this.extensions.push(this.editedExtension)
      }

      this.scrollViewInModal('extension-' + this.type + '-' + (this.extensions.length - 1))
    },

    showEditExtensionDialog (extensionItem) {
      this.editedExtension = extensionItem
      this.editedExtensionOld = JSON.parse(JSON.stringify(extensionItem))
      this.extensionToDelete = null
      this.extensionEditDialog = true
    },

    showDeleteExtensionDialog (extensionItem) {
      this.extensionToDelete = extensionItem
      this.editedExtension = null
      this.extensionEditDialog = false
    },

    hideDeleteExtensionDialog () {
      this.extensionToDelete = null
      this.extensionEditDialog = true
    },

    deleteExtension (extensionItem) {
      let index = this.extensions.indexOf(extensionItem)
      this.extensions.splice(index, 1)
    },

    cancelExtension (extensionItem) {
      if (this.editedExtensionOld !== null) {
        Object.keys(this.editedExtensionOld).forEach((property) => {
          extensionItem[property] = this.editedExtensionOld[property]
        })
      }

      if (this.isNewExtension) {
        let index = this.extensions.indexOf(extensionItem)

        this.extensions.splice(index, 1)

        this.isNewExtension = false
      }

      this.editedExtension = null
      this.editedExtensionOld = null
      this.extensionEditDialog = false
    },

    saveExtension (index) {
      this.$refs.extensionsRef[index].validate((valid) => {
        if (valid) {
          this.editedExtension = null
          this.extensionEditDialog = false
          this.isNewExtension = false
          this.$refs.extensionsRef[index].clearValidate()
        } else {
          return false
        }
      })
    }
  }
}
</script>
