<!--  -->
<template>
  <div class="home">
    <div class="header">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>首页</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <!-- 商品总览 -->
    <div class='zonglan'>
    <div class="shop">
  <el-row class="e1">
  <el-col :span="24"><div >商品总览</div></el-col>
</el-row>
<el-row  type="flex" >
  <el-col :span="6"><div>100</div><p>已下架</p></el-col>
  <el-col :span="6"><div>400</div><p>已上架</p></el-col>
  <el-col :span="6"><div>50</div><p>库存紧张</p></el-col>
  <el-col :span="6"><div>500</div><p>全部商品</p></el-col>
</el-row>
    </div>
    <!-- 用户总览 -->
        <div class="shop">
      <el-row class="e1">
  <el-col :span="24"><div >用户总览</div></el-col>
</el-row>
<el-row   >
  <el-col :span="6"><div>100</div><p>今日新增</p></el-col>
  <el-col :span="6"><div>200</div><p>昨日新增</p></el-col>
  <el-col :span="6"><div>1000</div><p>本月新增</p></el-col>
  <el-col :span="6"><div>5000</div><p>会员总数</p></el-col>
</el-row>
    </div>
    </div>
<!-- 图表 -->
    <div id="e"></div>
  </div>
</template>

<script>
//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
//例如：import 《组件名称》 from '《组件路径》';
// import echarts from 'echarts'
// import echarts_data from '../../../utils/echarts_data'
export default {
  //import引入的组件需要注入到对象中才能使用
  components: {},
  data() {
    //这里存放数据
    return {
      charts: "",
      edata: "",
      opinionData: ["550", "610", "480", "291", "390", "702", "810"],
    };
  },
  //监听属性 类似于data概念
  computed: {},
  //监控data中的数据变化
  watch: {},
  //方法集合
  methods: {
    drawLine(id) {
      this.charts = this.$echarts.init(document.getElementById(id));
      this.charts.setOption({
        tooltip: { trigger: "axis" },
        legend: { data: ["近一周订单数量"] },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        toolbox: { feature: { saveAsImage: {} } },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: ["周一", "周二", "周三", "周四", "周五", "周六", "周天"],
        },
        yAxis: { type: "value" },
        series: [
          {
            name: "近一周订单数量",
            type: "line",
            stack: "总量",
            data: this.opinionData,
          },
        ],
      });
    },
  },
  mounted() {
    this.drawLine("e");
  },
};
</script>
<style  lang='less' scoped>
#e {
  margin-top: 50px;
  width: 800px;
  height: 400px;
}

.header{
  margin: 10px 20px;
  font-size: 20px;
}

.zonglan{
   display:flex;
   justify-content: space-around;
>div{
  width: 500px;
  height: 180px;
  border: 1px solid #000;
   .e1{height: 50px;line-height:50px;background-color: #F3F7FC;}
   .el-row:last-child{
.el-col{
     text-align: center;
     >div{color:#EFC1BF;}
     }
   }
   
}

}
</style>