var paths = [
    '/api/login/login',
    '/photo0/*',
    '/photo1/*'
]

var exited = function (path) {
    var o=paths.find(item=>{
       if (item.endsWith("/*")) {
            let i = item.substr(0, item.length-1)
            //let v = path.indexOf(i)
            return path.indexOf(i) === 0
       } else {
            return path.indexOf(item) === 0
       }
    })
    return o===undefined?false:true
}

export {exited}