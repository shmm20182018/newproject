<template>
  <el-col v-if="item" :span="toolSize">
    <div class="grid-content">
      <el-form-item :label="item.title" :prop="item.id">
        <el-date-picker
          v-model="myrulename" :disabled="item.readonly" 
          type="month"
          placeholder="选择年月"
          value-format="yyyy-MM">
        </el-date-picker>
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
      if(val){
        var computedVal = val.substring(0,4)+val.substring(5)
      }else{
        var computedVal = val
      } 
      this.$set(this.item,'defaultValue',computedVal)
      this.$set(this.ruleForm,this.item.id,val)
     // this.$emit('update:this.ruleForm', [this.item.id,val],)
      this.$emit("on-result-change",this.item.id)
    }
  }
}

</script>
<style>
</style>