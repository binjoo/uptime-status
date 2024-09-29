<template>
  <el-row :gutter="20" justify="space-between" class="header">
    <el-col :span="12">
      <el-link type="info" :underline="false">
        <el-text tag="h1">{{ config.title }}</el-text>
      </el-link>
    </el-col>
    <el-col :span="12" class="ta-r">
      <template v-for="(link, index) in config.links" :key="index">
        <a :href="link.url" target="_blank">{{ link.title }}</a>
        <el-divider direction="vertical" v-if="index < config.links.length - 1" />
      </template>
    </el-col>
  </el-row>
</template>
<script setup>
import { inject } from 'vue'

const config = inject('$config')
</script>

<style lang="scss">
.header {
  height: 100%;
  align-content: center;

  h1 {
    font-size: 1.5em !important;
  }
}
</style>