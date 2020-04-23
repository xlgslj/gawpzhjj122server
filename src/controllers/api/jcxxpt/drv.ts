import * as IChttp from '../../manage/IChttp'
import {CRobj} from '../../manage/baseClass'
import * as db from '../../../db/db_pzhjj'
import * as getdrv from '../../../utils/sys/getdrv'
import * as jcxxpt from '../../../db/model/jcxxpt'
let route = new CRobj();

route.get('/api/jcxxpt/drv/getdrvlist', async (ctx, next) => {
    try
    {    
        let params = ctx.query

        let w = params.where ? (' where ' + params.where ) : ''
        let start = ((params.currentPage || 1) - 1) * (params.size || 1000) + 1
        let end = (params.currentPage || 1) * (params.size  || 1000)
        let sqls = []
        let insql = "select * from BAS_TRANSPCORP_Drv" + w
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

route.get('/api/jcxxpt/drv/getdrv', async (ctx, next) => {
    try
    {    
        let params=ctx.query
        let from = params.from
        let drv,source
        let drvdb = null
        if (from) {
            if (from === 'webservice') {
                drv = await getdrv.fromWebservice(params.sfzmhm)
            }
            else drv = await getdrv.fromjcxxpt(params.sfzmhm)
            source = from
        } else {
            drv = await getdrv.fromjcxxpt(params.sfzmhm)
            if (drv) {
                source = 'jcxxpt'
            } else {
                drv = await getdrv.fromWebservice(params.sfzmhm)
                source = 'webservice'
                if (drv) {
                    drvdb = drv.copyToModel(jcxxpt.BAS_TRANSPCORP_DRV)
                } 
            }
        }
        let ret = new  IChttp.CRet(1, 'source');
        ret.data = drv
        ret['source'] = source
        ret['data1'] = drvdb
        ctx.response.body = ret;
    } catch (e) {
        const ret = new  IChttp.CRet(0,`${ctx.request.url} 错误: ${e}`);
        ret.msg = e.toString();
        ctx.response.body = ret
    }
})

route.get('/api/jcxxpt/drv/getdrv2veh2unit', async (ctx, next) => {
    try
    {    
        let params = ctx.query
        let result = await db.query("select a.sfzmhm,b.xh as vehxh,b.hphm,b.hpzl,c.qybh,c.zzjgdm,C.DWMC  from BAS_TRANSPCORP_DRV_VEH a,BAS_TRANSPCORP_VEH b,BAS_TRANSPCORP C where a.sfzmhm='" + params.sfzmhm + "' and A.XH = b.xh(+) and B.QYBH = c.qybh(+)")
        let ret = new  IChttp.CRet(1);
        ret.data = result
        ctx.response.body = ret;
    } catch (e) {
        const ret = new  IChttp.CRet(0,`${ctx.request.url} 错误: ${e}`);
        ret.msg = e.toString();
        ctx.response.body = ret
    }
})

export {route}