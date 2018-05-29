<template>
  <el-col :span="6">
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
      this.$emit("on-result-change",[val,this.myitem.id,this.myitem.componentName])
    }
  }
}
</script>
<style>
  .filtertool-select{
    width: 320px
  }
</style>