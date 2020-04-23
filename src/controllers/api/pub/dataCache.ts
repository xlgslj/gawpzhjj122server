import * as IChttp from '../../manage/IChttp'
import {CRobj} from '../../manage/baseClass'
import * as SysCache from '../../../utils/sys/SysCache'
let route = new CRobj();

route.get('/api/pub/datacache/del', async (ctx, next) => {
    try
    {    
        let params = ctx.query
        SysCache.event.emit("datacache-del", params)
        let ret = new  IChttp.CRet(1);
        ctx.response.body = ret;
    } catch (e) {
        const ret = new  IChttp.CRet(0,`${ctx.request.url} 错误: ${e}`);
        ret.msg = e.toString();
        ctx.response.body = ret
    }
})

export {route}