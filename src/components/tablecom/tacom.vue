<template>
  <div>
      haha
  </div>
</template>
<script>

    export default{
        data(){
            return {
                pageIndex:1,
                pageSize:20,
                tableConfig: {
                    multipleSort: false,
                    tableData: [],
                    columns: [
                        {
                            field: 'custome', width: 50, titleAlign: 'center', columnAlign: 'center',
                            formatter: function (rowData, index,pagingIndex) {
                                var currentIndex = index+pagingIndex;
                                return currentIndex < 3 ? '<span style="color:red;font-weight: bold;">' + (currentIndex + 1) + '</span>' : currentIndex + 1
                            }, isFrozen: true
                        },
                        {field: 'name', width: 100, columnAlign: 'center', isFrozen: true},
                        {field: 'height', width: 100, columnAlign: 'center', isFrozen: true},
                        {field: 'gender', width: 90, columnAlign: 'center', isFrozen: false,isResize:true},

                        {field: 'address', width: 280, columnAlign: 'left',isResize:true},
                        {field: 'hobby', width: 180, columnAlign: 'center',isResize:true}

                    ],
                    titleRows: [
                                 [{fields: ['custome'], title: '排序', titleAlign: 'center', rowspan: 2},
                                  {fields: ['name', 'height'], title: '基础信息', titleAlign: 'center', colspan: 2},
                                  {fields: ['gender','address','hobby'], title: '用&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;户&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;其&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;他&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;信&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;息', titleAlign: 'center', colspan: 3}],

                                 [{fields: ['name'], title: '姓名', titleAlign: 'center'},
                                  {fields: ['height'], title: '身高', titleAlign: 'center', orderBy: ''},
                                  {fields: ['gender'], title: '性别', titleAlign: 'center'},
                                  {fields: ['address'], title: '住址', titleAlign: 'center'},
                                  {fields: ['hobby'], title: '爱好', titleAlign: 'center'}
                                  ],

                                 [{fields: ['custome','name','height'], title: '平均值', titleAlign: 'center', colspan: 3,titleCellClassName:'title-cell-class-name-test1'},
                                   {fields: ['gender'], title: '111', titleAlign: 'center',titleCellClassName:'title-cell-class-name-test2'},
                                   {fields: ['address'], title: '222', titleAlign: 'center',titleCellClassName:'title-cell-class-name-test2'},
                                  {fields: ['hobby'], title: '333', titleAlign: 'center',titleCellClassName:'title-cell-class-name-test2'},
                                 ]
                               ],
                }
            }
        },
        methods:{
            getTableData(){

                this.tableConfig.tableData = tableDate.slice((this.pageIndex-1)*this.pageSize,(this.pageIndex)*this.pageSize)
            },
            pageChange(pageIndex){

                 this.pageIndex = pageIndex;
                 this.getTableData();
                 console.log(pageIndex)
            },
            pageSizeChange(pageSize){

                this.pageIndex = 1;
                this.pageSize = pageSize;
                this.getTableData();
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
        },
        created(){
            this.getTableData();
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
</style>