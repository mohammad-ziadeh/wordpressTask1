<template>
  <div>
    <div>
      <AmInput v-model="searchFilter" :icon-start="iconSearch"></AmInput>
    </div>

  <el-collapse
    v-model="activeCategoryIndex"
    class="am-caes"
    :style="cssVars"
  >
    <el-collapse-item
      v-for="category in categories"
      :key="'category_' + category.id"
      :name="'category_' + category.id"
      class="am-caes__category"
    >
      <template #title>
        <div class="am-caes__category-header">
          <AmCheckbox
            v-model="categoriesCheckbox[category.id]"
            :indeterminate="categoryIndeterminate(category)"
            @click="(e) => {
              e.stopPropagation()
              activeCategoryIndex = `category_${category.id}`
            }"
            @change="(val) => toggleCategoryServices(val, category)"
          />
          <div class="am-caes__category-header__text">
            {{ category.name }}
          </div>
        </div>
      </template>
      <el-collapse
        v-model="activeServiceIndex"
        class="am-caes__inner"
      >
        <el-collapse-item
          v-for="service in categories.find((c) => c.id === category.id).serviceList.filter(i => !searchFilter.trim() || i.name.toLowerCase().includes(searchFilter.toLowerCase()))"
          :key="`service_${service.id}`"
          :name="`service_${service.id}`"
          class="am-caes__service"
        >
          <template #title>
            <div class="am-caes__service-header">
              <AmCheckbox
                v-model="employee.serviceList[category.id][service.id].enabled"
                @click="(e) => {
                  e.stopPropagation()
                  activeServiceIndex = `service_${service.id}`
                }"
                @change="changeCategoryState(category)"
              />
              <div class="am-caes__service-header__text">
                {{ service.name }}
              </div>
            </div>
          </template>

          <div class="am-caes__service-content">

            <!-- Minimum Capacity -->
            <div
              class="am-caes__service-content__item"
              :class="props.responsiveClass"
            >
              <div class="am-caes__service-content__text">
                {{ amLabels.minimum_capacity }}
              </div>
              <AmInputNumber
                v-model="employee.serviceList[category.id][service.id].minCapacity"
                class="am-caes__service-content__inner"
                :min="1"
                size="small"
              />
            </div>
            <!-- /Minimum Capacity -->

            <!-- Maximum Capacity -->
            <div
              class="am-caes__service-content__item"
              :class="props.responsiveClass"
            >
              <div class="am-caes__service-content__text">
                {{ amLabels.maximum_capacity }}
              </div>
              <AmInputNumber
                v-model="employee.serviceList[category.id][service.id].maxCapacity"
                class="am-caes__service-content__inner"
                :min="employee.serviceList[category.id][service.id].minCapacity"
                size="small"
              />
            </div>
            <!-- /Maximum Capacity -->

            <!-- Duration and Price -->
            <template
              v-for="(item, durationIndex) in employee.serviceList[category.id][service.id].customPricing.durations"
              :key="durationIndex"
            >
              <!-- Duration -->
              <div
                class="am-caes__service-content__item"
                :class="props.responsiveClass"
              >
                <div class="am-caes__service-content__text">
                  {{ amLabels.duration }}
                </div>
                <div class="am-caes__service-content__inner am-caes__service-content__disabled">
                  {{ useSecondsToDuration(durationIndex, amLabels.h, amLabels.min) }}
                </div>
              </div>
              <!-- /Duration -->

              <!-- Price -->
              <div
                class="am-caes__service-content__item"
                :class="props.responsiveClass"
              >
                <div class="am-caes__service-content__text">
                  {{ amLabels.price }}
                </div>
                <AmInput
                  v-model="item.price"
                  class="am-caes__service-content__inner"
                  placeholder=""
                  size="small"
                  :is-money="true"
                />
              </div>
              <!-- /Price -->
            </template>
            <!-- /Duration and Price -->
          </div>
        </el-collapse-item>
      </el-collapse>
    </el-collapse-item>
  </el-collapse>
  </div>
</template>

<script setup>
// * Import from Vue
import { computed, inject, onMounted, ref } from 'vue'

// * Import from Vuex
import { useStore } from 'vuex'

// * Composables
import { useSecondsToDuration } from '../../../../../../assets/js/common/date'
import { useColorTransparency } from '../../../../../../assets/js/common/colorManipulation'

// * Dedicated components
import AmCheckbox from '../../../../../_components/checkbox/AmCheckbox.vue'
import AmInputNumber from '../../../../../_components/input-number/AmInputNumber.vue'
import AmInput from "../../../../../_components/input/AmInput.vue";
import IconComponent from "../../../../../_components/icons/IconComponent.vue";

// * Props
const props = defineProps({
  responsiveClass: {
    type: String,
    default: '',
  },
})

// * Store
let store = useStore()

// * Labels
let amLabels = inject('amLabels')

let searchFilter = ref('')

let iconSearch = {
  components: {IconComponent},
  template: `<IconComponent icon="search"/>`
}

// * Categories Checkbox
let categoriesCheckbox = ref({})

let employee = computed(() => {
  return store.getters['employee/getEmployee']
})

let categories = computed(() => {
  return store.getters['entities/getCategories'].filter((c) => {
    return (
      c.status === 'visible' &&
      c.serviceList.length > 0 &&
      (!searchFilter.value.trim() || c.serviceList.filter(i => i.name.toLowerCase().includes(searchFilter.value.toLowerCase().trim())).length)
    )
  })
})

let activeCategoryIndex = computed(() => categories.value.length === 1 ? 'category_' + categories.value[0].id : null)

let activeServiceIndex = ref(0)

function categoryIndeterminate(category) {
  const enabledServices = category.serviceList.filter(service => employee.value.serviceList[category.id][service.id].enabled);
  return enabledServices.length > 0 && enabledServices.length < category.serviceList.length;
}

function changeCategoryState(category) {
  const enabledServices = category.serviceList.filter(service => employee.value.serviceList[category.id][service.id].enabled);
  categoriesCheckbox.value[category.id] = enabledServices.length !== 0;
}

function toggleCategoryServices(value, category) {
  category.serviceList.forEach(s => {
    store.commit('employee/setServiceEnabled', {
      categoryId: category.id,
      serviceId: s.id,
      value
    })
  })
}

onMounted(() => {
  categories.value.forEach((category) => {
    categoriesCheckbox.value[category.id] = category.serviceList.filter(service => employee.value.serviceList[category.id][service.id].enabled).length !== 0
  })
})

// * Colors
let amColors = inject('amColors')

let cssVars = computed(() => {
  return {
    '--am-c-caes-primary': amColors.value.colorPrimary,
    '--am-c-caes-text': amColors.value.colorMainText,
    '--am-c-caes-text-op03': useColorTransparency(amColors.value.colorMainText, 0.03),
    '--am-c-caes-inp-bgr-op03': useColorTransparency(amColors.value.colorInpBgr, 0.03),
  }
})
</script>

<script>
export default {
  name: 'CabinetEmployeeProfileServices',
}
</script>

<style lang="scss">
@mixin am-cabinet-employee-services {
  // am   - amelia
  // caes - cabinet employee services
  .am-caes {
    padding-top: 10px;
    display: flex;
    flex-direction: column;
    gap: 24px;

    &__inner {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    &__category {
      border-radius: 8px;
      background-color: var(--am-c-caes-text-op03);

      &-header {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        width: 100%;
        gap: 8px;

        &__text {
          color: var(--am-c-caes-text);
        }

        .am-checkbox-wrapper {
          width: 16px;
          height: 16px;

          .el-checkbox__input {
            padding: 0;
          }
        }
      }

       .el-collapse-item {
        &__header {
          height: unset;
          background-color: transparent;
          padding: 16px 24px;
        }

        &__wrap {
          padding: 0 24px 16px;
          background-color: transparent;
        }
      }
    }

    &__service {
      background-color: var(--am-c-main-bgr);
      border-radius: 8px;

      &-header {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        width: 100%;
        gap: 8px;

        &__text {
          color: var(--am-c-caes-text);
        }

        .am-checkbox-wrapper {
          width: 16px;
          height: 16px;

          .el-checkbox__input {
            padding: 0;
          }
        }
      }

      &-content {
        display: flex;
        flex-wrap: wrap;
        flex-direction: row;
        align-items: center;
        gap: 16px;
        background-color: var(--am-c-caes-text-op03);
        padding: 16px 24px;
        border-radius: 8px;

        &__item {
          display: flex;
          flex-wrap: wrap;
          gap: 4px;
          width: calc(50% - 8px);

          &.am-rw-460 {
            width: 100%;
          }
        }

        &__text {
          font-size: 15px;
          font-style: normal;
          font-weight: 500;
          line-height: 1.333333;
          color: var(--am-c-main-text);
        }

        &__inner {
          width: 100%;
        }

        &__disabled {
          font-size: 15px;
          font-style: normal;
          font-weight: 400;
          line-height: 1.333333;
          color: var(--am-c-main-text);
          background-color: var(--am-c-caes-inp-bgr-op03);
          padding: 4px 8px;
          border: 1px solid var(--am-c-inp-border);
          border-radius: 6px;
          cursor: not-allowed;
        }
      }
    }
  }
}

.amelia-v2-booking #amelia-container {
  @include am-cabinet-employee-services;
}
</style>
