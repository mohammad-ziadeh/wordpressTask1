<template>
  <div>
    <div class="am-dialog-scrollable">

      <!-- Dialog Header -->
      <div class="am-dialog-header">
        <el-row>
          <el-col :span="14">
            <h2>{{ $root.labels.recharge_balance }}</h2>
          </el-col>
          <el-col :span="10" class="align-right">
            <el-button @click="closeDialog" class="am-dialog-close" size="small" icon="el-icon-close"></el-button>
          </el-col>
        </el-row>
      </div>
      <!-- /Dialog Header -->

      <!-- Dialog Body -->
      <div class="am-sms-money">

        <!-- 10$, 20$, 50$ -->
        <el-row :gutter="16">

          <!-- 10$ -->
          <el-col :sm="8">
            <div class="am-sms-money-card" @click="changeAmount(10)"
                 :class="[ paymentCheckout.amount === 10 && customAmountEnabled === false ? 'active' : '' ]">
              $10
            </div>
          </el-col>
          <!-- /10$ -->

          <!-- 20$ -->
          <el-col :sm="8">
            <div class="am-sms-money-card" @click="changeAmount(20)"
                 :class="[ paymentCheckout.amount === 20 && customAmountEnabled === false ? 'active' : '' ]">
              $20
            </div>
          </el-col>
          <!-- /20$ -->

          <!-- 50$ -->
          <el-col :sm="8">
            <div class="am-sms-money-card" @click="changeAmount(50)"
                 :class="[ paymentCheckout.amount === 50 && customAmountEnabled === false ? 'active' : '' ]">
              $50
            </div>
          </el-col>
          <!-- /50$ -->

        </el-row>
        <!-- /10$, 20$, 50$ -->

        <!-- 100$, 200$, 500$ -->
        <el-row :gutter="16">

          <!-- 100$ -->
          <el-col :sm="8">
            <div class="am-sms-money-card" @click="changeAmount(100)"
                 :class="[ paymentCheckout.amount === 100 && customAmountEnabled === false ? 'active' : '' ]">
              $100
            </div>
          </el-col>
          <!-- /100$ -->

          <!-- 200$ -->
          <el-col :sm="8">
            <div class="am-sms-money-card" @click="changeAmount(200)"
                 :class="[ paymentCheckout.amount === 200 && customAmountEnabled === false ? 'active' : '' ]">
              $200
            </div>
          </el-col>
          <!-- /200$ -->

          <!-- 500$ -->
          <el-col :sm="8">
            <div class="am-sms-money-card" @click="changeAmount(500)"
                 :class="[ paymentCheckout.amount === 500 && customAmountEnabled === false ? 'active' : '' ]">
              $500
            </div>
          </el-col>
          <!-- /500$ -->

        </el-row>
        <!-- /100$, 200$, 500$ -->

        <!-- Total Price & Recharge Balance Button -->
        <div class="am-sms-money-recharge">

          <!-- Total Price -->
          <span class="am-sms-money-total-price">
            {{ $root.labels.sms_vat_apply }}
          </span>
          <!-- /Total Price -->

          <!-- Recharge Balance Button -->
          <el-button @click="onCheckoutClick" type="primary">
            {{ $root.labels.recharge }}
          </el-button>
          <!-- /Recharge Balance Button -->

        </div>
        <!-- /Total Price & Recharge Balance Button -->


      </div>
      <!-- /Dialog Body -->

    </div>
  </div>
</template>

<script>
  import imageMixin from '../../../../../js/common/mixins/imageMixin'
  import ElButton from 'element-ui/packages/button/src/button.vue'
  import notificationMixin from '../../../../../js/backend/mixins/notificationMixin'
  import notifyMixin from '../../../../../js/backend/mixins/notifyMixin'

  export default {
    mixins: [imageMixin, notificationMixin, notifyMixin],

    props: {
      user: {
        default: () => {},
        type: Object
      }
    },

    data () {
      return {
        customAmountEnabled: false,
        minAmount: 10,
        paymentCheckout: {
          amount: 10
        }
      }
    },

    mounted () {
      // eslint-disable-next-line no-undef
      Paddle.Setup({vendor: parseInt(this.$root.smsPaddleSettings.vendorId)})
      this.inlineSVG()
    },

    methods: {
      closeDialog () {
        this.$emit('closeDialogRechargeBalance')
      },

      changeAmount (amount) {
        this.customAmountEnabled = false
        this.paymentCheckout.amount = amount
      },

      onCheckoutClick () {
        let productId = null

        switch (this.paymentCheckout.amount) {
          case 20:
            productId = parseInt(this.$root.smsPaddleSettings.product20)
            break
          case 50:
            productId = parseInt(this.$root.smsPaddleSettings.product50)
            break
          case 100:
            productId = parseInt(this.$root.smsPaddleSettings.product100)
            break
          case 200:
            productId = parseInt(this.$root.smsPaddleSettings.product200)
            break
          case 500:
            productId = parseInt(this.$root.smsPaddleSettings.product500)
            break
          default:
            productId = parseInt(this.$root.smsPaddleSettings.product10)
        }

        let $this = this
        Paddle.Checkout.open({
          product: productId,
          email: this.user.email,
          allowQuantity: false,
          passthrough: JSON.stringify({email: this.user.email}),
          successCallback: function (data) {
            $this.$emit('recharged', $this.paymentCheckout.amount)
            $this.notify($this.$root.labels.success, $this.$root.labels.balance_recharged, 'success')
          }
        })
      }
    },

    components: {
      ElButton
    }
  }
</script>
