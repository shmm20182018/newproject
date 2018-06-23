<template>
  <div>
    <div class="filter-config-menu">
      <ul>
        <li @click="addFilter">新增</li>
        <li @click="saveFilter">保存</li>
        <li @click="delFilter">删除</li>
      </ul>
    </div>
    <div class="filter-config-content">
      <div class="filter-config-left">
        <div class="filter-list-title">
          <div class="filter-code">参数编号</div>
          <div class="filter-name">参数名称</div>
        </div>
        <div v-for="(filter,index) in filterConfig" :key="index" @click="changeIndex(index)" class="filter-list-item">
          <div class="filter-code">{{filter.code}}</div>
          <div class="filter-name">{{filter.name}}</div>
        </div>
      </div>
      <div class="filter-config-right">
        <el-collapse v-model="activeNameFilter" >
          <el-form ref="form" :model="filterConfig[filterIndex]" label-width="100px" size="small" label-position="left">
          <el-collapse-item title="参数" name="filter">
            <el-form-item label="参数编号" >
              <el-input v-model="filterConfig[filterIndex].code"></el-input>
            </el-form-item> 
            <el-form-item label="参数名称" >
              <el-input v-model="filterConfig[filterIndex].name"></el-input>
            </el-form-item > 
            <el-form-item label="参数类型" >
              <el-select v-model="filterConfig[filterIndex].paramType" placeholder="">
                <el-option label="字符串" value=1></el-option>
                <el-option label="数值" value=2></el-option>
                <el-option label="日期" value=3></el-option>
                <el-option label="年月" value=4></el-option>
                <el-option label="年" value=5></el-option>
              </el-select> 
            </el-form-item >
            <el-form-item label="排序" >
              <el-input v-model="filterConfig[filterIndex].sort"></el-input>
            </el-form-item>       
          </el-collapse-item>
          <el-collapse-item title="帮助" name="help">
            <el-form-item label="帮助信息">
              <el-input v-model="filterConfig[filterIndex].helpId"></el-input>
            </el-form-item> 
            <el-form-item label="帮助编码">
              <el-input v-model="filterConfig[filterIndex].helpBH"></el-input>
            </el-form-item> 
            <el-form-item label="帮助条件">
              <el-input v-model="filterConfig[filterIndex].helpTJ"></el-input>
            </el-form-item> 
            <el-form-item label="默认值">
              <el-input v-model="filterConfig[filterIndex].defaultValue"></el-input>
            </el-form-item>
            <el-form-item label="下拉框信息">
              <el-input v-model="filterConfig[filterIndex].list"></el-input>
            </el-form-item> 
            <el-form-item label="是否只读">
              <el-select v-model="filterConfig[filterIndex].readonly" placeholder="">
                <el-option label="否" value=0></el-option>
                <el-option label="是" value=1></el-option>
              </el-select> 
            </el-form-item> 
            <el-form-item label="非必填">
              <el-select v-model="filterConfig[filterIndex].canEmpty" placeholder="">
                <el-option label="否" value=0></el-option>
                <el-option label="是" value=1></el-option>
              </el-select> 
            </el-form-item> 
          </el-collapse-item>
          </el-form>
        </el-collapse>
      </div>
    </div> 
  </div>
</template>

<script>
export default {
  props:['filterConfig'],
  data () {
    return {
      filterIndex:0,
      activeNameFilter:['filter','help']
    };
  },
  methods:{
    addFilter(){
      var filterConfig ={
        id:this.guid(),
        code:'',
        name:'',
        sort:'',
        paramType:'',
        helpId:'',
        helpBH:'',
        helpTJ:'',
        defaultValue:'',
        readonly:0,
        canEmpty:1
      }
      this.filterIndex++;
      this.filterConfig.push(filterConfig)
     
    },
    delFilter(){
      this.filterConfig.splice(this.filterIndex,1);
      this.filterIndex--;
    },
    saveFilter(){

    },
    changeIndex(index){
      this.filterIndex = index;
    }
  }

}

</script>
<style>
.filter-config-menu{
  height: 40px;
  line-height: 40px;
  border: 1px solid #E6E7EB;
  font-size: 12px;
  font-weight: normal;
}
.filter-config-menu li{
  display: inline-block;
  width: 60px;
  height: 28px;
  line-height: 28px;
  border: 1px solid #E6E7EB;
  text-align: center;
  margin-left: 5px;
}
.filter-config-menu li:hover{
  background: #109EFF;
  color: #fff;
  cursor: pointer;
}
.filter-config-content{
  width: 100%;
  display: flex;
}
.filter-config-left{
  flex: 1;
  margin:10px;
  height: 515px;
  overflow: hidden;
  box-sizing: border-box;
  border: 1px solid #E6E7EB;
}
.filter-list-title,.filter-list-item{
  display: flex;
  height: 28px;
  line-height: 28px;
  border-bottom: 1px solid #E6E7EB;
}
.filter-list-title{
  font-size: 12px;
 
}
.filter-list-item{
  font-size: 12px;
  font-weight: normal;
}
.filter-config-left .filter-code{
  flex: 0 0 100px;
  width: 100px;
  padding-left: 5px;
}
.filter-config-left .filter-name{
  flex: 1;
  padding-left: 5px;
  border-left: 1px solid #E6E7EB;
}
.filter-config-right{
  flex: 0 0 450px;
  width: 450px;
  height: 515px;
  overflow: hidden;
  margin:10px 10px 10px 0;
  padding: 0 10px;
  box-sizing: border-box;
  border: 1px solid #E6E7EB;
  border-left: 1px solid #E6E7EB;
}
.filter-config-right .el-collapse {
  border-top: none;
}
.filter-config-right .el-collapse-item__header{
  height:42px;
  line-height: 42px;
}
.filter-config-right .el-collapse-item__arrow{
  float:none;
}
.filter-config-right .el-collapse-item__content {
    margin-bottom: 0;
    padding-bottom: 0;
}
.filter-config-right .el-form-item--mini.el-form-item, .filter-config-right .el-form-item--small.el-form-item {
    margin-bottom: 5px;
}
.filter-config-right .left-obj-config .el-form-item__label{
  color: #999;
}
</style>