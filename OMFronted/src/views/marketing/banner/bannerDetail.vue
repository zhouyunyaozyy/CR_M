<style lang="less" scoped="true">
</style>
<template>
<div id="form" class="content">
    <span>新建Banner</span>
    <Form ref="form" :model="form" :rules="rules" :label-width="80">
        <Row>
            <Col :span="12">
                <FormItem label="Banner" prop="url">
                    <Upload
                            ref="upload"
                            action="http://upload-z2.qiniu.com"
                            :on-success="handleAvatarSuccess" :on-remove="handleRemove" 
                            :before-upload="handleBeforeUpload"
                            :data="postData">
                        <Button size="small" type="primary">点击上传</Button>
                        <div slot="tip" class="Upload__tip">只能上传jpg/png文件，且不超过500kb</div>
                    </Upload>
                </FormItem>
                <FormItem label="类型" prop="type">
                    <Select v-model="form.type" placeholder="请选择活动区域">
                        <Option label="内链接" :value="1"></Option>
                        <Option label="外链接" :value="2"></Option>
                        <Option label="职位" :value="3"></Option>
                        <Option label="公司" :value="4"></Option>
                        <Option label="文本" :value="5"></Option>
                    </Select>
                </FormItem>
                <FormItem label="标题名称" prop="title">
                    <Input v-model="form.title"></Input>
                </FormItem>
                <FormItem label="参数" prop="args">
                    <Input type="textarea" v-model="form.args"></Input>
                </FormItem>
                <br/>
                <br/>
                <FormItem>
                    <Button type="primary" @click="updateBanner" v-if="bid">更新</Button>
                    <Button type="primary" @click="addBanner" v-if='!bid'>增加</Button>
                    <Button @click="clearData" v-if="!bid">清空</Button>
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
          tabsData: {},
          form: {
              type: 0,
              param: '',
              title: '',
              url: '',
              urlName: ''
          },
          postData: {},
          rules: {
              type: [{required: true, message: '请选择类型', trigger: 'change', type: "number"}],
              title: [{required: true, message: '请输入标题', trigger: 'blur'},],
              receive_type: [{required: true, message: '请选择接收类型', trigger: 'change'}],
              receive: [{required: true, message: '请输入接收对象', trigger: 'blur'},]
          },
          bid: ''
        };
    },
    computed: {
    },
    created() {
      this.$axios({type: 'get', url: "/sys/qiniu/token", fuc: (result) => {
          this.postData = {token: result.data}
      }, nowThis: this})
      
      if (this.$route.query.bid) {
        this.bid = this.$route.query.bid
        this.$axios({type: 'post', url: "/marketing/getBanner", data: {data: JSON.stringify({bid: this.bid})}, fuc: (result) => {
          this.form = result.data 
          console.log(result)
          this.$refs.upload.fileList.push({name: result.data.urlname, key: result.data.url});
        }, nowThis: this})
      }
    },
    methods: {
      handleAvatarSuccess(res, file) {
        this.form.url = res.key;
        this.form.urlname = file.name
      },
      handleBeforeUpload(file) {
          const isJPG = file.type === 'image/jpeg' || file.type === 'image/png';
          const isLt2M = file.size / 1024 / 1024 < 2;
          const isHad = this.form.url;

          if (!isJPG) {
              this.$message.error('上传头像图片只能是 JPG 格式!');
          }
          if (isHad) {
            this.$Notice.warning({
                title: 'Up to one pictures can be uploaded.'
            });
          }
          if (!isLt2M) {
              this.$message.error('上传头像图片大小不能超过 2MB!');
          }
          return isJPG && isLt2M && !isHad;
      },
      uploadError(res, file) {
          this.$Notice.warning({
              title: 'The file format is incorrect',
              desc: 'File format of ' + file.name + ' is incorrect, please select jpg or png.'
          })
      },
      handleRemove(file, fileList) {
          // for (let val in this.form.urlArr) {
          //     if (this.form.urlArr[val].url === file.response.key) {
          //         this.form.urlArr.splice(val, 1)
          //     }
          // }
          this.form.url = '';
          this.form.urlname = '';
          this.urlFileList = []
      },
      addBanner() {
          this.$refs['form'].validate((valid) => {
              if (valid) {
                  this.$axios({type: 'post', url: "/marketing/addBanner", data: {data: JSON.stringify(this.form)}, fuc: (result) => {
                    if (result.code == 1) {
                      this.$Message.success(result.msg)
                      this.$closeAndGoParent('banner_Detail', 'banner_List')
                    }
                  }, nowThis: this})
              }
          });

      },
      updateBanner() {
          this.$refs['form'].validate((valid) => {
              if (valid) {
                  this.$axios({type: 'post', url: "/marketing/updateBanner", data: {data: JSON.stringify(this.form)}, fuc: (result) => {
                    if (result.code == 1) {
                      this.$Message.success('更新成功')
                      this.$closeAndGoParent('banner_Detail', 'banner_List')
                    }
                  }, nowThis: this})
              }
          });
      },
      clearData() {
          this.$refs['form'].resetFields();
      }
    }
};
</script>