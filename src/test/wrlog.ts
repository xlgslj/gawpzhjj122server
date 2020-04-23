import * as db from '../db/db_pzhjj'
import * as sysvar from '../config/sysvar'

(async () => {
    try {
        let log = {
            CONN:"支队筛选通过一条证据",
            CZLX:"支队筛选通过",
            DW:"攀枝花市公安局交通警察支队",
            HPHM:"川D57598",
            HPZL:"01:大型汽车",
            KEY:"5104TC1001045261",
            NAME:"系统管理员",
            SJ: new Date(),
            WFDD:"二滩大道桐雅线金河修理厂路段",
            WFSJ: new Date(),
            WFXW:"",
            XH:"1000000000001529"
        }

        let model = await db.model({table: `${sysvar.wztcDb}LOG2`,id: 'XH'});
        let entities =await model(log)
        await entities.insert()
        console.log('ok')
    } catch (e) {
        console.log(e)
    }
})()