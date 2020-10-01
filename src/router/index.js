import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/pages/Index'
import Layout from '@/pages/Layout'
import Login from '@/pages/Login'
import Menu from "@/pages/Menu"
import Banner from "@/pages/Banner"
import GoodsManage from "@/pages/GoodsManage"
import Kill from "@/pages/Kill"
import Member from "@/pages/Member"
import Role from "@/pages/Role"
import AdminManage from '@/pages/AdminManage'
import Category from '@/pages/Category'
import Specs from '@/pages/Specs'

Vue.use(Router)

let router = new Router({
  routes: [
    {
      path: '/login',
      component: Login
    },
    {
      path: '/',
      component: Layout,
      children:[{
        path:"index",
        component:Index
      },
      {path:'menu',component:Menu},
      {path:'banner',component:Banner},
      {path:'role',component:Role},
      {path:'banner',component:Banner},
      {path:'seckill',component:Kill},
      {path:'member',component:Member},
      {path:'user',component:AdminManage},
      {path:'goods',component:GoodsManage},
      {path:'category',component:Category},
      {path:'specs',component:Specs},
      {path:"",redirect:"/index"}
    ]
    }
  ]
})


router.beforeEach((to,from,next)=>{
  let token = sessionStorage.getItem("token")?sessionStorage.getItem("token"):"";
  if(token){
    // 已登录
    if(to.path=="/login"){
      next(false);
    }else{
      next();
    }
  }else{
    if(to.path=="/login"){
      next();
    }else{
      next("/login")
    }
  }
  
})


export default router
