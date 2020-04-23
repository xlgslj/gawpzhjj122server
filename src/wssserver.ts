import  * as ws from 'ws';
import * as SysCache from './utils/sys/SysCache'
import { ftruncate } from 'fs';
/*
var wss = new ws.Server( { server: server, port: 8444} );//把创建好的https服务器丢进websocket的创建函数里，ws会用这个服务器来创建wss服务
//同样，如果丢进去的是个http服务的话那么创建出来的还是无加密的ws服务
wss.on( 'connection', function ( wsConnect ) {
    wsConnect.on( 'message', function ( message ) {
        console.log( message );
    });
});   */
let data = {
    onlineclients: []
}
let wss;
export function run () {
    const wss = new ws.Server({ port: 8002 });

    console.log(`WSS服务器启动成功, port:${8002}`)
    wss.on('connection', function connection(ws, req) {
        let path = req.url.split("/")
        let uuid = path[1]
        data.onlineclients.push({
            uuid: uuid,//页面唯一id
            client: ws
        })
        ws.on('close', function(code) {
            // console.log('关闭连接11', code,req.url)
            // 客户端关闭,清除其所有已打开页面数据,通过uuid
            let path = req.url.split("/")
            let uuid = path[1]
            let idx = data.onlineclients.findIndex(d => d.uuid === uuid)
            if (idx > -1) {
                let appid = data.onlineclients[idx].appid
                if (appid) {
                    let params = {
                        scoped: "app",
                        appid: appid
                    }
                    SysCache.event.emit("datacache-del", params)
                }
                data.onlineclients.splice(idx, 1)
            }
            updateusers()
        }) 
    }); 
    
}
//广播
let send = function (msg){
    data.onlineclients.forEach(item=> {
      if (item.client.readyState === ws.OPEN) {
        let m = JSON.stringify(msg)
        item.client.send(m);
      }
    });
}

//指定appid发送
let sendtobyappid = function (appids:string[], msg) {
    data.onlineclients.forEach(item => {
        if (appids.findIndex(d => d === item.appid) > -1) {
            if (item.client.readyState===1){
                item.client.send(JSON.stringify(msg));
            }            
        }
    })
}

//指定uuid(页面生成唯一ID)发送
let sendtobyuuid = function (uuids: string[], msg) {
    data.onlineclients.forEach(item => {
        if (uuids.findIndex(d => d === item.uuid) > -1) {
            if (item.client.readyState===1){
                item.client.send(JSON.stringify(msg));
            }            
        }
    })
}

//指定uuid(页面生成唯一ID)发送
let sendtobyuid = function (uids: number[], msg) {
    data.onlineclients.forEach(item => {
        if (uids.findIndex(d => d === item.uid) > -1) {
            if (item.client.readyState===1){
                item.client.send(JSON.stringify(msg));
            }            
        }
    })
}

//公布用户
let updateusers = () => {
    let yxyh = [] //有效用户
    for (let o of data.onlineclients) {
        if (o.uid) {
            yxyh.push({
                id: o.uid,
                name: o.name
            })
        }
    }
    send({event:'updateusers', users:yxyh});
}

export {send, sendtobyappid, sendtobyuuid, sendtobyuid, updateusers, data}