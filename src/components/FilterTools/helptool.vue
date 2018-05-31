<template>
  <el-col v-if="item" :span="6">
    <div class="grid-content">
      <el-form-item :label="item.title" :prop="item.id" class="filtertool-text help-tool">
        <el-tooltip :disabled="false" :content="BHMC" placement="bottom-start" offset="">
            <el-input class="help-input" ref="helpInput" v-model="myrulename" :disabled="item.readonly" @focus="hideMC()" @blur="showMC()" ></el-input>
        </el-tooltip>
        <i class="help-input-title" v-show="MCShow" @click="inputFocus()">{{rowData.F_MC}}</i>
        <i class="el-icon-question" @click="openHelp"></i>
        <div v-if="helpShow" class="help-wrapper"  v-drag="greet" id="drag" :style="style">
            <el-card class="box-card">
                <div slot="header" class="clearfix">
                    <span class="card-title">{{tableConfig.title}}</span>
                    <img class="icon-close"  @click="closeHelp" src="../../assets/image/close2.png">
                </div>
                <div  class="content-wapper">
                    <v-table id=""
                        :class="colorSeries"
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
                        :row-click="rowClick"
                        even-bg-color="#f2f2f2"
                        :title-rows="tableConfig.titleRows"
                        :columns="tableConfig.columns"
                        :table-data="tableConfig.tableData"
                        :paging-index="(pageIndex-1)*pageSize"
                        :title-row-height="22"
                        :row-height="24"
                        >
                    </v-table>
                    <div class="footer-wapper clear">
                        <div  class="mt20 mb20 bold page-wrapper">
                            <v-pagination size="small" @page-change="pageChange" :page-index="pageIndex" :total="total" :page-size="pageSize" :layout="['total', 'prev', 'next', 'jumper']"></v-pagination>
                            <span class="page-total">{{pageIndex+'/'+pageTotalCount}}</span>
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
import NProgress from 'nprogress'
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
            tooltipShow: false,//是否显示tooltip
            MCShow: true,//是否显示input隐藏值
            rowData:{},//点击式行数据
            qitem: this.item,
            helpShow: false,
            searchText:'',
            myrulename:this.rulename,
            myitem: this.item,
            showtable:false, //导出excel时候再挂载隐藏表格
            colorSeries:'wathet-style', //表格颜色风格默认样式
            total:0,
            submitData:{},
            startIndex:0,
            sortMapArray:[],//合并单元格rowspan-count
            allArray:[],//存储所有和并列的数据用于复原表格
            footer: [],
            sumColumns:[],//所有需要footer合计的列
            spanColumns:[],//所有需要合并单元格的列
            frozenColumns:[],//所有需要冻结的列
            queryImmediately:false,//初始化后立即查询数据
            showExport:false,
            showFooter:false,
            tableType:0,//明细表还是复杂表
            isSubmit:false,//是否由查询触发的请求
            pageTotal:0,
            pageIndex:1,
            pageSize:10,
            tableConfig: {
                multipleSort: false,
                sumFlag: false, //是否需要合计
                title:'', //表格标题
                tableData: [],
                columns: [],
                titleRows: []
            },
            style: {
                width: '600px',
                height: '422px',
                position: 'fixed',
                right: 'calc(50% - 300px)',
                top: '50px'
            }
        }
    },
    computed:{
        pageTotalCount(){
            var yu = this.total%this.pageSize
            if(yu){
                return parseInt(this.total/this.pageSize) + 1
            }else{
                return parseInt(this.total/this.pageSize)
            }
        },
        BHMC(){
            return this.rowData.F_BH+'-'+this.rowData.F_MC
        }
    },
    methods:{
        greet(val){
           //console.log(val)
        },
        openHelp(){
            this.helpShow = true
        },
        closeHelp(){
            this.helpShow = false
        },
        onSubmit(){
            this.getSearchData()
        },
        warnOpen(val) {
            this.$notify.error({
                title: '错误',
                message: val
            })
        },
        getTableInfo(){
            NProgress.start();
            const url ='api/help/init'; 
            var params = {};
            params.helpID = this.qitem.helpID
            params.helpTJ = this.qitem.helpConditions
            params.helpBH = this.qitem.helpXH
            this.$axios({
                method: 'post',
                url:url,
                data: params
            }).then((res)=>{
                console.log(res.data);
                NProgress.done();
                var data =res.data;
                this.total = data.total*1,
                this.queryParams = data.queryParams,
                this.queryImmediately = data.queryImmediately,
                this.showExport = data.showExport,
                this.showFooter = data.columnSumFlag,
                this.isrowSum = data.rowSumFlag,
                this.isMerge = data. isMerge,
                this.pageSize = data.pageSize * 1,
                this.$set(this.tableConfig,'sumFlag',data.sumFlag)
                this.$set(this.tableConfig,'titleRows',data.titleRows)
                this.$set(this.tableConfig,'title',data.title)
                this.$set(this.tableConfig,'tableData',data.tableData)
                this.$set(this.tableConfig,'columns',data.columns)
                console.log(this.tableConfig.tableData)
                
            })
            .catch((res) => {
                NProgress.done(); 
                this.warnOpen(res.response.data)
            }) 
        },
        getSearchData(pageIndex){
            NProgress.start();
            var params = {};
            NProgress.start();
            const url ='api/help/search'; 
            var params = {};
            params.helpID = this.qitem.helpID
            params.helpTJ = this.qitem.helpConditions
            params.helpBH = this.qitem.helpXH
            params.queryText = this.searchText
            params.pageIndex = this.pageIndex
              
            //console.log(pageIndex,pageSize,params);
            this.$axios({
                method: 'post',
                url:url,
                data:params
            }).then((res)=>{
                NProgress.done();
                //console.log(res);
                var data =res.data;
                if(data && !this.isSubmit || this.tableType == 0){
                    this.total = data.total
                    this.$set(this.tableConfig,'tableData',data.rowData)
                    this.isSubmit = false 
                }
            })
            .catch((res) => {
                NProgress.done(); 
                this.warnOpen(res.response.data)
            }) 
        },
        pageChange(pageIndex){ 
            this.pageIndex = pageIndex;
            this.getSearchData(pageIndex);
        },
        rowClick(rowIndex, rowData, column){
            console.log(rowData)
            this.rowData = rowData 
            var submitVal = 'F_'+ this.item.contentType    
            this.myrulename = rowData[submitVal]
        },
        showMC(){
            this.MCShow = true;
        },
        hideMC(){
            this.MCShow = false;
        },
        inputFocus(){
            this.$refs.helpInput.focus();
        }
    },
    watch:{
        myrulename:function(val,oldval){  
            //console.log(val)  
            this.$emit("on-result-change",[val,this.myitem.id,this.myitem.componentName])
        },
        item:{
            handler(newValue, oldValue) {
                console.log(newValue)  
                this.getTableInfo()
            },  
    　　　　deep: true 
        }
    },
    created(){
        if(this.item){
            this.getTableInfo()
        }
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
body .el-icon-question{
    position: absolute;
    top: 5px;
    right: 5px;
    font-size: 18px;
    color: #DFE0E4;
}
body .el-icon-question:hover{
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
    background: #EEF2FC;
    color: #8E9191;
}
body .el-tooltip__popper[x-placement^=bottom] {
    margin-top: 5px;
}
body .el-tooltip__popper {
    position: absolute;
    border-radius: 4px;
    padding: 4px;
    background: #EEF2FC;
}
body .el-tooltip__popper[x-placement^=bottom] .popper__arrow {
    top: -5px;
    border-bottom-color: #EEF2FC;
}
body .el-tooltip__popper .popper__arrow::after {
    border-width: 4px;
}
</style>