'use strict'
/**
 * Fetch axios封装请求
 * DEV: Mopecat
 */
import axios from 'axios'
class Fetch {
  /**
   * 构造器
   * @param {Function} reqHandle 请求拦截方法
   * @param {Function} resHandle 返回拦截方法
   */
  constructor({ resHandle, reqHandle }) {
    this.axios = axios.create()
    this.reqHandle = reqHandle
    this.resHandle = resHandle
  }

  /**
   * Post请求
   * @param  {String} url              [请求URL]
   * @param  {Object} data             [post请求数据]
   * @param  {Object} params           [url参数]
   * @param  {Object} headers          [header自定义]
   * @param  {Boolean} withCredentials  [设置是否跨域传输cookie]
   * @param  {int} [timeout=10000}] [过时时间]
   * @return {Promise}
   */
  post(url, { data, params, headers = { 'content-type': 'application/x-www-form-urlencoded' }, withCredentials = false, timeout = 10000 } = {}) {
    return this.http({ url, method: 'post', data, params, headers, withCredentials, timeout })
  }
  /**
   * Get请求
   * @param  {String} url              [请求URL]
   * @param  {Object} data             [post请求数据]
   * @param  {Object} params           [url参数]
   * @param  {Object} headers          [header自定义]
   * @param  {Boolean} withCredentials  [设置是否跨域传输cookie]
   * @param  {int} [timeout=10000}] [过时时间]
   * @return {Promise}
   */
  get(url, { data, params, headers, withCredentials = false, timeout = 10000 } = {}) {
    return this.http({ url, method: 'get', data, params, headers, withCredentials, timeout })
  }
  sendBeacon(url, data) {
    return navigator.sendBeacon(url, data)
  }
  http(options) {
    // 增加接口请求的timespan
    options.params = options.params || {}
    if (this.reqHandle) {
      this.reqHandle(options)
    }
    return this.axios(options)
      .then((res) => {
        if (this.resHandle) {
          return this.resHandle(res.data, options)
        }
        return Promise.resolve(res.data)
      })
      .catch((err) => {
        let reqErr = err
        if (err.response || err.request) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          // The request was made but no response was received
          // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
          // http.ClientRequest in node.js
          reqErr = {
            errorNo: 1000,
            errorMsg: '网络请求错误!',
            httpStatus: (err.response && err.response.status) || 504
          }
        }
        // 错误提示
        console.warn('HTTP-ERROR:', {
          url: options.url,
          httpStatus: reqErr.httpStatus || 200,
          err: reqErr,
          options: JSON.stringify(options)
        })
        return Promise.reject(reqErr)
      })
  }
}

export default Fetch

if (!Promise.prototype.finally) {
  // eslint-disable-next-line no-extend-native
  Promise.prototype.finally = function(callback) {
    let P = this.constructor
    return this.then(
      (value) => P.resolve(callback()).then(() => value),
      (reason) =>
        P.resolve(callback()).then(() => {
          throw reason
        })
    )
  }
}
