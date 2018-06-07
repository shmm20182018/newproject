<template>
  <el-col :span="toolSize">
    <div class="grid-content">
      <el-form-item :label="param.title" :prop="param.id" class="filtertool-select">
          <el-select  v-model="internalValue" 
                      @input="$emit('rule-form-change',param.id,internalValue)"
                      :disabled="param.readonly" 
                      clearable placeholder="请选择">
          <el-option v-for="(temp,index) in param.list" :key="temp.key" :index="index" :label="temp.Value" :value="temp.Key"></el-option>
        </el-select>
      </el-form-item>
    </div>
  </el-col>   
</template>

<script>
export default {
  props:['param','toolSize','ruleFormValue'],
  data () {
    return {
       internalValue : this.param.defaultValue
    };
  }
}
</script>
<style>
  .filtertool-select{
    width: 320px
  }
</style>