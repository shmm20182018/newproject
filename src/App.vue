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
}
body{
  margin-top: 0
}
i{
  font-style: normal;
}
#nprogress .spinner {
  display: none;

}
.clear::after{
  content:'';
  display: 'block';
  clear: both;
}
</style>
