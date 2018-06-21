<template>
  <div class="data-define">
        <div class="left-wrapper">
            <el-row class="left-top-operate">
                <el-col :span="8" v-for="item in operate" :key="item.id">
                    <div class="grid-content">
                        <el-tag  type="info" size="medium"  draggable="true"  @dragstart.native="redrag($event,item)">{{item.name}}</el-tag>
                    </div>  
                </el-col>
            </el-row>  
            <el-form  class="left-search-form" ref="form" :model="form" size="mini">
                <el-form-item label="">
                    <el-input v-model="filterText"  placeholder="搜索"></el-input>
                </el-form-item>
                <el-form-item label="">
                    <el-select v-model="filterSelect" placeholder="请选择模块" @change.native="moduleChange">
                        <el-option v-for="item in treeData.moduleList" :label="item.Value" :value="item.Key" :key="item.Key"></el-option>
                    </el-select>
                </el-form-item>    
            </el-form>        
            <el-tree :data="treeData.data"
                :filter-node-method="filterNode"
                ref="tree2"
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
                    <li @click="insertStep">
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
                        <p class="object-title"><i class="el-icon-menu"></i>数据集</p>
                        <p class="relation-title"><i class="el-icon-menu"></i>关系</p>
                        <p class="result-title"><i class="el-icon-menu"></i>结果</p>
                        <p class="operate-title"><i class="el-icon-menu"></i>操作</p>
                    </div>
                    <div class="right-middle-data">
                        <div class="right-middle-data-item" v-for="(data,index) in dataDefineArray" :index="index" :key="data.index">
                            <div class="right-object-property"  @drop='dropObject($event,index)'  @dragover.prevent>
                                <draggable v-model="data.object" :options="{group:'people'}" @start="drag=true" @end="drag=false">
                                <el-tag type="info" class="objectTag"
                                    v-for="(tag,index2) in data.object"
                                    :key="index2"
                                    closable
                                    :id="tag.id"
                                    @close="tagClose(index2,index)">
                                   <span class="tag-content"> 
                                       <i class="tag-text">{{tag.senmaName}}</i>
                                       <i class="el-icon-setting"  @click.prevent.stop="openConfig(index,index2,'object')"></i>
                                    </span>
                                </el-tag>
                                </draggable>
                                <div class="object-content">
                                    <span class="default-text" v-if="!data.object || !data.object.length">请拖入左边字段</span>
                                </div>
                            </div>
                            <div class="right-operate-property"  @drop='dropOperate($event,index)'  @dragover.prevent>
                                <el-tag class="operateTag" type="success" v-if="data.operate.type"
                                    closable
                                    :id="data.operate.type"
                                    @click="configShow(data)"
                                   >
                                   <span class="tag-content">  
                                       <i class="tag-text">{{data.operate.name}}</i>
                                       <i class="el-icon-setting" @click.prevent.stop="openConfig(index,0,'operate')"></i>
                                    </span>
                                </el-tag>
                                <div class="operate-content" >
                                    <span class="default-text" v-if="!data.operate.type">请拖入左上方操作</span>
                                </div>
                            </div>
                            <div class="right-result-property">
                                <el-tag class="resultTag" type="" v-if="data.result"
                                    closable
                                    @click="configShow(data)"
                                   >
                                   <span class="tag-content"> 
                                       <i class="tag-text">结果属性</i>
                                       <i class="el-icon-setting" @click.prevent.stop="openConfig(index,0,'result')"></i>
                                    </span>
                                </el-tag>
                                <div class="result-content">
                                    <span class="default-text" v-if="!data.result || data.result == null">暂无结果</span>
                                </div>
                            </div> 
                            <div class="right-operate">
                                <el-button type="primary" size="mini" @click="deleteStep(index*1)">删除</el-button>
                            </div>
                            <div class="right-propterty-config"  v-drag="dragConfig" :style="configStyle" v-if="showIndex==index && configShowFlag" >
                                <div class="config-container">
                                    <p class="config-title">
                                        <i class="el-icon-menu"></i>
                                        <span>{{'属性设置'}}</span>
                                        <i class="el-icon-close close-config" @click="closeConfig"></i>
                                    </p>
                                    <property-config :data="data" 
                                    :index="index" 
                                    :conTreeIndex="conTreeIndex"
                                    :objId="objConId"
                                    :activeNameCon="activeNameCon"
                                    :dataDefineArray="dataDefineArray">
                                    </property-config>
                                </div>
                            </div>  
                        </div>
                    </div>
                </div>
            </div>
            <div class="right-bottom-wrapper">
                <el-tabs v-model="activeName2" type="card" @tab-click="cogTabClick">
                    <el-tab-pane label="报表配置" name="first0" class="collapse0">
                        <el-form ref="form" :inline="true" :model="reportInfo" label-width="80px" size="mini">
                            <el-row>
                                <el-col :span="8">
                                    <div class="grid-content">      
                                        <el-form-item label="报表编号">
                                            <el-input v-model="reportInfo.code"></el-input>
                                        </el-form-item>
                                    </div>
                                </el-col>
                                <el-col :span="8">
                                    <div class="grid-content">
                                        <el-form-item label="报表名称">
                                            <el-input v-model="reportInfo.name"></el-input>
                                        </el-form-item> 
                                    </div> 
                                </el-col>
                            </el-row>
                        </el-form> 
                    </el-tab-pane>
                    <el-tab-pane label="报表备注" name="first" class="collapse1">
                        <el-form ref="form" :inline="true" :model="reportInfo" label-width="80px" size="mini">
                            <el-row>
                                <el-col :span="8">
                                    <div class="grid-content">
                                        <el-form-item label="报表备注">
                                            <el-input v-model="reportInfo.describe"></el-input>
                                        </el-form-item> 
                                    </div>
                                </el-col>
                                <el-col :span="8">
                                        <div class="grid-content">
                                            <el-form-item label="类型">
                                                <el-select v-model="reportInfo.type" placeholder="请选择类型">
                                                    <el-option label="用户类型" value="U"></el-option>
                                                    <el-option label="系统类型" value="S"></el-option>
                                                </el-select>
                                            </el-form-item>
                                        </div>
                                    </el-col>
                            </el-row>
                        </el-form>    
                    </el-tab-pane>
                    <el-tab-pane label="结果保存设置" name="second" class="collapse2">
                        <el-form :inline="true" :model="reportInfo" label-width="80px" size="mini">
                            <el-row>
                             <el-col :span="8">
                                <div class="grid-content"> 
                                    <el-form-item label="保存标志">
                                        <el-select v-model="reportInfo.saveFlag" placeholder="请选择活动区域">
                                            <el-option label="保存" value="1"></el-option>
                                            <el-option label="不保存" value="0"></el-option>
                                        </el-select>
                                    </el-form-item>  
                                </div>
                             </el-col>
                             <el-col :span="8">
                                <div class="grid-content">
                                    <el-form-item label="保存表名">
                                        <el-input v-model="reportInfo.saveTableName"></el-input>
                                    </el-form-item>  
                                </div>
                             </el-col>
                             <el-col :span="8">
                                <div class="grid-content">
                                    <el-form-item label="保存表别名">
                                        <el-input v-model="reportInfo.saveTableAliasName"></el-input>
                                    </el-form-item>  
                                </div>
                             </el-col>
                             <el-col :span="8">
                                <div class="grid-content">
                                    <el-form-item label="删除标志">
                                        <el-select v-model="reportInfo.delFlag">                                        
                                            <el-option label="不删除" value="0" checked></el-option>
                                            <el-option label="使用删除条件删除" value="1"></el-option>
                                        </el-select>    
                                    </el-form-item>  
                                </div>
                             </el-col>
                             <el-col :span="8">
                                <div class="grid-content">
                                    <el-form-item label="删除条件">
                                        <el-input v-model="reportInfo.delCondition"></el-input>
                                    </el-form-item>  
                                </div>
                             </el-col>
                            </el-row>        
                        </el-form> 
                    </el-tab-pane>
                    <el-tab-pane label="结果输出文件" name="third" class="collapse3">
                        <el-form :inline="true" :model="reportInfo" label-width="80px" size="mini">
                            <el-row>
                                <el-col :span="8">
                                    <div class="grid-content">
                                        <el-form-item label="输出标志">
                                            <el-select v-model="reportInfo.outputFlag">
                                                <el-option label="不输出" value="0" checked></el-option>
                                                <el-option label="输出到文件" value="1"></el-option>
                                            </el-select>
                                        </el-form-item>  
                                    </div>
                                </el-col>
                                <el-col :span="8">
                                    <div class="grid-content">
                                        <el-form-item label="输出位置">
                                            <el-input v-model="reportInfo.outputLocation"></el-input>
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
import PropertyConfig from './PropertyConfig.vue'
export default {
    data() {
      return {  
        objConId:'',//语义对象     
        configData:{},//每一步对象
        filterText:'',
        filterSelect:'',
        conTreeIndex:-1,
        treeData:{},
        showIndex:-1,//属性配置显示第几步
        configShowFlag:false,//属性配置
        operate:[
            {type:1,name:'合并操作'},
            {type:2,name:'关联操作'},
            {type:3,name:'对比操作'}
        ],
        dataDefineArray:[
            {object:[{id:'1234',senmaId:'SYS_CX',senmaName:'SDH-销售纯销' },{id:'12346',senmaId:'SDHGS0005-SYS_SYJXC',senmaName:'SDH-商业进销存'}],operate:{id:'099876',type:2,name:'关联操作'},result:{}},
            {object:[{id:'12345',senmaId:'SDHGS0005-SYS_SYJXC',senmaName:'SDH-商业进销存'}],operate:{id:'798989',type:1,name:'合并操作'},result:{}}
        ],
        reportInfo:{
            id:455,
            code:'34590090',
            name:'报表123',
            describe:'销售额',
            type:'U',
            queryImmediately:'1',
            saveFlag:'1',
            saveTableName:'',
            saveTableAliasName:'',
            delFlag:'0',
            delCondition:'这是删除条件',
            outputFlag:'1',
            outputLocation:'chunchuweizhi',
            steps:[],

        },
        transferRelaion:{},
        transferObject:{}, 
        configStyle: {
            position:'fixed',
            left: 'calc(50% - 450px)',
            top: '20px',
            width:'900px',
            height: '600px',
            border: '1px solid #ccc',
            background: '#fff',
        },
        activeNames:1,
        activeName2: 'first0',
        activeNameCon:'object',
        form:{
            name: 123
        }
      }
    },
    watch: {
      filterText(val) {
        this.$refs.tree2.filter(val);
      },
      filterSelect(val) {
        this.$refs.tree2.filter(val);
      }
    },
    methods: {
        openMessage(msg){
            this.$message({
                showClose: true,
                message: msg,
                type: 'warning',
                duration:'1000'
            })
        },
        getTreeData(){
            const treeDataUrl = 'api/reportDefine/getSenmaList'
            this.$Http('get',treeDataUrl).then((res)=>{
                this.treeData = {...this.treeData,...res.data };
                console.log(res.data)
                console.log(this.treeData)
            })
        },
        openConfig(index,index2,type){
            var obj= this.dataDefineArray[index]['object'][index2];
            if(this.dataDefineArray[index]['object'].length){
                this.objConId=obj.id
                this.conTreeIndex = index2;
                this.activeNameCon = type;
                this.showIndex = index
                this.configShowFlag = true;
            }else{
                this.openMessage('数据集不能为空');
            }
        },
        closeConfig(){
            this.configShowFlag = false;
            this.showIndex =-1;
        },
        filterNode(value, data, node) {//tree过滤
            if (!value) return true;
            return data.label.indexOf(value) !== -1;
        },
        tagClose(index2,index) {//删除tag标签
            this.dataDefineArray[index]['object'].splice(index2, 1);
        },
        cogTabClick(tab, event){
           // console.log(tab, event);
        },
        redrag:function(event,operate){
            event.dataTransfer.setData("Text",operate.type+','+operate.name+',relType');
        },
        dropObject:function(event,index){
            event.preventDefault();
            var data = event.dataTransfer.getData("Text").split(',');
            var id = this.guid()
            var object={
                id:this.guid(),
                name:data[1],
                senmaId:data[0],
                senmaName:data[1],
                senmaTableName:data[2],
                checkedKeys:[],
                checkedKeyCols:[],
                checkedUnoCols:[],
                treeConData:[
                    {
                        id:data[0],
                        label:data[1],
                        name:data[1],
                        tableName:data[2],
                        children:[] 
                    }
                ],
                filter:'',
                type:0,
                fields:{}
            }
             
            if(data[3]!=='objType'){return false;} 
           
            const treeDataUrl = 'api/reportDefine/getDataSourceDataFromSenma?id='+object.senmaId
            this.$Http('get',treeDataUrl).then((res)=>{
                object.fields = res.data     
                object['treeConData'][0]['children'] = res.data

                this.dataDefineArray[index]['object'].push(object);
                console.log(object)
                //console.log(this.dataDefineArray[index]['object'][0]['treeConData'])
             })
        },
        dropOperate:function(event,index){
            event.preventDefault();
            var data = event.dataTransfer.getData("Text").split(',');
            var object = {};
            object.type = data[0];
            object.name = data[1];
            object.id = this.guid();
            if(data[2]!=='relType'){return false;} 
            this.$set(this.dataDefineArray[index],'operate',object);
        },
        handleDragStart(node, ev) {
            event.dataTransfer.setData("Text",node.data.id+','+node.data.label+','+node.data.tableName+',objType');
        },
        allowDrag(draggingNode) {
            //console.log(draggingNode)
            if(draggingNode.childNodes && draggingNode.childNodes.length) return false;
            else return true;
        },
        allowDrop(draggingNode, dropNode, type) {
            return false;
        },
        insertStep(){
            this.dataDefineArray.push({object:[],operate:0,result:{}})
        },
        deleteStep(index){
            this.dataDefineArray.splice(index,1)
        },
        guid() {
            function S4() {
            return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
            }
            return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
        },
        dragConfig(){

        }
       
    },
    created(){
        this.getTreeData();
    },
    components:{
        draggable,
        PropertyConfig:PropertyConfig
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
    height: 100%;
    box-sizing: border-box;
}
.left-top-operate{
    margin: 2px 8px;
}
.left-top-operate .grid-content{
    text-align: center;
    cursor: pointer;
}
.left-top-operate .el-tag{
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
.el-select-dropdown__item{
    height: 28px;
    line-height: 28px;
    font-size: 12px;
}
.left-wrapper .el-tree{
    overflow: auto;
    height: calc(100% - 126px);
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
.right-middle-data-item{
    display: flex;
    min-height: 38px;
    border-top: 1px solid rgb(161, 212, 230);
}
.right-middle-data-item span.default-text{
    display: inline-block;
    width: 100%;
    color: #999;
    font-size: 12px;
    font-weight: normal;
    vertical-align: top; 
    text-align: center;

}
.object-title,.right-object-property{
    flex: 1;
}
.right-object-property .object-content{
    height: 100%;
}
.right-object-property .object-content span{
    height: 20px;
    margin-top: 42px;
}
.right-middle-data-item .el-icon-setting:hover{
    color: #67c23a;
}
.right-middle-data-item .el-icon-setting{
    color: #4A6B72;
}
.relation-title,.result-title,.right-operate-property,.right-result-property{
    flex: 0 0 150px;
    width: 150px;
    border-left: 1px solid rgb(161, 212, 230);
}
.operate-title{
    flex: 0 0 80px;
    width: 80px;
    border-left: 1px solid rgb(161, 212, 230);
}
.object-title,.relation-title,.result-title,.operate-title{
    background-color: rgba(161, 212, 230, 0.3);
}
.right-operate-property,.right-result-property,.right-operate{
   position: relative;
 
}
.right-operate-property .el-tag,.right-result-property .el-tag,.right-operate .el-button{
   position: absolute;
    left: 0;
    right: 0;
   top: 0;
   bottom: 0;
   margin:auto;
}
.right-operate{
    width: 81px;
    border-left: 1px solid rgb(161, 212, 230);
    box-sizing: border-box;
}
.right-operate .el-button--mini, .el-button--mini.is-round{
    padding: 7px 13px;
}
.right-middle-data-item .el-tag{
    cursor: pointer;
    padding: 0 6px;
    height: 28px;
    line-height: 26px; 
}
.right-object-property .el-tag{
    margin-left: 5px;
    margin-top: 5px;
}
.right-object-property{
    padding-bottom: 5px;
}
.right-middle-data-item .tag-text{
    padding-right: 20px;
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
    margin-bottom:5px; 
}
.right-bottom-wrapper .el-form-item--mini .el-form-item__content {
    flex: 0.9;
}
.right-bottom-wrapper .el-select {
    width: 100%;
} 
.collapse1 .el-form-item--mini.el-form-item, .collapse1 .el-form-item--small.el-form-item,
.collapse2 .el-form-item--mini.el-form-item, .collapse2 .el-form-item--small.el-form-item,
.collapse3 .el-form-item--mini.el-form-item, .collapse3 .el-form-item--small.el-form-item{
    margin-bottom: 5px;
}
.right-propterty-config{
    position:fixed;
    left:calc(50% - 450px);
    top: 20px;
    width:900px;
    height: 600px;
    border: 1px solid #ccc;
    background: #fff;
    z-index: 3000;
}


.data-define ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
}

.data-define ::-webkit-scrollbar-track-piece {
    background-color: rgba(0, 0, 0, 0.2);
    border-radius: 8px;
}

.data-define ::-webkit-scrollbar-thumb:vertical {
    height: 8px;
    background-color: rgba(125, 125, 125, 0.7);
    border-radius: 8px;
}

.data-define ::-webkit-scrollbar-thumb:horizontal {
    width: 8px;
    background-color: rgba(125, 125, 125, 0.7);
    border-radius: 8px;
}


</style>