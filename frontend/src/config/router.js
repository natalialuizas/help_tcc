import Vue from 'vue'
import VueRouter from 'vue-router'

import Home from '@/components/home/Home'
import AdminPages from '@/components/admin/AdminPages'
import Clientes from "@/components/cliente/Clientes";
import Tickets from "@/components/ticket/Ticket";
import Auth from '@/components/auth/Auth'
import Softwares from '@/components/software/Software'

import { userKey } from '@/global'

Vue.use(VueRouter)

const routes = [
  {
    name: "home",
    path: "/",
    component: Home
  },
  {
    name: "adminPages",
    path: "/admin",
    component: AdminPages,
    meta: { requiresAdmin: true }
  },
  {
    name: "clientes",
    path: "/clientes",
    component: Clientes
  },
  {
    name: "softwares",
    path: "/softwares",
    component: Softwares
  },
  {
    name: "tickets",
    path: "/tickets",
    component: Tickets
  },
  {
    name: "auth",
    path: "/auth",
    component: Auth
  },
  { path: "*", redirect: "/" }
]

const router = new VueRouter({
    mode: 'history',
    routes
})

router.beforeEach((to, from, next) => {
    const json = localStorage.getItem(userKey)

    if(to.matched.some(record => record.meta.requiresAdmin)) {
        const user = JSON.parse(json)
        user && user.admin ? next() : next({ path: '/' })
    } else {
        next()
    }
})

export default router
