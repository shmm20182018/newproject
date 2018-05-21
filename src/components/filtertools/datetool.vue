<template>
  <el-form-item label="日期" :prop="item.rulename">
    <el-date-picker
      v-model="ruleForm[rulename]" :disabled="item.isDisabled"
      type="date"
      placeholder="选择日期"
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
      type: String
    },
    rulename:{
      type: String
    }
  },
  data () {
    return {
      value4:'2017-07-01'
    };
  }
}

</script>
<style>
</style>