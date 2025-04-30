<template>
  <div id="am-sms-notifications" class="am-body">

    <!-- SMS Authorization -->
    <authorization
        v-if="$root.settings.notifications.smsSignedIn === false"
    >
    </authorization>

    <!-- SMS Dashboard -->
    <dashboard
        v-else
        :notifications="notifications"
        :categories="categories"
        :customFields="customFields"
        :coupons="coupons"
        :events="events"
        :passed-used-languages="passedUsedLanguages"
        :languages-data="languagesData"
        @manageLanguages="manageLanguages"
    >
    </dashboard>

  </div>
</template>

<script>
  import Authorization from './auth/Authorization.vue'
  import Dashboard from './dashboard/Dashboard.vue'

  export default {
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

    methods: {
      manageLanguages () {
        this.$emit('manageLanguages')
      }
    },

    components: {
      Authorization,
      Dashboard
    }
  }
</script>
