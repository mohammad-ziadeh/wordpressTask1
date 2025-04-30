<template>
  <div class="am-cs-parts">
    <div class="am-cs-part">
      <div class="am-cs-part__heading">
        {{amLabels.layout_and_inputs}}
      </div>
      <div class="am-cs-part__content">
        <AmArrowMenuItem @click="handleClick('options')">
          <span class="am-cs-part__item">
            <span class="am-icon-options"></span> {{amLabels.options}}
          </span>
        </AmArrowMenuItem>
        <AmArrowMenuItem @click="handleClick('labels')">
          <span class="am-cs-part__item">
            <span class="am-icon-labels"></span> {{amLabels.labels}}
          </span>
        </AmArrowMenuItem>
      </div>
    </div>
  </div>
</template>

<script setup>
// * Component
import AmArrowMenuItem from '../../../_components/arrow-menu/AmArrowMenuItem.vue'

// * Import from Vue
import {
  inject
} from 'vue'

let bookableType = inject('bookableType')

let {
  goBackPath,
  handleClick,
  parentPath
} = inject('sidebarFunctionality')
goBackPath.value =  bookableType.value === 'event' ? 'info' : 'services'
parentPath.value = 'bringing'

let subStepName = inject('subStepName')
subStepName.value = 'bringingAnyone'

// * Labels
let amLabels = inject('labels')
</script>

<script>
export default {
  name: "CustomizationColors"
}
</script>

<style lang="scss">

</style>