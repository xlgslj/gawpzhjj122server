import * as IChttp from '../../manage/IChttp'
import {CRobj} from '../../manage/baseClass'
import * as db from '../../../db/db_pzhjj'
import * as getveh from '../../../utils/sys/getveh'
import * as jcxxpt from '../../../db/model/jcxxpt'

let route = new CRobj();

route.post('/api/jcxxpt/veh/bindunit', async (ctx, next) => {
    try
    {
        let params=ctx.request.body
        let model = await db.model({table: 'BAS_TRANSPCORP_VEH',id: 'XH'});
        let entities =await model({
            XH: params.xh,
            QYBH: params.qybh
        })
        await entities.update()

        let ret = new  IChttp.CRet(1);
        ctx.response.body = ret;
    } catch (e) {
        const ret = new  IChttp.CRet(0,`${ctx.request.url} 错误: ${e}`);
        ret.msg = e.toString();
        ctx.response.body = ret
    }
})

route.post('/api/jcxxpt/veh/binddrv', async (ctx, next) => {
    try
    {
        let params=ctx.request.body
        let model = await db.model({table: 'BAS_TRANSPCORP_DRV_VEH',id: 'XH'});
        let entities =await model({
            XH: params.xh,
            SFZMHM: params.sfzmhm,
            JLZT: '1'
        })
        await entities.insert()

        let ret = new  IChttp.CRet(1);
        ctx.response.body = ret;
    } catch (e) {
        const ret = new  IChttp.CRet(0,`${ctx.request.url} 错误: ${e}`);
        ret.msg = e.toString();
        ctx.response.body = ret
    }
})

route.post('/api/jcxxpt/veh/unbinddrv', async (ctx, next) => {
    try
    {
        let params=ctx.request.body
        let model = await db.model({table: 'BAS_TRANSPCORP_DRV_VEH',id: 'XH'});
        let entities =await model({
            XH: params.xh,
            SFZMHM: params.sfzmhm
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


route.post('/api/jcxxpt/veh/add', async (ctx, next) => {
    try
    {
        let params=ctx.request.body
        params.dataParser({
            BXZZRQ: 'date',
            CCDJRQ: 'date',
            QZBFQZ: 'date',
            YXQZ:'date'
        })
        let model = await db.model({table: 'BAS_TRANSPCORP_VEH',id: 'XH'});
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


route.post('/api/jcxxpt/veh/routeedit', async (ctx, next) => {
    try
    {
        let data=ctx.request.body
        let sqls = []
        let model = await db.model({table: 'BAS_TRANSPCORP_VEH_ROUTE',id: 'XH'});
        let entities =await model({
            VEHXH: data.VEHXH,
            XH: data.XH,
            NAME: data.NAME,
            QD: data.QD,
            TJ1: data.TJ1,
            TJ2: data.TJ2,
            TJ3: data.TJ3,
            ZD: data.ZD,
            XZQY: data.XZQY
        })
        sqls.push(entities.update())

        data.GIS.forEach(async d => {
            let model0 = await db.model({table: 'BAS_TRANSPCORP_GIS',id: 'XH'});
            let entities0 =await model0({
                XH: d.XH,
            })
            sqls.push(entities0.delete())
            let model1 = await db.model({table: 'BAS_TRANSPCORP_GIS',id: 'XH'});
            let entities1 =await model1({
                XH: d.XH,
                SORT: d.SORT,
                JD: d.JD,
                WD: d.WD,
                LX: d.LX
            })
            sqls.push(entities1.insert())
        })
        await Promise.all(sqls)
        let ret = new  IChttp.CRet(1);
        ret.data = data
        ctx.response.body = ret;
    } catch (e) {
        const ret = new  IChttp.CRet(0,`${ctx.request.url} 错误: ${e}`);
        ret.msg = e.toString();
        ctx.response.body = ret
    }
})

route.post('/api/jcxxpt/veh/routeadd', async (ctx, next) => {
    try
    {
        let data=ctx.request.body
        let maxid = await db.maxid();

        data.XH = maxid
        data.GIS.forEach(d => {
          d.XH = maxid
        })

        let sqls = []
        let model = await db.model({table: 'BAS_TRANSPCORP_VEH_ROUTE',id: 'XH'});
        let entities =await model({
            VEHXH: data.VEHXH,
            XH: data.XH,
            NAME: data.NAME,
            QD: data.QD,
            TJ1: data.TJ1,
            TJ2: data.TJ2,
            TJ3: data.TJ3,
            ZD: data.ZD,
            XZQY: data.XZQY
        })
        sqls.push(entities.insert())

        data.GIS.forEach(async d => {
            let model1 = await db.model({table: 'BAS_TRANSPCORP_GIS',id: 'XH'});
            let entities1 =await model1({
                XH: d.XH,
                SORT: d.SORT,
                JD: d.JD,
                WD: d.WD,
                LX: d.LX
            })
            sqls.push(entities1.insert())
        })
        await Promise.all(sqls)
        let ret = new  IChttp.CRet(1);
        ret.data = data
        ctx.response.body = ret;
    } catch (e) {
        const ret = new  IChttp.CRet(0,`${ctx.request.url} 错误: ${e}`);
        ret.msg = e.toString();
        ctx.response.body = ret
    }
})

route.post('/api/jcxxpt/veh/routedel', async (ctx, next) => {
    try
    {
        let params=ctx.request.body
        let model = await db.model({table: 'BAS_TRANSPCORP_VEH_ROUTE',id: 'XH'});
        let entities =await model({
            XH: params.XH
        })
        await entities.delete()

        let model1 = await db.model({table: 'BAS_TRANSPCORP_GIS',id: 'XH'});
        let entities1 =await model1({
            XH: params.XH
        })
        await entities1.delete()

        let ret = new  IChttp.CRet(1);
        ctx.response.body = ret;
    } catch (e) {
        const ret = new  IChttp.CRet(0,`${ctx.request.url} 错误: ${e}`);
        ret.msg = e.toString();
        ctx.response.body = ret
    }
})


export {route}