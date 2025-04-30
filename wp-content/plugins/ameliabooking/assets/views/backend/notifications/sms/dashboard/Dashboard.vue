<template>
  <div class="am-sms-dashboard">

    <!-- Spinner -->
    <div class="am-spinner am-section" v-if="!fetched || !fetchedUserInfo">
      <img :src="$root.getUrl + 'public/img/spinner.svg'"/>
    </div>

    <!-- Dashboard -->
    <div v-show="fetched && fetchedUserInfo">

      <!-- Dashboard Header -->
      <div class="am-sms-dashboard-header">

        <!-- Logo -->
        <div class="am-sms-logo">
          <img :src="$root.getUrl + 'public/img/amelia-sms.svg'"/> {{ $root.labels.amelia_sms }}
        </div>
        <!-- /Logo -->

        <!-- User Data -->
        <div class="am-sms-loggedin-user">

          <!-- User Email -->
          <div>
            <span>{{ $root.labels.user_colon }}</span>
            <p class="am-sms-user-email">{{ user.email }}</p>
          </div>
          <!-- /User Email -->

          <!-- View Profile Button -->
          <el-button type="default" size="small" @click="navigationActive = 'user'">
            {{ $root.labels.view_profile }}
          </el-button>
          <!-- /View Profile Button -->

        </div>
        <!-- /User Data -->

        <!-- User Balance -->
        <div class="am-sms-balance">

          <!-- Balance Image -->
          <img v-show="documentWidth > largeMax" :src="$root.getUrl + 'public/img/sms-balance.svg'"/>
          <!-- /Balance Image -->

          <!-- Balance Data -->
          <div>
            <span>{{ $root.labels.balance_colon }}</span>
            <p class="am-sms-user-email">${{ user.balance }}</p>
          </div>
          <!-- /Balance Data -->

          <!-- Recharge Balance Button -->
          <el-button type="primary" size="small" @click="dialogRechargeBalance = true">
            {{ $root.labels.recharge_balance }}
          </el-button>
          <!-- /Recharge Balance Button -->

        </div>
        <!-- /User Balance -->

      </div>
      <!-- /Dashboard Header -->

      <!-- Dashboard Body -->
      <div class="am-sms-dashboard-body">

        <!-- Navigation -->
        <div class="am-sms-dashboard-nav">

          <!-- SMS History -->
          <div
              class="am-sms-dashboard-nav-item"
              :class="[ navigationActive === 'history' ? 'active' : '' ]"
              @click="navigationActive = 'history'"
          >
            {{ $root.labels.sms_history }}
          </div>
          <!-- /SMS History -->

          <!-- Customize SMS -->
          <div
              class="am-sms-dashboard-nav-item"
              :class="[ navigationActive === 'customize' ? 'active' : '' ]"
              @click="navigationActive = 'customize'"
          >
            {{ $root.labels.customize_sms }}
          </div>
          <!-- /Customize SMS -->

          <!-- Pricing -->
          <div
              class="am-sms-dashboard-nav-item"
              :class="[ navigationActive === 'pricing' ? 'active' : '' ]"
              @click="navigationActive = 'pricing'"
          >
            {{ $root.labels.pricing }}
          </div>
          <!-- /Pricing -->

          <!-- Payment History -->
          <div
              class="am-sms-dashboard-nav-item"
              :class="[ navigationActive === 'payments' ? 'active' : '' ]"
              @click="navigationActive = 'payments'"
          >
            {{ $root.labels.payment_history }}
          </div>
          <!-- /Payment History -->

          <!-- User Profile -->
          <div
              class="am-sms-dashboard-nav-item"
              :class="[ navigationActive === 'user' ? 'active' : '' ]"
              @click="navigationActive = 'user'"
          >
            {{ $root.labels.user_profile }}
          </div>
          <!-- /User Profile -->

        </div>
        <!-- /Navigation -->

        <!-- Dashboard Content -->
        <div
            class="am-sms-dashboard-content"
            :class="{ 'am-no-padding': navigationActive === 'customize', 'am-no-min-height': navigationActive === 'customize' }"
        >

          <!-- SMS History -->
          <transition name="fadeIn">
            <history
                v-if="navigationActive === 'history'"
                :fetchedDashboard="fetched"
                @fetchedHistory="fetched = true"
            >
            </history>
          </transition>
          <!-- /SMS History -->

          <!-- Customize SMS -->
          <transition name="fadeIn">
            <customize-notifications
                v-if="navigationActive === 'customize'"
                :notifications="notifications"
                :categories="categories"
                :customFields="customFields"
                :coupons="coupons"
                :events="events"
                :user="user"
                type="sms"
                :pageUrl="getPageUrl()"
                :languagesData="languagesData"
                :passed-used-languages="passedUsedLanguages"
                @manageLanguages="manageLanguages()"
            ></customize-notifications>
          </transition>
          <!-- /Customize SMS -->

          <!-- Pricing -->
          <transition name="fadeIn">
            <pricing
                v-if="navigationActive === 'pricing'"
            >
            </pricing>
          </transition>
          <!-- /Pricing -->

          <!-- Payment History -->
          <transition name="fadeIn">
            <payments
                v-if="navigationActive === 'payments'"
            >
            </payments>
          </transition>
          <!-- /Payment History -->

          <!-- User Profile -->
          <transition name="fadeIn">
            <user-profile
                v-if="navigationActive === 'user'"
                :user="user"
                :notificationsSettings="notificationsSettings"
                @logout="logout"
            >
            </user-profile>
          </transition>
          <!-- /User Profile -->

        </div>
        <!-- /Dashboard Content -->

      </div>
      <!-- /Dashboard Body -->

    </div>
    <!-- /Dashboard -->

    <!-- Add  -->
    <transition name="slide">
      <el-dialog
          class="am-side-dialog am-dialog-sms-money"
          :visible.sync="dialogRechargeBalance"
          :show-close="false"
          v-if="dialogRechargeBalance"
      >
        <dialog-recharge-balance
            :user="user"
            @recharged="increaseBalance"
            @closeDialogRechargeBalance="dialogRechargeBalance = false"
        >
        </dialog-recharge-balance>
      </el-dialog>
    </transition>

  </div>
</template>

<script>
  import DialogRechargeBalance from './DialogRechargeBalance.vue'
  import History from './History.vue'
  import CustomizeNotifications from './../../common/CustomizeNotifications.vue'
  import Pricing from './Pricing.vue'
  import Payments from './Payments.vue'
  import UserProfile from './UserProfile.vue'
  import { quillEditor } from 'vue-quill-editor'
  import durationMixin from '../../../../../js/common/mixins/durationMixin'
  import notificationMixin from '../../../../../js/backend/mixins/notificationMixin'
  import helperMixin from '../../../../../js/backend/mixins/helperMixin'
  import notifyMixin from '../../../../../js/backend/mixins/notifyMixin'
  import responsiveMixin from '../../../../../js/common/mixins/responsiveMixin'

  export default {
    mixins: [durationMixin, notificationMixin, helperMixin, notifyMixin, responsiveMixin],

    props: {
      categories: {
        default: () => [],
        type: Array
      },
      customFields: {
        default: () => [],
        type: Array
      },
      coupons: {
        default: () => [],
        type: Array
      },
      events: {
        default: () => [],
        type: Array
      },
      notifications: {
        default: () => [],
        type: Array
      },
      passedUsedLanguages: {
        default: () => [],
        type: Array
      },
      languagesData: {
        default: () => {},
        type: Object
      }
    },

    data () {
      return {
        dialogRechargeBalance: false,
        fetched: false,
        fetchedUserInfo: false,
        navigationActive: 'history',
        notificationsSettings: {},
        paymentComplete: {
          amount: null,
          payerId: null,
          paymentId: null
        },
        user: {
          balance: 0,
          email: ''
        }
      }
    },

    mounted () {
      let urlParams = this.getUrlQueryParams(window.location.href)

      this.getSettings()

      // If Reset Password URL is clicked and the user is already logged in remove URL params
      if ('notificationTab' in urlParams && 'token' in urlParams && 'email') {
        let redirectURL = this.removeURLParameter(window.location.href, 'notificationTab')
        redirectURL = this.removeURLParameter(redirectURL, 'token')
        redirectURL = this.removeURLParameter(redirectURL, 'email')
        history.pushState(null, null, redirectURL + '#/notifications')
      }

      this.getUserInfo()
    },

    methods: {
      getPageUrl () {
        return location.href.substring(0, location.href.lastIndexOf('?')).substring(0, location.href.substring(0, location.href.lastIndexOf('?')).lastIndexOf('/')) + '/'
      },

      getSettings () {
        this.$http.get(
          `${this.$root.getAjaxUrl}/settings`
        ).then(response => {
          this.notificationsSettings = response.data.data.settings.notifications
        }).catch(e => {
          console.log(e.message)
          this.fetched = true
        })
      },

      getUserInfo () {
        this.sendAmeliaSmsApiRequest('getUserInfo', this.onGetUserInfoSuccess, this.onGetUserInfoError)
      },

      onGetUserInfoSuccess (data) {
        this.user = data.user
        this.user.balance = this.getFormattedMessagePrice(this.user.balance)
        this.fetchedUserInfo = true
      },

      onGetUserInfoError () {
        this.$root.settings.notifications.smsSignedIn = false
      },

      logout () {
        this.fetched = false

        this.notificationsSettings.smsSignedIn = false
        this.notificationsSettings.smsApiToken = ''

        this.$http.post(`${this.$root.getAjaxUrl}/settings`, {
          notifications: this.notificationsSettings
        }).then(() => {
          this.$root.settings.notifications.smsSignedIn = false
        }).catch(() => {
          this.$root.settings.notifications.smsSignedIn = false
        })
      },

      increaseBalance (amount) {
        this.user.balance = this.getFormattedMessagePrice(parseFloat(this.user.balance.replace(',', '.')) + parseInt(amount))
        this.dialogRechargeBalance = false
      },

      manageLanguages () {
        this.$emit('manageLanguages')
      }
    },

    components: {
      History,
      CustomizeNotifications,
      Pricing,
      Payments,
      UserProfile,
      DialogRechargeBalance,
      quillEditor
    }
  }
</script>
