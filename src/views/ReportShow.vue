<template>
  <div>
    <div class="filter-tools">
      <i :class="iconArrow" class="icon-toggle" @click="filterToggle"></i>
      <transition name="slide-fade">
        <filter-form v-show="showFilterFlag" 
                     :paramsInfo="reportInfo.paramsInfo"
                     @query-params-change ="queryParamsChange"
                     @search-data ="searchData"></filter-form>
      </transition>
    </div>
    <div class="table-wrapper">
      <server-table v-if=" reportInfo.tableInfo.columns && reportInfo.tableInfo.columns.length>0"
                    :tableInfo="reportInfo.tableInfo" 
                    :queryParams = "queryParams"
                    :id ="reportInfo.id"
                    :engine ="$route.params.engine"></server-table> 
    </div>
    <div class="chart-wrapper">
      <server-chart v-if="reportInfo.chartInfo.series" :chartInfo="reportInfo.chartInfo" :queryParams = "queryParams"></server-chart> 
    </div>
  </div>
</template>

<script>
import FilterForm from '../components/FilterForm/FilterForm.vue'
import ServerTable from '../components/ServerTable/ServerTable.vue'
import ServerChart from '../components/ServerChart/ServerChart.vue'
export default {
  data () {
    return {
      showTableFlag :false,
      showFilterFlag : false,
      reportInfo:{
        id:'',
        queryImmediately:false,
        paramsInfo:[],
        tableInfo:{},
        chartInfo:{}
      },
      queryParams:{}
    };
  },
  computed:{
    initApiUrl:function(){
      return 'api/report/init?id='+this.$route.params.id+'&engine='+this.$route.params.engine;   
    },
    iconArrow:function(){
      return this.showFilterFlag == true ? 'el-icon-arrow-down':'el-icon-arrow-up';
    },
    pageSize:function(){
      if(this.reportInfo.tableInfo.pageSize)
        return this.reportInfo.tableInfo.pageSize 
      else 
        return 0;
    },
    searchParams:function(){

      return {
        id:this.$route.params.id,
        engine:this.$route.params.engine,
        condition:this.queryParams,
        pageSize: this.pageSize
      }
    }
  },
  methods: {
    queryParamsChange(val){
         this.queryParams = {...val};
    },
    getReportInfo(){
      this.$Http('get',this.initApiUrl).then((res)=>{
          this.reportInfo = {...this.reportInfo,...res.data };
          if(this.reportInfo.paramsInfo.length>0){
            this.showFilterFlag =true;        
          }
          if(this.queryImmediately)
            searchData(true);
      });
    },
    filterToggle(){
      this.showFilterFlag =!this.showFilterFlag;
    },
    searchData(immediately){
      if(immediately){
        paramsInfo.forEach(param => {
          queryParams[param.id] = param.defaultValue;
        });
      }
      this.$Http('post',"api/report/search",this.searchParams).then((res)=>{
        if(res.data.tableInfo)
             this.reportInfo.tableInfo = Object.assign({}, this.reportInfo.tableInfo,res.data.tableInfo );
        if(res.data.chartInfo)
             this.reportInfo.chartInfo = Object.assign({}, this.reportInfo.chartInfo,res.data.chartInfo );
      });
    }
  },
  created(){
    this.getReportInfo();
  },
  components: {
    ServerChart,
    ServerTable,
    FilterForm
  }
}

</script>
<style>
.filter-tools{
  position: relative;
  padding-top: 18px;
}
.icon-toggle{
  position: absolute;
  top: 0px;
  right: 5px;
  font-size: 18px;
}
.slide-fade-enter-active {
  transition: all .2s ease;
}
.slide-fade-leave-active {
  transition: all .2s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.slide-fade-enter, .slide-fade-leave-to{
  transform: translateY(-100%);
  opacity: 0;
}
</style>
