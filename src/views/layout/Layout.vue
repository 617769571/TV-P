<template>
  <div class="app-wrapper">
    <div class="tv-portal">电视门户</div>
    <sidebar class="sidebar-container"/>
    <div class="main-container">
      <navbar/>
      <app-main/>
    </div>
  </div>
</template>

<script>
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar/index'
import AppMain from './components/AppMain'

export default {
  name: 'Layout',
  components: {
    Navbar,
    Sidebar,
    AppMain
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  @import "src/styles/mixin.scss";
  .app-wrapper {
    @include clearfix;
    position: relative;
    height: 100%;
    width: 100%;
    &.mobile.openSidebar{
      position: fixed;
      top: 0;
    }
  }
  .drawer-bg {
    background: #000;
    opacity: 0.3;
    width: 100%;
    top: 0;
    height: 100%;
    position: absolute;
    z-index: 999;
  }
  .tv-portal {
    color: #fff;
    font-size: 18px;
    font-family: "microsoft yahei", Arial, "Helvetica Neue", Helvetica, sans-serif;
    text-align: center;
    line-height: 50px;
    background-color: #1ab394;
    width: 220px;
    position: fixed;
    top: 0;
    z-index: 1111;
  }
</style>
