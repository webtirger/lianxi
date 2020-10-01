<!--  -->
<template>
<div class='menu'>
    <div class="header">
     <el-breadcrumb separator-class="el-icon-arrow-right">
  <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
  <el-breadcrumb-item>菜单列表</el-breadcrumb-item>
</el-breadcrumb>
    </div>
    <!-- 表单 -->
     <el-button type="primary" class="add" @click="show" >添加</el-button>
     <el-dialog title="添加菜单" :visible.sync="dialogFormVisible">
<el-form ref="form"  :model="form" :rules='rules' label-width="80px" style="background:#fff">
  <el-form-item label="菜单名称" prop="title">
    <el-input v-model="form.title"></el-input>
  </el-form-item>
  <el-form-item label="上级菜单">
    <el-select  v-model="form.pid" placeholder="------">
      <el-option label="顶级菜单" value="0"></el-option>
      <el-option label="系统设置" value="1"></el-option>
      <el-option label="商城管理" value="8"></el-option>
    </el-select>
  </el-form-item>
  <el-form-item label="菜单类型">
    <el-radio-group v-model="form.type" @change="typeChange(form.type)">
      <el-radio label="1" value='目录'>目录</el-radio>
      <el-radio label="2" value='菜单'>菜单</el-radio>
    </el-radio-group>
  </el-form-item>
 <el-form-item v-if="menuflag==false" label="菜单图标">
    <el-select  v-model="form.icon" placeholder="--请选择--">
      <el-option v-for="(v,i) in icons" :key="i" :label="v" :value='v'>{{v}}</el-option>
    </el-select>
  </el-form-item>
   <el-form-item v-else label="菜单地址">
    <!-- <el-select  v-model="form.url" placeholder="--请选择--">
      <el-option v-for="(v,i) in urls" :key="i" :label="v" :value='v'>{{v}}</el-option>
    </el-select> -->
     <el-input v-model="form.url"></el-input>
  </el-form-item>
    <el-form-item label="状态">
    <el-switch v-model="form.status"></el-switch>
  </el-form-item>
  <el-form-item>
    <el-button type="primary" @click="addMenu">{{tip}}</el-button>
    <el-button @click="closePop">取消</el-button>
  </el-form-item>
</el-form>
</el-dialog>
<!-- 表格 -->
    <el-table :data='menuData' row-key="id" :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
    <el-table-column label='菜单编号' prop='id' width='100'></el-table-column>
    <el-table-column label='菜单名称' prop='title' width='100'></el-table-column>
    <el-table-column label='菜单图标'  width='100'>
      <template slot-scope="scope">
        <i :class="scope.row.icon"></i>
        </template>
    </el-table-column>
    <el-table-column label='菜单地址' prop='url' width='100'></el-table-column>
    <el-table-column label='状态'  width='100'><el-button type="primary">启用</el-button></el-table-column>
    <el-table-column label='操作' width='200'> 
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
import axios from 'axios'
export default {
//import引入的组件需要注入到对象中才能使用
components: {},
data() {
//这里存放数据
return {
  tip:'添加',
  menuflag:false,
menuData:[],
icons:['el-icon-setting','el-icon-s-help','el-icon-s-operation','el-icon-s-grid'],
urls:[],
form:{
id:'',
title:"",
pid:'',
url:'',
type:'',
icon:'',
status:false
},
dialogFormVisible:false,
  rules: {
          title: [
            { required: true, message: '请输入活动名称', trigger: 'blur' },
            { min: 3, max: 6, message: '长度在 3 到 6 个字符', trigger: 'blur' }
          ],}
};
},
//监听属性 类似于data概念
computed: {},
//监控data中的数据变化
watch: {},
//方法集合
methods: {
  show(){
    this.form.title='';
    this.form.pid='0';
    this.form.url='';
    this.form.type='1';
    this.form.icon='';
    this.form.status=true;
    this.dialogFormVisible = true;
  },
  typeChange(type){
    // console.log(type);
  this.menuflag=type==1?false:true;
  },
closePop(){
    this.dialogFormVisible = false
},addMenu(){
  let uri='';
  this.tip='添加';
  if(this.form.id){uri='/api/menuedit'}else{uri='/api/menuadd'}
this.form.status=this.form.status?1:2;
axios.post(uri,this.form).then(res=>{console.log(res);
let type='';
   if(res.code==200){type='success';
   this.getList();
   this.form.id='';this.dialogFormVisible=false;
   }else{type='error'}
    this.$message({message:res.msg,type});
})
},
edit(row){
  // console.log(row)
  this.tip='修改';
 this.form.title=row.title;
 this.form.id=row.id;
    this.form.pid=row.pid;
    this.form.url=row.url;
    this.form.type=row.type.toString();
    this.form.icon=row.icon;
    this.form.status=row.status==1?true:false;
    this.menuflag=row.type==1?false:true;
     this.dialogFormVisible = true;
},del(row){

          this.$confirm('是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
axios.post('/api/menudelete',{id:row.id}).then(res=>{let type='';
   if(res.code==200){type='success';this.menuData=res.list||[];}else{type='error'}
    this.$message({message:res.msg,type});})
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });




},
getList(){
  this.$http.get('/api/menulist',{istree:true}).then(res=>{this.menuData=res.list;
for(let item of res.list){
  for(let child of item.children){
    this.urls.push(child.url)
  }
}
// console.log(this.urls)
})
}
},
mounted(){
this.getList();
}
}
</script>
<style  scoped>
.add{margin:10px 0 10px 20px;}
.header{
  margin: 10px 20px;
  font-size: 20px;
}
</style>

