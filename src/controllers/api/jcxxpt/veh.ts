import * as IChttp from '../../manage/IChttp'
import {CRobj} from '../../manage/baseClass'
import * as db from '../../../db/db_pzhjj'
import * as getveh from '../../../utils/sys/getveh'
import * as jcxxpt from '../../../db/model/jcxxpt'
import * as myroute from '../../../utils/sys/route'
let route = new CRobj();

route.get('/api/jcxxpt/veh/getvehlist', async (ctx, next) => {
    try
    {
        let params=ctx.query
        let w = params.where ? (' where ' + params.where ) : ''
        let start = ((params.currentPage || 1) - 1) * (params.size || 1000) + 1
        let end = (params.currentPage || 1) * (params.size  || 1000)
        let sqls = []
        let insql = "select * from  (select b.dwmc,a.* from BAS_TRANSPCORP_VEH a,BAS_TRANSPCORP b where a.QYBH = b.QYBH(+))" + w
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

route.get('/api/jcxxpt/veh/getveh', async (ctx, next) => {
    try
    {
        let params=ctx.query
        let from = params.from
        let veh,source
        let vehdb = null
        if (from) {
            if (from === 'webservice') {
                veh = await getveh.fromWebservice(params.hphm, params.hpzl)
                veh.HPHM = params.hphm
            }
            else veh = await getveh.fromjcxxpt(params.hphm, params.hpzl)
            source = from
        } else {
            veh = await getveh.fromjcxxpt(params.hphm, params.hpzl)
            if (veh) {
                source = 'jcxxpt'
            } else {
                veh = await getveh.fromWebservice(params.hphm, params.hpzl)
                source = 'websrvice'
                if (veh) {
                    veh.HPHM = params.hphm
                    vehdb = veh.copyToModel(jcxxpt.BAS_TRANSPCORP_VEH)
                } 
            }
        }
        let ret = new  IChttp.CRet(1, 'source');
        ret.data = veh
        ret['source'] = source
        ret['data1'] = vehdb
        ctx.response.body = ret;
    } catch (e) {
        const ret = new  IChttp.CRet(0,`${ctx.request.url} 错误: ${e}`);
        ret.msg = e.toString();
        ctx.response.body = ret
    }
})

route.get('/api/jcxxpt/veh/getdrvs', async (ctx, next) => {
    try
    {
        let params=ctx.query
        let start = ((params.currentPage || 1) - 1) * (params.size || 1000) + 1
        let end = (params.currentPage || 1) * (params.size  || 1000)
        let sqls = []
        let insql = "select a.*,b.* from (select xh as xh1,sfzmhm as sfzmhm1 from BAS_TRANSPCORP_DRV_VEH where xh ='" + params.xh + "') a,BAS_TRANSPCORP_DRV b where a.sfzmhm1 = b.sfzmhm(+)"
        sqls.push(db.query(" select * from ( select rownum as rowxh,t.* from  (" + insql + ") t)  where rowxh>=" + start +" and rowxh<=" + end +" order by rowxh"))
        sqls.push(db.query("select count(*)  as count from BAS_TRANSPCORP_DRV_VEH where xh ='" + params.xh + "'"))
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

route.get('/api/jcxxpt/veh/routesofvehs', async (ctx, next) => {
    try
    {
        let params=ctx.query
        let where = params.where
        let w = where ? (' where ' + where ) : ''
        let result =  await db.query("select  b.xh as routexh,a.*,b.* from (select * from BAS_TRANSPCORP_VEH" + w + ") a inner join BAS_TRANSPCORP_VEH_ROUTE b on a.xh=b.vehxh")

        let ret = new  IChttp.CRet(1);
        ret.data = await myroute.getgis(result)
        ctx.response.body = ret;
    } catch (e) {
        const ret = new  IChttp.CRet(0,`${ctx.request.url} 错误: ${e}`);
        ret.msg = e.toString();
        ctx.response.body = ret
    }
})

export {route}