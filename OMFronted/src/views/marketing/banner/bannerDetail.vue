<style lang="less" scoped="true">
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
<template>
<div id="form" class="content">
    <span>新建Banner</span>
    <Form ref="form" :model="form" :rules="rules" :label-width="80">
        <Row>
            <Col :span="12">
                <FormItem label="Banner" prop='images'>
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
                <FormItem label="类型" prop="type">
                    <Select v-model="form.type" placeholder="请选择类型">
                        <Option label="内链接" :value="1"></Option>
                        <Option label="外链接" :value="2"></Option>
                        <Option label="职位" :value="3"></Option>
                        <Option label="公司" :value="4"></Option>
                        <Option label="文本" :value="5"></Option>
                        <Option label="文章" :value="6"></Option>
                    </Select>
                </FormItem>
                <FormItem label="标题名称" prop="title">
                    <Input :maxlength="15" v-model="form.title"></Input>
                </FormItem>
                <FormItem label="参数" prop="args">
                    <Input :maxlength="200" type="textarea" v-model="form.args"></Input>
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
          uploadList: [],
          imgName: '',
          visible: false,
          tabsData: {},
          form: {
              type: 0,
              args: '',
              title: '',
              images: ''
          },
          postData: {},
          rules: {
              type: [{required: true, message: '请选择类型', trigger: 'change', type: "number"}],
              images: [{required: true, message: '请上传图片', trigger: 'blur'}],
              title: [{required: true, message: '请输入标题', trigger: 'blur'},],
              receive_type: [{required: true, message: '请选择接收类型', trigger: 'change'}],
              receive: [{required: true, message: '请输入接收对象', trigger: 'blur'},]
          },
          bid: ''
        };
    },
    computed: {
    },
    mounted () {
      this.uploadList = this.$refs.uploadHead.fileList
    },
    created() {
      this.$axios({type: 'get', url: "/dabai-chaorenjob/common/qiniu/token", fuc: (result) => {
          this.postData = {token: result.data}
      }, nowThis: this})
      
      if (this.$route.query.bid) {
        console.log(this.$route.query.bid)
        this.bid = this.$route.query.bid
        this.$axios({type: 'get', url: "/dabai-chaorenjob/banner/getBannerDetails", data: {bid: this.bid}, fuc: (result) => {
          console.log('res', result)
          this.form = result.data 
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
    methods: {
      handleFormatError (file) {
          this.$Notice.warning({
              title: 'The file format is incorrect',
              desc: file.name + '格式不正确，请上传 jpg or png.'
          });
      },
      handleMaxSize (file) {
          this.$Notice.warning({
              title: 'Exceeding file size limit',
              desc: file.name + '文件太大，限制为2M.'
          });
      },
      handleBeforeUpload (file, fileList) {
          const check = this.uploadList.length < 1;
          if (!check) {
              this.$Notice.warning({
                  title: '上传上限为：1'
              });
          }
          return check;
      },
      handleSuccess (res, file) {
        this.form.images = res.key

        this.$axios({type: 'get', url: '/dabai-chaorenjob/common/qiniu/url/' + res.key, fuc: (result) => {
          this.$set(file, 'url', result.data)
        }, nowThis: this})
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
      handleView (item) {
          this.imgName = item.url;
          this.visible = true;
      },
      addBanner() {
        if (!this.form.images) {
          this.$Message.warning('请先上传banner')
          return false
        }
          this.$refs['form'].validate((valid) => {
              if (valid) {
                if (this.issueBool) {
                  this.form.issue_time = this.issueTime.getTime()
                }
                this.$axios({type: 'post', url: "/dabai-chaorenjob/banner/insertBanner", data: this.form, fuc: (result) => {
                  if (result.code == 1) {
                    this.$Message.success(result.msg)
                    this.$closeAndGoParent('banner_Detail', 'banner_List')
                  }
                }, nowThis: this})
              }
          });

      },
      updateBanner() {
        if (!this.form.images) {
          this.$Message.warning('请先上传banner')
          return false
        }
        this.$refs['form'].validate((valid) => {
              if (valid) {
                  this.$axios({type: 'post', url: "/dabai-chaorenjob/banner/updateBannerContent", data: this.form, fuc: (result) => {
                      this.$Message.success(result.msg)
                      this.$closeAndGoParent('banner_Detail', 'banner_List')
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