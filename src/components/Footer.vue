<template>
  <el-row :gutter="20" class="footer">
    <el-col :span="12" :xs="24">
      <el-text>© {{ year }} <a href="https://github.com/binjoo/uptime-status" target="_blank">UptimeStatus</a></el-text>
      <el-divider direction="vertical" />
      <el-text>基于 <a href="https://uptimerobot.com/api" target="_blank">UptimeRobot API</a> 开发</el-text>
    </el-col>
    <el-col :span="12" :xs="24" class="ta-r">
      <el-text>
        <el-countdown :format="'上次更新时间 ' + last + '，将于 mm:ss 后刷新'" :value="next"
          :valueStyle="{ fontSize: '14px', color: 'var(--el-color-info)' }" @finish="requestNext" />
      </el-text>
    </el-col>
  </el-row>
</template>
<script setup>
import { inject, ref, onMounted } from 'vue'
import dayjs from 'dayjs'

const config = inject('$config')

const emits = defineEmits(["refresh"])
const next = ref(undefined);
const last = ref(undefined);
const year = ref(dayjs().format('YYYY'));

const requestNext = () => {
  next.value = dayjs().valueOf() + 1000 * 60 * config.refresh;
  last.value = dayjs().format('HH:mm:ss');
  emits("refresh")
}

onMounted(() => {
  requestNext()
})
</script>

<style lang="scss">
.footer {
  height: 100%;
  align-content: center;

  .el-text {
    a {
      color: #4CAF50
    }

    .el-statistic {
      .el-statistic__content {
        display: flex;
        justify-content: flex-end;
        align-items: center;
      }
    }
  }
}
</style>