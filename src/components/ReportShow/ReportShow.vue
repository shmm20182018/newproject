<template>
  <div>
    <div class="filter-tools">
      <i :class="iconArrow" class="icon-toggle" @click="showChange(filterShow)"></i>
      <transition name="slide-fade">
        <filter-form  v-show="filterShow"  :resTableInit="resTableInit" :routeParams="routerParams" ></filter-form>
      </transition>
    </div>
    <div class="table-wrapper">
      <server-table v-if="tableShow" :routeParams="routerParams" :resTableInit="resTableInit" :resetpageIndex="pageIndex"></server-table> 
    </div>
    <div class="chart-wrapper">
      <server-chart v-if="chartShow"></server-chart> 
    </div>
  </div>
</template>

<script>
import NProgress from 'nprogress'
import FilterForm from '../FilterForm/FilterForm.vue'
import ServerTable from '../ServerTable/ServerTable.vue'
import ServerChart from '../ServerChart/ServerChart.vue'
export default {
  props:{
    id:{
      type:String
    },
    engine:{
      type: String
    }
  },
  data () {
    return {
      resTableInit:{},//表格初始化数据
      routerParams:{},//路由参数
      filterData:{},//查询条件参数
      pageIndex:true,
      filterShow: true,
      tableShow: false,
      chartShow: false,
      iconArrow: 'el-icon-arrow-up'
    };
  },
  methods: {
    warnOpen(val) {
      this.$notify.error({
        title: '错误',
        message: val
      })
    },
    getInfoData(){
      NProgress.start();
      const url ='api/report/init?id='+this.id+'&engine='+this.engine+'';   
      this.$axios({
          method: 'get',
          url:url,
          //data: params
      }).then((res)=>{
          console.log(res.data);
          NProgress.done();
          var data =res.data;
          console.log(data)
          if(!data.queryParams){
            this.filterShow = false
            this.pageIndex = !this.pageIndex
          }
          if(!data.isChart){
            this.tableShow = true
            this.resTableInit2 = data
            this.resTableInit = this.resTableInit2 
          }
      })
      .catch((res) => {
        NProgress.done(); 
        this.warnOpen(res.response.data)
      }) 
    },
    showChange(show){
      if(show){
        this.filterShow = false
        this.iconArrow = 'el-icon-arrow-down'
      }else{
        this.filterShow = true
        this.iconArrow = 'el-icon-arrow-up'
      }
    }
  },
  created(){
    this.routerParams = this.$route.params
    this.getInfoData();
  },
  components: {
    'ServerChart':ServerChart,
    'ServerTable':ServerTable,
    'FilterForm':FilterForm
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
