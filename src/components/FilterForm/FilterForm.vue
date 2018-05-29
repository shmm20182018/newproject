<template>
  <div>
    <el-form :class="colorSeries" :model="ruleForm" :inline="true" :rules="rules"  ref="ruleForm" label-width="" class="demo-ruleForm" size="mini">
      <el-row :gutter="20">
        <component @on-result-change="onResultChange" :ruleForm="ruleForm" :rulename="ruleForm[item.id]" v-for="(item,index) in items" :is="item.componentName" :item="item" :index="index"  :key="item.id"></component>
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
export default {
  props:{
    routeParams:{
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
      NProgress.start();
      const url ='api/report/init?id='+this.routeParams.id+'&engine='+this.routeParams.engine+'';    
      //console.log(pageIndex,pageSize);
      this.$axios({
          method: 'get',
          url:url,
      }).then((res)=>{
          NProgress.done(); 
          if(res.data){
            this.pageSize =res.data.pageSize
            this.items =res.data.queryParams;
            //console.log(this.items)
            this.createRules();
            this.tableType =res.data.tableType
            if(this.tableType == 0){
              this.colorSeries = 'green-style'
            }
          }
      })
      .catch((res) => {
        NProgress.done(); 
        this.warnOpen(res.response.data)
      }) 
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
            this.rules[item.id] = [{required: item.mandatory, message: `查询${item.defaultValue}不能为空`, trigger: 'blur' }]
            break;
          case 'selecttool':
            this.rules[item.id] = [{required: item.mandatory, message: `查询${item.defaultValue}不能为空`, trigger: 'blur' }]
            break;
          case 'daterangetool':
            this.rules[item.id] = [{required: item.mandatory, message: '日期范围不能为空', trigger: 'change' }]
            break;
          case 'yeartool':
            this.rules[item.id] = [{required: item.mandatory, message: '查询年份不能为空', trigger: 'change' }]
            break;
          case 'monthtool':
            this.rules[item.id] = [{required: item.mandatory, message: '查询不能为空', trigger: 'change' }]
            break;  
          case 'datetool':
            this.rules[item.id] = [{required: item.mandatory, message: '查询日期不能为空', trigger: 'change' }]
            break;
          case 7:
            this.rules[item.id] = [{type:'',required: item.mandatory, message: '帮助关键字不能为空', trigger: 'blur' }]
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
      if(val[0]){
        computedVal = val[0].substring(0,4)+val[0].substring(5,7)+val[0].substring(8) 
      }else{
        computedVal = val[0]
      }
      this.$set(this.submitForm,val[1],computedVal);
      this.$emit('on-filterdata-change',this.submitForm)
    }
  },
  created(){
    this.getQueryParam();
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
    'datetool':datetool
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
   
  }
  .el-form-item__content{
    flex: 1;
  }
  .green-style .el-form-item.is-success .el-input__inner,  .green-style .el-form-item.is-success .el-input__inner:focus, .green-style .el-form-item.is-success .el-textarea__inner,  .green-style .el-form-item.is-success .el-textarea__inner:focus {
    border-color: #03A656;
  }
  .wathet-style .el-form-item.is-success .el-input__inner, .wathet-style .el-form-item.is-success .el-input__inner:focus, .wathet-style .el-form-item.is-success .el-textarea__inner, .wathet-style  .el-form-item.is-success .el-textarea__inner:focus {
    border-color: #13B5BC;
  }
</style>