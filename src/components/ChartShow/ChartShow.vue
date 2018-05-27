<template>
  <div>
    <div class="filter-tools">
      <i :class="iconArrow" class="icon-toggle" @click="showChange(filterShow)"></i>
      <transition name="slide-fade">
        <filter-form v-show="filterShow" @on-filterdata-change="filterdataChange" @on-filter-submit="filterSubmit"></filter-form>
      </transition>
    </div>
    <div class="table-wrapper">
      <s-table  :resetpageIndex="pageIndex" :filterData="filterData"></s-table> 
    </div>
  </div>
</template>

<script>
import FilterForm from '../FilterForm/FilterForm.vue'
import ServerTable from '../ServerTable/ServerTable.vue'
import ServerTable1 from '../ServerTable/ServerTable1.vue'
export default {
  data () {
    return {
      id:'',
      engine:'',
      filterData:{},
      pageIndex:true,
      filterShow: true,
      tableShow: true,
      chartShow: true,
      iconArrow: 'el-icon-arrow-up'
    };
  },
  methods: {
    showChange(show){
      if(show){
        this.filterShow = false
        this.iconArrow = 'el-icon-arrow-down'
      }else{
        this.filterShow = true
        this.iconArrow = 'el-icon-arrow-up'
      }
    },
    filterdataChange(val){
      this.filterData = val
    },
    filterSubmit(val){
      this.pageIndex = !this.pageIndex
    }
  },
  created(){
   //console.log(this.id)
  },
  components: {
      'ServerTable':ServerTable,
      'STable':ServerTable1,
      'FilterForm':FilterForm
  }
}

</script>
<style>
.filter-tools{
  position: relative;
  border-top: 1px solid #ddd; 
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
.table-wrapper {
  
}
</style>
