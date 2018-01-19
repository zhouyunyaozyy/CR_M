<template>
<div id="table" class="content">
    <div class="form">
        <div>
            <span>条件查询</span>
            <Button type="primary" size="small">清空</Button>
            <Button type="primary" size="small">查询</Button>
        </div>
        <Form :inline="true" :model="searchForm" class="demo-form-inline">
            <FormItem label="审批人">
                <Input v-model="searchForm.user" placeholder="审批人"></Input>
            </FormItem>
            <FormItem label="活动区域">
                <Select v-model="searchForm.region" placeholder="活动区域">
                    <Option label="区域一" value="shanghai"></Option>
                    <Option label="区域二" value="beijing"></Option>
                </Select>
            </FormItem>
            <FormItem label="审批人">
                <Input v-model="searchForm.user" placeholder="审批人"></Input>
            </FormItem>
            <FormItem label="活动区域">
                <Select v-model="searchForm.region" placeholder="活动区域">
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
                title: '手机号',
                key: 'mobile'
            },
            {
                title: '姓名',
                key: 'name'
            },
            {
                title: '身份证',
                key: 'idno'
            },
            {
                title: '提审时间',
                key: 'create_time',
                render: (h, params) => {
                  return h('span', {}, new Date(parseInt(params.row.create_time) * 1000).toLocaleString('chinese', {hour12: false}))
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
                                this.detail(params.row)
                              }
                            },
                            style: {
                              marginRight: '2px'
                            }
                          }, '编辑')
                        ])

                }
            }
        ],
        searchForm: {},
        tabsData: {},
        tableData: {},
      
      }
    },
    created () {
      this.getTableData();
      
    },
    methods: {
      detail(data) {
        this.$router.push({
          name: 'auditManagement_detail',
          query: {uid: data.uid}
        })
      },
      search() {

      },
      clear() {
          this.searchForm = {};
      },
      getTableData() {
        this.$axios({type: 'post', url: "/customer/getUnAuditList", data: {_start: this.$start, _limit: this.$limit}, fuc: (result) => {
          this.tableData = result.data
        }, nowThis: this})
      },
      handleCurrentChange (val) {
        this.$handleCurrentChange(val, this.getTableData, this)
      }
      
    }
  }
</script>