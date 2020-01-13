
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
      <el-table-column prop="sort" label="显示顺序"></el-table-column>
      <el-table-column prop="creator" label="创建人"></el-table-column>
      <el-table-column prop="createDate" label="创建时间"></el-table-column>
      <el-table-column prop="updateDate" label="修改时间"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="type">
          <el-button-group>
            <el-button type="success" size="small" icon="el-icon-plus" @click="openAddDialog(type.row.id)"></el-button>
            <el-button type="warning" size="small" icon="el-icon-edit"  @click="openAddDialog(type.row.id,type.row)"></el-button>
            <el-button type="danger" size="small" icon="el-icon-delete" @click="deleteType(type.row)"></el-button>
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>
    <el-button class="addType" type="success" icon="el-icon-plus" circle @click="openAddDialog(-1)"></el-button>
    
    
    <!-- 增加类型弹框 -->
    <el-dialog
      :title="addTypeDialogTitle"
      :visible.sync="addTypeDialog"
      width="35%"
      @close="closeAddTypeFormDialog"
    >
      <el-form :model="addTypeForm" ref="addTypeForm" label-position="right" :rules="addTypeRules">
        <el-form-item label="类型名" label-width="20%" prop="name">
          <el-input v-model="addTypeForm.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="上级类别" label-width="20%" prop="parentId">
          <el-cascader
            @change="handleTypeChange"
            v-model="addTypeForm.parentId"
            :props="typeListProps"
            :options="typeDatas"
            :show-all-levels="false"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="显示顺序" label-width="20%" prop="sort">
          <el-input v-model="addTypeForm.sort" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addTypeDialog = false">取 消</el-button>
        <el-button type="primary" @click="addType">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      typeListProps: {
        value: "id",
        label: "name",
        children: "children",
        checkStrictly: true
      },
      addTypeDialog : false,
      addTypeDialogTitle : "",
      addTypeForm: {
          name: "",
          sort: 0,
          parentId:0,
          creator:""
      },
      addTypeRules: {
        name: [{ required: true, message: "类型名不能为空" }]
      },
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
          if(response.data.success){
            this.typeDatas = response.data.data
          }
        })
        .catch(() => {
          this.$message.error("响应失败");
        });
    },
    addType(){
        this.$refs.addTypeForm.validate(valid => {
          if (valid) {
            this.addTypeForm.creator = this.$store.state.userName
            this.$axios
              .post("/bill/type", this.addTypeForm)
              .then(response => {
                if (response.data.success) {
                  this.getAllType();
                  this.$message.success(response.data.message);
                  this.addTypeDialog = false;
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
    },
    openAddDialog(id,type) {
      if(type){
        this.addTypeDialogTitle = "修改类型"
        this.addTypeForm = {
            name: type.name,
            sort: type.sort,
            parentId:type.parentId,
            creator: "",
            id: type.id
        }
      }else{
        this.addTypeDialogTitle = "新增类型"
        this.addTypeForm = {
          name: "",
          sort: 0,
          parentId:id,
          creator: "",
        }
      }
      this.addTypeDialog = true
    },
    closeAddTypeFormDialog(){
      this.$refs.addTypeForm.resetFields();
    },
    handleTypeChange(typeArr){
      this.addTypeForm.parentId = typeArr[typeArr.length - 1];
    },
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
