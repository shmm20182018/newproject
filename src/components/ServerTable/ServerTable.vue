<template>
    <div>
        <div class="title-wrapper">
            <h3>{{tableConfig.title}}</h3>
            <el-button v-show="showExport" @click="exportExcel" class="exportbtn"  size="medium" type="success">导出</el-button>
        </div>
       <v-table id="serverTable"
              is-vertical-resize
              :vertical-resize-offset='60'
              is-horizontal-resize
              style="width:100%"
              :multiple-sort="multipleSort"
              :min-height="390"
              even-bg-color="#f2f2f2"
              :title-rows="tableConfig.titleRows"
              :columns="tableConfig.columns"
              :table-data="tableConfig.tableData"
              row-hover-color="#eee"
              row-click-color="#edf7ff"
              @sort-change="sortChange"
              :paging-index="(pageIndex-1)*pageSize"
              :footer-cell-class-name="setFooterCellClass"
              :footer="footer"
              :footer-row-height="40"
             
              >
      </v-table>
       <div  class="mt20 mb20 bold">
        <v-pagination v-if="total>0" @page-change="pageChange" @page-size-change="pageSizeChange" :total="total" :page-size="pageSize" :layout="['total', 'prev', 'pager', 'next', 'sizer', 'jumper']"></v-pagination>
       </div>
  </div>
</template>
<script>
import FileSaver from 'file-saver'
import XLSX from 'xlsx'
export default{
    data(){
        return {
            multipleSort:true,
            total:50,
            startIndex:0,
            sortMapArray:[],//合并单元格rowspan-count
            allArray:[],//存储所有和并列的数据用于复原表格
            footer: [],
            sumColumns:[],//所有需要footer合计的列
            spanColumns:[],//所有需要合并单元格的列
            queryParams:{},
            queryImmediately:false,
            showExport:false,
            showFooter:false,
            isrowSum: false, //行数据汇总
            isMerge: false,//客户定义单元格是否合并
            isCellMerge: true,//单元格是否合并
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
        getTableInfo(tid){
            var openid = location.href.slice(12);
            console.log(openid)
            var params = new URLSearchParams();
            const url ='http://localhost/data/mock/tableInfo.php';    
            params.append('id', tid);       //你要传给后台的参数值 key/value
            //console.log(pageIndex,pageSize);
            this.$axios({
                method: 'get',
                url:url,
               // data: params
            }).then((res)=>{
                //console.log(res);
                var data =res.data;
                if(data){
                    this.total = data.total,
                    this.queryParams = data.queryParams,
                    this.queryImmediately = data.queryImmediately,
                    this.showExport = data.showExport,
                    this.showFooter = data.showFooter,
                    this.isrowSum = data.isrowSum,
                    this.isMerge = data. isMerge,
                    this.pageSize = data.pageSize * 1,
                    this.$set(this.tableConfig,'sumFlag',data.sumFlag)
                    this.$set(this.tableConfig,'columns',data.columns)
                    this.$set(this.tableConfig,'titleRows',data.titleRows)
                    this.$set(this.tableConfig,'title',data.title)
                    this.$set(this.tableConfig,'tableData',data.tableData)
                    if(this.queryImmediately){
                        this.getTableData(this.pageIndex,this.pageSize);  
                    }
                    this.countSumCol(data.columns) 
               }
            })
            .catch(function (response) {
                console.log(response);
            }) 
        },
        getTableData(pageIndex,pageSize){
            var params = new URLSearchParams();
            const url ='http://localhost/data/mock/tableData2.php';    
            params.append('pageIndex', pageIndex);       //你要传给后台的参数值 key/value
            params.append('pageSize', pageSize);
            //console.log(pageIndex,pageSize);
            this.$axios({
                method: 'post',
                url:url,
                data:params
            }).then((res)=>{
                //console.log(res);
                var data =res.data;
                if(data){
                    this.tableConfig.tableData = data;
                    if(this.showFooter){ //列数据汇总
                        this.setFooterData(data);
                    }
                    if(this.isrowSum){ //行数据汇总
                        this.rowSum();
                    } 
                    if(this.isMerge){ //合并单元格计算
                        this.mergeCells()   
                    }
                    //if(){
                        this.cellFormatter(2)
                    //}
                }
            })
            .catch(function (response) {
                console.log(response);
            }) 
        },
        pageChange(pageIndex){
            this.pageIndex = pageIndex;
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
            console.log(params)
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
            }else{//多列排序
                var orderArray = []
                for (let i in params){
                    if (params[i].length > 0){
                        var order={}
                        order.field = i
                        order.val = params[i]
                        orderArray.push(order)
                    }  
                }    
                this.tableConfig.tableData.sort((a, b) => {
                    for(let n=0;n<orderArray.length;n++){ 
                        let i=orderArray[n]['field']
                        console.log(n,i,orderArray)
                        if(isNaN(this.tableConfig.tableData[0][i])){    
                            if (params[i] === 'asc'){
                                if(a[i].localeCompare(b[i]) == 0){
                                    if(n+1 < orderArray.length){
                                        let c =orderArray[n+1]['field'];
                                        if(isNaN(this.tableConfig.tableData[0][c])){
                                            return  a[c].localeCompare(b[c])
                                        }else{
                                            return   a[c] - b[c]; 
                                        }
                                    }                                
                                }
                                    return a[i].localeCompare(b[i])
                                
                            }else if(params[i] === 'desc'){
                                if(a[i].localeCompare(b[i]) == 0){
                                    if(n+1 < orderArray.length){
                                        let c =orderArray[n+1]['field'];
                                        if(isNaN(this.tableConfig.tableData[0][c])){
                                            return  b[c].localeCompare(a[c])
                                        }else{
                                            return   b[c] - a[c]; 
                                        }
                                    } 
                                }
                                    return b[i].localeCompare(a[i])
                                
                            }else{
                                return 0;
                            }
                        }else{ 
                                if (params[i] === 'asc'){
                                if(a[i] == b[i]){
                                    if(n+1 < orderArray.length){
                                        let c =orderArray[n+1]['field'];
                                        if(isNaN(this.tableConfig.tableData[0][c])){
                                            return  a[c].localeCompare(b[c])
                                        }else{
                                            return   a[c] - b[c]; 
                                        }
                                    } 
                                }
                                return a[i] - b[i];  
                            }else if(params[i] === 'desc'){
                                if(a[i] == b[i]){
                                    if(n+1 < orderArray.length){
                                        let c =orderArray[n+1]['field'];
                                        if(isNaN(this.tableConfig.tableData[0][c])){
                                            return  b[c].localeCompare(a[c])
                                        }else{
                                            return   b[c] - a[c]; 
                                        }
                                    } 
                                }
                                return b[i] - a[i];
                            }else{
                                return 0;
                            }
                        }   
                    }
                });
            }
            this.mergeCells();
            //console.log(this.allArray)
           // console.log(this.sortMapArray)
            setTimeout(()=>{
                //this.isCellMerge = true
                
            },500)
            return  Promise.resolve();
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
            for (let i=1; i<columns.length; i++) {
                let column = columns[i];
                if(column.sumFlag){ //需要汇总列的field数组      
                    var field = column.field
                    this.sumColumns.push(field)
                }  
                if(column.isSpan){ //需要合并单元格列的field数组      
                    var field = column.field
                    this.spanColumns.push(field)
                }   
            }        
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
            for (var j  in  spanColumns) {
                var startIndex = 0;
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
            var spanColumns =this.spanColumns;
            var data = this.tableConfig.tableData;
            //console.log(this.tableConfig.tableData)
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
        },
        cellFormatter(n){ //小数位数
            var columns = this.tableConfig.columns
            var colLast = columns[3]
            this.$set(colLast,"formatter",(rowData,rowIndex,pagingIndex,field) => {          				
                var number=rowData[field]*1;
                return  number.toFixed(n);
            });   
        },
        exportExcel () {              
            /* generate workbook object from table */
            let wb = XLSX.utils.table_to_book(document.querySelector('#serverTable'));
            /* get binary string as output */
            let wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: true, type: 'array' });
            try {
                FileSaver.saveAs(new Blob([wbout], { type: 'application/octet-stream' }), this.tableConfig.title+'.xlsx');
            } catch (e)
            {
                if (typeof console !== 'undefined')
                    console.log(e, wbout)
            }
            return wbout
        }
    },
    created(){
        this.getTableInfo(1);
    },
    mounted(){
       
    }
  }
</script>
<style>
    .title-wrapper {
        position: relative;
    }
    .title-wrapper h3 {
        text-align: center;
    }
    .exportbtn {
        position: absolute;
        right: 5px;
        bottom: 0px;
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

</style>