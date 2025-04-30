<template>
  <el-form-item v-for="field in infoFormRule.customFields" class="am-fs__info-form__item" :prop="field.label.replace(' ','')">
    <template #label>
      <span class="am-fs__info-form__label">
        {{field.label}}
      </span>
    </template>
    <input
      :name="field.label"
      v-model="infoFormRule.customFields"
      size="default"
      :type="field.type"
    />
  </el-form-item>
</template>

<script setup></script>

<style></style>