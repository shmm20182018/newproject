<template>
  <div :class="phoneClass" class="report-show-wrapper" v-wechat-title="reportTitle">
    <div class="filter-tools">
      <el-tooltip content="过滤条件区" placement="bottom" effect="light">
        <div class="filter-toggle-wrapper" @click="showToggle('filter')">
          <img class="img-toggle" src="../assets/image/filter.png" alt="">
          <i :class="iconArrowFilter" class="icon-toggle"></i>
        </div>
      </el-tooltip>
      <transition name="slide-fade">
        <filter-form v-show="showFilterFlag" 
                     :paramsInfo="reportInfo.paramsInfo"
                     @query-params-change ="queryParamsChange"
                     @search-data ="searchData"
                     :phoneFlag="phoneFlag"></filter-form>
      </transition>
    </div>
    <p class="report-title" v-if="!phoneFlag">{{reportTitle}}</p>
    <div class="chart-wrapper" v-if="reportInfo.chartInfo.series" >
      <el-tooltip content="图表展示区" placement="bottom" effect="light">
        <div class="filter-toggle-wrapper" @click="showToggle('chart')">
          <img class="img-toggle" src="../assets/image/chart.png" alt="">
          <i :class="iconArrowChart" class="icon-toggle"></i>
        </div>
      </el-tooltip>
      <transition name="fade">
        <server-chart v-show="showChartFlag" :chartInfo="reportInfo.chartInfo" :queryParams = "queryParams"></server-chart> 
      </transition> 
    </div>
    <div class="report-table-wrapper" v-if="reportInfo.tableInfo.columns" v-show="reportInfo.tableInfo.columns.length>0">
      <el-tooltip content="表格展示区" placement="bottom" effect="light">
        <div class="filter-toggle-wrapper" @click="showToggle('table')">
          <img class="img-toggle" src="../assets/image/table.png" alt="">
          <i :class="iconArrowTable" class="icon-toggle"></i>
        </div>
      </el-tooltip>
      <transition name="fade" >
        <server-table  v-show="showTableFlag"
                      :tableInfo="reportInfo.tableInfo" 
                      :hasChart="reportInfo.chartInfo.series"
                      :queryParams = "queryParams"
                      :id ="reportInfo.id"
                      :engine ="$route.params.engine"
                      :phoneFlag="phoneFlag"
                      :showChartFlag="showChartFlag"
                      ref="stable">
        </server-table>
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
      queryParams:{},
      phoneFlag:false,
    };
  },
  computed:{
    phoneClass(){
      if(this.$route.params.pc == 'Mobile'){
        this.phoneFlag = true
        return 'phone-style-class'  
        //this.tableHeight = 1*100%
      
      }else if(this.$route.params.pc == 'PC'){
        return 'pc-style-class'
      }
    },
    reportTitle(){
      if(this.reportInfo.title){
        return this.reportInfo.title
      }else if(this.reportInfo.tableInfo.title){
        return this.reportInfo.tableInfo.title
      }else{
        return "报表展示"
      }
    },
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
        if(res.data.tableInfo){
          this.reportInfo.tableInfo = Object.assign({},this.reportInfo.tableInfo,res.data.tableInfo); 
          if(this.phoneFlag){
            for(let i in this.reportInfo.tableInfo.columns){
              this.$set(this.reportInfo.tableInfo.columns[i],'isFrozen',false)
            }
            this.showFilterFlag = false;
          }
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
.report-show-wrapper{
  padding:0 8px;
  box-sizing: border-box;
}
.chart-wrapper{
  width: 100%;
  display: flex;
  justify-content:center;
}
.filter-tools,.table-wrapper,.chart-wrapper{
  position: relative;
  padding-top: 18px;
}
.filter-toggle-wrapper{
  position: absolute;
  top: 0px;
  right: 5px;
  font-size: 18px;
}
.img-toggle{
  height: 18px;
}
.icon-toggle{
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
.report-table-wrapper{
  position: relative;
  padding-top: 18px;
}
.report-title{
  height: 18px;
  line-height: 18px;
  padding-left: 4px;
  font-size: 18px;
  font-weight: 700;
  margin: 0;
  text-align: center;
  color: #666;
}
.phone-style-class .filter-tools{
  margin-bottom: 5px;
}
.phone-style-class .filter-toggle-wrapper{
  height: 28px;
  line-height: 28px;
}
.phone-style-class .img-toggle{
  height: 28px;
}
.phone-style-class .icon-toggle{
  display: inline-block;
  font-size: 18px;
  height: 28px;
  line-height: 28px;
  vertical-align: top;
}
.phone-style-class .filter-tools, .phone-style-class .table-wrapper, .phone-style-class .chart-wrapper{
  padding-top: 28px;
}
</style>
