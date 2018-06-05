<template>
  <div>
    <div class="filter-tools">
      <i :class="iconArrow" class="icon-toggle" @click="filterToggle"></i>
      <transition name="slide-fade">
        <filter-form v-show="showFilterFlag" 
                     :paramsInfo="reportInfo.paramsInfo"
                     :queryParams.sync ="queryParams"></filter-form>
      </transition>
    </div>
    <div class="table-wrapper">
      <server-table v-if="reportInfo.tableInfo && queryParams " 
                    :tableInfo="reportInfo.tableInfo" 
                    :queryParams = "queryParams"
                    :id ="reportInfo.id"
                    :engine ="$route.params.engine"></server-table> 
    </div>
    <div class="chart-wrapper">
      <server-chart v-if="reportInfo.chartInfo" :chartInfo="reportInfo.chartInfo" :queryParams = "queryParams"></server-chart> 
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
      return this.showFilterFlag == true? 'el-icon-arrow-down':'el-icon-arrow-up';
    },
    pageSize:function(){
      if(this.tableInfo.pageSize)
        return this.tableInfo.pageSize 
      else 
        return 0;
    },
    searchParams:function(){
      return {
        id:this.$route.params.id,
        engine:this.$route.params.engine,
        condition:this.queryParams,
        pageSize: this.tableInfo.hasOwnProperty('pageSize') ? this.tableInfo.pageSize : 0
      }
    }
  },
  methods: {
    getReportInfo(){
      this.$http('get',this.initApiUrl).then((res)=>{
          this.reportInfo = Object.assign({},this.reportInfo,res.data);
          console.log(this.reportInfo);
          if(this.reportInfo.paramsInfo.length>0)
            this.showFilterFlag =true;
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
      this.$http('post',"api/report/search",searchParams).then((res)=>{
          this.reportInfo = Object.assign({},this.reportInfo,res.data);
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
