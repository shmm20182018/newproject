<template>
   <el-form-item :label="item.title" :prop="item.id">
        <el-date-picker
            v-model="myrulename" :disabled="item.readonly"
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
</style>