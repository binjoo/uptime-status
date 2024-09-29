<template>
  <v-chart v-if="props.data" class="chart" :option="props.option" :autoresize="true" />
  <el-empty v-else :imageSize="1" description="无响应数据" />
</template>

<script setup>
import VChart from "vue-echarts";

const props = defineProps({
  data: {
    type: Boolean,
    default: false
  },
  option: {
    type: Object,
    required: true
  }
})
</script>

<style lang="scss">
.chart {
  height: 80px;
}
</style>
