<template>
    <div id="table" class="content">
        <div class="table">
            <div>
                <span>企业列表</span>
                <!--<el-button type="primary" size="small" @click="onSubmit">导出</el-button>-->
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
    name: "userList",
    data () {
      return{
        tableData: [],
        columns: [
          {
            title: '用户名',
            key: 'username'
          },
          {
            title: '名称',
            key: 'name'
          },
          {
            title: '创建时间',
            key: 'create_time',
            render: (h, params) => {
              return h('span', {}, new Date(parseInt(params.row.create_time)).toLocaleString('chinese',{hour12:false}))
            }
          },
          {
            title: '状态',
            key: 'status',
            render: (h, params) => {
              for (let val of this.localData.status) {
                if (val.code == params.row.status) {
                  return h('span', {}, val.name)
                }
              }

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
                      this.freeze(params.row)
                    }
                  },
                  style: {
                    marginRight: '2px'
                  }
                }, '冻结'),
                h('Button', {
                  props: {
                    type: 'info',
                    size: 'small'
                  },
                  on: {
                    click: () => {
                      this.edit(params.row)
                    }
                  },
                  style: {
                    marginRight: '2px'
                  }
                }, '编辑'),
                h('Button', {
                  props: {
                    type: 'info',
                    size: 'small'
                  },
                  on: {
                    click: () => {
                      this.remove(params.row)
                    }
                  },
                  style: {
                    marginRight: '2px'
                  }
                }, '删除')
              ])

            }
          }
        ],
      }
    },
    created () {
      this.localData = JSON.parse(window.sessionStorage.getItem('localData'))
      this.getTableData()
    },
    methods: {
      freeze () {},
      edit () {},
      remove () {},
      getTableData() {
        this.$axios({type: 'get', url: "/dabai-chaorenjob/userSystem/getUserList?_limit=" + this.$limit + '&_start=' + this.$start, data: {}, fuc: (result) => {
            this.tableData = result.data;
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