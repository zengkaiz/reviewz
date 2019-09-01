/**
 * dev  : zengkaiz
 * desc : 项目页
 */
<template>
  <section class="g-projectVideo-layout">
    <el-upload :http-request="upload1" :show-file-list="false" class="image-uploader" drag action>
      <i class="el-icon-upload"/>
      <div class="el-upload__text">
        将图片拖到此处，或
        <em>点击上传</em>
      </div>
    </el-upload>
  </section>
</template>

<script>
import api from '../apiFetch/api'

export default {
  name: '',
  props: {},
  data() {
    return {
      filename: ''
    }
  },
  computed: {

  },
  watch: {},
  created() {},
  mounted() {},
  methods: {
    async beforeUpload(content) { // 因为有两个方法使用到此部分，所以提出来一个方法
      let params = await this.$store.dispatch('getAllOss').then((res) => { // 使用了Vuex
        return res.data
      })
      params.file = content.file
      let data = await this.$store.dispatch('setParams', params)
      for (var value of data.values()) {
        this.filename = value.name
      }
      let url = params.host
      return this.$store.dispatch('upload', { url, data }).then((res) => {
        return res
      })
    },
    upload1(content) { // 上传图片的方法
      console.log(content)
      this.beforeUpload(content).then((res) => {
        let o = {
          pid: 2,
          vname: '证件照1',
          vpath: this.filename
        }
        api
          .uploadVideo(o)
          .then((res) => {
            alert('成功')
          })
          .catch((err) => {
            console.log(err)
          })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.avatar-uploader /deep/ .el-upload .el-upload-dragger {
  background-color: #fff;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  min-width: 100px;
  text-align: center;
  position: relative;
  overflow: hidden;
  padding-bottom: 20px;
}
.avatar-uploader /deep/ .el-upload {
  width: 100%;
  height: 100%;
}
.g-projectVideo-layout {
  min-height: 100vh;
  .project-item {
    width: 325px;
    height: 180px;
    background: #454545;
    color: #ffffff;
    position: relative;
    margin: 10px 20px;
    .item-top {
      width: 100%;
      height: 30px;
      background: rgba(0, 0, 0, 0.1);
      display: flex;
      justify-content: flex-end;
      align-items: center;
      font-size: 28px;
      position: absolute;
      top: 0;
      i {
        margin-right: 5px;
      }
    }
    .item-bottom-left {
      max-width: 140px;
      padding: 5px;
      background: rgba(0, 0, 0, 0.5);
      position: absolute;
      left: 5px;
      bottom: 5px;
      font-size: 16px;
      word-wrap: break-word;
      border-radius: 2px;
    }
    .item-bottom-right {
      padding: 2px 5px;
      background: rgba(0, 0, 0, 0.5);
      position: absolute;
      right: 5px;
      bottom: 5px;
      font-size: 16px;
      word-wrap: break-word;
      border-radius: 2px;
    }
  }
}
</style>
