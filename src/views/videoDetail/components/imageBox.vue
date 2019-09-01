/**
 * dev  : akai
 * desc : 视频截图存放
 * props:
 * emit :
 * slot :
 */
<template>
  <section class="g-imageBox-layout">
    <el-row :gutter="0" v-if="vData">
      <el-col :xs="8" :sm="8" :md="6" :lg="4" :xl="4" v-for="(value,key,index) in vData" :key="index">
        <div v-if="value.snap" @mouseenter="hoverImg(index)" @mouseleave="hoverImg('')" @click="imgHandle(value.snap.tm)">
          <img class="img" :src="value.snap.src">
          <div :class="activeIndex === index? 'time active': 'time'">{{value.snap.tm | formatTime($store.state.FPS)}}</div>
          <div :class="activeIndex === index? 'delete active': 'delete'" @click.stop="deleteImg(key)">
            <i class="el-icon-delete"></i>
          </div>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="0">
      <el-col :xs="8" :sm="8" :md="6" :lg="4" :xl="4" v-for="(value,index) in snaps" :key="index"></el-col>
    </el-row>
  </section>
</template>

<script>
import { mapState } from 'vuex'
import { formatTime } from '../../../utils/date'
import { _Fcanvas } from '../../../utils/fabric'
export default {
  name: 'imageBox',
  props: {},
  data() {
    return {
      activeIndex: ''
    }
  },
  computed: {
    ...mapState(['vData', 'snaps'])
  },
  watch: {
  },
  created() {
  },
  mounted() {},
  methods: {
    imgHandle(tm) {
      this.$emit('imgHandle', tm)
    },
    hoverImg(index) {
      this.activeIndex = index
    },
    deleteImg(tm) {
      let tmid = String(this.$store.state.currentTime).replace('.', '-')
      let canvas = document.getElementById('canvas_' + tmid)
      console.log(tm)
      console.log(this.$store.state.currentTime)
      if (canvas && tm === String(this.$store.state.currentTime)) {
        _Fcanvas._clearCanvas()
      }
      delete this.vData[tm]
    }
  },
  filters: {
    formatTime(tm, fps) {
      // let fps = this.$store.state.FPS
      return formatTime(tm, fps)
    }
  },
  components: {}
}
</script>

<style lang="scss" scoped>
.g-imageBox-layout {
  border: 1px solid black;
  padding: 5px;
  margin-top: 20px;
  /deep/ .el-col {
    cursor: pointer;
    position: relative;
    padding: 0 10px;
    .time {
      display: none;
      position: absolute;
      top: 50%;
      left: 50%;
      margin-left: -39px;
      margin-top: -12px;
      color: #ffffff;
      background: rgba(0, 0, 0, 0.5);
      border-radius: 2px;
      padding: 2px 4px;
      &.active {
        display: block;
      }
    }
    .delete {
      display: none;
      position: absolute;
      top: 4px;
      right: 4px;
      background: rgba(0, 0, 0, 0.5);
      border-radius: 2px;
      padding: 2px;
      color: #ffffff;
      &.active {
        display: block;
      }
    }
  }
  .img {
    width: 100%;
    margin: 5px;
  }
}
</style>
