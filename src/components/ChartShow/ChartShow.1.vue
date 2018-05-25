<template>
  <div>
    <el-collapse v-model="activeNames" @change="handleChange">
      <el-collapse-item title="工具条" name="1">
        <div class="filter-tools">
          <filter-form></filter-form>
        </div>
      </el-collapse-item>
      <el-collapse-item title="表格内容区" name="2"> 
        <div class="table-wrapper">
          <s-table></s-table> 
        </div>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script>
import FilterForm from '../FilterForm/FilterForm.vue'
import ServerTable from '../ServerTable/ServerTable.vue'
import ServerTable1 from '../ServerTable/ServerTable1.vue'
export default {
  data () {
    return {
      activeNames: ['1','2']
    };
  },
  methods: {
    handleChange(val) {
      console.log(val);
    }
  },
  components: {
      'ServerTable':ServerTable,
      'STable':ServerTable1,
      'FilterForm':FilterForm
  }
}

</script>
<style>

</style>
