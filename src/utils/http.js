
import axios from 'axios'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

export default function(_method,_url,_data){
    var vm = this;
    return new Promise((resolve, reject) => {
        debugger;
        NProgress.start(); 
        axios({
            method: _method,
            url:_url,
            data:_data
        }).then((res)=>{
            resolve(res);
        })
        .catch((res) => {
            vm.$notify.error({
                title: '错误',
                message: res.response.data
            });
            reject(res);
        }).finally(()=>{
            NProgress.done(); 
        });

    });
}