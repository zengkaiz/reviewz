/**
 * dev  : zack
 * desc : 新建、重命名项目
 */
<template>
  <section class="g-inputName-layout" v-if="isShowCpd">
    <div class="modal">
      <el-input v-model="pname" placeholder="项目名称" @keyup.enter.native="submit"></el-input>
      <span class="close-modal">
        <i class="el-icon-error" @click="close"></i>
      </span>
    </div>
  </section>
</template>

<script>
export default {
  name: '',
  props: {
    isShow: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      pname: ''
    }
  },
  computed: {
    isShowCpd() {
      if (this.isShow) {
        document.body.style.height = '100%'
        document.body.style.overflow = 'hidden'
      } else {
        document.body.style.height = 'auto'
        document.body.style.overflow = 'auto'
      }
      return this.isShow
    }
  },
  watch: {},
  created() {

  },
  mounted() {},
  methods: {
    submit(ev) {
      if (ev.keyCode === 13) {
        this.$emit('create', this.pname)
        this.$emit('input', false)
      }
    },
    close() {
      this.$emit('input', false)
    }
  },
  filters: {},
  components: {}
}
</script>

<style lang="scss" scoped>
.g-inputName-layout {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  z-index: 1;
  padding: 20px;
  box-sizing: border-box;
  background-color: #000;
  background-color: rgba(0, 0, 0, 0.75);
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  .modal {
    vertical-align: middle;
    position: relative;
    z-index: 2;
    max-width: 500px;
    box-sizing: border-box;
    width: 90%;
    background: #fff;
    padding: 15px 30px;
    -webkit-border-radius: 8px;
    -moz-border-radius: 8px;
    -o-border-radius: 8px;
    -ms-border-radius: 8px;
    border-radius: 8px;
    -webkit-box-shadow: 0 0 10px #000;
    -moz-box-shadow: 0 0 10px #000;
    -o-box-shadow: 0 0 10px #000;
    -ms-box-shadow: 0 0 10px #000;
    box-shadow: 0 0 10px #000;
    text-align: left;
    .close-modal {
      position: absolute;
      top: -8px;
      right: -8px;
      display: block;
      width: 30px;
      height: 30px;
      font-size: 30px;
    }
  }
}
</style>
