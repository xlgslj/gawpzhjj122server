import * as IChttp from '../../../manage/IChttp'
import {CRobj} from '../../../manage/baseClass'
import * as db from '../../../../db/db_pzhjj'

let route = new CRobj();

route.get('/api/sys/qxgl/role/getroles', async (ctx, next) => {
    try
    {
        let params=ctx.query
        let start =(params.currentPage-1)*params.size+1
        let end =params.currentPage*params.size
        var sqls = []
        sqls.push(db.query(" select * from ( select rownum as xh,t.* from  ( select * from roles  where name like '%" + params.name + "%' order by id) t)  where xh>=" + start +" and xh<=" + end +" order by xh"))
        sqls.push(db.query("select count(*) as count from roles"))
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

route.post('/api/sys/qxgl/role/addrole', async (ctx, next) => {
    try
    {
        let role=ctx.request.body
        role.ID = await db.maxid();
        role.dataParser({
            ids: 'string'
        })
        let model = await db.model({table: 'roles',id: 'id'});
        let entities =await model(role)
        await entities.insert()
        let ret = new  IChttp.CRet(1);
        ret.data = role.ID
        ctx.response.body = ret;
    } catch (e) {
        const ret = new  IChttp.CRet(0,`${ctx.request.url} 错误: ${e}`);
        ret.msg = e.toString();
        ctx.response.body = ret
    }
})
route.post('/api/sys/qxgl/role/delrole', async (ctx, next) => {
    try
    {
        let role=ctx.request.body
        let model = await db.model({table: 'roles',id: 'id'});
        let entities =await model({
            id: role.ID
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
route.post('/api/sys/qxgl/role/updaterole', async (ctx, next) => {
    try
    {
        let role=ctx.request.body
        delete role['XH']
        let model = await db.model({table: 'roles',id: 'ID'});
        let entities =await model(role)
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