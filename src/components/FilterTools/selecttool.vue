<template>
   <el-form-item label="文本下拉" :prop="item.rulename" class="filtertool-select">
    <el-select   v-model="myrulename" :disabled="item.isDisabled" placeholder="请选择">
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
  .filtertool-select{
    width: 320px
  }
</style>