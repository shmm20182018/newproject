<template>
  <el-col :span="6">
    <div class="grid-content">
      <el-form-item label="帮助"  class="filtertool-text help-tool">
        <el-input class="help-input"></el-input>
        <i class="el-icon-question" @click="openHelp"></i>
        <draggable v-if="helpShow" class="help-wrapper"  @start="drag=false" @end="drag=true">
           <div class="" >
                hahaha
                <i class="el-input__icon el-icon-close" @click="closeHelp"></i>
            </div>
        </draggable>
      </el-form-item>
    </div>
  </el-col>    
</template>

<script>
import draggable from 'vuedraggable'
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
            helpShow: false,
            myrulename:this.rulename,
            myitem: this.item
        };
    },
    methods:{
        openHelp(){
            this.helpShow = true
        },
        closeHelp(){
            this.helpShow = false
        }
    },
    watch:{
        myrulename:function(val,oldval){  
            //console.log(val)  
            this.$emit("on-result-change",[val,this.myitem.id,this.myitem.componentName])
        }
    },
    components:{
        draggable
    }
}
</script>
<style>
.filtertool-text{
  width: 320px;
}
.help-wrapper{
    position: absolute;
    margin: 0
}
.help-wrapper .el-icon-close{
    position: absolute;
    top: 5px;
    right: 5px;
    font-size: 12px;
}
.help-tool .el-form-item__content{
    position: relative;
}
.help-tool .el-icon-question{
    position: absolute;
    top: 5px;
    right: 5px;
    font-size: 18px;
    color: #DFE0E4;
}
.help-tool .el-icon-question:hover{
    color: #02AFEE
}    
</style>