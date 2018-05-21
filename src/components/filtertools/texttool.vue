<template>
   <el-form-item label="文本" :prop="item.rulename" >
    <el-input v-model="ruleForm[rulename]" :disabled="item.isDisabled"></el-input>
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
  data(){
    return {
     
    }
  },
  beforeMount(){
    
  }
}

</script>
<style>
</style>