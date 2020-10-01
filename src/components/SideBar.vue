<template>
  <div class="menu_box">
    <el-menu
      class="el-menu-vertical-demo"
      background-color="#000"
      text-color="#fff"
      active-text-color="#ffd04b"
      :default-active="$route.path"
      unique-opened
    >
      <el-menu-item>
          <span>后台管理系统</span>
      </el-menu-item>
      <!-- 地址 -->
      <el-menu-item index="/index">
          <i class="el-icon-s-home"></i>
          <router-link to="/index">首页</router-link>
      </el-menu-item>
      <!-- 遍历一级菜单 -->
      <el-submenu v-for="(menu,index) in menus" :key="index" :index="(index+1).toString()">
          <!-- 一级菜单 标题 -->
          <template slot="title">
            <i :class="menu.icon"></i>
            <span>{{menu.title}}</span>
          </template>
          <!-- 二级菜单的容器 -->
          <el-menu-item-group>
              <el-menu-item v-for="(sub,index) in menu.children" :key="index" :index="sub.url">
                  <router-link :to="sub.url">{{sub.title}}</router-link>
              </el-menu-item>
          </el-menu-item-group>
      </el-submenu>
    </el-menu>
  </div>
</template>
<script>
export default {
    computed:{
        menus(){
            // console.log(this.$store.state.info.menus)
            return this.$store.state.info.menus;
        }
    }
}
</script>
<style lang="less">
.menu_box{
    height: 100%;
    .el-menu{
        width: 200px;
        height: 100%;
    }
    a{
        text-decoration: none;
        color:#fff;
    }
    .router-link-active{
        color:rgb(255, 208, 75);
    }
    }
</style>