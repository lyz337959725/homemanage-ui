import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/Login.vue')
  },
  {
    path: '/',
    name: 'main',
    component: () => import('@/views/Main.vue'),
    children:[
      {
        path: '/user',
        name: 'user',
        meta: {
          title: ['用户管理']
        },
        component: () => import('@/views/User.vue')
      },
      {
        path: '/finance/bill',
        name: 'bill',        
        meta: {
          title: ['财务管理','流水管理']
        },
        component: () => import('@/views/finance/bill.vue')
      },
      {
        path: '/finance/book',
        name: 'financeBook',
        meta: {
          title: ['财务管理','账簿管理']
        },
        component: () => import('@/views/finance/book.vue')
      },
      {
        path: '/finance/type',
        name: 'financeType',
        meta: {
          title: ['财务管理','类别管理']
        },
        component: () => import('@/views/finance/type.vue')
      },
      {
        path: '/finance/person',
        name: 'financePerson',
        meta: {
          title: ['财务管理','所属人管理']
        },
        component: () => import('@/views/finance/person.vue')
      },
    ]
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
