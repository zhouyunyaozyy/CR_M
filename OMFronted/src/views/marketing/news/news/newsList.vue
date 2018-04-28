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
<div id="table" class="content">
    <div class="searchForm">
      <Form inline :model='formInline'>
        <FormItem label='日期'>
          <DatePicker v-model='formInline.time' type="daterange" split-panels placeholder="Select date" style="width: 200px"></DatePicker>
        </FormItem>
        <FormItem label='标题'>
          <Input placeholder='关键字' v-model='formInline.title'></Input>
        </FormItem>
        <FormItem>
          <Button @click='searchSure'>查询</Button>
        </FormItem>
      </Form>
    </div>
  
    <Button @click="addText('')">添加文章</Button>
  
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
                  title: 'id',
                  key: 'nid'
              },
              {
                  title: '标题',
                  key: 'title'
              },
              {
                  title: '发布时间',
                  key: 'issue_time',
                  render: (h, params) => {
                    return h('span', {}, new Date(parseInt(params.row.create_time)).toLocaleString('chinese',{hour12:false}))
                  }
              },
              {
                  title: '最近修改',
                  key: 'update_time',
                  render: (h, params) => {
                    return h('span', {}, new Date(parseInt(params.row.modify_time)).toLocaleString('chinese',{hour12:false}))
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
            title: '',
            time: []
          },
          formInlineData: {},
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
      this.localData = JSON.parse(window.sessionStorage.getItem('localData'))
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
      issueTitle (val) {
        this.$axios({type: 'post', url: "/dabai-chaorenjob/news/issueNews", data: {nid: val.nid}, fuc: (result) => {
          this.$Message.success('发布成功')
          this.getTableData()
        }, nowThis: this})
      },
      addText (nid = '') {
        console.log(nid)
        this.$router.push({
          name: 'news_detail',
          query: {ntid: this.ntid, nid: nid}
        })
      },
      getTableData() {
        let form = this.formInlineData
        form.theme = this.ntid
        this.$axios({type: 'get', url: "/dabai-chaorenjob/news/queryNews?_start=" + this.$start + '&_limit=' + this.$limit, data: form, fuc: (result) => {
            this.tableData = result.data;
            console.log(result)
            this.$start = result.data.start
        }, nowThis: this})
      },
      removeTheme (val) {
          if (this.tableData.count > 1 && this.tableData.count % this.tableData.pageSize == 1) {
            this.$start--
          }
          this.$axios({type: 'post', url: "/dabai-chaorenjob/news/deleteNews", data: {nid: val.nid}, fuc: (result) => {
            this.$Message.success('删除成功')
            this.getTableData()
          }, nowThis: this})
      },
      handleCurrentChange (val) {
        this.$handleCurrentChange(val, this.getTableData, this)
      }
    }
};
</script>