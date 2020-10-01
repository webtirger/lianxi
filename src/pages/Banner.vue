<!--  -->
<template>
<div class='banner'>
  <div class="header">
  <el-breadcrumb separator-class="el-icon-arrow-right">
  <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
  <el-breadcrumb-item>轮播图</el-breadcrumb-item>
</el-breadcrumb>
  </div>
 <!-- 弹窗 -->
 <el-button type="primary" class="add" @click="show" >添加</el-button>
    <el-dialog title="添加轮播图"  :visible.sync="dialogFormVisible" width="600px">
<el-form ref="form"  :model="form" :rules='rules' label-width="80px" style="background:#fff">
  <el-form-item label="标题" prop='title'>
    <el-input v-model="form.title" ></el-input>
  </el-form-item>
  <el-form-item label="图片">
<el-upload
   action="#"
  list-type="picture-card"
   :auto-upload="false"
  class="avatar-uploader"
  :show-file-list="true"
  :on-change='picChange'
    :on-preview="handlePictureCardPreview"
    :on-remove="handleRemove"
  :before-upload="beforeAvatarUpload">
  <img v-if="imageUrl" :src="imageUrl" class="avatar">
  <i v-else class="el-icon-plus "></i>
</el-upload>
<el-dialog :visible.sync="dialogVisible" >
  <img width="100%" :src="dialogImageUrl" >
</el-dialog>
  </el-form-item>
    <el-form-item label="状态">
    <el-switch v-model="form.status"  active-color="#13ce66"></el-switch>
  </el-form-item>
  <el-form-item>
    <el-button type="primary" @click="addPic">{{tip}}</el-button>
    <el-button @click="closePop">取消</el-button>
  </el-form-item>
</el-form>
</el-dialog>
    <!-- 表格 -->
    <el-table :data='bannerData' row-key="id" :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
    <el-table-column label='编号' prop='id' width='200'></el-table-column>
    <el-table-column label='轮播图标题' prop='title' width='200'></el-table-column>
    <el-table-column label='图片' prop="img" width='200'>
        <template slot-scope="scope">
            <img :src="'http://localhost:3000'+scope.row.img" style="width: 100px; height: 100px" />
        </template>
    </el-table-column>
    <el-table-column label='状态'  width='100'><el-button type="primary">启用</el-button></el-table-column>
    <el-table-column label='操作' width='200'> 
        <template slot-scope="scope">
    <el-button type="primary" @click="edit(scope.row)">编辑</el-button>
    </template>
      </el-table-column>
    </el-table>
    <!--  -->
</div>
</template>

<script>
//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
//例如：import 《组件名称》 from '《组件路径》';
import axios from 'axios'
export default {
//import引入的组件需要注入到对象中才能使用
components: {},
data() {
//这里存放数据
return {
  tip:'添加',
  dialogImageUrl:'',
   dialogVisible: false,
  form1:new FormData(),
bannerData:[],
dialogFormVisible:false,
imageUrl: '',
form:{
  id:'',
title:'',
status:true,
img:''
},
rules:{
    title:[{ required: true, message: '请输入标题', trigger: 'blur' }]
}
};
},
//监听属性 类似于data概念
computed: {},
//监控data中的数据变化
watch: {},
//方法集合
methods: {
  show(){
    this.tip='添加';
    this.form.title='';
    this.form.status=true
    this.dialogFormVisible = true;
     document.getElementsByClassName('el-upload-list el-upload-list--picture-card')[0].innerHTML=''
  },
  edit(row){
    this.tip='修改';
    this.dialogFormVisible = true;
    this.imageUrl='http://localhost:3000'+row.img;
    this.form.id=row.id;
    this.form.title=row.title;
    this.form.status=row.status==1?true:false;
     document.getElementsByClassName('el-upload-list el-upload-list--picture-card')[0].innerHTML=''
  },
addPic(){
  let uri='';
  if(this.form.id){uri='/api/banneredit';this.form1.append('id',this.form.id)}else{uri='/api/banneradd'}
    this.form.status=this.form.status?1:2;
    this.form1.append('title',this.form.title);
    this.form1.append('status',this.form.status);
    axios.post(uri,this.form1).then(res=>{
      let type='';
   if(res.code==200){type='success';this.getList();this.form.id='';this.dialogFormVisible=false;}else{type='error'}
    this.$message({message:res.msg,type});
    })
},
closePop(){
        this.dialogFormVisible = false
      },
beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg';
        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!isJPG) {
          this.$message.error('上传头像图片只能是 JPG 格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!');
        }
        return isJPG && isLt2M;
      },
      picChange(file,fileList){
        this.form1.append('img',file.raw);
        
      },
       handleRemove(file, fileList) {
        console.log(file, fileList);
      },
      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
      },
      getList(){
        axios.get('/api/bannerlist').then(res=>{ this.bannerData=res.list});
      }
    
},
mounted(){
this.getList()
}
}
</script>
<style  scoped>
.add{margin:10px 0 10px 20px;}
.header{
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
    border-color: #409EFF;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>