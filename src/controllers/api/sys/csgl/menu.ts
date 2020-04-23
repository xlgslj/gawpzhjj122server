import * as IChttp from '../../../manage/IChttp'
import {CRobj} from '../../../manage/baseClass'
import * as db from '../../../../db/db_pzhjj'

let route = new CRobj();

route.post('/api/sys/csgl/menu/addmenu', async (ctx, next) => {
    try
    {
        let menu=ctx.request.body
        menu.ID = await db.maxid();
        let model = await db.model({table: 'menudb',id: 'id'});
        let entities =await model(menu)
        await entities.insert()


        let ret = new  IChttp.CRet(1);
        ret.data = menu.ID
        ctx.response.body = ret;
    } catch (e) {
        const ret = new  IChttp.CRet(0,`${ctx.request.url} 错误: ${e}`);
        ret.msg = e.toString();
        ctx.response.body = ret
    }
})

route.post('/api/sys/csgl/menu/delmenu', async (ctx, next) => {
    try
    {
        let menu=ctx.request.body
        let model = await db.model({table: 'menudb',id: 'id'});
        let entities =await model({
            id: menu.ID
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

route.post('/api/sys/csgl/menu/updatemenu', async (ctx, next) => {
    try
    {
        let menu=ctx.request.body
        delete menu['children']
        let model = await db.model({table: 'menudb',id: 'ID'});
        let entities =await model(menu)
        await entities.update()


        let ret = new  IChttp.CRet(1);
        ctx.response.body = ret;
    } catch (e) {
        const ret = new  IChttp.CRet(0,`${ctx.request.url} 错误: ${e}`);
        ret.msg = e.toString();
        ctx.response.body = ret
    }
})

route.post('/api/sys/csgl/menu/movemenu', async (ctx, next) => {
    try
    {
        let menus=ctx.request.body
        let sql = []
        menus.forEach(async item => {
            let model = await db.model({table: 'menudb',id: 'ID'});
            let entities =await model(item)
            sql.push(entities.update())
        });
         await Promise.all(sql)


        let ret = new  IChttp.CRet(1);
        ctx.response.body = ret;
    } catch (e) {
        const ret = new  IChttp.CRet(0,`${ctx.request.url} 错误: ${e}`);
        ret.msg = e.toString();
        ctx.response.body = ret
    }
})

route.get('/api/sys/csgl/menu/getmenus', async (ctx, next) => {
    try
    {
        let meuns = await db.query('select * from menudb   order by pid,sort');
        let ret = new  IChttp.CRet(1);
        ret.data = meuns
         ctx.response.body = ret;
    } catch (e) {
        const ret = new  IChttp.CRet(0,`${ctx.request.url} 错误: ${e}`);
        ret.msg = e.toString();
        ctx.response.body = ret
    }
})

export {route}