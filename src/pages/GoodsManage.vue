<!--  -->
<template>
<div class='GoodsManage'>
  <div class="header">
  <el-breadcrumb separator-class="el-icon-arrow-right">
  <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
  <el-breadcrumb-item>商品列表</el-breadcrumb-item>
</el-breadcrumb>
  </div>

<!-- 弹窗 -->
<el-button type="primary" class="add" @click="show" >添加</el-button>
    <el-dialog title="编辑角色"  :visible.sync="dialogFormVisible" width="800px">
<el-form ref="form"  :model="form" :rules='rules' label-width="80px" style="background:#fff">
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
   <el-select v-model="form.second_cateid" placeholder="请选择">
    <el-option
      v-for="item in second"
      :key="item.id"
      :label="item.catename"
      :value="item.id">
    </el-option>
  </el-select>
  </el-form-item>
  <el-form-item label="商品名称" prop='goodsname'>
    <el-input v-model="form.goodsname" ></el-input>
  </el-form-item>
  <el-form-item label="价格" prop='price'>
    <el-input v-model="form.price" ></el-input>
  </el-form-item>
    <el-form-item label="市场价格" prop='market_price'>
    <el-input v-model="form.market_price" ></el-input>
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
   <el-form-item label="商品规格">
   <el-select v-model="form.specsid" placeholder="请选择" @change='firstChange(form.first_cateid)'>
    <el-option
      v-for="item in specList"
     :key="item.id"
      :label="item.specsname"
      :value="item.id">
    </el-option>
  </el-select>
  </el-form-item>
  <el-form-item label="商品属性">
   <el-select v-model="form.specsattr" placeholder="请选择">
    <el-option
      v-for="(item,index) in specItems"
      :key="index"
      :label="item"
      :value="index+1">
    </el-option>
  </el-select>
  </el-form-item>
  <el-form-item label="是否新品">
  <el-radio-group v-model="form.isnew">
    <el-radio :label="1">是</el-radio>
    <el-radio :label="2">否</el-radio>
  </el-radio-group>
   </el-form-item>
   <el-form-item label="是否热卖">
  <el-radio-group v-model="form.ishot">
    <el-radio :label="1">是</el-radio>
    <el-radio :label="0">否</el-radio>
  </el-radio-group>
   </el-form-item>
    <el-form-item label="状态">
    <el-switch v-model="form.status"  active-color="#13ce66"></el-switch>
  </el-form-item>
  <el-form-item>
     <quill-editor v-model="form.description"
                ref="myQuillEditor"
                :options="editorOption">
  </quill-editor>
  </el-form-item>
  <el-form-item>
          <el-button type="primary" @click="opGoods">{{tip}}</el-button>
    <el-button @click="dialogFormVisible=false">取消</el-button>
  </el-form-item>
</el-form>
</el-dialog>
      <!-- 表格 -->
    <el-table :data='currData' row-key="id" :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
    <el-table-column label='商品编号' prop='id' width='200'></el-table-column>
    <el-table-column label='商品名称' prop='goodsname' width='150'></el-table-column>
    <el-table-column label='图片'  width='200'>
    <template slot-scope='scope'>
    <img :src='"http://localhost:3000"+scope.row.img' style="width: 100px; height: 100px"/>
    </template>
    </el-table-column>
    <el-table-column label='是否新品' width='200'>
    <template slot-scope='scope'>
    <el-button type="primary" v-if='scope.row.isnew==1' >是</el-button>
    <el-button type="info" v-else >否</el-button>
    </template>
    </el-table-column>
    <el-table-column label='是否热卖' prop='ishot' width='200'>
    <template slot-scope='scope'>
    <el-button type="primary" v-if='scope.row.ishot==1' >是</el-button>
    <el-button type="info" v-else >否</el-button>
    </template>
    </el-table-column>
    <el-table-column label='状态'  width='100'><el-button type="primary">启用</el-button></el-table-column>
    <el-table-column label='操作' width='200'> 
        <template slot-scope="scope">
    <el-button type="primary" @click="edit(scope.row)">编辑</el-button>
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
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import { quillEditor } from 'vue-quill-editor'
export default {
//import引入的组件需要注入到对象中才能使用
components: {quillEditor},
data() {
//这里存放数据
return {
  tip:'添加',
  dialogImageUrl:'',
  dialogVisible: false,
dialogFormVisible:false,
cur:1,
form1:new FormData(),
imageUrl: '',
goodsData:[],
form:{
  id:'',
  first_cateid:'',
  second_cateid:'',
  goodsname:'',
  price:'',
  market_price:'',
  img:'',
  description:'',
  specsid:'',
  specsattr:'',
  isnew:'',
  ishot:'',
  status:''
},
rules:{},
first:[],
second:{},
specList:[],
specItems:[],
total:0,
pagesize:2,
currData:[],
editorOption:{
  placeholder: "请在这里输入",
              modules:{
                toolbar:[
                          ['bold', 'italic', 'underline', 'strike'],    //加粗，斜体，下划线，删除线
                          ['blockquote', 'code-block'],     //引用，代码块
                          [{ 'header': 1 }, { 'header': 2 }],        // 标题，键值对的形式；1、2表示字体大小
                          [{ 'direction': 'rtl' }],             // 文本方向
                          [{ 'size': ['small', false, 'large', 'huge'] }], // 字体大小
                          [{ 'header': [1, 2, 3, 4, 5, 6, false] }],     //几级标题
                          [{ 'color': [] }, { 'background': [] }],     // 字体颜色，字体背景颜色
                          [{ 'align': [] }],    //对齐方式
                          ['clean'],    //清除字体样式
                          ['image']    //上传图片
                          ]
                      }

}
};
},
//监听属性 类似于data概念
computed: { editor() {
        return this.$refs.myQuillEditor.quill
      }},
//监控data中的数据变化
watch: {},
//方法集合
methods: {
  show(){
    this.tip='添加';
    this.form={}
    this.form.isnew=1;
    this.form.ishot=1;
    this.form.status=true;
    this.dialogFormVisible = true;
     document.getElementsByClassName('el-upload-list el-upload-list--picture-card')[0].innerHTML=''
  },
  firstChange(index){
this.second=this.first[index-1].children;
    },
opGoods(){
  let uri='';
  this.form.status=this.form.status?1:2;
  if(this.form.id){uri='/api/goodsedit';}else{uri='/api/goodsadd'}
for(let [k,v] of Object.entries(this.form)){
  if(k!=='img')
this.form1.append(k,v);
}
  this.$http.post(uri,this.form1).then(res=>{
         let type='';
   if(res.code==200){type='success';this.getList(this.cur);this.form.id='';this.form.id='';this.dialogFormVisible=false;}else{type='error'}
    this.$message({message:res.msg,type});
  })
},
curr(index){this.cur=index;this.$http.get(`/api/goodslist?page=${index}&size=2`).then(res=>{console.log(res);this.currData=res.list})},
edit(row){
  this.tip='修改';
this.form.id=row.id;
this.form.first_cateid=row.first_cateid;
this.form.second_cateid=row.second_cateid;
this.form.goodsname=row.goodsname;
this.form.price=row.price;
this.form.market_price=row.market_price;
this.form.img=row.img;
this.form.description=row.description;
this.form.specsid=row.specsid;
this.form.specsattr=row.specsattr;
this.form.isnew=row.isnew;
this.form.ishot=row.ishot;
this.form.status=row.status==1?true:false;
  this.dialogFormVisible = true;
   this.imageUrl='http://localhost:3000'+row.img;
    document.getElementsByClassName('el-upload-list el-upload-list--picture-card')[0].innerHTML=''
  // console.log(row)
},
  onEditorChange({ quill, html, text }) {
        console.log('editor change!', quill, html, text)
        this.content = html
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
getList(page=1){
this.$http.get('/api/specslist').then(res=>{console.log(res);this.specList=res.list;this.specItems=res.list[0].attrs})
  this.$http.get('/api/goodscount').then(res=>{this.total=res.list[0].total;console.log(res)})
  this.$http.get(`/api/goodslist?page=${page}&size=2`).then(res=>{console.log(res);this.currData=res.list})
  this.$http.get('api/catelist?istree=true').then(res=>{this.first=res.list;this.second=this.first[0].children;})
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
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>