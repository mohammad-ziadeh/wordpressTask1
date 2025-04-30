<template>
  <div class="am-cs-block__wrapper">
    <div
      v-if="backBtnVisibility || headingIcon || headingText"
      class="am-cs-block__header"
    >
      <AmButton
        v-if="backBtnVisibility"
        :icon="IconArrowLeft"
        :icon-only="true"
        class="am-cs-back-btn"
        size="micro"
        type="plain"
        category="secondary"
        @click="() => emits('click')"
      ></AmButton>
      <template v-if="headingIcon || Object.keys(headingIcon).length">
        {{ headingIcon }}
      </template>
      <span>
        {{ headingText }}
      </span>
    </div>
    <div class="am-cs-block__content">
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
import AmButton from "../../../../_components/button/AmButton.vue";
import IconArrowLeft from "../../../../_components/icons/IconArrowLeft.vue";

defineProps({
  backBtnVisibility: {
    type: Boolean,
    default: true,
  },
  headingIcon: {
    type: [String, Object],
    default: ''
  },
  headingText: {
    type: String,
    default: ''
  }
})

const emits = defineEmits(['click'])
</script>

<script>
export default {
  name: "SidebarCardTemplate"
}
</script>

<style lang="scss">
@mixin am-cs-block {
  .am-cs {
    &-block {
      &__wrapper {}
      &__header {
        display: flex;
        align-items: center;
        font-size: 18px;
        font-style: normal;
        font-weight: 500;
        line-height: 1.55555;
        color: $shade-800;
        padding: 16px;

        & > span {
          display: inline-block;
          margin: 0 0 0 6px;
        }
      }
    }

    &-back-btn {
      margin-right: 8px;
    }
  }
}

// admin
#amelia-app-backend-new {
  @include am-cs-block;
}
</style>