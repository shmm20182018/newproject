<template>
    <div class="config-content">
        <el-tabs v-model="activeNameTag" @tab-click="tabClick">
            <el-tab-pane label="数据源属性" name="dataSource">
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
                            <el-collapse-item title="列属性" name="4" v-if="step.operation.type==3 && currentDataSourceTreeNode.field" >
                                    <el-form-item label="是否分组主列">
                                        <el-switch v-model="currentDataSourceTreeNode.isKeyCol" active-value="1" inactive-value="0"></el-switch>
                                    </el-form-item>
                                    <el-form-item label="是否数据列">
                                        <el-switch v-model="currentDataSourceTreeNode.isUnoCol"  active-value="1" inactive-value="0"></el-switch>
                                    </el-form-item>
                                    <el-form-item label="是否日期列">
                                        <el-switch v-model="currentDataSourceTreeNode.isDateCol" active-value="1" inactive-value="0"></el-switch>
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
                    <div v-if="step.operation.type == 1" class="hebing-operate-wrapper">
                        合并操作
                    </div>
                    <div v-if="step.operation.type == 2" class="guanlian-operate-wrapper">
                        <el-form class="guanlian-operate-form" :model="form" label-width="100px" size="small" label-position="left" >
                        <div class="guanlian-operate-content">
                            <el-form-item label="选择操作主表">
                                <el-select v-model="dsCompareId"  @change='opeSelChange(dsCompareId)' placeholder="">
                                    <el-option v-for="(ds,selIndex) in dataSourceIdList" 
                                        :selIndex="selIndex" 
                                        :key="ds.selIndex"
                                        :label="ds.senmaName" 
                                        :value="ds.id">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item class="guanlian-operate-textarea" label="对象关联关系">
                                <el-input type="textarea" v-model="step.operation.mapColFormula"></el-input>
                                <el-button @click="openAssoc" class="guanlian-operate-btn">设置关系</el-button>
                            </el-form-item>
                             <el-form-item label="链接方式">
                                <el-select v-model="step.operation.mapColText" placeholder="">
                                    <el-option  label="左连接" value="0"></el-option>
                                    <el-option  label="全连接" value="1"></el-option>
                                </el-select>
                            </el-form-item>
                        </div>
                        </el-form>
                    </div>
                    <div v-if="step.operation.type == 3" class="duibi-operate-wrapper">
                        <el-form class="duibi-operate-form" :model="form" label-width="100px" size="small" label-position="left" >
                            <div class="duibi-form-left">
                                <el-form-item label="操作对象列表">
                                    <el-select v-model="dsCompareId"  @change='opeSelChange(dsCompareId)' placeholder="">
                                        <el-option v-for="(ds,selIndex) in dataSourceIdList" 
                                            :selIndex="selIndex" 
                                            :key="ds.selIndex"
                                            :label="ds.senmaName" 
                                            :value="ds.id">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="已选主列列表">
                                    <el-select v-model="dsCompareKey" placeholder="请选择主列">
                                        <el-option
                                            v-for="(ds,selIndex) in step.operation.mainColList" 
                                            :selIndex="selIndex" 
                                            :key="ds.selIndex"
                                            :label="ds.label" 
                                            :value="ds.id">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="已选数据列列表">
                                    <el-select v-model="dsCompareUno" placeholder="请选择数据列">
                                        <el-option 
                                            v-for="(ds,selIndex) in step.operation.dataColList" 
                                            :selIndex="selIndex" 
                                            :key="ds.selIndex"
                                            :label="ds.label" 
                                            :value="ds.id">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                                <input type="text" v-model="compText">
                            </div>
                            <div class="duibi-form-right">
                                <el-form-item label="同期">
                                    <el-switch v-model="step.operation.tqFlag" active-value="1" inactive-value="0"></el-switch>
                                </el-form-item>
                                <el-form-item label="上期">
                                    <el-switch v-model="step.operation.sqFlag" active-value="1" inactive-value="0"></el-switch>
                                </el-form-item>
                                <el-form-item label="本年累计">
                                    <el-switch v-model="step.operation.bnljFlag" active-value="1" inactive-value="0"></el-switch>
                                </el-form-item>
                                <el-form-item label="同期累计">
                                    <el-switch v-model="step.operation.tqljFlag" active-value="1" inactive-value="0"></el-switch>
                                </el-form-item>
                                <el-form-item label="区间环比">
                                    <el-switch v-model="step.operation.qjhbFlag" active-value="1" inactive-value="0"></el-switch>
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
        <div v-if="paramShowFlag" v-drag="dragParamDOM" :style="canStyle" class="canshu-config-wrapper">
             <p class="config-title" id="dragParam">
                <i class="el-icon-menu"></i>
                <span>{{'参数设置'}}</span>
                <i class="el-icon-close close-config" @click="closeCan"></i>
            </p>
            <div class="canshu-config-menu">
                <ul>
                    <li @click="addParam">新增</li>
                    <li @click="delParam">删除</li>
                    <li @click="saveParam">保存</li>
                    <li @click="openParamFormula">公式处理</li>
                </ul>
            </div>
            <div class="canshu-config-content"> 
                <div class="canshu-config-table">
                    <div class="canshu-list-title">
                        <div class="canshu-select canshu-title-item"></div>
                        <div class="canshu-lbracket canshu-title-item">括号</div>
                        <div class="canshu-source canshu-title-item">操作对象</div>
                        <div class="canshu-field canshu-title-item">对象字段</div>
                        <div class="canshu-formula canshu-title-item">公式处理结果</div>
                        <div class="canshu-paramType canshu-title-item">对应参数方式</div>
                        <div class="canshu-param canshu-title-item">参数</div>
                        <div class="canshu-rbracket canshu-title-item">括号</div>
                        <div class="canshu-relation canshu-title-item">关联关系</div>
                    </div>
                    <el-form>
                    <div v-for="(paramMatch,index) in paramMatchArray" :key="index" class="canshu-list-item">
                        <div class="canshu-select canshu-data-item" @click="changeParamIndex(index)">
                            <i v-show="paramMatchIndex==index" class="el-icon-check"></i>
                        </div>  
                        <div class="canshu-lbracket canshu-data-item">
                            <el-form-item >
                                <el-select v-model="paramMatch.lbracket" placeholder="">
                                    <el-option label="(" value="0"></el-option>
                                </el-select>
                            </el-form-item>
                        </div>
                        <div class="canshu-source canshu-data-item">
                            <el-form-item >
                                <el-select v-model="paramMatch.dataSource" @change="changeParamSourceIndex(paramMatch.dataSource,index)" placeholder="">
                                    <el-option v-for="(obj,index) in step.dataSource" :key="index" :label="obj.name" :value="obj.id"></el-option>
                                </el-select>
                            </el-form-item>
                        </div>
                        <div class="canshu-field canshu-data-item">
                            <el-form-item>
                                <el-select v-model="paramMatch.field" placeholder="" @change="changeParamIndex(index)">
                                    <el-option  v-for="(obj,index) in step.dataSource[paramMatch.sourceIndex].fields" :key="index" :label="obj.label" :value="obj.id+','+obj.label"></el-option>
                                </el-select>
                            </el-form-item>
                        </div>
                        <div class="canshu-formula canshu-data-item">
                            <el-form-item>
                                <el-input  v-model="paramMatch.formula" :disabled="true"></el-input>  
                            </el-form-item>
                        </div>
                        <div class="canshu-paramType canshu-data-item">
                            <el-form-item>
                                <el-select v-model="paramMatch.paramType" placeholder="" @change="changeParamIndex(index)">
                                    <el-option v-for="(obj,index) in paramTypes" :key="index" :label="obj.name" :value="obj.value"></el-option>
                                </el-select>
                            </el-form-item>
                        </div>
                        <div class="canshu-param canshu-data-item">
                            <el-form-item>
                                <el-select v-model="paramMatch.param" placeholder="" @change="changeParamIndex(index)">
                                    <el-option  v-for="(filterParam,index) in filterParams" :key="index" :label="filterParam.code" :value="filterParam.id"></el-option>
                                </el-select>
                            </el-form-item>
                        </div>
                        <div class="canshu-rbracket canshu-data-item">
                            <el-form-item >
                                <el-select v-model="paramMatch.lbracket" placeholder="" @change="changeParamIndex(index)">
                                    <el-option label=")" value="0"></el-option>
                                </el-select>
                            </el-form-item>
                        </div>
                        <div class="canshu-relation canshu-data-item">
                            <el-form-item >
                                <el-select v-model="paramMatch.relation" placeholder="" @change="changeParamIndex(index)">
                                    <el-option label="并且" value="0"></el-option>
                                    <el-option label="或者" value="1"></el-option>
                                </el-select>
                            </el-form-item>
                        </div>
                    </div>
                    </el-form>
                </div>
            </div>
        </div>
        <div v-if="authShowFlag" v-drag="dragAuthDOM" :style="quanStyle" class="quanxian-config-wrapper">
            <p class="config-title" id="dragAuth">
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
                    <div class="quanxian-list-item" v-for="(rightMatch,index) in rightMatchArray" :key="index">
                        <div class="quanxian-select" @click="changeRightIndex(index)">
                            <i v-show="rightMatchIndex==index" class="el-icon-check"></i>
                        </div>  
                        <div class="quanxian-source">
                            <el-form-item>
                                <el-select v-model="rightMatch.dataSource" @change="changeRightSourceIndex(rightMatch.dataSource,index)" placeholder="请选择">
                                    <el-option v-for="(obj,index) in step.dataSource" :key="index" :label="obj.name" :value="obj.id"></el-option>
                                </el-select>
                            </el-form-item>
                        </div>
                        <div class="quanxian-field">
                            <el-form-item>
                                <el-select v-model="rightMatch.field" placeholder="请选择" @change="changeRightIndex(index)">
                                    <el-option v-for="(obj,index) in step.dataSource[rightMatch.sourceIndex].fields" :key="index" :label="obj.label" :value="obj.id"></el-option>
                                </el-select>
                            </el-form-item>
                        </div>
                        <div class="quanxian-type">
                            <el-form-item>
                                <el-select v-model="rightMatch.type" placeholder="请选择" @change="changeRightIndex(index)">
                                    <el-option v-for="(authItem,index) in  authList" :key="index" :label="authItem.name" :value="authItem.value"></el-option>
                                </el-select>
                            </el-form-item>
                        </div>
                    </div> 
                    </el-form> 
                </div>  
            </div>
        </div>
        <div v-if="assocShowFlag" v-drag="dragAssocDOM" class="assoc-config-wrapper">
             <p class="config-title" id="dragAssoc">
                <i class="el-icon-menu"></i>
                <span>数据源列名匹配</span>
                <i class="el-icon-close close-config" @click="closeAssoc"></i>
            </p>
            <div class="assoc-config-menu">
                <ul>
                    <li @click="addAssoc">新增</li>
                    <li @click="delAssoc">删除</li>
                    <li @click="saveAssoc">保存</li>
                </ul>
            </div>
            <div class="assoc-config-content"> 
                <div class="assoc-config-table">
                    <div class="assoc-list-title">
                        <div class="assoc-select assoc-title-item"></div>
                        <div class="assoc-ds-first assoc-title-item">对象1</div>
                        <div class="assoc-field-first assoc-title-item">对象字段1</div>
                        <div class="assoc-symbol assoc-title-item">连接符</div>
                        <div class="assoc-ds-second assoc-title-item">对象2</div>
                        <div class="assoc-field-second assoc-title-item">对象字段2</div>
                    </div>
                    <el-form>
                    <div v-for="(assocFormula,index) in assocFormulaArray" :key="index" class="assoc-list-item">
                        <div class="assoc-select assoc-data-item" @click="changeAssocIndex(index)">
                            <i v-show="assocFormulaIndex==index" class="el-icon-check"></i>
                        </div>  
                        <div class="assoc-ds-first assoc-data-item">
                            <el-form-item >
                                <el-select v-model="assocFormula.dsFirst" @change="changeAssocSourceIndex(assocFormula.dsFirst,index,'sourceIndex1','fieldFirst')" placeholder="请选择">
                                    <el-option v-for="(ds,index) in step.dataSource" :key="index" :label="ds.name" :value="ds.id+','+ds.name"></el-option>
                                </el-select>
                            </el-form-item>
                        </div>
                        <div class="assoc-field-first assoc-data-item">
                            <el-form-item >
                                <el-select v-model="assocFormula.fieldFirst" placeholder="请选择" @change="changeAssocIndex(index)">
                                    <el-option  v-for="(obj,index) in step.dataSource[assocFormula.sourceIndex1].fields" :key="index" :label="obj.label" :value="obj.id+','+obj.label"></el-option>
                                </el-select>
                            </el-form-item>
                        </div>
                        <div class="assoc-symbol assoc-data-item"  @click="changeAssocIndex(index)">
                           =
                        </div>
                        <div class="assoc-ds-second assoc-data-item">
                            <el-form-item >
                                <el-select v-model="assocFormula.dsSecond" @change="changeAssocSourceIndex(assocFormula.dsSecond,index,'sourceIndex2','fieldSecond')" placeholder="请选择">
                                    <el-option v-for="(ds,index) in step.dataSource" :key="index" :label="ds.name" :value="ds.id+','+ds.name"></el-option>
                                </el-select>
                            </el-form-item>
                        </div>
                        <div class="assoc-field-second assoc-data-item">
                            <el-form-item >
                                <el-select v-model="assocFormula.fieldSecond" placeholder="请选择" @change="changeAssocIndex(index)">
                                    <el-option  v-for="(obj,index) in step.dataSource[assocFormula.sourceIndex2].fields" :key="index" :label="obj.label" :value="obj.id+','+obj.label"></el-option>
                                </el-select>
                            </el-form-item>
                        </div>
                    </div>
                    </el-form>
                </div>
            </div>
        </div>
        <formula-config v-if="paramFormulaShowFlag"  v-drag="dragFormulaDOM" class="formula-config-wrapper"
            :formulaFieldValue = paramMatchArray[paramMatchIndex].formula
            @on-close-formula="closeParamFormula" 
            @on-save-formula="saveParamFormula">
        </formula-config>
    </div>                         
</template>

<script>
import FormulaConfig from './FormulaConfig.vue'
export default {
  props:['step','stepIndex','dataSourceIndex','activeNameCon','filterParams','rightMatchArray','paramMatchArray','assocFormulaArray'],
  data () {
    return {
        dragParamDOM:'',
        dragAuthDOM:'',
        dragFormulaDOM:'',
        dragAssocDOM:'',
        assocFormulaIndex:0,
        selectDataSourceIndex:this.dataSourceIndex, //当前选择的数据源索引
        currentDataSourceTreeNode:{},              //当前选中的数据源树节点,在created时需要根据计算属性selectDsTreeData初始
        selectDsTreeCheckedNodes:[],
        rightMatchIndex:0,
        paramMatchIndex:0,
        assocFormulaIndex:0,
        compSelIndex:0,
        dsCompareId:'',//比较操作
        dsCompareKey:'',//比较操作
        dsCompareUno:'',//比较操作
        paramShowFlag:false,//参数配置
        authShowFlag:false,//权限配置
        paramFormulaShowFlag:false,//公式配置
        assocShowFlag:false,//关系操作公式配置
        activeNames:['1','2','3','4'],
        activeNameTag:this.activeNameCon,
        authList:[
            {name:'部门权限',value:'1'},
            {name:'地区权限',value:'2'},
            {name:'事业部权限',value:'3'},
            {name:'大区权限',value:'4'},
            {name:'人员权限',value:'5'}
        ],
        paramTypes:[
            {name:'等于',value:'1'},
            {name:'不等于',value:'2'},
            {name:'大于',value:'3'},
            {name:'大于等于',value:'4'},
            {name:'小于',value:'5'},
            {name:'小于等于',value:'6'},
            {name:'包含',value:'7'},
            {name:'被包含',value:'8'}
        ],
        canStyle:{
            position:'fixed',
            left: 'calc(50% - 450px)',
            top: '50px',
            width:'900px',
            height: '500px',
            border: '1px solid #ccc',
            background: '#fff',
        },
        quanStyle:{
            position:'fixed',
            left: 'calc(50% - 350px)',
            top: '50px',
            width:'700px',
            height: '500px',
            border: '1px solid #ccc',
            background: '#fff',
        },
        form:{
            name:'123'
        }
    };
  },
  watch:{
    filterParams:{
        handler: function (newVal) { 
            console.log(newVal)
        },
        deep:true      
    },
    /*selectDsTreeCheckedNodes:{
        handler: function (newNode) { 
            this.step.operation.mainColList.length = 0
            this.step.operation.dataColList.length = 0
             for(let node of newNode){
                if(node.isKeyCol){
                    this.step.operation.mainColList.push(node)
                }
                if(node.isUnoCol){
                    this.step.operation.dataColList.push(node)
                }
            }
            console.log(this.step.operation.dataColList)
        },
        deep:true 
    }*/
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
    },
    dataSourceIdList(){
        var dataSourceIdList = []
        for(let dataSoruce of this.step['dataSource']){
            dataSourceIdList.push(dataSoruce)
        }
        this.$set(this.step.operation,'dataSourceIdList',dataSourceIdList)
        this.dsCompareId = this.step.operation.dataSourceIdList[0].id
        return dataSourceIdList
    },
    compText(){
        this.step.operation.compText = this.step.operation.tqFlag+';'+this.step.operation.sqFlag+';'+this.step.operation.bnljFlag
                +';'+this.step.operation.tqljFlag+';'+this.step.operation.qjhbFlag
                console.log(this.step.operation.compText)
        return this.step.operation.tqFlag+';'+this.step.operation.sqFlag+';'+this.step.operation.bnljFlag
                +';'+this.step.operation.tqljFlag+';'+this.step.operation.qjhbFlag
    }
  },
  methods: {
    nodeClick(currentNode){
        this.currentDataSourceTreeNode=currentNode
    },
    checkChange(currentNode,isChecked,isHasChecked){
        currentNode.useFlag = isChecked == true ? '1':'0';
        if(isChecked) this.selectDsTreeCheckedNodes = this.$refs.conTree.getCheckedNodes()
    },
    tabClick(tab,event){
       if(tab.index !=1){
            return false;
        }else{

        //console.log(this.selectDsTreeCheckedNodes)
            this.step.operation.mainColList.length = 0
            this.step.operation.dataColList.length = 0
             for(let node of this.selectDsTreeCheckedNodes){
                if(node.isKeyCol=='1'){
                    this.step.operation.mainColList.push(node)
                }
                if(node.isUnoCol =='1'){
                    this.step.operation.dataColList.push(node)
                }
            }
        }   
        
    },
    openCan(){
        this.paramShowFlag = true;
        this.$nextTick(()=>{
            this.dragParamDOM = document.getElementById('dragParam')
        })
    },
    openQuan(){
        this.authShowFlag = true;
        this.$nextTick(()=>{
            this.dragAuthDOM = document.getElementById('dragAuth')
        })
    },
    closeCan(){
        this.paramShowFlag = false;
    },
    closeQuan(){
        this.authShowFlag = false;
    },
    opeSelChange(dsCompareId){
        var object = this.step.dataSource;
        for(let i in object){
            var o = object[i]
            if(o.id == dsCompareId){
                this.compSelIndex = i;
                break;
            } 
        }
    },
    addParam(){
        if(this.paramMatchArray.length){
            this.paramMatchIndex++;
        }
        this.paramMatchArray.push({
            lbracket:'', 
            dataSource:'',
            field:'',
            formula:'',
            paramType:'',
            param:'',
            rbracket:'',
            relation:'',
            sourceIndex:0
        });
    },
    delParam(){
        if(this.paramMatchArray.length){
            this.paramMatchArray.splice(this.paramMatchIndex,1);
        }
        if(this.paramMatchIndex){
            this.paramMatchIndex--;
        }  
    },
    saveParam(){

    },
    changeParamIndex(index){
        if(this.paramMatchIndex == index){
            return false;
        }else{
            this.paramMatchIndex = index;
        }
    },
    changeParamSourceIndex(id,index){
        this.$set(this.paramMatchArray[index],'field','')
        var source = this.step['dataSource']
        for(var i in source){
            if(id == source[i]['id']){
                this.paramMatchArray[index]['sourceIndex'] = i;
                break;
            }
        }
        if(this.paramMatchIndex == index){
            return false;
        }else{
            this.paramMatchIndex = index;
        }
    },
    openParamFormula(){
        var fieldValue = this.paramMatchArray[this.paramMatchIndex]['field'].split(',')
        this.paramMatchArray[this.paramMatchIndex]['formula'] = fieldValue[1],
        this.paramFormulaShowFlag = true;
        this.$nextTick(()=>{
            this.dragFormulaDOM = document.getElementById('dragFormula')
        })  
    },
    closeParamFormula(){
        this.paramFormulaShowFlag = false;
    },
    saveParamFormula(formulaString){
        this.paramMatchArray[this.paramMatchIndex]['formula'] = formulaString
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
    },
    delAuth(){
        if(this.rightMatchArray.length){
            this.rightMatchArray.splice(this.rightMatchIndex,1);
        }
        if(this.rightMatchIndex){
            this.rightMatchIndex--;
        }  
    },
    changeRightIndex(index){
        if(this.rightMatchIndex == index){
            return false;
        }else{
            this.rightMatchIndex = index;
        }
    },
    changeRightSourceIndex(id,index){
        this.$set(this.rightMatchArray[index],'field','')
        var source = this.step['dataSource']
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
    openAssoc(){
        this.assocShowFlag = true;
        this.$nextTick(()=>{
            this.dragAssocDOM = document.getElementById('dragAssoc')
        })
    },
    closeAssoc(){
        this.assocShowFlag = false;
    },
    addAssoc(){
         if(this.assocFormulaArray.length){
            this.assocFormulaIndex++;
        }
        this.assocFormulaArray.push({
            dsFirst:'',
            fieldFirst:'',
            dsSecond:'',
            fieldSecond:'',
            sourceIndex1:0,
            sourceIndex2:0
        });
    },
    delAssoc(){
        if(this.assocFormulaArray.length){
            this.assocFormulaArray.splice(this.assocFormulaIndex,1);
        }
        if(this.assocFormulaIndex){
            this.assocFormulaIndex--;
        }  
    },
    saveAssoc(){
        this.step.operation.mapColFormula = ''
        for(let assoc of  this.assocFormulaArray){
            var dsFirst = assoc.dsFirst.split(',')
            var fieldFirst = assoc.fieldFirst.split(',')
            var fieldSecond = assoc.fieldSecond.split(',')
            var dsSecond = assoc.dsSecond.split(',')
            this.step.operation.mapColFormula += dsFirst[1] + '.[' + fieldFirst[1]+ ']=' + dsSecond[1] + '.[' + fieldSecond[1] + '],'
        }
        this.step.operation.mapColFormula = this.step.operation.mapColFormula.substring(0,this.step.operation.mapColFormula.length-1)  
        console.log(this.step.operation.mapColFormula)
    },
    changeAssocIndex(index){
        if(this.assocFormulaIndex == index){
            return false;
        }else{
            this.assocFormulaIndex = index;
        }
    },
    changeAssocSourceIndex(ds,index,sourceIndex,field){
        var id = ds.split(',')
        this.$set(this.assocFormulaArray[index],field,'')
        var source = this.step['dataSource']
        for(var i in source){
            if(id[0] == source[i]['id']){
                this.assocFormulaArray[index][sourceIndex] = i;
                break;
            }
        }
        if(this.assocFormulaIndex == index){
            return false;
        }else{
            this.assocFormulaIndex = index;
        }
    }
  },
  created(){    
     this.currentDataSourceTreeNode = this.selectDsTreeData[0];
     //this.step.operation.compText = this.compText
  },
  components:{
      FormulaConfig:FormulaConfig
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
    cursor: pointer;
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
.guanlian-operate-wrapper{
    width: 100%;
    height: 100%;
    padding: 5px;
    box-sizing: border-box;
}
.guanlian-operate-form{
    height: 500px;
    border: 1px solid #E6E7EB;
    padding: 5px;
    box-sizing: border-box;
}
.guanlian-operate-content{
    width: 70%;
}
.guanlian-operate-content .el-select{
    width: 100%;
}
.guanlian-operate-content .el-textarea__inner{
    min-height: 100px !important;
    max-height: 380px;
}
.guanlian-operate-content .el-form-item__content{
    position: static;
}
.guanlian-operate-textarea{
    position: relative;
}
.guanlian-operate-btn{
    position:absolute;
    left: 0px;
    top: 40px;
    padding: 9px 11px;
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
    width: 75%;
}
.duibi-form-left .el-input{
    width: 100%;
}
.duibi-operate-wrapper .duibi-form-right{
    flex: 0 0 300px;
    width: 300px;
    padding: 10px 20px;
    border-top: 1px solid #E6E7EB;
    height: 100%;
}
.canshu-config-wrapper,.quanxian-config-wrapper{
    z-index: 3010;
    box-shadow:gray 0 0 30px;
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
  padding: 10px 5px; 
  box-sizing: border-box;
}
.canshu-config-table{
    width: 100%;
    border:1px solid #E6E7EB;
    font-size: 12px;
    height: 380px;
    overflow: auto;
}
.canshu-list-title,.canshu-list-item{
    display: flex;
    height: 32px;
    line-height: 32px;
    border-bottom: 1px solid #E6E7EB; 
}
.canshu-list-title:hover,.canshu-data-item:hover{
  background-color: #f5f7fa;
}
.canshu-list-title{
    background-color:  #f5f7fa;
}
.canshu-title-item{
  font-size: 12px;
  padding-left: 5px;
  box-sizing: border-box;
}
.canshu-list-item{
    font-size: 12px;
    font-weight: normal;
}
.canshu-list-item:hover .el-input__inner {
    border-radius: 0;
    background: #E0F4F7;
}
.canshu-title-item,.canshu-data-item{
    border-left: 1px solid #E6E7EB;
}
.canshu-select{
    border-left:none;
    flex: 0 0 32px;
    width: 32px;
    text-align: center;
    font-size: 14px;
    color: #109EFF
}
.canshu-lbracket,.canshu-rbracket{
    flex: 0 0 60px;
    width: 60px;
    box-sizing: border-box;
}
.canshu-paramType,.canshu-relation{
    flex: 0 0 100px;
    width: 100px;
    box-sizing: border-box;
}
.canshu-source,.canshu-field,.canshu-param,.canshu-formula{
  flex:0.25;
}
.canshu-data-item .el-form-item {
  margin-bottom: 0;
}
.canshu-data-item .el-form-item__content{
    line-height: 30px;
}
.canshu-data-item .el-select{
    width: 100%;
}
.canshu-data-item .el-input{
    font-size: 12px;
}
.canshu-data-item .el-input__inner{
    height: 32px;
    line-height: 32px;
    border: none;
    padding-left: 5px;
    padding-right: 14px;
}
.canshu-formula .el-input__inner{
    padding-right: 5px;
}
.canshu-data-item .el-input__suffix{
    right: 2px;
}
.canshu-data-item .el-select .el-input .el-select__caret{
    font-size: 12px;
    width: 14px;
    opacity: 0;
}
.canshu-data-item .el-select .el-input .el-select__caret.is-reverse {
    opacity: 1;
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
    height: 380px;
    overflow: auto;
}
.quanxian-list-title,.quanxian-list-item{
    display: flex;
    height: 32px;
    line-height: 32px;
    border-bottom: 1px solid #E6E7EB; 
}
.quanxian-list-title{
    background-color: #f5f7fa
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
}
.quanxian-list-item:hover .el-input__inner {
    border-radius: 0;
    background: #E0F4F7;
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
    padding-right: 14px;
}
.quanxian-list-item .el-input__suffix{
    right: 2px;
}
.quanxian-list-item .el-select .el-input .el-select__caret{
    font-size: 12px;
    width: 14px;
    opacity: 0;
}
.quanxian-list-item .el-select .el-input .el-select__caret.is-reverse {
    opacity: 1;
}
.assoc-config-wrapper{
    position: fixed;
    width: 900px;
    height: 500px;
    left:calc(50% - 450px);
    top: 50px;
    z-index: 3020;
    box-shadow:gray 0 0 30px;
    background: #fff;
}
.assoc-config-menu{
  height: 40px;
  line-height: 40px;
  border: 1px solid #E6E7EB;
  font-size: 12px;
  font-weight: normal;
}
.assoc-config-menu li{
  display: inline-block;
  width: 60px;
  height: 28px;
  line-height: 28px;
  border: 1px solid #E6E7EB;
  text-align: center;
  margin-left: 5px;
}
.assoc-config-menu li:hover{
  background: #109EFF;
  color: #fff;
  cursor: pointer;
}
.assoc-config-content{
  width: 100%;
  padding: 10px 5px; 
  box-sizing: border-box;
}
.assoc-config-table{
    width: 100%;
    border:1px solid #E6E7EB;
    font-size: 12px;
    height: 380px;
    overflow: auto;
}
.assoc-list-title,.assoc-list-item{
    display: flex;
    height: 32px;
    line-height: 32px;
    border-bottom: 1px solid #E6E7EB; 
}
.assoc-list-title:hover,.assoc-data-item:hover{
    background-color: #f5f7fa;
}
.assoc-list-title{
    background-color:  #f5f7fa;
}
.assoc-title-item{
    font-size: 12px;
    padding-left: 5px;
    box-sizing: border-box;
}
.assoc-list-item{
    font-size: 12px;
    font-weight: normal;
}
.assoc-list-item:hover .el-input__inner,.assoc-list-item:hover .assoc-symbol{
    border-radius: 0;
    background: #E0F4F7;
}
.assoc-title-item,.assoc-data-item{
    border-left: 1px solid #E6E7EB;
}
.assoc-select{
    border-left:none;
    flex: 0 0 32px;
    width: 32px;
    text-align: center;
    font-size: 14px;
    color: #109EFF
}
.assoc-symbol{
    flex: 0 0 80px;
    width: 80px;
    text-align: center;
    font-size: 14px;
}
.assoc-ds-first,.assoc-field-first,.assoc-ds-second,.assoc-field-second{
    flex: 0.25;
}
.assoc-data-item .el-form-item {
  margin-bottom: 0;
}
.assoc-data-item .el-form-item__content{
    line-height: 30px;
}
.assoc-data-item .el-select{
    width: 100%;
}
.assoc-data-item .el-input{
    font-size: 12px;
}
.assoc-data-item .el-input__inner{
    height: 32px;
    line-height: 32px;
    border: none;
    padding-left: 5px;
    padding-right: 14px;
}
.assoc-formula .el-input__inner{
    padding-right: 5px;
}
.assoc-data-item .el-input__suffix{
    right: 2px;
}
.assoc-data-item .el-select .el-input .el-select__caret{
    font-size: 12px;
    width: 14px;
    opacity: 0;
}
.assoc-data-item .el-select .el-input .el-select__caret.is-reverse {
    opacity: 1;
}
</style>
