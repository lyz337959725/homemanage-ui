<template>
  <el-card>
    <el-table stripe :data="tableData" style="width: 100%">
      <el-table-column label="序号" type="index"></el-table-column>
      <el-table-column prop="name" label="账簿名"></el-table-column>
      <el-table-column prop="creator" label="创建人"></el-table-column>
      <el-table-column prop="createDate" label="创建时间"></el-table-column>
      <el-table-column prop="updateDate" label="修改时间"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="book">
          <el-button-group>
            <el-button type="warning" size="small" icon="el-icon-edit"  @click="editBook(book.row)"></el-button>
            <el-button type="danger" size="small" icon="el-icon-delete" @click="deleteBook(book.row.id)"></el-button>
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>
    <el-button class="addBook" type="success" icon="el-icon-plus" circle @click="openAddDialog()"></el-button>
  </el-card>
</template>

<script>
export default {
  data () {
    return {
      tableData: [],
    }
  },
  created() {
    this.getBooks();
  },
  methods:{
    getBooks() {
      this.$axios
        .get("/bill/book")
        .then(response => {
          if (response.data.success) {
            this.tableData = response.data.data;
          }
        })
        .catch(() => {
          this.$message.error("响应失败");
        });
    },
    openAddDialog() {
      this.$prompt("请输入账簿名称", "新增账簿", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputPattern: /\S/,
        inputErrorMessage: "账簿名称不能空"
      }).then(({ value }) => {
        let addData = {
            name:value,
            creator:this.$store.state.userName
        }
        this.$axios
          .post("/bill/book", addData)
          .then(response => {
            if (response.data.success) {
              this.getBooks();
              this.$message.success(response.data.message);
            } else {
              this.$message.error("新增失败");
            }
          })
          .catch(() => {
            this.$message.error("响应失败");
          });
      });
    },
    editBook(book){
      this.$prompt("请输入修改后的账簿名称", "修改账簿", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputValue:book.name,
        inputValidator:(str)=>{
          if(str){
            if(str === book.name){
              return "账簿名称没有修改"
            }else{
              return true
            }
          }else{
            return "账簿名称不能空"
          }
        }
      }).then(({ value }) => {
        book.name = value
        this.$axios
          .put("/bill/book", book)
          .then(response => {
            if (response.data.success) {
              this.getBooks();
              this.$message.success(response.data.message);
            } else {
              this.$message.error("修改失败");
            }
          })
          .catch(() => {
            this.$message.error("响应失败");
          });
      })
    },
    deleteBook(id){
      this.$confirm('如删除该账簿，账簿下的流水记录也会随之删除, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$axios.delete(`/bill/book/${id}`).then(response => {
            if(response.data.success){
              this.getBooks();
              this.$message.success(response.data.message);
            }else{
              this.$message.error("删除失败");
            }
          })
        })
    },
  },
}
</script>

<style lang='less' scoped>
.el-card {
  position: relative;
  height: calc(100vh - 105px);

  .addBook {
    position: absolute;
    right: 20px;
    bottom: 20px;
  }
}
</style>
