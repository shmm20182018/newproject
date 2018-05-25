<template>
   <el-form-item label="日期范围" :prop="item.rulename" class="filtertool-daterange">
    <el-date-picker
      v-model="myrulename" :disabled="item.isDisabled"
      type="daterange"
      unlink-panels
      range-separator="至"
      start-placeholder="开始日期"
      end-placeholder="结束日期"
      value-format="yyyy-MM-dd">
    </el-date-picker>
  </el-form-item>
</template>

<script>
export default {
  props:{
    ruleForm:{
      type: Object
    },
    item:{
      type: Object
    },
    rulename:{
      type: Array
    }
  },
  data () {
    return {
      myrulename:this.rulename,
      myitem: this.item
    };
  },
  watch:{
    myrulename:function(val,oldval){  
      //console.log(val)  
      this.$emit("on-result-change",[val,this.myitem.rulename])
    }
  }
}

</script>
<style>
.filtertool-daterange .el-range-editor{
  width: 220px;
}
.filtertool-daterange .el-range-separator{
  width: 12%;
}
</style>