<!--  -->
<template>
  <div class="goodsSort">
    <div class="header">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>分类列表</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <!-- 弹窗 -->
    <el-button type="primary" @click="show" class="add">添加</el-button>
    <el-dialog title="分类添加" :visible.sync="dialogFormVisible" width="600px">
      <el-form
        ref="form"
        :model="form"
        label-width="80px"
        style="background: #fff"
      >
        <el-form-item label="上级分类" required>
          <el-select v-model="form.pid" placeholder="请选择">
            <el-option
              v-for="(item, index) in sortlist"
              :key="index"
              :label="item.catename"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="分类名称" required>
          <el-input v-model="form.catename"></el-input>
        </el-form-item>
        <el-form-item label="分类图片">
          <el-upload
            action="#"
            list-type="picture-card"
            :auto-upload="false"
            class="avatar-uploader"
            :show-file-list="true"
            :on-change="picChange"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove"
            :before-upload="beforeAvatarUpload"
          >
            <img
              v-if="imageUrl"
              :src="imageUrl"
              class="avatar"
              alt="没有图片"
            />
            <i v-else class="el-icon-plus"></i>
          </el-upload>
          <el-dialog :visible.sync="dialogVisible" id="inner">
            <img width="100%" :src="dialogImageUrl" />
          </el-dialog>
        </el-form-item>
        <el-form-item label="状态">
          <el-switch v-model="form.status" active-color="#13ce66"></el-switch>
        </el-form-item>
        <el-form-item>
          <el-button @click="dialogFormVisible = false">取消</el-button>
          <el-button type="primary" @click="op">{{ tip }}</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 表格 -->
    <el-table
      :data="cateData"
      row-key="id"
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
    >
      <el-table-column
        label="分类名称"
        prop="catename"
        width="200"
      ></el-table-column>
      <el-table-column label="状态" width="100"
        ><el-button type="primary">启用</el-button></el-table-column
      >
      <el-table-column label="操作" width="200">
        <template slot-scope="scope">
          <el-button type="primary" @click="edit(scope.row)">编辑</el-button>
          <el-button type="danger" @click="del(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
//例如：import 《组件名称》 from '《组件路径》';

export default {
  //import引入的组件需要注入到对象中才能使用
  components: {},
  data() {
    //这里存放数据
    return {
      form1: new FormData(),
      tip: "添加",
      dialogImageUrl: "",
      dialogVisible: false,
      dialogFormVisible: false,
      form: {
        id: "",
        pid: "",
        catename: "",
        img: "",
        status: "",
      },
      cateData: [],
      sortlist: [],
      imageUrl: "",
    };
  },
  //监听属性 类似于data概念
  computed: {},
  //监控data中的数据变化
  watch: {},
  //方法集合
  methods: {
    show() {
      this.tip = "添加";
      this.form = {};
      this.imageUrl = "";
      this.dialogImageUrl = "";
      this.form.status = true;
      this.dialogFormVisible = true;
      let pc=document.getElementsByClassName(
        "el-upload-list el-upload-list--picture-card"
      )[0];
      if(pc) pc.innerHTML = "";
    },
    op() {
      let uri = "";
      if (this.form.id) {
        uri = "/api/cateedit";
      } else {
        uri = "/api/cateadd";
        this.form.pid = this.form.pid ? this.form.pid : 0;
      }
      this.form.status = this.form.status ? 1 : 2;
      for (let [k, v] of Object.entries(this.form)) {
        if (k !== "img") this.form1.append(k, v);
      }
      this.$http.post(uri, this.form1).then((res) => {
        let type = "";
        if (res.code == 200) {
          type = "success";
          this.getList();
          this.form.id = "";
          this.form1=new FormData();
          this.dialogFormVisible = false;
        } else {
          type = "error";
        }
        this.$message({ message: res.msg, type });
      });
    },
    del(row) {
      this.$confirm("是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$http.post("/api/catedelete", { id: row.id }).then((res) => {
            let type = "";
            if (res.code == 200) {
              type = "success";
              this.getList();
            } else {
              type = "error";
            }
            this.$message({ message: res.msg, type });
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    edit(row) {
      this.tip = "修改";
      this.flag = true;
      this.dialogFormVisible = true;
      this.form.id = row.id;
      this.form.pid = row.pid;
      this.form.catename = row.catename;
      this.form.img = row.img;
      this.form.status = row.status == 1 ? true : false;
      this.imageUrl = "http://localhost:3000" + row.img;
       let pc=document.getElementsByClassName(
        "el-upload-list el-upload-list--picture-card"
      )[0];
      if(pc) pc.innerHTML = "";
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
    picChange(file, fileList) {
      this.form1.append("img", file.raw);
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    getList() {
      this.$http.get("/api/catelist?istree=true").then((res) => {
        console.log(res);
        this.cateData = res.list;
        this.sortlist = res.list;
      });
    },
  },
  mounted() {
    this.getList();
  },
};
</script>
<style  scoped>
.add {
  margin: 10px 0 10px 20px;
}
.header {
  margin: 10px 20px;
  font-size: 20px;
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}

.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>