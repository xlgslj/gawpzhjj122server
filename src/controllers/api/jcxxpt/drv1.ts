import * as IChttp from '../../manage/IChttp'
import {CRobj} from '../../manage/baseClass'
import * as db from '../../../db/db_pzhjj'
import * as getveh from '../../../utils/sys/getveh'
import * as jcxxpt from '../../../db/model/jcxxpt'

let route = new CRobj();

route.post('/api/jcxxpt/drv/add', async (ctx, next) => {
    try
    {
        let params=ctx.request.body
        params.dataParser({
            CCLZRQ: 'date',
            CSRQ: 'date',
            QFRQ: 'date',
            SYRQ: 'date',
            YXQS: 'date',
            YXQZ:'date'
        })
        let model = await db.model({table: 'BAS_TRANSPCORP_DRV',id: 'XH'});
        let entities =await model(params)
        await entities.insert()

        let ret = new  IChttp.CRet(1);
        ctx.response.body = ret;
    } catch (e) {
        const ret = new  IChttp.CRet(0,`${ctx.request.url} 错误: ${e}`);
        ret.msg = e.toString();
        ctx.response.body = ret
    }
})

export {route}