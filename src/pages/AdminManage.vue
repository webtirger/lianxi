<!--  -->
<template>
<div class='adminManage'>
    <div class="header">
  <el-breadcrumb separator-class="el-icon-arrow-right">
  <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
  <el-breadcrumb-item>管理员列表</el-breadcrumb-item>
</el-breadcrumb>
  </div>
  <!-- 弹窗 -->
  <el-button type="primary" @click="show" class="add">添加</el-button>
    <el-dialog title="添加管理员"  :visible.sync="dialogFormVisible" width="600px">
<el-form ref="form"  :model="form" label-width="80px" style="background:#fff">
  <el-form-item label="角色" required="">
   <el-select v-model="form.roleid" placeholder="请选择">
    <el-option
      v-for="(item,index) in rolelist"
      :key="index"
      :label="item.rolename"
      :value="item.id">
    </el-option>
  </el-select>
  </el-form-item>
  <el-form-item label="用户名" required>
    <el-input v-model="form.username" ></el-input>
  </el-form-item>
    <el-form-item label="密码" >
    <el-input v-model="form.password" ></el-input>
  </el-form-item>
    <el-form-item label="状态">
    <el-switch v-model="form.status"  active-color="#13ce66"></el-switch>
  </el-form-item>
  <el-form-item>
    <el-button @click="dialogFormVisible=false">取消</el-button>
    <el-button  type="primary" @click="op">{{tip}}</el-button>

  </el-form-item>
</el-form>
</el-dialog>
      <!-- 表格 -->
    <el-table :data='adminData' row-key="id" :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
    <el-table-column label='用户编号' prop='uid' width='200'></el-table-column>
    <el-table-column label='角色' prop='username' width='150'></el-table-column>
    <el-table-column label='用户名' prop='rolename' width='200'></el-table-column>
    <el-table-column label='状态'  width='100'><el-button type="primary">启用</el-button></el-table-column>
    <el-table-column label='操作' width='200'> 
        <template slot-scope="scope">
    <el-button type="primary" @click="edit(scope.row)">编辑</el-button>
    <el-button type="danger" @click="del(scope.row)">删除</el-button>
    </template>
      </el-table-column>
    </el-table>
    <el-pagination
  background
  layout="prev, pager, next" 
  :page-size="pagesize" 
  :total="total"
  @current-change='curr'
  >
</el-pagination>
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
  cur:1,
  total:0,
  pagesize:2,
  tip:'添加',
dialogFormVisible:false,
adminData:[],
rolelist:[],
rules:[],
flag:true,
form:{
    id:'', uid:'',roleid:'',username:'',password:'',status:''
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
      this.form.uid='';
      this.form.roleid='';
      this.form.username='';
      this.form.password='';
      this.form.status=true;
        this.dialogFormVisible=true;this.flag=false;
    },
    op(){
      let uri='';
      if(this.form.id){uri='/api/useredit'}else{uri='/api/useradd'}
      this.form.status=this.form.status==true?1:2;
        this.$http.post(uri,this.form).then(res=>{
      let type='';
   if(res.code==200){type='success';this.getlist(this.cur);this.form.id='';this.dialogFormVisible=false;}else{type='error'}
    this.$message({message:res.msg,type});
        })
    },
del(row){
     this.$confirm(' 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
           this.$http.post('/api/userdelete',{uid:row.uid}).then(res=>{
    let type='';
   if(res.code==200){type='success';this.getlist(1)}else{type='error'}
    this.$message({message:res.msg,type});
})
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
},
edit(row){
  this.tip='修改';
this.flag=true;
this.dialogFormVisible=true;
this.form.id=row.id;
this.form.uid=row.uid;
this.form.roleid=row.roleid;
this.form.rolename=row.rolename;
this.form.username=row.username;
this.form.password=row.password;
this.form.status=row.status==1?true:false;
// console.log(row)
},
getlist(page){
    this.$http.get('/api/usercount').then(res=>{this.total=res.list[0].total;})
    this.$http.get(`/api/userlist?page=${page}&size=2`).then(res=>{this.adminData=res.list;})
},
curr(index){this.cur=index; this.$http.get(`/api/userlist?page=${index}&size=2`).then(res=>{console.log(res);this.adminData=res.list})},
},
mounted(){
  this.getlist(1)
    this.$http.get('/api/rolelist').then(res=>{console.log(res);this.rolelist=res.list})
}
}
</script>
<style scoped>
.add{margin:10px 0 10px 20px;}
.header{
  margin: 10px 20px;
  font-size: 20px;
}
</style>