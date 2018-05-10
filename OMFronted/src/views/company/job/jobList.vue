<template>
<div id="table" class="content">
    <div class="searchForm">
        <Form inline :model='formInline'>
            <FormItem label='日期'>
                <Select v-model='formInline.status'>
                    <Option value='0'>未查看</Option>
                    <Option value='1'>已查看</Option>
                    <Option value=' '>所有</Option>
                </Select>
            </FormItem>
            <FormItem>
                <Button @click='searchSure'>查询</Button>
            </FormItem>
        </Form>
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
<style>

    .searchForm .ivu-form-item-content{
        display: inline-block;
    }
    .searchForm{
        background-color: darkgrey;
        margin-bottom: 10px;
        padding: 10px;
    }
</style>
<script>
  export default {
    name: 'appSystem',
    data () {
      return {
        columns: [
            {
                title: '职位ID',
                key: 'jid'
            },
            {
                title: '职位名称',
                key: 'name'
            },
            {
                title: '学历要求',
                key: 'education',
                render: (h, params) => {
                  let name = ''
                  if (this.localData.education) {
                    for (let val of this.localData.education) {
                      if (val.code == params.row.education) {
                        name = val.name
                      }
                    }
                  }
                  return h('span', {}, name)
                }
            },
            {
                title: '工作地点',
                key: 'address',
                render: (h, params) => {
                  let name = ''
                  if (this.localData.area) {
                    for (let val of this.localData.area) {
                      if (val.code == ((params.row.address + '').substr(0, 2) + '0000')) {
                        for (let val2 of val.children) {
                          if (val2.code == params.row.address) {
                            name = val.name + val2.name
                          }
                        }
                      }
                    }
                  }
                  return h('span', {}, name)
                }
            },
            {
                title: '经验要求',
                key: 'work_experience',
                render: (h, params) => {
                  let name = ''
                  if (this.localData.jobExperience) {
                    for (let val of this.localData.jobExperience) {
                      if (val.code == params.row.work_experience) {
                        name = val.name
                      }
                    }
                  }
                  return h('span', {}, name)
                }
            },
            {
                title: '薪资范围',
                key: 'wages',
                render: (h, params) => {
                  let name = ''
                  if (this.localData.wages) {
                    for (let val of this.localData.wages) {
                      if (val.code == params.row.wages) {
                        name = val.name
                      }
                    }
                  }
                  return h('span', {}, name)
                }
            },
            {
                title: '招聘时间',
                key: 'start_time',
                render: (h, params) => {
                  return h('span', {}, new Date(params.row.start_time).toLocaleString('chinese',{hour12:false}).split(' ')[0] + '至' + new Date(params.row.end_time).toLocaleString('chinese',{hour12:false}).split(' ')[0])
                }
            },
            {
                title: '发布状态',
                key: 'status',
                render: (h, params) => {
                  let name = '已发布'
                  if (params.row.status == 2) {
                    name = '待发布'
                  } else if (params.row.status == 3) {
                    name = '招聘结束'
                  }
                  return h('span', {}, name)
                }
            }
        ],
        cid: '',
        formInline: {
          status: ''
        },
        tableData: {},
        localData: {}
      
      }
    },
    created () {
      this.cid = this.$route.query.cid
      this.localData = JSON.parse(window.sessionStorage.getItem('localData'))
      this.getTableData();
    },
    methods: {
      getTableData() {
        this.$axios({type: 'get', url: "/dabai-chaorenjob/job/queryAllJobListByCid", data: {_start: this.$start, _limit: this.$limit, cid: this.cid}, fuc: (result) => {
          this.tableData = result.data
        }, nowThis: this})
      },
      handleCurrentChange (val) {
        this.$handleCurrentChange(val, this.getTableData, this)
      }
      
    }
  }
</script>