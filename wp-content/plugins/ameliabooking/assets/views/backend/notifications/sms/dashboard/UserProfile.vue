<template>
  <div class="am-sms-user">

    <!-- User Profile Title -->
    <h2>{{ $root.labels.user_profile }}</h2>
    <!-- /User Profile Title -->

    <!-- User Profile -->
    <div class="am-sms-user-info">
      <el-row :gutter="24">

        <!-- User Email & Logout Button -->
        <el-col :md="12">
          <p>User:</p>
          <p class="am-strong">{{ user.email }}</p>
          <span class="am-link" @click="logout">{{ $root.labels.logout }}</span>
        </el-col>

        <!-- Alpha Sender ID -->
        <el-col :md="12">
          <p>{{ $root.labels.sender_id_colon }}</p>

          <!-- Alpha Sender ID Label -->
          <transition name="fadeIn">
            <p class="am-strong" v-show="!changeSenderIdActive">{{ senderId.value }}</p>
          </transition>
          <!-- /Alpha Sender ID Label -->

          <!-- Alpha Sender ID Input -->
          <transition name="fadeIn">
            <div class="am-sms-change-sender-id" v-show="changeSenderIdActive">
              <el-row :gutter="16">

                <!-- Sender ID Form -->
                <el-form :model="senderId" ref="senderId" :rules="rulesSenderId" @submit.prevent="onSubmit">

                  <!-- Sender ID Form Input -->
                  <el-col :lg="12">
                    <el-form-item prop="value">
                      <el-input v-model="senderId.value" @input="clearValidation()" size="small"></el-input>
                    </el-form-item>
                  </el-col>
                  <!-- Sender ID Form Input -->

                  <!-- Cancel & Save Buttons -->
                  <el-col :lg="12">

                    <!-- Cancel Button -->
                    <el-button
                        type=""
                        size="small"
                        @click="cancelChangeSenderId"
                    >
                      {{ $root.labels.cancel }}
                    </el-button>
                    <!-- /Cancel Button -->

                    <!-- Save Button -->
                    <el-button
                        type="primary"
                        size="small"
                        :loading="loadingSenderId"
                        @click="saveSenderId"
                    >
                      {{ $root.labels.save }}
                    </el-button>
                    <!-- /Save Button -->

                  </el-col>
                  <!-- Cancel & Save Buttons -->

                </el-form>
                <!-- Sender ID Form -->

              </el-row>
            </div>
          </transition>
          <!-- /Alpha Sender ID Input -->

          <!-- Change Sender ID -->
          <span class="am-link" v-show="!changeSenderIdActive" @click="changeSenderId">
            {{ $root.labels.change_alpha_sender_id }}
          </span>
          <!-- /Change Sender ID -->

        </el-col>
        <!-- /Alpha Sender ID -->

      </el-row>
    </div>
    <!-- /User Profile -->

    <!-- Security Title -->
    <h2>{{ $root.labels.security }}</h2>
    <!-- /Security Title -->

    <!-- Security Title -->
    <div class="am-sms-user-security">
      <el-form :model="changePassword" ref="changePassword" :rules="rulesChangePassword" @submit.prevent="onSubmit">
        <el-row :gutter="24">

          <!-- Change Password -->
          <el-col :lg="6" :md="12">

            <!-- Current Password -->
            <el-form-item
                :label="$root.labels.current_password_colon"
                prop="currentPassword"
                :error="errors.currentPassword"
            >
              <el-input
                  v-model="changePassword.currentPassword"
                  @input="clearValidation"
                  type="password"
                  size="small"
              ></el-input>
            </el-form-item>
            <!-- /Current Password -->

            <!-- New Password -->
            <el-form-item
                :label="$root.labels.new_password_colon"
                prop="newPassword"
                :error="errors.newPassword"
            >
              <el-input
                  v-model="changePassword.newPassword"
                  @input="clearValidation"
                  type="password"
                  size="small"
              >
              </el-input>
            </el-form-item>
            <!-- /New Password -->

            <!-- Re-type New Password -->
            <el-form-item
                :label="$root.labels.new_password_colon_retype"
                prop="newPasswordReType"
                :error="errors.newPasswordReType"
            >
              <el-input
                  v-model="changePassword.newPasswordReType"
                  @input="clearValidation"
                  type="password"
                  size="small"
              >
              </el-input>
            </el-form-item>
            <!-- /Re-type New Password -->

            <!-- Change Password Button -->
            <el-button
                @click="onChangePassword"
                :loading="loadingChangePassword"
                class="am-change-password"
                size="small"
                type="primary"
            >
              {{ $root.labels.change_password }}
            </el-button>
            <!-- /Change Password Button -->

          </el-col>
          <!-- /Change Password -->

        </el-row>


        <el-alert
            class="am-sms-warning"
            type="warning"
            show-icon
            title=""
            v-html="$root.labels.sms_warning"
            :closable="false"
            style="margin-bottom: 10px; margin-top: 16px; display: block"
        >
        </el-alert>
      </el-form>
    </div>
    <!-- /Security Title -->

  </div>
</template>

<script>
  import notifyMixin from '../../../../../js/backend/mixins/notifyMixin'
  import notificationMixin from '../../../../../js/backend/mixins/notificationMixin'

  export default {
    mixins: [notifyMixin, notificationMixin],

    props: {
      user: {
        type: Object,
        default: () => {}
      },
      notificationsSettings: {
        type: Object,
        default: () => {}
      }
    },

    mounted () {
      this.senderId.value = this.notificationsSettings.smsAlphaSenderId
    },

    data () {
      let validateSenderId = (rule, value, callback) => {
        if (!/^[A-z0-9 ]+$/.test(value)) {
          callback(new Error(this.$root.labels.sender_id_invalid_characters_error))
        }

        if (!/[a-zA-Z]/.test(value)) {
          callback(new Error(this.$root.labels.sender_id_letter_error))
        }

        if (value.length > 11) {
          callback(new Error(this.$root.labels.sender_id_length_error))
        }

        callback()
      }

      let validateNewPasswordMatch = (rule, value, callback) => {
        if (value !== this.changePassword.newPassword) {
          callback(new Error(this.$root.labels.passwords_do_not_match))
        }

        callback()
      }

      return {
        changePassword: {
          currentPassword: '',
          newPassword: '',
          newPasswordReType: ''
        },
        changeSenderIdActive: false,
        errors: {
          currentPassword: '',
          newPassword: '',
          newPasswordReType: ''
        },
        loadingChangePassword: false,
        loadingSenderId: false,
        rulesChangePassword: {
          currentPassword: [
            {required: true, message: this.$root.labels.current_password_requred, trigger: 'submit'}
          ],
          newPassword: [
            {required: true, message: this.$root.labels.new_password_requred, trigger: 'submit'}
          ],
          newPasswordReType: [
            {required: true, message: this.$root.labels.re_type_requred, trigger: 'submit'},
            {validator: validateNewPasswordMatch, trigger: 'submit'}
          ]
        },
        rulesSenderId: {
          value: [
            {required: true, message: this.$root.labels.sender_id_required, trigger: 'submit'},
            {validator: validateSenderId, trigger: 'submit'}
          ]
        },
        senderId: {
          value: '',
          valueTemporary: ''
        }
      }
    },

    methods: {
      logout () {
        this.$emit('logout')
      },

      changeSenderId () {
        this.changeSenderIdActive = true
        this.senderId.valueTemporary = this.senderId.value
      },

      cancelChangeSenderId () {
        this.clearValidation()
        this.changeSenderIdActive = false
        this.senderId.value = this.senderId.valueTemporary
      },

      saveSenderId () {
        this.$refs.senderId.validate((valid) => {
          if (valid) {
            let notificationsSettings = Object.assign({}, this.notificationsSettings)
            notificationsSettings.smsAlphaSenderId = this.senderId.value
            this.loadingSenderId = true

            this.$http.post(`${this.$root.getAjaxUrl}/settings`, {
              notifications: notificationsSettings
            }).then(() => {
              this.clearValidation()
              this.loadingSenderId = this.changeSenderIdActive = false
              this.notify(this.$root.labels.success, this.$root.labels.sender_id_saved, 'success')
            }).catch(e => {
              this.clearValidation()
              this.loadingSenderId = this.changeSenderIdActive = false
              this.notify(this.$root.labels.error, e.message, 'error')
            })
          } else {
            return false
          }
        })
      },

      onChangePassword () {
        this.errors = this.resetChangePasswordOnInitialState()
        this.$refs.changePassword.validate((valid) => {
          if (valid) {
            this.loadingChangePassword = true
            this.sendAmeliaSmsApiRequest('changePassword', this.onChangePasswordSuccess, this.onChangePasswordError)
          } else {
            return false
          }
        })
      },

      onChangePasswordSuccess () {
        this.clearValidation()
        this.changePassword = this.resetChangePasswordOnInitialState()
        this.loadingChangePassword = false
        this.notify(this.$root.labels.success, this.$root.labels.password_has_been_changed, 'success')
      },

      onChangePasswordError (data) {
        let $this = this
        this.loadingChangePassword = false

        Object.keys(data.errors).forEach(function (key) {
          $this.errors[key] = $this.$root.labels[data.errors[key][0]]
        })
      },

      clearValidation () {
        if (typeof this.$refs.senderId !== 'undefined') {
          this.$refs.senderId.clearValidate()
        }

        if (typeof this.$refs.changePassword !== 'undefined') {
          this.$refs.changePassword.clearValidate()
        }
      },

      resetChangePasswordOnInitialState () {
        return {
          currentPassword: '',
          newPassword: '',
          newPasswordReType: ''
        }
      }
    }
  }
</script>
