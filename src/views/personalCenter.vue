/**
 * dev  : Mopecat
 * desc : 个人中心页
 * props:
 * emit :
 * slot :
 */
<template>
  <div class="personal-container">
    <headerBar :isShowCreateBtn="false"/>
    <div class="title-container">
      <div class="title">个人中心</div>
    </div>
    <el-collapse v-model="activeNames" @change="handleChange">
      <el-collapse-item title="选择画笔颜色" name="1">
        <el-row :gutter="20">
          <el-col :span="6" v-for="(item,index) in color" :key="index" @click.native="choiceColor(item)">
            <div class="grid-content" :style="`background: ${item};`"></div>
            <div class="name">{{item}}</div>
            <div class="choice" v-if="currentColor === item">
              <div class="modal">
                <i class="el-icon-success"></i>
              </div>
            </div>
          </el-col>
        </el-row>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script>
import api from '../apiFetch/api'
import headerBar from '../components/header'
import { setCookie } from '@/utils/cookie'
export default {
  name: 'personalCenter',
  props: {},
  data() {
    return {
      activeNames: ['1'],
      color: '',
      currentColor: ''
    }
  },
  computed: {},
  watch: {},
  created() {
    console.log('进入个人中心页')
    this.getUserInfo()
    this.getConfig()
  },
  mounted() {
  },
  methods: {
    handleChange(val) {
      console.log(val)
    },
    choiceColor(color) {
      this.currentColor = color
      this.updataUser()
    },
    updataUser() {
      const color = this.currentColor
      api
        .updateUser({ color })
        .then((data) => {
          this.getUserInfo()
        })
        .catch((error) => {
          this.$message.error(error.errorMsg)
        })
    },
    // 获取用户信息
    getUserInfo() {
      api
        .getUser()
        .then((data) => {
          this.currentColor = data.data.color
          setCookie('userInfo', data.data)
        })
        .catch((error) => {
          this.$message.error(error.errorMsg)
        })
    },
    getConfig() {
      api
        .getConfig()
        .then((data) => {
          this.color = data.data.colors
        })
        .catch((error) => {
          this.$message.error(error.errorMsg)
        })
    }
  },
  filters: {},
  components: { headerBar }
}
</script>

<style lang="scss" scoped>
$bg: #283443;
$light_gray: #fff;
$cursor: #fff;
@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .personal-container .el-input input {
    color: $cursor;
  }
}
.personal-container {
  min-height: 100%;
  width: 100%;
  overflow: hidden;
  .title-container {
    position: relative;
    margin-top: 30px;
    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }
  .grid-content {
    border-radius: 4px;
    height: 36px;
    line-height: 36px;
    border: 1px solid #dddddd;
  }
  .name {
    margin-bottom: 20px;
  }
  /deep/ .el-collapse {
    margin: 20px;
    .el-collapse-item__header,
    .el-collapse-item__content {
      .el-col {
        position: relative;
      }
      padding: 0 20px;
    }
  }
  .choice {
    box-sizing: border-box;
    position: absolute;
    top: 0;
    left: 0;
    height: 38px;
    line-height: 38px;
    z-index: 10;
    width: 100%;
    padding: 0 10px;
    .modal {
      border-radius: 4px;
      font-size: 16px;
      color: #dddddd;
    }
  }
}
</style>
