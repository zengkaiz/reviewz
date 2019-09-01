/**
 * dev  : yjinw
 * desc : 说明
 * props:
 * emit :
 * slot :
 */
<template>
  <section class="g-toolBox-layout">
    <div id="toolBox" class="tool-box" :style="{'left':left+'px','top':top+'px','display':display}">
      <p v-if="funObj.isDel" @click="deleteItem">删除</p>
      <p v-if="funObj.isRename" @click="rename">重命名</p>
    </div>
  </section>
</template>

<script>
// import api from '../apiFetch/api'
export default {
  name: 'toolBox',
  props: {
    left: {
      type: Number,
      default: 0
    },
    top: {
      type: Number,
      default: 0
    },
    display: {
      type: String,
      default: 'none'
    },
    funObj: {
      type: Object,
      defaule: {
        isDel: true,
        isRename: false
      }
    }
  },
  data() { return {} },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    deleteItem() {
      this.$emit('deleteItem')
    },
    rename() {
      this.$emit('rename')
    }
  },
  filters: {},
  components: {}
}
</script>

<style lang="scss" scoped>
.g-toolBox-layout {
  .tool-box {
    padding: 5px;
    background: rgb(31, 31, 31);
    position: absolute;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.5);
    color: #ffffff;
    cursor: pointer;
    border: 1px solid #bebebe;
    p {
      padding: 2px 0;
    }
  }
}
</style>
