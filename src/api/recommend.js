import jsonp from 'common/js/jsonp'
import {commonParams,options} from './config'
import axios from 'axios'


// 获取轮播图的数据
export function getRecommend(){
    const url = 'https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg'
    const data=Object.assign({},commonParams,{
        platform:'h5',
        uin:0,
        needNewCode:1
    })

    return jsonp(url,data,options)
}

//获取热门歌单
export function getDiscList() {
  const url = '/api/getDiscList'
  const data = Object.assign({}, commonParams, {
    platform: 'yqq',
    hostUin: 0,
    sin: 0,
    ein: 29,
    sortId: 5,
    needNewCode: 0,
    categoryId: 10000000,
    rnd: Math.random(),
    format: 'json'
  })
  // 通过dec-server 代理跨域
  return axios.get('/api/getDiscList', {
    params: data
  }).then((res) => {
    // 这里干嘛还要返回一个promise对象??
    return Promise.resolve(res.data)
  }).catch((error)=>{
    console.log(error);
  })
}