
/**
 * dev  :akai
 * desc : 视频详情标注页
 */
<template>
  <section class="g-videoDetail-layout" v-loading="loading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)">
    <headerBar :info="videoDetail"/>
    <div class="content">
      <el-row :gutter="0">
        <el-col :xs="24" :sm="24" :md="12" :lg="16" :xl="18">
          <toolButton @listen="operationType" ref="tool"></toolButton>
          <canvasBox @blurComment="blurComment" @focusComment="focusComment" :isPlay="isPlay" :pauseInfo="pauseInfo" :optype="optype" :videoDetail="videoDetail"></canvasBox>
          <div v-if="url">
            <vueVideo :src="url" @listen="onPause" @play="onPlay" @ready="playerReadied"></vueVideo>
          </div>
          <imageBox @imgHandle="imgHandle"></imageBox>
        </el-col>
        <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="6">
          <el-collapse class="video-info" v-model="activeNames">
            <el-collapse-item title="文件信息" name="1" v-if=" videoDetail && videoDetail.vinfo">
              <fileInfo :data="videoDetail"></fileInfo>
            </el-collapse-item>
            <el-collapse-item title="标注评论" name="2">
              <markComment :isPlay="isPlay" @blur="blurComment" @focus="focusComment"></markComment>
            </el-collapse-item>
          </el-collapse>
        </el-col>
      </el-row>
    </div>
  </section>
</template>

<script>
import api from '../../apiFetch/api'
import headerBar from '../../components/header'
import fileInfo from './components/fileInfo'
import markComment from './components/markComment'
import vueVideo from './components/vueVideo'
import toolButton from './components/toolButton'
import canvasBox from './components/canvasBox'
import imageBox from './components/imageBox'
import { mapMutations, mapState } from 'vuex'
import { _Fcanvas } from '../../utils/fabric'

export default {
  data() {
    return {
      vid: '',
      poster: '',
      url: '',
      videoDetail: null,
      activeNames: ['2'],
      pauseInfo: null,
      optype: '',
      isPlay: true,
      player: null,
      loading: false,
      vinfo: null
    }
  },
  computed: {
    ...mapState(['vData']),
    currentTime: {
      get() {
        return this.$store.state.currentTime
      },
      set(val) {
        this.$store.state.currentTime = val
      }
    }
  },
  watch: {},
  created() {
    this.vid = this.$route.params.vid
    this.getVideoDetail(this.vid)
    this.setVdata({})
  },
  mounted() {
    document.onkeydown = (event) => {
      this.onkeydown(event)
    }
    // window.addEventListener('unload', (e) => this.beforeunloadHandler(e))
  },
  destroyed() {
    // window.removeEventListener('beforeunload', (e) => this.beforeunloadHandler(e))
  },
  methods: {
    ...mapMutations(['setVdata']),
    blurComment() {
      document.onkeydown = (event) => { this.onkeydown(event) }
    },
    focusComment() {
      document.onkeydown = (event) => {}
    },
    onkeydown(e) {
      let type
      if (e && e.keyCode === 32) {
        if (!this.player.paused()) {
          this.player.pause()
        } else {
          this.player.play()
        }
      } else {
        if (e && e.keyCode === 65) { // 字母 Aa
          type = 'arrow'
        } else if (e && e.keyCode === 83) { // 字母 Ss
          type = 'square'
        } else if (e && e.keyCode === 68) { // 字母 Dd 为什么后面老多个空格 why
          type = 'draw'
        } else if (e && e.keyCode === 82) { // 字母 Rr
          type = 'circle'
        } else if (e && e.keyCode === 67) { // 字母 Cc
          type = 'comment'
        } else if (e && e.keyCode === 86) { // 字母 Vv
          type = 'move'
        } else if (e && e.keyCode === 8) { // 字母 BackSpace
          type = 'delete'
        }
        this.$refs.tool.buttonChange(type)
      }
    },
    timeUpdate() {
      // 如果有canvas就隐藏
      if (this.$refs.canvasBox) {
        this.$refs.canvasBox.style.display = 'none'
      }
    },
    imgHandle(tm) {
      this.currentTime = tm
      this.player.currentTime(tm)
      let tmid = String(tm).replace('.', '-')
      let canvas = document.getElementById('canvas_' + tmid)
      let el = this.$refs.canvasBox
      let fcanvasJson = this.vData[tm].snap.canvas
      if (canvas) {
        // 切换canvas
        _Fcanvas.changeFcanvas(tm)
        canvas.parentNode.style.display = 'block'
        let sibling = this.sibling(canvas.parentNode)
        for (let i = 0; i < sibling.length; i++) {
          sibling[i].style.display = 'none'
        }
        if (!this.player.paused()) {
          this.player.pause()
        }
      } else {
        this.pauseInfo = {
          time: tm,
          player: this.player
        }
        _Fcanvas._createCanvas(this.pauseInfo, el, fcanvasJson)
      }
    },
    playerReadied(player) {
      this.player = player
    },
    sibling(elm) {
      var a = []
      var p = elm.parentNode.children
      for (var i = 0, pl = p.length; i < pl; i++) {
        if (p[i] !== elm) { a.push(p[i]) }
      }
      return a
    },
    onPlay(player) {
      this.isPlay = true
      console.log(111111)
    },
    // 视频暂停emit
    onPause(evt) {
      this.isPlay = false
      this.pauseInfo = evt
      console.log(22222)
    },
    getVideoDetail(vid) {
      this.loading = true
      api
        .getVideoDetail({ vid: vid })
        .then((data) => {
          this.videoDetail = data.data
          if (this.videoDetail.vinfo) {
            this.$store.state.FPS = data.data.vinfo['帧率']
            this.vinfo = JSON.parse(JSON.stringify(data.data.vinfo))
            delete this.vinfo._duration
          }
          this.url = this.videoDetail.vpath
        })
        .catch((error) => {
          this.$message.error(error)
        })
        .finally(() => {
          console.log(this.loading)
          this.loading = false
        })
    },
    sendBeacon() {
      let o = Object.assign({}, this.$store.state.vData)
      for (let i in o) {
        delete o[i].snap.src
        delete o[i].snap.canvas
      }
      let data = new FormData()
      data.append('vid', this.vid)
      data.append('vdata', 1)
      let url = `http://localhost:8080/api/update-video-vdata.php`
      let result = navigator.sendBeacon(url, data)
      localStorage.setItem('zengkaiztest', result + data + '0')
    },
    operationType(type) {
      setTimeout(() => {
        this.optype = ''
      }, 50)
      this.optype = type
    },
    beforeunloadHandler(e) {
      this.sendBeacon()
      // this.updateVideo()
    },
    updateVideo() {
      console.log(this.$store.state.vData)
      let o = Object.assign({}, this.$store.state.vData)
      let arr = []
      for (let i in o) {
        // delete o[i].snap.src
        delete o[i].snap.canvas
        arr.push(o[i].snap)
      }
      // let _arr = JSON.stringify(arr)
      console.log(o)
      let _o = JSON.stringify(o)
      console.log(_o)
      // let params = {
      //   vid: this.vid,
      //   vdata: '1'
      // }
      // let data = new FormData()
      // data.append('vid', this.vid)
      // data.append('vdata', JSON.stringify(params))
      // localStorage.setItem('zengkaiztest', api.updateVideo(data) + '0')
      // api.updateVideo(data)
      // let data = new FormData()
      // data.append('vid', this.vid)
      // data.append('vdata', JSON.stringify(o))
      // console.log(data)
      let data = {
        vid: this.vid,
        vdata: _o
      }
      api
        .updateVideo(data)
        .then((data) => {

        })
        .catch((error) => {
          this.$message.error(error)
        })
        .finally(() => {})
    }
  },
  filters: {},
  components: { headerBar, fileInfo, markComment, vueVideo, toolButton, canvasBox, imageBox }
}
</script>
<style lang="scss" scoped>
.g-videoDetail-layout {
  min-height: 100%;
  .image-box {
    min-height: 100px;
  }
  .content {
    padding: 0 20px;
  }
  .video-info {
    margin-left: 20px;
  }
}
.el-collapse /deep/ {
  border-top: none;
}
.el-collapse /deep/ .el-collapse-item__header,
.el-collapse /deep/ .el-collapse-item__content {
  background: rgb(31, 31, 31);
  color: #ffffff;
}
.el-collapse /deep/ .el-collapse-item__wrap {
  background: rgb(31, 31, 31);
  color: #ffffff;
  text-align: left;
}
</style>
