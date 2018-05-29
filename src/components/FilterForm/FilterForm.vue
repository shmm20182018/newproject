<template>
  <div>
    <el-form :class="colorSeries" :show-message="false" label-position="left" label-width="80px" :model="ruleForm" :inline="true" :rules="rules"  ref="ruleForm"  class="demo-ruleForm" size="mini">
      <el-row :gutter="20">
        <component @on-result-change="onResultChange" :ruleForm="ruleForm" :rulename="ruleForm[item.id]" v-for="(item,index) in items" :is="item.componentName" :item="item" :index="index"  :key="item.id"></component>
        <helptool></helptool>
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
    resTableInit:{
      type:Object
    }
  },
  data() {
    return {
      colorSeries:'wathet-style',
      tableType:-1,
      pageIndex:1,
      pageSize:20,
      queryParams:[],
      items:[],
      ruleForm: {},
      submitForm:{},//提交日期格式化
      rules: {},
      resData:{}
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
      if(this.resTableInit){
        if(!this.resTableInit.isChart){
          this.pageSize = this.resTableInit.pageSize
          this.tableType = this.resTableInit.tableType
          if(this.tableType == 0){
            this.colorSeries = 'green-style'
          }
        }
        this.items = this.resTableInit.queryParams;
        console.log(this.resTableInit.queryParams)
        //console.log(this.items)
        this.createRules();    
      }
    },
    getData(pageSize){
      NProgress.start();
      var params = {};
      const url ='api/report/search';
      params.id =  70050;
      params.engine = 'TJCX' 
      params.pageIndex =  1       //你要传给后台的参数值 key/value
      params.pageSize = this.pageSize
      params.condition = this.submitForm
      //console.log(params)
      //console.log(pageIndex,pageSize);
      this.$axios({
          method: 'post',
          url:url,
          data:params
      }).then((res)=>{
          NProgress.done();
          //console.log(res);
          this.resData =res.data;
          this.$emit("on-result-response",this.resData)
        })
        .catch(function (res) {
          NProgress.done(); 
          this.warnOpen(res.response.data)
        }) 
    },
    subForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$emit('on-filter-submit',this.pageIndex) 
          //this.getData();
          alert('submit!');
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
      this.items.forEach(item => {
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
      this.submitForm = this.ruleForm
      this.$emit('on-filterdata-change',this.submitForm)
      //console.log(this.ruleForm);
      //console.log(this.rules);
    },
    onResultChange(val){
      this.$set(this.ruleForm,val[1],val[0]);//④外层调用组件方注册变更方法，将组件内的数据变更，同步到组件外的数据状态中
      this.$refs['ruleForm'].validateField(val[1]); //父组件更新后再次验证;
      var computedVal
      //console.log(val[2])
      if(val[0] && val[2] == 'datetool'){
        computedVal = val[0].substring(0,4)+val[0].substring(5,7)+val[0].substring(8) 
      }else if(val[0] && val[2] == 'monthtool'){
        computedVal = val[0].substring(0,4)+val[0].substring(5)
      }else{
        computedVal = val[0]
      }
      this.$set(this.submitForm,val[1],computedVal);
      this.$emit('on-filterdata-change',this.submitForm)
    }
  },
  watch:{
    resTableInit:{
      handler(newValue, oldValue) { 
        this.getQueryParam();
　　　},  
　　　deep: true 
    }
  },
  created(){
    
    /*this.items=[
      {toolid:1,rulename:'text', isRequired:true, isDisabled:false, comname:'texttool',value:'山东',field:'province'},
      {toolid:1,rulename:'text1', isRequired:true, isDisabled:false,comname:'texttool',value:'青岛',field:'city'},
      {toolid:2,rulename:'select',isRequired:true, isDisabled:false, comname:'selecttool',value:'',field:'city'},
      {toolid:3,rulename:'daterange',isRequired:true, isDisabled:false, comname:'daterangetool',value:['2018-04-09','2018-04-30'],field:'date'},
      {toolid:4,rulename:'year',isRequired:true, isDisabled:false, comname:'yeartool',value:'2017',field:'city'},
      {toolid:5,rulename:'month',isRequired:true, isDisabled:false, comname:'monthtool',value:'2017-06',field:'city'},
      {toolid:6,rulename:'date0',isRequired:false, isDisabled:true, comname:'datetool',value:'2014-06-09',field:'city'},
      {toolid:6,rulename:'date1',isRequired:false, isDisabled:true, comname:'datetool',value:'2014-06-09',field:'city'},
      {toolid:6,rulename:'date2',isRequired:true, isDisabled:false, comname:'datetool',value:'2015-10-31',field:'city'}
    ];*/
    
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
  .filtertool-btn{
    
  }
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

  .green-style .el-form-item.is-success .el-input__inner,  .green-style .el-form-item.is-success .el-input__inner:focus, .green-style .el-form-item.is-success .el-textarea__inner,  .green-style .el-form-item.is-success .el-textarea__inner:focus {
    border-color: #03A656;
  }
  .wathet-style .el-form-item.is-success .el-input__inner, .wathet-style .el-form-item.is-success .el-input__inner:focus, .wathet-style .el-form-item.is-success .el-textarea__inner, .wathet-style  .el-form-item.is-success .el-textarea__inner:focus {
    border-color: #13B5BC;
  }
</style>