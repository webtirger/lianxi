<!--  -->
<template>
<div class='goodsSort'>
        <div class="header">
  <el-breadcrumb separator-class="el-icon-arrow-right">
  <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
  <el-breadcrumb-item>规格列表</el-breadcrumb-item>
</el-breadcrumb>
  </div>
   <!-- 弹窗 -->
  <el-button type="primary" @click="show" class="add">添加</el-button>
    <el-dialog title="规格添加"  :visible.sync="dialogFormVisible" width="600px">
<el-form ref="form"  :model="form"  style="background:#fff">
  <el-form-item label="属性名称" required>
    <el-input v-model="form.specsname" class="specsname" ></el-input>
  </el-form-item>
  <el-form-item label="属性值">
    <el-input v-model="attr" class="input"></el-input>
    <el-button type="primary" @click="addAttr" class="btn">新增属性值</el-button>
      <div v-for="(v,i) in attrsData" :key="i"><el-input v-model="attrsData[i]" :value="v" class="input"></el-input><el-button type='danger' @click="delAttr(i)">删除</el-button></div>
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
    <el-table :data='specsData' row-key="id" :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
    <el-table-column label='属性名称' prop='specsname' width='200'></el-table-column>
    <el-table-column label='属性值'  width='300'>
        <template slot-scope="scope">
<el-button type="primary" plain   v-for="(v,i) in scope.row.attrs" :key="i">{{v}}</el-button>
        </template>
    </el-table-column>
    <el-table-column label='状态'  width='100'>
       <template slot-scope="scope">
      <el-button v-if="scope.row.status==1" type="success">启用</el-button>
      <el-button v-else type="info">禁用</el-button>
      </template>
      </el-table-column>
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
  tip:'添加',
  cur:1,
  pagesize:2,
  total:0,
dialogFormVisible:false,
form:{
  id:'',specsname:'',status:'1',attrs:[]
},
specsData:[],
sortlist:[],
attrsData:[],
attr:'',
imageUrl:''
};
},
//监听属性 类似于data概念
computed: {},
//监控data中的数据变化
watch: {},
//方法集合
methods: {
  show(){
    this.tip='添加'
    this.form.id='';
    this.form.attrs='';
this.form.specsname='';
this.form.status=true;
        this.dialogFormVisible=true;this.flag=false;
    },
    op(){
      let uri='';
      this.form.attrs=this.attrsData.join();
      if(this.form.id){uri='/api/specsedit';}else{uri='/api/specsadd'}
      this.form.status=this.form.status?1:2;
        let type=''
        this.$http.post(uri,this.form).then(res=>{
        if(res.code==200){
       type='success';
       this.getlist(1)
        }
        this.$message({
          message:res.msg,
          type
        });
        })
    },
del(row){
       this.$confirm(' 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
           this.$http.post('/api/specsdelete',{id:row.id}).then(res=>{
    let type='';
   if(res.code==200){type='success';this.getlist(this.cur)}else{type='error'}
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
  console.log(row)
  this.tip='修改'
this.dialogFormVisible=true;
this.form.id=row.id;
this.form.attrs=row.attrs.join();
this.form.specsname=row.specsname;
this.form.status=row.status==1?true:false;
this.attrsData=this.form.attrs.split(',');
console.log(this.form.attrs.split(','),this.attrsData)
},
getlist(page){
  this.$http.get('/api/specscount').then(res=>{this.total=res.list[0].total})
   this.$http.get(`/api/specslist?page=${page}&size=2`).then(res=>{this.specsData=res.list;this.sortlist=res.list})
},
addAttr(){
  this.attrsData.push(this.attr);
  this.attr=''
},
delAttr(i){this.attrsData.splice(i,1)},
curr(index){this.cur=index; this.$http.get(`/api/specslist?page=${index}&size=2`).then(res=>{this.specsData=res.list})},
},
mounted(){
this.getlist(1)
}
}
</script>
<style  scoped>
.add{margin:10px 0 10px 20px;}
.header{
  margin: 10px 20px;
  font-size: 20px;
}
.input{width:300px;}
.btn{width: 100px;}
.specsname{width: 450px;}
</style>