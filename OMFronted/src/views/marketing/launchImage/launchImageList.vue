<style lang="less">
</style>
<template>
<div id="table" class="content">
    <div class="searchForm">
      <Form inline :model='formInline'>
        <FormItem label='日期'>
          <DatePicker v-model='formInline.time' type="daterange" split-panels placeholder="Select date" style="width: 200px"></DatePicker>
        </FormItem>
        <FormItem label='名称'>
          <Input placeholder='关键字' v-model='formInline.keyword'></Input>
        </FormItem>
        <FormItem>
          <Button @click='searchSure'>查询</Button>
        </FormItem>
      </Form>
    </div>
    <div class="table">
      <Table
                :columns="columns" :data="tableData.data" stripe border
                style="width: 100%">
        </Table>
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
</div>
</template>
<script>
  export default {
    name: 'appSystem',
    data () {
      return {
        columns: [
          {
              title: '编号',
              type: 'index',
              width: 80
          },
          {
              title: '名称',
              key: 'title'
          },
          {
              title: '参数',
              key: 'args',
              ellipsis: true
          },
          {
              title: '发布时间',
              key: 'create_time',
              render: (h, params) => {
                return h('span', {}, new Date(parseInt(params.row.create_time)).toLocaleString('chinese',{hour12:false}))
              }
          },
          {
              title: '最近修改',
              key: 'modify_time',
              render: (h, params) => {
                return h('span', {}, new Date(parseInt(params.row.modify_time)).toLocaleString('chinese',{hour12:false}))
              }
          },
          {
              title: '操作人员',
              key: 'modify_name'
          },
          {
              title: '发布状态',
              key: 'status',
              render: (h, params) => {
                let name = '已开启'
                if (params.row.status == 0) {
                  name = '未开启'
                }
                return h('span', {}, name)
              }
          },
          {
              title: '操作',
              render: (h, params) => {
                let name = '开启'
                let fuc = this.openLaunchImage
                if (params.row.status == 1) {
                  name = '关闭'
                  fuc = this.closeLaunchImage
                }
                return h('div', [
                        h('Button', {
                          props: {
                            type: 'info',
                            size: 'small'
                          },
                          on: {
                            click: () => {
                              fuc(params.row)
                            }
                          }
                        }, name),
                        h('Button', {
                          props: {
                            type: 'info',
                            size: 'small'
                          },
                          on: {
                            click: () => {
                              this.goDetail(params.row)
                            }
                          }
                        }, '编辑')
                      ])
              }
          }
        ],
        formInline: {
          keyword: '',
          time: []
        },
        formInlineData: {},
        tableData: {}
      }
    },
    created () {
      this.getTableData()
    },
    methods: {
      searchSure () {
        this.formInlineData = {}
        for (let val in this.formInline) {
          if (val == 'time') {
            if (this.formInline[val].length > 0 && this.formInline[val][1]) {
              this.formInlineData.startTime = this.formInline[val][0].getTime()
              this.formInlineData.endTime = this.formInline[val][1].getTime()
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
      goDetail (data) {
        console.log(data)
        this.$router.push({
          name: 'launchImage_detail',
          query: {lid: data.lid}
        })
      },
      openLaunchImage (data) {
        this.$axios({type: 'post', url: "/dabai-chaorenjob/launchImage/updateStatusIssue?_start=" + this.$start + "&_limit=" + this.$limit, data: {lid: data.lid}, fuc: (result) => {
            this.getTableData()
            this.$Message.success('开启成功')
        }, nowThis: this})
      },
      closeLaunchImage (data) {
        this.$axios({type: 'post', url: "/dabai-chaorenjob/launchImage/updateStatusNotIssue?_start=" + this.$start + "&_limit=" + this.$limit, data: {lid: data.lid}, fuc: (result) => {
            this.getTableData()
            this.$Message.success('关闭成功')
        }, nowThis: this})
      },
      getTableData() {
        this.$axios({type: 'get', url: "/dabai-chaorenjob/launchImage/getAllLaunchImage", data: {_start: this.$start, _limit: this.$limit}, fuc: (result) => {
            this.tableData = result.data;
          console.log(result)
        }, nowThis: this})
      },
      handleCurrentChange (val) {
        this.$handleCurrentChange(val, this.getTableData, this)
      }
    }
  }
</script>