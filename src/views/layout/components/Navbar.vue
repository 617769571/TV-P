<template>
  <el-menu class="navbar" mode="horizontal">
    <li class="route-container">
      <span v-for="route in routes" :key="route.path" class="route-wrap">
        <router-link :to="{ path: route.path }" :class="{'a-focus': $route.path === route.redirect}">
          {{ route.meta.title }}
        </router-link>
      </span>
    </li>
    <el-dropdown class="avatar-container" trigger="hover">
      <div class="avatar-wrapper">
        用户：{{ userInfo.userName }}
        <i class="el-icon-caret-bottom"/>
      </div>
      <el-dropdown-menu slot="dropdown" class="user-dropdown">
        <el-dropdown-item>
          <!--<span style="display:block;" @click="changePwd()">修改密码</span>
        </el-dropdown-item>
        <el-dropdown-item divided>-->
          <span style="display:block;" @click="logout">退出</span>
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </el-menu>
</template>

<script>
export default {
  data() {
    return {
      routes: []
    }
  },
  computed: {
    userInfo() {
      return this.$store.getters.userInfo
    }
  },
  mounted() {
    this.getLevelOneRoutes()
  },
  // updated() {
  //   this.getLevelOneRoutes()
  // },
  methods: {
    changePwd() {
      this.$router.push('/changePwd')
    },
    logout() {
      this.$store.dispatch('LogOut').then(() => {
        location.reload() // 为了重新实例化vue-router对象 避免bug
      })
    },
    getLevelOneRoutes() {
      let routes = this.$router.options.routes
      routes = JSON.stringify(routes)
      routes = JSON.parse(routes)
      this.routes = routes.filter(value => {
        if (!value.name) {
          value.name = value.path.substring(1, value.path.length)
          value.path = value.path + '/index'
        }
        return !/\*/.test(value.path) && !value.hidden
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.navbar {
  height: 50px;
  line-height: 50px;
  position: fixed;
  top: 0;
  right: 0;
  left: 220px;
  z-index: 9;
  .hamburger-container {
    line-height: 58px;
    height: 50px;
    float: left;
    padding: 0 10px;
  }
  .screenfull {
    position: absolute;
    right: 90px;
    top: 16px;
    color: red;
  }
  .avatar-container {
    height: 50px;
    display: inline-block;
    position: absolute;
    right: 35px;
    .avatar-wrapper {
      cursor: pointer;
      margin-top: 5px;
      position: relative;
      .user-avatar {
        width: 40px;
        height: 40px;
        border-radius: 10px;
      }
      .el-icon-caret-bottom {
        position: absolute;
        right: -20px;
        top: 25px;
        font-size: 12px;
      }
    }
  }
  .route-container {
    display: inline-block;
    .route-wrap {
      font-size: 14px;
      color: #676a6c;
      font-weight: bold;
      .a-focus {
        color: #1ab394;
      }
    }
    .route-wrap:first-of-type {
      margin-left: 20px;
    }
    .route-wrap:not(:last-of-type) {
      margin-right: 20px;
    }
  }
}
</style>

