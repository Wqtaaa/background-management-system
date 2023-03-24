import axios from 'axios'

const http = axios.create({
    //通用请求的地址前缀
    baseURL: '/api',
    timeout: 10000,//超时时间
})

http.interceptors.request.use(function (config) {
    //在发送请求之前做些什么
    return config;
}, function (error) {
    //对请求错误做些什么
    return Promise.reject(error)
})

http.interceptors.response.use(function (response) {
    //对相应数据做点什么
    return response;
}, function (error) {
    //对响应错误做点什么
    return Promise.reject(error)
})


export default http