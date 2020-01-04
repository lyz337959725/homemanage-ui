
<template>
  <el-card>
    <el-table stripe :data="tableData" style="width: 100%">
      <el-table-column label="序号" type="index"></el-table-column>
      <el-table-column prop="name" label="用户名"></el-table-column>
      <el-table-column prop="createDate" label="创建时间"></el-table-column>
      <el-table-column prop="updateDate" label="修改时间"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="user">
          <el-button-group>
            <el-button type="danger" size="small" icon="el-icon-delete" @click="deleteUser(user.row.id)"></el-button>
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>
    <el-button
      class="addUser"
      type="success"
      icon="el-icon-plus"
      circle
      @click="addFormDialog = true"
    ></el-button>

    <!-- 增加用户弹框 -->
    <el-dialog title="新增用户" :visible.sync="addFormDialog" width="30%" @close="closeAddFormDialog">
      <el-form :model="addForm" ref="addForm" :rules="addFormRules">
        <el-form-item label="用户名" label-width="15%" prop="name">
          <el-input v-model="addForm.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" label-width="15%" prop="password">
          <el-input v-model="addForm.password" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addFormDialog = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      tableData: [],
      addFormDialog: false,
      addForm: {
        name: "",
        password: ""
      },
      addFormRules: {
        name: [{ required: true, message: "用户名不能为空" }],
        password: [{ required: true, message: "密码不能为空" }]
      }
    };
  },
  created() {
    this.getUsers();
  },
  methods: {
    getUsers() {
      this.$axios
        .get("/user")
        .then(response => {
          if (response.data.success) {
            this.tableData = response.data.data;
          }
        })
        .catch(() => {
          this.$message.error("响应失败");
        });
    },
    addUser() {
      this.$refs.addForm.validate(valid => {
        if (valid) {
          this.$axios
            .post("/user", this.addForm)
            .then(response => {
              if (response.data.success) {
                this.getUsers();
                this.$message.success(response.data.message);
                this.addFormDialog = false;
              } else {
                this.$message.error("新增失败");
              }
            })
            .catch(() => {
              this.$message.error("响应失败");
            });
        } else {
          return;
        }
      });
    },
    deleteUser(id){
      this.$confirm('确定要删除该用户吗, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$axios.delete(`/user/${id}`).then(response => {
            if(response.data.success){
              this.getUsers();
              this.$message.success(response.data.message);
            }else{
              this.$message.error("删除失败");
            }
          })
        })
    },
    closeAddFormDialog() {
      this.$refs.addForm.resetFields();
    }
  }
};
</script>

<style lang='less' scoped>
.el-card {
  position: relative;
  height: calc(100vh - 105px);

  .addUser {
    position: absolute;
    right: 20px;
    bottom: 20px;
  }
}
</style>
