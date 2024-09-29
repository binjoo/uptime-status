<template>
  <el-card class="mb-4">
    <el-row>
      <el-col :span="15" class="countdown">
        <span :class="'dot status' + status"></span>
        <el-text v-if="status === 1">所有服务运行正常</el-text>
        <el-text v-else-if="status === 2">部分服务出现故障</el-text>
        <el-text v-else-if="status === 3">全部服务出现故障</el-text>
        <el-text v-else>无服务</el-text>
      </el-col>
      <el-col :span="3" class="ta-c">
        <el-statistic title="正常" :value="up" />
      </el-col>
      <el-col :span="3" class="ta-c">
        <el-statistic title="故障" :value="down" />
      </el-col>
      <el-col :span="3" class="ta-c">
        <el-statistic title="暂停" :value="paused" />
      </el-col>
    </el-row>
  </el-card>
  <el-card>
    <div class="monitor-wrap">
      <el-skeleton :count="1" :loading="loading" v-if="loading">
        <template #template>
          <el-row>
            <el-col :span="24">
              <div class="monitor-card">
                <el-row class="meta" justify="space-between">
                  <el-col :span="6">
                    <el-skeleton-item variant="text" />
                  </el-col>
                  <el-col :span="4" :offset="14">
                    <el-skeleton-item variant="text" />
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="24">
                    <div class="timelines">
                      <el-skeleton-item variant="text" style="height: 3em;" />
                    </div>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="24">
                    <el-skeleton-item variant="text" style="width: 120px;" />
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="24" v-if="config.chart">
                    <el-skeleton-item variant="text" style="height: 5em;" />
                  </el-col>
                </el-row>
              </div>
            </el-col>
          </el-row>
        </template>
      </el-skeleton>
      <el-row v-else>
        <el-col :span="24" v-for="item, index in timelines" :key="index">
          <MonitorCard :data="item" />
          <el-divider v-if="index + 1 !== timelines.length" />
        </el-col>
      </el-row>
    </div>
  </el-card>
</template>

<script setup>
import { inject, ref, onMounted } from 'vue'
import MonitorCard from './MonitorCard.vue'
import { apiGetMonitors } from '../utils/request';

const config = inject('$config')

const timelines = ref([]);
const loading = ref(false);

const up = ref(0);
const down = ref(0);
const paused = ref(0);
const status = ref(0);

function getMonitors () {
  apiGetMonitors(config).then(response => {
    console.log(response)
    up.value = response.up;
    down.value = response.down;
    paused.value = response.paused;
    status.value = response.status;
    timelines.value = response.monitors
  }).finally(() => {
    loading.value = false;
  });
}
defineExpose({ getMonitors })
onMounted(() => {
  loading.value = true;
  // getMonitors();
});
</script>

<style lang="scss">
.countdown {
  display: flex;
  align-content: center;
  align-items: center;
}

.dot {
  margin-right: 20px;
  width: 24px;
  height: 24px;
  display: inline-block;
  border-radius: 50%;
  color: #909399;
  background: #909399;
  position: relative;
  -ms-transform: none;
  transform: none;

  &.status1 {
    color: #4CAF50;
    background: #4CAF50;
  }

  &.status2 {
    color: #FF9800;
    background: #FF9800;
  }

  &.status3 {
    color: #F44336;
    background: #F44336;
  }

  &:after {
    content: '';
    width: 100%;
    height: 100%;
    position: absolute;
    background: currentColor;
    animation: pulse 2s infinite;
    opacity: 1;
    border-radius: 50%;
    top: 0;
    left: 0;
  }
}

@keyframes pulse {
  0% {
    opacity: 0.5
  }

  70% {
    opacity: 0;
    transform: scale(2.5)
  }

  100% {
    opacity: 0
  }
}
</style>