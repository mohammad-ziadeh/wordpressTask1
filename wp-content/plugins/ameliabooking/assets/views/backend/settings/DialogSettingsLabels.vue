<template>
  <div>
    <div class="am-dialog-scrollable">

      <!-- Dialog Header -->
      <div class="am-dialog-header">
        <el-row>
          <el-col :span="20">
            <h2>{{ $root.labels.labels_settings }}</h2>
          </el-col>
          <el-col :span="4" class="align-right">
            <el-button @click="closeDialog" class="am-dialog-close" size="small" icon="el-icon-close"></el-button>
          </el-col>
        </el-row>
      </div>

      <!-- Form -->
      <el-form :model="settings" ref="settings" label-position="top" @submit.prevent="onSubmit">

        <!-- Use Labels Settings -->
        <div class="am-setting-box am-switch-box">
          <el-row type="flex" align="middle" :gutter="24">
            <el-col :span="20">
              {{ $root.labels.enable_labels_settings }}
              <el-tooltip placement="top">
                <div slot="content" v-html="$root.labels.enable_labels_settings_tooltip"></div>
                <i class="el-icon-question am-tooltip-icon"></i>
              </el-tooltip>
            </el-col>
            <el-col :span="4" class="align-right">
              <el-switch
                  v-model="settings.enabled"
                  active-text=""
                  inactive-text=""
              >
              </el-switch>
            </el-col>
          </el-row>
        </div>

        <!-- Employee -->
        <el-form-item :label="$root.labels.label_employee+':'">
          <el-input v-model="settings.employee" :disabled="settings.enabled === false" placeholder=""></el-input>
        </el-form-item>

        <!-- Employees -->
        <el-form-item :label="$root.labels.label_employees+':'">
          <el-input v-model="settings.employees" :disabled="settings.enabled === false" placeholder=""></el-input>
        </el-form-item>

        <!-- Service -->
        <el-form-item :label="$root.labels.label_service+':'">
          <el-input v-model="settings.service" :disabled="settings.enabled === false" placeholder=""></el-input>
        </el-form-item>

        <!-- Services -->
        <el-form-item :label="$root.labels.label_services+':'">
          <el-input v-model="settings.services" :disabled="settings.enabled === false" placeholder=""></el-input>
        </el-form-item>

        <div class="el-alert el-alert--warning is-light">
          <i class="el-alert__icon el-icon-warning is-big"></i>
          <div class="el-alert__content">
            <p class="el-alert__description">
              {{$root.labels.general_labels_warning}}
              <a style="text-decoration: underline; color: inherit; font-weight: 600; cursor: pointer" @click="goToCustomize">
                {{ $root.labels.customize_page }}
              </a>
            </p>
            <i class="el-alert__closebtn el-icon-close" style="display: none;"></i></div>
        </div>

      </el-form>
    </div>

    <!-- Dialog Footer -->
    <div class="am-dialog-footer">
      <div class="am-dialog-footer-actions">
        <el-row>
          <el-col :sm="24" class="align-right">
            <el-button type="" @click="closeDialog" class="">{{ $root.labels.cancel }}</el-button>
            <el-button type="primary" @click="onSubmit" class="am-dialog-create">{{ $root.labels.save }}</el-button>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
  import imageMixin from '../../../js/common/mixins/imageMixin'

  export default {

    mixins: [imageMixin],

    props: ['labels'],

    data () {
      return {
        settings: Object.assign({}, this.labels)
      }
    },

    updated () {
      this.inlineSVG()
    },

    mounted () {
      this.inlineSVG()
    },

    methods: {
      goToCustomize () {
        window.location.search = '?page=wpamelia-customize'
      },

      closeDialog () {
        this.$emit('closeDialogSettingsLabels')
      },

      onSubmit () {
        this.$emit('closeDialogSettingsLabels')
        this.$emit('updateSettings', {'labels': this.settings})
      }

    }
  }
</script>
