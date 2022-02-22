import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import Home from '@/views/Home.vue'
import userService from '@/services/user.service'

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  { path: '/',              name: 'Home',              component: Home },
  { path: '/about',         name: 'About',             component: () => import(/* webpackChunkName: "about" */ '../views/About.vue') },
  { path: '/login',         name: 'Login',             component: () => import(/* webpackChunkName: "login" */ '../views/Login.vue') },
  { path: '/libraries',     name: 'Libraries',         component: () => import(/* webpackChunkName: "libraries" */ '../views/Libraries.vue') },
  { path: '/users',         name: 'Users',             component: () => import(/* webpackChunkName: "users" */ '../views/Users.vue') },
  { path: '/record-types',  name: 'RecordTypes',       component: () => import(/* webpackChunkName: "record-types" */ '../views/RecordTypes.vue') },
  { path: '/add-records',   name: 'Aggiungi Records',  component: () => import(/* webpackChunkName: "add-records" */ '../views/AddRecords.vue') },
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
