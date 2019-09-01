/**
 * dev  : akai
 * desc : 评论模块
 * props:
 * emit :
 * slot :
 */
<template>
  <section class="g-markComment-layout">
    <div v-if="vData[currentTime]">
      <el-container v-for="(item,index) in vData[currentTime].comments" :key="index">
        <el-header :class="item.cid === commentId ? 'active' : ''">
          <div class="mark-info" @mouseenter="mouseenterItem(item.cid)" @mouseleave="mouseleaveItem(item.cid)">
            <span v-if="item.isPoint" class="comment_pointNum" :style="{background:userInfo.color}">{{item.pointNum}}</span>
            <span>{{item.user}}</span>
            <span>{{item.time | formatDate}}</span>
            <i class="el-icon-delete-solid" @click="deleteCommont('',index)"></i>
            <i class="el-icon-chat-square" @click="replyCommont(index)"></i>
          </div>
          <div>{{item.content}}</div>
        </el-header>
        <el-main>
          <div v-for="(item1, index1) in item.children" :key="index1">
            <div class="mark-info">
              <span>{{item1.user}}</span>
              <span>{{item1.time | formatDate}}</span>
              <i class="el-icon-delete-solid" @click="deleteCommont(index,index1)"></i>
            </div>
            <div>{{item1.content}}</div>
          </div>
        </el-main>
      </el-container>
    </div>
    <div class="mark-input" v-if="!isPlay">
      <el-input type="textarea" :rows="2" ref="markInput" placeholder="请输入评论内容" v-model="textarea" @keyup.enter.native="submit($event,textarea)" @blur="blurComment" @focus="focusComment"></el-input>
    </div>
  </section>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import { formatDate } from '../../../utils/date'
import { _Fcanvas } from '../../../utils/fabric'
export default {
  name: 'markComment',
  props: {
    isPlay: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      textarea: ''
    }
  },
  computed: {
    ...mapState(['commentId', 'vData', 'currentTime', 'userInfo'])
  },
  watch: {},
  created() {},
  mounted() {},
  methods: {
    ...mapMutations(['setCommentOn']),
    blurComment() {
      this.$emit('blur')
    },
    focusComment() {
      this.$emit('focus')
    },
    mouseenterItem(cid) {
      this.setCommentOn(cid)
      _Fcanvas._setAntPointOpacity(cid, 0.5)
    },
    mouseleaveItem(cid) {
      this.setCommentOn('')
      _Fcanvas._setAntPointOpacity(cid, 1)
    },
    replyCommont(index) {
      this.textarea = '回复：'
      this.$refs.markInput.focus()
      this.replyIndex = index
    },
    deleteCommont(fatherIndex, index) {
      if (this.vData[this.currentTime].comments[index].isPoint) {
        let cid = this.vData[this.currentTime].comments[index].cid
        _Fcanvas._deleteCommentByCid(cid)
      } else {
        if (fatherIndex === '') {
          this.vData[this.currentTime].comments.splice(index, 1)
        } else {
          this.vData[this.currentTime].comments[fatherIndex].children.splice(index, 1)
        }
      }
    },
    submit(event, content) {
      event.preventDefault()
      let c = content.replace(/\s*/g, '')
      if (c === '') {
        return false
      }
      let index = this.replyIndex
      let params = {
        cid: new Date().getTime(),
        content: content,
        user: this.userInfo.name,
        time: new Date().getTime(),
        pointNum: '',
        isPoint: false,
        children: []
      }
      if (index > -1) {
        this.vData[this.currentTime].comments[index].children.push(params)
      } else {
        if (JSON.stringify(this.vData) === '{}') {
          this.vData[this.currentTime] = {}
          this.vData[this.currentTime].comments = []
        }
        if (!this.vData[this.currentTime].comments) {
          this.vData[this.currentTime].comments = []
        } else if (this.vData[this.currentTime].comments && this.vData[this.currentTime].comments.length > 0) {
          let len = this.vData[this.currentTime].comments.length
          params.pointNum = this.vData[this.currentTime].comments[len - 1].pointNum
        }
        this.vData[this.currentTime].comments.push(params)
      }
      this.textarea = ''
      this.replyIndex = -1
      event.preventDefault() // 阻止浏览器默认换行操作
      return false
    }
  },
  filters: {
    formatDate(time) {
      let date = new Date(time)
      return formatDate(date, 'yyyy-MM-dd hh:mm')
    }
  },
  components: {}
}
</script>

<style lang="scss" scoped>
.g-markComment-layout {
  .mark-info {
    span,
    i {
      margin-right: 10px;
    }
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
      background: yellow;
    }
  }
  /deep/ .el-main {
    padding: 0;
    padding-left: 40px;
  }
  /deep/ .el-header {
    min-height: 50px;
    height: auto !important;
  }
  .el-icon-delete-solid, .el-icon-chat-square{
    cursor: pointer;
  }
  .mark-input {
    position: 'absolute';
  }
  .active {
    background: #2e2e2e;
  }
}
</style>
