
<template>
  <el-card>
    <el-table
      :data="typeDatas"
      style="width: 100%;margin-bottom: 20px;height:calc(100vh - 110px);;overflow: auto; "
      row-key="id"
      default-expand-all
      :tree-props="{children: 'children'}"
    >
      <el-table-column prop="name" label="类别名称"></el-table-column>
      <el-table-column prop="creator" label="创建人"></el-table-column>
      <el-table-column prop="createDate" label="创建时间"></el-table-column>
      <el-table-column prop="updateDate" label="修改时间"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="type">
          <el-button-group>
            <el-button type="success" size="small" icon="el-icon-plus" @click="openAddDialog(type.row.id)"></el-button>
            <el-button type="warning" size="small" icon="el-icon-edit"  @click="editType(type.row)"></el-button>
            <el-button type="danger" size="small" icon="el-icon-delete" @click="deleteType(type.row)"></el-button>
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>
    <el-button class="addType" type="success" icon="el-icon-plus" circle @click="openAddDialog(-1)"></el-button>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      // addFormDialog : false,
      // addForm: {
      //     name: "",
      //     password: ""
      // },
      typeDatas: []
    };
  },
  created(){
    this.getAllType()
  },
  methods: {
    getAllType(){
      this.$axios
        .get("/bill/type")
        .then(response => {
          window.console.log(response)
          if(response.data.success){
            this.typeDatas = response.data.data
          }
        })
        .catch(() => {
          this.$message.error("响应失败");
        });
    },
    openAddDialog(id) {
      this.$prompt("请输入类型名称", "新增类型", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputPattern: /\S/,
        inputErrorMessage: "类型名称不能空"
      }).then(({ value }) => {
        let addData = {
            name:value,
            parentId:id,
            creator:this.$store.state.userName
        }
        this.$axios
          .post("/bill/type", addData)
          .then(response => {
            if (response.data.success) {
              this.getAllType();
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
    editType(type){
      this.$prompt("请输入修改后的类型名称", "修改类型", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputValue:type.name,
        inputValidator:(str)=>{
          if(str){
            if(str === type.name){
              return "类型名称没有修改"
            }else{
              return true
            }
          }else{
            return "类型名称不能空"
          }
        }
      }).then(({ value }) => {
        type.name = value
        this.$axios
          .put("/bill/type", type)
          .then(response => {
            if (response.data.success) {
              this.getAllType();
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
    deleteType(type){
      var ids = new Array()
      ids.push(type.id)
      this.deleteChild(ids,type.children)
      this.$confirm('确定要删除该类型及其子类型吗, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$axios.delete(`/bill/type/${ids.join("-")}`).then(response => {
            if(response.data.success){
              this.getAllType();
              this.$message.success(response.data.message);
            }else{
              this.$message.error("删除失败");
            }
          })
        })
    },
    deleteChild(arr,children){
      if(children){
        for(let child of children){
          arr.push(child.id)
          this.deleteChild(arr,child.children)
        }
      }
    }
  }
};
</script>

<style lang='less' scoped>
.el-card {
  position: relative;
  height: calc(100vh - 105px);
  .addType {
    position: absolute;
    right: 20px;
    bottom: 20px;
  }
}
</style>
