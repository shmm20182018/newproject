<template>
  <div>
    <el-form class="wathet-style demo-ruleForm" :show-message="false" label-position="left" label-width="80px" :model="ruleForm" :inline="true" :rules="rules"  ref="ruleForm" size="mini">
      <el-row :gutter="20">
        <component :toolSize="toolColSize" 
                   v-for="(param) in paramsInfo" 
                   :is="param.componentName" 
                   :param="param" 
                   @rule-form-change="ruleFormChange"  
                   :key="param.id"></component>
        <el-col :span="6">
          <div class="grid-content">
            <el-form-item class="filtertool-btn">
              <el-button type="primary" @click.prevent="submitForm('ruleForm')">查询</el-button>
            </el-form-item>
          </div>
        </el-col>
      </el-row>
   </el-form>
  </div>
</template>
<script>
import texttool from '@/components/filtertools/texttool.vue'
import selecttool from '@/components/filtertools/selecttool.vue'
import datetool from '@/components/filtertools/datetool.vue'
import helptool from '@/components/filtertools/helptool.vue'
export default {
  props:['paramsInfo','queryParams'],
  data() {
    return {
      ruleForm: {},
      rules: {},
    };
  },
  computed:{
    //过滤组件占得格数
    toolColSize:function(){
      var screenWidth = document.body.clientWidth * 1//窗口的大小
      if(screenWidth < 1200 && screenWidth > 768){
          return 12
      }else if(screenWidth <= 768){
          return 24
      }
      else
        return 6;
    },

  },
  watch:{
    'paramsInfo':{
         handler: function (newVal) {
            if(this.paramsInfo){
              this.paramsInfo.forEach(item => {
                 this.$set(this.ruleForm,item.id,item.defaultValue);
                 this.$set(this.rules,item.id,[{required: item.mandatory, trigger: '' }]);
              });
            }
          },
         deep: true
    }
  },
  methods: {
    ruleFormChange(id,newVal){
      this.$set(this.ruleForm,id,newVal);
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {       
             this.$emit('query-params-change',this.ruleForm);
             this.$emit('search-data');
        } else {
          return false;
        }
      });
    }
  },
  components: {
     texttool,
     selecttool,
     datetool,
     helptool
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