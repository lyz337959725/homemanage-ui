<template>
  <div class="login-container">
    <el-form ref="loginForm" class="login-form" label-position="right" :model="loginForm" :rules="loginRules">
      <div class="title-container">
        <h3 class="title">登录/Login</h3>
      </div>
      <el-form-item prop="name">
        <el-input v-model="loginForm.name" placeholder="用户名">
          <!-- <i slot="prefix" class="icon iconfont icon-user-fill"></i> -->
        </el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input v-model="loginForm.password" placeholder="密码" show-password>
          <!-- <i slot="prefix" class="icon iconfont icon-lock-fill"></i> -->
        </el-input>
      </el-form-item>

      <el-button type="primary" style="width:100%;margin-bottom:30px;" @click="submit()">登录</el-button>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "Login",
  data() {   
    return {
      loginForm: {
        name: "",
        password: ""
      },
      loginRules: {
        name: [{ required: true, message:"用户名不能为空"}],
        password: [{ required: true, message:"密码不能为空"}]
      },
    };
  },
  methods: {
    submit(){
     this.$refs.loginForm.validate((valid) => {
        if(valid){
          this.$axios.post('sys/login', this.loginForm)
            .then(response => {
              if(response.data.success){
                localStorage.setItem("token","Bearer " + response.data.message)
                this.$router.push({name:"main"})
              }else{
                this.$message.error(response.data.message);
              }
            })
            .catch( (error) =>{
              this.$message.error("响应失败" + error);
            });
        }else{
          return
        }
     });
    }
  }
};
</script>

<style lang="less">

@bg:#283443;
@light_gray:#fff;
@cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: @cursor)) {
  .login-container .el-input input {
    color: @cursor;
  }
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 100%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px auto 12px auto;
      color: @light_gray;
      height: 47px;
      caret-color: @cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px @bg inset !important;
        -webkit-text-fill-color: @cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style lang="less" scoped>
@bg: #2d3a4b;
@dark_gray: #889aa4;
@light_gray: #eee;
.login-container {
  height: 100%;
  width: 100%;
  background-color: @bg;
  overflow: hidden;

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;

    .i-icon{
      margin-right: 15px
    }
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: @light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

  span {
    &:first-of-type {
      margin-right: 16px;
    }
  }
  }
}
</style>
