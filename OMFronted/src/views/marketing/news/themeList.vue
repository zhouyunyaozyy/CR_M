<style lang="less">
</style>
<template>
<div id="table" class="content">
    <Button @click="addTheme">添加栏目</Button>
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
                  title: '栏目名',
                  key: 'name'
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
                            this.goDetail(params.row)
                          }
                        }
                      }, '查看'),
                      h('Button', {
                        props: {
                          type: 'info',
                          size: 'small'
                        },
                        on: {
                          click: () => {
                            this.editTheme(params.row)
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
          form: {
  //        ntid："栏目ID"
  //                name:"栏目名称",
  //                code："栏目编号"
  //                sort："栏目编号"
              ntid: 0,
              name: '',
              sort: ''
          },
          tableData: {}
        };
    },
    computed: {
    },
    created () {
      this.getTableData();
    },
    methods: {
      addTheme () {
        this.$Modal.confirm({
          render: (h) => {
            return h('div', [
              h('div', [
                h('label', {
                  style: {width: '120px'}
                }, '栏目名称'),
                h('Input', {
                  props: {
                    maxlength: 4,
                    value: this.form.name,
                    autofocus: true,
                    placeholder: '请输入栏目名称'
                  },
                  style: {marginBottom: '30px'},
                  on: {
                    input: (val) => {
                        this.form.name = val;
                    }
                  }
                })
              ]),
              h('div', [
                h('label', {
                  style: {width: '120px'}
                }, '栏目顺序'),
                h('Input', {
                  props: {
                    value: this.form.sort,
                    maxlength: 4,

                    autofocus: true,
                    placeholder: '请输入栏目顺序'
                  },
                  on: {
                    input: (val) => {
                        this.form.sort = val;
                    }
                  }
                })
              ])
            ])
          },
          onOk: () => {
            if (isNaN(Number(this.form.sort))) {
              this.$Notice.warning({
                title: '错误',
                desc: '错误输入信息,请重新添加'
              });
              return false
            }
            if (!this.form.name || !this.form.sort) {
              this.$Notice.warning({
                title: '错误',
                desc: '输入信息不能为空'
              });
              return false
            }
            
            let url = this.form.ntid === 0 ? '/dabai-chaorenjob/news/addNewsTheme' : '/dabai-chaorenjob/news/updateNewTheme'
            this.$axios({type: 'post', url: url, data: this.form, fuc: (result) => {
                this.form.name = ''
                this.form.sort = ''
                this.form.ntid = 0
                this.getTableData()
//              this.$Modal.remove();
            }, nowThis: this})
          },
          onCancel: () => {
            this.form.name = ''
            this.form.sort = ''
            this.form.ntid = 0
          }
        })
          
      },
      getTableData() {
        this.$axios({type: 'get', url: "/dabai-chaorenjob/news/queryNewsTheme", data: {_start: this.$start, _limit: this.$limit}, fuc: (result) => {
              this.tableData = result.data;
        }, nowThis: this})
      },
      editTheme (val) {
          this.form.ntid = val.ntid
          this.form.name = val.name
          this.form.sort = val.sort
          this.addTheme()
      },
      removeTheme (val) {
        if (this.tableData.count > 1 && this.tableData.count % this.tableData.pageSize == 1) {
          this.$start--
        }

        this.$axios({type: 'post', url: "/dabai-chaorenjob/news/deleteNewsTheme", data: {ntid: val.ntid}, fuc: (result) => {
          this.$Message.success('删除成功')
          this.getTableData()
        }, nowThis: this})
      },
      goDetail (val) {
        this.$router.push({
          name: 'news_list',
          query: {ntid: val.ntid}
        })
      },
      handleCurrentChange (val) {
        this.$handleCurrentChange(val, this.getTableData, this)
      }
    }
};
</script>