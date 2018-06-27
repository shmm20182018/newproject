<<<<<<< HEAD:src/define/PropertyConfig.vue
<template>
    <div class="config-content">
        <el-tabs v-model="activeNameTag" >
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
                            <el-collapse-item title="列属性" name="4" v-if="step.operation.type==3 && currentDataSourceTreeNode.field" >
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
                    <div v-if="step.operation.type == 1" class="hebing-operate-wrapper">
                        合并操作
                    </div>
                    <div v-if="step.operation.type == 2" class="guanlian-operate-wrapper">
                        关联操作
                    </div>
                    <div v-if="step.operation.type == 3" class="duibi-operate-wrapper">
                        <el-form class="duibi-operate-form" :model="form" label-width="100px" size="small" label-position="left" >
                            <div class="duibi-form-left">
                                <el-form-item label="操作编号">
                                    <el-input v-model="step.operation.id" :disabled="true"></el-input>
                                </el-form-item>
                                <el-form-item label="操作名称">
                                    <el-input v-model="step.operation.name" :disabled="true"></el-input>
                                </el-form-item>
                                <el-form-item label="操作对象列表">
                                    <el-select v-model="objCompareId"  @change='opeSelChange(objCompareId)' placeholder="">
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
                    <li @click="saveParam">保存</li>
                    <li @click="openFormula">公式处理</li>
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
                                    <el-option :ref="'paramField'+index" v-for="(obj,index) in step.dataSource[paramMatch.sourceIndex].fields" :key="index" :label="obj.label" :value="obj.id+','+obj.label"></el-option>
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
                                    <el-option  :label="filterParams.code" :value="filterParams.id"></el-option>
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
                    <div class="quanxian-list-item" v-for="(rightMatch,index) in rightMatchArray" :key="index">
                        <div class="quanxian-select" @click="changeRightIndex(index)">
                            <i v-show="rightMatchIndex==index" class="el-icon-check"></i>
                        </div>  
                        <div class="quanxian-source">
                            <el-form-item>
                                <el-select v-model="rightMatch.dataSource" @change="changeRightSourceIndex(rightMatch.dataSource,index)" placeholder="">
                                    <el-option v-for="(obj,index) in step.dataSource" :key="index" :label="obj.name" :value="obj.id"></el-option>
                                </el-select>
                            </el-form-item>
                        </div>
                        <div class="quanxian-field">
                            <el-form-item>
                                <el-select v-model="rightMatch.field" placeholder="" @change="changeRightIndex(index)">
                                    <el-option v-for="(obj,index) in step.dataSource[rightMatch.sourceIndex].fields" :key="index" :label="obj.label" :value="obj.id"></el-option>
                                </el-select>
                            </el-form-item>
                        </div>
                        <div class="quanxian-type">
                            <el-form-item>
                                <el-select v-model="rightMatch.type" placeholder="" @change="changeRightIndex(index)">
                                    <el-option v-for="(authItem,index) in  authList" :key="index" :label="authItem.name" :value="authItem.value"></el-option>
                                </el-select>
                            </el-form-item>
                        </div>
                    </div> 
                    </el-form> 
                </div>  
            </div>
        </div>
        <div v-if="formulaShowFlag" class="formula-config-wrapper">
            <p class="config-title">
                <i class="el-icon-menu"></i>
                <span>公式设置</span>
                <i class="el-icon-close close-config" @click="closeFormula"></i>
            </p>
             <div class="quanxian-config-menu">
                <ul>
                    <li @click="saveFormula">保存</li>
                </ul>
            </div>
            <div class="formula-config-content">
                <div class="formula-config-inner">
                    <div class="formula-string-wrapper">
                        <el-form>
                            <el-form-item>
                                <el-input type="textarea" v-model="formulaString"></el-input>  
                            </el-form-item>
                        </el-form>    
                    </div>
                    <div class="formula-string-list">
                        <div class="formula-type-list">
                            <ul>
                                <li v-for="(formula,index) in formulaArray" :key="index" @click="changeFormulaTypeIndex(index)">
                                    <i class="formula-list-icon" :class="formulaTypeIndex==index?'formula-list-icon-active':''"></i>{{formula.type}}
                                </li>
                            </ul>
                        </div>
                        <div class="formula-item-list">
                            <ul>
                                <li v-for="(formula,index) in formulaArray[formulaTypeIndex]['typeList']" @click.stop="changeFormulaValueIndex(index)" @dblclick.stop="changeFormulaExpression(index)" :key="index">
                                    <i class="formula-list-icon" :class="formulaValueIndex==index?'formula-list-icon-active':''"></i>{{formula.value}}
                                </li>
                            </ul>
                        </div>
                        <div class="formula-item-desc">{{formulaDesc}}</div>
                    </div>
                </div>
            </div>
        </div>
    </div>                         
</template>

<script>
export default {
  props:['step','stepIndex','dataSourceIndex','activeNameCon','filterParams','rightMatchArray','paramMatchArray'],
  data () {
    return {
        selectDataSourceIndex:this.dataSourceIndex, //当前选择的数据源索引
        currentDataSourceTreeNode:{},              //当前选中的数据源树节点,在created时需要根据计算属性selectDsTreeData初始
        rightMatchIndex:0,
        paramMatchIndex:0,
        formulaTypeIndex:0,
        formulaValueIndex:0,
        paramFieldValue:'',
        formulaString:'',//公式结果
        compSelIndex:0,
        objCompareId:this.step.dataSource[0].id,//比较操作
        objCompareKey:'',//比较操作
        objCompareUno:'',//比较操作
        paramShowFlag:false,//参数配置
        authShowFlag:false,//权限配置
        formulaShowFlag:false,//公式配置
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
        formulaArray:[
            {id:'1',type:'简单操作',typeList:[
                {id:1,value:'加',expression:'+',desc:'对选择的列进行加法处理'},
                {id:2,value:'减',expression:'-',desc:'对选择的列进行减法处理'},
                {id:3,value:'乘',expression:'*',desc:'对选择的列进行乘法处理'},
                {id:4,value:'除',expression:'/',desc:'对选择的列进行除法处理'}
            ]},
            {id:'2',type:'复杂操作',typeList:[
                {id:5,value:'求和',expression:'SUM()',desc:'对选择的列进行求和处理'},
                {id:6,value:'最大',expression:'MAX()',desc:'对选择的列进行最大值处理'},
                {id:7,value:'最小',expression:'MIN()',desc:'对选择的列进行最小值处理'},
                {id:8,value:'平均',expression:'AVG()',desc:'对选择的列进行平均值处理'},
                {id:9,value:'取年月',expression:'left(,6)',desc:'取字段的前六位'},
                {id:10,value:'取年度',expression:'left(,4)',desc:'取字段的前四位'}
            ]}
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
      }
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
    formulaDesc(){
        console.log(this.formulaValueIndex)
        return this.formulaArray[this.formulaTypeIndex]['typeList'][this.formulaValueIndex]['desc']
    },
    formulaIconActiveStyle(){

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
    closeCan(){
        this.paramShowFlag = false;
    },
    closeQuan(){
        this.authShowFlag = false;
    },
    opeSelChange(objCompareId){
        var object = this.step[this.stepIndex].dataSource;
        for(let i in object){
            var o = object[i]
            if(o.id == objCompareId){
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
    saveFormula(){

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
    openFormula(){
        this.formulaShowFlag = true;
        console.log(this.paramMatchIndex)
        //console.log()
        var fieldValue = this.paramMatchArray[this.paramMatchIndex]['field'].split(',')
        this.paramMatchArray[this.paramMatchIndex]['formula'] = fieldValue[1],
        this.formulaString = fieldValue[1]
    },
    closeFormula(){
        this.formulaShowFlag = false;
    },
    changeFormulaTypeIndex(index){
        this.formulaTypeIndex = index;
        this.formulaValueIndex = 0;
    },
    changeFormulaValueIndex(index){
        this.formulaValueIndex = index; 
    },
    changeFormulaExpression(index){
        this.formulaValueIndex = index; 
        var expression = this.formulaArray[this.formulaTypeIndex]['typeList'][index]['expression']
        if(index){
            var leftExpression = expression.substring(0,expression.length-1)
        }else{
            var leftExpression = ''
        }
        var rightExpression = expression.substring(expression.length-1)
        this.formulaString = leftExpression + this.formulaString + rightExpression;
        this.paramMatchArray[this.paramMatchIndex]['formula'] = this.formulaString;
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
    left:calc(50% - 450px);
    top: 50px;
    width:900px;
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
  padding: 10px 5px; 
  box-sizing: border-box;
}
.canshu-config-table{
    width: 100%;
    border:1px solid #E6E7EB;
    font-size: 12px;
}
.canshu-list-title,.canshu-list-item{
    display: flex;
    height: 32px;
    line-height: 32px;

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
    border-top: 1px solid #E6E7EB; 
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
}
.quanxian-list-title,.quanxian-list-item{
    display: flex;
    height: 32px;
    line-height: 32px;
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
.formula-config-wrapper{
    position:fixed;
    left:calc(50% - 350px);
    top: 50px;
    width:700px;
    height: 500px;
    border: 1px solid #ccc;
    background: #fff;
    z-index: 3020;
}
.formula-config-content{
    width: 100%;
    box-sizing: border-box;
    padding: 10px 5px;
}
.formula-config-inner{
    border: 1px solid #E6E7EB;
    height: 415px;
}
.formula-string-wrapper{
    height: 150px;
    border-bottom: 1px solid #E6E7EB;
    padding: 5px;
    box-sizing: border-box;
}
.formula-string-wrapper .el-textarea__inner{
    min-height: 138px !important;
}
.formula-string-list{
    display: flex;
    height: 265px;
}
.formula-type-list,.formula-item-list,.formula-item-desc{
    font-size: 12px;
    padding: 10px;
}
.formula-string-list li{
    height: 30px;
    line-height: 30px;
    padding-left: 5px;
    box-sizing: border-box;
    margin-bottom: 5px;
    width: 100%;
    background-color: #E1F3F7;
    color: #666;
}
.formula-list-icon{
    display: inline-block;
    vertical-align:top;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    border: 1px solid #C7C7C1;
    background-color: #fff;
    box-sizing: border-box;
    margin-top: 10px;
    margin-right: 8px;
}
.formula-list-icon-active{
    border: 4px solid #00A0E3;
}
.formula-type-list{
    flex: 0 0 200px;
    width: 200px;
}
.formula-item-list{
    flex: 0 0 200px;
    width: 200px;
    border-left: 1px solid #E6E7EB;
}
.formula-item-desc{
    flex: 1;
    border-left: 1px solid #E6E7EB;
}
</style>
=======
<template>
    <div class="config-content">
        <el-tabs v-model="activeNameTag" >
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
                            <el-collapse-item title="列属性" name="4" v-if="step.operation.type==3 && currentDataSourceTreeNode.field" >
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
                    <div v-if="step.operation.type == 1" class="hebing-operation-wrapper">
                        合并操作
                    </div>
                    <div v-if="step.operation.type == 2" class="guanlian-operation-wrapper">
                        关联操作
                    </div>
                    <div v-if="step.operation.type == 3" class="duibi-operation-wrapper">
                        <el-form class="duibi-operation-form" :model="form" label-width="100px" size="small" label-position="left" >
                            <div class="duibi-form-left">
                                <el-form-item label="操作编号">
                                    <el-input v-model="step.operation.id" :disabled="true"></el-input>
                                </el-form-item>
                                <el-form-item label="操作名称">
                                    <el-input v-model="step.operation.name" :disabled="true"></el-input>
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
.duibi-operation-wrapper{
    width: 100%;
    height: 100%;
}
.duibi-operation-wrapper .duibi-operation-form{
    display: flex;
    height: 100%;
}
.duibi-operation-wrapper .duibi-form-left{
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
.duibi-operation-wrapper .duibi-form-right{
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
>>>>>>> 97675e524ac4a5b5f345fdc5aa3c25b76faa248d:src/components/Define/PropertyConfig.vue
