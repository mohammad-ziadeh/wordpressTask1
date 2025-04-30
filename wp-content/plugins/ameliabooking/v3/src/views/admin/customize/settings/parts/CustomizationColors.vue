<template>
  <div class="am-cs-colors">
    <AmCollapse>
      <!-- Primary & state -->
      <AmCollapseItem borderless :side="true">
        <template #heading>
          <div class="am-cs-colors__heading">
            <img :src="`${baseUrls.wpAmeliaPluginURL}v3/src/assets/img/admin/customize/colors.svg`" alt="Primary and state condition"> {{amLabels.primary_and_state_colors}}
          </div>
        </template>
        <template #default>
          <div class="am-cs-colors__holder">
            <div class="am-cs-colors__item">
              <span>{{amLabels.primary_color}}</span> <AmColorPicker v-model="amCustomize[pageRenderKey].colors.colorPrimary"></AmColorPicker>
            </div>
            <div class="am-cs-colors__item">
              <span>{{amLabels.success_color}}</span> <AmColorPicker v-model="amCustomize[pageRenderKey].colors.colorSuccess"></AmColorPicker>
            </div>
            <div class="am-cs-colors__item">
              <span>{{amLabels.warning_color}}</span> <AmColorPicker v-model="amCustomize[pageRenderKey].colors.colorWarning"></AmColorPicker>
            </div>
            <div class="am-cs-colors__item">
              <span>{{amLabels.error_color}}</span> <AmColorPicker v-model="amCustomize[pageRenderKey].colors.colorError"></AmColorPicker>
            </div>
          </div>
        </template>
      </AmCollapseItem>

      <!-- Sidebar -->
      <AmCollapseItem v-if="pageRenderKey !== 'elf' && pageRenderKey !== 'ecf'" borderless :side="true">
        <template #heading>
          <div class="am-cs-colors__heading">
            <img :src="`${baseUrls.wpAmeliaPluginURL}v3/src/assets/img/admin/customize/sidebar.svg`" alt="Sidebar"> {{amLabels.sidebar}}
          </div>
        </template>
        <template #default>
          <div class="am-cs-colors__holder">
            <div class="am-cs-colors__item">
              <span>{{amLabels.background_color}}</span> <AmColorPicker v-model="amCustomize[pageRenderKey].colors.colorSbBgr"></AmColorPicker>
            </div>
            <div class="am-cs-colors__item">
              <span>{{amLabels.text_color}}</span> <AmColorPicker v-model="amCustomize[pageRenderKey].colors.colorSbText"></AmColorPicker>
            </div>
          </div>
        </template>
      </AmCollapseItem>

      <!-- Content -->
      <AmCollapseItem borderless :side="true">
        <template #heading>
          <div class="am-cs-colors__heading">
            <img :src="`${baseUrls.wpAmeliaPluginURL}v3/src/assets/img/admin/customize/content.svg`" alt="Content"> {{amLabels.content}}
          </div>
        </template>
        <template #default>
          <div class="am-cs-colors__holder">
            <div class="am-cs-colors__item">
              <span>{{amLabels.background_color}}</span> <AmColorPicker v-model="amCustomize[pageRenderKey].colors.colorMainBgr"></AmColorPicker>
            </div>
            <div class="am-cs-colors__item">
              <span>{{amLabels.heading_text_color}}</span> <AmColorPicker v-model="amCustomize[pageRenderKey].colors.colorMainHeadingText"></AmColorPicker>
            </div>
            <div class="am-cs-colors__item">
              <span>{{amLabels.content_text_color}}</span> <AmColorPicker v-model="amCustomize[pageRenderKey].colors.colorMainText"></AmColorPicker>
            </div>
          </div>
        </template>
      </AmCollapseItem>

      <!-- Input Fields -->
      <AmCollapseItem borderless :side="true">
        <template #heading>
          <div class="am-cs-colors__heading">
            <img :src="`${baseUrls.wpAmeliaPluginURL}v3/src/assets/img/admin/customize/inputs.svg`" alt="Input Fields & Dropdowns"> {{amLabels.input_fields}}
          </div>
        </template>
        <template #default>
          <div class="am-cs-colors__holder">
            <div class="am-cs-colors__item">
              <span>{{amLabels.background_color}}</span> <AmColorPicker v-model="amCustomize[pageRenderKey].colors.colorInpBgr"></AmColorPicker>
            </div>
            <div class="am-cs-colors__item">
              <span>{{amLabels.border_color}}</span> <AmColorPicker v-model="amCustomize[pageRenderKey].colors.colorInpBorder"></AmColorPicker>
            </div>
            <div class="am-cs-colors__item">
              <span>{{amLabels.text_color}}</span> <AmColorPicker v-model="amCustomize[pageRenderKey].colors.colorInpText"></AmColorPicker>
            </div>
            <div class="am-cs-colors__item">
              <span>{{amLabels.placeholder_color}}</span> <AmColorPicker v-model="amCustomize[pageRenderKey].colors.colorInpPlaceHolder"></AmColorPicker>
            </div>
          </div>
        </template>
      </AmCollapseItem>

      <!-- Dropdowns -->
      <AmCollapseItem borderless :side="true">
        <template #heading>
          <div class="am-cs-colors__heading">
            <img :src="`${baseUrls.wpAmeliaPluginURL}v3/src/assets/img/admin/customize/dropdowns.svg`" alt="Input Fields & Dropdowns"> {{amLabels.dropdowns}}
          </div>
        </template>
        <template #default>
          <div class="am-cs-colors__holder">
            <div class="am-cs-colors__item">
              <span>{{amLabels.background_color}}</span> <AmColorPicker v-model="amCustomize[pageRenderKey].colors.colorDropBgr"></AmColorPicker>
            </div>
            <div class="am-cs-colors__item">
              <span>{{amLabels.border_color}}</span> <AmColorPicker v-model="amCustomize[pageRenderKey].colors.colorDropBorder"></AmColorPicker>
            </div>
            <div class="am-cs-colors__item">
              <span>{{amLabels.text_color}}</span> <AmColorPicker v-model="amCustomize[pageRenderKey].colors.colorDropText"></AmColorPicker>
            </div>
          </div>
        </template>
      </AmCollapseItem>

      <!-- Cards -->
      <AmCollapseItem v-if="pageRenderKey === 'cbf' || pageRenderKey === 'elf' || pageRenderKey === 'ecf'" borderless :side="true">
        <template #heading>
          <div class="am-cs-colors__heading">
            <img :src="`${baseUrls.wpAmeliaPluginURL}v3/src/assets/img/admin/customize/cards.svg`" alt="Input Fields & Dropdowns"> {{amLabels.cards}}
          </div>
        </template>
        <template #default>
          <div class="am-cs-colors__holder">
            <div class="am-cs-colors__item">
              <span>{{amLabels.background_color}}</span> <AmColorPicker v-model="amCustomize[pageRenderKey].colors.colorCardBgr"></AmColorPicker>
            </div>
            <div class="am-cs-colors__item">
              <span>{{amLabels.border_color}}</span> <AmColorPicker v-model="amCustomize[pageRenderKey].colors.colorCardBorder"></AmColorPicker>
            </div>
            <div class="am-cs-colors__item">
              <span>{{amLabels.text_color}}</span> <AmColorPicker v-model="amCustomize[pageRenderKey].colors.colorCardText"></AmColorPicker>
            </div>
          </div>
        </template>
      </AmCollapseItem>

      <!-- Calendar -->
      <AmCollapseItem v-if="pageRenderKey !== 'cbf' && pageRenderKey !== 'ecf' && pageRenderKey !== 'cape'" borderless :side="true">
        <template #heading>
          <div class="am-cs-colors__heading">
            <img :src="`${baseUrls.wpAmeliaPluginURL}v3/src/assets/img/admin/customize/calendar.svg`" alt="Calendar"> {{amLabels.calendar}}
          </div>
        </template>
        <template #default>
          <div class="am-cs-colors__holder">
            <div class="am-cs-colors__item">
              <span>{{amLabels.init_cell}}</span> <AmColorPicker v-model="amCustomize[pageRenderKey].colors.colorCalCell"></AmColorPicker>
            </div>
            <div class="am-cs-colors__item">
              <span>{{amLabels.init_cell_text}}</span> <AmColorPicker v-model="amCustomize[pageRenderKey].colors.colorCalCellText"></AmColorPicker>
            </div>
            <div class="am-cs-colors__item">
              <span>{{amLabels.cell_selected_background}}</span> <AmColorPicker v-model="amCustomize[pageRenderKey].colors.colorCalCellSelected"></AmColorPicker>
            </div>
            <div class="am-cs-colors__item">
              <span>{{amLabels.cell_selected_text}}</span> <AmColorPicker v-model="amCustomize[pageRenderKey].colors.colorCalCellSelectedText"></AmColorPicker>
            </div>
            <div class="am-cs-colors__item">
              <span>{{amLabels.cell_disabled_background}}</span> <AmColorPicker v-model="amCustomize[pageRenderKey].colors.colorCalCellDisabled"></AmColorPicker>
            </div>
            <div class="am-cs-colors__item">
              <span>{{amLabels.cell_disabled_text}}</span> <AmColorPicker v-model="amCustomize[pageRenderKey].colors.colorCalCellDisabledText"></AmColorPicker>
            </div>
          </div>
        </template>
      </AmCollapseItem>

      <!-- Buttons -->
      <AmCollapseItem borderless :side="true">
        <template #heading>
          <div class="am-cs-colors__heading">
            <img :src="`${baseUrls.wpAmeliaPluginURL}v3/src/assets/img/admin/customize/buttons.svg`" alt="Buttons"> {{amLabels.buttons}}
          </div>
        </template>
        <template #default>
          <div class="am-cs-colors__holder">
            <div class="am-cs-colors__item">
              <span>{{amLabels.primary_background}}</span> <AmColorPicker v-model="amCustomize[pageRenderKey].colors.colorBtnPrim"></AmColorPicker>
            </div>
            <div class="am-cs-colors__item">
              <span>{{amLabels.primary_text}}</span> <AmColorPicker v-model="amCustomize[pageRenderKey].colors.colorBtnPrimText"></AmColorPicker>
            </div>
            <div class="am-cs-colors__item">
              <span>{{amLabels.secondary_background}}</span> <AmColorPicker v-model="amCustomize[pageRenderKey].colors.colorBtnSec"></AmColorPicker>
            </div>
            <div class="am-cs-colors__item">
              <span>{{amLabels.secondary_text}}</span> <AmColorPicker v-model="amCustomize[pageRenderKey].colors.colorBtnSecText"></AmColorPicker>
            </div>
            <div
              v-if="pageRenderKey !== 'sbsNew' && pageRenderKey !== 'cbf' && pageRenderKey !== 'elf' && pageRenderKey !== 'ecf'"
              class="am-cs-colors__item"
            >
              <span>{{amLabels.danger_background}}</span> <AmColorPicker v-model="amCustomize[pageRenderKey].colors.colorBtnDanger"></AmColorPicker>
            </div>
            <div
              v-if="pageRenderKey !== 'sbsNew' && pageRenderKey !== 'cbf' && pageRenderKey !== 'elf' && pageRenderKey !== 'ecf'"
              class="am-cs-colors__item"
            >
              <span>{{amLabels.danger_text}}</span> <AmColorPicker v-model="amCustomize[pageRenderKey].colors.colorBtnDangerText"></AmColorPicker>
            </div>
            <div
              v-if="pageRenderKey !== 'sbsNew' && pageRenderKey !== 'cbf' && pageRenderKey !== 'capc' && isWaiting"
              class="am-cs-colors__item"
            >
              <span>{{amLabels.waiting_background}}</span> <AmColorPicker v-model="amCustomize[pageRenderKey].colors.colorBtnWaiting"></AmColorPicker>
            </div>
            <div
              v-if="pageRenderKey !== 'sbsNew' && pageRenderKey !== 'cbf' && pageRenderKey !== 'capc' && isWaiting"
              class="am-cs-colors__item"
            >
              <span>{{amLabels.waiting_text}}</span> <AmColorPicker v-model="amCustomize[pageRenderKey].colors.colorBtnWaitingText"></AmColorPicker>
            </div>
          </div>
        </template>
      </AmCollapseItem>
    </AmCollapse>
  </div>
</template>

<script setup>
// * Components
import AmCollapse from '../../../../_components/collapse/AmCollapse.vue'
import AmCollapseItem from '../../../../_components/collapse/AmCollapseItem.vue'
import AmColorPicker from '../../../_components/color-picker/AmColorPicker.vue'

// * Import from Vue
import {
  inject,
  ref,
  computed
} from 'vue'

let amSettings = inject('settings')
let licence = inject('licence')
const baseUrls = inject('baseUrls')
let pageRenderKey = inject('pageRenderKey')
let amCustomize = inject('customize')

let { goBackPath, parentPath } = inject('sidebarFunctionality', {
  goBackPath: ref('menu')
})

goBackPath.value = parentPath.value

let isWaiting = computed(() => {
  return amSettings.appointments.waitingListEvents.enabled && !licence.isBasic && !licence.isStarter && !licence.isLite
})

// * Labels
let amLabels = inject('labels')
</script>

<script>
export default {
  name: "CustomizationColors"
}
</script>

<style lang="scss">
// am - amelia
// cs - customize sidebar
@mixin am-cs-colors-block {
  .am-cs-colors {

    &__heading {
      display: flex;
      align-items: center;
      justify-content: flex-start;

      img {
        margin-right: 8px;
      }
    }

    &__holder {
      width: 100%;
    }

    &__item {
      max-width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 8px;

      &:last-child {
        margin-bottom: 0;
      }
    }

    .am-collapse {
      &-item {
        margin: 0;

        $count: 30;
        @for $i from 0 through $count {
          &:nth-child(#{$i + 1}) {
            animation: 400ms cubic-bezier(.45,1,.4,1.2) #{$i*100}ms am-animation-slide-up;
            animation-fill-mode: both;
          }
        }


        &__heading {
          font-size: 15px;
          font-weight: 400;
          font-style: normal;
          line-height: 1.6;
          color: $shade-900;
          padding: 12px 16px;
          border-radius: 0;
          transition: all 300ms ease-in-out;

          &:hover:not(&-active) {
            background-color: $blue-400;
          }

          &-active {
            color: $blue-900;

            .am-icon-arrow-down {
              position: relative;
              color: $blue-900;

              &:after {
                content: '';
                display: block;
                width: 24px;
                height: 24px;
                border-radius: 50%;
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background-color: fade-out($blue-900, 0.9);
              }
            }
          }
        }

        &__trigger {
          padding: 0;
        }

        &__content {
          background-color: $shade-100;
          box-shadow: 0 1px 4px fade-out($am-black, 0.97), inset 0 -1px 4px fade-out($am-black, 0.97);
        }
      }
    }
  }
}

.el-color-picker__panel {
  z-index: 99999 !important;
}

// public
//.amelia-v2-booking #amelia-container {
//  @include am-cs-colors-block;
//}

// admin
#amelia-app-backend-new {
  @include am-cs-colors-block;
}
</style>
