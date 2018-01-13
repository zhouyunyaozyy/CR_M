<template>
<div id="form" class="content">
    <span>用户审核</span>
    <Form ref="form" :model="form" :rules="rules" :label-width="80">
        <Row>
            <Col :span="12">
                <FormItem label="姓名" prop="name">
                    <Input v-model="form.name" readonly></Input>
                </FormItem>
                <FormItem label="身份证" prop="idno">
                    <Input v-model="form.idno" readonly></Input>
                </FormItem>
                <Row style="margin-bottom: 20px">
                    <Col :span="10" :offset="3">
                        <Card :body-style="{ padding: '0px' }">
                            <img :src="form.front_url" class="image"
                                 style="width: 100%">
                            <div style="padding: 14px;">
                                <div class="bottom clearfix">
                                    <time class="time">身份证正面</time>
                                    <Button size="small" class="button" style="float: right"
                                               @click="showImg(form.front_url)">查看大图
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    </Col>
                    <Col :span="10" :offset="1">
                        <Card :body-style="{ padding: '0px' }">
                            <img :src="form.back_url" class="image"
                                 style="width: 100%">
                            <div style="padding: 14px;">
                                <div class="bottom clearfix">
                                    <time class="time">身份证背面</time>
                                    <Button size="small" style="float: right"
                                               @click="showImg(form.back_url)">查看大图
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    </Col>
                </Row>
                <FormItem v-if="!edit">
                    <Button type="primary" @click="auditSuccess" v-if="form.status == 1">认证通过</Button>
                    <Button type="warning" @click="auditFail" v-if="form.status == 1">认证失败</Button>
                </FormItem>
            </Col>
        </Row>
    </Form>
    <Modal title="原图展示" v-model="dialogVisible">
        <img :src="showImgSrc" v-if="dialogVisible" style="width: 100%">
    </Modal>
    <Modal
            title="提示"
            v-model="dialogVisibleRefuse"
            size="tiny"
            @on-ok='refuseSure'
           >
        <Input
            type="textarea"
            :rows="2"
            placeholder="请输入内容"
            v-model="form.mark">
        </Input>
    </Modal>
</div>
</template>
<script>
  export default {
    name: 'appSystem',
    data () {
      return {
        edit: false,
        form: {
            idno: '',
            name: '',
            uid: '',
            mark: ''
        },
        rules: {
            type: [{required: true, message: '请选择类型', trigger: 'change'}],
            title: [{required: true, message: '请输入标题', trigger: 'blur'},],
            receive_type: [{required: true, message: '请选择接收类型', trigger: 'change'}],
            receive: [{required: true, message: '请输入接收对象', trigger: 'blur'},]
        },
        dialogVisible: false,
        dialogVisibleRefuse: false,
        showImgSrc: '',
        uid: ''
      
      }
    },
    created () {
      this.uid = this.$route.query.uid
      this.getAuditInfo();
    },
    methods: {
      clearData() {
          this.$refs['form'].resetFields();
      },
      showImg(src) {
          this.showImgSrc = src;
          this.dialogVisible = true;
      },
      refuseSure() {
        this.$axios({type: 'post', url: "/customer/auditFail", data: {data: JSON.stringify(this.form)}, fuc: (result) => {
          if (result.code == 1) {
            this.$Message.success(result.msg)
            this.$closeAndGoParent('auditManagement_detail', 'auditManagement_list')
          }
        }, nowThis: this})
      },
      auditSuccess() {
        this.$Modal.confirm({
          title: '提示',
          content: '点击确定，结果则会立即推送给用户。',
          onOk: () =>{
            this.$axios({type: 'post', url: "/customer/auditSuccess", data: {data: JSON.stringify(this.form)}, fuc: (result) => {
              if (result.code == 1) {
                this.$Message.success(result.msg)
                this.$closeAndGoParent('auditManagement_detail', 'auditManagement_list')
              }
            }, nowThis: this})
          }
        })
      },
      auditFail() {
          this.dialogVisibleRefuse = true
      },
      getAuditInfo() {
//          this.ajaxData("/customer/getAuditUserInfo", {uid: this.tabsData.uid}, (result) => {
//              this.form = result.data;
//              console.dir(this.form);
//          })
        this.$axios({type: 'post', url: "/customer/getAuditUserInfo", data: {data: JSON.stringify({uid: this.uid})}, fuc: (result) => {
          this.form = result.data
        }, nowThis: this})
      }
      
    }
  }
</script>