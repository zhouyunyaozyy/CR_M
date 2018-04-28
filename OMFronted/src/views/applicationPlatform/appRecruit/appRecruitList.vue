<style lang="css">
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
            <span>简历审核列表</span>
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
  </div>
</template>
<script>
  export default {
    data () {
      return {
        formInline: {
          time: []
        },
        formInlineData: {},
        columns: [
          {
            title: 'id',
            key: 'uid'
          },
          {
            title: '姓名',
            key: 'modify_name'
          },
          {
            title: '手机号',
            key: 'tel',
            render: (h, params) => {
              return h('span', {}, params.row.tel ? params.row.tel : '暂无')
            }
          },
          {
            title: '提交时间',
            key: 'create_time',
            render: (h, params) => {
              return h('span', {}, new Date(params.row.create_time).toLocaleString('chinese',{hour12:false}))
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
                }, '查看')
              ])
            }
          }
        ],
        tableData: {}
      }
    },
    created () {
      this.$limit = 15
      this.getTableData();
    },
    methods: {
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
      detail (val) {
        this.$router.push({
          name: 'appRecruit_detail',
          query: {rasid: val.rasid, create_time: val.create_time}
        })
      },
      getTableData() {
        this.$axios({type: 'get', url: "/dabai-chaorenjob/resumeAuditSnapshot/queryMarkAll", data: {_start: this.$start, _limit: this.$limit}, fuc: (result) => {
            console.log(123, result)
            this.tableData = result.data;

        }, nowThis: this})
      },
      handleCurrentChange (val) {
        this.$handleCurrentChange(val, this.getTableData, this)
      }
    }
  }
</script>