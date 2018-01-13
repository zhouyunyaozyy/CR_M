<template>
<div id="form" class="content">
    <span>主帐号管理</span>
    <Form ref="form" :model="form" :rules="rules" :label-width="80">
        <Row>
            <Col :span="12">
                <FormItem label="归属" prop="companyName">
                    <Input v-model="form.companyName" disabled></Input>
                </FormItem>
                <FormItem label="手机号" prop="mobile">
                    <Input v-model="form.mobile"></Input>
                </FormItem>
                <FormItem label="用户名" prop="username">
                    <Input v-model="form.username" disabled></Input>
                </FormItem>
                <br/>
                <FormItem label="姓名" prop="name">
                    <Input v-model="form.name" disabled></Input>
                </FormItem>
                <br/>
                <FormItem>
                    <Button type="primary" @click="update">修改</Button>
                </FormItem>
            </Col>
        </Row>
    </Form>
</div>
</template>
<script>
  export default {
    name: 'appSystem',
    data () {
      return {
        cid: '',
        form: {
            cid: '',
            companyName: '',
            mobile: '',
            username: '',
            name: ''
        },
        rules: {
            mobile: [
                {required: true, message: '请输入手机号', trigger: 'blur'},
                {pattern: /^1[34578]\d{9}$/, message: '号码有误', trigger: 'blur'}
            ]
        }
      }
    },
    created () {
      this.cid = this.$route.query.cid;
      this.$axios({type: 'post', url: "/company/getCompanyAndManagerByCid", data: {data: JSON.stringify({cid: this.cid})}, fuc: (result) => {
          this.form.cid = result.data.company.cid;
          this.form.companyName = result.data.company.name_full;
          this.form.mobile = result.data.manager.mobile;
          this.form.username = result.data.manager.username;
          this.form.name = result.data.manager.name;
        }, nowThis: this})
    },
    methods: {
      update() {
          this.$refs['form'].validate((valid) => {
              if (valid) {
                  this.$Modal.confirm({
                    title: "提示",
                    content: "旧手机号将无法登录，确定修改公司主帐号所绑定的手机",
                    onOk: () => {
                      this.updateCompanyManager();
                    }
                  });
              }
          });
      },
      clearData() {
          this.$refs['form'].resetFields();
      },
      updateCompanyManager() {
        this.$axios({type: 'post', url: "/company/updateCompanyManagerMobile", data: {data: JSON.stringify(this.form)}, fuc: (result) => {
          this.$Message.success("操作成功");
        }, nowThis: this})
      }
    }
  }
</script>