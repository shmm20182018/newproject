<template>
   <el-form-item :label="item.title" :prop="item.id" class="filtertool-select">
    <el-select   v-model="myrulename" :disabled="item.readonly" placeholder="请选择">
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
      this.$emit("on-result-change",[val,this.myitem.id])
    }
  }
}
</script>
<style>
  .filtertool-select{
    width: 320px
  }
</style>