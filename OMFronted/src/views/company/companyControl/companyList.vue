<style lang="less">
</style>
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
    name: 'appSystem',
    data () {
        return {
          columns: [
              {
                  title: 'ID',
                  key: 'cid'
              },
              {
                  title: '简称',
                  key: 'name_short'
              },
              {
                  title: '全称',
                  key: 'name_full'
              },
              {
                  title: '公司地址',
                  key: 'address'
              },
              {
                  title: '创建时间',
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
                                  this.update(params.row)
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
                                  this.manager(params.row)
                                }
                              },
                              style: {
                                marginRight: '2px'
                              }
                            }, '主账号'),
                            h('Button', {
                              props: {
                                type: 'info',
                                size: 'small'
                              },
                              on: {
                                click: () => {
                                  this.children(params.row)
                                }
                              },
                              style: {
                                marginRight: '2px'
                              }
                            }, '子账号'),
                            h('Button', {
                              props: {
                                type: 'info',
                                size: 'small'
                              },
                              on: {
                                click: () => {
                                  this.jobList(params.row)
                                }
                              }
                            }, '职位')
                          ])
                   
                  }
              }
          ],
          formInline: {
              user: '',
              region: ''
          },
          pager: {
              currentPage: 1, // 当前页
              pageSize: 10, //每页条数
              total: 400, // 总数目
          },
          tableData: []
        };
    },
    computed: {
    },
    created () {
      this.getTableData();
    },
    methods: {
      onSubmit() {
          console.log('submit!');
      },
      handleSelectionChange(val) {
          console.log(val)
      },
      getTableData() {
        this.$axios({type: 'post', url: "/company/list", data: {_start: this.$start, _limit: this.$limit}, fuc: (result) => {
            this.tableData = result.data;
        }, nowThis: this})
      },
      update(data) {
          this.$router.push({
						name: 'company_Detail',
						query: {cid: data.cid}
          })
      },  // 查看基本信息
      manager(data) {
          this.$router.push({
						name: 'manager_detail',
						query: {cid: data.cid}
          })
      },
      children(data) {
        console.log(data)
          this.$router.push({
						name: 'children_list',
						query: {cid: data.cid}
          })
      },
      jobList(data) {
          this.$router.push({
						name: 'job_list',
						query: {cid: data.cid}
          })
      },
      handleCurrentChange (val) {
        this.$handleCurrentChange(val, this.getTableData, this)
      }
    }
};
</script>