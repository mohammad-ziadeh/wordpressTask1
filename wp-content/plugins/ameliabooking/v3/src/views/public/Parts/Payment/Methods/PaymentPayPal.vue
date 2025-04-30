<template>
  <div class="am-fs__payment_payPal" :style="cssVars">
  </div>
</template>

<script setup>
import {
  settings,
  ajaxUrl
} from '../../../../../plugins/settings.js'

// * Import from Vue
import {
  inject,
  computed,
  onMounted,
  nextTick
} from 'vue'

// * Import from Vuex
import { useStore } from 'vuex'

// * Composables
import {
  usePaymentError,
  useBookingData,
  useCreateBooking,
  useCreateBookingSuccess,
  useCreateBookingError,
  getErrorMessage
} from '../../../../../assets/js/public/booking.js'

const store = useStore()

// * Labels
const amLabels = inject('amLabels')


// * Step Functions
const { nextStep } = inject('changingStepsFunctions', {
  nextStep: () => {}
})

// * Colors
// let amColors = inject('amColors')
//
let cssVars = computed(() => {
  return {
  }
})

// * Payment Part
let transactionReference = null

const shortcodeData = inject('shortcodeData')

function payPalPaymentInit () {
  nextTick(() => {
    window.paypal.Button.render(
      {
        style: {
          size: 'responsive',
          color: 'gold',
          shape: 'rect',
          tagline: false,
          height: 40
        },

        env: settings.payments.payPal.sandboxMode ? 'sandbox' : 'production',

        client: {
          sandbox: settings.payments.payPal.testApiClientId,
          production: settings.payments.payPal.liveApiClientId
        },

        commit: true,

        validate: function (actions) {
          store.commit('coupon/setPayPalActions', actions)
          if (store.getters['coupon/getCouponValidated']) {
            store.commit('coupon/enablePayPalActions')
          } else {
            store.commit('coupon/disablePayPalActions')
          }
        },

        onClick: function () {
          if (store.getters['coupon/getCouponValidated']) {
            store.commit('coupon/enablePayPalActions')
          } else {
            store.commit('coupon/disablePayPalActions')
            emits('payment-error', amLabels.coupon_mandatory)
          }
        },

        payment: function () {
          return window.paypal.request(
            {
              method: 'post',
              url: ajaxUrl + '/payment/payPal',
              json: useBookingData(
                store,
                null,
                true,
                {},
                null
              )['data']
            }
          ).then(response => {
            transactionReference = response.data.transactionReference

            return response.data.paymentID
          }).catch(error => {
              payPalError(error)
            }
          )
        },

        onAuthorize: function (data, actions) {
          return actions.payment.get().then(
            function () {
              store.commit('setLoading', true)

              useCreateBooking(
                store,
                useBookingData(
                  store,
                  null,
                  false,
                  {
                    transactionReference: transactionReference,
                    PaymentId: data.paymentID,
                    PayerId: data.payerID
                  },
                  null
                ),
                successBooking,
                error => {
                  useCreateBookingError(
                    store,
                    error.response.data,
                    () => {
                      emits('payment-error', getErrorMessage())
                    }
                  )
                }
              )
            }
          )
        },

        onCancel: function () {
          store.commit('setLoading', false)
        },

        onError: function (error) {
          payPalError(error)
        }
      },
      '#am-paypal-element-' + shortcodeData.value.counter
    )
  })
}

function payPalError(error) {
  let errorString = error.toString()

  let response = JSON.parse(
    JSON.stringify(
      JSON.parse(errorString.substring(errorString.indexOf('{'),
      errorString.lastIndexOf('}') + 1))
    )
  )

  if (typeof response === 'object' && response.hasOwnProperty('data')) {
    errorBooking(response)
  } else if (typeof response === 'object' && response.hasOwnProperty('message')) {
    usePaymentError(
      store,
      function () {
        emits('payment-error', response.message)
      }
    )
  } else {
    usePaymentError(
      store,
      function () {
        emits('payment-error', errorString)
      }
    )
  }
}

function successBooking (response) {
  useCreateBookingSuccess(
    store,
    response,
    function () {
      nextStep()
    }
  )
}

// * Components Emits
const emits = defineEmits(['payment-error'])

function errorBooking (error) {
  useCreateBookingError(
    store,
    error,
    () => {
      emits('payment-error', getErrorMessage())
    }
  )
}

onMounted(() => {
  payPalPaymentInit()
})
</script>

<script>
export default {
  name: 'PaymentPayPal'
}
</script>

<style lang="scss">
.amelia-v2-booking {
  #amelia-container {
    .am-fs__payment_payPal {
      height: 56px;
      .paypal-button {
        width: 160px;
        border-radius: 9px;
      }
    }
  }
}
</style>
