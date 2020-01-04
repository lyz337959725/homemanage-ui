<template>
  <el-card>
    <el-table stripe :data="tableData" style="width: 100%">
      <el-table-column label="序号" type="index"></el-table-column>
      <el-table-column prop="name" label="人员姓名"></el-table-column>
      <el-table-column prop="creator" label="创建人"></el-table-column>
      <el-table-column prop="createDate" label="创建时间"></el-table-column>
      <el-table-column prop="updateDate" label="修改时间"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="person">
          <el-button-group>
            <el-button type="warning" size="small" icon="el-icon-edit"  @click="editPerson(person.row)"></el-button>
            <el-button type="danger" size="small" icon="el-icon-delete" @click="deletePerson(person.row.id)"></el-button>
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>
    <el-button class="addPerson" type="success" icon="el-icon-plus" circle @click="openAddDialog()"></el-button>
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
    this.getPersons();
  },
  methods:{
    getPersons() {
      this.$axios
        .get("/bill/person")
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
      this.$prompt("请输入人员姓名", "新增人员", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputPattern: /\S/,
        inputErrorMessage: "人员姓名不能空"
      }).then(({ value }) => {
        let addData = {
            name:value,
            creator:this.$store.state.userName
        }
        this.$axios
          .post("/bill/person", addData)
          .then(response => {
            if (response.data.success) {
              this.getPersons();
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
    editPerson(person){
      this.$prompt("请输入修改后的人员姓名", "修改人员", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputValue:person.name,
        inputValidator:(str)=>{
          if(str){
            if(str === person.name){
              return "人员姓名没有修改"
            }else{
              return true
            }
          }else{
            return "人员姓名不能空"
          }
        }
      }).then(({ value }) => {
        person.name = value
        this.$axios
          .put("/bill/person", person)
          .then(response => {
            if (response.data.success) {
              this.getPersons();
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
    deletePerson(id){
      this.$confirm(', 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$axios.delete(`/bill/person/${id}`).then(response => {
            if(response.data.success){
              this.getPersons();
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

  .addPerson {
    position: absolute;
    right: 20px;
    bottom: 20px;
  }
}
</style>
