
import * as IChttp from '../manage/IChttp'
import {CRobj} from '../manage/baseClass'
import * as db from '../../db/db_pzhjj'
import * as  crypto from '../../utils/tools/crypt'
import  token from '../../utils/tools/token'
import * as websocket from '../../wssserver'
let route = new CRobj();

/**
 * 获取所有菜单，为动态创建组件用
 */
route.get('/api/login/login', async (ctx, next) => {
    try
    {
        let params=ctx.query
        let sql = "SELECT * FROM userdb where loginname='"+params.name+"'";
        let data = await db.query(sql)
 
        if (data.length === 0 ) throw "无此用户"
        if (data[0]["state"] === "停用") throw "账号被停用"
        let o=crypto.des.encrypt(params.pwd)
        if (o !== data[0].PWD)  throw "密码错误"

        let appid ="appid-" + data[0].id + "-" + (new Date()).getTime()
        ctx.set('token',token.createToken(JSON.stringify(Object.assign({}, data[0], {appid: appid}))))

        let idx = websocket.data.onlineclients.findIndex(d => d.uuid === params.UUID)
        if (idx > -1) {
            websocket.data.onlineclients[idx].appid = appid
            websocket.data.onlineclients[idx].uid = data[0].ID
            websocket.data.onlineclients[idx].name = data[0].NAME
        }
        websocket.updateusers()
        websocket.send({event:'logon', name: data[0].NAME});

        let ret = new  IChttp.CRet(1, "appid");
        ret["appid"] = appid
        ret.data = data[0]
        ctx.response.body = ret;
    } catch (e) {
        const ret = new  IChttp.CRet(0,`${ctx.request.url} 错误: ${e}`);
        ret.msg = e.toString();
        ctx.response.body = ret
    }
})
route.get('/api/login/getusermenus', async (ctx, next) => {
    let params=ctx.query
    let sql=''
    try {
        let ret = new  IChttp.CRet(1);
        if (params.qxlx === '角色权限' ) {
            sql='select IDS from roles where id in ('+params.qxs+')'
            const rols = await db.query(sql)
            let menus=[]
            rols.forEach(item => {
              menus=menus.concat(JSON.parse(item.IDS))
            });
            sql="select distinct * from menudb start with  id in ('"+menus.join("','")+"') connect by prior pid = id order by sort"  
            let data = await db.query(sql)  
            ret.data = data            

        } else {
            sql='select distinct * from menudb start with  id in ('+params.qxs+')  connect by prior pid = id order by sort'
            let data = await db.query(sql)  
            ret.data = data           
        }
        ctx.response.body = ret; 
    } catch (e) {
        const ret = new  IChttp.CRet(0,`${ctx.request.url} 错误: ${e}`);
        ret.msg = e.toString();
        ctx.response.body = ret
    }
  });

  route.get('/api/login/getonlines', async (ctx, next) => {
    let params=ctx.query
    try {
        let ret = new  IChttp.CRet(1);
        ret.data = websocket.data.onlineclients
        ctx.response.body = ret; 
    } catch (e) {
        const ret = new  IChttp.CRet(0,`${ctx.request.url} 错误: ${e}`);
        ret.msg = e.toString();
        ctx.response.body = ret
    }
  });
export {route}