import * as IChttp from '../../manage/IChttp'
import {CRobj} from '../../manage/baseClass'
import * as db from '../../../db/db_pzhjj'
import * as sysvar from '../../../config/sysvar'
let route = new CRobj();

route.get('/api/zjgl/dy/get', async (ctx, next) => {
    try {
        let params=ctx.query
        let result = await db.query("select * from " + sysvar.wztcDb + "jkcl_dy where lb='501' and cjjgno='510400000000' order by xh")
        let ret = new  IChttp.CRet(1);
        ret.data = result
        ctx.response.body = ret;
    } catch (e) {
        const ret = new  IChttp.CRet(0,`${ctx.request.url} 错误: ${e}`);
        ret.msg = e.toString();
        ctx.response.body = ret
    }
})

route.post('/api/zjgl/dy/add', async (ctx, next) => {
    try {
        let params=ctx.request.body
        let p = {
            XH: await db.maxid(),
            CJJGNO: '510400000000',
            LB: '501',
            SQYY: params.sqyy
        }
        let model = await db.model({table: sysvar.wztcDb + "jkcl_dy", id: 'XH'})
        let entities = await model(p)
        await entities.insert()
        let ret = new  IChttp.CRet(1);
        ret.data = p
        ctx.response.body = ret;
    } catch (e) {
        const ret = new  IChttp.CRet(0,`${ctx.request.url} 错误: ${e}`);
        ret.msg = e.toString();
        ctx.response.body = ret
    }
})

route.post('/api/zjgl/dy/del', async (ctx, next) => {
    try {
        let params=ctx.request.body
        let p = {
            XH: params.xh
        }
        let model = await db.model({table: sysvar.wztcDb + "jkcl_dy", id: 'XH'})
        let entities = await model(p)
        await entities.delete()
        let ret = new  IChttp.CRet(1);
        ctx.response.body = ret;
    } catch (e) {
        const ret = new  IChttp.CRet(0,`${ctx.request.url} 错误: ${e}`);
        ret.msg = e.toString();
        ctx.response.body = ret
    }
})

route.post('/api/zjgl/dy/edit', async (ctx, next) => {
    try {
        let params=ctx.request.body
        let p = {
            XH: params.xh,
            SQYY: params.sqyy
        }
        let model = await db.model({table: sysvar.wztcDb + "jkcl_dy", id: 'XH'})
        let entities = await model(p)
        await entities.update()
        let ret = new  IChttp.CRet(1);
        ctx.response.body = ret;
    } catch (e) {
        const ret = new  IChttp.CRet(0,`${ctx.request.url} 错误: ${e}`);
        ret.msg = e.toString();
        ctx.response.body = ret
    }
})

export {route}