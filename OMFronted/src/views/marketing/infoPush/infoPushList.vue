<style lang="less">
</style>
<template>
<div id="table" class="content">
    <div class="form">
        <div>
            <span>条件查询</span>
            <Button type="primary" size="small" @click="clear">清空</Button>
            <Button type="primary" size="small" @click="search">查询</Button>
        </div>
        <Form :inline="true" :model="searchForm" class="demo-form-inline">
            <FormItem label="标题">
                <Input v-model="searchForm.title" placeholder="标题"></Input>
            </FormItem>
            <FormItem label="类型">
                <Select v-model="searchForm.type" placeholder="推送类型">
                    <Option :label="item.name" :key="item.code" :value="item.code" v-for="item in localData.banner"></Option>
                </Select>
            </FormItem>
            <FormItem label="接收类型">
                <Select v-model="searchForm.receive_type" placeholder="接收类型">
                    <Option :value="item.code" :key="item.code" v-for="item in localData.receive_type">{{item.name}}</Option>
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
    <Page
            :current="tableData.start"
            :page-size="tableData.pageSize"
            layout="total, prev, pager, next, jumper"
            :total="tableData.count"
            @on-change="handleCurrentChange">
    </Page>
</div>
</template>

<script>
import Cookies from 'js-cookie';
  
export default {
    name: 'appSystem',
    data () {
        return {
          columns: [
              {
                  title: '类型',
                  key: 'type'
              },
              {
                  title: '接收类型',
                  key: 'receive_type'
              },
              {
                  title: '标题',
                  key: 'title'
              },
              {
                  title: '发送时间',
                  key: 'create_time',
                  render: (h, params) => {
                    return h('span', {}, new Date(params.row.create_time).toLocaleString('chinese',{hour12:false}))
                  }
              },
              {
                  title: '发送人',
                  key: 'create_name'
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
                        }
                      }, '查看详情')
                    ])
                  }
              }
          ],
          searchForm: {},
          currentPage: 1, // 当前页
          pageSize: 10, //每页条数
          total: 400, // 总数目
          tableData: {},
          localData: {}
        };
    },
    created () {
        this.getTableData();
        this.$axios({type: 'get', url: '/common/configJson', fuc: (res) => {
          this.localData = res.data
        }, nowThis: this})
    },
    computed: {
    },
    watch: {
    },
    methods: {
        search() {
            this.getTableData();
        },
        clear() {
            this.searchForm = {};
            this.getTableData();
        },
        detail(data) {
          console.log(data)
          this.$router.push({
            name: 'infoPush_Detail',
            query: {pid: data.pid}
          })
        },
        handleSelectionChange(val) {
            console.log(val)
        },
        getTableData() {
          this.$axios({type: 'post', url: "/marketing/pushList", data: {_start: this.$start, _limit: this.$limit, data: JSON.stringify(this.searchForm)}, fuc: (result) => {
              this.tableData = result.data;
          }, nowThis: this})
        },
        handleCurrentChange (val) {
          this.$handleCurrentChange(val, this.getTableData, this)
        }
    }
};
</script>