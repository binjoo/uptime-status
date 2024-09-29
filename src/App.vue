<template>
  <el-config-provider>
    <el-container>
      <el-header>
        <Header />
      </el-header>
      <el-main>
        <MonitorWrap ref="monitorWrap" />
      </el-main>
      <el-footer>
        <Footer @refresh="handleRefresh" />
      </el-footer>
    </el-container>
  </el-config-provider>
</template>

<script setup>
import { ref, getCurrentInstance } from 'vue'

const monitorWrap = ref()
const handleRefresh = () => {
  if (monitorWrap.value) {
    monitorWrap.value.getMonitors()
  }
}
</script>