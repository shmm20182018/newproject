<template>
  <el-col v-if="item" :span="toolSize">
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
    toolSize:{
    
    }
  },
  data () {
    return {
      myrulename:this.item.defaultValue,
    };
  },
  watch:{
    myrulename:function(val,oldval){ 
      this.$set(this.item,'defaultValue',val)       
      this.$set(this.ruleForm,this.item.id,val)
      this.$emit("on-result-change",this.item.id)
    }
  }
}
</script>
<style>
.filtertool-text{
  width: 320px;
}
</style>