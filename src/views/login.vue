/**
 * dev  : Mopecat
 * desc : 登录页
 * props:
 * emit :
 * slot :
 */
<template>
  <div class="login-container">
    <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" auto-complete="on" label-position="left">
      <el-radio-group v-model="tab" @change="tabStatus">
        <el-radio-button label="login">登录</el-radio-button>
        <el-radio-button label="register">注册</el-radio-button>
      </el-radio-group>
      <!-- <div class="title-container">
        <h3 class="title">欢迎登录</h3>
      </div>-->
      <el-form-item prop="mobile">
        <span class="iconfont icon-user"></span>
        <el-input ref="mobile" v-model="loginForm.mobile" placeholder="手机号" name="mobile" type="text" tabindex="1" auto-complete="on"/>
      </el-form-item>
      <el-form-item prop="name" v-if="tab === 'register'">
        <span class="iconfont icon-nickname"></span>
        <el-input ref="name" v-model="loginForm.name" placeholder="昵称" name="name" type="text" tabindex="1" auto-complete="on"/>
      </el-form-item>
      <el-form-item prop="password">
        <span class="iconfont icon-denglumima"></span>
        <el-input
          :key="passwordType"
          ref="password"
          v-model="loginForm.password"
          :type="passwordType"
          placeholder="密码"
          name="password"
          tabindex="2"
          auto-complete="on"
          @keyup.enter.native="handleLogin"
        />
        <span :class="passwordType === 'password'?'show-pwd iconfont icon-eye':'show-pwd iconfont icon-eye1'" @click="showPwd"></span>
      </el-form-item>
      <el-button v-if="tab === 'login'" :loading="loading" type="info" style="width:100%;margin-bottom:30px;" @click.native.prevent="handleLogin">登录</el-button>
      <el-button v-else :loading="loading" type="info" style="width:100%;margin-bottom:30px;" @click.native.prevent="handleRegister">注册</el-button>
    </el-form>
  </div>
</template>

<script>
import api from '../apiFetch/api'
import { mapMutations, mapState } from 'vuex'
export default {
  name: 'Login',
  // components: { SocialSign },
  data() {
    var validateMobile = (rule, value, callback) => {
      let reg = /^1[34578]\d{9}$/
      if (!reg.test(value)) {
        callback(new Error('请输入正确的手机号码'))
      } else {
        callback()
      }
    }
    var validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('密码至少6位'))
      } else {
        callback()
      }
    }
    return {
      tab: 'login',
      loginForm: {
        mobile: '',
        password: '',
        name: ''
      },
      loginRules: {
        mobile: [{ validator: validateMobile, trigger: 'blur' }],
        password: [{ validator: validatePassword, trigger: 'blur' }],
        name: [{ required: true, trigger: 'blur', message: '请输入昵称' }]
      },
      passwordType: 'password',
      capsTooltip: false,
      loading: false,
      showDialog: false,
      redirect: undefined,
      otherQuery: {}
    }
  },
  computed: {
    ...mapState(['userInfo'])
  },
  created() {},
  mounted() {},
  destroyed() {},
  methods: {
    ...mapMutations(['setUserInfo']),
    // 切换登录注册状态
    tabStatus() {},
    loginRequest() {
      const { mobile, password } = this.loginForm
      console.log(this.loginForm)
      this.$store
        .dispatch('init', { mobile, password })
        .then(() => {
          this.$router.push('/')
        })
        .catch((error) => {
          console.log(error)
          this.$message.error(error.errorMsg)
        })
    },
    // 登录跳转
    handleLogin() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.loginRequest()
        }
      })
    },
    // 注册方法
    handleRegister() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          const { mobile, name, password } = this.loginForm
          api
            .register({ mobile, name, password })
            .then((data) => {
              if (data.code === 200) {
                this.$alert('注册成功！去登陆吧', '提示', {
                  confirmButtonText: '确定',
                  callback: (action) => {
                    this.tab = 'login'
                  }
                })
              }
            })
            .catch((err) => {
              this.$message.error(err.errorMsg)
            })
        }
      })
    },
    // 显示密码
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    }
  }
}
</script>

<style lang="scss">
$bg: #283443;
$light_gray: #fff;
$cursor: #fff;
@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}
/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;
    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;
      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }
  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
  .el-radio-group {
    width: 100%;
    margin-bottom: 20px;
    .el-radio-button {
      width: 50%;
      .el-radio-button__inner {
        width: 100%;
        background-color: #3d444e;
        border-color: #3d444e;
        &:hover {
          color: #606266;
        }
      }
      .el-radio-button__orig-radio:checked + .el-radio-button__inner {
        background-color: #2b3036;
        border-color: #2b3036;
        box-shadow: none;
        &:hover {
          color: #ffffff;
        }
      }
    }
  }
}
</style>
<style lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;
.login-container {
  min-height: 100%;
  width: 100%;
  overflow: hidden;
  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }
  .iconfont {
    color: #ffffff;
    font-size: 18px;
    vertical-align: middle;
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
}
</style>
