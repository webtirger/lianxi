import Vue from "vue"
import Vuex from "vuex"
import {post} from "./../utils/http"
import api from "./../API/index"
import router from "./../router"

import { Message } from 'element-ui';
Vue.use(Vuex);


let store = new Vuex.Store({
    state:{
        // 刷新后， vuex 数据会消失，需要从sessionStorage 中重新获取
        token:sessionStorage.getItem("token")?sessionStorage.getItem("token"):"",
        info:sessionStorage.getItem("info")?JSON.parse(sessionStorage.getItem("info")):{}
    },
    mutations:{
        setInfo(state,payload){
            state.token = payload.token;
            state.info = payload.info;
        },
        clearInfo(state){
            state.token="",
            state.info = "";
        }
    },
    actions:{
        login(contxt,payload){
            console.log(this)
            post(api.userlogin,payload).then(res=>{
                // console.log(res)
                // 登录成功 
                if(res.code==200){
                    // 将数据保存在 sessionStorage中
                    sessionStorage.setItem("token",res.list.token);
                    sessionStorage.setItem("info",JSON.stringify(res.list))
                    //保存在vuex
                    contxt.commit("setInfo",{token:res.list.token,info:res.list})
                    router.push("/");
                }else{
                    Message.error(res.msg);
                }
            }) 
        }
    }
})

export default store;