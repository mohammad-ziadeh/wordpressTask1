<template>
  <div class="am-cs-parts">
    <div class="am-cs-part">
      <div class="am-cs-part__content">
        <AmArrowMenuItem @click="handleClick('options')">
          <span class="am-cs-part__item">
            <span class="am-icon-options"></span> {{amLabels.options}}
          </span>
        </AmArrowMenuItem>
        <AmArrowMenuItem
          v-if="pageRenderKey !== 'cape'"
          @click="handleClick('labels')"
        >
          <span class="am-cs-part__item">
            <span class="am-icon-labels"></span> {{amLabels.labels}}
          </span>
        </AmArrowMenuItem>
      </div>
    </div>
  </div>
</template>

<script setup>
import AmArrowMenuItem from "../../../_components/arrow-menu/AmArrowMenuItem";
import { inject } from "vue";

let pageRenderKey = inject('pageRenderKey')

let { goBackPath, parentPath, handleClick } = inject('sidebarFunctionality')
goBackPath.value = 'menu'
parentPath.value = 'sidebar'

// * Labels
let amLabels = inject('labels')
</script>

<script>
export default {
  name: "CustomizationSidebar",
}
</script>

<style lang="scss">

</style>
