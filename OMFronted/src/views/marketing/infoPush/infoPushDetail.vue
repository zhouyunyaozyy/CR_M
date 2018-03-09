<style lang="less">
</style>
<template>
<div id="form" class="content">
    <span>新建推送</span>
    <Form ref="form" :model="form" :rules="rules" :label-width=80>
        <Row>
            <Col :span="12">
                <FormItem label="类型" prop="type">
                    <Select v-if='form.receive_type && form.receive_type == 4' v-model="form.type" placeholder="请选择推送类型" @on-change='typeChange'>
                        <Option :label="item.name" :value="item.code" :key="item.code" v-for="item in localData.banner" v-if='item.code == 5'></Option>
                    </Select>
                    <Select v-else v-model="form.type" placeholder="请选择推送类型">
                        <Option :label="item.name+item.code" :value="item.code" :key="item.code" v-for="item in localData.banner"></Option>
                    </Select>
                </FormItem>
                <FormItem label="标题名称" prop="title">
                    <Input :maxlength="20" v-model="form.title" placeholder="请输入标题"></Input>
                </FormItem>
                <FormItem label="推送简介" prop="profile">
                    <Input :maxlength="15" v-model="form.profile" placeholder="请输入推送简介"></Input>
                </FormItem>
                <FormItem v-if='form.type == 1 || form.type == 2' label="推送内容" prop="args12">
                    <Input v-model="form.args12" type="textarea" placeholder="请输入推送内容"></Input>
                </FormItem>
                <FormItem v-else-if='form.type == 3 || form.type == 4' label="推送内容" prop="args34">
                    <Input v-model="form.args34" type="textarea" placeholder="请输入推送内容"></Input>
                </FormItem>
                <FormItem v-else-if='form.type == 5' label="推送内容" prop="args5">
                    <Input v-model="form.args5" type="textarea" placeholder="请输入推送内容"></Input>
                </FormItem>
                <br/>
                <FormItem v-if='receive_type1Bool' label="推送对象">
                    <Input v-model="receive" type="textarea" placeholder="请输入推送内容"></Input>
                </FormItem>
                <FormItem v-else label="对象类型" prop="receive_type">
                    <Select v-model="form.receive_type" placeholder="请选择对象类型" @on-change='receive_typeChange'>
                        <Option :label="item.name" :value="item.code" :key="item.code" v-for="item in localData.receive_type"></Option>
                    </Select>
                </FormItem>
                <br/>
                <FormItem v-if='!pid'>
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
            type: '',
            args: '',
            args12: '',
            args34: '',
            args5: '',
            title: '',
            profile: '',
            receive_type: ''
        },
        receive: '',
        receive_type1Bool: false,
        pid: '',
        rules: {
            type: [{required: true, message: '请选择类型', trigger: 'change'}],
            // param: [{required: true, message: '请输入参数', trigger: 'blur'},],
            title: [{required: true, message: '请输入标题', trigger: 'blur'}],
            receive_type: [{required: true, message: '请选择接收类型', trigger: 'change'}],
            args12: [{required: true, message: '请输入推送内容', trigger: 'blur'},
                  {pattern: /^(?=^.{3,255}$)(http(s)?:\/\/)?(www\.)?[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+(:\d+)*(\/\w+\.\w+)*([\?&]\w+=\w*)*$/, message: '请输入一个正确的网址', trigger: 'blur'}],
            args34: [{required: true, message: '请输入推送内容', trigger: 'blur'},
                  {pattern: /^\d{1, 100}$/, message: '请输入一个正确的id', trigger: 'blur'}],
            args5: [{required: true, message: '请输入推送内容', trigger: 'blur'},
                  {pattern: /^\.{1, 100}$/, message: '请输入1-100长度的内容', trigger: 'blur'}],
            profile: [{required: true, message: '请输入推送简介', trigger: 'blur'}],
            
        },
        localData: {}
      };
    },
    computed: {
    },
    created () {
      this.localData = JSON.parse(window.sessionStorage.getItem('localData'))
      if (this.$route.query.pid) {
          this.pid = this.$route.query.pid
          this.getPushByPid();
          console.log(this.pid)
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
              if (this.form.type == 1 || this.form.type == 2) {
                this.form.args = this.form.args12
              } else if (this.form.type == 3 || this.form.type == 4) {
                this.form.args = this.form.args34
              } else if (this.form.type == 5) {
                this.form.args = this.form.args5
              }
              this.$axios({type: 'post', url: '/marketing/addPush', data: {data: JSON.stringify(this.form)}, fuc: (result) => {
                if (result.code == 1) {
                  this.$Message.success(result.msg)
                  this.$closeAndGoParent('infoPush_Detail', 'infoPush_List')
                }
              }, nowThis: this})
            }
          })
        },
        receive_typeChange () {
          this.form.type = ''
        },
        typeChange () {
          this.form.args = ''
        },
        getPushByPid() {
          this.$axios({type: 'post', url: '/marketing/getPushByPid', data: {data: JSON.stringify({pid: this.pid})}, fuc: (result) => {
            this.form = result.data;
            this.form.receive_type = result.data.receive_type + '';
            if (this.form.receive_type == 1) {
              this.receive_type1Bool = true
              this.receive = result.data.receive
            }
            this.form.type = result.data.type + '';
          }, nowThis: this})
        }
    }
};
</script>