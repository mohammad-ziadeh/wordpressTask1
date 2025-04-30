<template>
  <div class="am-customize-main">
    <div class="am-customize-main__header">
      <div class="am-customize-main__header-inner">
        <h2>
          {{amLabels.choose_form}}
        </h2>
        <p>
          Choose a form you want to show on your website.
        </p>
      </div>
    </div>
    <div class="am-customize-main__content">
      <div class="am-customize-main__form-card__wrapper">
        <div class="am-customize-main__form-card">
          <div class="am-customize-main__form-card__content">
            <img :src="`${baseUrls.wpAmeliaPluginURL}v3/src/assets/img/admin/customize/amelia2-0.png`" alt="Step-by-Step Booking Form 2.0">
            <div class="am-customize-main__form-card__heading">
              <h3>
                <span>Step-by-Step Booking Form 2.0</span>
                <span class="am-pill-new">NEW</span>
              </h3>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Adipiscing sed amet velit congue.
              </p>
            </div>
          </div>
          <AmButton @click="changePages('sbsNew')">Select Form</AmButton>
        </div>
        <div class="am-customize-main__form-card">
          <div class="am-customize-main__form-card__content">
            <img :src="`${baseUrls.wpAmeliaPluginURL}v3/src/assets/img/admin/customize/amelia2-0.png`" alt="Step-by-Step Booking Form 2.0">
            <div class="am-customize-main__form-card__heading">
              <h3>
                <span>Step-by-Step Booking Form 1.0</span>
              </h3>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Adipiscing sed amet velit congue.
              </p>
            </div>
          </div>
          <AmButton @click="changePages('sbsNew')">Select Form</AmButton>
        </div>
        <div class="am-customize-main__form-card">
          <div class="am-customize-main__form-card__content">
            <img :src="`${baseUrls.wpAmeliaPluginURL}v3/src/assets/img/admin/customize/amelia2-0.png`" alt="Step-by-Step Booking Form 2.0">
            <div class="am-customize-main__form-card__heading">
              <h3>
                <span>Catalog Booking Form 1.0</span>
              </h3>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Adipiscing sed amet velit congue.
              </p>
            </div>
          </div>
          <AmButton @click="changePages('sbsNew')">Select Form</AmButton>
        </div>
        <div class="am-customize-main__form-card">
          <div class="am-customize-main__form-card__content">
            <img :src="`${baseUrls.wpAmeliaPluginURL}v3/src/assets/img/admin/customize/amelia2-0.png`" alt="Step-by-Step Booking Form 2.0">
            <div class="am-customize-main__form-card__heading">
              <h3>
                <span>Event List Booking Form 1.0</span>
              </h3>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Adipiscing sed amet velit congue.
              </p>
            </div>
          </div>
          <AmButton @click="changePages('sbsNew')">Select Form</AmButton>
        </div>
        <div class="am-customize-main__form-card">
          <div class="am-customize-main__form-card__content">
            <img :src="`${baseUrls.wpAmeliaPluginURL}v3/src/assets/img/admin/customize/amelia2-0.png`" alt="Step-by-Step Booking Form 2.0">
            <div class="am-customize-main__form-card__heading">
              <h3>
                <span>Event Calendar Booking Form 1.0</span>
              </h3>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Adipiscing sed amet velit congue.
              </p>
            </div>
          </div>
          <AmButton @click="changePages('sbsNew')">Select Form</AmButton>
        </div>
        <div class="am-customize-main__form-card">
          <div class="am-customize-main__form-card__content">
            <img :src="`${baseUrls.wpAmeliaPluginURL}v3/src/assets/img/admin/customize/amelia2-0.png`" alt="Step-by-Step Booking Form 2.0">
            <div class="am-customize-main__form-card__heading">
              <h3>
                <span>Search Booking Form 1.0</span>
              </h3>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Adipiscing sed amet velit congue.
              </p>
            </div>
          </div>
          <AmButton @click="changePages('sbsNew')">Select Form</AmButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import AmButton from '../../../_components/button/AmButton.vue'
import { inject } from 'vue';

const baseUrls = inject('baseUrls')

const { changePages } = inject('pageFunctions', {
  changePages: () => {}
})

let { pageNameHandler } = inject('headerFunctionality', {
  pageNameHandler: () => 'Customize'
})

let amLabels = inject('labels')

pageNameHandler('Customize')
</script>

<script>
export default {
  name: "CustomizeMainPage"
}
</script>

<style lang="scss">
.am-customize-main {
  * {
    box-sizing: border-box;
    font-family: 'Amelia Roboto', sans-serif;
  }

  &__header {
    display: flex;
    align-items: center;
    justify-content: center;

    &-inner {
      display: block;
      max-width: 792px;
      width: 100%;
      padding: 24px 8px 16px 8px;

      h2 {
        font-size: 28px;
        font-weight: 500;
        line-height: 1.2857;
        color: $shade-900;
        margin: 0 0 2px;
      }

      p {
        font-size: 15px;
        font-weight: 400;
        line-height: 1.5;
        color: $shade-600;
        margin: 0;
      }
    }
  }

  &__content {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &__form-card {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    max-width: 372px;
    width: 100%;
    padding: 16px;
    margin: 8px;
    border: 1px solid $shade-250;
    background-color: var(--am-c-main-bgr);
    box-shadow: 0 2px 2px rgba(14, 25, 32, 0.03);
    border-radius: 6px;
    cursor: pointer;

    &__wrapper {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      max-width: 792px;
      width: 100%;
      padding: 0 8px;
    }

    &__content {
      display: flex;
      flex-direction: column;
      flex-wrap: nowrap;
    }

    &__heading {
      margin: 16px 0 24px;
      h3 {
        display: flex;
        align-items: center;
        justify-content: space-between;
        flex-wrap: nowrap;
        margin: 0 0 8px;

        span {
          display: inline-flex;
          font-size: 18px;
          font-weight: 700;
          line-height: 1.55555;
          color: $blue-900;
        }

        .am-pill-new {
          height: 24px;
          font-size: 14px;
          font-weight: 500;
          color: $green-900;
          background-color: $green-400;
          border-radius: 24px;
          padding: 2px 8px;
        }
      }

      p {
        font-size: 14px;
        font-weight: 400;
        line-height: 1.42857;
        color: $shade-700;
        margin: 0;
      }
    }
  }
}
</style>
