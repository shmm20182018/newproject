<template>
  <div id="app">
    <router-view v-if="isRouteAlive"/>
  </div>
</template>

<script>
export default {
  name: 'App',
  data(){
    return {
       isRouteAlive:true
    }
  },
  methods:{
    reload(){
      this.isRouteAlive = false
      this.$nextTick(()=>{
        this.isRouteAlive = true
      })
    }
  }
}
</script>

<style>
html{
  width: 100%;
  overflow-x: hidden;
  height: 100%;
}
body{
  margin:0;
  height: 100%;
}
#app{
  height: 100%;
}
i{
  font-style: normal;
}
#nprogress .spinner {
  display: none;

}
.clear::after{
  content:'';
  display: block;
  clear: both;
}
ul{
  margin: 0;
  padding:0;
}
li{
  list-style: none;
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
</style>
