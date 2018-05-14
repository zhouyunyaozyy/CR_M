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
            <FormItem label="简历管理">
                <CheckboxGroup v-model="form.resume" @on-change='checkChange'>
                    <Checkbox label="seeRecruitDetail" name="resume">查看简历</Checkbox>
                    <Checkbox label="startReview" v-if='checkBool' name="resume">发起简历评审</Checkbox>
                    <Checkbox label="joinReview" v-if='checkBool' name="resume">参与简历评审</Checkbox>
                    <Checkbox label="getMeet" v-if='checkBool' name="resume">标记邀请面试</Checkbox>
                    <Checkbox label="getRefuse" v-if='checkBool' name="resume">标记不合适</Checkbox>
                </CheckboxGroup>
            </FormItem>
            <FormItem label="企业信息管理">
                <CheckboxGroup v-model="form.enterprise">
                    <Checkbox label="editCompany" name="enterprise">编辑信息</Checkbox>
                </CheckboxGroup>
            </FormItem>
            <FormItem label="职位管理">
                <CheckboxGroup v-model="form.job" @on-change='checkChangeJob'>
                    <Checkbox label="seeJob" name="job">查看职位</Checkbox>
                    <Checkbox label="addJob" v-if='checkBoolJob' name="job">添加职位</Checkbox>
                    <Checkbox label="editJob" v-if='checkBoolJob' name="job">编辑职位</Checkbox>
                    <Checkbox label="onOrOffJob" v-if='checkBoolJob' name="job">发布/关闭职位</Checkbox>
                </CheckboxGroup>
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
          uid: '',
          cid: '',
          name: '',
          mobile: '',
          username: '',
          resume:[],
          enterprise:[],
          job:[]
        },
        checkBool: false,
        checkBoolJob: false,
        rules: {
          name: [
            {required: true, message: '请输入真实姓名', trigger: 'blur'},
            { pattern: /^([\u4E00-\uFA29]|[\uE7C7-\uE7F3]){2,5}$/, message: '姓名必须为2-5位汉字', trigger: 'blur' }
          ],
          mobile: [
            {required: true, message: '请输入手机号', trigger: 'blur'},
            { pattern: /^\d{11}$/, message: '手机号必须为11位数字', trigger: 'blur' }
          ]
        }
      }
    },
    created () {
      this.form.cid = this.$route.query.cid
      this.form.uid = this.$route.query.uid ? this.$route.query.uid : ''
      if (this.form.uid) {
        this.getData()
      }
    },
    methods: {
      getData: function () {
        this.$axios({
          type: 'get', url: "/dabai-chaorenjob/hr/getUserHr", data: {uid: this.form.uid}, fuc: (res) => {
            this.form.name = res.data.name;
            this.form.mobile = res.data.mobile;
            this.form.username = res.data.username;
            let config = res.data.config ? JSON.parse(res.data.config) : [];
            for (let i = 0; i < config.length; i++) {
              let config_key = i == 0 ? "resume" : i == 1 ? "enterprise" : "job";
              for (let key in config[i]) {
                if (config[i][key]) {
                  this.form[config_key].push(key)
                }
              }
              if (this.form.resume.length > 0) {
                this.checkBool = true;
              } else {
                this.checkBool = false;
              }
              if (this.form.job.length > 0) {
                this.checkBoolJob = true;
              } else {
                this.checkBoolJob = false;

              }
            }
          }, nowThis: this
        })
      },
      checkChange (data) {
        if (data.length > 0) {
          this.checkBool = true
        }
        for (let val of data) {
          if (val == 'seeRecruitDetail') {
            return
          }
        }
        this.checkBool = false
      },
      checkChangeJob (data) {
        if (data.length > 0) {
          this.checkBoolJob = true
        }
        for (let val of data) {
          if (val == 'seeJob') {
            return
          }
        }
        this.checkBoolJob = false
      },
      save () {
        this.$refs['form'].validate((valid) => {
          if (valid) {

            let resume_list = this.form.resume;
            let enterprise_list = this.form.enterprise;
            let job_list = this.form.job;
            let resume = {
              "seeRecruitDetail":false,
              "startReview":false,
              "joinReview":false,
              "getMeet":false,
              "getRefuse":false
            };
            let enterprise = {
              "editCompany":false
            };
            let job = {
              "addJob":false,
              "seeJob":false,
              "editJob":false,
              "onOrOffJob":false
            };
            for(let a = 0;a<resume_list.length;a++){
              resume[resume_list[a]] = true;
            }
            for(let a = 0;a<enterprise_list.length;a++){
              enterprise[enterprise_list[a]] = true;
            }
            for(let a = 0;a<job_list.length;a++){
              job[job_list[a]] = true;
            }
            let config = [resume,enterprise,job]
            console.log(config)
            this.form.config = JSON.stringify(config)
            this.$axios({type: 'post', url: this.form.uid ? '/dabai-chaorenjob/company/updateChildrenDetail' : "/dabai-chaorenjob/company/addChildren", data: this.form, fuc: (result) => {
                this.$Message.success(result.msg)
                this.$closeAndGoParent('children_detail', {name: 'children_list', query: {cid: this.form.cid}})
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