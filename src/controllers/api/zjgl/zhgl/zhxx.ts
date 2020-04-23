import * as IChttp from '../../../manage/IChttp'
import {CRobj} from '../../../manage/baseClass'
import * as sysvar from '../../../../config/sysvar'
import * as db from '../../../../db/db_pzhjj'
let route = new CRobj();

route.get('/api/zjgl/zhgl/zhxx/getvio', async (ctx, next) => {
    try
    {   
        let params = ctx.query
        let where = ` where hdbj in ('0','1','2','4') ${params.hdbj ==='D' ? " and bklb <>'R'" : ''}`
        where = where + (params.hdbj ? ` and hdbj='${params.hdbj ==='D' ? '0' :params.hdbj}'` : '')
        where = where + (params.cjjgno ? ` and cjjgno='${params.cjjgno}'` : '')
        where = where + (params.cjmj ? ` and cjmj='${params.cjmj}'` : '')
        where = where + (params.hphm ? ` and hphm like '%${params.hphm}%'` : '')
        where = where + (params.hpzlno ? ` and hpzlno='${params.hpzlno}'` : '')
        where = where + (params.wfddno ? ` and wfddno='${params.wfddno}'` : '')
        where = where + (params.wzxwno ? ` and wzxwno='${params.wzxwno}'` : '')
        where = where + (params.kssj ? ` and wfsj>=to_date('${params.kssj}','yyyy-mm-dd') and wfsj<=to_date('${params.jssj}','yyyy-mm-dd') ` : '')
        
        let start = ((params.currentPage || 1) - 1) * (params.size || 200) + 1
        let end = (params.currentPage || 1) * (params.size  || 200)

        let sqls = []
        let insql = `select a.*, to_char(wfsj,'yyyy-mm-dd hh24:mi:ss') fwfsj,${params.hdbj === 'D' ? '1' : '0'}  imgfrom from ${sysvar.wztcDb} ${params.hdbj === 'D' ? 'vio_zhxx_ext_temp' : 'vio_zhxx'} a ${where} order by wfsj`
        sqls.push(db.query(" select * from ( select rownum as rowxh,t.* from  (" + insql + ") t)  where rowxh>=" + start +" and rowxh<=" + end +" order by rowxh"))
        sqls.push(db.query("select count(*) as count from (" + insql + ")"))
        let result = await Promise.all(sqls)

        let ret = new  IChttp.CRet(1, 'total');
        ret.data = result[0]
        ret['total'] = result[1][0].COUNT
        ctx.response.body = ret;
    } catch (e) {
        const ret = new  IChttp.CRet(0,`${ctx.request.url} 错误: ${e}`);
        ret.msg = e.toString();
        ctx.response.body = ret
    }
})

route.get('/api/zjgl/zhgl/zhxx/getlog', async (ctx, next) => {
    try
    {   
        let params = ctx.query
        let result = await db.query(`select a.*, to_char(sj,'yyyy-mm-dd hh24:mi:ss') fsj from ${sysvar.wztcDb}log a where hphm='${params.HPHM}' and hpzl='${params.HPNAME}' and wfsj=to_date('${params.FWFSJ}', 'yyyy-mm-dd hh24:mi:ss') order by sj`)

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