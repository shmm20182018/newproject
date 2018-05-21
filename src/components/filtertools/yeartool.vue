<template>
   <el-form-item label="年" :prop="item.rulename">
        <el-date-picker
            v-model="ruleForm[rulename]" :disabled="item.isDisabled"
            type="year"
            placeholder="选择年">
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
    }
  },
  data () {
    return {
    };
  }
}

</script>
<style>
</style>