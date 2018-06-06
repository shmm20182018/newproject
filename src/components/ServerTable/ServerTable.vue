<template>
    <div >
        <div class="title-wrapper" >     
            <p>{{interTableInfo.title}}</p>
            <el-dropdown  class="exportbtn">
                  <i class="btn el-icon-document"></i>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item  @click.native="exportExcel" >导出当前页</el-dropdown-item>
                    <el-dropdown-item>导出全部</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        </div>
       <v-table id="serverTable"
              class="wathet-style"
              is-vertical-resize
              :vertical-resize-offset='60'
              is-horizontal-resize
              column-width-drag
              style="width:100%"
              :error-content-height = '200'
              :multiple-sort = "false"
              even-bg-color="#f2f2f2"
              :title-rows="interTableInfo.titleRows"
              :columns="interTableInfo.columns"
              :table-data="interTableInfo.tableData"
              :footer-cell-class-name="setFooterCellClass"
              :footer="footer"
              :footer-row-height="40"
              row-hover-color="#eee"
              row-click-color="#edf7ff"
              @sort-change="sortChange"
              :paging-index="(pageIndex-1)*interTableInfo.pageSize"
              :title-row-height="22"
              :row-height="24"
              :cell-merge="cellMerge"
              >
      </v-table>
       <div  class="mt20 mb20 bold table-pagination">
        <v-pagination size="small" @page-change="pageChange" 
                                   @page-size-change="pageSizeChange"  
                                   :pageSizeOption=[10,30,50,70,100]  
                                   :total="interTableInfo.total" 
                                   :page-size="interTableInfo.pageSize" 
                                   :page-index="pageIndex"
                                   :layout="['total', 'prev', 'pager', 'next', 'sizer', 'jumper']"></v-pagination>
       </div>
  </div>
</template>
<script>
import 'vue-easytable/libs/themes-base/index.css'
import {VTable,VPagination} from 'vue-easytable'
import XLSX from '../../utils/xlsx.js'

export default {
    props:['tableInfo','queryParams','id','engine'],
    data(){
        return {  
            //本地缓存表格数据
            pageIndex:1,
            interTableData:[],
            interTableInfo:{},

            sortMapArray:[],//合并单元格rowspan-count
            allArray:[],//存储所有和并列的数据用于复原表格
            footer: [],
            sumColumns:[],//所有需要footer合计的列
            spanColumns:[],//所有需要合并单元格的列
            frozenColumns:[],//所有需要冻结的列

        }
    },
    computed:{
        requestParams:function(){
            return {
                id:this.id,
                engine:this.engine,
                pageIndex:this.pageIndex,
                condition:this.queryParams,
                pageSize: this.interTableInfo.pageSize
        }
    }
    },
    watch:{
        'tableInfo':{
            handler: function (newVal) {
                this.interTableInfo = Object.assign({},this.interTableInfo,this.tableInfo);  
            },
            deep: true
        },
        'queryParams':{
            handler: function (newVal) {
                this.interTableData.length = 0;
            },
            deep: true
        }
    },
    methods:{
        pageChange(pageIndex){
            this.pageIndex = pageIndex;

            if(this.interTableData[pageIndex]){
                this.interTableInfo.tableData =  this.interTableData[pageIndex];
                return;
            }

            this.$http('post',"api/report/nextPage",this.requestParams).then((res)=>{
                this.interTableData[pageIndex] = res.data;
                this.reportInfo.tableData = res.data;
             });
        },
        pageSizeChange(pageSize){ 
            this.pageIndex = 1;
            this.$set(this.interTableInfo,'pageSize',pageSize);
            this.pageChange(1);
        },
        sortChange(params){
            this.isCellMerge = false
            var columns = this.interTableInfo.columns
            //console.log(params)
            if(!this.multipleSort){//单列排序
                for(let i in params){
                    if(params[i]){
                        for(let j=0;j<columns.length;j++){
                            if(columns[j]['field'] == i){
                                if(columns[j]['formatterType'] == 'N'){
                                    this.interTableInfo.tableData.sort(function (a, b) {
                                        if (params[i] === 'asc'){
                                            return a[i] - b[i];  
                                        }else if(params[i] === 'desc'){
                                                return b[i] - a[i];
                                        }else{
                                            return 0;
                                        }
                                    });
                                }else{
                                    this.interTableInfo.tableData.sort(function (a, b) {
                                        if (params[i] === 'asc'){
                                            return a[i].localeCompare(b[i])
                                        }else if(params[i] === 'desc'){
                                            return b[i].localeCompare(a[i])
                                        }else{
                                            return 0;
                                        }
                                    });
                                }
                            }
                        }
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
                columns = this.interTableInfo.columns
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
            var columns = this.interTableInfo.columns
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
            var data = this.interTableInfo.tableData;
            var allArray =[];
            for (var j=0; j<spanColumns.length; j++) {
                var fieldName = spanColumns[j];
                var sortMap ={}
                for (var i =0; i < this.interTableInfo.pageSize; i++) {
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
           // console.log(this.spanColumns)
            var spanColumns =this.spanColumns;
            var data = this.interTableInfo.tableData;
            var startIndex = 0;
            var endIndex = data.length;
            var sortMapArray =[];
            for (var j=0; j<spanColumns.length; j++) {
                var fieldName = spanColumns[j];
                var sortMap ={}
                for (var i =0; i < this.interTableInfo.pageSize; i++) {
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
            this.sortMapArray = sortMapArray
        },
        cellFormatter(){ //小数位数
            var columns = this.interTableInfo.columns
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
               this.$set(this.interTableInfo.columns[o.index],o.field,false)
            }
        },
        frozencol(){
            for(let o of this.frozenColumns){
                this.$set(this.interTableInfo.columns[o.index],o.field,true)
            }
        },   
        exportExcel(){
            var cols = [];
            var head= {"!cols":cols};
            var headColLength = this.interTableInfo.columns.length;
            var headRowLength = 1;
            var keyMap =[];
            var data;
            var dataKeys; 
            //明细表
            if(this.interTableInfo.tableType==0){
                this.interTableInfo.columns.forEach((col,i)=>{
                    head[XLSX.convertNum2Letter(i+1)+1] = {"v":col.title};
                    cols.push({  wpx: col.width/2  });
                    keyMap.push(col.field);
                });
            }
            else{
                //var head = { "A1": { "v": "日期" }, "B1": { "v": "配送信息" }, "C1": { "v": "" }, "D1": { "v": "" }, "E1": { "v": "" }, "F1": { "v": "" }, "A2": { "v": "" }, "B2": { "v": "姓名" }, "C2": { "v": "地址" }, "D2": { "v": "" }, "E2": { "v": "" }, "F2": { "v": "" }, "A3": { "v": "" }, "B3": { "v": "" }, "C3": { "v": "省份" }, "D3": { "v": "市区" }, "E3": { "v": "地址" }, "F3": { "v": "邮编" },
                // "!merges": [{ "s": { "c": 1, "r": 0 }, "e": { "c": 5, "r": 0 } }, { "s": { "c": 2, "r": 1 }, "e": { "c": 5, "r": 1 } }, { "s": { "c": 0, "r": 0 }, "e": { "c": 0, "r": 2 } }, { "s": { "c": 1, "r": 1 }, "e": { "c": 1, "r": 2 } }] };
                if(!this.interTableInfo) return;
                headRowLength = this.interTableInfo.titleRows.length;
                var titleRows = this.$Clone(this.interTableInfo.titleRows);
                var merges = [];
           
                for(let i = 0; i<headRowLength;i++){
                    this.interTableInfo.columns.forEach((col,j)=>{
                        //找到包含该column的titleRow
                        var r = titleRows[i].find((n) => n.fields.indexOf(col.field)>-1);
                        if(i==0){
                            keyMap.push(col.field);
                            cols.push({  wpx: col.width/2  });
                        }
                        if(r.isInArray){
                            head[XLSX.convertNum2Letter(j+1)+(i+1)] = {"v":""};
                        }
                        else{
                            r.isInArray = true;
                            let name = XLSX.convertNum2Letter(j+1)+(i+1);
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
            }
          

            if(this.interTableInfo.tableData && this.interTableInfo.tableData.length>0){
                data = XLSX.format2Sheet(this.interTableInfo.tableData,0,headRowLength,keyMap);
                dataKeys = Object.keys(data);
                for (let k in head) data[k] = head[k];//追加列头
            }
            else{
                data = head;
                dataKeys = Object.keys(data);
            }
            let wb = XLSX.format2WB(data, "sheet1", undefined, "A1:"+dataKeys[dataKeys.length - 1]);
            let fileName =this.interTableInfo.title+".xlsx";
            XLSX.saveAs(XLSX.format2Blob(wb),fileName);
        }
    },
    created(){
         this.interTableInfo = Object.assign({},this.interTableInfo,this.tableInfo); 
    },
    components: {
        VTable,
        VPagination
  }
}  
</script>
<style>
    .title-wrapper {
        position: relative;
        margin: 10px;

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
    .table-pagination{
        margin-top: 15px;
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
        width:12px;  
        height:12px;  
    }  
    ::-webkit-scrollbar-track{  
        background: #f6f6f6;  
        border-radius:6px;  
    }  
    ::-webkit-scrollbar-thumb{  
        background: #aaa;  
        border-radius:6px;  
    }  
    ::-webkit-scrollbar-thumb:hover{  
        background: #747474;  
    }  
    ::-webkit-scrollbar-corner{  
        background: #f6f6f6;  
    }  
    .v-table-body-class::-webkit-scrollbar{  
        width:10px;  
        height:10px;  
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
      
    } 
    .btn{
        font-size:25px;


    }

</style>