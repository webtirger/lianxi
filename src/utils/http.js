import axios from "axios"


// 添加一个请求拦截器，回调函数会在发出请求时执行
// config:请求配置
axios.interceptors.request.use(config => {
    // Do something before request is sent

    // console.log(config)
    let token = sessionStorage.getItem("token") ? sessionStorage.getItem("token") : "";
    config.headers.Authorization = token;
    return config;
}, error => {
    // Do something with request error
    return Promise.reject(error);
});


// 响应拦截器

axios.interceptors.response.use(response => {
    // Do something before response is sent
    return response.data;
}, error => {
    // Do something with response error
    return Promise.reject(error);
});


function get(url,params={}){

    return new Promise((resolve,reject)=>{
        axios({
            method: 'get',
            url,
            params
          }).then((data)=>{
              resolve(data)
          }).catch(err=>{
              reject(err);
          })
    })
}

function post(url,data={}){

    return new Promise((resolve,reject)=>{
        axios({
            method: 'post',
            url,
            data
          }).then((data)=>{
              resolve(data)
          }).catch(err=>{
              reject(err);
          })
    })
}

export {get,post}