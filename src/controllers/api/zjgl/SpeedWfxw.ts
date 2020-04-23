import * as IChttp from '../../manage/IChttp'
import {CRobj} from '../../manage/baseClass'
import * as db from '../../../db/db_pzhjj'
import * as sysvar from '../../../config/sysvar'

let route = new CRobj();

route.get('/api/zjgl/getSpeedWfxw', async (ctx, next) => {
    try
    {
        let params = ctx.query
        let scz = params.scz
        let bzz = params.bzz
        let syxz = params.syxz
        let cllx = params.cllx
        let dllx = '0'
        let v =parseFloat(((scz-bzz)/bzz).toFixed(2))
        let csbl = ( parseFloat( ((scz - bzz)/bzz).toFixed(2)) * 100).toFixed(0)
        let wfxw = await db.query(` select * from ${sysvar.wztcDb}wzxw where lb='3' and dllx='${dllx}' and csbfbxx<${csbl} and csbfbsx>=${csbl}
         and xsz1<${bzz} and xsz2>=${bzz} and (syxz like '%${syxz}%' or syxz='NO') and (cllx like '%${cllx}%' or cllx='NO') order by wzxw_id
        `)
        let ret = new  IChttp.CRet(1, 'total');
        ret.data = Object.assign(wfxw[0], {CSBL:csbl})
        ctx.response.body = ret;
    } catch (e) {
        const ret = new  IChttp.CRet(0,`${ctx.request.url} 错误: ${e}`);
        ret.msg = e.toString();
        ctx.response.body = ret
    }
})
export {route}