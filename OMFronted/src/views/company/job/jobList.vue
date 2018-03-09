<template>
<div id="table" class="content">
    <div class="form">
        <div>
            <span>条件查询</span>
            <Button type="primary" size="small">清空</Button>
            <Button type="primary" size="small">查询</Button>
        </div>
        <Form :inline="true" :model="formInline" class="demo-form-inline">
            <FormItem label="审批人">
                <Input v-model="formInline.user" placeholder="审批人"></Input>
            </FormItem>
            <FormItem label="活动区域">
                <Select v-model="formInline.region" placeholder="活动区域">
                    <Option label="区域一" value="shanghai"></Option>
                    <Option label="区域二" value="beijing"></Option>
                </Select>
            </FormItem>
            <FormItem label="审批人">
                <Input v-model="formInline.user" placeholder="审批人"></Input>
            </FormItem>
            <FormItem label="活动区域">
                <Select v-model="formInline.region" placeholder="活动区域">
                    <Option label="区域一" value="shanghai"></Option>
                    <Option label="区域二" value="beijing"></Option>
                </Select>
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
                  if (params.row.status == 0) {
                    name = '未发布'
                  }
                  return h('span', {}, name)
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
      this.localData = JSON.parse(window.sessionStorage.getItem('localData'))
      this.getTableData();
    },
    methods: {
      getTableData() {
        this.$axios({type: 'post', url: "/company/getJobListOfCid", data: {_start: this.$start, _limit: this.$limit, data: JSON.stringify({cid: this.cid})}, fuc: (result) => {
          this.tableData = result.data
        }, nowThis: this})
      },
      handleCurrentChange (val) {
        this.$handleCurrentChange(val, this.getTableData, this)
      }
      
    }
  }
</script>