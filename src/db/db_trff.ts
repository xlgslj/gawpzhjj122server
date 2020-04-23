const sworm = require('sworm');
import * as ora from 'oracledb'

let pool = null

  const getpool = async () => {
      try {
        if (!pool) {
          pool = await ora.createPool({
            user: "trff_pzh",
            password: 'v222587',
            connectString: '80.7.32.190:1521/orcl'
          });
        } 
        return pool
      } catch (e) {

      }
  }

  const getdb = async () => {
    try {
      let config ={
        driver: 'oracle',
        config: {
          pool: null,
          options: {
            maxRows: 1000
          }
        }
      }
      config.config.pool = await getpool()
      const db = sworm.db();
      await db.connect(config)
      return db
    } catch (e) {
      return null
    }
  }

  const query = async (sql) => {
    const db = await getdb()
    try {
      let result = await db.query(sql)
      await db.close()
      return result
    } catch (e) {
      if(db) await db.close()
      throw e
    }
  }

  export {query}

  export async function maxid () {
    let rs = await query("select autoinc.nextval from dual")
    return `${rs[0]["NEXTVAL"]}`
  }

  export async function  model (table) {
    let db =  await getdb()
    let m = db.model(table)
    return async function (enobj){
      let Entities = m(enobj)
      let oldinsert =Entities.__proto__ .insert
      Entities.__proto__ .insert = async function () {
        try
        {
          let r=await oldinsert.call(this)
          await db.close()
        } catch (e) {
          if(db) await db.close()
          throw e
        }
      }
      let oldupdate =Entities.__proto__ .update
      Entities.__proto__ .update = async function () {
        try {
          let r=await oldupdate.call(this)
          await db.close()
        } catch (e) {
          if(db) await db.close()
          throw e
        }
      } 
      Entities.__proto__ .delete = async function () {
        try {
          let p = []
          for(let k in enobj) {
            p.push(`${k}=@${k}`)
          }
          let where = ` where ${p.join(' and ')}`
          let r = await db.query(`delete from ${table.table} ${where}`, enobj, {statement: true})
          await db.close()
          return r
        } catch (e) {
          if(db) await db.close()
          throw e        
        }
      }    
      return Entities
    }
  }
  