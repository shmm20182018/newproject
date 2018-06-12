<template>
  <el-col :span="toolSize">
    <div class="grid-content">
      <el-form-item :label="param.title" :prop="param.id" class="filtertool-text help-tool">
        <el-tooltip :disabled="tooltipFlag" effect="light" :content="toolTipContent" placement="bottom-start" offset="">
            <div style="position:relative">
            <el-input class="help-input" 
                     ref="helpInput" 
                     v-model.lazy="inputShowText"  
                     @focus="focusHandler" 
                     @blur="blurHandler($event)"        
                     :disabled="param.readonly" 
            ></el-input>
            </div>
        </el-tooltip> 
        <i class="el-icon-search" @click="openHelp"></i>
        <transition name="help-slide">
        <div v-if="helpShowFlag" v-drag="greet" class="help-wrapper" id="drag" :style="helpStyle">
            <el-card class="box-card">
                <div slot="header" class="clearfix">
                    <span class="card-title">{{tableInfo.title}}</span>
                    <i class="icon-close el-icon-close"  @click="closeHelp"></i>
                </div>
                <div  class="content-wapper">
                    <v-table  ref='table'
                        id=""
                        :error-content-height = '320'
                        class="wathet-style"
                        is-vertical-resize
                        :vertical-resize-offset='60'
                        is-horizontal-resize
                        column-width-drag
                        style="width:100%"
                        :multiple-sort="false"
                        :min-height="300"
                        :height="350"
                        row-hover-color="#eee"
                        row-click-color="#edf7ff"
                        :row-dblclick="rowDoubleClick"
                        :row-click="rowClick"
                        table-bg-color="phoneFlag?'transparent':''"	
                        title-bg-color="phoneFlag?'transparent':''"	
                        odd-bg-color="phoneFlag?'transparent':''"	
                        even-bg-color="phoneFlag?'transparent':''"
                        :columns="tableInfo.columns"
                        :table-data="tableInfo.tableData"
                        :paging-index="(pageIndex-1)*tableInfo.pageSize"
                        :title-row-height="32"
                        :row-height="34"
                        >
                    </v-table>
                    <div class="footer-wapper clear">
                        <div  class="page-wrapper">
                            <v-pagination size="small" @page-change="pageChange" :page-index="pageIndex" :total="tableInfo.total" :page-size="tableInfo.pageSize" :layout="['total', 'prev', 'next', 'jumper']"></v-pagination>
                            <span class="page-total">{{pageCount}}</span>
                            <el-input v-if="phoneFlag" v-model="searchText" class="search-input-phone" placeholder="请输入关键词" width="150px"></el-input>
                        </div> 
                        <div class="btn-wrapper" v-if="phoneFlag"><el-button type="primary" class="search-btn-phone" @click="onSubmit">查询</el-button></div>
                        <el-form v-if="!phoneFlag" :inline="true"  class="search-form" size="mini">
                            <el-form-item label="">
                                <el-input v-model="searchText" class="search-input" placeholder="请输入关键词" width="150px"></el-input>
                                <el-button type="primary" @click="onSubmit">查询</el-button>
                            </el-form-item>  
                        </el-form>
                    </div>
                </div>
            </el-card>
        </div>
        </transition>
      </el-form-item>
    </div>
  </el-col>    
</template>

<script>
import 'vue-easytable/libs/themes-base/index.css'
import {VTable,VPagination} from 'vue-easytable'
export default {
    props:['param','toolSize','ruleFormValue','phoneFlag'],
    data () {
        return {
            internalValue : this.param.defaultValue,
            helpBhValue: '',
            helpMcValue: '',
            inputShowText:this.param.defaultValue,
            showTextState:'default',
            helpShowFlag: false,
            tableInfo:{},
            interTableData:[],
            pageIndex:1,
            searchText:'',
            helpStyle: {
                width: '600px',
                height: '422px',
                position: 'fixed',
                right: 'calc(50% - 300px)',
                top: '50px'
            }
        }
    },
    computed:{
        tooltipFlag(){
             return this.helpBhValue == ''? true:false;
        },
        toolTipContent(){
            return this.helpBhValue+'-'+this.helpMcValue;
        },
        pageCount(){
            return  parseInt((this.tableInfo.total  +  this.tableInfo.pageSize  - 1) / this.tableInfo.pageSize);  
        },
        initRequestData(){
            var data = { queryText: this.searchText};
            ({ helpID: data.helpID, helpXH: data.helpBH,helpConditions: data.helpTJ} = this.param);
            return data;
        },
        onBlurRequestData(){
            var data = { queryText:this.inputShowText };
            ({ helpID: data.helpID, helpXH: data.helpBH,helpConditions: data.helpTJ} = this.param);
            return data;
        },
        searchRequestData(){
            var data = { queryText:this.searchText,pageIndex:this.pageIndex };
            ({ helpID: data.helpID, helpXH: data.helpBH,helpConditions: data.helpTJ} = this.param);
            return data;
        }
    },
    watch:{
        'showTextState':function(val){
            this.getShowText(val);
        },
        'internalValue':function(val){
            this.$emit('rule-form-change',this.param.id,val);
        }
    },
    methods:{
        setHelpValue(nm,bh,mc){
            this.internalValue = nm;
            this.helpBhValue =  bh;
            this.helpMcValue =  mc;
        },
        getShowText(state){
            if(state == 'default' )
                this.inputShowText = this.internalValue;
            else if(state == 'focus')
                this.inputShowText = this.internalValue ;
            else //blur 
                 this.inputShowText = this.helpMcValue ==''? this.internalValue:this.helpMcValue ;
        },
        onBlurRequest(){
            this.$Http('post','api/help/onblur',this.onBlurRequestData).then((res)=>{
                if(!res.data.result){
                    this.searchText= this.inputShowText;
                    this.setHelpValue('','','');
                    this.openHelp();
                }
                else{
                    this.setHelpValue(res.data.F_NM,res.data.F_BH,res.data.F_MC);
                    this.showTextState ='blur'
                }
            });
        },
        blurHandler(event){
            if(this.helpBhValue=='' || event.target._value!=this.internalValue)
                this.onBlurRequest();
            else
                this.showTextState = 'blur';
        },
        focusHandler(){
            this.showTextState = 'focus';
        },
        openHelp(){
            this.$Http('post','api/help/init',this.initRequestData).then((res)=>{
                this.tableInfo = {...this.tableInfo,...res.data };
                this.interTableData[1]=this.tableInfo.tableData;
                this.helpShowFlag = true;
            });
        },
        closeHelp(){
            this.helpShowFlag = false;
        },        
        rowDoubleClick(rowIndex, rowData, column){
            this.setHelpValue(rowData['F_NM'],rowData['F_BH'],rowData['F_MC']);
            this.helpShowFlag = false;
            this.inputShowText =  this.helpMcValue;
        },
        rowClick(rowIndex, rowData, column){
            if(!this.phoneFlag){
                return ;
            }
            this.setHelpValue(rowData['F_NM'],rowData['F_BH'],rowData['F_MC']);
            this.helpShowFlag = false;
            this.inputShowText =  this.helpMcValue;
        },
        pageChange(pageIndex){ 
            this.pageIndex = pageIndex;

            if(this.interTableData[pageIndex]){
                this.tableInfo.tableData =  this.interTableData[pageIndex];
                return;
            }

            this.$Http('post',"api/help/search",this.searchRequestData).then((res)=>{
                this.tableInfo.tableData = res.data.rowData;
                this.tableInfo.total = res.data.total;
                if( this.tableInfo.tableData.length>0)
                    this.interTableData[pageIndex] = this.tableInfo.tableData ;

             });
        },
        onSubmit(){
            this.interTableData.length = 0;
            this.pageChange(1);
        },
        greet(){

        }
    },
    created(){
        if(this.phoneFlag){
            this.helpStyle = {}
        }
    },
    components: {
     VTable,
     VPagination
  }
}
</script>
<style>
.filtertool-text{
  width: 320px;
}
.content-wapper tbody tr{
    cursor: pointer;
}
.help-wrapper{
    position: fixed;
    top: 50px;
    left: calc(50% - 300px);
    width: 600px;
    height: 422px;
    margin: 0 auto;
    border: 1px solid #DFE0E4;
    z-index: 1000;
    background:#aaa;
    border-radius: 4px;
    box-shadow:gray 0 0 30px
}
.help-wrapper .icon-close{
    float: right; 
    width: 24px;
    height: 28px;
    line-height: 28px;
    cursor: pointer;
}
.help-wrapper .v-table-header-inner{
    background-color: #13B5BC;
    border-bottom: 1px solid rgb(221,221,221)
}
.help-wrapper .v-table-header-inner tbody td:last-child>div{ 
    border-right: #13B5BC;
}
.help-wrapper .v-table-header-inner tbody td>div{
    border-bottom:none;
}
.help-wrapper .v-table-body table{
   width: 100%;
}
body .el-card__header{
    padding: 4px 10px;
    background-color: rgba(241,251,252,0.8);
    font-weight: 700;   
} 
body .card-title{
    color: #808080;
}
.help-tool .table-title{
    color: #F3F7FB;
    height: 22px;
}
.help-tool form{
    display: inline-block
} 
.help-tool .el-form-item--mini.el-form-item, .help-tool  .el-form-item--small.el-form-item {
    margin-bottom: 0px;
}
.help-tool .page-wrapper{
    float: left;
}
.help-tool .page-wrapper .v-page-ul {
    margin: 4px 0;
}
.help-tool .page-wrapper .page-total {
    display: inline-block;
    vertical-align: top;
    width: 5%;
    height: 24px;
    line-height: 24px;
    margin: 4px 0;
    font-size: 12px;
}
.help-tool .search-form{
    float: right;
}
.help-tool .search-input{
    width: 67%
}
.help-tool .el-card__body {
    padding: 0px;
}
.help-input-title {
    position: absolute;
    left: 15px;
    top: 2px;
    height: 26px;
    line-height: 26px;
    font-size: 12px;
    color: #808080;
    background:#fff;
}
body .el-tooltip__popper.is-dark {
    background: #F5F7F9;
    color: #C3C5C8;
}
body .el-tooltip__popper[x-placement^=bottom] {
    margin-top: 5px;
}
body .el-tooltip__popper {
    position: absolute;
    border-radius: 4px;
    padding: 4px;
    background: #F5F7F9;
}
body .el-tooltip__popper[x-placement^=bottom] .popper__arrow {
    top: -5px;
    border-bottom-color: #F5F7F9;
}
body .el-tooltip__popper .popper__arrow::after {
    border-width: 4px;
    display: none;
}
body .el-tooltip__popper[x-placement^=bottom] .popper__arrow::after {
    top: 1px;
    margin-left: -5px;
    border-top-width: 0;
    border-bottom-color: #F5F7F9;
    display: none;
}
.el-tooltip__popper.is-light[x-placement^=bottom] .popper__arrow {
    display: none;
}
.help-tool .v-table-views{
    height: 350px !important
}
.pc-style-class .help-wrapper ::-webkit-scrollbar{  
    width:8px;  
    height:8px;  
}  
.pc-style-class .help-wrapper ::-webkit-scrollbar-track{  
    background: #f6f6f6;  
    border-radius:4px;  
}  
.pc-style-class .help-wrapper ::-webkit-scrollbar-thumb{  
    background: #aaa;  
    border-radius:4px;  
}  
.pc-style-class .help-wrapper ::-webkit-scrollbar-thumb:hover{  
    background: #747474;  
}  
.pc-style-class .help-wrapper ::-webkit-scrollbar-corner{  
    background: #f6f6f6;  
}
@media screen and (max-width: 1119px){
    .help-slide-enter-active {
        transition: all .3s ease;
    }
    .help-slide-leave-active {
        transition: all .3s cubic-bezier(1.0, 0.5, 0.8, 1.0);
    }
    .help-slide-enter, .help-slide-leave-to{
        transform: translateX(-100%);
        opacity: 0;
    }
    .help-wrapper{
        position: fixed;
        top: 0px;
        left: 0px;
        right: 0px;
        width: 100%;
        height: 100%;
        z-index: 1000;
        margin:0;
        background: rgba(7,17,27,0.8);
        box-shadow:none;
        border:none;
    }
    .help-wrapper .el-card{
        height: 100%;
    }
    .help-wrapper .el-card__body{
        height: calc(100% - 44px);
    }
    .help-wrapper .content-wapper{
        height: 100%;
    }
    .help-wrapper .v-table-views {
        position: static;
        height: auto !important;
        min-height: 300px !important;
        max-height:calc(100% - 120px) !important;
        overflow: scroll;
        border: none;
    }
    .help-wrapper .v-table-header{
        width: 319px;
        position: absolute;
        left: 0;
        top: 0;
        z-index: 1999;
    }
    .help-wrapper .content-wapper{
        position: relative;
    }
    .help-wrapper tr td:first-child>div{
        width: 100px !important; 
    }
    .help-wrapper tr td:nth-child(2)>div{
        width: 320px !important; 
    }
    .help-wrapper .search-form {
        float: left;
        width: 100%;
        padding: 0 5px;
    }
    .help-wrapper .el-form-item__content{
        display: flex;
    }
     .help-wrapper .search-input{
        flex: 1;
    }
    .help-wrapper button{
        flex: 0 0 58px;
        width: 58px;
        margin-left: 10px;
    }
    .help-wrapper .el-input--mini .el-input__inner {
        height: 28px;
        line-height: 28px;
    }
    .help-wrapper .el-button--mini, .el-button--mini.is-round {
        padding: 7px 15px;
    }
    .help-wrapper .page-wrapper{
        position: relative;
        height: 34px;
        width: 100%;
    }
    .help-wrapper .v-page-ul{
        position: relative;
        width: 95%;
        height: 28px;
        line-height: 28px;
    }
    .help-wrapper .v-page-goto{
        position:absolute;
        top: 0;
        right: 0;
    }
    .help-wrapper .page-total{
        position:absolute;
        right: 0;
        top: 0;
        width: 5%;
        height: 34px;
    }
    .help-wrapper .el-card {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        border: none;
        border-radius: 0;
    }
    .help-wrapper .el-card__header{
        padding: 8px 10px;  
    } 
    .help-wrapper .search-input-phone{
        position: absolute;
        left: 115px;
        top: 2px;
        width: 33%;
    }  
    .help-wrapper .btn-wrapper{
        text-align: center;
        margin-top: 20px;
    }
    .help-wrapper .search-btn-phone{
        width: 95%;
        margin-left:0;
        padding: 11px 15px;
    }
    .help-tool .page-wrapper {
        float: none;
        margin-top:5px;
    }
    .help-wrapper .v-table-body{
        height: auto !important;
        margin-top: 33px;
    }
    .help-wrapper .v-table-rightview {
        position: static;
    }
}
</style>