<template>
  <div
    ref="pageWrapperRef"
    class="am-wrap"
    :style="cssVars"
  >
    <div :id="pageId" class="am-body">
      <el-affix class="am-page-header__fixed" :offset="wpAdminBarHeight">
        <div id="am-page-header">
          <slot name="header"></slot>
        </div>
      </el-affix>
      <div class="am-wrapper">
        <div class="am-wrapper-main">
          <div id="am-page-filter">
            <slot name="filter"></slot>
          </div>
          <slot></slot>
        </div>

        <el-affix v-if="customizePageWidth > 1124" :offset="(wpAdminBarHeight + 85)">
          <div v-if="pageSlots.sidebar()[0].type.hasOwnProperty('name') && pageSlots.sidebar()[0].type.name.includes('Sidebar')" class="am-wrapper-sidebar">
            <slot name="sidebar"></slot>
          </div>
        </el-affix>

        <el-drawer v-if="customizePageWidth <= 1124" v-model="amDrawer" modal-class="am-dialog-cs" size="auto">
          <div class="am-wrapper-sidebar">
            <slot name="menu"></slot>
          </div>
        </el-drawer>
      </div>
    </div>
  </div>
</template>

<script setup>
import {provide, useSlots, ref, computed, onMounted} from "vue";

defineProps({
  pageId: {
    type: String,
    default: ''
  },
  pageClass: {
    type: String,
    default: ''
  }
})

let pageWrapperRef = ref(null)

let customizePageWidth = ref(null)

provide('customizePageWidth', customizePageWidth)

onMounted(() => {
  customizePageWidth.value = pageWrapperRef.value.offsetWidth
})

let pageSlots = useSlots()

let amDrawer = ref(false)

let wpPageWidth = ref(document.getElementById('wpcontent').offsetWidth)
let wpAdminBarHeight = ref(document.getElementById('wpadminbar').offsetHeight)
provide('wpAdminBarHeight', wpAdminBarHeight)

let cssVars = computed(() => {
  let sidebarSlot = pageSlots.sidebar()[0].type
  let sidebarExistence = Object.prototype.hasOwnProperty.call(sidebarSlot, 'name') && pageSlots.sidebar()[0].type.name.includes('Sidebar') && customizePageWidth.value > 1124

  // am  - amelia
  // ph  - page header
  // w   - width
  // h   - height
  // psb - page sidebar
  // p   - page
  return {
    '--am-top-ph': `${wpAdminBarHeight.value}px`,
    '--am-w-ph': `${wpPageWidth.value - 2}px`,
    '--am-top-psb': `${wpAdminBarHeight.value + 85}px`,
    '--am-h-psb': `calc(100vh - ${wpAdminBarHeight.value + 85}px)`,
    '--am-w-p': sidebarExistence ? 'calc(100% - 398px)' : '100%'
  }
})

window.addEventListener('resize', resize);
// * resize function
function resize() {
  customizePageWidth.value = pageWrapperRef.value.offsetWidth
  wpPageWidth.value = document.getElementById('wpcontent').offsetWidth
  wpAdminBarHeight.value = document.getElementById('wpadminbar').offsetHeight
}

function openSidebarMenu () {
  amDrawer.value = true
}

provide('pageVisual', {openSidebarMenu})
</script>

<script>
export default {
  name: "PageWrapper"
}
</script>

<style lang="scss">
:root {
  --am-page-width: calc(100% - 398px)
}

.am-wrap {
  margin: 0 0 0 -18px;
  @include media-breakpoint-down($am-small-max) {
    margin: 0;
  }
}

.am-wrapper {
  display: flex;
  flex-direction: row;
  //margin-top: var(--am-top-psb);

  * {
    box-sizing: border-box;
  }

  &-main {
    width: var(--am-w-p);
  }

  &-sidebar {
    width: 398px;
    height: var(--am-h-psb);
    background-color: $am-white;
    border-left: 1px solid $shade-250;
    overflow-x: hidden;
    z-index: 100;
  }
}
</style>