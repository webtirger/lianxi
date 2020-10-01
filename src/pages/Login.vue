<template>
  <div class="login_bg">
    <div class="login_box">
      <!-- 
            label-width:表单域文字的宽度
            :model="ruleForm" 表单关联的数据
            rules 验证规则
      -->
      <el-form label-width="0px" :model="ruleForm" :rules="rules" ref="ruleForm">
        <h1>登录</h1>
        <el-form-item prop="username">
          <el-input v-model="ruleForm.username"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="ruleForm.password"></el-input>
        </el-form-item>
        <el-form-item>
            <!-- submitForm 提交的时ref 值 -->
          <el-button type="primary" @click="submitForm('ruleForm')">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import {mapMutations,mapActions} from "vuex"
export default {
    methods:{
        ...mapMutations(["setInfo"]),
        ...mapActions(["login"]),
        submitForm(formName) {
            // console.log(this.$api)
            // 验证方法

            // valid: 验证是否通过的boolean
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    // this.login(this.ruleForm);
                    this.$http.post(this.$api.userlogin,this.ruleForm).then(res=>{
                        console.log(res)
                        // 登录成功 
                        if(res.code==200){
                          this.$message.success(res.msg)
                            // 将数据保存在 sessionStorage中
                            sessionStorage.setItem("token",res.list.token);
                            sessionStorage.setItem("info",JSON.stringify(res.list))
                            //保存在vuex
                            this.setInfo({
                                token:res.list.token,
                                info:res.list
                            })
                            this.$router.push("/");
                        }else{
                            this.$message.error(res.msg);
                        }
                    })

                } else {
                    return false;
                }
            });
        },
    },
  data() {

    //   自定义的验证规则
    var checkUsername = (rule, value, callback) => {
        if (!value) {
            return callback(new Error('账号名称不能为空'));
        }
        if (value.length<3&&value.length>7) {
            callback(new Error('长度在 3 到 7 个字符'));
        } else {
            var reg = /^[a-zA-Z]{3,7}$/g;
            if(!reg.test(value)){
                callback(new Error('长度在 3 到 7 个字符纯字母'));
            }else{
                callback()
            }
        }

    }
    return {
      ruleForm: {
        username: "",
        password: ""
      },
      rules: {
        //   验证prop 为 username 的表单域
        username: [
          // 每一个对象都是一条验证规则

        //   required:是否必填  message :没有填入的提示信息  trigger 触发时机：失焦
          /* { required: true, message: "请输入管理员名称", trigger: "blur" },
          { min: 3, max: 6, message: "长度在 3 到 6 个字符", trigger: "blur" } */
          {validator:checkUsername,trigger: "blur"}
        ],
        password: [
          // 每一个对象都是一条验证规则

        //   required:是否必填  message :没有填入的提示信息  trigger 触发时机：失焦
          { required: true, message: "请输入管理员密码", trigger: "blur" },
          { min: 3, max: 6, message: "长度在 3 到 6 个字符", trigger: "blur" }
        ]
      }
    };
  }
};
</script>
<style lang="less">
.login_bg {
  width: 100%;
  height: 100%;
  position: relative;
  /* 线型渐变 */
  background: -webkit-linear-gradient(left, #FFFC23, #FEDA1A, #E9A512);
  .login_box {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto;
    width: 500px;
    height: 300px;
    text-align:center;
    background-color: #fff;
    border-radius: 10px;
    h1{text-align: center;
    margin:30px 0 10px 0;
    }
    .el-button--primary {
      width: 20%;
    }
    .el-input{
      width:80%;
    }
  }
}
</style>