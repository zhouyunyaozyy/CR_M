import Vue from 'vue';
import iView from 'iview';
import {router} from './router/index';
import {appRouter} from './router/router';
import store from './store';
import App from './app.vue';
import axios from 'axios'
import qs from 'qs'
import Cookies from 'js-cookie';
import '@/locale';
import 'iview/dist/styles/iview.css';
import VueI18n from 'vue-i18n';
//import util from '@/libs/util';
import { VirtualScroller } from 'vue-virtual-scroller';

import CryptoJS from 'crypto-js'
let Base64 = require('js-base64').Base64
      
Vue.use(VueI18n);
Vue.use(iView);
Vue.component('virtual-scroller', VirtualScroller);

Vue.prototype.$axios = function (params) {
  // cr-token 算法
  let resultData = 0
  if(Cookies.get('sessionSalt')){
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
          sessionId: Cookies.get('sessionId'),
          postVersion: postVersion,
          postTime:postTime
      }
     // sessionSalt="sessionSalt"&postVersion="UUid 随机数"&postTime="时间戳"&platform="平台名称"&clientUid="机器唯一编码"
      let hmacDataBefore = 'sessionSalt=' + Cookies.get('sessionSalt')+'&postVersion='+postVersion+'&postTime='+postTime+'&platform='+window.localStorage.getItem('platform')+'&clientUid='+window.localStorage.getItem('clientUid')
      var hmacData = CryptoJS.HmacSHA1(hmacDataBefore, Cookies.get('sessionSalt'))
      let base64Data = Base64.encode(JSON.stringify(base64DataBefore))
      resultData = base64Data+'.'+hmacData
  }
//
//  let baseUrl = 'http://192.168.1.115:8765'
  let baseUrl = 'http://api.chaorenjob.com'
  if (params.type === 'get') {
    axios.get(baseUrl + params.url, {withCredentials:false, headers: {"Content-Type": "application/x-www-form-urlencoded ", "Accept" : "*/*", 'CR-token': resultData}})
      .then(function(response){
        if (response.data.code != 1) {
          params.fuc(response.data)
          this.$Notice.warning({
              title: '错误',
              desc: response.data.msg
          });
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
      qs.stringify(params.data), 
      {
        withCredentials:false, 
        headers: {"Content-Type": "application/x-www-form-urlencoded ", "Accept" : "*/*", 'CR-token': resultData}
      })
      .then(function(response){
        if (response.data.code !== 1) {
          console.log(response.data.msg)
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
          console.log(1, error)
          params.nowThis.$Message.warning(error)
      });
  }
}
Vue.prototype.$start = 1
Vue.prototype.$limit = 15
Vue.prototype.$handleCurrentChange = function (val, fuc, nowThis) {
  console.log(val)
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
