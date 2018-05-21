<template>
  <div>
      <v-table
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
      ></v-table>
       <div class="mt20 mb20 bold">
        <v-pagination @page-change="pageChange" @page-size-change="pageSizeChange" :total="50" :page-size="pageSize" :layout="['total', 'prev', 'pager', 'next', 'sizer', 'jumper']"></v-pagination>
       </div>
  </div>
</template>
<script>
export default{
    data(){
        return {
            footer: [],
            sumColumms:[],
            pageIndex:1,
            pageSize:10,
            tableConfig: {
                multipleSort: false,
                isCount: false,
                tableData: [],
                columns: [],
                titleRows: []
            }
        }
    },
    methods:{
        getTableInfo(tid){
            var params = new URLSearchParams();
            const url ='http://localhost/data/mock/tableInfo.php';    
            params.append('id', tid);       //你要传给后台的参数值 key/value
            //console.log(pageIndex,pageSize);
            this.$axios({
                method: 'post',
                url:url,
                data: params
            }).then((res)=>{
                //console.log(res);
                var data =res.data;
                if(data){
                    this.$set(this.tableConfig,'isCount',data.isCount)
                    this.$set(this.tableConfig,'columns',data.columns)
                    this.$set(this.tableConfig,'titleRows',data.titleRows)
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
        setFooterData(data){
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
        setFooterCellClass(rowIndex, colIndex, value){
            if (colIndex === 0) {
                return 'footer-cell-class-name-title'
            } else {
                return 'footer-cell-class-name-normal'
            }
        },
        rowSum(){
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
                console.log(count)
                return count;
            });
        },
        countSumCol(columns){           
            for (let i=1; i<columns.length; i++) {
                let column = columns[i];
                if(column.isSum){
                    var field = column.field
                    this.sumColumms.push(field)
                }    
            }        
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