export default class Singer{
    constructor(name,id){
        this.name=name
        this.id=id
        this.avatar=`https://y.gtimg.cn/music/photo_new/T001R300x300M000${id}.jpg?max_age=2592000`
    }
}


// export default class Singer {
    // 传入一个对象??解构赋值?
//     constructor({id, name}) {
//       this.id = id
//       this.name = name
//       this.avatar = `https://y.gtimg.cn/music/photo_new/T001R300x300M000${id}.jpg?max_age=2592000`
//     }
//   }