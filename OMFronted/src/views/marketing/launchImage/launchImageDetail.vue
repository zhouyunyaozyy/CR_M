<template>

<div id="app" class="content">
    <Form ref="form" :model="form" :rules="rules" :label-width="80">
        <FormItem label="名称" prop="name">
            <Col :span="8">
                <Input v-model="form.name" placeholder="开屏页名称（仅后台可见）"></Input>
            </Col>
        </FormItem>
        <FormItem label="图片" required>
            <div class="demo-upload-list" v-for="item in uploadList">
              <template v-if="item.status === 'finished'">
                  <img :src="item.url">
                  <div class="demo-upload-list-cover">
                      <Icon type="ios-eye-outline" @click.native="handleView(item)"></Icon>
                      <Icon type="ios-trash-outline" @click.native="handleRemove(item)"></Icon>
                  </div>
              </template>
              <template v-else>
                  <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
              </template>
            </div>
            <Upload
                ref="uploadHead"
                :show-upload-list="false"
                :on-success="handleSuccess"
                :format="['jpg','jpeg','png']"
                :max-size="2048"
                :on-format-error="handleFormatError"
                :on-exceeded-size="handleMaxSize"
                :before-upload="handleBeforeUpload"
                type="drag"
                action="http://upload-z2.qiniu.com"
                style="display: inline-block;width:58px;"
                :data="postData">
                <div style="width: 58px;height:58px;line-height: 58px;">
                    <Icon type="camera" size="20"></Icon>
                </div>
            </Upload>
            <Modal title="原图展示" v-model="visible">
                <img :src="imgName" v-if="visible" style="width: 100%">
            </Modal>
        </FormItem>
        <FormItem label="显示时长" prop="time">
                <RadioGroup v-model="form.time">
                    <Radio :label="3"></Radio>
                    <Radio :label="5"></Radio>
                </RadioGroup>
        </FormItem>
        <FormItem label="类型" prop="type">
          <Col span="6">
            <Select v-model="form.type" placeholder="请选择类型">
                <!--<Option label='无' value="0"></Option>-->
                <Option label="内链接" value="1"></Option>
                <Option label="外链接" value="2"></Option>
                <Option label="职位" value="3"></Option>
                <Option label="公司" value="4"></Option>
                <Option label="文本" value="5"></Option>
                <Option label="资讯" value="6"></Option>
            </Select>
          </Col>
        </FormItem>
        <FormItem label="参数" prop="param">
          <Col span="6">
            <Input :maxlength='800' type="textarea" v-model="form.args" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入参数"></Input>
          </Col>
        </FormItem>
        <FormItem>
            <Checkbox v-model="issueBool">定时发布</Checkbox>
            <DatePicker
                    v-model="issueTime"
                    type="datetime"
                    placeholder="选择日期时间">
            </DatePicker>
        </FormItem>
    </Form>
    <Button @click="submit">提交</Button>
</div>
</template>
<script>
  export default {
    data () {
      return {
        uploadList: [],
        visible: false,
        issueTime: '',
        issueBool: false,
        formatContent: ['jpg','jpeg','png'],
        form: {
            name: '',
            type: '',
            time: 3,
            args: ''
        },
        rules: {
            name: [
                { required: true, message: '请输入开屏页名称', trigger: 'blur' },
                { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
            ],
            type: [
                 { required: true, message: '请选择类型', trigger: 'change' }
             ],
             time: [
                { required: true, message: '请输入时长', trigger: 'blur' },
                {pattern: /^\d{1}$/, message: '时长为1位正整数', trigger: 'blur'}
             ],
             args: [
                { required: true, message: '请输入参数', trigger: 'blur' }
             ]
        },
        imagesUrl: '',
        postData: {},
        lid: ''
      }
    },
    created () {
      this.$axios({type: 'get', url: "/dabai-chaorenjob/common/qiniu/token", fuc: (result) => {
          this.postData = {token: result.data}
      }, nowThis: this})
      if (this.$route.query.lid) {
        this.lid = this.$route.query.lid
        
        this.$axios({type: 'get', url: '/dabai-chaorenjob/launchImage/getLaunchImage', data: {lid: this.lid}, fuc: (result) => {
          console.log(result)
          this.form.name = result.data.title
          this.form.time = result.data.time + ''
          this.form.args = result.data.args
          this.form.type = result.data.type + ''
            if (result.data.issue_time != 0) {
                this.issueTime = new Date(parseInt(result.data.issue_time))
                this.issueBool = true
            }
          this.$nextTick(() => {
            for (let i in result.data.images.split(',')) {
              this.uploadList.push({
                response: {key: result.data.images.split(',')[i]},
                status: 'finished',
                url: result.data.imagesUrl
              })
            }
          })
        }, nowThis: this})
      }
    },
    mounted () {
      this.uploadList = this.$refs.uploadHead.fileList
    },
    methods: {
      handleView (item) {
          this.imgName = item.url;
          this.visible = true;
      },
      handleRemove (file) {
        console.log(file)
          for (let i in this.uploadList) {
            if (this.uploadList[i].response.key == file.response.key) {
              this.uploadList.splice(i, 1);
            }
          }
          for (let i in this.$refs.uploadHead.fileList) {
            if (this.$refs.uploadHead.fileList[i].response.key == file.response.key) {
              this.$refs.uploadHead.fileList.splice(i, 1);
            }
          }
      },
      handleSuccess (res, file) {
        this.$axios({type: 'get', url: '/dabai-chaorenjob/common/qiniu/url/' + res.key, fuc: (result) => {
          this.$set(file, 'url', result.data)
        }, nowThis: this})
      },
      handleFormatError (file) {
          this.$Notice.warning({
              title: 'The file format is incorrect',
              desc: file.name + '格式不正确，请重试。'
          });
      },
      handleMaxSize (file) {
          this.$Notice.warning({
              title: 'Exceeding file size limit',
              desc: file.name + '超过2M了。'
          });
      },
      handleBeforeUpload (file, fileList) {
          const check = this.uploadList.length < 1;
          if (!check) {
              this.$Notice.warning({
                  title: '最多上传一张图片。'
              });
          }
          return check;
      },
      submit () {
        this.$refs['form'].validate((valid) => {
          if (valid) {
//            let issue_time = 0
    //            let url = '/news/addNews'
    //            if (this.tabsData.nid) {
    //                if (this.issueBool) {
    //                    url = '/news/updateNewsReIssue'
    //                }else {
    //                    url = '/news/updateNewsOnlySave'
    //                }
    //            } else {
    //                if (this.issueBool) {
    //                    issue_time = this.issueTime.getTime()
    //                }
    //            }
            console.log(valid)
//            this.ajaxData('/launchImage/addLaunchImage', {
//                nid: this.tabsData.nid ? this.tabsData.nid : 0,
//                name: this.form.name,
//                image: this.form.image,
//                type: this.form.type,
//                time: this.form.time,
//                param: this.form.param
//            }, (res) => {
//                this.$message({
//                    message: '操作成功',
//                    duration: 2000,
//                    type: 'success'
//                })
//             })
            this.$axios({type: 'post', url: this.lid ? '/dabai-chaorenjob/launchImage/updateContent' : '/dabai-chaorenjob/launchImage/insertLaunchImage', data: {
              lid: this.lid ? this.lid : 0,
              title: this.form.name,
              type: this.form.type,
              time: this.form.time,
              issue_time: this.issueBool ? this.issueTime.getTime() : 0,
              args: this.form.args,
              images: this.uploadList[0].response.key
            }, fuc: (result) => {
                this.$Message.success('提交成功')
                this.$closeAndGoParent('launchImage_detail', 'launchImage_list')
            }, nowThis: this})
          }
        })
      }
    }
  }
</script>
<style scoped="true" lang='css'>
  .ivu-col {
    float: none;
  }
  .demo-upload-list{
        display: inline-block;
        width: 60px;
        height: 60px;
        text-align: center;
        line-height: 60px;
        border: 1px solid transparent;
        border-radius: 4px;
        overflow: hidden;
        background: #fff;
        position: relative;
        box-shadow: 0 1px 1px rgba(0,0,0,.2);
        margin-right: 4px;
    }
    .demo-upload-list img{
        width: 100%;
        height: 100%;
    }
    .demo-upload-list-cover{
        display: none;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background: rgba(0,0,0,.6);
    }
    .demo-upload-list:hover .demo-upload-list-cover{
        display: block;
    }
    .demo-upload-list-cover i{
        color: #fff;
        font-size: 20px;
        cursor: pointer;
        margin: 0 2px;
    }
</style>