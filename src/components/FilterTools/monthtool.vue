<template>
  <el-form-item label="年月" :prop="item.rulename">
    <span></span>
    <el-date-picker
      v-model="myrulename" :disabled="item.isDisabled"
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
</style>