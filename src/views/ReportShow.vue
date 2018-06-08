<template>
  <div>
    <div class="filter-tools">
      <i :class="iconArrowFilter" class="icon-toggle" @click="showToggle('filter')"></i>
      <transition name="slide-fade">
        <filter-form v-show="showFilterFlag" 
                     :paramsInfo="reportInfo.paramsInfo"
                     @query-params-change ="queryParamsChange"
                     @search-data ="searchData"></filter-form>
      </transition>
    </div>
    <div class="table-wrapper" v-if="reportInfo.tableInfo.columns" v-show="reportInfo.tableInfo.columns.length>0">
      <i :class="iconArrowTable" class="icon-toggle" @click="showToggle('table')"></i>
      <transition name="fade" >
        <server-table  v-show="showTableFlag"
                      :tableInfo="reportInfo.tableInfo" 
                      :queryParams = "queryParams"
                      :id ="reportInfo.id"
                      :engine ="$route.params.engine"
                      ref="stable">
        </server-table> 
      </transition>              
    </div>
    <div class="chart-wrapper" v-if="reportInfo.chartInfo.series" >
      <i :class="iconArrowChart" class="icon-toggle" @click="showToggle('chart')"></i>
      <transition name="fade">
        <server-chart v-show="showChartFlag" :chartInfo="reportInfo.chartInfo" :queryParams = "queryParams"></server-chart> 
      </transition> 
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
      showChartFlag :false,
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
    iconArrowFilter:function(){
      return this.showFilterFlag == true ? 'el-icon-arrow-down':'el-icon-arrow-up';
    },
    iconArrowTable:function(){
      return this.showTableFlag == true ? 'el-icon-arrow-down':'el-icon-arrow-up';
    },
    iconArrowChart:function(){
      return this.showChartFlag == true ? 'el-icon-arrow-down':'el-icon-arrow-up';
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
          if(this.reportInfo.tableInfo.columns.length>0){
            this.showTableFlag =true;        
          }
          if(this.reportInfo.chartInfo.series){
            this.showChartFlag =true;        
          }
          if(this.queryImmediately)
            searchData(true);
      });
    },
    showToggle(type){
      if(type == 'filter'){
        this.showFilterFlag =!this.showFilterFlag;        
      }
      if(type == 'table'){
        this.showTableFlag =!this.showTableFlag;        
      }
      if(type == 'chart'){
        this.showChartFlag =!this.showChartFlag;        
      }
    },
    searchData(immediately){
      if(immediately){
        paramsInfo.forEach(param => {
          queryParams[param.id] = param.defaultValue;
        });
      }
      this.$Http('post',"api/report/search",this.searchParams).then((res)=>{
         console.log(this.reportInfo)
        if(res.data.tableInfo){
          this.reportInfo.tableInfo = Object.assign({}, this.reportInfo.tableInfo,res.data.tableInfo );
          this.$nextTick(()=>{
             // this.$refs.stable.$emit('changeData') 
             this.$refs.stable.dataHandle(true)   
          })
          this.showTableFlag =true; 
        }
        if(res.data.chartInfo.dataset){
          this.$set(this.reportInfo.chartInfo,'dataset',res.data.chartInfo.dataset);
          this.showChartFlag =true; 
        }   
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
.chart-wrapper{
  width: 100%;
  display: flex;
  justify-content:center;
}
.filter-tools,.table-wrapper,.chart-wrapper{
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
  transition: all .3s ease;
}
.slide-fade-leave-active {
  transition: all .3s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.slide-fade-enter, .slide-fade-leave-to{
  transform: translateY(-100%);
  opacity: 0;
}
.fade-enter-active {
  transition: all .3s ease;
}
.fade-leave-active {
  transition: all .3s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.fade-enter, .fade-leave-to{
  opacity: 0;
}
</style>
