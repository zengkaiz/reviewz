/**
 * dev  : zengkaiz
 * desc : 项目页
 */
<template>
  <section class="g-projectVideo-layout" v-loading="loading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)">
    <headerBar :info="project" @create="dialogVisible = true" :isShowCreateBtn="true"/>
    <el-row :gutter="0" v-if="videos && videos.length>0">
      <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="6" v-for="(item, index) in videos" :key="index">
        <div class="project-item" @click="toVideoDetail(item.vid)">
          <div class="item-top">
            <i class="el-icon-more" @click.stop="moreTool($event,item)"></i>
          </div>
          <div class="preview" @mousemove="previewVideo($event,item.vframes,index)" v-if="item.vframes">
            <img :src="preview[index]" alt="preview">
          </div>
          <div class="item-bottom-left">
            <span>{{item.vname}}</span>
          </div>
          <div class="item-bottom-right" v-if="item.vinfo">
            <span>{{item.vinfo['时长']}}</span>
          </div>
        </div>
      </el-col>
    </el-row>
    <toolBox :left="pageX" :top="pageY" :display="display" @deleteItem="deleteItem" :funObj="toolBoxFunObj"></toolBox>
    <el-dialog :visible.sync="dialogVisible" :before-close="handleClose">
      <el-upload class="avatar-uploader" :action="''" :http-request="upload" :show-file-list="false" drag accept="video/mp4, video/ogg, video/flv, video/avi, video/wmv, video/rmvb, video/mov">
        <div>
          <i class="el-icon-upload"></i>
        </div>
        <div>
          将文件拖到此处，或
          <em>点击上传</em>
        </div>
      </el-upload>
      <!-- <el-progress v-show="showProgress" :text-inside="true" :stroke-width="15" :percentage="uploadPercent"></el-progress> -->
    </el-dialog>
  </section>
</template>

<script>
import api from '../apiFetch/api'
import toolBox from '../components/toolBox'
import headerBar from '../components/header'

export default {
  name: 'projectVideo',
  props: {},
  data() {
    return {
      project: null,
      videos: null,
      pid: '',
      pageX: 0,
      pageY: 0,
      display: 'none',
      toolBoxFunObj: {
        isDel: true,
        isRename: false
      },
      dialogVisible: false,
      loading: false,
      preview: []
      // showProgress: false
    }
  },
  computed: {},
  watch: {},
  beforeCreate() {},
  created() {
    this.pid = this.$route.params.pid
    this.getVideos(this.pid)
    console.log(this.preview)
  },
  mounted() {},
  methods: {
    // 预览图片
    previewVideo(e, vframes, index) {
      let imgWidth = 325
      let total = vframes.length // 总数
      let step = imgWidth / total // 每一格图片对应的宽度
      let position = Math.ceil(e.layerX / step) - 1 // 当前应该图片在数组中的位置
      this.$set(this.preview, index, vframes[position])
    },
    handleClose() {
      this.dialogVisible = false
    },
    // beforeUpload(file) {
    //   api.getUploadUrl()
    //     .then((url) => {
    //       console.log(url)
    //       this.dialogVisible = false
    //       const loading = this.$loading({
    //         lock: true,
    //         text: '上传中，请稍后',
    //         spinner: 'el-icon-loading',
    //         background: 'rgba(0, 0, 0, 0.7)'
    //       })

    //       let fd = new FormData()
    //       fd.set('video', file)// 传文件
    //       fd.append('pid', this.pid)
    //       api.uploadVideo(fd)
    //         .then((data) => {
    //           this.getVideos(this.pid)
    //           this.$message.success('上传成功')
    //         })
    //         .catch((error) => {
    //           this.$message.error(error)
    //         })
    //         .finally(() => {
    //           loading.close()
    //           this.loading = false
    //         })
    //       return false
    //     })
    //     .catch((error) => {
    //       this.$message.error(error)
    //     })
    //   return false
    // },
    async beforeUpload(content) {
      // 因为有两个方法使用到此部分，所以提出来一个方法
      let params = await this.$store.dispatch('getAllOss').then((res) => {
        // 使用了Vuex
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
    upload(content) {
      // 上传图片的方法
      const loading = this.$loading({
        lock: true,
        text: '上传中，请稍后',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      this.beforeUpload(content).then((res) => {
        let params = {
          pid: this.pid,
          vname: content.file.name,
          vpath: this.filename
        }
        api
          .uploadVideo(params)
          .then((res) => {
            loading.close()
            this.dialogVisible = false
            this.getVideos(this.pid)
          })
          .catch((err) => {
            console.log(err)
          })
      })
    },
    // progressFunction(event) {
    //   // 设置进度显示
    //   if (event.lengthComputable) {
    //     var percent = Math.floor(event.loaded / event.total * 100)
    //     if (percent > 100) {
    //       percent = 100
    //     }
    //     this.uploadPercent = percent
    //   }
    //   this.showProgress = true
    // },
    getVideos(pid) {
      this.loading = true
      api
        .getVideos({ pid: pid })
        .then((data) => {
          this.project = data.data.project
          this.videos = data.data.videos
          data.data.videos.map((item, index) => {
            if (item.vframes) {
              this.preview[index] = item.vframes[0]
            } else {
              this.preview[index] = ''
            }
          })
        })
        .catch((error) => {
          this.$message.error(error)
        })
        .finally(() => {
          this.loading = false
        })
    },
    toVideoDetail(vid) {
      this.$router.push({ name: 'videoDetail', params: { vid } })
    },
    deleteItem() {
      this.loading = true
      api
        .delVideo({ vid: this.checkedItem.vid })
        .then((data) => {
          this.getVideos(this.pid)
        })
        .catch((error) => {
          this.$message.error(error)
        })
        .finally(() => {
          this.loading = false
        })
    },
    moreTool(e, item) {
      this.pageY = e.pageY
      this.pageX = e.pageX
      this.display = 'block'
      this.checkedItem = item
      document.addEventListener('click', () => {
        this.display = 'none'
      })
    }
  },
  filters: {},
  components: {
    toolBox,
    headerBar
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
    cursor: pointer;
    .preview {
      width: 100%;
      height: 100%;
      img {
        width: 100%;
        height: 100%;
      }
    }
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
