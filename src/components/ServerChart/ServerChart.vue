<template>
  <chart :options="chartInfo" theme="light" ></chart>
</template>

<script>
import ECharts from 'vue-echarts/components/ECharts.vue'
import 'echarts/lib/chart/bar'
import 'echarts/lib/chart/line'
import 'echarts/lib/chart/pie'
import 'echarts/lib/chart/map'
import 'echarts/lib/chart/radar'
import 'echarts/lib/chart/scatter'
import 'echarts/lib/chart/effectScatter'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/polar'
import 'echarts/lib/component/geo'
import 'echarts/lib/component/legend'
import 'echarts/lib/component/title'
import 'echarts/lib/component/visualMap'
import 'echarts/lib/component/dataset'

export default {
  props:['chartInfo'],
  components: {
    chart: ECharts
  },
  data: function () {
    return {
    }
  },
  watch:{
  },
  created(){
  }
}
</script>

<style>
.echarts {
  width: 80%;
  height: 400px;
}
@media screen and (max-width: 1119px) {
  .echarts{
    width:100%;
  }
}

</style>
