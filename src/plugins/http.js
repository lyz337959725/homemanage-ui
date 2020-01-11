import Axios from "axios"

const MyHttp = {}

MyHttp.install = (Vue) => {
    Axios.defaults.baseURL = "http://localhost:8085"

    // 添加请求拦截器
    Axios.interceptors.request.use(function (config) {
        // 在发送请求之前做些什么
        if(config.url != "sys/login"){
            config.headers['Authorization'] = localStorage.getItem("token")
        }
        return config;
    }, function (error) {
        // 对请求错误做些什么
        return Promise.reject(error);
    });
    // 添加实例方法
    Vue.prototype.$axios = Axios
}

export default MyHttp