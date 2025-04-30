<template>
  <el-popover
    ref="popover"
    :placement="'top'"
    popper-class="am-customize__edit"
    :append-to-body="true"
    v-model="editVisible"
  >
    <div class="am-customize__edit-body">
      <el-form @submit.prevent.native>
        <!-- Form background color -->
        <el-form-item v-if="formSettings.hasOwnProperty('formBackgroundColor')" class="am-customize__edit-input-wrapper">
          <template slot="label">
            {{ $root.labels.bgr_color }}:
          </template>
          <el-color-picker v-model="formSettings.formBackgroundColor" :show-alpha="true" @change="saveEdit('formBackgroundColor')"></el-color-picker>
        </el-form-item>
        <!-- /Form background color -->

        <!-- Form background gradient color -->
        <el-form-item v-if="formSettings.hasOwnProperty('formGradientColor1')" class="am-customize__edit-input-wrapper">
          <template slot="label">
            {{ $root.labels.bgr_gradient_color1 }}:
          </template>
          <el-color-picker v-model="formSettings.formGradientColor1" :show-alpha="true" @change="saveEdit('formGradientColor1')"></el-color-picker>
        </el-form-item>
        <el-form-item v-if="formSettings.hasOwnProperty('formGradientColor2')" class="am-customize__edit-input-wrapper">
          <template slot="label">
            {{ $root.labels.bgr_gradient_color2 }}:
          </template>
          <el-color-picker v-model="formSettings.formGradientColor2" :show-alpha="true" @change="saveEdit('formGradientColor2')"></el-color-picker>
        </el-form-item>
        <el-form-item v-if="formSettings.hasOwnProperty('formGradientAngle')" class="am-customize__edit-input-wrapper am-customize__edit-input-wrapper-full">
          <template slot="label">
            {{ $root.labels.bgr_gradient_angle }}:
          </template>
          <el-slider v-model="formSettings.formGradientAngle" :max="360" :step="1" @change="saveEdit('formGradientAngle')"></el-slider>
        </el-form-item>
        <!-- /Form background gradient color -->

        <!-- Form text color -->
        <el-form-item v-if="formSettings.hasOwnProperty('formTextColor')" class="am-customize__edit-input-wrapper">
          <template slot="label">
            {{ $root.labels.text_color }}:
          </template>
          <el-color-picker v-model="formSettings.formTextColor" :show-alpha="true" @change="saveEdit('formTextColor')"></el-color-picker>
        </el-form-item>
        <!-- /Form text color -->

        <!-- Form input color -->
        <el-form-item v-if="formSettings.hasOwnProperty('formInputColor')" class="am-customize__edit-input-wrapper">
          <template slot="label">
            {{ $root.labels.input_color }}:
          </template>
          <el-color-picker v-model="formSettings.formInputColor" :show-alpha="true" @change="saveEdit('formInputColor')"></el-color-picker>
        </el-form-item>
        <!-- /Form input color -->

        <!-- Form text input color -->
        <el-form-item v-if="formSettings.hasOwnProperty('formInputTextColor')" class="am-customize__edit-input-wrapper">
          <template slot="label">
            {{ $root.labels.input_text_color }}:
          </template>
          <el-color-picker v-model="formSettings.formInputTextColor" :show-alpha="true" @change="saveEdit('formInputTextColor')"></el-color-picker>
        </el-form-item>
        <!-- /Form text input color -->

        <!-- Form dropdown color -->
        <el-form-item v-if="formSettings.hasOwnProperty('formDropdownColor')" class="am-customize__edit-input-wrapper">
          <template slot="label">
            {{ $root.labels.dropdown_color }}:
          </template>
          <el-color-picker v-model="formSettings.formDropdownColor" :show-alpha="true" @change="saveEdit('formDropdownColor')"></el-color-picker>
        </el-form-item>
        <!-- /Form dropdown color -->

        <!-- Form dropdown text color -->
        <el-form-item v-if="formSettings.hasOwnProperty('formDropdownTextColor')" class="am-customize__edit-input-wrapper">
          <template slot="label">
            {{ $root.labels.dropdown_text_color }}:
          </template>
          <el-color-picker v-model="formSettings.formDropdownTextColor" :show-alpha="true" @change="saveEdit('formDropdownTextColor')"></el-color-picker>
        </el-form-item>
        <!-- /Form dropdown text color -->

        <!-- Form image color -->
        <el-form-item v-if="formSettings.hasOwnProperty('formImageColor')" class="am-customize__edit-input-wrapper">
          <template slot="label">
            {{ $root.labels.image_color }}:
          </template>
          <el-color-picker v-model="formSettings.formImageColor" :show-alpha="true" @change="saveEdit('formImageColor')"></el-color-picker>
        </el-form-item>
        <!-- /Form image color -->
      </el-form>
    </div>
    <slot name="settingsEdit" slot="reference" />
  </el-popover>
</template>

<script>
  export default {
    name: 'globalCustomizeForm',

    props: {
      globalSettings: {
        default: () => {
          return {}
        },
        type: Object
      }
    },

    data () {
      return {
        editVisible: false,
        formSettings: JSON.parse(JSON.stringify(this.globalSettings))
      }
    },

    methods: {
      requiredChange () {
        if (this.formSettings.required) {
          this.formSettings.visibility = true
        }
      },

      cancelEdit () {
        // this.editVisible = false
        this.$emit('cancelEdit')
      },

      saveEdit (settingsProperty) {
        // this.editVisible = false
        if (this.formSettings[settingsProperty] === null) {
          this.formSettings[settingsProperty] = '#ffffff'
        }
        let dataObj = {}
        dataObj.globalSettings = JSON.parse(JSON.stringify(this.formSettings))
        this.$emit('saveSettings', dataObj)
      }
    },

    watch: {
      'globalSettings' () {
        this.formSettings = JSON.parse(JSON.stringify(this.globalSettings))
      }
    }
  }
</script>