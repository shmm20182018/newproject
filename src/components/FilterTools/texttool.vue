<template>
  <el-col :span="item.span">
    <div class="grid-content">
      <el-form-item :label="item.title" :prop="item.id" class="filtertool-text">
        <el-input v-model="myrulename" :disabled="item.readonly"></el-input>
      </el-form-item>
    </div>
  </el-col>    
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
.filtertool-text{
  width: 320px;
}
</style>