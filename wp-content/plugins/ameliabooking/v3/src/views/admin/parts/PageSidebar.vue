<template>
  <div class="am-page-sidebar"></div>
</template>

<script>
export default {
  name: "PageSidebar"
}
</script>

<style lang="scss">
@mixin am-customize-sidebar-block {
  .am-customize-sidebar {
    background-color: $am-white;
  }
}

#amelia-app-backend-new {
  @include am-customize-sidebar-block;
}

</style>