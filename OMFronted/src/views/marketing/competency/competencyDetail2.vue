<template>
    <Form ref="form" :model="form" :rules="rules" :label-width=80>
        <FormItem prop="name" label="职能名称">
            <Input v-model="form.name" placeholder="请输入职能名称" :maxlength="100"></Input>
        </FormItem>
        <FormItem prop="profile" label="职能介绍">
            <Input type="text" v-model="form.profile" placeholder="请输入介绍" :maxlength="100"></Input>
        </FormItem>
        <FormItem label="职能配置">
            <Poptip placement="bottom-start" width="400">
                <Button type="ghost">选择</Button>
                <div class="api" slot="content">
                    <Checkbox v-for="item in configJson" v-model="item.status" :key="item.code" :label="item.code" :disabled="item.disabledBool">{{item.name}}</Checkbox>
                </div>
            </Poptip>
            <!--<Select>-->
                <!--<Option v-for="item in configJson" value="item.name">-->
                    <!--<Checkbox v-model="item.status" :disabled="item.disabledBool">{{item.name}}</Checkbox>-->
                <!--</Option>-->
            <!--</Select>-->
        </FormItem>
        <FormItem>
            <Button @click="handleSubmit" type="primary" :disabled="status == 1">确定</Button>
        </FormItem>
    </Form>
</template>

<script>
  export default {
    name: "competencyDetail2",
    data () {
      return {
        form: {
          rtid: 0,
          name: '',
          profile: '',
          config: []
        },
        status: 0,
        configJson: [
          {disabledBool: true, status: true, code: 'tel', name: '联系电话'},
          {disabledBool: true, status: true, code: 'header', name: '头像'},
          {disabledBool: false, status: true, code: 'images', name: '图片形象'},
          {disabledBool: true, status: true, code: 'target', name: '求职意向'},
          {disabledBool: false, status: true, code: 'video', name: '视频形象'},
          {disabledBool: true, status: true, code: 'education', name: '学历程度'},
          {disabledBool: true, status: true, code: 'education_item', name: '学历经历'},
          {disabledBool: true, status: true, code: 'experience', name: '是否有工作经验'},
          {disabledBool: true, status: true, code: 'employ', name: '是否在职'},
          {disabledBool: true, status: true, code: 'english', name: '英语能力'},
          {disabledBool: true, status: true, code: 'mandarin', name: '普通话'},
          {disabledBool: true, status: true, code: 'ethnicity', name: '民族'},
          {disabledBool: true, status: true, code: 'politics', name: '政治面貌'},
          {disabledBool: true, status: true, code: 'wedding', name: '婚姻状况'},
          {disabledBool: true, status: true, code: 'height', name: '身高'},
          {disabledBool: true, status: true, code: 'weight', name: '体重'},
          {disabledBool: true, status: true, code: 'vision_left', name: '左眼视力'},
          {disabledBool: true, status: true, code: 'vision_right', name: '右眼视力'},
          {disabledBool: true, status: true, code: 'profile', name: '自我描述'},
          {disabledBool: true, status: true, code: 'skill', name: '证书'},
          {disabledBool: true, status: true, code: 'experience_item', name: '工作经历'}
        ],
        rules: {
          name: [{required: true, message: '请输入名称', trigger: 'blur'}],
          profile: [{required: true, message: '请输入介绍', trigger: 'blur'}]
        }
      }
    },
    created () {
      if (this.$route.query.rtid) {
        this.form.rtid = this.$route.query.rtid
        this.$axios({type: 'get', url: "/dabai-chaorenjob/resumeTarget/getResumeTarget", data: {rtid: this.form.rtid}, fuc: (result) => {
          this.form.name = result.data.name
          this.form.profile = result.data.profile
          this.status = result.data.status
          for (let val of this.configJson) {
            val.status = JSON.parse(result.data.config)[val.code]
          }
        }, nowThis: this})
      }
    },
    methods: {
      handleSubmit () {
        this.$refs['form'].validate((valid) => {
          if (valid) {
            let _form = this.form
            let configForm = {}
            for (let val of this.configJson) {
              configForm[val.code] = val.status
            }
            _form.config = JSON.stringify(configForm)
            this.$axios({type: 'post', url: this.form.rtid ? "/dabai-chaorenjob/resumeTarget/updateResumeTarget" : "/dabai-chaorenjob/resumeTarget/insertResumeTarget", data: _form, fuc: (result) => {
                this.$Message.success(result.msg)
                this.$closeAndGoParent('competency_detail', "competency_list")
              }, nowThis: this})
          } else {
          }
        })
      }
    }
  }
</script>
<style scoped>
    form{
        width: 700px;
    }
</style>
<style>
    form .ivu-checkbox-wrapper{
        display: block;
    }
</style>