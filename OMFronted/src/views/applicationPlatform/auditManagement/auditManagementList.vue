<style>
    .searchForm .ivu-form-item-content{
        display: inline-block;
    }
    .searchForm{
        background-color: darkgrey;
        margin-bottom: 10px;
        padding: 10px;
    }
</style>
<style scoped>
    .table{
        width: 100%;
        overflow: hidden;
    }
    .ivu-radio-group-vertical .ivu-radio-wrapper{
        height: auto;
        margin-bottom: 10px;
    }
    .table>div{
        width: 300px;
        margin-right: 10px;
        padding: 6px;
        border: 1px solid lightgray;
        display: inline-block;
        overflow: hidden;
    }
    .table>div>.tableLeft{
        width: 50%;
        float: left;
        box-sizing: border-box;
        padding: 10px;
    }
    .table>div>.tableLeft>img{
        width: 100%;
        height: 200px;
    }
    .table>div>.tableRight{
        width: 50%;
        float: left;
        box-sizing: border-box;
        padding: 10px;
    }
    .table>div>.tableRight>img{
        width: 100%;
        height: 200px;
    }
    .table>div>p{
        padding: 5px 10px;
        width: 100%;
    }
</style>
<template>
<div id="table" class="auditManage">
    <div class="searchForm">
        <Form inline :model='formInline'>
            <FormItem label='日期'>
                <DatePicker v-model='formInline.time' type="daterange" split-panels placeholder="Select date" style="width: 200px"></DatePicker>
            </FormItem>
            <FormItem>
                <Button @click='searchSure'>查询</Button>
            </FormItem>
        </Form>
    </div>
    <Select style="width: 120px;">
        <Option value="1">未审核</Option>
        <Option value="2">通过审核</Option>
        <Option value="3">审核失败</Option>
    </Select>
    <div class="table">
        <!--<Table-->
              <!--:columns="columns" :data="tableData.data" stripe border-->
                <!--style="width: 100%">-->
        <!--</Table>-->
        <div v-for="item in tableData.data">
            <div class="tableLeft">
                <p>身份证正面</p>
                <img :src="item.front_url" alt="">
            </div>
            <div class="tableRight">
                <p>身份证反面</p>
                <img :src="item.back_url" alt="">
            </div>
            <p>身份证姓名:<span>{{item.name}}</span></p>
            <p>身份证号码:<span>{{item.idno}}</span></p>
            <p>手机号:<span>找杨山</span></p>
            <p>操作人:<span>{{item.modify_name}}</span></p>
            <p>提交时间:<span>{{new Date(parseInt(item.modify_time)).toLocaleString('chinese', {hour12: false})}}</span></p>
            <Button type="success" @click="toMeet(item)">通过</Button>
            <Button type="warning" @click="torefuse(item)">拒绝</Button>
        </div>
    </div>

    <div>

        <Page
                :current="tableData.start"
                :page-size="tableData.pageSize"
                layout="total, prev, pager, next, jumper"
                :total="tableData.count"
                @on-change="handleCurrentChange">
        </Page>
    </div>
    <Modal
            v-model="modal1"
            title="填写拒绝理由"
            @on-ok="ok"
            @on-cancel="cancel">
        <span>拒绝理由：</span>

        <br/>
        <Radio v-model="refuseDataBool" @on-change="radioChange"></Radio>
        <Select v-model="refuseData1" :disabled="!refuseDataBool" placeholder="请选择" style="width: 200px;margin-bottom: 10px;">
            <Option value="身份证不清晰">身份证不清晰</Option>
            <Option value="证件类型有误">证件类型有误</Option>
            <Option value="无关图片">无关图片</Option>
            <Option value="违规图片">违规图片</Option>
            <Option value="视频不清晰">视频不清晰</Option>
            <Option value="无关视频">无关视频</Option>
            <Option value="违规视频">违规视频</Option>
        </Select>
        <br/>

        <Radio v-model="refuseDataBool2" @on-change="radioChange2"></Radio>
        <Input style="width: 200px" :disabled="!refuseDataBool2" placeholder="最多200个字符" :maxlength="200" type="textarea" v-model="refuseData2" :autosize="{minRows: 2,maxRows: 5}"></input>
    </Modal>
</div>
</template>
<script>
  export default {
    name: 'appSystem',
    data () {
      return {
        columns: [
            {
                title: '手机号',
                key: 'mobile'
            },
            {
                title: '姓名',
                key: 'name'
            },
            {
                title: '身份证',
                key: 'idno'
            },
            {
                title: '提审时间',
                key: 'create_time',
                render: (h, params) => {
                  return h('span', {}, new Date(parseInt(params.row.create_time)).toLocaleString('chinese', {hour12: false}))
                }
            },
            {
                title: '操作',
                render: (h, params) => {
                  return h('div', [
                          h('Button', {
                            props: {
                              type: 'info',
                              size: 'small'
                            },
                            on: {
                              click: () => {
                                this.detail(params.row)
                              }
                            },
                            style: {
                              marginRight: '2px'
                            }
                          }, '编辑')
                        ])

                }
            }
        ],
        tabsData: {},
        tableData: {},
        formInline: {
          time: []
        },
        modal1: false,
        refuseDataBool: true,
        refuseDataBool2: false,
        refuseData1: '',
        refuseData2: '',
        uid: ''
      }
    },
    created () {
      this.$limit = 15
      this.getTableData();
    },
    methods: {
      radioChange2 () {
        this.refuseDataBool = false
      },
      radioChange () {
        this.refuseDataBool2 = false
      },
      detail(data) {
        this.$router.push({
          name: 'auditManagement_detail',
          query: {uid: data.uid}
        })
      },
      ok () {
        let obj = {
          uid: this.uid
        }
        if (this.refuseDataBool) {
          obj.mark = this.refuseData1
        } else {
          obj.mark = this.refuseData2
        }
        this.$axios({type: 'post', url: "/dabai-chaorenjob/certification/markFail", data: obj, fuc: (result) => {
            this.$Message.success(result.msg)
            this.getTableData()
          }, nowThis: this})
      },
      cancel () {

      },
      searchSure() {
      },
      toMeet (item) {
        this.$axios({type: 'post', url: "/dabai-chaorenjob/certification/markSuccess", data: {uid: item.uid}, fuc: (result) => {
            this.$Message.success(result.msg)

            this.getTableData()
          }, nowThis: this})
      },
      torefuse (item) {
        this.uid = item.uid
        this.modal1 = true

      },
      clear() {
          this.searchForm = {};
      },
      getTableData() {
        this.$axios({type: 'get', url: "/dabai-chaorenjob/certification/queryMarkAll", data: {_start: this.$start, _limit: this.$limit}, fuc: (result) => {
          console.log(result)
          this.tableData = result.data
        }, nowThis: this})
      },
      handleCurrentChange (val) {
        this.$handleCurrentChange(val, this.getTableData, this)
      }
      
    }
  }
</script>