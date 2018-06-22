<template>
    <div class="config-content">
        <el-tabs v-model="activeNameTag"  @tab-click="tabClick" >
            <el-tab-pane label="对象属性" name="object">
                <div class="obj-config-wrapper">
                    <div class="left-obj-config">
                        <p class='tree-title'><i class="el-icon-check"></i>请勾选要使用的字段</p> 
                        <el-form class="object-list" ref="form"  label-width="80px" size="small">
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
                            :check-on-click-node="false"
                            node-key="id"
                            @node-click="nodeClick"
                            @check-change="checkChange"
                            ref="conTree" 
                            :default-checked-keys="data['object'][treeIndex]['checkedKeys']" >
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
                                        <el-input v-if="treeChangeFlag" v-model="data.object[treeIndex].senmaName" :disabled="true"></el-input>
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
                                    <el-input ></el-input>
                                    <i class="el-icon-setting" @click="openCan"></i>
                                </el-form-item> 
                            </el-collapse-item>
                            <el-collapse-item title="权限配置" name="3" class="obj-config-quan">
                                <el-form-item label="对应权限">
                                    <el-input ></el-input>
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
            <el-tab-pane label="操作属性" name="operate">
                <div class="ope-config-wrapper">
                    <div v-if="data.operate.type == 1" class="hebing-operate-wrapper">
                        合并操作
                    </div>
                    <div v-if="data.operate.type == 2" class="guanlian-operate-wrapper">
                        关联操作
                    </div>
                    <div v-if="data.operate.type == 3" class="duibi-operate-wrapper">
                        <el-form class="duibi-operate-form" :model="form" label-width="100px" size="small" label-position="left" >
                            <div class="duibi-form-left">
                                <el-form-item label="操作编号">
                                    <el-input v-model="data.operate.id" :disabled="true"></el-input>
                                </el-form-item>
                                <el-form-item label="操作名称">
                                    <el-input v-model="data.operate.name" :disabled="true"></el-input>
                                </el-form-item>
                                <el-form-item label="操作对象列表">
                                    <el-select v-model="objCompareId"  @change='opeSelChange(index,objCompareId)' placeholder="">
                                        <el-option v-for="(obj,selIndex) in data.object" 
                                            :selIndex="selIndex" 
                                            :key="obj.selIndex"
                                            :label="obj.senmaName" 
                                            :value="obj.id">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="已选主列列表">
                                    <el-select v-model="objCompareKey" placeholder="请选择主列">
                                        <el-option
                                            v-for="(obj,selIndex) in data.object[compSelIndex].checkedKeyCols" 
                                            :selIndex="selIndex" 
                                            :key="obj.selIndex"
                                            :label="obj.label" 
                                            :value="obj.id">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="已选数据列列表">
                                    <el-select v-model="objCompareUno" placeholder="请选择数据列">
                                        <el-option 
                                            v-for="(obj,selIndex) in data.object[compSelIndex].checkedUnoCols" 
                                            :selIndex="selIndex" 
                                            :key="obj.selIndex"
                                            :label="obj.label" 
                                            :value="obj.id">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </div>
                            <div class="duibi-form-right">
                                <el-form-item label="同期">
                                    <el-switch v-model="form.name"></el-switch>
                                </el-form-item>
                                <el-form-item label="上期">
                                    <el-switch v-model="form.name"></el-switch>
                                </el-form-item>
                                <el-form-item label="本年累计">
                                    <el-switch v-model="form.name"></el-switch>
                                </el-form-item>
                                <el-form-item label="同期累计">
                                    <el-switch v-model="form.name"></el-switch>
                                </el-form-item>
                                <el-form-item label="区间环比">
                                    <el-switch v-model="form.name"></el-switch>
                                </el-form-item>
                            </div>       
                        </el-form>
                    </div>
                </div>
            </el-tab-pane>
            <el-tab-pane label="结果属性" name="result">
                <div class="res-config-wrapper">
                </div>
            </el-tab-pane>
        </el-tabs>
    </div>                         
</template>

<script>
export default {
  props:['data','index','conTreeIndex','objId','activeNameCon','dataDefineArray'],
  data () {
    return {
        checkedNodes:[],
        treeChangeFlag:true,
        treeIndex:this.conTreeIndex,//语义对象下标
        compSelIndex:0,
        objConId:this.objId,
        objCompareId:this.data.object[0]['id'],//比较操作
        objCompareKey:'',//比较操作
        objCompareUno:'',//比较操作
        currentNode:{colInfo:{}},
        paramShowFlag:false,//参数配置
        authShowFlag:false,//权限配置
        activeNames:'1',
        activeNameTag:this.activeNameCon,
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
    nodeClick(currentNode){
        this.currentNode=currentNode
    },
    checkChange(currentNode,isChecked,isHasChecked){
        this.currentNode=currentNode
        if(isChecked){
            this.treeChangeFlag=false;
            this.$set(this.dataDefineArray[this.index]['object'][this.treeIndex],'checkedKeys',this.$refs.conTree.getCheckedKeys())
            this.checkedNodes = this.$refs.conTree.getCheckedNodes()
        }else{
            this.$set(this.currentNode,'colInfo',{})
        }
            //console.log(isChecked,this.currentNode)
    },
    tabClick(tab,event){
        console.log(this.checkedNodes)
        if(tab.index !=1){
            return false;
        }else{
            for(let node of this.checkedNodes){
                if(node.colInfo.isKeyCol){
                    this.dataDefineArray[this.index]['object'][this.treeIndex]['checkedKeyCols'].push(node)
                }
                if(node.colInfo.isUnoCol){
                    this.dataDefineArray[this.index]['object'][this.treeIndex]['checkedUnoCols'].push(node)
                }
            }
        }
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
    },
    opeSelChange(index,objCompareId){
        var object = this.dataDefineArray[index]['object'];
        for(let i in object){
            var o = object[i]
            if(o.id == objCompareId){
                this.compSelIndex = i;
                break;
            } 
        }
    }
  },
  created(){
    //console.log(this.dataDefineArray[this.index]['object'][0]['checkedKeyCols'])
    //console.log(this.activeNameTag)
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
    line-height: 25px;
    text-align: center;
    color: #1A8BE6;
    vertical-align: top;
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
.obj-config-wrapper,.ope-config-wrapper,.res-config-wrapper{
    height: 520px;
}
.obj-config-wrapper{
    width: 100%;
    display:flex;
}
.obj-config-wrapper .left-obj-config{
    flex:1;
    height: 520px;
    border-top: 1px solid #E6E7EB;
    padding-top: 5px;
    box-sizing: border-box;
}
.obj-config-wrapper .right-obj-config{
    flex: 0 0 400px;
    width: 400px;
    border: 1px solid #E6E7EB;
    padding: 0 10px;
}
.left-obj-config .tree-title{
    font-size: 12px;
    height: 28px;
    line-height: 28px;
    color: #303133;;
    padding-left: 16px;
    border-bottom: 1px solid #E6E7EB;
}
.left-obj-config .object-list{
    margin-top: 5px;
}
.left-obj-config .tree-title i{
    width: 14px;
    height: 14px;
    border: 1px solid #109EFF;
    text-align: center;
    line-height: 14px;
    margin-right: 5px;
    color: #109EFF;
}
.obj-config-wrapper .el-tree{
  margin-left: 8px;
  height: 450px;
  overflow-y: auto;
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
  color: #999;
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
.duibi-operate-wrapper{
    width: 100%;
    height: 100%;
}
.duibi-operate-wrapper .duibi-operate-form{
    display: flex;
    height: 100%;
}
.duibi-operate-wrapper .duibi-form-left{
    flex: 1;
    padding: 10px 20px;
    border-top: 1px solid #E6E7EB;
    border-right: 1px solid #E6E7EB;
    height: 100%;
}
.duibi-form-left .el-select{
    width: 100%;
}
.duibi-form-left .el-input{
    width: 75%;
}
.duibi-operate-wrapper .duibi-form-right{
    flex: 0 0 300px;
    width: 300px;
    padding: 10px 20px;
    border-top: 1px solid #E6E7EB;
    height: 100%;
}
</style>