import * as IChttp from '../../manage/IChttp'
import {CRobj} from '../../manage/baseClass'
import * as db from '../../../db/db_pzhjj'
import * as myroute from '../../../utils/sys/route'
let route = new CRobj();

route.get('/api/jcxxpt/unit/isexit', async (ctx, next) => {
    try
    {    
        let params = ctx.query
        let where = params.where
        let w = where ? (' where ' + where ) : ''
        let res =  await db.query("select * from BAS_TRANSPCORP" + w)
        let ret = new  IChttp.CRet(1);
        ret.data = res.length ? res[0] : null
        ctx.response.body = ret;
    } catch (e) {
        const ret = new  IChttp.CRet(0,`${ctx.request.url} 错误: ${e}`);
        ret.msg = e.toString();
        ctx.response.body = ret
    }
})

route.get('/api/jcxxpt/unit/query', async (ctx, next) => {
    try
    {    
        let params = ctx.query
        let result =  await db.query("select * from BAS_TRANSPCORP")
        let ret = new  IChttp.CRet(1);
        ret.data = result
        ctx.response.body = ret;
    } catch (e) {
        const ret = new  IChttp.CRet(0,`${ctx.request.url} 错误: ${e}`);
        ret.msg = e.toString();
        ctx.response.body = ret
    }
})


route.get('/api/jcxxpt/unit/getunitlist', async (ctx, next) => {
    try
    {    
        let params = ctx.query

        let w = params.where ? (' where ' + params.where ) : ''
        let start = ((params.currentPage || 1) - 1) * (params.size || 1000) + 1
        let end = (params.currentPage || 1) * (params.size  || 1000)
        let sqls = []
        let insql = "select c.drvcount,b.vehcount,a.* from (select * from BAS_TRANSPCORP" + w +") a "
         + ", (select qybh,count(qybh) as vehcount from BAS_TRANSPCORP_VEH group by qybh) b"
         + ", (select qybh,count(qybh) as drvcount from (select * from (select a1.qybh,b1.xh as vehxh from BAS_TRANSPCORP a1 inner join BAS_TRANSPCORP_VEH b1 on a1.qybh = b1.qybh) c1 inner join BAS_TRANSPCORP_drv_VEH d1 on c1.vehxh = d1.xh) group by qybh) c"
         + "  where a.qybh = b.qybh(+) and a.qybh = c.qybh(+)"
        sqls.push(db.query(" select * from ( select rownum as rowxh,t.* from  (" + insql + ") t)  where rowxh>=" + start +" and rowxh<=" + end +" order by rowxh"))
        sqls.push(db.query("select count(*) as count from (" + insql + ")"))
        let result =  await Promise.all(sqls)

        let ret = new  IChttp.CRet(1, 'total');
        ret.data = result[0]
        ret["total"] = result[1][0].COUNT
        ctx.response.body = ret;
    } catch (e) {
        const ret = new  IChttp.CRet(0,`${ctx.request.url} 错误: ${e}`);
        ret.msg = e.toString();
        ctx.response.body = ret
    }
})

route.get('/api/jcxxpt/unit/getunit', async (ctx, next) => {
    try
    {    
        let params = ctx.query
        let result =  await db.query(`select * from BAS_TRANSPCORP where qybh ='${params.qybh}'`)
        let ret = new  IChttp.CRet(1);
        ret.data = result[0]
        ctx.response.body = ret;
    } catch (e) {
        const ret = new  IChttp.CRet(0,`${ctx.request.url} 错误: ${e}`);
        ret.msg = e.toString();
        ctx.response.body = ret
    }
})

route.get('/api/jcxxpt/unit/getunitvehs', async (ctx, next) => {
    try
    {    
        let params = ctx.query
        let qybh = params.qybh
        let start = ((params.currentPage || 1) - 1) * (params.size || 1000) + 1
        let end = (params.currentPage || 1) * (params.size  || 1000)
        let sqls = []
        sqls.push(db.query("select * from ( select rownum as rowxh,t.* from  ( select * from BAS_TRANSPCORP_VEH  where qybh='" + qybh + "') t)  where rowxh>=" + start +" and rowxh<=" + end +" order by rowxh"))
        sqls.push(db.query("select count(*) as count from BAS_TRANSPCORP_VEH where qybh='" + qybh + "'"))
        let result =  await Promise.all(sqls)

        let ret = new  IChttp.CRet(1, 'total');
        ret.data = result[0]
        ret["total"] = result[1][0].COUNT
        ctx.response.body = ret;
    } catch (e) {
        const ret = new  IChttp.CRet(0,`${ctx.request.url} 错误: ${e}`);
        ret.msg = e.toString();
        ctx.response.body = ret
    }
})


route.get('/api/jcxxpt/unit/getunitroutes', async (ctx, next) => {
    try
    {    
        let params = ctx.query
        let w = " where qybh='" + params.qybh + "'"
        let routes =  await db.query("select  b.xh as routexh,a.*,b.* from (select * from BAS_TRANSPCORP_VEH" + w + ") a inner join BAS_TRANSPCORP_VEH_ROUTE b on a.xh=b.vehxh")
        let ret = new  IChttp.CRet(1);
        ret.data = await myroute.getgis(routes)
        ctx.response.body = ret;
    } catch (e) {
        const ret = new  IChttp.CRet(0,`${ctx.request.url} 错误: ${e}`);
        ret.msg = e.toString();
        ctx.response.body = ret
    }
})

route.get('/api/jcxxpt/unit/getunitdrvs', async (ctx, next) => {
    try
    {    
        let params = ctx.query
        let start = (params.currentPage-1)*params.size+1
        let end = params.currentPage*params.size
        let qybh = params.qybh
        let sqls = []
        let insql = "select * from (select b.sfzmhm as sfzmhm1,a.* from (select xh as vehxh ,hphm as vehhphm,hpzl as vehhpzl from BAS_TRANSPCORP_VEH where qybh='" + qybh + "' ) a inner join BAS_TRANSPCORP_DRV_VEH b on a.vehxh = b.xh)  c , BAS_TRANSPCORP_DRV d where c.sfzmhm1 = d.sfzmhm(+)"
        sqls.push(db.query(" select * from ( select rownum as rowxh,t.* from  (" + insql + ") t)  where rowxh>=" + start +" and rowxh<=" + end +" order by rowxh"))
        sqls.push(db.query("select count(*) as count from (" + insql + ")"))
        let res = await Promise.all(sqls)
        let ret = new  IChttp.CRet(1, 'total');
        ret.data = res[0]
        ret['total'] = res[1][0].COUNT
        ctx.response.body = ret;
    } catch (e) {
        const ret = new  IChttp.CRet(0,`${ctx.request.url} 错误: ${e}`);
        ret.msg = e.toString();
        ctx.response.body = ret
    }
})

export {route}