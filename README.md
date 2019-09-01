## 环境

- 测试环境
  http://39.100.103.142:8888

* 线上环境
  http://39.100.103.142

## 接口输入和输入定义

- 输入：同时支持 GET 和 POST

- 输出：JSON 格式
  {
  "code": "错误码",
  "message": "错误码==200 的时候，为空；错误码!=200 的时候，表示错误信息",
  "data": obj
  }

- 没有特殊说明的情况下，接口均需要在登录态下调用。

## 配置相关

- config/get-config 获取配置信息
  // 输入：无
  // 输出：成功之后，返回配置信息（比如颜色列表）

## user 相关

- user/register 注册接口（非登录态)
  // 输入：
  mobile: int, 必须
  name: string, 必须
  password: string, 必须, 长度>=6
  // 输出：
  成功之后，返回 user 信息

- user/login 登录接口（非登录态)
  // 输入：
  mobile: int, 必须
  password: string, 必须, 长度>=6
  // 输出：
  成功之后，返回 user 信息

- user/logout 登出接口
  // 输入：无
  // 输出：成功，返回 null

- user/get-user 获取用户信息接口
  // 输入：无
  // 输出：成功，返回用户信息

- user/update-user 更新用户信息接口
  // 输入：不能都为空
  mobile: int, 可选,
  name: string, 可选，
  color: string, 可选，
  password: string, 可选, 长度>=6
  old_password: string, 可选（password 存在的时候，必须）, 长度>=6
  // 输出：
  成功，返回用户信息

## project 相关

- projects/create-project 创建项目
  // 输入：
  pname: string, 必须，项目名称
  // 输出：
  成功，返回项目信息

- projects/update-project 项目重命名
  // 输入：
  pid: int, 必须，项目 id
  pname: string, 必须，项目名称
  // 输出：
  成功，返回项目信息

- projects/delete-project 删除项目（软删除）
  // 输入：
  pid: int, 必须，项目 id
  // 输出：
  成功，返回 null

- projects/get-projects 获取登录用户的项目列表
  // 输入：无
  // 输出：
  成功，返回项目列表

## video 相关

- videos/get-videos-by-pid 获取 pid 下的视频列表
  // 输入：
  pid: int, 必须，项目 id
  // 输出：
  成功，返回项目信息以及视频列表

- videos/delete-video 删除视频（软删除）
  // 输入：
  vid: int, 必须，视频 id
  // 输出：
  成功，返回 null

- videos/get-video-by-vid 根据 vid 获取视频详情
  // 输入：
  vid: int, 必须，视频 id
  // 输出：
  成功，返回视频详细信息

- videos/update-video-vdata 更新视频的标注信息
  // 输入：
  vid: int, 必须，视频 id
  vdata: string, 必须
  // 输出：
  成功，返回 null

- 上传视频

整个上传方案参考如下最佳实践（服务端签名后客户端直传）：
https://help.aliyun.com/document_detail/31926.html
客户端实现参看：https://help.aliyun.com/document_detail/31927.html#h2-url-5

1. 客户端首先调用 videos/get-upload-sign 接口获取上传的 policy 和 signature；
   // 输入：无
   // 输出：成功返回 policy 和 signature，存在有效期(30min)；

2. 参看客户端 js 代码示例，上传；
   防止文件重名，建议使用随机字符做文件名（但保留文件后缀）；

3. #2 成功之后，调用 videos/create-video 更新后台 db
   // 输入：
   pid: int, 必须，项目 id
   vname: string, 必须, 用户看到的视频文件名
   vpath: string, 必须，上传到 oss 的时候使用的文件名
   // 输出：
   成功，返回视频信息
