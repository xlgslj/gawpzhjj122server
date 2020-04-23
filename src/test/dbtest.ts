import * as sworm from 'sworm'
import * as ora from 'oracledb'
let pool = null
const getpool = async () => {
    try {
      if (!pool) {
        pool = await ora.createPool({
          user: "pzhjj",
          password: 'xlgslj',
          connectString: '10.68.173.121:1521/pzhjj'
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

function model1 (table) {
  return async function(fields) {
    let db =  await getdb()
    let model = db.model(table)
    let Entities = model(fields)
    let o ={
      db: db,
      Entities: Entities,
      insert: async function() {
        try {
          let r = await this.Entities.delete()
          await this.db.close()
          return 0
        } catch (e) {
          return e
        }

      }
    }
    return o
  }

}

function model2 (table) {
  return async function(fields) {
    let db =  await getdb()
    let model = db.model(table)

    let Entities = model(fields)
    let oldinsert = Entities.__proto__.insert
    Entities.__proto__.insert = async function() {
      let db = this.__proto__._meta.db
      console.log(db.connected)
      //let r=await oldinsert.call(this)
      let r = this.__proto__.insert
      await db.close()
      console.log(db.connected)
      return r
    }
    let oldupdate = Entities.__proto__.update
    Entities.__proto__.insert = async function() {
      let db = this.__proto__._meta.db
      console.log(db.connected)
      let r=await oldupdate.call(this)
      await db.close()
      console.log(db.connected)
      return r
    }
    return Entities
  }
}


async function  model (table) {
  let db =  await getdb()
  let m = db.model(table)
  return async function (fields){
    let Entities = m(fields)
    let oldinsert =Entities.__proto__ .insert
    Entities.__proto__ .insert = async function () {
      try
      {
        let r=await oldinsert.call(this)
        await db.close()
      } catch (e) {
        throw e
      }
    }
    let oldupdate =Entities.__proto__ .update
    Entities.__proto__ .update = async function () {
      try {
        let r=await oldupdate.call(this)
        await db.close()
      } catch (e) {
        throw e
      }
    } 
    Entities.__proto__ .delete = async function () {
      try {
        let p = []
        for(let k in fields) {
          p.push(`${k}=@${k}`)
        }
        let where = ` where ${p.join(' and ')}`
        let r = await db.query(`delete from ${table.table} ${where}`, fields, {statement: true})
        await db.close()
        return r
      } catch (e) {
        throw e        
      }
    }    
    return Entities
  }
}



let test1 = async () => {
  var person = await model({table: 'test',id: 'xh'});
  var bob =await person({txt: 'cj11111',id:78807, xh:'333'})
  console.log(await bob.delete())
}

let test2 = async () => {
  let db =  await getdb()
  var person = db.model({table: 'test', id: 'xh'});
  var bob =person({txt: 'wind', xh:'111'})
  let r = await bob.update()
  console.log(r)
}

test1()