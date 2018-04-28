<style lang="less">
</style>
<template>
<div id="table" class="content">
    <div class="searchForm">
      <Form inline :model='formInline'>
        <FormItem label='职能名称'>
          <Input placeholder='职能名称' v-model='formInline.name'></Input>
        </FormItem>
        <FormItem>
          <Button @click='searchSure'>查询</Button>
        </FormItem>
      </Form>
    </div>
    <div class="table">
        <div>
            <span>职能列表</span>
        </div>
        <Table
                :columns="columns" :data="tableData.data" stripe border
                style="width: 100%" @selection-change="handleSelectionChange">
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
    name: 'competencyList',
    data () {
        return {
          formInline: {
            name: ''
          },
          formInlineData: {},
          columns: [
              {
                  title: '职能名称',
                  key: 'name'
              },
              {
                  title: '状态',
                  key: 'status',
                  render: (h, params) => {
                    return h('span', {}, params.row.status == 1 ? '已发布' : (params.row.status == 0 ? '未发布' : '已下架'))
                  }
              },
              {
                  title: '最近修改',
                  render: (h, params) => {
                    return h('span', {}, new Date(params.row.modify_time).toLocaleString('chinese',{hour12:false}))
                  }
              },
              {
                  title: '操作人',
                  key: 'create_name'
              },
              {
                  title: '操作',
                  render: (h, params) => {
                    if (params.row.status == 0) {
                      return h('div', [
                        h('Button', {
                          props: {
                            type: 'info',
                            size: 'small'
                          },
                          on: {
                            click: () => {
                              this.onlineCompetency(params.row)
                            }
                          }
                        }, '发布'),
                        h('Button', {
                          props: {
                            type: 'info',
                            size: 'small'
                          },
                          on: {
                            click: () => {
                              this.editCompetency(params.row)
                            }
                          }
                        }, '编辑')
                      ])
                    } else if (params.row.status == 1) {
                      return h('div', [
                        h('Button', {
                          props: {
                            type: 'info',
                            size: 'small'
                          },
                          on: {
                            click: () => {
                              this.pulldownCompetency(params.row)
                            }
                          }
                        }, '下架'),
                        h('Button', {
                          props: {
                            type: 'info',
                            size: 'small'
                          },
                          on: {
                            click: () => {
                              this.editCompetency(params.row)
                            }
                          }
                        }, '查看')
                      ])
                    }
                  }
              }
          ],
          searchForm: {},
          currentPage: 1, // 当前页
          pageSize: 10, //每页条数
          total: 400, // 总数目
          tableData: {},
          localData: {}
        };
    },
    created () {
        this.getTableData();
        this.localData = JSON.parse(window.sessionStorage.getItem('localData'))
    },
    computed: {
    },
    watch: {
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
        onlineCompetency (val) {
          this.$axios({type: 'post', url: "/dabai-chaorenjob/resumeTarget/markSuccessResumeTarget", data: {rtid: val.rtid}, fuc: (result) => {
            if (result.code == 1) {
              this.$Message.success('操作成功')
              this.getTableData()
            }
          }, nowThis: this})
        },
        editCompetency (val) {
          this.$router.push({
            name: 'competency_detail',
            query: {rtid: val.rtid}
          })
        },
        pulldownCompetency (val) {
          this.$Modal.confirm({
            content: '点击确定，立即下架【' + val.name + '】职能',
            title: '提示',
            onCancel: () => {
              console.log('cancle')
            },
            onOk: () => {
              this.$axios({type: 'post', url: '/dabai-chaorenjob/resumeTarget/markFailResumeTarget', data: {rtid: val.rtid}, fuc: (result) => {
                if (result.code == 1) {
                  this.$Message.success(result.msg)
                  this.getTableData()
                }
              }, nowThis: this})
            }
          })
        },
        search() {
            this.getTableData();
        },
        clear() {
            this.searchForm = {};
            this.getTableData();
        },
        handleSelectionChange(val) {
            console.log(val)
        },
        getTableData() {
          this.$axios({type: 'get', url: "/dabai-chaorenjob/resumeTarget/queryAllResumeTarget", data: {_start: this.$start, _limit: this.$limit}, fuc: (result) => {
            console.log(result)
              this.tableData = result.data;
          }, nowThis: this})
        },
        handleCurrentChange (val) {
          this.$handleCurrentChange(val, this.getTableData, this)
        }
    }
};
</script>