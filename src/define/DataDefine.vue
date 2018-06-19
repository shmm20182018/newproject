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
                    <el-input v-model="filterText"  placeholder="搜索"></el-input>
                </el-form-item>
                <el-form-item label="">
                    <el-select v-model="form.region" placeholder="请选择模块" @change.native="moduleChange">
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
                        <p class="object-title"><i class="el-icon-menu"></i>数据集</p>
                        <p class="relation-title"><i class="el-icon-menu"></i>关系</p>
                        <p class="result-title"><i class="el-icon-menu"></i>结果</p>
                    </div>
                    <div class="right-middle-data">
                        <div class="right-middle-data-item" v-for="(data,index) in dataDefineArray" :index="index" :key="data.index">
                            <div class="right-object-property"  @drop='dropObject($event,index)'  @dragover.prevent>
                                <draggable v-model="data.object" :options="{group:'people'}" @start="drag=true" @end="drag=false">
                                <el-tag class="objectTag"
                                    v-for="(tag,index2) in data.object"
                                    :key="index2"
                                    closable
                                    :id="tag.id"
                                    @close="handleClose(index2,index)">
                                    >
                                   <span class="tag-content"> 
                                       <i class="tag-text">{{tag.name}}</i>
                                       <i class="el-icon-setting"  @click.prevent.stop="openConfig(index,index2,tag)"></i>
                                    </span>
                                </el-tag>
                                </draggable>
                                <div class="object-content">
                                    <span class="default-text" v-if="!data.object || !data.object.length">请拖入左边字段</span>
                                </div>
                            </div>
                            <div class="right-relation-property"  @drop='dropRelation($event,index)'  @dragover.prevent>
                                <el-tag class="relationTag" v-if="data.relation.id"
                                    closable
                                    :id="data.relation.id"
                                    @click="configShow(data)"
                                   >
                                   <span class="tag-content">  
                                       <i class="tag-text">{{data.relation.name}}</i>
                                       <i class="el-icon-setting"></i>
                                    </span>
                                </el-tag>
                                <div class="relation-content" >
                                    <span class="default-text" v-if="!data.relation.id">请拖入左边字段</span>
                                </div>
                            </div>
                            <div class="right-result-property">
                                <el-tag class="relationTag" v-if="data.result"
                                    closable
                                    @click="configShow(data)"
                                   >
                                   <span class="tag-content"> 
                                       <i class="tag-text">结果属性</i>
                                       <i class="el-icon-setting"></i>
                                    </span>
                                </el-tag>
                                <div class="result-content">
                                    <span class="default-text" v-if="!data.result || data.result == null">暂无结果</span>
                                </div>
                            </div> 
                            <div class="right-propterty-config"  v-drag :style="configStyle" v-if="showIndex==index && configShowFlag" >
                                <div class="config-container">
                                    <p class="config-title">
                                        <i class="el-icon-menu"></i>
                                        <span>{{'属性设置'}}</span>
                                        <i class="el-icon-close close-config" @click="closeConfig"></i>
                                    </p>
                                    <div class="config-content">
                                        <el-tabs v-model="activeNameCon"  @tab-click="handleClick">
                                            <el-tab-pane label="对象属性" name="first">
                                                <div class="obj-config-wrapper">
                                                    <div class="left-obj-config">
                                                        <el-form ref="form" :model="objCon" label-width="80px" size="small">
                                                            <el-form-item label="对象列表">
                                                                <el-select v-model="objCon.id"  @change='treeObjectChange(index,objCon.id)' placeholder="">
                                                                    <el-option v-for="(obj,treeIndex) in data.object" :treeIndex="treeIndex" :key="obj.treeIndex" :label="obj.name" :value="obj.id">
                                                                    </el-option>
                                                                </el-select>
                                                            </el-form-item>    
                                                        </el-form> 
                                                         <el-tree
                                                            :data="treeConData"
                                                            show-checkbox
                                                            node-key="id"  
                                                            >
                                                        </el-tree>                                                         
                                                    </div>
                                                    <div class="right-obj-config">
                                                        <el-collapse v-model="activeNames" >
                                                            <el-form ref="form" :model="form" label-width="100px" size="small" label-position="left">
                                                            <el-collapse-item title="对象" name="1">
                                                                    <el-form-item label="语义对象名称" >
                                                                        <el-input v-model="form.name" :disabled="true"></el-input>
                                                                    </el-form-item> 
                                                                    <el-form-item label="数据结构">
                                                                        <el-input v-model="form.name" :disabled="true"></el-input>
                                                                    </el-form-item>  
                                                            </el-collapse-item>
                                                            <el-collapse-item title="参数配置" name="2" @click.stop>
                                                                <el-form-item v-show="false" label="对应参数"  class="obj-config-can">
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
                                                            <el-collapse-item title="列属性" name="4">
                                                                 <el-form-item label="是否分组主列">
                                                                    <el-switch v-model="form.delivery"></el-switch>
                                                                </el-form-item>
                                                                <el-form-item label="是否数据列">
                                                                    <el-switch v-model="form.delivery"></el-switch>
                                                                </el-form-item>
                                                                <el-form-item label="是否日期列">
                                                                    <el-switch v-model="form.delivery"></el-switch>
                                                                </el-form-item>
                                                                <el-form-item label="日期类型列">
                                                                    <el-radio-group v-model="form.resource">
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
export default {
    data() {
      return {
        treeIndex:-1,//语义对象下标
        objCon:'',//语义对象
        configData:{},//每一步对象
        filterText:'',
        treeData:{},
        treeConData:[],
        showIndex:-1,//属性配置显示第几步
        configShowFlag:false,//属性配置
        paramShowFlag:false,//参数配置
        authShowFlag:false,//权限配置
        relation:[
            {id:1,name:'合并操作'},
            {id:2,name:'关联操作'},
            {id:3,name:'对比操作'}
        ],
        dataObjInit:{
            id:'',
            name:'',
            senmaInfo:'',
            linkInfo:'',
            filter:'',
            type:0,
            fields:{}
        },
        dataDefineArray:[
            {object:[{id:'1234',senmaInfo:'SYS_CX',name:'SDH-销售纯销'},{id:'12346',senmaInfo:'SDHGS0005-SYS_SYJXC',name:'SDH-商业进销存'}],relation:{id:2,name:'关联操作'},result:{}},
            {object:[{id:'12345',senmaInfo:'SDHGS0005-SYS_SYJXC',name:'SDH-商业进销存'}],relation:{id:1,name:'合并操作'},result:{}}
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
            left: 'clac(50% - 450px)',
            top: '20px',
            width:'900px',
            height: '600px',
            border: '1px solid #ccc',
            background: '#fff',
        },
        activeNames:1,
        activeName2: 'first0',
        activeNameCon:'first',
        form:{
            name: 123
        }
      }
    },
    watch: {
      filterText(val) {
        this.$refs.tree2.filter(val);
      }
    },
    methods: {
        getTreeData(){
            const treeDataUrl = 'api/reportDefine/getSenmaList'
            this.$Http('get',treeDataUrl).then((res)=>{
                this.treeData = {...this.treeData,...res.data };
                console.log(res.data)
                console.log(this.treeData)
            })
        },
        openConfig(index,index2,objCon){
            this.objCon = objCon;
            this.treeConData = [{
                id:objCon.senmaId,
                label:objCon.senmaName,
                children:objCon.fields
            }]
            this.showIndex = index
            this.configShowFlag = true;
            
        },
        closeConfig(){
            this.configShowFlag = false;
            this.showIndex =-1;
        },
        openCan(){
            this.paramShowFlag = true;
        },
        openQuan(){
            this.authShowFlag = true;
        },
        filterNode(value, data) {
            if (!value) return true;
            return data.label.indexOf(value) !== -1;
        },
        handleClick(tab, event) {
           // console.log(tab, event);
        },
        cogTabClick(tab, event){
           // console.log(tab, event);
        },
        redrag:function(event,relation){
            event.dataTransfer.setData("Text",relation.id+','+relation.name+',relType');
        },
        dropObject:function(event,index){
            event.preventDefault();
            var data = event.dataTransfer.getData("Text").split(',');
            var id = this.guid()
            console.log(id)
            var object={
                id:id,
                name:data[1],
                senmaId:data[0],
                senmaName:data[1],
                senmaTableName:data[2],
                filter:'',
                type:0,
                fields:{}
            }

            if(data[3]!=='objType'){return false;} 
            this.objCon = object;
            this.treeConData = [{
                id:object.senmaId,
                label:object.senmaName,
                children:[]
            }]
            const treeDataUrl = 'api/reportDefine/getDataSourceDataFromSenma?id='+object.senmaId
            this.$Http('get',treeDataUrl).then((res)=>{
                object.fields = res.data
                this.dataDefineArray[index]['object'].push(object);
                var children = []
                for(let o of res.data){
                    var childNode = {}
                    childNode.id = o.id
                    childNode.label = o.label
                    children.push(childNode)
                }
                console.log(res.data)
              this.treeConData[0]['children'] = res.data;
                
            })

        },
        dropRelation:function(event,index){
            event.preventDefault();
            var data = event.dataTransfer.getData("Text").split(',');
            var object = {};
            object.id = data[0];
            object.name = data[1];
            if(data[2]!=='relType'){return false;} 
            this.$set(this.dataDefineArray[index],'relation',object);
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
        insertDefine(){
            this.dataDefineArray.push({object:[],relation:0,result:{}})
        },
        guid() {
            function S4() {
            return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
            }
            return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
        },
        handleClose(index2,index) {//删除tag标签
            
            this.dataDefineArray[index]['object'].splice(index2, 1);
        },
        treeObjectChange(index,objId){
            console.log(objId)
            var object = this.dataDefineArray[index]['object'];
            console.log(object)
            for(let o of object){
                if(o.id == objId){
                    this.objCon = o
                    console.log(o)
                    this.treeConData[0]['id']=o.senmaId
                    this.treeConData[0]['label']=o.senmaName
                    this.treeConData[0]['children']=o.fields
                    console.log(o.id,this.treeConData[0])
                    break;
                } 
            }
    
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
    overflow:auto;
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
    overflow: auto;
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
    text-align: center;
}
.right-result-property{
    text-align: center;
}
.right-middle-data-item .el-tag{
    cursor: pointer;
    padding: 0 6px;
    height: 28px;
    line-height: 26px;
    margin-left: 5px;
    margin-top: 5px;
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
    left:clac(50% - 450px);
    top: 20px;
    width:900px;
    height: 600px;
    border: 1px solid #ccc;
    background: #fff;
    z-index: 3000;
}
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
}
.obj-config-wrapper .right-obj-config{
    flex: 1;
    border-left: 1px solid #E6E7EB;
    padding: 0 10px;
}
.obj-config-wrapper .el-collapse-item__content {
    margin-bottom: 0;
    padding-bottom: 0;
}
.obj-config-wrapper .el-form-item--mini.el-form-item, .obj-config-wrapper .el-form-item--small.el-form-item {
    margin-bottom: 5px;
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