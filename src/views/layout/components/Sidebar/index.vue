<template>
  <el-scrollbar wrap-class="scrollbar-wrapper">
    <el-menu
      :show-timeout="200"
      :default-active="$route.path"
      mode="vertical"
      background-color="#304156"
      text-color="#bfcbd9"
      active-text-color="#409EFF"
    >
      <sidebar-item v-for="route in routes" :key="route.name" :item="route" :base-path="route.path"/>
    </el-menu>
  </el-scrollbar>
</template>

<script>
import SidebarItem from './SidebarItem'

export default {
  components: { SidebarItem },
  computed: {
    routes() {
      let path = this.$route.path
      const index = path.indexOf('/', 1)
      path = path.substring(0, index < 0 ? path.length : index)
      if (new RegExp('^' + path).test(this.$route.path)) {
        for (let i = 0, rs = this.$router.options.routes; i < rs.length; i++) {
          if (path === rs[i].path) {
            return [rs[i]]
          }
        }
      }
      // 一般不可能走到这里
      return this.$router.options.routes
    }
  }
}
</script>

<style>
</style>
