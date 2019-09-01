/**
 * dev  : akai
 * desc : 视频信息组件
 * props:
 * emit :
 * slot :
 */
<template>
  <section class="g-fileInfo-layout">
    <div>
      <span class="key">文件名称：</span>
      <span>{{data.vname}}</span>
    </div>
    <div>
      <span class="key">上传时间：</span>
      <span>{{data.vcreate_time}}</span>
    </div>
    <div v-for="(val, key, index) in data.vinfo" :key="index">
      <span class="key">{{key}}：</span>
      <span>{{val}}</span>
    </div>
  </section>
</template>

<script>
export default {
  name: 'fileInfo',
  props: {
    data: {
      type: Object,
      defult: null
    }
  },
  data() { return {} },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {},
  filters: {},
  components: {}
}
</script>

<style lang="scss" scoped>
.g-fileInfo-layout {
  .key {
    display: inline-block;
    width: 80px;
    text-align: right;
  }
}
</style>
