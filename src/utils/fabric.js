//
import { fabric } from 'fabric'
import store from '../store/index.js'
// import { RData } from './Rdata'

class Fcanvas {
  constructor() {
    this.currentFcanvas = null
    this.strokeWidth = 3
    this.stroke = store.state.userInfo.color || 'yellow'
    this.is_draw_moving = false
    this.currentTM = ''
    this.snap = ''
    this.ANTPOINT = 'antPoint'
  }

  _clearCanvas() {
    this.currentFcanvas.remove(...this.currentFcanvas.getObjects())
  }

  init() {
    this.stroke = store.state.userInfo.color || 'yellow'
  }

  getSnap() {
    return this.snap
  }
  _configFabric() {
    // override fabric
    fabric.Object.prototype.cornerStyle = 'circle'
    fabric.Object.prototype.cornerSize = 9
    fabric.Object.prototype.rotatingPointOffset = 20
    fabric.Canvas.prototype.getItemById = function(id) {
      var object = null
      var objects = this.getObjects()

      for (var i = 0, len = this.size(); i < len; i++) {
        if (objects[i].id && objects[i].id === id) {
          object = objects[i]
          break
        }
      }

      return object
    }
    fabric.Canvas.prototype.getItemsByClassName = function(className) {
      var objectList = []
      var objects = this.getObjects()

      for (var i = 0, len = this.size(); i < len; i++) {
        if (objects[i].className && objects[i].className === className) {
          objectList.push(objects[i])
        }
      }

      return objectList
    }
  }
  // 转换id
  _canvasId(tm) {
    tm = String(tm)
    tm = tm.replace('.', '-')
    return 'canvas_' + tm
  }
  /**
   * 创建canvas
   * @param {string} time 当前视频时间
   * @returns {type} 返回值描述
   */
  _createCanvas(pauseInfo, el, withJSON = null) {
    let self = this
    this._configFabric()
    this.currentTM = pauseInfo.time
    store.commit('setCurrentTime', this.currentTM)
    // store.state.vData[self.currentTM] = {}
    let videoEl = pauseInfo.player.tech(true).el()
    let canvasId = this._canvasId(pauseInfo.time)
    let canvasHtml = this.append(canvasId)
    el.appendChild(canvasHtml)
    let fcanvas = new fabric.Canvas(canvasId, {
      // backgroundColor: 'white',
      // http://fabricjs.com/docs/fabric.Canvas.html#perPixelTargetFind
      // 接近线框的时候可以选中
      perPixelTargetFind: true,
      targetFindTolerance: 5
    })
    self._setCanvasSize(fcanvas, true)
    this._setCanvasWrapperSize()
    // fcanvas.setHeight(videoEl.offsetHeight)
    // fcanvas.setWidth(videoEl.offsetWidth)
    fcanvas.renderAll()
    if (!withJSON) {
      // add bkimg
      // https://ourcodeworld.com/articles/read/681/how-to-set-a-background-image-to-a-fabric-js-canvas
      let bkimg = this.captureVideo(videoEl)
      let img = new Image()
      if (bkimg['data']) {
        img.src = bkimg['data']
      }
      img.self = img
      img.onload = function() {
        let fimg = new fabric.Image(this.self)
        // https://stackoverflow.com/questions/47010467/fit-the-background-image-to-canvas-size-with-fabric-js
        fcanvas.setBackgroundImage(fimg, fcanvas.renderAll.bind(fcanvas), {
          scaleX: fcanvas.width / fimg.width,
          scaleY: fcanvas.height / fimg.height,
          opacity: 0 // 设置为透明，输出的时候再恢复
        })
        fcanvas.renderAll()
        this.self.onload = null
      }
    } else {
      fcanvas.loadFromJSON(withJSON)
    }
    let datachangeCallback = function() {
      self._refreshSnapshotByTM(self.currentTM)
    }
    fcanvas.on('object:added', datachangeCallback)
    fcanvas.on('object:removed', datachangeCallback)
    fcanvas.on('object:modified', datachangeCallback)
    this.currentFcanvas = fcanvas
    console.log(fcanvas)
    let operationType = store.state.operationType
    switch (operationType) {
    case 'move':
      _Fcanvas._onMove()
      break
    case 'comment':
      _Fcanvas._onAnnotation()
      break
    case 'draw':
      _Fcanvas._onFreeDraw()
      break
    case 'circle':
      _Fcanvas._onDrawEllipse()
      break
    case 'square':
      _Fcanvas._onDrawRect()
      break
    case 'arrow':
      _Fcanvas._onDrawArrow()
      break
    case 'delete':
      // _Fcanvas._onDeletion()
      break
    default:
      break
    }
    return fcanvas
  }
  _refreshSnapshotByTM(tm) {
    let self = this
    if (self.is_draw_moving) {
      // 拖拽绘图的时候，不执行；
      return true
    }
    // let tmStr = String(tm)
    if (!self.currentFcanvas) {
      return false
    }
    // 先删除
    // $('.snapshot[tm="' + tmStr + '"]').remove()
    // RData.updateData(tm, 'snap', {})

    // 空的不需要创建snap
    // if (RData.isFcanvasCommentsEmpty(tm)) {
    //   return true
    // }

    // 创建新的
    console.log(tm)
    let height = 80
    self._captureFcanvas(self.currentFcanvas, null, height)
    store.state.vData[tm]['Fcanvas'] = self.currentFcanvas
    // vdata对象排序
    var keysArr = Object.keys(store.state.vData).sort(function(a, b) {
      return a - b // a-b,升序。b-a，降序。
    })
    var sortObj = {}
    for (var i = 0; i < keysArr.length; i++) {
      var key = keysArr[i]
      sortObj[key] = store.state.vData[key]
    }
    store.state.vData = sortObj
    console.log(store.state.vData)
    return true
  }
  // 截图
  _captureFcanvas(fcanvas, width = null, height = null, dataURLConfig = null) {
    if (!fcanvas) {
      return
    }
    // 截图之前，设置background img非透明，完成之后再设置回来
    let backgroundImage = fcanvas.backgroundImage
    if (backgroundImage) {
      backgroundImage.opacity = 1
    }
    //
    let src
    // if (dataURLConfig) {
    //   src = fcanvas.toDataURL(dataURLConfig)
    // } else {
    //   src = fcanvas.toDataURL()
    // }
    let quality = 0.5
    src = fcanvas.toDataURL('image/jpeg', quality)
    let w = fcanvas.width
    let h = fcanvas.height
    if (width) {
      w = width
      h = (fcanvas.height * width) / fcanvas.width
    } else if (height) {
      h = height
      w = (fcanvas.width * height) / fcanvas.height
    }
    //
    if (backgroundImage) {
      backgroundImage.opacity = 0
    }
    // console.log('snap', src)
    this.snap = {
      width: w,
      height: h,
      src: src,
      tm: this.currentTM,
      canvas: fcanvas.toJSON()
    }
    store.commit('setSnaps', this.snap)
    console.log()
    return this.snap
  }
  // 暂停拿到截图
  downLoadImg() {
    if (!this.currentFcanvas) {
      return false
    }
    let filename = this.currentTM + '.png'
    let snap = this._captureFcanvas(this.currentFcanvas)
    this.saveBase64AsFile(snap.src, filename)
  }
  // 下载截图
  saveBase64AsFile(base64, fileName) {
    var link = document.createElement('a')
    link.setAttribute('href', base64)
    link.setAttribute('download', fileName)
    link.click()
  }

  captureVideo(videoEl, height = 0) {
    let v = videoEl
    let c = document.createElement('canvas')
    c.height = v.videoHeight
    if (height > 0) {
      c.height = height
    }
    c.width = (v.videoWidth * c.height) / v.videoHeight
    console.log(v)
    c.getContext('2d').drawImage(v, 0, 0, c.width, c.height)
    console.log('c', c)

    return {
      data: c.toDataURL(),
      width: c.width,
      height: c.height
    }
  }
  // eslint-disable-next-line
  isset(obj, key) {
    if (key in obj) {
      return true
    } else {
      return false
    }
  }
  _resizeAllCanvas() {
    let self = this
    let vData = store.state.vData
    for (let tm in vData) {
      if (self.isset(vData[tm], 'Fcanvas')) {
        let fcanvas = vData[tm]['Fcanvas']
        self._setCanvasSize(fcanvas)
      }
    }
    //
    self._setCanvasWrapperSize()
  }
  getVideoPos() {
    // let self = this
    let playerEl = document.getElementsByClassName('video-player')[0]
    return {
      offsetLeft: playerEl.offsetLeft,
      offsetTop: playerEl.offsetTop,
      offsetWidth: playerEl.offsetWidth,
      offsetHeight: playerEl.offsetHeight
    }
  }
  _setCanvasSize(fcanvas, isNew = false) {
    // let self = this
    let videoEl = this.getVideoPos()
    // 新建：使用video的w/h
    if (isNew) {
      fcanvas.setHeight(videoEl.offsetHeight)
      fcanvas.setWidth(videoEl.offsetWidth)
      fcanvas.renderAll()
      return true
    }
    // 旧：使用zoom
    // https://stackoverflow.com/questions/34874844/fabricjs-objects-not-relative-to-canvas-resize
    let zoom
    if (fcanvas.width < videoEl.offsetWidth) {
      zoom = videoEl.offsetHeight / fcanvas.height
      if (zoom * fcanvas.width > videoEl.offsetWidth) {
        zoom = videoEl.offsetWidth / fcanvas.width
      }
    } else {
      zoom = videoEl.offsetWidth / fcanvas.width
      if (zoom * fcanvas.height > videoEl.offsetHeight) {
        zoom = videoEl.offsetHeight / fcanvas.height
      }
    }
    fcanvas.setZoom(zoom)
    return true
  }
  _setCanvasWrapperSize() {
    let videoEl = this.getVideoPos()
    let el = document.getElementsByClassName('canvas-wrapper')[0]
    el.style.position = 'absolute'
    // el.style.top = videoEl.offsetTop
    // el.style.left = videoEl.offsetLeft
    el.style.width = videoEl.offsetWidth
    el.style.height = videoEl.offsetHeight
  }
  append(id) {
    let canvas = document.createElement('canvas')
    canvas.setAttribute('id', id)
    return canvas
  }
  // 移动
  _onMove() {
    let self = this
    self._resetCanvasEvents()
    if (self.currentFcanvas) {
      self.currentFcanvas.selection = true
    }
  }
  // 获取时间戳
  _genCid() {
    // cid 使用 timestamp(ms)
    return String(Date.now())
  }
  _isAntPoint(obj) {
    return obj && obj.className === this.ANTPOINT
  }
  _isPointCboxHide() {
    return store.state.hideComment
  }
  // 从canvas移除无效的antPoints
  _clearInvalidAntPoints() {
    let self = this
    //
    store.commit('setHideComment', true)
    // Data中没有的为无效
    if (self.currentFcanvas == null) {
      return false
    }
    var points = self.currentFcanvas.getItemsByClassName(this.ANTPOINT)
    if (store.state.vData[self.currentTM]) {
      let comments = store.state.vData[self.currentTM].comments
      for (let i in points) {
        let obj = points[i]
        if (comments) {
          let filterComments = comments.filter((item) => {
            return item.cid === obj.id
          })
          if (filterComments.length <= 0) {
            self.currentFcanvas.remove(obj)
          }
        } else {
          self.currentFcanvas.remove(obj)
        }
      }
    }
  }
  _setAntPointOpacity(cid, opacity) {
    let self = this
    if (!self.currentFcanvas) {
      return false
    }
    var antPoint = self.currentFcanvas.getItemById(cid)
    if (antPoint) {
      antPoint.item(0).set('opacity', opacity)
      self.currentFcanvas.renderAll()
    }
  }
  // 评论
  _onAnnotation(o) {
    let self = this
    self._resetCanvasEvents()
    if (!self.currentFcanvas) {
      return false
    }
    self.currentFcanvas.on('mouse:down', function(o) {
      // 如果已经有了，隐藏掉
      if (!self._isPointCboxHide()) {
        console.log(4444)
        self._clearInvalidAntPoints()
        return
      }
      // 点非空白区域
      if (o.target) {
        if (self._isAntPoint(o.target)) {
          // 不允许叠加
          return
        }
      }

      //
      let cid = self._genCid()
      let pointNum = '1'
      if (!store.state.vData[self.currentTM]) {
        store.state.vData[self.currentTM] = {}
      }
      let comments = store.state.vData[self.currentTM].comments
      if (comments && comments.length > 0) {
        pointNum = String(Number(comments[comments.length - 1].pointNum) + 1)
      }

      // add point
      let pcircle = new fabric.Circle({
        radius: 10,
        fill: self.stroke,
        originX: 'center',
        originY: 'center'
      })
      let ptext = new fabric.Text(pointNum, {
        fontSize: 12,
        fontFamily: 'Sans Serif',
        fill: 'black',
        originX: 'center',
        originY: 'center'
      })
      let pgroup = new fabric.Group([pcircle, ptext], {
        left: o.pointer.x,
        top: o.pointer.y,
        originX: 'center',
        originY: 'center',
        hasControls: false,
        hasBorder: false,
        className: self.ANTPOINT,
        id: cid
      })

      //
      pgroup.on('moving', function(o) {
        store.commit('hideComment', true)
      })
      pgroup.on('mouseover', function(o) {
        if (o.target && o.target.id) {
          console.log(o.target.id)
          store.commit('setCommentOn', o.target.id)
        }
      })
      pgroup.on('mouseout', function(o) {
        if (o.target && o.target.id) {
          store.commit('setCommentOn', 0)
        }
      })
      //
      self.currentFcanvas.add(pgroup)
      //
      self._showPointCbox(o, cid, pointNum)
    })
  }
  _showPointCbox(o, cid, pointNum) {
    let x = o.pointer.x
    let y = o.pointer.y
    store.commit('setHideComment', false)
    store.commit('commentPoint', { x, y, pointNum, cid })
    // 高亮对应的comment
    // this._highlightCommentByCid(cid)
  }
  // 画圆
  _onDrawEllipse() {
    let self = this
    self._resetCanvasEvents()
    if (!self.currentFcanvas) {
      return false
    }

    //
    let ellipse = null
    let isDown = false
    let origX
    let origY
    self.currentFcanvas.on('mouse:down', function(o) {
      ellipse = null
      if (o.target) {
        // click on an object
        return
      }
      isDown = true
      //  self.is_draw_moving = true
    })
    self.currentFcanvas.on('mouse:move', function(o) {
      if (!isDown) {
        return
      }
      //
      var pointer = self.currentFcanvas.getPointer(o.e)
      if (ellipse == null) {
        origX = pointer.x
        origY = pointer.y
        ellipse = new fabric.Ellipse({
          left: origX,
          top: origY,
          originX: 'left',
          originY: 'top',
          rx: pointer.x - origX,
          ry: pointer.y - origY,
          fill: '',
          stroke: self.stroke,
          strokeWidth: self.strokeWidth
        })
        self.currentFcanvas.add(ellipse)
        self.currentFcanvas.renderAll()
      }

      //
      var rx = Math.abs(origX - pointer.x) / 2
      var ry = Math.abs(origY - pointer.y) / 2
      if (rx > ellipse.strokeWidth) {
        rx -= ellipse.strokeWidth / 2
      }
      if (ry > ellipse.strokeWidth) {
        ry -= ellipse.strokeWidth / 2
      }
      ellipse.set({ rx: rx, ry: ry })

      if (origX > pointer.x) {
        ellipse.set({ originX: 'right' })
      } else {
        ellipse.set({ originX: 'left' })
      }
      if (origY > pointer.y) {
        ellipse.set({ originY: 'bottom' })
      } else {
        ellipse.set({ originY: 'top' })
      }
      self.currentFcanvas.renderAll()
    })

    self.currentFcanvas.on('mouse:up', function(o) {
      //  self.is_draw_moving = false
      isDown = false
      // 这个是workaround，不加画完之后无法选择；
      if (ellipse == null) {
        return
      }
      self._wrapInGroup([ellipse])
    })
  }
  // 画矩形
  _onDrawRect() {
    let self = this
    self._resetCanvasEvents()
    if (!self.currentFcanvas) {
      return false
    }

    //
    var rect = null
    var isDown = false
    var origX
    var origY
    self.currentFcanvas.on('mouse:down', function(o) {
      //
      rect = null
      if (o.target) {
        // click on an object
        return
      }
      isDown = true
      self.is_draw_moving = true
    })

    self.currentFcanvas.on('mouse:move', function(o) {
      if (!isDown) {
        return
      }

      var pointer = self.currentFcanvas.getPointer(o.e)
      //
      if (rect == null) {
        origX = pointer.x
        origY = pointer.y
        rect = new fabric.Rect({
          left: origX,
          top: origY,
          originX: 'left',
          originY: 'top',
          width: pointer.x - origX,
          height: pointer.y - origY,
          fill: '',
          stroke: self.stroke,
          strokeWidth: self.strokeWidth
        })
        self.currentFcanvas.add(rect)
        self.currentFcanvas.renderAll()
      }

      //
      if (origX > pointer.x) {
        rect.set({
          left: Math.abs(pointer.x)
        })
      }
      if (origY > pointer.y) {
        rect.set({
          top: Math.abs(pointer.y)
        })
      }
      rect.set({
        width: Math.abs(origX - pointer.x)
      })
      rect.set({
        height: Math.abs(origY - pointer.y)
      })
      self.currentFcanvas.renderAll()
    })

    self.currentFcanvas.on('mouse:up', function(o) {
      self.is_draw_moving = false
      isDown = false
      // 这个是workaround，不加画完之后无法选择；
      if (rect == null) {
        return
      }
      self._wrapInGroup([rect])
    })
  }
  // 自由绘
  _onFreeDraw() {
    let self = this
    //
    self._resetCanvasEvents()
    if (!self.currentFcanvas) {
      return false
    }
    // enable DrawingMode
    self.currentFcanvas.isDrawingMode = true
    self.currentFcanvas.selection = false
    self.currentFcanvas.freeDrawingBrush.color = self.stroke
    self.currentFcanvas.freeDrawingBrush.width = self.strokeWidth
  }
  // 画箭头
  _onDrawArrow() {
    let self = this
    self._resetCanvasEvents()
    if (!self.currentFcanvas) {
      return false
    }
    //
    var line = null
    var triangle = null
    var isDown = false
    var deltaX
    var deltaY
    self.currentFcanvas.on('mouse:down', function(o) {
      //
      line = null
      triangle = null
      if (o.target) {
        // click on an object
        return
      }
      isDown = true
      self.is_draw_moving = true
    })

    self.currentFcanvas.on('mouse:move', function(o) {
      if (!isDown) {
        return
      }
      var pointer = self.currentFcanvas.getPointer(o.e)
      var points = [pointer.x, pointer.y, pointer.x, pointer.y]
      //
      if (line == null && triangle == null) {
        line = new fabric.Line(points, {
          fill: 'transparent',
          stroke: self.stroke,
          strokeWidth: self.strokeWidth,
          originX: 'center',
          originY: 'center'
        })
        var centerX = (line.x1 + line.x2) / 2
        var centerY = (line.y1 + line.y2) / 2
        deltaX = line.left - centerX
        deltaY = line.top - centerY
        //
        triangle = new fabric.Triangle({
          left: line.get('x1') + deltaX,
          top: line.get('y1') + deltaY,
          originX: 'center',
          originY: 'center',
          angle: -45,
          width: 12,
          height: 12,
          strokeWidth: self.strokeWidth,
          fill: self.stroke
        })
        self.currentFcanvas.add(line, triangle)
        self.currentFcanvas.renderAll()
      }

      //
      line.set({
        x2: pointer.x,
        y2: pointer.y
      })
      triangle.set({
        left: pointer.x + deltaX,
        top: pointer.y + deltaY,
        angle: self._calArrowAngle(line.x1, line.y1, line.x2, line.y2)
      })
      self.currentFcanvas.renderAll()
    })

    self.currentFcanvas.on('mouse:up', function(o) {
      self.is_draw_moving = false
      isDown = false
      //
      if (line == null || triangle == null) {
        return
      }
      self._wrapInGroup([line, triangle])
    })
  }
  _calArrowAngle(x1, y1, x2, y2) {
    var angle = 0
    var x
    var y
    x = x2 - x1
    y = y2 - y1
    if (x === 0) {
      angle = y === 0 ? 0 : y > 0 ? Math.PI / 2 : (Math.PI * 3) / 2
    } else if (y === 0) {
      angle = x > 0 ? 0 : Math.PI
    } else {
      angle = x < 0 ? Math.atan(y / x) + Math.PI : y < 0 ? Math.atan(y / x) + 2 * Math.PI : Math.atan(y / x)
    }
    return (angle * 180) / Math.PI + 90
  }
  // 删除选中的
  _onDeletion() {
    let self = this
    if (!self.currentFcanvas) {
      return false
    }
    self.currentFcanvas.getActiveObjects().forEach((obj) => {
      //
      if (!self._isAntPoint(obj)) {
        self.currentFcanvas.remove(obj)
        return
      }
      //
      self._deleteCommentByCid(obj.id)
    })
    self.currentFcanvas.discardActiveObject().renderAll()
  }
  // 完整地删除 comment
  _deleteCommentByCid(cid) {
    let self = this
    // 从data中删除
    let comments = store.state.vData[self.currentTM].comments
    if (comments) {
      comments = comments.map((item, index) => {
        if (item.cid === cid) {
          comments.splice(index, 1)
        }
      })
      // 从canvas中删除
      self._clearInvalidAntPoints()
      self._recalPointNums()
    }
  }
  // 重新计算 pointNum (3个地方)
  _recalPointNums() {
    let self = this
    if (!self.currentFcanvas) {
      return false
    }
    // 重新计算并更新data
    let cid2pointNum = self.reCalPointNumsByTM(self.currentTM)
    if (JSON.stringify(cid2pointNum) === '{}') {
      return
    }
    // 更新界面
    for (let cid in cid2pointNum) {
      if (!cid2pointNum.hasOwnProperty(cid)) {
        continue
      }
      let pointNum = cid2pointNum[cid]
      // 更新 canvas
      self._setAntPointPointNum(cid, pointNum, false)
    }
    //
    self.currentFcanvas.renderAll()
  }
  reCalPointNumsByTM(tm) {
    let self = this
    let cid2pointNum = {}
    let comments = store.state.vData[self.currentTM].comments
    let num = 1
    comments.forEach((item) => {
      if (item.isPoint) {
        item.pointNum = num
        num++
      }
    })
    let pointComments = comments.filter((item) => {
      return item.isPoint === true
    })
    if (pointComments.length <= 0) {
      return cid2pointNum
    }
    let pointNum = 1
    pointComments.forEach((item) => {
      item.pointNum = pointNum
      cid2pointNum[item.cid] = pointNum
      pointNum++
    })

    return cid2pointNum
  }
  _setAntPointPointNum(cid, pointNum, forceRender = true) {
    let self = this
    if (!self.currentFcanvas) {
      return false
    }
    var antPoint = self.currentFcanvas.getItemById(cid)
    if (antPoint) {
      antPoint.item(1).set('text', String(pointNum))
      if (forceRender) {
        self.currentFcanvas.renderAll()
      }
    }
  }
  // 重置canvas
  _resetCanvasEvents() {
    let self = this
    if (self.currentFcanvas == null) {
      return false
    }
    // disable DrawingMode
    self.currentFcanvas.isDrawingMode = false
    self.currentFcanvas.selection = false
    //
    self._clearInvalidAntPoints()
    // clear events
    self.currentFcanvas.off('mouse:down')
    self.currentFcanvas.off('mouse:move')
    self.currentFcanvas.off('mouse:up')
  }
  // 修改当前canvas对象
  changeFcanvas(tm) {
    let self = this
    self.currentTM = tm
    self.currentFcanvas = this.getFcanvas(tm)
  }
  // 取到对应时间的Fcanvas
  getFcanvas(tm) {
    tm = String(tm)
    if (!store.state.vData[tm]) {
      return null
    }
    if (store.state.vData[tm]['Fcanvas']) {
      return store.state.vData[tm]['Fcanvas']
    }
  }
  // fabric 分组
  _wrapInGroup(list) {
    let self = this
    if (list.length <= 0) {
      return
    }
    if (!self.currentFcanvas) {
      return false
    }
    self.currentFcanvas.discardActiveObject()
    for (var i = 0; i < list.length; i++) {
      self.currentFcanvas.remove(list[i])
    }
    var group = new fabric.Group(list, {
      hasBorders: true,
      hasControls: true
    })
    self.currentFcanvas.add(group)
  }
}
let _Fcanvas = new Fcanvas()
export { _Fcanvas }
