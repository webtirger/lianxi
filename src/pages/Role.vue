<!--  -->
<template>
<div class='role'>
  <div class="header">
  <el-breadcrumb separator-class="el-icon-arrow-right">
  <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
  <el-breadcrumb-item>角色列表</el-breadcrumb-item>
</el-breadcrumb>
  </div>
  <!--  -->
 <el-button type="primary" class="add" @click="show" >添加</el-button>
     <el-dialog title="添加角色" :visible.sync="dialogFormVisible">
<el-form ref="form"  :model="form" label-width="80px" style="background:#fff">
  <el-form-item label="角色名称">
    <el-input v-model="form.rolename"></el-input>
  </el-form-item>
<el-tree class="filter-tree" :data="menu1" node-key="id" show-checkbox :props="defaultProps" :default-checked-keys="form.menus" ref="tree"  @check-change="handleCheckChange">
</el-tree>
    <el-form-item label="状态">
    <el-switch v-model="form.status"></el-switch>
  </el-form-item>
  <el-form-item>
    <el-button  type="primary" @click="op">{{tip}}</el-button>
    <el-button @click="closePop">取消</el-button>
  </el-form-item>
</el-form>
</el-dialog>
    <!--  -->
    <el-table :data='roleData' row-key="id" :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
    <el-table-column label='角色编号' prop='id' width='100'></el-table-column>
    <el-table-column label='角色名称' prop='rolename' width='100'></el-table-column>
    <el-table-column label='状态'  width='100'><el-button type="primary">启用</el-button></el-table-column>
    <el-table-column label='操作' width='200'> 
        <template slot-scope="scope">
    <el-button type="primary" @click="edit(scope.row)">编辑</el-button>
    <el-button type="danger" @click="del(scope.row)">删除</el-button>
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
roleData:[],
  defaultProps: {
          children: 'children',
          label: 'title'
        },
menu1:[],
form:{rolename:"",status:'',menus:[]},
dialogFormVisible: false
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
    this.form.id='';
    this.form.rolename='';
    this.form.menus=[];
    this.form.status=true;
    this.dialogFormVisible = true;
    this.flag=false;
  },
    op(){
      let uri='';
      if(this.form.id){uri='/api/roleedit';this.form.menus=this.$refs.tree.getCheckedKeys(false,true);}
      else{uri='/api/roleadd'}
      this.form.status=this.form.status?1:2;
this.$http.post(uri,this.form).then(res=>{
  let type='';
   if(res.code==200){type='success';this.getRolelist();this.form.id='';this.dialogFormVisible=false;}else{type='error'}
    this.$message({message:res.msg,type});
})
    }, 
    handleCheckChange(data, checked, indeterminate) {
        if(data.children){
          for(let i of data.children){
             this.form.menus.push(i.id)
          }
        }else{
           this.form.menus.push(data.id)
        }
      },
      closePop(){
        this.dialogFormVisible = false
      },
      edit(row){
        this.tip='修改';
  this.form.id=row.id;
    this.form.rolename=row.rolename;
 this.form.menus=row.menus.split(',');
 this.form.status=row.status==1?true:false;
        this.flag=true;
       this.dialogFormVisible = true;
      },
  //     modify(){
        
  //   this.form.status=this.form.status?1:2;
  //       axios.post('/api/roleedit',this.form).then(res=>{
  //         let type='';
  //  if(res.code==200){type='success';this.getRolelist()}else{type='error'}
  //   this.$message({message:res.msg,type});
  //       })
  //     },
      del(row){
            this.$confirm('是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
               axios.post('/api/roledelete',{id:row.id}).then(res=>{let type='';
   if(res.code==200){type='success';this.roleData=res.list}else{type='error'}
    this.$message({message:res.msg,type});})
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
      },
      getRolelist(){
        this.$http.get('/api/rolelist').then(res=>{this.roleData=res.list;console.log(res)});
      }
},
mounted(){
this.getRolelist()
this.$http.get('/api/menulist',{istree:true}).then(res=>{this.menu1=res.list;})
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