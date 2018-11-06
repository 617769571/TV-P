<template>
  <div class="login-container">
    <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" auto-complete="on" label-position="left">
      <h3 class="title">电视门户管理系统</h3>
      <el-form-item prop="account">
        <span class="svg-container svg-container_login">
          <svg-icon icon-class="user" />
        </span>
        <el-input v-model="loginForm.account" name="account" type="text" auto-complete="on" placeholder="输入账号" />
      </el-form-item>
      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input
          :type="pwdType"
          v-model="loginForm.password"
          name="password"
          auto-complete="on"
          placeholder="输入密码"
          @keyup.enter.native="handleLogin" />
        <span class="show-pwd" @click="showPwd">
          <svg-icon icon-class="eye" />
        </span>
      </el-form-item>
      <el-form-item prop="verifyCode">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input v-model="loginForm.verifyCode" name="verifyCode" type="text"/>
        <span class="show-pwd" @click="getValidCode">
          <img :src="validImgUrl" class="valid-img">
          看不清楚，换一张
        </span>
      </el-form-item>
      <el-form-item>
        <el-button :loading="loading" type="primary" style="width:100%;" @click.native.prevent="handleLogin" v-on:keyup.enter="handleLogin">
          登陆
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { Base64 } from 'js-base64'

export default {
  name: 'Login',
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!/^[A-z]+(\w?)+/.test(value)) {
        callback(new Error('请输入正确的用户名'))
      } else {
        callback()
      }
    }
    const validatePass = (rule, value, callback) => {
      if (value.length < 5) {
        callback(new Error('密码长度不能少于5位'))
      }
      if (!/^[0-9a-zA-Z\.\/\?\@\%\!\&amp;=\+\~\:\#\;\,\$\^\&\*\(\)\{\}\|\"\'\-\_\=\[\]\<\>\,\.]{0,20}$/.test(value)) {
        callback(new Error('密码为字母、数字或符号组合'))
      } else {
        callback()
      }
    }
    const validateCodeId = (rule, value, callback) => {
      if (value.length < 5) {
        callback(new Error('code不能小于5位'))
      } else {
        callback()
      }
    }
    const validateVerifyCode = (rule, value, callback) => {
      if (value.length !== 5 && !value.match(/^[A-Za-z0-9]+$/)) {
        callback(new Error('输入正确的验证码'))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        account: '',
        password: '',
        codeId: 0,
        verifyCode: ''
      },
      loginRules: {
        account: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePass }],
        codeId: [{ required: true, trigger: 'blur', validator: validateCodeId }],
        verifyCode: [{ required: true, trigger: 'blur', validator: validateVerifyCode }]
      },
      loading: false,
      pwdType: 'password',
      validImgUrl: ''
    }
  },
  created() {
    const { query } = this.$route
    if (JSON.stringify(query) !== '{}' && query.username && query.pwd && query.token) {
      this.loginForm.account = query.username
      this.loginForm.password = Base64.decode(query.pwd)
      this.getValidCode()
    }
  },
  mounted() {
    this.getValidCode()
  },
  methods: {
    getValidCode() {
      this.loginForm.codeId = Math.floor(Math.random() * 100000)
      this.validImgUrl = process.env.VALID_IMG_URL + this.loginForm.codeId
    },
    showPwd() {
      if (this.pwdType === 'password') {
        this.pwdType = ''
      } else {
        this.pwdType = 'password'
      }
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store.dispatch('Login', this.loginForm).then(() => {
            this.loading = true
            this.$router.push({ path: '/' })
          }).catch(() => {
            this.loading = true
          })
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
$bg:#2d3a4b;
$light_gray:#eee;
.valid-img {
  height: 22px;
  top: 6px;
  position: absolute;
  cursor: pointer;
}
/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;
    input {
      background: transparent;
      border: 0;
      -webkit-appearance: none;
      border-radius: 0;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      &:-webkit-autofill {
        -webkit-box-shadow: 0 0 0 1000px $bg inset !important;
        -webkit-text-fill-color: #fff !important;
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

<style rel="stylesheet/scss" lang="scss" scoped>
$bg:#2d3a4b;
$dark_gray:#889aa4;
$light_gray:#eee;
.login-container {
  position: fixed;
  height: 100%;
  width: 100%;
  background-color: $bg;
  .login-form {
    position: absolute;
    left: 0;
    right: 0;
    width: 520px;
    padding: 35px 35px 15px 35px;
    margin: 120px auto;
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
  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
    &_login {
      font-size: 20px;
    }
  }
  .title {
    font-size: 26px;
    color: $light_gray;
    margin: 0 auto 40px auto;
    text-align: center;
    font-weight: bold;
  }
  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
  .valid-img {
    right: 132px;
    top: 2px;
    width: 100px;
    height: 34px;
  }
}
</style>
