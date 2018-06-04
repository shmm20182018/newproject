<template>
  <el-col v-if="item" :span="toolSize">
    <div class="grid-content">
      <el-form-item :label="item.title" :prop="item.id" class="filtertool-select">
        <el-select   v-model="myrulename" :disabled="item.readonly" placeholder="请选择">
          <el-option v-for="(temp,index) in item.list" :key="temp.key" :index="index" :label="temp.Value" :value="temp.Key"></el-option>
        </el-select>
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
    item:{ //查询信息
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
  .filtertool-select{
    width: 320px
  }
</style>