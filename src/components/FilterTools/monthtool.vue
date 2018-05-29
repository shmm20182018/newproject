<template>
  <el-col :span="6">
    <div class="grid-content">
      <el-form-item :label="item.title" :prop="item.id">
        <span>{{computedValue}}</span>
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
  computed:{
    computedValue(){
      return  this.myrulename.substring(0,4)+this.myrulename.substring(5)
    }
  },
  watch:{
    myrulename:function(val,oldval){  
      //console.log(val)  
      this.$emit("on-result-change",[val,this.myitem.id],this.myitem.componentName)
    },
    rulename(val){
      console.log(val)
      this.myrulename = val
    }
  }
}

</script>
<style>
</style>