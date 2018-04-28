import Vue from 'vue';
import iView from 'iview';
import {router} from './router/index';
import {appRouter} from './router/router';
import store from './store';
import App from './app.vue';
import axios from 'axios'
// import qs from 'qs'
import 'font-awesome/css/font-awesome.css'
import Cookies from 'js-cookie';
import '@/locale';
import 'iview/dist/styles/iview.css';
import VueI18n from 'vue-i18n';
import global from './global.js';
import area from './area.json';
import Default from './default.json';
import colorPicker  from './template/vue-color-picker';
//import util from '@/libs/util';
import { VirtualScroller } from 'vue-virtual-scroller';
// import  VueQuillEditor from 'vue-quill-editor'
import VueHtml5Editor from 'vue-html5-editor'
import $ from "jquery"

import CryptoJS from 'crypto-js'
let Base64 = require('js-base64').Base64
Vue.use(VueI18n);
Vue.use(colorPicker)

// Vue.use(VueHtml5Editor, {
//   // 全局组件名称，使用new VueHtml5Editor(options)时该选项无效
//   // global component name
//   name: "vue-html5-editor",
//   // 是否显示模块名称，开启的话会在工具栏的图标后台直接显示名称
//   // if set true,will append module name to toolbar after icon
//   // showModuleName: false,
//   // 自定义各个图标的class，默认使用的是font-awesome提供的图标
//   // custom icon class of built-in modules,default using font-awesome
//   icons: {
//     text: "fa fa-pencil",
//     color: "fa fa-paint-brush",
//     font: "fa fa-font",
//     align: "fa fa-align-justify",
//     list: "fa fa-list",
//     link: "fa fa-chain",
//     unlink: "fa fa-chain-broken",
//     tabulation: "fa fa-table",
//     image: "fa fa-file-image-o",
//     hr: "fa fa-minus",
//     eraser: "fa fa-eraser",
//     undo: "fa-undo fa",
//     "full-screen": "fa fa-arrows-alt",
//     info: "fa fa-info",
//   },
//   // 配置图片模块
//   // config image module
//   image: {
//     // 文件最大体积，单位字节  max file size
//     sizeLimit: 512 * 1024,
//     // 上传参数,默认把图片转为base64而不上传
//     // upload config,default null and convert image to base64
//     upload: {
//       url: 'http://upload-z2.qiniu.com',
//       headers: {},
//       params: store.state.imgPostData,
//       // params: {tokenParams: 123},
//       fieldName: 'file'
//     },
//     // 压缩参数,默认使用localResizeIMG进行压缩,设置为null禁止压缩
//     // compression config,default resize image by localResizeIMG (https://github.com/think2011/localResizeIMG)
//     // set null to disable compression
//     compress: {
//       width: 1600,
//       height: 1600,
//       quality: 80
//     },
//     // 响应数据处理,最终返回图片链接
//     // handle response data，return image url
//     uploadHandler(responseText){
//       //default accept json data like  {ok:false,msg:"unexpected"} or {ok:true,data:"image url"}
//       var json = JSON.parse(responseText)
//       if (!json.ok) {
//         alert(json.msg)
//       } else {
//         return json.data
//       }
//     }
//   },
//   // 语言，内建的有英文（en-us）和中文（zh-cn）
//   //default en-us, en-us and zh-cn are built-in
//   language: "zh-cn",
//   // 自定义语言
//   i18n: {
//     //specify your language here
//     "zh-cn": {
//       "align": "对齐方式",
//       "image": "图片",
//       "list": "列表",
//       "link": "链接",
//       "unlink": "去除链接",
//       "table": "表格",
//       "font": "文字",
//       "full screen": "全屏",
//       "text": "排版",
//       "eraser": "格式清除",
//       "info": "关于",
//       "color": "颜色",
//       "please enter a url": "请输入地址",
//       "create link": "创建链接",
//       "bold": "加粗",
//       "italic": "倾斜",
//       "underline": "下划线",
//       "strike through": "删除线",
//       "subscript": "上标",
//       "superscript": "下标",
//       "heading": "标题",
//       "font name": "字体",
//       "font size": "文字大小",
//       "left justify": "左对齐",
//       "center justify": "居中",
//       "right justify": "右对齐",
//       "ordered list": "有序列表",
//       "unordered list": "无序列表",
//       "fore color": "前景色",
//       "background color": "背景色",
//       "row count": "行数",
//       "column count": "列数",
//       "save": "确定",
//       "upload": "上传",
//       "progress": "进度",
//       "unknown": "未知",
//       "please wait": "请稍等",
//       "error": "错误",
//       "abort": "中断",
//       "reset": "重置"
//     }
//   },
//   // 隐藏不想要显示出来的模块
//   // the modules you don't want
//   hiddenModules: [],
//   // 自定义要显示的模块，并控制顺序
//   // keep only the modules you want and customize the order.
//   // can be used with hiddenModules together
//   visibleModules: [
//     "text",
//     "color",
//     "font",
//     "align",
//     "list",
//     "link",
//     "unlink",
//     "tabulation",
//     "image",
//     "hr",
//     "eraser",
//     "undo",
//     "full-screen",
//     "info",
//   ],
//   // 扩展模块，具体可以参考examples或查看源码
//   // extended modules
//   modules: {
//     //omit,reference to source code of build-in modules
//   }
// });

console.log(123, store.state.imgPostData)
Vue.use(iView);
// Vue.use(VueQuillEditor)
Vue.component('virtual-scroller', VirtualScroller);

Vue.prototype.$getLocalData = function (fuc) {
  let form = Default
  form.area = area.area
  fuc(form)
}
// Vue.prototype.$updateDataImg = function (data) { // 富文本添加图片
//   for (let val of document.getElementsByClassName("content")) {
//     if (val.parentElement.className == 'vue-html5-editor') {
//       document.execCommand('insertImage', 0, data)
//     }
//   }
// }
Vue.prototype.$axios = function (params) {
  console.log('params', params)
  // cr-token 算法
  let resultData = 0
  if(Cookies.get('ticketsSalt')){
      function rndRandom (size) {
      let rnd = {}
      rnd.size = size
      rnd.list = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
      rnd.val = '' // key
      for (var i = 0; i < rnd.size; ++i) {
        var tmp = parseInt((rnd.list.length) * Math.random())
        if (i === 7) {
          if (tmp % 2 === 0) {
            rnd.val += '_'
          } else {
            rnd.val += rnd.list[tmp] + '_'
            rnd.list.splice(tmp, 1)
            i++
          }
        } else {
          rnd.val += rnd.list[tmp]
          rnd.list.splice(tmp, 1)
        }
      }
      return rnd.val
    }
      let postTime = ''+(Date.parse(new Date()))// 时间戳
      let postVersion = rndRandom(20) // uuid随机数
      let base64DataBefore = {
          tickets: Cookies.get('tickets'),
          platform: window.localStorage.getItem('platform'),
          postVersion: postVersion,
          postTime:postTime,
          appVersion: 1
      }
     // sessionSalt="sessionSalt"&postVersion="UUid 随机数"&postTime="时间戳"&platform="平台名称"&clientUid="机器唯一编码"
      let hmacDataBefore = 'ticketsSalt=' + Cookies.get('ticketsSalt')+'&postVersion='+postVersion+'&postTime='+postTime+'&platform='+window.localStorage.getItem('platform')+'&clientUid='+window.localStorage.getItem('clientUid')
      var hmacData = CryptoJS.HmacSHA1(hmacDataBefore, Cookies.get('ticketsSalt'))
      let base64Data = Base64.encode(JSON.stringify(base64DataBefore))
      resultData = base64Data+'.'+hmacData
  }
//
  let baseUrl = global.configSelf.api
  if (params.type === 'get') {
    console.log(1, params.data)
    axios.get(baseUrl + params.url, {params: params.data, withCredentials:false, headers: {"Content-Type": "application/json", "Accept" : "*/*", 'CR-token': resultData}})
      .then(function(response){
        if (response.data.code != 1) {
          // params.fuc(response.data)
          params.nowThis.$Modal.warning({
            content: response.data.msg,
            title: '警告',
            onOk: () => {
//              params.nowThis.$store.commit('logout', this);
//              params.nowThis.$store.commit('clearOpenedSubmenu');
//              params.nowThis.$router.push({
//                  name: 'login'
//              })
            }
          })
//          params.nowThis.$Modal.warning({
//            content: response.data.msg,
//            title: '警告',
//            onOk: () => {
//              params.nowThis.$store.commit('logout', this);
//              params.nowThis.$store.commit('clearOpenedSubmenu');
//              params.nowThis.$router.push({
//                  name: 'login'
//              })
//            }
//          })
        } else {
          params.fuc(response.data)
        }
      })
      .catch(function(error){
          params.nowThis.$Modal.warning({
            content: error,
            title: '错误'
          })
      });
  } else {
    axios.post(
      baseUrl + params.url,
      params.data,
      {
        withCredentials:false, 
        headers: {"Content-Type": "application/json", 'CR-token': resultData}
      })
      .then(function(response){
        if (response.data.code != 1) {
          params.nowThis.$Modal.warning({
            content: response.data.msg,
            title: '警告',
            onOk: () => {
//              params.nowThis.$store.commit('logout', this);
//              params.nowThis.$store.commit('clearOpenedSubmenu');
//              params.nowThis.$router.push({
//                  name: 'login'
//              })
            }
          })
        } else {
          params.fuc(response.data)
        }
      })
      .catch(function(error){
        console.log(error)
          params.nowThis.$Message.warning(error)
      });
  }
}
Vue.prototype.$start = 1
Vue.prototype.$limit = 3
Vue.prototype.$handleCurrentChange = function (val, fuc, nowThis) {
  nowThis.$start = val
  fuc()
}
Vue.prototype.$closeAndGoParent = function (oldName, goName) {
  this.$store.commit('removeTag', oldName)
  this.$router.push(goName)
}

new Vue({
    el: '#app',
    router: router,
    store: store,
    render: h => h(App),
    data: {
        currentPageName: ''
    },
    mounted () {
        this.currentPageName = this.$route.name;
        // 显示打开的页面的列表
        this.$store.commit('setOpenedList');
        this.$store.commit('initCachepage');
        // 权限菜单过滤相关
        this.$store.commit('updateMenulist');
        // iview-admin检查更新
        // util.checkUpdate(this);
    },
    computed: {
      getImgToken () {
        return this.$store.state.imgPostData
      }
    },
    watch: {
      // getImgToken () {
      //   console.log('ad', this)
      //   let _this = this
      //   Vue.use(VueHtml5Editor, {
      //     // 全局组件名称，使用new VueHtml5Editor(options)时该选项无效
      //     // global component name
      //     name: "vue-html5-editor",
      //     // 是否显示模块名称，开启的话会在工具栏的图标后台直接显示名称
      //     // if set true,will append module name to toolbar after icon
      //     // showModuleName: false,
      //     // 自定义各个图标的class，默认使用的是font-awesome提供的图标
      //     // custom icon class of built-in modules,default using font-awesome
      //     icons: {
      //       text: "fa fa-pencil",
      //       color: "fa fa-paint-brush",
      //       font: "fa fa-font",
      //       align: "fa fa-align-justify",
      //       list: "fa fa-list",
      //       link: "fa fa-chain",
      //       unlink: "fa fa-chain-broken",
      //       tabulation: "fa fa-table",
      //       image: "fa fa-file-image-o",
      //       hr: "fa fa-minus",
      //       eraser: "fa fa-eraser",
      //       undo: "fa-undo fa",
      //       "full-screen": "fa fa-arrows-alt",
      //       info: "fa fa-info",
      //     },
      //     // 配置图片模块
      //     // config image module
      //     image: {
      //       // 文件最大体积，单位字节  max file size
      //       sizeLimit: 2048 * 1024,
      //       // 上传参数,默认把图片转为base64而不上传
      //       // upload config,default null and convert image to base64
      //       upload: {
      //         url: 'http://upload-z2.qiniu.com',
      //         headers: {},
      //         params: store.state.imgPostData,
      //         // params: {tokenParams: 123},
      //         fieldName: 'file'
      //       },
      //       // 压缩参数,默认使用localResizeIMG进行压缩,设置为null禁止压缩
      //       // compression config,default resize image by localResizeIMG (https://github.com/think2011/localResizeIMG)
      //       // set null to disable compression
      //       compress: {
      //         width: 1600,
      //         height: 1600,
      //         quality: 80
      //       },
      //       // 响应数据处理,最终返回图片链接
      //       // handle response data，return image url
      //       uploadHandler(responseText){
      //         //default accept json data like  {ok:false,msg:"unexpected"} or {ok:true,data:"image url"}
      //         var json = JSON.parse(responseText)
      //         // cr-token 算法
      //         let resultData = 0
      //         if(Cookies.get('ticketsSalt')){
      //           function rndRandom (size) {
      //             let rnd = {}
      //             rnd.size = size
      //             rnd.list = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
      //             rnd.val = '' // key
      //             for (var i = 0; i < rnd.size; ++i) {
      //               var tmp = parseInt((rnd.list.length) * Math.random())
      //               if (i === 7) {
      //                 if (tmp % 2 === 0) {
      //                   rnd.val += '_'
      //                 } else {
      //                   rnd.val += rnd.list[tmp] + '_'
      //                   rnd.list.splice(tmp, 1)
      //                   i++
      //                 }
      //               } else {
      //                 rnd.val += rnd.list[tmp]
      //                 rnd.list.splice(tmp, 1)
      //               }
      //             }
      //             return rnd.val
      //           }
      //           let postTime = ''+(Date.parse(new Date()))// 时间戳
      //           let postVersion = rndRandom(20) // uuid随机数
      //           let base64DataBefore = {
      //             tickets: Cookies.get('tickets'),
      //             platform: window.localStorage.getItem('platform'),
      //             postVersion: postVersion,
      //             postTime:postTime,
      //             appVersion: 1
      //           }
      //           // sessionSalt="sessionSalt"&postVersion="UUid 随机数"&postTime="时间戳"&platform="平台名称"&clientUid="机器唯一编码"
      //           let hmacDataBefore = 'ticketsSalt=' + Cookies.get('ticketsSalt')+'&postVersion='+postVersion+'&postTime='+postTime+'&platform='+window.localStorage.getItem('platform')+'&clientUid='+window.localStorage.getItem('clientUid')
      //           var hmacData = CryptoJS.HmacSHA1(hmacDataBefore, Cookies.get('ticketsSalt'))
      //           let base64Data = Base64.encode(JSON.stringify(base64DataBefore))
      //           resultData = base64Data+'.'+hmacData
      //         }
      //         let url = ''
      //         $.ajax({
      //           headers: {
      //             "Content-Type": "application/json", "Accept" : "*/*", 'CR-token': resultData
      //           },
      //           url:global.configSelf.api + '/dabai-chaorenjob/common/qiniu/url/' + json.key,
      //           async:false,
      //           type: 'get',
      //           success: (response) => {
      //             console.log(response.data)
      //             url = response.data
      //           }
      //         })
      //         return url
      //       }
      //     },
      //     // 语言，内建的有英文（en-us）和中文（zh-cn）
      //     //default en-us, en-us and zh-cn are built-in
      //     language: "zh-cn",
      //     // 自定义语言
      //     i18n: {
      //       //specify your language here
      //       "zh-cn": {
      //         "align": "对齐方式",
      //         "image": "图片",
      //         "list": "列表",
      //         "link": "链接",
      //         "unlink": "去除链接",
      //         "table": "表格",
      //         "font": "文字",
      //         "full screen": "全屏",
      //         "text": "排版",
      //         "eraser": "格式清除",
      //         "info": "关于",
      //         "color": "颜色",
      //         "please enter a url": "请输入地址",
      //         "create link": "创建链接",
      //         "bold": "加粗",
      //         "italic": "倾斜",
      //         "underline": "下划线",
      //         "strike through": "删除线",
      //         "subscript": "上标",
      //         "superscript": "下标",
      //         "heading": "标题",
      //         "font name": "字体",
      //         "font size": "文字大小",
      //         "left justify": "左对齐",
      //         "center justify": "居中",
      //         "right justify": "右对齐",
      //         "ordered list": "有序列表",
      //         "unordered list": "无序列表",
      //         "fore color": "前景色",
      //         "background color": "背景色",
      //         "row count": "行数",
      //         "column count": "列数",
      //         "save": "确定",
      //         "upload": "上传",
      //         "progress": "进度",
      //         "unknown": "未知",
      //         "please wait": "请稍等",
      //         "error": "错误",
      //         "abort": "中断",
      //         "reset": "重置"
      //       }
      //     },
      //     // 隐藏不想要显示出来的模块
      //     // the modules you don't want
      //     hiddenModules: [],
      //     // 自定义要显示的模块，并控制顺序
      //     // keep only the modules you want and customize the order.
      //     // can be used with hiddenModules together
      //     visibleModules: [
      //       "text",
      //       "color",
      //       "font",
      //       "align",
      //       "image",
      //       "undo",
      //     ],
      //     // 扩展模块，具体可以参考examples或查看源码
      //     // extended modules
      //     modules: {
      //       //omit,reference to source code of build-in modules
      //     }
      //   });
      // }
    },
    created () {
        let tagsList = [];
        appRouter.map((item) => {
            if (item.children.length <= 1) {
                tagsList.push(item.children[0]);
            } else {
                tagsList.push(...item.children);
            }
        });
        this.$store.commit('setTagsList', tagsList);
    }
});
