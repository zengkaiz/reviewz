/**
 * dev  : Mopecat
 * desc : 操作按钮组
 * props:
 * emit :
 * slot :
 */
<template>
  <section class="image-container">
    <el-row :gutter="0">
      <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="hidden-md-and-down">
        <el-button-group>
          <el-tooltip class="item" effect="dark" placement="top-start">
            <div slot="content">
              <p>移动</p>mo<u>v</u>e
            </div>
            <el-button :class="currentButton === 'move'?'active':''" type="default" icon="el-icon-rank" @click="buttonChange('move')"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" placement="top-start">
            <div slot="content">
              <p>评论</p><u>c</u>omment
            </div>
            <el-button :class="currentButton === 'comment'?'active':''" type="default" @click="buttonChange('comment')">
              <i class="iconfont icon-pinglun-copy"></i>
            </el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" placement="top-start">
            <div slot="content">
              <p>自由绘</p>
              <u>d</u>raw
            </div>
            <el-button :class="currentButton === 'draw'?'active':''" type="default" @click="buttonChange('draw')">
              <i class="iconfont icon-ziyouhuizhixian"></i>
            </el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" placement="top-start">
            <div slot="content">
              <p>箭头</p>
              <u>a</u>rrow
            </div>
            <el-button :class="currentButton === 'arrow'?'active':''" type="default" @click="buttonChange('arrow')">
              <i class="iconfont icon-shubiaozhizhen"></i>
            </el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" placement="top-start">
            <div slot="content">
              <p>圆圈</p>ci<u>r</u>cle
            </div>
            <el-button :class="currentButton === 'circle'?'active':''" type="default" @click="buttonChange('circle')">
              <i class="iconfont icon-yuanquan"></i>
            </el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" placement="top-start">
            <div slot="content">
              <p>矩形</p>
              <u>s</u>quare
            </div>
            <el-button :class="currentButton === 'square'?'active':''" type="default" @click="buttonChange('square')">
              <i class="iconfont icon-juxing"></i>
            </el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" placement="top-start">
            <div slot="content">
              <p>删除</p>backspace
            </div>
            <el-button :class="currentButton === 'delete'?'active':''" type="default" icon="el-icon-delete" @click="buttonChange('delete')"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content placement="top-start">
            <div slot="content">
              <p>打印</p>
              <u>p</u>rint
            </div>
            <el-button :class="currentButton === 'print'?'active':''" type="default" icon="el-icon-printer" @click="buttonChange('print')"></el-button>
          </el-tooltip>
        </el-button-group>
      </el-col>
      <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="hidden-lg-and-up">
        <el-button-group>
          <el-button size="mini" :class="currentButton === 'move'?'active':''" type="default" icon="el-icon-rank" @click="buttonChange('move')"></el-button>
          <el-button size="mini" :class="currentButton === 'comment'?'active':''" type="default" @click="buttonChange('comment')">
            <i class="iconfont icon-pinglun-copy"></i>
          </el-button>
          <el-button size="mini" :class="currentButton === 'draw'?'active':''" type="default" @click="buttonChange('draw')">
            <i class="iconfont icon-ziyouhuizhixian"></i>
          </el-button>
          <el-button size="mini" :class="currentButton === 'arrow'?'active':''" type="default" @click="buttonChange('arrow')">
            <i class="iconfont icon-shubiaozhizhen"></i>
          </el-button>
          <el-button size="mini" :class="currentButton === 'circle'?'active':''" type="default" @click="buttonChange('circle')">
            <i class="iconfont icon-yuanquan"></i>
          </el-button>
          <el-button size="mini" :class="currentButton === 'square'?'active':''" type="default" @click="buttonChange('square')">
            <i class="iconfont icon-juxing"></i>
          </el-button>
          <el-button size="mini" :class="currentButton === 'delete'?'active':''" type="default" icon="el-icon-delete" @click="buttonChange('delete')"></el-button>
          <el-button size="mini" :class="currentButton === 'print'?'active':''" type="default" icon="el-icon-printer" @click="buttonChange('print')"></el-button>
        </el-button-group>
      </el-col>
    </el-row>
  </section>
</template>

<script>
import 'element-ui/lib/theme-chalk/display.css'
import { mapMutations } from 'vuex'
export default {
  name: '',
  props: {},
  data() {
    return {
      button: ['move', 'comment', 'draw', 'arrow', 'circle', 'square', 'delete', 'print'],
      currentButton: ''
    }
  },
  computed: {},
  watch: {},
  created() {
    this.buttonChange('comment')
  },
  mounted() {},
  methods: {
    ...mapMutations(['setOperationType']),
    buttonChange(type) {
      if (!type) {
        return
      }
      if (type !== 'delete') {
        this.currentButton = type
      }
      this.setOperationType(type)
      this.$emit('listen', type)
    }
  },
  filters: {},
  components: {}
}
</script>

<style lang="scss" scoped>
.image-container {
  text-align: right;
  margin-top: 20px;
  /deep/ .el-button-group {
    .el-button {
      i {
        font-size: 14px;
      }
      &:hover,
      &:focus,
      &.active {
        background-color: #d4d4d4;
        color: #333;
        border-color: #d4d4d4;
      }
    }
  }
  .hidden-md-and-up {
    .el-button {
      padding-left: 10px;
      padding-right: 10px;
    }
  }
}
</style>
