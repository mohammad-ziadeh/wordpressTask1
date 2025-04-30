<template>
  <div class="am-page-header">
    <div class="am-page-header__left">
      <div class="am-logo">
        <img width="92" class="am-logo-big" :src="`${baseUrls.wpAmeliaPluginURL}v3/src/assets/img/logo/amelia-logo-horizontal.svg`" alt="WP Amelia">
        <img width="28" class="am-logo-small" :src="`${baseUrls.wpAmeliaPluginURL}v3/src/assets/img/logo/amelia-logo-symbol.svg`" alt="WP Amelia">
      </div>
      <h1 class="am-page-header__title">
        {{ pageName }}
      </h1>
    </div>
    <div v-if="headerCommandsVisibility" class="am-page-header__right">
      <div v-if="!licence.isLite && !licence.isStarter" class="am-page-header__language">
        <span class="am-page-header__language-label">
          {{amLabels.language}}:
        </span>
        <AmSelect
          v-model="amLanguage"
          size="medium"
          placeholder="Change language"
          :prefix-icon="''"
          clearable
          @change="changeLanguage"
        >
          <AmOption
            v-for="lang in selectedLanguages"
            :key="lang.wp_locale"
            :value="lang.wp_locale"
            :label="lang.name"
          >
            <div class="am-page-header__language-option">
              <img
                :src="`${baseUrls.wpAmeliaPluginURL}v3/src/assets/img/flags/${lang.country_code}.png`"
                :alt="lang.name"
              >
              <span>
                {{ lang.name }}
              </span>
            </div>
          </AmOption>
        </AmSelect>
      </div>
      <div class="am-page-header__btn-holder">
        <AmButton type="plain" category="warning" :size="pageWidth <= 1124 ? 'default' : 'medium'" @click="openResetDialog">
          <template v-if="pageWidth > 1124">
            {{amLabels.reset_form}}
          </template>
          <template v-else>
            <span class="am-icon-refresh" style="font-size: 24px"></span>
          </template>
        </AmButton>
        <AmButton type="plain" category="secondary" :size="pageWidth <= 1124 ? 'default' : 'medium'" @click="goToOldCustomize()">
          <template v-if="pageWidth > 1124">
          {{ amLabels.go_back }}
          </template>
          <template v-else>
            <span class="am-icon-arrow-big-left" style="font-size: 24px"></span>
          </template>
        </AmButton>
        <AmButton type="filled" category="primary" :size="pageWidth <= 1124 ? 'default' : 'medium'" @click="saveChanges">
          <template v-if="pageWidth > 1124">
            {{ amLabels.publish_form }}
          </template>
          <template v-else>
            <span class="am-icon-save" style="font-size: 24px"></span>
          </template>
        </AmButton>

        <AmButton v-if="pageWidth <= 1124" type="plain" category="secondary" @click="openSidebarMenu()">
          <span class="am-icon-menu" style="font-size: 24px"></span>
        </AmButton>
      </div>
    </div>
    <AmDialog
      v-model="resetDialogVisible"
      :custom-class="'am-reset-dialog'"
      :append-to-body="false"
      :width="pageWidth <= 768 ? '100%' : '50%' "
    >
      <template #title>
        <span class="am-reset-dialog__title">
          {{amLabels.are_you_sure_reset_customize}}
        </span>
        <span class="am-reset-dialog__subtitle">
          {{ amLabels.current_changes_will_be_lost }}
        </span>
      </template>
      <template #footer>
        <AmButton type="plain" category="secondary"  @click="resetDialogVisible = false">
          {{amLabels.reset_no}}
        </AmButton>

        <AmButton type="filled" category="warning" @click="closeResetDialog">
          {{amLabels.reset_yes}}
        </AmButton>
      </template>
    </AmDialog>
  </div>
</template>

<script setup>
import AmDialog from "../../_components/dialog/AmDialog";
import AmButton from '../../_components/button/AmButton.vue'
import AmSelect from "../../_components/select/AmSelect";
import AmOption from "../../_components/select/AmOption";
import { inject, computed, ref } from 'vue';

// * Plugin Licence
let licence = inject('licence')

let pageWidth = inject('customizePageWidth', ref(2560))

const baseUrls = inject('baseUrls')

let amLabels = inject('labels')

function goToOldCustomize () {
  window.location = 'admin.php?page=wpamelia-customize'
}

// const { changePages } = inject('pageFunctions', {
//   changePages: (data = '') => { return data }
// })

let { pageName } = inject('headerFunctionality', {
  pageName: 'Amelia Page'
})

let headerCommandsVisibility = computed(() => {
  return pageName.value !== 'Customize'
})

const { saveChanges, resetChanges } = inject('customizeSaveFunctionality', {
  saveChanges: () => {},
  resetChanges: () => {}
})

// * Language Selection
let amLanguage = ref('')
let { langKey, selectedLanguages } = inject('languageFunctionality', {
  langKey: ref('default'),
  selectedLanguages: ref([])
})

function changeLanguage (val) {
  langKey.value = val ? val : 'default'
}

let resetDialogVisible = ref(false)

function closeResetDialog () {
  resetDialogVisible.value = false
  resetChanges()
}

function openResetDialog () {
  resetDialogVisible.value = true
}

let { openSidebarMenu } = inject('pageVisual', {
  openSidebarMenu: () => {}
})
</script>

<script>
export default {
  name: "PageHeader"
}
</script>

<style lang="scss">
$fontFamily: 'Roboto', sans-serif;

@mixin am-page-header-block {

  .am-page-header__fixed {
    .el-affix--fixed {
      z-index: 10000 !important;
    }
  }

  .am-page-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 24px;
    background-color: $am-white;
    border-bottom: 1px solid $shade-250;
    z-index: 10000;

    * {
      box-sizing: border-box;
      font-family: $fontFamily;
    }

    .am-reset-dialog {
      max-width: 500px;

      &__title {
        display: block;
        width: 100%;
        font-size: 18px;
        font-weight: 500;
        word-break: break-word;
        color: var(--am-c-main-text);
        margin-bottom: 8px;
      }

      &__subtitle {
        display: block;
        width: 100%;
        font-size: 13px;
        font-weight: 400;
        word-break: break-word;
        color: $shade-500;
        margin-bottom: 8px;
      }

      .el-dialog {
        &__header {
          padding-right: 36px;
        }

        &__body {
          display: none;
        }
      }

      .am-button.am-button--plain {
        margin-right: 16px;
      }
    }

    .flex-center {
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .flex-full {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    &__fixed {
      width: var(--am-w-ph) !important;

      .el-affix--fixed {
        width: var(--am-w-ph) !important;
      }
    }

    &__left {
      @extend .flex-center;
    }

    &__right {
      @extend .flex-center;
    }

    &__title {
      font-size: 18px;
      font-weight: 500;
      line-height: 1.55555;
      color: $shade-700;
      padding: 0 0 0 16px;
      margin: 0 0 0 16px;
      border-left: 1px solid $shade-250;
    }

    &__language {
      @extend .flex-center;
      padding-right: 24px;
      margin-right: 8px;
      border-right: 1px solid $shade-250;

      &-label {
        display: inline-block;
        font-size: var(--am-fs-label);
        font-weight: 500;
        line-height: 1.333333;
        color: $am-black;
        margin-right: 8px;
      }
    }

    &__btn-holder {
      display: flex;
      min-width: 252px;

      .am-button {
        margin-left: 10px;

        &--primary {
          width: 100%;
        }
      }
    }

    .am-logo {
      @extend .flex-center;

      &-small {
        display: none;
      }

      @include media-breakpoint-down($am-small-max) {
        &-big {
          display: none;
        }

        &-small {
          display: inline-block;
        }
      }
    }
  }

  @include media-breakpoint-down($am-large-max) {
    .am-page-header {
      flex-wrap: wrap;

      .am-page-header__left {
        flex: 0 0 100%;
        margin-bottom: 16px;
      }

      .am-page-header__right {
        flex: 0 0 100%;
        justify-content: space-between;
      }

      .am-page-header__language {
        margin: 0;
        padding: 0;
        border: none;
      }
    }
  }

  @include media-breakpoint-down($am-small-max) {
    .am-page-header {
      .am-page-header__right {
        flex-wrap: wrap;
        align-items: center;
        justify-content: center;

        & > * {
          flex: 0 0 100%;
        }

        .am-page-header__btn-holder {
          margin-top: 16px;
          align-items: center;
          justify-content: space-between;
          & > * {
            width: auto;
            flex: 0 0 20%;
            margin: 0;
          }
        }
      }
    }
  }

  @include media-breakpoint-down($am-xsmall-max) {
    .am-page-header {
      .am-page-header__right {
        .am-page-header__btn-holder {
          flex-wrap: wrap;

          & > * {
            width: auto;
            flex: 0 0 45%;
            margin-top: 8px;

            &:nth-child(1) {
              order: 0;
            }

            &:nth-child(2) {
              order: 1;
            }

            &:nth-child(3) {
              order: 2;
            }

            &:nth-child(4) {
              order: 0;
            }
          }
        }
      }
    }
  }
}

// language select
.am-page-header {
  &__language {
    &-option {
      display: flex;
      align-items: center;
      justify-content: flex-start;

      img {
        margin-right: 8px;
      }
    }
  }
}

#amelia-app-backend-new {
  @include am-page-header-block;
}
</style>
