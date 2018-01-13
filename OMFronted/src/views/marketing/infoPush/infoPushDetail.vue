<style lang="less">
</style>
<template>
<div id="form" class="content">
    <span>新建推送</span>
    <Form ref="form" :model="form" :rules="rules" :label-width=80>
        <Row>
            <Col :span="12">
                <FormItem label="类型" prop="type">
                    <Select v-model="form.type" placeholder="请选择活动区域">
                        <Option :label="item.name" :value="item.code" :key="item.code" v-for="item in localData.banner"></Option>
                    </Select>
                </FormItem>
                <FormItem label="标题名称" prop="title">
                    <Input v-model="form.title"></Input>
                </FormItem>
                <FormItem label="推送简介" prop="profile">
                    <Input v-model="form.profile"></Input>
                </FormItem>
                <FormItem label="参数" prop="args">
                    <Input v-model="form.args" type="textarea"></Input>
                </FormItem>
                <br/>
                <FormItem label="对象类型" prop="receive_type">
                    <Select v-model="form.receive_type" placeholder="请选择活动区域">
                        <Option :label="item.name" :value="item.code" :key="item.code" v-for="item in localData.receive_type"></Option>
                    </Select>
                </FormItem>
                <FormItem label="接受对象" prop="receive" v-if="form.receive_type!=3">
                    <Input v-model="form.receive"></Input>
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
            title: '',
            profile: '',
            receive_type: '',
            receive: ''
        },
        pid: '',
        rules: {
            type: [{required: true, message: '请选择类型', trigger: 'change'}],
            // param: [{required: true, message: '请输入参数', trigger: 'blur'},],
            title: [{required: true, message: '请输入标题', trigger: 'blur'},],
            receive_type: [{required: true, message: '请选择接收类型', trigger: 'change'}],
            receive: [{required: true, message: '请输入接收对象', trigger: 'blur'},]
        },
        localData: {}
      };
    },
    computed: {
    },
    created () {
      this.$axios({type: 'get', url: '/common/configJson', fuc: (res) => {
        this.localData = res.data
      }, nowThis: this})
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
              this.$axios({type: 'post', url: '/marketing/addPush', data: {data: JSON.stringify(this.form)}, fuc: (result) => {
                if (result.code == 1) {
                  this.$Message.success(result.msg)
                  this.$closeAndGoParent('infoPush_Detail', 'infoPush_List')
                }
              }, nowThis: this})
            }
          })
        },
        getPushByPid() {
          this.$axios({type: 'post', url: '/marketing/getPushByPid', data: {data: JSON.stringify({pid: this.pid})}, fuc: (result) => {
            this.form = result.data;
            this.form.receive_type = result.data.receive_type + '';
            this.form.type = result.data.type + '';
          }, nowThis: this})
        }
    }
};
</script>