import { setCookie } from '@/utils/cookie.js'
import api from '@/apiFetch/api'
import axios from 'axios'
import uuid from 'uuid'

var actions = {
  init(state, { mobile, password }) {
    return new Promise((resolve, reject) => {
      api
        .login({ mobile, password })
        .then((data) => {
          setCookie('uid', data.data.uid)
          setCookie('userInfo', data.data)
          state.userInfo = data.data
          resolve(data)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
  getAllOss({ commit }) {
    // 获取服务端传递过来的阿里oss签名
    return new Promise((resolve, reject) => {
      api
        .getUploadSign() // 此处为封装的获取服务端相关参数的方法
        .then((res) => {
          resolve(res)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
  // 设置请求参数
  setParams({ commit }, params) {
    let formData = new FormData()
    // 得到后缀
    let pos = params.file.name.lastIndexOf('.')
    let suffix = ''
    if (pos !== -1) {
      suffix = params.file.name.substring(pos)
    }
    let filename = `${uuid.v4()}${suffix}`
    // 文件名字，可设置路径
    formData.append('key', `${params.dir}${filename}`)
    // policy规定了请求的表单域的合法性
    formData.append('policy', params.policy)
    // Bucket 拥有者的Access Key Id
    formData.append('OSSAccessKeyId', params.accessid)
    // 让服务端返回200,不然，默认会返回204
    formData.append('success_action_status', '200')
    // 根据Access Key Secret和policy计算的签名信息，OSS验证该签名信息从而验证该Post请求的合法性
    // formData.append('callback', params.callback)
    formData.append('signature', params.signature)
    formData.append('name', filename)
    // 需要上传的文件filer
    formData.append('file', params.file, filename)
    return formData
  },
  upload({ commit }, { url, data }) {
    // 上传文件
    return new Promise((resolve, reject) => {
      axios
        .post(url, data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        .then((res) => {
          resolve(res)
        })
        .catch((err) => {
          reject(err)
        })
    })
  }
}
export default actions
