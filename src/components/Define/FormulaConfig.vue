<template>
  <div>
    <p class="config-title" id="dragFormula">
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
</template>

<script>
export default {
  props:['formulaFieldValue'],
  data () {
    return {
      formulaTypeIndex:0,
      formulaValueIndex:0,
      formulaString:this.formulaFieldValue,//公式结果
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
      ]
    }
  },
  computed: {
    formulaDesc(){
      //console.log(this.formulaValueIndex)
      return this.formulaArray[this.formulaTypeIndex]['typeList'][this.formulaValueIndex]['desc']
    },
  },
  methods: {
    closeFormula(){
      this.$emit('on-close-formula')
    },
    saveFormula(){
      this.$emit('on-save-formula',this.formulaString)
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
        if(this.formulaTypeIndex){
            var leftExpression = expression.substring(0,expression.length-1)
        }else{
            var leftExpression = ''
        }
        var rightExpression = expression.substring(expression.length-1)
        this.formulaString = leftExpression + this.formulaString + rightExpression;
    }
  }
}

</script>
<style>
.formula-config-wrapper{
    position:fixed;
    left:calc(50% - 350px);
    top: 50px;
    width:700px;
    height: 500px;
    border: 1px solid #ccc;
    background: #fff;
    z-index: 3020;
    box-shadow:gray 0 0 30px;
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
    max-height: 138px;
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
    cursor: pointer;
    border: 1px solid #ccc; 
}
.formula-string-list li:hover{
    box-shadow: 2px 2px 6px #198AE4;
    border: none; 
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