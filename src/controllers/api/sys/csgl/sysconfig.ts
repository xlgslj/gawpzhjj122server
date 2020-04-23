import * as IChttp from '../../../manage/IChttp'
import {CRobj} from '../../../manage/baseClass'
import * as db from '../../../../db/db_pzhjj'

let route = new CRobj();

route.get('/api/sys/csgl/sysconfig/getsysconfigs', async (ctx, next) => {
    try
    {
        let params=ctx.query
        let start =(params.currentPage-1)*params.size+1
        let end =params.currentPage*params.size
        var sqls = []
        sqls.push(db.query(" select * from ( select rownum as xh,t.* from  ( select * from configbase where lx='系统'  order by id) t)  where xh>=" + start +" and xh<=" + end +" order by xh"))
        sqls.push(db.query("select count(*) as count from configbase  where lx='系统'"))
        let result = await Promise.all(sqls)
        let ret = new  IChttp.CRet(1, 'count');
        ret.data =result [0]
        ret["count"] =result[1][0].COUNT
        ctx.response.body = ret;
    } catch (e) {
        const ret = new  IChttp.CRet(0,`${ctx.request.url} 错误: ${e}`);
        ret.msg = e.toString();
        ctx.response.body = ret
    }
})
route.post('/api/sys/csgl/sysconfig/delsysconfig', async (ctx, next) => {
    try
    {
        let config=ctx.request.body
        let model = await db.model({table: 'configbase',id: 'id'});
        let entities =await model({
            id: config.ID
        })
        await entities.delete()
        let ret = new  IChttp.CRet(1);
        ctx.response.body = ret;
    } catch (e) {
        const ret = new  IChttp.CRet(0,`${ctx.request.url} 错误: ${e}`);
        ret.msg = e.toString();
        ctx.response.body = ret
    }
})

route.post('/api/sys/csgl/sysconfig/updatesysconfig', async (ctx, next) => {
    try
    {
        let con=ctx.request.body
        delete con['VALUE']
        delete con['XH']
        let model = await db.model({table: 'configbase',id: 'ID'});
        let entities =await model(con)
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