<template>
  <el-col v-if="internalParam" :span="toolSize">
    <div class="grid-content">
      <el-form-item :label="internalParam.title" :prop="internalParam.id" class="filtertool-text">
        <el-input v-model.lazy="internalParam.defaultValue" 
                  @change="$emit('rule-form-change',param.id,internalParam.defaultValue)"
                  :disabled="internalParam.readonly"></el-input>
      </el-form-item>
    </div>
  </el-col>    
</template>

<script>
export default {
 props:['param','toolSize','ruleFormValue'],
  data () {
    return {
      internalParam:{
        readonly:false,
        defaultValue :""
      },
    };
  },
  created(){
    this.internalParam = {...this.param};
  }
}
</script>
<style>
.filtertool-text{
  width: 320px;
}
</style>
