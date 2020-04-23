import * as IChttp from '../../manage/IChttp'
import {CRobj} from '../../manage/baseClass'
import * as sysvar from '../../../config/sysvar'
import { resolve } from 'dns';
var fs = require('fs');
const pathlib = require('path');
let route = new CRobj();

let readimg = (path) => {
    return new Promise((resolve, reject) => {
        fs.readFile(path,function (err,data) {
            if (!err){
                resolve(data)
            }else {
                reject(err.message)
            }
        })        
    })
}

route.get('/photo0/:yy/:mm/:dd/:lb/:img', async (ctx, next) => {
    try
    {   
        let path = ctx.params
        let imgpath =pathlib.resolve( sysvar.localrootpath + path.yy + '/' + path.mm + '/' + path.dd + '/' + path.lb +'/' + path.img)
        let img = await readimg(imgpath)
        ctx.status = 200;
        ctx.set('Content-Type','image/jpeg')
        ctx.response.body = img;
    } catch (e) {
        const ret = new  IChttp.CRet(0,`${ctx.request.url} 错误: ${e}`);
        ret.msg = e.toString();
        ctx.response.body = ret
    }
})


route.get('/photo1/:yy/:mm/:dd/:lb/:img', async (ctx, next) => {
    try
    {   
        let path = ctx.params
        let imgpath =pathlib.resolve( sysvar.extimgrootpath + path.yy + '/' + path.mm + '/' + path.dd + '/' + path.lb +'/' + path.img)
        let img = await readimg(imgpath)
        ctx.status = 200;
        ctx.set('Content-Type','image/jpeg')
        ctx.response.body = img;
    } catch (e) {
        const ret = new  IChttp.CRet(0,`${ctx.request.url} 错误: ${e}`);
        ret.msg = e.toString();
        ctx.response.body = ret
    }
})

export {route}