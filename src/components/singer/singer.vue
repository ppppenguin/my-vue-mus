<template>
  <div class="singer">
    <list-view :data="singer" ></list-view>
  </div>
</template>

<script type="text/ecmascript-6">
  // import ListView from 'base/listview/listview'
  import {getSingerList} from 'api/singer'
  import {ERR_OK} from 'api/config'
  // 在创建组件名字文件夹和文件都是全小写  引入就用驼峰命名法
  import ListView from 'base/listview/listview'
  import singer from 'common/js/singer'
  export default{
    data() {
      return {
        singer:[]
      }
    },
    created(){
      setTimeout(() => {
      this._getSingerList()
        
      }, 1000);
    },
    methods: {
      _getSingerList(){
          getSingerList().then((res)=>{
              if (res.code==ERR_OK) {
                this.singer=this._normalize(res.data.list)
              }
              console.log(res.data.list);
          })
      },
      _normalize(data){
        let map={
          'hot':{
            title: '热门',
            items: [],
          }
        }
        // 循环处理数据
        data.forEach((val,ind)=>{
            let key=val.Findex
            if (ind<10) {
              // map.hot.items.push({
              //   name: val.Fsinger_name,
              //   id: val.Fsinger_mid,
              //   avatar:`https://y.gtimg.cn/music/photo_new/T001R300x300M000${val.Fsinger_mid}.jpg?max_age=2592000`
              // })
              map.hot.items.push( new singer(val.Fsinger_name,val.Fsinger_mid) )
            }
            // 只有是字母才能压入
            let reg=new RegExp(/[a-zA-Z]/)
            if (!map[key]&&reg.test(key)) {
              map[key]={
                title:key,
                items:[],
              }
            }
            reg.test(key)&&map[key].items.push( new singer(val.Fsinger_name,val.Fsinger_mid) )
        })
        // 将map的标题按字母顺序排列
        let hot=[]
        let ret=[]
        for (const key in map) {
            const ele = map[key]
            if (key=='hot') {
              hot.push(ele)
            }else{
              ret.push(ele)
            }
        }
        ret.sort((a, b) => {
          return a.title.charCodeAt(0) - b.title.charCodeAt(0)
        })
        return hot.concat(ret)
      }
    },
    components: {
      ListView,
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .singer
    position: fixed
    top: 88px
    bottom: 0
    width: 100%
</style>

