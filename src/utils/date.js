export function formatDate(date, fmt) {
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  let o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds()
  }
  for (let k in o) {
    if (new RegExp(`(${k})`).test(fmt)) {
      let str = o[k] + ''
      fmt = fmt.replace(RegExp.$1, RegExp.$1.length === 1 ? str : padLeftZero(str))
    }
  }
  return fmt
}

function padLeftZero(str) {
  return ('00' + str).substr(str.length)
}

export function formatTime(timeInSeconds, fps) {
  let hh = Math.floor(timeInSeconds / 3600)
  let mm = Math.floor((timeInSeconds - hh * 3600) / 60)
  let ss = Math.floor(timeInSeconds - hh * 3600 - mm * 60)
  let ff = Math.floor(fps * parseFloat(timeInSeconds - hh * 3600 - mm * 60 - ss))
  let h = hh < 10 ? '0' + hh : hh
  let m = mm < 10 ? '0' + mm : mm
  let s = ss < 10 ? '0' + ss : ss
  let f = ff < 10 ? '0' + ff : ff
  return String(h + ':' + m + ':' + s + ':' + f)
}
