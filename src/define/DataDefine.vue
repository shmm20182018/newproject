<template>
  <div class="data-define">
        <div class="left-wrapper">
            <el-row class="left-top-relation">
                <el-col :span="8" v-for="item in relation" :key="item.id">
                    <div class="grid-content">
                        <el-tag size="medium"  draggable="true"  @dragstart.native="redrag($event,item)">{{item.name}}</el-tag>
                    </div>  
                </el-col>
            </el-row>  
            <el-form  class="left-search-form" ref="form" :model="form" size="mini">
                <el-form-item label="">
                    <el-input v-model="form.name" placeholder="搜索"></el-input>
                </el-form-item>
                <el-form-item label="">
                    <el-select v-model="form.region" placeholder="请选择活动区域" @change.native="moduleChange">
                        <el-option v-for="item in treeData.moduleList" :label="item.Value" :value="item.Key" :key="item.Key"></el-option>
                    </el-select>
                </el-form-item>    
            </el-form>        
            <el-tree :data="treeData.data"
                @node-drag-start="handleDragStart"
                draggable
                :allow-drop="allowDrop"
                :allow-drag="allowDrag">
            </el-tree>
        </div>
        <div class="right-wrapper">
            <div class="right-top-wrapper">
                <ul class="clear">
                    <li>
                        <i class="el-icon-document"></i>
                        <span>定义导出</span>
                    </li>
                    <li>
                        <i class="el-icon-caret-left"></i>
                        <span>撤销</span>
                    </li>
                    <li>
                        <i class="el-icon-caret-right"></i>
                        <span>还原</span>
                    </li>
                    <li>
                        <i class="el-icon-menu"></i>
                        <span>全局样式</span>
                    </li>
                    <li>
                        <i class="el-icon-view"></i>
                        <span>预览</span>
                    </li> 
                    <li>
                        <i class="el-icon-setting"></i>
                        <span>参数设置</span>
                    </li>
                    <li @click="insertDefine">
                        <i class="el-icon-circle-plus"></i>
                        <span>下一步</span>
                    </li>
                    <li>
                        <i></i>
                        <span class="el-icon-tickets">保存</span>
                    </li>                  
                </ul>       
            </div>
            <div class="right-middle-wrapper">
                <div class="right-middle-content">
                    <div class="right-middle-title">
                        <p class="object-title"><i class="el-icon-menu"></i>对象</p>
                        <p class="relation-title"><i class="el-icon-menu"></i>关系</p>
                        <p class="result-title"><i class="el-icon-menu"></i>结果</p>
                    </div>
                    <div class="right-middle-data">
                        <div class="right-middle-data-item" v-for="(data,index) in dataDefineArray" :index="index" :key="data.index">
                            <div class="right-object-property" @drop='dropObject($event,index)'  @dragover='allowObjDrag($event,index)'>
                                <draggable v-model="data.object" :obj="data.object" :options="{group:'people'}" @start="drag=true" @end="drag=false" :move="checkMove">
                                <el-tag class="objectTag"
                                    v-for="(tag,index) in data.object"
                                    :key="index"
                                    closable
                                    :id="tag.id">
                                   <span> 
                                       <i class="el-icon-circle-check-outline"></i> 
                                       <i>{{tag.label}}</i>
                                       <i class="el-icon-setting"></i>
                                    </span>
                                </el-tag>
                                </draggable>
                                <div class="object-content">
                                    <span class="default-text" v-if="!data.object || !data.object.length">请拖入左边字段</span>
                                </div>
                            </div>
                            <div class="right-relation-property"  @drop='dropRelation($event,index)'  @dragover='allowRelDrag($event,index)'>
                                <el-tag class="relationTag"
                                    closable
                                    :id="data.relation.id"
                                   >
                                   <span> 
                                       <i class="el-icon-circle-check-outline"></i> 
                                       <i>{{data.relation.name}}</i>
                                       <i class="el-icon-setting"></i>
                                    </span>
                                </el-tag>
                                <div class="relation-content" >
                                    <span class="default-text" v-if="!data.relation.id">请拖入左边字段</span>
                                </div>
                            </div>
                            <div class="right-result-property">
                                <div class="result-content">
                                    <span class="default-text" v-if="data.result || data.result == null">暂无结果</span>
                                </div>
                            </div>   
                        </div>
                    </div>
                </div>
            </div>
            <div class="right-bottom-wrapper">
                <el-tabs v-model="activeName2" type="card" @tab-click="handleClick">
                    <el-tab-pane label="报表配置" name="first0" class="collapse0">
                        <el-form ref="form" :inline="true" :model="form" label-width="80px" size="mini">
                            <el-row>
                                <el-col :span="8">
                                    <div class="grid-content">
                                        <el-form-item label="类型">
                                            <el-select v-model="form.name" placeholder="请选择类型">
                                                <el-option label="用户类型" value="U"></el-option>
                                                <el-option label="系统类型" value="S"></el-option>
                                            </el-select>
                                        </el-form-item>
                                    </div>
                                </el-col>
                                <el-col :span="8">
                                    <div class="grid-content">
                                        <el-form-item label="报表对象">
                                            <el-select v-model="form.name" placeholder="请选择活动区域">
                                                <el-option label="区域二" value="beijing"></el-option>
                                            </el-select>
                                        </el-form-item>
                                    </div>
                                </el-col>
                                <el-col :span="8">
                                    <div class="grid-content">      
                                        <el-form-item label="报表编号">
                                            <el-input v-model="form.name"></el-input>
                                        </el-form-item>
                                    </div>
                                </el-col>
                                <el-col :span="8">
                                    <div class="grid-content">
                                        <el-form-item label="报表名称">
                                            <el-input v-model="form.name"></el-input>
                                        </el-form-item> 
                                    </div> 
                                </el-col>
                            </el-row>
                        </el-form> 
                    </el-tab-pane>
                    <el-tab-pane label="报表备注" name="first" class="collapse1">
                        <el-form ref="form" :inline="true" :model="form" label-width="80px" size="mini">
                            <el-form-item label="报表备注">
                                <el-input v-model="form.name"></el-input>
                            </el-form-item> 
                        </el-form>    
                    </el-tab-pane>
                    <el-tab-pane label="结果保存设置" name="second" class="collapse2">
                        <el-form :inline="true" :model="form" label-width="80px" size="mini">
                            <el-row>
                             <el-col :span="8">
                                <div class="grid-content">
                                    <el-form-item label="保存标志">
                                        <el-select v-model="form.name" placeholder="请选择活动区域">
                                            <el-option label="保存" value="1"></el-option>
                                            <el-option label="不保存" value="0"></el-option>
                                        </el-select>
                                    </el-form-item>  
                                </div>
                             </el-col>
                             <el-col :span="8">
                                <div class="grid-content">
                                    <el-form-item label="保存表名">
                                        <el-input v-model="form.name"></el-input>
                                    </el-form-item>  
                                </div>
                             </el-col>
                             <el-col :span="8">
                                <div class="grid-content">
                                    <el-form-item label="保存表别名">
                                        <el-input v-model="form.name"></el-input>
                                    </el-form-item>  
                                </div>
                             </el-col>
                             <el-col :span="8">
                                <div class="grid-content">
                                    <el-form-item label="删除标志">
                                        <el-select v-model="form.name">                                        
                                            <el-option label="不删除" value="1" checked></el-option>
                                            <el-option label="使用删除条件删除" value="0"></el-option>
                                        </el-select>    
                                    </el-form-item>  
                                </div>
                             </el-col>
                             <el-col :span="8">
                                <div class="grid-content">
                                    <el-form-item label="删除条件">
                                        <el-input v-model="form.name"></el-input>
                                    </el-form-item>  
                                </div>
                             </el-col>
                            </el-row>        
                        </el-form> 
                    </el-tab-pane>
                    <el-tab-pane label="结果输出文件" name="third" class="collapse3">
                        <el-form :inline="true" :model="form" label-width="80px" size="mini">
                            <el-row>
                                <el-col :span="8">
                                    <div class="grid-content">
                                        <el-form-item label="输出标志">
                                            <el-select v-model="form.name">
                                                <el-option label="不输出" value="1" checked></el-option>
                                                <el-option label="输出到文件" value="0"></el-option>
                                            </el-select>
                                        </el-form-item>  
                                    </div>
                                </el-col>
                                <el-col :span="8">
                                    <div class="grid-content">
                                        <el-form-item label="输出位置">
                                            <el-input v-model="form.name"></el-input>
                                        </el-form-item>  
                                    </div>
                                </el-col>
                            </el-row>
                        </el-form>
                    </el-tab-pane>
                </el-tabs>
            </div>
        </div>
    </div>
</template>

<script>
import draggable from 'vuedraggable'
export default {
    data() {
      return {
        data:1,
        treeData:{},
        relation:[
            {id:1,name:'合并操作'},
            {id:2,name:'关联操作'},
            {id:3,name:'对比操作'}
        ],
        transferRelaion:{},
        transferObject:{},
        dataDefineArray:[
            {object:[{id:'SYS_CX',label:'SDH-销售纯销'},{id:'SDHGS0005-SYS_SYJXC',label:'SDH-商业进销存'}],relation:{id:2,name:'关联操作'},result:{}},
            {object:[{id:'SDHGS0005-SYS_SYJXC',label:'SDH-商业进销存'}],relation:{id:1,name:'合并操作'},result:{}}
            ],
        activeName2: 'first0',
        form:{
            name: 123
        }
      }
    },
    methods: {
        getTreeData(){
            const treeDataUrl = 'api/reportDefine/getSenmaList'
            this.$Http('get',treeDataUrl).then((res)=>{
                this.treeData = {...this.treeData,...res.data };
                console.log(this.treeData)
            })
        },
        handleClick(tab, event) {
            console.log(tab, event);
        },
        redrag:function(event,relation){
            event.dataTransfer.setData("Text",relation.id+','+relation.name);
        },
        dropObject:function(event,index){
            event.preventDefault();
            var data = event.dataTransfer.getData("Text").split(',');
            var object = {};
            object.id = data[0];
            object.label = data[1];
            this.dataDefineArray[index]['object'].push(object);
        },
        dropRelation:function(event,index){
            event.preventDefault();
            var data = event.dataTransfer.getData("Text").split(',');
            var object = {};
            object.id = data[0];
            object.name = data[1];
            this.$set(this.dataDefineArray[index],'relation',object);
        },
        allowObjDrag(event,index){
              if(event.target){
                  //console.log(event.target.className)           
                if(event.target.className =='right-object-property') {  event.preventDefault()}
                
            }
        },
        allowRelDrag(event,index){
            //console.log(event.toElement.className)
            if(event.toElement){
                if(event.toElement.className!=='right-relation-property') {return false;}
                else{
                    event.preventDefault();
                }
            }
        },
        handleDragStart(node, ev) {
            event.dataTransfer.setData("Text",node.data.id+','+node.data.label);
        },
        allowDrag(draggingNode) {
            return true;
        },
        allowDrop(draggingNode, dropNode, type) {
            return false;
        },
        insertDefine(){
            this.dataDefineArray.push({object:[],relation:0,result:{}})
        },
        checkMove(){
            console.log(this.dataDefineArray)
        }
    },
    created(){
        this.getTreeData();
    },
    components:{
        draggable
    }
}

</script>
<style>
.data-define{
    display: flex;
    width: 100%;
    height: 100%;
    padding: 4px;
    background: #EFF1F3;
    box-sizing: border-box;
}
.data-define p{
    margin: 0
}
.data-define label{
    font-size: 12px;
    color:#999;
}
.left-wrapper{
    flex: 0 0 16%;
    width:16%;
    margin-right: 4px;
    border: 1px solid #D6DBDB;
    background: #fff;
}
.left-top-relation{
    margin: 2px 8px;
}
.left-top-relation .grid-content{
    text-align: center;
    cursor: pointer;
}
.left-top-relation .el-tag{
    padding: 0 6px;
}
.left-search-form{
    padding: 8px;
    padding-top:4px;
}
.left-search-form .el-form-item--mini.el-form-item, .left-search-form  .el-form-item--small.el-form-item {
    margin-bottom: 10px;
}
.left-search-form .el-select {
    width: 100%;
}
.left-wrapper .el-tree-node__label {
    font-size: 12px;
}
.right-wrapper{
    flex: 1;
    position: relative;
    border: 1px solid #D6DBDB;
    background: #fff;
}
.right-top-wrapper{
    padding: 0 5px;
    border-bottom: 1px solid #D6DBDB;
    background-color: #EFF1F3;
}
.right-top-wrapper li{
    float: left;
    padding: 0 4px;
    line-height: 30px;
    height: 30px;
    font-size: 12px;
    color: #999;
    margin-left: 15px;
    cursor: pointer;
}
.right-middle-wrapper{
    position: absolute;
    top: 30px;
    bottom: 102px;
    z-index: 1000;
    width: 100%;
    min-height: 400px; 
    overflow-y: scroll;
    border-bottom: 1px solid #D6DBDB;
    padding: 8px;
    box-sizing: border-box;
    font-weight: normal;
}
.right-middle-content{
    border:1px solid rgb(161, 212, 230);
}
.right-middle-title{
    display: flex;
    color: #999;
    height: 25px;
    line-height: 25px;
    font-size:14px;
    font-weight: normal;
}
.right-middle-title i{
    display: inline-block;
    font-size: 16px;
    width: 25px;
    height: 25px;
    text-align: center;
    color: #1A8BE6;
}
.right-middle-data{
    
  
}
.right-middle-data-item{
    display: flex;
    height: 100px;
    border-top: 1px solid rgb(161, 212, 230);
}
.right-middle-data-item span.default-text{
    display: inline-block;
    width: 100%;
    color: #999;
    font-size: 14px;
    font-weight: normal;
    text-align: center;

}
.object-title,.right-object-property{
    flex: 1;
}
.relation-title,.result-title,.right-relation-property,.right-result-property{
    flex: 0 0 150px;
    width: 150px;
    border-left: 1px solid rgb(161, 212, 230);
}
.object-title,.relation-title,.result-title{
    background-color: rgba(161, 212, 230, 0.3);
}
.right-object-property{
    
}
.right-relation-property{
    
}
.right-result-property{
    
}
.right-middle-data-item .objectTag{
 
}
.right-bottom-wrapper{
    position:  absolute;
    left: 0;
    bottom: 0;
    z-index: 50;
    font-size: 18px;
    width: 100%;
    height: 102px;
}
.right-bottom-wrapper .el-tabs{
    height: 102px;
}
.right-bottom-wrapper .el-tabs__header {
    margin: 0 0 5px;
}
.right-bottom-wrapper .el-tabs__item {
    height: 28px;
    line-height: 28px;
}
.right-bottom-wrapper .el-tabs--card>.el-tabs__header .el-tabs__nav {
    border-top:none;
}
.right-bottom-wrapper .el-tabs__item {
    font-size: 12px
}
.right-bottom-wrapper .el-form-item--mini.el-form-item, .right-bottom-wrapper .collapse1 .el-form-item--small.el-form-item{
    width: 100%;
    display: flex; 
}
.right-bottom-wrapper .el-form-item--mini .el-form-item__content {
    flex: 0.9;
}
.right-bottom-wrapper .collapse1 .el-form-item--mini .el-form-item__content {
    flex: 0.25;
}
.right-bottom-wrapper .el-select {
    width: 100%;
} 
.collapse1 .el-form-item--mini.el-form-item, .collapse1 .el-form-item--small.el-form-item {
    margin-bottom: 0px;
}
.collapse2 .el-form-item--mini.el-form-item, .collapse2 .el-form-item--small.el-form-item,
.collapse3 .el-form-item--mini.el-form-item, .collapse3 .el-form-item--small.el-form-item{
    margin-bottom: 5px;
}
</style>