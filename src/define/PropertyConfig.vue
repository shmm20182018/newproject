<template>
    <div class="config-content">
      <el-tabs v-model="activeNameCon" >
          <el-tab-pane label="对象属性" name="first">
              <div class="obj-config-wrapper">
                  <div class="left-obj-config">
                      <el-form ref="form"  label-width="80px" size="small">
                          <el-form-item label="对象列表">
                              <el-select v-model="objConId"  @change='treeObjectChange(index,objConId)' placeholder="">
                                  <el-option v-for="(obj,selIndex) in data.object" :selIndex="selIndex" :key="obj.selIndex" :label="obj.senmaName" :value="obj.id">
                                  </el-option>
                              </el-select>
                          </el-form-item>    
                      </el-form> 
                        <el-tree
                          :data="treeConData"
                          show-checkbox
                          highlight-current
                          :check-on-click-node="true"
                          node-key="id"
                          @check="nodeCheck"
                          ref="conTree" 
                          :default-checked-keys="data['object'][treeIndex]['checkedKeys']" 
                          >
                      </el-tree>                                                         
                  </div>
                  <div class="right-obj-config">
                      <el-collapse v-model="activeNames" >
                          <el-form ref="form" :model="data.object[treeIndex]" label-width="100px" size="small" label-position="left">
                          <el-collapse-item title="对象" name="1">
                                  <el-form-item label="语义对象名称" >
                                    <el-input v-model="data.object[treeIndex].name"></el-input>
                                  </el-form-item> 
                                  <el-form-item label="明细字段ID">
                                    <el-input v-if="treeChangeFlag" v-model="data.object[treeIndex].senmaName"></el-input>
                                    <el-input v-if="!treeChangeFlag" v-model="currentNode.label" :disabled="true"></el-input>
                                  </el-form-item>
                                  <el-form-item label="数据结构">
                                    <el-input v-if="treeChangeFlag" v-model="data.object[treeIndex].senmaTableName" :disabled="true"></el-input>
                                    <el-input v-if="!treeChangeFlag && currentNode.field" v-model="currentNode.field" :disabled="true"></el-input> 
                                    <el-input v-if="!treeChangeFlag && currentNode.tableName" v-model="currentNode.tableName" :disabled="true"></el-input> 
                                  </el-form-item>  
                          </el-collapse-item>
                          <el-collapse-item title="参数配置" name="2">
                              <el-form-item label="对应参数"  class="obj-config-can">
                                  <el-input v-model="form.name"></el-input>
                                  <i class="el-icon-setting" @click="openCan"></i>
                              </el-form-item> 
                          </el-collapse-item>
                          <el-collapse-item title="权限配置" name="3" class="obj-config-quan">
                              <el-form-item label="对应权限">
                                  <el-input v-model="form.name"></el-input>
                                  <i class="el-icon-setting" @click="openQuan"></i>
                              </el-form-item> 
                          </el-collapse-item>
                          <el-collapse-item title="列属性" name="4" v-if="currentNode.colInfo" >
                                <el-form-item label="是否分组主列">
                                  <el-switch v-model="currentNode.colInfo.isKeyCol"></el-switch>
                              </el-form-item>
                              <el-form-item label="是否数据列">
                                  <el-switch v-model="currentNode.colInfo.isUnoCol"></el-switch>
                              </el-form-item>
                              <el-form-item label="是否日期列">
                                  <el-switch v-model="currentNode.colInfo.isDateCol"></el-switch>
                              </el-form-item>
                              <el-form-item label="日期类型列">
                                  <el-radio-group v-model="currentNode.colInfo.dateColType">
                                      <el-radio label="日期"></el-radio>
                                      <el-radio label="月份"></el-radio>
                                  </el-radio-group>
                              </el-form-item>
                          </el-collapse-item>
                          </el-form>  
                      </el-collapse>
                  </div>
              </div>
          </el-tab-pane>
          <el-tab-pane label="操作属性" name="second">
              <div class="rel-config-wrapper">
              </div>
          </el-tab-pane>
          <el-tab-pane label="结果属性" name="third">
              <div class="res-config-wrapper">
              </div>
          </el-tab-pane>
      </el-tabs>
    </div>                         
</template>

<script>
export default {
  props:['data','index','conTreeIndex','objId','dataDefineArray'],
  data () {
    return {
      treeChangeFlag:true,
      treeIndex:this.conTreeIndex,//语义对象下标
      objConId:this.objId,
      currentNode:{colInfo:{}},
      paramShowFlag:false,//参数配置
      authShowFlag:false,//权限配置
      activeNames:'1',
      activeNameCon:'first',
      treeConData:this.data['object'][this.conTreeIndex]['treeConData'],
      form:{
          name: 123
      }
    };
  },
  watch:{
    treeIndex(val){
      this.treeConData = this.data['object'][this.treeIndex]['treeConData']
    }
  },
  methods: {
    nodeCheck(checkedNode,checkedstatus){
      this.treeChangeFlag=false;
      this.currentNode=checkedNode
      // console.log(this.currentNode)
      this.$set(this.dataDefineArray[this.index]['object'][this.treeIndex],'checkedKeys',this.$refs.conTree.getCheckedKeys())
      //console.log(this.data['object'][this.treeIndex]['checkedKeys'])
    },
    openCan(){
        this.paramShowFlag = true;
    },
    openQuan(){
        this.authShowFlag = true;
    },
    treeObjectChange(index,objId){
      this.treeChangeFlag=true;
      var object = this.dataDefineArray[index]['object'];
      for(let i in object){
        var o = object[i]
        if(o.id == objId){
          this.treeIndex = i;
          break;
        } 
      }
    }
  },
  created(){
    
  }
}

</script>
<style>
.right-propterty-config .config-title{
    position: relative;
    width: 100%;
    height: 25px;
    line-height: 25px;
    font-size: 12px;
    font-weight: normal;
    color:#808080;
}
.right-propterty-config .config-title .el-icon-menu{
    font-size: 16px;
    width: 25px;
    height: 25px;
    text-align: center;
    color: #1A8BE6;
}
.right-propterty-config .config-title i.close-config{
    position: absolute;
    top: 0;
    right: 10px;
    font-size: 16px;
    width: 25px;
    height: 25px;
    line-height: 25px;
    text-align: center;
    color: #808080;
    z-index: 10;
}
.right-propterty-config .el-tabs__item {
    width: 300px;
    text-align: center;
}
.obj-config-wrapper{
    width: 100%;
    display:flex;
}
.obj-config-wrapper .left-obj-config{
    flex:0 0 500px;
    width: 500px;
    height: 520px;
    overflow-y:auto;
    border-top: 1px solid #E6E7EB;
    padding-top: 5px;
    box-sizing: border-box;
}
.obj-config-wrapper .right-obj-config{
    flex: 1;
    border: 1px solid #E6E7EB;
    padding: 0 10px;
}
.obj-config-wrapper .el-tree{
  margin-left: 8px;
}
.obj-config-wrapper .el-collapse {
  border-top: none;
}
.obj-config-wrapper .el-collapse-item__header{
  height:42px;
  line-height: 42px;
}
.obj-config-wrapper .el-collapse-item__arrow{
  float:none;
}
.obj-config-wrapper .el-collapse-item__content {
    margin-bottom: 0;
    padding-bottom: 0;
}
.obj-config-wrapper .el-form-item--mini.el-form-item, .obj-config-wrapper .el-form-item--small.el-form-item {
    margin-bottom: 5px;
}
.obj-config-wrapper .left-obj-config .el-form-item__label{
  color: #303133;
}
.obj-config-quan,.obj-config-can{
    position: relative;
}
.obj-config-quan .el-icon-setting,.obj-config-can .el-icon-setting{
    position: absolute;
    right: 5px;
    top: 0;
    font-size: 16px;
    color: #C3C5C8;
    height: 32px;
    line-height: 32px;
    width: 24px;
    text-align: center;
    cursor: pointer;
}
.obj-config-quan .el-icon-setting:hover,.obj-config-can .el-icon-setting:hover{
    color: #109EFF;
}
</style>