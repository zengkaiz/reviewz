/**
 * dev  : zengkaiz
 * desc : 项目列表页
 */
<template>
  <section class="g-projectList-layout" v-loading="loading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)">
    <headerBar @create="renameOrCreate" :isShowCreateBtn="true"/>
    <div class="content">
      <el-row :gutter="0">
        <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="6" v-for="(item, index) in projectList" :key="index">
          <div class="project-item" @click="toProjectVideo(item.pid)">
            <div class="item-top">
              <i class="el-icon-more" @click.stop="moreTool($event,item)"></i>
            </div>
            <div class="preview" @mousemove="previewVideo($event,item.pframes,index)" v-if="item.pframes">
              <img :src="preview[index]" alt="preview">
            </div>
            <div class="item-bottom-left">
              <span>{{item.pname}}</span>
            </div>
            <div class="item-bottom-right">
              <span>{{item.vcount}} Shots</span>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    <toolBox :left="pageX" :top="pageY" :display="display" @deleteItem="deleteItem" @rename="renameOrCreate" :funObj="toolBoxFunObj"></toolBox>
    <inputName :isShow="isCreateProject" @create="updateOrCreate" v-model="isCreateProject"></inputName>
  </section>
</template>

<script>
import api from '../apiFetch/api'
import toolBox from '../components/toolBox'
import inputName from '../components/inputName'
import headerBar from '../components/header'
export default {
  name: '',
  props: {},
  data() {
    return {
      // 项目列表
      projectList: null,
      pageX: 0,
      pageY: 0,
      display: 'none',
      isCreateProject: false,
      toolBoxFunObj: {
        isDel: true,
        isRename: true
      },
      loading: false,
      preview: []
    }
  },
  computed: {
  },
  watch: {},
  created() {
    this.getProjects()
  },
  mounted() {},
  methods: {
    previewVideo(e, pframes, index) {
      let imgWidth = 325
      let total = pframes.length // 总数
      let step = imgWidth / total // 每一格图片对应的宽度
      let position = Math.ceil(e.layerX / step) - 1 // 当前应该图片在数组中的位置
      this.$set(this.preview, index - 1, pframes[position])
    },
    moreTool(e, item) {
      this.pageY = e.pageY
      this.pageX = e.pageX
      this.display = 'block'
      this.checkedItem = item
      document.addEventListener('click', () => {
        this.display = 'none'
      })
    },
    getProjects() {
      this.loading = true
      api.getProjects()
        .then((data) => {
          this.projectList = data.data
          data.data.map((item, index) => {
            if (item.pframes) {
              this.preview[index] = item.pframes[0]
            } else {
              this.preview[index] = ''
            }
          })
          console.log(this.preview)
        })
        .catch((error) => {
          this.$message.error(error)
        })
        .finally(() => {
          this.loading = false
        })
    },
    toProjectVideo(pid) {
      this.$router.push({ name: 'projectVideo', params: { pid } })
    },
    deleteItem() {
      this.loading = true
      api
        .delProject({ pid: this.checkedItem.pid })
        .then((data) => {
          this.getProjects()
        })
        .catch((error) => {
          this.$alertErrorMsg(this, error.errorMsg)
        })
        .finally(() => {
          this.loading = false
        })
    },
    renameOrCreate() {
      this.isCreateProject = true
    },
    updateOrCreate(pname) {
      this.isCreateProject = false
      let params = { pname: pname }
      if (this.checkedItem) {
        params.pid = this.checkedItem.pid
        this.updateProject(params)
      } else {
        this.createProject(params)
      }
    },
    createProject(params) {
      api.createProject(params)
        .then((data) => {
          this.checkedItem = null
          this.getProjects()
        })
        .catch((error) => {
          this.$alertErrorMsg(this, error.errorMsg)
        })
        .finally(() => {})
    },
    updateProject(params) {
      api.updateProject(params)
        .then((data) => {
          this.checkedItem = null
          this.getProjects()
        })
        .catch((error) => {
          this.$alertErrorMsg(this, error.errorMsg)
        })
        .finally(() => {})
    }
  },
  filters: {},
  components: {
    toolBox,
    inputName,
    headerBar
  }
}
</script>

<style lang="scss" scoped>
.g-projectList-layout {
  min-height: 100vh;
  .preview {
    width: 100%;
    height: 100%;
    img {
      width: 100%;
      height: 100%;
    }
  }

  .content {
    .project-item {
      width: 325px;
      height: 180px;
      // line-height: 180px;
      color: #ffffff;
      margin: 10px;
      border: 1px solid #a2afb8;
      cursor: pointer;
      position: relative;
      margin: 10px 20px;
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
}
</style>
