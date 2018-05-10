<style lang="less">
    @import './login.less';
</style>

<template>
    <div class="login" @keydown.enter="handleSubmit">
        <div class="login-con">
            <Card :bordered="false">
                <p slot="title">
                    <Icon type="log-in"></Icon>
                    欢迎登录
                </p>
                <div class="form-con">
                    <Form ref="loginForm" :model="form" :rules="rules">
                        <FormItem prop="userName">
                            <Input v-model="form.userName" placeholder="请输入用户名">
                                <span slot="prepend">
                                    <Icon :size="16" type="person"></Icon>
                                </span>
                            </Input>
                        </FormItem>
                        <FormItem prop="password">
                            <Input type="password" v-model="form.password" placeholder="请输入密码">
                                <span slot="prepend">
                                    <Icon :size="14" type="locked"></Icon>
                                </span>
                            </Input>
                        </FormItem>
                        <FormItem>
                            <Button @click="handleSubmit" type="primary" long>登录</Button>
                        </FormItem>
                    </Form>
                </div>
            </Card>
        </div>
    </div>
</template>

<script>
import Cookies from 'js-cookie';
import JSEncrypt from 'jsencrypt'
import Guid from 'guid'
import CryptoJS from 'crypto-js'
export default {
    data () {
        return {
            form: {
                userName: '',
                password: ''
            },
            rules: {
                userName: [
                    { required: true, message: '账号不能为空', trigger: 'blur' }
                ],
                password: [
                    { required: true, message: '密码不能为空', trigger: 'blur' }
                ]
            }
        };
    },
    created () {
    },
    methods: {
        handleSubmit () {
            this.$refs.loginForm.validate((valid) => {
                if (valid) {
                    // 加密
                  function rndRandom(size) {
                    let rnd = {};
                    rnd.size = size;
                    rnd.list = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
                    rnd.val = '';// key
                    for (let i = 0; i < rnd.size; ++i) {
                        let tmp = parseInt((rnd.list.length) * Math.random());
                        if (i === 7) {
                            if (tmp % 2 === 0) {
                                rnd.val += '_'
                            } else {
                                rnd.val += rnd.list[tmp] + '_';
                                rnd.list.splice(tmp, 1);
                                i++
                            }
                        } else {
                            rnd.val += rnd.list[tmp];
                            rnd.list.splice(tmp, 1)
                        }
                    }
                    return rnd.val
                }
                let beforeKey = rndRandom(16);
        //        state.key = beforeKey
        //        rnd.val = Base64.encode(rnd.val)
                let data = {};
                // 获取浏览器信息
                let explorer = window.navigator.userAgent.toLowerCase()
                // ie
                if (explorer.indexOf('msie') >= 0) {
                    let ver = explorer.match(/msie ([\d.]+)/)[1];
                    data.client = 'IE';
                    data.clientVersion = ver
                } else if (explorer.indexOf('firefox') >= 0) { // firefox
                    let ver = explorer.match(/firefox\/([\d.]+)/)[1];
                    data.client = 'Firefox';
                    data.clientVersion = ver
                } else if (explorer.indexOf('chrome') >= 0) { // Chrome
                    let ver = explorer.match(/chrome\/([\d.]+)/)[1];
                    data.client = 'Chrome';
                    data.clientVersion = ver
                } else if (explorer.indexOf('opera') >= 0) { // Opera
                    let ver = explorer.match(/opera.([\d.]+)/)[1];
                    data.client = 'Opera';
                    data.clientVersion = ver
                } else if (explorer.indexOf('Safari') >= 0) { // Safari
                    let ver = explorer.match(/version\/([\d.]+)/)[1];
                    data.client = 'Safari';
                    data.clientVersion = ver
                }
                window.localStorage.setItem('platform', 'DABAI_CHAORENJOB_M_WEB');
                // 判断本地是否有clintUid
                if (window.localStorage.getItem('clientUid')) {
                    data.clientUid = window.localStorage.getItem('clientUid')
                } else {
                    data.clientUid = (function () { //方法一：
                        let guid = "";
                        for (let i = 1; i <= 32; i++) {
                            let n = Math.floor(Math.random() * 16.0).toString(16);
                            guid += n;
                            if ((i == 8) || (i == 12) || (i == 16) || (i == 20))
                                guid += "-";
                        }
                        return guid;
                    })();
                    window.localStorage.setItem('clientUid', data.clientUid)
                }
                
                  
                  
                data.platform = window.localStorage.getItem('platform');
                data.username = this.form.userName;
                data.password = this.form.password;
                let resultData = {};
                // aes加密
                resultData.content = (function () {
                    let key = CryptoJS.enc.Utf8.parse(beforeKey);
                    let iv = CryptoJS.enc.Utf8.parse('16-Bytes--String');
                    let encrypted = CryptoJS.AES.encrypt(JSON.stringify(data), key,
                        {
                            iv: iv,
                            mode: CryptoJS.mode.CBC,
                            padding: CryptoJS.pad.Pkcs7
                        });
                    return encrypted.toString() // 返回的是base64格式的密文
                })();
                // RSA加密
                let encrypt = new JSEncrypt.JSEncrypt()
                let publicKey = 'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCdIIlQzv3fb9ktUGphZ/4l0qQ87iMxLjn1Rc3yhWL0KlnTSY/tziRi0XRyoSCBovZe1hhWGXnfwSvgJRvkzBWRHrnGor0+6I18DnY1lnrckp6bmjirX0BvdqFWxmXgIoz985YjLnPGNqBzt58EBdC5YqUYYnATRgKMA4g0N0Cd6QIDAQAB'; // 从服务端接收到的公钥，缓存到本地
                encrypt.setPublicKey(publicKey);
                resultData.aesKey = encrypt.encrypt(beforeKey);// RSAkey
                this.$axios({type: 'post', url: '/dabai-authority/authority/login', data: resultData, fuc: (res) => {
                  console.log('res', res)
                  if (res.code == 1) {
                    let key = CryptoJS.enc.Utf8.parse(beforeKey)
                    let iv = CryptoJS.enc.Utf8.parse('16-Bytes--String')
                    var decrypted = CryptoJS.AES.decrypt(res.data, key,
                      {
                        iv: iv,
                        mode: CryptoJS.mode.CBC,
                        padding: CryptoJS.pad.Pkcs7
                      })
                    Cookies.set('user', this.form.userName);
                    Cookies.set('password', this.form.password);
                    Cookies.set('tickets', decrypted.toString(CryptoJS.enc.Utf8).split('.')[0]);
                    Cookies.set('ticketsSalt', decrypted.toString(CryptoJS.enc.Utf8).split('.')[1]);

                    this.$axios({type: 'post', url: '/dabai-chaorenjob/userSystem/getUserInfoByTickets', data: {}, fuc: (res2) => {
                      console.log('res2', res2)
                        this.$store.commit('setAvator', 'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=3448484253,3685836170&fm=27&gp=0.jpg');
                        let arr = []
                        for (let val of res2.data.roleList) {
                          arr.push(Number(val.rid))
                        }
                        console.log(arr)
                        Cookies.set('access', JSON.stringify(arr));
                        this.$router.push({
                          name: 'home_index'
                        });
                    }, nowThis: this})
                  }
                }, nowThis: this})
              }
            });
        }
    }
};
</script>

<style>

</style>
