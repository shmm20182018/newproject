<template>
  <el-col :span="toolSize">
    <div class="grid-content">
      <el-form-item :label="param.title" :prop="param.id" class="filtertool-text help-tool">
        <el-tooltip :disabled="tooltipFlag" effect="light" :content="toolTipContent" placement="bottom-start" offset="">
            <div style="position:relative">
            <el-input class="help-input" ref="helpInput" 
                     v-model.lazy="inputShowText"  
                     @focus="focusHandler" 
                     @blur="blurHandler($event)"        
                     :disabled="param.readonly" 
            ></el-input>
            </div>
        </el-tooltip> 
         <i class="el-icon-zoom-in" @click="openHelp"></i>
        <div v-if="helpShowFlag" class="help-wrapper" id="drag" :style="helpStyle">
            <el-card class="box-card">
                <div slot="header" class="clearfix">
                    <span class="card-title">{{tableInfo.title}}</span>
                    <i class="icon-close el-icon-close"  @click="closeHelp"></i>
                </div>
                <div  class="content-wapper">
                    <v-table  ref='table'
                        id=""
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
                        even-bg-color="#f2f2f2"
                        :columns="tableInfo.columns"
                        :table-data="tableInfo.tableData"
                        :paging-index="(pageIndex-1)*tableInfo.pageSize"
                        :title-row-height="22"
                        :row-height="24"
                        >
                    </v-table>
                    <div class="footer-wapper clear">
                        <div  class="mt20 mb20 bold page-wrapper">
                            <v-pagination size="small" @page-change="pageChange" :page-index="pageIndex" :total="tableInfo.total" :page-size="tableInfo.pageSize" :layout="['total', 'prev', 'next', 'jumper']"></v-pagination>
                            <span class="page-total">{{pageCount}}</span>
                        </div> 
                        <el-form :inline="true"  class="search-form" size="mini">
                            <el-form-item label="">
                                <el-input v-model="searchText" class="search-input" placeholder="请输入关键词" width="150px"></el-input>
                                <el-button type="primary" @click="onSubmit">查询</el-button>
                            </el-form-item>  
                        </el-form>
                    </div>
                </div>
            </el-card>
        </div>
      </el-form-item>
    </div>
  </el-col>    
</template>

<script>
import 'vue-easytable/libs/themes-base/index.css'
import {VTable,VPagination} from 'vue-easytable'
export default {
    props:['param','toolSize','ruleFormValue'],
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


            // mcmcshow:'',
            // MC:'',
            // BH:'',
            // ChangeValue: false,//判断input值是否发生变化
            // tooltipShow: true,//是否显示tooltip
            // MCShow: true,//是否显示input隐藏值
            // initData:{},//表格初始化数据
            // rowData:{},//点击放大镜表格行数据
            // blurData:{},//失去焦点时匹配到的数据
            // helpShow: false,//弹出层显示
            // searchText:'',
            // showtable:false, //导出excel时候再挂载隐藏表格
            // submitData:{},
            // startIndex:0,
            // tableInfo: {
            //     total:50,
            //     tableType:0,//明细表还是复杂表
            //     pageIndex:1,
            //     pageSize:40,
            //     queryParams:{}, //查询参数           
            //     showExport:false,
            //     columnSumFlag:false,//是否列数据汇总
            //     rowSumFlag: false, //行数据汇总
            //     rowHeaders:[],//需要合并的列
            //     multipleSort: false,
            //     sumFlag: false, //是否需要合计
            //     title:'', //表格标题
            //     tableData: [],
            //     columns: [],
            //     titleRows: []
            // },

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
            var data = { queryText:''};
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
                    alert('未找到帮助，应该打开帮助');
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



        // greet(val){
        //    //console.log(val)
        // },



        // warnOpen(val) {
        //     this.$notify.error({
        //         title: '错误',
        //         message: val
        //     })
        // },
        // getTableInfo(){
        //     const url ='api/help/init'; 
        //     var params = {};
        //     params.helpID = this.qitem.helpID
        //     params.helpTJ = this.qitem.helpConditions
        //     params.helpBH = this.qitem.helpXH
        //     params.queryText =''
        //     this.$axios({
        //         method: 'post',
        //         url:url,
        //         data: params
        //     }).then((res)=>{
        //         console.log(res.data);
        //         this.initData =res.data;                
        //     })
        //     .catch((res) => {
        //         this.warnOpen(res.response.data)
        //     }) 
        // },
        // getSearchData(pageIndex){
        //     var params = {};
        //     const url ='api/help/search'; 
        //     var params = {};
        //     params.helpID = this.qitem.helpID
        //     params.helpTJ = this.qitem.helpConditions
        //     params.helpBH = this.qitem.helpXH
        //     params.queryText = this.searchText
        //     params.pageIndex = this.pageIndex
              
        //     //console.log(pageIndex,pageSize,params);
        //     this.$axios({
        //         method: 'post',
        //         url:url,
        //         data:params
        //     }).then((res)=>{
        //         //console.log(res);
        //         var data =res.data;
        //         if(data){
        //             this.total = data.total
        //             this.$set(this.tableInfo,'tableData',data.rowData)
        //             this.isSubmit = false 
        //         }
        //     })
        //     .catch((res) => {
        //         NProgress.done(); 
        //         this.warnOpen(res.response.data)
        //     }) 
        // },


        // showMC(){ //input失去焦点时
        //     this.MCShow = true;
        //     if(this.ChangeValue){
        //         const url ='api/help/onblur'; 
        //         var params = {};
        //         params.helpID = this.qitem.helpID
        //         params.helpTJ = this.qitem.helpConditions
        //         params.helpBH = this.qitem.helpXH
        //         params.queryText = this.myrulename
        //         this.$axios({
        //             method: 'post',
        //             url:url,
        //             data: params
        //         }).then((res)=>{
        //             console.log(res.data);
        //             var data =res.data;
        //             if(data.result){
        //                 this.blurData = data
        //                 var submitVal = this.item.contentType    
        //                 this.myrulename = data[submitVal]
        //                 this.mcmcshow = data['F_MC']
        //                 this.BH = data['F_BH']                   
        //             }else{
        //                 this.blurData = ''
        //                 this.rowData = ''
        //                 this.mcmcshow = ''
        //                 this.BH = ''
        //                 this.tooltipShow = true
        //                 this.helpShow= true
        //                 this.searchText = this.myrulename
        //                 this.tableInfo = Object.assign({},this.tableInfo,this.initData)
        //             }
                    
        //         })
        //         .catch((res) => {
        //             NProgress.done(); 
        //             this.warnOpen(res.response.data)
        //         }) 
        //     }
        //     this.ChangeValue = false
        // },
        // hideMC(){
        //     this.MCShow = false;
        // }
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
    height: 24px;
    line-height: 24px;
    cursor: pointer;
}
body .el-form-item__content{
    position: relative;
}
body .el-icon-zoom-in{
    position: absolute;
    top: 5px;
    right: 5px;
    font-size: 18px;
    color: #C3C5C8;
}
body .el-icon-zoom-in:hover{
    color: #02AFEE;
    cursor: pointer;
} 
body .el-card__header{
    padding: 0px 10px;
    background-color: #F3F7FB;   
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
    width: 50px;
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
    
</style>