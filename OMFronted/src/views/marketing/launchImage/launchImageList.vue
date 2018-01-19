<style lang="less">
</style>
<template>
<div id="table" class="content">
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
              title: '名称',
              key: 'name'
          },
          {
              title: '参数',
              key: 'param'
          },
          {
              title: '发布时间',
              key: 'create_time',
              render: (h, params) => {
                return h('span', {}, new Date(params.row.create_time).toLocaleString('chinese',{hour12:false}))
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
              key: 'update_name'
          },
          {
              title: '发布状态',
              key: 'status',
              render: (h, params) => {
                let name = '已开启'
                if (params.row.status == 0) {
                  name = '未开启'
                }
                return h('span', {}, name)
              }
          },
          {
              title: '操作',
              render: (h, params) => {
                let name = '开启'
                let fuc = this.openLaunchImage
                if (params.row.status == 1) {
                  name = '关闭'
                  fuc = this.closeLaunchImage
                }
                return h('div', [
                        h('Button', {
                          props: {
                            type: 'info',
                            size: 'small'
                          },
                          on: {
                            click: () => {
                              fuc(params.row)
                            }
                          }
                        }, name),
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
                        }, '编辑')
                      ])
              }
          }
        ],
        tableData: {}
      }
    },
    created () {
      this.getTableData()
    },
    methods: {
      goDetail (data) {
        console.log(data)
        this.$router.push({
          name: 'launchImage_detail',
          query: {lid: data.lid}
        })
      },
      openLaunchImage (data) {
        this.$axios({type: 'post', url: "/launchImage/startLaunchImage", data: {_start: this.$start, _limit: this.$limit, data: JSON.stringify({lid: data.lid})}, fuc: (result) => {
            this.getTableData()
            this.$Message.success('开启成功')
        }, nowThis: this})
      },
      closeLaunchImage (data) {
        this.$axios({type: 'post', url: "/launchImage/endLaunchImage", data: {_start: this.$start, _limit: this.$limit, data: JSON.stringify({lid: data.lid})}, fuc: (result) => {
            this.getTableData()
            this.$Message.success('关闭成功')
        }, nowThis: this})
      },
      getTableData() {
        this.$axios({type: 'post', url: "/launchImage/queryLaunchImage", data: {_start: this.$start, _limit: this.$limit}, fuc: (result) => {
            this.tableData = result.data;
          console.log(result)
        }, nowThis: this})
      },
      handleCurrentChange (val) {
        this.$handleCurrentChange(val, this.getTableData, this)
      }
    }
  }
</script>