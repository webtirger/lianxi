<!--  -->
<template>
<div class='member'>
  <div class="header">
  <el-breadcrumb separator-class="el-icon-arrow-right">
  <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
  <el-breadcrumb-item>会员列表</el-breadcrumb-item>
</el-breadcrumb>
  </div>
  <!-- 弹窗 -->
    <el-dialog title="编辑角色"  :visible.sync="dialogFormVisible" width="600px">
<el-form ref="form"  :model="form" :rules='rules' label-width="80px" style="background:#fff">
  <el-form-item label="昵称" prop='nickname'>
    <el-input v-model="form.nickname" ></el-input>
  </el-form-item>
  <el-form-item label="手机号" prop='phone'>
    <el-input v-model="form.phone" ></el-input>
  </el-form-item>
    <el-form-item label="密码" prop='password'>
    <el-input v-model="form.password" ></el-input>
  </el-form-item>
    <el-form-item label="状态">
    <el-switch v-model="form.status"  active-color="#13ce66"></el-switch>
  </el-form-item>
  <el-form-item>
    <el-button @click="dialogFormVisible=false">取消</el-button>
    <el-button type="primary" @click="modifyMember">修改</el-button>
  </el-form-item>
</el-form>
</el-dialog>
      <!-- 表格 -->
    <el-table :data='memberData' row-key="id" :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
    <el-table-column label='用户编号' prop='uid' width='200'></el-table-column>
    <el-table-column label='昵称' prop='nickname' width='150'></el-table-column>
    <el-table-column label='手机号' prop='phone' width='200'></el-table-column>
    <el-table-column label='状态'  width='100'><el-button type="primary">启用</el-button></el-table-column>
    <el-table-column label='操作' width='200'> 
        <template slot-scope="scope">
    <el-button type="primary" @click="edit(scope.row)">编辑</el-button>
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
dialogFormVisible:false,
memberData:[],
form:{
    nickname:'',
    phone:'',
    password:''
},
rules:{
    nickname:[{ required: true, message: '请输入昵称', trigger: 'blur' }],
    phone:[{ required: true, message: '请输入手机号', trigger: 'blur' }],
    password:[{ required: true, message: '请输入密码', trigger: 'blur' }]
}
};
},
//监听属性 类似于data概念
computed: {},
//监控data中的数据变化
watch: {},
//方法集合
methods: {
edit(row){
this.dialogFormVisible=true;
this.form.nickname=row.nickname;
this.form.phone=row.phone;
this.form.password=row.password;
this.form.uid=row.uid;
this.form.status=row.status==1?true:false;
},
modifyMember(){
this.form.status=this.form.status?1:2;
this.$http.post('/api/memberedit',this.form).then(res=>{
               let type='';
   if(res.code==200){type='success';this.getlist();this.dialogFormVisible=false;}else{type='error'}
    this.$message({message:res.msg,type});
  })
},
getlist(){
  axios.get('/api/memberlist').then(res=>this.memberData=res.list)
}
},
mounted(){
this.getlist()
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