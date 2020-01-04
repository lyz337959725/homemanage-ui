<template>
  <el-container style="height:100%">
    <el-aside width="200px">
      <div class="title">HomeManager</div>
      <el-menu class="el-menu-vertical-demo"  router>
        <el-menu-item index="/user">
          <i class="el-icon-s-custom"></i>
          <span slot="title">用户管理</span>
        </el-menu-item>
        <el-submenu index="/finance">
          <template slot="title">
            <i class="el-icon-s-order"></i>
            <span>财务管理</span>
          </template>
            <el-menu-item index="/finance/bill">流水管理</el-menu-item>
            <el-menu-item index="/finance/book">账簿管理</el-menu-item>
            <el-menu-item index="/finance/type">类别管理</el-menu-item>
            <el-menu-item index="/finance/person">所属人管理</el-menu-item>
        </el-submenu>
      </el-menu>
    </el-aside>
    <el-container>
      <!-- 头部 -->
      <el-header>
        <el-button icon="el-icon-s-fold" circle></el-button>
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item v-for="item in this.$router.history.current.meta.title" :key="item">{{item}}</el-breadcrumb-item>
        </el-breadcrumb>
        <el-dropdown trigger="click">
          <span class="el-dropdown-link">{{this.$store.state.userName}}
            <i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item icon="el-icon-circle-close" @click.native="logout()">退出</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <el-avatar icon="el-icon-user-solid"></el-avatar>
      </el-header>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {};
  },
  beforeCreate() {
    const token = localStorage.getItem("token");
    if (!token) {
      this.$router.push({ name: "login" });
    }else{
      this.$axios.get("/sys/profile")
        .then(response => {
          if(response.data != ""){
            this.$store.commit('saveUserName',response.data)
          }else{
            this.logout()
          }
        })
        .catch(() => {
          this.logout()
        });
    }
  },
  methods: {
    logout() {
      localStorage.clear();
      this.$router.push({ name: "login" });
    }
  }
};
</script>

<style lang='less' scoped>
@main: #03a9f4;
@mainDark: #0288d1;
.el-header {
  .el-avatar {
    float: right;
    margin-top: 10px;
    background-color: @main;
  }

  .el-dropdown {
    float: right;
    line-height: 60px;
    margin-left: 10px;
  }

  .el-breadcrumb {
    float: left;
    line-height: 60px;
  }

  .el-button {
    float: left;
    margin-top: 10px;
    margin-right: 10px;
  }
}
.el-aside {
  .title {
    height: 100px;
    line-height: 100px;
    text-align: center;
    background-color: @main;
    color: #fff;
    font-size: 20px;
  }

  .el-menu {
    height: calc(100vh - 100px);
  }
}

.el-main {
  background-color: #eee;
}
</style>
