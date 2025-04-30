<template>
  <transition name="fade" v-if="$root.licence.isLite && premiumBannerVisibility">
    <div class="am-amelia-banner-get-more">
      <a class="am-amelia-banner-get-more-close-btn" @click="closeForever">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="#FFFFFF" xmlns="http://www.w3.org/2000/svg">
          <path opacity="0.8" d="M15 15L5 5M15 5L5 15" stroke="#FFFFFF" stroke-linecap="round"/>
        </svg>
      </a>
      <div class="am-amelia-banner-get-more-content">
        <div class="am-amelia-banner-get-more-content-left">
          <img class="am-get-more-premium" :src="$root.getUrl + 'public/img/am-get-more-premium.svg'"/>
          <img class="am-get-more-premium-sm" :src="$root.getUrl + 'public/img/am-get-more-premium-sm.svg'"/>
        </div>
        <div class="am-amelia-banner-get-more-content-right">
          <div class="am-amelia-banner-get-more-content-right-text">
            <div class="am-amelia-banner-text-holder" v-for="item in getMoreBanner" :key="item">
              <img :src="$root.getUrl + 'public/img/check-white.svg'"/> {{item}}
            </div>
          </div>
          <div class="am-amelia-banner-get-more-content-right-buttons">
            <div class="am-amelia-banner-get-more-content-right-button-holder">
              <el-button
                  class="am-upgrade-to-premium"
                  @click="goToWpAmeliaPricing"
              >
                Upgrade to Premium
              </el-button>
            </div>
            <div class="am-amelia-banner-get-more-content-right-button-holder">
              <el-button class="am-learn-more" @click="goToLiteVsPremium">
                Learn More <img :src="$root.getUrl + 'public/img/arrow-right.svg'"/>
              </el-button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>

export default {
  name: 'GetPremiumBanner',

  data () {
    return {
      premiumBannerVisibility: true,
      getMoreBanner: [
        'Dedicated customer support',
        'No hidden costs or add-ons',
        'Monthly updates',
        'Premium features',
        'Unlimited number of employees',
        'Numerous integrations'
      ]
    }
  },

  created () {
    this.premiumBannerVisibility = this.$root.settings.activation.premiumBannerVisibility
  },

  methods: {
    goToWpAmeliaPricing () {
      window.open('https://wpamelia.com/pricing/?utm_source=amelia-lite&utm_medium=lite-upgrade&utm_content=amelia&utm_campaign=amelia-lite', '_blank', 'noopener,noreferrer')
    },

    goToLiteVsPremium () {
      window.location = 'admin.php?page=wpamelia-lite-vs-premium'
    },

    closeForever () {
      this.premiumBannerVisibility = false
      this.$http.post(`${this.$root.getAjaxUrl}/settings`, {activation: {premiumBannerVisibility: false}})
        .then(response => {})
        .catch(e => {
          console.log(e.message)
        })
    }
  }
}
</script>

<style lang="less">
.am-amelia-banner {
  &-get-more {
    position: relative;
    background: radial-gradient(94.97% 235.95% at 26.13% 80.5%, #517DF5 0%, #002381 100%);
    padding: 40px 80px;
    gap: 10px;
    margin-bottom: 20px;

    @media only screen and (max-width: 1340px) {
      padding: 40px 30px;
    }

    @media only screen and (max-width: 860px) {
      padding: 24px;
    }

    &-content {
      display: flex;
      flex-direction: row;
      align-items: center;

      &-left {
        width: 50%;

        @media only screen and (max-width: 1340px) {
          width: 40%;

          img {
            width: 100%;
            height: auto;
          }
        }

        .am-get-more-premium-sm {
          display: none;
        }
      }

      &-right {
        width: 50%;

        @media only screen and (max-width: 1340px) {
          width: 60%;
        }
        &-text {
          display: flex;
          flex-direction: row;
          flex-wrap: wrap;
        }

        &-button-holder {
          width: 50%;

          @media only screen and (max-width: 460px) {
            width: 100%;
          }
        }

        &-buttons {
          display: flex;
          flex-direction: row;
          margin-top: 26px;
          .el-button {
            font-family: 'Amelia Roboto', sans-serif;
            padding: 8px 16px 8px 16px;
            gap: 10px;
            border-radius: 7px;
            background: linear-gradient(351.76deg, #FFD601 -8.07%, #FCFF7D 123.41%);
            min-width: 302px;
            font-size: 16px;
            font-weight: 500;
            line-height: 22px;
            text-align: center;

            &.am-upgrade-to-premium {
              color: #04080B;

              &:hover {
                border-color: #FFD601;
              }
            }
            &.am-learn-more {
              background: transparent;
              color: #FFFFFF;
              border: 1px solid #FFFFFF;

              span {
                align-items: center;
                display: flex;
                justify-content: center;
                gap: 10px;
              }
            }

            @media only screen and (max-width: 1600px) {
              min-width: 100%;
            }

          }

          @media only screen and (max-width: 1600px) {
            gap: 12px;
          }

          @media only screen and (max-width: 460px) {
            flex-direction: column;
          }
        }
      }

      @media only screen and (max-width: 860px) {
        flex-direction: column;

        &-left {
          width: 100%;
          justify-content: center;
          display: flex;

          img {
            max-width: 343px;
            margin-bottom: 20px;

            &.am-get-more-premium-sm {
              display: block;
            }

            &.am-get-more-premium {
              display: none;
            }
          }
        }

        &-right {
          width: 100%;
        }
      }
    }

    &-close-btn {
      cursor: pointer;
      height: 20px;
      width: 20px;
      position: absolute;
      right: 10px;
      top: 10px;
    }
  }

  &-text-holder {
    font-family: 'Amelia Roboto', sans-serif;
    align-items: center;
    display: flex;
    margin-bottom: 8px;
    width: 50%;
    font-size: 18px;
    font-weight: 500;
    line-height: 24px;
    text-align: left;
    color: #FFFFFF !important;

    @media only screen and (max-width: 460px) {
      width: 100%;
    }
  }
}
</style>
