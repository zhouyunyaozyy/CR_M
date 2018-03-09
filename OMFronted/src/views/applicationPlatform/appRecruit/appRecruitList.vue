<template>
  <div>
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
        columns: [
          {
            title: 'id',
            key: 'rid'
          },
          {
            title: '姓名',
            key: 'name'
          },
          {
            title: '手机号',
            key: 'tel'
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
      this.getTableData();
    },
    methods: {
      detail (val) {
        this.$router.push({
          name: 'appRecruit_detail',
          query: {rid: val.rid, create_time: val.create_time}
        })
      },
      getTableData() {
        this.$axios({type: 'post', url: "/resume/resumeAuditList", data: {_start: this.$start, _limit: this.$limit}, fuc: (result) => {
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