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
    <div
      v-if="pageRenderKey !== 'cape'"
      class="am-cs-parts__segment"
    >
      <div class="am-cs-part__heading">
        {{amLabels.step_popups}}
      </div>
      <div class="am-cs-part__content">
        <AmArrowMenuItem @click="handleClick('rescheduleAppointment')">
          <span class="am-cs-part__item">
            {{amLabels.csb_appointment_reschedule}}
          </span>
        </AmArrowMenuItem>
        <AmArrowMenuItem @click="handleClick('cancelAppointment')">
          <span class="am-cs-part__item">
            {{amLabels.csb_appointment_cancel}}
          </span>
        </AmArrowMenuItem>
      </div>
    </div>
  </div>
</template>

<script setup>
import AmArrowMenuItem from '../../../_components/arrow-menu/AmArrowMenuItem.vue'
import { inject } from 'vue'

let pageRenderKey = inject('pageRenderKey')

let { goBackPath, handleClick, parentPath } = inject('sidebarFunctionality')
goBackPath.value = 'menu'
parentPath.value = 'appointments'
let subStepName = inject('subStepName')
subStepName.value = ''

// * Labels
let amLabels = inject('labels')
</script>

<script>
export default {
  name: "CustomizationCabinetAppointments"
}
</script>

<style lang="scss">

</style>
