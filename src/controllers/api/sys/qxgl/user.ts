import * as IChttp from '../../../manage/IChttp'
import {CRobj} from '../../../manage/baseClass'
import * as db from '../../../../db/db_pzhjj'
import * as  crypto from '../../../../utils/tools/crypt'
let route = new CRobj();

route.get('/api/sys/qxgl/user/getusers', async (ctx, next) => {
    try
    {
        let params=ctx.query
        let start =(params.currentPage-1)*params.size+1
        let end =params.currentPage*params.size
        var sqls = []
        let where = " where name like '%"
        + params.name + "%' and loginname like '%" + params.loginname + "%' and dwno like '%" + params.dwno
        + "%'"
        sqls.push(db.query(" select * from ( select rownum as xh,t.* from  ( select * from userdb " + where + " order by id) t)  where xh>=" + start +" and xh<=" + end +" order by xh"))
        sqls.push(db.query("select count(*) as count from userdb" + where))
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


route.post('/api/sys/qxgl/user/adduser', async (ctx, next) => {
    try
    {
        let user=ctx.request.body
        user.ID = await db.maxid();
        user.jgdws = '[]'
        user.fastmenu = '[]'
        user.pwd = crypto.des.encrypt('888888')
        user.dataParser( {
            IPXZ: 'string',
            qxs: 'string'
        })
        let model = await db.model({table: 'userdb',id: 'id'});
        let entities =await model(user)
        await entities.insert()


        let ret = new  IChttp.CRet(1);
        ret.data = user.ID
        ctx.response.body = ret;
    } catch (e) {
        const ret = new  IChttp.CRet(0,`${ctx.request.url} 错误: ${e}`);
        ret.msg = e.toString();
        ctx.response.body = ret
    }
})

route.post('/api/sys/qxgl/user/updateuser', async (ctx, next) => {
    try
    {
        let user=ctx.request.body
        user.dataParser( {
            IPXZ: 'string',
            qxs: 'string'
        })
        delete user["XH"]
        let model = await db.model({table: 'userdb',id: 'ID'});
        let entities =await model(user)
        await entities.update()


        let ret = new  IChttp.CRet(1);
        ctx.response.body = ret;
    } catch (e) {
        const ret = new  IChttp.CRet(0,`${ctx.request.url} 错误: ${e}`);
        ret.msg = e.toString();
        ctx.response.body = ret
    }
})

route.post('/api/sys/qxgl/user/editpwd', async (ctx, next) => {
    try
    {
        let params=ctx.request.body
        let user = await db.query("select * from  userdb  where id ='" + params.id + "'")

        if (user[0].PWD !== crypto.des.encrypt(params.oldpwd)) throw "原密码不正确"
        user[0].PWD = crypto.des.encrypt(params.newpwd)
        let model = await db.model({table: 'userdb',id: 'ID'});
        let entities =await model(user[0])
        await entities.update()


        let ret = new  IChttp.CRet(1);
        ctx.response.body = ret;
    } catch (e) {
        const ret = new  IChttp.CRet(0,`${ctx.request.url} 错误: ${e}`);
        ret.msg = e.toString();
        ctx.response.body = ret
    }
})

route.post('/api/sys/qxgl/user/deluser', async (ctx, next) => {
    try
    {
        let user=ctx.request.body
        let model = await db.model({table: 'userdb',id: 'id'});
        let entities =await model({
            id: user.ID
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