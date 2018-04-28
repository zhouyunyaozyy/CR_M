<style lang="less" scoped>
.el-pagination {
    text-align: center;
    margin-top: 0px;
    bottom: 0;
    left: 0;
    right: 0;
}

.form {
    width: 100%;
}

.form > div {
    width: 100%;
    overflow: hidden;
    min-height: 40px;
    border-radius: 3px;
    background-color: #99a9bf;
    margin-bottom: 10px;
}

.form > div > span {
    margin: 10px 0 0 10px;
    display: inline-block;
}

.form > div > button {
    float: right;
    margin-top: 5px;
    margin-right: 10px;
}

.form > form {
    padding: 3px 3px 3px 10px;
    height: 40px;
    margin: 5px 0;
    /*    border: 1px solid lightgrey;*/
}

.table {
    width: 100%;
    /*    min-width: 1200px;*/
    /*    border: 1px solid lightgrey;*/
    /*    margin: 6px;*/
}

.table > div:first-child {
    width: 100%;
    overflow: hidden;
    min-height: 40px;
    background-color: #99a9bf;
    margin-bottom: 10px;
    border-radius: 3px;
}

.table > div:last-child {
    /*    margin: 6px;*/
}

.table > div > span {
    margin: 10px 0 0 10px;
    display: inline-block;
}

.table > div > button {
    float: right;
    margin-top: 5px;
    margin-right: 10px;
}
</style>
<template>
  <div>
    <div class="form">
        <div>
            <span>条件查询</span>
            <Button type="primary" size="small" @click="onSubmit">清空</Button>
            <Button type="primary" size="small" @click="onSubmit">查询</Button>
        </div>
        <Form inline :model="formInline" class="demo-form-inline" :label-width=60>
            <FormItem  label="审批人">
                <Input v-model="formInline.user" placeholder="审批人"></Input>
            </FormItem >
            <FormItem  label="活动区域">
                <Select v-model="formInline.region" placeholder="活动区域">
                    <Option label="区域一" value="shanghai"></Option>
                    <Option label="区域二" value="beijing"></Option>
                </Select>
            </FormItem >
            <FormItem  label="审批人">
                <Input v-model="formInline.user" placeholder="审批人"></Input>
            </FormItem >
            <FormItem  label="活动区域">
                <Select v-model="formInline.region" placeholder="活动区域">
                    <Option label="区域一" value="shanghai"></Option>
                    <Option label="区域二" value="beijing"></Option>
                </Select>
            </FormItem >
        </Form>
    </div>

    <div class="table">
        <div>
            <span>用户列表</span>
            <!--<el-button type="primary" size="small" @click="onSubmit">导出</el-button>-->
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
import Cookies from 'js-cookie';

export default {
    name: 'appSystemList',
    data () {
        return {
          columns: [
              {
                  title: '标题',
                  key: 'title'
              },
              {
                  title: '平台',
                  key: 'app',
                  render: (h, params) => {
                    let name = '安卓'
                    if (params.row.app == 1) {
                      name = '苹果'
                    }
                    return h('span', {}, name)
                  }
              },
              {
                  title: '内部版本',
                  key: 'innerversion'
              },
              {
                  title: '强制更新',
                  key: 'update',
                render: (h, params) => {
                  return h('span', {}, params.row.update == 0 ? '否' : '是')
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
                  title: '发布状态',
                  key: 'status'
              },
              {
                  title: '操作',
                  render: (h, params) => {
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
                            this.sureIssue(params.row)
                          }
                        }
                      }, '发布'),
                      h('Button', {
                        props: {
                          type: 'error',
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
          formInline: {
              user: '',
              region: ''
          },
          currentPage: 1, // 当前页
          pageSize: 10, //每页条数
          total: 400, // 总数目
          tableData: {}
        };
    },
    computed: {
    },
    methods: {
      onSubmit() {
          console.log('submit!');
      },
      handleSelectionChange(val) {
          console.log(val)
      },
      getTableData() {
          this.$axios({type: 'get', url: "/dabai-chaorenjob/version/versionList",data: {_start: this.$start, _limit: this.$limit}, fuc: (result) => {
              console.log(result)
              this.tableData = result.data;
          }, nowThis: this})
      },
      detail(data) {
          console.log(data)
          let query = {vid: data.vid};
          this.$router.push({
              name: 'appSystem_Detail',
              query: query
          });
      },
      sureIssue(data) {
          this.$axios({type: 'post', url: "/version/versionList",data:{vid: data.vid}, fuc: (result) => {
              data.status = 1;
              this.$Message.success(result.msg)

          }, nowThis: this})
      },
      handleCurrentChange (val) {
        this.$handleCurrentChange(val, this.getTableData, this)
      }
    },
    mounted: function () {
        this.getTableData();
    }
};
</script>
