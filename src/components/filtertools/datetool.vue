<template>
  <el-col  :span="toolSize">
    <div class="grid-content">
      <el-form-item :label="param.title" :prop="param.id">
        <el-date-picker
            v-model.lazy="internalValue" 
            @change="$emit('rule-form-change',param.id,internalValue)"
            :disabled="param.readonly"
            :type="getType()"
            :value-format="getValueFormat()">
        </el-date-picker>
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
  },
  methods:{
    getType(){
      if(this.param.contentType=="Y")
        return "year";
      else if(this.param.contentType=="D")
        return "date";
      else 
        return "month";
    },
    getValueFormat(){
      if(this.param.contentType=="Y")
        return "yyyy";
      else if(this.param.contentType=="D")
        return "yyyyMMdd";
      else 
        return "yyyyMM";
    }
  }
}
</script>
<style>
</style>