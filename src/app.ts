import * as koa from 'koa';
import * as bodyParser from 'koa-bodyparser'
import * as wswserver from './wssserver';
import {LoadRouter} from './controllers/manage/router'
import * as root from './server/root'
import tokenapp from './utils/tools/token'

  // 创建一个Koa对象表示web app本身:
  const app =new koa();
  //解析POST请求中数据
  app.use(bodyParser());

  //自定义中间件，保留
  app.use(async (ctx, next) => {
    let token = ctx.headers.token;
    
    if (!tokenapp.checkToken(token,ctx.request.path)) {
		let ret={
            status : 0,
            msg:'Token 不存在或已过期'
        }
        ctx.response.body = ret
    } else {
		let v=tokenapp.decodeToken(token)
		// console.log(v)
		if(v){
			//如果token有效且不为空,续订token
            ctx.set("token", tokenapp.createToken(v.payload["data"]))
        }
        await next();
    }   
  });

(async ()=> {
    //动态加载路由
    let route = await LoadRouter();
    app.use(route)
    app.listen(8001)
     //启动WSS服务器
     wswserver.run()   
    console.log('服务器启动成功，端口：8001')
    root.run()
})()