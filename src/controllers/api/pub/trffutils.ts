import * as IChttp from '../../manage/IChttp'
import {CRobj} from '../../manage/baseClass'
import * as db from '../../../db/db_trff'

let route = new CRobj();

route.get('/api/pub/trff/getpolice', async (ctx, next) => {
    try
    {    
        let params = ctx.query
        let result =  await db.query(" select * from BAS_POLICE order by xm")
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