<template>
  <div class="am-cs-order">
    <draggable
      v-model="amCustomize[pageRenderKey][stepName].order"
      v-bind="dragOptions"
      :item-key="stepName"
      @update="listUpdate"
    >
      <template #item="{ element }">
        <div v-if="licence.isLite || licence.isStarter ? element.id !== 'location' : true" class="am-cs-order-item">
          <span class="am-cs-order-item__inner">
            {{ element.name }}
          </span>
          <span class="am-icon-drag"></span>
        </div>
      </template>
      {{ item.name }}
    </draggable>
  </div>
</template>

<script setup>
import draggable from 'vuedraggable'
import {inject, computed, ref} from 'vue'

let loading = inject('loading')

let stepName = inject('stepName')
let pageRenderKey = inject('pageRenderKey')
let amCustomize = inject('customize')
let licence = inject('licence')

let dragOptions = computed(() => {
  return {
    animation: 200,
    group: 'description',
    disabled: false,
    ghostClass: 'am-ghost'
  }
})

let { goBackPath, parentPath } = inject('sidebarFunctionality', {
  goBackPath: ref('menu')
})

goBackPath.value = parentPath.value

function listUpdate () {
  loading.value = true
  setTimeout(() => {
    loading.value = false
  }, 200)
}
</script>

<script>
export default {
  name: "CustomizationOrder"
}
</script>

<style lang="scss">
#amelia-app-backend-new {
  .am-cs-order-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: $blue-300;
    padding: 12px 16px;
    cursor: pointer;

    &__inner {
      font-size: 15px;
      line-height: 1.4;
      color: $shade-900;
    }

    .am-icon-drag {
      font-size: 24px;
    }
  }

  .am-ghost {
    opacity: 0.5;
  }
}
</style>
