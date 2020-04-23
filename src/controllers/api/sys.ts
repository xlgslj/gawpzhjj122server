
import * as IChttp from '../manage/IChttp'
import {CRobj} from '../manage/baseClass'
import * as dbutil from '../../db/db_pzhjj'
import token from '../../utils/tools/token'
import * as sysconfig from '../../config/sysconfig'
let route = new CRobj();

/**
 * 获取所有菜单，为动态创建组件用
 */
route.get('/api/sys/getinitdata', async (ctx, next) => {
    try
    {
        let tokendata = JSON.parse(token.decodeToken(ctx.headers.token)["payload"].data)
        const dwno = tokendata.DWNO
        
        let codes = await sysconfig.getrows('codes',(item) => {
            return true
          })

        let data = codes

        let cjmjs = await sysconfig.getrows('cjmjs',(() => {
          if (dwno === '510400000000') {
            return (item) => {
              return true
            }
          } else {
            return (item) => {
              return item.C_DWDM === dwno
            }
          }})() )
        for (let i in cjmjs) {
            cjmjs[i]= {
             LX: 'cjmj',
             CODE: cjmjs[i].C_NAME,
             VAL: cjmjs[i].C_NAME
           }
        }
        data = data.concat(cjmjs)
    
        let wfdds = await sysconfig.getrows('wfdds',(() => {
          if (dwno === '510400000000') {
            return (item) => {
              return true
            }
          } else {
            return (item) => {
              return item.CJJG === dwno
            }
          }})() )
        for (let i in wfdds) {
            wfdds[i]= {
             LX: 'wfdd',
             CODE: wfdds[i].WZDD,
             VAL: wfdds[i].ROADNAME
           }
        }
        data = data.concat(wfdds)
    
        let wfxws = await sysconfig.getrows('wfxws',(item) => {
          return true
        })
    
        for (let i in wfxws) {
          wfxws[i]= {
           LX: 'wfxw',
           CODE: wfxws[i].WZXWNO,
           VAL: wfxws[i].WZXW
         }
        }
        data = data.concat(wfxws)

        let ret = new  IChttp.CRet(1);
        ret.data = data
        ctx.response.body = ret;
    } catch (e) {
        const ret = new  IChttp.CRet(0,`${ctx.request.url} 错误: ${e}`);
        ret.msg = e.toString();
        ctx.response.body = ret
    }
})
export {route}