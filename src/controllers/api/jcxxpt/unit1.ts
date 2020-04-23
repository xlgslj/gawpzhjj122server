import * as IChttp from '../../manage/IChttp'
import {CRobj} from '../../manage/baseClass'
import * as db from '../../../db/db_pzhjj'
import  token from '../../../utils/tools/token'

let route = new CRobj();

route.post('/api/jcxxpt/unit/unitadd', async (ctx, next) => {
    try
    {
        let unit=ctx.request.body
        let logininfo = token.getinfoFromReq(ctx)
        unit.QYBH = await db.maxid();
        unit.CJSJ = new Date()
        unit.GXSJ = new Date()
        unit.JLZT = '1'
        unit.JBR = logininfo.NAME

        let model = await db.model({table: 'BAS_TRANSPCORP',id: 'qybh'});
        let entities =await model(unit)
        await entities.insert()


        let ret = new  IChttp.CRet(1);
        ret.data =unit.QYBH 
        ctx.response.body = ret;
    } catch (e) {
        const ret = new  IChttp.CRet(0,`${ctx.request.url} 错误: ${e}`);
        ret.msg = e.toString();
        ctx.response.body = ret
    }
})

route.post('/api/jcxxpt/unit/unitupdate', async (ctx, next) => {
    try
    {
        let unit=ctx.request.body.unit
        let logininfo = token.getinfoFromReq(ctx)
        unit.GXSJ = new Date()
        unit.JBR = logininfo.NAME
        delete unit["CJSJ"]

        let model = await db.model({table: 'BAS_TRANSPCORP',id: 'QYBH'});
        let entities =await model(unit)
        await entities.update()


        let ret = new  IChttp.CRet(1);
        ret.data =unit.QYBH 
        ctx.response.body = ret;
    } catch (e) {
        const ret = new  IChttp.CRet(0,`${ctx.request.url} 错误: ${e}`);
        ret.msg = e.toString();
        ctx.response.body = ret
    }
})

route.post('/api/jcxxpt/unit/unitbindgis', async (ctx, next) => {
    try
    {
        let data=ctx.request.body
        let model = await db.model({table: 'BAS_TRANSPCORP',id: 'QYBH'});
        let entities =await model({
            QYBH: data.qybh,
            DTZB: data.dtzb
        })
        await entities.update()

        let ret = new  IChttp.CRet(1);
        ctx.response.body = ret;
    } catch (e) {
        const ret = new  IChttp.CRet(0,`${ctx.request.url} 错误: ${e}`);
        ret.msg = e.toString();
        ctx.response.body = ret
    }
})

route.post('/api/jcxxpt/unit/unitunbindgis', async (ctx, next) => {
    try
    {
        let qybh=ctx.request.body.qybh
        let model = await db.model({table: 'BAS_TRANSPCORP',id: 'QYBH'});
        let entities =await model({
            QYBH: qybh,
            DTZB: ''
        })
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