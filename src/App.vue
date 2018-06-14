<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
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
</style>
