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
    name: "newsStatistics",
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
            title: '文章发布数量',
            key: 'count_news_count'
          },
          {
            title: '文章点击PV(人次)',
            key: 'count_news_unique_visitor'
          },
          {
            title: '文章点击UV(人数)',
            key: 'count_news_page_view'
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
        this.$axios({type: 'get', url: "/dabai-chaorenjob/stat/newsData", data: {_start: this.$start, _limit: this.$limit}, fuc: (result) => {
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