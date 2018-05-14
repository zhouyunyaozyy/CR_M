<template>
<div id="table" class="content">
    <div class="form">
        <div>
            <!--<span>条件查询</span>-->
            <!--<Button type="primary" size="small">清空</Button>-->
            <!--<Button type="primary" size="small">查询</Button>-->
            <Button type="primary" size="small" @click="addchildren">新增HR账号</Button>
        </div>
        <!--<Form :inline="true" :model="formInline" class="demo-form-inline">-->
            <!--<FormItem label="审批人">-->
                <!--&lt;!&ndash;<Input v-model="formInline.user" placeholder="审批人"></Input>&ndash;&gt;-->
            <!--</FormItem>-->
            <!--<FormItem label="活动区域">-->
                <!--&lt;!&ndash;<Select v-model="formInline.region" placeholder="活动区域">&ndash;&gt;-->
                    <!--&lt;!&ndash;<Option label="区域一" value="shanghai"></Option>&ndash;&gt;-->
                    <!--&lt;!&ndash;<Option label="区域二" value="beijing"></Option>&ndash;&gt;-->
                <!--&lt;!&ndash;</Select>&ndash;&gt;-->
            <!--</FormItem>-->
            <!--<FormItem label="审批人">-->
                <!--&lt;!&ndash;<Input v-model="formInline.user" placeholder="审批人"></Input>&ndash;&gt;-->
            <!--</FormItem>-->
            <!--<FormItem label="活动区域">-->
                <!--&lt;!&ndash;<Select v-model="formInline.region" placeholder="活动区域">&ndash;&gt;-->
                    <!--&lt;!&ndash;<Option label="区域一" value="shanghai"></Option>&ndash;&gt;-->
                    <!--&lt;!&ndash;<Option label="区域二" value="beijing"></Option>&ndash;&gt;-->
                <!--&lt;!&ndash;</Select>&ndash;&gt;-->
            <!--</FormItem>-->
        <!--</Form>-->
    </div>

    <div class="table">
        <div>
            <span>用户列表</span>
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
    name: 'appSystem',
    data () {
      return {
        columns: [
          {
            title: '姓名',
            key: 'name'
          },
            {
                title: '手机号',
                key: 'mobile'
            },
            {
                title: '用户名',
                key: 'username'
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
                title: '创建时间',
                key: 'create_time',
                render: (h, params) => {
                  return h('span', {}, new Date(parseInt(params.row.create_time)).toLocaleString('chinese',{hour12:false}))
                }
            },
            {
                title: '操作',
                render: (h, params) => {
                  if (params.row.status == 1) {
                    return h('div', [
                      h('Button', {
                        props: {
                          type: 'primary',
                          size: 'small'
                        },
                        style: {
                          marginRight: '5px'
                        },
                        on: {
                          click: () => {
                            this.freezing(params.row)
                          }
                        }
                      }, '冻结'),
                      h('Button', {
                        props: {
                          type: 'error',
                          size: 'small'
                        },
                        on: {
                          click: () => {
                            this.deleteChildren(params.row)
                          }
                        }
                      }, '删除'),
                      h('Button', {
                        props: {
                          type: 'error',
                          size: 'small'
                        },
                        on: {
                          click: () => {
                            this.editChildren(params.row)
                          }
                        }
                      }, '编辑')
                    ])
                  } else if (params.row.status == 3) {
                    return h('div', [
                      h('Button', {
                        props: {
                          type: 'primary',
                          size: 'small'
                        },
                        style: {
                          marginRight: '5px'
                        },
                        on: {
                          click: () => {
                            this.defrosting(params.row)
                          }
                        }
                      }, '解冻'),
                      h('Button', {
                        props: {
                          type: 'error',
                          size: 'small'
                        },
                        on: {
                          click: () => {
                            this.deleteChildren(params.row)
                          }
                        }
                      }, '删除'),
                      h('Button', {
                        props: {
                          type: 'error',
                          size: 'small'
                        },
                        on: {
                          click: () => {
                            this.editChildren(params.row)
                          }
                        }
                      }, '编辑')
                    ])
                  } else if (params.row.status != 4) {
                    return h('div', [
                      h('Button', {
                        props: {
                          type: 'error',
                          size: 'small'
                        },
                        on: {
                          click: () => {
                            this.deleteChildren(params.row)
                          }
                        }
                      }, '删除'),
                      h('Button', {
                        props: {
                          type: 'error',
                          size: 'small'
                        },
                        on: {
                          click: () => {
                            this.editChildren(params.row)
                          }
                        }
                      }, '编辑')
                    ])
                  }
                }
            }
        ],
        cid: '',
        formInline: {
            user: '',
            region: ''
        },
        tableData: {},
        localData: {}
      }
    },
    created () {
      this.cid = this.$route.query.cid
      this.getTableData();
      this.localData = JSON.parse(window.sessionStorage.getItem('localData'))
    },
    methods: {
      editChildren (val) {
        this.$router.push({
          name: 'children_detail',
          query: {cid: this.cid, uid: val.uid}
        })
      },
      addchildren () {
        this.$router.push({
          name: 'children_detail',
          query: {cid: this.cid}
        })
      },
      freezing(val) {
        // this.$Modal.confirm({
        //   title: '提示',
        //   content: '确定绕过主帐号权限，直接冻结当前子账号？',
        //   onOk: () =>{
            this.$axios({type: 'post', url: "/dabai-chaorenjob/company/freezingChildren", data: {uid: val.uid}, fuc: (result) => {
              this.$Message.success(result.msg)
              this.getTableData()
            }, nowThis: this})
        //   }
        // })
      },
      defrosting(val) {
        // this.$Modal.confirm({
        //   title: '提示',
        //   content: '确定绕过主帐号权限，直接解冻当前子账号？',
        //   onOk: () =>{
            this.$axios({type: 'post', url: "/dabai-chaorenjob/company/defrostingChildren", data: {uid: val.uid}, fuc: (result) => {
              this.$Message.success(result.msg)
              this.getTableData()
            }, nowThis: this})
        //   }
        // })
      },
      deleteChildren(val) {
//          this.initModal({title: "提示", profile: "确定绕过主帐号权限，直接删除当前子账号？"}, () => {
//              this.ajaxData("/company/deleteChildren", {uid: val.uid}, (result) => {
//                  val.status = 4;
//                  val.name = "【已删除】" + val.name;
//                  val.username = val.uid;
//                  val.mobile = val.uid;
//              })
//          })
//         this.$Modal.confirm({
//           title: '提示',
//           content: '确定绕过主帐号权限，直接删除当前子账号？',
//           onOk: () =>{
            this.$axios({type: 'post', url: "/dabai-chaorenjob/company/deleteChildren", data: {uid: val.uid}, fuc: (result) => {
              this.$Message.success(result.msg)
              this.$start = 1
              this.getTableData()
            }, nowThis: this})
        //   }
        // })
      },
      getTableData() {
        this.$axios({type: 'get', url: "/dabai-chaorenjob/company/queryAllChildrenByCid?_limit=" + this.$limit + '&_start=' + this.$start, data: {cid: this.cid}, fuc: (result) => {
          this.tableData = result.data
        }, nowThis: this})
      },
      handleCurrentChange (val) {
        this.$handleCurrentChange(val, this.getTableData, this)
      }
    }
  }
</script>