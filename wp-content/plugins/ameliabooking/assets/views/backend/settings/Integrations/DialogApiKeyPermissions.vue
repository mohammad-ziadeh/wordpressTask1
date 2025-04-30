<template>
  <div class="am-dialog-translate">

    <div class="am-dialog-scrollable" :style="dialogStyle">

      <!-- Dialog Header -->
      <div class="am-dialog-header">
        <el-row>
          <el-col :span="16">
            <img class="am-dialog-translate-svg-back" :src="$root.getUrl+'public/img/arrow-back.svg'" @click="goBack">
            <h2>{{ $root.labels.api_key_permissions }}</h2>
          </el-col>

          <el-col :span="8" class="align-right">
            <el-button class="am-dialog-close" @click="this.$emit('closeDialogPermissions')" size="small" icon="el-icon-close"></el-button>
          </el-col>
        </el-row>
      </div>

      <!-- Form -->
      <el-form :model="settings" ref="settings" label-position="top" @submit.prevent="onSubmit">

        <!-- Permissions -->
        <el-form-item>
          <el-checkbox
              v-for="(permission, index) in permissions"
              :value="passedApiKey.allPermissions || passedApiKey.permissions.includes(permission)"
              @change="changePermission($event, permission)"
              :key="index"
          >
            {{ permission }}
          </el-checkbox>
        </el-form-item>

      </el-form>
      <!-- /Form -->

    </div>
  </div>
</template>

<script>
  export default {
    props: {
      passedApiKey: {
        type: Object
      }
    },

    data () {
      return {
        permissions: [
          'amelia_read_menu',
          'amelia_read_dashboard',
          'amelia_read_calendar',
          'amelia_read_appointments',
          'amelia_read_events',
          'amelia_read_employees',
          'amelia_read_services',
          'amelia_read_packages',
          'amelia_read_locations',
          'amelia_read_coupons',
          'amelia_read_customers',
          'amelia_read_finance',
          'amelia_read_notifications',
          'amelia_read_customize',
          'amelia_read_custom_fields',
          'amelia_read_settings',

          'amelia_read_others_dashboard',
          'amelia_read_others_calendar',
          'amelia_read_others_appointments',
          'amelia_read_others_services',
          'amelia_read_others_employees',
          'amelia_read_others_customers',

          'amelia_write_dashboard',
          'amelia_write_calendar',
          'amelia_write_appointments',
          'amelia_write_events',
          'amelia_write_employees',
          'amelia_write_services',
          'amelia_write_packages',
          'amelia_write_locations',
          'amelia_write_coupons',
          'amelia_write_customers',
          'amelia_write_finance',
          'amelia_write_notifications',
          'amelia_write_customize',
          'amelia_write_custom_fields',
          'amelia_write_settings',
          'amelia_write_status',

          'amelia_write_others_calendar',
          'amelia_write_others_appointments',
          'amelia_write_others_services',
          'amelia_write_others_employees',
          'amelia_write_others_events',
          'amelia_write_others_finance',
          'amelia_write_others_dashboard',

          'amelia_delete_dashboard',
          'amelia_delete_calendar',
          'amelia_delete_appointments',
          'amelia_delete_events',
          'amelia_delete_employees',
          'amelia_delete_services',
          'amelia_delete_packages',
          'amelia_delete_locations',
          'amelia_delete_coupons',
          'amelia_delete_customers',
          'amelia_delete_finance',
          'amelia_delete_notifications',
          'amelia_delete_customize',
          'amelia_delete_custom_fields',
          'amelia_delete_settings',

          'amelia_write_status_appointments',
          'amelia_write_status_events',
          'amelia_write_time_appointments'
        ],
        selectAll: false
      }
    },

    methods: {
      changePermission (value, permission) {
        this.passedApiKey.allPermissions = false
        if (value) {
          this.passedApiKey.permissions.push(permission)
        } else {
          let index = this.passedApiKey.permissions.indexOf(permission)
          if (index !== -1) {
            this.passedApiKey.permissions.splice(index, 1)
          }
        }
      },

      goBack () {
        this.$emit('savePermissions', this.passedApiKey)
      }
    }
  }
</script>
