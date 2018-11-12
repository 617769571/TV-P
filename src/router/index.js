import Vue from 'vue'
import Router from 'vue-router'

// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
  }
**/
export const constantRouterMap = [
  { path: '/login', component: () => import('@/views/login/index'), hidden: true },
  { path: '/404', component: () => import('@/views/404'), hidden: true },

  {
    path: '/',
    component: Layout,
    redirect: '/ott',
    name: 'Layout',
    hidden: true
  },

  {
    path: '/ott',
    component: Layout,
    redirect: '/ott/info',
    name: 'ott',
    meta: { title: '信息管理', icon: 'example' },
    children: [
      {
        path: 'info',
        name: 'Info',
        component: () => import('@/views/info/index'),
        meta: { title: '设备管理', icon: 'table' }
      },
      {
        path: 'storeDetail/:storeId',
        name: 'storeDetail',
        component: () => import('@/views/info/detail/store'),
        hidden: true
      }
    ]
  },
  {
    path: '/edit',
    component: Layout,
    redirect: '/edit/contantLibrary',
    name: 'edit',
    meta: { title: '内容库管理', icon: 'example' },
    children: [
      {
        path: 'contantLibrary',
        name: 'contantLibrary',
        component: () => import('@/views/contantLibrary/index'),
        meta: { title: '内容库管理', icon: 'table' },
      },
      {
        path: 'contantLibrary/editContant',
        name: 'editContant',
        component: () => import('@/views/contantLibrary/updatePage'),
        hidden: true
      },
      {
        path: 'secondaryPages/editSecondPage',
        name: 'editSecondPage',
        component: () => import('@/views/secondaryPages/updatePage'),
        hidden: true
      },
      {
        path: 'secondaryPages',
        name: 'secondaryPages',
        component: () => import('@/views/secondaryPages/index'),
        meta: { title: '二级页面管理', icon: 'table' }
      },
      {
        path: 'storeDetail/:storeId',
        name: 'storeDetail',
        component: () => import('@/views/info/detail/store'),
        hidden: true
      }
    ]
  },
  {
    path: '/publish',
    component: Layout,
    redirect: '/publish/templateManagement',
    name: 'publish',
    meta: { title: '发布管理', icon: 'example' },
    children: [
      {
        path: 'templateManagement',
        name: 'templateManagement',
        component: () => import('@/views/templateManagement/index'),
        meta: { title: '模板管理', icon: 'table' }
      },
      {
        path: 'secondaryPages',
        name: 'secondaryPages',
        component: () => import('@/views/secondaryPages/index'),
        meta: { title: '版本管理', icon: 'table' }
      },
      {
        path: 'templateManagement/editTemplate',
        name: 'editTemplate',
        component: () => import('@/views/templateManagement/updatePage'),
        hidden: true
      },
      {
        path: 'templateManagement/addContent',
        name: 'addContent',
        component: () => import('@/views/templateManagement/addContent'),
        hidden: true
      },
      

    ]
  },
  // {
  //   path: '/changePwd',
  //   component: Layout,
  //   hidden: true,
  //   redirect: '/changePwd/index',
  //   meta: { title: '账户管理', icon: 'example' },
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/user/ChangePwd.vue'),
  //       meta: { title: '修改密码', icon: 'table' }
  //     }
  //   ]
  // },
  // { path: '*', redirect: '/404', hidden: true }
  { path: '*', redirect: '/', hidden: true }
]

export default new Router({
  mode: 'history', // 后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})
