<template>
  <div class="manage">
    <!-- 对话框设置开始 -->
    <el-dialog
      title="提示"
      :before-close="handleClose"
      :visible.sync="dialogVisible"
      width="50%"
    >
      <!-- 用户的表单信息 开始 -->
      <el-form
        ref="form"
        :inline="true"
        :rules="rules"
        :model="form"
        label-width="80px"
      >
        <el-form-item label="姓名" prop="name">
          <el-input placeholder="请输入姓名" v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="年龄" prop="age">
          <el-input placeholder="请输入年龄" v-model="form.age"></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-select v-model="form.sex" placeholder="请选择">
            <el-option label="男" :value="1"></el-option>
            <el-option label="女" :value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="出生日期" prop="birth">
          <el-date-picker
            v-model="form.birth"
            type="date"
            placeholder="选择日期"
            value-format="yyyy-MM-dd"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="地址" prop="addr">
          <el-input placeholder="请输入地址" v-model="form.addr"></el-input>
        </el-form-item>
      </el-form>
      <!-- 用户的表单信息 结束 -->
      <!-- 按钮开始 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </span>
      <!-- 按钮结束 -->
    </el-dialog>
    <!-- 对话框设置结束 -->
    <div class="manage-header">
      <!-- 按钮区 -->
      <el-button type="primary" @click="handleAdd">+新增</el-button>
      <!-- form搜索区域  -->
      <el-form :inline="true" :model="userForm">
        <el-form-item>
          <el-input placeholder="请输入名称" v-model="userForm.name"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="common-table">
      <el-table stripe height="90% " :data="tableData" style="width: 100%">
        <el-table-column prop="name" label="姓名"> </el-table-column>
        <el-table-column prop="sex" label="性别">
          <!-- //法1，使用vue的作用域插槽获取子组件的数据 -->
          <template slot-scope="scope">
            <span>{{ scope.row.sex == 1 ? "男" : "女" }}</span>
          </template>
          <!-- //法2，在mock模拟数据时修改： // sex: Mock.Random.integer(0, 1) -->
          <!-- //sex:(Mock.Random.integer(0, 1) == 1) ? '男' : 女，则可以直接使用 -->
        </el-table-column>
        <el-table-column prop="age" label="年龄"> </el-table-column>
        <el-table-column prop="birth" label="出生日期"> </el-table-column>
        <el-table-column prop="addr" label="地址"> </el-table-column>
        <el-table-column prop="addr" label="地址">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleEdit(scope.row)"
              >编辑</el-button
            >
            <el-button
              type="danger"
              size="mini"
              @click="handleDelete(scope.row)"
              >删除</el-button
            >
          </template></el-table-column
        >
      </el-table>
      <div class="pager">
        <el-pagination
          layout="prev, pager, next"
          :total="total"
          @current-change="handlePage"
        >
        </el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
//获取 数据接口
import { getUser, addUser, editUser, delUser } from "../api";
export default {
  data() {
    return {
      dialogVisible: false,
      form: {
        name: "",
        addr: "",
        age: "",
        birth: "",
        sex: "",
      },
      rules: {
        name: [{ required: true, message: "请输入姓名" }],
        age: [{ required: true, message: "请输入年龄" }],
        sex: [{ required: true, message: "请选择性别" }],
        birth: [{ required: true, message: "请选择出生日期" }],
        addr: [{ required: true, message: "请输入地址" }],
      },
      tableData: [],
      modalType: 0, //0表示新增，1表示编辑
      total: 0, //当前的总条数
      pageDate: {
        page: 1,
        limit: 10,
      },
      userForm: {
        name: "",
      },
    };
  },
  methods: {
    //提交用户表单
    formReset() {
      this.form = {};
    },
    submit() {
      this.$refs.form.validate((valid) => {
        console.log(valid, "valid");
        if (valid) {
          if (this.modalType == 0) {
            addUser(this.form).then(() => {});
            //添加后需重新获取列表接口
            this.getList();
          } else {
            editUser(this.form).then(() => {});
            //编辑后需重新获取列表接口
            this.getList();
          }

          //后续对表单的处理
          console.log(this.form);
          //清空表单的数据
          this.$refs.form.resetFields();
          this.formReset();
          //关闭弹窗
          this.dialogVisible = false;
        }
      });
    },
    handleClose() {
      console.log(this.$refs.form);
      this.$refs.form.resetFields();
      this.dialogVisible = false;
      this.formReset();
    },
    cancel() {
      this.handleClose();
    },
    handleEdit(row) {
      this.modalType = 1;

      //注意需要对当前行的数据进行深拷贝，否则会出错 不懂
      this.form = JSON.parse(JSON.stringify(row));
      this.dialogVisible = true;
      // this.form = {...};
    },
    handleDelete(row) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          delUser({ id: row.id }).then(() => {
            this.$message({
              type: "success",
              message: "删除成功!",
            });
            //编辑后需重新获取列表接口
            this.getList();
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    handleAdd() {
      this.modalType = 0;
      this.dialogVisible = true;
    },
    //获取列表数据，从而更新列表视图
    getList() {
      getUser({ params: { ...this.pageDate, ...this.userForm } }).then(
        ({ data }) => {
          console.log(data);
          this.tableData = data.list;
          this.total = data.count || 0;
        }
      );
    },
    handlePage(val) {
      this.pageDate.page = val;
      this.getList();
    },
    //列表的查询
    onSubmit() {
      this.getList();
    },
  },
  mounted() {
    this.getList();
  },
};
</script>

<style lang='less' scoped>
.manage {
  height: 90%;
  .manage-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .common-table {
    position: relative;
    height: calc(100% - 30px);
    .pager {
      position: absolute;
      bottom: 0;
      right: 20px;
    }
  }
}
</style>