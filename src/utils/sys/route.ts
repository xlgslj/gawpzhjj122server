import * as db from '../../db/db_pzhjj'

export const getgis = async (routes) => {
    try {
        if (!routes.length) {
            return []
        } else {
            let sqls = [] 
            routes.forEach(d => {
                sqls.push(db.query("select * from BAS_TRANSPCORP_GIS where xh ='" + d.ROUTEXH + "' order by to_number(sort)"))
            });
            let res = await Promise.all(sqls)
            for (let i =0; i < res.length; i++) {
                Object.assign(routes[i], {GIS: res[i]})
            }
            return routes
        }
    } catch {
        return []
    }
}
