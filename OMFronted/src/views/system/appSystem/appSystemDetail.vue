<style lang="less">
</style>
<template>
  
<div id="form" class="content">
    <span>新建推送</span>
    <Form ref="form" :model="form" :rules="rules" :label-width=80>
        <Row>
            <Col :span="12">
                <FormItem label="标题" prop="title">
                    <Input v-model="form.title"></Input>
                </FormItem>
                <FormItem label="平台选择">
                    <RadioGroup v-model="form.app">
                        <Radio :label="1">IOS</Radio>
                        <Radio :label="2">Android</Radio>
                    </RadioGroup>
                </FormItem>
                <FormItem label="内部版本" prop="innerversion">
                    <Input v-model="form.innerversion"></Input>
                </FormItem>
                <FormItem label="版本号" prop="version">
                    <Input v-model="form.version"></Input>
                </FormItem>
                <FormItem label="强制升级" prop="updateSwitch">
                  <i-switch v-model="form.updateSwitch">
                  </i-switch>
                </FormItem>
                <FormItem label="链接" prop="url" v-if="form.app==1">
                    <Input v-model="form.url"></Input>
                </FormItem>
                <FormItem label="链接" v-if="form.app==2" prop="url">
                    <Upload
                            ref="upload"
                            action="http://upload-z2.qiniu.com"
                            :limit="1" :on-success="handleAvatarSuccess" :on-remove="handleRemove"
                            :data="postData">
                        <Button size="small" type="primary">点击上传</Button>
                        <div slot="tip" class="Upload__tip">只能上传jpg/png文件，且不超过500kb</div>
                    </Upload>
                </FormItem>
                <FormItem label="应用大小" prop="size">
                    <Input v-model="form.size">
                        <template slot="append">KB</template>
                    </Input>
                </FormItem>
                <FormItem label="更新简介" prop="profile">
                    <Input type="textarea" v-model="form.profile"></Input>
                </FormItem>
                <br/>

                <br/>
                <FormItem v-if='!vid'>
                    <Button type="primary" @click="insert">增加</Button>
                    <Button @click="clearData">清空</Button>
                </FormItem>
                <FormItem v-else>
                    <Button type="primary" @click="update" disabled>修改</Button>
                </FormItem>
            </Col>
        </Row>
    </Form>
    <div class="detail"></div>
</div>
</template>

<script>

export default {
    name: 'appSystem',
    data () {
        return {
          form: {
              title: '',
              app: 2,
              innerversion: '',
              version: '',
              updateSwitch: false,
              update: '0',
              url: '',
              urlArr: [],
              size: '',
              profile: '',
              urlname: ''
          },
          vid: '',
          postData: {},
          rules: {
              title: [{required: true, message: '请输入标题', trigger: 'blur'}],
              innerversion: [
                  {required: true, message: '请输入内部版本', trigger: 'blur'},
                  {pattern: /^[0-9]*$/, message: '请输入数字', trigger: 'blur'}
              ],
              version: [{required: true, message: '请输入版本', trigger: 'blur'}],
              size: [{required: true, message: '请输入大小', trigger: 'blur'},
                  {pattern: /^[0-9]*$/, message: '请输入数字', trigger: 'blur'}]
          }
        };
    },
    created () {
      if (this.$route.query.vid) {
        this.vid = this.$route.query.vid
        this.$axios({type: 'get', url: "/dabai-chaorenjob/version/getVersionByVid", data: {vid: this.$route.query.vid}, fuc: (result) => {
          this.form = result.data 
          this.$refs.upload.fileList.push({name: result.data.urlname, key: result.data.url});
        }, nowThis: this})
      }
      
      this.$axios({type: 'get', url: "/dabai-chaorenjob/common/qiniu/token", fuc: (result) => {
          this.postData = {token: result.data}
      }, nowThis: this})
    },
    computed: {
    },
    methods: {
      insert() {
          this.$refs['form'].validate((valid) => {
              if (valid) {
                  if (this.form.updateSwitch) {
                      this.form.update = '1'
                  } else {
                      this.form.update = '0';
                  }
                  // if (this.form.app == 2) {
                  //     this.form.url = this.form.urlArr.join(',');
                  // }
//                  this.ajaxData("/version/addVersion", this.form, (result) => {
//                      this.tabsData.status = 'update';
//                      console.log(result)
//                  })
                  this.$axios({type: 'post', url: "/dabai-chaorenjob/version/addVersion", data: this.form, fuc: (result) => {
                    if (result.code == 1) {
                      this.$Message.success(result.msg)
                      this.$closeAndGoParent('appSystem_Detail', 'appSystem_List')
                    }
                  }, nowThis: this})
              }
          });
      },
      update() {
//          console.dir(this.tableData);
      },
      clearData() {
          this.$refs['form'].resetFields();
      },
      handleAvatarSuccess(file, fileList) {
          this.form.url = file.key
          this.form.urlname = fileList.name
//          this.urlFileList.push({name: fileList.name, key: file.key})
          console.log(fileList)
//            this.form.url.push(file.key)
      },
      handleRemove(file, fileList) {
          // for (let val in this.form.urlArr) {
          //     if (this.form.urlArr[val].url === file.response.key) {
          //         this.form.urlArr.splice(val, 1)
          //     }
          // }
          this.form.url = '';
          this.form.urlname = '';
      }
    }
};
</script>