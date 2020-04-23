import * as IChttp from '../../../manage/IChttp'
import {CRobj} from '../../../manage/baseClass'
import * as db from '../../../../db/db_pzhjj'

let route = new CRobj();

route.get('/api/sys/qxgl/bm/getallbms', async (ctx, next) => {
    try
    {    
        let bms = await db.query("select * from bmdb")
        let ret = new  IChttp.CRet(1);
        ret.data =bms
        ctx.response.body = ret;
    } catch (e) {
        const ret = new  IChttp.CRet(0,`${ctx.request.url} 错误: ${e}`);
        ret.msg = e.toString();
        ctx.response.body = ret
    }
})
route.post('/api/sys/qxgl/bm/addbm', async (ctx, next) => {
    try
    {
        let bm=ctx.request.body
        bm.ID = await db.maxid();
        let model = await db.model({table: 'bmdb',id: 'id'});
        let entities =await model(bm)
        await entities.insert()


        let ret = new  IChttp.CRet(1);
        ret.data = bm.ID
        ctx.response.body = ret;
    } catch (e) {
        const ret = new  IChttp.CRet(0,`${ctx.request.url} 错误: ${e}`);
        ret.msg = e.toString();
        ctx.response.body = ret
    }
})
route.post('/api/sys/qxgl/bm/updatebm', async (ctx, next) => {
    try
    {
        let bm=ctx.request.body
        let model = await db.model({table: 'bmdb',id: 'ID'});
        let entities =await model(bm)
        await entities.update()


        let ret = new  IChttp.CRet(1);
        ctx.response.body = ret;
    } catch (e) {
        const ret = new  IChttp.CRet(0,`${ctx.request.url} 错误: ${e}`);
        ret.msg = e.toString();
        ctx.response.body = ret
    }
})

route.post('/api/sys/qxgl/bm/delbm', async (ctx, next) => {
    try
    {
        let bm=ctx.request.body
        let model = await db.model({table: 'bmdb',id: 'id'});
        let entities =await model({
            id: bm.ID
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

export {route}