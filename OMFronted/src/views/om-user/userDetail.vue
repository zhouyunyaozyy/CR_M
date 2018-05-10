<template>
    <div style="width: 700px;">
        <span>添加/编辑用户</span>
        <Form ref="form" :model="form" :rules="rules" :label-width="100">
            <FormItem label="名称" prop="name">
                <Input v-model="form.name" placeholder="请输入名称"></Input>
            </FormItem>
            <FormItem label="用户名" prop="username">
                <Input v-model="form.username" placeholder="请输入用户名"></Input>
            </FormItem>
            <FormItem label="密码" prop="password">
                <Input v-model="form.password" type="password" placeholder="请输入密码"></Input>
            </FormItem>
            <FormItem label="角色" prop="roleIds">
                <Select v-model="form.roleIds" multiple style="width:260px">
                    <Option v-for="item in roleIdsArr" :value="item.rid" :key="item.rid">{{ item.name }}</Option>
                </Select>
            </FormItem>
            <FormItem>
                <Button type="primary" @click="save">保存</Button>
            </FormItem>
        </Form>
    </div>
</template>

<script>
  import JSEncrypt from 'jsencrypt'
  import Guid from 'guid'
  import CryptoJS from 'crypto-js'
  export default {
    name: "userDetail",
    data () {
      return {
        form: {
          username: '',
          name: '',
          password: '',
          roleIds: []
        },
        rules:{
          name: [
            {required: true, message: '请输入名称', trigger: 'blur'},
            { pattern: /^([\u4E00-\uFA29]|[\uE7C7-\uE7F3]){1,8}$/, message: '名称必须为1-8位汉字', trigger: 'blur' }
          ],
          username: [
            {required: true, message: '请输入用户名', trigger: 'blur'},
            { pattern: /^[0-9a-zA-Z]{4,12}$/, message: '用户名必须为4-12位数字、字母', trigger: 'blur' }
          ],
          password: [
            {required: true, message: '请输入密码', trigger: 'blur'},
            { pattern: /^.{6,12}$/, message: '姓名必须为6-12位', trigger: 'blur' }
          ],
          roleIds: [
            {type: 'array', required: true, message: '请选择角色', trigger: 'change'}
          ]
        },
        roleIdsArr: [] // 所有角色选项
      }
    },
    created () {
      this.$axios({type: 'get', url: '/dabai-chaorenjob/userSystem/getAllRoleList', fuc: (result) => {
        this.roleIdsArr = result.data
     }, nowThis: this})
    },
    methods: {
      save () {
        this.$refs.form.validate((valid) => {
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

            let resultData = {
              roleIds: this.form.roleIds.join(',')
            }

            let data = { // 加密json数据
              username: this.form.username,
              name: this.form.name,
              password: this.form.password
            }
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

            this.$axios({type: 'post', url: '/dabai-chaorenjob/userSystem/register', data: resultData, fuc: (result) => {
                this.$Message.success(result.msg)
                this.$closeAndGoParent('user_detail', {name: 'user_list'})
              }, nowThis: this})
          }
        })
      }
    }
  }
</script>

<style scoped>

</style>