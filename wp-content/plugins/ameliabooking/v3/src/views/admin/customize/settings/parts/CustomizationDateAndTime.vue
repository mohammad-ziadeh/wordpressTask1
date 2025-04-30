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
    <div v-if="!licence.isStarter && !licence.isLite" class="am-cs-parts__segment">
      <div class="am-cs-part__heading">
        {{amLabels.sub_steps}}
      </div>
      <div class="am-cs-part__content">
        <AmArrowMenuItem @click="handleClick('recurringPopup')">
          <span class="am-cs-part__item">
            {{amLabels.recurring_popup}}
          </span>
        </AmArrowMenuItem>
      </div>
    </div>
  </div>
</template>

<script setup>
import AmArrowMenuItem from '../../../_components/arrow-menu/AmArrowMenuItem.vue'
import { inject } from 'vue'

// * Plugin Licence
let licence = inject('licence')

let { goBackPath, handleClick, parentPath } = inject('sidebarFunctionality')
goBackPath.value = 'menu'
parentPath.value = 'dateAndTime'

let subStepName = inject('subStepName')
subStepName.value = ''

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
