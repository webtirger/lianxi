<!--  -->
<template>
<div class='kill'>
  <div class="header">
  <el-breadcrumb separator-class="el-icon-arrow-right">
  <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
  <el-breadcrumb-item>限时秒杀</el-breadcrumb-item>
</el-breadcrumb>
  <!-- 弹窗 -->
 <el-button type="primary" class="add" @click="show" >添加</el-button>
    <el-dialog title="添加秒杀"  :visible.sync="dialogFormVisible" width="600px">
<el-form ref="form"  :model="form" label-width="80px" style="background:#fff">
  <el-form-item label="活动名称">
    <el-input v-model="form.title"></el-input>
  </el-form-item>
  <el-form-item label="活动期限">
    <el-date-picker
      v-model="time"
      type="datetimerange"
      range-separator="至"
      start-placeholder="开始日期"
      end-placeholder="结束日期">
    </el-date-picker>
</el-form-item>
  <el-form-item label="一级分类">
   <el-select v-model="form.first_cateid" placeholder="请选择" @change='firstChange(form.first_cateid)'>
    <el-option
      v-for="item in first"
     :key="item.id"
      :label="item.catename"
      :value="item.id">
    </el-option>
  </el-select>
  </el-form-item>
  <el-form-item label="二级分类">
   <el-select v-model="form.second_cateid" placeholder="请选择" @change="secondChange(form.second_cateid)">
    <el-option
      v-for="item in seconds"
      :key="item.id"
      :label="item.catename"
      :value="item.id">
    </el-option>
  </el-select>
  </el-form-item>
   <el-form-item label="商品">
   <el-select v-model="form.goodsid" placeholder="请选择">
    <el-option
      v-for="item in goods"
      :key="item.id"
      :label="item.goodsname"
      :value="item.id">
    </el-option>
  </el-select>
  </el-form-item>
    <el-form-item label="状态">
    <el-switch v-model="form.status"></el-switch>
  </el-form-item>
  <el-form-item>
    <el-button type="primary" @click="addKill">{{tip}}</el-button>
    <el-button @click="closePop">取消</el-button>
  </el-form-item>
</el-form>
</el-dialog>
    <!-- 表单 -->
    <el-table :data='killData' row-key="id" :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
    <el-table-column label='活动名称' prop='title' width='200'></el-table-column>
    <el-table-column label='状态'  width='300'>
      <template slot-scope="scope">
      <el-button v-if="scope.row.status==1" type="primary">启用</el-button>
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
    <!--  -->
  </div>
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
  goods:[],
dialogFormVisible:false,
killData:[],
form:{
  id:'',
  goodsid:'',
    title:'',
    status:'',
    first_cateid:'',
    second_cateid:'',
    begintime:'',
    endtime:''
},
first:[],
seconds:{},
time:[]
};
},
//监听属性 类似于data概念
computed: {},
//监控data中的数据变化
watch: {},
//方法集合
methods: {
  show(){this.dialogFormVisible = true;
  this.form.title=this.form.first_cateid=this.form.second_cateid=this.form.begintime=this.form.endtime='';
  this.form.goodsid='';
  this.time=['',''];
  this.form.status=true;
  },
    firstChange(index){
this.seconds=this.first[index-1].children;
    },
closePop(){
        this.dialogFormVisible = false
      },
      addKill(){
        let uri='';
        if(this.form.id){this.tip='修改';uri='/api/seckedit'}
        else{this.tip='添加';uri='/api/seckadd'}
        this.form.status=this.form.status?1:2;
        [this.form.begintime,this.form.endtime]=this.time;
        this.form.begintime=(new Date(this.form.begintime)).valueOf();
        this.form.endtime=(new Date(this.form.endtime)).valueOf()
         this.$http.post(uri,this.form).then(res=>{
             let type='';
   if(res.code==200){type='success';this.getlist();this.form.id='';this.dialogFormVisible=false;}else{type='error'}
    this.$message({message:res.msg,type});
         })
      },
      edit(row){
          console.log(row)
          this.form.id=row.id;
        this.form.title=row.title;
        this.form.first_cateid=row.first_cateid;
        this.form.second_cateid=row.second_cateid;
        this.form.goodsid=row.goodsid;
         this.secondChange(this.form.second_cateid);
        this.form.status=row.status==1?true:false;
        this.time=[new Date(parseInt(row.begintime)),new Date(parseInt(row.endtime))];
        this.seconds=this.first[row.first_cateid-1].children;
       this.dialogFormVisible = true;
      },
      secondChange(sid){
      this.$http.get(`/api/goodslist?fid=${this.form.first_cateid}&sid=${sid}`).then(res=>{
   this.goods=res.list;
        })
      },
      del(row){
   this.$confirm(' 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
           this.$http.post('/api/seckdelete',{id:row.id}).then(res=>{
    let type='';
   if(res.code==200){type='success';this.getlist()}else{type='error'}
    this.$message({message:res.msg,type});
})
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
      },
      getlist(){
        axios.get('/api/secklist').then(res=>{ this.killData=res.list});
axios.get('api/catelist?istree=true').then(res=>{this.first=res.list;this.seconds=this.first[0].children;})
      }
},
mounted(){
this.getlist()
}
}
</script>
<style  scoped>
.e-form{width: 280px;}
.add{margin:10px 0 10px 20px;}
.header{
  margin: 10px 20px;
  font-size: 20px;
}
</style>