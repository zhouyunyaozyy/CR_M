<style lang="css" scoped="true">
  .modal1 img{
    width: 30%;
    margin-right: 10px;
  }
</style>
<template>
  <div>
    <div class="table">
        <div>
            <span>hr反馈列表</span>
        </div>
        <Table
                :columns="columns" :data="tableData.data" stripe border
                style="width: 100%">
        </Table>
    </div>
    <Page
            :current="tableData.start"
            :page-size="tableData.pageSize"
            layout="total, prev, pager, next, jumper"
            :total="tableData.count"
            @on-change="handleCurrentChange">
    </Page>
    <Modal
        class='modal1'
        v-model="modal1"
        title="查看详情"
        @on-ok="ok"
        @on-cancel="ok">
        <p><label>内容：</label>{{modalData.content}}</p>
        <p v-if='modalData.images.length > 0'><label>图片：</label><img v-for='item in modalData.images' :src='item' @click='goBigImage(item)'></p>
    </Modal>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        modal1: false,
        modalData: {
          images: [],
          content: ''
        },
        columns: [
          {
            title: '用户id',
            key: 'uid'
          },
          {
            title: '内容',
            key: 'content'
          },
          {
            title: '状态',
            key: 'status',
            render: (h, params) => {
              let name = params.row.status ? '已处理' : '未处理'
              return h('span', {}, name)
            }
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
                      this.detail(params.row)
                    }
                  }
                }, '查看')
              ])
            }
          }
        ],
        tableData: {},
        localData: {}
      }
    },
    created () {
      this.getTableData();
      this.localData = JSON.parse(window.sessionStorage.getItem('localData'))
    },
    methods: {
      ok () {
        
      },
      goBigImage (url) {
        window.open(url)
      },
      detail (val) {
        console.log(val)
        this.$axios({type: 'post', url: "/feedback/detailFeedback", data: {data: JSON.stringify({fbid: val.fbid})}, fuc: (result) => {
          console.log(result)
          this.modalData.content = result.data.content
          this.modalData.images = result.data.imageUrl
          this.modal1 = true
          console.log(this.modalData)
        }, nowThis: this})
      },
      getTableData() {
        this.$axios({type: 'post', url: "/feedback/queryHrFeedback", data: {_start: this.$start, _limit: this.$limit}, fuc: (result) => {
            this.tableData = result.data;
        }, nowThis: this})
      },
      handleCurrentChange (val) {
        this.$handleCurrentChange(val, this.getTableData, this)
      }
    }
  }
</script>