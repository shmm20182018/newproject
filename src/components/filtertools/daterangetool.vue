<template>
   <el-form-item label="时间" :prop="item.rulename">
    <el-date-picker
      v-model="ruleForm[item.rulename]" :disabled="item.isDisabled"
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
    }
  },
  data () {
    return {
    };
  },
  created(){
    console.log(this.rulename);
  }
}

</script>
<style>
</style>