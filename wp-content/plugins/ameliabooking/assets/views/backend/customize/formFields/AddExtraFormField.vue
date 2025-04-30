<template>
  <div
    v-show="customizationEdit.editable ? customizationEdit.editable : componentDisplay()"
    class="am-customize-field"
    :class="{'editable': customizationEdit.editable}"
    :style="{borderColor: customizationEdit.reverseBackgroundColorForm}"
  >
    <!-- Extra Block -->
    <transition name="fade">
      <div v-if="extrasBlockVisible">
        <el-row :gutter="16" type="flex" class="am-extras__flex-row">
          <!-- Extra Type -->
          <el-col :span="14">
            <el-form-item>
              <template slot="label">
                <span :style="{ 'color': customizationForm.formTextColor }">
                  <template v-if="!languageShortCode">
                    {{ labelExtraColon.value || `${$root.labels.extra_colon}:` }}
                  </template>
                  <template v-else>
                    {{ labelExtraColon.translations[languageShortCode] || `${$root.labels.extra_colon}:` }}
                  </template>
                </span>
              </template>
              <el-select
                v-model="extra"
                :popper-class="'am-dropdown'"
                :style="{ backgroundColor: customizationForm.formInputColor, color: customizationForm.formInputTextColor, borderColor: selectInputFocus ? customization.globalColors.primaryColor : '#C0C4CC' }"
                @focus="inputFocus"
                placeholder=""
              >
                <el-option
                  v-for="item in extraOptions"
                  :key="item.name"
                  :label="item.name"
                  :value="item.name"
                  :style="{
                    backgroundColor: customizationForm.formDropdownColor,
                    color: item.name === extra ? customization.globalColors.primaryColor : customizationForm.formDropdownTextColor,
                    fontFamily: customization.font
                  }"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <!-- Extra Quantity -->
          <el-col :span="7">
            <el-form-item>
              <template slot="label">
                <span :style="{ 'color': customizationForm.formTextColor }">
                  <template v-if="!languageShortCode">
                    {{ labelQtyColon.value || `${$root.labels.qty_colon}:` }}
                  </template>
                  <template v-else>
                    {{ labelQtyColon.translations[languageShortCode] || `${$root.labels.qty_colon}:` }}
                  </template>
                </span>
              </template>
              <el-select
                v-model="quantity"
                :popper-class="'am-dropdown'"
                :style="{ backgroundColor: customizationForm.formInputColor, color: customizationForm.formInputTextColor, borderColor: selectInputFocus ? customization.globalColors.primaryColor : '#C0C4CC' }"
                @focus="inputFocus"
                placeholder=""
              >
                <el-option
                  v-for="item in quantityOptions"
                  :key="item.name"
                  :label="item.name"
                  :value="item.name"
                  :style="{
                    backgroundColor: customizationForm.formDropdownColor,
                    color: item.name === quantity ? customization.globalColors.primaryColor : customizationForm.formDropdownTextColor,
                    fontFamily: customization.font
                  }"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <!-- Remove Extra -->
          <el-col :span="3">
            <i class="el-icon-minus am-delete-element" @click="deleteExtra"></i>
          </el-col>

        </el-row>

        <!-- Extra Duration & Price-->
        <el-row :gutter="16">

          <!-- Extra Duration -->
          <el-col :span="14">
            <el-form-item>
              <template slot="label">
                <span :style="{ 'color': customizationForm.formTextColor }">
                  <template v-if="!languageShortCode">
                  {{ labelDurationColon.value || `${$root.labels.duration_colon}:` }}
                  </template>
                  <template v-else>
                    {{ labelDurationColon.translations[languageShortCode] || `${$root.labels.duration_colon}:` }}
                  </template>
                </span>
              </template>
              <span :style="{ 'color': customizationForm.formTextColor }">1h 30min</span>
            </el-form-item>
          </el-col>

          <!-- Extra Price -->
          <el-col :span="10">
            <el-form-item>
              <template slot="label">
                <span :style="{ 'color': customizationForm.formTextColor }">
                  <template v-if="!languageShortCode">
                    {{ labelPriceColon.value || `${$root.labels.price_colon}:` }}
                  </template>
                  <template v-else>
                    {{ labelPriceColon.translations[languageShortCode] || `${$root.labels.price_colon}:` }}
                  </template>
                </span>
              </template>
              <span :style="{ 'color': customizationForm.formTextColor }">$3.00</span>
            </el-form-item>
          </el-col>
        </el-row>
      </div>
    </transition>

    <!-- Add extra -->
    <div
      class="am-add-element"
      :style="{color: customization.globalColors.primaryColor, backgroundColor: colorTransparency(customization.globalColors.primaryColor, 0.07)}"
      @click="enableExtrasBlock"
    >
      <i class="el-icon-plus"></i>
      <span>
        <template v-if="!languageShortCode">
          {{ labelAddExtra.value || $root.labels.add_extra }}
        </template>
        <template v-else>
          {{ labelAddExtra.translations[languageShortCode] || $root.labels.add_extra }}
        </template>
      </span>
    </div>

    <!-- Edit Dialog -->
    <customize-edit-dialog
      :form-field="formField"
      :language-short-code="languageShortCode"
      @saveEdit="saveFormFiledEdit"
    >
      <template v-slot:fieldEdit>
        <span v-show="customizationEdit.editable" class="am-customize-field__edit">
          <img :src="$root.getUrl + 'public/img/am-customize-icon-edit.svg'" />
        </span>
      </template>
    </customize-edit-dialog>
    <!-- /Edit Dialog -->
    <span v-if="customizationEdit.editable" class="am-customize-drag-handle">
      <img :src="$root.getUrl + 'public/img/am-customize-icon-drag-handle.svg'"/>
    </span>
  </div>
</template>

<script>
  import customizeEditDialog from '../dialogs/CustomizeEditDialog'
  import cssColorManipulationMixin from '../../../../js/common/mixins/cssColorManipulationMixin'

  export default {
    name: 'addExtraFormField',

    components: {
      customizeEditDialog
    },

    mixins: [cssColorManipulationMixin],

    props: {
      languageShortCode: {
        type: String,
        default: ''
      },
      customization: {
        type: Object
      },
      customizationForm: {
        type: Object,
        default: () => {
          return {}
        }
      },
      customizationEdit: {
        type: Object,
        default: () => {
          return {}
        }
      },
      formField: {
        default: () => {
          return {}
        },
        type: Object
      }
    },

    data () {
      return {
        extrasBlockVisible: false,
        extra: this.$root.labels.select_extra,
        extraOptions: [
          {name: this.$root.labels.select_extra},
          {name: this.$root.labels.select_extra2}
        ],
        bringing: this.$root.labels.one_person,
        quantity: 1,
        quantityOptions: [
          {name: 1},
          {name: 2},
          {name: 3}
        ],
        selectInputFocus: false,
        labelAddExtra: this.formField.labels.add_extra,
        labelExtraColon: this.formField.labels.extra_colon,
        labelQtyColon: this.formField.labels.qty_colon,
        labelDurationColon: this.formField.labels.duration_colon,
        labelPriceColon: this.formField.labels.price_colon
      }
    },

    methods: {
      inputFocus () {
        this.selectInputFocus = true
      },

      componentDisplay () {
        if (this.formField.hasOwnProperty('visibility')) {
          return this.formField.visibility
        }

        return true
      },

      enableExtrasBlock () {
        this.extrasBlockVisible = true
      },

      deleteExtra () {
        this.extrasBlockVisible = false
      },

      saveFormFiledEdit (objData) {
        let fieldData = {}
        fieldData['itemsDraggable'] = {}
        fieldData['itemsDraggable'][this.$options.name] = JSON.parse(JSON.stringify(objData))
        this.$emit('saveEdit', fieldData)
      }
    },

    watch: {
      'formField' () {
        this.labelAddExtra = this.formField.labels.add_extra
        this.labelExtraColon = this.formField.labels.extra_colon
        this.labelQtyColon = this.formField.labels.qty_colon
        this.labelDurationColon = this.formField.labels.duration_colon
        this.labelPriceColon = this.formField.labels.price_colon
      }
    }
  }
</script>