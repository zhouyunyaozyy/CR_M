<template>
    <div id="table" class="content">
        <!--<div class="searchForm">-->
            <!--<Form inline :model='formInline'>-->
                <!--<FormItem label='日期'>-->
                    <!--<Select v-model='formInline.status'>-->
                        <!--<Option value='0'>未查看</Option>-->
                        <!--<Option value='1'>已查看</Option>-->
                        <!--<Option value=' '>所有</Option>-->
                    <!--</Select>-->
                <!--</FormItem>-->
                <!--<FormItem>-->
                    <!--<Button @click='searchSure'>查询</Button>-->
                <!--</FormItem>-->
            <!--</Form>-->
        <!--</div>-->
        <div class="table">
            <div>
                <span>用户数据</span>
            </div>
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
    name: "userStatistics",
    data () {
      return {
        columns: [
          {
            title: '日期',
            key: 'jid',
            render: (h, params) => {
              return h('span', {}, params.row.year + '年' + params.row.month + '月' + params.row.day + '日')
            }
          },
          {
            title: '用户注册量',
            key: 'count_register'
          },
          {
            title: '累计用户注册量',
            key: 'count_all_register'
          },
          {
            title: '当日创建简历数',
            key: 'count_create_resume'
          },
          {
            title: '累计未完善简历数',
            key: 'count_undo_audit_resume'
          },
          {
            title: '累计完善简历数',
            key: 'count_over_audit_resume'
          },
          {
            title: '当日投递简历数',
            key: 'count_vote_resume'
          }

        ],
        tableData: []
      }
    },
    created () {
      this.localData = JSON.parse(window.sessionStorage.getItem('localData'))
      this.getTableData();
    },
    methods: {
      getTableData() {
        this.$axios({type: 'get', url: "/dabai-chaorenjob/stat/userData", data: {_start: this.$start, _limit: this.$limit}, fuc: (result) => {
            this.tableData = result.data
          }, nowThis: this})
      },
      handleCurrentChange (val) {
        this.$handleCurrentChange(val, this.getTableData, this)
      }

    }
  }
</script>

<style scoped>

</style>