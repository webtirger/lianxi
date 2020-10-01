<template>
  <div class="layout">
    <el-container class="container">
      <el-aside width="200px" style="overflow:hidden">
          <side-bar></side-bar>
      </el-aside>
      <el-container>
        <el-header >
            <el-dropdown @command="logout">
                <span class="el-dropdown-link">
                    <span>{{username}}</span>
                    <i class="el-icon-arrow-down el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown" >
                    <el-dropdown-item command="1">登出</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        </el-header>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<script>
import SideBar from "./../components/SideBar"
export default {
    components:{
        SideBar,
    },
    methods:{
        // e 作为 被选dropdown-item 的command
        logout(e){
            // console.log(e);
            this.$store.commit("clearInfo");
            sessionStorage.clear();
            this.$router.replace("/login")
        }
    },
    computed:{
        username(){
           return this.$store.state.info.username
        }
    }
};
</script>
<style lang="less" scoped>
.layout {
    height: 100%;
  .container {
    height: 100%;
    .el-header{
        background-color: #B3C0D1;
        color:#333;
        line-height: 60px;
        text-align: right;
        padding-right: 30px;
    }
  }
}
</style>