<template>
  <transition name="fade" v-if="$root.licence.isLite && dismissibleBannerVisibility">
    <div
      class="am-dismiss"
      :style="{backgroundImage: `url(${$root.getUrl}public/img/dismiss/am-dismiss-bgr.png)`}"
    >
      <a class="am-dismiss__close" @click="closeForever">
        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="20" height="20" viewBox="0 0 20 20" xml:space="preserve">
          <desc>Created with Fabric.js 5.2.4</desc>
          <defs>
          </defs>
          <rect x="0" y="0" width="100%" height="100%" fill="transparent"></rect>
          <g transform="matrix(1 0 0 1 10 10)" id="e5447793-4e4b-4693-bccb-e9a5f9eacb67"  >
            <rect style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(255,255,255); fill-rule: nonzero; opacity: 1; visibility: hidden;" vector-effect="non-scaling-stroke"  x="-10" y="-10" rx="0" ry="0" width="20" height="20" />
          </g>
          <g transform="matrix(1 0 0 1 10 10)" id="7ecdb507-a311-4b85-af01-1072cc7786ed"></g>
          <g transform="matrix(1 0 0 1 10 10)">
            <path style="stroke: rgb(255,255,255); stroke-width: 2; stroke-dasharray: none; stroke-linecap: round; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(255,255,255); fill-rule: nonzero; opacity: 1;"  transform=" translate(-10, -10)" d="M 15 15 L 5 5 M 15 5 L 5 15" stroke-linecap="round" />
          </g>
        </svg>
      </a>
      <div class="am-dismiss__inner">
        <img
          class="am-dismiss__img-main"
          :src="`${$root.getUrl}public/img/dismiss/amelia+ST.svg`"
          alt="Amelia + Superb Themes = More Bookings"
        >
        <img
          class="am-dismiss__img-mob"
          :src="`${$root.getUrl}public/img/dismiss/amelia+ST_mob.svg`"
          alt="Amelia + Superb Themes = More Bookings"
        >
        <div class="am-dismiss__text">
          <div class="am-dismiss__text-heading">
            GET A FREE THEME
          </div>
          <div class="am-dismiss__text-content">
            for your business packed with powerful booking plugin features from Amelia.
          </div>
          <div class="am-dismiss__text-btn" @click="goToPage">
            GRAB THIS DEAL
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: "DismissibleBanner",

  data () {
    return {
      dismissibleBannerVisibility: true
    }
  },

  created () {
    this.dismissibleBannerVisibility = this.$root.settings.activation.dismissibleBannerVisibility
  },

  methods: {
    goToPage () {
      window.open('https://digitalagency.wpamelia.com/', '_blank', 'noopener,noreferrer')
    },

    closeForever () {
      this.dismissibleBannerVisibility = false
      this.$http.post(`${this.$root.getAjaxUrl}/settings`, {activation: {dismissibleBannerVisibility: false}})
      .then(response => {})
      .catch(e => {
        console.log(e.message)
      })
    }
  }
}
</script>

<style lang="less">
#amelia-app-backend .am-body {
  .am-dismiss {
    position: relative;
    margin-bottom: 20px;
    background-repeat: no-repeat;
    background-size: cover;

    @media only screen and (max-width: 768px) {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 30px;
    }

    @media only screen and (max-width: 450px) {
      padding: 25px 10px 10px;
    }

    &__close {
      position: absolute;
      top: 5px;
      right: 5px;
      cursor: pointer;
    }

    &__img {
      &-mob {
        display: none;
      }
    }

    &__inner {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 30px 90px;

      @media only screen and (max-width: 1550px) {
        padding: 30px;

        img {
          width: 45%;
        }

        .am-dismiss__text {
          width: 45%;
        }
      }

      @media only screen and (max-width: 1040px) {
        img {
          width: 50%;
        }

        .am-dismiss__text {
          width: 40%;
        }
      }

      @media only screen and (max-width: 768px) {
        max-width: 436px;
        width: 100%;
        flex-direction: column;
        background-color: #fff;
        border-radius: 15px;

        .am-dismiss__img {
          &-main {
            display: none;
          }

          &-mob {
            display: block;
            width: 100%;
          }
        }

        .am-dismiss__text {
          width: 100%;
          background-color: transparent;
          padding: 30px 0 0;
        }
      }
    }

    &__text {
      max-width: 436px;
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background-color: #fff;
      padding: 30px;
      border-radius: 15px;

      * {
        font-family: 'Amelia Roboto', sans-serif;
      }

      &-heading {
        font-size: 25px;
        font-weight: 900;
        line-height: 1.1;
        text-align: center;
        color: #17295A;

        @media only screen and (max-width: 450px) {
          font-size: 22px;
        }
      }

      &-content {
        max-width: 265px;
        text-align: center;
        font-size: 15px;
        line-height: 1.2;
        font-weight: 400;
        color: #17295A;

        @media only screen and (max-width: 450px) {
          font-size: 13px;
        }
      }

      &-btn {
        font-size: 15px;
        font-weight: 600;
        line-height: 1;
        color: #FFF;
        background: linear-gradient(167.69deg, #3BA6FF 5.05%, #005AEE 91.04%);
        padding: 12px 16px;
        border-radius: 20px;
        margin-top: 20px;
        cursor: pointer;
        transition: all 0.3s ease-in-out;

        &:hover {
          background: linear-gradient(77.69deg, #3BA6FF 5.05%, #005AEE 91.04%);
        }
      }
    }
  }
}
</style>
