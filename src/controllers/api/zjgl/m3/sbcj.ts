import * as IChttp from '../../../manage/IChttp'
import {CRobj} from '../../../manage/baseClass'
import * as db from '../../../../db/db_pzhjj'
import * as tl from '../../../../utils/sys/threadlock'
import token from '../../../../utils/tools/token'
import * as SysCache from '../../../../utils/sys/SysCache'
import * as sysconfig from '../../../../config/sysconfig'
import * as sysvar from '../../../../config/sysvar'
import * as sbcjsrv from '../sbcjsrv'

let route = new CRobj();

route.get('/api/zjgl/m3/sbcj/getdata', async (ctx, next) => {
    await tl.lock.acquire('dataCache',async function(done) {
        try {
            let params=ctx.query
            let logininfo = token.getinfoFromReq(ctx)
            let where = "where bklb='3' and hdbj='0' and xh not in " + SysCache.dataCache.get("m3", "sbcj")
            let start = 1
            let end = (await sysconfig.getrows('configbase',(item)=> {
                return  item.KEYWORD === 'DTTQWFJLS'
            }))[0].V1
            let result = await db.query(" select * from ( select rownum as xh1,t.* from  ( select * from "+ sysvar.wztcDb + "VIO_ZHXX_EXT_TEMP " + where + " order by wfsj) t)  where xh1>=" + start +" and xh1<=" + end +" order by xh1")
            result.forEach(item => {
                item.dataParser({
                    WFSJ: 'datestr'
                })
            });
            let xhs = result.map(item => {
                return item.XH
            })
            let ret = new  IChttp.CRet(1, 'pagecacheid');
            ret.data =result
            ret["pagecacheid"] = SysCache.dataCache.add(logininfo.appid, "m3", "sbcj", logininfo.ID, xhs)   
            ctx.response.body = ret;
            done()  
        } catch (e) {
            const ret = new  IChttp.CRet(0,`${ctx.request.url} 错误: ${e}`);
            ret.msg = e.toString();
            ctx.response.body = ret
            done()
        }
    }, null).then(function() {
        // lock released
    })
})


route.post('/api/zjgl/m3/sbcj/shtg', async (ctx, next) => {
    try {
        let params=ctx.request.body
        let logininfo = token.getinfoFromReq(ctx)
        //var ip =ctx.headers['x-real-ip'] || ctx.headers['x-forwarded-for'] || ctx.connection.remoteAddres || ctx.socket.remoteAddress || '';
        params.ip = null
        params.dwno = logininfo.DWNO
        params.dwname = logininfo.DWNAME
        params.uid = logininfo.ID
        params.loginname = logininfo.loginname
        params.name = logininfo.NAME
        await sbcjsrv.shtghandler(params)
        let ret = new  IChttp.CRet(1);
        ret['hdbj'] = '2'
        ctx.response.body = ret;
    } catch (e) {
        const ret = new  IChttp.CRet(0,`${ctx.request.url} 错误: ${e}`);
        ret.msg = e.toString();
        ret['hdbj'] = 'E'
        ctx.response.body = ret
    }
})

route.post('/api/zjgl/m3/sbcj/sqshbtg', async (ctx, next) => {
    try {
        let params=ctx.request.body
        let logininfo = token.getinfoFromReq(ctx)
        //var ip =ctx.headers['x-real-ip'] || ctx.headers['x-forwarded-for'] || ctx.connection.remoteAddres || ctx.socket.remoteAddress || '';
        params.ip = null
        params.dwno = logininfo.DWNO
        params.dwname = logininfo.DWNAME
        params.uid = logininfo.ID
        params.loginname = logininfo.loginname
        params.name = logininfo.NAME
        await sbcjsrv.sqshbtghandler(params)
        let ret = new  IChttp.CRet(1);
        ret['hdbj'] = '5'
        ctx.response.body = ret;
    } catch (e) {
        const ret = new  IChttp.CRet(0,`${ctx.request.url} 错误: ${e}`);
        ret.msg = e.toString();
        ret['hdbj'] = 'E'
        ctx.response.body = ret
    }
})


export {route}