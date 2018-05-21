<template>
   <el-form-item label="文本下拉" :prop="item.rulename">
    <el-select   v-model="ruleForm[item.rulename]" :disabled="item.isDisabled" placeholder="请选择">
      <el-option label="济南" value="济南"></el-option>
      <el-option label="青岛" value="青岛"></el-option>
    </el-select>
  </el-form-item>
</template>

<script>
export default {
  props:{
    ruleForm:{
      type: Object
    },
    item:{
      type:Object
    }
  },
  data () {
    return {
    }
  }
}
</script>
<style>
</style>