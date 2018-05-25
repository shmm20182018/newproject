<template>
  <div>
    <el-form :model="ruleForm" :inline="true" :rules="rules"  ref="ruleForm" label-width="100px" class="demo-ruleForm" size="small">
      <component @on-result-change="onResultChange" :ruleForm="ruleForm" :rulename="ruleForm[item.rulename]" v-for="(item,index) in items" :is="item.comname" :item="item" :index="index"  :key="item.rulename"></component>
      <el-form-item class="filtertool-btn">
        <el-button type="primary" @click="submitForm('ruleForm')">立即创建</el-button>
        <el-button @click="resetForm('ruleForm')">重置</el-button>
      </el-form-item>
   </el-form>
  </div>
</template>
<script>
  import texttool from '@/components/filtertools/texttool.vue'
  import selecttool from '@/components/filtertools/selecttool.vue'
  import daterangetool from '@/components/filtertools/daterangetool.vue'
  import yeartool from '@/components/filtertools/yeartool.vue'
  import monthtool from '@/components/filtertools/monthtool.vue'
  import datetool from '@/components/filtertools/datetool.vue'
  export default {
    data() {
      return {
        items:[],
        ruleForm: {},
        rules: {}
      };
    },
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            alert('submit!');
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
        console.log(111)
      },
      createRules(){
        this.items.forEach(item => {
          this.ruleForm[item.rulename] = item.value;
          switch (item.toolid){
            case 1:
              this.rules[item.rulename] = [{required: item.isRequired, message: '查询关键字不能为空', trigger: 'blur' }]
              break;
            case 2:
              this.rules[item.rulename] = [{required: item.isRequired, message: '查询选项不能为空', trigger: 'blur' }]
              break;
            case 3:
              this.rules[item.rulename] = [{required: item.isRequired, message: '日期范围不能为空', trigger: 'change' }]
              break;
            case 4:
              this.rules[item.rulename] = [{required: item.isRequired, message: '查询年份不能为空', trigger: 'change' }]
              break;
            case 5:
              this.rules[item.rulename] = [{required: item.isRequired, message: '查询年月不能为空', trigger: 'change' }]
              break;  
            case 6:
              this.rules[item.rulename] = [{required: item.isRequired, message: '查询日期不能为空', trigger: 'change' }]
              break;
            case 7:
              this.rules[item.rulename] = [{required: item.isRequired, message: '帮助关键字不能为空', trigger: 'blur' }]
              break;
          }
        });
      console.log(this.ruleForm);
      console.log(this.rules);
      },
      onResultChange(val){
          this.$set(this.ruleForm,val[1],val[0]);//④外层调用组件方注册变更方法，将组件内的数据变更，同步到组件外的数据状态中
          this.$refs['ruleForm'].validateField(val[1]); //父组件更新后再次验证
      }
    },
    created(){
      this.items=[
        {toolid:1,rulename:'text', isRequired:true, isDisabled:false, comname:'texttool',value:'山东',field:'province'},
        {toolid:1,rulename:'text1', isRequired:true, isDisabled:false,comname:'texttool',value:'青岛',field:'city'},
        {toolid:2,rulename:'select',isRequired:true, isDisabled:false, comname:'selecttool',value:'',field:'city'},
        {toolid:3,rulename:'daterange',isRequired:true, isDisabled:false, comname:'daterangetool',value:['2018-04-09','2018-04-30'],field:'date'},
        {toolid:4,rulename:'year',isRequired:true, isDisabled:false, comname:'yeartool',value:'2017',field:'city'},
        {toolid:5,rulename:'month',isRequired:true, isDisabled:false, comname:'monthtool',value:'2017-06',field:'city'},
        {toolid:6,rulename:'date0',isRequired:false, isDisabled:true, comname:'datetool',value:'2014-06-09',field:'city'},
        {toolid:6,rulename:'date1',isRequired:false, isDisabled:true, comname:'datetool',value:'2014-06-09',field:'city'},
        {toolid:6,rulename:'date2',isRequired:true, isDisabled:false, comname:'datetool',value:'2015-10-31',field:'city'}
      ];
      this.createRules();
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
    padding-left: 100px;
  }
</style>