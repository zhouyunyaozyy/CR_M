<style lang="css" scoped="true">
  .seeCompetency{
    width: 500px;
    overflow: hidden;
  }
  .seeCompetency>div>h3{
    text-align: center;
    width: 100%;
  }
  .seeCompetency>button{
    margin-left: 100px;
  }
  .seeCompetency>div>div>p{
    margin: 10px 0;
  }
  .seeCompetency>div>div>p>span{
    display: inline-block;
    width: 200px;
    margin-right: 50px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .seeCompetency>div>div>p>button{
    margin-right: 10px;
  }
</style>
<template>
<div id="form" class="content">
  <Form ref="form" :model="form" :label-width=80>
      <Row>
          <Col :span="12">
              <FormItem label="职能名称" required>
                  <Input :maxlength="8" v-model="form.rcnid_name" placeholder="请输入职能名称"></Input>
              </FormItem>
              <FormItem label="唯一标识" required>
                  <Input :maxlength="8" v-model="form.code" placeholder="请输入code"></Input>
              </FormItem>
            <hr style="margin:0px 0 20px;height:1px;border:0px;background-color:#D5D5D5;"/>
              <FormItem label="类型" required>
                  <Select v-model="form.modeltype" placeholder="请选择标题类型">
                      <Option label="单选项" :value="3" :key="3"></Option>
                      <Option label="单行自输入" :value="1" :key="1"></Option>
                  </Select>
              </FormItem>
              <FormItem label="排序" required>
                  <Input :maxlength="12" v-model="form.sort" placeholder="请输入排序"></Input>
              </FormItem>
              <FormItem label="中文名称" required>
                  <Input :maxlength="20" v-model="form.name" placeholder="请输入标题"></Input>
              </FormItem>
              <FormItem label="提示语" required>
                  <Input :maxlength="20" v-model="form.placeholder" placeholder="请输入提示语"></Input>
              </FormItem>
              <FormItem label="字段名" required>
                  <Input :maxlength="20" v-model="form.field" placeholder="请输入字段名"></Input>
              </FormItem>
              <FormItem label="正则" v-if='form.modeltype == 1'>
                  <Input :maxlength="20" v-model="form.rule" placeholder="请输入正则"></Input>
              </FormItem>
              <FormItem label="数据源" v-if='form.modeltype == 3'>
<!--                  <Input :maxlength="20" v-model="form.dataSource" placeholder="请输入数据源"></Input>-->
                <Select v-model="form.dataSource" placeholder="请输入数据源">
                  <Option :label="item" :value="item" :key="item" v-for="item in localDataArr"></Option>
                </Select>
              </FormItem>
              <FormItem label="字符限制" v-if='form.modeltype == 1'>
                <Col :span='8'>
                  <Input v-model="form.numbers" placeholder="请输入字符限制（1_2）"></Input>
                </Col>
                <Col :span='8'>
                  <i-switch v-model="form.onlyNumber"></i-switch><span>仅限数字</span>
                </Col>
                  
              </FormItem>
              <FormItem>
                  <Button type="primary" @click="onSubmit">确认</Button>
              </FormItem>
          </Col>
      </Row>
  </Form>
  <div class="seeCompetency">
    <h3>预览：</h3>
    <div>
      <h3>{{compentencyData.name}}</h3>
      <div>
        <p v-for='item in compentencyData.body'>
          <span>{{item.name}}</span>
          <Button @click='changeCompentencyData(item)'>修改</Button>
          <Button @click='deleteCompentencyData(item)'>删除</Button>
        </p>
      </div>
    </div>
    <Button @click='saveData'>保存</Button>
  </div>
</div>
</template>

<script>

export default {
    name: 'infoPush',
    data () {
      return {
        index: -1, // 字段编辑索引
        compentencyData: {
          name: '',
          body: [],
          code: ''
        },
        form: {
            code: '',
            modeltype: 3, // 标题类型
            sort: '', // 排序
            rcnid_name: '', // 职能名称
            name: '', // 标题名称
            field: '', // 字段
            numbers: '', // 字符限制
            rule: '', // 正则
            dataSource: '', // 数据源
            placeholder: '', // 提示语
            onlyNumber: false
        },
        rcnid: '',
//        rules: {
//            type: [{required: true, message: '请选择类型', trigger: 'change'}],
//            // param: [{required: true, message: '请输入参数', trigger: 'blur'},],
//            title: [{required: true, message: '请输入标题', trigger: 'blur'},],
//            receive_type: [{required: true, message: '请选择接收类型', trigger: 'change'}],
//            receive: [{required: true, message: '请输入接收对象', trigger: 'blur'},]
//        },
        localData: {},
        localDataArr:[]
      };
    },
    computed: {
    },
    created () {
      this.localData = JSON.parse(window.sessionStorage.getItem('localData'))
      console.log(1, this.localData)
      for (let val in this.localData) {
        if (val !== 'area') {
          this.localDataArr.push(val)
        }
      }
      // 编辑 获取rcnid
      if (this.$route.query.rcnid) {
        this.rcnid = this.$route.query.rcnid
        this.$axios({type: 'post', url: "/profession/detailProfession", data: {data: JSON.stringify({rcnid: this.rcnid})}, fuc: (result) => {
          this.compentencyData.name = result.data.name
          this.form.code = result.data.code
          this.compentencyData.code = result.data.code
          this.form.rcnid_name = result.data.name
          this.compentencyData.body = result.data.body
        }, nowThis: this})
      }
    },
    methods: {
        onSubmit() {
//            this.$refs['form'].validate((valid) => {
//                if (valid) {
//                    this.sure();
//                }
//            });
          if (this.form.rcnid_name == '' || this.form.sort == '' || this.form.name == '' || this.form.code == '' || this.form.placeholder == '' || this.form.field == '') {
            this.$Message.error('请输入必填项内容')
            return
          }
          let form = {}
          this.compentencyData.name = this.form.rcnid_name
          form.modeltype = this.form.modeltype
          form.sort = this.form.sort
          form.name = this.form.name
          this.compentencyData.code = this.form.code
          form.placeholder = this.form.placeholder
          form.field = this.form.field
          if (this.form.modeltype == 1) {
            form.datatype = this.form.onlyNumber ? 2 : 1
            let custom = {}
            if (this.form.numbers) {
              custom.minlength = this.form.numbers.split('_')[0]
              custom.maxlength = this.form.numbers.split('_')[1]
            }
            if (this.form.rule) {
              custom.rule = this.form.rule
            }
            if (this.form.dataSource) {
              custom.dataSource = this.form.dataSource
            }
             
            form.custom = JSON.stringify(custom)
          } else {
            let custom = {}
            if (this.form.dataSource) {
              custom.dataSource = this.form.dataSource
            }
            form.custom = JSON.stringify(custom)
            form.datatype = 2
          }
          
          
          if (this.index > -1) {
            this.compentencyData.body.splice(this.index, 1, form)
          } else {
            this.compentencyData.body.push(form)
          }
          
          
          this.index = -1
          this.clearData()
        },
        clearData() {
            this.form.modeltype = 3
            this.form.sort = ''
            this.form.name = ''
            this.form.field = ''
            this.form.numbers = ''
            this.form.rule = ''
            this.form.dataSource = ''
            this.form.onlyNumber = ''
            this.form.placeholder = ''
        },
        sure() {
//          this.$Modal.confirm({
//            content: '点击确定，立即推送到接收者。',
//            title: '提示',
//            onCancel: () => {
//              console.log('cancle')
//            },
//            onOk: () => {
//              this.$axios({type: 'post', url: '/marketing/addPush', data: {data: JSON.stringify(this.form)}, fuc: (result) => {
//                if (result.code == 1) {
//                  this.$Message.success(result.msg)
//                  this.$closeAndGoParent('infoPush_Detail', 'infoPush_List')
//                }
//              }, nowThis: this})
//            }
//          })
        },
      saveData() {
        console.log(JSON.stringify(this.compentencyData))
        let url = this.rcnid ? '/profession/updateProfession' : '/profession/addProfession'
        if (this.rcnid) {
          this.compentencyData.rcnid = this.rcnid
        }
        this.$axios({type: 'post', url: url, data: {data: JSON.stringify(this.compentencyData)}, fuc: (result) => {
          if (result.code == 1) {
            this.$Message.success('操作成功')
            this.$closeAndGoParent('competency_detail', 'competency_list')
          }
        }, nowThis: this})
      },
      changeCompentencyData (item) {
        console.log(this.compentencyData.body.indexOf(item))
        this.index = this.compentencyData.body.indexOf(item)
        this.form.modeltype = item.modeltype
        this.form.sort = item.sort
        this.form.name = item.name
        this.form.placeholder = item.placeholder
        this.form.field = item.field
        if (JSON.parse(item.custom).maxlength) {
          if (JSON.parse(item.custom).minlength) {
            this.form.numbers = JSON.parse(item.custom).minlength + '_' + JSON.parse(item.custom).maxlength
          } else {
            this.form.numbers = 0 + '_' + JSON.parse(item.custom).maxlength
          }
        }
        this.form.rule = JSON.parse(item.custom).rule
        this.form.dataSource = JSON.parse(item.custom).dataSource
        this.form.onlyNumber = item.dataType == 2
      },
      deleteCompentencyData (item) {
        if (this.index <= -1) {
          this.compentencyData.body.splice(this.compentencyData.body.indexOf(item), 1)
        } else {
          this.$Message.error('请先编辑完当前字段，再进行删除操作')
        }
      }
    }
};
</script>