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
    /*.content>div:nth-of-type(2){*/
        /*width:600px;*/
        /*margin-left: 100px;*/
        /*text-align: center;*/
        /*border: 1px solid lightgrey;*/
        /*float: left;*/
        /*min-height: 200px;*/
    /*}*/
    /*.content>div:nth-of-type(2)>div>div{*/
        /*margin: 10px 0;*/
        /*cursor: pointer;*/
    /*}*/
    /*.content>div:nth-of-type(2) img{*/
        /*width: 100%;*/
    /*}*/
    /*.content>div:nth-of-type(2) video{*/
        /*width: 100%;*/
    /*}*/
    /*.detail>div{*/
        /*position: relative;*/
    /*}*/
    /*.detail i{*/
        /*transition: opacity .2s;*/
        /*opacity: 0;*/
        /*display: block;*/
        /*cursor: pointer;*/
        /*color: #c00;*/
        /*top: 10px;*/
        /*right: 40px;*/
        /*position: absolute;*/
        /*font-style: normal;*/
    /*}*/
    /*.detail>div:hover i{*/
        /*opacity: 1;*/
    /*}*/
    /*.detail>div:hover>div{*/
        /*display: inline-block;*/
    /*}*/
    /*.detail>div>div{*/
        /*background-color: rgba(153,153,153,0.5);*/
        /*width: 100%;*/
        /*height: 100%;*/
        /*color: white;*/
        /*display: none;*/
        /*position: absolute;*/
        /*top: 0;*/
        /*left: 0;*/
        /*right: 0;*/
        /*bottom: 0;*/
    /*}*/
    /*.detail>div>div>i{*/

    /*}*/
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
    .detail{
        width: 600px;
        border: 1px solid lightblue;
        min-height: 800px;
        overflow: hidden;
        position: relative;
        top: 0px;
        left: 100px;
        background-color: white;
    }
    .detail .edit{
        width: 560px;
        margin: auto;
        font-size: 14px;
    }
    .detail .edit>div{
        width: 100%;
        border: 1px dashed lightgrey;
        min-height: 160px;
        overflow: hidden;
    }
    .detail>div{
        width: 100%;
        box-sizing: border-box;
        padding: 0 20px;
        margin: 10px 0;
    }
    .detail img{
        width: 100%;
    }
    .detail video{
        width: 100%;
    }
    .detail .eachAddBtn{
        overflow: hidden;
        padding: 10px 0;
    }
    .detail .eachAddBtn>button{
        visibility: hidden;
        /*display: none;*/
    }
    .detail .parentDiv .eachAddBtn:hover>button{
        visibility: visible;
        /*display: block;*/
    }
    .detail>div>div{
        position: relative;
    }
    .detail .parentDiv>div:hover>.closeAndEditDiv{
        display: block;
    }
    .closeAndEditDiv{
        display: none;
        position: absolute;
        top: 0;
        bottom: 0;
        width: 100%;
        background-color: black;
        opacity: 0.6;
        text-align: center;
        overflow: hidden;
    }
    .closeAndEditDiv i{
        color: white;
        font-size: 18px;
        position: relative;
        top: calc(50% - 11px);
        margin-right: 20px;
    }
    .parentDiv>div{
        position: relative;
    }
    .checkDetail{
        width: 300px;
        height: 605px;
        float: right;
        overflow: hidden;
        background-image: url('../../../../images/phone.png');
        background-size: contain;
        position: relative;
        top: -730px;
    }
    .checkDetail>div{
        width: 100%;
        box-sizing: border-box;
        padding: 0 20px;
        height: 404px;
        overflow-y: auto;
        /*background-color: lightblue;*/
        position: relative;
        top: 120px;
    }
    .checkDetail>div div{
        word-wrap:break-word
    }
</style>
<style>
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
            <FormItem label="初始阅读量">
                <Input v-model="form.initial_reading"></Input>
            </FormItem>
            <FormItem label="关联阅读">
                <Input v-model="form.link"></Input>
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
                <Modal title="添加内容" @on-ok='addDialogTrue' @on-cancel='addDialogFalse' :loading='loading' v-model="visibleContent">
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

        <ButtonGroup style="overflow: hidden;position: relative;top: 0px;left: 100px;">
            <Button type="primary" @click="addDialogData('1')">添加文字</Button>
            <Button type="primary" @click="addDialogData('2')">添加图片</Button>
            <Button type="primary" @click="addDialogData('3')">添加视频</Button>
        </ButtonGroup>
        <!--<div class="detail" id="detailId"  @dragover="allowDrop" @drop="drop">-->
        <div class="detail" id="detailId">
            <!--<draggable v-model="editContent" :options="{group:'people'}" @start="drag=true" @end="drag=false" :move="checkMove">-->
                <!--<div v-for="(item, index) in editContent" class="parentDiv" :key="index" draggable="true"  @dragstart="drag" :id="index">-->
                <div v-for="(item, index) in editContent" class="parentDiv" :key="index">

                    <!--新增文本编辑框-->
                    <div v-if="item.contenteditable" style="margin-bottom: 40px;">
                        <div class="edit">
                            <Button size="small" @click="editBtnClick('foreColor', color)"><span :style="{'font-size': '16px','border-bottom':'3px solid ' + color, 'display': 'inline-block','margin-right': '4px'}">A</span><colorPicker v-model="color" @change="headleChangeColor"></colorPicker></Button>
                            <Button size="small" @click="editBtnClick('bold')">字体加粗</Button>
                            <Button size="small" @click="editBtnClick('underline')">下划线</Button>
                            <Button size="small" @click="editBtnClick('italic')">斜体</Button>
                            <Button size="small" @click="editBtnClick('fontSize', '2')">字体小</Button>
                            <Button size="small" @click="editBtnClick('fontSize', '4')">字体中</Button>
                            <Button size="small" @click="editBtnClick('fontSize', '6')">字体大</Button>
                            <Button size="small" @click="editBtnClick('justifyLeft')">left</Button>
                            <Button size="small" @click="editBtnClick('justifyCenter')">center</Button>
                            <Button size="small" @click="editBtnClick('justifyRight')">right</Button>
                            <div :contenteditable="item.contenteditable" v-html="item.content" @blur="getContenteditableData($event, index)"></div>
                            <Button type="success" style="float: right" @click="addDialogTrue(index)">确定</Button>
                            <Button type="error" style="float: right;margin-right: 15px;" @click="addDialogFalse(index)">取消</Button>
                        </div>
                    </div>

                    <!--新增图片片段-->
                    <div v-if="item.type == '2' && item.status == false" style="margin-bottom: 40px;">
                        <Upload
                            ref="uploadImg"
                            :show-upload-list="true"
                            :on-success="handleSuccessImg"
                            :format="['jpg','jpeg','png']"
                            :max-size="2048"
                            :on-format-error="handleFormatError"
                            :on-exceeded-size="handleMaxSize"
                            :before-upload="handleBeforeUploadImg"
                            type="drag"
                            action="http://upload-z2.qiniu.com"
                            style="display: inline-block;width: 100%;"
                            :data="postData">
                            <div style="width: 100%;height:58px;line-height: 58px;">
                                <Icon type="camera" size="20"></Icon>
                            </div>
                        </Upload>
                        <Button type="success" style="float: right" @click="addDialogTrue(index)">确定</Button>
                        <Button type="error" style="float: right;margin-right: 15px;" @click="addDialogFalse(index)">取消</Button>
                    </div>

                    <!--新增视频片段-->
                    <div v-if="item.type == '3' && item.status == false" style="margin-bottom: 40px;">
                        <span>上传视频</span>
                        <Upload
                                ref="uploadImg"
                                :show-upload-list="true"
                                :on-success="handleSuccessVideo"
                                :format="['mp4']"
                                :max-size="204800"
                                :on-format-error="handleFormatErrorVideo"
                                :on-exceeded-size="handleMaxSize"
                                :before-upload="handleBeforeUploadVideo"
                                type="drag"
                                action="http://upload-z2.qiniu.com"
                                style="display: inline-block;width: 100%;"
                                :data="postData">
                            <div style="width: 100%;height:58px;line-height: 58px;">
                                <Icon type="camera" size="20"></Icon>
                            </div>
                        </Upload>

                        <span>上传封面</span>
                        <Upload
                                ref="uploadVideo"
                                :show-upload-list="true"
                                :on-success="handleSuccessVideoImg"
                                :format="['jpg','jpeg','png']"
                                :max-size="2048"
                                :on-format-error="handleFormatError"
                                :on-exceeded-size="handleMaxSize"
                                :before-upload="handleBeforeUploadVideoImg"
                                type="drag"
                                action="http://upload-z2.qiniu.com"
                                style="display: inline-block;width: 100%;"
                                :data="postData">
                            <div style="width: 100%;height:58px;line-height: 58px;">
                                <Icon type="camera" size="20"></Icon>
                            </div>
                        </Upload>
                        <Button type="success" style="float: right" @click="addDialogTrue(index)">确定</Button>
                        <Button type="error" style="float: right;margin-right: 15px;" @click="addDialogFalse(index)">取消</Button>

                    </div>

                    <!--已完成的文本-->
                    <div v-if="item.type == '1' && !item.contenteditable">
                        <div v-html="item.content"></div>
                        <div class="closeAndEditDiv">
                            <i class="ivu-icon ivu-icon-close" @click="removeEditContent(index)"></i>
                            <i class="ivu-icon ivu-icon-edit" @click="editEditContent(index)"></i>
                        </div>
                    </div>

                    <!--已完成的图片-->
                    <div v-if="item.type == '2' && item.status">
                        <div>
                            <img :src="item.url" alt=""/>
                        </div>
                        <div class="closeAndEditDiv">
                            <i class="ivu-icon ivu-icon-close" @click="removeEditContent(index)"></i>
                            <i class="ivu-icon ivu-icon-edit" @click="editEditContent(index)"></i>
                        </div>
                    </div>

                    <!--已完成的视频-->
                    <div v-if="item.type == '3' && item.status">
                        <div>
                            <video :src="item.videoUrl" :poster="item.imgUrl" controls></video>
                        </div>
                        <div class="closeAndEditDiv">
                            <i class="ivu-icon ivu-icon-close" @click="removeEditContent(index)"></i>
                            <i class="ivu-icon ivu-icon-edit" @click="editEditContent(index)"></i>
                        </div>
                    </div>

                    <!--每块内容下面的新增按钮组-->
                    <div class="eachAddBtn" v-if="(item.type == '1' && !item.contenteditable) || (item.type == '2' && item.status) || (item.type == '3' && item.status)">
                        <Button type="ghost" @click="addDialogData('1', index)">添加文字</Button>
                        <Button type="ghost" @click="addDialogData('2', index)">添加图片</Button>
                        <Button type="ghost" @click="addDialogData('3', index)">添加视频</Button>
                    </div>
                </div>
            <!--</draggable>-->
        </div>
        <div class="checkDetail">
            <div>
                <div v-for="item in editContent" style="margin: 10px">
                    <div v-if="item.type == '1'" v-html="item.content"></div>
                    <div v-if="item.type == '2'">
                        <img :src="item.url" style="width: 100%"/>
                    </div>
                    <div v-if="item.type == '3'">
                        <video :src="item.videoUrl" :poster="item.imgUrl" controls style="width: 100%"></video>
                    </div>
                </div>
            </div>
        </div>
        <!--<div>-->
            <!--<ButtonGroup>-->
                <!--<Button type="primary" @click="addDialogData('1')">添加文字</Button>-->
                <!--<Button type="primary" @click="addDialogData('2')">添加图片</Button>-->
                <!--<Button type="primary" @click="addDialogData('3')">添加视频</Button>-->
            <!--</ButtonGroup>-->
            <!--<div class="detail" id="detailId">-->
                <!--&lt;!&ndash;<span>详情预览</span>&ndash;&gt;-->
                <!--<div v-for="(item, index) in content">-->
                    <!--<p v-if="item.type === '1'">{{item.content}}</p>-->
                    <!--<img :src="item.url" v-else-if="item.type === '2'">-->
                    <!--<video :src="item.url" v-else-if="item.type === '3'" controls></video>-->
                    <!--<i class="js-remove">✖</i>-->
                <!--</div>-->
            <!--</div>-->
        <!--</div>-->
    </div>
</template>

<script>
  // import Sortable from '../../../../Sortable.min.js'
  // import draggable from 'vuedraggable'
  export default {
    name: 'appSystem',
    components: {
      // draggable
    },
    data () {
      return {
        imgName: '',
        visible: false,
        loading: true,
        visibleContent: false,
        formatContent: ['jpg','jpeg','png'],
        maxSize: 2048,
        uploadList: [],
        editContent: [],
        index: 0, // 当前正在编辑文章的下标
        indexBool: false, // 当前是否正在编辑文章
        color: '#000',
        form: {
          title: '',
          profile: '',
          type: '',
          link: '',
          initial_reading: '' // 初始阅读量
        },
        rules: {
          title: [
            { required: true, message: '请输入文章标题', trigger: 'blur' },
            { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
          ],
          profile: [
            { required: true, message: '请输入文章摘要', trigger: 'blur' },
            { min: 20, max: 40, message: '长度在 20 到 40 个字符', trigger: 'blur' }
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
        editText: '', // 预编辑文本
        editImg: {}, // 预编辑图片
        editVideo: {}, // 预编辑视频
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
            console.log(evt)
            var el = editableList.closest(evt.item); // get dragged item
            el && el.parentNode.removeChild(el);
            this.content.splice(evt.oldIndex, 1)
          }
        });
      }
    },
    mounted () {
      this.uploadList = this.$refs.uploadHead.fileList
    },
    created () {
      this.$axios({type: 'get', url: "/dabai-chaorenjob/common/qiniu/token", fuc: (result) => {
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
      // 拖拽
      allowDrop (ev) {
        console.log('dragover')
        ev.preventDefault();
      },
      drag (evt) {
        console.log('dragstart', evt)
        evt.dataTransfer.setData("Text",evt.target.id);
      },
      drop (evt) {
        console.log('drop', evt)
      },
      checkMove (evt) {
        // console.log('拖拽', evt)
      },
      editBtnClick (key, value) {
        console.log('编辑', document.execCommand(key, true, value ? value : null), key, value)
        document.execCommand(key, false, value ? value : null)
      },
      headleChangeColor (data) {
        console.log('color', data)
        this.editBtnClick('foreColor', data)
      },


      //
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
      handleSuccessContent (res, file) {
        this.$axios({type: 'get', url: '/dabai-chaorenjob/common/qiniu/url/' + res.key, fuc: (result) => {
            this.$set(file, 'url', result.data)

            let img = new Image()
//          img.onload = () => {
//            this.$set(file, 'width', img.width)
//            this.$set(file, 'height', img.height)
//          }
            img.src = result.data
            var check = () => {
              // 只要任何一方大于0
              // 表示已经服务器已经返回宽高
              if(img.width>0 || img.height>0){
                this.$set(file, 'width', img.width)
                this.$set(file, 'height', img.height)
                clearInterval(set);
              }
            };
            var set = setInterval(check,40);
          }, nowThis: this})
      },
      handleFormatError (file) {
        this.$Notice.warning({
          title: '图片格式错误',
          desc: file.name + ' 格式错误, 请上传JPG、JPEG、PNG类型图片'
        });
      },
      handleFormatErrorVideo (file) {
        this.$Notice.warning({
          title: '图片格式错误',
          desc: file.name + ' 格式错误, 请上传mp4视频'
        });
      },
      handleMaxSize (file) {
        this.$Notice.warning({
          title: '图片大小错误',
          desc: file.name + ' 超过2M.'
        });
      },
      handleBeforeUpload (file, fileList) {
        const check = this.uploadList.length < this.imgSize;
        if (!check) {
          this.$Notice.warning({
            title: '最多可上传的数量为：' + 1
          });
        }
        return check;
      },
      handleBeforeUploadContent (file, fileList) {
        const check = this.$refs.uploadContent ? this.$refs.uploadContent.fileList.length < 1 : true;
        if (!check) {
          this.$Notice.warning({
            title: '最多可上传的数量为：' + this.imgSize
          });
        }
        return check;
      },


      // 获取富文本的值
      getContenteditableData (e, index) {
        // this.editContent[index].content = e.target.innerHTML
        this.editText = e.target.innerHTML
      },

      // 上传文章图片成功回调
      handleSuccessImg (res , file) {
        this.$axios({type: 'get', url: '/dabai-chaorenjob/common/qiniu/url/' + res.key, fuc: (result) => {
            this.editImg.url = result.data
            this.editImg.key = res.key
            var image = new Image();
            image.src = result.data;
            var check = () => {
              // 只要任何一方大于0
              // 表示已经服务器已经返回宽高
              if(image.width>0 || image.height>0){
                this.editImg.width = image.width
                this.editImg.height = image.height
                clearInterval(set);
              }
            };
            var set = setInterval(check,40);
          }, nowThis: this})
      },

      // 上传文章视频封面成功回调
      handleSuccessVideoImg (res , file) {
        this.$axios({type: 'get', url: '/dabai-chaorenjob/common/qiniu/url/' + res.key, fuc: (result) => {
            this.editVideo.imgUrl = result.data
            this.editVideo.imgKey = res.key
            var image = new Image();
            image.src = result.data;
            var check = () => {
              // 只要任何一方大于0
              // 表示已经服务器已经返回宽高
              if(image.width>0 || image.height>0){
                this.editVideo.width = image.width
                this.editVideo.height = image.height
                clearInterval(set);
              }
            };
            var set = setInterval(check,40);
          }, nowThis: this})
      },

      // 上传文章视频成功回调
      handleSuccessVideo (res , file) {
        this.$axios({type: 'get', url: '/dabai-chaorenjob/common/qiniu/url/' + res.key, fuc: (result) => {
            this.editVideo.videoUrl = result.data
            this.editVideo.videoKey = res.key
          }, nowThis: this})
      },

      // 上传图片数量限制
      handleBeforeUploadImg (file) {
        const check = !this.editImg.url
        if (!check) {
          this.$Notice.warning({
            title: '最多可上传的数量为：' + 1
          });
        }
        return check;
      },

      // 上传视频封面数量限制
      handleBeforeUploadVideoImg (file) {
        const check = !this.editVideo.imgUrl
        if (!check) {
          this.$Notice.warning({
            title: '最多可上传的数量为：' + 1
          });
        }
        return check;
      },

      // 上传视频数量限制
      handleBeforeUploadVideo (file) {
        const check = !this.editVideo.videoUrl
        if (!check) {
          this.$Notice.warning({
            title: '最多可上传的数量为：' + 1
          });
        }
        return check;
      },

      // 取消添加文章片段
      addDialogFalse(index) {
        if (!this.editContent[index].editBool) {
          this.editContent.splice(index, 1)
        } else {
          this.editText = ''
          this.editImg = {}
          this.editVideo = {}
          this.editContent[index].hasOwnProperty('status') ? this.editContent[index].status = true : this.editContent[index].contenteditable = false
          this.editContent[index].editBool = false
        }


        this.indexBool = false
      },

      // 确认添加文章片段
      addDialogTrue(index) {
        if (this.editContent[index].contenteditable) {
          console.log('添加文字')

          this.editContent[index].content = this.editText
          this.editContent[index].contenteditable = false

          this.editText = ''
        } else if (this.editContent[index].status == false && this.editContent[index].type == 2) {
          console.log('添加图片')

          this.editContent[index].url = this.editImg.url
          this.editContent[index].key = this.editImg.key
          this.editContent[index].width = this.editImg.width
          this.editContent[index].height = this.editImg.height
          this.editContent[index].status = true

          this.editImg = {}
        } else if (this.editContent[index].status == false && this.editContent[index].type == 3) {
          console.log('添加视频')

          this.editContent[index].imgUrl = this.editVideo.imgUrl
          this.editContent[index].imgKey = this.editVideo.imgKey
          this.editContent[index].videoUrl = this.editVideo.videoUrl
          this.editContent[index].videoKey = this.editVideo.videoKey
          this.editContent[index].width = this.editVideo.width
          this.editContent[index].height = this.editVideo.height
          this.editContent[index].status = true

          this.editVideo = {}
        }
        console.log(this.editContent)
        this.indexBool = false
      },

      // 删除文章片段
      removeEditContent (index) {
        if (this.indexBool) {
          this.$Message.error('还有正在编辑的内容，请完成之后再添加')
          return
        }
        this.editContent.splice(index, 1)
      },

      // 修改文章片段
      editEditContent (index) {
        if (this.indexBool) {
          this.$Message.error('还有正在编辑的内容，请完成之后再添加')
          return
        }
        if (!this.editContent[index].hasOwnProperty('status')) {
          this.editText = this.editContent[index].content
        }
        this.editContent[index].hasOwnProperty('status') ? this.editContent[index].status = false : this.editContent[index].contenteditable = true
        this.editContent[index].editBool = true
      },

      // 点击添加文章片段
      addDialogData (text, index) {
        if (this.indexBool) {
          this.$Message.error('还有正在编辑的内容，请完成之后再添加')
          return
        }

        if (index > -1) {
          // 在每一段后面加区块内容
          if (text == 1) {
            this.editContent.splice(index + 1, 0, {
              contenteditable: true,
              content: '',
              type: '1',
              editBool: false
            })
          } else if (text == 2) {
            this.editContent.splice(index + 1, 0, {
              key: '',
              url: '',
              width: '',
              height: '',
              type: '2',
              status: false,
              editBool: false
            })
          } else {
            this.editContent.splice(index + 1, 0, {
              imgKey: '',
              imgUrl: '',
              width: '',
              height: '',
              videoKey: '',
              videoUrl: '',
              type: '3',
              status: false,
              editBool: false
            })
          }
        } else {
          // 在尾部新加区块内容
            if (text == 1) {
              this.editContent.push({
                contenteditable: true,
                content: '',
                type: '1',
                editBool: false
              })
            } else if (text == 2) {
              this.editContent.push({
                key: '',
                url: '',
                width: '',
                height: '',
                type: '2',
                status: false,
                editBool: false
              })
            } else {
              this.editContent.push({
                imgKey: '',
                imgUrl: '',
                width: '',
                height: '',
                videoKey: '',
                videoUrl: '',
                type: '3',
                status: false,
                editBool: false
              })
            }
        }
        if (index > -1) {
          this.index = index + 1
        } else {
          this.index = this.editContent.length - 1
        }
        this.indexBool = true
      },
      submit () {
        if  (this.uploadList.length < 1) {
          this.$Notice.warning({
            title: '错误',
            desc: '请先上传封面图'
          });
          return false
        }
        // if  (this.content.length < 1) {
        //   this.$Notice.warning({
        //     title: '错误',
        //     desc: '请编辑文章内容'
        //   });
        //   return false
        // }

        this.$refs['form'].validate((valid) => {
          if (valid) {
            let issue_time = 0
            let url = '/dabai-chaorenjob/news/addNews'
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
            this.$axios({type: 'post', url: url, data: {
                  nid: this.nid ? this.nid : 0,
                  title: this.form.title,
                  profile: this.form.profile,
                  type: this.form.type,
                  initial_reading: this.form.initial_reading,
                  link: this.form.link,
                  content: JSON.stringify(this.editContent),
                  theme: this.ntid,
                  logo: imagesKey.join(','),
                  issue_time: issue_time
                }, fuc: (result) => {
                    if (result.code == 1) {
                      this.$Message.success(result.msg)
                      this.$closeAndGoParent('news_detail', {name: 'news_list', query: {ntid: this.ntid}})
                    }
              }, nowThis: this})

          }
        })
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