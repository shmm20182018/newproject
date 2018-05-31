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
  overflow: hidden;
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
