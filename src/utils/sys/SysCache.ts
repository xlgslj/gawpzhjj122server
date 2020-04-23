let EventEmitter = require('events').EventEmitter; 
let event = new EventEmitter();
let tl=require('./threadlock')
const chalk = require('chalk'); // 带色彩的控制台输出
let data = []

let del = (p) => {
    tl.lock.acquire('dataCache',function(done) {
        if(p.scoped === "app") {
            // console.log("appid", p.appid)
            data = data.filter(item => {
                return !(item.appid===p.appid)
            })
        } else if (p.scoped === "page") {
            data = data.filter(item => {
                return !(item.pagecacheid===p.pagecacheid)
            })
        }
        let date = (new Date())["Format"]('yyyy-MM-dd HH:mm:ss')
        console.log(chalk.blue(date + " 数据集释放 " + data.length))
        done()
        /* let datax = webclient.get("/api/test/sleep").then((body)=>{
            console.log("异步读取: "+body)
            done()
        }) */
    },null).then(

    )
}

let get = (bk, mk) => {
    let a1 = data.filter(item => {
        return item.bk === bk && item.mk === mk
    })
    let fn = (prev, cur) =>{
        return prev.concat(cur.data)
    } 
    let  a2 = a1.reduce(fn, [])
    if(a2.length === 0) a2 = ["xxxxxxxxxx"]
    return "('" + a2.join("','") + "')"
}
let add = (appid, bk, mk,userid, ids) => {
    let d = (new Date()).getTime()
    let tag = bk + "-" + mk + "-" + userid + "-" + d
    data.push({
        appid: appid,
        bk: bk,
        mk: mk,
        userid: userid,
        date: d,
        pagecacheid: tag,
        data: ids
    })
    let date = (new Date())["Format"]('yyyy-MM-dd HH:mm:ss')
    console.log(chalk.blue(date + " 数据集锁定 " + bk + "/" + mk + " As " + userid + " " + data.length))
    return tag
}


event.on("datacache-del",del)


export const dataCache = {
    get: get,
    add: add,
    del: del
}

export {event }