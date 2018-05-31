<template>
    <div>
        <table v-if="showtable" id="exportTable" style="display:none">
            <tbody>
                
            </tbody>
        </table>
        <div class="title-wrapper" >     
            <p>{{tableConfig.title}}</p>
            <el-dropdown  v-show="showExport" @click="exportExcel" class="exportbtn">
                <span class="el-dropdown-link">
                    <img src="../../assets/image/excel.png" width="20" height="20" alt="">
                </span>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item>导出当前页</el-dropdown-item>
                    <el-dropdown-item>导出全部</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        </div>
       <v-table id="serverTable"
             :class="colorSeries"
              is-vertical-resize
              :vertical-resize-offset='60'
              is-horizontal-resize
              column-width-drag
              style="width:100%"
              :multiple-sort="false"
              :min-height="340"
              even-bg-color="#f2f2f2"
              :title-rows="tableConfig.titleRows"
              :columns="tableConfig.columns"
              :table-data="tableConfig.tableData"
              :footer-cell-class-name="setFooterCellClass"
              :footer="footer"
              :footer-row-height="40"
              row-hover-color="#eee"
              row-click-color="#edf7ff"
              @sort-change="sortChange"
              :paging-index="(pageIndex-1)*pageSize"
              :title-row-height="22"
              :row-height="24"
              :cell-merge="cellMerge"
              >
      </v-table>
       <div  class="mt20 mb20 bold">
        <v-pagination size="small" @page-change="pageChange" @page-size-change="pageSizeChange" :page-index="pageIndex" :total="total" :page-size="pageSize" :layout="['total', 'prev', 'pager', 'next', 'sizer', 'jumper']"></v-pagination>
       </div>
  </div>
</template>
<script>
import XLSX from '../../utils/xlsx.js'
import NProgress from 'nprogress'
export default{
    props:{
        filterData:{//查询参数
            type:Object
        },
        resetpageIndex:{//查询是重置页面下标
            
        },
        routeParams:{ //路由参数
            type:Object
        },
        resTableInit:{ //表格初始化配置
            type:Object
        }
    },
    data(){
        return {
            showtable:false, //导出excel时候再挂载隐藏表格
            colorSeries:'wathet-style', //表格颜色风格默认样式
            total:50,
            submitData:{},
            startIndex:0,
            sortMapArray:[],//合并单元格rowspan-count
            allArray:[],//存储所有和并列的数据用于复原表格
            footer: [],
            sumColumns:[],//所有需要footer合计的列
            spanColumns:[],//所有需要合并单元格的列
            frozenColumns:[],//所有需要冻结的列
            queryParams:{}, //查询参数
            queryImmediately:false,//初始化后立即查询数据
            showExport:false,
            showFooter:false,
            isrowSum: false, //行数据汇总
            isMerge: false,//客户定义单元格是否合并
            isCellMerge: true,//单元格是否合并
            tableType:0,//明细表还是复杂表
            isSubmit:false,//是否由查询触发的请求
            pageIndex:1,
            pageSize:10,
            tableConfig: {
                rowHeaders:[{field:'address'},{field:'hobby'}],//需要合并的列
                multipleSort: false,
                sumFlag: false, //是否需要合计
                title:'', //表格标题
                tableData: [],
                columns: [],
                titleRows: []
            }
        }
    },
    methods:{
        warnOpen(val) {
            this.$notify.error({
                title: '错误',
                message: val
            })
        },
        getTableInfo(val){
            var data = val;
            if(data){
                this.tableType = parseInt(data.tableType)
                if(this.tableType == 0){
                    this.colorSeries = 'green-style'
                }
                this.total = data.total,
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
                
                if(this.queryImmediately){
                    this.getTableData(this.pageIndex,this.pageSize);  
                }
                this.countSumCol(data) 
            }
        },
        getTableData(pageIndex,pageSize){
            NProgress.start();
            var params = {};
            if(this.tableType == 0 || !this.isSubmit){
                var url ='api/report/search';  
            }else if(this.tableType == 2 && this.isSubmit){
                var url ='api/report/searchAndInit'; 
            }            
            params.engine = this.routeParams.engine 
            params.id =  this.routeParams.id;
            params.pageIndex =  pageIndex       //你要传给后台的参数值 key/value
            params.pageSize = pageSize
            params.condition = this.submitData
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
                    if(this.showFooter){ //列数据汇总
                        this.setFooterData(data);
                    }
                    if(this.isrowSum){ //行数据汇总
                        this.rowSum();
                    } 
                    this.isMerge = true
                    if(this.isMerge){ //合并单元格计算
                        this.mergeCells()   
                    }
                    this.cellFormatter()
                 
                }else if(data && this.tableType == 2 && this.isSubmit){
                    console.log(data)
                    this.total = data.total
                    this.$set(this.tableConfig,'titleRows',data.titleRows)
                    this.$set(this.tableConfig,'columns',data.columns)
                    this.$set(this.tableConfig,'tableData',data.tableData)
                    this.countSumCol(data.columns).then(()=>{
                        if(this.showFooter){ //列数据汇总
                            this.setFooterData(data);
                        }
                        if(this.isrowSum){ //行数据汇总
                            this.rowSum();
                        } 
                        this.isMerge = true
                        if(this.isMerge){ //合并单元格计算
                            this.mergeCells()   
                        }
                        this.cellFormatter()
                        this.isSubmit = false 
                    }) 
                }
            })
            .catch((res) => {
                NProgress.done(); 
                this.warnOpen(res.response.data)
            }) 
        },
        pageChange(pageIndex){
            this.pageIndex = pageIndex;
            //console.log(this.pageIndex,'index')
            this.getTableData(pageIndex,this.pageSize);
        },
        pageSizeChange(pageSize){ 
            this.pageIndex = 1;
            this.pageSize = pageSize;
            this.getTableData(1,pageSize);
        },
        sortChange2(params){
            this.sortChange(params).then(()=>{
                this.isCellMerge = true
            }) 
        },
        sortChange(params){
            this.isCellMerge = false
            if(!this.multipleSort){//单列排序
                for(let i in params){
                    if(isNaN(this.tableConfig.tableData[0][i])){
                        this.tableConfig.tableData.sort(function (a, b) {
                            if (params[i] === 'asc'){
                                return a[i].localeCompare(b[i])
                            }else if(params[i] === 'desc'){
                                return b[i].localeCompare(a[i])
                            }else{
                                return 0;
                            }
                        });
                    }else{
                        this.tableConfig.tableData.sort(function (a, b) {
                            if (params[i] === 'asc'){
                                return a[i] - b[i];  
                            }else if(params[i] === 'desc'){
                                    return b[i] - a[i];
                            }else{
                                return 0;
                            }
                        });
                    }
                }
            }
            /*this.mergeCells();
            this.allCells();
            console.log(this.allArray)
            console.log(this.sortMapArray)
            setTimeout(()=>{
                this.isCellMerge = true
            },500)
            return  Promise.resolve();*/
        },
        setFooterData(data){ //列数据统计
            let result = [],
                sumVal = ['求和'],
                columns = this.tableConfig.columns
            for (let i=1; i<columns.length; i++) {
                let column = columns[i];
                if(column.sumFlag){
                    var field = column.field
                    var amounts =  data.map(item => {
                        return item[field]
                    })
                    sumVal.push(
                        amounts.reduce((prev, curr) => {
                            return parseInt(prev) + parseInt(curr);
                        }, 0)
                    )
                }else{
                    sumVal.push('-')
                }    
            }
            result.push(sumVal);
            this.footer = result;
        },
        // 设置 footer-cell-class
        setFooterCellClass(rowIndex, colIndex, value){ //列数据统计添加class
            if (colIndex === 0) {
                return 'footer-cell-class-name-title'
            } else {
                return 'footer-cell-class-name-normal'
            }
        },
        rowSum(){ //行数据统计
            var columns = this.tableConfig.columns
            var colLast = columns[columns.length-1]
            this.$set(colLast,"formatter",(rowData) => {          				
                var count = 0
                var fields = this.sumColumns 
                for(var i in rowData){
                    for(var j in fields){
                        if(i==fields[j]){
                            count +=parseFloat(rowData[i]);
                        }
                    }   					
                }
                //console.log(count)
                return count;
            });
        },
        countSumCol(columns){     
            for (let i=0; i<columns.length; i++) {
                let column = columns[i];
                if(column.sumFlag){ //需要汇总列的field数组      
                    var field = column.field
                    this.sumColumns.push(field)
                }  
                if(column.groupby){ //需要合并单元格列的field数组      
                    var field = column.field
                    this.spanColumns.push(field)
                }
                if(column.isFrozen){ //需要冻结列的field数组      
                    var field = column.field
                    var fieldObj ={}
                    fieldObj.index=i;
                    fieldObj.field =field
                    this.frozenColumns.push(fieldObj)
                }      
            }
            return  Promise.resolve()        
        },
        countCols(columns){   //所有列field数组
            var columnfields = []        
            for (let i=1; i<columns.length; i++) {
                let column = columns[i];
                var field = column.field
                columnfields.push(field)    
            }
            return columnfields        
        },
        cellMerge(rowIndex,rowData,field){
            var spanColumns =this.spanColumns;
            //console.log(spanColumns)
            for (var j  in this.sortMapArray) {
                var startIndex = 0;
                var sortMap = this.sortMapArray[j]
                for (var prop in sortMap) {
                    var count = sortMap[prop] * 1;
                    if(rowIndex == startIndex && field == spanColumns[j]){
                        //this.startIndex +=count
                        return {
                            colSpan: 1,
                            rowSpan: count,
                            content: prop 
                        }
                    }
                    startIndex += count;
                    //console.log(startIndex)
                }                   
            }
        },
        cellSeparate(rowIndex,rowData,field){
            var spanColumns =this.spanColumns;
            //console.log(spanColumns)
            for (var j  in this.allArray) {
                var startIndex = 0;
                var sortMap = this.allArray[j]
                for (var prop in sortMap) {
                    if(rowIndex == startIndex && field == spanColumns[j]){
                        //this.startIndex +=count
                        return {
                            colSpan: 1,
                            rowSpan: 1,
                            content: rowData[field]
                        }
                    }
                    startIndex += 1;
                    //console.log(startIndex)
                }                   
            }
        },
        allCells(){
            var spanColumns =this.spanColumns;
            var data = this.tableConfig.tableData;
            var allArray =[];
            for (var j=0; j<spanColumns.length; j++) {
                var fieldName = spanColumns[j];
                var sortMap ={}
                for (var i =0; i < this.pageSize; i++) {
                    for (var prop in data[i]) {
                        if (prop == fieldName) {
                            var key = data[i][prop]
                            sortMap[key] = 1;
                            break;
                        }
                    }
                }
                allArray.push(sortMap)
            }
            //this.sortMap=sortMap;
            this.allArray = allArray 
        },
        mergeCells() {
            //声明一个map计算相同属性值在data对象出现的次数和
            console.log(this.spanColumns)
            var spanColumns =this.spanColumns;
            var data = this.tableConfig.tableData;
            var startIndex = 0;
            var endIndex = data.length;
            var sortMapArray =[];
            for (var j=0; j<spanColumns.length; j++) {
                var fieldName = spanColumns[j];
                var sortMap ={}
                for (var i =0; i < this.pageSize; i++) {
                    for (var prop in data[i]) {
                        if (prop == fieldName) {
                            var key = data[i][prop]
                            if (sortMap.hasOwnProperty(key)) {
                                sortMap[key] = sortMap[key] * 1 + 1;
                            } else {
                                sortMap[key] = 1;
                            }
                            break;
                        }
                    }
                }
                sortMapArray.push(sortMap)
            }
            //this.sortMap=sortMap;
            this.sortMapArray = sortMapArray
            console.log(this.sortMapArray)
        },
        cellFormatter(){ //小数位数
            var columns = this.tableConfig.columns
            for (let i=0;i<columns.length;i++){
                var n = parseInt(columns[i].formatterContent)
                if(columns[i].formatterType == 'N' && n>=0 && n<20){
                    this.$set(columns[i],"formatter",(()=>{
                        var num = n
                        return (rowData,rowIndex,pagingIndex,field) => {         				
                            var number=rowData[field] * 1;
                            return  number.toFixed(num);
                        }
                    })(n));         
                }
            }    
        },
        nofrozencol(){
            for(let o of this.frozenColumns){
                console.log(o)
               this.$set(this.tableConfig.columns[o.index],o.field,false)
            }
        },
        frozencol(){
            for(let o of this.frozenColumns){
                this.$set(this.tableConfig.columns[o.index],o.field,true)
            }
        },
        myexportExcel(){
            var head= {};
            var headColLength = this.tableConfig.columns.length;
            var headRowLength = 1;
            var keyMap =[];
            var data;
            var dataKeys;
            var cols = [];

            //明细表
            if(this.tableType==0){
                this.tableConfig.columns.forEach((col,i)=>{
                    head[XLSX.xlsxUtils.convertNum2Letter(i+1)+1] = {"v":col.title};
                    cols.push({  wpx: col.width/2  });
                    keyMap.push(col.field);
                });
            }
            else{
                //var head = { "A1": { "v": "日期" }, "B1": { "v": "配送信息" }, "C1": { "v": "" }, "D1": { "v": "" }, "E1": { "v": "" }, "F1": { "v": "" }, "A2": { "v": "" }, "B2": { "v": "姓名" }, "C2": { "v": "地址" }, "D2": { "v": "" }, "E2": { "v": "" }, "F2": { "v": "" }, "A3": { "v": "" }, "B3": { "v": "" }, "C3": { "v": "省份" }, "D3": { "v": "市区" }, "E3": { "v": "地址" }, "F3": { "v": "邮编" },
                // "!merges": [{ "s": { "c": 1, "r": 0 }, "e": { "c": 5, "r": 0 } }, { "s": { "c": 2, "r": 1 }, "e": { "c": 5, "r": 1 } }, { "s": { "c": 0, "r": 0 }, "e": { "c": 0, "r": 2 } }, { "s": { "c": 1, "r": 1 }, "e": { "c": 1, "r": 2 } }] };
                if(!this.tableConfig) return;
                headRowLength = this.tableConfig.titleRows.length;
                var titleRows = JSON.parse(JSON.stringify(this.tableConfig.titleRows));
                var merges = [];
           
                for(let i = 0; i<headRowLength;i++){
                    this.tableConfig.columns.forEach((col,j)=>{
                        //找到包含该column的titleRow
                        var r = titleRows[i].find((n) => n.fields.indexOf(col.field)>-1);
                        if(i==0){
                            keyMap.push(col.field);
                            cols.push({  wpx: col.width/2  });
                        }
                        if(r.isInArray){
                            head[XLSX.xlsxUtils.convertNum2Letter(j+1)+(i+1)] = {"v":""};
                        }
                        else{
                            r.isInArray = true;
                            let name = XLSX.xlsxUtils.convertNum2Letter(j+1)+(i+1);
                            head[name] = {"v":r.title};
                            //设置xlsx单元格样式
                            if(i==0)
                                 head[name].s =  { alignment: {vertical: "center",horizontal: "center",indent:0,wrapText: true}};
                            if(r.colspan>1)
                                 merges.push({"s":{"c":j,"r":i},"e":{"c":j+r.colspan-1,"r":i}});
                        }
                    });
                }
                head["!merges"] = merges;
                head["!cols"] = cols;                
            }

            if(this.tableConfig.tableData && this.tableConfig.tableData.length>0){
                data = XLSX.xlsxUtils.format2Sheet(this.tableConfig.tableData,0,headRowLength,keyMap);
                dataKeys = Object.keys(data);
                for (let k in head) data[k] = head[k];//追加列头
            }
            else{
                data = head;
                dataKeys = Object.keys(data);
            }
            let wb = XLSX.xlsxUtils.format2WB(data, "sheet1", undefined, "A1:"+dataKeys[dataKeys.length - 1]);
            let fileName =this.tableConfig.title+".xlsx";
            XLSX.xlsxUtils.saveAs(XLSX.xlsxUtils.format2Blob(wb),fileName);
=======
>>>>>>> 357b378c0e2831bea4a512c71695fe1cea9d05cc
        }
    },
    created(){
        this.getTableInfo(this.resTableInit);
    },
    watch:{
        tableResponse: {  
    　　　　handler(newValue, oldValue) {  
    　　　　　　 this.total = newValue.total;
                this.tableConfig.tableData = newValue.rowData;  
    　　　　},  
    　　　　deep: true  
　　    },
        filterData: {  
    　　　　handler(newValue, oldValue) {
                //console.log(newValue)  
                this.submitData = newValue; 
    　　　　},  
    　　　　deep: true  
　　    },
        resetpageIndex:function(val){
            //console.log(val)
            this.pageIndex =1;
            this.isSubmit = true;
            this.pageChange(1)
        }
  }
}  
</script>
<style>
    .title-wrapper {
        position: relative;
    }
    .title-wrapper p {
        height: 25px;
        line-height: 25px;
        padding-left: 4px;
        font-size: 14px;
        font-weight: 400;
        margin: 0;
        text-align: center
    }
    .exportbtn {
        position: absolute;
        right: 5px;
        bottom: 0px;
    }
    .v-table-class{
        font-size: 12px;
    }
    .v-table-body-class{
        color:#1a1a1a;
    }
    .v-table-sort-icon i{
        color: #fff
    }
    .v-table-sort-icon i:first-child {
        top: -2px;
    }
    .green-style .v-table-title-class td{
        background-color: #29926F;
        font-weight: bold;
        color: #fff;
        white-space: nowrap;
        overflow: hidden;
    } 
     .green-style .v-table-body-class tr:nth-child(even){
        background-color:rgba(77, 147, 117, 0.05)!important
    }  
    .green-style .v-table-body-class tr:nth-child(odd){
        background-color: #D7EAE2   !important;
    }
     .green-style .v-table-body-class tr:hover{
        background-color:rgba(77, 147, 117, 0.05) !important;
    }
     .green-style .v-page-li-active {
        border-color: #2db7f5;
        background-color: #2db7f5;
    }
    .v-page-li-active:hover {
        border-color: #2db7f5;
        background-color: #2db7f5;
    }
    .v-table--class .mt20 {
        margin-top: 5px;
    }
    .title-cell-class-name-test1 {
        background-color: #2db7f5;
        color:#fff;
    }
    .title-cell-class-name-test2 {
        background-color: #f60;
        color:#fff;
    }
     .blue-style .v-table-title-class td{
        background-color: #0A5EAD;
        font-weight: bold;
        color: #fff;
        white-space: nowrap;
        overflow: hidden;
    } 
     .blue-style .v-table-body-class tr:nth-child(even){
        background-color: #F3F7FB!important
    }  
     .blue-style .v-table-body-class tr:nth-child(odd){
        background-color:  #D1E1EE !important;
        color:#1a1a1a;
    }
     .blue-style .v-table-body-class tr:hover{
        background-color:#D1E1EE !important;
    }
     .blue-style .v-page-li-active {
        border-color: #2db7f5;
        background-color: #2db7f5;
    }


    .wathet-style .v-table-title-class td{
        background-color: #13B3BF;
        font-weight: bold;
        color: #fff;
        white-space: nowrap;
        overflow: hidden;
    } 
     .wathet-style .v-table-body-class tr:nth-child(even){
        background-color: #F3FBFC!important
    }  
     .wathet-style .v-table-body-class tr:nth-child(odd){
        background-color:  #D1F0F2 !important;
        color:#1a1a1a;
    }
     .wathet-style .v-table-body-class tr:hover{
        background-color:#D1F0F2 !important;
    }
     .wathet-style .v-page-li-active {
        border-color: #2db7f5;
        background-color: #2db7f5;
    }

    .footer-cell-class-name-title {
        background-color: #f60;
        color: #fff;
    }
    .footer-cell-class-name-normal {
        color: red;
    }
    .v-table-footer-class {
        height: 40px !important
    }
    ::-webkit-scrollbar{  
        width:8px;  
        height:8px;  
    }  
    ::-webkit-scrollbar-track{  
        background: #f6f6f6;  
        border-radius:4px;  
    }  
    ::-webkit-scrollbar-thumb{  
        background: #aaa;  
        border-radius:4px;  
    }  
    ::-webkit-scrollbar-thumb:hover{  
        background: #747474;  
    }  
    ::-webkit-scrollbar-corner{  
        background: #f6f6f6;  
    }  
    .v-table-body-class::-webkit-scrollbar{  
        width:8px;  
        height:8px;  
    }  
    .v-table-body-class::-webkit-scrollbar-track{  
        background: #f6f6f6;  
        border-radius:4px;  
    }  
    .v-table-body-class::-webkit-scrollbar-thumb{  
        background: #aaa;  
        border-radius:4px;  
    }  
    .v-table-body-class::-webkit-scrollbar-thumb:hover{  
        background: #747474;  
    }  
    .v-table-body-class::-webkit-scrollbar-corner{  
        background: #f6f6f6;  
    } 
    .v-table-views {
        border: 1px solid transparent;
    } 

</style>