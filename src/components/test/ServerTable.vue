<template>
    <div>
        <div class="title-wrapper">
            <h3>{{tableConfig.title}}</h3>
            <el-button @click="exportExcel" class="exportbtn"  size="medium" type="success">导出</el-button>
        </div>
       <v-table id="serverTable"
              is-vertical-resize
              :vertical-resize-offset='60'
              is-horizontal-resize
              style="width:100%"
              :multiple-sort="false"
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
            :cell-merge="cellMerge()"
              >
      </v-table>
       <div class="mt20 mb20 bold">
        <v-pagination @page-change="pageChange" @page-size-change="pageSizeChange" :total="50" :page-size="pageSize" :layout="['total', 'prev', 'pager', 'next', 'sizer', 'jumper']"></v-pagination>
       </div>
  </div>
</template>
<script>
import FileSaver from 'file-saver'
import XLSX from 'xlsx'
export default{
    data(){
        return {
            startIndex:0,
            sortMapArray:[],
            sortMap:{},
            footer: [],
            sumColumms:[],//所有需要合计的列
            pageIndex:1,
            pageSize:10,
            tableConfig: {
                rowsHeader:[{field:'address'},{field:'hobby'}],//需要合并的列
                multipleSort: false,
                isCount: false, //是否需要合计
                title:'', //表格标题
                tableData: [],
                columns: [],
                titleRows: []
            }
        }
    },
    methods:{
        getTableInfo(tid){
            var params = new URLSearchParams();
            const url ='api/table/getconfig?id=41837&engine=TJCX';    
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
                    this.$set(this.tableConfig,'isCount',data.isCount)
                    this.$set(this.tableConfig,'columns',data.columns)
                    this.$set(this.tableConfig,'titleRows',data.titleRows)
                    this.$set(this.tableConfig,'title',data.title)
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
                data: params
            }).then((res)=>{
                //console.log(res);
                var data =res.data;
                if(data){
                    this.tableConfig.tableData = data;
                    if(this.tableConfig.isCount){
                        this.setFooterData(data);
                        console.log(this.footer);
                        this.rowSum();
                    } 
                    this.mergeCells()   //合并单元格计算
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
        sortChange(params){
            if (params.height.length > 0){
                  this.tableConfig.tableData.sort(function (a, b) {
                    if (params.height === 'asc'){
                        return a.height - b.height;
                    }else if(params.height === 'desc'){
                            return b.height - a.height;
                    }else{
                        return 0;
                    }
                });
            }
        },
        setFooterData(data){ //列数据统计
            let result = [],
                sumVal = ['求和'],
                columns = this.tableConfig.columns
            for (let i=1; i<columns.length; i++) {
                let column = columns[i];
                if(column.isSum){
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
            var columms = this.tableConfig.columns
            var colLast = columms[columms.length-1]
            this.$set(colLast,"formatter",(rowData) => {          				
                var count = 0
                var fields = this.sumColumms 
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
        countSumCol(columns){   //需要汇总列的field数组        
            for (let i=1; i<columns.length; i++) {
                let column = columns[i];
                if(column.isSum){
                    var field = column.field
                    this.sumColumms.push(field)
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
            var rowsHeader =this.tableConfig.rowsHeader;
            for (var j  in this.sortMapArray) {
                var startIndex = 0;
                var sortMap = this.sortMapArray[j]
                for (var prop in sortMap) {
                    var count = sortMap[prop] * 1;
                    if(rowIndex == startIndex && field == rowsHeader[j].field){
                        console.log(count)
                        console.log(startIndex)
                        //this.startIndex +=count
                        return {
                            colSpan: 1,
                            rowSpan: count,
                            content: prop 
                        }
                    }
                    startIndex += count;
                    console.log(startIndex)
                }                   
            }
        },
        mergeCells() {
            //声明一个map计算相同属性值在data对象出现的次数和
            var rowsHeader =this.tableConfig.rowsHeader;
            var data = this.tableConfig.tableData;
            var startIndex = 0;
            var endIndex = data.length;
            var sortMapArray =[];
            var fieldName = rowsHeader[0].field;
            for (var j=0; j<rowsHeader.length; j++) {
                var fieldName = rowsHeader[j].field;
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
        } ,
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
        this.getTableData(this.pageIndex,this.pageSize);  
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