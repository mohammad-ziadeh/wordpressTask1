<template>
<div class="am-lite-guide">
  <div class="am-lite-guide__left">
    <i class="el-icon-star-on"></i>
  </div>
  <div class="am-lite-guide__right">
    <span>For instructions on activating your license, please refer to our
      <a href="https://wpamelia.com/lite-upgrade/" target="_blank">
        upgrade guide.
      </a>
    </span>
  </div>
</div>
</template>

<script>
export default {
  name: 'LicenceLiteGuide'
}
</script>

<style scoped lang="less">
.am-lite-guide {
  display: flex;
  justify-content: center;
  padding: 8px;
  margin: 24px 0;
  border: 1px solid #1A84EE;
  border-radius: 6px;
  background-color: rgba(26, 132, 238, 0.05);

  &__left {
    align-items: center;

    i {
      font-size: 18px;
      color: #1A84EE;
      padding: 8px 12px 8px 8px;
    }
  }

  &__right {
    span {
      font-size: 15px;
      font-weight: 600;
      color: #354052;
    }

    a {
      font-size: 15px;
      font-weight: 600;
      color: #1A84EE !important;

      &:hover {
        color: #1A84EE !important;
      }

      &:focus {
        box-shadow: none;
      }
    }
  }
}
</style>