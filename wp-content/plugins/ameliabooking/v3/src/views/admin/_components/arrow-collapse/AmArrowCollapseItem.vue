<template>
  <div class="am-arrow-collapse-item" :class="{'am-arrow-collapse-item-no-button': !slots.default()[0].props || side}" :style="cssVars">
    <div class="am-arrow-collapse-item__heading" :class="{'am-arrow-collapse-item__heading-side' : contentVisibility}">
      <slot name="heading"></slot>
      <div v-if="slots.default()[0].props && side" class="am-arrow-collapse-item__trigger am-arrow-collapse-item__trigger-side" @click="toggleContent">
        <span class="am-icon-arrow-down" :class="{'am-rotate-180': contentVisibility}"></span>
      </div>
    </div>
    <template v-if="slots.default()[0].props">
      <div
        ref="collapseContent"
        class="am-arrow-collapse-item__content"
        :class="[
          {'am-arrow-collapse-item__content-no-border' : !side},
          contentVisibility ? 'am-arrow-collapse-item__content-open' : 'am-arrow-collapse-item__content-close',
          contentClosing ? 'am-arrow-collapse-item__content-closing' : ''
        ]"
      >
        <slot></slot>
      </div>
    </template>
    <div v-if="slots.default()[0].props && !side" class="am-arrow-collapse-item__trigger" @click="toggleContent">
      <span class="am-arrow-collapse-item__trigger-label">
        <slot v-if="!contentVisibility && !buttonClosed.length" name="button-closed"></slot>
        <template v-if="!contentVisibility && buttonClosed.length">
          {{ buttonClosed }}
        </template>
        <slot v-if="contentVisibility && !buttonOpened.length" name="button-opened"></slot>
        <template v-if="contentVisibility && buttonOpened.length">
          {{ buttonOpened }}
        </template>
      </span>
      <span class="am-icon-arrow-down" :class="{'am-rotate-180': contentVisibility}"></span>
    </div>
  </div>
</template>

<script setup>
import {inject, ref, reactive, computed, useSlots} from 'vue';
import {useColorTransparency} from "../../../../assets/js/common/colorManipulation";

/**
 * Component Props
 */
defineProps({
  buttonOpened: {
    type: String,
    default: ''
  },
  buttonClosed: {
    type: String,
    default: ''
  },
  side: {
    type: Boolean,
    default: false
  }
})

// * Template slots
let slots = useSlots()

// * Card Expand variable
let contentVisibility = ref(false)
let contentClosing = ref(false)
let collapseContent = ref(null)
let collapseHeight = reactive({
  h: '0px'
})

function closingCollapse () {
  contentClosing.value = true
  setTimeout(() => {
    contentClosing.value = false
  }, 480)
}

// * Card Expand Function
function toggleContent() {
  collapseHeight.h = `${collapseContent.value.offsetHeight}px`
  if (contentVisibility.value) closingCollapse()
  contentVisibility.value = !contentVisibility.value
}

// * Colors
let amColors = inject('amColors')
let cssVars = computed(() => {
  return {
    '--am-collapse-color-text-op80': useColorTransparency(amColors.value.colorMainText, 0.8)
  }
})
</script>

<script>
export default {
  name: "AmArrowCollapseItem"
}
</script>

<style lang="scss">
$collapseContentHeight: v-bind('collapseHeight.h');

@keyframes am-animation-collapse-open {
  0%{height: 0;}
  100%{height: $collapseContentHeight;}
}

@keyframes am-animation-collapse-close {
  0%{height: $collapseContentHeight;}
  100%{height: 0;}
}

@mixin am-arrow-collapse-item-block {
  // Collapse card
  // am  -- amelia
  .am-arrow-collapse-item {
    --am-collapse-color-border: var(--am-c-inp-border);
    --am-collapse-color-text: var(--am-c-main-text);
    position: relative;
    margin: 8px 0;

    &-no-button {
      .am-arrow-collapse-item__heading {
        border-radius: 8px;
        &-side {
          border-radius: 8px 8px 0 0;
          border-bottom: 0;
        }
      }
    }

    * {
      font-family: var(--am-font-family);
      box-sizing: border-box;
    }

    // Collapse header
    &__heading {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-radius: 8px 8px 0 0;
      padding: 16px;
      border: 1px solid var(--am-collapse-color-border);
    }

    // Collapse card content
    &__content {
      display: flex;
      font-size: 14px;
      font-weight: 400;
      line-height: 1.4285;
      color: var(--am-collapse-color-text-op80);
      border: 1px solid var(--am-collapse-color-border);
      border-radius: 0 0 8px 8px;
      overflow: hidden;
      position: absolute;
      opacity: 0;
      z-index: -1;

      & > * {
        padding: 16px;
      }

      &-no-border {
        border-radius: 0;
        border-top: 0;
        border-bottom: 0;
      }

      &-open {
        position: relative;
        opacity: 1;
        z-index: 100;
        animation: 500ms ease-in-out am-animation-collapse-open;
      }

      &-closing {
        position: relative;
        opacity: 1;
        z-index: 100;
      }

      &-close {
        animation: 500ms ease-in-out am-animation-collapse-close;
      }
    }

    // Collapse trigger button
    &__trigger {
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 13px;
      line-height: 1.5385;
      color: var(--am-collapse-color-text);
      padding: 8px 16px;
      border: 1px solid var(--am-collapse-color-border);
      border-top: none;
      border-radius: 0 0 8px 8px;
      cursor: pointer;

      &-side {
        border: none
      }

      &-label {
        font-size: 13px;
        line-height: 1.5385;
        color: var(--am-collapse-color-text);
      }

      .am-icon-arrow-down {
        font-size: 16px;
        line-height: 1.4;
        color: var(--am-collapse-color-text);
        transition: all 0.3s ease-in-out;

        &.am-rotate-180 {
          transform: rotate(180deg);
        }
      }
    }
  }
}

// public
.amelia-v2-booking #amelia-container {
  @include am-arrow-collapse-item-block;
}

// admin
#amelia-app-backend-new {
  @include am-arrow-collapse-item-block;
}
</style>