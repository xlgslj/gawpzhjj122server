
import * as IChttp from '../../../../manage/IChttp'
import {CRobj} from '../../../../manage/baseClass'
import * as db from '../../../../../db/db_pzhjj'
let route = new CRobj();
/***企业按重点对象类型group */
route.get('/api/zxxd/zczl/unithome/getzddx', async (ctx, next) => {
    try
    {
        let params=ctx.query

        let sqls = []
        sqls.push(db.query("select '1' as lx, '采集企业总数' as text,count(*) as val from BAS_TRANSPCORP"))
        sqls.push(db.query("select b.code as lx, b.val as text,a.sum as val from  (select zddxlx,count(*) as sum from BAS_TRANSPCORP group by zddxlx) a,codes b where a.zddxlx = b.code(+) and b.lx='dwlx'"))
        sqls.push(db.query("select '0' as lx, '未登记' as text,count(*) as val from BAS_TRANSPCORP where zddxlx is null"))
        let result = await  Promise.all(sqls)

        let ret = new  IChttp.CRet(1);
        ret.data = [...result[0], ...result[1], ... result[2]]
        ctx.response.body = ret;
    } catch (e) {
        const ret = new  IChttp.CRet(0,`${ctx.request.url} 错误: ${e}`);
        ret.msg = e.toString();
        ctx.response.body = ret
    }
})

export {route}