<template>
  <div class="am-settings-card" @click="(evt) => emits('click', evt)">
    <div class="am-settings-card__inner am-settings-card__header">
      <span v-if="$slots.header">
        <slot name="header"></slot>
      </span>
      <span v-if="props.header">
        {{ props.header }}
      </span>
    </div>
    <div class="am-settings-card__inner am-settings-card__content">
      <span v-if="!props.content">
        <slot name="default"></slot>
      </span>
      <span v-if="!$slots.default">
        {{ props.content }}
      </span>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  header: {
    type: String,
    default: ''
  },
  content: {
    type: String,
    default: ''
  }
})
const emits = defineEmits(['click'])
</script>

<script>
export default {
  name: "AmSettingsCard"
}
</script>

<style lang="scss">
@mixin am-settings-card-block {
  .am-settings-card {
    padding: 8px 12px;
    border-radius: 9px;
    border: 1px solid $shade-250;
    box-shadow: 0 1px 3px fade-out($shade-250, 0.3);
    font-family: var(--am-font-family);
    box-sizing: border-box;
    cursor: pointer;

    * {
      font-family: var(--am-font-family);
      box-sizing: border-box;
    }

    &__inner {
      margin-bottom: 4px;

      &:last-child {
        margin-bottom: 0;
      }
    }

    &__header {
      font-size: 14px;
      font-weight: 500;
      font-style: normal;
      line-height: 1.42857;
      color: $shade-900;
    }

    &__content {
      font-size: 13px;
      font-weight: 400;
      font-style: normal;
      line-height: 1.3846;
      color: $shade-700;
    }
  }
}

// admin
#amelia-app-backend-new {
  @include am-settings-card-block;
}
</style>