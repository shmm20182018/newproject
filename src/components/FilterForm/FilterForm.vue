<template>
  <div>
    <el-form :class="colorSeries" :show-message="false" label-position="left" label-width="80px" :model="ruleForm" :inline="true" :rules="rules"  ref="ruleForm"  class="demo-ruleForm" size="mini">
      <el-row :gutter="20">
        <component :toolSize="toolSize" @on-result-change="onResultChange" :ruleForm.sync="ruleForm"  v-for="(item,index) in paramsInfo" :is="item.componentName" :item="item" :index="index"  :key="item.id"></component>
        <el-col :span="6">
          <div class="grid-content">
            <el-form-item class="filtertool-btn">
              <el-button type="primary" @click="subForm('ruleForm')">查询</el-button>
            </el-form-item>
          </div>
        </el-col>
      </el-row>
   </el-form>
  </div>
</template>
<script>
import NProgress from 'nprogress'
import texttool from '@/components/filtertools/texttool.vue'
import selecttool from '@/components/filtertools/selecttool.vue'
import daterangetool from '@/components/filtertools/daterangetool.vue'
import yeartool from '@/components/filtertools/yeartool.vue'
import monthtool from '@/components/filtertools/monthtool.vue'
import datetool from '@/components/filtertools/datetool.vue'
import helptool from '@/components/filtertools/helptool.vue'
export default {
  props:{
    routeParams:{
      type:Object
    },
    paramsInfo:{
      type:Array
    }
  },
  data() {
    return {
      colorSeries:'wathet-style',
      tableType:-1,
      ruleForm: {},
      submitForm:{},//提交日期格式化
      rules: {},
      resData:{},
      toolSize:6,//过滤组件占得格数
    };
  },
  methods: {
    warnOpen(val) {
      this.$notify.error({
        title: '错误',
        message: val
      })
    },
    getQueryParam(){
      if(this.paramsInfo){
        /*if(!this.resTableInit.isChart){
          this.tableType = this.resTableInit.tableType
          if(this.tableType == 0){
            this.colorSeries = 'green-style'
          }
        }*/
       // this.items = this.paramsInfo.queryParams;
        //console.log(this.paramsInfo.queryParams)
        //console.log(this.items)
         
      }
    },
    subForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let newSubmitParams=Object.assign({}, this.submitForm);
          this.bus.$emit('filter-submit',newSubmitParams)
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields(); 
      //console.log(this.ruleForm) 
    },
    createRules(){
      if(this.paramsInfo){
        this.paramsInfo.forEach(item => {
          this.ruleForm[item.id] = item.defaultValue;
          switch (item.componentName){
            case 'texttool':
              this.rules[item.id] = [{required: item.mandatory, trigger: '' }]
              break;
            case 'selecttool':
              this.rules[item.id] = [{required: item.mandatory, message: '', trigger: '' }]
              break;
            case 'daterangetool':
              this.rules[item.id] = [{required: item.mandatory, message: '', trigger: '' }]
              break;
            case 'yeartool':
              this.rules[item.id] = [{required: item.mandatory, message: '查询年份不能为空', trigger: '' }]
              break;
            case 'monthtool':
              this.rules[item.id] = [{required: item.mandatory, message: '查询不能为空', trigger: '' }]
              break;  
            case 'datetool':
              this.rules[item.id] = [{required: item.mandatory, message: '查询日期不能为空', trigger: '' }]
              break;
            case 'helptool':
              this.rules[item.id] = [{required: item.mandatory, message: '帮助关键字不能为空', trigger: '' }]
              break;
          }
        });
      }
      this.submitForm = this.ruleForm
      //console.log(this.ruleForm);
      //console.log(this.rules);
    },
    onResultChange(val){
      this.$refs['ruleForm'].validateField(val); //父组件更新后再次验证;   
    }
  },
  watch:{
    paramsInfo:{
      handler(newValue, oldValue) { 
        this.createRules();
        //console.log(newValue)    
　　　},  
　　　deep: true 
    }
  },
  created(){
    var screenWidth = document.body.clientWidth * 1//窗口的大小
    //console.log(screenWidth)
    if(screenWidth < 1200 && screenWidth > 768){
      this.toolSize = 12
    }else if(screenWidth <= 768){
      this.toolSize = 24
    }
    //this.$set(this.resTableInit,'title','rrr   
  },
  components: {
    'texttool':texttool,
    'selecttool':selecttool,
    'daterangetool':daterangetool,
    'yeartool':yeartool,
    'monthtool':monthtool,
    'datetool':datetool,
    'helptool':helptool
  }
}
</script>
<style>
  .el-form-item__label{
    font-size: 12px
  }
  .el-date-editor.el-input, .el-date-editor.el-input__inner {
    width: 100%;
  }
  .el-form-item--mini.el-form-item, .el-form-item--small.el-form-item{
    display: flex;
    width: 100%;
  }
  .el-form-item__content{
    flex: 0.95;
  }
  .el-form--inline .el-form-item__label {
    flex: 0 0 80px;
  }
  .el-select{
    width: 100%;
  }
 .el-form-item--mini.el-form-item, .el-form-item--small.el-form-item {
    margin-bottom: 8px;
 }
  .green-style .el-form-item.is-success .el-input__inner,  .green-style .el-form-item.is-success .el-input__inner:focus, .green-style .el-form-item.is-success .el-textarea__inner,  .green-style .el-form-item.is-success .el-textarea__inner:focus {
    border-color: #03A656;
  }
  .wathet-style .el-form-item.is-success .el-input__inner, .wathet-style .el-form-item.is-success .el-input__inner:focus, .wathet-style .el-form-item.is-success .el-textarea__inner, .wathet-style  .el-form-item.is-success .el-textarea__inner:focus {
    border-color: #13B5BC;
  }

</style>