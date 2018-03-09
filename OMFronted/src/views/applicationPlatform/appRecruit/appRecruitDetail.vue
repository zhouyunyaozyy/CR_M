<template>
  <div id='recruitDetail' class="detail">
    <div class="recruitDetailHead">
      <div>
        <p><label>ID:</label>{{pageData.uid}}</p>
        <p><label>姓名:</label>{{pageData.name}}</p>
        <p><label>手机号:</label>{{pageData.tel}}</p>
        <p><label>提交时间:</label>{{new Date(create_time).toLocaleString('chinese',{hour12:false})}}</p>
      </div>
      <Button @click='goTrue(2)'>通过</Button>
      <Button @click='goTrue(3)'>拒绝</Button>
      <div>
        <span>拒绝理由：</span>
        <Input type='textarea' placeholder='必填' :maxlength='200' v-model='note'></Input>
      </div>
    </div>
    
    <hr style="margin:0px;height:1px;border:0px;background-color:#D5D5D5;"/>
    <div class="showImage">
      <div>
        <p>标准照</p>
        <img :src='pageData.headerUrl' @click='goImg(pageData.headerUrl)'>
      </div>
      <div>
        <p>图片形象</p>
        <img v-for='item in pageData.imagesUrl' :src='item' @click='goImg(item)'>
      </div>
    </div>
    <div class="showImage">
      <div>
        <p>视频形象</p>
        <video :src='pageData.videoUrl' controls></video>
      </div>
      <div>
        <p>证书</p>
        <img v-for='item in pageData.skills' :src='item.skillUrl' @click='goImg(item.skillUrl)'>
      </div>
    </div>
    <hr style="margin:0px;height:1px;border:0px;background-color:#D5D5D5;"/>
    <div class="containBodyDetail">
            <div class="containBodyDetailLeft">
                <h3>基本信息</h3>
                <div>
                    <div>
                        <p><span>姓&nbsp;&nbsp;名：</span>{{pageData.name}}</p>
                        <p v-for='item in localData.gender' v-if='item.code == pageData.gender'><span>性&nbsp;&nbsp;别：</span>{{item.name}}</p>
                        <p><span>年&nbsp;&nbsp;龄：</span>{{pageData.age}}</p>
                        <p v-for='item in localData.ethnicity' v-if='item.code == pageData.ethnicity'><span>民&nbsp;&nbsp;族：</span>{{item.name}}</p>
                        <div v-for='item in localData.area'>
                            <div v-for='item1 in item.children'>
                               <p v-for='item2 in item1.children' v-if='item2.code == pageData.naTive'><span>籍&nbsp;&nbsp;贯：</span>{{item.name+item1.name+item2.name}}</p>
                            </div>
                        </div>
                        <p v-for='item in localData.wedding' v-if='item.code==pageData.wedding'><span>婚姻状况：</span>{{item.name}}</p>
                        <p><span>联系电话：</span>{{pageData.tel}}</p>
                        <p><span>身份证号：</span>{{pageData.idno}}</p>
                        <p v-for='item in localData.mandarin' v-if='item.code==pageData.mandarin'><span>普通话：</span>{{item.name}}</p>
                    </div>
                    <div>
                        <p v-for='item in localData.education' v-if='item.code==pageData.education'><span>最高学历：</span>{{item.name}}</p> 
                        <p v-for='item in localData.political' v-if='item.code==pageData.political_status'><span>政治面貌：</span>{{item.name}}</p>
                        <p><span>生&nbsp;&nbsp;日：</span>{{new Date(parseInt(pageData.birthday)).toLocaleString().substr(0,17).split(' ')[0]}}</p>
                        <p><span>身&nbsp;&nbsp;高：</span>{{pageData.height}}CM</p>
                        <p><span>体&nbsp;&nbsp;重：</span>{{pageData.weight}}KG</p>
                        <p v-for='item in vision' v-if='item.code == pageData.vision'><span>裸眼视力：</span>{{item.name}}</p>
                        <p v-for='item in localData.offerExperience' v-if='item.code==pageData.experience'><span>工作经验：</span>{{item.name}}</p>
                        <p  v-for='item in localData.offerState' v-if='item.code==pageData.status_resume'><span>任职状态：</span>{{item.name}}</p>
                        <p v-for='item in localData.english' v-if='item.code==pageData.english'><span>英&nbsp;&nbsp;语：</span>{{item.name}}</p>
                    </div>
                </div>
<!--
                <h3>视频形象</h3>
                <div>
                    <video controls :src="pageData.videoUrl"></video>
                </div>
                <h3>图片形象</h3>
                <div>
                    <div v-for='item in pageData.imagesUrl'>
                        <div>
                            <img @click='goImg(item)' :src='item'>
                        </div>
                    </div>
                </div>
-->
<!--
                <h3>语言能力</h3>
                <div>
                    <span v-for="item2 in pageData.language">
                        <span v-for="item in localData.language">
                            <span v-for="item1 in item.level" v-if='item2 === item1.code'>
                                <label>{{item.name}}：</label>&nbsp;{{item1.name}}
                            </span>
                        </span>
                    </span>
                </div>
-->
<!--
                <h3>证书</h3>
                <div>
                    <div v-for='item in pageData.skills'>
                        <div>
                            <img @click="goImg(item.skillUrl)" :src="item.skillUrl"><span> </span>
                        </div>
                        <p>{{item.name}}</p>
                    </div>
                    <div v-if="pageData.skills && pageData.skills.length === 0" style="text-align:left">
                        (暂无)
                    </div>
                </div>
-->
<!--
                <h3>问答</h3>
                <div>
                  <pre>aaaaaaaaaaaaa
                  bbbbbb
                  ccc</pre>
                    <video controls :src="pageData.videoUrl"></video>
                </div>
-->
            </div>
            <div class="containBodyDetailRight">
                <h3>自我描述</h3>
                <div>
                    <pre>{{pageData.profile}}</pre>
                </div>
                <h3 v-for="item in rcnidArr" v-if="item.rcnid == pageData.rcnid">{{item.name}}职能相关</h3>
                <div v-if='pageData.custom_value'>
<!--                    <p>{{pageData.custom_value[0].modeltype}}</p>-->
                    <p v-for="item in pageData.custom_value[0]" v-if="item.modeltype === 1 || item.modeltype === 2"><span>{{item.name}}</span><span>{{item.value}}</span></p>
                    <div v-for="item in pageData.custom_value[0]" v-if="item.modeltype == 3">
                        <p v-for="item2 in item.config_json" v-if="item.value == item2.code"><span>{{item.name}}</span><span>{{item2.name}}</span></p>
                    </div>
                    <div v-for="item in pageData.custom_value[0]" v-if="item.modeltype === 4">
                        <p><span>{{item.name}}</span><span>{{new Date(parseInt(item.value)).toLocaleString().substr(0,17)}}</span></p>
                    </div>
                </div>
                <h3>工作经历</h3>
                <div>
                    <div v-for='item in pageData.experiences'>
                        <p v-if='item.endtime==88888888888888'><label>任职时间：</label>{{new Date(parseInt(item.starttime)).getFullYear()+'.'+(new Date(parseInt(item.starttime)).getMonth()+1)+'-至今'}}</p>
                        <p v-else><label>任职时间：</label>{{new Date(parseInt(item.starttime)).getFullYear()+'.'+(new Date(parseInt(item.starttime)).getMonth()+1)+'-'+new Date(parseInt(item.endtime)).getFullYear()+'.'+(new Date(parseInt(item.endtime)).getMonth()+1)}}</p>
                        <p><label>任职公司：</label>{{item.cname}}</p>
                        <p><label>职&nbsp;&nbsp;位：</label>{{item.job}}</p>
                        <div>
                            <label>工作描述：</label>
                            <div v-html="item.profile"></div>
                        </div>
                    </div>
                    <div v-if="pageData.experiences && pageData.experiences.length === 0" style="text-align:left">
                        (暂无)
                    </div>
                </div>
                <h3>教育经历</h3>
                <div>
                    <div v-for='item in pageData.educations'>
                        <p v-if='item.graduation_time==88888888888888'><label>就读时间：</label>{{new Date(parseInt(item.admission_time)).getFullYear()+'.'+(new Date(parseInt(item.admission_time)).getMonth()+1)+'-至今'}}</p>
                        <p v-else><label>就读时间：</label>{{new Date(parseInt(item.admission_time)).getFullYear()+'.'+(new Date(parseInt(item.admission_time)).getMonth()+1)+'-'+new Date(parseInt(item.graduation_time)).getFullYear()+'.'+(new Date(parseInt(item.graduation_time)).getMonth()+1)}}</p>
                        <p><label>毕业学校：</label>{{item.sname}}</p>
                        <p v-for='item2 in localData.education' v-if='item2.code==item.education'>
                            <label>学&nbsp;&nbsp;历：</label>
                            {{item2.name}}
                        </p>
                        <p v-if="item.majors">
                            <label>专&nbsp;&nbsp;业：</label>
                            {{item.majors}}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    <Modal title="原图展示" v-model="dialogVisible">
        <img :src="dialogImageUrl" v-if="dialogVisible" style="width: 100%">
    </Modal>
    </div>
</template>
<script>
  export default {
    data () {
      return {
        rcnidArr: [], // 职能
        rid: '',
        create_time: '',
        localData: {},
        dialogVisible: false,
        dialogImageUrl: '',
        pageData: {},
        note: '',
        "vision":[
          {"code":"1","name":"0.1"},
          {"code":"2","name":"0.12"},
          {"code":"3","name":"0.15"},
          {"code":"4","name":"0.2"},
          {"code":"5","name":"0.25"},
          {"code":"6","name":"0.3"},
          {"code":"7","name":"0.4"},
          {"code":"8","name":"0.5"},
          {"code":"9","name":"0.6"},
          {"code":"10","name":"0.8"},
          {"code":"11","name":"1.0"},
          {"code":"12","name":"1.2"},
          {"code":"13","name":"1.5"},
          {"code":"14","name":"2.0"}
		]
      }
    },
    created () {
      this.$axios({type: 'get', url: "/resumecustom/queryCustomName", data: {}, fuc: (result) => {
        this.rcnidArr = result.data
      }, nowThis: this})
      this.rid = this.$route.query.rid
      this.create_time = this.$route.query.create_time
      this.localData = JSON.parse(window.sessionStorage.getItem('localData'))
      this.$axios({type: 'post', url: "/children/getResumeByRid", data: {data: JSON.stringify({rid: this.rid})}, fuc: (res) => {
        this.pageData = res.data
//        this.pageData.language = this.pageData.language.split(',')
      }, nowThis: this})
    },
    methods: {
      goImg (src) {
        this.dialogVisible = true
        this.dialogImageUrl = src
      },
      goTrue (num) {
        let _form = {}
        _form.rid = this.rid
        _form.status = num
        if (num == 3) {
          console.log(this.note)
          _form.note = this.note
        }
        this.$axios({type: 'post', url: "/resume/changeResumeAudit", data: {data: JSON.stringify(_form)}, fuc: (res) => {
          console.log(res)
          this.$axios({type: 'post', url: "/resume/getNextResumeAudit", data: {}, fuc: (result) => {
            this.rid = result.data.rid
            this.create_time = result.data.create_time
            this.$axios({type: 'post', url: "/children/getResumeByRid", data: {data: JSON.stringify({rid: this.rid})}, fuc: (resNow) => {
              this.pageData = resNow.data
              this.note = ''
      //        this.pageData.language = this.pageData.language.split(',')
            }, nowThis: this})
          }, nowThis: this})
        }, nowThis: this})
      }
    }
  }
</script>
<style>
    .containBodyDetailRight>div:first-of-type>div>textarea{
        width: 100%;
        overflow: hidden;
        border: none;
    }
    .containBodyDetailRight .el-textarea.is-disabled .el-textarea__inner{
        
        background-color: white;
        color: black;
    }
    .el-textarea__inner{
        resize: none;
    }
</style>
<style lang="css" scoped>
    .detail{
        background-color: #eff1f6;
        width: 100%;
    }
    .containBodyDetail h3{
        padding: 26px;
        width: 100%;
        background-color: white;
        border: 1px solid #e9ebf2;
    }
    .containBodyDetailLeft{
        width: 50%;
        padding-left: 24px;
        padding-top: 24px;
      float: left;
    }
    .containBodyDetailLeft>div{
        width: 100%;
        padding: 24px;
        overflow: hidden;
        background-color: white;
        border: 1px solid #e9ebf2;
        margin-bottom: 26px;
    }
    .containBodyDetailLeft>div:first-of-type>div{
        float: left;
        width: 50%;
    }
    .containBodyDetailLeft>div:first-of-type>div span{
        font-weight: bold;
    }
    .containBodyDetailLeft>div:first-of-type>div p{
        margin-top: 26px;
    }
    .containBodyDetailRight{
        width: 50%;
        padding: 24px;
        float: left;
    }
    .containBodyDetailLeft>div:nth-of-type(2),.containBodyDetailLeft>div:nth-of-type(6){
        text-align: center;
    }
  .containBodyDetailLeft>div:nth-of-type(6)>pre{
    text-align: left;
  }
    .containBodyDetailLeft>div:nth-of-type(2)>video, .containBodyDetailLeft>div:nth-of-type(6)>video{
        width: 371px;
        height: 371px;
        background-color: #333;
/*        margin: auto;*/
    }
    .containBodyDetailLeft>div:nth-of-type(3)>div{
        width: 25%;
/*        overflow: hidden;*/
        float: left;
        min-width: 140px;
        text-align: center;
        margin-top: 10px;
    }
    .containBodyDetailLeft>div:nth-of-type(3)>div>div{
        width: 105px;
        height: 105px;
        margin: auto;
        background-color: #333;
        -moz-box-shadow: 1px 3px 4px #000;
        -webkit-box-shadow: 1px 3px 4px #000;
        box-shadow: 1px 3px 3px #000;
        /* For IE 8 */
        -ms-filter: "progid:DXImageTransform.Microsoft.Shadow(Strength=4, Direction=135, Color='#000000')";
        /* For IE 5.5 - 7 */
        filter: progid:DXImageTransform.Microsoft.Shadow(Strength=4, Direction=135, Color='#000000');
    }
    .containBodyDetailLeft>div:nth-of-type(3)>div>div>img{
        max-width: 105px;
        max-height: 105px;
        vertical-align: middle;
    }
    .containBodyDetailLeft>div:nth-of-type(4)>span{
        display: inline-block;
        width: 50%;
    }
    .containBodyDetailLeft>div:nth-of-type(5)>div{
        width: 47.5%;
        min-width: 221px;
        overflow: hidden;
        float: left;
        text-align: center;
        position: relative;
    }
    .containBodyDetailLeft>div:nth-of-type(5)>div:nth-child(odd){
        margin-right: 5%;
    }
    .containBodyDetailLeft>div:nth-of-type(5)>div>div{
        width: 221px;
        height: 221px;
        margin: auto;
        background-color: #333;
        -moz-box-shadow: 1px 3px 4px #000;
        -webkit-box-shadow: 1px 3px 4px #000;
        box-shadow: 1px 3px 3px #000;
        /* For IE 8 */
        -ms-filter: "progid:DXImageTransform.Microsoft.Shadow(Strength=4, Direction=135, Color='#000000')";
        /* For IE 5.5 - 7 */
        filter: progid:DXImageTransform.Microsoft.Shadow(Strength=4, Direction=135, Color='#000000');
    }
    .containBodyDetailLeft>div:nth-of-type(5)>div>div>img{
        max-width: 221px;
        max-height: 221px;
        vertical-align: middle;
    }
    .containBodyDetailLeft>div:nth-of-type(5)>div>div>span{
        height: 100%;
        width: 0;
        overflow: hidden;
        display: inline-block;
        vertical-align: middle;
    }
    .containBodyDetailLeft>div:nth-of-type(5)>div>p{
        width: 221px;
        text-align: center;
        margin: auto;
        word-wrap: break-word;
　　     word-break: normal;
        margin-top: 20px;
    }
    .containBodyDetailRight>div{
        width: 100%;
        padding: 24px;
        overflow: hidden;
        background-color: white;
        border: 1px solid #e9ebf2;
        margin-bottom: 26px;
    }
    .containBodyDetailRight label{
        font-weight: bold;
    }
    .containBodyDetailRight>div:nth-of-type(2) p{
        margin-bottom: 16px;
    }
    .containBodyDetailRight>div:nth-of-type(2) p>span:last-child{
        float: right;
    }
    .containBodyDetailRight>div:nth-of-type(3){
        padding: 0;
    }
    .containBodyDetailRight>div:nth-of-type(3)>div{
        width: 100%;
        overflow: hidden;
        border-bottom: 1px solid #e9ebf2;
        padding: 24px;
    }
    .containBodyDetailRight>div:nth-of-type(3)>div>p{
        margin: 14px 0;
    }
    .containBodyDetailRight>div:nth-of-type(3)>div>div>div{
/*        float: left;*/
        width: 100%;
/*        display: inline-block;*/
        box-sizing: border-box;
        padding-left: 82px;
        margin-top: -18px;
    }
    .containBodyDetailRight>div:nth-of-type(4){
        padding: 0;
    }
    .containBodyDetailRight>div:nth-of-type(4)>div{
        width: 100%;
        overflow: hidden;
        border-bottom: 1px solid #e9ebf2;
        padding: 24px;
    }
    .containBodyDetailRight>div:nth-of-type(4)>div>p{
        margin: 14px 0;
    }
  .recruitDetailHead{
    margin: 20px 0;
    overflow: hidden;
    padding-left: 20px;
    width: 100%;
    box-sizing: border-box;
  }
  .recruitDetailHead>*{
    float: left;
  }
  .recruitDetailHead>button{
    margin: 10px 20px;
    padding: 16px 20px;
  }
  .recruitDetailHead>div:first-of-type>p>label{
    display: inline-block;
    width: 100px;
  }
  .showImage{
    width: 100%;
    overflow: hidden;
    padding: 20px;
    box-sizing: border-box;
  }
  .showImage>div:first-child{
    width: 200px;
/*    height: 100px;*/
    overflow: hidden;
    display: inline-block;
    margin-right: 100px;
  }
  .showImage>div:first-child>img{
    width: 200px;
    height: 100px;
    display: inline-block;
    margin-top: 10px;
  }
  .showImage>div:last-child>img{
    width: 100px;
    height: 100px;
    display: inline-block;
    margin-top: 10px;
  }
  .showImage>div>video{
    width: 100%;
    height: 100px;
    display: inline-block;
    margin-top: 10px;
  }
  .showImage>div:last-child{
    width: 600px;
    display: inline-block;
    overflow: hidden;
  }
</style>
