<template>
  <div id="app">
    <router-view/>
  </div>
</template>
<script>
export default {
  name: 'App',
  created () {
    if (sessionStorage.getItem("store") ) {
　　    this.$store.replaceState(Object.assign({}, this.$store.state,JSON.parse(sessionStorage.getItem("store"))))
    } 

    window.addEventListener("beforeunload", ()=>{
　　    sessionStorage.setItem("store",JSON.stringify(this.$store.state))
    })
  }
}
</script>
<style lang='less'>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-size: 16px;
  color: #2c3e50;
}
div{
  box-sizing: border-box;
}
video{
  position: relative !important;
}

audio:focus{
    border: none;
    outline: none;
    outline: 0
}
</style>
