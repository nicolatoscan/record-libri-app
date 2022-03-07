import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import Home from '@/views/Home.vue'
import userService from '@/services/user.service'

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  { path: '/',                name: 'Home',              component: Home },
  { path: '/about',           name: 'About',             component: () => import(/* webpackChunkName: "about" */ '../views/About.vue') },
  { path: '/login',           name: 'Login',             component: () => import(/* webpackChunkName: "login" */ '../views/Login.vue') },
  { path: '/libraries',       name: 'Libraries',         component: () => import(/* webpackChunkName: "libraries" */ '../views/Libraries.vue') },
  { path: '/users',           name: 'Users',             component: () => import(/* webpackChunkName: "users" */ '../views/Users.vue') },
  { path: '/formats',         name: 'Formats',           component: () => import(/* webpackChunkName: "formats" */ '../views/Formats.vue') },
  { path: '/add-records',     name: 'AddRecords',        component: () => import(/* webpackChunkName: "add-records" */ '../views/AddRecords.vue') },
  { path: '/records',         name: 'Records',           component: () => import(/* webpackChunkName: "records" */ '../views/Records.vue') },
  { path: '/tags',            name: 'Tag',               component: () => import(/* webpackChunkName: "tags" */ '../views/Tags.vue') },
  { path: '/non-compliances', name: 'NonCompliances',    component: () => import(/* webpackChunkName: "non-compliances" */ '../views/NonCompliances.vue') },
  { path: '/prints',          name: 'Prints',            component: () => import(/* webpackChunkName: "prints" */ '../views/Prints.vue') },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  if (to.name == 'Login' || userService.isLoggedIn()) {
    next();
  } else {
    next({
      path: "/login",
      params: { nextUrl: to.fullPath },
    });
  }
});

export default router
