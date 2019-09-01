import Fetch from './index'
import qs from 'qs'

const basePath = '/reviewz'

const apiConfig = {
  register: basePath + '/user/register', // 注册
  login: basePath + '/user/login', // 登录
  logout: basePath + '/user/logout', // 登出
  getProjects: basePath + '/projects/get-projects', // 查询用户项目列表
  getVideos: basePath + '/videos/get-videos-by-pid', // 获取项目pid下的视频列表
  createProject: basePath + '/projects/create-project', // 项目创建
  updateProject: basePath + '/projects/update-project', // 项目重命名
  delProject: basePath + '/projects/delete-project', // 删除项目（软删除）
  delVideo: basePath + '/videos/delete-video', // 删除视频（软删除）
  uploadVideo: `${basePath}/videos/create-video`, // 上传视频
  getVideoDetail: `${basePath}/videos/get-video-by-vid`, // 根据 vid 获取视频详情
  updateVideo: `${basePath}/videos/update-video-vdata`, // 更新视频的标注信息
  getUser: basePath + '/user/get-user', // 获取用户信息接口
  getConfig: basePath + '/config/get-config', // 获取配置信息
  updateUser: basePath + '/user/update-user', // 更新用户信息
  getUploadSign: basePath + '/videos/get-upload-sign' // 接口获取上传的policy和signature
}

const api = {}

api.getProjects = function() {
  return Fetch.get(apiConfig.getProjects, { params: arguments[0], withCredentials: true })
}
api.getVideos = function() {
  return Fetch.get(apiConfig.getVideos, { params: arguments[0], withCredentials: true })
}
api.createProject = function() {
  return Fetch.get(apiConfig.createProject, { params: arguments[0], withCredentials: true })
}
api.updateProject = function() {
  return Fetch.get(apiConfig.updateProject, { params: arguments[0], withCredentials: true })
}
api.delProject = function() {
  return Fetch.post(apiConfig.delProject, { data: qs.stringify(arguments[0]), withCredentials: true })
}
api.delVideo = function() {
  return Fetch.post(apiConfig.delVideo, { data: qs.stringify(arguments[0]), withCredentials: true })
}
api.uploadVideo = function() {
  return Fetch.post(apiConfig.uploadVideo, { data: qs.stringify(arguments[0]), withCredentials: true })
}
api.getVideoDetail = function() {
  return Fetch.get(apiConfig.getVideoDetail, { params: arguments[0], withCredentials: true })
}
// api.updateVideo = function() {
//   return Fetch.sendBeacon(apiConfig.updateVideo, { data: arguments[0] })
// }
api.updateVideo = function() {
  return Fetch.post(apiConfig.updateVideo, { data: qs.stringify(arguments[0]), withCredentials: true })
}
/**
 * desc 注册接口
 * @param {Nunber} mobile 手机号
 * @param {string} name 用户名
 * @param {string} password 密码
 */
api.register = function() {
  return Fetch.post(apiConfig.register, { data: qs.stringify(arguments[0]), withCredentials: true })
}
/**
 * desc 登录接口
 * @param {Nunber} mobile 手机号
 * @param {string} password 密码
 */
api.login = function({ mobile, password }) {
  return Fetch.get(apiConfig.login, { params: arguments[0], withCredentials: true })
}
/**
 * desc 登录接口
 * @param {Nunber} mobile 手机号
 */
api.logout = function() {
  return Fetch.get(apiConfig.logout, { params: arguments[0], withCredentials: true })
}

/**
 * 获取用户信息接口
 */
api.getUser = function() {
  return Fetch.get(apiConfig.getUser, { params: arguments[0], withCredentials: true })
}

/**
 * 获取配置信息
 */
api.getConfig = function() {
  return Fetch.get(apiConfig.getConfig, { params: arguments[0], withCredentials: true })
}

/**
 * 更新用户信息
 */
api.updateUser = function({ color }) {
  return Fetch.post(apiConfig.updateUser, { data: qs.stringify(arguments[0]), withCredentials: true })
}
/**
 * 接口获取OSS链接
 */
api.getUploadSign = function() {
  return Fetch.get(apiConfig.getUploadSign, { params: arguments[0], withCredentials: true })
}
export default api
