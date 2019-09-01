import Fetch from './fetch'
export default new Fetch({
  resHandle: (res) => {
    if (res.code === 200) {
      return Promise.resolve(res)
    } else if (res.code === 401) {
      window.location.href = `http://${window.location.host}/login`
    }
    // eslint-disable-next-line prefer-promise-reject-errors
    return Promise.reject({ errorNo: res.code, errorMsg: res.message })
  }
})
