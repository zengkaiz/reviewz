/**
 * dev  : Mopecat
 * desc : 视频组件
 * props:
 * emit :
 * slot :
 */
<template>
  <section class="video-container">
    <div id="#frame_dl_img" style="display:none;"></div>
    <span class="frame_dl" @click.stop="downLoadImg" v-if="!isPlay">
      <i class="el-icon-camera"></i>
    </span>
    <videoPlayer
      class="vjs-video-box"
      :crossOrigin="'anonymous'"
      ref="videoPlayer"
      :options="playerOptions"
      :playsinline="true"
      @pause="onPlayerPause($event)"
      @play="onPlayerPlay($event)"
      @ready="playerReadied"
      @timeupdate="onPlayerTimeupdate($event)"
    ></videoPlayer>
  </section>
</template>

<script>
import 'video.js/dist/video-js.css'
import { videoPlayer } from 'vue-video-player'
import 'videojs-hotkeys'
import { _Fcanvas } from '../../../utils/fabric'
export default {
  name: 'vueVideo',
  props: {
    src: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      // 视频组件参数
      playerOptions: {
        // playbackRates: [0.7, 1.0, 1.5, 2.0], // 播放速度
        autoplay: false, // 如果true,浏览器准备好时开始回放。
        muted: false, // 默认情况下将会消除任何音频。
        loop: false, // 导致视频一结束就重新开始。
        preload: 'auto', // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
        language: 'zh-CN',
        aspectRatio: '16:9', // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
        fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
        sources: [
          {
            type: '',
            src: this.src // url地址
          }
        ],
        // poster: this.poster, // 你的封面地址
        notSupportedMessage: '此视频暂无法播放，请稍后再试', // 允许覆盖Video.js无法播放媒体源时显示的默认信息。
        controlBar: {
          timeDivider: true,
          durationDisplay: true,
          remainingTimeDisplay: true, // 剩余时间
          fullscreenToggle: true // 全屏按钮
        }
      },
      isPlay: true
    }
  },
  computed: {
    player() {
      return this.$refs.videoPlayer.player
    }
  },
  watch: {},
  created() {},
  mounted() {
    window.onresize = function() {
      _Fcanvas._resizeAllCanvas()
    }
  },
  methods: {
    // 暂停方法
    onPlayerPause(evt) {
      // evt.bigPlayButton.el_.style.display = 'block'
      let params = {
        time: parseFloat(this.player.currentTime().toFixed(2)),
        player: this.player
      }
      this.$emit('listen', params)
    },
    // 播放方法
    onPlayerPlay(evt) {
      this.$emit('play', this.player)
    },
    playerReadied(player) {
      this.$emit('ready', player)
      // https://github.com/surmon-china/vue-video-player/blob/master/examples/02-video.vue
      // player.hotkeys({
      //   volumeStep: 0.1, // 上下键控制声音 每次声音改变0.1
      //   seekStep: 5, // 使用右和左箭头键，或产生给定的整数的函数，当寻求向前和向后的秒数
      //   enableModifiersForNumbers: false,
      //   enableFullscreen: true // 全屏F键
      // })
    },
    onPlayerTimeupdate(event) {
      let canvas = document.getElementsByClassName('canvas-wrapper')[0]
      if (
        canvas &&
        event.cache_.currentTime !== this.$store.state.currentTime
      ) {
        canvas.style.display = 'none'
      }
    },
    downLoadImg() {
      _Fcanvas.downLoadImg()
    }
  },
  filters: {},
  components: { videoPlayer }
}
</script>

<style lang="scss" scoped>
.video-container {
  position: relative;
}
.frame_dl {
  position: absolute;
  right: 0;
  top: 0;
  display: inline-block;
  width: 30px;
  height: 30px;
  background: rgba(0, 0, 0, 0.5);
  z-index: 3001;
  font-size: 24px;
  color: #ffffff;
}
.video-container /deep/ .video-js .vjs-big-play-button {
  display: none;
}

.video-container /deep/ .vjs-control-bar {
  z-index: 4000;
  display: flex;
}
</style>
