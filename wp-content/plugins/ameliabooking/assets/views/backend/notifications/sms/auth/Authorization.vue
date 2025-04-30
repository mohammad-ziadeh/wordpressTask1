<template>
  <div class="am-sms-auth-wrapper">
    <div class="am-sms-auth">

      <!-- Logo -->
      <div class="am-sms-logo">
        <img :src="$root.getUrl + 'public/img/amelia-sms.svg'"/> {{ $root.labels.amelia_sms }}
      </div>
      <!-- /Logo -->

      <!-- Sign In -->
      <transition name="fadeIn">
        <div class="am-sms-login" v-show="activeAuthForm === 'signIn'">

          <!-- Sign In Title -->
          <h4>{{ $root.labels.sign_in }}</h4>
          <!-- /Sign In Title -->

          <!-- Sign In Form -->
          <el-form ref="signIn" :model="signIn" :rules="rulesAuth" label-position="top">

            <!-- Sign In Email -->
            <el-form-item :label="$root.labels.email_colon" prop="email" :error="errors.email">
              <el-input
                  v-model="signIn.email"
                  @input="clearValidation()"
                  @keyup.native.enter="onAuthorize('signIn')"
                  autocomplete="new-password"
              >
              </el-input>
            </el-form-item>
            <!-- /Sign In Email -->

            <!-- Sign In Password -->
            <el-form-item :label="$root.labels.password_colon" prop="password" :error="errors.password">
              <el-input
                  v-model="signIn.password"
                  @input="clearValidation()"
                  @keyup.native.enter="onAuthorize('signIn')"
                  type="password"
                  autocomplete="new-password"
              >
              </el-input>
              <span class="am-link am-forgot-pass" @click="goToForgotPassword">
              {{ $root.labels.forgot_password }}
            </span>
            </el-form-item>
            <!-- /Sign In Password -->

            <!-- Sign In Button -->
            <el-button
                :loading="loadingAuth"
                size="large"
                @click="onAuthorize('signIn')"
                type="primary"
            >
              {{ $root.labels.sign_in }}
            </el-button>
            <!-- /Sign In Button -->

            <!-- Sign Up Button -->
            <p>
              {{ $root.labels.dont_have_an_account }}
              <span class="am-link" @click="goToSignUp">{{ $root.labels.sign_up }}</span>
            </p>
            <!-- /Sign Up Button -->

          </el-form>
          <!-- /Sign In Form -->

        </div>
      </transition>
      <!-- /Sign In -->

      <!-- Sign Up -->
      <transition name="fadeIn">
        <div class="am-sms-signup" v-show="activeAuthForm === 'signUp'">

          <!-- Sign Up Title -->
          <h4>{{ $root.labels.sign_up }}</h4>
          <!-- /Sign Up Title -->

          <!-- Sign Up Form -->
          <el-form ref="signUp" :model="signUp" :rules="rulesAuth" label-position="top">

            <!-- Sign Up Email -->
            <el-form-item :label="$root.labels.email_colon" prop="email" :error="errors.email">
              <el-input
                  v-model="signUp.email"
                  @input="clearValidation()"
                  @keyup.native.enter="onAuthorize('signUp')"
                  autocomplete="new-password"
              >
              </el-input>
            </el-form-item>
            <!-- /Sign Up Email -->

            <!-- Sign Up Password -->
            <el-form-item :label="$root.labels.password_colon" prop="password" :error="errors.password">
              <el-input
                  v-model="signUp.password"
                  @input="clearValidation()"
                  @keyup.native.enter="onAuthorize('signUp')"
                  type="password"
                  autocomplete="new-password"
              >
              </el-input>
            </el-form-item>
            <!-- /Sign Up Password -->

            <!-- Sign Up Button -->
            <el-button
                :loading="loadingAuth"
                size="large"
                @click="onAuthorize('signUp')"
                type="primary"
            >
              {{ $root.labels.sign_up }}
            </el-button>
            <!-- /Sign Up Button -->

            <!-- Sign In Button -->
            <p>
              {{ $root.labels.already_have_an_account }} <span class="am-link" @click="goToSignIn">{{ $root.labels.sign_in }}</span>
            </p>
            <!-- /Sign In Button -->

          </el-form>
          <!-- /Sign Up Form -->

        </div>
      </transition>
      <!-- /Sign Up -->

      <!-- Forgot Password -->
      <transition name="fadeIn">
        <div class="am-sms-signup" v-show="activeAuthForm === 'forgotPassword'">

          <!-- Forgot Password -->
          <h4>{{ $root.labels.forgot_password }}</h4>
          <!-- /Forgot Password -->

          <!-- Forgot Password Form -->
          <el-form ref="forgotPassword" :model="forgotPassword" :rules="rulesForgotPassword" label-position="top">

            <!-- Forgot Password Email -->
            <el-form-item :label="$root.labels.email_colon" prop="email" :error="errors.email">
              <el-input
                  v-model="forgotPassword.email"
                  @input="clearValidation()"
                  @keyup.native.enter="onForgotPassword"
              >
              </el-input>
            </el-form-item>
            <!-- /Forgot Password Email -->

            <!-- Reset Password Button -->
            <el-button size="large" @click="onForgotPassword" type="primary" :loading="loadingForgotPassword">
              {{ $root.labels.access_link_send }}
            </el-button>
            <!-- /Reset Password Button -->

            <!-- Sign In Button -->
            <p><span class="am-link" @click="goToSignIn">{{ $root.labels.sign_in }}</span></p>
            <!-- /Sign In Button -->

          </el-form>
          <!-- /Forgot Password Form -->

        </div>
      </transition>
      <!-- /Forgot Password -->

      <!-- Reset Password -->
      <transition name="fadeIn">
        <div class="am-sms-signup" v-show="activeAuthForm === 'resetPassword'">

          <!-- Reset Password Title -->
          <h4>{{ $root.labels.reset_password }}</h4>
          <!-- /Reset Password Title -->

          <!-- Reset Password Form -->
          <el-form ref="resetPassword" :model="resetPassword" :rules="rulesResetPassword" label-position="top">

            <!-- Reset Password New Password -->
            <el-form-item
                :label="$root.labels.new_password_colon"
                prop="newPassword"
                :error="errors.newPassword"
            >
              <el-input
                  v-model="resetPassword.newPassword"
                  @input="clearValidation()"
                  @keyup.native.enter="onResetPassword"
                  type="password"
                  autocomplete="new-password"
              >
              </el-input>
            </el-form-item>
            <!-- /Reset Password New  Password -->

            <!-- Reset Password Password -->
            <el-form-item
                :label="$root.labels.new_password_colon_retype"
                prop="newPasswordReType"
                :error="errors.newPasswordReType"
            >
              <el-input
                  v-model="resetPassword.newPasswordReType"
                  @input="clearValidation()"
                  @keyup.native.enter="onResetPassword"
                  type="password"
                  autocomplete="new-password"
              >
              </el-input>
            </el-form-item>
            <!-- /Reset Password Password -->

            <!-- Reset Password Button -->
            <el-button
                :loading="loadingResetPassword"
                size="large"
                @click="onResetPassword"
                type="primary"
            >
              {{ $root.labels.reset_password }}
            </el-button>
            <!-- /Reset Password Button -->

          </el-form>
          <!-- /Reset Password Form -->

        </div>
      </transition>
      <!-- /Reset Password -->

    </div>
  </div>
</template>

<script>
  import notificationMixin from '../../../../../js/backend/mixins/notificationMixin'
  import notifyMixin from '../../../../../js/backend/mixins/notifyMixin'
  import helperMixin from '../../../../../js/backend/mixins/helperMixin'

  export default {
    mixins: [notificationMixin, notifyMixin, helperMixin],

    data () {
      let validateNewPasswordMatch = (rule, value, callback) => {
        if (value !== this.resetPassword.newPassword) {
          callback(new Error(this.$root.labels.passwords_do_not_match))
        }

        callback()
      }

      return {
        activeAuthForm: 'signIn',
        forgotPassword: {
          email: ''
        },
        errors: {
          email: '',
          password: '',
          newPassword: '',
          newPasswordReType: ''
        },
        resetPassword: {
          email: '',
          newPassword: '',
          newPasswordReType: '',
          token: ''
        },
        rulesAuth: {
          email: [
            {required: true, message: this.$root.labels.enter_email_warning, trigger: 'submit'},
            {type: 'email', message: this.$root.labels.enter_valid_email_warning, trigger: 'submit'}
          ],
          password: [
            {required: true, message: this.$root.labels.enter_password_warning, trigger: 'submit'}
          ]
        },
        rulesForgotPassword: {
          email: [
            {required: true, message: this.$root.labels.enter_email_warning, trigger: 'submit'},
            {type: 'email', message: this.$root.labels.enter_valid_email_warning, trigger: 'submit'}
          ]
        },
        rulesResetPassword: {
          newPassword: [
            {required: true, message: this.$root.labels.new_password_requred, trigger: 'submit'}
          ],
          newPasswordReType: [
            {required: true, message: this.$root.labels.re_type_requred, trigger: 'submit'},
            {validator: validateNewPasswordMatch, trigger: 'submit'}
          ]
        },
        loadingAuth: false,
        loadingForgotPassword: false,
        loadingResetPassword: false,
        signIn: {
          email: '',
          password: ''
        },
        signUp: {
          email: '',
          password: ''
        }
      }
    },

    mounted () {
      let urlParams = this.getUrlQueryParams(window.location.href)

      if ('token' in urlParams && 'email' in urlParams) {
        this.activeAuthForm = 'resetPassword'
        this.resetPassword.email = urlParams.email
        this.resetPassword.token = urlParams.token
      }
    },

    methods: {
      goToSignUp () {
        this.activeAuthForm = 'signUp'
        this.signIn = this.resetAuthOnInitialState()
        this.$refs[this.activeAuthForm].clearValidate()
      },

      goToSignIn () {
        this.activeAuthForm = 'signIn'
        this.signUp = this.resetAuthOnInitialState()
        this.forgotPassword.email = ''
        this.$refs[this.activeAuthForm].clearValidate()
      },

      goToForgotPassword () {
        this.activeAuthForm = 'forgotPassword'
        this.signIn = this.resetAuthOnInitialState()
        this.$refs[this.activeAuthForm].clearValidate()
      },

      clearValidation () {
        if (typeof this.$refs[this.activeAuthForm] !== 'undefined') {
          this.$refs[this.activeAuthForm].clearValidate()
          this.errors = this.resetErrorsOnInitialState()
        }
      },

      resetAuthOnInitialState () {
        return {
          email: '',
          password: ''
        }
      },

      resetErrorsOnInitialState () {
        return {
          email: '',
          password: '',
          newPassword: '',
          newPasswordReType: ''
        }
      },

      onAuthorize (action) {
        this.clearValidation()

        this.$refs[this.activeAuthForm].validate((valid) => {
          if (valid) {
            this.loadingAuth = true
            this.sendAmeliaSmsApiRequest(action, this.onAuthorizeSuccess, this.onAuthorizeError)
          } else {
            return false
          }
        })
      },

      onAuthorizeSuccess () {
        this.loadingAuth = false
        this.$root.settings.notifications.smsSignedIn = true
      },

      onAuthorizeError (data) {
        let $this = this
        this.loadingAuth = false

        Object.keys(data.errors).forEach(function (key) {
          $this.errors[key] = $this.$root.labels[data.errors[key][0]]
        })
      },

      onForgotPassword () {
        this.errors = this.resetErrorsOnInitialState()
        this.$refs[this.activeAuthForm].validate((valid) => {
          if (valid) {
            this.loadingForgotPassword = true
            this.sendAmeliaSmsApiRequest('forgotPassword', this.onForgotPasswordSuccess, this.onForgotPasswordError)
          } else {
            return false
          }
        })
      },

      onForgotPasswordSuccess () {
        this.notify(this.$root.labels.success, this.$root.labels.recovery_email_sent, 'success')
        this.goToSignIn()
        this.loadingForgotPassword = false
      },

      onForgotPasswordError (data) {
        this.errors.email = this.$root.labels[data.message]
        this.loadingForgotPassword = false
      },

      onResetPassword () {
        this.errors = this.resetErrorsOnInitialState()
        this.$refs[this.activeAuthForm].validate((valid) => {
          if (valid) {
            this.loadingResetPassword = true
            this.sendAmeliaSmsApiRequest('resetPassword', this.onResetPasswordSuccess, this.onResetPasswordError)
          } else {
            return false
          }
        })
      },

      onResetPasswordSuccess () {
        this.notify(this.$root.labels.success, this.$root.labels.password_reset_success, 'success')
        let redirectURL = this.removeURLParameter(window.location.href, 'notificationTab')
        redirectURL = this.removeURLParameter(redirectURL, 'token')
        redirectURL = this.removeURLParameter(redirectURL, 'email')
        history.pushState(null, null, redirectURL + '#/notifications')
        this.goToSignIn()
        this.loadingResetPassword = false
      },

      onResetPasswordError (data) {
        let $this = this
        this.loadingResetPassword = false

        if (typeof data.errors !== 'undefined') {
          Object.keys(data.errors).forEach(function (key) {
            $this.errors[key] = $this.$root.labels[data.errors[key][0]]
          })
        } else {
          this.notify(this.$root.labels.error, this.$root.labels[data.message], 'error')
          this.clearValidation()
        }
      }
    }
  }
</script>
