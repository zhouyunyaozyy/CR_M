<style lang="less">
</style>
<template>
    <div id="form" class="content">
        <span>新建系统通知</span>
        <Form ref="form" :model="form" :rules="rules" :label-width=100>
            <Row>
                <Col :span="12">
                    <FormItem v-if='receive_type1Bool' label="接收对象">
                        <Input v-model="receive" type="textarea" placeholder="请输入推送内容"></Input>
                    </FormItem>
                    <FormItem v-else label="接收对象" prop="receive">
                        <Select v-model="form.receive" placeholder="请选择接收对象" @on-change='receive_typeChange'>
                            <Option :label="item.name" :value="item.code" :key="item.code" v-for="item in localData.receive_type"></Option>
                        </Select>
                    </FormItem>
                    <br/>
                    <FormItem label="消息类型" prop="type">
                        <Select v-if='form.receive && form.receive == 2' v-model="form.type" placeholder="请选择消息类型" @on-change='typeChange'>
                            <Option :label="item.name" :value="item.code" :key="item.code" v-for="item in localData.banner" v-if='item.code == 5'></Option>
                        </Select>

                        <Select v-else v-model="form.type" placeholder="请选择消息类型">
                            <Option :label="item.name+item.code" :value="item.code" :key="item.code" v-for="item in localData.banner"></Option>
                        </Select>
                    </FormItem>
                    <FormItem label="消息标题" prop="title">
                        <Input :maxlength="20" v-model="form.title" placeholder="请输入标题"></Input>
                    </FormItem>
                    <FormItem label="消息内容" prop="content">
                        <Input :maxlength="100" v-model="form.content" placeholder="请输入消息内容"></Input>
                    </FormItem>
                    <FormItem v-if='form.type == 1 || form.type == 2' label="跳转参数" prop="args12">
                        <Input v-model="form.args12" type="textarea" placeholder="请输入跳转参数"></Input>
                    </FormItem>
                    <FormItem v-else-if='form.type == 3 || form.type == 4 || form.type == 6' label="跳转参数" prop="args34">
                        <Input v-model="form.args34" type="textarea" placeholder="请输入跳转参数"></Input>
                    </FormItem>
                    <FormItem label="是否需要推送">
                        <i-switch v-model="form.push">
                            <span slot="open">是</span>
                            <span slot="close">否</span>
                        </i-switch>
                    </FormItem>
                    <FormItem v-if="form.push" label="推送标题" prop="push_profile">
                        <Input v-model="form.push_profile" type="textarea" placeholder="请输入跳转参数"></Input>
                    </FormItem>
                    <br/>
                    <FormItem v-if='!nbid'>
                        <Button type="primary" @click="onSubmit">立即推送</Button>
                        <Button @click="clearData">清空</Button>
                    </FormItem>
                </Col>
            </Row>
        </Form>
    </div>
</template>

<script>

  export default {
    name: 'infoPush',
    data () {
      return {
        form: {
          type: '', // 系统通知类型
          receive: '', // 接受者 一般是接受者的ID  或者 0 M端所有  1 C端所有 2 B端所有
          title: '', // 标题
          content: '', // 内容
          push: 0, // 是否推送
          push_profile: '', // 推送标题
          args: '',
          args12: '',
          args34: ''

        },
        selectChangeFlase: true,
        receive: '',
        receive_type1Bool: false,
        nbid: '',
        rules: {
          type: [{required: true, message: '请选择类型', trigger: 'change'}],
          // param: [{required: true, message: '请输入参数', trigger: 'blur'},],
          title: [{required: true, message: '请输入标题', trigger: 'blur'}],
          receive_type: [{required: true, message: '请选择接收类型', trigger: 'change'}],
          args12: [{required: true, message: '请输入跳转参数', trigger: 'blur'},
            {pattern: /^(?=^.{3,255}$)(http(s)?:\/\/)?(www\.)?[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+(:\d+)*(\/\w+\.\w+)*([\?&]\w+=\w*)*$/, message: '请输入一个正确的网址', trigger: 'blur'}],
          args34: [{required: true, message: '请输入跳转参数', trigger: 'blur'},
            {pattern: /^\d{1,100}$/, message: '请输入一个正确的id', trigger: 'blur'}],
          content: [{required: true, message: '请输入消息内容', trigger: 'blur'},
                 {pattern: /^.{1,100}$/, message: '请输入1-100长度的内容', trigger: 'blur'}],
          push_profile: [{required: true, message: '请输入推送标题', trigger: 'blur'},
            {pattern: /^.{1,15}$/, message: '请输入一个1-15长度的标题', trigger: 'blur'}]
        },
        localData: {}
      };
    },
    computed: {
    },
    created () {
      this.localData = JSON.parse(window.sessionStorage.getItem('localData'))
      if (this.$route.query.nbid) {
        this.nbid = this.$route.query.nbid
        this.getPushByPid();
      }
    },
    methods: {
      onSubmit() {
        this.$refs['form'].validate((valid) => {
          if (valid) {
            this.sure();
          }
        });
      },
      clearData() {
        this.$refs['form'].resetFields();
      },
      sure() {
        this.$Modal.confirm({
          content: '点击确定，立即推送到接收者。',
          title: '提示',
          onCancel: () => {
            console.log('cancle')
          },
          onOk: () => {
            this.form.push = this.form.push ? 1 : 0
            if (this.form.type == 1 || this.form.type == 2) {
              this.form.args = this.form.args12
            } else if (this.form.type == 3 || this.form.type == 4 || this.form.type == 6) {
              this.form.args = this.form.args34
            }
            this.$axios({type: 'post', url: '/dabai-chaorenjob/notice/sendNoticeToGroup', data: this.form, fuc: (result) => {
                if (result.code == 1) {
                  this.$Message.success(result.msg)
                  this.$closeAndGoParent('systemInforms_Detail', 'systemInforms_List')
                }
              }, nowThis: this})
          }
        })
      },
      receive_typeChange () {
        if (this.selectChangeFlase) {
          this.form.type = ''
        }
      },
      typeChange () {
        this.form.args = ''
      },
      getPushByPid() {

        this.$axios({type: 'get', url: '/dabai-chaorenjob/notice/getNoticeBody', data: {nbid: this.nbid}, fuc: (result) => {
            console.log(result)
            this.selectChangeFlase = false
            this.form.title = result.data.title;
            this.form.push = result.data.push == 1;
            this.form.push_profile = result.data.push_profile;

            this.form.receive = result.data.receive;
            this.form.content = result.data.content;
            if (this.form.receive_type == 1) {
              this.receive_type1Bool = true
              this.receive = result.data.receive
            }
            if (result.data.type == 1 || result.data.type == 2) {
              this.form.args12 = result.data.args
            } else if (result.data.type == 3 || result.data.type == 4 || result.data.type == 6) {
              this.form.args34 = result.data.args
            }
            setTimeout(() => {
              this.selectChangeFlase = true
            }, 100)
            this.form.type = result.data.type + '';
          }, nowThis: this})
      }
    }
  };
</script>