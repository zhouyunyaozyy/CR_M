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
<div class="content">
    <span>企业</span>
    <Form ref="form" :model="form" :rules="rules" :label-width="80">
        <Row>
            <Col :span="12">
                <FormItem label="Logo" required>
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
                <FormItem label="形象展示" required>
                    <div class="demo-upload-list" v-for="item in uploadListContent">
                      <template v-if="item.status === 'finished'">
                          <img :src="item.url">
                          <div class="demo-upload-list-cover">
                              <Icon type="ios-eye-outline" @click.native="handleView(item)"></Icon>
                              <Icon type="ios-trash-outline" @click.native="handleRemoveContent(item)"></Icon>
                          </div>
                      </template>
                      <template v-else>
                          <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
                      </template>
                  </div>
                  <Upload
                      ref="uploadContent"
                      :show-upload-list="false"
                      :on-success="handleSuccess"
                      :format="['jpg','jpeg','png']"
                      :max-size="2048"
                      :on-format-error="handleFormatError"
                      :on-exceeded-size="handleMaxSize"
                      :before-upload="handleBeforeUploadContent"
                      type="drag"
                      action="http://upload-z2.qiniu.com"
                      style="display: inline-block;width:58px;"
                      :data="postData">
                      <div style="width: 58px;height:58px;line-height: 58px;">
                          <Icon type="camera" size="20"></Icon>
                      </div>
                  </Upload>
                </FormItem>
                <br/>
                <br/>
                <FormItem label="企业全称" prop="name_full">
                    <Input v-model="form.name_full" placeholder="请输入企业完整的名称"></Input>
                </FormItem>
                <FormItem label="企业简称" prop="name_short">
                    <Input v-model="form.name_short" placeholder="请输入企业简称，如：川航、国行"></Input>
                </FormItem>
                <FormItem label="企业地址" prop="address">
                    <Input v-model="form.address" placeholder="请输入企业地址"></Input>
                </FormItem>
                <FormItem label="企业官网" prop="website">
                    <Input v-model="form.website">
                        <template slot="prepend">Http://</template>
                    </Input>
                </FormItem>
                <FormItem label="企业性质" prop="character">
                    <Select v-model="form.character">
                        <Option v-for="item in localData.character" :key="item.code" :value="item.code"
                                   :label="item.name"></Option>
                    </Select>
                </FormItem>
                <FormItem label="机队规模" prop="fleet_size">
                    <Select v-model="form.fleet_size">
                        <Option :key="item.code" :label="item.name" :value="item.code"
                                   v-for="item in localData.fleet_size"></Option>
                    </Select>
                </FormItem>
                <FormItem label="主营基地" prop="base_address_arr">
                    <Cascader :data="localData.area" v-model="form.base_address_arr"></Cascader>
                </FormItem>
                <FormItem label="公司简介" prop="profile">
                    <Input type="textarea" v-model="form.profile"></Input>
                </FormItem>
                <br/>
                <FormItem v-if='!this.cid'>
                    <Button type="primary" @click="insert">增加</Button>
                    <Button @click="clearData">清空</Button>
                </FormItem>
                <FormItem v-else>
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
          uploadList: [],
          uploadListContent: [],
          postData: {}, // token
          form: {
              name_full: '',
              name_short: '',
              address: '',
              website: '',
              character: '',
              fleet_size: '',
              base_address_arr: [],
              profile: ''
          },
          cid: '',
          logoUrl: '',
          rules: {
              name_full: [{required: true, message: '请输入全称', trigger: 'blur'},
                  {min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur'}],
              name_short: [{required: true, message: '请输入简称', trigger: 'blur'},
                  {min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur'}],
              address: [{required: true, message: '请输入地址', trigger: 'blur'},
                  {min: 0, max: 200, message: '长度在 0 到 200 个字符', trigger: 'blur'}],
              website: [{required: true, message: '请输入网址', trigger: 'blur'},],
              character: [{required: true, message: '请选择性质', trigger: 'change'}],
              fleet_size: [{required: true, message: '请选择规模', trigger: 'change'}],
              base_address_arr: [{type: 'array', required: true, message: '请选择主营基地', trigger: 'change'}],
              profile: [{required: true, message: '请输入简介', trigger: 'blur'}]
          },
          imagesUrl: [],
          dialogImages: '',
          dialogVisible: false,
          localData: {},
          imgName: '',
          visible: false
        };
    },
    computed: {
    },
    mounted () {
      this.uploadList = this.$refs.uploadHead.fileList
      this.uploadListContent = this.$refs.uploadContent.fileList
    },
    created () {
        if (this.$route.query.cid) {
          this.cid = this.$route.query.cid
        }
        this.$axios({type: 'get', url: "/sys/qiniu/token", fuc: (result) => {
            this.postData = {token: result.data}
        }, nowThis: this})
        this.$axios({type: 'get', url: '/common/configJson', fuc: (res) => {
          this.localData = res.data
          let area = []
          for (var i of this.localData.area) {
              if (i.children) {
                  let arr = []
                  for (var k = 0; k < i.children.length; k++) {
                      delete i.children[k].children;
                      arr.push({value: i.children[k].code,label: i.children[k].name})
                  }
                area.push({
                  value: i.code,
                  label: i.name,
                  children: arr
                })
              } else {
                area.push({
                  value: i.code,
                  label: i.name
                });
              }
          }
          this.localData.area = area
        }, nowThis: this})
        if (this.cid) {
          this.$axios({type: 'post', url: "/company/getCompanyByCid", data: {data: JSON.stringify({cid: this.cid})}, fuc: (result) => {
            console.log(1, result)
//            this.form = result.data;
            this.$nextTick(() => {
              for (let i in result.data.logo.split(',')) {
                this.uploadList.push({
                  response: {key: result.data.logo.split(',')[i]},
                  status: 'finished',
                  url: result.data.logoUrl
                })
              }
              for (let i in result.data.images.split(',')) {
                this.uploadListContent.push({
                  response: {key: result.data.images.split(',')[i]},
                  status: 'finished',
                  url: result.data.imagesUrl[i]
                })
              }
            })
            var first = result.data.base_address + "";
            this.form.base_address_arr.push(first.substr(0, 2) + "0000");
            this.form.base_address_arr.push(result.data.base_address);
            this.form.character = result.data.character + '';
            this.form.fleet_size = result.data.fleet_size + '';
            this.form.name_full = result.data.name_full;
            this.form.name_short = result.data.name_short;
            this.form.address = result.data.address;
            this.form.website = result.data.website;
            this.form.profile = result.data.profile;
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
      handleRemoveContent (file) {
        console.log(file)
          for (let i in this.uploadListContent) {
            if (this.uploadListContent[i].response.key == file.response.key) {
              this.uploadListContent.splice(i, 1);
            }
          }
          for (let i in this.$refs.uploadContent.fileList) {
            if (this.$refs.uploadContent.fileList[i].response.key == file.response.key) {
              this.$refs.uploadContent.fileList.splice(i, 1);
            }
          }
      },
      handleSuccess (res, file) {
        this.$axios({type: 'get', url: '/sys/qiniu/url/' + res.key, fuc: (result) => {
          this.$set(file, 'url', result.data)
        }, nowThis: this})
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
      handleBeforeUploadContent (file, fileList) {
          const check = this.uploadListContent.length < 3;
          if (!check) {
              this.$Notice.warning({
                  title: '上传上限为：3'
              });
          }
          return check;
      },
      insert() {
          
          console.log(this.form)
          this.$refs['form'].validate((valid) => {
              if (valid) {
                console.log(this.uploadList)
                if (this.form.base_address_arr.length !== 0) {
                    this.form.base_address = this.form.base_address_arr[this.form.base_address_arr.length - 1];
                }
//                  this.sure(() => {
                let images = []
                for (let val of this.uploadListContent) {
                  images.push(val.response.key)
                }
                this.form.images = images.join(',');
                this.form.logo = this.uploadList[0].response.key;
                this.$axios({type: 'post', url: '/company/addCompany', data: {data: JSON.stringify(this.form)}, fuc: (result) => {
                  if (result.code == 1) {
                    this.$Message.success(result.msg)
                    this.$closeAndGoParent('company_Detail', 'company_list')
                  }
                }, nowThis: this})
//                  });
              }
          });
      },
      update() {
        console.log(this.form)
        this.$refs['form'].validate((valid) => {
            if (valid) {
              this.form.cid = this.cid
              if (this.form.base_address_arr.length !== 0) {
                  this.form.base_address = this.form.base_address_arr[this.form.base_address_arr.length - 1];
              }
//                  this.sure(() => {
              let images = []
              for (let val of this.uploadListContent) {
                images.push(val.response.key)
              }
              this.form.images = images.join(',');
              this.form.logo = this.uploadList[0].response.key;
              this.$axios({type: 'post', url: '/company/updateCompany', data: {data: JSON.stringify(this.form)}, fuc: (result) => {
                if (result.code == 1) {
                  this.$Message.success(result.msg)
                  this.$closeAndGoParent('company_Detail', 'company_list')
                }
              }, nowThis: this})
//                  });
            }
        });
      },
      clearData() {
          this.$refs['form'].resetFields();
      },
      sure(fun) {
          this.$confirm('点击确定，立即推送到接收者。', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
          }).then(() => {
              fun();
          }).catch(() => {
          });
      },
    }
};
</script>