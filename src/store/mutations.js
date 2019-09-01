/**
 * [mutations description]
 * @type {Object}
 */
let mutations = {
  setUserInfo(state, userInfo) {
    state.userInfo = userInfo
  },
  setCurrentTime(state, time) {
    state.currentTime = time
  },
  // 评论点坐标
  commentPoint(state, point) {
    state.point = point
  },
  setSnaps(state, snap) {
    state.snap = snap
    let _snap = {}
    _snap.snap = snap
    if (state.vData[snap.tm]) {
      state.vData[snap.tm].snap = snap
    } else {
      state.vData[snap.tm] = {}
      state.vData[snap.tm].snap = snap
    }
    state.snaps.push(snap)
  },
  setVdata(state, vdata) {
    state.vData = vdata
  },
  // hover comment id
  setCommentOn(state, id) {
    state.commentId = id
  },
  setHideComment(state, value) {
    state.hideComment = value
  },
  setOperationType(state, type) {
    state.operationType = type
  }
}

export default mutations
