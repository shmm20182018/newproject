<template>
  <el-form-item label="年月" :prop="item.rulename">
    <span></span>
    <el-date-picker
      v-model="rulename" :disabled="item.isDisabled"
      type="month"
      placeholder="选择年月"
      value-format="yyyy-MM">
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
  },
  mounted(){
  }
}

</script>
<style>
</style>