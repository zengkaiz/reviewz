/**
 * dev  : akai
 * desc : canvasbox
 */
<template>
  <div class="my-canvas-container">
    <!-- canvas画布 -->
    <div class="canvas-wrapper" ref="canvasBox"></div>
    <!-- 评论输入框 -->
    <div :class="!hideComment ?'cbox active': 'cbox'" :style="{ left: point.x + 20 +'px', top: point.y + 30 +'px'}">
      <el-input ref="input" @focus="focusComment" @blur="blurComment" type="textarea" :rows="2" placeholder="请输入评论" v-model="comment" @keyup.enter.native="onSubmit"></el-input>
    </div>
    <!-- 打印区域 -->
    <vue-easy-print ref="easyPrint">
      <div v-if="isPrint" id="printTest" ref="print">
        <div class="print-header">
          <div>
            <p>项目：{{videoDetail.pname}}</p>
            <p>视频：{{videoDetail.vname}}</p>
            <p>{{new Date() | formatDate}}</p>
          </div>
        </div>
        <div class="print-area" v-for="(value,key,index) in vData" :key="index">
          <div class="img-box" v-if="value.snap">
            <img :src="value.snap.src">
          </div>
          <div class="content-box" v-if="value.comments && value.snap">
            <p>
              <span class="index">#{{index+1}}</span>
              <span class="frame">Frame:{{value.snap.tm | formatFrame($store.state.FPS)}}</span>
              <span class="time">Timecode：{{value.snap.tm | formatTime($store.state.FPS)}}</span>
            </p>
            <el-container class="container" v-for="(item,index) in value.comments" :key="index">
              <el-header>
                <div class="mark-info">
                  <span v-if="item.isPoint" class="comment_pointNum" :style="{background:userInfo.color}">{{item.pointNum}}</span>
                  <span class="index">{{item.user}}：</span>
                  <span>{{item.content}}</span>
                </div>
              </el-header>
              <el-main>
                <div v-for="(item1, index1) in item.children" :key="index1">
                  <div class="mark-info">
                    <span>{{item1.user}}</span>
                    <span>{{item1.time | formatDate}}</span>
                  </div>
                  <div>{{item1.content}}</div>
                </div>
              </el-main>
            </el-container>
          </div>
        </div>
      </div>
    </vue-easy-print>
  </div>
</template>

<script>
import { _Fcanvas } from '../../../utils/fabric'
import { mapState, mapMutations } from 'vuex'
import { formatDate, formatTime } from '../../../utils/date'
import vueEasyPrint from 'vue-easy-print'
export default {
  name: '',
  props: {
    pauseInfo: {
      type: Object,
      default: null
    },
    optype: {
      type: String,
      default: ''
    },
    videoDetail: {
      type: Object,
      default: null
    },
    isPlay: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      flag: false,
      comment: '',
      isPrint: false
    }
  },
  computed: {
    ...mapState(['point', 'hideComment', 'vData', 'userInfo', 'currentTime', 'commentId'])
  },
  directives: {
  // 注册一个局部的自定义指令 v-focus
    focus: {
    // 指令的定义
      inserted: function(el) {
      // 聚焦元素
        if (el.querySelector('input')) {
          el.querySelector('input').focus()
        }
      }
    }
  },
  watch: {
    pauseInfo: {
      immediate: true,
      handler: function() {
        if (this.flag) {
          let el = this.$refs.canvasBox
          let time = this.$store.state.vData[this.pauseInfo.tm]
          el.style.display = 'block'
          if (!time) {
            _Fcanvas._createCanvas(this.pauseInfo, el)
          }
        }
      }
    },
    optype: {
      immediate: true,
      handler: function() {
        if (this.flag) {
          this.typeChange()
        }
      }
    },
    isPlay: {
      immediate: true,
      handler: function() {
        this.$nextTick(() => {
          if (this.isPlay && this.$refs.canvasBox) {
            let len = this.$refs.canvasBox.children.length
            for (let i = 0; i < len; i++) {
              this.$refs.canvasBox.children[i].style.display = 'none'
            }
          }
        })
      }
    },
    hideComment: {
      immediate: true,
      handler: function() {
        if (!this.hideComment) {
          setTimeout(() => {
            this.$refs.input.focus()
          }, 200)
        }
      }
    }
  },
  created() {
    _Fcanvas.init()
  },
  mounted() {
    this.flag = true
  },
  methods: {
    ...mapMutations(['setHideComment', 'setVdata']),
    blurComment() {
      this.$emit('blurComment')
    },
    focusComment() {
      this.$emit('focusComment')
    },
    typeChange() {
      switch (this.optype) {
      case 'move':
        _Fcanvas._onMove()
        break
      case 'comment':
        _Fcanvas._onAnnotation()
        break
      case 'draw':
        _Fcanvas._onFreeDraw()
        break
      case 'circle':
        _Fcanvas._onDrawEllipse()
        break
      case 'square':
        _Fcanvas._onDrawRect()
        break
      case 'arrow':
        _Fcanvas._onDrawArrow()
        break
      case 'delete':
        _Fcanvas._onDeletion()
        break
      case 'print':
        this.print()
        break
      default:
        break
      }
    },
    print() {
      this.isPrint = true // 显示元素
      setTimeout(() => {
        this.$refs.easyPrint.print()
        this.isPrint = false // 隐藏元素
      }, 100)
    },
    onSubmit(event) {
      this.comment = this.comment.substring(0, this.comment.length - 1)
      event.preventDefault()
      let c = this.comment.replace(/\s*/g, '')
      if (c === '') {
        return false
      }
      let params = {
        isPoint: true,
        cid: this.point.cid,
        content: this.comment,
        user: this.userInfo.name,
        time: +this.point.cid,
        pointNum: this.point.pointNum,
        children: []
      }
      let data = Object.assign({}, this.vData)
      if (data[this.currentTime].comments) {
        data[this.currentTime].comments.push(params)
      } else {
        data[this.currentTime].comments = []
        data[this.currentTime].comments.push(params)
      }
      this.setHideComment(true)
      this.setVdata(data)
      this.comment = ''
    }
  },
  filters: {
    formatDate(time) {
      let date = new Date(time)
      return formatDate(date, 'yyyy-MM-dd hh:mm')
    },
    formatTime(tm, fps) {
      return formatTime(tm, fps)
    },
    formatFrame(tm, fps) {
      let frame = Math.floor(tm * fps)
      return frame
    }
  },
  components: {
    vueEasyPrint
  }
}
</script>
<style lang="scss" scoped>
#printTest{
  height:100%;
  background:#ffffff;
}
.canvas-wrapper {
  overflow: hidden;
  z-index: 1000;
}
.cbox {
  position: absolute;
  display: none;
  &.active {
    display: block;
    z-index: 3000;
  }
}
.print-header {
  width: 100%;
  border-bottom: 1px solid #000000;
  div {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
.print-area {
  display: flex;
  margin-top: 20px;
  background:#ffffff;
  .img-box {
    width: 50%;
    margin-right: 10px;
    img {
      width: 100%;
    }
  }
  .content-box {
    // .container{
    //   min-height:170px;
    // }
    width: 50%;
    margin-left: 10px;
    line-height: 26px;
    .index {
      font-weight: 600;
    }
    .frame,
    .time {
      margin-left: 5px;
    }
    .mark-info {
      .comment_pointNum {
        display: inline-block;
        width: 16px;
        line-height: 16px;
        border-radius: 50%;
        text-align: center;
        font-size: 11px;
        color: black;
        margin-right: 3px;
        vertical-align: text-top;
      }
      span,
      i {
        margin-right: 10px;
      }
    }
    /deep/ .el-main {
      padding: 0;
      padding-left: 40px;
    }
    /deep/ .el-header {
      min-height: 40px;
      height: auto !important;
    }
    .mark-input {
      position: 'absolute';
    }
  }
}
</style>
