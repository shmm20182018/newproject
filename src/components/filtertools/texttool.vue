<template>
  <el-col  :span="toolSize">
    <div class="grid-content">
      <el-form-item :label="param.title" :prop="param.id" class="filtertool-text">
        <el-input v-model.lazy="internalValue" 
                  @change="$emit('rule-form-change',param.id,internalValue)"
                  :disabled="param.readonly"></el-input>
      </el-form-item>
    </div>
  </el-col>    
</template>

<script>
export default {
 props:['param','toolSize','ruleFormValue'],
  data () {
    return {
      internalValue : this.param.defaultValue,
    };
  },
}
</script>
<style>
.filtertool-text{
  width: 320px;
}
</style>
