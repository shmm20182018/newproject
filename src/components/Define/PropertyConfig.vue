<template>
    <div class="config-content">
        <el-tabs v-model="activeNameTag"  @tab-click="tabClick" >
            <el-tab-pane label="对象属性" name="dataSource">
                <div class="obj-config-wrapper">
                    <div class="left-obj-config">
                        <p class='tree-title'><i class="el-icon-check"></i>请勾选要使用的字段</p> 
                        <el-form class="object-list" ref="form"  label-width="80px" size="small">
                            <el-form-item label="对象列表">
                                <el-select v-model="selectDataSourceIndex" placeholder="">
                                    <el-option v-for="(obj,index) in step.dataSource" :index="index" :key="index" :label="obj.senmaName" :value="index">
                                    </el-option>
                                </el-select>
                            </el-form-item>    
                        </el-form>   
                        <el-tree
                            :data="selectDsTreeData"
                            show-checkbox
                            highlight-current
                            :check-on-click-node="false"
                            node-key="id"
                            @node-click="nodeClick"
                            @check-change="checkChange"
                            ref="conTree" 
                            :default-checked-keys="selectDsTreeDefaultCheckedKeys" >
                        </el-tree>                                                         
                    </div>
                    <div class="right-obj-config">
                        <el-collapse v-model="activeNames" >
                            <el-form ref="form" :model="selectDataSource" label-width="100px" size="small" label-position="left">
                            <el-collapse-item title="对象" name="1">
                                    <el-form-item label="数据源名称" >
                                        <el-input v-model="selectDataSource.name"></el-input>
                                    </el-form-item> 
                                    <el-form-item label="语义对象名称" >
                                        <el-input v-model="currentDataSourceTreeNode.senName" :disabled="true"></el-input>
                                    </el-form-item> 
                                    <el-form-item label="数据结构">
                                        <el-input v-if="currentDataSourceTreeNode.tableName" v-model="currentDataSourceTreeNode.tableName" :disabled="true"></el-input> 
                                        <el-input v-else  v-model="currentDataSourceTreeNode.field" :disabled="true"></el-input> 
                                    </el-form-item>  
                            </el-collapse-item>
                            <el-collapse-item title="参数配置" name="2" v-show="currentDataSourceTreeNode.tableName">
                                <el-form-item label="对应参数"  class="obj-config-can">
                                    <el-input ></el-input>
                                    <i class="el-icon-setting" @click="openCan"></i>
                                </el-form-item> 
                            </el-collapse-item>
                            <el-collapse-item title="权限配置" name="3" v-show="currentDataSourceTreeNode.tableName" class="obj-config-quan">
                                <el-form-item label="对应权限">
                                    <el-input ></el-input>
                                    <i class="el-icon-setting" @click="openQuan"></i>
                                </el-form-item> 
                            </el-collapse-item>
                            <el-collapse-item title="列属性" name="4" v-if="step.operate.type==3 && currentDataSourceTreeNode.field" >
                                    <el-form-item label="是否分组主列">
                                    <el-switch v-model="currentDataSourceTreeNode.isKeyCol"></el-switch>
                                    </el-form-item>
                                    <el-form-item label="是否数据列">
                                        <el-switch v-model="currentDataSourceTreeNode.isUnoCol"></el-switch>
                                    </el-form-item>
                                    <el-form-item label="是否日期列">
                                        <el-switch v-model="currentDataSourceTreeNode.isDateCol"></el-switch>
                                    </el-form-item>
                                    <el-form-item label="日期类型列">
                                        <el-radio-group v-model="currentDataSourceTreeNode.dateColType">
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
            <el-tab-pane label="操作属性" name="operation">
                <div class="ope-config-wrapper">
                    <div v-if="step.operate.type == 1" class="hebing-operate-wrapper">
                        合并操作
                    </div>
                    <div v-if="step.operate.type == 2" class="guanlian-operate-wrapper">
                        关联操作
                    </div>
                    <div v-if="step.operate.type == 3" class="duibi-operate-wrapper">
                        <el-form class="duibi-operate-form" :model="form" label-width="100px" size="small" label-position="left" >
                            <div class="duibi-form-left">
                                <el-form-item label="操作编号">
                                    <el-input v-model="step.operate.id" :disabled="true"></el-input>
                                </el-form-item>
                                <el-form-item label="操作名称">
                                    <el-input v-model="step.operate.name" :disabled="true"></el-input>
                                </el-form-item>
                                <el-form-item label="操作对象列表">
                                    <el-select v-model="objCompareId"  @change='opeSelChange(index,objCompareId)' placeholder="">
                                        <el-option v-for="(obj,selIndex) in step.dataSource" 
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
                                            v-for="(obj,selIndex) in step.dataSource[compSelIndex].checkedKeyCols" 
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
                                            v-for="(obj,selIndex) in step.dataSource[compSelIndex].checkedUnoCols" 
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
        <div v-if="paramShowFlag" v-drag="canDrag" :style="canStyle" class="canshu-config-wrapper">
             <p class="config-title">
                <i class="el-icon-menu"></i>
                <span>{{'参数设置'}}</span>
                <i class="el-icon-close close-config" @click="closeCan"></i>
            </p>
            <div class="canshu-config-menu">
                <ul>
                    <li @click="addParam">新增</li>
                    <li @click="delParam">删除</li>
                    <li @click="delParam">保存</li>
                    <li @click="delParam">公式处理</li>
                </ul>
            </div>
            <div class="canshu-config-content">
                <div class="canshu-list-title">
                    <div class="canshu-source">括号</div>
                    <div class="canshu-source">操作对象</div>
                    <div class="filter-name">对象字段</div>
                    <div class="filter-name">公式处理结果</div>
                    <div class="filter-name">权限类型</div>
                </div>
                <div v-for="(filter,index) in paramMatchArray" :key="index" @click="changeIndex(index)" class="filter-list-item">
                    <div class="filter-source">
                        <el-form-item label="">
                            <el-select v-model="paramMatch" placeholder="">
                                <el-option v-for="(obj,index) in data.dataSource" :key="index" :label="obj.name" value="obj.id"></el-option>
                            </el-select>
                        </el-form-item>
                    </div>
                    <div class="filter-name"></div>
                    <div class="filter-name"></div>
                </div>
            </div>
        </div>
        <div v-if="authShowFlag" v-drag="quanDrag" :style="quanStyle" class="quanxian-config-wrapper">
            <p class="config-title">
                <i class="el-icon-menu"></i>
                <span>{{'权限设置'}}</span>
                <i class="el-icon-close close-config" @click="closeQuan"></i>
            </p>
            <div class="quanxian-config-menu">
                <ul>
                    <li @click="addAuth">新增</li>
                    <li @click="delAuth">删除</li>
                    <li @click="authCompelete">设置完毕</li>
                </ul>
            </div>
            <div class="quanxian-config-content">
                <div class="quanxian-list-table">
                    <div class="quanxian-list-title">
                        <div class="quanxian-select"></div>
                        <div class="quanxian-source">操作对象</div>
                        <div class="quanxian-field">操作字段</div>
                        <div class="quanxian-type">权限类型</div>
                    </div>
                    <el-form>
                    <div class="quanxian-list-item"
                        v-for="(rightMatch,index) in rightMatchArray" 
                        :key="index"
                        >
                        <div class="quanxian-select" @click="changerightMatchIndex(index)">
                            <i v-show="rightMatchIndex==index" class="el-icon-check"></i>
                        </div>  
                        <div class="quanxian-source">
                            <el-form-item>
                                <el-select v-model="rightMatch.dataSource" @change="changeSourceIndex(rightMatch.dataSource,index)" placeholder="">
                                    <el-option v-for="(obj,index) in data.dataSource" :key="index" :label="obj.name" :value="obj.id"></el-option>
                                </el-select>
                            </el-form-item>
                        </div>
                        <div class="quanxian-field">
                            <el-form-item>
                                <el-select v-model="rightMatch.field" placeholder="" @change="changerightMatchIndex(index)">
                                    <el-option v-for="(obj,index) in data.dataSource[rightMatch.sourceIndex].fields" :key="index" :label="obj.label" :value="obj.id"></el-option>
                                </el-select>
                            </el-form-item>
                        </div>
                        <div class="quanxian-type">
                            <el-form-item>
                                <el-select v-model="rightMatch.type" placeholder="" @change="changerightMatchIndex(index)">
                                    <el-option v-for="(authItem,index) in  authList" :key="index" :label="authItem.name" :value="authItem.value"></el-option>
                                </el-select>
                            </el-form-item>
                        </div>
                    </div> 
                    </el-form> 
                </div>  
            </div>
        </div>
    </div>                         
</template>

<script>
export default {
  props:['step','stepIndex','dataSourceIndex','activeNameCon'],
  data () {
    return {
        selectDataSourceIndex:this.dataSourceIndex,          //当前选择的数据源索引
        currentDataSourceTreeNode:{},                        //当前选中的数据源树节点,在created时需要根据计算属性selectDsTreeData初始

        compSelIndex:0,
        objCompareId:this.step.dataSource[0].id,//比较操作
        objCompareKey:'',//比较操作
        objCompareUno:'',//比较操作

        paramShowFlag:false,//参数配置
        authShowFlag:false,//权限配置
        activeNames:['1','2','3','4'],
        activeNameTag:this.activeNameCon,
    };
  },
  computed:{
    selectDataSource(){
        return  this.step.dataSource[this.selectDataSourceIndex];
    },
    selectDsTreeData(){
        var parentNode = {
             id:this.selectDataSource.senmaId,
             label:this.selectDataSource.name,
             name:this.selectDataSource.name,
             senName:this.selectDataSource.senmaName,
             tableName:this.selectDataSource.senmaTableName,
             children:this.selectDataSource.fields
        }
        return [parentNode];
    },
    selectDsTreeDefaultCheckedKeys(){
        var fields =  this.selectDataSource.fields;
        var checkedKeys = [];

        var findCheckdKeys = function(fields){
            fields.forEach(function(field){
                if(field.useFlag=='1'){
                   checkedKeys.push(field.id);
                }
                else if(field.hasChild){
                    findCheckdKeys(field.children);
                }
            });          
        }
        findCheckdKeys(fields);
        return checkedKeys;
    }
  },
  methods: {
    nodeClick(currentNode){
        this.currentDataSourceTreeNode=currentNode
    },
    checkChange(currentNode,isChecked,isHasChecked){
        this.currentDataSourceTreeNode=currentNode
        this.$refs.conTree.setCurrentKey(currentNode.id);
        currentNode.useFlag = isChecked == true ? '1':'0';
    },
    openCan(){
        this.paramShowFlag = true;
    },
    openQuan(){
        this.authShowFlag = true;
    },
    opeSelChange(index,objCompareId){
        var object = this.step[index].dataSource;
        for(let i in object){
            var o = object[i]
            if(o.id == objCompareId){
                this.compSelIndex = i;
                break;
            } 
        }
    },
    addParam(){

    },
    delParam(){

    },
    addAuth(){
        if(this.rightMatchArray.length){
            this.rightMatchIndex++;
        }
        this.rightMatchArray.push({
            dataSource:'',
            field:'',
            type:'',
            sourceIndex:'0'
        });
        console.log(this.rightMatchIndex)
    },
    delAuth(){
        if(this.rightMatchArray.length){
            this.rightMatchArray.splice(this.rightMatchIndex,1);
        }
        if(this.rightMatchIndex){
            this.rightMatchIndex--;
        }  
        console.log(this.rightMatchIndex)
    },
    changerightMatchIndex(index){
        if(this.rightMatchIndex == index){
            return false;
        }else{
            this.rightMatchIndex = index;
        }
       
        console.log(this.rightMatchIndex)
    },
    changeSourceIndex(id,index){
        this.$set(this.rightMatchArray[index],'field','')
        var source = this.data['dataSource']
        for(var i in source){
            if(id == source[i]['id']){
                this.rightMatchArray[index]['sourceIndex'] = i;
                break;
            }
        }
        if(this.rightMatchIndex == index){
            return false;
        }else{
            this.rightMatchIndex = index;
        }
    },
    authCompelete(){

    },
    canDrag(){},
    quanDrag(){}
  },
  created(){    
     this.currentDataSourceTreeNode = this.selectDsTreeData[0];
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
.canshu-config-wrapper,.quanxian-config-wrapper{
    position:fixed;
    left:calc(50% - 350px);
    top: 50px;
    width:700px;
    height: 500px;
    border: 1px solid #ccc;
    background: #fff;
    z-index: 3010;
}
.canshu-config-menu{
  height: 40px;
  line-height: 40px;
  border: 1px solid #E6E7EB;
  font-size: 12px;
  font-weight: normal;
}
.canshu-config-menu li{
  display: inline-block;
  width: 60px;
  height: 28px;
  line-height: 28px;
  border: 1px solid #E6E7EB;
  text-align: center;
  margin-left: 5px;
}
.canshu-config-menu li:hover{
  background: #109EFF;
  color: #fff;
  cursor: pointer;
}
.canshu-config-content{
  width: 100%;
}
.quanxian-config-menu{
  height: 40px;
  line-height: 40px;
  border: 1px solid #E6E7EB;
  font-size: 12px;
  font-weight: normal;
}
.quanxian-config-menu li{
  display: inline-block;
  width: 60px;
  height: 28px;
  line-height: 28px;
  border: 1px solid #E6E7EB;
  text-align: center;
  margin-left: 5px;
}
.quanxian-config-menu li:hover{
  background: #109EFF;
  color: #fff;
  cursor: pointer;
}
.quanxian-config-content{
  width: 100%;
  padding:10px 5px;
  box-sizing: border-box;
  overflow-y: auto;
}
.quanxian-list-table{
    width: 100%;
    box-sizing: border-box;
    border: 1px solid #E6E7EB;
}
.quanxian-list-title,.quanxian-list-item{
    display: flex;
  height: 32px;
  line-height: 32px;

}
.quanxian-list-title .quanxian-source,
.quanxian-list-title .quanxian-field,
.quanxian-list-title .quanxian-type{
  font-size: 12px;
  padding-left: 5px;
  box-sizing: border-box;
}
.quanxian-list-item{
  font-size: 12px;
  font-weight: normal;
    border-top: 1px solid #E6E7EB; 
}
.quanxian-list-title:hover,.quanxian-list-item:hover{
  background-color: #f5f7fa;
}
.quanxian-select{
    flex: 0 0 32px;
    width: 32px;
    text-align: center;
    font-size: 14px;
    color: #109EFF
}
.quanxian-source,.quanxian-field,.quanxian-type{
    border-left: 1px solid #E6E7EB;
}
.quanxian-source{
  flex:0.5;
}
.quanxian-field{
  flex:0.5;
}
.quanxian-type{
   flex: 0 0 150px;
   width: 150px;
  box-sizing: border-box;
}
.quanxian-list-item .el-form-item {
  margin-bottom: 0;
}
.quanxian-list-item .el-form-item__content{
    line-height: 30px;
}
.quanxian-list-item .el-select{
    width: 100%;
}
.quanxian-list-item .el-input{
    font-size: 12px;
}
.quanxian-list-item .el-input__inner{
    height: 32px;
    line-height: 32px;
    border: none;
    padding-left: 5px;
}
</style>