<template>
   <el-form-item label="文本" :prop="item.rulename" class="filtertool-text">
    <el-input v-model="myrulename" :disabled="item.isDisabled"></el-input>
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
.filtertool-text{
  width: 320px;
}
</style>