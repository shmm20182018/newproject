<template>
  <div class="filterForm">
    <el-form class="wathet-filter-style demo-ruleForm" :show-message="false" label-position="left" label-width="80px" :model="ruleForm" :inline="true" :rules="rules"  ref="ruleForm" size="mini">
      <el-row :gutter="20">
        <component :toolSize="toolColSize" 
                   v-for="(param) in paramsInfo" 
                   :is="param.componentName" 
                   :param="param" 
                   :ruleForm="ruleForm"
                   :paramsInfo ="paramsInfo"
                   @rule-form-change="ruleFormChange"  
                   :key="param.id"
                   :phoneFlag="phoneFlag"></component>
         <el-col :span="btnSpan">
          <div class="grid-content">
            <el-form-item :class="filtertoolbtn">
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
  props:['paramsInfo','queryParams','phoneFlag'],
  data() {
    return {
      btnSpan:6,
      ruleForm: {},
      rules: {},
    };
  },
  computed:{
    //过滤组件占得格数
    toolColSize:function(){
      if(this.$route.params.pc == 'Mobile'){
          return 24
      }else if(this.$route.params.pc == 'PC'){
          return 6
      }
    },
    filtertoolbtn(){
      if(this.paramsInfo.length%4 == 0 ){
        this.btnSpan = 24
        return 'filtertool-btn'
      }else{
        this.btnSpan = this.toolColSize
        return  ''
      }
    }
  },
  watch:{
    'paramsInfo':{
         handler: function (newVal) {
            if(this.paramsInfo){
              this.paramsInfo.forEach(item => {
                 if(item.helpMultiSelect)
                    this.$set(this.ruleForm,item.id,"('')");
                 else
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
 .filterForm .el-form-item__label{
    font-size: 12px
  }
  .filterForm .el-date-editor.el-input, .el-date-editor.el-input__inner {
    width: 100%;
  }
  .filterForm .el-form-item--mini.el-form-item, .el-form-item--small.el-form-item{
    display: flex;
    align-items: center;
    width: 100%;
  }
 .filterForm .el-form-item__content{
    flex: 0.95;
  }
  .filterForm .el-form-item__content{
    position: relative;
  }
  .filterForm .el-icon-search{
    position: absolute;
    top: 6px;
    right: 5px;
    font-size: 18px;
    color: #C3C5C8;
  }
  .filterForm .el-icon-search:hover{
    color: #02AFEE;
    cursor: pointer;
  } 
  .filterForm .filtertool-btn{
    padding-left: 92%;
  }
  .filterForm  .el-form--inline .el-form-item__label {
    flex: 0 0 80px;
    line-height: 14px;
  }
 .filterForm   .el-select{
    width: 100%;
  }
  .filterForm .el-form-item--mini.el-form-item, .el-form-item--small.el-form-item {
    margin-bottom: 8px;
  }
 .filterForm   .green-style .el-form-item.is-success .el-input__inner,  .green-style .el-form-item.is-success .el-input__inner:focus, .green-style .el-form-item.is-success .el-textarea__inner,  .green-style .el-form-item.is-success .el-textarea__inner:focus {
    border-color: #03A656;
  }
 .filterForm   .wathet-filter-style .el-form-item.is-success .el-input__inner, .wathet-filter-style .el-form-item.is-success .el-input__inner:focus, .wathet-filter-style .el-form-item.is-success .el-textarea__inner, .wathet-filter-style  .el-form-item.is-success .el-textarea__inner:focus {
    border-color: #13B5BC;
  }
  .phone-style-class .filterForm .el-form-item__content{
    flex: 1;
  }
  .phone-style-class  .filterForm .filtertool-btn{
    padding-left: 0;
  }  
  .phone-style-class  .filterForm .el-button--mini, .el-button--mini.is-round {
    padding: 11px 15px;
    width: 100%;
  }
 .phone-style-class   .filterForm .el-input--mini .el-input__inner {
    height: 36px;
    line-height: 36px;
  }
  .phone-style-class  .filterForm .el-icon-search{
    top: 8px;
  } 
</style>