<style lang="css" scoped="true">
  .modal1 img{
    width: 100px;
    height: 100px;
    margin-right: 10px;
  }
</style>
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
<template>
  <div>
    <div class="searchForm">
      <Form inline :model='formInline'>
        <FormItem label='状态'>
          <Select v-model='formInline.status'>
            <Option value='0'>未查看</Option>
            <Option value='1'>已查看</Option>
            <Option value=' '>所有</Option>
          </Select>
        </FormItem>
        <FormItem label='手机号'>
          <Input v-model='formInline.mobile' placeholder='手机号' :maxlength='12'></Input>
        </FormItem>
        <FormItem label='日期'>
          <DatePicker v-model='formInline.time' type="daterange" split-panels placeholder="Select date" style="width: 200px"></DatePicker>
        </FormItem>
        <FormItem>
          <Button @click='searchSure'>查询</Button>
        </FormItem>
      </Form>
    </div>
    <div class="table">
        <div>
            <span>hr反馈列表</span>
        </div>
        <Table
                :columns="columns" :data="tableData.data" stripe border
                style="width: 100%">
        </Table>
    </div>
    <Page
            :current="tableData.start"
            :page-size="tableData.pageSize"
            layout="total, prev, pager, next, jumper"
            :total="tableData.count"
            @on-change="handleCurrentChange">
    </Page>
    <Modal
        class='modal1'
        v-model="modal1"
        title="查看详情"
        @on-ok="ok">
        <p><label>内容：</label>{{modalData.content}}</p>
        <p v-if='modalData.images && modalData.images.length > 0'><label>图片：</label><img v-for='item in modalData.images' :src='item' @click='goBigImage(item)'></p>
    </Modal>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        modal1: false,
        modalData: {
          images: [],
          content: ''
        },
        fbid: '',
        formInline: {
          status: '',
          mobile: '',
          time: []
        },
        formInlineData: {},
        columns: [
          {
            title: '用户id',
            key: 'uid'
          },
          {
            title: '手机号',
            key: 'mobile'
          },
          {
            title: '内容',
            key: 'content',
            ellipsis: 'true'
          },
          {
            title: '设备类型',
            key: 'client'
          },
          {
            title: '系统版本号',
            key: 'client_version'
          },
          {
            title: 'app版本号',
            key: 'app_version'
          },
          {
            title: '状态',
            key: 'status',
            render: (h, params) => {
              let name = params.row.status ? '已查看' : '未查看'
              return h('span', {}, name)
            }
          },
          {
            title: '创建时间',
            key: 'create_time',
            render: (h, params) => {
              return h('span', {}, new Date(parseInt(params.row.create_time)).toLocaleString('chinese',{hour12:false}))
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
                  }
                }, '查看详情')
              ])
            }
          }
        ],
        tableData: {},
        localData: {}
      }
    },
    created () {
      this.getTableData();
      this.localData = JSON.parse(window.sessionStorage.getItem('localData'))
    },
    methods: {
      ok () {
        this.$axios({type: 'post', url: "/dabai-chaorenjob/feedback/updateFeedbackStatus", data: {fbid: this.fbid}, fuc: (result) => {
            this.getTableData();
          }, nowThis: this})
      },
      searchSure () {
        this.formInlineData = {}
        for (let val in this.formInline) {
          if (val == 'time') {
            if (this.formInline[val].length > 0 && this.formInline[val][1]) {
              this.formInlineData.start_time = this.formInline[val][0].getTime()
              this.formInlineData.end_time = this.formInline[val][1].getTime()
            }
          } else {
            if (this.formInline[val] && this.formInline[val] !== ' ') {
              this.formInlineData[val] = this.formInline[val]
            }
          }
        }
        console.log(this.formInlineData)
        this.$start = 1
        this.getTableData()
      },
      goBigImage (url) {
        window.open(url)
      },
      detail (val) {
        console.log(val)
        this.$axios({type: 'get', url: "/dabai-chaorenjob/feedback/getSeekerFeedbackById", data: {fbid: val.fbid}, fuc: (result) => {
          console.log(result)
          this.modalData.content = result.data.content
          this.modalData.images = result.data.imagesUrl
            this.fbid = val.fbid
          this.modal1 = true
        }, nowThis: this})
      },
      getTableData() {
        this.$axios({type: 'get', url: "/dabai-chaorenjob/feedback/querySeekerFeedback", data: {_start: this.$start, _limit: this.$limit}, fuc: (result) => {
            this.tableData = result.data;

        }, nowThis: this})
      },
      handleCurrentChange (val) {
        this.$handleCurrentChange(val, this.getTableData, this)
      }
    }
  }
</script>