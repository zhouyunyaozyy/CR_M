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
                <FormItem label='推送类型'>
                    <Select v-model="formInline.type" placeholder="推送类型">
                        <Option :label="item.name" :key="item.code" :value="item.code" v-for="item in localData.banner"></Option>
                        <Option label='所有' value=' '></Option>
                    </Select>
                </FormItem>
                <FormItem label='接收对象'>
                    <Select v-model="formInline.receive_type" placeholder="接收对象">
                        <Option :label="item.name" :key="item.code" :value="item.code" v-for="item in localData.receive_type"></Option>
                        <Option label='特定用户' value='1'></Option>
                        <Option label='所有' value=' '></Option>
                    </Select>
                </FormItem>
                <FormItem label='日期'>
                    <DatePicker v-model='formInline.time' type="daterange" split-panels placeholder="Select date" style="width: 200px"></DatePicker>
                </FormItem>
                <FormItem label='标题'>
                    <Input placeholder='请输入标题' v-model='formInline.title'></Input>
                </FormItem>
                <FormItem>
                    <Button @click='searchSure'>查询</Button>
                </FormItem>
            </Form>
        </div>
        <div class="table">
            <div>
                <span>消息列表</span>
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
    // name: 'appSystem',
    data () {
      return {
        formInline: {
          type: '',
          receive_type: '',
          title: '',
          time: []
        },
        formInlineData: {},
        columns: [
          {
            title: '消息类型',
            key: 'type',
            render: (h, params) => {
              let value = ''
              for (let val of this.localData.banner) {
                if (val.code == params.row.type) {
                  value = val.name
                }
              }
              return h('span', {}, value)
            }
          },
          {
            title: '接收对象',
            key: 'receive_type',
            render: (h, params) => {
              let value = ''
              // if (params.row.receive == 1) {
              //   value = '特定用户'
              // } else {
              //   for (let val of this.localData.receive_type) {
              //     console.log(val)
              //     if (val.code == params.row.receive) {
              //       value = val.name
              //     }
              //   }
              // }
              for (let val of this.localData.receive_type) {
                console.log(val)
                if (val.code == params.row.receive) {
                  value = val.name
                }
              }

              return h('span', {}, value)
            }
          },
          {
            title: '消息标题',
            key: 'title'
          },
          {
            title: '发送时间',
            key: 'create_time',
            render: (h, params) => {
              return h('span', {}, new Date(parseInt(params.row.create_time)).toLocaleString('chinese',{hour12:false}))
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
        currentPage: 1, // 当前页
        pageSize: 10, //每页条数
        total: 400, // 总数目
        tableData: {},
        localData: {}
      };
    },
    created () {
      this.localData = JSON.parse(window.sessionStorage.getItem('localData'))
      this.getTableData();
    },
    computed: {
    },
    watch: {
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
      detail(data) {
        console.log(data)
        this.$router.push({
          name: 'systemInforms_Detail',
          query: {nbid: data.nbid}
        })
      },
      handleSelectionChange(val) {
        console.log(val)
      },
      getTableData() {
        this.$axios({type: 'get', url: "/dabai-chaorenjob/notice/queryNotSystemList", data: {_start: this.$start, _limit: this.$limit}, fuc: (result) => {
            this.tableData = result.data;
          }, nowThis: this})
      },
      handleCurrentChange (val) {
        this.$handleCurrentChange(val, this.getTableData, this)
      }
    }
  };
</script>