<template>
    <div style="width: 700px;">
        <span>HR账号信息</span>
        <Form ref="form" :model="form" :rules="rules" :label-width="100">
            <FormItem label="HR账号姓名" prop="name">
                <Input v-model="form.name" placeholder="请输入真实姓名"></Input>
            </FormItem>
            <FormItem label="手机号" prop="mobile">
                <Input v-model="form.mobile" placeholder="请输入手机号"></Input>
            </FormItem>
            <FormItem label="用户名">
                <Input v-model="form.username" placeholder="请输入用户名" :disabled="true"></Input>
            </FormItem>
            <FormItem>
                <Button type="primary" @click="save">保存</Button>
            </FormItem>
        </Form>
    </div>
</template>

<script>
  export default {
    name: "childrenDetail",
    data () {
      return {
        form: {
          cid: '',
          name: '',
          mobile: '',
          username: ''
        },
        rules: {
          name: [
            {required: true, message: '请输入真实姓名', trigger: 'blur'},
            { pattern: /^([\u4E00-\uFA29]|[\uE7C7-\uE7F3]){2,5}$/, message: '姓名必须为2-5位汉字', trigger: 'blur' }
          ],
          mobile: [
            {required: true, message: '请输入手机号', trigger: 'blur'},
            { pattern: /^\d{11}$/, message: '姓名必须为11位数字', trigger: 'blur' }
          ]
        }
      }
    },
    created () {
      this.form.cid = this.$route.query.cid
    },
    methods: {
      save () {
        this.$refs['form'].validate((valid) => {
          if (valid) {
            this.$axios({type: 'post', url: "/dabai-chaorenjob/company/addChildren", data: this.form, fuc: (result) => {
                this.$Message.success(result.msg)
                this.$closeAndGoParent('children_detail', {name: 'children_list', query: {cid: this.cid}})
            }, nowThis: this})
          } else {
          }
        })
      }
    }
  }
</script>

<style scoped>

</style>