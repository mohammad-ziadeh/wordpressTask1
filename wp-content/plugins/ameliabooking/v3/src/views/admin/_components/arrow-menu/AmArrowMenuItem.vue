<template>
  <div class="am-ami">
    <div class="am-ami__content">
      <slot></slot>
    </div>
    <IconArrowRight></IconArrowRight>
  </div>
</template>

<script setup>
import IconArrowRight from "../../../_components/icons/IconArrowRight";
</script>

<script>
export default {
  name: "AmArrowMenuItem"
}
</script>

<style lang="scss">
// am - amelia
// ami - arrow menu item
@mixin am-ami-block {
  .am-ami {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 16px;
    cursor: pointer;
    background-color: $am-white;
    transition: background-color 0.2s ease-in-out;

    $count: 30;
    @for $i from 0 through $count {
      &:nth-child(#{$i + 1}) {
        animation: 400ms cubic-bezier(.45,1,.4,1.2) #{$i*70}ms am-animation-slide-up;
        animation-fill-mode: both;
      }
    }

    &:hover {
      background-color: $blue-300;

      .am-ami__content {
        transform: translateX(5px);
      }

      & > span {
        transform: translateX(-5px);
      }
    }

    & > span {
      font-size: 16px;
      color: $shade-900;
      transition: transform 0.2s ease-in-out;
    }

    &__content {
      font-size: 15px;
      font-style: normal;
      font-weight: 400;
      line-height: 1.6;
      color: $shade-900;
      transition: transform 0.2s ease-in-out;
    }
  }
}

// Admin
#amelia-app-backend-new {
  @include am-ami-block;
}
</style>