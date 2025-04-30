<template>
  <el-form-item
    :id="props.id"
    ref="formFieldRef"
    class="am-ff__item"
    :prop="props.itemName"
    :label-position="props.labelPosition"
  >
    <template #label>
      <span class="am-ff__item-label" v-html="props.label" />
    </template>
    <!-- Address Field -->
    <div :class="{'am-input-wrapper' : googleMapsLoaded}">
      <div v-if="googleMapsLoaded()">
        <div class="el-input el-input--default am-input am-input__default">
          <vue-google-autocomplete
            :id="`amelia-address-autocomplete-${props.itemName}`"
            ref="addressCustomFields"
            types=""
            classname="el-input__inner"
            placeholder=""
            @change="setAddressCF($event)"
          >
          </vue-google-autocomplete>
        </div>
      </div>
      <AmInput
        v-else
        v-model="model"
        placeholder=""
      >
      </AmInput>
    </div>
    <!-- /Address Field -->
  </el-form-item>
</template>

<script setup>
// * _components
import AmInput from '../../_components/input/AmInput.vue'

// * Vue Google Maps Autocomplete
import VueGoogleAutocomplete from 'vue-google-autocomplete'

// * Import from Vue
import {
  computed,
  ref,
  toRefs,
  onMounted
} from "vue";

// * Import from Vuex
import { useStore } from "vuex";

let store = useStore()

// * Form Item Props
let props = defineProps({
  modelValue: {
    type: [String, Array, Object, Number],
    required: true
  },
  id: {
    type: [String, Number],
  },
  itemName: {
    type: String,
    required: true
  },
  label: {
    type: String
  },
  labelPosition: {
    type: String,
    default: 'top'
  },
  options: {
    type: Array,
  }
})

// * Define Emits
const emits = defineEmits(['update:modelValue'])

// * Component model
let { modelValue } = toRefs(props)
let model = computed({
  get: () => modelValue.value,
  set: (val) => {
    emits('update:modelValue', val)
  }
})

let addressCustomFields = ref()

onMounted(() => {
  if (model.value && addressCustomFields.value) {
    addressCustomFields.value.update(model.value)
  }
})

function googleMapsLoaded () {
  return window.google && store.state.settings.general.gMapApiKey
}

function setAddressCF (val) {
  if (typeof val === 'string') {
    emits('update:modelValue', val)
  }
}

// * Form Item Reference
let formFieldRef = ref(null)

defineExpose({
  formFieldRef
})
</script>

<script>
export default {
  name: "AddressFormField"
}
</script>

<style lang="scss">
.pac-container {
  z-index: 9999999999 !important;
}
</style>
