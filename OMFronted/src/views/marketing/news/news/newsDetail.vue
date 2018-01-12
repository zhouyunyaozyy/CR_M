<style lang="less" scoped="true">
  .content{
    width: 100%;
    overflow: hidden;
}
.content>form{
    width: 40%;
    float: left;
    height: 400px;
}
.content>form img{
    width: 433px;
    height: 150px;
}
.content>div:first-of-type{
    width: 60%;
    float: left;
    padding-left: 10px;
    box-sizing: border-box;
    height: 400px;
}
.content>div:first-of-type>div{
    margin: 10px;
}
.content>div:nth-of-type(2){
    width:720px;
    margin-left: 100px;
    text-align: center;
    border: 1px solid lightgrey;
    float: left;
    min-height: 200px;
}
.content>div:nth-of-type(2)>div>div{
    margin: 10px 0;
    cursor: pointer;
}
.content>div:nth-of-type(2) img{
    width: 100%;
}
.content>div:nth-of-type(2) video{
    width: 100%;
}
.detail>div{
    position: relative;
}
.detail i{
   transition: opacity .2s;
   opacity: 0;
   display: block;
   cursor: pointer;
   color: #c00;
   top: 10px;
   right: 40px;
   position: absolute;
   font-style: normal;
}
.detail>div:hover i{
   opacity: 1;
}
.detail>div:hover>div{
    display: inline-block;
}
.detail>div>div{
    background-color: rgba(153,153,153,0.5);
    width: 100%;
    height: 100%;
    color: white;
    display: none;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
}
.detail>div>div>i{

}
.el-upload{
    display: none
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
<template>
<div id="table" class="content">
    <Form ref="form" :model="form" :label-width="80" :rules="rules">
        <FormItem label="文章标题" prop="title">
            <Input v-model="form.title"></Input>
        </FormItem>
        <FormItem label="摘要" prop="profile">
            <Input v-model="form.profile"></Input>
        </FormItem>
        <FormItem label="排版类型" prop="type">
            <Select @on-change="changeType" v-model="form.type" placeholder="请选择排版类型">
                <Option label="图文模式（标题+单图）" value="2"></Option>
                <Option label="图文模式（标题+三图）" value="3"></Option>
                <Option label="图文模式（左右模式）" value="1"></Option>
                <Option label="视频模式" value="4"></Option>
            </Select>
        </FormItem>
        <FormItem v-if="form.type" label="排版类型示例">
            <img src="../../../../images/box_1@3x.png" v-if="form.type ==='1'">
            <img src="../../../../images/box_2@3x.png" v-else-if="form.type ==='2'">
            <img src="../../../../images/box_3@3x.png" v-else-if="form.type ==='3'">
            <img src="../../../../images/box_4@3x.png" v-else-if="form.type ==='4'">
        </FormItem>
    </Form>
    <div>
        <div>
            <span>封面图</span>
            
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
          
<!--           添加文章内容-->
          <Modal title="添加内容" @on-ok='addDialogTrue' @on-cancel='addDialogFalse' v-model="visibleContent">
            <Input placeholder='请输入文字信息' v-model='dialogData.text' v-if="dialogType == '1'"></Input>
            
            <Upload
                v-else
                ref="uploadContent"
                :show-upload-list="true"
                :on-success="handleSuccessContent"
                :format="formatContent"
                :max-size="maxSize"
                :on-format-error="handleFormatError"
                :on-exceeded-size="handleMaxSize"
                :before-upload="handleBeforeUploadContent"
                type="drag"
                action="http://upload-z2.qiniu.com"
                :data="postData">
                <div>
                    <Icon type="camera" size="20"></Icon>
                </div>
            </Upload>
          </Modal>
        </div>
        <div v-if="!nid">
            <span>定时发布</span>
            <DatePicker
                    v-model="issueTime"
                    type="datetime"
                    placeholder="选择日期时间">
            </DatePicker>
            <Checkbox v-model="issueBool"></Checkbox>
        </div>
        <div v-else>
          <RadioGroup v-model="issueBool">
            <Radio :label="0">仅修改</Radio>
            <Radio :label="1">重新发布</Radio>
          </RadioGroup>
        </div>
        <Button @click="submit">提交</Button>
    </div>
    <div>
        <ButtonGroup>
            <Button type="primary" @click="addDialogData('1')">添加文字</Button>
            <Button type="primary" @click="addDialogData('2')">添加图片</Button>
            <Button type="primary" @click="addDialogData('3')">添加视频</Button>
        </ButtonGroup>
        <div class="detail" id="detailId">
            <!--<span>详情预览</span>-->
            <div v-for="(item, index) in content">
                <p v-if="item.type === '1'">{{item.content}}</p>
                <img :src="item.url" v-else-if="item.type === '2'">
                <video :src="item.url" v-else-if="item.type === '3'" controls></video>
                <i class="js-remove">✖</i>
            </div>
        </div>
    </div>
</div>
</template>

<script>
import Sortable from '../../../../Sortable.min.js'
export default {
    name: 'appSystem',
    data () {
        return {
          imgName: '',
          visible: false,
          visibleContent: false,
          formatContent: ['jpg','jpeg','png'],
          maxSize: 2048,
          uploadList: [],
          
          form: {
              title: '',
              profile: '',
              type: ''
          },
          rules: {
              title: [
                  { required: true, message: '请输入文章标题', trigger: 'blur' },
                  { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
              ],
              profile: [
                  { required: true, message: '请输入文章摘要', trigger: 'blur' },
                  { min: 1, max: 20, message: '长度在 20 到 40 个字符', trigger: 'blur' }
              ],
              type: [
                   { required: true, message: '请选择排版类型', trigger: 'change' }
               ]
          },
          imgSize: 1,
          nid: '',
          ntid: '',
          dialogVisible: false,
          addDialog: false,
          postData: {},
          dialogImages: '',
          dialogType: '',
          issueTime: '',
          issueBool: 0,
          content: [],
          dialogData:{
              text: '',
          },
          index: -1 // 修改内容的下标
        };
    },
    computed: {
    },
    watch: {
      content: () => {
        let detailId = document.getElementById('detailId')
        var editableList = Sortable.create(detailId, {
          filter: '.js-remove',
          onFilter: function (evt) {
            var el = editableList.closest(evt.item); // get dragged item
            el && el.parentNode.removeChild(el);
          }
        });
      }
    },
    mounted () {
      this.uploadList = this.$refs.uploadHead.fileList
    },
    created () {
      this.$axios({type: 'get', url: "/sys/qiniu/token", fuc: (result) => {
          this.postData = {token: result.data}
      }, nowThis: this})
      this.nid = this.$route.query.nid
      this.ntid = this.$route.query.ntid
      if (this.nid) {
        this.$axios({type: 'post', url: '/news/getNewsByNid', data: {data: JSON.stringify({nid: this.nid})}, fuc: (result) => {
          console.log(result)
          this.content = JSON.parse(result.data.content)
          this.form.profile = result.data.profile
          this.form.title = result.data.title
          this.form.type = result.data.type + ''
          this.$nextTick(() => {
            for (let i in result.data.logo.split(',')) {
              this.uploadList.push({
                response: {key: result.data.logo.split(',')[i]},
                status: 'finished',
                url: result.data.logoUrl[i]
              })
              console.log(this.uploadList)
            }
          })
        }, nowThis: this})

      }
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
        this.$axios({type: 'get', url: '/sys/qiniu/url/' + res.key, fuc: (result) => {
          this.$set(file, 'url', result.data)
        }, nowThis: this})
      },
      handleSuccessContent (res, file) {
        this.$axios({type: 'get', url: '/sys/qiniu/url/' + res.key, fuc: (result) => {
          this.$set(file, 'url', result.data)
                
          let img = new Image()
          img.onload = () => {
            this.$set(file, 'width', img.width)
            this.$set(file, 'height', img.height)
          }
          img.src = result.data
        }, nowThis: this})
      },
      handleFormatError (file) {
          this.$Notice.warning({
              title: 'The file format is incorrect',
              desc: 'File format of ' + file.name + ' is incorrect, please select jpg or png.'
          });
      },
      handleMaxSize (file) {
          this.$Notice.warning({
              title: 'Exceeding file size limit',
              desc: 'File  ' + file.name + ' is too large, no more than 2M.'
          });
      },
      handleBeforeUpload (file, fileList) {
          const check = this.uploadList.length < this.imgSize;
          if (!check) {
              this.$Notice.warning({
                  title: 'Up to ' + this.imgSize + ' pictures can be uploaded.'
              });
          }
          return check;
      },
      handleBeforeUploadContent (file, fileList) {
          const check = this.$refs.uploadContent ? this.$refs.uploadContent.fileList.length < 1 : true;
          if (!check) {
              this.$Notice.warning({
                  title: 'Up to ' + this.imgSize + ' pictures can be uploaded.'
              });
          }
          return check;
      },
      //
          addDialogFalse() {
            this.visibleContent = false
            this.index = -1
            this.dialogData.text = ''
            if (this.$refs.uploadContent) {
              
              this.$refs.uploadContent.fileList.splice(0,this.$refs.uploadContent.fileList.length)
            }
          },
          addDialogTrue() {
            let obj = {}
            obj.type = this.dialogType
            console.log(this.content)
            if (this.dialogType === '1') {
                obj.content = this.dialogData.text
            } else if (this.dialogType === '2') {
                console.log(this.$refs.uploadContent.fileList)
                obj.content = this.$refs.uploadContent.fileList[0].response.key
                obj.url = this.$refs.uploadContent.fileList[0].url
                obj.width = this.$refs.uploadContent.fileList[0].width
                obj.height = this.$refs.uploadContent.fileList[0].height
            } else if (this.dialogType === '3') {
                 obj.content = this.$refs.uploadContent.fileList[0].response.key
                 obj.url = this.$refs.uploadContent.fileList[0].url
             }
            this.content.push(obj)
            this.addDialogFalse()
          },
          addDialogData (text) {
            this.visibleContent = true
            this.dialogType = text
            if (text == 2) {
              this.formatContent = ['jpg','jpeg','png']
              this.maxSize = 2048
            } else if (text == 3) {
              this.formatContent = ['WMV','AVI','FLV','MP4','RMVB']
              this.maxSize = 204800
            }
          },
          submit () {
            let issue_time = 0
            let url = '/news/addNews'
            if (this.nid) {
                if (this.issueBool) {
                    url = '/news/updateNewsReIssue'
                }else {
                    url = '/news/updateNewsOnlySave'
                }
            } else {
                if (this.issueBool) {
                    issue_time = this.issueTime.getTime()
                }
            }
            let imagesKey = []
            for (let val of this.uploadList) {
              console.log(val)
              imagesKey.push(val.response.key)
            }
            this.$axios({type: 'post', url: url, data: {data: JSON.stringify({
                nid: this.nid ? this.nid : 0,
                title: this.form.title,
                profile: this.form.profile,
                type: this.form.type,
                content: JSON.stringify(this.content),
                theme: this.ntid,
                logo: imagesKey.join(','),
                issue_time: issue_time
            })}, fuc: (result) => {
              this.$Message.success(result.msg)
            }, nowThis: this})
          },
          changeType (val) {
            console.log(1, val)
            this.uploadList.splice(0,this.uploadList.length)
            this.$refs.uploadHead.fileList.splice(0,this.$refs.uploadHead.fileList.length)
            if (val === '3') {
                this.imgSize = 3
            } else {
                this.imgSize = 1
            }
          }
    }
};
</script>