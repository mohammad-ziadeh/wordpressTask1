<template>
  <div class="am-cs-fonts">
    <div class="am-cs-fonts__selection">
      <AmSelect
        v-model="amCustomize.fonts.fontFamily"
        @change="fontSelect"
      >
        <AmOption
          label="Custom"
          :value="amCustomize.fonts.customFontFamily"
        ></AmOption>
        <AmOption
          v-for="font in fontsArray"
          :key="font.id"
          :value="font.value"
          :label="font.name"
        ></AmOption>
      </AmSelect>
    </div>
    <transition name="fade">
      <div v-if="amCustomize.fonts.fontFamily === amCustomize.fonts.customFontFamily">
        <div class="am-setting__inner">
          <p>{{amLabels.font_url}}</p>
          <AmInput v-model="amCustomize.fonts.fontUrl" @change="activateCustomFontStyles"/>
        </div>
        <div class="am-setting__inner">
          <p>{{amLabels.font_family}}</p>
          <AmInput v-model="amCustomize.fonts.customFontFamily" @input="updateFontFamily"></AmInput>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import AmSelect from '../../../../_components/select/AmSelect.vue'
import AmOption from '../../../../_components/select/AmOption.vue'
import { inject } from 'vue'
import AmInput from "../../../../_components/input/AmInput";

let amCustomize = inject('customize')

let fontsArray = [
  {
    id: 1,
    name: 'Roboto',
    value: 'Amelia Roboto, sans-serif'
  },
  {
    id: 2,
    name: 'Lato',
    value: 'Amelia Lato'
  },
  {
    id: 3,
    name: 'Merriweather',
    value: 'Amelia Merriweather, serif'
  },
  {
    id: 4,
    name: 'Montserrat',
    value: 'Amelia Montserrat, sans-serif'
  },
  {
    id: 5,
    name: 'Mulish',
    value: 'Amelia Mulish, sans-serif'
  },
  {
    id: 6,
    name: 'Nunito',
    value: 'Amelia Nunito, sans-serif'
  },
  {
    id: 7,
    name: 'Asap Condensed',
    value: 'Amelia Asap Condensed, sans-serif'
  },
  {
    id: 8,
    name: 'Open Sans',
    value: 'Amelia Open Sans, sans-serif'
  },
  {
    id: 9,
    name: 'Barlow',
    value: 'Amelia Barlow, sans-serif'
  },
  {
    id: 10,
    name: 'Oswald',
    value: 'Amelia Oswald, sans-serif'
  },
  {
    id: 11,
    name: 'Bitter',
    value: 'Amelia Bitter, serif'
  },
  {
    id: 12,
    name: 'Poppins',
    value: 'Amelia Poppins, sans-serif'
  },
  {
    id: 13,
    name: 'Carme',
    value: 'Amelia Carme, sans-serif'
  }
]

function fontSelect (a) {
  if (amCustomize.value.fonts.customFontFamily === a) {
    amCustomize.value.fonts.customFontSelected = true
    activateCustomFontStyles()
  } else {
    amCustomize.value.fonts.customFontSelected = false
  }
}

function activateCustomFontStyles () {
  let head = document.head || document.getElementsByTagName('head')[0]
  if (head.querySelector('#amCustomFont')) {
    head.querySelector('#amCustomFont').remove()
  }

  let css = `@font-face {font-family: '${amCustomize.value.fonts.fontFamily}'; src: url(${amCustomize.value.fonts.fontUrl});}`
  let style = document.createElement('style')
  head.appendChild(style)
  style.setAttribute('type', 'text/css')
  style.setAttribute('id', 'amCustomFont')
  style.appendChild(document.createTextNode(css))
}

function updateFontFamily (a) {
  amCustomize.value.fonts.fontFamily = a
  activateCustomFontStyles()
}

// * Labels
let amLabels = inject('labels')
</script>

<script>
export default {
  name: "CustomizationFonts"
}
</script>

<style lang="scss">
// am - amelia
// cs - customize sidebar
@mixin am-cs-fonts-block {
  .am-cs-fonts {
    padding: 0 16px;
  }
}

// admin
#amelia-app-backend-new {
  @include am-cs-fonts-block;
}
</style>