<template>
  <div class="monitor-card">
    <el-row class="meta" justify="space-between">
      <el-col :span="12">
        <a :href="data.url" target="_blank">{{ data.name }}</a>
      </el-col>
      <el-col :span="12">
        <el-text v-if="data.average >= 100" type="success">{{ data.average }}%</el-text>
        <el-text v-else-if="data.average >= 99" type="success">{{ data.average }}%</el-text>
        <el-text v-else-if="data.average >= 95" type="warning">{{ data.average }}%</el-text>
        <el-text v-else type="danger">{{ data.average }}%</el-text>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <div class="timelines">
          <el-tooltip effect="dark" placement="top" :hideAfter="32" popper-class="tooltip"
            v-for="line, index in data.daily" :key="index">
            <template #content>
              <el-space direction="vertical" alignment="start" class="content">
                <el-text tag="b">{{ line.date.format('YYYY-MM-DD') }}</el-text>
                <el-text v-if="line.uptime >= 100">可用率 {{ formatNumber(line.uptime) }}%</el-text>
                <el-text v-else-if="line.uptime <= 0 && line.down.times === 0">无数据</el-text>
                <el-text v-else>故障 {{ line.down.times }} 次，累计 {{ formatDuration(line.down.duration) }}，可用率 {{
                  formatNumber(line.uptime) }}%</el-text>
              </el-space>
            </template>
            <span class="timeline high" v-if="line.uptime >= 100"></span>
            <span class="timeline none" v-else-if="line.uptime <= 0 && line.down.times === 0"></span>
            <span class="timeline medium" v-else-if="formatNumber(line.uptime) >= 99"></span>
            <span class="timeline low" v-else-if="formatNumber(line.uptime) >= 95"></span>
            <span class="timeline down" v-else></span>
          </el-tooltip>
        </div>
      </el-col>
    </el-row>
    <el-row justify="space-between">
      <el-col :span="4">
        <el-popover placement="right-end" trigger="click" :width="400" :hideAfter="32" popper-class="log">
          <template #reference>
            <el-button link>
              <el-icon>
                <Bell />
              </el-icon>
            </el-button>
          </template>
          <template v-if="data.logs.length > 0">
            <el-scrollbar max-height="360px">
              <el-timeline>
                <el-timeline-item v-for="(log, index) in data.logs" :key="index" placement="top" :timestamp="log.time"
                  :type="log.type">
                  {{ log.reason?.detail }} ({{ formatDuration(log.duration) }})
                </el-timeline-item>
              </el-timeline>
            </el-scrollbar>
          </template>
          <template v-else>
            <el-empty :description="'最近 ' + (config.days) + ' 天无日志数据'" />
          </template>
        </el-popover>
      </el-col>
      <el-col :span="20" class="ta-r">
        <el-text type="info" v-if="data.total?.times > 0">最近 {{ config.days }} 天故障 {{ data.total?.times }} 次，累计 {{
          formatDuration(data.total?.duration) }}，可用率 {{ data.average }}% </el-text>
        <el-text type="info" v-else>最近 {{ config.days }} 天无故障，可用率 {{ data.average }}%</el-text>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24" v-if="config.chart">
        <ResponseChart :data="data.response.length > 0" :option="option" />
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { inject, watch, ref } from 'vue'
import ResponseChart from './ResponseChart.vue'
import * as echarts from "echarts";
import { formatDuration, formatNumber } from '../utils'

const config = inject('$config')

const props = defineProps({
  data: {
    type: Object,
    required: true
  }
})

const option = ref({
  color: ['#43A047'],
  grid: {
    x: 0,
    y: 0,
    x2: 0,
    y2: 0,
  },
  xAxis: {
    show: true,
    zlevel: 1,
    boundaryGap: true,
    axisLabel: {
      inside: true,
      interval: props.data.response.length - 2,
      alignMinLabel: 'left',
      alignMaxLabel: 'right',
      margin: 0,
      padding: [4, 4, 2, 4],
      color: '#43A047',
      backgroundColor: '#E8F5E9',
      borderRadius: 4,
    },
    axisLine: {
      show: false
    },
    axisTick: {
      show: false
    },
    data: props.data.response.map(item => item.time)
  },
  yAxis: {
    show: false,
  },
  series: {
    data: props.data.response.map(item => item.value),
    type: 'line',
    silent: true,
    smooth: true,
    showSymbol: false,
    markLine: {
      silent: true,
      symbol: 'none',
      label: {
        show: true,
        position: 'middle',
        fontSize: 12,
        padding: [4, 4, 2, 4],
        color: '#4CAF50',
        backgroundColor: '#E8F5E9',
        borderRadius: 4,
        formatter: (params) => {
          return Math.round(params.value) + ' ms';
        }
      },
      data: [
        { type: 'average' }
      ]
    },
    areaStyle: {
      color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
        offset: 0,
        color: '#4CAF50'
      }, {
        offset: 1,
        color: '#E8F5E9'
      }])
    }
  }
});

watch(
  () => props.data,
  (val) => {
    option.value.xAxis.axisLabel.interval = val.response.length - 2;
    option.value.xAxis.data = val.response.map(item => item.time);
    option.value.series.data = val.response.map(item => item.value);
  }
);

</script>

<style lang="scss">
.monitor-card {
  margin-bottom: 20px;

  .meta {
    .el-col:last-child {
      text-align: right;
    }
  }

  &>.el-row {
    margin-bottom: 10px;
  }
}

.log {
  .el-timeline {
    margin: 0 4px;

    .el-timeline-item {
      padding-bottom: 8px;

      &:last-child {
        padding-bottom: 0;
      }
    }
  }
}

.tooltip {
  .content {
    div.el-space__item {
      &:last-child {
        .el-text {
          color: #fff;
        }
      }
    }
  }
}

.timelines {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  gap: 2px;

  @media screen and (max-width: 768px) {
    gap: 1px;
  }

  .text {
    font-size: 1.4em;
  }

  .timeline {
    border-radius: 5px;
    height: 36px;
    flex-grow: 1;
    transition: opacity .15s ease;
    display: inline-block;

    &:hover {
      opacity: .6;
    }

    &.high {
      background-color: #4CAF50;
    }

    &.medium {
      background-color: #81C784;
    }

    &.low {
      background-color: #FF9800;
    }

    &.down {
      background-color: #F44336;
    }

    &.none {
      background-color: #e5e8eb;
    }
  }
}
</style>