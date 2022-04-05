<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.form.userId" placeholder="用户ID" style="width: 360px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.form._openid" placeholder="openid" style="width: 360px;margin-left:10px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button v-waves class="filter-item" style="margin-left:10px;" type="primary" icon="el-icon-search" @click="handleFilter">
        查询
      </el-button>
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column label="ID" prop="id" align="center" width="300">
        <template slot-scope="{row}">
          <span>{{ row._id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="用户ID" prop="userId" align="center" width="300">
        <template slot-scope="{row}">
          <span>{{ row.userId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="openId" prop="_openid" align="center" width="260">
        <template slot-scope="{row}">
          <span>{{ row._openid }}</span>
        </template>
      </el-table-column>
      <el-table-column label="时间" prop="time" align="center" width="180">
        <template slot-scope="{row}">
          <span>{{ row.time }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="180" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" @click="handleFl(row)">
            返利
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <!--- 返利操作 -->
    <el-dialog :title="返利" :visible.sync="sendFormVisible">
      <el-form ref="flForm" :rules="rules" :model="temp" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">
        <el-form-item label="订单号" prop="no">
          <el-input v-model="temp.no" />
        </el-form-item>
        <el-form-item label="用户ID" prop="userId">
          <el-input v-model="temp.userId" />
        </el-form-item>
        <el-form-item label="金额(元)" prop="amount">
          <el-input v-model="temp.amount" />
        </el-form-item>
        <el-form-item label="返利(分)" prop="fl">
          <el-input v-model="temp.fl" />
        </el-form-item>
        <el-form-item label="消息说明(中文)" prop="source">
          <el-input v-model="temp.source" value="返利"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="sendFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="flSend()">
          确认
        </el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { getList,sendFl } from '@/api/log'
import Pagination from '@/components/Pagination'
import {updateArticle} from "@/api/article"; // secondary package based on el-pagination

export default {
  name: 'ComplexTable',
  components: { Pagination },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: false,
      listQuery: {
        page: 1,
        limit: 10,
        form: {
          _openid: undefined,
          userId: undefined
        }
      },
      temp:{
        no: undefined,
        userId: '',
        amount: undefined,
        fl: undefined,
        source: '返利'
      },
      sendFormVisible: false
    }
  },
  // created() {
  //   //页面初始化方法
  //   this.getList()
  // },
  methods: {
    getList() {
      this.listLoading = true
      getList(this.listQuery).then(response => {
        this.list = response.data.items
        this.total = response.data.total

        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleFl(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.temp.source = '返利'
      this.sendFormVisible = true
      this.$nextTick(() => {
        this.$refs['flForm'].clearValidate()
      })
    },
    flSend() {
      this.$refs['flForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          sendFl(tempData).then(() => {
            this.sendFormVisible = false
            this.$notify({
              title: 'Success',
              message: '发送成',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
  }
}
</script>
