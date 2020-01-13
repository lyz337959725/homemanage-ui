<template>
  <el-card>
    <el-alert
      v-show="!queryForm.book"
      title="关于流水详情的说明"
      type="warning"
      center
      description="查看流水明细前，请先选择账簿！"
      show-icon
    ></el-alert>
    <el-form :inline="true" :model="queryForm" class="demo-form-inline">
      <el-form-item  style="width:10%">
        <el-cascader
          clearable
          :props="typeListProps"
          placeholder="分类"
          :options="typeList"
          :show-all-levels="false"
          size="small"
          @change="handleTypeChange"
        ></el-cascader>
      </el-form-item>
      <el-form-item style="width:10%">
        <el-select  clearable v-model="queryForm.person" placeholder="所属人" size="small">
          <el-option v-for="item in personList" :label="item.name" :value="item.id" :key="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-input v-model="queryForm.word" placeholder="用途关键字" size="small"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="small" @click="searchBill">查询</el-button>
        <el-button v-show="queryForm.book" type="success" icon="el-icon-plus" size="small" @click="showAddBillDialog()">新增</el-button>
      </el-form-item>
      <el-form-item class="chosePlatform" label="账簿">
        <el-select
          v-model="queryForm.book"
          size="small"
          @change="handleBookChange"
        >
          <el-option v-for="item in bookList" :label="item.name" :value="item.id" :key="item.id"></el-option>
        </el-select>
      </el-form-item>
    </el-form>

    <el-table stripe :data="tableData" style="width: 100%">
      <el-table-column label="序号" type="index"></el-table-column>
      <el-table-column prop="content" label="用途"></el-table-column>
      <el-table-column prop="typeName" label="分类"></el-table-column>
      <el-table-column prop="spend" label="金额"></el-table-column>
      <el-table-column prop="personName" label="所属人"></el-table-column>
      <el-table-column prop="spendDate" label="日期"></el-table-column>
      <el-table-column
       label="收支"
       :filters="[{ text: '收入', value: 'true' }, { text: '支出', value: 'false' }]"
       :filter-method="filterTag">
        <template slot-scope="bill">
          <el-tag v-if="bill.row.income" type="success">收入</el-tag>
          <el-tag v-else type="danger">支出</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="bill">
          <el-button-group>
            <el-button type="warning" size="small" icon="el-icon-edit" @click="showAddBillDialog('edit',bill.row.id)"></el-button>
            <el-button
              type="danger"
              size="small"
              icon="el-icon-delete"
              @click="deleteBill(bill.row.id)"
            ></el-button>
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      layout="total, prev, pager, next"
      :hide-on-single-page="!tableTotal<tablePageSize"
      :total="tableTotal"
      :page-size="tablePageSize"
      @current-change="handleCurrentChange"
    ></el-pagination>

    <!-- 增加流水弹框 -->
    <el-dialog
      title="新增流水"
      :visible.sync="addBillDialog"
      width="35%"
      @close="closeAddBillFormDialog"
    >
      <el-form :model="addBillForm" ref="addBillForm" label-position="right" :rules="addBillRules">
        <el-form-item>
          <el-switch
            style="display: block;margin-left:10%"
            v-model="addBillForm.income"
            active-color="#13ce66"
            inactive-color="#ff4949"
            active-text="收入"
            inactive-text="支出"
            active-value="true"
            inactive-value="false"
          ></el-switch>
        </el-form-item>
        <el-form-item label="分类" label-width="20%" prop="typeId">
          <el-cascader
            v-model="addBillForm.typeId"
            :props="typeListProps"
            :options="typeList"
            :show-all-levels="false"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="金额(元)" label-width="20%" prop="spend">
          <el-input type="number" v-model="addBillForm.spend" style="width: 50%;"></el-input>
        </el-form-item>
        <el-form-item label="消费日期" label-width="20%" prop="spendDate">
          <el-date-picker
            type="date"
            format="yyyy 年 MM 月 dd 日"
            value-format="yyyy-MM-dd"
            v-model="addBillForm.spendDate"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="所属人" label-width="20%">
          <el-select v-model="addBillForm.personId">
            <el-option
              clearable
              v-for="item in personList"
              :label="item.name"
              :value="item.id"
              :key="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="用途描述" label-width="20%" prop="content">
          <el-input type="textarea" v-model="addBillForm.content"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addBillDialog = false">取 消</el-button>
        <el-button type="primary" @click="addBill">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      bookList: [],
      typeList: [],
      typeListProps: {
        value: "id",
        label: "name",
        children: "children"
      },

      personList: [],
      queryForm: {
        word: "",
        person: "",
        type: "",
        book: "",
        size: 10,
        page: 0
      },
      tableData: [],
      tableTotal: 0,//总记录数
      tablePageSize: 10,
      tableCurrentPage: 0,
      addBillDialog: false,
      addBillForm: {
        income: "false",
        typeId: "",
        spend: "",
        spendDate: new Date(),
        content: "",
        personId: ""
      },
      addBillRules: {
        typeId: [{ required: true, message: "类型不能为空" }],
        spend: [{ required: true, message: "金额不能为空" }],
        spendDate: [{ required: true, message: "消费日期不能为空" }],
        content: [{ required: true, message: "描述不能为空" }]
      }
    };
  },
  created() {
    this.$axios
      .all([
        this.$axios.get("/bill/book"),
        this.$axios.get("/bill/type"),
        this.$axios.get("/bill/person")
      ])
      .then(
        this.$axios.spread((bookResp, typeResp, personResp) => {
          if (bookResp.data.success) {
            this.bookList = bookResp.data.data;
          }
          if (typeResp.data.success) {
            this.typeList = typeResp.data.data;
          }
          if (personResp.data.success) {
            this.personList = personResp.data.data;
          }
        })
      );
    if(localStorage.getItem("bookId")){
      this.queryForm.book = parseInt(localStorage.getItem("bookId"))
      this.getBillListByBook()
    }
  },
  methods: {
    getBillListByBook() {
      this.$axios.post(`/bill/bills`, this.queryForm).then(response => {
        this.tableData = response.data.data.data;
        this.tableTotal = response.data.data.total;
        window.console.log(response);
      });
    },
    searchBill(){
      this.getBillListByBook()
    },
    addBill() {
      this.$refs.addBillForm.validate(valid => {
        if (valid) {
          if(this.addBillForm.typeId instanceof Array){
            this.addBillForm.typeId = this.addBillForm.typeId[
              this.addBillForm.typeId.length - 1
            ];
          }
          this.addBillForm["creator"] = this.$store.state.userName;
          this.addBillForm["bookId"] = this.queryForm.book;
          this.$axios.post(`/bill`, this.addBillForm).then(response => {
            if (response.data.success) {
              this.getBillListByBook();
              this.$message.success(response.data.message);
              this.addBillDialog = false;
            } else {
              this.$message.error("新增失败");
            }
          });
        } else {
          return;
        }
      });
    },
    deleteBill(id){
        this.$confirm('确定要删除该条记录吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$axios.delete(`/bill/${id}`).then(response => {
            if(response.data.success){
              this.getBillListByBook();
              this.$message.success(response.data.message);
            }else{
              this.$message.error("删除失败");
            }
          })
        })
    },
    handleCurrentChange(page){
      this.queryForm.page = page-1
      this.getBillListByBook();
    },
    handleTypeChange(typeArr){
      this.queryForm.type = typeArr[typeArr.length - 1];
    },
    handleBookChange(bookId){
      localStorage.setItem("bookId",bookId)
      this.getBillListByBook();
    },
    showAddBillDialog(opt,id){
      if(opt === 'edit'){
        this.$axios.get(`/bill/${id}`).then(response => {
          if(response.data.success){
            this.addBillForm = response.data.data
            this.addBillForm.income = this.addBillForm.income.toString()
          }else{
            this.$message.error(response.data.message);
          }
        })
      }
      this.addBillDialog = true
    },
    closeAddBillFormDialog() {
      this.$refs.addBillForm.resetFields();
    },
    filterTag(value, row) {
      return row.income.toString() === value;
    },
  }
};
</script>

<style lang='less' scoped>
.el-card {
  position: relative;
  height: calc(100vh - 105px);
  overflow: auto;

  .chosePlatform {
    float: right;

    .el-input__inner {
      background-color: #909399 !important;
    }
  }
}
</style>
