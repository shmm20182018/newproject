import axios from 'axios'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
var Promise = require('bluebird');

export default function(_method,_url,_data){
    var vm = this;
    return new Promise((resolve, reject) => {
        NProgress.start(); 
        axios({
            method: _method,
            url:_url,
            data:_data
        }).then((res)=>{
            resolve(res);
        })
        .catch((res) => {
            vm.$message({
                showClose: true,
                type: 'error',
                message: res.response.data
            });
            reject(res);
        }).finally(()=>{
            NProgress.done(); 
        });

    });
}