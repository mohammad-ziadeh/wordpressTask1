<template>
  <div class="am-cs-global">
    <AmArrowMenuItem @click="handleClick('fonts')">
      <span class="am-cs-global__item">
        <img :src="`${baseUrls.wpAmeliaPluginURL}v3/src/assets/img/admin/customize/font.svg`" alt="Fonts"> {{amLabels.fonts}}
      </span>
    </AmArrowMenuItem>
    <AmArrowMenuItem @click="handleClick('colors')">
      <span class="am-cs-global__item">
        <img :src="`${baseUrls.wpAmeliaPluginURL}v3/src/assets/img/admin/customize/colors.svg`" alt="Colors"> {{amLabels.colors}}
      </span>
    </AmArrowMenuItem>
  </div>
</template>

<script setup>
import AmArrowMenuItem from "../../../_components/arrow-menu/AmArrowMenuItem";
import { inject } from "vue";

const baseUrls = inject('baseUrls')

let { goBackPath, parentPath, handleClick } = inject('sidebarFunctionality')
goBackPath.value = 'menu'
parentPath.value = 'global'

// * Labels
let amLabels = inject('labels')
</script>

<script>
export default {
  name: "GlobalCustomization",
}
</script>

<style lang="scss">
@mixin am-cs-global-block {
  .am-cs {
    &-global {
      &__item {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        font-size: 15px;
        font-style: normal;
        font-weight: 400;
        line-height: 1.6;
        color: $shade-900;

        img {
          margin-right: 8px;
        }
      }
    }
  }
}

// admin
#amelia-app-backend-new {
  @include am-cs-global-block;
}
</style>
