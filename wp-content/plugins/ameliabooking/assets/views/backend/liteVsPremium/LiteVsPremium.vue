<template>
  <div id="am-lite-vs-premium" class="am-wrap">
    <div class="am-body">

      <!-- Page Header -->
      <page-header></page-header>
      <!-- /Page Header -->

      <div class="am-lite-vs-premium-welcome am-section am-lite-vs-premium-section">

        <div class="am-lite-vs-premium-welcome-left">

          <div class="am-lite-vs-premium-welcome-title">{{ $root.labels.amelia_plans_comparison }}</div>

          <div class="am-lite-vs-premium-welcome-subtitle">{{ $root.labels.upgrade_to_premium }}</div>

          <a class="am-lite-vs-premium-btn" href="https://wpamelia.com/pricing/?utm_source=amelia-lite&utm_medium=lite-upgrade&utm_content=amelia&utm_campaign=amelia-lite" target="_blank" rel="nofollow">
            {{ $root.labels.upgrade_now }}
          </a>

        </div>

        <div class="am-lite-vs-premium-welcome-right">
          <img :src="$root.getUrl+'public/img/am-lite-vs-premium.webp'" />
        </div>

        <div class="am-lite-vs-premium-welcome-border">
        </div>

      </div>

      <div class="am-lite-vs-premium-table-wrapper">
        <div class="am-lite-vs-premium-table am-section am-lite-vs-premium-section">

        <el-row class="am-lite-vs-premium-table-row-header">
          <el-col class="el-table_1_column_1 cell" :span="12" :sm="8"><div>Features</div></el-col>
          <el-col class="el-table_1_column_2 cell" :span="3" :sm="4"><div>Lite</div></el-col>
          <el-col class="el-table_1_column_3 cell" :span="3" :sm="4"><div>Starter</div></el-col>
          <el-col class="el-table_1_column_4 cell" :span="3" :sm="4"><div>Standard</div></el-col>
          <el-col class="el-table_1_column_5 cell" :span="3" :sm="4"><div>Pro</div></el-col>
          <el-col class="el-table_1_column_6 cell" :span="3" :sm="4"><div>Elite</div></el-col>
        </el-row>

        <el-row class="am-lite-vs-premium-table-row" v-for="item in features" :key="item.feature">
          <el-col :span="12" :sm="8" class="am-lite-vs-premium-table-feature">
            <div class="am-lite-vs-premium-table-feature-name">{{ item.feature }}</div>
            <el-tag
                v-if="item.tag"
                :type="item.tag === 'Soon' ? '' : 'success'"
                disable-transitions
            >{{ item.tag }}
            </el-tag>
          </el-col>

          <el-col :span="3" :sm="4" class="am-lite-vs-premium-table-col-lite">
              <div :class="typeof item.lite === 'boolean' ? (item.lite ? 'am-blue-check' : 'am-minus') : ''">
                {{typeof item.lite !== 'boolean' ? item.lite : ''}}
                <el-tooltip placement="top" v-if="item.lite == 'Limited' && item.feature == 'Support'">
                  <div slot="content" v-html="$root.labels.lite_support_tooltip"></div>
                  <i class="el-icon-info am-tooltip-icon"></i>
                </el-tooltip>
              </div>
          </el-col>

          <el-col :span="3" :sm="4" class="am-lite-vs-premium-table-col-starter">
            <div :class="typeof item.starter === 'boolean' ? (item.starter ? 'am-blue-check' : 'am-minus') : ''">
              {{typeof item.starter !== 'boolean' ? item.starter : ''}}
            </div>
          </el-col>

          <el-col :span="3" :sm="4" class="am-lite-vs-premium-table-col-basic">
            <div :class="typeof item.standard === 'boolean' ? (item.standard ? 'am-blue-check' : 'am-minus') : ''">
              {{typeof item.standard !== 'boolean' ? item.standard : ''}}
            </div>
          </el-col>

          <el-col :span="3" :sm="4" class="am-lite-vs-premium-table-col-pro">
            <div :class="typeof item.pro === 'boolean' ? (item.pro ? 'am-blue-check' : 'am-minus') : ''">
              {{typeof item.pro !== 'boolean' ? item.pro : ''}}
            </div>
          </el-col>

          <el-col :span="3" :sm="4" class="am-lite-vs-premium-table-col-developer">
              <div :class="typeof item.elite === 'boolean' ? (item.elite ? 'am-blue-check' : 'am-minus') : ''">
                {{typeof item.elite !== 'boolean' ? item.elite : ''}}
              </div>
          </el-col>
        </el-row>

        <div class="am-lite-vs-premium-table-btn-holder">
          <a class="am-lite-vs-premium-btn" href="https://wpamelia.com/pricing/?utm_source=amelia-lite&utm_medium=lite-upgrade&utm_content=amelia&utm_campaign=amelia-lite" target="_blank" rel="nofollow">
            {{ $root.labels.upgrade_now }}
          </a>
        </div>

      </div>
      </div>
    </div>
  </div>
</template>

<script>
import PageHeader from '../parts/PageHeader.vue'

export default {

  data () {
    return {
      blogPosts: [],
      changelog: {
        version: '6.5',
        changes: []
      },
      features: [
        {
          feature: 'Domain',
          lite: '1',
          starter: '1',
          standard: '1',
          pro: 'up to 5',
          elite: 'unlimited'
        },
        {
          feature: 'Support',
          lite: 'Limited',
          starter: 'Premium',
          standard: 'Premium',
          pro: 'Premium',
          elite: 'Premium'
        },
        {
          feature: 'Unlimited Appointments and Events',
          lite: true,
          starter: true,
          standard: true,
          pro: true,
          elite: true
        },
        {
          feature: 'Customizable Design',
          lite: true,
          starter: true,
          standard: true,
          pro: true,
          elite: true
        },
        {
          feature: 'Automated Notification Management (SMS and Email)',
          lite: 'Limited',
          starter: true,
          standard: true,
          pro: true,
          elite: true
        },
        {
          feature: 'No-code Website Builder and Embeddable Booking Form',
          lite: true,
          starter: true,
          standard: true,
          pro: true,
          elite: true
        },
        {
          feature: 'Import Customers\' data',
          lite: true,
          starter: true,
          standard: true,
          pro: true,
          elite: true
        },
        {
          feature: 'Multiple Booking Forms',
          lite: true,
          starter: true,
          standard: true,
          pro: true,
          elite: true
        },
        {
          feature: 'Square Integration',
          lite: true,
          starter: true,
          standard: true,
          pro: true,
          elite: true,
          tag: 'New'
        },
        {
          feature: 'Group Appointment Bookings',
          lite: false,
          starter: true,
          standard: true,
          pro: true,
          elite: true
        },
        {
          feature: 'Unlimited Employees',
          lite: false,
          starter: true,
          standard: true,
          pro: true,
          elite: true
        },
        {
          feature: 'Employee and Customer Panel',
          lite: false,
          starter: true,
          standard: true,
          pro: true,
          elite: true
        },
        {
          feature: 'Discount coupons',
          lite: false,
          starter: true,
          standard: true,
          pro: true,
          elite: true
        },
        {
          feature: 'Service Extras',
          lite: false,
          starter: true,
          standard: true,
          pro: true,
          elite: true
        },
        {
          feature: 'Marketing Tools and Analytics (Google Analytics, Facebook Pixel)',
          lite: false,
          starter: true,
          standard: true,
          pro: true,
          elite: true
        },
        {
          feature: 'Management of Multiple Locations',
          lite: false,
          starter: false,
          standard: true,
          pro: true,
          elite: true
        },
        {
          feature: 'Tax feature',
          lite: false,
          starter: false,
          standard: true,
          pro: true,
          elite: true,
          tag: 'New'
        },
        {
          feature: 'Invoice',
          lite: false,
          starter: false,
          standard: true,
          pro: true,
          elite: true,
          tag: 'New'
        },
        {
          feature: 'Recurring Appointments and Events',
          lite: false,
          starter: false,
          standard: true,
          pro: true,
          elite: true
        },
        {
          feature: 'Deposit Payments',
          lite: false,
          starter: false,
          standard: true,
          pro: true,
          elite: true
        },
        {
          feature: 'Custom Service Duration',
          lite: false,
          starter: false,
          standard: true,
          pro: true,
          elite: true
        },
        {
          feature: 'Multilingual Support',
          lite: false,
          starter: false,
          standard: true,
          pro: true,
          elite: true
        },
        {
          feature: '4 Payment Providers (Mollie, PayPal, Stripe, Razorpay)',
          lite: false,
          starter: false,
          standard: true,
          pro: true,
          elite: true
        },
        {
          feature: 'WooCommerce Payments',
          lite: false,
          starter: false,
          standard: true,
          pro: true,
          elite: true
        },
        {
          feature: 'Online Platforms (Zoom, GoogleMeet, MicrosoftTeams, LessonSpace)',
          lite: false,
          starter: false,
          standard: true,
          pro: true,
          elite: true
        },
        {
          feature: 'Calendar Synchronizations (Google Calendar, Outlook, Apple)',
          lite: false,
          starter: false,
          standard: true,
          pro: true,
          elite: true
        },
        {
          feature: 'WebHooks (Zapier and MailChimp)',
          lite: false,
          starter: false,
          standard: true,
          pro: true,
          elite: true
        },
        {
          feature: 'Payment links',
          lite: false,
          starter: false,
          standard: true,
          pro: true,
          elite: true
        },
        {
          feature: 'Waiting List',
          lite: false,
          starter: false,
          standard: false,
          pro: true,
          elite: true,
          tag: 'New'
        },
        {
          feature: 'WhatsApp integration',
          lite: false,
          starter: false,
          standard: false,
          pro: true,
          elite: true,
          tag: 'New'
        },
        {
          feature: 'Packages of Services',
          lite: false,
          starter: false,
          standard: false,
          pro: true,
          elite: true
        },
        {
          feature: 'Resources',
          lite: false,
          starter: false,
          standard: false,
          pro: true,
          elite: true,
          tag: 'New'
        },
        {
          feature: 'Refund option',
          lite: false,
          starter: false,
          standard: false,
          pro: true,
          elite: true,
          tag: 'New'
        },
        {
          feature: 'Cart',
          lite: false,
          starter: false,
          standard: false,
          pro: true,
          elite: true,
          tag: 'New'
        },
        {
          feature: 'Stripe Connect',
          lite: false,
          starter: false,
          standard: false,
          pro: true,
          elite: true,
          tag: 'New'
        },
        {
          feature: 'REST API',
          lite: false,
          starter: false,
          standard: false,
          pro: false,
          elite: true,
          tag: 'New'
        }/*
        {
          feature: 'Reviews',
          lite: false,
          standard: false,
          pro: true,
          elite: true,
          tag: 'Soon'
        }*/
      ]
    }
  },

  methods: {
    getNews () {
    },

    getIconType (type) {
      let typeToReturn = type.toLowerCase()

      switch (typeToReturn) {
        case 'improvement':
        case 'bugfix':
        case 'feature':
        case 'translations':
          return typeToReturn
        default:
          return 'plus'
      }
    }
  },

  created () {
    this.getNews()
  },

  components: {
    PageHeader
  }
}
</script>
