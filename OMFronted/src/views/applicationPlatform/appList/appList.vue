<style lang="less" scoped="true">
  .content>button{
    margin-bottom: 15px;
  }
</style>
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
        <FormItem label='用户状态'>
          <Select v-model="formInline.status" placeholder="用户状态">
            <Option label='正常' value='1'></Option>
            <Option label='冻结' value='3'></Option>
            <Option label='所有' value=' '></Option>
          </Select>
        </FormItem>
        <FormItem label='实名认证'>
          <Select v-model="formInline.cert" placeholder="实名认证">
            <Option label='是' value='1'></Option>
            <Option label='否' value='0'></Option>
            <Option label='所有' value=' '></Option>
          </Select>
        </FormItem>
        <FormItem label='日期'>
          <DatePicker v-model='formInline.time' type="daterange" split-panels placeholder="Select date" style="width: 200px"></DatePicker>
        </FormItem>
        <FormItem label='查找条件'>
          <Input placeholder='手机号/姓名' v-model='formInline.name'></Input>
        </FormItem>
        <FormItem label=''>
          <Input placeholder='ID' v-model='formInline.uid' :maxlength='20'></Input>
        </FormItem>
        <FormItem>
          <Button @click='searchSure'>查询</Button>
        </FormItem>
      </Form>
    </div>
    <Button @click="modal1 = true">推送</Button>
    <Button @click="doSomeThingToApp(1)">冻结</Button>
    <Button @click="doSomeThingToApp(0)">解冻</Button>
    <div class="table">
        <Table
                 ref="selection" @on-selection-change='selectionChange' :columns="columns" :data="tableData.data" stripe border ellipsis='true'
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
    <Modal v-model="modal1"
        title="新建推送给用户"
        @on-ok="modalOk"
        @on-cancel="modalCancel">
        <Form ref="form" :model="form" :rules="rules" :label-width=80>
          <Row>
              <Col :span="24">
                  <FormItem label="推送类型" prop="type">
                      <Select v-model="form.type" placeholder="请选择推送类型">
                          <Option :label="item.name" :value="item.code" :key="item.code" v-for="item in localData.banner"></Option>
                      </Select>
                  </FormItem>
                  <FormItem label="标题名称" prop="title">
                      <Input :maxlength="12" v-model="form.title" placeholder="请输入标题"></Input>
                  </FormItem>
                  <FormItem label="推送简介" prop="profile">
                      <Input :maxlength="15" v-model="form.profile" placeholder="请输入推送简介"></Input>
                  </FormItem>
                  <FormItem label="推送内容" prop="args">
                      <Input :maxlength="100" v-model="form.args" type="textarea" placeholder="请输入参数"></Input>
                  </FormItem>
              </Col>
          </Row>
      </Form>
    </Modal>
</div>
</template>

<script>

export default {
    name: 'appSystem',
    data () {
        return {
          modal1: false,
          rules: {
              type: [{required: true, message: '请选择类型', trigger: 'change'}],
              // param: [{required: true, message: '请输入参数', trigger: 'blur'},],
              title: [{required: true, message: '请输入标题', trigger: 'blur'},],
              receive_type: [{required: true, message: '请选择接收类型', trigger: 'change'}],
              receive: [{required: true, message: '请输入接收对象', trigger: 'blur'},]
          },
          form: {
              type: '',
              args: '',
              title: '',
              profile: '',
              receive: '',
              receive_type: '1'
          },
          formInline: {
            uid: '',
            name: '',
            cert: '',
            status: '',
            time: []
          },
          formInlineData: {},
          localData: {},
          columns: [
              {
                  title: '全选',
                  type: 'selection',
                  width: 50
              },
              {
                  title: 'ID',
                  key: 'uid'
              },
              {
                  title: '姓名',
                  key: 'name'
              },
              {
                  title: '手机号',
                  key: 'mobile'
              },
              {
                  title: '角色',
                  key: 'name',
                  render: (h, params) => {
                    return h('span', {}, '普通用户')
                  }
              },
              {
                  title: '用户状态',
                  key: 'status',
                  render: (h, params) => {
                    let name = ''
                    if (params.row.status == 1) {
                      name = '正常'
                    } else if (params.row.status == 3){
                      name = '禁用'
                    } else if (params.row.status == 4){
                      name = '删除'
                    }
                    return h('span', {}, name)
                  }
              },
              {
                  title: '设备类型',
                  key: 'app'
              },
              {
                  title: '实名认证',
                  key: 'cert_status',
                  render: (h, params) => {
                    let name = ''
                    if (params.row.cert_status == 1) {
                      name = '已提交'
                    } else if (params.row.cert_status == 4){
                      name = '已认证'
                    } else if (params.row.cert_status == 8){
                      name = '认证失败'
                    } else {
                      name = '未认证'
                    }
                    return h('span', {}, name)
                  }
              },
              {
                  title: '创建时间',
                  key: 'create_time',
                  render: (h, params) => {
                    return h('span', {}, new Date(params.row.create_time).toLocaleString('chinese',{hour12:false}))
                  }
              }
//              {
//                  title: '操作',
//                  render: (h, params) => {
//                    return h('div', [
//                      h('Button', {
//                        props: {
//                          type: 'info',
//                          size: 'small'
//                        },
//                        on: {
//                          click: () => {
//                            this.goDetail(params.row)
//                          }
//                        }
//                      }, '查看'),
//                      h('Button', {
//                        props: {
//                          type: 'info',
//                          size: 'small'
//                        },
//                        on: {
//                          click: () => {
//                            this.editTheme(params.row)
//                          }
//                        }
//                      }, '编辑'),
//                      h('Button', {
//                        props: {
//                          type: 'info',
//                          size: 'small'
//                        },
//                        on: {
//                          click: () => {
//                            this.removeTheme(params.row)
//                          }
//                        }
//                      }, '删除')
//                    ])
//                  }
//              }
          ],
          tableData: {},
          selectedData: []
        };
    },
    computed: {
    },
    created () {
      this.getTableData();
      this.localData = JSON.parse(window.sessionStorage.getItem('localData'))
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
          } else if (val == 'uid') {
            console.log(this.formInline[val].replace(/[^1-9]/g, ''))
            if (this.formInline[val].replace(/[^1-9]/g, '').length > 0) {
              this.formInlineData[val] = this.formInline[val] = this.formInline[val].replace(/[^1-9]/g, '')
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
      doSomeThingToApp (num) {
        if (this.selectedData.length == 0) {
          this.$Message.error('请先选择用户')
          return
        }
        let title = num == 1 ? '冻结' : '解冻'
        let name = []
        let arr = []
        for (let val of this.selectedData) {
          arr.push(val.uid)
          name.push(val.name)
        }
        this.$Modal.confirm({
          title: '提示',
          content: '确认' + title + ' [' + name.join(',') + '] ' + '吗？',
          onOk: () => {
            this.$axios({type: 'post', url: num == 1 ? '/customer/iceUser' : '/customer/unIceUser', data: {data: JSON.stringify({uid: arr.join(',')})}, fuc: (result) => {
              if (result.code == 1) {
                this.$Message.success(result.msg)
                this.getTableData()
              }
            }, nowThis: this})
          }
        })
      },
      modalOk () {
        console.log(this.selectedData)
        if (this.selectedData.length == 0) {
          this.$Message.error('请先选择用户')
          return
        }
        if (!this.form.type || !this.form.title || !this.form.profile || !this.form.args) {
          this.$Message.error('请先完善推送内容')
          return
        }
        let _form = JSON.parse(JSON.stringify(this.form))
        let arr = []
        for (let val of this.selectedData) {
          arr.push(val.uid)
        }
        _form.receive = arr.join(',')
        this.$axios({type: 'post', url: '/marketing/addPush', data: {data: JSON.stringify(_form)}, fuc: (result) => {
          if (result.code == 1) {
            this.$Message.success(result.msg)
            this.form.type = ''
            this.form.args = ''
            this.form.title = ''
            this.form.profile = ''
            this.form.receive = ''
          }
        }, nowThis: this})
      },
      modalCancel () {
        this.$refs['form'].resetFields();
      },
      selectionChange (val) {
        this.selectedData = val
      },
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
            if (!this.form.name || !this.form.sort || isNaN(Number(this.form.sort)) || this.form.sort.indexOf(',') > -1) {
              this.$Notice.warning({
                title: '错误',
                desc: '错误输入信息,请重新添加'
            });
              return false
            }
            let url = this.form.ntid === 0 ? '/news/addNewsTheme' : '/news/updateNewTheme'
            this.$axios({type: 'post', url: url, data: {data: JSON.stringify(this.form)}, fuc: (result) => {
              if (result.code == 1) {
                this.form.name = ''
                this.form.sort = ''
                this.form.ntid = 0
                this.getTableData()
                this.$Message.success(result.msg)
              }
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
        this.$axios({type: 'post', url: "/customer/queryAllUser", data: {_start: this.$start, _limit: this.$limit, data: JSON.stringify(this.formInlineData)}, fuc: (result) => {
          console.log(result)
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
        this.$Modal.confirm({
          title: '提示',
          content: '确认删除[' + val.name + ']栏目(栏目内的文章将同步删除)',
          onOk: () => {
            if (this.tableData.count > 1 && this.tableData.count % this.tableData.pageSize == 1) {
              this.$start-- 
            }
            this.$axios({type: 'post', url: "/news/deleteNewsTheme", data: {data: JSON.stringify({ntid: val.ntid})}, fuc: (result) => {
              this.$Message.success('删除成功')
              this.getTableData()
            }, nowThis: this})
          }
        })
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