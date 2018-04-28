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
                    <Input v-model="form.username"></Input>
                </FormItem>
                <br/>
                <FormItem label="姓名" prop="name">
                    <Input v-model="form.name"></Input>
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
            ],
            username: [
              {required: true, message: '请输入用户名', trigger: 'blur'},
              {pattern: /^[A-Z0-9]{2,10}$/, message: '必须为2-10位字符，例如：8L', trigger: 'blur'}
            ],
            name: [
                {required: true, message: '请输入姓名', trigger: 'blur'},
                {pattern: /^[\u4e00-\u9fa5]{2,5}$/, message: '必须为2-5位中文', trigger: 'blur'}
            ],
        }
      }
    },
    created () {
      this.cid = this.$route.query.cid;
      this.$axios({type: 'get', url: "/dabai-chaorenjob/company/getCompanyAndManagerByCid", data: {cid: this.cid}, fuc: (result) => {
          console.log(result)
          this.form.cid = result.data.company.cid;
          this.form.companyName = result.data.company.name_full;
          this.form.mobile = result.data.manager ? result.data.manager.mobile : '';
          this.form.username = result.data.manager ? result.data.manager.username : '';
          this.form.name = result.data.manager ? (result.data.manager.name === '未设置' ? '' : result.data.manager.name) : '';
        }, nowThis: this})
    },
    methods: {
      update() {
          this.$refs['form'].validate((valid) => {
              if (valid) {
                this.updateCompanyManager();
              }
          });
      },
      clearData() {
          this.$refs['form'].resetFields();
      },
      updateCompanyManager() {
        this.$axios({type: 'post', url: "/dabai-chaorenjob/company/addManager", data: this.form, fuc: (result) => {
          this.$Message.success("操作成功");
          this.$closeAndGoParent('manager_detail', 'companyControl/company_list')
          
        }, nowThis: this})
      }
    }
  }
</script>