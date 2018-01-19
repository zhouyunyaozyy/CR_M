<style lang="less">
</style>
<template>
<div id="table" class="content">
    <Button @click="addText('')">添加文章</Button>
    <Form :inline="true" :model="formInline">
        <FormItem label="">
            <Input v-model="formInline.user" placeholder="标题"></Input>
        </FormItem>
        <FormItem label="">
            <DatePicker type="datetimerange" placeholder="选择日期" v-model="formInline.date1" style="width: 100%;"></DatePicker>
        </FormItem>
        <FormItem>
            <Button type="primary" @click="onSubmit">查找</Button>
        </FormItem>
    </Form>
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
                  title: '标题',
                  key: 'title'
              },
              {
                  title: '发布时间',
                  key: 'issue_time',
                  render: (h, params) => {
                    return h('span', {}, new Date(params.row.issue_time).toLocaleString('chinese',{hour12:false}))
                  }
              },
              {
                  title: '最近修改',
                  key: 'update_time',
                  render: (h, params) => {
                    return h('span', {}, new Date(params.row.update_time).toLocaleString('chinese',{hour12:false}))
                  }
              },
              {
                  title: '操作人员',
                  key: 'create_name'
              },
              {
                  title: '状态',
                  key: 'status',
                  render: (h, params) => {
                    let name = '已发布'
                    if (params.row.status == 0) {
                      name = '未发布'
                    }
                    return h('span', {}, name)
                  }
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
                                    this.issueTitle(params.row)
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
                                    this.addText(params.row.nid)
                                  }
                                }
                              }, '编辑'),
                              h('Button', {
                                props: {
                                  type: 'info',
                                  size: 'small'
                                },
                                on: {
                                  click: () => {
                                    this.removeTheme(params.row)
                                  }
                                }
                              }, '删除')
                            ])
                    }
                    return h('div', [
                      h('Button', {
                        props: {
                          type: 'info',
                          size: 'small'
                        },
                        on: {
                          click: () => {
                            this.addText(params.row.nid)
                          }
                        }
                      }, '编辑'),
                      h('Button', {
                        props: {
                          type: 'info',
                          size: 'small'
                        },
                        on: {
                          click: () => {
                            this.removeTheme(params.row)
                          }
                        }
                      }, '删除')
                    ])
                  }
              }
          ],
          formInline: {
              user: '',
              date1: '',
              date2: ''
          },
          dialogVisible: false,
          tableData: {},
          localData: {},
          ntid: ''
        };
    },
    computed: {
    },
    created () {
      this.ntid = this.$route.query.ntid
      this.$axios({type: 'get', url: '/common/configJson', fuc: (res) => {
        this.localData = res.data
      }, nowThis: this})
      this.getTableData();
    },
    methods: {
      issueTitle (val) {
        this.$axios({type: 'post', url: "/news/issueNews", data: {data: JSON.stringify({nid: val.nid})}, fuc: (result) => {
          this.$Message.success('发布成功')
          this.getTableData()
        }, nowThis: this})
      },
      onSubmit () {
          console.log('onsubmit')
      },
      addText (nid = '') {
        console.log(nid)
        this.$router.push({
          name: 'news_detail',
          query: {ntid: this.ntid, nid: nid}
        })
      },
      getTableData() {
        this.$axios({type: 'post', url: "/news/queryNews", data: {_start: this.$start, _limit: this.$limit, data: JSON.stringify({theme: this.ntid})}, fuc: (result) => {
            this.tableData = result.data;
            console.log(result)
            this.$start = result.data.start
        }, nowThis: this})
      },
      removeTheme (val) {
          console.log(val)
          this.$Modal.confirm({
            title: '提示',
            content: '确认删除[' + val.title + ']文章',
            onOk: () => {
              if (this.tableData.count > 1 && this.tableData.count % this.tableData.pageSize == 1) {
                this.$start-- 
              }
              this.$axios({type: 'post', url: "/news/deleteNews", data: {data: JSON.stringify({nid: val.nid})}, fuc: (result) => {
                this.$Message.success('删除成功')
                this.getTableData()
              }, nowThis: this})
            }
          })
      },
      handleCurrentChange (val) {
        this.$handleCurrentChange(val, this.getTableData, this)
      }
    }
};
</script>