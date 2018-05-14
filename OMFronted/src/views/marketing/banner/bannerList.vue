<style lang="less">
</style>
<template>
<div id="table" class="content">
    <div class="form">
        <div>
            <span>条件查询</span>
            <Button type="primary" size="small" @click="onSubmit">清空</Button>
            <Button type="primary" size="small" @click="onSubmit">查询</Button>
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
                style="width: 100%" @selection-change="handleSelectionChange">
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
                  title: '类型',
                  key: 'type',
                  render: (h, params) => {
                    let name = ''
                    if (this.localData.banner) {
                      for (let val of this.localData.banner) {
                        if (val.code == params.row.type) {
                          name = val.name
                        }
                      }
                    }
                    return h('span', {}, name)
                  }
              },
              {
                  title: '标题',
                  key: 'title'
              },
              {
                  title: '发送时间',
                  key: 'create_time',
                  render: (h, params) => {
                    return h('span', {}, new Date(parseInt(params.row.modify_time)).toLocaleString('chinese',{hour12:false}))
                  }
              },
              {
                  title: '发送人',
                  key: 'create_name'
              },
              {
                  title: '状态',
                  key: 'status',
                  render: (h, params) => {
                    let name = '启用'
                    if (params.row.status == 0) {
                      name = '禁用'
                    }
                    return h('span', [
                      h('span', {}, name)
                    ])
                  }
              },
              {
                  title: '操作',
                  render: (h, params) => {
                    let name = '下架'
                    let fucName = this.disableBanner
                    if (params.row.status == 0) {
                      name = '上架'
                      fucName = this.activateBanner
                    }
                    return h('div', [
                      h('Button', {
                        props: {
                          type: 'info',
                          size: 'small'
                        },
                        on: {
                          click: () => {
                            this.editBanner(params.row)
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
                            fucName(params.row)
                          }
                        }
                      }, name)
                    ])
                  }
              }
          ],
          formInline: {
              user: '',
              region: ''
          },
          tableData: {},
          localData: {}
        };
    },
    computed: {
    },
    mounted () {
      this.getTableData();
    },
    created () {
      this.localData = JSON.parse(window.sessionStorage.getItem('localData'))
    },
    methods: {
      onSubmit() {
          console.log('submit!');
      },
      activateBanner(val) {
          this.$axios({type: 'post', url: "/dabai-chaorenjob/banner/updateBannerStatusIssue", data: {bid: val.bid}, fuc: (result) => {
            this.$Message.success(result.msg)
            this.getTableData()
          }, nowThis: this})
      },
      disableBanner(val) {
          this.$axios({type: 'post', url: "/dabai-chaorenjob/banner/updateBannerStatusNotIssue", data: {bid: val.bid}, fuc: (result) => {
            this.$Message.success(result.msg)
            this.getTableData()

          }, nowThis: this})
      },
      editBanner(val) {
        console.log(val)
          this.$router.push({
            name: 'banner_Detail',
            query: {bid: val.bid}
          })
      },
      handleSelectionChange(val) {
          console.log(val)
      },
      getTableData() {
        this.$axios({type: 'get', url: "/dabai-chaorenjob/banner/getAllBanner", data: {_start: this.$start, _limit: this.$limit}, fuc: (result) => {
            this.tableData = result.data;
        }, nowThis: this})
      },
      handleCurrentChange (val) {
        this.$handleCurrentChange(val, this.getTableData, this)
      }
    }
};
</script>