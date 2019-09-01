/**
 * dev  : akai
 * desc : 公共头部
 */
<template>
  <div class="reviewz-header">
    <div class="header-left">
      <p @click="toHome" class="reviewz">ReviewZ</p>
    </div>
    <div class="header-title hidden-sm-and-down" v-if="info">
      <p @click="toProjectVideo">{{info.pname}}</p>
      <p>{{info.vname}}</p>
    </div>
    <div class="header-right">
      <span class="header-btn" v-if="isShowCreateBtn" @click="createSomething">
        <i class="el-icon-plus"></i>
      </span>
      <span v-if="headPortrait" class="user" @click="toPersonalCenter">{{headPortrait}}</span>
      <span v-if="userInfo.uid" class="logout" @click="logout">[退出]</span>
    </div>
  </div>
</template>

<script>
import 'element-ui/lib/theme-chalk/display.css'
import { mapState } from 'vuex'
import api from '../apiFetch/api'
import { removeCookie } from '@/utils/cookie.js'
export default {
  name: 'headerBar',
  props: {
    info: {
      type: Object,
      default: null
    },
    isShowCreateBtn: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      headPortrait: ''
    }
  },
  mounted() {
    this.headPortrait = this.userInfo.name.substring(0, 1)
  },
  computed: {
    ...mapState(['userInfo'])
  },
  methods: {
    toHome() {
      this.$router.push({ name: 'projectList' })
    },
    toProjectVideo() {
      let pid = this.info.pid
      this.$router.push({ name: 'projectVideo', params: { pid } })
    },
    createSomething() {
      this.$emit('create')
    },
    toPersonalCenter() {
      this.$router.push('/personalCenter')
    },
    logout() {
      api
        .logout()
        .then((data) => {
          console.log(data)
          removeCookie('uid')
          removeCookie('userInfo')
          this.$router.push('/login')
        })
        .catch((error) => {
          console.log(error)
        })
    }
  },
  components: {

  }
}
</script>

<style lang="scss" scoped>
.reviewz-header {
  .reviewz {
    cursor: pointer;
  }
  height: 60px;
  background: rgb(31, 31, 31);
  color: #ffffff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  border-bottom: 1px solid #a2afb8;
  .header-left {
    display: flex;
    align-items: center;
    p:first-child {
      font-size: 28px;
    }
    .el-icon-back {
      font-size: 30px;
    }
  }
  .header-title {
    display: flex;
    flex-direction: row;
    p:first-child {
      margin-right: 10px;
      cursor: pointer;
    }
  }
  .header-right {
    display: flex;
    align-items: center;
    justify-content: space-between;
    span {
      width: 30px;
      height: 30px;
      border-radius: 15px;
      display: inline-block;
      text-align: center;
      line-height: 30px;
      cursor: pointer;
      margin: 0 5px;
    }
    .header-btn {
      width: 30px;
      height: 30px;
      background: #ffffff;
      color: #7b7b7b;
    }
    .user {
      background-color: red;
      color: #ffffff;
    }
    .logout {
      width: auto;
    }
  }
}
</style>
